# Promise

## 한 줄 설명

Promise는 미래에 성공 값 또는 실패 이유로 완료될 비동기 작업의 결과를 나타내는 JavaScript 객체입니다.

## 쉽게 설명하면

지금 바로 결과를 받지 못해도, 나중에 결과가 오면 무엇을 할지 연결해 두는 약속표입니다.

## 정확한 설명

Promise는 pending, fulfilled, rejected 상태를 거치며 `then`, `catch`, `finally` 또는 `await`로 완료 결과를 소비합니다. Promise 자체가 네트워크 요청은 아니며 Fetch 같은 API가 Promise를 반환할 수 있습니다.

## 이 미션에서는 왜 필요한가

- main M01: fetch와 async/await의 완료·실패 흐름을 이해하는 핵심 배경입니다.

## 관련 용어

- `async-await`
- `callback`
- `fetch-api`

## 흔한 오해

Promise는 자동으로 오류를 처리하지 않습니다. 거부 상태와 HTTP 오류 응답을 각각 처리해야 합니다.

## 동료평가 질문

Fetch가 반환한 Promise와 HTTP 응답의 성공 여부는 왜 별도로 확인해야 하나요?
