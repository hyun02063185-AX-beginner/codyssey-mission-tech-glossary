# B3-1 시각자료·용어사전 최소 수정 · Owner 시각 검수 대기

2026-11-03 · 브랜치 `feature/b31-network-visual-refinement`
BASE `b58513003ab0a545543273b2a88813aec7ec4c9a`

**구현·변경 영역 QA 완료 / Draft PR / main 병합·배포 금지.** 시작 시 최신 origin/main과 작업 트리 clean을 확인하고 신규 브랜치를 만들었다. 현재 기준 main은 PR #49·#50 반영 후 웹툰 22편이며, 이번 작업은 22편 전체의 데이터·그림·렌더러·공개 목록을 보호한다. PR #49와 해당 작업 브랜치는 수정하지 않았다.

## 후속: 용어사전 체험 접근 안내 보강 (2026-11-03)

Owner가 승인한 최소 수정안을 기존 구현 `5b15acf44fce784373f967d41e722af24464ffb3`에 추가했다. 기존 CIDR 본문과 미션 6번 팝업은 이미 같은 `SubnetMaskExperience`를 재사용하고 있었다. 체험을 옮기거나 복제하지 않고 다음 세 경로를 보강했다.

- CIDR 본문 시작에 **서브넷 마스크 체험으로 이동** 버튼을 추가했다. 기존 체험 위치로 스크롤하고 키보드 초점을 옮긴다.
- 기존 팝업에 **용어사전 CIDR 항목의 체험입니다.** 안내와 **용어사전에서 자세히 보기** 링크를 추가했다. 기존 닫기/Escape·초점 복귀는 유지하고, 사전으로 이동할 때도 스크롤 잠금이 해제된다.
- 기존 Subnet의 정확한 설명 뒤에 CIDR 항목으로 이어지는 **서브넷 마스크 체험 보기** 링크를 추가했다. CIDR에 도착하면 상단 버튼으로 체험에 바로 접근할 수 있다.

후속 변경은 UI 4개 파일, 기존 브라우저 검사 1개, 이 보고서뿐이다. 8장 구성·슬라이드 1/4/5·TCP/HTTP 그림·패킷 데이터/재생·IPv4 계산·웹툰·canonical·생성 데이터·공개 경로·의존성에는 추가 변경이 없다.

후속 검증: macOS, Node 24.22.2, 설치된 Chrome 사용.

- `node node_modules/vitest/vitest.mjs run src/TermRichContent.test.tsx src/networkLearning/ipv4.test.ts`: **26 PASS**.
- `PLAYWRIGHT_CHANNEL=chrome PLAYWRIGHT_PORT=4187 node node_modules/@playwright/test/cli.js test playwright/b31-visual-refinement.spec.ts --grep 'mask roundtrip' --workers=2`: **6 PASS** (1440/390/360px × dark/light). 사전 바로가기·초점·화면 진입, 팝업 안내/사전 링크·닫기/Escape·스크롤 복원, Subnet 링크, 기존 8장·그림·패킷 변화·CIDR 결과·가로 넘침 확인을 포함한다.
- `npm run build`: **PASS**, 기존 대형 청크 경고 유지. `git diff --check`: **PASS**.
- 기존 원본 구현의 나머지 QA는 아래 기록을 재사용한다. 이번 후속의 별도 독립 Agent 검토·새 시각 캡처·실물 기기·공개 배포 검증은 수행하지 않았다.

최초 패키지 다운로드/로컬 서버 시도는 실행 환경의 네트워크·포트 제한으로 중단됐고, 허용된 실행 환경에서 동일 설치 및 브라우저 명령을 다시 실행해 위 결과를 얻었다. 테스트·빌드 설정과 lockfile은 변경하지 않았다. 후속도 기존 PR #51에 추가하며 main 병합·Pages 배포는 수행하지 않는다.

## 요구사항별 결과

| 작업 | 구현 및 보존 범위 |
|---|---|
| A · 슬라이드 1 | 도입 문장만 **AWS를 이해하기 위해 네트워크를 먼저 배웁니다.**로 교체. 제목·목표·이동 기능 유지 |
| B · 슬라이드 4 | 상단 NetworkOverview 표시를 제거하고 기존 enterprise-network desktop/mobile SVG를 바로 표시. 구역·라우팅·방화벽 정책에 대한 주변 설명만 추가. 원본 SVG·확대·가로 이동 보존 |
| C · 슬라이드 5 | 기존 요청·응답 상세 그림의 보충 표시만 제거. 그림 파일은 보존. PacketJourney의 26단계·장비·경로·재생 엔진은 그대로이며 실제 표시된 직전 값과 현재 값을 비교하여 바뀐 항목만 강조 |
| D · TCP | 기존 tcp 항목의 원문을 유지하고 SVG의 PC/모바일 그림을 추가. 송신자·수신자·순서·누락·재전송·ACK의 다음 바이트 번호를 표현 |
| E · HTTP | 기존 http 항목의 원문을 유지하고 브라우저→GET /index.html→서버, 서버→200 OK→브라우저 SVG 추가. TCP와 HTTP의 역할 구분 |
| F · 서브넷 마스크 | 기존 cidr의 정확한 설명 절에 동일한 체험 컴포넌트 추가. 기존 CIDR 그림·본문 유지. 실제 IPv4 unsigned 비트 AND로 마스크·네트워크 주소·동일 여부 계산. 초기 /24 결과와 비교 표, 네트워크/호스트 비트 구분·짧은 색 전환 제공 |
| G · 미션 연결 | **6번 슬라이드 scene-03a (AWS에서 다시 보기)**의 기존 VPC·Subnet 대응 카드 근처에 **서브넷 마스크 체험하기** 버튼 추가. 기존 native dialog 패턴을 재사용. 닫기/Escape·초점·스크롤 잠금 복원 및 기존 상세 펼침 상태·URL 유지 |

슬라이드는 **8장 → 8장**, 순서·ID·직접 URL·장면은 그대로다. 새 미션 슬라이드·canonical 용어·공개 route를 만들지 않았다. 6번 슬라이드는 기존 `네트워크 → VPC`, `주소 구역 → Subnet` 카드가 있어 CIDR 주소 구역 설명으로 확장하기에 적합하다. 체험을 항상 펼쳐 놓지 않으며, 팝업은 공유된 SubnetMaskExperience 컴포넌트를 사용한다.

## 패킷 변화 표시의 정확성

- 기존 패널이 표현하는 항목은 출발지 IP:포트·목적지 IP:포트·프로토콜·데이터 예시 네 가지다. 기존에 표시하지 않는 TTL·MAC 등은 새로 만들지 않았다.
- 매 단계 도착 후 직전에 표시한 단계의 실제 값과 비교한다. NAT 단계에서 바뀐 주소만 강조하고 일반 라우터의 변경되지 않은 IP는 강조하지 않는다.
- DNS 조회→응답, DNS→웹 요청 등은 **다른 통신 단계의 패킷**이라고 별도로 안내한다. 프로토콜이 같은 요청→응답에서는 프로토콜을 강조하지 않는다.
- 이전 이동도 실제 직전 표시와 비교한다. 재시작은 초기 상태로 돌아가 강조를 비운다. 다음 단계에서 비교 상태를 갱신하며, 바뀐 항목에는 1.1초 효과·변경 이름표·직전 값을 제공한다. 동작 줄이기에서는 효과를 생략하고 변경 정보는 유지한다.
- PacketJourney는 보강 자료에서도 공유되므로 해당 화면의 26단계와 자동 재생·일시정지·정리 동작도 검사했다. data.ts와 usePacketPlayer.ts는 바꾸지 않았다.

## 서브넷 계산

| CIDR | 마스크 | 컴퓨터 A 네트워크 | 컴퓨터 B 네트워크 | 판정 |
|---|---|---|---|---|
| /16 | 255.255.0.0 | 192.168.0.0 | 192.168.0.0 | 같은 네트워크 |
| /24 | 255.255.255.0 | 192.168.1.0 | 192.168.2.0 | 다른 네트워크 |
| /26 | 255.255.255.192 | 192.168.1.0 | 192.168.2.0 | 다른 네트워크 |

IP는 A=192.168.1.10, B=192.168.2.20이다. 결과 문자열을 고정하지 않고 IPv4 변환·접두사 마스크·AND로 계산한다. 임의 주소·부분 옥텟과 /0·/32 경계도 단위 검사했다. 처음부터 기본 설명과 /24 결과가 보이며 비교 표도 제공한다. 동일 주소 범위가 실제 통신 허용을 보장하지 않는다는 경계를 안내한다. 기존 구현 조사 결과 CIDR 정적 그림은 있었지만 해당 인터랙티브 체험 소스는 없었다.

## QA 근거

- **단위 검사 49 PASS**: IPv4 계산 5, 패킷 변화 3, TermRichContent 21, 슬라이드·스토리 URL 계약, 기존 원본 26단계 계약 및 기초 카드 검사 포함.
- **브라우저 26개 PASS (변경 영향 범위만)**: 기존 slide-flow 5, packet-journey-story 6, slide-ux 6, 신규 refinement 7, 공유 보강 자료의 26단계·실제 재생 검사 2. CSS 여백·고정 닫기 버튼 수정 뒤 refinement의 6개 화면/테마 조합 재실행 PASS, 실제 변화 효과 1개도 PASS. 전체 Playwright·전체 단위 검사는 반복하지 않았다.
- **npm run build PASS**: TypeScript·기존 데이터 검증·Vite·B2-1 build-check 포함. 기존 대형 청크 경고 유지.
- Desktop 1440px / Mobile 390px·360px의 Light·Dark, 기존 1280×720·1024×768·390×844 강의 뷰포트 회귀를 확인했다. 8장 이동·기존 URL/지도 복귀·26단계·수동/자동·일시정지·이전·재시작·Scene 변경 시 정리·확대가 정상이다.
- 기업망 확대/닫기, TCP·HTTP SVG 한글/경계 넘침, CIDR 세 계산과 비트 수, 팝업의 Escape/버튼 닫기·초점 복귀·body overflow 복원·기존 URL/상세 펼침 유지 확인. 캡처를 직접 열어 확인했다.
- TCP·HTTP 원문은 추가 이미지 Markdown만 제거하면 기준 원문과 동일하다. 원본 기업망·요청응답 SVG, 슬라이드 배열, 패킷 data/player 및 canonical 파일 diff 0.
- 웹툰 `content/webtoons/`, `public/webtoons/`, Webtoons.tsx·CSS·생성 webtoons.json diff 0. 웹툰 22편에 영향 없음.
- **독립 GPT 검토 PASS**: 기술 의미·IPv4 계산·실제 변화 비교·기존 내용·웹툰 보호 및 대표 캡처를 확인했으며 차단 사항 없음.
- **미검증:** 실물 휴대전화·강의실 장비·배포 화면. Owner 시각 검수 전이며 main 병합·Pages 배포를 하지 않았다. 다른 미션 발표자 코드는 변경하지 않았고 기존 빌드 회귀를 재사용했다.

실행 명령:

```sh
node node_modules/vitest/vitest.mjs run \
  src/networkLearning/ipv4.test.ts src/b31PacketJourney/packetChanges.test.ts \
  src/TermRichContent.test.tsx src/b31SlideFlow.test.ts src/b31StoryMapContent.test.ts \
  scripts/b31_packet_journey.test.ts src/b31Foundations/foundations.test.tsx
PLAYWRIGHT_CHANNEL=chrome node node_modules/@playwright/test/cli.js test \
  playwright/b31-visual-refinement.spec.ts playwright/b31-slide-flow.spec.ts \
  playwright/b31-packet-journey-story.spec.ts playwright/b31-slide-ux.spec.ts --workers=2
PLAYWRIGHT_CHANNEL=chrome node node_modules/@playwright/test/cli.js test \
  playwright/b31-packet-journey.spec.ts --grep 'all 26 stages|real animation pauses' --workers=1
npm run build
```

추가 패키지 의존성은 없으며 기존 Node/npm·Chrome 환경을 사용한다.

## Owner 미리보기

현재 로컬 Vite: `http://127.0.0.1:4173/`. 서버가 꺼졌다면 저장소에서 `npm run dev -- --host 127.0.0.1 --port 4173`로 시작한다(Node/npm 환경 필요). PR은 Draft로 제출하며 아래 URL은 로컬 미리보기용이다.

- [1번 도입](http://127.0.0.1:4173/#/missions/main-M05/story-map?scene=slide-intro)
- [4번 기업망](http://127.0.0.1:4173/#/missions/main-M05/story-map?scene=scene-01): 모바일은 기존 그림의 14px 가독성을 유지하도록 좌우 이동·확대 지원
- [5번 패킷](http://127.0.0.1:4173/#/missions/main-M05/story-map?scene=scene-02): 한 단계씩 진행하며 NAT/라우터·이전·재시작 비교
- [6번 체험 팝업](http://127.0.0.1:4173/#/missions/main-M05/story-map?scene=scene-03a)
- [TCP](http://127.0.0.1:4173/#/terms/tcp) · [HTTP](http://127.0.0.1:4173/#/terms/http) · [CIDR](http://127.0.0.1:4173/#/terms/cidr)

대표 캡처: [PC 기업망](1440-slide4.png), [모바일 기업망](360-slide4.png), [패킷 변화](1440-packet-change.png), [TCP PC](1440-tcp.png)/[모바일](360-tcp.png), [HTTP PC](1440-http.png)/[모바일](360-http.png), [체험 팝업](390-subnet-dialog.png), [CIDR /26](360-cidr.png).

## 기술 검토 근거

- [RFC 9293 §3.4·§3.8.1](https://www.rfc-editor.org/rfc/rfc9293.html): 상대 바이트 번호·누적 ACK·재전송. 새 TCP 그림은 연결 설정과 흐름/혼잡 제어를 생략한 교육용 예시다.
- [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html): HTTP 요청·응답 의미와 GET / 200 OK.
- [RFC 4632](https://www.rfc-editor.org/rfc/rfc4632.html): IPv4 접두사·마스크. 기존 CIDR 본문의 AWS 규칙은 이번 작업에서 변경하지 않는다.

## 변경 파일

```text
content/terms/http.md
content/terms/tcp.md
playwright/b31-packet-journey-story.spec.ts
playwright/b31-slide-flow.spec.ts
playwright/b31-visual-refinement.spec.ts
reports/b31-network-visual-refinement/1440-http.png
reports/b31-network-visual-refinement/1440-packet-change.png
reports/b31-network-visual-refinement/1440-slide4.png
reports/b31-network-visual-refinement/1440-tcp.png
reports/b31-network-visual-refinement/360-cidr.png
reports/b31-network-visual-refinement/360-http.png
reports/b31-network-visual-refinement/360-slide4.png
reports/b31-network-visual-refinement/360-tcp.png
reports/b31-network-visual-refinement/390-subnet-dialog.png
reports/b31-network-visual-refinement/README.md
scripts/build_web_data.py
src/App.tsx
src/B31StoryMap.tsx
src/TermRichContent.test.tsx
src/TermRichContent.tsx
src/assets/glossary/b3-1/http-exchange-desktop.svg
src/assets/glossary/b3-1/http-exchange-mobile.svg
src/assets/glossary/b3-1/tcp-reliable-desktop.svg
src/assets/glossary/b3-1/tcp-reliable-mobile.svg
src/b31PacketJourney/PacketJourney.tsx
src/b31PacketJourney/packetChanges.test.ts
src/b31PacketJourney/packetChanges.ts
src/b31PacketJourney/packetJourney.css
src/b31StoryMap.css
src/data/generated/glossary.json
src/networkLearning/SubnetMaskExperience.tsx
src/networkLearning/ipv4.test.ts
src/networkLearning/ipv4.ts
src/networkLearning/subnetMask.css
```
