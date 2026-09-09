# 본과정 M11 기술용어 원천 추출

- 과정: 본과정
- 미션: M11 — 정보를 깔끔하게 정리하는 디지털 서랍장 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M11 — 정보를 깔끔하게 정리하는 디지털 서랍장 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e03808153837ed10693a8bf05?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| SQL | SQL | Database | language | 핵심 | 데이터 모델링·조회·수정 | 좋음 |
| relational database | Relational Database | Database | concept | 핵심 | 관계형 데이터 모델 | 좋음 |
| SQLite | SQLite | Database | DBMS | 핵심 | 로컬 DB 선택지 | 좋음 |
| MySQL | MySQL | Database | DBMS | 보조 | 로컬 DB 선택지 | 보통 |
| PostgreSQL | PostgreSQL | Database | DBMS | 보조 | 로컬 DB 선택지 | 보통 |
| H2 | H2 Database | Database | DBMS | 보조 | 로컬 DB 선택지 | 보통 |
| table | Table | Database | structure | 핵심 | 최소 4개 테이블 설계 | 좋음 |
| PK | Primary Key | Database | constraint/key | 핵심 | 각 테이블 기본키 | 좋음 |
| FK | Foreign Key | Database | constraint/key | 핵심 | 테이블 관계·무결성 | 좋음 |
| 1:N | One-to-Many Relationship | Database | relationship | 핵심 | 최소 2개 관계 | 좋음 |
| column type | Column Data Type | Database | schema | 핵심 | 의미에 맞는 타입 지정 | 보통 |
| NOT NULL | NOT NULL | Database | constraint | 핵심 | 필수값 제약 | 좋음 |
| UNIQUE | UNIQUE Constraint | Database | constraint | 핵심 | 중복 방지 제약 | 좋음 |
| data integrity | Data Integrity | Database | concept | 핵심 | FK 무결성 실제 동작 | 좋음 |
| INSERT | INSERT | Database/SQL | statement | 핵심 | 샘플 데이터 입력 | 불필요 |
| SELECT | SELECT | Database/SQL | statement | 핵심 | 기본 조회 | 불필요 |
| JOIN | JOIN | Database/SQL | operation | 핵심 | 테이블 관계 조회 | 좋음 |
| INNER JOIN | INNER JOIN | Database/SQL | join type | 핵심 | 최소 2개 요구 | 좋음 |
| LEFT JOIN | LEFT JOIN | Database/SQL | join type | 핵심 | 최소 1개 요구 | 좋음 |
| GROUP BY | GROUP BY | Database/SQL | clause | 핵심 | 집계 쿼리 | 좋음 |
| aggregate | Aggregate Function | Database/SQL | concept/function | 핵심 | 집계 3개 이상 | 좋음 |
| subquery | Subquery | Database/SQL | concept | 핵심 | 최소 1개 요구 | 좋음 |
| UPDATE | UPDATE | Database/SQL | statement | 핵심 | 데이터 수정 | 불필요 |
| DELETE | DELETE | Database/SQL | statement | 핵심 | 데이터 삭제 | 불필요 |
| INDEX | Database Index | Database | index | 핵심 | 최소 1개 요구 | 좋음 |
| ERD | Entity Relationship Diagram | Database | diagram | 보조 | 선택 제출물 | 좋음 |
| ORM | Object-Relational Mapping | Database/Programming | concept | 보조 | 후속 학습 연결 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| Schema | Database | 테이블·컬럼·키·제약의 전체 구조 | 좋음 |
| Cardinality | Database | 1:N 관계 이해 | 좋음 |
| Referential Integrity | Database | FK 무결성의 정확한 개념 | 좋음 |
| Query Execution | Database | SQL 실행 결과와 성능 이해 배경 | 보통 |
| Normalization | Database | 데이터 모델링 확장 배경 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| JPA | Database/Backend | 공식 설명에서 이후 ORM 학습 연결 | 좋음 |
| Transaction | Database | 여러 SQL 작업 일관성 확장 | 좋음 |
| Composite Key | Database | 키 설계 심화 | 보통 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 27
- required 개념 수: 5
- related 개념 수: 3
- 웹툰 우선 후보 예: SQL, relational database, SQLite, table, PK, FK, 1:N, NOT NULL, UNIQUE, data integrity
