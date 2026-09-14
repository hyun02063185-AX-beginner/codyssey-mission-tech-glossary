# Glossary Canonical Implementation + Priority Content Batch 1 — Sprint 6

## 1. 목적과 범위

Sprint 5의 후보 검토를 구현으로 전환했다. 새 Canonical 5개와 우선 보강 대상 15개, 총 20개에 학습용 상세 본문과 tier 판단을 적용했다. Concept Connection은 기존 6개를 유지했고 새 연결 페이지를 만들지 않았다.

## 2. 새 Canonical 5개

| ID | 대표 표기 | 주요 별칭 | 핵심 구분 | 미션 맥락 |
| --- | --- | --- | --- | --- |
| `call-stack` | 콜 스택 / Call Stack | call stack, 콜스택 | 일반 `stack`이 아니라 함수 호출 프레임의 LIFO 실행 구조 | M01 event loop 흐름, M10 재귀·탐색 반환 |
| `scope` | 스코프 / Scope | scope, 변수 범위 | global/function/block 범위와 binding 탐색 규칙 | 예비 M02 함수·클래스, M01 var·let·const |
| `middleware` | 미들웨어 / Middleware | middleware | framework 종속 명칭이 아닌 공통 request/response 처리 계층 | M12 log·인증·검증 처리 |
| `database-migration` | 데이터베이스 마이그레이션 / Database Migration | database migration, schema migration | 일반 data migration이 아닌 schema 변경 이력·적용 절차 | M11 schema, M12 persistence, M13 인증 데이터 |
| `domain-name-system` | 도메인 네임 시스템 / Domain Name System | DNS | 단일 server가 아닌 분산 이름 해석 체계 | M05 HTTPS 서비스 접속·배포 |

`migration`, `domain`은 별칭으로 추가하지 않았다. Task Queue도 이번 Canonical에 포함하지 않았다.

## 3. 상세 콘텐츠와 Tier

기계 판독용 근거는 [content-tier-sprint6.json](../../data/reviews/content-tier-sprint6.json)에 있다. Tier A는 12개, Tier B는 8개이며 Tier C는 이번 batch에 없다.

| Tier | 용어 |
| --- | --- |
| A | call-stack, scope, domain-name-system, function, process, thread, concurrency, tcp, cookie, login-session, json-web-token, react-props |
| B | middleware, database-migration, var, let, const, variable, data-integrity, database-index |

각 본문에는 한 줄 설명, 쉬운 설명, 정확한 설명, 미션 맥락, 코드 예, 경계 조건, 관련 Canonical, 흔한 오해, 동료평가 질문을 포함했다. `var`·`let`·`const`는 기존 Scope/Variable Connection을 가리키는 보강 역할로 두었고 중복 연결을 새로 만들지 않았다.

## 4. 정확성 경계 점검

- Call Stack은 `stack` 자료구조와 구분하고 호출→프레임 추가→실행→반환→제거, 재귀와 overflow 경계를 설명했다.
- Scope는 `var`의 함수 범위와 `let`·`const`의 블록 범위를 구분했다.
- Middleware는 log, authentication, validation, handler, response의 request pipeline으로 설명했다.
- Database Migration은 schema version history이며 rollback은 도구·변경에 따라 달라진다고 명시했다.
- DNS는 cache와 authority를 포함한 분산 이름 해석이고, DNS 성공이 HTTPS server 정상 동작을 보장하지 않는다고 분리했다.
- Concurrency와 parallelism, Cookie와 Login Session, JWT의 서명과 encryption, data integrity와 security integrity를 혼동하지 않도록 경계 문단을 넣었다.
- Database Index에는 조회 이점과 write·storage 비용의 tradeoff를, React Props에는 부모 소유·자식 read-only와 state의 차이를 넣었다.

## 5. Atlas 및 지도 반영

다섯 새 항목 모두 Atlas field classification을 가졌다. Middleware는 Backend request-handling 지도, Database Migration은 Data/Database structure 지도, DNS는 Network name-resolution 지도와 학습 경로·edge에 반영했다. Call Stack과 Scope는 Programming Foundations 분류를 갖되, 현재 독립 field graph가 없는 Atlas 구조에서 억지 지도 노드를 만들지 않았다.

## 6. 검증 결과

자동 검증은 glossary, Atlas, knowledge-map, unit test, production build, map interaction, extension build 순으로 수행한다. Glossary validator는 기존 corpus의 maturity warning을 유지하지만 Sprint 6 신규 항목에는 오류가 없다. Browser QA와 모바일 확인 결과는 실행 시점의 검증 기록에 추가한다.

## 7. 다음 우선순위

1. Tier A 내용의 peer-review 질문을 실제 학습 플로우에서 관찰한다.
2. 기존 Atlas unmapped 경고는 field graph 확장 sprint에서 묶어 다룬다. 개별 용어를 임시 노드로 대량 추가하지 않는다.
3. Task Queue와 `parallelism`은 독립 Canonical 후보로 남겨, 중복·미션 근거·지도 설계를 다시 검토한다.
