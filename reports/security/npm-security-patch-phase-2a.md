# npm 보안 패치 Phase 2A — 2026-10-29

**판정: `READY_FOR_REVIEW`.** 승인된 두 패키지만 패치했다. 대상 감사 항목이 해소됐고 깨끗한 설치·빌드·선택 Playwright 2건이 통과했다. 배포 산출물 350개가 Batch D 기준선과 경로·바이트 모두 동일하므로 전체 단위/Playwright는 재실행하지 않았다. Phase 2B의 기존 Critical 취약점은 남아 있다.

## A. 변경 요약

- 기준 main: `46cae23cce5076385717e3328b818be4b84ce463` (fetch 결과 일치, 작업 트리 깨끗함).
- 브랜치: `security/npm-vite-sourcemap-patch`.
- 환경: Windows / PowerShell, Node 24.16.0, npm 11.13.0, Python 3.14.6, Chromium 153.0.8010.12.

| 대상 | 이전 → 이후 | 실제 변경 |
|---|---|---|
| Vite | 6.4.3 → **6.4.5** | package.json의 `^6.0.0`을 정확 버전 `6.4.5`로 지정; lock 버전·URL·integrity 갱신 |
| source-map-js | 1.2.1 → **1.2.2** | 기존 PostCSS 간접 의존성의 lock 버전·URL·integrity만 갱신 |

사용 명령은 `npm install --save-dev --save-exact vite@6.4.5 --no-audit --no-fund`, `npm update source-map-js --no-audit --no-fund`다. 명령마다 lock을 구조 비교했다. 변경된 lock 항목은 root의 Vite 버전 지정과 **두 패키지 항목뿐**이며 추가·삭제된 패키지는 없다. 다른 패키지의 버전·메타데이터 변경은 0이다. source-map-js 직접 추가·overrides·강제 peer 옵션·audit fix는 사용하지 않았다.

`npm ls ... --all` 종료 코드 0. Vite 6.4.5와 source-map-js 1.2.2는 각각 단일 해석이며 이전 버전의 중복 설치가 없다. plugin-react 4.7.0·Vitest 3.2.7·vite-node 3.2.4가 Vite 6.4.5를 정상 dedupe한다. PostCSS 8.5.28·Playwright 1.63.0·React 및 나머지 의존성은 그대로다. 기존 Vite/peer의 Vite 6 범위, PostCSS의 source-map-js `^1.2.1` 범위 안이다.

최종 변경 파일은 `package.json`, `package-lock.json`, 이 보고서 세 개다. 제품·기존 513개 단위/443개 Playwright·Canonical·학습 콘텐츠·SVG·워크플로·Fixture 수정은 0이다.

## B. 보안 개선

변경 직전과 독립 설치 후 `npm audit --json`, `npm audit --omit=dev --json`을 새로 수집했다. 전체 감사는 전후 모두 취약점 검출에 따른 종료 코드 1, production은 전후 코드 0이며 JSON/registry 오류는 없다.

| 집계 | 이전 | 이후 |
|---|---:|---:|
| 취약 패키지 | 5 | **3** |
| Critical / High / Moderate | 2 / 2 / 1 | **2 / 0 / 1** |
| 고유 GHSA | 10 | **4** |
| Production 취약점 | 0 | **0** |
| 새 권고문 / 새 Critical·High 유입 | — | **0 / 0** |

감사에서 제거된 권고문은 다음 6개다. Vite와 source-map-js 항목이 없어졌고 이후 GHSA 집합은 이전 집합의 부분집합이다.

- Vite: `GHSA-587h-7wmj-h5pm`, `GHSA-698v-4r3x-3vcv`, `GHSA-r825-w8mm-5pxw`, `GHSA-9jrq-w75r-8gcw`, `GHSA-rq7h-c2jc-7f22`.
- source-map-js: `GHSA-68fv-2mgg-jv7q`.

또한 6.4.4를 경유하지 않고 [GHSA-8g5g-mxqh-grgj의 수정 버전 6.4.5](https://github.com/vitejs/vite/security/advisories/GHSA-8g5g-mxqh-grgj)를 사용했다. 이 권고는 영향 버전이 6.4.4이므로 현재 감사의 '제거된 6개'에 중복 가산하지 않는다. 공식 수정 범위 대조는 [Phase 1 보고서](npm-dependency-risk-assessment-2026-10-29.md)의 PR #46 보완 절을 재사용했다.

## C. 영향 분석

Batch D의 `082fa1d`와 이번 기준 main 사이에서 package/lock·src·scripts·public·content·Vite/Playwright 설정·workflow 차이가 없음을 Git으로 확인했다. 따라서 당시 독립 설치·성공 빌드가 보존된 `%TEMP%/codyssey-final-qa-082fa1d/dist`를 변경 전 기준선으로 재사용했다.

새 독립 QA worktree `%TEMP%/codyssey-phase2a-qa-owned-46cae23`에 패치된 package/lock을 복사하고 자체 `npm ci` 후 빌드했다. 두 파일의 바이트가 원래 브랜치와 일치한다. **전후 dist 각 350개 파일, 추가 0·삭제 0·동일 경로의 바이트 변경 0**이다. JS chunk 이름·실제 코드·CSS 14개·HTML·정적 자산의 경로도 모두 동일하다. 빌드 도구의 서버 접근 검사·source map 입력 검증은 바뀌지만 현재 배포 UI 출력은 바뀌지 않았다.

Vite 개발 서버와 기존 Hash 경로·JS 리소스는 아래 브라우저 검사로 확인했다. PostCSS/CSS는 동일 산출물로 확인했고, TEMP smoke에서 구·신 source-map-js의 정상 역매핑·indexed map·PostCSS 이전 map 처리 결과가 동일함을 비교했다. 신 버전에서 음수·소수·무한대·과대한 section offset 4건을 즉시 거부함도 확인했다. 이전 버전에는 잘못된 입력을 실행하지 않았다.

## D. 재검증과 기준선 재사용

| 실행 항목 | 실제 결과 |
|---|---|
| `npm ci` | 원래 브랜치 및 최종 QA worktree 모두 PASS; force/legacy-peer-deps 없음 |
| `npm ls vite source-map-js postcss vitest ... --all` | PASS, 대상 구버전 사본 없음·peer 충돌 없음 |
| `PYTHONUTF8=1 npm run build` | PASS; TypeScript·React/Vite 정적 빌드·B2-1 SSR/원고 무결성 포함 |
| B2-1 private build 검사 | 9 Scene·byte-identical SVG 16개·코드 블록 155개·모든 Scene SSR PASS |
| `mission-learning-entry.spec.ts --grep "real learning paths differ by mission" --workers=1` | **1/1 PASS**, SKIP/FLAKY 0 |
| `b31-story-map.spec.ts --grep "mission entry, eight focused slides" --workers=1` | **1/1 PASS**, SKIP/FLAKY 0 |
| 추가 TEMP source map/PostCSS smoke | PASS: 정상 입력 전후 일치·신 버전 잘못된 offset 4건 거부 |
| 산출물 전수 파일 비교 | 350/350 바이트 동일, CSS 14/14 동일 |
| `git diff --check` | PASS |

선택 브라우저 검사는 `PYTHONUTF8=1`, `PLAYWRIGHT_PORT=5178`, workers 1로 기존 설정을 그대로 사용했다. 미션별 자료 목록·등록 링크(B1-1/B2-1/B3-1/B6-1 포함), B3-1 8장 순서·보충 그림·확대·직접 Scene·새로고침 등이 통과했다. 브라우저 검사가 만드는 증거는 TEMP의 `codyssey-phase2a-evidence`로 분리했다. QA 트리에서도 추적 변경은 복사한 package/lock 두 파일뿐이며 기존 생성 데이터 변경은 없다.

**초기 환경 실패:** 첫 QA 트리는 node_modules를 원래 저장소로 junction 연결했다. TypeScript/Vite 단계 후 B2-1 private build에서 실제 자산 경로가 원래 저장소의 cache로 해석되어 기존 `SVG escaped build output` 보호 검사가 실패했다. junction 제거 명령은 자동 정책에 차단돼 실행되지 않았다. 기존 트리를 보존한 채 **새 worktree에 자체 npm ci**하여 같은 패치·명령으로 전체 build를 다시 실행했고 PASS했다. 코드·경로 보호 검사·설정은 수정하지 않았다. 초기 로그도 TEMP에 보존했다.

**전체 회귀 NOT RUN:** Batch D의 443/443 Playwright·513/513 단위 결과는 기존 기준선으로 유지한다. 이번 변경은 두 패키지에 한정됐고, 호환성 충돌·제품/콘텐츠 변경·설명되지 않는 출력 차이·선택 검사 회귀가 없다. 따라서 전체 단위/Playwright나 공개 사이트 전 경로 검사를 반복하지 않았다. 이번에 443/513개를 새로 통과시켰다고 주장하지 않는다. Node 22의 실제 Actions 실행도 이번에 수행하지 않았으며 로컬 Node 24 빌드와 기존 engine/peer 범위 확인으로 구분한다.

## E. 잔여 위험·증거

남은 패키지는 **Vitest 3.2.7, @vitest/mocker 3.2.7, Tinypool 1.1.1**이며 Phase 2B 대상이다. 고유 권고문은 `GHSA-5gmw-xhrv-c9v3`, `GHSA-85c8-ppgw-ccpr`(Tinypool Critical), `GHSA-82fw-gwwq-j7x9`, `GHSA-qxg6-89mg-rqv8`(mocker/Vitest Moderate)다. 현재 사용 조건과 위험도는 Phase 1 평가를 유지하며 이번 패치로 이들까지 해결됐다고 보고하지 않는다. 감사 0건을 만들기 위한 Vitest Major 변경은 하지 않았다. 새 Critical/High·신규 제품 회귀는 관측하지 못했다.

아래 원시 증거는 `%TEMP%`에 보존했다. 설치/빌드 로그와 설치 트리 JSON, 초기 junction 빌드 로그도 같은 접두사로 보존했다.

| 파일 | SHA256 |
|---|---|
| `codyssey-phase2a-audit-before.json` | `39fbadb0e6cc85cc2839a966611dd3db9436cc322a1b532f05b3fa6bc48dc576` |
| `codyssey-phase2a-audit-after.json` | `0660d8af6bba5934331816e35503d9638109f2bfe766ed19824e233c10eef64c` |
| `codyssey-phase2a-audit-before-prod.json` / `...after-prod.json` (동일) | `664eeb08e0f599d58fd2b7d0777d0510e463d131c99898494621f3c6cabe80c4` |
| `codyssey-phase2a-artifact-comparison.json` | `3921fa47a6fe1ee9dc08391573a0135217ec86121154e00a94dd12bcfbd2e75e` |
| `codyssey-phase2a-sourcemap-smoke.json` | `2b9ef51282933662379852e483409deec3591d1297f2988cf8a475534c40a3a2` |
| `codyssey-phase2a-learning-entry.json` | `bc2a89a608b89f98004f42db86b6b20f009bb57ca24a33234e74bdd2c198d0c9` |
| `codyssey-phase2a-b31-entry.json` | `92a7a82b902736d96e4b748fe30b434daa6535e6f6db642345cafa005bf8831e` |

## F. 결론

`READY_FOR_REVIEW`: 두 패치의 감사 해소·최소 변경·설치/빌드·대표 경로·CSS/JS 출력 불변을 확인했다. 기존 QA를 재사용할 근거가 있어 전체 회귀로 확대하지 않았다. GPT 독립 검토와 Owner 승인 후 병합한다. main 병합·배포는 실행하지 않았다.
