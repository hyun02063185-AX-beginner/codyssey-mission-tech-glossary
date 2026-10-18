# B3-1 학습 가이드 — 내 웹사이트는 어떻게 인터넷에서 열릴까?

> 대상: B3-1을 진행하는 코디세이 교육생. AWS와 네트워크를 처음 접해도 자신의 배포를 말로 설명할 수 있도록 돕습니다.
> 상태: **원고 검토 완료**. 사이트 연결과 화면 확인 범위는 [웹 연결 QA](qa-web.md)에 기록했습니다.

## 이 가이드의 범위

이 가이드의 중심 질문은 **“일반 네트워크를 구성할 때 필요한 역할이 AWS에서는 어떤 자원과 서비스에 대응하는가?”**입니다. [2장](chapters/02-network-aws-map.md)에서 먼저 전체 대응을 보고, 주소·경로·접근 규칙·서버 응답을 뒤 장에서 자세히 연결합니다. 사례는 [B3-1 배포 저장소의 2026-10-14 기록](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-1/blob/c68929943f1904a5c7c8033d2d49a30ace56e3d1/docs/deployment-log-2026-10-14.md)을 기준으로 합니다. 이는 그날 확인한 구성이지 현재 AWS 자원·IP·가동 상태의 증명이 아닙니다.

교육생마다 정적 호스팅, EC2, 다른 클라우드 서비스 등을 선택할 수 있습니다. 이 사례의 `t3.micro`, Amazon Linux 2023, Nginx, 수동 파일 전송은 **하나의 구현**입니다. 자기 미션의 요구와 자신이 선택한 방법을 구분해 읽으세요.

원본 미션 문서 전체와 실제 학습자 질문 기록은 직접 대조하지 못했습니다. [미션 용어 추출본](../../../data/raw/main/m05/m05-terminology-raw.md)은 원문에서 추출한 **미정제 자료**입니다. 미션의 세부 필수·선택 조건을 확정하는 근거로 사용하지 않습니다.

## 읽는 방법

| 표시 | 뜻 |
| --- | --- |
| `[개념]` | 다른 구현에도 적용되는 원리 |
| `[B3-1 사례]` | 위 배포 저장소에서 확인한 선택·기록 |
| `[확인 활동]` | 자기 프로젝트에서 읽거나 관찰할 항목. 예시 값을 그대로 실행하거나 복사할 필요 없음 |
| `[미확인]` | 자료만으로 현재 상태나 수행 결과를 검증할 수 없는 부분 |

각 장은 **질문 → 개념 → 실제 사례 → 내 프로젝트에 연결 → 한 문장 정리** 순서입니다. 그림은 먼저 글로 설명하며, 승인된 B3-1 용어 설명의 SVG를 재사용했습니다. 그림의 화살표는 개념상 연결을 보여 주며 AWS 콘솔의 배치도를 그대로 재현하지 않습니다.

그림은 가로 520px로 만들어졌습니다. 작은 화면의 사이트에서는 그림을 좌우로 밀어 볼 수 있습니다. Markdown 파일을 직접 읽을 때 그림이 작으면 그림 파일을 따로 열어 확대하세요.

## 목차

| 장 | 질문 | 핵심 |
| --- | --- | --- |
| [1. 배포](chapters/01-deployment-path.md) | 웹사이트를 만든 뒤 무엇이 더 필요한가? | 소스·빌드·정적 파일·호스팅 |
| [2. 일반 네트워크와 AWS](chapters/02-network-aws-map.md) | 일반 네트워크의 역할은 AWS에서 무엇이 맡을까? | VPC·Subnet·경로·IGW·SG·EC2의 대응, CIDR |
| [3. 인터넷 경로](chapters/03-internet-path.md) | Public Subnet이면 바로 접속될까? | IGW·Route Table·Public IPv4 |
| [4. 출입 규칙](chapters/04-security-group.md) | 웹 방문과 서버 관리는 어떻게 구분할까? | SG·HTTP 80·SSH 22·`/32` |
| [5. 서버 접속](chapters/05-ssh-key.md) | 개인키를 보내지 않고 어떻게 로그인할까? | 서명·호스트 인증·사용자 인증 |
| [6. 웹 제공](chapters/06-ec2-nginx.md) | EC2와 Nginx는 각각 무엇을 할까? | `dist`·요청·`HashRouter` |
| [7. 검증과 운영](chapters/07-verify-operate.md) | 화면이 열린다는 것을 어떻게 확인하고 유지할까? | 계층별 검증·문제 진단·비용·재배포 |

## 자료의 경계

- 기존 용어 원고: [SSH 키](../../terms/ssh-key.md), [CIDR](../../terms/cidr.md). 자세한 인증·주소 설명은 이 원고를 재사용했습니다.
- 기존 공개 콘텐츠: [일반 네트워크 / AWS 네트워크 역할 비교](https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/#/connections/network-aws-role-comparison). 2장의 역할 대응은 이 검토된 비교와 같은 원칙을 사용합니다.
- 실제 배포: [B3-1 README](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-1/blob/c68929943f1904a5c7c8033d2d49a30ace56e3d1/README.md), [배포 작업 기록](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-1/blob/c68929943f1904a5c7c8033d2d49a30ace56e3d1/docs/deployment-log-2026-10-14.md), [Nginx 설정](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-1/blob/c68929943f1904a5c7c8033d2d49a30ace56e3d1/deploy/b3-1/nginx.conf).
- 추후 제안: [재배포·자동화 설계](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-1/blob/c68929943f1904a5c7c8033d2d49a30ace56e3d1/docs/deployment-update-and-automation.md). 제안된 OIDC·S3·SSM 자동화는 실제 적용으로 취급하지 않습니다.
- 제작·검토용: [강사 노트](instructor-notes.md), [초안 QA](qa-draft.md), [웹 연결 QA](qa-web.md).

사이트 연결 경로는 B3-1 미션 화면의 **학습 가이드 읽기**이며, 주소는 `#/missions/main-M05/guide`입니다. 실제 공개 반영 여부는 배포 상태에 따라 달라집니다.
