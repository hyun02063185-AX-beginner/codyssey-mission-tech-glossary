# Bootstrap

## 한 줄 설명

미리 만든 CSS component와 utility를 제공하는 UI framework.

## 쉽게 설명하면

버튼·카드·그리드 같은 화면 조각의 CSS가 미리 만들어져 있는 묶음입니다. 정해진 클래스 이름을 붙이면 그 모양이 나옵니다.

## 정확한 설명

class 기반 스타일과 component를 제공하지만 접근성과 디자인 요구를 자동으로 충족하지는 않는다.

## 이 미션에서는 왜 필요한가

이 회차는 외부 UI 라이브러리를 쓰지 않도록 정하고 있고, 이것이 그 예시입니다. 레이아웃을 직접 짜 보는 것이 목표이기 때문인데, 왜 금지되는지 알려면 이것이 대신 해 주던 일이 무엇인지 알아야 합니다.

## 코드 예

```text
Bootstrap 이 대신 해 주던 것 = 이번에 직접 써 볼 것

  class="row" / "col-6"     →  display: grid 또는 flex
  class="btn btn-primary"   →  padding, border-radius, background
  class="d-none d-md-block" →  @media (min-width: 768px)

금지의 목적은 불편함이 아니라, 저 오른쪽을 한 번 써 보는 것이다.
```

## 관련 용어

- `css`
- `tailwind-css`
