# V1 Search Discovery Completion Sprint

> 2026-09-24 · 시작 HEAD **`2c0ddbd`** · branch `main`
> 목적은 하나다 — V1 사용자 흐름에서 **`찾는다` 단계만** 닫는다.
> 새 기능·ontology·canonical·relation·content rewrite·추천 시스템은 더하지 않았다.

**판정: `ENCYCLOPEDIA_V1_FEATURE_COMPLETE`**

---

## A. 무엇이 문제였나

Product Completion Audit §F 의 결론을 그대로 받았다.

```
들어온다 ✅  →  찾는다 ❌  →  이해한다 ✅  →  다음으로 간다 ✅
```

`src/searchTerms.ts` 는 `termKo` · `termEn` · `aliases` 만 봤다.
그래서 초보 학습자가 가장 먼저 칠 한국어 분야어가 가장 잘 실패했고,
실패한 화면에는 나갈 길이 하나도 없었다.

---

## B. V1-R1 — 한국어 분야어 검색

### 새 taxonomy 를 만들지 않았다

이미 있는 것 세 가지를 이었다.

```
glossary 의 category 14개              이미 화면에 쓰이는 분류
  ↓  (term-field-classification.json 에서 센다 — 임의로 정하지 않는다)
Atlas 의 기술 분야 12개                 지도 route 가 여기에 있다
  ↓  (academic-fields.json 의 atlasCrosswalk)
학문 14개                              labelKo 가 이미 들어 있었다
```

손으로 새로 적은 것은 **한국어 입력어 하나뿐**이다 —
`data/encyclopedia/field-search-labels.json` 에 category 14개 × 라벨/별칭 **65개**.

**canonical 에 alias 를 복제하지 않았다.** `보안` 을 52개 term 에 붙이는 방식은 쓰지 않았고,
분야 하나에 대해 한 번만 관리한다. `content/terms` 와 `glossary-master` 는 손대지 않았다.

생성물은 `src/data/generated/field-search.json` 이고 `npm run data:build` 안에서 만들어진다.
빌더가 검사하는 것: glossary 의 category 를 하나도 빠뜨리지 않았는가 · 없는 category 를 적지 않았는가 ·
같은 alias 가 두 분야에 들어가지 않았는가 · 모든 category 가 Atlas 에 분류돼 있는가.
하나라도 어기면 빌드가 멈춘다.

### 매칭 규칙

```
질의가 alias 와 완전히 같다            → 맞다 (한 글자도 된다. '웹')
질의가 두 글자 이상이고 alias 의 앞이다  → 맞다 ('암호' → 암호화)
한 글자 앞부분 일치                    → 아니다 ('보' 로는 걸리지 않는다)
```

한 글자 앞부분 일치를 막은 이유는 `a` 같은 질의가 `AI`·`AWS` 를 긁어오는 것을 피하기 위해서다.

### 대표 질의 — 감사 때와 지금

| 질의 | 이전 | 이후 | 걸린 분야 |
| --- | ---: | ---: | --- |
| 보안 | **0** | **52** | 보안 |
| 운영체제 | **0** | **50** | 운영체제 · 리눅스 |
| 알고리즘 | **0** | **33** | 알고리즘 · 자료구조 |
| 데이터베이스 | 1 | **46** | 데이터베이스 |
| 웹 | 1 | **77** | 웹 |
| 네트워크 | 1 | **29** | 네트워크 |
| AI | 14 | **37** | 인공지능 |
| 클라우드 | **0** | **14** | 서버 · 클라우드 |
| 리눅스 · 배포 · 자료구조 · 인공지능 · 프론트엔드 · 백엔드 · 도커 | **0** | 50 · 14 · 33 · 25 · 77 · 11 · 20 | — |
| 깃 | 2 | **52** | 깃 · 협업 |
| **테스트** | **0** | **0** | **없다** |

`테스트` 는 여전히 0 이다. **사전에 Testing 분야가 없기 때문이다.**
없는 분야를 만들어 숫자를 채우지 않았다 — 0 인 채로 두고 회복 경로만 준다(§C).

### 순위 — 분야가 이름을 밀어내지 않는다

이름 일치의 점수는 최대 2 이고, 분야 일치는 **4** 다(core 보정 -0.2 를 받아도 3.8).
그래서 **분야로 걸린 용어는 언제나 이름으로 걸린 용어 뒤에 붙는다.**
기존 결과는 점수도 순서도 그대로고 새 결과가 뒤에 더해질 뿐이다.

```
데이터베이스  →  데이터베이스 마이그레이션(이름 일치) … 그다음에 Database 분야 45개
API         →  API 키 · 시간당 60회 제한 · FastAPI …   (분야는 걸리지 않는다)
```

`API` 는 어느 alias 와도 맞지 않아 분야 안내 자체가 뜨지 않는다. 기존 동작 그대로다.

### 결과가 많을 때

`웹` 77 · `프로그래밍` 83 은 60개를 넘는다. **새 pagination 을 만들지 않았다.**
기존의 60개 컷과 `처음 60개만 보여 드립니다` 안내가 그대로 동작한다.

---

## C. V1-R2 — 0건 회복 경로

결과가 **정확히 0일 때만** 나온다. 1건이라도 있으면 기존 화면 그대로다.

### 세 가지 경우를 나눈다

| 상황 | 화면 |
| --- | --- |
| 질의가 분야와 이어지는데 필터 때문에 0 | `필터가 결과를 좁히고 있어요` + **필터 해제하기** + 그 분야의 길 3개 |
| 질의가 분야와 이어지지만 결과가 0 | 그 분야의 길 3개 (분야 모아 보기 · 기술 지도 · 학문 지도) |
| 어느 분야에도 걸리지 않는다 | **정직하게 0건**이라 말하고, 둘러볼 길 4개만 준다 |

마지막 경우가 중요하다. `#/terms?q=존재하지않는임의용어` 에서 화면은 이렇게 된다.

```
'존재하지않는임의용어'에 맞는 용어를 찾지 못했어요.
이 사전에 아직 없는 말일 수 있어요. 아래에서 둘러보세요.
  전체 용어 둘러보기 · 🗺 기술 지도 · 📚 학습 지도 · 미션별로 보기
```

**용어를 하나도 들이밀지 않는다.** 추천 알고리즘도, 인기 검색어도, 개인화도 없다.
네 링크는 어떤 질의에도 똑같이 나오는 고정 이동 경로이지 추천이 아니다.
감사 때 `<main>` 안 링크가 **0개**였던 것이 지금은 **4개**다.

### 결과가 있을 때의 안내

분야가 걸렸고 결과도 있으면 목록 위에 한 줄과 길 세 개를 놓는다.

```
보안 분야의 용어도 함께 찾았어요. 이름이 맞는 용어를 먼저 보여 드립니다.
  보안 용어 52개 모아 보기 → #/terms?category=Security
  🗺 Security / Identity  → #/maps/security-identity
  📚 정보보안 학문 지도     → #/academic/information-security
```

전부 **기존 route 와 기존 필터**다. 새 화면을 만들지 않았다.
내부 ID(`information-security`)는 링크 주소에만 있고 화면에는 한국어 라벨만 나간다.

---

## D. 검색 회귀

| 종류 | 확인 |
| --- | --- |
| 이름 | `API` 11 · `HTTP` 10 · `Redis` 1 · `Generator` 1 · `Authentication` 4 · `JSON` 4 · `DOM` · `useState` — **결과도 순서도 그대로** |
| 별칭 | 유지 (`페치` → Fetch API) |
| 분야 | 위 표 |
| 빈 질의 | **바꾸지 않았다.** `''` 와 `'   '` 는 전과 같이 빈 배열 |
| 분야 없이 호출 | `searchTerms(terms, q)` 는 예전과 **바이트 단위로 같은 동작**. 지도 안 검색이 여기 해당한다 |

`searchTerms` 의 세 번째 인자는 선택이며 기본값이 `[]` 다. 그래서 `TechnologyFieldMap` 의
지도 내 검색은 전혀 달라지지 않았다 — 프론트엔드 지도에서 `보안` 을 쳐도 보안 용어 52개가 쏟아지지 않는다.

---

## E. Browser Scenarios

브라우저에서 직접 했다. 자동 테스트로 끝내지 않았다.

| | 시나리오 | 결과 |
| --- | --- | --- |
| A | M13을 해야 하는데 무엇부터? | **PASS** |
| B | Redis가 왜 자료구조와 연결되지? | **PASS** |
| C | 웹 개발을 어느 순서로? | **PASS** |
| D | 운영체제가 어느 미션과? | **PASS** |
| E | 백엔드 엔지니어는 뭘 공부하지? | **PASS** |
| F | 용어를 읽다가 어느 미션·학문과 연결되는지 | **PASS** |
| G | 처음 방문해서 웹 공부를 어디서 시작할지 | **PASS** |
| **H** | **"보안 공부를 하고 싶은데 어떤 용어들이 있지?"** | **PASS** — `보안` 52건 + 분야 3경로 |
| **I** | **"운영체제와 관련된 개념을 찾고 싶다."** | **PASS** — `운영체제` 50건, 막다른 화면 없음 |
| **J** | **"API를 찾고 싶다."** | **PASS** — 11건, 이름 검색 우선, 분야 안내 없음 |

```
PASS 10 · FRICTION 0 · BLOCKED 0
```

### Deep link · 뒤로/앞으로

- `#/terms?q=보안` · `#/terms?q=운영체제` 를 **새로고침으로 직접 진입** — 같은 결과가 나온다
- 검색 → 용어 상세 → 뒤로 → 검색이 그대로 · 앞으로 → 상세로 복귀
- 검색(0건) → 회복 링크(`#/maps`) → 뒤로 → **0건 화면과 질의가 그대로 남는다**
- HashRouter 계약은 바꾸지 않았다. 새 route 를 만들지 않았다

---

## F. Mobile 375px

| 화면 | 가로 넘침 |
| --- | --- |
| `q=보안` (52건 + 분야 안내) | **없음** (`scrollWidth 375 = clientWidth`) |
| `q=알고리즘` | **없음** |
| `q=존재하지않는임의용어` (회복 블록) | **없음** |
| `q=보안&category=Web&toon=yes` (필터 0건) | **없음** |
| 위 전부 + **필터를 펼친 상태** | **없음** |

긴 한국어 라벨(`운영체제 · 리눅스 용어 50개 모아 보기`)도 넘치지 않는다 —
좁은 화면에서는 링크가 세로로 쌓이고 폭 100% 가 된다.

---

## G. 테스트

| 검사 | 결과 |
| --- | --- |
| unit | **82 PASS** (이전 60) — `searchTerms` **24건** (이전 2건) |
| Playwright | **31 PASS** (이전 22) — 새 spec `term-search.spec.ts` **9건** |
| Playwright 실행 방식 | `python scripts/qa_playwright.py` — 안전 포트 **6421** 을 bind 로 고르고, **이 저장소 앱인지 확인한 뒤** 실행 |
| `npm run build` | PASS |
| `npm run build:extension` | PASS |
| `glossary:validate` | 519 · 46 mission-local · **0 error / 0 warning** · 780 info |
| `encyclopedia:validate` | 519 · 546 authored · 2,874 derived · **0 error / 0 warning** |
| `atlas:validate` | 12 field · 519 term · valid |
| `knowledge-map:validate` | 10 implemented / 12 registry · 2 cross-field layer · valid |
| `content:plan:validate` | 519 canonical · 9 batch |
| `content:integrity` | 미션 문맥 모순 **0** · 템플릿 재사용 **0** |
| `content:specificity` | 공유 문장 틀 **0** · 자리 표시 코드 **0** |

unit 검사가 덮는 것: 기존 이름 검색 · 별칭 · 한국어 분야 검색 · **순위 우선순위** ·
상관없는 분야 배제 · 빈 질의 · **결정성**(같은 입력에 같은 출력) · 분야 라벨이 category 를 전부 덮는지.

### 환경 문제 하나 (이번 변경과 무관)

`npm run content:specificity` 가 Windows 콘솔에서 `UnicodeEncodeError` 로 멈춘다.
출력 문자열의 em dash 를 cp949 로 못 쓰는 것이고 **분석 결과는 정상**이다
(`PYTHONIOENCODING=utf-8` 로 돌리면 통과). `audit_term_specificity.py` 는 이번에 건드리지 않았고
이전부터 그랬다. **기록만 한다** — 이번 Sprint 범위가 아니다.

---

## H. 생성 데이터

| 항목 | 결과 |
| --- | --- |
| web generated drift | `npm run data:build` 두 번 돌려 **기존 생성물 변경 0** (결정적) |
| 새 생성물 | `src/data/generated/field-search.json` 1건 |
| extension drift | `dist-extension/**` **변경 0** — glossary 데이터 계약을 바꾸지 않았다 |
| extension 최신 여부 | `build:extension` 실행 후 diff 없음 = 최신 |

Extension 은 `glossary.json` · `openbook-main-m01.json` · `term-map-links.json` 만 복사하므로
`field-search.json` 의 영향을 받지 않는다. **Extension 자체 검색은 이번에 바꾸지 않았다**
(`extension/**` 은 RC1 보호 영역이다). 사이드패널에서의 한국어 분야 검색은 post-release 항목으로 남긴다.

---

## I. RC1

```
git diff glossary-rc1 -- data/curated data/knowledge-maps extension   →  비어 있음
```

`glossary-rc1` tag 는 건드리지 않았다.
`content/terms` · `glossary-master-v0.1.yaml` · `data/knowledge-maps/**` · `extension/**` 모두 **변경 0**.
새로 만든 `data/encyclopedia/field-search-labels.json` 은 Encyclopedia authoring 영역이며 보호 대상이 아니다.

---

## J. 하지 않은 것 (§3 비범위)

추천 알고리즘 · AI 검색 · semantic search · fuzzy search · 검색 ranking 전면 재설계 ·
새 canonical · 새 relation · Academic taxonomy 변경 · Timeline · Feedback UI ·
Mission Learning Bridge 구현 · Open-book 확장 · V1_OPTIONAL O1/O2/O3 · CI 개선 · 콘텐츠 rewrite.

Human Test 는 **`POST_RELEASE_CONTINUOUS_VALIDATION` 그대로**다.
이번 Sprint 가 성공했다는 이유로 `LEARNER_CONTENT_MODEL_VALIDATED` 라고 하지 않는다 —
사람이 읽고 이해했는지는 여전히 검증되지 않았다.

Timeline 도 `DEFERRED_FOR_DATA` 그대로다. 검색을 고쳤다고 readiness 를 다시 계산하지 않았다.

---

## K. Completion Matrix

| | 이전 | 이후 |
| --- | ---: | ---: |
| `V1_REQUIRED` 전체 | 37 | **37** |
| 완료 | 35 | **37** |
| **미완** | **2** | **0** |

V1-R1 · V1-R2 가 `COMPLETE` 가 됐다. `V1_OPTIONAL` 3건과 `POST_RELEASE` 9건은 그대로다.

---

## L. V1 사용자 흐름

```
들어온다 ✅  →  찾는다 ✅  →  이해한다 ✅  →  다음으로 간다 ✅
```

`찾는다` 안에서:

| | |
| --- | --- |
| direct term search | ✅ 결과·순서 불변 |
| alias search | ✅ 불변 |
| Korean domain search | ✅ 14개 분야 · 65개 입력어 |
| zero-result recovery | ✅ 링크 0개 → 4개, 추천 없이 |

---

## M. 다음

**새 기능을 자동으로 시작하지 않는다.**

다음으로 제안하는 것은 하나다 — **Knowledge Encyclopedia V1 Release Candidate QA / Closeout**.
기능을 더하는 일이 아니라 지금 상태를 출시 후보로 굳히는 일이다.
