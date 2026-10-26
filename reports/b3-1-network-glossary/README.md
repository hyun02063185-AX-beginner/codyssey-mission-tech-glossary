# B3-1 네트워크 기초 용어사전 보강 — 검토 보고서

> 브랜치 `content/b3-1-network-glossary` · 기준 `origin/main` `8e58d32`(B3-1 PR #25 병합) · 작성 Claude Code
> 상태: **콘텐츠·데이터 반영 완료, GPT 독립 검토와 Owner 승인 대기.** main 병합·배포하지 않는다.
> 원칙: 기존 용어 우선 보강 → 신규 용어 최소 등록 → 기존 콘텐츠 연결.

## 요약

| 항목 | 결과 |
| --- | --- |
| 신규 canonical 용어 | **4개**: `ip-address` · `private-ip` · `packet` · `network-protocol` (519 → 523) |
| 기존 용어 본문 보강 | **10개**: `public-ip` · `subnet` · `public-subnet` · `tcp` · `http` · `socket-port` · `internet-gateway` · `route-table` · `security-group` · `nat-gateway` |
| 관련 용어 링크만 정리 | **6개**: `cidr` · `elastic-ip` · `default-route-any-ipv4`(문구 1곳 포함) · `virtual-private-cloud` · `outbound-traffic` · `port-22-ssh` |
| 한국어 검색 별칭 추가 | 6개 용어에 7개 (`공인 IP`·`Public IPv4`, `서브넷`, `퍼블릭 서브넷`, `라우팅 테이블`, `인터넷 게이트웨이`, `포트`) |
| B3-1(M05) 미션 연관 추가 | `tcp` · `http` · `socket-port` (+ 신규 4개) |
| 바꾸지 않은 것 | 개념지도 엔진·노드·관계·보기, B3-1 스토리 화면·카드, 분야 기술지도 10개, 기존 ID, B2-1·B6-1 연결 |

전후 비교: [comparison.md](comparison.md) · 원자료 [before.json](before.json) / [after.json](after.json).

## 1. 기존 용어 조사 결과

조사 범위: canonical master(519개), `content/terms/*.md`, 생성 사전, B3-1 개념지도(`main-m05`), 분야 기술지도 10개, 개념 연결(`concept-connections-v1`), 미션 매핑. 대상 10개 외에 같은 문제가 있는 M05 네트워크 용어 6개를 함께 찾았다.

| ID | 기존 정의 | 입문자 가독성 | 일반 개념 ↔ AWS 혼동 | 관련 용어 링크 | M05 연결 | 개념지도 사용 | 판단 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `public-ip` | "internet에서 route 가능한 IP address." | 영어 혼용 한 줄 | 없음. 단 "공인 IP만 있으면 접속" 오해를 막는 문장 없음 | `http`·`tcp` (무관) | 있음 | `com:public-ip` | 본문 보강 |
| `subnet` | "VPC 안에서…network 구획." | 영어 혼용 | **있음.** 일반 정의 없이 VPC 전용. 예약 주소 5개를 일반 사실처럼 씀. B3-1에 없던 DB 구획을 미션 사례처럼 서술 | `http`·`tcp` | 있음 | `aws:subnet` | 본문 보강 |
| `public-subnet` | "…public IP resource를 둘 수 있는 subnet." | 영어 혼용 | 정의가 "공인 IP 자원을 두는 곳"으로 읽힘. B3-1에 없는 DB 예시 | `http`·`tcp` | 있음 | `aws:subnet` | 본문 보강 |
| `cidr` | 표·그림 포함 상세 | 좋음 | 없음 | 정확 | 있음 | 없음(노드 없음) | 링크 2개 추가만 |
| `tcp` | "…connection-oriented transport protocol" | 영어 용어 위주 | 없음 | 일부 무관(`curl`) | **없음**(M07만) | 없음 | 본문 보강 + M05 연관 |
| `http` | 애플리케이션 프로토콜 | 좋음 | 없음 | 정확 | **없음**(예비 M01만) | 없음 | M05 문단·경계 조건 추가 |
| `socket-port` | "transport protocol에서 process endpoint…" | 영어 혼용 | 없음. 포트가 TCP 정보라는 설명 없음 | `http`·`tcp` | **없음**(M07만) | `com:port` | 본문 보강 + M05 연관 |
| `internet-gateway` | VPC↔인터넷 gateway | 짧음 | **있음.** 코드 예가 `인터넷 → IGW → 경로표 → 서브넷 → 보안그룹 → 인스턴스`로 Route Table을 경유 장비처럼 그림. 1:1 NAT·NAT Gateway 구분 없음 | `http`·`tcp` | 있음 | `aws:igw` | 본문 보강 |
| `route-table` | "destination prefix와 next hop…" | 영어 혼용 | 경로와 허용의 구분 없음 | `http`·`tcp` | 있음 | `aws:route-table` | 본문 보강 |
| `security-group` | 상태 기반 가상 방화벽 | 좋음 | 코드 예의 `ufw`는 B3-1(Amazon Linux 2023)과 맞지 않음. HTTPS 443을 B3-1 설정처럼 나열 | `authentication`·`authorization` (인증 개념, 무관) | 있음 | `aws:security-group` | 본문 보강 |
| `nat-gateway` | private subnet의 outbound 변환 | 좋음 | IGW도 1:1 NAT를 한다는 점이 없어 둘의 차이가 흐림 | `http`·`tcp` | 있음 | 없음 | 차이 절 추가 |
| `elastic-ip` · `virtual-private-cloud` · `outbound-traffic` · `port-22-ssh` | — | — | 없음 | `http`·`tcp` (무관) | 있음 | 일부 | 링크만 정리 |
| `default-route-any-ipv4` | 0.0.0.0/0 | 좋음 | "방화벽에서는 전체 허용"이 포트 허용까지로 읽힘 | `http`·`tcp` | 있음 | `aws:default-route` | 링크 + 문구 1곳 |

**공통 원인:** Sprint 7 일괄 생성 때 네트워크 분야 용어의 "관련 용어"가 `http`·`tcp`로 채워졌다. 이번에 B3-1 범위 용어 15개를 실제 관계로 바꿨다. 같은 패턴이 다른 분야에도 남아 있는지는 조사하지 않았다(범위 밖).

## 2. 신규 용어 등록 여부와 판단 근거

먼저 canonical ID·한국어/영어 이름·별칭 전체(검증기와 같은 정규화)에서 같은 개념을 찾았다. 아래 넷은 **ID·별칭 어디에도 없었고**, 대백과의 foundation 노드로도 없었다. 판단 기준은 [성장 정책](../../docs/13_canonical_term_selection_growth_policy_v1.md)의 독립성·재사용·검색 가치·교육 가치·연결 가치다.

| 후보 | 결정 | 근거 |
| --- | --- | --- |
| `ip-address` IP 주소 | **등록** | `public-ip`·`cidr`·`subnet`·`security-group` 설명이 모두 이 개념을 전제하지만 정의가 없다. 공인/사설 IP의 상위 개념이며 M05 외 네트워크 미션에서도 쓰인다 |
| `private-ip` 사설 IP | **등록** | B3-1 개념지도 `com:private-ip` 노드가 사전 링크 없이 떠 있었다. `public-ip`의 짝이며, Private Subnet·NAT와 혼동이 잦다 |
| `packet` 패킷 | **등록** | 가이드·지도·용어 설명에 "패킷"이 반복되지만 정의가 없다. 출발지·목적지 정보와 Route Table·SG가 보는 정보를 설명하는 기반이다 |
| `network-protocol` 네트워크 프로토콜 | **등록 (ID 그대로)** | 아래 명칭 검토 참조 |
| `internet-protocol` IP | 등록 안 함 | IP 자체의 역할은 `network-protocol`(IP·TCP·HTTP 역할 구분)과 `ip-address`(IP 주소의 IP = Internet Protocol)에서 설명한다. 단독 항목이 필요하면 다음 배치에서 판단 |
| `computer-network` 네트워크 | 등록 안 함 | 너무 일반적이라 독립 항목의 학습 가치가 낮다. `subnet`·`ip-address` 정의 안의 한 문장으로 충분하다 |
| `udp` | 등록 안 함 | B3-1은 TCP만 쓴다. `tcp`의 차이 절에 한 문장으로만 언급 |

**`network-protocol` 명칭 검토.** 프로토콜 일반(직렬 통신·API 규약 등 비네트워크 포함)보다 좁게 "네트워크로 데이터를 주고받는 약속"을 정의한다. IP·TCP·HTTP가 모두 이 범위라 이번 학습 목적과 맞다. 단독 `protocol`은 Python의 `typing.Protocol` 같은 다른 뜻과 겹쳐 피했다. 본문에서 "프로토콜(일반 개념)과 IP(특정 프로토콜)"를 분리해 설명했다. 참고로 `domain-name-system`의 **type 값**이 `network-protocol`인데, 이는 ID가 아니라 분류 값이라 충돌하지 않는다. 다만 정책 문서의 type 목록에는 `protocol`만 있어 분류 값이 어긋나 있다(기존 상태, 이번에 바꾸지 않음).

신규 4개의 공통 값: category `Network`, type `concept`, importance `core`, content_status `drafted`, mission_refs `main/M05` · source_status **`related`**. 미션 원문에서 이 단어가 직접 요구되는지는 확인하지 못했으므로 `direct`·`required`로 올리지 않았다. Atlas 분류는 공식 생성기가 category로 `network-web-protocol`·`core`를 자동 부여했다.

## 3. 실제 수정한 용어 콘텐츠

절 구성은 기존 규약(`한 줄 설명 → 쉽게 설명하면 → 정확한 설명 → 이 미션에서는 왜 필요한가 → 코드 예 → 주의할 점 → 관련 용어 → 흔한 오해 → 비슷한 개념과의 차이 → 동료평가 질문`)을 따랐다. 지시서의 학습 구조와는 "정의 = 한 줄 설명, 비유 = 쉽게 설명하면, 실제 사례 = 정확한 설명·코드 예, 혼동 차이 = 흔한 오해·비슷한 개념과의 차이, B3-1 연결 = 이 미션에서는 왜 필요한가·관련 용어"로 대응한다. `정확한 설명`·`흔한 오해`·`비슷한 개념과의 차이`는 화면에서 줄바꿈 없는 한 문단으로 렌더링되므로 목록·굵은 글씨 없이 문장으로 썼다.

| 용어 | 주요 변경 |
| --- | --- |
| `ip-address` (신규) | 정의·택배 주소 비유(경계 명시)·IPv4 표기·주소와 범위 구분·B3-1의 VPC/Subnet/ENI/SG 위치·포트·IP·도메인 이름과의 차이 |
| `private-ip` (신규) | RFC 1918 세 범위, 내부 통신에 NAT 불필요, 변환 ≠ 허용, ENI Private IPv4와 IGW 1:1 변환, 사설 IP ≠ Private Subnet |
| `packet` (신규) | IP 헤더(주소)·TCP 헤더(포트)·HTTP 내용의 겹, 요청 1개 ≠ 패킷 1개, 누가 무엇을 보나(라우터·SG·NAT·Nginx), 도착 ≠ 요청 성공 |
| `network-protocol` (신규) | 약속의 정의, IP·TCP·HTTP 역할 분담, HTTPS(TLS)·HTTP/3(QUIC) 예외, SG 유형 "HTTP"는 TCP 80의 편의 이름 |
| `public-ip` | 한국어 정의, "공인 IP만으로 접속되지 않음", Elastic IP·IGW 1:1 변환, 공인 IP ≠ Public Subnet, 자동 할당 설정 |
| `subnet` | 일반 정의로 교체(AWS는 사례로), 나누기 ≠ 차단, 예약 주소 5개를 AWS 한정으로 표시, B3-1은 Subnet 하나·DB 없음, Scene 01 예시 주소와 연결 |
| `public-subnet` | 정의를 "IGW 직접 경로가 있는 Subnet"으로, 그 안의 EC2도 사설 IP, 접속 조건 4가지, DB 예시를 "B3-1에는 없음"으로 표시, DMZ와의 차이 |
| `tcp` | 한국어 정의, 포트=TCP 헤더·주소=IP 헤더, 신뢰성 ≠ HTTP 성공, UDP와 한 줄 비교, M05 문단(SG TCP 80·22, Nginx) |
| `http` | M05 문단, "HTTP는 항상 TCP가 아님(HTTP/3)", TCP 전달 ≠ 요청 성공(상태 코드 확인) |
| `socket-port` | 포트는 TCP·UDP 헤더 정보, 서버 포트와 클라이언트 임시 포트, M05 문단(SG 허용 ≠ Nginx LISTEN), `IP:포트` 표기 오해 |
| `internet-gateway` | 1:1 NAT 설명, 경로·허용을 하지 않음, 코드 예에서 "지나가는 것"과 "설정"을 분리(기존의 경유 장비식 그림 수정), NAT Gateway와의 차이, B3-1은 NAT Gateway 없음 |
| `route-table` | 한국어 정의, 서브넷에 연결된 설정이며 경로 ≠ 허용, B3-1 `0.0.0.0/0 → IGW`와 응답의 다음 대상, SG와의 차이 |
| `security-group` | `ufw` → OS 방화벽, HTTPS 443은 "B3-1은 설정하지 않음", 유형 HTTP/SSH = TCP 80/22, Route Table과의 차이 |
| `nat-gateway` | "비슷한 개념과의 차이" 신설(IGW 1:1 NAT vs NAT Gateway) |

### 지시서 기술 주의사항 반영 위치

| 주의 | 반영한 곳 |
| --- | --- |
| 공인 IP가 있다고 무조건 외부 접속되지 않음 | `public-ip` 쉽게 설명·주의, `public-subnet` 주의, `internet-gateway` 코드 예 |
| 사설 IP 통신에 항상 NAT가 필요하지 않음 | `private-ip` 정확한 설명·주의 |
| 서브넷 나누기만으로 차단되지 않음 | `subnet` 정확한 설명·주의·흔한 오해·동료평가 질문 |
| IP 패킷 ↔ TCP 세그먼트 | `packet` 정확한 설명·차이, `tcp` 정확한 설명 |
| 포트와 IP 주소의 역할 | `ip-address` 주의·차이, `socket-port` 정확한 설명·오해, `packet` 오해 |
| HTTP는 항상 TCP가 아님 | `http` 주의, `network-protocol` 정확한 설명·주의 |
| TCP 신뢰성 ≠ HTTP 요청 성공 | `tcp` 정확한 설명·오해, `http` 주의, `network-protocol` 주의, `packet` 주의 |
| IGW 1:1 NAT ≠ NAT Gateway | `internet-gateway` 정확한 설명·차이, `nat-gateway` 차이 |
| Route Table 경로 ≠ Security Group 허용 | `route-table` 정확한 설명·코드 예·차이, `security-group` 차이, `packet` 코드 예 |

B3-1 값은 모두 2026-10-14 배포 기록 기준이며 현재 AWS 상태로 쓰지 않았다. 공인 주소 예시는 문서용 대역(`203.0.113.0/24`, `198.51.100.0/24`)만 썼고, B3-1 스토리 카드 V2와 같은 값(`198.51.100.25`, `51514`, `80`)을 사용했다.

## 4. 신규·보강 용어 목록

[comparison.md](comparison.md)에 용어별 한 줄 설명·별칭·미션 연관·관련 용어의 전후를 정리했다.

- **별칭 1개 철회:** `security-group`에 `보안 그룹`을 넣었다가 뺐다. `'보안'` 검색이 분야 라벨 없이는 0건이어야 한다는 기존 감사 테스트(`src/searchTerms.test.ts`)를 깨뜨렸기 때문이다. 테스트 기대값을 바꾸지 않고 별칭을 포기했다. 필요하면 Owner가 테스트 기준과 함께 다시 정한다.
- 신규 용어는 이번에 B3-1 스토리 카드에서 링크하지 않는다(화면 수정 금지). 기존 카드 링크 8개는 모두 기존 ID라 영향이 없다.

## 5. 향후 개념지도에 연결할 노드·관계 후보 (설계 제안만, 이번에 지도 데이터 수정 없음)

### A. 기존 B3-1 개념지도 노드에 용어만 연결 — 가장 작은 변경

`termIds`·`relatedTermIds`는 배치 계산에 쓰이지 않는다(`layoutConceptMap`은 노드·영역·관계만 사용). 좌표 영향 없이 사전 왕복만 늘어난다.

| 노드 | 변경 후보 | 이유 |
| --- | --- | --- |
| `com:private-ip` | `termIds: [] → ['private-ip']` | 지금은 사전 링크가 없는 핵심 노드 |
| `com:public-ip` · `com:private-ip` | `relatedTermIds`에 `ip-address` | 상위 개념으로 이동 |
| `com:port` | `relatedTermIds`에 `tcp` | 포트가 TCP 정보임을 사전에서 확인 |
| `gen:zone-subnets` | `relatedTermIds`에 `subnet` (**`termIds` 아님**) | `subnet`이 이제 일반 정의를 가진다. `termIds`에 넣으면 `?term=subnet`이 `aws:subnet`과 어느 노드로 갈지 충돌하므로(설계 문서 §5의 "서브넷 소유권" 쟁점) 소유는 `aws:subnet`에 둔다 |

### B. 네트워크 기초 보기 — 보류 유지, 용어 측 조건만 해소

[설계 문서 §5](../../content/mission-stories/main-m05/network-foundations-patch-v0.1.md)의 보류 쟁점은 그대로 남는다. 이번 등록으로 해소된 것은 "기초 노드에 연결할 사전 항목이 없다"는 조건뿐이다.

| 후보 노드 | 연결 가능 용어 | 비고 |
| --- | --- | --- |
| IP 주소 | `ip-address` (direct) | |
| 서브넷 | `subnet` (direct 가능) | 위 소유권 규칙과 함께 결정 |
| 패킷 | `packet` (direct) | |
| 프로토콜 일반 / IP | `network-protocol` | IP 노드를 둔다면 `network-protocol`은 extension. 노드를 "프로토콜"로 하면 direct |
| TCP · HTTP | `tcp` · `http` (direct) | |

### C. 분야 기술지도 `network-web-protocol` (Owner Gate: 기존 지식지도 파일 변경)

현재 18개 노드에 신규 4개는 없다. 기존 관계 어휘(`is_a` · `uses` · `based_on` · `interacts_with` …)만으로 표현 가능한 후보:

- `term:public-ip` —is_a→ `term:ip-address`, `term:private-ip` —is_a→ `term:ip-address`
- `term:subnet` —uses→ `term:cidr` (기존 여부 확인 후), `term:packet` —uses→ `term:ip-address`
- `term:tcp` —is_a→ `term:network-protocol`, `term:http` —is_a→ `term:network-protocol`, `term:http` —based_on→ `term:tcp`(HTTP/3 예외를 reason에 명시)

### D. B3-1 스토리 기초 카드의 용어 링크

카드 A에 `ip-address`·`private-ip`, 카드 B에 `packet`·`network-protocol` 링크를 추가하는 것. 화면 변경이므로 Codex·Owner 단계에서 결정한다.

## 6. QA 결과

검증 시점: 이 브랜치의 최종 작업 트리(커밋 직전). 실패 항목은 같은 명령을 **기준 main(`8e58d32`)에서도 실행해** 원인을 나눴다.

| 검증 | 결과 | 비고 |
| --- | --- | --- |
| `npm run data:build` (공식 생성 절차) | PASS | 생성 데이터는 수동 수정하지 않음. 두 번 실행해도 추가 차이 없음 |
| 대백과 검증(`data:build` 안) | PASS · 523 terms · 0 error · 0 warning | RC1 계약을 519 → 523으로 갱신(아래) |
| `npm run glossary:validate` | PASS · 523 canonical · 0 error · 0 warning | ID 중복·별칭 충돌·관련 용어 대상·미션 맵 동기화·Atlas 분류·Chrome 확장 동기화 포함 |
| `npm run content:integrity` | PASS | "이 미션에서는" 절의 미션 번호와 `mission_refs` 일치 |
| `npm run atlas:validate` | PASS · 523 terms | 기존 분류의 분야·역할 변화 없음. `tcp`·`http`·`socket-port`의 미션 목록에 M05 추가 |
| `content:readability` · `content:specificity` · `content:quality` | 신규·수정 용어 지적 0건 | `content:quality`가 다시 쓴 기준선 파일은 되돌림 |
| B3-1 개념지도 검증(`validate_mission_concept_map.py`) | PASS · 36노드·57관계 불변 | |
| `npm test` (Vitest) | 447 PASS · **2 FAIL** | 2건 모두 **기준 main에서도 똑같이 실패**(`b21Learning/service.test.tsx` 미션 정의 비교, `missionUI.test.tsx` B6-1 가이드 맥락). 이번 변경과 무관 |
| `npm run build` | PASS | `b21:validate`·`tsc`·`vite build`·`b21:build-check` 포함 |
| Playwright: 용어 검색·B3-1 기초 카드·B3-1 스토리·B3-1 콘텐츠·개념지도·B6-1 개념지도·대백과·기술지도·B2-1 스토리 | 용어 검색 11/11 PASS(수치 갱신 후). 나머지는 아래 두 파일의 실패 외 PASS | 첫 실행 122개 중 114 PASS / 8 FAIL → 용어 검색 1건은 수치 갱신으로 해결, 나머지 7건은 아래 |
| └ `b2-1-learning-story.spec.ts` 6건 | FAIL | **기준 main에서도 6건 동일 실패.** 이번 변경과 무관 |
| └ `b31-network-foundations.spec.ts` "existing source baseline remains fixed at 71b8784, with no map or glossary expansion" | FAIL (**의도된 충돌**) | PR #25가 `data/curated` 등을 바꾸지 않았음을 확인하는 범위 보호 테스트다. 이번 작업은 용어 확장이 목적이라 `data/curated`가 달라져 실패한다. 같은 파일의 화면·링크 테스트는 모두 PASS. 테스트를 고치지 않았다 |
| `content:plan:validate` | FAIL (**기존 결함으로 갱신 불가**) | Sprint 7 계획 산출물(`data/reviews/content-tier-sprint7.json`)이 519개 고정이다. 공식 생성기 `npm run content:plan`은 **기준 main에서도** `S7-B01 has 0 terms`로 실패하므로 재생성할 수 없다. 수동 수정하지 않았다. build·test에는 포함되지 않는 검증이다 |
| `git diff --check` | PASS | |

**회귀 계약 수치 갱신(신규 등록의 직접 결과):** `scripts/validate_encyclopedia.py`의 `RC1 = 523/523`, `src/data.test.ts`의 사전 길이 523, `playwright/term-search.spec.ts`의 "523개의 기술 용어 중", 거버넌스 문서 Quality Harness 표의 `canonical 523 / detailed 523`.

**Playwright가 다시 쓴 기존 `reports/` 캡처·측정 파일**은 승인 이력 보존을 위해 모두 되돌렸고 커밋하지 않았다.

### B2-1 · B3-1 · B6-1 영향

- **B2-1:** 기존 ID는 하나도 바꾸거나 지우지 않았고, 이번에 고친 용어는 모두 네트워크 분야다. B2-1 스토리 Playwright 실패 6건은 기준 main과 같다.
- **B3-1:** 스토리 원고·SVG·카드·개념지도 데이터 바이트 불변. 카드의 용어 링크 8개는 모두 기존 ID이며 대상 페이지 내용만 보강되었다. 화면·링크 Playwright PASS.
- **B6-1:** 사전 변경 없음. B6-1 개념지도 Playwright PASS.

## 7. 미해결 사항

1. **Owner Gate:** canonical 4개 추가와 Chrome 확장 `glossary.json` 데이터 변경(구조는 같음)은 Owner 승인 대상이다.
2. **범위 보호 테스트:** `b31-network-foundations.spec.ts`의 71b8784 고정 테스트에서 `data/curated`를 빼거나 기준을 옮길지 Owner·Codex가 정한다.
3. **콘텐츠 계획 산출물:** `content:plan` 생성기 결함(main에서도 실패)과 519 고정 산출물의 처리 방법.
4. **확장 문구:** `extension/sidepanel.js`의 검색창 안내 "519개 기술용어를 검색하세요"가 그대로다. 확장 소스는 Owner Gate라 고치지 않았다.
5. **별칭 `보안 그룹`:** 검색 감사 테스트 기준과 함께 다시 판단.
6. **기존 Vitest 2건·B2-1 Playwright 6건 실패:** main에서 이미 실패. 이번 범위 밖.
7. **다른 분야의 `http`·`tcp` 관련 용어 잔재:** 이번에는 B3-1 범위 15개만 정리했다.
8. **미검증:** 실제 브라우저에서 신규 용어 상세 페이지의 눈으로 보는 확인(빌드·Playwright 렌더링은 통과), 미션 원문에서의 직접 요구 여부(그래서 `related`로 둠).
