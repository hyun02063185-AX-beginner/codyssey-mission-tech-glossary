# HTTP

## 한 줄 설명

HTTP는 웹 클라이언트와 서버가 요청과 응답을 주고받는 방법을 정한 애플리케이션 프로토콜입니다.

## 쉽게 설명하면

브라우저가 서버에 무엇을 달라고 말하고, 서버가 어떤 결과를 돌려줄지 정한 공통 언어입니다.

## 정확한 설명

HTTP 메시지는 method, URL 경로, header, 선택적인 body를 가진 request와 status code, header, body를 가진 response로 구성됩니다. HTTP는 보통 TCP 위에서 전달되지만 TCP 자체는 아니며, HTTPS는 HTTP 통신을 TLS로 보호하는 방식입니다. 상태를 서버가 기억하지 않는 stateless 성격이 기본이지만 쿠키·토큰 같은 방식으로 연속된 사용자 상태를 설계할 수 있습니다.

## 이 미션에서는 왜 필요한가

M01의 GitHub API 호출과 M12의 백엔드 API는 모두 HTTP request/response 경계를 통해 동작합니다.

## 관련 용어

- `http-request-response`
- `http-status-code`
- `https`
- `rest-api`

## 흔한 오해

HTTP가 곧 인터넷 전체 또는 TCP라는 뜻은 아닙니다. HTTP는 웹 메시지의 의미를 정하고, TCP는 그 아래 전송 계층에서 다른 역할을 합니다.

## 동료평가 질문

HTTP request의 method와 response의 status code는 각각 무엇을 표현하나요?
