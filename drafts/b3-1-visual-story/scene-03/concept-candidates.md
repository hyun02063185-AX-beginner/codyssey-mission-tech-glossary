# Scene 03 개념지도 후보 — Scene 01·02 후보와의 비교와 추가 관계

> 개념지도는 만들지 않았다. 기존 지식지도·용어사전 데이터는 읽기만 했다. 관계 유형의 뜻은 [Scene 02 후보](../scene-02/concept-candidates.md)의 기준과 같다(선행 = 학습상 먼저, 흐름 = 실제 이동).
>
> 등급: **핵심** = 입문자가 B3-1을 설명하는 데 꼭 필요함. **보충** = 사전·보충 자료로 넘김. **제외** = 지도에 넣지 않음.

## 1. Scene 01·02 후보와의 관계

| Scene 02 후보 | Scene 03에서의 처리 |
| --- | --- |
| 1·2 방문자 ↔ 웹 서버 흐름 | 일반망 쪽 유지. B3-1 쪽 흐름을 새로 추가(#10) |
| 5·7·10·11 장비 → 기능(역할) | 유지. 대응 관계의 일반망 쪽 출발점이 된다 |
| 12 공인 IP ↔ 사설 IP(대응) | B3-1의 Public IPv4 ↔ Private IPv4(#8)와 짝을 이룬다 |
| 13·14 경로 선택 ≠ 허용 판단, NAT ≠ 허용 판단 | "Route Table과 SG가 모두 필요한 이유"의 선행(#21) |
| 18~20 학습 선행 | Scene 03 선행(#20~22)으로 이어진다 |

## 2. Scene 03 관계 후보

| # | 개념 A | 개념 B | 유형 | 관계 설명 | 장면 | 기술 근거 | 기존 ID 연결 | 등급 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | VPC | Subnet | 포함 | Subnet은 VPC 주소 범위 안의 IP 주소 범위다 | 03 | AWS VPC 동작 방식 | `virtual-private-cloud`, `subnet` | 핵심 |
| 2 | Public Subnet | EC2 | 포함 | B3-1의 EC2는 Public Subnet 안에서 실행되었다 | 03 | 배포 기록, AWS 문서 | `public-subnet`, `amazon-ec2` | 핵심 |
| 3 | EC2 | Nginx | 포함 | Nginx는 EC2 안에서 실행되는 웹 서버 프로그램이다 | 03 | 배포 기록 | `amazon-ec2`, `nginx` | 핵심 |
| 4 | IGW | VPC | 연관 | IGW를 VPC에 연결해 VPC와 인터넷 사이의 통신을 가능하게 한다 | 03 | AWS IGW 문서 | `internet-gateway`, `virtual-private-cloud` | 핵심 |
| 5 | Route Table | Subnet | 연관 | Route Table은 Subnet에 연결(association)되어 그 Subnet에서 나가는 트래픽의 방향을 정한다 | 03 | AWS Route Table 문서, 배포 기록(명시 연결) | `route-table`, `subnet` | 핵심 |
| 6 | Route Table | IGW | 연관 | `0.0.0.0/0` 경로의 대상(target)이 IGW다 | 03 | 배포 기록, AWS 문서 | `route-table`, `default-route-any-ipv4`, `internet-gateway` | 핵심 |
| 7 | Security Group | ENI | 연관(적용) | SG는 EC2의 네트워크 인터페이스에 적용되어 오가는 트래픽을 통제한다 | 03 | AWS SG 문서 | `security-group` (ENI 항목 없음) | 핵심 |
| 8 | Public IPv4 | Private IPv4 | 대응 | IGW가 인스턴스를 대신해 1:1로 변환한다 | 03 | AWS IGW 문서 | `public-ip` | 핵심 |
| 9 | Public Subnet | IGW 경로 | 연관(정의 조건) | IGW로 가는 경로가 있는 Route Table에 연결되면 Public Subnet이다. 이름만으로 정해지지 않는다 | 03 | AWS IGW 문서 | `public-subnet`, `route-table` | 핵심 |
| 10 | 외부 방문자 | EC2의 Nginx | 흐름 | 요청이 인터넷 → IGW → ENI(SG 허용 판단) → Nginx로 간다(HTTP 80) | 03 | 배포 기록, AWS 문서 | `http-request-response`, `port-80-http` | 핵심 |
| 11 | 방화벽의 허용·차단 판단 | Security Group | 대응 | 둘 다 규칙에 맞는 연결만 허용하고 상태를 추적한다. 적용 위치(구역 경계 / ENI)가 다르다 | 03 | NIST SP 800-41 §2.1.2, AWS SG 문서 | `security-group` | 핵심 |
| 12 | 경로 선택(경로표) | Route Table | 대응 | 목적지에 따라 다음 대상을 정한다. Route Table은 장비가 아닌 규칙표다 | 03 | AWS Route Table 문서 | `route-table`(AWS 쪽에만 연결) | 핵심 |
| 13 | NAT(주소 변환) | IGW의 1:1 주소 변환 | 대응 | 공인 ↔ 사설 주소 대응. NAT Gateway를 만든 것이 아니다 | 03 | AWS IGW 문서 | — (`nat-gateway` 연결 금지) | 핵심 |
| 14 | 공개 웹 서버 | EC2 + Nginx | 대응 | 요청에 응답하는 서버 역할 | 03 | 배포 기록 | `amazon-ec2`, `nginx`(AWS 쪽에만) | 핵심 |
| 15 | 회사 네트워크 | VPC | 대응 | 조직이 주소 범위를 정하고 자원을 두는 영역. VPC는 논리적으로 격리된 가상 네트워크다 | 03 | AWS VPC 동작 방식 | `virtual-private-cloud` | 보충 |
| 16 | 경계 라우터 | IGW | 대응 | 내부와 인터넷이 만나는 지점. IGW는 라우터 장비가 아니다 | 03 | AWS IGW 문서 | `internet-gateway` | 보충(오해 위험이 커서 주의 문구와 함께만) |
| 17 | DMZ | Public Subnet | 대응 | 공개 서버를 두는 구역이라는 역할만 비슷하다. 설계 개념과 경로 기준으로 서로 다르다 | 03 | NIST DMZ 정의, AWS IGW 문서 | `public-subnet` | 보충(같은 개념처럼 보이지 않게 주의) |
| 18 | Subnet | NACL | 연관 | Subnet에 적용되는 상태 비추적 규칙. B3-1은 기본값을 유지했다 | 03 | 기존 가이드 2장, B3-1 README | 없음 | 보충 |
| 19 | Security Group | SSH 22 규칙 | 포함 | B3-1 SG에는 작업자 IP `/32`의 SSH 22 허용 규칙이 있었다 | 03 | 배포 기록 | `security-group`, `port-22-ssh` | 보충 |
| 20 | Scene 01·02(일반망 구조와 흐름) | Scene 03(AWS 대응) | 선행 | 일반망의 역할을 먼저 알아야 AWS 자원의 역할을 비교할 수 있다 | 01→03 | — | — | 제안(핵심) |
| 21 | 경로 선택 ≠ 허용 판단 | Route Table과 SG가 모두 필요한 이유 | 선행 | 두 판단이 다르다는 것을 먼저 이해해야 두 설정이 모두 필요함을 설명할 수 있다 | 02→03 | — | `route-table`, `security-group` | 제안(핵심) |
| 22 | 공인·사설 IP | IGW의 1:1 변환 | 선행 | 두 주소의 차이를 알아야 Public IPv4와 IGW의 관계를 설명할 수 있다 | 01·02→03 | — | `public-ip` | 제안(핵심) |

## 3. 제외 후보

| 후보 | 이유 |
| --- | --- |
| 일반 NAT 개념 ↔ `nat-gateway` 자동 연결 | `nat-gateway`는 AWS의 관리형 NAT 장치다. B3-1에 없고 일반 NAT와 같은 항목이 아니다 |
| 일반 경로표·라우터 ↔ `route-table` 자동 연결 | `route-table`은 AWS Route Table 항목이다. 대응(#12)으로만 잇는다 |
| 일반 웹 서버 ↔ `nginx` 자동 연결 | Nginx는 특정 프로그램이다. B3-1 쪽(#3·#14)에만 잇는다 |
| 일반 방화벽 ↔ `firewalld` | Linux 도구이며 이번 장면과 무관하다 |
| 스위치 ↔ AWS 대응 | B3-1 기록에 대응하는 설정이 없다 |
| 구역 4·5(DB·업무망) ↔ AWS 자원 | B3-1에서 구현하지 않았다. "AWS에서 불가"로 오해하게 할 수 있다 |
| 요청이 Route Table을 지나는 흐름(B3-1 `architecture.png`) | 계획도이며, Route Table을 통과 장비처럼 그렸다 |
| 리전·가용 영역·EBS·IAM·키 페어 | 이번 장면의 네트워크 역할 비교 밖이다(`cloud-region`, `amazon-ebs`, `ssh-key`는 다른 장면 후보) |
| HTTP 80(B3-1) ↔ HTTPS 443(예시) | 개념 관계가 아니라 사례 구분이다 |

## 4. 지도에 넣을 핵심만 고르면

설명에 꼭 필요한 최소 집합은 #1~#14와 선행 #20~#22다. 대응 관계는 #11~#14 네 개를 중심에 두고, #15~#17은 주의 문구와 함께 보충으로 둔다. 자세한 정의는 용어사전 항목으로 넘긴다.
