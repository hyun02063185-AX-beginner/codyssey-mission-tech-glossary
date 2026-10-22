"""Scene 02 원고·데모·그림 정합성 검사.

1. 원고(script.md)의 `<!-- demo:경로 -->` 코드 블록이 _tools/demo/의 실제 파일과 글자까지 같은지
2. 원고의 `<!-- run: 명령 | exit=N -->` 출력 블록을 실제로 실행해, 적힌 줄이 실제 출력에 같은 순서로 있고 종료 코드가 같은지
3. 그림의 실행 순서(data-step의 data-out)가 `python -m todo list --limit 3`의 학습용 출력 순서와 같은지
4. 그림 B-1의 import(data-import)가 데모 파일의 import 문(AST)과 같은지
5. 그림 B-2의 호출(data-call)이 데모 코드의 함수 호출(AST)과 같고, 번호가 소스 순서와 맞는지
6. 실행 방식 비교표(build.py RUNMODES)가 세 명령의 실제 실행 순서·__main__ 파일과 같은지

실행: python -I verify_demo.py   (데모는 학습자처럼 python 명령으로 실행한다. -I를 붙이면 현재 폴더를 찾지 않아 -m이 실패하므로 데모 실행에는 붙이지 않는다)
"""
import ast
import importlib.util
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
SCENE = os.path.dirname(HERE)
DEMO = os.path.join(HERE, "demo")
SCRIPT = os.path.join(SCENE, "script.md")
SVGS = [os.path.join(SCENE, f) for f in ("package-flow-desktop.svg", "package-flow-mobile.svg")]
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUNBUFFERED="1")
sys.stdout.reconfigure(encoding="utf-8")  # Windows 기본 콘솔 인코딩에서도 결과를 출력
fails = []


def run(cmd):
    args = cmd.split()
    if args[0] == "python":
        args[0] = sys.executable
    if "-c" in args:  # -c 뒤는 한 덩어리 코드
        i = args.index("-c")
        args = args[:i + 1] + [cmd.split("-c ", 1)[1].strip('"')]
    # 표준 출력·오류를 터미널처럼 한 흐름으로 받는다(PYTHONUNBUFFERED로 출력 순서 유지)
    p = subprocess.run(args, cwd=DEMO, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    return p.returncode, norm(p.stdout)


def norm(text):
    text = text.replace(DEMO, "…").replace(DEMO.replace("\\", "/"), "…")
    text = re.sub(r"[A-Za-z]:\\[^\s'\"]*python(\.exe)?", "python", text)
    return text.replace("\\", "/")


def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond:
        fails.append(msg)


src = open(SCRIPT, encoding="utf-8").read()

# 1. 코드 블록 = 데모 파일
blocks = re.findall(r"<!-- demo:(\S+) -->\s*```python\n(.*?)```", src, re.S)
for rel, code in blocks:
    with open(os.path.join(DEMO, rel), encoding="utf-8") as f:
        check(f.read() == code, f"원고 코드 = 데모 파일: {rel}")
check(len(blocks) == 6, f"원고의 데모 코드 블록 6개(main.py, todo 4개, notes/hello.py): {len(blocks)}개")

# 2. 출력 블록 = 실제 실행
runs = re.findall(r"<!-- run: (.+?) \| exit=(\d+) -->\s*```text\n(.*?)```", src, re.S)
for cmd, code, block in runs:
    lines = block.rstrip("\n").split("\n")
    assert lines[0] == f"$ {cmd}", f"블록 첫 줄이 명령과 다름: {lines[0]!r}"
    rc, out = run(cmd)
    actual = out.rstrip("\n").split("\n")
    pos, ok = 0, True
    for ln in lines[1:]:
        if ln.strip() == "…":
            continue
        while pos < len(actual) and actual[pos].rstrip() != ln.rstrip():
            pos += 1
        if pos == len(actual):
            ok = False
            print("     없음:", ln)
            break
        pos += 1
    check(ok and rc == int(code), f"실행 출력 일치: {cmd} (종료 코드 {rc})")
check(len(runs) >= 8, f"원고의 실행 출력 블록 {len(runs)}개")

# 3~5. 그림
_, main_out = run("python -m todo list --limit 3")
tags = [m.group(1) for m in re.finditer(r"^\[(?:불러올 때|호출될 때)\] (\S+)", main_out, re.M)]
spec = importlib.util.spec_from_file_location("s2build", os.path.join(HERE, "build.py"))
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)


def module_imports(rel):
    tree = ast.parse(open(os.path.join(DEMO, rel), encoding="utf-8").read())
    names = []
    for node in tree.body:
        if isinstance(node, ast.Import):
            names += [a.name for a in node.names]
        elif isinstance(node, ast.ImportFrom):
            names.append(node.module)
    return names


short = {"sys": "sys", "argparse": "argparse", "todo.cli": "cli", "todo.actions": "actions"}
expect_imports = sorted(f"{m}>{short[n]}" for m, rel in (("__main__", "todo/__main__.py"), ("cli", "todo/cli.py"), ("actions", "todo/actions.py"))
                        for n in module_imports(rel))


def calls_in(node):
    """노드 안의 함수 호출 이름을 소스 순서대로. print·sys.exit는 학습용 출력·종료라 뺀다."""
    out = []
    for n in ast.walk(node):
        if isinstance(n, ast.Call):
            name = n.func.attr if isinstance(n.func, ast.Attribute) else getattr(n.func, "id", "")
            if name not in ("print", "exit", "ArgumentParser", "add_subparsers", "add_parser", "add_argument"):
                out.append((n.lineno, n.col_offset, name))
    return [x[2] for x in sorted(out)]


main_tree = ast.parse(open(os.path.join(DEMO, "todo/__main__.py"), encoding="utf-8").read())
cli_tree = ast.parse(open(os.path.join(DEMO, "todo/cli.py"), encoding="utf-8").read())
cli_main = next(n for n in cli_tree.body if isinstance(n, ast.FunctionDef) and n.name == "main")
fn_id = {"main": "main", "build_parser": "build", "parse_args": "parse", "show_tasks": "show"}
src_calls = [("entry", fn_id[c]) for c in calls_in(ast.Module(body=[n for n in main_tree.body if not isinstance(n, ast.FunctionDef)], type_ignores=[]))]
src_calls += [("main", fn_id[c]) for c in calls_in(cli_main)]
expect_calls = [f"{a}>{c}@{5 + i}" for i, (a, c) in enumerate(src_calls)]

for path in SVGS:
    name = os.path.basename(path)
    root = ET.parse(path).getroot()
    steps = [g for g in root.iter() if g.get("data-step")]
    outs = [g.get("data-out") for g in steps if g.get("data-out")]
    check(outs == tags, f"{name}: 실행 순서 = 실제 출력 순서 {tags}")
    check([g.get("data-step") for g in steps] == [str(i) for i in range(1, 9)], f"{name}: 단계 번호 1~8 차례")
    imps = sorted(e.get("data-import") for e in root.iter() if e.get("data-import"))
    check(imps == expect_imports, f"{name}: import = 데모 소스 {expect_imports}")
    calls = sorted(e.get("data-call") for e in root.iter() if e.get("data-call"))
    check(calls == sorted(expect_calls), f"{name}: 호출·번호 = 데모 소스 {expect_calls}")

# 6. 실행 방식 비교표
for cmd, order, mainf, _ in b.RUNMODES:
    rc, out = run(cmd.replace("…", "list --limit 1"))
    loaded = re.findall(r"^\[불러올 때\] (\S+) — .*__name__ = '([^']+)'", out, re.M)
    files = [os.path.basename(f) for f, _ in loaded]
    want = [x.strip() for x in order.split("→")]
    main_files = [os.path.basename(f) for f, n in loaded if n == "__main__"]
    check(rc == 0 and files[:len(want)] == want and main_files == [mainf], f"실행 방식 비교: {cmd} → {files[:len(want)]}, __main__ = {main_files}")

print(f"\n결과: {'FAIL ' + str(len(fails)) + '건' if fails else 'PASS'}")
sys.exit(1 if fails else 0)
