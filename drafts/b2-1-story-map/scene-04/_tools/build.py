"""B2-1 Scene 04 (프로그램을 종료해도 데이터가 남는 이유는 무엇일까?) 노트북·휴대전화 SVG 생성기.

Scene 03-B 생성기(../../scene-03b/_tools/build.py)의 그리기 도구를 불러 쓴다(그 안에서 Scene 01·02·03-A 도구도 쓴다). 네 파일은 바꾸지 않는다.
그림의 데이터 상태·파일 내용·읽은 결과·처리 순서·실행 결과는 _tools/demo/의 실제 실행 결과이며, verify_demo.py가 대조한다.

시각 약속(Scene 01~03-B 약속 유지 + 저장 위치·변환 표시 추가):
- 메모리 칸 = 파란 파선 테두리 + '메모리' 글자(실행 중에만 있음), 사라진 메모리 = 회색 점선 + '사라짐'
- 파일 칸   = 초록 굵은 실선 테두리 + '파일' 글자(프로그램 밖에 남음), 파일 없음 = 회색 가는 테두리 + '파일 없음'
- 새로 생긴 거래·줄 = 초록 실선 행 + '+' 표시(03-B 행 표시), 값 변경 = 이전 값 취소선 → 새 값(03-B)
- 데이터 모양 바꾸기(그림 C-1) = 청록 실선 + 채운 청록 화살촉 + 함수 이름, 번호 없음
- 실제 처리 순서(그림 C-2) = 검은 번호 원 + 진한 실선·채운 화살촉(호출 추적으로 확인)
- 그림 A·B·C-1·표·다음 질문에는 번호 원을 쓰지 않는다. 색만으로 구분하지 않는다.

실행: python -I build.py  (출력: ../file-persistence-desktop.svg, ../file-persistence-mobile.svg)
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location("scene03b_build", os.path.join(HERE, "..", "..", "scene-03b", "_tools", "build.py"))
b3 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(b3)
s3, s2, s1 = b3.s3, b3.s2, b3.s1
tw, esc, section_head, code_lines = s1.tw, s1.esc, s1.section_head, b3.code_lines


def attr(s):
    """data-* 속성 값용(Scene 01의 esc()는 큰따옴표를 바꾸지 않는다)."""
    return esc(s).replace('"', "&quot;")

# ── 내용 (노트북·휴대전화 공통) ────────────────────────────────
TITLE = "프로그램을 종료해도 데이터가 남는 이유는 무엇일까?"
SUB = "메모리와 파일을 구별하고, JSON·JSONL·CSV로 저장하고 다시 읽기"

# 그림 A: (단계 id, 노트북 머리글 두 줄, 휴대전화 머리글)
STEPS_A = [
    ("start", ("실행 1", "시작"), "실행 1 시작"),
    ("add", ("메모리에", "거래 추가"), "메모리에 거래 추가"),
    ("save", ("파일에", "저장"), "파일에 저장"),
    ("exit", ("프로그램", "종료"), "프로그램 종료"),
    ("load", ("실행 2", "파일 읽기"), "실행 2 · 파일 읽기"),
    ("restore", ("거래 목록", "복원"), "거래 목록 복원"),
]
# 칸: 메모리 ("ids", [id…], 새 id, 설명) | ("gone", 설명) / 파일 ("ids", …) | ("none", 설명)
CELLS_A = {
    "nosave": [
        (("ids", [1, 2], None, "코드의 처음 목록"), ("none", "파일 없음")),
        (("ids", [1, 2, 3], 3, "append()"), ("none", "파일 없음")),
        (("ids", [1, 2, 3], None, ""), ("none", "저장 코드 없음")),
        (("gone", "실행이 끝남"), ("none", "파일 없음")),
        (("ids", [1, 2], None, "처음 목록에서 다시"), ("none", "읽을 파일 없음")),
        (("ids", [1, 2], None, "id 3 없음"), ("none", "파일 없음")),
    ],
    "save": [
        (("ids", [1, 2], None, "load_all()로 읽음"), ("ids", [1, 2], None, "2줄")),
        (("ids", [1, 2, 3], 3, "create()"), ("ids", [1, 2], None, "아직 2줄")),
        (("ids", [1, 2, 3], None, ""), ("ids", [1, 2, 3], 3, 'append_one() "a"')),
        (("gone", "실행이 끝남"), ("ids", [1, 2, 3], None, "3줄 그대로")),
        (("ids", [1, 2, 3], None, "load_all()로 읽음"), ("ids", [1, 2, 3], None, "3줄")),
        (("ids", [1, 2, 3], None, "3건 복원"), ("ids", [1, 2, 3], None, "3줄")),
    ],
}
RECORD = {1: ("식비", 8000), 2: ("교통", 2000), 3: ("문구", 3000)}
ROWS_A = [
    ("nosave", "저장하지 않는 프로그램 · memory_only.py",
     [("python memory_only.py add", "메모리의 거래: 3건 · id [1, 2, 3]"), ("python memory_only.py", "메모리의 거래: 2건 · id [1, 2]")]),
    ("save", "파일에 저장하는 프로그램 · file_crud.py (8절)",
     [("python file_crud.py add 문구 3000", "[C] 파일 끝에 한 줄 추가: {'id': 3, 'category': '문구', 'amount': 3000}"),
      ("python file_crud.py list", "파일에서 읽음: 3건")]),
]
A_NOTE = "아래 줄은 실행 1이 끝나 메모리가 비어도 파일의 3줄이 남고, 실행 2가 그 파일을 읽어 목록을 되살립니다."

# 그림 B: 같은 거래 3건을 세 형식으로 (json_basics.py · jsonl_basics.py 1~3행 · csv_basics.py가 만든 파일)
JSON_LINES = [
    "[",
    "  {", '    "id": 1,', '    "category": "식비",', '    "amount": 8000', "  },",
    "  {", '    "id": 2,', '    "category": "교통",', '    "amount": 2000', "  },",
    "  {", '    "id": 3,', '    "category": "문구",', '    "amount": 3000', "  }",
    "]",
]
JSONL_LINES = ['{"id":1,"category":"식비","amount":8000}', '{"id":2,"category":"교통","amount":2000}',
               '{"id":3,"category":"문구","amount":3000}']
CSV_LINES = ["id,category,amount", "1,식비,8000", "2,교통,2000", "3,문구,3000"]
# (id, 이름, 파일, 한 줄 설명, 파일 줄, 거래 id 2가 있는 줄 범위, 구조 설명, 읽는 코드, 읽은 결과, amount의 종류, (장점, 주의))
FORMATS = [
    ("json", "JSON", "transactions.json", "하나의 JSON 문서", JSON_LINES, (7, 11),
     ["파란 테두리 = 거래 id 2 → 5줄", "[ ] 배열 하나 = 파일 전체", "{ } 객체 하나 = 거래 1건", "한 건 추가 → 전체를 다시 쓰기"],
     "json.load(f)", ["리스트 1개 안에 dict 3개", "amount → 8000 (int)"], "int",
     ("구조·중첩을 문서 하나로", "문서 전체를 한 번에 해석")),
    ("jsonl", "JSONL", "transactions.jsonl", "한 줄에 JSON 값 하나", JSONL_LINES, (2, 2),
     ["파란 테두리 = 거래 id 2 → 1줄", "한 줄 = JSON 값 하나 = 거래 1건", "파일 전체는 JSON 값 하나가 아님", '한 건 추가 → "a"로 끝에 한 줄'],
     "json.loads(line)", ["줄마다 dict 1개", "amount → 8000 (int)"], "int",
     ("한 줄씩 추가·처리", "한 건이 한 줄을 넘으면 안 됨")),
    ("csv", "CSV", "transactions.csv", "행과 열의 표", CSV_LINES, (3, 3),
     ["파란 테두리 = 거래 id 2 → 1행", "1행 = 헤더(열 이름) · 구분자 = 쉼표", '쉼표가 든 값은 "…"로 감쌈', '한 건 추가 → "a"로 끝에 한 행'],
     "csv.DictReader(f)", ["행마다 dict 1개(헤더 = 키)", "amount → '8000' (str)"], "str",
     ("표 계산 프로그램과 교환", ' 값은 문자열 · newline=""'.strip())),
]
B_NOTE = "어느 형식이 정답이라는 규칙은 없습니다. 쌓이는 기록인지, 표로 열어 볼 것인지, 구조가 깊은지 — 프로그램의 요구와 설계로 고릅니다."

# 그림 C-1: jsonl_basics.py
C1_DICT = [("id", "4"), ("category", "'식비'"), ("amount", "5000")]
C1_NEW = '{"id":4,"category":"식비","amount":5000}'
C1_READS = ["dict · id 1 · 식비 · 8000", "dict · id 2 · 교통 · 2000", "dict · id 3 · 문구 · 3000", "dict · id 4 · 식비 · 5000"]
C1_OUTS = ["파일 전체를 json.loads() 하나로 읽으면: JSONDecodeError - Extra data",
           "한 줄씩 읽었지만 리스트에 모두 모으면: 4건이 한꺼번에 메모리에 있음"]
# 그림 C-2: python file_crud.py update 2 2500 (호출 추적으로 확인)
C2_COMMAND = "python file_crud.py update 2 2500"
C2_BEFORE = ['{"id":1,"category":"식비","amount":8000}', '{"id":2,"category":"교통","amount":2000}',
             '{"id":3,"category":"문구","amount":3000}']
C2_AFTER = ['{"id":1,"category":"식비","amount":8000}', '{"id":2,"category":"교통","amount":2500}',
            '{"id":3,"category":"문구","amount":3000}']
C2_UPDATE = (2, 2000, 2500)
C2_STEPS = [("file0", "mem", "1", "load_all()"), ("mem", "mem", "2", "update_amount(items, 2, 2500)"),
            ("mem", "temp", "3", "save_all()"), ("temp", "file1", "4", "os.replace()")]
C2_RESULT = "[U] 파일 전체를 다시 씀: {'id': 2, 'category': '교통', 'amount': 2500}"
# (id, 동작, 메모리에서, 파일에서, 파일 모드)
CRUD_FILE = [
    ("create", "Create", "create(): 리스트에 추가", "append_one(): 끝에 한 줄", '"a"'),
    ("read", "Read", "load_all()의 리스트를 그대로", "load_all(): 한 줄씩 json.loads()", '"r"'),
    ("update", "Update", "update_amount(): 값 변경", "save_all(): 전체를 임시 파일에 → 교체", '"w"(임시 파일)'),
    ("delete", "Delete", "delete(): 리스트에서 제거", "save_all(): 남은 항목으로 다시 쓰기", '"w"(임시 파일)'),
]
CRUD_NOTE = "없는 id면 메모리 함수가 None을 돌려주고 파일은 다시 쓰지 않습니다. 전체 다시 쓰기는 가능한 방법 가운데 하나입니다."
BRIDGE_Q = "거래 데이터가 10만 건이라면, 파일 전체를 한꺼번에 읽어 메모리에 올려야 할까?"
BRIDGE_CLUES = [
    "JSONL·CSV는 한 줄(한 행)씩 읽을 수 있는 형식이다 — for line in f",
    "그래도 load_all()처럼 결과를 리스트에 모두 모으면 전체가 메모리에 올라온다",
    "메모리 사용량은 형식이 아니라 읽는 방법과 결과를 보관하는 방법이 정한다",
]
BRIDGE_NEXT = "→ Scene 05: Iterable · Iterator · Generator · yield로 필요할 때 한 건씩 읽기"
FOOT = [
    "모든 예제는 Scene 04 학습용 예제입니다(memory_only.py, json_basics.py, jsonl_basics.py, csv_basics.py, file_crud.py 등). 실제 미션 구현이나 정답이 아닙니다.",
    "그림의 데이터 상태·파일 내용·읽은 결과·처리 순서·실행 결과는 예제를 임시 실습 폴더에서 실제로 실행하고 호출을 추적해 확인했습니다(Python 3.14.6).",
]
FOOT_M = [
    "모든 예제는 Scene 04 학습용 예제입니다.",
    "실제 미션 구현이나 정답이 아닙니다.",
    "상태·파일·결과는 실제 실행으로 확인했습니다.",
]
DESC = (
    "Scene 04. 그림 A는 메모리와 파일을 서로 다른 저장 위치로 나누어, 저장하지 않는 프로그램(memory_only.py)과 파일에 저장하는 프로그램(file_crud.py)을 "
    "실행 1 시작, 메모리에 거래 추가, 파일에 저장, 프로그램 종료, 실행 2 파일 읽기, 거래 목록 복원의 여섯 단계로 비교한다. "
    "저장하지 않는 프로그램은 실행 1에서 id 3을 추가해 메모리에 3건이 되지만 저장하는 코드가 없고, 종료하면 메모리가 사라져 실행 2는 코드의 처음 목록 2건(id 1, 2)에서 다시 시작한다. "
    "파일에 저장하는 프로그램은 실행 1이 파일의 2줄을 읽고, id 3을 만들어 파일 끝에 한 줄 덧붙여 파일이 3줄이 된다. 종료해 메모리가 사라져도 파일 3줄은 남고, 실행 2가 파일을 읽어 3건을 복원한다. "
    "그림 B는 같은 거래 3건(1 식비 8000, 2 교통 2000, 3 문구 3000)을 JSON(배열 하나 안에 객체 3개, 17줄), JSONL(한 줄에 객체 하나, 3줄), CSV(헤더 id,category,amount와 데이터 3행)로 보여 준다. "
    "Python으로 읽으면 JSON은 json.load로 리스트 하나, JSONL은 줄마다 json.loads로 딕셔너리 하나, CSV는 csv.DictReader로 행마다 딕셔너리 하나이며 CSV의 amount는 문자열 '8000'이다. "
    "어느 형식이 정답이라는 규칙은 없고 프로그램의 요구와 설계로 고른다. "
    "그림 C-1은 JSONL 쓰기와 읽기다. 딕셔너리 id 4 식비 5000을 json.dumps로 한 줄 문자열로 바꾸고 a 모드로 파일 끝 4행에 쓴다. "
    "읽을 때는 for line in f로 한 줄씩 꺼내 json.loads로 딕셔너리로 바꾼다. 파일 전체를 json.loads 하나로 읽으면 Extra data 오류가 나고, 한 줄씩 읽어도 리스트에 모으면 4건이 한꺼번에 메모리에 있다. "
    "그림 C-2는 python file_crud.py update 2 2500의 처리 순서다. 1 load_all이 파일 3줄을 메모리 리스트로 읽고, 2 update_amount가 id 2의 금액을 2000에서 2500으로 바꾸고, "
    "3 save_all이 전체를 임시 파일 transactions.jsonl.tmp에 쓰고, 4 os.replace가 임시 파일로 원래 파일을 바꾼다. Create는 a 모드로 한 줄 덧붙이고, Read는 한 줄씩 읽고, Update와 Delete는 전체를 다시 쓴다. "
    "다음 질문은 거래 데이터가 10만 건이라면 파일 전체를 한꺼번에 읽어 메모리에 올려야 하는가이며 Scene 05로 이어진다."
)

EXTRA = """      .mem { fill: #f3f7fd; stroke: #1d4f91; stroke-width: 1.8; stroke-dasharray: 7 5; }
      .memGone { fill: #f1f3f5; stroke: #8a96a3; stroke-width: 1.4; stroke-dasharray: 2 4; }
      .disk { fill: #f2f9f4; stroke: #17663f; stroke-width: 2.6; }
      .diskNone { fill: #ffffff; stroke: #b8c2cc; stroke-width: 1.2; }
      .laneM { fill: #1d4f91; font-weight: 700; }
      .laneF { fill: #17663f; font-weight: 700; }
      .conv { fill: none; stroke: #0f6e6e; stroke-width: 2.4; }
      .convT { fill: #0f6e6e; font-weight: 700; }
      .gut { fill: #7b8794; }
      .band { fill: #eef2f6; }
"""


class Svg(b3.Svg):
    def conv(self, pts, frm, to):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="conv" marker-end="url(#{self.idp}-cv)" data-conv="{frm}>{to}"/>')

    def save(self, name, desc):
        tid, did = f"{self.idp}-title", f"{self.idp}-desc"
        style = s1.STYLE.replace("    </style>", s2.EXTRA_STYLE + s3.EXTRA + b3.EXTRA + EXTRA + "    </style>")
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


def wrap_out(out, size=14, limit=300):
    """휴대전화용으로 긴 실행 결과 한 줄을 화면 줄 여러 개로 나눈다(실제 출력은 한 줄, data-out은 원래 줄)."""
    parts = [out]
    if ": {" in out:
        head, rest = out.split(": {", 1)
        parts = [head + ":", "{" + rest]
    done = []
    for p in parts:
        if tw(p, size, True) > limit and ", 'amount'" in p:
            i = p.index(", 'amount'")
            done += [p[: i + 1], "  " + p[i + 2:]]
        else:
            done.append(p)
    return done


def behind(s, at, x, y, w, h, box):
    """내용을 다 그린 뒤 높이를 알게 된 카드를 내용 뒤(at 위치)에 넣는다."""
    s.rect(x, y, w, h, "card", 12, box)
    s.body.insert(at, s.body.pop())


def rec_text(rid, amount=None):
    cat, amt = RECORD[rid]
    return f"{rid} · {cat} · {amount if amount is not None else amt}"


def cell_attr(row, k, lane, spec):
    ids = ",".join(str(i) for i in spec[1]) if spec[0] == "ids" else ""
    new = f' data-new="{spec[2]}"' if spec[0] == "ids" and spec[2] else ""
    return f' data-cell="{row}:{k + 1}:{lane}" data-state="{spec[0]}" data-ids="{ids}"{new}'


def legend_a(s, x, y, w, size, mobile=False):
    items = [("mem", "메모리", "laneM", "프로그램 실행 중에만 있음"), ("disk", "파일", "laneF", "프로그램 밖에 남음"),
             ("rowAdd", "+ 새 거래", "tagAdd", "이 단계에서 새로 생김"), ("memGone", "사라짐", "s b", "실행이 끝나 회수됨")]
    if mobile:
        h = 20 + 34 * len(items)
        s.rect(x, y, w, h, "legend", 12, "legend-a")
        for k, (rc, tag, tc, mean) in enumerate(items):
            yy = y + 12 + 34 * k
            s.add(f'<rect x="{x + 12}" y="{yy}" width="96" height="26" rx="6" class="{rc}" data-box="lg-{rc}"/>')
            s.text(x + 22, yy + 18, tag, size, tc, inside=f"lg-{rc}")
            s.text(x + 118, yy + 18, mean, size, "t", inside="legend-a")
        return y + h
    s.rect(x, y, w, 56, "legend", 12, "legend-a")
    xx = x + 16
    for rc, tag, tc, mean in items:
        bw = tw(tag, size) + 26
        s.add(f'<rect x="{xx}" y="{y + 14}" width="{bw:g}" height="28" rx="6" class="{rc}" data-box="lg-{rc}"/>')
        s.text(xx + 12, y + 34, tag, size, tc, inside=f"lg-{rc}")
        s.text(xx + bw + 12, y + 34, mean, size, "t", inside="legend-a")
        xx += bw + 12 + tw(mean, size) + 36
    return y + 56


def legend_c(s, x, y, w, size, mobile=False):
    """그림 C의 선 약속: 변환(번호 없음)과 실제 처리 순서(번호)."""
    if mobile:
        s.rect(x, y, w, 96, "legend", 12)
        s.add(f'<path d="M{x + 14} {y + 26}H{x + 68}" class="conv" marker-end="url(#{s.idp}-cv)"/>')
        s.text(x + 82, y + 31, "청록 선 = 데이터 모양 바꾸기", size)
        s.step(x + 20, y + 68, "1", 12, 14)
        s.add(f'<path d="M{x + 35} {y + 68}H{x + 70}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
        s.text(x + 82, y + 73, "번호·검은 선 = 실제 처리 순서", size)
        return y + 96
    s.rect(x, y, w, 56, "legend", 12)
    yy = y + 34
    s.add(f'<path d="M{x + 16} {yy - 6}H{x + 74}" class="conv" marker-end="url(#{s.idp}-cv)"/>')
    s.text(x + 86, yy, "청록 선 + 함수 이름 = 데이터 모양 바꾸기 (C-1, 번호 없음)", size)
    s.step(x + 640, yy - 6, "1", 13, 16)
    s.add(f'<path d="M{x + 658} {yy - 6}H{x + 702}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
    s.text(x + 714, yy, "번호 + 검은 선 = 실제 처리 순서 (C-2, 호출 추적)", size)
    return y + 56


def chips(s, x, y, w, ids, new, size, step, box, upd=None):
    """거래 칩 목록. upd = (id, 이전 금액, 새 금액)."""
    for k, rid in enumerate(ids):
        cb = f"{box}-r{rid}"
        cls = "rowAdd" if rid == new else ("rowUpd" if upd and rid == upd[0] else "rowN")
        s.rect(x, y + k * step, w, step - 4, cls, 6, cb)
        ty = y + k * step + (step - 4) / 2 + size * 0.36
        if rid == new:
            s.text(x + 10, ty, "+ " + rec_text(rid), size, "tagAdd", inside=cb)
        elif upd and rid == upd[0]:
            head = f"{rid} · {RECORD[rid][0]} · "
            hx = x + 10 + tw(head, size)
            s.text(x + 10, ty, head, size, "t", inside=cb)
            s.text(hx, ty, str(upd[1]), size, "s m", inside=cb)
            ow = tw(str(upd[1]), size, True)
            s.add(f'<path d="M{hx - 2:g} {ty - size * 0.32:g}H{hx + ow + 2:g}" class="strikeU"/>')
            s.text(hx + ow + 8, ty, f"→ {upd[2]}", size, "t m b", inside=cb)
        else:
            s.text(x + 10, ty, rec_text(rid), size, "t", inside=cb)
    return y + len(ids) * step


def file_lines(s, x, y, w, lines, size, step, box, fmt, gutter=True, new_at=None, tag=None, pad=14, hl=None):
    """파일 내용 상자(줄 번호 포함). 줄마다 data-line. new_at = 새로 덧붙인 줄 번호(1부터), hl = 같은 거래(id 2)가 있는 줄 범위."""
    h = 14 + step * len(lines)
    s.rect(x, y, w, h, "code", 10, box)
    if hl:
        a, b = hl
        s.add(f'<rect x="{x + 4:g}" y="{y + 7 + step * (a - 1):g}" width="{w - 8:g}" height="{step * (b - a + 1):g}" rx="6" '
              f'class="rowSel" data-box="{box}-hl" data-hl="2" data-hl-lines="{a}-{b}"/>')
    s.add(f'<g data-format="{fmt}">')
    for k, ln in enumerate(lines):
        ty = y + 8 + step * (k + 1) - 6
        tx = x + pad
        if new_at == k + 1:
            rb = f"{box}-new"
            s.rect(x + 4, ty - step + 8, w - 8, step - 2, "rowAdd", 6, rb)
        if gutter:
            s.text(x + pad, ty, str(k + 1), size, "gut m", inside=box)
            tx = x + pad + tw(str(len(lines)), size, True) + 16
        s.text(tx, ty, ln, size, "t m", inside=box, extra=f' data-line="{k + 1}"')
        if new_at == k + 1 and tag:
            s.text(x + w - 14, ty, tag, size, "tagAdd", "end", inside=box)
    s.add("</g>")
    return y + h


# ══ 노트북용 (1280) ══════════════════════════════════════════════
def desktop():
    s = Svg(1280, 0, TITLE + " · 노트북용", "d5")
    s.text(32, 54, TITLE, 30, "t b")
    s.text(32, 90, "Scene 04 · " + SUB, 18, "s")

    # ── 그림 A ──────────────────────────────────────────────
    s.comment("그림 A. 메모리에서 파일로: 저장하지 않은 경우와 저장한 경우")
    section_head(s, 16, 150, "A", "메모리에서 파일로 — 저장하지 않은 프로그램과 저장한 프로그램", 22)
    y = legend_a(s, 16, 172, 1248, 16) + 16
    cx0, cw, cg = 134, 180, 8
    colx = [cx0 + k * (cw + cg) for k in range(6)]
    s.add(f'<rect x="{colx[0]}" y="{y}" width="{colx[3] + cw - colx[0]}" height="30" rx="8" class="band" data-box="band-run1"/>')
    s.text(colx[0] + 12, y + 21, "실행 1 — 같은 프로그램 실행 한 번", 16, "t b", inside="band-run1")
    s.add(f'<rect x="{colx[4]}" y="{y}" width="{colx[5] + cw - colx[4]}" height="30" rx="8" class="band" data-box="band-run2"/>')
    s.text(colx[4] + 12, y + 21, "실행 2 — 다시 실행", 16, "t b", inside="band-run2")
    s.text(16, y + 21, "시간 순서 →", 16, "s b")
    y += 38
    for k, (sid, (h1, h2), _) in enumerate(STEPS_A):
        s.rect(colx[k], y, cw, 54, "th", 8, f"step-{sid}")
        s.text(colx[k] + cw / 2, y + 23, h1, 16, "t b", "middle", f"step-{sid}")
        s.text(colx[k] + cw / 2, y + 45, h2, 16, "t b", "middle", f"step-{sid}")
    y += 66

    lane_h, chip_step = 128, 30
    for row, title, runs in ROWS_A:
        top = y
        rh = 44 + 2 * lane_h + 8 + 14 + 70 + 14
        s.add(f'<g data-arow="{row}">')
        s.rect(16, top, 1248, rh, "card", 12, f"arow-{row}")
        s.text(32, top + 30, title, 18, "t b", inside=f"arow-{row}")
        ly = top + 44
        for lane, name, note, cls in (("memory", "메모리", "실행 중에만", "laneM"), ("file", "파일", "프로그램 밖", "laneF")):
            s.text(28, ly + 30, name, 17, cls, inside=f"arow-{row}")
            s.text(28, ly + 54, note, 16, "s", inside=f"arow-{row}")
            for k in range(6):
                spec = CELLS_A[row][k][0 if lane == "memory" else 1]
                box = f"a-{row}-{k + 1}-{lane}"
                if spec[0] == "ids":
                    cls_box = "mem" if lane == "memory" else "disk"
                elif spec[0] == "gone":
                    cls_box = "memGone"
                else:
                    cls_box = "diskNone"
                s.add(f"<g{cell_attr(row, k, lane, spec)}>")
                s.rect(colx[k], ly, cw, lane_h, cls_box, 10, box)
                cap = spec[-1]
                if spec[0] == "ids":
                    chips(s, colx[k] + 8, ly + 8, cw - 16, spec[1], spec[2], 16, chip_step, box)
                elif spec[0] == "gone":
                    s.text(colx[k] + cw / 2, ly + 52, "사라짐", 17, "s b", "middle", box)
                else:
                    s.text(colx[k] + cw / 2, ly + 52, "—", 17, "s", "middle", box)
                if cap:
                    s.text(colx[k] + 10, ly + lane_h - 12, cap, 16, "s", inside=box)
                s.add("</g>")
            ly += lane_h + 8
        oy = ly + 6
        s.rect(32, oy, 1216, 70, "code", 10, f"aout-{row}")
        for j, (cmd, out) in enumerate(runs):
            ty = oy + 28 + 28 * j
            s.text(48, ty, f"실행 {j + 1}", 16, "s b", inside=f"aout-{row}")
            s.text(112, ty, "$ " + cmd, 16, "t m", inside=f"aout-{row}")
            ax = 112 + tw("$ " + cmd, 16, True) + 18
            s.text(ax, ty, "→", 16, "s b", inside=f"aout-{row}")
            s.text(ax + 26, ty, out, 16, "t m b", inside=f"aout-{row}",
                   extra=f' data-out="{attr(out)}" data-run="{attr(cmd)}"')
        s.add("</g>")
        y = top + rh + 16
    s.text(16, y + 4, A_NOTE, 16, "t b")
    y += 70

    # ── 그림 B ──────────────────────────────────────────────
    s.comment("그림 B. 세 가지 파일 형식: 같은 거래 3건")
    section_head(s, 16, y, "B", "세 가지 파일 형식 — 같은 거래 3건, 다른 구조", 22)
    y += 26
    widths = [330, 520, 350]
    xs = [16, 16 + 330 + 24, 16 + 330 + 24 + 520 + 24]
    code_top = y + 70
    code_h = 14 + 22 * len(JSON_LINES)
    read_top = code_top + code_h + 28 + 4 * 26 + 10
    card_h = read_top - y + 122 + 74
    for (fid, name, fname, kind, lines, hl, notes, read_code, read_res, amount_t, (good, warn)), x, w in zip(FORMATS, xs, widths):
        box = f"fmt-{fid}"
        s.add(f'<g data-fmtcard="{fid}" data-amount="{amount_t}">')
        s.rect(x, y, w, card_h, "card", 12, box)
        s.text(x + 18, y + 32, name, 21, "t b", inside=box)
        s.text(x + 18 + tw(name, 21) + 14, y + 32, kind, 17, "t b", inside=box)
        s.text(x + 18, y + 56, fname, 16, "s m", inside=box)
        ly = file_lines(s, x + 14, code_top, w - 28, lines, 16, 22, f"{box}-code", fid, hl=hl)
        for k, t in enumerate(notes):
            s.text(x + 18, ly + 28 + 26 * k, t, 16, "t b" if k == 0 else "t", inside=box)
        rb = f"{box}-read"
        s.rect(x + 14, read_top, w - 28, 118, "legend", 10, rb)
        s.text(x + 28, read_top + 26, "Python으로 읽으면", 16, "s b", inside=rb)
        s.text(x + 28, read_top + 52, read_code, 16, "t m b", inside=rb)
        s.text(x + 28, read_top + 78, read_res[0], 16, "t", inside=rb)
        s.text(x + 28, read_top + 104, read_res[1], 16, "t b", inside=rb)
        gy = read_top + 122
        s.text(x + 18, gy + 26, "장점", 16, "s b", inside=box)
        s.text(x + 62, gy + 26, good, 16, "t", inside=box)
        s.text(x + 18, gy + 52, "주의", 16, "s b", inside=box)
        s.text(x + 62, gy + 52, warn, 16, "t", inside=box)
        s.add("</g>")
    y += card_h + 14
    s.rect(16, y, 1248, 44, "legend", 10, "b-note")
    s.text(32, y + 28, B_NOTE, 16, "t b", inside="b-note")
    y += 104

    # ── 그림 C ──────────────────────────────────────────────
    s.comment("그림 C. JSONL 파일 읽기·쓰기와 수정·삭제의 파일 반영")
    section_head(s, 16, y, "C", "JSONL 파일 읽기·쓰기 — 파일의 줄과 데이터 객체", 22)
    y = legend_c(s, 16, y + 22, 1248, 16) + 16

    s.comment("C-1 JSONL 쓰기·읽기 (jsonl_basics.py). 변환 선에는 번호를 붙이지 않는다")
    top = y
    c1_at = len(s.body)
    s.text(36, top + 32, "C-1 한 줄 쓰기와 한 줄씩 읽기 · jsonl_basics.py", 19, "t b", inside="c1")
    s.add('<g data-c1="write">')
    dy = top + 56
    s.rect(36, dy, 260, 124, "obj", 10, "cv-dict")
    s.text(52, dy + 28, "dict · 메모리의 값", 16, "s b", inside="cv-dict")
    for k, (key, val) in enumerate(C1_DICT):
        s.text(52, dy + 56 + 24 * k, key, 16, "t m", inside="cv-dict")
        s.text(170, dy + 56 + 24 * k, val, 16, "t m b", inside="cv-dict")
    s.rect(460, dy + 24, 500, 76, "code", 10, "cv-str")
    s.text(476, dy + 50, "str · 글자 한 줄 + 줄바꿈 \\n", 16, "s b", inside="cv-str")
    s.text(476, dy + 80, C1_NEW, 16, "t m", inside="cv-str", extra=f' data-newline="{attr(C1_NEW)}"')
    s.conv([(296, dy + 62), (458, dy + 62)], "dict", "str")
    s.text(306, dy + 52, "json.dumps(…)", 16, "convT m")
    s.add("</g>")
    fy = dy + 160
    s.conv([(710, dy + 100), (710, fy - 2)], "str", "file")
    s.text(722, dy + 132, 'f.write() · "a" 모드 → 파일 끝에', 16, "convT")
    s.add('<g data-c1="file">')
    s.text(460, fy - 10, "transactions.jsonl", 16, "s m b")
    fb = file_lines(s, 460, fy, 500, JSONL_LINES + [C1_NEW], 16, 40, "cv-file", "c1", new_at=4, tag='+ "a"')
    s.add("</g>")
    s.text(52, fy + 30, '1~3행: "w"로 쓴 줄', 16, "t", inside="c1")
    s.text(52, fy + 56, '4행: "a"로 덧붙인 줄', 16, "t b", inside="c1")
    s.text(52, fy + 82, "한 줄 = JSON 값 하나", 16, "t", inside="c1")
    s.text(52, fy + 108, "= 거래 1건", 16, "t", inside="c1")
    s.text(1012, fy - 36, "for line in f →", 16, "convT m")
    s.text(1012, fy - 12, "json.loads(line)", 16, "convT m")
    s.add('<g data-c1="read">')
    for k, rd in enumerate(C1_READS):
        ry = fy + 8 + 40 * k
        rb = f"cv-read{k + 1}"
        s.rect(1012, ry + 4, 236, 30, "rowN", 6, rb)
        s.text(1024, ry + 25, rd, 16, "t", inside=rb, extra=f' data-read="{k + 1}"')
        s.conv([(960, ry + 19), (1010, ry + 19)], "file", f"read{k + 1}")
    s.add("</g>")
    oy = fb + 22
    ob = code_lines(s, 36, oy, 1208, C1_OUTS, 16, 26, "c1-out", out_from=0)
    behind(s, c1_at, 16, top, 1248, ob + 20 - top, "c1")
    y = ob + 20 + 24

    s.comment("C-2 수정은 파일 전체를 다시 쓴다 (python file_crud.py update 2 2500, 호출 추적으로 확인)")
    top = y
    c2_at = len(s.body)
    s.text(36, top + 32, "C-2 수정·삭제는 파일을 다시 쓴다 · " + C2_COMMAND, 19, "t b", inside="c2")
    by = top + 56
    s.add('<g data-c2="file0">')
    s.text(36, by + 22, "data/transactions.jsonl · 수정 전", 16, "s b", inside="c2")
    f0 = file_lines(s, 36, by + 34, 540, C2_BEFORE, 16, 30, "call-file0", "c2-before")
    s.add("</g>")
    s.add(f'<g data-c2="mem" data-upd="{C2_UPDATE[0]}:{C2_UPDATE[1]}>{C2_UPDATE[2]}">')
    s.rect(704, by + 34, 540, 14 + 3 * 34 + 40, "mem", 10, "call-mem")
    s.text(720, by + 22, "메모리 · items 리스트", 16, "laneM", inside="c2")
    chips(s, 718, by + 44, 300, [1, 2, 3], None, 16, 34, "call-mem", upd=C2_UPDATE)
    s.text(1036, by + 44 + 34 + 21, "← 값만 바뀜", 16, "t b", inside="call-mem")
    s.step(732, by + 44 + 3 * 34 + 18, "2", 13, 16)
    s.text(754, by + 44 + 3 * 34 + 24, "update_amount(items, 2, 2500)", 16, "t m b", inside="call-mem", extra=' data-step-fn="2:update_amount"')
    s.add("</g>")
    mem_bottom = by + 34 + 14 + 3 * 34 + 40
    ay = by + 34 + 50
    s.call([(578, ay), (702, ay)], "file0", "mem", "1")
    s.step(640, ay - 22, "1", 13, 16)
    s.text(640, ay + 30, "load_all()", 16, "t m b", "middle", extra=' data-step-fn="1:load_all"')
    ty0 = mem_bottom + 110
    s.call([(1200, mem_bottom + 2), (1200, ty0 + 30)], "mem", "temp", "3")
    s.step(1226, mem_bottom + 52, "3", 13, 16)
    s.text(1180, mem_bottom + 46, "save_all(): 전체를 임시 파일에", 16, "t b", "end", extra=' data-step-fn="3:save_all"')
    s.text(1180, mem_bottom + 70, '"w"로 다 쓴 뒤', 16, "t", "end")
    s.add('<g data-c2="temp">')
    s.text(720, ty0 + 22, "data/transactions.jsonl.tmp · 임시 파일", 16, "s b", inside="c2")
    t1 = file_lines(s, 704, ty0 + 32, 540, C2_AFTER, 16, 30, "call-temp", "c2-temp")
    s.add("</g>")
    s.add('<g data-c2="file1">')
    s.text(36, ty0 + 22, "data/transactions.jsonl · 수정 후", 16, "s b", inside="c2")
    f1 = file_lines(s, 36, ty0 + 32, 540, C2_AFTER, 16, 30, "call-file1", "c2-after")
    s.add("</g>")
    ry = ty0 + 32 + 50
    s.call([(702, ry), (578, ry)], "temp", "file1", "4")
    s.step(640, ry - 22, "4", 13, 16)
    s.text(640, ry + 30, "os.replace()", 16, "t m b", "middle", extra=' data-step-fn="4:replace"')
    ny = max(t1, f1) + 30
    s.text(36, ny, "임시 파일이 원래 이름을 대신합니다. 교체 뒤 .tmp는 남지 않습니다. 쓰다가 실패하면 원래 파일은 그대로입니다(9절).", 16, "t", inside="c2")
    ob = code_lines(s, 36, ny + 16, 1208, [C2_RESULT], 16, 26, "c2-out", out_from=0)
    behind(s, c2_at, 16, top, 1248, ob + 20 - top, "c2")
    y = ob + 20 + 24

    s.comment("CRUD가 파일에 반영되는 방법 (표, 번호 없음)")
    s.text(16, y + 6, "CRUD가 파일에 반영되는 방법 · file_crud.py", 20, "t b")
    y += 22
    heads = ["동작", "메모리에서(파일을 모름)", "파일에서", "파일 모드"]
    colx2 = [16, 196, 560, 1044]
    colw2 = [180, 364, 484, 220]
    for k, hd in enumerate(heads):
        s.rect(colx2[k], y, colw2[k], 40, "mxH", 0, f"cf-h{k}")
        s.text(colx2[k] + 14, y + 26, hd, 16, "t b", inside=f"cf-h{k}")
    y += 40
    for cid, name, mem, fil, mode in CRUD_FILE:
        s.add(f'<g data-crud="{cid}">')
        for k, t in enumerate((name, mem, fil, mode)):
            box = f"cf-{cid}-{k}"
            s.rect(colx2[k], y, colw2[k], 44, "mx", 0, box)
            s.text(colx2[k] + 14, y + 28, t, 16, "t b" if k == 0 else ("t m b" if k == 3 else "t"), inside=box)
        s.add("</g>")
        y += 44
    s.text(16, y + 26, CRUD_NOTE, 16, "s")
    y += 60

    s.comment("다음 질문: Scene 05로")
    s.rect(16, y, 1248, 210, "card", 12, "bridge")
    s.text(36, y + 34, "다음 질문 · " + BRIDGE_Q, 20, "t b", inside="bridge")
    for k, t in enumerate(BRIDGE_CLUES):
        s.text(52, y + 74 + 30 * k, "· " + t, 17, "t", inside="bridge")
    s.text(36, y + 180, BRIDGE_NEXT, 18, "t b", inside="bridge")
    y += 250
    for i, t in enumerate(FOOT):
        s.text(32, y + 26 * i, t, 16, "s")
    s.h = int(y + 26 * len(FOOT) + 8)
    s.save("file-persistence-desktop.svg", DESC)


# ══ 휴대전화용 (360) ═════════════════════════════════════════════
def mobile():
    s = Svg(360, 0, TITLE + " · 휴대전화용", "m5")
    for i, t in enumerate(["프로그램을 종료해도", "데이터가 남는 이유는", "무엇일까?"]):
        s.text(12, 32 + 28 * i, t, 21, "t b")
    s.text(12, 112, "Scene 04 · 메모리와 파일을 구별하고", 14, "s")
    s.text(12, 132, "JSON·JSONL·CSV로 저장하고 다시 읽기", 14, "s")
    y = 176

    s.comment("그림 A")
    section_head(s, 12, y, "A", "메모리에서 파일로", 17)
    s.text(12, y + 26, "저장하지 않음 ↔ 파일에 저장함", 14, "s")
    y = legend_a(s, 12, y + 38, 336, 14, mobile=True) + 14
    colx, cw = [20, 186], 154
    s.rect(12, y, 336, 132, "card", 12, "a-heads")
    for j, (row, title, runs) in enumerate(ROWS_A):
        s.text(colx[j], y + 24, "저장하지 않음" if row == "nosave" else "파일에 저장함", 14, "t b", inside="a-heads")
        s.text(colx[j], y + 44, "memory_only.py" if row == "nosave" else "file_crud.py", 14, "s m", inside="a-heads")
    s.text(20, y + 74, "실행 1: … add  →  실행 2: 다시 실행", 14, "s", inside="a-heads")
    s.text(20, y + 98, "칸마다 위 = 메모리, 아래 = 파일", 14, "t b", inside="a-heads")
    s.text(20, y + 120, "왼쪽 = 저장 안 함 · 오른쪽 = 저장함", 14, "s", inside="a-heads")
    y += 144
    cell_h = 50
    for k, (sid, _, label) in enumerate(STEPS_A):
        block = 30 + 2 * cell_h + 6 + 10
        s.rect(12, y, 336, block, "card", 12, f"step-{sid}")
        s.text(24, y + 22, label, 14, "t b", inside=f"step-{sid}")
        for j, (row, _, _) in enumerate(ROWS_A):
            for li, lane in enumerate(("memory", "file")):
                spec = CELLS_A[row][k][li]
                box = f"a-{row}-{k + 1}-{lane}"
                cy = y + 30 + li * (cell_h + 6)
                if spec[0] == "ids":
                    cls_box = "mem" if lane == "memory" else "disk"
                elif spec[0] == "gone":
                    cls_box = "memGone"
                else:
                    cls_box = "diskNone"
                s.add(f"<g{cell_attr(row, k, lane, spec)}>")
                s.rect(colx[j], cy, cw, cell_h, cls_box, 8, box)
                name = "메모리" if lane == "memory" else "파일"
                s.text(colx[j] + 8, cy + 20, name, 14, "laneM" if lane == "memory" else "laneF", inside=box)
                nx = colx[j] + 8 + tw(name, 14) + 8
                if spec[0] == "ids":
                    plain = [str(i) for i in spec[1] if i != spec[2]]
                    s.text(nx, cy + 20, "id " + "·".join(plain), 14, "t b", inside=box)
                    if spec[2]:
                        s.text(nx + tw("id " + "·".join(plain), 14) + 6, cy + 20, f"+{spec[2]}", 14, "tagAdd", inside=box)
                elif spec[0] == "gone":
                    s.text(nx, cy + 20, "사라짐", 14, "s b", inside=box)
                else:
                    s.text(nx, cy + 20, "—", 14, "s", inside=box)
                if spec[-1]:
                    s.text(colx[j] + 8, cy + 41, spec[-1], 14, "s", inside=box)
                s.add("</g>")
        y += block + 8
    for row, title, runs in ROWS_A:
        split = []
        for cmd, out in runs:
            split.append((cmd, out, wrap_out(out)))
        oh = 12 + sum(22 * (2 + len(p)) + 6 for _, _, p in split)
        s.rect(12, y, 336, oh, "code", 10, f"aout-{row}")
        yy = y + 8
        for j, (cmd, out, parts) in enumerate(split):
            s.text(22, yy + 16, f"실행 {j + 1}", 14, "s b", inside=f"aout-{row}")
            s.text(22, yy + 38, "$ " + cmd, 14, "s m", inside=f"aout-{row}")
            s.add(f'<g data-out="{attr(out)}" data-run="{attr(cmd)}">')
            for p, t in enumerate(parts):
                s.text(22, yy + 60 + 22 * p, t, 14, "t m b", inside=f"aout-{row}")
            s.add("</g>")
            yy += 22 * (2 + len(parts)) + 6
        y += oh + 14
    s.text(12, y, "실행 1이 끝나 메모리가 비어도 파일의", 14, "t b")
    s.text(12, y + 20, "3줄은 남고, 실행 2가 읽어 되살립니다.", 14, "t b")
    y += 70

    s.comment("그림 B")
    section_head(s, 12, y, "B", "세 가지 파일 형식", 17)
    s.text(12, y + 26, "같은 거래 3건, 다른 구조", 14, "s")
    y += 44
    for fid, name, fname, kind, lines, hl, notes, read_code, read_res, amount_t, (good, warn) in FORMATS:
        box = f"fmt-{fid}"
        step = 20
        code_h = 14 + step * len(lines)
        h = 64 + code_h + 22 + 22 * len(notes) - 8 + 96 + 22 + 22 + 16
        s.add(f'<g data-fmtcard="{fid}" data-amount="{amount_t}">')
        s.rect(12, y, 336, h, "card", 12, box)
        s.text(24, y + 28, name, 17, "t b", inside=box)
        s.text(24 + tw(name, 17) + 10, y + 28, kind, 14, "t b", inside=box)
        s.text(24, y + 52, fname, 14, "s m", inside=box)
        yy = file_lines(s, 12 if fid == "jsonl" else 20, y + 64, 336 if fid == "jsonl" else 320, lines, 14, step,
                        f"{box}-code", fid, gutter=fid != "jsonl", pad=6 if fid == "jsonl" else 14, hl=hl)
        yy += 22
        for k, t in enumerate(notes):
            s.text(24, yy + 22 * k, t, 14, "t b" if k == 0 else "t", inside=box)
        yy += 22 * len(notes) - 8
        s.rect(20, yy, 320, 96, "legend", 10, f"{box}-read")
        s.text(32, yy + 24, "Python으로 읽으면", 14, "s b", inside=f"{box}-read")
        s.text(32, yy + 46, read_code, 14, "t m b", inside=f"{box}-read")
        s.text(32, yy + 68, read_res[0], 14, "t", inside=f"{box}-read")
        s.text(32, yy + 88, read_res[1], 14, "t b", inside=f"{box}-read")
        yy += 96 + 22
        s.text(24, yy, "장점 " + good, 14, "t", inside=box)
        s.text(24, yy + 22, "주의 " + warn, 14, "t", inside=box)
        s.add("</g>")
        y += h + 12
    for k, t in enumerate(["어느 형식이 정답이라는 규칙은 없습니다.", "프로그램의 요구와 설계로 고릅니다."]):
        s.text(12, y + 8 + 20 * k, t, 14, "t b")
    y += 64

    s.comment("그림 C")
    section_head(s, 12, y, "C", "JSONL 읽기·쓰기", 17)
    s.text(12, y + 26, "파일의 줄과 데이터 객체", 14, "s")
    y = legend_c(s, 12, y + 38, 336, 14, mobile=True) + 14

    s.comment("C-1")
    top = y
    s.text(12, y + 8, "C-1 한 줄 쓰기와 한 줄씩 읽기", 15, "t b")
    s.text(12, y + 28, "jsonl_basics.py", 14, "s m")
    y += 42
    s.add('<g data-c1="write">')
    s.rect(20, y, 200, 106, "obj", 10, "cv-dict")
    s.text(32, y + 24, "dict · 메모리의 값", 14, "s b", inside="cv-dict")
    for k, (key, val) in enumerate(C1_DICT):
        s.text(32, y + 48 + 20 * k, key, 14, "t m", inside="cv-dict")
        s.text(126, y + 48 + 20 * k, val, 14, "t m b", inside="cv-dict")
    sy = y + 160
    s.conv([(60, y + 106), (60, sy - 2)], "dict", "str")
    s.text(74, y + 138, "json.dumps(…)", 14, "convT m")
    s.rect(12, sy, 336, 64, "code", 10, "cv-str")
    s.text(18, sy + 24, "str · 글자 한 줄 + \\n", 14, "s b", inside="cv-str")
    s.text(18, sy + 48, C1_NEW, 14, "t m", inside="cv-str", extra=f' data-newline="{attr(C1_NEW)}"')
    s.add("</g>")
    fy = sy + 64 + 70
    s.conv([(60, sy + 64), (60, fy - 2)], "str", "file")
    s.text(74, sy + 96, 'f.write() · "a" → 파일 끝에', 14, "convT")
    s.add('<g data-c1="file">')
    s.text(344, fy - 8, "transactions.jsonl", 14, "s m b", "end")
    lines = JSONL_LINES + [C1_NEW]
    fh = 14 + 46 * len(lines)
    s.rect(12, fy, 336, fh, "code", 10, "cv-file")
    s.add('<g data-format="c1">')
    for k, ln in enumerate(lines):
        ly = fy + 8 + 46 * k
        if k == 3:
            s.rect(14, ly, 332, 44, "rowAdd", 6, "cv-file-new")
        s.text(18, ly + 16, f"{k + 1}행" + ('  + "a"로 덧붙임' if k == 3 else ""), 14, "gut" if k != 3 else "tagAdd", inside="cv-file")
        s.text(18, ly + 36, ln, 14, "t m", inside="cv-file", extra=f' data-line="{k + 1}"')
    s.add("</g>")
    s.add("</g>")
    ry = fy + fh + 56
    s.conv([(60, fy + fh), (60, ry - 2)], "file", "reads")
    s.text(74, fy + fh + 24, "for line in f →", 14, "convT m")
    s.text(74, fy + fh + 44, "json.loads(line)", 14, "convT m")
    s.add('<g data-c1="read">')
    s.rect(20, ry, 320, 14 + 30 * 4, "legend", 10, "cv-reads")
    for k, rd in enumerate(C1_READS):
        s.text(32, ry + 30 + 30 * k, f"{k + 1}행 → {rd}", 14, "t", inside="cv-reads", extra=f' data-read="{k + 1}"')
    s.add("</g>")
    oy = ry + 14 + 120 + 16
    oh = 16 + 22 * 4
    s.rect(12, oy, 336, oh, "code", 10, "c1-out")
    for k, out in enumerate(C1_OUTS):
        a, b = out.split(": ", 1)
        s.add(f'<g data-out="{attr(out)}">')
        s.text(20, oy + 26 + 44 * k, a + ":", 14, "t m", inside="c1-out")
        s.text(20, oy + 48 + 44 * k, "  " + b, 14, "t m b", inside="c1-out")
        s.add("</g>")
    y = oy + oh + 36

    s.comment("C-2")
    s.text(12, y + 8, "C-2 수정·삭제는 파일을 다시 쓴다", 15, "t b")
    s.text(12, y + 28, "$ " + C2_COMMAND, 14, "s m")
    y += 46
    s.add('<g data-c2="file0">')
    s.text(16, y + 6, "data/transactions.jsonl · 수정 전", 14, "s b")
    f0 = file_lines(s, 12, y + 14, 336, C2_BEFORE, 14, 24, "call-file0", "c2-before", gutter=False, pad=6)
    s.add("</g>")
    my = f0 + 70
    s.call([(330, f0 + 2), (330, my + 24)], "file0", "mem", "1")
    s.step(306, f0 + 34, "1", 12, 14)
    s.text(286, f0 + 39, "load_all()", 14, "t m b", "end", extra=' data-step-fn="1:load_all"')
    s.add(f'<g data-c2="mem" data-upd="{C2_UPDATE[0]}:{C2_UPDATE[1]}>{C2_UPDATE[2]}">')
    s.text(16, my + 14, "메모리 · items 리스트", 14, "laneM")
    mh = 12 + 3 * 32 + 40
    s.rect(12, my + 24, 336, mh, "mem", 10, "call-mem")
    chips(s, 22, my + 32, 240, [1, 2, 3], None, 14, 32, "call-mem", upd=C2_UPDATE)
    s.step(36, my + 24 + 12 + 96 + 16, "2", 12, 14)
    s.text(54, my + 24 + 12 + 96 + 21, "update_amount(items, 2, 2500)", 14, "t m b", inside="call-mem", extra=' data-step-fn="2:update_amount"')
    s.add("</g>")
    ty = my + 24 + mh + 70
    s.call([(330, my + 24 + mh + 2), (330, ty + 22)], "mem", "temp", "3")
    s.step(306, my + 24 + mh + 34, "3", 12, 14)
    s.text(286, my + 24 + mh + 30, "save_all(): 전체를 임시", 14, "t b", "end", extra=' data-step-fn="3:save_all"')
    s.text(286, my + 24 + mh + 50, '파일에 "w"로 다 쓰기', 14, "t", "end")
    s.add('<g data-c2="temp">')
    s.text(16, ty + 12, "data/transactions.jsonl.tmp", 14, "s b")
    t1 = file_lines(s, 12, ty + 22, 336, C2_AFTER, 14, 24, "call-temp", "c2-temp", gutter=False, pad=6)
    s.add("</g>")
    f1y = t1 + 70
    s.call([(330, t1 + 2), (330, f1y + 22)], "temp", "file1", "4")
    s.step(306, t1 + 34, "4", 12, 14)
    s.text(286, t1 + 39, "os.replace()", 14, "t m b", "end", extra=' data-step-fn="4:replace"')
    s.add('<g data-c2="file1">')
    s.text(16, f1y + 12, "data/transactions.jsonl · 수정 후", 14, "s b")
    f1 = file_lines(s, 12, f1y + 22, 336, C2_AFTER, 14, 24, "call-file1", "c2-after", gutter=False, pad=6)
    s.add("</g>")
    y = f1 + 20
    for k, t in enumerate(["임시 파일이 원래 이름을 대신합니다.", ".tmp는 남지 않고, 쓰다가 실패하면", "원래 파일은 그대로입니다(9절)."]):
        s.text(12, y + 8 + 20 * k, t, 14, "t")
    y += 70
    parts = wrap_out(C2_RESULT)
    oh = 16 + 22 * len(parts)
    s.rect(12, y, 336, oh, "code", 10, "c2-out")
    s.add(f'<g data-out="{attr(C2_RESULT)}">')
    for k, p in enumerate(parts):
        s.text(20, y + 26 + 22 * k, p, 14, "t m b" if k else "t m", inside="c2-out")
    s.add("</g>")
    y += oh + 30

    s.comment("CRUD가 파일에 반영되는 방법 (번호 없음)")
    s.text(12, y + 8, "CRUD가 파일에 반영되는 방법", 15, "t b")
    y += 22
    for cid, name, mem, fil, mode in CRUD_FILE:
        s.add(f'<g data-crud="{cid}">')
        box = f"cf-{cid}"
        parts = [fil, "모드 " + mode]
        h = 30 + 22 + 22 * len(parts) + 10
        s.rect(12, y, 336, h, "mx", 8, box)
        s.text(24, y + 24, name, 15, "t b", inside=box)
        s.text(24, y + 48, "메모리 " + mem, 14, "t", inside=box)
        s.text(24, y + 70, "파일", 14, "laneF", inside=box)
        for k, p in enumerate(parts):
            s.text(60, y + 70 + 22 * k, p, 14, "t" if k == 0 else "s", inside=box)
        s.add("</g>")
        y += h + 8
    for k, t in enumerate(["없는 id면 파일은 다시 쓰지 않습니다.", "전체 다시 쓰기는 가능한 방법 중 하나."]):
        s.text(12, y + 10 + 20 * k, t, 14, "s")
    y += 64

    s.comment("다음 질문")
    clue_m = [
        ["JSONL·CSV는 한 줄(한 행)씩", "읽을 수 있다 — for line in f"],
        ["그래도 결과를 리스트에 모두", "모으면 전체가 메모리에 올라온다"],
        ["메모리 사용량은 형식이 아니라", "읽고 보관하는 방법이 정한다"],
    ]
    bh = 40 + 3 * 22 + 12 + sum(22 * len(c) + 10 for c in clue_m) + 66
    s.rect(12, y, 336, bh, "card", 12, "bridge")
    s.text(24, y + 28, "다음 질문", 15, "t b", inside="bridge")
    for k, t in enumerate(["거래 데이터가 10만 건이라면, 파일", "전체를 한꺼번에 읽어 메모리에", "올려야 할까?"]):
        s.text(24, y + 54 + 22 * k, t, 15, "t b", inside="bridge")
    yy = y + 54 + 66 + 12
    for c in clue_m:
        for k, t in enumerate(c):
            s.text(24, yy + 22 * k, ("· " if k == 0 else "  ") + t, 14, "t", inside="bridge")
        yy += 22 * len(c) + 10
    s.text(24, yy + 12, "→ Scene 05: Iterable · Iterator ·", 14, "t b", inside="bridge")
    s.text(24, yy + 34, "Generator · yield", 14, "t b", inside="bridge")
    y += bh + 20
    for i, t in enumerate(FOOT_M):
        s.text(12, y + 22 * i, t, 14, "s")
    s.h = int(y + 22 * len(FOOT_M) + 4)
    s.save("file-persistence-mobile.svg", DESC)


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
