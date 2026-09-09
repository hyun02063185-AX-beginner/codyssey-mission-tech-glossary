# DOM

## 한 줄 설명

DOM은 브라우저가 HTML을 파싱해 만든 문서의 객체 트리 표현으로, JavaScript가 문서 구조와 내용을 읽고 바꾸는 인터페이스입니다.

## 쉽게 설명하면

HTML 원본을 브라우저가 화면 요소별로 정리한 뒤 JavaScript가 찾아서 바꿀 수 있게 만든 지도입니다.

## 정확한 설명

DOM(Document Object Model)은 HTML/XML 문서를 node 객체들의 트리로 다루는 표준(WHATWG DOM)입니다. 브라우저는 HTML 소스를 파싱해 DOM 트리를 메모리에 구성합니다. DOM은 정적 파일이 아니라 메모리 위의 객체 트리로, JavaScript가 노드를 수정하면 변경이 트리에 즉시 반영됩니다. JavaScript는 `document.querySelector` 같은 DOM API로 노드를 조회하고 `textContent`·`classList` 등으로 수정해 화면을 갱신합니다. HTML 소스 파일과 DOM은 같은 문서의 서로 다른 표현이며, DOM은 브라우저의 파싱 보정과 런타임 변경이 반영된 결과입니다. DOM은 JavaScript 언어의 일부가 아니라 브라우저가 제공하는 Web API입니다.

## 동작 원리

- 브라우저가 HTML을 읽으면 토큰 → 노드 → 트리 순서로 DOM을 점진적으로 구성합니다. 누락된 태그 등은 파서 단계에서 브라우저가 보정합니다(예: 표에 tbody 자동 삽입).
- DOM은 live 자료구조입니다. JavaScript가 노드를 수정하면 그 변경이 트리에 즉시 반영되고, 이후 그 노드를 참조하면 바뀐 상태를 읽습니다.
- CSSOM 생성, 렌더 트리 결합, layout, paint는 DOM 정의의 일부가 아니라 DOM 이후에 이어지는 브라우저 렌더링 단계입니다. DOM은 그 파이프라인의 첫 단계 산출물입니다.
- M01에서는 메뉴 열기, 다크모드 클래스 전환, 폼 오류 문구, GitHub 결과 렌더링이 이벤트·API 결과에서 DOM 변경으로 연결됩니다.

## 이 미션에서는 왜 필요한가

사용자 행동과 API 결과를 실제 화면 요소에 반영합니다. 메뉴·폼·카드 같은 요소를 JavaScript로 찾아 내용을 바꾸고 이벤트를 연결하려면, HTML 소스가 아니라 브라우저가 만든 DOM을 다뤄야 합니다.

## 코드 예

```js
const title = document.querySelector('h1'); // 노드 조회
title.textContent = '반가워요!';            // 텍스트 변경
title.classList.add('accent');              // 클래스 추가
```

## 주의할 점 / 경계 조건

- script가 HTML 파싱 전에 실행되면 아직 DOM에 없는 요소를 조회해 null이 됩니다 — defer나 body 끝 배치가 필요합니다.
- 반복적인 DOM 수정은 렌더링 비용이 큽니다. 변경을 모아서 처리하는 편이 좋습니다.
- `innerHTML`은 문자열을 HTML로 삽입합니다. 사용자 입력을 그대로 넣으면 XSS 위험이 있습니다.

## 흔한 오해

HTML 파일과 DOM을 같은 것으로 생각합니다. DOM은 브라우저가 HTML을 파싱해 메모리에 만든 객체 트리로, 브라우저의 보정과 런타임 변경이 반영된 결과입니다. "DOM은 JavaScript가 문서를 조작하는 통로"라는 표현이 더 정확합니다. DOM은 서버 데이터베이스도 아닙니다.

## 비슷한 개념과의 차이

- **HTML 소스**: 작성한 텍스트 파일 — 파싱의 입력입니다.
- **DOM**: 파싱된 결과물(객체 트리) — 조회·수정의 대상입니다.
- **Virtual DOM**: React가 성능을 위해 메모리에 유지하는 DOM의 경량 복제본입니다.

## 관련 용어

- html
- javascript
- add-event-listener
- browser-rendering
- virtual-dom-rendering
- dark-mode

## 동료평가 질문

HTML 파일을 다시 열지 않았는데 클릭 뒤 화면이 바뀌는 이유를 DOM으로 설명해 보세요. querySelector로 요소를 찾지 못하는 대표적인 원인은 무엇인가요?
