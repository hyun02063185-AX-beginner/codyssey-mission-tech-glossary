# JavaScript

## 한 줄 설명

JavaScript는 ECMAScript 표준을 따르는 범용 프로그래밍 언어로, 브라우저에서는 DOM·이벤트·Web API와 함께 웹페이지에 동작을 더합니다.

## 쉽게 설명하면

버튼 클릭, 폼 입력, 스크롤처럼 사용자가 한 행동을 받아 페이지가 반응하도록 만드는 코드입니다.

## 정확한 설명

JavaScript는 ECMAScript(ECMA-262) 표준을 따르는 동적 타입 프로그래밍 언어입니다. 브라우저에서 가장 널리 쓰이지만 Node.js 같은 런타임으로 서버·CLI 등 브라우저 밖에서도 실행되는 범용 언어입니다. 브라우저 환경에서 JavaScript는 DOM 조작, 이벤트 처리, fetch 같은 Web API 호출, 비동기 처리(event loop)를 통해 페이지를 동적으로 만듭니다. HTML이 구조, CSS가 표현을 담당한다면 JavaScript는 상태 변화와 동작을 담당합니다. Java와는 이름만 비슷한 별개의 언어입니다.

## 동작 원리

- 브라우저의 JavaScript 엔진이 스크립트를 파싱하고 컴파일한 뒤 실행합니다.
- 단일 스레드 + event loop 모델입니다. 시간이 걸리는 작업(타이머, 네트워크)은 완료 후 콜백·Promise로 이어서 처리하므로, 기다리는 동안 페이지가 멈추지 않습니다.
- `script` 태그 또는 모듈로 로드되며, 실행 시점은 문서에서의 위치와 defer/async 속성에 따라 달라집니다.

## 이 미션에서는 왜 필요한가

M01의 핵심 흐름은 사용자 이벤트 → `addEventListener` → 이벤트 핸들러 → 상태 변경 → DOM 업데이트입니다. 메뉴, 다크모드, 폼 검증, GitHub API 결과 표시와 상태 UI를 모두 JavaScript로 구현합니다.

## 코드 예

```js
// DOM 요소를 찾아 이벤트를 연결하고 화면을 바꾸는 기본 패턴
const button = document.querySelector('#theme-toggle');
button.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
```

## 주의할 점 / 경계 조건

- HTML 파싱 중 실행되는 스크립트는 아직 생성되지 않은 요소를 찾을 수 없습니다 — defer 속성이나 적절한 배치가 필요합니다.
- 동적 타입 언어라 타입 관련 오류가 런타임에 드러납니다. 값의 타입을 확인하는 습관이 필요합니다.
- 브라우저·런타임마다 지원하는 문법이 다를 수 있으므로 사용하는 기능의 호환성을 확인해야 합니다.

## 흔한 오해

"JavaScript는 웹페이지에서만 쓰는 언어"라는 입문 설명을 전체로 오해합니다. Node.js 등으로 서버·데스크톱·CLI에서도 실행되는 범용 언어입니다. JavaScript는 Java의 줄임말이 아니며, HTML이나 CSS를 대체하는 언어도 아닙니다.

## 비슷한 개념과의 차이

- **TypeScript**: JavaScript에 정적 타입을 더한 언어로, 컴파일하면 JavaScript가 됩니다.
- **Java**: 이름만 유사한 별개의 언어입니다.
- **HTML/CSS**: 마크업·스타일 언어로, 프로그래밍 언어가 아닙니다.

## 관련 용어

- html
- css
- dom
- defer
- fetch-api
- event-loop
- typescript

## 동료평가 질문

M01에서 이벤트부터 DOM 업데이트까지의 흐름을 한 기능으로 설명해 보세요. JavaScript가 브라우저 밖에서도 쓰이는 예를 하나 들어 보세요.
