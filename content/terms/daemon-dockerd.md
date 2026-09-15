# 데몬

## 한 줄 설명

Docker API 요청을 받아 이미지·컨테이너·네트워크를 관리하는 백그라운드 데몬.

## 쉽게 설명하면

docker 명령이 일을 부탁하는 뒤편의 관리자 프로세스다.

## 정확한 설명

dockerd는 client 요청을 처리하고 containerd 등 runtime 구성 요소와 통신한다. socket 권한과 daemon 상태가 실행에 영향을 준다.

## 언제 쓰나

`docker ps`가 실패할 때 daemon 연결 상태를 점검한다.

## 기억할 경계

docker CLI가 설치됐다고 daemon이 실행 중이라는 뜻은 아니다.

## 이 미션에서는 왜 필요한가

AI·데이터 도구와 개발·운영 환경을 선택하고, 결과·비용·장애를 정확한 기준으로 설명하는 데 필요합니다.

## 관련 용어

- `containerd-runc`
- `docker-logs`
