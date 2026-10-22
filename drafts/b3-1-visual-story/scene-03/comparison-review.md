# Scene 03 비교 검토 — Revision 1

> 실제 B3-1 구성은 `Codyssey_B3-1` 커밋 `c68929943f1904a5c7c8033d2d49a30ace56e3d1`의 `docs/deployment-log-2026-10-14.md`와 `README.md` 기준이다. 현재 AWS 상태를 확인한 것이 아니다. 계정 ID, 리소스 ID, 공인 IPv4, 작업자 IP는 그림에 넣지 않았다.

## 1. 근거 자료

| 자료 | 확인 방법 | 사용한 내용 |
| --- | --- | --- |
| B3-1 배포 기록·README | 고정 커밋 원문을 내려받아 읽음 | VPC `10.0.0.0/16`, Public Subnet `10.0.1.0/24`, IGW를 VPC에 연결, Route Table `0.0.0.0/0 → IGW`와 Subnet 명시 연결, SG inbound HTTP 80 `0.0.0.0/0`·SSH 22 생성 당시 지정 IP `/32`·outbound all, EC2 Amazon Linux 2023 x86_64 `t3.micro`, private IPv4와 자동 할당 Public IPv4, Nginx가 `/var/www/b3-1`에서 `dist` 제공, 서울 리전, 기본 NACL 유지, "NAT Gateway, ELB, RDS, EIP, Snapshot은 만들지 않는다", "Public IP, SG, NACL, 서비스 listen 상태도 필요" |
| B3-1 `docs/architecture.png` | 이미지 확인 | "PLANNED TOPOLOGY - AWS resources not created or verified". **근거로 쓰지 않음** |
| AWS 인터넷 게이트웨이 문서 | 원문 확인 | "allows communication between your VPC and the internet". 인터넷의 자원도 Public IPv4로 연결을 시작할 수 있다. "logically provides the one-to-one NAT on behalf of your instance". 인스턴스는 VPC·Subnet의 사설 주소만 안다. Public IPv4로 오는 트래픽은 VPC로 전달되기 전에 목적지가 Private IPv4로 바뀐다. IGW 경로가 있는 Route Table에 연결된 Subnet = public subnet. 경로가 없으면 Public IP가 있어도 통신할 수 없다 |
| AWS Security Group 문서·규칙 문서 | 원문 확인 | 연결된 자원으로 오가는 트래픽을 통제한다. "Security groups are stateful". 네트워크 인터페이스에 연결한다. "You can specify allow rules, but not deny rules." |
| AWS Route Table 문서 | 원문 확인 | routes라는 규칙의 모음으로, Subnet이나 게이트웨이에서 나가는 트래픽의 방향을 정한다. Subnet은 명시 연결하지 않으면 main route table에 연결된다 |
| AWS ENI·EC2 IP 주소 문서 (2026-10-22 독립 QA 보완 때 원문 확인) | 원문 확인 | ENI는 "a logical networking component in a VPC that represents a virtual network card"이며 인스턴스에 attach한다. 주 ENI는 분리할 수 없다. 속성: 주 사설 IPv4, "One public IPv4 address", Security groups. 인스턴스 시작 시 Public IPv4는 주 ENI에 할당된다. "You associate security groups with network interfaces" |
| AWS NAT Gateway 문서 (같은 날 원문 확인) | 원문 확인 | "A NAT gateway is a Network Address Translation (NAT) service" — 사설 Subnet 인스턴스가 밖으로 연결할 때 쓰는 별도 서비스. IGW의 1:1 변환과 다르다 |
| AWS VPC 동작 방식 문서 | 원문 확인 | VPC는 계정 전용 가상 네트워크이며 다른 가상 네트워크와 논리적으로 격리된다. Subnet은 VPC 안의 IP 주소 범위다 |
| NIST SP 800-41 Rev.1 | Scene 01·02 때 원문 추출 | 방화벽의 상태 추적(§2.1.2), NAT는 보안 기능이 아님(§2.1·§3.1), DMZ는 라우팅 방화벽의 인터페이스(§3.1) |

## 2. 03-A 비교선 6개 검증

| 비교 | 일반망 | B3-1 AWS | 비슷한 역할 | 같지 않은 점(그림에 표시한 곳) | 판정 |
| --- | --- | --- | --- | --- | --- |
| ≈ 네트워크 영역 | 회사 네트워크 | VPC `10.0.0.0/16` | 조직이 주소 범위를 정하고 자원을 두는 영역 | VPC는 AWS 안의 논리적으로 격리된 가상 네트워크다(범례 "같은 장비·서비스 아님") | 정확 |
| ≈ 주소 변환 | 방화벽의 NAT 기능 | IGW의 1:1 IPv4 변환 | 공인 ↔ 사설 주소 대응 | 주의 카드 "1:1 변환 ≠ NAT Gateway": IGW가 Public IPv4 ↔ ENI의 Private IPv4를 1:1로 바꾸며, NAT Gateway는 별도 AWS 서비스다. B3-1은 NAT Gateway를 만들지 않았다 | 정확 |
| ≈ 경로 결정 | 구역 사이 길 안내(경로 선택) | Route Table `0.0.0.0/0 → IGW` | 목적지에 따라 다음 대상을 정함 | 주의 카드 "Route Table ≠ Security Group", "경계 라우터 ≠ IGW"(경로는 Route Table이 정함) | 정확 |
| ≈ 접근 통제 | 방화벽의 허용·차단 판단 | Security Group | 규칙에 맞는 연결만 허용, 상태 추적 | 비교 카드 이름 "Security Group (ENI에 적용)", 주의 카드 "Route Table ≠ Security Group"(경계 장비가 아니라 ENI에 적용되는 규칙). SG는 허용 규칙만 둔다 | 정확 |
| ≈ 웹 서버 | 공개 웹 서버 | EC2 + Nginx | 요청에 응답하는 서버 | EC2 상자 안에 ENI·Nginx를 따로 그려 컴퓨팅 자원과 프로그램을 구분했다. ENI는 EC2에 연결된 네트워크 인터페이스이며(같은 상자 = 단순화, 포함 관계 아님), 이름표는 03-B와 같은 "ENI · Private IPv4" | 정확 |
| ≈ 주소 구역 분리 | 구역마다 서브넷(구역 3~5의 주소 범위) | Subnet `10.0.1.0/24` | VPC·조직 주소 범위를 나눈 주소 구역 | 비교 대상은 "구역마다 서브넷"이라는 주소 범위 분리이며, 특정 구역(DMZ)이 아니다. Public 여부는 연결된 Route Table로 정해진다(주의 카드) | 정확 |

## 3. 직접 비교선에서 뺀 관계

| 관계 | 뺀 이유 | 대신 쓴 표현 |
| --- | --- | --- |
| 경계 라우터 ↔ IGW | 선을 그으면 IGW가 라우터 장비처럼 읽힌다. IGW는 VPC에 연결하는 구성요소이고, 경로 결정은 Route Table 규칙이 한다 | 주의 카드 "경계 라우터 ≠ IGW". 경로 결정은 "구역 사이 길 안내 ≈ Route Table" 비교선이 맡는다 |
| DMZ ↔ Public Subnet | DMZ는 공개 서비스와 내부망을 나누는 설계 개념이다. Public Subnet은 IGW 경로가 있는 Route Table에 연결된 Subnet이라는 AWS의 경로 기준이다. B3-1에는 지킬 내부망이 따로 없다 | 주의 카드 "DMZ ≠ Public Subnet". 주소 범위의 비교는 "구역마다 서브넷 ≈ Subnet"으로 따로 했다 |

검사기가 두 관계가 노트북·휴대전화 어디에도 비교선으로 없음을 확인한다.

## 4. 03-B 요청 경로와 설정 조건 검증

| 그림 | 근거 | 판정 |
| --- | --- | --- |
| 요청 W1~W4: 방문자 → 인터넷 → IGW → ENI → Nginx | 요청은 Public IPv4로 IGW에 도착하고, IGW가 목적지를 Private IPv4로 바꿔 VPC로 전달하며, EC2의 ENI를 거쳐 Nginx(TCP 80)가 받는다(AWS IGW 문서, 배포 기록) | 정확(단순화: VPC 내부 라우터·local 경로는 그리지 않음) |
| Route Table을 요청 경로 밖의 설정 카드로 둠 | Route Table은 Subnet·게이트웨이에서 나가는 트래픽의 방향을 정하는 규칙이다. 패킷이 통과하는 장비가 아니다 | 정확. 각주에 "Route Table의 0.0.0.0/0 → IGW 경로가 응답이 VPC 밖으로 나갈 다음 대상을 정함"을 적었다 |
| SG를 ENI에 적용되는 설정 카드로 둠 | SG는 연결된 자원(ENI)에 적용되는 상태 추적 규칙이다. 경계에 설치된 장비가 아니다 | 정확 |
| ① 브라우저가 EC2의 Public IPv4로 HTTP 80 요청 | 배포 기록의 외부 확인 URL(HTTP) | 정확(주소값은 표시하지 않음) |
| ② IGW를 VPC에 연결 | 배포 기록 3번, AWS 문서 "attach it to a VPC" | 정확 |
| ③ Route Table `0.0.0.0/0 → IGW` + Subnet 연결 → Public Subnet | 배포 기록 3번, AWS 문서의 public subnet 정의 | 정확 |
| ④ EC2는 Private IPv4만 알고 IGW가 1:1 변환 | AWS IGW 문서 "Your instance is only aware of the private (internal) IP address space" | 정확 |
| ⑤ SG를 ENI에 적용, inbound HTTP 80 허용, 상태 추적, NACL 기본값 | 배포 기록 4번, README, AWS SG 문서 | 정확 |
| ⑥ Nginx가 HTTP 80으로 받아 `/var/www/b3-1`의 dist 제공 | 배포 기록 8번, README | 정확 |
| "Public Subnet이라는 이름만으로는 접속되지 않음. ②~⑥이 모두 갖춰져야 ①의 요청과 응답이 오갈 수 있음" | AWS IGW 문서, B3-1 README | 정확 |

## 5. B3-1에 없는 구성요소

검사기가 AWS 쪽 요소를 방문자, 인터넷, 리전, VPC, IGW, Route Table, SG, Subnet, EC2, ENI, Nginx, 미구현 상자로 제한해 확인한다. 네 그림 모두 추가 요소 0건이다.

03-A의 "B3-1에서 구현하지 않음"(1차와 같음)은 다음과 같다.
- 직원 업무망 · 관리 화면 서버
- DB 서버 · 파일 저장 서비스
- 별도 DMZ 구성
- NAT Gateway · 로드 밸런서

"AWS에서 불가능하다는 뜻 아님"을 함께 적었다.

## 6. Scene 01·02와의 일관성

| 항목 | 결과 |
| --- | --- |
| 일반망 구역 이름·번호·서브넷 주소 | Scene 01과 같다. 03-A 구역 3~5 머리글의 주소(172.16.10.0/24 · 10.20.30.0/24 · 192.168.10.0/24)도 Scene 01과 같다 |
| 방화벽 기능 이름표·장비 이름 | Scene 01과 같다 |
| 요청 표현 | 03-B의 초록 화살표는 Scene 02 요청 표현과 같다 |
| 포트 | 일반망 HTTPS 443(Scene 02), B3-1 HTTP 80 |
| Scene 01·02 SVG | 수정하지 않았다 |
| 모순 | 발견하지 않았다 |

## 7. 단순화·생략

- VPC 내부 라우터와 local 경로, 가용 영역, EBS, IAM, 키 페어, IMDSv2는 그리지 않았다.
- 03-B에는 SSH 22를 넣지 않았다(웹 접속 조건 밖). 03-A의 SG 카드에 한 줄로 남겼다.
- NACL은 03-B ⑤의 "기본값 유지" 한 줄만 적었다.
- 응답은 그리지 않았다(Scene 02 참조, 03-B 각주).
- 03-A 일반망 구역 4·5는 장비 이름 한 줄로 줄였다(흐림).
