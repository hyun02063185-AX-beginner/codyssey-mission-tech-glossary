# 거래 데이터

## 한 줄 설명

금융·주문·결제처럼 상태 변화가 기록된 개별 거래 데이터.

## 쉽게 설명하면

무언가가 사고팔리거나 이동한 한 건의 사실 기록이다.

## 정확한 설명

금액, 시각, 주체, 상태, 식별자를 포함하며 정합성·감사·중복 처리 요구가 높다.

## 대표 사용

주문 생성과 환불을 별도 거래 행으로 남긴다.

## 주의할 점

분석용 집계값과 원본 거래 레코드를 같은 것으로 취급하면 추적성이 떨어진다.

## 이 미션에서는 왜 필요한가

이 회차에서 다루는 기록 한 줄이 이것입니다. 날짜·금액·분류·설명을 무엇으로 정할지가 곧 데이터 모델이며, 나중에 월별 집계나 상위 항목을 뽑을 때 여기서 정해 둔 항목만 기준으로 쓸 수 있습니다.

## 코드 예

```python
from dataclasses import dataclass
from datetime import date
from decimal import Decimal

@dataclass
class Transaction:
    date: date
    amount: Decimal      # 금액은 float 로 두지 않는다 (0.1+0.2 문제)
    category: str
    memo: str = ''

    @property
    def is_expense(self):
        return self.amount < 0

# 수입과 지출을 따로 두지 않고 부호로 구분하면 집계가 단순해진다
```

## 관련 용어

- `serialization`
- `backup`
