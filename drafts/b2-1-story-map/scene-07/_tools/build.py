"""B2-1 Scene 07 (Parameter·Argument·Type Hint·값 검증) 노트북·휴대전화 SVG 생성기.

Scene 06 생성기(../../scene-06/_tools/build.py)의 그리기 도구를 불러 쓴다(그 안에서 Scene 05·04·03-B·03-A·02·01 도구도 쓴다). 일곱 파일은 바꾸지 않는다.
그림의 코드 줄·연결·실행 결과·종료 코드는 _tools/demo/의 실제 소스와 실행 결과이며, verify_demo.py가 대조한다.

시각 약속(Scene 01~06 약속 유지 + 이번 추가):
- 실제 실행 순서 = 검은 번호 원 + 진한 실선·채운 화살촉 (그림 C에서만, 경우마다 번호를 따로 매김)
- return = 회색 가는 실선·빈 화살촉·'return' 글자, 번호 없음(Scene 03-A)
- 예외 = 빨간 파선. 처리되는 예외는 긴 파선, 전파되는 예외는 짧은 점선(Scene 06)
- 변환 = 청록 실선 + 청록 화살촉, 번호 없음(Scene 04) — argparse type=int의 '10' → 10
- 연결(Argument → Parameter) = 보라 점선, 화살촉·번호 없음(관계, 순서 아님)
- Parameter = 초록 테두리 칸 + 초록 밑줄 이름, Argument = 갈색 테두리 칩 + 갈색 값(글자 'Parameter'·'Argument'를 범례와 머리글에 씀)
- Type Hint 표시 = 파란 글자 + 연한 파란 바탕(그림 B), 실행 중 '표시만' 하는 자리 = 파란 파선 테두리 + '표시만' 글자(그림 C)
- 실행되지 않은 단계 = 회색 점선 테두리 + '실행되지 않음' 글자
- 그림 A·B·D에는 번호 원을 쓰지 않는다. 색만으로 구분하지 않는다.

실행: python -I build.py  (출력: ../type-hint-flow-desktop.svg, ../type-hint-flow-mobile.svg)
"""
import importlib.util
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location("scene06_build", os.path.join(HERE, "..", "..", "scene-06", "_tools", "build.py"))
b6 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(b6)
b5, b4, b3, s3, s2, s1 = b6.b5, b6.b4, b6.b3, b6.s3, b6.s2, b6.s1
tw, esc, attr, section_head, behind = s1.tw, s1.esc, b4.attr, s1.section_head, b5.behind

# ── 내용 (노트북·휴대전화 공통) ────────────────────────────────
TITLE = "amount: int라고 적으면 잘못된 값을 막을 수 있을까?"
SUB = "Parameter와 Argument → Type Hint는 표시 → argparse type=int는 변환 → 실제 검증은 코드가"

# 그림 A: parameter_argument.py — 코드 조각(글자, 종류[, 연결되는 Parameter]). 종류: c 코드 · k 예약어 · p Parameter 이름 · a Argument
A_DEF = [("def ", "k"), ("calculate_total(", "c"), ("price", "p"), (", ", "c"), ("quantity", "p"), ("):", "c")]
A_DEF_DEFAULT = [("def ", "k"), ("calculate_total(", "c"), ("price", "p"), (", ", "c"), ("quantity", "p"), ("=1):", "c")]
A_CASES = [
    ("pos", "위치 인자 — 앞에서부터 차례로", [("calculate_total(", "c"), ("1000", "a", "price"), (", ", "c"), ("3", "a", "quantity"), (")", "c")],
     {"price": "1000", "quantity": "3"}, ["  연결: price=1000, quantity=3", "  결과: 3000"], "순서대로: 첫째 값 → price, 둘째 값 → quantity"),
    ("kw", "키워드 인자 — 이름으로", [("calculate_total(", "c"), ("quantity", "p"), ("=", "c"), ("3", "a", "quantity"), (", ", "c"), ("price", "p"), ("=", "c"), ("1000", "a", "price"), (")", "c")],
     {"price": "1000", "quantity": "3"}, ["  연결: price=1000, quantity=3", "  결과: 3000"], "이름이 자리를 정함: 적은 순서가 달라도 같은 연결"),
    ("swap", "위치 인자의 순서를 바꾸면", [("calculate_total(", "c"), ("3", "a", "price"), (", ", "c"), ("1000", "a", "quantity"), (")", "c")],
     {"price": "3", "quantity": "1000"}, ["  연결: price=3, quantity=1000", "  결과: 3000"], "결과는 같아도 price에 3이 들어감 → 순서가 뜻을 정함"),
    ("default", "기본값이 있는 Parameter", [("calculate_total(", "c"), ("1000", "a", "price"), (")", "c")],
     {"price": "1000", "quantity": "1"}, ["  연결: price=1000, quantity=1", "  결과: 1000"], "quantity를 생략 → 기본값 1 (Argument 없음)"),
]
A_ERR = "Argument가 모자라면 → TypeError: calculate_total() missing 1 required positional argument: 'quantity'"

# 그림 B: type_hint_basics.py — 두 함수의 실제 소스 줄(함수 안 줄 번호, 조각)
B_PLAIN = ("calculate_total_no_hint", [("1", [("def ", "k"), ("calculate_total_no_hint(", "c"), ("price", "p"), (", ", "c"), ("quantity", "p"), ("):", "c")]),
                                       ("2", [("    ", "c"), ("return", "k"), (" price * quantity", "c")])])
B_HINT = ("calculate_total", [("1", [("def ", "k"), ("calculate_total(", "c"), ("price", "p"), (": int", "h"), (", ", "c"), ("quantity", "p"), (": int", "h"),
                                     (") ", "c"), ("-> int", "h"), (":", "c")]),
                              ("2", [("    ", "c"), ("return", "k"), (" price * quantity", "c")])])
B_PARTS = [  # (표시, 무엇인가, 실행 중 하는 일)
    ("price: int · quantity: int", "Parameter Type Hint — 받을 값의 기대 타입", "검사·변환하지 않음"),
    ("-> int", "반환 Type Hint — 돌려줄 값의 기대 타입", "검사·변환하지 않음"),
    ("return price * quantity", "return 문 — 실제로 값을 돌려주는 실행 문장", "실행됨"),
]
B_OUT_PLAIN = ["힌트 없음 (1000, 3) → 3000", '힌트 없음 ("1000", 3) → \'100010001000\'']
B_OUT_HINT = ["힌트 있음 (1000, 3) → 3000", '힌트 있음 ("1000", 3) → \'100010001000\'']
B_SAME = "두 함수의 실행 결과는 같다 — Type Hint를 붙여도 실행 동작은 바뀌지 않는다"
B_GAIN_PLAIN = ["읽는 사람: 본문·이름을 읽고 기대 형식을 짐작", "도구: 기대 형식 정보가 없어 알려 줄 것이 적음"]
B_GAIN_HINT = ["읽는 사람: 정의 한 줄로 기대 입력·출력을 앎", "도구: \"1000\" 같은 불일치를 실행 전에 알려 줄 수 있음"]
B_GAIN_NOTE = "도구가 무엇을 알려 주는지는 종류·설정·코드에 따라 다르다(이 장면은 검사기를 실행하지 않았다)."
B_ANN = ["보관된 힌트: {'price': <class 'int'>, 'quantity': <class 'int'>, 'return': <class 'int'>}", "힌트 없는 함수: {}"]

# 그림 C: argparse_vs_hint.py — (경우 id, 명령, 단계 상태, 각 단계 글자, 실제 출력, 종료 코드, 끝 선 종류·글자)
C_CMD = "python argparse_vs_hint.py --limit {}"
C_STAGES = [("cli", "명령줄 입력", "문자열"), ("parse", "argparse · type=int", "변환"),
            ("call", "서비스 함수 호출", "Type Hint는 표시"), ("check", "범위 검증", "실제 검사")]
C_CASES = [
    ("ok", "10", "성공", {"cli": "ok", "parse": "ok", "call": "ok", "check": "ok"},
     {"parse": ("'10'", "10", "int('10') → 10"), "check": ("10 <= 0 → False", "통과 → 마지막 10건을 return")},
     ["[CLI] args.limit = 10 (int)", "[목록] 10건: 거래 3 … 거래 12"], 0, ("ret", "check", "return 10건")),
    ("bad", "abc", "변환 실패", {"cli": "ok", "parse": "fail", "call": "skip", "check": "skip"},
     {"parse": ("'abc'", None, "int('abc') 실패")},
     ["usage: argparse_vs_hint.py [-h] [--limit LIMIT]", "argparse_vs_hint.py: error: argument --limit: invalid int value: 'abc'"], 2,
     ("exc2", "parse", "SystemExit(2) · argparse가 출력하고 종료")),
    ("neg", "-2", "범위 검증 실패", {"cli": "ok", "parse": "ok", "call": "ok", "check": "fail"},
     {"parse": ("'-2'", "-2", "int('-2') → -2"), "check": ("-2 <= 0 → True", "raise ValueError")},
     ["[CLI] args.limit = -2 (int)", "[오류] limit는 양수여야 합니다 (받은 값: -2)"], 1,
     ("exc", "check", "raise ValueError → main()의 except가 받음")),
]
C_NOTE = ["type=int는 문자열을 정수로 바꾸고(실패하면 argparse가 종료 코드 2로 끝냄), limit: int는 아무것도 검사하지 않으며,",
          "음수·0을 막는 것은 if limit <= 0 검증 코드다. argparse의 오류(사용법·종료 코드 2)와 서비스의 업무 오류([오류]·종료 코드 1)는 출처가 다르다."]

# 그림 D: hint_not_validation.py · runtime_validation.py — (넣은 값, 선언 기준 판단, 보충, 표시만 결과, 검증 결과)
D_ROWS = [
    ("1000", "int · 기대와 맞음", "", "set_amount(1000) → 1000 (int)", "set_amount(1000) → 1000"),
    ("'1000'", "str · 기대와 다름", "도구가 알려 줄 수 있음", "set_amount('1000') → '1000' (str)", "set_amount('1000') → 거부: 금액은 정수여야 합니다"),
    ("-5", "int · 기대와 맞음", "범위는 선언이 말하지 않음", "set_amount(-5) → -5 (int)", "set_amount(-5) → 거부: 금액은 0보다 커야 합니다"),
    ("True", "bool · 기대와 맞음", "bool은 int의 하위 클래스", "set_amount(True) → True (bool)", "set_amount(True) → 거부: 금액은 정수여야 합니다"),
    ("3.5", "float · 기대와 다름", "도구가 알려 줄 수 있음", "set_amount(3.5) → 3.5 (float)", "set_amount(3.5) → 거부: 금액은 정수여야 합니다"),
    ("None", "None · 기대와 다름", "도구가 알려 줄 수 있음", "set_amount(None) → None (NoneType)", "set_amount(None) → 거부: 금액은 정수여야 합니다"),
]
# 비교 카드: (id, 표현, 뜻, 실제 실행 결과 줄, 데모, 한 줄 정리)
D_CARDS = [
    ("optional", "str | None", "문자열 또는 None을 기대", ["greet(None) → 안녕하세요, None", "greet_optional(None) → 안녕하세요, 친구"], "none_and_defaults.py",
     "name: str = \"친구\"도 None을 막지 않음 · None 처리는 if name is None"),
    ("list", "list[str]", "원소가 문자열인 리스트를 기대", ["count_tags(['식비', 3]) → 2", "join_tags(['식비', 3]) → TypeError: sequence item 1: expected str instance, int found"],
     "typing_contract.py", "원소를 검사하지 않음 · TypeError는 join()이 냄"),
    ("union", "int | str", "정수 또는 문자열을 기대", ["to_amount('1000') → 1000", "to_amount(3.9) → 3"], "typing_contract.py",
     "float도 막지 않음 · int()가 소수점 아래를 버림"),
    ("none", "-> None", "의미 있는 값을 돌려주지 않도록 의도", ["show_total(8000)이 돌려준 값 → None"], "typing_contract.py",
     "return이 없으면 None · 힌트가 만든 결과가 아님"),
]
D_NOTE = "Type Hint는 기대하는 형태를 적은 것이다. 규칙(정수만·0보다 큼)을 지키게 하려면 그 규칙을 검사하는 코드를 써야 한다."

FOOT = [
    "모든 예제는 Scene 07 학습용 예제입니다(_tools/demo/의 파일 9개, 표준 라이브러리만). 실제 미션 구현이나 정답이 아닙니다.",
    "그림의 코드 줄·연결·실행 결과·종료 코드는 예제를 실제로 실행해 확인했습니다(Python 3.12.13). 타입 검사기는 실행하지 않았습니다.",
]
FOOT_M = ["모든 예제는 Scene 07 학습용 예제입니다.", "실제 미션 구현이나 정답이 아닙니다.", "코드·연결·출력은 실제 실행으로 확인했습니다."]
DESC = (
    "Scene 07. 그림 A는 Parameter(함수 정의에 적은 받는 자리 price, quantity)와 Argument(호출할 때 넣은 값)의 연결이다. "
    "위치 인자 calculate_total(1000, 3)은 순서대로 price=1000, quantity=3, 키워드 인자 calculate_total(quantity=3, price=1000)은 이름으로 같은 연결, "
    "순서를 바꾼 calculate_total(3, 1000)은 결과 3000은 같지만 price=3, quantity=1000으로 뜻이 바뀌고, 기본값이 있는 정의에서 calculate_total(1000)은 quantity가 기본값 1이다. "
    "기본값이 없는 정의에서 Argument가 모자라면 TypeError다. "
    "그림 B는 Type Hint가 없는 함수와 있는 함수(price: int, quantity: int, -> int)를 같은 Argument로 실행한 결과가 같음을 보인다(1000, 3은 3000, 문자열 1000과 3은 100010001000). "
    "Type Hint는 읽는 사람과 도구에 기대 형식을 알려 주고 Python은 __annotations__에 보관만 한다. "
    "그림 C는 --limit 10, abc, -2가 명령줄 입력, argparse type=int 변환, 서비스 함수 호출(limit: int는 표시만), 범위 검증 if limit <= 0을 거치는 과정이다. "
    "10은 모두 통과해 종료 코드 0, abc는 변환에서 실패해 argparse가 사용법과 오류를 출력하고 종료 코드 2(뒤 단계는 실행되지 않음), "
    "-2는 변환과 호출을 통과하고 범위 검증에서 ValueError가 나 main이 [오류]를 출력하고 종료 코드 1이다. "
    "그림 D는 같은 입력 1000, '1000', -5, True, 3.5, None을 선언 amount: int 기준과 실제 실행으로 비교한다. 타입 표시만 있는 함수는 모두 그대로 돌려주고, "
    "검증 코드가 있는 함수는 1000만 통과시키고 나머지를 거부한다. -5와 True는 선언상 int와 맞지만 업무 규칙으로 거부된다. "
    "비교 카드: str | None, list[str], int | str, -> None은 기대 형태를 표시할 뿐 실행 중 자동으로 검사하지 않는다."
)

EXTRA = """      .argB { fill: #fdf1e4; stroke: #8a4100; stroke-width: 1.6; }
      .parB { fill: #f2f9f4; stroke: #17663f; stroke-width: 2; }
      .hl { fill: #dde9f8; }
      .hintT { fill: #1d4f91; font-weight: 700; }
      .hintTag { fill: #f3f7fd; stroke: #1d4f91; stroke-width: 1.6; stroke-dasharray: 6 4; }
      .skip { fill: #f6f7f9; stroke: #9aa5b1; stroke-width: 1.4; stroke-dasharray: 3 4; }
      .skipT { fill: #6b7682; }
      .stage { fill: #ffffff; stroke: #5b6672; stroke-width: 1.6; }
      .stageF { fill: #fdf3f3; stroke: #9b2c2c; stroke-width: 2.2; }
      .svc { fill: #eef3fa; stroke: #1d4f91; stroke-width: 1.8; }
      .chk { fill: #f7f9fb; stroke: #1b2733; stroke-width: 2; }
      .strC { fill: #ffffff; stroke: #8a96a3; stroke-width: 1.4; }
      .intC { fill: #e6f4f1; stroke: #0f6e6e; stroke-width: 1.6; }
      .okT { fill: #17663f; font-weight: 700; }
      .th2 { fill: #f3f5f8; stroke: #c9d2dc; stroke-width: 1; }
      .cell { fill: #ffffff; stroke: #d5dce4; stroke-width: 1; }
      .same { fill: #e9f1fc; stroke: #1d4f91; stroke-width: 1.4; }
"""
SEG = {"c": "t m", "k": "kw m", "p": "par m", "a": "arg m", "h": "hintT m", "n": "s", "e": "excT m"}
STAGE_CLS = {"cli": "callerB", "parse": "stage", "call": "svc", "check": "chk"}


class Svg(b6.Svg):
    def segs(self, x, y, segs, size, inside, extra=""):
        """코드 한 줄을 조각마다 따로 위치를 정한 text로 그리고(칩·강조 상자가 글자와 어긋나지 않게), 조각마다 (시작 x, 끝 x)를 돌려준다.
        고정폭 0.6em 기준. 공백만 있는 조각(들여쓰기)은 자리만 차지한다. extra 속성은 줄 전체를 묶는 g에 붙는다."""
        pos, cx = [], x
        self.add(f"<g{extra}>")
        for seg in segs:
            t, k = seg[0], seg[1]
            w = tw(t, size, mono=(k != "n"))
            if t.strip():
                self.text(cx, y, t, size, SEG[k], inside=inside)
            pos.append((cx, cx + w))
            cx += w
        self.add("</g>")
        return pos

    def save(self, name, desc):
        tid, did = f"{self.idp}-title", f"{self.idp}-desc"
        style = s1.STYLE.replace("    </style>", s2.EXTRA_STYLE + s3.EXTRA + b3.EXTRA + b4.EXTRA + b5.EXTRA + b6.EXTRA + EXTRA + "    </style>")
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
                f'<path d="M0 0L10 5L0 10Z" fill="#9b2c2c"/></marker>\n'
                f'    <marker id="{self.idp}-cv" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#0f6e6e"/></marker>\n  </defs>\n'
                f'  <rect width="{self.w}" height="{self.h}" fill="#ffffff"/>\n')
        body = "\n".join("  " + b for b in self.body)
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(head + body + "\n</svg>\n")


def legend(s, x, y, w, size, mobile=False):
    lines = [("flow", "번호·검은 선 = 실제 실행 순서(그림 C)"), ("ret", "회색 선 = return(번호 없음)"),
             ("exc", "빨간 긴 파선 = 처리되는 예외"), ("exc2", "빨간 점선 = 전파되는 예외·종료"),
             ("conv", "청록 선 = 값 변환(번호 없음)"), ("ref", "보라 점선 = Argument → Parameter 연결(순서 아님)")]
    marker = {"flow": "arr", "ret": "ret", "exc": "ex", "exc2": "ex", "conv": "cv", "ref": None}

    def sample(x0, yy, cls, x1):
        if cls == "flow":
            s.step(x0 + 8, yy, "1", 12 if mobile else 13, size)
            s.add(f'<path d="M{x0 + 24} {yy}H{x1}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
        else:
            m = f' marker-end="url(#{s.idp}-{marker[cls]})"' if marker[cls] else ""
            s.add(f'<path d="M{x0} {yy}H{x1}" class="{cls}"{m}/>')

    if mobile:
        h = 20 + 32 * len(lines) + 4 * 40
        s.rect(x, y, w, h, "legend", 12)
        yy = y + 24
        for cls, label in lines:
            sample(x + 12, yy, cls, x + 64)
            s.text(x + 76, yy + 5, label if cls != "ref" else "보라 점선 = 값 → 자리 연결", size)
            yy += 32
        for cls, tag, label, box in (("parB", "price", "Parameter = 받는 자리", "lg-par"), ("argB", "1000", "Argument = 넣은 값", "lg-arg"),
                                     ("hintTag", "표시만", "Type Hint = 표시(검사 없음)", "lg-hint"), ("skip", "실행되지 않음", "그 단계까지 가지 않음", "lg-skip")):
            bw = tw(tag, size, mono=cls in ("parB", "argB")) + 20
            s.rect(x + 12, yy - 14, bw, 28, cls, 6 if cls != "argB" else 14, box)
            s.text(x + 22, yy + 5, tag, size, {"parB": "par m", "argB": "arg m", "hintTag": "hintT", "skip": "skipT"}[cls], inside=box)
            s.text(x + 22 + bw + 4, yy + 5, label, size)
            yy += 40
        return y + h
    s.rect(x, y, w, 140, "legend", 12)
    xx, yy = x + 16, y + 30
    for k, (cls, label) in enumerate(lines):
        sample(xx, yy - 6, cls, xx + 56)
        s.text(xx + 68, yy, label, size)
        xx += 68 + tw(label, size) + 20
        if k == 3:
            xx, yy = x + 16, yy + 40
    xx, yy = x + 16, yy + 44
    for cls, tag, label, box in (("parB", "price", "Parameter", "lg-par"), ("argB", "1000", "Argument", "lg-arg"),
                                 ("hintTag", "표시만", "", "lg-hint"), ("skip", "실행되지 않음", "", "lg-skip")):
        bw = tw(tag, size, mono=cls in ("parB", "argB")) + 20
        s.rect(xx, yy - 22, bw, 30, cls, 6 if cls != "argB" else 15, box)
        s.text(xx + 10, yy - 2, tag, size, {"parB": "par m", "argB": "arg m", "hintTag": "hintT", "skip": "skipT"}[cls], inside=box)
        xx += bw + 8
        if label:
            s.text(xx, yy - 2, label, size, "s b")
            xx += tw(label, size) + 18
        else:
            xx += 10
    s.text(xx + 4, yy - 2, "= 테두리·글자로 구분(색만으로 구분하지 않음)", size, "s")
    return y + 140


def chip(s, x0, y, pos, size, cls, box, extra=""):
    """코드 조각 하나 뒤에 칩 상자를 그린다(텍스트 앞에 넣도록 호출한 쪽에서 순서를 맞춘다)."""
    a, b = pos
    s.rect(a - 1.5, y - size * 0.95, b - a + 3, size * 1.42, cls, 6 if cls == "argB" else 4, box, extra)
    return (a - 1.5, y - size * 0.95, b - a + 3, size * 1.42)


def a_card(s, x, y, w, case, size, mobile):
    """그림 A의 경우 하나. 높이를 돌려준다."""
    cid, title, call, bind, outs, note = case
    box = f"a-{cid}"
    at = len(s.body)
    s.add(f'<g data-case="{cid}" data-call-expr="{attr("".join(t[0] for t in call))}" data-bind="{attr(", ".join(f"{k}={v}" for k, v in bind.items()))}">')
    s.text(x + 14, y + 28, title, size + 1, "t b", inside=box)
    yy = y + 28 + (34 if not mobile else 30)
    if cid == "default":
        s.text(x + 14, yy, "정의:", size, "s b", inside=box)
        if mobile:
            s.segs(x + 14 + tw("정의: ", size), yy, A_DEF_DEFAULT[:2], size, box)
            yy += size + 10
            s.segs(x + 14, yy, [("        ", "c")] + A_DEF_DEFAULT[2:], size, box)
        else:
            s.segs(x + 14 + tw("정의: ", size), yy, A_DEF_DEFAULT, size, box)
    else:
        s.text(x + 14, yy, "정의: 위와 같음(기본값 없음)", size, "s", inside=box)
    yy += 34 if not mobile else 30
    s.text(x + 14, yy, "호출:", size, "s b", inside=box)
    cx = x + 14 + tw("호출: ", size)
    segs = call
    lines = [segs]
    if mobile:  # 휴대전화: 'calculate_total(' 다음 줄에 Argument
        lines = [[segs[0]], [("    ", "c")] + segs[1:]]
    chips = {}
    for li, ln in enumerate(lines):
        ly = yy + li * (size + 10)
        lx = cx if li == 0 else x + 14
        insert_at = len(s.body)
        pos = s.segs(lx, ly, ln, size, box)
        for seg, p in zip(ln, pos):
            if seg[1] == "a":
                r = chip(s, lx, ly, p, size, "argB", f"{box}-arg-{seg[2]}")
                s.body.insert(insert_at, s.body.pop())
                chips[seg[2]] = r
    yy += (len(lines) - 1) * (size + 10)
    sy = yy + (46 if not mobile else 40)
    sw = (w - 28 - 16) / 2
    slots = {}
    for k, pname in enumerate(("price", "quantity")):
        sx = x + 14 + k * (sw + 16)
        sbox = f"{box}-par-{pname}"
        s.rect(sx, sy, sw, size + 18, "parB", 6, sbox)
        val = bind[pname]
        segs2 = [(pname, "p"), (" ← ", "c"), (val, "a")]
        if cid == "default" and pname == "quantity" and not mobile:
            segs2.append((" 기본값", "n"))
        s.segs(sx + 10, sy + size + 5, segs2, size, sbox)
        slots[pname] = (sx, sy, sw)
    for pname, (cx0, cy0, cw0, ch0) in chips.items():
        sx, sy0, sw0 = slots[pname]
        s.rel([(cx0 + cw0 / 2, cy0 + ch0), (sx + sw0 / 2, sy0)], f"{box}-arg-{pname}", f"{box}-par-{pname}")
    oy = sy + size + 18 + 14
    ob = f"{box}-out"
    s.rect(x + 14, oy, w - 28, 12 + (size + 8) * len(outs), "code", 8, ob)
    for k, o in enumerate(outs):
        s.text(x + 24, oy + (size + 8) * (k + 1) - 2, o, size, "t m", inside=ob, extra=f' data-out="{attr(o)}"')
    ny = oy + 12 + (size + 8) * len(outs) + size + 8
    s.text(x + 14, ny, note, size, "t b" if cid == "swap" else "s", inside=box)
    s.add("</g>")
    h = ny + 16 - y
    behind(s, at, x, y, w, h, box)
    return h


def mw(t, size):
    """고정폭 글꼴의 줄 너비 어림값. 한글은 고정폭 글꼴에 없어 대체 글꼴로 그려지므로 1em으로 센다."""
    return sum(size * (1.0 if ord(ch) > 0x2E80 else 0.6) for ch in t)


def wrap_words(t, size, limit, indent="  "):
    """낱말 단위로 줄을 나눈다(괄호 묶음은 나누지 않음). 첫 줄의 앞 공백은 지키고, 둘째 줄부터 indent를 붙인다."""
    lead = t[: len(t) - len(t.lstrip(" "))]
    words = re.findall(r"\([^)]*\)|\S+", t.strip())
    lines, cur = [], lead
    for word in words:
        cand = word if not cur.strip() else cur + " " + word
        cand = cand if cur.strip() else cur + word
        if cur and mw((indent if lines else "") + cand, size) > limit:
            lines.append(cur)
            cur = word
        else:
            cur = cand
    lines.append(cur)
    return [lines[0]] + [indent + ln for ln in lines[1:]]


WRAP = {  # 칸보다 긴 실제 출력 줄을 뜻이 끊기지 않는 곳에서 나눈 모양(이어 붙이면 원래 줄과 같음 — verify_demo.py가 대조)
    "argparse_vs_hint.py: error: argument --limit: invalid int value: 'abc'": ["argparse_vs_hint.py: error:", "  argument --limit:", "  invalid int value: 'abc'"],
    "usage: argparse_vs_hint.py [-h] [--limit LIMIT]": ["usage: argparse_vs_hint.py", "  [-h] [--limit LIMIT]"],
    "[오류] limit는 양수여야 합니다 (받은 값: -2)": ["[오류] limit는 양수여야 합니다", "  (받은 값: -2)"],
    "join_tags(['식비', 3]) → TypeError: sequence item 1: expected str instance, int found":
        ["join_tags(['식비', 3]) →", "  TypeError: sequence item 1:", "  expected str instance, int found"],
    "TypeError: calculate_total() missing 1 required positional argument: 'quantity'":
        ["TypeError: calculate_total()", "  missing 1 required positional", "  argument: 'quantity'"],
}


def out_lines(o, size, limit):
    """한 줄 실행 결과가 칸보다 길면 나눈다(실제 출력은 한 줄, data-out은 원래 줄). 정해 둔 모양(WRAP)이 먼저다."""
    if mw(o, size) <= limit:
        return [o]
    if o in WRAP:
        return WRAP[o]
    if " → " not in o:
        return wrap_words(o, size, limit)
    left, right = o.split(" → ", 1)
    return [left + " →"] + wrap_words("  " + right, size, limit, "    ")


def code_rows(s, x, y, w, rows, size, step, box, src=None, wrap=None):
    """소스 줄 상자. rows = [(줄 번호, 조각)]. wrap이 있으면 휴대전화용으로 줄을 나눠 그린다(data-line은 같고 data-part를 붙임)."""
    shown = []
    for no, segs in rows:
        parts = wrap.get(no, [segs]) if wrap else [segs]
        shown += [(no, k, p, len(parts)) for k, p in enumerate(parts)]
    h = 14 + step * len(shown)
    s.rect(x, y, w, h, "code", 10, box)
    s.add(f'<g data-src="{src}">')
    for r, (no, k, segs, n) in enumerate(shown):
        ty = y + 6 + step * (r + 1) - 6
        ex = f' data-line="{no}"' + (f' data-part="{k + 1}/{n}"' if n > 1 else "")
        at = len(s.body)
        pos = s.segs(x + 12, ty, segs, size, box, extra=ex)
        for seg, (a, b) in zip(segs, pos):
            if seg[1] == "h":
                s.rect(a - 2, ty - size * 0.95, b - a + 4, size * 1.36, "hl", 3)
                s.body.insert(at, s.body.pop())
                at += 1
    s.add("</g>")
    return y + h


# ══ 노트북용 (1280) ══════════════════════════════════════════════
def desktop():
    s = Svg(1280, 0, TITLE + " · 노트북용", "d8")
    s.text(32, 54, TITLE, 30, "t b")
    s.text(32, 90, "Scene 07 · " + SUB, 18, "s")
    y = legend(s, 16, 120, 1248, 16) + 44

    # ── 그림 A ──────────────────────────────────────────────
    s.comment("그림 A. Parameter와 Argument의 연결 (번호 없음)")
    section_head(s, 16, y, "A", "Parameter와 Argument — 받는 자리와 넣은 값 · parameter_argument.py", 22)
    y += 22
    s.rect(16, y + 14, 1248, 64, "code", 10, "a-def")
    s.text(32, y + 44, "정의:", 16, "s b", inside="a-def")
    s.segs(32 + tw("정의: ", 16), y + 44, A_DEF, 16, "a-def")
    s.text(32, y + 68, "Parameter(초록 밑줄) = 함수 정의에 적은 받는 자리 · Argument(갈색 칩) = 호출할 때 넣은 값", 16, "s", inside="a-def")
    y += 94
    hs = []
    for i, case in enumerate(A_CASES):
        x = 16 + (i % 2) * 636
        if i % 2 == 0 and i:
            y += max(hs) + 16
            hs = []
        hs.append(a_card(s, x, y, 612, case, 16, False))
    y += max(hs) + 16
    s.rect(16, y, 1248, 70, "legend", 10, "a-err")
    s.text(32, y + 28, "기본값이 없는 정의에서 calculate_total(1000)을 부르면", 16, "t b", inside="a-err")
    s.add(f'<g data-out="{attr(A_ERR)}">')
    s.text(32, y + 54, "TypeError: calculate_total() missing 1 required positional argument: 'quantity'", 16, "t m", inside="a-err")
    s.add("</g>")
    y += 70 + 70

    # ── 그림 B ──────────────────────────────────────────────
    s.comment("그림 B. Type Hint 유무에 따른 코드 이해 (번호 없음)")
    section_head(s, 16, y, "B", "Type Hint가 없을 때와 있을 때 — 실행은 같고, 읽는 법이 달라진다 · type_hint_basics.py", 22)
    y += 22
    top = y
    cols = [(16, "Type Hint 없음", B_PLAIN, B_OUT_PLAIN, B_GAIN_PLAIN, "b-plain"), (652, "Type Hint 있음", B_HINT, B_OUT_HINT, B_GAIN_HINT, "b-hint")]
    bots = []
    ats = []
    for x, head, (fname, rows), outs, gains, box in cols:
        ats.append(len(s.body))
        s.text(x + 16, y + 34, head, 19, "t b", inside=box)
        s.text(x + 596, y + 34, fname, 16, "s m", "end", inside=box)
        yy = code_rows(s, x + 16, y + 50, 580, rows, 16, 28, f"{box}-code", f"type_hint_basics.py:{fname}") + 16
        if box == "b-hint":
            for k, (mark, what, does) in enumerate(B_PARTS):
                pb = f"{box}-part{k}"
                s.rect(x + 16, yy, 580, 56, "legend", 8, pb, extra=f' data-part-of="{attr(mark)}={attr(does)}"')
                s.text(x + 28, yy + 23, mark, 16, "hintT m" if k < 2 else "t m b", inside=pb)
                s.text(x + 584, yy + 23, does, 16, "s b" if k < 2 else "okT", "end", inside=pb)
                s.text(x + 28, yy + 46, what, 16, "t", inside=pb)
                yy += 62
        else:
            pb = f"{box}-part"
            s.rect(x + 16, yy, 580, 56 * 3 + 12, "legend", 8, pb)
            s.text(x + 28, yy + 30, "기대 형식이 정의에 없다", 16, "t b", inside=pb)
            s.text(x + 28, yy + 58, "price·quantity에 무엇을 넣어야 하는지,", 16, "t", inside=pb)
            s.text(x + 28, yy + 84, "무엇이 돌아오는지는 본문·이름·문서를 읽어 짐작한다.", 16, "t", inside=pb)
            s.text(x + 28, yy + 118, "return price * quantity는 똑같이 실행된다.", 16, "s", inside=pb)
            yy += 56 * 3 + 12 + 6
        bots.append(yy)
    y = max(bots) + 4
    for i, (x, head, (fname, rows), outs, gains, box) in enumerate(cols):
        ob = f"{box}-out"
        s.text(x + 16, y + 20, "실제 실행 결과", 16, "s b", inside=box)
        s.rect(x + 16, y + 30, 580, 14 + 26 * len(outs), "code", 8, ob)
        for k, o in enumerate(outs):
            s.text(x + 28, y + 30 + 26 * (k + 1) - 4, o, 16, "t m", inside=ob, extra=f' data-out="{attr(o)}"')
        gy = y + 30 + 14 + 26 * len(outs) + 14
        gb = f"{box}-gain"
        s.rect(x + 16, gy, 580, 14 + 28 * len(gains), "same" if box == "b-hint" else "legend", 8, gb)
        for k, g in enumerate(gains):
            s.text(x + 28, gy + 28 * (k + 1) - 2, g, 16, "t", inside=gb, extra=f' data-gain="{attr(g)}"')
        bots[i] = gy + 14 + 28 * len(gains) + 16
    y = max(bots)
    for i, (x, *_rest) in enumerate(cols):
        behind(s, ats[i], x, top, 612, y - top, cols[i][5])
    y += 14
    s.rect(16, y, 1248, 48, "same", 10, "b-same")
    s.text(32, y + 31, B_SAME, 17, "t b", inside="b-same")
    y += 60
    s.rect(16, y, 1248, 96, "code", 10, "b-ann")
    s.text(32, y + 26, "Python은 힌트를 함수에 보관만 한다(검사·변환하지 않음) — 읽는 사람과 도구가 쓰는 정보", 16, "s b", inside="b-ann")
    for k, o in enumerate(B_ANN):
        s.text(32, y + 54 + 26 * k, o, 16, "t m", inside="b-ann", extra=f' data-out="{attr(o)}"')
    y += 96 + 12
    s.text(16, y + 16, B_GAIN_NOTE, 16, "s")
    y += 84

    # ── 그림 C ──────────────────────────────────────────────
    s.comment("그림 C. 입력값이 통과하는 단계: 명령줄 → argparse 변환 → 서비스 함수 호출(표시) → 범위 검증. 경우마다 번호를 따로 매김")
    section_head(s, 16, y, "C", "입력값이 통과하는 단계 — --limit 10 · abc · -2 · argparse_vs_hint.py", 22)
    y += 22
    bw, gap = 274, 40
    xs = [16 + 12 + i * (bw + gap) for i in range(4)]
    for i, (sid, name, kind) in enumerate(C_STAGES):
        s.text(xs[i] + 4, y + 26, name, 17, "t b")
        s.text(xs[i] + 4, y + 50, kind, 16, "s")
    y += 64
    for cid, val, label, states, texts, outs, code, (end_cls, end_from, end_label) in C_CASES:
        cb = f"c-{cid}"
        at = len(s.body)
        s.add(f'<g data-case="{cid}" data-arg="{attr(val)}" data-exit="{code}">')
        s.text(28, y + 30, f"--limit {val} — {label}", 18, "t b" if code == 0 else "excT", inside=cb)
        s.text(1252, y + 30, C_CMD.format(val), 16, "s m", "end", inside=cb)
        by = y + 48
        bh = 120
        for i, (sid, name, kind) in enumerate(C_STAGES):
            x = xs[i]
            st = states[sid]
            bid = f"{cb}-{sid}"
            cls = "skip" if st == "skip" else ("stageF" if st == "fail" else STAGE_CLS[sid])
            s.rect(x, by, bw, bh, cls, 10, bid, extra=f' data-stage="{sid}={st}"')
            if st == "skip":
                s.text(x + bw / 2, by + 66, "실행되지 않음", 16, "skipT", "middle", inside=bid)
                continue
            if sid == "cli":
                s.text(x + 14, by + 30, f"--limit {val}", 16, "t m b", inside=bid)
                s.text(x + 14, by + 60, "프로그램에 도착한 값:", 16, "s", inside=bid)
                s.text(x + 14, by + 88, f"'{val}' (문자열)", 16, "t m", inside=bid)
            elif sid == "parse":
                src, dst, how = texts["parse"]
                s.text(x + 14, by + 28, "parse_args()", 16, "t m b", inside=bid)
                cy = by + 62
                w1 = tw(src, 16, True) + 16
                s.rect(x + 14, cy - 18, w1, 28, "strC", 6, f"{bid}-s")
                s.text(x + 22, cy + 2, src, 16, "t m", inside=f"{bid}-s")
                if dst is not None:
                    w2 = tw(dst, 16, True) + 16
                    dx = x + bw - 14 - w2
                    s.rect(dx, cy - 18, w2, 28, "intC", 6, f"{bid}-i")
                    s.text(dx + 8, cy + 2, dst, 16, "t m b", inside=f"{bid}-i")
                    s.conv([(x + 14 + w1, cy - 4), (dx, cy - 4)], f"{bid}-s", f"{bid}-i")
                    s.text(x + 14, by + 104, how, 16, "convT m", inside=bid)
                else:
                    s.text(x + 14 + w1 + 12, cy + 2, "정수로 바꿀 수 없음", 16, "excT", inside=bid)
                    s.text(x + 14, by + 104, how, 16, "excT m", inside=bid)
            elif sid == "call":
                n = val
                s.text(x + 14, by + 28, f"list_transactions({n})", 16, "t m b", inside=bid)
                tb = f"{bid}-hint"
                s.rect(x + 14, by + 42, bw - 28, 34, "hintTag", 6, tb)
                s.segs(x + 24, by + 65, [("limit: int", "h"), (" · 표시만", "n")], 16, tb)
                s.text(x + 14, by + 104, "검사·변환 없이 그대로 들어감", 16, "s", inside=bid)
            else:
                cond, res = texts["check"]
                s.text(x + 14, by + 28, "if limit <= 0:", 16, "t m b", inside=bid)
                s.text(x + 14, by + 62, cond, 16, "t m", inside=bid)
                s.text(x + 14, by + 96, res, 16, "okT" if st == "ok" else "excT m", inside=bid)
        steps = [i for i, (sid, *_r) in enumerate(C_STAGES) if states[sid] != "skip"]
        ay = by + 22
        for n, i in enumerate(steps[:-1], start=1):
            s.call([(xs[i] + bw, ay), (xs[i + 1] - 2, ay)], f"{cb}-{C_STAGES[i][0]}", f"{cb}-{C_STAGES[i + 1][0]}", str(n))
            s.step(xs[i] + bw + gap / 2, ay + 22, str(n), 12, 16)
        oy = by + bh + 58
        ob = f"{cb}-out"
        s.rect(28, oy, 1224, 46 + 26 * len(outs), "code", 10, ob, extra=f' data-exit="{code}"')
        s.text(42, oy + 26, f"main()이 끝난 뒤 실제 출력 · 종료 코드 {code}", 16, "s b", inside=ob)
        for k, o in enumerate(outs):
            s.text(42, oy + 26 + 26 * (k + 1), o, 16, "t m" if not (o.startswith("[오류]") or "error:" in o) else "excT m", inside=ob, extra=f' data-out="{attr(o)}"')
        fi = [sid for sid, *_r in C_STAGES].index(end_from)
        ex = xs[fi] + bw / 2
        pts = [(ex, by + bh), (ex, oy - 2)]
        lx, anchor = (ex + 12, "start") if end_from == "parse" else (ex - 12, "end")
        if end_cls == "ret":
            s.retline(pts, f"{cb}-{end_from}", ob)
            s.text(lx, by + bh + 34, end_label, 16, "retT", anchor)
        else:
            s.exc(pts, f"{cb}-{end_from}", ob, end_cls)
            s.text(lx, by + bh + 34, end_label, 16, "excT", anchor)
        s.add("</g>")
        h = oy + 46 + 26 * len(outs) + 14 - y
        behind(s, at, 16, y, 1248, h, cb)
        y += h + 14
    for k, t in enumerate(C_NOTE):
        s.text(16, y + 18 + 26 * k, t, 16, "t" if k == 0 else "t")
    y += 18 + 26 * len(C_NOTE) + 60

    # ── 그림 D ──────────────────────────────────────────────
    s.comment("그림 D. Type Hint와 실제 검증 비교 (번호 없음)")
    section_head(s, 16, y, "D", "선언이 기대하는 것과 코드가 실제로 검사하는 것 · amount: int", 22)
    y += 22
    cx = [16, 166, 506, 846]
    cw = [150, 340, 340, 418]
    heads = [("넣은 값", ""), ("선언 amount: int 기준", "기대하는 형태"), ("타입 표시만 있는 함수", "hint_not_validation.py"), ("검증 코드가 있는 함수", "runtime_validation.py")]
    for k, (h1, h2) in enumerate(heads):
        hb = f"d-th{k}"
        s.rect(cx[k], y + 12, cw[k], 58, "th2", 0, hb)
        s.text(cx[k] + 12, y + 36, h1, 16, "t b", inside=hb)
        if h2:
            s.text(cx[k] + 12, y + 60, h2, 16, "s m" if h2.endswith(".py") else "s", inside=hb)
    y += 70
    for val, decl, more, hint_out, check_out in D_ROWS:
        s.add(f'<g data-input="{attr(val)}" data-decl="{attr(decl)}">')
        rh = 58
        for k in range(4):
            s.rect(cx[k], y, cw[k], rh, "cell", 0, f"d-{val}-{k}")
        s.text(cx[0] + 12, y + 35, val, 16, "t m b", inside=f"d-{val}-0")
        s.text(cx[1] + 12, y + 25, decl, 16, "t b" if "맞음" in decl else "t", inside=f"d-{val}-1")
        if more:
            s.text(cx[1] + 12, y + 48, more, 16, "s", inside=f"d-{val}-1")
        hv = hint_out.split(" → ", 1)[1]
        s.text(cx[2] + 12, y + 25, "그대로 돌려줌", 16, "s", inside=f"d-{val}-2")
        s.text(cx[2] + 12, y + 48, hv, 16, "t m", inside=f"d-{val}-2", extra=f' data-out="{attr(hint_out)}" data-col="hint"')
        cv = check_out.split(" → ", 1)[1]
        if cv.startswith("거부"):
            s.text(cx[3] + 12, y + 25, "거부(ValueError)", 16, "excT", inside=f"d-{val}-3")
            s.text(cx[3] + 12, y + 48, cv.split(": ", 1)[1], 16, "t", inside=f"d-{val}-3", extra=f' data-out="{attr(check_out)}" data-col="check"')
        else:
            s.text(cx[3] + 12, y + 25, "통과", 16, "okT", inside=f"d-{val}-3")
            s.text(cx[3] + 12, y + 48, cv, 16, "t m", inside=f"d-{val}-3", extra=f' data-out="{attr(check_out)}" data-col="check"')
        s.add("</g>")
        y += rh
    y += 16
    s.text(16, y + 18, D_NOTE, 16, "t b")
    y += 52
    hs = []
    for i, (cid, expr, mean, outs, demo, gist) in enumerate(D_CARDS):
        x = 16 + (i % 2) * 636
        if i % 2 == 0 and i:
            y += max(hs) + 16
            hs = []
        box = f"d-card-{cid}"
        at = len(s.body)
        s.add(f'<g data-card="{attr(expr)}">')
        s.text(x + 16, y + 32, expr, 20, "hintT m", inside=box)
        s.text(x + 596, y + 32, demo, 16, "s m", "end", inside=box)
        s.text(x + 16, y + 60, "뜻: " + mean, 16, "t", inside=box)
        s.text(x + 16, y + 86, "실행 중 자동 검사: 없음", 16, "t b", inside=box)
        ob = f"{box}-out"
        shown = []
        for o in outs:
            shown.append((o, out_lines(o, 16, 556)))
        n = sum(len(v) for _, v in shown)
        s.rect(x + 16, y + 100, 580, 14 + 24 * n, "code", 8, ob)
        r = 0
        for o, parts in shown:
            s.add(f'<g data-out="{attr(o)}">')
            for p in parts:
                s.text(x + 28, y + 100 + 24 * (r + 1) - 2, p, 16, "t m", inside=ob)
                r += 1
            s.add("</g>")
        gy = y + 100 + 14 + 24 * n + 26
        s.text(x + 16, gy, gist, 16, "s", inside=box, extra=f' data-gist="{attr(gist)}"')
        s.add("</g>")
        h = gy + 18 - y
        behind(s, at, x, y, 612, h, box)
        hs.append(h)
    y += max(hs) + 50
    for i, t in enumerate(FOOT):
        s.text(32, y + 26 * i, t, 16, "s")
    s.h = int(y + 26 * len(FOOT) + 8)
    s.save("type-hint-flow-desktop.svg", DESC)


# ══ 휴대전화용 (360) ═════════════════════════════════════════════
B_WRAP_M = {  # 휴대전화에서 나눠 그리는 줄(Python에서도 같은 뜻인 줄바꿈: 괄호 안)
    "1": [[("def ", "k"), ("calculate_total(", "c"), ("price", "p"), (": int", "h"), (",", "c")],
          [("        ", "c"), ("quantity", "p"), (": int", "h"), (") ", "c"), ("-> int", "h"), (":", "c")]],
}
B_WRAP_M_PLAIN = {
    "1": [[("def ", "k"), ("calculate_total_no_hint(", "c")],
          [("        ", "c"), ("price", "p"), (", ", "c"), ("quantity", "p"), ("):", "c")]],
}


def mobile():
    s = Svg(360, 0, TITLE + " · 휴대전화용", "m8")
    for i, t in enumerate(["amount: int라고 적으면", "잘못된 값을 막을 수 있을까?"]):
        s.text(12, 32 + 28 * i, t, 21, "t b")
    s.text(12, 86, "Scene 07 · Parameter·Argument·Type Hint·검증", 14, "s")
    y = legend(s, 12, 104, 336, 14, mobile=True) + 36

    s.comment("그림 A")
    section_head(s, 12, y, "A", "Parameter와 Argument", 17)
    s.text(12, y + 26, "받는 자리와 넣은 값 · parameter_argument.py", 14, "s")
    y += 42
    s.rect(12, y, 336, 104, "code", 10, "a-def")
    s.text(22, y + 24, "정의:", 14, "s b", inside="a-def")
    s.segs(22, y + 48, A_DEF, 14, "a-def")
    s.text(22, y + 72, "초록 밑줄 Parameter = 받는 자리", 14, "s", inside="a-def")
    s.text(22, y + 90, "갈색 칩 Argument = 넣은 값", 14, "s", inside="a-def")
    y += 104 + 12
    for case in A_CASES:
        y += a_card(s, 12, y, 336, case, 14, True) + 12
    err_lines = WRAP[A_ERR.split(" → ", 1)[1]]
    s.rect(12, y, 336, 60 + 22 * len(err_lines), "legend", 10, "a-err")
    s.text(22, y + 24, "기본값 없는 정의에서", 14, "t b", inside="a-err")
    s.text(22, y + 44, "calculate_total(1000)을 부르면", 14, "t b", inside="a-err")
    s.add(f'<g data-out="{attr(A_ERR)}">')
    for k, ln in enumerate(err_lines):
        s.text(22, y + 70 + 22 * k, ln, 14, "t m", inside="a-err")
    s.add("</g>")
    y += 60 + 22 * len(err_lines) + 50

    s.comment("그림 B")
    section_head(s, 12, y, "B", "Type Hint가 없을 때와 있을 때", 17)
    s.text(12, y + 26, "실행은 같고, 읽는 법이 달라진다", 14, "s")
    y += 42
    for head, (fname, rows), outs, gains, box, wrap in (("Type Hint 없음", B_PLAIN, B_OUT_PLAIN, B_GAIN_PLAIN, "b-plain", B_WRAP_M_PLAIN),
                                                         ("Type Hint 있음", B_HINT, B_OUT_HINT, B_GAIN_HINT, "b-hint", B_WRAP_M)):
        at = len(s.body)
        top = y
        s.text(24, y + 26, head, 16, "t b", inside=box)
        s.text(336, y + 26, "type_hint_basics.py", 14, "s m", "end", inside=box)
        yy = code_rows(s, 20, y + 38, 320, rows, 14, 24, f"{box}-code", f"type_hint_basics.py:{fname}", wrap=wrap) + 12
        if box == "b-hint":
            for k, (mark, what, does) in enumerate(B_PARTS):
                pb = f"{box}-part{k}"
                s.rect(20, yy, 320, 76, "legend", 8, pb, extra=f' data-part-of="{attr(mark)}={attr(does)}"')
                s.text(30, yy + 22, mark, 14, "hintT m" if k < 2 else "t m b", inside=pb)
                s.text(30, yy + 44, what.split(" — ")[0], 14, "t b", inside=pb)
                s.text(30, yy + 66, what.split(" — ")[1] + " · " + does, 14, "s" if k < 2 else "okT", inside=pb)
                yy += 82
        else:
            pb = f"{box}-part"
            s.rect(20, yy, 320, 96, "legend", 8, pb)
            s.text(30, yy + 24, "기대 형식이 정의에 없다", 14, "t b", inside=pb)
            s.text(30, yy + 48, "무엇을 넣고 무엇이 돌아오는지는", 14, "t", inside=pb)
            s.text(30, yy + 70, "본문·이름·문서를 읽어 짐작한다.", 14, "t", inside=pb)
            yy += 102
        ob = f"{box}-out"
        s.text(24, yy + 16, "실제 실행 결과", 14, "s b", inside=box)
        rows_out = []
        for o in outs:
            rows_out.append((o, out_lines(o, 14, 296)))
        n = sum(len(v) for _, v in rows_out)
        s.rect(20, yy + 26, 320, 12 + 22 * n, "code", 8, ob)
        r = 0
        for o, parts in rows_out:
            s.add(f'<g data-out="{attr(o)}">')
            for p in parts:
                s.text(30, yy + 26 + 22 * (r + 1) - 2, p, 14, "t m", inside=ob)
                r += 1
            s.add("</g>")
        gy = yy + 26 + 12 + 22 * n + 10
        gb = f"{box}-gain"
        glines = []
        for g in gains:
            who, what = g.split(": ", 1)
            glines.append((g, [who + ":", "  " + what]))
        s.rect(20, gy, 320, 12 + 22 * 2 * len(gains), "same" if box == "b-hint" else "legend", 8, gb)
        r = 0
        for g, parts in glines:
            s.add(f'<g data-gain="{attr(g)}">')
            for p in parts:
                s.text(30, gy + 22 * (r + 1) - 2, p, 14, "t", inside=gb)
                r += 1
            s.add("</g>")
        bot = gy + 12 + 22 * 2 * len(gains) + 12
        behind(s, at, 12, top, 336, bot - top, box)
        y = bot + 12
    s.rect(12, y, 336, 70, "same", 10, "b-same")
    s.text(22, y + 26, "두 함수의 실행 결과는 같다", 15, "t b", inside="b-same")
    s.text(22, y + 52, "Type Hint를 붙여도 실행 동작은 그대로", 14, "t", inside="b-same")
    y += 82
    s.rect(12, y, 336, 168, "code", 10, "b-ann")
    s.text(22, y + 24, "Python은 힌트를 보관만 한다", 14, "s b", inside="b-ann")
    s.add(f'<g data-out="{attr(B_ANN[0])}">')
    for k, p in enumerate(["보관된 힌트:", "{'price': <class 'int'>,", " 'quantity': <class 'int'>,", " 'return': <class 'int'>}"]):
        s.text(22, y + 50 + 22 * k, p, 14, "t m", inside="b-ann")
    s.add("</g>")
    s.text(22, y + 50 + 22 * 4 + 6, B_ANN[1], 14, "t m", inside="b-ann", extra=f' data-out="{attr(B_ANN[1])}"')
    y += 168 + 10
    for k, t in enumerate(["도구가 무엇을 알려 주는지는 종류·설정·", "코드에 따라 다르다(검사기는 실행하지 않음)."]):
        s.text(12, y + 14 + 20 * k, t, 14, "s")
    y += 92

    s.comment("그림 C")
    section_head(s, 12, y, "C", "입력값이 통과하는 단계", 17)
    s.text(12, y + 26, "--limit 10 · abc · -2 · argparse_vs_hint.py", 14, "s")
    y += 42
    for cid, val, label, states, texts, outs, code, (end_cls, end_from, end_label) in C_CASES:
        cb = f"c-{cid}"
        at = len(s.body)
        top = y
        s.add(f'<g data-case="{cid}" data-arg="{attr(val)}" data-exit="{code}">')
        s.text(24, y + 26, f"--limit {val} — {label}", 16, "t b" if code == 0 else "excT", inside=cb)
        by = y + 42
        bx, bw = 24, 270
        ys = {}
        for i, (sid, name, kind) in enumerate(C_STAGES):
            st = states[sid]
            bid = f"{cb}-{sid}"
            bh = 40 if st == "skip" else (92 if sid != "cli" else 70)
            cls = "skip" if st == "skip" else ("stageF" if st == "fail" else STAGE_CLS[sid])
            s.rect(bx, by, bw, bh, cls, 10, bid, extra=f' data-stage="{sid}={st}"')
            ys[sid] = (by, bh)
            if st == "skip":
                s.text(bx + 12, by + 26, f"{name} · 실행되지 않음", 14, "skipT", inside=bid)
            elif sid == "cli":
                s.text(bx + 12, by + 24, name + " · " + kind, 14, "s b", inside=bid)
                s.text(bx + 12, by + 52, f"--limit {val} → '{val}'", 14, "t m", inside=bid)
            elif sid == "parse":
                src, dst, how = texts["parse"]
                s.text(bx + 12, by + 22, "argparse · type=int (변환)", 14, "s b", inside=bid)
                cy = by + 50
                w1 = tw(src, 14, True) + 14
                s.rect(bx + 12, cy - 16, w1, 26, "strC", 6, f"{bid}-s")
                s.text(bx + 19, cy + 2, src, 14, "t m", inside=f"{bid}-s")
                if dst is not None:
                    w2 = tw(dst, 14, True) + 14
                    dx = bx + 12 + w1 + 70
                    s.rect(dx, cy - 16, w2, 26, "intC", 6, f"{bid}-i")
                    s.text(dx + 7, cy + 2, dst, 14, "t m b", inside=f"{bid}-i")
                    s.conv([(bx + 12 + w1, cy - 3), (dx, cy - 3)], f"{bid}-s", f"{bid}-i")
                    s.text(bx + 12, by + 82, how, 14, "convT m", inside=bid)
                else:
                    s.text(bx + 12 + w1 + 10, cy + 2, "정수로 바꿀 수 없음", 14, "excT", inside=bid)
                    s.text(bx + 12, by + 82, how, 14, "excT m", inside=bid)
            elif sid == "call":
                s.text(bx + 12, by + 22, f"list_transactions({val})", 14, "t m b", inside=bid)
                tb = f"{bid}-hint"
                s.rect(bx + 12, by + 32, bw - 24, 30, "hintTag", 6, tb)
                s.segs(bx + 20, by + 52, [("limit: int", "h"), (" · 표시만", "n")], 14, tb)
                s.text(bx + 12, by + 82, "검사·변환 없이 그대로 들어감", 14, "s", inside=bid)
            else:
                cond, res = texts["check"]
                s.text(bx + 12, by + 22, "범위 검증 · if limit <= 0:", 14, "s b", inside=bid)
                s.text(bx + 12, by + 50, cond, 14, "t m", inside=bid)
                s.text(bx + 12, by + 78, res, 14, "okT" if st == "ok" else "excT m", inside=bid)
            by += bh + 34
        steps = [sid for sid, *_r in C_STAGES if states[sid] != "skip"]
        for n, (a, b) in enumerate(zip(steps, steps[1:]), start=1):
            ya, ha = ys[a]
            yb, _ = ys[b]
            s.call([(bx + 40, ya + ha), (bx + 40, yb - 2)], f"{cb}-{a}", f"{cb}-{b}", str(n))
            s.step(bx + 64, ya + ha + 17, str(n), 11, 14)
        oy = by - 34 + 34 + 30
        ob = f"{cb}-out"
        parts_all = []
        for o in outs:
            parts_all.append((o, out_lines(o, 14, 296)))
        n = sum(len(v) for _, v in parts_all)
        s.rect(20, oy, 320, 34 + 22 * n, "code", 10, ob, extra=f' data-exit="{code}"')
        s.text(30, oy + 22, f"실제 출력 · 종료 코드 {code}", 14, "s b", inside=ob)
        r = 0
        for o, parts in parts_all:
            s.add(f'<g data-out="{attr(o)}">')
            for p in parts:
                s.text(30, oy + 22 + 22 * (r + 1), p, 14, "t m" if not (o.startswith("[오류]") or "error:" in o) else "excT m", inside=ob)
                r += 1
            s.add("</g>")
        fy, fh = ys[end_from]
        ex = 318
        pts = [(bx + bw, fy + fh / 2), (ex, fy + fh / 2), (ex, oy - 2)]
        if end_cls == "ret":
            s.retline(pts, f"{cb}-{end_from}", ob)
        else:
            s.exc(pts, f"{cb}-{end_from}", ob, end_cls)
        ly = oy - 12
        s.text(ex - 8, ly, end_label if len(end_label) < 18 else end_label.split(" → ")[0].split(" · ")[0], 14, "retT" if end_cls == "ret" else "excT", "end")
        s.add("</g>")
        bot = oy + 34 + 22 * n + 12
        behind(s, at, 12, top, 336, bot - top, cb)
        y = bot + 12
    for k, t in enumerate(["type=int는 변환, limit: int는 표시,", "if limit <= 0이 실제 검사다.", "argparse 오류(종료 코드 2)와 업무 오류", "([오류]·종료 코드 1)는 출처가 다르다."]):
        s.text(12, y + 14 + 20 * k, t, 14, "t b" if k < 2 else "t")
    y += 120

    s.comment("그림 D")
    section_head(s, 12, y, "D", "선언과 실제 검사", 17)
    s.text(12, y + 26, "amount: int · 같은 입력, 두 함수", 14, "s")
    y += 42
    for val, decl, more, hint_out, check_out in D_ROWS:
        box = f"d-{val}-m"
        s.add(f'<g data-input="{attr(val)}" data-decl="{attr(decl)}">')
        h = 196 if more else 174
        s.rect(12, y, 336, h, "card", 10, box)
        s.text(24, y + 26, "넣은 값 " + val, 15, "t m b", inside=box)
        s.text(24, y + 50, "선언 기준: " + decl, 14, "t b" if "맞음" in decl else "t", inside=box)
        yy = y + 50
        if more:
            yy += 22
            s.text(24, yy, "  " + more, 14, "s", inside=box)
        hv = hint_out.split(" → ", 1)[1]
        s.text(24, yy + 26, "타입 표시만: 그대로 돌려줌", 14, "s", inside=box)
        s.text(36, yy + 48, hv, 14, "t m", inside=box, extra=f' data-out="{attr(hint_out)}" data-col="hint"')
        cv = check_out.split(" → ", 1)[1]
        if cv.startswith("거부"):
            s.text(24, yy + 74, "검증 코드: 거부(ValueError)", 14, "excT", inside=box)
            s.text(36, yy + 96, cv.split(": ", 1)[1], 14, "t", inside=box, extra=f' data-out="{attr(check_out)}" data-col="check"')
        else:
            s.text(24, yy + 74, "검증 코드: 통과", 14, "okT", inside=box)
            s.text(36, yy + 96, cv, 14, "t m", inside=box, extra=f' data-out="{attr(check_out)}" data-col="check"')
        s.add("</g>")
        y += h + 10
    for k, t in enumerate(["Type Hint는 기대하는 형태를 적은 것.", "규칙을 지키게 하려면 검사 코드를 쓴다."]):
        s.text(12, y + 16 + 20 * k, t, 14, "t b")
    y += 62
    for cid, expr, mean, outs, demo, gist in D_CARDS:
        box = f"d-card-{cid}"
        at = len(s.body)
        top = y
        s.add(f'<g data-card="{attr(expr)}">')
        s.text(24, y + 28, expr, 17, "hintT m", inside=box)
        s.text(336, y + 28, demo, 14, "s m", "end", inside=box)
        s.text(24, y + 52, "뜻: " + mean, 14, "t", inside=box)
        s.text(24, y + 74, "실행 중 자동 검사: 없음", 14, "t b", inside=box)
        ob = f"{box}-out"
        shown = [(o, out_lines(o, 14, 296)) for o in outs]
        n = sum(len(v) for _, v in shown)
        s.rect(20, y + 86, 320, 12 + 22 * n, "code", 8, ob)
        r = 0
        for o, parts in shown:
            s.add(f'<g data-out="{attr(o)}">')
            for p in parts:
                s.text(30, y + 86 + 22 * (r + 1) - 2, p, 14, "t m", inside=ob)
                r += 1
            s.add("</g>")
        gy = y + 86 + 12 + 22 * n + 22
        g1, _, g2 = gist.partition(" · ")
        s.add(f'<g data-gist="{attr(gist)}">')
        s.text(24, gy, g1, 14, "s", inside=box)
        if g2:
            gy += 20
            s.text(24, gy, g2, 14, "s", inside=box)
        s.add("</g>")
        s.add("</g>")
        bot = gy + 14
        behind(s, at, 12, top, 336, bot - top, box)
        y = bot + 12
    y += 30
    for i, t in enumerate(FOOT_M):
        s.text(12, y + 22 * i, t, 14, "s")
    s.h = int(y + 22 * len(FOOT_M) + 4)
    s.save("type-hint-flow-mobile.svg", DESC)


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
