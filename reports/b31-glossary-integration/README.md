# B3-1 용어사전 통합 QA — 2026-10-27

- 작업 브랜치: `feature/b3-1-network-glossary-integration`
- 콘텐츠 기준: `e32f5800f308257c31e853705cebb3456e6c83ea` (최신 원격 콘텐츠 head 확인 후 분기)
- 비교 main: `8e58d328d08fd64faee3c6f51941e4cf8ec19579`
- main 병합·배포 없이 Owner 검수 대기. 승인된 콘텐츠는 유지하며 신규 용어를 카드·지도에 연결하지 않았다.

## 수정 내용과 보호 계약

`playwright/b31-network-foundations.spec.ts`는 기존에 `71b8784`의 파일 목록과 내용에 `data/curated`까지 포함했다. 따라서 승인된 canonical 확장이 실패했고, 기준 커밋에 없던 파일 추가는 감지하지 못했다.

이번에는 다음 두 계약을 분리했다. 기존 기준을 통째로 현재 값으로 교체하지 않았다.

1. **기존 콘텐츠/엔진은 `71b8784` 유지:** B3-1 원고·SVG·미션 지도 데이터·엔진·가이드, B2-1 탐색기, B6-1 지도·스토리 소스.
2. **후속 카드/UI는 `e32f580` 별도 보호:** B31StoryMap 렌더러/CSS, B31LearningPage, b31Foundations 전체. 이들은 과거 기준 커밋에 없거나 승인된 후속 변경이 있는 자산이다.

`data/curated`는 스토리 불변 계약에서 제외하고 공식 용어 검증 및 별도의 523개/기존 ID 보존/미션 연관/생성물 동등성 검사로 검증한다. 보호 경로 전체와 현재 실제 파일 목록을 대조하여 추가·삭제·내용 변경을 모두 감지한다. untracked/ignored 소스도 검사한다. Windows UTF-8 텍스트 CRLF만 LF로 정규화하며 바이너리는 원본 바이트 해시로 비교한다.

공식 Python 검사기가 생성하는 `__pycache__/*.pyc`·`*.pyo`만 런타임 산출물로 제외하고 목록을 기록한다. 같은 폴더의 `.py` 등 소스 추가는 여전히 실패한다. 이 예외는 전체 검사 중 실제 캐시 생성으로 인한 신규 보호 검사 실패 1건을 수정하기 위해 추가했다. 나머지 검사는 건너뛰지 않았다. 임시 Git 저장소를 사용하는 mutation 테스트 **5건**으로 변경/추가/삭제/줄바꿈/바이너리/캐시 경계를 확인했다. 실제 보호 결과는 [protection-contracts.json](protection-contracts.json).

Chrome 확장 검색 안내는 고정 519 대신 로딩된 `terms.length`를 사용한다. 공식 패키징으로 `dist-extension/sidepanel.js`를 갱신했다. 523개 안내와 네 신규 용어/TCP 검색·상세 링크를 확인했으며, 데이터 2개 fixture에서도 안내가 2개로 바뀌는 검사를 추가했다.

## 데이터·빌드

| 검사 | 결과 |
| --- | --- |
| 공식 glossary 검증 | 523 canonical, 46 mission-local, 오류 0·경고 0 |
| 기존 ID 보존 | 519개 모두 유지, 추가 ID 정확히 4개, 중복 없음 |
| 신규 상세/B3-1 연관 | ip-address, private-ip, packet, network-protocol 모두 확인 |
| 기존 TCP/HTTP/포트 M05 연관 | 확인 |
| 웹/확장 glossary 동등성 | 523개 전체 데이터 일치 |
| `npm run build` | PASS, TypeScript·Vite·B2-1 빌드 보호 포함 |
| `npm run package:extension` | PASS, 공식 data build·확장 build·ZIP 검증 |

공식 재생성 후 `data/`, `content/`, `src/data/generated/`의 콘텐츠 기준 대비 차이는 없다. 기존 원고·지도·SVG·테마·검색 UI는 수정하지 않았다. 빌드의 대용량 chunk 안내는 경고이며 실패가 아니다.

확장 패키지: 로컬 `releases/codyssey-openbook-v0.4.2.zip`, 341873 bytes, 루트 파일 9개. SHA-256: `2f05a9d2b4a5dbd3c7d0028e985109ac42be59512245a37e00694b25f6d8ce3e`. ZIP은 저장소에서 제외되는 로컬 산출물이다. [패키지 검증](extension-package.json) · [빌드 로그](build.log) · [확장 빌드 로그](extension-build.log) · [용어 검증 로그](glossary-validation.log).

## 자동 회귀 결과와 main 대조

| 검사 | 실제 실행 결과 |
| --- | --- |
| 최종 Vitest (`npm test -- --maxWorkers=2`) | **452 PASS / 2 FAIL**, 454개 |
| 같은 main Vitest | **447 PASS / 2 FAIL**, 449개, 실패 두 건 동일 |
| 전체 Playwright | **235 PASS / 45 FAIL**, 280개, skip/flaky 0 |
| 보호 검사 수정 후 B3-1 foundations + 통합 재실행 | **15 PASS / 0 FAIL** |
| 남은 Playwright 실패 | **44건 모두 main에서도 같은 파일·테스트명과 원인으로 재현** |
| 신규 미해결 실패 | **0건** (전체 suite를 재실행하여 PASS로 바꿔 보고한 것은 아님) |
| `npm run content:plan` | 기존 S7-B01 0 terms ValueError, main 동일 |

전체 실행의 신규 보호 검사 실패 1건은 Python 캐시 처리 수정 후 단독 및 15건 묶음 재실행에서 통과했다. 최종 코드는 전체 280건 재실행 없이 영향받는 검사를 재실행했다. 원래 전체 실행 수치는 그대로 보존한다.

기존 Vitest 두 건: `src/b21Learning/service.test.tsx`의 타 미션 정의 동일성, `src/missionUI/missionUI.test.tsx`의 B6-1 guide context 기대값. main 최초 고부하 실행에서 adapter timeout 1건도 발생했으나 단독 29건과 최종 전체 main 실행에서 통과했다. 이를 제품 실패나 해결된 변경으로 계산하지 않는다.

기존 Playwright 44건은 요청에 알려진 B2-1 6건 외에도 전체 실행에서 발견한 항목을 포함한다.

| 파일 | 실패 수 | main에서도 확인한 원인 |
| --- | --- | --- |
| b2-1-learning-story.spec.ts | 6 | 기존 정밀 카메라 기대값 |
| b31-content-final-qa.spec.ts | 16 | 화면 테마 라벨이 사이트/강의 선택기 두 개와 일치 |
| mission-concept-map-lanes.spec.ts | 4 | 기존 헤더 배경색 기대값 불일치 |
| mission-concept-map-palette.spec.ts | 17 | 메뉴를 열지 않은 숨겨진 테마 선택기 조작 timeout |
| mission-guide.spec.ts | 1 | 이전 링크 문구 기대값 |

B2-1·B6-1 및 기존 지도/보기 관련 검사를 전체 실행에 포함했다. 실패한 기존 검사를 PASS로 표시하지 않으며, 해당 자산은 보호 계약으로도 변경 없음이 확인된다. 위 기존 문제들은 이번 범위에서 수정하지 않았다.

[대조 요약 및 실패 목록](regression-summary.json) · [전체 Playwright JSON](playwright-full.json) · [최종 15건 재실행](affected-rerun.json) · [최종 Vitest](vitest-final.log) · [main Vitest](baseline-vitest-final.log). `baseline-*.json/log`는 별도 main worktree에서 수행한 재현 기록이다. `new-browser-tests.log`·`vitest-full.log`는 초기 실행 기록이며 최종 결과는 위 재실행을 따른다.

재현 명령: `npm test -- --maxWorkers=2`, `npx playwright test --workers=2`, `npx playwright test playwright/b31-network-foundations.spec.ts playwright/b31-glossary-integration.spec.ts --workers=2`. 브라우저 실행은 `PLAYWRIGHT_CHANNEL=chrome`, 로컬 포트 4186을 사용했다. main 재현은 별도 worktree/포트에서 해당 실패 파일·테스트만 실행했으며 원본 실행 코드를 수정하지 않았다.

## 실제 캡처와 확인 범위

1280×720/390×844 신규 4개 용어 검색→상세→뒤로 가기, 상세 본문의 B3-1 표시, 가로 overflow 없음, JavaScript 오류 없음 확인. 기존 카드→지도→Story·용어사전 복귀는 foundations 검사로 통과했다. 아래 데스크톱/모바일 상세 8장과 확장 캡처를 저장했고 실제 이미지를 확인했다.

| 용어 | PC | 모바일 |
| --- | --- | --- |
| IP 주소 | [1280](1280-ip-address.png) | [390](390-ip-address.png) |
| 사설 IP | [1280](1280-private-ip.png) | [390](390-private-ip.png) |
| 패킷 | [1280](1280-packet.png) | [390](390-packet.png) |
| 네트워크 프로토콜 | [1280](1280-network-protocol.png) | [390](390-network-protocol.png) |

[확장 523개 안내](extension-523.png). 확장은 **빌드된 sidepanel을 Chrome 페이지에서 실행하고 Chrome storage API를 mock**하여 확인했다. 실제 설치된 확장 컨텍스트·Chrome Web Store·실물 모바일·공개 배포 화면 검증은 수행하지 않았다.

Owner 로컬 검수: `http://127.0.0.1:4186/#/terms/ip-address`, `http://127.0.0.1:4186/#/missions/main-M05/story-map`. 서버 재시작 시 `npm run dev -- --host 127.0.0.1 --port 4186`.

변경 파일: `extension/sidepanel.js`, 공식 생성 `dist-extension/sidepanel.js`, `playwright/b31-network-foundations.spec.ts`, 신규 `playwright/b31-glossary-integration.spec.ts`, `scripts/protected_source_contract.mjs`와 그 테스트, 상태 문서와 이 QA 보고서/증거. 기존 캡처 보고서 덮어쓰기는 커밋에서 제외했다. 최종 커밋 SHA와 Push 결과는 완료 응답에서 보고한다.
