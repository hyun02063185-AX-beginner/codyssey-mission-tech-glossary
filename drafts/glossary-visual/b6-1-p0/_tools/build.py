"""용어사전 시각 설명 P0(B6-1) SVG 생성기.

그림 3종을 PC(desktop, 폭 520)와 모바일(mobile, 폭 320)용으로 만든다. 결과는 ../assets/ 에 쓴다.
  erd-basics          ERD 읽기: 상자 · 선 · 선 끝 기호(최소·최대)              → erd
  pk-fk-relationship  PK가 행을 구별하고 FK 값이 그 PK를 가리키는 관계        → foreign-key, primary-key
  join-inner-left     같은 데이터에서 INNER JOIN과 LEFT JOIN의 결과 비교      → join, inner-join, left-join

desktop은 현재 용어 상세 렌더러(.rich-svg svg {width:520px})에 1:1로 맞춘다.
mobile은 360·390px 화면에서 가로 스크롤 없이 읽히도록 다시 배치한 변형이며, 쓰려면 렌더러 지원이 필요하다.

색: 구조(면·글자·선)는 사이트 테마 토큰(--surface-*, --text-*, --border-*)을 쓰고 토큰이 없으면 Forest 값으로 보인다.
PK·FK·빠짐·남음 같은 의미 색은 B6-1 학습가이드(V02·V03·V06)의 밝은 팔레트를 그대로 쓴다.
의미는 색 + 글자 이름표(PK·FK·✕·✓) + 선 모양(점선)으로 함께 표시한다.

데이터: student·enrollment 값은 Codyssey_B6-1(커밋 8b99440)의 sql/01_schema.sql·02_sample_data.sql을
SQLite로 실행해 확인한 값이다. 거부되는 행(student_id 99)만 교육용 예시이며 그림에 그렇게 적는다.
실행: python -I build.py
"""
import os
from html import escape

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets")
P = "gvb6"  # 인라인 시 페이지 CSS와 겹치지 않도록 클래스·id에 붙이는 접두사

FONT = "var(--font-body,'Pretendard VF','Pretendard Variable','Apple SD Gothic Neo','Malgun Gothic','Noto Sans CJK KR',system-ui,sans-serif)"
MONO = "var(--font-mono,ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',monospace)"
PK_C, FK_C, BAD_C, OK_C = "#173e35", "#8a4b00", "#9b2c22", "#1a6b43"  # OK_C만 가이드 #1f7a4d보다 약간 어둡게(Paper 대비 여유)

STYLE = f"""<style>
.{P}{{font-family:{FONT}}}
.{P} .bg{{fill:var(--surface-raised,#fff)}}
.{P} .t{{fill:var(--text-primary,#18241f)}}
.{P} .s{{fill:var(--text-secondary,#52645a)}}
.{P} .b{{font-weight:700}}
.{P} .m{{font-family:{MONO}}}
.{P} .box{{fill:var(--surface-raised,#fff);stroke:var(--border-strong,#b5c7bd);stroke-width:1.5}}
.{P} .head{{fill:var(--surface-soft,#eef5ef)}}
.{P} .note{{fill:var(--surface-soft,#eef5ef);stroke:var(--border-default,#d5ddd7);stroke-width:1}}
.{P} .rule{{stroke:var(--border-default,#d5ddd7);stroke-width:1}}
.{P} .ln{{fill:none;stroke:var(--text-primary,#18241f);stroke-width:1.6}}
.{P} .ref{{fill:none;stroke:{FK_C};stroke-width:1.8;stroke-dasharray:6 4}}
.{P} .refbad{{fill:none;stroke:{BAD_C};stroke-width:1.8;stroke-dasharray:3 4}}
.{P} .hit{{fill:none;stroke:{FK_C};stroke-width:2.2}}
.{P} .gone{{fill:none;stroke:{BAD_C};stroke-width:2;stroke-dasharray:5 4}}
.{P} .kept{{fill:none;stroke:{OK_C};stroke-width:2.2;stroke-dasharray:5 4}}
.{P} .pk{{fill:{PK_C}}} .{P} .fk{{fill:{FK_C}}} .{P} .on{{fill:#fff}}
.{P} .bad{{fill:{BAD_C}}} .{P} .ok{{fill:{OK_C}}} .{P} .fkt{{fill:{FK_C}}}
</style>"""


def esc(text):
    return escape(str(text), quote=False)


class Svg:
    def __init__(self, name, w, h, title, desc):
        self.name, self.w, self.h, self.title, self.desc = name, w, h, title, desc
        self.parts = []

    def add(self, s):
        self.parts.append(s)

    def text(self, x, y, s, size=14, cls="t", anchor="start", extra=""):
        a = f' text-anchor="{anchor}"' if anchor != "start" else ""
        self.add(f'<text x="{x}" y="{y}" font-size="{size}" class="{cls}"{a}{extra}>{esc(s)}</text>')

    def lines(self, x, y, rows, size=14, cls="t", gap=None):
        """rows: 문자열 목록. 한 줄씩 아래로 쓴다. 다음 y를 돌려준다."""
        gap = gap or round(size * 1.5)
        for row in rows:
            self.text(x, y, row, size, cls)
            y += gap
        return y

    def rect(self, x, y, w, h, cls, rx=8):
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{cls}"/>')

    def badge(self, x, y, label, kind):
        """y는 글자 기준선. PK·FK 이름표(흰 글자, 색 배경)."""
        self.add(f'<rect x="{x}" y="{y - 13}" width="26" height="18" rx="5" class="{kind}"/>')
        self.text(x + 13, y + 1, label, 12, "on b", "middle")

    def path(self, d, cls, marker=None):
        # 인라인 SVG의 id는 문서 전체에서 공유되므로 그림·변형마다 다른 id를 쓴다
        m = f' marker-end="url(#{P}-{self.name}-{marker})"' if marker else ""
        self.add(f'<path d="{d}" class="{cls}"{m}/>')

    def svg(self):
        sid = f"{P}-{self.name}"
        defs = (f'<defs><marker id="{sid}-arr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" '
                f'markerUnits="userSpaceOnUse"><path d="M0 0L10 5L0 10Z" fill="{FK_C}"/></marker></defs>')
        return (f'<svg xmlns="http://www.w3.org/2000/svg" class="{P}" viewBox="0 0 {self.w} {self.h}" '
                f'width="{self.w}" height="{self.h}" role="img" aria-labelledby="{sid}-title {sid}-desc">\n'
                f'<title id="{sid}-title">{esc(self.title)}</title>\n<desc id="{sid}-desc">{esc(self.desc)}</desc>\n'
                f'{STYLE}\n{defs}\n<rect class="bg" width="{self.w}" height="{self.h}"/>\n'
                + "\n".join(self.parts) + "\n</svg>\n")


def table(g, x, y, cols, header, rows, row_h=28, head_h=30, size=14, marks=None, badge_below=False):
    """cols: 열 너비 목록. header: [(이름, 'PK'|'FK'|None)]. rows: 칸 문자열 목록의 목록.
    marks: {(행, 열): 'hit'|'gone'|'kept'} 칸 테두리 강조. badge_below: 좁은 열에서 이름표를 열 이름 아래 줄에 둔다.
    각 칸의 좌표를 돌려준다."""
    marks = marks or {}
    if badge_below:
        head_h = 52
    w = sum(cols)
    h = head_h + row_h * len(rows)
    g.rect(x, y, w, h, "box")
    g.add(f'<rect x="{x + .75}" y="{y + .75}" width="{w - 1.5}" height="{head_h - .75}" rx="7" class="head"/>')
    g.add(f'<line x1="{x}" y1="{y + head_h}" x2="{x + w}" y2="{y + head_h}" class="rule"/>')
    cells = {}
    cx = x
    for c, (name, key) in enumerate(header):
        name_y = y + 21 if badge_below else y + head_h - 10
        g.text(cx + 10, name_y, name, size, "t b m" if name.isascii() else "t b")
        if key and badge_below:
            g.badge(cx + 10, y + head_h - 9, key, key.lower())
        elif key:
            g.badge(cx + 10 + text_w(name, size, mono=name.isascii()) + 6, y + head_h - 10, key, key.lower())
        cx += cols[c]
    for r, row in enumerate(rows):
        ry = y + head_h + r * row_h
        if r:
            g.add(f'<line x1="{x}" y1="{ry}" x2="{x + w}" y2="{ry}" class="rule"/>')
        cx = x
        for c, val in enumerate(row):
            cells[(r, c)] = (cx, ry, cols[c], row_h)
            mark = marks.get((r, c))
            if mark:
                g.add(f'<rect x="{cx + 3}" y="{ry + 3}" width="{cols[c] - 6}" height="{row_h - 6}" rx="5" class="{mark}"/>')
            # NULL은 오류가 아니라 '값 없음'이므로 빨강을 쓰지 않고 굵게만 표시한다
            cls = "t b m" if val == "NULL" else ("t m" if str(val).isascii() else "t")
            g.text(cx + 10, ry + row_h - 9, val, size, cls)
            cx += cols[c]
    return cells, (x, y, w, h)


def text_w(s, size, mono=False):
    """대략적인 글자 폭. 이름표 배치에만 쓰고, 넘침은 렌더링 QA로 확인한다."""
    total = 0.0
    for ch in s:
        if ord(ch) > 0x2E80:
            total += size * 0.96
        elif mono:
            total += size * 0.6
        else:
            total += size * 0.56
    return round(total)


# ---------------------------------------------------------------- ERD

ERD_TITLE = "ERD 읽기: 상자, 선, 선 끝 기호"
ERD_DESC = ("B6-1 공부방 데이터베이스의 표 3개를 ERD로 그린 그림이다. 상자는 표(엔터티)이고 안에 대표 열을 적었다. "
            "student의 id, enrollment의 id, course의 id가 PK이고 enrollment의 student_id와 course_id가 FK다. "
            "선은 표 사이의 관계다. student와 enrollment를 잇는 선은 student 쪽 끝이 막대 두 개, enrollment 쪽 끝이 동그라미와 세 갈래다. "
            "course와 enrollment를 잇는 선도 같은 모양이다. 선 끝 기호는 안쪽이 최대, 바깥쪽이 최소 개수다. "
            "막대 두 개는 최소 1·최대 1, 즉 반드시 하나다. 동그라미와 세 갈래는 최소 0·최대 여럿이다. "
            "읽을 때는 한쪽 표에서 출발해 반대쪽 끝의 기호를 읽는다. 학생 1명은 수강 기록을 0건 이상 가지고, "
            "수강 기록 1건은 학생 정확히 1명에 속한다. B6-1의 문태양 학생은 수강 기록이 0건인데, 동그라미(최소 0)가 이를 허용한다. "
            "선은 관계를 나타낼 뿐 실행 순서나 데이터 흐름이 아니다.")


def entity(g, x, y, w, name, fields, size=14):
    """fields: [(열 이름, 'PK'|'FK'|None)]. 상자 좌표를 돌려준다."""
    head_h, row_h = 30, 26
    h = head_h + row_h * len(fields) + 6
    g.rect(x, y, w, h, "box")
    g.add(f'<rect x="{x + .75}" y="{y + .75}" width="{w - 1.5}" height="{head_h - .75}" rx="7" class="head"/>')
    g.add(f'<line x1="{x}" y1="{y + head_h}" x2="{x + w}" y2="{y + head_h}" class="rule"/>')
    g.text(x + 10, y + 21, name, 15, "t b m")
    for i, (field, key) in enumerate(fields):
        by = y + head_h + row_h * i + 19
        g.text(x + 10, by, field, size, "t m")
        if key:
            g.badge(x + w - 36, by, key, key.lower())
    return x, y, w, h


def one_end(g, x, y, d):
    """막대 두 개(최소 1·최대 1). (x,y)는 상자 가장자리, d는 선이 뻗는 방향 단위벡터."""
    dx, dy = d
    for k in (8, 14):
        px, py = x + dx * k, y + dy * k
        g.add(f'<line x1="{px - dy * 7}" y1="{py - dx * 7}" x2="{px + dy * 7}" y2="{py + dx * 7}" class="ln"/>')


def many_end(g, x, y, d):
    """동그라미 + 세 갈래(최소 0·최대 여럿). 세 갈래가 상자에 닿고 동그라미가 바깥쪽이다."""
    dx, dy = d
    fx, fy = x + dx * 14, y + dy * 14
    for off in (-8, 0, 8):
        g.add(f'<line x1="{fx}" y1="{fy}" x2="{x - dy * off}" y2="{y + dx * off}" class="ln"/>')
    cx, cy = x + dx * 21, y + dy * 21
    g.add(f'<circle cx="{cx}" cy="{cy}" r="5" class="ln" style="fill:var(--surface-raised,#fff)"/>')


def legend_symbols(g, x, y, w, size=14, narrow=False):
    """선 끝 기호 설명 상자. 다음 y를 돌려준다."""
    h = 150 if narrow else 118
    g.rect(x, y, w, h, "note")
    g.text(x + 12, y + 24, "선 끝 기호: 안쪽 = 최대, 바깥쪽 = 최소", size, "t b")
    sy = y + 52
    g.add(f'<line x1="{x + 14}" y1="{sy}" x2="{x + 58}" y2="{sy}" class="ln"/>')
    one_end(g, x + 58, sy, (-1, 0))
    if narrow:
        g.lines(x + 70, sy + 5, ["막대 두 개: 최소 1 · 최대 1", "→ 반드시 하나"], size - 1, "t", 20)
        sy2 = sy + 52
    else:
        g.text(x + 70, sy + 5, "막대 두 개: 최소 1 · 최대 1 → 반드시 하나", size - 1)
        sy2 = sy + 34
    g.add(f'<line x1="{x + 14}" y1="{sy2}" x2="{x + 58}" y2="{sy2}" class="ln"/>')
    many_end(g, x + 58, sy2, (-1, 0))
    if narrow:
        g.lines(x + 70, sy2 + 5, ["동그라미 + 세 갈래: 최소 0 · 최대", "여럿 → 없어도 되고, 여럿도 된다"], size - 1, "t", 20)
    else:
        g.text(x + 70, sy2 + 5, "동그라미 + 세 갈래: 최소 0 · 최대 여럿", size - 1)
        g.text(x + 70, sy2 + 25, "→ 없어도 되고, 여럿도 된다", size - 1)
    return y + h


ERD_READ = [
    ("①", "학생 1명은 수강 기록을 0건 이상 가진다", "enrollment 쪽 끝: 동그라미 + 세 갈래"),
    ("②", "수강 기록 1건은 학생 정확히 1명에 속한다", "student 쪽 끝: 막대 두 개"),
    ("③", "B6-1 문태양 학생은 수강 0건", "동그라미(최소 0)가 허용하는 경우"),
]

STUDENT_F = [("id", "PK"), ("name", None)]
ENROLL_F = [("id", "PK"), ("student_id", "FK"), ("course_id", "FK")]
COURSE_F = [("id", "PK"), ("course_name", None)]


def erd_desktop():
    g = Svg("erd-d", 520, 486, ERD_TITLE, ERD_DESC)
    g.text(16, 30, ERD_TITLE, 18, "t b")
    g.text(16, 52, "B6-1 공부방 DB의 표 6개 중 3개 · 열 일부만 표시", 13, "s")
    sx, sy, sw, sh = entity(g, 12, 84, 112, "student", STUDENT_F)
    ex, ey, ew, eh = entity(g, 194, 72, 136, "enrollment", ENROLL_F)
    cx, cy, cw, ch = entity(g, 396, 84, 112, "course", COURSE_F)
    ly = ey + eh / 2
    # student ─ enrollment
    g.add(f'<line x1="{sx + sw}" y1="{ly}" x2="{ex}" y2="{ly}" class="ln"/>')
    one_end(g, sx + sw, ly, (1, 0))
    many_end(g, ex, ly, (-1, 0))
    g.text(sx + sw + 8, ly - 14, "1", 13, "s b")
    g.text(ex - 14, ly - 14, "N", 13, "s b")
    # course ─ enrollment
    g.add(f'<line x1="{cx}" y1="{ly}" x2="{ex + ew}" y2="{ly}" class="ln"/>')
    one_end(g, cx, ly, (-1, 0))
    many_end(g, ex + ew, ly, (1, 0))
    g.text(cx - 14, ly - 14, "1", 13, "s b")
    g.text(ex + ew + 6, ly - 14, "N", 13, "s b")
    # 이름표
    g.text(12, 200, "상자 = 표(엔터티) · 안쪽 = 대표 열", 13, "s")
    g.text(12, 220, "선 = 표 사이의 관계 (실행 순서나 데이터 흐름이 아님)", 13, "s")
    y = legend_symbols(g, 12, 236, 496)
    y += 26
    g.text(12, y, "읽는 법: 한쪽 표에서 출발해 반대쪽 끝의 기호를 읽는다", 15, "t b")
    for num, main, sub in ERD_READ:
        y += 32
        g.text(14, y, num, 15, "fkt b")
        g.text(36, y, main, 14, "t")
        g.text(36, y + 18, sub, 13, "s")
        y += 12
    g.h = y + 24
    return g


def erd_mobile():
    g = Svg("erd-m", 320, 900, ERD_TITLE, ERD_DESC)
    g.text(12, 28, ERD_TITLE, 17, "t b")
    g.lines(12, 50, ["B6-1 공부방 DB의 표 6개 중 3개", "열 일부만 표시"], 13, "s", 18)
    bw = 168
    bx = (320 - bw) // 2
    sx, sy, sw, sh = entity(g, bx, 92, bw, "student", STUDENT_F)
    ex, ey, ew, eh = entity(g, bx, sy + sh + 70, bw, "enrollment", ENROLL_F)
    cx, cy, cw, ch = entity(g, bx, ey + eh + 70, bw, "course", COURSE_F)
    mx = bx + bw / 2
    g.add(f'<line x1="{mx}" y1="{sy + sh}" x2="{mx}" y2="{ey}" class="ln"/>')
    one_end(g, mx, sy + sh, (0, 1))
    many_end(g, mx, ey, (0, -1))
    g.text(mx + 14, sy + sh + 18, "1", 13, "s b")
    g.text(mx + 14, ey - 8, "N", 13, "s b")
    g.add(f'<line x1="{mx}" y1="{cy}" x2="{mx}" y2="{ey + eh}" class="ln"/>')
    one_end(g, mx, cy, (0, -1))
    many_end(g, mx, ey + eh, (0, 1))
    g.text(mx + 14, cy - 8, "1", 13, "s b")
    g.text(mx + 14, ey + eh + 18, "N", 13, "s b")
    y = cy + ch + 30
    y = g.lines(12, y, ["상자 = 표(엔터티) · 안쪽 = 대표 열", "선 = 표 사이의 관계", "(실행 순서나 데이터 흐름이 아님)"], 13, "s", 19)
    y = legend_symbols(g, 8, y + 2, 304, 14, narrow=True)
    y += 28
    y = g.lines(12, y, ["읽는 법: 한쪽 표에서 출발해", "반대쪽 끝의 기호를 읽는다"], 15, "t b", 21)
    wrap = {
        "①": (["학생 1명은 수강 기록을", "0건 이상 가진다"], ["enrollment 쪽 끝:", "동그라미 + 세 갈래"]),
        "②": (["수강 기록 1건은 학생", "정확히 1명에 속한다"], ["student 쪽 끝: 막대 두 개"]),
        "③": (["B6-1 문태양 학생은 수강 0건"], ["동그라미(최소 0)가 허용하는 경우"]),
    }
    for num, _, _ in ERD_READ:
        main, sub = wrap[num]
        y += 10
        g.text(12, y, num, 15, "fkt b")
        y = g.lines(34, y, main, 14, "t", 20)
        y = g.lines(34, y, sub, 13, "s", 19)
    g.h = y + 14
    return g


# ---------------------------------------------------------------- PK / FK

PKFK_TITLE = "PK와 FK: 값으로 정확히 가리키기"
PKFK_DESC = ("B6-1 사례 데이터 일부로 그린 그림이다. 왼쪽은 자식 표 enrollment(수강), 오른쪽은 부모 표 student(학생)다. "
             "student의 id 열이 PK(기본 키)로, 값 1은 김민준, 2는 이서연을 하나로 구별한다. "
             "enrollment의 student_id 열이 FK(외래 키)다. enrollment 1번과 2번 행의 student_id는 1이라 김민준 행을 가리키고, "
             "3번 행의 student_id는 2라 이서연 행을 가리킨다. 점선 화살표는 FK 값이 PK 값을 가리키는 관계이며 실행 순서가 아니다. "
             "김민준 한 명을 수강 기록 두 행이 가리키므로 1:N 관계다. "
             "아래에는 교육용 예시로 student_id가 99인 새 행을 넣으려는 경우를 그렸다. student 표에 99번이 없으므로 FK 제약이 입력을 거부한다. "
             "FK는 값을 복사해 오는 기능이 아니라 다른 표의 행을 가리키는 열이다. FK는 보통 PK를, 경우에 따라 UNIQUE 키를 가리킨다.")

ENR_ROWS = [["1", "1"], ["2", "1"], ["3", "2"]]
STU_ROWS = [["1", "김민준"], ["2", "이서연"]]


def pkfk_body(g, ex, sx, top, ecols, scols, size, badge_below=False):
    """두 표와 가리키는 점선. 각 표 아래 y를 돌려준다."""
    g.text(ex, top, "enrollment (자식 표)", size, "t b")
    g.text(sx, top, "student (부모 표)", size, "t b")
    e_cells, (_, ety, ew, eh) = table(g, ex, top + 10, ecols, [("id", "PK"), ("student_id", "FK")], ENR_ROWS,
                                      size=size, marks={(0, 1): "hit", (1, 1): "hit", (2, 1): "hit"}, badge_below=badge_below)
    s_cells, (_, sty, sw, sh) = table(g, sx, top + 10, scols, [("id", "PK"), ("name", None)], STU_ROWS,
                                      size=size, marks={(0, 0): "hit", (1, 0): "hit"}, badge_below=badge_below)
    # FK 칸 오른쪽 → PK 칸 왼쪽
    for r, target in ((0, 0), (1, 0), (2, 1)):
        fx, fy, fw, fh = e_cells[(r, 1)]
        px, py, pw, ph = s_cells[(target, 0)]
        x1, y1, x2, y2 = fx + fw, fy + fh / 2, px - 2, py + ph / 2 + (r - 0.5) * 5 * (target == 0)
        mid = (x1 + x2) / 2
        g.path(f"M{x1} {y1} C{mid} {y1} {mid} {y2} {x2} {y2}", "ref", "arr")
    return e_cells, s_cells, ety + eh, sty + sh


def pkfk_reject(g, ex, y, ecols, sx_edge, size, label_lines):
    """교육용 예시: 없는 student_id 99. 거부되는 행을 점선 빨강 테두리로 그린다. 다음 y를 돌려준다."""
    w = sum(ecols)
    g.rect(ex, y, w, 28, "gone", 6)
    g.text(ex + 10, y + 19, "4", size, "t m")
    g.text(ex + ecols[0] + 10, y + 19, "99", size, "bad b m")
    x1, y1 = ex + w, y + 14
    g.path(f"M{x1} {y1} L{sx_edge - 26} {y1}", "refbad")
    g.text(sx_edge - 14, y1 + 6, "✕", 18, "bad b", "middle")
    ty = y + 50
    for i, row in enumerate(label_lines):
        g.text(ex, ty + i * 20, row, size - 1, "bad b" if i == 0 else "t")
    return ty + 20 * (len(label_lines) - 1)


PK_NOTES = [
    ("PK", "기본 키: 표 안에서 행 하나를 구별하는 값", "같은 값이 두 번 나올 수 없고, 비워 둘 수 없다"),
    ("FK", "외래 키: 다른 표의 키 값을 담아 그 행을 가리키는 열", "값을 복사해 오는 기능이 아니다 · 보통 PK, 경우에 따라 UNIQUE 키를 가리킨다"),
]


def pkfk_desktop():
    g = Svg("pkfk-d", 520, 520, PKFK_TITLE, PKFK_DESC)
    g.text(16, 30, PKFK_TITLE, 18, "t b")
    g.text(16, 52, "B6-1 사례 데이터 일부 · enrollment의 course_id 등 열 생략", 13, "s")
    ecols, scols = [56, 140], [56, 104]
    ex, sx = 12, 348
    e_cells, s_cells, ebot, sbot = pkfk_body(g, ex, sx, 90, ecols, scols, 14)
    g.lines(sx, sbot + 22, ["김민준(1)을 두 행이", "가리킴 → 1:N"], 13, "s", 18)
    g.text(212, 72, "점선 화살표 = 가리킴 (실행 순서 아님)", 13, "fkt b")
    y = pkfk_reject(g, ex, ebot + 26, ecols, sx, 14,
                    ["교육용 예시: student_id 99인 행을 새로 넣으면?", "student에 99번이 없으므로 FK 제약이 입력을 거부한다"])
    y += 26
    for key, main, sub in PK_NOTES:
        g.badge(14, y + 15, key, key.lower())
        g.text(50, y + 15, main, 14, "t b")
        g.text(50, y + 35, sub, 13, "s")
        y += 50
    g.h = y + 10
    return g


def pkfk_mobile():
    g = Svg("pkfk-m", 320, 640, PKFK_TITLE, PKFK_DESC)
    g.text(10, 28, "PK와 FK:", 17, "t b")
    g.text(10, 50, "값으로 정확히 가리키기", 17, "t b")
    g.lines(10, 72, ["B6-1 사례 데이터 일부", "enrollment의 course_id 등 열 생략"], 13, "s", 18)
    ecols, scols = [40, 104], [40, 76]
    ex, sx = 6, 198
    g.text(10, 124, "점선 화살표 = 가리킴 (실행 순서 아님)", 13, "fkt b")
    e_cells, s_cells, ebot, sbot = pkfk_body(g, ex, sx, 156, ecols, scols, 13, badge_below=True)
    g.lines(sx, sbot + 22, ["김민준(1)을", "두 행이 가리킴", "→ 1:N"], 13, "s", 18)
    y = pkfk_reject(g, ex, ebot + 26, ecols, sx, 13,
                    ["교육용 예시: student_id 99인", "행을 새로 넣으면?", "student에 99번이 없으므로", "FK 제약이 입력을 거부한다"])
    y += 30
    notes = [
        ("PK", ["기본 키: 표 안에서 행 하나를", "구별하는 값"], ["같은 값이 두 번 나올 수 없고,", "비워 둘 수 없다"]),
        ("FK", ["외래 키: 다른 표의 키 값을 담아", "그 행을 가리키는 열"], ["값을 복사해 오는 기능이 아니다", "보통 PK, 경우에 따라 UNIQUE 키를", "가리킨다"]),
    ]
    for key, main, sub in notes:
        g.badge(10, y, key, key.lower())
        y = g.lines(44, y, main, 14, "t b", 20)
        y = g.lines(44, y, sub, 13, "s", 19)
        y += 10
    g.h = y + 4
    return g


# ---------------------------------------------------------------- JOIN

JOIN_TITLE = "INNER JOIN과 LEFT JOIN: 같은 데이터, 다른 결과"
JOIN_DESC = ("B6-1 사례 데이터 중 학생 3명과 그 수강 기록으로 그린 그림이다. 연결 조건은 student.id = enrollment.student_id다. "
             "왼쪽 표 student에는 열 id와 name만 보였고 1 김민준, 2 이서연, 15 문태양이 있다. 오른쪽 표 enrollment에는 id 1부터 4까지 네 행이 있고, "
             "김민준(1)의 수강이 course_id 1과 2, 이서연(2)의 수강이 course_id 1과 3이다. 문태양(15)과 짝이 맞는 행은 없다. "
             "student 표 바깥에 설명용 집계로 짝 수를 적었다. 김민준 2건, 이서연 2건, 문태양 0건이며 이 값은 student 표의 열이 아니다. "
             "INNER JOIN 결과는 4행이다. 김민준 1, 김민준 2, 이서연 1, 이서연 3. 짝이 두 개인 학생은 결과에 두 번 나온다. "
             "문태양은 짝이 없어 결과에서 빠진다. LEFT JOIN 결과는 5행이다. INNER JOIN의 4행에 더해 문태양이 남고, "
             "짝이 없는 오른쪽 열 course_id는 NULL이 된다. 왼쪽 3행이 INNER 4행, LEFT 5행이 되듯 결과 행 수는 원본 행 수와 다를 수 있다. "
             "JOIN은 조회 결과만 만들며 원래 표는 바뀌지 않는다.")

J_STU = [["1", "김민준"], ["2", "이서연"], ["15", "문태양"]]
J_MATCH = ["짝 2건", "짝 2건", "짝 0건"]  # 설명용 집계: student 표의 열이 아니므로 표 바깥에 쓴다
J_ENR = [["1", "1", "1"], ["2", "1", "2"], ["3", "2", "1"], ["4", "2", "3"]]
J_INNER = [["김민준", "1"], ["김민준", "2"], ["이서연", "1"], ["이서연", "3"]]
J_LEFT = J_INNER + [["문태양", "NULL"]]


def join_on(g, x, y, w, size, two_lines=False):
    h = 50 if two_lines else 32
    g.rect(x, y, w, h, "note", 8)
    if two_lines:
        g.text(x + 10, y + 20, "연결 조건 ON", size, "t b")
        g.text(x + 10, y + 40, "student.id = enrollment.student_id", size - 1, "t m")
    else:
        g.text(x + 10, y + 21, "연결 조건 ON", size, "t b")
        g.text(x + 112, y + 21, "student.id = enrollment.student_id", size - 1, "t m")
    return y + h


def join_student(g, x, y, cols, size=14):
    """student 원본 표(id, name)와 표 바깥의 설명용 집계(짝 수). 아래쪽 y를 돌려준다."""
    cells, (_, ty, tw, th) = table(g, x, y, cols, [("id", None), ("name", None)], J_STU, size=size)
    ax = x + tw + 10
    g.text(ax, y + 20, "설명용 집계", 12, "s b")
    for r, label in enumerate(J_MATCH):
        _, ry, _, rh = cells[(r, 0)]
        if r == len(J_MATCH) - 1:
            g.rect(ax - 4, ry + 4, 62, rh - 8, "gone", 5)
            g.text(ax + 2, ry + rh - 9, label, 13, "bad b")
        else:
            g.text(ax + 2, ry + rh - 9, label, 13, "s")
    note_y = ty + th + 20
    g.text(x, note_y, "※ 짝 수는 student 표의 열이 아님", 12, "s")
    return note_y


def join_desktop():
    g = Svg("join-d", 520, 620, JOIN_TITLE, JOIN_DESC)
    g.text(12, 30, JOIN_TITLE, 17, "t b")
    g.text(12, 52, "B6-1 사례 데이터 일부 (학생 15명 중 3명과 그 수강 기록)", 13, "s")
    y = join_on(g, 12, 66, 496, 14)
    ty = y + 28
    g.text(12, ty, "왼쪽 표 student", 14, "t b")
    g.text(256, ty, "오른쪽 표 enrollment", 14, "t b")
    s_bottom = join_student(g, 12, ty + 10, [50, 100])
    e_cells, (_, _, ew, eh) = table(g, 256, ty + 10, [44, 106, 102], [("id", None), ("student_id", None), ("course_id", None)], J_ENR)
    y = max(s_bottom, ty + 10 + eh) + 36
    g.text(12, y, "① INNER JOIN → 4행", 15, "t b")
    g.text(268, y, "② LEFT JOIN → 5행", 15, "t b")
    i_cells, (_, iy, iw, ih) = table(g, 12, y + 10, [124, 116], [("name", None), ("course_id", None)], J_INNER)
    l_cells, (_, ly, lw, lh) = table(g, 268, y + 10, [124, 116], [("name", None), ("course_id", None)], J_LEFT,
                                     marks={(4, 0): "kept", (4, 1): "kept"})
    # 짝이 둘인 학생은 두 행
    for cells, x0 in ((i_cells, 12 + 240), (l_cells, 268 + 240)):
        _, r0y, _, rh = cells[(0, 0)]
        g.path(f"M{x0 + 4} {r0y + 4} h6 v{2 * rh - 8} h-6", "ln")
    # INNER에서 빠진 문태양
    gy = iy + ih + 22
    g.add(f'<line x1="22" y1="{gy - 6}" x2="74" y2="{gy - 6}" class="gone" style="stroke-dasharray:none"/>')
    g.text(22, gy, "문태양", 14, "s")
    g.text(12, gy + 26, "✕ 짝이 없는 행은 빠진다", 14, "bad b")
    g.text(268, ly + lh + 26, "✓ 왼쪽 행은 모두 남고,", 14, "ok b")
    g.text(268, ly + lh + 46, "짝이 없으면 오른쪽 열은 NULL", 14, "ok b")
    y = max(gy + 26, ly + lh + 46) + 26
    g.text(12, y, "괄호 ] = 짝이 2건인 학생은 결과에 2행으로 나온다", 13, "s")
    y += 34
    g.rect(12, y, 496, 62, "note", 8)
    g.text(24, y + 25, "왼쪽 3행 → INNER 4행 · LEFT 5행: 결과 행 수는 원본과 다를 수 있다", 13, "t b")
    g.text(24, y + 47, "JOIN은 조회 결과만 만든다. student·enrollment 표는 그대로다", 13, "t")
    g.h = y + 62 + 14
    return g


def join_mobile():
    g = Svg("join-m", 320, 1200, JOIN_TITLE, JOIN_DESC)
    g.text(10, 28, "INNER JOIN과 LEFT JOIN:", 17, "t b")
    g.text(10, 50, "같은 데이터, 다른 결과", 17, "t b")
    y = g.lines(10, 72, ["B6-1 사례 데이터 일부", "(학생 15명 중 3명과 그 수강 기록)"], 13, "s", 18)
    y = join_on(g, 8, y - 4, 304, 14, two_lines=True)
    y += 28
    g.text(10, y, "왼쪽 표 student", 14, "t b")
    y = join_student(g, 8, y + 10, [52, 140]) + 32
    g.text(10, y, "오른쪽 표 enrollment", 14, "t b")
    e_cells, (_, _, _, eh) = table(g, 8, y + 10, [52, 130, 122], [("id", None), ("student_id", None), ("course_id", None)], J_ENR)
    y += 10 + eh + 36
    g.text(10, y, "① INNER JOIN → 4행", 15, "t b")
    i_cells, (_, iy, _, ih) = table(g, 8, y + 10, [150, 130], [("name", None), ("course_id", None)], J_INNER)
    for cells in (i_cells,):
        _, r0y, _, rh = cells[(0, 0)]
        g.path(f"M{8 + 280 + 4} {r0y + 4} h6 v{2 * rh - 8} h-6", "ln")
    gy = iy + ih + 22
    g.add(f'<line x1="18" y1="{gy - 6}" x2="70" y2="{gy - 6}" class="gone" style="stroke-dasharray:none"/>')
    g.text(18, gy, "문태양", 14, "s")
    g.text(10, gy + 26, "✕ 짝이 없는 행은 빠진다", 14, "bad b")
    y = gy + 26 + 40
    g.text(10, y, "② LEFT JOIN → 5행", 15, "t b")
    l_cells, (_, ly, _, lh) = table(g, 8, y + 10, [150, 130], [("name", None), ("course_id", None)], J_LEFT,
                                    marks={(4, 0): "kept", (4, 1): "kept"})
    _, r0y, _, rh = l_cells[(0, 0)]
    g.path(f"M{8 + 280 + 4} {r0y + 4} h6 v{2 * rh - 8} h-6", "ln")
    y = g.lines(10, ly + lh + 26, ["✓ 왼쪽 행은 모두 남고,", "짝이 없으면 오른쪽 열은 NULL"], 14, "ok b", 20)
    y = g.lines(10, y + 10, ["괄호 ] = 짝이 2건인 학생은", "결과에 2행으로 나온다"], 13, "s", 19)
    y += 10
    g.rect(8, y, 304, 104, "note", 8)
    g.lines(18, y + 24, ["왼쪽 3행 → INNER 4행 · LEFT 5행:", "결과 행 수는 원본과 다를 수 있다"], 13, "t b", 20)
    g.lines(18, y + 70, ["JOIN은 조회 결과만 만든다.", "student·enrollment 표는 그대로다"], 13, "t", 20)
    g.h = y + 104 + 10
    return g


def main():
    os.makedirs(OUT, exist_ok=True)
    builds = {
        "erd-basics-desktop.svg": erd_desktop, "erd-basics-mobile.svg": erd_mobile,
        "pk-fk-relationship-desktop.svg": pkfk_desktop, "pk-fk-relationship-mobile.svg": pkfk_mobile,
        "join-inner-left-desktop.svg": join_desktop, "join-inner-left-mobile.svg": join_mobile,
    }
    for name, fn in builds.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(fn().svg())
        print("wrote", name)


if __name__ == "__main__":
    main()
