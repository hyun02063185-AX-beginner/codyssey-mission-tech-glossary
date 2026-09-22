# public route

## 한 줄 설명

로그인하지 않은 사용자도 접근할 수 있는 route.

## 쉽게 설명하면

로그인하지 않아도 볼 수 있는 경로입니다. 어디까지 열어 둘지가 서비스 설계의 한 부분입니다.

## 정확한 설명

인증 검사를 적용하지 않는 경로다. 열려 있다는 것은 검사를 안 한다는 뜻이지 아무 제약이 없다는 뜻은 아니며, 요청 횟수 제한이나 응답에 담을 정보의 범위는 따로 정해야 한다.

## 이 미션에서는 왜 필요한가

이 회차에서 목록은 누구나 보고 글쓰기는 로그인해야 한다면, 그 경계를 어디에 그을지 정해 두어야 합니다. 기본을 "열려 있음"으로 두고 막을 곳을 고르면 빠뜨린 곳이 열린 채 남으므로, 기본을 "막힘"으로 두고 열 곳을 고르는 편이 안전합니다.

## 코드 예

```python
# 기본을 막힘으로 두고 열 곳을 고른다
PUBLIC = {'/', '/login', '/signup', '/posts', '/healthz'}

@app.middleware('http')
async def guard(request: Request, call_next):
    if request.url.path not in PUBLIC and not request.session.get('user_id'):
        return RedirectResponse('/login', status_code=303)
    return await call_next(request)

# 새 경로를 추가하면 기본이 '막힘' 이라 빠뜨려도 열리지 않는다
```

## 주의할 점 / 경계 조건

같은 경로라도 로그인 여부에 따라 응답에 담을 내용이 달라야 할 수 있습니다. 목록은 공개해도 작성자의 이메일까지 함께 내보내면 안 됩니다.

## 관련 용어

- `authentication`
- `authorization`
- `security-group`

## 흔한 오해

공개 경로는 보안과 무관하다고 생각하기 쉽지만, 누구나 호출할 수 있으므로 오히려 요청 횟수 제한과 응답 범위를 더 신경 써야 합니다.

## 동료평가 질문

어떤 경로를 공개로 둘지 정한 기준과, 공개 경로에서도 내보내지 않기로 한 정보를 설명할 수 있나요?
