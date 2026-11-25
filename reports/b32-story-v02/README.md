# B3-2 미션 스토리 v0.2 웹 QA

**검토일** 2026-11-23 · **대상** Draft PR #53 · **상태** Owner 화면 검수 대기

구현 기준은 흐름 탐색 `f39ace15`, 교육 원고 `bff4b23f`(cherry-pick `74a440f`), B3-2 실제 소스 `be21c499`입니다. P 입력과 현재 슬라이드 정보 갱신 방식은 AX_Slides를 참고해 React의 슬라이드 상태와 해설 표시 상태로 구현했습니다. [교육 원고](../../content/mission-stories/main-m06/storyboard-v0.2.md) · [흐름 탐색 원고](../../content/mission-stories/main-m06/flow-preview-content-v0.2.md) · [참고 구현](https://github.com/hyun02063185-AX-beginner/AX_Slides/blob/main/assets/deck.js#L536-L556)

## 실제 화면 열기

`feature/b32-flow-navigator-v02`에서 `npm ci` 후 `npm run dev`를 실행합니다. 기본 포트 5173 기준입니다.

- [강의 소개](http://localhost:5173/#/missions/main-M06/story)
- [S3-2 API 요청·응답](http://localhost:5173/#/missions/main-M06/story?scene=3&screen=2)에서 **P** 또는 **설명 보기**로 해설을 엽니다. **P**, **Esc**, **닫기** 버튼으로 닫을 수 있습니다. 슬라이드를 이동하면 해설이 자동으로 닫힙니다.
- [전체 흐름도](http://localhost:5173/#/missions/main-M06/story/flow-preview)와 [5단계 상세](http://localhost:5173/#/missions/main-M06/story/flow-preview?step=api)는 Vite 개발 서버에서 열립니다.

## 하단 고정 해설 QA · 2026-11-25

| 뷰포트 | S3-2 해설 열린 화면 |
| --- | --- |
| 1280×720 | [Dark](overlay-captures/1280-dark-api-open-viewport.png) |
| 1000×720 | [Light](overlay-captures/1000-light-api-open-viewport.png) |
| 360×800 | [Dark](overlay-captures/360-dark-api-open-viewport.png) |
| 390×844 | [Light](overlay-captures/390-light-api-open-viewport.png) |

로컬 프로덕션 빌드를 macOS Chrome에서 캡처했습니다. 모바일은 Chrome의 터치 에뮬레이션에서 그림을 읽던 스크롤 위치로 열었습니다.

- 네 해상도와 Dark/Light 조합에서 `window.scrollY`와 그림의 `getBoundingClientRect()`가 열기·닫기 전후 동일했습니다. 긴 해설의 본문 끝까지 휠로 스크롤한 뒤에도 슬라이드 위치가 유지됐습니다. 이전·다음, 브라우저 기록, Scene 선택, 주소 직접 입력, 새로고침에서 해설이 닫힌 상태로 시작했습니다.
- `npm run build`, 콘텐츠 단위 테스트 7건, Playwright 60건이 통과했습니다. Playwright는 v0.2 해설 17건, 흐름 탐색 11건, 기존 B3-2 화면 회귀 32건입니다. v0.2 해설 검사는 8개 슬라이드의 해설과 학습가이드 링크를 원고와 대조합니다. [Playwright 테스트](../../playwright/b32-lesson-v02.spec.ts)

## 기준 커밋 `e5635b7`의 웹 캡처

전체 흐름은 지정한 뷰포트에서 캡처했습니다. S3-2의 모바일 닫힘 및 모든 열림 캡처는 그림과 하단 패널 위치를 한 번에 볼 수 있도록 전체 페이지를 포함합니다.

| 뷰포트 | 전체 흐름 Dark / Light | S3-2 Dark 닫힘 / 열림 | S3-2 Light 닫힘 / 열림 |
| --- | --- | --- | --- |
| 1280×720 | [Dark](captures/1280-dark-flow.png) · [Light](captures/1280-light-flow.png) | [닫힘](captures/1280-dark-api-closed.png) · [열림](captures/1280-dark-api-open.png) | [닫힘](captures/1280-light-api-closed.png) · [열림](captures/1280-light-api-open.png) |
| 1000×720 | [Dark](captures/1000-dark-flow.png) · [Light](captures/1000-light-flow.png) | [닫힘](captures/1000-dark-api-closed.png) · [열림](captures/1000-dark-api-open.png) | [닫힘](captures/1000-light-api-closed.png) · [열림](captures/1000-light-api-open.png) |
| 360×800 | [Dark](captures/360-dark-flow.png) · [Light](captures/360-light-flow.png) | [닫힘](captures/360-dark-api-closed.png) · [열림](captures/360-dark-api-open.png) | [닫힘](captures/360-light-api-closed.png) · [열림](captures/360-light-api-open.png) |
| 390×844 | [Dark](captures/390-dark-flow.png) · [Light](captures/390-light-flow.png) | [닫힘](captures/390-dark-api-closed.png) · [열림](captures/390-dark-api-open.png) | [닫힘](captures/390-light-api-closed.png) · [열림](captures/390-light-api-open.png) |

- 해설을 연 직후의 뷰포트에서는 그림 아래쪽, 슬라이드 조작과 해설이 함께 보입니다. [PC Dark](captures/1280-dark-api-open-viewport.png) · [모바일 Light](captures/390-light-api-open-viewport.png)
- 흐름도 5단계에서 인증·본문·응답과 다음 단계 연결을 확인할 수 있습니다. [PC Dark](captures/1280-dark-flow-api.png) · [모바일 Light](captures/390-light-flow-api.png)

## 기준 커밋의 QA 결과

| 검사 | 판정 |
| --- | --- |
| v0.2 교육 원고 | **PASS.** 새 제목·부제·학습 목표·Scene 이름·화면 문구를 확인했습니다. v0.2 Markdown에서 8개 화면 ID별 해설을 읽고, v0.1 원고에서 학습자 접힘 설명, 강사·시연 노트와 실제 출력 전문을 계속 읽습니다. [콘텐츠 단위 테스트](../../src/b32Story/content.test.ts) |
| P 해설 동작 | **PASS.** macOS Chrome에서 네 뷰포트와 Dark/Light 조합별로 각 8개 해설, 총 64개 화면 상태를 원고와 대조했습니다. P·Shift+P, Esc, 버튼, 모바일 터치, 해설을 연 채 이전·다음 이동, 스크롤, 닫기 후 포커스 복귀를 확인했습니다. 새로고침은 해당 슬라이드에서 해설을 닫은 상태로 시작합니다. 그림·하단 탐색·패널 사이의 겹침과 가로 넘침은 없었습니다. [Playwright 테스트](../../playwright/b32-lesson-v02.spec.ts) |
| F1·F7와 실제 실행 | **PASS.** 데스크톱과 모바일에서 요청은 Python에서 외부 API로, 응답은 반대로 향합니다. 실제 `AIClient.generate()`의 인증 헤더·요청 본문·응답 텍스트 접근과 대조했습니다. F6에는 API 키가 Git 문맥에서 제외되고 인증 헤더에 사용됨을 표시했습니다. 요청 구조 재현과 실제 터미널 출력은 근거 표기로 구분합니다. [B3-2 소스](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/ai_gitgen/ai_client.py#L26-L58) |
| 흐름도 | **PASS.** 6단계와 예외 4개, 기존 8개 슬라이드 직접 주소와 뒤로 가기를 확인했습니다. 5단계에서 요청, 응답 JSON의 초안 추출, 다음 단계의 검증을 구별했습니다. [흐름 테스트](../../playwright/b32-flow-preview.spec.ts) |
| 시각 확인 | **PASS.** 캡처를 열어 주 화면과 해설을 확인했습니다. S3-2 패널 표본 최저 텍스트 대비는 Dark 8.40:1, Light 5.64:1입니다. 요청·응답 선은 SVG 바탕 대비 Dark 9.78:1 이상, Light 5.42:1 이상입니다. |
| 정적 SVG 검증 | **PASS.** SVG 29개를 재생성하고 바이트 일치를 확인했습니다. v0.2 활성 그림의 상태별 글자 크기·범위·겹침, F1/F7 화살표 방향, 원고와 실습 증거, 정적 미리보기를 검사했습니다. v0.1 SVG 18개와 원고·실행 근거는 기준 커밋의 바이트를 보존했습니다. |
| 빌드 | **PASS.** `npm run build`와 B3-2 Python 단위 테스트 14건 통과. 로컬 프로덕션 빌드에서 S3-2 직접 주소와 P 해설이 동작했고, 흐름도 주소는 개발 서버에서만 열렸습니다. |
| Owner 화면 검수 | **미검증.** 실제 모바일 기기와 강의실 프로젝터에서의 확인 및 통합 여부 결정이 남아 있습니다. |

## 자동 테스트 결과와 기존 실패

- 이번 변경의 Playwright 검사 20건을 통과했습니다. 기존 B3-2 32건, B3-1 6건, B6-1 10건, 공통 미션 진입 18건도 통과했습니다. 공통 미션 진입 1건의 추천 카드 기대값 5개와 실제 6개 차이는 `origin/main`에서도 재현된 기존 실패입니다.
- 전체 Vitest는 527건 통과, 5건 실패입니다. 실패는 `origin/main`에서 확인한 용어사전 기준 해시 4건과 B3-1 SVG 목록 1건입니다. B3-2 콘텐츠 단위 테스트 7건은 통과했습니다.
- v0.1 보존본을 검사하는 `preview.cjs --legacy --check-only`는 기존 F4 데스크톱 `subprocess.run()` 글자 경계 실패를 재현합니다. v0.2에서 사용하는 F4 변형과 기본 검사는 통과했습니다. [이전 PoC QA](../b32-flow-preview/README.md)

```sh
python3 -I content/mission-stories/main-m06/_tools/build_figures.py
node content/mission-stories/main-m06/_tools/preview.cjs --check-only
PLAYWRIGHT_CHANNEL=chrome npx playwright test playwright/b32-lesson-v02.spec.ts playwright/b32-flow-preview.spec.ts
```
