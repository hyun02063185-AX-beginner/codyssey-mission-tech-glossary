# preventDefault

## 한 줄 설명

`preventDefault()`는 링크 이동이나 폼 제출처럼 브라우저가 원래 하려던 기본 동작을 취소하는 Event 메서드입니다.

## 쉽게 설명하면

폼의 제출 버튼을 눌러도 페이지를 바로 이동시키지 않고, 먼저 JavaScript로 입력값을 검사하게 할 때 씁니다.

## 코드 예

```js
form.addEventListener('submit', (event) => {
  event.preventDefault();
  validateAndSave();
});
```

## 정확한 설명

폼의 submit 이벤트에서 이 메서드를 호출하면 브라우저가 즉시 페이지를 새로 보내는 기본 동작을 막고 JavaScript 검증을 먼저 할 수 있습니다. 이벤트가 부모 요소로 전달되는 흐름은 그대로 남습니다. 부모 리스너까지 막고 싶다면 전파 제어를 별도로 고려해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M01에서 폼을 제출하기 전에 클라이언트 측 입력 검증과 오류 메시지를 보여 줍니다.

## 관련 용어

- event-propagation
- event-handler
- form-validation

## 흔한 오해

`preventDefault()`는 `stopPropagation()`과 다릅니다. 전자는 기본 동작, 후자는 이벤트 이동 흐름에 관한 메서드입니다.

## 동료평가 질문

폼 제출에서 `preventDefault()`를 호출하지 않으면 어떤 일이 먼저 일어날 수 있나요?
