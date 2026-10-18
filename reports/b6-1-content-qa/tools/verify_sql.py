#!/usr/bin/env python3
"""Re-run every [실행 확인] claim of the B6-1 learning guide against the original B6-1 SQL files.

usage: python -I verify_sql.py <path to Codyssey_B6-1 checkout>
Nothing in the checkout is modified: everything runs on in-memory / temp-dir copies.
"""
import os, re, shutil, sqlite3, subprocess, sys, tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(sys.argv[1]).resolve()
SQL = ROOT / "sql"
SCHEMA = (SQL / "01_schema.sql").read_text(encoding="utf-8")
DATA = (SQL / "02_sample_data.sql").read_text(encoding="utf-8")
QUERIES = (SQL / "03_queries.sql").read_text(encoding="utf-8")
results = []


def check(name, cond, detail=""):
    results.append((bool(cond), name, detail))
    print(("PASS " if cond else "FAIL ") + name + (f"  [{detail}]" if detail else ""))


def fresh(fk=True):
    c = sqlite3.connect(":memory:")
    c.executescript(SCHEMA + DATA)  # files contain PRAGMA foreign_keys = ON
    c.execute(f"PRAGMA foreign_keys = {'ON' if fk else 'OFF'}")
    return c


def q(c, sql):
    return c.execute(sql).fetchall()


def err(c, sql):
    try:
        c.execute(sql)
        return None
    except sqlite3.Error as e:
        return str(e)


print("SQLite", sqlite3.sqlite_version)

# --- 0. structure facts
c = fresh()
check("6 tables", sorted(r[0] for r in q(c, "select name from sqlite_master where type='table'")) ==
      ["course", "enrollment", "score", "student", "subject", "teacher"])
rows = {t: q(c, f"select count(*) from {t}")[0][0] for t in ["student", "teacher", "subject", "course", "enrollment", "score"]}
check("row counts 15/10/10/12/26/30", rows == dict(student=15, teacher=10, subject=10, course=12, enrollment=26, score=30), str(rows))
check("5 FOREIGN KEY declarations", len(q(c, "select 1 from sqlite_master m, pragma_foreign_key_list(m.name) where m.type='table'")) == 5)
check("17 queries in 03_queries.sql", len(re.findall(r"(?m)^-- \[Q\d+\]", QUERIES)) == 17)
check("3 SQL files start with PRAGMA foreign_keys = ON", all("PRAGMA foreign_keys = ON;" in t for t in (SCHEMA, DATA, QUERIES)))
check("01_schema.sql drops 6 tables first", len(re.findall(r"DROP TABLE IF EXISTS", SCHEMA)) == 6)
check("DATE column stored as text", q(c, "select typeof(joined_at) from student where id=1") == [("text",)])
check("no AUTOINCREMENT, no ON DELETE option", "AUTOINCREMENT" not in SCHEMA.upper() and "ON DELETE" not in SCHEMA.upper())

# --- Ch1
flat = q(c, "select count(*) from score sc join enrollment e on e.id=sc.enrollment_id join course co on co.id=e.course_id where co.teacher_id=1")
check("박서준 appears in 8 score rows (V01 / Ch1)", flat == [(8,)])
check("flat rows used in V01 exist (88/95/83 with 박서준)", q(c, """select sc.point from score sc join enrollment e on e.id=sc.enrollment_id
    join course co on co.id=e.course_id where co.teacher_id=1 and sc.id in (1,3,10) order by sc.id""") == [(88,), (95,), (83,)])

# --- Ch3 / V03 / V03b
check("V03 rows: enrollment 1..3", q(c, "select id,student_id,course_id from enrollment where id<=3") == [(1, 1, 1), (2, 1, 2), (3, 2, 1)])
check("V03 names", q(c, "select id,name from student where id in (1,2)") == [(1, "김민준"), (2, "이서연")] and
      q(c, "select id,course_name from course where id in (1,2)") == [(1, "중등 수학 기초"), (2, "중등 영어 독해")])
check("V03b enrollment 1..4 = (1,1)(1,2)(2,1)(2,3)", q(c, "select student_id,course_id from enrollment where id<=4") == [(1, 1), (1, 2), (2, 1), (2, 3)])
check("enrollment 1 has two scores 88 and 91", q(c, "select point from score where enrollment_id=1 order by id") == [(88,), (91,)])
check("course 1 students = 김민준/이서연/최유나", q(c, "select s.name from enrollment e join student s on s.id=e.student_id where e.course_id=1 order by s.id") ==
      [("김민준",), ("이서연",), ("최유나",)])
check("student 15 has no enrollment, course 12 has none", q(c, "select count(*) from enrollment where student_id=15") == [(0,)] and
      q(c, "select count(*) from enrollment where course_id=12") == [(0,)])
c2 = fresh()
c2.execute("insert into subject(name) values ('음악')")
c2.execute("delete from subject where id=11")
c2.execute("insert into subject(name) values ('미술')")
check("rowid reuse after deleting last row (no AUTOINCREMENT)", q(c2, "select max(id) from subject") == [(11,)])
c0 = sqlite3.connect(":memory:")
c0.execute("create table t(id TEXT PRIMARY KEY, v)")
check("non-INTEGER PRIMARY KEY accepts NULL (SQLite quirk)", err(c0, "insert into t(id,v) values(NULL,1)") is None)

# --- Ch4 / V04 / V04b
c = fresh()
exp = [
    ("insert into enrollment(student_id,course_id,enrolled_at) values (999,1,'2026-01-01')", "FOREIGN KEY constraint failed"),
    ("delete from student where id=1", "FOREIGN KEY constraint failed"),
    ("insert into student(name,email,school,school_level,grade,joined_at) values ('x','minjun.kim@example.com','a','중등',1,'2026-01-01')", "UNIQUE constraint failed: student.email"),
    ("insert into score(enrollment_id,exam_date,point) values (1,'2026-01-01',150)", "CHECK constraint failed: point BETWEEN 0 AND 100"),
    ("insert into student(name,email,school,school_level,grade,joined_at) values (NULL,'n@e.com','a','중등',1,'2026-01-01')", "NOT NULL constraint failed: student.name"),
    ("insert into enrollment(student_id,course_id,enrolled_at) values (1,1,'2026-01-01')", "UNIQUE constraint failed: enrollment.student_id, enrollment.course_id"),
]
for sql, msg in exp:
    check("error message: " + msg, err(c, sql) == msg)
check("new connection default foreign_keys=0", q(sqlite3.connect(":memory:"), "pragma foreign_keys") == [(0,)])
d = tempfile.mkdtemp(); p = os.path.join(d, "t.db")
a = sqlite3.connect(p); a.execute("PRAGMA foreign_keys=ON"); a.execute("create table x(i)"); a.commit(); a.close()
check("PRAGMA is per-connection (new connection on same file = 0)", q(sqlite3.connect(p), "pragma foreign_keys") == [(0,)])
t = sqlite3.connect(":memory:", isolation_level=None); t.execute("BEGIN"); t.execute("PRAGMA foreign_keys=ON")
check("PRAGMA foreign_keys inside a transaction is ignored", q(t, "pragma foreign_keys") == [(0,)])
c = fresh(fk=False)
check("FK OFF: insert student 999 enrollment accepted", err(c, "insert into enrollment(student_id,course_id,enrolled_at) values (999,1,'2026-01-01')") is None)
check("FK OFF: enrollment 27 rows but student-enrollment INNER JOIN stays 26 (Ch6)",
      q(c, "select count(*) from enrollment") == [(27,)] and q(c, "select count(*) from student s join enrollment e on e.student_id=s.id") == [(26,)])
c.execute("PRAGMA foreign_keys=ON")
check("turning ON later leaves the bad row; foreign_key_check finds it", q(c, "select count(*) from enrollment where student_id=999") == [(1,)] and
      len(q(c, "pragma foreign_key_check")) == 1)

# --- Ch5
c = fresh()
check("Q01 = 배현우/이서연/최유나", [r[1] for r in q(c, "select id,name from student where school_level='중등' and grade=2 order by name")] == ["배현우", "이서연", "최유나"])
check("Q02 top5 = 98,97,95,94,93", [r[0] for r in q(c, "select point from score order by point desc limit 5")] == [98, 97, 95, 94, 93])
check("Q03 김% = 2 rows", [r[0] for r in q(c, "select name from student where name like '김%' order by id")] == ["김민준", "김서윤"])
check("Q04 = 10 rows", q(c, "select count(*) from (select 1 from score where exam_date >= '2026-10-01')") == [(10,)] or
      len(q(c, "select 1 from score where exam_date >= '2026-10-01'")) == 10)

# --- Ch6 / V06
check("students 13-15: INNER 2 rows, LEFT 3 rows with NULL",
      len(q(c, "select s.id from student s join enrollment e on e.student_id=s.id where s.id between 13 and 15")) == 2 and
      q(c, "select s.id,e.id from student s left join enrollment e on e.student_id=s.id where s.id between 13 and 15 order by s.id") == [(13, 25), (14, 26), (15, None)])
check("student-enrollment INNER 26 / LEFT 27", q(c, "select count(*) from student s join enrollment e on e.student_id=s.id") == [(26,)] and
      q(c, "select count(*) from student s left join enrollment e on e.student_id=s.id") == [(27,)])
check("courses 11/12: INNER 3 rows, LEFT 4 rows", len(q(c, "select 1 from course c join enrollment e on e.course_id=c.id where c.id in (11,12)")) == 3 and
      len(q(c, "select 1 from course c left join enrollment e on e.course_id=c.id where c.id in (11,12)")) == 4)
check("Q08 = 문태양 only; Q09 = 영어 회화 only", q(c, "select s.name from student s left join enrollment e on e.student_id=s.id where e.id is null") == [("문태양",)] and
      q(c, "select c.course_name from course c left join enrollment e on e.course_id=c.id join teacher t on t.id=c.teacher_id where e.id is null") == [("영어 회화",)])
check("Q08 with INNER JOIN -> 0 rows", q(c, "select s.id from student s join enrollment e on e.student_id=s.id where s.id=15") == [])
check("LEFT JOIN + WHERE e.course_id=11 drops 문태양 (3 students)", [r[0] for r in q(c, "select s.id from student s left join enrollment e on e.student_id=s.id where e.course_id=11 order by s.id")] == [5, 11, 14])
check("LEFT JOIN with ON ... AND course_id=11 keeps 13/15 as NULL",
      q(c, "select s.id,e.course_id from student s left join enrollment e on e.student_id=s.id and e.course_id=11 where s.id>=13 order by s.id") == [(13, None), (14, 11), (15, None)])
check("JOIN works without FK declared (educational a/b tables)", (lambda k: (k.executescript("create table a(id integer primary key,n text); create table b(id integer primary key,a_id integer,v text); insert into a values(1,'x'),(2,'y'); insert into b values(1,1,'p'),(2,1,'q'),(3,9,'orphan');"), q(k, "select a.n,b.v from a join b on b.a_id=a.id"))[1])(sqlite3.connect(":memory:")) == [("x", "p"), ("x", "q")])
check("Q07 without LIMIT = 30 rows", q(c, "select count(*) from score sc join enrollment e on e.id=sc.enrollment_id join student s on s.id=e.student_id join course c on c.id=e.course_id") == [(30,)])
blocks = re.split(r"(?m)^-- \[(Q\d+)\]", QUERIES)
by_q = {blocks[i]: "\n".join(l for l in blocks[i + 1].splitlines() if not l.lstrip().startswith("--")) for i in range(1, len(blocks), 2)}
check("LEFT JOIN appears only in Q08, Q09, Q10 of 03_queries.sql", sorted(k for k, v in by_q.items() if "LEFT JOIN" in v) == ["Q08", "Q09", "Q10"])
check("INNER JOIN appears in Q05,Q06,Q07,Q09,Q11,Q12,Q14", sorted(k for k, v in by_q.items() if "INNER JOIN" in v) == ["Q05", "Q06", "Q07", "Q09", "Q11", "Q12", "Q14"])

# --- Ch7 / V07
q10 = dict(q(c, "select c.course_name, count(e.id) from course c left join enrollment e on e.course_id=c.id group by c.id, c.course_name"))
check("Q10: 4 courses with 3, 7 with 2, 영어 회화 0", sorted(q10.values()) == [0] + [2] * 7 + [3] * 4 and q10["영어 회화"] == 0 and q10["파이썬 코딩 입문"] == 3 and q10["국어 문법 정리"] == 2)
check("COUNT(*)=1 vs COUNT(e.id)=0 for 영어 회화", q(c, "select count(*), count(e.id) from course c left join enrollment e on e.course_id=c.id where c.id=12 group by c.id") == [(1, 0)])
q11 = q(c, "select s.name, count(sc.id), round(avg(sc.point),1) from student s join enrollment e on e.student_id=s.id join score sc on sc.enrollment_id=e.id group by s.id, s.name having avg(sc.point) >= 80 order by 3 desc")
check("Q11 = 6 students 91.3/90.3/89.0/88.5/83.7/80.3", [r[2] for r in q11] == [91.3, 90.3, 89.0, 88.5, 83.7, 80.3])
check("14 students have scores", q(c, "select count(distinct e.student_id) from enrollment e join score sc on sc.enrollment_id=e.id") == [(14,)])
check("이서연 scores 95/81/98 avg 91.3", sorted(r[0] for r in q(c, "select sc.point from score sc join enrollment e on e.id=sc.enrollment_id where e.student_id=2")) == [81, 95, 98])
check("임건우 scores 93/66 avg 79.5; WHERE>=80 first gives 93.0", sorted(r[0] for r in q(c, "select sc.point from score sc join enrollment e on e.id=sc.enrollment_id where e.student_id=11")) == [66, 93] and
      q(c, "select round(avg(sc.point),1) from score sc join enrollment e on e.id=sc.enrollment_id where e.student_id=11 and sc.point>=80") == [(93.0,)])
check("홍지민 single score 89", [r[0] for r in q(c, "select sc.point from score sc join enrollment e on e.id=sc.enrollment_id where e.student_id=14")] == [89])
check("정도윤 avg is 80.33.. (rounded 80.3)", abs(q(c, "select avg(sc.point) from score sc join enrollment e on e.id=sc.enrollment_id where e.student_id=5")[0][0] - 80.3333333) < 1e-4)
check("Q12 박서준: 8 exams, total 668, avg 83.5", q(c, "select count(sc.id),sum(sc.point),round(avg(sc.point),1) from teacher t join course c on c.teacher_id=t.id join enrollment e on e.course_id=c.id join score sc on sc.enrollment_id=e.id where t.id=1") == [(8, 668, 83.5)])
check("Q13: 강남고4 새봄중4 한빛중4 해든고3", q(c, "select school,count(*) from student group by school order by 2 desc, 1") == [("강남고", 4), ("새봄중", 4), ("한빛중", 4), ("해든고", 3)])

# --- Ch8 / V08 / V08b
check("overall avg 80.0 over 30 scores; 16 above avg; an 80-point row exists",
      q(c, "select avg(point),count(*) from score") == [(80.0, 30)] and q(c, "select count(*) from score where point>(select avg(point) from score)") == [(16,)] and
      q(c, "select count(*) from score where point=80") == [(1,)])
c3 = fresh()
plan = lambda k, s: q(k, "EXPLAIN QUERY PLAN " + s)[0][3]
before = plan(c3, "select * from enrollment where student_id=5")
check("before CREATE INDEX: SEARCH via sqlite_autoindex_enrollment_1", "SEARCH enrollment USING INDEX sqlite_autoindex_enrollment_1 (student_id=?)" == before, before)
c3.execute("CREATE INDEX IF NOT EXISTS idx_enrollment_student_id ON enrollment (student_id)")
after = plan(c3, "select * from enrollment where student_id=5")
check("after CREATE INDEX: SEARCH via idx_enrollment_student_id", after == "SEARCH enrollment USING INDEX idx_enrollment_student_id (student_id=?)", after)
check("course_id / score.point / score.enrollment_id lookups are SCAN",
      plan(c3, "select * from enrollment where course_id=3") == "SCAN enrollment" and plan(c3, "select * from score where point>90") == "SCAN score" and
      plan(c3, "select * from score where enrollment_id=3") == "SCAN score")

# --- Ch9 / V09
c4 = fresh(); c4.execute("UPDATE score SET point=62 WHERE id=7")
check("Q16 before 58, one row", q(fresh(), "select point from score where id=7") == [(58,)] and c4.total_changes >= 1)
k = fresh(); n1 = k.execute("UPDATE score SET point = 0").rowcount
check("UPDATE without WHERE changes 30 rows to 0", n1 == 30 and q(k, "select min(point),max(point) from score") == [(0, 0)])
k = fresh(); n2 = k.execute("DELETE FROM score").rowcount
check("DELETE FROM score (no WHERE) deletes 30 rows, FK does not stop it", n2 == 30)
k = fresh()
check("DELETE FROM student (no WHERE) is refused by FK", err(k, "DELETE FROM student") == "FOREIGN KEY constraint failed")
k = fresh(fk=False); k.execute("DELETE FROM student WHERE id=1")
check("FK OFF: DELETE student 1 leaves 2 orphan enrollments", q(k, "select count(*) from enrollment where student_id=1") == [(2,)])
k = fresh()
a1 = k.execute("UPDATE score SET point = 62 WHERE id = 7").rowcount
d1 = k.execute("DELETE FROM student WHERE id = 15 AND id NOT IN (SELECT student_id FROM enrollment)").rowcount
a2 = k.execute("UPDATE score SET point = 62 WHERE id = 7").rowcount
d2 = k.execute("DELETE FROM student WHERE id = 15 AND id NOT IN (SELECT student_id FROM enrollment)").rowcount
check("Q16/Q17 first run 1/1 rows; second run 1/0 rows", (a1, d1, a2, d2) == (1, 1, 1, 0))
check("after Q17: students 14, Q08 empty, 새봄중 3", q(k, "select count(*) from student") == [(14,)] and
      q(k, "select s.id from student s left join enrollment e on e.student_id=s.id where e.id is null") == [] and
      dict(q(k, "select school,count(*) from student group by school"))["새봄중"] == 3)
check("enrollment.student_id is NOT NULL (NOT IN safe)", "student_id  INTEGER NOT NULL" in SCHEMA.replace("\t", " ") or "student_id INTEGER NOT NULL" in re.sub(r"[ ]+", " ", SCHEMA))

# --- Ch10: whole-pipeline reproduction on a temp copy
tmp = Path(tempfile.mkdtemp()) / "copy"
shutil.copytree(ROOT, tmp, ignore=shutil.ignore_patterns(".git", "*.db"))
proc = subprocess.run([sys.executable, "-I", str(tmp / "scripts" / "run_queries.py")], capture_output=True, cwd=tmp, env={**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8"})
check("scripts/run_queries.py runs on a temp copy", proc.returncode == 0, proc.stdout.decode("utf-8", "replace").strip()[:80])
mine = (tmp / "results" / "query_results.md").read_text(encoding="utf-8").replace("\r", "").splitlines()
orig = (ROOT / "results" / "query_results.md").read_text(encoding="utf-8").replace("\r", "").splitlines()
diff = [(i, a, b) for i, (a, b) in enumerate(zip(mine, orig)) if a != b]
only_notused = all("SEARCH enrollment USING INDEX idx_enrollment_student_id" in a and "SEARCH enrollment USING INDEX idx_enrollment_student_id" in b for _, a, b in diff)
check("regenerated results == original results (only Q15 'notused' may differ)", len(mine) == len(orig) and (not diff or only_notused), f"{len(diff)} differing line(s)")
check("original repo untouched (no .db created)", not (ROOT / "student_mgmt.db").exists())

bad = [r for r in results if not r[0]]
print(f"\n{len(results) - len(bad)}/{len(results)} checks passed")
sys.exit(1 if bad else 0)
