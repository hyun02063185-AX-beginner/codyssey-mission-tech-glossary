# cgroup

## 한 줄 설명

Linux kernel이 process group의 CPU·memory 같은 resource를 제한·측정하는 기능.

## 쉽게 설명하면

`cgroup`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

Linux kernel이 process group의 CPU·memory 같은 resource를 제한·측정하는 기능. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 컨테이너의 자원 제한이 실제로 동작하는 원리이고, `docker stats`가 보여 주는 숫자의 출처이기도 합니다. 네임스페이스가 "무엇을 볼 수 있는가"를 나눈다면 이쪽은 "얼마나 쓸 수 있는가"를 나눕니다.

## 코드 예

```bash
docker run --rm --memory 256m --cpus 0.5 ubuntu sleep 30
docker stats --no-stream      # 제한과 실제 사용량을 함께 보여 준다
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
