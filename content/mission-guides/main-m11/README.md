# B6-1 학습 가이드 — AI로 만든 SQL 데이터베이스, 이제 내가 이해하고 설명하기

> 미션: **B6-1 — 정보를 깔끔하게 정리하는 디지털 서랍장 만들기** (내부 식별자 `main-M11`, 예정 경로 `#/missions/main-M11/guide`)
> 상태: **콘텐츠 최종 QA 완료·웹 경로 연결** · 10개 장 + SVG 15종(V01~V10, 보조 4종·PC용 1종 포함) · **Owner 실기기 확인 전**
> 검증 기록: [reports/b6-1-content-qa/REPORT.md](../../../reports/b6-1-content-qa/REPORT.md)
> 제작 기준 문서(내부용): [scenario-v1.0.md](scenario-v1.0.md)

---

## 이 가이드는 무엇을 위한 것인가

AI의 도움으로 SQL 데이터베이스를 만들었지만, **그 안의 구조와 원리를 말로 설명하기는 아직 어려운** 성인 교육생을 위한 해설서입니다. 법학·어문학·산업공학 등 전공이 달라도 처음 배우는 개념을 하나씩 쌓을 수 있도록, 일상의 질문과 그림으로 시작합니다.

목표는 **SQL 문법 암기도, 코드 리뷰도 아닙니다.** 내가 만든 데이터베이스가 **어떤 구조로 데이터를 나누어 담고, 어떤 규칙으로 지키며, 어떻게 질문에 답하는지**를 자신의 말로 다른 사람에게 설명하는 것입니다.

| 하는 것 | 하지 않는 것 |
| --- | --- |
| 개념의 **역할과 연결**을 이해하고, 내 프로젝트에서 **근거를 찾기** | SQL 문법 암기, 처음부터 코딩하는 방법 가르치기 |
| 실제 B6-1 결과물(표 6개, 쿼리 17개)을 **교육 사례**로 쓰기 | B6-1의 구현을 **모두가 따라야 하는 정답**으로 제시하기 |
| 요구와 구현 선택을 **구분**하고, 확인하지 못한 것은 **밝히기** | 확인하지 못한 학습자의 발언·시행착오를 만들어 내기 |

**대상** 프로그래밍 경험이 거의 없고, AI를 활용해 B6-1을 수행한 코디세이 교육생
**쓰는 사람** 학습자(각 장), 강사(`instructor-notes.md`)

---

## 읽는 방법

한 장의 글이 **모바일에서는 핵심 이해**, **PC에서는 직접 확인**으로 이어지도록 구성했습니다. 별도의 모바일용·PC용 원고는 없습니다.

| | 이렇게 읽으세요 |
| --- | --- |
| 📱 **모바일** | 각 장의 **질문 → 일상 설명 → 용어 → 그림 → B6-1 사례 → 좋은 점과 한계 → 내 프로그램에 연결하기 → 한 문장 정리**까지 읽습니다. 이것만으로 장의 핵심을 이해할 수 있습니다 |
| 💻 **PC** | 뒤쪽의 **💻 직접 확인해 보기**와 **AI에게 물어볼 질문**을 읽으며 내 프로젝트의 파일·쿼리를 직접 찾아봅니다. 10장에는 **PC용 전체 관계도**가 있습니다 |

각 장의 흐름입니다.

**궁금증 → 일상적인 설명 → 용어 뜻 → 그림 → B6-1 실제 사례 → 좋은 점과 한계 → 내 프로그램에 연결 → 요구와 B6-1의 선택 → 설명할 수 있는 한 문장**

## 목차

| 장 | 제목 | 이 장의 질문 | 시각 자료 |
| --- | --- | --- | --- |
| [Chapter 1](chapters/01-database-basics.md) | 엑셀로 적어도 되는데, 왜 데이터베이스를 만들까? | 엑셀 파일과 `student_mgmt.db`는 무엇이 다를까? | [V01](assets/v01-database-basics.svg) 엑셀 vs 표 나누기 · [보조](assets/v01-dbms-sqlite.svg) DB·DBMS·SQLite |
| [Chapter 2](chapters/02-data-modeling.md) | 어떤 표가 필요한지는 어떻게 정할까? | 표·스키마·ERD는 무엇이고 어떻게 읽을까? | [V02](assets/v02-data-modeling.svg) 6개 표 ERD |
| [Chapter 3](chapters/03-keys-relations.md) | 표와 표는 어떻게 이어질까? | 왜 `enrollment`라는 연결 표가 있을까? | [V03](assets/v03-keys-relations.svg) PK·FK · [보조](assets/v03-nm-junction.svg) N:M 해소 |
| [Chapter 4](chapters/04-data-integrity.md) | 잘못된 데이터는 누가 막아 줄까? | 150점이나 없는 학생 번호는 어떻게 거절될까? | [V04](assets/v04-data-integrity.svg) 검문소 · [보조](assets/v04-fk-switch.svg) 연결별 FK 스위치 |
| [Chapter 5](chapters/05-sql-queries.md) | 데이터베이스에게 어떻게 부탁할까? | 이 줄은 SQL일까, 터미널 명령일까? | [V05](assets/v05-sql-queries.svg) SQL이 결과가 되기까지 |
| [Chapter 6](chapters/06-sql-joins.md) | 여러 표를 한 번에 보려면? | 문태양은 왜 INNER JOIN에서 사라질까? | [V06](assets/v06-sql-joins.svg) INNER vs LEFT |
| [Chapter 7](chapters/07-group-aggregation.md) | 묶어서 계산하려면? | WHERE와 HAVING은 무엇이 다를까? | [V07](assets/v07-group-aggregation.svg) 묶기와 거르기 |
| [Chapter 8](chapters/08-subquery-index.md) | 서브쿼리와 인덱스는 무엇이 다를까? | 인덱스를 만들면 항상 빨라질까? | [V08](assets/v08-subquery.svg) 서브쿼리 · [보조](assets/v08-index.svg) 인덱스 |
| [Chapter 9](chapters/09-update-delete.md) | 고치고 지울 때는 어떻게 안전하게 할까? | WHERE를 빼먹으면 무슨 일이 생길까? | [V09](assets/v09-update-delete.svg) 안전한 변경 |
| [Chapter 10](chapters/10-database-overview.md) | 하나의 데이터베이스로 한 번에 설명하려면? | 3분 안에 어떻게 이어서 설명할까? JPA/ORM과는? | [V10](assets/v10-database-overview.svg) 전체 구조 · [PC용](assets/v10-database-overview-wide.svg) 전체 관계도 |

> **앞뒤 장의 연결** — 표를 나눈 이유(1장)가 ERD(2장)로, 번호로 가리키는 FK(3장)가 제약조건과 `PRAGMA`(4장)로, 그 데이터를 묻는 SQL(5장)이 JOIN(6장)·집계(7장)·서브쿼리와 인덱스(8장)로, 마지막에 데이터를 바꾸는 일(9장)로 이어집니다. 10장은 **문태양 한 사람**을 따라가며 이 모든 조각을 하나로 모읍니다.

---

## 표기 규칙

### 근거 태그

원고의 주장이 **어디서 왔는지** 구분합니다. 근거 없이 경험을 만들어 내지 않습니다.

| 태그 | 뜻 |
| --- | --- |
| `[요구 정리]` | B6-1 **미션 요구사항**에 대한 정리. 아래 "근거의 수준"을 반드시 함께 읽으세요 |
| `[B6-1 사례]` | **실제 B6-1 결과물**(저장소 [Codyssey_B6-1](https://github.com/hyun02063185-AX-beginner/Codyssey_B6-1), 커밋 `8b99440`)의 파일·쿼리에서 확인된 구현. **모두가 따라야 하는 정답이 아닙니다** |
| `[학습 노트]` | 교육생이 B6-1을 진행하며 정리한 Claude 학습 노트([`docs/mission_study.md`](https://github.com/hyun02063185-AX-beginner/Codyssey_B6-1/blob/8b99440c830fddc6f78c1440cff8fa2591d47884/docs/mission_study.md))의 질문·정리 |
| `[실행 확인]` | 이 가이드를 만들면서 B6-1의 SQL 파일을 **직접 실행해** 확인한 것 (SQLite 3.50.4, Python 3.14의 `sqlite3` 모듈, 연습용 메모리 DB) |
| `[개념]` | 데이터베이스·SQL 분야에서 널리 쓰이는 일반 개념 |
| `[보충]` | 이해를 돕기 위해 덧붙인 비유·단순화·교육용 활동. 실제 구조와 1:1이 아닐 수 있습니다 |

### 근거의 수준 — 요구사항은 어디까지 확인했나

| 자료 | 확인 여부와 성격 |
| --- | --- |
| **원본 미션 문서**(코디세이) | **직접 확인하지 못했습니다.** 이 가이드의 `[요구 정리]`는 원문을 대조한 것이 아닙니다 |
| 저장소 `data/raw/main/m11/` | 원본 미션 페이지를 2026-09-09에 추출한 **raw(미정제) 자료**. 용어 중심이며 요구 수치는 거의 없습니다 |
| Notion 「B6-1 — 정보를 깔끔하게 정리하는 디지털 서랍장 만들기」 | 사용자가 관리하는 **요구사항 정리본**(마지막 수정 2026-10-02). `[요구 정리]`의 숫자(표 4개, FK 2개, 쿼리 15개 등)는 이 정리본에서 왔습니다. 정리본의 **"현재 상태: 미착수"는 과거 기록**이므로 사용하지 않았고, 진행 상태는 GitHub 결과물을 따랐습니다 |
| B6-1 GitHub 결과물 | 커밋 `8b99440`(2026-10-15) 기준 실제 파일. **현재 상태의 기준**입니다 |

공식 요구와 B6-1의 구현 선택은 **다른 것**입니다. 예를 들어 "표 4개 이상"은 요구이고, "공부방 주제의 6개 표"와 "연결 표 `enrollment`"는 B6-1의 선택입니다. 각 장의 **"요구와 B6-1의 선택"** 절에서 구분해 두었습니다.

### 코드와 그림의 종류

| 표시 | 뜻 |
| --- | --- |
| **원본 발췌** | B6-1 저장소의 파일에서 **그대로 가져온** 3~6줄. 출처 파일과 쿼리 번호를 코드 아래에 적었습니다. 긴 코드는 원본 저장소에서 읽습니다 |
| **교육용 예시** | 개념을 보여 주려고 **새로 쓴** 코드·표. B6-1 파일에 없는 내용이며 코드 아래에 "교육용 예시 — 원본 아님"이라고 적었습니다 |
| **교육용 단순화 모델** | 실제 동작을 이해하기 쉽게 줄여 그린 그림 (예: V05의 처리 흐름, V08 보조의 네모 10개) |

> 위험한 예제는 **연습용 복사본에서만** 하도록 각 장의 💻 절에 표시했습니다. 특히 B6-1의 `01_schema.sql`은 첫머리에서 **기존 표를 삭제**하고, `scripts/run_queries.py`는 같은 이름의 `student_mgmt.db`를 **삭제하고 다시 만듭니다.** 이미 데이터가 있는 DB에 무심코 실행하지 않도록 안내했습니다. (5·9장)

### 시각 자료의 선과 표시

| 선·표시 | 뜻 | 쓰는 그림 |
| --- | --- | --- |
| 실선 화살표 | **처리·전달 순서** 또는 **부모 → 자식(1 → N)** 관계 (그림 안 `1`·`N` 글자와 번호로 구분) | V01, V02, V03 보조, V04~V10 |
| 점선 화살표 | 번호로 **가리킴**(FK) 또는 **읽고 쓰는** 관계. 실행 순서가 아님 | V01, V03, V10 PC용 |
| 번호 ①②③ (둥근 번호) | 읽는 순서 또는 처리 순서 | V03, V05~V10 |
| ✓ / ✕ / ⚠ (그려진 아이콘) | 통과 / 거절·사라짐 / 위험·주의. **글자(통과·거절 등)와 함께** 쓰며 색만으로 구분하지 않음 | V04~V09 |
| `PK` `FK` 배지 | 기본키 / 외래키 열 | V02, V03 |

---

## 시각 자료 설계 기준 (모바일 우선)

- **모바일 그림** 14종은 폭 360(viewBox) 기준으로 **모든 글자를 18px 이상**으로 설계했습니다. 본문 폭이 288/328/358px(320/360/390px 화면, 좌우 여백 16px 가정)일 때 실제 표시 글자는 최소 **14.4 / 16.4 / 17.9px**입니다.
- **PC용 전체 관계도**(V10 PC용)는 폭 900 기준 **19px 이상**이며, 본문 폭 710px(1024px 화면)에서 최소 약 **15.0px**입니다.
- 긴 그림을 한 장에 억지로 넣지 않고 **보조 그림으로 나누었습니다.** (V01·V03·V04·V08)
- 모든 그림은 **자체 배경**이 있어 어두운 화면 설정에서도 읽힙니다. ✓·✕·번호는 글자 폰트가 아니라 **그려진 도형**이라 기기마다 모양이 다르지 않습니다.
- 모바일 그림은 `width="360"`으로 선언되어 있습니다. 웹 화면에서 일반 그림은 **최대 폭 420px**로 표시하고, 10장의 PC 관계도는 넓은 화면에서 교체해 보여 줍니다.

## 폴더 구성

```
content/mission-guides/main-m11/
├─ README.md                      이 문서
├─ scenario-v1.0.md               작업 지시서 원문 보존본 (수정하지 않음)
├─ instructor-notes.md            강사용 설명·정확성 메모
├─ chapters/
│   ├─ 01-database-basics.md
│   ├─ 02-data-modeling.md
│   ├─ 03-keys-relations.md
│   ├─ 04-data-integrity.md
│   ├─ 05-sql-queries.md
│   ├─ 06-sql-joins.md
│   ├─ 07-group-aggregation.md
│   ├─ 08-subquery-index.md
│   ├─ 09-update-delete.md
│   └─ 10-database-overview.md    전체 통합 (V10)
└─ assets/
    ├─ v01-database-basics.svg    V01
    ├─ v01-dbms-sqlite.svg        V01 보조
    ├─ v02-data-modeling.svg      V02
    ├─ v03-keys-relations.svg     V03
    ├─ v03-nm-junction.svg        V03 보조
    ├─ v04-data-integrity.svg     V04
    ├─ v04-fk-switch.svg          V04 보조
    ├─ v05-sql-queries.svg        V05
    ├─ v06-sql-joins.svg          V06
    ├─ v07-group-aggregation.svg  V07
    ├─ v08-subquery.svg           V08
    ├─ v08-index.svg              V08 보조
    ├─ v09-update-delete.svg      V09
    ├─ v10-database-overview.svg       V10 모바일용 세로형
    └─ v10-database-overview-wide.svg  V10 PC용 전체 관계도
```

## 사용법

1. **짧은 시간이라면** 각 장의 "한 문장 정리"까지만 읽어도 됩니다.
2. **내 프로젝트를 열어 두고** 읽으면 설명이 훨씬 잘 이해됩니다. "내 프로그램에 연결하기"는 내 파일에서 같은 것을 찾는 안내입니다.
3. **실험은 연습용 복사본에서** 합니다. 원본 DB 파일과 SQL 파일은 건드리지 않습니다.
4. **AI에게 물을 때는** ① 파일을 **수정하지 말고 설명만**, ② 파일 이름과 쿼리 번호를 근거로, ③ 내 프로젝트의 실제 내용에 맞춰, ④ 답은 가설이므로 **직접 확인** — 네 가지를 지킵니다.
5. 각 장의 **"다른 사람에게 이렇게 설명할 수 있습니다"** 는 예시입니다. 내 프로젝트의 이름으로 바꿔 말해 보세요.

## 관련 기술용어사전 항목

각 장에서 링크한 사전 항목입니다. 사전 본문은 이 작업에서 **수정하지 않았습니다.**

`relational-database` · `sqlite` · `sql` · `table` · `schema` · `erd` · `column-data-type` · `normalization` · `primary-key` · `foreign-key` · `one-to-many-relationship` · `many-to-many` · `cardinality` · `composite-key` · `data-integrity` · `not-null` · `unique-constraint` · `referential-integrity` · `cascade-delete-policy` · `select` · `query-execution` · `join` · `inner-join` · `left-join` · `aggregate-function` · `summary-aggregation` · `group-by` · `subquery` · `database-index` · `update` · `delete` · `crud` · `transaction` · `database-migration` · `object-relational-mapping` · `jpa` · `sqlalchemy-orm`

## 제작 범위와 경계

- **만든 것**: Chapter 1~10 원고, SVG 15종(모바일 14 + PC용 1), 강사용 노트, 작업 지시서 보존본, 이 README
- **최초 콘텐츠 제작에서 건드리지 않은 것**: 웹 UI(React·CSS·라우트), 기존 학습 가이드 route, canonical 용어 데이터, B6-1 원본 저장소의 SQL·결과물, 기존 B1-1/B2-1 원고와 SVG. 이후 웹 통합에서 `#/missions/main-M11/guide`와 미션 상세의 진입 링크를 연결했습니다.

## 검토가 필요한 항목

| 항목 | 내용 | 위치 |
| --- | --- | --- |
| 원본 미션 문서 | 원본을 직접 확인하지 못했습니다. `[요구 정리]`는 Notion 정리본에 의존하며, 요구 수치와 제출 형식은 원본 대조가 필요합니다 | 전 장 |
| 제출물 형식 | 정리본은 "실행 결과 **캡처 폴더** 1개"를 제출물로 적는데, B6-1은 결과를 `results/query_results.md` **텍스트 문서**로 남겼습니다. 정리본이 "스크린샷 또는 텍스트"를 허용하므로 충돌은 아니나 형식 확인이 필요합니다 | 10장 |
| Q15 인덱스와 자동 색인 | `UNIQUE (student_id, course_id)`가 만든 자동 색인이 Q15 이전에도 `student_id` 검색에 쓰입니다. B6-1을 틀렸다고 하지 않고 "인덱스가 항상 이득은 아니다"의 실제 사례로 다뤘습니다. 원본 README의 "FK 컬럼에 인덱스를 두면 빨라진다"는 일반화이므로 조건을 덧붙였습니다 | 8장 |
| JOIN 개수 표기 | B6-1 README는 "INNER 3 / LEFT 2", 쿼리 파일 머리말은 "INNER 4 / LEFT 2"로 세는 기준이 다릅니다 | 6장 |
| 학습 노트의 두 표현 | 노트 3장 제목은 "쿼리 15개"(실제 17개), 노트 5장의 "김민준 2명" 예는 샘플 데이터(김민준 1명)와 다릅니다. 이 가이드는 17개와 실제 데이터를 사용했고, 동명이인은 **일반 이유**로만 설명했습니다 | 3·6장 |
| EXPLAIN 출력의 `notused` | 결과 문서의 값(0)과 이번 실행(62)이 SQLite 버전에 따라 달랐습니다. 나머지 쿼리 결과는 모두 일치했습니다 | 8·10장 |
| `[실행 확인]`의 환경 | Windows 11, Python 3.14의 SQLite 3.50.4에서 실행했습니다. macOS의 `sqlite3` CLI(노트 기록: 3.43.2)에서는 확인하지 않았습니다 | 전 장 |
| 개발자 도구·명령 | `sqlite3` 명령은 이 제작 PC에 없었습니다. Windows PowerShell의 `<` 오류는 확인했지만 `.read` 대안은 설치된 `sqlite3`로 실행해 보지 못했습니다 | 1·5장 |
| JPA와 SQLAlchemy | 후속 미션(B6-2·B6-3)의 ORM이 SQLAlchemy라는 내용은 Notion 정리본에서 왔습니다. JPA는 Java 규격으로 소개만 했습니다 | 10장 |
| SVG 렌더링 환경 | Windows Chromium(Noto Sans KR)에서 실측했습니다. iOS Safari·Android 기기의 글꼴에서는 줄 너비가 다를 수 있어 약 6% 여유를 두고 검증했습니다. 서비스 화면에 연결할 때 앱 안에서 다시 확인해야 합니다 | assets |
| 실제 학습자 질문 | 각 장 첫머리의 질문 중 `[학습 노트]` 표시가 있는 것만 실제 노트에서 왔고, 나머지는 개념 이해에 필요한 일반 질문입니다 | 전 장 |
