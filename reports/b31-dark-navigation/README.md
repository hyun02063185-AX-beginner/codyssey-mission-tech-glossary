# B3-1 강의 대비·구조도 상단 이동 보완

- 기준: `feature/b3-1-network-foundations-web` / `cd636e1`
- 작업일: 2026-10-26 (Asia/Seoul)
- 상태: 로컬 구현·QA 완료, Owner 실제 화면 검수 대기. main 병합·공개 배포 없음.
- 검수: <http://127.0.0.1:4186/#/missions/main-M05/story-map?scene=scene-02>

## 원인과 수정 범위

전역 `repair.css`는 h1/h2/h3에 `--heading-color`를 사용한다. 기존 Presentation의 Dark 매핑은 본문 `--text-primary`를 바꿨지만 이 제목 토큰을 매핑하지 않았다. 따라서 장면 제목·핵심 설명·관련 개념 제목·이해 확인·실습 제목이 사이트의 어두운 제목색을 유지했다. 기준 커밋의 실제 측정에서는 Dark 장면 제목/핵심 설명 **1.107:1**, 부드러운 배경 위 제목 **1.297:1**이었다.

또 Light는 Presentation 역할 색은 정의되어 있지만 사이트 표면·글자·강조 토큰을 완전히 분리하지 않아 사이트 테마가 일부 섞일 수 있었다. B3-1 강의에만 `--heading-color`, 본문/보조/각주, 표면/경계, 강조/포커스/강한 배경의 전경색을 Presentation 토큰으로 연결했다. 완전한 Light 매핑을 적용하는 과정에서 선택 메뉴 링크의 4.33:1 조합을 발견해, 링크색을 기존 강조색 90%와 본문색으로 보정했다. 이 4.33:1은 **토큰 연결 작업 중 발견한 조합**이며, 기준 커밋의 Forest Light 측정 실패로 소급하지 않는다.

프로덕션 변경은 두 파일뿐이다.

- `src/b31StoryMap.css`: `[data-learning-page="b31-story"]`가 있는 Presentation에만 색 토큰 연결, B3-1 링크·포커스, 상단 이동의 반응형 스타일.
- `src/B31StoryMap.tsx`: 기존 그림 바로 위에 이전/다음·현재 Scene 이름·진행 위치를 표시. 기존 `storyHref`와 `returnMap`을 사용한다. 첫 이전·마지막 다음은 disabled 버튼이다. PC는 가로 배치, 모바일은 현재 장면 다음에 버튼 두 개가 줄바꿈한다. 기존 하단 이동과 드롭다운은 유지했다. 장면 변경 시 제목 포커스의 기본 스크롤을 막고 기존 제목 `scrollIntoView` 한 번으로 정렬한다.

`presentationTheme.css`, `missionUI.css`, `missionStoryOverview.css` 자체는 변경하지 않았다. 공통 테마·B2-1·B6-1·개념지도·기존 밝은 SVG·기초 카드 원고/도표·설계 문서·route는 변경하지 않았다. CSS 필터/invert를 적용하지 않았다. 카드 A/B/C와 원래 다섯 Scene의 내용은 그대로다.

## 측정과 실제 검사

| 검사 | 결과 | 범위 |
| --- | --- | --- |
| 신규 대비·상단 탐색 브라우저 검사 | **8 PASS** | 1280×720, 1000×720, 390×844, 360×800 × Presentation Dark/Light |
| 네 사이트 테마에서 다섯 Scene의 HTML 텍스트 | **160 상태 PASS** | 4폭 × 2강의 테마 × Forest/Indigo/Paper/Signal × 5장면. 모든 details를 열어 제목·본문·각주·강조·카드·이해 확인·강사용 안내/기대 답·하단 이동 검사 |
| 학습자료 메뉴·Scene 선택기·상단 이동 | PASS | 네이티브 select의 선택된 글자와 메뉴 선택 링크도 측정 |
| 수정 후 최저 대비 | **Dark 5.529:1 / Light 4.943:1** | 검사한 활성 HTML 텍스트·컨트롤. 목표 4.5:1 충족 |
| 그림 확대 대화상자 대비 | PASS | 8개 화면/강의 테마 조합. Dark 최저 8.292:1, Light 5.660:1 |
| 새 상단 이동 | PASS | 01→02→03-A→03-B→04 및 역방향, 첫/끝 경계, 진행 위치·현재 제목, 제목 포커스/화면 노출 |
| query·이력·드롭다운 | PASS | `map=view=aws&more=1&node=aws:vpc` 보존, 직접 진입·Scene 선택·새로고침·뒤로/앞으로, 원래 지도 선택 복귀 |
| Dark↔Light 실시간 전환 | PASS | 주소와 사이트 테마 유지, 전환 후 대비 재검사 |
| 기존 관련 브라우저 회귀 | **88 PASS** | 기초 카드 10, B3-1 Story 36, 지도 16, B6-1/B2-1 지도·왕복 17, 공통 Story·B2-1 테마/발표자 9 |
| 관련 단위 테스트 | **122 PASS** | 11개 파일. 기존 콘텐츠·링크·지도 경로·카메라·B6-1 포함 |
| 빌드·TypeScript | PASS | `npm run build`; 최종 색 보정 후 `npx tsc -b`·`npx vite build` |
| 원본 보호 | PASS | 이전 153개 보호 파일 검사 재실행. 추가로 `git diff cd636e1`에서 공통 테마 3개·기초 카드 모듈·원본 SVG·원고·지도/용어 데이터·B2-1/B6-1 코드 변경 0 |

신규 검사 8개와 회귀 88개로 브라우저 **96개**가 통과했다. 원래 검사나 golden을 완화하지 않았다.

측정 함수는 `scripts/b31_story_contrast.mjs`, 동작 검사는 `playwright/b31-dark-navigation.spec.ts`다. 실제 렌더된 텍스트 노드와 select를 찾아 상속된 글자색·조상 배경의 알파 합성을 비교한다. 새 `color-mix`가 반환하는 sRGB 형식도 처리한다. 그림의 Shadow DOM 내부는 이번 HTML 자동 측정에서 제외하며, 기존 SVG가 기준과 같음을 별도로 보호한다. 숨김 텍스트와 native disabled 컨트롤은 활성 텍스트 AA 측정에서 제외한다. 폰트 로딩 후 캡처했다. 이전 `before-contrast.json`은 기준 커밋의 40개 Forest/크기/강의 테마/장면 상태이며, 수정 후에는 160개 상태를 확인했다.

**자동 대비 측정과 별도로** PC·모바일의 수정 전후 제목/읽기 영역, Dark/Light 기본 화면, 상단 이동의 줄바꿈, 카드 A/B/C 대표 이미지를 실제로 열어 확인했다. 모든 그림/상태를 사람이 전수 검토했다고 주장하지 않는다.

## 수정 전후 대표 캡처

| 화면 | 수정 전 | 수정 후 | 상단 이동 |
| --- | --- | --- | --- |
| PC 1280 Dark | [제목](before-1280-dark-top.png) · [읽기](before-1280-dark-reading.png) | [제목](after-1280-dark-top.png) · [읽기](after-1280-dark-reading.png) | [기본 화면](after-1280-dark-default.png) |
| 모바일 360 Dark | [제목](before-360-dark-top.png) · [읽기](before-360-dark-reading.png) | [제목](after-360-dark-top.png) · [읽기](after-360-dark-reading.png) | [기본 화면](after-360-dark-default.png) |
| PC 1280 Light | [이전](before-1280-light-top.png) | [기본 화면](after-1280-light-default.png) | [이동 영역](after-1280-light-navigation.png) |
| 모바일 360 Light | [이전](before-360-light-top.png) | [기본 화면](after-360-light-default.png) | [이동 영역](after-360-light-navigation.png) |
| PC 1000 | — | [Dark](after-1000-dark-top.png) · [Light](after-1000-light-top.png) | [Dark](after-1000-dark-navigation.png) |
| 모바일 390 | — | [Dark](after-390-dark-top.png) · [Light](after-390-light-top.png) | [Dark](after-390-dark-navigation.png) |

카드 대표: [A / PC Dark](after-1280-dark-card-a.png), [B / 모바일 Dark](after-360-dark-card-b.png), [C / 모바일 Light](after-390-light-card-c.png). 펼친 카드/읽기 영역의 전체 캡처는 한 viewport에 전부 보인다는 뜻이 아니다. 카드 접힘 기본 화면도 별도로 보존했다. 기존 보고서의 캡처는 새 결과로 덮어써 커밋하지 않았다.

## 기존 실패 및 미검증

- 과거 `qa_b31_story_baseline.mjs`의 `410b3a0` 대비 `missionConceptMap.css` 차이는 [이전 보고서](../b31-network-foundations/README.md#과거-기준선기존-실패를-별도-기록)에 기록된 기존 실패다. 이번에는 재실행하지 않았고 새 PASS/FAIL로 재표시하지 않았다. 지도 CSS는 이번에도 변경하지 않았다. 과거 128상태 픽셀 비교도 이번에는 **SKIP**이다.
- 기존 B2-1 정밀 카메라 스크립트 실패는 별도 기존 이슈다. 이번 PASS 수에 넣지 않았으며 B2-1의 주요 기능은 위 회귀로 검증했다.
- 신규 기능에서 남은 실패는 발견하지 않았다. 기존 Vite 500kB 초과 chunk 경고는 남아 있다.
- 실물 휴대전화·프로젝터·스크린리더 음성 출력·공개 Pages는 **미검증**이다. 로컬 Chrome의 실제 렌더/viewport 검사는 수행했다. Owner 승인과 교육 효과를 자동 검사로 대체하지 않는다.

## 재실행

```powershell
npm run build
npx vitest run src/b31Foundations src/b31StoryMapContent.test.ts src/b31GuideContent.test.ts src/b31GuideView.test.tsx src/missionConceptMap src/b21ConceptExplorer src/b61Story src/b61ConceptMap
$env:PLAYWRIGHT_PORT='4186'
$env:PLAYWRIGHT_CHANNEL='chrome'
$env:B31_QA_OUTPUT='C:/Users/hyun0/AppData/Local/Temp/b31-dark-nav-regression'
npx playwright test playwright/b31-dark-navigation.spec.ts playwright/b31-network-foundations.spec.ts playwright/b31-story-map.spec.ts playwright/mission-concept-map.spec.ts playwright/b61-concept-map.spec.ts playwright/mission-story-ui-v12.spec.ts --workers=2 --reporter=line
```
