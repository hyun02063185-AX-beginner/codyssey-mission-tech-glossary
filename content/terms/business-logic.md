# Business Logic

## 한 줄 설명

제품의 업무 규칙과 의사결정을 구현한 코드.

## 쉽게 설명하면

버튼을 누를 때 무엇을 허용하고 계산할지 정한 핵심 규칙이다.

## 정확한 설명

HTTP 처리나 DB 접근과 분리하면 테스트와 변경이 쉬워진다. 예: 주문 총액 계산, 권한 확인, 상태 전이 규칙.

## 언제 쓰나

서비스 함수에서 할인 조건과 주문 상태 변경을 처리한다.

## 기억할 경계

화면 코드나 저장소 코드에 규칙을 흩뿌리면 규칙이 서로 달라질 수 있다.

## 이 미션에서는 왜 필요한가

게시판에서 "글쓴이만 수정할 수 있다"나 "제목이 비면 저장하지 않는다" 같은 규칙이 여기 속합니다. 이 규칙을 화면 코드나 SQL 옆에 흩어 두면 같은 규칙이 여러 곳에 조금씩 다르게 적히고, 나중에 한쪽만 고치게 됩니다.

## 코드 예

```python
# 규칙이 라우트 안에 있으면 테스트하려면 요청을 만들어야 한다
@app.post('/posts/<int:pid>/edit')
def edit(pid):
    post = repo.get(pid)
    if post.author_id != session['user_id']:   # ← 규칙이 여기 섞여 있다
        abort(403)

# 규칙을 따로 두면 요청 없이도 검증할 수 있다
def can_edit(post, user_id):
    return post.author_id == user_id

assert can_edit(Post(author_id=1), 1) is True
assert can_edit(Post(author_id=1), 2) is False
```

## 관련 용어

- `repository-pattern`
- `mvc`
