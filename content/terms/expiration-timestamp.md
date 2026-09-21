# expire_at

## 한 줄 설명

값이나 record가 만료되는 시각을 저장한 timestamp.

## 쉽게 설명하면

`expire_at`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.

## 정확한 설명

값이나 record가 만료되는 시각을 저장한 timestamp. 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M09에서 만료를 힙으로 관리할 때 각 키가 들고 있는 값입니다. "앞으로 몇 초"를 그대로 두면 매번 다시 계산해야 하지만, 만료할 시각으로 바꿔 두면 가장 이른 것부터 꺼내 처리할 수 있습니다.

## 코드 예

```python
import heapq
heapq.heappush(expiry_heap, (expire_at, key))

now = time.time()
while expiry_heap and expiry_heap[0][0] <= now:
    _, key = heapq.heappop(expiry_heap)
    store.pop(key, None)
```

## 주의할 점 / 경계 조건

한 query가 성공했다고 data model 전체가 안전한 것은 아닙니다. NULL, 중복, foreign key, 동시 변경, transaction 범위를 함께 확인해야 합니다.

## 관련 용어

- `time-to-live`
- `min-heap`

## 흔한 오해

시각으로 저장하면 안전하다고 생각하기 쉽지만, 기준 시계가 다르면 값의 뜻이 달라집니다. 어느 기준의 시각인지 정해 두지 않으면 서버와 클라이언트가 서로 다른 시점을 가리킵니다.

## 동료평가 질문

만료 처리를 힙으로 할 때와 꺼낼 때 확인하는 방식으로 할 때, 각각 어떤 경우에 유리한지 말할 수 있나요?
