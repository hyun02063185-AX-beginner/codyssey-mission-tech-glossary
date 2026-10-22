# 05 · 콘텐츠 QA — 기술 정확성 · 장면 일치 · 관계 · 용어사전 ID

> 대상: [concept-map-v2.json](concept-map-v2.json)과 01~04 문서. 검사 도구: `_tools/check_concept_map_v2.py`(`python -I -X utf8`). **자체 승인이 아니다.** Owner와 GPT 독립 검토가 필요하다. 실제 화면 구현과 사용자 시험은 하지 않았다.

## 1. 근거 자료 확인 상태

| 자료 | 이번 작업에서 한 일 | 사용한 내용 |
| --- | --- | --- |
| B3-1 배포 기록·README (`Codyssey_B3-1` `c689299`) | 로컬 저장소에서 고정 커밋의 원문을 다시 읽음(계정·리소스 ID·주소는 가린 채 확인) | 서울 리전, VPC `10.0.0.0/16`, Public Subnet `10.0.1.0/24`, IGW를 VPC에 연결, Route Table `0.0.0.0/0 → IGW` + Subnet 명시 연결, SG inbound HTTP 80 `0.0.0.0/0`·SSH 22 생성 당시 지정 IP `/32`·outbound all, EC2 Amazon Linux 2023 x86_64 `t3.micro` + private IP + 자동 할당 Public IPv4, Nginx가 `/var/www/b3-1`에서 `dist` 제공, `nginx -t`·localhost HTTP 200·외부 확인, 기본 NACL 유지, "NAT Gateway, ELB, RDS, EIP, Snapshot은 만들지 않는다" |
| AWS IGW 문서 | 원문 다시 확인 | "allows communication between your VPC and the internet", "you must attach it to a VPC and configure routing", public subnet 정의, "Your instance is only aware of the private (internal) IP address space", "logically provides the one-to-one NAT on behalf of your instance", 목적지 주소를 사설 IPv4로 바꿔 VPC로 전달 |
| AWS Security Group 문서 | 원문 다시 확인 | 연결된 자원의 트래픽을 통제, "Security groups are stateful … Responses to allowed inbound traffic are allowed to leave the instance, regardless of the outbound rules", SSH 22는 특정 IP 범위만 허용 권장 |
| AWS ENI 문서 | 원문 다시 확인 | "logical networking component in a VPC that represents a virtual network card", 속성: 주 사설 IPv4·공인 IPv4 1개·보안 그룹, "You can't detach a primary network interface", "When you launch an instance, the IP address is assigned to the primary network interface", 중지 시 공인 IP 해제 |
| AWS VPC 동작 방식·Route Table·SG 규칙 문서 | 다시 열지 않음. Scene 03 `comparison-review.md`의 확인 기록 재사용 | VPC 논리적 격리, Subnet = VPC 안의 IP 주소 범위, Route Table = routes 모음, 명시 연결, SG 허용 규칙만 |
| NIST SP 800-41 Rev.1 | 다시 추출하지 않음. Scene 01·02 `terminology-review.md`의 원문 대조 기록 재사용 | §2.1 NAT는 routing technology, §2.1.2 상태 추적, §3.1 방화벽이 라우터 역할·NAT는 보안 기능이 아님·pinholing, §5 |
| NIST CSRC DMZ, RFC 1918·5737 | 이전 기록 재사용 | DMZ 정의가 여러 개, 사설·문서용 주소 |

## 2. 기술 검증 (지시서 §14)

| 항목 | 결과 | 근거 |
| --- | --- | --- |
| 일반망 장비와 기능의 구분 | **통과** | 장비 3(라우터·방화벽·스위치) / 기술 1(NAT) / 역할 6(경로 선택·접근 통제·주소 변환·상태 추적·같은 구역 안 연결·웹 서비스 제공)을 모두 다른 노드로 두고 '역할' 관계 8개로 잇는다. 방화벽 한 장비에 역할 4개(GN13~GN16) |
| AWS 자원과 일반망 개념을 동일시하지 않음 | **통과** | 일반망 ↔ AWS 관계는 교차 대응 7개뿐이며 모두 `comparisonNote`(공통점·차이점)가 있다. 대응 끝점에 장비 없음(검사). '같다고 보면 틀리는 것' 6개는 선 없이 비교 카드 |
| 일반망 내부 관계가 Scene 01·02와 일치 | **통과** | 구역·장비·주소·규칙·NAT 동작이 Scene 01·02 그림 글자와 같다(4절). 흐름 GF01·GF02의 경로는 A1~A5·R1~R5와 같다. 방화벽 안 처리 순서는 관계로 두지 않았다 |
| AWS 내부 관계가 실제 B3-1 배포 기록과 일치 | **통과** | 1절 기록 항목과 노드·관계 대조. AW01~AW10·AF01은 이전 C1~C10·C12와 설명이 같다(이전 C1~C15는 Scene 03 후보와 글자 단위로 같음이 확인된 문장) |
| 교차 관계에 잘못된 일대일 대응 없음 | **통과** | 경계 라우터 ↔ IGW, DMZ ↔ Public Subnet, NAT ↔ NAT Gateway, 방화벽 ↔ SG, 공개 웹 서버 ↔ EC2 모두 선 없음(검사기가 비교 카드 쌍에 관계선이 없음을 확인). 대응은 역할·영역·주소 범위 수준 |
| 설명용 DB 서버 등이 B3-1에 배포된 것처럼 보이지 않음 | **통과** | 일반망 구역·장비·서버 14개 모두 `implementationStatus: general-example` + `b31Note`("B3-1에서 구현하지 않음"). AWS 노드는 `b31-deployed`만(검사). 03-B 장면에 일반망 노드가 나온다고 적힌 곳 없음(검사) |
| B3-1에 없는 구성이 실제 노드로 들어가지 않음 | **통과** | NAT Gateway·로드 밸런서·RDS·Elastic IP·NACL·EBS·IAM 이름의 노드 0(검사). NAT Gateway는 CT06의 외부 참조(`inB31: false`) |
| 공개하지 않는 값 | **통과** | 공인 주소·작업자 IP·사설 IP 실제값·계정 ID·리소스 ID 패턴 0건(검사) |

### 2-1. 판단이 갈릴 수 있어 Owner에게 넘기는 기술 표현

| 위치 | 표현 | 판단 근거 | 대안 |
| --- | --- | --- | --- |
| CR03 · `aws:igw` | IGW의 변환을 "AWS 문서 표현: one-to-one NAT"라고 적고, NAT와는 '주소 변환' 역할 노드를 거쳐 **대응**으로만 잇는다 | AWS 문서가 NAT라는 낱말을 쓰므로 숨기지 않는다. 그러나 IGW → NAT를 '역할'로 이으면 IGW가 일반망 NAT 장비의 한 종류처럼 보인다(Scene 03 판단 계승) | IGW → NAT '역할' 관계를 더하고 비교 카드로 차이를 설명 |
| GN13 | 방화벽 → 경로 선택("구역 사이 길 안내") | NIST SP 800-41 §3.1·§5 "firewalls usually act as routers". 이 예시를 라우팅 방화벽으로 그린 Scene 01 결정을 따름 | — |
| GN23 | "인터넷에서 들어오는 연결이 닿을 수 있는 구역은 DMZ뿐이다" | Scene 01 규칙 예시(허용: 인터넷 → 웹 서버만, 차단: 인터넷 → 저장·업무망) 안에서만 참이다. 설명에 "규칙 예시"를 붙였다 | — |
| `com:public-ip`·`com:private-ip` | 일반망과 AWS의 주소를 공통 노드 하나로 | 같은 주소 개념의 중복 등록을 피하려고(지시서 §5). 체계별 차이는 관계와 `perSystem`에 | 일반망 '공인·사설 IP'와 AWS 'Public·Private IPv4'를 따로 두고 대응으로 잇기(이전 방식에 가까움) |
| AW15 | ENI → 공인 IP '할당(주 ENI)' | AWS ENI 문서 원문. 03-A 그림의 "ENI (사설·공개 IPv4)"와 같다. 03-B "ENI · Private IPv4"와 함께 읽으면 운영체제는 사설 주소만 안다는 점을 설명에 적었다 | 보충이므로 기본 화면에는 없다 |

## 3. 관계 데이터 검증 (`check_concept_map_v2.py`)

```
노드 36개 (핵심 23 · 보충 13)
  aws: 핵심 8, 보충 2
  common: 핵심 4, 보충 1
  general: 핵심 11, 보충 10
관계 57개
  general: 33 (핵심 14 · 보충 19) 역할 8, 연관 12, 포함 11, 흐름 2
  aws: 16 (핵심 11 · 보충 5) 연관 10, 포함 5, 흐름 1
  cross: 7 (핵심 5 · 보충 2) 대응 7
  shared: 1 (핵심 1 · 보충 0) 연관 1
비교 카드 6개, 학습 순서 4개
  보기 all     core: 노드 23, 관계 31, 고립 0
  보기 all     full: 노드 36, 관계 57, 고립 0
  보기 general core: 노드 15, 관계 15, 고립 0
  보기 general full: 노드 26, 관계 34, 고립 0
  보기 aws     core: 노드 12, 관계 12, 고립 0
  보기 aws     full: 노드 15, 관계 17, 고립 0
  연결한 용어사전 ID 12개: amazon-ec2, cloud-region, default-route-any-ipv4, internet-gateway, nginx, public-ip, public-subnet, route-table, security-group, socket-port, subnet, virtual-private-cloud
  용어사전 ID가 없는 노드 25개
PASS ID·끝점·유형·범위·흐름 경로·용어사전 ID·장면·구현 상태·비공개 값·보기별 고립·비교 카드·이전 Scene 04 대조
```

| 검사 항목(지시서 §14) | 결과 |
| --- | --- |
| 노드·관계 ID 중복 없음 | 통과(비교 카드 ID와의 충돌 포함) |
| 모든 관계의 양 끝 노드가 존재 | 통과(57/57). 흐름 경로 노드도 모두 존재 |
| 관계 유형이 허용된 여섯 가지 안 | 통과. 선행 0(학습 순서 L1~L4로 분리) |
| 관계 설명이 장면 내용과 일치 | 통과: 데이터에 적은 IP 주소·주소 범위가 모두 Scene 01~03 그림 글자에 있다(자동). 문장 대조는 4절(수동) |
| 기존 용어사전 ID 실재 | 통과. 노드 12개 ID + 관련 ID(`https`·`port-80-http`·`port-22-ssh`·`http-request-response`·`default-route-any-ipv4`) 모두 실재. 자동 연결 금지 5개(`nat-gateway`·`firewalld`·`access-control`·`elastic-ip`·`access-control-list`) 미사용. 한 ID를 두 노드가 쓰지 않음 |
| 일반망·AWS·교차 관계 분류 | 통과. scope와 끝점 domain 일치, 교차는 일반망 → AWS·대응만, common끼리는 shared |
| 각 보기의 고립 핵심 노드 | 통과. 보기 3 × 표시 수준 2 = 6경우 모두 고립 0 |
| 의도적으로 숨긴 관계의 근거 | 02-relationship-design.md 2-3절(일반망)·4-4절(교차), 01-concept-inventory.md 7절 |
| 검사기 자체의 검출력 | 일부러 틀린 사본(장비 ↔ IGW 대응, 범위 어긋남, 금지 ID, NAT Gateway 노드, 공인 주소, 지운 관계)으로 돌려 14개 FAIL을 모두 냈다(사본은 임시 폴더에서 만들고 저장소에 남기지 않음) |

**인터넷 노드.** 인터넷은 흐름 경로(GF01·GF02·AF01)로만 이어진다. 검사기는 흐름이 지나는 노드를 연결된 것으로 본다. 인터넷은 두 체계의 요청이 함께 지나는 곳이라 의도한 구조다. 선택하면 세 흐름의 해당 구간이 강조된다(03-interaction-spec 5-1).

## 4. 장면 일치 — 수동 대조

| 데이터 | 장면 글자 | 일치 |
| --- | --- | --- |
| 구역 5개 이름·주소(GN02~GN04, GN29, 노드 요약) | Scene 01·02 "2 경계 · 회사망의 출입구", "3 공개 서비스 구역 (DMZ) 172.16.10.0/24 · 외부 공개용 서버만", "4 자료 저장 구역 10.20.30.0/24 · 외부 공개 안 함 · 중요 자료", "5 내부 업무망 192.168.10.0/24 · 직원 전용 · 외부 공개 안 함" | 같음 |
| 장비 배치(GN05~GN11) | Scene 01 장비 상자와 구역 | 같음 |
| 라우터·방화벽 기능(GN12~GN16) | 이름표 "경로 선택" / "NAT · 허용·차단 판단 · 구역 사이 길 안내" | 같음 |
| NAT 동작(GN18, `gen:nat`) | "주소 바꾸기 · 미리 설정한 규칙대로 · 방화벽의 인터넷 쪽에서 · 들어올 때 203.0.113.10 → 172.16.10.10 · 나갈 때 (직원 PC) → 회사 공인 주소 · 이 예시에서는 내부 구역 사이 주소를 바꾸지 않음 · 허용·차단은 하지 않음", Scene 02 "응답: 출발 주소 172.16.10.10 → 203.0.113.10" | 같음 |
| 규칙(GN23·GN25·GN26·GN31·GN24) | "허용 · 인터넷 → 웹 서버 · 웹 80·443만", "차단 · 먼저 연결 시작 차단 · 인터넷 → 저장 구역 · 인터넷 → 업무망 · DMZ → 업무망" | 같음 |
| 경로표(GN12) | "경로표 예 (경계 라우터) 203.0.113.0/24 → 방화벽 쪽" | 같음 |
| 상태 추적(GN15·GN28) | "맞으면 통과, 연결 기록", "허용된 연결의 응답", "웹 서버가 인터넷으로 새 연결을 먼저 시작할 수 있다는 뜻이 아닙니다" | 같음 |
| DB 조회(GN27) | "웹 서버의 DB 조회, 직원의 게시처럼 꼭 필요한 구역 사이 연결은 방화벽 규칙으로 따로 허용하며 이후 그림에서 봅니다" | 같음. 흐름이 아닌 연관 |
| 흐름 GF01·GF02 | A1~A5(방문자 → 인터넷 → 경계 라우터 → 방화벽 → DMZ 스위치 → 공개 웹 서버), R1~R5 | 같음 |
| 처리 순서 | "4·5의 처리 순서는 장비·정책마다 다름" | 관계로 두지 않음 |
| AWS 구성(AW01~AW15, AF01) | 03-A "VPC 10.0.0.0/16 · IGW VPC를 인터넷과 연결 · 1:1 IPv4 변환 · Route Table 0.0.0.0/0 → IGW · Subnet에 연결 · Security Group HTTP 80 모두 허용 · SSH 22 지정 IP · ENI에 적용 · EC2 Amazon Linux 2023 t3.micro · ENI (사설·공개 IPv4) · Nginx HTTP 80", 03-B W1~W4·설정 ①~⑥ | 같음 |
| 교차 대응(CR01~CR06) | 03-A 비교선 6개 "≈ 네트워크 영역 · 주소 변환 · 경로 결정 · 접근 통제 · 웹 서버 · 주소 구역 분리" | 6개 모두 대응으로 있음. "웹 서버"는 공개 웹 서버 → 웹 서비스 제공(역할) → Nginx로 옮겼다. CR07(상태 추적 ≈ SG)은 새로 더한 보충 대응(근거 Scene 02 + AWS SG 문서) |
| 비교 카드(CT01·CT02·CT04·CT06) | 03-A 주의 카드 4장 | 같음 |
| 미구현 목록(`notInB31`) | 03-A "B3-1에서 구현하지 않음 · AWS에서 불가능하다는 뜻 아님" 4줄 | 같음 |

## 5. 기존 자료와의 차이 기록 (수정하지 않음)

| 위치 | 기존 표현 | 이번 데이터와의 차이 | 의견 |
| --- | --- | --- | --- |
| 개념 연결 `network-aws-role-comparison` 그림 | 엣지 "igw → ec2: Public IPv4 경로", "security-group → ec2: 네트워크 인터페이스 접근 통제" | 이번 데이터는 IGW → ENI(흐름), SG → ENI(적용)로 ENI를 따로 둔다 | 같은 사실의 단순화다. 패널에서 이 연결로 갈 때 학습자가 차이를 볼 수 있다. 개념 연결 수정 여부는 Owner 판단 |
| 같은 연결 "B3-1 실제 요청 흐름" 문단 | "브라우저 → Public IPv4 → Internet Gateway → Route Table의 0.0.0.0/0 → IGW → Public Subnet → Security Group의 HTTP 80 허용 여부 → EC2의 Nginx" | 이번 데이터와 Scene 03은 **Route Table·SG를 요청이 통과하는 단계로 두지 않는다**(Scene 03 제외 목록 "요청이 Route Table을 통과하는 흐름: 사실이 아니다") | 확인 순서를 적은 문장으로 읽을 수도 있지만 화살표가 통과 순서처럼 보인다. 수정 권장(Owner 판단) |
| 같은 연결 첫 문단 | "일반 네트워크의 내부 논리 네트워크는 VPC에 … 대응" | 이번 데이터는 회사 네트워크 ≈ VPC(CR05) | 뜻은 같다 |
| 기술 지도 `network-web-protocol` B3-1 overlay | `term:nat-gateway`를 B3-1 노드로 포함 | B3-1은 NAT Gateway를 만들지 않았다 | Scene 04 1차 검토에 이미 기록됨. 기술 지도 데이터는 수정 금지 |
| 용어사전 `default-route-any-ipv4` 요약 | "어떤 IPv4 destination과도 일치하지 않을 때 쓰는 0.0.0.0/0 route" | 0.0.0.0/0은 모든 목적지와 일치하며, 더 구체적인 경로가 없을 때 쓰인다 | 표현이 거꾸로 읽힐 수 있다. 노드 요약은 "더 구체적인 경로에 맞지 않는 모든 IPv4 목적지"로 썼다. 용어사전 수정 여부는 Owner 판단 |

## 6. 사용성 설계 검증 (설계 검토이며 사용자 시험이 아님)

| 질문 | 설계상 답 | 남은 위험 |
| --- | --- | --- |
| 일반망 보기만으로 일반망 관계를 이해할 수 있나 | 노드 26·관계 34, 2절 질문 1~7이 모두 일반망 보기 안의 관계로 답해진다(02 문서 2-1). 비교 카드 CT03·CT05도 일반망 노드끼리 | 노드 26개는 이전 지도(14)보다 많다. 지역 3개로 나눠 읽기 순서를 준다 |
| AWS 보기만으로 AWS 관계를 이해할 수 있나 | 노드 15·관계 17. 03-B 설정 ①~⑥이 모두 관계로 있다(① AF01, ② AW05, ③ AW06·AW07, ④ AW09·AW10·SH01, ⑤ AW08·AW13, ⑥ AW04·AW14) | 역할 노드가 숨으므로 "Route Table이 왜 필요한가"의 일반망 비유는 패널 글로만 보인다 |
| 전체 보기에서 두 체계의 연결 이유가 드러나나 | 첫 화면 핵심 23개 중 교차 대응 5개가 보이고, 모두 역할·영역 노드에서 출발한다. 공통 노드(방문자·인터넷·주소)를 두 흐름이 함께 지난다 | 교차선 길이. 영역 순서(역할 → 공통 → AWS 설정)로 줄였으나 실제 배치 확인 필요 |
| 노드 선택 시 연결 관계를 쉽게 파악하나 | 기존 강조·약화 규칙 + 유형별 선 모양 + 패널의 유형별 묶음 | 방화벽은 관계가 많다(핵심 보기 4, 전체 7 — 흐름 경로 포함). 패널 묶음으로 대응 |
| 설명 패널이 관계 이해에 도움이 되나 | 관계마다 '왜'(description), 교차 관계마다 공통점·차이점, 비교 카드 | 항목이 10개라 하단 시트(43vh)에서 길다 |
| 모바일 탐색이 가능한가 | 기존 하단 시트 + 목록 보기(새 제안) + 모바일 첫 화면을 일반망 보기로(제안) | **미검증.** 360px 실물 확인 필수 |

## 7. 미검증

- 화면 구현, 배치(교차선 길이·겹침), 실제 브라우저·휴대전화, 학습자 이해도 — 다음 단계.
- AWS VPC 동작 방식·Route Table·SG 규칙 문서와 NIST SP 800-41 원문은 이번에 다시 열지 않았다(이전 장면 기록 재사용).
- 현재 AWS 자원 상태(2026-10-14 기록 기준).
- 용어사전 각 항목 본문이 이 지도 설명과 모순되지 않는지(요약만 확인).
