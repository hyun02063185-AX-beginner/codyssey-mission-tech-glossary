# Scene 04 관계 검토 — 유형과 기술 정확성

> 관계 15개는 Scene 03 `concept-candidates.md`(`fd4af2b`) C1~C15와 끝점·유형·설명이 같다(`_tools/check_data.py`가 글자 단위로 대조). 근거 자료는 Scene 03 `comparison-review.md`와 같다: B3-1 배포 기록(고정 커밋 `c689299`), AWS 문서(VPC 동작 방식, IGW, Route Table, Security Group 및 규칙, ENI), NIST SP 800-41 Rev.1.

## 1. 관계별 검토

| ID | 관계 | 유형 | 표시 | 기술 확인 | 오해 방지 |
| --- | --- | --- | --- | --- | --- |
| C1 | VPC ⊃ Subnet | 포함 | 영역 겹침 | AWS VPC 동작 방식: Subnet은 VPC 안의 IP 주소 범위 | — |
| C2 | Subnet ⊃ EC2 | 포함 | 영역 겹침 | 배포 기록: EC2를 Public Subnet에 생성 | — |
| C3 | EC2 – ENI | 연관(연결) | 점선 "연결" | AWS ENI 문서: ENI는 VPC 안의 논리적 구성요소로 인스턴스에 연결(attach)되며, 주 ENI는 분리할 수 없다 | ENI를 EC2 영역 **밖**(Subnet 안)에 두어 "EC2 안의 부품"으로 보이지 않게 했다 |
| C4 | EC2 ⊃ Nginx | 포함(실행) | 영역 겹침 + "포함 · 실행" | 배포 기록: EC2에 Nginx 설치·실행 | Nginx 상자에 "EC2 안에서 실행" |
| C5 | IGW – VPC | 연관(연결) | IGW가 VPC 경계에 걸침 + "VPC에 연결" | AWS IGW 문서: VPC에 연결(attach)해야 사용 | IGW를 라우터 장비 아이콘으로 그리지 않았다 |
| C6 | Route Table – Subnet | 연관(연결) | 점선 "Subnet에 연결" | AWS Route Table 문서, 배포 기록(명시 연결) | 요청 화살표와 만나지 않는다 |
| C7 | Route Table – IGW | 연관(경로 대상) | 점선 "경로 대상" | 배포 기록 `0.0.0.0/0 → IGW` | 노드 보조 설명 "규칙표" |
| C8 | Security Group – ENI | 연관(적용) | 점선 "적용" | AWS SG 문서, ENI 문서(ENI 속성에 SG) | SG를 VPC 경계에 두지 않았다 |
| C9 | ENI – Private IPv4 | 연관(할당) | 점선 "할당" | AWS ENI 문서(주 사설 IPv4), IGW 문서(인스턴스는 사설 주소만 안다) | — |
| C10 | IGW – Public IPv4 | 연관(변환 주체) | 점선 "주소 변환" | AWS IGW 문서: Public IPv4 목적지를 Private IPv4로 바꿔 전달하고, 나갈 때는 반대로 바꾼다 | — |
| C11 | Public IPv4 – Private IPv4 | 연관(1:1 주소 쌍) | 점선 "1:1 짝" | AWS IGW 문서 "one-to-one NAT" | **대응선(보라)으로 그리지 않았다.** 비슷한 역할이 아니라 IGW가 맺는 주소 쌍이다 |
| C12 | 외부 방문자 → Nginx | 흐름 | 초록 화살표 3구간(인터넷 → IGW → ENI → Nginx) | 배포 기록, AWS IGW 문서 | 직선 한 줄로 건너뛰지 않았다. 인터넷은 노드가 아닌 "인터넷 경유" 표시다 |
| C13 | 경로 선택 ≈ Route Table | 대응 | 보라 점선 ≈ | AWS Route Table 문서 | 역할 노드 → AWS 노드. 장비(라우터)와 잇지 않았다 |
| C14 | 접근 통제 ≈ Security Group | 대응 | 보라 점선 ≈ | NIST §2.1.2, AWS SG 문서 | 적용 위치 차이는 C8 "적용"이 보여 준다 |
| C15 | 주소 변환 ≈ IGW | 대응 | 보라 점선 ≈ | AWS IGW 문서 | NAT Gateway는 노드에 없다. 각주에 "같은 것 아님" |

## 2. 데이터 QA (`_tools/check_data.py`)

| 항목 | 결과 |
| --- | --- |
| 노드 ID 중복 / 관계 ID 중복 / 표시 이름 중복 | 0 / 0 / 0 |
| 관계 끝점이 실제 노드 | 통과(15/15) |
| 관계 유형이 여섯 가지 안 | 통과: 포함 3, 연관 8, 흐름 1, 대응 3(선행·역할은 쓰지 않음) |
| 고립 노드 | 0 |
| 용어사전 ID 실재 | 통과. 연결 9개: `virtual-private-cloud`, `subnet`, `public-subnet`, `route-table`, `internet-gateway`, `public-ip`, `security-group`, `amazon-ec2`, `nginx`. 흐름 관계에 `http-request-response`, `port-80-http` |
| 용어사전 ID가 없는 노드 | 외부 방문자, Private IPv4, ENI, 경로 선택, 접근 통제, 주소 변환 — **임의 ID를 만들지 않았다** |
| 자동 연결 금지 | `nat-gateway`, `firewalld`, `access-control`(역할 노드 '접근 통제'와 뜻이 같은지 확인하지 않았다) |
| 대응의 방향 | 세 개 모두 일반망 역할 노드 → AWS 노드(장비 ↔ 자원 동일시 방지) |
| 흐름 경로 | `path`의 처음·끝이 from·to와 같다. `@internet`은 설명이 있는 경로 표시 |
| 학습 순서 | L1~L3의 참조(장면·관계 ID)가 모두 존재한다. 관계 그래프에 선행 유형 없음 |
| Scene 03 후보와 대조 | 노드 14개 이름, 관계 15개의 끝점·유형·설명 일치 |

## 3. 같은 기술의 중복 정의 여부

- 일반망의 '주소 변환'(역할)과 IGW의 1:1 변환은 다른 노드이고 대응(≈)으로만 잇는다. 'NAT' 노드를 따로 두지 않았다.
- 'Subnet' 하나에 `subnet`·`public-subnet` 두 ID를 달았다. B3-1의 Subnet은 Public Subnet 하나뿐이어서 같은 대상이다. 웹 통합 때 노드를 고르면 어느 쪽을 먼저 열지는 Owner가 판단한다.
- 'Route Table'의 `route-table`은 AWS Route Table 항목이다. 일반망 '경로 선택'에는 연결하지 않았다.

## 4. 기존 기술지도(network-web-protocol)와의 비교 메모 — 수정하지 않음

| 항목 | 기존 지도·B3-1 오버레이 | Scene 04 |
| --- | --- | --- |
| 목적 | 분야 전체를 넓게 탐색 | B3-1 스토리에서 설명한 것만 |
| 노드 ID | `term:<termId>` | 용어 노드도 `b31:<이름>`. `termIds`로 용어사전에 잇는다. 역할 노드는 `role:<이름>` |
| 관계 어휘 | `is_a`, `based_on`, `uses`, `interacts_with`, `prerequisite`, `provided_by`, `compare_with` | 표준 6종(포함·선행·역할·흐름·대응·연관) |
| NAT Gateway | 오버레이에 `term:nat-gateway` 포함 | **넣지 않음**(B3-1에서 만들지 않음) |
| 같은 쌍의 관계 | `route-table uses internet-gateway`, `route-table interacts_with subnet`, `public-ip interacts_with internet-gateway`, `public-subnet is_a subnet` | C7 경로 대상, C6 연결, C10 주소 변환, Subnet 한 노드에 두 ID |
| 학습 선행 | `prerequisite` 관계로 그래프 안에 있음 | 그래프 밖 `learningOrder` |

두 지도의 관계 어휘를 맞출지, Scene 04를 기존 지도의 B3-1 오버레이와 어떻게 이을지는 모든 미션 스토리맵을 정비한 뒤 검토한다(확정 정책).
