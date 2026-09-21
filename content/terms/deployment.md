# Deployment

## 한 줄 설명

build artifact를 실행 environment에 배포하고 version을 전환하는 작업.

## 쉽게 설명하면

`Deployment`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

build artifact를 실행 environment에 배포하고 version을 전환하는 작업. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M01에서 내 컴퓨터에만 있던 HTML 파일을 GitHub Pages 주소로 누구나 볼 수 있게 바꾸는 일입니다. 파일을 올리는 것과 서비스가 되는 것은 다른 일이라, 무엇이 더 필요한지 여기서 처음 겪습니다.

## 코드 예

```text
로컬 파일  →  저장소에 push  →  Pages 설정에서 브랜치 지정
            →  https://USER.github.io/REPO 로 공개

로컬에서 열릴 때 쓰던 상대 경로가 공개 주소에서 깨지는 일이 흔하다
```

## 관련 용어

- `http`
- `tcp`
