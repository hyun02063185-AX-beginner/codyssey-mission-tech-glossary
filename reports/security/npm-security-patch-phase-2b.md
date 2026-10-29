# npm 보안 패치 Phase 2B — 2026-10-29

## A. 업데이트 내용

- 기준 main: `f3ab8f8bb1679edfdbf326dc2149d3df6245d41a`; fetch/pull 확인, 시작 작업 트리 깨끗함.
- 브랜치: `security/vitest-phase2b-patch`.
- 환경: Windows/PowerShell, Node 24.16.0, npm 11.13.0. Node 22는 engine 범위 확인이며 실제 실행은 하지 않았다.
- 명령: `npm install --save-dev --save-exact vitest@4.1.12 --no-audit --no-fund`.

| 패키지 | 이전 → 이후 |
|---|---|
| Vitest | 3.2.7 (`^3.0.0`) → **4.1.12** (정확 버전) |
| @vitest/mocker | 3.2.7 → **4.1.12** |
| @vitest/expect, pretty-format, runner, snapshot, spy, utils | 각각 3.2.7 → 4.1.12 |
| Tinypool | **1.1.1 제거**, 잔여 사본 없음 |
| vite-node | 3.2.4 제거; Vite Module Runner 사용 |
| chai / es-module-lexer | 5.3.3 → 6.3.0 / 1.7.0 → 2.3.2 |
| std-env / tinyexec / tinyrainbow | 3.10.0 → 4.3.0 / 0.3.2 → 1.3.1 / 2.0.0 → 3.2.0 |
| 추가 | @standard-schema/spec 1.1.0, obug 2.2.1 |
| 기타 제거 | cac 6.7.14, check-error 2.1.3, deep-eql 5.0.2, loupe 3.2.1, pathval 2.0.1, strip-literal 3.1.0 및 그 하위 js-tokens 9.0.1, tinyspy 4.0.6 |

Lock 구조 비교: root 지정 변경 외 패키지 **13개 갱신·2개 추가·10개 제거**. 모두 Vitest/간접 의존성 변경이다. 다른 항목의 메타데이터만 변경된 사례는 없다. Vite **6.4.5**, source-map-js **1.2.2**, React·Playwright·TypeScript·plugin-react 등 나머지 lock 항목은 동일하다.

## B. 보안 개선

변경 전후 `npm audit --json`, `npm audit --omit=dev --json`을 수집했다. 전체 감사 종료 코드는 1→0, production은 0→0이며 JSON/registry 오류가 없다.

| 집계 | 이전 | 이후 |
|---|---:|---:|
| 취약 패키지 | 3 | **0** |
| Critical / High / Moderate | 2 / 0 / 1 | **0 / 0 / 0** |
| 고유 GHSA | 4 | **0** |
| Production | 0 | **0** |

해결된 권고문: `GHSA-5gmw-xhrv-c9v3`, `GHSA-85c8-ppgw-ccpr`(Tinypool 제거), `GHSA-82fw-gwwq-j7x9`, `GHSA-qxg6-89mg-rqv8`(mocker 수정). 신규·잔여 권고문 및 신규 Critical/High는 0이다. 감사 결과는 실행 시점 advisory DB 범위이며 프로젝트 전체 보안의 보증이 아니다.

mocker 공식 수정 범위: [redirect mock 4.1.11](https://github.com/advisories/GHSA-82fw-gwwq-j7x9), [manual mock 4.1.12](https://github.com/advisories/GHSA-qxg6-89mg-rqv8). 설치된 4.1.12는 두 수정 범위를 충족한다.

## C. 호환성 및 변경 범위

[공식 v4 마이그레이션](https://v4.vitest.dev/guide/migration.html), [v5 마이그레이션](https://vitest.dev/guide/migration/), npm registry의 [4.1.12](https://registry.npmjs.org/vitest/4.1.12)·[5.0.5](https://registry.npmjs.org/vitest/5.0.5) 메타데이터를 재확인했다.

| 검토 항목 | 4.1.12 선택 근거 / 5.0.5 비교 |
|---|---|
| 엔진·Vite | v4 Node `^20.0.0 || ^22.0.0 || >=24.0.0`, Vite `^6.0.0 || ^7.0.0 || ^8.0.0`. v5 Node `^22.12.0 || ^24.0.0 || >=26.0.0`, Vite `^6.4.0 || ^7.0.0 || ^8.0.0`. 둘 다 현재 Node 24/Vite 6.4.5 범위 충족. CI는 Node 22 지정이며 v5는 22.12 이상 필요 |
| Worker·실행 | v4는 Tinypool 없이 pool 재작성, `maxWorkers` 지원. 기존 forks·파일 격리 기본 동작 유지; 격리 해제·순서 강제 설정·poolOptions/custom pool 없음. 병렬 파일의 실제 실행 순서 동일성은 주장하지 않음 |
| Mock·Spy | v4의 constructor mock, restoreAllMocks, automock 상태 변경 검토. 기존 테스트에서 `vi.*` 사용 없음. v5는 clearMocks 기본 true 등 추가 동작 변경. v5까지 확대할 필요 없음 |
| 파일 탐색 | v4 기본 제외 경로 축소 검토. 프로젝트는 이미 `exclude: ['**/node_modules/**', 'playwright/**']`를 명시. 변경 없이 41파일·513개 이름 동일 확인 |
| Vite 설정 | vite-node → Vite Module Runner 전환. 기존 react 플러그인·Node 테스트 설정 그대로 사용; Browser Mode·coverage/custom reporter/환경 없음 |
| 수정 포함 | v4 mocker 4.1.12, v5 mocker 5.0.5 모두 대상 수정 포함; 둘 다 registry dependency에 Tinypool 없음 |

`npm ls vitest @vitest/mocker tinypool vite --all` 및 전체 `npm ls --all --json` 종료 코드 0. Vite는 6.4.5 단일 설치·dedupe, Vitest/mocker 구버전·Tinypool·peer 충돌 없음. overrides/force/legacy-peer-deps/audit fix는 사용하지 않았다. v4 문서는 구버전 문서로 표시되며 장기 유지보수 보증은 이번 판정 범위 밖이다.

허용된 package.json·package-lock.json·이 보고서만 변경했다. 제품·테스트·설정·콘텐츠·워크플로 수정 0이다.

## D. 영향 범위 검증

| 검사 | 결과 |
|---|---|
| `npm ci` | PASS, 종료 코드 0; 자체 node_modules 설치 |
| 단위 테스트 1회 | `PYTHONUTF8=1 npm test -- --maxWorkers=2 --testTimeout=20000 --reporter=default --reporter=json --outputFile.json=<TEMP JSON>`; **41파일, 513 PASS / FAIL 0 / SKIP 0 / TODO 0**, 16.19초 |
| 테스트 이름 | Phase 2A 자체 설치 worktree의 Vitest 3.2.7 `vitest list --json <TEMP>`로 실행 없이 기준 목록 수집. 41파일·513개 파일명+계층별 테스트명 multiset 일치, 추가·삭제 0. baseline/현재 제품·테스트 소스 Git 동일 확인. 기본 reporter 문구만으로 이름 일치를 추정하지 않음 |
| 웹 빌드 1회 | `PYTHONUTF8=1 npm run build` PASS; TypeScript·Vite·B2-1 보호 검사 포함 |
| B2-1 산출물 | 9 Scene·byte-identical SVG 16개·코드 블록 155개·모든 Scene React SSR PASS |
| 산출물 비교 | Phase 2A 해시 manifest와 새 dist를 SHA256 전수 비교: **350→350개, 추가 0·삭제 0·변경 0**. JS/CSS/HTML/정적 자산 동일 |
| `git diff --check` | PASS |
| Playwright | **REUSED**. 새 실행 없음. Batch D 443/443·Phase 2A 선택 2/2 결과 재사용 |

[Phase 2A](npm-security-patch-phase-2a.md)의 산출물 비교 증거 SHA256 `3921fa47a6fe1ee9dc08391573a0135217ec86121154e00a94dd12bcfbd2e75e`를 재확인했다. [Batch D closeout](../qa/playwright-final-integration-closeout.md)의 기준은 `082fa1ddb97138949abdd63db62668c26a3cdac4`다. 제품·Vite·배포 출력이 유지되고 runtime 의존성 충돌이 없어 전체/선택 브라우저 검사를 추가할 조건이 없다. Node 22 실제 실행, 물리 모바일·Firefox 등 기존 미검증 범위는 확대하지 않았다. 기존 500kB chunk 경고는 있으나 출력은 동일하고 빌드는 성공했다.

원시 감사·설치·단위·빌드·registry·의존성 트리·비교 JSON은 `%TEMP%/codyssey-phase2b-*`에 보존했다. 주요 증거 SHA256:

| TEMP 파일 | SHA256 |
|---|---|
| `codyssey-phase2b-audit-before.json` | `0660d8af6bba5934331816e35503d9638109f2bfe766ed19824e233c10eef64c` |
| `codyssey-phase2b-audit-after.json` | `6445b94300c527267a411066b4e6af50c34fda094b2a77c95944dd89888f4556` |
| `codyssey-phase2b-audit-before-prod.json` | `664eeb08e0f599d58fd2b7d0777d0510e463d131c99898494621f3c6cabe80c4` |
| `codyssey-phase2b-audit-after-prod.json` | `6445b94300c527267a411066b4e6af50c34fda094b2a77c95944dd89888f4556` |
| `codyssey-phase2b-unit.json` | `e921fd5f8ead8e636dc738f65f1c0308c13b8beca02cc7cc9bfa71851bcf4077` |
| `codyssey-phase2b-test-name-comparison.json` | `e11e9dbb0ad7192eda51b46521b2b25a4c767ebaa09e90b89ef23069ff680bce` |
| `codyssey-phase2b-artifact-comparison.json` | `7a84bcfb6b7d9176ad17eee779aa007bb105545aea445037a36e1c123f98d7ce` |
| `codyssey-phase2b-lock-comparison.json` | `661641ad4b38fc70deff2a0a508ace9f7cce2864bc116af7db025a4877e612d5` |
| `codyssey-phase2b-npm-ci.log` | `61cca411faea4bb4ca4f638065396af765367bfb78d0659c31b2564cfee21766` |
| `codyssey-phase2b-build.log` | `d8259d787d9fb8a222bc4e199723f8dd4ae0a83c8faaceff62b1f4389a8b2bbc` |

## E. 결론

**READY_FOR_REVIEW**: 대상 4개 권고문 해소, 깨끗한 설치·단위 513개·빌드 성공, 테스트 이름과 배포 산출물 불변 확인. 보안 패치에 필요한 Vitest 내부 변경만 수행했다. GPT 독립 검토 및 Owner 승인 대기이며 이번 실행을 독립 검토 완료로 간주하지 않는다. 커밋·푸시 후 Draft PR로 제출하고 main 병합·자동 병합·배포는 실행하지 않는다.
