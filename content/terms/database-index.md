# Database Index

## 한 줄 설명
Database Index는 특정 column 값으로 row를 더 빨리 찾도록 돕는 별도 탐색 구조입니다.

## 쉽게 설명하면
책의 맨 뒤 색인처럼 원하는 항목의 위치를 빨리 찾게 해 주지만, 색인 자체도 저장 공간과 갱신 비용을 가집니다.

## 정확한 설명
Index는 query predicate, join, order에 맞는 access path를 제공할 수 있습니다. 어떤 index가 이로운지는 data distribution, query pattern, selectivity, database optimizer 판단에 따라 달라집니다.

## 이 미션에서는 왜 필요한가
M11에서 관계형 query가 느릴 때 무작정 index를 추가하지 않고, 실제 조회 패턴과 write 비용을 근거로 선택하는 기준입니다.

## 코드 예
```sql
CREATE INDEX idx_posts_author_id ON posts(author_id);
```

## 주의할 점 / 경계 조건
Index는 INSERT·UPDATE·DELETE 때도 갱신됩니다. 작은 table, 낮은 selectivity, 쓰기 중심 workload에서는 기대한 이득이 작거나 비용이 클 수 있습니다.

## 관련 용어
- `relational-database`
- `schema`
- `sql`
- `transaction`
- `data-integrity`

## 흔한 오해
모든 column에 index를 만들면 database가 항상 빨라진다는 말은 맞지 않습니다.

## 동료평가 질문
조회는 빠르지만 쓰기가 잦은 table에 index를 추가할 때 어떤 tradeoff를 측정해야 할까요?
