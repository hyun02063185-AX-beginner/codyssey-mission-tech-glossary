# B2-1 Story React Integration U3 — 결과 보고

검증일: 2026-10-24 (Asia/Seoul). Windows PowerShell / `npm.cmd` / 설치된 Chrome 155.0.8059.85, headless 실행.

## 커밋과 작업 위치

- 저장소: `hyun02063185-AX-beginner/codyssey-mission-tech-glossary`
- 브랜치: `content/b2-1-story-map-foundation`
- 작업 폴더: `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`
- 기준: `5e910b625098a6820c7898e8ef78c5d49ce05955`
- U3-A: `b03b1d6f6175a63df361de19df8bcf408bed0314` — 별도 검증·Clean 체크포인트 후 U3-B 시작. [상세 기록](b21-u3-a-verification.md).
- U3-B: 이 보고서가 포함된 후속 로컬 커밋. 최종 응답에 실제 SHA를 별도로 보고한다.
- Push·병합·배포는 수행하지 않는다. 작업 종료 시 해당 worktree와 원래 주 작업 폴더의 Clean 상태를 확인한다.

## U3-A — Windows Foundation 복구

26개 초기 수정 파일은 HEAD와 바이트가 같았으며 콘텐츠 수정이 없었다. 명시한 경로만 검증 후 체크아웃 상태로 복원했다. 지정 브랜치의 기존 worktree는 기준까지 fast-forward했다. 원격 지정 브랜치도 fetch 당시 기준 SHA와 같았다.

Foundation CLI와 브라우저 SHA 검사가 CRLF를 LF로만 정규화한다. JSON 스냅샷 비교와 승인 revision 대조도 같은 규칙을 사용한다. 공백·bare CR·추가 줄·문구·그림·장면 ID 차이를 허용하지 않는다. 승인 SHA-256·sourceRevision·storyIntegrity.json 내용은 불변이다. `--write`는 실행하지 않았다. `.gitattributes`는 B21 승인 텍스트에만 범위를 제한했다.

## U3-B — 구현

- `routing/storyRoute.ts`: 순수 주소 파서·정규화·인접 단계 계산. 01~08 지원, 05/06 의미 ID, 나머지 숫자 주소. 기존 16개/13개 숫자 대응 보존. 잘못된 단계는 유효한 장면의 첫 단계로 복구하며 안내한다. 중복·미등록 키, 잘못된 복귀 값과 외부 URL은 제거한다.
- 비공개 HashRouter 어댑터가 URL을 위치의 기준으로 사용한다. U2 컴포넌트는 선택적 제어 인터페이스를 받으며 기존 state-only 진입도 유지한다.
- 이전·다음·방향키·직접 그림 조작은 REPLACE, 목차와 지도 복습은 PUSH, 주소 정규화는 REPLACE다. 복습 복귀는 URL의 검증된 Scene 08 단계로 고정 주소 REPLACE한다. `navigate(-1)`이나 직접 `history.state` 덮어쓰기를 사용하지 않는다.
- URL의 `back`으로 새로고침 후 복귀 위치를 보존하고, Router의 사용자 state에 복습 버튼 초점을 보존한다. Router 전환 완료까지 초점 이동을 기다린다.
- 답 공개 상태는 현재 Router 항목에만 속한다. 위치 변경 시 이전 단계의 답이 새 단계에 노출되지 않는다.
- `presenterChannel.ts`: 투영 창만 상태를 발행하고 발표자 창은 명령을 요청한다. 세션별 BroadcastChannel, 메시지 검사·요청 ID 중복 제거, hello/heartbeat/ack, 연결 종료 감지·재연결을 사용한다.
- 발표자 창은 승인된 U1 데이터의 대본·기대 답·오답·정확성 주의·다음 단계와 조작을 표시한다. 대본이 없는 단계에는 승인된 기대 답만 표시하며 새 교육 문구를 만들지 않는다. 투영 화면의 강사 노트 서랍은 기존의 명시적 조작으로만 연다.
- 팝업 차단·동기화 미지원·창 종료에는 안내와 기존 노트 서랍 대안을 제공한다. 투영 창 새로고침 후에도 연결 종료 안내가 동작한다.
- 모바일 답 공개 초점 이동을 승인 HTML의 기본 focus 동작에 맞춰 스크롤 위치까지 일치시켰다. U2 화면 디자인과 교육 데이터는 유지한다.
- Preview 기본은 `v3 React 강의`. Foundation 9단위·v3 8장면·Router·1280/390/360 선택을 유지한다. 공개 라우트는 교체하지 않았다.

실행:

```powershell
npm.cmd run b21:preview
```

기존 U2: `http://127.0.0.1:4179/?view=v3&scene=05&step=iterable`

U3: `http://127.0.0.1:4179/?view=v3-router#/missions/main-M03/story?scene=05&step=iterable&back=6`

`발표자 창` 버튼으로 별도 창을 연다. 발표자 주소의 hash에는 `view=presenter`를 사용하고, 외부 Preview query의 `sync` 토큰으로 해당 투영 세션과 연결한다. 이 토큰은 공개 route 계약에 추가하지 않았다.

## 검사 결과

| 검사 | 결과 | 근거 |
| --- | --- | --- |
| `npm.cmd run b21:validate` | PASS | Foundation 9원고·16 SVG·섹션·활동·참조 |
| `npm.cmd run b21:v3-validate` | PASS | 승인 8장면·128단계·legacy 16/13 |
| `npm.cmd run b21:eol-check` | PASS | U3-A에서 실제 26파일 LF/CRLF 변환 후 CLI 비교, 원래 바이트 복원 |
| Foundation LF/CRLF 회귀 | PASS | 승인 원고/SVG 전체 LF·CRLF·혼합 허용, 공백·bare CR 거부 |
| `npm.cmd test` | PASS | 19파일·238개 테스트 |
| `npm.cmd run build` | PASS | 공개 빌드와 Foundation 별도 빌드 검증; 기존 큰 청크 경고는 남음 |
| `npm.cmd run b21:browser-check` | PASS | 실제 Chrome 63검사, Foundation 레이아웃·그림·모달·초점 |
| 실제 Foundation HTTP Preview | PASS | 원고·SVG 정상 표시 |
| `npm.cmd run b21:v3-parity` | PASS | 128단계 × 1280/390/360 = 384화면, 5,269검사, 오류 0 |
| 시각 동일성 | PASS | 최대 화면 픽셀 차이 0.000489584, 허용치 0.001 이하; 답 공개 이미지도 비교·저장 |
| `npm.cmd run b21:router-check` | PASS | 설치 Chrome 155.0.8059.85, 209검사, 오류 0 |
| 기존 독립 HTML QA | **FAIL** | 5,010검사 진행, 1280·390 PASS, 360의 Scene 04 첫 단계 가로폭 362px |
| 기존 HTML의 나머지 360px 검사 | SKIP | 기존 harness가 첫 실패에서 중단 |
| macOS 네이티브 실행 | SKIP | Windows 호스트. LF/CRLF 입력 회귀로 텍스트 호환성 검사 |
| 실제 다중 모니터 투영·Owner 육안 승인 | SKIP | 자동 브라우저 검증과 구분 |

기존 v3 테스트는 이미 CRLF인 fixture에 LF→CRLF를 다시 적용해 CRCRLF를 만드는 결함이 있었다. 테스트 입력을 먼저 LF로 만들도록 수정했다. 실제 validator와 승인 데이터는 이 문제 때문에 변경하지 않았다.

독립 HTML QA는 보호된 원본 캡처를 덮어쓰지 않도록 임시 사본에서 실행했다. 사본 텍스트를 LF로 준비하고, 기존 QA의 Windows 스크린샷 경로 `.pathname` 문제만 사본에서 `fileURLToPath`로 바꿨다. 원본 HTML·지도·QA 파일은 불변이다. 실제 ledger 기준 소스 대조 8개도 PASS했다. 360px 넘침은 변경하지 않은 기존 HTML에서 나온 결과이며, U3 React의 384화면 검사는 모두 PASS했다. 실패를 숨기거나 임계값을 완화하지 않았다.

## 사용자 시나리오

| 시나리오 | 결과 |
| --- | --- |
| 전체 128단계 다음 이동·장면 경계·끝 제한 | PASS |
| 05/06 의미 ID와 legacy 29개 정규화 | PASS |
| 잘못된 단계 21종 실제 Chrome·22종 순수 함수 | PASS — 장면 유지·첫 단계·안내·정규 URL |
| 새로고침 후 단계·복귀 위치 유지 | PASS |
| Scene 08 6단계 → Scene 05 Iterable 복습 | PASS — PUSH·`back=6` |
| 복습 중 새로고침·이동 후 지도 복귀 | PASS — 고정 주소 REPLACE·원래 복습 버튼 초점 |
| 뒤로/앞으로 3회 반복 | PASS — 지도 6단계/복습 현재 단계 보존 |
| 목차·키보드·노트 닫기·초점 | PASS — PUSH/REPLACE·TOC 중 방향키 억제 |
| 발표자 최초 연결·발표자/투영 창 각각 새로고침 | PASS |
| 투영 → 발표자, 발표자 → 투영 이동 | PASS |
| 양방향 답 공개/숨김 | PASS |
| 같은 요청 ID 2회·발표자 임의 state 발행 | PASS — 중복 이동 없음·투영 상태 원천 유지 |
| 다른 채널 세션·발표자 단독 접속 | PASS — 연결되지 않은 조작 비활성 |
| 발표자 닫힘 후 연결 종료 안내·노트 서랍 | PASS |
| `window.open` 차단·BroadcastChannel 미지원 대체 | PASS — 차단/미지원은 브라우저 주입으로 재현 |
| Preview 기본 v3·Router 진입·3가지 너비 | PASS |

## 보호 범위와 파일

변경은 `.gitattributes`, Foundation 검증기/로더/관련 회귀, 비공개 v3 제어 인터페이스와 노트의 선택적 펼침, 신규 routing 모듈·테스트·CSS, Preview 진입, QA 스크립트·npm script, 이 보고서와 새 QA 증빙에 한정한다. `content.test.ts` 변경은 테스트 fixture 줄바꿈 생성에 한정한다. 128단계 데이터 파일은 불변이다.

기준 SHA와 비교하여 다음은 Git 내용 차이 0이다:

- `drafts/` 전체: 승인 v3.7 원고, 독립 HTML, 기존 이미지, Foundation 원고/SVG, Scene 08 원본 지도
- `src/b21Story/content/storyIntegrity.json`: 승인 값 전체
- `src/b21StoryV3/content/`의 실제 데이터·타입·지도(테스트 파일 제외)
- `src/App.tsx`, 기존 공개 Story/Entry, 미션 카드·용어사전·학습가이드, 다른 미션과 B3-1
- `.github/`, 배포 설정, 의존성과 lockfile

기존 `data:build`가 생성한 33개 JSON의 CRLF 차이는 각각 HEAD와 정규화 비교 및 JSON 동등성을 확인한 뒤 해당 생성 경로만 복원했다. 콘텐츠/분류 변경을 커밋하지 않는다.

증빙: [집계 JSON](../../reports/b21-u3/results.json), [PC 투영](../../reports/b21-u3/b21-u3-projector-1280.png), [390px](../../reports/b21-u3/b21-u3-projector-390.png), [360px](../../reports/b21-u3/b21-u3-projector-360.png), [발표자](../../reports/b21-u3/b21-u3-presenter.png). 전체 parity 이미지와 상세 실행 로그는 `node_modules/.cache/`에 있다.

## 남은 항목과 U4 판단

U3-A 복구와 U3-B 구현·React 검증은 완료했다. **전체 QA가 PASS인 상태는 아니므로 U4 진입은 보류**한다. Owner가 기존 독립 HTML의 360px Scene 04 넘침을 별도 작업으로 수정할지, 기존 결함으로 수용할지 판단해야 한다. 보호된 HTML은 이번 작업에서 수정하지 않았다.

Owner 직접 확인 항목: 실제 프로젝터/다중 모니터에서 창 배치, 실제 브라우저 팝업 정책, 발표자 노트 가독성, macOS 실제 실행. 자동 검증 범위는 한 투영 창과 해당 발표자 창이며, 복제한 여러 투영 탭의 동시 운영은 검증하지 않았다. 공개 서비스 통합·용어 링크 연결은 U4 범위로 남긴다.
