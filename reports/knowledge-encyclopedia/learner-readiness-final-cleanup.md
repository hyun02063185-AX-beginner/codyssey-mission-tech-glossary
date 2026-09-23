# Learner Readiness Final Cleanup

- 기준 커밋: `0e84fe1` (Content Quality Completion Cycle 완료)
- 기준선 태그: `glossary-content-quality-v1`
- 완료일: 2026-09-23
- 판정: **ENCYCLOPEDIA_LEARNER_TEST_READY**

알려진 잔여 품질 문제만 닫는 Cycle 이다. 새 기능도, Encyclopedia 확장도 하지 않았다.
`content/terms` 10개 파일 · 전체 22개 파일이 바뀌었다.

---

## A. Minor Editorial

| | |
| --- | --- |
| reviewed | **149** (백틱 145 · 정의 되풀이 4) |
| fixed | **149** + 브라우저에서 추가로 찾은 8 |
| remaining | **0** |

### 백틱 145건

본문 절은 화면에서 **평문으로 렌더링**된다. 마크다운의 inline code 백틱이 글자로
그대로 보였다.

```
수정 전   `<div onclick>`으로 만든 버튼은 보기에는 같지만…
수정 후   <div onclick>으로 만든 버튼은 보기에는 같지만…
```

고친 자리는 원본 마크다운이 아니라 **빌드**다. `build_web_data.py` 의 `prose()` 가
화면으로 나가는 값에서만 걷어낸다.

- 원본 마크다운은 유효한 마크다운으로 남는다. 다음 Cycle 이 inline code 를 시각적으로
  구분하기로 하면 정보가 그대로 있어 되돌릴 수 있다.
- 코드 예는 `<pre>` 로 나가므로 적용하지 않는다(백틱 6건 보존).
- `detailRelatedTerms` 가 이미 `.strip('`')` 를 하고 있고 `codeExample` 도 코드 펜스를
  걷어내고 있다. 같은 자리의 같은 처리다.

회차 문구(`mission_refs[].context`) 4건도 같은 제목 아래 평문으로 나간다.
`data/curated` 는 RC1 보호 영역이라 **원본은 건드리지 않고** 화면 값만 다듬었다.
그중 `process-pid-1` 은 백틱 짝이 맞지 않아(`` docker run ubuntu` ``) 짝 없는 백틱도
함께 걷어내도록 했다.

### 정의 되풀이 4건

`base-image` · `filter` · `label-normalization` · `matrix-2d-array` 의 `정확한 설명` 이
바로 위 `한 줄 설명` 과 같은 문장으로 시작해 화면에서 두 번 읽혔다.

**결함이 아니라 중복이었다.** 뒤 문장은 용어마다 고유하고 내용이 있어서 그대로 두고
첫 문장만 덜어 냈다.

### 브라우저에서 추가로 찾은 8건

`filter` 페이지를 열었을 때 "데이터 필터**은(는)** 들어온 값 가운데…" 가 보였다.
생성기가 남긴 조사 자리 표시다. 8건 전부 `쉽게 설명하면` 첫머리였고, 용어 이름을
주어로 되풀이하지 않도록 문장을 다시 열었다.

```
수정 전   행렬 / 2차원 배열은(는) 값을 가로줄과 세로줄로 늘어놓아…
수정 후   값을 가로줄과 세로줄로 늘어놓아…
```

`report_content_quality.py` 에 검사를 넣어 다시 생기면 걸리게 했다.

---

## B. Manual Review

| | |
| --- | --- |
| reviewed | **33** |
| SUPPORTED | **31** |
| OVERSTATED | **2** |
| UNSUPPORTED | **0** |
| SOURCE_INSUFFICIENT | **0** |
| remaining | **0** |

기록: `data/reviews/mission-claim-review.json`

### 근거 모델 — 저장소의 Mission source 가 무엇인가

**미션 과제 원문은 이 저장소에 없다.** 저장소 안의 Mission source 는
`data/curated/glossary-master-v0.1.yaml` 의 `mission_refs` 와
`data/curated/mission-term-map-v0.1.yaml` 이며, 둘은 같은 근거를 담는다.

판정의 축은 `source_status` 다.

| 값 | 건수 | 뜻 | 단정을 어디까지 뒷받침하나 |
| --- | --- | --- | --- |
| `direct` | 413 | 미션 문서에 그 용어가 직접 나온다 | `context` 가 요구 사항을 적고 있으면 단정이 성립한다 |
| `required` | 88 | 미션을 하려면 필요하지만 문서가 이름으로 부르지는 않는다 | `context` 가 말하는 범위까지만 |
| `related` | 94 | 확장·관련 학습이다 | 회차가 요구한다고 쓰면 근거를 넘어선다 |

### OVERSTATED 2건

**`accessibility-a11y`** — `related` / "시맨틱 HTML과 폼 UX 확장 학습"

```
전   이 회차는 의미에 맞는 HTML 태그를 쓰도록 요구하고, 그 이유가 여기 있습니다.
후   이 회차가 요구하는 것은 의미에 맞는 HTML 태그로 페이지 구조를 짜는 데까지이고,
     접근성은 그 위에 얹히는 확장 학습입니다. 다만 태그를 왜 의미에 맞게 골라야
     하는지가 여기서 드러납니다.
```

회차가 직접 요구하는 것은 `semantic-html`(`direct`, "페이지 구조 요구")까지다.
접근성은 그 위의 확장이므로 요구 범위를 한정했다. 내용은 그대로 두었다.

**`o-constant-time`** — `direct` / "삽입/삭제/이동 성능 요구"

근거가 든 연산은 삽입·삭제·**이동**인데 본문은 저장·**조회**·삭제로 적었다.
조회는 근거에 없고 이동은 빠져 있었다. 근거가 든 세 연산으로 맞췄다.

### 경계에 있었던 3건 — 기록에 남긴 이유

| 용어 | 왜 SUPPORTED 인가 |
| --- | --- |
| `css-media-query` (`required`) | 단정한 대상은 브레이크포인트 자체이고 `context` 가 768px/1024px 두 값을 든다. media query 는 "수단" 으로만 적었다 |
| `human-in-the-loop` (`required`) | 단정한 것은 회차의 동작이고 `context`("AI 문구를 사용자 검토 후 적용")가 그 동작을 그대로 적는다 |
| `shared-responsibility-model` (`related`) | **이 용어가 요구된다고 쓰지 않았다.** 단정한 것은 회차가 요구하는 설정들이며 `security-group`·`port-22-ssh`·`principle-of-least-privilege`(전부 `direct`)가 뒷받침한다 |

### 분류기 연동

대조가 끝난 단정은 더 이상 "확인이 필요한" 상태가 아니다. 분류기가
`mission-claim-review.json` 을 읽어, **기록에 없는 새 단정만** 걸리게 했다.
숫자를 맞추려고 규칙을 끈 것이 아니라 검토가 실제로 끝났기 때문이다.

---

## C. EX03

| | |
| --- | --- |
| context mismatch reviewed | **4** |
| edge corrected | **2** |
| reason corrected | **2** |
| generic reviewed | **10** |
| generic improved | **9** |
| remaining | **0** (그대로 둔 1건은 판단 결과) |

기록: `data/encyclopedia/map-edge-corrections.json` · `data/reviews/ex03-map-reason-audit.json`

### edge 가 틀렸는가, reason 이 틀렸는가

네 건 모두 source node · relation · target node · 현재 reason · 정의 · 학습 경로를
함께 놓고 봤다. **reason 만 자동으로 바꾸지 않았다.**

| edge | 무엇이 틀렸나 | 처리 |
| --- | --- | --- |
| `process-id -is_a-> process` | **edge** | reason("PID 는 process 자체가 아니다")이 맞다. 식별자는 프로세스의 한 종류가 아니다 → `based_on` |
| `default-route-any-ipv4 -is_a-> route-table` | **edge** | reason("route table 안의 한 route rule")이 맞다. 규칙은 표의 한 종류가 아니라 구성 요소다 → `based_on` |
| `weight -based_on-> ai-model` | **reason** | relation 은 맞다. reason 이 "model 은 weight 를 포함한다" 로 반대 방향을 설명했다 |
| `layer -based_on-> docker-image` | **reason** | 같다. "image 는 layer 들로 구성된다" 로 반대 방향 |

앞 두 건은 **reason 쪽이 맞고 relation 이 틀린** 경우였다. 지침의 예시가 그대로 들어맞았다.

### GENERIC_REASON 은 결함으로 취급하지 않았다

10건에 Swap Test 를 적용했다. 다른 edge 에 그대로 붙여도 말이 되면 다시 썼다.

```
FAIL  BFS는 graph traversal strategy다.        → DFS 에 그대로 붙는다
FAIL  LRU는 cache eviction policy다.           → LFU·FIFO 에 그대로 붙는다
FAIL  min heap은 heap property를 유지한다.      → 최대 힙에 그대로 붙는다

PASS  RBAC은 role 기반 access control model이다.
      → 'role 기반' 이 RBAC 을 다른 모델과 갈라 준다. 짧지만 그대로 둔다
```

**9건 개선 · 1건 유지.** 숫자를 0 으로 만들려고 고치지 않았다.

### 동결 map 을 건드리지 않은 방법

`data/knowledge-maps/**` 는 RC1 보호 영역이다. `map-edge-corrections.json` 에
`supersedes` 와 대신 쓸 edge 를 적고, 그래프를 만들 때 map 의 해당 edge 를 받지 않는다.
**U9**(self-reference 제외)·**U16**(Encyclopedia 층에서 별도 관계 작성)과 같은 처리다.

안전장치: `supersedes` 가 map 에서 맞는 edge 를 못 찾으면 빌드가 멈춘다. 원본이 바뀌었는데
교정이 남아 있는 상태를 막는다.

원본 유지 확인: `git diff glossary-rc1 -- data/knowledge-maps` **비어 있음**.

### Learner-facing Reason 원칙 (§4)

유지보수 판단은 `review.note` 에만 두고 화면에 나가는 `reason` 에 넣지 않았다.
자동 검사로 확인한다 — `npm run content:map-reasons` 의 **내부 관리 표현 누출 0**.

검사가 잡은 두 건은 확인 결과 오탐이었다. Docker **registry**(도메인 어휘)와
미션의 **data.json**(실제 파일 이름)이며 유지보수 어휘가 아니다.

---

## D. Content State

| 분류 | Cycle 시작 | Cycle 종료 |
| --- | --- | --- |
| `CONTENT_OK` | 340 | **518** |
| `NEEDS_MINOR_EDITORIAL` | 145 | **0** |
| `NEEDS_MANUAL_REVIEW` | 33 | **0** |
| `CONFIRMED_DEFECT` | 0 | **0** |

`npm run content:quality` · `data/reviews/content-quality-baseline.json`

지난 Cycle 의 품질 기준선은 그대로다 — 공유 문장 틀 **0** · 정의 되풀이 **0** ·
코드 예 자리 표시 **0** · 미션 문맥 모순 **0** · 템플릿 무리 **0**.

---

## E. Generated Data

| | |
| --- | --- |
| data build | 콘텐츠·빌드를 고칠 때마다 실행 |
| stale output | **0** |

`source 수정 → data:build → generated output 확인 → browser 확인` 을 한 단위로 처리했다.
stale 상태에서 QA 하지 않았다.

결정론적 출력 확인: 2회 재빌드 후 `glossary.json` · `encyclopedia-graph.json` **동일**.

---

## F. Browser QA

| | |
| --- | --- |
| terms checked | **11** |
| issues | **1** |
| resolved | **1** |

| 대상 | 결과 |
| --- | --- |
| 백틱 수정 term (`accessibility-a11y`, `react-router`) | 백틱 사라짐, 코드 예 보존 |
| Manual Review 수정 term (`accessibility-a11y`, `o-constant-time`) | 완화된 표현이 화면에 반영됨 |
| `filter` | **"데이터 필터은(는)" 발견 → 8건 수정** |
| `label-normalization` | 회차 문구 백틱까지 사라짐 |
| full rewrite Web term (`react-router`) | 정상 |
| AI · Data · System 대표 (`convolution`·`filter`·`out-of-memory`) | 정상 |
| `base-image` | 정의 중복 해소, 먼저 볼 개념 / DevOps / 예비 M01 정상 |

### EX03 edge 화면 확인

| edge | 화면에서 읽히는 모습 | 관계와 모순 | 내부 표현 |
| --- | --- | --- | --- |
| `process-id` | 먼저 알아보기 1개 · 1단계 앞 `process` | 없음 | 없음 |
| `default-route-any-ipv4` | 2단계 사슬 `Subnet → Route Table → 0.0.0.0/0` | 없음 | 없음 |
| `layer` | 3단계 사슬 `Docker → Dockerfile → Docker 이미지 → 이미지 레이어` | 없음 | 없음 |
| `weight` | 선수학습 화면에 새 문장 반영 | 없음 | 없음 |

`process-id` 의 학습 경로 "프로그램이 실행되는 길"(셸 → process → PID → Scheduler → CPU)이
그대로 유지된다.

---

## G. Scenarios

```
PASS 7 · FRICTION 0 · BLOCKED 0
```

| | 시나리오 | 경로 | 결과 |
| --- | --- | --- | --- |
| A | M13을 해야 하는데 무엇부터? | 대백과 홈 → 미션부터 준비하기 → M13 → 무엇을 먼저 알아야 하는가(23개) | **PASS** |
| B | Redis가 왜 자료구조와 연결되지? | 용어 → 먼저 알아보기 3개 → 시간복잡도 → 해시맵 → 키-값 저장소 | **PASS** |
| C | 웹 개발을 어느 순서로? | 학습하기 → 기초부터 쌓기 → 웹 프로그래밍(92개 + 공부 순서) | **PASS** |
| D | 운영체제가 어느 미션과? | 학문 → 운영체제 → 관련 미션 + 바로 보기 | **PASS** |
| E | 백엔드 엔지니어는 뭘 공부하지? | 직무 → 백엔드 엔지니어(용어 172 · 학문 3) | **PASS** |
| F | 용어를 읽다가 어느 미션·학문과 연결되는지 | `base-image` → 먼저 볼 개념 / DevOps / 예비 M01 | **PASS** |
| G | 처음 방문해서 웹 공부를 어디서 시작할지 | 홈 → 학습하기 → 기초부터 쌓기 → 웹 프로그래밍 | **PASS** |

새 UX 를 만들지 않았다. 기존 탐색 경험이 깨지지 않았는지만 확인했다.

---

## H. Tests

| 검사 | 결과 |
| --- | --- |
| unit | **60 PASS** |
| Playwright | **22 PASS** (`python scripts/qa_playwright.py`, 포트 6421) |
| Display Contract | PASS (unit 29건 안에 포함) |
| `content:integrity` | 미션 문맥 모순 **0** · 템플릿 무리 **0** |
| `content:specificity` | 공유 문장 틀 **0** |
| `content:map-reasons` | 내부 관리 표현 누출 **0** |
| `content:quality` | CONFIRMED_DEFECT **0** |
| `glossary:validate` | 519 · 0 error · 0 warning · 780 info |
| `knowledge-map:validate` | 10/12 map · 2 cross-field layer |
| `atlas:validate` | 12 field · 519 term · 16 mission |
| `content:plan:validate` / `content:s7-b01:validate` | PASS / PASS |
| `encyclopedia:validate` | 0 error · 0 warning |
| Impact Gate | edge +2 / -2 · 영향 미션·학문·경로 **0** · 교차 영향 **0** |
| production build | PASS |
| extension build | PASS |

Playwright 는 안전 포트 방식을 그대로 썼다. 고정 4173 에 의존하지 않고, 포트를 고른 뒤
**그 서버가 이 저장소의 앱인지 확인**(term 519 · authored edge 546 · path 166)하고 돌렸다.
product configuration 은 바꾸지 않았다.

---

## I. Knowledge Regression

| 항목 | 값 | 변화 |
| --- | --- | --- |
| graph | 519 term · authored 546 · derived 2874 · path 166 · cluster 36 | 변화 없음 |
| learning coverage | 판정 100% · pre-authoring 78.5% · final 100% · unresolved 0% | 변화 없음 |
| 선수 경로 보유 | priority 260/300 · 전체 312 | 변화 없음 |
| missions | 16 | 변화 없음 |
| academics | 14 (active 13) | 변화 없음 |
| roles | 10 (active 8) | 변화 없음 |
| schema / ontology | 변경 0 | — |
| 새 Node Type / Relation Type | **0** | — |

edge 총수가 그대로인 이유: map edge 13개를 받지 않고 교정 edge 13개를 넣었다.
relation 이 바뀐 2건은 둘 다 learn-first 라 선수학습 계산의 방향이 그대로다.

---

## J. Git

| | |
| --- | --- |
| commits | 3 (`93edc09` · `817f4a1` · `78feccd`) |
| push | main |
| working tree | clean |

RC1 보호: `git diff glossary-rc1 -- data/curated data/knowledge-maps extension` **비어 있음**.
기존 tag 4종 전부 불변.

---

## K. Verdict

**ENCYCLOPEDIA_LEARNER_TEST_READY**

| 조건 | 결과 |
| --- | --- |
| known semantic defect 0 | ✅ EX03 CONTEXT_MISMATCH 4 → 0 |
| NEEDS_MINOR_EDITORIAL 0 | ✅ 145 → 0 |
| known EX03 CONTEXT_MISMATCH 0 | ✅ |
| learner-facing formatting defect 0 | ✅ 백틱·괄호 조사·정의 중복 전부 0 |
| display leak 0 | ✅ |
| Scenario A–G PASS | ✅ 7 / FRICTION 0 / BLOCKED 0 |
| semantic regression 0 | ✅ Impact Gate 영향 0 |
| Knowledge Model regression 0 | ✅ |
| all automated QA PASS | ✅ |
| generated data 최신 | ✅ 결정론적 재빌드 확인 |
| working tree clean | ✅ |

`NEEDS_MANUAL_REVIEW` 도 0 이지만, **근거가 부족한 것을 숫자를 맞추려고 OK 처리하지
않았다.** 33건 전부 Mission source 와 대조했고 근거가 모자란 2건은 표현을 근거 수준에
맞춰 내렸다. `SOURCE_INSUFFICIENT` 가 0 인 것은 저장소의 Mission source 가 33건 모두에
대해 판정할 만큼 있었기 때문이다.

---

## L. 남은 것 (이번 Cycle 에서 시작하지 않는다)

- **실제 학습자 검증** — 518개가 기준을 통과한다는 것과 비전공 초심자가 읽고 이해한다는
  것은 다른 말이다. 다음 Cycle 의 주제다
- 동결 map 의 learn-first reason **41건**이 여전히 map 출처다. 지난 감사에서 `REASON_OK`
  40건 + 이번에 판단해 그대로 둔 `rbac` 1건이다
- Owner Gate: **U14**(SRE 후보 5건) · **U15**(컴퓨터구조 후보 5건) · **U13** · **U16** ·
  **U8** — 전부 `INDEPENDENT`
- `remote -is_a-> remote` self-reference 1건은 U9 처리 그대로 유지
