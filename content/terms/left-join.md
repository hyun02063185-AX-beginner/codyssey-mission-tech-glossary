# LEFT JOIN

## 한 줄 설명

왼쪽 table의 모든 row와 일치하는 오른쪽 row를 반환하는 join.

## 쉽게 설명하면

왼쪽 표의 줄은 모두 가져오고, 오른쪽에 짝이 있으면 붙이고 없으면 빈칸으로 둡니다.

## 정확한 설명

왼쪽 표의 모든 행을 유지하고 조건에 맞는 오른쪽 행을 붙인다. 짝이 없으면 오른쪽 열은 NULL이 된다. 오른쪽 열의 NULL을 제외하는 조건(예: `c.is_public = 1`)을 WHERE에 두면 짝이 없는 행이 빠져 같은 조건의 INNER JOIN과 같은 결과가 된다. `IS NULL`처럼 NULL을 선택하는 조건은 효과가 다르다.

그림에서는 수강 기록이 없는 학생도 남고, 그 학생의 오른쪽 수강 열은 NULL이 됩니다. 한 학생에 수강 기록이 여러 개면 여러 결과 행이 생길 수 있습니다.

![LEFT JOIN은 수강 기록이 없는 학생도 남기고 오른쪽 열을 NULL로 채우며 INNER JOIN은 일치하는 행 쌍만 반환하는 비교](assets/join-inner-left.svg)

## 이 미션에서는 왜 필요한가

B6-1에서 수강 기록이 없는 학생까지 포함해 학생별 수강 현황을 볼 때 사용합니다. 아래 댓글 수 SQL은 교육용 일반 사례이며, 오른쪽에 연결된 기록이 없는 경우도 결과에 남기는 원리를 보여 줍니다.

## 코드 예

```sql
-- 댓글이 없는 글도 포함해 댓글 수를 센다
SELECT p.id, p.title, COUNT(c.id) AS comment_count
FROM   post AS p
LEFT JOIN comment AS c ON c.post_id = p.id
GROUP  BY p.id, p.title;
-- COUNT(c.id) 는 NULL 을 세지 않으므로 댓글 없는 글은 0 이 된다
-- COUNT(*) 로 쓰면 1 이 나온다 — 행은 있기 때문

-- 조건의 위치가 결과를 바꾼다
LEFT JOIN comment AS c ON c.post_id = p.id AND c.is_public = 1   -- 글은 다 남는다
LEFT JOIN comment AS c ON c.post_id = p.id WHERE c.is_public = 1  -- INNER JOIN 과 같아진다
```

## 주의할 점 / 경계 조건

오른쪽 열의 NULL을 제외하는 조건을 WHERE에 두면 짝이 없는 행이 빠집니다. 왼쪽 행을 모두 유지하면서 오른쪽의 연결 대상만 제한하려면 그 조건을 ON에 둡니다. 반면 `WHERE c.id IS NULL`은 짝이 없는 행을 찾을 때 사용할 수 있습니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

NULL이 들어간 열을 세면 그 행도 세어진다고 생각하기 쉽지만, 열을 지정해 세면 NULL은 빠집니다. 행 수를 세려면 전체를 세야 합니다.

## 동료평가 질문

오른쪽 표의 조건을 `WHERE` 에 둘 때와 `ON` 에 둘 때 결과가 어떻게 달라지는지 보여 줄 수 있나요?
