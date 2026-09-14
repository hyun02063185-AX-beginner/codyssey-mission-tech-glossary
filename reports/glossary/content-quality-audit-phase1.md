# Glossary Content Quality Audit — Phase 1

- 일자: 2026-09-14
- 기준 commit: `e43f343` (HEAD와 동일, working tree clean — 추적되지 않는 `.DS_Store` 1건 제외)
- 대상: `data/curated/glossary-master-v0.1.yaml`의 canonical term 549개 전체 + 최근 M01 후보 19개
- 성격: **AUDIT ONLY.** product data/code는 한 건도 수정하지 않았다.
- Machine-readable artifact:
  - `data/reviews/content-quality-audit-phase1.json` (549 term 전수 판정)
  - `data/reviews/m01-candidate-review-phase1.json` (후보 19개 판정)
  - `data/reviews/relation-candidates-phase1.json` (관계 제안 22 + 반려 7)
- 선행 Audit: `reports/glossary/glossary-content-audit-v1.md` (2026-09-10, 550 terms). 본 Phase는 v1을 **대체하지 않고 증거로 재사용**한다.

---

## 0. 감사 방법과 그 한계 (먼저 읽을 것)

이 보고서의 숫자를 해석하려면 아래 구분이 필요하다.

| 감사 축 | 범위 | 방법 |
|---|---|---|
| Canonical **entry** 감사 | 549 / 549 | 이름·category·type·mission binding·alias/표기 충돌(NFKC 정규화)·knowledge map 수록 여부를 전수 기계 검사 |
| **설명문(prose)** 감사 | 65 / 549 | `content/terms/*.md` 전수 구조 검사 + 순환 정의·보일러플레이트·자기참조 탐지, 그중 12개는 기술 정확성까지 정독 |
| 선행 판정 재사용 | 177 entries | `glossary-content-audit-v1.json`의 verdict를 증거로 통합 |

> **가장 중요한 사실: 549개 중 484개(88.0%)에는 설명문이 아예 없다.**
> 이들은 `content_status: raw`이며 id·한/영 표기·category·difficulty·importance·mission context만 존재한다.

따라서 이 보고서에서 **설명이 없는 484개의 `audit_status`는 "설명 품질"이 아니라 "canonical 항목 자체의 건전성"을 뜻한다.**
설명이 없는 항목에 KEEP을 부여한 것은 "설명이 훌륭하다"는 뜻이 아니라 "항목(이름·분류·미션 연결)에 손댈 이유가 없고, 콘텐츠 부채는 `content_tier: none`으로 따로 집계했다"는 뜻이다.
`content_tier`를 함께 보지 않고 `audit_status`만 읽으면 안 된다.

---

## 1. Executive Summary

### 1.1 Audit Status (549 terms)

| Status | 수 | 비율 |
|---|---:|---:|
| KEEP | 172 | 31.3% |
| POLISH | 219 | 39.9% |
| CLARIFY | 42 | 7.7% |
| RELATE | 11 | 2.0% |
| MERGE | 80 | 14.6% |
| REVIEW | 25 | 4.6% |
| **합계** | **549** | **100%** |

### 1.2 Content Tier — 실제 설명 보유 현황

| Tier | 수 | 설명 |
|---|---:|---|
| `deep` | 5 | 11개 섹션 심화 콘텐츠 (`defer`, `dom`, `fetch-api`, `javascript`, `local-storage`) |
| `mid` | 18 | 7–8개 섹션, 실제 기술 설명 존재. 품질 대체로 양호 |
| `placeholder` | 42 | 파일은 있으나 **순환 정의 + 템플릿 보일러플레이트**. 사실상 내용 없음 |
| `none` | 484 | 설명문 자체가 존재하지 않음 |

### 1.3 Priority

| Priority | 수 |
|---|---:|
| P0 | 25 |
| P1 | 149 |
| P2 | 375 |

### 1.4 한 문단 요약

구조(Atlas·knowledge map·Open-book·Extension·validator)는 견고하고 자동 검증도 전부 통과한다.
문제는 전부 **콘텐츠 층**에 있다. 심화 콘텐츠 5개는 우수하고 중간 등급 18개도 쓸 만하지만,
42개는 순환 정의 템플릿이 그대로 배포되어 있고 484개는 설명이 없다.
동시에 canonical 목록에는 기술용어가 아닌 항목(미션 제출 요구사항, 미션 전용 CLI 명령어, 디렉터리명)이 상당수 섞여 있다.
따라서 다음 단계의 목표는 "설명을 더 쓰는 것"이 아니라 **"무엇이 canonical이어야 하는가를 먼저 확정한 뒤 설명을 쓰는 것"**이다.

---

## 2. Current Architecture

실제 코드·데이터에서 확인한 현재 구조다. 기존 문서가 아니라 실물 기준이다.

### 2.1 Canonical glossary source

- 위치: `data/curated/glossary-master-v0.1.yaml`
- **확장자는 `.yaml`이지만 내용은 JSON이다.** (`json.load`로 파싱된다)
- 549 terms, `version: "0.1"`

### 2.2 Term schema (실측)

| 필드 | 출현 | 비고 |
|---|---:|---|
| `id`, `term_ko`, `term_en`, `category`, `type`, `difficulty`, `importance`, `related_terms`, `content_status`, `webtoon`, `aliases`, `mission_refs` | 549 | 전 항목 필수 |
| `summary` | **23** | 한 줄 요약. 나머지 526개에는 없음 |

- `category`: 14종 (Programming 89, Web 73, Git/Collaboration 57 …)
- `type`: 16종. `concept` 448개로 편중. `API`/`library`/`framework`/`architecture`/`command` 구분이 일관되지 않음
- `difficulty`: 2 또는 3만 사용 (474 / 75). 사실상 변별력 없음
- `content_status`: `raw` 484 / `drafted` 65

### 2.3 Alias 구조 — **source of truth가 둘로 갈라져 있다**

- Master의 `aliases`는 **517개 항목에서 자기 자신(term_ko 또는 term_en) 1개뿐**이다. 실질적 alias를 가진 항목은 35개에 불과하다.
- 반면 `content/peer-review/main-m01-openbook.yaml`에는 term별로 훨씬 풍부한 alias가 별도로 들어 있다.
- **Open-book 23개 term 중 22개의 alias가 master에 반영되어 있지 않다.**

예시:

| term | master aliases | open-book에만 있는 alias |
|---|---|---|
| `dom` | `DOM` | `Document Object Model`, `문서 객체 모델` |
| `fetch-api` | `fetch` | `Fetch API`, `fetch()`, `페치 API` |
| `javascript` | `JavaScript` | `JS`, `자바스크립트` |
| `http-status-code-403` | `403` | `HTTP 403`, `Forbidden`, `403 Forbidden` |

→ Extension/웹 검색이 master alias를 쓴다면 `자바스크립트`, `문서 객체 모델` 같은 가장 흔한 한글 검색어가 걸리지 않는다.

### 2.4 Relation / graph 데이터

- **Master의 `related_terms`는 549개 중 4개 항목에서만 채워져 있다** (`data-masking`, `filter`, `authentication-token`, `transaction-data` — 전부 Sprint 1에서 추가된 것). 사실상 비어 있다.
- 실제 관계 그래프는 master가 아니라 **knowledge map 쪽에 있다**: 10개 map, **250 nodes / 237 edges**.
- Relation ontology(12종)는 `knowledge-map.json`의 `relationOntology`에 정의되어 있다:
  `is_a`, `based_on`, `defined_by`, `provided_by`, `uses`, `interacts_with`, `prerequisite`, `cs_foundation`, `evolved_from`, `enabled_by`, `compare_with`, `mission_uses`
- 실사용 분포: `interacts_with` 71, `uses` 70, `based_on` 31, `provided_by` 20, `is_a` 19, `compare_with` 14, `prerequisite` 4, `defined_by` 3, `evolved_from` 3, `cs_foundation` 2

> **관계 taxonomy는 이미 충분하다. 신규 relation type 제안은 하지 않는다.**

### 2.5 Technology Atlas

- `data/knowledge-maps/atlas/` — `field-taxonomy.json`(12 fields), `term-field-classification.json`(549 전수 분류), `mission-field-matrix.json`, `mission-map-routing.json`
- standalone map 10개 + cross-field layer 2개 (registry 12)
- 549 term 전부 primary field가 부여되어 있다 (confidence HIGH 539 / MEDIUM 8 / LOW 2)
- **그러나 knowledge map의 실제 node로 등장하는 canonical term은 227개뿐이다. 322개(58.7%)는 어떤 지도에도 없다.**

### 2.6 `foundation:` 노드 — 중요한 구조적 발견

Map에는 canonical term이 아닌 보조 노드 14개가 있다 (`nodeOrigin: foundation`).

`foundation:web-platform`, `foundation:promise`, `foundation:callback-pattern`, `foundation:xml-http-request`,
`foundation:dom-event`, `foundation:async-execution`, `foundation:http`, `foundation:cookie`,
`foundation:web-storage`, `foundation:ecmascript`, `foundation:html-standard`, `foundation:request-response`,
`foundation:css-layout`, `foundation:css-media-queries`

두 가지 사실이 따라온다.

1. **이번에 검토할 M01 후보 상당수가 이미 foundation 노드로 모델링되어 있다.**
   Promise·Callback·XMLHttpRequest·DOM Event·Web Platform이 전부 그렇다.
   즉 Atlas 설계자는 Concept Connection 문제를 이미 부분적으로 풀어 두었다.
2. **그중 3개는 기존 canonical term을 그림자처럼 중복한다** — `foundation:promise` ↔ canonical `promise`,
   `foundation:http` ↔ canonical `http`, `foundation:cookie` ↔ canonical `cookie`.
   지도에서 Promise를 눌러도 canonical term 페이지로 연결되지 않는다. (P1 수정 후보)

### 2.7 Open-book M01

- `content/peer-review/main-m01-openbook.yaml` (역시 JSON 내용)
- `quick_terms` 23개 + `requirements` 11개
- **term별 스키마가 master보다 훨씬 풍부하다**:
  `quick_explanation` / `mission_relevance` / `screen_check` / `code_check` / `peer_question` / `common_trap` / `aliases`
- 이 6개 필드는 §5의 A·C·E 역할(10초 설명 / 사용 맥락 / 미션 맥락)을 이미 만족한다.
- 단 M01 term 68개 중 23개만 다룬다. M01 core 37개 중 16개가 Open-book에 없다.

### 2.8 Chrome Extension / Web UI 데이터 경로

- 빌드 체인: `scripts/build_*.py` → `dist-extension/` (`glossary.json`, `openbook-main-m01.json`, `term-map-links.json`)
- `npm run data:build`가 7개 Python 스크립트를 순차 실행한다
- Extension은 master를 직접 읽지 않고 빌드 산출물을 읽는다 → **master를 고치면 반드시 재빌드가 필요하다**

### 2.9 Validator

| 스크립트 | 커버 범위 |
|---|---|
| `validate_technology_field_atlas.py` | 분류 중복/커버리지, field 유효성, mapRole, confidence, mission matrix 정합성 |
| `validate_knowledge_map.py` | registry 정합성, node 중복/필드/region, canonical binding, **orphan node**, edge 중복·유효성·출처 URL, overlay 정합성, term-map-links 역참조 |

> Atlas와 map 계층은 매우 촘촘히 검증된다.
> **반면 glossary master 자체를 검증하는 validator는 존재하지 않는다.** (§11 참조)

---

## 3. Candidate Term Review — 최근 M01 후보 19개

전체 근거는 `data/reviews/m01-candidate-review-phase1.json`.

| Candidate | Existing Match | Proposed Status | Reason (요약) |
|---|---|---|---|
| AJAX | — | **NEW_CANONICAL_CANDIDATE** (`ajax`) | 기법이다. API도 라이브러리도 아니다. XHR·Fetch가 구현 수단 |
| XMLHttpRequest | — (map에 `foundation:xml-http-request`) | **NEW_CANONICAL_CANDIDATE** | 없으면 "AJAX ≠ Fetch"를 설명할 수 없다 |
| Fetch API | `fetch-api` | EXISTING_CANONICAL + DESCRIPTION_ENHANCEMENT | deep content 보유. `fetch()` 함수와 Fetch API 층위 구분 필요 |
| Callback | — (`usecallback`은 **다른 개념**) | **NEW_CANONICAL_CANDIDATE** (`callback`) | React `useCallback`으로 대체 불가. Group B·C를 잇는 축 |
| Promise | `promise` | EXISTING_CANONICAL + DESCRIPTION_ENHANCEMENT | canonical 존재하나 설명 전무 + importance=supporting. core 승격 검토 |
| async/await | `async-await` | EXISTING_CANONICAL + DESCRIPTION_ENHANCEMENT | 내용 정확. 단 코드 예에 결함(§5.1) |
| Event Loop | `event-loop` | EXISTING_CANONICAL + DESCRIPTION_ENHANCEMENT | related 유지. **core로 승격하지 말 것**(§15 과도한 전문화) |
| Call Stack | `stack`은 **자료구조로 별개** | **HOLD** | Event Loop 심화를 쓰기로 정한 뒤 함께 판단 |
| Task Queue | `queue`는 **자료구조로 별개** | **HOLD** | macrotask/microtask 구분 없이 만들면 틀린 모델을 가르침. 외부 검증 필요 |
| Web API | — (map에 `foundation:web-platform`) | **NEW_CANONICAL_CANDIDATE** (`browser-web-api`) | **`Web API`로 명명 금지** — 기존 `rest-api`와 충돌 |
| Event | `user-event` | DESCRIPTION_ENHANCEMENT | 사용자 이벤트 ⊂ 이벤트. **alias 추가 반대**(개념 축소). bare canonical은 HOLD |
| Event Handler | `event-handler` | EXISTING_CANONICAL + DESCRIPTION_ENHANCEMENT | 설명 없음 + 지도에도 없음 |
| addEventListener | `add-event-listener` | EXISTING_CANONICAL + DESCRIPTION_ENHANCEMENT | mid content 보유. '흔한 오해' 섹션 결함(§5.2) |
| preventDefault | — | **NEW_CANONICAL_CANDIDATE** (`prevent-default`) | M01 폼 검증 필수. stopPropagation 혼동을 가르치려면 분리 필요 |
| Event Bubbling | — | **NEW_CANONICAL_CANDIDATE — 단, 이름은 `event-propagation`** | 전파는 capturing→target→bubbling 3단계. bubbling만 term화하면 부분을 전체로 가르침. Bubbling은 alias |
| HTML | `html` | EXISTING_CANONICAL | mid content 양호 |
| DOM | `dom` | EXISTING_CANONICAL | **이번 감사 최고 품질 항목.** `dom-update`는 MERGE 후보 |
| SPA | `single-page-application` | EXISTING_CANONICAL + DESCRIPTION_ENHANCEMENT | 설명 없음. MPA 부재가 오해를 유발 |
| MPA | — | **NEW_CANONICAL_CANDIDATE** (`multi-page-application`) | Group E를 '발전'이 아닌 '비교'로 만들려면 필수 |

### 집계

| 판정 | 수 |
|---|---:|
| EXISTING_CANONICAL | 9 |
| NEW_CANONICAL_CANDIDATE | 7 |
| DESCRIPTION_ENHANCEMENT (주 판정) | 1 |
| HOLD | 2 |
| **합계** | **19** |

- DESCRIPTION_ENHANCEMENT를 **부수 조치까지 포함**하면 8건
- 신규 canonical 제안은 7건. 후보 19개 중 **12개는 신규 canonical을 만들지 않는다** — 목표 #3(잘못된 canonical 증가 방지) 달성
- ALIAS 권고: Open-book → master 백필 22건 + `Event Bubbling`→`event-propagation` 1건

---

## 4. Highest Priority Content Issues

### P0 (25건)

기계 판정으로 P0가 부여된 25건을 주제별로 묶으면 아래 9개 항목이 된다.
(전체 25건 목록은 `data/reviews/content-quality-audit-phase1.json`에서 `priority: "P0"`으로 필터하면 된다.)

| # | 대상 | 문제 | 권장 |
|---|---|---|---|
| 1 | **42개 placeholder 콘텐츠** (그중 P0는 M01/M02 core) | 순환 정의가 그대로 배포 중 | 전면 재작성. §4.1 참조 |
| 2 | `rate-limiting` | `term_ko = "시간당 60회 제한"` — 사례값이 개념명 | `Rate Limiting / 요청 수 제한`으로 rename |
| 3 | `breakpoint` | `term_ko = "768px / 1024px 브레이크포인트"` — 사례값 | `브레이크포인트`로 rename |
| 4 | `listen-address` | `term_ko = "0.0.0.0:15034"` — 리터럴 | 개념명으로 rename |
| 5 | `default-route-any-ipv4` | `term_ko = "0.0.0.0/0"` — 리터럴 | 개념명으로 rename |
| 6 | `o` ↔ `time-complexity` | **동일 개념 중복.** `시간 복잡도` vs `시간복잡도` (띄어쓰기만 차이) | `time-complexity`로 MERGE |
| 7 | `data-json` ↔ `json` | 둘 다 `term_ko = "JSON"` | `json`으로 MERGE (`data.json`은 파일명) |
| 8 | `dom-update` | DOM 조작의 한 국면일 뿐 | `dom`으로 MERGE 검토 |
| 9 | Group A–E 관계 부재 | M01 핵심 개념 연결이 데이터에 없음 | §7·§8 |

> P0 6·7은 v1에서 이미 HIGH로 지적됐으나 **Sprint 1에서 처리되지 않았고 현재도 그대로다.**
> Sprint 1이 실제로 고친 것은 `token`→`authentication-token`, `transaction-model`→`transaction-data`, `filter`, `masking` 병합 4건뿐이다.

### P1 (149건)

- 나머지 placeholder 콘텐츠 재작성
- MERGE 후보 80건 처리
- `foundation:promise` / `foundation:http` / `foundation:cookie` → canonical term 바인딩
- Open-book alias 22건을 master로 백필
- mid-tier 18개의 §5 결함 수정

### P2 (375건)

- 설명 없는 484개 중 미션 가중치가 낮은 항목
- `term_ko == term_en`으로 한글 표기가 없는 232건(그중 type=concept 192건, core 71건)
- 미션 전용 CLI 명령어 15건의 scope 결정(§7 REVIEW)

---

## 5. Technical Accuracy Issues

### 5.0 최대 문제 — 순환 정의 템플릿 42건

42개 파일이 동일한 생성 템플릿에서 나왔고, 정의가 성립하지 않는다.

`content/terms/json.md` 현재 문장:

```
## 한 줄 설명
JSON은(는) 코디세이 미션에서 반복해 쓰이는 핵심 개념입니다.

## 정확한 설명
JSON은(는) 코디세이 미션에서 반복해 쓰이는 핵심 개념입니다. 구현 방법은 언어와 도구에 따라
달라도, 미션 요구사항에서 맡는 역할과 한계는 구분해서 설명할 수 있어야 합니다.

## 관련 용어
JSON
```

세 가지가 동시에 잘못됐다.

1. **정의가 없다.** "핵심 개념입니다"는 어떤 개념인지 말하지 않는다. `한 줄 설명`과 `정확한 설명`이 같은 문장이다.
2. **관련 용어가 자기 자신이다.** 32개 파일에서 발생.
3. **한국어 조사 템플릿이 깨져 있다** — `은(는)`이 그대로 출력. 20개 파일.

탐지된 플래그 분포:

| 플래그 | 파일 수 |
|---|---:|
| `boilerplate_plain_explanation` / `boilerplate_misconception` / `boilerplate_deep_dive` | 42 |
| `self_referential_related_terms` | 32 |
| `circular_oneliner` / `circular_core_definition` | 20 |
| `broken_korean_particle` | 20 |

> 참고: `summary` 필드를 가진 23개 항목은 `한 줄 설명`만은 실제 문장이다(예: `shell` — "명령을 해석해 운영체제에 전달하는 프로그램").
> 즉 템플릿은 `summary`가 있으면 그것을 쓰고 없으면 순환 문장을 넣었다. 그래서 `summary` 23개 확보가 우선 과제가 된다.

### 5.1 `async-await` — 코드 예가 저장소 자신의 경고를 위반한다

현재 `content/terms/async-await.md`:

```js
try { const data = await (await fetch(url)).json(); } catch { showError(); }
```

같은 저장소의 Open-book `fetch-api.common_trap`은 이렇게 경고한다:

> "fetch가 HTTP 404·403 응답에도 Promise를 resolve할 수 있다는 점을 놓치는 것"

위 코드는 `response.ok`를 검사하지 않으므로 **정확히 그 함정을 시연한다.** M01은 403 처리가 필수 요구사항이므로 학습상 해롭다.

권장 방향:

```js
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

또한 `관련 용어`에 `promise`가 없다 — async/await 설명에서 가장 중요한 연결이 빠져 있다.

### 5.2 `add-event-listener` — '흔한 오해' 섹션이 오해가 아니다

현재 문장:

> "이벤트 리스너는 HTML에 onclick 속성을 쓰는 것과 달리 구조와 동작을 분리할 수 있습니다."

이것은 **오해가 아니라 장점 서술**이다. 섹션 역할이 무너졌다.
실제로 흔한 오해는 "리스너를 여러 번 등록해도 한 번만 실행된다", "`onclick` 속성과 `addEventListener`는 완전히 같다" 등이다.
(본문에 `preventDefault()`가 언급되지만 해당 canonical term이 없어 연결되지 않는다 → §3)

### 5.3 `http-status-code-403` — 429의 부재

본문은 GitHub 한도 초과가 403으로 나타날 수 있다고 정확히 서술한다(hedging도 적절).
그러나 **일반 표준에서 요청 한도 초과의 상태 코드는 429 Too Many Requests**라는 점이 어디에도 없다.
학습자는 "rate limit = 403"으로 일반화하기 쉽다. GitHub이 예외적 사례임을 한 문장 추가 권장. (CLARIFY)

### 5.4 외부 검증 필요 20건

v1에서 `needs_external_verification`으로 표시된 20건은 이번에도 그대로 유지한다
(`docker`, `git`, `react`, `sql`, `fastapi`, `sqlalchemy` 등 — 전부 공식 문서 대조 후 작성 필요).
추측으로 수정안을 확정하지 않는다.

---

## 6. Readability Issues

정확하지만 읽기 어려운 항목은 **소수다.** mid/deep tier 23개는 대체로 문장이 짧고 번역투가 적다.

| 항목 | 문제 |
|---|---|
| `term_ko == term_en` 232건 | 한글 표기가 없어 한국어 학습자가 검색·기억하기 어렵다. type=concept 192건, 그중 core 71건 |
| `multiple_concepts_in_one_term` 53건 | `arm64, x86_64`, `NumPy, pandas`, `containerd, runc`, `Homebrew, apt` 등 한 term에 두 개념 |
| `numpy-pandas` | `term_ko = "외부 라이브러리"` ↔ `term_en = "NumPy, pandas"` — 한/영이 서로 다른 것을 가리킨다 |
| `cpu-architecture` ↔ `arm64-x86-64` | **두 term의 한/영이 서로 뒤바뀌어 있다.** `cpu-architecture`(ko=`x86/arm64`, en=`CPU Architecture`) vs `arm64-x86-64`(ko=`CPU 아키텍처`, en=`arm64, x86_64`) |
| `let-s-encrypt` | ko는 `Let’s`(U+2019), en은 `Let's`(U+0027) — 문장부호 불일치 |

---

## 7. Merge / Alias Candidates

### 7.1 정규화 후 표기 충돌 10쌍 (NFKC + 공백/기호 제거)

| 정규화 키 | 항목 | 판정 |
|---|---|---|
| `시간복잡도` | `o`(시간 복잡도) / `time-complexity`(시간복잡도) | **MERGE** — 띄어쓰기만 다른 동일 개념 |
| `json` | `data-json`(JSON) / `json`(JSON) | **MERGE** — `data.json`은 파일명 |
| `transaction` | `transaction` / `transaction-data` | 표기 구분 (동음이의, 병합 아님) |
| `필터` | `convolution` / `filter` | 표기 구분 (Sprint 1 의도된 alias) |
| `branch` | `branch` / `branch-command` | 개념 vs 미션 CLI 명령 → §7.2 |
| `commit` | `commit` / `commit-command` | 동상 |
| `get` | `http-get` / `get-command` | 동상 |
| `init` | `init`(`__init__`) / `init-command`(INIT) | 동상 |
| `css` | `css` / `css-directory`(css/) | 개념 vs 디렉터리명 → §7.3 |
| `auth` | `authentication` / `auth-layer`(auth/) | 동상 |

### 7.2 미션 전용 CLI 명령어 15건 — **REVIEW (scope 결정 필요)**

`ancestors-command`, `branch-command`, `commit-command`, `dbsize-command`, `del-command`,
`exists-command`, `expire-command`, `get-command`, `init-command`, `keys-command`,
`log-command`, `path-command`, `search-command`, `set-command`, `switch-command`

전부 main M09(키-값 저장소 구현) / M10(Git 유사 VCS 구현)의 **"학습자가 구현해야 할 명령어 이름"**이다.
`BRANCH`, `COMMIT`, `GET`, `INIT`은 일반 기술용어가 아니라 **미션 과제 스펙**이고, 실제 `branch`·`commit`·`http-get`과 표기가 충돌한다.

> 이것은 기술용어사전의 canonical인가, 미션 로컬 어휘인가?
> **판단이 필요한 사항이므로 이번 Phase에서는 결정하지 않는다.** 별도 namespace(예: `mission-vocab`)로 분리하는 선택지를 권한다.

### 7.3 산출물·요구사항이 canonical이 된 사례

- 디렉터리명 9건: `auth/`, `css/`, `images/`, `js/`, `models/`, `repositories/`, `routers/`, `services/`, `templates/`
- 파일명 6건: `.env`, `.gitignore`, `index.html`, `main.py`, `pyproject.toml`, `requirements.txt`
- 제출 요구사항형: `contact-form`, `deployment-url`, `git-repository-url`, `readme`, `interaction`, `state-change`, `ui-update`, `email-validation`

이들은 v1의 `REMOVE_CANDIDATE`(24건)와 대체로 겹친다. 실제 제거는 하지 않고 후보로만 남긴다.

### 7.4 Alias 백필 (P1)

Open-book의 alias 22건을 master로 옮긴다. 자세한 표는 §2.3.
**master를 alias의 단일 source of truth로 삼고 Open-book이 이를 참조하는 방향을 권장한다.** (현재는 반대로 갈라져 있다)

---

## 8. Relationship Candidates

전체 22건은 `data/reviews/relation-candidates-phase1.json`. **기존 12종 ontology만 사용했고 신규 type은 제안하지 않는다.**

주요 항목:

| source | relation | target | reason | confidence |
|---|---|---|---|---|
| `async-await` | `based_on` | `promise` | async 함수는 Promise를 반환하고 await는 Promise를 대상으로 동작. **Group B의 핵심** | HIGH |
| `fetch-api` | `based_on` | `promise` | fetch()는 Promise를 반환 | HIGH |
| `promise` | `compare_with` | `callback` | 같은 문제의 두 방식 비교 | HIGH |
| `promise` | `evolved_from` | `callback` | 콜백 조합 문제 해결이라는 **설계 동기** 관계 | MEDIUM |
| `ajax` | `uses` | `xmlhttprequest` | 기법 → 구현 수단 | HIGH |
| `ajax` | `uses` | `fetch-api` | 동상 | HIGH |
| `fetch-api` | `compare_with` | `xmlhttprequest` | 동일 목적 API 비교 | HIGH |
| `event-handler` | `based_on` | `user-event` | 핸들러는 이벤트 발생을 전제로 실행 | HIGH |
| `add-event-listener` | `uses` | `event-handler` | 등록 수단 → 등록 대상 | HIGH |
| `add-event-listener` | `compare_with` | `inline-onclick-handler` | M01이 명시적으로 대비 | HIGH |
| `prevent-default` | `compare_with` | `event-propagation` | **가장 많이 혼동되는 쌍** | HIGH |
| `dom` | `is_a` | `browser-web-api` | DOM은 언어가 아니라 브라우저 API | HIGH |
| `single-page-application` | `compare_with` | `multi-page-application` | 발전 아님, 선택지 비교 | HIGH |

### 반려 / 조건부 7건

| 제안 | 판정 | 이유 |
|---|---|---|
| `async-await evolved_from callback` | **REJECT** | async/await는 콜백이 아니라 **Promise 위에** 만들어졌다. evolved_from은 실제 기반인 Promise를 건너뛴다. **이 edge는 현재 frontend map에 MEDIUM으로 이미 존재한다 → 수정 후보** |
| `SPA evolved_from MPA` | REJECT | MPA는 대체되지 않았다. 틀린 역사 서사(§12) |
| `fetch-api evolved_from xmlhttprequest` | CONDITIONAL | 설계 의도가 문서화되어 방어 가능. MEDIUM 유지, `compare_with`를 주 관계로 |
| `Event Bubbling` canonical 신설 | REJECT | 전파 3단계의 일부만 term화하게 됨 → `event-propagation` 사용 |
| `Call Stack`/`Task Queue`를 `stack`/`queue`에 병합 | REJECT | 자료구조와 실행 모델은 다른 개념 |
| `Web API`를 그대로 canonical 명칭으로 | REJECT | `rest-api`와 충돌 |
| `Event`를 `user-event` alias로 추가 | REJECT | 사용자 이벤트 ⊂ 이벤트. 개념 축소 |

---

## 9. Concept Connection Candidates

### Group A — AJAX / XMLHttpRequest / Fetch API

- **핵심 질문에 대한 답: AJAX는 기법이다.** API도 라이브러리도 아니다.
- 관계 성격: **기법 ↔ 구현 API** (`uses`)
- 세 항목을 같은 층위로 나열하면 안 된다.
- 주의: 이름의 "XML"은 역사적 잔재다. `Asynchronous JavaScript and XML` 풀네임을 정의로 쓰면 안 된다(오늘날 JSON이 일반적).
- 필요 신규 canonical: `ajax`, `xmlhttprequest` (후자는 map에 이미 `foundation:xml-http-request`로 존재)

### Group B — Callback / Promise / async-await

- **핵심 질문에 대한 답: 단순 '구형 → 신형'으로 표현하면 안 된다.**
- `async/await` —`based_on`→ `Promise` (구조 관계, HIGH)
- `Promise` —`compare_with`→ `Callback` (비교)
- `Promise` —`evolved_from`→ `Callback` (설계 동기, MEDIUM)
- **async/await와 Callback 사이에 직접 `evolved_from`을 두지 않는다.** 현재 map에 있는 해당 edge는 수정 후보다.
- 필요 신규 canonical: `callback` (`usecallback`과 절대 혼동 금지)

### Group C — Event / Event Handler / addEventListener / preventDefault / Event Propagation

- **3층 구조로 답한다**: Event(발생한 사건) → Event Handler(반응 함수) → addEventListener(등록 수단)
- `preventDefault`는 **기본 동작 취소**이고 **전파 중단이 아니다**. `stopPropagation`과 다르다.
- 관계 성격: **동작 관계** (`based_on` / `uses`)
- 필요 신규 canonical: `prevent-default`, `event-propagation`
- 기존 `event-handler`·`user-event`는 canonical이지만 **설명도 없고 지도에도 없다**

### Group D — HTML / DOM

- **핵심 질문에 대한 답: 이미 가능하다.** `content/terms/dom.md`가 파싱 입력(HTML 소스) vs 파싱 결과물(객체 트리),
  브라우저 보정, 런타임 변경 반영을 정확히 서술한다. 이번 감사에서 확인한 최고 품질 항목이다.
- 관계 성격: **구조/개념 관계**. `dom based_on html` edge는 이미 존재한다.
- 추가 작업 최소. `dom-update` MERGE만 처리하면 된다.

### Group E — MPA / SPA

- **핵심 질문에 대한 답: 아키텍처 선택지 비교다. 발전 관계가 아니다.**
- `SSR`과 혼동 금지: **MPA는 라우팅/문서 단위 아키텍처, SSR은 렌더링 위치 전략이다. SPA도 SSR을 쓴다.**
- 필요 신규 canonical: `multi-page-application`
- 현재 MPA가 없어 SPA만 존재하는 상태 자체가 "SPA가 MPA를 대체했다"는 오해를 만든다.

---

## 10. Evolution Flow Candidates

`evolved_from`을 쓸 수 있는 후보는 **매우 적다.**

| 흐름 | 판정 | confidence |
|---|---|---|
| Callback → Promise | 사용 가능 (설계 동기) | MEDIUM |
| XMLHttpRequest → Fetch API | 사용 가능 (설계 의도 문서화) | MEDIUM |
| Promise → async/await | **사용 금지** — `based_on`이다 | — |
| MPA → SPA | **사용 금지** — `compare_with`다 | — |
| Cookie → localStorage | 현재 map에 MEDIUM으로 존재. 유지하되 재검토 대상 | MEDIUM |

불확실한 것은 전부 `REVIEW`로 둔다. 시간상 뒤에 등장했다는 사실만으로 `evolved_from`을 붙이지 않는다.

---

## 11. Technology Atlas Recommendations

### 현재 진단

Atlas는 **아직 과부하 상태가 아니다.** 10개 map / 250 nodes / 237 edges로 map당 평균 25 node이며,
`regions`·`learningRoutes`·`nodeRole`(core/foundation/boundary/shared)로 복잡도를 이미 통제하고 있다.
`foundation:` 노드 설계는 특히 좋은 판단이다.

진짜 위험은 복잡도가 아니라 **커버리지 불균형**이다: 549개 중 227개만 지도에 있고 322개는 어디에도 없다.

### Atlas에 넣을 것

- 분야 내 위치를 보여 주는 관계: `is_a`, `based_on`, `provided_by`, `defined_by`
- `dom based_on html`, `dom is_a browser-web-api`, `fetch-api based_on promise`
- `SPA compare_with MPA` (선택지 비교는 위치 정보이므로 지도에 적합)

### Atlas에 넣지 않을 것

- Group B의 3자 관계 전체 (Callback/Promise/async-await의 비교 + 발전 + 구조를 한 화면에 그리면 화살표 의미가 뒤섞인다)
- Group C의 5개 항목 전개 (동작 순서는 지도가 아니라 흐름도로 표현해야 한다)
- 미션 전용 CLI 명령어 15건 (§7.2 결정 전까지)

### Concept Connection으로 분리할 것

Group A / B / C 전체. 이유:

> **Atlas의 질문은 "이 기술이 어디에 위치하는가"이고, Concept Connection의 질문은 "왜 연결되는가"다.**
> Group B·C는 후자에만 답한다. 지도에 넣으면 같은 화살표가 비교·구조·시간 순서를 동시에 뜻하게 된다.

### 표시 복잡도 제안

1. **edge 종류를 시각적으로 구분하라.** 현재 12종이 한 종류의 선으로 그려지면 `compare_with`와 `evolved_from`이 같아 보인다. 최소한 **구조(실선) / 비교(점선) / 발전(화살표 강조)** 3계열로 나눌 것.
2. **`evolved_from`은 Atlas 기본 뷰에서 숨기고 Evolution Flow 전용 뷰에서만 표시**하는 것을 권한다. 발전 서사는 오해 비용이 가장 크다.
3. `foundation:` 노드 중 canonical term과 이름이 겹치는 3건은 `term:`으로 바인딩해 지도→용어 페이지 이동을 복구한다.

---

## 12. Content Writing Guideline Draft

이번 감사에서 실제로 발견된 문제에 근거한 원칙이다. 향후 `docs/03_content_writing_guide.md` 갱신 또는 별도 guideline 문서의 초안으로 쓸 수 있다.

### 정의

1. **정확성을 먼저 확보한다.** 쉬운 설명과 정확한 설명이 충돌하면 정확성을 우선한다.
2. **정의 없는 설명을 쓰지 않는다.** "~는 핵심 개념입니다"는 정의가 아니다. `한 줄 설명`과 `정확한 설명`이 같은 문장이면 둘 중 하나는 작성되지 않은 것이다.
3. **순환 정의 금지.** 용어를 그 용어로 설명하지 않는다.
4. **비유는 정의를 대체하지 않는다.** 비유를 쓰려면 그 앞이나 뒤에 반드시 기술적 정의가 있어야 한다.

### 개념 경계

5. **개념과 구현 방법을 구분한다.** (AJAX=기법 / XHR·Fetch=구현 API)
6. **라이브러리·API·함수·아키텍처를 같은 층위로 나열하지 않는다.** (`fetch()` 함수 ≠ Fetch API)
7. **부분을 전체 이름으로 쓰지 않는다.** (Event Bubbling은 Event Propagation의 한 단계)
8. **사례값을 개념명으로 쓰지 않는다.** (`시간당 60회 제한` ✗ → `Rate Limiting` ○, `0.0.0.0/0` ✗)
9. **미션 산출물·제출 요구사항은 기술용어가 아니다.** 디렉터리명·파일명·과제 명령어는 별도로 다룬다.

### 관계

10. **발전 관계와 비교 관계를 구분한다.** 시간상 뒤에 나왔다는 사실만으로 `evolved_from`을 쓰지 않는다.
11. **B가 A 위에 만들어졌으면 `based_on`이지 `evolved_from`이 아니다.** (async/await ← Promise)
12. **대체되지 않은 선택지에 발전 화살표를 그리지 않는다.** (MPA ↔ SPA)
13. **관련 용어는 많이 연결하지 않는다.** 미션에서 실제로 필요한 연결을 우선한다. 자기 자신을 관련 용어에 넣지 않는다.
14. **역사적 사실이 불확실하면 `REVIEW`로 둔다.** 추측으로 서사를 만들지 않는다.

### 수준

15. **대상은 개발 입문자다.** 정확성 → 핵심 개념 → 사용 맥락 → 세부사항 순서를 지킨다.
16. **내부 구현 구조는 학습 가치가 있을 때만 넣는다.** (Event Loop를 M01 core로 올리지 않는다)

### 표기

17. **한글 표기를 제공한다.** `term_ko`가 `term_en`과 같은 영문이면 검색·기억이 어렵다.
18. **한 term에 두 개념을 넣지 않는다.** (`NumPy, pandas`, `arm64, x86_64`)
19. **섹션 역할을 지킨다.** `흔한 오해`에는 오해를 쓴다. 장점 서술을 쓰지 않는다.
20. **코드 예는 저장소의 다른 경고와 모순되면 안 된다.** (fetch 예제는 `response.ok`를 검사한다)

---

## 13. Proposed Implementation Batches

각 Batch는 독립 commit 가능하고, 앞 Batch의 결정에 의존한다.

### Batch 0 — Glossary validator 신설 (**먼저 할 것**)

§14의 자동 검사 항목을 `scripts/validate_glossary.py`로 구현한다.
**이후 모든 Batch가 이 validator로 회귀를 막는다.** 데이터를 고치기 전에 검사기를 먼저 만든다.

### Batch 1 — Canonical 정리 (데이터 수정 없음 → 결정)

- §7.2 미션 전용 CLI 15건의 scope 결정 (owner 판단 필요)
- §7.3 디렉터리/파일/요구사항형 canonical 처리 방침 결정
- P0 MERGE 3건 확정: `o`→`time-complexity`, `data-json`→`json`, `dom-update`→`dom`

### Batch 2 — P0 naming 수정

`rate-limiting`, `breakpoint`, `listen-address`, `default-route-any-ipv4`, `numpy-pandas`,
`cpu-architecture`/`arm64-x86-64` 한영 뒤바뀜, `let-s-encrypt` 문장부호.
**alias로 구 표기를 반드시 보존해 검색을 유지한다.**

### Batch 3 — M01 후보 반영

- 신규 canonical 7건 추가: `ajax`, `xmlhttprequest`, `callback`, `browser-web-api`, `prevent-default`, `event-propagation`, `multi-page-application`
- `promise` importance 재검토
- Open-book alias 22건 master 백필

### Batch 4 — 콘텐츠 재작성

- 4a: placeholder 42건 중 **MERGE 후보 3건(`client-side-route`, `json`, `time-complexity`)을 제외한 39건**
  — 병합될지 모르는 term의 설명을 먼저 쓰지 않는다
- 4b: mid-tier 결함 수정 (§5.1 `async-await` 코드 예, §5.2 `add-event-listener` 오해 섹션, §5.3 429 보강)
- 4c: 외부 검증 필요 20건은 공식 문서 대조 후 별도 처리

### Batch 5 — Relation 반영

§8의 22건을 knowledge map에 반영.
동시에 `async-await evolved_from foundation:callback-pattern` edge를 수정하고,
`foundation:promise`/`http`/`cookie`를 canonical term으로 바인딩한다.

### Batch 6 — Concept Connection 콘텐츠/UI

Group A·B·C를 Atlas와 분리된 학습 콘텐츠로 구현. Group D·E는 관계 반영만으로 충분.

### Batch 7 — Atlas / Open-book 동기화 + 표시 복잡도

edge 종류 시각 구분, `evolved_from` 전용 뷰, M01 Open-book 커버리지 확대(현재 23/68).

---

## 14. 자동 검사 가능 항목 (Validator 후보)

### 이미 구현되어 있어 **다시 제안하지 않는 것**

`validate_knowledge_map.py`가 이미 검사한다: duplicate map/node/edge/overlay id, broken relation target,
**orphan node**, invalid relation type, invalid field/region/role, canonical binding, term-map-links 역참조, 출처 URL 형식.
`validate_technology_field_atlas.py`가 검사한다: 분류 중복, **전수 커버리지**, unknown field, invalid mission status, matrix 정합성.

### 신규 제안 — `scripts/validate_glossary.py` (현재 **glossary master를 검증하는 validator가 없다**)

| # | 검사 | 이번 감사 실측 | 심각도 |
|---|---|---:|---|
| 1 | duplicate canonical id | 0 | error |
| 2 | **정규화 표기 충돌** (NFKC + 공백/기호 제거 후 ko/en/alias 교차) | **10쌍** | warn |
| 3 | alias collision (두 term이 같은 alias 보유) | 6 | warn |
| 4 | `related_terms` 대상이 canonical인가 | 0 | error |
| 5 | `content_status: drafted` ↔ `content/terms/*.md` 존재 일치 | 0 | error |
| 6 | **콘텐츠 순환 정의 탐지** (`한 줄 설명` == `정확한 설명`) | **20** | error |
| 7 | **보일러플레이트 템플릿 문장 잔존** | **42** | error |
| 8 | **`관련 용어`가 자기 자신만 참조** | **32** | error |
| 9 | **깨진 한국어 조사 템플릿** (`은(는)`, `이(가)`, `을(를)`) | **20** | error |
| 10 | **필수 섹션 존재 여부** (`한 줄 설명`/`정확한 설명`/`관련 용어`/`흔한 오해`) | 65/65 통과 | error |
| 11 | `term_ko` == `term_en` (한글 표기 없음) | 232 | info |
| 12 | 이름에 리터럴 값 포함 (IP/포트/px/횟수) | 4 | warn |
| 13 | `term_en`에 쉼표(한 term 다개념) | 53 | info |
| 14 | mission_refs 0건 | 0 | error |
| 15 | **`foundation:` 노드 라벨이 canonical term과 충돌** | **3** | warn |
| 16 | **Open-book alias ⊄ master alias** | **22** | warn |
| 17 | Open-book `quick_terms`가 canonical인가 | 0 | error |
| 18 | **파일명 대소문자 충돌** (`readme` term ↔ `README.md`) | **1** | warn |

> #18 주의: macOS는 대소문자를 구분하지 않아 `content/terms/readme.md` 존재 검사가 `README.md`에 매칭된다.
> 이 감사 스크립트 작성 중 실제로 오탐이 발생했다. Linux CI에서는 동작이 달라지므로 실제 디렉터리 목록으로 대조해야 한다.

### 사람이 판단해야 하는 것 (자동화 불가)

기술적 정확성, 개념 경계, 비유 적절성, `evolved_from` 타당성, merge/split 여부, 미션 전용 어휘의 canonical 자격, importance 등급.

---

## 15. 감사 자체의 한계

정직하게 기록한다.

1. **549개 설명문을 사람이 정독한 것이 아니다.** 설명문은 65개만 존재하고, 그중 12개를 정독했다. 나머지는 구조·패턴 기계 검사다.
2. **484개에 대한 `KEEP`은 "설명이 좋다"는 뜻이 아니다.** §0 참조.
3. **기술 역사 관련 판단은 외부 검증을 거치지 않았다.** Promise/Callback, Fetch/XHR의 `evolved_from`은 MEDIUM으로 두었다.
4. **npm 기반 테스트는 이 환경에서 실행하지 못했다** (§16).
5. v1의 177건 verdict를 재사용했으므로, v1의 오류가 있다면 일부 상속된다.

---

## 16. Test / Baseline 검증

이번 Phase는 기능 변경이 없으나 baseline 정상 여부를 확인했다.

| 명령 | 결과 |
|---|---|
| `python3 scripts/build_technology_field_atlas.py` | PASS |
| `python3 scripts/validate_technology_field_atlas.py` | **PASS** — 12 fields · 549 terms · 16 missions / confidence HIGH 539, MEDIUM 8, LOW 2 |
| `python3 scripts/build_frontend_m01_overlay.py` | PASS |
| `python3 scripts/build_wave2_knowledge_maps.py` | PASS |
| `python3 scripts/build_wave3_knowledge_maps.py` | PASS |
| `python3 scripts/build_wave1_mission_overlays.py` | PASS |
| `python3 scripts/build_web_data.py` | PASS |
| `python3 scripts/build_term_map_links.py` | PASS — 227 mapped terms · 236 term-map edges · 16 missions |
| `python3 scripts/validate_knowledge_map.py` | **PASS** — 10 implemented / 12 registry maps · 2 cross-field layers |

빌드 체인 실행 후 `git status`는 깨끗했다(산출물이 결정적이거나 gitignore 대상).

**실행하지 못한 것**: `npm run test`(vitest), `npm run build`, `npm run test:map-interaction`(playwright).
이 머신에 **Node.js/npm이 설치되어 있지 않다**(`node`, `npm` 모두 PATH·homebrew·nvm·volta·asdf 어디에도 없음).
이것은 이번 Audit 작업으로 생긴 문제가 아니라 **환경 제약**이다.
데이터 계층은 전부 Python이므로 위 검증으로 충분하나, **프런트엔드 회귀는 Node가 있는 환경에서 확인해야 한다.**

---

## 17. 다음 단계 요약

1. **Batch 0(validator)을 먼저 한다.** 데이터를 고치기 전에 검사기를 만든다.
2. **Batch 1의 scope 결정은 owner 판단이 필요하다** — 미션 전용 CLI 15건, 디렉터리/요구사항형 canonical.
3. 그 결정 전에는 **placeholder 콘텐츠 재작성을 시작하지 않는다.** 병합될 term의 설명을 먼저 쓰는 낭비를 막는다.
4. 신규 canonical은 7건으로 제한한다. 후보 19개 중 12개는 기존 canonical로 흡수된다.

---

*생성: Content Quality Audit Phase 1 · 기준 commit `e43f343` · product data 무수정*
