# 04. View Architecture

> 상태: **PROPOSED**. Sprint 0에서는 UI를 구현하지 않는다. 이 문서는 각 view가 **어떤 데이터에서, 무엇을 파생해** 만들어지는지만 정한다.
> 원칙: view는 데이터를 소유하지 않는다. 모든 view는 [02](02-knowledge-model-proposal.md)의 통합 그래프(`encyclopedia-graph.json`)와 기존 generated 파일의 **질의 결과**다.

## 1. 통합 그래프에서 view가 쓰는 질의 (5종이면 충분)

| 질의 | 정의 | 사용 view |
| --- | --- | --- |
| `membership(x)` | x가 속한 field / academic / mission 집합 | 2, 3, 5, 6 |
| `neighbors(x, relations)` | 지정 relation의 인접 node | 1, 7, 8 |
| `learnFirst(x)` | learn-first 부분그래프(prerequisite, based_on, is_a→부모, cs_foundation)의 역방향 closure + 위상정렬 | 4, 5, 7 |
| `pathsThrough(x)` | x를 포함하는 큐레이션 path + 기존 `learningRoutes` | 7 |
| `coverage(scope)` | scope 안의 canonical / foundation / 미수록 개수 | 3, 6 |

## 2. View별 설계

### V1. 용어 찾기 (Term search)
- **현재 상태:** `#/terms`, `searchTerms.ts` (이름·별칭 매칭). Extension 검색과 같은 `glossary.json` 기반.
- **확장:** facet 필터(기술 분야, 학문, 미션, 직무)를 **`membership()` 결과로만** 제공. 검색 로직과 `glossary.json`은 변경하지 않는다.
- **데이터:** `glossary.json`(기존) + `encyclopedia-graph.json`의 membership 인덱스.
- **주의:** Chrome Extension은 이 view의 소비자가 아니다 (입력 3개 파일 불변).

### V2. 기술 지도 (Technology map)
- **현재 상태:** `#/maps`, `#/maps/:mapId` (구현·검증 완료, 10 map).
- **확장:** 없음. **변경 금지 영역**. Encyclopedia는 이 view의 데이터를 읽기만 한다.
- **데이터:** `map-registry.json`, `*-knowledge-map.json`, overlay.

### V3. 학문 지도 (Academic map)
- **내용:** academic 14개를 `prerequisiteFields` DAG로 배치(학문 밴드 / 적용 영역 밴드), 각 노드에 term 커버리지 표시, 클릭 시 해당 학문의 term 목록(기본값 crosswalk + override)과 관련 미션.
- **데이터:** `academic-fields.json`, `membership(term→academic)`, `coverage()`.
- **핵심 정직성:** 커버리지가 얇은 학문(computer-architecture, sre)은 "미수록/적음"을 그대로 표시. 비어 있는 학문을 그럴듯한 canvas로 채우지 않는다 (docs/12 "빈 canvas 금지"의 연장).
- **UI 재사용:** 기존 `TechnologyFieldMap` canvas를 재사용할지, 트리/밴드 리스트가 나은지는 Sprint 3 결정. 노드가 14개라 canvas가 과할 수 있다. `[미확정]`

### V4. 선수학습 지도 (Prerequisite map)
- **내용:** 임의 term/academic/mission을 선택하면 `learnFirst()` 결과를 층(layer)별로 표시: "먼저 알면 좋은 것 → 이것".
- **데이터:** learn-first 부분그래프 (prerequisite/based_on/is_a/cs_foundation).
- **전제:** prerequisite edge가 현재 4개뿐이므로 **이 view는 edge가 채워진 cluster에서만 의미**가 있다. cluster 밖 term은 "선수 정보 없음"을 명시하고, `related`(약한 층)를 **선수로 오인시키지 않는다**.
- **품질 장치:** cycle 금지 validator, edge마다 `reason`+`confidence`+`source` 노출(기존 필드).

### V5. 미션 지도 (Mission map)
- **현재 상태:** `#/missions`, `#/missions/:missionId` (term 목록, 지도 CTA 연결).
- **확장:** 미션 상세에 7개 질문(03 §2)을 그대로 섹션으로: 연결 학문 / 먼저 공부할 학문 / 기술 분야(기존 CTA) / 핵심 term / 선수 term / 실습 term / 다음에 볼 것. 미션 간 흐름(`order`, `studyNext`).
- **데이터:** `missions.json`(신규), master `mission_refs`, `mission-map-routing.json`, `learnFirst()`.
- **미션 제목**이 처음으로 데이터에서 온다 (지금은 `main-` → "본과정 " 문자열 치환).

### V6. 직무 지도 (Role map)
- **내용:** 직무 선택 → 강조 field/학문(core/supporting) → 해당 field의 core·Tier A term → 관련 미션. "이 직무가 이 사전에서 얼마나 커버되는지"(`coverage`)를 함께 표시.
- **데이터:** `roles.json`, `membership()`, master `importance`, `content-tier-sprint7.json`의 tier.
- **한계 표시:** QA·SRE는 canonical 부재로 low coverage (02 §7). 직무 view는 채워진 것만 보여주고 빈 곳은 "미수록"으로 표기.
- **node 승격 없음.** 직무는 filter/필터 화면이다.

### V7. 개념의 흐름 (Concept flow)
- **내용:** 한 개념이 "왜 필요했고 무엇에서 시작해 무엇으로 발전했는가"를 순서 있는 카드로. 예: `Client/Server → HTTP → API → REST → FastAPI`, `자료구조 → Hash Table → Key-Value Store → Cache → Redis`.
- **데이터:** cluster `paths[]`(서사 `why`) + 기존 map `learningRoutes` + `evolved_from`/`compare_with` edge. 인접 step은 edge로 검증됨(02 §8).
- **금지:** 연도표. `evolved_from`의 "단일 인과 주장 금지" 규칙 유지.

### V8. Concept Connections
- **현재 상태:** `#/connections` — 6개 큐레이션(모두 M01/M02 Frontend).
- **확장:** 없음(편집 콘텐츠). 성격이 다르다: Concept Connection은 **손으로 쓴 비교·설명 콘텐츠**, Encyclopedia 그래프는 **관계 데이터**.
- **장기 옵션:** 새 Concept Connection은 `compare_with` 부분그래프 위에서 작성해 diagram edge가 그래프 edge와 일치하게 만들 수 있다. 기존 6개는 이관하지 않는다. `[미확정]`

## 3. View ↔ 데이터 ↔ 신규 authoring 요약

| View | 기존 데이터 | 신규 authoring | 상태 |
| --- | --- | --- | --- |
| V1 용어 찾기 | glossary.json | 없음 (membership 파생) | 확장 |
| V2 기술 지도 | maps/atlas | 없음 | **불변** |
| V3 학문 지도 | Atlas classification | `academic-fields.json` + cluster override | 신규 |
| V4 선수학습 지도 | map edges(4 prerequisite) | prerequisite edge (cluster) | 신규 |
| V5 미션 지도 | master, routing | `missions.json` | 확장 |
| V6 직무 지도 | tier, importance | `roles.json` | 신규 |
| V7 개념의 흐름 | learningRoutes, evolved_from | cluster `paths[]` | 신규 |
| V8 Concept Connections | concept-connections-v1 | 없음 | **불변** |

## 4. URL 계약 (제안, 구현은 후속)
기존 HashRouter 계약을 유지하고 추가만 한다. 기존 경로는 **재정의하지 않는다.**
`#/academic`, `#/academic/:fieldId`, `#/paths`, `#/paths/:pathId`, `#/roles`, `#/roles/:roleId`, `#/prerequisites/:nodeId`. 쿼리 파라미터 `?mission=&term=`은 기존 `/maps` 규약 그대로.

## 5. 데이터 계약 (Web 번들)
- 신규 generated 파일은 **lazy load** (기존 `knowledgeMapLoader` 패턴): 홈/검색 번들에 encyclopedia 그래프를 포함하지 않는다.
- `encyclopedia-graph.json`은 view 진입 시에만 로드. 예상 규모(pilot 후 수 KB~수십 KB)이므로 분할은 pilot 이후 재평가.
- Extension 번들에는 **포함하지 않는다** (별도 승인 전까지).
