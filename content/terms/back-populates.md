# back_populates

## 한 줄 설명

SQLAlchemy에서 양쪽 relationship 속성이 서로 대응함을 선언하는 옵션.

## 쉽게 설명하면

`back_populates`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.

## 정확한 설명

SQLAlchemy에서 양쪽 relationship 속성이 서로 대응함을 선언하는 옵션. 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.

## 동작 원리

입력 data와 schema·관계 규칙을 확인한 뒤 query 또는 ORM 작업을 수행하고, 성공하면 commit하며 실패하면 rollback 또는 오류 처리로 일관성을 지킵니다.

## 이 미션에서는 왜 필요한가

본과정 M13은 양방향 관계를 요구합니다. 양쪽에 각각 선언만 하면 서로 다른 관계로 취급돼 한쪽을 바꿔도 반대쪽에 반영되지 않는데, 이 설정이 둘을 한 쌍으로 묶어 줍니다.

## 코드 예

```python
class User(Base):
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class Post(Base):
    author: Mapped["User"] = relationship(back_populates="posts")

user.posts.append(post)   # post.author 도 함께 채워진다
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
