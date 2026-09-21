# Bidirectional Relationship

## 한 줄 설명

두 model이 서로를 탐색할 수 있게 양방향으로 선언한 관계.

## 쉽게 설명하면

`Bidirectional Relationship`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.

## 정확한 설명

두 model이 서로를 탐색할 수 있게 양방향으로 선언한 관계. 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M13에서 관계 선언과 `back_populates`를 함께 이해해야 하는 이유입니다. 회원에서 글로도, 글에서 회원으로도 건너갈 수 있게 하려면 두 선언이 같은 관계를 가리킨다고 알려 줘야 합니다.

## 코드 예

```python
# 한쪽만 바꿔도 반대쪽이 따라온다
user.posts.append(post)
assert post.author is user

# back_populates 가 없으면 이 assert 가 깨진다
```

## 주의할 점 / 경계 조건

한 query가 성공했다고 data model 전체가 안전한 것은 아닙니다. NULL, 중복, foreign key, 동시 변경, transaction 범위를 함께 확인해야 합니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

ORM이나 database 기능이 application의 모든 validation과 business rule을 자동으로 대신하지는 않습니다.

## 동료평가 질문

이 구조에서 중복·삭제·실패가 일어날 때 어떤 제약과 transaction 경계가 필요한가요?
