# Data Integrity

## 한 줄 설명
Data Integrity는 데이터가 정해진 규칙과 관계를 유지하며 정확하고 일관된 상태로 보존되는 성질입니다.

## 쉽게 설명하면
데이터가 서로 맞고 망가지지 않도록 하는 약속입니다. 주문의 사용자 ID가 실제 사용자와 연결되고, 수량이 규칙을 어기지 않는 상태를 예로 들 수 있습니다.

## 정확한 설명
Integrity는 entity, referential, domain constraints와 transaction 처리 등으로 지원될 수 있습니다. 이는 unauthorized modification을 막는 security integrity와 겹칠 수 있어도 자동으로 같은 뜻은 아니며, 여기서는 database data의 유효성과 일관성을 중심으로 봅니다.

## 이 미션에서는 왜 필요한가
M11의 관계·제약조건과 M12·M13의 저장 데이터가 잘못된 참조나 불가능한 값으로 흐르지 않도록 설계할 때 필요합니다.

## 코드 예
```sql
CREATE TABLE orders (
  user_id INTEGER REFERENCES users(id),
  quantity INTEGER CHECK (quantity > 0)
);
```

## 주의할 점 / 경계 조건
검증을 UI에만 두면 다른 client나 직접 query가 규칙을 우회할 수 있습니다. database constraint와 application validation의 책임을 함께 설계해야 합니다.

## 관련 용어
- `schema`
- `relational-database`
- `transaction`
- `acid`
- `database-migration`

## 흔한 오해
Data integrity는 보안 제품 하나를 설치하면 자동으로 보장되는 속성이 아닙니다.

## 동료평가 질문
foreign key와 CHECK constraint는 각각 어떤 종류의 integrity를 돕나요?
