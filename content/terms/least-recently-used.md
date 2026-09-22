# LRU

## 한 줄 설명

가장 오래 사용하지 않은 항목을 먼저 비우는 캐시 교체 정책.

## 쉽게 설명하면

자주 다시 찾는 것은 남기고 한동안 손대지 않은 것을 내보내는 방식이다.

## 정확한 설명

조회 때 항목을 최근 위치로 옮기고, 공간이 차면 꼬리의 항목을 제거한다. 해시맵과 이중 연결 리스트 조합으로 O(1)에 구현할 수 있다.

## 작동 흐름

입력 → 자료구조/규칙 적용 → 결과를 만드는 과정을 작은 사례로 따라가 보는 것이 이해에 가장 빠르다.

## 사용 장면

최근 본 문서나 API 응답을 제한된 메모리에 보관할 때 쓴다.

## 경계와 오해

최근에 쓰지 않았다고 앞으로도 안 쓸 것이라는 보장은 없다.

## 동료평가 질문

조회만 하고 저장은 하지 않은 키가 제거 대상에서 밀려나는 이유를, 구현한 순서 갱신과 함께 설명할 수 있나요?

## 이 미션에서는 왜 필요한가

저장소에 메모리 한도를 두면 무엇을 지울지 정해야 하고, 이 회차가 쓰는 규칙이 LRU입니다. "가장 오래 안 쓴 것"을 알아내려면 조회할 때마다 순서를 갱신해야 하므로, 단순히 지우는 규칙이 아니라 접근 순서를 유지하는 설계 문제가 됩니다.

## 코드 예

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.data = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.data:
            return None
        self.data.move_to_end(key)      # 조회도 "사용"이다
        return self.data[key]

    def put(self, key, value):
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.capacity:
            self.data.popitem(last=False)   # 가장 오래된 것부터
```

## 관련 용어

- `cache-eviction`
- `doubly-linked-list`
