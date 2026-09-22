# Referential Integrity

## 한 줄 설명

foreign key가 존재하는 parent row만 참조하게 하는 제약.

## 쉽게 설명하면

가리키는 대상이 실제로 있어야 한다는 규칙입니다. 없는 회원을 작성자로 가리키는 글이 생기지 않게 합니다.

## 정확한 설명

외래 키 값은 참조하는 표에 실제로 존재하는 키이거나 NULL이어야 한다. 부모 행을 지우거나 키를 바꿀 때의 동작(거부, 함께 삭제, NULL로 설정)을 미리 정해 두며, 정하지 않으면 기본 동작이 적용된다.

## 이 미션에서는 왜 필요한가

이 회차에서 외래 키가 실제로 보장하는 것이 이것입니다. 열 이름만 `author_id`로 짓고 제약을 걸지 않으면 아무 숫자나 들어갈 수 있는데, 그러면 가리키는 대상이 없는 글이 조용히 생깁니다.

## 코드 예

```sql
PRAGMA foreign_keys = ON;      -- SQLite 는 켜 줘야 검사한다

CREATE TABLE post (
    id        INTEGER PRIMARY KEY,
    author_id INTEGER NOT NULL
        REFERENCES member(id) ON DELETE CASCADE
);

-- 부모를 지울 때의 선택
--   ON DELETE RESTRICT   자식이 있으면 지우지 못하게 (기본에 가깝다)
--   ON DELETE CASCADE    자식도 함께 지운다
--   ON DELETE SET NULL   자식의 참조를 비운다 (NOT NULL 이면 못 쓴다)

INSERT INTO post (author_id) VALUES (999);   -- 제약이 있으면 거부된다
```

## 주의할 점 / 경계 조건

SQLite는 외래 키 검사가 기본으로 꺼져 있습니다. 연결할 때마다 켜 주지 않으면 제약을 적어 두고도 검사되지 않습니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

열 이름을 `_id`로 지으면 연결된다고 생각하기 쉽지만, 이름은 사람이 보는 표시일 뿐입니다. 참조 제약을 적어야 검사가 생깁니다.

## 동료평가 질문

외래 키 제약 없이 없는 회원 번호를 넣어 보고, 제약을 건 뒤 다시 해 보면 무엇이 달라지는지 보여 줄 수 있나요?
