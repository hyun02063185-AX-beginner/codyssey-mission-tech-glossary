# Thread

## 한 줄 설명
Thread는 process 안에서 실행 흐름을 나타내는 단위로, 같은 process의 자원을 공유할 수 있습니다.

## 쉽게 설명하면
process라는 작업장 안에서 실제 일을 진행하는 작업 흐름입니다. 여러 thread는 작업장의 자원을 함께 쓰므로 협업도 쉽지만 충돌도 조심해야 합니다.

## 정확한 설명
Thread는 process의 address space와 일부 resource를 공유하면서 각자의 execution state를 가집니다. 공유 상태를 동시에 다루면 synchronization이 필요할 수 있습니다.

## 이 미션에서는 왜 필요한가
server나 runtime의 동시 작업을 설명할 때 process 경계와 thread 공유 자원을 분리해 볼 수 있습니다.

## 코드 예
```py
# thread가 공유 상태를 바꾸는 코드라면 lock 같은 동기화가 필요할 수 있다.
```

## 주의할 점 / 경계 조건
Thread가 많다고 자동으로 빨라지는 것은 아닙니다. I/O, CPU core 수, lock 경쟁, scheduling 비용이 결과에 영향을 줍니다.

## 관련 용어
- `process`
- `concurrency`
- `race-condition`
- `mutex`
- `asynchronous-programming`

## 흔한 오해
Thread와 process는 같은 격리 수준의 단위가 아닙니다.

## 동료평가 질문
여러 thread가 하나의 counter를 갱신할 때 어떤 문제가 생길 수 있나요?
