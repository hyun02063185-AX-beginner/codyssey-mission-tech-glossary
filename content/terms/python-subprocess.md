# subprocess

## 한 줄 설명

Python에서 다른 program을 실행하고 결과를 받는 module·작업.

## 쉽게 설명하면

파이썬에서 다른 프로그램을 실행하고 그 결과를 받아 오는 방법입니다.

## 정확한 설명

명령과 인자를 목록으로 넘겨 프로세스를 실행하고, 표준 출력·표준 오류·종료 코드를 받는다. 문자열 하나로 넘겨 셸을 거치게 하면 입력에 특수 문자가 섞였을 때 의도하지 않은 명령이 실행될 수 있으므로, 목록으로 넘기는 것이 기본이다.

## 이 미션에서는 왜 필요한가

이 회차의 AI 도우미가 변경 내용을 수집할 때 이 방법으로 다른 명령을 실행합니다. 결과를 그대로 쓰지 않고 종료 코드를 먼저 확인해야, 명령이 실패했는데 빈 결과를 정상으로 넘기는 일을 막을 수 있습니다.

## 코드 예

```python
import subprocess

# 목록으로 넘긴다. 셸을 거치지 않는다
result = subprocess.run(
    ['git', 'diff', '--staged'],
    capture_output=True, text=True, encoding='utf-8', timeout=10,
)

if result.returncode != 0:          # 확인하지 않으면 실패를 모른다
    raise RuntimeError(result.stderr.strip())
diff = result.stdout

# 이렇게 하지 않는다 — 사용자 입력이 섞이면 다른 명령이 실행된다
# subprocess.run(f'git log --author={name}', shell=True)
```

## 주의할 점 / 경계 조건

출력이 아주 길면 버퍼가 차서 멈출 수 있습니다. 결과를 모아 받는 방식을 쓰면 이 문제가 없습니다.

## 관련 용어

- `process`
- `linux`

## 흔한 오해

오류가 나면 예외가 발생한다고 생각하기 쉽지만, 기본적으로는 종료 코드만 돌려줍니다. 확인하지 않으면 실패를 모르고 지나갑니다.

## 동료평가 질문

명령이 실패했는데 프로그램이 그대로 진행되는 것을 어떻게 막겠습니까?
