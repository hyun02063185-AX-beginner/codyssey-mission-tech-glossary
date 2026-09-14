# dependency injection

## 한 줄 설명

Dependency Injection은 객체나 함수가 필요한 의존성을 내부에서 직접 만들지 않고, 외부에서 전달받도록 구성하는 방식입니다.

## 쉽게 설명하면

요리사가 냄비를 직접 사 오지 않고, 주방에서 준비해 준 냄비를 받아 쓰는 구조입니다.

## 정확한 설명

의존성은 데이터베이스 세션, 설정, 서비스 객체처럼 코드가 일을 하기 위해 사용하는 외부 협력자입니다. DI는 생성과 사용의 책임을 분리해 테스트에서 대체 객체를 넣고, 설정을 한 곳에서 관리하기 쉽게 합니다. DI 컨테이너나 프레임워크 기능은 구현 수단일 뿐, DI 자체와 같은 뜻은 아닙니다.

## 이 미션에서는 왜 필요한가

M12에서 FastAPI가 요청 처리 함수에 필요한 값이나 서비스를 주입하는 구조를 읽고 테스트 가능한 서버 코드를 만듭니다.

## 코드 예

```py
def get_user(user_id: int, repository):
    return repository.find(user_id)
```

## 관련 용어

- `fastapi`
- `database-session`
- `request-response-cycle`
- `environment-variable`

## 흔한 오해

매개변수를 받는 모든 함수가 DI인 것은 아닙니다. 핵심은 필요한 협력자의 생성 책임을 사용하는 코드 밖으로 분리하는 데 있습니다.

## 동료평가 질문

repository를 외부에서 주입하면 단위 테스트에서 무엇을 바꾸기 쉬워지나요?
