# N:M

## 한 줄 설명

양쪽 entity가 여러 상대 entity와 연결되는 관계.

## 쉽게 설명하면

`N:M`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.

## 정확한 설명

양쪽 entity가 여러 상대 entity와 연결되는 관계. 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M13이 요구하지 않는 관계입니다. 태그처럼 양쪽 모두 여럿인 경우에 쓰는데, 중간 테이블이 하나 더 필요해 설계가 한 단계 복잡해집니다. 요구하지 않는 이유를 알고 넘어가면 나중에 필요할 때 판단할 수 있습니다.

## 코드 예

```python
# 중간 테이블이 따로 필요하다
post_tags = Table("post_tags", Base.metadata,
    Column("post_id", ForeignKey("posts.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True))

# M13 은 여기까지 요구하지 않는다
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
