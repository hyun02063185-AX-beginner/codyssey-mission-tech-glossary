# B2-1 Concept Explorer C2 — 발견성과 탐색 동선 개선

검증일: 2026-10-25 (Asia/Seoul). 기준 커밋: `2e55d805613261e6a1afe01649e4efc26ff9a4a0`. 브랜치: `content/b2-1-story-map-foundation`. 기준 보고서: [C1 검증](b21-c1-verification.md).

**C1 기능을 보존한 비공개 화면 개선이다. 공개 통합·Push·병합·배포를 수행하지 않았다.** 완료 커밋은 Git 이력과 최종 응답에 남긴다. 작업 폴더는 `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`다.

## 개선 결과

### PC: 지도 진입을 같은 화면에서 발견

- 일곱 영역을 왼쪽의 간결한 탐색 열로 옮겼다. 오른쪽에는 처음부터 지도 시작 안내와 **관계 지도 시작 · Generator** 버튼을 보여 준다. 예시는 원본 R23의 Generator → Iterator·종류·label을 직접 읽는다. 예시 시작은 기존 필터를 해제해 R23을 바로 볼 수 있게 한다. 새 개념이나 관계를 작성하지 않았다.
- 1280×720px 첫 화면에서 시작 버튼 전체가 보인다. 실제 버튼 Y=653.94px, 높이=52.39px로 하단은 706.33px다. 버튼 선택은 Generator URL/선택 상태를 만들고 지도 제목으로 초점을 옮긴다.
- 영역 선택 뒤 개념 목록과 Canvas를 같은 열에서 이어 보여 준다. PC Canvas의 실측 `clientWidth`는 **948px**다. 기존 두 열의 상세 패널 때문에 지도 폭이 줄어들던 배치를 바꿔, 관계 목록·상세는 지도 아래에서 함께 읽는다.
- 제목·문장·통계의 반복을 줄였고 지도는 실행 순서가 아니라는 안내를 유지했다. 선택한 개념/연결된 개념은 색과 문자 표식을 함께 사용한다. 선택한 관계는 원본 방향·유형·label을 Canvas 위와 상세에 표시한다.

### 모바일: 영역 → 개념 → 관계 → 상세 → 비교

- 360/390px에서 영역을 선택하면 영역 목록을 접고 선택 영역 이름과 **영역 바꾸기** 버튼을 남긴다. 내용은 삭제하지 않고 다시 펼칠 수 있다. 영역 카드는 기존 143px 최소 높이에서 불필요한 대표 개념 반복을 제거해 82px로 정리했으며, 실제 개념 목록과 원본 설명은 보존했다.
- 상단 고정 바로가기에 1 영역 / 2 개념 / 3 관계 / 4 상세 / 5 비교를 표시한다. 이 번호는 UI 위치 안내이며 실행 순서가 아니다. 아직 선택하지 않은 내용의 바로가기는 비활성으로 표시한다.
- 같은 Generator 탐색의 전체 페이지 높이는 390px에서 3,928→3,402px, 360px에서 3,981→3,451px다. 원문 설명·비교를 보존하고 영역 접기와 섹션 배치로 동선을 정리했다. [측정 자료](../../reports/b21-c2/page-size-comparison.json).
- 바로가기는 스크롤뿐 아니라 실제 대상 제목으로 초점을 이동한다. 영역 목록의 접기/펼치기와 대상 화면이 **같은 React commit에 반영된 뒤** 초점·스크롤을 적용한다. 고정 막대가 제목을 덮지 않는지, 다음 Tab이 개념 선택으로 이어지는지 검사했다.
- 개념 선택은 선택 문맥이 있는 Canvas로, 관계/비교 선택은 해당 상세로 안내한다. 강사 안내 중에는 원본 질문·현재 단계를 유지하며 **현재 개념 지도 보기 ↔ 강사 안내로 돌아가기**로 이동한다.

### Canvas와 상세·비교

- 기존 이동·확대·전체 맞춤·선택 영역 읽기를 유지했다. 읽기 모드는 선택 카드 전체를 화면 안에 두고, 이웃 개념을 위한 공간을 배분한다. 관계가 많아도 선택 개념 이름은 **화면상 13.5px 이상**이다. 전체 개요나 연결 전체를 축소해서 보는 기능과 읽기 기능을 구분한다.
- **연결 맞춤**은 선택 관계의 양 끝을 함께 보여 준다. **지도 크게 보기**는 같은 Canvas를 540px 높이로 늘리며 기본 크기로 돌아올 수 있다. 모바일 조작 버튼은 44×48px 이상이다. 확대 창이나 별도 복제 지도를 만들지 않았다.
- 원본 45개 SVG 이름을 말줄임 없이 표시하고 카드 안에 들어가는지 확인했다. 소스상의 노드 위치와 관계 통로는 C1 adapter/B3 엔진을 그대로 쓴다.
- 비교는 PC에서 원본 두 설명을 나란히, 모바일에서 차례로 읽는다. 10개 비교의 문장·출처·검증된 복습 링크를 유지했다. 포함·종류·사용·역할·호출의 의미와 scope도 변경하지 않았다.

## 변경 범위와 보호 확인

| 파일 | C2 변경 |
| --- | --- |
| `src/b21ConceptExplorer/ConceptExplorer.tsx` | 기존 섹션 재배치, 원본 R23 시작 안내, 영역 접기, 단계별 이동·초점 |
| `src/b21ConceptExplorer/ExplorerCanvas.tsx` | 읽기 크기 하한·선택 카드 가시성, 연결 맞춤·높이 확장, 안내 복귀 버튼 |
| `src/b21ConceptExplorer/explorer.css` | PC 탐색 열·넓은 지도, 모바일 순서·고정 탐색, 비교 두 칸 |
| `scripts/b21-preview/ConceptExplorerPreview.tsx` | 전용 검토 배너를 버전 중립 명칭으로 변경. 라우트·왕복 동작 불변 |
| `scripts/check_b21_concept_explorer.mjs` | C1 시나리오 유지, C2 UX 검사 호출·접힌 영역 재열기·C2 증빙 경로 |
| `scripts/b21_concept_ux_checks.mjs` | 첫 화면 진입·읽기 크기·초점·확대·터치 검사 |
| 이 문서, `reports/b21-c2/` | 결과·스크린샷·실패 이력·보호 검증 |

`adapter.ts`, `state.ts`, 기존 C1 단위 테스트와 `b21:concept-build-check`는 변경하지 않았다. package 명령·의존성도 그대로다. C1 검사는 삭제하지 않았으며, 접히는 영역을 재열고 같은 선택/해제를 검사한다. 기존 128단계 QA를 C2의 개별 검사로 복제하지 않았다. 검사 결과는 `reports/b21-c2/`에 저장해 C1 증빙을 덮어쓰지 않는다. 필요하면 `B21_CONCEPT_REPORT_DIR`로 별도 출력 경로를 지정할 수 있다.

보호 대상은 원본 candidate JSON·시안·v3.7 원고/해시·128단계 React 강의·U4 카탈로그/가이드 연결·발표자/주소/복습·B3 지도·공개 App/미션 카드·배포 설정이다. 기준의 기존 2,999개 파일 중 위 표의 기존 5개 전용 UI/검사 파일 외에는 변경 0건이다. 데이터 빌드가 만든 33개 생성 파일은 LF 정규화 후 내용 동일성을 확인하고 복원했다. 기준과의 파일/해시 비교는 [`protection-results.json`](../../reports/b21-c2/protection-results.json)에 남긴다. 보류 개념·관계의 매핑을 추가하지 않았으며 v2 03a/03b를 변환하지 않는다.

## QA 결과

Windows / Chrome 155.0.8059.85, 1280×720·1280×900 / 390×800 / 360×800, 설치 글꼴, reduced motion 환경이다.

| 검사 | 결과 | 근거 |
| --- | --- | --- |
| `b21:concept-check` | PASS | 기존 C1 287검사 유지 + C2 86검사 = 373 명시 checks, 추가 Playwright expect 포함 |
| 데이터 | PASS | 원본 45개념·24관계·10비교·7영역. 기존 18개 단위 검사와 모든 비교/안내 브라우저 검사 유지 |
| P1~P3 | PASS | 원본 6+6+5=17단계·질문·이전/다음·자유 모드 복원, 세 폭에서 안내↔지도 초점 왕복 |
| Story·사전 왕복 | PASS | 기존 검증 목적지·새로고침·원래 scene/step/back·선택 상태 복원·보류 항목 검사 유지 |
| 사전 CSS 격리 | PASS | 세 폭의 header/영역/workspace/상세/제목 등의 geometry·typography 전후 일치 |
| C2 모바일 | PASS | 대상 제목 초점과 가시성·영역 접기·키보드 연속성·확대 복원·터치 입력 카메라 이동 |
| `npm test`, 최종 `vitest run` | PASS | 23파일·333테스트, 기존 수와 검사 유지 |
| `npm run build` | PASS | 기존 Foundation private build-check 포함. 기존 대형 chunk 경고 유지 |
| `b21:concept-build-check` | PASS | 기존 명령 그대로, 비공개 entry 별도 빌드와 공개 dist 유출 검사 |
| 타입 검사 | PASS | `tsc -b`, 비공개 Preview entry strict type check |
| `b21:v3-validate`, `b21:eol-check` | PASS | 8장면·128단계·7영역, LF/CRLF 승인 해시 유지 |
| `b21:v3-parity` | PASS | 기존 128단계 × 3폭 = 384화면·5,269단언. 허용치 변경 없음 |
| `b21:html-qa` | PASS | 기존 원본 6,402단언, 세 폭 PASS. 실패 이력과 단독 재실행 구분 |
| `b21:u4-ui-check` | PASS | 기존 641검사, 허용치 변경 없음 |
| `b21:u4-check` | PASS | 기존 84검사, 실제 사전·가이드·분야 지도·B3 복귀 우선순위 |
| `b21:router-check` | PASS | 기존 U3 209검사, 128단계·주소·복습·발표자 |
| 물리 모바일·Safari·macOS·프로젝터 | SKIP | Chrome viewport·CDP 터치 입력과 실제 기기 검증을 구분 |
| Owner 시각·교육 승인 | 검토 대기 | 비공개 Preview로 검토 가능. 기술 PASS와 구분 |

실제 터치 검사는 Chrome에 touchStart/move/end 입력을 보내 카메라 이동을 확인한 것이다. 실제 휴대전화나 학습 효과 검증으로 표현하지 않는다.

최종 미해결 FAIL은 없다. 아래 초기 실패의 원인과 최종 PASS를 구분해 보존했다. C2 추가/유지 검사에서 허용치나 원본 콘텐츠를 변경해 통과시킨 항목은 없다.

### 실패 이력

1. C2 모바일 동선 검사 **FAIL (149 checks)**: 비교 카드에서 다른 영역을 고른 뒤 제목에는 초점이 있었지만, 영역 목록을 접는 렌더와 스크롤 적용 시점이 달라 개념 버튼이 화면 밖에 남았다. `useLayoutEffect`에서 같은 commit의 레이아웃이 확정된 뒤 초점/스크롤을 적용하도록 수정했다. 대상 제목 가시성·첫 개념의 Tab 연결 기준을 유지했고 최종 373검사 PASS했다. [초기 결과](../../reports/b21-c2/attempt-01-results.json), [화면](../../reports/b21-c2/attempt-01-viewport.png).
2. 기존 HTML QA **FAIL (802 assertions)**: 여러 브라우저 검사를 실행하던 중 Chrome `Page.captureScreenshot: Unable to capture screenshot` 프로토콜 오류가 발생했다. 콘텐츠/허용치/원본 harness를 바꾸지 않고 다른 브라우저 검사가 끝난 뒤 같은 명령을 단독 재실행해 **6,402단언·세 폭 PASS**했다. [초기 로그](../../reports/b21-c2/attempt-02-html-capture.log). `regressionDiffs`는 C1에도 기록된 과거 Scene 08 기준과 승인 v3.7의 기존 차이 정보이며 이번 C2 실패가 아니다.

## 시각 검수 자료

| 화면 | PC | 390px | 360px |
| --- | --- | --- | --- |
| 첫 화면 | [1280×720](../../reports/b21-c2/first-screen-1280.png) | [390](../../reports/b21-c2/first-screen-390.png) | [360](../../reports/b21-c2/first-screen-360.png) |
| 지도 읽기 viewport | [PC](../../reports/b21-c2/map-viewport-1280.png) | [390](../../reports/b21-c2/map-viewport-390.png) | [360](../../reports/b21-c2/map-viewport-360.png) |
| 관계 선택 | [PC](../../reports/b21-c2/relation-1280.png) | [390](../../reports/b21-c2/relation-390.png) | [360](../../reports/b21-c2/relation-360.png) |
| 비교 카드 | [PC](../../reports/b21-c2/comparison-card-1280.png) | [390](../../reports/b21-c2/comparison-card-390.png) | [360](../../reports/b21-c2/comparison-card-360.png) |
| 강사 안내 | [PC](../../reports/b21-c2/guided-1280.png) | [390](../../reports/b21-c2/guided-390.png) | [360](../../reports/b21-c2/guided-360.png) |
| 넓힌 모바일 조작 영역 | — | [390](../../reports/b21-c2/expanded-viewport-390.png) | [360](../../reports/b21-c2/expanded-viewport-360.png) |

전체 페이지 캡처 `overview/exploration/comparison-*`와 상세 캡처도 같은 폴더에 있다. C1의 [PC 전체 탐색](../../reports/b21-c1/exploration-1280.png), [360px 전체 탐색](../../reports/b21-c1/exploration-360.png)을 변경 전 자료로 보존했다. PC 첫 화면과 360px 지도 viewport·PC 비교 카드를 직접 확인했고, 자동 검사는 세 폭 모두에서 가로 넘침·이름 잘림·선택 카드 가시성·조작 크기·복귀를 검사했다.

## Owner 검토 및 남은 범위

```powershell
Set-Location C:\Users\hyun0\codyssey-mission-tech-glossary-b21-story
npm.cmd run b21:preview
```

- 전체 지도: <http://127.0.0.1:4179/?view=concept-explorer#/concept-explorer>
- Generator: <http://127.0.0.1:4179/?view=concept-explorer#/concept-explorer?node=generator>
- 안내 P2: <http://127.0.0.1:4179/?view=concept-explorer#/concept-explorer?mode=guided&path=P2>
- 기존 진입: <http://127.0.0.1:4179/> → **전체 개념지도**, 또는 U4 Scene 08의 기존 비공개 연결.

기존 Foundation / v3 React 강의 / Router 강의 / U4 연결 검토 모드는 유지한다. 서버는 loopback 전용이고 공개 `/missions/main-M03/story/concepts`는 등록하지 않았다.

남은 것은 Owner의 PC/모바일 배치 검토, 물리 기기 시연, 별도 공개 통합 승인이다. 미완성 버튼이나 임의의 새 매핑을 남기지 않는다. 학습 운영 정책의 Story=흐름·지도=관계·사전=확장 역할을 유지하며, 실제 학습 효과는 시범 수업 검증 범위다.

로컬 커밋까지만 수행한다. 저장소 지침상 사용자 직접 Push 참고 명령은 `git push origin content/b2-1-story-map-foundation`이며, 이번 작업에서 실행하지 않는다.
