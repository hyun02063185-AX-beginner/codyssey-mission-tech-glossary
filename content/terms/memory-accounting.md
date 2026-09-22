# Memory Accounting

## 한 줄 설명

프로세스나 구성 요소별 메모리 사용량을 측정·분류하는 일.

## 쉽게 설명하면

누가 메모리를 얼마나 쓰는지 장부처럼 기록하는 작업이다.

## 정확한 설명

heap, stack, cache, shared memory 등의 사용량을 구분해야 누수와 정상 cache 증가를 구별할 수 있다.

## 언제 쓰나

컨테이너의 메모리 제한 초과 원인을 프로세스별로 조사한다.

## 기억할 경계

RSS 하나만으로 실제 회수 가능한 메모리까지 모두 설명할 수는 없다.

## 이 미션에서는 왜 필요한가

저장소가 자기 메모리 사용량을 보고하려면 무엇을 세는지 먼저 정해야 합니다. 저장한 값만 셀지, 키와 버킷 배열과 만료 힙까지 셀지에 따라 숫자가 달라지므로, 정의를 밝히지 않은 사용량 보고는 다른 실행과 비교할 수 없습니다.

## 코드 예

```python
import sys

def usage(store):
    keys = sum(sys.getsizeof(k) for k in store.data)
    values = sum(sys.getsizeof(v) for v in store.data.values())
    table = sys.getsizeof(store.buckets)
    return {'keys': keys, 'values': values, 'table': table,
            'total': keys + values + table}

# 무엇을 포함했는지 함께 적어야 숫자를 비교할 수 있다
```

## 관련 용어

- `system-monitoring`
- `memory-leak`
