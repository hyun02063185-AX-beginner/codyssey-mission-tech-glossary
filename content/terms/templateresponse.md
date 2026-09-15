# TemplateResponse

## 한 줄 설명

template과 context로 서버 HTML response를 만드는 Starlette/FastAPI 응답 객체.

## 쉽게 설명하면

`TemplateResponse`의 역할을 실제 화면과 요청 흐름에서 분리해 생각하면 됩니다.

## 정확한 설명

request와 context를 template engine에 전달해 HTML, status, header를 포함한 response를 만든다.

## 이 미션에서는 왜 필요한가

현재 미션의 구현 요구에서 이 용어가 맡는 책임과 다른 단계의 경계를 확인합니다.

## 코드 예

```text
TemplateResponse
```

## 주의할 점 / 경계 조건

한 단계의 성공을 전체 기능의 성공으로 해석하지 말고, 비동기 순서·접근성·서버 검증처럼 이 개념 밖의 조건을 함께 점검합니다.

## 관련 용어

- `template-engine`
- `server-side-rendering`
- `html-form`

## 흔한 오해

이 용어의 이름만 같다고 모든 framework와 환경에서 같은 동작을 보장하는 것은 아닙니다.

## 동료평가 질문

이 기능의 입력, 상태 변화, 사용자에게 보이는 결과를 각각 어떻게 확인하겠습니까?
