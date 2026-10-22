# B3-1 노드 위치 안정화·선택 강조

- 작업일: 2026-10-22 (Asia/Seoul)
- 브랜치: `feature/b3-1-interactive-concept-map-poc`
- 시작 커밋: `0406f0930ff9ba56912ad3a7224537dd65af9922`. 작업 전 `git ls-remote`로 GitHub 대상 브랜치도 같은 SHA임을 확인했다.
- 상태: 로컬 구현·자동 QA·화면 확인 완료, Owner UX 검토 대기. Push·main 병합·배포 없음.
- 36개 노드·57개 관계와 JSON, 기술지도 엔진·전역 CSS·공개 route, 가이드·스토리맵·Scene 원본은 수정하지 않았다.

## 원인과 수정

이전에는 `adaptConceptMap()`이 선택 이웃을 임시 표시하면 `layoutConceptMap()`이 그 표시 목록으로 행 좌표를 다시 매겼다. 숨겨졌던 경계 구역이나 스위치가 원래 순서 중간에 삽입되면서 DMZ·공개 웹 서버 등이 한 행씩 밀렸다. port 분배·세로 트랙·가로 rail·컬럼 폭도 같은 표시 목록에서 다시 계산됐다.

이제 **데이터 객체 + 보기(all/general/aws)** 단위로 전체 노드·관계의 기준 배치를 한 번 계산하고 캐시한다. `adaptConceptMap()`의 자동 표시·필터·강조는 유지하면서, `layoutConceptMap()`은 기준 좌표·경로 중 보이는 항목과 화면 범위만 추린다. 선택·보충 on/off·선택 해제·같은 보기로 복귀할 때 기존 노드와 경로를 다시 배정하지 않는다.

### 보충 노드 자리

| 검토한 방식 | 판단 |
| --- | --- |
| 전체 원래 순서대로 모든 자리를 미리 예약 | 좌표는 안정적이지만 숨겨진 경계 구역·스위치·상태 추적 등이 핵심 노드 사이에 빈 행을 남긴다. |
| 핵심 노드를 위에서부터 연속 배치하고 보충 노드를 아래에 예약 | **채택.** 핵심 사이에 구멍이 없고, 보충 표시 시 컬럼 아래쪽만 확장한다. 각 그룹 안에서는 원래 `order`를 따른다. |

보충 노드가 감춰져 있을 때 컬럼 배경 높이는 마지막 표시 카드까지로 줄인다. Fit도 표시 카드와 경로의 범위를 사용해 불필요한 세로 여백을 줄인다. 가로 lane 폭은 전체 관계의 수용량으로 미리 확보해 선택 중에는 늘어나지 않는다. 일반망·AWS 보기의 기존 보충 기본 표시 정책도 유지했다.

전체 관계 보기의 고정 좌표 예:

| 노드 | entry → 경계 라우터 → 방화벽 → DMZ 선택 후 좌표 |
| --- | --- |
| DMZ | 모든 상태 `(30, 170)` |
| 방화벽 | 모든 상태 `(444, 170)` |
| 공개 웹 서버 | 모든 상태 `(444, 272)` |
| 스위치 | 표시될 때 항상 `(444, 374)`, 숨김 후 다시 나타나도 동일 |

### 관계선

- 이전 edge lane·12단위 평행 트랙·10단위 카드 끝 여유·둥근 직각 경로를 유지했다.
- 전체 보기 데이터를 기준으로 port·lane·rail을 배정하므로 새 관계가 표시돼도 기존 관계의 진입점·도착점·SVG `d`가 변하지 않는다.
- GF01/GF02의 숨겨진 스위치를 건너뛰는 축약 구간도 미리 배정한다. 같은 출발 index를 쓰더라도 도착지가 다른 축약/완전 구간은 서로 다른 내부 edge ID를 사용한다. authored 관계 ID와 A/R/W 단계는 유지한다.
- **구간의 의미가 바뀌는 경우는 구분한다.** 스위치를 표시하면 `방화벽 → 웹 서버(경유지 축약)` 대신 `방화벽 → 스위치 → 웹 서버`를 표시한다. 이는 서로 다른 구간의 교체이며, 동일한 출발·도착/단계 구간을 재라우팅한 것이 아니다. 두 형태 모두 고정 배치에서 가져온다.

선택 노드 가림 방지·읽기 크기·Fit·사용자 확대/이동은 기존 카메라 정책을 유지한다. **카메라 이동에 따른 화면 픽셀 변화와 노드 월드 좌표 변화를 분리해 검증했다.**

## 선택 강조·테마

모든 변경은 `.mission-concept-map` 안에 있다. `TechnologyFieldMap`의 스타일·엔진을 변경하지 않았다.

| 상태 | 스타일 |
| --- | --- |
| 선택 노드 | opacity **1**, 진한 배경/밝은 이름(라이트), 밝은 민트/진한 이름(다크), **3.5** 테두리와 그림자 |
| 직접 연결 노드 | opacity **0.95**, 관련 배경·테두리 |
| 무관한 노드 | opacity **0.25**, DOM·클릭·키보드 선택 유지 |
| hover / focus | opacity **1**로 복원, 읽을 수 있는 배경·강조 테두리 |
| `≠` 비교 대상 | opacity **0.95**, 주황 점선 테두리와 기존 비교 문구 유지 |
| 선택 관계·통신 흐름 | opacity **1**, 밝은 외곽선 유지, 해당 노드는 연결 노드와 같은 정책 |
| 무관한 관계선 | opacity **0.055** |
| 선택 해제 | 표시 노드 모두 opacity **1** |

선택 배경과 글자색은 동시에 바뀐다. fill 전환 중 흰 글자가 밝은 배경에 잠시 놓이지 않도록 배경색 애니메이션을 없앴다. 테두리·그림자 전환은 유지한다. 기존 사이트의 accent theme과 별도로 OS의 `prefers-color-scheme: dark`에 대응하는 개념지도 전용 색을 적용했다. 선택/hover 이름 대비 **4.5:1 이상**을 브라우저에서 검사했다.

## 검증 결과

| 검사 | 결과·근거 |
| --- | --- |
| `npm test` | **126개 PASS**, [로그](vitest.log). 기존 123개 + 보기별 안정성 3개 |
| `npm run build` | **PASS**, [로그](build.log). 기존 큰 공통 번들 경고 유지 |
| `npm run test:map-interaction -- --workers=2` | **119개 PASS**, [로그](playwright-full.log). 기존 111개 + 네 viewport × light/dark 안정성 검사 8개 |
| 모델 안정성 | 세 보기의 가능한 노드·관계·흐름 선택을 core → full → core로 검사한 **573개 상태 조합**. 같은 보기의 좌표·port·SVG 경로가 동일하고 기준 배치 객체도 재사용 |
| 브라우저 안정성 | **152개 상태**, 노드 좌표 비교 **3,000회**, 기존 경로 비교 **4,920회** 모두 일치. [1280 light 요약](stability-1280-light.json), 다른 크기·테마의 `stability-*.json`도 함께 저장 |
| 카드 충돌·Fit 범위 | 기존 전수 경로 검사와 실제 둥근 SVG 경로 샘플링 검사 통과. 숨겨진 보충 자리까지 고려한 경로가 표시 카드 내부를 통과하지 않음 |
| 상호작용 | 흐려진 노드 실제 클릭·focus/Enter, hover/focus 복원, 선택 해제, 비교 대상·관계·흐름 강조 통과 |
| 기존 기능·회귀 | 확대/축소·Fit·읽기 크기·pan·선택 가림 방지, 패널/시트 열기·닫기·스크롤, 기존 기술지도 13개와 가이드·검색·테마 회귀 포함 통과 |
| `git diff --check` | PASS |

새 브라우저 검사는 entry → 경계 라우터 → 방화벽 → DMZ → 공개 웹 서버 → 스위치 → 흐린 노드 클릭/키보드 → 관계 → 흐름 → 선택 해제 → 보충 on/off → 일반망 선택 → AWS 흐름 → 전체 복귀 순서다. 세 보기의 좌표 기준을 각각 보관하며 같은 보기로 돌아온 뒤에도 비교한다.

### 수정 전·후 측정

동일한 노드 연속 선택 시나리오의 [수정 전 원본](before.json) / [수정 후 원본](after.json). 각 JSON에 모든 표시 노드의 transform 좌표와 관계선 `d`를 저장했다.

| 화면·테마 | 핵심 노드 최대 좌표 차이 전 → 후 | 기존 경로 불일치 관측 전 → 후 |
| --- | --- | --- |
| 1280×900 light / dark | **102 → 0** | **96 → 0** |
| 1000×900 light / dark | **102 → 0** | **96 → 0** |
| 390×844 light / dark | **102 → 0** | **96 → 0** |
| 360×844 light / dark | **102 → 0** | **96 → 0** |

좌표 단위는 지도 월드 단위다. 경로 불일치는 여러 선택 상태에서 처음 관측한 같은 구간의 경로와 다른 경우를 센 횟수이며, 서로 다른 관계 96개라는 뜻은 아니다. 수정 후에는 보충 노드까지 포함한 모든 재등장 노드의 좌표 차이도 0이다.

## 연속 선택 화면

같은 1280px Fit 화면에서 패널을 닫고 선택 강조만 비교:

1. [경계 라우터](1280-after-border-router-overview.png)
2. [방화벽](1280-after-firewall-overview.png)
3. [DMZ](1280-after-dmz-overview.png)

읽기 크기와 설명 패널/시트가 열린 실제 탐색 화면도 저장했다. 선택 노드를 가리지 않기 위해 카메라가 이동할 수 있다.

| 화면 | 연속 선택 후: 경계 라우터 / 방화벽 / DMZ | 방화벽 수정 전 | 다크 수정 후 |
| --- | --- | --- | --- |
| 1280×900 | [1](1280-light-after-border-router.png) / [2](1280-light-after-firewall.png) / [3](1280-light-after-dmz.png) | [전](1280-light-before-firewall.png) | [다크](1280-dark-after-firewall.png) |
| 1000×900 | [1](1000-light-after-border-router.png) / [2](1000-light-after-firewall.png) / [3](1000-light-after-dmz.png) | [전](1000-light-before-firewall.png) | [다크](1000-dark-after-firewall.png) |
| 390×844 | [1](390-light-after-border-router.png) / [2](390-light-after-firewall.png) / [3](390-light-after-dmz.png) | [전](390-light-before-firewall.png) | [다크](390-dark-after-firewall.png) |
| 360×844 | [1](360-light-after-border-router.png) / [2](360-light-after-firewall.png) / [3](360-light-after-dmz.png) | [전](360-light-before-firewall.png) | [다크](360-dark-after-firewall.png) |

## 파일·재실행

- `src/missionConceptMap/conceptMapAdapter.ts`: 보기별 기준 배치 캐시, 핵심/보충 자리, 축약/완전 경로의 고정 배정·표시 투영.
- `src/missionConceptMap/ConceptMapCanvas.tsx`: 카메라 보정 주석을 고정 좌표 정책에 맞춤. 선택/줌/팬 동작은 유지.
- `src/missionConceptMap/missionConceptMap.css`: 선택·연결·비선택·hover/focus·다크 색. 전역 CSS 수정 없음.
- `src/missionConceptMap/conceptMapAdapter.test.ts`, `playwright/mission-concept-map-stability.spec.ts`: 모델·실제 렌더 안정성과 상호작용 검사.
- `scripts/qa_b31_stable_layout.mjs`: 재현 가능한 전후 연속 선택 캡처·좌표·경로 기록.

```powershell
npx vite --host 127.0.0.1 --port 4173
# 촬영하려는 단계의 소스를 실행 중일 때
node scripts/qa_b31_stable_layout.mjs before
node scripts/qa_b31_stable_layout.mjs after
```

## 남은 제약

- 전체 관계 수용량을 미리 배정해 기본 가로 폭이 조금 늘었다. 모바일·Fit은 개요용이며 작은 글자와 먼 연결은 확대·가로 이동으로 읽는다.
- 아래에 예약한 보충 노드와의 흐름은 위아래로 왕복할 수 있다. 원본 통신 순서는 보존했고 실제 단계 번호·상세 패널을 함께 제공한다.
- 패널을 열면 일부 이웃 카드가 가려질 수 있다. 선택 카드 가림 방지는 유지하며, 패널 닫기·Fit으로 전체 연결을 확인한다.
- 모든 선 교차 제거, 실물 휴대전화, Safari/Firefox, 모든 accent/OS 배율 조합, 공개 Pages 검증은 이번 범위에 포함하지 않았다.

Owner Push:

```powershell
git push origin feature/b3-1-interactive-concept-map-poc
```
