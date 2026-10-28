# Playwright 전체 회귀검사 감사 — 2026-10-28

## ① 전체 결과 요약

**현재 main 5445993은 374 PASS / 69 FAIL이다. 기존 68개 실패가 모두 재현됐고 신규 1개는 승인된 Canonical 상태 동기화와 충돌하는 오래된 보호 계약이다. 원인 분류는 PRODUCT_BUG 24 / STALE_TEST 45이며 제품·테스트 구현은 수정하지 않았다.**

| 항목 | 기존 결과 | 현재 결과 |
| --- | ---: | ---: |
| 전체 | 443 | 443 |
| PASS | 375 | 374 |
| FAIL | 68 | 69 |
| SKIP | 0 | 0 |
| FLAKY (Playwright reporter) | 0 | 0 |
| 신규 실패 | 미확인 | 1 |
| 해결된 실패 | 미확인 | 0 |

기존 [전체 결과](../b3-1-slide-ux-final/regression-summary.json)와 현재 결과를 **파일명 + 테스트 이름**으로 대조했다. 과거 실패 테스트 68개 모두 현재 목록에 존재하고 모두 실패한다. 테스트 누락을 해결로 세지 않았다. [69개 이름별 분류·오류·신규 여부·집계](playwright-regression-audit-2026-10-28/failure-catalog.json)를 보존했다. 신규 실패도 제품 신규 결함과 구별한다.

### 실행 조건과 증거 보존

- 기준 SHA: `54459937479bbc31c19151cd28a4ba62a0c7dbd8`. 시작 시 작업 트리 깨끗함. main 전환→fetch→pull --ff-only 후 지정 SHA 확인, `qa/playwright-regression-audit` 생성.
- Windows NT 10.0.26300.0 x64 / PowerShell, Node 24.16.0 / npm 11.13.0 / Python 3.14.6 / Playwright 1.63.0.
- 설치된 Chromium 153.0.8010.12, headless, channel 지정 없음. 실행 전 실제 브라우저 launch로 설치 확인.
- 전체 40개 spec 파일·443개 테스트, workers 4 / retries 0. 프로젝트 기본 timeout 30,000ms, 개별 기존 timeout은 30/60/90/120/150/180/240초. 수정하거나 늘리지 않았다.
- 시작 `2026-10-28 22:46:52.197 KST` (`13:46:52.197Z`), 소요 753.769초(약 12분 34초), 종료 코드 **1**.
- 기존 spec이 보고서·스크린샷 경로를 직접 덮어쓰므로 동일 SHA의 별도 detached worktree에서 실행했다. 의존성은 기존 node_modules junction으로 동일하게 사용했다. 원래 작업 트리의 보고서·제품·테스트·fixture는 보존했다.
- 서버는 기존 playwright.config.ts의 `npx vite --host 127.0.0.1 --port 4178 --strictPort` 개발 서버다. 실행 전 4178에 listener 없음 확인. 기존 프로세스를 종료하거나 서버 설정을 바꾸지 않았다. 프로덕션 빌드나 GitHub Actions 성공을 대체 근거로 사용하지 않았다.

실행 환경과 명령:

```powershell
$env:PYTHONUTF8 = "1"
$env:PLAYWRIGHT_PORT = "4178"
$env:B31_QA_OUTPUT = Join-Path $env:TEMP 'playwright-regression-audit-5445993/b31-evidence'
$env:PLAYWRIGHT_JSON_OUTPUT_FILE = Join-Path $env:TEMP 'playwright-regression-audit-5445993/full-results.json'
npx playwright test --workers=4 --reporter=json
```

JSON reporter가 UTF-8 파일을 직접 기록했다. 원본은 `%TEMP%/playwright-regression-audit-5445993/full-results.json`에 보존했다(766,823바이트, SHA256 `b31843a94f2844b5cdc09dbf84e2fcd09642da085bfa536ef3dd9f8842b8fc6b`). Git에는 축약 실패 목록·진단 치수·대표 PNG 2장만 추가했다. 원본 JSON·대량 캡처·trace는 커밋하지 않았다.

기존 QA의 tested-sources.json에 기록된 B3-1 제품·검사 소스 9개는 현재 파일의 LF 기준 SHA256과 모두 일치한다. 이전 회귀 이후 바뀐 항목은 용어 원고·상태·생성 데이터 및 관련 단위 테스트·보고서이며, 이를 실제 전체 실행을 생략하는 근거로 사용하지 않았다.

## ② 실패 원인 분류표

아래 건수는 **실패 테스트 개수**이며 독립 결함 수가 아니다. SVG 24건은 3개 화면 폭 × 4개 테마 × 2개 OS 색 모드의 공통 가독성 문제다.

| 기존 영역 / spec | 전→현재 | 대표 오류 | 현재 동작·판정 근거 | 분류 / 권장 방향 |
| --- | ---: | --- | --- | --- |
| B2-1 / b2-1-learning-story.spec.ts | 6→6 | 과거 진입 링크 timeout, .b21-episode 기대 3/실제 0, 옛 iterator/decorator/type-hint DOM 없음 | 현재 시작 링크로 진입해 8장 개요·실제 강의 단계·URL·새로고침·미션 복귀 정상. B21ServiceStory 및 현 8장 콘텐츠와 일치 | STALE_TEST 6. 옛 3개 에피소드/위젯/제목/링크 선택자를 현 개요→강의→단계 구조로 갱신 |
| 보충 SVG 글자 / b31-story-map.spec.ts | 24→24 | minimumText >11.5, 실제 11.4 / 11.4833 / 10.4 | 접힌 보충 그림을 사용자가 연 뒤에도 작은 글자 표시가 실제 존재. 확대 기능은 정상이나 일반 표시의 가독성 미달을 없애지는 않음 | PRODUCT_BUG 24. 기준을 낮추지 말고 보충 그림의 렌더 폭·글꼴·모바일 배치를 개선 |
| 지도 헤더 / mission-concept-map-lanes.spec.ts | 4→4 | white rgb(255,255,255) 기대 / rgb(238,245,239) 실제 | 현 공통 UI의 --surface-soft(#eef5ef) 사용. 본문 스크롤 중 헤더 위치 유지, 관계 선택 시 본문 0으로 복귀. 글자 대비 14.45:1 | STALE_TEST 4. 흰색 하드코딩을 현 토큰·대비 계약으로 바꾸고 스크롤/겹침/선택 검사는 유지 |
| 테마 메뉴 / mission-concept-map-palette.spec.ts | 17→17 | 닫힌 details 내부 selectOption이 hidden으로 30초 timeout | ThemeSelector는 LearningFocusNav의 학습자료 메뉴 안에 있음. 실제 메뉴를 열면 모든 테마 조작 가능. 별도 32개 조합에서 선택 상태 대비·화살표 색 정상 | STALE_TEST 17. 학습자료 열기→화면 테마 선택→닫기 순서 추가, 기존 밝기·AA·화살표·상태 전환 검사는 유지 |
| 자료 목록 / mission-learning-entry.spec.ts | 1→1 | main-M01에서 guide만 기대 / story, concepts, guide 실제 | 현 B1-1 스토리·개념지도·가이드가 모두 연결됨. missionLearning.ts의 등록과 실제 DOM 일치 | STALE_TEST 1. main-M01 기대 목록을 세 자료로 갱신하고 실제 링크·중복·미제공 계약 유지 |
| 이전 5장 / mission-story-ui-v12.spec.ts | 8→8 | B3-1 개요 li 기대 5 / 실제 8 | 승인된 8장 직접 URL 및 다음 이동 모두 정상. B31LearningPage가 lectureSlides 8장을 개요로 구성 | STALE_TEST 8. 8장 계약과 현재 기본 자료·왕복 경로로 갱신, 나머지 UI 검사를 삭제하지 않음 |
| SVG 기본 노출 / mission-ui-v11.spec.ts | 8→8 | .b31-story-art.first() visible 기대 / hidden 실제 | 기본 자료는 NetworkOverview·PacketJourney·AWS 카드 등. 원본 SVG는 b31-slide-extra의 접힌 보충 자료이며 열기/확대/닫기 정상 | STALE_TEST 8. 기본 강의 자료와 명시적으로 펼친 보충 그림을 각각 검사. 항상 노출로 제품을 되돌리지 않음 |
| **신규 보호 계약** / b31-network-foundations.spec.ts:47 | 0→1 | changed:[data/curated/glossary-master-v0.1.yaml] | 보호 기준 59b6d22와 비교하면 PR #38·#39에서 승인된 정확한 35개 raw→drafted만 다름. 523개 ID·기타 메타데이터·다른 보호 소스 동일 | STALE_TEST 1. 구조화된 Canonical 검증으로 승인 ID/상태만 이전 값 투영, 나머지 모든 보호 규칙 유지 |

| 분류 | 건수 |
| --- | ---: |
| PRODUCT_BUG | 24 |
| STALE_TEST | 45 |
| ENVIRONMENT | 0 |
| FLAKY | 0 |
| NEEDS_OWNER_DECISION | 0 |
| UNKNOWN | 0 |

분류는 이번 실행에서 드러난 실패 원인에 한정한다. 앞선 assertion이 막아 실행되지 않은 모든 후속 assertion이나 전체 제품의 무결함을 보증하지 않는다. 전체 실행의 reporter flaky=0과 재현 증거를 기록했으며, 모든 테스트를 반복해 통계적 비결정성을 배제한 것은 아니다.

### 선별 재현과 실제 UI 확인

신규 1건만 원인이 추가 확인을 요구하여 원본 spec을 수정 없이 workers=1로 재실행했다. 같은 Canonical changed 오류로 1 FAIL, 종료 코드 1. 일시적 부하나 브라우저 문제로 분류하지 않았다.

```powershell
npx playwright test playwright/b31-network-foundations.spec.ts --grep "protects original lesson assets" --workers=1 --reporter=json
```

Git 59b6d22와 현재 Canonical을 파싱하여 523개 ID·순서·상위 구조를 대조했다. 달라진 35개 모두 raw→drafted 하나뿐이며 각 객체의 나머지 필드는 동일했다. B3-1 guard에서 Canonical 경로를 단순 제외하거나 새 전체 해시로 덮어쓰는 해결은 권고하지 않는다.

실제 UI 진단은 별도 로컬 Vite 4179와 동일 Chromium에서 수행했다. [DOM·치수·계산 스타일·URL 증거](playwright-regression-audit-2026-10-28/ui-probes.json)에 기록했다. 원본 테스트/제품 수정은 없다.

- **B2-1:** main-M03 시작 링크→8장 개요→Scene 01 step 1→step 2 URL·표시 변경, 새로고침 후 step 2 유지, 미션 복귀 확인. 과거 세 에피소드 DOM이 없다는 사실을 진입 오류로 오인하지 않았다.
- **B3-1:** slide-intro / slide-network / slide-packet / scene-01 / scene-02 / scene-03a / scene-03b / scene-04 모두 직접 URL로 렌더됨. 다음 버튼으로 같은 8장 순차 이동 확인. 비동기 렌더 완료 후 data-scene을 읽어 확인했다.
- **테마·헤더:** 1280/1000/390/360px에서 메뉴를 열고 테마 선택 가능. 헤더 y값이 본문 End 스크롤 전후 동일(PC129px, 모바일457px), GN14 선택 시 bodyScroll=0. 배경 #eef5ef, 글자 rgb(24,36,31), 대비 14.449:1.
- **팔레트:** 4폭×4테마×2 OS 모드 **32조합의 방화벽 선택 상태**에서 기존 spec의 measure 함수를 사용. 최소 영역/노드 글자 대비 5.611:1, 선택 테두리 4.789:1, 강조 관계 4.851:1, 패널 글자 9.997:1, 활성 버튼 6.167:1, 캔버스 휘도 0.980. 화살표 색 일치·문서 가로 넘침 없음·같은 사이트 테마의 OS 간 팔레트 일치. 원래 spec의 모든 탐색/요청/응답 상태까지 통과한 것으로 표현하지 않는다.
- **자료 목록:** main-M05/M03/M01/M11은 story/concepts/guide, preliminary-M03은 interactive, main-M13은 빈 목록임을 실제 DOM으로 확인.
- **보충 SVG:** 4폭×4그림 16개에서 기본 접힘→펼침→확대125%→닫기·초점 복귀 확인. 진단 중 pageerror 0. 실제 프로젝터·물리 휴대전화·Firefox/Safari·스크린리더는 미검증.

보충 그림 실제 최소 글자 크기(CSS px, computed font-size × SVG 표시폭 / viewBox폭):

| 화면 폭 | 일반망/요청응답 일반 표시 | AWS 그림 일반 표시 | 일반망 그림 125% 확대 |
| --- | ---: | ---: | ---: |
| 1280 | 14.9 | 14.9 | 18.812 |
| 1000 | 11.4 | 16.333 | 14.438 |
| 390 | 11.483 | 12.367 | 15.979 |
| 360 | 10.4 | 11.2 | 14.625 |

[360px 일반 표시](playwright-regression-audit-2026-10-28/svg-360-normal.png) · [동일 그림 확대125%](playwright-regression-audit-2026-10-28/svg-360-enlarged.png). 원본 요소 캡처를 확인했다. 일반 표시의 보조 문구가 작고 확대 후에는 글자가 커지지만 내부 스크롤이 필요하다. 확대 가능성을 근거로 11.5px 기준을 임의 완화하지 않는다. 390px의 0.017px 미달만 있는 문제가 아니라 360px에서 10.4px까지 줄어드는 공통 표시 문제다.

## ③ 실제 수정 대상

**제품 수정:** 보충 자료의 `StoryArtView`(src/B31StoryMap.tsx), `.b31-art-frame/.b31-art-scroll/.b31-art-size` 및 그림별 모바일 SVG 글자·배치가 검토 범위다. 1000px에서 desktop으로 고르면서 작아지는 지점과 360px 모바일 축소를 함께 다룬다. 최소 렌더 폭+내부 스크롤 또는 모바일 배치·글자 보강을 선택하되 비율·의미·확대·초점·문서 넘침 보호를 유지해야 한다. 핵심 26단계 애니메이션이나 기본/보충 노출 정책은 이 문제의 수정 범위가 아니다.

**테스트 수정:** 위 STALE_TEST 45개. 먼저 신규 Canonical 보호 계약은 명시적 승인 35개 상태만 수용하면서 ID·다른 필드·다른 보호 소스의 변경을 여전히 검출하게 한다. B2-1/B3-1은 현재 개요·강의·단계·보충 경로를 검증하고, 지도 검사는 실제 메뉴를 연 뒤 기존 대비·경로·기하·패널 계약을 끝까지 실행해야 한다. 단순 timeout 증가·skip·fixture 전체 재생성·무조건 새 해시 채택은 권고하지 않는다.

**Owner 확인:** 원인 분류가 미결인 테스트는 없다. 제품 구현 전 위 360px 두 캡처로 일반 표시의 가독성과 확대 시 내부 스크롤을 검토하고, 원본 SVG 승인 범위를 포함해 렌더 폭/모바일 그림 보강 중 수정 방식을 정한다. 제품 수정 후 실제 강의 환경 가독성을 별도로 확인한다.

## ④ 우선순위

- **P0:** 이번 증거에서 발견 없음. 핵심 진입·8장 이동·현재 메뉴 조작 불가 문제는 확인되지 않았다.
- **P1:** 보충 SVG 일반 표시의 가독성 개선. 작은 화면에서 학습 내용을 읽는 데 영향을 주며 확대가 완화 수단으로 존재한다.
- **P2:** 오래된 테스트 계약 45개 정비. 실제 기능 결함과 구분해 처리하되, 가려진 대비·왕복·콘텐츠 보호 검사를 복구한다. 신규 Canonical guard 정비를 먼저 포함한다.
- **P3:** 추가 항목 없음. 실제 기기·프로젝터 검수는 제품 가독성 변경의 승인 단계에 포함한다.

## ⑤ 후속 작업 제안

1. **Batch A — 승인된 구조와 불변 테스트 계약 정비:** Canonical guard 1개, B2-1 6개, B3-1 5장/노출 16개. 현재 승인 목록·콘텐츠·링크 보호를 유지하고 코드 변경 없이 계약만 정비한다.
2. **Batch B — 보충 SVG 가독성 개선:** 24개 실패의 공통 원인 수정. 기준 >11.5px 유지, 1000/390/360px 및 모든 그림·확대·초점·내부 스크롤·기본 접힘을 재검증한다. 원본 그림 변경이 필요하면 Owner 승인 범위를 먼저 확정한다.
3. **Batch C — 지도/자료 목록 테스트 현행화:** 메뉴 17개·헤더 4개·main-M01 목록 1개. 현 토큰·실제 조작 순서로 바꾸고 잠겨 있던 후속 대비/기하/왕복 검사를 끝까지 실행한다. 추가 결함이 드러나면 별도 제품 수정으로 분리한다.
4. **Batch D — 통합 회귀 재검증:** A~C 통합 후 같은 443개·workers4 조건으로 재실행하고 이름별 비교. 통과 전 전체 회귀 PASS를 선언하지 않는다.

이번 변경 파일은 본 보고서와 이름별 축약 JSON, UI 진단 JSON, 대표 PNG 2장뿐이다. React·CSS·Canonical·콘텐츠·원본 SVG·Playwright spec/설정·fixture·빌드/배포 설정 변경 0건. Git diff --check 통과 후 커밋한다. main 병합·제품 수정·Pages 배포 없음. Draft PR과 Owner 검토로 다음 구현 범위를 확정한다.
