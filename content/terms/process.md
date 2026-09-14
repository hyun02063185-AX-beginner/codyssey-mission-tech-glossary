# Process

## 한 줄 설명
Process는 운영체제가 실행 중인 프로그램에 할당한 독립 실행 단위와 자원 경계입니다.

## 쉽게 설명하면
프로그램 파일을 실제로 실행하면 운영체제가 그 실행을 위한 작업 공간과 번호를 마련하는데, 그 실행 단위가 process입니다.

## 정확한 설명
Process는 자체 address space, resource, execution context를 가질 수 있습니다. 같은 프로그램을 두 번 실행하면 보통 별도 process가 되며, process 간 데이터 공유에는 명시적 통신 방식이 필요합니다.

## 이 미션에서는 왜 필요한가
Linux·server·container 환경에서 어떤 프로그램이 실제로 실행 중인지, log나 resource 사용량을 어느 단위로 관찰하는지 이해하는 기반입니다.

## 코드 예
```sh
ps -ef
# 실행 중인 process 목록을 관찰한다.
```

## 주의할 점 / 경계 조건
Process와 program file은 다릅니다. process 하나가 여러 thread를 가질 수 있으며, container도 process와 완전히 같은 개념은 아닙니다.

## 관련 용어
- `thread`
- `concurrency`
- `docker-container`
- `cli`
- `environment-variable`

## 흔한 오해
실행 파일 하나는 언제나 process 하나만 만든다는 생각은 맞지 않습니다.

## 동료평가 질문
두 process가 기본적으로 서로의 변수에 바로 접근하지 못하는 이유는 무엇인가요?
