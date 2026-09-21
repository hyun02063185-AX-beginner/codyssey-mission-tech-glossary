# 프로세스 / PID 1

## 한 줄 설명

container 또는 system namespace에서 종료·signal 처리 책임이 특별한 첫 process.

## 쉽게 설명하면

`프로세스 / PID 1`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

container 또는 system namespace에서 종료·signal 처리 책임이 특별한 첫 process. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 `docker run ubuntu`가 아무 일도 안 하고 즉시 끝나는 이유입니다. 컨테이너는 1번 프로세스가 살아 있는 동안만 살아 있고, 그 프로세스가 종료 신호를 받아 처리할 책임도 함께 집니다.

## 코드 예

```bash
docker run --rm ubuntu            # 1번 프로세스가 곧바로 끝나 컨테이너도 끝
docker run --rm ubuntu sleep 30   # 1번 프로세스가 30초 살아 있으면 컨테이너도 30초
```

## 관련 용어

- `process`
- `linux`
