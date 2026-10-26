# Mission Story UI v1.2 — 구현·QA

- 작업일: 2026-10-26 (Asia/Seoul).
- 기준: 최신 `origin/main` **`c8717e5ee0c567776fd697278a4010b91a74d79a`**. 시작 시 로컬 변경 없음, 기존 v1.1 브랜치를 보존하고 `feature/mission-story-ui-v12`를 만들었다. 완료 전 fetch에서도 main이 같은 SHA임을 확인했다.
- 완료 HEAD는 이 보고서를 포함한 작업 브랜치 커밋이다. 정확한 SHA와 원격 Push 대조는 최종 완료 보고에 기록한다.
- main 병합·Pages 배포·workflow 수동 실행은 하지 않는다. 자동 배포 workflow의 push 대상은 main만이다.

## 결과

**공통 인트로.** 기존 B3-1의 제목·핵심 질문·펼침형 학습 목표와 강의 흐름·Scene 카드 디자인을 `MissionStoryOverview`로 옮겼다. 시작 버튼과 가변 길이 Scene 배열을 받는다. B2-1은 기존 제목·핵심 질문·8개 Scene의 질문을 사용하고, B3-1은 기존 인트로 문구를 이전했다. 두 미션 모두 기본 Story URL에서는 인트로만 보인다. Scene을 선택하거나 강의를 시작하면 인트로의 큰 제목/전체 카드가 사라진다. B3-1의 강의 중 이동은 컴팩트 `MissionStoryScenePicker`, B2-1은 기존 내부 목차를 사용한다.

**주소·복귀.** B2-1의 Scene·Step·발표자·복습 주소, B3-1의 Scene·지도 복귀 주소는 인트로를 거치지 않는다. 기존 주소 정규화·잘못된 값 복구를 보존했다. 공개 경로를 추가하거나 바꾸지 않았다. `LearningFocusNav`는 그대로 재사용하며, 슬라이드 강의 메뉴에 강의 소개와 Presentation Theme 선택만 추가했다.

**Presentation Theme.** `PresentationSurface`와 `PresentationThemeSelector`를 슬라이드 강의에 적용했다. 기본 Dark, 선택 Dark/Light, 저장 키는 `codyssey-presentation-theme`다. 새로고침·다음 강의·새 창에서 유지하며 발표자 창도 storage 이벤트로 동기화한다. 사이트 Forest/Indigo/Paper/Signal 저장값과 독립적이다. 저장소 사용 불가 시 기본 Dark로 복구하고 현재 화면에서는 Light로도 변경할 수 있다.

다크 팔레트는 명시적 `--presentation-*` 토큰을 기존 B2-1 색상 변수에 연결했다. GNB·메뉴·발표자 창도 다크 범위에서 표현한다. Light/Dark 양쪽 토큰을 정의해 신규 슬라이드가 같은 컴포넌트를 재사용할 수 있다. Light는 기존 밝은 면과 역할 색상 기조를 유지하되 작은 주황 강조·옅은 보조 글자의 대비를 보완했다. 두 모드에서 함수 이름표의 전경/배경도 보완했다. SVG에 invert/filter를 적용하지 않았다.

**콘텐츠 보호.** B2-1 원문 8 Scene·128단계와 teaching renderer/figure actions, B3-1 원문 5 Scene·SVG 그림 렌더러, 지도 원본·좌표·관계는 보존했다. 원본 B2-1 CSS의 변경은 흰 전경색을 fallback이 있는 색상 토큰으로 치환한 것뿐이며 폰트/크기/배치 선언은 동일하다. 신규 CSS는 슬라이드 색상 범위만 적용한다. B3-1과 개념지도는 Presentation Theme으로 감싸지 않는다.

**B6-1 준비.** [영구 가이드 v1.2](../../docs/mission-guides/mission-ui-standard.md)에 공통 인트로와 슬라이드 테마를 신규 미션의 재사용 기준으로 명시했다. B6-1 원고·그림·개념지도·Story 제공 상태는 작성하거나 변경하지 않았다. 기존 콘텐츠 엔진을 통합하지 않았다.

## 검증

실제 Chrome **146.0.7680.165**, macOS headless + Playwright. PC 1280×720·1000×720, 모바일 360×800·390×844. OS light/dark는 브라우저 에뮬레이션이다.

| 검사 | 결과 | 근거 |
| --- | --- | --- |
| 영향 범위 단위 테스트 | **68 PASS** | [로그](targeted.log) |
| 전체 단위 테스트 | **402 PASS / 28 files** | `npm test -- --maxWorkers=2`, [로그](unit.log) |
| 최종 빌드 | **PASS** | TypeScript·데이터 검증·Vite·기존 Foundation 산출물 무결성. [로그](build.log) |
| 개발 App 핵심 브라우저 시나리오 | **9 PASS** | [로그](dev-browser.log) |
| 최종 dist 핵심 브라우저 시나리오 | **9 PASS** | 실제 `vite preview` 4206, [로그](built-browser.log) |
| 슬라이드 대비·배치 | **2 PASS / 512 표시 상태** | 128단계 × 1280/360px × Dark/Light. 활성 글자 일반 4.5:1·큰 글자 3:1 기준, 두 모드의 폰트·요소 크기 일치. [로그](slide-colors.log), [PC](1280-slide-colors.json), [모바일](360-slide-colors.json) |
| B3-1 Story·미션 진입 회귀 | **55 PASS** | 요청/응답 강조·5 Scene·그림 확대·지도/사전 왕복·네 테마/OS·다른 미션. [로그](b31-regression.log) |
| B2-1 실제 App 기능 | **dev 176 + dist 176 PASS** | 발표자·정답 공개·단계 동기화·재연결/팝업 차단·복습·P1~P3·자료 왕복·주소 복구·3폭 승인 강의 타이포/배치. 비교용 비공개 Preview와 서비스 Light의 기본 타이포/배치를 대조했다. [로그](b21-u5.log), [결과](b21-u5/app-results.json) |
| v3 승인 원고 | **8 Scene / 128단계 PASS** | [로그](content-integrity.log) |
| 보호 소스 | **515개 바이트 일치**, B3 그림 렌더러 동일, B2 원본 CSS의 폰트·배치 동일 | [무결성 기록](integrity.json) |
| 공백 검사 | `git diff --check` PASS | 커밋 전 수행 |

9개 핵심 시나리오는 네 화면 크기 × 두 OS 환경의 인트로 동등성·카드 열·목표 펼침·기본 URL/새로고침·강의 시작·Scene 선택·직접 주소·Dark 기본·Light 유지·사이트 테마 독립·밝은 B3 도식/지도 왕복을 검증한다. 추가 시나리오는 발표자 창의 Light/Dark 동기화, 이후 강의의 선택 유지, 저장소 차단 시 fallback을 확인한다.

대비 검사는 원문을 다시 교육적으로 검토하는 대신 변경된 색상만 검사했다. 비활성 요소·의도적으로 낮춘 주변 맥락을 제외하며, 절대 위치 라벨의 실제 배경 영역을 계산한다. 초기 검사에서 Scene 06 이름표와 기존 Light의 작은 강조·보조 글자 대비를 발견해 수정했다. PC 인트로의 일반 nav 스타일 간섭도 수정했다. 최종 미해결 FAIL은 없다. 전체 단위 테스트의 최초 병렬 실행에서는 변경하지 않은 지도 경로 계산 테스트 한 개가 여러 브라우저 검사와 동시 실행 중 5초 제한을 넘었으며, worker 2개로 재실행해 402개 모두 통과했다. 타임아웃 기준이나 데이터/경로 검증을 완화하지 않았다.

기존 콘텐츠 승인 QA는 보호 소스 동일성을 확인해 재사용했다. 기존 보고서/캡처를 덮어쓰지 않았으며, 새 실행의 중복 회귀 PNG는 보관 대상에서 제외했다. 새 콘텐츠 원고 승인·실물 기기 검수·공개 사이트 검증을 대신하지 않는다.

## 캡처

최종 dist 화면의 인트로·Dark/Light와 B3-1 강의 캡처를 제공한다. 1280/1000/360/390px를 모두 포함하며 아래는 대표 자료다.

| 화면 | PC | 모바일 |
| --- | --- | --- |
| B2-1 공통 인트로 | [1280](1280-b2-overview.png) · [1000](1000-b2-overview.png) | [360](360-b2-overview.png) · [390](390-b2-overview.png) |
| B3-1 공통 인트로 | [1280](1280-b3-overview.png) · [1000](1000-b3-overview.png) | [360](360-b3-overview.png) · [390](390-b3-overview.png) |
| B2-1 Dark | [1280](1280-b2-dark.png) | [360](360-b2-dark.png) · [390](390-b2-dark.png) |
| B2-1 Light | [1280](1280-b2-light.png) | [360](360-b2-light.png) · [390](390-b2-light.png) |
| 다크 GNB 자료 메뉴 | [1280](1280-presentation-menu-dark-os.png) | [360](360-presentation-menu-dark-os.png) |
| B3-1 강의 중 화면 | [1280](1280-b3-lecture.png) | [360](360-b3-lecture.png) |
| 발표자 창 | [dev](b21-u5/dev-presenter.png) | [dist](b21-u5/dist-presenter.png) |

Scene 01~08의 1280/360px 다크 캡처도 포함한다. 대표 PC·모바일 인트로, 강의 Dark/Light, GNB 메뉴와 밝은 네트워크 도식을 직접 시각 검수했다. 승인 강의의 기존 크기·배치를 유지하므로 모바일의 기존 스크롤·발표 조작 배치도 유지한다.

## 재사용과 Owner 검수

정책은 [UI 가이드 v1.2](../../docs/mission-guides/mission-ui-standard.md) 한 곳에서 관리한다. `workflow.md`는 착수 전 필독 링크만 갱신했다. 신규 슬라이드 미션은 승인된 메타데이터/Scene 목적지 배열을 `MissionStoryOverview`에 전달하고, 강의 상태만 `PresentationSurface`로 감싸며 `LearningFocusNav` 안에 `PresentationThemeSelector`를 제공한다. 기존 또는 별도 콘텐츠 엔진을 그대로 연결한다.

남은 Owner 검수는 인트로 카드/목표·다크 팔레트의 최종 시각 선호, 실제 강의실 프로젝터·휴대전화 환경, main 병합·공개 배포 승인이다. 템플릿 준비가 B6-1 원고/지도 승인이나 공개 제공을 의미하지 않는다.
