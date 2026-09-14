# Event Loop

## 한 줄 설명

Event Loop는 JavaScript가 현재 실행을 마친 뒤, 실행할 수 있게 된 비동기 후속 작업을 차례로 처리하도록 조율하는 실행 모델입니다.

## 쉽게 설명하면

한 사람이 하던 일을 끝낸 다음, 대기표에서 지금 처리할 수 있는 일을 하나씩 가져오는 안내자에 가깝습니다.

## 정확한 설명

JavaScript 실행은 한 시점에 Call Stack의 한 흐름을 처리합니다. 타이머·네트워크·사용자 입력 같은 작업은 실행 환경이 기다리고, 완료 후 실행할 콜백이나 Promise 반응은 대기열에 등록됩니다. Event Loop는 Stack이 비었을 때 실행 가능한 작업을 가져옵니다. Promise 반응을 포함한 microtask는 일반 task보다 먼저 비워질 수 있으므로, 모든 비동기 작업이 완전히 같은 순서로 실행되는 것은 아닙니다.

## 동작 원리

- 동기 코드는 먼저 Call Stack에서 끝까지 실행됩니다.
- 브라우저 또는 런타임이 비동기 작업의 완료를 감시합니다.
- Promise 반응은 microtask 대기열, 타이머·입력 등의 후속 실행은 task 대기열에 들어갈 수 있습니다.
- Stack이 비면 Event Loop가 microtask를 처리한 뒤 다음 task를 처리합니다.

## 이 미션에서는 왜 필요한가

M01에서 API 요청의 로딩 UI를 먼저 보이고, 응답 뒤에 화면을 갱신해도 버튼 클릭 같은 다른 입력이 처리되는 이유를 설명하는 배경입니다.

## 코드 예

```js
console.log('A');
setTimeout(() => console.log('task'), 0);
Promise.resolve().then(() => console.log('microtask'));
console.log('B'); // A, B, microtask, task
```

## 주의할 점 / 경계 조건

`setTimeout(..., 0)`은 즉시 실행을 뜻하지 않습니다. 현재 동기 코드와 먼저 처리되는 microtask가 끝난 뒤에야 실행될 수 있습니다.

## 관련 용어

- `javascript`
- `asynchronous-programming`
- `promise`
- `callback`

## 흔한 오해

Event Loop가 여러 JavaScript 함수를 동시에 실행한다고 생각하기 쉽습니다. 일반적인 한 실행 흐름에서는 한 작업이 Stack을 오래 점유하면 다른 후속 작업도 기다립니다.

## 동료평가 질문

위 코드에서 `microtask`가 `task`보다 먼저 출력되는 이유를 Stack과 대기열 관점에서 설명해 보세요.
