# relationship

## 한 줄 설명

ORM model 사이의 참조 관계를 Python attribute로 표현하는 설정.

## 쉽게 설명하면

표 사이의 연결을 파이썬 속성으로 쓸 수 있게 해 주는 선언입니다. `post.author`처럼 접근합니다.

## 정확한 설명

외래 키로 이어진 표 사이를 객체 속성으로 탐색하게 한다. 이 선언 자체가 표에 열을 만들지는 않고, 실제 연결은 외래 키가 담당한다. 속성에 접근하는 순간 조회가 나가므로, 언제 읽어 올지를 지정하지 않으면 예상치 못한 시점에 조회가 발생한다.

## 동작 원리

속성에 처음 접근할 때 필요한 조회를 내보내 값을 채웁니다. 미리 함께 읽도록 지정하면 원래 조회에 연결을 붙여 한 번에 가져옵니다.

## 이 미션에서는 왜 필요한가

이 회차에서 모델 사이의 관계를 선언하는 자리입니다. 이것을 적었다고 표에 연결이 생기는 것은 아니라는 점이 자주 오해되는데, 외래 키를 함께 적지 않으면 어느 열로 이어지는지 정해지지 않습니다.

## 코드 예

```python
class Post(Base):
    __tablename__ = 'post'
    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey('member.id'))  # 표의 연결
    author: Mapped['Member'] = relationship(back_populates='posts')  # 파이썬의 길

post = session.get(Post, 1)
print(post.author.name)      # 이 순간 조회가 나간다

# 미리 함께 읽는다
from sqlalchemy.orm import joinedload
posts = session.scalars(select(Post).options(joinedload(Post.author))).all()
```

## 주의할 점 / 경계 조건

속성에 접근하는 순간 조회가 나갑니다. 화면을 그리는 템플릿 안에서 접근하면 조회가 그때 발생합니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

이 선언이 표의 연결을 만든다고 생각하기 쉽지만, 표 쪽 연결은 외래 키가 만듭니다. 이쪽은 파이썬에서 오가는 길입니다.

## 동료평가 질문

이 선언과 외래 키가 각각 무엇을 담당하는지 구분해 설명할 수 있나요?
