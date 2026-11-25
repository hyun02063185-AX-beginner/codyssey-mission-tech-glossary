# B3-2 미션 스토리 v0.2 웹 QA

## 입문자 학습 개선 r1 · 2026-11-25

Draft PR #53의 기준 `78bfa9c`에서 독립 검토 `df0d24c`, 개정 원고 `5fc843a` 순서로 fast-forward했습니다. 개정 원고를 인트로와 8개 슬라이드에 적용했습니다. [독립 검토](../../docs/mission-guides/b3-2-v02-beginner-review.md) · [r1 원고](../../content/mission-stories/main-m06/storyboard-v0.2-r1.md) · [조치표와 파일럿 가설](../../content/mission-stories/main-m06/review-v0.2-r1.md)

| 독립 검토 지적 | 웹 반영 |
| --- | --- |
| 학습 목표와 선수지식이 학습자에게 전달되지 않음 | 소개의 학습 목표 4개, 해설 사용 안내, 명령줄·Python 딕셔너리 및 리스트 선수지식 표시 |
| 화면 전환 이유와 전체 이야기의 답이 부족함 | 해설 8개를 개정하고 S4-2에서 처음 질문에 답함. 이해 확인을 먼저 읽고 정답을 직접 펼치도록 구성 |
| Git 실행과 판단에 세부 설명이 과다함 | F4에서 입력 읽기와 Git 실행을 구별. F5는 종료 코드를 먼저 강조하고 연습 저장소의 값에 재현 표기 |
| 보낼 글의 범위와 다음 요청의 관계가 불분명함 | F6에 담는 것·제외할 것·값 가리기·전송 멈춤·다음 요청의 `user`를 표시 |
| API 요청 주소, 상태, 응답 JSON 예시가 빠짐 | F7에 설정에서 읽는 POST 주소, 별도 인증 헤더, JSON 본문, 양방향 변환, 401·403 분기와 교육용 응답 JSON을 표시. API 키는 요청 인증과 권한 확인에 쓰는 자격 증명으로 설명 |
| S4-1이 작성 규칙의 효과를 보여 주지 못함 | F8에서 같은 Git 문맥에 대한 공통 `user`와 커밋·PR용 `system`을 연결. 실제 두 실행에서 남은 근거는 터미널 출력이며 원본 `user`의 일치 여부는 미확인 |
| 접힘 설명 중복과 그림 가림 | P 해설을 학습 설명으로 사용하고 이해 확인만 접힘 영역에 표시. 하단 패널은 최대 40%로 제한. F1·F7의 실행 위치 각주는 원고 근거 안내에서 확인 가능 |

v0.1·v0.2 원고, 기존 SVG, 실제 출력과 근거는 기준 커밋과 바이트가 같습니다. 강사 스크립트, 발표자 시연, 실제 출력 전문, 기존 주소와 학습가이드 링크는 계속 사용할 수 있습니다.

### F6·F7 해설 열린 화면

로컬 프로덕션 빌드를 macOS Chrome에서 캡처했습니다. PC는 슬라이드 진입 위치에서 해설을 열었습니다. 모바일은 터치를 에뮬레이션한 뷰포트에서 해설을 연 뒤 화면의 보이는 위쪽을 직접 스크롤한 읽기 위치입니다.

| 뷰포트 | F6 · Dark / Light | F7 · Dark / Light |
| --- | --- | --- |
| 1280×720 | [Dark](r1-captures/1280-dark-f6-explanation.png) · [Light](r1-captures/1280-light-f6-explanation.png) | [Dark](r1-captures/1280-dark-f7-explanation.png) · [Light](r1-captures/1280-light-f7-explanation.png) |
| 1000×720 | [Dark](r1-captures/1000-dark-f6-explanation.png) · [Light](r1-captures/1000-light-f6-explanation.png) | [Dark](r1-captures/1000-dark-f7-explanation.png) · [Light](r1-captures/1000-light-f7-explanation.png) |
| 360×800 | [Dark](r1-captures/360-dark-f6-explanation.png) · [Light](r1-captures/360-light-f6-explanation.png) | [Dark](r1-captures/360-dark-f7-explanation.png) · [Light](r1-captures/360-light-f7-explanation.png) |
| 390×844 | [Dark](r1-captures/390-dark-f6-explanation.png) · [Light](r1-captures/390-light-f6-explanation.png) | [Dark](r1-captures/390-dark-f7-explanation.png) · [Light](r1-captures/390-light-f7-explanation.png) |

PC에서는 F6의 제외·결과 카드와 F7의 상태·응답 예시·추출 경로가 첫 화면에서 보입니다. F7의 Python 영역은 요청과 응답을 나란히 배치해 둘 다 해설 위에서 읽을 수 있게 했습니다. 모바일은 그림을 세로로 읽습니다. 해설을 연 상태로 그림을 직접 이동하면 F6의 제외·결과 카드와 F7의 양쪽 화살표·상태·응답 예시를 각각 한 화면에서 볼 수 있습니다. 390px F7 캡처에서는 주소 줄을 보려면 그림을 위쪽으로 조금 더 이동해야 합니다.

### 자동 검증

- B3-2 Playwright 69건을 통과했습니다. 해설과 이해 확인 26건을 프로덕션 빌드에서 다시 통과했습니다. 네 뷰포트와 두 테마에서 열기·닫기 전후 `scrollY`와 그림 좌표, 내부 스크롤, 슬라이드 이동 시 닫힘, F6·F7 핵심 요소의 가시성을 확인했습니다. 360·390px Chrome 터치 에뮬레이션에서는 버튼과 터치 스크롤도 확인했습니다.
- `npm run build`가 통과했습니다. SVG 43개가 동일한 바이트로 재생성됐으며 v0.2와 r1의 정적 QA가 통과했습니다. 전체 Vitest는 528건 통과, 실패 5건입니다. 실패 항목은 `78bfa9c`에서도 재현된 용어사전 기준 해시 4건과 B3-1 SVG 목록 1건입니다.
- 공통 Story UI 회귀의 B3-1 상세 영역 검사 8건은 기준 커밋에서도 같은 위치에서 실패했습니다.

### 시범 강의 검증

시범 수업에서 S3-2의 요청·응답 요소와 S4-2의 전체 이야기 순서를 학습자가 답을 펼치기 전에 자기 말로 설명할 수 있는지 확인해야 합니다. 실제 휴대전화와 강의실 프로젝터에서 그림·해설 병행 읽기도 검증할 항목입니다.

## v0.2 초기 구현 및 하단 고정 레이어 이력

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
