# Jinja2 SSR

## 한 줄 설명

Jinja2 template을 server에서 렌더링해 HTML response로 보내는 방식.

## 쉽게 설명하면

`Jinja2 SSR`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

Jinja2 template을 server에서 렌더링해 HTML response로 보내는 방식. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

M05와 M12에서 service를 배포하고 외부 request, server response, cloud resource의 연결 상태를 확인하는 기준입니다.

## 코드 예

```text
# Jinja2 SSR
request → route → service
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
