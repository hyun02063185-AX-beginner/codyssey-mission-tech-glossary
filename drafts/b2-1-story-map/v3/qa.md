# v3.1 QA — 최신 보정 검사

2026-10-24 · Windows / Node24.16.0 / Chrome155.0.8059.85 · 시작 e622f469321cc82ccdf7afb4ea0ef96bfc02f06e. 아래의 **이전 v3 기록**과 구분한다.

## 최신 결과

| 항목 | 결과 | 실제 범위 |
| --- | --- | --- |
| 01·02 기본 강의 | PASS 자체 검토 | 코드/함수 내부 없이 큰 그림과 현재 한 문장. 고정 요점3개 제거 |
| 01 도입·명령·해석 | PASS | GUI/CLI 도입2 + 네 블록/argparse5. 블록 이름 통일, 마지막에만 해석과 확인/정리 |
| 02 책임·상황 | PASS | 모델/저장소/서비스/CLI, 실제 파일명4개 대조. 저장→저장소·출력→CLI, 책임 선택1개. 그림 번호/화살표0 |
| 02 패키지 | PASS | 모듈/패키지/import/시작 파일4단계. 기본 화면 __init__ 없음, 선택 보충에만 있음 |
| 05 시나리오 | PASS 자체 검토 | Generator/yield·한 번에/하나씩 기본, Iterable/Iterator 선택 심화. 기존 자료 보존. 새 화면 없음 |
| 브라우저 전체 단계 | PASS | 7+10단계×1280/390/360px = **51조합, 778 assertions**. [원시 결과](qa/browser-results.json) |
| 버튼·키보드 | PASS | 선택, 이전/다음 A/B 경계 이동·끝 비활성, Home/End 장면 경계, 좌/우·Tab·Enter/Space, 직접 조건/import/시작 선택, 두 상황 버튼 |
| 확인·답·정리 | PASS | Scene 끝에만 기본1·적용1·정리, 이전으로 돌아가면 숨김. 답은 마지막 보충 펼침으로만 접근 |
| PC1280×720 | PASS | 모든 기본 단계 문서 높이≤720px·가로 넘침0. 보충/강사 노트 닫힘 기준 |
| 모바일390/360 | PASS | GUI/CLI 세로·명령2×2·책임세로·모듈2×2. 명령 이름/파일명 한 줄 유지·잘림0·가로 넘침0, 세로 스크롤 허용 |
| 시각 QA | PASS 자체 검토 | 대표15 PNG의 그림·현재 설명·상황 강조·마지막 확인/정리를 실제 확인. 실물 기기 검사 아님 |
| 신규 브라우저 오류 | PASS | JavaScript 예외0, console 오류/경고0, 요청 실패0, 외부 HTTP요청0 |
| v2 무결성 | PASS 재실행 | 기존 npm run b21:validate: 원고9·SVG16·구조·참조. Manifest/승인 hash 갱신 없음 |
| 기존 build | PASS 재실행 | 기존 데이터·tsc·Vite·비공개9Scene·16 emitted SVG 동일·155 fenced블록·전Scene SSR. 기존 큰 chunk 경고 유지 |
| 기존 단위 테스트 | PASS 재실행 | npm test: **16파일·176 PASS, 0 FAIL/SKIP**. 초기 QA 수집 실패는 아래 구분 |
| 기존 Owner Preview | 보호/이전 근거 재사용 | 이번 브라우저 재실행 없음. e622의 27조합 로딩 기록을 재사용. 기존 favicon404는 이전 문제 |
| 보호 범위 | PASS | 시작과 비교 v3 밖 Git 콘텐츠 변경0. v2·검증기·React·운영·package/lock 불변. 변경 위치는 v3뿐 |

실제 구현 사례는 별도 m03-pocket-money-ledger d14e812ca1e1caaa88fd23fae7029d95d560c2d9의 models.py/repository.py/services.py/cli.py를 정적 확인했다. 이번에는 Python 예제를 새로 실행하거나 새 CLI 명령을 지원한다고 주장하지 않는다. 기존 todo가 지원하는 --limit 값 변경만 적용 질문에 사용한다.

## 실패·보완 과정

- 초기 PC 마지막 화면 높이727px/723px로 FAIL. PC 간격과 패키지 화면의 한 번에 보이는 설명을 조정한 뒤 전 단계≤720px PASS. 내용을 자르거나 검사 높이를 늘리지 않았다.
- 모바일에서 '실행할 프로그램', --limit 5와 repository.py/services.py가 분리되어 보였다. 모바일 글자 크기·여백·줄바꿈을 조정했다. 명령/파일명·블록명 한 줄 유지를 검사에 추가해 최종 PASS.
- QA 외부 사본에 이전 작업의 node_modules-shared-reference junction이 남아 Vitest가 의존성 내부 테스트3개를 잘못 수집했다. 첫 npm test는 기존176개 PASS였지만 **3 suite 실패로 전체 FAIL**이었다. 테스트 설정/제품 코드를 바꾸지 않고 해당 참조를 QA 소스 밖으로 이동한 뒤 원래 npm test를 재실행하여16파일/176검사 PASS. 초기 로그와 최종 로그를 각각 보존했다.

빌드·테스트는 이전과 같은 LF 기준 외부 QA 사본에 새 v3를 복사해 실행했다. 앱 소스/lock은 시작 커밋과 동일하며 의존성을 별도 설치한 사본이다. 로그 경로:

`C:\Users\hyun0\glossary-work-archive\2026-10-23\b21-v3-regression\`

- build-v31.log — build PASS
- test-v31.log — 잘못 수집된3 suite 포함 초기 FAIL
- test-v31-final.log — 원인 제거 뒤176 PASS

재현 명령(저장소 루트, Chrome 설치 환경):

```powershell
node drafts/b2-1-story-map/v3/prototypes/check-preview.mjs
npm run b21:validate
```

기존 npm run build / npm test는 운영 데이터 생성 영향을 피하려고 별도 사본에서 실행한다. 검사기는 v3/qa의 대표 PNG15장과 browser-results.json을 갱신한다. 의존성·기존 검증기 변경 없음.

## 미검증·Owner 검토 대기

- Owner가 전달한 Claude의 v3 검토 지시는 반영했다. 이번 자체 QA가 Claude의 v3.1 재검토나 Owner 새 시안 승인을 대신하지 않는다.
- 실제3~5분 강의, 상황/적용 질문의 학습 효과, 여러 교육생 파일 구조에 대한 적용, 공식 미션 원문·최신 평가 기준 대조.
- 실물 모바일/프로젝터, 스크린리더, Safari/Firefox, 다른OS/글꼴, 200% 확대.
- Scene03~08 새 화면·React/운영 서비스 통합·사전 왕복·배포. 이번에는 수행하지 않았다.
- 기존 서비스 전체 Playwright/모든 테마 회귀는 반복하지 않았다. 변경0인 보호 파일과 e622의 QA를 해당 범위에서만 재사용한다.

---

# 이전 v3 QA — 2026-10-23 역사적 기록

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
