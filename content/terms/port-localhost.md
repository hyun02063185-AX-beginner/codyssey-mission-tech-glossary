# 포트 / localhost

## 한 줄 설명

local host에서 process를 구분하는 port와 loopback 주소의 조합.

## 쉽게 설명하면

`포트 / localhost`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

local host에서 process를 구분하는 port와 loopback 주소의 조합. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 포트 매핑을 이해하기 위한 전제입니다. 컨테이너 안의 80번과 내 컴퓨터의 8080번이 다른 자리라는 것을 알아야, `-p 8080:80`이 무엇과 무엇을 잇는 설정인지 읽힙니다.

## 코드 예

```bash
docker run -d -p 8080:80 nginx
#              ↑내 컴퓨터  ↑컨테이너 안
curl http://localhost:8080     # 내 컴퓨터 쪽 번호로 접속
```

## 관련 용어

- `http`
- `tcp`
