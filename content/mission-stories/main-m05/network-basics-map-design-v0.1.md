# B3-1 개념지도 네트워크 기초 보기 설계 v0.1

> 기준: `main` `2149a66`(PR #26 병합) · 브랜치 `content/b3-1-network-basics-map-design` · 작성 Claude Code · 2026-10-27
> 범위: **설계와 사전 검증만.** 지도 데이터·웹 코드·canonical·SVG·golden 기준은 바꾸지 않았다. 구현은 Owner·GPT 설계 검토 후 Codex가 맡는다.
> 검증 근거: [검증 보고서](../../../reports/b3-1-network-basics-map-design/README.md) — 재현 스크립트·결과 JSON·실제 화면 캡처·제안 패치.

이전 [네트워크 기초 보강 설계](network-foundations-patch-v0.1.md) §5가 보류한 "기초 보기"를 실제 코드 기준으로 다시 조사했다. 이전 문서의 "기존 세 보기 좌표가 완전히 같았다"는 주장은 재현 코드가 없어 쓰지 않았고, 이번에 저장소에 남긴 스크립트로 새로 측정했다.

## 0. 결론 요약

| 항목 | 권장 |
| --- | --- |
| 1차 | 기존 노드 4개에 용어 링크만 보강한다. 배치·선택 결과 변화 0(1,128개 상태 비교). |
| 2차 | `basics` 도메인·`네트워크 기초` 보기를 추가한다. **신규 노드 8 · 재사용 공통 노드 3 · 신규 관계 10 · 선 없는 비교 3.** AWS 노드는 기초 보기에 넣지 않고 상세 패널의 적용 위치 링크로 잇는다. |
| 배치 | 4열 `[기초·주소와 구역 | 공통 | 기초·패킷과 프로토콜 | 기초·IP·TCP·HTTP의 역할]`(후보 D). 1536×400, 교차 관계쌍 5개(후보 중 최소), 왼쪽→오른쪽이 강의 순서와 같다. |
| 기존 보기 보호 | 후보 데이터와 제안 엔진으로 기존 세 보기 1,128개 상태의 좌표·경로·지도 크기 차이 **0**. B2-1·B6-1 배치도 같다. 의도된 차이는 새 비교 카드 CB01의 선택 강조 24건뿐이다. |
| 반드시 필요한 코드 변경 | 현재 엔진은 기초 보기를 그리면 **TypeError로 멈추고**, 기초 노드를 URL·검색으로 열면 노드가 없는 `전체 관계` 보기로 보낸다. 보기 소속 판정 함수·보기 복귀 규칙·관계 끝점 보호 3가지가 필요하다(§6.2). |
| 검증기 | 현재 검증기는 후보를 18건(ID 접두어 8, scope 10)으로 거부한다. 규칙 4개를 더하고 비교 카드 규칙의 빈틈 1개를 고친 제안본은 후보를 통과시키고 변이 8개를 모두 잡는다. |

## 1. 현재 개념지도 구조 (`2149a66` 실측)

- 데이터: `data/mission-story-maps/main-m05/concept-map.json` — 노드 36(핵심 23·보충 13), 관계 57, 보기 3, 비교 카드 6, 학습 순서 4. 검증기 PASS.
- 도메인·영역: `general`(영역 3: 구역·장비·역할), `common`(영역 1), `aws`(영역 2: 설정·자원). 관계 scope `general` 33 · `aws` 16 · `cross` 7 · `shared` 1.
- 보기: `all`(전체, 핵심만 시작 23/31) · `general`(26/34) · `aws`(15/17). 각 보기는 `nodeDomains`·`relationScopes`로 거른다.
- 배치 엔진(`conceptMapAdapter.ts`): 보기마다 한 번 계산해 캐시한다. 입력은 그 보기의 노드·영역·관계뿐이며 열 순서는 영역 `order`, 열 안 순서는 핵심→보충, `order`. `termIds`·`relatedTermIds`는 배치에 쓰이지 않는다.
- 같은 엔진을 B2-1 탐색기와 B6-1 지도가 `view: 'all'`·`domain: 'common'` 기하 계산용으로 쓴다.
- 용어 연결: `termIds` 12개 ID, 용어 없는 노드 25개. 검증기는 한 용어 ID를 두 노드가 `termIds`로 쓰지 못하게 막는다(`?term=` 딥링크 모호성).
- 상세 패널의 "용어사전"은 `termIds`+`relatedTermIds`를 모두 보여 준다. 지도 검색은 라벨·요약·`termIds` 용어 이름만 본다. `?term=`은 `termIds`의 첫 소유 노드로 간다. 용어 상세 화면에서 B3-1 지도로 가는 `?term=` 링크는 현재 없다.

### 1.1 기존 노드와 신규 용어 연결 현황

| 노드 | 지금 | 신규·보강 용어(PR #26) | 판단 |
| --- | --- | --- | --- |
| `com:private-ip` 사설 IP | `termIds: []` | `private-ip` 신규 | **누락.** 직접 소유자가 없으므로 `termIds`로 연결 |
| `com:public-ip` 공인 IP | `public-ip` | `ip-address` 신규(상위 개념) | 보조 연결 `relatedTermIds` |
| `com:private-ip` | — | `ip-address` | 보조 연결 |
| `com:port` 포트 | `socket-port` + 관련 3개 | `tcp`(M05 연관 추가) | 보조 연결. `tcp`의 직접 소유는 2차 `bas:tcp` |
| `gen:zone-subnets` 구역별 주소 범위 | 없음. `termIdNote`가 "subnet은 VPC 전용 정의"라고 적음 | `subnet`이 일반 정의로 바뀜 | 보조 연결. **노트가 사실과 달라졌으므로 함께 고친다** |
| `aws:subnet` Public Subnet | `public-subnet`, `subnet` | — | `subnet` 소유 이동은 2차에서(§4.3) |
| 노드 없음 | — | `packet`, `network-protocol`, `cidr`, `http` | 2차 기초 노드가 소유(`cidr`은 보조 연결) |

**충돌 가능성:** `subnet`을 `gen:zone-subnets`나 `bas:subnet`의 `termIds`에 그냥 넣으면 검증기가 실패한다(변이 M2로 확인). `relatedTermIds`는 중복이 허용되고 배치·`?term=`에 영향이 없다.

## 2. 1차 — 기존 노드 용어 링크 보강

| 노드 | 변경 |
| --- | --- |
| `com:private-ip` | `termIds: ["private-ip"]`, `relatedTermIds: ["ip-address"]` |
| `com:public-ip` | `relatedTermIds: ["ip-address"]` |
| `com:port` | `relatedTermIds`에 `tcp` 추가(기존 3개 유지) |
| `gen:zone-subnets` | `relatedTermIds: ["subnet"]`, `termIdNote`를 "직접 연결은 한 노드만 소유하므로 보조 연결" 취지로 수정 |

- 결과: 현재 엔진에서 현재 데이터와 1차 데이터의 세 보기 1,128개 상태(모든 노드·관계·흐름 선택 × 보충 표시 × 중요도)를 비교해 **좌표·경로·투영·선택 강조 차이 0**. 현재 검증기 PASS.
- 화면 변화는 상세 패널의 용어사전 링크 추가, `?term=private-ip`가 사설 IP 노드로 열리는 것, 지도 검색에서 `사설 IP`의 용어 별칭이 검색되는 것뿐이다.
- 1차만 단독 병합할 수 있다. 다만 아래 §6.4의 보호 테스트 2건이 데이터 파일 변경으로 실패하므로 계약 갱신이 함께 필요하다.

## 3. 2차 — 네트워크 기초 보기

### 3.1 학습 목표와 범위

강사가 "주소 → 주소의 종류 → 데이터 조각 → 약속의 역할 분담 → B3-1 설정"을 한 화면에서 순서대로 짚도록 한다. 기초 보기는 **개념의 관계만** 보여 주고, AWS 설정은 그 개념이 "쓰인 곳"으로 연결한다. AWS 노드를 같은 화면에 넣으면 선이 다시 늘고 기존 AWS 보기와 같은 내용을 반복하게 된다.

### 3.2 노드 — 신규 8 · 재사용 3

| ID | 표시 이름 | 영역(열) | 중요도 | 한 줄 요약 | 직접 용어 `termIds` | 보조 `relatedTermIds` |
| --- | --- | --- | --- | --- | --- | --- |
| `bas:network` | 네트워크 | 주소와 구역 | 핵심 | 데이터를 주고받도록 연결된 기기들의 묶음 | — (등록 보류 용어) | `ip-address` |
| `bas:subnet` | 서브넷 (Subnet) | 주소와 구역 | 핵심 | 네트워크를 구역으로 나누고 구역마다 정한 IP 주소 범위 | `subnet` | `cidr` |
| `bas:ip-address` | IP 주소 | 주소와 구역 | 핵심 | 기기(정확히는 네트워크 인터페이스)를 찾아가기 위한 번호 | `ip-address` | — |
| `com:public-ip` | 공인 IP *(재사용)* | 공통 | 핵심 | 기존 그대로 | `public-ip` | `ip-address`(1차) |
| `com:private-ip` | 사설 IP *(재사용)* | 공통 | 핵심 | 기존 그대로 | `private-ip`(1차) | `ip-address`(1차) |
| `com:port` | 포트 *(재사용)* | 공통 | 보충 | 기존 그대로 | `socket-port` | 기존 3개 + `tcp`(1차) |
| `bas:packet` | 패킷 | 패킷과 프로토콜 | 핵심 | 네트워크로 보내는 데이터 조각. 앞부분에 출발지·목적지 IP 주소 | `packet` | — |
| `bas:protocol` | 네트워크 프로토콜 | 패킷과 프로토콜 | 핵심 | 통신하는 양쪽이 데이터의 형식과 순서를 미리 정한 약속 | `network-protocol` | — |
| `bas:ip` | IP (인터넷 프로토콜) | IP·TCP·HTTP의 역할 | 핵심 | 목적지 IP 주소를 보고 패킷을 네트워크 사이로 전달하는 약속 | — (단독 용어 없음) | `network-protocol`, `ip-address` |
| `bas:tcp` | TCP | IP·TCP·HTTP의 역할 | 핵심 | 포트로 프로그램을 구분하고 손실 재전송·순서 복원을 맡는 약속 | `tcp` | `socket-port` |
| `bas:http` | HTTP | IP·TCP·HTTP의 역할 | 핵심 | 웹 요청과 응답의 형식과 의미를 정하는 약속 | `http` | `port-80-http`, `https` |

- 상세 설명 원문은 [후보 데이터](../../../reports/b3-1-network-basics-map-design/candidate-concept-map-D.json)에 있다. 기술 경계는 기존 설계 문서 §2와 PR #26 용어 본문을 따른다(공인 IP만으로 접속되지 않음, 서브넷 나누기 ≠ 차단, 포트는 TCP 정보, IP는 도착을 보장하지 않음, TCP 신뢰성 ≠ 요청 성공, HTTP/3 예외, HTTP 80 실습과 Scene 02 HTTPS 443 구분).
- 모든 기초 노드는 `implementationStatus: "concept"`, `conceptType`은 기존 `area`·`address`와 신규 `data-unit`(데이터 단위)·`protocol`(프로토콜)을 쓴다. 신규 두 값은 `conceptTypeLabel`에 추가해야 화면에 영어 값이 나오지 않는다.
- **목록에서 노드로 만들지 않은 것:** CIDR은 서브넷 범위의 표기법이라 `bas:subnet` 설명·보조 용어·적용 위치(VPC `10.0.0.0/16`, Subnet `10.0.1.0/24`)로 보낸다. 노드로 넣은 시안은 교차선의 4/6을 만들었다(보고서 §3). VPC·Public Subnet·IGW·Route Table·SG·EC2/Nginx는 기존 AWS 노드를 그대로 쓰고 기초 보기에는 넣지 않는다.
- 설명문에 IP 주소를 쓸 때는 Scene 01~03 SVG에 실제로 있는 값만 쓸 수 있다(검증기 규칙, 변이 M7). RFC 1918 세 범위 같은 값은 용어사전 본문에 두고 지도에는 쓰지 않는다.

### 3.3 관계 — 신규 10 (scope `basics`, 기존 6유형만 사용)

| ID | 출발 → 도착 | 유형 | 이름표 | 중요도 | 구분 |
| --- | --- | --- | --- | --- | --- |
| BA01 | 네트워크 → 서브넷 | 포함 | 구역으로 나눔 | 핵심 | 영역 관계 |
| BA02 | 서브넷 → IP 주소 | 연관 | 주소 범위 | 핵심 | 영역 관계 |
| BA03 | IP 주소 → 공인 IP | 연관 | 종류 · 인터넷 라우팅용 | 핵심 | 종류 관계 |
| BA04 | IP 주소 → 사설 IP | 연관 | 종류 · 내부 통신용 | 핵심 | 종류 관계 |
| BA05 | 패킷 → IP 주소 | 연관 | 출발지·목적지 | 핵심 | 전달 정보 |
| BA06 | IP → 패킷 | 역할 | 목적지까지 전달 | 핵심 | 프로토콜 역할 |
| BA07 | 네트워크 프로토콜 → IP | 연관 | 종류 · 주소와 전달 | 핵심 | 프로토콜 역할 |
| BA08 | 네트워크 프로토콜 → TCP | 연관 | 종류 · 포트와 신뢰성 | 핵심 | 프로토콜 역할 |
| BA09 | 네트워크 프로토콜 → HTTP | 연관 | 종류 · 요청과 응답 | 핵심 | 프로토콜 역할 |
| BA10 | TCP → 포트 | 역할 | 포트로 서비스 구분 | 보충 | 서비스 식별 |

- "종류"는 새 관계 유형을 만들지 않고 기존 `연관` + 이름표 접두어 `종류 ·`로 쓴다. 유형을 늘리면 검증기·범례·패널 분류를 모두 바꿔야 한다. 필요하면 Owner가 별도로 결정한다.
- BA10은 `com:port`가 보충 노드라 핵심으로 둘 수 없다(검증기 규칙, 변이 M6). 기초 보기는 `initialImportance: [core, supplementary]`로 처음부터 11개 노드·10개 관계를 모두 보이므로 강의 화면에서는 차이가 없다. 기존 노드의 중요도는 바꾸지 않는다.
- 근거 출처 5개를 `sources`에 추가한다: RFC 791(IP), RFC 4632(CIDR), RFC 9293(TCP), RFC 9110(HTTP), 용어사전 PR #26 보고서. 기존 `rfc1918`·`b31-record`도 쓴다.
- **일부러 그리지 않은 선:** 패킷→포트(포트가 IP 정보처럼 읽힘), IP·TCP·HTTP 사이의 겹 관계(아래 CB02와 충돌), 기초 노드→AWS 노드(적용 위치는 §3.5), 공인↔사설 변환 SH01(NAT·IGW 주제이므로 기존 보기에 둠. 기초 보기는 `shared` scope를 넣지 않는다).

### 3.4 선 없는 비교 카드 3개

| ID | 제목 | 노드 | 선을 긋지 않는 이유 |
| --- | --- | --- | --- |
| CB01 | 공인 IP ≠ Public Subnet | `com:public-ip`, `aws:subnet` | 주소의 종류와 Subnet의 경로 기준은 다르다. Public Subnet 안의 EC2도 사설 IP를 가진다 |
| CB02 | IP ≠ TCP ≠ HTTP | `bas:ip`, `bas:tcp`, `bas:http` | 같은 일을 하는 셋이 아니라 한 통신에서 역할을 나눠 겹쳐 쓴다. 겹(HTTP 내용이 TCP 80 정보에, TCP 정보가 IP 패킷에)은 카드 본문으로 설명 |
| CB03 | IP 주소 ≠ 포트 | `bas:ip-address`, `com:port` | 선을 그으면 포트가 IP 주소의 일부처럼 읽힌다 |

학습 순서 2개를 추가한다. L5: IP 주소와 패킷(기초) → 공인·사설 주소와 NAT·IGW 변환(GN18·AW10·SH01). L6: IP·TCP·HTTP 역할 구분(CB02·BA10) → SG의 TCP 80 허용과 Nginx의 HTTP 응답(AW13·AW14).

### 3.5 AWS와의 연결 — `appliedIn`(상세 패널 링크)

기초 노드에 `appliedIn: [{ nodeId, view, note }]`를 둔다. 패널에서 버튼을 누르면 지정한 보기(`general` 또는 `aws`)로 전환하고 그 노드를 선택한다. 역방향으로, 어떤 노드를 가리키는 기초 노드가 있으면 그 노드의 패널에 "기초 개념으로" 링크를 계산해 보여 준다(기존 노드 데이터는 수정하지 않는다).

| 기초 노드 | 쓰인 곳 |
| --- | --- |
| 네트워크 | 회사 네트워크(일반망 예시) · VPC |
| 서브넷 | 구역별 주소 범위(일반망 예시) · VPC `10.0.0.0/16` · Public Subnet `10.0.1.0/24` |
| IP 주소 | ENI의 사설 IPv4 · IGW의 공인↔사설 1:1 변환 |
| 패킷 | Route Table(목적지로 경로) · Security Group(출발지·프로토콜·포트로 허용) |
| IP | Route Table(`0.0.0.0/0` → IGW) |
| TCP | Security Group(인바운드 TCP 80·22) |
| HTTP | Nginx(80에서 요청을 받고 응답) |

프로토타입 패널 제목 "B3-1에서 쓰인 곳"은 일반망 예시가 섞이면 틀린 말이 된다. 구현 시 제목은 **"실제 구성에서 보기"**로 하고 항목마다 `일반망 예시`/`B3-1 AWS` 표시를 붙인다.

### 3.6 보기 정의와 배치

```json
{ "id": "basics", "label": "네트워크 기초", "default": false,
  "nodeDomains": ["basics"], "sharedNodeIds": ["com:public-ip", "com:private-ip", "com:port"],
  "relationScopes": ["basics"], "initialImportance": ["core", "supplementary"] }
```

- 공통 도메인 전체를 넣으면 방문자·인터넷이 고립된다(변이 M1). 그래서 `sharedNodeIds`로 필요한 공통 노드 3개만 고른다.
- 영역: `bas-address`(order 0) · 기존 `common`(4) · `bas-protocol`(8) · `bas-roles`(9). 기존 보기에는 basics 노드가 없으므로 이 order 값은 기존 열 순서에 영향이 없다(실측 0 차이).
- 보기 버튼은 기존 세 버튼 뒤 네 번째에 둔다. 기존 버튼 위치·이름을 바꾸지 않기 위해서다. 강의 순서상 앞에 두고 싶다면 Owner가 정한다.

| 후보 | 열 순서 | 크기 | 긴 선 | 교차 관계쌍 | 판단 |
| --- | --- | --- | --- | --- | --- |
| A | 주소 · 공통 · 패킷+프로토콜 | 1158×604 | BA05 | 11 | 프로토콜 열 안에서 선이 몰림 |
| B | 공통 · 주소 · 패킷+프로토콜 | 1158×604 | BA10 | 8 | 같은 문제 |
| C | 공통 · 주소 · 패킷 · 역할 | 1536×400 | BA10 | 6 | TCP→포트 선이 주소 열을 가로지름. 공인/사설부터 시작해 강의 순서와 다름 |
| **D** | **주소 · 공통 · 패킷 · 역할** | **1536×400** | BA05, BA10 | **5** | **권장.** 교차는 주소 열 옆 통로에만 있고 프로토콜 쪽은 0 |

[1920×1080 기초 보기](../../../reports/b3-1-network-basics-map-design/captures/D-1920-light-overview.png) · [TCP 선택 상태](../../../reports/b3-1-network-basics-map-design/captures/D-1920-dark-tcp-selected.png)

### 3.7 강의 시연 순서(안)

1. `네트워크 기초` 보기 → 왼쪽 열: 네트워크 → 서브넷 → IP 주소.
2. IP 주소 선택 → 공인 IP·사설 IP(종류). CB03 "IP 주소 ≠ 포트" 카드가 포트를 점선으로 강조한다.
3. 패킷 → IP 주소(출발지·목적지). IP → 패킷(목적지까지 전달, 도착 보장 아님).
4. 네트워크 프로토콜 → IP·TCP·HTTP(역할 분담). TCP 선택 시 CB02 카드가 IP·HTTP를 비교 대상으로 표시한다.
5. TCP → 포트. 패널의 "실제 구성에서 보기 → Security Group"으로 AWS 보기 전환, "기초 개념으로"로 복귀.

## 4. 반드시 해결할 설계 쟁점 8개 — 조사 결과와 해결안

### 4.1 `basics` 도메인·보기와 검증기 호환성

- **실측:** 현재 검증기는 후보 D를 18건으로 거부한다 — 노드 ID 접두어 8(`bas:`가 접두어 표에 없음), 관계 scope 10(`basics`가 허용 scope에 없음). 그 밖의 규칙(고립·용어 ID·주소·비교 카드 등)은 통과했다.
- **해결안:** 접두어 `basics → bas:`, `SCOPE_DOMAINS.basics = {basics, common}`을 더하고 규칙 4개를 추가한다. ① `sharedNodeIds`는 존재하는 common 노드만 ② 보기의 모든 관계 끝점·경로가 그 보기에 속함(배치 계산 불가 방지) ③ `appliedIn` 대상·보기·설명 검사, 기초 노드만 사용 ④ 모든 노드가 한 보기 이상에 속함. 그리고 기존 비교 카드 규칙이 **첫 두 노드만** 검사하던 빈틈을 카드 안 모든 쌍으로 넓힌다(3노드 카드 CB02에서 발견, 변이 M5).
- 제안본은 후보 D·1차·현재 main 데이터를 모두 PASS하고 변이 8개를 모두 잡는다.
- **위치 결정 필요(Owner):** 현재 런타임 검증기는 `drafts/…/check_concept_map_v2.py`를 그대로 불러 쓰며 이 경로는 `71b8784` 보호 대상이다. 권장은 **drafts 검증기는 이력으로 보존하고 `scripts/validate_mission_concept_map.py`를 독립 런타임 검증기로 만들어 제안 규칙을 넣는 것**이다. 보호 대상 drafts 경로를 건드리지 않는다.

### 4.2 기존 공통 노드를 새 보기에서 재사용하는 방법

- 보기 정의에 `sharedNodeIds`를 추가하고, 엔진의 보기 소속 판정을 `viewHasNode(view, node)` 하나로 모은다(배치·선택·보기 전환·패널이 모두 사용).
- **실측 근거:** 현재 엔진은 `layoutForView`에서 scope만 보고 관계를 넣기 때문에, 보기에 없는 노드를 끝점으로 가진 관계가 있으면 `TypeError: Cannot read properties of undefined (reading 'y')`로 지도를 그리지 못한다. 제안 엔진은 끝점·경로가 모두 보기에 있는 관계만 배치한다. 현재 데이터에서는 이 조건이 항상 참이라 결과가 같다(E2: 0 차이).

### 4.3 `subnet` 중복 직접 연결

- 규칙 유지: 한 용어 ID의 `termIds` 소유자는 하나. 다른 노드는 `relatedTermIds`.
- **권장(B안):** 2차에서 `subnet` 직접 소유를 일반 정의 노드 `bas:subnet`으로 옮기고, `aws:subnet`은 `termIds: ["public-subnet"]` + `relatedTermIds: ["subnet"]`, `gen:zone-subnets`는 보조 연결. 근거: PR #26에서 `subnet` 본문이 일반 정의(AWS는 사례)로 바뀌었다. `aws:subnet` 패널의 용어 링크 목록·순서와 "학습 지도에서 이어 보기"(`termIds[0] = public-subnet`)는 그대로다.
- 영향: `?term=subnet`이 `aws:subnet` 대신 기초 보기의 서브넷을 연다(E6 확인). 앱 안에서 이 딥링크를 만드는 곳은 없다. 지도 검색 "subnet"은 세 노드(기초·일반망·AWS)를 도메인 표시와 함께 보여 준다.
- 대안(A안): `aws:subnet` 소유 유지, `bas:subnet`도 보조 연결만. 기존 데이터 변경은 줄지만 기초 노드에 직접 용어가 없어 검색·"학습 지도에서 이어 보기"가 약해진다.
- 1차에서는 소유를 옮기지 않는다(1차를 배치 영향 0의 링크 보강으로 유지).

### 4.4 신규 노드·관계로 인한 기존 세 보기 레이아웃 변화

- **실측:** 현재 엔진+현재 데이터 vs 제안 엔진+후보 데이터(A~D 각각), 기존 세 보기의 1,128개 상태에서 기본 배치(`layoutBasis`)와 화면 투영(`layoutConceptMap`)의 **좌표·영역·경로·크기 차이 0**. 보기별 기하 지문 `all 60c848e63ac46266` · `general bfe78b943954046a` · `aws ee7082e19cbbef17`.
- **의도된 차이 24건:** CB01 추가로 `all`·`aws` 보기에서 공인 IP 또는 Public Subnet을 고르면 상대 노드에 비교 점선 강조가 생긴다(좌표 불변). CB03은 기존 보기에서 `bas:ip-address`가 없어 강조가 생기지 않고, 포트 패널에 카드만 추가된다. Owner가 이 변화를 승인해야 한다.
- B2-1(45노드·24관계)·B6-1(11노드·12관계)의 엔진 출력도 제안 엔진에서 같다.
- 보호 방법은 §6.4.

### 4.5 지도 검색·개념 선택 시 올바른 보기 자동 전환

- **실측:** 현재 엔진에서 `node=bas:tcp`, `term=tcp`, `term=subnet`, `view=all&node=bas:ip-address`, `view=general&rel=BA03`은 모두 `전체 관계`로 가고 선택 대상이 화면에 없다. `view=basics&node=bas:subnet`은 TypeError로 그려지지 않는다. `view=basics&node=com:public-ip`도 공통 노드를 기초 보기 소속으로 인식하지 못해 `전체 관계`로 간다.
- **해결안:** `homeView(data, {node|relation})` — 대상이 `all`에 있으면 `all`, 없으면 그 대상을 보여 주는 첫 보기. `readMapState`·`changeView`(엔진)와 `selectNode`·`selectRelation`(`MissionConceptMap.tsx`)이 같은 규칙을 쓴다. 기존 노드는 항상 `all`에 있으므로 기존 동작은 그대로다. 제안 엔진에서 위 사례가 모두 올바른 보기로 열리고 선택이 보이며, 정규 URL 왕복이 같은 상태를 돌려준다(E6).
- 안내 문구: 지금은 "전체 관계 보기로 전환" 고정이다. 실제 전환한 보기 이름을 넣는다. `changeView`의 해제 안내 "전체 관계 보기에서 비교할 수 있습니다"는 기초 노드에는 틀리므로, 대상이 `all`에 없으면 "네트워크 기초 보기에서 볼 수 있습니다"로 바꾼다.
- 검색 결과의 도메인 표시에 `기초`를 추가한다(`domainLabel`). "전체 지도 보기" 초기화는 지금처럼 `all`.

### 4.6 Story·지도·사전 왕복 시 선택 상태 보존

- `mapQuery`는 `view`·`more`·`node`·`rel`·`flow`·`scene` 값을 120자 이하로 통과시킨다. `view=basics&node=bas%3Aip-address`는 그대로 통과한다. 사전→지도 복귀(`B31LearningReturn`)와 Story→지도 복귀는 이 쿼리를 `readMapState`로 다시 읽으므로, 엔진 수정 후에는 기초 보기 선택이 복원된다(URL 수준 E6 확인).
- **미검증:** 실제 브라우저에서 기초 노드 → 용어 상세 → "← B3-1 개념지도로 돌아가기", Story 카드 → 지도 → Story 복귀. Codex 3차 QA 항목이다.
- 선택 사항: Story 기초 카드 A·B의 지도 링크를 기초 보기로 바꾸는 것(`view=basics&node=bas%3Aip-address` 등). `src/b31Foundations`는 `e32f580` 별도 보호 대상이라 Owner 결정 사항으로 남긴다. 기본안은 카드 수정 없음.

### 4.7 프로토콜 일반 개념과 IP·TCP·HTTP의 구분

- 일반 개념 노드 `bas:protocol`(직접 용어 `network-protocol`)을 별도 열 "패킷과 프로토콜"에 두고, 오른쪽 열 "IP·TCP·HTTP의 역할"에 세 노드를 둔다. 연결은 `종류 · 주소와 전달 / 포트와 신뢰성 / 요청과 응답` 세 선으로, 이름표 자체가 역할 차이를 말한다.
- IP·TCP·HTTP 사이에는 선을 긋지 않고 CB02 카드가 겹 구조를 설명한다. 선과 "≠" 카드가 같은 두 노드에 동시에 걸리지 않게 했다(검증기 규칙).
- `bas:ip`는 단독 canonical이 없다(PR #26에서 등록하지 않음). 패널은 `network-protocol`·`ip-address`를 보조 용어로 연다. 새 canonical은 만들지 않는다.

### 4.8 비교 관계와 일반 관계선의 UI 정책

| 표현 | 의미 | 기초 보기 |
| --- | --- | --- |
| 실선·화살표·점선(포함/역할/연관) | 실제 관계. "종류"는 `연관` + `종류 ·` 이름표 | 10개 |
| ◇ "≈ 대응" 선 | 일반망 ↔ AWS 비슷한 역할(교차 관계) | 없음(전체 관계 보기 전용 유지) |
| "≠" 비교 카드 | 혼동하기 쉬운 두 개념. **선 없음.** 선택 시 상대 노드 주황 점선 강조 + 패널 카드 | CB02·CB03(+ CB01은 전체·AWS 보기) |
| 상세 패널 링크 | 적용 위치(`appliedIn`), 관련 용어, 관련 Scene | 선으로 그리지 않는 나머지 관계 |

범례·사용법 문구는 지금 "일반망의 역할은 AWS에서 어떻게…"로 고정이다. 기초 보기에서는 "선은 개념 관계, ≠ 카드는 선 없이 구분, AWS 적용은 패널의 실제 구성에서 보기"로 보기별 한 줄을 보여 준다.

## 5. 강의·화면 검토 결과(임시 프로토타입)

임시 git worktree(저장소 밖, 작업 후 삭제)에 후보 데이터·제안 엔진·최소 UI 수정을 넣고 Vite로 띄워 Chrome에서 캡처했다. 오류를 기록한 14개 화면에서 콘솔 오류 0, 360px 2장을 더한 16개 화면에서 페이지 가로 넘침 0.

- 1920×1080·1280×720: 4열과 카드 글자가 "전체 보기"에서 한 화면에 들어온다. 전체 관계 보기(2508×910)보다 작아 프로젝터에서 더 크게 보인다.
- 390·360: 보기 버튼 4개가 한 줄에 들어가고 페이지 가로 넘침은 없다. 360에서 버튼 폭이 82px로 빠듯해 "AWS 네트워크"·"네트워크 기초" 글자 여백이 거의 없다 → 3차 QA에서 줄바꿈·글자 잘림을 측정한다.
- 팔레트: 지도 캔버스는 기존 정책대로 사이트 테마와 독립된 밝은 학습 팔레트다. 제안 `--cm-basics-*` 토큰의 영역 제목 대비 7.09:1(기존 공통 열 5.73:1). OS Dark 에뮬레이션에서도 캔버스는 같은 밝은 팔레트였다. **사이트 테마 선택기(4종) × Dark 조합은 미검증.**

## 6. 기술 검증·보호 계약

### 6.1 검증 결과 요약

| 실험 | 내용 | 결과 |
| --- | --- | --- |
| E1 | 현재 엔진, 현재 vs 1차 데이터, 세 보기 1,128 상태 | 차이 0 |
| E2 | 현재 데이터, 현재 vs 제안 엔진 | 차이 0 |
| E3 | 현재 엔진+데이터 vs 제안 엔진+후보 A~D | 좌표·경로 0 / 의도된 강조 24 |
| E4 | B2-1·B6-1 기하, 현재 vs 제안 엔진 | 동일 |
| E5 | 기초 보기 132 상태: 카드 관통·끝점 중복·경계·대각선·좌표 안정 | 4후보 모두 문제 0 |
| E6 | URL 9 사례 + 보기 전환 9 사례 | 현재 엔진 문제 7(선택 숨김 5·잘못된 보기 1·충돌 1) / 제안 엔진 0 |
| 검증기 | 현재 / 제안 / 변이 8 | 18 FAIL / PASS / 8 검출 |
| 화면 | 프로토타입 캡처 16장(대표 12장 보관) | 콘솔 오류 0(14장 기록), 가로 넘침 0(16장) |

### 6.2 제안 엔진 변경(최소)

[`engine.patch`](../../../reports/b3-1-network-basics-map-design/proposed-patches/engine.patch) — `conceptMapTypes.ts`(Domain·ViewId에 `basics`, `sharedNodeIds`, `appliedIn`, 라벨 3개)와 `conceptMapAdapter.ts`(`viewHasNode`·`homeView` 추가, 소속 판정 5곳 교체, 관계 끝점 보호, 전환 안내 문구). 새 그래프 엔진·배치 알고리즘 변경은 없다.

### 6.3 기존 테스트 중 의도적으로 바뀌는 것

| 파일 | 현재 단언 | 바뀌는 이유 | 권장 |
| --- | --- | --- | --- |
| `src/missionConceptMap/conceptMapAdapter.test.ts` "preserves the design except SH01" | 런타임 JSON = drafts 설계 JSON(SH01 제외) | 1차부터 데이터가 다름 | drafts를 고치지 않고 **승인된 차이 목록**(1차 4노드 필드, 2차 추가 항목, subnet 소유 이동)을 뺀 나머지가 drafts와 같음을 검사 |
| `src/b31StoryMapContent.test.ts` | 노드 36·관계 57 | 2차에서 44·67 | 보기별 수치(기존 세 보기 고정 + basics 11/10)로 바꿈 |
| `conceptMapAdapter.test.ts` 보기 루프 | `['all','general','aws']` | basics 추가 | 기존 세 보기 기대값은 그대로 두고 basics를 별도 추가 |
| `playwright/b31-network-foundations.spec.ts` 보호 테스트 | `src/missionConceptMap`·`data/mission-story-maps/main-m05`·`drafts/b3-1-visual-story`가 `71b8784`와 같음 | 1차(데이터)·2차(엔진) | 기준 통째 교체 금지. PR #26처럼 계약을 나눠 **승인 구현 커밋 기준의 새 계약**을 추가(Owner 승인) |
| `scripts/qa_b31_story_baseline.mjs` | 지도 JSON·엔진이 `410b3a0`과 바이트 동일 | 같음 | golden 덮어쓰기 금지. 기존 `B31_CONTENT_REVISION`처럼 승인 수정본 모드를 명시적으로 추가 |
| `scripts/qa_mission_learning_visuals.mjs` | 지도 파일이 `7cfdecc`와 바이트 동일 | 같음 | 위와 같음 |

`playwright/mission-concept-map.spec.ts`의 `[data-map-node]` 36개(전체·보충)는 기초 노드가 전체 보기에 없으므로 바뀌지 않는다.

### 6.4 기존 레이아웃 보호 방법

1. **0단계(구현 전, 현재 main에서):** 기존 세 보기의 기하 지문 fixture를 새 파일로 만든다 — 보기별 `layoutBasis`의 좌표·영역·경로·크기 전체와 SHA. 생성 커밋을 기록한다. 기존 golden 파일은 건드리지 않는다.
2. 각 단계에서 Vitest로 "현재 데이터+엔진의 세 보기 기하 = fixture"를 검사한다. 이번 실험의 `layout_experiment.mjs` 비교 함수를 그대로 옮기면 된다.
3. 의도된 비기하 차이(CB01 강조 24건)는 목록으로 고정해 그 외의 강조 변화도 잡는다.
4. 바이트 동일 보호 스크립트는 이력 기록으로 남기고, 기하 동일성은 위 의미 검사로 판정한다.

## 7. 구현 계획(Codex)

| 단계 | 작업 | 수정 파일 | 완료 조건 |
| --- | --- | --- | --- |
| 0 | 기하 지문 fixture·검사 추가 | 신규 fixture·테스트 | 현재 main에서 PASS |
| 1 | 기존 노드 용어 링크 | `concept-map.json`(4노드), `conceptMapAdapter.test.ts`(승인 차이 목록), 보호 계약 | 검증기 PASS, 기하 0 차이, 패널 링크 4종 확인 |
| 2a | 엔진·검증기 | `conceptMapTypes.ts`, `conceptMapAdapter.ts`, `scripts/validate_mission_concept_map.py`(독립 런타임 검증기) | E2·E4 동일, 변이 8 검출 |
| 2b | 기초 보기 데이터 | `concept-map.json`(+8노드·10관계·3비교·2학습순서·5출처·3영역·1보기, subnet 소유 이동) | 검증기 PASS, 기존 세 보기 기하 0 차이 |
| 2c | UI | `MissionConceptMap.tsx`(`selectNode`·`selectRelation`·지정 보기 이동), `ConceptMapDetailPanel.tsx`("실제 구성에서 보기"·"기초 개념으로"), `missionConceptMap.css`(`--cm-basics-*`), 보기별 사용법 한 줄 | 프로토타입 캡처와 같은 동작 |
| 3 | 검색·선택·복귀 QA | 기초 보기 Playwright 신규, 기존 지도 Playwright·B2-1·B6-1 회귀, Story↔지도↔사전 왕복, 1920/1280/1000/390/360 × 사이트 테마 4종 × Light/Dark | 기존 실패와 신규 실패 구분 기록 |
| 4 | Owner 화면 검수 | — | 강의 시연 순서(§3.7)로 실제 화면 확인, 승인 |

`ConceptMapCanvas.tsx`는 도메인 클래스를 일반적으로 만들므로 수정이 필요 없을 것으로 본다(프로토타입에서 수정 없이 동작). canonical·Story 원고·SVG·`b31Foundations`·B2-1·B6-1 파일은 수정 대상이 아니다.

## 8. 결정이 필요한 항목(Owner·GPT 검토)

1. 2차 범위: 노드 8·관계 10·비교 3·`appliedIn` 방식, CIDR을 노드로 만들지 않는 결정.
2. `subnet` 직접 소유 이동(B안) 또는 유지(A안).
3. CB01 추가로 기존 전체·AWS 보기에 생기는 선택 강조 변화.
4. 검증기 위치: drafts 보존 + scripts 독립 런타임 검증기.
5. 보호 계약 갱신 방식(새 승인 커밋 기준 계약 추가, golden 유지).
6. 보기 버튼 위치(네 번째 권장)와 Story 기초 카드 링크 변경 여부(기본: 변경 없음).
7. 노드 설명문의 기술 문장 GPT 독립 검토.

## 9. 미검증

- 실제 브라우저 Story·지도·사전 왕복(URL 수준만 확인).
- 사이트 테마 선택기 4종 × Dark, 360px 버튼 글자 잘림 측정.
- 실제 프로젝터·실물 모바일·터치, 공개 Pages.
- 교육 효과. 노드 설명문의 독립 콘텐츠 검토.
- 이번 작업은 프로덕션 변경이 없어 저장소 Vitest·Playwright 전체를 실행하지 않았다. 검증기는 현재 main 데이터에서 PASS를 다시 확인했다.
