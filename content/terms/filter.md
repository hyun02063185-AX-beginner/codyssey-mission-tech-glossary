# 데이터 필터

## 한 줄 설명

조건에 맞는 data만 남기는 선택 처리.

## 쉽게 설명하면

`데이터 필터`은(는) 들어온 값 가운데 조건에 맞는 것만 남기거나, 미리 정해 둔 본보기와 견주어 맞는지 판단하는 데 쓰는 기준입니다.

## 정확한 설명

조건에 맞는 data만 남기는 선택 처리. 예비 M03의 시뮬레이터에서는 이 개념이 "판별의 기준이 되는 본보기 격자"라는 뜻으로 쓰입니다. 입력 격자를 본보기와 칸별로 견주어 얼마나 겹치는지 세고, 가장 많이 겹치는 본보기의 이름을 답으로 내놓습니다.

## 이 미션에서는 왜 필요한가

예비 M03은 `data.json`에 담긴 filters를 읽어 입력 패턴이 무엇인지 판별하게 합니다. 필터 하나가 곧 "이런 모양이면 이 이름"이라는 규칙이므로, 판별 기준을 코드에 박지 않고 데이터로 두는 설계가 여기서 나옵니다.

## 코드 예

```python
filters = json.load(open("data.json"))["filters"]

def classify(grid):
    scores = {}
    for name, pattern in filters.items():
        scores[name] = sum(
            g == p
            for row_g, row_p in zip(grid, pattern)
            for g, p in zip(row_g, row_p)
        )
    return max(scores, key=scores.get)
```

## 주의할 점 / 경계 조건

가장 많이 겹치는 것을 고르는 방식이라 동점이 날 수 있습니다. 동점일 때 무엇을 고를지 규칙을 정해 두지 않으면 실행할 때마다 답이 달라질 수 있습니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

ORM이나 database 기능이 application의 모든 validation과 business rule을 자동으로 대신하지는 않습니다.

## 동료평가 질문

이 구조에서 중복·삭제·실패가 일어날 때 어떤 제약과 transaction 경계가 필요한가요?
