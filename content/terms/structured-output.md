# Structured Output

## 한 줄 설명

정해진 schema에 맞춰 필드와 타입이 있는 형태로 내보낸 결과.

## 쉽게 설명하면

사람용 문장 대신 프로그램이 바로 읽을 수 있는 칸 채운 답이다.

## 정확한 설명

JSON schema나 도구 호출 계약으로 필수 필드·enum·중첩 구조를 지정한다. 소비 전에는 여전히 파싱과 검증이 필요하다.

## 언제 쓰나

제목·요약·태그를 가진 JSON 객체를 생성한다.

## 기억할 경계

JSON처럼 보여도 유효 JSON 또는 요구 schema라는 보장은 없다.

## 이 미션에서는 왜 필요한가

결과를 사람이 읽기만 한다면 자유로운 글도 괜찮지만, 이 회차의 도구는 결과를 프로그램이 다시 씁니다. 필드와 타입을 정해 두면 뒤쪽 검증과 후처리가 단순해지고, 어디가 잘못됐는지도 필드 이름으로 말할 수 있습니다.

## 코드 예

```python
SCHEMA = {
    'type': 'object',
    'required': ['title', 'body'],
    'properties': {
        'title': {'type': 'string', 'maxLength': 50},
        'body':  {'type': 'string'},
        'tags':  {'type': 'array', 'items': {'type': 'string'}},
    },
}

# 형식을 지정해도 파싱과 검증은 여전히 해야 한다.
# JSON 처럼 보이는 문자열이 유효한 JSON 이라는 보장은 없다
```

## 관련 용어

- `output-validation`
- `serialization`
