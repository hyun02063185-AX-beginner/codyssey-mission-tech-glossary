# Composite Key

## 한 줄 설명

둘 이상의 column을 합쳐 row를 식별하는 key.

## 쉽게 설명하면

`Composite Key`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.

## 정확한 설명

둘 이상의 column을 합쳐 row를 식별하는 key. 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.

## 이 미션에서는 왜 필요한가

M11과 M12에서 model, SQL, persistence 코드를 구현할 때 data 구조와 변경 결과를 정확히 설명하는 기준입니다.

## 코드 예

```sql
-- Composite Key
SELECT * FROM example;
```

## 관련 용어

- `sql`
- `table`
