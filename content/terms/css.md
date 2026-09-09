# CSS

## 한 줄 설명

CSS는 HTML 요소의 색, 간격, 배치, 화면 크기별 표현을 정하는 스타일 언어입니다.

## 쉽게 설명하면

HTML로 만든 뼈대에 글자 크기, 카드 간격, 배경색처럼 보이는 규칙을 입히는 역할입니다.

## 정확한 설명

CSS는 선택자로 DOM 요소를 고르고 선언 블록으로 스타일 규칙을 적용합니다. 같은 요소에 여러 규칙이 적용되면 cascade, specificity, 상속 규칙에 따라 최종 표현이 결정됩니다.

레이아웃에는 Flexbox와 Grid를, 화면 폭 변화에는 media query를 사용할 수 있습니다. 구조는 HTML에, 상호작용 상태 변경은 JavaScript에 두어 역할을 분리하는 것이 M01의 코드 제약과도 맞습니다.

## 이 미션에서는 왜 필요한가

반응형 카드·내비게이션, 다크모드의 색 대비, 콘텐츠 간격을 구현합니다.

## 코드 예

```css
.projects { display: grid; gap: 1rem; }
```

## 관련 용어

- css-flexbox
- css-grid
- responsive-web-design
- dark-mode

## 흔한 오해

CSS는 단순 장식이 아닙니다. 읽기 쉬움, 조작 가능성, 화면 크기 적응에도 직접 영향을 줍니다.

## 동료평가 질문

M01에서 inline style 대신 별도 CSS 규칙을 두면 무엇이 좋아지나요?
