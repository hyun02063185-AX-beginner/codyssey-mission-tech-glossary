# B6-1 Mission Learning Guide — 콘텐츠 제작·QA 보고

- 작성일: 2026-10-18
- 브랜치: `content/b6-1-learning-guide-draft` (기준 `origin/main` `9f0e4b7`)
- 내부 식별자 / 예정 경로: `main-M11` / `#/missions/main-M11/guide` (**웹에는 연결하지 않음**)
- B6-1 원본 기준: [`Codyssey_B6-1`](https://github.com/hyun02063185-AX-beginner/Codyssey_B6-1) 커밋 `8b99440c830fddc6f78c1440cff8fa2591d47884` (2026-10-15)
- 상태: **로컬 커밋만 수행. 원격 Push 없음.** Owner 전달 후 GPT 독립 검토 대기.

## 1. 생성 파일

`content/mission-guides/main-m11/` (28개)

| 구분 | 파일 |
| --- | --- |
| 문서 | `README.md`, `scenario-v1.0.md`(작업 지시서 원문 보존), `instructor-notes.md` |
| 원고 10개 | `chapters/01-database-basics.md` · `02-data-modeling.md` · `03-keys-relations.md` · `04-data-integrity.md` · `05-sql-queries.md` · `06-sql-joins.md` · `07-group-aggregation.md` · `08-subquery-index.md` · `09-update-delete.md` · `10-database-overview.md` |
| SVG 15개 | 아래 3절. 모바일 14개 + PC용 1개 |

`reports/b6-1-content-qa/` — 이 보고서, 측정 JSON 4개(`svg-metrics` `chapter-metrics` `qa-content` `verify-sql-output`), 대표 미리보기 PNG 5개(약 220KB), 재현 도구 `tools/`(SVG 생성기·QA 스크립트). 전체 미리보기 PNG는 저장소 밖 `C:/Users/hyun0/b6-1-qa-archive/`에 보관했습니다.

## 2. Chapter별 핵심 개념

| 장 | 제목 | 핵심 개념 |
| --- | --- | --- |
| 1 | 엑셀로 적어도 되는데, 왜 데이터베이스를 만들까? | 엑셀과 DB의 차이(절대화하지 않음), DB·DBMS·SQLite·SQL의 구분, macOS `sqlite3` 경험(사실/해석 구분) |
| 2 | 어떤 표가 필요한지는 어떻게 정할까? | 표·행·열·스키마, ERD 읽기(`\|\|--o{`), 데이터 모델링은 정답이 하나가 아님, ERD는 요약 |
| 3 | 표와 표는 어떻게 이어질까? | PK/FK, 1:N, N:M과 연결 표 `enrollment`, 의도된 "짝 없는" 데이터(문태양·영어 회화) |
| 4 | 잘못된 데이터는 누가 막아 줄까? | 제약조건·무결성, 직접 확인한 거절 결과, SQLite 외래키 검사는 **연결별 설정** |
| 5 | 데이터베이스에게 어떻게 부탁할까? | SQL·Query·`SELECT/WHERE/ORDER BY/LIMIT/LIKE`, **SQL 문 / 터미널 명령 / 점 명령 / Python 스크립트** 구분 |
| 6 | 여러 표를 한 번에 보려면? | INNER/LEFT JOIN 실제 결과 차이, `IS NULL`, FK 없이도 JOIN 가능, 무결성이 깨지면 JOIN이 조용히 틀림 |
| 7 | 묶어서 계산하려면? | `GROUP BY`·`COUNT/SUM/AVG`, `WHERE`(묶기 전) vs `HAVING`(묶은 뒤), `COUNT(*)` vs `COUNT(열)` |
| 8 | 서브쿼리와 인덱스는 무엇이 다를까? | 서브쿼리=질문의 논리, 인덱스=찾는 방법, SCAN/SEARCH, 인덱스의 비용, 자동 색인과의 중복 |
| 9 | 고치고 지울 때는 어떻게 안전하게 할까? | `WHERE` 유무의 영향, 전·후 조회, 외래키가 막는 범위, `01_schema.sql`·`run_queries.py`의 삭제 동작 |
| 10 | 하나의 데이터베이스로 한 번에 설명하려면? | 문태양 한 명을 따라가는 통합 설명, 요구 vs B6-1 선택 표, JPA/ORM은 후속 학습(이번 미션 미사용) |

각 장 구성: **궁금증 → 일상 설명 → 용어 → 그림 → B6-1 사례 → 좋은 점과 한계 → 내 프로그램에 연결 → 요구와 B6-1의 선택 → 한 문장 정리** (모바일 읽기 구간) + 💻 직접 확인 + AI 질문. 자동 검사로 10개 장 모두의 절 순서와 "한 문장 정리"가 💻 절보다 앞에 있음을 확인했습니다.

## 3. SVG별 설명 대상과 모바일 측정

| 그림 | 파일 | 설명 대상 | viewBox | 최소 글자 | 표시 글자 크기 | 장 |
| --- | --- | --- | --- | --- | --- | --- |
| V01 | [`v01-database-basics.svg`](../../content/mission-guides/main-m11/assets/v01-database-basics.svg) | 엑셀 한 시트에서 반복되는 강사 이름(박서준 8행) ↔ `teacher`·`course` 표로 나누고 번호로 연결 | 360x864 | 18px | 14.4 / 16.4 / 17.9 (288/328/358px 폭) | 1장 |
| V01 보조 | [`v01-dbms-sqlite.svg`](../../content/mission-guides/main-m11/assets/v01-dbms-sqlite.svg) | SQL 요청 → DBMS(SQLite) → DB 파일, 서버형과 파일형 DBMS | 360x856 | 18px | 14.4 / 16.4 / 17.9 | 1장 |
| V02 | [`v02-data-modeling.svg`](../../content/mission-guides/main-m11/assets/v02-data-modeling.svg) | 6개 표와 1→N 관계 ERD | 360x972 | 18px | 14.4 / 16.4 / 17.9 | 2장 |
| V03 | [`v03-keys-relations.svg`](../../content/mission-guides/main-m11/assets/v03-keys-relations.svg) | `enrollment` 1행의 `student_id`·`course_id`가 `student`·`course`의 `id`를 가리키는 PK/FK, 1:N | 360x970 | 18px | 14.4 / 16.4 / 17.9 | 3장 |
| V03 보조 | [`v03-nm-junction.svg`](../../content/mission-guides/main-m11/assets/v03-nm-junction.svg) | 학생↔수업 N:M을 연결 표 `enrollment`(1~4행)로 푸는 모습 | 360x868 | 18px | 14.4 / 16.4 / 17.9 | 3장 |
| V04 | [`v04-data-integrity.svg`](../../content/mission-guides/main-m11/assets/v04-data-integrity.svg) | NOT NULL·UNIQUE·CHECK·FOREIGN KEY가 거절하는 5가지 실제 사례와 오류 메시지 | 360x936 | 18px | 14.4 / 16.4 / 17.9 | 4장 |
| V04 보조 | [`v04-fk-switch.svg`](../../content/mission-guides/main-m11/assets/v04-fk-switch.svg) | `PRAGMA foreign_keys`를 켠 연결(거절)과 켜지 않은 연결(저장됨) | 360x776 | 18px | 14.4 / 16.4 / 17.9 | 4장 |
| V05 | [`v05-sql-queries.svg`](../../content/mission-guides/main-m11/assets/v05-sql-queries.svg) | SQL → DBMS → 파일 → 결과 표 흐름, Q01 문장 해부, 15행→3행→이름순 | 360x1020 | 18px | 14.4 / 16.4 / 17.9 | 5장 |
| V06 | [`v06-sql-joins.svg`](../../content/mission-guides/main-m11/assets/v06-sql-joins.svg) | 학생 13~15번: INNER JOIN 2행(문태양 사라짐) vs LEFT JOIN 3행(`NULL`) | 360x946 | 18px | 14.4 / 16.4 / 17.9 | 6장 |
| V07 | [`v07-group-aggregation.svg`](../../content/mission-guides/main-m11/assets/v07-group-aggregation.svg) | Q10 수업별 COUNT(영어 회화 0)와 Q11 학생별 AVG·HAVING(임건우 79.5 탈락) | 360x996 | 18px | 14.4 / 16.4 / 17.9 | 7장 |
| V08 | [`v08-subquery.svg`](../../content/mission-guides/main-m11/assets/v08-subquery.svg) | Q14: 안쪽 `AVG(point)`=80.0이 먼저 → 바깥 `point > 80.0` → 16건 중 10건 표시 | 360x776 | 18px | 14.4 / 16.4 / 17.9 | 8장 |
| V08 보조 | [`v08-index.svg`](../../content/mission-guides/main-m11/assets/v08-index.svg) | SCAN vs SEARCH, 이 DB의 실제 실행 계획, 자동 색인 주의, 인덱스 비용 | 360x1048 | 18px | 14.4 / 16.4 / 17.9 | 8장 |
| V09 | [`v09-update-delete.svg`](../../content/mission-guides/main-m11/assets/v09-update-delete.svg) | 안전한 변경 5단계, `WHERE` 유무(1행 vs 30행), 외래키가 막는 범위 | 360x876 | 18px | 14.4 / 16.4 / 17.9 | 9장 |
| V10 | [`v10-database-overview.svg`](../../content/mission-guides/main-m11/assets/v10-database-overview.svg) | SQL 파일 3개 → 실행 2가지 → SQLite → 6개 표 → 결과 (모바일 세로형) | 360x970 | 18px | 14.4 / 16.4 / 17.9 | 10장 |
| V10 PC용 | [`v10-database-overview-wide.svg`](../../content/mission-guides/main-m11/assets/v10-database-overview-wide.svg) | 같은 구조 + 6개 표의 1→N + 질문 유형 Q01~Q17 + 결과 (PC 전용 전체 관계도) | 900x888 | 19px | 14.99 / 18.58 (710/880px 폭) | 10장 |

보조 그림 4개(V01·V03·V04·V08)는 "긴 그림을 한 화면에 밀어 넣지 않는다"는 기준에 따라 **나눈 것**입니다. 지시서가 예시로 든 Chapter 8 분리 외에 3개를 더 나눈 것이므로, 불필요하면 해당 보조 그림과 원고의 참조 문단을 함께 빼도 본문 흐름은 유지됩니다.

관계 정확성은 그림 속 모든 값을 원본 DB로 대조했습니다(예: V01의 88·95·83점, V03·V03 보조의 `enrollment` 1~4행, V06의 수강 행 25·26, V07의 점수 95·81·98 / 93·66 / 89, V08의 80.0·16건, V10의 행 수). 이 대조는 `verify-sql-output.txt`의 70개 항목에 포함됩니다.

## 4. 출처와 실제 SQL 연결 근거

- **원본 발췌 코드 블록 12개**는 모두 원본 파일(`sql/01_schema.sql` 4개, `sql/03_queries.sql` 8개)의 **실제 줄과 일치**함을 자동 검사했습니다(줄 공백을 정규화해 비교, 블록당 1~5줄). 각 블록 아래에 파일·쿼리 번호와 고정 커밋 링크가 있습니다.
- **교육용 예시 5개**는 "교육용 예시 — 원본 아님"을 명시했습니다. 모두 `SELECT`·`EXPLAIN`·거절되는 `INSERT`이며 데이터를 바꾸는 예는 없습니다. (장 4·6·7·8·9)
- 모든 B6-1 링크는 커밋 `8b99440…`에 고정했고, 경로가 실제 존재함을 확인했습니다. 외부 링크 2개(`sqlite.org/famous.html`, `sqlite.org/foreignkeys.html`)는 HTTP 200을 확인했습니다.
- **`[실행 확인]` 사실 70개**를 원본 SQL 파일로 다시 실행해 모두 일치했습니다: [`tools/verify_sql.py`](tools/verify_sql.py), 출력 [`verify-sql-output.txt`](verify-sql-output.txt). 새 연결의 FK 기본값, 연결별 PRAGMA, 거절 메시지 6종, JOIN 건수, HAVING 예, 인덱스 실행 계획(만들기 전·후), `WHERE` 없는 `UPDATE`/`DELETE`의 영향, 전체 파이프라인 재생성이 포함됩니다. 원본 저장소는 읽기 전용(임시 폴더 사본)으로만 실행했고 어떤 파일도 바꾸지 않았습니다.
- **원본 결과 문서와의 일치**: 새 DB에서 `run_queries.py`를 다시 실행해 `results/query_results.md`와 비교했을 때 17개 쿼리 결과는 모두 같았고, 차이는 Q15 실행 계획 표의 `notused` 열 값(원본 0, 이번 62) 한 칸뿐이었습니다(SQLite 버전 차이).
- 요구는 `[요구 정리]`로 표시했고 **원본 미션 문서는 직접 확인하지 못했습니다.** 근거 수준은 README의 "근거의 수준" 표에 있습니다. Notion 정리본의 "현재 상태: 미착수"는 과거 기록이라 사용하지 않았습니다.

### 근거 태그 분포 (장별: 요구 / B6-1 사례 / 학습 노트 / 실행 확인 / 개념 / 보충)

| 장 | 태그 사용 횟수 | 모바일 읽기 구간(글자) | 전체(글자) |
| --- | --- | --- | --- |
| 01 | 3 / 5 / 8 / 4 / 3 / 2 | 5,029 | 5,801 |
| 02 | 2 / 2 / 7 / 2 / 2 / 2 | 5,343 | 5,823 |
| 03 | 1 / 4 / 1 / 3 / 2 / 2 | 5,519 | 6,001 |
| 04 | 3 / 5 / 4 / 3 / 2 / 1 | 5,659 | 6,346 |
| 05 | 2 / 5 / 10 / 3 / 5 / 1 | 6,894 | 7,401 |
| 06 | 1 / 4 / 5 / 4 / 2 / 1 | 5,267 | 5,791 |
| 07 | 1 / 4 / 0 / 4 / 4 / 1 | 4,754 | 5,310 |
| 08 | 2 / 3 / 3 / 6 / 1 / 2 | 5,374 | 5,934 |
| 09 | 2 / 4 / 2 / 3 / 3 / 2 | 5,324 | 5,947 |
| 10 | 4 / 3 / 7 / 2 / 1 / 2 | 7,147 | 7,783 |

미정의 태그와 `[공식]` 태그는 없음을 자동 검사로 확인했습니다. 7장은 학습 노트에 GROUP BY 전용 장이 없어 `[학습 노트]`가 0입니다.

### 기술용어 링크

원고가 링크한 사전 항목 **37개가 모두 `content/terms/`에 존재**하고 README 목록과 일치합니다. 사전 본문과 canonical 데이터는 수정하지 않았습니다.

## 5. 모바일 가독성 검증

**방법**: Windows 11, Playwright Chromium, DPR 1~2, 글꼴 Noto Sans KR(설치 글꼴). 서비스 UI가 아직 없으므로 본문 폭은 B2-1 검증 값(320/360/390px 화면 → 288/328/358px, PC 1024px → 710px)을 사용했고, 그림은 `<img>`로 같은 폭에 렌더링해 글자의 **실제 표시 크기 = SVG 글자 크기 × 표시 폭 / viewBox 폭**으로 계산했습니다. 장 본문은 B2-1 viewer와 같은 `react-markdown`+`remark-gfm`으로 렌더링한 뒤 앱 CSS를 근사한 임시 스타일에 넣어 측정했습니다.

**SVG 15개 전부 통과** (`svg-metrics.json`):
- 모든 `<text>`의 글자 크기가 모바일 18px 이상, PC용 19px 이상 → 모바일 최소 **14.4px(320) / 16.4px(360) / 17.9px(390)**, PC용 **14.99px(1024px 화면, 본문 710px)**. 지시된 기준(13px 이상, 360px에서 15px 이상)을 충족합니다.
- 글자가 자신의 상자를 벗어남 0건, 글자끼리 겹침 0건, 선이 글자를 가로지름 0건. 다른 글꼴(Apple SD Gothic Neo, Malgun Gothic 등)의 폭 차이를 고려해 **측정 폭에 6% 여유**를 두고 검사했습니다.
- 모든 SVG를 320/360/390px(모바일)과 710·880px(PC용)로 렌더링해 **눈으로 직접 확인**했습니다. 문제를 발견해 수정한 사례: V01 라벨이 캔버스를 벗어나고 길이가 1,190으로 길었던 점(V01을 두 장으로 분리), V03 헤더와 표의 겹침, V03 화살표가 FK 칸이 아닌 행 가장자리에서 출발하던 점(칸 안에 같은 번호 표식 추가), PC용 관계도의 오른쪽 잘림과 라벨 겹침(구조 재작성).
- 색만으로 구분하지 않았습니다. ✓·✕·⚠는 **그려진 도형 + 글자 라벨**, 관계는 번호·점선/실선·`1`/`N` 글자와 함께 표현했습니다. ✓·✕·번호는 글리프가 아니라 도형이라 기기별 이모지 차이가 없습니다. 모든 그림에 자체 배경이 있습니다.

**장 렌더링 측정** (10개 장, `chapter-metrics.json`):

| 화면 폭 | 가로 넘침(페이지) | 가로 스크롤이 필요한 표 | 가로 스크롤이 필요한 코드 | 그림의 최소 표시 글자 | 가장 긴 페이지 |
| --- | --- | --- | --- | --- | --- |
| 320px | 0 | 0 / 24 | 9 / 20 | 14.4px | 12781px |
| 360px | 0 | 0 / 24 | 4 / 20 | 16.4px | 11753px |
| 390px | 0 | 0 / 24 | 2 / 20 | 17.9px | 10947px |
| 1024px | 0 | 0 / 24 | 0 / 20 | 14.99px | 8101px |

- 모든 표는 **4열 이하**이며 320px에서도 가로 스크롤 없이 들어갑니다.
- 가로 스크롤이 필요한 코드는 **원본 줄을 그대로 옮긴 발췌**(예: `CREATE INDEX IF NOT EXISTS …` 80자)와 터미널 명령입니다. 원본 그대로 보여 주기 위해 줄을 바꾸지 않았습니다. 교육용 예시는 줄을 나누어 스크롤이 생기지 않게 했습니다.
- 모든 장에서 이미지가 정상 로드되고 PC(1024px)에서는 PC용 그림이 선택됩니다. 대표 미리보기: [`previews/`](previews/) (320px V03·V06, 360px V07, 390px V10, 1024px V10 PC용).
- **"모바일만 읽어도 이해되는가"**: 각 장의 "한 문장 정리"까지가 4,754~7,147자(모바일 읽기 구간)입니다. 이 구간만으로 질문 → 개념 → 그림 → 실제 사례 → 한계 → 연결 → 한 문장이 모두 완결됩니다. 다만 실제 교육생이 이해하는지는 **사용성 검증을 하지 않았습니다.**

## 6. 학습 노트의 질문·경험 반영

`docs/mission_study.md`(학습 노트 7개 장)의 반영 위치입니다.

| 노트 | 반영 장 |
| --- | --- |
| 1장 ERD 한눈에 보기 (ERD·기호·N:M을 `enrollment`로) | 2장, 3장 |
| 2장 SQL이란 / 장단점 / 엑셀 비교 | 1장, 5장 |
| 3장 쿼리 종류별 역할 | 5~9장 |
| 4장 INNER vs LEFT JOIN | 6장 |
| 5장 PK/FK·무결성·엑셀과 DB 차이·직접 실행한 검증표 | 1·3·4장 |
| 6장 SQLite·macOS 기본 탑재·`PRAGMA`·실행 방법 2가지·터미널 명령 vs SQL | 1·4·5·10장 |
| 7장 JPA/ORM과 제외된 범위 | 10장 (9장의 트랜잭션 언급) |

지시서가 "반드시 살릴" 10가지 경험은 모두 반영했습니다: 엑셀 vs DB(1장), N:M→`enrollment`(3장), 짝 없는 학생·수업(3·6·10장), INNER/LEFT 결과 차이(6장), PK/FK·무결성 검증(3·4장), 연결별 FK 설정(4장), macOS 경험(1장), SQL vs 터미널 명령(5장), SQLite vs Python 보조 스크립트(5·10장), JPA/ORM 연결(10장). **확인하지 못한 사용자 발언이나 시행착오는 만들지 않았고**, 노트에 없는 질문은 `[학습 노트]` 태그를 붙이지 않았습니다.

## 7. 공식 요구와 구현 선택의 구분

각 장의 "요구와 B6-1의 선택" 절과 10장의 대응 표에서 구분했습니다. 예: 요구(정리본) — 표 4개 이상, FK 2개 이상, 쿼리 15개 이상(조회 4+·JOIN 4+·집계 3+·서브쿼리 1+·UPDATE/DELETE 2+·INDEX 1+), INNER 2+·LEFT 1+. **B6-1의 선택** — SQLite, 6개 표, 연결 표 `enrollment`, FK 5개, `CHECK` 제약, 의도된 "짝 없는" 데이터, 17개 쿼리 배분, `HAVING` 사용, Python 보조 스크립트, 인덱스 대상 열.

## 8. 기술적으로 주의가 필요한 항목

1. **Q15 인덱스가 이 스키마에서는 중복에 가깝습니다.** `UNIQUE (student_id, course_id)`가 만든 자동 색인 `sqlite_autoindex_enrollment_1`이 `student_id` 첫 열이라, `CREATE INDEX` **이전에도** `SEARCH … USING INDEX`입니다(실행 확인). B6-1의 오류로 서술하지 않고 8장에서 "인덱스가 항상 이득은 아니다"의 실제 사례로 다뤘습니다. 요구(INDEX 1개)는 충족합니다. B6-1 README·노트의 "FK 컬럼에 인덱스를 두면 빨라진다"에는 조건을 덧붙였습니다.
2. **`01_schema.sql`과 `run_queries.py`는 파괴적입니다.** 전자는 6개 표를 `DROP`하고, 후자는 같은 이름의 `student_mgmt.db`를 삭제합니다. 원고에서 연습용 DB·복사본에서만 실행하도록 5·9장과 💻 절, README, 강사용 노트에 반복해서 안내했습니다.
3. **외래키 검사는 연결별 설정**입니다(새 연결 기본 0, 같은 파일의 다른 연결도 0, 트랜잭션 안에서는 무시, 켜기 전 잘못된 행은 남고 `foreign_key_check`로 발견).
4. **JOIN에 FK 선언은 필수가 아닙니다.** FK가 꺼져 고아 행이 생기면 INNER JOIN은 오류 없이 그 행을 빼서 결과가 조용히 틀립니다(수강 27행 vs JOIN 26행).
5. **`WHERE` 없는 `DELETE`는 마지막 자식 표(`score`)에서는 외래키가 막지 못합니다**(30행 삭제 확인).
6. **B6-1 원본 문서 안의 불일치**: JOIN 개수(README "INNER 3 / LEFT 2" vs 쿼리 파일 "INNER 4 / LEFT 2"), 노트 3장 "쿼리 15개"(실제 17), 노트 5장 "김민준 2명"(샘플은 1명), 스키마 주석 "INTEGER PRIMARY KEY는 자동 증가 키"(`AUTOINCREMENT`가 없어 번호가 재사용될 수 있음), `EXPLAIN` 결과의 `notused` 값(버전 의존). 원고는 실제 데이터와 실행 결과를 따랐고 강사용 노트에 표로 정리했습니다.
7. **SQLite 특성**: `DATE` 열도 값은 text로 저장, 정수가 아닌 PK는 `NULL`을 허용하는 역사적 예외, `GROUP BY`의 너그러움. 일반 규칙과 SQLite 예외를 구분해 설명했습니다(강사용 노트).
8. **제출물 형식 확인 필요**: 정리본은 "실행 결과 캡처 폴더 1개"를 제출물로 적는데 B6-1은 결과를 `results/query_results.md` 텍스트로 남겼습니다. 정리본이 "스크린샷 또는 텍스트"를 허용하므로 충돌은 아니지만 원본 미션 문서·운영진 확인이 필요합니다.
9. **JPA와 SQLAlchemy는 다름**: 후속 미션(B6-2·B6-3)의 ORM이 SQLAlchemy라는 내용은 Notion 정리본에서 왔고, 정리본은 B6-1을 필수 선행으로 직접 지정하지 않는다고 적고 있습니다. JPA/ORM은 10장에서 후속 학습으로만 다뤘습니다.

## 9. 수행하지 못한 것과 한계

- **원본 미션 문서**를 직접 확인하지 못했습니다(요구 수치·제출 형식은 Notion 정리본 기준).
- **실기기 검증 없음**: iOS Safari·Android 실기기를 쓰지 않았습니다. Windows Chromium(Noto Sans KR)에서 측정했고 6% 폭 여유로 다른 글꼴을 대비했습니다. Owner의 실제 모바일 확인이 최종 단계입니다.
- **macOS `sqlite3` CLI 미확인**: 노트 기록(3.43.2)은 `[학습 노트]`로 인용했습니다. 제작 PC(Windows)에는 `sqlite3` 명령이 없어 Python `sqlite3` 모듈(SQLite 3.50.4)로 확인했습니다. PowerShell의 `<` 오류는 확인했지만 `.read` 대안은 실행해 보지 못했습니다.
- **학습자 대상 사용성 검증 없음**: 설명 수준은 Owner가 강의 경험에 맞춰 조정해야 합니다.
- 원고는 한국어 합니다체이며 맞춤법 검사기를 별도로 돌리지는 않았습니다.

### 웹 통합 단계(Codex)를 위한 메모 — 이번 작업에서는 코드를 바꾸지 않았습니다

- B2-1 viewer는 `v09-…-overview.svg`를 PC에서 `-wide.svg`로 **교체**하면서, 장에 따로 넣은 `-wide.svg` 그림도 **한 번 더** 보여 줍니다. 10장에서 같은 방식을 쓰면 PC에서 PC용 그림이 두 번 나옵니다(렌더링 확인). 하나를 숨길지 통합 단계에서 결정이 필요합니다.
- 모바일 그림은 `width="360"`입니다. PC에서 과도하게 커지지 않도록 **최대 폭 약 420px**를 권장합니다. 1024px 미만에서 PC용 그림은 숨기고 모바일 그림을 쓰는 B2-1 방식과 맞습니다.
- 파일명은 B2-1 viewer의 규칙(`chapters/NN-*.md` 제목 `# …`, `assets/` 평면 구조, `v10-…-overview.svg` + `-wide.svg`)을 따랐습니다. 장 제목이 첫 `#` 줄이고, 관련 용어는 `../../../terms/*.md` 링크 형식입니다.
- 모든 코드 블록 아래에는 이탤릭 캡션(출처 또는 "교육용 예시")이 있고, 원고에 원시 HTML은 없습니다.

## 10. 재현 방법

저장소 루트에서 실행합니다(`node_modules`와 Playwright Chromium 필요). B6-1 저장소는 `Codyssey_B6-1`을 `8b99440` 기준으로 받아 둡니다.

```text
# SVG 재생성(커밋된 파일과 바이트 단위로 동일해야 함)
python -I reports/b6-1-content-qa/tools/build.py <출력 폴더>

# SVG 실측 검사 (글자 크기·넘침·겹침·선 교차) + 미리보기
node reports/b6-1-content-qa/tools/qa_svg.mjs content/mission-guides/main-m11/assets <출력 폴더> --shots

# 장 렌더링 측정 (320/360/390/1024px)
node reports/b6-1-content-qa/tools/render_chapters.mjs content/mission-guides/main-m11 <출력 폴더> reports/b6-1-content-qa/svg-metrics.json

# [실행 확인] 70개 사실 재검증 (원본 저장소는 수정하지 않음)
python -I reports/b6-1-content-qa/tools/verify_sql.py <Codyssey_B6-1 경로>

# 구조·링크·원본 발췌·태그 검사
python -I reports/b6-1-content-qa/tools/qa_content.py . <Codyssey_B6-1 경로> out.json --net
```

SVG 생성기(`svgkit.py`, `figs_*.py`)는 글자를 18px 이상으로 강제하고(`assert`), ✓·✕·번호를 도형으로 그립니다.

## 11. 범위 준수

`origin/main` 대비 변경은 `content/mission-guides/main-m11/`와 `reports/b6-1-content-qa/`뿐입니다. React UI·라우트·canonical 데이터·기술용어사전 본문·B1-1/B2-1 원고와 SVG·B6-1 원본 저장소는 변경하지 않았습니다. 웹 공개·배포·원격 Push는 하지 않았습니다.
