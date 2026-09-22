# summary

## 한 줄 설명

여러 정보 조각을 모아 핵심을 압축한 요약 결과를 만드는 과정.

## 쉽게 설명하면

긴 기록 여러 개에서 중요한 내용만 묶어 짧게 정리하는 일이다.

## 정확한 설명

부분 요약을 다시 합치는 계층적 방식이나 항목별 점수화 방식을 쓸 수 있다. 출처와 누락 위험을 관리해야 한다.

## 작은 사례

긴 회의 기록을 주제별 요약으로 합친다.

## 주의할 점

요약은 원문을 대체하지 않으며 중요한 조건이 빠질 수 있다.

## 이 미션에서는 왜 필요한가

이 회차가 요구하는 월별 총수입·총지출·잔액이 이것입니다. 기록을 한 번 훑으면서 분류별로 더하는 일인데, 어떤 기준으로 묶을지(달? 분류? 둘 다?)를 먼저 정해야 같은 데이터에서 다른 표가 나오는 일을 막을 수 있습니다.

## 코드 예

```python
from collections import defaultdict
from decimal import Decimal

def monthly(transactions):
    acc = defaultdict(lambda: {'income': Decimal(0), 'expense': Decimal(0)})
    for t in transactions:
        key = t.date.strftime('%Y-%m')
        side = 'expense' if t.amount < 0 else 'income'
        acc[key][side] += abs(t.amount)
    for key, v in acc.items():
        v['balance'] = v['income'] - v['expense']
    return dict(sorted(acc.items()))
```

## 관련 용어

- `max-tokens`
- `post-processing`
