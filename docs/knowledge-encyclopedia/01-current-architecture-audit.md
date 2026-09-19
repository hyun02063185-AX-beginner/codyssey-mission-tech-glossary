# 01. Current Architecture Audit (Sprint 0)

> 기준: `main` @ `64e7ad1`, tag `glossary-rc1` (`4e4075c`). 이 문서의 수치는 2026-09-19에 저장소 데이터를 직접 집계한 값이다.
> 이 문서는 **현황 기록**이다. 새 구조 제안은 [02-knowledge-model-proposal.md](02-knowledge-model-proposal.md)에 있다.

## 1. 한 줄 결론

Glossary는 이미 `용어 → 설명`만이 아니라 **field / mission overlay / typed edge / learning route**를 갖춘 그래프 구조를 일부 가지고 있다.
새로 필요한 것은 "그래프 엔진"이 아니라 (a) 학문 축, (b) 미션 메타데이터, (c) 선수학습 관계 데이터, (d) 개념 hub, (e) 이들을 하나로 합치는 **읽기 전용 통합 빌더**다.

## 2. 데이터 소유 지도 (누가 무엇의 원본인가)

| 정보 | 원본(Source of Truth) | 성격 | 규모 |
| --- | --- | --- | --- |
| 용어 정체성 (id, term_ko/en, aliases, category, type, importance, difficulty) | `data/curated/glossary-master-v0.1.yaml` (실제 내용은 JSON) | authored | 519 canonical |
| 용어 본문 (Quick/Mission/Deep) | `content/terms/<id>.md` | authored | 518 md + `content/readme-term.md` |
| Mission-only 어휘 | `data/curated/mission-local-terms-v0.1.json` | authored | 46 |
| 용어↔미션 연결 | master의 `mission_refs[]` | authored | 586 쌍 (direct 413 / required 88 / related 94) |
| 용어↔미션 연결 (복제본) | `data/curated/mission-term-map-v0.1.yaml` | **master와 100% 동일** (586/586) | 아래 §5-D |
| 기술 분야 정의 | `data/knowledge-maps/atlas/field-taxonomy.json` | authored | 12 field (10 map + 2 cross-field layer) |
| 용어→분야 분류 | `data/knowledge-maps/atlas/term-field-classification.json` | derived (규칙+override는 `scripts/build_technology_field_atlas.py`) | 519 전부 분류 |
| 미션→분야 매트릭스 | `atlas/mission-field-matrix.json` | derived | 16 미션 |
| 미션→지도 라우팅 | `atlas/mission-map-routing.json` | authored | 16 미션 |
| 지도 레지스트리 | `data/knowledge-maps/map-registry.json` | authored | 12 entry |
| 분야 그래프 (node/edge/route/region) | `data/knowledge-maps/<map>/knowledge-map.json` | authored | 10 map |
| 미션 overlay | `data/knowledge-maps/<map>/overlays/*.json` | derived (`build_wave*_*.py`) | 18 |
| 용어 간 "관련 용어"(무타입) | `content/terms/*.md`의 `## 관련 용어` → `detailRelatedTerms` | authored | 1,324 directed link |
| 큐레이션 Concept Connection | `data/curated/concept-connections-v1.json` | authored | 6 (모두 M01/M02 Frontend) |
| M01 Open-book | `content/peer-review/main-m01-openbook.yaml` | authored | 23 quick term |
| Tier(A/B/C)·리뷰 | `data/reviews/*.json` | audit/plan | A 95 / B 247 / C 177 |
| 웹 번들 | `src/data/generated/*` (`scripts/build_web_data.py` 등) | generated | `glossary.json` 868 KB |
| Extension 번들 | `dist-extension/` ← `glossary.json`, `openbook-main-m01.json`, `term-map-links.json` | generated | ext 0.4.2 |

## 3. 항목별 조사 결과

### A. Glossary
- 519 canonical, category 14종, type 22종 값(그중 `concept` 436). `difficulty`는 2/3만 존재(1 없음), `importance`는 core 305 / supporting 214.
- 콘텐츠 필드 채움: summary·easyExplanation·technicalExplanation·missionContext 519, codeExample 378, commonMisconceptions 309, peerReviewQuestions 317, limitationsOrEdgeCases 213, howItWorks 55, **comparisons 5**.
- 정책 문서: `docs/13_canonical_term_selection_growth_policy_v1.md` — canonical은 "독립성·재사용·검색가치·교육가치·연결가치"로 판단하고, 성장은 batch review를 거친다.

### B. Technology Atlas (= 기술 분야 모델은 이미 있다)
- `field-taxonomy.json`의 12 field: frontend-web-ui, backend-server-api, data-database, systems-runtime, devops-infrastructure, git-collaboration, security-identity, programming-foundations, algorithms-data-structures, network-web-protocol, ai-ml-computing, developer-workflow-tools.
- 각 term은 `primaryField` 1개 + `secondaryFields`(67개 term이 보유) + `mapRole`(core 394 / boundary 65 / foundation 47 / shared 13) + confidence(HIGH 512 / MEDIUM 6 / LOW 1).
- primary 분포: programming-foundations 80, frontend 69, data-database 67, systems-runtime 51, security 50, git 50, algorithms-DS 33, network 32, devops 31, ai-ml 25, backend 23, dev-tools 8.
- 정책: "미션은 map을 소유하지 않는다. 미션은 field map 위의 overlay다" (`docs/10`, `docs/11`).

### C. Knowledge Map (graph 엔진)
- 10개 field map: node 251 (canonical term node 237 + synthetic `foundation:*` 14), edge 241, learningRoute 38.
- map에 실제로 올라간 canonical은 **226 / 519 (43.6%)**. 293개(56.4%)는 어느 map에도 없다 (`validate_glossary.py`의 `atlas_coverage_gap` INFO 293과 일치). 9개 term만 2개 이상 map에 등장.
- **이미 존재하는 relation ontology** (edge 수):

| relation | 수 | 의미(ontology 문구 요약) |
| --- | ---: | --- |
| interacts_with | 75 | A와 B가 동작상 상호작용 |
| uses | 71 | A가 B를 사용/소비 |
| based_on | 31 | A의 이해/동작이 B에 기반 |
| provided_by | 20 | B가 A를 제공 |
| is_a | 18 | A는 B의 한 종류 |
| compare_with | 15 | 비교하면 차이·선택 기준이 선명 |
| **prerequisite** | **4** | B를 먼저 이해하면 A를 이해하기 좋다 |
| defined_by | 3 | 규범적 정의가 표준/명세에 있음 |
| cs_foundation | 2 | B는 A를 설명하는 CS 기본 원리 |
| **evolved_from** | **2** | 역사적·설계상 발전 맥락 (단순 시간순 아님, 단일 인과 주장 금지) |

  ontology에는 `enabled_by`, `mission_uses`도 선언돼 있으나(Frontend) 실제 edge는 0이다.
- **relation 어휘의 진짜 원본은 map 파일이 아니라 validator다.** `scripts/validate_knowledge_map.py`의 `RELATIONS` 상수가 12종 전체를 허용하고, 각 `knowledge-map.json`은 그중 일부를 **자기 파일 안에 다시 선언**한다:
  - Frontend만 12종 전부를 선언하며 **유일하게 방향이 명시된 문구**를 쓴다 (예: `prerequisite` = "B를 먼저 이해하면 A를 이해하기 좋다").
  - 나머지 9개 map은 7종(`is_a, based_on, uses, interacts_with, prerequisite, provided_by, compare_with`)만, 그것도 **방향이 빠진 축약 문구**로 선언한다 (예: `prerequisite` = "먼저 이해하면 좋다.", `uses` = "사용하거나 소비한다."). `compare_with`는 문구가 4가지, `provided_by`는 3가지로 갈린다.
  - `cs_foundation`, `defined_by`, `evolved_from`, `enabled_by`, `mission_uses`는 **Frontend에만 선언**돼 있으나 validator는 어느 map에서든 허용한다. 현재 미선언 relation을 쓰는 map은 없다(검사함).
  - → ontology 자체가 10개 파일에 복제돼 표류 중이며, **방향 규약이 문서화된 곳은 Frontend 하나뿐**이다. Encyclopedia가 "기존 ontology 재사용"이라고 할 때 어느 정의를 따르는지 못 박아야 한다 ([02 §4-1](02-knowledge-model-proposal.md)).
- edge 필수 필드: `from, relation, to, reason, confidence(HIGH/MEDIUM), evidenceType, source(URL)`. evidence: official-documentation 173, architectural-inference 30, mission-source 21, official-standard 17. → **사람이 근거를 읽을 수 있는 구조**이며 유지 비용이 높다는 뜻이기도 하다.
- node 필드: `id(term:<id> | foundation:<id>), termId, label, labelKo, nodeOrigin, nodeRole, layer, primaryRegion, summary, standardsOrProviders?, foundationRationale?`.
- **learningRoutes 38개** (길이 3~8, 평균 약 4.8): `{id,label,description,nodeIds[],scope:field|mission}`. 이미 "Learning Path" 형태의 원형이다. 단, route의 인접 쌍이 edge로 뒷받침되는지는 검증하지 않는다.
- validator (`scripts/validate_knowledge_map.py`) 제약: relation·evidence·confidence는 **고정 집합**, `source`는 URL, edge endpoint는 해당 map의 node, map 내 중복 edge 금지, orphan node 검사. → 새 relation 타입 추가는 validator 상수 수정을 요구한다.
- validator의 중복 edge 검사는 **map 내부에서만** 동작한다. map을 가로지르는 중복은 검사하지 않지만, 실제로 확인한 결과 **현재 cross-map 중복 edge 0개 / 같은 node 쌍이 두 map에 나타나는 경우도 0개**다. 즉 중복 방지는 아직 "지켜지고 있으나 강제되지는 않는" 상태다.
- synthetic `foundation:*` node 14개(ECMAScript, HTML Standard, Web Platform, Request/Response, Async Execution …)는 **"canonical은 아니지만 설명에 필요한 개념"의 선례**다.

### D. Concept Connection
- 6개 모두 PUBLISHED, 모두 main-m01(Frontend) 맥락 (`ajax-xhr-fetch`, `callback-promise-async-await`, `event-family`, `html-dom`, `spa-mpa`, `var-let-const`). 자체 `diagram{nodes,edges}`를 free-text label로 가진다.
- Map graph와 **별도 데이터**다. 성격은 그래프가 아니라 "편집된 비교/개념 설명 콘텐츠". UI: `#/connections`.

### E. Mission 데이터
- 미션은 **16개** (예비 3 + 본과정 13). 요청서의 "M01~M13"은 본과정만 가리키므로, 모델은 16개를 전제로 한다.
- 미션 ID 표기가 **세 가지**다: `main/M01`(master, `missions.json`), `main-m01`(atlas·overlay·routing·concept-connection), 본문 prose의 `M01`(예비/본과정 구분 불가; 예: `http.md`의 "M01의 GitHub API 호출").
- **미션 제목·설명·순서를 담은 curated/generated 파일이 없다.** 본과정 13개 제목은 `data/raw/main/mXX/source-manifest.md`의 `- 미션명:` 줄에, 예비 3개는 `data/raw/preliminary/preliminary-m01-m03-claude-raw.md`의 섹션 헤더(`# M01 — 개발 워크스테이션 구축` 등)에만 있다. UI는 `missionId.replace('main-','본과정 ')`로 라벨을 만든다.
- 미션 → 기술 지도 연결은 이미 있다 (`mission-map-routing.json`: primaryContext, crossFieldLayers, maps[], coverage). 미션당 primary field 1개, 일부는 cross-field layer가 primary.
- 미션별 term 수: main M01 76, pre M01 57, main M02 38, M11 38, M13 38, M05 37, pre M02 37, M12 34, M07 33, M03 32, M06 32, M09 31, M04 29, pre M03 29, M08 28, M10 26.

### F. Open-book / Chrome Extension
- Extension(0.4.2)은 `glossary.json` 전체, `openbook-main-m01.json`, `term-map-links.json`, `publicWebLinks.js`를 그대로 복사한다 (`scripts/build_extension.py`; assert로 계약 고정). Deep 콘텐츠는 복제하지 않고 공개 Web으로 링크.
- `term-map-links.json`은 **map node 존재 여부 기반**(226 term)이라 Encyclopedia 데이터와 독립적으로 유지된다.
- 결론: Extension 계약은 `glossary.json` 스키마와 위 3개 파일에 묶여 있다. 새 데이터는 **별도 generated 파일**로 두면 Extension 영향이 0이다.

### G. 검색 / 라우팅
- 검색: `src/searchTerms.ts` — termKo/termEn/aliases 매칭 + core 가중 + 미션 수 정렬. 분야·미션 facet 없음.
- 라우트(HashRouter): `/`, `/terms`, `/terms/:termId`, `/missions`, `/missions/:missionId`, `/maps`, `/maps/:mapId`(+`?mission=&term=`), `/maps/main-m01`(legacy redirect), `/connections(/:id)`, `/webtoons`, `/openbook/main-m01`.
- Graph/Map 엔진: `TechnologyFieldMap.tsx` 하나가 모든 field를 렌더 (field별 분기 없음), `knowledgeMapLoader.ts`가 lazy load.

### H. Validator / QA
- `validate_glossary.py`: 519 canonical · 46 mission-local · **0 error · 0 warning · 780 info** (기준선).
- `validate_technology_field_atlas.py`, `validate_knowledge_map.py`, `validate_content_tier_plan.py`: 모두 PASS (2026-09-19 실행 확인).
- 그 외 `src/data.test.ts` 등 vitest, Playwright 지도 상호작용 테스트.

### I. Review 메타데이터
- `data/reviews/`: audit, tier(A/B/C), polish backlog, manual-review 등. **generated 파일에 review 데이터를 넣지 않는다**는 규칙이 명시돼 있다 (`data/reviews/README.md`).

## 4. 기존 문서 조사 (이름·내용 유사 문서)

| 문서 | 내용 | Sprint 0 관점 |
| --- | --- | --- |
| `docs/10_technology_field_atlas_architecture.md` | field 소유·재사용, `primaryField/secondaryFields`, role 4종 | 기술 분야 모델의 기준. **재사용** |
| `docs/11_knowledge_map_engine_architecture.md` | 범용 map 엔진, registry, overlay 계약 | 그래프 계약의 기준. **재사용** |
| `docs/09_frontend_knowledge_map_architecture.md` | Frontend map v1, URL 계약 | 참고 |
| `docs/12_cross_field_layer_architecture.md` | Programming Foundations / Dev Tools는 cross-field layer, 빈 canvas 금지 | **학문 축 설계의 직접 근거** (prerequisite 모음을 canvas로 만들지 않는다는 결정) |
| `docs/07_content_layer_model.md` | Quick/Mission/Deep | 콘텐츠 layer. graph와 직교 |
| `docs/13_canonical_term_selection_growth_policy_v1.md` | canonical 성장 절차 | hub 개념 승격 절차의 기준 |
| `docs/01_information_architecture.md` | "prerequisite/related/contrast/deeper" 관계 유형 후보, 분야별 보기 | **초기 구상이 이미 있었으나 구현되지 않은 부분** |
| `docs/00_project_overview.md` §5 | "컴퓨터 과학 전체를 수록하는 백과사전"은 **하지 않는 것** | **범위 충돌** (§5-F) |
| "mission mapping", "concept connection architecture" 이름의 문서 | 없음 (구현 보고서만: `reports/knowledge-map/concept-connection-v1-implementation.md`) | — |

## 5. 중복 구조 탐지 결과

새 schema를 만들기 전에 같은 의미의 정보가 이미 어디에 있는지 확인했다.

| 개념 | 이미 있는 위치 | 판단 |
| --- | --- | --- |
| category | master `category`(14) | Atlas의 입력 신호일 뿐 분류 체계 아님. 재사용하지 않음 |
| domain/field | Atlas `primaryField/secondaryFields` | **기술 분야는 재사용** (신규 만들지 않음) |
| relation | map edge 10종 + master `related_terms` 94 + `detailRelatedTerms` 1,324 + concept-connection edge + `comparisons` 5 | **5곳에 분산** (§5-A) |
| mission | master `mission_refs`, `mission-term-map`, overlay, matrix, routing, `term-field-classification.missions` | 6곳. 원본은 master (§5-D) |
| prerequisite | map edge 4개 + `docs/01`의 후보 | 사실상 **비어 있음** |
| related | `detailRelatedTerms`(전 term 보유) | 재사용 가능하나 무타입·품질 편차 |
| family | 없음 | `is_a`와 Atlas `region`으로 대체 가능 |

### A. Relation이 5곳에 있다
- `detailRelatedTerms` 1,096 undirected pair vs map term-pair 216개: **겹치는 pair는 117개**, map에만 있는 pair 99개. 즉 두 저장소는 서로를 포함하지 않는다.
- `detailRelatedTerms`는 무타입이며 일부는 범용 filler다. 예: process 관련 17개 term이 `['process','linux']`를 동일하게 가리킨다 (cpu-usage, memory-usage, out-of-memory, memory-leak, heap-memory, cgroup, systemd, scheduler …).
- 따라서 **새 `related` 관계를 추가로 authoring하면 중복**이다. `related`는 `detailRelatedTerms`에서 파생하는 약한 층으로 취급해야 한다.

### B. prerequisite는 거의 없고, 방향 규약이 절반만 문서화돼 있다
전체 4개 edge를 전수 확인했다. 기준은 유일하게 방향이 적힌 Frontend 정의 "`A prerequisite B` = B를 먼저" (from = 나중, to = 먼저).

| edge | 소속 map | 로컬 ontology에 방향 있음? | 판정 |
| --- | --- | :-: | --- |
| `async-await → promise` | frontend | ✔ | 정의와 **일치** |
| `mobile-first → responsive-web-design` | frontend | ✔ | 일치 (RWD가 상위 개념) |
| `normalization → data-integrity` | data-database | ✘ | reason("정규화는 무결성을 이해하는 **기반**")대로면 normalization이 먼저 → **역방향으로 읽힌다** |
| `staging-area-git-add → commit` | git-collaboration | ✘ | reason("add로 넣은 변경을 commit으로 기록")대로면 add가 먼저 → **역방향으로 읽힌다** |

- 즉 어긋난 2건은 모두 **로컬 정의에 방향이 없는 map**에서 나왔다. 개별 실수라기보다 §3-C의 ontology 표류가 원인이다.
- 4개뿐이라 당장의 위험은 아니지만, **prerequisite를 수십~수백 개로 늘리기 전에** (a) 방향 규약을 한 곳에 못 박고 (b) 이 2건을 검토해야 한다. 수정은 Sprint 0 범위 밖(변경 금지 영역).

### C. evolved_from은 이미 "시간표가 아닌 발전 맥락"으로 정의돼 있다
- 예: `local-storage evolved_from cookie`, `fetch-api evolved_from foundation:xml-http-request`. reason에 "단일 인과는 주장하지 않는다"가 명시돼 있다. 요청서 E("왜 필요했고 어떤 개념에서 시작했나")와 정의가 일치하므로 **EVOLVES_TO는 `evolved_from`의 역방향 view로 충분**하다.

### D. mission-term-map은 master의 복제본이다
- `mission-term-map-v0.1.yaml` 586 쌍 = master `mission_refs` 586 쌍 (차집합 0). `build_web_data.py`가 둘을 각각 읽어 `glossary.json`(master)과 `missions.json`(map)을 만든다. 현재는 일치하지만 **원본이 둘**이다.
- RC1 보호를 위해 Sprint 0에서는 건드리지 않고, Encyclopedia는 master만 읽는다. 중복 제거는 후속 결정 사항.

### E. 기술 분야 vs 학문 분야
- Atlas field는 이미 학문에 가까운 것(algorithms-data-structures, network-web-protocol, systems-runtime, ai-ml-computing)과 기술 스택에 가까운 것(frontend, backend, devops)이 **섞여 있다**. 학문 축은 새로 필요하지만 Atlas field와 **crosswalk**로 연결하는 편이 재분류보다 안전하다 ([02](02-knowledge-model-proposal.md) §5).

### F. 범위 충돌 (결정 필요)
- `README.md`와 `docs/00_project_overview.md` §5는 "컴퓨터 과학 전체를 포괄하는 백과사전을 만들지 않는다"고 명시한다. Knowledge Encyclopedia 확장은 이 문장과 긴장 관계에 있다.
- 권고: Encyclopedia를 "CS 전체 수록"이 아니라 **미션에 고정(anchored)된 canonical 위의 탐색·연결 layer**로 정의하고, hub 개념은 성장 정책(docs/13)을 거쳐 최소한만 추가. 이 선언은 소유자 승인 후 README/docs 00에 반영해야 한다 (Sprint 0은 미수정).

## 6. 확인된 갭

| ID | 갭 | 근거 |
| --- | --- | --- |
| G1 | **미션 메타데이터 없음** (제목·순서·학문·다음 학습) | §3-E |
| G2 | **학문(Academic) 축 없음** | Atlas는 기술 field. Computer Architecture에 해당하는 field 자체가 없음 |
| G3 | **선수학습(prerequisite) 데이터 사실상 없음** (4/241 edge), evolved_from 2 | §3-C |
| G4 | **개념 hub가 canonical에 없음** | client, server, api, backend, database, operating system, memory, data structure, hash table(=hash-map만 있음), key-value store, network, cloud, devops, SRE, CI/CD, test = **exact match 0**. 미션 어휘 중심이라 "상위 개념"이 비어 있음 |
| G5 | Atlas 밖 293 term, `detailRelatedTerms` 무타입 | §3-C, §5-A |
| G6 | **직무(Role) 데이터 없음** | 전무 |
| G7 | 미션 ID 표기 3종 | §3-E |
| G8 | 도메인 공백: **QA/test/CI-CD/Kubernetes canonical 0**, SRE는 observability·health-check·root-cause-analysis·logging 정도, Computer Architecture는 cpu-architecture·gpu-vs-npu·ieee-754·floating-point·neural-processing-unit 정도 | 직무·학문 view의 커버리지 한계 |
| G9 | 문서 드리프트: `docs/10`은 "549-term" 서술(실제 519), Roadmap 일부 수치가 과거 기준 | 이력 문서로 유지, 현재 기준은 이 감사 |
| G10 | **relation ontology가 10개 map 파일에 복제·표류**하고, 방향 규약은 Frontend에만 문서화 | §3-C, §5-B |

## 7. 이번 조사에서 하지 않은 것
- canonical/콘텐츠/Atlas/Map/Extension/Web 어떤 파일도 수정하지 않았다. (기준선 validator 4종 실행 후 `git status` clean 확인)
