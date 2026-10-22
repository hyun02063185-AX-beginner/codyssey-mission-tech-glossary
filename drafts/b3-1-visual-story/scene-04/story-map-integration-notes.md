# Scene 04 · 미션 스토리맵 게시 연결 설계

> 후속 Codex 웹 통합을 위한 설계 메모. **이번에는 라우트·메뉴·컴포넌트를 구현하지 않았다.** 주소는 제안된 설계 계약이며 아직 구현되지 않았다. 공개 route 계약은 Owner Gate 영역이다.

## 1. 주소(제안)

| 화면 | 제안 주소 | 현재 사이트와의 관계 |
| --- | --- | --- |
| 미션 상세 | `/#/missions/main-M05` | 이미 있음(`src/App.tsx`의 `Mission`). 현재 B3-1 학습 가이드 진입 카드가 있다 |
| 스토리맵 | `/#/missions/main-M05/story-map` | 새 주소. 기존 `/missions/main-M05/guide`(학습 가이드)와 겹치지 않음 |
| 개념지도(바로가기) | `/#/missions/main-M05/story-map/concepts` | 새 주소. 스토리맵 마지막 장면을 바로 연다 |

미션 ID는 데이터에서 `main-m05`(소문자, 기존 지식지도·오버레이와 같음), 화면 주소에서 `main-M05`, 사용자 표기에서 `B3-1`로 쓴다(`concept-map.json`의 `missionId`·`publicMissionId`).

## 2. 장면 순서와 파일

| 순서 | 장면 ID | 제목 | 시안 파일 |
| --- | --- | --- | --- |
| 1 | `scene-01` | 일반 기업 네트워크 전체 구조 | `scene-01/enterprise-network-{desktop,mobile}.svg` |
| 2 | `scene-02` | 웹사이트 요청·응답 흐름 | `scene-02/request-response-{desktop,mobile}.svg` |
| 3 | `scene-03a` | 일반 기업망과 AWS의 구조·역할 비교 | `scene-03/network-aws-overview-{desktop,mobile}.svg` |
| 4 | `scene-03b` | B3-1 AWS 웹사이트 접속 조건 | `scene-03/network-aws-access-{desktop,mobile}.svg` |
| 5 | `scene-04` | 핵심 개념지도 | `scene-04/concept-map-{desktop,mobile}.svg` |

장면 ID는 `concept-map.json`의 `scenes`에 있다. 노드의 `firstScene`·`storyScenes`와 관계의 `scenes`가 이 ID를 쓴다.

## 3. 탐색 설계(구현하지 않음)

| 기능 | 설계 |
| --- | --- |
| 스토리맵 목차 → Scene 04 | 목차 다섯 항목 중 마지막. `/story-map/concepts`로도 바로 열린다 |
| Scene 04 → 앞 장면 | 지도 아래에 "앞 장면으로" 목록(scene-01 ~ scene-03b). 노드를 고르면 그 노드의 `storyScenes`만 강조한다 |
| 노드 → 관련 장면 | `linkPolicy.order` 순서를 따른다: ① `storyScenes[0]`의 장면 ② `termIds`가 있으면 `/terms/<termId>` ③ 둘 다 없으면 `summary`를 지도 안 말풍선으로 |
| 노드 → 용어사전 | `termIds`의 첫 ID를 기본으로 한다. 두 개인 노드(Subnet: `subnet`, `public-subnet`)의 우선순위는 Owner 판단 |
| 관계 → 설명 | 선이나 이름표를 고르면 `description`과 `scenes`를 보여 준다 |
| 미션 상세 복귀 | 스토리맵 머리의 "B3-1 미션으로" → `/missions/main-M05` |
| 학습 순서 | `learningOrder`를 지도 옆 안내로 보여 준다. 관계 그래프에는 그리지 않는다 |

## 4. 데이터 계약(`concept-map.json`)

| 위치 | 필드 | 뜻 |
| --- | --- | --- |
| 최상위 | `mapId`, `missionId`, `publicMissionId`, `title`, `question`, `status` | 지도 식별·제목. `status`는 `draft-owner-review` |
| `nodes[]` | `id`, `label`, `conceptType`(actor·aws-resource·aws-setting·address·software·network-role), `area`(A·B·C), `termIds[]`, `firstScene`, `storyScenes[]`, `summary`, `needsDetail` | `termIds`는 용어사전에 실제 있는 ID만. 없으면 빈 배열 |
| `relations[]` | `id`, `from`, `to`, `type`(표준 6종), `label`(화면 표시), `description`(Scene 03 후보 원문), `evidence`, `scenes[]`, `display`(line·nesting·dock·path) | 흐름은 `path`(`@internet` = 노드 아닌 경로 표시), `pathLabels`, `relatedTermIds` |
| `learningOrder[]` | `id`, `first`, `then`, `firstRefs[]`, `thenRefs[]`, `usedIn` | 관계 그래프와 분리 |
| `linkPolicy` | `order`, `doNotAutoLink[]` | 노드 선택 시 이동 순서, 자동 연결 금지 ID |

- SVG의 요소에는 같은 ID가 `data-node`·`data-rel`로 붙어 있다. 정적 SVG를 그대로 쓰더라도 노드·관계를 찾을 수 있다.
- 휴대전화용의 참조 상자는 `data-ref-of`가 원래 노드 ID를 가리킨다.
- 데이터를 고친 뒤에는 `_tools/check_data.py`를 먼저 실행한다. 기존 생성 데이터(`src/data/generated/`)에는 아무것도 넣지 않았다.

## 5. 웹 통합 때 확인할 것

- 기존 학습 가이드(`/missions/main-M05/guide`)·기술 지도(`/maps/network-web-protocol?mission=main-m05`)·개념 연결과 함께 미션 상세에 어떻게 놓을지(확정 정책: 기존 자료는 수정·통합하지 않음)
- 노드 선택 시 `/terms/<termId>`가 실제 상세 설명이 있는 페이지인지(용어 인덱스만 있는 항목은 3번 규칙으로)
- 휴대전화 실물에서의 표시(그림 칸 폭 960px 기준 노트북·휴대전화 전환. Scene 01·02는 904px, Scene 03은 960px)
