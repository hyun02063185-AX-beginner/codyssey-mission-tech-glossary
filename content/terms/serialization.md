# Serialization

## 한 줄 설명

메모리 안의 값을 저장·전송 가능한 바이트나 형식으로 변환하는 과정.

## 쉽게 설명하면

객체를 JSON 같은 전달 가능한 포장으로 바꾸는 일이다.

## 정확한 설명

encoder는 자료구조를 JSON·bytes 등으로 바꾸고 decoder는 계약에 따라 복원한다. schema와 버전 호환성이 중요하다.

## 작은 사례

API response의 객체를 JSON으로 직렬화한다.

## 주의할 점

직렬화 가능한 형식이라고 민감 정보 공개까지 안전한 것은 아니다.

## 이 미션에서는 왜 필요한가

가계부 기록을 프로그램을 껐다 켜도 남게 하려면 메모리 안의 객체를 파일에 쓸 수 있는 형태로 바꿔야 합니다. 이때 날짜와 Decimal처럼 JSON이 모르는 타입은 그대로 나가지 않으므로, 어떤 형태로 적을지 정하고 읽을 때 되돌려야 합니다.

## 코드 예

```python
import json
from datetime import date
from decimal import Decimal

def encode(t):
    return {'date': t.date.isoformat(), 'amount': str(t.amount),
            'category': t.category, 'memo': t.memo}

def decode(d):
    return Transaction(date.fromisoformat(d['date']), Decimal(d['amount']),
                       d['category'], d['memo'])

# amount 를 float 로 내보내면 읽을 때 값이 미세하게 달라질 수 있다.
# 문자열로 적고 Decimal 로 되돌린다
```

## 관련 용어

- `structured-output`
- `transaction-data`
