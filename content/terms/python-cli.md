# Python CLI

## 한 줄 설명

Python 프로그램을 명령줄 인자와 표준 입출력으로 실행·자동화하는 인터페이스입니다.

## 쉽게 설명하면

버튼 화면 대신 터미널에서 옵션을 붙여 프로그램에 일을 시키는 방식입니다.

## 정확한 설명

Python CLI는 `sys.argv` 또는 `argparse` 등으로 명령·옵션을 해석하고 exit code와 stdout/stderr로 결과를 전달합니다. 사람이 쓰는 명령과 다른 프로그램이 호출하는 계약이 됩니다.

## 이 미션에서는 왜 필요한가

M06에서 Git 상태를 읽고 AI 호출을 수행하는 도구를 재현 가능하게 실행합니다.

## 코드 예

```python
import argparse
p = argparse.ArgumentParser()
p.add_argument('--repo', required=True)
args = p.parse_args()
```

## 주의할 점 / 경계 조건

출력에 사람용 설명과 기계 파싱용 데이터를 섞으면 자동화가 깨질 수 있으므로 채널과 형식을 정해야 합니다.

## 관련 용어

- `cli`
- `stdin-stdout`
- `exit-code`

## 흔한 오해

CLI는 Python interactive shell과 같지 않습니다. CLI는 인자·종료 코드가 있는 실행 인터페이스입니다.

## 동료평가 질문

CLI가 실패했음을 shell script가 알 수 있게 하려면 무엇을 반환해야 하나요?
