# 베이스 이미지

## 한 줄 설명

container image가 FROM으로 상속하는 시작 filesystem image.

## 쉽게 설명하면

`베이스 이미지`은(는) 내 이미지를 만들 때 바닥으로 삼는, 남이 이미 만들어 둔 이미지입니다.

## 정확한 설명

container image가 FROM으로 상속하는 시작 filesystem image. 여기에 내 파일과 설정을 얹어 새 이미지를 만듭니다. 무엇을 고르느냐에 따라 최종 이미지의 크기와 들어 있는 도구, 보안 갱신 주기가 달라집니다.

## 동작 원리

request는 name 또는 address를 찾고 route와 gateway를 따라 destination에 도달하며, server process가 해당 port에서 response를 처리합니다.

## 이 미션에서는 왜 필요한가

예비 M01의 4.7 항목에서 웹서버 베이스로 갈지 리눅스 베이스로 갈지 직접 고르게 합니다. 웹서버 베이스는 바로 뜨지만 안이 무엇으로 채워졌는지 덜 보이고, 리눅스 베이스는 직접 설치해야 하지만 과정이 다 보입니다.

## 코드 예

```text
# 웹서버 베이스 — 바로 뜬다
FROM nginx:alpine
COPY ./site /usr/share/nginx/html

# 리눅스 베이스 — 직접 설치한다
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y nginx
```

## 주의할 점 / 경계 조건

태그를 latest로 두면 나중에 빌드할 때 다른 이미지가 내려와 결과가 달라집니다. 버전을 적어 두는 편이 재현에 유리합니다.

## 관련 용어

- `http`
- `tcp`

## 흔한 오해

public address나 열린 port 하나만으로 service 전체가 안전하거나 정상이라는 뜻은 아닙니다.

## 동료평가 질문

이 request 경로가 실패했을 때 address, route, port, server 중 어느 순서로 확인하겠습니까?
