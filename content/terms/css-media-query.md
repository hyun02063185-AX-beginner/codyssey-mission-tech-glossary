# CSS Media Query

## 한 줄 설명

viewport나 사용자 환경 조건에 따라 CSS 규칙을 적용하는 문법.

## 쉽게 설명하면

"화면 너비가 768px 이하일 때만 이 규칙을 적용하라"처럼 조건을 붙여 CSS를 쓰는 문법입니다. 조건에 맞을 때만 안쪽 규칙이 켜집니다.

## 정확한 설명

width뿐 아니라 prefers-reduced-motion, color scheme 같은 환경도 다룬다.

## 이 미션에서는 왜 필요한가

이 회차는 768px와 1024px에서 배치가 바뀌는 반응형 화면을 요구하고, 그 경계를 만드는 문법이 이것입니다. 너비만 조건으로 쓸 수 있는 것이 아니라 사용자의 모션 설정 같은 환경도 조건이 되므로, 접근성 요구와도 이어집니다.

## 코드 예

```css
.nav { display: flex; gap: 24px; }

@media (max-width: 768px) {
  .nav { display: none; }          /* 모바일에서는 햄버거 메뉴로 */
  .nav-toggle { display: block; }
}

@media (min-width: 1024px) {
  .layout { grid-template-columns: 240px 1fr; }
}

/* 너비 말고도 조건이 된다 */
@media (prefers-reduced-motion: reduce) {
  * { animation: none; scroll-behavior: auto; }
}
```

## 관련 용어

- `css`
- `accessibility-a11y`
