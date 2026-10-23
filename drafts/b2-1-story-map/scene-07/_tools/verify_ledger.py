"""Scene 07 원고 9절(`ledger` 구현 사례) 검사. 학습용 데모 검사(verify_demo.py)와 분리했다.

1. 저장소 위치·커밋: LEDGER_REPO(기본: 이 저장소 옆 m03-pocket-money-ledger)의 HEAD가 원고 기준 커밋과 같은지. 없으면 SKIP
2. 원고가 인용한 파일·줄 번호마다 그 줄에 인용한 코드가 실제로 있는지
3. 원고에 옮긴 validate_amount 코드(설명 문자열은 '...')가 실제 소스 줄과 같은지
4. ledger/를 **임시 폴더**에 복사하고 빈 data 폴더에 add로 거래 2건을 넣은 뒤, 원고의 `<!-- ledger-run: … -->` 블록을 실행해
   출력(줄 전체)·종료 코드가 같은지, 오류 경우는 표준 출력이 비어 있고 모두 표준 오류인지
5. 원고의 `<!-- ledger-probe -->` 블록 = 실제 함수·클래스를 불러 확인한 결과(validate_amount, Transaction, SearchCriteria, list_transactions('10'))
6. ledger 저장소의 작업 트리(git status)와 운영용 data 폴더가 실행 전후로 같은지

실행: python -I verify_ledger.py   (LEDGER_REPO=<경로>, 다른 폴더의 원고를 검사하려면 SCENE_DIR=<폴더>)
"""
import hashlib
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SCENE = os.environ.get("SCENE_DIR") or os.path.dirname(HERE)
SCRIPT = os.path.join(SCENE, "script.md")
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
LEDGER = os.environ.get("LEDGER_REPO") or os.path.join(os.path.dirname(REPO), "m03-pocket-money-ledger")
BASE = "d14e812"
ENV = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUNBUFFERED="1", PYTHONDONTWRITEBYTECODE="1")
sys.stdout.reconfigure(encoding="utf-8")
fails = []

# 원고가 인용한 줄: (파일, 줄 번호, 그 줄에 있어야 하는 글자)
CITED = [
    ("ledger/cli.py", 32, "DEFAULT_LIST_LIMIT = 10"),
    ("ledger/cli.py", 57, 'p_list.add_argument("--limit", type=int, default=DEFAULT_LIST_LIMIT)'),
    ("ledger/cli.py", 164, "return validate_amount(raw)"),
    ("ledger/cli.py", 202, "transactions = service.list_transactions(args.limit)"),
    ("ledger/services.py", 97, "validated_amount = validate_amount(amount)"),
    ("ledger/services.py", 112, "def list_transactions(self, limit: int) -> list[Transaction]:"),
    ("ledger/services.py", 124, "if limit <= 0:"),
    ("ledger/services.py", 125, 'raise ValidationError(f"limit must be positive, got {limit}")'),
    ("ledger/services.py", 197, "validate_amount(amount)"),
    ("ledger/services.py", 283, "validated_amount = validate_amount(amount)"),
    ("ledger/services.py", 357, 'amount = validate_amount(row.get("amount") or "")'),
    ("ledger/validators.py", 53, "def validate_amount(value: int | str) -> int:"),
    ("ledger/validators.py", 67, "return value"),
    ("ledger/models.py", 22, "@dataclass"),
    ("ledger/models.py", 23, "class Transaction:"),
    ("ledger/models.py", 37, "amount: int  # 양의 정수"),
    ("ledger/models.py", 40, "tags: list[str] = field(default_factory=list)"),
    ("ledger/models.py", 81, "@dataclass"),
    ("ledger/models.py", 82, "class SearchCriteria:"),
    ("ledger/models.py", 98, "category: str | None = None"),
]
FUTURE = ["ledger/cli.py", "ledger/services.py", "ledger/validators.py", "ledger/models.py"]
DOC_NO_MYPY = [("docs/m03-architecture-design.md", "`mypy` 등 정적 검사기는 실행하지 않음"), ("docs/m03-final-qa-report.md", "정적 타입 검사기")]
SEED = [  # (명령 인자, 표준 입력) — 실제 CLI로 넣는다
    (["category", "add"], "식비\n"),
    (["add"], "2026-10-20\nexpense\n식비\n8000\n점심\n\n"),
    (["add"], "2026-10-21\nexpense\n식비\n4500\n커피\n카페\n"),
]
PROBE = r'''
import datetime, sys, tempfile
from pathlib import Path
from ledger.validators import validate_amount
from ledger.models import Transaction, SearchCriteria
from ledger.services import LedgerService
from ledger.repository import TransactionRepository, CategoryRepository, BudgetRepository

for v in [15000, "15000", " 15000 ", "abc", "3.5", 3.5, True, 0, -500]:
    try:
        r = repr(validate_amount(v))
    except Exception as e:
        r = type(e).__name__
    print(f"validate_amount({v!r}) → {r}")
t = Transaction(id=1, type="expense", date=datetime.date(2026, 10, 20), amount=-500, category="식비", tags=["식비", 3])
print(f"Transaction(…, amount=-500, …, tags=['식비', 3]) → 오류 없이 만들어짐: amount={t.amount}, tags={t.tags}")
print("Transaction.__annotations__['amount'] →", repr(Transaction.__annotations__["amount"]))
print("SearchCriteria().category →", SearchCriteria().category)
d = Path(tempfile.mkdtemp())
svc = LedgerService(TransactionRepository(d), CategoryRepository(d), BudgetRepository(d))
try:
    svc.list_transactions("10")
except TypeError as e:
    print("list_transactions('10') → TypeError:", e)
'''


def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond:
        fails.append(msg)


def git(*args):
    return subprocess.run(["git", "-C", LEDGER, *args], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True).stdout.strip()


def tree_digest(path):
    h = hashlib.sha256()
    for root, dirs, files in sorted(os.walk(path)):
        dirs.sort()
        for f in sorted(files):
            p = os.path.join(root, f)
            h.update(os.path.relpath(p, path).encode() + b"\0" + open(p, "rb").read())
    return h.hexdigest()


def script_blocks():
    script = open(SCRIPT, encoding="utf-8").read()
    return script, [(m.group(1), m.group(2)) for m in re.finditer(r"<!-- (ledger-run[^>]*?|ledger-probe) -->\n```[a-z]*\n(.*?)\n```", script, re.S)]


def run(args, cwd, stdin=None):
    p = subprocess.run([sys.executable, *args], cwd=cwd, env=ENV, input=stdin, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
    return p.returncode, p.stdout.replace("\r\n", "\n"), p.stderr.replace("\r\n", "\n")


def merged(args, cwd):
    p = subprocess.run([sys.executable, *args], cwd=cwd, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    return p.returncode, p.stdout.replace("\r\n", "\n").rstrip("\n").split("\n")


def collect(work):
    """임시 폴더에서 원고 블록에 해당하는 실제 결과를 모은다. {블록 머리: (줄 목록, 종료 코드, 표준 출력, 표준 오류)}"""
    shutil.copytree(os.path.join(LEDGER, "ledger"), os.path.join(work, "ledger"))
    for args, stdin in SEED:
        code, out, err = run(["-m", "ledger", *args], work, stdin)
        check(code == 0, f"준비: 임시 data 폴더에 `ledger {' '.join(args)}` 실행(종료 코드 {code})")
    _, blocks = script_blocks()
    got = {}
    for spec, _body in blocks:
        if spec.startswith("ledger-run"):
            cmd = re.match(r"ledger-run:\s*(.*?)\s*\|", spec).group(1)
            code, lines = merged(cmd.split()[1:], work)
            c2, out, err = run(cmd.split()[1:], work)
            got[spec] = (lines, code, out, err)
        else:
            p = subprocess.run([sys.executable, "-c", PROBE], cwd=work, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
            got[spec] = (p.stdout.rstrip("\n").split("\n"), p.returncode, p.stdout, "")
    return got


def main():
    print(f"INFO Python {platform.python_version()} ({platform.python_implementation()}), {platform.system()} {platform.release()}")
    if not os.path.isdir(os.path.join(LEDGER, "ledger")):
        print(f"SKIP ledger 저장소 없음: {LEDGER} (LEDGER_REPO로 지정)")
        return 0
    head = git("rev-parse", "HEAD")
    origin = git("rev-parse", "origin/main")
    print(f"INFO ledger 저장소 {LEDGER} HEAD {head[:7]} · origin/main {origin[:7] or '없음'}")
    check(head.startswith(BASE), f"ledger HEAD = 원고 기준 커밋 {BASE}")
    status_before = git("status", "--porcelain")
    data_dir = os.path.join(LEDGER, "data")
    data_before = tree_digest(data_dir) if os.path.isdir(data_dir) else None

    # ── 2. 인용한 줄 ──────────────────────────────────────────
    src = {}
    for f, no, text in CITED:
        lines = src.setdefault(f, open(os.path.join(LEDGER, f), encoding="utf-8").read().split("\n"))
        check(text in lines[no - 1], f"인용 줄 {f}:{no} = {text}")
    # 원고 본문에 적은 '`ledger/…py` N행'·'N~M행'·'N·M행'이 모두 위에서 확인한 줄인지
    script_text = open(SCRIPT, encoding="utf-8").read()
    cited = {(f, n) for f, n, _ in CITED}
    mentioned = []
    for m in re.finditer(r"`(ledger/\w+\.py)`\s*((?:\d+(?:~\d+)?(?:행)?\s*(?:·|,)?\s*)+)행", script_text):
        for n in re.findall(r"\d+", m.group(2)):
            mentioned.append((m.group(1), int(n)))
    missing = sorted(set(mentioned) - cited)
    check(mentioned and not missing, f"원고가 적은 ledger 줄 번호 {len(set(mentioned))}개가 모두 확인한 줄" + (f" — 확인 안 된 줄: {missing}" if missing else ""))
    for f in FUTURE:
        check("from __future__ import annotations" in src.get(f) or "from __future__ import annotations" in open(os.path.join(LEDGER, f), encoding="utf-8").read(),
              f"{f}: from __future__ import annotations")
    for f, text in DOC_NO_MYPY:
        check(text in open(os.path.join(LEDGER, f), encoding="utf-8").read(), f"문서 기록 {f}: '{text}'")

    # ── 3. 옮긴 validate_amount 코드 ─────────────────────────────
    script, blocks = script_blocks()
    m = re.search(r"```python\n(def validate_amount\(.*?)\n```", script, re.S)
    quoted = m.group(1).split("\n") if m else []
    real = src["ledger/validators.py"][52:67]
    body = [ln for ln in real if ln.strip()]
    doc_end = next(i for i, ln in enumerate(body) if ln.rstrip().endswith('"""') and i > 0)
    expect = [body[0], "    ..."] + body[doc_end + 1:]
    check(quoted == expect, f"원고에 옮긴 validate_amount = validators.py 53~67행(설명 문자열만 '...'로 줄임, {len(quoted)}줄)")
    if quoted != expect:
        print("   기대:", expect, "\n   원고:", quoted)

    # ── 4·5. 임시 폴더 실행 ───────────────────────────────────────
    work = tempfile.mkdtemp(prefix="b21-scene07-ledger-")
    try:
        got = collect(work)
        for spec, body in blocks:
            lines, code, out, err = got[spec]
            if spec.startswith("ledger-run"):
                cmd = re.match(r"ledger-run:\s*(.*?)\s*\|", spec).group(1)
                want_exit = int(re.search(r"exit=(\d+)", spec).group(1))
                want = body.split("\n")
                check(want[0] == "$ " + cmd, f"ledger-run 표시 명령 = 블록 첫 줄: {cmd}")
                check(want[1:] == lines and code == want_exit, f"ledger 실행 출력·종료 코드 = 원고: $ {cmd} (exit {code})")
                if want[1:] != lines:
                    print("   기대:", want[1:], "\n   실제:", lines)
                if want_exit:
                    check(out == "" and err.strip(), f"오류 경우는 표준 출력이 비고 표준 오류에만 출력: {cmd}")
            else:
                check(body.split("\n") == lines and code == 0, f"ledger-probe 블록 = 실제 함수·클래스 호출 결과({len(lines)}줄)")
                if body.split("\n") != lines:
                    print("   기대:", body.split("\n"), "\n   실제:", lines)
        check(sum(1 for s, _ in blocks if s.startswith("ledger-run")) == 3 and any(s == "ledger-probe" for s, _ in blocks), "원고의 ledger 블록: 실행 3개 + probe 1개")
    finally:
        shutil.rmtree(work, ignore_errors=True)

    # ── 6. 원본 보호 ─────────────────────────────────────────────
    check(git("status", "--porcelain") == status_before, "ledger 저장소 작업 트리가 실행 전후로 같음")
    if data_before is not None:
        check(tree_digest(data_dir) == data_before, "ledger 운영용 data 폴더가 실행 전후로 같음")
    print(f"\n결과: {'FAIL ' + str(len(fails)) + '건' if fails else 'PASS'}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
