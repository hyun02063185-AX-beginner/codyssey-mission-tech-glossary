# load factor

## 한 줄 설명

해시 테이블의 저장 항목 수를 버킷 수로 나눈 비율.

## 쉽게 설명하면

서랍 수에 비해 물건이 얼마나 찼는지 나타내는 수치다.

## 정확한 설명

load factor가 커질수록 한 버킷의 평균 항목 수와 충돌 비용이 증가한다. 임계값을 넘으면 보통 버킷을 늘리고 재해싱한다.

## 판단 기준

캐시용 해시맵의 성능 저하 원인을 판단할 때 본다.

## 주의할 점

낮다고 항상 좋은 것은 아니며, 너무 낮으면 메모리를 낭비한다.

## 이 미션에서는 왜 필요한가

저장된 항목 수를 버킷 수로 나눈 값이며, 이 회차는 0.75를 넘으면 버킷을 늘리도록 요구합니다. 이 수치를 보지 않으면 저장소가 언제부터 느려지기 시작했는지 설명할 근거가 없습니다. 조회 시간이 서서히 늘어날 때 가장 먼저 확인할 숫자입니다.

## 코드 예

```python
def maybe_resize(self):
    if self.size / len(self.buckets) <= 0.75:
        return
    old = self.buckets
    self.buckets = [[] for _ in range(len(old) * 2)]
    self.size = 0
    for bucket in old:
        for k, v in bucket:    # 버킷 수가 바뀌었으므로 전부 다시 배치한다
            self.put(k, v)
```

## 관련 용어

- `hash-map`
- `hash-bucket`
