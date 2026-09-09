# addEventListener

## 한 줄 설명

addEventListener는 click·submit 같은 이벤트가 발생했을 때 실행할 함수를 DOM 요소에 등록하는 메서드입니다.

## 쉽게 설명하면

버튼에 "클릭하면 이 일을 해"라는 반응 규칙을 연결하는 방법입니다.

## 정확한 설명

이벤트 리스너는 대상 요소, 이벤트 타입, 처리 함수를 연결합니다. 이벤트가 발생하면 브라우저의 이벤트 흐름 안에서 handler가 실행되고, 필요한 경우 `preventDefault()`로 기본 동작을 제어할 수 있습니다.

M01은 inline `onclick` 대신 addEventListener로 HTML 구조와 JavaScript 동작을 분리합니다. 초기화가 여러 번 실행되면 같은 리스너를 중복 등록하지 않도록 주의합니다.

## 이 미션에서는 왜 필요한가

메뉴·테마 토글·폼 제출을 상태와 DOM 업데이트로 연결합니다.

## 코드 예

```js
button.addEventListener('click', handleThemeToggle);
```

## 관련 용어

- javascript
- dom
- form-validation

## 흔한 오해

이벤트 리스너는 HTML에 onclick 속성을 쓰는 것과 달리 구조와 동작을 분리할 수 있습니다.

## 동료평가 질문

addEventListener를 쓰면 inline onclick보다 무엇을 관리하기 쉬운가요?
