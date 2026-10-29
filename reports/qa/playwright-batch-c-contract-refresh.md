# Playwright Batch C — 테스트 계약 현행화

- 기준: `main` / `8b65faa54c8d52c702b718d1f06b02dda9cb63b9`.
- 브랜치: `test/playwright-batch-c-contract-refresh`.
- 검사 대상 구현 커밋: `15baace` (세 Spec). 보고서만 후속 커밋에 추가한다.
- 환경: Windows / PowerShell, Node 24.16.0, Playwright 1.63.0 / Chromium 153.0.8010.12.
- 제품 코드·Canonical·콘텐츠·SVG·Fixture·설정 변경은 0건이다. 테스트 추가·삭제·Skip·Fixme·Timeout 증가도 없다.

## 검사 변경과 보호 조건

### C1 — 테마 메뉴 17건

`playwright/mission-concept-map-palette.spec.ts`의 두 호출 지점에서 같은 파일의 `selectTheme`를 사용한다. 실제 `details` 열림 상태를 읽고 닫혀 있을 때만 summary를 클릭한다. 테마 선택의 표시·활성 상태를 검사하고 `selectOption`으로 선택한다. HTML 테마 반영, Escape 닫기, summary 초점 복귀, URL·선택 노드 보존을 검사한다. 연속 변경 검사는 첫 메뉴를 미리 열어 이미 열린 경우도 실행한다. 강제 클릭이나 JavaScript 값 변경은 없다.

기존 `measure`와 대비·밝기 임계값, 네 너비(1280/1000/390/360), 네 테마, OS Light/Dark, 아홉 지도 상태, 검색·노드 선택·전체 보기·지도 확대·일반망/AWS·요청/응답, 관계선/화살표 색상, OS 팔레트 일치·기하구조 불변·가로 넘침 검사는 유지한다. 메뉴 오류 뒤에 가려져 있던 assertion도 모두 실행됐다.

집중 검사에서 4×4×2×9 = 288개 상태를 측정했다. 최소값은 캔버스 휘도 0.9804(기준 0.95), 노드 글자 5.611:1(4.5), 선택 테두리 4.789:1(3), 강조 관계선 4.851:1(3), 설명 글자 9.997:1(4.5), 활성 버튼 6.167:1(4.5)이다. 연속 테마/OS 전환 검사도 통과했다.

### C2 — 상세 헤더 4건

`playwright/mission-concept-map-lanes.spec.ts`의 과거 흰색 기대값 한 곳을 현재 토큰 검사로 바꿨다. 헤더에서 상속된 `--surface-soft`를 임시 자식 요소에 적용해 브라우저가 계산한 색으로 정규화한 후 실제 헤더 배경과 비교하고 요소를 제거한다. 토큰 존재·불투명 배경·실제 글자 대비 4.5:1 이상도 검사한다.

네 너비 모두 토큰 `#eef5ef`, 배경 `rgb(238, 245, 239)`, 글자 `rgb(24, 36, 31)`, 대비 14.449:1이었다. 색 숫자는 기대값으로 하드코딩하지 않았다. 기존 관계선 관통 방지, 본문 스크롤/헤더 고정·분리, 겹침 방지, isolation, GN14 선택, 스크롤 초기화, 선택 해제·재선택, 닫기·다시 열기, 키보드와 가로 넘침 검사는 유지하고 통과했다.

### C3 — B1-1 학습 자료 1건

`playwright/mission-learning-entry.spec.ts`의 M01 기대값을 승인된 `story → concepts → guide`로 바꿨다. 실제 카드 세 개의 표시·순서·각 링크 한 개·등록 경로 일치·화면 내 중복 없음까지 추가 검사한다. 기대 경로는 `src/missionLearning.ts`를 확인해 독립적으로 명시했다.

다른 미션(M05/M03/M11/preliminary-M03/M13), 제공되지 않는 자료의 링크 없음, B3-1 가이드와 보충 링크 각각 한 번, 나머지 진입·복귀 검사는 유지했다. 세 Spec 집중 검사 40/40 중 기존 실패 대상은 22개이며 나머지 기존 통과 18개도 통과했다.

## 실행과 환경 차이

브라우저 검사는 별도 worktree `%TEMP%\playwright-batch-c-run-8b65faa`에서 실행했다. 과거 추적 보고서·캡처는 원래 작업 트리에서 덮어쓰지 않았다. 실행한 세 Spec이 구현 커밋과 같은 내용임을 확인했다.

```powershell
$env:PYTHONUTF8 = "1"
$env:B31_QA_OUTPUT = Join-Path $env:TEMP "playwright-batch-c-evidence"
$env:PLAYWRIGHT_PORT = "4178"
npx playwright test playwright/mission-concept-map-palette.spec.ts playwright/mission-concept-map-lanes.spec.ts playwright/mission-learning-entry.spec.ts --workers=2 --reporter=json
# 이후 Windows 포트 예약 범위(4113–4212)에 4178이 포함되어 전체 실행 서버 시작이 EACCES로 차단됨.
# 테스트 실행 전 실패이며 설정 파일 변경 없이 환경 변수만 변경.
$env:PLAYWRIGHT_PORT = "5178"
$env:PLAYWRIGHT_JSON_OUTPUT_FILE = Join-Path $env:TEMP "playwright-batch-c-full.json"
npx playwright test --workers=4 --reporter=json
npm test -- --maxWorkers=2 --testTimeout=20000
npm run build
git diff --check
```

단위 테스트 첫 실행은 `PYTHONUTF8`이 빠진 별도 셸에서 CP949 디코딩 오류로 512 PASS / 1 FAIL이었다(`scripts/b31_runtime_validator.test.mjs`). 실패 원인은 기존 Python 스크립트의 UTF-8 JSON 읽기이며 이번 세 Spec 변경과 무관하다. 안내된 `PYTHONUTF8=1`을 적용한 재실행 결과는 아래에 기록한다. 프로젝트 설정이나 Python 코드는 수정하지 않았다.

## 최종 결과

| 검증 영역 | 작업 전 FAIL | 작업 후 FAIL | 현재 PASS |
|---|---:|---:|---:|
| 테마 선택 | 17 | 0 | 17 |
| 상세 패널 헤더 | 4 | 0 | 4 |
| 학습 자료 목록 대상 검사 | 1 | 0 | 1 |
| Batch C 합계 | 22 | 0 | 22 |

| 실행 | 결과 |
|---|---|
| 세 Spec 집중 검사 (`--workers=2`) | 40 PASS / 0 FAIL / 0 SKIP / 0 FLAKY |
| 전체 Playwright (`--workers=4`) | 443 PASS / 0 FAIL / 0 SKIP / 0 FLAKY; 40 Spec, 392.159초 |
| 전체 단위 테스트 (`PYTHONUTF8=1`) | 513/513 PASS, 41 파일, 36.69초 |
| `npm run build` (`PYTHONUTF8=1`) | PASS; Vite 및 B2-1 private build 검사 포함 |
| `git diff --check` | PASS |
| 신규 실패 / 테스트 추가 / 삭제 | 0 / 0 / 0 |
| 제품 / Canonical / 생성 데이터 변경 | 0 / 0 / 0 |

전체 실행은 2026-10-29 09:07:56 KST에 시작했다. Batch B 전체 JSON(421 PASS / 22 FAIL)의 **파일명+테스트명 443개가 이번 전체 결과와 정확히 일치**함을 비교했다. 기존 실패 22개는 모두 PASS로 바뀌고 기존 PASS 421개는 모두 유지됐다. 이전 Batch A 23개와 Batch B 24개도 포함해 통과했다. B1-1/B2-1/B3-1/B6-1 학습 화면과 공통 지도·상세 패널·탐색 검사가 모두 통과했다. 숨겨졌던 후속 assertion에서 추가 기능 결함은 발견되지 않았다.

이름별 비교 대상 22개는 다음과 같다(각각 FAIL → PASS).

- Palette: `{1280,1000,390,360}px {forest,indigo,paper,signal}: bright learning palette, AA text and matching arrows in both OS modes`의 16개 조합.
- Palette: `live theme and OS switches preserve the learning surfaces, selection and world geometry` 1개.
- Header: `{1280,1000,390,360}px detail header stays separate during body scroll and selection changes` 4개.
- Entry: `real learning paths differ by mission and B3-1 guide/supplement appear once` 1개.

원시 증거는 TEMP에 보존했다. 브라우저 캡처·측정 JSON은 별도 worktree의 `reports/`와 `B31_QA_OUTPUT`에 있으며 과거 저장소 증거는 변경하지 않았다. 비교 결과는 `%TEMP%\playwright-batch-c-comparison.json`이다. JSON SHA256:

| `%TEMP%` 파일 | SHA256 |
|---|---|
| `playwright-batch-b-full.json` (기준선) | `9eb176e6f9e09fbc61d3ddfbf903efefe6c573972ab4beb8dc554c428b5321ab` |
| `playwright-batch-c-target-initial.json` (집중) | `cd6122b097ed369afb7d05a38ea3f481f28e5c5f107bdb1fd92fb6fdae9d1aa9` |
| `playwright-batch-c-full.json` (전체) | `ee13cb781fa1a4f7aaee855bc5a0491b8dfbadbd55709f84d4c58aa8fa7781a3` |

잔여 실패는 없다. 최종 통합 QA로 진행할 것을 권고한다. 이 결과는 Windows Chromium 자동 회귀검사이며 실물 기기 사용성이나 공개 Pages 배포 확인을 대신하지 않는다.

## 변경 파일과 Owner Gate

- `playwright/mission-concept-map-palette.spec.ts`: 실제 메뉴 조작 및 상태 보존.
- `playwright/mission-concept-map-lanes.spec.ts`: 디자인 토큰 일치·실제 대비 검사.
- `playwright/mission-learning-entry.spec.ts`: M01 세 자료와 등록 경로·중복 검사.
- `reports/qa/playwright-batch-c-contract-refresh.md`: 실행 결과와 검토 근거.

Draft PR: [#44](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/44).

GPT-6.1 Sol Medium 독립 검토는 `8b65faa..b4309ce`의 변경과 보존된 원시 증거를 읽기 전용으로 확인했고 차단 사항 없음으로 판정했다. 허용된 네 파일, 메뉴의 열림 상태 처리, 기존 임계값·검사 유지, 토큰 일치·대비, M01 자료 경로·중복, 443개 이름 일치·22개 해결·신규 실패 0, 단위 테스트와 빌드 결과를 재확인했다. 전체 테스트는 중복 실행하지 않았다. 이후 변경은 이 검토 기록뿐이다.

main 병합·배포는 수행하지 않았다. 최종 통합 QA와 Owner의 병합·배포 승인은 대기 상태다.
