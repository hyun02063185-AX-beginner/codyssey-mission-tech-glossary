# AI API

## 한 줄 설명

AI 모델 기능을 HTTP 등의 인터페이스로 호출하게 하는 서비스 API.

## 쉽게 설명하면

애플리케이션이 모델에게 요청을 보내고 결과를 받는 창구다.

## 정확한 설명

요청에는 모델·입력·파라미터가, 응답에는 생성 결과·사용량·오류가 포함될 수 있다. timeout과 재시도 정책을 호출자 쪽에서도 설계한다.

## 작은 사례

채팅 화면에서 사용자 prompt를 보내고 생성 결과를 표시한다.

## 주의할 점

API 호출 성공은 출력 품질이나 정책 적합성을 뜻하지 않는다.

## 이 미션에서는 왜 필요한가

이 회차의 도구는 모델을 직접 돌리지 않고 이 창구로 요청을 보냅니다. 네트워크 너머의 호출이므로 느려질 수도 실패할 수도 있고, 그때 도구가 어떻게 행동할지를 직접 정해야 합니다. 응답이 오지 않는 경우를 적지 않으면 명령이 그대로 멈춥니다.

## 코드 예

```python
import httpx

def ask(prompt, timeout=30):
    try:
        r = httpx.post(URL, json={'model': MODEL, 'input': prompt}, timeout=timeout)
        r.raise_for_status()
    except httpx.TimeoutException:
        raise RuntimeError('응답이 없습니다. 잠시 뒤 다시 시도하세요.')
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f'요청이 거절되었습니다 ({e.response.status_code})')
    return r.json()

# timeout 을 주지 않으면 명령이 무한정 멈춘 것처럼 보인다
```

## 관련 용어

- `ai-model`
- `max-tokens`
