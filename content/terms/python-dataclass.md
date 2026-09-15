# Python dataclass

## 한 줄 설명

데이터를 담는 클래스의 생성자·표현·비교 메서드를 선언으로 자동 생성해 주는 Python 기능입니다.

## 쉽게 설명하면

같은 형식의 기록표를 매번 손으로 만들지 않고 필요한 칸만 선언하는 방식입니다.

## 정확한 설명

`@dataclass`는 type-annotated field를 바탕으로 `__init__`, `__repr__`, `__eq__` 등을 생성합니다. 기본값으로 가변 객체를 직접 쓰면 인스턴스 간 공유 문제가 생길 수 있습니다.

## 이 미션에서는 왜 필요한가

M03의 Transaction 구조를 명확한 데이터 형태로 표현하는 후보입니다.

## 코드 예

```python
from dataclasses import dataclass
@dataclass
class Transaction:
    amount: int
    category: str
```

## 주의할 점 / 경계 조건

dataclass는 validation·영속성·불변성을 자동으로 모두 해결하지 않습니다. 필요한 규칙은 별도로 구현합니다.

## 관련 용어

- `class`
- `type-hint`
- `attribute`

## 흔한 오해

dataclass는 database ORM 모델과 같은 개념이 아닙니다.

## 동료평가 질문

list 필드에 `items: list = []` 대신 default_factory가 필요한 이유는 무엇인가요?
