# B2-1 Story U4-B — 강의 화면 연결 UI 비공개 시안

검증일: 2026-10-24 (Asia/Seoul). Windows / PowerShell / 실제 설치 Chrome 155.0.8059.85 headless.

## 기준과 판정

- 저장소: `hyun02063185-AX-beginner/codyssey-mission-tech-glossary`
- 브랜치: `content/b2-1-story-map-foundation`
- 폴더: `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`
- 시작 HEAD: `057dd6065838b1c1d25dafb69c25a0a92e7ff66c`. 작업 트리 Clean, fetch 후 지정 원격 브랜치와 차이 `0 / 0` 확인.
- 완료 커밋 SHA는 완료 응답과 Git 이력에 기록한다. 이 문서·증빙·구현을 한 로컬 커밋으로 묶는다.
- **U4-B 비공개 UI 시안과 기술 QA 완료. U4 최종 승인은 Owner의 D8 배치·문구 검토 후 가능하다.** 공개 전환은 별도 U5 승인 범위다.
- Push·병합·배포는 수행하지 않았다.

참고: [U4-A 결과](b21-u4-a-verification.md), [React 통합 계획](../../drafts/b2-1-story-map/v3/react-integration-plan.md), 승인 v3.7 원본, 기존 catalog/contextLinks. 학습 운영 정책의 Story=개념, 용어사전=확장, 가이드=직접 실습 역할을 유지했다.

## 세 배치 유형

### A. 강사 노트 하단

기존 강사 노트 본문과 기대 답 다음에 네이티브 `details/summary`로 **관련 용어·심화 학습**을 추가했다. 기본 닫힘, Enter로 열기/닫기, Tab으로 링크 이동, Escape로 노트를 닫으면 원래 노트 버튼에 초점이 돌아온다. 링크 내부 방향키가 강의 다음 단계로 전파되지 않게 했다.

Scene 01~07은 U4-A 근거 장면에 해당하는 용어만 표시한다. Scene 08은 현재 선택한 영역의 용어만 표시하며, 선택이 없으면 선택 안내만 보여 준다. 직접 연결/범위 확장 표기, 공통 extension 안내와 각 용어의 주의 문구를 함께 둔다. `module`의 JavaScript/Python 차이와 `summary-aggregation`의 일반 정보 요약/금액 계산 차이를 유지했다. 용어 본문은 복사하지 않았다.

### B. Scene 08 선택 영역 보조 패널

구조도를 축소하거나 다시 배치하지 않고, 강의 무대와 조작 막대 아래에 보조 패널을 추가했다. PC는 관련 용어를 가로 카드로, 모바일은 세로 카드로 표시한다. 선택 취소·비선택 단계에서는 패널을 제거하며 18개를 일괄 노출하지 않는다. 기존 Scene 복습 버튼은 그대로다.

| 선택 영역 | 연결 용어 ID |
| --- | --- |
| 실행과 CLI | cli |
| 모듈·패키지·역할 분리 | module, repository-pattern, layered-architecture |
| CRUD·검색·요약 | crud, summary-aggregation |
| 메모리·파일·저장 형식 | persistence, file-io, json-lines, csv |
| Iterator·Generator | iterator, generator, yield |
| Decorator | decorator, function, exception-handling |
| Type Hint·검증 | type-hint, input-validation |

새 시안의 영역 매핑은 `presentation.ts`에 분리했다. U4-A 외부 패널의 장면 단위 연결 함수는 보존했다. JSONL은 Scene 05 강사 노트에는 근거가 있지만 선택 영역에서는 저장 영역에만 표시한다. Iterable 등 보류 개념에는 링크를 만들지 않았다.

### C. 장면 마지막 단계

8개 장면의 마지막 단계에만 **더 학습하기**를 표시한다. U4-A의 장면별 승인 가이드를 실제 장 제목으로 안내하며, “학습가이드에서 내 프로젝트로 직접 해 보고, 코드와 실행 결과를 검증하는 방법을 확인하세요”라고 역할을 구분했다. 실행 버튼처럼 동작하거나 코드를 실행하지 않는다.

Scene 04·05·08에만 데이터·데이터베이스 분야 지도 링크를 표시한다. 분야 지도는 전용 복귀 배너가 없고 브라우저 뒤로가기를 사용한다는 안내를 링크 바로 아래에 유지했다.

## 변경 파일과 보호 확인

| 파일 | 변경 |
| --- | --- |
| `src/b21StoryV3/components/StoryLearningLinks.tsx` | 노트·선택 영역·정리 단계 UI와 선택적 슬롯 구성 |
| `src/b21StoryV3/components/storyLearningLinks.css` | 새 UI에만 적용하는 팔레트·카드·반응형·초점 스타일 |
| `src/b21StoryV3/links/presentation.ts` | 선택 영역·장면·마지막 단계별 표시 계산 |
| `src/b21StoryV3/links/presentation.test.tsx` | 15개 신규 표시·콘텐츠 경계 단위 검사 |
| `src/b21StoryV3/B21TeachingStory.tsx` | 기존 본문 뒤 두 선택적 ReactNode 확장 슬롯만 추가 |
| `src/b21StoryV3/routing/B21StoryRouter.tsx` | 선택적 슬롯 전달. 주소·동기화 동작 불변 |
| `scripts/b21-preview/U4LearningPreview.tsx` | 새 시안/기존 U4-A 외부 패널 전환 |
| `scripts/b21-preview/u4-preview.css` | 검토 선택 메뉴와 비공개 문서 바탕색 고정 |
| `scripts/check_b21_u4_ui_browser.mjs` | 새 시안 Chrome 검사·전후 및 왕복 캡처 |
| `scripts/check_b21_u4_browser.mjs` | 기존 검사에 external 모드 지정, 스타일 실패 진단 캡처 추가. 기존 단언 유지 |
| `package.json` | `b21:u4-ui-check` 명령 추가 |
| 이 문서와 `reports/b21-u4-b/` | QA·검토 증빙 |

승인 원고·독립 HTML·U1 content 데이터·integrity 해시·기본 강의 CSS·공개 App/missionLearning·B3-1·용어사전·가이드 원본·지도·배포 설정은 변경하지 않았다. Scene 08의 ‘미연결’ 문구도 유지했다. `catalog.ts`, `contextLinks.ts`, 복귀 주소 파서도 변경하지 않았다. 데이터 빌드로 생긴 33개 생성 파일의 변경은 정규화 후 내용 동일성을 확인한 줄바꿈 차이뿐이어서 복원했다.

승인 HTML SHA-256(전후 동일): `a73ef3cea740a4bec3a4af64716d6dfbdb8cf516278ec887c943be611f1f2721`.

## QA 결과

| 검사 | 최종 결과 | 근거 |
| --- | --- | --- |
| `b21:validate` | PASS | 9개 원고·16개 원본 SVG 등 기존 integrity |
| `b21:v3-validate` | PASS | 8장면·128단계·7영역·18후보 보존 |
| `b21:eol-check` | PASS | LF/CRLF 모두 승인 해시 보존 |
| `b21:v3-parity` | PASS | 384화면, 5,269단언, 기존 기준·허용치 불변 |
| `b21:router-check` | PASS | 209 checks, 주소·복습·발표자·복구·기본 진입 |
| `b21:html-qa` | PASS | 6,402단언, 1280/390/360px 모두 PASS |
| `b21:u4-check` | PASS | 기존 84 checks, 실제 18용어·8가이드·3지도·B3 우선 복귀·스타일 격리 |
| `npm test` | PASS 재실행 | 22파일·315테스트, 기존 300 + 신규 15 |
| `npm run build` | PASS | 기존 대형 chunk 경고 유지. private build-check도 PASS |
| `b21:browser-check` | PASS | 기존 Foundation Chrome 63 checks |
| `b21:u4-ui-check` | PASS | 신규 641 checks + Playwright expect, 아래 시나리오 |
| 전후 이미지 추가 비교 | PASS | 세 폭 모두 기본 무대 PNG byte-identical, geometry/text/font 동일 |
| macOS·물리 모바일 터치·실제 강의실 프로젝터 | SKIP | 이 Windows 장비에서 확인할 수 없음. Chrome 모바일 viewport 검증과 구분 |

신규 검사는 128단계를 모두 순회해 장면별 노트 용어·선택 영역의 정확한 부분집합·가이드 표시 조건을 확인했다. 세 폭 각각에서 7개 영역 선택/해제, 접기/펼치기, 키보드·초점 복귀, 44px 이상 링크, 가로 넘침 없음을 확인했다. 실제 module 페이지 왕복, Generator 왕복 후 새로고침, 복습 중 Iterator 왕복과 `back=6` 보존, 가이드 이동/뒤로가기, 분야 지도 이동/뒤로가기를 검증했다. 새 시안에서도 발표자 요청에 따른 답 공개·양방향 단계 동기화와 비교 모드 전환 후 위치 유지를 검사했다.

용어 복귀는 전용 배너로 정확한 출발 단계에 돌아온다. 가이드와 분야 지도는 브라우저 뒤로가기로 돌아오며, 가이드에 별도의 Story 복귀 배너를 추가하지 않았다. B3-1의 기존 복귀 우선순위와 목적지는 기존 검사를 그대로 통과했다.

### 실패 이력과 해결

실패한 실행을 PASS로 덮어 해석하지 않았다. 증빙의 `attempts.json`과 초기 실패 로그를 함께 보존했다.

1. 신규 화면 비교 초기 실행 **FAIL**: U3 기본 Preview와 상단 배너가 있는 U4 Preview를 다른 스크롤 원점에서 측정해 모바일 고정 조작 막대의 상대 위치가 달랐다. 동일한 비공개 배너·스크롤 조건에서 확장 슬롯 유무를 비교하도록 수정했다. 기본 U3/U2 보존은 별도로 기존 384화면 비교를 유지한다. 최종 비교는 세 폭 모두 PNG까지 동일하며 허용치를 추가하지 않았다.
2. `npm test` 초기 실행 **FAIL (314 PASS / 1 FAIL)**: 여러 브라우저 QA 동시 실행 중 기존 `conceptMapAdapter.test.ts`의 `edge corridors > all`이 5,000ms 제한을 초과했다(6,420ms). 제한·검사를 수정하지 않고 부하가 줄어든 뒤 동일한 `npm test`를 실행해 315 PASS. 재현 명령은 `npm.cmd test`, 병렬 브라우저 부하에 따른 시간 의존 실패는 재발 가능성이 있다.
3. `b21:u4-check` 중간 실행 **FAIL (80 checks)**: 390px 목적지 CSS 격리의 byte equality 실패. 강의 DOM geometry는 동일했고, 차이는 Playwright의 분수 픽셀 stage 캡처 끝에 포함된 문서 바탕색 1행(358픽셀, 흰색→앱 바탕색)이었다. 새 검토 메뉴의 box-sizing을 명시하고, 비공개 U4가 존재하는 문서의 바탕색을 흰색으로 고정했다. 기본 강의·공개 앱 CSS는 바꾸지 않았다. byte equality 단언은 그대로 두었고 최종 세 폭 모두 통과했다.

독립 HTML QA의 `regressionDiffs`는 기존 과거 Scene 08 기준과 승인 v3.7 사이 차이를 표시하는 정보다. 이번 변경의 회귀 실패가 아니며, 원본·기준·검사 항목을 변경하지 않고 6,402단언 PASS했다.

## Owner Preview와 증빙

실행:

```powershell
Set-Location C:\Users\hyun0\codyssey-mission-tech-glossary-b21-story
npm.cmd run b21:preview
```

- 시작/모드 선택: <http://127.0.0.1:4179/> → `U4 연결 검토`
- 노트: <http://127.0.0.1:4179/?view=v3-links#/missions/main-M03/story?scene=02&step=11> → 강사 노트 → 하단 관련 용어 펼치기
- 선택 영역: <http://127.0.0.1:4179/?view=v3-links#/missions/main-M03/story?scene=08&step=6>
- 장면 정리: <http://127.0.0.1:4179/?view=v3-links#/missions/main-M03/story?scene=04&step=14>
- 비교용 U4-A: <http://127.0.0.1:4179/?view=v3-links&layout=external#/missions/main-M03/story?scene=08&step=6>
- 기본 승인 강의 Preview: <http://127.0.0.1:4179/?view=v3>

모드 선택 메뉴에서도 새 시안과 기존 외부 패널을 전환할 수 있다. 위 주소는 로컬 검토 서버이며 공개 서비스 주소가 아니다.

증빙 경로: [`reports/b21-u4-b/`](../../reports/b21-u4-b/).

| 보기 | PC | 모바일 390px | 모바일 360px |
| --- | --- | --- | --- |
| 노트 확장 | [PC](../../reports/b21-u4-b/notes-after-1280.png) | [390](../../reports/b21-u4-b/notes-after-390.png) | [360](../../reports/b21-u4-b/notes-after-360.png) |
| 선택 영역 | [PC](../../reports/b21-u4-b/map-1280.png) | [390](../../reports/b21-u4-b/map-390.png) | [360](../../reports/b21-u4-b/map-360.png) |
| 장면 정리 | [PC](../../reports/b21-u4-b/summary-1280.png) | [390](../../reports/b21-u4-b/summary-390.png) | [360](../../reports/b21-u4-b/summary-360.png) |
| 실제 용어 화면 | [PC](../../reports/b21-u4-b/term-1280.png) | [390](../../reports/b21-u4-b/term-390.png) | [360](../../reports/b21-u4-b/term-360.png) |

`basic-before/after-*`는 무대 전후 동일성, `notes-before/after-*`는 노트 추가 전후, `term-*`/`return-*`는 실제 module 화면과 정확한 02-11 복귀를 보여 준다. `ui-results.json`, `u4-results.json`, `router-results.json`, `parity-results.json`, `html-results.json`, 실행 로그에 수치 근거를 보존했다.

## Owner 결정과 남은 범위

1. 노트 하단의 기본 닫힘 심화 영역, 구조도 아래의 선택 영역 패널, 정리 단계 아래 가이드 카드 배치를 승인할지 검토한다. 보조 패널까지는 스크롤이 필요하다.
2. 직접 연결/범위 확장 표시와 module·summary-aggregation 안내를 포함한 추가 UI 문구를 검토한다.
3. Scene 08의 승인 원고에 남은 ‘미연결’ 문구는 이 시안과 일시적으로 다르다. 이번에는 수정하지 않았으며 D8 승인 뒤 별도 콘텐츠 변경이 필요하다.
4. macOS·물리 터치·실제 투영 시연은 미검증이다. 공개 전환·배포 여부는 U5에서 별도 결정한다.

자동 검사의 최종 미해결 FAIL은 없다. Owner의 시각·문구 승인과 위 미검증 항목을 기술 PASS와 구분해 남긴다.
