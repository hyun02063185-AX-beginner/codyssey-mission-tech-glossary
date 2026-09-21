# 네트워크 오류

## 한 줄 설명

DNS, connection, timeout, protocol 등의 실패로 network 요청이 완료되지 않는 상태.

## 쉽게 설명하면

`네트워크 오류`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

DNS, connection, timeout, protocol 등의 실패로 network 요청이 완료되지 않는 상태. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M06에서 AI API 호출이 실패하는 또 다른 이유입니다. 인증 오류와 달리 잠시 뒤 다시 하면 성공할 수 있으므로, 사용자에게 보여 줄 문구와 재시도 여부가 달라집니다.

## 코드 예

```python
import httpx
try:
    response = httpx.post(url, json=payload, timeout=30)
except httpx.TimeoutException:
    print("응답이 늦습니다. 잠시 뒤 다시 시도해 보세요.")   # 재시도할 만하다
except httpx.ConnectError:
    print("서버에 연결하지 못했습니다. 네트워크를 확인하세요.")
```

## 관련 용어

- `http`
- `tcp`
