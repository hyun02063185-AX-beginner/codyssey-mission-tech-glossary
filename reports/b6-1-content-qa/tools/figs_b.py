from svgkit import *


def down(s, x, y1, y2, label=None, lx=None, color=LINE, marker="arrow"):
    s.arrow([(x, y1), (x, y2)], stroke=color, marker=marker)
    if label:
        s.text(lx if lx is not None else x + 12, (y1 + y2) / 2 + 6, label, 18, False, SUB)


def v01():
    s = Svg(360, "한 장에 적기와 표로 나누기",
            "엑셀 한 시트에서 강사 이름이 반복되는 모습과, 데이터베이스에서 강사 표와 수업 표로 나누어 번호로 연결하는 모습, 그리고 SQL 요청이 DBMS를 거쳐 파일에 닿는 흐름",
            "V01 | 엑셀 · DB · DBMS", "한 장에 적기 vs 표로 나누기")
    ay = s.y + 22
    # --- Panel A: flat sheet
    s.rect(20, ay, 320, 232, WHITE, EDGE, 1.5, 12)
    s.text(33, ay + 30, "엑셀 한 시트 (교육용 예시)", 19, True, INK)
    tb = s.table(35, ay + 44, [("수업", 150), ("강사", 80), ("점수", 60)],
                 [["중등 수학 기초", "박서준", "88"], ["중등 수학 기초", "박서준", "95"], ["고등 수학 심화", "박서준", "83"]],
                 hl={(0, 1), (1, 1), (2, 1)})
    s.text(33, tb + 30, "강사 이름이 행마다 반복됩니다.", 18, False, SUB)
    ay2 = ay + 232
    s.arrow([(180, ay2), (180, ay2 + 46)])
    s.text(196, ay2 + 31, "강사만 분리", 18, True, INK)
    by = ay2 + 46
    # --- Panel B: split tables
    BH = 360
    s.rect(20, by, 320, BH, WHITE, EDGE, 1.5, 12)
    s.text(33, by + 30, "DB: 표를 나누고 번호로 연결", 19, True, INK)
    t1 = s.table(35, by + 40, [("id", 56), ("name", 110)], [["1", "박서준"]], title="teacher 표")
    t2y = t1 + 18
    t2 = s.table(35, t2y, [("수업", 160), ("teacher_id", 120)], [["중등 수학 기초", "1"], ["고등 수학 심화", "1"]], title="course 표")
    trow = by + 40 + 28 + 32 + 16
    r1 = t2y + 28 + 32 + 16
    r2 = r1 + 32
    s.arrow([(315, r1), (330, r1), (330, trow), (203, trow)], dash="6 4")
    s.arrow([(315, r2), (330, r2), (330, r1)], dash="6 4", marker=None)
    s.text(33, t2 + 30, "이름은 teacher 에 1번만 적습니다.", 18, False, SUB)
    s.text(33, t2 + 58, "바꿀 곳: 8곳 → 1곳 (B6-1 기준)", 18, True, OK_C)
    end = s.footer_note("이름이 바뀌면: 시트는 여러 곳, DB는 한 곳만 고칩니다", by + BH + 22)
    return s.render(end + 22)


def v01b():
    s = Svg(360, "DB, DBMS, SQLite 의 관계",
            "SQL 요청이 DBMS인 SQLite를 거쳐 데이터베이스 파일에 닿는 흐름과, 서버형 DBMS와 파일형 SQLite의 차이",
            "V01 보조 | DB · DBMS", "DB, DBMS, SQLite 는 서로 다릅니다")
    y = s.y + 22
    y1 = s.ncard(20, y, 320, 1, "SQL 요청", "사람이나 프로그램이 보냅니다", BLUE, BLUE_E)
    s.arrow([(180, y1), (180, y1 + 26)])
    y2 = s.ncard(20, y1 + 26, 320, 2, "DBMS = SQLite", "읽기 · 쓰기 · 규칙 검사를 맡는 프로그램", ORNG, ORNG_E)
    s.arrow([(180, y2), (180, y2 + 26)])
    y3 = s.ncard(20, y2 + 26, 320, 3, "DB = student_mgmt.db", "데이터가 담긴 파일 하나", PURP, PURP_E)
    y = y3 + 30
    s.text(20, y, "DBMS 의 두 가지 모습", 19, True, INK)
    y += 16
    y = s.card(20, y, 320, "서버형: MySQL · PostgreSQL", ["서버 프로그램을 설치하고 실행한 뒤 접속합니다."], WHITE, EDGE) + 14
    y = s.card(20, y, 320, "파일형: SQLite", ["서버 없이 프로그램 안의 라이브러리가 파일 하나를 읽고 씁니다."], GRN, GRN_E)
    end = s.footer_note("SQL 은 말하는 언어, SQLite 는 그 말을 알아듣는 프로그램", y + 22)
    return s.render(end + 22)


def v04():
    s = Svg(360, "잘못된 데이터를 막는 검문소",
            "새 데이터를 넣을 때 NOT NULL, UNIQUE, CHECK, FOREIGN KEY 규칙이 잘못된 입력과 삭제를 거절하는 모습",
            "V04 | 제약조건 · 무결성", "잘못된 데이터를 막는 검문소")
    y = s.y + 22
    y = s.ncard(20, y, 320, None, "새 데이터를 넣거나 지워 봅니다", "DBMS 가 규칙마다 먼저 검사합니다", BLUE, BLUE_E)
    s.arrow([(180, y), (180, y + 28)])
    y += 28
    items = [
        ("NOT NULL: 이름 비움", "NOT NULL constraint failed: student.name"),
        ("UNIQUE: 이메일 중복", "UNIQUE constraint failed: student.email"),
        ("CHECK: 점수 150", "CHECK constraint failed: point BETWEEN 0 AND 100"),
        ("FOREIGN KEY: 없는 학생 999번 수강 신청", "FOREIGN KEY constraint failed"),
        ("FOREIGN KEY: 수강 있는 학생 삭제", "FOREIGN KEY constraint failed"),
    ]
    for t, m in items:
        y = s.ncard(20, y, 320, "no", t, m, WHITE, RED_E, bcol=RED_T) + 12
    s.text(20, y + 14, "거절 = 그 문장은 데이터를 바꾸지 않음", 18, True, INK)
    y = s.footer_note("규칙은 DBMS 안에 있어서 누가 입력해도 같은 검사를 받습니다.", y + 30)
    return s.render(y + 22)


def v04b():
    s = Svg(360, "외래키 검사는 연결마다 켜는 스위치",
            "SQLite에서 PRAGMA foreign_keys를 켠 연결은 없는 학생 번호의 수강 신청을 거절하지만, 켜지 않은 연결은 그대로 저장한다",
            "V04 보조 | SQLite", "외래키 검사는 연결마다 켜는 스위치")
    y = s.y + 22
    # connection A
    h = 214
    s.rect(20, y, 320, h, WHITE, GRN_E, 2, 12)
    s.text(33, y + 31, "연결 A · 스위치를 켠 연결", 19, True, INK)
    s.rect(33, y + 46, 294, 38, BLUE, BLUE_E, 1.2, 8)
    s.text(43, y + 72, "PRAGMA foreign_keys = ON;", 18, False, INK, mono=True)
    s.text(33, y + 116, "수강 신청 INSERT (학생 999번)", 18, False, SUB)
    s.arrow([(180, y + 128), (180, y + 148)])
    s.cross(48, y + 176)
    s.text(68, y + 175, "거절 (FOREIGN KEY", 18, True, NO_C)
    s.text(68, y + 199, "constraint failed)", 18, True, NO_C)
    y += h + 18
    h = 214
    s.rect(20, y, 320, h, WHITE, ORNG_E, 2, 12, "7 5")
    s.text(33, y + 31, "연결 B · 켜지 않은 연결", 19, True, INK)
    s.rect(33, y + 46, 294, 38, GREY, EDGE, 1.2, 8)
    s.text(43, y + 72, "(PRAGMA 없음 = 기본 OFF)", 18, False, INK, mono=True)
    s.text(33, y + 116, "수강 신청 INSERT (학생 999번)", 18, False, SUB)
    s.arrow([(180, y + 128), (180, y + 148)])
    s.warn(48, y + 176)
    s.text(68, y + 175, "저장됨! 없는 학생을 가리키는", 18, True, "#8a4b00")
    s.text(68, y + 199, "행이 생김", 18, True, "#8a4b00")
    y += h + 18
    y = s.card(20, y, 320, "알아 둘 점", ["나중에 켜도 이미 들어간 행은 그대로입니다.",
                                       "PRAGMA 는 연결 한 번의 설정이며 파일에는 저장되지 않습니다."], GREY, EDGE)
    return s.render(y + 22)


def v05():
    s = Svg(360, "SQL 한 문장이 결과가 되기까지",
            "사람이 쓴 SQL이 DBMS를 거쳐 데이터 파일을 읽고 결과 표로 돌아오는 흐름과, Q01 문장의 구성요소",
            "V05 | SQL · Query", "SQL 한 문장이 결과가 되기까지")
    y = s.y + 22
    steps = [
        ("사람: SQL 을 적는다", "필요한 데이터를 요청합니다", BLUE, BLUE_E),
        ("DBMS (SQLite)", "문법 확인 → 실행 → 규칙 검사", ORNG, ORNG_E),
        ("student_mgmt.db", "데이터가 든 파일을 읽습니다", PURP, PURP_E),
        ("결과 표", "열과 행으로 돌려줍니다", GRN, GRN_E),
    ]
    for i, (t, b, f, e) in enumerate(steps):
        y = s.ncard(20, y, 320, i + 1, t, b, f, e)
        if i < 3:
            s.arrow([(180, y), (180, y + 24)])
            y += 24
    y += 34
    s.text(20, y, "Q01 문장 해부", 19, True, INK)
    y += 16
    rows = [("SELECT", "보여 줄 열을 고름"), ("FROM", "어느 표에서 가져올지"), ("WHERE", "조건: 중등 2학년"), ("ORDER BY", "정렬 기준 (이름순)")]
    s.rect(20, y, 320, 4 * 62 + 10, WHITE, EDGE, 1.5, 12)
    for i, (k, d) in enumerate(rows):
        ry = y + 12 + i * 62
        s.badge(33, ry + 8, k, HEAD, w=112)
        n = len(wrap(d, 170, 18))
        s.lines(158, ry + 27 - (n - 1) * 12, d, 170, 18, 24, False, SUB)
    y += 4 * 62 + 10 + 22
    c1 = s.ncard(20, y, 320, None, "student 표 15행", None, WHITE, EDGE)
    s.arrow([(180, c1), (180, c1 + 28)])
    s.text(196, c1 + 24, "WHERE", 18, True, INK)
    c2 = s.ncard(20, c1 + 28, 320, None, "조건에 맞는 3행", None, WHITE, EDGE)
    s.arrow([(180, c2), (180, c2 + 28)])
    s.text(196, c2 + 24, "ORDER BY", 18, True, INK)
    c3 = s.ncard(20, c2 + 28, 320, None, "배현우 · 이서연 · 최유나", None, GRN, GRN_E)
    return s.render(c3 + 24)


def v06():
    s = Svg(360, "INNER JOIN 과 LEFT JOIN 의 차이",
            "수강 신청이 없는 학생 문태양이 INNER JOIN 결과에서는 사라지고 LEFT JOIN 결과에서는 NULL과 함께 남는 모습",
            "V06 | JOIN", "INNER JOIN 과 LEFT JOIN")
    y = s.y + 22
    s.text(20, y + 4, "연결 기준 (ON)", 19, True, INK)
    s.rect(20, y + 16, 320, 44, BLUE, BLUE_E, 1.2, 10)
    s.text(33, y + 45, "s.id = e.student_id", 18, False, INK, mono=True)
    y += 82
    tb = s.table(20, y, [("student.id", 100), ("name", 100), ("수강 행", 120)],
                 [["13", "배현우", "1건 (25)"], ["14", "홍지민", "1건 (26)"], ["15", "문태양", "0건"]],
                 hl={(2, 2)}, cellfills={(2, 2): RED}, title="왼쪽 표: student 의 13~15번")
    y = tb + 36
    # INNER
    s.rect(20, y, 320, 4 * 32 + 74, WHITE, BLUE_E, 2, 12)
    s.num(46, y + 28, 1)
    s.text(68, y + 34, "INNER JOIN → 2행", 19, True, INK)
    tb = s.table(33, y + 52, [("name", 150), ("e.id", 144)], [["배현우", "25"], ["홍지민", "26"]])
    s.cross(48, tb + 22, 11)
    s.text(68, tb + 28, "문태양: 짝이 없어 사라짐", 18, True, NO_C)
    y = tb + 50
    # LEFT
    y += 18
    s.rect(20, y, 320, 4 * 32 + 74 + 34, WHITE, GRN_E, 2, 12)
    s.num(46, y + 28, 2)
    s.text(68, y + 34, "LEFT JOIN → 3행", 19, True, INK)
    tb = s.table(33, y + 52, [("name", 150), ("e.id", 144)], [["배현우", "25"], ["홍지민", "26"], ["문태양", "NULL"]],
                 hl={(2, 1)})
    s.check(48, tb + 22, 11)
    s.text(68, tb + 28, "왼쪽은 모두 남고 NULL 로 채움", 18, True, OK_C)
    y = tb + 50
    y = s.footer_note("짝 없는 행 찾기: WHERE e.id IS NULL (Q08)", y + 22)
    return s.render(y + 22)


FIGS = {"v01-database-basics.svg": v01, "v01-dbms-sqlite.svg": v01b, "v04-data-integrity.svg": v04, "v04-fk-switch.svg": v04b,
        "v05-sql-queries.svg": v05, "v06-sql-joins.svg": v06}
