# N:M

## 한 줄 설명

양쪽 entity가 여러 상대 entity와 연결되는 관계.

## 쉽게 설명하면

양쪽 모두 여럿인 관계입니다. 글 하나에 태그 여럿, 태그 하나에 글 여럿인 경우입니다.

## 정확한 설명

표 두 개로는 표현할 수 없어 중간 표가 필요하다. 중간 표가 양쪽의 키를 한 쌍으로 담으며, 이것은 결국 1:N 관계 두 개로 나뉜 것이다. 관계 자체에 속성이 붙어야 한다면 중간 표를 그냥 두지 않고 하나의 모델로 만드는 편이 낫다.

## 이 미션에서는 왜 필요한가

본과정 M13이 요구하지 않는 관계입니다. 태그처럼 양쪽 모두 여럿인 경우에 쓰는데, 중간 테이블이 하나 더 필요해 설계가 한 단계 복잡해집니다. 요구하지 않는 이유를 알고 넘어가면 나중에 필요할 때 판단할 수 있습니다.

## 코드 예

```python
# 연결만 필요하면
post_tag = Table(
    'post_tag', Base.metadata,
    Column('post_id', ForeignKey('post.id'), primary_key=True),
    Column('tag_id', ForeignKey('tag.id'), primary_key=True),
)

class Post(Base):
    tags: Mapped[list['Tag']] = relationship(secondary=post_tag, back_populates='posts')

# 관계에 속성이 붙으면 모델로 만든다
class PostTag(Base):
    __tablename__ = 'post_tag'
    post_id: Mapped[int] = mapped_column(ForeignKey('post.id'), primary_key=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey('tag.id'), primary_key=True)
    created_at: Mapped[datetime]      # 이런 것이 생기면
```

## 주의할 점 / 경계 조건

관계에 속성이 필요해지면(언제 붙였는지, 누가 붙였는지) 중간 표를 모델로 만들어야 합니다. 나중에 바꾸면 이미 쌓인 데이터를 옮겨야 합니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

표 두 개로 표현할 수 있다고 생각하기 쉽지만, 한 칸에 여러 값을 담아야 해서 성립하지 않습니다. 중간 표가 필수입니다.

## 동료평가 질문

중간 표를 단순 연결로 둘지 모델로 만들지 정하는 기준을 설명할 수 있나요?
