# JavaScript

## 한 줄 설명

JavaScript는 브라우저에서 사용자 행동과 외부 데이터에 따라 화면 상태를 바꾸는 프로그래밍 언어입니다.

## 쉽게 설명하면

버튼 클릭, 폼 입력, 스크롤처럼 사용자가 한 행동을 받아 페이지가 반응하도록 만드는 코드입니다.

## 정확한 설명

브라우저의 JavaScript는 이벤트를 받고 함수를 실행해 값이나 DOM 요소의 클래스·텍스트·속성을 바꿀 수 있습니다. HTML이 구조, CSS가 표현을 담당한다면 JavaScript는 상태 변화와 동작을 담당합니다.

M01의 핵심 흐름은 사용자 이벤트 → `addEventListener` → 이벤트 핸들러 → 상태 변경 → DOM 업데이트입니다. GitHub API처럼 시간이 걸리는 작업에서는 `fetch`와 `async/await`로 비동기 결과를 처리합니다. JavaScript와 Java는 다른 언어입니다.

## 이 미션에서는 왜 필요한가

메뉴, 다크모드, 폼 검증, GitHub API 결과와 상태 UI를 구현합니다.

## 코드 예

```js
button.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
```

## 관련 용어

- dom
- add-event-listener
- fetch-api
- async-await

## 흔한 오해

JavaScript는 Java의 줄임말이 아니며, HTML이나 CSS를 대체하는 언어도 아닙니다.

## 동료평가 질문

M01에서 이벤트부터 DOM 업데이트까지의 흐름을 한 기능으로 설명해 보세요.
