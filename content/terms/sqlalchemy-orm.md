# SQLAlchemy ORM

## 한 줄 설명

Python class와 database table의 mapping을 제공하는 SQLAlchemy ORM.

## 쉽게 설명하면

파이썬 클래스와 데이터베이스 표를 짝지어, 객체를 다루면 표가 바뀌게 해 주는 도구입니다.

## 정확한 설명

클래스와 표, 속성과 열을 대응시키고 객체의 변경을 추적해 확정 시점에 SQL로 내보낸다. SQL을 직접 쓰지 않는 대신 어떤 SQL이 언제 나가는지가 코드에서 보이지 않으므로, 느려졌을 때는 생성된 SQL을 출력해 봐야 원인이 드러난다.

## 동작 원리

클래스 정의에서 표 구조를 읽어 두고, 객체를 읽거나 만들면 내부 저장소에 보관해 변경을 지켜봅니다. 확정할 때 바뀐 부분만 모아 한 번에 SQL로 내보냅니다.

## 이 미션에서는 왜 필요한가

이 회차는 세 개 이상의 모델을 요구합니다. 표를 클래스로 적으면 구조와 코드가 한곳에 모이는 것이 이점이지만, 목록을 돌며 연결된 값을 읽을 때 조회가 항목 수만큼 나가는 문제가 이 편의의 대가입니다.

## 코드 예

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase): pass

class Post(Base):
    __tablename__ = 'post'
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    author_id: Mapped[int] = mapped_column(ForeignKey('member.id'))

# 어떤 SQL 이 나가는지 본다
engine = create_engine(URL, echo=True)
```

## 주의할 점 / 경계 조건

목록을 돌며 연결된 값을 읽으면 조회가 항목 수만큼 따로 나갑니다. 미리 함께 읽도록 지정해야 합니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

SQL을 몰라도 된다고 생각하기 쉽지만, 느려졌을 때 볼 수 있어야 원인을 찾습니다. 감추는 것이지 없애는 것이 아닙니다.

## 동료평가 질문

작성한 코드가 실제로 어떤 SQL 을 내보내는지 출력해 보고, 예상과 달랐던 부분을 설명할 수 있나요?
