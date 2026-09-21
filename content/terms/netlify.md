# Netlify

## 한 줄 설명

static web site와 serverless 기능을 배포하는 hosting platform.

## 쉽게 설명하면

`Netlify`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

static web site와 serverless 기능을 배포하는 hosting platform. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서 만든 사이트를 공개할 때 쓸 수 있는 배포 주소의 예시입니다. 저장소를 연결해 두면 밀어 넣을 때마다 다시 배포되므로, 배포가 별도 작업이 아니라 밀어 넣기의 결과가 됩니다.

## 코드 예

```text
연결 후 흐름
  git push  →  자동 빌드  →  https://프로젝트.netlify.app 갱신

환경 변수는 저장소가 아니라 서비스 설정에 넣는다
```

## 관련 용어

- `http`
- `tcp`
