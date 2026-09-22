# subquery

## 한 줄 설명

다른 SQL query 안에 들어가 결과를 제공하는 query.

## 쉽게 설명하면

쿼리 안에 들어간 또 다른 쿼리입니다. 안쪽이 먼저 답을 내고 바깥쪽이 그 답을 씁니다.

## 정확한 설명

조건절, 선택 목록, FROM 절 등에 놓일 수 있다. 바깥 쿼리의 값을 참조하는 형태는 행마다 다시 실행될 수 있어 비용이 커지므로, 같은 결과를 연결로 표현할 수 있으면 그쪽이 빠른 경우가 많다.

## 이 미션에서는 왜 필요한가

이 회차는 하나 이상을 작성하도록 요구합니다. "평균보다 글이 많은 작성자"처럼 기준값 자체를 계산해야 하는 질문에 쓰이며, 같은 질문을 연결로도 쓸 수 있어 두 방식을 비교해 보기 좋은 자리입니다.

## 코드 예

```sql
-- 기준값을 계산해야 하는 질문
SELECT author_id, COUNT(*) AS c
FROM   post
GROUP BY author_id
HAVING COUNT(*) > (SELECT COUNT(*) * 1.0 / COUNT(DISTINCT author_id) FROM post);

-- NOT IN 은 NULL 하나에 전체가 비어 버린다
SELECT * FROM member
WHERE id NOT IN (SELECT author_id FROM post);   -- author_id 에 NULL 이 있으면 0줄

SELECT * FROM member AS m
WHERE NOT EXISTS (SELECT 1 FROM post WHERE author_id = m.id);   -- 안전하다
```

## 주의할 점 / 경계 조건

`NOT IN`의 대상에 NULL이 하나라도 있으면 결과가 항상 비게 됩니다. 이 경우 `NOT EXISTS`를 쓰는 편이 안전합니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

안쪽 쿼리는 한 번만 실행된다고 생각하기 쉽지만, 바깥 값을 참조하면 행마다 실행될 수 있습니다. 행이 많을 때 느려지는 원인입니다.

## 동료평가 질문

같은 질문을 서브쿼리와 조인으로 각각 써 보고, 어느 쪽을 왜 골랐는지 설명할 수 있나요?
