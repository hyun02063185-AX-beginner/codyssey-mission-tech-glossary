# 스크롤 탑

## 한 줄 설명

긴 페이지에서 현재 scroll 위치를 문서 맨 위로 이동시키는 UI 동작.

## 쉽게 설명하면

긴 페이지를 한참 내려간 뒤 맨 위로 되돌아가는 버튼입니다. 누르면 문서 처음으로 이동합니다.

## 정확한 설명

keyboard 동작과 reduced-motion 선호를 고려해 구현한다.

## 이 미션에서는 왜 필요한가

이 회차의 스크롤 인터랙션 중 하나입니다. 스크롤 위치만 되돌리면 눈으로 보는 사람에게는 충분하지만 키보드 초점은 그대로 남아 있어서, 탭을 누르면 화면 아래쪽 요소로 이동해 버립니다. 위치와 초점을 함께 옮겨야 합니다.

## 코드 예

```javascript
const button = document.querySelector('.to-top');

button.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 화면만 올리면 키보드 초점은 아래에 남는다
  const first = document.querySelector('h1');
  first.setAttribute('tabindex', '-1');
  first.focus({ preventScroll: true });
});

// 아래로 어느 정도 내려간 뒤에만 버튼을 보인다
window.addEventListener('scroll', () => {
  button.hidden = window.scrollY < 400;
}, { passive: true });
```

## 관련 용어

- `smooth-scroll`
- `accessibility-a11y`
