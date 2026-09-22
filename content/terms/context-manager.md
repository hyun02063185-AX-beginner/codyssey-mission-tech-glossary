# Context Manager

## 한 줄 설명

블록의 시작과 끝에서 자원 획득·정리를 보장하는 Python 프로토콜.

## 쉽게 설명하면

문을 열고 일을 한 뒤 예외가 나도 문을 닫아 주는 장치다.

## 정확한 설명

`with` 문은 `__enter__` 뒤 본문을 실행하고, 종료 시 `__exit__`를 호출한다. 파일·락·DB 연결 정리에 알맞다.

## 언제 쓰나

`with open(path) as f:`로 파일을 읽으면 사용 뒤 자동으로 닫힌다.

## 기억할 경계

with를 썼다고 트랜잭션 commit 정책까지 자동으로 맞는 것은 아니다.

## 이 미션에서는 왜 필요한가

가계부 파일을 열어 쓰는 도중에 오류가 나도 파일이 닫히도록 보장해 줍니다. 닫지 않은 채 프로그램이 끝나면 쓴 내용이 디스크에 안 남을 수 있는데, `with`를 쓰면 예외가 나든 정상 종료든 정리가 실행됩니다.

## 코드 예

```python
# 이 방식은 중간에 오류가 나면 close() 에 도달하지 못한다
f = open('ledger.csv', 'w', encoding='utf-8')
f.write(row)
f.close()

# with 는 예외가 나도 빠져나가면서 닫는다
with open('ledger.csv', 'w', encoding='utf-8') as f:
    f.write(row)

# 직접 만들 수도 있다
from contextlib import contextmanager

@contextmanager
def timer(label):
    import time
    start = time.perf_counter()
    try:
        yield
    finally:
        print(label, time.perf_counter() - start)
```

## 관련 용어

- `resource-cleanup`
- `exception-handling`
