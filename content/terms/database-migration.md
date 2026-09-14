# Database Migration

## 한 줄 설명
Database Migration은 데이터베이스 스키마 변경을 순서와 이력으로 관리해 각 환경에 적용하는 절차입니다.

## 쉽게 설명하면
공동으로 쓰는 설계도의 변경 기록입니다. 누가 언제 어떤 열이나 표를 바꿨는지 순서대로 남겨 개발·테스트·운영 환경이 같은 구조를 갖게 합니다.

## 정확한 설명
Migration은 schema를 만들거나 바꾸는 변경 단위를 versioned history로 관리합니다. 적용된 버전을 기록하고 아직 적용되지 않은 변경을 순서대로 실행합니다. 일반적인 데이터 이동 전체를 뜻하는 단독 “migration”과는 구분합니다.

## 동작 원리
1. schema 변경을 migration 파일로 만듭니다.
2. 적용 이력과 비교해 아직 적용되지 않은 변경을 찾습니다.
3. 정해진 순서로 실행하고 성공한 버전을 기록합니다.
4. rollback 지원 방식은 사용한 도구와 변경 종류에 따라 다릅니다.

## 이 미션에서는 왜 필요한가
M11의 관계형 schema, M12의 persistence, M13의 사용자·인증 데이터가 바뀔 때 환경별 구조 차이를 줄이는 운영 기준입니다.

## 코드 예
```sql
-- 예: 새 migration이 users에 display_name 열을 추가
ALTER TABLE users ADD COLUMN display_name TEXT;
```

## 주의할 점 / 경계 조건
운영 데이터가 있는 table의 큰 변경은 lock, backfill, 배포 순서를 고려해야 합니다. 모든 migration이 자동으로 안전하게 rollback되는 것은 아닙니다.

## 관련 용어
- `schema`
- `relational-database`
- `database-session`
- `transaction`
- `data-integrity`

## 흔한 오해
Migration은 database backup이나 모든 데이터 변환의 동의어가 아닙니다.

## 동료평가 질문
새로운 NOT NULL 열을 기존 사용자 table에 바로 추가할 때 어떤 배포 위험을 먼저 점검해야 할까요?
