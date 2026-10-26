# B6-1 Story 웹 통합 QA

> 후속 문구 수정: [S01-3 다대다(N:M) 표기 QA](s01-3-nm/README.md). 아래는 최초 통합 당시의 검증 이력이다.

- 작업일: 2026-10-26 (KST)
- 브랜치: `feature/b6-1-story-web`
- 시작 HEAD / 콘텐츠 기준: `da31cb5f15cf19bde3b5773760fabb25be627ef2` (`content/b6-1-story-compact`)
- 시작·종료 확인 시 `origin/main`: `b66c99cb14182d9d9cc0d19d1a0a916774e09d0f` (UI v1.2 포함)
- 검증 구현 커밋: `9712c6685d3a3a80e45674e1027caf77478cb3df`
- 작업 시작 시 로컬 변경 없음. 기존 작업 브랜치를 이어서 사용했다.

## 실행 주소

Vite 개발 서버 또는 로컬 빌드 미리보기에서 다음 HashRouter 경로를 연다.

- 인트로: `http://127.0.0.1:4200/#/missions/main-M11/story`
- JOIN 직접 진입: `http://127.0.0.1:4200/#/missions/main-M11/story?scene=03&screen=2`
- 미션 소개: `http://127.0.0.1:4200/#/missions/main-M11`
- 기존 학습가이드: `http://127.0.0.1:4200/#/missions/main-M11/guide`

재실행: `npm run dev -- --host 127.0.0.1 --port 4200`.
최종 빌드는 `npx vite preview --host 127.0.0.1 --port 4206 --strictPort`에서 검증했다. 아래 `built-app/` 캡처는 이 빌드의 실제 React 화면이다. 공개 배포 주소가 아니다.

## 변경 범위와 보존

- `MissionStoryOverview`, `LearningFocusNav`, `PresentationSurface`, `PresentationThemeSelector`를 재사용했다. 인트로는 사이트 테마, 강의는 기본 Dark / 기존 Light 선택 유지다.
- 미션 소유 페이지와 정적 콘텐츠 어댑터를 추가했다. 기존 엔진을 합치거나 범용 콘텐츠 엔진·편집기를 만들지 않았다. 미리보기용 `screens.json`은 앱 런타임에서 읽지 않는다.
- 4 Scene·12개 화면의 순서, 메시지, 설명, 도식 상태를 원고와 대조했다. 이전·다음, Scene 선택, 키보드 좌우/PageUp/PageDown, 전체 ERD(S01-1) 복귀를 제공한다.
- URL은 `scene=01..04&screen=1..3`. 새로고침·브라우저 이력을 보존하고, 잘못된 값·중복·임의 query는 해당 Scene 첫 화면 또는 첫 Scene으로 안전하게 복구한다.
- 승인 저장소의 SVG 8개만 명시적으로 가져온다. Shadow DOM으로 CSS/marker ID를 격리하고 허용된 `data-state`만 적용한다. 외부 또는 사용자 입력 SVG/HTML은 받지 않는다. 자산의 script·이벤트·외부 참조 부재를 검사한다.
- 사용 가능한 도식 영역 폭 900px 미만에서 모바일 SVG를 사용한다. 모바일 도식 폭은 최대 420px이며 고유 높이를 유지한다. 긴 도식은 문서 스크롤로 읽는다. 조작부는 그림 위의 문서 흐름에 두어 내용을 가리지 않는다. 중간 폭 950px과 창 크기 복원도 검증했다.
- S03-1, S04-1, S04-2에만 승인된 HTML 카드를 표시한다. S03-2 결과표는 모바일 SVG에서만 HTML로 보완한다. PC 결과표는 원본 SVG 안의 표를 사용한다.
- 미션 소개에서 Story+Guide를 제공하고 개념지도는 준비 중으로 유지했다. GNB의 가이드 링크에 검증된 강의 위치를 전달한다. 가이드의 장·문서·목차 이동 및 새로고침 후 같은 슬라이드로 복귀한다.
- 공통 GNB에는 기존 story/concept 경로와 같은 방식의 선택적 `guideHref`만 추가했다. 공통 UI v1.2의 시각 디자인·테마 시스템·정책 문서는 변경하지 않았다.

### 콘텐츠 수정 1건

S01-3을 **“다대다(N) 관계는 연결 테이블로 표현할 수 있다.”**로 수정했다. 원본 생성기, 스토리보드의 해당 이름표, PC·모바일 SVG, 접근성 설명, S01-3 및 전체 모음 미리보기를 함께 갱신했다. SVG 8개 중 6개는 기준 커밋과 바이트가 동일하다.

[원본 보존 검사](source-integrity.json): B2-1 구현·콘텐츠 71파일, B3-1 구현·콘텐츠 12파일, B6-1 기존 가이드 원문·자산/어댑터 29파일, 공통 UI 시각·테마·정책 7파일, 기존 검토/미리보기 fixture 2파일이 기준 커밋과 동일하다. B2/B3 원본 제작 폴더와 B3 개념지도 원본 데이터 539파일도 동일하다. B6-1 가이드 React 파일의 변경은 복귀 query를 전달하는 링크 처리뿐이며 10개 장 원문은 바꾸지 않았다.

원고·`review.md`의 과거 “독립 검토/Owner 승인 전” 표기는 이력으로 보존했다. 이번 사용자의 `da31cb5` 콘텐츠 웹 통합 지시를 구현 근거로 삼았다. 이 보고서는 별도의 독립 콘텐츠 심사 완료나 Owner의 실제 화면 승인 기록을 의미하지 않는다. 기존 SQL 검산·교육 콘텐츠 검토 결과는 재사용했고 전체 내용을 새로 검수했다고 주장하지 않는다.

## 자동 QA

환경: macOS, Node 24, 저장소 고정 의존성, Playwright + 설치된 Chrome(headless), Pretendard VF. 모바일은 브라우저 viewport 검증이며 실기기 검증과 구분한다.

| 검증 | 결과 | 근거 |
| --- | --- | --- |
| 관련 Vitest | 59 tests / 5 files PASS | [unit.log](logs/unit.log) |
| 최종 빌드 | PASS (TypeScript, Vite, 기존 무결성 검사 포함) | [build.log](logs/build.log) |
| 개발 앱 B6-1 | 화면 행렬 8 PASS + 기존 Light 연계 1 PASS | [dev-browser.log](logs/dev-browser.log), [dev-preference.log](logs/dev-preference.log) |
| 최종 빌드 B6-1 | 10 Playwright PASS | [built-browser.log](logs/built-browser.log) |
| 기존 미션 진입·B6 가이드·B3 주요 동선 | 24 Playwright PASS | [learning-regression.log](logs/learning-regression.log) |
| 공통 Story v1.2 / B2·B3 회귀 | 9 Playwright PASS | [existing-story-regression.log](logs/existing-story-regression.log) |
| 콘텐츠 원본 미리보기 검사 | 8 SVG·18 상태 PASS | [content-preview.log](logs/content-preview.log) |

최종 빌드의 B6-1 10건은 아래 8개 화면·테마 조합, 기존 Light 값 상속/변경 유지, 창 크기 전환 복원으로 구성된다. 개발 앱 기록은 최종 반응형 CSS 보완 전의 9건이며, 보완 후에는 최종 빌드 10건을 다시 실행했다.

| 화면 | Dark / Light | 활성 SVG 최소 글자 크기 | 대비·넘침 |
| --- | --- | --- | --- |
| 1280×720 | PASS / PASS | 15.36px | PASS |
| 1000×720 | PASS / PASS | 14.04px | PASS |
| 360×800 | PASS / PASS | 14.58px | PASS |
| 390×844 | PASS / PASS | 15.91px | PASS |

각 조합에서 12화면 순회, 원고 메시지/설명, PC·모바일 SVG 선택, `data-state`, ERD 상자 좌표 유지, 강조선 두께, 활성 텍스트 대비(일반 4.5:1 / 큰 글자 3:1), 가로 넘침 부재, 직접 주소·새로고침·뒤/앞 이동, 첫/끝 경계, Scene·전체 ERD 이동, 가이드/미션 왕복, 잘못된 주소 복구 및 콘솔 예외 부재를 확인했다. 대비 검사는 의도적으로 흐린 배경 요소(투명도 0.3)를 제외한 활성 글자를 대상으로 한다. 축소된 원래 표의 장식 글자는 최소 글자 크기 검사에서 제외한다. HTML 결과표는 17px이다. 개별 측정값은 `built-app/*-dark.json`, `built-app/*-light.json`에 있다.

기존 회귀 범위: B2-1 직접 Scene/Step, 다음 단계, 발표자 동기화 및 테마 저장; B3-1 인트로→네트워크 장면, 요청·응답, 직접 진입·지도 복귀; B6-1 기존 10장·그림·링크와 미션 자료 등록. B2의 강사 노트·정답 공개·지도→복습 복귀, 8 Scene·128단계 및 B3의 5 Scene 원문은 수정하지 않았으므로 해당 기존 승인 QA를 재사용한다. 무관한 전체 교육 콘텐츠 QA는 반복하지 않았다.

재현 명령(해당 포트의 로컬 서버 실행 후):

```sh
npx vitest run src/b61Story src/b61GuideContent.test.ts src/missionLearning.test.ts src/missionUI --maxWorkers=2
npm run build
PLAYWRIGHT_PORT=4206 PLAYWRIGHT_CHANNEL=chrome B61_QA_OUTPUT=reports/b61-story-web/built-app npx playwright test playwright/b61-story-web.spec.ts --workers=2
PLAYWRIGHT_PORT=4200 PLAYWRIGHT_CHANNEL=chrome B61_QA_OUTPUT=reports/b61-story-web B31_QA_OUTPUT=reports/b61-story-web/regression npx playwright test playwright/b61-mission-guide.spec.ts playwright/mission-learning-entry.spec.ts playwright/b31-story-map.spec.ts --grep-invert 'readable responsive scenes' --workers=2
PLAYWRIGHT_PORT=4200 PLAYWRIGHT_CHANNEL=chrome npx playwright test playwright/mission-story-ui-v12.spec.ts --workers=2
python3 content/mission-stories/main-m11/_tools/build.py
node content/mission-stories/main-m11/_tools/preview.cjs
```

기존 v1.2 회귀 스크립트가 과거 캡처 디렉터리에 다시 쓴 B3 캡처 2개는 원복했다. 이번 회귀의 로그는 이 디렉터리에 보관한다. 중복 개발/회귀 PNG는 제외하고 최종 빌드 캡처와 측정값을 보관했다. 빌드에는 기존 큰 번들 크기 경고가 남지만 빌드 실패는 없다.

## 대표 캡처와 시각 확인

| 내용 | PC | 모바일 |
| --- | --- | --- |
| 공통 인트로 | [1280](built-app/1280-overview.png), [1000](built-app/1000-overview.png) | [360](built-app/360-overview.png), [390](built-app/390-overview.png) |
| ERD Dark | [1280](built-app/1280-dark-S01-1.png) | [360](built-app/360-dark-S01-1.png) |
| S01-3 수정 문구 | [1280 Dark](built-app/1280-dark-S01-3.png), [Light](built-app/1280-light-S01-3.png) | [360 Dark](built-app/360-dark-S01-3.png), [Light](built-app/360-light-S01-3.png) |
| PK/FK 강조 | [1280](built-app/1280-dark-S02-3.png) | [360](built-app/360-dark-S02-3.png) |
| JOIN 경로·결과 | [1280 Dark](built-app/1280-dark-S03-2.png), [Light](built-app/1280-light-S03-2.png), [1000](built-app/1000-dark-S03-2.png) | [360 Dark](built-app/360-dark-S03-2.png), [Light](built-app/360-light-S03-2.png), [390](built-app/390-dark-S03-2.png) |
| INNER / LEFT | [1280](built-app/1280-dark-S03-3.png) | [360](built-app/360-dark-S03-3.png) |
| SQL / DBMS 카드 | [1280](built-app/1280-dark-S04-1.png) | [360](built-app/360-dark-S04-1.png) |
| AI 결과 검토 카드 | [1280 Light](built-app/1280-light-S04-2.png) | [360 Dark](built-app/360-dark-S04-2.png) |
| 전체 ERD 다시 읽기 | [1280](built-app/1280-dark-S04-3.png) | [360](built-app/360-dark-S04-3.png) |
| 기존 가이드 | [PC](guide-desktop.png) | [모바일](guide-mobile.png) |

실제 캡처에서 인트로, ERD, 수정 이름표, 키 강조, JOIN 결과, 비교표와 HTML 카드의 가독성·겹침을 확인했다. 초기 모바일의 고정 조작부가 긴 그림을 가리는 문제는 조작부를 문서 흐름으로 옮겨 해결했다. 폭 전환에 따른 모바일 도식/결과표 표시도 수정 후 최종 행렬에서 다시 확인했다.

## Owner 검수와 공개 경계

Owner의 실제 화면 검수는 남아 있다. 4 Scene·12화면의 강의 흐름, 교육 의미 색상/강조, 모바일 스크롤, S01-3 문구를 최종 확인해야 한다. iOS Safari·Android 실기기, 발표 환경/프로젝터는 이번 Chrome viewport 검사에 포함되지 않았다.

이 작업 브랜치에만 커밋·Push한다. main 병합·GitHub Pages 공개 배포는 수행하지 않는다. 기존 배포 workflow의 push 대상은 main이며 설정을 변경하지 않았다. 최종 Push 결과와 완료 HEAD는 작업 완료 메시지에 기록한다.
