# TemplateResponse

## 한 줄 설명

template과 context로 서버 HTML response를 만드는 Starlette/FastAPI 응답 객체.

## 쉽게 설명하면

"이 틀에 이 값을 채워서 응답으로 보내라"를 한 번에 표현하는 객체입니다. 만들어진 HTML과 상태 코드, 헤더를 함께 담습니다.

## 정확한 설명

request와 context를 template engine에 전달해 HTML, status, header를 포함한 response를 만든다.

## 이 미션에서는 왜 필요한가

이 회차에서 서버가 화면을 돌려줄 때 쓰는 형태입니다. 응답을 객체로 만들기 때문에 같은 자리에서 상태 코드를 404로 바꾸거나 헤더를 붙일 수 있고, 성공과 실패의 화면을 같은 방식으로 돌려줄 수 있습니다.

## 코드 예

```python
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory='templates')

@app.get('/posts/{pid}')
def detail(request: Request, pid: int):
    post = repo.get(pid)
    if post is None:
        return templates.TemplateResponse(
            'not_found.html', {'request': request}, status_code=404,
        )   # 화면과 상태 코드를 함께 정한다
    return templates.TemplateResponse(
        'detail.html', {'request': request, 'post': post},
    )
```

## 주의할 점 / 경계 조건

템플릿에 넘기는 값에 `request`가 빠지면 템플릿 안에서 주소나 세션을 참조하는 부분이 오류를 냅니다. 필수로 들어가야 하는 값입니다.

## 관련 용어

- `template-engine`
- `server-side-rendering`
- `html-form`

## 흔한 오해

화면을 돌려줬으니 성공이라고 생각하기 쉽지만, 상태 코드는 따로 정해야 합니다. 없는 글에 안내 화면을 보여 주면서 200을 돌려주면 도구들은 정상으로 인식합니다.

## 동료평가 질문

없는 글을 요청했을 때 안내 화면과 404 상태 코드를 함께 돌려주는 코드를 보여 줄 수 있나요?
