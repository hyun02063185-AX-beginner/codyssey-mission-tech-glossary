# B1-1 학습 가이드 웹 통합 검증

- 기준 콘텐츠: `content/b1-1-learning-guide-draft`, `86ed91c8d3de50263c29df9bbc3c7fbdce265b47`.
- 구현 브랜치: `feature/b1-1-learning-guide-web`. 검증 대상은 이 기록을 포함한 구현 커밋의 소스다.
- 작업 유형: 승인 콘텐츠의 React 학습 화면 통합. 신규 두 공개 경로와 B1-1 진입 링크는 작업 지시서로 구현 승인되었으며, 배포 승인은 별도 Owner Gate에 남긴다.
- 역할: Orchestrator가 범위·통합을 담당하고, Knowledge Architect 관점에서 MD/SVG SSOT와 기존 term 계약을 유지했다. Quality Harness는 아래 자동 검사를 수행했다. 콘텐츠 의미 재심사나 별도 Specialist·Agent 호출은 하지 않았다.

## 구현 및 의존성

- `src/MissionGuide.tsx`: 목차, 단원 본문, 접힌 모바일 탐색, PC 좌측 탐색, 이전/다음, 문서 제목 앵커, SVG 원본 열기.
- `src/missionGuideContent.ts`: Vite raw MD/URL SVG 로딩, 파일명 기반 단원 ID, Chapter·term·README 링크 변환. 지원 문서의 저장소 근거 링크는 승인 SHA에 고정한다.
- `src/missionGuide.css`: 기존 테마 변수 재사용, OS 라이트/다크 대응, 가이드 화면에만 적용되는 헤더 줄바꿈·다크 색상, 코드·표 영역별 스크롤. 1024px부터 V09 가로 그림을 우선 표시하며 두 원본 모두 접근 가능하다.
- `src/App.tsx`: 두 라우트와 B1-1 진입 영역만 추가.
- `src/missionGuide.test.ts`, `playwright/mission-guide.spec.ts`: 원본 연결·term 유효성·코드 보존·화면·탐색 검사.
- `package.json`, `package-lock.json`: `react-markdown ^10.1.0`, `remark-gfm ^4.0.1`, `rehype-slug ^6.0.0` 추가. 기존 TermRichContent의 제한적인 제목·목록·링크 처리로는 승인 문서를 온전히 지원하기 어려워 사용한다. HTML을 직접 주입하지 않으며 raw HTML 실행 플러그인은 사용하지 않는다.
- 승인 MD/SVG, canonical, 관계·taxonomy·기술지도 및 생성 데이터 변경 없음 (`git diff --exit-code <승인 SHA> -- content data src/data` 확인).

## URL과 미리보기

- `#/missions/main-M01/guide`
- `#/missions/main-M01/guide/:chapterId` — 파일명에서 `.md`를 뺀 ID, 예: `01-website-structure`, `04-event-dom-flow`, `09-website-overview`.
- README 표기 규칙은 목차 경로의 `?document=README#표기-규칙`에서 원문을 렌더링한다.
- 실제 실행: `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort` (사전에 `npm run build`). 백그라운드 미리보기를 실행해 최종 빌드 결과를 검증했다.
- 접속: `http://127.0.0.1:4173/#/missions/main-M01/guide`.

## 실행 결과

- `npm run build`: 통과. 기존 대형 앱 번들 경고는 남음. 가이드는 별도 lazy chunk.
- `npm run test`: 7개 파일, 86개 테스트 통과. 데이터/encyclopedia 검증 0 errors, 0 warnings.
- `npx playwright test --workers=2`: 기존 59개 항목 모두 통과. 당시 신규 가이드 1개 검사는 인용문 안의 코드 블록을 기대값에서 누락하여 실패했으며 검사 파서를 보정했다. 원고/렌더러의 코드 삭제 문제는 아니었다.
- 이후 가이드 12개 테스트 전부 통과. 최종 빌드 preview 서버에서도 `npx playwright test playwright/mission-guide.spec.ts --output test-results/b1-guide-final --reporter=line`: **12/12 통과**.
- 9개 단원 직접 접속·새로고침, 모든 본문 이미지 로딩, 모든 fenced code(인용문 내부 포함) 원문·들여쓰기·줄바꿈, 현재 단원 표시, 이전/다음, README 앵커, HTML 용어 링크 확인. 코드 비교는 CRLF/LF 차이만 정규화한다.
- 360 / 390 / 768 / 1024 / 1280px, 높이 900px, 라이트/다크 10개 조합에서 Chapter 1·4·9의 제목·본문·그림·코드를 검사하고 스크린샷 검토. 가로 페이지 넘침 없음. 1024px 이상 V09 가로 소스 선택 확인. 표·긴 코드는 개별 스크롤, SVG는 원본 새 탭 링크 제공.
- 시각 검토 후 본문 자동 포커스 테두리, 모바일 상단 메뉴 줄바꿈, PC 본문 너비, 다크 브랜드 대비를 수정하고 영향을 받은 가이드 검사를 재실행했다.
- 스크린샷: `test-results/b1-guide-final/` (로컬 QA 산출물, Git 제외). 빌드 로그: `test-results/b1-guide-build.log`.
- B2-1 스토리 동작, 미션·용어·지도·기존 학습 화면은 기존 Playwright 검증을 재사용한다. 최종 변경은 가이드에 한정된 색상·지원 문서 링크이며 가이드 회귀를 추가 수행했다.
- `npm audit --omit=dev`: 0건. 전체 audit의 기존 개발 도구 계열 4건(@vitest/mocker, source-map-js, tinypool, vitest)은 범위 밖 업그레이드로 남긴다.
- `git diff --check`, TypeScript 검사 통과.

## Owner 검토 및 한계

- 신규 공개 경로와 최종 로컬 화면은 Owner 승인 후 배포해야 한다. Push·main 병합·공개 배포는 하지 않았다.
- 실제 스마트폰·Safari·Firefox 및 스크린리더 음성 검증은 수행하지 않았다. 시각 QA는 Chromium의 지정 viewport·OS 색상 모드 에뮬레이션이다.
- README 원문에는 아직 “Owner·GPT 검토 중인 초안” 상태 문구가 있다. 승인 콘텐츠이므로 임의로 고치지 않았으며 공개 전 문구 판단은 Owner에게 남긴다.
- 승인 원고의 기술 내용을 수정하거나 새로 요약하지 않았다. 원고 오류를 확정한 항목은 없다.
- Notion 동기화는 최종 Owner 승인 후 필요 시 통합 Milestone 시점에 진행한다.
- 사용자 Push 명령: `git push origin feature/b1-1-learning-guide-web`.
