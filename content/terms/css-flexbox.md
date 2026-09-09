# Flexbox

## 한 줄 설명

Flexbox는 한 방향의 요소를 정렬하고 남는 공간을 분배하는 CSS 레이아웃 방식입니다.

## 쉽게 설명하면

메뉴처럼 한 줄 또는 한 열에 있는 항목을 나란히 놓고 간격과 정렬을 맞추기 좋습니다.

## 정확한 설명

`display: flex`가 적용된 컨테이너는 주축과 교차축을 기준으로 자식 요소를 배치합니다. `justify-content`, `align-items`, `gap`, `flex-wrap`은 공간 분배와 정렬을 제어합니다.

Flexbox도 줄바꿈이 가능하지만 복잡한 행·열 격자를 설계하는 도구는 아닙니다. M01에서는 내비게이션처럼 한 축 중심의 관계를 드러낼 때 쓰고, 프로젝트 카드의 2차원 배치는 Grid와 구분합니다.

## 이 미션에서는 왜 필요한가

화면 폭 변화에도 내비게이션 항목이 정렬·줄바꿈되도록 합니다.

## 코드 예

```css
nav { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
```

## 관련 용어

- css-grid
- responsive-web-design
- breakpoint

## 흔한 오해

Flexbox가 Grid를 완전히 대체하는 것은 아닙니다. 둘은 주로 해결하려는 차원이 다릅니다.

## 동료평가 질문

M01 내비게이션에는 Flexbox가, 프로젝트 카드에는 Grid가 더 알맞을 수 있는 이유는 무엇인가요?
