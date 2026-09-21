# 커널

## 한 줄 설명

hardware와 process·memory·device를 중재하는 operating system 핵심.

## 쉽게 설명하면

`커널`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

hardware와 process·memory·device를 중재하는 operating system 핵심. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 컨테이너 격리가 성립하는 근거입니다. 컨테이너는 별도의 운영체제를 띄우는 것이 아니라 호스트의 커널을 함께 쓰면서 보이는 범위만 나눈 것이라, 커널이 하는 일을 알아야 격리가 어디까지인지도 알 수 있습니다.

## 코드 예

```bash
uname -r                      # 호스트 커널 버전
docker run --rm ubuntu uname -r  # 컨테이너 안에서도 같은 값
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
