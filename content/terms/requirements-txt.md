# requirements.txt

## 한 줄 설명

Python 프로젝트가 설치에 필요한 패키지와 버전을 나열하는 관례적 의존성 파일입니다.

## 쉽게 설명하면

다른 사람이 같은 도구 상자를 준비할 수 있게 적어 둔 구매 목록입니다.

## 정확한 설명

`requirements.txt`는 보통 pip가 읽는 requirement specifier 목록이며, 직접 의존성만 쓸지 전이 의존성까지 고정할지는 프로젝트 재현성 정책에 따라 정합니다.

## 이 미션에서는 왜 필요한가

M12에서 서버 실행에 필요한 패키지를 동료·배포 환경에서 같은 방식으로 설치하게 합니다.

## 코드 예

```text
fastapi==0.115.0
uvicorn[standard]==0.30.0
```

## 관련 용어

- `python-virtual-environment`
- `pyproject-toml`
- `standard-library`
