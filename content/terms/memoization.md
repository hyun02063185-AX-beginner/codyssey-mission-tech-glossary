# Memoization

## 한 줄 설명

같은 입력의 함수 결과를 저장해 다음 호출에서 계산을 반복하지 않는 최적화 기법입니다.

## 쉽게 설명하면

이미 푼 계산 문제의 답을 메모해 같은 문제를 다시 풀지 않는 방식입니다.

## 정확한 설명

Memoization은 함수 입력을 cache key로 사용해 이전 결과를 재사용합니다. 순수 함수와 제한된 입력 공간에 적합하며, key 생성·메모리·무효화 비용이 있습니다.

## 이 미션에서는 왜 필요한가

M02에서 useMemo·useCallback·React.memo를 결과 재사용이라는 상위 개념으로 비교합니다.

## 코드 예

```python
from functools import lru_cache
@lru_cache
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)
```

## 주의할 점 / 경계 조건

외부 상태에 의존하거나 매번 달라지는 함수 결과를 무조건 memoize하면 오래된 값을 재사용할 수 있습니다.

## 관련 용어

- `cache`
- `least-recently-used`
- `react-memo`

## 흔한 오해

Memoization은 모든 함수를 자동으로 빠르게 만드는 기능이 아니며, cache 관리 비용이 있습니다.

## 동료평가 질문

현재 시간에 의존하는 함수를 memoize하면 왜 잘못된 결과가 나올 수 있나요?
