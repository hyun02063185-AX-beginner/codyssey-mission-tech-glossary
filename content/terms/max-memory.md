# maxmemory

## 한 줄 설명

프로세스·컨테이너가 사용할 수 있는 메모리의 상한 설정.

## 쉽게 설명하면

메모리를 끝없이 쓰지 못하도록 정한 천장이다.

## 정확한 설명

runtime 또는 cgroup 제한을 넘으면 allocation 실패나 OOM kill이 발생할 수 있다. 제한은 workload의 정상 peak를 고려해 정한다.

## 언제 쓰나

컨테이너에 메모리 limit을 지정한다.

## 기억할 경계

제한을 높이는 것만으로 누수 원인이 해결되지는 않는다.

## 이 미션에서는 왜 필요한가

이 회차의 저장소에 상한을 두는 설정입니다. 상한이 없으면 키가 쌓이다가 프로세스가 통째로 죽는데, 상한을 두면 대신 무엇을 지울지 정해야 하므로 제거 정책이 필요해집니다.

## 코드 예

```python
class Store:
    def __init__(self, max_memory=1024 * 1024):
        self.max_memory = max_memory

    def put(self, key, value):
        self.data[key] = value
        while self.used_memory() > self.max_memory and self.data:
            self.evict_one()        # 상한을 두면 제거 정책이 따라온다

# 상한을 높이는 것은 해결이 아니라 미루기다.
# 무엇이 쌓이고 있는지부터 본다
```

## 관련 용어

- `used-memory`
- `docker-stats`
