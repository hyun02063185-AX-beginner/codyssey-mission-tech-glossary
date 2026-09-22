# BFS

## 한 줄 설명

가까운 정점부터 너비 우선으로 그래프를 탐색하는 알고리즘.

## 쉽게 설명하면

시작점 주변을 한 겹씩 넓혀 가며 찾는 탐색이다.

## 정확한 설명

큐에 다음 방문 후보를 넣고, 꺼낸 정점의 미방문 이웃을 추가한다. 무가중 그래프에서는 최단 간선 수를 구한다.

## 대표 사용

친구 관계에서 두 사람 사이의 최소 연결 단계를 찾는다.

## 주의할 점

가중치가 서로 다르면 BFS 결과가 최소 비용 경로라는 보장은 없다.

## 이 미션에서는 왜 필요한가

두 커밋 사이가 몇 단계 떨어져 있는지 셀 때 씁니다. 가까운 것부터 한 겹씩 넓히므로 처음 도달한 순간이 곧 최소 단계 수이고, 깊이 우선으로 찾은 경로는 그 보장이 없습니다. "몇 번 만에 닿는가"와 "닿기만 하면 되는가"는 다른 질문입니다.

## 코드 예

```python
from collections import deque

def distance(start, target, edges):
    q = deque([(start, 0)])
    seen = {start}
    while q:
        node, d = q.popleft()
        if node == target:
            return d              # 처음 닿은 순간이 최소 단계 수다
        for nxt in edges.get(node, []):
            if nxt not in seen:
                seen.add(nxt)
                q.append((nxt, d + 1))
    return None
```

## 관련 용어

- `graph-traversal`
- `deque`
