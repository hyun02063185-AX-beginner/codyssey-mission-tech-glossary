"""B3-2 미션 스토리 시연 근거 만들기. AI API는 호출하지 않는다.

실제 B3-2 실행(2026-10-20)에서 AI가 설명한 변경 — docs/learning/02-python-ai-api.md에 실습 메모 한 줄 추가 —
을 임시 복제본에서 다시 만들고, B3-2의 실제 함수(collect_changes · prepare_context · validators)를 그대로 실행해
결과를 ../assets/evidence/ 에 UTF-8로 남긴다. 원래 실행의 터미널 전문은 남아 있지 않으므로 이 결과는 **재현**이다.
  demo-git-output.txt     git status --short · git diff · git diff --cached (사람이 터미널에서 보는 것)
  demo-context.txt        prepare_context()가 만든, AI에게 보내는 사용자 메시지 원문
  demo-request.json       AIClient.generate()가 만드는 요청 본문과 같은 구조 (키는 헤더에만 있고 여기에는 없음)
  subprocess-results.txt  subprocess.run()의 stdout · stderr · returncode (저장소 안 / 밖)
  validator-demo.txt      검증기에 넣은 교육용 입력과 결과 (AI 응답이 아님)
실행: python -I capture_demo.py <Codyssey_B3-2 경로>   (기준 커밋은 아래 BASE·SOURCE)
"""
import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets", "evidence")
BASE = "7b2c6af"  # 실제 실행 직전 커밋. 실습 메모는 그 위의 미커밋 변경이었다(be21c49에 함께 커밋됨)
SOURCE = "be21c49"  # 이 스토리가 근거로 삼은 B3-2 원격 main
MEMO = "실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다."
ANCHOR = "`python main.py commit`(macOS `python3`)을 실행한다."
TARGET = "docs/learning/02-python-ai-api.md"


def run(cwd, *args):
    r = subprocess.run(list(args), cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return r.returncode, r.stdout, r.stderr


def write(name, text):
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def main(b32):
    b32 = os.path.abspath(b32)
    head = run(b32, "git", "rev-parse", "--short", "HEAD")[1].strip()
    if head != SOURCE:
        print(f"주의: {b32}의 HEAD는 {head}이다. 기준 {SOURCE}와 다르다.")
    sys.path.insert(0, b32)
    from ai_gitgen.git_collector import GitError, collect_changes
    from ai_gitgen.prompts import COMMIT_SYSTEM, PR_SYSTEM
    from ai_gitgen.security import prepare_context
    from ai_gitgen.validators import DraftError, validate_commit, validate_pr

    with tempfile.TemporaryDirectory() as tmp:
        repo = os.path.join(tmp, "Codyssey_B3-2")
        subprocess.run(["git", "clone", "-q", b32, repo], check=True)
        subprocess.run(["git", "checkout", "-q", "-B", "main", BASE], cwd=repo, check=True)
        path = os.path.join(repo, TARGET)
        raw = open(path, "rb").read()
        nl = "\r\n" if b"\r\n" in raw else "\n"  # 체크아웃된 줄바꿈을 그대로 둔다(diff에 줄바꿈 변화가 섞이지 않게)
        text = raw.decode("utf-8")
        assert text.count(ANCHOR + nl) == 1, "기준 문단을 찾지 못했다"
        text = text.replace(ANCHOR + nl, ANCHOR + nl + nl + MEMO + nl)
        open(path, "wb").write(text.encode("utf-8"))

        git = lambda *a: run(repo, "git", "-c", "core.quotepath=false", *a)
        out = [f"# 재현: B3-2 {BASE} + 실습 메모 한 줄 (미커밋). 원래 실행의 터미널 전문은 없다.", ""]
        for cmd in (("status", "--short"), ("diff",), ("diff", "--cached")):
            code, so, se = git(*cmd)
            out += [f"$ git {' '.join(cmd)}", so.rstrip("\n") if so.strip() else "(출력 없음)", ""]
        write("demo-git-output.txt", "\n".join(out))

        changes = collect_changes(__import__("pathlib").Path(repo))
        context = prepare_context(changes)
        write("demo-context.txt", context + "\n")

        payload = {"model": "gpt-5-mini", "messages": [
            {"role": "system", "content": COMMIT_SYSTEM}, {"role": "user", "content": context}]}
        body = json.dumps(payload, ensure_ascii=False)
        write("demo-request.json", json.dumps({
            "_note": "AIClient.generate()가 commit 명령에서 만드는 요청 본문과 같은 구조. 모델은 사용자 실제 실행 설정(gpt-5-mini). "
                     "API 키는 Authorization 헤더로만 가고 본문에는 없다. pr 명령은 system만 PR_SYSTEM으로 바뀐다.",
            "method": "POST", "url": "https://copa.codyssey.kr/v1/chat/completions",
            "headers": {"Authorization": "Bearer [환경변수 CODYSSEY_API_KEY · 기록하지 않음]", "Content-Type": "application/json"},
            "body_bytes_utf8": len(body.encode("utf-8")), "context_chars": len(context), "pr_system_chars": len(PR_SYSTEM),
            "body": payload}, ensure_ascii=False, indent=2) + "\n")

        lines = []
        outside = os.path.join(tmp, "not-a-repo")
        os.makedirs(outside)
        for label, cwd, cmd in (("저장소 안", repo, ("status", "--short")), ("저장소 밖", outside, ("status", "--short"))):
            code, so, se = run(cwd, "git", "-c", "core.quotepath=false", *cmd)
            lines += [f"[{label}] subprocess.run(['git', '-c', 'core.quotepath=false', 'status', '--short'])",
                      f"  returncode = {code}", f"  stdout     = {so!r}", f"  stderr     = {se!r}", ""]
        try:
            collect_changes(__import__("pathlib").Path(outside))
        except GitError as exc:
            lines.append(f"[저장소 밖] collect_changes() → GitError: {exc}")
        write("subprocess-results.txt", "\n".join(lines) + "\n")

        lines = ["# 교육용 입력으로 검증기를 실행한 결과. 실제 AI 응답이 아니다.", ""]
        for title in ("수정", "학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요"):
            try:
                validate_commit(title)
                lines.append(f"validate_commit({title!r}) → 통과")
            except DraftError as exc:
                lines.append(f"validate_commit({title!r}) → DraftError: {exc}")
        sample = ("Title: docs(learning): AI 생성 커밋 메시지 검토 안내 추가\n## Why\n- 교육용 입력\n## What\n- 교육용 입력\n"
                  "## How to Test\n- 모든 테스트를 통과했습니다")
        lines += ["", "validate_pr(How to Test에 '모든 테스트를 통과했습니다'라고 쓴 입력) →", validate_pr(sample)]
        bad = sample.replace("## Why\n- 교육용 입력", "## Why\n- 테스트를 통과했다")
        try:
            validate_pr(bad)
        except DraftError as exc:
            lines += ["", f"validate_pr(Why에 '테스트를 통과했다'라고 쓴 입력) → DraftError: {exc}"]
        write("validator-demo.txt", "\n".join(lines) + "\n")
    print(f"evidence → {os.path.relpath(OUT)} (context {len(context)}자)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("사용법: python -I capture_demo.py <Codyssey_B3-2 경로>")
    main(sys.argv[1])
