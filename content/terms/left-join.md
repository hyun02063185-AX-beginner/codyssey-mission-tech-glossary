# LEFT JOIN

## 한 줄 설명

왼쪽 table의 모든 row와 일치하는 오른쪽 row를 반환하는 join.

## 쉽게 설명하면

왼쪽 표의 줄은 모두 가져오고, 오른쪽에 짝이 있으면 붙이고 없으면 빈칸으로 둡니다.

## 정확한 설명

왼쪽 표의 모든 행을 유지하고 조건에 맞는 오른쪽 행을 붙인다. 짝이 없으면 오른쪽 열은 NULL이 된다. 이 NULL을 조건절에서 거르면 결과가 안쪽 연결과 같아지므로, 조건을 어디에 두느냐가 결과를 바꾼다.

## 이 미션에서는 왜 필요한가

이 회차는 하나 이상을 작성하도록 요구합니다. "댓글이 없는 글도 포함해 글마다 댓글 수 보기" 같은 질문은 이 연결이 아니면 답할 수 없습니다. 없는 것을 찾는 조회가 여기서 가능해집니다.

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

오른쪽 표에 대한 조건을 WHERE에 두면 NULL이 걸러져 안쪽 연결과 같아집니다. 그 조건은 연결 조건 쪽에 두어야 합니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

NULL이 들어간 열을 세면 그 행도 세어진다고 생각하기 쉽지만, 열을 지정해 세면 NULL은 빠집니다. 행 수를 세려면 전체를 세야 합니다.

## 동료평가 질문

오른쪽 표의 조건을 `WHERE` 에 둘 때와 `ON` 에 둘 때 결과가 어떻게 달라지는지 보여 줄 수 있나요?
