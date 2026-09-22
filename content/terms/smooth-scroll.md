# 부드러운 스크롤

## 한 줄 설명

scroll 위치를 animation으로 이동시키는 동작.

## 쉽게 설명하면

한 번에 툭 이동하지 않고 스르륵 미끄러지듯 스크롤이 움직이는 동작입니다. 어디에서 어디로 갔는지 보이게 해 줍니다.

## 정확한 설명

CSS scroll-behavior 또는 scrollTo로 구현하되 motion 민감 사용자의 설정을 존중한다.

## 이 미션에서는 왜 필요한가

이 회차의 페이지 내 이동에 쓰이지만, 움직임에 민감한 사람에게는 어지럼증을 일으킬 수 있습니다. 운영체제에 "움직임 줄이기"를 켜 둔 사용자가 있으므로 그 설정을 확인하고 끄는 처리가 함께 필요합니다.

## 코드 예

```css
html { scroll-behavior: smooth; }

/* 사용자가 움직임을 줄여 달라고 설정했다면 존중한다 */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

/* JavaScript 로 할 때도 같은 판단이 필요하다
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
*/
```

## 관련 용어

- `scroll-to-top`
- `css-media-query`
