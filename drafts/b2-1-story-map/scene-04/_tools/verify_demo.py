"""Scene 04 원고·데모·파일·그림 정합성 검사.

1. 원고(script.md)의 `<!-- demo:경로 -->` 코드 블록이 _tools/demo/의 실제 파일과 글자까지 같은지, 데모 파일이 모두 원고에 있는지
2. 데모를 **임시 폴더(저장소 밖)의 practice/** 에 복사하고, 원고의 `<!-- run … -->` 블록을 원고 순서대로 실제로 실행해
   출력(줄 전체)과 종료 코드가 같은지. 한 블록의 `$` 줄마다 따로 실행한다(= 프로그램 실행 한 번씩, 실행 사이에 메모리는 이어지지 않음).
   `cwd=..`는 practice/의 상위 폴더에서 실행한다
3. 원고의 `<!-- file: 경로 -->` 블록이 그 시점의 실제 파일 내용과 같은지(`@end`가 붙은 블록은 실행을 마친 뒤의 내용과 대조)
4. 그림 A: 칸(data-cell)의 상태·id·새 id가 실행 출력과 실행 전후의 실제 파일 상태와 같은지, 저장하지 않는 프로그램은 파일을 만들지 않는지,
   실행 결과 줄(data-out·data-run)이 그 명령의 실제 출력 줄인지
5. 그림 B: 세 형식의 줄이 데모가 만든 파일과 같은지, 세 형식을 해석하면 같은 거래 3건인지, 강조한 줄(data-hl)이 거래 id 2인지,
   amount의 종류(data-amount)가 실제 해석 결과와 같은지
6. 그림 C-1: 파일 4줄 = transactions.jsonl, 4행 = "a"로 쓴 새 거래의 직렬화, 읽은 결과(data-read)와 결과 줄(data-out) = 실행 출력
7. 그림 C-2: 처리 순서(data-step-fn) = `update 2 2500`의 호출 추적(load_all → update_amount → save_all → os.replace),
   수정 전·임시 파일·수정 후 줄 = 실제 파일(임시 파일은 os.replace 직전에 읽음), 바뀐 값(data-upd), 교체 뒤 .tmp 없음
8. AST: 텍스트 모드 open()·read_text()에 encoding="utf-8", CSV 파일은 newline="", file_crud.py의 print()는 main()에만,
   os.replace는 save_all()에만, "a"는 append_one()에만, "w"는 save_all()에만, 메모리 CRUD 함수는 파일을 다루지 않음
9. 기술 사실 확인(임시 폴더): 기본 인코딩(보고), 없는 폴더에 "w" → FileNotFoundError, "a"는 새 파일 생성, "w"는 여는 순간 비움,
   JSON 키 → 문자열, JSONL 줄의 \\r\\n 허용, csv 따옴표 규칙, newline="" 없이 쓴 CSV(Windows에서 \\r\\r\\n과 빈 행)
10. (선택) ledger 구현 사례: LEDGER_REPO(기본: 저장소 옆 m03-pocket-money-ledger)가 있으면 임시 폴더에서 실행해 원고 10절의 사실을 확인. 없으면 SKIP
11. 저장소의 데모 폴더에 실행 결과 파일이 생기지 않았는지

실행: python -I verify_demo.py   (데모는 학습자처럼 python 명령으로 실행한다)
"""
import ast
import csv
import io
import json
import locale
import os
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
SVGS = [os.path.join(SCENE, f) for f in ("file-persistence-desktop.svg", "file-persistence-mobile.svg")]
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUNBUFFERED="1")
sys.stdout.reconfigure(encoding="utf-8")
fails = []
RECORDS = [{"id": 1, "category": "식비", "amount": 8000}, {"id": 2, "category": "교통", "amount": 2000},
           {"id": 3, "category": "문구", "amount": 3000}]


def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond:
        fails.append(msg)


def text_of(el):
    return "".join(el.itertext())


# ── 1. 원고 블록 ──────────────────────────────────────────────
script = open(SCRIPT, encoding="utf-8").read()
BLOCKS = [(m.group(1), m.group(2)) for m in re.finditer(r"<!-- (demo:\S+|run[^>]*?|file:\s*\S+(?: @end)?) -->\n```[a-z]*\n(.*?)\n```", script, re.S)]
demo_files = sorted(f for f in os.listdir(DEMO) if f.endswith(".py"))
shown = []
for spec, body in BLOCKS:
    if spec.startswith("demo:"):
        name = spec[5:]
        shown.append(name)
        real = open(os.path.join(DEMO, name), encoding="utf-8").read()
        check(real.rstrip("\n") == body, f"원고 코드 = 데모 파일: {name}")
check(sorted(shown) == demo_files, f"데모 파일 {len(demo_files)}개가 모두 원고에 있음")
before_listing = sorted(os.listdir(DEMO))

# ── 2·3. 임시 폴더에서 원고 순서대로 실행 ─────────────────────────────
ROOT = tempfile.mkdtemp(prefix="b21-scene04-")
PRACTICE = os.path.join(ROOT, "practice")
os.makedirs(PRACTICE)
for f in demo_files:
    shutil.copy(os.path.join(DEMO, f), PRACTICE)
DATA = os.path.join(PRACTICE, "data", "transactions.jsonl")


def file_ids(path=DATA):
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return [json.loads(ln)["id"] for ln in f if ln.strip()]


def run(cmd, cwd):
    args = cmd.split()
    if args[0] == "python":
        args[0] = sys.executable
    p = subprocess.run(args, cwd=cwd, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    return p.returncode, p.stdout.replace("\r\n", "\n").rstrip("\n").split("\n") if p.stdout.strip() else []


EVENTS, DEFERRED = [], []
n_run = n_file = 0
for spec, body in BLOCKS:
    if spec.startswith("run"):
        m = re.match(r"run(?::\s*(.*?))?\s*\|\s*exit=(\d+)(?:\s*\|\s*cwd=(\S+))?\s*$", spec)
        marker_cmd, want_exit, cwd_opt = m.group(1), int(m.group(2)), m.group(3)
        cwd = os.path.dirname(PRACTICE) if cwd_opt == ".." else PRACTICE
        segs = []
        for ln in body.split("\n"):
            if ln.startswith("$ "):
                segs.append([ln[2:], []])
            else:
                segs[-1][1].append(ln)
        runs = [sg for sg in segs if not sg[0].startswith("cd ")]
        if marker_cmd:
            check(len(runs) == 1 and runs[0][0] == marker_cmd, f"run 표시 명령 = 블록의 $ 줄: {marker_cmd}")
        for cmd, want in runs:
            before = file_ids()
            listing = sorted(os.listdir(PRACTICE))
            code, out = run(cmd, cwd)
            EVENTS.append({"cmd": cmd, "out": out, "code": code, "before": before, "after": file_ids(),
                           "listing_before": listing, "listing_after": sorted(os.listdir(PRACTICE))})
            n_run += 1
            check(out == want and code == want_exit, f"실행 출력·종료 코드 = 원고: $ {cmd} (exit {code})")
            if out != want:
                print("   기대:", want, "\n   실제:", out)
    elif spec.startswith("file:") and spec.endswith("@end"):
        DEFERRED.append((spec[5:-4].strip(), body))
    elif spec.startswith("file:"):
        rel = spec[5:].strip()
        path = os.path.join(PRACTICE, rel)
        real = open(path, encoding="utf-8").read() if os.path.exists(path) else None
        n_file += 1
        check(real is not None and real.rstrip("\n") == body, f"원고 파일 블록 = 그 시점의 실제 파일: {rel}")
for rel, body in DEFERRED:
    real = open(os.path.join(PRACTICE, rel), encoding="utf-8").read()
    n_file += 1
    check(real.rstrip("\n") == body, f"원고 파일 블록(@end) = 실행을 마친 뒤의 실제 파일: {rel}")
check(n_run >= 15 and n_file >= 5, f"실행 {n_run}번, 파일 대조 {n_file}개")


def event(cmd, after=None):
    """cmd를 실행한 사건(after가 있으면 그 사건 뒤의 첫 번째)."""
    start = EVENTS.index(after) + 1 if after else 0
    return next(e for e in EVENTS[start:] if e["cmd"] == cmd)


def ids_in(line):
    return [int(x) for x in re.search(r"id \[(.*)\]", line).group(1).split(", ")]


# ── 그림 공통 ─────────────────────────────────────────────────
roots = {}
for svg in SVGS:
    try:
        roots[svg] = ET.parse(svg).getroot()
        check(True, f"SVG XML 구문: {os.path.basename(svg)}")
    except ET.ParseError as error:
        check(False, f"SVG XML 구문: {os.path.basename(svg)} ({error})")


def els(root, attr):
    return [e for e in root.iter() if e.get(attr) is not None]


# ── 4. 그림 A ───────────────────────────────────────────────
add_m, plain_m = event("python memory_only.py add"), event("python memory_only.py")
check(add_m["listing_before"] == add_m["listing_after"] and plain_m["listing_before"] == plain_m["listing_after"],
      "memory_only.py는 실행 폴더에 파일을 만들지 않음")
m_add_ids, m_plain_ids = ids_in(add_m["out"][-1]), ids_in(plain_m["out"][-1])
add_s = event("python file_crud.py add 문구 3000")
list_s = event("python file_crud.py list", after=add_s)
new_id = ast.literal_eval(add_s["out"][-1].split(": ", 1)[1])["id"]
check(add_s["out"][0] == f"파일에서 읽음: {len(add_s['before'])}건", "file_crud 실행 1이 읽은 건수 = 실행 전 파일 줄 수")
listed = [int(ln.split("|")[0]) for ln in list_s["out"][1:]]
NONE, GONE = ("none", ""), ("gone", "")
EXPECT_A = {
    "nosave": [(("ids", m_plain_ids), NONE), (("ids", m_add_ids), NONE), (("ids", m_add_ids), NONE), (GONE, NONE),
               (("ids", m_plain_ids), NONE), (("ids", m_plain_ids), NONE)],
    "save": [(("ids", add_s["before"]), ("ids", add_s["before"])), (("ids", add_s["before"] + [new_id]), ("ids", add_s["before"])),
             (("ids", add_s["before"] + [new_id]), ("ids", add_s["after"])), (GONE, ("ids", add_s["after"])),
             (("ids", list_s["before"]), ("ids", list_s["before"])), (("ids", listed), ("ids", list_s["after"]))],
}
NEW_AT = {("nosave", 2, "memory"): sorted(set(m_add_ids) - set(m_plain_ids)), ("save", 2, "memory"): [new_id],
          ("save", 3, "file"): sorted(set(add_s["after"]) - set(add_s["before"]))}
for svg, root in roots.items():
    tag = os.path.basename(svg)
    cells = {e.get("data-cell"): e for e in els(root, "data-cell")}
    bad = []
    for row, steps in EXPECT_A.items():
        for k, (mem, fil) in enumerate(steps, start=1):
            for lane, (state, ids) in (("memory", mem), ("file", fil)):
                e = cells.get(f"{row}:{k}:{lane}")
                got = (e.get("data-state"), e.get("data-ids")) if e is not None else None
                want = (state, ",".join(map(str, ids)) if state == "ids" else "")
                new_want = NEW_AT.get((row, k, lane))
                new_got = e.get("data-new") if e is not None else None
                if got != want or (new_want and [int(new_got or 0)] != new_want) or (not new_want and new_got):
                    bad.append(f"{row}:{k}:{lane} {got}/{new_got} ≠ {want}/{new_want}")
    check(len(cells) == 24 and not bad, f"{tag}: 그림 A 칸 24개 = 실행 출력·파일 상태 " + "; ".join(bad))
    outs = [(e.get("data-out"), e.get("data-run")) for e in els(root, "data-run")]
    ok = all(any(o in ev["out"] for ev in EVENTS if ev["cmd"] == r) for o, r in outs)
    check(len(outs) == 4 and ok, f"{tag}: 그림 A 실행 결과 줄 4개 = 그 명령의 실제 출력")

# ── 5. 그림 B ───────────────────────────────────────────────
real_lines = {
    "json": open(os.path.join(PRACTICE, "transactions.json"), encoding="utf-8").read().rstrip("\n").split("\n"),
    "jsonl": open(os.path.join(PRACTICE, "transactions.jsonl"), encoding="utf-8").read().rstrip("\n").split("\n")[:3],
    "csv": open(os.path.join(PRACTICE, "transactions.csv"), encoding="utf-8").read().rstrip("\n").split("\n"),
}
csv_rows = [dict(r, id=int(r["id"]), amount=int(r["amount"])) for r in csv.DictReader(io.StringIO("\n".join(real_lines["csv"])))]
check(json.loads("\n".join(real_lines["json"])) == RECORDS and [json.loads(x) for x in real_lines["jsonl"]] == RECORDS
      and csv_rows == RECORDS, "세 형식 파일을 해석하면 같은 거래 3건(CSV는 int 변환 뒤)")
amount_type = {"json": type(json.loads("\n".join(real_lines["json"]))[0]["amount"]).__name__,
               "jsonl": type(json.loads(real_lines["jsonl"][0])["amount"]).__name__,
               "csv": type(next(csv.DictReader(io.StringIO("\n".join(real_lines["csv"]))))["amount"]).__name__}


def lines_of(root, fmt):
    g = next(e for e in root.iter() if e.get("data-format") == fmt)
    return [text_of(t) for t in sorted((t for t in g.iter() if t.get("data-line")), key=lambda t: int(t.get("data-line")))]


def hl_record(fmt, lines, a, b):
    part = lines[a - 1:b]
    if fmt == "json":
        return json.loads("\n".join(part).strip().rstrip(","))
    if fmt == "jsonl":
        return json.loads(part[0])
    return next(csv.DictReader(io.StringIO("\n".join([lines[0]] + part))))


for svg, root in roots.items():
    tag = os.path.basename(svg)
    for fmt in ("json", "jsonl", "csv"):
        check(lines_of(root, fmt) == real_lines[fmt], f"{tag}: 그림 B {fmt} 줄 = 데모가 만든 파일({len(real_lines[fmt])}줄)")
    cards = {e.get("data-fmtcard"): e.get("data-amount") for e in els(root, "data-fmtcard")}
    check(cards == amount_type, f"{tag}: amount의 종류 {cards} = 실제 해석 {amount_type}")
    hls = {e.get("data-box").split("-")[1]: tuple(map(int, e.get("data-hl-lines").split("-"))) for e in els(root, "data-hl")}
    got = {f: str(hl_record(f, real_lines[f], *hls[f])["id"]) for f in hls}
    check(sorted(hls) == ["csv", "json", "jsonl"] and set(got.values()) == {"2"}, f"{tag}: 강조한 줄 {hls} = 거래 id 2")

# ── 6. 그림 C-1 ──────────────────────────────────────────────
jsonl_all = open(os.path.join(PRACTICE, "transactions.jsonl"), encoding="utf-8").read().rstrip("\n").split("\n")
jl = event("python jsonl_basics.py")
new_line = json.dumps({"id": 4, "category": "식비", "amount": 5000}, ensure_ascii=False, separators=(",", ":"))
read_tails = [ln.split("json.loads() → ", 1)[1] for ln in jl["out"] if "json.loads() → " in ln]
for svg, root in roots.items():
    tag = os.path.basename(svg)
    check(lines_of(root, "c1") == jsonl_all and jsonl_all[3] == new_line, f"{tag}: C-1 파일 4줄 = transactions.jsonl, 4행 = 새 거래 직렬화")
    check([e.get("data-newline") for e in els(root, "data-newline")] == [new_line], f"{tag}: C-1 str 상자 = 4행")
    reads = sorted(els(root, "data-read"), key=lambda e: int(e.get("data-read")))
    check(len(reads) == 4 and all(text_of(e).endswith(t) for e, t in zip(reads, read_tails)), f"{tag}: C-1 읽은 결과 4개 = 실행 출력")
    c1_outs = [e.get("data-out") for e in els(root, "data-out") if e.get("data-run") is None and "json" in e.get("data-out") or "한꺼번에" in (e.get("data-out") or "")]
    check(len(c1_outs) == 2 and all(o in jl["out"] for o in c1_outs), f"{tag}: C-1 결과 줄 2개 = 실행 출력")

# ── 7. 그림 C-2: 호출 추적 ────────────────────────────────────────
TRACER = r'''
import json, os, runpy, sys
ev = []
def prof(frame, event, arg):
    if event == "call" and frame.f_code.co_filename.endswith("file_crud.py") and frame.f_code.co_name != "<module>":
        ev.append(["call", frame.f_code.co_name, frame.f_back.f_code.co_name if frame.f_back else ""])
    elif event == "c_call" and getattr(arg, "__name__", "") == "replace" and frame.f_code.co_name == "save_all":
        src = frame.f_locals["temp"]
        ev.append(["c_call", "replace", "save_all", open(src, encoding="utf-8").read()])
sys.argv = ["file_crud.py"] + sys.argv[1:]
sys.setprofile(prof)
try:
    runpy.run_path("file_crud.py", run_name="__main__")
except SystemExit:
    pass
sys.setprofile(None)
print("@@" + json.dumps(ev, ensure_ascii=False))
'''
TR = tempfile.mkdtemp(prefix="b21-scene04-trace-")
shutil.copy(os.path.join(DEMO, "file_crud.py"), TR)
for c in ("add 식비 8000", "add 교통 2000", "add 문구 3000"):
    run("python file_crud.py " + c, TR)
before_tr = open(os.path.join(TR, "data", "transactions.jsonl"), encoding="utf-8").read().rstrip("\n").split("\n")
p = subprocess.run([sys.executable, "-c", TRACER, "update", "2", "2500"], cwd=TR, env=ENV, capture_output=True, text=True, encoding="utf-8")
trace = json.loads(p.stdout.split("@@", 1)[1])
after_tr = open(os.path.join(TR, "data", "transactions.jsonl"), encoding="utf-8").read().rstrip("\n").split("\n")
main_calls = [e[1] for e in trace if e[0] == "call" and e[2] == "main"]
save_seq = [e[1] for e in trace if e[2] == "save_all"]
temp_text = next(e[3] for e in trace if e[0] == "c_call").rstrip("\n").split("\n")
check(main_calls == ["load_all", "update_amount", "save_all"], f"추적: main()이 부른 순서 {main_calls}")
check(save_seq[-1] == "replace" and save_seq.count("to_line") == 3, f"추적: save_all()은 to_line() 3번 뒤 os.replace() ({save_seq})")
check(not [f for f in os.listdir(os.path.join(TR, "data")) if f.endswith(".tmp")], "교체 뒤 data/에 .tmp가 남지 않음")
up = event("python file_crud.py update 2 2500")
order = ["load_all", "update_amount", "save_all", "replace"]
for svg, root in roots.items():
    tag = os.path.basename(svg)
    steps = sorted(e.get("data-step-fn").split(":") for e in els(root, "data-step-fn"))
    check([s[1] for s in steps] == order and [s[0] for s in steps] == ["1", "2", "3", "4"], f"{tag}: C-2 처리 순서 1~4 = 호출 추적 {order}")
    calls = sorted(els(root, "data-call"), key=lambda e: int(e.get("data-call").split("@")[1]))
    check([e.get("data-call") for e in calls] == ["file0>mem@1", "mem>temp@3", "temp>file1@4"], f"{tag}: C-2 처리 순서 선 3개(① 읽기 ③ 임시 파일 ④ 교체)")
    check(lines_of(root, "c2-before") == before_tr == [json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in RECORDS]
          and before_tr == [json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in RECORDS if r["id"] in up["before"]],
          f"{tag}: C-2 수정 전 = 실제 파일(원고 실행 순서의 update 직전과 같음)")
    check(lines_of(root, "c2-temp") == temp_text, f"{tag}: C-2 임시 파일 = os.replace 직전의 .tmp 내용")
    check(lines_of(root, "c2-after") == after_tr == temp_text, f"{tag}: C-2 수정 후 = 교체된 실제 파일")
    upd = next(e.get("data-upd") for e in els(root, "data-upd"))
    rid, rest = upd.split(":")
    old, new = map(int, rest.split(">"))
    b = next(json.loads(x) for x in before_tr if json.loads(x)["id"] == int(rid))
    a = next(json.loads(x) for x in after_tr if json.loads(x)["id"] == int(rid))
    check((b["amount"], a["amount"]) == (old, new), f"{tag}: C-2 메모리에서 바뀐 값 id {rid}: {old} → {new}")
    out = [e.get("data-out") for e in els(root, "data-out") if e.get("data-out").startswith("[U]")]
    check(out == [up["out"][-1]], f"{tag}: C-2 실행 결과 = 실제 출력")

# ── 8. AST ──────────────────────────────────────────────────
for f in demo_files:
    tree = ast.parse(open(os.path.join(DEMO, f), encoding="utf-8").read())
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            fn = node.func
            name = fn.id if isinstance(fn, ast.Name) else (fn.attr if isinstance(fn, ast.Attribute) else "")
            kw = {k.arg: k.value for k in node.keywords}
            if name in ("open", "read_text"):
                mode = node.args[1].value if name == "open" and len(node.args) > 1 else "r"
                enc = kw.get("encoding")
                check("b" not in mode and isinstance(enc, ast.Constant) and enc.value == "utf-8",
                      f"AST {f}:{node.lineno} {name}()에 encoding=\"utf-8\"")
                target = node.args[0] if node.args else None
                if name == "open" and isinstance(target, ast.Constant) and str(target.value).endswith(".csv"):
                    nl = kw.get("newline")
                    check(isinstance(nl, ast.Constant) and nl.value == "", f"AST {f}:{node.lineno} CSV 파일은 newline=\"\"")
tree = ast.parse(open(os.path.join(DEMO, "file_crud.py"), encoding="utf-8").read())
funcs = {n.name: n for n in tree.body if isinstance(n, ast.FunctionDef)}


def calls_in(fn):
    out = []
    for node in ast.walk(fn):
        if isinstance(node, ast.Call):
            c = node.func
            out.append((c.id if isinstance(c, ast.Name) else c.attr if isinstance(c, ast.Attribute) else "", node))
    return out


where = lambda name: sorted(fn for fn, node in funcs.items() if any(c == name for c, _ in calls_in(node)))
modes = {}
for fn, node in funcs.items():
    for c, call in calls_in(node):
        if c == "open":
            modes.setdefault(call.args[1].value, []).append(fn)
check(where("print") == ["main"], f"AST file_crud.py: print()는 main()에만 {where('print')}")
check(where("replace") == ["save_all"], f"AST file_crud.py: os.replace()는 save_all()에만 {where('replace')}")
check(modes == {"r": ["load_all"], "a": ["append_one"], "w": ["save_all"]}, f"AST file_crud.py: 모드별 open() 위치 {modes}")
mem_fns = ["next_id", "create", "read_one", "update_amount", "delete"]
touch = [fn for fn in mem_fns if any(c in ("open", "load_all", "save_all", "append_one", "dumps", "loads") for c, _ in calls_in(funcs[fn]))]
check(not touch, f"AST file_crud.py: 메모리 CRUD 함수 {len(mem_fns)}개는 파일을 다루지 않음")

# ── 9. 기술 사실 확인 ─────────────────────────────────────────────
FX = tempfile.mkdtemp(prefix="b21-scene04-facts-")
print(f"INFO 이 환경의 기본 인코딩: locale.getencoding() = {locale.getencoding()} (UTF-8 모드 = {sys.flags.utf8_mode})")
try:
    open(os.path.join(FX, "nodir", "x.txt"), "w", encoding="utf-8")
    check(False, '없는 폴더에 "w" → FileNotFoundError')
except FileNotFoundError:
    check(True, '없는 폴더에 "w" → FileNotFoundError')
with open(os.path.join(FX, "new.txt"), "a", encoding="utf-8") as f:
    f.write("x\n")
check(os.path.exists(os.path.join(FX, "new.txt")), '"a"는 없는 파일을 만든다')
with open(os.path.join(FX, "new.txt"), "w", encoding="utf-8"):
    pass
check(os.path.getsize(os.path.join(FX, "new.txt")) == 0, '"w"는 여는 순간 내용을 비운다')
check(json.loads(json.dumps({1: "a"})) == {"1": "a"}, "JSON 객체 키는 문자열로 바뀜")
check(json.loads('{"id":1}\r\n') == {"id": 1}, "JSONL 한 줄 끝의 \\r\\n은 공백으로 무시됨")
buf = io.StringIO()
csv.writer(buf, lineterminator="\n").writerow(["점심, 김밥", '가게 이름 "다이소"', "첫 줄\n둘째 줄", "plain"])
check(buf.getvalue() == '"점심, 김밥","가게 이름 ""다이소""","첫 줄\n둘째 줄",plain\n', "csv 기본 따옴표 규칙(감싸기·두 번 적기·줄바꿈)")
with open(os.path.join(FX, "bad.csv"), "w", encoding="utf-8") as f:
    csv.writer(f).writerow(["1", "a"])
raw = open(os.path.join(FX, "bad.csv"), "rb").read()
with open(os.path.join(FX, "bad.csv"), encoding="utf-8", newline="") as f:
    rows = list(csv.reader(f))
if os.name == "nt":
    check(raw == b"1,a\r\r\n" and rows == [["1", "a"], []], 'Windows: newline="" 없이 쓴 CSV는 \\r\\r\\n, 읽으면 빈 행')
else:
    print(f"INFO newline=\"\" 없이 쓴 CSV: {raw!r} (Windows가 아니라 차이 확인 안 함)")

# ── 10. ledger 구현 사례(선택) ────────────────────────────────────
LEDGER = os.environ.get("LEDGER_REPO", os.path.join(REPO, "..", "m03-pocket-money-ledger"))
if not os.path.isdir(os.path.join(LEDGER, "ledger")):
    print(f"SKIP ledger 구현 사례: {LEDGER} 없음")
else:
    head = subprocess.run(["git", "-C", LEDGER, "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
    print(f"INFO ledger 저장소 {os.path.abspath(LEDGER)} HEAD {head} (원고 기준 d14e812)")
    LX = tempfile.mkdtemp(prefix="b21-scene04-ledger-")
    lenv = dict(ENV, PYTHONPATH=os.path.abspath(LEDGER))
    lrun = lambda args, stdin=None: subprocess.run([sys.executable, "-m", "ledger", *args], cwd=LX, env=lenv, input=stdin,
                                                   capture_output=True, text=True, encoding="utf-8")
    for cat in ("식비", "교통", "문구"):
        lrun(["category", "add"], cat + "\n")
    check(os.path.exists(os.path.join(LX, "data", "categories.jsonl")), "ledger: --data-dir 기본값 data는 실행 위치 기준(임시 폴더 안에 생성)")
    with open(os.path.join(LX, "in.csv"), "w", encoding="utf-8", newline="") as f:
        f.write('date,type,category,amount,memo,tags\n2026-10-01,expense,식비,8000,"점심, 김밥",\n2026-10-02,expense,교통,2000,,\n2026-10-03,expense,문구,3000,,\n')
    r = lrun(["import", "--from", "in.csv"])
    tx = os.path.join(LX, "data", "transactions.jsonl")
    lines = open(tx, encoding="utf-8").read().rstrip("\n").split("\n")
    first = json.loads(lines[0])
    check(r.returncode == 0 and len(lines) == 3 and first["memo"] == "점심, 김밥" and list(first) == ["id", "type", "date", "amount", "category", "memo", "tags"]
          and '", "' in lines[0], "ledger: CSV 가져오기 → JSONL 3줄, 따옴표 값 한 값으로, 기본 구분자(공백 있음)")
    lrun(["update", "--id", "2", "--amount", "2500"])
    lines = open(tx, encoding="utf-8").read().rstrip("\n").split("\n")
    check(json.loads(lines[1])["amount"] == 2500 and not [f for f in os.listdir(os.path.join(LX, "data")) if f.endswith(".tmp")],
          "ledger: update는 파일을 다시 쓰고 .tmp를 남기지 않음")
    lrun(["delete", "--id", "1"])
    check(len(open(tx, encoding="utf-8").read().rstrip("\n").split("\n")) == 2, "ledger: delete 뒤 2줄")
    r = lrun(["export", "--out", os.path.join("out", "oct.csv"), "--month", "2026-10"])
    raw = open(os.path.join(LX, "out", "oct.csv"), "rb").read()
    check(r.returncode == 0 and raw.split(b"\r\n")[0] == b"date,type,category,amount,memo,tags" and b"\r\n" in raw,
          "ledger: 내보내기 CSV 헤더(id 없음)와 줄 끝 \\r\\n")
    shutil.rmtree(LX, ignore_errors=True)

# ── 11. 저장소 데모 폴더 ───────────────────────────────────────────
check(sorted(os.listdir(DEMO)) == before_listing, "저장소 데모 폴더에 실행 결과 파일이 생기지 않음(실행은 임시 폴더에서만)")
for d in (ROOT, TR, FX):
    shutil.rmtree(d, ignore_errors=True)

print(f"\n결과: {'FAIL ' + str(len(fails)) + '건' if fails else 'PASS'}")
sys.exit(1 if fails else 0)
