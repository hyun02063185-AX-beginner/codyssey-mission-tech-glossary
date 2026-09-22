# Token Usage / Cost

## 한 줄 설명

모델 API가 처리·생성한 토큰 수에 따라 발생하는 사용량과 비용.

## 쉽게 설명하면

입력과 답변 길이가 늘수록 API 청구량도 늘어나는 구조다.

## 정확한 설명

제공자는 입력·출력·캐시 토큰을 다르게 과금할 수 있다. usage를 기록해 요청별 비용과 예산을 관찰한다.

## 언제 쓰나

긴 context를 보낼 때 예상 비용을 제한한다.

## 기억할 경계

짧은 문자 수가 항상 적은 token 사용량을 뜻하지는 않는다.

## 이 미션에서는 왜 필요한가

이 회차의 도구는 호출할 때마다 비용이 발생합니다. 재시도를 넣으면 실패한 요청도 과금되므로, 요청마다 사용량을 기록해 두어야 재시도 정책이 비용에 어떤 영향을 주는지 판단할 수 있습니다.

## 코드 예

```python
usage = response['usage']
log.info('model=%s in=%d out=%d', MODEL, usage['input_tokens'], usage['output_tokens'])

# 재시도 3번이면 비용도 최대 3배다.
# 긴 diff 를 그대로 보내면 입력 토큰이 출력보다 훨씬 커진다 —
# 줄이려면 모델을 바꾸기 전에 입력부터 잘라 본다
prompt = COMMIT.format(diff=diff[:8000])
```

## 관련 용어

- `max-tokens`
- `regeneration`
