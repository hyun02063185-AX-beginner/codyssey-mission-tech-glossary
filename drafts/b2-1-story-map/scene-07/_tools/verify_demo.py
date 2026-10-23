"""Scene 07 원고·데모·그림 정합성 검사(학습용 데모). `ledger` 사례는 verify_ledger.py가 따로 검사한다.

1. 원고(script.md)의 `<!-- demo:경로 -->` 코드 블록이 _tools/demo/의 실제 파일과 글자까지 같은지, 데모 파일이 모두 원고에 있는지
2. 데모를 **임시 폴더(저장소 밖)** 에 복사해 원고의 `<!-- run: … -->` 블록을 실행하고, 출력(줄 전체, 표준 출력·오류를 나온 순서대로)과 종료 코드가 같은지.
   argparse_vs_hint.py는 표준 출력과 표준 오류를 따로 받아 오류 줄이 표준 오류로 나가는지도 확인
3. 그림 A: 경우마다 호출식(data-call-expr)을 실제 정의의 signature에 bind한 결과 = 그림의 연결(data-bind) = 실행 출력의 '연결:' 줄,
   연결 선이 Argument 칩 → 같은 이름의 Parameter 칸, 칩 글자 = 넣은 값, 키워드 인자는 선이 엇갈리고(칩 순서 ≠ 칸 순서) 위치 인자는 같은 순서, 기본값 경우 quantity 칸에 선 없음
4. 그림 B: 코드 줄 = 실제 소스(휴대전화에서 나눈 줄은 이어 붙여), 강조한 힌트 조각 = 실제 annotation, 두 함수 본문(AST)이 같음, 결과 줄 = 실행 출력
5. 그림 C: 경우마다 종료 코드·출력 = 실제 실행, 단계 상태 = 호출 추적(sys.settrace: list_transactions 호출·예외·return),
   변환 칩 = 실제 args.limit, 끝 선(return / 처리되는 예외 / 전파되는 예외) = 실제 경로. AST: type=int, limit: int, if limit <= 0 → raise ValueError
6. 그림 D: 행마다 '표시만'·'검증' 결과 = 실행 출력, 선언 판단(맞음/다름) = isinstance(값, int)(bool 포함), 비교 카드 출력 = 실행 출력. AST: 검증 함수의 isinstance·bool·범위 검사
7. 모든 data-out: 실제 출력 줄이고, 그린 글자를 이어 붙이면 그 줄(또는 '→' 뒤 부분)과 같음(나눠 그린 줄이 다른 뜻이 되지 않게)
8. 저장소의 데모 폴더가 실행 전후로 같은지
9. (선택) OLD_PYTHON(3.10 미만 Python 경로)이 있으면 `|` 문법 데모가 정의 줄에서 TypeError로 멈추는지

실행: python -I verify_demo.py   (다른 폴더의 원고·그림을 검사하려면 SCENE_DIR=<폴더>)
"""
import ast
import hashlib
import inspect
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
SCENE = os.environ.get("SCENE_DIR") or os.path.dirname(HERE)
DEMO = os.path.join(SCENE, "_tools", "demo")
SCRIPT = os.path.join(SCENE, "script.md")
SVGS = {k: os.path.join(SCENE, f"type-hint-flow-{k}.svg") for k in ("desktop", "mobile")}
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUNBUFFERED="1", PYTHONDONTWRITEBYTECODE="1")
sys.stdout.reconfigure(encoding="utf-8")
fails = []


def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond:
        fails.append(msg)


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
WORK = tempfile.mkdtemp(prefix="b21-scene07-")
for f in py_files:
    shutil.copy(os.path.join(DEMO, f), WORK)


def run(cmd, merge=True):
    args = cmd.split()
    if args[0] == "python":
        args[0] = sys.executable
    p = subprocess.run(args, cwd=WORK, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.STDOUT if merge else subprocess.PIPE, text=True, encoding="utf-8")
    if merge:
        return p.returncode, p.stdout.replace("\r\n", "\n").rstrip("\n").split("\n")
    return p.returncode, p.stdout, p.stderr


OUT = {}
for spec, body in BLOCKS:
    if spec.startswith("run"):
        m = re.match(r"run:\s*(.*?)\s*\|\s*exit=(\d+)\s*$", spec)
        cmd, want_exit = m.group(1), int(m.group(2))
        lines = body.split("\n")
        check(lines[0] == "$ " + cmd, f"run 표시 명령 = 블록 첫 줄: {cmd}")
        code, out = run(cmd)
        check(out == lines[1:] and code == want_exit, f"실행 출력·종료 코드 = 원고: $ {cmd} (exit {code})")
        if out != lines[1:]:
            print("   기대:", lines[1:], "\n   실제:", out)
        OUT[cmd[len("python "):]] = (out, code)
check(len({k.split()[0] for k in OUT}) == len(py_files), f"실행한 데모 {len({k.split()[0] for k in OUT})}개 = 데모 파일 {len(py_files)}개")
ALL_OUT = {ln.strip() for out, _ in OUT.values() for ln in out}

for val, want_exit in (("10", 0), ("abc", 2), ("-2", 1)):
    code, out, err = run(f"python argparse_vs_hint.py --limit {val}", merge=False)
    if val == "10":
        check(code == 0 and err == "" and out.startswith("[CLI]"), "--limit 10: 표준 오류 없음, 결과는 표준 출력")
    elif val == "abc":
        check(code == 2 and out == "" and "usage:" in err and "error:" in err, "--limit abc: 표준 출력 없음, argparse의 사용법·오류는 표준 오류, 종료 코드 2")
    else:
        check(code == 1 and out.startswith("[CLI]") and "[오류]" not in out and err.startswith("[오류]"), "--limit -2: [CLI]는 표준 출력, [오류]는 표준 오류, 종료 코드 1")

# ── SVG ───────────────────────────────────────────────────────
roots = {}
for kind, svg in SVGS.items():
    try:
        roots[kind] = ET.parse(svg).getroot()
        check(True, f"SVG XML 구문: {os.path.basename(svg)}")
    except ET.ParseError as error:
        check(False, f"SVG XML 구문: {os.path.basename(svg)} ({error})")


def els(root, attr, tag=None):
    return [e for e in root.iter() if e.get(attr) is not None and (tag is None or e.tag.endswith(tag))]


def texts_of(e):
    """data-out 등이 붙은 요소의 그린 글자: text면 그 글자, g면 안의 text를 줄마다(앞뒤 공백 제거) 공백으로 이어 붙임."""
    if e.tag.endswith("text"):
        return "".join(e.itertext())
    parts = ["".join(t.itertext()).strip() for t in e.iter() if t.tag.endswith("text")]
    return " ".join(p for p in parts if p)


def boxes(root):
    return {e.get("data-box"): (float(e.get("x")), float(e.get("y")), float(e.get("width")), float(e.get("height"))) for e in root.iter() if e.get("data-box")}


def module_ast(fname):
    return ast.parse(open(os.path.join(DEMO, fname), encoding="utf-8").read())


def funcs(fname, name):
    return [n for n in module_ast(fname).body if isinstance(n, ast.FunctionDef) and n.name == name]


def func_from(node, fname):
    ns = {}
    exec(compile(ast.Module(body=[node], type_ignores=[]), fname, "exec"), ns)
    return ns[node.name]


# ── 3. 그림 A ─────────────────────────────────────────────────
defs = funcs("parameter_argument.py", "calculate_total")
check(len(defs) == 2 and not defs[0].args.defaults and len(defs[1].args.defaults) == 1, "parameter_argument.py: calculate_total 정의 두 개(두 번째만 quantity=1 기본값)")
pa_out = OUT["parameter_argument.py"][0]
for kind, root in roots.items():
    bx = boxes(root)
    cases = els(root, "data-call-expr", "g")
    check(sorted(g.get("data-case") for g in cases) == ["default", "kw", "pos", "swap"], f"[{kind}] 그림 A 경우 4개")
    for g in cases:
        cid, expr, bind = g.get("data-case"), g.get("data-call-expr"), g.get("data-bind")
        call = ast.parse(expr, mode="eval").body
        args = [ast.literal_eval(a) for a in call.args]
        kwargs = {k.arg: ast.literal_eval(k.value) for k in call.keywords}
        fn = func_from(defs[1] if cid == "default" else defs[0], "parameter_argument.py")
        ba = inspect.signature(fn).bind(*args, **kwargs)
        ba.apply_defaults()
        real = ", ".join(f"{k}={v}" for k, v in ba.arguments.items())
        check(real == bind, f"[{kind}] A-{cid}: {expr} → bind {real} = 그림 {bind}")
        check(f"연결: {real}" in [ln.strip() for ln in pa_out], f"[{kind}] A-{cid}: 실행 출력에 '연결: {real}'")
        rels = sorted(e.get("data-rel") for e in els(g, "data-rel"))
        params = list(inspect.signature(fn).parameters)
        passed = sorted(params[: len(args)] + list(kwargs))  # 기본값이 아니라 Argument를 받은 Parameter
        check(rels == sorted(f"a-{cid}-arg-{p}>a-{cid}-par-{p}" for p in passed), f"[{kind}] A-{cid}: 연결 선 = 실제로 넘긴 Argument → 같은 이름의 Parameter ({', '.join(passed)})")
        for p in passed:
            cx, cy, cw, ch = bx[f"a-{cid}-arg-{p}"]
            inside = [t for t in g.iter() if t.tag.endswith("text") and "arg" in (t.get("class") or "") and cx <= float(t.get("x")) <= cx + cw and cy <= float(t.get("y")) <= cy + ch + 2]
            check(len(inside) == 1 and "".join(inside[0].itertext()) == str(ba.arguments[p]), f"[{kind}] A-{cid}: {p} 칩 글자 = 넣은 값 {ba.arguments[p]}")
        if len(passed) == 2:
            chip_order = sorted(passed, key=lambda p: bx[f"a-{cid}-arg-{p}"][0])
            slot_order = sorted(passed, key=lambda p: bx[f"a-{cid}-par-{p}"][0])
            crossed = chip_order != slot_order
            check(crossed == (cid == "kw"), f"[{kind}] A-{cid}: 연결 선이 {'엇갈림(이름으로 연결)' if cid == 'kw' else '같은 순서(순서로 연결)'}")
        if cid == "default":
            check("quantity" not in passed and not any("par-quantity" in r for r in rels), f"[{kind}] A-default: quantity 칸에 연결 선 없음(기본값)")

# ── 4. 그림 B ─────────────────────────────────────────────────
plain, hinted = funcs("type_hint_basics.py", "calculate_total_no_hint")[0], funcs("type_hint_basics.py", "calculate_total")[0]
check(ast.dump(plain.body[0]) == ast.dump(hinted.body[0]) and len(plain.body) == len(hinted.body) == 1, "type_hint_basics.py: 두 함수의 본문(AST)이 같음 — 다른 것은 힌트뿐")
check(all(a.annotation is None for a in plain.args.args) and plain.returns is None, "힌트 없는 함수: annotation 없음")
check([ast.unparse(a.annotation) for a in hinted.args.args] == ["int", "int"] and ast.unparse(hinted.returns) == "int", "힌트 있는 함수: price: int, quantity: int, -> int")
src_lines = open(os.path.join(DEMO, "type_hint_basics.py"), encoding="utf-8").read().split("\n")
for kind, root in roots.items():
    for name, node in (("calculate_total_no_hint", plain), ("calculate_total", hinted)):
        grp = [g for g in els(root, "data-src", "g") if g.get("data-src") == f"type_hint_basics.py:{name}"]
        check(len(grp) == 1, f"[{kind}] 그림 B 코드 묶음: {name}")
        rows = {}
        for e in grp[0].iter():
            if e.get("data-line"):
                t = texts_of(e) if e.tag.endswith("text") else "".join("".join(x.itertext()) for x in e.iter() if x.tag.endswith("text"))
                prev = rows.get(e.get("data-line"))
                rows[e.get("data-line")] = t if prev is None else prev + (" " if prev.endswith(",") else "") + t.strip()
        real = [src_lines[node.lineno - 1 + k].strip() for k in range(node.end_lineno - node.lineno + 1)]
        check([rows[k].strip() for k in sorted(rows)] == real, f"[{kind}] 그림 B {name} 코드 줄 = 실제 소스 {len(real)}줄")
        hints = [("".join(t.itertext())) for t in grp[0].iter() if t.tag.endswith("text") and "hintT" in (t.get("class") or "")]
        want = [": int", ": int", "-> int"] if name == "calculate_total" else []
        check(hints == want, f"[{kind}] 그림 B {name}: 강조한 힌트 조각 {hints} = 실제 annotation")

# ── 5. 그림 C ─────────────────────────────────────────────────
TRACE = r'''
import json, runpy, sys
ev = []
def local(frame, event, arg):
    if event == "exception":
        ev.append("raise " + arg[0].__name__)
    elif event == "return":
        ev.append("return")
    return local
def glob(frame, event, arg):
    if frame.f_code.co_name == "list_transactions":
        ev.append("call")
        return local
    return None
sys.argv = ["argparse_vs_hint.py", "--limit", sys.argv[1]]
sys.settrace(glob)
code = 0
try:
    runpy.run_path("argparse_vs_hint.py", run_name="__main__")
except SystemExit as e:
    code = e.code
sys.settrace(None)
sys.__stderr__.write("\n@@" + json.dumps({"events": ev, "exit": code}) + "\n")
'''
tree = module_ast("argparse_vs_hint.py")
add_arg = [n for n in ast.walk(tree) if isinstance(n, ast.Call) and getattr(n.func, "attr", "") == "add_argument"]
check(len(add_arg) == 1 and any(k.arg == "type" and ast.unparse(k.value) == "int" for k in add_arg[0].keywords), "AST argparse_vs_hint.py: add_argument('--limit', type=int, …)")
lt = funcs("argparse_vs_hint.py", "list_transactions")[0]
check(ast.unparse(lt.args.args[0].annotation) == "int" and isinstance(lt.body[1], ast.If) and ast.unparse(lt.body[1].test) == "limit <= 0"
      and isinstance(lt.body[1].body[0], ast.Raise) and "ValueError" in ast.unparse(lt.body[1].body[0]), "AST list_transactions: limit: int, if limit <= 0: raise ValueError(…)")
noty = [n for n in ast.walk(module_ast("argparse_without_type.py")) if isinstance(n, ast.Call) and getattr(n.func, "attr", "") == "add_argument"]
check(len(noty) == 1 and not any(k.arg == "type" for k in noty[0].keywords), "AST argparse_without_type.py: add_argument에 type 없음")
EXPECT = {"10": ("ok", 0, ["call", "return"]), "abc": ("bad", 2, []), "-2": ("neg", 1, ["call", "raise ValueError", "return"])}
for val, (cid, want_exit, want_ev) in EXPECT.items():
    p = subprocess.run([sys.executable, "-c", TRACE, val], cwd=WORK, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
    info = json.loads(p.stderr.rsplit("@@", 1)[1])
    check(info["events"] == want_ev and info["exit"] == want_exit, f"호출 추적 --limit {val}: list_transactions {info['events'] or '호출 안 됨'}, 종료 코드 {info['exit']}")
    out, code = OUT[f"argparse_vs_hint.py --limit {val}"]
    called, raised = "call" in info["events"], "raise ValueError" in info["events"]
    real_state = {"cli": "ok", "parse": "ok" if called or code == 0 else "fail", "call": "ok" if called else "skip",
                  "check": "skip" if not called else ("fail" if raised else "ok")}
    limit_val = next((re.match(r"\[CLI\] args\.limit = (.*) \(int\)", ln).group(1) for ln in out if ln.startswith("[CLI]")), None)
    for kind, root in roots.items():
        g = [x for x in els(root, "data-arg", "g") if x.get("data-case") == cid]
        check(len(g) == 1 and g[0].get("data-arg") == val and int(g[0].get("data-exit")) == code, f"[{kind}] C-{cid}: --limit {val}, 종료 코드 {code}")
        g = g[0]
        stages = dict(e.get("data-stage").split("=") for e in els(g, "data-stage"))
        check(stages == real_state, f"[{kind}] C-{cid}: 단계 상태 {stages} = 실제 경로")
        outs = [e.get("data-out") for e in els(g, "data-out")]
        check(outs == out, f"[{kind}] C-{cid}: 출력 줄 = 실제 실행 {len(out)}줄")
        conv = els(g, "data-conv")
        bx = boxes(root)
        chip_t = {b: "".join(t.itertext()) for t in g.iter() if t.tag.endswith("text") and (b := t.get("data-in")) and b.startswith(f"c-{cid}-parse-")}
        if limit_val is not None:
            check(len(conv) == 1 and chip_t.get(f"c-{cid}-parse-s") == f"'{val}'" and chip_t.get(f"c-{cid}-parse-i") == limit_val,
                  f"[{kind}] C-{cid}: 변환 '{val}' → {limit_val} = 실제 args.limit")
        else:
            check(not conv and chip_t.get(f"c-{cid}-parse-s") == f"'{val}'" and f"c-{cid}-parse-i" not in bx, f"[{kind}] C-{cid}: 변환 실패 — 변환 선·정수 칩 없음")
        ends = [(e.get("class"), (e.get("data-return") or e.get("data-exc"))) for e in g.iter() if e.get("data-return") or e.get("data-exc")]
        want_end = {"ok": ("ret", f"c-ok-check>c-ok-out"), "bad": ("exc2", "c-bad-parse>c-bad-out"), "neg": ("exc", "c-neg-check>c-neg-out")}[cid]
        check(ends == [want_end], f"[{kind}] C-{cid}: 끝 선 {ends} = 실제 경로({'return' if cid == 'ok' else '전파되는 SystemExit' if cid == 'bad' else '처리되는 ValueError'})")
        steps = sorted(e.get("data-call").split("@")[1] for e in els(g, "data-call"))
        check(steps == [str(n) for n in range(1, sum(1 for s in real_state.values() if s != "skip"))], f"[{kind}] C-{cid}: 실행 순서 번호 {steps} = 실행된 단계 사이")

# ── 6. 그림 D ─────────────────────────────────────────────────
rv = funcs("runtime_validation.py", "set_amount")[0]
src = ast.unparse(rv)
check("isinstance(amount, int)" in src and "isinstance(amount, bool)" in src and "amount <= 0" in src and src.count("raise ValueError") == 2, "AST runtime_validation.py: isinstance(int)·isinstance(bool)·amount <= 0 → raise ValueError")
hv = funcs("hint_not_validation.py", "set_amount")[0]
check(len(hv.body) == 1 and ast.unparse(hv.body[0]) == "return amount", "AST hint_not_validation.py: 본문은 return amount 하나")
hint_out, check_out = OUT["hint_not_validation.py"][0], OUT["runtime_validation.py"][0]
for kind, root in roots.items():
    rows = els(root, "data-input", "g")
    check(len(rows) == 6, f"[{kind}] 그림 D 행 6개")
    for g in rows:
        v = ast.literal_eval(g.get("data-input"))
        tname = "None" if v is None else type(v).__name__
        decl = g.get("data-decl")
        check(decl.startswith(tname + " ·") and (("맞음" in decl) == isinstance(v, int)), f"[{kind}] D {g.get('data-input')}: 선언 판단 '{decl}' = isinstance(값, int) {isinstance(v, int)}")
        cols = {e.get("data-col"): e for e in els(g, "data-col")}
        h, c = cols["hint"].get("data-out"), cols["check"].get("data-out")
        check(h in hint_out and h.startswith(f"set_amount({v!r}) →"), f"[{kind}] D {v!r}: 표시만 결과 = 실행 출력 '{h}'")
        check(c in check_out and c.startswith(f"set_amount({v!r}) →"), f"[{kind}] D {v!r}: 검증 결과 = 실행 출력 '{c}'")
        right_h, right_c = h.split(" → ", 1)[1], c.split(" → ", 1)[1]
        check(texts_of(cols["hint"]) == right_h and texts_of(cols["check"]) == right_c.replace("거부: ", ""), f"[{kind}] D {v!r}: 그린 값 = 실행 결과")
    cards = els(root, "data-card", "g")
    check(sorted(g.get("data-card") for g in cards) == sorted(["str | None", "list[str]", "int | str", "-> None"]), f"[{kind}] 그림 D 비교 카드 4개")
    card_src = {**{ln: "none_and_defaults.py" for ln in OUT["none_and_defaults.py"][0]}, **{ln: "typing_contract.py" for ln in OUT["typing_contract.py"][0]}}
    for g in cards:
        for e in els(g, "data-out"):
            check(e.get("data-out") in card_src, f"[{kind}] D 카드 {g.get('data-card')}: '{e.get('data-out')}' = {card_src.get(e.get('data-out'), '실행 출력에 없음')} 실행 출력")

# ── 7. 모든 data-out ─────────────────────────────────────────
for kind, root in roots.items():
    bad = []
    n = 0
    for e in els(root, "data-out"):
        if e.get("data-col"):
            continue
        n += 1
        o = e.get("data-out")
        shown_t = texts_of(e)
        if o.strip() not in ALL_OUT:
            bad.append(f"실행 출력에 없음: {o}")
        elif shown_t not in (o.strip(), o.split(" → ", 1)[-1]):
            bad.append(f"그린 글자 '{shown_t}' ≠ '{o}'")
    check(not bad, f"[{kind}] data-out {n}개: 모두 실제 출력 줄이고, 나눠 그린 글자를 이어 붙이면 원래 줄" + ("" if not bad else " — " + " / ".join(bad)))

# ── 8·9 ───────────────────────────────────────────────────────
old = os.environ.get("OLD_PYTHON")
if old and os.path.exists(old):
    ver = subprocess.run([old, "-c", "import sys; print('%d.%d.%d' % sys.version_info[:3])"], stdout=subprocess.PIPE, text=True).stdout.strip()
    for f in ("none_and_defaults.py", "typing_contract.py"):
        p = subprocess.run([old, "-B", f], cwd=WORK, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
        last = p.stdout.strip().split("\n")[-1]
        check(p.returncode == 1 and last.startswith("TypeError: unsupported operand type(s) for |"), f"Python {ver}(3.10 미만): {f}는 정의 줄에서 {last}")
else:
    print("SKIP OLD_PYTHON 없음(3.10 미만 Python에서 | 문법 확인 생략)")
shutil.rmtree(WORK, ignore_errors=True)
check(digest() == before, "저장소 데모 폴더의 파일 목록·내용이 실행 전후로 같음")
print(f"\n결과: {'FAIL ' + str(len(fails)) + '건' if fails else 'PASS'}")
sys.exit(1 if fails else 0)
