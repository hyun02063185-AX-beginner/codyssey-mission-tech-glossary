# B3-1 패킷의 여행 — 통합·QA·Owner 검토 인계

- 일자: **2026-10-28 KST**.
- 기준 main: `486358e`(PR #35 병합). 지정 브랜치는 기존 `5283190`에서 변경 없이 존재하여 `origin/main`으로 fast-forward한 뒤 작업했다.
- 브랜치: `feature/b3-1-packet-journey-learning`.
- **최종 구현·QA Commit SHA: `88d051e967e2cdb1138d5d943306dfcb92689f95`**. 구현, 강의 원고 연결, 테스트, 원본과 QA 근거를 한 커밋으로 묶었다. 이 결과 보고서는 해당 확정 SHA와 Push 결과를 기록하는 후속 문서 커밋이다.
- **Push: 성공.** `git push -u origin feature/b3-1-packet-journey-learning`으로 위 구현 커밋을 origin에 전송하고 upstream을 설정했다.
- [Draft PR #36](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/36).
- 단계: **구현·로컬/배포 빌드 QA 완료, GPT 독립 검토 및 Owner 최종 시연·시각 검수·병합 승인 대기**. main 병합·GitHub Pages 배포·AWS 변경은 수행하지 않았다.

## 1. 원본과 구현 방식

사용자의 다운로드 경로 `/Users/hyun020631854123/Downloads/b3-1-network-animation-handoff.zip`에서 4개 파일을 확인했다. 지시서의 `(1)` 접미사 없는 파일이었으며 내부 파일 구성은 일치했다. README-handoff → validation → source.html → standalone.html 순서로 읽었다. standalone의 중첩 `data-srcdoc`를 해제해 **동일한 source.html이 그대로 포함된 내보내기 래퍼**임도 확인했다. 인계 validation.md는 DOM 모사·좌표 검증 기록이며 실제 브라우저 QA 완료 근거로 재사용하지 않았다.

- [원본 ZIP 보존](../../drafts/b3-1-packet-journey/handoff.zip). SHA-256: `b811dbb9c6a12aea6368d299ba2d831b73bd623cd904a20cd7131c065452de5d`.
- [핵심 원본 source.html](../../drafts/b3-1-packet-journey/original/b3-1-network-animation-handoff/network-packet-journey.source.html). SHA-256: `24e3c557520bb57a6044648d985a1445da1dba2a3a4324066f732fbef7430410`.
- 인계 README·validation과 source는 원문 바이트로 추출해 검토/계약 테스트에 쓴다. 큰 standalone HTML 래퍼는 ZIP 안에 보존하며 앱으로 복사하지 않았다.

원본의 definitions/links/phases/steps, packet·description·decision 함수를 타입을 붙인 `data.ts`로 옮겼다. React 컴포넌트가 SVG·표·제어를 렌더링하고 `usePacketPlayer`가 재생을 맡는다. iframe·원본 스크립트 실행 삽입은 사용하지 않았다. 배포 JS에 원본 standalone의 `nw-progress`, `data-visualize-standalone`, 래퍼 스크립트 표식이 들어가지 않는 것도 확인했다.

원본의 800ms 이동·900ms 대기, phase 전환 시 새 통신으로 넘어가는 동작과 완료된 phase의 경로를 남기는 방식은 유지했다. 추가한 기능은 이전 단계, 언제든 재시작, 명시적인 NAT 전후 표시, 경로 선택 이유, 단계/키보드/낭독 안내와 해제 시 자원 정리다. 일시정지한 비행은 위치를 보존하고 이어서 재생한다. 자동 재생은 기본으로 시작하지 않는다.

## 2. 삽입 위치와 학습 흐름

기존 주소 **`/missions/main-M05/guide?document=supplement`**를 유지했다. 새 체험은 `supplement/README.md`의 **장면 1과 장면 2 사이**에 둔다. 기존 그림 0~4와 보충 그림, 총 SVG 6개의 원본·이미지 경로는 그대로다.

체험 직접 주소는 기존 HashRouter의 본문 앵커 규약을 따른다.

```text
/#/missions/main-M05/guide?document=supplement#packet-journey
```

그림 0 전체 구조 → 그림 1 장비·구역 → 패킷의 여행 → 그림 2 요청·응답 재확인 → 그림 4 AWS 비교로 읽는다. 시뮬레이션은 **방문자 접속 A를 설명하기 위해 인터넷 라우터/DNS 구간을 확장한 별도 교육용 토폴로지**다. 원래 전체도의 장비 배치·IP와 같다고 설명하지 않는다. 직원 게시 B·자료 조회 C는 기존 자료에 남긴다.

- 2장 도입에서 전체 구성도·체험 앵커·AWS 역할 비교 순서로 연결했다.
- 3장에는 라우팅→Route Table 규칙, 주소 변환→IGW의 공인/사설 IPv4 대응, 허용 판단→ENI의 SG라는 기능 비교를 추가했다.
- 전체/보강 강사 노트에 한 단계씩 멈추는 8개 진행 순서와 5개 확인 질문을 추가했다. 구현 코드 설명을 수업 내용으로 넣지 않았다.
- Markdown의 제목 렌더링 위치에서 React 체험을 삽입한다. 문서 주요 제목 수집이나 같은 문서의 앵커 이동으로 초점·재생 상태가 초기화되지 않도록 Markdown 컴포넌트 참조를 고정했다.

## 3. 26단계와 패킷 검증

[계약 테스트](../../scripts/b31_packet_journey.test.ts)는 제공된 source의 데이터/함수를 격리한 VM에서 실행하여, 새 데이터의 **전체 토폴로지·phase·26개 step·각 단계 packet/description/decision**과 비교한다. 별도로 NAT의 기대값과 실제 연결의 연속성도 검사한다. 구현이 기대한 값을 다시 적기만 하는 검사가 아니다.

| 구간 | 원본과 같은 순서 | 전체 단계 번호 |
| --- | --- | --- |
| DNS 조회 5 | PC → 공유기 → R1 → R2 → DNS | 1–5 |
| DNS 응답 5 | DNS → R2 → R1 → 공유기 → PC | 6–10 |
| 웹 요청 8 | PC → 공유기 → R1 → R2 → R4 → 회사 경계 → 방화벽/NAT → 웹 서버 | 11–18 |
| 웹 응답 8 | 웹 서버 → 방화벽/NAT → 회사 경계 → R4 → R3 → R1 → 공유기 → PC | 19–26 |

실제 가이드에서도 26단계 모두 현재 장비·phase·출발지/목적지·선택된 규칙·누적 경로·NAT 표시를 비교했다. 단계별 결과는 [26-stage-evidence.json](26-stage-evidence.json)에 있다. 최종 목적지는 `192.168.0.20:50000`으로 복원된다.

| NAT 처리 단계 | 바뀌는 필드 | 변환 전 → 처리 후 |
| --- | --- | --- |
| 2 공유기, DNS 조회 | 출발지 | `192.168.0.20:53000` → `203.0.113.10:61000` |
| 9 공유기, DNS 응답 | 목적지 | `203.0.113.10:61000` → `192.168.0.20:53000` |
| 12 공유기, 웹 요청 | 출발지 | `192.168.0.20:50000` → `203.0.113.10:62000` |
| 17 회사 방화벽/NAT, 웹 요청 | 목적지 | `198.51.100.80:80` → `10.20.10.20:80` |
| 20 회사 방화벽/NAT, 웹 응답 | 출발지 | `10.20.10.20:80` → `198.51.100.80:80` |
| 25 공유기, 웹 응답 | 목적지 | `203.0.113.10:62000` → `192.168.0.20:50000` |

라우터 화면에는 목적지 IP, 예시 경로표, 체크 표시와 강조된 일치 항목, 다음 장비와 선택 이유가 함께 나온다. R4는 요청의 `198.51.100.0/24`에서 회사 경계, 응답의 `203.0.113.0/24`에서 **R3**를 선택한다. 각 라우터가 자기 경로표로 다음 방향을 고르며 전체 인터넷 경로를 미리 정하지 않는다고 설명한다. 원본의 단순 /24 prefix 예시는 그대로 유지하되 실제의 최장 접두사 일치 등 규칙 전체를 구현한 것으로 일반화하지 않는다.

회색 연결선, 실제 전달된 선, 이동 중 패킷 표식을 구분한다. DNS는 사각형, 웹 요청은 마름모, 웹 응답은 원으로 구분하고 이름·현재 phase도 표시한다. 이전 통신은 옅게 유지하고 웹 응답은 점선으로 남긴다. phase 전환 때 미래 통신이 강조되지 않는지 확인했다.

## 4. 설명의 정확성과 단순화

DNS는 캐시에서 A 레코드 정보를 돌려주고 PC가 확인한 IP로 별도의 HTTP 통신을 시작한다. NAT는 IP/필요한 포트 변환, 라우팅은 다음 길 선택, 방화벽은 허용 판단이다. 인터넷의 R2/R3 경로가 달라도 이 예시의 NAT·방화벽을 왕복 모두 거쳐 매핑·연결 상태를 유지하는 조건을 설명했다.

문서용 IP 3개, 실제 example.com 응답 아님, 실제 인터넷 물리 경로·패킷 캡처 아님, DNS 캐시·UDP DNS/TCP HTTP 조건, TCP 설정/일부 ACK·TLS/HTTP3 생략, 전체 페이지가 한 패킷에 담기지 않음, 모든 IP 패킷에 포트가 있지 않음, 장비별 처리 순서 차이, 현재 AWS 상태 아님을 체험 내 안내에 표시했다. Route Table을 물리 경유 장비로 만들거나 일반 NAT/방화벽을 IGW·SG와 같은 장비로 취급하지 않았다.

기술 근거(2026-10-28 확인): [RFC 1812의 라우터 경로 선택](https://www.rfc-editor.org/rfc/rfc1812.html#section-5.2.4.3), [RFC 3022의 NAT/NAPT와 세션 경로 조건](https://www.rfc-editor.org/rfc/rfc3022.html#section-1), [RFC 1034 DNS](https://www.rfc-editor.org/rfc/rfc1034.html), [RFC 5737 문서용 주소](https://www.rfc-editor.org/rfc/rfc5737.html), [AWS IGW와 IPv4 주소 변환](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html), [AWS Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html). AWS 계정이나 평가 저장소에는 접근·변경하지 않았다.

## 5. 용어·개념지도 변경 여부

**용어 본문·ID·canonical·generated glossary 모두 무변경**, canonical 523개 유지. 후보의 canonical ID·표기/별칭·본문·관련 링크를 확인했다. generic 라우터/라우팅/NAT/방화벽을 `react-router`, `client-side-routing`, `nat-gateway`, `firewalld`와 혼동해 연결하지 않았다.

- 체험의 기존 용어 링크: `packet`, `ip-address`, `public-ip`, `private-ip`, `network-protocol`, `socket-port`, `route-table`, `tcp`, `http`, `domain-name-system`, `internet-gateway`, `security-group`.
- `route-table`은 이미 목적지 범위·더 구체적인 경로·AWS 규칙표/장비 차이를 설명한다. DNS 본문도 주소 확인과 웹 연결을 구분한다. IP/HTTP/TCP 등 충분한 기존 설명은 재작성하지 않았다.
- `nat-gateway`는 별도 AWS 서비스로 확인했으며 이 일반망 NAT의 정의 링크로 붙이지 않았다. B3-1에서 만들지 않았다는 비교 문구만 유지했다.

**개념지도 JSON·엔진 무변경**, 44노드/67관계와 all/general/aws/basics 보기 유지. `gen:border-router → gen:routing`, `gen:firewall → gen:access-control`, `gen:nat → gen:address-translation`, AWS의 Route Table/IGW/SG 대응, basics의 패킷↔주소/프로토콜 관계를 확인했다. 기존 일반망 그림의 주소와 체험 주소가 다른 점은 별도 토폴로지라는 안내로 구분했다.

경로 선택·NAT·패킷의 기존 노드로 검증된 `conceptHref`를 사용해 연결했다. DNS는 기존 지도에서 생략된 범위이며 용어 링크로 확인하게 했다. 시간 순서인 26단계를 지도 관계로 복제하거나 이 체험을 위해 새 DNS 노드/관계를 만들 필요는 없다고 판단했다. 관계·용어 링크는 새 탭으로 열어 **원래 체험 단계가 그대로 남는다**. 링크를 열고 닫은 뒤 현재 단계 보존도 확인했다.

## 6. 변경 파일

| 범위 | 파일과 변경 |
| --- | --- |
| 체험 | `src/b31PacketJourney/data.ts`, `PacketJourney.tsx`, `usePacketPlayer.ts`, `packetJourney.css`: 원본 데이터·React SVG/표·재생/정리·반응형과 독립 Light/Dark 교육 팔레트 |
| 가이드 통합 | `src/B31MissionGuide.tsx`: 기존 Markdown 흐름 안의 체험 삽입, 앵커·렌더러 참조 안정화 |
| 학습 원고 | `supplement/README.md`, `chapters/02-network-aws-map.md`, `chapters/03-internet-path.md`: 위치·학습 순서·기능 비교 |
| 강사 안내 | `main-m05/instructor-notes.md`, `supplement/instructor-notes.md`: 대면 시연·확인 질문 |
| 테스트 | `scripts/b31_packet_journey.test.ts`, `playwright/b31-packet-journey.spec.ts` |
| 기존 QA 재사용 | `scripts/check_mission_ui.mjs`: 기본 동작을 유지하며 출력 경로와 캡처 생략 환경 변수만 추가. 기존 보고서·대량 캡처 덮어쓰기를 방지 |
| 원본·증빙 | `drafts/b3-1-packet-journey/`, 이 보고서 폴더의 대표 2장·26단계 JSON·공통 UI 결과 |

## 7. 실행 결과와 PC·모바일

환경: 교육장 macOS, Chrome **146.0.7680.165**, Node v24.22.1, npm 11.19.1, Python 3.12.13. Python 인코딩은 `PYTHONUTF8=1`, sudo 사용 없음.

| 검증 | 결과 |
| --- | --- |
| `npm run glossary:validate` | PASS — canonical 523, mission-local 46, errors 0, warnings 0, info 788 |
| `npm run content:integrity` | PASS — terms 디렉터리 상세 522, 고유 미션 맥락 522, 템플릿/모순/새 경고 0. 별도 readme-term까지 canonical 상세 523 |
| `npm test` | PASS — 40 files, **507 tests**. 원본 계약·NAT·연결·배치 12 tests 포함 |
| `npm run build` | PASS — 최종 글꼴/레이아웃 반영, TS·Vite·기존 B2-1 별도 빌드 검사 포함 |
| `npm run mission:ui-check` | PASS — **156 checks / 12 states**, 개발/배포 × 1280/390/360 × B2-1/B3-1. [원본 결과](mission-ui-results.json) |
| 신규 Playwright, 개발 화면 | PASS — 10 tests: 6개 폭/테마, 26단계 전체, 실제 재생/일시정지/재개/이동 중 해제, reduced-motion, 가이드·지도·용어 링크 |
| 신규 Playwright, 최종 배포 빌드 | PASS — 10 tests. RAF와 900ms 대기 타이머를 각각 재생 중 이동/대기 중 이동으로 해제 확인 |
| 최종 앵커·모바일 목차·단계 보존 강화 검사 | PASS — 배포 빌드 7 tests. 같은 문서 제목 탐색, 새 탭 왕복 뒤 단계 유지, 390/360 목차의 7장 이동 포함 |
| 기존 가이드/스토리 Playwright | PASS — 2 tests. 7장 전체 진입, 기존 그림, 5개 스토리 장면·확대·키보드·실습 링크 |
| 보호 범위·배포물 | PASS — canonical/용어/지도/스토리/기존 SVG 바이트 차이 없음, standalone 래퍼는 앱 번들에 없음 |
| `git diff --check` / staged check | PASS |

재현 명령:

```sh
PYTHONUTF8=1 npm run glossary:validate
PYTHONUTF8=1 npm run content:integrity
PYTHONUTF8=1 npm test
PYTHONUTF8=1 npm run build
PLAYWRIGHT_CHANNEL=chrome npx playwright test playwright/b31-packet-journey.spec.ts --workers=1
# 별도 터미널: npx vite preview --host 127.0.0.1 --port 4174 --strictPort
PLAYWRIGHT_CHANNEL=chrome PACKET_QA_BASE_URL=http://127.0.0.1:4174 PACKET_QA_CAPTURE=1 npx playwright test playwright/b31-packet-journey.spec.ts --workers=1
MISSION_UI_QA_OUT=/tmp/codyssey-packet-mission-ui MISSION_UI_QA_CAPTURE=0 npm run mission:ui-check
```

기존 공통 UI 스크립트는 4200에 작업 dev, 자체 4201 preview, 4202에 main 기준 앱이 필요하다. 기준 `486358e`를 임시 worktree에서 준비했다. macOS `/tmp`의 실제 경로와 공유 node_modules 심볼릭 링크로 초기 기준 dev 서버의 TSX 변환·보조 private-build 경로 검사가 실패했으므로, 기준의 완성된 Vite 번들을 4202 preview로 열고 공통 UI 검사를 다시 실행해 통과했다. 작업 브랜치의 정식 build는 보조 검사까지 통과했다. 초기 테스트에서 수정한 항목은 SVG 로컬/화면 좌표 측정, React 갱신을 기다리는 가상 시간 테스트, 실제 가이드 앵커 초점/상태 보존이다. 실패 결과를 PASS로 간주하지 않았다.

1280px에서는 전체도와 패킷/경로표를 나란히 보여 준다. 390/360px에서는 원본의 세로 토폴로지를 유지하고 정보 패널을 세로 배치한다. 최소 320px 그림 폭과 확대/가로 이동·방향키 안내를 제공한다. 작은 화면을 텍스트 목록으로 대체하지 않았다. Light/Dark는 체험에만 적용하며 사이트 테마·기존 SVG·슬라이드 테마를 변경하지 않는다.

6개 폭/테마 조합에서 텍스트 겹침/잘림·문서 가로 넘침 0, SVG 글꼴 최소 **13px**, 본문/보조/역할 색 글자 대비 **4.5:1 이상**을 확인했다. 원본 그림 6개 로드, 전체도 확대, 현재 장비·단계·선택 규칙 표시도 확인했다. 키보드 Enter로 수동 진행, 그림 초점/방향키, 앵커 초점, 버튼 이름, `role=status`의 `aria-live=polite`, reduced-motion과 미사용 RAF/타이머/ResizeObserver·미디어 리스너 정리를 구현/검증했다. 실제 VoiceOver 청취 검증과는 구분한다.

대표 캡처는 **2장만** 저장했다. 최종 파일을 직접 열어 전체 연결망, 글자·관계선, 선택 규칙, NAT 전후, Dark/Light 대비를 살폈다.

- [PC 1280 · Light · 22단계 R4가 R3 선택](1280-light.png)
- [모바일 390 · Dark · 17단계 회사 목적지 NAT](390-dark.png)

## 8. 검토·승인과 미검증 사항

- 기획/웹 통합 정책 체크: **PASS(구현 범위)**. Owner의 실제 교육 피드백과 인계 시안을 사용했고, 강사 주도 설명·확인 질문·미션 실습 연결을 마련했다. 스토리=흐름, 지도=관계, 사전=정의 확장, 가이드=실행의 역할을 구분했다. 기존 승인 소스와 차이를 위 범위로 제한했다.
- **GPT 독립 콘텐츠 검토: 대기.** 본 구현자의 원본 계약/기술 대조·QA를 독립 검토 완료로 표현하지 않는다.
- **Owner 최종 화면 시연·시각 검수·병합 승인: 대기.** 자동 테스트나 캡처를 이 승인으로 대신하지 않는다.
- 실물 휴대전화, VoiceOver 실제 청취, Safari/Firefox, 공개 Pages, 실제 AWS 자원·DNS 조회·패킷 캡처는 **미검증/범위 밖**이다. 현재 웹 동작을 실제 인터넷 통신 측정으로 소개하지 않는다.
- 기존 Vite 500kB chunk-size 안내는 남는다. 새 기능의 미해결 테스트 실패는 없다.
- 학습자가 자기 말로 설명하는 수업 결과는 아직 측정하지 않았다. 자료를 보거나 애니메이션이 움직인다는 사실만으로 교육 목표 달성을 선언하지 않는다.

GPT 독립 검토 지적을 반영한 뒤 Owner가 최종 시연한다. 이때 ① R1/R2의 목적지와 일치 경로 ② 공유기·회사 NAT 전후 ③ DNS 응답 뒤 별도 웹 요청 ④ R4가 응답에 R3 선택 ⑤ 같은 NAT/방화벽 상태 유지 ⑥ AWS Route Table/IGW/ENI SG/Nginx의 기능 비교를 학습자가 자기 말로 설명하는지 확인하고, Owner가 최종 병합을 판단한다.
