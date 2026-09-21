# 성능 측정

## 한 줄 설명

정해진 workload와 지표로 성능을 재는 비교 실험.

## 쉽게 설명하면

같은 시험 문제로 속도·메모리·비용을 재는 성능 측정이다.

## 정확한 설명

입력, 환경, warm-up, 반복 횟수, percentile 지표를 고정해 비교 가능성을 만든다.

## 작은 사례

두 모델의 요약 지연 시간과 비용을 같은 문서 집합에서 비교한다.

## 주의할 점

단일 최고 수치만 보면 tail latency나 비용 변화를 놓친다.

## 이 미션에서는 왜 필요한가

예비 M03은 입력 크기를 바꿔 가며 10회 평균을 재라고 요구합니다. 한 번 잰 값은 그때의 컴퓨터 상태에 좌우되므로, 여러 번 재어 평균을 내야 크기에 따른 변화를 이야기할 수 있습니다.

## 코드 예

```python
import time, statistics

def measure(fn, grid, runs=10):
    times = []
    for _ in range(runs):
        start = time.perf_counter()
        fn(grid)
        times.append(time.perf_counter() - start)
    return statistics.mean(times)
```

## 관련 용어

- `before-after-experiment`
- `system-monitoring`
