# Post/Redirect/Get

## 한 줄 설명

POST 처리 뒤 redirect하고 결과 URL을 GET으로 읽는 요청 패턴.

## 쉽게 설명하면

무언가를 저장하는 요청을 처리한 뒤 곧바로 화면을 그리지 않고, 결과 화면 주소로 보내 다시 요청하게 하는 방식입니다.

## 정확한 설명

성공한 mutation 뒤 303 등을 반환해 새로고침의 POST 재전송을 줄인다.

## 이 미션에서는 왜 필요한가

이 회차에서 글을 쓴 뒤 새로고침하면 같은 글이 또 등록되는 문제를 막습니다. 저장 요청을 처리한 화면에 그대로 머물면 새로고침이 그 저장 요청을 다시 보내기 때문인데, 주소를 조회 요청으로 바꿔 두면 그 일이 생기지 않습니다.

## 코드 예

```python
# 이러면 새로고침이 POST 를 다시 보낸다
@app.post('/posts')
def create(...):
    post = repo.save(...)
    return templates.TemplateResponse('detail.html', {...})

# 저장한 뒤 조회 주소로 보낸다
from fastapi.responses import RedirectResponse

@app.post('/posts')
def create(...):
    post = repo.save(...)
    return RedirectResponse(f'/posts/{post.id}', status_code=303)
    # 303 은 "결과를 GET 으로 가져가라" 는 뜻이다
```

## 주의할 점 / 경계 조건

보낼 곳을 사용자 입력에서 받아 그대로 쓰면 외부 주소로 보내는 통로가 됩니다. 이동할 주소는 서버가 정하거나 허용 목록으로 제한해야 합니다.

## 관련 용어

- `html-form`
- `http-request-response`
- `client-side-routing`

## 흔한 오해

새로고침 경고 창이 뜨는 것은 브라우저의 기본 동작이니 어쩔 수 없다고 생각하기 쉽지만, 저장 뒤 주소를 바꿔 주면 그 창 자체가 나오지 않습니다.

## 동료평가 질문

글 등록 뒤 새로고침했을 때 중복 등록이 되는지 직접 확인하고, 막는 방법을 설명할 수 있나요?
