# B3-1 강의 슬라이드 UX 최종 보완

검증일: 2026-10-28. 대상: `feature/b3-1-slide-flow-restructure`, Draft PR #37. 비교 기준은 기존 head `7f53b94`이며, PR #36 `59b6d22`의 패킷 데이터와 재생 훅은 그대로다. 최종 제품·검사 소스의 SHA-256은 [tested-sources.json](tested-sources.json)에 기록했다. Owner의 최종 검수·병합 승인은 별도다.

## 변경 파일과 이유

| 파일 | 변경 이유 |
| --- | --- |
| `src/B31StoryMap.tsx` | Slide 2·3에서 반복 텍스트 카드를 제거하고 V1·V2를 기본 강의 자료로 표시 |
| `src/b31Foundations/B31Foundations.tsx` | 시각자료를 접이식 확인 문제·강사 해설·용어 링크와 분리. V2의 HTTP/HTTPS 비교·생략 설명은 보충 자료로 보존 |
| `src/b31Foundations/foundations.css` | 기본 화면의 시각자료 간격·글꼴·반응형 배치 보완 |
| `src/b31PacketJourney/PacketJourney.tsx` | 단계 조작부·상태를 묶고, 구성도 아래 현재 패킷·판단표·NAT 변화 배치. 긴 설명은 접이식으로 이동. 넓은 화면은 구성도의 세로 간격만 줄임 |
| `src/b31PacketJourney/packetJourney.css` | 상단 고정 조작부, PC 정보 3열, 모바일 2열 버튼·세로 읽기·판단표 우선 배치 |
| `src/b31StoryMap.css` | 슬라이드 제목과 본문 앞의 반복 여백 축소 |
| `playwright/b31-network-foundations.spec.ts` | V2의 새 표시 위치를 검사. 이번에 수정하도록 허용된 두 UI 파일만 기존 불변 계약에서 제외하고 데이터·재생 훅·원고·지도·canonical 보호는 유지 |
| `playwright/b31-slide-ux.spec.ts` | 지정된 3개 뷰포트 × Light/Dark에서 기본 V1/V2, 26단계, PC 동시 가시성, 모바일 고정 조작부, 8장 넘침·버튼 크기 검증 |
| `scripts/qa_b31_slide_ux.mjs` | 전후 동일 상태의 실제 뷰포트 캡처와 치수 기록 재현 |
| 이 보고서와 캡처·실행 로그 | Owner 검수와 기존 실패 구분을 위한 근거 |

8장 순서, 기존 Scene URL, 개념지도·학습가이드·용어 링크를 유지했다. `src/b31PacketJourney/data.ts`와 `usePacketPlayer.ts`, 원본 SVG, 개념지도 데이터, 일반 용어사전 데이터, 평가용 B3-1 저장소, AWS, 배포 워크플로는 수정하지 않았다. 공통 PacketJourney를 사용하므로 기업망 보강 가이드에도 같은 표시 개선이 적용된다.

## 화면 QA

Chromium, 실제 viewport 1280×720 / 1024×768 / 390×844, Light/Dark. 전후 PNG 64장은 파일 자체의 해상도가 지정한 viewport와 일치하며, 잘라내기·축소·fullPage 캡처를 사용하지 않았다. 최종 after는 로컬 프로덕션 빌드의 Vite preview에서 캡처했다. before는 별도 detached worktree의 `7f53b94`를 실행했다.

- Slide 2·3은 접이식 자료를 열지 않아도 V1·V2가 표시된다. 상세 해설·확인 문제·용어 링크는 접힌 상태로 남는다.
- PC는 단계 조작부를 화면 상단에 맞춘 강의 위치에서 구성도와 현재 패킷·판단표·NAT 패널이 함께 보인다. 전체 페이지를 한 화면에 고정하는 방식은 아니다.
- 모바일은 기존 세로 구성도와 14px 노드 글자를 유지한다. 판단표·현재 패킷을 읽을 때도 단계 버튼과 현재 상태가 위에 남는다. 버튼은 최소 44px이며 키보드 초점도 확인했다.
- 8장 전체 가로 넘침을 확인하고, 구성도 확대 시의 내부 스크롤을 유지했다. 자동 재생·일시정지·재개·26단계 전체·이전/재시작·NAT·요청 R2/응답 R3·Scene 이탈 정리·reduced motion도 검증했다.

NAT 단계(17/26), 조작부 상단 정렬, Light/Dark 동일 치수:

| viewport | 전체 문서 높이 전 → 후 | 현재 정보 패널 하단 전 → 후 | 실제 화면 높이 |
| --- | --- | --- | --- |
| 1280×720 | 2419 → 1750px | 1072 → 684px | 720px |
| 1024×768 | 2778 → 1737px | 1446 → 684px | 768px |

[before 치수](before/metrics.json) · [after 치수](after/metrics.json)

## 개선 전후 대표 화면

| 대상 | 개선 전 | 개선 후 |
| --- | --- | --- |
| Slide 2 · 1280×720 Light | [기본 화면](before/1280x720-light-slide-network.png) | [기본 화면](after/1280x720-light-slide-network.png) · [V1 전체 읽기 위치](after/1280x720-light-slide-network-visual.png) |
| Slide 3 · 1024×768 Dark | [기본 화면](before/1024x768-dark-slide-packet.png) | [기본 화면](after/1024x768-dark-slide-packet.png) · [V2 전체 읽기 위치](after/1024x768-dark-slide-packet-visual.png) |
| Slide 5 · 1280×720 Light, NAT | [17/26](before/1280x720-light-scene-02.png) | [17/26](after/1280x720-light-scene-02.png) |
| Slide 5 · 1024×768 Dark, 라우팅 | [22/26](before/1024x768-dark-scene-02-routing.png) | [22/26](after/1024x768-dark-scene-02-routing.png) |
| Slide 5 · 390×844 Dark, 판단표 | [17/26](before/390x844-dark-scene-02-decision.png) | [17/26](after/390x844-dark-scene-02-decision.png) |

## 테스트와 빌드

- `PYTHONUTF8=1 npm test -- --maxWorkers=2 --testTimeout=20000`: 41개 파일, 509개 PASS. 기본 5초 제한에서는 기존 개념지도 `edge corridors > all` 검사 1건이 동시 실행 중 timeout(508 PASS/1 FAIL)하여, 코드 수정 없이 실행 부하와 시간 제한을 조정해 전체 재검증했다.
- `PYTHONUTF8=1 npm run build`: PASS. TypeScript·데이터 검증·Vite 프로덕션 빌드·B2-1 산출물 검사 포함. 기존 Vite 청크 크기 경고는 유지된다.
- 개발 화면 관련 브라우저 검사: 37 PASS.
- 최종 프로덕션 관련 브라우저 검사: 37 PASS. `PLAYWRIGHT_PORT=4175 B31_QA_OUTPUT=/tmp/b31-production-qa npx playwright test playwright/b31-slide-ux.spec.ts playwright/b31-slide-flow.spec.ts playwright/b31-packet-journey-story.spec.ts playwright/b31-packet-journey.spec.ts playwright/b31-network-foundations.spec.ts --workers=2`.
- 전체 Playwright: **375 PASS / 68 FAIL / 0 skip**, 443개, `B31_QA_OUTPUT=/tmp/b31-full-qa npx playwright test --workers=4 --reporter=json`. 전체 PASS로 판정하지 않는다. [전체 결과·실패 메시지](regression-summary.json).
- 실행 근거: [단위 테스트](unit.log) · [최초 기본 제한 timeout](unit-initial.log) · [프로덕션 빌드](build.log) · [프로덕션 브라우저](production.log) · [개발 화면 검사](focused-development.log).
- `git diff --check`: PASS.

전체 실패 68개를 수정 전 `7f53b94`의 별도 worktree에서 **같은 테스트·같은 기본 timeout**으로 다시 실행했다. 68개 전부 동일한 테스트에서 실패했고 새 실패 이름은 0개다. [수정 전 대조 결과](baseline-comparison.json). 이는 전체 회귀가 통과했다는 뜻은 아니며, 기존 실패의 수정·테스트 계약 갱신은 별도 판단이 필요하다.

| 전체 회귀의 실패 분류 | 수 | 수정 전 재현 |
| --- | ---: | --- |
| 기존 B2-1 학습 스토리 요소·진입 검사 | 6 | 6 |
| 접이식 원본 SVG 최소 글자 크기: 1000px 11.4 / 390px 11.483 / 360px 10.4, 기대값 >11.5 | 24 | 24 |
| 개념지도 패널 헤더의 기존 색 기대값 | 4 | 4 |
| 개념지도 숨겨진 테마 메뉴 조작 timeout | 17 | 17 |
| 미션별 학습 자료 목록의 이전 기대값 | 1 | 1 |
| 5장 스토리를 기대하는 이전 공통 UI 검사 | 8 | 8 |
| 정적 SVG가 기본 노출된다고 기대하는 이전 공통 UI 검사 | 8 | 8 |

재현: 기준 커밋 또는 최종 코드를 별도 포트에서 실행하고 `B31_UX_BASE=http://127.0.0.1:<port> node scripts/qa_b31_slide_ux.mjs before` 또는 `after`. 기능 검사 5개 파일은 `b31-slide-ux`, `b31-slide-flow`, `b31-packet-journey-story`, `b31-packet-journey`, `b31-network-foundations`다.

## 남은 제약과 Owner 확인

- Slide 2·3의 전체 설명, 모바일 구성도, 보충 자료에는 세로 스크롤이 남는다. PC도 진입 화면에서 단계 조작부까지 이동한 뒤 시연한다.
- 보충 SVG의 작은 글자와 기존 전체 회귀 실패를 이번 범위의 통과 결과와 구분한다. 실물 프로젝터·실물 모바일, Safari/Firefox, 스크린리더의 실제 낭독은 미검증이다.
- Owner는 Slide 2·3의 기본 자료, Slide 5의 17/26 NAT·22/26 응답 라우팅, 모바일 고정 조작부를 실제 강의 환경에서 확인하고, 별도 기록된 기존 실패의 처리와 최종 병합 여부를 판단한다.
- PR #36·#37은 Draft·미병합 상태로 유지하며 GitHub Pages 배포를 진행하지 않는다.
