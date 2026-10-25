# B2-1 Concept Explorer C1 — 비공개 Owner Preview

검증일: 2026-10-25 (Asia/Seoul). 환경: Windows / PowerShell / Chrome 155.0.8059.85 / 1280px·390px·360px. 기준: `23968968780569bb28e08cd3e1494684d4ec9817`, 브랜치 `content/b2-1-story-map-foundation`, 폴더 `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`.

**구현 범위는 C1 비공개 Preview와 기술 QA다. Owner의 교육·시각 승인과 공개 서비스 통합은 완료로 선언하지 않는다. Push·병합·배포를 수행하지 않았다.** 완료 커밋은 Git 이력과 최종 응답에 남긴다.

## 1. 원본 시안에서 재사용한 부분

- `drafts/b2-1-story-map/scene-08/candidate-map.json`을 직접 읽는 SSOT projection으로 구현했다. 노드의 뜻·미션 이유·코드 단서·주의 문구, 관계의 ID·방향·유형·label·scope·근거, 비교의 양쪽 설명·출처와 P1~P3의 순서·질문·주의를 그대로 사용한다. 원본 JSON·독립 HTML 시안·storyboard는 수정하지 않았다.
- 원본 시안의 **7개 영역 → 개념 → 연결 관계/상세 → 비교** 탐색, 강사 안내/자유 탐색, 관계 유형 필터와 선택 해제를 React로 구현했다. 시안의 가상 Story·용어 패널 왕복은 실제 검증된 목적지로 대체했다.
- 원본 영역은 실행·CLI / 모듈·패키지 / 함수·계층 책임 / CRUD·파일 저장 / Iterator·Generator / Decorator / Type Hint·검증이다. 강의용 `lectureAreas`의 7개 묶음으로 덮어쓰지 않았다. CSV·요약·Model 등 원본에 없는 노드를 추가하지 않았다.
- 처음에는 영역 7개와 개념 수만 보여준다. 전체 관계선을 한꺼번에 노출하지 않는다. “개념지도는 실행 순서도가 아닙니다” 안내와 원본의 적용 범위를 유지한다.

## 2. B3-1 컴포넌트 재사용 결과

`src/missionConceptMap/`의 Canvas, 상세 패널, 데이터 타입, adapter를 조사했다. Canvas는 일반망·AWS domain/접근성 문구와 기존 관계 유형에, 상세 패널은 B3 Story·용어·학습 지도에 결합되어 있다. B2의 ‘종류·사용·호출’을 그 타입에 억지로 넣지 않기 위해 두 컴포넌트를 직접 장착하지 않았다.

실제 코드 재사용은 **`adaptConceptMap` + `layoutConceptMap`의 배치·관계선 통로·포트 계산 엔진**이다. B2 전용 `adapter.ts`가 좌표 계산용 중립 projection을 전달한다. 이 내부 projection의 `연관` 유형·domain은 화면·데이터 계약에 사용하지 않는다. 화면에서는 항상 원본 B2 관계의 다섯 유형과 scope를 읽는다. 좌표는 선택·필터에 따라 바뀌지 않고 카메라만 움직인다. R22·R41처럼 역방향 관계가 같은 선에 겹치지 않는지도 검사했다.

React Canvas·상세 패널은 B3의 카메라/선택/비관련 개념 약화/상세 설명 패턴을 따르는 B2 전용 구현이다. B3 코드·데이터·CSS·공개 라우팅의 변경은 0건이다. 기존 B3 adapter 단위 테스트 29개를 포함한 전체 테스트를 유지했다.

## 3. 신규 화면과 파일

| 파일 | 역할 |
| --- | --- |
| `src/b21ConceptExplorer/adapter.ts` | 원본 projection, B3 좌표 엔진 adapter, U4·v3 검증 링크 선택 |
| `src/b21ConceptExplorer/state.ts` | 비공개 URL 선택 상태·안내 경로·원래 강의 위치 파싱, 복귀 주소 검증 |
| `src/b21ConceptExplorer/ExplorerCanvas.tsx` | 선택 관계 강조, 확대/축소·맞춤·읽기·드래그·키보드 개념 선택 |
| `src/b21ConceptExplorer/ConceptExplorer.tsx` | 전체 영역·개념·관계·상세·10비교·P1~P3·왕복 링크 |
| `src/b21ConceptExplorer/explorer.css` | 전용 팔레트·PC 상세 패널·모바일 세로 탐색과 바로가기 |
| `src/b21ConceptExplorer/explorer.test.tsx` | 신규 지도 전용 18개 테스트 |
| `scripts/b21-preview/ConceptExplorerPreview.tsx` | 비공개 지도·기존 React 강의·실제 용어사전 호스트 |
| `scripts/b21-preview/main.tsx` | 기존 4개 모드 유지 + `전체 개념지도` 모드 |
| `scripts/b21-preview/U4LearningPreview.tsx`, `u4-preview.css` | Scene 08 강의 밖에 비공개 지도 진입 링크 |
| `scripts/check_b21_concept_explorer.mjs` | C1 전용 Chrome 검증·캡처 |
| `scripts/check_b21_concept_build.mjs` | 비공개 Owner entry 별도 빌드·공개 산출물 유출 검사 |

관계 Canvas와 동일한 개념/관계 HTML 목록을 함께 제공한다. 모바일에서는 상세를 먼저 읽고 개념·관계·비교로 바로 이동할 수 있다. 모든 표시 HTML 조작 대상은 44px 이상이다. Canvas의 확대·카메라 이동을 강의 화면의 디자인 변경으로 구현하지 않았다.

## 4. 45개념·24관계·10비교 검증

| 항목 | 결과 |
| --- | --- |
| 노드 | 원본 45개·고유 ID 45개, 전체 선택 목록 45개, SVG 슬롯 45개 |
| 관계 | 원본 24개, 양 끝 ID 유효, 방향·scope·문구 유지, 계산된 SVG 경로 24개 |
| 관계 유형 | 사용·역할·포함·호출·종류, 원본 유형 외 신규 의미 관계 0개 |
| 비교 | 원본 10개, PC/390/360 모두 양쪽 문구 대조, 비교를 관계선으로 만들지 않음 |
| 영역 | 원본 ID·명칭·노드 소속 7개 유지, 각 영역 선택/해제 및 개념 수 검사 |
| 원본 보존 | 기준 커밋과 보호 파일 비교 및 원고 무결성 검사 결과를 증빙에 기록 |

검증은 원본과 별도 복사본을 맞추는 방식이 아니라 원본을 직접 읽는 projection과 UI/링크 경계를 검사한다. 강의의 기존 128단계 QA를 C1 테스트에 새로 복제하지 않았다.

## 5. 강사 안내 경로

| 경로 | 원본 순서 | 검증 |
| --- | --- | --- |
| P1 · 명령을 실행하면 어디로 갈까? | cli → python-m → package-main → argparse → function-call → service | 6단계 |
| P2 · 저장한 데이터는 어떻게 읽고 처리할까? | crud → persistence → jsonl → generator → for → list-collect | 6단계 |
| P3 · 함수에 잘못된 값이 들어오면? | parameter → type-hint → validation → exceptions → wrapper | 5단계 |

세 폭 각각에서 17단계의 노드·질문, 이전/다음, 경로 전환, 처음/끝 버튼 비활성, 자유 탐색으로 전환 시 직전 선택 복원을 확인했다. 경로는 복습 순서이며 실행 순서나 새 의미 관계선이 아니라는 원본 warning을 표시한다. URL로 현재 경로와 단계도 복원한다. 새로고침 후에도 현재 안내 단계는 유지되며, 전환 전 자유 탐색의 임시 스냅샷은 현재 마운트 안에서만 유지된다.

## 6. Story·용어사전 왕복과 보류 경계

- **Scene 08 → 지도 → 원래 강의:** U4 검토의 Scene 08 링크는 `origin=scene=08&step=6` 같은 검증된 source token을 저장한다. 지도 안에서 다른 노드·관계·비교로 이동한 뒤에도 원래 강의로 복귀한다.
- **지도 → 검증된 복습 → 지도:** node는 U4의 명시적 anchor 또는 Scene 08의 `originalNodeIds`/`originalDeepNodeIds`와 영역 복습 주소만 사용한다. 관계 복습은 기존 R09·R28·R37, 비교 복습은 C30·C13만 재사용한다. 복습 중에도 선택 지도 복귀 배너를 제공하고 새로고침 후 정확한 탐색 주소로 돌아온다.
- **지도 → 실제 용어사전 → 지도:** candidate의 termId가 U4 카탈로그에도 있을 때만 링크를 만든다. U4의 직접/범위 확장 분류와 module의 JavaScript/Python 차이 등 notice를 그대로 사용한다. 실제 App의 module·generator 페이지를 읽고 새로고침 후 지도 노드·필터·origin 복원을 검증했다. `scene=05&step=gen&back=6` 복귀도 유지된다.
- **보류:** `object-init`의 사전 후보 `init`는 U4 보류이므로 연결하지 않는다. Iterable 등 미승인 term도 동일하다. `index`, `function-call`, `ledger-main`, `return`, `module-dependency`, `call-flow` 등 검증된 v3 복습이 없는 노드는 보류다. R17·R18 등의 원본 관계는 표시하되 임의의 v3 장면으로 보내지 않는다. v2 03a·03b 문자열을 v3 Scene 03으로 바꾸는 로직은 없다.
- 복귀 payload는 비공개 `/concept-explorer`의 검증된 상태만 받는다. 외부 URL·중복 키·unknown ID·중첩 return·v2 장면을 거부한다. 기존 `b31-map`이 있는 용어 주소에서는 C1 배너가 우선하지 않는다. U4의 기존 파서와 B3 복귀 계약은 변경하지 않았다.

## 7. PC·모바일 스크린샷

| 화면 | PC 1280px | 390px | 360px |
| --- | --- | --- | --- |
| 전체 영역 | [PC](../../reports/b21-c1/overview-1280.png) | [390](../../reports/b21-c1/overview-390.png) | [360](../../reports/b21-c1/overview-360.png) |
| Generator 관계 탐색 | [PC](../../reports/b21-c1/exploration-1280.png) | [390](../../reports/b21-c1/exploration-390.png) | [360](../../reports/b21-c1/exploration-360.png) |
| 상세 패널 원본 크기 | [PC](../../reports/b21-c1/detail-1280.png) | [390](../../reports/b21-c1/detail-390.png) | [360](../../reports/b21-c1/detail-360.png) |
| JSONL / Generator 비교 | [PC](../../reports/b21-c1/comparison-1280.png) | [390](../../reports/b21-c1/comparison-390.png) | [360](../../reports/b21-c1/comparison-360.png) |
| 강사 안내 P3 | [PC](../../reports/b21-c1/guided-1280.png) | [390](../../reports/b21-c1/guided-390.png) | [360](../../reports/b21-c1/guided-360.png) |

PC·360px 상세와 탐색 캡처를 직접 확인했다. 가로 넘침, 글자 잘림, 비교 양쪽 표시와 관계선 위치를 확인했으며, 선택·필터 전환 후 좌표 불변과 실제 사전 CSS 로딩 후 스타일 동일성은 자동 비교했다. `app-css-isolation-1280/390/360.json`에서 header·영역·workspace·Canvas 열·상세·비교 패널·제목·버튼의 상대 위치·크기·글꼴·색·padding·margin·tracking이 전후 동일하다.

## 8. PASS·FAIL·SKIP

| 검사 | 결과 | 근거 |
| --- | --- | --- |
| `npm test` | PASS | 23파일·333테스트 = 기존 315 + C1 18 |
| `npm run build` | PASS | 공개 앱 빌드, 기존 Foundation private build-check 포함 |
| `b21:concept-build-check` | PASS | 비공개 entry 별도 빌드, 공개 dist에 탐색기·예정 경로 없음 |
| `b21:concept-check` | PASS | 287개 명시 검사 + Playwright expect, 세 폭의 C1 전용 시나리오 |
| `b21:validate`, `b21:v3-validate`, `b21:eol-check` | PASS | 9원고·16SVG, 8장면·128단계, LF/CRLF 승인 해시 유지 |
| `b21:v3-parity` | PASS | 기존 128단계 × 3폭 = 384화면·5,269단언, 허용치 변경 없음 |
| `b21:html-qa` | PASS | 기존 독립 HTML 6,402단언, 세 폭 PASS |
| `b21:u4-ui-check` | PASS | 기존 641검사, 강의 UI·발표자·복습·사전·기본 무대 동등성 |
| `b21:u4-check` | PASS | 기존 84검사, U4 외부 패널·B3 복귀 우선순위 |
| `b21:router-check` | PASS | 기존 209검사, 주소·복습·발표자·128단계 순회 |
| `b21:browser-check` | PASS | 기존 Foundation 63검사, 설치 Chrome 사용 |
| 물리 모바일 터치·Safari·macOS·실제 프로젝터 | SKIP | 이 환경은 Windows Chrome viewport 검사이며 실제 기기 검사로 해석하지 않음 |
| Owner의 교육·시각·배치 승인 | SKIP / 검토 대기 | 기술 PASS와 별도, 비공개 Preview로 제시 |

빌드의 기존 대형 chunk 경고는 유지된다. 최종 미해결 FAIL은 없다. 실행 로그와 `browser-results.json`은 [`reports/b21-c1/`](../../reports/b21-c1/)에 보존한다. HTML QA의 `regressionDiffs`는 과거 Scene 08 기준과 승인 v3.7 사이의 기존 차이 정보다. 이번 변경의 실패가 아니며, 원본·검사를 수정하지 않고 6,402단언을 통과했다.

초기 실패는 최종 PASS로 숨기지 않았다. (1) Canvas 드래그 검사에서 배경이 아닌 좌표를 사용할 수 있어 배경 hit 확인 후 실제 드래그하도록 보완했고, 시각 검토에서 발견한 이웃 관계 잘림도 카메라 범위 계산을 고쳐 해결했다. (2) 44px 검사에서 PC에 숨겨진 모바일 바로가기 버튼까지 0px로 측정했다. 표시되는 조작 대상만 측정하도록 수정했고 44px 기준은 유지했다. (3) 최종 코드 검토에서 루트 글꼴만 비교하던 사전 CSS 격리 검사의 빈틈을 발견했다. 구조·제목까지 강화한 검사가 실제 header flex 전환·section margin·제목 스타일 간섭을 검출해 FAIL했다. C1 루트 안의 구조 태그·제목·letter-spacing과 비공개 배너를 명시적으로 격리해 해결했고, 세 폭에서 전후 geometry/typography의 완전 일치와 287검사 PASS를 확인했다. 공개 App/B3/기존 강의 CSS는 수정하지 않았다. [`attempts.json`](../../reports/b21-c1/attempts.json)에 실행별 결과와 실패 캡처를 남긴다.

보호 확인: 기준의 기존 파일 2,948개 중 변경을 허용한 것은 package 명령·비공개 Preview의 3개 파일뿐이다. 나머지 기존 파일은 변경 0건이며, 승인 HTML LF SHA-256은 `a73ef3cea740a4bec3a4af64716d6dfbdb8cf516278ec887c943be611f1f2721`로 유지된다. 데이터 빌드의 생성 파일 33개는 LF 정규화 후 기준과 내용이 같은 줄바꿈 차이임을 확인해 복원했다. [`protection-results.json`](../../reports/b21-c1/protection-results.json)에 경로·해시·복원 근거를 남겼다.

## 9. Owner 검토 주소

```powershell
Set-Location C:\Users\hyun0\codyssey-mission-tech-glossary-b21-story
npm.cmd run b21:preview
```

- 모드 선택: <http://127.0.0.1:4179/> → **전체 개념지도**. 기존 Foundation / v3 React 강의 / Router 강의 테스트 / U4 연결 검토 유지.
- 전체 지도: <http://127.0.0.1:4179/?view=concept-explorer#/concept-explorer>
- Generator: <http://127.0.0.1:4179/?view=concept-explorer#/concept-explorer?node=generator>
- P2 안내: <http://127.0.0.1:4179/?view=concept-explorer#/concept-explorer?mode=guided&path=P2>
- Scene 08 진입: <http://127.0.0.1:4179/?view=v3-links#/missions/main-M03/story?scene=08&step=6> → 강의 아래 **전체 개념지도에서 관계 탐색**.

서버는 기존처럼 `127.0.0.1:4179` loopback 전용이다. 위 `/concept-explorer`는 비공개 Preview 호스트 내부 경로다. 공개 `/missions/main-M03/story/concepts`는 등록하지 않았으며, 공개 App·미션 카드·배포 설정을 변경하지 않았다.

## 10. 서비스 통합 전 남은 항목

1. Owner가 전체 영역과 Canvas·모바일 순서·보류 문구·P1~P3 운영 동선을 검토한다. 교육 원고·학습 효과의 새 승인으로 소급하지 않는다.
2. 현재 보류된 노드·관계·비교의 v3 복습 매핑을 근거와 함께 개별 승인해야 한다. 후보 관계를 새로 만들거나 v2 03a·03b를 일괄 변환하지 않는다.
3. Scene 08의 승인 원고에 남은 ‘미연결’ 표현 변경은 원고 해시 변경이므로 별도 콘텐츠 승인 범위다. 이번에는 외부 비공개 연결만 추가했다.
4. 공개 route·미션 카드·용어 복귀 UI의 정식 배치는 별도 Owner Gate에서 결정한다. 물리 터치·Safari·프로젝터 검증과 공개 후 동선 확인도 남아 있다.
5. 이번에는 로컬 커밋까지만 한다. 저장소 지침에 따른 사용자 직접 Push 명령 참고: `git push origin content/b2-1-story-map-foundation`. 이번 작업에서 실행하지 않았으며 병합·배포도 수행하지 않았다.

학습 운영 정책 확인: Story=흐름, 지도=미션 내 의미 관계, 용어사전=확장, 가이드=실습 역할을 유지했다. 대면 강의의 지도 시연·관계 설명과 이후 자유 탐색을 지원한다. 새 미션 수행 요구·출석/평가 규정이나 검증되지 않은 학습 효과를 추가하지 않았다.
