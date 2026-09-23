# Product Completion Audit & V1 Closeout Planning

> 2026-09-24 · 기준 HEAD **`519d476`** · branch `main` · working tree clean
> **이번 Cycle 은 Audit 이다.** 기능을 구현하지 않았고, UI 를 바꾸지 않았고,
> relation·canonical·content·ontology 를 건드리지 않았다.
> 감사 중에 고치고 싶은 것이 보여도 **기록만 했다.**

**판정: `ENCYCLOPEDIA_V1_DEVELOPMENT_REQUIRED`**

---

## A. 저장소 상태 확인 (먼저 한 일)

이전 대화에서 언급된 commit 을 HEAD 로 가정하지 않고 저장소에서 직접 읽었다.

```
branch   main (clean, origin 과 동기)
HEAD     519d476  docs(encyclopedia): prepare the learner comprehension human calibration
tag      glossary-rc1 · encyclopedia-views-v1 · encyclopedia-learning-baseline-v1
         glossary-content-integrity-v1 · glossary-content-quality-v1
RC1 보호  git diff glossary-rc1 -- data/curated data/knowledge-maps extension  →  비어 있음
```

수치는 전부 `src/data/generated/` 의 실제 파일과 화면에서 다시 셌다.
문서에 적힌 값을 옮겨 적지 않았다.

| | 값 |
| --- | --- |
| canonical / 상세 | 519 / 519 |
| 그래프 node | 578 (term 519 · foundation 17 · mission 16 · academic 14 · field 12) |
| authored edge / derived | 546 / 2,874 · path 166 · cluster 36 |
| 선수 관계 보유 term | 312 / 519 |
| 지도 | registry 12 — implemented 10 · cross-field-layer 2 |
| 미션 overlay | 18 · `term-map-links` term 226 / mission 16 |
| 웹툰 / 개념 연결 | 10 (이미지 5) / 6 |
| Open-book | M01 1건 — 요구사항 11 · quick term 23 |
| Extension | 0.4.2 (manifest v3) |
| 자동 테스트 | unit 60 · Playwright 22 (실행 결과는 §N-2) |

---

## B. Human Calibration 의 위치를 옮겼다

학습자 테스트는 **아직 아무도 수행하지 않았다.** 이것은 실패도 미완성 기능도 아니다.
출시를 막는 관문에서 빼고 **출시 후 상시 검증**으로 옮긴다.

```
이전:  Human Calibration  →  release blocking gate
이후:  Human Calibration  →  POST_RELEASE_CONTINUOUS_VALIDATION
```

**보존한 것 — 지우지도 다시 만들지도 않았다.**

- Pilot 11건과 CURRENT / PROPOSED 비교본 (`learner-pilot-comparison.md`)
- 교차 배치 4명 · 읽기 18회 (`ALLOCATION`, 규칙 검사 포함)
- 관찰 schema (RESTATE · WHY · UNKNOWN_WORDS · CONFUSION_POINT · EXAMPLE_HELPED · OBSERVER_NOTE)
- 이해 측정 방법 — 화면을 가리고 자기 말로 설명하게 한다
- AI 예측 봉인과 가설 4종 (`UNJUDGED` 그대로)

**선언하지 않은 것**

> `LEARNER_CONTENT_MODEL_VALIDATED` — **선언하지 않는다.**
> 사람이 검증하지 않았기 때문이다. 상태 문서에도 그렇게 적었다.

---

## C. Mission Learning Bridge 를 운영 계약으로 문서화했다

새 문서: [`docs/knowledge-encyclopedia/mission-learning-bridge.md`](../../docs/knowledge-encyclopedia/mission-learning-bridge.md)

핵심은 한 줄이다.

```
Mission Learning Handoff  !=  automatic glossary update
```

미션에서 기술이 나왔다는 사실은 결론이 아니라 **Learning Evidence Source** 다.
Candidate 가 되려면 실제 학습 근거가 있어야 하고, 그 앞에 **User Approval Gate** 가 선다.

**근거로 인정하지 않는 것**을 문서에 명시했다 — 코드에 나왔다 / import 에 있다 /
라이브러리 이름 / 요구사항에 단어가 있다 / AI 가 중요해 보인다고 판단했다 / coverage 가 비었다.

Glossary Review 판정 8종을 **위에서부터** 보게 했다:
`EXISTING_TERM_ENRICHMENT` → `MISSION_CONNECTION` → `ADVANTAGE_LIMITATION_ENRICHMENT` →
`RELATED_TERM_CONNECTION` → `MERGE_INTO_PARENT_CONCEPT` → `NEW_CANONICAL` → `DEFER` → `NO_CHANGE`.
`NEW_CANONICAL` 은 마지막 선택지이고 `DEFER`·`NO_CHANGE` 는 정상적인 결과다.

**이것은 지식 수집·근거 workflow 이지 새 node/relation taxonomy 가 아니다.**
node 5종과 relation 12종은 그대로다. 구현은 하지 않았다 — 절차가 먼저 서야
도구가 맞게 만들어진다.

---

## D. Timeline readiness 를 다시 계산했다 — 바뀌지 않았다

`08-view-contracts.md` §5 에 적힌 기준으로 그래프에서 직접 셌다.

| 항목 | 기준 | 지금 | 판정 |
| --- | --- | --- | --- |
| `evolved_from` 수 | ≥ 15 | **3** | 미달 |
| 길이 3 이상 사슬 | ≥ 4개 | **0** (최장 사슬 노드 2개) | 미달 |
| 고립 pair 비율 | < 40% | **100%** (3쌍 모두 고립) | 미달 |
| 근거 품질 | reason + 출처 | 3건 모두 출처 있음 | 충족 |
| narrative path | ≥ 3개 | 0 | 미달 |

세 edge 는 서로 닿지 않는다.

```
term:fetch-api        ← foundation:xml-http-request
term:json-web-token   ← term:login-session
term:local-storage    ← term:cookie
```

**데이터가 여전히 부족하므로 억지로 구현하지 않는다.** `DEFERRED_FOR_DATA` 유지.

---

## E. U14 SRE · U15 Computer Architecture — 추가하지 않는다

canonical 519개 전체 id 에서 후보 낱말을 직접 검색했다.

| 후보 | 결과 |
| --- | --- |
| U14 — `slo` · `sli` · `error-budget` · `incident` · `postmortem` · `availability` · `toil` | **하나도 없다** |
| U15 — `register` · `instruction-set` · `memory-hierarchy` · `pipeline` · `virtual-memory` | **하나도 없다** |

`docs/13` 의 Candidate register 는 둘 다 "요구하는 미션이 없다"고 적고 있고,
이번 감사에서도 새 미션 근거를 찾지 못했다.

**Coverage 를 채우기 위한 추가는 하지 않는다.** Mission Learning Bridge §4 의
"근거로 인정하지 않는 것" 중 `coverage 가 비어 있다` 가 바로 이 경우다.
Owner Gate 에 그대로 둔다.

---

## F. 탐색 감사 — 여기서 제품이 끊긴다

§16 의 시나리오를 실제 화면에서 해 봤다.

| 시나리오 | 결과 |
| --- | --- |
| "API 가 궁금하다" | **통과** — 11건, 상세로 이어진다 |
| "무엇부터 공부해야 할지 모르겠다" | **통과** — 홈의 `무엇부터 볼지 모르겠다면` → 학습 지도 |
| "미션에서 본 용어를 찾고 싶다" | **통과** — 미션 필터 16개 + 미션 페이지 |
| "이 개념 다음에 뭘 봐야 하나" | **통과** — 선수학습 · 관련 용어 · 학문 지도 |
| **"데이터베이스를 공부하고 싶다"** | **막힌다** |

### F-1. 한국어 분야어가 검색되지 않는다

`src/searchTerms.ts` 는 `termKo` · `termEn` · `aliases` **만** 본다.
`category` 도 학문 분야도 검색 대상이 아니다. 실제로 세어 봤다.

| 입력 | 결과 | 사전에 있는 해당 분야 term |
| --- | --- | --- |
| 보안 | **0건** | 52 |
| 운영체제 | **0건** | 50 |
| 알고리즘 | **0건** | 33 |
| 클라우드 · 배포 · 리눅스 · 자료구조 · 인공지능 · 프론트엔드 · 백엔드 · 서버 · 테스트 · 도커 | **전부 0건** | — |
| 데이터베이스 | 1건 | 46 |
| 네트워크 | 1건 | 29 |

흔한 한국어 분야어 **18개 중 12개가 0건**이다.
화면 안내문은 "한국어, 영어, 약어로도 찾을 수 있습니다" 라고 적혀 있다.

### F-2. 0건 화면이 막다른 길이다

`#/terms?q=보안` 의 `<main>` 안에는 **링크가 0개**다.

```
0개의 용어를 찾았습니다.
찾는 용어가 아직 등록되지 않았어요. 다른 표현이나 영어 이름으로도 검색해 보세요.
```

필터 4종은 화면에 있지만 `필터` 뒤에 접혀 있고, 0건 화면이 필터를 가리키지 않는다.
그리고 분야 필터의 라벨 14개는 **전부 영문**이다 — `Linux / OS`, `Algorithms / Data Structures`.
한국어로 찾다 실패한 사람에게 주어지는 회복 경로가 영문 라벨 뒤에 접혀 있는 셈이다.

**고치지 않고 기록했다.** V1_REQUIRED 판단이 먼저다 (§I).

---

## G. Navigation · Deep link · Mobile — 이상 없다

**Navigation.** route 20개 · 상단 네비 6종(학습하기 · 미션 · 용어 찾기 · 기술 지도 · 개념 연결 · 웹툰).
`/roles` · `/prerequisites` · `/academic` 은 Encyclopedia Home 에서만 가는데,
이것은 F01/F02 이후 **의도된 구조**이며 고아 화면이 아니다.

**왕래를 실제로 눌러 확인했다.** 프론트엔드 지도의 `localStorage` 노드 패널에서:

```
#/terms/local-storage            상세 사전에서 보기
#/prerequisites/local-storage    먼저 볼 개념 (이 용어 앞에 1개)
#/academic/web-programming       웹 프로그래밍
#/missions/main-M01              본과정 M01
```

지도 → Encyclopedia 의 네 방향이 전부 살아 있다.

**Deep link · 뒤로가기.** `#/prerequisites/tcp` 로 바로 들어가 렌더되고,
`#/academic/database-systems` 로 이동한 뒤 뒤로가기로 정확히 돌아온다. HashRouter 가 제 역할을 한다.

**잘못된 URL.** 없는 slug(`#/academic/databases`)는 안내와 함께 상위 지도 링크를 준다.
막다른 길이 아니다 — F-2 와 대비된다. **0건 검색 화면만 회복 경로가 없다.**

**Mobile 375px.** 홈 · 용어 상세 · 선수학습 · 미션 · 학문 · 지도에서 **페이지 가로 넘침 없음.**
`<pre class="code">` 만 530px 로 넓고 내부에서 스크롤된다 — 코드 블록의 올바른 동작이다.

---

## G-2. 배포 산출물이 뒤처져 있었다 (감사 중 발견)

QA 로 `npm run build:extension` 을 돌렸더니 `dist-extension/glossary.json` 이 바뀌었다.
저장소에 **stale 한 상태로 commit 되어 있었다.**

파싱해서 비교했다 — id 519개는 동일하고 **필드 12개만 다르다.**

| 필드 | 건수 | 내용 |
| --- | --- | --- |
| `easyExplanation` | 8 | 조사 표기 잔재 `는(은)` — Cleanup Cycle 에서 고친 것 |
| `missionRefs[].context` | 4 | 마크다운 백틱이 글자로 노출 — `prose()` 로 걷어낸 것 |

즉 **웹에서는 고쳐진 문장이 Chrome Extension 배포본에는 옛 상태로 남아 있었다.**
`src/data/generated/glossary.json` 은 최신이었고 `dist-extension/` 만 뒤처졌다.
`content/terms` 를 고친 뒤 `npm run build:extension` 을 돌리지 않은 것이 원인이다.

**처리** — 재생성해 commit 했다. 콘텐츠를 새로 쓴 것이 아니라
**이미 commit 된 source 를 파생물이 따라잡은 것**이므로 §24 의 "content rewrite" 가 아니다.
`git diff glossary-rc1 -- extension` 은 여전히 비어 있다(`dist-extension/` 은 빌드 산출물이며
RC1 보호 대상인 `extension/` 과 다르다).

**운영 규칙에 추가할 것** — `content/terms` 를 고치면 `npm run data:build` 뿐 아니라
`npm run build:extension` 도 함께 돌린다. 지금 상태 문서의 규칙에는 앞의 것만 적혀 있었다.

---

## H. 기능을 위한 기능은 만들지 않았다

아이디어라는 이유만으로 만들지 않은 것을 명시해 둔다.

| 만들지 않은 것 | 이유 |
| --- | --- |
| AI 챗봇 · 추천 | 요구된 적 없다 |
| 학습 점수 · 레벨 · 진도 | 같음. 학습자 검증도 없다 |
| 퀴즈 · 게이미피케이션 | 같음 |
| Timeline View | 데이터가 기준에 못 미친다 (§D) |

`DROP_CANDIDATE` 로 분류한다. 누군가 요구하면 그때 근거와 함께 다시 본다.

---

## I. V1 을 기능 수가 아니라 사용자 흐름으로 정의한다

V1 은 "몇 개를 만들었는가" 가 아니라 **한 사람이 끝까지 갈 수 있는가** 로 정한다.

```
[1] 들어온다        →  [2] 찾는다        →  [3] 이해한다      →  [4] 다음으로 간다
    홈 · 대백과 진입      용어 검색 · 필터      상세 9개 절          선수학습 · 관련 용어
    ✅ 이어진다           ❌ 끊긴다             ✅ 이어진다          ✅ 이어진다
                         (한국어 분야어)
```

**끊기는 곳은 한 군데뿐이다.** [2] 찾는다.
나머지 세 단계는 전부 이어지고, 지도·미션·학문·직무의 곁길도 이어진다.

그래서 V1_REQUIRED 는 두 건이고 둘 다 같은 자리에 있다.

### V1_REQUIRED 백로그

#### V1-R1 · 한국어 분야어로 검색이 되지 않는다

| | |
| --- | --- |
| **문제** | `searchTerms` 가 `termKo`·`termEn`·`aliases` 만 본다. 분야 이름으로는 찾을 수 없다 |
| **영향** | 흔한 한국어 분야어 18개 중 12개가 0건. 뒤에 있는 term 은 52 · 50 · 33 · 29 · 46개다. **초보 학습자가 가장 먼저 칠 낱말이 가장 잘 실패한다** |
| **범위** | `src/searchTerms.ts` 의 매칭 대상 확장 + 분야 14개의 한국어 라벨/별칭 데이터 |
| **의존** | 분야 한국어 라벨 매핑이 먼저 있어야 한다 (V1-R2 와 공유) |
| **변경 영역** | `src/searchTerms.ts` · 새 라벨 데이터 1개 · `src/App.tsx` 의 결과 표시(분야 일치 표시가 필요하면) |
| **하지 않을 것** | canonical 추가 · alias 대량 편집 · content 수정 · ontology 변경. **검색 계층에서만 푼다** |
| **QA** | `searchTerms.test.ts` 에 12개 실패 낱말을 회귀 케이스로 추가 · 브라우저에서 5개 시나리오 재실행 |
| **위험** | 분야어를 매칭하면 결과가 수십 건으로 늘어 정렬이 흐려질 수 있다. 분야 일치는 이름 일치보다 **뒤에** 오게 점수를 준다 |

#### V1-R2 · 검색 0건 화면에 회복 경로가 없다

| | |
| --- | --- |
| **문제** | `<main>` 안 링크 0개. "다른 표현으로 검색해 보세요" 만 있고 어디로 갈지 주지 않는다 |
| **영향** | 진짜 막다른 길이다. 없는 URL 을 쳤을 때보다 나쁘다 — 그쪽은 상위 지도 링크를 준다 |
| **범위** | 0건일 때의 안내 블록 — 분야 목록(한국어) · 학습 지도 · 미션별 보기로 가는 링크 |
| **의존** | 분야 한국어 라벨 매핑 (V1-R1 과 공유) |
| **변경 영역** | `src/App.tsx` 의 `/terms` 빈 결과 분기 |
| **하지 않을 것** | 페이지 재설계 · 필터 UI 개편 · 추천 알고리즘. **빈 화면에 길만 놓는다** |
| **QA** | Playwright 1건(0건 검색 → 링크가 있고 눌러서 목록에 닿는다) · 375px 확인 |
| **위험** | 안내가 길어지면 정상 검색 화면까지 무거워진다. **0건일 때만** 렌더한다 |

---

## J. Sprint 제안 — 의존 순서대로, 작고 검증 가능한 묶음

V1_REQUIRED 두 건만 다룬다. 다른 것은 넣지 않는다.

| 순서 | 묶음 | 내용 | 검증 |
| --- | --- | --- | --- |
| **B01** | 분야 한국어 라벨 매핑 | 분야 14개에 한국어 이름과 흔한 별칭을 붙인다. 데이터만 — 화면은 그대로 | unit: 14개 전부 라벨이 있고 중복 없음 |
| **B02** | 0건 화면 회복 경로 | 결과 0건일 때 분야 목록 · 학습 지도 · 미션별 보기 링크를 준다 | Playwright 1건 + 375px 확인 |
| **B03** | 검색 범위 확장 | 분야 라벨·별칭을 매칭 대상에 넣는다. 이름 일치보다 뒤에 정렬 | unit: 실패하던 12개 낱말이 전부 결과를 낸다 · 기존 18건 회귀 |
| **B04** | 시나리오 재확인 | §F 의 5개 시나리오를 브라우저에서 다시 해 본다 | 자동 테스트로 끝내지 않는다 |

**B01 이 B02·B03 을 모두 막는다.** B02 와 B03 은 서로 독립이므로 순서를 바꿔도 된다.
각 묶음은 혼자서 commit 가능하고 혼자서 되돌릴 수 있다.

**이 Sprint 에서 하지 않는 것**: V1_OPTIONAL · POST_RELEASE 의 어떤 항목도 함께 넣지 않는다.
콘텐츠는 한 글자도 고치지 않는다.

---

## K. V1_OPTIONAL 백로그

출시를 막지 않는다. 여유가 있으면 한다.

| # | 항목 | 왜 optional 인가 |
| --- | --- | --- |
| **V1-O1** | 분야 필터 라벨의 한국어 병기 | V1-R1 이 검색을 고치면 필터에 의존할 일이 줄어든다. `Database`·`Security`·`Network` 는 한국어권에서도 통용된다 |
| **V1-O2** | 웹툰 이미지 5건 보강 | 10건 중 5건에 이미지가 없지만 제목·목표 텍스트는 있고 흐름이 끊기지 않는다. 그림 제작은 별개 작업이다 |
| **V1-O3** | CI 에 `npm run test` 추가 | 지금 `deploy-pages.yml` 은 `npm ci` + `npm run build` 만 한다. 테스트가 깨져도 배포된다. 로컬에서는 돌리고 있으므로 당장의 위험은 낮다 |

---

## L. Post-release 백로그

출시 후에 한다. 출시 조건이 아니다.

| 항목 | 상태 |
| --- | --- |
| **학습자 테스트 실제 수행** | 준비 완료 · 상시 검증으로 이동 |
| 가설 4종 판정 (첫 문장 역전 · 중간 난이도 · 문체 혼용 · 명사구 종결) | `UNJUDGED` — 관찰이 들어와야 한다 |
| Learner Feedback 수집 화면 | 유형 8종만 정의 · UI 없음 |
| Mission Learning Bridge 구현 (입력·대기열·registry) | 절차 문서만 있음 |
| Open-book 을 M01 외 미션으로 확장 | 요구된 적 없음 |
| U8 · U13 · U14 · U15 · U16 Owner Gate | 5건 전부 `INDEPENDENT` |
| 콘텐츠 문체·깊이 균일화 | 검토 후보 목록만 있음. 사람 검증 후 판단 |
| Timeline View | `DEFERRED_FOR_DATA` |

---

## M. 출시를 막지 않는 것 (명시)

다음은 **기본적으로 release blocker 가 아니다.** 상태 문서에도 그렇게 적었다.

- Human Calibration — 사람이 아직 안 했다는 것은 실패가 아니다
- 문체 통일 — 340건은 검토 후보이지 결함 판정이 아니다
- canonical 깊이의 균일함 — 모든 term 이 같은 분량일 이유가 없다
- Timeline View — 데이터가 서사를 만들지 못한다
- SRE · Computer Architecture 확장 — 요구하는 미션이 없다

---

## N. Learner Feedback 유형 (정의만 · UI 없음)

학습자가 보내는 말을 **8종**으로 받는다. 이번 Cycle 에서 화면은 만들지 않았다.

| 유형 | 뜻 |
| --- | --- |
| `CONTENT_HARD_TO_UNDERSTAND` | 읽었는데 이해가 안 된다 |
| `EXAMPLE_NOT_HELPFUL` | 예시가 도움이 되지 않았다 |
| `TOO_SHALLOW` | 더 깊이 알고 싶은데 여기서 끝난다 |
| `TOO_DETAILED` | 지금 필요한 것보다 자세하다 |
| `CANNOT_FIND_TERM` | 찾는 용어에 닿지 못했다 |
| `CANNOT_FIND_NEXT_STEP` | 다음에 뭘 볼지 모르겠다 |
| `RELATION_CONFUSING` | 연결선의 의미가 헷갈린다 |
| `OTHER` | 위에 없다 |

`CANNOT_FIND_TERM` 이 §F 의 결함과 정확히 같은 자리를 가리킨다.
유형을 미리 정해 두면 나중에 들어오는 말이 어디를 가리키는지 바로 안다.

**Mission Learning Bridge 와는 다른 것이다.** Bridge 는 미션에서 오고
"무엇을 배웠는가" 를 묻는다. Feedback 은 화면에서 오고 "이 문서가 읽히는가" 를 묻는다.
섞으면 둘 다 못 쓴다 — [Bridge §7](../../docs/knowledge-encyclopedia/mission-learning-bridge.md).

---

## N-2. QA

제품 source 를 바꾸지 않았으므로 Playwright 전체는 돌리지 않았다(§31 허용).
**상태 문서에 테스트 상태를 과장하지 않았다** — 돌린 것과 돌리지 않은 것을 나눠 적었다.

| 검사 | 결과 |
| --- | --- |
| `npm run test` (data:build 포함) | **60 PASS** / 5 파일 |
| `npm run build` | **PASS** |
| `npm run build:extension` | **PASS** — 여기서 §G-2 를 발견 |
| `npm run glossary:validate` | 519 · 46 mission-local · **0 error / 0 warning** · 780 info |
| `npm run content:integrity` | 518 · 미션 문맥 모순 **0** · 템플릿 재사용 **0** |
| `npm run encyclopedia:validate` | 519 term · 546 authored · 2,874 derived · **0 error / 0 warning** |
| `npm run atlas:validate` | 12 field · 519 term · **valid** |
| `npm run knowledge-map:validate` | 10 implemented / 12 registry · 2 cross-field layer · **valid** |
| `npm run content:plan:validate` | 519 canonical · 9 valid batch |
| Playwright 22건 | **미실행** — 제품 source 변경 0 |

**생성물 drift**: `npm run data:build` 후 `src/data/generated/**` 에 변경 **없음**(결정적 출력 확인).
`dist-extension/glossary.json` 만 바뀌었고 그것이 §G-2 의 발견이다.

**깨진 참조**: 새 문서 3건의 상대 경로 링크를 확인했다 —
`mission-learning-bridge.md` → `docs/13` · `07` · `00`,
`product-completion-audit.md` → `mission-learning-bridge.md`,
`00-project-status.md` → 새 문서 2건과 감사 보고서.

**RC1 보호**: `git diff glossary-rc1 -- data/curated data/knowledge-maps extension` **비어 있음**.

---

## O. 이번 Cycle 에서 하지 않은 것

범위 제약(§24)을 지켰다.

- 새 feature 구현 **0**
- UI 재설계 **0**
- relation 변경 **0** · canonical 추가 **0** · ontology 변경 **0**
- `content/**` 변경 **0**
- 새 Agent **0** · Governance 모델 변경 **0**
- 감사 중 발견한 작은 문제(영문 필터 라벨, CI 에 테스트 없음, 미션 필터의 `본과정 -M01` 표기 간격)는
  **전부 기록만 했다**

변경한 것은 문서 4건과 뒤처진 빌드 산출물 1건이다.

```
+ docs/knowledge-encyclopedia/mission-learning-bridge.md      (신규)
+ docs/knowledge-encyclopedia/v1-completion-matrix.md         (신규)
+ reports/knowledge-encyclopedia/product-completion-audit.md  (신규 · 이 문서)
~ docs/knowledge-encyclopedia/00-project-status.md            (갱신)
~ dist-extension/glossary.json                                (재생성 — §G-2)
```

`src/**` · `content/**` · `data/**` · `scripts/**` 는 **한 줄도 바뀌지 않았다.**
