# Coverage Completion Cycle 04 — 실행 기록

> 이력 문서다. 이후 상태 변화에 맞춰 소급 수정하지 않는다.
> 시작 기준: HEAD `6c20e6e` · canonical 519 · Learning Coverage 204/300 (68.0%)
> 판정: **`ENCYCLOPEDIA_COVERAGE_COMPLETION_04_READY`**

---

## 1. 이번 Cycle의 전환

목표가 바뀌었다. edge 를 늘리는 것이 아니라 **Priority Learning Term 의 학습 관계
판정을 끝내는 것**이다. 그래서 각 Phase 에서 관계를 찾기 전에 먼저 판정했다.

| 항목 | before | after |
| --- | --- | --- |
| **Priority Review Coverage** | (없음) | **269 / 300 = 89.7%** |
| **Learning Path Coverage** | (없음) | **245 / 245 = 100%** |
| legacy Learning Coverage | 204 / 300 (68.0%) | 245 / 300 (**81.7%**) |
| 선수 관계 보유 term | 255 / 519 | **297 / 519** |
| authored edge (cluster 작성분) | 484 (244) | **531 (291)** |
| 학습 경로 | 136 | **154** |
| cluster | 28 | **32** |
| node type / relation type / foundation | 5 / 12 / 17(3) | **변화 없음** |
| academic override | 48 | **48 — 변화 없음** |

---

## 2. U17 — Curriculum Baseline

### 2.1 무엇이 문제였나

Cycle 03 에서 같은 일이 다섯 미션에 한꺼번에 일어났다. M06·M09·M10·M12·M13 이
파이썬이나 자바스크립트로 코드를 쓴다는 이유만으로 `programming-fundamentals` 를
각자 `supporting` 에 적어야 했다. 관계는 전부 맞았지만 **적어 넣은 자리가 틀렸다**.
이 미션들은 프로그래밍 기초를 '다루는' 것이 아니라 '딛고' 있다.

### 2.2 해결

`data/encyclopedia/curriculum-policy.json` 한 장. 과정 전체가 전제하는 학문을
한 번만 적는다.

계약을 정교화했다.

```
before : 미션 선수 학습은 선언한 학문 안에 있어야 한다
after  : 선언한 학문 + Curriculum Baseline 안에 있어야 한다
```

좁은 계약은 '관계가 틀렸다'와 '배정이 좁다'를 구분하지 못했다. 세 Cycle 내내 모든
위반이 후자였고 해결은 늘 supporting 에 같은 값을 더 적는 것이었다.

**baseline 은 선수 학습을 만들어 내지 않는다.** 계산된 선수 학습이 그 학문에 닿는
것을 허용하는 범위일 뿐이다. PF 의 모든 term 이 모든 미션의 선수가 되지 않는다.
그 증거로 U17 적용 후 **그래프 변화가 0** 이었다.

### 2.3 미션 분류

기준: 그 학문의 term 을 **직접 가르치는가**(direct + 핵심 개념), 그리고 Cycle 03 에서
Gate 때문에 추가됐는가.

| 분류 | 미션 | 처리 |
| --- | --- | --- |
| MISSION_SPECIFIC / BOTH | 예비 M02 · 예비 M03 · M03 (primary) | 유지 |
| MISSION_SPECIFIC / BOTH | M01 (var·let·const·스코프·콜백·Promise 직접) · M08 (로그·워치독·검증 직접) | supporting 유지 |
| **CURRICULUM_BASELINE_ONLY** | **M06 · M09 · M10 · M12 · M13** | **supporting 에서 제거** |
| observed | M07 — PF term 5개를 직접 가르치는데 선언한 적이 없다 | 선언 추가하지 않음 |

M07 은 delta 기반 Impact Gate 가 변화가 없어 보지 못한 **기존 공백**이었다. baseline
으로 범위 계약은 충족되므로 선언을 새로 추가하지 않았다 — U17 의 목적이 반복
authoring 을 줄이는 것이기 때문이다.

baseline 후보에서 **기각한 것**도 적어 두었다. `software-engineering` 은 Cycle 03 에서
세 곳에 추가됐지만 셋 다 그 미션이 실제로 다루는 내용이었고, `computer-networks` 는
웹 미션에서는 주제이고 예비 M02 에서는 등장하지 않아 보편이 아니다.

### 2.4 계약 전수 실행

미션 학문 범위 계약을 delta 가 아닌 **전수 검사**로 global contract 에 옮겼다.
기존 inline 검사는 M03 공격 역전파 회귀만 남겼다(중복 검사 금지). 결과 **위반 0**.

---

## 3. Coverage 판정 모델

### 3.1 왜 나눴나

`204/300 = 68.0%` 은 한 가지를 말하지 못한다. **분모 300 전체가 반드시 선수 관계를
가져야 하는 것은 아니다.** SQL·테이블·프로세스처럼 그 영역의 출발점인 개념은 앞에
둘 것이 없는 것이 정상이고, 숫자를 올리려고 억지로 선행을 붙이면 데이터가 나빠진다.

### 3.2 판정과 저장

`data/reviews/encyclopedia-learning-coverage.json` — 판정 65건.
canonical source 에는 아무 flag 도 추가하지 않았다. 기존 `data/reviews` 규약
(`version`·`date`·`basis_commit`·`scope`·`method`)을 따랐다.

이미 경로를 가진 term 은 그 관계를 작성할 때 cluster review 를 거쳤으므로
자동으로 PATH_NEEDED + 경로 보유로 집계한다. 각 edge 가 `reason`·`confidence`·
`evidenceType` 과 review profile 을 갖고 있다는 것이 근거다.

`scripts/report_coverage_review.py` (`npm run encyclopedia:coverage`) 가 계산하고,
**판정과 그래프가 어긋나면 실패한다.** PATH_NEEDED 가 아닌데 선수 경로가 생겼다면
둘 중 하나가 낡은 것이므로 조용히 넘기지 않는다.

### 3.3 §22 준수

`현재 prerequisite 가 없음` 과 `VALID_ROOT` 를 자동으로 같게 처리하지 않았다.
root 19건은 전부 "이 사전 안에서 무엇이 그 위에 서 있는가"를 확인하고 적었다.
예를 들어 `terminal` 은 기존 cluster 가 이미 'shell 보다 먼저'라고 선언해 두었고,
`linux-user` 는 `file-permission` 이 그 위에 서 있으며, `logging` 은 `log rotation` 이
그 위에 있다.

---

## 4. Phase별 기록

### Phase A — Operating Systems (18 검토)

| 판정 | 수 | 내용 |
| --- | --- | --- |
| VALID_ROOT | 5 | process · terminal · linux · cron · linux-user |
| PATH_NEEDED | 13 | 전부 관계를 찾거나 새로 적음 |
| NO_PREREQUISITE_NEEDED / DEFERRED | 0 / 0 | |

cluster `os-process-tools-m07-m08` — edge 15, path 4.
명령을 명령끼리 잇지 않고 전부 그것이 들여다보는 대상에 붙였다.
프로세스 → ps/top → ps -L/top -H 로 내려가는 두 갈래가 M08 의 '범인이 프로세스가
아니라 그 안의 스레드'인 상황을 설명한다.

**41.9% → 83.9%**

### Phase B — Information Security (15 검토)

| 판정 | 수 | 내용 |
| --- | --- | --- |
| VALID_ROOT | 1 | authentication |
| NO_PREREQUISITE_NEEDED | 1 | public-route — 아무 조건도 걸지 않은 기본 상태 |
| PATH_NEEDED | 13 | |
| DEFERRED | 0 | |

cluster `security-credentials-m02-m13` — edge 16, path 6. 네 갈래:
인증에서 갈라지는 토큰·API 키·로그인·세션·로그아웃 / 접근 제어에서 갈라지는
ACL·최소권한·root 원격 로그인 차단 / 하드코딩하면 안 된다는 판단에서 갈라지는
비밀 관리와 .env / 무엇이 민감한지에서 갈라지는 마스킹과 safe-mode.

**§17 준수 — 전 16개 미션 closure 전수 확인**

- 공격 개념을 선수 관계의 출발점으로 **새로 쓰지 않았다**
- 공격 개념이 선수 학습으로 올라간 미션 **0 / 16**
- 기존 3건(`sql-injection → sql`, `sql-injection`/`xss → input-validation`)은
  '무엇을 먼저 배우면 공격을 이해하는가' 방향이라 §17 이 허용하는 쪽이다

**44.4% → 92.6%**

### Phase C — Programming Fundamentals 잔여 (13 검토)

| 판정 | 수 | 내용 |
| --- | --- | --- |
| VALID_ROOT | 4 | python · console · if-elif-else · logging |
| NO_PREREQUISITE_NEEDED | 1 | tie-handling |
| PATH_NEEDED | 8 | |

cluster `ops-diagnostics-m07-m08` — edge 9, path 5.
재는 일 → 기준선 → 자동 조치, 그리고 증거 → 원인 → 임시 조치 → 검증.
curated 가 "mutex 는 lock 의 대표 구현"이라고 적어 둔 것을 그대로 썼다.

**U17 이 막혀 있던 관계를 풀었다.** Cycle 03 에서 미뤄 두었던
`input-validation → 조건문`을 이번에 이었다. Curriculum Baseline 이 생겨 조건문이
M13 쪽으로 닿아도 범위 문제가 아니게 됐기 때문이다. 정책 한 장이 데이터를 움직인
사례다.

**68.3% → 87.8%**

### Phase D — Database Systems 잔여 (11 검토, 신규 edge 0)

예상대로 판정이 전부였다.

| 판정 | 수 | 내용 |
| --- | --- | --- |
| VALID_ROOT | 8 | sql · table · relational-database · data-integrity · json · csv · encoding · transaction-data |
| DEFERRED | 3 | schema · filter · label-normalization |

Cycle 03 에서 "뿌리라 두었다"고만 적었던 것들에 **정식 판정 상태**를 부여했다.

**DEFERRED 3건의 이유를 함께 적었다.**
`schema` 는 이 사전에서 두 뜻을 겸한다 — M03 의 CSV 필드 구조와 M11 의 테이블 구조.
Cycle 03 에서 테이블을 선수로 붙였다가 파일만 다루는 M03 에 '테이블'이 올라가
되돌렸다. `filter` 와 `label-normalization` 은 예비 M03 의 NPU 개념인데 학문이
database-systems 로 잡혀 있다. Atlas 의 `data-database` 분야가 '데이터베이스'와
'데이터 다루기'를 한 묶음으로 담기 때문이다. **셋 다 판정 전에 정해야 할 것이
따로 있다.**

**77.1% 유지** (edge 를 추가하지 않았으므로 legacy 수치는 그대로)

### Phase E — DevOps 잔여 (8 검토)

| 판정 | 수 | 내용 |
| --- | --- | --- |
| VALID_ROOT | 1 | docker |
| PATH_NEEDED | 7 | |

cluster `devops-container-tools-pm01` — edge 7, path 3.
명령을 전부 그것이 다루는 대상에 붙였다. exec 와 attach 만 서로 이었는데,
둘의 차이(새 프로세스를 띄우느냐, 원래 프로세스에 붙느냐)가 이 두 명령의 학습 내용
전부이기 때문이다. Cloud 와 DevOps 는 계속 별도 학문으로 유지했다.

**27.3% → 90.9%**

---

## 5. Impact / Contract

전 Phase 누적 unexpected **4건 발생 → 최종 0**. 전부 (b) 배정이 좁은 경우였다.

| 미션 | 넓힌 학문 | 근거 |
| --- | --- | --- |
| M02 · M06 | `operating-systems` | 둘 다 **환경 변수를 핵심 개념으로 등록**해 두었다. 브리프 §3 의 '의미 있게 사용하는 Academic Field' 정의에 해당한다. M06 은 subprocess 도 핵심 개념이다 |
| 예비 M01 | `information-security` | 인증 토큰과 데이터 마스킹을 직접 다룬다. SSH 키와 PAT 를 설정하고 증거 캡처에서 비밀정보를 가리는 미션이다 |

**baseline 으로 넘기지 않은 이유**: `operating-systems` 는 보편 기반이 아니다.
M01·M04·M10·M11·M12·M13 은 이 학문에 닿지 않는다. 미션이 의미 있게 사용하는
학문이면 그 미션에 적는 것이 맞다. baseline 을 편의로 넓히지 않았다.

Global Contract 위반 **0**. 계약 3개 유지 + 미션 학문 범위 계약을 전수 검사로 승격.

---

## 6. Display Boundary

Cycle 03 의 projection 계층을 그대로 유지했다. 이번 Cycle 에 추가된 판정 기록
(`data/reviews/`)은 어떤 View 도 읽지 않는다.

확인 항목 전부 **0건**: review.note · source · internal reason · file path ·
override justification · registry 이름 · internal status.

Display Contract 6개 통과. 대표 화면 4개 재확인(선수학습 / 미션 / 학문 / 직무).

---

## 7. Academic / Role / Timeline 회귀

**학문 변화 0** — active 13 / declared 1(sre). termCount·missionCount 전부 동일.
이번 Cycle 에 academic override 를 하나도 만들지 않았기 때문이다(48 유지).

**직무 변화 0** — active 8 / limited 2. 10개 직무의 coverageState·coreFieldTermCount·
termCount 전부 동일. SRE 는 성장 정책 조건이 바뀌지 않아 재검토하지 않았다(§24).

**Timeline** — `evolved_from` 3, 사슬 0. `DEFERRED_FOR_DATA_READINESS` 유지.

---

## 8. Data Model Freeze (§28)

| 항목 | 결과 |
| --- | --- |
| 새 Node Type | **0** |
| 새 Relation Type | **0** (12종 그대로) |
| Academic taxonomy 변경 | **0** (14개 그대로) |
| Mission schema 의미 변경 | **0** — `academic.supporting` 의 의미는 그대로이고, 반복 authoring 만 줄였다 |
| foundation node | 17 (Encyclopedia 신설 3) — 변화 없음 |

`ARCHITECTURE_REVIEW_REQUIRED` 로 올릴 사유는 발생하지 않았다.

---

## 9. 전체 QA

| 항목 | 결과 |
| --- | --- |
| glossary validator | 519 · 46 mission-local · **0 error / 0 warning** · 780 info |
| knowledge-map validator | PASS |
| atlas validator | PASS |
| encyclopedia validator | 519 · 32 cluster · 531 edge · **0 error / 0 warning** |
| content-tier validator | PASS |
| coverage review | PASS (판정↔그래프 충돌 0) |
| 결정론적 출력 | 2회 재빌드 후 byte 동일 |
| unit test | **60 passed** (encyclopedia views 29) |
| Playwright | **16 passed** (포트 8123, 앱 확인: term 519 · edge 531 · path 154) |
| production build / extension build | PASS / PASS |
| RC1 diff | `data/curated` · `content` · `data/knowledge-maps` · `extension` **변경 0** |

---

## 10. 다음 Cycle 권고 (§26)

**임의 threshold 를 먼저 정하지 않았다.** 실제 분포는 이렇다.

| 학문 | total | 미검토 | root | defer |
| --- | --- | --- | --- | --- |
| software-engineering | 39 | **7** | 0 | 0 |
| web-programming | 54 | **6** | 0 | 0 |
| data-structures | 10 | **5** | 0 | 0 |
| artificial-intelligence | 12 | **4** | 0 | 0 |
| algorithms | 7 | **4** | 0 | 0 |
| computer-networks · cloud-computing | 14 · 4 | 2 · 2 | 0 | 0 |
| computer-architecture | 2 | 1 | 0 | 0 |
| database-systems | 48 | 0 | 8 | **3** |

남은 미검토는 **31건, 7개 학문**이다. 절대 수가 작고 한 Cycle 안에 끝낼 수 있다.

**권고**

1. **미검토 31건을 마저 판정한다.** 그러면 Priority Review Coverage 가 100% 가 되고,
   "왜 경로가 없는지 모르는 상태"가 사라진다. 이것이 coverage completion 단계의
   자연스러운 종료 지점이다.
2. **DEFERRED 3건의 선행 질문을 먼저 푼다.** 셋 다 같은 뿌리다 — Atlas 의
   `data-database` 분야가 '데이터베이스'와 '데이터 다루기'를 한 묶음으로 담고 있어
   학문 대응이 그것을 그대로 물려받았다. 매핑 경계를 정하면 셋이 함께 풀린다.
   Owner Gate 사안이다.
3. **Learning Path Coverage 100% 를 성과로 읽지 않는다.** 이번 Cycle 에서는 각
   Phase 가 PATH_NEEDED 로 판정한 직후 관계를 바로 작성했기 때문에 미처리 backlog 가
   생길 여지가 없었다. 독립적인 측정이 아니라 **작업 방식의 결과**다. 판정과 작성을
   분리하는 Cycle 이 오면 그때 의미 있는 숫자가 된다.
4. 종료 기준 제안은 위 1·2 가 끝난 뒤에 한다.

권고하지 않는 것: View 재설계, ontology 변경, canonical 대량 추가,
baseline 을 편의로 넓히는 일, Timeline 숫자 채우기.

---

## 11. 커밋

| commit | 내용 |
| --- | --- |
| `4f4ef8b` | U17 — Curriculum Baseline 분리, 미션 중복 authoring 정리, 계약 전수 검사 |
| `d324b2c` | Phase A — operating systems 판정 18건 |
| `35076cf` | Phase B — information security 판정 15건 |
| `3df7f12` | Phase C·E — programming fundamentals 13건, devops 8건 |
| `a5f70d7` | Priority Review Coverage 모델 (review artifact + metric script) |
