# 용어 수정 전후 비교 (자동 생성 요약)

> 생성: `before.json`(main `8e58d32`의 `src/data/generated/glossary.json`)과 `after.json`(이 브랜치에서 `npm run data:build` 후)을 비교했다. 본문 전체 차이는 `git diff`로 본다.

| 용어 | 한 줄 설명 변경 | 별칭 추가 | 미션 연관 추가 | 관련 용어 (전 → 후) |
| --- | --- | --- | --- | --- |
| `public-ip` | 변경 | 공인 IP, Public IPv4 | — | http, tcp → ip-address, private-ip, internet-gateway, elastic-ip, public-subnet, security-group |
| `subnet` | 변경 | 서브넷 | — | http, tcp → cidr, ip-address, private-ip, virtual-private-cloud, route-table, public-subnet |
| `public-subnet` | 변경 | 퍼블릭 서브넷 | — | http, tcp → subnet, route-table, internet-gateway, public-ip, private-ip, nat-gateway |
| `cidr` | — | — | — | subnet, security-group, virtual-private-cloud, public-ip, route-table → subnet, security-group, virtual-private-cloud, public-ip, route-table, ip-address, private-ip |
| `tcp` | 변경 | — | main/M05 | http, https, socket-port, public-ip, curl → network-protocol, http, https, socket-port, packet, ip-address |
| `http` | — | — | main/M05 | http-request-response, http-status-code, https, rest-api → http-request-response, http-status-code, https, rest-api, tcp, network-protocol, port-80-http |
| `socket-port` | — | 포트 | main/M05 | http, tcp → tcp, ip-address, packet, port-80-http, port-22-ssh, security-group |
| `internet-gateway` | 변경 | 인터넷 게이트웨이 | — | http, tcp → virtual-private-cloud, route-table, public-ip, private-ip, nat-gateway, default-route-any-ipv4 |
| `route-table` | 변경 | 라우팅 테이블 | — | http, tcp → internet-gateway, default-route-any-ipv4, subnet, public-subnet, cidr, security-group |
| `security-group` | — | — | — | authentication, authorization → route-table, socket-port, cidr, port-80-http, port-22-ssh, network-protocol |
| `nat-gateway` | — | — | — | http, tcp → internet-gateway, private-ip, public-ip, route-table, public-subnet, subnet |
| `elastic-ip` | — | — | — | http, tcp → public-ip, internet-gateway, amazon-ec2, aws-free-tier |
| `default-route-any-ipv4` | — | — | — | http, tcp → route-table, internet-gateway, cidr, security-group |
| `virtual-private-cloud` | — | — | — | http, tcp → subnet, cidr, private-ip, internet-gateway, route-table |
| `outbound-traffic` | — | — | — | http, tcp → security-group, internet-gateway, nat-gateway, route-table |
| `port-22-ssh` | — | — | — | http, tcp → ssh, tcp, socket-port, security-group, cidr |
| `ip-address` **신규** | IP 주소는 네트워크에서 데이터를 보낼 상대(정확히는 기기의 네트워크 인터페이스)를 찾아가기 위해 붙이는 번호입니다. | IP 주소, IP address, IPv4 주소 | main/M05 | — → public-ip, private-ip, cidr, subnet, packet, socket-port, domain-name-system |
| `private-ip` **신규** | 사설 IP는 회사망·집·VPC처럼 내부 네트워크 안에서 쓰도록 따로 정해 둔 범위의 IP 주소입니다. | 사설 IP, Private IP, Private IPv4, 사설 주소 | main/M05 | — → ip-address, public-ip, cidr, subnet, internet-gateway, nat-gateway |
| `packet` **신규** | 패킷은 네트워크로 데이터를 나눠 옮기는 단위로, 앞부분(헤더)에 출발지·목적지 IP 주소 같은 전달 정보가 적혀 있습니다. | 패킷, Packet, IP 패킷 | main/M05 | — → ip-address, network-protocol, tcp, socket-port, route-table, security-group |
| `network-protocol` **신규** | 네트워크 프로토콜은 통신하는 양쪽이 데이터를 어떤 형식과 절차로 주고받을지 미리 정해 둔 약속입니다. | 네트워크 프로토콜, Network Protocol, 통신 프로토콜, 프로토콜 | main/M05 | — → tcp, http, https, ip-address, packet, socket-port |

## 한 줄 설명이 바뀐 용어

- `public-ip`
  - 전: internet에서 route 가능한 IP address.
  - 후: 공인 IP는 인터넷 라우팅에 쓰도록 배정된 IP 주소로, 인터넷 어디서나 이 주소로 가는 경로를 찾을 수 있습니다.
- `subnet`
  - 전: VPC 안에서 IP 주소 범위를 나누고 routing 경계를 만드는 network 구획.
  - 후: 서브넷은 네트워크를 구역으로 나누고 구역마다 정한 IP 주소 범위입니다.
- `public-subnet`
  - 전: internet gateway로 가는 route가 있어 public IP resource를 둘 수 있는 subnet.
  - 후: Public Subnet은 연결된 Route Table에 인터넷 게이트웨이로 가는 직접 경로가 있는 AWS Subnet입니다.
- `tcp`
  - 전: TCP는 두 endpoint 사이에서 순서와 전달 신뢰성을 관리하는 connection-oriented transport protocol입니다.
  - 후: TCP는 두 프로그램 사이에 연결을 맺고, 데이터가 빠짐없이 순서대로 도착하도록 관리하는 전송 프로토콜입니다.
- `internet-gateway`
  - 전: VPC와 internet 사이의 public IPv4 traffic을 연결하는 gateway.
  - 후: 인터넷 게이트웨이(IGW)는 VPC를 인터넷과 연결하는 AWS 구성요소로, IPv4에서는 인스턴스의 사설 주소와 공인 주소를 1:1로 바꿔 줍니다.
- `route-table`
  - 전: destination prefix와 next hop을 연결해 packet 경로를 정하는 rule 집합.
  - 후: Route Table은 목적지 IP 주소 범위마다 다음으로 보낼 대상을 적어 둔 경로 규칙표입니다.
