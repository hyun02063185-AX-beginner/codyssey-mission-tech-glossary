# Docker Compose

## 한 줄 설명

여러 컨테이너 서비스를 하나의 선언 파일로 정의·실행하는 Docker Compose 도구.

## 쉽게 설명하면

웹 앱과 DB처럼 함께 움직이는 컨테이너 묶음을 한 파일로 관리한다.

## 정확한 설명

compose file에 service, network, volume, environment를 선언하고 `docker compose up`으로 원하는 상태를 만든다.

## 언제 쓰나

개발 환경에서 API와 Redis를 함께 시작한다.

## 기억할 경계

Compose는 운영 오케스트레이터의 모든 기능을 대신하지 않는다.

## 이 미션에서는 왜 필요한가

예비 M01의 보너스 항목으로, 컨테이너를 여러 개 함께 띄울 때 씁니다. `docker run` 을 여러 번 치는 대신 구성을 파일에 적어 두면 같은 구성을 그대로 다시 만들 수 있습니다.

## 코드 예

```text
# compose.yaml
services:
  web:
    image: nginx:alpine
    ports: ["8080:80"]
  db:
    image: postgres:16
    environment: { POSTGRES_PASSWORD: dev }

# docker compose up -d
```

## 관련 용어

- `docker-hub`
- `redis`
