"""B2-1 Scene 03-A (Python 프로그램은 왜 여러 함수와 클래스로 나누어 만들까?) 노트북·휴대전화 SVG 생성기.

Scene 02 생성기(../../scene-02/_tools/build.py)의 그리기 도구를 불러 쓴다(그 안에서 Scene 01 도구도 쓴다). 두 파일은 바꾸지 않는다.
그림의 코드·실행 결과·호출 순서·import는 _tools/demo/의 실제 코드와 실행 결과이며, verify_demo.py가 대조한다.

시각 약속(Scene 02 승인 후보 재사용 + return 추가):
- 실제 호출 순서 = 검은 번호 원 + 진한 실선·채운 화살촉
- return 결과   = 회색 가는 실선·빈 화살촉 + 'return' 글자, 번호 없음
- import 의존   = 파란 파선·빈 화살촉, 번호 없음. 표준 라이브러리는 회색 칩
- 코드 안: Parameter = 초록 굵은 글자 + 밑줄, 전달값(Argument) = 갈색 굵은 글자

실행: python -I build.py  (출력: ../class-layer-desktop.svg, ../class-layer-mobile.svg)
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location("scene02_build", os.path.join(HERE, "..", "..", "scene-02", "_tools", "build.py"))
s2 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(s2)
s1 = s2.s1
tw, esc, section_head = s1.tw, s1.esc, s1.section_head

# ── 내용 (노트북·휴대전화 공통) ────────────────────────────────
TITLE = "Python 프로그램은 왜 여러 함수와 클래스로 나누어 만들까?"
SUB = "함수·클래스의 기본 문법과, 책임을 나눈 프로그램 구조 · 예시는 Scene 03-A 학습용 변형 todo"

# 코드 줄: [(글자, 종류)] 종류 c 코드, k 키워드, p Parameter, a 전달값, s 설명(주석 아님)
FUNC_CODE = [
    [("def", "k"), (" add_tax(", "c"), ("price", "p"), (", ", "c"), ("rate", "p"), ("=0.1):", "c")],
    [("    ", "c"), ("return", "k"), (" round(price * (1 + rate))", "c")],
    [],
    [("total = add_tax(", "c"), ("1000", "a"), (")", "c")],
]
FUNC_PARTS = [
    ("def add_tax(…):", "함수 정의 · 만들기만 하고 본문은 아직 실행 안 함"),
    ("price, rate=0.1", "Parameter · 값을 받는 자리(rate는 기본값 0.1)"),
    ("return …", "결과를 호출한 곳에 돌려줌"),
    ("add_tax(1000)", "호출 · 본문 실행 · 1000은 전달값(Argument)"),
]
FUNC_BIND = "호출할 때: price ← 1000, rate ← 0.1(기본값) → total = 1100"

CLASS_CODE = [
    [("class", "k"), (" Task:", "c")],
    [("    ", "c"), ("def", "k"), (" __init__(", "c"), ("self", "p"), (", ", "c"), ("title", "p"), ("):", "c")],
    [("        self.title = title", "c")],
    [("        self.done = False", "c")],
    [],
    [("    ", "c"), ("def", "k"), (" complete(", "c"), ("self", "p"), ("):", "c")],
    [("        self.done = True", "c")],
]
OBJ_CODE = [
    [("a = Task(", "c"), ('"장보기"', "a"), (")", "c")],
    [("b = Task(", "c"), ('"운동"', "a"), (")", "c")],
    [("a.complete()", "c")],
]
OBJECTS = [("a", '"장보기"', "True"), ("b", '"운동"', "False")]
OBJ_NOTE = ['Task("장보기") → Python이 새 객체를 만들고', '__init__(새 객체, "장보기")를 자동 호출 → self = 새 객체']

COMPARE = [
    ("func-method", "함수 ≠ 메서드", [
        ("b", "함수: add_tax(1000)"), ("t", "이름으로 부름 · 모듈에 정의"),
        ("b", "메서드: a.complete()"), ("t", "객체를 통해 부름 · 클래스 안에 정의"),
        ("s", "a.complete() = Task.complete(a)"),
    ]),
    ("init-method", "__init__() ≠ 일반 메서드", [
        ("b", "__init__(): 객체를 만들 때"), ("t", "Python이 자동 호출 · 처음 데이터 설정"),
        ("b", "일반 메서드: 직접 부를 때"), ("t", "예: a.complete()로 done을 바꿈"),
        ("s", "__init__.py(패키지 파일)와도 다름 · Scene 02"),
    ]),
    ("param-arg", "Parameter ≠ 전달값", [
        ("b", "Parameter: 정의의 받는 자리"), ("t", "price · rate · self · title"),
        ("b", "전달값(Argument): 부를 때 넣는 값"), ("t", '1000 · "장보기"'),
        ("s", "self 자리는 Python이 객체로 채움 · 이름은 관례"),
    ]),
]
BASICS_OUT = ["함수 호출 결과: 1100", "[x] 장보기", "[ ] 운동"]

# 책임 카드: (id, 이름, 파일, 책임, 이 예시, 하지 않는 일)
LAYERS = [
    ("cli", "CLI", "todo/cli.py", "사용자 명령 해석 · 결과와 오류 표시", "build_parser() · main()", "업무 규칙 판단 · 데이터 보관"),
    ("service", "서비스", "todo/services.py", "기능 수행과 업무 규칙", "list_tasks(): limit은 1 이상", "화면 출력 · 저장 방식 결정"),
    ("repo", "저장소", "todo/repository.py", "데이터 읽기·쓰기", "all(): 할 일 목록을 돌려줌", "업무 규칙 판단 · 화면 출력"),
    ("model", "모델", "todo/models.py", "데이터의 구조와 의미", "Task(title, done)", "읽기·쓰기 · 출력"),
]
LAYER_NOTE = "모델·저장소·서비스·CLI는 Python 문법이 아니라, 책임을 나누는 소프트웨어 설계의 한 예입니다."
COMMAND = "python -m todo list --limit 2"

# 실제 호출 흐름(호출 추적으로 확인): (id, 계층, 표시, 설명)
CALL_NODES = [
    ("main", "cli", "main()", "__main__.py가 호출"),
    ("build", "cli", "build_parser()", "명령 규칙 만들기"),
    ("repo", "repo", "TaskRepository()", "저장소 객체 만들기"),
    ("task", "model", "Task(…) × 3", "할 일 객체 3개"),
    ("service", "service", "TaskService(저장소)", "저장소 객체를 넘겨 줌"),
    ("list", "service", "list_tasks(2)", "규칙 검사 후 목록 요청"),
    ("all", "repo", "all()", "할 일 목록 읽기"),
]
CALLS = [("main", "build", "2"), ("main", "repo", "3"), ("repo", "task", "4"), ("main", "service", "5"), ("main", "list", "6"), ("list", "all", "7")]
RETURNS = [("all", "list", "목록"), ("list", "show", "앞의 2개")]
SHOW = ("show", "cli", "결과 표시", "[ ] 장보기 · [x] 과제 제출")

# import 지도: (id, 파일, [(import 줄, 대상, 종류)])
MODULES = [
    ("cli", "todo/cli.py", [("import argparse", "argparse", "std"), ("from todo.repository import TaskRepository", "repo", "proj"),
                            ("from todo.services import TaskService", "service", "proj")]),
    ("service", "todo/services.py", []),
    ("repo", "todo/repository.py", [("from todo.models import Task", "model", "proj")]),
    ("model", "todo/models.py", []),
]
CONTRASTS = [
    ("call-no-import", "호출은 있지만 import는 없다", ["services.py에는 import 줄이 없지만", "⑦에서 저장소의 all()을 호출합니다.", "만들어진 저장소 객체를 받아 쓰기 때문입니다."]),
    ("not-a-chain", "CLI → 서비스 → 저장소 한 줄이 아니다", ["cli.py는 서비스와 저장소를 모두 import하고", "③에서 저장소를 직접 만듭니다.", "의존 관계와 호출 흐름을 따로 봅니다."]),
    ("module-vs-layer", "모듈 분리 ≠ 계층 설계", ["모듈 분리는 파일을 나누는 일,", "계층 설계는 책임을 나누는 일입니다.", "한 파일 안에서도 책임을 나눌 수 있습니다."]),
]
FOOT = [
    "todo는 Scene 03-A 학습용 변형입니다(책임별 모듈, 메모리 저장소). 목록 조회 하나만 다루며 CRUD 전체는 Scene 03-B, 파일 저장은 Scene 04에서 다룹니다.",
    "그림의 코드·실행 결과·호출 순서·import는 이 변형을 실제로 실행하고 호출을 추적해 확인했습니다(Python 3.14.6).",
]
FOOT_M = [
    "todo는 Scene 03-A 학습용 변형입니다.",
    "목록 조회만 다룹니다. CRUD는 03-B,",
    "파일 저장은 Scene 04에서 다룹니다.",
    "호출 순서는 실제 실행을 추적해 확인했습니다.",
]
DESC = (
    "Scene 03-A. 그림 A는 함수와 클래스 문법이다. 함수 add_tax는 def로 정의하고 price, rate=0.1이 Parameter이며 return으로 결과를 돌려준다. "
    "add_tax(1000)을 호출하면 1000이 전달값(Argument)으로 price에 들어가고 total은 1100이다. 클래스 Task는 객체를 만드는 틀이며 __init__(self, title)이 "
    "객체를 만들 때 자동 호출되어 title과 done을 저장한다. a = Task(\"장보기\"), b = Task(\"운동\")은 서로 다른 데이터를 가진 객체이고 a.complete()는 a의 done만 True로 바꾼다. "
    "함수는 이름으로, 메서드는 객체를 통해 부르며 a.complete()는 Task.complete(a)와 같다. self는 Python이 자동으로 넘기는 객체를 받는 관례적인 Parameter 이름이다. "
    "그림 B는 책임을 나눈 프로그램이다. CLI는 명령 해석과 결과·오류 표시, 서비스는 기능 수행과 업무 규칙, 저장소는 데이터 읽기·쓰기, 모델은 데이터의 구조와 의미를 맡는다. "
    "이는 Python 문법이 아니라 설계의 한 예다. python -m todo list --limit 2의 실제 호출 순서: 1 main(), 2 build_parser(), 3 TaskRepository(), 4 Task 객체 3개, "
    "5 TaskService(저장소), 6 list_tasks(2), 7 all(). all()은 목록을 list_tasks에 return하고 list_tasks는 앞의 2개를 main에 return하며 main이 결과를 표시한다. "
    "import 의존: cli.py는 argparse(표준), todo.repository, todo.services를 import하고 repository.py는 todo.models를 import한다. services.py와 models.py에는 import가 없다. "
    "서비스는 저장소를 import하지 않지만 받은 객체의 all()을 호출하고, CLI는 저장소를 직접 만들므로 CLI → 서비스 → 저장소 한 줄이 아니다. 모듈 분리와 계층 설계는 다르다."
)

EXTRA = """      .ret { fill: none; stroke: #7b8794; stroke-width: 1.8; }
      .retT { fill: #5b6672; font-weight: 700; }
      .kw { fill: #1d4f91; font-weight: 700; }
      .par { fill: #17663f; font-weight: 700; text-decoration: underline; }
      .arg { fill: #8a4100; font-weight: 700; }
      .lane { fill: #f6f8fa; stroke: #d5dce4; stroke-width: 1; }
      .laneH { fill: #3f4a55; font-weight: 700; }
      .obj { fill: #fffaf3; stroke: #8a4100; stroke-width: 1.6; }
"""
SEG = {"c": "t m", "k": "kw m", "p": "par m", "a": "arg m"}
LAYER_NAME = {k: n for k, n, *_ in LAYERS}


class Svg(s2.Svg):
    def code(self, x, y, line, size, inside):
        """한 줄의 코드를 종류별 tspan으로. 빈 줄이면 아무것도 그리지 않는다."""
        if not line:
            return
        spans = "".join(f'<tspan class="{SEG[k]}">{esc(t)}</tspan>' for t, k in line)
        self.add(f'<text x="{x:g}" y="{y:g}" font-size="{size}" class="t m" data-in="{inside}" xml:space="preserve">{spans}</text>')

    def ret(self, pts, frm, to, label, size, lx, ly, anchor="start"):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="ret" marker-end="url(#{self.idp}-ret)" data-return="{frm}>{to}"/>')
        self.text(lx, ly, f"return {label}", size, "retT", anchor)

    def save(self, name, desc):
        tid, did = f"{self.idp}-title", f"{self.idp}-desc"
        style = s1.STYLE.replace("    </style>", s2.EXTRA_STYLE + EXTRA + "    </style>")
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'role="img" aria-labelledby="{tid} {did}">\n'
                f'  <title id="{tid}">{esc(self.label)}</title>\n'
                f'  <desc id="{did}">{esc(desc)}</desc>\n'
                f'  <defs>\n{style}\n'
                f'    <marker id="{self.idp}-arr" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#1b2733"/></marker>\n'
                f'    <marker id="{self.idp}-open" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M1 1L10 6L1 11" fill="none" stroke="#1d4f91" stroke-width="2"/></marker>\n'
                f'    <marker id="{self.idp}-ret" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M1 1L8 5L1 9" fill="none" stroke="#7b8794" stroke-width="1.8"/></marker>\n  </defs>\n'
                f'  <rect width="{self.w}" height="{self.h}" fill="#ffffff"/>\n')
        body = "\n".join("  " + b for b in self.body)
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(head + body + "\n</svg>\n")


def _rows(s, x, y, rows, size, step, box):
    for kind, t in rows:
        s.text(x, y, t, size, {"t": "t", "b": "t b", "s": "s"}[kind], inside=box)
        y += step
    return y


def legend(s, x, y, w, size, mobile=False):
    if mobile:
        s.rect(x, y, w, 130, "legend", 12)
        s.step(x + 20, y + 24, "1", 12, 14)
        s.add(f'<path d="M{x + 35} {y + 24}H{x + 70}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
        s.text(x + 82, y + 29, "실선·번호 = 실제 호출 순서", size)
        s.add(f'<path d="M{x + 14} {y + 62}H{x + 68}" class="ret" marker-end="url(#{s.idp}-ret)"/>')
        s.text(x + 82, y + 67, "회색 가는 선 = return 결과", size)
        s.add(f'<path d="M{x + 12} {y + 100}H{x + 68}" class="imp" marker-end="url(#{s.idp}-open)"/>')
        s.text(x + 82, y + 105, "파란 파선 = import 의존(번호 없음)", size)
        return y + 130
    s.rect(x, y, w, 60, "legend", 12)
    yy = y + 36
    s.step(x + 28, yy - 6, "1", 13, 16)
    s.add(f'<path d="M{x + 46} {yy - 6}H{x + 90}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
    s.text(x + 102, yy, "실선 화살표·번호 = 실제 호출 순서", size)
    s.add(f'<path d="M{x + 420} {yy - 6}H{x + 474}" class="ret" marker-end="url(#{s.idp}-ret)"/>')
    s.text(x + 486, yy, "회색 가는 선 = return 결과", size)
    s.add(f'<path d="M{x + 800} {yy - 6}H{x + 858}" class="imp" marker-end="url(#{s.idp}-open)"/>')
    s.text(x + 870, yy, "파란 파선 = import 의존 (번호 없음)", size)
    return y + 60


def code_box(s, x, y, w, lines, size, step, box):
    h = 20 + step * len(lines)
    s.rect(x, y, w, h, "code", 10, box)
    for k, ln in enumerate(lines):
        s.code(x + 16, y + 10 + step * (k + 1) - 6, ln, size, box)
    return y + h


# ══ 노트북용 (1280) ══════════════════════════════════════════════
def desktop():
    s = Svg(1280, 0, TITLE + " · 노트북용", "d3")
    s.text(32, 54, TITLE, 30, "t b")
    s.text(32, 90, "Scene 03-A · " + SUB, 18, "s")
    legend(s, 16, 112, 1248, 17)

    # ── 그림 A ──────────────────────────────────────────────
    s.comment("그림 A. 함수와 클래스 문법")
    section_head(s, 16, 222, "A", "함수와 클래스 문법 · 정의와 호출, 클래스와 객체", 22)

    s.comment("A-1 함수")
    top = 246
    s.rect(16, top, 612, 500, "card", 12, "func")
    s.text(36, top + 34, "함수 · 정의하고 호출한다", 19, "t b", inside="func")
    s.text(36, top + 60, "밑줄 초록 = Parameter · 굵은 갈색 = 전달값", 16, "s", inside="func")
    y = code_box(s, 32, top + 76, 580, FUNC_CODE, 17, 28, "func-code")
    y += 14
    for k, (part, mean) in enumerate(FUNC_PARTS):
        s.add(f'<g data-part="func-{k + 1}">')
        s.text(36, y + 20, part, 16, "t m b", inside="func")
        s.text(36, y + 42, mean, 16, "t", inside="func")
        s.add("</g>")
        y += 54
    s.rect(32, y + 4, 580, 44, "legend", 10, "func-bind")
    s.text(48, y + 32, FUNC_BIND, 16, "t b", inside="func-bind")

    s.comment("A-2 클래스와 객체")
    x2 = 652
    s.rect(x2, top, 612, 500, "card", 12, "class")
    s.text(x2 + 20, top + 34, "클래스 · 객체를 만드는 틀", 19, "t b", inside="class")
    s.text(x2 + 20, top + 60, "객체는 저마다 데이터(속성)를 가지고, 메서드를 부를 수 있다", 16, "s", inside="class")
    y = code_box(s, x2 + 16, top + 76, 340, CLASS_CODE, 16, 26, "class-code")
    y = code_box(s, x2 + 16, y + 14, 340, OBJ_CODE, 16, 26, "obj-code")
    oy = top + 76
    for oid, title, done in OBJECTS:
        box = f"obj-{oid}"
        s.add(f'<g data-object="{oid}">')
        s.rect(x2 + 372, oy, 220, 112, "obj", 10, box)
        s.text(x2 + 388, oy + 28, f"객체 {oid}", 17, "t b", inside=box)
        s.text(x2 + 576, oy + 28, "Task", 16, "s", "end", inside=box)
        s.text(x2 + 388, oy + 60, f"title = {title}", 16, "t m", inside=box)
        s.text(x2 + 388, oy + 88, f"done = {done}", 16, "t m", inside=box)
        s.add("</g>")
        oy += 128
    s.text(x2 + 372, oy + 8, "a.complete() 뒤의 상태", 16, "s")
    s.rect(x2 + 16, top + 420, 580, 64, "legend", 10, "obj-note")
    for k, ln in enumerate(OBJ_NOTE):
        s.text(x2 + 32, top + 446 + 24 * k, ln, 16, "t", inside="obj-note")

    s.comment("A-3 비교 카드와 실행 결과")
    y0 = top + 524
    cw = (1248 - 2 * 24) / 3
    for i, (cid, title, rows) in enumerate(COMPARE):
        x = 16 + i * (cw + 24)
        box = f"cmp-{cid}"
        s.add(f'<g data-card="{cid}">')
        s.rect(x, y0, cw, 176, "card", 12, box)
        s.text(x + 18, y0 + 32, title, 18, "t b", inside=box)
        _rows(s, x + 18, y0 + 62, rows, 16, 24, box)
        s.add("</g>")
    y0 += 196
    s.rect(16, y0, 1248, 48, "code", 10, "basics-out")
    s.text(32, y0 + 31, "python basics.py 실행 결과", 16, "s", inside="basics-out")
    xx = 280
    for ln in BASICS_OUT:
        s.add(f'<text x="{xx}" y="{y0 + 31}" font-size="16" class="t m b" data-in="basics-out" data-out="{esc(ln)}" xml:space="preserve">{esc(ln)}</text>')
        xx += max(tw(ln, 16, True), tw(ln, 16)) + 40  # 한글이 섞인 줄은 고정폭 어림보다 넓다

    # ── 그림 B ──────────────────────────────────────────────
    y0 += 104
    s.comment("그림 B. 책임을 나눈 프로그램")
    section_head(s, 16, y0, "B", "책임을 나눈 프로그램 · " + COMMAND, 22)
    s.rect(16, y0 + 20, 1248, 44, "legend", 10, "layer-note")
    s.text(32, y0 + 48, LAYER_NOTE, 17, "t b", inside="layer-note")
    y0 += 84
    cw = (1248 - 3 * 16) / 4
    for i, (lid, name, path, duty, here, nots) in enumerate(LAYERS):
        x = 16 + i * (cw + 16)
        box = f"layer-{lid}"
        s.add(f'<g data-layer="{lid}">')
        s.rect(x, y0, cw, 212, "card", 12, box)
        s.text(x + 16, y0 + 32, name, 19, "t b", inside=box)
        s.text(x + cw - 16, y0 + 32, path, 16, "s m", "end", inside=box)
        s.text(x + 16, y0 + 66, "책임", 16, "s b", inside=box)
        s.text(x + 16, y0 + 90, duty, 16, "t", inside=box)
        s.text(x + 16, y0 + 120, "이 예시", 16, "s b", inside=box)
        s.text(x + 16, y0 + 144, here, 16, "t", inside=box)
        s.text(x + 16, y0 + 170, "하지 않는 일", 16, "s b", inside=box)
        s.text(x + 16, y0 + 194, nots, 16, "s", inside=box)
        s.add("</g>")

    s.comment("B-2 실제 호출 흐름: 계층별 열 위에 호출(실선·번호)과 return(회색)")
    top = y0 + 236
    s.rect(16, top, 1248, 480, "card", 12, "flow")
    s.text(36, top + 34, "B-2 실제 호출 흐름 · " + COMMAND, 19, "t b", inside="flow")
    s.text(1244, top + 34, "호출 추적으로 확인", 16, "s", "end", inside="flow")
    cols = {"cli": 32, "service": 340, "repo": 648, "model": 956}
    colw = 292
    for lid, x in cols.items():
        s.add(f'<rect x="{x}" y="{top + 52}" width="{colw}" height="412" rx="10" class="lane" data-box="lane-{lid}"/>')
        s.text(x + colw / 2, top + 78, LAYER_NAME[lid], 17, "laneH", "middle", inside=f"lane-{lid}")
    rows = {"main": 96, "build": 160, "repo": 224, "task": 224, "service": 288, "list": 352, "all": 352, "show": 404}
    pos = {}
    for nid, lid, label, note in CALL_NODES + [SHOW]:
        x = cols[lid] + 16
        y = top + rows[nid]
        w = colw - 32
        if nid in ("build", "show"):
            x, w = cols[lid] + 58, colw - 74
        h = 52
        box = f"call-{nid}"
        pos[nid] = (x, y, w, h)
        s.add(f'<g data-callnode="{nid}" data-layer="{lid}">')
        s.rect(x, y, w, h, "entry" if nid == "show" else "fn", 10, box)
        s.text(x + 14, y + 22, label, 16, "t b" if nid == "show" else "t m b", inside=box)
        s.text(x + 14, y + 44, note, 16, "s", inside=box)
        s.add("</g>")
    mx, my, mw, mh = pos["main"]
    s.step(mx + mw - 24, my + 26, "1")  # ① main(): __main__.py가 부름(그림 밖에서 오는 호출이라 화살표 없음)
    rail = mx + 22
    for frm, to, n in CALLS:
        x, y, w, h = pos[to]
        cy = y + h / 2
        if frm == "main":
            s.call([(rail, my + mh), (rail, cy), (x - 2, cy)], frm, to, n)
            s.step(x - 20 if to != "build" else rail + 18, cy - 18 if to != "build" else cy - 20, n)
        else:
            fx, fy, fw, fh = pos[frm]
            s.call([(fx + fw, cy - 8), (x - 2, cy - 8)], frm, to, n)
            s.step((fx + fw + x) / 2, cy - 26, n)
    ax, ay, aw, ah = pos["all"]
    lx, ly, lw, lh = pos["list"]
    s.ret([(ax, ay + ah - 10), (lx + lw + 2, ly + lh - 10)], "all", "list", RETURNS[0][2], 16, (ax + lx + lw) / 2, ly + lh + 18, "middle")
    sx, sy, sw, sh = pos["show"]
    s.ret([(lx, ly + lh - 10), (lx - 30, ly + lh - 10), (lx - 30, sy + sh / 2), (sx + sw + 2, sy + sh / 2)], "list", "show", RETURNS[1][2], 16,
          lx - 16, sy + sh / 2 + 22)

    s.comment("B-3 import 의존(파선·번호 없음) + 차이 카드")
    top += 504
    s.rect(16, top, 760, 330, "card", 12, "map-import")
    s.text(36, top + 34, "B-3 import 의존 관계", 19, "t b", inside="map-import")
    s.text(36, top + 60, "파일 맨 위 import 줄로 그립니다. 번호가 없습니다.", 16, "s", inside="map-import")
    geo = {"cli": (32, top + 78, 480, 134), "service": (552, top + 78, 208, 74), "repo": (32, top + 244, 480, 74), "model": (552, top + 244, 208, 74)}
    for mid, label, lines in MODULES:
        x, y, w, h = geo[mid]
        box = f"mod-{mid}"
        s.add(f'<g data-module="{mid}">')
        s.rect(x, y, w, h, "mod", 10, box)
        s.text(x + 14, y + 26, label, 16, "t m b", inside=box)
        if not lines:
            s.text(x + 14, y + 54, "(import 줄 없음)", 16, "s", inside=box)
        for k, (code, tgt, kind) in enumerate(lines):
            ly2 = y + 54 + 26 * k
            s.text(x + 14, ly2, code, 16, "impT m", inside=box)
            if kind == "std":
                s.chip(x + 14 + tw(code, 16, True) + 12, ly2 - 18, "표준 라이브러리", 16, "std", "stdT", f"std-{mid}-{tgt}", f' data-import="{mid}>{tgt}"')
        s.add("</g>")
    cx, cy, cwid, ch = geo["cli"]
    s.imp([(cx + cwid, cy + 40), (geo["service"][0] - 2, cy + 40)], "cli", "service")
    s.imp([(cx + 380, cy + ch), (cx + 380, geo["repo"][1] - 2)], "cli", "repo")
    rx, ry, rw, rh = geo["repo"]
    s.imp([(rx + rw, ry + 48), (geo["model"][0] - 2, ry + 48)], "repo", "model")

    y = top
    for cid, title, lines in CONTRASTS:
        box = f"contrast-{cid}"
        s.add(f'<g data-contrast="{cid}">')
        s.rect(800, y, 464, 102, "legend", 12, box)
        s.text(818, y + 28, title, 17, "t b", inside=box)
        for k, ln in enumerate(lines):
            s.text(818, y + 52 + 20 * k, ln, 16, "t", inside=box)
        s.add("</g>")
        y += 114
    y = top + 360
    for i, t in enumerate(FOOT):
        s.text(32, y + 26 * i, t, 16, "s")
    s.h = int(y + 26 * len(FOOT) + 8)
    s.save("class-layer-desktop.svg", DESC)


# ══ 휴대전화용 (360) ═════════════════════════════════════════════
def mobile():
    s = Svg(360, 0, TITLE + " · 휴대전화용", "m3")
    for i, t in enumerate(["Python 프로그램은 왜", "여러 함수와 클래스로", "나누어 만들까?"]):
        s.text(12, 32 + 28 * i, t, 21, "t b")
    s.text(12, 112, "Scene 03-A · 함수·클래스 문법과", 14, "s")
    s.text(12, 132, "책임을 나눈 프로그램 구조", 14, "s")
    y = legend(s, 12, 146, 336, 15, mobile=True) + 40

    s.comment("그림 A")
    section_head(s, 12, y, "A", "함수와 클래스 문법", 17)
    y += 16
    fh = 64 + (20 + 26 * len(FUNC_CODE)) + 16 + 70 * len(FUNC_PARTS) + 84
    s.rect(12, y, 336, fh, "card", 12, "func")
    s.text(24, y + 30, "함수 · 정의하고 호출한다", 16, "t b", inside="func")
    s.text(24, y + 52, "밑줄 초록 = Parameter · 갈색 = 전달값", 14, "s", inside="func")
    yy = code_box(s, 16, y + 64, 328, FUNC_CODE, 14, 26, "func-code") + 16
    for k, (part, mean) in enumerate(FUNC_PARTS):
        s.add(f'<g data-part="func-{k + 1}">')
        s.text(24, yy + 18, part, 14, "t m b", inside="func")
        a, b2 = (mean.split(" · ", 1) + [""])[:2]
        s.text(24, yy + 40, a, 14, "t", inside="func")
        if b2:
            s.text(24, yy + 60, b2, 14, "s", inside="func")
        s.add("</g>")
        yy += 70
    s.rect(20, yy + 4, 320, 66, "legend", 10, "func-bind")
    s.text(32, yy + 30, "호출할 때: price ← 1000,", 14, "t b", inside="func-bind")
    s.text(32, yy + 54, "rate ← 0.1(기본값) → total = 1100", 14, "t b", inside="func-bind")
    y += fh + 14

    ch = 64 + (20 + 24 * len(CLASS_CODE)) + 12 + (20 + 24 * len(OBJ_CODE)) + 16 + 2 * 104 + 30 + 76
    s.rect(12, y, 336, ch, "card", 12, "class")
    s.text(24, y + 30, "클래스 · 객체를 만드는 틀", 16, "t b", inside="class")
    s.text(24, y + 52, "객체마다 데이터를 가지고 메서드를 부름", 14, "s", inside="class")
    yy = code_box(s, 16, y + 64, 328, CLASS_CODE, 14, 24, "class-code")
    yy = code_box(s, 16, yy + 12, 328, OBJ_CODE, 14, 24, "obj-code") + 16
    for oid, title, done in OBJECTS:
        box = f"obj-{oid}"
        s.add(f'<g data-object="{oid}">')
        s.rect(20, yy, 320, 94, "obj", 10, box)
        s.text(34, yy + 26, f"객체 {oid}", 15, "t b", inside=box)
        s.text(326, yy + 26, "Task", 14, "s", "end", inside=box)
        s.text(34, yy + 54, f"title = {title}", 14, "t m", inside=box)
        s.text(34, yy + 78, f"done = {done}", 14, "t m", inside=box)
        s.add("</g>")
        yy += 104
    s.text(20, yy + 12, "a.complete() 뒤의 상태", 14, "s")
    yy += 30
    s.rect(20, yy, 320, 66, "legend", 10, "obj-note")
    s.text(32, yy + 26, 'Task("장보기") → 새 객체를 만들고', 14, "t", inside="obj-note")
    s.text(32, yy + 50, "__init__(새 객체, …) 자동 호출", 14, "t", inside="obj-note")
    y += ch + 14

    for cid, title, rows in COMPARE:
        box = f"cmp-{cid}"
        h = 44 + 22 * len(rows) + 10
        s.add(f'<g data-card="{cid}">')
        s.rect(12, y, 336, h, "card", 12, box)
        s.text(24, y + 28, title, 15, "t b", inside=box)
        _rows(s, 24, y + 54, rows, 14, 22, box)
        s.add("</g>")
        y += h + 10
    s.rect(12, y, 336, 50 + 22 * len(BASICS_OUT), "code", 10, "basics-out")
    s.text(24, y + 26, "python basics.py 실행 결과", 14, "s", inside="basics-out")
    for k, ln in enumerate(BASICS_OUT):
        s.add(f'<text x="24" y="{y + 52 + 22 * k}" font-size="14" class="t m b" data-in="basics-out" data-out="{esc(ln)}" xml:space="preserve">{esc(ln)}</text>')
    y += 50 + 22 * len(BASICS_OUT) + 44

    s.comment("그림 B")
    section_head(s, 12, y, "B", "책임을 나눈 프로그램", 17)
    y += 16
    s.rect(12, y, 336, 66, "legend", 10, "layer-note")
    s.text(24, y + 26, "모델·저장소·서비스·CLI는 Python 문법이", 14, "t b", inside="layer-note")
    s.text(24, y + 48, "아니라 책임을 나누는 설계의 한 예", 14, "t b", inside="layer-note")
    y += 76
    for lid, name, path, duty, here, nots in LAYERS:
        box = f"layer-{lid}"
        s.add(f'<g data-layer="{lid}">')
        s.rect(12, y, 336, 132, "card", 12, box)
        s.text(24, y + 28, name, 16, "t b", inside=box)
        s.text(336, y + 28, path, 14, "s m", "end", inside=box)
        s.text(24, y + 54, "책임: " + duty, 14, "t", inside=box)
        s.text(24, y + 78, here, 14, "t", inside=box)
        s.text(24, y + 102, "하지 않는 일:", 14, "s b", inside=box)
        s.text(24, y + 122, nots, 14, "s", inside=box)
        s.add("</g>")
        y += 142
    y += 14

    s.comment("B-2 호출 흐름(세로): 들여쓰기 = 누가 불렀는지")
    s.text(12, y + 4, "실제 호출 흐름", 16, "t b")
    s.text(12, y + 26, COMMAND, 14, "t m")
    y += 40
    indent = {"main": 0, "build": 1, "repo": 1, "task": 2, "service": 1, "list": 1, "all": 2, "show": 1}
    order = ["main", "build", "repo", "task", "service", "list", "all", "show"]
    info = {n: (lid, label, note) for n, lid, label, note in CALL_NODES + [SHOW]}
    total_h = 66 * len(order) + 30
    s.rect(12, y, 336, total_h + 10, "card", 12, "flow")
    pos = {}
    yy = y + 14
    for nid in order:
        lid, label, note = info[nid]
        x = 24 + 28 * indent[nid]
        w = 336 - 8 - x
        box = f"call-{nid}"
        pos[nid] = (x, yy, w, 54)
        s.add(f'<g data-callnode="{nid}" data-layer="{lid}">')
        s.rect(x, yy, w, 54, "entry" if nid == "show" else "fn", 10, box)
        s.text(x + 12, yy + 22, label, 14, "t b" if nid == "show" else "t m b", inside=box)
        s.text(x + 12, yy + 44, note, 14, "s", inside=box)
        tag = LAYER_NAME[lid]
        s.text(x + w - 12, yy + 22, tag, 14, "laneH", "end", inside=box)
        s.add("</g>")
        yy += 66
    for frm, to, n in CALLS:
        fx, fy, fw, fh = pos[frm]
        tx, ty, tw_, th = pos[to]
        rail = fx + 12
        s.call([(rail, fy + fh), (rail, ty + 27), (tx - 2, ty + 27)], frm, to, n)
    # 번호 원: 가지 끝 바로 위(상자 왼쪽 위 모서리 밖). ① main()은 __main__.py가 부르므로 화살표 없이 번호만
    s.step(pos["main"][0] - 2, pos["main"][1] - 1, "1", 10, 14)
    for frm, to, n in CALLS:
        tx, ty, _, _ = pos[to]
        s.step(tx - 2, ty - 1, n, 10, 14)
    ax, ay, aw, ah = pos["all"]
    lx, ly, lw, lh = pos["list"]
    # return: 상자 오른쪽 바깥 통로(x=340)로 돌아 부른 쪽 상자로 들어감
    s.add(f'<path d="M{ax + aw} {ay + 40}H340V{ly + 40}H{lx + lw + 2}" class="ret" marker-end="url(#m3-ret)" data-return="all>list"/>')
    sx, sy, sw, sh = pos["show"]
    s.add(f'<path d="M{lx + lw} {ly + 46}H340V{sy + 27}H{sx + sw + 2}" class="ret" marker-end="url(#m3-ret)" data-return="list>show"/>')
    y += total_h + 22
    s.text(12, y, "회색 선: all()이 목록을 return → list_tasks()가", 14, "retT")
    s.text(12, y + 20, "앞의 2개를 return → main()이 결과 표시", 14, "retT")
    y += 48

    s.comment("B-3 import 의존")
    mh = sum(48 + 26 * max(len(l), 1) for *_, l in MODULES) + 30 * (len(MODULES) - 1)
    s.rect(12, y, 336, 70 + mh + 40, "card", 12, "map-import")
    s.text(24, y + 30, "import 의존 관계", 16, "t b", inside="map-import")
    s.text(24, y + 52, "파일 맨 위 import 줄 · 번호 없음", 14, "s", inside="map-import")
    geo = {}
    yy = y + 70
    order_m = ["cli", "service", "repo", "model"]
    mods = {m[0]: m for m in MODULES}
    for mid in order_m:
        _, label, lines = mods[mid]
        h = 48 + 26 * max(len(lines), 1)
        geo[mid] = (24, yy, 296, h)
        box = f"mod-{mid}"
        s.add(f'<g data-module="{mid}">')
        s.rect(24, yy, 296, h, "mod", 10, box)
        s.text(36, yy + 24, label, 14, "t m b", inside=box)
        if not lines:
            s.text(36, yy + 50, "(import 줄 없음)", 14, "s", inside=box)
        for k, (code, tgt, kind) in enumerate(lines):
            ly2 = yy + 50 + 26 * k
            short = code.replace("from todo.repository import TaskRepository", "from todo.repository import …").replace(
                "from todo.services import TaskService", "from todo.services import …")
            s.text(36, ly2, short, 14, "impT m", inside=box)
            if kind == "std":
                s.chip(36 + tw(short, 14, True) + 10, ly2 - 16, "표준", 14, "std", "stdT", f"std-{mid}-{tgt}", f' data-import="{mid}>{tgt}"')
        s.add("</g>")
        yy += h + 30
    cx, cy, cw2, ch2 = geo["cli"]
    sx2, sy2, _, _ = geo["service"]
    s.imp([(cx + 60, cy + ch2), (cx + 60, sy2 - 2)], "cli", "service")
    rx2, ry2, rw2, rh2 = geo["repo"]
    s.imp([(cx + cw2, cy + ch2 - 20), (cx + cw2 + 18, cy + ch2 - 20), (cx + cw2 + 18, ry2 + 20), (cx + cw2 + 2, ry2 + 20)], "cli", "repo")
    mx2, my2, _, _ = geo["model"]
    s.imp([(rx2 + 60, ry2 + rh2), (rx2 + 60, my2 - 2)], "repo", "model")
    y += 70 + mh + 56

    for cid, title, lines in CONTRASTS:
        box = f"contrast-{cid}"
        h = 44 + 22 * len(lines) + 8
        s.add(f'<g data-contrast="{cid}">')
        s.rect(12, y, 336, h, "legend", 12, box)
        s.text(24, y + 28, title, 15, "t b", inside=box)
        for k, ln in enumerate(lines):
            s.text(24, y + 54 + 22 * k, ln, 14, "t", inside=box)
        s.add("</g>")
        y += h + 10
    y += 16
    for i, t in enumerate(FOOT_M):
        s.text(12, y + 22 * i, t, 14, "s")
    s.h = int(y + 22 * len(FOOT_M) + 4)
    s.save("class-layer-mobile.svg", DESC)


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
