# JSON Web Token

## 한 줄 설명
JSON Web Token(JWT)은 JSON claims를 header·payload·signature 형태로 표현해 전달하는 token format입니다.

## 쉽게 설명하면
누가 만들었는지 검증할 수 있도록 서명한 정보 봉투 형식입니다. 봉투 안이 자동으로 암호화되는 것은 아닙니다.

## 정확한 설명
JWT는 base64url로 표현된 header, payload, signature로 구성됩니다. signature는 변조 검증에 쓰이지만 payload를 비밀로 만드는 encryption과는 다릅니다. JWT format 자체는 로그인 기능이나 인증 정책 전체가 아닙니다.

## 이 미션에서는 왜 필요한가
M13에서 token 기반 인증을 설명할 때 token의 형식, signature 검증, claim expiry와 보호 route 정책을 구분할 수 있습니다.

## 코드 예
```text
base64url(header).base64url(payload).base64url(signature)
```

## 주의할 점 / 경계 조건
서명 검증 algorithm과 key를 server가 엄격히 선택해야 합니다. 민감한 정보를 payload에 평문처럼 넣지 말고 expiry·audience 같은 claim도 검증해야 합니다.

## 관련 용어
- `authentication-token`
- `authentication`
- `authorization`
- `cookie`
- `login-session`

## 흔한 오해
JWT는 항상 암호화되어 있고, JWT를 쓴다는 사실만으로 로그인 보안이 완성된다는 생각은 맞지 않습니다.

## 동료평가 질문
서명된 JWT payload를 browser가 읽을 수 있다면 어떤 종류의 정보를 넣지 않아야 할까요?
