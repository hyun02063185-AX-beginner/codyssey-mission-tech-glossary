# DOM

## 한 줄 설명

DOM은 브라우저가 HTML 문서를 JavaScript가 읽고 조작할 수 있는 객체 트리로 표현한 것입니다.

## 쉽게 설명하면

HTML 원본을 브라우저가 화면 요소별로 정리한 뒤 JavaScript가 찾아서 바꿀 수 있게 만든 지도입니다.

## 정확한 설명

브라우저는 HTML source를 파싱해 노드의 트리 구조를 만듭니다. 이 DOM은 원본 HTML 문자열 자체가 아니라 현재 문서를 표현하는 객체 모델이며, JavaScript는 `querySelector`, `classList`, `textContent` 등으로 요소를 읽고 변경합니다.

DOM 업데이트는 화면 변경으로 이어집니다. M01에서는 메뉴 열기, 다크모드 클래스 전환, 폼 오류 문구, GitHub 결과 렌더링이 이벤트 또는 API 결과에서 DOM 변경으로 연결됩니다.

## 이 미션에서는 왜 필요한가

사용자 행동과 API 결과를 실제 화면 요소에 반영합니다.

## 코드 예

```js
document.querySelector('#menu').classList.toggle('open');
```

## 관련 용어

- html
- javascript
- add-event-listener
- dark-mode

## 흔한 오해

DOM은 서버 데이터베이스가 아니며, 사용자 입력을 `innerHTML`로 그대로 넣으면 위험할 수 있습니다.

## 동료평가 질문

HTML 파일을 다시 열지 않았는데 클릭 뒤 화면이 바뀌는 이유를 DOM으로 설명해 보세요.
