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

예비 M01에서 도커 안쪽이 한 덩이가 아니라는 것을 보여 주는 계층입니다. 도커 명령 아래에 컨테이너를 관리하는 층과 실제로 실행하는 층이 따로 있어, 문제가 어느 층에서 났는지 나눠 볼 수 있습니다.

## 코드 예

```text
docker CLI  →  dockerd  →  containerd  →  runc  →  프로세스
  명령 전달     요청 처리     수명 관리      실제 실행

다른 도구가 도커 없이도 containerd 를 쓸 수 있는 이유가 이 구조다
```

## 관련 용어

- `daemon-dockerd`
- `vm-vs-container`
