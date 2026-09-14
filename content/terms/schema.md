# schema

## 한 줄 설명

schema는 데이터가 가져야 할 필드·형식·관계·제약을 정한 구조적 약속입니다.

## 쉽게 설명하면

데이터를 어떤 칸에 어떤 종류로 적고, 무엇은 반드시 채워야 하는지 정해 둔 양식입니다.

## 정확한 설명

데이터베이스 schema는 테이블, 컬럼, 자료형, key, constraint를 정의할 수 있고, JSON schema나 API schema는 메시지 구조를 정의할 수 있습니다. schema는 실제 데이터 한 건이 아니라 데이터를 검증하고 해석하기 위한 규칙입니다. schema 변경은 기존 데이터·클라이언트·쿼리에 영향을 줄 수 있으므로 호환성을 고려해야 합니다.

## 이 미션에서는 왜 필요한가

M03에서 구조화된 데이터를 다루고 M11에서 테이블 관계와 제약 조건을 설계하는 기준입니다.

## 코드 예

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);
```

## 관련 용어

- `json`
- `primary-key`
- `foreign-key`
- `data-integrity`

## 흔한 오해

schema가 있으면 데이터 품질 문제가 자동으로 모두 해결되는 것은 아닙니다. 업무 규칙과 입력 검증도 별도로 설계해야 합니다.

## 동료평가 질문

`email`에 UNIQUE 제약을 두면 어떤 종류의 데이터 오류를 줄일 수 있나요?
