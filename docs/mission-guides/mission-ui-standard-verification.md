# 미션 공통 진입·메뉴·Map-first 통합 검증

검증일: 2026-10-26. 시작 HEAD는 최신 `origin/main`의 `4124c75bdcbd13b8715e46812da381b04a4c9024`다. 새 worktree `C:/Users/hyun0/codyssey-mission-ui-standard`, 브랜치 `feature/mission-ui-standard`에서 작업했다. 완료 HEAD와 Push 후 원격 대조 결과는 최종 인수인계 응답 및 이 문서를 포함한 브랜치 HEAD에서 확인한다.

기존 `content/b2-1-story-map-foundation` worktree는 HEAD `24fe4dfae7ea6675a81d93c0bf5eac1819480fcd`와 미커밋 33개 파일의 SHA-256을 보존했다. 새 worktree에서 생성된 JSON의 EOL 변경은 내용 불변을 확인하고 원래 바이트로 복원했다. 비교용 baseline은 시작 HEAD의 별도 clean detached worktree를 사용했다.

## 구현 범위

- `/missions` 추천 5개와 일반 카드 16개 모두 미션 소개로 진입한다. 기존 딥링크는 그대로 열리며 소개로 강제 이동하지 않는다.
- 기존 `MissionDetailPage`에 미션 번호·제목·핵심 질문과 **미션 스토리 · 개념지도 · 학습가이드** 공통 카드를 배치했다. 미제공 자료는 링크 없이 표시한다. 지식 확장·용어 분류·MAC 체험 자료·기업망 보강 자료는 보존했다.
- `LearningFocusNav`를 B2-1/B3-1 Story·지도에 공유한다. 소개 복귀, 현재 미션과 자료, 제공되는 자료 이동을 지원한다. 현재 자료 링크도 장면·단계·지도 선택 상태를 보존한다. 기존 테마 선택은 자료 메뉴 안에 유지했다.
- 용어사전·미션 목록/소개·가이드는 기존 Standard 메뉴를 사용한다. B3-1 Story·지도는 기존 URL을 유지하며 Learning Focus 호스트로 옮겼다. 발표자 창에 메뉴를 주입하지 않는다.
- B2-1은 기존 Map-first/영역 집중 UI를 유지하고 서비스 메뉴를 기존 상단 행 안에 넣었다. B3-1은 동일한 viewport 배분 규칙, PC 오른쪽 패널·모바일 하단 시트, 닫기 후 공간 회수와 확대 화면의 패널/초점 복구를 적용했다. 엔진과 강의 렌더러는 합치지 않았다.
- [공통 UI 기준](mission-ui-standard.md)을 신설하고 workflow에는 필수 확인 링크만 추가했다. 신규 B1-1 등은 이 규격과 기존 소개·메뉴를 먼저 재사용한다.

수정 파일은 `App.tsx`, `MissionLearningPages.tsx`, `missionLearning.ts`, `missionLearning.css`, `missionUI/`, B2 서비스 Story/지도 호스트와 ConceptExplorer의 메뉴 슬롯, B3 MissionConceptMap 외부 레이아웃/CSS, 관련 테스트·QA 스크립트·문서다. `ThemeSelector`는 기존 구현을 그대로 분리해 재사용했다. 테스트 출력 경로와 Preview 포트를 분리해 기존 사용자 서버/QA 캡처를 덮어쓰지 않도록 했다.

## 실제 Canvas와 메뉴 측정

아래는 개발 App, 선택 없는 기본 화면의 SVG 실측이다. 빌드 화면도 같은 세 크기에서 검증했다. **상단 미션 메뉴는 두 지도 모두 44px**이며, Canvas 시작 Y에는 지도별 필수 도구와 제목의 높이도 포함된다. 비교 전후의 시각 자료는 같은 viewport에서 캡처했다.

| 지도 | viewport | 이전 Canvas 원래 크기 | 이전 화면 안에 보이는 높이 | 새 Canvas 크기 | 새 시작 Y |
| --- | --- | --- | --- | --- | --- |
| B2-1 | 1280×720 | 1250×534 | 534 | 1250×534 | 145 |
| B3-1 | 1280×720 | 1228×558 | 501.4 | 1252×529 | 129 |
| B2-1 | 390×844 | 364×566 | 566 | 364×566 | 239 |
| B3-1 | 390×844 | 960×546.6 | 467.9 | 366×615 | 171 |
| B2-1 | 360×800 | 334×522 | 522 | 334×522 | 239 |
| B3-1 | 360×800 | 960×518 | 375.9 | 336×571 | 171 |

B3-1의 이전 모바일 SVG는 폭 960px의 가로 스크롤 구조였다. 새 구조는 viewport 폭 안에서 camera pan/zoom을 사용한다. 이전 전체 사이트 메뉴는 PC 87.4px, 390px에서 202.7px, 360px에서 250.7px였고 새 미션 메뉴는 44px다. B2-1은 기존 Canvas 공간을 유지하면서 공통 메뉴를 제공한다.

PC에서 설명을 열면 B2-1 Canvas 폭은 892px, B3-1은 894px이며 닫으면 각각 1250px/1252px로 복구된다. 모바일에서도 시트를 닫으면 높이를 회수한다. 예를 들어 360px에서 B2-1은 148→522px, B3-1은 221→571px다. 전체 화면·읽기 크기·전체 맞춤을 구분하고 선택 상태와 초점을 유지한다. [원시 측정 및 동선 결과](../../reports/mission-ui-standard/app-results.json)를 보존했다.

## 보호 및 회귀

[무결성 검사](../../reports/mission-ui-standard/integrity.json)에서 보호 파일 **624개**를 시작 커밋과 바이트 단위로 대조했다. 원고·승인 해시를 갱신하지 않았다.

- B2-1: 8 Scene·128단계, 45개념·24관계·10비교·7영역·P1~P3, 기존 발표자·복습·U4 연결 보존. 연결 보류와 v2 03a/03b의 무조건 대응 금지 계약을 유지한다.
- B3-1: 5 Scene, 원본 36노드·57관계·6비교·3관점과 좌표/선 경로, 요청·응답 강조, 일반망/AWS 흐름·Story·용어 왕복 보존. Canvas/adapter/detail renderer 및 Story renderer 원본은 변경하지 않았다.
- 용어사전 원본, 가이드 원고, 다른 미션 데이터, 기존 기술지도, 공개 배포 설정은 변경하지 않았다.

## 자동 검증

브라우저 검사는 순차 실행했다. Chrome 155, Windows, 모바일 viewport·실제 CDP 터치 입력을 사용했다. PC 1280×720, 모바일 360×800·390×844는 실제 App 개발·dist 경로에서 검증했다.

| 검사 | 결과 | 근거 |
| --- | --- | --- |
| `npm test` | PASS | 27개 파일, 392개 테스트. 기존 374개와 공통 진입/제공 상태/메뉴 18개 |
| `npm run build` | PASS | 원고 검증·데이터 빌드·TypeScript·Vite·Foundation build 검증 |
| `b21:v3-validate`, `b21:eol-check` | PASS | 8 Scene·128단계·원고/해시·LF/CRLF 계약 |
| `b21:router-check` | PASS | 209개, 128단계·주소/복습·발표자 계약 |
| `b21:u4-check` | PASS | 84개, 승인 18용어·가이드/분야지도·CSS 격리 |
| `b21:concept-check` | PASS | 1,114개, 원본 45/24/10·영역·P1~P3·보류 연결·왕복 |
| `b21:concept-build-check` | PASS | 독립 Preview 빌드와 서비스 chunk, 비공개 호스트 미유출 |
| B3/미션 진입 Playwright 회귀 | PASS | 89개. 장면·강조·좌표·관계·대비·키보드/터치·이력·16개 미션과 테마 회귀 |
| `mission:ui-check` | PASS | 개발/dist × 3크기 × 두 미션. 메뉴·Canvas·패널·확대 화면·터치·직접 주소/갱신·이력·자료 왕복 |
| `b21:u5-check` | PASS | 개발 176 + dist 176 = 352개. 실제 발표자·정답/단계·연결 복구·강의 디자인·U4·왕복 |
| 기존 384화면/5,269단언 parity | 승인 QA 재사용 | [Area Focus 승인 결과](b21-area-focus-verification.md). 보호된 강의 소스 동일성을 대조하고 이번 U5에서 3폭 강의 typography/geometry 및 U4 CSS 격리를 재검증 |

최종 미해결 FAIL은 없다. 초기 검사에서 상단 메뉴 제거로 테마 선택 진입이 사라진 점을 발견해 공통 메뉴 안으로 보존했으며 재검사했다. 변경된 카드 명칭과 패널 배치의 테스트 기대만 새 UI 계약에 맞췄다. 데이터·왕복·대비·좌표·원고 검증 기준은 완화하지 않았다.

SKIP: Owner의 최종 사람 대상 승인, 원격 CI 실행, main 병합, 공개 배포·공개 사이트 갱신. 기존 128단계 전체를 새 탐색기의 중복 테스트로 다시 만들지 않았다.

## 화면 증빙과 시각 검수

Canvas·선택 라벨·설명 패널/하단 시트의 가독성, 메뉴의 중복 여부, 가로 넘침과 초점 위치를 캡처에서 확인했다. 대표 캡처와 비교 원본을 커밋하며 상세 회귀 캡처는 로컬 `reports/mission-ui-standard/regression/`에 남긴다.

| 화면 | PC | 390px | 360px |
| --- | --- | --- | --- |
| B2-1 소개 | [PC](../../reports/mission-ui-standard/1280-720-b2-introduction.png) | [390](../../reports/mission-ui-standard/390-844-b2-introduction.png) | [360](../../reports/mission-ui-standard/360-800-b2-introduction.png) |
| B3-1 소개 | [PC](../../reports/mission-ui-standard/1280-720-b3-introduction.png) | [390](../../reports/mission-ui-standard/390-844-b3-introduction.png) | [360](../../reports/mission-ui-standard/360-800-b3-introduction.png) |
| B2-1 지도 | [PC](../../reports/mission-ui-standard/1280-720-b2-map.png) | [390](../../reports/mission-ui-standard/390-844-b2-map.png) | [360](../../reports/mission-ui-standard/360-800-b2-map.png) |
| B3-1 지도 | [PC](../../reports/mission-ui-standard/1280-720-b3-map.png) | [390](../../reports/mission-ui-standard/390-844-b3-map.png) | [360](../../reports/mission-ui-standard/360-800-b3-map.png) |
| B2-1 상세 | [PC](../../reports/mission-ui-standard/1280-720-b2-detail.png) | [390](../../reports/mission-ui-standard/390-844-b2-detail.png) | [360](../../reports/mission-ui-standard/360-800-b2-detail.png) |
| B3-1 상세 | [PC](../../reports/mission-ui-standard/1280-720-b3-detail.png) | [390](../../reports/mission-ui-standard/390-844-b3-detail.png) | [360](../../reports/mission-ui-standard/360-800-b3-detail.png) |

[B3-1 이전 PC](../../reports/mission-ui-standard/1280-720-b3-before.png), [이전 360](../../reports/mission-ui-standard/360-800-b3-before.png), [PC 확대 화면](../../reports/mission-ui-standard/1280-720-b3-full.png), [B3-1 강의 요청/응답 장면](../../reports/mission-ui-standard/regression/story-regression/1280-scene-02-full.png), [발표자 창](../../reports/mission-ui-standard/b21-u5/dist-presenter.png)도 제공한다.

## Owner 검토와 공개 전환

검토 주소: [미션 학습](http://127.0.0.1:4200/#/missions), [B2-1 소개](http://127.0.0.1:4200/#/missions/main-M03), [B3-1 소개](http://127.0.0.1:4200/#/missions/main-M05), [B2-1 지도](http://127.0.0.1:4200/#/missions/main-M03/story/concepts), [B3-1 지도](http://127.0.0.1:4200/#/missions/main-M05/story-map/concepts). 모두 로컬 검토 주소다.

이번 사용자 지시의 커밋·Push 승인을 적용한다. 작업 브랜치만 Push하며 main 병합·Pages 배포·수동 workflow 실행은 하지 않는다. 현재 배포 workflow의 자동 대상은 main이다. Owner가 PC/모바일 진입·간결한 메뉴·패널/지도 배치와 수업 동선을 검토한 뒤 별도로 병합·공개 전환을 승인해야 한다.

```powershell
git push -u origin feature/mission-ui-standard
```

재검사에는 개발 App 4200, clean 시작 커밋 비교본 4202, 독립 B2 Preview 4199를 사용했다. `B21_PREVIEW_PORT=4199`, `B21_DEV_PORT=4200`, `B21_DIST_PORT=4201`, `PLAYWRIGHT_CHANNEL=chrome`, `PLAYWRIGHT_PORT=4200`, `B31_QA_OUTPUT=reports/mission-ui-standard/regression`으로 서로 다른 worktree의 기존 서버·QA와 구분했다.
