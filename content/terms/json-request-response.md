# JSON Request/Response

## 한 줄 설명

JSON Request/Response는 HTTP request 또는 response의 body에 JSON 형식 데이터를 담아 주고받는 방식입니다.

## 쉽게 설명하면

서버와 클라이언트가 서로 읽을 수 있는 정해진 데이터 양식으로 정보를 교환하는 것입니다.

## 정확한 설명

JSON은 문자열, 숫자, 불리언, 배열, 객체 등을 표현하는 데이터 형식입니다. HTTP에서 JSON body를 보낼 때는 보통 `Content-Type: application/json`을 명시합니다. JSON 문법이 맞아도 API가 기대한 필드·자료형·권한 규칙까지 만족한다는 보장은 없으므로 schema와 입력 검증이 필요합니다.

## 이 미션에서는 왜 필요한가

M06의 AI API와 M01의 GitHub API 응답을 파싱하고, 화면이나 후속 요청에 필요한 데이터를 구분합니다.

## 코드 예

```js
const response = await fetch('/api/profile');
const profile = await response.json();
```

## 관련 용어

- `json`
- `http-request-response`
- `fetch-api`
- `schema`

## 흔한 오해

JSON response를 받았다고 데이터가 신뢰할 수 있거나 완전하다는 뜻은 아닙니다. 상태 코드·필수 필드·오류 형식을 함께 확인해야 합니다.

## 동료평가 질문

`response.json()`을 호출하기 전에 HTTP 상태를 확인해야 하는 이유는 무엇인가요?
