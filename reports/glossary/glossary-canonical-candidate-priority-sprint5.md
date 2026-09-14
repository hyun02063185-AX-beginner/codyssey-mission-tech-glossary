# Sprint 5 — Canonical Candidate Review & Next Content Priority

## Executive Summary

- 검토 후보: **6개**
- `ADD_CANONICAL` 권고: **5개** — Call Stack, Scope, Middleware, Database Migration, DNS
- `DEFER`: **1개** — Task Queue
- 이번 Sprint에 실제 추가·병합·삭제한 Canonical: **0개**
- 다음 Content Sprint 후보: **45개** (P1 15 / P2 18 / P3 12)
- Concept Connection 후보: **6개** (YES 4 / DEFER 2)

이번 Sprint는 사전 항목을 늘리기보다 독립성·검색 가치·미션 반복·학습 연결성을 다시 판정하는 review 배치다. 따라서 `ADD_CANONICAL`은 다음 구현 배치의 명확한 권고이지, 빈 항목을 즉시 생성했다는 뜻이 아니다.

## Canonical Candidate Decisions

| Term | Decision | Confidence | Reason |
| --- | --- | --- | --- |
| Call Stack | ADD_CANONICAL | HIGH | 일반 자료구조 `stack`과 달리 함수 호출 상태를 관리하는 런타임 개념이다. Event Loop·재귀·stack trace를 설명하는 공통 기반이다. |
| Task Queue | DEFER | HIGH | 일반 Queue, message/job/OS queue와 JavaScript task queue의 범위가 다르다. Promise microtask를 분리하지 않은 단일 설명은 오개념 위험이 있다. |
| Scope | ADD_CANONICAL | HIGH | 변수·함수·closure의 접근 범위를 정하는 언어 공통 기초이며 기존 `variable`·`function`으로 대체되지 않는다. |
| Middleware | ADD_CANONICAL | HIGH | 특정 프레임워크 기능이 아니라 요청/응답 사이 공통 처리 단계를 잇는 서버 파이프라인 개념이다. |
| Migration | ADD_CANONICAL | HIGH | 일반 Migration은 넓고 중의적이다. Codyssey 문맥에는 **Database Migration**(`database-migration`)으로 한정한 독립 항목이 맞다. |
| DNS | ADD_CANONICAL | HIGH | Domain Name System은 HTTPS·인증서·배포 도메인 연결의 전제인 범용 네트워크 시스템이다. Domain 자체와는 다른 계층이다. |

각 후보의 미션 근거, Atlas 판정, 관련 Canonical, 실행 방법은 [canonical-candidate-review-sprint5.json](../../data/reviews/canonical-candidate-review-sprint5.json)에 구조화했다.

## Canonical Changes

- added: **0**
- merged: **0**
- deferred implementation: **6**
- rejected: **0**

실제 추가는 다음 구현 배치에서만 진행한다. 그때 `call-stack`, `scope`, `middleware`, `database-migration`, `domain-name-system` 각각에 Korean/English label, 제한된 alias, 미션 연결, 초기 상세 콘텐츠, Related Term을 함께 제공한다. `migration`과 `domain` 같은 bare alias는 중의성이 있어 넣지 않는다.

## Next Content Priority

점수는 미션 반복(0–3), Atlas 지도 연결(0–3), 현재 관계도(0–3), 핵심도(0–3), 검색 가치(0–2), 상세 콘텐츠 부재(2)를 보조로 사용했다. 점수만으로 결정하지 않고 학습 순서와 개념 경계를 사람이 검토했다.

- **P1 · 15개**: `var`, `let`, `const`, `variable`, `function`, `process`, `thread`, `concurrency`, `tcp`, `cookie`, `login-session`, `json-web-token`, `data-integrity`, `database-index`, `react-props`
- **P2 · 18개**: `single-page-application`, `server-side-rendering`, `component-tree`, `useeffect`, `controlled-input`, `custom-hook`, `browser-rendering`, `css-cascade`, `css-media-query`, `input-validation`, `output-validation`, `prompt-design`, `ai-model`, `asgi`, `nginx`, `relational-database`, `one-to-many-relationship`, `normalization`
- **P3 · 12개**: `cache`, `least-recently-used`, `graph-traversal`, `bfs`, `dfs`, `topological-sort`, `hash-map`, `min-heap`, `serialization`, `file-io`, `gitignore`, `pull-request`

모든 항목의 점수·미션 수·Atlas 상태·권장 설명 형식은 [content-priority-sprint5.json](../../data/reviews/content-priority-sprint5.json)에 있다.

## Top 15 Next Terms

| Term | 선정 이유 |
| --- | --- |
| `var` | `let`·`const`와의 스코프·재선언 비교에서 빠질 수 없는 축이다. |
| `let` | block scope와 재할당 의도를 코드로 가장 먼저 구분해야 한다. |
| `const` | M01에서 직접 쓰며 바인딩 재할당과 객체 변경의 경계를 설명해야 한다. |
| `variable` | Scope 후보, 함수, state 이해를 잇는 기본 단위다. |
| `function` | 입력·처리·반환·호출을 설명하는 언어 공통 기초다. |
| `process` | Thread·메모리·운영체제 실행 단위의 출발점이다. |
| `thread` | Process와 공유 자원·실행 흐름 차이를 비교해야 한다. |
| `concurrency` | Event Loop·Thread·Race Condition을 연결하는 핵심 실행 모델이다. |
| `tcp` | HTTP/HTTPS의 신뢰성 있는 전송 기반을 구분하게 한다. |
| `cookie` | 브라우저 저장과 인증 보안 속성을 함께 다뤄야 한다. |
| `login-session` | Session과 JWT의 역할·저장 위치·서버 상태를 비교할 가치가 크다. |
| `json-web-token` | 토큰 구조·서명·저장 위험을 분리해 설명해야 한다. |
| `data-integrity` | 제약 조건·트랜잭션·정규화가 필요한 이유를 묶는 원칙이다. |
| `database-index` | 조회 성능과 쓰기 비용의 trade-off를 배우는 DB 기초다. |
| `react-props` | 컴포넌트 간 데이터 전달과 state 책임을 구분하는 React 기초다. |

## Concept Connection Candidates

| Candidate | Decision | Recommended visual | Reason |
| --- | --- | --- | --- |
| Event Loop / Call Stack / Task Queue | DEFER | timeline | Call Stack은 추가 권고지만 route가 없고, Task Queue의 microtask/task 범위를 먼저 확정해야 한다. |
| HTTP / Request / Response / API | YES | request-response | fetch·HTTP·REST·상태 코드의 층위를 하나의 요청 흐름으로 보면 혼동이 줄어든다. |
| DNS / Domain / IP Address | DEFER | flow | DNS는 추가 권고지만 Domain·IP Address의 독립 Canonical 범위가 아직 확정되지 않았다. |
| Authentication / Authorization / Session / Cookie | YES | request-response | 신원 확인·권한 판단·로그인 상태·토큰을 따로 외우면 가장 자주 섞이는 보안 흐름이다. |
| State / useState / React Rendering | YES | flow | 상태 변화가 props·컴포넌트 트리·화면 갱신으로 이어지는 관계를 보여 줄 가치가 있다. |
| Process / Thread / Concurrency | YES | timeline | 동시성·병렬성·멀티스레드 혼동을 비교와 시간 축으로 줄일 수 있다. |

후보 원문은 [concept-connection-candidates-sprint5.json](../../data/reviews/concept-connection-candidates-sprint5.json)에 있다. 이번 Sprint에는 새 페이지를 구현하지 않았다.

## Metrics

| Metric | Start | End |
| --- | ---: | ---: |
| Canonical | 514 | 514 |
| Detailed content | 104 | 104 |
| Missing/immature detailed content | 410 | 410 |
| Maturity warnings | 1,187 | 1,187 |
| content_quality warnings | 0 | 0 |

## QA

- Glossary validator / Concept Connection validation: PASS — 0 errors, 1,187 existing maturity warnings
- Atlas validator: PASS
- Knowledge Map validator: PASS
- Unit tests: PASS — 31 tests
- Production build: PASS
- Playwright map tests: PASS — 5 tests
- Extension build: PASS
- Browser QA: not required; Canonical, alias, route, UI 데이터를 변경하지 않았다.

## Risks / Notes

- `Task Queue`를 `queue`에 합치거나 alias로 넣지 않는다. 자료구조와 런타임 대기열의 층위가 다르다.
- Database Migration은 generic Migration이 아니라 schema 변경 이력·적용 의미로 한정한다.
- DNS의 alias에 bare `domain`을 넣지 않는다. 도메인 이름·네트워크 도메인·기타 기술 문맥이 섞일 수 있다.
- 이전 phase audit은 당시 549개 기준의 역사적 근거다. 이번 우선순위 수와 상태는 현재 514 Canonical·104 detailed content 생성 데이터를 기준으로 다시 계산했다.
- 45개는 작성 순서이지 한 번에 구현할 작업량이 아니다. 다음 Sprint는 P1에서 10–15개로 제한해 콘텐츠 품질을 유지한다.

## Commits

- `abd7f2a` — review data와 우선순위 결정
- 이 보고서는 별도 문서 커밋으로 기록한다.

## Verdict

**PASS WITH NOTES.** 다음에 무엇을 독립 사전 항목으로 만들지와 무엇을 먼저 설명할지가 근거·우선순위·설명 방식까지 정리됐다. 다만 실제 Canonical 추가는 중의어와 Atlas 범위를 함께 검증할 다음 구현 배치에서 수행한다.
