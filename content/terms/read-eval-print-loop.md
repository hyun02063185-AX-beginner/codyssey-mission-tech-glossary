# REPL

## 한 줄 설명

입력을 읽고 실행한 뒤 결과를 출력하는 과정을 반복하는 대화형 실행 환경입니다.

## 쉽게 설명하면

질문을 입력하면 바로 답을 보고 다음 질문을 이어 가는 계산기 같은 환경입니다.

## 정확한 설명

REPL은 Read, Eval, Print, Loop의 순서로 명령을 처리합니다. 입력 파싱과 오류 처리, 종료 명령은 일반 CLI와 별도의 상호작용 계약입니다.

## 이 미션에서는 왜 필요한가

M09의 `mini-redis>`처럼 명령을 계속 받는 인터페이스를 설계하는 기준입니다.

## 코드 예

```text
mini-redis> SET name codyssey
OK
mini-redis> GET name
codyssey
```

## 주의할 점 / 경계 조건

REPL 입력을 shell command처럼 그대로 실행하면 의도하지 않은 명령 실행 위험이 있으므로 허용 문법을 파싱해야 합니다.

## 관련 용어

- `python-cli`
- `loop`
- `input-validation`

## 흔한 오해

REPL은 단순 무한 loop가 아니라 읽기·평가·표시·오류 복구의 사용자 계약입니다.

## 동료평가 질문

잘못된 REPL 명령 뒤에도 다음 프롬프트가 나와야 하는 이유는 무엇인가요?
