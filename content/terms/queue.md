# Queue

## 한 줄 설명

Queue는 먼저 들어온 항목을 먼저 꺼내는 FIFO(First In, First Out) 자료구조입니다.

## 쉽게 설명하면

줄을 선 사람처럼 먼저 도착한 항목부터 차례로 처리하는 상자입니다.

## 정확한 설명

Queue는 뒤쪽에 항목을 넣는 enqueue와 앞쪽에서 꺼내는 dequeue 연산을 중심으로 합니다. 배열로 구현할 수도 있지만 앞 요소를 계속 제거하면 비용이 커질 수 있어, 연결 구조나 원형 버퍼를 쓰기도 합니다. 이는 자료구조 Queue의 설명이며 JavaScript 실행 모델의 Task Queue와는 별개의 Canonical 개념입니다.

## 이 미션에서는 왜 필요한가

M09에서 메시지 순서, BFS 같은 알고리즘 문제를 풀 때 처리 대기 순서를 모델링합니다.

## 코드 예

```js
const queue = [];
queue.push('first');
queue.push('second');
queue.shift(); // 'first'
```

## 주의할 점 / 경계 조건

JavaScript 배열의 `shift()`는 많은 요소를 다시 배치할 수 있습니다. 큰 데이터에서는 앞·뒤 인덱스를 따로 관리하는 구현을 고려합니다.

## 관련 용어

- `stack`
- `bfs`
- `doubly-linked-list`
- `event-loop`

## 흔한 오해

Queue가 곧 Event Loop의 Task Queue를 뜻하지는 않습니다. 후자는 런타임 실행 모델의 특수한 대기열이고, 이 항목은 일반 자료구조입니다.

## 동료평가 질문

BFS에서 Queue를 쓰면 가까운 노드부터 탐색되는 이유는 무엇인가요?
