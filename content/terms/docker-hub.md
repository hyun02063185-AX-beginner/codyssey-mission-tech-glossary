# 레지스트리

## 한 줄 설명

컨테이너 이미지를 저장·배포하는 Docker의 공개·비공개 레지스트리 서비스.

## 쉽게 설명하면

다른 사람이 만든 이미지나 팀 이미지를 내려받는 창고다.

## 정확한 설명

image name과 tag 또는 digest로 이미지를 식별하고 pull/push 권한을 관리한다.

## 언제 쓰나

`docker pull redis`로 기본 이미지를 가져온다.

## 기억할 경계

tag는 바뀔 수 있으므로 재현성에는 immutable digest가 더 적합하다.

## 이 미션에서는 왜 필요한가

예비 M01에서 `docker run nginx` 한 줄이 어디서 이미지를 가져오는지에 대한 답입니다. 이름만 적으면 기본 레지스트리에서 받아오므로, 받아온 것이 무엇인지 확인하는 습관이 필요합니다.

## 코드 예

```bash
docker pull nginx:alpine       # 기본 레지스트리에서 받는다
docker images                  # 받아 둔 이미지 목록

# 이름만 적으면 docker.io/library/nginx 로 해석된다
```

## 관련 용어

- `compose`
- `layer`
