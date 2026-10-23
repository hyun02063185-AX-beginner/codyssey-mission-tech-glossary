"""Scene 05 원고·데모·그림 정합성 검사.

1. 원고(script.md)의 `<!-- demo:경로 -->` 코드 블록이 _tools/demo/의 실제 파일과 글자까지 같은지, 데모 파일이 모두 원고에 있는지,
   `<!-- file: … -->` 블록이 데모의 데이터 파일과 같은지
2. 데모를 **임시 폴더(저장소 밖)** 에 복사해 원고의 `<!-- run: … -->` 블록을 실행하고, 출력(줄 전체)과 종료 코드가 같은지
3. 그림 A: 두 Iterator의 꺼낸 값·다음 위치·호출 순서 = two_iterators.py 출력, 포함 관계의 구성원 = 실제 isinstance·iter() 확인 결과
4. 그림 B: 코드 줄 = count_up 원본(print 인자만 줄임), 호출마다 실행된 줄 = sys.settrace 줄 추적, 나온 값·상태·보관된 n = 실행 출력
5. 그림 C: 파일 줄·str·받은 값·합계 = 실행 출력, 실행 순서(소비자 next → Generator 재개 → json.loads → yield → 소비)= 호출 추적,
   'Generator 안에서 for line in f 다음에 json.loads' = AST
6. 그림 D: 방식별 꺼낸 줄 수·남긴 거래 id·끝까지 읽음 = five_ways.py 출력
7. 메모리 경향(임시 폴더, tracemalloc): 거래 수를 4배로 늘리면 '전부 리스트'·'list(Generator)'의 최고 사용량은 크게 늘고,
   '한 줄씩 합계'·'deque(maxlen=10)'는 거의 늘지 않는지. 바이트 수는 원고에 쓰지 않고 비율만 보고
8. Generator·Iterator 기술 사실(인라인 실행)
9. AST: 데모의 open()은 모두 "r" + encoding="utf-8"(데모는 파일을 쓰지 않음)
10. (선택) ledger 구현 사례: LEDGER_REPO(기본: 저장소 옆 m03-pocket-money-ledger)가 있으면 임시 폴더 데이터로 원고 9절을 확인. 없으면 SKIP
11. 저장소의 데모 폴더가 실행 전후로 같은지(파일 목록·데이터 파일 내용)

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
from collections.abc import Iterable, Iterator

HERE = os.path.dirname(os.path.abspath(__file__))
SCENE = os.path.dirname(HERE)
DEMO = os.path.join(HERE, "demo")
SCRIPT = os.path.join(SCENE, "script.md")
REPO = os.path.abspath(os.path.join(SCENE, "..", "..", ".."))
SVGS = [os.path.join(SCENE, f) for f in ("generator-stream-desktop.svg", "generator-stream-mobile.svg")]
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUNBUFFERED="1")
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
        if os.path.isfile(p):
            out[f] = hashlib.sha256(open(p, "rb").read()).hexdigest()
    return out


before = digest()
print(f"INFO Python {platform.python_version()} ({platform.python_implementation()}), {platform.system()} {platform.release()}")

# ── 1. 원고 블록 ──────────────────────────────────────────────
script = open(SCRIPT, encoding="utf-8").read()
BLOCKS = [(m.group(1), m.group(2)) for m in re.finditer(r"<!-- (demo:\S+|run[^>]*?|file:\s*\S+) -->\n```[a-z]*\n(.*?)\n```", script, re.S)]
py_files = sorted(f for f in os.listdir(DEMO) if f.endswith(".py"))
shown = []
for spec, body in BLOCKS:
    if spec.startswith("demo:"):
        shown.append(spec[5:])
        check(open(os.path.join(DEMO, spec[5:]), encoding="utf-8").read().rstrip("\n") == body, f"원고 코드 = 데모 파일: {spec[5:]}")
    elif spec.startswith("file:"):
        name = spec[5:].strip()
        check(open(os.path.join(DEMO, name), encoding="utf-8").read().rstrip("\n") == body, f"원고 파일 블록 = 데모 데이터 파일: {name}")
check(sorted(shown) == py_files, f"데모 파일 {len(py_files)}개가 모두 원고에 있음")

# ── 2. 임시 폴더에서 실행 ─────────────────────────────────────────
WORK = tempfile.mkdtemp(prefix="b21-scene05-")
for f in os.listdir(DEMO):
    if os.path.isfile(os.path.join(DEMO, f)):
        shutil.copy(os.path.join(DEMO, f), WORK)


def run(cmd, cwd=WORK, env=ENV):
    args = cmd.split()
    if args[0] == "python":
        args[0] = sys.executable
    p = subprocess.run(args, cwd=cwd, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    return p.returncode, p.stdout.replace("\r\n", "\n").rstrip("\n").split("\n")


OUT = {}
listing = sorted(os.listdir(WORK))
for spec, body in BLOCKS:
    if spec.startswith("run"):
        m = re.match(r"run:\s*(.*?)\s*\|\s*exit=(\d+)\s*$", spec)
        cmd, want_exit = m.group(1), int(m.group(2))
        lines = body.split("\n")
        check(lines[0] == "$ " + cmd, f"run 표시 명령 = 블록 첫 줄: {cmd}")
        code, out = run(cmd)
        OUT[cmd.split()[1]] = out
        check(out == lines[1:] and code == want_exit, f"실행 출력·종료 코드 = 원고: $ {cmd} (exit {code})")
        if out != lines[1:]:
            print("   기대:", lines[1:], "\n   실제:", out)
check(sorted(os.listdir(WORK)) == listing, "데모 실행 뒤 실행 폴더에 새 파일이 생기지 않음(데모는 읽기만 함)")
check(len(OUT) == len(py_files), f"모든 데모를 실행함({len(OUT)}개)")

roots = {}
for svg in SVGS:
    try:
        roots[svg] = ET.parse(svg).getroot()
        check(True, f"SVG XML 구문: {os.path.basename(svg)}")
    except ET.ParseError as error:
        check(False, f"SVG XML 구문: {os.path.basename(svg)} ({error})")


def els(root, attr):
    return [e for e in root.iter() if e.get(attr) is not None]


# ── 3. 그림 A ───────────────────────────────────────────────
two = OUT["two_iterators.py"]
calls = [re.match(r"next\((\w)\) → (\d+)", ln).groups() for ln in two if ln.startswith("next(")]
took = {"a": [], "b": []}
for it, v in calls:
    took[it].append(v)
numbers = ["10", "20", "30"]
expect_it = {k: f"{k}:{','.join(v)}>{numbers[len(v)] if len(v) < 3 else 'end'}" for k, v in took.items()}
yv = {ln.split(":")[0]: ln for ln in OUT["yield_vs_return.py"] if ": Iterable?" in ln}
expect_members = {"iterable:list" if "Iterator? False" in yv["리스트"] else "?", "iterator:list_iterator" if "Iterator? True" in yv["iter(리스트)"] else "?",
                  "generator:generator" if "Iterator? True" in yv["Generator"] else "?",
                  "iterator:file" if "파일 객체도 Iterator? iter(f) is f → True" in OUT["jsonl_generator.py"] else "?",
                  "iterable:str" if isinstance("식비", Iterable) and not isinstance("식비", Iterator) and isinstance({}, Iterable) and not isinstance({}, Iterator) else "?"}
for svg, root in roots.items():
    tag = os.path.basename(svg)
    got = {e.get("data-iterator"): f"{e.get('data-iterator')}:{e.get('data-took')}>{e.get('data-next')}" for e in els(root, "data-iterator")}
    check(got == expect_it, f"{tag}: Iterator a·b의 꺼낸 값·다음 위치 = 실행 출력 {sorted(got.values())}")
    seq = [text_of(e) for e in els(root, "data-out") if text_of(e).startswith("next(")]
    check(seq == [f"next({i}) → {v}" for i, v in calls], f"{tag}: 호출 순서 1~5 = 실행 출력 순서")
    nos = sorted(int(e.get("data-callno")) for e in els(root, "data-callno"))
    check(nos == [1, 2, 3, 4, 5], f"{tag}: Iterator 칸의 호출 번호 원 5개")
    outs = [e.get("data-out") for e in els(root, "data-out") if not e.get("data-out").startswith("next(") and "합계" not in e.get("data-out")]
    check(len(outs) == 2 and all(o in two for o in outs), f"{tag}: 그림 A 결과 줄 2개 = 실행 출력")
    members = {e.get("data-member") for e in els(root, "data-member")}
    check(members == expect_members, f"{tag}: 포함 관계 구성원 = isinstance·iter() 확인 결과 {sorted(members)}")

# ── 4. 그림 B: 줄 추적 ────────────────────────────────────────────
src = open(os.path.join(DEMO, "generator_steps.py"), encoding="utf-8").read()
fn = next(n for n in ast.parse(src).body if isinstance(n, ast.FunctionDef) and n.name == "count_up")
fn_lines = src.split("\n")[fn.lineno - 1: fn.end_lineno]
abbrev = [re.sub(r"print\(.*\)$", "print(…)", ln) for ln in fn_lines]
TRACE = r'''
import json, sys
src = open("generator_steps.py", encoding="utf-8").read()
ns = {}
exec(compile(src.split("\ngen = ")[0], "generator_steps.py", "exec"), ns)
first = ns["count_up"].__code__.co_firstlineno
seg, segs, last_n = [], [], []
def tr(frame, event, arg):
    if frame.f_code.co_name == "count_up":
        if event == "line":
            seg.append(frame.f_lineno - first + 1)
        if event == "return":
            last_n.append(frame.f_locals.get("n"))
        return tr
    return None
import builtins
builtins.print = lambda *a, **k: None
gen = ns["count_up"](3)
segs.append(list(seg)); seg.clear(); last_n.append(None)
sys.settrace(tr)
for k in range(4):
    try:
        next(gen)
    except StopIteration:
        pass
    segs.append(list(seg)); seg.clear()
sys.settrace(None)
sys.stdout.write("@@" + json.dumps({"segs": segs, "n": last_n}))
'''
p = subprocess.run([sys.executable, "-c", TRACE], cwd=WORK, env=ENV, capture_output=True, text=True, encoding="utf-8")
tr = json.loads(p.stdout.split("@@", 1)[1])
gs_out = OUT["generator_steps.py"]
values = [ln.split(": ")[1] for ln in gs_out if ln.startswith("밖에서 받은 값")]
check(values == ["1", "2", "3"] and gs_out[-1].startswith("StopIteration"), "generator_steps.py: 1·2·3 뒤 StopIteration")
check(not any("[본문]" in ln for ln in gs_out[:2]), "호출 직후에는 본문 출력이 없음(본문 미실행)")
for svg, root in roots.items():
    tag = os.path.basename(svg)
    code = [text_of(e) for e in sorted(els(root, "data-codeline"), key=lambda e: int(e.get("data-codeline")))]
    check(code == abbrev, f"{tag}: 그림 B 코드 줄 = count_up 원본(print 인자만 줄임)")
    steps = sorted(els(root, "data-gstep"), key=lambda e: int(e.get("data-gstep")))
    lines = [[int(x) for x in e.get("data-lines").split(",") if x] for e in steps]
    check(lines == tr["segs"], f"{tag}: 호출마다 실행된 줄 = sys.settrace 추적 {tr['segs']}")
    vals = [e.get("data-value") for e in steps]
    check(vals == ["—"] + values + ["StopIteration"], f"{tag}: 밖으로 나온 값 = 실행 출력")
    states = [e.get("data-state") for e in steps]
    check(states == ["created", "paused", "paused", "paused", "done"], f"{tag}: 상태 생성됨 → 멈춤 ×3 → 종료")
    labels = {e.get("data-gstep"): " ".join(text_of(t) for t in e.iter("{http://www.w3.org/2000/svg}text")) for e in steps}
    ok = all(f"n = {tr['n'][k]}" in labels[str(k)] and f"{6}행 yield" in labels[str(k)] for k in (1, 2, 3))
    check(ok and tr["n"][1:4] == [1, 2, 3], f"{tag}: 멈춘 위치(6행)·보관된 n = 추적한 지역변수 {tr['n'][1:4]}")

# ── 5. 그림 C ───────────────────────────────────────────────
jl = OUT["jsonl_generator.py"]
file_lines = open(os.path.join(DEMO, "transactions.jsonl"), encoding="utf-8").read().rstrip("\n").split("\n")
got_lines = [ln.split("받은 값: ", 1)[1] for ln in jl if ln.startswith("받은 값:")]
str_line = next(ln for ln in jl if ln.startswith("next(f)")).split(": ", 1)[1]
for svg, root in roots.items():
    tag = os.path.basename(svg)
    fl = [text_of(e) for e in sorted((e for e in root.iter() if e.get("data-line") and e.get("data-line").isdigit()), key=lambda e: int(e.get("data-line")))]
    check(fl == file_lines, f"{tag}: 그림 C 파일 3줄 = transactions.jsonl")
    hl = [e.get("data-hl-lines") for e in els(root, "data-hl")]
    check(hl == ["1-1"], f"{tag}: 지금 꺼내는 줄 = 1행")
    check([e.get("data-str") for e in els(root, "data-str")] == [str_line], f"{tag}: line 문자열 = 실행 출력 {str_line}")
    check([e.get("data-got") for e in els(root, "data-got")] == got_lines, f"{tag}: 받은 값 3개 = 실행 출력")
    check(any(e.get("data-out") == "합계: 13000" for e in els(root, "data-out")) and "합계: 13000" in jl, f"{tag}: 합계 = 실행 출력")
    cs = sorted(e.get("data-call") for e in els(root, "data-call"))
    check(cs == ["consumer>gen@1", "file>gen@2", "gen>consumer@4"], f"{tag}: 실행 순서 선 3개(① 요청 ② 한 줄 ④ 건넴)")
ORDER = r'''
import json, sys
src = open("jsonl_generator.py", encoding="utf-8").read()
ns = {}
exec(compile(src.split("\nrows = ")[0], "jsonl_generator.py", "exec"), ns)
ev = []
def consume():
    total = 0
    for row in ns["read_transactions"]("transactions.jsonl"):
        total = total + row["amount"]
    return total
def prof(frame, event, arg):
    name = frame.f_code.co_name
    if name == "read_transactions" and event == "call":
        ev.append("gen-resume")
    elif name == "read_transactions" and event == "return" and isinstance(arg, dict):
        ev.append("yield")
    elif name == "loads" and event == "call" and frame.f_globals.get("__name__") == "json":
        ev.append("loads")
def tr(frame, event, arg):
    if frame.f_code.co_name == "consume" and event == "line" and "total = total" in src_lines.get(frame.f_lineno, ""):
        ev.append("consume")
    return tr if frame.f_code.co_name == "consume" else None
import inspect
src_lines = {i + inspect.getsourcelines(consume)[1]: l for i, l in enumerate(inspect.getsourcelines(consume)[0])}
sys.setprofile(prof); sys.settrace(tr)
t = consume()
sys.settrace(None); sys.setprofile(None)
sys.stdout.write("@@" + json.dumps({"ev": ev, "total": t}))
'''
p = subprocess.run([sys.executable, "-c", ORDER], cwd=WORK, env=ENV, capture_output=True, text=True, encoding="utf-8")
order = json.loads(p.stdout.split("@@", 1)[1])
first = order["ev"][: order["ev"].index("consume") + 1]
check(first == ["gen-resume", "loads", "yield", "consume"], f"추적: 한 건의 순서 = Generator 재개 → json.loads → yield → 소비 {first}")
check(order["ev"].count("consume") == 3 and order["ev"].count("loads") == 3 and order["total"] == 13000, "추적: 3건 반복, 합계 13000")
g = next(n for n in ast.parse(open(os.path.join(DEMO, "jsonl_generator.py"), encoding="utf-8").read()).body if isinstance(n, ast.FunctionDef))
loop = next(n for n in ast.walk(g) if isinstance(n, ast.For))
check(isinstance(loop.iter, ast.Name) and loop.iter.id == "f" and any(isinstance(n, ast.Yield) for n in ast.walk(loop))
      and any(isinstance(n, ast.Attribute) and n.attr == "loads" for n in ast.walk(loop)), "AST: Generator 안에서 for line in f 다음에 json.loads·yield(② 한 줄 꺼냄)")

# ── 6. 그림 D ───────────────────────────────────────────────
ways = {}
for ln in OUT["five_ways.py"]:
    m = re.match(r"방식 (\d) · .*?: 꺼낸 줄 (\d+) · 남긴 거래 (\d+)(?: · id \[(.*)\])?", ln)
    ways[m.group(1)] = (int(m.group(2)), [int(x) for x in m.group(4).split(", ")] if m.group(4) else [])
    check(int(m.group(3)) == len(ways[m.group(1)][1]), f"five_ways.py 방식 {m.group(1)}: 남긴 거래 수 = id 개수")
total_lines = len(file_lines)
for svg, root in roots.items():
    tag = os.path.basename(svg)
    got = {e.get("data-way"): (int(e.get("data-read")), [int(x) for x in e.get("data-kept").split(",") if x]) for e in els(root, "data-way")}
    check(got == ways, f"{tag}: 그림 D 방식 5개의 꺼낸 줄·남긴 id = 실행 출력")
    fulls = {}
    for g2 in els(root, "data-way"):
        for e in g2.iter():
            if e.get("data-full"):
                fulls[g2.get("data-way")] = e.get("data-full") == "true"
    check(fulls == {k: v[0] == total_lines for k, v in ways.items()}, f"{tag}: '끝까지 읽음' = 꺼낸 줄이 파일 줄 수({total_lines})와 같음")

# ── 7. 메모리 경향(tracemalloc, 비율만) ─────────────────────────────────
MEM = r'''
import json, sys, tracemalloc
from collections import deque
def make(path, n):
    with open(path, "w", encoding="utf-8") as f:
        for i in range(1, n + 1):
            f.write(json.dumps({"id": i, "category": "식비", "amount": 1000 + i}, ensure_ascii=False, separators=(",", ":")) + "\n")
def gen(path):
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            yield json.loads(line)
def m_list(path):
    with open(path, "r", encoding="utf-8") as f:
        return [json.loads(x) for x in f.readlines()]
def m_stream(path):
    t = 0
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            t += json.loads(line)["amount"]
    return t
def m_listgen(path):
    return list(gen(path))
def m_deque(path):
    return deque(gen(path), maxlen=10)
res = {}
for n in (4000, 16000):
    make(f"big{n}.jsonl", n)
    for name, f in (("list", m_list), ("stream", m_stream), ("listgen", m_listgen), ("deque", m_deque)):
        tracemalloc.start(); r = f(f"big{n}.jsonl"); peak = tracemalloc.get_traced_memory()[1]; tracemalloc.stop(); del r
        res.setdefault(name, []).append(peak)
sys.stdout.write("@@" + json.dumps(res))
'''
MW = tempfile.mkdtemp(prefix="b21-scene05-mem-")
p = subprocess.run([sys.executable, "-c", MEM], cwd=MW, env=ENV, capture_output=True, text=True, encoding="utf-8")
mem = json.loads(p.stdout.split("@@", 1)[1])
ratio = {k: v[1] / v[0] for k, v in mem.items()}
print("INFO 거래 수 4배(4000 → 16000)일 때 최고 사용량 비율: " + ", ".join(f"{k} ×{r:.2f}" for k, r in ratio.items()))
check(ratio["list"] > 3 and ratio["listgen"] > 3, "메모리 경향: 전부 리스트·list(Generator)는 거래 수에 비례해 늘어남")
check(ratio["stream"] < 1.5 and ratio["deque"] < 1.5, "메모리 경향: 한 줄씩 합계·deque(maxlen=10)는 거래 수가 늘어도 거의 그대로")
shutil.rmtree(MW, ignore_errors=True)

# ── 8. 기술 사실 ─────────────────────────────────────────────
it = iter([10])
next(it)
again = []
for _ in range(2):
    try:
        next(it)
    except StopIteration:
        again.append(True)
check(again == [True, True], "소진된 Iterator는 다시 불러도 계속 StopIteration")


def g3():
    yield 1


gg = g3()
check(iter(gg) is gg and isinstance(gg, Iterator), "Generator: iter(gen) is gen, Iterator의 한 종류")
gg.close()
check(gg.gi_frame is None and list(gg) == [], "close()한 Generator는 끝난 상태(더 내주는 값 없음)")
check(iter([1, 2]) is not iter([1, 2]), "리스트는 iter()마다 새 Iterator")

# ── 9. AST: 데모는 읽기만 ───────────────────────────────────────────
for f in py_files:
    tree = ast.parse(open(os.path.join(DEMO, f), encoding="utf-8").read())
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "open":
            mode = node.args[1].value if len(node.args) > 1 else "r"
            enc = {k.arg: k.value for k in node.keywords}.get("encoding")
            check(mode == "r" and isinstance(enc, ast.Constant) and enc.value == "utf-8", f"AST {f}:{node.lineno} open(…, \"r\", encoding=\"utf-8\")")

# ── 10. ledger 구현 사례(선택) ────────────────────────────────────
LEDGER = os.environ.get("LEDGER_REPO", os.path.join(REPO, "..", "m03-pocket-money-ledger"))
if not os.path.isdir(os.path.join(LEDGER, "ledger")):
    print(f"SKIP ledger 구현 사례: {LEDGER} 없음")
else:
    head = subprocess.run(["git", "-C", LEDGER, "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
    print(f"INFO ledger 저장소 {os.path.abspath(LEDGER)} HEAD {head} (원고 기준 d14e812)")
    PROBE = r'''
import inspect, json, pathlib, sys, tempfile
from ledger import repository
from ledger.repository import TransactionRepository, CategoryRepository, BudgetRepository
from ledger.services import LedgerService
from ledger.models import SearchCriteria
opened = []
orig = pathlib.Path.open
def spy(self, *a, **k):
    f = orig(self, *a, **k); opened.append(f); return f
pathlib.Path.open = spy
d = pathlib.Path(tempfile.mkdtemp())
repo, cats = TransactionRepository(d), CategoryRepository(d)
svc = LedgerService(repo, cats, BudgetRepository(d))
for c in ("식비", "교통", "문구"):
    cats.add(c)
for i, (c, a) in enumerate([("식비", 8000), ("교통", 2000), ("문구", 3000), ("식비", 5000), ("교통", 1500)], 1):
    svc.add_transaction("expense", f"2026-10-0{i}", c, a)
r = {"gen_iter_jsonl": inspect.isgeneratorfunction(repository._iter_jsonl), "gen_iter_all": inspect.isgeneratorfunction(TransactionRepository.iter_all)}
opened.clear()
r["get_by_id"] = repo.get_by_id(2).id
r["get_by_id_closed"] = all(f.closed for f in opened)
r["list2"] = [t.id for t in svc.list_transactions(2)]
s = svc.search(SearchCriteria(category="식비"))
r["search"] = [type(s).__name__, [t.id for t in s]]
r["export"] = svc.export_csv(d / "out.csv", month="2026-10")
sys.stdout.write("@@" + json.dumps(r))
'''
    LX = tempfile.mkdtemp(prefix="b21-scene05-ledger-")
    p = subprocess.run([sys.executable, "-c", PROBE], cwd=LX, env=dict(ENV, PYTHONPATH=os.path.abspath(LEDGER)), capture_output=True, text=True, encoding="utf-8")
    r = json.loads(p.stdout.split("@@", 1)[1])
    check(r["gen_iter_jsonl"] and r["gen_iter_all"], "ledger: _iter_jsonl()·iter_all()은 Generator 함수")
    check(r["list2"] == [5, 4], "ledger: list_transactions(2)는 최근 2건만(최신순)")
    check(r["search"] == ["list", [4, 1]], "ledger: search()는 조건에 맞는 거래를 모두 리스트로(최신순)")
    check(r["export"] == 5, "ledger: export_csv()는 5건을 씀")
    check(r["get_by_id"] == 2, "ledger: get_by_id(2)가 도중에 return")
    print(f"INFO ledger get_by_id() 반환 뒤 파일이 닫혔나: {r['get_by_id_closed']} ({platform.python_implementation()} 관찰, 언어 보장 아님)")
    src = open(os.path.join(LEDGER, "ledger", "repository.py"), encoding="utf-8").read() + open(os.path.join(LEDGER, "ledger", "services.py"), encoding="utf-8").read()
    tree = ast.parse(src)
    fns = {n.name: n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)}
    has = lambda fn, pred: any(pred(n) for n in ast.walk(fns[fn]))
    check(has("list_transactions", lambda n: isinstance(n, ast.Call) and getattr(n.func, "id", "") == "deque"), "ledger AST: list_transactions()는 deque(maxlen=…)")
    check(has("search", lambda n: isinstance(n, ast.Attribute) and n.attr == "append"), "ledger AST: search()는 결과를 append()로 모음")
    for fn in ("update", "delete"):
        check(has(fn, lambda n: isinstance(n, ast.Attribute) and n.attr == "append") and has(fn, lambda n: isinstance(n, ast.Call) and getattr(n.func, "id", "") == "_atomic_write_jsonl"),
              f"ledger AST: {fn}()은 records 리스트를 모은 뒤 _atomic_write_jsonl()")
    exp = fns["export_csv"]
    loops = [n for n in ast.walk(exp) if isinstance(n, ast.For) and isinstance(n.iter, ast.Call) and getattr(n.iter.func, "attr", "") == "iter_all"]
    check(len(loops) == 1 and any(isinstance(n, ast.Attribute) and n.attr == "writerow" for n in ast.walk(loops[0]))
          and not has("export_csv", lambda n: isinstance(n, ast.Call) and getattr(n.func, "id", "") == "list"), "ledger AST: export_csv()는 iter_all() 순회 안에서 바로 writerow(), list() 없음")
    gb = fns["get_by_id"]
    check(any(isinstance(n, ast.For) and any(isinstance(m, ast.Return) for m in ast.walk(n)) for n in ast.walk(gb)), "ledger AST: get_by_id()는 iter_all() 순회 도중 return")
    shutil.rmtree(LX, ignore_errors=True)

# ── 11. 저장소 데모 폴더 ───────────────────────────────────────────
check(digest() == before, "저장소 데모 폴더의 파일 목록·데이터 파일 내용이 실행 전후로 같음")
shutil.rmtree(WORK, ignore_errors=True)
print(f"\n결과: {'FAIL ' + str(len(fails)) + '건' if fails else 'PASS'}")
sys.exit(1 if fails else 0)
