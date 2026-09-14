# Login Session

## 한 줄 설명
Login Session은 사용자가 인증된 뒤 server가 그 사용자 상태를 이어서 식별·관리하는 방식입니다.

## 쉽게 설명하면
입장 확인 뒤 server가 보관하는 방문 기록입니다. browser는 보통 그 기록을 찾는 짧은 식별자만 들고 다닙니다.

## 정확한 설명
Session-based authentication에서 server는 session store에 user identity와 expiry 같은 상태를 두고, client는 session ID를 cookie 등으로 보냅니다. session ID의 위치와 server-side session state를 구분해야 합니다.

## 이 미션에서는 왜 필요한가
M13의 로그인·보호 route에서 authentication 결과를 이후 request와 연결하고 logout·expiry를 설계하는 기준입니다.

## 코드 예
```text
browser cookie: session_id=abc
server store: abc → { userId: 42, expiresAt: ... }
```

## 주의할 점 / 경계 조건
로그아웃은 client cookie 삭제만으로 충분하지 않을 수 있습니다. server session invalidation, expiry, session fixation 방지까지 검토해야 합니다.

## 관련 용어
- `cookie`
- `authentication`
- `authorization`
- `json-web-token`
- `access-control`

## 흔한 오해
Session은 browser에 저장된 cookie와 같은 물건이 아닙니다.

## 동료평가 질문
로그아웃 후에도 server가 session ID를 계속 유효하게 두면 어떤 문제가 생길 수 있나요?
