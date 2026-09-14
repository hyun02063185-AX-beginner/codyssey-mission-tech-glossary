# POST

## 한 줄 설명

POST는 서버에 데이터를 제출해 생성·처리 같은 작업을 요청하는 HTTP method입니다.

## 쉽게 설명하면

서버에 새 주문이나 작성한 내용을 접수해 달라고 보내는 동사입니다.

## 정확한 설명

POST request body에는 JSON이나 form 데이터가 들어갈 수 있습니다. POST는 같은 요청을 여러 번 보내도 결과가 같다는 멱등성을 기본으로 보장하지 않습니다. 따라서 네트워크 재시도나 이중 제출이 가능한 작업에서는 서버가 중복 처리를 막는 전략을 설계해야 합니다. 성공 결과는 상황에 따라 201, 200, 204 등으로 표현할 수 있습니다.

## 이 미션에서는 왜 필요한가

M12에서 생성·명령 처리 API를 만들고, 폼 제출에서 서버 오류와 성공 결과를 구분합니다.

## 코드 예

```js
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ada' }),
});
```

## 관련 용어

- `http-get`
- `http-request-response`
- `json-request-response`
- `form-validation`

## 흔한 오해

POST가 모든 데이터 변경의 유일한 method는 아닙니다. 다만 생성이나 처리 요청을 표현할 때 흔히 쓰이며, API 의미를 일관되게 정하는 것이 중요합니다.

## 동료평가 질문

같은 POST가 네트워크 재시도로 두 번 도착하면 어떤 중복 문제가 생길 수 있나요?
