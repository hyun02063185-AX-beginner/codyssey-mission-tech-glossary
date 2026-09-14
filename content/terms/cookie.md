# Cookie

## 한 줄 설명
Cookie는 browser가 저장하고 조건에 맞는 HTTP request에 함께 보낼 수 있는 작은 데이터 조각입니다.

## 쉽게 설명하면
사이트가 browser에 맡긴 작은 메모입니다. 다음 요청 때 domain·path·보안 속성이 맞으면 browser가 그 메모를 함께 보낼 수 있습니다.

## 정확한 설명
Cookie는 name/value와 Domain, Path, Secure, HttpOnly, SameSite, expiration 같은 속성으로 동작합니다. 로그인 상태 자체가 아니라 요청에 전달되는 browser-side data이며, server가 session identifier를 cookie에 담아 상태를 연결할 수 있습니다.

## 이 미션에서는 왜 필요한가
M13에서 browser와 server 사이의 인증 관련 data 전달과 XSS·CSRF 등 보안 속성의 의미를 설명하는 기반입니다.

## 코드 예
```http
Set-Cookie: session_id=abc; HttpOnly; Secure; SameSite=Lax
```

## 주의할 점 / 경계 조건
HttpOnly cookie는 JavaScript 읽기를 제한하지만 모든 공격을 막지는 않습니다. cookie에 민감한 값을 넣을 때는 transport와 server 검증도 필요합니다.

## 관련 용어
- `login-session`
- `json-web-token`
- `authentication`
- `https`
- `cors`

## 흔한 오해
Cookie가 곧 로그인 상태이거나 server session 자체라는 말은 정확하지 않습니다.

## 동료평가 질문
session identifier를 cookie에 두고 실제 session data를 server에 두는 설계의 역할 분리는 무엇인가요?
