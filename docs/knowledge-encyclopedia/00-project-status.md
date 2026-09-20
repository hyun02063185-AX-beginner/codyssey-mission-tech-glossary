# 00. Knowledge Encyclopedia — Project Status

> **이 문서는 새 작업자(사람 또는 AI)가 가장 먼저 읽는 진입점이다.** 설계 본문이 아니라 "지금 어디까지 왔는가"만 담는다.
> 최종 갱신: **2026-09-20 / Data Enrichment Cycle 02 완료 시점**
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
| RC tag | `glossary-rc1` (`4e4075c`) |
| Web UI / Chrome Extension | 0.1.0 / 0.4.2 |
| glossary validator | 519 · 46 mission-local · **0 error / 0 warning** · 780 info |
| atlas / knowledge-map / content-tier | 전부 PASS |
| unit / build / extension / Playwright | 31 tests PASS / PASS / PASS / 5-5 PASS |
| RC1 diff | `data/curated`, `content`, `data/knowledge-maps`, `extension`, Extension 입력 3파일 **변경 0** |

## 3. 현재 Sprint

**Data Enrichment Cycle 02 완료** — Web / AI / DevOps / Security 학습 구조 확장 + Computer Architecture 감사.

판정: **ENCYCLOPEDIA_DATA_ENRICHMENT_02_READY**
- **Data Model 동결 유지** — 새 node/relation type 0, foundation 3 그대로, taxonomy 변경 0
- **학습 경로 73 → 93**, 선수 관계 보유 term **116 → 149**, cluster 10 → 15
- **경로가 0이던 학문이 사라졌다** (AI 0→4, devops 0→2, web-programming 1→8)
- **Learning Coverage 도입**: 우선 학습 term 300개 중 106개(**35.3%**)가 선수 경로를 가진다. 분모는 기존 파생 데이터에서만 만들었다(수동 flag 0)
- Security는 공격 개념을 선수 관계 출발점으로 쓰지 않았고, 전 미션 전수 확인 결과 역전파 **0건**
- Computer Architecture는 확장이 아니라 감사였다 — 매핑 문제 2건만 교정(4→6), canonical은 추가하지 않고 후보 5건 등록
- Global Contract **2개 추가**, unexpected 전파 최종 **0**

이전 판정 4건(`FOUNDATION_READY`, `DATA_MODEL_STABLE`, `VIEWS_V1_READY`, `ENRICHMENT_01_READY`)은 이 판정에 포함된다. baseline tag: **`encyclopedia-views-v1`**.

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
[다음]       Enrichment 03              ⬜ 미착수  ⬅ 지금 여기
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

## 6. 아직 미확정인 결정 (Owner 판단 필요)

| # | 쟁점 | 왜 남겼나 |
| --- | --- | --- |
| U8 | `mission-term-map-v0.1.yaml` 중복 | Encyclopedia는 master만 읽어 영향 없음 |
| U13 | 축약 한국어 표기(`MEM`·`CPU`·`OOM`·`session`)가 화면에 그대로 노출 | RC1 콘텐츠 영역이라 표시만 함. `upstream-registry.json` R11 |
| U14 | **SRE canonical 후보 5건**(SLO/SLI, error budget, incident·postmortem, availability target, toil) | 현재 미션이 요구하지 않아 추가하지 않음. `docs/13`의 Candidate register, 승격은 Owner Gate |
| U15 | **Computer Architecture canonical 후보 5건**(register, instruction/ISA, memory hierarchy, pipeline, virtual memory) | 매핑으로 해결되는 2건은 이미 교정. 나머지는 미션이 요구하지 않음. `docs/13` 등록, Owner Gate |
| U16 | **devops map의 `provided_by` 3건이 방향 계약과 반대** | 동결 영역. `upstream-registry.json` EX02. 선수 학습 계산에 영향 없어 그대로 두고 Encyclopedia 층에서 별도 based_on 작성 |

U5·U9·U10은 Expansion Cycle 1에서, **U7·U11·U12는 View Cycle에서** 해결됐다. U7은 학문 지도를 canvas가 아닌 카드/목록으로 확정했고, U11은 노출 기준을 데이터 분포에서 도출했으며, U12는 `DEFERRED_FOR_DATA_READINESS`로 확정하고 readiness 기준을 [08](08-view-contracts.md)에 적었다.

upstream 원본 수정은 여전히 Owner Gate이며 `data/encyclopedia/upstream-registry.json`에 4건이 대기 중이다.

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
| **`07-foundation-decisions.md`** | ADR — 확정 결정과 근거·기각안·변경비용 | ACCEPTED |
| **`08-view-contracts.md`** | 4개 View 계약, 학문/직무 노출 정책, 빌드 파이프라인, Impact Gate, Timeline readiness | ACTIVE |
| `docs/13_canonical_term_selection_growth_policy_v1.md` | canonical 성장 정책 + **SRE 후보 register**(Owner Gate) | 기존 문서에 추가 |
| `reports/knowledge-encyclopedia/sprint-00~02*.md` | Sprint별 실행 기록 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/expansion-cycle-01.md`** | 4개 영역 확장 기록, override 측정, Governance 평가 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/view-implementation-cycle-01.md`** | View 4종 구현, 노출 정책 도출, Impact Gate 검증 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/data-enrichment-cycle-01.md`** | 학문 매핑 판정, SRE 정책, 선수학습 4 batch, 계약 테스트 발견 | 이력(수정 금지) |
| **`reports/knowledge-encyclopedia/data-enrichment-cycle-02.md`** | Web·AI·DevOps·Security 확장, CA 감사, Learning Coverage 도입 | 이력(수정 금지) |
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
knowledge-maps/<10 map> (node 251/edge 241/route 38) clusters/*.json        cluster 7
                                                   upstream-registry.json   defect 4
                    │                                        │
                    └──────────┬─────────────────────────────┘
                     scripts/build_encyclopedia_graph.py   (읽기 전용 입력, 결정적 출력)
                               ↓
                 src/data/generated/encyclopedia-graph.json  (771 KB, 손으로 고치지 않음)
                               ↓
                 scripts/validate_encyclopedia.py  (Quality Harness)
                 scripts/report_encyclopedia_impact.py  (Impact Review Gate)
                               ↓
                 src/encyclopedia.ts  (공통 query layer — View는 이것만 쓴다)
                               ↓
      Prerequisite · Mission · Academic · Role View  (lazy, HashRouter)
```

**그래프 현황**: node 578(term 519 · foundation 17 · mission 16 · academic 14 · field 12) · authored edge 375(map 240 + cluster 135) · derived 2,872 · path 93 · academic override 40 · 제외된 upstream self-reference 1.
**Learning Coverage**: 우선 학습 term 300개 중 **106개(35.3%)**가 선수 경로 보유. 선수 관계 보유 term 149 / 519.
**cluster 15개**: (pilot) web-backend · data-redis · system-process / (Expansion 1) programming-foundations · database-m11 · git-software-engineering · security-m13 / (Enrich 1) algorithms-m09-m10 · cloud-m05 · os-m07 / (Enrich 2) web-frontend-m01-m02 · ai-m06-pm03 · devops-deploy-pm01-m05 · security-m05-m07-m13 · computer-architecture-audit.
**노출 상태**: 학문 **active 13** / declared 1(sre) · 직무 active 8 / limited 2(qa-engineer, site-reliability-engineer).
**View route**: `#/prerequisites(/:termId)` · `#/missions/:missionId`(기존 위에 얹음) · `#/academic(/:fieldId)` · `#/roles(/:roleId)`. Timeline은 없다.

Extension(0.4.2)은 `glossary.json`·`openbook-main-m01.json`·`term-map-links.json`만 복사하므로 **Encyclopedia의 영향을 받지 않는다.**

## 9. 다음 작업

**Data Enrichment Cycle 03** — Learning Coverage 분포가 우선순위를 말해 준다. 수록이 많은데 비율이 낮은 영역이 먼저다.

1. **database-systems** — 우선 49개 중 13개(**27%**). 수록량 대비 공백이 가장 크다. M11의 제약·인덱스·트랜잭션 세부
2. **programming-fundamentals** — 44개 중 11개(**25%**). 예외·모듈·제너레이터 계열이 고립돼 있다
3. **software-engineering** — 36개 중 10개(**28%**). Git 흐름은 덮였고 설계 원칙(계층·관심사 분리·의존성 주입)이 비어 있다
4. **computer-networks** — 14개 중 4개(**29%**). 주소·전송 계층이 얕다
5. **web-programming** — 39%로 개선됐지만 절대 수(54)가 가장 크다

매 batch마다 **Impact Gate + Global Contract Test를 함께** 돌린다. 앞은 이번 변경의 영향을, 뒤는 과거부터 있던 위반을 본다.

**하지 않을 것**: 519개 일괄 enrichment, SRE 활성화를 위한 canonical 추가, Timeline 숫자 채우기, 노출 기준 완화, 근거 없는 ontology 변경.

**하지 않을 것**: 519개 일괄 enrichment, 전체 학문 수작업 보정, 전체 prerequisite graph, Atlas 293 coverage 해결, canonical 대량 추가, **근거 없는 ontology/schema 변경**(Data Model은 동결이다).

## 10. 변경 금지 영역 (RC1 보호)

부수 효과로 **절대 수정하지 않는다.** 필요하면 Owner Gate.

- `data/curated/glossary-master-v0.1.yaml`, `content/terms/**`, `content/readme-term.md`, `content/peer-review/**`
- `data/knowledge-maps/**` (Atlas taxonomy·classification, 10개 field map, overlay, registry)
- `data/curated/concept-connections-v1.json`
- 기존 `src/data/generated/*` 의 스키마 (`encyclopedia-graph.json`은 신규라 예외)
- `extension/**`, `scripts/build_extension.py`, `scripts/package_extension.py`
- 기존 validator 4종의 통과 기준
- 과거 sprint report — 소급 수정 금지

검증: `git diff glossary-rc1 -- data/curated content data/knowledge-maps extension` 이 비어 있어야 한다.

## 11. 명령어

```bash
npm run encyclopedia:validate                   # 그래프 생성 + Quality Harness
python scripts/report_encyclopedia_impact.py    # Impact Review Gate (source 변경 후 필수)
npm run data:build                              # 전체 파이프라인 (encyclopedia 포함)
npm run test && npm run build && npm run build:extension
```

**Encyclopedia source나 relation을 바꿨다면 Impact Gate를 반드시 실행한다.** 구조 validator는 의미 누수를 보지 못한다.

**Playwright 주의 (Known Environment Issue)**: `playwright.config.ts`는 포트 4173에 `reuseExistingServer: true`다. 다른 프로젝트 dev 서버가 4173을 쓰고 있으면 **그 앱을 테스트하게 된다**(증상: 페이지 제목이 이 프로젝트가 아님). 임시 config로 빈 포트를 지정해 돌린다. 단 Windows 예약 포트 범위를 피해야 한다 — `netsh interface ipv4 show excludedportrange protocol=tcp`로 확인하고 그 밖의 포트를 고른다(예: 6421). 범위는 세션마다 달라져 어제 되던 포트가 오늘 `EACCES`가 날 수 있다. **저장소 설정은 바꾸지 않는다.**

## 12. 최근 관련 Git commit

| commit | 내용 |
| --- | --- |
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
