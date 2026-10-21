# Scene 03 비교 검토 — 일반 기업망과 B3-1 AWS의 대응과 차이

> 실제 B3-1 구성은 `Codyssey_B3-1` 커밋 `c68929943f1904a5c7c8033d2d49a30ace56e3d1`의 `docs/deployment-log-2026-10-14.md`와 `README.md` 기준이다. 현재 AWS 상태를 확인한 것이 아니다. 계정 ID, 리소스 ID, 공인 IPv4, 작업자 IP는 그림에 넣지 않았다.

## 1. 근거 자료

| 자료 | 확인 방법 | 사용한 내용 |
| --- | --- | --- |
| B3-1 배포 기록·README | 고정 커밋 원문을 내려받아 읽음 | VPC `10.0.0.0/16`, Public Subnet `10.0.1.0/24`, IGW를 VPC에 연결, Route Table `0.0.0.0/0 → IGW`와 Subnet 명시 연결, SG inbound HTTP 80 `0.0.0.0/0`·SSH 22 생성 당시 지정 IP `/32`·outbound all, EC2 Amazon Linux 2023 x86_64 `t3.micro`, private IPv4와 자동 할당 Public IPv4, Nginx가 `/var/www/b3-1`에서 `dist` 제공, 서울 리전, 기본 NACL 유지, "NAT Gateway, ELB, RDS, EIP, Snapshot은 만들지 않는다" |
| B3-1 `docs/architecture.png` | 이미지 확인 | "PLANNED TOPOLOGY - AWS resources not created or verified". **근거로 쓰지 않음** |
| AWS 인터넷 게이트웨이 문서 | 원문 확인 | "allows communication between your VPC and the internet". 인터넷의 자원도 Public IPv4로 연결을 시작할 수 있다. "logically provides the one-to-one NAT on behalf of your instance". IGW로 가는 경로가 있는 Route Table에 연결된 Subnet = public subnet. 경로가 없으면 Public IP가 있어도 통신할 수 없다 |
| AWS Security Group 문서 | 원문 확인 | 연결된 자원으로 오가는 트래픽을 통제한다. "Security groups are stateful". 네트워크 인터페이스에 연결하는 보안 그룹 수 제한이 있다(ENI 단위 적용). "acts as a virtual firewall". 규칙 문서: "You can specify allow rules, but not deny rules." |
| AWS Route Table 문서 | 원문 확인 | routes라는 규칙의 모음으로, Subnet이나 게이트웨이에서 나가는 트래픽의 방향을 정한다. Subnet은 명시 연결하지 않으면 main route table에 연결된다 |
| AWS VPC 동작 방식 문서 | 원문 확인 | VPC는 계정 전용 가상 네트워크이며 다른 가상 네트워크와 논리적으로 격리된다. "closely resembles a traditional network". Subnet은 VPC 안의 IP 주소 범위다. NAT 장치는 여러 사설 주소를 하나의 공인 주소에 대응시킨다(NAT Gateway 설명) |
| Scene 01·02 문서 | 저장소 원문 | 일반망 쪽 역할(라우팅 방화벽, NAT는 허용·차단을 하지 않음, 상태 추적) |

## 2. 비교선 7개 검증

| 비교 | 일반망 | B3-1 AWS | 비슷한 점 | 같다고 보면 틀리는 점 | 판정 |
| --- | --- | --- | --- | --- | --- |
| ≈ 네트워크 영역 | 회사 네트워크 | VPC `10.0.0.0/16` | 조직이 주소 범위를 정하고 자원을 두는 영역 | VPC는 AWS 안에서 논리적으로 격리된 가상 네트워크이며, 회사 건물의 장비·케이블이 아니다 | 정확 |
| ≈ 인터넷 연결 | 경계 라우터 | IGW | 내부 네트워크와 인터넷이 만나는 지점 | IGW는 VPC에 연결하는 구성요소다. 경로 선택은 Route Table 규칙으로 따로 한다. 라우터 장비로 그리지 않았다 | 정확(주의 문구 포함) |
| ≈ 주소 변환 | 방화벽의 NAT 기능 | IGW의 1:1 주소 변환 | 공인 주소 ↔ 사설 주소 대응 | B3-1은 NAT Gateway를 만들지 않았다. IGW는 Public IPv4가 있는 인스턴스 하나에 대해 1:1로 변환한다. 일반망 NAT의 여러 대 → 하나 대응과도 다르다 | 정확 |
| ≈ 경로 규칙 | 구역 사이 길 안내(경로 선택) | Route Table `0.0.0.0/0 → IGW` | 목적지에 따라 다음 대상을 정함 | Route Table은 Subnet에 연결된 규칙표이며 요청이 통과하는 장비가 아니다. B 부분에서 화살표와 연결하지 않았다 | 정확 |
| ≈ 접근 통제 | 방화벽의 허용·차단 판단 | Security Group | 규칙에 맞는 연결만 허용, 상태 추적 | SG는 구역 경계 장비가 아니라 ENI에 적용되는 규칙이다. 허용 규칙만 둔다(차단 규칙 없음). Subnet에는 별도의 NACL이 있다(B3-1은 기본값 유지) | 정확 |
| ≈ 주소 구역 | DMZ | Public Subnet `10.0.1.0/24` | 공개 서버를 두는 주소 구역 | Public Subnet은 "IGW 경로가 있는 Route Table에 연결된 Subnet"이라는 AWS의 경로 기준이고, DMZ는 공개 서비스와 내부망을 분리하는 설계 개념이다. B3-1에는 지킬 내부망이 따로 없어 DMZ라고 부르지 않는다 | 정확(주의 문구 포함) |
| ≈ 웹 서버 | 공개 웹 서버 | EC2 + Nginx | 요청에 응답하는 서버 | EC2는 컴퓨팅 자원, Nginx는 그 안의 웹 서버 프로그램이다 | 정확 |

**대응을 붙이지 않은 요소:** 일반망의 스위치에 해당하는 AWS 설정은 B3-1 기록에 없다. VPC 안의 local 경로는 AWS 기본값이지만 기록에 없어 그리지 않았다. 일반망의 구역 4·5(저장·업무망)는 "B3-1에 없음"으로 표시했다.

## 3. 필수 구분 사항(지시서 §5 A~E)

| 항목 | 그림의 처리 |
| --- | --- |
| A Public Subnet | 조건표 아래에 "Public Subnet이라는 이름만으로는 접속되지 않습니다. ①~④가 모두 갖춰져야 합니다"를 두었다. ①은 Public IPv4와 IGW 변환, ②는 IGW 연결과 Route Table, ③은 SG와 기본 NACL, ④는 Nginx다. B3-1 README에도 "Public IP, SG, NACL, 서비스 listen 상태도 필요"라고 적혀 있다 |
| B Security Group | Subnet 밖·VPC 안의 규칙 카드로 그리고, ENI에 "적용" 점선을 그었다. 방패 아이콘을 썼고 방화벽 아이콘은 쓰지 않았다 |
| C NAT와 IGW | IGW 카드 안의 "1:1 주소 변환 · Public ↔ Private IPv4" 이름표로 표시했다. NAT Gateway는 "B3-1에서 구현하지 않음" 상자에 넣었다 |
| D DMZ와 Public Subnet | 색을 다르게 했다(황색 / 초록). 비교 카드에 "같은 개념이 아님"을 적었다 |
| E 실제 사용 포트 | B3-1 쪽은 모두 HTTP 80이다. 각주에 "B3-1은 HTTPS 443을 설정하지 않았다. 일반망 예시(Scene 02)는 HTTPS 443"을 적었다 |

## 4. B3-1에 없는 구성요소가 그려지지 않았는가

검사기가 AWS 쪽 요소를 `방문자, 인터넷, 리전, VPC, IGW, Route Table, SG, Subnet, EC2, ENI, Nginx, 미구현 상자`로 제한해 확인한다. 노트북·휴대전화 모두 추가 요소 0건이다.

"B3-1에서 구현하지 않음" 상자에는 다음을 적었다.
- 직원 업무망 · 관리 화면 서버
- DB 서버 · 파일 저장 서비스
- 별도 DMZ 구성
- NAT Gateway · 로드 밸런서

출처는 배포 기록(NAT Gateway·ELB·RDS·EIP 미생성)과 보강 자료 그림 4(직원망·게시 화면·DB·별도 파일 저장소·DMZ 없음)다.

## 5. Scene 01·02와의 일관성

| 항목 | 결과 |
| --- | --- |
| 일반망 구역 이름·번호 | Scene 01과 같다(1 회사 밖·인터넷, 2 경계, 3 DMZ, 4 자료 저장 구역, 5 내부 업무망) |
| 방화벽 기능 이름표 | Scene 01의 NAT · 구역 사이 길 안내 · 허용·차단 판단을 그대로 썼다 |
| 장비 이름 | 경계 라우터, 방화벽, 스위치, 공개 웹 서버, DB 서버, 파일 저장소, 내부 관리 서버, 직원 PC — Scene 01과 같다 |
| 요청 표현 | Scene 02의 초록 화살표 |
| 포트 | 일반망 HTTPS 443(Scene 02), B3-1 HTTP 80 |
| 단순화 | 일반망 구역 4·5의 스위치를 생략했다(흐림 표시). 일반망은 설명용 예시라는 문구를 유지했다 |
| 모순 | 발견하지 않았다. Scene 02 "응답은 허용된 연결의 응답"과 SG의 상태 추적이 일치한다 |

## 6. 단순화·생략

- 리전 안의 가용 영역(AZ), EBS, 키 페어, IMDSv2, IAM은 그리지 않았다(이번 비교의 네트워크 역할 밖).
- NACL은 조건표의 "기본 NACL 유지" 한 줄만 적었다.
- SSH 22 규칙은 SG 카드의 한 줄로만 적었다. 작업자 IP는 표시하지 않았다.
- 응답 흐름은 그리지 않았다(Scene 02 참조).
- VPC의 local 경로와 VPC 내부 라우터는 그리지 않았다.
