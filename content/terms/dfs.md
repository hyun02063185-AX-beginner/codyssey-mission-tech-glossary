# DFS

## 한 줄 설명

한 경로를 끝까지 내려간 뒤 되돌아오는 깊이 우선 탐색.

## 쉽게 설명하면

갈림길에서 하나를 끝까지 파고든 뒤 막히면 되돌아오는 방식이다.

## 정확한 설명

재귀 호출이나 명시적 스택으로 구현한다. 탐색 중 상태를 기록하면 cycle 탐지와 연결 요소 탐색에 쓸 수 있다.

## 판단 기준

폴더 트리나 의존성 그래프를 깊게 탐색한다.

## 주의할 점

재귀 깊이가 매우 크면 호출 스택 제한에 걸릴 수 있다.

## 이 미션에서는 왜 필요한가

어떤 커밋의 조상을 전부 찾을 때 쓰는 방식입니다. 한 부모를 끝까지 따라 내려간 뒤 되돌아오므로 "이 커밋이 저 커밋의 후손인가"를 판정하기에 알맞습니다. 대신 기록이 길면 재귀 깊이가 쌓이므로 반복문과 스택으로 바꿔 쓰는 판단이 필요합니다.

## 코드 예

```python
def is_ancestor(candidate, node, parents):
    stack = [node]
    while stack:                      # 재귀 대신 스택 — 기록이 길어도 안전하다
        current = stack.pop()
        if current == candidate:
            return True
        stack.extend(parents.get(current, []))
    return False
```

## 관련 용어

- `graph-traversal`
- `cycle`
