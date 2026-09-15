# 컨테이너 런타임

## 한 줄 설명

컨테이너 생명주기를 관리하는 containerd와 실제 프로세스를 만드는 runc.

## 쉽게 설명하면

컨테이너 도구 뒤에서 이미지와 실행 프로세스를 나눠 담당하는 구성 요소다.

## 정확한 설명

containerd는 이미지·snapshot·task 관리를, runc는 OCI spec에 따라 namespace·cgroup을 적용해 프로세스를 시작한다.

## 언제 쓰나

Docker 실행 문제에서 상위 CLI와 runtime 계층을 구분한다.

## 기억할 경계

사용자가 보통 runc를 직접 호출해 컨테이너를 관리할 필요는 없다.

## 이 미션에서는 왜 필요한가

AI·데이터 도구와 개발·운영 환경을 선택하고, 결과·비용·장애를 정확한 기준으로 설명하는 데 필요합니다.

## 관련 용어

- `daemon-dockerd`
- `vm-vs-container`
