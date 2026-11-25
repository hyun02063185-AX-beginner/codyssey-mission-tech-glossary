# B3-2 미션 스토리 v0.3 검토 보고서

검수일 2026-11-25 · 구현 브랜치 `feature/b32-learning-cycle-v03` · 설계 기준 `c3bb9f52c265a89afc49f3dd80836c95ec1a34f3`

## 로컬 화면

```sh
npm ci
npm run dev:b32-review -- --host 127.0.0.1 --port 4174
```

- [미션 스토리와 인트로](http://127.0.0.1:4174/#/missions/main-M06/story)
- [Lab 목차](http://127.0.0.1:4174/#/missions/main-M06/lab)
- [S1-2에서 출발한 Lab 03](http://127.0.0.1:4174/#/missions/main-M06/lab/03?from=S1-2)
- [Lab 03에서 S1-2로 복귀한 화면](http://127.0.0.1:4174/#/missions/main-M06/story?scene=1&screen=2&from-lab=03)
- [결과로 찾아보기](http://127.0.0.1:4174/#/missions/main-M06/lab#결과로-찾아보기)

`b32-review`는 Vite 검토 모드입니다. 기존 HashRouter의 `#/` 계약을 사용합니다. 기본 빌드는 기존 v0.2-r1 스토리를 제공하며 Lab 라우트는 검토 모드에 등록됩니다.

## 검수한 학습 흐름

| 항목 | 결과 |
| --- | --- |
| 스토리 | 인트로와 기존 8/8 화면. 화면 ID·순서·핵심 질문 유지. 각 화면의 실습 진입과 인트로의 Lab 목차 접근 확인. |
| 11월 25일 사례 | README.md 마지막의 실습 메모, 이번 실행의 535자 Git 문맥, `gpt-5-mini`와 실제 초안. F2·F3·F5·F6·F7·F8의 모바일·데스크톱 새 판과 `storyboard-v0.3.md` 확인. 10월 20일 출력은 이전 실행 사례와 발표자 노트에서 접근 가능. |
| Lab 9/9 | 각 URL에서 직접 진입. A 본문은 펼침, 실행 기록·해설과 B/C는 기본 접힘. 필요한 섹션을 결과 색인에서 열 수 있음. 모바일에서는 실행 명령을 별도 접힘으로 제공. |
| 왕복 K1–K11 | 스토리에서 해당 Lab으로 이동한 뒤 출발 슬라이드로 복귀. 관련 그림 부분·관찰 기록·확인 질문·선택 경로 표시. 일반 진입에는 안내가 없으며 닫기와 화면 이동으로 해제. |
| 주소와 브라우저 탐색 | 유효한 출발·복귀를 새로고침과 뒤로 가기로 재현. 잘못된 값·중복·관계없는 화면은 기본 복귀 대상으로 처리. Lab·결과 색인에서 용어사전 복귀 연결 확인. |
| 명령 복사 | 클립보드에서 Lab 03의 연습 저장소 검사 및 중복 방지 블록과 Lab 04의 heredoc을 원고와 문자 단위 대조. 출력 블록에는 복사 버튼이 없음. |
| 결과 색인 | 19개 항목. `변경 사항이 없습니다.`와 요청 0회, 스테이징 상태, HTTP 400·200, `choices[0].message.content` 등을 Lab 섹션과 스토리 화면에 연결. |
| 도식 6/6 | 기존 발표 테마를 사용한 반응형 HTML 도식. 상태 전환은 키보드와 `aria-pressed`로 제공. Git 비교 영역, 종료 상태와 출력 통로, 요청 본문의 `user`, HTTP 응답, 초안 생성, 출력 연결을 각각 검증. |
| 실제 근거 | 최소 연결 테스트 HTTP 200 JSON과 COMMIT·PR의 터미널 출력에 각각 출처 표시. HTTP 400은 키 재입력 뒤 해결됐으며 정확한 원인은 미확인으로 표시. Lab 09의 Owner 출력은 별도 호출이고 종료 코드 0은 예상으로 표시. |
| 브라우저 데이터 | 관찰 체크는 현재 화면에서만 사용하며 새로고침 시 초기화. 기존 테마 설정은 기존 저장 키 사용. API 키 입력·외부 AI 호출·터미널 실행·출력 수집 없음. |

Lab 학습 본문, 명령, 결과와 색인은 `lab-guide-v0.3-r1.md`를 읽습니다. 왕복 카드의 질문·관찰·그림 위치는 `lab-story-mapping-v0.3-r1.md`의 표를 파싱합니다. 검토 화면의 Lab 07·08 제목은 구현 요청에 적힌 이름을 따릅니다. 스토리 SVG는 기존 Python 생성기를 사용하며 43개의 이전 SVG는 바이트 단위로 보존했습니다.

## 시각 검수

Playwright Chromium에서 각 폭의 Dark·Light로 Lab 목차, Lab 03 도식 전환 및 스토리 8개 화면을 확인했습니다. 360px·390px에서 명령은 접힘으로 시작하며 펼치면 코드만 가로 스크롤합니다. Lab 표는 가로 스크롤 영역 안에 있고 결과 색인은 좁은 폭에서 한 열로 표시됩니다. 1280×720의 P 해설은 그림 오른쪽에 있습니다. 그림이 세로로 길면 아래로 스크롤하며 볼 수 있습니다. 1000px 이하의 검수 폭에서는 해설이 그림 뒤에 나타나고, 열 때 해설에 초점이 이동합니다.

| 폭 × 높이 | Lab 03 Dark / Light | 추가 화면 |
| --- | --- | --- |
| 1280×720 | [Dark](screens/1280-dark-lab03.png) · [Light](screens/1280-light-lab03.png) | 목차 [Dark](screens/1280-dark-index.png) · [Light](screens/1280-light-index.png), S1-2 복귀와 P [Dark](screens/1280-dark-story-return-p.png) · [Light](screens/1280-light-story-return-p.png), [Lab 07 비용 안내](screens/1280-dark-lab07.png) |
| 1000×800 | [Dark](screens/1000-dark-lab03.png) · [Light](screens/1000-light-lab03.png) | S1-2 복귀와 P [Dark](screens/1000-dark-story-return-p.png) · [Light](screens/1000-light-story-return-p.png) |
| 640×844 | [Dark](screens/640-dark-lab03.png) · [Light](screens/640-light-lab03.png) | 터미널과 나란히 사용하는 한 열 레이아웃 |
| 390×844 | [Dark](screens/390-dark-lab03.png) · [Light](screens/390-light-lab03.png) | [Lab 08 최소 연결 테스트의 응답 발췌](screens/390-light-lab08-response.png) |
| 360×800 | [Dark](screens/360-dark-lab03.png) · [Light](screens/360-light-lab03.png) | 명령을 펼친 뒤 문서 자체의 가로 넘침 없음 |

## 기술 검증

| 검증 | 명령 / 결과 |
| --- | --- |
| Build·TypeScript | `npm run build`, `npx tsc -b`, `npx vite build --mode b32-review --outDir /tmp/b32-v03-dist` 통과. |
| 정적 빌드 브라우저 | 기본 빌드는 기존 S3-2와 Lab 미등록 상태, 검토 빌드는 535자 사례와 Lab 03 진입을 확인. |
| 단위 테스트 | 전체 534 통과·5 실패. 기준 커밋의 별도 worktree에서 528 통과·동일 항목 5 실패. 실패는 `scripts/glossary_visual_contract.test.mjs`의 기존 용어사전 비교이며 B3-2 신규 6건 통과. 브라우저와 동시에 실행했을 때 기존 개념지도 `edge corridors` 1건이 시간 초과됐고, 단독 전체 재실행에서 통과했습니다. 같은 시간 초과는 이전 v0.2-r1 검수 로그에도 있습니다. |
| v0.3 Playwright | `B32_REVIEW=1 PLAYWRIGHT_PORT=4174 B32_V03_QA_OUTPUT=/tmp/b32-v03-screens npx playwright test playwright/b32-learning-cycle.spec.ts --fully-parallel --workers=4` · 16 통과. |
| 기존 B3-2 Playwright | `B32_QA_OUTPUT=/tmp/b32-legacy-screens npx playwright test playwright/b32-story-web.spec.ts playwright/b32-lesson-v02.spec.ts playwright/b32-flow-preview.spec.ts` · 69 통과. P 열기·닫기, 발표자 자료, 기존 deep link와 PoC 포함. |
| SVG와 원고·근거 | `python3 content/mission-stories/main-m06/_tools/build_figures.py` 두 실행의 55개 SVG SHA-256 일치. `node content/mission-stories/main-m06/_tools/preview.cjs --v03 --check-only` 및 `--r1 --check-only` 통과. |
| 비밀값 | 위 검사에서 SVG·텍스트 증빙·v0.3 원고 확인. 셸 변수 참조 전체와 실제 Bearer 토큰을 구분하는 회귀 테스트 2건 통과. |
| 실제 AI API 호출 | 0회. 실습 명령은 원고와 클립보드 내용만 검사. |
| 변경 범위 | 다른 미션의 자료·라우트와 기존 브랜치 보존. Draft PR #53의 HEAD `cbac2531d6eadd965762386a098c614a903f8d34` 유지. |

## Owner 확인 사항

- 시범 수업에서 학습자가 Lab 03의 출력 줄을 F3의 M 위치와 대응시키고, 두 diff를 수집하는 이유를 자기 말로 설명하는지 확인합니다. 핵심 75분·추가 60분은 설계 추정치입니다.
- 교육장 환경에서 `read -rs` 프롬프트, `curl -K -`의 실제 응답, `trash` 지원 여부를 확인할 수 있습니다. 11월 25일 Owner 실행의 Lab 09 종료 코드, 사용한 clone SHA와 초안 요청의 원본 JSON은 기록으로 확인되지 않았습니다.
- 화면 검수 후 공개 경로와 범위, Lab 07·08 제공 대상, 복귀 시 그림 강조 여부, PR 통합 방식 결정을 기다립니다.

`READY_FOR_OWNER_LEARNING_EXPERIENCE_REVIEW`
