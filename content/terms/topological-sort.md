# Topological Sort

## 한 줄 설명

DAG의 정점을 위상 순서로 만드는 알고리즘.

## 쉽게 설명하면

선행 조건을 모두 지킨 작업 목록을 만드는 절차다.

## 정확한 설명

진입 차수가 0인 정점을 차례로 제거하는 Kahn 알고리즘이나 DFS 후위 순회를 사용한다. 결과 수가 정점 수보다 적으면 cycle이 있다.

## 작은 사례

빌드 시스템에서 의존 모듈을 먼저 처리한다.

## 주의할 점

정렬 결과가 하나뿐이라고 가정하면 안 된다.

## 이 미션에서는 왜 필요한가

위상 순서를 실제로 만들어 내는 절차입니다. 들어오는 간선이 없는 커밋부터 꺼내고, 꺼낼 때마다 그 커밋에 의존하던 쪽의 남은 개수를 줄여 갑니다. 중간에 꺼낼 것이 없는데 남은 커밋이 있다면 그것이 곧 순환이 있다는 증거입니다.

## 코드 예

```python
from collections import deque

def topo(nodes, parents):
    remaining = {n: len(parents.get(n, [])) for n in nodes}
    q = deque(sorted(n for n, c in remaining.items() if c == 0))
    order = []
    children = {}
    for n, ps in parents.items():
        for p in ps:
            children.setdefault(p, []).append(n)
    while q:
        node = q.popleft()
        order.append(node)
        for child in children.get(node, []):
            remaining[child] -= 1
            if remaining[child] == 0:
                q.append(child)
    if len(order) != len(nodes):
        raise ValueError('순환이 있다')
    return order
```

## 관련 용어

- `topological-order`
- `cycle`
