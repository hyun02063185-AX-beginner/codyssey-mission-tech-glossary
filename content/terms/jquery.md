# jQuery

## 한 줄 설명

DOM 선택·이벤트·Ajax API를 제공한 JavaScript library.

## 쉽게 설명하면

`$("#id")`처럼 짧은 문법으로 요소를 고르고 이벤트를 붙이던 라이브러리입니다. 브라우저마다 문법이 달랐던 시절에 그 차이를 덮어 주는 역할을 했습니다.

## 정확한 설명

유지보수 프로젝트에는 남아 있을 수 있지만 modern DOM API와 framework에 중복 도입할 필요는 없다.

## 이 미션에서는 왜 필요한가

이 회차에서 쓰지 않도록 정한 라이브러리이며, 지금은 브라우저가 제공하는 기능만으로 같은 일을 할 수 있기 때문입니다. 기존 코드를 읽을 때는 여전히 만나게 되므로, 대응되는 표준 문법을 알아 두면 옮겨 적을 수 있습니다.

## 코드 예

```javascript
// jQuery                       // 브라우저 기본 기능
// $('#app')                    document.querySelector('#app')
// $('.card')                   document.querySelectorAll('.card')
// $el.on('click', fn)          el.addEventListener('click', fn)
// $el.addClass('on')           el.classList.add('on')
// $.get(url, fn)               fetch(url).then(r => r.json())

document.querySelectorAll('.card').forEach(el => {
  el.addEventListener('click', () => el.classList.toggle('open'));
});
```

## 관련 용어

- `dom`
- `add-event-listener`
