# B6-1 용어사전 시각 설명 P0 — 웹 통합 및 QA

2026-10-28 · Codex · **로컬 구현·QA 완료, GPT 독립 검토 및 Owner 최종 웹 시각 검수 대기**

- 브랜치: `feature/b6-1-glossary-visual-web`
- 승인 콘텐츠: `35ba0472b91321393d4774e8cc4db8ce08be59f4`
- 기존 main 기준: `863a6ff`
- 웹 구현 커밋: `4f9f2676cf0a7fe401b95528f75e9b08a114c7ef` (보고서·QA 증빙은 후속 커밋)
- 승인 근거: 이번 Owner 작업 지시에서 SVG 3종의 PC·모바일 그림에 대한 GPT 검토·Owner 시각 승인을 확인했다. 초안 문서의 제작 당시 상태 표시는 변경하지 않았다.

## 구현과 변경 파일

| 파일 | 변경 |
| --- | --- |
| `src/assets/glossary/b6-1/erd-basics-{desktop,mobile}.svg` | 승인 원본을 그대로 복사 |
| `src/assets/glossary/b6-1/pk-fk-relationship-{desktop,mobile}.svg` | 승인 원본을 그대로 복사 |
| `src/assets/glossary/b6-1/join-inner-left-{desktop,mobile}.svg` | 승인 원본을 그대로 복사 |
| `content/terms/erd.md` | 승인 그림·기호 설명·B6-1 사례, 승인된 student/enrollment/course 문자 도식 적용 |
| `content/terms/foreign-key.md` | 승인 그림·B6-1 사례, UNIQUE 키 참조·NULL/NOT NULL·SQLite 검사·제약과 JOIN 구분 |
| `content/terms/join.md` | 승인 그림·1:N 결과 행 수·26/27행 사례. 기존 SQL 유지, 서로 다른 예시임을 밝히고 ORDER BY 조건 보충 |
| `scripts/build_web_data.py` | P0 세 용어의 모든 원문 설명 절을 원래 순서대로 richSections에 전달. 평문 필드는 이미지 Markdown 대신 대체 설명을 전달 |
| `src/TermRichContent.tsx` | 고정된 승인 자산 목록에 그림·캡션 등록. 700px 이하 모바일 SVG 선택 |
| `src/repair.css` | 새 반응형 그림만 부모 폭 안에 표시하고 불필요한 스크롤 안내 제거 |
| `extension/sidepanel.js` | 검색 대상에 용어 ID 추가. 기존 빠른 링크·관련 링크의 ID 검색 누락 수정 |
| `src/data/generated/glossary.json` | 위 변경에 필요한 웹 생성 데이터 |
| `dist-extension/glossary.json`, `dist-extension/sidepanel.js` | 저장소에서 추적하는 확장 산출물을 소스·생성 데이터와 일치시킴 |
| `src/TermRichContent.test.tsx` | 5개 용어의 전체 절·그림·안전한 미등록 그림 대체 표시 |
| `scripts/glossary_visual_contract.test.mjs`, `scripts/fixtures/b61-glossary-visual-baseline.json` | 승인 기준의 메타데이터·기존 본문·오픈북·SVG 보호 검사. fixture는 승인 커밋에서 확보하여 shallow checkout에서도 테스트 가능 |
| `playwright/glossary-visual-b61.spec.ts` | 실제 상세 화면의 반응형·테마·본문·검색·관련 링크·접근성·레이아웃 검사 |
| `scripts/check_glossary_visual_extension.mjs` | 실제 MV3 확장과 service worker를 로드한 브라우저 검사 |
| 이 보고서 및 `reports/glossary-visual/b6-1-p0-web/` | 자동 결과·측정값·검수용 캡처 |

본문은 지정된 세 파일만 변경했다. `primary-key`·`inner-join`·`left-join`, canonical ID·분류·미션/관련 용어 연결, 웹툰·분야별 기술지도, B6-1 Story·개념지도·학습가이드, 공통 미션 UI·관계도 엔진·공개 URL·정책은 변경하지 않았다. 초안 SVG·생성기와 기존 CIDR·SSH SVG도 보존했다.

## 렌더러·데이터 통합 방식

기존 경로는 `content/terms/*.md → build_web_data.py → glossary.json → App의 RichTerm → TermRichContent`다. 기존 `ssh-key`·`cidr`의 richSections 생성 목록과 본문 순서는 그대로 두고, P0 세 용어는 원문의 모든 `##` 설명 절을 전달한다. `관련 용어`만 기존 상세 화면의 검증된 링크 목록이 담당한다. 기존 정의·비유·정확한 설명·코드 예·주의 사항·흔한 오해·동료평가 질문이 실제 DOM에 남는지 검사했다. 새 FK 주의 사항도 목록으로 표시된다.

그림은 외부 URL이나 임의 HTML을 받지 않고 등록된 SVG 문자열만 렌더링한다. 미등록 그림은 이스케이프된 대체 설명으로 복구한다. SVG 자체의 `title`·`desc`·고유 ID를 유지했고, 6개 파일 전체의 중복 ID와 active content가 없음을 검사했다. 그림·캡션 모두 B6-1 사례임을 밝힌다.

반응형 그림은 `matchMedia('(max-width:700px)')`에 따라 **한 SVG만** DOM에 넣는다. 700px는 모바일, 701px는 desktop이며 리사이즈 시 바뀐다. 새 그림의 폭은 `100%; max-width:520px`이며 부모 폭을 넘지 않는다. 숨겨 놓은 중복 SVG나 중복 접근성 트리는 없다. CIDR·SSH는 기존 520px 스크롤 영역과 모바일 안내를 유지한다.

확장은 평문 필드를 그대로 읽는다. 생성 단계에서 Markdown 이미지 참조만 대체 설명으로 바꾸고, 웹용 richSections에는 원문을 남겨 자산을 표시한다. 확장에 SVG 렌더러나 새 데이터 스키마를 추가하지 않았다. 기존 HTML 이스케이프·보안 처리도 유지했다.

실제 확장 검사 중 기존 `http-status-code-403` 빠른 링크가 ID로 검색되지 않는 문제를 재현했다. 기존 검색은 이름·영문·별칭만 검사했으므로 검색 대상에 `item.id` 하나를 추가했다. 수정 후 오픈북 23개 빠른 링크와 새 용어·관련 용어 이동이 모두 통과했다. [재현 기록](b6-1-p0-web/extension-existing-id-link-failure.json)과 [최종 결과](b6-1-p0-web/extension-results.json)를 구분해 보관했다.

## 자동 검사

환경: Windows 11 / PowerShell / Node `v24.16.0` / npm `11.13.0` / Python `3.14.6`. Python 테스트는 현재 PowerShell 세션에서 `$env:PYTHONUTF8='1'`로 실행했다. 실행 명령·빌드 구조·의존성을 일괄 변경하지 않았다.

| 명령·검사 | 결과 | 근거 |
| --- | --- | --- |
| `npm run glossary:validate` | PASS — canonical 523, 오류 0·경고 0 | [로그](b6-1-p0-web/glossary.log) |
| `npm run content:integrity` | PASS — 미션 문맥 모순 0·새 경고 0 | [로그](b6-1-p0-web/integrity.log) |
| `npm run build` | PASS — TypeScript·Vite·B2-1 보호 원본 검사 포함 | [로그](b6-1-p0-web/build.log) |
| `npm test` | **39파일·475테스트 PASS** | [로그](b6-1-p0-web/tests.log) |
| 새 계약·렌더러 테스트 | 9테스트 PASS. fixture의 checkout 줄바꿈 차이도 처리 | [로그](b6-1-p0-web/unit-new.log) |
| `npm run build:extension` | PASS | [로그](b6-1-p0-web/extension-build.log) |
| `npm run mission:ui-check` | **156점검·12상태 PASS**, dev/dist | [로그](b6-1-p0-web/mission-ui.log), [결과](b6-1-p0-web/mission-ui-results.json) |
| 신규 Playwright — dev | **33건 PASS** | [로그](b6-1-p0-web/browser-dev.log) |
| 신규 Playwright — dist | **33건 PASS** | [로그](b6-1-p0-web/browser-production.log) |
| 최종 캡처 안정화 검사 | 16건 PASS. 지연 로드된 상단 링크가 안정된 뒤 캡처하고 캡처 중 smooth scroll·애니메이션을 억제 | [로그](b6-1-p0-web/final-captures.log) |
| 실제 MV3 확장 | **빠른 링크 23개 + 대상/회귀 용어 5개 PASS**, 관련 링크·검색·HTML 이스케이프·콘솔 오류 0 | [로그](b6-1-p0-web/extension-browser.log), [결과](b6-1-p0-web/extension-results.json) |
| `git diff --check` | PASS | 커밋 전 확인 |

시작 전에도 기존 466개 테스트는 통과했다([기준 로그](b6-1-p0-web/baseline-tests.log)). 콘텐츠 무결성 도구는 `content/terms/`의 522개 본문을 검사하며 `readme` 본문은 별도 경로에 있다. canonical 523개와 생성 데이터의 모든 용어 ID·분류·미션/관련 연결은 기준 fixture와 동일하다. P0와 기존 이미지 용어 2개를 제외한 **518개 생성 항목은 전체 내용이 동일**하고, B1-1 오픈북 전체 데이터도 동일하다. 원본 CIDR·SSH richSections 역시 동일하다.

공통 미션 UI 검사기는 4200(dev)·4202(변경 전 비교 서버)를 전제로 한다. 임시 worktree의 의존성 junction 때문에 발생한 React 중복 로딩은 **임시 기준 서버만** 독립 cacheDir·dedupe로 격리한 뒤 재검사했다. 제품 코드에는 이 환경 우회를 반영하지 않았다. 임시 작업본·캐시·검사용 서버는 작업 후 정리했다.

## 실제 브라우저 QA

1280×720, 1000×720, 390×844, 360×800 × Forest/Indigo/Paper/Signal × OS Light/Dark에서 ERD·FK·JOIN·CIDR·SSH의 실제 URL을 열었다. 32개 환경 × 5개 용어 = 160개 상세 화면 상태를 검사했다. 페이지에 그림 Markdown이 노출되지 않고, 새 SVG는 하나만 나타나며, 검색·관련 용어 이동과 700/701px 경계 전환도 통과했다. 페이지·자산 요청·콘솔 오류는 없었다.

P0 SVG 96개 상태의 측정 결과는 글자 겹침 0·viewBox 잘림 0·그림 내부 가로 스크롤 0·페이지 가로 넘침 0이다. 측정 최소 대비는 **6.15:1**, 최소 표시 글자는 **11.475px**(360px 화면의 작은 보조 이름표)였다. 승인된 글자 크기·색상은 변경하지 않았다. PC와 360px 캡처를 실제로 열어 기호·관계선·표·NULL 행·캡션을 검수했다. [환경별 측정](b6-1-p0-web/metrics-360-forest-light.json)은 같은 폴더의 `metrics-<폭>-<테마>-<OS>.json` 32개에 있다.

기존 CIDR·SSH는 네 크기 모두 520px 그림과 스크롤 안내가 유지된다. 원본·richSections가 동일하고 실제 회귀 검사도 통과했다. 별도 전후 캡처 8쌍 중 7쌍은 픽셀 동일, SSH 390px 한 쌍은 동일한 크기에서 11픽셀의 래스터 차이가 있었다. SVG 내용·배치·동작 변화는 없다. [비교 결과](b6-1-p0-web/legacy-visual-comparison.json).

확장 검사는 Playwright 제공 Chromium `153.0.8010.12`의 독립 프로필에 `dist-extension`을 실제 로드했다. service worker와 `chrome.storage`를 사용했으며 가짜 API·대체 렌더러를 주입하지 않았다. SVG 미지원 상태에서 ERD 문자 도식과 FK/UNIQUE 설명, JOIN 26/27행 설명을 평문으로 확인했다. HTML 형태 검색어는 텍스트로만 표시됐고 실행되지 않았다.

## 캡처

| 용어 | PC 전체 화면 | 모바일 전체 화면 | 360px 실제 그림 |
| --- | --- | --- | --- |
| ERD | [1280](b6-1-p0-web/erd-1280-forest.png) | [390](b6-1-p0-web/erd-390-forest.png) | [360](b6-1-p0-web/erd-360-forest-figure.png) |
| FK | [1280](b6-1-p0-web/foreign-key-1280-forest.png) | [390](b6-1-p0-web/foreign-key-390-forest.png) | [360](b6-1-p0-web/foreign-key-360-forest-figure.png) |
| JOIN | [1280](b6-1-p0-web/join-1280-forest.png) | [390](b6-1-p0-web/join-390-forest.png) | [360](b6-1-p0-web/join-360-forest-figure.png) |
| CIDR 회귀 | [1280](b6-1-p0-web/cidr-1280-forest.png) | [390](b6-1-p0-web/cidr-390-forest.png) | [360](b6-1-p0-web/legacy-cidr-360-after.png) |
| SSH 회귀 | [1280](b6-1-p0-web/ssh-key-1280-forest.png) | [390](b6-1-p0-web/ssh-key-390-forest.png) | [360](b6-1-p0-web/legacy-ssh-key-360-after.png) |

1000px 및 Indigo/Paper/Signal 그림도 같은 폴더에 있다. 확장: [ERD](b6-1-p0-web/extension-erd.png) · [FK](b6-1-p0-web/extension-foreign-key.png) · [JOIN](b6-1-p0-web/extension-join.png).

## Owner 검수 방법과 미검증 항목

현재 로컬 배포용 검수 서버는 다음 주소다.

- [ERD](http://127.0.0.1:4184/#/terms/erd)
- [외래 키](http://127.0.0.1:4184/#/terms/foreign-key)
- [JOIN](http://127.0.0.1:4184/#/terms/join)
- [CIDR](http://127.0.0.1:4184/#/terms/cidr) · [SSH](http://127.0.0.1:4184/#/terms/ssh-key)

네 테마를 바꾸고 창 폭을 700/701px 앞뒤로 조정하여 모바일 그림 전환·기호·본문과 그림의 연결을 확인한다. JOIN은 원본 표와 설명용 집계의 구분, INNER에서 빠지는 행과 LEFT의 NULL 행을 확인한다. FK는 없는 값·NULL·UNIQUE·SQLite 설명을 함께 읽는다. 기존 CIDR·SSH는 좌우 스크롤과 안내를 확인한다.

```powershell
cd C:\Users\hyun0\codyssey-mission-tech-glossary
$env:PYTHONUTF8 = '1'
npm run build
npm exec vite preview -- --host 127.0.0.1 --port 4184 --strictPort
# 개발 서버: npm run dev -- --host 127.0.0.1 --port 4183 --strictPort
# 확장 재검사: npm run build:extension
# node scripts/check_glossary_visual_extension.mjs
```

실제 휴대폰(iOS Safari·Android Chrome), 스크린리더 음성 낭독, 프로젝터 가독성 및 사용자의 기존 Chrome 프로필에 설치한 네이티브 Side Panel UI는 **미검증**이다. 실제 MV3 확장 페이지는 독립 Chromium 프로필에서 검증했다. GPT 독립 검토와 Owner 최종 웹 시각 승인은 대기 상태다. PR 병합과 main 공개 배포는 수행하지 않는다.

소스와 필요한 추적 생성물만 반영했다. 임시 전체 glossary 사본·worktree·중간 실패 캡처, 다른 미션의 검사 산출물은 제외했다. Git push 결과와 최종 QA 커밋 SHA는 완료 보고에 기록한다.
