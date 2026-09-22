# 재생성

## 한 줄 설명

조건을 바꾸지 않거나 일부만 바꿔 출력을 다시 생성하는 작업.

## 쉽게 설명하면

마음에 들지 않는 결과를 새 시도로 다시 받는 일이다.

## 정확한 설명

비결정적 sampling에서는 같은 입력도 다른 결과를 만들 수 있다. 재생성 횟수·비용·이전 결과 보존 방식을 정해야 한다.

## 언제 쓰나

사용자가 답변 카드의 다시 생성 버튼을 누른다.

## 기억할 경계

재생성은 사실 확인이나 오류 수정의 대체 수단이 아니다.

## 이 미션에서는 왜 필요한가

검증에 걸렸을 때 그냥 실패로 끝내지 않고 다시 요청하는 처리입니다. 같은 입력이라도 결과가 달라질 수 있어 두 번째에 통과하는 일이 흔하지만, 횟수 제한을 두지 않으면 실패한 요청에 비용이 계속 쌓입니다.

## 코드 예

```python
def generate(prompt, max_tries=3):
    problems = []
    for attempt in range(max_tries):
        result = ask(prompt if attempt == 0 else prompt + FIXUP.format(problems))
        problems = validate(result)
        if not problems:
            return result
    raise RuntimeError(f'{max_tries}번 시도 후에도 형식이 맞지 않습니다: {problems}')

# 무한 재시도는 비용이 무한이라는 뜻이다. 상한을 반드시 둔다
```

## 관련 용어

- `temperature`
- `token-usage-cost`
