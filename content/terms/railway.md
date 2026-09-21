# Railway

## 한 줄 설명

application과 database를 배포·운영하는 platform service.

## 쉽게 설명하면

`Railway`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

application과 database를 배포·운영하는 platform service. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M13의 보너스 항목인 외부 배포에서 쓸 수 있는 곳입니다. 정적 파일만 올리는 것과 달리 파이썬 서버와 데이터베이스가 함께 떠야 하므로, 실행 명령과 환경 변수를 어디에 적는지가 핵심입니다.

## 코드 예

```text
필요한 것
  시작 명령   uvicorn main:app --host 0.0.0.0 --port $PORT
  환경 변수   DATABASE_URL · SECRET_KEY
  포트        서비스가 준 값을 그대로 써야 한다
```

## 관련 용어

- `http`
- `tcp`
