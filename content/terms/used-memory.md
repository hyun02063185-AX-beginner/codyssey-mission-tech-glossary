# used_memory

## 한 줄 설명

프로세스 또는 시스템이 현재 사용 중인 메모리 양.

## 쉽게 설명하면

지금 실행 중인 프로그램들이 점유한 RAM 규모를 나타내는 수치다.

## 정확한 설명

도구마다 cache, shared memory, reclaimable memory를 포함하는 방식이 달라 정의를 확인해야 한다.

## 판단할 점

컨테이너 메모리 사용량 증가를 `docker stats`로 관찰한다.

## 주의할 점

used memory 증가만으로 누수라고 결론 내리면 안 된다.

## 이 미션에서는 왜 필요한가

AI·데이터 도구와 개발·운영 환경을 선택하고, 결과·비용·장애를 정확한 기준으로 설명하는 데 필요합니다.

## 관련 용어

- `docker-stats`
- `memory-accounting`
