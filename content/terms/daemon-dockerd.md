# 데몬

## 한 줄 설명

Docker API 요청을 받아 이미지·컨테이너·네트워크를 관리하는 백그라운드 데몬.

## 쉽게 설명하면

docker 명령이 일을 부탁하는 뒤편의 관리자 프로세스다.

## 정확한 설명

dockerd는 client 요청을 처리하고 containerd 등 runtime 구성 요소와 통신한다. socket 권한과 daemon 상태가 실행에 영향을 준다.

## 언제 쓰나

`docker ps`가 실패할 때 daemon 연결 상태를 점검한다.

## 기억할 경계

docker CLI가 설치됐다고 daemon이 실행 중이라는 뜻은 아니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 도커 명령이 실패할 때 가장 먼저 의심할 곳입니다. 명령은 요청을 보낼 뿐이고 실제 일은 상주 프로세스가 하므로, 그것이 떠 있지 않으면 설치가 끝났어도 아무 명령도 듣지 않습니다.

## 코드 예

```bash
docker info
# "Cannot connect to the Docker daemon" 이면 상주 프로세스가 안 떠 있다

sudo systemctl status docker   # 리눅스에서 상태 확인
```

## 관련 용어

- `containerd-runc`
- `docker-logs`
