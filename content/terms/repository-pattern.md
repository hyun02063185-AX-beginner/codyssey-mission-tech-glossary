# Repository Pattern

## 한 줄 설명

도메인 코드가 저장 방식 대신 컬렉션 같은 인터페이스에 의존하게 하는 패턴.

## 쉽게 설명하면

업무 규칙이 DB 문법을 직접 알지 않아도 데이터를 꺼내게 하는 중간 창구다.

## 정확한 설명

repository는 조회·저장 경계를 감싸고 구현을 교체 가능하게 한다. 도메인 규칙과 영속성 세부 사항을 분리한다.

## 언제 쓰나

테스트에서는 메모리 repository로 주문 규칙을 검증할 수 있다.

## 기억할 경계

단순 CRUD에 무조건 계층을 늘리면 코드만 복잡해질 수 있다.

## 이 미션에서는 왜 필요한가

게시판 규칙을 검증할 때마다 실제 데이터베이스를 띄워야 한다면 확인이 느리고 번거로워집니다. 데이터를 꺼내 오는 창구를 따로 두면 그 자리에 메모리 목록을 끼워 넣어 같은 규칙을 확인할 수 있고, 저장 방식을 바꿔도 규칙 코드는 그대로입니다.

## 코드 예

```python
class PostRepository:
    def get(self, pid): ...
    def save(self, post): ...

class SqlPostRepository(PostRepository):
    def get(self, pid):
        return db.execute('SELECT * FROM posts WHERE id = ?', (pid,)).fetchone()

class FakePostRepository(PostRepository):
    def __init__(self, rows): self.rows = rows
    def get(self, pid): return self.rows.get(pid)

# 규칙 검증에는 DB 가 필요 없다
service = PostService(FakePostRepository({1: Post(author_id=1)}))
```

## 관련 용어

- `business-logic`
- `mvc`
