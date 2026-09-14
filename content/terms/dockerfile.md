# Dockerfile

## 한 줄 설명

Dockerfile은 어떤 이미지와 파일, 명령으로 Docker 이미지를 만들지 적어 둔 텍스트 파일입니다.

## 쉽게 설명하면

`FROM`, `COPY`, `RUN`, `CMD`를 순서대로 적어 실행 환경을 재현하는 조리법입니다.

## 코드 예

```dockerfile
FROM python:3.10-slim
COPY . /app
CMD ["python", "/app/main.py"]
```

## 정확한 설명

`docker build`는 Dockerfile 명령을 읽어 이미지 레이어를 만듭니다. `FROM`은 바탕 이미지, `COPY`는 파일 복사, `RUN`은 빌드 중 실행할 명령, `CMD`는 컨테이너를 시작할 때 기본으로 실행할 명령을 정합니다. 민감한 값은 Dockerfile에 직접 적지 않고 실행 시 환경 변수로 전달하는 편이 안전합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 직접 Dockerfile을 작성해 커스텀 이미지를 만들고 실행 근거를 남깁니다.

## 관련 용어

- docker
- docker-image
- docker-container
- environment-variable

## 흔한 오해

Dockerfile은 컨테이너 하나를 뜻하지 않습니다. 여러 컨테이너를 만들 수 있는 이미지를 정의합니다.

## 동료평가 질문

`RUN`과 `CMD`는 언제 실행되는지 어떻게 다른가요?
