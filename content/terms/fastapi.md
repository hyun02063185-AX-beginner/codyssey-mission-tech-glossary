# FastAPI

## 한 줄 설명

FastAPI는 Python 함수로 HTTP API를 만들 수 있게 해 주는 웹 프레임워크입니다.

## 쉽게 설명하면

브라우저나 앱이 `/todos`로 요청하면 어떤 함수를 실행하고 어떤 JSON을 돌려줄지 Python 코드로 정하는 도구입니다.

## 코드 예

```python
from fastapi import FastAPI
app = FastAPI()

@app.get('/health')
def health():
    return {'ok': True}
```

## 정확한 설명

FastAPI는 경로와 HTTP 메서드를 함수에 연결하고, 타입 힌트를 이용해 요청 데이터 검증과 API 문서를 지원합니다. ASGI 서버에서 실행하며, 데이터베이스·인증·배포 기능을 자동으로 대신해 주지는 않습니다. 필요한 기능은 라이브러리와 애플리케이션 코드로 조합합니다.

## 이 미션에서는 왜 필요한가

본과정 M12에서 백엔드 API를 만들고, M13에서 인증과 권한 기능을 확장합니다.

## 관련 용어

- rest-api
- asgi
- sqlalchemy
- authentication

## 흔한 오해

FastAPI가 REST 규칙이나 보안을 자동으로 보장하지는 않습니다. 경로 설계, 인증, 오류 처리는 서비스가 직접 결정합니다.

## 동료평가 질문

`@app.get('/health')`는 어떤 요청을 어떤 함수에 연결하나요?
