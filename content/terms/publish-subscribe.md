# Publish/Subscribe

## 한 줄 설명

발행자가 메시지를 주제에 보내고 구독자가 그 주제를 받아 처리하는 비동기 메시징 패턴입니다.

## 쉽게 설명하면

신문사가 기사를 발행하면 구독자가 각자 받아보는 구조와 비슷합니다.

## 정확한 설명

Pub/Sub는 producer와 consumer를 직접 결합하지 않고 broker 또는 topic을 통해 메시지를 전달합니다. 전달 보장, 순서, 중복 처리 방식은 시스템마다 다릅니다.

## 이 미션에서는 왜 필요한가

M09 보너스 기능에서 이벤트 기반 기능을 확장할 때 생산자와 소비자의 결합을 줄입니다.

## 코드 예

```text
publish('user.created', payload)
subscribe('user.created', send_welcome_email)
```

## 관련 용어

- `queue`
- `asynchronous-programming`
- `event-loop`
