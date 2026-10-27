"""B1-1 미션 스토리(문서·표현·기능, 세 가지 축으로 이해하는 웹페이지) SVG 생성기.

그림 7종을 PC(desktop, 폭 1200)·모바일(mobile, 폭 360)용으로 만든다. 결과는 ../assets/ 에 쓴다.
F2(같은 페이지의 세 상태)는 그림이 아니라 실제 캡처다 → _tools/sample.cjs.
  f1-three-roles   세 가지 역할 구조도 (인트로)
  f3-html          꾸밈없는 문서의 태그 이름표 / 의미 있는 구역. 상태 tags / structure (S1-2·S1-3)
  f4-css-rule      CSS 규칙 한 줄 읽기 (S2-2)
  f5-event         클릭 → JS 처리 → DOM 변경 → 다시 그림 (S3-2)
  f5-dom           파일은 그대로, DOM이 바뀐다 — 실제 캡처 옆에 놓는 세로형 (S3-3)
  f6-browser       브라우저 통합 구조도 (S4-1)
  f7-edit-map      고친 파일 ↔ 바뀌는 화면 (S4-2)
  f8-publish       로컬에서 공개 URL, 결합은 방문자 브라우저 (S4-3)

상태 전환: 루트 <svg data-state="..."> 값만 바꾼다. 클래스 b11s-in-<상태>가 붙은 요소는 그 상태에서만 보인다.
<img>로 쓰면 첫 상태만 보이므로 렌더러는 SVG를 인라인으로 넣는다(B6-1과 같은 방식).
색은 --presentation-* 토큰을 쓰고, 토큰이 없으면 Dark 기본값으로 보인다. 인라인이면 Light도 자동 적용된다.
역할 구분은 색 + 모양 + 글자: HTML = 네모 H(real 토큰), CSS = 동그라미 C(python 토큰), JavaScript = 마름모 J(app 토큰).
선: 실선 = 만든다·바꾼다·그린다·순서(번호), 점선 = 불러옴·참고, 가는 선 = 대응(이름표).
그림 속 "웹페이지 모습"(태그 이름표·고친 파일 그림)은 실제 브라우저 화면을 나타내므로 테마와 관계없이 밝은 색으로 그린다.
그 안의 글자는 장식(-deco)으로 표시하고, 뜻은 바깥 이름표가 전한다.
샘플 내용(문구·태그·규칙·이름표)은 ../sample/ 파일과 같다.
실행: python3 -I build_figures.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets")
FONT = "'Pretendard Variable','Pretendard','Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif"
MONO = "'SF Mono','Menlo','Consolas','D2Coding',monospace"
P = "b11s"

T = {
    "bg": "var(--presentation-bg,#111827)", "panel": "var(--presentation-panel,#1d2736)",
    "ink": "var(--presentation-ink,#eef2f7)", "muted": "var(--presentation-muted,#bdc8d7)",
    "line": "var(--presentation-line,#64748b)", "chip": "var(--presentation-chip,#293549)",
    "acc": "var(--presentation-accent,#ffad86)", "acc_soft": "var(--presentation-accent-soft,#4b2c26)",
    "h": "var(--presentation-real,#edcf8e)", "h_soft": "var(--presentation-real-soft,#403622)",
    "c": "var(--presentation-python,#9cc8ff)", "c_soft": "var(--presentation-python-soft,#203957)",
    "j": "var(--presentation-app,#86dfb0)", "j_soft": "var(--presentation-app-soft,#183f32)",
    "on": "var(--presentation-on-strong,#111827)",
}


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def css(states):
    t = T
    rules = [
        f".{P}-bg{{fill:{t['bg']}}}",
        f".{P}-box{{fill:{t['panel']};stroke:{t['line']};stroke-width:2}}",
        f".{P}-box-h{{fill:{t['h_soft']};stroke:{t['h']};stroke-width:2.5}}",
        f".{P}-box-c{{fill:{t['c_soft']};stroke:{t['c']};stroke-width:2.5}}",
        f".{P}-box-j{{fill:{t['j_soft']};stroke:{t['j']};stroke-width:2.5}}",
        f".{P}-box-acc{{fill:{t['acc_soft']};stroke:{t['acc']};stroke-width:3}}",
        f".{P}-box-br{{fill:{t['chip']};stroke:{t['line']};stroke-width:2}}",
        f".{P}-tag{{fill:{t['panel']};stroke:{t['acc']};stroke-width:2}}",
        f".{P}-ink{{fill:{t['ink']}}}", f".{P}-muted{{fill:{t['muted']}}}", f".{P}-b{{font-weight:700}}",
        f".{P}-mono{{font-family:{MONO}}}",
        f".{P}-th{{fill:{t['h']};font-weight:700}}", f".{P}-tc{{fill:{t['c']};font-weight:700}}",
        f".{P}-tj{{fill:{t['j']};font-weight:700}}", f".{P}-acc{{fill:{t['acc']};font-weight:700}}",
        f".{P}-sh{{fill:{t['h']}}}", f".{P}-sc{{fill:{t['c']}}}", f".{P}-sj{{fill:{t['j']}}}", f".{P}-sacc{{fill:{t['acc']}}}",
        f".{P}-on{{fill:{t['on']};font-weight:700}}",
        f".{P}-ln{{stroke:{t['ink']};stroke-width:2.5;fill:none}}",
        f".{P}-ln-acc{{stroke:{t['acc']};stroke-width:3;fill:none}}",
        f".{P}-dash{{stroke:{t['muted']};stroke-width:2.5;stroke-dasharray:9 7;fill:none}}",
        f".{P}-dot{{stroke:{t['muted']};stroke-width:3;stroke-dasharray:1 8;stroke-linecap:round;fill:none}}",
        f".{P}-lead{{stroke:{t['muted']};stroke-width:1.8;fill:none}}",
        f".{P}-mk{{fill:{t['ink']}}}", f".{P}-mk-acc{{fill:{t['acc']}}}", f".{P}-mk-m{{fill:{t['muted']}}}",
        f".{P}-region{{fill:none;stroke:{t['acc']};stroke-width:3;stroke-dasharray:10 6}}",
        # 그림 속 웹페이지(실제 브라우저 화면을 나타냄) — 테마와 관계없이 고정 색
        f".{P}-pg{{fill:#ffffff;stroke:#94a3b8;stroke-width:2}}", f".{P}-pg-bar{{fill:#e2e8f0}}",
        f".{P}-pg-ink{{fill:#111111}}", f".{P}-pg-muted{{fill:#52606d}}", f".{P}-pg-link{{fill:#0000ee}}", f".{P}-pg-u{{stroke:#0000ee;stroke-width:1.5}}",
        f".{P}-pg-gray{{fill:#c7cbd1}}", f".{P}-pg-btn{{fill:#efefef;stroke:#767676;stroke-width:1.5}}",
        f".{P}-pg-brand{{fill:#0b6e4f}}", f".{P}-pg-white{{fill:#ffffff}}", f".{P}-pg-soft{{fill:#e6f2ec}}",
        f".{P}-pg-dark{{fill:#1f2933}}", f".{P}-pg-skin{{fill:#f4d2b3}}", f".{P}-pg-hair{{fill:#3a2e26}}",
    ]
    for s in states:
        rules.append(f'svg[data-state="{s}"] [class*="{P}-in-"]:not(.{P}-in-{s}){{display:none}}')
    return "".join(rules)


# 그림이 화면에 보이는 최소 폭(px). 글자는 이 폭에서도 14px 이상이 되도록 크기 하한을 둔다(preview.cjs와 같은 값).
SHOWN = {1200: 900, 600: 480, 360: 328}


class Svg:
    def __init__(self, w, h, states=("main",), label="", title=""):
        self.w, self.h, self.states, self.label, self.title = w, h, states, label, title
        self.minfont = -(-14 * w // SHOWN[w])  # 올림: 1200 → 19, 600 → 18, 360 → 16
        self.parts = []

    def add(self, s):
        self.parts.append(s)

    def text(self, x, y, s, size=20, cls="ink", anchor="start", extra=""):
        # 그림 속 웹페이지 글자(장식)는 축소 그림이므로 하한을 두지 않는다. 뜻은 바깥 이름표가 전한다.
        if "deco" not in cls and not getattr(self, "in_deco", False):
            size = max(size, self.minfont)
        c = " ".join(f"{P}-{k}" for k in cls.split())
        a = f' text-anchor="{anchor}"' if anchor != "start" else ""
        self.add(f'<text x="{x}" y="{y}" font-size="{size}" class="{c}"{a}{extra}>{esc(s)}</text>')

    def lines(self, x, y, items, size=20, lh=None, cls="ink", anchor="start"):
        lh = lh or round(size * 1.4)
        for i, s in enumerate(items):
            self.text(x, y + i * lh, s, size, cls, anchor)

    def rect(self, x, y, w, h, cls="box", rx=12, extra=""):
        c = " ".join(f"{P}-{k}" for k in cls.split())
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{c}"{extra}/>')

    def path(self, d, cls="ln", marker=None, extra=""):
        c = " ".join(f"{P}-{k}" for k in cls.split())
        m = f' marker-end="url(#{P}-{marker})"' if marker else ""
        self.add(f'<path d="{d}" class="{c}"{m}{extra}/>')

    def both(self, d, cls="ln-acc", marker="a-acc"):
        c = " ".join(f"{P}-{k}" for k in cls.split())
        self.add(f'<path d="{d}" class="{c}" marker-start="url(#{P}-{marker}s)" marker-end="url(#{P}-{marker})"/>')

    def group(self, cls):
        c = " ".join(f"{P}-{k}" for k in cls.split())
        self.in_deco = "deco" in cls.split()
        self.add(f'<g class="{c}">')

    def end(self):
        self.in_deco = False
        self.add("</g>")

    def badge(self, kind, cx, cy, r=20):
        """역할 표시: H 네모 · C 동그라미 · J 마름모 + 글자."""
        if kind == "h":
            self.add(f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" rx="4" class="{P}-sh"/>')
        elif kind == "c":
            self.add(f'<circle cx="{cx}" cy="{cy}" r="{r + 1}" class="{P}-sc"/>')
        else:
            k = r + 5
            self.add(f'<path d="M{cx} {cy - k}L{cx + k} {cy}L{cx} {cy + k}L{cx - k} {cy}Z" class="{P}-sj"/>')
        self.text(cx, cy + round(r * 0.42), kind.upper(), round(r * 1.15), "on", "middle")

    def num(self, n, cx, cy, r=17):
        self.add(f'<circle cx="{cx}" cy="{cy}" r="{r}" class="{P}-sacc"/>')
        self.text(cx, cy + round(r * 0.4), str(n), round(r * 1.1), "on", "middle")

    def render(self):
        markers = "".join(
            f'<marker id="{P}-{name}" viewBox="0 0 12 12" refX="{rx}" refY="6" markerWidth="12" markerHeight="12" '
            f'markerUnits="userSpaceOnUse" orient="auto"><path d="{d}" class="{P}-{cls}"/></marker>'
            for name, cls, d, rx in [
                ("a", "mk", "M0 0L12 6L0 12Z", 11), ("a-acc", "mk-acc", "M0 0L12 6L0 12Z", 11),
                ("a-m", "mk-m", "M0 0L12 6L0 12Z", 11), ("a-accs", "mk-acc", "M12 0L0 6L12 12Z", 1),
            ])
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'data-state="{self.states[0]}" data-states="{" ".join(self.states)}" font-family="{FONT}" role="img" '
                f'aria-label="{esc(self.label)}"><title>{esc(self.title)}</title><style>{css(self.states)}</style>'
                f'<defs>{markers}</defs><rect width="{self.w}" height="{self.h}" class="{P}-bg"/>')
        return head + "".join(self.parts) + "</svg>\n"


def save(name, svg):
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(svg.render())


ROLES = [
    ("h", "문서·의미", "HTML", "th", "box-h"),
    ("c", "표현·규칙", "CSS", "tc", "box-c"),
    ("j", "기능·동작", "JavaScript", "tj", "box-j"),
]

# ---------------------------------------------------------------- F1 세 가지 역할
F1_LABEL = ("웹페이지 한 장을 세 가지 역할로 나눈 구조도. HTML(네모 H)은 문서·의미로 무엇이 있고 그것이 무엇인지 적는다. "
            "CSS(동그라미 C)는 표현·규칙으로 어떻게 보일지를 조건에 따라 정한다. JavaScript(마름모 J)는 기능·동작으로 "
            "행동에 어떻게 반응할지 판단하고 실행한다. 세 역할 아래에 브라우저가 있고, 브라우저가 세 파일을 읽고 합쳐 하나의 화면으로 보여 준다.")
F1_TEXT = {
    "h": (["무엇이 있고,", "그것이 무엇인지"], ["제목 · 문단 · 그림", "목록 · 링크 · 버튼"]),
    "c": (["어떻게 보일지", "(조건에 따라 다르게)"], ["색 · 글꼴 · 여백", "배치 · 화면 폭 조건"]),
    "j": (["행동에 어떻게", "반응할지 (판단·실행)"], ["☰를 누르면", "메뉴를 열고 닫기"]),
}


def f1(mobile):
    if not mobile:
        s = Svg(1200, 560, label=F1_LABEL, title="웹페이지를 이루는 세 가지 역할")
        s.rect(440, 20, 320, 84, "box")
        s.text(600, 56, "웹페이지 한 장", 28, "ink b", "middle")
        s.text(600, 88, "김코디의 자기소개 (교육용 예시)", 18, "muted", "middle")
        s.path("M600 104V126M200 126H1000M200 126V150M600 126V150M1000 126V150", "ln")
        s.text(780, 70, "역할을 나눠 맡는다", 19, "muted")
        for i, (k, kick, name, tcls, bcls) in enumerate(ROLES):
            x = 40 + i * 400
            s.rect(x, 150, 320, 270, bcls)
            s.badge(k, x + 46, 196, 22)
            s.text(x + 86, 188, kick, 19, "muted")
            s.text(x + 86, 220, name, 30, tcls)
            q, ex = F1_TEXT[k]
            s.lines(x + 26, 280, q, 22, 32, "ink b")
            s.lines(x + 26, 366, ex, 19, 28, "muted")
            s.path(f"M{x + 160} 420V452", "ln", "a")
        s.rect(40, 462, 1120, 74, "box-br")
        s.text(600, 494, "브라우저 — 실행 환경", 24, "ink b", "middle")
        s.text(600, 524, "세 파일을 읽고 합쳐 하나의 화면으로 보여 준다", 19, "muted", "middle")
    else:
        s = Svg(360, 828, label=F1_LABEL, title="웹페이지를 이루는 세 가지 역할")
        s.rect(16, 16, 328, 76, "box")
        s.text(180, 50, "웹페이지 한 장", 24, "ink b", "middle")
        s.text(180, 78, "김코디의 자기소개 (교육용 예시)", 16, "muted", "middle")
        for i, (k, kick, name, tcls, bcls) in enumerate(ROLES):
            y = 116 + i * 196
            s.path(f"M180 {y - 24}V{y}", "ln")
            s.rect(16, y, 328, 172, bcls)
            s.badge(k, 46, y + 38, 18)
            s.text(80, y + 32, kick, 16, "muted")
            s.text(80, y + 58, name, 24, tcls)
            q, ex = F1_TEXT[k]
            s.text(32, y + 102, " ".join(q), 18, "ink b")
            s.text(32, y + 140, " ".join(ex), 16, "muted")
        s.path("M180 704V726", "ln", "a")
        s.rect(16, 730, 328, 82, "box-br")
        s.text(180, 762, "브라우저 — 실행 환경", 19, "ink b", "middle")
        s.text(180, 792, "세 파일을 읽고 합쳐 한 화면으로", 16, "muted", "middle")
    return s


# ---------------------------------------------------------------- F3 꾸밈없는 문서와 태그·구역
F3_LABEL = ("상태 ①(작성자 CSS 없음) 김코디 자기소개 페이지를 다시 그린 그림. 태그 이름표 상태: 이름 링크는 a(누르면 이동), "
            "메뉴 버튼은 button, 메뉴 묶음은 nav와 ul·li, 프로필 그림은 img와 그림의 뜻 alt, 가장 큰 제목은 h1, 소개 글은 p, "
            "프로젝트 목록은 ul·li. 구역 상태: header(머리말: 이름·메뉴), main(본문) 안의 section 세 개(소개·프로젝트·연락), "
            "footer(바닥글). 이 구조는 사람·브라우저·화면 낭독기·검색 도구가 읽는다.")

# (태그, 뜻, 그림 속 대상 점) — 대상 점은 page() 좌표계(폭 560 기준)
F3_TAGS = [
    ("<a>", "링크 · 누르면 이동", (66, 58)),
    ("<button>", "버튼 · 누르는 단추", (176, 58)),
    ("<nav> <ul> <li>", "메뉴 묶음 · 목록", (128, 124)),
    ("<img alt>", "그림 + 그림의 뜻", (104, 214)),
    ("<h1>", "가장 큰 제목 (뜻, 크기 아님)", (412, 290)),
    ("<p>", "문단", (322, 337)),
    ("<ul> <li>", "목록 · 프로젝트 셋", (250, 432)),
]
F3_REGIONS = [  # (이름, 설명, y0, y1) — page() 좌표계
    ("<header>", "머리말 · 이름·메뉴", 30, 162),
    ("<section> 소개", "main 안 · 자기소개", 168, 340),
    ("<section> 프로젝트", "main 안 · 목록", 346, 478),
    ("<section> 연락", "main 안 · 메일 링크", 484, 534),
    ("<footer>", "바닥글", 540, 576),
]


def page(s, x0, y0, k=1.0):
    """상태 ① 화면(브라우저 기본 스타일)을 단순하게 다시 그린다. 폭 560 기준, k배."""
    X = lambda v: round(x0 + v * k, 1)
    Y = lambda v: round(y0 + v * k, 1)
    S = lambda v: round(v * k, 1)
    s.rect(X(0), Y(0), S(560), S(590), "pg", 8)
    s.group("deco")
    s.add(f'<rect x="{X(0)}" y="{Y(0)}" width="{S(560)}" height="{S(22)}" rx="{S(6)}" class="{P}-pg-bar"/>')
    for i in range(3):
        s.add(f'<circle cx="{X(14 + i * 14)}" cy="{Y(11)}" r="{S(4)}" class="{P}-pg-gray"/>')
    s.text(X(70), Y(16), "state-1-html.html", S(13), "mono pg-ink")
    s.text(X(20), Y(62), "김코디", S(20), "pg-link")
    s.add(f'<path d="M{X(20)} {Y(66)}H{X(80)}" class="{P}-pg-u"/>')
    s.add(f'<rect x="{X(90)}" y="{Y(42)}" width="{S(84)}" height="{S(28)}" rx="{S(4)}" class="{P}-pg-btn"/>')
    s.text(X(132), Y(62), "☰ 메뉴", S(16), "pg-ink", "middle")
    for i, w in enumerate(["소개", "프로젝트", "연락"]):
        y = 96 + i * 26
        s.add(f'<circle cx="{X(36)}" cy="{Y(y - 6)}" r="{S(3)}" class="{P}-pg-ink"/>')
        s.text(X(48), Y(y), w, S(18), "pg-link")
    s.add(f'<rect x="{X(20)}" y="{Y(176)}" width="{S(84)}" height="{S(84)}" class="{P}-pg-soft"/>')
    s.add(f'<circle cx="{X(62)}" cy="{Y(212)}" r="{S(22)}" class="{P}-pg-skin"/>')
    s.add(f'<path d="M{X(30)} {Y(260)}C{X(34)} {Y(238)} {X(46)} {Y(232)} {X(62)} {Y(232)}C{X(78)} {Y(232)} {X(90)} {Y(238)} {X(94)} {Y(260)}Z" class="{P}-pg-brand"/>')
    s.text(X(20), Y(300), "안녕하세요, 김코디입니다", S(30), "pg-ink b")
    s.add(f'<rect x="{X(20)}" y="{Y(316)}" width="{S(500)}" height="{S(9)}" rx="{S(4)}" class="{P}-pg-gray"/>')
    s.add(f'<rect x="{X(20)}" y="{Y(332)}" width="{S(300)}" height="{S(9)}" rx="{S(4)}" class="{P}-pg-gray"/>')
    s.text(X(20), Y(378), "프로젝트", S(24), "pg-ink b")
    for i, w in enumerate(["자기소개 문서", "화면에 맞는 꾸미기", "메뉴 버튼"]):
        y = 412 + i * 30
        s.add(f'<circle cx="{X(36)}" cy="{Y(y - 6)}" r="{S(3)}" class="{P}-pg-ink"/>')
        s.text(X(48), Y(y), w, S(19), "pg-ink b")
    s.text(X(20), Y(512), "연락", S(24), "pg-ink b")
    s.add(f'<rect x="{X(20)}" y="{Y(522)}" width="{S(200)}" height="{S(9)}" rx="{S(4)}" class="{P}-pg-gray"/>')
    s.add(f'<rect x="{X(230)}" y="{Y(522)}" width="{S(130)}" height="{S(9)}" rx="{S(4)}" class="{P}-pg-link"/>')
    s.add(f'<rect x="{X(20)}" y="{Y(552)}" width="{S(380)}" height="{S(9)}" rx="{S(4)}" class="{P}-pg-gray"/>')
    s.add(f'<rect x="{X(420)}" y="{Y(552)}" width="{S(60)}" height="{S(9)}" rx="{S(4)}" class="{P}-pg-link"/>')
    s.end()
    return X, Y, S


def f3(mobile):
    states = ("tags", "structure")
    title = "꾸밈없는 문서의 태그 이름표와 의미 있는 구역"
    if not mobile:
        s = Svg(1200, 630, states, F3_LABEL, title)
        X, Y, S = page(s, 30, 20)
        # tags: 오른쪽 이름표 7개 + 가는 대응선
        s.group("in-tags")
        for i, (tag, mean, (tx, ty)) in enumerate(F3_TAGS):
            cy = 52 + i * 78
            s.path(f"M{X(tx)} {Y(ty)}L{676} {cy}", "lead")
            s.add(f'<circle cx="{X(tx)}" cy="{Y(ty)}" r="5" class="{P}-sacc"/>')
            s.rect(676, cy - 28, 494, 56, "tag", 10)
            s.text(694, cy + 8, tag, 21, "mono acc")
            s.text(1150, cy + 8, mean, 20, "ink", "end")
        s.end()
        # structure: 구역 점선 상자 + 이름표, 아래에 "이 구조를 읽는 쪽"
        s.group("in-structure")
        for i, (tag, mean, y0, y1) in enumerate(F3_REGIONS):
            s.rect(X(8), Y(y0), S(544), S(y1 - y0), "region", 6)
            cy = 46 + i * 64
            s.path(f"M{X(552)} {Y((y0 + y1) / 2)}L{676} {cy}", "lead")
            s.rect(676, cy - 26, 494, 52, "tag", 10)
            s.text(694, cy + 8, tag, 20, "mono acc")
            s.text(1150, cy + 8, mean, 19, "ink", "end")
        s.text(676, 388, "main = 본문 전체 (소개·프로젝트·연락을 담는 부모)", 19, "muted")
        s.text(676, 446, "이 구조를 누가 읽을까?", 22, "ink b")
        for i, (who, why) in enumerate([("사람", "개발자·동료"), ("브라우저", "문서 구조"), ("화면 낭독기", "구역 이동"), ("검색 도구", "내용 파악")]):
            x, y = 676 + (i % 2) * 252, 466 + (i // 2) * 76
            s.rect(x, y, 242, 64, "box", 10)
            s.text(x + 16, y + 28, who, 20, "ink b")
            s.text(x + 16, y + 52, why, 18, "muted")
        s.end()
    else:
        s = Svg(360, 990, states, F3_LABEL, title)
        X, Y, S = page(s, 16, 16, 328 / 560)
        s.group("in-tags")
        for i, (tag, mean, (tx, ty)) in enumerate(F3_TAGS):
            s.add(f'<circle cx="{X(tx)}" cy="{Y(ty)}" r="11" class="{P}-sacc"/>')
            s.text(X(tx), Y(ty) + 5, str(i + 1), 14, "on deco", "middle")
            y = 392 + i * 70
            s.rect(16, y, 328, 60, "tag", 10)
            s.num(i + 1, 40, y + 30, 14)
            s.text(64, y + 26, tag, 17, "mono acc")
            s.text(64, y + 50, mean, 16, "ink")
        s.end()
        s.group("in-structure")
        for i, (tag, mean, y0, y1) in enumerate(F3_REGIONS):
            s.rect(X(8), Y(y0), S(544), S(y1 - y0), "region", 6)
            s.add(f'<circle cx="{X(530)}" cy="{Y(y0) + 14}" r="11" class="{P}-sacc"/>')
            s.text(X(530), Y(y0) + 19, "ABCDE"[i], 14, "on deco", "middle")
            y = 392 + i * 66
            s.rect(16, y, 328, 56, "tag", 10)
            s.num("ABCDE"[i], 40, y + 28, 14)
            s.text(64, y + 24, tag, 16, "mono acc")
            s.text(64, y + 46, mean, 16, "ink")
        s.text(16, 744, "main = 소개·프로젝트·연락을 담는 부모", 16, "muted")
        s.text(16, 790, "이 구조를 누가 읽을까?", 19, "ink b")
        for i, (who, why) in enumerate([("사람", "개발자·동료"), ("브라우저", "문서 구조"), ("화면 낭독기", "구역 이동"), ("검색 도구", "내용 파악")]):
            x, y = 16 + (i % 2) * 168, 808 + (i // 2) * 76
            s.rect(x, y, 160, 64, "box", 10)
            s.text(x + 14, y + 28, who, 17, "ink b")
            s.text(x + 14, y + 52, why, 16, "muted")
    return s


# ---------------------------------------------------------------- F4 CSS 규칙 한 줄
F4_LABEL = ("css/style.css의 실제 규칙 중 한 줄 h1 { font-size: 1.75rem; }을 세 부분으로 나눈 그림. h1은 선택자로 누구를 고를지, "
            "font-size는 속성으로 무엇을 정할지, 1.75rem은 값으로 어떻게 할지를 적는다. 선택자는 DOM의 h1 요소를 고르기만 하고, "
            "브라우저가 규칙을 계산해 제목의 글자 크기로 화면에 반영한다. CSS는 DOM의 내용과 구조를 바꾸지 않는다.")
F4_PARTS = [("h1", 0, "선택자", "누구를"), ("font-size", 5, "속성", "무엇을"), ("1.75rem", 16, "값", "어떻게")]
F4_CODE = "h1 { font-size: 1.75rem; }"


def f4(mobile):
    title = "CSS 규칙 한 줄 읽기"
    if not mobile:
        s = Svg(1200, 470, label=F4_LABEL, title=title)
        s.rect(30, 20, 720, 250, "box-c")
        s.badge("c", 66, 58, 18)
        s.text(98, 66, "css/style.css의 실제 규칙 (한 줄만)", 20, "muted")
        cw, x0 = 0.6 * 40, 66
        s.text(x0, 150, F4_CODE, 40, "mono ink", extra=f' textLength="{len(F4_CODE) * cw:.0f}" lengthAdjust="spacingAndGlyphs"')
        for word, i, name, mean in F4_PARTS:
            a = x0 + i * cw
            b = a + len(word) * cw
            s.path(f"M{a:.0f} 168V178H{b:.0f}V168", "ln-acc")
            s.text((a + b) / 2, 212, name, 22, "acc", "middle")
            s.text((a + b) / 2, 244, mean, 20, "ink", "middle")
        # 오른쪽: 고른 요소가 화면에 어떻게 보이나 (실제 웹페이지 화면 → 고정 색)
        s.rect(820, 20, 350, 250, "pg", 10)
        s.group("deco")
        s.text(846, 60, "화면 속 h1 요소", 16, "pg-ink")
        s.text(846, 132, "안녕하세요,", 34, "pg-ink b")
        s.text(846, 178, "김코디입니다", 34, "pg-ink b")
        s.end()
        s.path("M750 140H812", "ln-acc", "a-acc")
        s.text(995, 240, "글자 크기 1.75rem", 18, "pg-muted", "middle")
        for i, (head, body) in enumerate([
            ("선택자는 고르기만", ["DOM의 h1 요소를 고른다.", "DOM은 바꾸지 않는다."]),
            ("원하는 모습을 적는다", ["그리는 순서는 적지 않는다.", "모습만 값으로 적는다."]),
            ("브라우저가 계산해 그린다", ["요소마다 값을 계산해", "화면에 반영한다."]),
        ]):
            x = 30 + i * 384
            s.rect(x, 300, 372, 150, "box")
            s.num(i + 1, x + 32, 336, 16)
            s.text(x + 60, 343, head, 21, "ink b")
            s.lines(x + 24, 390, body, 19, 30, "muted")
    else:
        s = Svg(360, 900, label=F4_LABEL, title=title)
        s.rect(16, 16, 328, 206, "box-c")
        s.badge("c", 44, 48, 15)
        s.text(70, 54, "실제 규칙 한 줄", 16, "muted")
        cw, x0 = 0.6 * 18, 32
        s.text(x0, 112, F4_CODE, 18, "mono ink", extra=f' textLength="{len(F4_CODE) * cw:.0f}" lengthAdjust="spacingAndGlyphs"')
        for word, i, name, mean in F4_PARTS:
            a = x0 + i * cw
            b = a + len(word) * cw
            s.path(f"M{a:.0f} 122V130H{b:.0f}V122", "ln-acc")
        s.text(28, 164, "h1 = 선택자 · 누구를", 16, "ink")
        s.text(28, 188, "font-size = 속성 · 무엇을", 16, "ink")
        s.text(28, 212, "1.75rem = 값 · 어떻게", 16, "ink")
        s.path("M180 222V250", "ln-acc", "a-acc")
        s.rect(16, 256, 328, 150, "pg", 10)
        s.group("deco")
        s.text(36, 288, "화면 속 h1 요소", 14, "pg-ink")
        s.text(36, 340, "안녕하세요,", 28, "pg-ink b")
        s.text(36, 380, "김코디입니다", 28, "pg-ink b")
        s.end()
        for i, (head, body) in enumerate([
            ("선택자는 고르기만", "DOM의 h1을 고른다. DOM은 그대로."),
            ("원하는 모습을 적는다", "순서가 아니라 모습을 값으로."),
            ("브라우저가 계산해 그린다", "요소마다 계산해 화면에 반영."),
        ]):
            y = 430 + i * 152
            s.rect(16, y, 328, 136, "box")
            s.num(i + 1, 44, y + 34, 15)
            s.text(70, y + 41, head, 18, "ink b")
            words = body.split(". ")
            s.lines(32, y + 84, [w if w.endswith(".") else w + "." for w in words], 16, 28, "muted")
    return s


# ---------------------------------------------------------------- F5 클릭 → 화면 변화 / 파일과 DOM
F5_LABEL = ("1 사용자가 ☰ 버튼을 누르면 click 이벤트가 생긴다. 2 미리 등록해 둔 JavaScript 함수(이벤트 핸들러)가 "
            "메뉴가 닫혀 있으면 열고, 열려 있으면 닫기로 판단한다. 3 DOM이 바뀐다: nav에 is-open이 붙고 버튼의 aria-expanded가 true가 된다. "
            "4 브라우저가 바뀐 DOM에 맞는 CSS 규칙으로 다시 그려 메뉴가 보인다. HTML 파일은 그대로다. 다시 누르면 같은 과정으로 닫힌다. "
            "교육용 단순화이며 자세한 6단계는 학습가이드 Ch4의 V04.")
F5_STEPS = [
    ("box", None, "사용자", ["☰ 버튼을", "누른다"], ["click 이벤트"]),
    ("box-j", "j", "JavaScript 처리", ["닫혀 있으면 → 연다", "열려 있으면 → 닫는다"], ["미리 등록한 함수", "(이벤트 핸들러)"]),
    ("box", None, "DOM이 바뀐다", ["nav에 is-open", "aria-expanded=true"], ["HTML 파일은 그대로"]),
    ("box-br", None, "브라우저가 다시 그림", ["바뀐 DOM에 맞는", "CSS 규칙으로 그림"], ["→ 메뉴가 보인다"]),
]
F5_DOM = [
    ("box-h", "h", "index.html 파일", ['<nav class="site-nav">', '<button aria-expanded="false">'], "그대로"),
    ("box", None, "DOM · 처음", ['nav.site-nav', 'button  aria-expanded="false"'], "파일을 해석해 만듦"),
    ("box-acc", None, "DOM · ☰ 클릭 뒤", ['nav.site-nav.is-open', 'button  aria-expanded="true"'], "바뀜"),
]
F5_DOM_LABEL = ("index.html 파일에는 nav class가 site-nav, 버튼 aria-expanded가 false로 적혀 있고 클릭해도 그대로다. 브라우저가 해석해 만든 "
                "DOM도 처음에는 같다. ☰ 클릭 뒤 JavaScript가 바꾼 DOM에서는 nav에 is-open이 붙고 aria-expanded가 true가 된다. "
                "새로고침하면 파일에서 DOM을 다시 만들어 메뉴는 닫힌 채 시작한다. 개발자 도구 Elements 탭에 보이는 것은 지금의 DOM이다.")

def f5_event(mobile):
    title = "버튼 클릭에서 화면 변화까지"
    if not mobile:
        s = Svg(1200, 430, label=F5_LABEL, title=title)
        for i, (bcls, role, head, body, note) in enumerate(F5_STEPS):
            x = 30 + i * 292
            s.rect(x, 30, 260, 270, bcls)
            s.num(i + 1, x + 30, 64, 17)
            if role:
                s.badge(role, x + 222, 262, 16)
            s.text(x + 58, 71, head, 21, "ink b")
            s.lines(x + 22, 136, body, 20, 32, "ink")
            s.lines(x + 22, 232, note, 18, 28, "muted")
            if i < 3:
                s.path(f"M{x + 262} 165H{x + 288}", "ln", "a")
        s.path("M1034 300V330H160V306", "dash", "a-m")
        s.text(597, 354, "다시 누르면 같은 과정으로 닫힌다", 18, "muted", "middle")
        s.text(30, 408, "입력(클릭) → 처리(판단) → 결과(화면 변화) · 교육용 단순화 — 자세한 6단계는 학습가이드 Ch4의 V04", 18, "muted")
    else:
        s = Svg(360, 980, label=F5_LABEL, title=title)
        for i, (bcls, role, head, body, note) in enumerate(F5_STEPS):
            y = 16 + i * 214
            s.rect(16, y, 328, 180, bcls)
            s.num(i + 1, 44, y + 32, 15)
            if role:
                s.badge(role, 312, y + 32, 13)
            s.text(70, y + 39, head, 19, "ink b")
            s.lines(32, y + 86, body, 17, 28, "ink")
            s.text(32, y + 160, " ".join(note), 16, "muted")
            if i < 3:
                s.path(f"M180 {y + 182}V{y + 210}", "ln", "a")
        s.text(16, 892, "다시 누르면 같은 과정으로 닫힌다", 16, "muted")
        s.text(16, 924, "입력 → 처리(판단) → 결과(화면)", 16, "muted")
        s.text(16, 956, "교육용 단순화 · 6단계는 가이드 Ch4", 16, "muted")
    return s


def f5_dom(mobile):
    title = "파일은 그대로, DOM이 바뀐다"
    w = 600 if not mobile else 360
    pad, head, code = (20, 21, 18) if not mobile else (16, 18, 16)
    bw = w - 2 * pad
    s = Svg(w, 570 if not mobile else 640, label=F5_DOM_LABEL, title=title)
    step = 170 if not mobile else 186
    bh = 120 if not mobile else 130
    for i, (bcls, role, name, lines, note) in enumerate(F5_DOM):
        y = 16 + i * step
        s.rect(pad, y, bw, bh, bcls)
        tx = pad + 20
        if role:
            s.badge(role, pad + 28, y + 30, 13)
            tx = pad + 52
        s.text(tx, y + 37, name, head, "ink b")
        s.text(pad + bw - 16, y + 37, note, code, "muted", "end")
        for j, ln in enumerate(lines):
            hi = i == 2 and ("is-open" in ln or "true" in ln)
            if hi:
                s.rect(pad + 10, y + 52 + j * 32, bw - 20, 30, "tag", 6)
            s.text(pad + 20, y + 74 + j * 32, ln, code, "mono acc" if hi else "mono ink")
        if i < 2:
            ay = y + bh
            s.path(f"M{w // 2 - 60} {ay + 2}V{y + step - 4}", "dash" if i == 0 else "ln-acc", "a-m" if i == 0 else "a-acc")
            s.text(w // 2 - 44, ay + (step - bh) // 2 + 6, "브라우저가 해석" if i == 0 else "☰ 클릭 → JavaScript가 바꿈", code, "muted" if i == 0 else "acc")
    if not mobile:
        s.text(pad, 516, "새로고침하면 파일에서 DOM을 다시 만든다 → 메뉴는 닫힌 채 시작", 18, "ink")
        s.text(pad, 548, "개발자 도구 Elements 탭에 보이는 것은 지금의 DOM", 18, "muted")
    else:
        s.text(pad, 568, "새로고침하면 파일에서 DOM을 다시", 16, "ink")
        s.text(pad, 594, "만든다 → 메뉴는 닫힌 채 시작", 16, "ink")
        s.text(pad, 626, "Elements 탭 = 지금의 DOM", 16, "muted")
    return s


# ---------------------------------------------------------------- F6 브라우저 통합
F6_LABEL = ("브라우저 통합 구조도(교육용 단순화). 파일 세 개: js/menu.js(J), index.html(H), css/style.css(C). index.html이 link로 "
            "style.css를, script defer로 menu.js를 불러온다(점선). 브라우저 안에서 index.html은 해석되어 DOM(문서 구조)이 된다. "
            "style.css의 규칙은 스타일 계산 단계에서 DOM 요소를 고르기만 하고(점선, 읽기만) 요소마다 적용할 값을 계산한다. "
            "menu.js는 JavaScript 실행 단계에서 DOM을 읽고 바꾼다(양쪽 화살표). 화면 표시 단계는 DOM과 계산된 스타일로 화면을 그린다. "
            "사용자는 화면을 보고, 누르면 이벤트가 JavaScript로 전달된다. CSS 화살표는 DOM에 닿지 않는다.")
F6_FILES = [("j", "js/menu.js", "기능·동작", "← script defer"), ("h", "index.html", "문서·의미", "시작 문서"),
            ("c", "css/style.css", "표현·규칙", "← link")]
F6_INNER = [("box-j", "j", "JavaScript 실행", "DOM을 읽고 바꾼다"), ("box-h", "h", "DOM", "해석해 만든 문서 구조"),
            ("box-c", "c", "스타일 계산", "요소마다 값을 계산")]


def f6(mobile):
    title = "브라우저 안에서 세 파일이 하나의 화면이 되는 구조"
    if not mobile:
        s = Svg(1200, 660, label=F6_LABEL, title=title)
        ys = [60, 250, 440]
        for (k, name, kick, note), y in zip(F6_FILES, ys):
            s.rect(40, y, 250, 110, f"box-{k}")
            s.badge(k, 70, y + 34, 15)
            s.text(96, y + 41, name, 20, "mono ink b")
            s.text(30 + 24, y + 74, kick, 18, "muted")
            s.text(30 + 24, y + 100, note, 18, "mono muted" if note.startswith("←") else "muted")
        s.path("M40 290H24V122H40", "dash", "a-m")
        s.path("M40 320H24V488H40", "dash", "a-m")
        s.rect(340, 20, 680, 590, "box-br", 16)
        s.text(364, 52, "브라우저 (실행 환경)", 22, "ink b")
        for (bcls, k, head, body), y in zip(F6_INNER, [70, 250, 430]):
            s.rect(380, y, 270, 110, bcls)
            s.badge(k, 410, y + 34, 15)
            s.text(436, y + 41, head, 21, "ink b")
            s.text(400, y + 82, body, 18, "muted")
        for y, lab in [(115, "실행"), (305, "해석"), (485, "규칙")]:
            s.path(f"M290 {y}H372", "ln", "a")
            s.text(300, y - 10, lab, 18, "muted")
        s.both("M515 182V246")
        s.text(528, 220, "읽고 바꾼다", 18, "acc")
        s.path("M515 362V424", "dot", "a-m")
        s.text(528, 400, "요소를 고른다 (읽기만)", 18, "muted")
        s.rect(780, 250, 220, 170, "box")
        s.text(890, 300, "화면 표시", 23, "ink b", "middle")
        s.lines(890, 340, ["DOM과 계산된", "스타일로 그린다"], 18, 28, "muted", "middle")
        s.path("M652 300H772", "ln", "a")
        s.text(664, 290, "바탕 구조", 18, "muted")
        s.path("M652 480L772 410", "ln", "a")
        s.text(664, 512, "계산된 모습", 18, "muted")
        s.rect(1050, 250, 130, 170, "box")
        s.text(1115, 300, "사용자", 21, "ink b", "middle")
        s.lines(1115, 340, ["보고", "누른다"], 18, 28, "muted", "middle")
        s.path("M1002 335H1042", "ln", "a")
        s.path("M1115 250V120H658", "ln", "a")
        s.text(800, 108, "누르면 → 이벤트", 18, "muted")
        s.text(40, 640, "실선 = 만든다·바꾼다·그린다 · 점선 = 불러옴·참고 · 교육용 단순화: 실제 브라우저는 여러 일을 동시에 한다", 18, "muted")
    else:
        s = Svg(360, 1150, label=F6_LABEL, title=title)
        s.text(16, 34, "파일 (내 폴더)", 18, "ink b")
        for i, (k, name, kick, note) in enumerate(F6_FILES):
            y = 48 + i * 64
            s.rect(16, y, 328, 54, f"box-{k}", 10)
            s.badge(k, 40, y + 27, 12)
            s.text(64, y + 33, name, 16, "mono ink b")
            s.text(328, y + 33, kick, 16, "muted", "end")
        s.text(16, 266, "index.html이 link·script defer로 불러온다", 16, "muted")
        s.path("M180 276V300", "dash", "a-m")
        s.rect(16, 306, 328, 650, "box-br", 14)
        s.text(32, 338, "브라우저 (실행 환경)", 18, "ink b")
        inner = [("box-j", "j", "JavaScript 실행", "menu.js를 실행"), ("box-h", "h", "DOM", "index.html을 해석해 만든 구조"),
                 ("box-c", "c", "스타일 계산", "style.css 규칙을 요소에 맞춰 계산"), ("box", None, "화면 표시", "DOM + 계산된 스타일로 그림")]
        ys = [356, 512, 668, 824]
        for (bcls, k, head, body), y in zip(inner, ys):
            s.rect(32, y, 260, 104, bcls)
            if k:
                s.badge(k, 56, y + 30, 12)
            s.text(80 if k else 48, y + 37, head, 18, "ink b")
            s.text(48, y + 78, body, 16, "muted")
        s.both("M120 462V506")
        s.text(132, 490, "읽고 바꾼다", 16, "acc")
        s.path("M120 618V662", "dot", "a-m")
        s.text(132, 646, "요소를 고른다(읽기만)", 16, "muted")
        s.path("M120 774V818", "ln", "a")
        s.text(132, 802, "계산된 모습", 16, "muted")
        s.path("M292 564H320V876H300", "ln", "a")
        s.text(16, 984, "DOM → 화면 표시: 그리기의 바탕 (오른쪽 선)", 16, "muted")
        s.rect(16, 1000, 328, 80, "box")
        s.text(32, 1034, "사용자 · 보고 누른다", 18, "ink b")
        s.text(32, 1064, "누르면 이벤트 → JavaScript 실행", 16, "muted")
        s.text(16, 1112, "실선 = 만든다·바꾼다 · 점선 = 불러옴·참고", 16, "muted")
        s.text(16, 1138, "교육용 단순화 (실제로는 동시에 일함)", 16, "muted")
    return s


# ---------------------------------------------------------------- F7 고친 파일 ↔ 바뀌는 화면
F7_LABEL = ("무엇을 고치면 무엇이 바뀌는지 연결한 그림. 1 제목 문구를 바꾸려면 index.html(HTML, 내용). 2 제목 색·크기를 바꾸려면 "
            "css/style.css(CSS, 모습). 3 메뉴가 열리는 방식을 바꾸려면 js/menu.js(JavaScript, 동작). 오른쪽 화면 그림에 1·2는 제목, 3은 ☰ 버튼 위치에 표시되어 있다. "
            "고친 뒤에는 새로고침해야 브라우저가 파일을 다시 읽는다. 열린 메뉴의 모양은 CSS, 열리게 하는 것은 JavaScript다.")
F7_ROWS = [("제목 문구를 바꾸고 싶다", "h", "index.html", "내용"), ("제목 색·크기를 바꾸고 싶다", "c", "css/style.css", "모습"),
           ("메뉴가 열리는 방식을 바꾸고 싶다", "j", "js/menu.js", "동작")]


def mini_page(s, x, y, k=1.0):
    """상태 ③(모바일, 메뉴 열림) 화면을 단순하게 다시 그린다. 폭 300 기준. 표식 위치를 돌려준다."""
    X = lambda v: round(x + v * k, 1)
    Y = lambda v: round(y + v * k, 1)
    S = lambda v: round(v * k, 1)
    s.rect(X(0), Y(0), S(300), S(360), "pg", 10)
    s.group("deco")
    s.add(f'<rect x="{X(0)}" y="{Y(0)}" width="{S(300)}" height="{S(150)}" rx="{S(10)}" class="{P}-pg-brand"/>')
    s.text(X(18), Y(38), "김코디", S(20), "pg-white b")
    s.add(f'<rect x="{X(196)}" y="{Y(14)}" width="{S(88)}" height="{S(36)}" rx="{S(6)}" class="{P}-pg-white"/>')
    s.text(X(240), Y(38), "☰ 메뉴", S(16), "pg-dark b", "middle")
    for i, w in enumerate(["소개", "프로젝트", "연락"]):
        s.text(X(26), Y(80 + i * 26), w, S(16), "pg-white b")
    s.add(f'<circle cx="{X(150)}" cy="{Y(200)}" r="{S(34)}" class="{P}-pg-soft"/>')
    s.add(f'<circle cx="{X(150)}" cy="{Y(194)}" r="{S(16)}" class="{P}-pg-skin"/>')
    s.text(X(150), Y(272), "안녕하세요,", S(24), "pg-dark b", "middle")
    s.text(X(150), Y(304), "김코디입니다", S(24), "pg-dark b", "middle")
    s.add(f'<rect x="{X(40)}" y="{Y(322)}" width="{S(220)}" height="{S(8)}" rx="{S(4)}" class="{P}-pg-gray"/>')
    s.end()
    return {1: (X(54), Y(264)), 2: (X(250), Y(296)), 3: (X(176), Y(32))}


def f7(mobile):
    title = "고친 파일과 바뀌는 화면"
    if not mobile:
        s = Svg(1200, 470, label=F7_LABEL, title=title)
        for i, (want, k, file, what) in enumerate(F7_ROWS):
            y = 20 + i * 120
            s.rect(30, y, 380, 96, "box")
            s.num(i + 1, 62, y + 48, 17)
            s.text(92, y + 55, want, 20, "ink b")
            s.path(f"M412 {y + 48}H462", "ln", "a")
            s.rect(470, y, 300, 96, f"box-{k}")
            s.badge(k, 504, y + 48, 16)
            s.text(534, y + 42, file, 20, "mono ink b")
            s.text(534, y + 72, what, 18, "muted")
        marks = mini_page(s, 850, 20)
        for n, (mx, my) in marks.items():
            s.num(n, mx, my, 15)
        s.text(30, 418, "고친 뒤에는 새로고침 → 브라우저가 파일을 다시 읽는다", 20, "ink")
        s.text(30, 452, "열린 메뉴의 모양은 CSS, 열리게 하는 것은 JavaScript — 기능 하나에 세 파일이 함께 일하기도 한다", 18, "muted")
    else:
        s = Svg(360, 860, label=F7_LABEL, title=title)
        marks = mini_page(s, 30, 16, 1.0)
        for n, (mx, my) in marks.items():
            s.num(n, mx, my, 14)
        for i, (want, k, file, what) in enumerate(F7_ROWS):
            y = 396 + i * 118
            s.rect(16, y, 328, 104, f"box-{k}")
            s.num(i + 1, 42, y + 30, 14)
            s.text(66, y + 36, want, 17, "ink b")
            s.badge(k, 46, y + 74, 12)
            s.text(70, y + 80, file, 16, "mono ink b")
            s.text(328, y + 80, what, 16, "muted", "end")
        s.text(16, 772, "고친 뒤 새로고침 → 파일을 다시 읽는다", 16, "ink")
        s.text(16, 804, "열린 메뉴의 모양은 CSS,", 16, "muted")
        s.text(16, 830, "열리게 하는 것은 JavaScript", 16, "muted")
    return s


# ---------------------------------------------------------------- F8 공개
F8_LABEL = ("로컬에서 공개까지의 흐름. 내 컴퓨터의 세 파일을 GitHub 저장소에 올리고, GitHub Pages가 파일을 공개하며, 방문자는 공개 URL로 접속한다. "
            "방문자의 브라우저가 파일을 받아 DOM·스타일·JavaScript로 화면을 만든다. 합치고 실행하는 곳은 Pages가 아니라 방문자의 브라우저다. "
            "명령과 설정은 학습가이드 Ch8.")
F8_STEPS = [("box", "내 컴퓨터", ["세 파일", "H · C · J"]), ("box", "GitHub 저장소", ["파일을", "올려 보관"]),
            ("box", "GitHub Pages", ["파일을", "공개"]), ("box", "공개 URL", ["주소로", "접속"]),
            ("box-acc", "방문자 브라우저", ["파일을 받아", "화면을 만든다"])]


def f8(mobile):
    title = "내 컴퓨터에서 공개 URL까지"
    if not mobile:
        s = Svg(1200, 350, label=F8_LABEL, title=title)
        for i, (bcls, head, body) in enumerate(F8_STEPS):
            x = 30 + i * 232
            s.rect(x, 30, 208, 170, bcls)
            s.text(x + 104, 82, head, 21, "ink b", "middle")
            s.lines(x + 104, 128, body, 19, 30, "muted", "middle")
            if i < 4:
                s.path(f"M{x + 210} 115H{x + 228}", "ln", "a")
        s.rect(30, 230, 1140, 64, "box-acc")
        s.text(600, 271, "합치고 실행하는 곳은 Pages가 아니라 방문자의 브라우저 (S4-1과 같은 일)", 22, "ink b", "middle")
        s.text(30, 330, "Pages는 파일을 공개할 뿐이다 · 업로드 명령과 설정은 학습가이드 Ch8", 18, "muted")
    else:
        s = Svg(360, 760, label=F8_LABEL, title=title)
        for i, (bcls, head, body) in enumerate(F8_STEPS):
            y = 16 + i * 112
            s.rect(16, y, 328, 84, bcls)
            s.text(36, y + 36, head, 18, "ink b")
            s.text(36, y + 66, " ".join(body), 16, "muted")
            if i < 4:
                s.path(f"M180 {y + 86}V{y + 108}", "ln", "a")
        s.rect(16, 590, 328, 96, "box-acc")
        s.text(32, 626, "합치고 실행하는 곳은", 18, "ink b")
        s.text(32, 656, "방문자의 브라우저 (S4-1)", 18, "ink b")
        s.text(16, 718, "Pages는 파일을 공개할 뿐", 16, "muted")
        s.text(16, 744, "명령·설정은 학습가이드 Ch8", 16, "muted")
    return s


FIGURES = {"f1-three-roles": f1, "f3-html": f3, "f4-css-rule": f4, "f5-event": f5_event, "f5-dom": f5_dom, "f6-browser": f6,
           "f7-edit-map": f7, "f8-publish": f8}

if __name__ == "__main__":
    for name, fn in FIGURES.items():
        for mobile in (False, True):
            out = f"{name}-{'mobile' if mobile else 'desktop'}.svg"
            save(out, fn(mobile))
            print(out)
