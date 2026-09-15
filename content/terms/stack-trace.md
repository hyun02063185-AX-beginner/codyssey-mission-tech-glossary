# Stack Trace

## 한 줄 설명

오류가 발생한 지점까지 어떤 함수 호출을 거쳐 왔는지 보여 주는 호출 기록입니다.

## 쉽게 설명하면

사고 현장까지 지나온 길을 역순으로 적은 기록과 같습니다.

## 정확한 설명

Stack trace는 예외 발생 시 call stack의 함수 이름·파일·줄 번호를 표시해 오류 위치와 호출 경로를 추적하게 합니다. 환경에 따라 경로나 내부 정보가 포함될 수 있습니다.

## 이 미션에서는 왜 필요한가

M03에서 서버 오류의 원인을 조사하되, 사용자 응답에 내부 stack trace를 노출하지 않는 기준입니다.

## 코드 예

```text
File service.py, line 12, in create_user
  validate(payload)
ValueError: invalid email
```

## 주의할 점 / 경계 조건

운영 환경의 stack trace는 내부 경로·라이브러리 정보를 드러낼 수 있으므로 로그에는 접근 제어를 하고 응답은 안전한 오류로 바꿉니다.

## 관련 용어

- `call-stack`
- `exception-handling`
- `logging`

## 흔한 오해

Stack trace는 오류 원인 그 자체가 아니라 오류까지의 호출 경로라는 점을 구분해야 합니다.

## 동료평가 질문

사용자에게 원본 stack trace 대신 일반 오류 메시지를 주어야 하는 이유는 무엇인가요?
