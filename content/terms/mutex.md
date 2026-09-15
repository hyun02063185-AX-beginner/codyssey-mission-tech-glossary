# Mutex

## 한 줄 설명

한 시점에 하나의 실행 흐름만 임계 구역에 들어가게 하는 mutual exclusion lock입니다.

## 쉽게 설명하면

한 장짜리 출입증을 가진 사람만 방에 들어갈 수 있게 하는 장치입니다.

## 정확한 설명

Mutex는 공유 데이터를 보호하기 위한 lock의 대표 구현입니다. 획득한 주체가 해제해야 하는 규칙과 운영체제·언어 런타임의 스케줄링 특성을 가질 수 있습니다.

## 이 미션에서는 왜 필요한가

M08에서 lock을 구체적으로 구현할 때 race condition과 deadlock의 관계를 설명합니다.

## 코드 예

```python
mutex.acquire()
try:
    update_shared_state()
finally:
    mutex.release()
```

## 주의할 점 / 경계 조건

Mutex가 있다고 복합 연산 전체가 자동 원자적이 되는 것은 아니며, 보호할 임계 구역을 정확히 정해야 합니다.

## 관련 용어

- `lock`
- `deadlock`
- `race-condition`

## 흔한 오해

Mutex와 semaphore는 모두 동기화 도구지만 허용 동시 접근 수와 사용 목적이 다릅니다.

## 동료평가 질문

finally에서 mutex를 해제하지 않으면 어떤 문제가 생기나요?
