# Playwright Batch B — B3-1 보충 SVG 가독성 개선

**Batch B 24/24 해결, 잔여 0. 전체 443개: 421 PASS / 22 FAIL / SKIP 0 / FLAKY 0, 신규 실패 0건. 단위 513/513·빌드 PASS. 원본 SVG·스토리·패킷 데이터 변경 0건. Owner 실제 PC·모바일 시각 검수 대기이며 전체Playwright PASS는 아니다.**

| 항목 | Batch A 후 | Batch B 후 |
| --- | ---: | ---: |
| Playwright 전체 | 443 | 443 |
| PASS | 397 | 421 |
| FAIL | 46 | 22 |
| Batch B 실패 | 24 | 0 |
| Batch C 실패 | 22 | 22 |
| 신규 실패 | — | 0 |

## 기준과 수정 원리

- 기준 main: `8ae5dd43d3be5ee9404a179f5b3e4e7c4aec9710`. 시작 시 원격 일치·작업 트리 깨끗함 확인.
- 브랜치: `fix/b31-supplement-svg-readability`.
- 검증 소스 커밋: `2c6811264143206fb8e409fc2fbaa5915aa1418c`. 이후 QA 문서·증거만 추가한다. 별도 작업 트리의 제품/회귀 파일 3개가 이 커밋과 LF 정규화 후 동일함을 확인했다.

컨테이너에 맞춘 전체 축소가 원인이었다. 원본 SVG를 바꾸지 않고 실제 computed font-size와 viewBox로 읽기 하한 **14 CSS px**에 필요한 폭을 계산한다. 기존 `minimumText > 11.5` 검사는 그대로이며 14px 목표도 추가 검사한다.

```text
minimumWidth = ceil(viewBox.width × 14 / 최소 computed font-size)
renderWidth = max(기존 표시 폭, minimumWidth) × zoom
```

Desktop/Mobile 선택은 원래의 실제 컨테이너 폭과 904/960px breakpoint를 사용한다. 렌더 폭이 커져도 원본 선택의 기준은 바뀌지 않는다. 이미 읽을 수 있는 1280px 배치는 확대하지 않았다. 대표 1280 PNG와 정상 표시 계측 객체는 전후 동일하다.

| 그림 / 종류 | 실제 viewBox | 최소 원본 글자 | 최소 렌더 폭 |
| --- | --- | ---: | ---: |
| scene-01 / Desktop | 1280×1096 | 16 | 1120px |
| scene-01 / Mobile | 360×2410 | 13 | 388px |
| scene-02 / Desktop | 1280×1272 | 16 | 1120px |
| scene-02 / Mobile | 360×2626 | 13 | 388px |
| scene-03a / Desktop | 1280×1300 | 16 | 1120px |
| scene-03a / Mobile | 360×2546 | 14 | 360px |
| scene-03b / Desktop | 1280×1112 | 16 | 1120px |
| scene-03b / Mobile | 360×1688 | 14 | 360px |

변경 파일:

1. `src/B31StoryMap.tsx`: 원본 글자 크기 측정·최소 렌더 폭 적용. overflow 때만 안내·region·tabIndex=0·aria-describedby 제공. 일반 표시와 모달에 같은 계산 적용.
2. `src/b31StoryMap.css`: 초점선·안내 스타일. 가로 이동은 내부에 유지하고 세로 터치/휠은 페이지로 이어지도록 x:contain / y:auto 분리.
3. `playwright/b31-story-map.spec.ts`: 기존 36개 test와 >11.5px·비율·넘침·레이아웃·확대 계약 유지. 14px 목표, overflow의 접근성, 실제 ArrowRight/Left와 세로 휠 검증 추가.
4. 본 보고서와 증거 폴더: 재현용 capture.cjs, 계측 JSON 3개, 실제 viewport PNG 18장. 기존 fixture·과거 캡처는 덮어쓰지 않았다.

## 실제 글자 크기

각 폭의 4종 SVG·4테마·2 OS 모드 중 최소값이다. [128개 Playwright 실측](playwright-batch-b-svg-readability-evidence/measurements.json)은 32조합×4그림이며 모두 14px 이상(허용 오차 0.001), 비율 오차<0.002, 페이지 가로 넘침 없음이다.

| 화면 폭 | 기존 최소(px) | 수정 후 최소(px) | 결과 |
| --- | ---: | ---: | --- |
| 1280px | 14.900 | 14.900 | PASS |
| 1000px | 11.400 | 14.000 | PASS |
| 390px | 11.483 | 14.000 | PASS |
| 360px | 10.400 | 14.000 | PASS |

4종별 Before → After, CSS px:

| 폭 | scene-01 | scene-02 | scene-03a | scene-03b |
| --- | ---: | ---: | ---: | ---: |
| 1280px | 14.900 → 14.900 | 14.900 → 14.900 | 14.900 → 14.900 | 14.900 → 14.900 |
| 1000px | 11.400 → 14.000 | 11.400 → 14.000 | 16.333 → 16.333 | 16.333 → 16.333 |
| 390px | 11.483 → 14.011 | 11.483 → 14.011 | 12.367 → 14.000 | 12.367 → 14.000 |
| 360px | 10.400 → 14.011 | 10.400 → 14.011 | 11.200 → 14.000 | 11.200 → 14.000 |

## Owner용 Before / After

모두 실제 viewport 캡처다. 전체 페이지 축소나 이미지 후처리를 하지 않았으며 PNG 치수도 확인했다. 그림 상단을 viewport의 120px 지점에 맞춰 비교했다.

| viewport | 장면 | 개선 전 | 개선 후 |
| --- | --- | --- | --- |
| 1280×900 | scene-01 | [Before](playwright-batch-b-svg-readability-evidence/before/1280-scene-01.png) | [After](playwright-batch-b-svg-readability-evidence/after/1280-scene-01.png) |
| 1000×900 | scene-02 | [Before](playwright-batch-b-svg-readability-evidence/before/1000-scene-02.png) | [After](playwright-batch-b-svg-readability-evidence/after/1000-scene-02.png) |
| 390×844 | scene-03a | [Before](playwright-batch-b-svg-readability-evidence/before/390-scene-03a.png) | [After](playwright-batch-b-svg-readability-evidence/after/390-scene-03a.png) |
| 360×844 | scene-01 | [Before](playwright-batch-b-svg-readability-evidence/before/360-scene-01.png) | [After](playwright-batch-b-svg-readability-evidence/after/360-scene-01.png) |
| 360×844 | scene-02 | [Before](playwright-batch-b-svg-readability-evidence/before/360-scene-02.png) | [After](playwright-batch-b-svg-readability-evidence/after/360-scene-02.png) |
| 360×844 | scene-03b | [Before](playwright-batch-b-svg-readability-evidence/before/360-scene-03b.png) | [After](playwright-batch-b-svg-readability-evidence/after/360-scene-03b.png) |

스크롤 열은 **보이는 영역 / 전체 스크롤 폭**이며 숫자는 Before → After다.

| 화면 / 장면 | SVG 표시 폭(px) | 스크롤 영역/전체 폭(px) | 최소 글자(px) | 페이지 가로 넘침 |
| --- | ---: | --- | ---: | --- |
| 1280px / scene-01 | 1192 → 1192 | 1192/1192 → 1192/1192 | 14.900 → 14.900 | 없음 → 없음 |
| 1000px / scene-02 | 912 → 1120 | 912/912 → 912/1120 | 11.400 → 14.000 | 없음 → 없음 |
| 390px / scene-03a | 318 → 360 | 318/318 → 318/360 | 12.367 → 14.000 | 없음 → 없음 |
| 360px / scene-01 | 288 → 388 | 288/288 → 288/388 | 10.400 → 14.011 | 없음 → 없음 |
| 360px / scene-02 | 288 → 388 | 288/288 → 288/388 | 10.400 → 14.011 | 없음 → 없음 |
| 360px / scene-03b | 288 → 360 | 288/288 → 288/360 | 11.200 → 14.000 | 없음 → 없음 |

360px 일반망 그림은 내부 100px, AWS그림은 72px 이동이 필요하다.1000px 일반망 그림은 208px 이동이 필요하다. 글자를 읽을 크기로 유지하기 위한 내부 이동이며 페이지 전체 가로 스크롤은 없다. 모든 그림의 오른쪽 끝 접근도 검증했다.

### 360px 모달과 요청/응답 강조

| 배율 | Before: 폭 / 최소 글자 | After: 폭 / 최소 글자 | After: 스크롤 영역/전체 폭 |
| --- | ---: | ---: | --- |
| 100% | 324 / 11.700 | 388 / 14.011 | 324/388 |
| 125% | 405 / 14.625 | 485 / 17.514 | 324/485 |
| 150% | 486 / 17.550 | 582 / 21.017 | 324/582 |
| 맞춤(100%) | 324 / 11.700 | 388 / 14.011 | 324/388 |

- 100%: [Before](playwright-batch-b-svg-readability-evidence/before/360-scene-01-modal-100.png) · [After](playwright-batch-b-svg-readability-evidence/after/360-scene-01-modal-100.png)
- 125%: [Before](playwright-batch-b-svg-readability-evidence/before/360-scene-01-modal-125.png) · [After](playwright-batch-b-svg-readability-evidence/after/360-scene-01-modal-125.png)
- scene-02: [요청 강조](playwright-batch-b-svg-readability-evidence/after/360-scene-02-request.png) · [응답 강조](playwright-batch-b-svg-readability-evidence/after/360-scene-02-response.png)

맞춤은 100%의 읽기 가능한 기본 크기로 복원한다. 좁은 화면에서 그림 전체를 작게 줄이지 않으므로 내부 이동이 남는다.125/150% 확대·축소·맞춤·Escape 닫기·원래 버튼으로 초점 복귀를 확인했다. data-flow R1/A1은 요청 강조 시 0.12/1, 응답 강조 시 1/0.12다.

## 스크롤·접근성과 기존 기능 보호

[Before 16개 계측](playwright-batch-b-svg-readability-evidence/before/metrics.json) · [After 16개 계측](playwright-batch-b-svg-readability-evidence/after/metrics.json).

- 4종 보충 자료의 기본 접힘·펼치기·다시 접기 유지.
- overflow 때만 안내·이름 있는 region·설명 연결·Tab 초점·초점선 제공.
- 실제 ArrowRight/ArrowLeft, 양/음 가로 wheel, Chrome CDP touch 양방향 swipe로 이동하고 왼쪽 복귀 확인. 오른쪽 끝에도 접근.
- 모바일 8개 경우(390/360px×4그림) 세로 touch 후 페이지 225px 이동. 기존 양축 contain이 세로 이동을 차단해 x/y를 분리했고 세로 휠 회귀도 추가했다.
- 원본 경로·문구·비율·SVG 선택·요청/응답 식별자 보존. pageerror 0. 물리 휴대전화·프로젝터·Safari/Firefox·스크린리더는 미검증으로 Owner 검수 또는 별도 환경 확인 대상이다.

기준 Before와 수정 After의 별도 Vite 서버에서 재현한다. 해당 서버는 각각 기준/검증 소스로 실행한다.

```powershell
$env:QA_BASE = "http://127.0.0.1:4179" # Before: 8ae5dd4
node reports/qa/playwright-batch-b-svg-readability-evidence/capture.cjs before
$env:QA_BASE = "http://127.0.0.1:4180" # After: 검증 소스
node reports/qa/playwright-batch-b-svg-readability-evidence/capture.cjs after
```

원본 SVG 8개·스토리·패킷 data/usePacketPlayer·Canonical 523개·개념지도·공통 route·설정·기존 fixture 변경 0건. 브라우저 검사는 별도 작업 트리와 TEMP 출력을 사용해 기존 QA 증거를 보존했다.

## 최종 실행 결과

Windows/PowerShell, Node24.16.0·npm11.13.0·Python3.14.6·Playwright1.63.0·Chromium153.0.8010.12 headless. 기존 설정의 Vite 개발 서버 127.0.0.1:4178 사용. 기존 timeout·retries·공통 설정 변경 없음.

| 검사 | 결과 |
| --- | --- |
| 핵심 b31-story-map Spec, workers2 | 36/36 PASS |
| 관련 network-foundations / mission-ui-v11 / mission-story-ui-v12, workers2 | 27/27 PASS |
| 전체 443개, workers4 | 421 PASS / 22 FAIL, SKIP 0 / reporter FLAKY 0, 종료 코드 1 |
| 단위 테스트 | 41개 파일, 513/513 PASS |
| 웹 빌드 | PASS: TypeScript·Vite·B2-1 산출물 검사, 기존 청크 크기 경고 유지 |
| git diff --check | PASS |

전체 시작 2026-10-29T00:07:59.366+09:00 (Asia/Seoul), 소요 729.829초,40개 Spec 파일. UTF-8 JSON reporter 원본은 `%TEMP%/playwright-batch-b-full.json`에 보존했다. SHA256 `9eb176e6f9e09fbc61d3ddfbf903efefe6c573972ab4beb8dc554c428b5321ab`. 이름별 대조는 `%TEMP%/playwright-batch-b-comparison.json`. 대량 결과JSON·trace·기존Spec의 캡처는 커밋하지 않았다.

```powershell
$env:PYTHONUTF8 = "1"
$env:PLAYWRIGHT_PORT = "4178"
$env:B31_QA_OUTPUT = Join-Path $env:TEMP "playwright-batch-b-evidence"
npx playwright test playwright/b31-story-map.spec.ts --workers=2 --reporter=json
npx playwright test playwright/b31-network-foundations.spec.ts playwright/mission-ui-v11.spec.ts playwright/mission-story-ui-v12.spec.ts --workers=2 --reporter=json
$env:PLAYWRIGHT_JSON_OUTPUT_FILE = Join-Path $env:TEMP "playwright-batch-b-full.json"
npx playwright test --workers=4 --reporter=json
npm test -- --maxWorkers=2 --testTimeout=20000
npm run build
git diff --check
```

1000/390/360px × Forest/Indigo/Paper/Signal × Light/Dark의 `readable responsive scenes and lecture enlargement` 24개 이름이 동일한 검사가 모두PASS이며,1280px8개 및 기존 통합 4개를 포함해 핵심Spec 36개 전체PASS다. 첫 보완 뒤 세로 터치 차단을 발견해 최종 x/y정책과 회귀 검사를 반영했고, 최종 소스로 핵심·관련·전체 검사를 다시 실행했다. 조건 완화·skip·test 삭제·fixture 갱신으로 수를 맞추지 않았다.

8장 이동·지도/용어 왕복·Light/Dark 강의 화면·26단계 패킷 여행·요청/응답 강조·확대·초점 복귀 관련 기존 검사는 최종 전체 실행에서도 통과했다. 그림 원본 8개·data/usePacketPlayer·Canonical·스토리·지도·route·설정·기존fixture는 기준과 동일하다.

잔여 22개는 감사/Batch A에 있던 동일 이름의 Batch C 실패다. 이전 실패 목록 46개 중 빠진 테스트 0, 해결 24, 신규 0으로 대조했다. 최종 전체 실행에서 관측된 신규 실패는 0건이다.

| Spec | 잔여 실패 테스트 이름 |
| --- | --- |
| `mission-concept-map-lanes.spec.ts` | 1280px detail header stays separate during body scroll and selection changes |
| `mission-concept-map-lanes.spec.ts` | 1000px detail header stays separate during body scroll and selection changes |
| `mission-concept-map-lanes.spec.ts` | 390px detail header stays separate during body scroll and selection changes |
| `mission-concept-map-lanes.spec.ts` | 360px detail header stays separate during body scroll and selection changes |
| `mission-concept-map-palette.spec.ts` | 1280px forest: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 1280px indigo: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 1280px paper: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 1280px signal: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 1000px forest: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 1000px indigo: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 1000px paper: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 1000px signal: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 390px forest: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 390px indigo: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 390px paper: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 390px signal: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 360px forest: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 360px indigo: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 360px paper: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | 360px signal: bright learning palette, AA text and matching arrows in both OS modes |
| `mission-concept-map-palette.spec.ts` | live theme and OS switches preserve the learning surfaces, selection and world geometry |
| `mission-learning-entry.spec.ts` | real learning paths differ by mission and B3-1 guide/supplement appear once |

**OWNER GATE: READY_FOR_VISUAL_REVIEW.** GPT 독립 검토의 코드·비교 화면 판정은 차단 사항 없음이며, 최종 결과 대조를 포함해 검토했다. Owner가 위 Before/After 링크를 실제 PC·모바일에서 확인하고 승인하기 전에는 main 병합·GitHub Pages 배포를 진행하지 않는다. Batch C 22건 정비는 별도 범위로 남긴다.

## 독립 검토와 Owner Gate

GPT-6.1 Sol Medium 별도 검토자가 코드·보호 범위와 실제 PNG를 읽기 전용 검토했다. 제안된 14px 회귀 보호와 반대 방향 입력 검증을 반영했다. 세로 스크롤 수정까지 재검토해 차단 사항 없음으로 확인했다. 전체 결과는 아래 실제 실행 근거로 별도 판정한다.

Owner 경로: B3-1 강의→Scene 선택→보충 자료 펼치기→내부 좌우 이동→그림 확대하기→100/125/150%·맞춤→Escape. PC에서는 1280 기존 배치와 1000px 내부 이동을, 실제 모바일에서는 360/390px 글자·가로/세로 터치·초점·확대 조작을 확인한다. **Owner 실제 화면 승인 전 main 병합·GitHub Pages 배포는 하지 않는다.**


### Owner 실제 PC·모바일 검수

이 브랜치를 사용한 로컬 미리보기에서 확인한다. 아래 명령은 Owner가 검수할 때 실행하는 예시이며 배포가 아니다.

```powershell
git switch fix/b31-supplement-svg-readability
npx vite --host 0.0.0.0 --port 4178 --strictPort
```

PC: `http://localhost:4178/#/missions/main-M05/story-map?scene=scene-01`. 같은 네트워크의 휴대폰에서는 localhost 대신 PC의 LAN 주소를 사용한다. 비교표의 scene-02/scene-03a/scene-03b도 같은 방식으로 직접 열 수 있다. 각 보충 자료를 펼치고 좌우·세로 이동, 확대와 닫기를 확인한다.
