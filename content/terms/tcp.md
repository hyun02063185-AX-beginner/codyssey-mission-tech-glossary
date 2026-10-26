# TCP

## 한 줄 설명
TCP는 두 프로그램 사이에 연결을 맺고, 데이터가 빠짐없이 순서대로 도착하도록 관리하는 전송 프로토콜입니다.

## 쉽게 설명하면
데이터 조각을 보낸 순서대로 받았는지 확인하고, 빠진 조각이 있으면 다시 보내도록 돕는 전달 규칙입니다. 포트 번호로 상대 컴퓨터 안의 어느 프로그램과 주고받을지도 구분합니다.

## 정확한 설명
TCP는 byte stream, sequence number, acknowledgement, retransmission, flow/congestion control 등의 메커니즘을 사용합니다. HTTP 같은 application protocol의 의미를 정하는 것이 아니라 그 아래 전송을 담당합니다. TCP 헤더에는 출발지·목적지 포트 번호가 있고, TCP 세그먼트는 IP 패킷에 담겨 이동하므로 IP 주소는 IP 헤더에 있습니다. TCP의 신뢰성은 보낸 바이트가 빠짐없이 순서대로 전달된다는 뜻이지, 그 위의 HTTP 요청이 성공한다는 뜻은 아닙니다.

## 이 미션에서는 왜 필요한가

본과정 M07은 20022와 15034 포트에 대한 인바운드 규칙을 만들게 합니다. 규칙을 적을 때 프로토콜을 골라야 하고, 이 둘은 연결을 맺고 순서대로 주고받는 방식이라 TCP로 지정합니다.

B3-1(M05)의 Security Group은 웹 접속을 TCP 80으로, 관리용 SSH를 TCP 22로 허용했고, Nginx는 TCP 80에서 HTTP 요청을 받았습니다. 콘솔의 유형 "HTTP"·"SSH"는 각각 TCP 80·22를 고르는 이름이므로, 규칙이 실제로 보는 것은 TCP와 포트 번호입니다.

## 코드 예

```bash
sudo ufw allow 20022/tcp    # SSH 포트를 옮긴 경우
sudo ufw allow 15034/tcp    # 상태 점검 포트
sudo ufw status numbered
```

## 주의할 점 / 경계 조건
TCP가 application message 경계를 보존하지는 않습니다. 또한 HTTP/3처럼 TCP가 아닌 transport를 쓰는 HTTP도 있으므로 모든 HTTP가 TCP라는 표현은 정확하지 않습니다.

## 관련 용어
- `network-protocol`
- `http`
- `https`
- `socket-port`
- `packet`
- `ip-address`

## 흔한 오해
TCP와 HTTP는 같은 계층의 protocol이 아닙니다. TCP로 연결이 되고 데이터가 전달되어도 서버는 HTTP 404나 500으로 응답할 수 있으므로, TCP의 신뢰성을 웹 요청의 성공으로 읽으면 안 됩니다. 또 포트 번호는 IP 주소의 일부가 아니라 TCP 정보입니다.

## 비슷한 개념과의 차이
IP는 IP 주소를 보고 패킷을 목적지 기기까지 전달하고, TCP는 그 위에서 포트로 프로그램을 구분하며 순서와 누락을 관리합니다. HTTP는 TCP가 전달한 데이터가 어떤 요청과 응답인지를 정합니다. UDP도 포트를 쓰는 전송 프로토콜이지만 연결을 맺거나 재전송하지 않습니다.

## 동료평가 질문
TCP의 순서 보장이 application code에서 message 하나가 한 번에 읽힌다는 보장을 왜 대신하지 못하나요?
