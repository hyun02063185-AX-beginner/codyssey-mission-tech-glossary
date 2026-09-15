# yield

## 한 줄 설명

Python generator가 값을 하나 내보내고 실행 상태를 다음 호출까지 보존하게 하는 키워드입니다.

## 쉽게 설명하면

책갈피를 끼워 둔 채 한 페이지를 건네고, 다음에 같은 자리에서 다시 읽는 것과 같습니다.

## 정확한 설명

`yield`가 있는 함수는 호출 즉시 본문을 모두 실행하지 않고 generator object를 반환합니다. iteration이 진행될 때마다 값과 지역 상태를 보존·재개합니다.

## 이 미션에서는 왜 필요한가

M03에서 큰 데이터를 지연 처리하는 generator 구현의 핵심 문법입니다.

## 코드 예

```python
def count_up():
    yield 1
    yield 2
```

## 주의할 점 / 경계 조건

yield를 쓰는 함수의 반환값·예외·종료 처리 방식은 일반 return 함수와 다르므로 호출자가 iterator로 소비해야 합니다.

## 관련 용어

- `generator`
- `iterator`
- `function`

## 흔한 오해

yield는 값을 출력하는 print가 아니며, generator를 만들었다고 값이 바로 계산되는 것도 아닙니다.

## 동료평가 질문

count_up()을 호출한 직후와 next(count_up())를 호출한 뒤에는 무엇이 다른가요?
