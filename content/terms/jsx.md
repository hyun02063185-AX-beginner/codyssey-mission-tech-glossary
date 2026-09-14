# JSX

## 한 줄 설명

JSX는 JavaScript 코드 안에서 React 화면 구조를 HTML처럼 적을 수 있게 만든 문법 확장입니다.

## 쉽게 설명하면

`<Button label="저장" />`처럼 화면 모양을 적지만, 브라우저가 HTML 파일로 그대로 읽는 문법은 아닙니다.

## 정확한 설명

빌드 도구는 JSX를 JavaScript 함수 호출 형태로 변환합니다. JSX 안에서는 `class` 대신 `className`을 쓰고, 중괄호로 JavaScript 값을 넣을 수 있습니다. 사용자 입력을 JSX 텍스트로 출력하면 React가 기본적으로 이스케이프하지만, 위험한 HTML 삽입 API는 별도로 주의해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서 React 컴포넌트의 화면 구조와 조건부 렌더링을 작성합니다.

## 관련 용어

- react
- reusable-component
- xss

## 흔한 오해

JSX는 HTML과 닮았지만 완전히 같지 않습니다. JSX는 JavaScript 안에서 컴포넌트를 표현하는 문법입니다.

## 동료평가 질문

JSX에서 `{user.name}`처럼 중괄호를 쓰는 이유는 무엇인가요?
