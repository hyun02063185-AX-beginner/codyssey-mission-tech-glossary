# Glossary Content Quality Repair — Sprint 4

## A. Baseline

- 시작 기준선: `936198b` (`docs(glossary): report content quality sprint 3`)
- 시작 상태: `main...origin/main`, working tree clean, `git pull --ff-only` up to date
- 범위: 기존 Canonical만 사용하고 20개 상세 콘텐츠를 추가했다. Canonical 추가·병합·삭제와 Concept Connection 추가는 하지 않았다.

## B. Terms Updated

총 **20개** Canonical에 상세 콘텐츠를 추가했다.

| 구분 | 용어 |
| --- | --- |
| 지정 핵심 — EXISTING_CANONICAL | `event-loop` |
| 실행·이벤트 보완 | `event-handler`, `user-event`, `asynchronous-programming` |
| 자료구조 경계 보완 | `queue`, `stack` |
| HTTP·API 경계 | `http`, `http-request-response`, `http-status-code`, `http-get`, `http-post`, `https`, `rest-api`, `json-request-response`, `curl` |
| 서버·데이터 기초 | `request-response-cycle`, `dependency-injection`, `database-session`, `schema`, `module` |

각 상세 콘텐츠는 한 줄 설명, 쉬운 설명, 정확한 설명, 미션 맥락, 실제 Canonical Related Term, 흔한 오해, 동료평가 질문을 제공한다. 필요한 항목에는 동작 원리·코드 예·경계 조건도 추가했다.

## C. JavaScript Runtime Model

`event-loop`은 다음 실행 관계를 정확히 설명한다.

1. 동기 코드는 현재 Call Stack에서 먼저 실행된다.
2. 타이머·네트워크·입력 완료 뒤의 후속 처리는 런타임 대기열에 준비된다.
3. Stack이 비면 Event Loop가 실행 가능한 일을 가져온다.
4. Promise 반응을 포함한 microtask는 일반 task보다 먼저 처리될 수 있다.

`setTimeout(..., 0)`이 즉시 실행되지 않고 Promise 반응보다 뒤일 수 있는 코드 예를 넣었다. `callback`, `promise`, `async-await`은 기존의 정확한 상세 콘텐츠를 유지하고 Related Term으로 연결했다.

## D. Scope / Middleware / Migration / DNS Decision

| 요청 표기 | 현재 판정 | 근거와 이번 처리 |
| --- | --- | --- |
| Scope | `CANONICAL_CANDIDATE` | 현재 Canonical ID가 없고 기존 큐레이션에서 중신뢰 P1 백로그다. 생성하지 않았다. |
| Middleware | `CANONICAL_CANDIDATE` | 현재 Canonical ID가 없고 M12 coverage gap이다. 생성하지 않았다. |
| Migration | `CANONICAL_CANDIDATE` | `database migration`은 coverage gap이며 현재 Canonical이 없다. `schema`와 `database-session`의 기존 항목만 보완했다. |
| DNS | `CANONICAL_CANDIDATE` | `DNS / Domain Name`은 coverage gap이고 현재 Canonical이 없다. 생성하지 않았다. |

후보를 기존 용어에 억지로 합치지 않았다. 이는 검색·지도·미션 참조에 아직 없는 URL을 만들지 않는 정책을 따른다.

## E. Related-Term Connections

- JavaScript 실행: `event-loop` → `asynchronous-programming` / `promise` / `callback`; 이벤트 입력은 `user-event` → `event-handler` → `add-event-listener`으로 연결했다.
- HTTP 흐름: `http` → `http-request-response` → `http-status-code`, 그리고 `http-get`·`http-post`·`rest-api`·`json-request-response`·`curl`을 구분했다.
- 서버 흐름: `request-response-cycle` → `dependency-injection` / `database-session` / `schema`로 연결했다.
- 자료구조: `stack`·`queue`는 M09 자료구조로 정의했고, Call Stack·Task Queue와 동일 Canonical이 아님을 각각 명시했다.

## F. Concept Connection Candidate

**DEFER — Event Loop / Call Stack / Queue.**

새 Concept Connection은 만들지 않았다. `call-stack`과 `task-queue`는 현재 Canonical route가 없고, 기존 `stack`·`queue`는 자료구조로 별개다. microtask와 task queue를 구별하지 않는 도식은 잘못된 실행 모델을 가르칠 위험이 있다. Canonical 심사와 외부 기술 검증 뒤에만 후보를 재검토한다. 기존 6개 Concept Connection은 유지했고 회귀 테스트로 로드를 확인했다.

## G. Content Quality

- `content_quality` 오류/경고: **0 → 0**
- 새 콘텐츠는 placeholder, 한 줄 설명의 단순 반복, self-reference Related Term을 만들지 않았다.
- 전체 `glossary_maturity_gap` 경고: **1,207 → 1,187**. 이번 20개에 대한 `no detailed description` 신호가 해소됐다. 남은 `no related terms`·Atlas 미매핑 등은 기존 메타데이터/지도 커버리지 백로그이며 이 콘텐츠 배치에서 정책을 바꾸지 않았다.

## H. Metrics

| 지표 | 시작 | 완료 |
| --- | ---: | ---: |
| Canonical terms | 514 | 514 |
| Detailed content | 84 | 104 |
| Missing detailed content | 430 | 410 |
| 추가 Concept Connection | 0 | 0 |

## I. Automated QA

다음 검증을 통과했다.

- `npm run data:build`
- `npm run glossary:validate` — 0 errors
- `npm run knowledge-map:validate`
- `npm run atlas:validate`
- `npm run build`
- `npm test` — 4 files, 31 tests passed
- `npm run test:map-interaction` — 5 Playwright tests passed
- `npm run build:extension`

상세 콘텐츠 수 회귀 테스트의 기대값은 84에서 104로 갱신했다.

## J. Browser QA

- 실제 로컬 Event Loop 상세 페이지에서 제목, 전체 설명 섹션, 코드 예, Related Term 링크를 확인했다.
- 변경된 상세 페이지 15개(`event-loop`부터 `database-session`까지)를 브라우저 엔진으로 순회해 제목과 필수 5개 섹션을 확인했다.
- 검색 8개를 확인했다: `Event Loop`, `사용자 이벤트`, `Queue`, `HTTP`, `HTTPS`, `REST API`, `curl`, `schema`.
- 390px 모바일 뷰포트에서 `http` 페이지의 가로 overflow가 없음을 확인했고, Related Term `HTTP Request / Response` 이동과 Atlas 딥링크 1개를 확인했다.
- 모바일 검증 중 발견한 viewport 누락을 `index.html`의 표준 viewport meta로 수정했다.

## K. Next Priorities

1. Scope·Middleware·Database Migration·DNS 후보는 Canonical 심사와 근거 수집 후 별도 배치에서 결정한다.
2. Call Stack·Task Queue는 microtask/macrotask 경계를 검증할 수 있을 때만 독립 Concept Connection 후보로 다시 검토한다.
3. 남은 detailed-content gap은 미션 직접성·Atlas 핵심도·사용자 검색 실패를 기준으로 10–20개씩 보수한다.

## L. Commits

- `4e91c2b` — 콘텐츠·생성 데이터·모바일 viewport·상세 수 회귀 테스트
- 이 보고서는 별도 문서 커밋으로 기록한다.

## M. Verdict

**PASS.** 새 Canonical을 추가하지 않고 20개 기존 용어의 학습 가능한 상세 콘텐츠를 보강했다. 지정 핵심 표기 중 현재 데이터에 없는 6개는 혼동 없이 후보/HOLD로 남겼고, JS 실행 모델·HTTP/API·서버 처리 흐름의 연결성을 개선했다.
