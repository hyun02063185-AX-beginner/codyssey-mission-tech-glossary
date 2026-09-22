# 합성곱

## 한 줄 설명

작은 필터를 입력 위로 이동하며 국소 패턴을 계산하는 연산.

## 쉽게 설명하면

이미지의 작은 창을 훑으며 모서리나 질감을 찾는 계산이다.

## 정확한 설명

필터와 입력의 같은 위치 원소를 곱해 더한 값을 feature map에 기록한다. stride·padding이 출력 크기를 바꾼다.

## 작은 사례

이미지 분류 모델의 초반 특징 추출 층에 사용한다.

## 주의할 점

합성곱은 단순한 행렬 곱 하나와 같지 않으며 차원 규칙이 중요하다.

## 이 미션에서는 왜 필요한가

이 회차에서 필터를 입력 위로 한 칸씩 옮기며 계산하는 동작의 정식 이름입니다. 직접 짤 때는 이중 반복문으로 보이지만, 그 반복문이 무엇을 하는지 이름으로 말할 수 있어야 결과 크기가 왜 줄어드는지도 설명됩니다.

## 코드 예

```python
def convolve(grid, kernel):
    n, k = len(grid), len(kernel)
    out = []
    for r in range(n - k + 1):          # 출력 크기가 n-k+1 로 줄어드는 이유
        row = []
        for c in range(n - k + 1):
            total = 0
            for i in range(k):
                for j in range(k):
                    total += grid[r + i][c + j] * kernel[i][j]
            row.append(total)
        out.append(row)
    return out

# 5x5 입력에 3x3 필터 → 3x3 출력. 가장자리는 필터가 걸치지 못한다
```

## 관련 용어

- `tensor`
- `weight`
