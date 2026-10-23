"""Scene 06 원고·데모·그림 정합성 검사.

1. 원고(script.md)의 `<!-- demo:경로 -->` 코드 블록이 _tools/demo/의 실제 파일과 글자까지 같은지, 데모 파일이 모두 원고에 있는지
2. 데모를 **임시 폴더(저장소 밖)** 에 복사해 원고의 `<!-- run: … -->` 블록을 실행하고, 출력(줄 전체)과 종료 코드가 같은지.
   `vary=접두어`가 붙은 블록은 그 접두어로 시작하는 줄을 **형식**(숫자 자리)만 대조한다(실행 시간). 시간 측정 데모는 두 번 실행해 형식과 가짜 시계 결과가 매번 같은지 확인
3. 그림 A: 보인 코드 줄 = 데모의 실제 함수 소스 줄(줄 번호 그대로), '…'로 줄인 줄 = 그 범위의 원래 기능 줄(로그 줄 없음),
   반복 표시 = [로그] 줄 전부, wrapper 설명의 호출 줄 = log_calls의 실제 줄
4. 그림 B: 정의 시점·호출 시점 = when_applied.py 호출 추적(trace는 정의할 때 한 번씩, 첫 wrapper 호출보다 먼저 / wrapper는 호출마다 원래 함수를 부름),
   출력 줄 = 실행 출력
5. 그림 C: 세 경로의 받는 것 = 실제 호출 결과(dict / None / KeyError 전파), 출력 줄 = 실행 출력, 처리 예외·전파 예외의 선 모양이 다름,
   handle_app_errors의 except는 AppError 하나(AST)
6. 그림 D: 각 관심사의 출력 = 실행 출력, 표 내용 = 실제 wrapper 코드(AST: 로그는 except에서 raise, 예외 처리는 AppError만 받아 None, 시간은 clock() 두 번),
   실제 시간 숫자가 그림에 없음
7. AST: 학습용 Decorator는 모두 wrapper를 돌려주고, 인자를 받는 wrapper는 func(*args, **kwargs)로 넘기며, 공통 관심사 Decorator는 @wraps(func)
8. (선택) ledger 구현 사례: LEDGER_REPO(기본: 저장소 옆 m03-pocket-money-ledger)가 있으면 임시 폴더에서 실행해 원고 9절 확인. 없으면 SKIP
9. 저장소의 데모 폴더가 실행 전후로 같은지

실행: python -I verify_demo.py
"""
import ast
import hashlib
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
SCENE = os.path.dirname(HERE)
DEMO = os.path.join(HERE, "demo")
SCRIPT = os.path.join(SCENE, "script.md")
REPO = os.path.abspath(os.path.join(SCENE, "..", "..", ".."))
SVGS = [os.path.join(SCENE, f) for f in ("decorator-flow-desktop.svg", "decorator-flow-mobile.svg")]
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUNBUFFERED="1", PYTHONDONTWRITEBYTECODE="1")
sys.stdout.reconfigure(encoding="utf-8")
fails = []


def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond:
        fails.append(msg)


def text_of(el):
    return "".join(el.itertext())


def digest():
    out = {}
    for f in sorted(os.listdir(DEMO)):
        p = os.path.join(DEMO, f)
        out[f] = hashlib.sha256(open(p, "rb").read()).hexdigest() if os.path.isfile(p) else "dir"
    return out


before = digest()
print(f"INFO Python {platform.python_version()} ({platform.python_implementation()}), {platform.system()} {platform.release()}")

# ── 1. 원고 블록 ──────────────────────────────────────────────
script = open(SCRIPT, encoding="utf-8").read()
BLOCKS = [(m.group(1), m.group(2)) for m in re.finditer(r"<!-- (demo:\S+|run[^>]*?) -->\n```[a-z]*\n(.*?)\n```", script, re.S)]
py_files = sorted(f for f in os.listdir(DEMO) if f.endswith(".py"))
shown = []
for spec, body in BLOCKS:
    if spec.startswith("demo:"):
        shown.append(spec[5:])
        check(open(os.path.join(DEMO, spec[5:]), encoding="utf-8").read().rstrip("\n") == body, f"원고 코드 = 데모 파일: {spec[5:]}")
check(sorted(shown) == py_files, f"데모 파일 {len(py_files)}개가 모두 원고에 있음")

# ── 2. 임시 폴더에서 실행 ─────────────────────────────────────────
WORK = tempfile.mkdtemp(prefix="b21-scene06-")
for f in py_files:
    shutil.copy(os.path.join(DEMO, f), WORK)


def run(cmd, cwd=WORK, env=ENV):
    args = cmd.split()
    if args[0] == "python":
        args[0] = sys.executable
    p = subprocess.run(args, cwd=cwd, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    return p.returncode, p.stdout.replace("\r\n", "\n").rstrip("\n").split("\n")


def shape(line):
    return re.sub(r"\d", "9", line)


OUT = {}
for spec, body in BLOCKS:
    if spec.startswith("run"):
        m = re.match(r"run:\s*(.*?)\s*\|\s*exit=(\d+)(?:\s*\|\s*vary=(.*?))?\s*$", spec)
        cmd, want_exit, vary = m.group(1), int(m.group(2)), m.group(3)
        lines = body.split("\n")
        check(lines[0] == "$ " + cmd, f"run 표시 명령 = 블록 첫 줄: {cmd}")
        want = lines[1:]
        times = 2 if vary else 1
        for k in range(times):
            code, out = run(cmd)
            if vary:
                same = len(out) == len(want) and all((shape(o) == shape(w)) if w.startswith(vary) else (o == w) for o, w in zip(out, want))
                check(same and code == want_exit, f"실행 {k + 1}회째 출력·종료 코드 = 원고(‘{vary}’ 줄은 형식만): $ {cmd}")
                print(f"INFO {cmd} {k + 1}회째 시간 줄: {[o for o in out if o.startswith(vary)]}")
            else:
                check(out == want and code == want_exit, f"실행 출력·종료 코드 = 원고: $ {cmd} (exit {code})")
                if out != want:
                    print("   기대:", want, "\n   실제:", out)
        OUT[cmd.split()[1]] = out
check(len(OUT) == len(py_files) - 1, f"실행한 데모 {len(OUT)}개(deco_tools.py는 import_then_call.py가 불러옴)")

roots = {}
for svg in SVGS:
    try:
        roots[svg] = ET.parse(svg).getroot()
        check(True, f"SVG XML 구문: {os.path.basename(svg)}")
    except ET.ParseError as error:
        check(False, f"SVG XML 구문: {os.path.basename(svg)} ({error})")


def els(root, attr):
    return [e for e in root.iter() if e.get(attr) is not None]


def func_lines(fname, func):
    src = open(os.path.join(DEMO, fname), encoding="utf-8").read()
    node = next(n for n in ast.parse(src).body if isinstance(n, ast.FunctionDef) and n.name == func)
    start = min([d.lineno for d in node.decorator_list] + [node.lineno])
    return src.split("\n")[start - 1: node.end_lineno]


# ── 3. 그림 A ───────────────────────────────────────────────
for svg, root in roots.items():
    tag = os.path.basename(svg)
    groups = {e.get("data-src"): e for e in els(root, "data-src")}
    ok_all, reps_ok = True, True
    for key, g in groups.items():
        fname, func = key.split(":")
        real = func_lines(fname, func)
        covered = []
        for e in g.iter():
            if e.get("data-line"):
                n = int(e.get("data-line"))
                ok_all &= text_of(e) == real[n - 1]
                covered.append(n)
            elif e.get("data-span"):
                a, b = map(int, e.get("data-span").split("-"))
                ok_all &= text_of(e).strip().startswith("…") and not any("[로그]" in ln for ln in real[a - 1:b])
                covered += list(range(a, b + 1))
        ok_all &= sorted(covered) == list(range(1, len(real) + 1))
        n_rep = len([e for e in g.iter() if e.get("data-rep")])
        reps_ok &= n_rep == sum("[로그]" in ln for ln in real)
    check(len(groups) == 4 and ok_all, f"{tag}: 그림 A 코드 줄 = 실제 함수 소스(줄 번호 그대로), '…' 줄은 로그 없는 원래 기능 범위, 모든 줄을 빠짐없이 다룸")
    check(reps_ok, f"{tag}: '반복' 표시 = 실제 [로그] 줄 수(왼쪽 4, 오른쪽 0)")
    log_src = "\n".join(func_lines("log_decorator.py", "log_calls"))
    wraps_ = [e.get("data-wrap") for e in els(root, "data-wrap")]
    call_line = next(w for w in wraps_ if w.startswith("원래 함수="))
    check(call_line.split("=", 1)[1] in log_src and len(wraps_) == 3, f"{tag}: wrapper 설명의 호출 줄 = log_calls의 실제 줄")

# ── 4. 그림 B: 호출 추적 ──────────────────────────────────────────
TRACE = r'''
import json, runpy, sys
ev = []
def prof(frame, event, arg):
    if event == "call" and frame.f_code.co_filename.endswith("when_applied.py") and frame.f_code.co_name != "<module>":
        caller = frame.f_back.f_code.co_name if frame.f_back else ""
        info = frame.f_locals.get("func").__name__ if frame.f_code.co_name == "trace" else ""
        ev.append([frame.f_code.co_name, caller, info])
import builtins
builtins.print = lambda *a, **k: None
sys.setprofile(prof)
runpy.run_path("when_applied.py", run_name="__main__")
sys.setprofile(None)
sys.stdout.write("@@" + json.dumps(ev))
'''
p = subprocess.run([sys.executable, "-c", TRACE], cwd=WORK, env=ENV, capture_output=True, text=True, encoding="utf-8")
ev = json.loads(p.stdout.split("@@", 1)[1])
names = [e[0] for e in ev]
first_wrapper = names.index("wrapper")
traces = [e for e in ev if e[0] == "trace"]
check([t[2] for t in traces] == ["greet", "hello"] and all(names.index("trace") < first_wrapper for _ in traces)
      and names[:first_wrapper].count("trace") == 2, "추적: trace는 정의할 때 greet·hello에 한 번씩, 첫 wrapper 호출보다 먼저")
check(names.count("wrapper") == 3 and [e[1] for e in ev if e[0] in ("greet", "hello")] == ["wrapper"] * 3,
      "추적: wrapper는 호출마다 실행되고(3번), 원래 함수(greet·hello)는 언제나 wrapper가 부름")
wa = OUT["when_applied.py"]
for svg, root in roots.items():
    tag = os.path.basename(svg)
    bsteps = sorted(e.get("data-bstep") for e in els(root, "data-bstep"))
    check(bsteps == ["call:1", "call:2", "call:3", "call:4", "def:1", "def:2", "def:3"], f"{tag}: 그림 B 정의 시점 3단계 · 호출 시점 4단계")
    outs = [e.get("data-out") for e in els(root, "data-out") if "시점" in e.get("data-out") or "greet 본문" in e.get("data-out")]
    seq = [o for o in outs if o != "[정의 시점] trace(greet) 실행 → wrapper를 돌려줌"]
    i0 = wa.index(seq[0])
    check(all(o in wa for o in outs) and wa[i0: i0 + 3] == seq, f"{tag}: 그림 B 출력 = 실행 출력(앞 → 원래 함수 본문 → 뒤 순서)")
    calls = sorted(e.get("data-call") for e in els(root, "data-call") if e.get("data-call").split(">")[0] in ("orig0", "caller", "front"))
    rets = sorted(e.get("data-return") for e in els(root, "data-return") if e.get("data-return") in ("trace>wrap0", "orig1>back"))
    check(calls == ["caller>wrap1@1", "front>orig1@3", "orig0>trace@2"] and rets == ["orig1>back", "trace>wrap0"],
          f"{tag}: 그림 B 선 — 정의: 원래 함수 → trace 호출(②), trace가 wrapper를 return / 호출: greet() → wrapper(①), wrapper → 원래 함수(③), 원래 함수 return")
sw = OUT["simple_wrapper.py"]
check("감싼 뒤 greet의 이름: wrapper" in sw and "greet is original: False" in sw, "simple_wrapper.py: 감싼 뒤 이름 greet는 wrapper를 가리킴")
it = OUT["import_then_call.py"]
check(it.index("  [deco_tools · 정의 시점] trace(greet) 적용") < it.index("import 뒤 · 아직 greet()를 호출하지 않음") < it.index("  [호출 시점] wrapper → greet"),
      "import_then_call.py: 적용은 import할 때, wrapper는 호출할 때")

# ── 5. 그림 C ───────────────────────────────────────────────
PATHS = r'''
import json, sys
src = open("error_decorator.py", encoding="utf-8").read()
ns = {}
exec(compile(src.split("\nitems = ")[0], "error_decorator.py", "exec"), ns)
import builtins
builtins.print = lambda *a, **k: None
items = [{"id": 1, "category": "식비", "amount": 8000}]
r = {"ok": type(ns["find_transaction"](items, 1)).__name__, "handled": repr(ns["find_transaction"](items, 9))}
try:
    ns["read_amount"]({"id": 2})
    r["propagate"] = "returned"
except KeyError:
    r["propagate"] = "KeyError"
sys.stdout.write("@@" + json.dumps(r))
'''
p = subprocess.run([sys.executable, "-c", PATHS], cwd=WORK, env=ENV, capture_output=True, text=True, encoding="utf-8")
paths = json.loads(p.stdout.split("@@", 1)[1])
expect_got = {"ok": "거래 딕셔너리" if paths["ok"] == "dict" else "?", "handled": paths["handled"], "propagate": "KeyError(전파)" if paths["propagate"] == "KeyError" else "?"}
ed = OUT["error_decorator.py"]
for svg, root in roots.items():
    tag = os.path.basename(svg)
    gots = {}
    outs_ok = True
    for g in els(root, "data-path"):
        for e in g.iter():
            if e.get("data-got"):
                gots[g.get("data-path")] = e.get("data-got")
            if e.get("data-out"):
                outs_ok &= e.get("data-out") in ed
    check(gots == expect_got, f"{tag}: 그림 C 받는 것 = 실제 호출 결과 {gots}")
    check(outs_ok, f"{tag}: 그림 C 출력 줄 = 실행 출력")
    excs = {e.get("data-exc"): e.get("class") for e in els(root, "data-exc")}
    check(excs == {"handled-orig>handled-wrap": "exc", "propagate-orig>propagate-caller": "exc2"},
          f"{tag}: 처리 예외는 원래 함수 → wrapper(긴 파선), 전파 예외는 원래 함수 → 호출한 쪽(점선)")
    rets = sorted(e.get("data-return") for e in els(root, "data-return") if e.get("data-return").split("-")[0] in ("ok", "handled", "propagate"))
    check(rets == ["handled-wrap>handled-caller", "ok-orig>ok-wrap", "ok-wrap>ok-caller"], f"{tag}: return 선(정상 2, 처리한 예외 1, 전파 0)")
eh = next(n for n in ast.walk(ast.parse(open(os.path.join(DEMO, "error_decorator.py"), encoding="utf-8").read())) if isinstance(n, ast.FunctionDef) and n.name == "handle_app_errors")
handlers = [h for h in ast.walk(eh) if isinstance(h, ast.ExceptHandler)]
check(len(handlers) == 1 and isinstance(handlers[0].type, ast.Name) and handlers[0].type.id == "AppError", "AST: handle_app_errors의 except는 AppError 하나")

# ── 6. 그림 D ───────────────────────────────────────────────
DOUT = {"log": OUT["log_decorator.py"], "error": OUT["error_decorator.py"], "time": OUT["timing_decorator.py"]}


def fn(fname, name):
    return next(n for n in ast.walk(ast.parse(open(os.path.join(DEMO, fname), encoding="utf-8").read())) if isinstance(n, ast.FunctionDef) and n.name == name)


log_w = fn("log_decorator.py", "log_calls")
check(any(isinstance(h, ast.ExceptHandler) and any(isinstance(x, ast.Raise) and x.exc is None for x in ast.walk(h)) for h in ast.walk(log_w)),
      "AST: 로그 wrapper는 except 안에서 raise로 다시 던짐")
err_w = fn("error_decorator.py", "handle_app_errors")
check(any(isinstance(x, ast.Return) and isinstance(x.value, ast.Constant) and x.value.value is None for h in ast.walk(err_w) if isinstance(h, ast.ExceptHandler) for x in ast.walk(h)),
      "AST: 예외 처리 wrapper는 AppError를 받으면 None을 돌려줌")
time_w = fn("timing_decorator.py", "timed")
check(sum(isinstance(c, ast.Call) and isinstance(c.func, ast.Name) and c.func.id == "clock" for c in ast.walk(time_w)) == 2,
      "AST: 시간 측정 wrapper는 clock()을 앞뒤로 두 번 부름")
for svg, root in roots.items():
    tag = os.path.basename(svg)
    ok = True
    for g in els(root, "data-concern"):
        for e in g.iter():
            if e.get("data-out"):
                ok &= e.get("data-out") in DOUT[g.get("data-concern")]
    check(ok and len(els(root, "data-concern")) == 3, f"{tag}: 그림 D 세 관심사의 출력 = 각 데모 실행 출력")
    svg_text = open(svg, encoding="utf-8").read()
    check(not re.search(r"total_amount: \d", svg_text) and "[시간] sample: 0.250000초" in svg_text, f"{tag}: 실제 시간 숫자는 그리지 않고 가짜 시계 결과만")
    rows = [e.get("data-row") for e in els(root, "data-row")]
    check(len(rows) == 15, f"{tag}: 그림 D 비교 15칸")

# ── 7. AST: 학습용 Decorator 구조 ──────────────────────────────────
DECOS = {"simple_wrapper.py": ["trace"], "when_applied.py": ["trace"], "deco_tools.py": ["trace"],
         "args_return.py": ["trace", "forget_return", "no_arguments"], "wraps_compare.py": ["plain", "keeps"],
         "log_decorator.py": ["log_calls"], "error_decorator.py": ["handle_app_errors"], "timing_decorator.py": ["timed"]}
for fname, names_ in DECOS.items():
    for name in names_:
        f = fn(fname, name)
        inner = [n for n in f.body if isinstance(n, ast.FunctionDef)]
        returns_wrapper = any(isinstance(n, ast.Return) and isinstance(n.value, ast.Name) and n.value.id == inner[0].name for n in f.body)
        star = inner[0].args.vararg is not None
        passes = any(isinstance(c, ast.Call) and isinstance(c.func, ast.Name) and c.func.id == "func"
                     and any(isinstance(a, ast.Starred) for a in c.args) for c in ast.walk(inner[0]))
        uses_wraps = any(isinstance(d, ast.Call) and getattr(d.func, "id", "") == "wraps" for d in inner[0].decorator_list)
        ok = returns_wrapper and (passes if star else True)
        if name in ("keeps", "log_calls", "handle_app_errors", "timed"):
            ok &= uses_wraps and star
        check(ok, f"AST {fname}:{name} — wrapper를 돌려줌" + (", *args·**kwargs로 받아 func(*args, **kwargs)로 넘김" if star else ", 인자 없는 wrapper")
              + (", @wraps(func)" if name in ("keeps", "log_calls", "handle_app_errors", "timed") else ""))

# ── 8. ledger 구현 사례(선택) ────────────────────────────────────
LEDGER = os.environ.get("LEDGER_REPO", os.path.join(REPO, "..", "m03-pocket-money-ledger"))
if not os.path.isdir(os.path.join(LEDGER, "ledger")):
    print(f"SKIP ledger 구현 사례: {LEDGER} 없음")
else:
    head = subprocess.run(["git", "-C", LEDGER, "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
    print(f"INFO ledger 저장소 {os.path.abspath(LEDGER)} HEAD {head} (원고 기준 d14e812)")
    PROBE = r'''
import argparse, contextlib, io, json, pathlib, subprocess, sys, tempfile, os
import ledger.cli as cli
from ledger.decorators import handle_errors, describe_error
from ledger.errors import TransactionNotFoundError, LedgerError
r = {"name": cli._dispatch.__name__, "wrapped": hasattr(cli._dispatch, "__wrapped__")}
d = pathlib.Path(tempfile.mkdtemp())
ns = argparse.Namespace(data_dir=d, command="category", category_command="list")
with contextlib.redirect_stdout(io.StringIO()):
    r["orig_return"] = repr(cli._dispatch.__wrapped__(ns))
    r["deco_return"] = cli._dispatch(ns)
@handle_errors
def bug():
    return {}["x"]
try:
    bug(); r["keyerror"] = "caught"
except KeyError:
    r["keyerror"] = "propagated"
r["describe"] = list(describe_error(TransactionNotFoundError("x")))
r["fallback"] = list(describe_error(LedgerError("직접 만든 메시지")))
env = dict(os.environ)
p = subprocess.run([sys.executable, "-m", "ledger", "--data-dir", str(d), "delete", "--id", "99"], capture_output=True, text=True, encoding="utf-8", env=env)
r["delete"] = [p.returncode, p.stdout, p.stderr]
p = subprocess.run([sys.executable, "-m", "ledger", "--data-dir", str(d), "category", "list"], capture_output=True, text=True, encoding="utf-8", env=env)
r["ok"] = [p.returncode, p.stdout, p.stderr]
sys.stdout.write("@@" + json.dumps(r, ensure_ascii=False))
'''
    LX = tempfile.mkdtemp(prefix="b21-scene06-ledger-")
    p = subprocess.run([sys.executable, "-c", PROBE], cwd=LX, env=dict(ENV, PYTHONPATH=os.path.abspath(LEDGER)), capture_output=True, text=True, encoding="utf-8")
    r = json.loads(p.stdout.split("@@", 1)[1])
    check(r["name"] == "_dispatch" and r["wrapped"], "ledger: _dispatch.__name__ 유지, __wrapped__ 있음(@wraps)")
    check(r["orig_return"] == "None" and r["deco_return"] == 0, "ledger: 원래 _dispatch는 None, 감싼 _dispatch는 종료 코드 0(반환 약속 변경)")
    check(r["keyerror"] == "propagated", "ledger: handle_errors는 KeyError를 잡지 않고 전파")
    check(r["describe"] == ["존재하지 않는 거래 ID입니다.", "list 명령으로 거래 ID를 확인하세요."] and r["fallback"] == ["직접 만든 메시지", "입력값을 다시 확인하세요."],
          "ledger: describe_error가 예외를 (원인, 힌트)로, 등록 안 된 종류는 메시지 + 기본 힌트")
    check(r["delete"] == [1, "", "[오류] 존재하지 않는 거래 ID입니다.\n[힌트] list 명령으로 거래 ID를 확인하세요.\n"], "ledger: delete --id 99 → stderr [오류]·[힌트], 종료 코드 1, stdout 없음")
    check(r["ok"][0] == 0 and r["ok"][2] == "" and r["ok"][1].startswith("[안내]"), "ledger: 정상 명령(category list) → 종료 코드 0")
    deco_src = open(os.path.join(LEDGER, "ledger", "decorators.py"), encoding="utf-8").read()
    cli_src = open(os.path.join(LEDGER, "ledger", "cli.py"), encoding="utf-8").read()
    he = next(n for n in ast.walk(ast.parse(deco_src)) if isinstance(n, ast.FunctionDef) and n.name == "handle_errors")
    hs = [h for h in ast.walk(he) if isinstance(h, ast.ExceptHandler)]
    check(len(hs) == 1 and getattr(hs[0].type, "id", "") == "LedgerError", "ledger AST: handle_errors의 except는 LedgerError 하나")
    deco_uses = [n.name for n in ast.walk(ast.parse(cli_src)) if isinstance(n, ast.FunctionDef) for dd in n.decorator_list if getattr(dd, "id", "") == "handle_errors"]
    check(deco_uses == ["_dispatch"], "ledger AST: @handle_errors는 _dispatch 한 곳에만")
    all_src = "".join(open(os.path.join(LEDGER, "ledger", f), encoding="utf-8").read() for f in os.listdir(os.path.join(LEDGER, "ledger")) if f.endswith(".py"))
    custom = sorted({ast.unparse(dd) for n in ast.walk(ast.parse(all_src)) if isinstance(n, (ast.FunctionDef, ast.ClassDef)) for dd in n.decorator_list})
    check("perf_counter" not in all_src and "import logging" not in all_src and set(custom) <= {"dataclass", "classmethod", "handle_errors", "wraps(func)", "property", "staticmethod"},
          f"ledger: 로그·시간 측정 Decorator 없음(쓰인 Decorator {custom})")
    shutil.rmtree(LX, ignore_errors=True)

# ── 9. 저장소 데모 폴더 ───────────────────────────────────────────
check(digest() == before, "저장소 데모 폴더의 파일 목록·내용이 실행 전후로 같음")
shutil.rmtree(WORK, ignore_errors=True)
print(f"\n결과: {'FAIL ' + str(len(fails)) + '건' if fails else 'PASS'}")
sys.exit(1 if fails else 0)
