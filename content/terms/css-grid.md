# Grid

## 한 줄 설명

CSS Grid는 행과 열을 함께 정의해 2차원 콘텐츠 배치를 만드는 CSS 레이아웃 방식입니다.

## 쉽게 설명하면

여러 장의 프로젝트 카드를 표처럼 행과 열에 맞춰 정돈하는 도구입니다.

## 정확한 설명

`display: grid` 컨테이너는 명시적 또는 암시적 행과 열을 가지며, `grid-template-columns`와 `gap`으로 반복되는 카드의 폭과 간격을 정의할 수 있습니다. 항목은 정해진 grid track을 따라 배치됩니다.

M01의 카드 목록은 폭에 따라 한 열에서 여러 열로 바뀌는 2차원 구조입니다. Grid는 각 카드의 개별 margin을 조절하는 대신, 전체 배치 규칙을 한 곳에서 읽게 합니다.

## 이 미션에서는 왜 필요한가

프로젝트 카드가 카드 수와 화면 폭이 달라도 균형 있게 배치되게 합니다.

## 코드 예

```css
.projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: 1rem; }
```

## 관련 용어

- css-flexbox
- responsive-web-design
- breakpoint

## 흔한 오해

Grid는 카드 안의 모든 작은 정렬까지 반드시 담당해야 하는 도구는 아닙니다.

## 동료평가 질문

프로젝트 카드 목록의 행과 열 관계를 Grid가 어떻게 더 분명하게 보여 주나요?
