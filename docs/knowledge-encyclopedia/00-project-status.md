# 00. Knowledge Encyclopedia — Project Status

> **이 문서는 새 작업자(사람 또는 AI)가 가장 먼저 읽는 진입점이다.** 설계 본문이 아니라 "지금 어디까지 왔는가"만 담는다.
> 최종 갱신: **2026-09-19 / Foundation Cycle 완료 시점**
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

**Foundation Cycle 완료** — Sprint 00b(Foundation Review) + Sprint 01(Data Skeleton) + Sprint 02(Pilot).

판정: **KNOWLEDGE_ENCYCLOPEDIA_FOUNDATION_READY**
- Sprint 0 핵심 결정 교차검증 완료(오판 2건 정정), Governance 확정, Knowledge Model·데이터 소유·Mission ID·학문 구조·Foundation 경계·Relation SSOT 확정
- Data Skeleton + Builder + Validator 구현, Pilot 3 cluster 구현, **E1~E10 전부 PASS**, RC1 회귀 없음

## 4. 현재 작업 단계

```
[Sprint 0]   조사·설계                 ✅ 완료
[Sprint 00b] Foundation Review         ✅ 완료 (VALID)
[Sprint 01]  Data Skeleton             ✅ 완료 (Gate PASS)
[Sprint 02]  Pilot 3 cluster           ✅ 완료 (E1~E10 PASS)
[다음]       cluster 확장              ⬜ 미착수  ⬅ 지금 여기
[이후]       View 구현(V3~V7)          ⬜ 미착수
```

Foundation이 READY이므로 **다음 작업은 소유자 승인 없이 시작 가능**하다. 단 §6의 Owner 판단 3건은 별도로 남아 있다.

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

## 6. 아직 미확정인 결정 (Owner 판단 필요)

| # | 쟁점 | 왜 남겼나 |
| --- | --- | --- |
| **U5** | prerequisite edge 2건이 방향 규약과 반대로 읽힘 (`normalization → data-integrity`, `staging-area-git-add → commit`) | 두 건 모두 **동결된 map 파일** 소속. 수정은 Owner Gate |
| **U9** | **UPSTREAM 결함**: `term:remote is_a term:remote` (git-collaboration map의 self-reference). 기존 validator에 self 검사가 없어 RC1 QA를 통과했다 | 동결 영역. harness가 경고로 계속 노출 |
| **U10** | `encyclopedia:build`를 `npm run data:build`에 포함할지 | 포함하면 그래프가 항상 최신이지만 RC1 빌드 파이프라인 동작이 바뀐다 |
| U7 | 학문 지도 UI 형태 | View Sprint에서 결정 |
| U8 | `mission-term-map-v0.1.yaml` 중복 | Encyclopedia는 master만 읽어 영향 없음 |

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
| `reports/knowledge-encyclopedia/sprint-00~02*.md` | Sprint별 실행 기록 | 이력(수정 금지) |

기존 문서 중 함께 읽을 것: `docs/10`(Atlas), `docs/11`(map engine), `docs/12`(cross-field layer), `docs/13`(canonical 성장 정책).

## 8. 현재 architecture 요약

```
[ 기존 authored (읽기 전용) ]                    [ Encyclopedia authored ]
glossary-master-v0.1.yaml (519)                  data/encyclopedia/
content/terms/*.md (518)                           relation-ontology.json   의미 12종
atlas/field-taxonomy.json (12 field)               academic-fields.json     학문 14 + crosswalk
atlas/term-field-classification.json (519)         missions.json            미션 16
atlas/mission-map-routing.json (16)                roles.json               직무 10
knowledge-maps/<10 map> (node 251/edge 241/route 38) clusters/*.json        pilot 3
                    │                                        │
                    └──────────┬─────────────────────────────┘
                     scripts/build_encyclopedia_graph.py   (읽기 전용 입력, 결정적 출력)
                               ↓
                 src/data/generated/encyclopedia-graph.json  (731 KB, 손으로 고치지 않음)
                               ↓
                 scripts/validate_encyclopedia.py  (Quality Harness)
```

**그래프 현황**: node 578(term 519 · foundation 17 · mission 16 · academic 14 · field 12) · authored edge 267(map 241 + cluster 26) · derived 2,848 · path 45 · academic override 5.
**학문 커버리지**: populated 10 · sparse 2(algorithms 1, computer-architecture 1) · **declared 2(cloud-computing 0, sre 0)** — 빈 학문은 숨기지 않는다.

Extension(0.4.2)은 `glossary.json`·`openbook-main-m01.json`·`term-map-links.json`만 복사하므로 **Encyclopedia의 영향을 받지 않는다.**

## 9. 다음 작업

**cluster 확장** (Foundation 재검증 불필요, 바로 진행 가능)
1. `programming-foundations`를 포함하는 cluster를 **우선** 만든다 — pilot 표본이 crosswalk가 깨끗한 field에 치우쳐 override 비율이 낙관적으로 나왔다(12.5%). 이 field는 35%가 override 대상으로 추정되므로 재측정이 필요하다.
2. 이어서 Database/M11(단일 field·38 term) → Git·SWE/M04+M10 → Security/M13.
3. cluster마다 override 비율과 신규 edge 수를 report에 기록한다.
4. View(V3~V7)는 그 다음이다. 지금은 CLI 질의로 검증 가능하다.

**하지 않을 것**: 519개 전체 metadata 확장, 전체 학문 수작업 보정, 전체 prerequisite graph, Atlas 293 coverage 해결, canonical 대량 추가.

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
python scripts/build_encyclopedia_graph.py      # 그래프 생성 (결정적)
python scripts/validate_encyclopedia.py         # Quality Harness
npm run encyclopedia:validate                   # 위 둘을 한 번에
npm run test && npm run build && npm run build:extension
```

**Playwright 주의**: `playwright.config.ts`는 포트 4173에 `reuseExistingServer: true`다. 다른 프로젝트 dev 서버가 4173을 쓰고 있으면 전부 실패한다(증상: 페이지 제목이 이 프로젝트가 아님). 빈 포트로 임시 config를 만들어 돌리면 5/5 통과한다. 저장소 설정은 바꾸지 않았다.

## 12. 최근 관련 Git commit

| commit | 내용 |
| --- | --- |
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
4. **가장 최근 Sprint report** — `reports/knowledge-encyclopedia/`에서 번호가 가장 큰 파일.
5. **`git log --oneline -10`** — 문서와 실제 이력이 어긋나면 **git이 정답**이다.
6. **실제 관련 source** — `data/encyclopedia/`(authoring, README에 수정법 있음), `scripts/build_encyclopedia_graph.py`, `scripts/validate_encyclopedia.py`, `data/curated/`, `data/knowledge-maps/`.

작업 규칙:
- **§10 변경 금지 영역을 건드리지 않는다.** 필요하면 먼저 사용자 승인을 구한다.
- **§6 미확정 결정을 임의로 확정하지 않는다.** 선택지를 제시하고 묻는다.
- 새 데이터를 만들기 전에 **[06 §3의 5단계 판정](06-agent-governance-model.md)**을 거친다: 계산 가능한가 → 파생 가능한가 → metadata인가 → edge인가 → 그제서야 새 node.
- **신규 relation type을 만들지 않는다.** 기존 12종으로 표현되지 않으면 Owner Gate.
- Sprint를 마치면 **① architecture 문서 갱신 → ② sprint report 생성 → ③ 이 문서 갱신 → ④ git commit → ⑤ QA 후 push**.
- **과거 sprint report를 현재 상태에 맞춰 고치지 않는다.**
- 문서의 수치를 인용하기 전에 **실제 데이터로 재확인**한다. 문서는 작성 시점의 사실이다.
