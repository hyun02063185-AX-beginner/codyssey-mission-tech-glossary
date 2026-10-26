"""B6-1 미션 스토리(흩어진 데이터가 하나의 답이 되는 과정) SVG 생성기.

그림 4종을 PC(desktop)·모바일(mobile)용으로 만든다. 결과는 ../assets/ 에 쓴다.
  erd-story        기준 ERD 하나. 상태 overview / read / join / return (Scene 01·03·04)
  split-story      한 장의 표 → 나눈 표 → 키로 연결. 상태 one / split / keys (Scene 02, 가이드 V03의 다크 재구성 포함)
  join-compare     INNER JOIN 과 LEFT JOIN 결과 비교 (Scene 03, 가이드 V06의 다크 재구성)
  same-structure   B6-1(N:M → 연결 표)과 1:N 예시 하나 (Scene 01)

상태 전환: 루트 <svg data-state="..."> 값만 바꾼다. 파일 안 <style>이 상태별로 보이기·흐리기·강조를 정한다.
<img>로 쓰면 기본 상태(첫 상태)만 보이므로, 렌더러는 SVG를 인라인으로 넣고 data-state를 바꾼다.
색은 --presentation-* 토큰을 쓰고, 토큰이 없으면 Dark 기본값으로 보인다(인라인 시 Light도 자동 적용).
강조는 색 + 굵은 테두리 + 글자 이름표로 표시하고 색만으로 구분하지 않는다.

모든 표 데이터는 Codyssey_B6-1(커밋 8b99440)의 SQL을 SQLite 3.43.2로 실행해 확인한 값이다.
실행: python3 -I build.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets")
FONT = "'Pretendard Variable','Pretendard','Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif"
P = "b61s"  # 인라인 시 다른 CSS와 겹치지 않도록 모든 클래스에 붙이는 접두사

TOKENS = {
    "bg": "var(--presentation-bg,#111827)",
    "panel": "var(--presentation-panel,#1d2736)",
    "ink": "var(--presentation-ink,#eef2f7)",
    "muted": "var(--presentation-muted,#bdc8d7)",
    "line": "var(--presentation-line,#64748b)",
    "chip": "var(--presentation-chip,#293549)",
    "accent": "var(--presentation-accent,#ffad86)",
    "accent_soft": "var(--presentation-accent-soft,#4b2c26)",
    "pk": "var(--presentation-python,#9cc8ff)",
    "pk_soft": "var(--presentation-python-soft,#203957)",
    "fk": "var(--presentation-app,#86dfb0)",
    "fk_soft": "var(--presentation-app-soft,#183f32)",
    "real": "var(--presentation-real,#edcf8e)",
    "real_soft": "var(--presentation-real-soft,#403622)",
}


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def base_css(states):
    t = TOKENS
    css = [
        f".{P}-bg{{fill:{t['bg']}}}",
        f".{P}-box{{fill:{t['panel']};stroke:{t['line']};stroke-width:2}}",
        f".{P}-cell{{fill:{t['panel']};stroke:{t['line']};stroke-width:1.5}}",
        f".{P}-head{{fill:{t['chip']};stroke:{t['line']};stroke-width:1.5}}",
        f".{P}-ink{{fill:{t['ink']}}}",
        f".{P}-muted{{fill:{t['muted']}}}",
        f".{P}-b{{font-weight:700}}",
        f".{P}-rel{{stroke:{t['muted']};stroke-width:2.5;fill:none}}",
        f".{P}-ring{{fill:{t['panel']};stroke:{t['muted']};stroke-width:2.5}}",
        f".{P}-pk{{fill:{t['pk_soft']};stroke:{t['pk']};stroke-width:1.5}}",
        f".{P}-pkt{{fill:{t['pk']};font-weight:700}}",
        f".{P}-fk{{fill:{t['fk_soft']};stroke:{t['fk']};stroke-width:1.5}}",
        f".{P}-fkt{{fill:{t['fk']};font-weight:700}}",
        f".{P}-tag{{fill:{t['accent_soft']};stroke:{t['accent']};stroke-width:2}}",
        f".{P}-real{{fill:{t['real_soft']};stroke:{t['real']};stroke-width:1.5}}",
        f".{P}-realt{{fill:{t['real']};font-weight:700}}",
        f".{P}-acc{{fill:{t['accent']}}}",
        f".{P}-mark{{fill:none;stroke:{t['accent']};stroke-width:3;stroke-dasharray:7 5}}",
        f".{P}-ptr{{fill:none;stroke:{t['accent']};stroke-width:3;stroke-dasharray:9 6}}",
        f".{P}-ptrhead{{fill:{t['accent']}}}",
        f".{P}-num{{fill:{t['accent']}}}",
        f".{P}-numt{{fill:{t['bg']};font-weight:700}}",
        f".{P}-strike{{stroke:{t['muted']};stroke-width:2}}",
    ]
    for s in states:
        sel = f'svg[data-state="{s}"]'
        css += [
            f"{sel} .{P}-hide-{s}{{display:none}}",
            f"{sel} .{P}-dim-{s}{{opacity:.3}}",
            f"{sel} .{P}-hi-{s} .{P}-box{{stroke:{t['accent']};stroke-width:4}}",
            f"{sel} .{P}-hi-{s} .{P}-rel{{stroke:{t['accent']};stroke-width:5}}",
            f"{sel} .{P}-hi-{s} .{P}-ring{{stroke:{t['accent']};stroke-width:4}}",
            f"{sel} .{P}-rhi-{s} .{P}-col{{fill:{t['accent']};font-weight:700}}",
        ]
    return "".join(css)


class Fig:
    """상태별 클래스를 붙여 요소를 모으는 그림 하나."""

    def __init__(self, name, w, h, states, title, label):
        self.name, self.w, self.h, self.states = name, w, h, states
        self.title, self.label = title, label
        self.parts = []

    def cls(self, *base, show=None, dim=(), hi=(), rhi=()):
        names = [f"{P}-{b}" for part in base if part for b in part.split()]
        if show is not None:
            names += [f"{P}-hide-{s}" for s in self.states if s not in show]
        names += [f"{P}-dim-{s}" for s in dim] + [f"{P}-hi-{s}" for s in hi] + [f"{P}-rhi-{s}" for s in rhi]
        return " ".join(names)

    def add(self, s):
        self.parts.append(s)

    def text(self, x, y, s, size, cls="ink", anchor="start", bold=False, **kw):
        c = self.cls(cls, "b" if bold else None, **kw)
        self.add(f'<text x="{x:g}" y="{y:g}" font-size="{size}" text-anchor="{anchor}" class="{c}">{esc(s)}</text>')

    def rect(self, x, y, w, h, cls, rx=0, **kw):
        self.add(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{rx}" class="{self.cls(cls, **kw)}"/>')

    def group(self, inner, deco=False, **kw):
        self.add(f'<g class="{self.cls("deco" if deco else None, **kw)}" {'aria-hidden="true"' if deco else ""}>{"".join(inner)}</g>')

    def write(self):
        body = "".join(self.parts)
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
               f'data-state="{self.states[0]}" data-states="{" ".join(self.states)}" font-family="{esc(FONT)}" role="img" aria-label="{esc(self.label)}">'
               f"<title>{esc(self.title)}</title><style>{base_css(self.states)}</style>"
               f'<rect width="{self.w}" height="{self.h}" class="{P}-bg"/>{body}</svg>\n')
        with open(os.path.join(OUT, self.name), "w", encoding="utf-8") as f:
            f.write(svg)


# ---------- 공통 조각 ----------

def sub(f, inner_fn):
    """f.add 대신 문자열 목록으로 모으기(그룹 안에 넣을 때)."""
    saved, f.parts = f.parts, []
    inner_fn()
    out, f.parts = f.parts, saved
    return out


def badge(f, x, y, kind, size):
    w, h = size * 2.3, size + 8
    f.rect(x, y, w, h, kind.lower(), rx=5)
    f.text(x + w / 2, y + h / 2 + size * 0.36, kind, size, cls=kind.lower() + "t", anchor="middle")
    return w


def chip(f, x, y, w, h, lines, size, show=None, cls="tag", num=None):
    f.add(f'<g class="{f.cls(None, show=show)}">')
    f.rect(x, y, w, h, cls, rx=h / 2 if len(lines) == 1 else 12)
    tx = x + 16
    if num:
        r = size * 0.62
        f.add(f'<circle cx="{x + 14 + r:g}" cy="{y + h / 2:g}" r="{r:g}" class="{P}-num"/>')
        f.text(x + 14 + r, y + h / 2 + size * 0.34, num, size * 0.9, cls="numt", anchor="middle")
        tx = x + 14 + 2 * r + 10
    lh = size * 1.3
    top = y + h / 2 - (len(lines) - 1) * lh / 2 + size * 0.36
    for i, line in enumerate(lines):
        f.text(tx, top + i * lh, line, size, bold=(i == 0 and cls == "realt"))
    f.add("</g>")


def num_circle(f, cx, cy, n, size, show=None):
    f.add(f'<g class="{f.cls(None, show=show)}"><circle cx="{cx:g}" cy="{cy:g}" r="{size * 0.66:g}" class="{P}-num"/>')
    f.text(cx, cy + size * 0.36, n, size * 0.9, cls="numt", anchor="middle")
    f.add("</g>")


def relation(f, pts, size, label_side=(1, 1), show=None, dim=(), hi=()):
    """ERD 관계선. pts[0]=부모 쪽(||, 반드시 1), pts[-1]=자식 쪽(o{, 0개 이상 여러 개). 화살촉은 쓰지 않는다."""
    def unit(a, b):
        dx, dy = b[0] - a[0], b[1] - a[1]
        d = (dx * dx + dy * dy) ** 0.5
        return dx / d, dy / d

    parts = []
    d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
    parts.append(f'<path d="{d}" class="{P}-rel"/>')
    # 부모 쪽: 수직 막대 두 개 (반드시 1)
    (sx, sy), u = pts[0], unit(pts[0], pts[1])
    n = (-u[1], u[0])
    for k in (10, 18):
        cx, cy = sx + u[0] * k, sy + u[1] * k
        parts.append(f'<path d="M{cx + n[0] * 9:g} {cy + n[1] * 9:g} L{cx - n[0] * 9:g} {cy - n[1] * 9:g}" class="{P}-rel"/>')
    # 자식 쪽: 까마귀발 + 동그라미 (0개 이상 여러 개)
    (ex, ey), u2 = pts[-1], unit(pts[-2], pts[-1])
    n2 = (-u2[1], u2[0])
    ox, oy = ex - u2[0] * 20, ey - u2[1] * 20
    for s in (-1, 0, 1):
        parts.append(f'<path d="M{ox:g} {oy:g} L{ex + n2[0] * 10 * s:g} {ey + n2[1] * 10 * s:g}" class="{P}-rel"/>')
    rx, ry = ex - u2[0] * 31, ey - u2[1] * 31
    parts.append(f'<circle cx="{rx:g}" cy="{ry:g}" r="6" class="{P}-ring"/>')
    # 1 / N 글자 (읽는 법 보조)
    ls, le = label_side
    l1 = (sx + u[0] * 14 + n[0] * 20 * ls, sy + u[1] * 14 + n[1] * 20 * ls)
    l2 = (ex - u2[0] * 16 + n2[0] * 22 * le, ey - u2[1] * 16 + n2[1] * 22 * le)
    for (lx, ly), s in ((l1, "1"), (l2, "N")):
        parts.append(f'<text x="{lx:g}" y="{ly + size * 0.36:g}" font-size="{size}" text-anchor="middle" class="{P}-muted {P}-b">{s}</text>')
    f.group(parts, show=show, dim=dim, hi=hi)


def erd_box(f, x, y, w, h, name, rows, name_size, row_size, row_gap, rows_in, dim=(), hi=(), row_hi=None):
    """테이블 상자. rows_in 상태에서만 PK/FK 열을 보인다. 이름은 열이 보일 때 위, 아닐 때 가운데."""
    row_hi = row_hi or {}

    def inner():
        f.rect(x, y, w, h, "box", rx=14)
        f.text(x + w / 2, y + h / 2 + name_size * 0.36, name, name_size, anchor="middle", bold=True,
               show=[s for s in f.states if s not in rows_in])
        f.text(x + 14, y + name_size + 10, name, name_size, bold=True, show=rows_in)
        top = y + name_size + 22
        for i, (kind, col) in enumerate(rows):
            def row():
                bw = badge(f, x + 12, top + i * row_gap - 1, kind, max(row_size - 2, 16))
                f.text(x + 12 + bw + 7, top + i * row_gap + row_size * 0.95, col, row_size, cls="ink col")
            f.group(sub(f, row), show=rows_in, rhi=row_hi.get(col, ()))

    f.group(sub(f, inner), dim=dim, hi=hi)


# ---------- 1. 기준 ERD ----------

ERD_STATES = ["overview", "read", "join", "return"]
TABLES = {  # B6-1 sql/01_schema.sql 의 PK·FK 열
    "student": [("PK", "id")],
    "teacher": [("PK", "id")],
    "subject": [("PK", "id")],
    "course": [("PK", "id"), ("FK", "subject_id"), ("FK", "teacher_id")],
    "enrollment": [("PK", "id"), ("FK", "student_id"), ("FK", "course_id")],
    "score": [("PK", "id"), ("FK", "enrollment_id")],
}
JOIN_PATH = {"student", "enrollment", "course"}
JOIN_ROWS = {"student": {"id": ["join"]}, "enrollment": {"student_id": ["join"], "course_id": ["join"]}, "course": {"id": ["join"]}}


def erd(name, layout, rels, w, h, sizes, chips):
    f = Fig(name, w, h, ERD_STATES, "B6-1 기준 ERD: 6개 표와 5개 관계",
            "B6-1 공부방 데이터베이스의 ERD. teacher와 subject가 course에, course와 student가 enrollment에, enrollment가 score에 "
            "각각 1대 N으로 연결된다. 선의 한쪽 끝 막대 두 개는 반드시 1, 다른 쪽 끝 동그라미와 까마귀발은 0개 이상 여러 개를 뜻한다.")
    name_size, row_size, row_gap = sizes
    rows_in = ["join", "return"]
    for tname, (x, y, bw, bh) in layout.items():
        dim = ["read"] if tname != "student" else []
        dim += ["join"] if tname not in JOIN_PATH else []
        hi = (["read"] if tname == "student" else []) + (["join"] if tname in JOIN_PATH else [])
        erd_box(f, x, y, bw, bh, tname, TABLES[tname], name_size, row_size, row_gap, rows_in, dim=dim, hi=hi,
                row_hi=JOIN_ROWS.get(tname))
    for (parent, child), (pts, side) in rels.items():
        on_path = {parent, child} <= JOIN_PATH
        dim = ([] if (parent, child) == ("student", "enrollment") else ["read"]) + ([] if on_path else ["join"])
        hi = (["read"] if (parent, child) == ("student", "enrollment") else []) + (["join", "return"] if on_path else [])
        relation(f, pts, row_size, side, dim=dim, hi=hi)
    for c in chips:
        c(f)
    f.write()


def erd_desktop():
    W = 230
    layout = {
        "student": (640, 10, W, 150), "teacher": (20, 110, W, 150), "subject": (20, 360, W, 150),
        "course": (330, 250, W, 150), "enrollment": (640, 250, W, 150), "score": (950, 250, W, 150),
    }
    rels = {
        ("teacher", "course"): ([(250, 185), (290, 185), (290, 300), (330, 300)], (-1, -1)),
        ("subject", "course"): ([(250, 435), (290, 435), (290, 350), (330, 350)], (1, -1)),
        ("course", "enrollment"): ([(560, 325), (640, 325)], (-1, -1)),
        ("student", "enrollment"): ([(755, 160), (755, 250)], (1, 1)),
        ("enrollment", "score"): ([(870, 325), (950, 325)], (-1, -1)),
    }

    def chips(f):
        chip(f, 890, 55, 290, 46, ["상자 하나 = 테이블(표)"], 21, show=["read"])
        chip(f, 790, 182, 380, 46, ["선 = 관계 · 1쪽 하나, N쪽 여러 개"], 20, show=["read"])
        chip(f, 790, 182, 395, 46, ["student.id = enrollment.student_id"], 20, show=["join"], num="1")
        f.add(f'<path d="M600 336 L600 434" class="{f.cls("ptr", show=["join"])}"/>')
        chip(f, 420, 434, 360, 46, ["enrollment.course_id = course.id"], 20, show=["join"], num="2")
        # JOIN 결과가 나타난다 (Q05 실제 결과의 첫 두 행)
        f.text(20, 34, "결과 · Q05 일부", 19, bold=True, show=["join"])
        f.text(20, 62, "(전체 26행)", 18, cls="muted", show=["join"])
        table(f, 300, 4, [("학생", 82), ("수업", 168), ("요일", 58)],
              [["김민준", "중등 수학 기초", "월"], ["김민준", "중등 영어 독해", "화"]], 18, 32, show=["join"])
        chip(f, 330, 440, 270, 46, ["표 = 나누어 정리한 정보"], 20, show=["return"])
        chip(f, 612, 440, 290, 46, ["선 = FK가 PK를 가리키는 관계"], 20, show=["return"])
        chip(f, 914, 440, 266, 46, ["강조 선 = JOIN 경로"], 20, show=["return"])

    erd("erd-story-desktop.svg", layout, rels, 1200, 530, (26, 20, 30), [chips])


def erd_mobile():
    L, R = (16, 94), (172, 172)
    H = 124  # 열 3개(course·enrollment)가 들어가는 높이. 상태가 바뀌어도 상자 크기는 같다
    layout = {
        "teacher": (L[0], 12, L[1], H), "subject": (R[0], 12, R[1], H), "course": (R[0], 196, R[1], H),
        "student": (L[0], 380, L[1], H), "enrollment": (R[0], 380, R[1], H), "score": (R[0], 564, R[1], H),
    }
    rels = {
        ("teacher", "course"): ([(63, 136), (63, 258), (172, 258)], (-1, -1)),
        ("subject", "course"): ([(258, 136), (258, 196)], (-1, -1)),
        ("course", "enrollment"): ([(258, 320), (258, 380)], (-1, -1)),
        ("student", "enrollment"): ([(110, 442), (172, 442)], (-1, -1)),
        ("enrollment", "score"): ([(258, 504), (258, 564)], (-1, -1)),
    }

    def chips(f):
        chip(f, 16, 704, 328, 40, ["상자 하나 = 테이블(표)"], 18, show=["read"])
        chip(f, 16, 752, 328, 64, ["선 = 관계", "1쪽 하나, N쪽 여러 개(0개 가능)"], 17, show=["read"])
        chip(f, 16, 704, 328, 60, ["student.id", "= enrollment.student_id"], 18, show=["join"], num="1")
        chip(f, 16, 772, 328, 60, ["enrollment.course_id", "= course.id"], 18, show=["join"], num="2")
        chip(f, 16, 704, 328, 40, ["표 = 나누어 정리한 정보"], 18, show=["return"])
        chip(f, 16, 750, 328, 40, ["선 = FK가 PK를 가리키는 관계"], 18, show=["return"])
        chip(f, 16, 796, 328, 40, ["강조 선 = JOIN 경로"], 18, show=["return"])

    erd("erd-story-mobile.svg", layout, rels, 360, 846, (20, 17, 26), [chips])


# ---------- 2. 한 장의 표 → 나누기 → 키 ----------

SPLIT_STATES = ["one", "split", "keys"]
SHEET = [  # B6-1 샘플 데이터: 김민준·이서연의 첫 시험 기록 (Q07과 같은 연결 결과)
    ["김민준", "한빛중", "중등 수학 기초", "박서준", "88"],
    ["김민준", "한빛중", "중등 영어 독해", "김하늘", "72"],
    ["이서연", "한빛중", "중등 수학 기초", "박서준", "95"],
]


def table(f, x, y, cols, rows, size, rh, show=None, dim=(), marks=(), pk=(), fk=(), deco=False):
    """cols=[(제목, 폭)], marks={(r,c)} 점선 강조 칸, pk/fk = 배지를 붙일 열 번호."""
    def inner():
        cx = x
        for ci, (title, cw) in enumerate(cols):
            f.rect(cx, y, cw, rh, "head")
            label_x = cx + 10
            if ci in pk or ci in fk:
                bs = max(size - 2, 16)
                label_x += badge(f, cx + 8, y + (rh - bs - 8) / 2, "PK" if ci in pk else "FK", bs) + 6
            f.text(label_x, y + rh / 2 + size * 0.36, title, size, bold=True)
            for ri, row in enumerate(rows):
                f.rect(cx, y + rh * (ri + 1), cw, rh, "cell")
                f.text(cx + 10, y + rh * (ri + 1.5) + size * 0.36, row[ci], size)
            cx += cw
        for (ri, ci) in marks:
            mx = x + sum(c[1] for c in cols[:ci])
            f.rect(mx + 3, y + rh * (ri + 1) + 3, cols[ci][1] - 6, rh - 6, "mark", rx=6)

    f.group(sub(f, inner), show=show, dim=dim, deco=deco)


def pointer(f, pts, show):
    """FK → PK 가리킴(점선 화살표). 실행 순서가 아니다."""
    d = "M" + " L".join(f"{x:g} {y:g}" for x, y in pts)
    (ax, ay), (bx, by) = pts[-2], pts[-1]
    if ay == by:
        s = 1 if bx > ax else -1
        head = f"M{bx:g} {by:g} L{bx - 12 * s:g} {by - 7:g} L{bx - 12 * s:g} {by + 7:g}Z"
    else:
        s = 1 if by > ay else -1
        head = f"M{bx:g} {by:g} L{bx - 7:g} {by - 12 * s:g} L{bx + 7:g} {by - 12 * s:g}Z"
    f.add(f'<g class="{f.cls(None, show=show)}"><path d="{d}" class="{P}-ptr"/><path d="{head}" class="{P}-ptrhead"/></g>')


REPEATS = {(0, 0), (1, 0), (0, 1), (1, 1), (2, 1), (0, 2), (2, 2), (0, 3), (2, 3)}


def split_desktop():
    f = Fig("split-story-desktop.svg", 1200, 530, SPLIT_STATES, "한 장의 표를 나누고 키로 잇기",
            "학생·학교·수업·강사·점수를 한 장에 적으면 같은 값이 반복된다. 학생, 수업, 수강 기록 표로 나누면 정보는 한 번만 적고(교육용 단순화), "
            "수강 기록의 학생 번호와 수업 번호(FK)가 각 표의 id(PK)를 가리켜 연결한다.")
    cols = [("학생", 110), ("학교", 110), ("수업", 220), ("강사", 110), ("점수", 90)]
    table(f, 280, 90, cols, SHEET, 22, 58, show=["one"], marks=REPEATS)
    f.text(280, 70, "한 장에 모두 적은 표", 22, cls="muted", bold=True, show=["one"])
    chip(f, 280, 350, 300, 46, ["점선 칸 = 같은 값의 반복"], 20, show=["one"])
    chip(f, 600, 350, 320, 46, ["박서준이 바뀌면 → 2곳을 고쳐야"], 20, show=["one"])
    # 나눈 뒤: 왼쪽에 원래 표의 축소판
    mini = [("학생", 52), ("학교", 52), ("수업", 92), ("강사", 52), ("점수", 40)]
    table(f, 16, 52, mini, SHEET, 13, 30, show=["split", "keys"], dim=["split", "keys"], deco=True)
    f.text(16, 38, "원래의 한 장", 18, cls="muted", bold=True, show=["split", "keys"])
    f.add(f'<g class="{f.cls(None, show=["split", "keys"])}"><path d="M150 186 L150 226" class="{P}-rel"/>'
          f'<path d="M150 236 L142 222 L158 222Z" class="{P}-acc"/></g>')
    f.text(166, 220, "나누기", 18, cls="muted", bold=True, show=["split", "keys"])
    keys = ["keys"]
    f.text(330, 26, "학생 student", 20, cls="muted", bold=True, show=["split", "keys"])
    table(f, 330, 36, [("id", 84), ("이름", 110), ("학교", 110)], [["1", "김민준", "한빛중"], ["2", "이서연", "한빛중"]],
          20, 50, show=["split", "keys"], pk=[0])
    f.text(760, 26, "수업 course (강사 이름은 교육용 단순화)", 20, cls="muted", bold=True, show=["split", "keys"])
    table(f, 760, 36, [("id", 84), ("수업", 200), ("강사", 110)], [["1", "중등 수학 기초", "박서준"], ["2", "중등 영어 독해", "김하늘"]],
          20, 50, show=["split", "keys"], pk=[0])
    f.text(600, 300, "수강 기록", 20, cls="muted", bold=True, show=["split", "keys"])
    table(f, 500, 310, [("student_id", 166), ("course_id", 154)],
          [["1", "1"], ["1", "2"], ["2", "1"]], 20, 50, show=["split", "keys"], fk=[0, 1])
    f.rect(333, 89, 78, 44, "mark", rx=6, show=keys)
    f.rect(763, 89, 78, 44, "mark", rx=6, show=keys)
    f.rect(503, 363, 160, 44, "mark", rx=6, show=keys)
    f.rect(669, 363, 148, 44, "mark", rx=6, show=keys)
    pointer(f, [(583, 360), (583, 250), (315, 250), (315, 111), (330, 111)], keys)
    pointer(f, [(745, 360), (745, 111), (760, 111)], keys)
    num_circle(f, 315, 250, "1", 20, show=keys)
    num_circle(f, 745, 250, "2", 20, show=keys)
    chip(f, 16, 330, 460, 46, ["PK = 행마다 다른 고유 번호 (id)"], 19, show=keys)
    chip(f, 16, 386, 460, 46, ["FK = 다른 표의 PK를 가리키는 번호"], 19, show=keys)
    chip(f, 16, 442, 460, 46, ["점선 화살표 = 가리킴 (실행 순서 아님)"], 19, show=keys)
    chip(f, 16, 330, 460, 78, ["정보는 한 곳에 한 번만", "점수·강사는 B6-1에서 각각 별도 표 (ERD)"], 19, show=["split"])
    f.write()


def split_mobile():
    states = ["one", "split", "keys"]
    f = Fig("split-story-mobile.svg", 360, 688, states, "한 장의 표를 나누고 키로 잇기",
            "학생·수업·강사를 한 장에 적으면 같은 값이 반복된다. 학생, 수업, 수강 기록 표로 나누면 정보는 한 번만 적고(교육용 단순화), "
            "수강 기록의 student_id와 course_id(FK)가 각 표의 id(PK)를 가리켜 연결한다.")
    sheet = [[r[0], r[2], r[3]] for r in SHEET]
    marks = {(0, 0), (1, 0), (0, 1), (2, 1), (0, 2), (2, 2)}
    tabs = ["split", "keys"]
    f.text(20, 28, "한 장에 모두 적은 표", 18, cls="muted", bold=True, show=["one"])
    table(f, 20, 40, [("학생", 72), ("수업", 156), ("강사", 92)], sheet, 18, 46, show=["one"], marks=marks)
    chip(f, 20, 244, 320, 40, ["점선 칸 = 같은 값의 반복"], 18, show=["one"])
    chip(f, 20, 292, 320, 40, ["박서준이 바뀌면 → 2곳을 고쳐야"], 18, show=["one"])
    f.text(20, 28, "학생 student", 18, cls="muted", bold=True, show=tabs)
    table(f, 20, 38, [("id", 78), ("이름", 96), ("학교", 96)], [["1", "김민준", "한빛중"], ["2", "이서연", "한빛중"]],
          18, 44, show=tabs, pk=[0])
    f.text(20, 206, "수업 course", 18, cls="muted", bold=True, show=tabs)
    table(f, 20, 216, [("id", 78), ("수업", 150), ("강사", 92)], [["1", "중등 수학 기초", "박서준"], ["2", "중등 영어 독해", "김하늘"]],
          18, 44, show=tabs, pk=[0])
    f.text(20, 384, "수강 기록", 18, cls="muted", bold=True, show=tabs)
    table(f, 20, 394, [("student_id", 164), ("course_id", 156)],
          [["1", "1"], ["1", "2"], ["2", "1"]], 18, 44, show=tabs, fk=[0, 1])
    chip(f, 20, 584, 320, 46, ["단순화 · 점수·강사는 B6-1에서 별도 표"], 17, show=["split"])
    # keys: FK 칸 → PK 행 (V03과 같은 내용을 슬라이드 색으로)
    keys = ["keys"]
    f.rect(23, 85, 72, 38, "mark", rx=6, show=keys)
    f.rect(23, 263, 72, 38, "mark", rx=6, show=keys)
    f.rect(23, 441, 158, 38, "mark", rx=6, show=keys)
    f.rect(187, 441, 150, 38, "mark", rx=6, show=keys)
    pointer(f, [(20, 460), (9, 460), (9, 104), (20, 104)], keys)
    pointer(f, [(340, 460), (351, 460), (351, 282), (340, 282)], keys)
    num_circle(f, 162, 460, "1", 18, show=keys)
    num_circle(f, 318, 460, "2", 18, show=keys)
    chip(f, 20, 584, 320, 40, ["PK = 행마다 다른 고유 번호 (id)"], 17, show=keys)
    chip(f, 20, 632, 320, 40, ["FK = 다른 표의 PK를 가리키는 번호"], 17, show=keys)
    f.write()


def icon(f, cx, cy, ok):
    """✓ / ✕ 를 글꼴이 아닌 도형으로 그린다. 옆에 항상 글자 설명을 둔다."""
    mark = (f'<path d="M{cx - 7:g} {cy:g} L{cx - 2:g} {cy + 6:g} L{cx + 7:g} {cy - 6:g}" fill="none"' if ok
            else f'<path d="M{cx - 6:g} {cy - 6:g} L{cx + 6:g} {cy + 6:g} M{cx + 6:g} {cy - 6:g} L{cx - 6:g} {cy + 6:g}"')
    f.add(f'<g><circle cx="{cx:g}" cy="{cy:g}" r="13" class="{P}-num"/>{mark} stroke="{TOKENS["bg"]}" stroke-width="3"/></g>')


# ---------- 3. INNER JOIN vs LEFT JOIN ----------

def join_compare():
    f = Fig("join-compare-desktop.svg", 1200, 480, ["compare"], "INNER JOIN 과 LEFT JOIN 의 차이",
            "student 13~15번을 enrollment와 연결하면, 수강 기록이 없는 15번 문태양은 INNER JOIN 결과에서 사라지고 "
            "LEFT JOIN 결과에는 수업 칸이 NULL인 채로 남는다. 전체 학생으로는 INNER 26행, LEFT 27행이다.")
    chip(f, 20, 8, 560, 46, ["연결 기준 ON · student.id = enrollment.student_id"], 20, cls="tag")
    chip(f, 960, 8, 220, 46, ["B6-1 실제 결과"], 20, cls="real")
    f.rect(20, 72, 320, 330, "box", rx=14)
    f.text(36, 108, "왼쪽 표 student 13~15번", 21, bold=True)
    table(f, 36, 128, [("id", 54), ("이름", 96), ("수강", 138)],
          [["13", "배현우", "1건"], ["14", "홍지민", "1건"], ["15", "문태양", "0건"]], 20, 52, marks={(2, 2)})
    f.rect(370, 72, 400, 330, "box", rx=14)
    num_circle(f, 398, 101, "1", 20)
    f.text(420, 108, "INNER JOIN → 2행", 21, bold=True)
    table(f, 386, 128, [("이름", 104), ("수업", 264)], [["배현우", "파이썬 코딩 입문"], ["홍지민", "고등 수학 심화"]], 20, 52)
    f.text(396, 314, "문태양", 20, cls="muted")
    f.add(f'<path d="M392 307 L466 307" class="{P}-strike"/>')
    icon(f, 404, 356, False)
    f.text(426, 363, "짝이 없어 결과에서 사라짐", 20, bold=True)
    f.rect(800, 72, 380, 330, "box", rx=14)
    num_circle(f, 828, 101, "2", 20)
    f.text(850, 108, "LEFT JOIN → 3행", 21, bold=True)
    table(f, 816, 128, [("이름", 104), ("수업", 244)],
          [["배현우", "파이썬 코딩 입문"], ["홍지민", "고등 수학 심화"], ["문태양", "NULL"]], 20, 52, marks={(2, 1)})
    icon(f, 830, 366, True)
    f.text(852, 373, "왼쪽 표의 행은 모두 남는다", 20, bold=True)
    f.text(20, 446, "학생 15명 전체로 연결하면  INNER JOIN 26행 · LEFT JOIN 27행  (수강 0건인 문태양 1행 차이)", 20, cls="muted")
    f.write()


def join_compare_mobile():
    f = Fig("join-compare-mobile.svg", 360, 1034, ["compare"], "INNER JOIN 과 LEFT JOIN 의 차이", (
        "student 13~15번을 enrollment와 연결하면, 수강 기록이 없는 15번 문태양은 INNER JOIN 결과에서 사라지고 "
        "LEFT JOIN 결과에는 수업 칸이 NULL인 채로 남는다. 전체 학생으로는 INNER 26행, LEFT 27행이다."))
    chip(f, 16, 8, 328, 64, ["연결 기준 ON", "student.id = enrollment.student_id"], 18)
    chip(f, 16, 82, 180, 38, ["B6-1 실제 결과"], 17, cls="real")
    f.text(16, 150, "왼쪽 표 student 13~15번", 18, bold=True)
    table(f, 16, 162, [("id", 56), ("이름", 96), ("수강", 100)],
          [["13", "배현우", "1건"], ["14", "홍지민", "1건"], ["15", "문태양", "0건"]], 18, 44, marks={(2, 2)})
    for top, n, title, rows, ok, note in (
            (354, "1", "INNER JOIN → 2행", [["배현우", "파이썬 코딩 입문"], ["홍지민", "고등 수학 심화"]], False, "짝이 없어 결과에서 사라짐"),
            (662, "2", "LEFT JOIN → 3행", [["배현우", "파이썬 코딩 입문"], ["홍지민", "고등 수학 심화"], ["문태양", "NULL"]], True, "왼쪽 표의 행은 모두 남는다")):
        h = 300 if ok else 292
        f.rect(16, top, 328, h, "box", rx=14)
        num_circle(f, 42, top + 28, n, 18)
        f.text(62, top + 35, title, 19, bold=True)
        table(f, 28, top + 52, [("이름", 90), ("수업", 214)], rows, 18, 44, marks={(2, 1)} if ok else ())
        y = top + 52 + 44 * (len(rows) + 1)
        if not ok:
            f.text(36, y + 32, "문태양", 18, cls="muted")
            f.add(f'<path d="M32 {y + 26:g} L98 {y + 26:g}" class="{P}-strike"/>')
            y += 44
        icon(f, 44, y + 28, ok)
        f.text(66, y + 34, note, 18, bold=True)
    f.text(16, 994, "학생 15명 전체로 연결하면", 18, cls="muted")
    f.text(16, 1020, "INNER 26행 · LEFT 27행 (문태양 1행 차이)", 18, cls="muted")
    f.write()


# ---------- 4. 주제가 달라도 같은 구조 ----------

EXAMPLES = [  # (제목 1줄, 제목 2줄, 부모 표들, 자식 표, 실제 사례 여부, 아래 설명)
    ("실제 사례", "B6-1 공부방", ["학생", "수업"], "수강", True, ("다대다(N:M) → 연결 표", "N:M → 연결 표")),
    ("예시", "블로그", ["회원"], "게시글", False, ("일대다(1:N) → 바로 연결", "1:N → 바로 연결")),
]


def mini_erd(f, x, y, w, ex, desktop):
    t1, t2, parents, child, real, caption = ex
    if desktop:
        h, pw, ph, py, cy, size = 280, 110, 52, y + 76, y + 190, 21
        f.rect(x, y, w, h, "box", rx=14)
        chip(f, x + 14, y + 14, w - 28, 40, [f"{t1} · {t2}"], 19, cls="real" if real else "tag")
        f.text(x + w / 2, y + 268, caption[0], 19, cls="muted", anchor="middle", bold=True)
        pad = 40
    else:
        h, pw, ph, py, cy, size = 262, 64, 44, y + 76, y + 184, 18
        f.rect(x, y, w, h, "box", rx=12)
        chip(f, x + 8, y + 8, w - 16, 54, [t1, t2], 16, cls="real" if real else "tag")
        f.text(x + w / 2, y + 250, caption[1], 16, cls="muted", anchor="middle", bold=True)
        pad = 12
    xs = [x + pad, x + w - pad - pw] if len(parents) == 2 else [x + (w - pw) / 2]
    cw = (w - 2 * pad - 20) if len(parents) == 2 else pw
    for i, (px, name) in enumerate(zip(xs, parents)):
        f.rect(px, py, pw, ph, "box", rx=10)
        f.text(px + pw / 2, py + ph / 2 + size * 0.36, name, size, anchor="middle", bold=True)
        mid = px + pw / 2
        relation(f, [(mid, py + ph), (mid, cy)], size - 1, (1, 1) if i == 0 and len(parents) == 2 else (-1, -1))  # 1·N 글자는 바깥쪽
    f.rect(x + (w - cw) / 2, cy, cw, ph, "box", rx=10)
    f.text(x + w / 2, cy + ph / 2 + size * 0.36, child, size, anchor="middle", bold=True)


def same_structure():
    f = Fig("same-structure-desktop.svg", 1200, 300, ["all"], "주제가 달라도 같은 구조",
            "B6-1 공부방은 학생과 수업의 다대다 관계를 연결 표 수강으로 풀었다. 블로그 예시처럼 일대다 관계는 연결 표 없이 "
            "회원과 게시글을 바로 잇는다. 공통점은 표로 나누고 선으로 잇는 것이며, 연결 표는 다대다일 때만 쓴다.")
    mini_erd(f, 10, 10, 380, EXAMPLES[0], True)
    mini_erd(f, 410, 10, 380, EXAMPLES[1], True)
    f.rect(810, 10, 380, 280, "box", rx=14)
    f.text(836, 62, "공통점", 21, cls="acc", bold=True)
    f.text(836, 100, "표로 나누고", 25, bold=True)
    f.text(836, 136, "선으로 잇는다", 25, bold=True)
    f.add(f'<path d="M836 172 L1164 172" class="{P}-rel"/>')
    f.text(836, 214, "연결 표는", 22)
    f.text(836, 250, "다대다(N:M)일 때만 쓴다", 22, bold=True)
    f.write()
    m = Fig("same-structure-mobile.svg", 360, 392, ["all"], "주제가 달라도 같은 구조", f.label)
    mini_erd(m, 10, 8, 166, EXAMPLES[0], False)
    mini_erd(m, 184, 8, 166, EXAMPLES[1], False)
    chip(m, 10, 282, 340, 100, ["공통점: 표로 나누고 선으로 잇는다", "연결 표는 N:M일 때만 쓴다"], 17)
    m.write()


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    erd_desktop()
    erd_mobile()
    split_desktop()
    split_mobile()
    join_compare()
    join_compare_mobile()
    same_structure()
    print("wrote", sorted(n for n in os.listdir(OUT) if n.endswith(".svg")))
