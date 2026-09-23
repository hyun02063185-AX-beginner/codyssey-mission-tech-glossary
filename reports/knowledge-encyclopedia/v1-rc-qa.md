# V1 Release Candidate QA & Closeout

> 2026-09-24 · 시작 HEAD **`bf1a6aa`** · branch `main` · working tree clean · origin 동기
> RC tag: **`encyclopedia-v1-rc1`**
> 이번 Cycle 은 검증이다. **새 기능을 만들지 않았다.**

**판정: `ENCYCLOPEDIA_V1_RC_READY`**

---

## A. 시작 상태

저장소에서 직접 읽었다. 대화에 적힌 값을 가정하지 않았다.

```
branch   main (clean · origin/main 과 동기)
HEAD     bf1a6aa  docs(encyclopedia): close V1 with the find step working
remote   origin  https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary
tag      glossary-rc1 · encyclopedia-views-v1 · encyclopedia-learning-baseline-v1
         glossary-content-integrity-v1 · glossary-content-quality-v1
```

---

## B. RC 중에 고친 것 하나 — Windows 콘솔 인코딩

§10 의 A / B / C 중 **A(단순 출력 문제, 안전하게 고칠 수 있다)** 로 판단했다.

### 무엇이었나

Windows 기본 콘솔은 cp949 인데 보고서 본문에 `—` 가 들어 있어
**분석을 다 끝내고 출력하다가** `UnicodeEncodeError` 로 죽었다.
결과가 틀린 것이 아니라 결과를 내보내지 못한 것이다.

처음에는 `content:specificity` 하나의 문제로 보였는데, 전수로 돌려 보니 넷이었다.

| 스크립트 | 증상 |
| --- | --- |
| `audit_term_specificity.py` | cp949 로 `—` 를 못 씀 |
| `build_pilot_comparison.py` | 같음 |
| `build_learner_test_plan.py` | 같음 |
| `report_content_quality.py` | **위 첫 번째를 자식 프로세스로 불러 utf-8 로 읽는다.** 자식이 죽으니 `TypeError: the JSON object must be str … not NoneType` 로 번졌다 |

즉 **`npm run content:quality` 와 `npm run content:specificity` 가 기본 Windows 콘솔에서
아예 돌지 않았다.** 상태 문서가 권하는 콘텐츠 QA 명령 여섯 개 중 둘이다.

### 어떻게 고쳤나

각 스크립트 맨 위에서 출력 스트림만 utf-8 로 고정했다. 분석 로직은 한 줄도 바꾸지 않았다.

```python
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
```

### 회귀 검사를 붙였다

`scripts/qa_console_encoding.py` (`npm run qa:console`).
자식 프로세스의 `PYTHONIOENCODING` 을 **cp949 로 강제**해 그 상황을 재현하므로
Windows 가 아닌 곳에서도 같은 회귀를 잡는다. 대상 9개 전부 통과.

**검사가 실제로 잡는지 확인했다.** 고친 것 하나를 되돌리고 돌렸더니 정확히 그 스크립트와,
그것을 부르는 `report_content_quality.py` 까지 **2건을 FAIL 로 잡았다.** 복구 후 다시 통과.

> 검사기 자신도 처음에는 9개를 다 통과시켜 놓고 마지막 요약 줄에서 죽었다.
> 고쳐야 할 것이 무엇인지 스스로 보여 준 셈이라 그 사실을 주석에 남겼다.

이미 해결됐으므로 **Known Issues 에 남기지 않는다**(§24 규칙).

---

## C. Clean Build

기존 생성물에 기대어 성공한 것처럼 보이지 않게 했다.

| 단계 | 결과 |
| --- | --- |
| `npm ci` | added 110 packages · audited 111 |
| `rm -rf src/data/generated dist-extension dist` | 생성물을 **전부 지웠다** |
| `npm run data:build` | PASS — source 에서 전부 다시 만들었다 |
| `npm run build:extension` | PASS |
| **삭제 후 재생성 결과 vs commit 된 것** | **byte-identical · diff 0** |
| `npm run build` (production) | PASS |

commit 된 생성물이 stale 하지 않다는 것을 지우고 다시 만들어 증명했다.

---

## D. Generated Data Determinism

| 대상 | 결과 |
| --- | --- |
| `glossary.json` 외 web generated | drift **0** |
| `encyclopedia-graph.json` | drift **0** (519 node · 546 authored · 2,874 derived) |
| `field-search.json` | drift **0** (14 분야 · 65 입력어) |
| `dist-extension/**` | drift **0** |
| `data:build` 2회 연속 | drift **0** |

---

## E. Validators

| 검사 | 결과 |
| --- | --- |
| `glossary:validate` | 519 canonical · 46 mission-local · **0 error / 0 warning** · 780 info |
| `encyclopedia:validate` | 519 term · 14 academic · 16 mission · 10 role · 36 cluster · 546 authored · 2,874 derived · **0 error / 0 warning** |
| `atlas:validate` | 12 field · 519 term · 16 mission · valid (HIGH 512 · MEDIUM 6 · LOW 1) |
| `knowledge-map:validate` | 10 implemented / 12 registry · 2 cross-field layer · valid |
| `content:plan:validate` | 519 canonical · 395 planned · 9 valid batch |
| `content:integrity` | 상세 518 · 고유 본문 518 · 템플릿 무리 **0** · **미션 문맥 모순 0** · 새 경고 0 |
| `content:specificity` | 공유 문장 틀 **0** · 자리 표시 코드 **0** · 정확한 설명이 한 줄 설명 되풀이 **0** |
| `content:quality` | **CONFIRMED_DEFECT 0** · 기준선 재생성해도 diff 0 |
| `content:map-reasons` | 내부 어휘 누출 **0** |
| `content:readability` | 실행 PASS (검토 후보 목록 · 판정 아님) |
| `qa:console` | **9/9 PASS** (cp949 강제) |

ERROR **0** · WARNING **0** · CONFIRMED_DEFECT **0**.
`glossary:validate` 의 INFO 780건은 대부분 `atlas_coverage_gap (unmapped)` 이며
release blocker 가 아니다 — 기존 정책대로 INFO 로 둔다.

---

## F. Tests

| | 결과 | 직전 |
| --- | --- | --- |
| unit | **82 PASS** / 5 파일 | 82 (감소 없음) |
| Playwright | **31 PASS** | 31 (감소 없음) |

Playwright 실행 방식 — `python scripts/qa_playwright.py`

```
1) 포트 고르기      6421: 사용 가능  → bind 시도로 판정한다
2) 서버 직접 띄움    (헬퍼에 webServer 가 없어 남의 서버를 잡을 경로가 없다)
3) 앱 확인          확인됨: term 519 · authored edge 546 · path 166
4) Playwright 실행   31 passed (15.9s)
```

safe port ✓ · target app verification ✓ · stale server reuse 없음 ✓.

---

## G. Browser QA

실제 브라우저에서 직접 했다. 자동 테스트로 끝내지 않았다.

### Entry · Find · Understand · Next

| 단계 | 확인 |
| --- | --- |
| **Entry** | `#/encyclopedia` 진입 · 링크 33개 · 네 가지 축으로 분기 |
| **Find** | `API` 11 · `보안` 52 · `운영체제` 50 · `데이터베이스` 46 · 임의 질의 0건 + 회복 4경로 |
| **Understand** | `mysql`(basic) · `variable`(mid) · `tcp`(hard) 모두 절 10개가 순서대로 렌더 |
| **Next** | 세 용어 전부에서 선수학습 · 학문 · 미션 · 관련 용어로 나간다. `tcp`·`mysql` 은 지도까지 |

`mysql` 에만 선수학습 링크가 없다. 선수 관계가 기록되지 않은 207개 중 하나이며
학문·미션·관련 용어 세 경로는 살아 있다. 결함이 아니라 데이터 상태다.

### Route 전수 (17개)

`#/` · `#/encyclopedia` · `#/terms` · `#/terms/:id` · `#/prerequisites` · `#/prerequisites/:id` ·
`#/missions` · `#/missions/:id` · `#/academic` · `#/academic/:id` · `#/roles` · `#/roles/:id` ·
`#/maps` · `#/maps/:id` · `#/connections` · `#/webtoons` · `#/openbook/main-m01`

**전부 렌더 · 빈 화면 0 · 로딩에서 멈춘 것 0.**
`#/maps/frontend` 의 `<a>` 가 0인 것은 지도 노드가 button 이기 때문이고,
노드를 누르면 패널에서 4개 링크가 나온다(이전 감사에서 확인).

### Deep link (새로고침 진입)

`#/prerequisites/redis` · `#/roles/backend-engineer` · `#/terms?q=운영체제` 를
주소로 직접 열어 같은 결과가 나오는 것을 확인했다.

### Back / Forward

```
검색(보안) → term(환경 변수) → prerequisite → back → back → forward → forward
  ⇒ 6단계 전부 정확히 복원
0건 검색 → 회복 링크(#/encyclopedia) → back
  ⇒ 질의와 회복 블록이 그대로 돌아온다
```

HashRouter 계약을 바꾸지 않았고 새 route 를 만들지 않았다.

### Console

앱 오류 **0**. 콘솔에 보이는 것은 Vite HMR 의 WebSocket 재시도뿐이며 dev 서버 산물이다.
React warning 0.

---

## H. Scenario Regression

```
PASS 10 · FRICTION 0 · BLOCKED 0
```

| | 시나리오 | 결과 |
| --- | --- | --- |
| A | M13을 해야 하는데 무엇부터? | **PASS** |
| B | Redis가 왜 자료구조와 연결되지? | **PASS** |
| C | 웹 개발을 어느 순서로? | **PASS** |
| D | 운영체제가 어느 미션과? | **PASS** |
| E | 백엔드 엔지니어는 뭘 공부하지? | **PASS** |
| F | 용어를 읽다가 어느 미션·학문과 연결되는지 | **PASS** |
| G | 처음 방문해서 웹 공부를 어디서 시작할지 | **PASS** |
| H | 보안 공부를 하고 싶은데 어떤 용어들이 있지? | **PASS** |
| I | 운영체제와 관련된 개념을 찾고 싶다 | **PASS** |
| J | API를 찾고 싶다 | **PASS** |

---

## I. Search RC QA

16개 질의를 브라우저에서 확인했다.

| 종류 | 질의 | 결과 | 분야 안내 | 회복 |
| --- | --- | ---: | --- | --- |
| 분야 | 보안 · 운영체제 · 알고리즘 · 데이터베이스 | 52 · 50 · 33 · 46 | 있음(경로 3) | 없음 |
| 분야 | 웹 · 네트워크 · AI · 클라우드 | 77 · 29 · 37 · 14 | 있음(경로 3) | 없음 |
| 이름 | API · HTTP · Redis · Generator · Authentication · JSON | 11 · 10 · 1 · 1 · 4 · 4 | **없음** | 없음 |
| 별칭 | 페치 | 1 (fetch) | 없음 | 없음 |
| 없는 말 | 존재하지않는임의용어 | **0** | 없음 | **있음(경로 4)** |

- **name result priority** ✓ — `데이터베이스` 의 첫 결과는 이름 일치인 `데이터베이스 마이그레이션`
- **alias 유지** ✓
- **field results 뒤 배치** ✓ — 이름 최대 2점, 분야 4점. 구조적으로 밀어낼 수 없다
- **unknown query 정직한 0건** ✓ — `a.row` 0개
- **recovery path 존재** ✓ — `<main>` 안 링크 4개
- **arbitrary recommendation 없음** ✓ — 추천 검색어·인기 검색어·개인화·임의 term 없음

---

## J. Mobile RC QA (375px)

15개 화면에서 **페이지 가로 overflow 0** (`scrollWidth 375 = clientWidth`).

홈 · 용어 찾기 · 검색 결과 · 회복 블록 · 용어 상세(tcp·mysql) · 선수학습 · 미션 ·
학문 · 직무 · 지도 목록 · 기술 지도 · 개념 연결 · 오픈북 · 대백과 — **필터를 펼친 상태까지 포함**.

`#/maps/frontend` 안의 지도 캔버스(960px)와 컨트롤은 viewport 보다 넓지만
지도 껍데기가 내부에서 스크롤해 **페이지는 넘치지 않는다.** 설계대로이고
Playwright 의 `mobile selection uses an overlay bottom sheet without page overflow` 가 같은 것을 지킨다.
코드 블록 내부 스크롤도 허용 범위다.

---

## K. Display Boundary

learner-facing route **21개**에서 7가지 패턴을 훑었다.

| 찾은 것 | 건수 |
| --- | --- |
| graph node id (`term:…`) | **0** |
| source path (`data/…json`, `scripts/…py`) | **0** |
| raw status (`PATH_NEEDED` · `CONFIRMED_DEFECT` · `CONTEXT_MISMATCH` …) | **0** |
| internal key (`source_status` · `primaryField` · `confidence` · `fieldId` …) | **0** |
| maintenance 어휘 (`registry` · `override` · `baseline` · `freeze`) | **0** |
| decision id (`EX0x` · `FD-xx` · `U1x` · `R12`) | **0** |
| coverage state | **0** |

**누출 0.** unit 의 display contract 검사 29건도 함께 통과한다.

---

## L. RC1 보호

```
git diff glossary-rc1 -- data/curated data/knowledge-maps extension   →  비어 있음
```

`glossary-rc1` tag 는 **이동하지 않았다**(`b3437a4` 그대로).
`content/**` 는 RC1 보호 대상이 아니며 Post-RC1 Content Maintenance 로 352 파일이 바뀌어 있다 —
Content Integrity Recovery Cycle 에서 확정된 정책대로다.

`dist-extension/**` 은 빌드 산출물이므로 source 를 따라 재생성되는 것이 정상이며,
이번에는 재생성해도 **diff 0** 이었다.

---

## M. Tag Inventory

다섯 tag 는 서로를 대체하지 않는다. 각각 다른 기준점이다.

| tag | commit | 무엇의 기준선인가 |
| --- | --- | --- |
| `glossary-rc1` | `b3437a4` | **사전 동결.** `data/curated`·`data/knowledge-maps`·`extension` 변경 금지의 기준 |
| `encyclopedia-views-v1` | `98b3edd` | View 4종 구현 완료 |
| `encyclopedia-learning-baseline-v1` | `b50ec6e` | 학습 coverage 판정 완료 |
| `glossary-content-integrity-v1` | `d777bc7` | 미션 문맥 모순 0 · 생성기 잠김 |
| `glossary-content-quality-v1` | `0e84fe1` | 콘텐츠 품질 기준선 |
| **`encyclopedia-v1-rc1`** | (이번) | **제품 V1 출시 후보** |

`encyclopedia-v1-rc1` 은 기존 이름과 충돌하지 않는다.
**최종 릴리스 tag 가 아니다** — `encyclopedia-v1` 은 별도 판단으로 남긴다.

---

## N. Mission Learning Bridge Closeout

계약 문서가 저장소에 있고 필수 항목이 전부 들어 있음을 확인했다.

| 항목 | 확인 |
| --- | --- |
| `Mission Learning Handoff != automatic glossary update` | ✓ |
| Learning Evidence Source | ✓ |
| User Approval Gate (Candidate 앞) | ✓ |
| automatic candidate 금지 | ✓ ("자동 승격 경로를 넣지 않는다") |
| glossary review 8종 | ✓ 전부 존재 |
| `NEW_CANONICAL` 자동 생성 금지 | ✓ (마지막 선택지 · `docs/13` 으로 넘김) |

**이번 RC 에서 자동화도 UI 도 만들지 않았다.**

---

## O. Learner Feedback Closeout

`POST_RELEASE_CONTINUOUS_VALIDATION` 유지. 자산이 그대로 남아 있음을 데이터로 확인했다.

| 보존 대상 | 상태 |
| --- | --- |
| Pilot | **11건** |
| 교차 배치 | **P1~P4 · 읽기 18회** |
| observation schema | RESTATE · WHY · UNKNOWN_WORDS · CONFUSION_POINT · EXAMPLE_HELPED · OBSERVER_NOTE |
| CURRENT / PROPOSED 비교본 | 있음 (생성물, `glossary.json` 에서 읽는다) |
| 이해 측정 방법 | 질문 7개 · 진행 방법 6단계 (화면을 가리고 자기 말로 설명) |
| 테스트 상태 | `NOT_YET_RUN` · observations **0** |
| 가설 4종 | 전부 **`UNJUDGED`** |

**`LEARNER_CONTENT_MODEL_VALIDATED` 는 선언하지 않는다.** 사람이 아직 읽지 않았다.

---

## P. Release Blocking 판정

§5 의 12개 기준을 전부 확인했다.

| 기준 | 결과 |
| --- | --- |
| production build 실패 | **없음** |
| unit test 실패 | **없음** (82 PASS) |
| Playwright 실패 | **없음** (31 PASS) |
| validator ERROR/WARNING 증가 | **없음** (0 / 0) |
| broken route | **없음** (17/17) |
| dead-end 핵심 사용자 흐름 | **없음** — 0건 검색까지 길이 있다 |
| generated data drift | **없음** (지우고 다시 만들어도 byte-identical) |
| RC1 보호 영역 예상치 못한 변경 | **없음** |
| extension build 실패 | **없음** |
| search regression | **없음** (이름·별칭 결과와 순서 불변) |
| display/internal metadata leak | **없음** (21 route × 7 패턴) |
| semantic regression | **없음** (graph·relation·ontology 변경 0) |
| V1_REQUIRED 미완료 | **없음** (38/38) |

**release blocker 0건.**

Non-blocker 로 남긴 것은 [`known-issues.md`](../../docs/knowledge-encyclopedia/known-issues.md) 의
KI-01 ~ KI-14 이며, 그중 실제 학습 흐름을 막는 것은 **하나도 없다**.

---

## Q. V1 Completion

```
들어온다 ✅  →  찾는다 ✅  →  이해한다 ✅  →  다음으로 간다 ✅
```

네 단계 모두 실제 route 와 브라우저에서 성립함을 확인했다(§G).

| | |
| --- | --- |
| V1_REQUIRED | **38** |
| complete | **38** |
| remaining | **0** |

---

## R. 이번 Cycle 에서 하지 않은 것

새 기능 **0** · 새 route **0** · UI 재설계 **0** · relation/canonical/ontology 변경 **0** ·
`content/**` 변경 **0** · 새 Agent **0** · Timeline readiness 재계산 **0**.

고친 것은 §B 의 출력 인코딩 하나뿐이고 분석 로직은 건드리지 않았다.
**최종 릴리스 tag 를 자동으로 만들지 않았다.**

---

## S. 다음

**`ENCYCLOPEDIA_V1_RC_READY` 이므로 새 기능을 시작하지 않는다.**

다음으로 제안하는 것은 하나다 — **V1 Final Release Decision / Release Closeout**.
RC 를 실제로 써 보고 문제가 없으면 최종 tag 를 검토하는 단계다.
