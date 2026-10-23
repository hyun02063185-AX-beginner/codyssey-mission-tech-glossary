"""B2-1 Scene 06 (Decorator와 공통 관심사) 노트북·휴대전화 SVG 생성기.

Scene 05 생성기(../../scene-05/_tools/build.py)의 그리기 도구를 불러 쓴다(그 안에서 Scene 04·03-B·03-A·02·01 도구도 쓴다). 여섯 파일은 바꾸지 않는다.
그림의 코드 줄·실행 순서·출력·예외 경로는 _tools/demo/의 실제 소스와 실행 결과이며, verify_demo.py가 대조한다.

시각 약속(Scene 01~05 약속 유지 + 이번 추가):
- 실제 실행 순서 = 검은 번호 원 + 진한 실선·채운 화살촉 (그림 B의 두 영역은 영역마다 번호를 따로 매김, 그림 C는 경로마다)
- return = 회색 가는 실선·빈 화살촉·'return' 글자, 번호 없음(Scene 03-A)
- 예외 = 빨간 파선 + 채운 빨간 화살촉 + 'raise …' 글자. 처리되는 예외는 긴 파선, 전파되는 예외는 짧은 점선
- 감쌈 관계(Decorator → 감싼 함수) = 보라 점선, 번호·화살촉 없음(Scene 05 '만들어 냄'과 같은 모양, 선 옆 글자로 구분)
- wrapper = 파란 테두리 + 'wrapper' 글자, 원래 함수 = 초록 테두리 + '원래 함수' 글자, 반복되는 줄 = 갈색 파선 띠 + '반복'
- 그림 A·D에는 번호 원을 쓰지 않는다. 색만으로 구분하지 않는다.

실행: python -I build.py  (출력: ../decorator-flow-desktop.svg, ../decorator-flow-mobile.svg)
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location("scene05_build", os.path.join(HERE, "..", "..", "scene-05", "_tools", "build.py"))
b5 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(b5)
b4, b3, s3, s2, s1 = b5.b4, b5.b3, b5.s3, b5.s2, b5.s1
tw, esc, attr, section_head = s1.tw, s1.esc, b4.attr, s1.section_head
behind = b5.behind

# ── 내용 (노트북·휴대전화 공통) ────────────────────────────────
TITLE = "여러 함수에 똑같이 필요한 일을 매번 다시 쓰지 않으려면?"
SUB = "함수도 값 → 함수를 감싸는 wrapper → @ 문법과 두 시점 → 로그·예외 처리·시간 측정"

# 그림 A: repeated_logs.py(왼쪽) · log_decorator.py(오른쪽)의 실제 소스 줄
# (함수 안 줄 번호 또는 "시작-끝" 범위, 글자). 범위는 원래 기능 줄을 한 줄로 줄인 것(…로 시작). 원고 1·7-1절에 전체 코드
A_LEFT = [
    ("add_transaction", [("1", 'def add_transaction(category, amount):'), ("2", '    print("[로그] add_transaction 시작")'),
                         ("3-4", "    … 원래 기능: 거래를 목록에 추가(2줄)"), ("5", '    print("[로그] add_transaction 끝")'),
                         ("6", '    return item')]),
    ("list_transactions", [("1", 'def list_transactions():'), ("2", '    print("[로그] list_transactions 시작")'),
                           ("3", '    result = list(transactions)'), ("4", '    print("[로그] list_transactions 끝")'),
                           ("5", '    return result')]),
]
A_RIGHT = [
    ("add_transaction", [("1", '@log_calls'), ("2", 'def add_transaction(category, amount):'),
                         ("3-7", "    … 원래 기능: 금액 검사·거래 추가(5줄)")]),
    ("list_transactions", [("1", '@log_calls'), ("2", 'def list_transactions():'), ("3", '    return list(transactions)')]),
]
A_WRAP = [("앞", "시작 기록을 출력"), ("원래 함수", "result = func(*args, **kwargs)"), ("뒤", "끝 기록을 출력 · 결과를 return")]
A_NOTE = "Decorator만 정답은 아니다: 로그 함수를 따로 만들어 부르거나 공통 호출 함수를 두는 방법도 있다."

# 그림 B: when_applied.py
B_DEF = [
    ("1", "def greet(): … 실행", "원래 함수 객체가 만들어짐"),
    ("2", "trace(원래 greet) 호출", "wrapper를 만들어 돌려줌"),
    ("3", "이름 greet → wrapper", "원래 함수는 wrapper 안의 func"),
]
B_DEF_OUT = "[정의 시점] trace(greet) 실행 → wrapper를 돌려줌"
B_CALL = [
    ("1", "greet() 호출", "이름이 가리키는 wrapper가 실행"),
    ("2", "wrapper 앞부분", "[호출 시점] wrapper 앞 (greet)"),
    ("3", "func() → 원래 greet 본문", "  [greet 본문] 안녕하세요"),
    ("4", "wrapper 뒤부분", "[호출 시점] wrapper 뒤 (greet)"),
]
B_TIMES = "정의 시점 출력 1번 · greet()를 두 번 부르면 호출 시점 출력이 두 번"

# 그림 C: error_decorator.py — (경로 id, 이름, 원래 함수 호출, 원래 함수 결과, wrapper가 하는 일, 호출한 쪽이 받는 것, 출력 줄들)
C_PATHS = [
    ("ok", "정상", "find_transaction(items, 1)", "return item", "return func(…) 그대로", "거래 딕셔너리",
     ["정상 → 결과: {'id': 1, 'category': '식비', 'amount': 8000}"]),
    ("handled", "처리하는 예외", "find_transaction(items, 9)", "raise AppError", "except AppError: [오류] 출력 · return None", "None",
     ["[오류] id 9 거래가 없습니다", "AppError → 결과: None"]),
    ("propagate", "처리 범위 밖 예외", "read_amount({'id': 2})", "KeyError", "except AppError에 해당 안 함 → 받지 않음", "KeyError(전파)",
     ["처리 범위 밖 예외는 전파 → KeyError 'amount'"]),
]

# 그림 D: 세 공통 관심사 — (id, 이름, 데모, 앞, 원래 함수 호출, 뒤, 예외, 반환값, 원래 함수의 책임, 출력 예)
D_CONCERNS = [
    ("log", "로그", "log_decorator.py", "시작 기록", "func(*args, **kwargs)", "끝 기록", "기록 후 raise로 다시 던짐",
     "원래 결과 그대로", "거래 추가·목록", ["[로그] add_transaction 시작", "[로그] add_transaction 끝"]),
    ("error", "예외 처리", "error_decorator.py", "try: 시작", "return func(*args, **kwargs)", "except AppError: 메시지",
     "AppError만 받음 · 나머지 전파", "정상은 그대로 · 처리한 예외는 None", "거래 찾기", ["[오류] id 9 거래가 없습니다"]),
    ("time", "시간 측정", "timing_decorator.py", "start = clock()", "func(*args, **kwargs)", "차이를 계산해 출력",
     "받지 않음(그대로 전파)", "원래 결과 그대로", "합계 계산", ["[시간] sample: 0.250000초"]),
]
D_TIME_NOTE = "실제 시계의 숫자는 실행마다 다름 → 위는 가짜 시계(0.25초 고정) 결과"
D_ROWS = [("앞", 3), ("원래 함수 호출", 4), ("뒤", 5), ("예외", 6), ("반환값", 7)]

FOOT = [
    "모든 예제는 Scene 06 학습용 예제입니다(_tools/demo/의 파일 11개). 실제 미션 구현이나 정답이 아닙니다. 코드는 원래 기능 줄을 '…'로 줄였고 전체는 원고에 있습니다.",
    "그림의 코드 줄·실행 순서·출력·예외 경로는 예제를 실제로 실행하고 호출을 추적해 확인했습니다(Python 3.14.6). 실제 시간 숫자는 그리지 않았습니다.",
]
FOOT_M = [
    "모든 예제는 Scene 06 학습용 예제입니다.",
    "실제 미션 구현이나 정답이 아닙니다.",
    "코드·순서·출력은 실제 실행으로 확인했습니다.",
]
DESC = (
    "Scene 06. 그림 A는 같은 로그 코드가 반복되는 두 함수(add_transaction, list_transactions)와, 로그를 log_calls Decorator의 wrapper 한 곳으로 모으고 두 함수에는 원래 기능만 남긴 모습을 비교한다. "
    "반복되는 로그 줄은 네 줄이며, Decorator 외에 로그 함수를 따로 만들거나 공통 호출 함수를 두는 방법도 있다. "
    "그림 B는 Decorator의 두 시점이다. 정의 시점(def 문을 실행할 때 한 번): 1 def greet가 실행되어 원래 함수 객체가 만들어지고, 2 trace(원래 greet)가 호출되어 wrapper를 돌려주고, 3 이름 greet가 wrapper를 가리킨다. "
    "호출 시점(greet()를 부를 때마다): 1 greet() 호출로 wrapper가 실행되고, 2 wrapper 앞부분, 3 func()로 원래 greet 본문, 4 wrapper 뒤부분이 실행된다. 정의 시점 출력은 한 번, greet()를 두 번 부르면 호출 시점 출력이 두 번이다. "
    "그림 C는 예외 처리 Decorator handle_app_errors의 세 경로다. 정상: 원래 함수가 거래를 돌려주고 wrapper가 그대로 돌려준다. 처리하는 예외: 원래 함수가 AppError를 일으키면 wrapper가 받아 [오류] id 9 거래가 없습니다를 출력하고 None을 돌려준다. "
    "처리 범위 밖 예외: 원래 함수의 KeyError는 wrapper가 받지 않아 호출한 쪽으로 전파된다. "
    "그림 D는 로그·예외 처리·시간 측정을 비교한다. 셋 다 wrapper가 원래 함수를 부르는 같은 원리이지만, 로그는 시작·끝을 기록하고 예외는 기록 후 다시 던지며, 예외 처리는 AppError만 받아 메시지와 None을 돌려주고, "
    "시간 측정은 시작 시각과의 차이를 출력한다. 실제 시간 숫자는 실행마다 달라 가짜 시계 결과 0.250000초만 보인다."
)

EXTRA = """      .rep { fill: #fff4e5; stroke: #8a4100; stroke-width: 1.4; stroke-dasharray: 5 3; }
      .repT { fill: #8a4100; font-weight: 700; }
      .wrapB { fill: #eef3fa; stroke: #1d4f91; stroke-width: 2.2; }
      .wrapT { fill: #1d4f91; font-weight: 700; }
      .origB { fill: #f2f9f4; stroke: #17663f; stroke-width: 2.2; }
      .origT { fill: #17663f; font-weight: 700; }
      .callerB { fill: #ffffff; stroke: #5b6672; stroke-width: 1.6; }
      .exc { fill: none; stroke: #9b2c2c; stroke-width: 2.4; stroke-dasharray: 9 5; }
      .exc2 { fill: none; stroke: #9b2c2c; stroke-width: 2.6; stroke-dasharray: 2 4; }
      .excT { fill: #9b2c2c; font-weight: 700; }
      .area { fill: #f7f9fb; stroke: #8a96a3; stroke-width: 1.4; }
      .areaH { fill: #1b2733; font-weight: 700; }
"""
WRAP_TAG = "wrapper"
ORIG_TAG = "원래 함수"


class Svg(b5.Svg):
    def exc(self, pts, frm, to, kind="exc"):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="{kind}" marker-end="url(#{self.idp}-ex)" data-exc="{frm}>{to}"/>')

    def save(self, name, desc):
        tid, did = f"{self.idp}-title", f"{self.idp}-desc"
        style = s1.STYLE.replace("    </style>", s2.EXTRA_STYLE + s3.EXTRA + b3.EXTRA + b4.EXTRA + b5.EXTRA + EXTRA + "    </style>")
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'role="img" aria-labelledby="{tid} {did}">\n'
                f'  <title id="{tid}">{esc(self.label)}</title>\n'
                f'  <desc id="{did}">{esc(desc)}</desc>\n'
                f'  <defs>\n{style}\n'
                f'    <marker id="{self.idp}-arr" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#1b2733"/></marker>\n'
                f'    <marker id="{self.idp}-ret" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M1 1L8 5L1 9" fill="none" stroke="#7b8794" stroke-width="1.8"/></marker>\n'
                f'    <marker id="{self.idp}-ex" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#9b2c2c"/></marker>\n  </defs>\n'
                f'  <rect width="{self.w}" height="{self.h}" fill="#ffffff"/>\n')
        body = "\n".join("  " + b for b in self.body)
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(head + body + "\n</svg>\n")


def code_block(s, x, y, w, lines, size, step, box, src, rep_mark=True, mobile=False):
    """소스 줄 상자. 줄마다 data-line(원래 줄 번호) 또는 data-span(줄인 범위).
    반복되는 로그 줄([로그])은 갈색 파선 띠 + '반복'(휴대전화는 '반복'을 줄 위에 따로)."""
    rows = sum(2 if (mobile and rep_mark and "[로그]" in ln) else 1 for _, ln in lines)
    h = 12 + step * rows
    s.rect(x, y, w, h, "code", 10, box)
    s.add(f'<g data-src="{src}">')
    r = 0
    for k, (no, ln) in enumerate(lines):
        is_rep = rep_mark and "[로그]" in ln
        if is_rep:
            rb = f"{box}-rep{k}"
            span = 2 if mobile else 1
            s.rect(x + 4, y + 6 + step * r + 2, w - 8, step * span - 2, "rep", 4, rb, extra=' data-rep="1"')
            if mobile:
                s.text(x + 10, y + 6 + step * (r + 1) - 3, "반복 ↓", size, "repT", inside=rb)
                r += 1
            else:
                s.text(x + w - 10, y + 6 + step * (r + 1) - 6, "반복", size, "repT", "end", inside=rb)
        ty = y + 6 + step * (r + 1) - 6
        attr_ = f' data-span="{no}"' if "-" in no else f' data-line="{no}"'
        s.text(x + 10, ty, ln, size, "s m" if "-" in no else "t m", inside=box, extra=attr_)
        r += 1
    s.add("</g>")
    return y + h


def legend(s, x, y, w, size, mobile=False):
    items = [("flow", "번호·검은 선 = 실제 실행 순서"), ("ret", "회색 선 = return(번호 없음)"),
             ("exc", "빨간 긴 파선 = 처리되는 예외"), ("exc2", "빨간 점선 = 전파되는 예외")]
    if mobile:
        h = 20 + 34 * (len(items) + 2)
        s.rect(x, y, w, h, "legend", 12)
        yy = y + 24
        for cls, label in items:
            marker = {"flow": "arr", "ret": "ret", "exc": "ex", "exc2": "ex"}[cls]
            if cls == "flow":
                s.step(x + 18, yy, "1", 12, 14)
                s.add(f'<path d="M{x + 33} {yy}H{x + 68}" class="flow" marker-end="url(#{s.idp}-{marker})"/>')
            else:
                s.add(f'<path d="M{x + 12} {yy}H{x + 68}" class="{cls}" marker-end="url(#{s.idp}-{marker})"/>')
            s.text(x + 80, yy + 5, label, size)
            yy += 34
        s.rect(x + 12, yy - 14, 70, 26, "wrapB", 6)
        s.text(x + 20, yy + 4, WRAP_TAG, size, "wrapT")
        s.rect(x + 160, yy - 14, 84, 26, "origB", 6)
        s.text(x + 168, yy + 4, ORIG_TAG, size, "origT")
        yy += 34
        s.add(f'<path d="M{x + 12} {yy}H{x + 68}" class="ref"/>')
        s.text(x + 80, yy + 5, "보라 점선 = 감쌈(순서 아님)", size)
        return y + h
    s.rect(x, y, w, 92, "legend", 12)
    xx = x + 16
    yy = y + 30
    for cls, label in items:
        marker = {"flow": "arr", "ret": "ret", "exc": "ex", "exc2": "ex"}[cls]
        if cls == "flow":
            s.step(xx + 10, yy - 6, "1", 13, 16)
            s.add(f'<path d="M{xx + 28} {yy - 6}H{xx + 66}" class="flow" marker-end="url(#{s.idp}-{marker})"/>')
        else:
            s.add(f'<path d="M{xx} {yy - 6}H{xx + 60}" class="{cls}" marker-end="url(#{s.idp}-{marker})"/>')
        s.text(xx + 76, yy, label, size)
        xx += 76 + tw(label, size) + 30
    yy += 38
    s.rect(x + 16, yy - 22, 84, 30, "wrapB", 6)
    s.text(x + 26, yy - 2, WRAP_TAG, size, "wrapT")
    s.rect(x + 112, yy - 22, 92, 30, "origB", 6)
    s.text(x + 122, yy - 2, ORIG_TAG, size, "origT")
    s.text(x + 216, yy - 2, "= 테두리 색과 글자로 구분", size)
    s.add(f'<path d="M{x + 470} {yy - 8}H{x + 530}" class="ref"/>')
    s.text(x + 542, yy - 2, "보라 점선 = Decorator가 감쌈(관계, 순서 아님)", size)
    return y + 92


# ══ 노트북용 (1280) ══════════════════════════════════════════════
def desktop():
    s = Svg(1280, 0, TITLE + " · 노트북용", "d7")
    s.text(32, 54, TITLE, 30, "t b")
    s.text(32, 90, "Scene 06 · " + SUB, 18, "s")
    y = legend(s, 16, 120, 1248, 16) + 44

    # ── 그림 A ──────────────────────────────────────────────
    s.comment("그림 A. 중복 코드와 공통 기능 분리 (번호 없음)")
    section_head(s, 16, y, "A", "같은 로그가 반복될 때 — 원래 기능과 부가 기능 나누기", 22)
    y += 22
    top = y
    left_at = len(s.body)
    s.text(36, y + 32, "반복되는 경우 · repeated_logs.py", 18, "t b", inside="a-left")
    yy = y + 48
    for fid, lines in A_LEFT:
        yy = code_block(s, 32, yy, 580, lines, 16, 26, f"a-left-{fid}", f"repeated_logs.py:{fid}") + 14
    s.text(36, yy + 16, "로그 줄 4개가 두 함수에 섞여 있음 → 함수가 늘면 같이 늘어남", 16, "t", inside="a-left")
    left_bot = yy + 36
    right_at = len(s.body)
    s.text(672, y + 32, "분리한 경우 · log_decorator.py", 18, "t b", inside="a-right")
    s.rect(668, y + 48, 580, 132, "wrapB", 10, "rel-wrapper")
    s.text(684, y + 74, "log_calls(func) → wrapper", 16, "wrapT m", inside="rel-wrapper")
    for k, (part, code) in enumerate(A_WRAP):
        s.text(684, y + 102 + 26 * k, part, 16, "s b", inside="rel-wrapper")
        s.text(774, y + 102 + 26 * k, code, 16, "t" if part != "원래 함수" else "origT m", inside="rel-wrapper", extra=f' data-wrap="{attr(part)}={attr(code)}"')
    ry = y + 210
    fn_boxes = []
    for fid, lines in A_RIGHT:
        b = f"rel-fn-{fid}"
        bot = code_block(s, 668, ry, 580, lines, 16, 26, b, f"log_decorator.py:{fid}", rep_mark=False)
        fn_boxes.append((fid, ry, bot))
        ry = bot + 14
    for fid, top_y, bot in fn_boxes:
        s.rel([(1236, y + 180), (1236, top_y + 2)] if fid == "add_transaction" else [(1248, y + 120), (1256, y + 120), (1256, top_y + 20), (1248, top_y + 20)], "wrapper", f"fn-{fid}")
    s.text(1080, y + 200, "@log_calls로 감쌈", 16, "refT2", "end")
    s.text(672, ry + 16, "두 함수에는 원래 기능만 · 로그는 wrapper 한 곳", 16, "t b", inside="a-right")
    right_bot = ry + 36
    bot = max(left_bot, right_bot)
    behind(s, right_at, 652, top, 612, bot - top, "a-right")
    behind(s, left_at, 16, top, 612, bot - top, "a-left")
    y = bot + 14
    s.text(16, y + 16, A_NOTE, 16, "s")
    y += 84

    # ── 그림 B ──────────────────────────────────────────────
    s.comment("그림 B. Decorator의 두 시점: 정의 시점(왼쪽)과 호출 시점(오른쪽). 영역마다 번호를 따로 매김")
    section_head(s, 16, y, "B", "Decorator의 두 시점 — 정의할 때 한 번, 호출할 때마다 · when_applied.py", 22)
    y += 22
    s.rect(16, y, 612, 470, "area", 12, "b-def")
    s.text(36, y + 32, "정의 시점 · def 문을 실행할 때 한 번", 18, "areaH", inside="b-def")
    s.rect(36, y + 50, 572, 70, "code", 8, "b-def-code")
    s.text(48, y + 76, "@trace", 16, "t m b", inside="b-def-code")
    s.text(48, y + 102, "def greet(): …", 16, "t m", inside="b-def-code")
    s.text(260, y + 89, "= def greet(): … 뒤 greet = trace(greet)", 16, "s", inside="b-def-code")
    s.rect(36, y + 150, 170, 74, "origB", 10, "call-orig0", extra=' data-bstep="def:1"')
    s.text(48, y + 176, ORIG_TAG, 16, "origT", inside="call-orig0")
    s.text(48, y + 202, "greet 객체", 16, "t m", inside="call-orig0")
    s.rect(260, y + 150, 120, 74, "card", 10, "call-trace", extra=' data-bstep="def:2"')
    s.text(276, y + 176, "trace", 16, "t m b", inside="call-trace")
    s.text(276, y + 202, "Decorator", 16, "s", inside="call-trace")
    s.rect(430, y + 150, 178, 74, "wrapB", 10, "call-wrap0")
    s.text(442, y + 176, WRAP_TAG, 16, "wrapT", inside="call-wrap0")
    s.text(442, y + 202, "func = 원래 greet", 16, "t m", inside="call-wrap0")
    s.call([(206, y + 170), (258, y + 170)], "orig0", "trace", "2")
    s.retline([(380, y + 204), (428, y + 204)], "trace", "wrap0")
    s.text(404, y + 246, "return wrapper", 16, "retT", "middle")
    s.rect(430, y + 272, 178, 44, "callerB", 8, "rel-name0", extra=' data-bstep="def:3"')
    s.text(442, y + 300, "이름 greet", 16, "t m b", inside="rel-name0")
    s.rel([(519, y + 272), (519, y + 226)], "name0", "wrap0")
    s.text(530, y + 252, "가리킴", 16, "refT2")
    s.step(190, y + 142, "1", 13, 16)
    s.step(232, y + 150, "2", 13, 16)
    s.step(416, y + 294, "3", 13, 16)
    sy = y + 340
    for n, what, note in B_DEF:
        box = f"bdef-{n}"
        s.rect(36, sy, 572, 34, "legend", 6, box)
        s.step(56, sy + 17, n, 13, 16)
        s.text(78, sy + 23, what, 16, "t m b", inside=box)
        s.text(330, sy + 23, note, 16, "s", inside=box)
        sy += 40
    s.rect(652, y, 612, 470, "area", 12, "b-call")
    s.text(672, y + 32, "호출 시점 · greet()를 부를 때마다", 18, "areaH", inside="b-call")
    s.rect(672, y + 50, 160, 52, "callerB", 10, "call-caller", extra=' data-bstep="call:1"')
    s.text(686, y + 82, "greet()", 16, "t m b", inside="call-caller")
    s.rect(672, y + 132, 572, 230, "wrapB", 12, "call-wrap1")
    s.text(688, y + 158, WRAP_TAG + " (greet라는 이름이 가리킴)", 16, "wrapT", inside="call-wrap1")
    s.rect(688, y + 170, 540, 40, "legend", 6, "call-front", extra=' data-bstep="call:2"')
    s.text(736, y + 196, "앞부분", 16, "t b", inside="call-front")
    s.rect(906, y + 228, 322, 58, "origB", 10, "call-orig1", extra=' data-bstep="call:3"')
    s.text(948, y + 252, ORIG_TAG + " = func", 16, "origT", inside="call-orig1")
    s.text(948, y + 276, "greet 본문", 16, "t m", inside="call-orig1")
    s.rect(688, y + 314, 540, 40, "legend", 6, "call-back", extra=' data-bstep="call:4"')
    s.text(736, y + 340, "뒤부분", 16, "t b", inside="call-back")
    s.call([(752, y + 102), (752, y + 130)], "caller", "wrap1", "1")
    s.call([(960, y + 210), (960, y + 226)], "front", "orig1", "3")
    s.retline([(1200, y + 286), (1200, y + 312)], "orig1", "back")
    s.text(1190, y + 305, "return", 16, "retT", "end")
    s.step(780, y + 116, "1", 13, 16)
    s.step(710, y + 190, "2", 13, 16)
    s.step(926, y + 257, "3", 13, 16)
    s.step(710, y + 334, "4", 13, 16)
    code = ["[호출 시점] wrapper 앞 (greet)", "  [greet 본문] 안녕하세요", "[호출 시점] wrapper 뒤 (greet)"]
    sy = y + 376
    s.rect(672, sy, 572, 16 + 24 * 3, "code", 8, "b-call-out")
    for k, ln in enumerate(code):
        s.text(684, sy + 28 + 24 * k, ln, 16, "t m", inside="b-call-out", extra=f' data-out="{attr(ln)}"')
    y += 470 + 14
    s.rect(16, y, 1248, 44, "legend", 10, "b-note")
    s.text(32, y + 28, B_TIMES + " — 적용과 호출은 다른 시점", 16, "t b", inside="b-note")
    s.text(1248, y + 28, B_DEF_OUT, 16, "s m", "end", inside="b-note", extra=f' data-out="{attr(B_DEF_OUT)}"')
    y += 108

    # ── 그림 C ──────────────────────────────────────────────
    s.comment("그림 C. 예외 처리의 세 경로 (error_decorator.py)")
    section_head(s, 16, y, "C", "예외 처리 Decorator의 세 경로 · handle_app_errors", 22)
    y += 22
    for name, x, w in (("호출한 쪽", 16, 250), ("wrapper · try / except AppError", 282, 380), ("원래 함수", 678, 270), ("호출한 쪽이 받는 것 · 실제 출력", 964, 300)):
        s.text(x + 8, y + 22, name, 16, "s b")
    y += 34
    for pid, name, call, result, wrap_does, got, outs in C_PATHS:
        rh = 128
        s.add(f'<g data-path="{pid}">')
        s.rect(16, y, 1248, rh, "card", 12, f"c-{pid}")
        s.rect(28, y + 14, 236, 100, "callerB", 10, f"call-{pid}-caller")
        s.text(40, y + 40, name, 17, "t b", inside=f"call-{pid}-caller")
        cut = call.index("(")
        s.text(40, y + 68, call[:cut], 16, "t m", inside=f"call-{pid}-caller")
        s.text(40, y + 92, call[cut:], 16, "t m", inside=f"call-{pid}-caller")
        s.rect(290, y + 14, 370, 100, "wrapB", 10, f"call-{pid}-wrap")
        s.text(302, y + 40, WRAP_TAG, 16, "wrapT", inside=f"call-{pid}-wrap")
        wl = wrap_does.split(" · ") if " · " in wrap_does else wrap_does.split(" → ")
        for k, ln in enumerate(wl):
            s.text(302, y + 68 + 24 * k, ln if k == 0 or " · " in wrap_does else "→ " + ln, 16, "t" if pid != "propagate" else ("excT" if k else "t"), inside=f"call-{pid}-wrap")
        s.rect(686, y + 14, 262, 100, "origB", 10, f"call-{pid}-orig")
        s.text(698, y + 40, ORIG_TAG, 16, "origT", inside=f"call-{pid}-orig")
        s.text(698, y + 68, result, 16, "t m b" if pid == "ok" else "excT m", inside=f"call-{pid}-orig")
        s.rect(972, y + 14, 284, 100, "code", 10, f"c-{pid}-got")
        s.text(984, y + 38, "받는 것: " + got, 16, "t b", inside=f"c-{pid}-got", extra=f' data-got="{attr(got)}"')
        for k, o in enumerate(outs):
            short = o if tw(o, 15, True) < 260 else o[: o.index("→") + 1]
            s.add(f'<g data-out="{attr(o)}">')
            if pid == "ok":
                s.text(984, y + 64, "정상 → 결과:", 16, "t m", inside=f"c-{pid}-got")
                s.text(984, y + 88, "{'id': 1, …}", 16, "t m", inside=f"c-{pid}-got")
            elif pid == "propagate":
                s.text(984, y + 64, "처리 범위 밖 예외는 전파 →", 16, "t m", inside=f"c-{pid}-got")
                s.text(984, y + 88, "KeyError 'amount'", 16, "t m b", inside=f"c-{pid}-got")
            else:
                s.text(984, y + 64 + 24 * k, o, 16, "t m", inside=f"c-{pid}-got")
            s.add("</g>")
        cy = y + 46
        s.call([(264, cy), (288, cy)], f"{pid}-caller", f"{pid}-wrap", "1")
        s.call([(660, cy), (684, cy)], f"{pid}-wrap", f"{pid}-orig", "2")
        s.step(276, cy - 20, "1", 12, 16)
        s.step(672, cy - 20, "2", 12, 16)
        by = y + 96
        if pid == "ok":
            s.retline([(684, by), (662, by)], f"{pid}-orig", f"{pid}-wrap")
            s.retline([(288, by), (266, by)], f"{pid}-wrap", f"{pid}-caller")
        elif pid == "handled":
            s.exc([(684, by), (662, by)], f"{pid}-orig", f"{pid}-wrap", "exc")
            s.retline([(288, by), (266, by)], f"{pid}-wrap", f"{pid}-caller")
        else:
            s.exc([(684, by + 8), (276, by + 8), (276, by - 4), (266, by - 4)], f"{pid}-orig", f"{pid}-caller", "exc2")
        s.add("</g>")
        y += rh + 10
    s.text(16, y + 20, "정상·처리한 예외는 회색 return으로 돌아오고, 처리 범위 밖 예외(빨간 점선)는 wrapper를 지나 그대로 전파된다.", 16, "t")
    s.text(16, y + 46, "모든 예외를 잡으면 프로그램 결함(KeyError)까지 사용자 오류처럼 숨는다 → 미리 예상한 AppError만 받는다.", 16, "t b")
    y += 120

    # ── 그림 D ──────────────────────────────────────────────
    s.comment("그림 D. 공통 관심사 세 가지 (번호 없음)")
    section_head(s, 16, y, "D", "공통 관심사 세 가지 — 같은 원리, 다른 일", 22)
    y += 22
    cw = (1248 - 2 * 20) / 3
    top = y
    d_at, d_bot = [], []
    for i, (cid, name, demo, front, call, back, exc, ret, duty, outs) in enumerate(D_CONCERNS):
        x = 16 + i * (cw + 20)
        box = f"d-{cid}"
        s.add(f'<g data-concern="{cid}">')
        d_at.append(len(s.body))
        s.text(x + 18, y + 32, name, 20, "t b", inside=box)
        s.text(x + cw - 16, y + 32, demo, 16, "s m", "end", inside=box)
        s.rect(x + 14, y + 48, cw - 28, 34 + 5 * 60, "wrapB", 10, f"{box}-wrap")
        s.text(x + 26, y + 72, WRAP_TAG, 16, "wrapT", inside=f"{box}-wrap")
        ry = y + 84
        for (label, idx) in D_ROWS:
            val = D_CONCERNS[i][idx]
            rb = f"{box}-r{idx}"
            cls = "origB" if label == "원래 함수 호출" else "legend"
            s.rect(x + 24, ry, cw - 48, 54, cls, 6, rb, extra=f' data-row="{attr(label)}={attr(val)}"')
            s.text(x + 34, ry + 22, label, 16, "s b" if cls == "legend" else "origT", inside=rb)
            s.text(x + 34, ry + 45, val, 16, "t m" if any(c in val for c in ("func", "clock", "try", "except")) else "t", inside=rb)
            ry += 60
        dy = y + 48 + 34 + 5 * 60 + 12
        s.rect(x + 14, dy, cw - 28, 44, "origB", 8, f"{box}-duty")
        s.text(x + 26, dy + 28, "원래 함수의 책임: " + duty, 16, "origT", inside=f"{box}-duty", extra=f' data-duty="{attr(duty)}"')
        s.text(x + 18, dy + 74, "실제 출력", 16, "s b", inside=box)
        s.rect(x + 14, dy + 86, cw - 28, 16 + 24 * len(outs), "code", 8, f"{box}-out")
        for k, o in enumerate(outs):
            s.text(x + 26, dy + 110 + 24 * k, o, 16, "t m", inside=f"{box}-out", extra=f' data-out="{attr(o)}"')
        if cid == "time":
            s.text(x + 18, dy + 86 + 16 + 24 * len(outs) + 26, "실제 시계 숫자는 실행마다 다름(가짜 시계)", 16, "s", inside=box, extra=f' data-note="{attr(D_TIME_NOTE)}"')
        s.add("</g>")
        d_bot.append(dy + 86 + 16 + 24 * 2 + 44)
    for i in range(len(D_CONCERNS)):
        behind(s, d_at[i], 16 + i * (cw + 20), y, cw, max(d_bot) - y, f"d-{D_CONCERNS[i][0]}")
    y = max(d_bot) + 50
    for i, t in enumerate(FOOT):
        s.text(32, y + 26 * i, t, 16, "s")
    s.h = int(y + 26 * len(FOOT) + 8)
    s.save("decorator-flow-desktop.svg", DESC)


# ══ 휴대전화용 (360) ═════════════════════════════════════════════
def mobile():
    s = Svg(360, 0, TITLE + " · 휴대전화용", "m7")
    for i, t in enumerate(["여러 함수에 똑같이", "필요한 일을 매번 다시", "쓰지 않으려면?"]):
        s.text(12, 32 + 28 * i, t, 21, "t b")
    s.text(12, 112, "Scene 06 · Decorator와 공통 관심사", 14, "s")
    y = legend(s, 12, 132, 336, 14, mobile=True) + 36

    s.comment("그림 A")
    section_head(s, 12, y, "A", "같은 로그가 반복될 때", 17)
    s.text(12, y + 26, "원래 기능과 부가 기능 나누기", 14, "s")
    y += 42
    top = y
    left_at = len(s.body)
    s.text(16, y + 26, "반복되는 경우 · repeated_logs.py", 15, "t b", inside="a-left")
    yy = y + 40
    for fid, lines in A_LEFT:
        yy = code_block(s, 2, yy, 356, lines, 14, 22, f"a-left-{fid}", f"repeated_logs.py:{fid}", mobile=True) + 10
    s.text(16, yy + 14, "로그 줄 4개가 두 함수에 섞여 있음", 14, "t", inside="a-left")
    bot = yy + 30
    behind(s, left_at, 0, top, 360, bot - top, "a-left")
    y = bot + 16
    top = y
    right_at = len(s.body)
    s.text(16, y + 26, "분리한 경우 · log_decorator.py", 15, "t b", inside="a-right")
    s.rect(8, y + 40, 336, 134, "wrapB", 10, "rel-wrapper")
    s.text(22, y + 62, "log_calls(func) → wrapper", 14, "wrapT m", inside="rel-wrapper")
    for k, (part, code) in enumerate(A_WRAP):
        s.text(22, y + 88 + 26 * k, part, 14, "s b", inside="rel-wrapper")
        s.text(88, y + 88 + 26 * k, code, 14, "t" if part != "원래 함수" else "origT m", inside="rel-wrapper", extra=f' data-wrap="{attr(part)}={attr(code)}"')
    ry = y + 216
    for fid, lines in A_RIGHT:
        b = f"rel-fn-{fid}"
        bot2 = code_block(s, 8, ry, 336, lines, 14, 22, b, f"log_decorator.py:{fid}", rep_mark=False, mobile=True)
        if fid == "add_transaction":
            s.rel([(40, y + 174), (40, ry - 2)], "wrapper", f"fn-{fid}")
        else:
            s.rel([(344, y + 120), (350, y + 120), (350, ry + 18), (344, ry + 18)], "wrapper", f"fn-{fid}")
        ry = bot2 + 10
    s.text(56, y + 200, "@log_calls로 감쌈", 14, "refT2")
    s.text(16, ry + 14, "두 함수에는 원래 기능만", 14, "t b", inside="a-right")
    bot = ry + 30
    behind(s, right_at, 0, top, 360, bot - top, "a-right")
    y = bot + 12
    for k, t in enumerate(["Decorator만 정답은 아니다: 로그 함수를", "따로 만들거나 공통 호출 함수를 둘 수도 있다."]):
        s.text(12, y + 14 + 20 * k, t, 14, "s")
    y += 84

    s.comment("그림 B")
    section_head(s, 12, y, "B", "Decorator의 두 시점", 17)
    s.text(12, y + 26, "정의할 때 한 번, 호출할 때마다 · when_applied.py", 14, "s")
    y += 42
    s.rect(12, y, 336, 470, "area", 12, "b-def")
    s.text(24, y + 26, "정의 시점 · def 문을 실행할 때 한 번", 15, "areaH", inside="b-def")
    s.rect(20, y + 40, 320, 82, "code", 8, "b-def-code")
    s.text(30, y + 62, "@trace", 14, "t m b", inside="b-def-code")
    s.text(30, y + 84, "def greet(): …", 14, "t m", inside="b-def-code")
    s.text(30, y + 108, "= greet = trace(greet)", 14, "s", inside="b-def-code")
    s.rect(20, y + 150, 140, 64, "origB", 10, "call-orig0", extra=' data-bstep="def:1"')
    s.text(30, y + 174, ORIG_TAG, 14, "origT", inside="call-orig0")
    s.text(30, y + 198, "greet 객체", 14, "t m", inside="call-orig0")
    s.rect(200, y + 150, 140, 64, "card", 10, "call-trace", extra=' data-bstep="def:2"')
    s.text(210, y + 174, "trace", 14, "t m b", inside="call-trace")
    s.text(210, y + 198, "Decorator", 14, "s", inside="call-trace")
    s.rect(200, y + 262, 140, 64, "wrapB", 10, "call-wrap0")
    s.text(210, y + 286, WRAP_TAG, 14, "wrapT", inside="call-wrap0")
    s.text(210, y + 310, "func = 원래", 14, "t m", inside="call-wrap0")
    s.rect(20, y + 270, 120, 48, "callerB", 8, "rel-name0", extra=' data-bstep="def:3"')
    s.text(30, y + 300, "이름 greet", 14, "t m b", inside="rel-name0")
    s.call([(160, y + 170), (198, y + 170)], "orig0", "trace", "2")
    s.retline([(300, y + 214), (300, y + 260)], "trace", "wrap0")
    s.text(290, y + 242, "return wrapper", 14, "retT", "end")
    s.rel([(140, y + 294), (198, y + 294)], "name0", "wrap0")
    s.text(152, y + 340, "가리킴", 14, "refT2")
    s.step(150, y + 140, "1", 12, 14)
    s.step(180, y + 196, "2", 12, 14)
    s.step(32, y + 262, "3", 12, 14)
    sy = y + 352
    for n, what, note in B_DEF:
        box = f"bdef-{n}"
        s.rect(20, sy, 320, 34, "legend", 6, box)
        s.step(38, sy + 17, n, 12, 14)
        s.text(58, sy + 22, what, 14, "t m b", inside=box)
        sy += 38
    y += 470 + 16
    s.rect(12, y, 336, 470, "area", 12, "b-call")
    s.text(24, y + 26, "호출 시점 · greet()를 부를 때마다", 15, "areaH", inside="b-call")
    s.rect(20, y + 40, 120, 44, "callerB", 10, "call-caller", extra=' data-bstep="call:1"')
    s.text(32, y + 68, "greet()", 14, "t m b", inside="call-caller")
    s.rect(20, y + 116, 320, 250, "wrapB", 12, "call-wrap1")
    s.text(32, y + 140, WRAP_TAG + " (greet가 가리킴)", 14, "wrapT", inside="call-wrap1")
    s.rect(32, y + 152, 296, 36, "legend", 6, "call-front", extra=' data-bstep="call:2"')
    s.text(64, y + 175, "앞부분", 14, "t b", inside="call-front")
    s.rect(130, y + 214, 198, 80, "origB", 10, "call-orig1", extra=' data-bstep="call:3"')
    s.text(142, y + 238, ORIG_TAG + " = func", 14, "origT", inside="call-orig1")
    s.text(142, y + 262, "greet 본문", 14, "t m", inside="call-orig1")
    s.rect(32, y + 318, 296, 36, "legend", 6, "call-back", extra=' data-bstep="call:4"')
    s.text(64, y + 341, "뒤부분", 14, "t b", inside="call-back")
    s.call([(80, y + 84), (80, y + 114)], "caller", "wrap1", "1")
    s.call([(200, y + 188), (200, y + 212)], "front", "orig1", "3")
    s.retline([(280, y + 294), (280, y + 316)], "orig1", "back")
    s.text(270, y + 310, "return", 14, "retT", "end")
    s.step(104, y + 100, "1", 12, 14)
    s.step(46, y + 170, "2", 12, 14)
    s.step(176, y + 200, "3", 12, 14)
    s.step(46, y + 336, "4", 12, 14)
    code = ["[호출 시점] wrapper 앞 (greet)", "  [greet 본문] 안녕하세요", "[호출 시점] wrapper 뒤 (greet)"]
    s.rect(20, y + 378, 320, 16 + 22 * 3, "code", 8, "b-call-out")
    for k, ln in enumerate(code):
        s.text(30, y + 402 + 22 * k, ln, 14, "t m", inside="b-call-out", extra=f' data-out="{attr(ln)}"')
    y += 470 + 12
    s.rect(12, y, 336, 92, "legend", 10, "b-note")
    s.text(22, y + 24, "정의 시점 출력 1번 · greet()를 두 번", 14, "t b", inside="b-note")
    s.text(22, y + 46, "부르면 호출 시점 출력이 두 번", 14, "t b", inside="b-note")
    s.add(f'<g data-out="{attr(B_DEF_OUT)}">')
    s.text(22, y + 72, "[정의 시점] trace(greet) 실행 …", 14, "s m", inside="b-note")
    s.add("</g>")
    y += 92 + 50

    s.comment("그림 C")
    section_head(s, 12, y, "C", "예외 처리의 세 경로", 17)
    s.text(12, y + 26, "handle_app_errors · error_decorator.py", 14, "s")
    y += 42
    for pid, name, call, result, wrap_does, got, outs in C_PATHS:
        s.add(f'<g data-path="{pid}">')
        h = 380
        s.rect(12, y, 336, h, "card", 12, f"c-{pid}")
        s.text(24, y + 26, name, 15, "t b", inside=f"c-{pid}")
        s.rect(20, y + 40, 320, 44, "callerB", 8, f"call-{pid}-caller")
        s.text(30, y + 68, "호출: " + call, 14, "t m", inside=f"call-{pid}-caller")
        s.rect(20, y + 116, 320, 76, "wrapB", 8, f"call-{pid}-wrap")
        s.text(30, y + 138, WRAP_TAG, 14, "wrapT", inside=f"call-{pid}-wrap")
        wl = wrap_does.split(" · ") if " · " in wrap_does else wrap_does.split(" → ")
        for k, ln in enumerate(wl):
            s.text(30, y + 160 + 22 * k, ln if k == 0 or " · " in wrap_does else "→ " + ln, 14, "t" if pid != "propagate" or not k else "excT", inside=f"call-{pid}-wrap")
        s.rect(20, y + 224, 320, 56, "origB", 8, f"call-{pid}-orig")
        s.text(30, y + 246, ORIG_TAG, 14, "origT", inside=f"call-{pid}-orig")
        s.text(30, y + 268, result, 14, "t m b" if pid == "ok" else "excT m", inside=f"call-{pid}-orig")
        s.call([(60, y + 84), (60, y + 114)], f"{pid}-caller", f"{pid}-wrap", "1")
        s.call([(60, y + 192), (60, y + 222)], f"{pid}-wrap", f"{pid}-orig", "2")
        s.step(84, y + 100, "1", 12, 14)
        s.step(84, y + 208, "2", 12, 14)
        if pid == "ok":
            s.retline([(300, y + 222), (300, y + 194)], f"{pid}-orig", f"{pid}-wrap")
            s.retline([(300, y + 114), (300, y + 86)], f"{pid}-wrap", f"{pid}-caller")
        elif pid == "handled":
            s.exc([(300, y + 222), (300, y + 194)], f"{pid}-orig", f"{pid}-wrap", "exc")
            s.retline([(300, y + 114), (300, y + 86)], f"{pid}-wrap", f"{pid}-caller")
        else:
            s.exc([(344, y + 252), (344, y + 62), (342, y + 62)], f"{pid}-orig", f"{pid}-caller", "exc2")
        gy = y + 292
        s.rect(20, gy, 320, 78, "code", 8, f"c-{pid}-got")
        s.text(30, gy + 22, "받는 것: " + got, 14, "t b", inside=f"c-{pid}-got", extra=f' data-got="{attr(got)}"')
        for k, o in enumerate(outs):
            s.add(f'<g data-out="{attr(o)}">')
            if pid == "ok":
                s.text(30, gy + 46, "정상 → 결과:", 14, "t m", inside=f"c-{pid}-got")
                s.text(30, gy + 68, "{'id': 1, …}", 14, "t m", inside=f"c-{pid}-got")
            elif pid == "propagate":
                s.text(30, gy + 46, "처리 범위 밖 예외는 전파 →", 14, "t m", inside=f"c-{pid}-got")
                s.text(30, gy + 68, "KeyError 'amount'", 14, "t m b", inside=f"c-{pid}-got")
            else:
                s.text(30, gy + 46 + 22 * k, o, 14, "t m", inside=f"c-{pid}-got")
            s.add("</g>")
        s.add("</g>")
        y += h + 12
    for k, t in enumerate(["모든 예외를 잡으면 프로그램 결함", "(KeyError)까지 사용자 오류처럼 숨는다", "→ 미리 예상한 AppError만 받는다."]):
        s.text(12, y + 14 + 20 * k, t, 14, "t b" if k == 2 else "t")
    y += 110

    s.comment("그림 D")
    section_head(s, 12, y, "D", "공통 관심사 세 가지", 17)
    s.text(12, y + 26, "같은 원리, 다른 일", 14, "s")
    y += 42
    for i, (cid, name, demo, front, call, back, exc, ret, duty, outs) in enumerate(D_CONCERNS):
        box = f"d-{cid}"
        s.add(f'<g data-concern="{cid}">')
        h = 40 + 30 + 5 * 58 + 56 + 30 + 16 + 22 * len(outs) + (26 if cid == "time" else 0) + 14
        s.rect(12, y, 336, h, "card", 12, box)
        s.text(24, y + 26, name, 16, "t b", inside=box)
        s.text(336, y + 26, demo, 14, "s m", "end", inside=box)
        s.rect(20, y + 40, 320, 30 + 5 * 58, "wrapB", 10, f"{box}-wrap")
        s.text(30, y + 60, WRAP_TAG, 14, "wrapT", inside=f"{box}-wrap")
        ry = y + 70
        for (label, idx) in D_ROWS:
            val = D_CONCERNS[i][idx]
            rb = f"{box}-r{idx}"
            cls = "origB" if label == "원래 함수 호출" else "legend"
            s.rect(28, ry, 304, 52, cls, 6, rb, extra=f' data-row="{attr(label)}={attr(val)}"')
            s.text(38, ry + 20, label, 14, "s b" if cls == "legend" else "origT", inside=rb)
            s.text(38, ry + 42, val, 14, "t m" if any(c in val for c in ("func", "clock", "try", "except")) else "t", inside=rb)
            ry += 58
        dy = y + 40 + 30 + 5 * 58 + 12
        s.rect(20, dy, 320, 44, "origB", 8, f"{box}-duty")
        s.text(30, dy + 28, "원래 함수의 책임: " + duty, 14, "origT", inside=f"{box}-duty", extra=f' data-duty="{attr(duty)}"')
        oy = dy + 56
        s.text(24, oy + 14, "실제 출력", 14, "s b", inside=box)
        s.rect(20, oy + 24, 320, 16 + 22 * len(outs), "code", 8, f"{box}-out")
        for k, o in enumerate(outs):
            s.text(30, oy + 46 + 22 * k, o, 14, "t m", inside=f"{box}-out", extra=f' data-out="{attr(o)}"')
        if cid == "time":
            s.text(24, oy + 24 + 16 + 22 * len(outs) + 22, "실제 시계 숫자는 실행마다 다름(가짜 시계)", 14, "s", inside=box, extra=f' data-note="{attr(D_TIME_NOTE)}"')
        s.add("</g>")
        y += h + 12
    y += 30
    for i, t in enumerate(FOOT_M):
        s.text(12, y + 22 * i, t, 14, "s")
    s.h = int(y + 22 * len(FOOT_M) + 4)
    s.save("decorator-flow-mobile.svg", DESC)


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
