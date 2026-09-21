# Jinja2 SSR

## 한 줄 설명

Jinja2 template을 server에서 렌더링해 HTML response로 보내는 방식.

## 쉽게 설명하면

`Jinja2 SSR`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

Jinja2 template을 server에서 렌더링해 HTML response로 보내는 방식. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M13에서 로그인 전과 후에 화면이 달라져야 합니다. 서버가 현재 로그인 상태를 알고 있으므로, 그 상태를 템플릿에 넘겨 완성된 HTML을 만들어 보내면 화면과 권한이 어긋나지 않습니다.

## 코드 예

```python
@app.get("/")
def home(request: Request, user=Depends(current_user_optional)):
    return templates.TemplateResponse("home.html",
        {"request": request, "user": user})   # 템플릿에서 user 유무로 분기
```

## 주의할 점 / 경계 조건

한 network 설정이 정상이어도 DNS, security rule, server process, certificate, application route 중 다른 단계가 실패할 수 있습니다.

## 관련 용어

- `jinja2`
- `protected-route`

## 흔한 오해

서버에서 화면을 만들면 로그인 검사가 끝났다고 생각하기 쉽지만, 화면에서 버튼을 감추는 것과 그 경로를 막는 것은 다른 일입니다. 감추기만 하면 주소를 직접 쳐서 들어올 수 있습니다.

## 동료평가 질문

로그인하지 않은 사람이 주소를 직접 입력했을 때 무엇이 막아 주는지 보여 줄 수 있나요?
