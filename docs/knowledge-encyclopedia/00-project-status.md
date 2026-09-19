# 00. Knowledge Encyclopedia — Project Status

> **이 문서는 새 작업자(사람 또는 AI)가 가장 먼저 읽는 진입점이다.** 설계 본문이 아니라 "지금 어디까지 왔는가"만 담는다.
> 최종 갱신: **2026-09-19 / Sprint 0 완료 시점**
> 갱신 규칙: Knowledge Encyclopedia Sprint가 끝날 때마다 이 문서를 현재 상태로 덮어쓴다. 과거 기록은 `reports/knowledge-encyclopedia/`에 남기고 여기서는 지운다.

---

## 1. 프로젝트 목적

기존 **코디세이 기술용어 사전**(519 canonical, RC1 동결)을 핵심 데이터로 유지하면서,
`용어 → 설명` 중심 구조를 **기술 / 학문 / 미션 / 직무 / 개념의 흐름**으로 탐색 가능한 **Knowledge Encyclopedia**로 확장한다.

범위 주의: "CS 전체를 수록하는 백과사전"은 만들지 않는다(`docs/00_project_overview.md` §5). Encyclopedia는 **미션에 고정된 canonical 위에 얹는 탐색·연결 layer**다. 이 범위 선언의 README 반영은 아직 **미확정**(§6-U1).

## 2. Glossary RC1 기준 상태 (변경 없음)

| 항목 | 값 |
| --- | --- |
| Canonical / Detailed / Coverage | 519 / 519 / 100% |
| RC tag | `glossary-rc1` (`4e4075c`) |
| Web UI | 0.1.0 (`package.json`) |
| Chrome Extension | 0.4.2 (`extension/manifest.json`) |
| glossary validator | 519 canonical · 46 mission-local · **0 error / 0 warning** / 780 info |
| atlas validator | 12 field · 519 term · 16 mission — PASS |
| knowledge-map validator | 10 implemented map / 12 registry entry — PASS |
| content tier validator | 519 canonical · A 95 / B 247 / C 177 — PASS |

(2026-09-19 재실행하여 확인한 값이다.)

## 3. 현재 Sprint

**Sprint 0 — Architecture Discovery: 완료 (설계만, 구현 없음).**

- 한 일: 기존 저장소 전수 조사 → 중복 구조 탐지 → node/edge 모델 제안 → 미션·학문·기술·직무 매핑 → view 설계 → pilot 확정.
- **코드·데이터·콘텐츠 변경 0건.** 이 Sprint의 산출물은 `docs/knowledge-encyclopedia/` 5개 문서와 `reports/knowledge-encyclopedia/` 1개 보고서뿐이다.

## 4. 현재 작업 단계

```
[Sprint 0] 조사·설계        ✅ 완료 (문서)
[승인 대기] 소유자 결정 6건  ⬅ 지금 여기 (§6)
[Sprint 1]  데이터 골격 구현  ⬜ 미착수
[Sprint 2]  Pilot 3 cluster  ⬜ 미착수
[Sprint 3+] View 구현        ⬜ 미착수
```

**다음 행동이 막혀 있는 지점:** §6의 미확정 결정 중 U1·U2·U3은 Sprint 1을 시작하기 전에 소유자 판단이 필요하다.

## 5. 확정된 결정

Sprint 0에서 **데이터 근거로 확정**한 사항. 뒤집으려면 근거를 다시 제시해야 한다.

| # | 결정 | 근거 |
| --- | --- | --- |
| D1 | 기존 Technology Atlas 12 field를 **기술 분야 모델로 그대로 재사용**한다. 새 기술 taxonomy를 만들지 않는다 | `field-taxonomy.json`이 이미 authored SoT |
| D2 | 기존 map의 **relation ontology를 재사용**하고 **새 relation 타입을 만들지 않는다** | 요청 후보 9종이 기존 10종에 전부 흡수됨 (02 §4) |
| D3 | **ROLE은 node가 아니라 metadata/filter**다 | 직무 간 구조 관계 없음, term×role 태그는 유지 불가 (02 §7) |
| D4 | **LEARNING_PATH는 기본적으로 계산**한다. 저장하는 것은 "순서 + 서사"뿐이고, path의 인접 step은 edge 근거를 강제한다 | 이중 진실 방지 (02 §8) |
| D5 | `related`는 **파생 전용**이다. 새로 authoring하지 않는다 | `detailRelatedTerms` 1,324개가 이미 존재하며 filler 다수 (01 §5-A) |
| D6 | 미션↔term은 **master `mission_refs`에서만** 읽는다. 새 mission-term 목록을 만들지 않는다 | 이미 2곳에 동일 데이터 586쌍 (01 §5-D) |
| D7 | canonical에 없는 hub 개념은 **`foundation:<slug>` synthetic node**로 시작하고 canonical 승격은 `docs/13` 절차를 따른다 | map에 이미 14개 선례 (01 §3-C) |
| D8 | 신규 데이터는 `data/encyclopedia/` + 별도 generated 파일에 둔다. **`glossary.json`에 필드를 추가하지 않는다** | Extension 0.4.2 입력 계약 보호 (01 §3-F) |
| D9 | 정규 미션 ID는 **`main-m05` 형식**(atlas 표기)이며 표기를 새로 하나 더 만들지 않는다 | 현재 3종 혼재 (01 §3-E) |
| D10 | Pilot은 **3 cluster / canonical 40개(7.7%)**: Web·Backend 16, System·Process 14, Data·Redis 10 | 존재 검증 완료 (05 §2) |
| D11 | relation **방향 계약을 Encyclopedia가 명시 선언**한다(Frontend map 문구를 정본으로). 기존 map 파일은 수정하지 않는다 | ontology가 10개 파일에 복제·표류, 방향은 Frontend에만 (01 §3-C) |
| D12 | 학문 분류의 **override 비율을 pilot에서 측정**하고, 추정(15~25%)을 크게 넘으면 "Atlas 파생" 전략을 재검토한다 | 세 field에서만 47개 어긋남 (02 §5-3) |

## 6. 아직 미확정인 결정 (소유자 판단 필요)

| # | 쟁점 | 선택지 | 막는 것 |
| --- | --- | --- | --- |
| **U1** | "CS 백과사전을 만들지 않는다"는 기존 범위 선언과의 관계 | (a) Encyclopedia를 "미션 고정 탐색 layer"로 재정의하고 README/docs00 갱신 (b) 범위 확대를 명시적으로 승인 (c) 확장 보류 | 프로젝트 정체성. **Sprint 1 전 필요** |
| **U2** | 학문 14개 목록과 `prerequisiteFields` 순서 (03 §6) | 제안대로 / 수정 / 과목 가감 | `academic-fields.json`. **Sprint 1 전 필요** |
| **U3** | 미션별 academic primary·supporting 배정과 `studyNext` (03 §3, §4) | 제안대로 / 커리큘럼 소유자 수정 | `missions.json`. **Sprint 1 전 필요** |
| U4 | 미션 순서(`order`)가 예비 M01~03 → 본과정 M01~13 인가 | 확인 필요 | 미션 view 정렬 |
| U5 | prerequisite edge 4건 중 **2건**(`normalization → data-integrity`, `staging-area-git-add → commit`)이 방향 규약과 반대로 읽힘. 원인은 ontology가 10개 map에 복제되며 방향 문구가 Frontend에만 남은 것 (01 §3-C, §5-B) | 2건 수정 / 유지(+정의 보완) | prerequisite 대량 추가 전 |
| U6 | "실습에서 사용하는 term"을 `direct`로 근사할지, 별도 필드를 둘지 (03 §2 Q6) | 근사 / `practiceTermIds` 추가 | 미션 view 정확도 |
| U7 | 학문 지도를 기존 map canvas로 그릴지 트리/리스트로 그릴지 (04 V3) | Sprint 3에서 결정 | UI만 |
| U8 | `mission-term-map-v0.1.yaml` 중복 제거 여부 (01 §5-D) | 유지 / 통합 | RC 이후 정리 |

## 7. 생성된 주요 문서와 역할

| 문서 | 역할 | 상태 |
| --- | --- | --- |
| `docs/knowledge-encyclopedia/00-project-status.md` | **이 문서.** 현재 상태 / 인수인계 진입점 | 매 Sprint 갱신 |
| `docs/knowledge-encyclopedia/01-current-architecture-audit.md` | 기존 구조 전수 감사, 데이터 소유 지도, 중복 탐지, 갭 목록 | Sprint 0 기준 사실 |
| `docs/knowledge-encyclopedia/02-knowledge-model-proposal.md` | **핵심 설계.** node/edge/소유권/learning path/role/validator | PROPOSED |
| `docs/knowledge-encyclopedia/03-mission-academic-tech-mapping.md` | 16 미션 ↔ 학문 ↔ 기술 crosswalk, study-next | PROPOSED (`[data]`/`[proposal]` 구분 표기) |
| `docs/knowledge-encyclopedia/04-view-architecture.md` | view 8종이 어떤 데이터에서 나오는지 | PROPOSED |
| `docs/knowledge-encyclopedia/05-pilot-plan.md` | pilot 3 cluster, 산출물, **성공 판정 기준 E1~E10** | PROPOSED |
| `reports/knowledge-encyclopedia/sprint-00-architecture-discovery.md` | Sprint 0 실행 기록 | 이력(수정 금지) |

기존 문서 중 반드시 함께 읽을 것: `docs/10_technology_field_atlas_architecture.md`, `docs/11_knowledge_map_engine_architecture.md`, `docs/12_cross_field_layer_architecture.md`, `docs/13_canonical_term_selection_growth_policy_v1.md`.

## 8. 현재 architecture 요약

```
[ authored 원본 ]                         [ derived ]                [ 소비자 ]
glossary-master-v0.1.yaml (519) ─┐
content/terms/*.md (518)         ├─ build_web_data.py ─→ src/data/generated/glossary.json ─→ Web / Extension
mission_refs (586쌍)             ─┘                       missions.json
atlas/field-taxonomy.json (12) ──→ build_technology_field_atlas.py ─→ term-field-classification.json (519)
                                                                      mission-field-matrix.json (16)
knowledge-maps/<10 map>/knowledge-map.json  (node 251 / edge 241 / route 38)
  + overlays (18)                 ──→ map-registry.json ─→ #/maps/:mapId
concept-connections-v1.json (6)   ──→ #/connections
peer-review/main-m01-openbook.yaml ─→ openbook-main-m01.json ─→ Chrome Extension 0.4.2

[ Sprint 1에서 추가될 것 — 아직 없음 ]
data/encyclopedia/{academic-fields,missions,roles}.json + clusters/*.json
  ──→ build_encyclopedia_graph.py ──→ src/data/generated/encyclopedia-graph.json
```

핵심 수치: canonical 519 중 **map에 올라간 것 226(43.6%)**, prerequisite edge **4개**, evolved_from **2개**, 큐레이션 path(learningRoutes) **38개**, 미션 **16개**(예비 3 + 본과정 13).

주의: relation 어휘의 실제 원본은 map 파일이 아니라 `scripts/validate_knowledge_map.py`의 `RELATIONS` 상수(12종)다. 각 map은 그 일부를 재선언하며 문구가 서로 다르다 (01 §3-C).

## 9. 다음 작업

**Sprint 1 — Encyclopedia Data Skeleton** (U1~U3 승인 후 착수)
1. `data/encyclopedia/` 생성 + `README.md`(소유권 규칙 명시)
2. `academic-fields.json` 14개 — 학문 정의·`parent`·`prerequisiteFields`·Atlas crosswalk
3. `missions.json` 16개 — id/제목/order/academic/studyNext (**term 목록은 넣지 않는다**)
4. `roles.json` 10개 — field/academic 가중치 + `coverage`
5. `scripts/build_encyclopedia_graph.py` (읽기 전용 입력 → generated)
6. `scripts/validate_encyclopedia.py` (02 §9의 8개 검사)
7. cluster 없이도 빌드/검증이 통과하는 상태까지

**Sprint 2 — Pilot 3 cluster** → `05-pilot-plan.md`의 E1~E10으로 판정. 실패 시 모델 수정 후 재검증(확장 금지).

## 10. 변경 금지 영역 (RC1 보호)

아래는 Knowledge Encyclopedia 작업의 부수 효과로 **절대 수정하지 않는다.** 필요하면 별도 승인·별도 커밋.

- `data/curated/glossary-master-v0.1.yaml` — canonical 519
- `content/terms/**`, `content/readme-term.md`, `content/peer-review/**`
- `data/knowledge-maps/**` — Atlas taxonomy, classification, 10개 field map, overlay, registry
- `data/curated/concept-connections-v1.json`
- `src/data/generated/glossary.json` 등 기존 generated 파일의 **스키마**
- `extension/**`, `scripts/build_extension.py`, `scripts/package_extension.py` (Extension 0.4.2 계약)
- 기존 validator 4종의 통과 기준
- 과거 sprint report (`reports/**`) — 당시 기록으로 유지, 소급 수정 금지

검증: `git diff glossary-rc1 -- data/curated content/terms data/knowledge-maps src extension` 가 비어 있어야 한다.

## 11. 최근 관련 Git commit

| commit | 내용 |
| --- | --- |
| `818b42e` | **Sprint 0 산출물** — docs(ke): add knowledge encyclopedia sprint 0 architecture discovery (문서 7개, 소스 변경 0) |
| `64e7ad1` | docs(release): record glossary rc1 freeze |
| `b3437a4` | docs(glossary): prepare rc1 release |
| `c2e29bd` | docs(glossary): approve glossary release candidate |
| `8fd4b58` | fix(glossary): refine tier-aware maturity validation |
| `4e4075c` | tag `glossary-rc1` 대상 |

## 12. 새 작업자가 먼저 읽어야 할 문서 순서

1. 이 문서 (`00-project-status.md`)
2. `01-current-architecture-audit.md` — 지금 무엇이 있는지 (사실)
3. `02-knowledge-model-proposal.md` — 무엇을 만들 것인지 (설계)
4. 진행할 Sprint에 해당하는 문서 (`03` 미션/학문, `04` view, `05` pilot)
5. `reports/knowledge-encyclopedia/` 최신 sprint report
6. 기존 architecture: `docs/10`, `docs/11`, `docs/12`, `docs/13`

---

## New Agent Start Here

새로운 Claude Code, Codex 또는 다른 작업자는 **이전 대화 기록 없이** 다음 순서만으로 작업을 이어갈 수 있다.

1. **`docs/knowledge-encyclopedia/00-project-status.md`** (이 문서) — 현재 Sprint, 확정/미확정 결정, 변경 금지 영역을 먼저 파악한다.
2. **현재 Sprint와 관련된 architecture 문서** — §7 표에서 해당 문서를 찾아 읽는다. `02`는 어느 Sprint든 필독이다.
3. **가장 최근 Sprint report** — `reports/knowledge-encyclopedia/`에서 번호가 가장 큰 파일. 실제로 무엇을 했고 무엇이 남았는지.
4. **`git log --oneline -10`** — 문서와 실제 변경 이력이 어긋나면 **git이 정답**이다.
5. **실제 관련 source** — `data/curated/`, `data/knowledge-maps/`, `data/encyclopedia/`(Sprint 1 이후), `scripts/`, `src/data/generated/`.

작업 중 지켜야 할 것:
- **§10 변경 금지 영역을 건드리지 않는다.** 필요하면 먼저 사용자에게 승인을 구한다.
- **§6 미확정 결정을 임의로 확정하지 않는다.** 판단이 필요하면 선택지를 제시하고 묻는다.
- Sprint를 마치면 **① architecture 문서 갱신 → ② sprint report 생성 → ③ 이 문서 갱신 → ④ git commit → ⑤ QA 후 push** 순서를 따른다.
- **과거 sprint report를 현재 상태에 맞춰 고치지 않는다.** 당시 기록으로 유지한다.
- 문서의 수치를 인용하기 전에 **실제 데이터로 재확인**한다. 문서는 작성 시점의 사실이다.
