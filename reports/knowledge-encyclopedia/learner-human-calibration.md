# Learner Comprehension Human Calibration

- 기준 커밋: `c345508` (LEARNER_READABILITY_MODEL_READY)
- 완료일: 2026-09-24
- 판정: **LEARNER_HUMAN_TEST_PREPARED**

> **실제 학습자 테스트는 아직 하지 않았다.** 이 문서는 사람이 검증할 준비를 마친 상태를
> 기록한다. 관찰이 들어오기 전에는 어떤 가설도 지지됐다고 판정하지 않는다.

`content/terms` **변경 0**. 콘텐츠는 한 글자도 고치지 않았다.

---

## A. Owner Pilot Review

### 비교본

`reports/knowledge-encyclopedia/learner-pilot-comparison.md` — **Pilot 11개**

`scripts/build_pilot_comparison.py` 가 만든다. **CURRENT 를 손으로 옮겨 적지 않는다.**
언제나 `src/data/generated/glossary.json` 에서 읽어 화면에 보이는 순서 그대로 쓴다.
콘텐츠가 바뀌어도 비교본이 어긋나지 않는다.

각 항목의 구성:

```
CURRENT   지금 학습자가 보는 순서와 문장 전부 (바뀌는 절에 ← 표시)
PROPOSED  바뀌는 절만
CHANGE    무엇이 달라졌는지 (짧게)
RISK      이 제안이 잃을 수 있는 것
WHY       왜 그렇게 바꾸려 하는가
```

### Pilot 10 → 11

Discovery 의 10개에 **`dom-update`** 를 더했다. 무작정 늘린 것이 아니라 두 빈자리를
동시에 메우는 하나를 골랐다.

1. **테스트 세트에 Web 도메인이 하나도 없었다.** Web 은 사전에서 가장 큰 분야(77개)이고
   M01·M02 는 학습자가 가장 먼저 하는 미션이다. 초심자가 실제로 가장 먼저 읽는 쪽이 빠져 있었다.
2. **mid 비중을 늘려야 했다**(§5·§12). `dom-update` 는 mid 이면서 읽기·이해가 둘 다
   FRICTION 인 유일한 Web term 이다.

### CHANGE 유형 분포

| 유형 | 건수 |
| --- | --- |
| 첫 문장을 쉬운 설명으로 교체 / 정의어를 뒤로 이동 | 6 |
| 영문 전문용어를 L2 이후로 이동 | 5 |
| 한 문장의 새 개념 수를 줄임 (4~5개 → 1~2개) | 4 |
| 비유 뒤에 실제 기술 설명 추가 | 3 |
| 예시를 그 용어의 것으로 교체 | 3 |
| 명사구 → 문장 | 3 |

### RISK — 제안이 잃는 것

**11개 전부에 RISK 를 적었다.** 제안이 공짜가 아니라는 뜻이다. 대표적인 것:

```
process   요리법/요리 비유는 "자원 경계" 를 담지 못한다. 두 요리사가 같은 주방을 쓰는
          것처럼 읽혀 프로세스 사이의 메모리가 분리돼 있다는 핵심을 오히려 흐릴 수 있다.
          그 점에서는 현재 문장이 정확했다.

JWT       claims 라는 이름이 첫 화면에서 사라진다. 다른 문서와 라이브러리가 그 말을
          쓰므로 학습자가 나중에 만났을 때 연결이 끊길 수 있다.

commit    "부모 history" 가 빠진다. 커밋이 사슬로 이어진다는 점은 M10 의 핵심인데
          첫 화면에서 그 단서가 사라진다.

hash-map  "탐사 방식"(open addressing)이 빠져 충돌 해결이 한 가지인 것처럼 읽힐 수 있다.
```

Owner 의 두 번째 질문("너무 쉬워져 정확성을 잃지 않았는가")은 이 RISK 항목과 함께 본다.

### 비교본을 만들다가 내 제안에서 찾은 결함

CURRENT 를 실제 데이터에서 렌더링하니 **제안 자체의 문제 네 건**이 드러났다. 전부 고쳤다.

| 무엇 | 어디 |
| --- | --- |
| 제안이 그 문서의 문체와 어긋남 (존댓말 문서에 평서체 제안) | `variable` · `tcp` |
| 반대 방향 (평서체 문서에 존댓말 제안) | `o-constant-time` |
| 제안이 현재 내용 셋을 말없이 떨어뜨림 (상자 비유 경고 · object reference · 재할당 규칙) | `variable` |

앞의 셋은 **Discovery 가 문제로 지적한 문체 혼용을 제안이 새로 만들고 있었다.**
네 번째는 RISK 에 적지 않은 손실이었다. 손으로 옮겨 적었다면 넷 다 놓쳤을 것이다.

---

## B. Learner Test Method

### 대상

> SW·컴퓨터공학을 체계적으로 공부한 경험이 적고, Codyssey Mission 과정에서 기술 용어를
> 접하고 있는 학습자.

**전문 개발 경험자를 주 평가자로 두지 않는다.** 개발자는 막히지 않기 때문에 막히는
자리를 찾지 못한다.

### 성격

**formative test 다.** 통계 연구가 아니다. 소수에서 **반복되는** comprehension failure 를
찾는 것이 목적이므로, 4명에서 같은 문장에 두 번 막히면 그것이 자료다.

### 절차

```
1. 읽기 전   이 낱말을 들어 본 적 있습니까? 들어 봤다면 무엇이라고 생각하십니까?
2. 읽는 중   막히면 그 문장을 짚어 주세요. (진행자는 설명하지 않는다)
3. 화면을 가린다                                    ← 반드시
4. 읽은 뒤   방금 읽은 내용을 자기 말로 설명해 주세요.   ← 가장 중요하다
5.           이 개념은 왜 필요한 것 같나요?
6.           이해하기 어려웠던 단어나 문장이 있었나요?
7.           예시가 도움이 됐나요?
8.           더 알고 싶은 내용이 있었나요?
```

**"이해됐나요?" 는 묻지 않는다.** 거의 모두가 그렇다고 답한다.

### 평가 기준

| | |
| --- | --- |
| PASS | 전문용어를 못 써도 **핵심 개념을 자기 말로 재구성**했다 |
| PARTIAL | 일부는 맞지만 핵심 하나가 빠졌거나 뒤집혔다 |
| FAIL | 원문 표현을 되풀이하지만 뜻을 설명하지 못한다 |

**문장을 그대로 기억했는지를 평가하지 않는다.** 원문을 반복하면서 의미를 설명하지
못하면 이해 성공으로 보지 않는다.

---

## C. Term / Version Allocation

`data/reviews/learner-test-plan.json` · `scripts/build_learner_test_plan.py`

### 테스트 세트 9개

| | basic | mid | hard |
| --- | --- | --- | --- |
| Discovery 표본 36 | 8 (22%) | 10 (28%) | **18 (50%)** |
| 이번 테스트 세트 9 | 1 (11%) | **5 (56%)** | 3 (33%) |

Discovery 는 "이해가 무너질 위험은 hard 에 몰려 있다" 고 보고 표본을 기울였는데
**그 가정이 틀렸다**(basic 7/8 PASS · mid 5/10 · hard 12/18). 이번에는 mid 를 과반으로
두고 도메인 9개를 모두 넣었다.

| term | 난이도 | 도메인 |
| --- | --- | --- |
| `mysql` | basic | Data/DB |
| `variable` | mid | Programming |
| `commit` | mid | SWE/Git |
| `dom-update` | mid | Web |
| `o-constant-time` | mid | Algorithms |
| `temperature` | mid | AI |
| `process` | hard | OS/System |
| `json-web-token` | hard | Security |
| `tcp` | hard | Network |

### 교차 배치 (§8)

같은 사람이 같은 용어의 두 판본을 보면 두 번째가 유리해진다. 그래서 **판본을
참여자마다 엇갈리게** 두고, 한 사람 안에서도 판본이 번갈아 나오게 했다.

| 참여자 | 순서 | 난이도 |
| --- | --- | --- |
| **P1** | `mysql`현재 → `variable`제안 → `commit`현재 → `process`제안 → `tcp`현재 | basic 1 · mid 2 · hard 2 |
| **P2** | `mysql`제안 → `variable`현재 → `commit`제안 → `process`현재 → `tcp`제안 | basic 1 · mid 2 · hard 2 |
| **P3** | `dom-update`현재 → `o-constant-time`제안 → `temperature`현재 → `json-web-token`제안 | mid 3 · hard 1 |
| **P4** | `dom-update`제안 → `o-constant-time`현재 → `temperature`제안 → `json-web-token`현재 | mid 3 · hard 1 |

용어 9개 × 판본 2 = **읽기 18회**. 참여자 4명, 한 사람당 4~5개.

배치 규칙은 스크립트가 검사한다 — 같은 사람이 같은 용어를 두 번 보지 않고, 모든 용어가
두 판본으로 읽히고, 판본이 한쪽으로 몰리지 않는다. 어기면 생성이 멈춘다.

**참여자가 둘뿐이면 P1·P2 만 진행한다.** 용어 5개가 두 판본으로 읽힌다.

한 사람당 4~5개로 제한한 이유는 피로다. 다섯 번째 용어의 답은 첫 번째만큼 믿을 수 없다.
P3·P4 에는 basic 이 없는데, 세트에 basic 이 하나뿐이라 그렇다.

---

## D. Observation Sheet

`reports/knowledge-encyclopedia/learner-observation-sheet.md` — 18개 칸이 미리 찍혀 있다.

```
TERM              variable  (mid · Programming)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)

WHY               PASS / PARTIAL / FAIL

UNKNOWN_WORDS

CONFUSION_POINT   (읽다가 멈춘 문장)

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE
```

**개인정보는 적지 않는다.** 참여자는 P1~P4 로만 구분한다.

기록이 들어오면 `data/reviews/learner-test-plan.json` 의 `observations` 배열에 넣는다.
현재 그 배열은 **비어 있고** `status` 는 `NOT_YET_RUN` 이다.

---

## E. AI vs Human Comparison

**관찰이 들어오기 전에 AI 판정을 먼저 적어 두었다.** 나중에 유리하게 맞추지 않기 위해서다.

| term | 난이도 | AI 읽기 | AI 이해 | 자동 신호 | AI 예측 |
| --- | --- | --- | --- | --- | --- |
| `mysql` | basic | FRICTION | PASS | — | **OK** |
| `commit` | mid | FRICTION | PASS | 영문 밀집 | **OK** |
| `variable` | mid | FRICTION | HARD | — | 막힘 |
| `dom-update` | mid | FRICTION | FRICTION | 설명 없는 선수용어 | 막힘 |
| `o-constant-time` | mid | PASS | FRICTION | — | 막힘 |
| `temperature` | mid | PASS | FRICTION | — | 막힘 |
| `process` | hard | FRICTION | FRICTION | — | 막힘 |
| `json-web-token` | hard | HARD | HARD | 영문 밀집 · 선수용어 | 막힘 |
| `tcp` | hard | HARD | HARD | 영문 밀집 | 막힘 |

AI 는 9개 중 **7개에서 사람이 CURRENT 판본에 막힐 것**이라고 본다. `mysql` 과 `commit` 은
읽기는 걸리지만 이해는 된다고 봤다.

### 채울 칸 (관찰 후)

```
aiFrictionAndHumanStuck   AI 가 걸었고 사람도 막힌 것    → 518개 검토에 쓸 수 있는 신호
aiPassButHumanFailed      AI PASS 인데 사람이 실패       → AI 가 놓치는 종류. 가장 중요하다
aiFlaggedButHumanFine     AI 가 걸었는데 사람은 괜찮음    → 과잉 신호. 줄여야 한다
bothPass                  둘 다 통과                    → 현재 방식이 통하는 자리
```

**목표는 AI 정답률을 올리는 것이 아니다.** 518개를 검토할 때 믿고 쓸 수 있는 신호가
무엇인지 가려내는 것이다. Discovery 에서 자동 신호는 사람이 찾은 문제의 **29%** 만
잡았고, 난이도·tier·선수 깊이는 이해도를 전혀 예측하지 못했다.

---

## F. Supported Hypotheses

**없다.** 관찰이 하나도 들어오지 않았다.

AI 가 스스로 지지됐다고 선언하지 않는다(§18). `data/reviews/learner-test-plan.json` 의
`hypotheses` 는 전부 `UNJUDGED` 다.

| 가설 | 범위 | 무엇으로 보나 | 현재 |
| --- | --- | --- | --- |
| **첫 문장 역전** — 쉬운 설명을 먼저 주면 이해가 개선된다 | 519개 중 **333건** | `mysql` `commit` `variable` `dom-update` `process` `tcp` `json-web-token` 의 두 판본 비교 | `UNJUDGED` |
| **중간 난이도** — 기본이라 보고 압축한 설명이 오히려 더 많은 선수지식을 요구한다 | mid 5/10 PASS | mid 5개(`variable` `commit` `dom-update` `o-constant-time` `temperature`)의 RESTATE | `UNJUDGED` |
| **문체 혼용** — 한 문서 안의 존댓말·평서체 전환이 읽기를 끊는다 | 519개 중 **340건** | CONFUSION_POINT 에 문체 전환 지점이 반복해 나오는지 | `UNJUDGED` |
| **명사구 종결** — 명사구로 끝나는 한 줄 설명이 문장보다 덜 읽힌다 | 519개 중 **349건** | `mysql` `commit` `dom-update`(셋 다 명사구)의 두 판본 비교 | `UNJUDGED` |

판정할 값은 `SUPPORTED_BY_HUMAN_TEST` / `PARTIALLY_SUPPORTED` / `NOT_SUPPORTED` 다.

### 문체 혼용 가설은 이번 설계로는 약하다

솔직히 적는다. 문체 혼용은 **이번 Pilot 에서 직접 조작하지 않았다.** 제안은 오히려
그 문서의 기존 문체에 맞췄다. 그래서 두 판본 비교로는 이 가설을 가를 수 없고,
CONFUSION_POINT 가 우연히 문체 전환 지점에 몰리는지 보는 **간접 관찰**만 가능하다.

이 가설을 제대로 보려면 같은 용어를 문체만 바꿔 두 판본으로 만들어야 하는데,
그것은 별도 설계다. **이번 결과로 340건을 건드리지 않는다.**

---

## G. Rejected Hypotheses

**없다.** 기각할 근거도 아직 없다.

다만 Discovery 에서 **이미 데이터로 기각된 것 하나**를 여기 옮겨 적는다. 이번 설계가
그 교훈 위에 서 있기 때문이다.

```
기각됨 (Discovery)   "이해가 무너질 위험은 어려운 개념에 몰려 있다"
근거                 basic 7/8 PASS · mid 5/10 · hard 12/18
                     난이도·tier·선수 깊이 어느 것도 이해도를 예측하지 못했다
이번 설계에 반영      테스트 세트를 mid 과반(5/9)으로 다시 짰다
```

---

## H. Explanation Model Revision

### 현재 가설 (Discovery)

```
L1  처음 이해    이게 한마디로 무엇인가
L2  기본 개념    왜 필요하고 기본적으로 어떻게 되는가
L3  구체적인 모습  실제로는 어떤 모습인가
L4  기술 세부    더 정확히 알려면 무엇이 필요한가
```

### 제안 — 5단계로 늘린다 (구조적 근거만, 학습자 검증 전)

```
L5  다음 학습    이 다음에는 무엇을 보면 되는가
```

근거는 **제품에 이미 있다는 것**이다. 용어 페이지의 `먼저 볼 개념`, `관련 용어`,
선수학습 화면이 이미 L5 를 채우고 있는데 Discovery 의 4단계 모델이 그것을 이름 없이
두었다. 이름을 주면 Owner 의 일곱 번째 질문("더 알고 싶을 때 다음 단계가 자연스러운가")이
내려앉을 자리가 생긴다.

| 계층 | 현재 화면 |
| --- | --- |
| L1 | `한 줄 설명` |
| L2 | `쉽게 설명하면` → `정확한 설명` → `동작 원리` |
| L3 | `코드 예` |
| L4 | `주의할 점` · `흔한 오해` |
| **L5** | **`먼저 볼 개념` · `관련 용어` · `동료평가 질문` · 선수학습 화면** |

**이것은 구조 관찰이지 학습자 검증이 아니다.** L5 가 실제로 도움이 되는지는 테스트의
8번 질문("더 알고 싶은 내용이 있었나요?")과 Owner 의 7번 질문이 답한다.

### 바뀌지 않는 것

- **모든 term 에 같은 절을 강제하지 않는다.** `CORS` 는 코드 없이 L3 를 채우고도
  Discovery 표본에서 가장 잘 읽혔다
- 단계 수 자체도 결과에 따라 다시 조정할 수 있다. 5가 최종이 아니다
- 통일할 것은 **이해 단계**이지 Markdown 절 구조가 아니다

---

## I. Next-scope Recommendation

관찰이 들어온 뒤에 고를 수 있는 선택지를 미리 적어 둔다. **`518개 전체 rewrite` 는
기본 선택지가 아니다.**

| # | 범위 | 건수 | 언제 고르나 | 비용 |
| --- | --- | --- | --- | --- |
| 1 | **첫 문장만 재배치** | 333 | 첫 문장 역전 가설이 `SUPPORTED` 일 때 | 낮다. 대부분 더 쉬운 문장이 이미 문서 안에 있다 |
| 2 | **mid 난이도 우선 rewrite** | 미정 | 중간 난이도 가설이 `SUPPORTED` 일 때 | 중간. 범위를 먼저 재야 한다 |
| 3 | **Web·Programming 분야만** | 160 | 초반 미션(M01·M02) 이탈이 문제일 때 | 중간 |
| 4 | **예시 정책만 적용** | 미정 | EXAMPLE_HELPED 가 NO 로 몰릴 때 | 낮다. 예시 교체는 절 하나다 |
| 5 | **아무것도 하지 않는다** | 0 | 두 판본의 RESTATE 가 차이 없을 때 | — |

**5번을 실제 선택지로 둔다.** 두 판본에서 이해도가 같게 나오면 이 방향이 틀린 것이고,
그때 333건을 바꾸는 것은 순전한 손실이다.

### 부분 적용이 기본이다

```
가설 하나가 SUPPORTED  →  그 가설에 해당하는 범위만
가설이 PARTIALLY       →  조건을 좁혀서 (예: mid 이면서 Web 인 것만)
가설이 NOT_SUPPORTED   →  적용하지 않고 왜 틀렸는지 기록
```

---

## J. Verdict

**LEARNER_HUMAN_TEST_PREPARED**

| 조건 | 상태 |
| --- | --- |
| Owner 검토용 비교본 (CURRENT/PROPOSED/CHANGE/RISK) | ✅ 11개 · 생성 스크립트로 CURRENT 고정 |
| Owner calibration 질문 | ✅ 7개 |
| 학습자 테스트 세트 | ✅ 9개 · mid 과반 · 도메인 9개 전부 |
| term/version 교차 배치 | ✅ 4명 · 18회 · 규칙 자동 검사 |
| 관찰 기록지 | ✅ 18칸 · 개인정보 없음 |
| AI 예측 사전 기록 | ✅ 관찰 전에 봉인 |
| 가설 판정 | ⬜ **전부 UNJUDGED** — 관찰이 없다 |
| 실제 학습자 테스트 | ⬜ **미수행** |

`LEARNER_CONTENT_MODEL_VALIDATED` 로 가지 않는다. **사람이 테스트하지 않았는데 AI 가
스스로 검증됐다고 선언하지 않는다**(§18).

---

## K. 여기서 멈춘다

다음은 사람이 한다.

1. **Owner 가 Pilot 11개를 읽는다** — `learner-pilot-comparison.md`, 질문 7개
2. **실제 Codyssey 학습자 테스트** — `learner-observation-sheet.md`, 4명 · 18회
3. 관찰을 `learner-test-plan.json` 의 `observations` 에 넣는다
4. 그다음에야 가설을 판정하고 적용 범위를 고른다

**자동으로 시작하지 않는 것**: 첫 문장 역전 333건 · 문체 혼용 340건 · 명사구 종결 349건 ·
518개 rewrite · 새 template 강제 · View 변경.
