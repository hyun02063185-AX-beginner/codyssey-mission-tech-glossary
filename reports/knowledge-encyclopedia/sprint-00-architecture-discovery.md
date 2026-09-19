# Sprint 00 — Knowledge Encyclopedia Architecture Discovery

- 수행일: **2026-09-19**
- 기준 commit: `64e7ad1` (`main`), tag `glossary-rc1` (`4e4075c`)
- 성격: **조사·설계 전용 Sprint.** 기능 구현 없음, 기존 데이터 변경 없음
- 이 보고서는 **당시 기록**이다. 이후 상태가 바뀌어도 소급 수정하지 않는다. 현재 상태는 `docs/knowledge-encyclopedia/00-project-status.md`를 본다.

---

## 1. 시작 상태

| 항목 | 값 |
| --- | --- |
| Canonical / Detailed / Coverage | 519 / 519 / 100% |
| RC tag | `glossary-rc1` |
| Web UI / Chrome Extension | 0.1.0 / 0.4.2 |
| 작업 트리 | clean (`git status` 확인) |
| 로컬-원격 동기화 | `main` == `origin/main` == `64e7ad1` (fetch 후 확인, 0 ahead / 0 behind) |
| 기존 QA | 전체 PASS |

작업 착수 전 사용자 요청으로 저장소 최신 여부를 먼저 확인했다. `git fetch --all --tags` 결과 로컬이 최신이었고 추가 다운로드는 필요하지 않았다.

## 2. 조사한 기존 구조

요청서 §3의 항목을 모두 조사했다. 조사는 파일 읽기와 Python 집계로 수행했으며, 문서에 적힌 수치가 아니라 **실제 데이터를 다시 세어** 기록했다.

| 대상 | 조사 결과 위치 |
| --- | --- |
| canonical glossary source | `data/curated/glossary-master-v0.1.yaml` (519) |
| term content source | `content/terms/*.md` (518) + `content/readme-term.md` |
| generated glossary | `src/data/generated/glossary.json` (868 KB, 25 필드) |
| Technology Atlas data | `data/knowledge-maps/atlas/` 4파일 (taxonomy 12 field, classification 519) |
| Knowledge Map data | 10 field map (node 251 / edge 241 / route 38) + overlay 18 |
| Concept Connection data | `data/curated/concept-connections-v1.json` (6, 전부 M01/M02) |
| Mission 관련 data | master `mission_refs` 586쌍, `mission-term-map`(동일 586), `mission-map-routing`, `mission-field-matrix`, raw manifest |
| Open-book data | `content/peer-review/main-m01-openbook.yaml` (23 quick term) |
| Extension data generation | `scripts/build_extension.py` (glossary/openbook/term-map-links + publicWebLinks) |
| search index | `src/searchTerms.ts` (이름·별칭 매칭, facet 없음) |
| routing | HashRouter 11개 경로 |
| graph/map engine | `TechnologyFieldMap.tsx` + `knowledgeMapLoader.ts` (field별 분기 없음) |
| validator | glossary / atlas / knowledge-map / content-tier 4종 |
| review metadata | `data/reviews/` 18파일 (tier A95·B247·C177 등) |

유사 문서 조사: `docs/09~13`을 확인했다. "mission mapping", "concept connection architecture"라는 이름의 설계 문서는 **없었고**, Concept Connection은 구현 보고서(`reports/knowledge-map/concept-connection-v1-implementation.md`)만 존재했다.

## 3. 발견 사항

### F1. 그래프 인프라는 이미 있다 (예상보다 성숙)
- relation ontology 12종이 선언되어 있고 10종이 실제 사용 중이다: `interacts_with` 75, `uses` 71, `based_on` 31, `provided_by` 20, `is_a` 18, `compare_with` 15, `prerequisite` 4, `defined_by` 3, `cs_foundation` 2, `evolved_from` 2.
- edge마다 `reason` / `confidence` / `evidenceType` / `source(URL)`가 필수다. 근거 추적이 이미 강제되고 있다.
- `learningRoutes` 38개(길이 3~8)는 사실상 Learning Path의 원형이다.
- → **요청서의 관계 후보 9종 중 새로 만들어야 하는 것은 0개**라는 결론의 근거.

### F2. 요청서 후보 중 이미 있는 것과 없는 것이 갈린다
- `EVOLVES_TO`는 `evolved_from`으로 이미 존재하며, 정의문에 "단순 시간 순서가 아니다 / 단일 인과를 주장하지 않는다"가 명시돼 있어 요청서 E(발전 흐름)의 의도와 정확히 일치한다.
- 반면 **`prerequisite`는 241개 edge 중 4개**뿐이다. 즉 "선수학습"은 구조는 있으나 **데이터가 비어 있다**. 이것이 Encyclopedia의 실제 작업량 대부분이다.

### F3. relation이 5곳에 흩어져 있다
map edge(241) / master `related_terms`(94) / `detailRelatedTerms`(1,324) / concept-connection diagram / `comparisons`(5).
- `detailRelatedTerms`의 undirected pair 1,096개와 map의 term pair 216개를 비교하니 **겹치는 것은 117개**, map에만 있는 것이 99개였다. 서로 포함 관계가 아니다.
- `detailRelatedTerms`에는 filler가 많다. Linux/프로세스 영역 17개 term이 모두 `['process','linux']`를 가리킨다.
- → `related`를 새로 authoring하면 순수 중복이라는 판단(D5)의 근거.

### F4. `mission-term-map-v0.1.yaml`은 master의 완전한 복제본
586쌍 대 586쌍, 차집합 0. 빌더가 둘을 각각 읽어 서로 다른 generated 파일을 만든다. 현재 일치하지만 **원본이 둘**이다. (RC1 보호를 위해 이번에 정리하지 않고 U8로 기록.)

### F5. 미션 메타데이터가 없다
- 미션 제목은 `data/raw/**/source-manifest.md`에만 있고, UI는 `'main-'`을 `'본과정 '`으로 문자열 치환해 라벨을 만든다.
- 미션 ID 표기가 3종(`main/M01`, `main-m01`, 본문의 `M01`)이다.
- → 미션 view의 7개 질문 중 "제목·순서·다음 학습"은 데이터 자체가 없어 답할 수 없었다.

### F6. 학문 축이 없고, Atlas field는 학문과 기술이 섞여 있다
- Atlas 12 field 중 algorithms-data-structures / network-web-protocol / systems-runtime / ai-ml-computing은 학문에 가깝고, frontend / backend / devops는 기술 스택이다.
- `algorithms-data-structures` 한 field가 **자료구조와 알고리즘 두 과목**에 대응하고, `devops-infrastructure`가 **Cloud와 DevOps 두 영역**에 대응한다 → term 단위 분할이 필요하다.
- Computer Architecture에 대응하는 field가 아예 없다.

### F7. 상위 hub 개념이 canonical에 없다
`client`, `server`, `api`, `backend`, `database`, `operating system`, `memory`, `data structure`, `hash table`, `key-value store`, `network`, `cloud`, `devops`, `SRE`, `CI/CD`, `test` — **전부 exact match 0**이다. 미션 어휘에서 출발한 사전이라 "상위 개념"이 비어 있다.
단, map에 `foundation:*` synthetic node 14개(ECMAScript, Web Platform, Request/Response 등)라는 **선례**가 이미 있다.

### F8. 도메인 공백이 직무/학문 view의 한계를 만든다
QA/test·CI-CD·Kubernetes 관련 canonical 0개, SRE는 observability·health-check·root-cause-analysis·logging 정도, Computer Architecture는 5개 남짓. → Role view에서 QA·SRE는 low coverage로 정직하게 표기해야 한다.

### F9. Atlas 커버리지
canonical 519 중 map에 올라간 것은 **226(43.6%)**. 293개는 어느 map에도 없다(validator의 `atlas_coverage_gap` INFO 293과 일치). 2개 이상 map에 등장하는 term은 9개뿐이다.

### F10. relation ontology가 10개 파일에 복제·표류하고 있고, 그 결과 방향이 흔들린다
(Opus 재검증에서 새로 발견 — 초기 조사에서는 "edge 1건의 방향 문제"로만 보였다.)
- relation 어휘의 실제 원본은 map 파일이 아니라 **`validate_knowledge_map.py`의 `RELATIONS` 상수(12종)**다. 각 `knowledge-map.json`은 그 일부를 **자기 파일에 다시 선언**한다.
- **Frontend만 12종 전부를, 유일하게 방향이 명시된 문구로** 선언한다("B를 먼저 이해하면 A를 이해하기 좋다"). 나머지 9개 map은 7종만, **방향이 빠진 축약 문구**로 선언한다("먼저 이해하면 좋다."). `compare_with`는 문구가 4가지, `provided_by`는 3가지로 갈린다.
- `cs_foundation`·`defined_by`·`evolved_from`·`enabled_by`·`mission_uses`는 Frontend에만 선언돼 있으나 validator는 모든 map에서 허용한다(현재 미선언 relation 사용 0건 — 확인함).
- **결과:** prerequisite edge 4건 중 2건(`normalization → data-integrity`, `staging-area-git-add → commit`)이 Frontend 정의와 **반대로 읽힌다**. 두 건 모두 방향 정의가 없는 map 소속이다. 개별 실수가 아니라 구조적 원인이 있다.
- **설계 반영:** Encyclopedia는 어휘를 validator의 12종에서 빌려 쓰되 **방향 계약을 자기 쪽(`data/encyclopedia/README.md`)에 명시적으로 선언**한다. 기존 10개 map 파일은 변경 금지 영역이므로 건드리지 않는다 (02 §4-1의 방향 표).

### F12. 학문 축의 실제 비용은 "예외 override"이고, 그 양이 적지 않다
(Opus 재검증에서 정량화.) Atlas field를 학문으로 그대로 번역할 수 없는 term을 세어 보았다.
- `programming-foundations`(80)는 사실상 혼합 field다: OS/동시성 8(mutex, race-condition, deadlock, lock, call-stack, event-loop, locality, memory-accounting), 컴퓨터구조/수치 4(cpu-architecture, ieee-754, floating-point, epsilon), 소프트웨어공학·운영 16(layered-architecture, mvc, repository-pattern, dependency-injection, logging, observability, root-cause-analysis …) → **28/80 = 35%가 override 대상**.
- `data-database`(67) 중 10개는 데이터 형식/처리(csv, json, json-lines, encoding, utf-8, serialization, streaming …)로 database-systems가 아니다.
- `devops-infrastructure`(31) 중 9개는 cloud-computing(amazon-*, cloud-region, github-pages, netlify, vercel, render, railway)이다.
- 세 field만 합쳐 **47개**. 전체로는 15~25% 규모로 추정된다. → "Atlas에서 파생 + 예외만 override" 전략이 성립하는지는 **pilot에서 실측해야 할 가설**이며, 판정 기준 E10에 override 비율 보고를 포함시켰다(R8).

### F11. 범위 선언 충돌
`README.md`와 `docs/00_project_overview.md` §5는 "컴퓨터 과학 전체를 포괄하는 백과사전을 만들기 위한 것이 아니다"라고 명시한다. "Knowledge Encyclopedia"라는 이름의 확장은 이 문장과 긴장 관계에 있다 → U1로 상신.

## 4. 생성/수정 문서

**생성 (6개)**

| 파일 | 내용 |
| --- | --- |
| `docs/knowledge-encyclopedia/00-project-status.md` | 인수인계 진입점 / 현재 상태 |
| `docs/knowledge-encyclopedia/01-current-architecture-audit.md` | 전수 감사, 데이터 소유 지도, 중복 탐지, 갭 G1~G9 |
| `docs/knowledge-encyclopedia/02-knowledge-model-proposal.md` | node/edge/소유권/path/role/validator 설계 |
| `docs/knowledge-encyclopedia/03-mission-academic-tech-mapping.md` | 16 미션 ↔ 학문 ↔ 기술 crosswalk |
| `docs/knowledge-encyclopedia/04-view-architecture.md` | view 8종의 데이터 출처 |
| `docs/knowledge-encyclopedia/05-pilot-plan.md` | pilot 3 cluster + 판정 기준 E1~E10 |
| `reports/knowledge-encyclopedia/sprint-00-architecture-discovery.md` | 이 보고서 |

**수정: 없음.** canonical, 콘텐츠, Atlas, map, 스크립트, Web, Extension 어느 것도 변경하지 않았다.

## 5. 주요 설계 제안

### Node — 5종 (새로 authoring 하는 것은 3종)
`term:*`(519, 기존) / `foundation:*`(hub, 기존 선례 재사용) / `academic:*`(≈14, 신규) / `mission:*`(16, 신규) / `field:*`(Atlas에서 **파생**, authoring 없음).
`ROLE`과 `LEARNING_PATH`는 node로 만들지 않는다.

### Edge — 신규 타입 0개
요청 후보 9종의 처리:

| 후보 | 처리 |
| --- | --- |
| PREREQUISITE | `prerequisite` 재사용 (데이터 확충이 핵심 작업) |
| RELATED | `detailRelatedTerms`에서 **파생**, authoring 금지 |
| PARENT_OF | edge 아님 → `academic-fields.json`의 `parent` property |
| USES / USED_IN | `uses` 재사용 / 역방향 **파생** |
| IMPLEMENTS | 만들지 않음 → `is_a` 또는 `based_on` |
| COMPARE_WITH | `compare_with` 재사용 |
| EVOLVES_TO | `evolved_from`의 역방향 **파생** |
| RELEVANT_TO_MISSION | master `mission_refs`에서 **파생** |
| RELEVANT_TO_ROLE | edge 아님 → role의 field 가중치 |

### 소유권
사실 하나당 원본 하나. 신규 authored 파일은 `data/encyclopedia/` 4종(`academic-fields`, `missions`, `roles`, `clusters/*`)뿐이며, 나머지는 전부 기존 파일에서 파생한다. 중복은 validator가 막는다(기존 map edge와 교차 검사, 대칭 relation 포함).

### Learning Path
계산이 기본, 저장은 "순서 + 왜"만. **path의 인접 step은 그래프에 edge가 있어야 통과**하도록 강제해 경로와 관계가 어긋나지 않게 한다.

### Pilot
canonical 40개(7.7%) / 3 cluster. 각각 다른 난제를 담당한다 — Web·Backend(16): cross-field 경로, Data·Redis(10): 학문 분할 + hub 개념, System·Process(14): prerequisite 밀도 + related filler 구분. 요청서의 예시 경로 2개를 **실물로 재현 가능한지**를 판정 기준에 포함했다.

## 6. 확정 사항

Sprint 0에서 데이터 근거로 확정한 10건(D1~D10)은 `00-project-status.md` §5에 있다. 요약: Atlas 재사용 / 신규 relation 0 / role은 metadata / path는 계산 / related는 파생 / 미션-term은 master만 / hub는 foundation node / `glossary.json` 불변 / 미션 ID는 `main-m05` 형식 / pilot 40개.

## 7. 미확정 사항

U1~U8은 `00-project-status.md` §6에 있다. 이 중 **U1(범위 선언), U2(학문 목록·선수 순서), U3(미션별 학문 배정)은 Sprint 1 착수 전 소유자 판단이 필요**하다.

Sprint 0에서 **의도적으로 확정하지 않은 것**: 학문 배정과 study-next는 커리큘럼 판단이므로 `[proposal]` 표기로 제출했고, 임의 확정하지 않았다.

## 8. 위험 요소

| # | 위험 | 영향 | 완화책 |
| --- | --- | --- | --- |
| R1 | **중복 metadata** — relation이 이미 5곳에 분산 | 진실이 둘이 되어 신뢰 붕괴 | 소유권 표 + validator 교차 검사(E4), `related` authoring 금지 |
| R2 | **prerequisite authoring 비용** — edge마다 reason·confidence·source 필요, 현재 4개 → 수백 개 필요 | 속도 저하, 품질 편차 | cluster 단위 증분, 미커버 영역은 "정보 없음"으로 정직 표기 |
| R3 | **graph complexity** — node 5종 × relation 10종 | 사람이 유지 불가 | 신규 relation 0, authored edge는 8종 부분집합, cluster 파일 단위 열람 |
| R4 | **RC1 오염** — 확장 중 canonical/콘텐츠에 손이 감 | RC 재검증 필요 | 변경 금지 영역 명문화 + `git diff glossary-rc1` 가드(E1) |
| R5 | **hub 개념 부재** — client/server/api 등 canonical 0 | 경로가 끊기거나, 성장 정책을 우회한 canonical 난입 | `foundation:*`로 시작 + `promotionCandidate` + docs/13 절차 |
| R6 | **학문 매핑이 논쟁적** — 대학 커리큘럼은 학교마다 다름 | 잘못된 학습 안내 | `[data]`/`[proposal]` 구분, override는 sparse, 소유자 승인 |
| R7 | **Extension 회귀** — `glossary.json`은 통째로 복사됨 | 0.4.2 계약 파손 | 신규 데이터는 별도 generated 파일, Extension 입력 불변(D8) |
| R8 | **derived 데이터의 정직성** — Atlas 기본 crosswalk가 틀린 term이 섞임. 세 field에서만 47개 확인(F12) | 잘못된 학문 분류가 조용히 퍼짐 | pilot에서 override 비율을 **측정해 보고**(E10). 추정(15~25%)을 크게 넘으면 파생 대신 독립 authored 분류로 전환 재검토 |
| R10 | **ontology 표류**(F10) — 방향 규약이 Frontend에만 있음 | prerequisite를 늘릴수록 역방향 edge가 누적 | 방향 계약을 Encyclopedia가 명시 선언(02 §4-1), 기존 2건은 U5로 상신, cycle 검사로 일부 자동 포착 |
| R9 | **범위 확대(U1) 미해결** | 프로젝트 정체성 표류 | Sprint 1 전 결정 필수 |

## 9. 다음 Sprint 권고

**Sprint 1 — Encyclopedia Data Skeleton** (U1~U3 승인 후)
`data/encyclopedia/` 생성 → `academic-fields.json`(14) / `missions.json`(16) / `roles.json`(10) → `build_encyclopedia_graph.py` + `validate_encyclopedia.py` → cluster 없이 빌드·검증 통과.
term 단위 데이터는 이 Sprint에서 **만들지 않는다**(골격과 내용을 분리해 검증).

**Sprint 2 — Pilot 3 cluster** → `05-pilot-plan.md` E1~E10으로 판정. 실패 시 모델 수정 후 재검증, 확장 금지.

**Sprint 3+** — view 구현(`#/academic`, `#/paths`, `#/roles`), 그리고 cluster 확장(Database/M11 → Git·SWE → Security → …).

별도 트랙(승인 필요): U5 `prerequisite` 방향 1건 정리, U8 `mission-term-map` 중복 제거.

## 10. QA / 검증 결과

이 Sprint는 코드를 만들지 않았으므로, **기준선이 훼손되지 않았음**을 확인하는 것이 QA다. 2026-09-19 실행:

| 검증 | 결과 |
| --- | --- |
| `python scripts/validate_glossary.py` | 519 canonical · 46 mission-local · **0 error · 0 warning** · 780 info |
| `python scripts/validate_technology_field_atlas.py` | **PASS** — 12 field · 519 term · 16 mission / confidence HIGH 512, MEDIUM 6, LOW 1 |
| `python scripts/validate_knowledge_map.py` | **PASS** — 10 implemented / 12 registry entry / cross-field layer 2 |
| `python scripts/validate_content_tier_plan.py` | **PASS** — 519 canonical · 395 planned · 9 batch · A95/B247/C177 |
| `git status` (문서 작성 전) | clean |
| `git diff glossary-rc1 -- data content src extension scripts` | **변경 없음** (문서만 추가) |

교차 검증(설계 근거의 사실성 확인):
- 미션-term 쌍: master 586 == `mission-term-map` 586, 차집합 0
- `detailRelatedTerms` 1,324 링크 / dangling 참조 **0** / 519개 term 전부가 1개 이상 보유
- map term 커버리지 226/519, `atlas_coverage_gap` INFO 293과 일치
- `content/terms` 518개 `.md` 전부가 master id와 1:1 대응(고아 파일 0), master의 `readme`만 `content/readme-term.md`에 별도 존재
- cross-map 중복 edge **0건**, 같은 node 쌍이 두 map에 나타나는 경우 **0건**
- pilot 40개 term **전부 canonical 존재 확인** (tier·field·미션까지 대조)

**Opus 재검증 패스 (2026-09-19, 같은 Sprint 내):** 초기 조사(Sonnet)로 작성한 `01`~`04`의 정량 주장을 전부 원데이터로 재계산했다.
- 정정 2건: overlay 수 17 → **18**, pilot P3의 `concurrency` 분류 programming-foundations → **systems-runtime**.
- 신규 발견 2건: **F10**(ontology 10개 파일 복제·표류 → prerequisite 2/4 역방향), **F12**(override 비용 정량 47개).
- 출처 정밀화 1건: 예비과정 미션 제목의 출처는 `source-manifest.md`가 아니라 raw 추출 md의 섹션 헤더.
- 그 외 수치(519/586/1,324/251/241/38/226/293/12 field/tier A95·B247·C177 등)는 **재계산 결과 일치**.

## 11. 관련 commit

| commit | 내용 |
| --- | --- |
| `818b42e` | docs(ke): add knowledge encyclopedia sprint 0 architecture discovery — 이 Sprint의 산출물 7개 문서 (소스 변경 0) |
| `64e7ad1` | 시작 기준 (docs(release): record glossary rc1 freeze) |
| `4e4075c` | tag `glossary-rc1` |
