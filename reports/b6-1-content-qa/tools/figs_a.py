from svgkit import *


def tbox(s, x, y, w, name, cols, fill=WHITE, stroke=EDGE, sub=None):
    """table box: title + rows with optional PK/FK badges. returns bottom y."""
    rows_h = 30 * len(cols)
    h = 38 + rows_h + 8
    s.rect(x, y, w, h, fill, stroke, 1.8, 12)
    s.text(x + 12, y + 26, name, 19, True, INK)
    s.els.append(f'<line x1="{x+8:g}" y1="{y+36:g}" x2="{x+w-8:g}" y2="{y+36:g}" stroke="{stroke}" stroke-width="1.2"/>')
    for i, (c, k) in enumerate(cols):
        cy = y + 38 + 30 * i
        s.text(x + 12, cy + 21, c, 18, False, INK)
        if k:
            s.badge(x + w - 12 - 34, cy + 1, k, HEAD if k == "PK" else "#8a4b00", w=34)
    return y + h


def v02():
    s = Svg(360, "6개 표와 연결 관계", "공부방 데이터베이스의 여섯 개 표 teacher, subject, course, student, enrollment, score와 1대N 관계를 보여 주는 ERD",
            "V02 | ERD", "공부방 데이터베이스의 6개 표")
    y0 = s.y + 22
    LX, LW, RX, RW = 20, 108, 150, 190
    # row1
    b1 = tbox(s, LX, y0, LW, "teacher", [("id", "PK"), ("name", None)], GRN, GRN_E)
    tbox(s, RX, y0, RW, "subject", [("id", "PK"), ("name", None)], GRN, GRN_E)
    # row2
    y2 = y0 + 104 + 48
    b2 = tbox(s, RX, y2, RW, "course", [("id", "PK"), ("teacher_id", "FK"), ("subject_id", "FK")], WHITE, EDGE)
    # row3
    y3 = b2 + 48
    b3 = tbox(s, RX, y3, RW, "enrollment", [("id", "PK"), ("student_id", "FK"), ("course_id", "FK")], ORNG, ORNG_E)
    tbox(s, LX, y3, LW, "student", [("id", "PK"), ("name", None)], GRN, GRN_E)
    # row4
    y4 = b3 + 48
    b4 = tbox(s, RX, y4, RW, "score", [("id", "PK"), ("enrollment_id", "FK"), ("point", None)], PURP, PURP_E)

    cx = RX + 28  # vertical arrows x on the right column
    # subject -> course
    s.arrow([(cx, y0 + 104), (cx, y2)])
    s.text(cx + 8, y0 + 104 + 19, "1", 18, True, OK_C); s.text(cx + 8, y2 - 8, "N", 18, True, NO_C)
    # course -> enrollment
    s.arrow([(cx, b2), (cx, y3)])
    s.text(cx + 8, b2 + 19, "1", 18, True, OK_C); s.text(cx + 8, y3 - 8, "N", 18, True, NO_C)
    # enrollment -> score
    s.arrow([(cx, b3), (cx, y4)])
    s.text(cx + 8, b3 + 19, "1", 18, True, OK_C); s.text(cx + 8, y4 - 8, "N", 18, True, NO_C)
    # teacher -> course (elbow)
    tx = LX + LW // 2
    ym = y2 + 95
    s.arrow([(tx, y0 + 104), (tx, ym), (RX, ym)])
    s.text(tx + 8, y0 + 104 + 21, "1", 18, True, OK_C)
    s.text(RX - 20, ym - 8, "N", 18, True, NO_C)
    # student -> enrollment (horizontal)
    ys = y3 + 92
    s.arrow([(LX + LW, ys), (RX, ys)])
    s.text(LX + LW + 1, ys - 8, "1", 18, True, OK_C)
    s.text(RX - 15, ys + 24, "N", 18, True, NO_C)

    ly = b4 + 24
    s.rect(20, ly, 320, 156, WHITE, EDGE, 1.5, 12)
    s.text(33, ly + 29, "읽는 법", 19, True, INK)
    s.text(33, ly + 58, "화살표 = 한 쪽 1행이 반대쪽 여러 행", 18, False, SUB)
    s.text(33, ly + 84, "(1 → N). 방향은 부모 → 자식", 18, False, SUB)
    s.text(33, ly + 114, "enrollment 는 학생과 수업을", 18, False, SUB)
    s.text(33, ly + 140, "이어 주는 연결 표입니다.", 18, False, SUB)
    h = ly + 156 + 24
    return s.render(h)


def v03():
    s = Svg(360, "PK와 FK: 번호로 가리키기", "enrollment 표의 student_id와 course_id가 student 표와 course 표의 id를 가리키는 모습",
            "V03 | PK · FK", "번호표(PK)와 가리키는 번호(FK)")
    X = 40
    y = s.y + 22
    # student
    st_cols = [("id", 56), ("name", 234)]
    st_top = y + 28
    yb = s.table(X, y, st_cols, [["1", "김민준"], ["2", "이서연"]], keys=["PK", None], hl={(0, 0)}, title="student 표 (부모)")
    # enrollment
    y2 = yb + 30
    en_cols = [("id", 56), ("student_id", 128), ("course_id", 106)]
    en_top = y2 + 28
    yb2 = s.table(X, y2, en_cols, [["1", "1", "1"], ["2", "1", "2"], ["3", "2", "1"]], keys=["PK", "FK", "FK"],
                  hl={(0, 1), (0, 2)}, title="enrollment 표 (자식)")
    # course
    y3 = yb2 + 30
    co_cols = [("id", 56), ("course_name", 234)]
    co_top = y3 + 28
    yb3 = s.table(X, y3, co_cols, [["1", "중등 수학 기초"], ["2", "중등 영어 독해"]], keys=["PK", None], hl={(0, 0)}, title="course 표 (부모)")

    R = 32
    _e0 = en_top + R * 2 + R / 2
    s.num(X + 56 + 128 - 20, _e0, 1)   # marker inside the student_id cell
    s.num(X + 290 - 20, _e0, 2)        # marker inside the course_id cell
    # arrow 1: enrollment row0 -> student row0
    e_row0 = en_top + R * 2 + R / 2
    s_row0 = st_top + R * 2 + R / 2
    c_row0 = co_top + R * 2 + R / 2
    mid1 = (e_row0 + s_row0) / 2
    s.arrow([(X, e_row0), (24, e_row0), (24, mid1 + 14)], marker=None, dash="6 4")
    s.arrow([(24, mid1 - 14), (24, s_row0), (X, s_row0)], dash="6 4")
    s.num(24, mid1, 1)
    # arrow 2: enrollment row0 -> course row0
    XR = X + 290
    mid2 = (e_row0 + c_row0) / 2
    s.arrow([(XR, e_row0), (346, e_row0), (346, mid2 - 14)], marker=None, dash="6 4")
    s.arrow([(346, mid2 + 14), (346, c_row0), (XR, c_row0)], dash="6 4")
    s.num(346, mid2, 2)

    ny = yb3 + 22
    s.rect(20, ny, 320, 224, WHITE, EDGE, 1.5, 12)
    s.num(42, ny + 28, 1)
    s.text(62, ny + 34, "student_id 1 → 김민준", 18, False, INK)
    s.num(42, ny + 66, 2)
    s.text(62, ny + 72, "course_id 1 → 중등 수학 기초", 18, False, INK)
    s.text(33, ny + 112, "김민준(student 1)은 enrollment", 18, False, SUB)
    s.text(33, ny + 138, "1·2행에 두 번 → 1 : N 관계", 18, False, SUB)
    s.text(33, ny + 172, "점선 = 번호로 가리키는 관계", 18, True, INK)
    s.text(33, ny + 198, "(실행 순서가 아닙니다)", 18, False, SUB)
    h = ny + 224 + 24
    return s.render(h)


FIGS = {"v02-data-modeling.svg": v02, "v03-keys-relations.svg": v03}
