# Batch D — 최종 통합 QA 및 Closeout

## A. Executive Summary

**판정: `READY_WITH_LIMITATIONS`.** 병합된 main `082fa1ddb97138949abdd63db62668c26a3cdac4`에서 새로 실행한 Playwright **443/443**, 단위 테스트 **513/513**, TypeScript·Vite·B2-1 빌드 검사가 모두 통과했다. 실패·SKIP·FLAKY·신규 회귀는 0이다. 같은 SHA의 Pages 배포와 공개 사이트 실제 브라우저 검사도 통과했다.

필수 자동 검사와 Windows Chromium PC·모바일 에뮬레이션 검증은 완료했다. 실물 기기·Safari/Firefox·프로젝터·스크린리더·교육생 학습 효과는 미검증이므로 모든 환경의 품질을 보증하지 않는다. 이 한계를 명시하고 Owner의 최종 Closeout 승인을 요청한다. main 병합·배포는 실행하지 않았다.

이번 보고서 브랜치는 `qa/playwright-final-integration-closeout`이며 **이 보고서만 추가**한다. 제품·기존 테스트·콘텐츠·Canonical·SVG·설정·Fixture 변경은 모두 0이다.

## B. Source / Deployment Identity

| 항목 | 확인 결과 |
|---|---|
| 검증 main / QA worktree HEAD | `082fa1ddb97138949abdd63db62668c26a3cdac4` (정확히 일치) |
| 사전·QA 후 `git fetch origin` | 지정 SHA와 일치, 원래 작업 트리 깨끗함 |
| QA worktree | `%TEMP%\codyssey-final-qa-082fa1d` (detached HEAD, `npm ci` 신규 실행 PASS) |
| 실행 환경 | Windows / PowerShell, x64, headless Chromium |
| Node / npm / Python | 24.16.0 / 11.13.0 / 3.14.6 |
| Playwright / Chromium | 1.63.0 / 153.0.8010.12 |
| Actions | [Deploy GitHub Pages — Run 40793532414](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/actions/runs/40793532414) |
| Actions SHA / 결과 | `082fa1ddb97138949abdd63db62668c26a3cdac4` / completed·success, build·deploy 모두 success |
| Pages deployment | ID `7400674341`, 같은 SHA, success (2026-10-29 09:22:36 KST) |
| 공개 URL | [기술용어사전](https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/) |
| URL 확인 근거 | 저장소 Pages 설정 API의 `html_url`, deployment status의 `environment_url` 일치 |
| 공개 브라우저 검사 시각 | 2026-10-29 09:56:49–09:57:44 KST; 이후 대표 캡처 추가 확인 |

GitHub 연결 도구에는 Pages 설정 조회 기능이 없어 인증된 `gh api`로 설정·배포 상태를 읽었다. Actions 성공과 실제 브라우저 성공은 아래에서 분리해 기록한다. 배포를 새로 실행하지 않았다.

## C. QA Results

### 새 실행 결과와 과거 확정 결과 비교

| 단계 | PASS | FAIL | 주요 작업 |
|---|---:|---:|---|
| 최초 감사 | 374 | 69 | 문제 분류 |
| Batch A | 397 | 46 | 계약 23건 |
| Batch B | 421 | 22 | SVG 24건 |
| Batch C | 443 | 0 | 계약 22건 |
| **Batch D (신규 실행)** | **443** | **0** | **병합된 main·공개 Pages 검증** |

과거 행은 같은 디렉터리의 감사 및 Batch A/B/C 확정 보고서에서 인용했다. Batch D는 이전 수치를 복사하지 않고 새 JSON을 집계했다.

| 검사 | 실제 결과 |
|---|---|
| 전체 Playwright | 40 Spec, 443 PASS / FAIL 0 / SKIP 0 / FLAKY 0, 종료 코드 0 |
| Playwright 시작·소요 | 2026-10-29 09:50:53 KST / 379.288초 |
| Batch C 이름별 비교 | 파일명+테스트명 443개 집합 정확히 동일; 추가·삭제 0, 신규 실패 0 |
| 단위 테스트 | 41 파일, 513/513 PASS, 종료 코드 0, 26.40초 |
| 웹 빌드 | PASS, 종료 코드 0; `tsc -b`·Vite·B2-1 private build 검사 포함 |
| B2-1 산출물 검사 | 9 Scene, byte-identical SVG 16개, fenced source block 155개, 모든 Scene React SSR PASS |
| `npm run glossary:validate` | 523 Canonical + 46 mission-local, 오류 0·경고 0 (기존 INFO 788) |
| `npm run content:integrity` | PASS; 검사 대상 상세 522개, 중복 템플릿 무리 0·미션 문맥 모순 0·새 경고 0 |
| `git diff --check` | QA worktree PASS; 보고서 브랜치 PASS |

`content:integrity`의 522는 `content/terms/{id}.md`만 수집하는 기존 스크립트의 범위다. `readme` 원고는 `content/readme-term.md`에 있으며 빌더의 기존 `detail_path()`가 별도로 읽는다. 실제 웹 생성 데이터는 523개 모두 `hasDetailedContent=true`다. 따라서 522를 전체 상세 콘텐츠 수로 보고하지 않는다.

### Canonical·승인 콘텐츠·URL 보호 근거

직접 집계 결과 Canonical 고유 ID **523**, `drafted` **523**, `raw` **0**이다. 웹 생성 데이터도 523/523 drafted이며 상세 표시 플래그가 모두 true다. 빌드 후 생성 데이터·제품 파일은 기준 Git 내용과 동일했다.

| 실행된 스크립트·테스트 | 보호 범위와 실제 결과 |
|---|---|
| `scripts/glossary_visual_contract.test.mjs` (15 tests) | 전체 PASS. 기존 33개 drafted, 최종 2개 drafted·raw 0, 523 ID·Canonical 메타데이터·무관 항목 보존, 기존 본문·관련 용어·질문·SVG 계약 유지 |
| `b31-network-foundations.spec.ts` / `protects original lesson assets and approved UI inventories while glossary evolves` | PASS. `59b6d22` Git blob과 구조 비교; 정확한 35개 raw→drafted 예외만 허용, 다른 488개 전체 객체·모든 다른 필드·순서 보존; 임의 상태·메타데이터·관계·미션·본문·ID 추가/삭제·순서 변조의 부정 검증 PASS |
| `scripts/protected_source_contract.test.mjs` (5 tests) | 전체 PASS. 원본 자산의 추가·삭제·수정 검출 계약 유지 |
| `scripts/b31_packet_journey.test.ts` (12 tests) | 전체 PASS. 26단계·위상·경로·규칙·NAT 계산을 원본 실행 결과와 비교; ZIP 정확한 바이트 해시·HTML LF 기준 원본 해시 유지 |
| `src/b11Story/content.test.ts` (5 tests) | 전체 PASS. 승인 화면·캡션·교수 노트 및 12화면 URL 왕복 계약 |
| `src/b21Story/content/storyContent.test.ts`, `src/b21StoryV3/content/content.test.ts` (각 24 tests) | 전체 PASS. 기존 B2-1 원고·화면·연결 계약 |
| `src/b61Story/content.test.ts` (26 tests) | 전체 PASS. 4 Scene·12화면 순서·원고·정적 SVG·허용된 문구·위치/복귀 계약 |
| 기존 학습 Playwright 전체 | B1-1/B2-1/B3-1/B6-1 스토리·개념지도, B2-1/B3-1 8장, 패킷 26단계, 용어·가이드 왕복, 기존 Hash URL·모바일·테마·관계선·상세 패널 모두 PASS |

QA worktree에서 추적 파일 264개가 새 계측 JSON·캡처로 달라졌으며 **모두 `reports/` 아래**다. 전체 경로 목록은 TEMP 비교 JSON에 보존했다. `src/`, `data/`, `content/`, 원본 SVG·ZIP·HTML, 기존 Spec·Fixture·설정의 변경은 0이다. 이 재생성 결과를 원래 저장소나 보고서 브랜치에 가져오지 않았다. 원래 저장소의 기존 QA 증거도 덮어쓰지 않았다.

### 공개 Pages 실제 Smoke Test

별도 TEMP Playwright 스크립트로 공개 URL을 직접 렌더링했다. 기존 로컬 `playwright.config.ts`를 바꾸지 않았다. B2-1 경로는 `src/missionLearning.ts`가 참조하는 `src/b21Learning/paths.ts`의 실제 등록값을 확인했다.

| 검사한 Hash 경로 | 1280×900 | 1000×900 | 390×844 | 360×844 |
|---|---|---|---|---|
| `#/` | PASS | PASS | PASS | PASS |
| `#/missions` | PASS | PASS | PASS | PASS |
| `#/missions/main-M01/story` | PASS | PASS | PASS | PASS |
| `#/missions/main-M01/story/concepts` | PASS | PASS | PASS | PASS |
| `#/missions/main-M03/story` | PASS | PASS | PASS | PASS |
| `#/missions/main-M03/story/concepts` | PASS | PASS | PASS | PASS |
| `#/missions/main-M05/story-map` | PASS | PASS | PASS | PASS |
| `#/missions/main-M05/story-map/concepts` | PASS | PASS | PASS | PASS |
| `#/missions/main-M11/story` | PASS | PASS | PASS | PASS |
| `#/missions/main-M11/story/concepts` | PASS | PASS | PASS | PASS |
| `#/terms` | PASS | PASS | PASS | PASS |

44개 경로/화면 조합과 각 새로고침을 확인했다. 단순 HTML 성공이 아니라 실제 제목 또는 해당 지도 SVG·노드 수, 개요의 Scene 수, 표시된 콘텐츠·Hash 유지·문서 가로 넘침 없음을 검사했다. B3-1 기본 all/core는 23노드이며 full은 36노드인 현재 `conceptMapAdapter.test.ts` 계약을 사용했다. B1-1 14노드, B2-1 45노드, B6-1 11노드도 확인했다.

네 너비 모두 실제 미션 카드 → 강의 시작 → 미션 복귀(4미션), B3-1 8장 순차 이동, 4종 보충 자료 초기 접힘·펼치기, 내부 가로 넘침 시 ArrowRight 이동, 확대 125%·Escape·원래 버튼 초점 복귀, 방화벽 선택·관계 강조·새로고침 복원·스토리 복귀, HTTP 검색·상세 진입을 통과했다. 16개 보충 그림 계측 모두 최소 글자 14 CSS px 이상(오차 0.001), 비율 오차 <0.002였다. 문서 전체의 가로 넘침은 없었다.

JavaScript `pageerror` **0**, console error **0**, HTTP 오류 **0**, request failure **0**이다. 기록한 document/script/stylesheet/font 응답 778건은 모두 HTTP 200이다. 이미지 등 다른 리소스도 오류 응답·실패 요청 수집에 포함했다.

초기 임시 harness는 모든 페이지에 `<main>`/`h1`을 가정하고 B3-1의 core/full 노드 수를 혼동해 실패했다. 실제 DOM·등록 경로·기존 adapter 테스트를 확인해 **TEMP 스크립트만 수정**했다. 초기 실행 기록은 `codyssey-final-public-evidence` 및 `-v2`~`-v4`에 보존했고, 최종 전체 공개 검사는 `-v5`에서 위 모든 검사를 다시 실행해 PASS했다. 이 harness 오류를 제품 실패나 환경 BLOCKED로 계산하지 않았다.

### 대표 화면 및 기존 시각·접근성 검증

공개 사이트에서 추가로 viewport PNG 24장(각 너비의 B1-1/B2-1/B6-1 첫 강의 화면, B3-1 보충 그림·확대 모달·선택 지도)을 캡처했다. `%TEMP%\codyssey-final-public-visual`에 원본 치수로 보존했다. 이 중 네 너비의 `*-b31-readable.png`, `1280-b11-lecture.png`, `1000-b21-lecture.png`, `390-b61-lecture.png`, `360-b31-map.png`, `360-b31-modal.png`를 직접 열어 확인했다.

읽을 크기의 글자·기존 화면 배치·보충 그림 내부 이동 안내·모달·선택 패널이 유지된다. 모바일에서 그림의 오른쪽 일부가 내부 스크롤 영역 밖에 있는 것은 승인된 읽기 크기를 유지하는 기존 동작이며 문서 전체 가로 넘침과 구별했다. 새 디자인 변경이나 결함은 발견하지 않았다.

로컬 전체 검사에서도 네 너비×네 테마×OS Light/Dark×아홉 지도 상태, 총 288개 대비 계측과 연속 테마 전환·좌표 불변·화살표 일치·키보드 보호를 유지해 통과했다. 최소 대비는 노드 글자 5.611:1, 선택 테두리 4.789:1, 관계선 4.851:1, 설명 9.997:1, 활성 버튼 6.167:1이며 캔버스 최소 휘도는 0.9804다. 기존 기준 4.5/3/0.95를 완화하지 않았다.

### 실행 명령과 보존 증거

```powershell
# detached QA worktree, HEAD = 082fa1ddb97138949abdd63db62668c26a3cdac4
npm ci
$env:PYTHONUTF8 = "1"
$env:PLAYWRIGHT_PORT = "5178"
$env:B31_QA_OUTPUT = Join-Path $env:TEMP "codyssey-final-qa-evidence"
$env:PLAYWRIGHT_JSON_OUTPUT_FILE = Join-Path $env:TEMP "codyssey-final-playwright.json"
npx playwright test --workers=4 --reporter=json
npm test -- --maxWorkers=2 --testTimeout=20000
npm run build
npm run glossary:validate
npm run content:integrity
git status --short
git diff --check
# 공개 사이트: TEMP scripts, repo files unchanged
node (Join-Path $env:TEMP "codyssey-final-public-smoke.cjs")
node (Join-Path $env:TEMP "codyssey-final-public-captures.cjs")
```

| `%TEMP%` 증거 파일 | SHA256 |
|---|---|
| `codyssey-final-playwright.json` | `8d6e461e2f12a26db3dfafb2c541035b24fd1a335aaeaf0ee345b749894e4142` |
| `codyssey-final-comparison.json` | `5f2e9b84ffdd95557d4ab209ce2306215cac4e363646ce096c50411604090cac` |
| `codyssey-final-unit.log` | `1e278c38ac482d363a0a2ac117459d80a752ed74691d5bb2337ed42228ec23a0` |
| `codyssey-final-build.log` | `1749e3590c4a5f71c00ff5da25752c579c5270ffff8a78c2dc22c4788ed4fa37` |
| `codyssey-final-public-evidence-v5/smoke.json` | `5f702b66c41fcbf224437658f5f198b46ed3eec4857e5fe1ffd4987fa2e4f8ca` |
| `codyssey-final-public-smoke.cjs` | `a93f37bc64d19716a19bc06ade73865140948c3bfb4589404c5f322a184b6d17` |
| `codyssey-final-public-visual/captures.json` | `991403ff9052d5fa128e2aba5a2ccb4fc7bf4a669ebedd12f2f3b364f88e26e2` |
| `codyssey-final-deployment-run.json` | `33d28428139d0fa119b5b670fb69719ca9bc3c6e0242a88237d65ca50d1d5984` |

Pages 설정·deployment status JSON, 각 validator 로그, 캡처 PNG, 로컬 Playwright 계측·보호 경로 목록도 TEMP/QA worktree에 보존했다. 대량 원시 JSON·캡처를 보고서 브랜치에 추가하지 않았다.

## D. Remaining Risks

- **물리 기기 미검증:** Android 휴대전화·iPhone/iOS Safari. 모바일 결과는 Windows Chromium의 390/360px viewport·touch 에뮬레이션이다.
- Firefox·다른 브라우저 엔진, 교육장 프로젝터, 실제 스크린리더는 미검증이다. 키보드·초점·대비 자동 검사를 이 환경들의 검증으로 대체하지 않는다.
- 실제 교육생의 학습 효과·교수 진행·이해도는 이번 기술 QA 범위 밖이다. 강사 주도 대면 강의와 실제 미션 수행·자기 설명을 중심으로 한 기존 운영 정책을 유지한다.
- `npm ci`는 종료 코드 0이었지만 설치 로그의 audit 요약에 취약점 5건(moderate 1, high 2, critical 2)이 표시됐다. 이 보고서는 기능 회귀 QA이며 해당 항목의 악용 가능성·노출 범위·기준선 대비 신규 여부는 평가하지 않았다. 의존성은 변경하지 않았고 자동 수정도 실행하지 않았다. 별도 의존성 보안 검토 대상으로 남긴다.
- TEMP 증거는 로컬 임시 보관이다. 장기 보존이 필요하면 Owner가 위 해시와 함께 승인된 저장소에 별도 보관해야 한다.

## E. Closeout Decision

`READY_WITH_LIMITATIONS`: 지정 main과 배포 SHA 일치, 새 전체 회귀·단위·빌드·Canonical 보호·공개 핵심 경로·PC/모바일 에뮬레이션이 통과했다. 필수 항목의 실패나 환경 차단은 없다. 위 미검증 환경을 비차단 한계로 명시하며 Owner의 최종 Closeout 승인을 요청한다.

Draft PR: [#45](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/45).

GPT-6.1 Sol Medium 독립 검토는 `082fa1d..cd64813` 보고서와 원시 JSON·로그·배포 상태를 읽기 전용으로 확인해 **차단 사항 없음**으로 판정했다. 443개 이름 보존·모든 새 실행 결과·Canonical·보고서만 변경된 범위·8개 증거 해시·공개 검사 스크립트와 결과·대표 모바일 지도/모달 캡처를 재확인했다. 전체 검사는 중복 실행하지 않았다. 이후 변경은 이 검토 기록과 `npm ci` audit 요약의 미평가 범위 명시뿐이다.

Owner의 최종 승인과 의존성 보안 항목 분류는 대기 상태다. main 병합·배포는 실행하지 않았다.
