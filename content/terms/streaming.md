# streaming

## 한 줄 설명

결과 전체가 준비되기 전에 조각 단위로 데이터를 보내는 전송 방식.

## 쉽게 설명하면

긴 답을 다 만들 때까지 기다리지 않고 완성되는 부분부터 보여 주는 방식이다.

## 정확한 설명

서버는 chunk 또는 event를 순서대로 보내고 client는 누적 렌더링한다. 연결 종료·취소·재연결을 고려해야 한다.

## 판단할 점

AI 답변 token을 생성되는 대로 채팅 UI에 표시한다.

## 주의할 점

streaming은 총 처리 시간을 줄이지 못해도 체감 대기 시간을 줄일 수 있다.

## 이 미션에서는 왜 필요한가

이 회차의 도구가 답을 다 만들 때까지 아무것도 보여 주지 않으면 사용자는 멈춘 것으로 봅니다. 조각이 오는 대로 화면에 찍으면 전체 시간은 같아도 기다리는 느낌이 크게 줄어듭니다.

## 코드 예

```python
import sys

chunks = []
for chunk in ask_stream(prompt):
    chunks.append(chunk)
    sys.stdout.write(chunk)        # 오는 대로 보여 준다
    sys.stdout.flush()             # 줄바꿈 전에도 화면에 나오게

text = ''.join(chunks)             # 검증은 다 모은 뒤에 한다

# 총 시간은 줄지 않는다. 줄어드는 것은 첫 글자까지의 시간이다
```

## 관련 용어

- `ai-api`
- `serialization`
