# Layered Architecture

## 한 줄 설명

역할이 다른 코드를 계층으로 나누고 의존 방향을 제한하는 설계 방식입니다.

## 쉽게 설명하면

접수 창구, 업무 부서, 보관소가 각자 맡은 일을 하는 구조와 비슷합니다.

## 정확한 설명

Layered architecture는 보통 요청 진입부, 비즈니스 규칙, 데이터 접근을 분리합니다. 계층은 파일 개수 규칙이 아니라 변경 이유와 의존성을 관리하는 경계입니다.

## 이 미션에서는 왜 필요한가

M12에서 Router·Service·Repository의 책임을 나누어 API 변경과 저장소 변경의 영향을 줄입니다.

## 코드 예

```text
Router → Service → Repository → Database
```

## 주의할 점 / 경계 조건

작은 프로그램에 계층을 과도하게 늘리면 탐색 비용만 커질 수 있으므로 실제 변경 축에 맞춰야 합니다.

## 관련 용어

- `separation-of-concerns`
- `dependency-injection`
- `repository-pattern`

## 흔한 오해

계층을 만들었다고 상위 계층이 하위 구현 세부사항에 의존하지 않게 되는 것은 아닙니다.

## 동료평가 질문

Repository의 SQL 세부사항이 Router까지 새면 어떤 유지보수 문제가 생기나요?
