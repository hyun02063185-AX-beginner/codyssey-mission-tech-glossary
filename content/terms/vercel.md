# Vercel

## 한 줄 설명

frontend와 serverless deployment에 초점을 둔 hosting platform.

## 쉽게 설명하면

`Vercel`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

frontend와 serverless deployment에 초점을 둔 hosting platform. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서 쓸 수 있는 또 다른 배포 주소 예시입니다. 하는 일은 비슷하므로 어느 쪽을 고르든 상관없고, 고를 때 보는 것은 빌드 설정과 환경 변수를 어디에 두는지입니다.

## 코드 예

```text
연결 후 흐름
  git push  →  자동 빌드  →  https://프로젝트.vercel.app 갱신

SPA 라면 새로고침 404 를 막는 재작성 규칙이 필요할 수 있다
```

## 관련 용어

- `http`
- `tcp`
