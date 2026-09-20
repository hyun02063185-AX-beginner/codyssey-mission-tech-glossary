# Coverage Completion Final — 실행 기록

> 이력 문서다. 이후 상태 변화에 맞춰 소급 수정하지 않는다.
> 시작 기준: HEAD `08f7f88` · canonical 519 · Priority Review Coverage 269/300 (89.7%) · DEFERRED 3 · 미검토 31
> 판정: **`ENCYCLOPEDIA_LEARNING_COVERAGE_BASELINE_READY`**

---

## 1. 이번 Cycle이 끝낸 것

Priority Learning Term **300개 전체의 학습 구조 판정**을 마쳤다. 새 enrichment가 목적이 아니었다.

| 지표 | before | after |
| --- | --- | --- |
| **Priority Review Coverage** | 269 / 300 (89.7%) | **300 / 300 = 100%** |
| **Pre-Authoring Path Coverage** | (구분 안 됨) | **204 / 260 = 78.5%** |
| **Final Path Coverage** | 245 / 245 (100%) | **260 / 260 = 100%** |
| **Unresolved Rate** | 3 / 300 (1.0%) | **0 / 300 = 0%** |
| 미검토 | 31 | **0** |
| legacy Learning Coverage | 81.7% | **86.7%** |
| authored edge (cluster 작성분) | 531 (291) | **546 (306)** |
| 학습 경로 | 154 | **166** |
| node type / relation type / foundation | 5 / 12 / 17(3) | **변화 없음** |

**legacy 86.7%가 100%가 아닌 이유**가 이제 설명된다. 나머지 40개는 경로가 빠진 것이
아니라 **VALID_ROOT 34 + NO_PREREQUISITE_NEEDED 6**이다. 앞에 둘 것이 없는 것이
정상인 개념들이다.

---

## 2. §8·§9 — 판정과 작성을 분리해 본 결과

Cycle 04 보고서에서 "Final Path Coverage 100%를 성과로 읽지 말라"고 적었다.
이번에는 그것을 **측정으로** 분리했다. 판정마다 세 가지를 저장한다.

```
judgedIn         판정한 Cycle
pathAtJudgment   판정 당시 이미 유효한 경로가 있었는가
pathAuthoredIn   경로를 작성한 Cycle
```

| | 수 | 비율 |
| --- | --- | --- |
| PATH_NEEDED 전체 | 260 | |
| 판정 당시 이미 경로 보유 | **204** | **78.5%** ← Pre-Authoring |
| 이번 판정 모델 도입 후 새로 이은 것 | **56** | (Cycle 04 41 + Final 15) |
| 최종 경로 보유 | 260 | **100%** ← Final |

**100%는 측정 결과가 아니라 78.5% + 56건의 작업이다.** 이 둘을 나란히 두지 않으면
같은 숫자가 성과로 읽힌다. baseline artifact에 두 값을 함께 고정해 두었다.

---

## 3. U18 — Atlas 분야와 학문을 가르는 결정

Owner 결정을 그대로 적용했다. **Atlas 분야 소속은 학문 배정의 후보 근거이지 결론이
아니다.** `ADR FD-12`로 기록했다.

| term | 결정 | 판정 |
| --- | --- | --- |
| `schema` | **ACADEMIC_MAPPING_CONFIRMED** (database-systems 유지) | VALID_ROOT |
| `filter` | **ACADEMIC_MAPPING_CONFIRMED** (database-systems 유지) | NO_PREREQUISITE_NEEDED |
| `label-normalization` | **ACADEMIC_OVERRIDE** → programming-fundamentals | NO_PREREQUISITE_NEEDED |

**STILL_DEFERRED 0.**

`schema`는 상세 콘텐츠가 직접 답을 갖고 있었다 — "데이터베이스 schema는 테이블·컬럼·
제약을, JSON schema나 API schema는 메시지 구조를 정의한다". 두 개의 개념이 아니라
**"데이터가 가져야 할 구조를 미리 정해 둔 약속"이라는 하나의 개념**이고, M03의 CSV
필드 구조와 M11의 테이블 구조는 그 적용 사례다. 그 일반적인 뜻에서는 앞에 둘 것이
없으므로 뿌리다. 테이블을 선수로 붙이면 데이터베이스 전용 뜻으로 좁혀져 파일만 다루는
M03에 테이블이 올라간다(Cycle 03에서 실제로 관측한 일).

`label-normalization`은 데이터베이스에 두면 **이름이 비슷한 정규화(normalization)와
나란히 놓여** 서로 다른 개념이 같은 것처럼 읽힌다. 문자열을 규칙대로 바꾸는 일이므로
프로그래밍 기초로 옮겼다.

### 3.1 판정 중 발견한 RC1 콘텐츠 결함 (R12)

`filter`와 `label-normalization`의 상세 콘텐츠가 **실제 등장 미션과 다른 미션을
설명한다.** mission-term-map은 둘 다 예비 M03(Mini NPU 시뮬레이터)에만 연결하는데,
콘텐츠는 "M11과 M12에서 model, SQL, persistence 코드를 구현할 때"라고 적고 코드 예로
`SELECT` 문을 보여 준다. 두 파일이 같은 데이터 계열 템플릿으로 생성된 것으로 보인다.

이 불일치가 학문 배정 판단의 근거를 흐렸다. **한 줄 정의와 mission-term-map을 근거로
판정하고**, 콘텐츠 쪽은 동결 영역이라 고치지 않고 `upstream-registry.json`에 **R12**로
등록했다. 이 판단 규칙 자체를 FD-12에 적어 두었다.

---

## 4. 잔여 31건 판정

| 학문 | 수 | VALID_ROOT | NO_PRE | PATH_NEEDED |
| --- | --- | --- | --- | --- |
| software-engineering | 7 | 3 (git · troubleshooting · commit-node) | 1 (benchmark) | 3 |
| web-programming | 6 | 2 (html · javascript) | 1 (crud) | 3 |
| data-structures | 5 | 2 (doubly-linked-list · matrix-2d-array) | 0 | 3 |
| artificial-intelligence | 4 | 1 (ai-model) | 0 | 3 |
| algorithms | 4 | 2 (time-complexity · lexicographical-order) | 0 | 2 |
| computer-networks | 2 | 2 (tcp · subnet) | 0 | 0 |
| cloud-computing | 2 | 1 (amazon-web-services) | 0 | 1 |
| computer-architecture | 1 | 1 (floating-point) | 0 | 0 |
| **합계** | **31** | **14** | **2** | **15** |

작성한 것: cluster 4개 신규 + 기존 cluster에 1건. edge 15, path 12.

- `commit-history-as-a-graph-m10` — M10이 필요로 하는 Git 객체 순서와 그래프 어휘
- `hashmap-internals-m09` — 버킷·적재율·체이닝이 "평균 O(1)이 조건부"라는 한 사실에서 갈라진다
- `ai-calling-a-model-m06` — 모델을 부르는 창구, 무작위성 조절, 형식 보정
- `web-remaining-m01-m02` — 이벤트, 빌려 쓰는 뒷단, 그냥 올리기
- `python-language-m03`에 `cli → console` 1건 추가

### 브리프가 경고한 것들 — 지킨 결과

| 조항 | 지킨 방식 |
| --- | --- |
| §12 Git workflow를 SE 전체로 과대해석 금지 | git·troubleshooting을 뿌리로 두고, 설계 어휘 쪽은 이미 Cycle 03에서 분리해 둔 상태를 유지 |
| §13 generic related로 path 만들지 않기 | `related`는 learn-first 집합에 없다. html·javascript는 뿌리로 두고 억지 연결 없음 |
| §14 Hash Table과 hash 연산 분류를 동일시하지 않기 | 버킷·적재율·체이닝은 자료구조에, 정렬·탐색·위상 순서는 알고리즘에 남겼다 |
| §15 AI 발전사를 prerequisite로 바꾸지 않기 | `ai-model`을 VALID_ROOT로 두었다. 신경망을 앞에 붙이면 AI→ML→DL→LLM 계보를 학습 순서로 바꾸는 일이 되고 중간 canonical도 없다 |
| §16 학문 override가 많은 것을 정상으로 인정 | override 49건을 Atlas 오류가 아니라 두 축이 다르다는 증거로 FD-12에 명시 |
| §17 프로토콜 stack ≠ 선수관계 | tcp·subnet 둘 다 VALID_ROOT. Cycle 03의 판단을 정식 판정으로 확정 |
| §18 Docker/container를 Cloud prerequisite로 넣지 않기 | github-pages는 `github`에만 이었다. AWS는 뿌리 |
| §19 컴퓨터구조에 과도한 path 금지 | floating-point 하나를 VALID_ROOT로 두고 끝. 성장 후보 5건 canonical 추가 0 |

---

## 5. 판정이 뒤집힌 사례 — commit-node

이번 Cycle에서 가장 중요한 한 건이다.

1. **판정**: PATH_NEEDED. 커밋 노드는 방향 비순환 그래프의 점 하나다 — 맞는 말이다.
2. **작성**: `commit-node based_on directed-acyclic-graph`.
3. **Impact Gate**: unexpected **8건**. M02·M04·M06·예비 M02에 "방향 비순환 그래프"와
   "Directed Graph"가 선수 학습으로 올라왔다. `commit is_a commit-node`이므로
   **Git을 쓰는 모든 미션이 그 경로를 탄다.**
4. **판단**: 관계는 맞지만, 파이썬 퀴즈 게임을 만드는 학습자에게 그래프 이론을 먼저
   보라고 말하게 된다. §20이 말하는 "advanced concept가 beginner path 앞에 등장"이다.
5. **결정**: edge를 되돌리고 **VALID_ROOT**로 재판정했다. 커밋·부모·브랜치 포인터가
   모두 그 위에 서므로 이 무리의 출발점이 맞다. 둘 사이의 연관은 기존 map의 대칭
   관계로 이미 표시돼 있고, M10이 필요로 하는 그래프 관점은 탐색·위상 순서 경로가
   담당한다.

이 경위를 판정 기록에 **그대로 남겼다**. "맞는 관계"와 "학습 순서로 둘 만한 관계"가
다르다는 것을 보여 주는 사례이고, 결과만 적으면 다음 사람이 같은 edge를 다시 만든다.

---

## 6. Impact / Contract

| 항목 | 결과 |
| --- | --- |
| affected missions | 4 (M01 · M02 · M03 · 예비 M01) |
| unexpected 발생 | **8** (전부 commit-node → DAG) |
| resolved | **8** (edge 되돌림) |
| remaining | **0** |
| Global Contract 위반 | **0** |

미션 학문 범위 계약(= Mission Academic + Curriculum Baseline)을 전수 실행했다. 위반 0.
이번 Cycle에서 미션 학문 선언을 하나도 넓히지 않았다 — 처음 있는 일이다.

---

## 7. Display Boundary

`src/learnerView.ts` projection 유지. Display Contract 6개 통과.
대표 화면 재확인(선수학습 · 미션 · 학문 · 직무): **누수 0**.

internal review note · source · file name/path · registry name · raw status ·
maintenance reason 전부 화면에 없음.

한 가지는 그대로 보인다 — map 출처 경로 설명의 개발자용 영어 문장("hash function,
bucket, collision strategy와 load factor가 hash map lookup 구조를 만든다"). 동결
영역이라 고치지 않으며 **EX03**으로 이미 등록돼 있다.

---

## 8. Academic / Role / Timeline

| 항목 | 결과 |
| --- | --- |
| 학문 노출 | active 13 / declared 1(sre) — **변화 없음** |
| 학문 termCount | database-systems 66→65, programming-fundamentals 65→66 (label-normalization 이동 1건) |
| 직무 | active 8 / limited 2 — **10개 전부 변화 없음** |
| Timeline | `evolved_from` 3, 사슬 0 — `DEFERRED_FOR_DATA_READINESS` 유지 |
| foundation node | 17 (Encyclopedia 신설 3) — 변화 없음 |
| node type / relation type | 5 / 12 — 변화 없음 |

---

## 9. 종료 기준 (§10 · §11)

사전에 숫자를 정하지 않고, 실제 분포를 보고 아래를 제안한다.

### 제안하는 Coverage Completion 종료 기준

| 기준 | 임계값 | 실제 | 판정 |
| --- | --- | --- | --- |
| Priority Review Coverage | **100%** | 100% (300/300) | ✅ |
| PATH_NEEDED 중 경로 미보유 | **0** | 0 | ✅ |
| DEFERRED | **0, 또는 남으면 각각 선행 질문이 명시된 5건 이하** | 0 | ✅ |
| semantic leak | **0** | 0 (발생 8 → 해소 8) | ✅ |
| Global Contract 위반 | **0** | 0 | ✅ |
| Data Model 변경 | **0** | node/relation type·taxonomy·foundation 전부 0 | ✅ |
| RC1 regression | **0** | 519/519/0 error/0 warning, diff 0 | ✅ |

**임계값을 이렇게 잡은 이유**

- Review Coverage는 **100%여야 한다.** 이 지표는 품질이 아니라 "왜 경로가 없는지 모르는
  상태가 남아 있는가"를 센다. 모르는 것이 하나라도 남으면 baseline이라고 부를 수 없다.
- Path Coverage에는 임계값을 두지 않는다. 대신 **PATH_NEEDED 중 미보유 0**을 본다.
  전체 비율은 VALID_ROOT가 몇 개냐에 따라 달라지는 숫자라 목표가 되면 안 된다.
- DEFERRED는 0을 요구하지 않는다. **선행 질문이 명시된 DEFERRED는 정직한 상태**다.
  다만 그 질문이 Owner Gate로 올라가 있어야 한다.

### Pre-Authoring Path Coverage는 종료 기준이 아니다

78.5%는 "이전 Cycle들이 해 둔 양"을 보여 주는 관측치이지 달성 목표가 아니다.
다음 Cycle에서 판정과 작성을 분리하면 이 값이 의미를 갖는다.

---

## 10. 전체 QA

| 항목 | 결과 |
| --- | --- |
| glossary validator | 519 · 46 mission-local · **0 error / 0 warning** · 780 info |
| knowledge-map / atlas / content-tier validator | PASS / PASS / PASS |
| encyclopedia validator | 519 · 36 cluster · 546 edge · **0 error / 0 warning** |
| coverage review | PASS (판정↔그래프 충돌 0) |
| 결정론적 출력 | 2회 재빌드 후 byte 동일 |
| unit test | **60 passed** (encyclopedia views 29) |
| Playwright | **16 passed** (앱 확인: term 519 · edge 546 · path 166) |
| production build / extension build | PASS / PASS |
| RC1 diff | `data/curated` · `content` · `data/knowledge-maps` · `extension` **변경 0** |

---

## 11. Baseline Artifact (§24)

`data/reviews/encyclopedia-learning-coverage-baseline.json` — **생성물이다.**

```
npm run encyclopedia:coverage:freeze
```

`artifactType: generated-learning-coverage-baseline`, `generatedFrom`,
`doNotEditByHand`를 함께 적어 성격을 명시했다. 판정을 바꾸려면 원본
`encyclopedia-learning-coverage.json`을 고치고 다시 생성한다. 충돌이 있으면 생성을
거부한다.

---

## 12. 다음 단계 (§O)

Coverage baseline이 READY이므로 **추가 prerequisite enrichment를 기본 작업에서
종료한다.** Ontology/View 재설계는 시작하지 않는다.

현재 제품 상태에서 다음으로 값이 큰 것은 **탐색 경험**이라고 본다. 근거는 이렇다.

1. **만들어 둔 것을 찾을 길이 없다.** 학습 경로 166개, 선수 관계를 가진 용어 312개를
   쌓았는데 진입점은 네 개의 목록 화면뿐이다. 경로는 용어를 먼저 고른 뒤에야 보인다.
2. **네 View가 서로 이어져 있지 않다.** 학문 → 미션 → 선수학습 → 직무를 오갈 수는
   있지만, "지금 내가 어디쯤 있는가"를 보여 주는 자리가 없다.
3. **기존 Knowledge Map/Atlas와 Encyclopedia가 별도 세계다.** 같은 용어를 두 축에서
   보는 것이 이 프로젝트의 핵심 주장인데, 화면에서는 그 왕래가 약하다.

제안 순서:

1. **Encyclopedia 홈/진입 경험** — 166개 경로를 학습자가 만날 수 있게 하는 것. 데이터
   추가 없이 배치만으로 가능하다
2. **실제 학습 사용성 검증** — 미션 하나를 골라 학습자 시나리오로 화면을 따라가 보는
   일. 지금까지의 QA는 계약 검사였지 사용 검증이 아니었다
3. **Knowledge Map ↔ Encyclopedia 왕래** — 두 축을 오가는 연결
4. 그 뒤에 남은 것: U14(SRE 후보 5건) · U15(컴퓨터구조 후보 5건) · U18 후속(R12 콘텐츠
   수정) · EX03(map reason 문장 다듬기) — 전부 Owner Gate 사안이다

---

## 13. 커밋

| commit | 내용 |
| --- | --- |
| `e08f72b` | 잔여 31건 전수 판정 · U18 3건 해결 · R12 등록 · cluster 4개 · 판정/작성 시점 분리 · baseline freeze |
