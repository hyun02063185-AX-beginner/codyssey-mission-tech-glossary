# Socket / Port

## 한 줄 설명

transport protocol에서 process endpoint를 구분하는 port 번호.

## 쉽게 설명하면

`Socket / Port`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

transport protocol에서 process endpoint를 구분하는 port 번호. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M07에서 15034 포트의 상태 점검이 동작하는지 확인하려면 먼저 그 포트에서 무언가 듣고 있어야 합니다. LISTEN 상태가 무슨 뜻인지 알아야 "포트를 열었다"와 "프로그램이 받고 있다"를 구분할 수 있습니다.

## 코드 예

```bash
ss -ltnp | grep 15034
# LISTEN 0 4096 0.0.0.0:15034 ... users:(("python",pid=1234))
# 줄이 없으면 방화벽 문제가 아니라 프로그램이 안 떠 있는 것
```

## 관련 용어

- `http`
- `tcp`
