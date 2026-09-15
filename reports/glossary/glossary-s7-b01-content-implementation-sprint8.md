# Sprint 8 — S7-B01 Content Implementation

## 결과

Sprint 7의 [content-tier-sprint7.json](../../data/reviews/content-tier-sprint7.json)을 Source of Truth로 사용해 `S7-B01`의 **44개 Canonical만** 구현했다. 새로운 우선순위를 만들거나 다른 batch의 콘텐츠를 작성하지 않았다.

| Tier | 계획 수 | 완료 수 | 요구 깊이 |
| --- | ---: | ---: | --- |
| A | 7 | 7 | 동작 원리, 예시, 경계, 오해, 관련 경로, 동료평가 질문 |
| B | 31 | 31 | 정확한 정의, 예시, 경계/비교, 관련 용어, 오해, 동료평가 질문 |
| C | 6 | 6 | 짧고 정확한 정의, 미션 단서, 사용 예, 필요한 관련 용어 |
| 합계 | 44 | 44 | 계획과 일치 |

구현 대상의 정확한 ID와 순서는 계획 JSON의 `implementation_batches[id=S7-B01].term_ids`를 따른다. 모든 대상은 `content/terms/<term-id>.md`로 추가하고, curated master의 `content_status`를 `drafted`로 동기화했다. `build_web_data.py`로 생성한 Web glossary에도 상세 콘텐츠가 반영됐다.

## 대표적인 학습 경계

- 동시성: `deadlock`, `lock`, `mutex`, `race-condition`은 대기 순환과 결과 경쟁을 구분하고, 획득 순서·임계 구역·해제 책임을 설명한다.
- 상태와 성능: `state-change`, `state-transition`, `cache`, `memoization`은 값 변경, 허용 전이, 복사본 최신성, 결과 재사용 비용을 분리한다.
- 운영: `nginx`, `health-check`, `logging`, `log-rotation`, `watchdog`은 요청 진입점·준비 상태·관찰·보존·자동 조치의 경계를 다룬다.
- Python/설계: `generator`, `yield`, `decorator`, `dataclass`, `type-hint`, `layered-architecture`, `separation-of-concerns`은 문법 기능과 책임 분리의 한계를 함께 설명한다.

## 검증

- `python3 scripts/validate_s7_b01_content.py` — PASS: 44 complete, A=7 / B=31 / C=6
- `python3 scripts/validate_content_tier_plan.py` — PASS: Sprint 7 계획 원본의 519 Canonical / 395 계획 항목 / 9개 batch 불변식 유지
- `python3 scripts/validate_glossary.py` — PASS: 0 errors, 1,130 existing maturity warnings
- `python3 scripts/build_web_data.py` — PASS: 생성 glossary에서 S7-B01 44개 모두 `hasDetailedContent` 확인
- `git diff --check` — PASS

현재 실행 환경에는 `npm` 명령이 없어 `npm test`와 production build는 실행하지 못했다. 이번 변경은 콘텐츠·curated 데이터·생성 glossary만 다루며 UI 코드는 변경하지 않았다.

## npm QA 후속 실행 (2026-09-15)

Node/npm 실행 환경을 복구한 뒤, 기존 S7-B01 콘텐츠 44개와 테스트 소스는 수정하지 않고 `package.json`에 실제로 정의된 script를 실행했다.

| 항목 | 실제 명령 | 결과 |
| --- | --- | --- |
| 실행 환경 | `node -v`, `npm -v` | PASS — Node `v24.21.0`, npm `11.19.0` |
| 의존성 확인 | `package-lock.json`, 기존 `node_modules` 확인 | PASS — `npm ci` 불필요, dependency version 변경 없음 |
| Unit test | `npm test` | FAIL — 31개 중 30개 PASS, `src/data.test.ts`가 상세 콘텐츠 수를 이전 고정값 `124`로 기대하지만 생성 glossary는 S7-B01 44개를 포함해 `168`개를 반환 |
| Production build | `npm run build` | PASS — TypeScript 및 Vite production build 완료 (기존 chunk-size 경고만 출력) |
| Atlas validator | `npm run atlas:validate` | PASS — 12 fields, 519 terms, 16 missions |
| Knowledge Map validator | `npm run knowledge-map:validate` | PASS — 10 implemented / 12 registry maps, 2 cross-field layers |
| Concept Connection validator | `npm run glossary:validate` | PASS — 별도 script는 없으며 이 validator가 Concept Connection 구조와 canonical 참조를 검증; 0 errors, 기존 maturity warnings 1,130건 |
| Playwright map tests | `npm run test:map-interaction` | PASS — Chromium 설치 후 5/5 PASS |
| Chrome Extension build | `npm run build:extension` | PASS — deep-link artifacts `publicWebLinks.js` 및 `term-map-links.json` 생성 확인 |

첫 Playwright 실행은 로컬 Chromium binary 부재로 시작하지 못했다. 현재 lockfile에 고정된 Playwright 버전의 Chromium만 `npx playwright install chromium`으로 설치했고, package dependency나 버전은 변경하지 않았다.

전체 QA는 Unit test의 상세 콘텐츠 수 고정 기대값 때문에 **NOT GREEN**이다. 이 실패는 이번 Sprint의 44개 콘텐츠 추가와 일치하는 회귀 테스트 기대값 문제이며, 요청 범위에 따라 해당 테스트와 콘텐츠는 수정하지 않았다.

## Unit Test Baseline Fix (2026-09-15)

후속 작업에서는 콘텐츠·canonical data·Tier plan·Atlas·Knowledge Map·Concept Connection을 수정하지 않고 [src/data.test.ts](../../src/data.test.ts)의 outdated baseline만 바로잡았다.

### 실패 원인과 수정 방식

- 실패 assertion은 generated glossary의 detailed content 수가 정확히 `124`개인지 검사했다. 이는 M01 상세 커버리지 검증에 붙어 있던 과거 Sprint 시점의 고정 수치였다.
- S7-B01의 44개가 정상 생성되면서 실제 수가 `168`이 되어, 이후 S7-B02~B09의 정상적인 추가에도 반복 실패할 구조였다.
- 따라서 `124 → 168`의 단순 치환은 하지 않았다. 기존 124개를 **최소 상세 콘텐츠 baseline**으로 보존하되, 상세 콘텐츠 수가 canonical 전체 수를 넘지 않는지와 각 detailed term의 `summary`·`easyExplanation`·`missionContext`가 비어 있지 않은지를 함께 검증하는 invariant로 변경했다.
- `npm test`는 테스트 전에 항상 `npm run data:build`를 실행하므로 source Markdown에서 generated glossary까지의 생성 경로도 매 실행에 포함된다. dependency나 version 변경은 없었다.

### 전체 QA 재실행

| 항목 | 명령 | 결과 |
| --- | --- | --- |
| Unit tests | `npm test` | PASS — 31/31 |
| Production build | `npm run build` | PASS |
| Atlas validator | `npm run atlas:validate` | PASS — 12 fields, 519 terms, 16 missions |
| Knowledge Map validator | `npm run knowledge-map:validate` | PASS — 10 implemented / 12 registry maps, 2 cross-field layers |
| Concept Connection / glossary validator | `npm run glossary:validate` | PASS — 0 errors, existing maturity warnings 1,130건 |
| Playwright map tests | `npm run test:map-interaction` | PASS — 5/5 |
| Chrome Extension build | `npm run build:extension` | PASS |

Sprint 8 최종 QA 상태는 **GREEN**이다.

## 계획 데이터 취급

`content-tier-sprint7.json`은 Sprint 7 시점의 395개 미작성 항목과 고정 batch 구성을 보존하는 계획 기준이다. 구현 뒤 이를 재생성하면 이미 끝난 B01이 제외되어 당시의 40–50개 batch 불변식이 달라진다. 따라서 이번 Sprint에서는 계획 원본을 수정하거나 재생성하지 않았고, 실제 완료 상태는 term file과 master `content_status`로 기록했다.
