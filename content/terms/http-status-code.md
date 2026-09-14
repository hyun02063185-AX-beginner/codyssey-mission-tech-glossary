# HTTP Status Code

## 한 줄 설명

HTTP Status Code는 서버가 요청을 어떻게 처리했는지 response에 표시하는 세 자리 결과 코드입니다.

## 쉽게 설명하면

서버가 요청을 받고 남기는 처리 결과 표지판입니다.

## 정확한 설명

1xx는 정보, 2xx는 성공, 3xx는 리다이렉션, 4xx는 클라이언트 요청 문제, 5xx는 서버 처리 문제를 나타냅니다. 상태 코드는 response의 한 부분이며, 사용자에게 보여 줄 문구나 오류 객체 전체를 대신하지 않습니다. API 클라이언트는 status와 body를 함께 해석해야 합니다.

## 이 미션에서는 왜 필요한가

M01에서 GitHub API의 403 등 실패 상태를 구분해 안내하고, M12에서 일관된 API 결과를 설계합니다.

## 관련 용어

- `http-request-response`
- `http-status-code-403`
- `fetch-api`
- `rest-api`

## 흔한 오해

2xx가 아닌 응답은 fetch Promise가 항상 reject된다고 생각하면 안 됩니다. HTTP response가 도착하면 fetch는 보통 resolve되므로 status를 확인해야 합니다.

## 동료평가 질문

404와 네트워크 단절을 UI에서 다르게 설명해야 하는 이유는 무엇인가요?
