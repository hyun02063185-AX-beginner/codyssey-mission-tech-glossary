"""B2-1 Scene 05 (데이터를 꼭 한꺼번에 꺼내야 할까? Iterable·Iterator·Generator는 무엇이 다를까?) 노트북·휴대전화 SVG 생성기.

Scene 04 생성기(../../scene-04/_tools/build.py)의 그리기 도구를 불러 쓴다(그 안에서 Scene 03-B·03-A·02·01 도구도 쓴다). 다섯 파일은 바꾸지 않는다.
그림의 값·진행 위치·실행된 줄·상태·꺼낸 줄 수·남긴 거래는 _tools/demo/의 실제 실행 결과이며, verify_demo.py가 대조한다.

시각 약속(Scene 01~04 약속 유지 + 이번 추가):
- 실제 실행 순서 = 검은 번호 원 + 진한 실선·채운 화살촉 (그림 A의 next() 호출, 그림 B의 호출, 그림 C의 소비자↔Generator)
- 만들어 냄 관계(iter()가 Iterator를 만듦) = 보라 점선, 번호 없음
- 포함 관계(Iterable ⊃ Iterator ⊃ Generator) = 겹친 상자, 선·번호 없음
- 데이터 모양 바꾸기 = 청록 실선 + 함수 이름, 번호 없음 (Scene 04)
- 꺼낸 값(Iterator 칸) = 회색 칸 + '꺼냄' 글자, 다음 위치 = 굵은 테두리 + '다음' 글자
- Generator 상태 = 멈춤(갈색 파선 + '멈춤'), 종료(회색 실선 + '종료'), 생성됨(가는 회색 + '생성됨')
- 그림 D: 꺼낸 줄 = 회색 점선 칸 + 줄 번호, 남긴 거래 = 파란 굵은 실선 칸 + 'id', 번호 원 없음(방식 이름표는 순서가 아님)

실행: python -I build.py  (출력: ../generator-stream-desktop.svg, ../generator-stream-mobile.svg)
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location("scene04_build", os.path.join(HERE, "..", "..", "scene-04", "_tools", "build.py"))
b4 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(b4)
b3, s3, s2, s1 = b4.b3, b4.s3, b4.s2, b4.s1
tw, esc, attr, section_head, code_lines = s1.tw, s1.esc, b4.attr, s1.section_head, b4.code_lines

# ── 내용 (노트북·휴대전화 공통) ────────────────────────────────
TITLE = "데이터를 꼭 한꺼번에 꺼내야 할까?"
SUB = "Iterable·Iterator·Generator는 무엇이 다를까? · JSONL을 한 건씩 읽고, 무엇을 얼마나 남기는지 보기"

# 그림 A: two_iterators.py
NUMBERS = [10, 20, 30]
A_CALLS = [("a", 10), ("a", 20), ("b", 10), ("a", 30), ("b", 20)]  # (Iterator, 받은 값) — 실행 순서대로
A_END = {"a": "다음 값 없음 → next()는 StopIteration", "b": "다음 값: 30"}
A_OUTS = ["a와 b는 같은 객체? False", "리스트는 그대로: [10, 20, 30]"]
A_LIST_NOTE = "next(numbers) → TypeError (Iterator가 아님)"
# 그림 A-2: 포함 관계 (yield_vs_return.py · iterable_iterator.py · jsonl_generator.py로 확인)
KINDS = [
    ("iterable", "Iterable", "for … in 에 쓸 수 있음 · iter()로 Iterator를 내줌", [("list", "리스트 [10, 20, 30]"), ("str", "문자열 · 딕셔너리 …")]),
    ("iterator", "Iterator", "next()로 다음 값 · 진행 위치 기억 · iter(it) is it", [("list_iterator", "iter(리스트)"), ("file", "파일 객체 (iter(f) is f)")]),
    ("generator", "Generator", "yield가 있는 함수를 호출해 얻은 객체", [("generator", "count_up(3)")]),
]

# 그림 B: generator_steps.py (print 인자는 줄임 — 원고에 전체 코드)
B_CODE = [
    "def count_up(limit):",
    "    print(…)",
    "    n = 1",
    "    while n <= limit:",
    "        print(…)",
    "        yield n",
    "        print(…)",
    "        n = n + 1",
    "    print(…)",
]
YIELD_LINE = 6
# (호출, 실행한 줄(함수 첫 줄 = 1), 밖으로 나온 값, 상태 종류, 상태 글자)
B_STEPS = [
    ("gen = count_up(3)", [], "—", "created", "생성됨 · 본문 실행 전"),
    ("next(gen)", [2, 3, 4, 5, 6], "1", "paused", "6행 yield에서 멈춤 · n = 1"),
    ("next(gen)", [7, 8, 4, 5, 6], "2", "paused", "6행 yield에서 멈춤 · n = 2"),
    ("next(gen)", [7, 8, 4, 5, 6], "3", "paused", "6행 yield에서 멈춤 · n = 3"),
    ("next(gen)", [7, 8, 4, 9], "StopIteration", "done", "함수 끝 · 종료"),
]

# 그림 C: jsonl_generator.py
C_LINES = ['{"id":1,"category":"식비","amount":8000}', '{"id":2,"category":"교통","amount":2000}',
           '{"id":3,"category":"문구","amount":3000}']
C_STR = repr(C_LINES[0] + "\n")
C_DICT = [("id", "1"), ("category", "'식비'"), ("amount", "8000")]
C_GOT = ["dict · id 1 · 식비 · 8000", "dict · id 2 · 교통 · 2000", "dict · id 3 · 문구 · 3000"]
C_TOTAL = "합계: 13000"
C_STEPS = [
    ("1", "소비하는 for가 next() 요청"),
    ("2", "Generator 재개 · 파일에서 한 줄 꺼냄"),
    ("3", "json.loads()로 dict"),
    ("4", "yield로 dict를 내보내고 멈춤"),
    ("5", "소비하는 코드가 처리(합계에 더함)"),
]
C_NOTE = ["파일 객체도 Iterator입니다(iter(f) is f → True). for line in f만으로도 한 줄씩 읽습니다.",
          "Generator는 그 위에 빈 줄 건너뛰기와 json.loads() 변환을 더해 dict를 한 건씩 건넵니다."]

# 그림 D: five_ways.py — (방식 번호, 이름, 코드, 꺼낸 줄, 남긴 id, 남긴 값 설명, 보관량, 끝까지 읽음?)
D_WAYS = [
    ("1", "전부 읽어 리스트에", "f.readlines() → rows.append(…)", 3, [1, 2, 3], "", "O(N)", True),
    ("2", "한 줄씩 바로 처리", "for line in f → total += …", 3, [], "합계 13000 하나", "O(1)", True),
    ("3", "Generator 일부만 next()", "next(gen) → gen.close()", 1, [1], "", "O(k)", False),
    ("4", "list(Generator)", "list(read_transactions(…))", 3, [1, 2, 3], "", "O(N)", True),
    ("5", "deque(maxlen=2)", "deque(maxlen=2) → recent.append(row)", 3, [2, 3], "", "O(limit)", True),
]
TOTAL_LINES = 3
D_NOTES = [
    "JSONL은 저장 형식, Generator는 실행 방식 — 메모리에 남는 양은 결과를 어디에 얼마나 보관하느냐가 정한다(방식 2·4)",
    "deque(maxlen=N)은 N개만 남기지만, 그 N개를 알려면 파일을 끝까지 읽어야 할 수 있다(방식 5)",
    "보관량과 처리 시간은 다르다 — 끝까지 읽는 방식은 데이터가 많을수록 시간이 늘 수 있다(측정하지 않음)",
    "꺼낸 줄 = Python 코드가 받은 줄 · 파일 객체는 내부 버퍼로 더 읽어 둘 수 있다 · CSV도 행 단위 순차 처리(한 행 ≠ 한 줄일 수 있음)",
]
FOOT = [
    "모든 예제는 Scene 05 학습용 예제입니다(iterable_iterator.py, two_iterators.py, generator_steps.py, jsonl_generator.py, five_ways.py 등). 실제 미션 구현이나 정답이 아닙니다.",
    "그림의 값·진행 위치·실행된 줄·상태·꺼낸 줄 수·남긴 거래는 예제를 실제로 실행하고 줄 단위로 추적해 확인했습니다(Python 3.14.6, CPython).",
]
FOOT_M = [
    "모든 예제는 Scene 05 학습용 예제입니다.",
    "실제 미션 구현이나 정답이 아닙니다.",
    "값·상태·결과는 실제 실행으로 확인했습니다.",
]
DESC = (
    "Scene 05. 그림 A는 리스트 numbers = [10, 20, 30](Iterable)에서 iter()로 서로 다른 Iterator a와 b를 만들고, "
    "1 next(a) → 10, 2 next(a) → 20, 3 next(b) → 10, 4 next(a) → 30, 5 next(b) → 20 순서로 호출했을 때 a는 세 값을 모두 꺼내 다음 값이 없고 b는 다음 값이 30인 상태를 보여 준다. "
    "a와 b는 같은 객체가 아니고 리스트는 그대로다. 리스트에 바로 next()를 쓰면 TypeError가 난다. "
    "아래 겹친 상자는 포함 관계다: Iterable(리스트, 문자열) 안에 Iterator(iter(리스트), 파일 객체), 그 안에 Generator(count_up(3))가 있다. "
    "그림 B는 Generator 함수 count_up(limit)의 실행 상태다. count_up(3)을 호출하면 본문은 실행되지 않고 Generator 객체가 생성된다. "
    "첫 next()는 2행부터 6행 yield까지 실행해 1을 내보내고 n = 1로 멈춘다. 두 번째와 세 번째 next()는 7행부터 이어 8, 4, 5, 6행을 실행해 2와 3을 내보내고 멈춘다. "
    "네 번째 next()는 7, 8, 4행 뒤 while이 끝나 9행을 실행하고 함수가 끝나 StopIteration이 난다. "
    "그림 C는 JSONL 파일 transactions.jsonl의 한 줄이 for line in f로 문자열이 되고 json.loads()로 dict가 되어 yield로 소비하는 for에 전달되는 흐름이다. "
    "실행 순서는 1 소비하는 for가 next() 요청, 2 Generator가 재개해 한 줄 꺼냄, 3 json.loads(), 4 yield로 dict를 내보내고 멈춤, 5 소비하는 코드가 합계에 더함이며, 세 줄을 반복해 합계 13000이 된다. "
    "그림 D는 같은 파일 3줄을 다섯 방식으로 소비한 결과다. 방식 1 전부 리스트: 3줄 꺼내 3건 남김. 방식 2 한 줄씩 바로 처리: 3줄 꺼내 거래는 남기지 않고 합계 13000 하나. "
    "방식 3 Generator 일부만 next(): 1줄 꺼내 1건. 방식 4 list(Generator): 3줄 꺼내 3건. 방식 5 deque(maxlen=2): 3줄 모두 꺼내 최근 2건(id 2, 3)만 남김. "
    "JSONL은 저장 형식이고 Generator는 실행 방식이며, 메모리에 남는 양은 결과를 보관하는 방식이 정하고, 보관량과 처리 시간은 다르다."
)

EXTRA = """      .took { fill: #eceff2; stroke: #8a96a3; stroke-width: 1.2; }
      .nextC { fill: #ffffff; stroke: #1b2733; stroke-width: 2.8; }
      .cellN { fill: #ffffff; stroke: #c9d2dc; stroke-width: 1.2; }
      .paused { fill: #fff8ec; stroke: #8a4100; stroke-width: 2; stroke-dasharray: 6 4; }
      .done { fill: #eceff2; stroke: #5b6672; stroke-width: 2; }
      .created { fill: #ffffff; stroke: #8a96a3; stroke-width: 1.4; }
      .readC { fill: #f1f3f5; stroke: #7b8794; stroke-width: 1.4; stroke-dasharray: 3 3; }
      .keptC { fill: #e9f1fc; stroke: #1d4f91; stroke-width: 2.6; }
      .ring1 { fill: #f7f9fb; stroke: #5b6672; stroke-width: 1.6; }
      .ring2 { fill: #eef3fa; stroke: #1d4f91; stroke-width: 1.6; }
      .ring3 { fill: #fff8ec; stroke: #8a4100; stroke-width: 1.6; }
      .hlLine { fill: #fff4e5; stroke: none; }
      .refT2 { fill: #5a3f8e; font-weight: 700; }
      .pause { fill: #8a4100; font-weight: 700; }
"""
STATE_CLS = {"created": "created", "paused": "paused", "done": "done"}
STATE_TAG = {"created": "생성됨", "paused": "멈춤", "done": "종료"}


class Svg(b4.Svg):
    def rel(self, pts, frm, to):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="ref" data-rel="{frm}>{to}"/>')

    def save(self, name, desc):
        tid, did = f"{self.idp}-title", f"{self.idp}-desc"
        style = s1.STYLE.replace("    </style>", s2.EXTRA_STYLE + s3.EXTRA + b3.EXTRA + b4.EXTRA + EXTRA + "    </style>")
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'role="img" aria-labelledby="{tid} {did}">\n'
                f'  <title id="{tid}">{esc(self.label)}</title>\n'
                f'  <desc id="{did}">{esc(desc)}</desc>\n'
                f'  <defs>\n{style}\n'
                f'    <marker id="{self.idp}-arr" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#1b2733"/></marker>\n'
                f'    <marker id="{self.idp}-cv" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#0f6e6e"/></marker>\n  </defs>\n'
                f'  <rect width="{self.w}" height="{self.h}" fill="#ffffff"/>\n')
        body = "\n".join("  " + b for b in self.body)
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(head + body + "\n</svg>\n")


def behind(s, at, x, y, w, h, box, cls="card"):
    s.rect(x, y, w, h, cls, 12, box)
    s.body.insert(at, s.body.pop())


def iterator_state(name):
    """A_CALLS를 따라가 Iterator가 꺼낸 값의 호출 번호와 다음 위치를 구한다."""
    took, pos = {}, 0
    for n, (it, value) in enumerate(A_CALLS, start=1):
        if it == name:
            took[pos] = (n, value)
            pos += 1
    return took, pos


def list_cells(s, x, y, cw, ch, size, box):
    s.add('<g data-iterable="numbers">')
    for k, v in enumerate(NUMBERS):
        cb = f"{box}-c{k}"
        s.rect(x + k * (cw + 6), y, cw, ch, "cellN", 6, cb)
        s.text(x + k * (cw + 6) + cw / 2, y + ch / 2 + size * 0.36, str(v), size, "t m b", "middle", cb)
    s.add("</g>")


def iterator_strip(s, name, x, y, cw, ch, size, box, mobile=False):
    """Iterator 한 줄: 꺼낸 칸(회색 + 호출 번호 원 + '꺼냄'), 다음 칸(굵은 테두리 + '다음')."""
    took, pos = iterator_state(name)
    s.add(f'<g data-iterator="{name}" data-took="{",".join(str(took[k][1]) for k in sorted(took))}" data-next="{NUMBERS[pos] if pos < len(NUMBERS) else "end"}">')
    for k, v in enumerate(NUMBERS):
        cb = f"{box}-c{k}"
        cx = x + k * (cw + 6)
        cls = "took" if k in took else ("nextC" if k == pos else "cellN")
        s.rect(cx, y, cw, ch, cls, 6, cb)
        s.text(cx + 12, y + ch / 2 + size * 0.36, str(v), size, "t m b" if k not in took else "s m", inside=cb)
        if k in took:
            n, _ = took[k]
            s.step(cx + cw - 18, y + ch / 2, str(n), 12 if mobile else 13, 14 if mobile else 16)
            s.add(f'<g data-callno="{n}"/>')
            s.text(cx + 12 + tw(str(v), size, True) + 8, y + ch / 2 + size * 0.36, "꺼냄", size, "s", inside=cb)
        elif k == pos:
            s.text(cx + 12 + tw(str(v), size, True) + 8, y + ch / 2 + size * 0.36, "다음", size, "t b", inside=cb)
    s.add("</g>")
    return pos


def kinds_nested(s, x, y, w, size, mobile=False):
    """포함 관계: 겹친 상자 세 개(선·번호 없음)."""
    pad, head = (12, 50) if mobile else (20, 40)
    chip_h = size + 16
    inner_h = head + chip_h + pad + 6
    h3 = inner_h
    h2 = head + chip_h + 10 + h3 + pad
    h1 = head + chip_h + 10 + h2 + pad
    hs = [h1, h2, h3]
    cx, cy, cwid = x, y, w
    for k, ((kid, name, mean, members), h) in enumerate(zip(KINDS, hs)):
        box = f"kind-{kid}"
        s.add(f'<g data-kind="{kid}">')
        s.rect(cx, cy, cwid, h, f"ring{k + 1}", 12, box)
        s.text(cx + 14, cy + size + 10, name, size + 1, "t b", inside=box)
        if mobile:
            s.text(cx + 14, cy + 2 * size + 18, mean, size - 1 if size > 14 else size, "s", inside=box)
        else:
            s.text(cx + 14 + tw(name, size + 1) + 14, cy + size + 10, mean, size, "s", inside=box)
        mx = cx + 14
        my = cy + (2 * size + 26 if mobile else size + 24)
        for mid, label in members:
            mw = tw(label, size) + 24
            s.add(f'<rect x="{mx:g}" y="{my:g}" width="{mw:g}" height="{chip_h}" rx="{chip_h / 2:g}" class="cellN" data-box="{box}-{mid}" data-member="{kid}:{mid}"/>')
            s.text(mx + 12, my + chip_h / 2 + size * 0.36, label, size, "t", inside=f"{box}-{mid}")
            mx += mw + 10
        s.add("</g>")
        cx += pad
        cy += head + chip_h + 10
        cwid -= 2 * pad
    return y + h1


def code_listing(s, x, y, w, size, step, box, mobile=False):
    h = 14 + step * len(B_CODE)
    s.rect(x, y, w, h, "code", 10, box)
    for k, ln in enumerate(B_CODE, start=1):
        ty = y + 8 + step * k - 6
        if k == YIELD_LINE:
            s.add(f'<rect x="{x + 4}" y="{ty - step + 9:g}" width="{w - 8}" height="{step - 2}" rx="4" class="hlLine"/>')
            s.text(x + w - 12, ty, "← 멈추는 곳", size, "pause", "end", inside=box)
        s.text(x + 12, ty, str(k), size, "gut m", inside=box)
        s.text(x + 12 + tw("9", size, True) + 14, ty, ln, size, "t m", inside=box, extra=f' data-codeline="{k}"')
    return y + h


def lines_text(lines):
    return "→".join(str(n) for n in lines) if lines else "없음"


def way_row_cells(s, x, y, cell, gap, size, way, box):
    """꺼낸 줄(점선 칸)과 남긴 거래(굵은 칸)."""
    _, _, _, read, kept, _, _, _ = way
    for k in range(TOTAL_LINES):
        cb = f"{box}-l{k + 1}"
        cls = "readC" if k < read else "cellN"
        s.rect(x + k * (cell + gap), y, cell, size + 16, cls, 6, cb)
        s.text(x + k * (cell + gap) + cell / 2, y + 8 + size * 0.86, f"{k + 1}행" if k < read else "—", size, "t" if k < read else "s", "middle", cb)


# ══ 노트북용 (1280) ══════════════════════════════════════════════
def desktop():
    s = Svg(1280, 0, TITLE + " · 노트북용", "d6")
    s.text(32, 54, TITLE, 30, "t b")
    s.text(32, 90, "Scene 05 · " + SUB, 18, "s")

    # ── 그림 A ──────────────────────────────────────────────
    s.comment("그림 A. Iterable과 Iterator의 관계 (two_iterators.py)")
    section_head(s, 16, 150, "A", "Iterable과 Iterator — 데이터는 하나, 진행 위치는 Iterator마다", 22)
    y = 176
    s.rect(16, y, 1248, 56, "legend", 12)
    s.step(44, y + 28, "1", 13, 16)
    s.text(66, y + 34, "번호 원 = 실제 next() 호출 순서", 16)
    s.add(f'<path d="M{344} {y + 28}H{404}" class="ref"/>')
    s.text(416, y + 34, "보라 점선 = iter()가 만들어 냄(순서 아님)", 16)
    s.rect(760, y + 14, 70, 28, "took", 6)
    s.text(772, y + 34, "꺼냄", 16, "s")
    s.rect(850, y + 14, 70, 28, "nextC", 6)
    s.text(862, y + 34, "다음", 16, "t b")
    s.text(936, y + 34, "= Iterator의 현재 위치", 16)
    y += 76
    top = y
    a1_at = len(s.body)
    s.text(36, y + 32, "A-1 같은 리스트에서 만든 두 Iterator · 실행 결과", 19, "t b", inside="a1")
    ly = y + 58
    s.add('<g data-box-group="list">')
    s.rect(36, ly, 360, 196, "legend", 10, "rel-list")
    s.text(52, ly + 28, "Iterable · 값을 담고 있음", 16, "s b", inside="rel-list")
    s.text(52, ly + 56, "numbers = [10, 20, 30]", 16, "t m b", inside="rel-list")
    list_cells(s, 52, ly + 74, 100, 44, 18, "rel-list")
    s.text(52, ly + 150, A_LIST_NOTE.split(" (")[0], 16, "err m", inside="rel-list")
    s.text(52, ly + 176, "(" + A_LIST_NOTE.split(" (")[1], 16, "s", inside="rel-list")
    s.add("</g>")
    ix = 560
    rows_y = {"a": ly, "b": ly + 108}
    for name in ("a", "b"):
        ry = rows_y[name]
        box = f"rel-{name}"
        s.rect(ix, ry, 688, 92, "card", 10, box)
        s.text(ix + 16, ry + 26, f"Iterator {name} = iter(numbers)", 16, "t m b", inside=box)
        pos = iterator_strip(s, name, ix + 16, ry + 38, 150, 42, 18, box)
        s.text(ix + 16 + 3 * 156 + 10, ry + 64, A_END[name].split(" → ")[0], 16, "t b", inside=box)
        if " → " in A_END[name]:
            s.text(ix + 16 + 3 * 156 + 10, ry + 86 - 2, "→ " + A_END[name].split(" → ")[1], 16, "s", inside=box)
        s.rel([(396, ly + 130), (478, ly + 130), (478, ry + 46), (ix - 2, ry + 46)], "list", name)
    s.text(406, ly + 92, "iter()", 16, "refT2 m")
    s.text(406, ly + 116, "새로 만듦", 16, "refT2")
    cy = ly + 220
    s.text(36, cy + 4, "호출 순서(실행 결과)", 16, "s b", inside="a1")
    cx = 36
    for n, (it, v) in enumerate(A_CALLS, start=1):
        box = f"acall-{n}"
        w = 222
        s.rect(cx, cy + 16, w, 40, "code", 8, box)
        s.step(cx + 22, cy + 36, str(n), 13, 16)
        s.text(cx + 42, cy + 42, f"next({it}) → {v}", 16, "t m b", inside=box, extra=f' data-out="{attr(f"next({it}) → {v}")}"')
        cx += w + 18
    oy = cy + 76
    for k, out in enumerate(A_OUTS):
        s.text(36 + k * 420, oy + 4, out, 16, "t m", inside="a1", extra=f' data-out="{attr(out)}"')
    behind(s, a1_at, 16, top, 1248, oy + 24 - top, "a1")
    y = oy + 48

    s.comment("A-2 포함 관계 (선·번호 없음)")
    s.text(16, y + 6, "A-2 포함 관계 — Generator는 Iterator의 한 종류, Iterator도 Iterable (순서가 아니므로 번호 없음)", 19, "t b")
    y = kinds_nested(s, 16, y + 24, 1248, 16) + 64

    # ── 그림 B ──────────────────────────────────────────────
    s.comment("그림 B. Generator 실행 상태 (generator_steps.py, 줄 추적으로 확인)")
    section_head(s, 16, y, "B", "Generator 실행 상태 — 호출, next(), yield에서 멈춤, 재개, 종료", 22)
    y += 26
    top = y
    b_at = len(s.body)
    s.text(36, y + 32, "count_up(limit) · print(…)는 학습용 출력(원고 4절에 전체 코드)", 18, "t b", inside="b-card")
    cb = code_listing(s, 36, y + 50, 300, 16, 26, "b-code")
    s.text(36, cb + 28, "회색 띠 = yield 줄(값을 내보내고 멈춤)", 16, "s", inside="b-card")
    hx = 356
    cols = [("호출", 0, 210), ("실행한 줄", 210, 210), ("밖으로 나온 값", 420, 190), ("그 뒤 상태 · 보관된 n", 610, 282)]
    for name, ox, w in cols:
        s.rect(hx + ox, y + 50, w, 34, "mxH", 0, f"bh-{ox}")
        s.text(hx + ox + 12, y + 73, name, 16, "t b", inside=f"bh-{ox}")
    ry = y + 84
    rh = 52
    for k, (call, ran, out, state, label) in enumerate(B_STEPS):
        box = f"call-b{k}"
        s.add(f'<g data-gstep="{k}" data-lines="{",".join(map(str, ran))}" data-value="{attr(out)}" data-state="{state}">')
        s.rect(hx, ry, 892, rh, "mx", 0, box)
        s.step(hx + 22, ry + rh / 2, str(k + 1), 13, 16)
        s.text(hx + 44, ry + rh / 2 + 6, call, 16, "t m b", inside=box)
        s.text(hx + 222, ry + rh / 2 + 6, lines_text(ran) + ("행" if ran else ""), 16, "t m", inside=box)
        vb = f"bval-{k}"
        if out != "—":
            vw = tw("→ " + out, 16, True) + 20
            s.rect(hx + 430, ry + 10, vw, rh - 20, "keptC" if state != "done" else "cellN", 6, vb)
            s.text(hx + 440, ry + rh / 2 + 6, "→ " + out, 16, "t m b", inside=vb)
        else:
            s.text(hx + 440, ry + rh / 2 + 6, "—", 16, "s", inside=box)
        sb = f"bstate-{k}"
        s.rect(hx + 618, ry + 8, 266, rh - 16, STATE_CLS[state], 6, sb)
        s.text(hx + 630, ry + rh / 2 + 6, label, 16, "pause" if state == "paused" else ("t b" if state == "done" else "s"), inside=sb)
        s.add("</g>")
        ry += rh
    note_y = ry + 30
    for k, t in enumerate(["호출과 실행은 다르다: count_up(3)은 객체만 만든다(실행한 줄 없음).",
                           "next()마다 멈춘 yield의 다음 줄(7행)부터 이어 가고, 지역변수 n이 남아 있다.",
                           "함수 끝에 닿으면 StopIteration — for문이면 반복이 정상 종료된다."]):
        s.text(hx, note_y + 26 * k, t, 16, "t b" if k == 0 else "t", inside="b-card")
    bot = max(cb + 40, note_y + 26 * 2 + 20)
    behind(s, b_at, 16, top, 1248, bot - top, "b-card")
    y = bot + 64

    # ── 그림 C ──────────────────────────────────────────────
    s.comment("그림 C. JSONL 스트리밍 흐름 (jsonl_generator.py). 변환(청록, 번호 없음)과 실행 순서(번호)를 구분")
    section_head(s, 16, y, "C", "JSONL 스트리밍 — 파일 한 줄 → dict → yield → 소비하는 코드", 22)
    y += 22
    s.rect(16, y, 1248, 56, "legend", 12)
    s.add(f'<path d="M{32} {y + 28}H{90}" class="conv" marker-end="url(#{s.idp}-cv)"/>')
    s.text(102, y + 34, "청록 선 = 데이터 모양 바꾸기(번호 없음)", 16)
    s.step(470, y + 28, "1", 13, 16)
    s.add(f'<path d="M{488} {y + 28}H{532}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
    s.text(544, y + 34, "번호 + 검은 선 = 한 건을 처리하는 실제 실행 순서", 16)
    y += 76
    top = y
    c_at = len(s.body)
    s.text(36, y + 32, "C-1 한 건이 지나가는 길 · 1행 기준(2행·3행도 같은 순서를 반복)", 19, "t b", inside="c-card")
    fy = y + 60
    s.add('<g data-c="file">')
    s.text(36, fy - 6 + 16, "transactions.jsonl", 16, "s m b", inside="c-card")
    fb = b4.file_lines(s, 36, fy + 20, 420, C_LINES, 16, 34, "cv-file", "c-file", hl=(1, 1))
    s.text(36, fb + 24, "1행을 꺼내는 중(파란 테두리)", 16, "s", inside="c-card")
    s.add("</g>")
    gx, gw = 520, 420
    gy = fy + 20
    s.add('<g data-c="gen">')
    s.rect(gx, gy, gw, 300, "paused", 12, "call-gen")
    s.text(gx + 16, gy + 26, "Generator · read_transactions(path)", 16, "t m b", inside="call-gen")
    s.rect(gx + 16, gy + 44, gw - 32, 60, "code", 8, "cv-str")
    s.text(gx + 28, gy + 66, "line · str", 16, "s b", inside="cv-str")
    s.text(gx + 28, gy + 92, C_STR[:24] + "…" + C_STR[-4:], 16, "t m", inside="cv-str", extra=f' data-str="{attr(C_STR)}"')
    s.conv([(gx + 60, gy + 104), (gx + 60, gy + 152)], "str", "dict")
    s.text(gx + 76, gy + 134, "json.loads(line)", 16, "convT m")
    s.rect(gx + 16, gy + 154, 220, 100, "obj", 8, "cv-dict")
    s.text(gx + 28, gy + 176, "dict", 16, "s b", inside="cv-dict")
    for k, (key, val) in enumerate(C_DICT):
        s.text(gx + 28, gy + 200 + 22 * k, key, 16, "t m", inside="cv-dict")
        s.text(gx + 132, gy + 200 + 22 * k, val, 16, "t m b", inside="cv-dict")
    s.text(gx + 252, gy + 210, "yield dict", 16, "pause m")
    s.text(gx + 252, gy + 234, "→ 여기서 멈춤", 16, "pause")
    s.text(gx + 16, gy + 286, "빈 줄은 건너뜀 · 잘못된 JSON은 멈춤", 16, "s", inside="call-gen")
    s.add("</g>")
    ux, uw = 1000, 248
    s.add('<g data-c="consumer">')
    s.rect(ux, gy, uw, 300, "card", 12, "call-consumer")
    s.text(ux + 16, gy + 26, "소비하는 코드", 16, "t b", inside="call-consumer")
    for k, ln in enumerate(["for row in rows:", "    total = total", "      + row[\"amount\"]"]):
        s.text(ux + 16, gy + 56 + 22 * k, ln, 16, "t m", inside="call-consumer")
    s.text(ux + 16, gy + 150, "받은 값(실행 결과)", 16, "s b", inside="call-consumer")
    for k, got in enumerate(C_GOT):
        s.text(ux + 16, gy + 176 + 24 * k, got.replace("dict · ", ""), 16, "t", inside="call-consumer", extra=f' data-got="{attr(got)}"')
    s.text(ux + 16, gy + 260, C_TOTAL, 16, "t m b", inside="call-consumer", extra=f' data-out="{attr(C_TOTAL)}"')
    s.text(ux + 16, gy + 284, "보관: 합계 하나", 16, "s", inside="call-consumer")
    s.add("</g>")
    # 실행 순서 1~5 (한 건)
    s.call([(ux - 2, gy + 70), (gx + gw + 2, gy + 70)], "consumer", "gen", "1")
    s.step(970, gy + 50, "1", 13, 16)
    s.call([(458, gy + 74), (gx - 2, gy + 74)], "file", "gen", "2")
    s.step(488, gy + 54, "2", 13, 16)
    s.step(gx + 252, gy + 128, "3", 13, 16)
    s.call([(gx + gw + 2, gy + 210), (ux - 2, gy + 210)], "gen", "consumer", "4")
    s.step(970, gy + 190, "4", 13, 16)
    s.step(ux + uw - 24, gy + 26, "5", 13, 16)
    sy = gy + 324
    for k, (n, t) in enumerate(C_STEPS):
        x = 36 + k * 244
        box = f"cstep-{n}"
        s.rect(x, sy, 232, 58, "legend", 8, box, extra=f' data-cstep="{n}"')
        s.step(x + 22, sy + 29, n, 13, 16)
        parts = t.split(" · ") if " · " in t else [t]
        if len(parts) == 1 and tw(t, 16) > 180:
            cut = t.rfind(" ", 0, 12)
            parts = [t[:cut], t[cut + 1:]]
        for j, p in enumerate(parts):
            s.text(x + 42, sy + 24 + 22 * j if len(parts) > 1 else sy + 35, p, 16, "t", inside=box)
    ny = sy + 90
    for k, t in enumerate(C_NOTE):
        s.text(36, ny + 26 * k, t, 16, "t b" if k == 0 else "t", inside="c-card")
    behind(s, c_at, 16, top, 1248, ny + 26 + 24 - top, "c-card")
    y = ny + 26 + 24 + 64

    # ── 그림 D ──────────────────────────────────────────────
    s.comment("그림 D. 다섯 가지 소비 방식 (five_ways.py). 방식 번호는 이름표 — 번호 원 없음")
    section_head(s, 16, y, "D", "같은 파일 3줄, 다섯 가지 소비 방식 — 꺼낸 줄과 남긴 거래", 22)
    y += 22
    s.rect(16, y, 1248, 56, "legend", 12, "legend-d")
    s.rect(32, y + 14, 70, 28, "readC", 6, "lg-read")
    s.text(48, y + 34, "1행", 16, "t", inside="lg-read")
    s.text(114, y + 34, "회색 점선 칸 = 파일에서 꺼낸 줄", 16, "t", inside="legend-d")
    s.rect(420, y + 14, 76, 28, "keptC", 6, "lg-kept")
    s.text(434, y + 34, "id 1", 16, "t b", inside="lg-kept")
    s.text(508, y + 34, "파란 굵은 칸 = 끝난 뒤 메모리에 남긴 거래", 16, "t", inside="legend-d")
    s.text(1248, y + 34, "방식 번호는 이름표(순서 아님)", 16, "s", "end", inside="legend-d")
    y += 72
    heads = [("방식", 16, 300), ("파일에서 꺼낸 줄", 316, 300), ("메모리에 남긴 거래", 616, 330), ("남기는 양 · 끝까지?", 946, 318)]
    for name, x, w in heads:
        s.rect(x, y, w, 36, "mxH", 0, f"dh-{x}")
        s.text(x + 14, y + 24, name, 16, "t b", inside=f"dh-{x}")
    y += 36
    for way in D_WAYS:
        no, name, code, read, kept, extra, order, full = way
        rh = 92
        s.add(f'<g data-way="{no}" data-read="{read}" data-kept="{",".join(map(str, kept))}">')
        box = f"way-{no}"
        s.rect(16, y, 300, rh, "mx", 0, box)
        s.text(30, y + 28, f"방식 {no} · {name}", 16, "t b", inside=box)
        s.text(30, y + 56, code[: code.index(" → ")] if " → " in code else code, 16, "t m", inside=box)
        if " → " in code:
            s.text(30, y + 80, "→ " + code[code.index(" → ") + 3:], 16, "t m", inside=box)
        rb = f"wayr-{no}"
        s.rect(316, y, 300, rh, "mx", 0, rb)
        way_row_cells(s, 330, y + 18, 84, 10, 16, way, rb)
        s.text(330, y + 78, f"{read}줄 꺼냄", 16, "s", inside=rb)
        kb = f"wayk-{no}"
        s.rect(616, y, 330, rh, "mx", 0, kb)
        kx = 630
        for rid in kept:
            cb2 = f"{kb}-{rid}"
            s.rect(kx, y + 18, 84, 32, "keptC", 6, cb2)
            s.text(kx + 14, y + 40, f"id {rid}", 16, "t b", inside=cb2)
            kx += 94
        if not kept:
            s.text(630, y + 40, "거래 0건", 16, "t b", inside=kb)
        s.text(630, y + 78, extra or f"{len(kept)}건 남김", 16, "s", inside=kb)
        ob = f"wayo-{no}"
        s.rect(946, y, 318, rh, "mx", 0, ob)
        s.text(960, y + 34, order, 16, "t m b", inside=ob, extra=f' data-order="{order}"')
        s.text(960, y + 66, "끝까지 읽음" if full else "필요한 곳까지만 읽음", 16, "t" if full else "t b", inside=ob, extra=f' data-full="{str(full).lower()}"')
        s.add("</g>")
        y += rh
    y += 16
    s.rect(16, y, 1248, 20 + 30 * len(D_NOTES), "legend", 10, "d-notes")
    for k, t in enumerate(D_NOTES):
        s.text(32, y + 32 + 30 * k, t, 16, "t b" if k == 0 else "t", inside="d-notes")
    y += 20 + 30 * len(D_NOTES) + 50
    for i, t in enumerate(FOOT):
        s.text(32, y + 26 * i, t, 16, "s")
    s.h = int(y + 26 * len(FOOT) + 8)
    s.save("generator-stream-desktop.svg", DESC)


# ══ 휴대전화용 (360) ═════════════════════════════════════════════
def mobile():
    s = Svg(360, 0, TITLE + " · 휴대전화용", "m6")
    for i, t in enumerate(["데이터를 꼭 한꺼번에", "꺼내야 할까?"]):
        s.text(12, 32 + 28 * i, t, 21, "t b")
    s.text(12, 86, "Scene 05 · Iterable·Iterator·Generator는", 14, "s")
    s.text(12, 106, "무엇이 다를까? JSONL을 한 건씩 읽기", 14, "s")
    y = 150

    s.comment("그림 A")
    section_head(s, 12, y, "A", "Iterable과 Iterator", 17)
    s.text(12, y + 26, "데이터는 하나, 진행 위치는 Iterator마다", 14, "s")
    y += 40
    s.rect(12, y, 336, 120, "legend", 12)
    s.step(32, y + 24, "1", 12, 14)
    s.text(54, y + 29, "번호 원 = 실제 next() 호출 순서", 14)
    s.add(f'<path d="M{20} {y + 62}H{70}" class="ref"/>')
    s.text(82, y + 67, "보라 점선 = iter()가 만들어 냄", 14)
    s.rect(20, y + 84, 56, 24, "took", 6)
    s.text(30, y + 101, "꺼냄", 14, "s")
    s.rect(84, y + 84, 56, 24, "nextC", 6)
    s.text(94, y + 101, "다음", 14, "t b")
    s.text(150, y + 101, "= 현재 위치", 14)
    y += 134
    top = y
    a_at = len(s.body)
    s.text(24, y + 26, "A-1 두 Iterator · 실행 결과", 15, "t b", inside="a1")
    ly = y + 40
    s.rect(20, ly, 320, 150, "legend", 10, "rel-list")
    s.text(32, ly + 24, "Iterable · 값을 담고 있음", 14, "s b", inside="rel-list")
    s.text(32, ly + 48, "numbers = [10, 20, 30]", 14, "t m b", inside="rel-list")
    list_cells(s, 32, ly + 62, 90, 36, 16, "rel-list")
    s.text(32, ly + 120, "next(numbers) → TypeError", 14, "err m", inside="rel-list")
    s.text(32, ly + 140, "(Iterator가 아님)", 14, "s", inside="rel-list")
    iy = ly + 150 + 50
    s.text(110, ly + 150 + 30, "iter()가 새로 만듦", 14, "refT2")
    for name in ("a", "b"):
        box = f"rel-{name}"
        s.rect(20, iy, 320, 120, "card", 10, box)
        s.text(32, iy + 24, f"Iterator {name} = iter(numbers)", 14, "t m b", inside=box)
        iterator_strip(s, name, 32, iy + 36, 94, 36, 15, box, mobile=True)
        s.text(32, iy + 92, A_END[name].split(" → ")[0], 14, "t b", inside=box)
        if " → " in A_END[name]:
            s.text(32, iy + 112, "→ " + A_END[name].split(" → ")[1], 14, "s", inside=box)
        iy += 132
    s.rel([(90, ly + 150), (90, ly + 150 + 48)], "list", "a")
    s.rel([(340, ly + 100), (344, ly + 100), (344, ly + 150 + 50 + 132 + 20), (340, ly + 150 + 50 + 132 + 20)], "list", "b")
    cy = iy + 4
    s.text(24, cy + 14, "호출 순서(실행 결과)", 14, "s b", inside="a1")
    cy += 24
    for n, (it, v) in enumerate(A_CALLS, start=1):
        box = f"acall-{n}"
        s.rect(20, cy, 320, 34, "code", 8, box)
        s.step(40, cy + 17, str(n), 12, 14)
        s.text(60, cy + 22, f"next({it}) → {v}", 14, "t m b", inside=box, extra=f' data-out="{attr(f"next({it}) → {v}")}"')
        cy += 40
    for k, out in enumerate(A_OUTS):
        s.text(24, cy + 16 + 22 * k, out, 14, "t m", inside="a1", extra=f' data-out="{attr(out)}"')
    bot = cy + 16 + 22 + 16
    behind(s, a_at, 12, top, 336, bot - top, "a1")
    y = bot + 24
    s.text(12, y + 6, "A-2 포함 관계(번호 없음)", 15, "t b")
    y = kinds_nested(s, 12, y + 20, 336, 14, mobile=True) + 50

    s.comment("그림 B")
    section_head(s, 12, y, "B", "Generator 실행 상태", 17)
    s.text(12, y + 26, "호출 → next() → yield에서 멈춤 → 재개 → 종료", 14, "s")
    y += 40
    cb = code_listing(s, 12, y, 336, 14, 22, "b-code", mobile=True)
    s.text(12, cb + 22, "print(…)는 학습용 출력(원고 4절에 전체 코드)", 14, "s")
    y = cb + 40
    for k, (call, ran, out, state, label) in enumerate(B_STEPS):
        box = f"call-b{k}"
        h = 118
        s.add(f'<g data-gstep="{k}" data-lines="{",".join(map(str, ran))}" data-value="{attr(out)}" data-state="{state}">')
        s.rect(12, y, 336, h, "mx", 8, box)
        s.step(32, y + 22, str(k + 1), 12, 14)
        s.text(52, y + 27, call, 14, "t m b", inside=box)
        s.text(24, y + 52, "실행한 줄 " + lines_text(ran) + ("행" if ran else ""), 14, "t m", inside=box)
        vb = f"bval-{k}"
        if out != "—":
            vw = tw("→ " + out, 14, True) + 18
            s.rect(236 if state != "done" else 194, y + 10, vw, 26, "keptC" if state != "done" else "cellN", 6, vb)
            s.text((236 if state != "done" else 194) + 9, y + 28, "→ " + out, 14, "t m b", inside=vb)
        sb = f"bstate-{k}"
        s.rect(20, y + 66, 320, 40, STATE_CLS[state], 6, sb)
        s.text(30, y + 91, label, 14, "pause" if state == "paused" else ("t b" if state == "done" else "s"), inside=sb)
        s.add("</g>")
        y += h + 14
    for k, t in enumerate(["호출은 객체만 만들고, next()마다 멈춘", "yield의 다음 줄(7행)부터 이어 간다.", "지역변수 n도 남아 있다."]):
        s.text(12, y + 22 * k, t, 14, "t b" if k == 0 else "t")
    y += 66 + 30

    s.comment("그림 C")
    section_head(s, 12, y, "C", "JSONL 스트리밍", 17)
    s.text(12, y + 26, "파일 한 줄 → dict → yield → 소비하는 코드", 14, "s")
    y += 40
    s.rect(12, y, 336, 96, "legend", 12)
    s.add(f'<path d="M{20} {y + 26}H{70}" class="conv" marker-end="url(#{s.idp}-cv)"/>')
    s.text(82, y + 31, "청록 선 = 데이터 모양 바꾸기", 14)
    s.step(32, y + 68, "1", 12, 14)
    s.add(f'<path d="M{47} {y + 68}H{78}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
    s.text(90, y + 73, "번호·검은 선 = 실제 실행 순서", 14)
    y += 110
    s.text(12, y + 8, "C-1 한 건이 지나가는 길 · 1행 기준", 15, "t b")
    y += 22
    s.add('<g data-c="file">')
    s.text(344, y + 10, "transactions.jsonl", 14, "s m b", "end")
    fb = b4.file_lines(s, 12, y + 18, 336, C_LINES, 14, 26, "cv-file", "c-file", gutter=False, pad=6, hl=(1, 1))
    s.add("</g>")
    gy = fb + 80
    s.call([(300, fb + 2), (300, gy - 2)], "file", "gen", "2")
    s.step(276, fb + 36, "2", 12, 14)
    s.text(256, fb + 41, "한 줄 꺼냄", 14, "t b", "end")
    s.add('<g data-c="gen">')
    s.rect(12, gy, 336, 272, "paused", 12, "call-gen")
    s.text(24, gy + 24, "Generator · read_transactions(path)", 14, "t m b", inside="call-gen")
    s.rect(20, gy + 38, 320, 56, "code", 8, "cv-str")
    s.text(30, gy + 58, "line · str", 14, "s b", inside="cv-str")
    s.text(30, gy + 82, C_STR[:24] + "…" + C_STR[-4:], 14, "t m", inside="cv-str", extra=f' data-str="{attr(C_STR)}"')
    s.conv([(60, gy + 94), (60, gy + 138)], "str", "dict")
    s.text(76, gy + 122, "json.loads(line)", 14, "convT m")
    s.step(250, gy + 116, "3", 12, 14)
    s.rect(20, gy + 140, 200, 92, "obj", 8, "cv-dict")
    s.text(30, gy + 160, "dict", 14, "s b", inside="cv-dict")
    for k, (key, val) in enumerate(C_DICT):
        s.text(30, gy + 182 + 20 * k, key, 14, "t m", inside="cv-dict")
        s.text(124, gy + 182 + 20 * k, val, 14, "t m b", inside="cv-dict")
    s.text(232, gy + 176, "yield dict", 14, "pause m")
    s.text(232, gy + 198, "→ 여기서", 14, "pause")
    s.text(232, gy + 218, "멈춤", 14, "pause")
    s.text(24, gy + 258, "빈 줄은 건너뜀 · 잘못된 JSON은 멈춤", 14, "s", inside="call-gen")
    s.add("</g>")
    uy = gy + 272 + 80
    s.call([(300, gy + 272 + 2), (300, uy - 2)], "gen", "consumer", "4")
    s.step(276, gy + 272 + 36, "4", 12, 14)
    s.text(256, gy + 272 + 41, "dict를 건넴", 14, "t b", "end")
    s.call([(52, uy - 2), (52, gy + 272 + 2)], "consumer", "gen", "1")
    s.step(76, gy + 272 + 36, "1", 12, 14)
    s.text(96, gy + 272 + 41, "next() 요청", 14, "t b")
    s.add('<g data-c="consumer">')
    s.rect(12, uy, 336, 236, "card", 12, "call-consumer")
    s.text(24, uy + 24, "소비하는 코드", 14, "t b", inside="call-consumer")
    s.step(320, uy + 20, "5", 12, 14)
    for k, ln in enumerate(["for row in rows:", "    total = total + row[\"amount\"]"]):
        s.text(24, uy + 50 + 22 * k, ln, 14, "t m", inside="call-consumer")
    s.text(24, uy + 106, "받은 값(실행 결과)", 14, "s b", inside="call-consumer")
    for k, got in enumerate(C_GOT):
        s.text(24, uy + 130 + 22 * k, got.replace("dict · ", ""), 14, "t", inside="call-consumer", extra=f' data-got="{attr(got)}"')
    s.text(24, uy + 200, C_TOTAL, 14, "t m b", inside="call-consumer", extra=f' data-out="{attr(C_TOTAL)}"')
    s.text(24, uy + 222, "보관: 합계 하나", 14, "s", inside="call-consumer")
    s.add("</g>")
    y = uy + 236 + 16
    for n, t in C_STEPS:
        box = f"cstep-{n}"
        s.rect(12, y, 336, 34, "legend", 8, box, extra=f' data-cstep="{n}"')
        s.step(32, y + 17, n, 12, 14)
        s.text(52, y + 22, t, 14, "t", inside=box)
        y += 40
    for k, t in enumerate(["파일 객체도 Iterator(iter(f) is f).", "for line in f만으로도 한 줄씩 읽고,", "Generator는 변환(json.loads)을 더한다."]):
        s.text(12, y + 14 + 22 * k, t, 14, "t b" if k == 0 else "t")
    y += 66 + 40

    s.comment("그림 D")
    section_head(s, 12, y, "D", "다섯 가지 소비 방식", 17)
    s.text(12, y + 26, "같은 파일 3줄 · 꺼낸 줄과 남긴 거래", 14, "s")
    y += 40
    s.rect(12, y, 336, 112, "legend", 12, "legend-d")
    s.rect(20, y + 12, 56, 26, "readC", 6, "lg-read")
    s.text(32, y + 30, "1행", 14, "t", inside="lg-read")
    s.text(86, y + 30, "회색 점선 = 꺼낸 줄", 14, "t", inside="legend-d")
    s.rect(20, y + 46, 64, 26, "keptC", 6, "lg-kept")
    s.text(30, y + 64, "id 1", 14, "t b", inside="lg-kept")
    s.text(94, y + 64, "파란 굵은 칸 = 남긴 거래", 14, "t", inside="legend-d")
    s.text(20, y + 98, "방식 번호는 이름표(순서 아님)", 14, "s", inside="legend-d")
    y += 126
    for way in D_WAYS:
        no, name, code, read, kept, extra, order, full = way
        box = f"way-{no}"
        h = 48 + 20 * len(code.split(" → ")) + 8 + 70 + 48 + 34
        s.add(f'<g data-way="{no}" data-read="{read}" data-kept="{",".join(map(str, kept))}">')
        s.rect(12, y, 336, h, "mx", 8, box)
        s.text(24, y + 24, f"방식 {no} · {name}", 15, "t b", inside=box)
        parts = code.split(" → ")
        for j, p in enumerate(parts):
            s.text(24, y + 48 + 20 * j, ("→ " if j and " → " in code else "") + p, 14, "t m", inside=box)
        ry = y + 48 + 20 * len(parts) + 8
        s.text(24, ry + 4, "꺼낸 줄", 14, "s b", inside=box)
        rb = f"wayr-{no}"
        s.rect(20, ry + 12, 320, 40, "mx", 6, rb)
        way_row_cells(s, 28, ry + 18, 66, 8, 14, way, rb)
        s.text(332, ry + 37, f"{read}줄", 14, "s", "end", inside=rb)
        ky = ry + 70
        s.text(24, ky, "남긴 거래", 14, "s b", inside=box)
        kb = f"wayk-{no}"
        s.rect(20, ky + 8, 320, 40, "mx", 6, kb)
        kx = 28
        for rid in kept:
            cb2 = f"{kb}-{rid}"
            s.rect(kx, ky + 14, 62, 28, "keptC", 6, cb2)
            s.text(kx + 10, ky + 33, f"id {rid}", 14, "t b", inside=cb2)
            kx += 70
        if not kept:
            s.text(28, ky + 33, "거래 0건 · " + extra, 14, "t b", inside=kb)
        s.text(24, y + h - 12, order, 14, "t m b", inside=box, extra=f' data-order="{order}"')
        s.text(110, y + h - 12, "끝까지 읽음" if full else "필요한 곳까지만 읽음", 14, "t" if full else "t b", inside=box, extra=f' data-full="{str(full).lower()}"')
        s.add("</g>")
        y += h + 10
    notes_m = [
        ["JSONL은 저장 형식, Generator는 실행 방식.", "남는 양은 결과를 보관하는 방식이 정한다."],
        ["deque(maxlen=N)은 N개만 남기지만", "그것을 알려면 끝까지 읽을 수 있다."],
        ["보관량과 처리 시간은 다르다(측정 안 함).", "끝까지 읽으면 많을수록 시간이 늘 수 있다."],
        ["꺼낸 줄 = Python이 받은 줄(내부 버퍼 별도).", "CSV도 행 단위 순차 처리(한 행 ≠ 한 줄 가능)."],
    ]
    nh = 16 + sum(22 * len(n) + 10 for n in notes_m)
    s.rect(12, y + 6, 336, nh, "legend", 10, "d-notes")
    yy = y + 6 + 24
    for k, n in enumerate(notes_m):
        for j, t in enumerate(n):
            s.text(22, yy + 22 * j, t, 14, "t b" if k == 0 else "t", inside="d-notes")
        yy += 22 * len(n) + 10
    y += nh + 36
    for i, t in enumerate(FOOT_M):
        s.text(12, y + 22 * i, t, 14, "s")
    s.h = int(y + 22 * len(FOOT_M) + 4)
    s.save("generator-stream-mobile.svg", DESC)


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
