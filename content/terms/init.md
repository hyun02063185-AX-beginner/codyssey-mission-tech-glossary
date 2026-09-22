# 생성자

## 한 줄 설명

객체가 만들어질 때 초기 상태를 설정하는 생성자.

## 쉽게 설명하면

새 물건을 만들면서 필요한 속성을 처음 채우는 함수다.

## 정확한 설명

Python의 `__init__`은 인스턴스 생성 뒤 호출되어 필드와 불변 조건을 설정한다.

## 언제 쓰나

`User(name)`에서 name을 검증해 `self.name`에 저장한다.

## 기억할 경계

`__init__`은 객체 자체를 만드는 `__new__`와 역할이 다르다.

## 이 미션에서는 왜 필요한가

퀴즈를 클래스로 만들기 시작하면 가장 먼저 쓰게 되는 메서드입니다. 객체가 만들어지는 순간 점수와 문제 번호를 어떤 값으로 시작할지 여기서 정하므로, 초기화를 빠뜨리면 첫 문제부터 "속성이 없다"는 오류를 만나게 됩니다.

## 코드 예

```python
class Quiz:
    def __init__(self, questions):
        self.questions = questions
        self.index = 0        # 초기값을 여기서 정하지 않으면
        self.score = 0        # 첫 사용에서 AttributeError 가 난다

    def current(self):
        return self.questions[self.index]

quiz = Quiz(['Q1', 'Q2'])   # __init__ 이 자동으로 불린다
```

## 관련 용어

- `class`
- `object-instance`
