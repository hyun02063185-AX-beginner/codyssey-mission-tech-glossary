# Expansion Cycle 01 — 4개 이질 영역 확장

- 수행일: **2026-09-19**
- 시작 commit: `538e1bb` (Foundation Cycle 종료, `KNOWLEDGE_ENCYCLOPEDIA_FOUNDATION_READY`)
- 성격: 확장 + 검증. Foundation 재설계 없음. **RC1 데이터 변경 0건**
- 판정: **ENCYCLOPEDIA_DATA_MODEL_STABLE**
- 이 보고서는 당시 기록이다. 현재 상태는 `docs/knowledge-encyclopedia/00-project-status.md`를 본다.

---

## 0. Owner 결정 적용

| 결정 | 적용 방식 |
| --- | --- |
| **U5** prerequisite 역방향 | Specialist 재검토 결과 **두 건 모두 reverse 하지 않았다**(아래 §7). Encyclopedia override 기제는 만들지 않았다 — 적용할 사례가 없는데 기제만 만드는 것은 불필요하다. `UPSTREAM_AMBIGUITY` 로 근거·원본 위치와 함께 기록했다. |
| **U9** self-reference | 빌더가 `from == to` edge 를 **그래프에서 제외**하고, `data/encyclopedia/upstream-registry.json` 에 기록하며, Harness 가 UPSTREAM 경고로 계속 노출한다. 원본 map 은 수정하지 않았다. RC1 회귀 없음. |
| **U10** build pipeline | `encyclopedia:build` 를 `data:build` 에 **연결하지 않았다.** 독립 실행 유지. |

새 파일 `data/encyclopedia/upstream-registry.json` 을 도입했다(4 entry). 필수 항목은 source / location / issue / encyclopediaHandling / rc1Impact / futureRecommendation 이며, Harness 가 "그래프에서 제외된 self-reference 가 registry 에 없으면 오류"로 강제한다.

## 1. Phase별 결과

### Phase A — Programming Foundations

**성격**: Atlas 에서 cross-field layer 라 **knowledge map 이 없다.** 기존 edge 0개에서 시작한 첫 cluster.

- 평가 term 17 · 신규 edge 15 · 재사용 0 · 경로 4 · **override 4 (24%)**
- override: `recursion`→programming-fundamentals, `floating-point`/`ieee-754`/`epsilon`→computer-architecture
- 경로: 코드는 어떤 단위로 실행되는가 / 오류 메시지를 읽는 법 / 함수에서 객체로 / 실수 비교는 왜 == 로 하지 않는가
- **모델 조정 1건**: `defined_by` 를 authorable 로 열었다. `floating-point` 의 규범 정의가 IEEE 754 에 있다는 관계를 `based_on` 으로 뭉뚱그리지 않기 위해서다. **신규 relation type 이 아니라 기존 12종 중 하나의 사용 범위 조정**이며 `relation-ontology.json` 에 사유를 남겼다.

### Phase B — Database / M11

**성격**: 기술 분야(data-database)와 학문(database-systems)이 1:1 로 겹치는 영역.

- 평가 term 11 · 신규 edge 5 · **재사용 5** · 경로 4 · **override 0 (0%)**
- 경로: 관계형 데이터는 어떻게 구조를 얻는가 / 질의는 어떻게 빨라지는가 / 데이터는 무엇으로 맞게 유지되는가(**기존 edge 만으로 구성**) / 변경은 어떻게 안전해지는가
- 결과: **두 축이 겹치면 override 는 실제로 0 이 된다.** Phase A 와의 대비가 이 Cycle 의 핵심 측정값이다.

### Phase C — Git / Software Engineering

- 평가 term 11 · 신규 edge 7 · **재사용 6** · 경로 3 · **override 0 (0%)** · Specialist **1개만** 사용
- Harness 가 `github-flow -uses-> pull-request` 가 기존 map 에 이미 있음을 잡아내 cluster 에서 제거했다(중복 0 유지).
- **U9 필터링 실증**: `term:remote -is_a-> term:remote` 가 그래프에서 제외됐고, 원본이 의도한 것으로 읽히는 관계(`remote based_on repository`)를 Encyclopedia 층에서 새로 작성했다. 원본은 그대로다.

### Phase D — Security / M13

- 평가 term 13 · 신규 edge 6 · 재사용 4 · 경로 4 · **override 3 (23%)**
- override: `cors`→information-security(primary 변경), `https`·`input-validation`→secondary 만 추가
- 경로 2개(`인증→인가→보호 라우트`, `정보보안→인증 토큰→JWT`)는 **기존 map edge 만으로** 구성됐다.
- **의미 누수를 잡았다** — §5 참조.

## 2. 측정 — override 비율

| Phase / cluster | terms | derived | overrides | ratio | 성격 |
| --- | ---: | ---: | ---: | ---: | --- |
| A programming-foundations | 17 | 13 | **4** | **24%** | map 없음, 학문 경계 넓음 |
| B database-m11 | 11 | 11 | 0 | **0%** | 기술=학문 1:1 |
| C git-software-engineering | 11 | 11 | 0 | **0%** | 기술=학문 1:1 |
| D security-m13 | 13 | 10 | **3** | **23%** | 보안은 다른 field 를 가로지름 |
| (기존 pilot) web-backend | 13 | 13 | 0 | 0% | |
| (기존 pilot) data-redis | 8 | 6 | 2 | 25% | |
| (기존 pilot) system-process | 13 | 10 | 3 | 23% | |
| **누적** | **86**(중복 포함) | — | **12** | **14%** | |

**Pilot 12.5% 와의 비교**: 누적 14%로 거의 같다. 그러나 평균값은 실제 구조를 가린다. 실제 분포는 **0% 아니면 23~25% 의 두 덩어리**다.

| crosswalk 를 믿어도 되는 영역 (override 0%) | 사람 판단이 필요한 영역 (override 23~25%) |
| --- | --- |
| Atlas field 와 학문이 1:1 로 대응하는 곳 — data-database↔database-systems, git-collaboration↔software-engineering, security-identity↔information-security, backend/network↔web-programming/computer-networks | ① 한 field 가 두 과목으로 갈리는 곳 (algorithms-data-structures → 자료구조 / 알고리즘) ② 대응 field 가 아예 없는 학문 (computer-architecture) ③ 한 개념이 여러 축에 걸치는 곳 (동시성=programming field / OS 과목, CORS=network field / 보안 과목) |

이것이 §6 이 요구한 구분이다. **override 를 0 으로 만드는 것이 목표가 아니라, 어디서 사람이 개입해야 하는지를 아는 것**이 목표였고, 그 경계가 데이터로 드러났다.

## 3. Foundation 증가 감시

| | 값 |
| --- | ---: |
| Cycle 시작 시 Encyclopedia foundation | 3 |
| Cycle 종료 시 | **3** |
| 이번 Cycle 신규 | **0** |

4개 영역, term 52개를 추가하면서 **새 foundation 이 한 개도 필요하지 않았다.** §7 의 확인 순서(기존 canonical → alias → synthetic map foundation → 파생 가능한 묶음)를 거친 결과 매번 기존 canonical 로 해결됐다.

기각한 후보:

| 후보 | 왜 만들지 않았나 |
| --- | --- |
| Data Type | canonical 없음. 그러나 `variable`·`type-hint`·`column-data-type` 으로 각 맥락이 이미 덮이고, 일반 개념 node 가 경로에 필요하지 않았다 |
| Control Flow | `loop`·`if-elif-else` 가 구체 개념으로 존재. 상위 묶음은 경로에 기여하지 않는다 |
| Version Control | `git`·`repository`·`commit` 으로 충분. 상위 개념이 필요한 경로가 없었다 |
| Query | `sql`·`select`·`query-execution` 이 각각 더 정확하다 |
| Row / Column | `table`·`column-data-type` 으로 충분. 행 개념 단독 node 는 경로를 만들지 못한다 |
| Encryption | canonical 없음. `https`·`password-hashing` 이 각 맥락을 덮고, 일반 암호 개념은 이번 경로에 불필요 |
| Same-Origin Policy | canonical 없음. `cors based_on http-request-response` 로 필요한 설명이 성립 |

**Architecture smell 없음** — foundation 증가율 0.

## 4. 통합 결과

| 항목 | Cycle 시작 | 종료 |
| --- | ---: | ---: |
| cluster | 3 | **7** |
| authored edge | 267 | **303** (기존 map 240 + cluster 63) |
| derived edge | 2,848 | 2,855 |
| path | 45 | **60** (기존 learningRoute 38 + cluster 22) |
| academic override | 5 | **12** |
| Encyclopedia foundation | 3 | 3 |
| 제외된 self-reference | 0 | 1 (U9) |
| upstream registry | — | 4 |
| `encyclopedia-graph.json` | 731 KB | 762 KB |

cluster edge 63개의 relation 분포: `based_on` 35 · `prerequisite` 10 · `uses` 7 · `is_a` 4 · `compare_with` 3 · `provided_by` 1 · `defined_by` 1 · `evolved_from` 1 · `interacts_with` 1. **신규 relation type 0.**

## 5. Harness 강화와 발견

### H1. 경로 근거 규칙을 조였다 (§10 반영)

"경로의 인접 단계는 방향 있는 학습 근거를 가져야 한다"를 강제하도록 Harness 를 고쳤다.

- 허용: 방향 있는 relation(prerequisite / based_on / is_a / cs_foundation / uses / provided_by / evolved_from / defined_by) + 앵커용 파생 membership(in_academic / in_field)
- 제외: **대칭 relation(compare_with / interacts_with)** — 둘이 함께 봐야 한다는 말이지 어느 쪽이 먼저인지는 말해 주지 않는다. 그리고 무타입 `related`, 단순 동시등장 `in_mission`

**즉시 기존 pilot 경로 3개가 걸렸다.** `keep-login-state`(cookie–login-session), `slowdown-triage`(cpu-usage–scheduler, scheduler–thread), `memory-pressure`(process–memory-usage, memory-leak–out-of-memory)가 전부 `interacts_with` 에 기대고 있었다. 방향 있는 edge 4개를 추가하고 경로 2개를 조정해 해결했다.

→ **규칙을 조이자 기존 데이터의 약점이 드러났다.** Pilot 단계에서는 "edge 가 있으면 통과"였기 때문에 보이지 않던 문제다.

### H2. 의미 누수 — Harness 가 못 잡고 Mission 검증이 잡았다

Phase D 첫 작성에서 `input-validation prerequisite sql-injection` / `... xss` 로 방향을 잡았다. 보안 cluster 안에서는 맞는 말이다("막으려는 문제를 먼저 알아야 검증의 목적이 선다").

그런데 그래프는 전역이다. `input-validation` 은 **M03(용돈 기입장)의 핵심 term** 이기도 해서, 미션 선수 학습 계산이 이렇게 나왔다.

```
main-m03 선수 학습: 함수, Iterator, SQL 인젝션, XSS, 스코프, 변수, 반복문, SQL
```

용돈 기입장을 만들기 전에 XSS 를 배우라는 답이다. 두 edge 의 방향을 뒤집어 해결했다.

```
main-m03 선수 학습: 함수, Iterator, 스코프, 변수, 반복문   ← 수정 후
```

**Harness 는 이것을 잡을 수 없다.** 구조적으로는 완전히 정상인 edge다. 잡아낸 것은 §9 의 Mission 실측이었다. → **cluster 단위 authoring 은 전역 영향을 만든다**는 것이 이 Cycle 의 가장 중요한 교훈이며, 절차에 반영했다(§11).

### H3. Harness 가 잡은 것

- 경로 근거 없음 7건(Phase A 2 + 기존 pilot 5)
- 중복 edge 1건(`github-flow uses pull-request`)
- self-reference 1건 → U9 처리로 전환
- registry 미등록 제외 edge 검사(신규 규칙)

## 6. Mission 검증

term 목록을 `missions.json` 에 복제하지 않고 전부 master 에서 파생했다.

| | M11 | M13 | M03(Programming Foundations 연결) |
| --- | --- | --- | --- |
| 어떤 학문 | database-systems | information-security + web-programming, database-systems | programming-fundamentals + database-systems, software-engineering |
| 무엇을 먼저 | data-structures, programming-fundamentals | computer-networks, operating-systems, computer-architecture, programming-fundamentals | (선행 과목 없음 — 최초 과목) |
| 어떤 기술 영역 | data-database | security-identity | programming-foundations(layer) + data-database map |
| 핵심 term | 22 | 19 | 20 |
| 선수 term (graph closure, 미션 밖) | Referential Integrity | ASGI, REST API, 인증 토큰, Cookie, 웹 API, HTTP Request/Response | 함수, Iterator, 스코프, 변수, 반복문 |
| 실제 적용 term | 27 | 25 | 24 |
| 다음 학습 | M12 / database-systems | information-security, cloud-computing, devops | M11 / database-systems |

M13 의 closure 가 미션 term 목록에 없는 `REST API`·`웹 API`·`HTTP Request/Response` 를 끌어온 것이 그래프의 실제 값어치다. M03 의 closure 는 Phase A 가 만든 기초 경로를 그대로 되짚는다.

## 7. Upstream Defect Registry

`data/encyclopedia/upstream-registry.json` (4 entry). 원본은 하나도 수정하지 않았다.

| id | type | 대상 | Encyclopedia 처리 |
| --- | --- | --- | --- |
| `U9-git-remote-self-reference` | UPSTREAM_DEFECT | git-collaboration map 의 `term:remote is_a term:remote` | 그래프에서 제외 + 경고 유지. 의도된 것으로 읽히는 관계는 Encyclopedia 층에서 `remote based_on repository` 로 별도 작성 |
| `U5-normalization-data-integrity-direction` | UPSTREAM_AMBIGUITY | data-database map | **reverse 하지 않음.** Database Specialist 검토 결과 edge 방향이 타당하다(무결성이라는 문제를 먼저 알아야 정규화라는 기법이 설명된다). 어긋난 것은 방향이 아니라 reason 문장의 서술 순서 |
| `U5-staging-area-commit-direction` | UPSTREAM_AMBIGUITY | git-collaboration map | **reverse 하지 않음.** staging area 는 '다음 commit 에 담을 것을 고르는 자리'로 정의되므로 commit 개념 없이는 설명이 성립하지 않는다. 작업 순서(add→commit)와 학습 순서(commit 개념→staging)가 다른 것이며 ontology 는 후자를 뜻한다 |
| `R11-abbreviated-korean-labels` | UPSTREAM_AMBIGUITY | glossary master 의 축약 표기(CPU/MEM/OOM/session) | 표기 그대로 노출. 경로 출력에 드러나는 것을 확인만 기록 |

`ENCYCLOPEDIA_OVERRIDE` 항목은 **0건**이다. U5 가 override 를 허용했지만 Specialist 검토에서 적용 대상이 없다고 판단했고, "무조건 reverse 하지 않는다"는 지시에 따라 기제를 만들지 않았다.

## 8. Governance 평가

| Phase | 사용한 Profile | 건너뛴 것 | 실제 기여 |
| --- | --- | --- | --- |
| A | CS Curriculum, Mission Learning | 없음(2개로 충분) | 학문 override 4건의 근거, `defined_by` 사용 결정 |
| B | Database, Mission Learning | — | 외래키/기본키 방향, 인덱스가 '항상 쓰이지 않는다'는 단서 |
| C | **Mission Learning 1개만** | Database·Security 불필요 | 분야 판단이 쉬워 1개로 충분했다 — 규칙대로 줄였다 |
| D | Security, Mission Learning | — | 검증만으로 주입이 막히지 않는다는 단서, XSS/SQLi 실행 위치 구분 |

- **충돌**: 없음. Phase D 에서 Security 와 Mission Learning 의 권고가 갈릴 뻔했으나(공격을 먼저 볼 것인가 검증을 먼저 볼 것인가), Mission 실측 데이터가 판정했다(§5-H2).
- **Profile 수**: Cycle 평균 1.75개. Foundation Cycle 의 3개에서 줄였고 품질 저하는 없었다.
- **Harness 의 한계가 분명해졌다**: 구조는 잡지만 의미는 못 잡는다. 전역 영향은 Mission 실측이라는 별도 단계가 필요하다.

## 9. 전체 QA

| 항목 | 결과 |
| --- | --- |
| validate_glossary | 519 canonical · 46 mission-local · **0 error · 0 warning** · 780 info |
| validate_technology_field_atlas | PASS — 12 fields · 519 terms · 16 missions |
| validate_knowledge_map | PASS — 10 implemented / 12 registry |
| validate_content_tier_plan | PASS — 519 · A95/B247/C177 |
| validate_encyclopedia | PASS — **0 error · 0 warning** (+ upstream defect 1건 보고) |
| builder 결정성 | PASS — 재실행 diff 없음 |
| graph integrity | unknown ref 0 · self-ref 0 · duplicate 0 · prerequisite cycle 0 · taxonomy cycle 0 · mission alias 충돌 0 |
| mission ID normalization | 4표기(main/M01, main-M01, main-m01, 구조체) 모두 정규화 확인 |
| `npm run test` | PASS — 4 files / 31 tests |
| `npm run build` | PASS |
| `npm run build:extension` | PASS |
| Playwright | PASS — 5/5 (빈 포트 4921. 기본 4173 은 외부 dev 서버 점유, 설정 미변경) |
| RC1 diff | `data/curated`, `content`, `data/knowledge-maps`, `extension`, Extension 입력 3파일 **변경 0** |

## 10. Expansion Calibration

| 질문 | 답 |
| --- | --- |
| 현재 Knowledge Model 로 충분한가 | **충분하다.** 4개 이질 영역에서 구조 변경이 필요하지 않았다 |
| 새 Node Type 이 필요한가 | **아니다.** term / foundation / academic / mission / field 5종으로 전부 표현됐다 |
| 새 Relation Type 이 필요한가 | **아니다.** 신규 0. 다만 기존 `defined_by` 의 authorable 을 열었다(사용 범위 조정) |
| Foundation 이 과도하게 증가하는가 | **아니다.** 3 → 3, 증가 0 |
| crosswalk 자동 파생 정확도 | 전체 86% (override 14%). 단 평균이 아니라 **0% / 23~25% 의 이봉 분포** |
| 어디서 override 가 올라가는가 | ① 한 field 가 두 과목으로 갈릴 때 ② 대응 field 가 없는 학문(computer-architecture) ③ 개념이 여러 축에 걸칠 때(동시성·CORS) |
| Mission mapping 을 현재 방식으로 확장 가능한가 | **가능하다.** 16개 미션 메타데이터는 이미 전부 있고, term 목록은 파생이라 cluster 가 늘어도 미션 파일은 고칠 일이 없었다 |
| 사람이 유지보수 가능한가 | **가능하다.** cluster 한 파일에 node·edge·경로·override 가 모여 있고, 이번 Cycle 의 모든 수정이 cluster 파일 한두 개 편집으로 끝났다 |
| Governance 가 품질에 기여하는가 | **기여한다.** Profile 이 4건의 과장을 걸렀고 Harness 가 9건의 구조 오류를 잡았다. 다만 **의미 누수는 둘 다 놓쳤고 Mission 실측이 잡았다** |

## 11. 절차에 반영한 변경

1. **경로 근거 규칙**: 대칭 relation 은 학습 순서의 근거가 될 수 없다 (Harness 강제).
2. **전역 영향 점검을 Phase 절차에 추가**: cluster 를 추가한 뒤 **그 cluster 의 term 을 쓰는 다른 미션의 선수 학습을 확인**한다. Harness 가 못 잡는 영역이다.
3. **Specialist 기본 2개**, 판단 충돌이 있을 때만 3번째.

## 12. Data Model Verdict

**`ENCYCLOPEDIA_DATA_MODEL_STABLE`**

| 조건 | 결과 |
| --- | --- |
| 4개 이질 영역에서 구조 변경 불필요 | ✔ |
| 신규 Node Type 불필요 | ✔ |
| 신규 relation ontology 불필요 | ✔ (authorable 플래그 1건 조정은 신규 type 아님) |
| override 가 관리 가능한 수준 | ✔ 14%, 발생 지점이 특정됨 |
| Foundation 증가 통제 | ✔ 0 증가 |
| Human maintainability | ✔ 모든 수정이 cluster 파일 편집으로 완결 |
| RC1 regression | ✔ 변경 0 |
| Multi-AI handoff | ✔ §13 |

이 판정 이후 ontology/schema 변경은 기본적으로 금지하고, View 구현 단계로 넘어간다.

## 13. Multi-AI Handoff

읽기 순서대로 점검했다: `00-project-status.md` → `06`/`07` → architecture 문서 → 최신 report(이 문서) → `git log --oneline -10` → source(`data/encyclopedia/README.md`).
보완한 것: status 에 Owner 결정 3건의 적용 결과, upstream registry 위치, 경로 근거 규칙, 전역 영향 점검 절차를 추가했다.

## 14. 다음 단계

**View Implementation Cycle** 을 제안한다. 이번 Cycle 에서는 View 를 구현하지 않았다.

우선순위: ① Prerequisite View(선수학습) — 데이터가 가장 두텁고 CLI 로 이미 검증됨 ② Mission View — 7개 질문이 전부 답해짐 ③ Academic View — 단 `cloud-computing`·`sre` 가 term 0 이라 노출 정책이 필요 ④ Role View ⑤ Timeline/개념 흐름 View — `evolved_from` 이 3건뿐이라 데이터 보강이 먼저.

View 가 `encyclopedia-graph.json` 에 실제로 의존하게 되는 시점에 **U10(빌드 파이프라인 통합)을 다시 판단**한다.

## 15. 관련 commit

| commit | 내용 |
| --- | --- |
| `538e1bb` | 시작 기준 (Foundation Cycle 종료) |
| (이 Cycle) | `feat(encyclopedia): apply owner decisions u5 u9 u10` / `feat(encyclopedia): expand programming foundations cluster` / `feat(encyclopedia): expand database and git clusters` / `feat(encyclopedia): expand security cluster` / `docs(encyclopedia): report expansion cycle 01` — `git log --oneline -10` 으로 확인 |
