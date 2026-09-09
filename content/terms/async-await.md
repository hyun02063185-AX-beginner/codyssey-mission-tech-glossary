# async/await

## 한 줄 설명

async/await는 Promise 기반 비동기 작업의 완료와 실패 흐름을 읽기 쉬운 코드로 다루는 JavaScript 문법입니다.

## 쉽게 설명하면

시간이 걸리는 API 요청이 끝날 때까지 기다렸다가 다음 줄의 코드를 실행하게 표현하는 방법입니다.

## 정확한 설명

`async` 함수는 Promise를 반환하고, 그 안의 `await`는 Promise가 settle될 때까지 해당 함수의 진행을 잠시 멈춥니다. 이때 브라우저 전체가 멈추는 것은 아니며 다른 작업은 계속 처리됩니다.

비동기 작업은 실패할 수 있으므로 `try/catch` 또는 동등한 오류 경로가 필요합니다. M01에서는 fetch 응답을 기다린 뒤 데이터를 표시하거나 오류 UI로 전환하는 흐름에 사용합니다.

## 이 미션에서는 왜 필요한가

GitHub API 응답·JSON 변환·오류 처리를 순서대로 읽기 쉽게 구성합니다.

## 코드 예

```js
try { const data = await (await fetch(url)).json(); } catch { showError(); }
```

## 관련 용어

- fetch-api
- github-api
- ui-state

## 흔한 오해

await는 동기적으로 네트워크를 멈추게 하는 기능이 아니며, 실패 처리를 자동으로 해 주지도 않습니다.

## 동료평가 질문

await와 try/catch를 함께 쓰면 M01 API 실패를 어떻게 더 분명히 처리할 수 있나요?
