# 04 · 기존 기술 지도 엔진 재사용 검토

> 읽은 코드(기준 `f829c8e`. `origin/main` `57462a9`와 아래 파일 내용이 같다): `src/TechnologyFieldMap.tsx`(77행), `src/knowledgeMapLoader.ts`, `src/knowledgeMapTypes.ts`, `src/MapsAtlas.tsx`, `src/App.tsx`(라우트·미션 진입), `src/ConceptConnections.tsx`, `src/styles.css`·`src/repair.css`의 지도 규칙, `data/knowledge-maps/network-web-protocol/knowledge-map.json`·`overlays/main-m05.json`, `scripts/build_web_data.py`, `playwright/technology-field-map.spec.ts`·`map-immersive-workspace.spec.ts`. **어떤 파일도 수정하지 않았다.**

## 1. 기존 엔진의 구조

| 층 | 위치 | 하는 일 |
| --- | --- | --- |
| 데이터 원본 | `data/knowledge-maps/<mapId>/knowledge-map.json`, `overlays/<missionId>.json`, `map-registry.json` | 노드(`term:<termId>`)·엣지(`relation` 영어 키)·지역·대표 경로·미션 overlay |
| 생성 | `scripts/build_web_data.py` 외(`npm run data:build`) | 원본을 검사해 `src/data/generated/<mapId>-knowledge-map.json`, `-overlay-<missionId>.json`으로 복사 |
| 로더 | `knowledgeMapLoader.ts` | `mapId` → 생성 JSON 동적 import(지도별 하드코딩 목록) |
| 형식 | `knowledgeMapTypes.ts` | `KnowledgeMap`, `MapNode`, `MapEdge`, `LearningRoute`, `MissionOverlay`, `Region` |
| 화면 | `TechnologyFieldMap.tsx` | 라우트 `/maps/:mapId` → `MapStage` 하나에 상태·URL·배치·캔버스·패널이 모두 들어 있다. 보조 함수(`labelLines`, `fallbackLayouts`, `graphPositions`, `edgePath`, `roleLabel`)와 `NodeDetail`, `RouteDetail`은 **export되지 않은** 파일 내부 함수다 |
| 스타일 | `styles.css` 5~10·27행, `repair.css` 19~41행 | `.map-*` 전역 클래스. 데스크톱 겹침 패널·모바일 하단 시트·`has-focus` 약화·몰입 작업공간이 모두 CSS다 |
| 검사 | Playwright 2개 파일 13개 시험 | 휠, 반복 이동·선택·경로, 패널 겹침, 모바일 하단 시트·가로 넘침, 모든 지도 로드, 글자 선택 방지, 패널 복사, 몰입 폭, 읽기 크기 ≠ 전체 보기, 패널이 지도를 줄이지 않음, 딥링크 노드가 화면 안, 좁은 화면 유지 |

### MapStage 상태와 규칙 (코드에서 확인)

| 항목 | 구현 |
| --- | --- |
| 선택 상태 | `selectedNodeId`, `routeId`, `detailOpen`, `search`, `view{x,y,zoom}` (React state) |
| URL | `useSearchParams`의 `term`(→ `nodeByTerm`으로 노드 찾기)·`mission`. **termId가 없는 노드는 URL로 선택할 수 없다** |
| 배치 | `fallbackLayouts`: 지역 `layout`이 없으면 3열 격자. `graphPositions`: 지역 안에서 `foundation`을 뒤로, 나머지는 **이름순** 정렬, 카드 48px 높이, 58px 간격 |
| 관계 표시 | 선택이 없을 때 `['prerequisite','provided_by','defined_by','evolved_from','is_a']` 이면서 `confidence==='HIGH'`인 엣지만 보임(하드코딩). 선택하면 그 노드의 엣지 |
| 관계 모양 | `relation-<키>` 클래스. `evolved_from` 점선, `compare_with` 짧은 점선만 따로 있다. 모든 엣지에 화살촉 |
| 노드 표지 | `nodeRole`(core·foundation·boundary·shared) → '핵심·기초·경계·공유', 아래 줄 `layer` 글자 |
| 패널 | `NodeDetail`: 역할·지역·layer, 표준, 추가 이유, overlay 맥락, **연결 관계(관계 키를 영어 그대로)**, CS 기반, 관련 개념 연결, 용어사전 단추, `TermEncyclopediaLinks` |
| 시점 | `frame`(가운데), `centerOn`(노드), `fitZoom`, `readingZoom`, 첫 진입·딥링크에 한 번만 맞춤(`framedFor`) |
| 모바일 | `matchMedia('(min-width:701px)')`로 몰입 여부. 좁으면 캔버스 960px + 가로 스크롤, '지역으로 찾기'(지역의 첫 노드 선택) |

## 2. 개념지도 데이터와 기존 형식의 차이

| 개념지도(`concept-map-v2.json`) | 기존 `KnowledgeMap` | 차이와 변환 |
| --- | --- | --- |
| 노드 ID `gen:`·`aws:`·`com:` | `term:<termId>` | 그대로 `MapNode.id`로 쓴다. `termId`는 `termIds[0]`(없으면 비움) |
| `termIds[]`(0~2개) | `termId?` 1개 | 첫 ID만 `termId`. 나머지는 확장 필드로 패널에 |
| `domain`, `conceptType`, `implementationStatus` | `layer`(글자), `nodeOrigin` | `layer` = "일반망 · 장비 · 예시"처럼 조합한 글자. 기존 노드 아래 줄에 그대로 나온다 |
| `importance` core·supplementary | `nodeRole` core·foundation·boundary·shared | core → `core`, supplementary → `foundation`(점선 테두리 모양 재사용). 표지 글자만 '보충'으로 바꿔야 한다(`roleLabel`·마커가 하드코딩) |
| `region`, `order` | `primaryRegion`, (정렬 규칙 고정) | `primaryRegion` = `region`. `order`는 기존 엔진이 무시한다 → 3절 |
| `summary`, `description`, `b31Note` | `summary` | `summary` 그대로. 나머지는 확장 패널 |
| 관계 `type`(한국어 6종) + `label` | `relation`(영어 키) | 변환표 4절. 화면 이름은 `label` |
| `scope`, `importance` | 없음 | 보기 필터와 기본 표시 규칙 |
| `description`, `source[]` | `reason`, `source`, `evidenceType`, `confidence` | `reason` = `description`. `confidence`는 모두 `HIGH`로 두되 기본 표시 규칙에는 쓰지 않는다 |
| `comparisonNote`, `perSystem` | 없음 | 확장 패널 |
| 흐름 `path[]`, `pathStepIds[]` | 엣지는 두 끝점만. `LearningRoute.nodeIds[]` | 흐름 하나 → `LearningRoute` 하나 + 경로 구간 엣지(그리기 전용) |
| `contrasts[]` | 없음 | 확장 패널 + 선택 시 상대 노드 표시 |
| `views[]` | overlay(강조만) | 노드를 **숨기는** 필터. overlay와 다르다 |
| `learningOrder[]` | `LearningRoute`(scope field·mission) | 경로가 아니라 안내 문장이다. 패널 항목으로만 |

## 3. 기능별 판정

| 기능 | 판정 | 근거 · 필요한 것 |
| --- | --- | --- |
| 캔버스 SVG 구조, 노드 카드 모양, 지역 상자 | **① 그대로 재사용** | 같은 `.map-region`·`.map-node`·`.map-edge` 마크업과 CSS |
| 선택 강조·약화(`is-selected`·`is-highlighted`·`has-focus`) | **① 그대로** | CSS 규칙만으로 동작한다 |
| 확대·축소·끌어 이동·읽기 크기·전체 보기·몰입 작업공간 | **③ 공통 추출 필요** | `MapStage` 안의 지역 함수·state라 다른 컴포넌트가 부를 수 없다. `useMapViewport(svgRef, height)` 훅으로 옮기면 그대로 쓴다 |
| 데스크톱 겹침 패널·모바일 하단 시트 | **① CSS 재사용 + ③ 껍데기 추출** | 시트·패널 모양은 CSS다. 머리(상태·닫기)만 `MapDetailShell`로 빼면 내용(`NodeDetail` 대신 개념지도 패널)을 바꿔 끼울 수 있다 |
| 대표 경로 칩·경로 패널 | **② 어댑터** | 흐름 관계 → `LearningRoute`. 기존 `RouteDetail`을 쓰려면 export 필요(③) |
| 노드 배치 | **② 어댑터 + ③ 작은 확장** | 지역 `layout`은 어댑터가 계산해 줄 수 있다. 지역 안 순서는 `graphPositions`가 이름순으로 다시 정렬하므로, ⓐ `MapNode.order?`를 정렬 1순위로 쓰게 하거나 ⓑ `positions`를 밖에서 주입할 수 있게 바꿔야 한다. 기존 지도에는 `order`가 없으므로 동작이 바뀌지 않는다 |
| 기본 관계 표시 규칙 | **③ 매개변수화** | 하드코딩 목록을 `isOverviewEdge(edge)` 인자로 받게 한다. 기본값 = 현재 목록 |
| 관계 모양(유형별 선) | **② 어댑터 + CSS 추가** | `relation` 키를 개념지도 전용 값(`cm-contains`·`cm-role`·`cm-flow`·`cm-corresponds`·`cm-associated`)으로 주고 `.map-edge.relation-cm-*` 규칙을 새 CSS 파일에 더한다. 대응·포함·연관은 화살촉을 없애야 하므로 `markerEnd`를 관계별로 정할 수 있어야 한다(③) |
| 노드 표지 글자('보충', '예시') | **③ 매개변수화** | `roleLabel`·마커 글자가 하드코딩. 표지 함수를 인자로 받게 한다 |
| 딥링크 | **④ 개념지도 전용** | `view·node·rel·flow·more·term`. 기존 `term·mission` 처리와 섞지 않고 개념지도 컴포넌트가 따로 갖는다 |
| 보기 전환(노드 숨김) | **④ 전용** | overlay는 강조만 하므로 다른 기능이다. 어댑터가 보기별 `KnowledgeMap`을 만들어 넘기면 캔버스는 그대로다 |
| 보충 표시·선택 시 이웃 드러내기 | **④ 전용** | 어댑터 입력에 `{view, showSupplementary, revealed:Set}`을 받아 보이는 노드를 계산 |
| 관계 선택·관계 패널 | **④ 전용 + ③ 훅 지점** | 엣지 `onClick`과 hit 영역이 필요하다. 캔버스 컴포넌트에 `onEdgeSelect?`를 두면 기존 지도는 넘기지 않아 그대로다 |
| 흐름의 구간별 강조·표식(A1…) | **④ 전용** | 경로 구간 엣지에 `data-step`을 달아 그린다 |
| 비교 카드·공통점·차이점 패널 | **④ 전용** | |
| 노드 검색 | **④ 전용** | 기존 검색은 용어사전 검색 결과를 지도 노드로 거르는 방식이라 용어 ID 없는 노드 25개를 못 찾는다 |
| 용어사전 단추·`TermEncyclopediaLinks`·관련 개념 연결 | **① 그대로** | termId 하나를 받는 컴포넌트·함수다. termIds 각각에 쓴다 |
| 목록 보기(모바일·화면 읽기) | **④ 전용(새 제안)** | 기존 지도에도 쓸 수 있으나 이번 범위 밖 |
| 데이터 로더·생성 | **② 새 생성 단계** | 기존 `loadKnowledgeMap`에 넣지 않는다(기술 지도 메뉴 비통합 정책). 개념지도 전용 import |

## 4. 관계 유형 변환표 (어댑터)

| 개념지도 `type` | 기존 어휘에서 가장 가까운 키 | 어댑터가 쓰는 `relation` | 화살촉 | 기존 키를 쓰지 않는 이유 |
| --- | --- | --- | --- | --- |
| 포함 | (없음. `is_a`는 '종류'라 다름) | `cm-contains` | 없음 | 포함은 배치이지 종류 관계가 아니다 |
| 역할 | `provided_by`(방향 반대) | `cm-role` | 장비 → 역할 | `provided_by`는 기존 기본 표시 목록에 들어 있어 섞이면 표시 규칙이 꼬인다 |
| 흐름 | `interacts_with` | `cm-flow` | 있음 | 경로 구간 그리기 전용 |
| 대응 | `compare_with` | `cm-corresponds` | 없음, 양끝 마름모 | `compare_with`는 '차이·선택 기준 비교'라 '비슷한 역할'과 뜻이 다르다 |
| 연관 | `uses`·`interacts_with` | `cm-associated` | 없음 | 구체적 뜻은 `label`에 있다 |
| 선행 | `prerequisite` | (그래프에 없음) | — | `learningOrder` |

어댑터는 기존 키로 **억지로 바꾸지 않는다.** 기존 지도 데이터와 개념지도 데이터가 섞이는 일이 없으므로(별도 화면) 접두어 `cm-`으로 충분하다.

## 5. 권장 구현 방식 (후속 Codex)

전면 재작성은 하지 않는다. 기존 기술 지도의 동작을 바꾸지 않는 **추출 → 어댑터 → 전용 화면** 3단계를 권한다.

| 단계 | 내용 | 기존 지도 영향 | 확인 |
| --- | --- | --- | --- |
| 1. 동작 보존 추출 | `TechnologyFieldMap.tsx`에서 ⓐ `useMapViewport` 훅(zoom·pan·fit·reading·몰입·크기 측정), ⓑ `MapCanvas`(지역·엣지·노드 그리기, 인자: positions·isOverviewEdge·edgeMarker·nodeMarker·onNodeSelect·onEdgeSelect?), ⓒ `MapDetailShell`(패널 머리·닫기)을 별도 파일로 옮긴다. 기본 인자는 지금 동작과 같게 둔다. `graphPositions`에 `order?` 1순위 정렬만 더한다 | **동작 변화 없음이 목표.** Owner Gate("기존 knowledge map")에 해당하므로 Owner 승인 뒤 별도 PR | 기존 Playwright 13개 + Vitest 전체 통과, 변경 전후 `/maps/network-web-protocol?mission=main-m05` 등 화면 비교 |
| 2. 어댑터 | `src/missionConceptMap/adapter.ts`: `toKnowledgeMap(data, {view, showSupplementary, revealed})` → `{graph, flows: LearningRoute[], extras}`. 순수 함수 | 없음 | Vitest: 보기별 노드·관계 수(05-content-qa 3절 표와 같아야 함), 고립 0, 숨은 경로 노드 건너뛰기, `term` → 노드 |
| 3. 전용 화면 | `MissionConceptMap.tsx`: 1단계 컴포넌트 + 어댑터 + 보기 탭·보충 토글·흐름 칩·관계 선택·개념지도 패널·딥링크. 스토리맵 마지막 장면과 `/missions/main-M05/story-map/concepts` 양쪽에서 쓴다. 스타일은 기존 `.map-*` + 새 `missionConceptMap.css`(`relation-cm-*`, 비교 표시) | 없음 | 새 Playwright: 03-interaction-spec의 상호작용 각 항목 |

**1단계를 하지 않는 대안.** Owner가 기존 지도 파일을 지금 건드리지 않기로 하면, 3단계 화면이 `MapStage`의 viewport 로직을 **복제**하고 CSS만 공유한다. 기존 지도 회귀 위험은 0이지만, 줌·패널 동작이 두 벌이 되어 이후 사용성이 갈라질 수 있다. 같은 사용성을 오래 유지하려면 1단계를 권한다.

### 데이터 배치(제안)

| 파일 | 내용 |
| --- | --- |
| `data/mission-story-maps/main-m05/concept-map.json` | 이 초안을 승인 후 옮긴 원본. `drafts/` 원본은 기록으로 남김 |
| `scripts/build_mission_story_maps.py` | `check_concept_map_v2.py`와 같은 검사 후 `src/data/generated/mission-concept-map-main-m05.json`으로 복사. `data:build`에 추가 |
| `src/missionConceptMap/types.ts` | 이 JSON 형식의 TypeScript 형식 |

`data/knowledge-maps/`와 `map-registry.json`에는 넣지 않는다(기술 지도 메뉴에 나타나지 않게).

## 6. 회귀 위험

| 위험 | 대비 |
| --- | --- |
| 1단계 추출 중 viewport 동작이 미세하게 바뀜(첫 진입 맞춤, `framedFor`) | 기존 `map-immersive-workspace.spec.ts`의 "딥링크 노드가 화면 안", "읽기 크기 ≠ 전체 보기"가 잡는다. 추가로 추출 전후 viewBox 값을 비교하는 시험을 권장 |
| `order` 정렬 추가가 기존 지도 배치를 바꿈 | 기존 데이터에 `order`가 없으면 정렬 결과가 같아야 한다. 생성 JSON 10개로 Vitest 스냅숏 비교 |
| 전역 `.map-*` CSS를 개념지도 CSS가 덮어씀 | 새 규칙은 `.mission-concept-map` 아래로 한정 |
| 하단 시트 43vh가 개념지도 패널(항목 10개)에 좁음 | 패널 항목을 펼침식으로. 기존 시트 높이는 바꾸지 않는다 |
| 새 주소가 기존 `/missions/:missionId`와 겹침 | react-router-dom 7.18.3은 선언 순서가 아니라 경로의 구체성으로 고르므로 `/missions/main-M05/story-map/concepts`가 이긴다(현재 `/missions/main-M05/guide`와 같은 방식). 라우트 추가 뒤 `/#/missions/main-M05`·`/guide`·`/story-map`·`/story-map/concepts` 네 주소를 Playwright로 확인 |
