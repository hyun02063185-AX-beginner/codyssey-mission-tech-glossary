# subprocess

## 한 줄 설명

Python에서 다른 program을 실행하고 결과를 받는 module·작업.

## 쉽게 설명하면

`subprocess`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

Python에서 다른 program을 실행하고 결과를 받는 module·작업. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M06에서 파이썬 코드가 Git 명령을 대신 실행하고 그 결과를 받아 오는 수단입니다. 별도의 프로세스가 뜨므로 표준 출력과 종료 코드를 따로 받아 봐야 성공했는지 알 수 있습니다.

## 코드 예

```python
import subprocess
result = subprocess.run(["git", "diff", "--staged"],
                        capture_output=True, text=True)
if result.returncode != 0:
    raise RuntimeError(result.stderr)
diff = result.stdout
```

## 주의할 점 / 경계 조건

한 번의 수치만으로 원인을 단정하지 말고 기간, workload, 다른 resource, log를 함께 확인해야 합니다.

## 관련 용어

- `process`
- `linux`

## 흔한 오해

운영체제 지표가 높다고 해서 항상 application code 하나가 유일한 원인인 것은 아닙니다.

## 동료평가 질문

이 현상을 재현하거나 관찰할 때 어떤 command와 시간 단위의 증거를 남기겠습니까?
