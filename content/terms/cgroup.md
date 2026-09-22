# cgroup

## 한 줄 설명

Linux kernel이 process group의 CPU·memory 같은 resource를 제한·측정하는 기능.

## 쉽게 설명하면

프로세스 묶음이 쓸 수 있는 자원의 한도를 정하고 사용량을 재는 기능입니다.

## 정확한 설명

프로세스 묶음 단위로 CPU·메모리·입출력의 상한을 걸고 실제 사용량을 집계한다. 컨테이너의 자원 제한과 사용량 표시가 이 기능 위에서 동작하며, 상한을 넘으면 메모리의 경우 프로세스가 강제 종료된다.

## 이 미션에서는 왜 필요한가

예비 M01에서 컨테이너의 자원 제한이 실제로 동작하는 원리이고, `docker stats`가 보여 주는 숫자의 출처이기도 합니다. 네임스페이스가 "무엇을 볼 수 있는가"를 나눈다면 이쪽은 "얼마나 쓸 수 있는가"를 나눕니다.

## 코드 예

```bash
docker run -d --name web --memory 256m --cpus 0.5 nginx
docker stats --no-stream web
# MEM USAGE / LIMIT   12MiB / 256MiB

# 컨테이너 안에서 free 를 쓰면 호스트 값이 보인다
docker exec web free -m           # 호스트 전체 메모리
docker exec web cat /sys/fs/cgroup/memory.max    # 실제 한도

# 한도를 넘으면 강제 종료된다
docker inspect --format="{{.State.OOMKilled}}" web
```

## 주의할 점 / 경계 조건

컨테이너 안에서 자원 정보를 읽으면 호스트 전체 값이 보일 수 있습니다. 걸린 한도와 비교하려면 이 기능이 노출하는 값을 봐야 합니다.

## 관련 용어

- `process`
- `linux`

## 흔한 오해

한도를 걸면 프로그램이 알아서 맞춰 쓴다고 생각하기 쉽지만, 메모리는 한도를 넘는 순간 강제 종료됩니다. 프로그램에는 경고가 가지 않습니다.

## 동료평가 질문

컨테이너에 메모리 한도를 걸었을 때 한도를 넘으면 무슨 일이 생기는지 설명할 수 있나요?
