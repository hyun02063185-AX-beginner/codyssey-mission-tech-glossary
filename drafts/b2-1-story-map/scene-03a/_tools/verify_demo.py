"""Scene 03-A 원고·데모·그림 정합성 검사.

1. 원고(script.md)의 `<!-- demo:경로 -->` 코드 블록이 _tools/demo/의 실제 파일과 글자까지 같은지
2. 원고의 `<!-- run: 명령 | exit=N -->` 출력 블록을 실제로 실행해, 적힌 줄이 실제 출력에 같은 순서로 있고 종료 코드가 같은지
3. 그림 A의 코드 줄이 basics.py의 실제 줄이고, 실행 결과(data-out)·객체 상태가 실제 실행 결과와 같은지
4. 그림 B-2의 호출 순서·부른 쪽(data-call)과 return(data-return)이 `python -m todo list --limit 2` 호출 추적 결과와 같은지
5. 그림 B-3의 import(data-import)가 데모 모듈의 import 문(AST)과 같은지
6. 책임 카드의 파일과 함수 이름이 실제 데모 파일에 있는지

실행: python -I verify_demo.py   (데모는 학습자처럼 python 명령으로 실행한다)
"""
import ast
import importlib.util
import json
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
SCENE = os.path.dirname(HERE)
DEMO = os.path.join(HERE, "demo")
SCRIPT = os.path.join(SCENE, "script.md")
SVGS = [os.path.join(SCENE, f) for f in ("class-layer-desktop.svg", "class-layer-mobile.svg")]
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUNBUFFERED="1")
sys.stdout.reconfigure(encoding="utf-8")
fails = []

# 호출 추적: 데모 패키지 함수의 call/return 사건을 부른 쪽과 함께 기록한다(클래스 본문·모듈 최상위 제외)
TRACER = r'''
import json, runpy, sys
ev = []
def name(f):
    return f.f_globals.get("__name__", "") + ":" + f.f_code.co_qualname
def prof(frame, event, arg):
    mod = frame.f_globals.get("__name__", "")
    q = frame.f_code.co_qualname
    if event in ("call", "return") and mod.startswith("todo") and not q.startswith("<") and ("." in q or q[0].islower()):
        ev.append([event, name(frame), name(frame.f_back) if frame.f_back else ""])
sys.argv = ["todo", "list", "--limit", "2"]
sys.setprofile(prof)
try:
    runpy.run_module("todo", run_name="__main__", alter_sys=True)
except SystemExit:
    pass
sys.setprofile(None)
print("@@" + json.dumps(ev))
'''


def run(cmd):
    args = cmd.split()
    if args[0] == "python":
        args[0] = sys.executable
    p = subprocess.run(args, cwd=DEMO, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    return p.returncode, p.stdout.replace("\\", "/")


def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond:
        fails.append(msg)


src = open(SCRIPT, encoding="utf-8").read()
spec = importlib.util.spec_from_file_location("s3build", os.path.join(HERE, "build.py"))
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)

# 1. 코드 블록 = 데모 파일
blocks = re.findall(r"<!-- demo:(\S+) -->\s*```python\n(.*?)```", src, re.S)
for rel, code in blocks:
    with open(os.path.join(DEMO, rel), encoding="utf-8") as f:
        check(f.read() == code, f"원고 코드 = 데모 파일: {rel}")
names = sorted(rel for rel, _ in blocks)
want = sorted(["basics.py", "self_name.py", "todo/__init__.py", "todo/__main__.py", "todo/models.py", "todo/repository.py", "todo/services.py", "todo/cli.py"])
check(names == want, f"원고에 데모 파일 8개가 모두 있음: {names}")

# 2. 출력 블록 = 실제 실행
runs = re.findall(r"<!-- run: (.+?) \| exit=(\d+) -->\s*```text\n(.*?)```", src, re.S)
for cmd, code, block in runs:
    lines = block.rstrip("\n").split("\n")
    assert lines[0] == f"$ {cmd}", lines[0]
    rc, out = run(cmd)
    actual = [ln.rstrip() for ln in out.rstrip("\n").split("\n")]
    check([ln.rstrip() for ln in lines[1:]] == actual and rc == int(code), f"실행 출력 일치: {cmd} (종료 코드 {rc})")
check(len(runs) >= 5, f"원고의 실행 출력 블록 {len(runs)}개")

# 3. 그림 A의 코드·실행 결과·객체 상태
basics_lines = open(os.path.join(DEMO, "basics.py"), encoding="utf-8").read().split("\n")
for group, label in ((b.FUNC_CODE, "함수"), (b.CLASS_CODE, "클래스"), (b.OBJ_CODE, "객체 생성")):
    texts = ["".join(t for t, _ in ln) for ln in group if ln]
    check(all(t in basics_lines for t in texts), f"그림 A {label} 코드 줄 = basics.py의 실제 줄 ({len(texts)}줄)")
rc, out = run("python basics.py")
check(out.rstrip("\n").split("\n")[:3] == b.BASICS_OUT, f"그림 A 실행 결과 = python basics.py 출력 {b.BASICS_OUT}")
probe = subprocess.run([sys.executable, "-c", "import runpy, json, io, contextlib\n"
                        "with contextlib.redirect_stdout(io.StringIO()): g = runpy.run_path('basics.py')\n"
                        "print(json.dumps({k: [repr(g[k].title), str(g[k].done)] for k in ('a', 'b')}))"],
                       cwd=DEMO, env=ENV, capture_output=True, text=True, encoding="utf-8")
state = json.loads(probe.stdout)
want_state = {oid: [title, done] for oid, title, done in b.OBJECTS}
check({k: [v[0].replace("'", '"'), v[1]] for k, v in state.items()} == want_state, f"그림 A 객체 상태 = 실제 객체 {state}")
for path in SVGS:
    root = ET.parse(path).getroot()
    outs = [e.get("data-out") for e in root.iter() if e.get("data-out")]
    check(outs == b.BASICS_OUT, f"{os.path.basename(path)}: 실행 결과 표시 = 실제 출력")

# 4. 호출 순서·부른 쪽·return = 호출 추적
p = subprocess.run([sys.executable, "-c", TRACER], cwd=DEMO, env=ENV, capture_output=True, text=True, encoding="utf-8")
events = json.loads(p.stdout.split("@@", 1)[1])
fid = {"todo.cli:main": "main", "todo.cli:build_parser": "build", "todo.repository:TaskRepository.__init__": "repo",
       "todo.models:Task.__init__": "task", "todo.services:TaskService.__init__": "service",
       "todo.services:TaskService.list_tasks": "list", "todo.repository:TaskRepository.all": "all"}
calls, seen = [], set()
for ev, who, caller in events:
    if ev == "call" and who in fid and fid[who] not in seen:
        seen.add(fid[who])
        calls.append((fid.get(caller, "entry" if caller.endswith("<module>") else caller), fid[who]))
expect_calls = [f"{a}>{c}@{i + 1}" for i, (a, c) in enumerate(calls) if a != "entry"]
check(calls[0] == ("entry", "main"), f"호출 추적 첫 호출 = __main__.py → main(): {calls[0]}")
rets = [(fid[who], fid.get(caller, caller)) for ev, who, caller in events if ev == "return" and who in ("todo.repository:TaskRepository.all", "todo.services:TaskService.list_tasks")]
expect_rets = sorted({f"{a}>{'show' if c == 'main' else c}" for a, c in rets})
for path in SVGS:
    root = ET.parse(path).getroot()
    got_calls = sorted(e.get("data-call") for e in root.iter() if e.get("data-call"))
    check(got_calls == sorted(expect_calls), f"{os.path.basename(path)}: 호출·부른 쪽·번호 = 추적 {expect_calls}")
    got_rets = sorted(e.get("data-return") for e in root.iter() if e.get("data-return"))
    check(got_rets == expect_rets, f"{os.path.basename(path)}: return = 추적 {expect_rets}")

# 5. import = AST
short = {"argparse": "argparse", "todo.models": "model", "todo.repository": "repo", "todo.services": "service", "todo.cli": "cli"}
expect_imp = []
for mid, rel in (("cli", "todo/cli.py"), ("service", "todo/services.py"), ("repo", "todo/repository.py"), ("model", "todo/models.py")):
    tree = ast.parse(open(os.path.join(DEMO, rel), encoding="utf-8").read())
    for node in tree.body:
        mods = [a.name for a in node.names] if isinstance(node, ast.Import) else [node.module] if isinstance(node, ast.ImportFrom) else []
        expect_imp += [f"{mid}>{short[m]}" for m in mods]
for path in SVGS:
    root = ET.parse(path).getroot()
    got = sorted(e.get("data-import") for e in root.iter() if e.get("data-import"))
    check(got == sorted(expect_imp), f"{os.path.basename(path)}: import = 데모 소스 {sorted(expect_imp)}")

# 6. 책임 카드의 파일·이름
for lid, name, rel, duty, here, nots in b.LAYERS:
    code = open(os.path.join(DEMO, rel), encoding="utf-8").read()
    idents = re.findall(r"([A-Za-z_]+)\(", here)
    check(all(f"def {i}(" in code or f"class {i}" in code for i in idents), f"책임 카드 {name}: {rel}에 {idents} 정의")

print(f"\n결과: {'FAIL ' + str(len(fails)) + '건' if fails else 'PASS'}")
sys.exit(1 if fails else 0)
