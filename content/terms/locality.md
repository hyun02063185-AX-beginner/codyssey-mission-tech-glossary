# 메모리 지역성

## 한 줄 설명

가까운 메모리나 최근 데이터에 다시 접근하기 쉬운 성질.

## 쉽게 설명하면

방금 쓴 서랍이나 그 옆 서랍을 다시 쓰면 더 빨리 꺼낼 가능성이 높다.

## 정확한 설명

시간 지역성은 최근 사용 데이터를, 공간 지역성은 인접 데이터를 다시 쓰는 경향이다. CPU cache가 이를 이용한다.

## 언제 쓰나

배열을 연속 순회하면 포인터를 따라 흩어진 구조보다 cache 친화적일 수 있다.

## 기억할 경계

알고리즘 복잡도가 같아도 지역성 차이로 실제 속도는 달라질 수 있다.

## 이 미션에서는 왜 필요한가

같은 개수의 값을 다루는데도 1차원 배열과 2차원 배열의 속도가 다른 이유가 여기 있습니다. 연산 횟수가 같아도 메모리에서 값을 가져오는 거리가 다르면 실제 시간이 달라지므로, 측정 결과를 "복잡도가 같은데 왜 다른가"로 설명할 수 있게 됩니다.

## 코드 예

```python
import time

grid = [[0] * 1000 for _ in range(1000)]

start = time.perf_counter()
for r in range(1000):            # 행을 따라 — 메모리상 이웃한 값
    for c in range(1000):
        grid[r][c] += 1
print(time.perf_counter() - start)

start = time.perf_counter()
for c in range(1000):            # 열을 따라 — 매번 다른 행으로 건너뛴다
    for r in range(1000):
        grid[r][c] += 1
print(time.perf_counter() - start)   # 연산 수는 같은데 더 느리다
```

## 관련 용어

- `cache`
- `memory-accounting`
