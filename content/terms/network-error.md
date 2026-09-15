# 네트워크 오류

## 한 줄 설명

DNS, connection, timeout, protocol 등의 실패로 network 요청이 완료되지 않는 상태.

## 쉽게 설명하면

`네트워크 오류`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

DNS, connection, timeout, protocol 등의 실패로 network 요청이 완료되지 않는 상태. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

M05와 M12에서 service를 배포하고 외부 request, server response, cloud resource의 연결 상태를 확인하는 기준입니다.

## 코드 예

```text
# 네트워크 오류
request → route → service
```

## 관련 용어

- `http`
- `tcp`
