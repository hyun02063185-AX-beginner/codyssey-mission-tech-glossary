# 본과정 M05 기술용어 원천 추출

- 과정: 본과정
- 미션: M05 — 내가 만든 웹사이트를 인터넷에 올려 누구나 쓰게 하기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M05 — 내가 만든 웹사이트를 인터넷에 올려 누구나 쓰게 하기`
- 원천 URL: https://app.notion.com/p/3d462d4e038081a2818effeb4940d668?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| AWS | Amazon Web Services | Cloud | platform | 핵심 | 클라우드 실습 플랫폼 | 보통 |
| VPC | Virtual Private Cloud | Cloud/Network | concept/resource | 핵심 | 가상 네트워크 구성 | 좋음 |
| Public Subnet | Public Subnet | Cloud/Network | resource | 핵심 | 외부 통신 가능한 서브넷 | 좋음 |
| Subnet | Subnet | Network | concept | 핵심 | VPC 내부 네트워크 분할 | 좋음 |
| Internet Gateway | Internet Gateway | Cloud/Network | resource | 핵심 | VPC 인터넷 연결 | 좋음 |
| Route Table | Route Table | Network | resource/concept | 핵심 | 0.0.0.0/0 → IGW 경로 구성 | 좋음 |
| 0.0.0.0/0 | Default Route / Any IPv4 | Network | CIDR | 핵심 | 인터넷 기본 경로와 보안 규칙 | 좋음 |
| IGW | Internet Gateway | Cloud/Network | abbreviation | 보조 | Route Table 대상 | 보통 |
| outbound | Outbound Traffic | Network | concept | 핵심 | 인스턴스 인터넷 외부 통신 | 좋음 |
| EC2 | Amazon EC2 | Cloud | compute service | 핵심 | 웹 서버 실행 인스턴스 | 좋음 |
| SSH | SSH | Network/Security | protocol | 핵심 | EC2 원격 접속 | 좋음 |
| Nginx | Nginx | Server | web server | 핵심 | 웹 서버 실행 확인 | 좋음 |
| curl | curl | Network/Tool | command/tool | 핵심 | localhost HTTP 응답 확인 | 좋음 |
| localhost | localhost | Network | concept | 보조 | 인스턴스 내부 서비스 확인 | 좋음 |
| HTTP 200 | HTTP 200 OK | Web/Network | status-code | 보조 | 정상 응답 증거 | 좋음 |
| Security Group | Security Group | Cloud/Security | firewall policy | 핵심 | 인바운드 접근 제어 | 좋음 |
| HTTP 80 | Port 80 / HTTP | Network | port/protocol | 핵심 | 외부 웹 접속 허용 | 좋음 |
| SSH 22 | Port 22 / SSH | Network | port/protocol | 핵심 | 원격 접속 제한 | 좋음 |
| IAM | Identity and Access Management | Cloud/Security | service/concept | 핵심 | 권한·사용자·Role 관리 | 좋음 |
| 최소권한 | Principle of Least Privilege | Security | principle | 핵심 | AdministratorAccess 금지 | 좋음 |
| Role | IAM Role | Cloud/Security | identity | 핵심 | 필요 권한 범위 적용 | 좋음 |
| GET /health | Health Check Endpoint | Web/Operations | endpoint | 보조 | 외부 접속 증명 | 좋음 |
| EBS | Amazon EBS | Cloud/Storage | service | 보조 | 과금 정리 대상 | 보통 |
| Elastic IP | Elastic IP | Cloud/Network | resource | 보조 | 과금 정리 대상 | 보통 |
| HTTPS | HTTPS | Network/Security | protocol | 보조 | 보너스 요구 | 좋음 |
| Let’s Encrypt | Let's Encrypt | Security/Web | service | 보조 | HTTPS 인증서 적용 | 좋음 |
| Docker container | Docker Container | Container | concept | 보조 | EC2 내부 컨테이너 배포 보너스 | 좋음 |
| ap-northeast-2 | AWS Seoul Region | Cloud | region | 보조 | 사용 리전 | 불필요 |
| Free Tier | AWS Free Tier | Cloud/Cost | pricing concept | 보조 | 비용 관리 | 보통 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| CIDR | Network | 0.0.0.0/0와 지정 IP 대역 이해 | 좋음 |
| Public IP | Network | 브라우저 외부 접속 주소 이해 | 좋음 |
| Inbound / Outbound Rule | Network/Security | Security Group 동작 이해 | 좋음 |
| Cloud Region | Cloud | 서울 리전 선택 의미 이해 | 보통 |
| Resource Cleanup | Cloud/Operations | 실습 후 과금 방지 운영 개념 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| NAT Gateway | Cloud/Network | Public/Private subnet 확장 학습 | 좋음 |
| TLS Certificate | Security | HTTPS와 Let's Encrypt 이해 배경 | 좋음 |
| Shared Responsibility Model | Cloud/Security | 클라우드 보안 확장 개념 | 보통 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 29
- required 개념 수: 5
- related 개념 수: 3
- 웹툰 우선 후보 예: VPC, Public Subnet, Subnet, Internet Gateway, Route Table, 0.0.0.0/0, outbound, EC2, SSH, Nginx
