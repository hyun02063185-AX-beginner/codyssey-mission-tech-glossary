# Generator

## 한 줄 설명

필요한 값을 한꺼번에 만들지 않고 요청될 때마다 하나씩 내보내는 반복 가능한 실행 흐름입니다.

## 쉽게 설명하면

물을 통째로 붓지 않고 수도꼭지를 열 때마다 한 컵씩 받는 방식과 비슷합니다.

## 정확한 설명

Python generator는 `yield`를 만나면 현재 지역 상태를 보존한 채 값을 내보내고, 다음 iteration에서 그 지점부터 재개합니다. 큰 입력을 지연 처리할 때 메모리를 줄일 수 있습니다.

## 이 미션에서는 왜 필요한가

M03에서 파일 전체를 메모리에 올리지 않고 데이터를 스트리밍 처리하는 선택지입니다.

## 코드 예

```python
def lines(path):
    with open(path) as file:
        for line in file:
            yield line.rstrip()
```

## 주의할 점 / 경계 조건

Generator는 한 번 소비하면 처음부터 다시 읽을 수 없는 iterator일 수 있으므로 재사용 요구를 확인해야 합니다.

## 관련 용어

- `yield`
- `iterator`
- `streaming`

## 흔한 오해

Generator가 항상 더 빠른 것은 아닙니다. 계산을 미루는 대신 반복 시점에 비용을 지불합니다.

## 동료평가 질문

대용량 파일에서 list보다 generator가 메모리 사용량을 줄이는 이유는 무엇인가요?
