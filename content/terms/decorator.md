# Decorator

## 한 줄 설명

함수나 클래스의 핵심 코드를 바꾸지 않고 앞뒤 동작을 덧붙이는 Python 문법과 패턴입니다.

## 쉽게 설명하면

선물 상자 자체는 건드리지 않고 포장지와 리본을 더하는 것과 비슷합니다.

## 정확한 설명

Python decorator는 callable을 받아 새 callable을 반환하거나 객체를 변환합니다. `@name` 표기는 정의 직후 그 변환을 적용하는 문법 설탕입니다.

## 이 미션에서는 왜 필요한가

M03에서 검증·로그처럼 여러 처리에 반복되는 관심사를 비즈니스 로직에서 분리할 때 사용합니다.

## 코드 예

```python
def logged(fn):
    def wrapped(*args, **kwargs):
        print(fn.__name__)
        return fn(*args, **kwargs)
    return wrapped
```

## 주의할 점 / 경계 조건

decorator가 함수의 서명·메타데이터를 가릴 수 있으므로 `functools.wraps`와 적용 순서를 확인해야 합니다.

## 관련 용어

- `separation-of-concerns`
- `logging`
- `function`

## 흔한 오해

Decorator는 상속이나 단순 주석이 아니라 실행 가능한 객체 변환입니다.

## 동료평가 질문

검증 decorator를 여러 개 붙일 때 순서가 결과에 영향을 주는 이유는 무엇인가요?
