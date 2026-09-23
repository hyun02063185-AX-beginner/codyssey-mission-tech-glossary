# Learner Readability & Comprehension Discovery

- 기준 커밋: `6971e71` (ENCYCLOPEDIA_LEARNER_TEST_READY)
- 완료일: 2026-09-23
- 판정: **LEARNER_READABILITY_MODEL_READY**

전체 콘텐츠를 다시 쓰지 않았다. **기준을 발견하고 검증했다.**
`content/terms` 는 한 글자도 바뀌지 않았다.

---

## A. Sample

| | |
| --- | --- |
| selected | **36** |
| domains | 9 (Programming · Web · Data/DB · OS/System · Network · Security · AI · SWE/Git · Algorithms) |
| difficulty | basic **8** · mid **10** · hard **18** |

### 뽑은 방법

새 ranking 을 만들지 않았다. 이미 있는 신호로 칸을 나누고 각 칸에서 골랐다.

| 신호 | 출처 |
| --- | --- |
| tier A/B/C | `data/reviews/content-tier-sprint7.json` |
| importance · difficulty | `glossary-master-v0.1.yaml` |
| mission direct/required/related | `mission_refs[].source_status` |
| 학문 소속 · 선수 사슬 깊이 | `encyclopedia-graph.json` |
| 본문 길이 · 영문 밀도 | `glossary.json` |

난이도 칸은 이렇게 갈랐다 — **hard**: tier A 이거나 difficulty 3 이거나 선수 깊이 ≥3 /
**basic**: tier C / **mid**: 나머지.

**hard 를 일부러 많이 넣었다(18/36).** 이해가 무너질 위험이 거기 몰려 있다고 보았기
때문이다. 결과는 그 가정을 뒤집었다(D절).

### 36개

| 도메인 | basic | mid | hard |
| --- | --- | --- | --- |
| Programming | — | `variable` `class` | `async-await` `deadlock` |
| Web | `index-html` | `dom-update` | `cors` `controlled-input` |
| Data/DB | `mysql` | `group-by` | `left-join` `time-to-live` |
| OS/System | `ps` | `file-io` | `process` `volume` |
| Network | `localhost` | `http-get` | `tcp` `virtual-private-cloud` |
| Security | `hardcoding` | `login` | `json-web-token` `file-permission` |
| AI | `simulator` | `temperature` | `inference` `attention` |
| SWE/Git | `git-diff` | `commit` | `merge-conflict` `code-review` |
| Algorithms | `top-n` | `o-constant-time` | `hash-map` `least-recently-used` |

기록: `data/reviews/learner-readability-sample.json`

---

## B. Readability

```
PASS 20 · FRICTION 14 · HARD 2
```

HARD: `tcp` · `json-web-token`

### 주요 패턴

**B-1. 첫 문장 역전 — 가장 크고 가장 고치기 쉽다**

`한 줄 설명` 은 화면 맨 위에 있다. 그런데 519개 중 **333개**에서 그것이
`쉽게 설명하면` 보다 영문 전문용어가 많다. 평균 **2.04 대 0.22 — 9배**.

```
MySQL   한 줄  널리 쓰이는 open-source relational database 관리 시스템.
        쉽게   널리 쓰이는 서버형 데이터베이스입니다.

ps      한 줄  현재 process snapshot 을 보여 주는 Unix command.
        쉽게   지금 어떤 프로그램이 돌고 있는지 한 번 찍어서 보여 주는 명령입니다.

commit  한 줄  staging area 의 snapshot 과 부모 history 를 기록하는 Git object.
        쉽게   그 순간의 파일 상태를 통째로 찍어 기록에 남기는 일입니다.
```

세 경우 모두 **더 쉬운 문장이 이미 문서 안에 있다.** 순서만 뒤집혀 있다.
표본 14건의 FRICTION 중 **9건이 이 한 가지 원인**이다.

**B-2. 명사구 종결**

`한 줄 설명` 519개 중 **349개**가 문장이 아니라 명사구다(`…하는 entry file.`).
사전 표제어 문체다. 사전으로는 맞지만, 막힌 상태에서 처음 여는 사람에게는
문장이 아니라 라벨로 읽힌다.

**B-3. 괄호 병기**

`file-permission` — "읽기(read), 쓰기(write), 실행(execute)" 세 번 연속.
읽는 리듬이 끊기고, 정작 좋은 내용(디렉터리의 실행 권한은 다르다)이 뒤에 묻힌다.

**B-4. 문체 혼용 — 기록만 한다**

519개 중 **340개**가 한 문서 안에서 존댓말과 평서체를 섞는다
(`쉽게 설명하면` 430개 존댓말 / `정확한 설명` 339개 평서체). 읽다 보면 목소리가 바뀐다.
**이번에 고치지 않았다.** 519개 일괄 변경이고, 학습자가 이것을 문제로 느끼는지
확인하기 전에 손댈 일이 아니다.

### 문장 길이는 문제가 아니었다

```
평균 문장 길이   중앙 38.5자 · 상위 10% 58자 · 최대 78.5자
최대 문장 길이   중앙 48자   · 상위 10% 67자 · 최대 98자
추상명사         중앙 0      · 최대 2
```

"문장을 짧게" 로 고칠 것이 거의 없다. 읽기 문제는 **길이가 아니라 낱말**에 있다.

---

## C. Comprehension

```
PASS 24 · FRICTION 8 · HARD 4
```

HARD: `variable` · `tcp` · `json-web-token` · `attention`

### 주요 패턴

**C-1. 정의가 정의를 요구한다 — 가장 심각하다**

```
변수   Variable은 프로그램이 값을 가리키고 다시 사용할 수 있도록 이름을 붙인 binding입니다.
       → 정의의 뼈대가 binding 이다. binding 을 모르면 문장 전체가 막힌다

JWT    JSON claims 를 header·payload·signature 형태로 표현해 전달하는 token format
       → claims 가 미설명이고 그것이 정의의 주어다
```

`변수` 는 이 사전에서 가장 쉬운 개념 축에 드는데 **Comprehension HARD** 가 나왔다.
난이도가 아니라 **쓰는 방식**의 문제다.

**C-2. 한 문장에 새 개념 넷 이상**

```
TCP      byte stream, sequence number, acknowledgement, retransmission, flow/congestion control  (5)
어텐션    query·key·value 의 유사도를 점수화해 가중 합을 만든다                                  (4)
해시맵    해시 함수가 키를 버킷 위치로 바꾸고, 충돌은 체이닝 또는 다른 탐사 방식으로 해결한다      (4)
```

셋까지는 읽힌다. 넷부터 목록이 된다.

**C-3. 비유에서 기술로 건너뛴다**

```
temperature   "다이얼"  →  (중간 없음)  →  "logit 분포를 재조정해"
어텐션         "중요한 단어를 더 살핀다"  →  (중간 없음)  →  "query·key·value 유사도"
```

비유는 좋은데 착지가 없다. `deadlock`(열쇠 → lock 순환)과 `cors`(문제 상황 → 헤더)는
착지가 있어서 둘 다 PASS 다.

**C-4. 비유가 설명 대상보다 어렵다**

`O(1)` — "데이터가 많아져도 **한 번의 주소 계산처럼** 처리량이 거의 늘지 않는 경우다."
주소 계산은 해시맵을 이미 아는 사람의 낱말이다. 비유가 진입 장벽이 됐다.

**C-5. 쉽게 설명하면이 너무 일반적이다**

`simulator` — "실제 장비를 건드리기 전에 가상 환경에서 결과를 시험하는 도구다."
비행 시뮬레이터와 구분되지 않는다. 예비 M03 의 NPU 맥락은 `왜 필요한가` 에만 있다.

---

## D. Cognitive Load

| | |
| --- | --- |
| issues | **12 / 36** (첫 화면 또는 정확한 설명에서 새 개념 3개 이상) |
| most common | 정확한 설명 한 문장에 새 개념 4개 이상 |

### 난이도는 이해도를 예측하지 못했다

| 난이도 칸 | Comprehension PASS |
| --- | --- |
| basic (8) | **7 / 8** |
| mid (10) | **5 / 10** |
| hard (18) | **12 / 18** |

**`mid` 가 가장 나쁘다.** `hard` 는 어려운 개념인 것을 알고 공들여 썼고, `basic` 은
원래 단순하다. 중간 난이도가 "설명이 필요할 만큼 어렵지만 공들이지는 않은" 구간이다.

같은 이유로 tier 도 예측력이 없었다 — tier A 18개 중 PASS 12, tier B·C 에서 HARD 2건.

**이번 표본을 hard 쪽으로 기울여 뽑은 것은 결과적으로 잘못된 가정이었다.**
다음 표본은 `mid` 를 더 넣어야 한다.

---

## E. Vocabulary

| | |
| --- | --- |
| unknown prerequisite issues | **87 / 519** (첫 화면에 선수 관계 없이 다른 용어가 등장) |
| 표본에서 | **4 / 36** (`dom-update` `controlled-input` `login` `json-web-token`) |

§7 의 네 판정을 표본에 적용한 결과다.

| 판정 | 예 |
| --- | --- |
| `KNOWN_FOUNDATION` | 파일, 폴더, 주소, 브라우저, 서버 |
| `EXPLAIN_INLINE` | `binding`(변수), `claims`(JWT), `멱등`(GET) — 정의의 뼈대라 그 자리에서 풀어야 한다 |
| `LINK_FIRST` | `Promise`(async/await), `lock`(deadlock) — 그 자체가 개념이고 선수 관계가 이미 있다 |
| `AVOID_FOR_NOW` | `base64url`(JWT), `flow/congestion control`(TCP) — 첫 설명에 필요 없다 |

`login` 은 자동 신호가 "설명 없는 선수용어 3개" 로 걸었지만 사람이 보면 전부
문맥으로 풀린다(세션·토큰이 "표식" 으로 설명돼 있다). **자동 신호의 오탐 1건**이다.

---

## F. Examples

| | |
| --- | --- |
| good | **29 / 36** |
| weak | **5** (`process` `tcp` `json-web-token` `file-permission` `http-get`) |
| missing | **2** (`cors` `attention` — 그중 `cors` 는 없는 것이 맞다) |

### 가장 나쁜 예시

```
TCP       sudo ufw allow 20022/tcp
          → 방화벽 예제다. TCP 가 무엇인지 보여 주지 않는다

process   ps -ef
          → 목록을 보여 줄 뿐, "프로그램 파일과 다르다" 는 이 term 의 핵심을 건드리지 않는다

JWT       base64url(header).base64url(payload).base64url(signature)
          → 형식은 보여 주지만 왜 세 토막인지, 실제로 어떻게 생겼는지가 없다
```

**판정 기준**: 그 용어의 예제인가, 옆 용어의 예제인가.

### `cors` 는 코드가 없어서 더 좋다

동작 서술만으로 L3 를 채우고 표본에서 가장 잘 읽히는 문서 중 하나다.
**모든 term 에 코드를 강제하지 않는다**는 원칙이 실제로 맞았다.

---

## G. Explanation Layers

| | |
| --- | --- |
| fit | **31 / 36** 이 L1~L4 로 읽힌다 |
| exceptions | **5** — L1 과 L2 가 뒤집혀 있다(`한 줄 설명` 이 `쉽게 설명하면` 보다 어렵다) |
| recommended model | **단계는 고정, 형식은 자유** |

현재 절 구조는 대체로 계층과 맞는다.

```
한 줄 설명        → L1 처음 이해      ← 여기가 뒤집힌 문서가 333개
쉽게 설명하면      → L1~L2
정확한 설명        → L2~L4
동작 원리          → L2 (있는 문서만)
코드 예            → L3
주의할 점 / 흔한 오해 → L4
```

**절 구조를 바꿀 필요는 없다.** 바꿀 것은 `한 줄 설명` 에 들어가는 문장의 난이도다.

### 형식은 term 마다 다르다 (§8 검증)

```
변수     직관 → 코드 → 값·메모리 → scope·reference
CORS     문제 상황 → 출처 → 브라우저 제한 → 허용 방식      (코드 없음)
Process  프로그램과의 차이 → 실행 → OS 관리 → thread 비교
TCP      무엇이 보장되나 → 조각·순서 → 재전송 → 혼잡 제어  (흐름도가 유리)
```

넷 다 L1→L4 이지만 내용 형식이 다르다. **template 으로 고정하면 안 된다**는 가설이
표본에서 확인됐다.

---

## H. Pilot

10개를 골랐다. **`content/terms` 를 고치지 않았다.** 아래는 제안이다.

고른 기준: 쉬운 term(`mysql`) · 중간(`variable` `commit` `temperature` `o-constant-time`) ·
어려운(`tcp` `json-web-token` `attention` `process` `hash-map`) · 비유가 필요한 것 ·
코드가 필요한 것 · 흐름도가 유리한 것을 섞었다.

---

### H-1. `variable` — 정의가 정의를 요구한다

```
CURRENT   [한 줄] Variable은 프로그램이 값을 가리키고 다시 사용할 수 있도록
                 이름을 붙인 binding입니다.

PROPOSED  [한 줄] 값에 이름을 붙여 두고, 그 이름으로 다시 꺼내 쓰는 것입니다.
          [정확] 언어는 이름과 값의 연결을 binding 이라 부르고, 그 연결이 언제까지
                 살아 있는지(lifetime)와 어디서 보이는지(scope)를 각기 다르게 정한다.

WHY       정의의 뼈대였던 binding 을 L1 에서 빼고 L4 로 내렸다. 표본에서 가장 쉬운
          개념인데 Comprehension HARD 가 나온 이유가 이 한 낱말이었다.
```

### H-2. `mysql` — 첫 문장 역전의 전형

```
CURRENT   [한 줄] 널리 쓰이는 open-source relational database 관리 시스템.
          [쉽게] 널리 쓰이는 서버형 데이터베이스입니다.

PROPOSED  [한 줄] 여러 사람이 네트워크로 함께 접속해 쓰는 데이터베이스입니다.
          [쉽게] 웹 서비스에서 오래 쓰여 자료와 사례가 많습니다. 파일 하나로 끝나는
                 방식과 달리 서버를 따로 띄워야 합니다.

WHY       두 절이 같은 말을 하고 있었고 먼저 읽히는 쪽이 더 어려웠다. L1 을 가장
          쉬운 문장으로 올리고, 중복을 없애면서 L2 에 "무엇과 다른가" 를 넣었다.
```

### H-3. `commit` — Git 내부 어휘로 쓴 첫 문장

```
CURRENT   [한 줄] staging area의 snapshot과 부모 history를 기록하는 Git object.

PROPOSED  [한 줄] 그 순간의 파일 상태를 통째로 찍어 기록에 남기는 일입니다.
          [정확] 스테이지에 올린 내용으로 그 시점의 전체 상태를 만들고, 부모 커밋·
                 작성자·시각·메시지와 함께 저장한다. (현재 문장 유지)

WHY       영문 6개를 L1 에서 빼고 이미 문서 안에 있던 더 나은 문장을 올렸다.
          staging area·snapshot·Git object 는 L2 이후에 이미 설명돼 있다.
```

### H-4. `process` — 핵심 대비가 각주로 밀려 있다

```
CURRENT   [한 줄] Process는 운영체제가 실행 중인 프로그램에 할당한 독립 실행 단위와
                 자원 경계입니다.
          [주의] Process와 program file은 다릅니다. …

PROPOSED  [한 줄] 프로그램 파일을 실제로 실행했을 때 생기는, 지금 돌아가고 있는 한 덩어리입니다.
          [쉽게] 프로그램 파일은 요리법이고 process 는 지금 요리를 하고 있는 상태입니다.
                 같은 요리법으로 두 명이 동시에 요리하면 요리는 둘입니다.
          [코드] # 같은 프로그램을 두 번 실행하면 process 는 둘이다
                 python app.py &   # PID 4211
                 python app.py &   # PID 4212  ← 파일은 하나, process 는 둘

WHY       "프로그램 파일과 다르다" 가 이 term 의 전부인데 주의할 점 한 줄로만 있었다.
          비유(요리법/요리)를 넣고 코드가 그 대비를 직접 보이게 했다. 현재 코드 예
          `ps -ef` 는 이 term 이 아니라 `ps` 의 예제다.
```

### H-5. `tcp` — 설명이 아니라 용어 목록

```
CURRENT   [한 줄] TCP는 두 endpoint 사이에서 순서와 전달 신뢰성을 관리하는
                 connection-oriented transport protocol입니다.
          [정확] TCP는 byte stream, sequence number, acknowledgement,
                 retransmission, flow/congestion control 등의 메커니즘을 사용합니다.
          [코드] sudo ufw allow 20022/tcp

PROPOSED  [한 줄] 보낸 데이터가 빠지거나 순서가 뒤바뀌지 않도록 챙겨 주는 전달 방식입니다.
          [동작] 보낼 내용을 조각으로 나누고 조각마다 번호를 붙인다.
                 받는 쪽은 번호를 보고 순서를 맞추고, 잘 받았다고 알려 준다.
                 알림이 오지 않은 조각은 보낸 쪽이 다시 보낸다.
                 상대가 감당할 수 있는 양보다 많이 보내지 않도록 속도도 조절한다.
          [코드] 보낸 쪽          받는 쪽
                 [1][2][3][4]  →  [1][2][ ][4]   3번이 사라졌다
                               ←  "3번 못 받았다"
                 [3]           →  [1][2][3][4]   다시 보내 순서를 맞춘다

WHY       메커니즘 5개 나열을 한 흐름으로 바꿨다. 낱말은 그대로 두되 순서대로
          등장시켜 한 번에 하나씩 들어오게 했다. 방화벽 예제는 이 term 의 예가
          아니므로 `왜 필요한가` 절로 옮긴다.
```

### H-6. `json-web-token` — 핵심에 닿기 전에 낱말 넷

```
CURRENT   [한 줄] JSON Web Token(JWT)은 JSON claims를 header·payload·signature
                 형태로 표현해 전달하는 token format입니다.
          [코드] base64url(header).base64url(payload).base64url(signature)

PROPOSED  [한 줄] 점 두 개로 나뉜 긴 문자열이며, 내용을 감추지는 않고 위조만 막습니다.
          [쉽게] 로그인한 뒤 서버가 건네주는 표식입니다. 누가 만들었는지는 확인할 수
                 있지만, 안에 적힌 내용은 누구나 열어 볼 수 있습니다.
          [코드] eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzU4NX0.4f2a…
                 └── 어떤 방식으로 ──┘ └── 누구인지·언제까지 ──┘ └ 위조 검사용 ┘

                 가운데 토막은 그대로 풀어 읽을 수 있다. 비밀을 넣지 않는다.

WHY       "서명은 되지만 암호화는 아니다" 가 이 term 의 값어치인데, 그 말에 닿기
          전에 claims·header·payload·signature 를 넘어야 했다. L1 에 결론을 먼저
          두고, 실제 토큰 모양으로 세 토막을 보이게 했다.
```

### H-7. `attention` — 비유와 수식 사이가 비었다

```
CURRENT   [쉽게] 문장을 읽을 때 현재 답에 중요한 단어를 더 살피게 하는 방식이다.
          [정확] query·key·value의 유사도를 점수화해 가중 합을 만든다.

PROPOSED  [쉽게] (현재 문장 유지)
          [동작] 문장 안의 모든 낱말이 서로 얼마나 관련 있는지 점수를 매긴다.
                 점수가 높은 낱말의 정보를 더 많이, 낮은 낱말은 더 적게 가져와 섞는다.
                 "그것" 이 무엇을 가리키는지는 이 점수로 정해진다.
          [정확] 이 점수를 구하는 세 값을 각각 query·key·value 라 부른다. (현재 문장)

WHY       비유에서 수식 용어로 한 칸에 건너뛰고 있었다. "점수를 매겨 섞는다" 는
          중간 단계를 넣으면 query·key·value 가 이름표로 붙을 자리가 생긴다.
          N×N 계산량 표는 좋으므로 그대로 둔다.
```

### H-8. `hash-map` — 좋은 비유가 정확한 설명에서 끊긴다

```
CURRENT   [쉽게] 이름표를 넣으면 해당 서랍으로 바로 가는 사물함에 가깝다.
          [정확] 해시 함수가 키를 버킷 위치로 바꾸고, 충돌은 체이닝 또는 다른
                 탐사 방식으로 해결한다. 평균 조회·삽입은 O(1)이다.

PROPOSED  [정확] 키를 계산해 서랍 번호를 정하는 함수를 해시 함수라 하고, 그 서랍을
                 버킷이라 한다. 서랍 수가 유한하므로 다른 키가 같은 번호를 받는
                 일이 생기는데, 이것이 충돌이다. 충돌한 키는 같은 서랍 안에 이어
                 두고 꺼낼 때 한 번 더 비교한다.

WHY       비유(사물함)는 좋은데 정확한 설명이 한 문장에 개념 4개를 담아 연결이
          끊겼다. 비유의 낱말(서랍)을 유지한 채 넷을 순서대로 등장시키면
          "왜 충돌이 생기는가" 가 비유 안에서 설명된다.
```

### H-9. `temperature` — 비유에서 기술로 착지가 없다

```
CURRENT   [쉽게] 낮추면 보수적으로, 높이면 더 다양한 후보를 고르는 다이얼이다.
          [정확] logit 분포를 재조정해 샘플링 다양성에 영향을 준다.

PROPOSED  [정확] 모델은 다음에 올 낱말 후보마다 점수를 매긴다. 이 값이 낮으면 점수가
                 가장 높은 후보에 쏠려 거의 같은 답이 나오고, 높으면 점수가 낮은
                 후보도 뽑힐 여지가 생긴다. 기술적으로는 점수 분포를 다시 조정하는
                 것이며 정확한 효과와 허용 범위는 모델 제공자마다 다르다.

WHY       "다이얼" 에서 "logit 분포" 로 한 칸에 건너뛰었다. 점수 → 쏠림 → 분포 조정
          순서를 넣으면 비유가 기술 설명으로 착지한다.
```

### H-10. `o-constant-time` — 비유가 설명 대상보다 어렵다

```
CURRENT   [쉽게] 데이터가 많아져도 한 번의 주소 계산처럼 처리량이 거의 늘지 않는 경우다.

PROPOSED  [쉽게] 사물함 번호를 알면 사물함이 100칸이든 10만 칸이든 한 번에 갑니다.
                 찾는 데 걸리는 일이 전체 크기와 상관없는 경우입니다.

WHY       "주소 계산" 은 해시맵을 이미 아는 사람의 낱말이라 비유가 진입 장벽이 됐다.
          같은 사물함 비유를 쓰면 `hash-map` 과도 이어진다.
```

기록: `data/reviews/learner-readability-pilot.json`

---

## I. UI

### 지금 UI 가 이미 지원하는 것

| 계층 | 현재 화면 | 상태 |
| --- | --- | --- |
| L1 처음 이해 | `한 줄 설명` (맨 위) | **자리는 있다.** 들어간 문장이 문제다 |
| L2 기본 개념 | `쉽게 설명하면` → `정확한 설명` → `동작 원리` | 지원됨 |
| L3 구체적인 모습 | `코드 예` (`<pre>`) | 지원됨 |
| L4 기술 세부 | `주의할 점` · `흔한 오해` · `동료평가 질문` | 지원됨 |
| prerequisite | 용어 페이지의 `먼저 볼 개념` + 선수학습 화면 | 지원됨 |

**이번 Pilot 제안은 전부 현재 UI 에서 그대로 구현된다.** View 변경이 필요 없다.

### 현재 UI 의 한계

1. **단계를 접을 수 없다.** 모든 절이 한 화면에 펼쳐져 있어, 초심자는 L4(주의할 점·
   흔한 오해)까지 스크롤에서 만난다. "지금은 여기까지만" 을 고를 수 없다.
2. **읽는 순서가 절 순서에 묶여 있다.** `정확한 설명` 이 `쉽게 설명하면` 보다 위에
   있어야 하는 term 은 없지만, 반대로 `코드 예` 를 먼저 보고 싶은 사람도 있다.
3. **선수 개념이 다른 화면에 있다.** 첫 화면에서 모르는 낱말을 만나면 페이지를 떠나야 한다.
   `EXPLAIN_INLINE` 로 해결할 수 있지만 그러면 본문이 길어진다.

### 앞으로의 선택지 (이번에 하지 않는다)

- L4 를 기본 접힘으로 두고 "더 정확히 알기" 를 누르면 펼치기
- 첫 화면의 미설명 낱말에 tooltip 으로 한 줄 정의 띄우기
- 용어 페이지 안에 `먼저 볼 개념` 을 한 줄 요약과 함께 인라인으로 보이기

셋 다 View 변경이므로 별도 판단이 필요하다.

---

## J. AI vs Human

표본 36개에서 **자동 신호가 7건을 걸었고, 사람이 21건의 문제를 찾았다.**
겹친 것은 6건 — 자동 신호는 문제의 **29%** 만 잡았고 오탐 1건(`login`)이 있었다.

```
AI_CAN_VALIDATE       기계가 판정해도 되는 것
  · 문장 길이 · 괄호 밀도 · 약어 밀도 · 추상명사 연속
  · 첫 화면에 선수 관계 없이 등장하는 다른 용어 (87/519)
  · 한 줄 설명과 쉽게 설명하면의 영문 밀도 역전 (333/519)
  · 문체 혼용 (340/519)
  → 전부 형태로 셀 수 있고 사람이 다시 볼 필요가 적다

AI_CAN_FLAG           후보만 고르고 판단은 사람이
  · "정의가 미설명 낱말에 기댄다" — 어느 낱말이 정의의 뼈대인지는 읽어야 안다
  · "한 문장에 새 개념 넷" — 무엇이 '새' 인지는 독자에 달렸다
  · "예시가 이 term 의 것인가" — 옆 term 의 예제인지는 의미 판단이다
  · "비유가 설명 대상보다 어렵다" — 난이도 비교는 기계가 못 한다
  → 표본에서 이 넷이 사람만 찾은 15건의 대부분이다

HUMAN_VALIDATION_NEEDED   학습자만 답할 수 있는 것
  · 읽고 나서 자기 말로 설명할 수 있는가          ← 가장 중요하다
  · 비유가 실제로 도움이 되었는가, 헷갈리게 했는가
  · 정보가 모자란가 이미 너무 많은가
  · 어느 문장에서 읽기를 멈췄는가
  · 이 설명이 미션을 진행하는 데 실제로 쓸모가 있었는가
  → AI 는 이 다섯 개 중 어느 것도 대신 답할 수 없다
```

**가장 중요한 발견**: 난이도·tier·선수 깊이 어느 것도 Comprehension 을 예측하지
못했다(D절). 기계가 가진 메타데이터로는 "이 문서가 이해되는가" 를 고를 수 없다.

---

## K. Learner Test Set

Pilot 10개 중 **8개**를 실제 사람에게 읽힐 세트로 뽑았다. 분야와 난이도를 섞었다.

| # | term | 도메인 | 난이도 | 왜 이것인가 |
| --- | --- | --- | --- | --- |
| 1 | `mysql` | Data/DB | 쉬움 | 첫 문장 역전만 있는 순수 사례 |
| 2 | `variable` | Programming | 쉬움 | 쉬운 개념인데 정의가 막힌 사례 |
| 3 | `commit` | SWE/Git | 중간 | 미션에서 매번 쓰는 개념 |
| 4 | `o-constant-time` | Algorithms | 중간 | 비유가 장벽이 된 사례 |
| 5 | `temperature` | AI | 중간 | 비유는 좋은데 착지가 없는 사례 |
| 6 | `process` | OS/System | 어려움 | 핵심 대비가 묻힌 사례 |
| 7 | `json-web-token` | Security | 어려움 | 첫 화면 인지 부하 최대 |
| 8 | `tcp` | Network | 어려움 | 용어 목록형 설명의 대표 |

### 물어볼 것

```
[읽기 전]  이 낱말을 들어 본 적 있습니까? 들어 봤다면 무엇이라고 생각하십니까?

[읽는 중]  읽다가 멈춘 자리가 있으면 그 문장을 짚어 주세요.
           (화면을 덮지 않고 그대로 두고 표시하게 한다)

[읽은 직후 — 화면을 덮고]
  1. 이 용어를 자기 말로 한두 문장으로 설명해 보세요.     ← 가장 중요하다
  2. 이게 왜 필요한지 말해 보세요.
  3. 이해되지 않은 낱말이나 문장이 있었습니까?
  4. 예시가 이해에 도움이 되었습니까, 아니면 더 헷갈렸습니까?
  5. 더 알고 싶습니까, 아니면 정보가 이미 너무 많았습니까?
```

**1번이 핵심이다.** "이해되셨나요?" 는 묻지 않는다 — 거의 모두가 그렇다고 답한다.
설명을 다시 보여 주지 않고 자기 말로 말하게 하는 것이 유일하게 믿을 수 있는 확인이다.

### 방법

- 한 사람당 **4개**를 읽힌다(8개는 두 사람 몫). 피로가 답을 흐린다
- 각 사람에게 쉬움 1 · 중간 1~2 · 어려움 1~2 를 섞어 준다
- **CURRENT 와 PROPOSED 를 같은 사람에게 둘 다 보이지 않는다.** 두 번째는 첫 번째
  때문에 이해된다. 사람을 나누거나 term 을 나눈다
- 진행자는 읽는 동안 설명하지 않는다. 막히는 자리가 자료다
- 답을 점수로 바꾸지 않는다. **1번 답을 그대로 받아 적는다**

---

## L. Verdict

**LEARNER_READABILITY_MODEL_READY**

| 조건 | 결과 |
| --- | --- |
| target learner 정의 | ✅ [09 학습자 콘텐츠 기준](../../docs/knowledge-encyclopedia/09-learner-content-guidelines.md) §1 |
| representative sample 검토 완료 | ✅ 36개 · 9도메인 · 3난이도 |
| readability / comprehension 분리 | ✅ 판정을 따로 냈고 서로 어긋나는 사례 7건을 찾았다 |
| 주요 문제 pattern 확인 | ✅ Readability 4개 · Comprehension 5개 |
| explanation level proposal 완료 | ✅ L1~L4, 단계는 고정 형식은 자유 |
| pilot before/after 준비 | ✅ 10개 (`content/terms` 변경 0) |
| actual learner test set 준비 | ✅ 8개 + 질문 5개 + 진행 방법 |

전체 518개 rewrite 를 하지 않았다. `content/terms` **변경 0**.

---

## M. Next

Owner 가 Pilot 10개를 읽고 **설명 기준점**을 정한다.

```
너무 쉬운가 / 너무 교과서적인가
어디서 읽기가 끊기는가
비유가 도움이 되는가
상세 수준이 적절한가
```

그 판단이 나온 뒤에야 전체 적용 여부와 방법을 정한다.

**자동으로 시작하지 않는 것**: 518개 rewrite · 새 template 일괄 적용 · UI 계층화 구현 ·
문체 통일(340건) · 첫 문장 일괄 교체(333건).

마지막 두 개는 범위가 분명하고 기계로 후보를 고를 수 있지만, **Pilot 검토 전에는
손대지 않는다.** 기준이 틀렸다면 333개를 잘못된 방향으로 바꾸는 일이 된다.
