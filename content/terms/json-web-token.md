# JSON Web Token

## 한 줄 설명
JSON Web Token(JWT)은 사용자나 발급 시각 같은 Claim(전달할 정보 항목)을 JSON으로 담아 전달하는 토큰 형식입니다.

## 쉽게 설명하면
정보 봉투에 담을 내용을 정하는 형식입니다. 봉투에 서명해 변조를 확인하는 방식(JWS)과 내용을 암호화해 숨기는 방식(JWE)을 구분해야 합니다. 서명만으로 봉투 안이 숨겨지지는 않습니다.

## 정확한 설명
JWT의 Claim 묶음은 JWS 또는 JWE 구조에 담길 수 있습니다. JWS는 전자서명 또는 MAC(공유 비밀키로 만드는 검증값)으로 내용의 무결성과 출처를 확인하는 데 쓰입니다. MAC은 같은 키를 가진 쪽들이 만들고 검증할 수 있으므로 특정 개인만의 서명을 뜻하지는 않습니다. JWE는 내용을 암호화하여 기밀성, 즉 허용된 쪽만 내용을 읽을 수 있는 성질을 제공합니다.

일반적인 서명된 JWS Compact 형식은 header.payload.signature의 3부분입니다. JWE Compact 형식은 보호 헤더·암호화된 키·초기화 벡터·암호문·인증 태그의 5부분입니다. 점으로 부분을 구분하며 각 부분은 base64url로 표현합니다. base64url은 데이터를 문자열로 나타내는 인코딩이고 암호화가 아닙니다. 따라서 서명된 JWT의 payload를 비밀 정보 저장소로 사용하면 안 됩니다. JWT 형식 자체는 로그인 기능이나 인증·인가 정책 전체가 아닙니다.

JWE의 iv는 암호화에 쓰는 초기화 값, tag는 변조 여부를 확인하는 값입니다. 위 표기는 구성을 설명할 뿐 실제 서명·MAC·암호문을 생성하지 않습니다.

## 이 미션에서는 왜 필요한가
M13에서 token 기반 인증을 설명할 때 token의 형식, signature 검증, claim expiry와 보호 route 정책을 구분할 수 있습니다.

## 코드 예
```text
# 형태 비교용 자리표시자이며 실제로 검증 가능한 보안 토큰이 아닙니다.
JWS Compact: <header>.<payload>.<signature-or-MAC>
JWE Compact: <protected-header>.<encrypted-key>.<iv>.<ciphertext>.<tag>
```

## 주의할 점 / 경계 조건
서버는 허용한 알고리즘과 신뢰할 키로 서명 또는 MAC을 검증해야 합니다. 이 검증과 Claim 검증은 별개입니다. 서명이 맞아도 exp(만료 시각), iss(발급자), aud(사용 대상) 등 서비스가 요구하는 Claim의 존재와 값이 맞는지 확인해야 합니다. 어떤 Claim을 요구할지는 서비스 정책에서 정합니다.

서명은 암호화가 아닙니다. 비밀번호 같은 비밀을 서명된 JWT의 payload에 넣지 않습니다. 또한 유효한 JWT를 받았더라도 해당 사용자가 특정 기능을 실행할 권한이 있는지는 별도의 인가 정책으로 판단해야 합니다.

기술 근거: [RFC 7519 §3 — JWT](https://www.rfc-editor.org/rfc/rfc7519.html#section-3), [RFC 7515 §3.1 — JWS Compact](https://www.rfc-editor.org/rfc/rfc7515.html#section-3.1), [RFC 7516 §3.1 — JWE Compact](https://www.rfc-editor.org/rfc/rfc7516.html#section-3.1).

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
