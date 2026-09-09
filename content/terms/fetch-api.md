# fetch

## 한 줄 설명

fetch는 브라우저 JavaScript에서 HTTP 요청을 보내고 Promise로 응답을 받는 API입니다.

## 쉽게 설명하면

웹페이지가 외부 서비스에 데이터를 요청하고 답을 기다리는 브라우저의 기본 도구입니다.

## 정확한 설명

`fetch(url)`은 네트워크 요청을 시작하고 Response 객체를 Promise로 반환합니다. JSON 데이터는 `response.json()`으로 다시 읽으며, HTTP 404·403 같은 응답은 네트워크 연결 실패와 달리 Promise가 resolve될 수 있으므로 `response.ok` 또는 status를 확인해야 합니다.

M01에서는 GitHub API 요청 중 loading 상태를 먼저 보이고, 성공·오류·빈 결과를 서로 다른 UI 상태로 전환합니다. `async/await`와 `try/catch`는 이 비동기 흐름을 읽고 오류를 처리하는 데 도움을 줍니다.

## 이 미션에서는 왜 필요한가

GitHub API에서 포트폴리오 데이터를 가져옵니다.

## 코드 예

```js
const response = await fetch(url);
if (!response.ok) throw new Error(String(response.status));
const data = await response.json();
```

## 관련 용어

- github-api
- async-await
- ui-state
- http-status-code-403

## 흔한 오해

fetch가 resolve됐다고 HTTP 요청이 성공한 것은 아닙니다.

## 동료평가 질문

네트워크 실패와 HTTP 403 응답을 M01 UI에서 구분해야 하는 이유는 무엇인가요?
