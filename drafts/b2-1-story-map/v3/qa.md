# v3 QA — 수행 범위와 남은 확인

2026-10-23 · Windows · Node 24.16.0 · Chrome 155.0.8059.85 · 기준 `b7207cd90414fb50180026e17d8cd619ac14ce9f`

## 수행 결과

| 항목 | 결과 | 실제 확인 범위 |
| --- | --- | --- |
| 개념 중심 8장면·공통 구성 | PASS (자체 검토) | 각 장면 질문1·그림 설계1·포인트3이하·확인1~2·정리·심화, 3~5분 목표. 01·02만 실제 화면 제작 |
| 함수·클래스 문법 제외 | PASS (자체 검토) | 03-A 기본 강의 제거, 필수 코드 리뷰 없음, 클래스 공식 요구는 선수 연결과 실제 구현 검증으로 별도 추적 |
| 공식 목표 대응 기록 | PASS (문서 존재) | v2 §4의 5목표를 v3에 대응. 공식 원문/평가 기준 독립 대조는 미검증 |
| 신규 HTML 브라우저 검사 | PASS | 4화면×3해상도 12조합, 총366 assertions. [원시 결과](qa/browser-results.json) |
| 단계·키보드·보충 자료 | PASS | 모든 단계 자유 선택, 이전/다음·경계 비활성, Home/End·좌/우·Tab·Enter/Space, 두 펼침 영역, 강사 세 문장, 심화 링크 파일 존재 |
| PC 화면 | PASS | 1280×720. 모든 기본 화면/단계의 문서 높이≤720px, 페이지 가로 넘침 없음, 큰 구조도와 설명이 함께 보임 |
| 모바일 재배치 | PASS | 390×800·360×800, mobile/touch context. 명령2×2·역할세로·모듈2×2. 모든 단계에서 가로 넘침·화면 밖 요소 없음. 세로 스크롤 허용 |
| 시각 확인 | PASS (자체 검토) | 12개 PNG의 글자·구조도·선택 표시·PC/모바일 배치 확인. 프로젝터/실물 기기 검사가 아님 |
| 신규 오류·외부 의존 | PASS | 브라우저 오류0·console 오류/경고0·외부 HTTP요청0. file://로 직접 열어 검사 |
| 기존 v2 무결성 | PASS | `npm run b21:validate`: 9원고·16SVG·영역·활동·참조 검사. v3 미포함 |
| 기존 build | PASS | LF 기준 외부 QA 사본에서 `npm run build`, 원고검사·데이터생성·tsc·Vite·비공개 빌드 전체. 기존 큰 chunk 경고 유지 |
| 기존 단위 테스트 | PASS | 외부 QA 사본 `npm test`: 16파일·176 PASS, 0 FAIL/SKIP |
| 기존 비공개 빌드 | PASS (위 build에 포함) | 9Scene·16 emitted SVG byte동일·155 fenced블록·모든 Scene React SSR. 중복 검사 수로 합산하지 않음 |
| 기존 Owner Preview | PASS (로딩 범위) | 실제 `npm run b21:preview`, HTTP 9Scene×1280/390/360px 27조합, 원고 제목·SVG decode·로드 실패 없음. [원시 결과](qa/v2-preview-results.json) |
| 기존 Preview 콘솔 | 기존 문제 기록 | `/favicon.ico` 404 1건. 새 시안의 오류0과 구분한다. 기존 Preview 파일은 변경하지 않음 |
| 기존 코드·콘텐츠 보호 | PASS | 시작2545 추적파일의 Git 콘텐츠 diff0, 신규 파일만 v3 아래. package/lock·v2·JSON·React·검증기·공개 route 불변 |
| 기존 지도 보존 | PASS | 기존 candidate: 45노드·24관계·10비교. JSON·HTML·참조ID 변경 없음 |

검사 재현:

```powershell
npm ci --no-audit --no-fund
node drafts/b2-1-story-map/v3/prototypes/check-preview.mjs
npm run b21:validate
```

Chrome이 설치된 환경을 기본으로 하며 다른 Playwright 설치 채널은 `B21_BROWSER_CHANNEL`로 지정한다. 신규 검사기는 `v3/qa/`의 PNG·결과 JSON을 재생성한다. 기존 검증기는 변경하지 않는다.

빌드·테스트는 운영 데이터 생성 영향을 피하려고 기준 커밋을 `git -c core.autocrlf=false archive`한 별도 사본에 새 v3 폴더를 복사하여 수행했다. 의존성은 같은 lock으로 `npm ci`했다. 로그: `C:\Users\hyun0\glossary-work-archive\2026-10-23\b21-v3-regression\{build,test}.log`. v3는 운영 import/glob/Manifest에 들어가지 않으며 복사 후 기존 파일을 변경하지 않았다.

## 처음 실패한 검사와 해결

1. **PC 패키지 화면 높이:** 최초 검사에서 720px를 넘었다. PC의 두 특수 파일을 한 줄 카드로 정리하고 간격을 줄였다. 문서 전체 높이를 측정하도록 검사도 보완했다. 최종 모든 기본 화면/단계≤720px PASS.
2. **Windows 줄바꿈:** fast-forward로 받은 일부 파일이 `core.autocrlf=true`에 따라 CRLF였다. 기존 snapshot은 LF 바이트를 승인하므로 v2 무결성·두 테스트 suite가 실패했다. 6파일(snapshot·06/07/08원고·07SVG두개)의 차이가 CRLF뿐임을 먼저 확인한 뒤 **기준 Git blob과 동일한 LF 바이트**로 복원했다. 인덱스 정규화 후 Git diff0을 확인했다. snapshot 재생성·새 hash 승인·검증기 수정은 하지 않았다. 외부 사본도 LF archive로 다시 준비했다. 최종 무결성 PASS·176검사 PASS. 후속 체크아웃에서도 CRLF가 다시 생길 수 있으므로 저장소 차원의 EOL 정책은 별도 검토 대상이다.
3. **외부 QA 의존성 경로:** 처음에는 node_modules junction을 공유해, Vite가 실제 경로를 반환하면서 기존 비공개 빌드의 output 경계 검사에 걸렸다. 보호 검사는 그대로 두고 QA 사본에 의존성을 별도 설치하여 build 전체 PASS. 기존 앱 코드 원인으로 취급하지 않는다.
4. **기존 Preview favicon:** 27조합 로딩은 성공했지만 Chrome이 자동 요청한 `/favicon.ico` 404 한 건이 console에 있었다. 원시 결과에 남기고 보호 파일은 그대로 보존했다. 앱 JavaScript 예외나 원고/SVG 로딩 실패는 없었다.

처음의 실패를 PASS로 바꿔 쓰지 않고 최종 수정과 검사 범위를 구분했다. 단위 검사·생성기·후보 검증기를 이번 작업에서 새로 설계하거나 기존 승인 기준을 완화하지 않았다.

## 미검증·검토 대기

- Owner 콘텐츠·시각 승인과 독립 콘텐츠 검토. 이 자체 QA는 독립 검토를 대신하지 않는다.
- 공식 미션 원문과 최신 평가 조건, 실제 교육생 구현의 클래스·입출력·Decorator 요구 충족 여부.
- 3~5분 실제 수업 진행·학습 효과·입문자 반응.
- 실물 프로젝터·휴대전화, 화면 낭독기, Safari/Firefox, OS·글꼴 차이, 200% 텍스트 확대.
- 나머지 Scene 03~08 실제 화면 제작, React 통합·개념지도/사전 왕복·서비스 URL·배포. 이번 범위에 포함하지 않음.
- 기존 서비스 전체 Playwright·모든 테마/기기 회귀는 재실행하지 않았다. 기존 파일/공개 번들 입력 변경0과 해당 범위의 기존 QA를 재사용했다. 27조합 검사는 v2 Owner Preview 로딩에 한정한다.
