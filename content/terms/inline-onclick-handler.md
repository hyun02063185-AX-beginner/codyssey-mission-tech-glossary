# inline onclick handler

## 한 줄 설명

HTML attribute에 JavaScript를 직접 적는 이벤트 처리 방식.

## 쉽게 설명하면

버튼 태그 안에 `onclick="doSomething()"`처럼 동작을 바로 적는 방식입니다. 동작하는 코드가 화면 구조 사이에 섞이므로, 나중에 그 버튼이 무슨 일을 하는지 찾으려면 HTML을 뒤져야 합니다.

## 정확한 설명

markup과 behavior를 결합해 테스트·재사용·CSP 관리가 어려워질 수 있다.

## 이 미션에서는 왜 필요한가

이 회차는 이 방식을 피하도록 안내합니다. 전역 함수 이름에 의존하기 때문에 모듈로 나눈 스크립트에서는 함수를 찾지 못하고, 같은 버튼에 동작을 두 개 붙이는 것도 어렵습니다.

## 코드 예

```html
<!-- 전역에 doSubmit 이 없으면 조용히 실패한다 -->
<button onclick="doSubmit()">보내기</button>

<!-- 스크립트 쪽에서 붙이면 모듈 안의 함수도 쓸 수 있다 -->
<button id="submit">보내기</button>

<script type="module">
  import { doSubmit } from './form.js';
  document.getElementById('submit').addEventListener('click', doSubmit);
</script>
```

## 관련 용어

- `add-event-listener`
- `interaction`
