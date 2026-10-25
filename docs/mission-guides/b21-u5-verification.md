# B2-1 Story U5 — React App 서비스 통합

검증일: 2026-10-25 (Asia/Seoul). 저장소 `hyun02063185-AX-beginner/codyssey-mission-tech-glossary`, 작업 브랜치 `content/b2-1-story-map-foundation`.

## 시작과 완료 범위

시작 HEAD는 `a190e68fc22f8e93fe9ff815adcbabbe1502f01b`이며 작업 트리는 clean이었다. 지정 원격 브랜치를 조회·fetch한 뒤 좌우 차이 `0 / 0`을 확인했다. 이 브랜치의 기존 upstream은 `origin/main`이므로 원격 동기화 판단에 upstream 표시를 사용하지 않았다. 완료 SHA는 이 문서·구현·증빙을 포함하는 로컬 커밋과 최종 응답에 기록한다.

이번 Owner 지시는 App 경로와 main-m03 카드 변경을 승인한 서비스 통합 범위다. 과거 U1~C2의 비공개 한정 조건은 해당 단계의 이력으로 보존한다. **main 병합·Push·배포·공개 사이트 갱신은 수행하지 않는다. Owner의 실제 화면 검토와 공개 전환 승인은 별도다.**

## 실제 App 경로와 기존 화면 보존

| 경로 | 렌더링 / 복귀 |
| --- | --- |
| `/missions/main-M03/story` | 승인 v3 React Story, 8장면·128단계, 기존 numeric/semantic 주소 해석 계약 유지 |
| `/missions/main-M03/story/concepts` | C2 Concept Explorer, 서비스용 상태 주소 생성·정규화 |
| `/terms/<승인 용어>` | B2 Story 또는 지도 복귀 배너, B3 배너 우선순위 유지 |
| 승인 B2 학습가이드 장 / `/maps/data-database?mission=main-m03` | 검증된 Story 위치로 복귀 안내 |
| 비공개 `/concept-explorer` | 기존 Preview 호스트 안에서 계속 동작, 서비스 주소와 혼용하지 않음 |

Story 경로는 유지하고 렌더링 대상만 교체했다. 기존 `src/B21LearningStoryView.tsx`와 entry, Foundation, 독립 HTML은 삭제·수정하지 않았다. App의 B2 전용 상위 라우트가 승인 강의의 화면 폭을 유지하며, 나머지 경로는 기존 사이트 Header/main/Routes를 사용한다. main-m03만 요청한 Story/개념지도 제목·설명·라벨로 바꾸고 학습가이드 카드는 유지했다. 다른 15개 미션 정의는 시작 시 저장한 데이터와 전체 비교한다.

## 왕복과 주소 안전성

Scene 08에서 현재 `scene/step/back`을 origin으로 갖는 전체 지도에 진입한다. 지도 선택은 node/relation/comparison/type/mode/path/at에 기록되어 새로고침·브라우저 이동에 복원된다. 검증된 Story 복습은 History state에 원래 지도의 허용된 주소만 전달하며, 용어 복귀는 해당 노드에 승인된 용어가 일치하는지 추가 검증한다. 외부 URL·비공개 경로·알 수 없는 상태·중복 인자·중첩 복귀 주소는 거부한다.

지도의 ‘이전 화면’은 최대 20개의 검증된 내부 탐색 위치를 사용한다. 직접 진입 시에는 origin 또는 고정된 Scene 08로 복귀한다. 임의 브라우저 이력의 외부 사이트로 이동하지 않는다. v2 03a/03b는 v3 03으로 자동 대응시키지 않는다. R23 등 복습 연결 보류는 유지하며 새 관계나 링크를 만들지 않았다.

U4-B의 강사 노트 접기 영역·Scene 08 선택 영역 패널·장면 마지막 가이드 카드·Scene 04/05/08 분야 지도 링크를 실제 서비스에 장착했다. 승인된 18개 카탈로그와 direct/extension 주의 문구는 변경하지 않았다.

`b21:concept-check`는 기존 비공개 동작 검사를 유지한다. `b21:concept-build-check`의 과거 ‘모든 공개 개념지도 청크 금지’ 조건은 이번 명시적 서비스 통합 지시에 맞춰 ‘서비스 청크 두 개 필수, 비공개 Owner 호스트 청크·배너는 dist 금지’로 교체했다. 화면 차이 허용치나 데이터 검증 조건을 넓히지 않았다.

## 발표자 창과 기능 상태 안내

서비스 발표자 URL은 현재 사이트의 origin/base pathname과 고정 Story hash를 사용한다. outer query는 동기화 session만 담으며 `view=v3-router`를 요구하지 않는다. 비공개 Preview는 기존 view 인자를 유지한다. 기존 U3 BroadcastChannel 메시지·권한·중복 요청 방지 계약은 변경하지 않았다.

Scene 08의 서비스 ‘미연결’ 안내는 런타임 provider에서 **기능 상태 문장 두 곳만** 바꾼다: 강사 노트 끝의 서비스 이동 상태, 마지막 그림의 지도/사전 연결 상태. 원고·교육 데이터·승인 해시·비교·관계 원문은 그대로다. 독립 HTML과 비공개 기본 렌더러는 기존 안내를 보존한다. 새 단위 검사로 원본 객체 불변과 이 두 문장 이외의 figure DOM 동일성을 확인한다. 승인 SHA를 갱신하지 않는다.

## 검증 결과와 화면 증빙

최종 자동 검사 결과는 아래 실행 기록과 `reports/b21-u5/`에 기록한다. 실제 App 브라우저 검사는 개발 서버와 dist 서버를 순차 실행한다. 기존 128단계 검사는 기존 parity/HTML/router 회귀를 재사용하며 U5에 128개 개별 검사를 복제하지 않는다.

| 자동 검사 | 결과 |
| --- | --- |
| `b21:validate` | PASS · Foundation 9원고·16 SVG 무결성 |
| `b21:v3-validate` | PASS · 8장면·128단계, 승인 문장·기존 주소 대응 |
| `b21:eol-check` | PASS · LF/CRLF 승인 해시 유지 |
| `b21:v3-parity` | PASS · 384화면·5,269 assertions, 허용치 변경 없음 |
| `b21:router-check` | PASS · 209 checks, U3 계약 포함 |
| `b21:html-qa` | PASS · 6,402 assertions, PC/390/360 |
| `b21:u4-check` | PASS · 84 checks, 18개 승인 용어·왕복·B3 우선순위 |
| `b21:u4-ui-check` | PASS · 641 checks, 기존 128단계 배치 검증 |
| `b21:concept-check` | PASS · 373 checks, 45개념·24관계·10비교·P1~P3 보존 |
| `b21:concept-build-check` | PASS · 비공개 빌드, 서비스 청크 필수/Owner 호스트 제외 |
| `npm.cmd test` | PASS · 24파일·352 tests, 신규 U5 단위 검사 19개 포함 |
| `npm.cmd run build` | PASS · tsc/Vite/Foundation build-check |
| `b21:u5-check` | PASS · 실제 App 개발/dist 각 176 checks, 총 352 · PC/390/360·왕복·P1~P3·주소 복구·발표자 창·B3/다른 미션 진입 |

원시 실행 기록: [순차 실행 상태](../../reports/b21-u5/regressions.json), [전체 테스트](../../reports/b21-u5/test.log), [최종 빌드](../../reports/b21-u5/build-final.log), [실제 App 검사](../../reports/b21-u5/app-results.json), [보호 파일 대조](../../reports/b21-u5/protection-results.json). 승인 원고·HTML·기존 Story·B3·가이드·배포 설정 등 **622개 파일**은 기준과 동일하다(텍스트는 기존 무결성 계약과 같은 LF 정규화, 바이너리는 바이트 비교). 생성 JSON 33개는 내용 일치를 확인한 EOL 차이만 복원했다([목록](../../reports/b21-u5/generated-eol.json)).

중간에 발견해 수정한 사항: 새 figure SSR 검사에 필요한 기존 FigureContext fixture를 보완했고, 용어 h1의 실제 소문자 표기를 사용했다. 새로고침 직후 발표자에 남아 있는 이전 연결 표시를 성공 근거로 삼지 않고 실제 투영 단계 수신/역방향 요청을 확인하도록 브라우저 검사를 고쳤다. **캡처 시각 검수에서 서비스 공통 CSS가 발표자 버튼 글자를 흰 배경에 묻히게 하는 문제를 발견해 서비스 전용 글자색과 header 배치를 수정했다.** 최종 App 검사는 세 버튼의 실제 텍스트 대비 4.5:1 이상을 추가 검증한다. 실패를 허용치 확대로 통과시키지 않았다.

Vite의 기존 큰 청크 경고는 유지되며 실패로 숨기거나 경고 한도를 바꾸지 않았다. 새 학습 콘텐츠/Owner Preview 호스트를 최초 App 진입에 강제 로드하지 않도록 서비스 진입과 복귀 UI는 lazy loading을 사용한다.

| 화면 증빙 | PC 1280px | 모바일 390px | 모바일 360px |
| --- | --- | --- | --- |
| 미션 상세 | [PC](../../reports/b21-u5/dist-mission-1280.png) | [390](../../reports/b21-u5/dist-mission-390.png) | [360](../../reports/b21-u5/dist-mission-360.png) |
| Story Scene 08 | [PC](../../reports/b21-u5/dist-story-1280.png) | [390](../../reports/b21-u5/dist-story-390.png) | [360](../../reports/b21-u5/dist-story-360.png) |
| Generator 지도 | [PC](../../reports/b21-u5/dist-map-generator-1280.png) | [390](../../reports/b21-u5/dist-map-generator-390.png) | [360](../../reports/b21-u5/dist-map-generator-360.png) |
| 용어사전 복귀 안내 | [PC](../../reports/b21-u5/dist-term-1280.png) | [390](../../reports/b21-u5/dist-term-390.png) | [360](../../reports/b21-u5/dist-term-360.png) |

같은 폴더의 `dev-*.png`는 개발 서버 증빙이다. 비교 카드·지도 시작 화면도 각 폭에서 저장했다. [발표자 화면](../../reports/b21-u5/dist-presenter.png), `*-story-design.json`에는 실제 App과 비공개 Router 강의의 세 폭 글꼴·핵심 영역 크기 일치 결과를 남긴다. 긴 모바일 화면의 전체 캡처는 축소 표시될 수 있으므로 원본 크기로 검토한다.

최종 발표자 버튼 세 개의 글자 대비는 개발/dist 모두 **16.47:1**이다([dist 실측](../../reports/b21-u5/dist-presenter-contrast.json)). 수정 뒤 최종 빌드와 개발/dist App 검사 모두 다시 PASS했다. 전체 결과는 [QA 요약](../../reports/b21-u5/qa-summary.json)에 정리했다.

## 수정 파일 범위

- `src/App.tsx`, `src/missionLearning.ts`, `src/MissionLearningPages.tsx`: 두 App 진입 경로·B2 복귀 gate·main-m03 전용 자료 구성.
- `src/b21Learning/`: 고정 경로·안전한 복귀 파서/배너·서비스 상태 provider·서비스 전용 CSS·19개 단위 검사.
- `src/b21StoryV3/B21ServiceStory.tsx`, `routing/{B21StoryRouter,storyRoute,presenterURL}`, `components/{InstructorNotes,StoryLearningLinks}`, `figures/ApprovedFigures.tsx`: 기존 강의 렌더러에 승인 연결 슬롯과 호스트별 발표자 주소·기능 상태 표시만 연결.
- `src/b21ConceptExplorer/{B21ServiceConcepts,ConceptExplorer,state}`: 서비스 진입·주소 분리·안전한 이전 화면. Canvas·원본 adapter·C2 CSS는 변경 없음.
- `scripts/check_b21_u5_browser.mjs`, `package.json`, `scripts/check_b21_concept_build.mjs`, `scripts/b21-preview/U4AppDestination.tsx`, 미션 자료 단위 검사: 서비스 통합 검사와 Preview 중복 배너 방지.
- 본 보고서·설계 문서 상태 주석·`reports/b21-u5/`: 현재 연결 상태와 검증 증빙. 과거 보고서를 새 상태로 덮어쓰지 않았다.

검토 주소: `http://127.0.0.1:4180/#/missions/main-M03` → Story / 전체 개념지도 카드. 비공개 도구는 기존 `http://127.0.0.1:4179/`다. 모두 로컬 검토 주소이며 공개 사이트가 아니다.

## 공개 전 판단

Owner의 PC·모바일 화면 및 수업 흐름 검토, 공개 전환 승인, 별도 PR/main 병합·배포 절차가 남는다. 이 작업의 자동 QA 완료를 교육 승인이나 배포 승인으로 해석하지 않는다.

PASS: 구현·자동 검사·개발/dist 로컬 통합 검증. 최종 미해결 FAIL은 없다. SKIP: Owner의 사람 대상 교육/시각 승인, GitHub 원격 CI, Push, main 병합, Pages 배포·공개 사이트 검사. 금지된 공개 전환 작업은 실행하지 않았다. 기술적으로 공개 전환 검토에 제출할 수 있으나, main 병합·배포는 **Owner 화면 검토와 별도 승인 후** 가능하다는 의견이다.

참고용 Push 명령(미실행):

```powershell
git push origin content/b2-1-story-map-foundation
```
