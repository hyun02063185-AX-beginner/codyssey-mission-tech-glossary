from svgkit import *


def v03b():
    s = Svg(360, "학생과 수업의 N:M 관계를 연결 표로 풀기",
            "학생과 수업이 서로 여러 개씩 연결되는 N 대 M 관계를, 가운데 enrollment 표를 두어 1 대 N 두 개로 나누는 모습",
            "V03 보조 | N : M", "학생 ↔ 수업은 연결 표로 풀기")
    y = s.y + 22
    s.text(20, y + 4, "표 하나에는 담기 어렵습니다", 19, True, INK)
    y1 = y + 24
    right = [("중등 영어 독해", y1), ("중등 수학 기초", y1 + 60), ("중등 과학 탐구", y1 + 120)]
    for t, ty in right:
        s.rect(202, ty, 138, 44, WHITE, EDGE, 1.5, 10)
        s.text(212, ty + 29, t, 18, False, INK)
    left = [("김민준", y1 + 30), ("이서연", y1 + 90)]
    for t, ty in left:
        s.rect(20, ty, 100, 44, GRN, GRN_E, 1.5, 10)
        s.text(33, ty + 29, t, 18, True, INK)
    mid = lambda ty: ty + 22
    s.arrow([(120, mid(y1 + 30)), (202, mid(y1))], marker=None)
    s.arrow([(120, mid(y1 + 30)), (202, mid(y1 + 60))], marker=None)
    s.arrow([(120, mid(y1 + 90)), (202, mid(y1 + 60))], marker=None)
    s.arrow([(120, mid(y1 + 90)), (202, mid(y1 + 120))], marker=None)
    cy = y1 + 176
    s.text(20, cy, "한 학생 → 여러 수업", 18, True, INK)
    s.text(20, cy + 26, "한 수업 → 여러 학생  =  N : M", 18, True, NO_C)
    y = cy + 66
    s.text(20, y, "가운데에 연결 표 enrollment", 19, True, INK)
    y += 18
    s.rect(60, y, 120, 44, GRN, GRN_E, 1.5, 10); s.text(73, y + 29, "student", 18, True, INK)
    s.rect(200, y, 120, 44, GRN, GRN_E, 1.5, 10); s.text(213, y + 29, "course", 18, True, INK)
    ty = y + 44 + 64
    s.arrow([(120, y + 44), (120, ty)])
    s.arrow([(260, y + 44), (260, ty)])
    s.text(130, y + 44 + 24, "1", 18, True, OK_C); s.text(130, ty - 10, "N", 18, True, NO_C)
    s.text(270, y + 44 + 24, "1", 18, True, OK_C); s.text(270, ty - 10, "N", 18, True, NO_C)
    tb = s.table(35, ty, [("id", 56), ("student_id", 128), ("course_id", 106)],
                 [["1", "1", "1"], ["2", "1", "2"], ["3", "2", "1"], ["4", "2", "3"]], keys=["PK", "FK", "FK"])
    s.text(20, tb + 34, "수강 1건 = 연결 표의 한 행", 18, True, INK)
    s.text(20, tb + 60, "(학생 번호 + 수업 번호)", 18, False, SUB)
    end = s.footer_note("N:M 을 1:N 과 N:1 두 개로 나눕니다", tb + 80)
    return s.render(end + 22)


def v07():
    s = Svg(360, "묶어서 세고 묶은 결과를 거르기",
            "수업별 수강생 수를 GROUP BY와 COUNT로 세고, 학생별 평균을 HAVING으로 거르는 과정. 수강생이 없는 영어 회화는 0으로 남는다",
            "V07 | GROUP BY · 집계", "묶어서 세고, 묶은 결과를 거르기")
    y = s.y + 22
    s.text(20, y + 4, "수업별 수강생 수 (Q10)", 19, True, INK)
    y += 18
    s.rect(20, y, 320, 3 * 62 + 12, WHITE, EDGE, 1.5, 12)
    rows = [("파이썬 코딩 입문", 3), ("국어 문법 정리", 2), ("영어 회화", 0)]
    for i, (nm, n) in enumerate(rows):
        ry = y + 10 + i * 62
        s.text(33, ry + 22, nm, 18, True, INK)
        s.text(327, ry + 22, f"COUNT = {n}", 18, True, OK_C if n else NO_C, "end")
        if n:
            s.dots(42, ry + 44, n)
        else:
            s.rect(33, ry + 34, 120, 20, "none", NO_C, 1.5, 6, "5 4")
            s.text(165, ry + 50, "수강 행 없음", 18, False, SUB)
        if i < 2:
            s.vline(33, ry + 58, 327, ry + 58)
    y += 3 * 62 + 12 + 14
    s.text(20, y + 14, "COUNT(e.id) 는 0, COUNT(*) 였다면 1", 18, False, SUB)
    s.text(20, y + 40, "(LEFT JOIN 이 만든 빈 행도 세어서)", 18, False, SUB)
    y += 76
    s.text(20, y + 4, "학생별 평균, 80점 이상만 (Q11)", 19, True, INK)
    y += 18
    s.rect(20, y, 320, 3 * 36 + 16, WHITE, EDGE, 1.5, 12)
    steps = ["GROUP BY: 학생별로 묶기", "AVG: 묶음마다 평균 계산", "HAVING: 평균 80 이상만 남김"]
    for i, t in enumerate(steps):
        sy = y + 26 + i * 36
        s.num(46, sy, i + 1)
        s.text(68, sy + 6, t, 18, False, INK)
    y += 3 * 36 + 16 + 14
    y = s.ncard(20, y, 320, "ok", "이서연 → 91.3", "점수 95 · 81 · 98", GRN, GRN_E) + 10
    y = s.ncard(20, y, 320, "ok", "홍지민 → 89.0", "점수 89", GRN, GRN_E) + 10
    y = s.ncard(20, y, 320, "no", "임건우 → 79.5", "점수 93 · 66 → HAVING 에서 탈락", RED, RED_E) + 14
    y = s.footer_note("WHERE 는 묶기 전에 행을, HAVING 은 묶은 뒤 그룹을 거릅니다", y)
    return s.render(y + 22)


def v08():
    s = Svg(360, "서브쿼리: 안쪽 질문을 먼저 풀기",
            "전체 평균을 구하는 안쪽 SELECT가 먼저 실행되어 80.0이라는 값이 되고, 바깥 SELECT가 그보다 높은 점수를 고르는 과정",
            "V08 | Subquery", "안쪽 질문을 먼저 풀기")
    y = s.y + 22
    oh = 258
    s.rect(20, y, 320, oh, BLUE, BLUE_E, 2, 12)
    s.text(33, y + 31, "바깥 질문 (Q14)", 19, True, INK)
    s.text(33, y + 62, "SELECT … FROM score sc …", 18, False, INK, mono=True)
    s.text(33, y + 88, "WHERE sc.point >", 18, False, INK, mono=True)
    s.rect(33, y + 104, 294, 104, ORNG, ORNG_E, 2, 10)
    s.num(58, y + 130, 1)
    s.text(80, y + 136, "안쪽 질문 (괄호)", 18, True, INK)
    s.text(46, y + 166, "(SELECT AVG(point)", 18, False, INK, mono=True)
    s.text(46, y + 192, " FROM score)", 18, False, INK, mono=True)
    s.text(33, y + 236, "ORDER BY … LIMIT 10;", 18, False, INK, mono=True)
    y += oh
    s.arrow([(180, y), (180, y + 28)])
    y += 28
    y = s.ncard(20, y, 320, 1, "안쪽이 먼저: 평균 = 80.0", "숫자 하나로 바뀝니다", ORNG, ORNG_E)
    s.arrow([(180, y), (180, y + 24)])
    y = s.ncard(20, y + 24, 320, 2, "바깥: point > 80.0", "30건 중 16건이 조건에 맞음", WHITE, EDGE)
    s.arrow([(180, y), (180, y + 24)])
    y = s.ncard(20, y + 24, 320, 3, "LIMIT 10: 상위 10건만 표시", None, GRN, GRN_E)
    y = s.footer_note("서브쿼리 = 값을 먼저 구해 비교에 쓰는 방법", y + 22)
    return s.render(y + 22)


def v08b():
    s = Svg(360, "인덱스: 색인이 있으면 찾는 길이 달라집니다",
            "인덱스 없이 표 전체를 훑는 SCAN과 인덱스로 위치를 찾는 SEARCH의 차이, 이 데이터베이스의 실제 실행 계획, 인덱스의 비용",
            "V08 보조 | Index", "색인이 있으면 찾는 길이 달라집니다")
    y = s.y + 22

    def strip(sx, sy, hit=None, all_on=False):
        for i in range(10):
            x = sx + i * 28
            on = all_on or i == hit
            s.rect(x, sy, 22, 22, HEAD if on else WHITE, HEAD if on else LINE, 1.5, 4)

    h = 132
    s.rect(20, y, 320, h, WHITE, EDGE, 1.5, 12)
    s.text(33, y + 31, "색인 없이: SCAN", 19, True, INK)
    s.text(33, y + 58, "첫 행부터 끝까지 모두 읽음", 18, False, SUB)
    strip(36, y + 80, all_on=True)
    y += h + 14
    h = 168
    s.rect(20, y, 320, h, GRN, GRN_E, 1.8, 12)
    s.text(33, y + 31, "색인 이용: SEARCH", 19, True, INK)
    s.text(33, y + 58, "색인에서 위치를 찾아 바로 이동", 18, False, SUB)
    s.rect(36 + 4 * 28 - 22, y + 76, 72, 28, ORNG, ORNG_E, 1.5, 7)
    s.text(36 + 4 * 28 + 14, y + 96, "색인", 18, True, INK, "middle")
    s.arrow([(36 + 4 * 28 + 11, y + 104), (36 + 4 * 28 + 11, y + 128)])
    strip(36, y + 130, hit=4)
    y += h + 26
    s.text(20, y, "이 DB 의 실행 계획 (EXPLAIN)", 19, True, INK)
    y += 14
    s.rect(20, y, 320, 3 * 44 + 12 + 34, WHITE, EDGE, 1.5, 12)
    s.text(33, y + 28, "e = enrollment, sc = score", 18, False, SUB)
    rows = [("e.student_id = 5", "SEARCH", OK_C, GRN), ("e.course_id = 3", "SCAN", GREY_T, GREY), ("sc.point > 90", "SCAN", GREY_T, GREY)]
    for i, (c, b, col, bg) in enumerate(rows):
        ry = y + 42 + i * 44
        s.text(33, ry + 29, c, 18, False, INK, mono=True)
        bw = 96
        s.rect(327 - bw, ry + 6, bw, 30, bg, col, 1.5, 8)
        s.text(327 - bw / 2, ry + 28, b, 18, True, col, "middle")
        if i < 2:
            s.vline(33, ry + 44, 327, ry + 44)
    y += 3 * 44 + 12 + 34 + 14
    y = s.card(20, y, 320, "student_id 는 이미 색인이 있었음", ["UNIQUE (student_id, course_id) 가 만든 자동 색인을 Q15 이전에도 사용"], ORNG, ORNG_E)
    y = s.card(20, y + 14, 320, "색인의 비용", ["저장 공간이 더 듭니다.", "INSERT · UPDATE · DELETE 때 색인도 함께 고칩니다.", "작은 표에서는 이득이 거의 없습니다."], GREY, EDGE)
    return s.render(y + 22)


def v09():
    s = Svg(360, "고치고 지우기 전에 확인하기",
            "UPDATE와 DELETE를 안전하게 쓰는 다섯 단계, WHERE가 있을 때와 없을 때의 영향 행 수 차이, 외래키가 막아 주는 범위",
            "V09 | UPDATE · DELETE", "고치고 지우기 전에 확인하기")
    y = s.y + 22
    s.text(20, y + 4, "안전한 순서", 19, True, INK)
    y += 18
    steps = ["SELECT 로 대상 먼저 보기", "WHERE 를 붙여 수정·삭제", "영향 받은 행 수 확인", "다시 SELECT 로 결과 확인", "연습용 복사본에서 먼저"]
    for i, t in enumerate(steps):
        y = s.ncard(20, y, 320, i + 1, t, None, BLUE if i < 4 else GREY, BLUE_E if i < 4 else EDGE) + 10
    y += 26
    s.text(20, y, "WHERE 가 있을 때와 없을 때", 19, True, INK)
    y += 14
    y = s.ncard(20, y, 320, "ok", "WHERE id = 7", "1행만 변경 (58 → 62)", GRN, GRN_E) + 10
    y = s.ncard(20, y, 320, "warn", "WHERE 없음", ["30행 전부 0점으로", "(연습 복사본에서 실험)"], ORNG, "#c9812f") + 22
    y = s.card(20, y, 320, "외래키가 막아 주는 범위",
               ["수강 기록이 있는 학생 삭제는 거절됩니다.", "하지만 score 처럼 자식 쪽 표를 WHERE 없이 지우는 것은 막지 못합니다."], WHITE, EDGE)
    return s.render(y + 22)


def v10():
    s = Svg(360, "SQL 파일에서 조회 결과까지",
            "세 개의 SQL 파일이 sqlite3 명령 또는 Python 스크립트로 실행되어 SQLite가 여섯 개 표가 든 student_mgmt.db 파일을 읽고 쓰며 결과를 내는 전체 구조",
            "V10 | 전체 구조", "SQL 파일에서 조회 결과까지")
    y = s.y + 22
    y = s.ncard(20, y, 320, None, "SQL 파일 3개",
                ["01_schema.sql (2~4장)", "02_sample_data.sql (3·4장)", "03_queries.sql (5~9장)"], BLUE, BLUE_E)
    s.arrow([(96, y), (96, y + 28)])
    s.arrow([(264, y), (264, y + 28)])
    y += 28
    ya = s.ncard(20, y, 152, None, "sqlite3 명령", ["터미널에서", "파일을 입력"], WHITE, EDGE, minh=136)
    yb = s.ncard(188, y, 152, None, "Python 스크립트", ["SQL 파일 실행", "+ 결과 문서"], WHITE, EDGE, minh=136)
    ym = max(ya, yb)
    s.arrow([(96, ym), (96, ym + 26), (180, ym + 26)], marker=None)
    s.arrow([(264, ym), (264, ym + 26), (180, ym + 26)], marker=None)
    s.arrow([(180, ym + 26), (180, ym + 54)])
    y = ym + 54
    y = s.ncard(20, y, 320, None, "SQLite (DBMS)", ["문법 확인 · 규칙 검사 · 실행", "연결마다 외래키 검사 ON (4장)"], ORNG, ORNG_E)
    s.arrow([(180, y), (180, y + 28)])
    y += 28
    y = s.ncard(20, y, 320, None, "student_mgmt.db: 6개 표",
                ["teacher · subject · course", "student · enrollment · score", "(2·3장)"], PURP, PURP_E)
    s.arrow([(180, y), (180, y + 28)])
    y += 28
    y = s.ncard(20, y, 320, None, "결과", ["터미널 출력", "results/query_results.md"], GRN, GRN_E)
    y = s.footer_note("Python 은 SQL 을 대신하지 않고, SQL 실행과 결과 정리를 도울 뿐입니다", y + 22)
    return s.render(y + 22)


def v10w():
    W = 900
    s = Svg(W, "SQL 파일에서 조회 결과까지 (PC용 전체 관계도)",
            "세 개의 SQL 파일, 두 가지 실행 방법, SQLite DBMS, 여섯 개 표의 관계, 질문 유형과 결과 문서를 한 장에 보여 주는 PC용 전체 관계도",
            "V10 PC용 | 전체 관계도", "SQL 파일 → 실행 → SQLite → 6개 표 → 결과", head_h=96, min_font=19)
    T = 20
    top = 150

    def card(x, y, w, title, body, fill, stroke):
        return s.card(x, y, w, title, body, fill, stroke, tsize=T, bsize=T)

    # ---- column 1: SQL files
    s.text(24, top - 14, "① 사람이 쓰는 SQL 파일", T, True, INK)
    y = top
    fmid = []
    for n, d in [("01_schema.sql", "표 · 키 · 규칙 만들기 (2~4장)"), ("02_sample_data.sql", "샘플 데이터 넣기"), ("03_queries.sql", "질문 Q01~Q17 (5~9장)")]:
        b = card(24, y, 240, n, [d], BLUE, BLUE_E)
        fmid.append((y + b) / 2)
        y = b + 14
    files_bottom = y - 14
    # ---- column 2: routes + engine
    mx, mw = 322, 250
    s.text(mx, top - 14, "② 실행 방법 2가지", T, True, INK)
    ra = card(mx, top, mw, "A. sqlite3 명령", ["터미널에서 < 로 SQL 파일 입력"], WHITE, EDGE)
    rb = card(mx, ra + 14, mw, "B. Python 스크립트", ["run_queries.py: 실행 + 결과 문서"], WHITE, EDGE)
    bus = 293
    for m in fmid:
        s.arrow([(264, m), (bus, m)], marker=None)
    s.arrow([(bus, fmid[0]), (bus, fmid[2])], marker=None)
    ya_mid = (top + ra) / 2
    yb_mid = (ra + 14 + rb) / 2
    s.arrow([(bus, ya_mid), (mx, ya_mid)])
    s.arrow([(bus, yb_mid), (mx, yb_mid)])
    s.arrow([(bus, ya_mid), (bus, fmid[0])], marker=None) if ya_mid < fmid[0] else s.arrow([(bus, fmid[0]), (bus, ya_mid)], marker=None)
    s.arrow([(bus, fmid[2]), (bus, yb_mid)], marker=None) if yb_mid < fmid[2] else s.arrow([(bus, yb_mid), (bus, fmid[2])], marker=None)
    ey = rb + 52
    s.arrow([(mx + mw / 2, rb), (mx + mw / 2, ey)])
    eng = card(mx, ey, mw, "SQLite (DBMS)", ["문법 확인 · 실행", "규칙 검사 (4장)", "PK · FK · UNIQUE", "NOT NULL · CHECK", "외래키 검사는 연결마다 ON"], ORNG, ORNG_E)
    # ---- column 3: DB container with ERD
    cx0, cw_ = 610, 278
    s.text(cx0 + 4, top - 14, "③ student_mgmt.db", T, True, INK)
    bh = 64
    r1 = top + 14
    r2 = r1 + bh + 44
    r3 = r2 + bh + 44
    r4 = r3 + bh + 44
    cont_h = (r4 + bh + 70) - top
    s.rect(cx0, top, cw_, cont_h, "#fbfdfc", LINE, 1.8, 14, "8 6")
    LXb, LWb, RXb, RWb = cx0 + 12, 100, cx0 + 12 + 100 + 30, 124

    def tbl(x, y, w, n, rows, fill, stroke):
        s.rect(x, y, w, bh, fill, stroke, 1.8, 10)
        s.text(x + w / 2, y + 27, n, T, True, INK, "middle")
        s.text(x + w / 2, y + 52, rows, T, False, SUB, "middle")

    tbl(LXb, r1, LWb, "teacher", "10행", GRN, GRN_E)
    tbl(RXb, r1, RWb, "subject", "10행", GRN, GRN_E)
    tbl(RXb, r2, RWb, "course", "12행", WHITE, EDGE)
    tbl(LXb, r3, LWb, "student", "15행", GRN, GRN_E)
    tbl(RXb, r3, RWb, "enrollment", "26행", ORNG, ORNG_E)
    tbl(RXb, r4, RWb, "score", "30행", PURP, PURP_E)
    cxr = RXb + RWb / 2
    s.arrow([(cxr, r1 + bh), (cxr, r2)])
    s.arrow([(cxr, r2 + bh), (cxr, r3)])
    s.arrow([(cxr, r3 + bh), (cxr, r4)])
    s.arrow([(LXb + LWb / 2, r1 + bh), (LXb + LWb / 2, r2 + bh / 2), (RXb, r2 + bh / 2)])
    s.arrow([(LXb + LWb, r3 + bh / 2), (RXb, r3 + bh / 2)])
    s.text(LXb, r4 + 28, "화살표", T, True, INK)
    s.text(LXb, r4 + 54, "1 → N", T, True, INK)
    # engine -> DB
    s.arrow([(mx + mw, ey + 50), (cx0, ey + 50)], dash="7 5")
    # ---- bottom band
    by = max(eng, top + cont_h) + 34
    s.text(24, by, "④ 질문 유형", T, True, INK)
    chips = [("Q01~Q04", "조회·정렬 (5장)"), ("Q05~Q09", "JOIN (6장)"), ("Q10~Q13", "집계 (7장)"), ("Q14 · Q15", "서브쿼리·색인 (8장)"), ("Q16 · Q17", "수정·삭제 (9장)")]
    cw2 = 164
    for i, (q, d) in enumerate(chips):
        x = 24 + i * (cw2 + 8)
        s.rect(x, by + 16, cw2, 92, WHITE, EDGE, 1.5, 10)
        s.text(x + 12, by + 46, q, T, True, INK)
        s.lines(x + 12, by + 74, d, cw2 - 22, T, 26, False, SUB)
    ry = by + 108 + 28
    res = card(24, ry, 852, "⑤ 결과", ["터미널 출력 (sqlite3 명령) · results/query_results.md (Python 스크립트가 정리)"], GRN, GRN_E)
    return s.render(res + 24)


FIGS = {"v03-nm-junction.svg": v03b, "v07-group-aggregation.svg": v07, "v08-subquery.svg": v08,
        "v08-index.svg": v08b, "v09-update-delete.svg": v09, "v10-database-overview.svg": v10,
        "v10-database-overview-wide.svg": v10w}
