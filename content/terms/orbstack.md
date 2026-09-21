# OrbStack

## 한 줄 설명

macOS에서 컨테이너와 Linux VM을 실행·관리하는 개발 도구.

## 쉽게 설명하면

Mac에서 Docker 호환 컨테이너 환경을 빠르게 쓰기 위한 도구다.

## 정확한 설명

VM, Linux machine, Docker API 호환성, 파일 공유를 제공하며 실제 동작은 설치 버전과 설정에 의존한다.

## 언제 쓰나

로컬에서 compose 서비스를 실행한다.

## 기억할 경계

Docker Desktop과 명령 호환이 있어도 모든 운영 특성이 동일하지는 않다.

## 이 미션에서는 왜 필요한가

예비 M01 문서가 관리자 권한 제약에 걸릴 때의 대안으로 안내하는 도구입니다. 도커 명령을 그대로 쓸 수 있으므로 실습 내용은 달라지지 않고, 무엇으로 실행했는지만 환경 기재에 적으면 됩니다.

## 코드 예

```bash
docker ps        # 명령과 옵션은 그대로
docker info | grep -i "server version"

# 실행 환경 기재에 어떤 도구로 도커를 띄웠는지 적는다
```

## 관련 용어

- `compose`
- `vm-vs-container`
