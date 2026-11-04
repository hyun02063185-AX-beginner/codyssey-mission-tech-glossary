# B3-2 미션 스토리 웹 통합 QA

> 최신 검증은 아래 [2026-11-05 후속 수정](#revision-2026-11-05)을 참조한다. 2026-11-04의 콘텐츠 무변경 기록은 최초 통합 시점의 기록이다.

- 실행일: 2026-11-04 (Asia/Seoul), Windows / Chrome / Node v24.16.0 / PowerShell.
- 승인 콘텐츠 및 구현 시작점: `264cb6983974a6bfafe143e805249716771e6ec3`.
- 구현 커밋: `fcd6ae55a3f12175b14e063542921c08b5f82116`.
- 브랜치: `feature/b3-2-ai-git-story-web`. 원격 콘텐츠 브랜치 최신 SHA가 승인 SHA와 같음을 fetch 및 ls-remote로 확인하고 그 ref에서 worktree 생성.
- 작업 권한: 이번 사용자 지시의 B3-2 웹 진입점 추가 및 Push / Draft PR 준비. Owner 검수·main 병합·Pages 배포는 완료하지 않음.

## 구현 범위

| 파일 | 변경 |
| --- | --- |
| `src/App.tsx` | `/missions/main-M06/story` 추가, 용어 화면의 검증된 B3-2 복귀 메뉴 등록. 기존 route 유지 |
| `src/missionLearning.ts` | main-m06의 승인 핵심 질문, 스토리 및 실제 외부 학습가이드 등록. 개념지도 미등록 |
| `src/MissionLearningPages.tsx` | 기존 공통 자료 카드에서 외부 가이드를 새 창으로 열기 |
| `src/missionUI/LearningFocusNav.tsx` | 공통 학습자료 메뉴의 외부 자료 새 창 처리. 기존 내부 링크 유지 |
| `src/b21Learning/service.test.tsx` | 기존 B2-1 전체 미션 스냅샷에서 이번 승인 변경 대상 main-m06을 제외. 다른 미션 비교 보존 |
| `src/b32Story/B32Story.tsx` | 공통 인트로·PresentationSurface·LearningFocusNav 재사용, 4 Scene / 8슬라이드, 이전/다음·키보드·목차·접힘 노트 |
| `src/b32Story/B32Figure.tsx` | 승인 SVG의 PC/모바일 전환, Shadow DOM으로 스타일·marker ID 격리, 루트 data-state 적용 |
| `src/b32Story/content.ts` | 승인 screens.json / 원고를 직접 읽기, Scene·화면 주소 복구, 승인 가이드 장 링크 |
| `src/b32Story/B32LearningReturn.tsx` | 길이·파라미터·고정 Story 경로 검증 후 원래 슬라이드로 복귀 |
| `src/b32Story/b32Story.css` | 슬라이드 콘텐츠 배치, Presentation 토큰, PC 46px / 모바일 48px 위치 띠 |
| `src/b32Story/content.test.ts` | 주소 복구·출력 전문 원문 일치·외부 장 링크·개념지도 미제공 검증 |
| `playwright/b32-story-web.spec.ts` | 아래 32개 실제 App 조합 및 화면 캡처 |

`git diff 264cb698 -- content/mission-stories/main-m06 data content src/data/generated` 차이 없음. 원고·SVG·근거·canonical·기존 지도 데이터 변경 없음. 콘텐츠 자체 QA는 승인 자료를 재사용하고 웹 동선·반응형만 새로 검증했다.

S4-1 COMMIT·PR 전문은 원고의 코드 블록 그대로 접힘 설명과 발표자 노트에서 표시한다. `파일 끝에` 표현은 원문에 보존하며, 강사 스크립트의 **실행 당시 위치 미확인** 안내도 보존한다. 위치가 사실이거나 AI가 틀린 것으로 추가 단정하지 않는다.

## 검증 결과

| 항목 | 결과 | 근거 |
| --- | --- | --- |
| 빌드 | PASS | `npm run build`, `build.log`: TypeScript / Vite / B2-1 원문·빌드 무결성 통과. 기존 큰 chunk 경고 있음 |
| 전체 자동 테스트 | 기존 실패 있음 | `PYTHONUTF8=1 npm test`: 523 PASS / 5 FAIL, 44 files. `unit-full.log` |
| 기존 실패 분리 | 확인 | 승인 SHA worktree에서 `scripts/glossary_visual_contract.test.mjs` 재실행: 같은 5건 실패 / 10건 통과. `baseline-known-failures.log` |
| 변경 범위 자동 테스트 | PASS | 기존 실패 파일 제외 43 files / 513 tests 통과. B3-2 출력 원문 검사 3건은 최종 raw import 변경 후 재실행 통과(`b32-content-unit.log`) |
| B3-2 브라우저 | PASS 32건 | 4 크기 × 사이트 4테마 × OS light/dark. 각 조합에서 8슬라이드 × Presentation Dark/Light. `browser-final.log` |
| B3-1 최신 회귀 | PASS 7건 | `b31-visual-refinement.spec.ts` 전체. PC·360·390, 두 모드, 패킷 변경·CIDR·용어 왕복. `browser-final.log` |
| B1-1 / B6-1 회귀 | PASS 3건 | B1-1 1280 forest OS-light 전체 슬라이드·지도, history/term/guide, B6-1 1280 Light 전체 화면·URL·복귀. `regression-browser.log` |
| 오래된 공통 UI 테스트 | 기존 실패 1건 | B2-1 부분 통과 후 B3-1에서 삭제된 `.b31-slide-extra:not(.b31-slide-links)`를 찾음. 승인 SHA와 구현 모두 해당 요소 0개 / 현재 packet-journey 1개(`b31-baseline-locator.log`). 최신 B3-1 회귀로 실제 동작 추가 확인 |
| 원고·그림·참조 검사 | PASS | 승인 `preview.cjs --check-only`를 읽을 때 CRLF만 LF로 정규화해 실행(`content-check-lf.log`). 원본 파일 변경 없음 |
| 시각 QA | PASS (로컬 Chrome) | 아래 68개 PNG 및 contact sheet, PC 콘텐츠 잘림·모바일 가로 넘침 없음. SVG 반전/필터 없음 |
| 정책 §7 웹 통합 점검 | PASS / 미제공 명시 | 강의 질문·흐름·이해 확인·자율 복습·용어 왕복·실행 가이드 제공. 개념지도 준비 중, 링크 없음. 학습 효과는 주장하지 않음 |

기존 5개 자동 테스트 실패는 역사적 용어사전 baseline hash 4건과 B3-1 SVG 파일 목록 고정 1건이다. 이번 변경을 통과시키기 위해 baseline / 원고 / 용어 데이터를 바꾸거나 해당 테스트를 수정·비활성화하지 않았다. 전체 suite가 통과했다고 보고하지 않는다.

Windows 환경에서는 Python 기본 cp949로 기존 validator 테스트가 실패하여 `PYTHONUTF8=1`로 재실행했다. 승인 콘텐츠 검사 도구도 LF를 전제로 문자 수·문구를 대조하므로 일반 CRLF checkout에서는 835/806자 및 줄바꿈 검사 3건이 실패한다(`content-check.log`). 파일을 바꾸지 않고 메모리상의 텍스트 읽기만 LF로 정규화했을 때 전체 검사가 통과했다.

### 브라우저에서 확인한 동작

- 1280×720, 1000×720, 360×800, 390×844.
- 소개 자료 카드 → Story 인트로 → 강의 시작. Scene 카드 4개, 강의 중 큰 인트로 미마운트.
- 8개 직접 URL, 새로고침, Scene 선택, 이전/다음, 방향키, 잘못된 주소 복구.
- Presentation 기본 Dark → Light 전환·저장·새로고침, 사이트 4테마 및 OS 모드 독립성.
- 화면마다 PC/mobile SVG와 data-state, 위치 띠 실제 높이, PC 조작부 viewport 내 배치, 모바일 가로 넘침 없음.
- 발표자 노트·학습자 설명·이해 확인·실제 COMMIT/PR 전문 펼침.
- 관련 용어 진입 → 원래 슬라이드 복귀. 가이드 주소는 실제 B3-2 저장소 `be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/`의 승인 장별 링크이며 새 창으로 열림. 승인 콘텐츠 검사에서 로컬 실제 가이드 파일 존재 확인.
- pageerror 0건. 실제 AI API 호출 0회.

### 캡처

`{1280,1000,360,390}-intro.png` 4개와 `{폭}-{dark,light}-S{1~4}-{1~2}.png` 64개. PC는 720px viewport, 모바일은 세로 스크롤 전체 화면 캡처다. `*-metrics.json`은 실제 SVG 위치·크기다. contact sheet는 같은 캡처를 모은 검수용이다. `regression-b61/`은 B6-1 회귀 캡처다.

1280/1000 PC와 360/390 모바일에서 원고의 그림 구성·읽기 순서·겹침·잘림·핵심 문장·조작부를 직접 검수했다. 복잡한 API 흐름·실제 출력 화면은 개별 PNG도 확인했다. 390px 위치 띠가 51.7px로 늘어나던 점은 48px로 고정한 후 32개 조합을 다시 검증했다.

## 미검증 / Owner 검수

- Owner의 최종 내용·시각 검수, 프로젝터, 실제 모바일 하드웨어.
- Safari / Firefox, 실제 스크린리더, 공개 Pages 환경.
- 실제 AI API 재호출 및 `파일 끝에`의 실행 당시 사실관계. 승인 근거의 미확인 상태를 유지한다.
- 교육 시간·학습 효과. 시범 강의에서 검증할 항목이다.
- 전체 용어사전 자동 테스트 기존 실패 5건과 오래된 공통 UI 테스트 1건은 별도 유지보수 대상이다.

## 로컬 미리보기 / 재현

```powershell
cd C:\Users\hyun0\codyssey-mission-tech-glossary-b32-web
$env:PYTHONUTF8 = '1'
npm ci
npm run dev -- --host 127.0.0.1 --port 4186
```

인트로: `http://127.0.0.1:4186/#/missions/main-M06/story`

직접 화면 예: `http://127.0.0.1:4186/#/missions/main-M06/story?scene=4&screen=1`

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
$env:PLAYWRIGHT_PORT = '4186'
npx playwright test playwright/b32-story-web.spec.ts playwright/b31-visual-refinement.spec.ts --workers=4
npm run build
npm test
```

Push 대상은 `feature/b3-2-ai-git-story-web`만이다. Draft PR의 base는 main이며 승인 콘텐츠 2커밋과 구현·QA를 함께 검토할 수 있다. 기존 Pages workflow는 main push / workflow_dispatch에서만 실행됨을 확인했다. 병합·workflow_dispatch·배포는 수행하지 않는다.

<a id="revision-2026-11-05"></a>

## 2026-11-05 후속 수정 — 입문자 설명 및 상단 탐색

- 사용자 후속 지시를 근거로 `3236b2a481ff599c5222fb087e9bd364fd34f038`에서 계속 작업했다. 콘텐츠 브랜치를 다시 가져오거나 승인 이전 상태로 되돌리지 않았다.
- 구현 커밋: `10aa62ffb256769bad5a59714c2acdf745005aaf`. 같은 구현 브랜치 및 Draft PR #52를 갱신한다.
- 콘텐츠 변경 권한: 이번 지시의 초안·리스트·셸·실행 결과 설명 보완 및 8개 기술 이름. Owner 최종 화면 검수는 여전히 대기 중이다.

### 변경과 보존

| 대상 | 반영 내용 |
| --- | --- |
| 인트로 / S1-1 | 첫 슬라이드 설명과 인트로 펼침 영역에 초안을 “AI가 먼저 작성한 검토용 글”로 정의하고 실제 커밋·PR 미생성을 명시 |
| S2-1 | 프로그램과 명령을 Python 리스트로 전달. `git`은 실행할 프로그램, `diff`는 Git에 전달할 명령. 그림의 `…`는 인수 생략 표시라고 노트·접힘 설명에서 명시 |
| S2-1 실행 경계 | 터미널(입출력 화면), 셸(명령 해석), 운영체제(실행 관리), Git 실행 파일의 역할 구분. Python→Git 단계는 기본 `shell=False`로 운영체제를 통해 실행 |
| S2-2 | `CompletedProcess` 실행 결과 객체의 `returncode`·`stdout`·`stderr` 속성과 Python의 처리 로직 구분. 종료 코드 검사 → 성공 시 stdout 사용 흐름 유지. stderr가 항상 실패를 뜻하지 않음을 접힘 설명·노트에 명시 |
| 8개 기술 이름 | 사용자 지정 문구를 원고의 “학습 기술” 필드, screens.json의 technology, 실제 슬라이드 제목 근처에 동일하게 표시 |
| 상단 이전/번호/다음 | 기존 move()/screenHref()와 현재 index 재사용. PC 우측 상단, 모바일 별도 줄. 하단 탐색 유지. 첫 장 이전·마지막 장 다음 비활성, 44px 터치 영역과 키보드 조작 |
| 콘텐츠 동기화 | 원고·screens.json·build_figures.py·F4/F5 PC/모바일 SVG·미리보기 함께 갱신. 원고/기술 이름 대조 검증 추가. preview.cjs는 근거 텍스트의 CRLF를 읽을 때 정규화해 별도 래퍼 없이 검사 가능 |

기술적 설명은 실제 `Codyssey_B3-2`의 `ai_gitgen/git_collector.py` (`capture_output=True`, `text=True`, `check=False`, shell 인자 생략) 및 [Python 공식 subprocess 문서](https://docs.python.org/3/library/subprocess.html#subprocess.run)·[CompletedProcess 문서](https://docs.python.org/3/library/subprocess.html#subprocess.CompletedProcess)를 대조했다. 호출할 프로그램의 종료 코드 실패와 실행 자체의 예외도 접힘 설명에서 구분한다.

변경 파일은 B3-2의 Story TSX·CSS·콘텐츠 테스트, B3-2 브라우저 테스트, `content/mission-stories/main-m06/`의 관련 원고·도구·그림·미리보기뿐이다. 공통 GNB·route·다른 미션 코드·지도·canonical·생성 데이터는 변경하지 않았다. SVG 내용 변경은 F4/F5의 4파일뿐이며 F0·F8·실제 출력 근거 파일은 기존 커밋과 같다. S4-1 출력 전문과 “파일 끝에” 미확인 안내를 보존했다.

### QA 결과

실행 환경: 2026-11-05 Asia/Seoul, Windows, Node v24.16.0, 로컬 Chrome. 아래 로그와 새 캡처는 [revision-2026-11-05/](revision-2026-11-05/)에 있다.

| 검사 | 결과 | 근거 |
| --- | --- | --- |
| 빌드 | PASS | `PYTHONUTF8=1 npm run build`, `build.log`. 기존 큰 chunk 경고만 있음 |
| 원고·SVG·근거·미리보기 | PASS | `node content/mission-stories/main-m06/_tools/preview.cjs`, `content-check.log`. 모든 상태 글자 범위·겹침·최소 크기, 원고/기술 이름/참조 대조, 실제 출력 전문 대조, 키 노출 검사. 정적 미리보기 PC 세로 및 모바일 가로 넘침 없음 |
| 생성 소스 재현성 | PASS | 생성기의 render 결과와 SVG 18개 전체 일치. `reproducibility.log` |
| B3-2 브라우저 | PASS 32/32 | `browser-final.log`: 4크기 × 사이트 4테마 × OS 2모드, 매번 8슬라이드와 Presentation Dark/Light. 기술 이름, 상·하단 현재 번호·비활성 경계, 양방향 교차 이동·동일 URL, 상단 버튼 Enter, 방향키, 노트·실제 출력·용어 왕복·주소 복구 검증 |
| 다른 미션 UI 회귀 | PASS 7/7 | `browser.log`의 최신 B3-1 visual refinement 전체. 이전 검증의 B1-1/B2-1/B6-1 코드는 변경이 없어 기존 QA를 재사용. 공통 UI 파일 변경 0 |
| 전체 자동 테스트 최종 | 524 PASS / 기존 5 FAIL | `PYTHONUTF8=1 npx vitest run`, `unit-final.log`, 44 files / 529 tests. 기존 용어사전 baseline/파일 목록 실패 5건은 앞선 QA에서 기준 커밋 재현 완료. 이번 변경의 콘텐츠·출력 전문·주소·공통 UI 테스트 통과 |
| PC·모바일 시각 QA | PASS (로컬 Chrome) | 인트로 4 + 슬라이드 64 PNG와 크기별 contact sheet 검수. PC 조작부가 720px 안에 유지되고 모바일 가로 넘침·그림 잘림 없음. 기술 이름과 F0 역할 구분, Dark/Light 배치 일치 |

실제 App 그림의 최소 글자 크기는 1280px에서 **14.12px**, 1000px에서 **14.40px**, 360px에서 **14.58px**, 390px에서 **15.91px**다. 이는 `*-metrics.json`의 전체 슬라이드 최소값이며 두 강의 테마의 그림 위치·크기도 일치했다. 모바일에서는 상단 탐색에 필요한 줄만 늘리고 SVG를 추가 축소하지 않았다. 공통 GNB 높이와 F0(PC 46px / 모바일 48px)는 유지했다.

초기 검증에서 새 상·하단 버튼 때문에 기존 단일 `.b32-controls` 테스트 선택자를 구분했고, 빠른 키 입력 테스트는 화면 전환의 제목 포커스가 완료된 뒤 입력하도록 수정했다. 수정 후 최종 32건을 전체 재실행했다. 최초 동시 실행에서 지도 자동 테스트 1건이 5초 제한을 초과했으나, 브라우저·빌드 종료 후 전체 Vitest를 단독 재실행했을 때 시간 초과 없이 기존 실패 5건만 남았다. 초기 로그(`browser.log`, `unit-full.log`)와 최종 로그를 구분해 보존한다.

### 미검증 및 검토 경계

Owner 최종 화면 검수, 실제 프로젝터·모바일 하드웨어, Safari/Firefox·스크린리더, 실제 AI API 재호출, 학습 효과는 미검증이다. 원문 “파일 끝에”의 실행 당시 사실관계는 계속 미확인이다. main 병합·Pages 배포·workflow_dispatch는 수행하지 않는다.

로컬 미리보기 주소와 실행 방법은 위와 같다. 새 검증 재현:

```powershell
$env:PYTHONUTF8 = '1'
node content/mission-stories/main-m06/_tools/preview.cjs --check-only
$env:PLAYWRIGHT_CHANNEL = 'chrome'
$env:PLAYWRIGHT_PORT = '4186'
$env:B32_QA_OUTPUT = 'reports/b32-story-web/revision-2026-11-05'
npx playwright test playwright/b32-story-web.spec.ts playwright/b31-visual-refinement.spec.ts --workers=4
```
