# REST API

## 한 줄 설명

REST API는 리소스를 URI로 식별하고 HTTP의 일관된 인터페이스를 활용해 표현을 주고받는 API 설계 스타일입니다.

## 쉽게 설명하면

사용자·게시물 같은 대상을 주소로 구분하고, 정해진 HTTP 방식으로 조회하거나 바꾸는 API 설계 습관입니다.

## 정확한 설명

REST는 HTTP를 쓰는 모든 API의 다른 이름이 아닙니다. 리소스 중심 식별, 표현 전송, stateless 상호작용, 일관된 interface 같은 제약을 지향하는 아키텍처 스타일입니다. 실제 API는 요구사항에 따라 완전히 RESTful하지 않을 수 있으며, 중요한 것은 endpoint와 method, status, 오류 형식을 일관되게 설계하는 것입니다.

## 이 미션에서는 왜 필요한가

M06의 외부 API 호출과 M12의 백엔드 endpoint 설계에서 request/response 계약을 읽고 만듭니다.

## 관련 용어

- `http`
- `http-get`
- `http-post`
- `http-request-response`

## 흔한 오해

JSON을 반환하거나 URL을 쓴다고 자동으로 REST API가 되는 것은 아닙니다. 리소스와 HTTP 의미를 일관되게 사용하는지가 중요합니다.

## 동료평가 질문

`GET /users/42`와 `POST /users`가 서로 다른 의도를 어떻게 표현하나요?
