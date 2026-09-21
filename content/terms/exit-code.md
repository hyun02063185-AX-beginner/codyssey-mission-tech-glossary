# exit code

## 한 줄 설명

program 종료 결과를 caller에게 알리는 정수 상태값.

## 쉽게 설명하면

`exit code`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

program 종료 결과를 caller에게 알리는 정수 상태값. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M03은 오류가 나면 0이 아닌 종료 코드로 끝내라고 요구하고, 예비 M01에서는 컨테이너가 왜 죽었는지 판단하는 단서가 됩니다(메모리 부족이면 137 같은 값). 사람이 읽는 메시지와 달리 다른 프로그램이 바로 판단할 수 있는 신호입니다.

## 코드 예

```python
import sys
if not rows:
    print("저장할 내역이 없습니다", file=sys.stderr)
    sys.exit(1)      # 정상은 0, 그 밖은 실패
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
