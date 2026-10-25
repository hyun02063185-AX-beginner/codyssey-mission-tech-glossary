"""Scene 03-B 원고·데모·그림 정합성 검사.

1. 원고(script.md)의 `<!-- demo:경로 -->` 코드 블록이 _tools/demo/의 실제 파일과 글자까지 같은지
2. 원고의 `<!-- run: 명령 | exit=N -->` 출력 블록을 실제로 실행해, 줄 전체가 같고 종료 코드가 같은지
3. 그림 A의 행(처음 상태·C·R·U·D)·바뀐 행·이전 값이 crud_basics.py 실행 출력과 같은지, 카드의 코드가 실제 코드 줄인지
4. 그림 A의 검색 결과·요약 값·'원본 그대로'가 search_summary.py 실행 출력과 같은지
5. 그림 B의 호출 순서·부른 쪽(data-call)과 return(data-return)이 `python -m cashbook update --id 2 --amount 7000` 호출 추적과 같은지,
   실패 두 경우(없는 id, 금액 0)에서 어디까지 호출되는지, 그림의 실행 결과(data-out)가 실제 출력과 같은지
6. 책임 분리(AST): print()는 cli.py에만, 저장된 목록(self._items)을 바꾸는 코드와 tx.amount 대입은 repository.py에만 있는지
7. 기능별 책임 표: CLI 옵션·서비스 메서드·저장소 메서드가 실제로 있고, 서비스 메서드가 그 저장소 메서드를 부르는지

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
PKG = os.path.join(DEMO, "cashbook")
SCRIPT = os.path.join(SCENE, "script.md")
SVGS = [os.path.join(SCENE, f) for f in ("crud-flow-desktop.svg", "crud-flow-mobile.svg")]
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUNBUFFERED="1")
sys.stdout.reconfigure(encoding="utf-8")
fails = []

# 호출 추적: 데모 패키지 함수의 call/return 사건을 부른 쪽·돌려준 값과 함께 기록한다(클래스 본문·모듈 최상위 제외)
TRACER = r'''
import json, runpy, sys
ev = []
def name(f):
    return f.f_globals.get("__name__", "") + ":" + f.f_code.co_qualname
def prof(frame, event, arg):
    mod = frame.f_globals.get("__name__", "")
    q = frame.f_code.co_qualname
    if event in ("call", "return") and mod.startswith("cashbook") and not q.startswith("<") and ("." in q or q[0].islower()):
        ret = None if event == "call" else (None if arg is None else type(arg).__name__)
        ev.append([event, name(frame), name(frame.f_back) if frame.f_back else "", ret])
sys.argv = ["cashbook"] + sys.argv[1:]
sys.setprofile(prof)
try:
    runpy.run_module("cashbook", run_name="__main__", alter_sys=True)
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


def trace(*argv):
    p = subprocess.run([sys.executable, "-c", TRACER, *argv], cwd=DEMO, env=ENV, capture_output=True, text=True, encoding="utf-8")
    return json.loads(p.stdout.split("@@", 1)[1])


def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond:
        fails.append(msg)


def blocks_of(out):
    """`== 제목 (N건)` 아래 들여 쓴 줄을 제목별 목록으로."""
    found, cur = {}, None
    for ln in out.split("\n"):
        m = re.match(r"== (.+) \((\d+)건\)$", ln)
        if m:
            cur = m.group(1)
            found[cur] = []
        elif cur and ln.startswith("  "):
            found[cur].append(ln.strip())
        else:
            cur = None
    return found


def dict_row(line, prefix):
    """`[C] 추가: {...}` 줄의 딕셔너리를 그림의 행 글자로."""
    d = ast.literal_eval(line.split(prefix, 1)[1].strip())
    return f'{d["id"]} | {d["type"]} | {d["category"]} | {d["amount"]}'


def svg_rows(root, op):
    return [g for g in root.iter() if g.get("data-op") == op and g.get("data-row")]


src = open(SCRIPT, encoding="utf-8").read()
spec = importlib.util.spec_from_file_location("s3bbuild", os.path.join(HERE, "build.py"))
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)
roots = [(os.path.basename(p), ET.parse(p).getroot()) for p in SVGS]

# 1. 코드 블록 = 데모 파일
blocks = re.findall(r"<!-- demo:(\S+) -->\s*```python\n(.*?)```", src, re.S)
for rel, code in blocks:
    with open(os.path.join(DEMO, rel), encoding="utf-8") as f:
        check(f.read() == code, f"원고 코드 = 데모 파일: {rel}")
names = sorted(rel for rel, _ in blocks)
want = sorted(["data_basics.py", "why_id.py", "crud_basics.py", "search_summary.py"] +
              [f"cashbook/{n}" for n in ("__init__.py", "__main__.py", "models.py", "repository.py", "services.py", "cli.py")])
check(names == want, f"원고에 데모 파일 10개가 모두 있음: {names}")

# 2. 출력 블록 = 실제 실행
runs = re.findall(r"<!-- run: (.+?) \| exit=(\d+) -->\s*```text\n(.*?)```", src, re.S)
for cmd, code, block in runs:
    lines = block.rstrip("\n").split("\n")
    assert lines[0] == f"$ {cmd}", lines[0]
    rc, out = run(cmd)
    actual = [ln.rstrip() for ln in out.rstrip("\n").split("\n")]
    check([ln.rstrip() for ln in lines[1:]] == actual and rc == int(code), f"실행 출력 일치: {cmd} (종료 코드 {rc})")
check(len(runs) >= 10, f"원고의 실행 출력 블록 {len(runs)}개")

# 3. 그림 A: CRUD 상태 = crud_basics.py 실행 출력
rc, out = run("python crud_basics.py")
blk = blocks_of(out)
lines = out.split("\n")
pick = lambda tag: next(ln for ln in lines if ln.startswith(tag))
initial = [b.rowtext(r) for r in b.INITIAL]
check(blk["처음 상태"] == initial, f"그림 A 처음 상태 = 실행 출력 '처음 상태' {initial}")
expect = {  # op: (그 카드의 남은 행 = 출력 블록, 표시한 행의 id, 표시 행 = 출력 줄)
    "create": (blk["추가 후"], "add", dict_row(pick("[C] 추가:"), "[C] 추가:")),
    "read": (blk["추가 후"], "sel", dict_row(pick("[R] id 2 조회:"), "[R] id 2 조회:")),
    "update": (blk["수정 후"], "upd", next(r for r in blk["수정 후"] if r.startswith("2 |"))),
    "delete": (blk["삭제 후"], "del", dict_row(pick("[D] 삭제:"), "[D] 삭제:")),
}
old_new = re.search(r"\[U\] id 2 금액: (\d+) → (\d+)", out).groups()
crud_src = open(os.path.join(DEMO, "crud_basics.py"), encoding="utf-8").read()
for name, root in roots:
    check([g.get("data-rowtext") for g in svg_rows(root, "initial")] == initial, f"{name}: 처음 상태 행 = 실행 출력")
    for op, (remain, mark, marked) in expect.items():
        rows = svg_rows(root, op)
        kept = [g.get("data-rowtext") for g in rows if g.get("data-change") != "del"]
        marks = [g for g in rows if g.get("data-change") != "none"]
        ok = kept == remain and len(marks) == 1 and marks[0].get("data-change") == mark and marks[0].get("data-rowtext") == marked
        if op == "update":
            ok = ok and marks[0].get("data-old") == old_new[0] and marked.endswith(old_new[1])
        check(ok, f"{name}: 그림 A {op} 카드 행·표시({mark} {marked}) = 실행 출력")
for op, letter, title, code, *_ in b.CRUD:
    check(code in crud_src, f"그림 A {op} 카드 코드가 crud_basics.py에 있음: {code}")
dict_line = "".join(b.DICT_CODE)
check(any(ln.strip().rstrip(",") == dict_line.replace("\n", "") for ln in crud_src.split("\n")), f"'데이터를 담는 모양'의 딕셔너리 = crud_basics.py의 실제 줄")
check(pick("[R] id 3 조회:").endswith("None") and pick("[D] 없는 id 9 삭제:").startswith("[D] 없는 id 9 삭제: None") and "4건 그대로" in pick("[D] 없는 id 9 삭제:"),
      "없는 id: 조회·삭제 모두 None, 목록 개수 그대로")

# 4. 그림 A: 검색·요약 = search_summary.py 실행 출력
rc, out = run("python search_summary.py")
blk = blocks_of(out)
ss_src = open(os.path.join(DEMO, "search_summary.py"), encoding="utf-8").read()
titles = {"search-category": "검색: category가 식비", "search-amount": "검색: amount가 5000 이상"}
summary = ast.literal_eval(next(ln for ln in out.split("\n") if ln.startswith("[요약]")).split("[요약]", 1)[1].strip())
want_summary = sorted([f"지출 합계={summary['지출 합계']}", f"지출 건수={summary['지출 건수']}", f"지출 평균={summary['지출 평균']}",
                       "분류별 지출=" + " · ".join(f"{k} {v}" for k, v in summary["분류별 지출"].items())])
check(blk["검색·요약 뒤 원본"] == initial, "검색·요약 뒤 원본 = 처음 4건 그대로")
for name, root in roots:
    for op, title in titles.items():
        check([g.get("data-rowtext") for g in svg_rows(root, op)] == blk[title], f"{name}: {op} 결과 = 실행 출력 '{title}'")
    got = sorted(e.get("data-summary") for e in root.iter() if e.get("data-summary"))
    check(got == want_summary, f"{name}: 요약 값 = 실행 출력 {want_summary}")
    src_rows = [g.get("data-rowtext") for g in svg_rows(root, "source")]
    check(src_rows in ([], initial), f"{name}: 원본 표(있다면) = 처음 4건")
    check([e.get("data-original") for e in root.iter() if e.get("data-original")] == [str(len(blk["검색·요약 뒤 원본"]))], f"{name}: '원본 4건 그대로' = 실행 출력")
for op, title, code, rows in b.SEARCHES:
    check(code in ss_src, f"검색 카드 코드가 search_summary.py에 있음: {code}")
check(b.SUMMARY_CODE in ss_src, f"요약 카드 코드가 search_summary.py에 있음: {b.SUMMARY_CODE}")

# 5. 그림 B: 호출·return = 추적, 실패 경우, 실행 결과
events = trace("update", "--id", "2", "--amount", "7000")
fid = {"cashbook.cli:main": "main", "cashbook.cli:build_parser": "build", "cashbook.repository:TransactionRepository.__init__": "repo",
       "cashbook.models:Transaction.__init__": "tx", "cashbook.services:TransactionService.__init__": "service",
       "cashbook.services:TransactionService.change_amount": "change", "cashbook.repository:TransactionRepository.update_amount": "update",
       "cashbook.repository:TransactionRepository.get": "get", "cashbook.cli:format_row": "format"}
calls, seen = [], set()
for ev, who, caller, _ in events:
    if ev == "call" and who in fid and fid[who] not in seen:
        seen.add(fid[who])
        calls.append((fid.get(caller, "entry" if caller.endswith("<module>") else caller), fid[who]))
check(calls[0] == ("entry", "main"), f"호출 추적 첫 호출 = __main__.py → main(): {calls[0]}")
check(len(calls) == len(b.CALL_NODES) and [c for _, c in calls] == [n for n, *_ in b.CALL_NODES], f"호출 노드 순서 = 추적 {[c for _, c in calls]}")
expect_calls = sorted(f"{a}>{c}@{i + 1}" for i, (a, c) in enumerate(calls) if a != "entry")
expect_rets = sorted({f"{fid[w]}>{fid[c]}" for ev, w, c, _ in events if ev == "return" and w in fid and fid[w] in ("get", "update", "change")})
for name, root in roots:
    check(sorted(e.get("data-call") for e in root.iter() if e.get("data-call")) == expect_calls, f"{name}: 호출·부른 쪽·번호 = 추적 {expect_calls}")
    check(sorted(e.get("data-return") for e in root.iter() if e.get("data-return")) == expect_rets, f"{name}: return = 추적 {expect_rets}")
ev9 = trace("update", "--id", "9", "--amount", "7000")
get_ret = [r for ev, w, _, r in ev9 if ev == "return" and w.endswith("TransactionRepository.get")]
check(get_ret == [None] and not any(w.endswith("format_row") for _, w, _, _ in ev9), "없는 id 9: get()이 None을 돌려주고 결과 표시(format_row)는 호출되지 않음")
ev0 = trace("update", "--id", "2", "--amount", "0")
called0 = {w.split(":")[1] for ev, w, _, _ in ev0 if ev == "call"}
check("TransactionService.change_amount" in called0 and "TransactionRepository.update_amount" not in called0, "금액 0: 서비스 change_amount()에서 멈추고 저장소 update_amount()는 호출되지 않음")
expected_outs = []
for cmd in ["python -m cashbook update --id 2 --amount 7000"] + [c for _, c, _, _ in b.BRANCHES] + [c for c, _ in b.BRIDGE_RUNS]:
    expected_outs += run(cmd)[1].rstrip("\n").split("\n")
check([b.RESULT] + [o for _, _, o, _ in b.BRANCHES] + [ln for _, outs in b.BRIDGE_RUNS for ln in outs] == expected_outs,
      "그림 B의 실행 결과·실패 경우·다음 질문 출력 = 실제 실행 순서대로")
for name, root in roots:
    got = sorted(e.get("data-out") for e in root.iter() if e.get("data-out"))
    check(got == sorted(expected_outs), f"{name}: 그림의 실행 결과 줄(data-out) = 실제 출력 {len(expected_outs)}줄")
bridge_list = run("python -m cashbook list")[1]
check("5 |" not in bridge_list, "메모리: add 실행 뒤 따로 실행한 list에 id 5가 없음")

# 6. 책임 분리(AST)
trees = {m: ast.parse(open(os.path.join(PKG, f"{m}.py"), encoding="utf-8").read()) for m in ("models", "repository", "services", "cli")}
prints, items_mut, amount_set = set(), set(), set()
for m, tree in trees.items():
    for fn in [n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)]:
        where = f"{m}.{fn.name}"
        for n in ast.walk(fn):
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == "print":
                prints.add(m)
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute) and n.func.attr in ("append", "remove", "pop", "insert", "clear"):
                v = n.func.value
                if isinstance(v, ast.Attribute) and v.attr == "_items":
                    items_mut.add(where)
            if isinstance(n, ast.Assign):
                for t in n.targets:
                    if isinstance(t, ast.Attribute) and t.attr == "amount" and not (isinstance(t.value, ast.Name) and t.value.id == "self"):
                        amount_set.add(where)
check(prints == {"cli"}, f"print()는 CLI(cli.py)에만: {sorted(prints)}")
check(items_mut == {"repository.add", "repository.delete"}, f"저장된 목록(self._items)을 바꾸는 코드는 저장소에만: {sorted(items_mut)}")
check(amount_set == {"repository.update_amount"}, f"거래 금액 대입(tx.amount = …)은 저장소 update_amount()에만: {sorted(amount_set)}")

# 7. 기능별 책임 표
cli_src = open(os.path.join(PKG, "cli.py"), encoding="utf-8").read()
methods = {}
for cls in [n for t in trees.values() for n in ast.walk(t) if isinstance(n, ast.ClassDef)]:
    for fn in [n for n in cls.body if isinstance(n, ast.FunctionDef)]:
        called = {n.func.attr for n in ast.walk(fn) if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute)
                  and isinstance(n.func.value, ast.Attribute) and n.func.value.attr == "repository"}
        methods[(cls.name, fn.name)] = called
for feat, label, (opts, _), (svc, _), (repo, _) in b.MATRIX:
    have = re.findall(rf'p_{feat}\.add_argument\("(--[a-z]+)"', cli_src)
    want_opts = [] if opts == "옵션 없음" else opts.split()
    sub_ok = f'sub.add_parser("{feat}"' in cli_src or f'p_{feat} = sub.add_parser("{feat}"' in cli_src
    s_name, r_name = svc.rstrip("()"), repo.rstrip("()")
    ok = (sub_ok and have == want_opts and ("TransactionService", s_name) in methods and ("TransactionRepository", r_name) in methods
          and r_name in methods[("TransactionService", s_name)])
    check(ok, f"책임 표 {label}: 하위 명령 {feat} 옵션 {want_opts}, 서비스 {s_name}() → 저장소 {r_name}()")
for name, root in roots:
    got = sorted(e.get("data-duty") + "=" + e.get("data-code") for e in root.iter() if e.get("data-duty"))
    want_d = sorted(f"{f}:{lid}={code}" for f, _, cli, svc, repo in b.MATRIX for lid, (code, _) in (("cli", cli), ("service", svc), ("repo", repo)))
    check(got == want_d, f"{name}: 책임 표 칸 = 생성기 MATRIX ({len(want_d)}칸)")

print(f"\n결과: {'FAIL ' + str(len(fails)) + '건' if fails else 'PASS'}")
sys.exit(1 if fails else 0)
