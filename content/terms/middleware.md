# Middleware

## 한 줄 설명
Middleware는 요청이 최종 handler에 도착하기 전후로 공통 처리를 연결하는 중간 처리 계층입니다.

## 쉽게 설명하면
각 방에 들어가기 전 공용 안내 데스크를 거치는 것과 같습니다. 안내 데스크는 기록, 인증 확인, 입력 검사처럼 여러 방에 공통인 일을 처리합니다.

## 정확한 설명
Middleware는 특정 framework 이름이 아니라 request/response pipeline의 개념입니다. 요청은 logging, authentication, validation 같은 단계들을 통과해 handler로 가고, response도 필요한 후처리를 거쳐 돌아올 수 있습니다.

## 동작 원리
`request → middleware chain → handler → middleware chain → response` 순서로 흐릅니다. 어떤 middleware는 조건이 맞지 않으면 handler까지 보내지 않고 오류 response를 만들 수 있습니다.

## 이 미션에서는 왜 필요한가
M12에서 route별 business logic과 모든 요청에 공통인 log·인증·검증 책임을 분리해 서버 구조를 설명할 수 있습니다.

## 코드 예
```py
async def log_request(request, call_next):
    print(request.method, request.url.path)
    return await call_next(request)
```

## 주의할 점 / 경계 조건
Middleware 순서는 동작에 영향을 줍니다. 인증 전에 민감한 본문을 기록하거나, response를 두 번 만들지 않도록 책임과 순서를 명확히 해야 합니다.

## 관련 용어
- `asgi`
- `fastapi`
- `request-response-cycle`
- `dependency-injection`
- `cors`

## 흔한 오해
Middleware가 모든 business logic을 넣는 만능 장소는 아닙니다. 공통 횡단 관심사와 개별 use case를 구분해야 합니다.

## 동료평가 질문
요청 log와 게시글 생성 규칙 중 어느 쪽을 middleware에 두고, 그 이유는 무엇인가요?
