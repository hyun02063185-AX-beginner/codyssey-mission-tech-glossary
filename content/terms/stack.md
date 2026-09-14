# Stack

## 한 줄 설명

Stack은 가장 나중에 넣은 항목을 먼저 꺼내는 LIFO(Last In, First Out) 자료구조입니다.

## 쉽게 설명하면

접시를 쌓아 두면 가장 위에 놓은 접시부터 꺼내는 것과 같습니다.

## 정확한 설명

Stack은 top에서 push와 pop을 수행합니다. 함수 호출을 관리하는 Call Stack은 이 LIFO 원리를 사용하는 실행 환경의 구조이지만, 일반 Stack 자료구조 자체와 Call Stack을 같은 Canonical 용어로 취급하면 안 됩니다. Stack은 DFS, 괄호 검사, 되돌리기 기능 같은 문제에도 쓰입니다.

## 이 미션에서는 왜 필요한가

M09에서 탐색 순서와 중첩 구조를 이해하고 구현하는 기초입니다.

## 코드 예

```js
const stack = [];
stack.push('first');
stack.push('second');
stack.pop(); // 'second'
```

## 관련 용어

- `queue`
- `dfs`
- `recursion`
- `event-loop`

## 흔한 오해

Stack이 모든 함수 호출 오류를 자동으로 막아 주는 것은 아닙니다. 재귀가 너무 깊으면 Call Stack이 넘칠 수 있습니다.

## 동료평가 질문

DFS에서 Stack을 쓰면 Queue를 쓰는 BFS와 방문 순서가 어떻게 달라지나요?
