# 보호 라우트

## 한 줄 설명

인증·권한 조건을 만족한 요청에만 열리는 route.

## 쉽게 설명하면

로그인한 사람만 들어갈 수 있는 경로입니다. 화면에서 링크를 감추는 것과 경로를 막는 것은 다른 일입니다.

## 정확한 설명

요청을 처리하기 전에 인증 여부와 필요하면 권한까지 확인하고, 통과하지 못하면 401 또는 403으로 돌려보내거나 로그인 화면으로 보낸다. 확인은 화면을 그리는 쪽이 아니라 요청을 받는 쪽에서 해야 한다.

## 이 미션에서는 왜 필요한가

이 회차에서 로그인이 필요한 화면을 만들 때 쓰는 개념입니다. 프런트엔드에서만 막으면 주소를 직접 입력하거나 API를 직접 호출하는 요청은 그대로 통과하므로, 서버 쪽 확인이 실제 방어선입니다.

## 코드 예

```python
def require_login(request: Request) -> int:
    user_id = request.session.get('user_id')
    if user_id is None:
        raise HTTPException(303, headers={'Location': '/login'})
    return user_id

@app.post('/posts/{pid}/edit')
def edit(pid: int, user_id: int = Depends(require_login)):
    post = repo.get(pid)
    if post.author_id != user_id:     # 인증만으로는 부족하다
        raise HTTPException(403, '권한이 없습니다')
    ...
```

## 주의할 점 / 경계 조건

인증(누구인가)과 인가(무엇을 할 수 있는가)는 다른 검사입니다. 로그인만 확인하고 남의 글을 수정할 수 있게 두면 인가가 빠진 것입니다.

## 관련 용어

- `authentication`
- `authorization`
- `security-group`

## 흔한 오해

화면에서 버튼을 감추면 접근이 막힌다고 생각하기 쉽지만, 그것은 안내입니다. 개발자 도구로 요청을 직접 보내면 서버는 버튼을 눌렀는지 알지 못합니다.

## 동료평가 질문

로그인하지 않은 상태에서 보호된 주소를 직접 입력했을 때 무엇이 막아 주는지, 화면 쪽과 서버 쪽으로 나눠 설명할 수 있나요?
