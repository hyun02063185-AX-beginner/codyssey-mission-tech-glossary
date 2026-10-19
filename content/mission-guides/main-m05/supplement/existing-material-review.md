# 기존 개념 연결 자료와 미션 ID 표기 — 수정 제안

> 이 문서는 **제안만** 남깁니다. 아래 파일은 이번 작업에서 수정하지 않았습니다. 개념 연결·canonical·route는 Owner 승인 영역이며, 수정이 필요하면 Owner 판단 후 별도 작업으로 진행합니다.

대상: 개념 연결 [일반 네트워크 / AWS 네트워크 역할 비교](https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/#/connections/network-aws-role-comparison)와 그 구현·원본.

## 1. 인바운드 경로가 잘못 읽힐 수 있는 표현

### 무엇이 문제인가

AWS 문서는 Route Table을 “서브넷 또는 게이트웨이에서 나오는 트래픽이 어디로 향할지 정하는 규칙의 집합”으로 설명하고, Subnet이 IGW로 가는 경로를 가진 Route Table에 연결되면 Public Subnet이라고 부릅니다. 같은 문서는 IGW가 VPC와 인터넷 **양방향** 통신을 가능하게 하고 IPv4에서 Public↔사설 주소 1:1 변환을 한다고 설명합니다. 따라서 “외부 요청이 IGW를 지난 다음 Route Table을 거쳐 Subnet에 들어간다”처럼 **순서가 있는 통과 경로**로 쓰면 Route Table이 요청이 지나가는 장비·단계로 읽힙니다. 또 한 방향(요청)만 보여 주면 IGW가 양방향이라는 점이 사라집니다.

### 위치와 제안

| 위치 | 현재 표현 | 읽히는 위험 | 제안 |
| --- | --- | --- | --- |
| [src/ConceptConnections.tsx:76](../../../../src/ConceptConnections.tsx#L76)의 “B3-1 실제 요청 흐름” 6단계 목록 | `브라우저 → Internet Gateway → Route Table(0.0.0.0/0 → IGW) → Public Subnet → Security Group → EC2의 Nginx` | Route Table이 IGW 뒤에서 요청이 지나는 단계처럼 보임. 응답이 없음 | 요청 순서는 `브라우저 → Public IPv4 → IGW(Public→사설 변환) → EC2 네트워크 인터페이스의 Security Group 허용 판단 → Nginx`로 쓰고, Route Table은 **순서 밖의 별도 문장**으로 분리: “Route Table의 `0.0.0.0/0 → IGW`는 Subnet 밖으로 나가는 패킷(응답 포함)의 다음 대상을 IGW로 정하는 규칙 한 줄입니다.” 응답은 같은 연결을 되돌아간다고 한 줄 추가 |
| [data/curated/concept-connections-v1.json:202](../../../../data/curated/concept-connections-v1.json#L202)의 `B3-1 실제 요청 흐름` `body` | `브라우저 → Public IPv4 → Internet Gateway → Route Table의 0.0.0.0/0 → IGW → Public Subnet → Security Group …` | 위와 같음 | 위 제안 문장으로 교체 |
| 같은 JSON의 `diagram.edges` | `route → igw : 0.0.0.0/0 → IGW`, `igw → ec2 : Public IPv4 경로` | 화살표 방향이 요청 경로처럼 읽힐 수 있음 | `route → igw` 간선의 라벨을 “규칙이 가리키는 대상”으로 바꾸거나 점선·참조선 표현으로 구분 |
| `src/ConceptConnections.tsx`의 “브라우저 요청이 Nginx에 닿으려면” 표의 `0.0.0.0/0 → IGW 경로` 행 | “빠지면: 인터넷으로 가는 길을 선택하지 못합니다” | 요청이 들어오는 길과 응답이 나가는 길이 섞임 | “빠지면: Subnet이 Public Subnet이 아니게 되어 인터넷과 왕복 통신이 완성되지 않습니다(AWS 문서: IGW 경로가 없으면 Public IP가 있어도 통신 불가)” |
| [chapters/03-internet-path.md:18](../chapters/03-internet-path.md#L18)의 코드 블록 | `외부 브라우저 → Public IPv4 → IGW/VPC 경로 → 보안 규칙 → EC2의 Nginx` | “IGW/VPC 경로”가 모호함. 단방향 | `외부 브라우저 → Public IPv4 → IGW → Security Group 허용 판단(EC2의 ENI) → Nginx` 후 “응답은 같은 연결을 되돌아갑니다” 한 줄 |
| [assets/aws-network-roles.svg](../assets/aws-network-roles.svg) 및 `src/assets/b3-1/aws-network-roles.svg` | 실선 화살표가 `인터넷 → IGW → SG 카드 → ENI → Nginx`로 한 방향만 있고 조건 ②(`Subnet의 Route Table에 0.0.0.0/0 → IGW`)가 요청 경로의 조건처럼 번호가 붙음 | IGW 양방향이 보이지 않음. 조건 ② 때문에 경로표가 요청 경로의 단계처럼 읽힘 | IGW의 화살표를 양방향(요청 실선·응답 점선)으로 바꾸고, 조건 카드 ②는 “응답이 나갈 길”임을 밝힘. 이번 보강의 [그림 4 보충](assets/04b-b31-request-roundtrip.svg)이 대안 표현이므로 참고 가능 |

위 SVG는 `src/assets/b3-1/`의 승인된 원본이 있으므로 Owner가 어느 범위까지 고칠지 결정해야 합니다. 독립 검토 기록도 이 원본의 수정 필요성을 별도 판단 대상으로 남겨 두었습니다.

### 수정하지 말아야 할 것

- “Security Group은 EC2의 네트워크 인터페이스에 적용된다”, “Route Table은 Subnet에 연결된다”, “Public Subnet은 이름이 아니라 경로로 결정된다”는 기존 설명은 AWS 문서와 맞으므로 유지합니다.

## 2. 사용자에게 보이는 미션 ID 표기

공식 표기는 **B3-1**입니다. 코드 내부는 `main-m05` ID와 `/missions/main-M05` 공개 별칭을 계속 쓰므로, **사용자 화면에 보이는 문장**만 대상으로 봤습니다.

| 위치 | 현재 | 판단 | 제안 |
| --- | --- | --- | --- |
| `data/knowledge-maps/network-web-protocol/overlays/main-m05.json`의 `label`(생성: `scripts/build_wave2_knowledge_maps.py`, 결과 `src/data/generated/network-web-protocol-overlay-main-m05.json`) | `본과정 M05 관련 기술` | 지식 지도 오버레이 이름으로 **사용자에게 보일 가능성이 있음** (화면 노출 여부는 미확인) | 노출된다면 `본과정 B3-1 관련 기술`로 변경. 다른 `main-m*` 오버레이도 같은 패턴이면 일괄 점검. 지식 지도는 Owner Gate 영역 |
| [content/mission-guides/main-m05/README.md:47](../README.md#L47) | ``주소는 `#/missions/main-M05/guide`입니다`` | 가이드 본문에 노출되는 **공개 주소 안내**. ID 표기이지만 route 별칭이라 숨기기 어려움 | 문장을 “B3-1 미션 화면의 학습 가이드 읽기 링크로 들어옵니다”로 줄이고 주소 문자열은 강사·개발용 문서로 이동 |
| `src/data/generated/missions.json`, `data/curated/glossary-master-v0.1.yaml`의 `"mission": "M05"`, `data/curated/glossary-stats.md`의 `main/M05` | 내부 데이터 필드·통계 | 화면 문장이 아니라 **내부 데이터**. 화면에는 `missionLabel`/`officialMissionId`가 `B3-1`로 변환함 | 변경하지 않음. 변환 함수가 모든 화면 경로에 쓰이는지만 확인(미검증) |
| `src/B31MissionGuide.tsx:46`, `src/b31GuideContent.ts:1` | `/missions/main-M05` 링크 경로 | 링크 대상 경로이며 화면 글자가 아님 | 변경하지 않음. 공개 route 계약은 Owner Gate |

확인하지 못한 것: 위 목록 밖에 `M05`가 화면에 렌더링되는 위치가 있는지(전체 화면 순회는 하지 않음), `main-m05.json` 오버레이 라벨이 실제 화면에 나타나는지.

## 3. 이번 보강 자료와의 관계

이번 보강 자료([README](README.md))는 위 제안을 **적용하지 않았고**, 사용자에게 보이는 문장에서는 미션을 `B3-1`로만 부릅니다. 보강 자료의 그림 2·3·4 보충은 요청·응답을 함께 그리고 Route Table을 요청 경로 밖의 규칙표로 분리했으므로, 위 제안의 방향과 일치합니다.
