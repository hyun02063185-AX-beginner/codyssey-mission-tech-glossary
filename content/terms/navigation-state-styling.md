# Navigation State Styling

## 한 줄 설명

현재 route나 scroll 위치에 따라 navigation 모양을 바꾸는 UI 처리.

## 쉽게 설명하면

지금 보고 있는 메뉴 항목을 굵게 하거나, 스크롤을 내리면 상단 바에 그림자를 넣는 식의 처리입니다. 화면의 모양이 현재 상태를 알려 주게 만드는 일입니다.

## 정확한 설명

active state는 URL 또는 app state에서 계산하고 aria-current 같은 의미도 제공한다.

## 이 미션에서는 왜 필요한가

이 회차는 스크롤 위치에 따라 내비게이션이 반응하도록 요구합니다. 현재 위치를 색으로만 표시하면 색을 구분하기 어려운 사람에게는 정보가 전달되지 않으므로, 모양과 함께 의미도 표시해 두는 것이 함께 필요합니다.

## 코드 예

```javascript
const header = document.querySelector('.site-header');

// 스크롤 상태를 클래스로 옮기고, 모양은 CSS 가 정한다
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

// 현재 위치는 색뿐 아니라 의미로도 표시한다
for (const link of document.querySelectorAll('.nav a')) {
  if (link.getAttribute('href') === location.hash) {
    link.setAttribute('aria-current', 'page');
  }
}
```

## 관련 용어

- `client-side-routing`
- `accessibility-a11y`
