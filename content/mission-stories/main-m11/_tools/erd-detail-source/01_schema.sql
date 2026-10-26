-- =====================================================================
-- 01_schema.sql : 학생 정보 관리 DB 스키마 (공부방 수업·성적 관리)
-- DB: SQLite 3 (로컬 파일 DB)
-- 실행 순서: 01_schema.sql -> 02_sample_data.sql -> 03_queries.sql
-- =====================================================================

-- [SQLite 전용] SQLite는 외래키 검사가 기본 OFF 이므로 반드시 켠다.
PRAGMA foreign_keys = ON;

-- 재실행을 위해 자식 테이블 -> 부모 테이블 순서로 삭제
DROP TABLE IF EXISTS score;
DROP TABLE IF EXISTS enrollment;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS subject;
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS student;

-- 학생
-- [SQLite 전용] INTEGER PRIMARY KEY 는 자동 증가 키로 동작한다.
CREATE TABLE student (
    id           INTEGER PRIMARY KEY,
    name         TEXT    NOT NULL,                      -- 이름 (필수)
    email        TEXT    NOT NULL UNIQUE,               -- 이메일 (중복 불가)
    school       TEXT    NOT NULL,                      -- 학교명
    school_level TEXT    NOT NULL
                 CHECK (school_level IN ('중등', '고등')),
    grade        INTEGER NOT NULL
                 CHECK (grade BETWEEN 1 AND 3),         -- 학년 (1~3)
    joined_at    DATE    NOT NULL                       -- 등록일
);

-- 강사
CREATE TABLE teacher (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    phone TEXT UNIQUE
);

-- 과목
CREATE TABLE subject (
    id   INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 수업 (과목 1 : N 수업, 강사 1 : N 수업)
CREATE TABLE course (
    id          INTEGER PRIMARY KEY,
    course_name TEXT    NOT NULL,
    subject_id  INTEGER NOT NULL,
    teacher_id  INTEGER NOT NULL,
    weekday     TEXT    NOT NULL
                CHECK (weekday IN ('월', '화', '수', '목', '금', '토')),
    FOREIGN KEY (subject_id) REFERENCES subject (id),
    FOREIGN KEY (teacher_id) REFERENCES teacher (id)
);

-- 수강 (학생 1 : N 수강, 수업 1 : N 수강)  => 학생 ↔ 수업 N:M 을 풀어 주는 연결 테이블
CREATE TABLE enrollment (
    id          INTEGER PRIMARY KEY,
    student_id  INTEGER NOT NULL,
    course_id   INTEGER NOT NULL,
    enrolled_at DATE    NOT NULL,
    UNIQUE (student_id, course_id),                     -- 같은 수업 중복 수강 방지
    FOREIGN KEY (student_id) REFERENCES student (id),
    FOREIGN KEY (course_id)  REFERENCES course (id)
);

-- 시험 점수 (수강 1 : N 점수)
CREATE TABLE score (
    id            INTEGER PRIMARY KEY,
    enrollment_id INTEGER NOT NULL,
    exam_date     DATE    NOT NULL,
    point         INTEGER NOT NULL
                  CHECK (point BETWEEN 0 AND 100),
    FOREIGN KEY (enrollment_id) REFERENCES enrollment (id)
);
