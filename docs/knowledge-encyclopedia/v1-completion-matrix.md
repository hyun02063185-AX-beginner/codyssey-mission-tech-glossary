# V1 Completion Matrix

> Product Completion Audit & V1 Closeout Planning 에서 작성 · 2026-09-24 · HEAD `519d476`
> **갱신: V1 Search Discovery Completion Sprint (2026-09-24, `2c0ddbd` 기준).** V1-R1 · V1-R2 완료.
> **이 표는 감사 결과다.** 여기서 구현한 것은 없다.
> 근거는 전부 이 저장소의 실제 데이터·코드·화면에서 확인했다. 과거 문서의 수치를 옮겨 적지 않았다.

**상태 값** — `COMPLETE` · `PARTIAL` · `DEFERRED` · `NOT_IMPLEMENTED` · `DROP_CANDIDATE`
**V1 분류** — `V1_REQUIRED` · `V1_OPTIONAL` · `POST_RELEASE` · `DEFERRED_FOR_DATA` · `DROP_CANDIDATE`

---

## 1. Core Glossary

| Feature | Current | V1 Class | 근거 | 남은 일 |
| --- | --- | --- | --- | --- |
| canonical 519 · 상세 519 | `COMPLETE` | `V1_REQUIRED` | `glossary.json` 519 · validator 0 error / 0 warning | 없음 |
| 용어 상세 9개 절 렌더 | `COMPLETE` | `V1_REQUIRED` | 화면 확인 (Quality Cycle 에서 `미션 맥락` 절 렌더 복구) | 없음 |
| **용어 검색 (한국어·영어·별칭·분야)** | **`COMPLETE`** | `V1_REQUIRED` | 분야 14개 × 입력어 65개를 `field-search.json` 으로 잇는다. `보안` 0→**52** · `운영체제` 0→**50** · `알고리즘` 0→**33** · `클라우드` 0→**14**. 분야 일치는 이름 일치보다 **항상 뒤**(점수 4 vs 최대 2) | 없음 (V1-R1 완료) |
| **검색 0건 화면** | **`COMPLETE`** | `V1_REQUIRED` | 링크 0개 → **4개**. 분야가 걸리면 그 분야의 길 3개, 걸리지 않으면 정직하게 0건 + 고정 이동 경로 4개. **추천은 만들지 않는다** | 없음 (V1-R2 완료) |
| 필터 6종 (분야·과정·중요도·상세·웹툰·미션) | `COMPLETE` | `V1_REQUIRED` | URL 동기화 확인 · 분야 14 · 미션 16 | 없음 |
| 분야 검색 라벨 데이터 | `COMPLETE` | `V1_REQUIRED` | `data/encyclopedia/field-search-labels.json` — category 14 × 입력어 65. **canonical alias 복제 0** · 새 taxonomy 0. 빌더가 누락·중복·미분류를 막는다 | 없음 |
| 필터 라벨 언어 | `PARTIAL` | `V1_OPTIONAL` | 분야 14개 라벨이 전부 영문. **검색이 한국어를 받게 되어 급함이 줄었다** | **V1-O1** |
| 웹툰 | `PARTIAL` | `V1_OPTIONAL` | `webtoons.json` 10건 중 이미지 **5건** | **V1-O2** |
| 흔한 오해 · 동료평가 질문 | `COMPLETE` | `V1_REQUIRED` | 값이 있을 때만 렌더하도록 가드됨 | 없음 |
| 콘텐츠 문체·깊이 균일화 | `PARTIAL` | `POST_RELEASE` | 문체 혼용 340 · 첫 문장 역전 333 · 명사구 종결 349 (전부 **검토 후보**, 판정 아님) | 사람 검증 후 판단 |

## 2. Encyclopedia

| Feature | Current | V1 Class | 근거 | 남은 일 |
| --- | --- | --- | --- | --- |
| Encyclopedia Home `#/encyclopedia` | `COMPLETE` | `V1_REQUIRED` | 진입 화면 · 5개 View 로 분기 | 없음 |
| Prerequisite View | `COMPLETE` | `V1_REQUIRED` | 선수 관계 보유 term **312 / 519** · path 166 | 없음 |
| Mission View (16) | `COMPLETE` | `V1_REQUIRED` | `missions.json` 16 · 기존 미션 페이지 위에 얹음 | 없음 |
| Academic View (14) | `COMPLETE` | `V1_REQUIRED` | active **13** · `sre` 는 declared (노출 기준 미달) | 없음 |
| Role View (10) | `COMPLETE` | `V1_OPTIONAL` | active **8** · `qa-engineer`·`site-reliability-engineer` limited | 없음 |
| Concept Connections | `COMPLETE` | `V1_OPTIONAL` | 6건 · 목록과 상세 모두 링크됨 | 없음 |
| **Timeline View** | **`NOT_IMPLEMENTED`** | **`DEFERRED_FOR_DATA`** | `evolved_from` **3건**(기준 ≥15) · 최장 사슬 **2**(기준: 길이 3 이상 사슬 ≥4개, 현재 **0**) · 고립 쌍 **3/3 = 100%**(기준 <40%) | 데이터가 기준에 닿을 때까지 **만들지 않는다** |
| 그래프 질의 계층 `src/encyclopedia.ts` | `COMPLETE` | `V1_REQUIRED` | 5개 질의 · component 직접 순회 금지 계약 | 없음 |
| 표시 경계 `src/learnerView.ts` | `COMPLETE` | `V1_REQUIRED` | `LEARNER_FIELDS` allowlist · `INTERNAL_KEYS` blocklist | 없음 |
| U14 SRE canonical 5건 | `DEFERRED` | `POST_RELEASE` | 519개 전수 검색 — `slo`·`sli`·`error-budget`·`incident`·`postmortem`·`availability`·`toil` **전부 없음.** 요구하는 미션도 없음 | **추가하지 않는다** |
| U15 Computer Architecture 5건 | `DEFERRED` | `POST_RELEASE` | `register`·`instruction-set`·`memory-hierarchy`·`pipeline`·`virtual-memory` **전부 없음.** 요구하는 미션도 없음 | **추가하지 않는다** |

## 3. Maps

| Feature | Current | V1 Class | 근거 | 남은 일 |
| --- | --- | --- | --- | --- |
| 분야 지도 10 + cross-field layer 2 | `COMPLETE` | `V1_REQUIRED` | `map-registry.json` 12건 — implemented 10 · cross-field-layer 2 (docs/12 설계대로) | 없음 |
| 미션 overlay 18 | `COMPLETE` | `V1_REQUIRED` | `*-overlay-*.json` 18개 · 미션 16개 전부 경로 있음 | 없음 |
| **지도 노드 → Encyclopedia 왕래** | `COMPLETE` | `V1_REQUIRED` | `localStorage` 노드 패널에서 확인 — `#/terms/local-storage` · `#/prerequisites/local-storage` · `#/academic/web-programming` · `#/missions/main-M01` **4개 링크** | 없음 |
| 지도 내 검색 · 경로 · 줌 · 맞춤 | `COMPLETE` | `V1_REQUIRED` | 프론트엔드 지도에서 확인 (경로 7개 · 지도 용어 찾기 · 줌 3종) | 없음 |
| 전체 지도 ↔ 미션 필터 전환 | `COMPLETE` | `V1_REQUIRED` | `전체 / 본과정 M01 / 본과정 M02` 토글 확인 | 없음 |
| `term-map-links` | `COMPLETE` | `V1_REQUIRED` | term **226** / mission 16 | 없음 |

## 4. Learning

| Feature | Current | V1 Class | 근거 | 남은 일 |
| --- | --- | --- | --- | --- |
| 학습자 콘텐츠 기준 (`09`) | `COMPLETE` | `V1_REQUIRED` | 대상 독자 · 읽기/이해 분리 · 계층 L1~L4 · 비유 정책. **가설이며 학습자 검증 전** | 없음 |
| 콘텐츠 감사 도구 4종 | `COMPLETE` | `V1_REQUIRED` | `content:quality` · `content:specificity` · `content:map-reasons` · `content:readability` | 없음 |
| Owner 검토용 Pilot 비교본 11 | `COMPLETE` | `V1_REQUIRED` | `learner-pilot-comparison.md` · CURRENT 를 `glossary.json` 에서 읽는다 | 없음 |
| **학습자 테스트 (사람)** | **`NOT_IMPLEMENTED`** | **`POST_RELEASE`** | 배치 4명 · 읽기 18회 · 기록지 준비 완료. **아직 아무도 수행하지 않았다** | **출시 후 상시 검증**으로 이동 (§2) |
| 가설 4종 판정 | `NOT_IMPLEMENTED` | `POST_RELEASE` | 전부 `UNJUDGED`. 관찰이 없으므로 판정하지 않는다 | 관찰 입력 후 |
| Learner Feedback 수집 화면 | `NOT_IMPLEMENTED` | `POST_RELEASE` | 유형 8종은 정의됨. **UI 는 이번 Cycle 범위 밖** | 유형 정의만 유지 |
| Mission Learning Bridge 절차 | `COMPLETE` | `V1_REQUIRED` | `mission-learning-bridge.md` — 이번 Cycle 작성 | 없음 |
| Mission Learning Bridge 구현 | `NOT_IMPLEMENTED` | `POST_RELEASE` | 입력 경로·대기열·registry 없음. **절차가 먼저다** | 절차 확정 후 |
| 학습 진도 · 레벨 · 퀴즈 · 점수 · 게이미피케이션 | `NOT_IMPLEMENTED` | **`DROP_CANDIDATE`** | 요구된 적 없다. 아이디어라는 이유로 만들지 않는다 | **만들지 않는다** |
| AI 챗봇 · 추천 | `NOT_IMPLEMENTED` | **`DROP_CANDIDATE`** | 같음 | **만들지 않는다** |

## 5. Supporting Product

| Feature | Current | V1 Class | 근거 | 남은 일 |
| --- | --- | --- | --- | --- |
| Chrome Extension 0.4.2 | `COMPLETE` | `V1_REQUIRED` | manifest v3 · sidePanel · `usr.codyssey.kr` content script · 빌드 산출물 8종 | 없음 |
| Extension ↔ 사전 데이터 격리 | `COMPLETE` | `V1_REQUIRED` | `glossary.json`·`openbook-main-m01.json`·`term-map-links.json` 만 복사 — Encyclopedia 영향 없음 | 없음 |
| Open-book (M01) | `PARTIAL` | `POST_RELEASE` | 요구사항 11 · quick term 23. **16 미션 중 1개.** M01 동료평가용으로 만든 것이며 확장은 별도 판단 | 나머지 15 미션은 요구된 적 없음 |
| 웹 배포 (GitHub Pages) | `COMPLETE` | `V1_REQUIRED` | `.github/workflows/deploy-pages.yml` · main push 시 자동 | 없음 |
| Deep link · 뒤로가기 | `COMPLETE` | `V1_REQUIRED` | `#/prerequisites/tcp` 직접 진입 → `#/academic/database-systems` → 뒤로가기로 복귀 확인 | 없음 |
| 잘못된 URL 처리 | `COMPLETE` | `V1_REQUIRED` | 없는 slug 는 안내 + 상위 지도 링크를 준다 (막다른 길 아님) | 없음 |
| 모바일 (375px) | `COMPLETE` | `V1_REQUIRED` | 홈·용어·선수학습·미션·학문·지도 **가로 넘침 없음.** `<pre class="code">` 만 내부 스크롤 (의도된 동작) | 없음 |
| 네비게이션 6종 | `COMPLETE` | `V1_REQUIRED` | 학습하기 · 미션 · 용어 찾기 · 기술 지도 · 개념 연결 · 웹툰 | 없음 |
| `/roles` · `/prerequisites` · `/academic` 진입 | `COMPLETE` | `V1_OPTIONAL` | 상단 네비에는 없고 Encyclopedia Home 에서만 간다 (F01/F02 이후 의도된 구조) | 없음 |

## 6. Operations

| Feature | Current | V1 Class | 근거 | 남은 일 |
| --- | --- | --- | --- | --- |
| validator 4종 | `COMPLETE` | `V1_REQUIRED` | glossary · atlas · knowledge-map · content-tier 전부 PASS | 없음 |
| `content:integrity` | `COMPLETE` | `V1_REQUIRED` | 미션 문맥 모순 ERROR · 템플릿 재사용 WARNING · 고정 예시 INFO | 없음 |
| 생성기 차단 guard | `COMPLETE` | `V1_REQUIRED` | Sprint 7 생성기 9개 · `CODYSSEY_ALLOW_CONTENT_REGENERATION=1` 없이는 실행 불가 | 없음 |
| Impact Review Gate | `COMPLETE` | `V1_REQUIRED` | `report_encyclopedia_impact.py` — delta 검토 | 없음 |
| 자동 테스트 | `COMPLETE` | `V1_REQUIRED` | unit **82 PASS** · Playwright **31 PASS** (`scripts/qa_playwright.py`, 포트 6421). Search Sprint 에서 unit +22 · Playwright +9 | 없음 |
| **CI 가 테스트를 돌리지 않는다** | **`PARTIAL`** | **`V1_OPTIONAL`** | `deploy-pages.yml` 은 `npm ci` + `npm run build` 만 한다. **`npm run test` 가 없다** | **V1-O3** |
| Extension 배포 산출물 동기화 | `COMPLETE` | `V1_REQUIRED` | Audit 에서 `dist-extension/glossary.json` 이 stale 한 것을 발견해 재생성 (12곳 불일치). `content/terms` 수정 시 `build:extension` 도 돌리는 규칙을 상태 문서에 추가 | 없음 |
| RC1 보호 검증 | `COMPLETE` | `V1_REQUIRED` | `git diff glossary-rc1 -- data/curated data/knowledge-maps extension` **비어 있음** | 없음 |
| Owner Gate 대기 (U8·U13·U14·U15·U16) | `DEFERRED` | `POST_RELEASE` | 5건 전부 `INDEPENDENT` — 서로 막지 않는다 | 사람 판단 |
| Governance 모델 (`06`) | `COMPLETE` | `V1_REQUIRED` | 변경 없음. **새 Agent 를 만들지 않았다** | 없음 |

---

## 7. 집계

| V1 분류 | 건수 |
| --- | --- |
| `V1_REQUIRED` — 완료 | **38** |
| **`V1_REQUIRED` — 미완** | **0** |
| `V1_OPTIONAL` | 6 — 그중 backlog 항목 3 (V1-O1 · V1-O2 · V1-O3) |
| `POST_RELEASE` | 9 |
| `DEFERRED_FOR_DATA` | 1 (Timeline) |
| `DROP_CANDIDATE` | 2 |

감사 때 37이던 `V1_REQUIRED` 가 38이 된 것은 Search Sprint 가 **분야 검색 라벨 데이터** 한 줄을
새로 세웠기 때문이다. 기능을 늘린 것이 아니라 V1-R1 을 풀면서 생긴 자산을 표에 올린 것이다.

**V1_REQUIRED 미완이 0건이므로 판정은 `ENCYCLOPEDIA_V1_FEATURE_COMPLETE` 다.**

```
들어온다 ✅  →  찾는다 ✅  →  이해한다 ✅  →  다음으로 간다 ✅
```

`찾는다` 안에서 direct term search · alias search · Korean domain search ·
zero-result recovery 가 모두 동작한다. 자세한 내용은
[`v1-search-discovery-completion.md`](../../reports/knowledge-encyclopedia/v1-search-discovery-completion.md).

남은 것은 전부 출시를 막지 않는다 — `V1_OPTIONAL` 6 · `POST_RELEASE` 9 ·
`DEFERRED_FOR_DATA` 1(Timeline) · `DROP_CANDIDATE` 2.
