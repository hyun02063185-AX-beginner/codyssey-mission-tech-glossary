# Concurrency

## 한 줄 설명
Concurrency는 여러 작업의 진행을 겹쳐 관리해, 기다리는 동안 다른 작업을 다룰 수 있게 하는 실행 구조입니다.

## 쉽게 설명하면
한 사람이 물 끓기를 기다리는 동안 설거지를 하는 것처럼, 여러 일을 동시에 끝내는 것과 별개로 여러 일을 번갈아 진행하는 방식입니다.

## 정확한 설명
Concurrency는 작업의 구조와 조율에 관한 개념이고 parallelism은 여러 계산 자원을 써 실제 같은 시간에 작업을 수행하는 개념입니다. concurrency 시스템은 단일 core에서도 scheduling으로 동작할 수 있습니다.

## 이 미션에서는 왜 필요한가
비동기 request, event loop, server 작업을 설명할 때 “여러 요청을 다룬다”와 “여러 CPU에서 병렬 계산한다”를 구분하는 기준입니다.

## 코드 예
```js
await Promise.all([fetch('/a'), fetch('/b')]);
// 요청을 함께 시작해 기다림을 겹칠 수 있다.
```

## 주의할 점 / 경계 조건
Concurrency는 data race를 자동으로 해결하지 않습니다. 공유 상태가 있으면 ownership, queue, mutex 같은 설계가 필요할 수 있습니다.

## 관련 용어
- `asynchronous-programming`
- `event-loop`
- `process`
- `thread`
- `race-condition`
- `mutex`

## 흔한 오해
Concurrency와 parallelism은 같은 뜻이 아닙니다.

## 동료평가 질문
I/O를 기다리는 두 요청을 한 core에서 번갈아 처리하는 것은 왜 concurrency일 수 있나요?
