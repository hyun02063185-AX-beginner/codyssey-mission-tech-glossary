# Domain Name System

## 한 줄 설명
Domain Name System(DNS)은 사람이 읽는 이름을 연결에 쓸 IP 주소 등의 레코드로 찾게 하는 분산 이름 해석 체계입니다.

## 쉽게 설명하면
웹 주소를 전화번호로 찾아 주는 분산 주소록입니다. 한 대의 중앙 서버가 아니라 여러 resolver와 권한 서버가 역할을 나눕니다.

## 정확한 설명
DNS client는 보통 resolver에 이름 조회를 요청하고, resolver는 cache를 사용하거나 필요한 authority를 따라 레코드를 찾습니다. 얻은 IP 주소는 이후 연결의 목적지를 정하는 데 쓰이며 DNS 자체가 웹 server 연결을 대신하지는 않습니다.

## 동작 원리
`service.example → resolver/cache → DNS records → IP address → TCP/HTTPS connection`처럼 이름 해석과 실제 전송 연결은 이어지되 서로 다른 단계입니다.

## 이 미션에서는 왜 필요한가
M05에서 HTTPS 서비스 URL이 public IP와 연결되는 배포·접속 경로를 설명할 때, 이름 해석과 certificate·transport의 역할을 구분하는 기준입니다.

## 코드 예
```sh
nslookup example.com
# 이름에 대응하는 DNS 레코드와 주소를 확인한다.
```

## 주의할 점 / 경계 조건
DNS 결과는 cache와 TTL의 영향을 받을 수 있습니다. DNS가 성공해도 server가 실행 중이거나 HTTPS certificate가 유효하다는 보장은 없습니다.

## 관련 용어
- `public-ip`
- `https`
- `tls-certificate`
- `internet-gateway`

## 흔한 오해
DNS는 하나의 중앙 서버도, URL 전체를 처리하는 HTTP server도 아닙니다.

## 동료평가 질문
도메인 이름 조회가 성공했는데 사이트 연결이 실패한다면 DNS 이후 어떤 계층을 점검할 수 있을까요?
