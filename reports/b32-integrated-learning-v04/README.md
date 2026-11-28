# B3-2 미션 스토리 v0.4 Phase C2 QA

- 구현 상태는 미커밋 작업 트리입니다. HEAD는 `19da5cb6861914606faa00ae2f7b63ff77e786fe`, 기준 원고는 `8705e72`, Phase B 원고는 `23ac298`, 웹 비교 기준은 `1ff0cf3`입니다.
- `npm run dev:b32-v04`의 HashRouter 경로 `#/missions/main-M06/story`에서 인트로와 6개 Scene의 31화면을 엽니다. `#/missions/main-M06/lab`에서 Lab 목차와 결과 색인에 진입합니다. 기본 빌드에서 v0.4 원고와 Lab 청크가 생성되지 않는 것을 확인했습니다.
- I1–I10은 로컬 화면 상태와 원고·Lab·재현 기록을 사용합니다. I8의 프롬프트는 `be21c49:ai_gitgen/prompts.py`와 바이트 단위로 대조했습니다. I9는 R9에 기록된 11개 입력과 판정, P1의 후처리 출력을 표시합니다. 실제 AI API 호출은 0회였습니다.
- Lab의 v0.4 스토리 링크는 유효한 `from`으로 진입한 화면의 복귀 링크 하나입니다. 결과 색인에서 Lab A/B/C로 연결하고 스토리의 Lab 복귀 안내는 닫거나 다른 화면으로 이동하면 해제됩니다. 개념지도는 미구현으로 표시합니다. [인수인계](../../content/mission-stories/main-m06/handover-v0.4.md)

## 교차 검토 1회차 처리

Claude의 Phase B 실행은 29개 중 22개 통과, 7개 실패였습니다. 아래는 검토 항목을 반영한 C1 결과입니다. [교차 검토](claude-review-1.md) · [실패 재현 로그](playwright-logs/run1-failures.log)

| 항목 | 처리 결과 |
| --- | --- |
| R1 · 가로 넘침 | v0.4 스토리의 실습 명령·결과 `pre`는 Lab과 같은 로컬 스크롤 규칙을 적용했습니다. S4-5는 도식 안의 요청 JSON과 원고 실습 결과가 서로 다른 코드 렌더러를 사용합니다. 원고 결과에도 로컬 스크롤을 적용하고, 본문 그리드의 최소 폭을 0으로 제한했으며 도식의 인라인 코드는 줄바꿈을 허용했습니다. GFM 표는 자체 컨테이너 안에서 가로 스크롤합니다. 모바일에서 명령·표의 내부 스크롤과 S4-5 범위 밖 예시를 열었을 때의 문서 폭을 Playwright에 추가했습니다. Lab CSS는 그대로 사용합니다. |
| R2 · 물결표 범위 | v0.4 인트로·화면 제목·질문·캡션·해설·표·이해 확인·실습 문구의 마크다운에 `singleTilde: false`를 적용했습니다. 인트로와 31화면을 실제 스토리 컴포넌트로 정적 렌더링해 `del`이 없고 S4-5·S6-2의 범위 표기가 남는 것을 확인했습니다. Lab 목차·색인·9개 Lab 원고의 렌더링 조각에도 현재 취소선은 없었습니다. 공유 Lab 렌더러는 v0.4 모드에 같은 옵션을 적용하며, v0.3은 기존 렌더링 설정을 사용합니다. |
| R3 · 복귀 안내 | 로그의 두 `status`는 복귀 안내와 초기에는 비어 있는 복사 피드백이었습니다. 실제 중복 음성 안내를 확인할 근거는 없었고, 직접 확인한 실패는 Playwright의 역할 선택 충돌입니다. 복귀 안내에 `role="status"`를 유지하고, 스토리의 복사 피드백은 `aria-live="polite"`로 알립니다. I6은 도식의 기존 live 영역을 사용합니다. 정적 렌더링에서 S3-7 복귀 시 `status`가 한 개임을 확인했고, 복사와 I6 테스트는 각각의 live 영역을 검증하도록 갱신했습니다. |
| R4 · I10 레인 | 개요 5단계에서 주체별 작업과 오가는 데이터를 표시합니다. 비활성 레인은 제목만 흐리게 표시합니다. 파이프라인 3단계는 Python, 8단계는 응답을 주고받는 외부 AI와 Python을 강조합니다. |
| R5 · I3 복귀 경로 | 3단계에 stdout·stderr 파이프의 쓰기·읽기 쪽 연결을 추가했습니다. 4–6단계에 Git에서 Python으로 돌아오는 두 통로와 기록된 출력값을 표시하고, 6단계에는 운영체제가 별도로 전달하는 종료 코드를 추가했습니다. 값은 Lab 04를 인용한 S3-5 결과를 읽습니다. |
| R6 · I9 사례 | 기록 11건의 버튼에 설계 §4 사례명을 표시하고 테스트에서 설계 원문과 대조했습니다. C6에 공식 본문 규칙과 검증기의 차이(G4)를 표시했습니다. P1은 R9 입력과 처리 결과에서 How to Test를 추출해 나란히 보여 주며, 처리된 PR 전문도 펼쳐 볼 수 있습니다. |
| R7 · 선택 상태 | v0.4 스토리 도식 버튼의 선택 상태를 강조색 채움·굵은 글자·체크 표시로 구분했습니다. v0.3 Lab 버튼에는 해당 CSS를 적용하지 않습니다. |
| R8 · 선택값 컨트롤 | S4-5 체크박스에 전역 입력 너비와 flex 확장을 덮어써 라벨 바로 앞에 배치했습니다. 체크 해제 시 슬라이더·선택 상자에 비활성 상태와 스타일을 적용하고 요청 JSON에서 해당 키를 생략합니다. |
| R9 · 원고 반영 | 스토리 파서가 현재 원고를 읽습니다. 정적 렌더링으로 S1-4 핵심 메시지, S5-2 이해 확인 답, 인트로 실습 문구를 원고에서 읽어 표시하는 것을 대조했습니다. I9 사례 이름은 현재 설계 문구와 단위 테스트로 대조했습니다. |

## C1 샌드박스 검증

| 명령 | 결과 |
| --- | --- |
| `node_modules/.bin/vitest run src/b32Story/storyboardV04.test.tsx --no-cache` | 통과. 1파일, 18테스트. 31화면과 Lab 마크다운 정적 렌더링, 복귀 상태, 수정 원고·I9 사례명 대조를 포함합니다. |
| `node_modules/.bin/vitest run` | 종료 1. 47파일 중 46개 통과, 1개 실패. 557테스트 중 552개 통과, 기존 실패 5개, 신규 실패 0개입니다. |
| `node_modules/.bin/vitest run --mode b32-review src/b32Story/learningCycle.test.ts --no-cache` | 통과. v0.3 Lab·학습 순환 계약 4테스트. |
| `node_modules/.bin/tsc -b` | 통과. |
| `npm run build` | 통과. 데이터 생성과 검증, 타입 검사, 기본 Vite 빌드, B2-1 빌드 검사까지 완료했습니다. |
| `node_modules/.bin/vite build --mode b32-v04 --outDir /tmp/b32-phase-c1.Ltkbh8/dist-v04` | 통과. v0.4 원고를 빌드 훅에서 검증했고 v0.4 스토리와 Lab 청크를 확인했습니다. 두 Vite 빌드에 번들 크기 경고가 있었습니다. |
| `B32_V04=1 node_modules/.bin/playwright test playwright/b32-integrated-v04.spec.ts --list` | 1파일, 29테스트 수집. |

전체 Vitest의 기존 실패 5건은 모두 `scripts/glossary_visual_contract.test.mjs`입니다. B6-1 용어 메타데이터 비교 1건, Fast Batch B 생성 항목·SVG 비교 2건, Fast Batch C 용어 본문 비교 1건, Browser Rendering 생성 항목 비교 1건입니다. `1ff0cf3` QA에도 같은 파일의 기존 실패 5건이 기록되어 있습니다. [v0.3 QA](../b32-learning-cycle-v03/README.md)

C1에서 Codex는 로컬 서버와 Chromium에 대한 샌드박스 제한으로 Playwright 수집까지 수행했습니다. Claude의 실제 브라우저 결과는 아래에 기록했습니다. [B-0 설계 검토](codex-design-review.md)

## 교차 검토 2회차 R10 처리

Claude의 C1 수정본 검증에서 v0.4는 25/29가 통과했습니다. 남은 4건은 모두 S4-5에서 ‘범위 밖 입력 예시’를 연 뒤 360px·390px의 Dark/Light에서 문서 폭이 437px이 된 경우입니다. v0.3은 16/16, 기존 B3-2는 69/69가 통과했습니다. [교차 검토 2회차](claude-review-2.md) · [v0.4 실행 로그](playwright-logs/run2-v04.log) · [v0.3 실행 로그](playwright-logs/run2-v03-regression.log) · [기존 B3-2 실행 로그](playwright-logs/run2-legacy-regression.log)

**R10 반영.** `.b32-integrated-parameters`의 모든 직접 그리드 항목에 `min-width: 0`을 적용했습니다. 오류 예시 래퍼가 긴 로그 줄의 너비를 최소 폭으로 사용하지 않으므로, 기존 `pre`의 `max-width: 100%`와 내부 스크롤이 카드 폭을 기준으로 동작합니다. 기존 Playwright 스펙의 예시 버튼 클릭 후 문서 폭 검사로 재확인할 수 있습니다. C2 수정본의 브라우저 재검증은 Claude가 수행합니다. [수정 CSS](../../src/b32Story/b32Integrated.css) · [Playwright 스펙](../../playwright/b32-integrated-v04.spec.ts)

| C2 샌드박스 명령 | 결과 |
| --- | --- |
| `node_modules/.bin/vitest run src/b32Story/storyboardV04.test.tsx --no-cache` | 통과. 1파일, 18테스트. |
| `node_modules/.bin/tsc -b` | 통과. |
| `node_modules/.bin/vite build --mode b32-v04 --outDir /tmp/b32-phase-c2.UiIQVq/dist-v04` | 통과. 기존 번들 크기 경고가 있었습니다. |

## data:build로 바뀐 추적 파일

없음. `npm run build` 전후의 추적 파일 변경 목록을 비교했습니다.

## 인수인계 §7의 변경 범위 확인

```sh
git diff --stat 1ff0cf3 -- . ':!content/mission-stories/main-m06' ':!src/b32Story' ':!playwright/b32-*' ':!reports/b32-integrated-learning-v04'
```

```text
 package.json                       |  3 ++-
 playwright.config.ts               |  5 +++--
 src/App.tsx                        |  7 ++++---
 src/missionUI/LearningFocusNav.tsx |  6 +++---
 vite.config.ts                     | 27 ++++++++++++++++++++++++++-
 5 files changed, 38 insertions(+), 10 deletions(-)
```

| 파일 | 변경 이유 |
| --- | --- |
| `package.json` | `dev:b32-v04` 등록 |
| `playwright.config.ts` | `B32_V04=1` 모드와 v0.4 서버 재사용 방지 |
| `src/App.tsx` | 모드 조건에 따라 v0.4 스토리·Lab 지연 로딩 |
| `src/missionUI/LearningFocusNav.tsx` | v0.4 Lab에만 적용하는 `hideStory` 옵션. 출발점이 있는 Lab의 복귀 링크 한 개를 유지하며 다른 호출부는 기존 기본값을 사용합니다. |
| `vite.config.ts` | `b32-v04` 빌드에서 원고·용어 ID·SVG 상태 검증 |

다른 미션의 콘텐츠와 데이터는 변경 범위에 없습니다. `git diff --exit-code 8705e72 -- content/mission-stories/main-m06`으로 기준 원고·근거 파일과의 일치를 확인했습니다.

## 원고 문의

Phase B 문의 3건은 Claude의 `8705e72`에서 반영했습니다. S1-4는 Python이 사용자 명령을 받은 뒤 Git을 실행하는 순서로, S5-2는 제목 길이 외 검사 조건까지 설명하도록, 인트로는 Scene 2에서 실습을 시작하도록 수정됐습니다. [Claude 답변](claude-review-1.md#원고-문의-답변)

## Claude의 샌드박스 외 브라우저 검증

```sh
B32_V04=1 PLAYWRIGHT_PORT=4175 B32_V04_QA_OUTPUT=reports/b32-integrated-learning-v04/screens npx playwright test playwright/b32-integrated-v04.spec.ts
B32_REVIEW=1 PLAYWRIGHT_PORT=4174 npx playwright test playwright/b32-learning-cycle.spec.ts
B32_QA_OUTPUT=/tmp/b32-legacy-screens npx playwright test playwright/b32-story-web.spec.ts playwright/b32-lesson-v02.spec.ts playwright/b32-flow-preview.spec.ts
```

## 최종 QA 결과 (Claude · 샌드박스 밖 · 2026-11-28)

검증 대상: 교차 검토 2회차 반영 후 작업 트리(원고 `19da5cb`). 이 결과를 담은 커밋이 최종 검증 SHA입니다. 실행 로그는 [playwright-logs](playwright-logs/)에 있습니다.

| 검증 | 명령 | 결과 |
| --- | --- | --- |
| v0.4 Playwright | `B32_V04=1 PLAYWRIGHT_PORT=4175 B32_V04_QA_OUTPUT=reports/b32-integrated-learning-v04/screens npx playwright test playwright/b32-integrated-v04.spec.ts` | **29/29 통과** ([run3-v04-final.log](playwright-logs/run3-v04-final.log)). 1차 22/29 → 2차 25/29 → 3차 29/29 |
| v0.3 Playwright 회귀 | `B32_REVIEW=1 PLAYWRIGHT_PORT=4174 npx playwright test playwright/b32-learning-cycle.spec.ts` | 16/16 통과 ([run2](playwright-logs/run2-v03-regression.log)). 기준 `1ff0cf3`과 같음 |
| 기존 B3-2 Playwright 회귀 | `npx playwright test playwright/b32-story-web.spec.ts playwright/b32-lesson-v02.spec.ts playwright/b32-flow-preview.spec.ts` | 69/69 통과 ([run2](playwright-logs/run2-legacy-regression.log)). 기준과 같음 |
| Vitest 전체 | `npx vitest run` | 557개 중 552 통과 · 5 실패. 실패 5건은 모두 `scripts/glossary_visual_contract.test.mjs`의 **기존 실패**(기준 커밋과 같은 항목). 신규 실패 0 |
| TypeScript | `npx tsc -b` | 통과 |
| 공개 빌드 | `npm run build` | 통과. 추적 중인 생성 파일 변경 없음 |
| v0.4 빌드 | `npx vite build --mode b32-v04 --outDir <임시>` | 통과 |
| 미션 공통 UI 검사 | `npm run mission:ui-check` (4200 포트 공개 모드 서버) | 실패 `all 21 card links introduce a mission`. **기준 `1ff0cf3`에서도 같은 실패**(기존 실패). 이 스크립트가 실행 중 추적 파일 `reports/mission-ui-standard/app-results.json`을 다시 쓰므로 두 worktree 모두 원래대로 되돌렸습니다 |
| 비밀값 | 기존 `secret-check.cjs` 규칙 + 키·이메일 패턴 검색 | 변경·신규 텍스트 파일 32개에서 발견 없음 |

교차 검토 2회차 이후 바뀐 파일은 `src/b32Story/b32Integrated.css` 하나(v0.4 전용)이므로, 2차에서 통과한 v0.3·기존 B3-2 회귀는 다시 실행하지 않고 재사용했습니다(거버넌스 §5 QA 증빙 재사용).

**화면 확인 (Claude)** 1280×720 Light에서 인트로, S1-4(I10 2단계), S2-1, S2-2, S3-3(I3 5단계), S4-5(I7), S5-3(I9), S6-2(I10·구현 비교표)를 직접 확인했습니다. 폭별 Dark/Light 대표 화면은 [screens](screens/)의 S2-3 8장입니다. 31화면 × 360·390폭의 넘침은 Playwright로 확인했고, 모든 화면을 사람이 눈으로 본 것은 아닙니다.

**미검증** 실제 강의실 프로젝터·실기기 모바일, 화면 읽기 프로그램의 실제 낭독, 발표 모드에서 강사가 31화면을 진행하는 시간(설계 §7은 추정치), B3-2 개념지도(미구현).
