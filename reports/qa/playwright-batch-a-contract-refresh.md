# Playwright Batch A 계약 정비 — 2026-10-28

**Batch A 23/23 해결, 잔여 0. 전체 Playwright 443개 중 397 PASS / 46 FAIL, 신규 실패 0건. 단위 테스트 513/513 및 웹 빌드 PASS. 제품·Canonical 변경 0건이며, 전체 Playwright가 PASS인 것은 아니다.**

| 항목 | 감사 기준 | Batch A 후 |
| --- | ---: | ---: |
| 전체 | 443 | 443 |
| PASS | 374 | 397 |
| FAIL | 69 | 46 |
| Batch A 실패 | 23 | 0 |
| Batch B 실패 | 24 | 24 |
| Batch C 실패 | 22 | 22 |
| 신규 실패 | — | 0 |
| SKIP / reporter FLAKY | 0 / 0 | 0 / 0 |

## 기준과 변경 범위

- 기준 main: `8b05f27313b0264478347d79c6fa68e3a38fd32d` (시작 시 원격 일치, 작업 트리 깨끗함).
- 브랜치: `test/playwright-batch-a-contract-refresh`.
- 검증한 테스트 소스 커밋: `5de1935fb9abe3cb655b19c90ce12beda2140071`. 이후 이 보고서만 추가한다.
- 필독한 감사 보고서/이름별 실패 catalog, AGENTS, 학습 운영 정책을 기준으로 현재 승인 콘텐츠의 교육적 의미를 검사했다.

정확한 수정 파일:

1. `playwright/b31-network-foundations.spec.ts`: 기존 59b6d22 보호 대상 경로를 **Canonical 경로까지 포함해 그대로 유지**. 추가/삭제는 0, 변경 경로는 Canonical 1개만 허용하되 아래 구조화 계약으로 그 내용도 확인한다.
2. `playwright/helpers/canonical-status-contract.ts`: 감사와 PR #38·#39의 명시적 33+2 ID만 raw→drafted 허용. 기준 Git blob과 현재 문서 전체의 deepStrictEqual 비교로 나머지 488개 전체 객체, 승인 35개의 다른 모든 필드, ID·순서·분류·관계·미션 참조·최상위 메타데이터 보호. 수량/고유 ID 523, 승인 목록 길이/고유 ID 35, 기준raw/현재drafted도 확인.
3. `playwright/b2-1-learning-story.spec.ts`: 기존 6개 test를6개로 유지. M03 진입→8장 개요→Scene01 Step1→다음 URL/내용 변경→강의 소개→미션 복귀, 직접 위치/reload, 관련 용어 연결·Canonical 목적지, 교육적 단계, 375px 네 테마 개요/강의 넘침 검사.
4. `playwright/mission-story-ui-v12.spec.ts`: B2-1의8장·발표자/스토리지fallback·기하/테마 검사는 유지. B3-1의8장 순서·slide-intro 시작·next/prev/select의 장면과URL·다른 장면에서scene-02 선택·직접URL/reload·테마 유지·지도 왕복·강의 소개 복귀 검사. 1280/1000/360/390px×OS Light/Dark 유지.
5. `playwright/mission-ui-v11.spec.ts`: 기본 AWS카드6개 표시, 보충SVG 초기 접힘→사용자 펼침→SVG 표시→125%확대→닫기/초점 복귀 추가. 원본SVG 내용/기하/타이포그래피 지문, 지도 색/선택/패널/전체화면/초점/용어·Story 왕복 등 기존 공통UI 검사 유지.
6. `reports/qa/playwright-batch-a-contract-refresh.md`: 본 보고서.

B3-1 순서: slide-intro / slide-network / slide-packet / scene-01 / scene-02 / scene-03a / scene-03b / scene-04. 그림 details는 `.b31-slide-extra:not(.b31-slide-links)`로 한정해 학습 링크 details와 혼동하지 않는다. >11.5px SVG 글자 기준은 수정하지 않았다.

## 교육적 보호와 달라진 범위

- Iterator/Generator: 원고 Scene 05의 next1→next2, 위치 기억/종료, gen→give→pause→resume→end, list보관 시 메모리 사용을 실제 #say/#stage·URL로 검증. 현재 제공되지 않는 두 Iterator 위젯·TX-001/002 독립 상태·reset·StopIteration 문자/비활성 버튼은 가정하지 않는다. 종료 의미는 현 단계 설명으로 보호하며, 새 검사를 실시간 실행기 독립성 검증으로 보고하지 않는다.
- Decorator: Scene 06의 원래 기능 보존, 정상/정해진 오류 분기, handle_errors·종료코드0/1·LedgerError만 처리하고 다른 오류는 드러나는 경계 검사. 예전 실행 버튼으로 Python을 실제 실행한다고 가정하지 않는다.
- Type Hint: Scene 07의 형 표시·자동 실행 차단이 아님·문자열/음수의 형과값 규칙 구분·변환 실패와금액 검증 실패·validate_amount 연결 검사. 예전 limit/list 표기 대신 현재 amount/int 설명을 사용한다.
- 관련 용어: 강사 노트의 선택형 용어에서 iterator/generator/yield/decorator/function/type-hint 링크가 보이고 실제Canonical ID를 가리킴을 확인. 타 미션 오노출 방지 검사도 유지.

Canonical 예외는 정확히 승인 35개이며 다른488개와 모든 기타 필드가 동일해야 한다. 기존 보호 test 안에서 메모리 복사본을 변조하는 **10개 음성 검사**(미승인 상태/thread→reviewed/분류/관계/미션 참조/용어명 필드/추가/삭제/순서/최상위version)를 수행해 모두 실패로 검출한다. 실제 파일 변조·경로 단순 제외·기대 해시 교체·fixture 재생성은 없다.

## QA 조건

Windows/PowerShell, Node24.16.0·npm11.13.0·Python3.14.6·Playwright1.63.0·Chromium153.0.8010.12 headless. 기존 설정의 Vite 개발 서버127.0.0.1:4178 사용. 기존 프로젝트/개별 timeout·retries는 변경하지 않았다. 다른 서버를 종료하지 않았다.

기존Spec이 보고서 캡처를 직접 기록하므로, 별도detached worktree에 동일 테스트 소스 5개를 복사해 검증했다. 검증 커밋과 5개 파일의 LF정규화 후 일치를 확인했다. 초기 실행의 기존 보고서 경로 캡처는TEMP에 보존하고 기준 상태로 복원했다. 생성 데이터와 기존QA 캡처는 최종diff에 포함하지 않는다.

```powershell
$env:PYTHONUTF8 = "1"
$env:PLAYWRIGHT_PORT = "4178"
$env:B31_QA_OUTPUT = Join-Path $env:TEMP "playwright-batch-a-evidence"
npx playwright test playwright/b31-network-foundations.spec.ts playwright/b2-1-learning-story.spec.ts playwright/mission-story-ui-v12.spec.ts playwright/mission-ui-v11.spec.ts --workers=2 --reporter=json
npx playwright test playwright/b31-network-foundations.spec.ts --grep "1280 dark: readable cards" --workers=1 --reporter=json
$env:PLAYWRIGHT_JSON_OUTPUT_FILE = Join-Path $env:TEMP "playwright-batch-a-full.json"
npx playwright test --workers=4 --reporter=json
npm test -- --maxWorkers=2 --testTimeout=20000
npm run build
git diff --check
```

## 실제 실행 결과

| 검사 | 실제 결과 |
| --- | --- |
| 변경 4개 Spec, workers=2 | 32 PASS / 1 FAIL: 최초 1280 dark page.goto의 기존 5초 로딩 timeout |
| 해당 1건 단독 workers=1 | 1 PASS, 같은 5초 제한 유지 |
| 전체 실행 안의 변경 4개 Spec | 33/33 PASS: 기존 통과 10개 + 해결 23개 |
| 전체 Playwright, workers=4 | 397 PASS / 46 FAIL, SKIP 0 / reporter FLAKY 0, 종료 코드 1 |
| 단위 테스트 | 41개 파일, 513/513 PASS |
| 웹 빌드 | PASS: TypeScript·Vite·B2-1 산출물 검사. 기존 청크 크기 경고 유지 |
| git diff --check | PASS |

최초 로딩 timeout은 단독 및 전체 실행에서 재현되지 않았다. 이 수동 재시도 이력은 reporter flaky=0과 구분한다. 단독 성공만으로 전체 성공을 추정하지 않았으며, 후속 assertion의 오류를 숨기려고 조건을 삭제하거나 시간을 늘리지 않았다.

전체 시작 2026-10-28T23:21:06.722+09:00 (Asia/Seoul), 소요 745.294초. 40개 파일·443개, workers=4 / retries=0. UTF-8 reporter 원본은 `%TEMP%/playwright-batch-a-full.json`에 보존했다. SHA256 `8222ab80d3d50bb9cac91675de449acab96d3292d22c01c371b99e3b70580251`. 이름별 분석은 `%TEMP%/playwright-batch-a-comparison.json`, 대상 검사 로그/JSON은 같은 TEMP의 playwright-batch-a-target-second 및 target-recheck 이름으로 보존한다. 대량 JSON·캡처는 커밋하지 않는다.

### Batch A 23개 이름별 전후

B2-1에서 의미에 맞춰 이름을 바꾼 4개는 화살표로 대응한다. 이전 이름이 사라졌다는 이유로 해결로 세지 않고, 실제 대응 test의 PASS를 확인했다. 각 Spec의 test 수와 전체 443개를 유지했다.

| Spec | 이전 이름 → 현재 이름(변경 시) | 전 | 후 |
| --- | --- | --- | --- |
| `b2-1-learning-story.spec.ts` | B2-1 mission card opens the private story and returns to the mission | FAIL | PASS |
| `b2-1-learning-story.spec.ts` | B2-1 story supports direct access and links every episode to existing terms → B2-1 story supports direct access and links all eight scenes to existing terms | FAIL | PASS |
| `b2-1-learning-story.spec.ts` | two iterators advance independently through yield and StopIteration states → iterator and generator steps explain next, yield, resume and termination | FAIL | PASS |
| `b2-1-learning-story.spec.ts` | decorator trace distinguishes normal and LedgerError return paths → decorator steps distinguish normal and LedgerError return paths | FAIL | PASS |
| `b2-1-learning-story.spec.ts` | type hint episode separates static information from runtime value validation → type hint steps separate static information from runtime validation | FAIL | PASS |
| `b2-1-learning-story.spec.ts` | B2-1 story remains readable without viewport overflow in every theme | FAIL | PASS |
| `b31-network-foundations.spec.ts` | protects original lesson assets and approved UI inventories while glossary evolves | FAIL | PASS |
| `mission-story-ui-v12.spec.ts` | 1280 light: shared overview, lecture state, themes and returns | FAIL | PASS |
| `mission-story-ui-v12.spec.ts` | 1280 dark: shared overview, lecture state, themes and returns | FAIL | PASS |
| `mission-story-ui-v12.spec.ts` | 1000 light: shared overview, lecture state, themes and returns | FAIL | PASS |
| `mission-story-ui-v12.spec.ts` | 1000 dark: shared overview, lecture state, themes and returns | FAIL | PASS |
| `mission-story-ui-v12.spec.ts` | 360 light: shared overview, lecture state, themes and returns | FAIL | PASS |
| `mission-story-ui-v12.spec.ts` | 360 dark: shared overview, lecture state, themes and returns | FAIL | PASS |
| `mission-story-ui-v12.spec.ts` | 390 light: shared overview, lecture state, themes and returns | FAIL | PASS |
| `mission-story-ui-v12.spec.ts` | 390 dark: shared overview, lecture state, themes and returns | FAIL | PASS |
| `mission-ui-v11.spec.ts` | 1280 light: shared chrome, protected content and split-panel lifecycle | FAIL | PASS |
| `mission-ui-v11.spec.ts` | 1280 dark: shared chrome, protected content and split-panel lifecycle | FAIL | PASS |
| `mission-ui-v11.spec.ts` | 1000 light: shared chrome, protected content and split-panel lifecycle | FAIL | PASS |
| `mission-ui-v11.spec.ts` | 1000 dark: shared chrome, protected content and split-panel lifecycle | FAIL | PASS |
| `mission-ui-v11.spec.ts` | 360 light: shared chrome, protected content and split-panel lifecycle | FAIL | PASS |
| `mission-ui-v11.spec.ts` | 360 dark: shared chrome, protected content and split-panel lifecycle | FAIL | PASS |
| `mission-ui-v11.spec.ts` | 390 light: shared chrome, protected content and split-panel lifecycle | FAIL | PASS |
| `mission-ui-v11.spec.ts` | 390 dark: shared chrome, protected content and split-panel lifecycle | FAIL | PASS |

### 전체 잔여 46개 이름

모두 기존 감사에 있던 동일 이름의 실패다. 숨겨져 있던 후속 assertion의 신규 실패는 0건이다. Batch B/C의 코드·테스트·기대값은 이번 범위에서 수정하지 않았다.

| Spec | 실패 테스트 이름 | 후속 범위 |
| --- | --- | --- |
| `b31-story-map.spec.ts` | 1000px forest light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 1000px forest dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 1000px indigo light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 1000px indigo dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 1000px paper light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 1000px paper dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 1000px signal light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 1000px signal dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 390px forest light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 390px forest dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 390px indigo light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 390px indigo dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 390px paper light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 390px paper dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 390px signal light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 390px signal dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 360px forest light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 360px forest dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 360px indigo light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 360px indigo dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 360px paper light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 360px paper dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 360px signal light: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `b31-story-map.spec.ts` | 360px signal dark: readable responsive scenes and lecture enlargement | Batch B: >11.5px 미달 |
| `mission-concept-map-lanes.spec.ts` | 1280px detail header stays separate during body scroll and selection changes | Batch C: 과거 흰색 헤더 기대 |
| `mission-concept-map-lanes.spec.ts` | 1000px detail header stays separate during body scroll and selection changes | Batch C: 과거 흰색 헤더 기대 |
| `mission-concept-map-lanes.spec.ts` | 390px detail header stays separate during body scroll and selection changes | Batch C: 과거 흰색 헤더 기대 |
| `mission-concept-map-lanes.spec.ts` | 360px detail header stays separate during body scroll and selection changes | Batch C: 과거 흰색 헤더 기대 |
| `mission-concept-map-palette.spec.ts` | 1280px forest: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 1280px indigo: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 1280px paper: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 1280px signal: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 1000px forest: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 1000px indigo: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 1000px paper: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 1000px signal: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 390px forest: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 390px indigo: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 390px paper: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 390px signal: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 360px forest: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 360px indigo: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 360px paper: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | 360px signal: bright learning palette, AA text and matching arrows in both OS modes | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-concept-map-palette.spec.ts` | live theme and OS switches preserve the learning surfaces, selection and world geometry | Batch C: 닫힌 테마 메뉴 조작 |
| `mission-learning-entry.spec.ts` | real learning paths differ by mission and B3-1 guide/supplement appear once | Batch C: main-M01 자료 목록 기대 |

후속 권고: Batch B는 보충 SVG 가독성 24건을 기준 완화 없이 개선한다. Batch C는 실제 메뉴 열기·현재 헤더 토큰·main-M01 자료 목록 22건을 정비하고 가려진 후속 검사를 실행한다. 제품 가독성이나 Batch C 정책에 대한 새 결함은 이번 실행에서 발견되지 않았다.

## 독립 검토와 승인 경계

GPT-6.1 Sol Medium 별도 검토자가 읽기 전용으로 검토했다. 그림details 모호한 선택자와URL 검사 공백 지적을 반영했고, 재검토에서 추가 차단 사항·중요 보호 손실 없음으로 확인했다. 실행 결과는 아래 실제QA로 별도 판정한다.

제품 React/TypeScript·CSS·SVG·Canonical·콘텐츠·지도·가이드·기존fixture·Playwright 공통설정·배포설정 변경 **0건**. 각Spec의 test 수 유지, 삭제/skip/fixme/only 및 무조건timeout 증가 없음. main 병합·GitHub Pages 배포는 하지 않는다. Draft PR과Owner 검토 대상이다.
