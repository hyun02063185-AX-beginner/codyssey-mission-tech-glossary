# OAuth2 Authorization Code

## 한 줄 설명

OAuth2에서 authorization code를 token으로 교환하는 browser 기반 grant.

## 쉽게 설명하면

동의가 끝난 뒤 일회용 교환권을 먼저 받고, 그것을 서버끼리 진짜 표식으로 바꾸는 흐름입니다. 표식이 브라우저 주소창을 지나가지 않게 하려는 것입니다.

## 정확한 설명

인가 서버는 리디렉션 주소로 짧은 수명의 code를 보낸다. 클라이언트 서버가 이 code와 자신의 비밀값을 함께 제시해야 토큰으로 교환되므로, code를 가로채도 비밀값 없이는 쓸 수 없다. 공개 클라이언트에서는 PKCE로 비밀값을 대신한다.

## 이 미션에서는 왜 필요한가

이 회차에서 소셜 로그인을 실제로 구현할 때 따르는 흐름입니다. 토큰을 곧바로 주소창으로 받는 방식보다 단계가 하나 더 있는데, 그 한 단계가 브라우저 기록과 로그에 토큰이 남는 것을 막습니다.

## 코드 예

```python
# 1) 동의 화면으로 보낸다
url = ('https://provider/authorize?response_type=code'
       f'&client_id={CLIENT_ID}&redirect_uri={REDIRECT}'
       f'&scope=openid email&state={csrf_state}')

# 2) 돌아온 code 를 서버에서 토큰으로 바꾼다
@app.get('/auth/callback')
def callback(code: str, state: str):
    if state != request.session.pop('oauth_state', None):
        raise HTTPException(400, '요청 출처를 확인할 수 없습니다')
    token = httpx.post('https://provider/token', data={
        'grant_type': 'authorization_code', 'code': code,
        'client_id': CLIENT_ID, 'client_secret': CLIENT_SECRET,
        'redirect_uri': REDIRECT,
    }).json()
```

## 주의할 점 / 경계 조건

리디렉션 주소는 제공자 쪽에 미리 등록한 것과 정확히 같아야 합니다. 등록하지 않은 주소를 허용하면 공격자가 교환권을 자기 쪽으로 받을 수 있습니다.

## 관련 용어

- `authentication`

## 흔한 오해

code를 받은 시점에 로그인이 끝났다고 생각하기 쉽지만, 그것은 교환권일 뿐입니다. 서버끼리 토큰으로 바꾸고 그 토큰으로 사용자 정보를 확인해야 로그인이 됩니다.

## 동료평가 질문

`code` 를 주소창으로 받는 것은 괜찮고 토큰을 그렇게 받으면 안 되는 이유를 설명할 수 있나요?
