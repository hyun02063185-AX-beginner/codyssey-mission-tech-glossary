# Event Handler

## 한 줄 설명

Event Handler는 클릭·입력·제출 같은 이벤트가 발생했을 때 실행하도록 등록한 함수입니다.

## 쉽게 설명하면

버튼을 눌렀을 때 무엇을 할지 적어 둔 반응 함수입니다.

## 정확한 설명

이벤트 핸들러는 이벤트 대상, 이벤트 타입, 함수의 연결로 동작합니다. 브라우저가 이벤트를 전달하면 함수는 이벤트 객체를 받아 대상·입력값·기본 동작 등을 확인하거나 제어할 수 있습니다. 등록은 `addEventListener`로 하는 방식이 일반적이며, 함수 자체와 등록 방법은 구분해야 합니다.

## 동작 원리

- 사용자의 클릭·키 입력 또는 브라우저 이벤트가 발생합니다.
- 등록된 핸들러가 이벤트 흐름 안에서 호출됩니다.
- 핸들러는 상태를 바꾸거나 DOM을 갱신하고, 필요하면 기본 동작을 막습니다.

## 이 미션에서는 왜 필요한가

M01의 테마 전환, 메뉴 조작, 폼 검증처럼 사용자 행동을 화면 변화로 연결합니다.

## 코드 예

```js
button.addEventListener('click', (event) => {
  event.currentTarget.classList.toggle('is-active');
});
```

## 관련 용어

- `add-event-listener`
- `user-event`
- `event-propagation`
- `prevent-default`

## 흔한 오해

이벤트 핸들러는 이벤트가 일어나는 대상 그 자체가 아닙니다. 대상은 버튼 같은 DOM 요소이고, 핸들러는 그 반응을 구현한 함수입니다.

## 동료평가 질문

`event.target`과 `event.currentTarget`이 다른 상황은 언제 생길 수 있나요?
