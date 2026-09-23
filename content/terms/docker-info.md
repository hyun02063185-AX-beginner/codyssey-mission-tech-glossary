# docker info

## 한 줄 설명

Docker daemon과 host 환경 정보를 출력하는 Docker command.

## 쉽게 설명하면

컨테이너가 아니라 도커 엔진 자체의 상태를 보여 주는 명령입니다.

## 정확한 설명

Docker daemon의 버전, storage driver, 실행 중인 container 수, 자원 한도 등을 한 번에 보여 주는 명령. 개별 container를 보는 명령과 달리 엔진 쪽 상태를 다룹니다.

## 이 미션에서는 왜 필요한가

예비 M01의 4.4 항목에서 도커가 설치되고 실제로 동작하는지 보여 주는 증거로 씁니다. 설치만 되고 데몬이 떠 있지 않으면 이 명령이 먼저 실패하므로, 다른 명령을 시도하기 전에 확인하기 좋습니다.

## 코드 예

```bash
docker info

# Server 섹션이 나오면 데몬이 떠 있는 것
# Cannot connect to the Docker daemon 이면 엔진이 안 떠 있다
```

## 관련 용어

- `http`
- `tcp`
