# HTTP Request / Response

## 한 줄 설명

HTTP Request / Response는 클라이언트가 요청 메시지를 보내고 서버가 결과 메시지로 답하는 웹 통신의 기본 교환 단위입니다.

## 쉽게 설명하면

브라우저가 주문서를 보내면 서버가 결과표를 돌려주는 한 번의 대화입니다.

## 정확한 설명

Request에는 보통 method, path, headers, 필요할 때 body가 들어가고 Response에는 status code, headers, body가 들어갑니다. 서버는 요청을 받고 인증·검증·비즈니스 로직을 수행한 뒤 응답을 만듭니다. Response가 도착했다는 사실과 요청이 성공했다는 판단은 다릅니다. 예를 들어 404도 정상적으로 도착한 HTTP response입니다.

## 동작 원리

- 클라이언트가 GET·POST 같은 method와 경로를 보냅니다.
- 서버가 요청을 라우팅하고 처리합니다.
- 결과를 status code와 JSON·HTML 같은 body에 담아 돌려줍니다.

## 이 미션에서는 왜 필요한가

M01에서 fetch 응답을 상태별 UI로 표시하고, M06·M12에서 API 경계를 설계하고 검사합니다.

## 코드 예

```http
GET /users/octocat HTTP/1.1
Accept: application/json
```

## 관련 용어

- `http`
- `fetch-api`
- `http-status-code`
- `json-request-response`

## 흔한 오해

Response가 있으면 항상 성공이라고 생각하면 안 됩니다. 4xx·5xx도 요청에 대해 도착한 유효한 HTTP response입니다.

## 동료평가 질문

fetch에서 `response.ok`를 확인하는 이유를 Request / Response 관점에서 설명해 보세요.
