# Render

## 한 줄 설명

web service, static site, database를 배포하는 cloud platform.

## 쉽게 설명하면

`Render`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

web service, static site, database를 배포하는 cloud platform. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M13의 보너스 항목인 외부 배포에서 쓸 수 있는 또 다른 곳입니다. 하는 일이 비슷하므로 고르는 기준은 무료 한도와 데이터베이스를 함께 주는지 여부가 됩니다.

## 코드 예

```text
필요한 것
  빌드 명령   pip install -r requirements.txt
  시작 명령   uvicorn main:app --host 0.0.0.0 --port $PORT
  무료 플랜은 일정 시간 요청이 없으면 잠들어 첫 응답이 느리다
```

## 관련 용어

- `http`
- `tcp`
