# Backend as a Service

## 한 줄 설명

인증·database·storage 같은 backend 기능을 managed service로 쓰는 방식.

## 쉽게 설명하면

`Backend as a Service`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

인증·database·storage 같은 backend 기능을 managed service로 쓰는 방식. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서 Firebase와 Supabase를 함께 놓고 보면 드러나는 공통 성격입니다. 둘 다 저장·인증·권한을 서비스로 빌려주므로, 고르는 기준이 기능 목록이 아니라 데이터를 어떤 모양으로 둘 것인가로 좁혀집니다.

## 코드 예

```text
직접 만들면            빌려 쓰면
  서버 코드             SDK 호출
  DB 설치·운영          콘솔에서 설정
  인증 구현             제공되는 로그인

대신 규칙이 서비스 쪽에 있어 옮기기 어려워진다
```

## 관련 용어

- `http`
- `tcp`
