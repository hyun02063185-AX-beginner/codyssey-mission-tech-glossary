# JOIN

## 한 줄 설명

JOIN은 관계된 열을 기준으로 둘 이상의 테이블 행을 한 결과로 함께 조회하는 SQL 연산입니다.

## 쉽게 설명하면

주문에는 사용자 ID만 있고 사용자 이름은 사용자 테이블에 있을 때, JOIN으로 주문과 이름을 한 목록에 표시할 수 있습니다.

## 코드 예

```sql
SELECT orders.id, users.name
FROM orders
JOIN users ON orders.user_id = users.id;
```

## 정확한 설명

INNER JOIN은 양쪽 조건이 맞는 행만 반환하고, LEFT JOIN은 왼쪽 테이블의 행을 남긴 채 맞는 오른쪽 행이 없으면 NULL을 채웁니다. JOIN 조건을 빠뜨리거나 잘못 쓰면 기대보다 많은 행이 곱해져 나올 수 있으므로, 어떤 키로 연결하는지 먼저 확인해야 합니다.

![INNER JOIN과 LEFT JOIN: 짝이 없는 왼쪽 행은 INNER에서 빠지고 LEFT에서 NULL과 함께 남는다](assets/join-inner-left.svg)

짝이 여러 개인 행은 결과에 그 수만큼 나옵니다. 그래서 JOIN 결과의 행 수는 원래 표의 행 수와 다를 수 있습니다. B6-1에서 학생 15명을 수강 기록과 연결하면 INNER JOIN은 26행, LEFT JOIN은 수강 0건인 학생 1명이 더해져 27행입니다.

위 SQL 코드 예는 `orders`·`users`, 그림은 B6-1의 `student`·`enrollment`를 사용합니다. 서로 다른 데이터로 같은 JOIN 원리를 설명합니다. 그림의 행 순서는 설명을 위한 정렬이며, `ORDER BY` 없이는 결과 행의 순서가 보장되지 않습니다.

## 이 미션에서는 왜 필요한가

B6-1에서 테이블 관계를 바탕으로 필요한 데이터를 함께 조회합니다.

## 관련 용어

- sql
- primary-key
- foreign-key

## 흔한 오해

JOIN은 두 테이블을 영구적으로 합치는 명령이 아닙니다. 조회할 때 관계된 행을 조합하는 방법입니다.

## 동료평가 질문

사용자가 없는 주문도 보고 싶다면 INNER JOIN 대신 어떤 JOIN을 검토해야 하나요?
