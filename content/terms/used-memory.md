# used_memory

## 한 줄 설명

프로세스 또는 시스템이 현재 사용 중인 메모리 양.

## 쉽게 설명하면

지금 실행 중인 프로그램들이 점유한 RAM 규모를 나타내는 수치다.

## 정확한 설명

도구마다 cache, shared memory, reclaimable memory를 포함하는 방식이 달라 정의를 확인해야 한다.

## 판단할 점

컨테이너 메모리 사용량 증가를 `docker stats`로 관찰한다.

## 주의할 점

used memory 증가만으로 누수라고 결론 내리면 안 된다.

## 이 미션에서는 왜 필요한가

이 회차에서 저장소가 스스로 보고해야 하는 값입니다. 무엇을 포함해 셀지 정해 두지 않으면 같은 저장소가 실행할 때마다 다른 숫자를 말하게 되고, 상한과 비교할 수도 없습니다.

## 코드 예

```python
import sys

def used_memory(self):
    """키 + 값 + 버킷 배열. 만료 힙과 파이썬 자체 오버헤드는 제외한다."""
    return (sum(sys.getsizeof(k) for k in self.data)
            + sum(sys.getsizeof(v) for v in self.data.values())
            + sys.getsizeof(self.buckets))

# 무엇을 포함했는지 docstring 에 적어 둔다.
# 정의가 없는 숫자는 상한과 비교할 수 없다
```

## 관련 용어

- `docker-stats`
- `memory-accounting`
