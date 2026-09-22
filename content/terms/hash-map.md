# 해시맵

## 한 줄 설명

키를 해시해 값에 빠르게 접근하는 자료구조.

## 쉽게 설명하면

이름표를 넣으면 해당 서랍으로 바로 가는 사물함에 가깝다.

## 정확한 설명

해시 함수가 키를 버킷 위치로 바꾸고, 충돌은 체이닝 또는 다른 탐사 방식으로 해결한다. 평균 조회·삽입은 O(1)이다.

## 실행 관점

정확성뿐 아니라 데이터 크기, 메모리, 갱신 빈도, 실패 조건을 함께 고려해야 한다.

## 사용 장면

사용자 ID를 키로 하여 프로필을 찾는 인메모리 캐시에 적합하다.

## 경계와 오해

키의 순서가 보장되지 않으며 최악의 충돌 상황에서는 O(n)이 될 수 있다.

## 동료평가 질문

키가 늘어나도 조회 시간이 거의 늘지 않는다는 것을, 측정값이나 버킷 분포로 보여 줄 수 있나요?

## 이 미션에서는 왜 필요한가

이 회차에서 만드는 저장소 자체가 해시맵입니다. 키를 순서대로 훑지 않고 계산 한 번으로 자리를 정하기 때문에, 저장된 키가 1만 개든 100만 개든 조회 시간이 비슷합니다. 이 구조를 모르면 왜 빠른지를 설명하지 못한 채 동작만 흉내 내게 됩니다.

## 코드 예

```python
class HashMap:
    def __init__(self, capacity=8):
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def put(self, key, value):
        bucket = self.buckets[hash(key) % len(self.buckets)]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)   # 같은 키면 덮어쓴다
                return
        bucket.append((key, value))
        self.size += 1
```

## 관련 용어

- `hash-function`
- `collision`
