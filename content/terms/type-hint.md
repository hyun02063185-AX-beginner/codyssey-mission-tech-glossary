# Type Hint

## 한 줄 설명

변수·매개변수·반환값에 기대하는 값의 종류를 표시하는 Python 주석형 정보입니다.

## 쉽게 설명하면

상자에 ‘정수만 넣기’라고 라벨을 붙여 협업자가 기대값을 알게 하는 것과 같습니다.

## 정확한 설명

Python type hint는 런타임에 기본적으로 강제되지 않지만 IDE, type checker, 문서화 도구가 인터페이스 불일치를 찾아내는 데 사용합니다.

## 이 미션에서는 왜 필요한가

M03에서 데이터 구조와 함수 계약을 읽기 쉽게 만들어 유지보수 가능한 설계를 돕습니다.

## 코드 예

```python
def total(values: list[int]) -> int:
    return sum(values)
```

## 주의할 점 / 경계 조건

Type hint가 있다고 잘못된 외부 입력이 자동 거부되지는 않으므로 input validation은 별도로 필요합니다.

## 관련 용어

- `python-dataclass`
- `input-validation`
- `function`

## 흔한 오해

Type hint는 Java·TypeScript처럼 Python 실행을 자동으로 강하게 제한하는 문법이 아닙니다.

## 동료평가 질문

`list[int]`라고 적은 함수에 문자열 목록이 들어오는 문제를 어떻게 더 일찍 찾을 수 있나요?
