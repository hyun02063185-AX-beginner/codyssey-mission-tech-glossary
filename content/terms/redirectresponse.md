# RedirectResponse

## 한 줄 설명

Starlette/FastAPI에서 redirect status와 Location header를 만드는 response.

## 쉽게 설명하면

"이 주소로 가라"는 응답을 만드는 객체입니다. 상태 코드와 이동할 주소를 함께 담습니다.

## 정확한 설명

이동할 주소를 헤더에 담고 리다이렉트 상태 코드를 붙인 응답을 만든다. 상태 코드를 지정하지 않으면 기본값이 쓰이므로, 저장 처리 뒤에는 조회로 바뀌는 코드를 명시해야 한다. 이동할 주소를 사용자 입력에서 받아 그대로 쓰면 외부로 보내는 통로가 된다.

## 이 미션에서는 왜 필요한가

이 회차에서 글 등록 뒤 화면을 옮길 때 씁니다. 기본 상태 코드가 저장 방식을 유지하는 쪽이라, 코드를 명시하지 않으면 새로고침에서 중복 등록이 생깁니다.

## 코드 예

```python
from fastapi.responses import RedirectResponse

@app.post('/posts')
def create(...):
    post = repo.save(...)
    return RedirectResponse(f'/posts/{post.id}', status_code=303)
    #                                            ↑ 빠뜨리면 기본 307 이다

# 이동할 주소를 요청에서 받는다면 반드시 검사한다
ALLOWED = {'/', '/posts', '/profile'}

@app.post('/login')
def login(next: str = '/'):
    target = next if next in ALLOWED else '/'
    return RedirectResponse(target, status_code=303)
```

## 주의할 점 / 경계 조건

이동할 주소를 요청 값에서 받아 그대로 쓰면 외부 사이트로 보낼 수 있습니다. 서버가 정하거나 허용 목록으로 제한해야 합니다.

## 관련 용어

- `http`
- `tcp`

## 흔한 오해

기본값으로 두면 알아서 맞을 것 같지만, 기본 코드는 저장 방식을 유지합니다. 저장 뒤 이동에는 코드를 직접 적어야 합니다.

## 동료평가 질문

상태 코드를 지정하지 않았을 때와 지정했을 때 새로고침 동작이 어떻게 달라지는지 보여 줄 수 있나요?
