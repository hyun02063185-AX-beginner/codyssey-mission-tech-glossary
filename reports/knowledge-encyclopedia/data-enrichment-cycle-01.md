# Data Enrichment Cycle 01

- 수행일: **2026-09-19**
- 시작 commit: `98b3edd` · baseline tag **`encyclopedia-views-v1`**
- 성격: 데이터 확장. **Data Model 동결 유지**, RC1 변경 0건
- 판정: **ENCYCLOPEDIA_DATA_ENRICHMENT_01_READY**
- 이 보고서는 당시 기록이다. 현재 상태는 `docs/knowledge-encyclopedia/00-project-status.md`를 본다.

---

## 1. Baseline Checkpoint

작업 전 전부 재검증했다: builder PASS · validator 0/0 · impact unexpected 0 · unit 48 · Playwright 16 · production build PASS · RC1 519/519 · working tree clean.

기존 태그 규약(`glossary-rc1`)에 맞춰 annotated tag **`encyclopedia-views-v1`** 를 `98b3edd`에 남겼다. RC1을 대체하지 않으며, Encyclopedia 층의 안정 기준점(Data Model Stable + Views v1)을 뜻한다.

## 2. Phase A — Algorithms

`algorithms-data-structures` Atlas field에 묶인 **31개 term을 전수 판정**했다. 기준은 "구조를 정의하는가, 절차와 분석인가".

| 판정 | 수 | 대상 |
| --- | ---: | --- |
| `AUTO_DERIVED` (자료구조 유지) | 19 | hash-map·hash-bucket·separate-chaining·collision·load-factor·doubly-linked-list·deque·queue·stack·min-heap·heap-property·binary-search-tree·directed-graph·directed-acyclic-graph·cycle·inverted-index·cache-eviction·least-recently-used·hash-function |
| `ACADEMIC_OVERRIDE` (→ algorithms) | **12** | sorting-algorithm·lexicographical-order·stable-custom-comparator·graph-traversal·bfs·dfs·topological-sort·topological-order·shortest-path·o-constant-time·amortized-complexity·top-n |
| `NOT_ALGORITHMS` | 0 | — |
| `AMBIGUOUS` (판정 후 유지) | 2 | `hash-function`(해시 설계는 알고리즘이지만 이 사전에서는 해시맵 설명 맥락), `least-recently-used`/`cache-eviction`(M09에서는 해시맵+DLL로 구현하는 자료구조 설계 문제) |

**visibility before/after**: `insufficient-coverage`(term 1) → **`active`**(term 13).

Phase 기준은 "타당한 데이터"였고 active는 결과였다. 실제로 override만으로는 13개(<20)라 여전히 hidden이었고, Phase D에서 **학습 경로 4개가 생기면서** 2차 기준(term ≥3 + cluster 경로 ≥1 + 미션 ≥1)을 충족해 열렸다.

부수 효과: `data-structures` 31 → 19. 20 미만이지만 cluster 경로 5개가 있어 계속 `active`다 — 2차 기준이 의도대로 동작했다.

Specialist는 **CS Curriculum 1개**만 사용했다. 판정 기준이 커리큘럼 구분이고 미션 의미가 갈리는 지점이 없어 Mission Learning은 Phase D 단계에서만 호출했다.

## 3. Phase B — Cloud Computing

DevOps field 31개 + 네트워크·시스템 field의 클라우드 인접 term을 함께 검토했다. 기준은 **"제공자의 서비스 모델 안에서만 성립하는 개념인가"**.

| 판정 | 수 | 대상 |
| --- | ---: | --- |
| `ACADEMIC_OVERRIDE` (→ cloud-computing) | **13** | amazon-web-services·amazon-ec2·amazon-ebs·cloud-region·aws-free-tier·virtual-private-cloud·elastic-ip·resource-cleanup·github-pages·netlify·vercel·render·railway |
| `ACADEMIC_OVERRIDE` (secondary만) | 1 | vm-vs-container (primary는 devops 유지, 가상화 맥락만 추가) |
| `NOT_CLOUD` (devops 유지) | 16 | Docker 계열 전부(docker·dockerfile·compose·volume·bind-mount·layer·docker-hub·containerd-runc·orbstack 등) + deployment |
| `AMBIGUOUS` (네트워크 유지) | 4 | subnet·public-subnet·internet-gateway·nat-gateway — 클라우드 밖에서도 성립하는 네트워크 개념이라 옮기지 않았다 |

**visibility before/after**: `declared`(0) → **`active`**(13). 역시 override만으로는 hidden이었고 M05 배포 경로 2개가 생기며 열렸다.

`aws-free-tier`는 기존 파생이 systems-runtime(→운영체제)였다. 과금 모델이 운영체제와 무관하다는 점에서 **파생 오류에 가까운 사례**였고 이번에 바로잡혔다.

## 4. Phase C — SRE 정책 검증

**결론: 현재 519개로는 SRE를 의미 있게 표현할 수 없다. declared 유지.**

| 질문 | 답 |
| --- | --- |
| 519개만으로 표현 가능한가 | **아니다.** 정의적 개념 20개(SLO·SLI·SLA·error budget·incident·postmortem·on-call·toil·availability·capacity planning·MTTR·runbook·rollback·canary·blue-green 등)를 전수 탐색한 결과 **canonical 0개** |
| 기존 term 조합으로 충분한가 | 관측·원인 분석 실천층(observability·system-monitoring·health-check·logging·watchdog·root-cause-analysis·threshold·verification 등 약 15개)은 있으나, 이는 SRE의 **도구 일부**이지 학문이 아니다. 이를 SRE라 부르면 분야를 왜곡한다 |
| 빠진 핵심 개념이 있는가 | **있다.** 위 20개 중 최소 5개(SLO/SLI, error budget, incident·postmortem, availability target, toil) |
| Codyssey 학습 범위에 필요한가 | **현재는 아니다.** M07(자기 점검)·M08(원인 분석)은 이미 있는 canonical로 덮인다. 신뢰성 목표나 온콜을 요구하는 미션이 없다 |

**결정**: canonical을 추가하지 않는다. 후보 5건을 `docs/13_canonical_term_selection_growth_policy_v1.md`에 **Candidate register**로 기록하고 각각의 재검토 전제 조건을 함께 남겼다. 승격은 Owner Gate다. role SRE는 `limited` 유지.

## 5. Phase D — Prerequisite Enrichment

4개 batch, 신규 edge **33개**, 신규 경로 **13개**. 개수가 아니라 학습 가치를 기준으로 골랐다.

| Batch | 신규 edge | 경로 | 내용 |
| --- | ---: | ---: | --- |
| 1. Algorithms/DS (M09·M10) | 7 | 5 | 비교 기준→정렬→안정성 / 그래프→순회→BFS / DAG→위상정렬→위상순서 / 복잡도→O(1) / DLL+해시맵→LRU |
| 2. Cloud (M05) | 7 | 2 | 제공자→리전→VPC→서브넷 / 인스턴스↔블록 스토리지 |
| 3. Database (M11) | 11 | 3 | 테이블→조인→내부조인 / 조회→묶기→집계 / 파일→영속성→SQLite→관계형DB |
| 4. OS (M07·예비 M01) | 8 | 3 | 터미널→셸→Bash / 사용자→권한→숫자표기 / cron→crontab |

**선수 관계를 가진 term: 94 → 116.**

각 batch는 Orchestrator(영향 범위) → Architect(기존 relation으로 표현 가능한지) → Specialist(의미) → Authoring → Builder → Harness → Impact Review 순으로 처리했고, PASS 후 다음으로 넘어갔다.

## 6. Impact Review 결과

기존 `report_encyclopedia_impact.py`를 **변경 없이** 재사용했다. 필요한 정보(변경 node/edge, 영향 미션 전후, 추가/제거된 선수 학습, cross-cluster 전파)를 이미 전부 출력해 기능을 더하지 않았다.

**영향받은 미션 9개** — 변경된 미션만 검토했고, 변경되지 않은 7개는 반복 검토하지 않았다.

| 미션 | 새 선수 학습 | 판정 |
| --- | --- | --- |
| main-m10 | 해시맵, 시간복잡도 | ✔ 역색인을 이해하려면 필요 |
| main-m05 | Cloud Region | ✔ EC2가 리전 안에 만들어짐 |
| main-m11 | Cardinality | ✔ 1:N이 카디널리티의 한 경우 |
| main-m12 | relational database | ✔ SQLite가 관계형 DB의 하나 |
| main-m13 | Cardinality, relational database | ✔ 동일 |
| preliminary-m01 | 파일 I/O, 사용자, 그룹 | ✔ 볼륨 영속성과 권한 학습 |
| main-m07 | 셸, 터미널 | ✔ 자동 점검 스크립트의 전제 |
| main-m03 | 절대/상대 경로, process | ✔ 파일 저장과 종료 코드 |
| preliminary-m02 | 절대/상대 경로 | ✔ 파일 입출력 |

**unexpected cross-cluster propagation: 3건 발생 → 전부 해소.**

Batch 4에서 `main-m03 ← 절대/상대 경로·process`, `preliminary-m02 ← 절대/상대 경로`가 미션이 선언한 학문 밖(operating-systems)에서 들어왔다. Semantic review 결과 **관계는 옳고 미션의 학문 배정이 좁았다** — 두 미션 모두 파일 I/O·CLI·종료 코드를 실제로 다룬다. Impact Gate가 제시한 선택지 (b)를 적용해 `operating-systems`를 supporting에 넣었다. 최종 unexpected **0**.

### 계약 테스트가 추가로 잡은 것

누수 회귀 테스트를 "M03에 XSS가 없는가"라는 **스냅샷**에서 "어떤 미션도 선언한 학문 밖 선수 학습을 갖지 않는다"는 **계약**으로 바꾸자, **이번 Cycle 이전부터 있던 불일치 3건**이 드러났다.

- `main-m09 ← cache (computer-architecture)` — M09는 메모리 한계를 다루는 캐시 저장소인데 컴퓨터구조가 빠져 있었다
- `main-m12 ← HTTP Request/Response (computer-networks)` — HTTP 위의 웹 서비스인데 네트워크가 빠져 있었다
- `main-m13 ← HTTP Request/Response` — 동일

셋 다 학문 배정을 넓혀 해소했다. **delta 기반 Impact Gate는 이것을 볼 수 없다** — 변경분만 비교하므로 과거부터 있던 상태는 대상이 아니다. 전수 계약 테스트가 그 빈틈을 메운다는 것이 이번 Cycle의 수확이다.

## 7. Academic Coverage Audit

| field | terms | missions | paths | overrides | ovr% | visibility |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| web-programming | 92 | 8 | 1 | 0 | 0% | active |
| programming-fundamentals | 74 | 13 | 4 | 2 | 3% | active |
| database-systems | 67 | 9 | 8 | 0 | 0% | active |
| software-engineering | 58 | 10 | 3 | 0 | 0% | active |
| operating-systems | 53 | 8 | 7 | 3 | 6% | active |
| information-security | 51 | 10 | 6 | 1 | 2% | active |
| computer-networks | 29 | 6 | 3 | 1 | 3% | active |
| artificial-intelligence | 25 | 2 | 0 | 0 | 0% | active |
| devops | 21 | 4 | 0 | 1 | 5% | active |
| data-structures | 19 | 2 | 5 | 0 | 0% | active |
| **algorithms** | 13 | 4 | 4 | 13 | 100% | **active** (2차 기준) |
| **cloud-computing** | 13 | 4 | 2 | 13 | 100% | **active** (2차 기준) |
| computer-architecture | 4 | 2 | 3 | 4 | 100% | active (2차 기준) |
| **sre** | 0 | 0 | 0 | 0 | — | **declared** |

**active 13 / insufficient-coverage 0 / declared 1.** visibility 기준 자체는 변경하지 않았다.

상태 변화 설명: algorithms·cloud-computing이 열린 것은 override로 term이 생기고 **학습 경로가 붙었기 때문**이다. override 비율 100%인 세 field는 모두 "Atlas field가 없거나 한 field가 두 과목으로 갈리는" 구조적 이유를 가진다 — 이 숫자는 품질 문제가 아니라 **축이 다르다는 사실의 정량 표현**이다.

## 8. Role Coverage Audit

| 상태 | 수 | 변화 |
| --- | ---: | --- |
| active | 8 | 변화 없음 |
| limited | 2 | qa-engineer(core 분야 term 0), site-reliability-engineer(core 학문 sre가 declared) |

Cycle 전후 동일하다. cloud-computing이 열렸지만 devops-engineer·platform-engineer의 core 학문은 `devops`라 상태가 바뀌지 않았다. unexpected role membership 없음. SRE·QA 과장 없음 — 두 직무 모두 무엇이 없는지 화면에서 말한다. role source에 term 목록을 넣지 않았다.

## 9. Timeline Readiness

| 항목 | 현재 | 기준 |
| --- | ---: | ---: |
| evolved_from | **3** | ≥ 15 |
| 길이 3+ chain | **0** | ≥ 4 |
| 고립 pair 비율 | **100%** | < 40% |

**`DEFERRED_FOR_DATA_READINESS` 유지.** 이번 Cycle에서 발전 관계를 하나도 만들지 않았다 — 숫자를 채우려고 쓰지 않는다는 원칙대로다. 자연스럽게 발견된 후보도 없었다.

## 10. Display QA

**문제 1건 발견·수정.** 학문 상세 화면의 소개 문구에 유지보수용 내부 용어가 그대로 노출되고 있었다.

> (수정 전) 알고리즘 — "탐색·정렬·복잡도 분석. Atlas의 algorithms-data-structures field는 기본적으로 자료구조로 파생되므로, 알고리즘 성격 term은 cluster override로 이쪽에 배정한다."

학문 5개·직무 3개의 문구를 학습자 언어로 다시 썼고, 유지보수 근거는 cluster의 `review.note`와 `academicOverrides[].reason`에만 남겼다. 두 source 파일에 `noteAudience` 정책을 명시했다.

| 점검 | 결과 |
| --- | --- |
| raw internal ID 노출 | 없음 (미션은 제목 + "본과정 M09" 형태) |
| canonical label 사용 | ✔ |
| 한국어 조사/띄어쓰기 | ✔ (View Cycle에서 고친 "정보보안가" 유형 재발 없음) |
| empty state의 내부 용어 | ✔ 수정 완료 |
| coverage/status 내부 값 노출 | ✔ 한국어 라벨로만 노출 |

**자동 회귀 3개를 추가**했다: 학습자 문구에 내부 용어 금지, 모든 node에 사람이 읽는 라벨 존재, 미션 raw id가 제목 자리에 오지 않음. 언어 자연스러움은 브라우저로 직접 확인했다(학문 목록·알고리즘 상세).

## 11. Data Model Freeze

| 항목 | 결과 |
| --- | --- |
| 새 Node Type | 0 |
| 새 Relation Type | 0 |
| Academic taxonomy 변경 | 0 (14개 그대로, note 문구만 수정) |
| Technology taxonomy 변경 | 0 |
| foundation 증가 | **0** (3 그대로) |
| Mission schema 변경 | 0 (academic.supporting 값만 조정) |

`ARCHITECTURE_REVIEW_REQUIRED` 로 올릴 항목 없음. 이번 enrichment는 전부 Stable Model 안에서 처리됐다.

## 12. 전체 QA

| 항목 | 결과 |
| --- | --- |
| encyclopedia build | PASS · 결정적(재실행 diff 없음) |
| encyclopedia validate | PASS — 0 error · 0 warning |
| impact analysis | affected 9 → 검토 완료 · unexpected **0** |
| academic / role coverage | §7 · §8 |
| prerequisite cycle / taxonomy cycle | 0 |
| validate_glossary | **519 canonical · 0 error · 0 warning** · 780 info |
| validate_technology_field_atlas | PASS — 12 fields · 519 terms |
| validate_knowledge_map | PASS — 10 implemented / 12 registry |
| validate_content_tier_plan | PASS — 519 · A95/B247/C177 |
| Concept Connection | 무변경 (Playwright 확인) |
| Unit | **51 passed** (5 files) |
| Production build | PASS |
| Playwright | **16 passed** |
| Extension build | PASS |
| RC1 diff | `data/curated`·`content`·`data/knowledge-maps`·`extension`·Extension 입력 3파일 **변경 0** |

Playwright는 알려진 포트 충돌을 피해 빈 포트(4952)에 앱을 띄워 검증했다. **저장소 설정은 변경하지 않았다.** 실행 절차는 status 문서에 적혀 있다.

## 13. 판정

**`ENCYCLOPEDIA_DATA_ENRICHMENT_01_READY`**

| 조건 | 결과 |
| --- | --- |
| Data Model Freeze 유지 | ✔ |
| Algorithm mapping 검토 완료 | ✔ 31개 전수 |
| Cloud mapping 검토 완료 | ✔ 34개 검토, 13개 이동 |
| SRE 정책 검토 완료 | ✔ declared 유지 + 후보 5건 등록 |
| prerequisite 의미 있는 확장 | ✔ 94 → 116 term, edge 33, 경로 13 |
| unexpected semantic propagation | ✔ 0 |
| Academic coverage 설명 가능 | ✔ §7 |
| Role regression | ✔ 없음 |
| View display regression | ✔ 1건 발견·수정·회귀 고정 |
| RC1 regression | ✔ 없음 |
| Multi-AI handoff 최신 | ✔ |

## 14. 다음 enrichment 권고

데이터 분포 기준으로 다음 순서를 제안한다. **View 재설계나 신규 View는 제안하지 않는다.**

1. **web-programming (92 term, 경로 1개)** — 수록량은 가장 많은데 학습 경로가 하나뿐이다. M01·M02의 DOM·이벤트·React 상태 흐름은 이미 Frontend map에 edge가 두터우니, 경로를 얹는 비용이 가장 낮고 효과가 크다.
2. **artificial-intelligence (25 term, 경로 0)** · **devops (21 term, 경로 0)** — 경로가 하나도 없는 두 영역. M06(AI 도우미)과 예비 M01(Docker)은 학습 순서가 분명해 batch 하나로 채울 수 있다.
3. **information-security (51 term, 미션 10개)** — 가장 많은 미션에 걸치는 횡단 학문인데 경로는 6개다. 횡단 영역이라 Impact Gate를 특히 주의해서 돌려야 한다.
4. **computer-architecture (4 term)** — 유일하게 term 자체가 부족하다. 예비 M03의 NPU·행렬 연산 어휘를 재검토하면 늘릴 여지가 있다.
5. **선수 관계 밀도** — 116/519(22%)다. 위 순서로 batch를 이어가되, 매 batch마다 Impact Gate와 계약 테스트를 함께 돌린다.

**하지 않을 것**: 519개 일괄 enrichment, SRE 활성화를 위한 canonical 추가, Timeline 숫자 채우기, 노출 기준 완화.

## 15. 관련 commit

| commit | 내용 |
| --- | --- |
| `98b3edd` / tag `encyclopedia-views-v1` | 시작 기준 |
| (이 Cycle) | Phase A~D · display QA · report — `git log --oneline -10` |
