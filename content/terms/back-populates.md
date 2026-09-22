# back_populates

## 한 줄 설명

SQLAlchemy에서 양쪽 relationship 속성이 서로 대응함을 선언하는 옵션.

## 쉽게 설명하면

양쪽 표의 연결 속성이 서로 같은 관계를 가리킨다고 알려 주는 설정입니다.

## 정확한 설명

양쪽에 선언한 관계 속성을 하나의 관계로 묶는다. 이 연결이 없으면 두 속성이 서로 다른 관계로 취급되어, 한쪽을 바꿔도 다른 쪽 객체에는 반영되지 않는다. 같은 세션 안에서 두 속성이 서로 다른 상태를 보이는 문제가 여기서 생긴다.

## 동작 원리

한쪽 속성에 값을 넣으면 반대쪽 속성도 함께 갱신됩니다. 확정하기 전 메모리 상태에서도 양쪽이 일치하므로, 저장 전에 관계를 확인하는 코드가 정확한 값을 봅니다.

## 이 미션에서는 왜 필요한가

이 회차의 양방향 관계 선언에 필요합니다. 없어도 조회는 되기 때문에 빠뜨리기 쉬운데, 한쪽에 추가한 항목이 다른 쪽에서 안 보이는 현상이 생겨야 비로소 드러납니다.

## 코드 예

```python
class Member(Base):
    posts: Mapped[list['Post']] = relationship(back_populates='author')

class Post(Base):
    author: Mapped['Member'] = relationship(back_populates='posts')

member = session.get(Member, 1)
post = Post(title='새 글', author=member)

print(post in member.posts)    # True — 양쪽이 함께 갱신된다
# back_populates 가 없으면 False 다.
# commit 하고 다시 읽으면 맞아 보여서 더 찾기 어렵다
```

## 주의할 점 / 경계 조건

양쪽 이름이 정확히 맞아야 합니다. 오타가 있으면 시작할 때가 아니라 그 관계를 쓸 때 오류가 납니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

조회가 되니 제대로 연결된 것이라 생각하기 쉽지만, 이것이 없으면 메모리 상태가 양쪽에서 어긋납니다. 확정하고 다시 읽으면 맞아 보여 더 헷갈립니다.

## 동료평가 질문

이 설정 없이 한쪽에 항목을 추가했을 때 반대쪽에서 무엇이 보이는지 확인해 볼 수 있나요?
