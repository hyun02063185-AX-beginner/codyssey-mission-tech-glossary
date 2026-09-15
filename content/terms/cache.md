# Cache

## 한 줄 설명

다시 계산하거나 가져오는 비용이 큰 값을 가까운 곳에 임시로 저장해 더 빨리 재사용하는 저장소입니다.

## 쉽게 설명하면

자주 찾는 책을 창고 대신 책상 위에 두는 것과 비슷합니다.

## 정확한 설명

Cache는 원본 데이터(source of truth)의 복사본을 메모리·브라우저·중간 서버 등에 두고 hit 때 빠르게 반환합니다. TTL, 무효화, eviction 정책이 없으면 오래된 값이나 메모리 압박 문제가 생깁니다.

## 동작 원리

1. key로 캐시를 찾습니다.
2. hit이면 복사본을 반환합니다.
3. miss이면 원본에서 읽고 정책에 맞게 저장합니다.
4. 만료·변경·용량 압박 때 항목을 갱신하거나 제거합니다.

## 이 미션에서는 왜 필요한가

M09 Redis 활용에서 빠른 조회와 원본 데이터 일관성 사이의 trade-off를 설명합니다.

## 코드 예

```python
value = cache.get(key)
if value is None:
    value = load_from_database(key)
    cache.set(key, value, ttl=60)
```

## 주의할 점 / 경계 조건

Cache hit은 값이 최신이라는 보장이 아닙니다. 변경 직후에는 invalidation 또는 짧은 TTL 전략이 필요합니다.

## 관련 용어

- `time-to-live`
- `least-recently-used`
- `memoization`
- `redis`

## 흔한 오해

Cache는 데이터베이스를 무조건 대체하는 영구 저장소가 아닙니다.

## 동료평가 질문

사용자 프로필을 수정한 뒤 cache를 갱신하거나 지워야 하는 이유는 무엇인가요?
