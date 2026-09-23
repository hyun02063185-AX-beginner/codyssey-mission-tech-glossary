# 00. Knowledge Encyclopedia — Project Status

> **이 문서는 새 작업자(사람 또는 AI)가 가장 먼저 읽는 진입점이다.** 설계 본문이 아니라 "지금 어디까지 왔는가"만 담는다.
> 최종 갱신: **2026-09-23 / Learner Readiness Final Cleanup 완료 시점**
> 갱신 규칙: Sprint가 끝날 때마다 이 문서를 현재 상태로 덮어쓴다. 과거 기록은 `reports/knowledge-encyclopedia/`에 남기고 여기서는 지운다.

---

## 1. 프로젝트 목적

기존 **코디세이 기술용어 사전**(519 canonical, RC1 동결)을 핵심 데이터로 유지하면서,
`용어 → 설명` 구조를 **기술 / 학문 / 미션 / 직무 / 개념의 흐름**으로 탐색 가능한 **Knowledge Encyclopedia**로 확장한다.

범위: Encyclopedia는 **수집이 아니라 연결**이다. canonical을 대량 추가하지 않으며, 기존 "CS 백과사전을 만들지 않는다"는 선언과 충돌하지 않는다(근거는 [07 FD-01](07-foundation-decisions.md)). README와 `docs/00`의 문구는 **수정하지 않고 유지**한다.

## 2. Glossary RC1 기준 상태 (변경 없음)

| 항목 | 값 |
| --- | --- |
| Canonical / Detailed / Coverage | 519 / 519 / 100% |
| RC tag | `glossary-rc1`(불변) · `encyclopedia-views-v1` · `encyclopedia-learning-baseline-v1` · `glossary-content-integrity-v1` · **`glossary-content-quality-v1`** |
| Web UI / Chrome Extension | 0.1.0 / 0.4.2 |
| glossary validator | 519 · 46 mission-local · **0 error / 0 warning** · 780 info |
| atlas / knowledge-map / content-tier | 전부 PASS |
| unit / build / extension / Playwright | 60 tests PASS / PASS / PASS / **22 PASS** |
| RC1 정책 | `glossary-rc1` tag 는 **불변**이다. main 의 `content/**` 수정은 Post-RC1 Content Maintenance 이며 RC1 을 고치는 것이 아니다. `data/knowledge-maps`·`extension`·`data/curated` 는 여전히 **변경 0** |

## 3. 현재 Sprint

**Learner Readiness Final Cleanup 완료** — 알려진 잔여 품질 문제만 닫았다. 새 기능도 확장도 없다.

판정: **ENCYCLOPEDIA_LEARNER_TEST_READY**

- **Minor Editorial 149건 → 0.** 본문 절은 화면에서 평문으로 나가므로 마크다운 백틱이 글자로 보였다. 원본 마크다운은 그대로 두고 `build_web_data.py` 의 `prose()` 가 **화면으로 나가는 값에서만** 걷어낸다. 다음 Cycle 이 inline code 를 시각적으로 구분하기로 하면 되돌릴 수 있다
- **회차 문구 4건도 같은 처리.** `mission_refs[].context` 는 `data/curated`(RC1 보호)라 원본을 건드리지 않고 화면 값만 다듬었다
- **브라우저가 8건을 더 잡았다.** `쉽게 설명하면` 첫머리의 `"X은(는)"` 조사 자리 표시가 그대로 보였다. 검사를 추가해 재발을 막았다
- **Manual Review 33건 전수 대조.** 저장소의 Mission source 는 `mission_refs` 와 `mission-term-map` 이며(미션 원문은 저장소에 없다), 판정의 축은 `source_status` 다 — `direct`(413) / `required`(88) / `related`(94). **SUPPORTED 31 · OVERSTATED 2 · UNSUPPORTED 0 · SOURCE_INSUFFICIENT 0**
- **EX03 CONTEXT_MISMATCH 4 → 0.** edge 가 틀린 2건(`process-id -is_a-> process`, `default-route -is_a-> route-table`)은 **reason 쪽이 맞았고** relation 을 `based_on` 으로 바로잡았다. reason 만 틀린 2건은 문장만 다시 썼다. **reason 을 자동으로 바꾸지 않았다**
- **GENERIC_REASON 10건은 결함이 아니다.** Swap Test 로 9건을 다시 쓰고 `rbac` 1건은 그대로 뒀다 — 짧아도 'role 기반' 이 다른 모델과 갈라 준다. 숫자를 0 으로 만들려고 고치지 않는다
- **동결 map 은 건드리지 않았다.** `map-edge-corrections.json` 에 supersedes + 대신 쓸 edge 를 적고 그래프를 만들 때 map 의 해당 edge 를 받지 않는다(**U9·U16 과 같은 처리**). supersedes 가 맞는 edge 를 못 찾으면 빌드가 멈춘다
- **최종 분류 518 전수**: CONTENT_OK **518** · NEEDS_MINOR_EDITORIAL **0** · NEEDS_MANUAL_REVIEW **0** · CONFIRMED_DEFECT **0**
- Scenario A~G **PASS 7 · FRICTION 0 · BLOCKED 0** · Impact Gate 영향 미션·학문·경로 **0**

이전 판정 11건은 이 판정에 포함된다.

## 4. 현재 작업 단계

```
[Sprint 0]   조사·설계                 ✅ 완료
[Sprint 00b] Foundation Review         ✅ 완료 (VALID)
[Sprint 01]  Data Skeleton             ✅ 완료 (Gate PASS)
[Sprint 02]  Pilot 3 cluster           ✅ 완료 (E1~E10 PASS)
[Cycle 1]    4개 영역 확장             ✅ 완료 (DATA MODEL STABLE)
[View Cycle] 4개 View + 운영 기반       ✅ 완료 (VIEWS V1 READY)
[Enrich 01]  Algorithms·Cloud·SRE·선수   ✅ 완료 (ENRICHMENT 01 READY)
[Enrich 02]  Web·AI·DevOps·Security·CA  ✅ 완료 (ENRICHMENT 02 READY)
[Enrich 03]  DB·PF·SE·Network·Web + 표시경계 ✅ 완료 (ENRICHMENT 03 READY)
[Cover 04]   U17 + 판정 모델 + OS·보안·잔여 ✅ 완료 (COVERAGE COMPLETION 04 READY)
[Cover Fin]  300개 전수 판정 + U18 + baseline ✅ 완료 (LEARNING COVERAGE BASELINE READY)
[Explore 01] 대백과 진입 + cross-view + R12 감사 ✅ 완료 (EXPLORATION V1 READY)
[Recovery]   R12 원인 차단 + 79건 복구 + 재판정 ✅ 완료 (CONTENT INTEGRITY RECOVERY READY)
[Quality]    260건 재작성 + 73건 확장 + EX03 감사 ✅ 완료 (GLOSSARY CONTENT QUALITY BASELINE READY)
[Cleanup]    Minor Editorial + Manual Review + EX03 수정 ✅ 완료 (ENCYCLOPEDIA LEARNER TEST READY)
[다음]       Learner Readability & Comprehension Validation ⬜ 미착수  ⬅ 지금 여기
             (비전공·초심자 대상. 별도 Cycle 로 진행한다)
             (data enrichment / ontology 는 자동 재개하지 않는다)
[이후]       Timeline View              ⬜ 데이터 준비 후
```

Data Model은 동결 상태다. ontology/schema 변경은 금지되며, 다음은 **노출 범위를 넓히는 데이터 작업**이다(§9).

## 5. 확정된 결정

Sprint 0의 D1~D12에 더해, Foundation Review에서 근거와 함께 확정한 것(FD-01~FD-10). 전문과 근거·기각안·변경비용은 [07-foundation-decisions.md](07-foundation-decisions.md)에 있다.

| # | 결정 |
| --- | --- |
| FD-01 | **Scope**: Encyclopedia는 연결 확장이다. 기존 범위 선언은 유지하고 문구를 고치지 않는다 |
| FD-02 | **Mission ID**: 정규 ID는 `main-m01`(소문자). alias 3종(`main/M01` 데이터, `main-M01` 웹 라우트, `main-m01` 지도 쿼리)을 빌더가 정규화한다. 공개 URL을 바꾸지 않는다 |
| FD-03 | **Foundation 경계**: 이름이 다르다고 foundation을 만들지 않는다. `hash-map`=Hash Table, `rest-api`=REST, `http-request-response`=Request/Response는 재사용. 신설은 3개뿐 |
| FD-04 | 기존 synthetic foundation 14개는 **전부 map-only 유지, 승격 0** |
| FD-05 | **Relation SSOT**: 어휘는 `validate_knowledge_map.py`의 `RELATIONS`, 의미(방향·대칭·역관계)는 `data/encyclopedia/relation-ontology.json`. 신규 type 0. 역관계는 저장하지 않고 파생 |
| FD-06 | **학문 14개**(11 academic + 3 applied) + Atlas→학문 crosswalk 단일 표. 학문과 기술 분야는 **다른 축**이며 Atlas를 고치지 않는다 |
| FD-07 | Atlas 12 field를 기술 분야 모델로 그대로 재사용. 신규 taxonomy 0 |
| FD-08 | **Role은 node 아님** — 분야 가중치 metadata + 파생 membership |
| FD-09 | **Learning Path는 계산 우선**, 저장은 순서 + 서사. 경로의 인접 단계는 edge 근거 필수 |
| FD-10 | U1~U4·U6 해결, U5·U7·U8은 의도적으로 남김 |

Expansion Cycle 1에서 Owner 결정으로 확정된 것:

| # | 결정 |
| --- | --- |
| **U5** | prerequisite 방향은 **Specialist 검토로 확인된 경우에만** Encyclopedia 층에서 보정한다. 검토 결과 기존 2건은 **둘 다 방향이 타당해 보정하지 않았고** `UPSTREAM_AMBIGUITY`로 기록했다 |
| **U9** | upstream self-reference는 그래프에서 **제외**하고 registry에 기록하며 경고로 계속 노출한다. 원본 map은 고치지 않는다 |
| **U10** | `encyclopedia:build`를 `data:build`에 **연결하지 않는다.** 첫 production View가 그래프에 실제로 의존할 때 다시 판단한다 |
| **EX-01** | **경로 근거 규칙**: 대칭 relation(`compare_with`/`interacts_with`)은 학습 순서의 근거가 될 수 없다. 방향 있는 relation + 앵커용 파생 membership(`in_academic`/`in_field`)만 허용 |
| **EX-02** | cluster를 추가하면 **그 term을 쓰는 다른 미션의 선수 학습을 확인**한다. Harness가 못 잡는 전역 영향이다 |
| **U17** | **Curriculum Baseline 과 Mission Academic 을 가른다.** 과정 전체가 전제하는 학문은 `curriculum-policy.json`에 한 번만 적고 미션마다 반복하지 않는다. 미션 범위 계약 = 선언한 학문 + baseline. baseline은 선수 학습을 **만들어 내지 않고** 범위만 넓힌다. 현재 baseline은 `programming-fundamentals` 하나 |
| **U18** | **Atlas 분야 소속은 학문 배정의 후보 근거이지 결론이 아니다.** 한 Atlas 분야 안의 term 이 서로 다른 학문으로 갈라질 수 있고, Atlas taxonomy 는 고치지 않는다. override 49건은 오류가 아니라 두 축이 다르다는 증거다. 판단 근거는 term 의 한 줄 정의와 mission-term-map 이며, 상세 콘텐츠가 그와 어긋나면 근거로 쓰지 않고 registry 에 등록한다 → **ADR FD-12** |
| **U17-b** | **판정이 edge 보다 먼저다.** uncovered priority term은 관계를 찾기 전에 `PATH_NEEDED` / `VALID_ROOT` / `NO_PREREQUISITE_NEEDED` / `DEFERRED` 중 하나로 판정한다. '지금 선수 관계가 없음'과 `VALID_ROOT`는 다르며 root는 의미 검토로만 판정한다 |

## 6. 아직 미확정인 결정 (Owner 판단 필요)

| # | 쟁점 | 왜 남겼나 |
| --- | --- | --- |
| U8 | `mission-term-map-v0.1.yaml` 중복 | Encyclopedia는 master만 읽어 영향 없음 |
| U13 | 축약 한국어 표기(`MEM`·`CPU`·`OOM`·`session`)가 화면에 그대로 노출 | RC1 콘텐츠 영역이라 표시만 함. `upstream-registry.json` R11 |
| U14 | **SRE canonical 후보 5건**(SLO/SLI, error budget, incident·postmortem, availability target, toil) | 현재 미션이 요구하지 않아 추가하지 않음. `docs/13`의 Candidate register, 승격은 Owner Gate |
| U15 | **Computer Architecture canonical 후보 5건**(register, instruction/ISA, memory hierarchy, pipeline, virtual memory) | 매핑으로 해결되는 2건은 이미 교정. 나머지는 미션이 요구하지 않음. `docs/13` 등록, Owner Gate |
| U16 | **devops map의 `provided_by` 3건이 방향 계약과 반대** | 동결 영역. `upstream-registry.json` EX02. 선수 학습 계산에 영향 없어 그대로 두고 Encyclopedia 층에서 별도 based_on 작성 |

**U17은 Cycle 04에서 Curriculum Baseline으로, U18은 Coverage Completion Final에서 FD-12로 해결됐다**(§5 참조). U5·U9·U10은 Expansion Cycle 1에서, **U7·U11·U12는 View Cycle에서** 해결됐다. U7은 학문 지도를 canvas가 아닌 카드/목록으로 확정했고, U11은 노출 기준을 데이터 분포에서 도출했으며, U12는 `DEFERRED_FOR_DATA_READINESS`로 확정하고 readiness 기준을 [08](08-view-contracts.md)에 적었다.

**EX03·본문 백틱·회차 요구 단정 33건은 Learner Readiness Final Cleanup 에서 닫혔다.** EX03 의 CONTEXT_MISMATCH 4건은 동결 map 을 고치지 않고 `data/encyclopedia/map-edge-corrections.json` 으로 대신했다(U9·U16 과 같은 처리). 동결 map 이 쓴 learn-first reason **41건**은 남아 있으나 전부 감사에서 `REASON_OK` 이거나 Swap Test 를 통과해 그대로 둔 것이다.

upstream 원본 수정은 여전히 Owner Gate이며 `data/encyclopedia/upstream-registry.json`에 **6건**이 대기 중이다.

## 7. 생성된 주요 문서와 역할

| 문서 | 역할 | 상태 |
| --- | --- | --- |
| `docs/knowledge-encyclopedia/00-project-status.md` | **이 문서.** 현재 상태 / 인수인계 진입점 | 매 Sprint 갱신 |
| `01-current-architecture-audit.md` | 기존 구조 전수 감사, 데이터 소유 지도, 갭 G1~G10 | Sprint 0 기준 사실 |
| `02-knowledge-model-proposal.md` | node/edge/소유권/path/role/validator 설계 | 대부분 FD로 확정됨 |
| `03-mission-academic-tech-mapping.md` | 16 미션 ↔ 학문 ↔ 기술 crosswalk | `missions.json`으로 구현됨 |
| `04-view-architecture.md` | view 8종의 데이터 출처 | PROPOSED (미구현) |
| `05-pilot-plan.md` | pilot 계획과 판정 기준 E1~E10 | **실행 완료** |
| **`06-agent-governance-model.md`** | Orchestrator / Architect / Review Profile / Harness / Owner Gate **작업 계약** | ACTIVE |
| **`07-foundation-decisions.md`** | ADR — 확정 결정과 근거·기각안·변경비용. **FD-11**(Curriculum Baseline) · **FD-12**(Atlas 분야 ≠ 학문) 추가 | ACCEPTED |
| **`08-view-contracts.md`** | 4개 View 계약, 학문/직무 노출 정책, 빌드 파이프라인, Impact Gate, Timeline readiness | ACTIVE |
| **`src/learnerView.ts`** | 표시 경계. 화면에 나갈 수 있는 필드 목록(`LEARNER_FIELDS`)과 내부→학습자 변환 | ACTIVE (코드가 계약이다) |
| **`data/encyclopedia/curriculum-policy.json`** | U17. 과정 전체가 전제하는 학문과 미션 분류. 범위 계약의 SSOT | ACTIVE |
| **`data/reviews/encyclopedia-learning-coverage.json`** | Priority Learning Term 판정 기록(300건). 판정 시점·작성 시점을 함께 저장 | 살아 있는 목록 |
| `data/reviews/encyclopedia-learning-coverage-baseline.json` | **생성물.** 손으로 고치지 않는다. `npm run encyclopedia:coverage:freeze` | 생성물 |
| `data/reviews/r12-content-template-audit.json` | 상세 콘텐츠 판정(518건). Recovery Cycle 에서 재판정해 덮어썼다 | 살아 있는 목록 |
| `data/reviews/content-integrity-baseline.json` | **생성물.** 이미 아는 템플릿 재사용 기준선 | 생성물 |
| **`scripts/content_generation_guard.py`** | Sprint 7 배치 생성기 9개의 실행을 막는 문지기. 콘텐츠를 지키는 계약이다 | ACTIVE |
| `docs/13_canonical_term_selection_growth_policy_v1.md` | canonical 성장 정책 + **SRE 후보 register**(Owner Gate) | 기존 문서에 추가 |
| `reports/knowledge-encyclopedia/sprint-00~02*.md` | Sprint별 실행 기록 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/expansion-cycle-01.md`** | 4개 영역 확장 기록, override 측정, Governance 평가 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/view-implementation-cycle-01.md`** | View 4종 구현, 노출 정책 도출, Impact Gate 검증 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/data-enrichment-cycle-01.md`** | 학문 매핑 판정, SRE 정책, 선수학습 4 batch, 계약 테스트 발견 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/data-enrichment-cycle-02.md`** | Web·AI·DevOps·Security 확장, CA 감사, Learning Coverage 도입 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/data-enrichment-cycle-03.md`** | DB·PF·SE·Network·Web 보강, 표시 경계 구축, QA 포트 안정화 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/coverage-completion-cycle-04.md`** | U17 해결, 판정 모델 도입, OS·보안·PF·DB·DevOps 잔여 검토 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/coverage-completion-final.md`** | 300개 전수 판정, U18 해결, 종료 기준 제안, baseline 고정 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/exploration-usability-cycle-01.md`** | navigation 감사, 대백과 진입 화면, cross-view 연결, 학습자 시나리오 판정 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/content-integrity-recovery.md`** | R12 원인 추적, 확정 79건 복구, 273건 재판정, filter 재판정 | 이력(수정 금지) |
| `data/encyclopedia/upstream-registry.json` | 동결 원본의 결함·모호성과 Encyclopedia 처리 방식 | 살아 있는 목록 |

기존 문서 중 함께 읽을 것: `docs/10`(Atlas), `docs/11`(map engine), `docs/12`(cross-field layer), `docs/13`(canonical 성장 정책).

## 8. 현재 architecture 요약

```
[ 기존 authored (읽기 전용) ]                    [ Encyclopedia authored ]
glossary-master-v0.1.yaml (519)                  data/encyclopedia/
content/terms/*.md (518)                           relation-ontology.json   의미 12종
atlas/field-taxonomy.json (12 field)               academic-fields.json     학문 14 + crosswalk
atlas/term-field-classification.json (519)         missions.json            미션 16
atlas/mission-map-routing.json (16)                roles.json               직무 10
knowledge-maps/<10 map> (node 251/edge 241/route 38) clusters/*.json       cluster 32
                                                   upstream-registry.json   defect 6
                                                   curriculum-policy.json   baseline 1
data/reviews/encyclopedia-learning-coverage.json   판정 300건 (빌더 입력 아님)
                    │                                        │
                    └──────────┬─────────────────────────────┘
                     scripts/build_encyclopedia_graph.py   (읽기 전용 입력, 결정적 출력)
                               ↓
                 src/data/generated/encyclopedia-graph.json  (771 KB, 손으로 고치지 않음)
                               ↓
                 scripts/validate_encyclopedia.py  (Quality Harness)
                 scripts/report_encyclopedia_impact.py  (Impact Review Gate)
                               ↓
                 src/encyclopedia.ts  (공통 query layer — 그래프 탐색은 여기서만)
                               ↓
                 src/learnerView.ts   (표시 경계 — 화면에 나갈 필드를 여기서 고정한다)
                               ↓
   Encyclopedia Home · Prerequisite · Mission · Academic · Role View  (lazy, HashRouter)
        ↕ 용어 페이지 · 기술 지도 노드 패널 (TermEncyclopediaLinks, lazy)
```

**그래프 현황**: node 578(term 519 · foundation 17 · mission 16 · academic 14 · field 12) · authored edge 546(map 240 + cluster 306) · derived 2,878 · path 166 · academic override 49 · 제외된 upstream self-reference 1.
**Coverage (baseline 고정)**: Priority Review Coverage **300/300(100%)** · Pre-Authoring Path Coverage **204/260(78.5%)** · Final Path Coverage **260/260(100%)** · Unresolved **0%** · legacy **260/300(86.7%)**. 선수 관계 보유 term 312 / 519. 판정: PATH_NEEDED 260 · VALID_ROOT 34 · NO_PREREQUISITE_NEEDED 6 · DEFERRED 0 · 미검토 0.
**cluster 36개**: (pilot) web-backend · data-redis · system-process / (Expansion 1) programming-foundations · database-m11 · git-software-engineering · security-m13 / (Enrich 1) algorithms-m09-m10 · cloud-m05 · os-m07 / (Enrich 2) web-frontend-m01-m02 · ai-m06-pm03 · devops-deploy-pm01-m05 · security-m05-m07-m13 · computer-architecture-audit / (Cover Fin) commit-history-as-a-graph-m10 · hashmap-internals-m09 · ai-calling-a-model-m06 · web-remaining-m01-m02 / (Cover 4) os-process-tools-m07-m08 · security-credentials-m02-m13 · ops-diagnostics-m07-m08 · devops-container-tools-pm01 / (Enrich 3) database-query-m11 · database-orm-m12-m13 · data-exchange-m03 · redis-operations-m09 · python-language-m03 · python-packaging-m12 · javascript-state-m01 · software-design-m12 · git-internals-m10 · collaboration-m04 · network-http-m12 · web-ui-m01-m02 · web-forms-m12.
**노출 상태**: 학문 **active 13** / declared 1(sre) · 직무 active 8 / limited 2(qa-engineer, site-reliability-engineer).
**View route**: **`#/encyclopedia`(진입)** · `#/prerequisites(/:termId)` · `#/missions/:missionId`(기존 위에 얹음) · `#/academic(/:fieldId)` · `#/roles(/:roleId)`. Timeline은 없다.
**왕래**: 용어 → 선수학습·학문·미션 / 기술 지도 노드 → 선수학습·학문·미션 / 학문 → 기술 지도 / 글로서리 홈 → 대백과. 각 View 를 섬으로 두지 않는다.

Extension(0.4.2)은 `glossary.json`·`openbook-main-m01.json`·`term-map-links.json`만 복사하므로 **Encyclopedia의 영향을 받지 않는다.**

## 9. 다음 작업

알려진 결함은 전부 닫혔다. **CONTENT_OK 518 / 나머지 0.** 남은 것은 기계가 판정할 수 없는 것이다.

1. **Learner Readability & Comprehension Validation** — 다음 Cycle 의 주제다. 518개가 기준을 통과한다는 것과 **비전공·초심자가 읽고 이해한다**는 것은 다른 말이다. 지금까지의 QA 는 전부 내부 검사였다
2. 동결 map 의 learn-first reason **41건**은 map 출처로 남아 있다. 감사에서 `REASON_OK` 40건 + 판단해서 그대로 둔 `rbac` 1건이다. 고칠 필요가 생기면 `map-edge-corrections.json` 에 한 줄 더하면 된다
3. 남은 Owner Gate: **U8** · **U13** · **U14**(SRE 후보 5건) · **U15**(컴퓨터구조 후보 5건) · **U16** — 전부 `INDEPENDENT`
4. `remote -is_a-> remote` self-reference 1건은 U9 처리 그대로 유지

### 콘텐츠를 고칠 때의 규칙 (Recovery Cycle 에서 확정)

- **생성기를 다시 돌리지 않는다.** 9개 전부 잠겨 있고, 풀려면 `CODYSSEY_ALLOW_CONTENT_REGENERATION=1` 이 필요하다. 생성기 수정과 전면 재생성은 다른 일이다
- **마크다운을 고쳤으면 `npm run data:build`.** 안 하면 화면은 옛 글을 계속 보여 준다
- **`npm run content:integrity` 를 함께 돌린다.** 구조 validator 4종은 이 문제를 보지 못한다
- **고유하지 않은 것과 틀린 것을 구분한다.** 같은 템플릿을 썼다는 이유만으로 자동 rewrite 하지 않는다
- **자동 검사 뒤에 화면을 연다.** Recovery Cycle 의 마지막 결함 두 가지(본문과 모순되는 절, 재빌드 누락)와 Quality Cycle 의 가장 큰 결함(`왜 필요한가` 절이 아예 렌더링되지 않던 것)은 전부 브라우저에서 눈으로 찾았다
- **고쳤으면 그 절이 실제로 화면에 나오는지 확인한다.** 데이터에 들어갔다는 것과 학습자가 본다는 것은 다르다 (Quality Cycle 에서 확인)
- **`npm run content:specificity` 로 검토 후보를 고른다.** 결과는 판정이 아니다. 고유하다는 것이 구체적이라는 뜻은 아니다
- **화면으로 나가는 값과 원본을 구분한다.** 마크다운 백틱처럼 원본에서는 맞고 화면에서만 문제인 것은 빌드에서 다듬는다. 원본을 깎으면 되돌릴 수 없다 (Cleanup Cycle 에서 확정)
- **회차를 단정하려면 `source_status` 를 본다.** `direct` 만이 "회차가 요구한다" 를 뒷받침하고 `related` 는 확장 학습이다. 대조 결과는 `mission-claim-review.json` 에 남긴다

**하지 않을 것**: 새 ontology / enrichment cycle 자동 시작, 전면 재생성, canonical 정의 임의 변경, View 재설계.

## 10. 변경 금지 영역 (RC1 보호)

부수 효과로 **절대 수정하지 않는다.** 필요하면 Owner Gate.

- `data/curated/glossary-master-v0.1.yaml`, `content/terms/**`, `content/readme-term.md`, `content/peer-review/**`
- `data/knowledge-maps/**` (Atlas taxonomy·classification, 10개 field map, overlay, registry)
- `data/curated/concept-connections-v1.json`
- 기존 `src/data/generated/*` 의 스키마 (`encyclopedia-graph.json`은 신규라 예외)
- `extension/**`, `scripts/build_extension.py`, `scripts/package_extension.py`
- 기존 validator 4종의 통과 기준
- 과거 sprint report — 소급 수정 금지

**정정(Content Integrity Recovery Cycle)**: `content/**` 는 더 이상 '변경 0' 대상이 아니다. `glossary-rc1` tag 자체가 불변이면 되고, main 의 콘텐츠 개선은 Post-RC1 Content Maintenance 다. 다만 `content/terms` 를 고쳤다면 **`npm run content:integrity` 와 `npm run data:build` 를 반드시 함께** 돌린다.

검증: `git diff glossary-rc1 -- data/curated data/knowledge-maps extension` 이 비어 있어야 한다(`content` 는 제외).

## 11. 명령어

```bash
npm run encyclopedia:validate                   # 그래프 생성 + Quality Harness
python scripts/report_encyclopedia_impact.py    # Impact Review Gate (source 변경 후 필수)
npm run data:build                              # 전체 파이프라인 (encyclopedia 포함)
npm run content:integrity                       # 미션 문맥 모순 · 템플릿 재사용 (콘텐츠를 고쳤다면 필수)
npm run content:specificity                     # 이름을 가려도 남는 공유 문장 틀 (검토 후보, 판정 아님)
npm run content:quality                         # 518개 전수 분류 + 기준선 재생성
npm run content:map-reasons                     # 화면에 닿는 edge reason · 내부 표현 누출 검사
npm run data:build                              # 마크다운을 고쳤으면 반드시 — 안 하면 화면은 옛 글을 보여 준다
npm run encyclopedia:coverage                   # Review / Pre-Authoring / Final Path Coverage
npm run encyclopedia:coverage:freeze            # baseline artifact 재생성 (생성물)
npm run test && npm run build && npm run build:extension
python scripts/qa_playwright.py                 # Playwright (안전 포트 + 대상 앱 확인)
# 탐색 UX 를 바꿨다면 자동 테스트로 끝내지 말고 대표 Scenario 를 브라우저에서 직접 해 본다
```

**Encyclopedia source나 relation을 바꿨다면 Impact Gate를 반드시 실행한다.** 구조 validator는 의미 누수를 보지 못한다.

**Playwright는 반드시 이 명령으로 돌린다** — `python scripts/qa_playwright.py`

`npx playwright test` 를 그냥 돌리지 않는다. `playwright.config.ts`는 포트 4173에 `reuseExistingServer: true`라, 다른 프로젝트 dev 서버가 4173을 쓰고 있으면 **그 앱을 테스트하게 된다.** 실제로 그렇게 돈 적이 있다. 헬퍼는 안전한 포트를 고르고 → 서버를 직접 띄우고 → **그 서버가 이 저장소의 앱인지 확인한 뒤에만** 테스트를 돌린다(`webServer` 자체를 두지 않으므로 남의 서버를 잡을 경로가 없다). 저장소 설정은 바꾸지 않는다.

포트에 대해 알아 둘 것: `EACCES`는 점유가 아니라 **OS 예약 범위**일 수 있다. `netsh interface ipv4 show excludedportrange protocol=tcp`로 볼 수 있지만 그 목록이 전부가 아니다 — 6421·6733·7311·7642는 목록에 없으면서도 bind가 거부된다(Hyper-V 추정). **믿을 수 있는 판정은 실제 bind 시도뿐**이고 헬퍼가 그렇게 한다. 특정 포트를 쓰려면 `--port`, 포트만 확인하려면 `--check-only`.

## 12. 최근 관련 Git commit

| commit | 내용 |
| --- | --- |
| (Recovery) | 생성기 차단 · 79건 복구 · 273건 재판정 · F01/F02 — `git log --oneline a18e219..HEAD` |
| tag `glossary-content-integrity-v1` | 미션 문맥 모순 0 · 생성기 잠김 기준점 |
| (Exploration 01) | R12 감사 · 대백과 진입 화면 · cross-view 연결 — `git log --oneline b50ec6e..HEAD` |
| tag `encyclopedia-learning-baseline-v1` | `b50ec6e` — 학습 구조 판정 완료 기준점 |
| (Coverage Final) | 300개 전수 판정 · U18/FD-12 · R12 · baseline freeze — `git log --oneline 08f7f88..HEAD` |
| (Coverage 04) | U17 baseline · 판정 모델 · OS/보안/PF/DevOps 검토 — `git log --oneline 6c20e6e..HEAD` |
| (Enrichment 03) | DB·PF·SE·Network·Web 5개 Phase · projection 계층 · QA 포트 · 표시 문장 정리 — `git log --oneline 578fd4f..HEAD` |
| `578fd4f` | docs(encyclopedia): close data enrichment cycle 02 |
| (View Cycle 1) | build pipeline · impact gate · 4개 View · tests · report — `git log --oneline -10` |
| `fe942ac` | docs(encyclopedia): report expansion cycle 01 |
| (Expansion Cycle 1) | owner decisions · 4개 cluster 확장 |
| `538e1bb` | docs(encyclopedia): report foundation readiness |
| `5fa52b0` | feat(encyclopedia): implement pilot knowledge clusters |
| `091a593` | test(encyclopedia): add graph integrity harness |
| `21b42fd` | feat(encyclopedia): add knowledge data skeleton |
| `e3a8bd4` | docs(encyclopedia): validate foundation architecture |
| `2faf458` / `818b42e` | Sprint 0 Architecture Discovery |
| `64e7ad1` / tag `glossary-rc1` | RC1 동결 기준 |

## 13. 새 작업자가 먼저 읽어야 할 문서 순서

1. 이 문서
2. `07-foundation-decisions.md` — 무엇이 왜 확정됐는지
3. `06-agent-governance-model.md` — 어떤 절차로 바꾸는지
4. `01-current-architecture-audit.md` — 기존에 무엇이 있는지
5. `reports/knowledge-encyclopedia/sprint-02-pilot.md` — 가장 최근 실행 기록
6. `data/encyclopedia/README.md` — 실제 파일을 고치는 법
7. 필요 시 `02`~`05`, 기존 `docs/10`~`13`

---

## New Agent Start Here

새로운 Claude Code, Codex 또는 다른 작업자는 **이전 대화 기록 없이** 다음 순서만으로 작업을 이어갈 수 있다.

1. **`docs/knowledge-encyclopedia/00-project-status.md`** (이 문서) — 현재 Sprint, 확정/미확정, 변경 금지 영역.
2. **governance / foundation decision 문서** — `06-agent-governance-model.md`(작업 절차), `07-foundation-decisions.md`(확정 결정과 근거).
3. **현재 architecture 문서** — §7 표에서 작업에 해당하는 것. `01`은 기존 구조 사실, `02`는 모델, `04`는 view.
4. **가장 최근 report** — 현재는 `reports/knowledge-encyclopedia/expansion-cycle-01.md`.
5. **`git log --oneline -10`** — 문서와 실제 이력이 어긋나면 **git이 정답**이다.
6. **실제 관련 source** — `data/encyclopedia/`(authoring, README에 수정법 있음), `scripts/build_encyclopedia_graph.py`, `scripts/validate_encyclopedia.py`, `scripts/report_encyclopedia_impact.py`, `src/encyclopedia.ts`(View 공통 질의), `data/curated/`, `data/knowledge-maps/`.

작업 규칙:
- **§10 변경 금지 영역을 건드리지 않는다.** 필요하면 먼저 사용자 승인을 구한다.
- **§6 미확정 결정을 임의로 확정하지 않는다.** 선택지를 제시하고 묻는다.
- 새 데이터를 만들기 전에 **[06 §3의 5단계 판정](06-agent-governance-model.md)**을 거친다: 계산 가능한가 → 파생 가능한가 → metadata인가 → edge인가 → 그제서야 새 node.
- **신규 relation type을 만들지 않는다.** 기존 12종으로 표현되지 않으면 Owner Gate. Data Model이 STABLE 판정을 받았으므로 ontology/schema 변경은 기본 금지다.
- **경로를 만들 때** 대칭 relation에 기대지 않는다(EX-01). 방향 있는 근거가 없으면 Harness가 막는다.
- **cluster를 추가한 뒤** `python scripts/report_encyclopedia_impact.py`를 돌린다(EX-02). Harness는 구조만 보고 의미 누수는 못 잡는다.
- **View를 만들 때 데이터 모델을 바꾸지 않는다.** 화면에 필요한 값은 빌더 계산 필드로 만든다. 기존 구조로 표현할 수 없음이 입증된 경우에만 Architecture Review로 올린다.
- **그래프를 component에서 직접 순회하지 않는다.** `src/encyclopedia.ts`의 다섯 질의를 쓴다.
- Sprint를 마치면 **① architecture 문서 갱신 → ② sprint report 생성 → ③ 이 문서 갱신 → ④ git commit → ⑤ QA 후 push**.
- **과거 sprint report를 현재 상태에 맞춰 고치지 않는다.**
- 문서의 수치를 인용하기 전에 **실제 데이터로 재확인**한다. 문서는 작성 시점의 사실이다.
