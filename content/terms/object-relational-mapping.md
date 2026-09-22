# ORM

## 한 줄 설명

object model과 relational table 사이를 변환하는 기법.

## 쉽게 설명하면

표의 줄을 프로그램의 객체처럼 다루게 해 주는 방식입니다. SQL을 직접 쓰지 않고 객체를 고치면 저장됩니다.

## 정확한 설명

클래스와 표, 속성과 열을 대응시키고 객체의 변경을 추적해 SQL로 바꾼다. 편리한 대신 어떤 SQL이 언제 나가는지가 코드에서 보이지 않으므로, 성능 문제는 생성된 SQL을 출력해 봐야 원인이 드러난다.

## 이 미션에서는 왜 필요한가

이 회차 이후의 학습으로 이어지는 개념입니다. SQL을 직접 써 본 다음에 이것을 만나야 무엇을 대신해 주는지 알 수 있고, 반대로 이것부터 시작하면 느릴 때 무엇을 봐야 할지 모르게 됩니다.

## 코드 예

```python
# 목록을 돌면서 연결된 값을 읽으면 조회가 항목 수만큼 나간다
posts = session.query(Post).all()          # 조회 1번
for p in posts:
    print(p.author.name)                   # 여기서 글 개수만큼 또 나간다

# 미리 함께 읽도록 지정한다
from sqlalchemy.orm import joinedload
posts = session.query(Post).options(joinedload(Post.author)).all()   # 1번

# 어떤 SQL 이 나가는지 직접 본다
engine = create_engine(URL, echo=True)
```

## 주의할 점 / 경계 조건

목록을 돌면서 각 항목의 연결된 값을 읽으면 조회가 항목 수만큼 따로 나갑니다. 미리 함께 읽도록 지정해야 한 번에 가져옵니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

ORM이나 database 기능이 application의 모든 validation과 business rule을 자동으로 대신하지는 않습니다.

## 동료평가 질문

ORM 이 만들어 낸 SQL 을 실제로 출력해 보고, 예상한 것과 달랐던 부분을 설명할 수 있나요?
