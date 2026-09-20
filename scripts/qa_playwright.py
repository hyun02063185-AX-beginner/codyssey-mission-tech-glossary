#!/usr/bin/env python3
"""Playwright 를 안전한 포트에서, 확실히 이 저장소의 앱을 상대로 실행한다.

왜 필요한가
-----------
두 번 서로 다른 이유로 막혔다.

1. 4173 포트를 다른 프로젝트가 이미 쓰고 있었는데, playwright.config.ts 의
   reuseExistingServer 때문에 그 서버를 그대로 재사용해 **엉뚱한 앱**을 상대로
   테스트가 돌았다. 실패도 통과도 믿을 수 없는 상태였다.
2. 빈 포트를 골랐는데도 EACCES 가 났다. 점유가 아니라 Windows 가 예약해 둔
   포트 범위(netsh interface ipv4 show excludedportrange protocol=tcp)에
   들어 있었기 때문이다.

제품 설정(playwright.config.ts)은 고치지 않는다. 대신 실행 절차를 여기로 옮긴다.
이 스크립트는 안전한 포트를 고르고, 서버를 직접 띄우고, 그 서버가 정말 이
저장소의 앱인지 확인한 뒤에만 Playwright 를 돌린다.

사용법
------
    python scripts/qa_playwright.py                # 안전한 포트를 알아서 고른다
    python scripts/qa_playwright.py --port 6421    # 포트를 지정한다
    python scripts/qa_playwright.py --check-only   # 포트만 고르고 끝낸다

OS 별 분기를 더 늘리지 않는다. Windows 예약 범위 확인이 실패하면 경고만 남기고
실제 bind 시도로 판정한다. 결국 마지막 판정은 늘 '열리는가'이다.

실제로 이 판단이 맞았다. 이 컴퓨터에서 netsh 가 알려 주는 TCP 예약 범위는 15개인데
(4737-5240, 5388-5887 등) 6421·6733·7311·7642 는 거기에 없으면서도 bind 에서
EACCES 가 난다. Hyper-V 쪽이 따로 잡아 두는 범위로 보인다. 즉 netsh 결과는 참고이고
믿을 수 있는 판정은 bind 시도뿐이다.
"""
import argparse
import http.client
import json
import re
import socket
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = "127.0.0.1"
# 4173 은 vite preview 기본값이라 다른 프로젝트와 부딪히기 쉽다. 후보에서 뺀다.
CANDIDATES = [6421, 6733, 7311, 7642, 8123, 8456, 9271, 9584]
APP_TITLE = "코디세이 기술용어 사전"
MARKER_FILE = "/src/data/generated/encyclopedia-graph.json"


def excluded_ranges():
    """Windows 가 예약해 둔 TCP 포트 범위. 확인할 수 없으면 빈 목록."""
    if sys.platform != "win32":
        return []
    try:
        # netsh 는 한국어 Windows 에서 cp949 로 출력한다. 숫자만 필요하므로 바이트를
        # ASCII 호환 인코딩으로 풀어 디코딩 실패 자체를 없앤다.
        raw = subprocess.run(["netsh", "interface", "ipv4", "show", "excludedportrange", "protocol=tcp"],
                             capture_output=True, timeout=20).stdout or b""
        out = raw.decode("latin-1")
    except Exception as error:  # noqa: BLE001 - 확인 실패는 치명적이지 않다
        print(f"  (예약 포트 범위를 확인하지 못했습니다: {error}. bind 시도로만 판정합니다.)")
        return []
    return [(int(a), int(b)) for a, b in re.findall(r"^\s*(\d+)\s+(\d+)\s*$", out, re.MULTILINE)]


def usable(port, ranges):
    if any(low <= port <= high for low, high in ranges):
        return False, "OS 예약 범위"
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            probe.bind((HOST, port))
        except OSError as error:
            return False, f"bind 실패 ({error.errno})"
    return True, ""


def pick_port(requested, ranges):
    for port in ([requested] if requested else []) + CANDIDATES:
        ok, why = usable(port, ranges)
        print(f"  {port}: {'사용 가능' if ok else why}")
        if ok:
            return port
    raise SystemExit("ERROR: 쓸 수 있는 포트를 찾지 못했습니다. --port 로 직접 지정하세요.")


def fetch(port, path, timeout=3):
    conn = http.client.HTTPConnection(HOST, port, timeout=timeout)
    try:
        conn.request("GET", path)
        response = conn.getresponse()
        return response.status, response.read().decode("utf-8", "replace")
    finally:
        conn.close()


def wait_for_our_app(port, deadline=60):
    """서버가 뜨기를 기다리되, 뜬 것이 '이 저장소의 앱'인지까지 확인한다.

    제목 한 줄만 보지 않는다. 빌드해 둔 그래프 파일에 이 사전의 표식이 있는지도 본다.
    다른 프로젝트가 우연히 같은 제목을 쓰더라도 여기서 갈린다.
    """
    started = time.time()
    last = ""
    while time.time() - started < deadline:
        try:
            status, body = fetch(port, "/")
            if status == 200 and APP_TITLE in body:
                status, body = fetch(port, MARKER_FILE, timeout=20)
                if status != 200:
                    last = f"앱 표식 파일을 받지 못했습니다 (HTTP {status})"
                else:
                    graph = json.loads(body)
                    if graph.get("artifactType") == "generated-encyclopedia-graph":
                        return graph
                    last = "표식 파일의 artifactType 이 다릅니다"
            elif status == 200:
                last = "다른 앱이 이 포트에 응답하고 있습니다"
            else:
                last = f"HTTP {status}"
        except Exception as error:  # noqa: BLE001 - 아직 안 떴을 수 있다
            last = str(error)
        time.sleep(0.5)
    raise SystemExit(f"ERROR: {port} 에서 이 저장소의 앱을 확인하지 못했습니다. 마지막 상태: {last}")


def qa_config(port):
    """제품 config 를 건드리지 않기 위해, 실행용 config 를 임시 폴더에 만든다.

    직접 띄운 서버를 쓰므로 webServer 를 두지 않는다. reuseExistingServer 로 남의
    서버를 잡는 경로 자체가 없어진다.

    파일은 node_modules/.cache 아래에 둔다. 저장소 밖에 두면 @playwright/test 를
    찾지 못하고, 저장소 안 아무 데나 두면 git 에 잡힌다. 여기가 둘 다 피하는 자리다.
    """
    body = (
        "import { defineConfig } from '@playwright/test';\n"
        "export default defineConfig({\n"
        f"  testDir: {json.dumps(str(ROOT / 'playwright'))},\n"
        f"  use: {{ baseURL: 'http://{HOST}:{port}', headless: true }},\n"
        "});\n"
    )
    folder = ROOT / "node_modules" / ".cache" / "codyssey-qa"
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / "playwright.qa.config.mjs"
    path.write_text(body, encoding="utf-8")
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--port", type=int, help="쓰고 싶은 포트. 막혀 있으면 후보에서 다시 고른다.")
    parser.add_argument("--check-only", action="store_true", help="포트만 고르고 끝낸다.")
    args = parser.parse_args()

    print("1) 포트 고르기")
    port = pick_port(args.port, excluded_ranges())
    print(f"   -> {port}")
    if args.check_only:
        return 0

    print("2) 개발 서버 띄우기")
    server = subprocess.Popen(["npx", "vite", "--host", HOST, "--port", str(port), "--strictPort"],
                              cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT,
                              shell=(sys.platform == "win32"))
    try:
        print("3) 이 저장소의 앱이 맞는지 확인")
        graph = wait_for_our_app(port)
        stats = graph.get("stats", {})
        print(f"   -> 확인됨: term {stats.get('terms')} · authored edge {stats.get('authoredEdges')} · path {stats.get('paths')}")

        print("4) Playwright 실행")
        config = qa_config(port)
        result = subprocess.run(["npx", "playwright", "test", "--config", str(config)],
                                cwd=ROOT, shell=(sys.platform == "win32"))
        return result.returncode
    finally:
        stop(server)


def stop(server):
    """npx 가 낀 구조라 부모만 죽이면 vite 가 포트를 붙잡고 남는다. 자식까지 함께 정리한다."""
    if sys.platform == "win32":
        subprocess.run(["taskkill", "/PID", str(server.pid), "/T", "/F"], capture_output=True)
    server.terminate()
    try:
        server.wait(timeout=10)
    except subprocess.TimeoutExpired:
        server.kill()


if __name__ == "__main__":
    raise SystemExit(main())
