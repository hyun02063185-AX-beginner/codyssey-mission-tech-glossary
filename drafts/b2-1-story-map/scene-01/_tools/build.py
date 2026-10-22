"""B2-1 Scene 01 (터미널에 입력한 한 줄을 컴퓨터는 어떻게 알아들을까?) 노트북·휴대전화 SVG 생성기.

두 그림은 아래 TOKENS · OWNERS · STEPS · RULES · PARSE · COMPARE 한 벌에서 만든다.
요소마다 data-token / data-owner / data-step / data-card / data-ref 속성을 붙여
check.cjs가 두 그림의 의미(토큰·해석 주체·처리 순서·비교 카드)가 같은지 비교하고,
Codex가 웹 인터랙션(토큰 선택, 단계 강조)을 붙일 때 같은 이름을 쓰게 한다.
글자를 담는 상자에는 data-box, 그 안의 글자에는 data-in을 붙여 넘침을 검사한다.

실행: python -I build.py  (출력: ../cli-command-desktop.svg, ../cli-command-mobile.svg)
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)

# ── 내용 (노트북·휴대전화 공통) ────────────────────────────────
TITLE = "터미널에 입력한 한 줄을 컴퓨터는 어떻게 알아들을까?"
QUESTION = "CLI 명령어에서 Python이 처리하는 부분과 프로그램이 처리하는 부분은 어떻게 다를까?"

# 해석 주체. 색과 함께 테두리 모양(점선·파선·실선)과 이름표 글자로 구분한다(색만으로 구분하지 않음).
OWNERS = {
    "os": {"name": "터미널·운영체제", "badge": "OS", "dash": "2 5", "ink": "#4b5563", "fill": "#f3f4f6", "tok": "#4b5563"},
    "python": {"name": "Python 인터프리터", "badge": "Py", "dash": "9 6", "ink": "#1d4f91", "fill": "#e9f1fc", "tok": "#1d4f91"},
    "program": {"name": "내 프로그램 (argparse)", "badge": "앱", "dash": "", "ink": "#17663f", "fill": "#e7f4ec", "tok": "#17663f"},
}
OWNER_DESC = {
    "os": ["python 프로그램을 찾아 실행하고", "한 줄을 낱말 목록으로 넘깁니다"],
    "python": ["-m todo: todo 패키지를", "실행 대상으로 찾아 실행합니다"],
    "program": ["list = 하위 명령 · --limit = 긴 옵션 · 5 = 옵션 값", "Python은 이 부분을 해석하지 않고 그대로 넘깁니다"],
}
OWNER_DESC_M = {
    "os": ["python 프로그램을 찾아 실행"],
    "python": ["todo 패키지를 찾아 실행"],
    "program": ["Python은 해석하지 않고 그대로 넘김"],
}
# (토큰, 이름, 해석 주체)
TOKENS = [
    ("python", "실행할 프로그램", "os"),
    ("-m", "Python 옵션", "python"),
    ("todo", "패키지 이름", "python"),
    ("list", "하위 명령", "program"),
    ("--limit", "긴 옵션", "program"),
    ("5", "옵션 값", "program"),
]
KEY_LINE = "-m todo까지가 Python의 몫입니다. 그 뒤의 낱말은 모두 프로그램에 그대로 전달됩니다."

# 처리 순서 ①~⑤: (번호, 제목, 설명 줄, 코드 줄, 휴대전화 설명 줄, 해석 주체)
STEPS = [
    ("1", "낱말로 나누기", ["터미널이 한 줄을 낱말로", "나눠 python을 실행"], ["python  -m  todo", "list  --limit  5"],
     ["터미널이 한 줄을 낱말로 나눠", "python을 실행합니다"], "os"),
    ("2", "-m 처리", ["Python이 todo 패키지를", "찾아 실행을 시작", "(파일 구조는 Scene 02)"], [],
     ["Python이 todo 패키지를 찾아", "실행을 시작합니다 (파일 구조는 Scene 02)"], "python"),
    ("3", "sys.argv에 담기", ["남은 낱말이 문자열", "목록으로 프로그램에 전달"], ["['…/__main__.py',", " 'list',", " '--limit', '5']"],
     ["남은 낱말이 문자열 목록으로", "프로그램에 전달됩니다"], "python"),
    ("4", "parse_args()로 해석", ["규칙과 맞춰", "이름 붙은 값으로 해석", "'5'(문자열) → 5(정수)"], ["Namespace(", "  command='list',", "  limit=5)"],
     ["규칙과 맞춰 이름 붙은 값으로", "'5'(문자열) → 5(정수)"], "program"),
    ("5", "값 사용", ["프로그램이 값을 꺼내", "함수를 호출 (Scene 07)"], ["args.limit  # 5", "show_tasks(", "    args.limit)"],
     ["프로그램이 값을 꺼내 함수를", "호출합니다 (자세히 Scene 07)"], "program"),
]
STEP_OWNER_LABEL = {"os": "터미널·OS", "python": "Python", "program": "내 프로그램"}

# argparse 규칙 정하기(코드에 적는 부분): (코드, 설명, 휴대전화 코드 줄)
RULES = [
    ('ArgumentParser(prog="todo")', "해석기를 만든다 (-h · --help 자동 추가)", ['ArgumentParser(prog="todo")']),
    ('add_subparsers() → add_parser("list")', "하위 명령을 등록한다", ["add_subparsers()", '→ add_parser("list")']),
    ('add_argument("-n", "--limit", type=int)', "받을 옵션과 값의 규칙을 등록한다", ['add_argument("-n", "--limit",', "             type=int)"]),
]
PARSE = {
    "code": "args = parser.parse_args()",
    "lines": ["sys.argv의 낱말을 규칙과 맞춰 해석", "규칙에 맞지 않으면 사용법을 보여 주고 종료"],
    "result": "Namespace(command='list', limit=5)",
    "error": "--limit five  →  error (종료 코드 2)",
}
# 비교 카드: (id, 제목, [(종류, 글자)]) 종류: t 일반, b 굵게, m 코드, s 흐리게
COMPARE = [
    ("cli-gui", "CLI와 GUI", [
        ("b", "CLI: 문자로 명령을 입력"), ("m", "python -m todo list"),
        ("b", "GUI: 버튼·메뉴를 눌러 조작"),
        ("t", "같은 기능을 다른 방법으로"), ("t", "요청할 수 있습니다."),
        ("s", "CLI는 반복·자동화에 유리하지만"), ("s", "명령 형식을 알아야 합니다."),
    ]),
    ("help", "-h와 --help", [
        ("t", "같은 옵션의 짧은 이름과 긴 이름."), ("t", "argparse가 둘 다 자동으로 만듭니다."),
        ("b", "쓰는 위치가 주인을 정합니다"),
        ("m", "python -h"), ("t", "→ Python 자체의 도움말"),
        ("m", "python -m todo -h"), ("t", "→ todo 프로그램의 도움말"),
    ]),
    ("args", "명령줄 인자와 함수 인자", [
        ("b", "공통: 받는 쪽이 정한 자리에 값을 넘김"),
        ("t", "명령줄: 모든 값이 문자열로 도착"), ("t", "→ argparse가 해석하고 형을 바꿈"),
        ("t", "함수 호출: Python 값이 그대로"), ("t", "매개변수(Parameter)에 연결"),
        ("s", "자동 형 변환 없음 · 자세히 Scene 07"),
    ]),
]
FOOT = [
    "todo는 설명용 가상 패키지입니다. 실제 미션 구현 사례(ledger)는 원고의 '구현 사례' 절에서 따로 다룹니다.",
    "단순화: 낱말을 나누는 규칙(따옴표·공백)은 터미널·운영체제마다 다릅니다. -m 실행의 세부 과정은 Scene 02에서 다룹니다.",
]
FOOT_M = [
    "todo는 설명용 가상 패키지입니다.",
    "실제 구현 사례(ledger)는 원고에서 따로 봅니다.",
    "단순화: 낱말을 나누는 규칙은 터미널마다",
    "다릅니다. -m 실행의 세부는 Scene 02.",
]
DESC = (
    "Scene 01. 설명용 가상 패키지 todo의 명령 python -m todo list --limit 5를 영역별로 나눈다. "
    "python은 실행할 프로그램으로 터미널·운영체제가 찾아 실행한다. -m과 todo는 Python 인터프리터가 처리하며 todo 패키지를 실행 대상으로 찾는다. "
    "list(하위 명령), --limit(긴 옵션), 5(옵션 값)는 Python이 해석하지 않고 프로그램에 그대로 넘기며 프로그램의 argparse가 해석한다. "
    "처리 순서: 1 터미널이 한 줄을 낱말로 나눠 python을 실행, 2 Python이 -m todo를 처리해 패키지 실행을 시작, "
    "3 남은 낱말이 sys.argv에 문자열 목록으로 전달, 4 parse_args()가 규칙과 맞춰 Namespace(command='list', limit=5)로 해석하며 문자열 '5'를 정수 5로 바꿈, "
    "5 프로그램이 args.limit 값을 꺼내 함수를 호출. argparse는 Argument와 Parsing을 합친 이름이다. "
    "프로그램 코드는 ArgumentParser, add_subparsers와 add_parser, add_argument로 받을 규칙을 먼저 정하고, parse_args()가 실행할 때 그 규칙을 참고해 입력을 해석한다. "
    "규칙에 맞지 않는 입력(--limit five)은 사용법 안내와 함께 종료 코드 2로 끝난다. "
    "비교: CLI는 문자로, GUI는 버튼·메뉴로 조작한다. -h와 --help는 같은 옵션의 짧은 이름과 긴 이름이며, python -h는 Python 도움말, python -m todo -h는 todo 도움말이다. "
    "명령줄 인자는 모두 문자열로 도착해 argparse가 해석하고, 함수 인자는 Python 값이 그대로 매개변수에 연결되며 자동 형 변환이 없다. "
    "낱말을 나누는 규칙은 터미널마다 다르다는 단순화가 있다."
)

FONT = "var(--font-body, 'Pretendard VF', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans CJK KR', system-ui, sans-serif)"
MONO = "var(--font-mono, ui-monospace, 'Cascadia Mono', Consolas, 'D2Coding', monospace)"
STYLE = f"""    <style>
      text {{ font-family: {FONT}; }}
      .t {{ fill: #1b2733; }}
      .s {{ fill: #4f5d6b; }}
      .b {{ font-weight: 700; }}
      .m {{ font-family: {MONO}; }}
      .w {{ fill: #ffffff; }}
      .card {{ fill: #ffffff; stroke: #c9d2dc; stroke-width: 1.4; }}
      .legend {{ fill: #f7f9fb; stroke: #c9d2dc; stroke-width: 1.2; }}
      .term {{ fill: #1f2933; }}
      .flow {{ fill: none; stroke: #1b2733; stroke-width: 2.6; }}
      .ref {{ fill: none; stroke: #6b4fa0; stroke-width: 2.2; stroke-dasharray: 7 6; }}
      .refT {{ fill: #5a3f8e; font-weight: 700; }}
      .step {{ fill: #1b2733; }}
      .stepT {{ fill: #ffffff; font-weight: 700; }}
      .code {{ fill: #f3f5f8; stroke: #d5dce4; stroke-width: 1; }}
      .err {{ fill: #9b2c2c; }}
    </style>"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("'", "&#39;")


def tw(s, size, mono=False):
    """글자 폭 어림값(배치용). 실제 폭은 check.cjs가 렌더링으로 잰다."""
    if mono:
        return len(s) * size * 0.6
    w = 0
    for ch in s:
        if ord(ch) > 0x2E80:
            w += size * 0.98
        elif ch == " ":
            w += size * 0.3
        elif ch in "il.,:;'|!()[]":
            w += size * 0.32
        elif ch.isupper() or ch in "mwMW@%":
            w += size * 0.68
        else:
            w += size * 0.56
    return w


class Svg:
    def __init__(self, w, h, label, idp):
        self.w, self.h, self.idp, self.label = w, h, idp, label
        self.body = []

    def add(self, s):
        self.body.append(s)

    def comment(self, s):
        self.add(f"<!-- {s} -->")

    def rect(self, x, y, w, h, cls="card", rx=12, box=None, extra=""):
        b = f' data-box="{box}"' if box else ""
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{rx}" class="{cls}"{b}{extra}/>')

    def text(self, x, y, s, size, cls="t", anchor="start", inside=None, extra=""):
        a = f' text-anchor="{anchor}"' if anchor != "start" else ""
        i = f' data-in="{inside}"' if inside else ""
        sp = ' xml:space="preserve"' if "m" in cls.split() else ""  # 코드 줄의 들여쓰기 유지
        self.add(f'<text x="{x:g}" y="{y:g}" font-size="{size}" class="{cls}"{a}{i}{sp}{extra}>{esc(s)}</text>')

    def owner_rect(self, x, y, w, h, owner, box, rx=12, sw=2, fill=True):
        o = OWNERS[owner]
        dash = f' stroke-dasharray="{o["dash"]}"' if o["dash"] else ""
        f = o["fill"] if fill else "#ffffff"
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{rx}" fill="{f}" stroke="{o["ink"]}" '
                 f'stroke-width="{sw}"{dash} data-box="{box}" data-owner="{owner}"/>')

    def badge(self, x, y, owner, size, inside):
        """해석 주체 이름표(글자로 구분). x,y = 왼쪽 위."""
        o = OWNERS[owner]
        w = tw(o["badge"], size) * 1.2 + 20
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{size + 14}" rx="6" fill="{o["ink"]}" data-box="{inside}-badge"/>')
        self.text(x + w / 2, y + size * 0.86 + 6, o["badge"], size, "w b", "middle", f"{inside}-badge")
        return w

    def step(self, cx, cy, n, r=14, size=16):
        self.add(f'<circle cx="{cx:g}" cy="{cy:g}" r="{r}" class="step" data-step-mark="{n}"/>')
        self.text(cx, cy + size * 0.36, n, size, "stepT", "middle")

    def arrow(self, pts, step_from, step_to):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="flow" marker-end="url(#{self.idp}-arr)" data-flow="{step_from}>{step_to}"/>')

    def ref(self, pts, frm, to):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="ref" data-ref="{frm}>{to}"/>')

    def save(self, name, desc):
        tid, did = f"{self.idp}-title", f"{self.idp}-desc"
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'role="img" aria-labelledby="{tid} {did}">\n'
                f'  <title id="{tid}">{esc(self.label)}</title>\n'
                f'  <desc id="{did}">{esc(desc)}</desc>\n'
                f'  <defs>\n{STYLE}\n'
                f'    <marker id="{self.idp}-arr" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#1b2733"/></marker>\n  </defs>\n'
                f'  <rect width="{self.w}" height="{self.h}" fill="#ffffff"/>\n')
        body = "\n".join("  " + b for b in self.body)
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(head + body + "\n</svg>\n")


def section_head(s, x, y, letter, title, size):
    s.add(f'<rect x="{x:g}" y="{y - size - 2:g}" width="{size + 12}" height="{size + 12}" rx="7" fill="#1b2733"/>')
    s.text(x + (size + 12) / 2, y + 2, letter, size - 2, "w b", "middle")
    s.text(x + size + 24, y + 2, title, size, "t b")


# ══ 노트북용 (1280) ══════════════════════════════════════════════
def desktop():
    W, H = 1280, 1672
    s = Svg(W, H, TITLE + " · 노트북용", "d1")
    s.text(32, 54, TITLE, 30, "t b")
    s.text(32, 90, "Scene 01 · " + QUESTION, 18, "s")

    s.comment("범례")
    s.rect(16, 112, 1248, 60, "legend", 12)
    y = 148
    s.step(44, y - 6, "1", 13, 16)
    s.add(f'<path d="M62 {y - 6}H104" class="flow" marker-end="url(#d1-arr)"/>')
    s.text(116, y, "실선 화살표·번호 = 실제 처리 순서", 17)
    s.add(f'<path d="M420 {y - 6}H468" class="ref"/>')
    s.text(480, y, "점선 = 규칙을 참고함 (순서 아님)", 17)
    s.add(f'<path d="M772 {y - 14}v10h44v-10" fill="none" stroke="#1b2733" stroke-width="2"/>')
    s.text(830, y, "괄호 = 그 부분을 해석하는 주체", 17)

    # ── A. 명령 한 줄 분해 ─────────────────────────────────────
    s.comment("A. 명령 한 줄을 영역별로 나눠 읽기")
    section_head(s, 16, 222, "A", "명령 한 줄을 영역별로 나눠 읽기", 22)
    s.rect(16, 244, 1248, 112, "term", 16)
    size, pad, gap = 34, 18, 40
    widths = [tw(t, size, True) + 2 * pad for t, *_ in TOKENS]
    x0 = (W - (sum(widths) + gap * (len(TOKENS) - 1))) / 2
    s.text(x0 - 46, 312, "$", size, "m", extra=' fill="#9aa5b1"')
    spans = {}
    x = x0
    for (tok, name, owner), w in zip(TOKENS, widths):
        o = OWNERS[owner]
        dash = f' stroke-dasharray="{o["dash"]}"' if o["dash"] else ""
        s.add(f'<g data-token="{esc(tok)}" data-owner="{owner}">')
        s.add(f'<rect x="{x:g}" y="268" width="{w:g}" height="64" rx="10" fill="{o["tok"]}" stroke="#ffffff" stroke-width="2"{dash} data-box="tok-{esc(tok)}"/>')
        s.text(x + w / 2, 312, tok, size, "m w b", "middle", f"tok-{esc(tok)}")
        s.text(x + w / 2, 386, name, 17, "t b", "middle")
        s.add("</g>")
        a, b = spans.get(owner, (x, x + w))
        spans[owner] = (min(a, x), max(b, x + w))
        x += w + gap

    s.comment("해석 주체 괄호와 설명 상자(색 + 테두리 모양 + 이름표 글자)")
    cols = {"os": (16, 336), "python": (368, 312), "program": (696, 568)}
    for owner, (a, b) in spans.items():
        o = OWNERS[owner]
        dash = f' stroke-dasharray="{o["dash"]}"' if o["dash"] else ""
        cx = (a + b) / 2
        bx, bw = cols[owner]
        s.add(f'<path d="M{a:g} 404v12H{b:g}v-12M{cx:g} 416V440" fill="none" stroke="{o["ink"]}" stroke-width="2.4"{dash} data-bracket="{owner}"/>')
        s.owner_rect(bx, 440, bw, 112, owner, f"own-{owner}")
        bw_ = s.badge(bx + 16, 452, owner, 16, f"own-{owner}")
        s.text(bx + 16 + bw_ + 10, 474, o["name"], 19, "t b", inside=f"own-{owner}")
        for k, ln in enumerate(OWNER_DESC[owner]):
            s.text(bx + 16, 506 + 26 * k, ln, 17, "t", inside=f"own-{owner}")
    s.text(32, 588, KEY_LINE, 19, "t b")

    # ── B. 처리 순서 ────────────────────────────────────────────
    s.comment("B. 한 줄이 프로그램이 쓰는 값이 되기까지 (실제 처리 순서 ①~⑤)")
    section_head(s, 16, 640, "B", "한 줄이 프로그램이 쓰는 값이 되기까지", 22)
    bw, gapb, by, bh = 227.2, 28, 664, 260
    for i, (n, title, lines, code, _, owner) in enumerate(STEPS):
        bx = 16 + i * (bw + gapb)
        box = f"step-{n}"
        s.add(f'<g data-step="{n}" data-owner="{owner}">')
        s.rect(bx, by, bw, bh, "card", 12, box)
        s.step(bx + 26, by + 28, n)
        s.text(bx + 48, by + 34, title, 18, "t b", inside=box)
        yy = by + 66
        for ln in lines:
            s.text(bx + 16, yy, ln, 16, "t", inside=box)
            yy += 23
        if code:
            ch = 22 * len(code) + 12
            s.rect(bx + 12, yy - 6, bw - 24, ch, "code", 8, f"{box}-code")
            for k, ln in enumerate(code):
                s.text(bx + 22, yy + 15 + 22 * k, ln, 16, "t m", inside=f"{box}-code")
        o = OWNERS[owner]
        lab = STEP_OWNER_LABEL[owner]
        lw = tw(lab, 16) + 26
        s.owner_rect(bx + 12, by + bh - 40, lw, 28, owner, f"{box}-who", rx=14, sw=1.6)
        s.text(bx + 12 + lw / 2, by + bh - 20, lab, 16, "t b", "middle", f"{box}-who")
        s.add("</g>")
        if i < len(STEPS) - 1:
            s.arrow([(bx + bw, by + bh / 2), (bx + bw + gapb - 2, by + bh / 2)], n, STEPS[i + 1][0])

    # ── C. argparse 규칙 정하기와 해석하기 ──────────────────────────
    s.comment("C. argparse: 규칙을 먼저 정하고(코드), 실행할 때 입력을 해석한다. 둘 사이는 처리 순서가 아니라 '규칙 참고'(점선)")
    section_head(s, 16, 980, "C", "argparse = Argument(인자) + Parsing(구조 분석)", 22)
    s.text(32, 1014, "프로그램 코드에 받을 규칙을 먼저 적어 두고, 실행할 때 parse_args()가 실제 입력을 그 규칙에 맞춰 해석합니다.", 17, "s")
    s.rect(16, 1032, 660, 236, "card", 12, "rules")
    s.text(36, 1066, "규칙 정하기 · 프로그램 코드에 적는 부분", 19, "t b", inside="rules")
    for k, (code, desc, _) in enumerate(RULES):
        yy = 1106 + 54 * k
        s.add(f'<g data-rule="{k + 1}">')
        s.text(36, yy, code, 17, "t m b", inside="rules")
        s.text(36, yy + 24, desc, 16, "s", inside="rules")
        s.add("</g>")
    s.rect(764, 1032, 500, 236, "card", 12, "parse")
    s.text(784, 1066, "입력 해석하기 · 실행할 때", 19, "t b", inside="parse")
    s.text(784, 1102, PARSE["code"], 17, "t m b", inside="parse")
    s.text(784, 1132, PARSE["lines"][0], 16, "t", inside="parse")
    s.text(784, 1158, "→ " + PARSE["result"], 16, "t m", inside="parse")
    s.text(784, 1194, PARSE["lines"][1], 16, "t", inside="parse")
    s.text(784, 1220, PARSE["error"], 16, "err m", inside="parse")
    s.ref([(676, 1150), (764, 1150)], "rules", "parse")
    s.text(720, 1136, "규칙 참고", 16, "refT", "middle")

    # ── D. 비교 ────────────────────────────────────────────────
    s.comment("D. 헷갈리기 쉬운 세 가지 비교")
    section_head(s, 16, 1324, "D", "헷갈리기 쉬운 세 가지 비교", 22)
    cw = (1248 - 2 * 24) / 3
    for i, (cid, title, rows) in enumerate(COMPARE):
        cx = 16 + i * (cw + 24)
        box = f"cmp-{cid}"
        s.add(f'<g data-card="{cid}">')
        s.rect(cx, 1346, cw, 236, "card", 12, box)
        s.text(cx + 18, 1378, title, 19, "t b", inside=box)
        _rows(s, cx + 18, 1412, rows, 16, 25, box)
        s.add("</g>")
    for i, t in enumerate(FOOT):
        s.text(32, 1622 + 26 * i, t, 16, "s")
    s.save("cli-command-desktop.svg", DESC)


def _rows(s, x, y, rows, size, step, box):
    """비교 카드 본문 한 줄씩."""
    yy = y
    for kind, t in rows:
        cls = {"t": "t", "b": "t b", "m": "t m", "s": "s"}[kind]
        s.text(x, yy, t, size, cls, inside=box)
        yy += step
    return yy


# ══ 휴대전화용 (360) ═════════════════════════════════════════════
def mobile():
    W = 360
    s = Svg(W, 0, TITLE + " · 휴대전화용", "m1")
    s.text(12, 32, "터미널에 입력한 한 줄을", 21, "t b")
    s.text(12, 60, "컴퓨터는 어떻게 알아들을까?", 21, "t b")
    s.text(12, 88, "Scene 01 · Python이 처리하는 부분과", 14, "s")
    s.text(12, 108, "프로그램이 처리하는 부분은 어떻게 다를까?", 14, "s")

    s.comment("범례")
    s.rect(12, 122, 336, 104, "legend", 12)
    s.step(32, 146, "1", 12, 14)
    s.add('<path d="M47 146H82" class="flow" marker-end="url(#m1-arr)"/>')
    s.text(94, 151, "실선·번호 = 실제 처리 순서", 15)
    s.add('<path d="M24 178H82" class="ref"/>')
    s.text(94, 183, "점선 = 규칙 참고 (순서 아님)", 15)
    s.add('<path d="M28 202v10h50v-10" fill="none" stroke="#1b2733" stroke-width="2"/>')
    s.text(94, 213, "괄호·테두리 = 해석하는 주체", 15)

    s.comment("A. 명령 한 줄 분해")
    y = 266
    section_head(s, 12, y, "A", "명령 한 줄을 나눠 읽기", 17)
    y += 16
    s.rect(12, y, 336, 56, "term", 12)
    s.text(26, y + 35, "$", 16, "m", extra=' fill="#9aa5b1"')
    xx = 44
    for tok, _, owner in TOKENS:
        s.text(xx, y + 35, tok, 16, "m w b", extra=f' data-token-inline="{esc(tok)}"')
        xx += tw(tok, 16, True) + 10
    y += 72
    for owner in ("os", "python", "program"):
        toks = [t for t in TOKENS if t[2] == owner]
        h = 48 + 44 * len(toks) + 22 * len(OWNER_DESC_M[owner]) + 6
        box = f"own-{owner}"
        s.owner_rect(12, y, 336, h, owner, box)
        bw_ = s.badge(24, y + 10, owner, 14, box)
        s.text(24 + bw_ + 8, y + 30, OWNERS[owner]["name"], 16, "t b", inside=box)
        yy = y + 46
        for tok, name, _ in toks:
            o = OWNERS[owner]
            w = tw(tok, 16, True) + 24
            s.add(f'<g data-token="{esc(tok)}" data-owner="{owner}">')
            s.add(f'<rect x="24" y="{yy:g}" width="{w:g}" height="34" rx="8" fill="{o["tok"]}" data-box="tok-{esc(tok)}"/>')
            s.text(24 + w / 2, yy + 23, tok, 16, "m w b", "middle", f"tok-{esc(tok)}")
            s.text(130, yy + 23, name, 15, "t b", inside=box)
            s.add("</g>")
            yy += 44
        for ln in OWNER_DESC_M[owner]:
            s.text(24, yy + 16, ln, 14, "t", inside=box)
            yy += 22
        y += h + 10
    s.rect(12, y, 336, 58, "legend", 10, "key")
    s.text(24, y + 24, "-m todo까지가 Python의 몫,", 15, "t b", inside="key")
    s.text(24, y + 46, "그 뒤 낱말은 모두 프로그램에 전달", 15, "t b", inside="key")
    y += 58 + 44

    s.comment("B. 처리 순서 ①~⑤")
    section_head(s, 12, y, "B", "한 줄이 값이 되기까지", 17)
    y += 16
    for i, (n, title, _, code, lines_m, owner) in enumerate(STEPS):
        box = f"step-{n}"
        h = 50 + 22 * len(lines_m) + (22 * len(code) + 20 if code else 0) + 4
        s.add(f'<g data-step="{n}" data-owner="{owner}">')
        s.rect(12, y, 336, h, "card", 12, box)
        s.step(34, y + 26, n, 13, 15)
        s.text(56, y + 32, title, 16, "t b", inside=box)
        lab = STEP_OWNER_LABEL[owner]
        lw = tw(lab, 14) + 22
        s.owner_rect(336 - lw, y + 12, lw, 26, owner, f"{box}-who", rx=13, sw=1.5)
        s.text(336 - lw / 2, y + 30, lab, 14, "t b", "middle", f"{box}-who")
        yy = y + 60
        for ln in lines_m:
            s.text(24, yy, ln, 14, "t", inside=box)
            yy += 22
        if code:
            ch = 22 * len(code) + 10
            s.rect(24, yy - 8, 312, ch, "code", 8, f"{box}-code")
            for k, ln in enumerate(code):
                s.text(34, yy + 12 + 22 * k, ln, 14, "t m", inside=f"{box}-code")
        s.add("</g>")
        y += h
        if i < len(STEPS) - 1:
            s.arrow([(180, y), (180, y + 28)], n, STEPS[i + 1][0])
            y += 30
    y += 46

    s.comment("C. argparse")
    section_head(s, 12, y, "C", "argparse = Argument + Parsing", 17)
    s.text(12, y + 28, "Argument(인자) + Parsing(구조 분석)", 14, "s")
    y += 42
    rh = 44 + sum(22 * len(m) + 30 for *_, m in RULES) + 4
    s.rect(12, y, 336, rh, "card", 12, "rules")
    s.text(24, y + 30, "규칙 정하기 · 코드에 적는 부분", 16, "t b", inside="rules")
    yy = y + 62
    for k, (_, desc, mlines) in enumerate(RULES):
        s.add(f'<g data-rule="{k + 1}">')
        for ln in mlines:
            s.text(24, yy, ln, 14, "t m b", inside="rules")
            yy += 22
        s.text(24, yy, desc, 14, "s", inside="rules")
        yy += 30
        s.add("</g>")
    rules_bottom = y + rh
    y = rules_bottom + 52
    s.ref([(180, rules_bottom), (180, y)], "rules", "parse")
    s.text(192, rules_bottom + 31, "규칙 참고", 14, "refT")
    ph = 182
    s.rect(12, y, 336, ph, "card", 12, "parse")
    s.text(24, y + 30, "입력 해석하기 · 실행할 때", 16, "t b", inside="parse")
    s.text(24, y + 60, PARSE["code"], 14, "t m b", inside="parse")
    s.text(24, y + 86, "sys.argv의 낱말을 규칙과 맞춰 해석", 14, "t", inside="parse")
    s.text(24, y + 108, "→ Namespace(command='list',", 14, "t m", inside="parse")
    s.text(24, y + 128, "            limit=5)", 14, "t m", inside="parse")
    s.text(24, y + 154, "규칙에 맞지 않으면 사용법 안내 후 종료", 14, "t", inside="parse")
    s.text(24, y + 174, "--limit five → error (종료 코드 2)", 14, "err m", inside="parse")
    y += ph + 46

    s.comment("D. 비교")
    section_head(s, 12, y, "D", "헷갈리기 쉬운 세 가지 비교", 17)
    y += 16
    for cid, title, rows in COMPARE:
        box = f"cmp-{cid}"
        h = 44 + 22 * len(rows) + 8
        s.add(f'<g data-card="{cid}">')
        s.rect(12, y, 336, h, "card", 12, box)
        s.text(24, y + 30, title, 16, "t b", inside=box)
        _rows(s, 24, y + 58, rows, 14, 22, box)
        s.add("</g>")
        y += h + 10
    y += 16
    for i, t in enumerate(FOOT_M):
        s.text(12, y + 22 * i, t, 14, "s")
    s.h = int(y + 22 * len(FOOT_M) + 4)
    s.save("cli-command-mobile.svg", DESC)


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
