# Canonical Correction & Deep Content Sprint 1

- 일자: 2026-09-10
- 기준 commit: `80b2134` (Glossary Content Quality Audit v1)
- 범위: Audit P0 5개 canonical 정리(Track A) + Webtoon Pilot 5개 Deep Content(Track B)

## Track A — Canonical Correction

### token

- before: `token` / ko `Token` / en `Token` / Security / concept / core
- source contexts:
  - preliminary M01 (direct): "4.11 토큰·비밀번호 마스킹 요구" — raw: `PAT(개인 액세스 토큰)`이 "토큰 마스킹 항목의 실제 대상"
  - main M13 (required): "JWT 기반 인증 이해 배경" — raw: JWT / Refresh Token 인증 방식 선택지
- problem: LLM 토큰(max_tokens, token-usage-cost)과 표기가 충돌하는 일반명 token
- decision: **SCOPE CORRECTION (rename)** — 두 ref 모두 인증 토큰 맥락이므로 `authentication-token`으로 id·표기 변경. **이 수정은 완전한 semantic split이 아니다.** LLM token 의미의 별도 canonical 필요 여부는 unresolved이며, 향후 `llm-token` 생성 시 split이 완료된다. 현재 LLM 토큰 의미는 기존 `max-tokens`·`token-usage-cost`가 담당
- after: `authentication-token` / ko `인증 토큰` / en `Authentication Token` / aliases [Token, 토큰] / related_terms [pat, json-web-token, refresh-token]
- confidence: HIGH

### transaction-model

- before: `transaction-model` / ko `Transaction` / en `Transaction Model` / Data / concept / core
- source contexts:
  - main M03 (direct): "거래 데이터 모델" — raw: "Transaction | Transaction Model | 거래 데이터 모델", "dataclass | Transaction 구조 구현 후보", "transactions/categories/budgets 저장"
- problem: DB 트랜잭션(`transaction`, Database)과 의미 충돌 — 실제로는 가계부 앱의 거래 데이터(레코드)
- decision: **RENAME** — `transaction-data` / ko `거래 데이터` / en `Transaction Data` / aliases [Transaction, 거래 내역] / related_terms [python-dataclass, persistence]
- after: DB 트랜잭션은 `transaction`만 담당
- confidence: HIGH

### filter

- before: `filter` / ko `필터` / en `filter` / **AI / Hardware** / concept / core
- source contexts:
  - preliminary M03 (direct): "data.json의 filters. 패턴 판별 기준" — raw: data.json 구조는 meta/filters/patterns
  - 같은 raw에서 "합성곱 | 필터가 패턴 위를 훑는 동작의 정식 명칭" — convolution filter 의미도 존재
- problem: registered context는 data.json 설정 필드인데 category는 AI/Hardware — 의미 충돌
- decision: **RENAME (scope 명확화)** — `filter` id 유지 / ko `데이터 필터` / en `Data Filter` / category `Data` / related_terms [convolution, pattern]. convolution filter 의미는 `convolution`이 담당하도록 alias `필터` 추가
- after: NPU convolution filter 의미 → `convolution`(합성곱) term으로 귀속
- confidence: HIGH

### masking / data-masking

- before:
  - `masking`: preliminary M01 (direct) "4.11 증거 캡처 시 비밀정보 가림" — Security / concept / core
  - `data-masking`: main M06 (direct) "diff 민감정보 보호" — Security / concept / core
- problem: 동일 개념(민감정보 노출 방지·가림)이 두 canonical term으로 분산. raw에서 둘 다 "마스킹" 표기
- decision: **MERGE** — survivor `data-masking`, ko `데이터 마스킹`, aliases [마스킹, masking], prelM01 ref 흡수(총 2 refs), related_terms [pii, pat]
- after: `masking` 제거. canonical count 550 → 549
- confidence: HIGH

## Canonical impact

- before count: 550
- after count: 549
- merged: masking → data-masking (1)
- renamed (scope correction): token → authentication-token — authentication 의미로 canonical scope를 한정한 rename이며, LLM token 별도 canonical은 unresolved라 완전한 semantic split이 아님
- renamed: transaction-model → transaction-data, filter 표기·category 변경
- removed: 1 (masking)
- migration: mission-term-map 4건 term_id 갱신, related_terms 신규 연결, alias 보존(검색 유지)
- 확인: openbook·webtoon·tests에 이전 id 참조 없음. 이전 URL(`/terms/token`, `/terms/transaction-model`, `/terms/masking`)은 상세 콘텐츠가 없던 인덱스 페이지로, 리다이렉트 인프라가 없어 404가 되며 검색은 alias로 계속 동작

## Track B — Webtoon Pilot Deep Content

5개 term에 공통 구조 적용: 한 줄 설명 → 쉽게 설명하면 → 정확한 설명 → **동작 원리** → 이 미션에서는 왜 필요한가 → **코드 예** → **주의할 점 / 경계 조건** → 웹툰(기존 유지) → 흔한 오해 → **비슷한 개념과의 차이** → **관련 용어** → 동료평가 질문

신규 Web-only Deep 필드: `howItWorks`, `limitationsOrEdgeCases`, `comparisons` (docs/07_content_layer_model.md의 설계대로). 기존 미공개 필드 `codeExample`·`detailRelatedTerms`도 Web 상세에 렌더링.

### localStorage

- Quick: "같은 origin의 브라우저에 문자열 key/value를 저장해 브라우저 세션을 넘어 유지하는 Web Storage API의 Storage 객체"
- Mission: M01 다크모드 선택 유지 (기존 유지)
- Deep: origin(스킴+호스트+포트) 격리, 동기 API, 용량 상한, 차단 환경 SecurityError, JSON 직렬화/역직렬화
- code: setItem/getItem/removeItem + JSON.stringify/parse 실행 가능 예제
- misconception: 서버 DB/변수 대체 아님 · 민감정보 금지
- source verification: MDN Web Storage API (Window.localStorage, Storage) — "data is specific to the protocol of the document", "saved across browser sessions" 확인

### JavaScript

- Quick: "ECMAScript 표준을 따르는 범용 프로그래밍 언어"
- Mission: M01 이벤트→핸들러→상태→DOM 업데이트 흐름 (기존 유지)
- Deep: ECMA-262 표준, 동적 타입, 단일 스레드 + event loop, script 로드 시점(defer/async), Java와 무관
- code: addEventListener + classList.toggle 실행 가능 예제
- misconception: "웹페이지만의 언어"는 입문 설명 — Node.js 등 범용 언어
- source verification: MDN JavaScript — "ECMAScript Language Specification (ECMA-262)", "many non-browser environments also use it, such as Node.js", "JavaScript is not 'Interpreted Java'" 확인

### DOM

- Quick: "브라우저가 HTML을 파싱해 만든 문서의 객체 트리 표현"
- Mission: M01 메뉴·다크모드·폼 오류·GitHub 결과의 DOM 변경 (기존 유지)
- Deep: WHATWG DOM, 파싱→DOM→CSSOM→렌더 트리 흐름, 브라우저 보정(tbody 등), live 표현, reflow/repaint, DOM은 Web API(JS 언어 일부 아님)
- code: querySelector/textContent/classList 실행 가능 예제
- misconception: HTML 파일 ≠ DOM — 파싱 보정과 런타임 변경이 반영된 결과
- source verification: MDN DOM Introduction — "represents a document with a logical tree", "When a web browser parses an HTML document, it builds a DOM tree", "The DOM is not part of the JavaScript language" 확인

### defer

- Quick: "HTML 파싱과 병렬 다운로드, 문서 파싱 후 문서 순서대로 실행"
- Mission: M01 파일 분리 시 초기 DOM 안정적 접근 (기존 유지)
- Deep: 기본 script 파서 차단 대비, DOMContentLoaded 이전 실행, 순서 보장, async와 차이(완료 즉시 실행·순서 미보장), async 우선 규칙, inline 무효, module script 기본 지연
- code: head의 defer 스크립트 2개 + 실행 순서 설명
- misconception: "실행 안 함"이 아니라 실행 시점만 미룸
- source verification: MDN script element — "executed after the document has been parsed, but before firing DOMContentLoaded", "execute in the order in which they appear", "must not be used if the src attribute is absent", "no effect on module scripts" 확인

### fetch

- Quick: "HTTP 요청을 보내고 Promise로 응답을 받는 Web API"
- Mission: M01 GitHub API 데이터 표시 + 403 구분 (기존 유지)
- Deep: Fetch 표준, Promise<Response>, 네트워크 실패만 reject, 404/500은 resolve, response.ok/status 확인, body 스트림 1회 소비, CORS
- code: async/await + response.ok 검사 + json() 실행 가능 예제
- misconception: "reject=서버 오류" 아님 — 404/500은 정상 도착 응답
- source verification: MDN Using Fetch — "reject on some errors... not if the server responds with an error status like 404", "Response.ok returns true if the status is in the 200 range", "By default, fetch() makes a GET request" 확인

## Chrome impact

- quick layer: 변경 없음 (M01 openbook quick_term_context 미수정)
- extension build: PASS (데이터 동기화만 — sidepanel이 새 Deep 필드를 렌더링하지 않음 확인)
- UI/source changes: 없음
- version: 0.4.1 유지

## Validation

- npm test: 9/9 PASS (549 count + Deep 필드 검증 테스트 추가)
- npm run build: PASS
- npm run build:extension: PASS
- git diff --check: PASS
- refs: stale id 참조 0건 (openbook/webtoons/tests/mission-term-map 전수 확인)
- aliases: 검색 보존 (Token/토큰, 마스킹/masking, Transaction 등)
- webtoon: published 5 유지, 상세 페이지 Deep 섹션 전체 렌더 확인
- routes: 전체 스모크 desktop/mobile PASS (웹툰 5 + 인증 토큰/데이터 마스킹 신규 라우트)

## Remaining manual decisions

- `llm-token` canonical 신설 여부 — `max-tokens`/`token-usage-cost` 상위 개념으로 필요한지 다음 Sprint에서 결정
- 이전 URL(`/terms/token` 등) 리다이렉트 정책 — HashRouter 리다이렉트 도입 여부
- docker-image termEn 'image' 정리 (manual-review backlog에 open 상태로 유지)

## Next candidates

P1 실행은 다음 Sprint 후보로만 제안:

- `rate-limiting` termKo 일반화 + `unauthenticated-api-request` 흡수
- placeholder 재작성 1차: `git`, `docker`, `react`, `json`, `sql`, `python`, `cli`, `shell`, `terminal` (DEEP_CONTENT_NEEDED)
- HIGH confidence 중복 쌍 merge 검토: `cpu-architecture`/`arm64-x86-64`, `remote`/`remote-repository`, `least-privilege`/`principle-of-least-privilege`, `log-rotation`/`logrotate`, `expiration`/`time-to-live`
