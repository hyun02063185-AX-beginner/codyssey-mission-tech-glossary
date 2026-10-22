"""B2-1 Scene 02 (내 Python 프로그램은 어디에서 시작하고, 파일들은 어떻게 연결될까?) 노트북·휴대전화 SVG 생성기.

Scene 01 생성기(../../scene-01/_tools/build.py)의 그리기 도구(Svg, tw, esc, section_head, 글꼴)를 불러 쓴다. Scene 01 파일은 바꾸지 않는다.
두 그림은 아래 TREE · STEPS · RUNMODES · CARDS · MODULES · CALLS · CONTRASTS 한 벌에서 만든다.
그림의 내용은 _tools/demo/의 학습용 변형 todo를 실제로 실행한 결과이며, verify_demo.py가 그림의 실행 순서·import·호출과
데모 코드·실행 출력이 같은지 확인한다.

시각 약속:
- 실제 실행 순서 = 검은 번호 원 + 진한 실선 화살표(채운 화살촉). 그림 A ①~⑧, 그림 B-2 ⑤~⑧(같은 번호).
- import 연결   = 파란 파선 화살표(빈 화살촉), 번호 없음, 'import' 글자. 그림 B-1에서만 쓴다.
- 표준 라이브러리 = 회색 칩(화살표를 그리지 않음).

실행: python -I build.py  (출력: ../package-flow-desktop.svg, ../package-flow-mobile.svg)
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location("scene01_build", os.path.join(HERE, "..", "..", "scene-01", "_tools", "build.py"))
s1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(s1)
tw, esc, section_head = s1.tw, s1.esc, s1.section_head

# ── 내용 (노트북·휴대전화 공통) ────────────────────────────────
TITLE = "내 Python 프로그램은 어디에서 시작하고, 파일들은 어떻게 연결될까?"
SUB = "실행을 시작하는 파일을 찾고, import로 이어진 파일과 실제로 호출되는 함수를 나눠 읽기"

# 폴더 구조: (들여쓰기, 이름, 종류, 역할)
TREE = [
    (0, "실습 폴더/", "dir", "명령을 실행하는 곳"),
    (1, "main.py", "file", "비교용 · python main.py로 직접 실행하는 파일"),
    (1, "todo/", "pkg", "패키지 · 모듈을 묶은 폴더"),
    (2, "__init__.py", "init", "패키지 초기화 · 패키지를 처음 불러올 때 실행"),
    (2, "__main__.py", "entry", "python -m todo의 실행 진입점"),
    (2, "cli.py", "mod", "모듈 · 명령줄 입력 해석"),
    (2, "actions.py", "mod", "모듈 · 할 일 기능"),
]
TREE_NOTES = [
    ("b", "모듈 = .py 파일 하나 · 패키지 = 모듈을 묶은 폴더"),
    ("t", "패키지 안의 모듈은 todo.cli처럼 점으로 부릅니다."),
    ("s", "예외: __init__.py가 없는 Namespace Package도 있습니다."),
]

# 실제 실행 순서(python -m todo list --limit 3): (번호, 단계, 제목, 설명, 데모 출력 표식)
# 단계 load = 모듈 최상위 코드가 실행됨(불러올 때), call = 함수 본문이 실행됨(호출될 때)
STEPS = [
    ("1", "load", "todo/__init__.py", "패키지 초기화 · __name__ = 'todo'", "todo/__init__.py"),
    ("2", "load", "todo/__main__.py", "실행 진입점 · __name__ = '__main__'", "todo/__main__.py"),
    ("3", "load", "todo/cli.py", "from todo.cli import main 줄 때문에", "todo/cli.py"),
    ("4", "load", "todo/actions.py", "cli.py의 import todo.actions 줄 때문에", "todo/actions.py"),
    ("5", "call", "cli.main()", "__main__.py의 sys.exit(main())이 호출", "cli.main()"),
    ("6", "call", "cli.build_parser()", "main()이 호출 · 규칙 만들기(Scene 01)", "cli.build_parser()"),
    ("7", "call", "parser.parse_args()", "main()이 호출 · argparse라 학습용 출력 없음", ""),
    ("8", "call", "actions.show_tasks(3)", "main()이 호출 → 할 일 3개 출력", "actions.show_tasks(3)"),
]
PHASES = {
    "load": ("불러올 때", "모듈의 최상위 코드가 실행됩니다 · def는 함수를 만들기만 합니다", "9 6", "#eef3fb", "#1d4f91"),
    "call": ("호출될 때", "함수 본문이 실행됩니다", "", "#edf6f0", "#17663f"),
}
COMMAND = "python -m todo list --limit 3"

# 실행 방식 비교: (명령, 실행되는 순서(앞부분), __name__이 '__main__'인 파일, 뜻)
RUNMODES = [
    ("python -m todo …", "__init__.py → __main__.py", "__main__.py", "패키지 실행 · __main__.py가 진입점"),
    ("python -m todo.cli …", "__init__.py → cli.py", "cli.py", "모듈 실행 · __main__.py는 쓰지 않음"),
    ("python main.py …", "main.py → __init__.py → cli.py", "main.py", "파일 직접 실행 · 그 파일이 시작점"),
]
CARDS = [
    ("name-guard", '__main__.py ≠ if __name__ == "__main__":', [
        ("b", "__main__.py: 파일 이름"),
        ("t", "패키지를 -m으로 실행할 때 쓰는 진입점"),
        ("b", 'if __name__ == "__main__": 조건문'),
        ("t", "이 파일이 시작 파일로 실행될 때만 참"),
        ("t", "어느 .py 파일에나 쓸 수 있음 (예: cli.py)"),
        ("s", "import될 때 __name__은 'todo.cli' 같은 모듈 이름"),
    ]),
    ("init", "__init__.py ≠ __init__()", [
        ("b", "__init__.py: 패키지 폴더 안의 파일"),
        ("t", "패키지를 처음 불러올 때 한 번 실행"),
        ("b", "__init__(): 클래스 안의 메서드"),
        ("t", '객체를 만들 때마다 실행 (예: Task("장보기"))'),
        ("s", "이름만 비슷하고 하는 일이 다릅니다 (Scene 03)"),
    ]),
]

# 그림 B-1 import 지도: 모듈 상자와 상자 안의 import 줄. 줄: (글자, 대상, 종류) 종류 std = 표준 라이브러리, proj = 프로젝트 모듈
MODULES = [
    ("__main__", "todo/__main__.py", [("import sys", "sys", "std"), ("from todo.cli import main", "cli", "proj")]),
    ("cli", "todo/cli.py", [("import argparse", "argparse", "std"), ("import todo.actions", "actions", "proj")]),
    ("actions", "todo/actions.py", []),
]
# 그림 B-2 호출 지도: (id, 함수, 있는 곳)
CALL_NODES = [
    ("entry", "sys.exit(main())", "__main__.py 최상위 코드"),
    ("main", "main()", "cli.py"),
    ("build", "build_parser()", "cli.py · 같은 파일"),
    ("parse", "parser.parse_args()", "argparse · 표준 라이브러리"),
    ("show", "todo.actions.show_tasks(3)", "actions.py → 할 일 3개 출력"),
]
CALLS = [("entry", "main", "5"), ("main", "build", "6"), ("main", "parse", "7"), ("main", "show", "8")]

CONTRASTS = [
    ("import-not-call", "import로 연결 ≠ 호출됨", ["python -m todo -h를 실행하면", "actions.py는 불러오지만", "show_tasks()는 호출되지 않습니다."]),
    ("call-only", "호출 지도에만 있는 것", ["build_parser()처럼 같은 파일 안의", "호출은 import 줄에 나타나지", "않습니다."]),
    ("order", "import 줄 순서 ≠ 실행 순서", ["import 줄은 파일을 연결할 뿐", "함수가 불리는 순서는 진입점부터", "호출을 따라가야 알 수 있습니다."]),
]
FOOT = [
    "todo는 Scene 02 학습용 변형입니다. Scene 01 시연 패키지를 cli.py·actions.py로 나누고, 실행 시점을 보이는 학습용 출력을 넣었습니다.",
    "학습용 출력([불러올 때]·[호출될 때])은 실제 프로그램 코드에는 넣지 않습니다. 그림의 순서는 이 변형을 실제로 실행한 결과입니다(Python 3.14.6).",
]
FOOT_M = [
    "todo는 Scene 02 학습용 변형입니다.",
    "Scene 01 패키지를 cli.py·actions.py로 나누고",
    "실행 시점을 보이는 학습용 출력을 넣었습니다.",
    "그림의 순서는 실제 실행 결과입니다.",
]
DESC = (
    "Scene 02. 학습용 변형 가상 패키지 todo의 구조와 실행. 실습 폴더에 main.py와 todo 패키지가 있고, todo 안에 __init__.py(패키지 초기화), "
    "__main__.py(python -m todo의 실행 진입점), cli.py(명령줄 해석 모듈), actions.py(할 일 기능 모듈)가 있다. 모듈은 .py 파일 하나, 패키지는 모듈을 묶은 폴더이며 "
    "__init__.py가 없는 Namespace Package라는 예외가 있다. python -m todo list --limit 3을 실행하면 불러올 때 단계로 1 todo/__init__.py, 2 todo/__main__.py, "
    "3 todo/cli.py, 4 todo/actions.py의 최상위 코드가 실행되고, 호출될 때 단계로 5 cli.main(), 6 cli.build_parser(), 7 parser.parse_args(), 8 actions.show_tasks(3)이 "
    "실행되어 할 일 3개를 출력한다. 실행 방식 비교: python -m todo는 __init__.py 다음 __main__.py, python -m todo.cli는 __init__.py 다음 cli.py를 시작 파일로 실행하고 "
    "__main__.py는 쓰지 않으며, python main.py는 main.py를 직접 실행한다. __main__.py는 파일 이름이고 if __name__ == \"__main__\":은 조건문이다. "
    "__init__.py는 패키지 파일이고 __init__()은 클래스의 메서드다. 그림 B는 같은 소스의 두 지도다. import 지도: __main__.py는 sys(표준 라이브러리)와 "
    "todo.cli의 main을, cli.py는 argparse(표준 라이브러리)와 todo.actions를 import한다. 화살표에 번호가 없다. 호출 지도: __main__.py의 sys.exit(main())이 "
    "5 main()을 호출하고, main()이 6 build_parser(), 7 parser.parse_args(), 8 todo.actions.show_tasks(3)을 차례로 호출한다. "
    "import로 연결되어 있어도 호출되지 않을 수 있고(python -m todo -h에서는 show_tasks가 호출되지 않음), 같은 파일 안의 호출은 import 줄에 나타나지 않으며, "
    "import 줄 순서는 실행 순서가 아니다."
)

EXTRA_STYLE = """      .imp { fill: none; stroke: #1d4f91; stroke-width: 2.4; stroke-dasharray: 9 6; }
      .impT { fill: #1d4f91; font-weight: 700; }
      .std { fill: #eceff2; stroke: #8a96a3; stroke-width: 1.2; }
      .stdT { fill: #3f4a55; font-weight: 700; }
      .mod { fill: #ffffff; stroke: #1d4f91; stroke-width: 1.8; }
      .pkg { fill: #f6f9fd; stroke: #1d4f91; stroke-width: 1.6; stroke-dasharray: 3 4; }
      .fn { fill: #ffffff; stroke: #17663f; stroke-width: 1.8; }
      .entry { fill: #f3f5f8; stroke: #1b2733; stroke-width: 1.6; }
      .th { fill: #f3f5f8; }
      .row { fill: none; stroke: #d5dce4; stroke-width: 1; }
"""


class Svg(s1.Svg):
    def imp(self, pts, frm, to):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="imp" marker-end="url(#{self.idp}-open)" data-import="{frm}>{to}"/>')

    def call(self, pts, frm, to, n):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="flow" marker-end="url(#{self.idp}-arr)" data-call="{frm}>{to}@{n}"/>')

    def chip(self, x, y, label, size, cls_box, cls_text, box, extra=""):
        """왼쪽 위 기준 칩. 너비를 돌려준다."""
        w = tw(label, size) + 18
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{size + 12}" rx="{(size + 12) / 2:g}" class="{cls_box}" data-box="{box}"{extra}/>')
        self.text(x + w / 2, y + size * 0.86 + 5, label, size, cls_text, "middle", box)
        return w

    def phase_box(self, x, y, w, h, phase, box):
        _, _, dash, fill, ink = PHASES[phase]
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="12" fill="{fill}" stroke="{ink}" stroke-width="1.8"{d} data-box="{box}" data-phase="{phase}"/>')

    def save(self, name, desc):
        tid, did = f"{self.idp}-title", f"{self.idp}-desc"
        style = s1.STYLE.replace("    </style>", EXTRA_STYLE + "    </style>")
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'role="img" aria-labelledby="{tid} {did}">\n'
                f'  <title id="{tid}">{esc(self.label)}</title>\n'
                f'  <desc id="{did}">{esc(desc)}</desc>\n'
                f'  <defs>\n{style}\n'
                f'    <marker id="{self.idp}-arr" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#1b2733"/></marker>\n'
                f'    <marker id="{self.idp}-open" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M1 1L10 6L1 11" fill="none" stroke="#1d4f91" stroke-width="2"/></marker>\n  </defs>\n'
                f'  <rect width="{self.w}" height="{self.h}" fill="#ffffff"/>\n')
        body = "\n".join("  " + b for b in self.body)
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(head + body + "\n</svg>\n")


def _rows(s, x, y, rows, size, step, box):
    for kind, t in rows:
        cls = {"t": "t", "b": "t b", "m": "t m", "s": "s"}[kind]
        s.text(x, y, t, size, cls, inside=box)
        y += step
    return y


def legend(s, x, y, w, size, mobile=False):
    """범례: 실행 순서(실선·번호), import 연결(파선·빈 화살촉·번호 없음), 표준 라이브러리(회색 칩)."""
    if mobile:
        s.rect(x, y, w, 126, "legend", 12)
        s.step(x + 20, y + 24, "1", 12, 14)
        s.add(f'<path d="M{x + 35} {y + 24}H{x + 70}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
        s.text(x + 82, y + 29, "실선·번호 = 실제 실행 순서", size)
        s.add(f'<path d="M{x + 12} {y + 58}H{x + 68}" class="imp" marker-end="url(#{s.idp}-open)"/>')
        s.text(x + 82, y + 63, "파란 파선 = import 연결(번호 없음)", size)
        s.add(f'<rect x="{x + 14}" y="{y + 82}" width="54" height="24" rx="12" class="std"/>')
        s.text(x + 82, y + 99, "회색 칩 = 표준 라이브러리", size)
        return y + 126
    s.rect(x, y, w, 60, "legend", 12)
    yy = y + 36
    s.step(x + 28, yy - 6, "1", 13, 16)
    s.add(f'<path d="M{x + 46} {yy - 6}H{x + 90}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
    s.text(x + 102, yy, "실선 화살표·번호 = 실제 실행 순서", size)
    s.add(f'<path d="M{x + 420} {yy - 6}H{x + 478}" class="imp" marker-end="url(#{s.idp}-open)"/>')
    s.text(x + 490, yy, "파란 파선 = import 연결 (번호 없음)", size)
    s.add(f'<rect x="{x + 832}" y="{yy - 19}" width="54" height="26" rx="13" class="std"/>')
    s.text(x + 898, yy, "회색 칩 = 표준 라이브러리", size)
    return y + 60


# ══ 노트북용 (1280) ══════════════════════════════════════════════
def desktop():
    W, H = 1280, 2010
    s = Svg(W, H, TITLE + " · 노트북용", "d2")
    s.text(32, 54, TITLE, 30, "t b")
    s.text(32, 90, "Scene 02 · " + SUB, 18, "s")
    legend(s, 16, 112, 1248, 17)

    # ── 그림 A ──────────────────────────────────────────────
    s.comment("그림 A. 패키지와 실행 시작점")
    section_head(s, 16, 222, "A", "패키지와 실행 시작점 · " + COMMAND, 22)

    s.comment("A-1 폴더 구조")
    s.rect(16, 246, 500, 664, "card", 12, "tree")
    s.text(36, 280, "폴더 구조", 19, "t b", inside="tree")
    y = 318
    for depth, name, kind, role in TREE:
        x = 36 + depth * 30
        if depth:
            s.add(f'<path d="M{x - 18} {y - 30}V{y - 6}H{x - 6}" fill="none" stroke="#9aa5b1" stroke-width="1.5"/>')
        s.add(f'<g data-file="{esc(name)}">')
        s.text(x, y, name, 18, "t m b", inside="tree")
        s.text(x, y + 26, role, 16, "s", inside="tree")
        s.add("</g>")
        y += 66
    s.add(f'<path d="M36 {y - 18}H496" fill="none" stroke="#d5dce4" stroke-width="1"/>')
    _rows(s, 36, y + 12, TREE_NOTES, 16, 26, "tree")

    s.comment("A-2 실제 실행 순서 ①~⑧ (불러올 때 / 호출될 때)")
    s.rect(544, 246, 720, 664, "card", 12, "timeline")
    s.text(564, 280, "실제 실행 순서", 19, "t b", inside="timeline")
    s.text(1244, 280, "출력으로 확인", 16, "s", "end", inside="timeline")
    # 단계 상자 왼쪽에 화살표 전용 통로(x=582)를 두어 단계 머리글·글자 위를 지나지 않게 한다
    top, sh, rail = 300, 60, 582
    ys = []
    for phase, rng in (("load", STEPS[:4]), ("call", STEPS[4:])):
        name, desc, *_ = PHASES[phase]
        ph = 44 + sh * len(rng)
        box = f"phase-{phase}"
        s.phase_box(560, top, 688, ph, phase, box)
        s.text(604, top + 28, name, 17, "t b", inside=box)
        s.text(604 + tw(name, 17) + 14, top + 28, desc, 16, "s", inside=box)
        y = top + 42
        for n, _, title, line, out in rng:
            sb = f"step-{n}"
            s.add(f'<g data-step="{n}" data-phase="{phase}" data-out="{esc(out)}">')
            s.rect(600, y, 632, sh - 10, "card", 10, sb)
            s.step(626, y + (sh - 10) / 2, n)
            s.text(652, y + 22, title, 17, "t m b", inside=sb)
            s.text(652, y + 42, line, 16, "s", inside=sb)
            s.add("</g>")
            ys.append((y, y + sh - 10))
            y += sh
        top += ph + 18
    for i in range(len(STEPS) - 1):
        a, b = ys[i], ys[i + 1]
        s.arrow([(600, a[1] - 14), (rail, a[1] - 14), (rail, b[0] + 14), (598, b[0] + 14)], STEPS[i][0], STEPS[i + 1][0])

    s.comment("A-3 실행 방식 비교")
    y0 = 942
    s.rect(16, y0, 1248, 224, "card", 12, "runmodes")
    s.text(36, y0 + 34, "실행 방식 비교 · 무엇이 시작 파일이 될까?", 19, "t b", inside="runmodes")
    cols = [(36, "실행 명령"), (316, "실행되는 순서(앞부분)"), (676, "__name__ == '__main__'인 파일"), (936, "뜻")]
    s.add(f'<rect x="28" y="{y0 + 50}" width="1224" height="36" rx="6" class="th"/>')
    for x, h in cols:
        s.text(x, y0 + 74, h, 16, "t b", inside="runmodes")
    for k, (cmd, order, mainf, mean) in enumerate(RUNMODES):
        yy = y0 + 118 + 38 * k
        s.add(f'<g data-runmode="{esc(cmd)}">')
        s.text(36, yy, cmd, 17, "t m b", inside="runmodes")
        s.text(316, yy, order, 16, "t m", inside="runmodes")
        s.text(676, yy, mainf, 16, "t m", inside="runmodes")
        s.text(936, yy, mean, 16, "t", inside="runmodes")
        s.add("</g>")

    s.comment("A-4 헷갈리기 쉬운 두 쌍")
    y0 = 1190
    for i, (cid, title, rows) in enumerate(CARDS):
        x = 16 + i * 636
        box = f"card-{cid}"
        s.add(f'<g data-card="{cid}">')
        s.rect(x, y0, 612, 210, "card", 12, box)
        s.text(x + 20, y0 + 34, title, 19, "t b m", inside=box)
        _rows(s, x + 20, y0 + 70, rows, 16, 25, box)
        s.add("</g>")

    # ── 그림 B ──────────────────────────────────────────────
    s.comment("그림 B. 같은 소스, 두 개의 지도")
    y0 = 1458
    section_head(s, 16, y0, "B", "같은 소스, 두 개의 지도", 22)
    s.text(300, y0 + 2, "파일이 연결되어 있다는 것과 그 안의 함수가 실행된다는 것은 다른 사실입니다.", 17, "s")
    top = y0 + 24

    s.comment("B-1 모듈 의존 관계(import 지도): 파선·빈 화살촉·번호 없음")
    s.rect(16, top, 612, 548, "card", 12, "map-import")
    s.text(36, top + 34, "B-1 모듈 의존 관계 · import 지도", 19, "t b", inside="map-import")
    s.text(36, top + 60, "파일 맨 위의 import 줄을 보고 그립니다. 번호가 없습니다.", 16, "s", inside="map-import")
    s.add(f'<rect x="32" y="{top + 78}" width="580" height="412" rx="12" class="pkg" data-box="pkg"/>')
    s.text(48, top + 104, "todo 패키지", 17, "impT", inside="pkg")
    s.text(160, top + 104, "· __init__.py는 패키지를 처음 불러올 때 실행", 16, "s", inside="pkg")
    mb = {}
    yy = top + 122
    for mid, label, lines in MODULES:
        h = 46 + 30 * max(len(lines), 1)
        box = f"mod-{mid}"
        mb[mid] = (52, yy, 400, h)
        s.add(f'<g data-module="{mid}">')
        s.rect(52, yy, 400, h, "mod", 10, box)
        s.text(70, yy + 28, label, 17, "t m b", inside=box)
        if not lines:
            s.text(70, yy + 58, "(import 줄 없음)", 16, "s", inside=box)
        for k, (code, tgt, kind) in enumerate(lines):
            ly = yy + 58 + 30 * k
            s.text(70, ly, code, 16, "impT m", inside=box)
            if kind == "std":
                s.chip(70 + tw(code, 16, True) + 14, ly - 18, "표준 라이브러리", 16, "std", "stdT", f"std-{mid}-{tgt}", f' data-import="{mid}>{tgt}"')
        s.add("</g>")
        yy += h + 32
    for mid, _, lines in MODULES:
        for code, tgt, kind in lines:
            if kind == "proj":
                x, y, w, h = mb[mid]
                tx, ty, _, _ = mb[tgt]
                s.imp([(x + 330, y + h), (x + 330, ty - 2)], mid, tgt)
                s.text(x + 344, (y + h + ty) / 2 + 6, "import", 16, "impT")
    s.text(36, top + 524, "→ 파일끼리의 연결은 보이지만, 함수가 언제 불리는지는 알 수 없습니다.", 16, "s", inside="map-import")

    s.comment("B-2 함수 실행 흐름(호출 지도): 실선·채운 화살촉·번호(그림 A와 같은 번호)")
    x1 = 652
    s.rect(x1, top, 612, 548, "card", 12, "map-call")
    s.text(x1 + 20, top + 34, "B-2 함수 실행 흐름 · 호출 지도", 19, "t b", inside="map-call")
    s.text(x1 + 20, top + 60, "진입점에서 함수 본문 안의 호출을 따라갑니다. 번호 = 그림 A의 순서", 16, "s", inside="map-call")
    nodes = {
        "entry": (x1 + 20, top + 84, 572, 50),
        "main": (x1 + 20, top + 176, 170, 300),
        "build": (x1 + 268, top + 196, 324, 62),
        "parse": (x1 + 268, top + 296, 324, 62),
        "show": (x1 + 268, top + 396, 324, 62),
    }
    for nid, fn, where in CALL_NODES:
        x, y, w, h = nodes[nid]
        box = f"call-{nid}"
        cls = "entry" if nid == "entry" else "fn"
        s.add(f'<g data-callnode="{nid}">')
        s.rect(x, y, w, h, cls, 10, box)
        if nid == "entry":
            s.text(x + 18, y + 32, where, 16, "s", inside=box)
            s.text(x + w - 18, y + 32, fn, 17, "t m b", "end", inside=box)
        else:
            s.text(x + 16, y + 26, fn, 17, "t m b", inside=box)
            s.text(x + 16, y + 50, where, 16, "s", inside=box)
        s.add("</g>")
    ex, ey, _, eh = nodes["entry"]
    mx, my, mw, mh = nodes["main"]
    s.call([(mx + 60, ey + eh), (mx + 60, my - 2)], "entry", "main", "5")
    s.step(mx + 90, (ey + eh + my) / 2, "5")
    for nid, n in (("build", "6"), ("parse", "7"), ("show", "8")):
        x, y, w, h = nodes[nid]
        cy = y + h / 2
        s.call([(mx + mw, cy), (x - 2, cy)], "main", nid, n)
        s.step((mx + mw + x) / 2, cy - 18, n)
    s.text(x1 + 20, top + 524, "→ build_parser()처럼 import 줄에 없는 호출도 보입니다.", 16, "s", inside="map-call")

    s.comment("두 지도를 겹쳐 보면")
    y0 = top + 580
    cw = (1248 - 2 * 24) / 3
    for i, (cid, title, lines) in enumerate(CONTRASTS):
        x = 16 + i * (cw + 24)
        box = f"contrast-{cid}"
        s.add(f'<g data-contrast="{cid}">')
        s.rect(x, y0, cw, 136, "legend", 12, box)
        s.text(x + 18, y0 + 32, title, 18, "t b", inside=box)
        for k, ln in enumerate(lines):
            s.text(x + 18, y0 + 62 + 24 * k, ln, 16, "t", inside=box)
        s.add("</g>")
    for i, t in enumerate(FOOT):
        s.text(32, y0 + 172 + 26 * i, t, 16, "s")
    s.h = int(y0 + 172 + 26 * len(FOOT) + 4)
    s.save("package-flow-desktop.svg", DESC)


# ══ 휴대전화용 (360) ═════════════════════════════════════════════
def mobile():
    W = 360
    s = Svg(W, 0, TITLE + " · 휴대전화용", "m2")
    for i, t in enumerate(["내 Python 프로그램은", "어디에서 시작하고, 파일들은", "어떻게 연결될까?"]):
        s.text(12, 32 + 28 * i, t, 21, "t b")
    s.text(12, 112, "Scene 02 · 시작 파일을 찾고, import 연결과", 14, "s")
    s.text(12, 132, "실제 호출을 나눠 읽기", 14, "s")
    y = legend(s, 12, 146, 336, 15, mobile=True) + 40

    s.comment("그림 A")
    section_head(s, 12, y, "A", "패키지와 실행 시작점", 17)
    y += 16
    th = 52 + 58 * len(TREE) + 26 * len(TREE_NOTES) + 18
    s.rect(12, y, 336, th, "card", 12, "tree")
    s.text(24, y + 30, "폴더 구조", 16, "t b", inside="tree")
    yy = y + 62
    for depth, name, kind, role in TREE:
        x = 24 + depth * 20
        if depth:
            s.add(f'<path d="M{x - 12} {yy - 30}V{yy - 6}H{x - 4}" fill="none" stroke="#9aa5b1" stroke-width="1.5"/>')
        s.add(f'<g data-file="{esc(name)}">')
        s.text(x, yy, name, 15, "t m b", inside="tree")
        role_m = role if tw(role, 14) < 336 - 24 - x else role.split(" · ")[0]
        s.text(x, yy + 22, role_m if role_m != role else role, 14, "s", inside="tree")
        s.add("</g>")
        yy += 58
    s.add(f'<path d="M24 {yy - 14}H336" fill="none" stroke="#d5dce4" stroke-width="1"/>')
    notes_m = [("b", "모듈 = .py 파일 하나"), ("b", "패키지 = 모듈을 묶은 폴더"), ("s", "예외: __init__.py 없는 Namespace Package")]
    _rows(s, 24, yy + 12, notes_m, 14, 26, "tree")
    y += th + 24

    s.text(12, y + 4, "실제 실행 순서", 16, "t b")
    s.text(12, y + 26, COMMAND, 14, "t m")
    y += 40
    ys = []
    for phase, rng in (("load", STEPS[:4]), ("call", STEPS[4:])):
        name, desc, *_ = PHASES[phase]
        sh = 74
        ph = 62 + sh * len(rng)
        box = f"phase-{phase}"
        s.phase_box(12, y, 336, ph, phase, box)
        s.text(44, y + 26, name, 15, "t b", inside=box)
        s.text(44, y + 48, desc.split(" · ")[0], 14, "s", inside=box)
        yy = y + 62
        for n, _, title, line, out in rng:
            sb = f"step-{n}"
            s.add(f'<g data-step="{n}" data-phase="{phase}" data-out="{esc(out)}">')
            s.rect(40, yy, 298, sh - 12, "card", 10, sb)
            s.step(62, yy + (sh - 12) / 2, n, 13, 15)
            s.text(84, yy + 25, title, 14, "t m b", inside=sb)
            s.text(84, yy + 47, line if tw(line, 14) < 246 else line.split(" · ")[0], 14, "s", inside=sb)
            s.add("</g>")
            ys.append((yy, yy + sh - 12))
            yy += sh
        y += ph + 14
    for i in range(len(STEPS) - 1):
        a, b = ys[i], ys[i + 1]  # 단계 상자 왼쪽 통로(x=26)로 돌아 머리글 위를 지나지 않게 한다
        s.arrow([(40, a[1] - 12), (26, a[1] - 12), (26, b[0] + 12), (38, b[0] + 12)], STEPS[i][0], STEPS[i + 1][0])
    y += 30

    s.text(12, y, "실행 방식 비교", 16, "t b")
    y += 14
    for cmd, order, mainf, mean in RUNMODES:
        box = f"rm-{cmd.split()[1] if cmd.split()[1] != '-m' else cmd.split()[2]}"
        s.add(f'<g data-runmode="{esc(cmd)}">')
        s.rect(12, y, 336, 104, "card", 10, box)
        s.text(24, y + 28, cmd, 15, "t m b", inside=box)
        s.text(24, y + 52, order, 14, "t m", inside=box)
        s.text(24, y + 74, "__main__인 파일: " + mainf, 14, "t", inside=box)
        s.text(24, y + 94, mean, 14, "s", inside=box)
        s.add("</g>")
        y += 112
    y += 14
    for cid, title, rows in CARDS:
        box = f"card-{cid}"
        rows_m = [(k, t) for k, t in rows if tw(t, 14) < 312]
        left, right = title.split(" ≠ ")  # 휴대전화는 비교 제목을 두 줄로
        h = 74 + 24 * len(rows_m) + 8
        s.add(f'<g data-card="{cid}">')
        s.rect(12, y, 336, h, "card", 12, box)
        s.text(24, y + 30, left + " ≠", 15, "t b m", inside=box)
        s.text(24, y + 54, right, 15, "t b m", inside=box)
        _rows(s, 24, y + 84, rows_m, 14, 24, box)
        s.add("</g>")
        y += h + 10
    y += 40

    s.comment("그림 B")
    section_head(s, 12, y, "B", "같은 소스, 두 개의 지도", 17)
    s.text(12, y + 28, "파일 연결과 함수 실행은 다른 사실입니다.", 14, "s")
    y += 44
    s.comment("B-1 import 지도")
    mh_total = sum(46 + 30 * max(len(l), 1) for *_, l in MODULES) + 34 * (len(MODULES) - 1)
    ch = 92 + 30 + mh_total + 60
    s.rect(12, y, 336, ch, "card", 12, "map-import")
    s.text(24, y + 30, "B-1 모듈 의존 관계 · import 지도", 15, "t b", inside="map-import")
    s.text(24, y + 52, "파일 맨 위 import 줄로 그림 · 번호 없음", 14, "s", inside="map-import")
    s.add(f'<rect x="20" y="{y + 68}" width="320" height="{30 + mh_total + 16}" rx="10" class="pkg" data-box="pkg"/>')
    s.text(32, y + 90, "todo 패키지", 14, "impT", inside="pkg")
    mb = {}
    yy = y + 104
    for mid, label, lines in MODULES:
        h = 46 + 30 * max(len(lines), 1)
        box = f"mod-{mid}"
        mb[mid] = (28, yy, 304, h)
        s.add(f'<g data-module="{mid}">')
        s.rect(28, yy, 304, h, "mod", 10, box)
        s.text(40, yy + 26, label, 14, "t m b", inside=box)
        if not lines:
            s.text(40, yy + 56, "(import 줄 없음)", 14, "s", inside=box)
        for k, (code, tgt, kind) in enumerate(lines):
            ly = yy + 56 + 30 * k
            s.text(40, ly, code, 14, "impT m", inside=box)
            if kind == "std":
                s.chip(40 + tw(code, 14, True) + 10, ly - 16, "표준", 14, "std", "stdT", f"std-{mid}-{tgt}", f' data-import="{mid}>{tgt}"')
        s.add("</g>")
        yy += h + 34
    for mid, _, lines in MODULES:
        for code, tgt, kind in lines:
            if kind == "proj":
                x, yb, w, h = mb[mid]
                _, ty, _, _ = mb[tgt]
                s.imp([(x + 250, yb + h), (x + 250, ty - 2)], mid, tgt)
                s.text(x + 200, (yb + h + ty) / 2 + 5, "import", 14, "impT", "end")
    s.text(24, y + ch - 20, "함수가 언제 불리는지는 알 수 없음", 14, "s", inside="map-import")
    y += ch + 16

    s.comment("B-2 호출 지도")
    ch = 476
    s.rect(12, y, 336, ch, "card", 12, "map-call")
    s.text(24, y + 30, "B-2 함수 실행 흐름 · 호출 지도", 15, "t b", inside="map-call")
    s.text(24, y + 52, "진입점부터 호출을 따라감 · 번호 = 그림 A", 14, "s", inside="map-call")
    nodes = {
        "entry": (24, y + 70, 312, 58),
        "main": (24, y + 168, 140, 56),
        "build": (84, y + 244, 252, 52),
        "parse": (84, y + 314, 252, 52),
        "show": (84, y + 384, 252, 70),
    }
    for nid, fn, where in CALL_NODES:
        x, yy, w, h = nodes[nid]
        box = f"call-{nid}"
        s.add(f'<g data-callnode="{nid}">')
        s.rect(x, yy, w, h, "entry" if nid == "entry" else "fn", 10, box)
        fn_m = "show_tasks(3)" if nid == "show" else fn
        s.text(x + 12, yy + 24, fn_m, 14, "t m b", inside=box)
        if nid == "show":
            s.text(x + 12, yy + 44, "todo.actions의 함수", 14, "s", inside=box)
            s.text(x + 12, yy + 62, "→ 할 일 3개 출력", 14, "s", inside=box)
        else:
            s.text(x + 12, yy + 44, where.split(" · ")[0], 14, "s", inside=box)
        s.add("</g>")
    ex, ey, _, eh = nodes["entry"]
    mx, my, mw, mh = nodes["main"]
    s.call([(mx + 30, ey + eh), (mx + 30, my - 2)], "entry", "main", "5")
    s.step(mx + 58, (ey + eh + my) / 2, "5", 13, 15)
    for nid, n in (("build", "6"), ("parse", "7"), ("show", "8")):
        x, yy, w, h = nodes[nid]
        cy = yy + 24
        s.call([(mx + 30, my + mh), (mx + 30, cy), (x - 2, cy)], "main", nid, n)
        s.step(x - 14, cy - 20, n, 11, 14)
    y += ch + 16

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
    s.save("package-flow-mobile.svg", DESC)


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
