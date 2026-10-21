# 06 · Codex 구현 인수인계 — B3-1 통합 인터랙티브 개념지도

> **시작 조건: Owner 승인과 GPT 콘텐츠·관계 검토가 끝난 뒤.** 이 문서는 그때 쓸 계약이다. 지금 단계에서는 구현하지 않는다. 기존 기술 지도 파일을 바꾸는 1단계는 Owner Gate("기존 knowledge map")이므로 별도 승인이 필요하다.

## 1. 데이터 원본

| 항목 | 내용 |
| --- | --- |
| 원본 | `drafts/b3-1-visual-story/concept-map-v2/concept-map-v2.json` (schema `0.2-draft`). 승인 후 `data/mission-story-maps/main-m05/concept-map.json`으로 옮기는 안(04 문서 5절) |
| 검사 | `python -I -X utf8 drafts/b3-1-visual-story/concept-map-v2/_tools/check_concept_map_v2.py` — 생성 단계에 같은 검사를 넣는다. FAIL이면 빌드를 멈춘다 |
| 형식 요약 | `nodes[]`: `id`·`label`·`domain`(general·aws·common)·`conceptType`·`region`·`order`·`importance`(core·supplementary)·`implementationStatus`·`summary`·`description`·`b31Note?`·`termIds[]`·`relatedTermIds?`·`storyScenes[]`·`legacyIds[]` / `relations[]`: `id`·`from`·`to`·`type`(6종)·`scope`(general·aws·cross·shared)·`importance`·`label`·`description`·`source[]`·`storyScenes[]`·`legacyId?`·`path?`·`pathStepIds?`·`relatedTermIds?`·`comparisonNote?`·`perSystem?` / `contrasts[]` / `views[]` / `regions[]` / `learningOrder[]` / `linkPolicy` / `sources[]` / `scenes[]` |
| 파생 규칙 | 보기별 노드 = `views[].nodeDomains`에 든 domain. 관계 = `relationScopes`에 든 scope이며 양 끝이 보일 때. 보기·선택·관련 장면·패널 내용은 모두 이 한 파일에서 계산한다(목록을 따로 적지 않는다) |
| 이전 원본 | `scene-04/concept-map.json`은 기록으로 남긴다. 새 화면은 읽지 않는다 |

## 2. UX 계약 (요약 — 자세한 것은 03-interaction-spec.md)

| # | 계약 | 03 문서 |
| --- | --- | --- |
| U1 | 보기 세 가지(전체·일반망·AWS). 전체 보기 첫 화면 = 핵심 노드 23·핵심 관계 31. 일반망 = 26·34, AWS = 15·17(보충 포함) | 3절 |
| U2 | 보충 토글. 노드를 고르면 보충 이웃이 그 선택 동안 나타난다 | 4절 |
| U3 | 노드 선택 = 기존 지도와 같은 강조·약화·패널. 흐름은 그 노드에 닿는 구간만, 비교 카드 상대는 "≠" 테두리 | 5-1 |
| U4 | 관계 선택(패널 목록·캔버스 선) → 관계 패널 | 5-2 |
| U5 | 흐름 칩 3개(GF01·GF02·AF01). AF01은 Route Table·SG를 강조하지 않는다 | 5-3 |
| U6 | 보기 전환 시 선택 유지·해제 규칙과 안내 문구, 전환 뒤 Fit | 6절 |
| U7 | 노드 패널 10항목 순서, 관계 패널, 비교 카드 펼침. 데스크톱 겹침 패널·모바일 하단 시트는 기존 CSS | 7절 |
| U8 | 딥링크 `view`·`node`·`rel`·`flow`·`more`·`term`, 우선순위 rel > flow > node > term, 잘못된 값 안내 | 8절 |
| U9 | 선 모양: 포함 실선 · 역할 실선+화살촉 · 흐름 초록(요청)/갈색 점선(응답) · 대응 보라 점선+마름모+≈ · 연관 회색 점선. 색만으로 구분하지 않음 | 10절 |
| U10 | 모바일: 960px 캔버스 가로 스크롤 + 하단 시트 + 목록 보기. 페이지 가로 넘침 없음 | 11절 |

## 3. 재사용할 기존 기능

| 기능 | 위치 | 방법 |
| --- | --- | --- |
| 지도 마크업·CSS(`.map-stage`·`.map-workspace`·`.map-canvas`·`.map-region`·`.map-node`·`.map-edge`·`has-focus`·`is-selected`·`is-highlighted`·`.map-detail-panel`·`.map-route-chips`) | `styles.css`·`repair.css` | 같은 클래스 이름으로 마크업. 새 규칙은 `.mission-concept-map` 아래 |
| viewport(zoom·pan·fit·reading·몰입·크기 측정) | `TechnologyFieldMap.tsx` `MapStage` 안 | 1단계에서 `useMapViewport`로 추출 후 사용(승인 없으면 복제) |
| 노드 카드 글자 줄바꿈 `labelLines`, 곡선 `edgePath` | 같은 파일 | 추출·export |
| 경로 패널 `RouteDetail` | 같은 파일 | 추출·export, 항목에 장면 표식 추가 |
| 용어사전 단추·`TermEncyclopediaLinks` | `TermEncyclopediaLinks.tsx` | 그대로 |
| 관련 개념 연결 `connectionsForTerm` | `ConceptConnections.tsx` | 그대로 |

## 4. 필요한 어댑터

```ts
// src/missionConceptMap/adapter.ts (순수 함수, React 없음)
type ViewId = 'all' | 'general' | 'aws';
type AdapterInput = { view: ViewId; showSupplementary: boolean; revealed: ReadonlySet<string> };
type AdapterOutput = {
  graph: KnowledgeMap;              // 기존 형식. nodes: 보이는 노드, edges: 보이는 관계(흐름은 구간 엣지로 펼침)
  flows: LearningRoute[];           // 보이는 흐름 관계 → 칩
  edgeMeta: Map<string, { relationId: string; segment?: number; stepId?: string }>;
  hiddenPathNodes: Map<string, string[]>; // 흐름 ID → 이 보기에서 숨은 경로 노드
};
export function toKnowledgeMap(data: ConceptMapData, input: AdapterInput): AdapterOutput;
export function nodeForTerm(data: ConceptMapData, termId: string): string | null;
export function panelModel(data: ConceptMapData, nodeId: string, view: ViewId): NodePanelModel; // 7-1의 10항목
```

| 변환 | 규칙 |
| --- | --- |
| 노드 | `id`=그대로, `termId`=`termIds[0]`, `label`·`labelKo`=`label`, `nodeRole`= core→`core`·supplementary→`foundation`, `layer`= "일반망 · 장비 · 예시" 식 글자, `primaryRegion`=`region`, `nodeOrigin`=`field` |
| 관계 | `relation`=`cm-contains`·`cm-role`·`cm-flow`·`cm-corresponds`·`cm-associated`(04 문서 4절), `reason`=`description`, `confidence`=`HIGH`, `evidenceType`=`source[0]`의 kind, `id`=관계 ID(흐름 구간은 `GF01#2` 식) |
| 지역 | 보이는 노드가 있는 `regions`만, `order` 순. `layout`은 보기마다 계산해 넣는다 |
| 흐름 | `LearningRoute{id, label, description, nodeIds: path(보이는 것만), scope:'mission'}` |
| 기본 관계 표시 | `isOverviewEdge = edge => importance==='core'`(기존 하드코딩 목록 대신 인자로) |

## 5. 화면과 탐색 구조

| 화면 | 주소(제안 · Owner Gate) | 내용 |
| --- | --- | --- |
| 미션 상세 | `/#/missions/main-M05` (있음) | "미션 스토리맵" 진입 카드 추가는 스토리맵 통합 작업에서 |
| 미션 스토리맵 | `/#/missions/main-M05/story-map` | Scene 01 → 02 → 03-A → 03-B → 04(이 지도). 이번 범위 밖 |
| 개념지도 바로가기 | `/#/missions/main-M05/story-map/concepts` | 같은 `MissionConceptMap` 컴포넌트. 머리에 "스토리맵 처음부터"·"B3-1 미션으로" |
| 기술 지도 메뉴 | 바꾸지 않음 | `map-registry.json`·`knowledgeMapLoader.ts`에 넣지 않는다 |

## 6. 회귀·수용 시험 기준

### 6-1. 기존 기능 회귀 (1단계 추출 PR과 이후 모든 PR)

- `npm run build`, `npm test`(Vitest 전체) 통과.
- `npm run test:map-interaction`(Playwright) 중 `technology-field-map.spec.ts` 5개, `map-immersive-workspace.spec.ts` 8개 **모두 통과**. 하나라도 시험을 고쳐서 통과시키지 않는다.
- 추출 전후 같은 주소(`/#/maps/network-web-protocol?mission=main-m05`, `/#/maps/frontend?mission=main-m01&term=local-storage`)의 viewBox·노드 위치가 같음(새 시험 권장).
- 생성 JSON(기존 지도 10개) 바이트 변화 없음.

### 6-2. 개념지도 수용 (새 시험)

| ID | 확인 | 기대 |
| --- | --- | --- |
| A1 | 데이터 검사 | `check_concept_map_v2.py` PASS |
| A2 | 어댑터 단위 | 보기 × 보충(6경우) 노드·관계 수가 05-content-qa 3절 표와 같다. 고립 0. GF01에서 스위치를 숨기면 방화벽 → 공개 웹 서버 구간 |
| A3 | 첫 화면 | 전체 보기, 노드 23개, 교차 대응선 5개, 패널 닫힘 |
| A4 | 노드 선택 | `gen:firewall` 선택 → `is-selected` 1개, 강조 관계에 GN13·GN14·GN16, 보충 이웃(경계 구역·상태 추적) 표시, URL `node=gen:firewall` |
| A5 | 비교 카드 | `gen:dmz` 선택 → `aws:subnet`에 "≠" 표시, 둘 사이에 관계선 없음, 패널에 CT02 |
| A6 | 보기 전환 | `gen:access-control` 선택 중 AWS 보기 → 선택 해제 안내 + "Security Group" 링크. `com:public-ip` 선택 중 전환 → 선택 유지 |
| A7 | 관계 선택 | 패널에서 CR02 → 관계 패널에 공통점·차이점, URL `rel=CR02` |
| A8 | 흐름 칩 | AF01 → 방문자·인터넷·IGW·ENI·Nginx 강조, Route Table·SG 강조 안 됨 |
| A9 | 딥링크 | `?view=general&node=gen:dmz`, `?term=security-group`, `?node=없는값`(안내 + 전체 지도), `?rel=CR03&node=gen:nat`(rel 우선) |
| A10 | 용어사전 | `aws:subnet` 패널에 `public-subnet`·`subnet` 두 링크, `gen:nat` 패널에 `nat-gateway` 링크 **없음** |
| A11 | 데스크톱 패널 | 기존 시험과 같이 패널이 지도를 줄이지 않고 겹친다 |
| A12 | 모바일 390·360 | 하단 시트, 페이지 가로 넘침 없음, 목록 보기에서 노드 선택 가능 |
| A13 | 키보드 | Tab으로 노드, Enter로 선택, 패널 관계 항목 Tab·Enter |
| A14 | 문구 | 일반망 예시 노드 14개 패널에 "B3-1에서는" 항목, AWS 노드 패널에 "2026-10-14 기록" 표지 |

## 7. 변경 금지 범위

- Scene 01~03 SVG·생성기·문서, `scene-04/`의 SVG·JSON·문서.
- 기존 기술 지도 데이터(`data/knowledge-maps/**`), 생성 지도 JSON, `map-registry.json`, B3-1 overlay.
- 기존 학습 가이드(`content/mission-guides/main-m05/**`, `B31MissionGuide.tsx`), 개념 연결 데이터, 용어사전 데이터(05 문서 5절의 차이는 기록만).
- `TechnologyFieldMap.tsx`·`knowledgeMapTypes.ts`·지도 CSS: **1단계 승인 전에는 변경 금지.** 승인 후에도 동작 보존 추출만.
- AWS 자원, `main` 직접 병합, 배포.

## 8. 작업 순서 제안

1. Owner 승인 사항(handover.md) 결정 반영 → 데이터 수정 → 검사 PASS.
2. (승인 시) 1단계 추출 PR — 기존 시험 전부 통과, 화면 비교.
3. 데이터 생성 단계 + 어댑터 + 단위 시험(A1·A2).
4. `MissionConceptMap` 화면 + 바로가기 라우트 + 수용 시험(A3~A14).
5. 실제 브라우저·휴대전화 시각 QA, Owner 검토. 스토리맵 전체 통합은 별도 작업.
