# TCP

## 한 줄 설명
TCP는 두 endpoint 사이에서 순서와 전달 신뢰성을 관리하는 connection-oriented transport protocol입니다.

## 쉽게 설명하면
데이터 조각을 보낸 순서대로 받았는지 확인하고, 빠진 조각이 있으면 다시 보내도록 돕는 전달 규칙입니다.

## 정확한 설명
TCP는 byte stream, sequence number, acknowledgement, retransmission, flow/congestion control 등의 메커니즘을 사용합니다. HTTP 같은 application protocol의 의미를 정하는 것이 아니라 그 아래 전송을 담당합니다.

## 이 미션에서는 왜 필요한가
M05에서 URL 이름 해석 뒤 IP endpoint로 연결해 HTTP/HTTPS traffic을 전달하는 경로를 층별로 설명할 수 있습니다.

## 코드 예
```sh
curl -I https://example.com
# HTTP 요청은 보통 TLS와 TCP 위에서 전달될 수 있다.
```

## 주의할 점 / 경계 조건
TCP가 application message 경계를 보존하지는 않습니다. 또한 HTTP/3처럼 TCP가 아닌 transport를 쓰는 HTTP도 있으므로 모든 HTTP가 TCP라는 표현은 정확하지 않습니다.

## 관련 용어
- `http`
- `https`
- `socket-port`
- `public-ip`
- `curl`

## 흔한 오해
TCP와 HTTP는 같은 계층의 protocol이 아닙니다.

## 동료평가 질문
TCP의 순서 보장이 application code에서 message 하나가 한 번에 읽힌다는 보장을 왜 대신하지 못하나요?
