# Supabase

## 한 줄 설명

PostgreSQL 기반 database, auth, storage를 제공하는 backend platform.

## 쉽게 설명하면

`Supabase`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

PostgreSQL 기반 database, auth, storage를 제공하는 backend platform. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서 Firebase와 나란히 놓고 고를 수 있는 선택지입니다. 같은 일을 하지만 안쪽이 관계형 테이블이라, 표 구조를 미리 정하는 방식이 익숙하다면 이쪽이 읽기 쉽습니다.

## 코드 예

```javascript
const { data } = await supabase.from("todos").select("*");
await supabase.from("todos").insert({ title, done: false });
// 테이블과 열을 미리 정해 두고 쓴다
```

## 주의할 점 / 경계 조건

한 network 설정이 정상이어도 DNS, security rule, server process, certificate, application route 중 다른 단계가 실패할 수 있습니다.

## 관련 용어

- `http`
- `tcp`

## 흔한 오해

public address나 열린 port 하나만으로 service 전체가 안전하거나 정상이라는 뜻은 아닙니다.

## 동료평가 질문

이 request 경로가 실패했을 때 address, route, port, server 중 어느 순서로 확인하겠습니까?
