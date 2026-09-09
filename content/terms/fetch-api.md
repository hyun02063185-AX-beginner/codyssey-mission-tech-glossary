# fetch

## 한 줄 설명

fetch는 브라우저 JavaScript에서 HTTP 요청을 보내고 Promise로 응답(Response)을 받는 Web API입니다.

## 쉽게 설명하면

웹페이지가 외부 서비스에 데이터를 요청하고 답을 기다리는 브라우저의 표준 도구입니다.

## 정확한 설명

fetch는 Fetch 표준에 정의된 Web API로, 기본 GET부터 POST 등 다양한 HTTP method로 요청을 보내고 Promise를 반환합니다. Promise는 HTTP 오류 상태(404·403·500) 때문에 reject되지 않습니다. 서버가 응답하면 상태와 무관하게 Response로 resolve되므로 `response.ok` 또는 `response.status`로 상태를 확인해야 합니다. reject되는 것은 요청 자체의 실패(잘못된 URL, 네트워크 오류, 정책 차단, abort)입니다. 응답 본문은 `response.json()`/`text()` 같은 비동기 메서드로 한 번 읽을 수 있습니다. M01에서는 GitHub API 요청 중 loading 상태를 먼저 보이고, 성공·오류·빈 결과를 서로 다른 UI 상태로 전환합니다.

## 동작 원리

- `fetch(url, options)`는 요청을 보내고 Promise를 반환합니다. 응답 헤더가 도착하면 Response로 resolve됩니다.
- Response는 상태·헤더와 body 스트림으로 구성됩니다. `json()`은 body를 읽어 파싱하는 별도의 비동기 작업입니다.
- body는 스트림이라 한 번만 소비할 수 있습니다 — `json()`을 두 번 호출하면 오류가 납니다.
- reject되는 경우: 네트워크 오류·잘못된 URL·permissions policy 같은 정책 차단은 TypeError로, AbortController의 abort()는 AbortError(DOMException)로 reject됩니다. CORS 차단도 요청 실패로 이어집니다.

## 이 미션에서는 왜 필요한가

M01에서 GitHub API로 포트폴리오 데이터를 가져와 화면에 표시할 때 사용합니다. GitHub API는 인증 여부에 따라 요청 한도가 달라지므로 403 응답을 구분해 처리하는 것이 중요합니다.

## 코드 예

```js
async function loadProfile(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error(`요청 실패: ${response.status}`);
  }
  const data = await response.json(); // JSON 본문 파싱
  return data;
}
```

## 주의할 점 / 경계 조건

- HTTP 오류(404/500)는 reject가 아닙니다 — `response.ok` 확인이 필수입니다.
- `json()`은 본문이 JSON이 아니면 예외를 던집니다 — 응답 형식을 확인해야 합니다.
- 오래 걸리는 요청을 취소하려면 AbortController가 필요합니다(심화 주제).
- 브라우저 CORS 정책이 요청을 차단할 수 있습니다 — 서버가 허용해야 합니다.

## 흔한 오해

fetch가 reject되면 서버 오류라고 생각합니다. reject는 네트워크 오류 같은 요청 실패이고, 404·500은 정상적으로 도착한 응답입니다. fetch가 resolve됐다고 HTTP 요청이 성공한 것은 아니므로 상태 코드 확인 코드가 필수입니다.

## 비슷한 개념과의 차이

- **REST API**: fetch는 요청을 보내는 도구이고, REST API는 리소스 중심의 API 설계 스타일입니다.
- **XMLHttpRequest**: 같은 역할을 하는 구형 API로, 콜백 기반입니다. fetch가 현대적 표준입니다.

## 관련 용어

- rest-api
- github-api
- async-await
- promise
- http-status-code-403
- ui-state

## 동료평가 질문

네트워크 실패와 HTTP 403 응답을 M01 UI에서 구분해야 하는 이유는 무엇인가요? 404 응답을 받았을 때 fetch Promise는 reject되나요?
