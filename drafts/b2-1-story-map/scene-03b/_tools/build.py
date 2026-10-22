"""B2-1 Scene 03-B (데이터는 어떻게 추가·조회·수정·삭제되고, 검색과 요약에 활용될까?) 노트북·휴대전화 SVG 생성기.

Scene 03-A 생성기(../../scene-03a/_tools/build.py)의 그리기 도구를 불러 쓴다(그 안에서 Scene 01·02 도구도 쓴다). 세 파일은 바꾸지 않는다.
그림의 데이터 상태·검색 결과·요약 값·호출 순서·실행 결과는 _tools/demo/의 실제 실행 결과이며, verify_demo.py가 대조한다.

시각 약속(Scene 03-A 확정 약속 유지 + 데이터 변경 표시 추가):
- 실제 호출 순서 = 검은 번호 원 + 진한 실선·채운 화살촉
- return 결과   = 회색 가는 실선·빈 화살촉, 번호 없음
- 데이터 변경(그림 A) = 선이 아니라 행 표시: 추가 = 초록 실선 테두리 + '+ 추가', 읽기 = 파란 굵은 테두리 + '읽음',
  값 변경 = 갈색 테두리 + 이전 값 취소선 → 새 값, 삭제 = 빨간 파선 테두리 + 취소선 + '− 삭제'. 색만으로 구분하지 않는다.
- 개념적 책임 표(그림 B-3)에는 번호를 붙이지 않는다.

실행: python -I build.py  (출력: ../crud-flow-desktop.svg, ../crud-flow-mobile.svg)
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
_spec = importlib.util.spec_from_file_location("scene03a_build", os.path.join(HERE, "..", "..", "scene-03a", "_tools", "build.py"))
s3 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(s3)
s2, s1 = s3.s2, s3.s1
tw, esc, section_head = s1.tw, s1.esc, s1.section_head

# ── 내용 (노트북·휴대전화 공통) ────────────────────────────────
TITLE = "데이터는 어떻게 추가·조회·수정·삭제되고, 검색과 요약에 활용될까?"
SUB = "메모리 안의 거래 목록으로 CRUD·검색·요약을 따라가고, 한 기능의 책임을 나눠 보기"

# 거래 한 건 = (id, type, category, amount). crud_basics.py · search_summary.py · cashbook 저장소의 처음 데이터
INITIAL = [(1, "수입", "용돈", 30000), (2, "지출", "식비", 8000), (3, "지출", "교통", 2000), (4, "지출", "식비", 5000)]
DICT_CODE = ['{"id": 2,', ' "type": "지출",', ' "category": "식비",', ' "amount": 8000}']
DATA_NOTES = [
    ("b", "한 행 = 딕셔너리 하나"), ("t", "키(key) → 값 · item[\"amount\"]"),
    ("b", "목록 전체 = 리스트"), ("t", "순서 있음 · 위치(인덱스)는 0부터"),
    ("b", "id = 항목마다 다른 번호"), ("t", "위치가 바뀌어도 id는 그대로"),
]


def _rows(base, add=None, sel=None, upd=None, delete=None):
    """한 단계 뒤의 행 목록과 표시. upd = (id, 새 금액). 삭제 행은 자리에 남겨 취소선으로 보인다."""
    rows = []
    for rid, typ, cat, amt in base:
        mark, old = None, None
        if rid == sel:
            mark = "sel"
        if upd and rid == upd[0]:
            mark, old, amt = "upd", amt, upd[1]
        if rid == delete:
            mark = "del"
        rows.append((rid, typ, cat, amt, mark, old))
    if add:
        rows.append(add + ("add", None))
    return rows


AFTER_C = INITIAL + [(5, "지출", "문구", 3000)]
AFTER_U = [(1, "수입", "용돈", 30000), (2, "지출", "식비", 7000), (3, "지출", "교통", 2000), (4, "지출", "식비", 5000), (5, "지출", "문구", 3000)]
# CRUD 카드: (op, 글자, 제목, 코드, 행, 개수 변화, 설명 줄, 휴대전화 설명 줄)
CRUD = [
    ("create", "C", "Create · 추가", 'create(transactions, "지출", "문구", 3000)', _rows(INITIAL, add=(5, "지출", "문구", 3000)), "4건 → 5건",
     ["데이터가 바뀜: 목록 끝에 딕셔너리 1개를 append()", "새 id 5 = 가장 큰 id 4 + 1"],
     ["append()로 끝에 1건 추가", "새 id 5 = 가장 큰 id 4 + 1"]),
    ("read", "R", "Read · 조회", "read_one(transactions, 2)", _rows(AFTER_C, sel=2), "5건 그대로",
     ["데이터는 그대로: id가 2인 항목을 찾아 돌려줌", "없는 id면 None · 전체 조회는 read_all()"],
     ["그대로: id 2인 항목을 찾아 돌려줌", "없는 id면 None"]),
    ("update", "U", "Update · 수정", "update_amount(transactions, 2, 7000)", _rows(AFTER_C, upd=(2, 7000)), "5건 그대로",
     ["데이터가 바뀜: id로 찾은 딕셔너리의 amount 값", "다른 항목·개수·순서는 그대로"],
     ["id로 찾은 항목의 amount만 바뀜", "개수·순서는 그대로"]),
    ("delete", "D", "Delete · 삭제", "delete(transactions, 3)", _rows(AFTER_U, delete=3), "5건 → 4건",
     ["데이터가 바뀜: id로 찾은 항목을 remove()", "뒤 항목의 위치는 당겨지지만 id 4·5는 그대로"],
     ["remove()로 id 3 항목 제거", "뒤 항목의 위치만 당겨짐 · id는 그대로"]),
]
# 검색·요약 (search_summary.py, 원본 = INITIAL)
SEARCHES = [
    ("search-category", "검색 · category가 식비", 'search(transactions, "category", "식비")', [r for r in INITIAL if r[2] == "식비"]),
    ("search-amount", "검색 · amount가 5000 이상", "search_amount_at_least(transactions, 5000)", [r for r in INITIAL if r[3] >= 5000]),
]
SUMMARY = [("지출 합계", "15000"), ("지출 건수", "3"), ("지출 평균", "5000.0"), ("분류별 지출", "식비 13000 · 교통 2000")]
SUMMARY_CODE = "summarize(transactions)"
KINDS = [
    ("read", "Read(조회)", "정한 항목이나 전체를 그대로 가져온다"),
    ("search", "검색(Search)", "조건에 맞는 항목만 골라 새 목록에 담는다"),
    ("summary", "요약(Summary)", "여러 값을 계산해 합계·건수 같은 새 값을 만든다"),
]
ORIGINAL_NOTE = "검색·요약 뒤에도 원본은 4건 그대로 (결과는 새 목록·새 값)"

# 그림 B: python -m cashbook update --id 2 --amount 7000 (호출 추적으로 확인)
COMMAND = "python -m cashbook update --id 2 --amount 7000"
LANES = [("cli", "CLI", "cli.py"), ("service", "서비스", "services.py"),
         ("repo", "저장소", "repository.py"), ("model", "모델", "models.py")]
LANE_NAME = {k: n for k, n, _ in LANES}
LAYER_NOTE = "CLI·서비스·저장소·모델은 Python 문법이 아니라 책임을 나누는 설계의 한 예입니다(Scene 03-A). 모든 기능이 네 곳을 다 거치지도 않습니다."
CALL_NODES = [
    ("main", "cli", "main()", "__main__.py가 부름 · 다른 함수를 부르고 결과를 출력할 때까지 실행 중"),
    ("build", "cli", "build_parser()", "명령 규칙 만들기"),
    ("repo", "repo", "TransactionRepository()", "저장소 객체 · 처음 4건"),
    ("tx", "model", "Transaction(…) × 4", "거래 객체 4개 만들기"),
    ("service", "service", "TransactionService(저장소)", "저장소 객체를 받음"),
    ("change", "service", "change_amount(2, 7000)", "규칙: 금액 ≥ 1"),
    ("update", "repo", "update_amount(2, 7000)", "tx.amount = 7000"),
    ("get", "repo", "get(2)", "id로 찾기"),
    ("format", "cli", "format_row(tx)", "한 줄 글자로"),
]
CALLS = [("main", "build", "2"), ("main", "repo", "3"), ("repo", "tx", "4"), ("main", "service", "5"), ("main", "change", "6"),
         ("change", "update", "7"), ("update", "get", "8"), ("main", "format", "9")]
RETURNS = [("get", "update", "tx"), ("update", "change", "tx"), ("change", "main", "tx")]
RESULT = "[수정 완료] 2 | 지출 | 식비 | 7000"
# 이 기능에서 누가 무엇을 했나: (id, 제목, 계층, 줄)
FOCUS = [
    ("rule", "규칙 판단", "서비스 · change_amount()", ["금액이 1 이상인지 검사", "저장소가 None을 주면 '없는 id' 오류"]),
    ("change", "데이터 변경", "저장소 · update_amount()", ["get()으로 id 2를 찾아", "tx.amount = 7000 (메모리 속 값)"]),
    ("print", "출력", "CLI · main()·format_row()", ["돌려받은 tx를 한 줄 글자로 만들어", "print()로 화면에 표시"]),
    ("model", "데이터의 모양", "모델 · Transaction", ["id·type·category·amount를 가진 객체", "이 기능에선 처음 4건 만들 때만 호출"]),
]
# 실패하는 경우(실제 실행): (id, 명령, 출력, 설명)
BRANCHES = [
    ("missing", "python -m cashbook update --id 9 --amount 7000", "[오류] id 9 거래가 없습니다",
     ["저장소 get(9)이 None → 서비스가 LookupError", "→ CLI가 [오류] 표시, 종료 코드 1"]),
    ("invalid", "python -m cashbook update --id 2 --amount 0", "[오류] 금액은 1 이상이어야 합니다",
     ["서비스가 바로 ValueError → 저장소는 호출되지 않음", "→ CLI가 [오류] 표시, 종료 코드 1"]),
]
# 기능별 책임 표(번호 없음): (기능, 이름, CLI(옵션, 일), 서비스(메서드, 일), 저장소(메서드, 일))
MATRIX = [
    ("add", "추가", ("--type --category --amount", "옵션 해석 · 결과 표시"), ("add()", "금액 ≥ 1 검사"), ("add()", "다음 id를 정해 목록 끝에 추가")),
    ("list", "전체 조회", ("옵션 없음", "한 줄씩 표시"), ("list_all()", "규칙 없음 · 그대로 넘김"), ("all()", "목록을 새 리스트로 돌려줌")),
    ("update", "수정", ("--id --amount", "옵션 해석 · 결과·오류 표시"), ("change_amount()", "금액 검사 · 없는 id면 오류"), ("update_amount()", "id로 찾아 amount 변경")),
    ("delete", "삭제", ("--id", "옵션 해석 · 결과·오류 표시"), ("remove()", "없는 id면 오류"), ("delete()", "id로 찾아 목록에서 제거")),
    ("search", "검색", ("--category --type", "조건 해석 · 결과 표시"), ("search()", "조건 판단(category·type)"), ("all()", "전체 목록 제공")),
    ("summary", "요약", ("옵션 없음", "이름: 값 표시"), ("summary()", "합계·잔액·분류별 계산"), ("all()", "전체 목록 제공")),
]
MATRIX_NOTE = ["모델 Transaction은 모든 기능에서 거래 한 건의 모양(id·type·category·amount)을 정합니다.",
               "전체 조회처럼 서비스가 규칙 없이 넘기기만 하는 기능도 있습니다. 표는 순서가 아니라 책임입니다."]
BRIDGE_RUNS = [
    ("python -m cashbook add --type 지출 --category 문구 --amount 3000", ["[추가 완료] 5 | 지출 | 문구 | 3000"]),
    ("python -m cashbook list", ["1 | 수입 | 용돈 | 30000", "2 | 지출 | 식비 | 8000", "3 | 지출 | 교통 | 2000", "4 | 지출 | 식비 | 5000"]),
]
BRIDGE_NOTE = ["실행 1에서 추가한 id 5가 실행 2에는 없습니다. 데이터가 프로그램 메모리 안의 리스트에만 있었고,",
               "프로그램이 끝나면 함께 사라지기 때문입니다. 껐다 켜도 남기려면? → Scene 04 파일 저장"]
FOOT = [
    "모든 예제는 Scene 03-B 학습용 예제입니다(crud_basics.py, search_summary.py, 가상 패키지 cashbook). 실제 미션 구현이나 정답이 아닙니다.",
    "그림의 데이터 상태·검색 결과·요약 값·호출 순서·실행 결과는 예제를 실제로 실행하고 호출을 추적해 확인했습니다(Python 3.14.6).",
]
FOOT_M = [
    "모든 예제는 Scene 03-B 학습용 예제입니다.",
    "실제 미션 구현이나 정답이 아닙니다.",
    "상태·결과·호출 순서는 실제 실행으로 확인했습니다.",
]
DESC = (
    "Scene 03-B. 그림 A는 메모리 안의 리스트 transactions에 든 거래 4건(1 수입 용돈 30000, 2 지출 식비 8000, 3 지출 교통 2000, 4 지출 식비 5000)이 "
    "CRUD 동작으로 어떻게 바뀌는지 보여 준다. 한 행은 딕셔너리 하나이고 id는 항목마다 다른 번호다. "
    "Create: create로 5 지출 문구 3000을 목록 끝에 추가해 5건이 된다. Read: read_one으로 id 2를 찾아 돌려주며 데이터는 바뀌지 않는다. "
    "Update: update_amount로 id 2의 금액을 8000에서 7000으로 바꾼다. Delete: delete로 id 3을 제거해 4건이 되며 id 4와 5는 그대로다. "
    "검색과 요약은 같은 원본 4건에서 결과를 만든다. category가 식비인 항목은 id 2와 4, amount가 5000 이상인 항목은 id 1, 2, 4다. "
    "요약은 지출 합계 15000, 지출 건수 3, 지출 평균 5000.0, 분류별 지출 식비 13000과 교통 2000이다. 검색·요약 뒤에도 원본은 4건 그대로다. "
    "그림 B는 python -m cashbook update --id 2 --amount 7000의 실제 호출 흐름이다. 1 main(), 2 build_parser(), 3 TransactionRepository(), "
    "4 Transaction 객체 4개, 5 TransactionService(저장소), 6 서비스의 change_amount(2, 7000)가 금액 규칙을 검사, 7 저장소의 update_amount(2, 7000), "
    "8 get(2)으로 id를 찾고 update_amount가 tx.amount를 7000으로 바꾼다, 9 CLI의 format_row(tx). get은 tx를 update_amount에, update_amount는 change_amount에, "
    "change_amount는 main에 return하고 main이 [수정 완료] 2 | 지출 | 식비 | 7000을 출력한다. 규칙 판단은 서비스, 데이터 변경은 저장소, 출력은 CLI가 맡는다. "
    "없는 id 9는 저장소가 None을 주어 서비스가 오류를 내고, 금액 0은 서비스가 바로 오류를 내어 저장소가 호출되지 않는다. "
    "기능별 책임 표: 추가, 전체 조회, 수정, 삭제, 검색, 요약마다 CLI·서비스·저장소가 맡는 일이 다르며, 전체 조회처럼 서비스가 그대로 넘기는 기능도 있다. "
    "CLI·서비스·저장소·모델은 Python 문법이 아니라 설계의 한 예다. 마지막으로 add로 추가한 거래가 다음 list 실행에 없음을 보여 주며, "
    "메모리 속 변경과 파일 저장은 다르다는 질문으로 Scene 04에 이어진다."
)

EXTRA = """      .rowN { fill: #ffffff; stroke: #e1e6ec; stroke-width: 1; }
      .rowAdd { fill: #e7f4ec; stroke: #17663f; stroke-width: 2.4; }
      .rowSel { fill: #e9f1fc; stroke: #1d4f91; stroke-width: 2.8; }
      .rowUpd { fill: #fff4e5; stroke: #8a4100; stroke-width: 2.4; }
      .rowDel { fill: #fdf2f2; stroke: #9b2c2c; stroke-width: 2; stroke-dasharray: 6 4; }
      .tagAdd { fill: #17663f; font-weight: 700; }
      .tagSel { fill: #1d4f91; font-weight: 700; }
      .tagUpd { fill: #8a4100; font-weight: 700; }
      .tagDel { fill: #9b2c2c; font-weight: 700; }
      .gone { fill: #9b2c2c; }
      .strike { fill: none; stroke: #9b2c2c; stroke-width: 1.8; }
      .strikeU { fill: none; stroke: #8a4100; stroke-width: 1.8; }
      .opBadge { fill: #1b2733; }
      .lane2 { fill: #f6f8fa; stroke: #d5dce4; stroke-width: 1; }
      .bar { fill: #f3f5f8; stroke: #1b2733; stroke-width: 1.6; }
      .mx { fill: #ffffff; stroke: #d5dce4; stroke-width: 1; }
      .mxH { fill: #f3f5f8; stroke: #d5dce4; stroke-width: 1; }
"""
ROW_CLS = {None: "rowN", "add": "rowAdd", "sel": "rowSel", "upd": "rowUpd", "del": "rowDel"}
TAG_CLS = {"add": "tagAdd", "sel": "tagSel", "upd": "tagUpd", "del": "tagDel"}
TAG = {"add": "+ 추가", "sel": "읽음 · 변화 없음", "upd": "값 변경", "del": "− 삭제"}
TAG_M = {"add": "+ 추가", "sel": "읽음", "upd": "변경", "del": "− 삭제"}


class Svg(s3.Svg):
    def save(self, name, desc):
        tid, did = f"{self.idp}-title", f"{self.idp}-desc"
        style = s1.STYLE.replace("    </style>", s2.EXTRA_STYLE + s3.EXTRA + EXTRA + "    </style>")
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'role="img" aria-labelledby="{tid} {did}">\n'
                f'  <title id="{tid}">{esc(self.label)}</title>\n'
                f'  <desc id="{did}">{esc(desc)}</desc>\n'
                f'  <defs>\n{style}\n'
                f'    <marker id="{self.idp}-arr" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0 0L10 5L0 10Z" fill="#1b2733"/></marker>\n'
                f'    <marker id="{self.idp}-ret" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M1 1L8 5L1 9" fill="none" stroke="#7b8794" stroke-width="1.8"/></marker>\n  </defs>\n'
                f'  <rect width="{self.w}" height="{self.h}" fill="#ffffff"/>\n')
        body = "\n".join("  " + b for b in self.body)
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(head + body + "\n</svg>\n")

    def retline(self, pts, frm, to):
        d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
        self.add(f'<path d="{d}" class="ret" marker-end="url(#{self.idp}-ret)" data-return="{frm}>{to}"/>')


def rowtext(r):
    return f"{r[0]} | {r[1]} | {r[2]} | {r[3]}"


def table(s, x, y, w, rows, op, size, rowh, cols, tag_x, box, tags=TAG):
    """거래 표. cols = (id, type, category, amount) 글자 위치(x에서의 거리). 돌려주는 값은 표 아래 y."""
    for k, h in enumerate(("id", "type", "category", "amount")):
        s.text(x + cols[k], y + size + 2, h, size, "s m", inside=box)
    y += size + 12
    for r in rows:
        rid, typ, cat, amt, mark, old = (tuple(r) + (None, None))[:6]
        rb = f"row-{op}-{rid}"
        old_attr = f' data-old="{old}"' if old is not None else ""
        s.add(f'<g data-op="{op}" data-row="{rid}" data-change="{mark or "none"}" data-rowtext="{esc(rowtext(r))}"{old_attr}>')
        s.rect(x, y, w, rowh - 4, ROW_CLS[mark], 6, rb)
        ty = y + (rowh - 4) / 2 + size * 0.36
        ink = "gone" if mark == "del" else "t"
        s.text(x + cols[0], ty, str(rid), size, f"{ink} m b", inside=rb)
        s.text(x + cols[1], ty, typ, size, ink, inside=rb)
        s.text(x + cols[2], ty, cat, size, ink, inside=rb)
        if mark == "upd":
            ow = tw(str(old), size, True)
            s.text(x + cols[3], ty, str(old), size, "s m", inside=rb)
            s.add(f'<path d="M{x + cols[3] - 2:g} {ty - size * 0.32:g}H{x + cols[3] + ow + 2:g}" class="strikeU"/>')
            s.text(x + cols[3] + ow + 10, ty, f"→ {amt}", size, "t m b", inside=rb)
        else:
            s.text(x + cols[3], ty, str(amt), size, f"{ink} m", inside=rb)
        if mark == "del":
            s.add(f'<path d="M{x + 8:g} {ty - size * 0.32:g}H{x + tag_x - 14:g}" class="strike"/>')
        if mark:
            s.text(x + tag_x, ty, tags[mark], size, TAG_CLS[mark], inside=rb)
        s.add("</g>")
        y += rowh
    return y


def op_badge(s, x, y, letter, size):
    s.add(f'<rect x="{x:g}" y="{y:g}" width="{size + 14}" height="{size + 12}" rx="7" class="opBadge"/>')
    s.text(x + (size + 14) / 2, y + size * 0.86 + 5, letter, size, "w b", "middle")
    return size + 14


def legend_a(s, x, y, w, size, mobile=False):
    """그림 A의 행 표시 약속(선이 아니라 테두리·글자)."""
    items = [("rowAdd", "+ 추가", "tagAdd", "새 항목"), ("rowSel", "읽음", "tagSel", "찾아서 돌려줌(변화 없음)"),
             ("rowUpd", "값 변경", "tagUpd", "이전 값 취소선 → 새 값"), ("rowDel", "− 삭제", "tagDel", "취소선 · 목록에서 빠짐")]
    if mobile:
        h = 24 + 34 * len(items)
        s.rect(x, y, w, h, "legend", 12, "legend-a")
        for k, (rc, tag, tc, mean) in enumerate(items):
            yy = y + 14 + 34 * k
            s.add(f'<rect x="{x + 12}" y="{yy}" width="78" height="26" rx="6" class="{rc}" data-box="lg-{rc}"/>')
            s.text(x + 22, yy + 18, tag, size, tc, inside=f"lg-{rc}")
            s.text(x + 100, yy + 18, mean, size, "t", inside="legend-a")
        return y + h
    s.rect(x, y, w, 56, "legend", 12, "legend-a")
    xx = x + 16
    for rc, tag, tc, mean in items:
        s.add(f'<rect x="{xx}" y="{y + 14}" width="86" height="28" rx="6" class="{rc}" data-box="lg-{rc}"/>')
        s.text(xx + 12, y + 34, tag, size, tc, inside=f"lg-{rc}")
        s.text(xx + 98, y + 34, mean, size, "t", inside="legend-a")
        xx += 98 + tw(mean, size) + 34
    return y + 56


def legend_b(s, x, y, w, size, mobile=False):
    if mobile:
        s.rect(x, y, w, 96, "legend", 12)
        s.step(x + 20, y + 24, "1", 12, 14)
        s.add(f'<path d="M{x + 35} {y + 24}H{x + 70}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
        s.text(x + 82, y + 29, "실선·번호 = 실제 호출 순서", size)
        s.add(f'<path d="M{x + 14} {y + 66}H{x + 68}" class="ret" marker-end="url(#{s.idp}-ret)"/>')
        s.text(x + 82, y + 71, "회색 가는 선 = return 결과", size)
        return y + 96
    s.rect(x, y, w, 56, "legend", 12)
    yy = y + 34
    s.step(x + 28, yy - 6, "1", 13, 16)
    s.add(f'<path d="M{x + 46} {yy - 6}H{x + 90}" class="flow" marker-end="url(#{s.idp}-arr)"/>')
    s.text(x + 102, yy, "실선 화살표·번호 = 실제 호출 순서", size)
    s.add(f'<path d="M{x + 420} {yy - 6}H{x + 474}" class="ret" marker-end="url(#{s.idp}-ret)"/>')
    s.text(x + 486, yy, "회색 가는 선 = return 결과 (번호 없음)", size)
    s.text(x + w - 16, yy, "회색 띠 = 책임 영역(설계 예시)", size, "s", "end")
    return y + 56


def code_lines(s, x, y, w, lines, size, step, box, out_from=None):
    """코드·실행 결과 상자. out_from 이후 줄은 실제 출력이라 data-out을 붙인다(명령 줄은 붙이지 않음)."""
    h = 16 + step * len(lines)
    s.rect(x, y, w, h, "code", 10, box)
    for k, ln in enumerate(lines):
        extra = f' data-out="{esc(ln)}"' if out_from is not None and k >= out_from else ""
        s.text(x + 14, y + 8 + step * (k + 1) - 6, ln, size, "t m", inside=box, extra=extra)
    return y + h


# ══ 노트북용 (1280) ══════════════════════════════════════════════
def desktop():
    s = Svg(1280, 0, TITLE + " · 노트북용", "d4")
    s.text(32, 54, TITLE, 30, "t b")
    s.text(32, 90, "Scene 03-B · " + SUB, 18, "s")

    # ── 그림 A ──────────────────────────────────────────────
    s.comment("그림 A. 데이터가 바뀌는 과정")
    section_head(s, 16, 150, "A", "데이터가 바뀌는 과정 · crud_basics.py (메모리 안의 리스트)", 22)
    y = legend_a(s, 16, 172, 1248, 16) + 20

    s.comment("A-0 처음 데이터와 자료구조")
    s.rect(16, y, 640, 230, "card", 12, "op-initial")
    s.text(36, y + 32, "처음 상태 · transactions (4건)", 19, "t b", inside="op-initial")
    table(s, 32, y + 46, 608, [r + (None, None) for r in INITIAL], "initial", 16, 34, (16, 80, 176, 300), 440, "op-initial")
    s.rect(676, y, 588, 230, "card", 12, "data-shape")
    s.text(696, y + 32, "데이터를 담는 모양", 19, "t b", inside="data-shape")
    yy = code_lines(s, 692, y + 46, 236, DICT_CODE, 16, 26, "dict-code")
    s.text(692, yy + 22, "id가 2인 행", 16, "s", inside="data-shape")
    ny = y + 70
    for kind, t in DATA_NOTES:
        s.text(948, ny, t, 16, "t b" if kind == "b" else "t", inside="data-shape")
        ny += 24 if kind == "b" else 34
    y += 254

    s.comment("A-1 CRUD 네 동작 (crud_basics.py가 위에서부터 차례로 실행)")
    s.text(16, y + 6, "아래 네 카드는 crud_basics.py가 위에서부터 차례로 실행한 결과입니다. 각 카드의 표 = 그 동작 바로 뒤의 목록.", 16, "s")
    y += 22
    cw = 612
    for i, (op, letter, title, code, rows, count, notes, _) in enumerate(CRUD):
        x = 16 + (i % 2) * (cw + 24)
        yy = y + (i // 2) * 352
        box = f"op-{op}"
        s.add(f'<g data-card="{op}">')
        s.rect(x, yy, cw, 336, "card", 12, box)
        bw = op_badge(s, x + 16, yy + 14, letter, 18)
        s.text(x + 24 + bw, yy + 37, title, 19, "t b", inside=box)
        s.text(x + cw - 16, yy + 37, count, 17, "t b", "end", inside=box)
        s.rect(x + 16, yy + 54, cw - 32, 36, "code", 8, f"code-{op}")
        s.text(x + 30, yy + 78, code, 16, "t m", inside=f"code-{op}")
        ty = table(s, x + 16, yy + 100, cw - 32, rows, op, 16, 30, (14, 64, 150, 260), 410, box)
        for k, ln in enumerate(notes):
            s.text(x + 20, ty + 22 + 24 * k, ln, 16, "t b" if k == 0 else "s", inside=box)
        s.add("</g>")
    y += 2 * 352 + 16

    s.comment("A-2 검색과 요약: 같은 원본에서 결과를 만든다 (search_summary.py)")
    s.text(16, y + 6, "검색과 요약 · search_summary.py · 같은 원본 4건에서 결과를 만든다", 20, "t b")
    y += 24
    s.rect(16, y, 520, 214, "card", 12, "op-source")
    s.text(36, y + 30, "원본 transactions (처음 4건)", 18, "t b", inside="op-source")
    table(s, 32, y + 42, 488, [r + (None, None) for r in INITIAL], "source", 16, 34, (16, 76, 160, 270), 400, "op-source")
    ky = y
    for kid, name, mean in KINDS:
        box = f"kind-{kid}"
        s.add(f'<g data-kind="{kid}">')
        s.rect(560, ky, 704, 62, "legend", 10, box)
        s.text(580, ky + 38, name, 17, "t b", inside=box)
        s.text(750, ky + 38, mean, 16, "t", inside=box)
        s.add("</g>")
        ky += 76
    y += 236
    bw3 = (1248 - 2 * 24) / 3
    for i, (op, title, code, rows) in enumerate(SEARCHES):
        x = 16 + i * (bw3 + 24)
        box = f"op-{op}"
        s.add(f'<g data-card="{op}">')
        s.rect(x, y, bw3, 280, "card", 12, box)
        s.text(x + 18, y + 30, title, 18, "t b", inside=box)
        s.text(x + bw3 - 16, y + 30, f"{len(rows)}건", 17, "t b", "end", inside=box)
        s.rect(x + 14, y + 44, bw3 - 28, 60, "code", 8, f"code-{op}")
        s.text(x + 24, y + 67, code[: code.index("(") + 1], 16, "t m", inside=f"code-{op}")
        s.text(x + 24, y + 91, "    " + code[code.index("(") + 1:], 16, "t m", inside=f"code-{op}")
        table(s, x + 14, y + 114, bw3 - 28, [r + (None, None) for r in rows], op, 16, 32, (10, 50, 120, 220), 300, box)
        s.add("</g>")
    x = 16 + 2 * (bw3 + 24)
    s.add('<g data-card="summary">')
    s.rect(x, y, bw3, 280, "card", 12, "op-summary")
    s.text(x + 18, y + 30, "요약 · 지출 계산", 18, "t b", inside="op-summary")
    s.text(x + bw3 - 16, y + 30, "새 값", 17, "t b", "end", inside="op-summary")
    s.rect(x + 14, y + 44, bw3 - 28, 34, "code", 8, "code-summary")
    s.text(x + 24, y + 67, SUMMARY_CODE, 16, "t m", inside="code-summary")
    sy = y + 118
    for name, val in SUMMARY:
        s.text(x + 24, sy, name, 16, "s b", inside="op-summary")
        s.text(x + 130, sy, val, 16, "t m b", inside="op-summary", extra=f' data-summary="{esc(name)}={esc(val)}"')
        sy += 34
    s.text(x + 24, sy, "sum() · len() · 나누기 / 는 소수", 16, "s", inside="op-summary")
    s.add("</g>")
    y += 296
    s.rect(16, y, 1248, 44, "legend", 10, "original-note")
    s.text(32, y + 29, ORIGINAL_NOTE, 17, "t b", inside="original-note", extra=' data-original="4"')
    y += 104

    # ── 그림 B ──────────────────────────────────────────────
    s.comment("그림 B. 하나의 기능을 처리하는 책임")
    section_head(s, 16, y, "B", "하나의 기능을 처리하는 책임 · " + COMMAND, 22)
    y = legend_b(s, 16, y + 22, 1248, 17) + 12
    s.rect(16, y, 1248, 44, "legend", 10, "layer-note")
    s.text(32, y + 28, LAYER_NOTE, 16, "t b", inside="layer-note")
    y += 60

    s.comment("B-1 실제 호출 흐름: 책임 영역을 가로 띠로, 시간은 왼쪽 → 오른쪽. main()은 끝까지 실행 중인 막대")
    top = y
    lane_h = {"cli": 182, "service": 112, "repo": 150, "model": 112}
    s.rect(16, top, 1248, 34 + sum(lane_h.values()) + 12 * 3 + 16, "card", 12, "flow")
    s.text(36, top + 26, "B-1 실제 호출 흐름 · 호출 추적으로 확인", 18, "t b", inside="flow")
    ly = top + 38
    lane_y = {}
    for lid, name, path in LANES:
        h = lane_h[lid]
        lane_y[lid] = ly
        s.add(f'<rect x="28" y="{ly}" width="1224" height="{h}" rx="10" class="lane2" data-box="lane-{lid}" data-lane="{lid}"/>')
        if lid == "cli":
            s.text(44, ly + 22, f"{name} · {path}", 16, "laneH", inside=f"lane-{lid}")
        else:
            s.text(44, ly + 24, name, 16, "laneH", inside=f"lane-{lid}")
            s.text(44, ly + 48, path, 16, "s m", inside=f"lane-{lid}")
        ly += h + 12
    geo = {
        "main": (40, lane_y["cli"] + 32, 1200, 50),
        "build": (48, lane_y["cli"] + 108, 164, 60),
        "repo": (230, lane_y["repo"] + 34, 250, 60),
        "tx": (260, lane_y["model"] + 34, 214, 60),
        "service": (500, lane_y["service"] + 34, 262, 60),
        "change": (784, lane_y["service"] + 34, 246, 60),
        "update": (804, lane_y["repo"] + 34, 246, 60),
        "get": (1076, lane_y["repo"] + 34, 100, 60),
        "format": (1086, lane_y["cli"] + 108, 154, 60),
    }
    for nid, lid, label, note in CALL_NODES:
        x, yy, w, h = geo[nid]
        box = f"call-{nid}"
        s.add(f'<g data-callnode="{nid}" data-layer="{lid}">')
        s.rect(x, yy, w, h, "bar" if nid == "main" else "fn", 10, box)
        if nid == "main":
            s.step(x + 22, yy + 25, "1")
            s.text(x + 46, yy + 31, label, 16, "t m b", inside=box)
            s.text(x + 120, yy + 31, note, 16, "s", inside=box)
        else:
            s.text(x + 14, yy + 25, label, 16, "t m b", inside=box)
            s.text(x + 14, yy + 49, note, 16, "t m" if nid == "update" else "s", inside=box)
        s.add("</g>")
    mx, my, mw, mh = geo["main"]
    for frm, to, n in CALLS:
        x, yy, w, h = geo[to]
        if frm == "main":
            lx = x + 22
            s.call([(lx, my + mh), (lx, yy - 2)], frm, to, n)
            s.step(lx + 22, yy - 16 if to in ("build", "format") else yy - 18, n, 13, 16)
        elif frm == "update":
            fx, fy, fw, fh = geo[frm]
            s.call([(fx + fw, fy + 20), (x - 2, fy + 20)], frm, to, n)
            s.step((fx + fw + x) / 2, fy - 4, n, 13, 16)
        else:
            fx, fy, fw, fh = geo[frm]
            lx = x + 20
            s.call([(lx, fy + fh), (lx, yy - 2)], frm, to, n)
            s.step(lx + 22, yy - 18, n, 13, 16)
    gx, gy, gw, gh = geo["get"]
    ux, uy, uw, uh = geo["update"]
    s.retline([(gx + gw / 2, gy + gh), (gx + gw / 2, gy + gh + 18), (ux + uw - 30, gy + gh + 18), (ux + uw - 30, uy + uh + 2)], "get", "update")
    s.text(ux + uw - 20, gy + gh + 40, "return tx (id 2)", 16, "retT")
    cx, cy, cw2, ch = geo["change"]
    s.retline([(ux + uw - 40, uy), (ux + uw - 40, cy + ch + 2)], "update", "change")
    s.text(ux + uw - 50, uy - 14, "return tx", 16, "retT", "end")
    s.retline([(cx + cw2 - 30, cy), (cx + cw2 - 30, my + mh + 2)], "change", "main")
    s.text(cx + cw2 - 22, cy - 48, "return tx", 16, "retT")
    y = ly + 4
    s.rect(16, y, 1248, 44, "code", 10, "result")
    s.text(32, y + 28, "실행 결과", 16, "s", inside="result")
    s.text(120, y + 28, RESULT, 16, "t m b", inside="result", extra=f' data-out="{esc(RESULT)}"')
    s.text(1248, y + 28, "main()이 print()로 출력", 16, "s", "end", inside="result")
    y += 64

    s.comment("B-2 이 기능에서 누가 무엇을 했나 + 실패하는 경우")
    fw4 = (1248 - 3 * 16) / 4
    for i, (fid, title, who, lines) in enumerate(FOCUS):
        x = 16 + i * (fw4 + 16)
        box = f"focus-{fid}"
        s.add(f'<g data-focus="{fid}">')
        s.rect(x, y, fw4, 132, "card", 12, box)
        s.text(x + 16, y + 30, title, 18, "t b", inside=box)
        s.text(x + 16, y + 56, who, 16, "s b", inside=box)
        for k, ln in enumerate(lines):
            s.text(x + 16, y + 86 + 26 * k, ln, 16, "t", inside=box)
        s.add("</g>")
    y += 148
    bw2 = (1248 - 24) / 2
    for i, (bid, cmd, out, lines) in enumerate(BRANCHES):
        x = 16 + i * (bw2 + 24)
        box = f"branch-{bid}"
        s.add(f'<g data-branch="{bid}">')
        s.rect(x, y, bw2, 150, "card", 12, box)
        code_lines(s, x + 14, y + 14, bw2 - 28, ["$ " + cmd, out], 16, 26, f"branch-code-{bid}", out_from=1)
        for k, ln in enumerate(lines):
            s.text(x + 18, y + 98 + 26 * k, ln, 16, "t" if k == 0 else "s", inside=box)
        s.add("</g>")
    y += 174

    s.comment("B-3 기능별 책임 표 (순서가 아니므로 번호 없음)")
    s.text(16, y + 6, "B-3 기능별 책임 · cashbook 예시 (번호 없음: 순서가 아니라 책임)", 20, "t b")
    y += 22
    colx = [16, 196, 548, 906]
    colw = [180, 352, 358, 358]
    heads = ["기능", "CLI · 명령 해석·표시", "서비스 · 처리 규칙", "저장소 · 데이터 읽기·바꾸기"]
    for k, hd in enumerate(heads):
        s.rect(colx[k], y, colw[k], 40, "mxH", 0, f"mxh-{k}")
        s.text(colx[k] + 14, y + 26, hd, 16, "t b", inside=f"mxh-{k}")
    y += 40
    for fid, name, cli, svc, repo in MATRIX:
        s.add(f'<g data-feature="{fid}">')
        s.rect(colx[0], y, colw[0], 62, "mx", 0, f"mx-{fid}-name")
        s.text(colx[0] + 14, y + 26, name, 17, "t b", inside=f"mx-{fid}-name")
        s.text(colx[0] + 14, y + 50, fid, 16, "s m", inside=f"mx-{fid}-name")
        for k, (lid, (code, duty)) in enumerate((("cli", cli), ("service", svc), ("repo", repo))):
            box = f"mx-{fid}-{lid}"
            s.rect(colx[k + 1], y, colw[k + 1], 62, "mx", 0, box, extra=f' data-duty="{fid}:{lid}" data-code="{esc(code)}"')
            s.text(colx[k + 1] + 14, y + 26, code, 16, "t m b", inside=box)
            s.text(colx[k + 1] + 14, y + 50, duty, 16, "t", inside=box)
        s.add("</g>")
        y += 62
    for k, ln in enumerate(MATRIX_NOTE):
        s.text(16, y + 26 + 24 * k, ln, 16, "s")
    y += 26 + 24 * len(MATRIX_NOTE) + 20

    s.comment("B-4 다음 장면으로: 메모리 속 변경 ≠ 파일 저장")
    s.rect(16, y, 1248, 286, "card", 12, "bridge")
    s.text(36, y + 32, "다음 질문 · 메모리 속 데이터를 바꾸는 것과 파일에 저장하는 것은 같을까?", 19, "t b", inside="bridge")
    bx = 32
    for k, (cmd, outs) in enumerate(BRIDGE_RUNS):
        w = 560 if k == 0 else 640
        s.text(bx, y + 64, f"실행 {k + 1}", 16, "s b", inside="bridge")
        cmd_lines = ["$ " + cmd] if k else ["$ " + cmd[: cmd.index(" --category")], "    " + cmd[cmd.index("--category"):]]
        code_lines(s, bx, y + 74, w, cmd_lines + outs, 16, 24, f"bridge-{k + 1}", out_from=len(cmd_lines))
        bx += w + 16
    for k, ln in enumerate(BRIDGE_NOTE):
        s.text(36, y + 238 + 24 * k, ln, 16, "t b" if k == 1 else "t", inside="bridge")
    y += 310
    for i, t in enumerate(FOOT):
        s.text(32, y + 26 * i, t, 16, "s")
    s.h = int(y + 26 * len(FOOT) + 8)
    s.save("crud-flow-desktop.svg", DESC)


# ══ 휴대전화용 (360) ═════════════════════════════════════════════
def mobile():
    s = Svg(360, 0, TITLE + " · 휴대전화용", "m4")
    for i, t in enumerate(["데이터는 어떻게 추가·조회·", "수정·삭제되고, 검색과", "요약에 활용될까?"]):
        s.text(12, 32 + 28 * i, t, 21, "t b")
    s.text(12, 112, "Scene 03-B · 메모리 안의 거래 목록으로", 14, "s")
    s.text(12, 132, "CRUD·검색·요약과 한 기능의 책임 보기", 14, "s")
    y = 176

    s.comment("그림 A")
    section_head(s, 12, y, "A", "데이터가 바뀌는 과정", 17)
    s.text(12, y + 26, "crud_basics.py · 메모리 안의 리스트", 14, "s")
    y = legend_a(s, 12, y + 38, 336, 14, mobile=True) + 14

    cols = (10, 40, 86, 166)
    s.rect(12, y, 336, 180, "card", 12, "op-initial")
    s.text(24, y + 28, "처음 상태 · transactions (4건)", 15, "t b", inside="op-initial")
    table(s, 20, y + 40, 320, [r + (None, None) for r in INITIAL], "initial", 14, 28, cols, 254, "op-initial", TAG_M)
    y += 192
    dh = 46 + 16 + 24 * len(DICT_CODE) + 12 + 22 * len(DATA_NOTES)
    s.rect(12, y, 336, dh, "card", 12, "data-shape")
    s.text(24, y + 28, "데이터를 담는 모양", 15, "t b", inside="data-shape")
    yy = code_lines(s, 20, y + 40, 220, DICT_CODE, 14, 24, "dict-code")
    s.text(250, y + 66, "id가 2인 행", 14, "s", inside="data-shape")
    yy += 26
    for kind, t in DATA_NOTES:
        s.text(24, yy, t, 14, "t b" if kind == "b" else "t", inside="data-shape")
        yy += 22
    y += dh + 12

    s.text(12, y + 8, "아래 카드는 위에서부터 차례로 실행한 결과", 14, "s")
    y += 22
    for op, letter, title, code, rows, count, _, notes in CRUD:
        box = f"op-{op}"
        h = 106 + (14 + 12) + 28 * len(rows) + 22 * len(notes) + 10
        s.add(f'<g data-card="{op}">')
        s.rect(12, y, 336, h, "card", 12, box)
        bw = op_badge(s, 22, y + 12, letter, 15)
        s.text(30 + bw, y + 32, title, 15, "t b", inside=box)
        s.text(336, y + 32, count, 14, "t b", "end", inside=box)
        lines = [code] if len(code) <= 30 else [code[: code.index(",") + 1], "    " + code[code.index(",") + 2:]]
        s.rect(20, y + 48, 320, 16 + 22 * len(lines), "code", 8, f"code-{op}")
        for k, ln in enumerate(lines):
            s.text(30, y + 68 + 22 * k, ln, 14, "t m", inside=f"code-{op}")
        ty = table(s, 20, y + 72 + 22 * len(lines), 320, rows, op, 14, 28, cols, 254 if op != "update" else 262, box, TAG_M)
        for k, ln in enumerate(notes):
            s.text(22, ty + 18 + 22 * k, ln, 14, "t b" if k == 0 else "s", inside=box)
        s.add("</g>")
        y += h + 12

    s.comment("A-2 검색과 요약")
    y += 14
    s.text(12, y, "검색과 요약 · search_summary.py", 16, "t b")
    s.text(12, y + 22, "원본 = 위의 '처음 상태' 4건 그대로", 14, "s")
    y += 36
    for kid, name, mean in KINDS:
        box = f"kind-{kid}"
        s.add(f'<g data-kind="{kid}">')
        s.rect(12, y, 336, 54, "legend", 10, box)
        s.text(24, y + 22, name, 14, "t b", inside=box)
        s.text(24, y + 43, mean, 14, "t", inside=box)
        s.add("</g>")
        y += 60
    y += 6
    for op, title, code, rows in SEARCHES:
        box = f"op-{op}"
        lines = [code] if len(code) <= 30 else [code[: code.index("(") + 1], "    " + code[code.index("(") + 1:]]
        h = 46 + 16 + 22 * len(lines) + 14 + 26 + 28 * len(rows) + 6
        s.add(f'<g data-card="{op}">')
        s.rect(12, y, 336, h, "card", 12, box)
        s.text(24, y + 28, title, 15, "t b", inside=box)
        s.text(336, y + 28, f"{len(rows)}건", 14, "t b", "end", inside=box)
        s.rect(20, y + 40, 320, 16 + 22 * len(lines), "code", 8, f"code-{op}")
        for k, ln in enumerate(lines):
            s.text(30, y + 60 + 22 * k, ln, 14, "t m", inside=f"code-{op}")
        table(s, 20, y + 70 + 22 * len(lines), 320, [r + (None, None) for r in rows], op, 14, 28, cols, 254, box, TAG_M)
        s.add("</g>")
        y += h + 12
    h = 46 + 38 + 30 * len(SUMMARY) + 30
    s.add('<g data-card="summary">')
    s.rect(12, y, 336, h, "card", 12, "op-summary")
    s.text(24, y + 28, "요약 · 지출 계산", 15, "t b", inside="op-summary")
    s.text(336, y + 28, "새 값", 14, "t b", "end", inside="op-summary")
    s.rect(20, y + 40, 320, 36, "code", 8, "code-summary")
    s.text(30, y + 63, SUMMARY_CODE, 14, "t m", inside="code-summary")
    sy = y + 104
    for name, val in SUMMARY:
        s.text(24, sy, name, 14, "s b", inside="op-summary")
        s.text(116, sy, val, 14, "t m b", inside="op-summary", extra=f' data-summary="{esc(name)}={esc(val)}"')
        sy += 30
    s.text(24, sy, "sum() · len() · 나누기 / 는 소수", 14, "s", inside="op-summary")
    s.add("</g>")
    y += h + 12
    s.rect(12, y, 336, 66, "legend", 10, "original-note")
    s.text(24, y + 26, "검색·요약 뒤에도 원본은 4건 그대로", 14, "t b", inside="original-note", extra=' data-original="4"')
    s.text(24, y + 48, "결과는 새 목록·새 값", 14, "t", inside="original-note")
    y += 66 + 48

    s.comment("그림 B")
    section_head(s, 12, y, "B", "하나의 기능을 처리하는 책임", 17)
    y += 16
    s.rect(12, y, 336, 56, "code", 10, "cmd")
    s.text(22, y + 22, "python -m cashbook update", 14, "t m b", inside="cmd")
    s.text(22, y + 44, "    --id 2 --amount 7000", 14, "t m b", inside="cmd")
    y = legend_b(s, 12, y + 66, 336, 14, mobile=True) + 10
    s.rect(12, y, 336, 88, "legend", 10, "layer-note")
    for k, ln in enumerate(["CLI·서비스·저장소·모델은 Python 문법이", "아니라 책임을 나누는 설계의 한 예입니다.", "모든 기능이 네 곳을 다 거치지도 않습니다."]):
        s.text(24, y + 26 + 22 * k, ln, 14, "t b" if k < 2 else "t", inside="layer-note")
    y += 100

    s.comment("B-1 호출 흐름(세로): main()은 왼쪽 막대(끝까지 실행 중), 오른쪽으로 들어갈수록 안쪽 책임 영역")
    s.text(12, y + 4, "실제 호출 흐름 · 호출 추적으로 확인", 15, "t b")
    s.text(12, y + 26, "들여쓰기 = 책임 영역(오른쪽 위 글자)", 14, "s")
    y += 40
    lane_x = {"cli": 64, "service": 88, "repo": 112, "model": 136}
    info = {n: (lid, label, note) for n, lid, label, note in CALL_NODES}
    order = ["build", "repo", "tx", "service", "change", "update", "get", "format"]
    gap = {"tx": 26, "update": 26, "get": 26}
    total = 56 + 18 + sum(56 + gap.get(n, 14) for n in order) + 16
    s.rect(12, y, 336, total + 8, "card", 12, "flow")
    pos = {}
    s.add('<g data-callnode="main" data-layer="cli">')
    s.rect(20, y + 10, 310, 56, "entry", 10, "call-main-head")
    s.step(40, y + 38, "1", 11, 14)
    s.text(58, y + 32, "main()", 14, "t m b", inside="call-main-head")
    s.text(58, y + 54, "끝까지 실행 중 · 결과 출력", 14, "s", inside="call-main-head")
    yy = y + 10 + 56 + 14
    s.add(f'<rect x="22" y="{yy}" width="24" height="{total - 56 - 26}" rx="6" class="bar" data-box="call-main"/>')
    s.add("</g>")
    for nid in order:
        yy += gap.get(nid, 14) - 14
        lid, label, note = info[nid]
        x = lane_x[lid]
        w = 330 - x
        box = f"call-{nid}"
        pos[nid] = (x, yy, w, 56)
        s.add(f'<g data-callnode="{nid}" data-layer="{lid}">')
        s.rect(x, yy, w, 56, "fn", 10, box)
        s.text(x + 12, yy + 22, label, 14, "t m b", inside=box)
        s.text(x + 12, yy + 45, note, 14, "t m" if nid == "update" else "s", inside=box)
        s.text(x + w - 10, yy + 45 if nid == "update" else yy + 45, LANE_NAME[lid], 14, "laneH", "end", inside=box)
        s.add("</g>")
        yy += 56 + 14
    for frm, to, n in CALLS:
        tx, ty, tw_, th = pos[to]
        if frm == "main":
            s.call([(46, ty + 24), (tx - 2, ty + 24)], frm, to, n)
        else:
            fx, fy, fw, fh = pos[frm]
            lx = tx + 16
            s.call([(lx, fy + fh), (lx, ty - 2)], frm, to, n)
        s.step(tx - 4 if frm == "main" else tx + 32, ty - 2 if frm == "main" else ty - 12, n, 11, 14)
    gx, gy, gw, gh = pos["get"]
    ux, uy, uw, uh = pos["update"]
    cx, cy, cw2, ch = pos["change"]
    s.retline([(gx + gw, gy + 40), (340, gy + 40), (340, uy + 40), (ux + uw + 2, uy + 40)], "get", "update")
    s.retline([(ux + uw, uy + 50), (352, uy + 50), (352, cy + 40), (cx + cw2 + 2, cy + 40)], "update", "change")
    s.retline([(cx, cy + 46), (48, cy + 46)], "change", "main")
    y += total + 20
    for k, ln in enumerate(["회색 선: get()이 tx를 return → update_amount()", "→ change_amount() → main()이 출력"]):
        s.text(12, y + 20 * k, ln, 14, "retT")
    y += 40
    s.rect(12, y, 336, 66, "code", 10, "result")
    s.text(24, y + 24, "실행 결과 · main()이 print()로 출력", 14, "s", inside="result")
    s.text(24, y + 48, RESULT, 14, "t m b", inside="result", extra=f' data-out="{esc(RESULT)}"')
    y += 80

    for fid, title, who, lines in FOCUS:
        box = f"focus-{fid}"
        s.add(f'<g data-focus="{fid}">')
        s.rect(12, y, 336, 104, "card", 12, box)
        s.text(24, y + 26, title, 15, "t b", inside=box)
        s.text(336, y + 26, who.split(" · ")[0], 14, "s b", "end", inside=box)
        s.text(24, y + 50, who.split(" · ")[1], 14, "t m", inside=box)
        for k, ln in enumerate(lines):
            s.text(24, y + 72 + 22 * k, ln, 14, "t", inside=box)
        s.add("</g>")
        y += 112
    y += 6
    for bid, cmd, out, lines in BRANCHES:
        box = f"branch-{bid}"
        s.add(f'<g data-branch="{bid}">')
        s.rect(12, y, 336, 180, "card", 12, box)
        head, tail = cmd.split(" update ")
        code_lines(s, 20, y + 10, 320, ["$ " + head + " update", "  " + tail, out], 14, 22, f"branch-code-{bid}", out_from=2)
        first, rest = lines[0].split(" → ")
        for j, p in enumerate([first, "→ " + rest, lines[1]]):
            s.text(22, y + 124 + 22 * j, p, 14, "s" if j == 2 else "t", inside=box)
        s.add("</g>")
        y += 192

    s.comment("B-3 기능별 책임(번호 없음)")
    y += 10
    s.text(12, y, "기능별 책임 · cashbook 예시", 16, "t b")
    s.text(12, y + 22, "번호 없음: 순서가 아니라 책임", 14, "s")
    y += 36
    for fid, name, cli, svc, repo in MATRIX:
        s.add(f'<g data-feature="{fid}">')
        s.rect(12, y, 336, 112, "card", 12, f"mx-{fid}-name")
        s.text(24, y + 26, name, 15, "t b", inside=f"mx-{fid}-name")
        s.text(336, y + 26, fid, 14, "s m", "end", inside=f"mx-{fid}-name")
        for k, (lid, (code, duty)) in enumerate((("cli", cli), ("service", svc), ("repo", repo))):
            box = f"mx-{fid}-{lid}"
            s.rect(20, y + 36 + 24 * k, 320, 22, "mx", 4, box, extra=f' data-duty="{fid}:{lid}" data-code="{esc(code)}"')
            s.text(28, y + 52 + 24 * k, f"{LANE_NAME[lid]} · {duty}", 14, "t", inside=box)
        s.add("</g>")
        y += 120
    for k, ln in enumerate(["모델 Transaction은 모든 기능에서", "거래 한 건의 모양을 정합니다.", "전체 조회처럼 서비스가 그대로", "넘기기만 하는 기능도 있습니다."]):
        s.text(12, y + 14 + 20 * k, ln, 14, "s")
    y += 14 + 80 + 20

    s.comment("B-4 다음 질문")
    bh = 50 + 2 * 28 + (16 + 22 * 3) + (16 + 22 * 6) + 30 + 22 * 5 + 10
    s.rect(12, y, 336, bh, "card", 12, "bridge")
    s.text(24, y + 26, "다음 질문 · 메모리 속 변경 =", 15, "t b", inside="bridge")
    s.text(24, y + 48, "파일 저장일까?", 15, "t b", inside="bridge")
    yy = y + 62
    s.text(24, yy + 16, "실행 1", 14, "s b", inside="bridge")
    yy = code_lines(s, 20, yy + 24, 320, ["$ python -m cashbook add", "  --type 지출 --category 문구", "  --amount 3000"], 14, 22, "bridge-1-cmd")
    yy = code_lines(s, 20, yy + 4, 320, BRIDGE_RUNS[0][1], 14, 22, "bridge-1", out_from=0)
    s.text(24, yy + 22, "실행 2", 14, "s b", inside="bridge")
    yy = code_lines(s, 20, yy + 30, 320, ["$ python -m cashbook list"] + BRIDGE_RUNS[1][1], 14, 22, "bridge-2", out_from=1)
    for k, ln in enumerate(["실행 1에서 추가한 id 5가 실행 2에는", "없습니다. 데이터가 메모리 안의 리스트에만", "있었고 프로그램이 끝나면 사라지기 때문.", "껐다 켜도 남기려면?", "→ Scene 04 파일 저장"]):
        s.text(24, yy + 26 + 22 * k, ln, 14, "t b" if k >= 3 else "t", inside="bridge")
    y += bh + 20
    for i, t in enumerate(FOOT_M):
        s.text(12, y + 22 * i, t, 14, "s")
    s.h = int(y + 22 * len(FOOT_M) + 4)
    s.save("crud-flow-mobile.svg", DESC)


if __name__ == "__main__":
    desktop()
    mobile()
    print("written to", OUT)
