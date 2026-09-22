# Cycle

## 한 줄 설명

그래프를 따라가 다시 출발 정점으로 돌아오는 경로.

## 쉽게 설명하면

화살표를 계속 따라가면 원래 자리로 돌아오는 고리다.

## 정확한 설명

의존성 그래프의 cycle은 선후 순서를 모순되게 만들 수 있다. 방문 상태를 색으로 구분하면 DFS 중 순환을 탐지할 수 있다.

## 대표 사용

모듈 A가 B를, B가 다시 A를 요구하는 의존성 오류를 찾는다.

## 주의할 점

모든 그래프의 cycle이 오류는 아니지만, DAG가 필요한 문제에서는 금지된다.

## 이 미션에서는 왜 필요한가

커밋 그래프에 순환이 있으면 "무엇이 먼저인가"에 답이 없어지고 로그 출력이 무한히 돕니다. 실제 커밋 기록에서는 생기지 않지만, 직접 만든 구조에서 부모를 잘못 연결하면 만들어질 수 있으므로 탐색 코드에 방문 표시가 필요한 이유가 됩니다.

## 코드 예

```python
def has_cycle(parents):
    state = {}                       # 0=방문중, 1=완료
    def visit(node):
        if state.get(node) == 0:     # 방문 중인 노드를 다시 만났다
            return True
        if state.get(node) == 1:
            return False
        state[node] = 0
        found = any(visit(p) for p in parents.get(node, []))
        state[node] = 1
        return found
    return any(visit(n) for n in parents)
```

## 관련 용어

- `directed-acyclic-graph`
- `dfs`
