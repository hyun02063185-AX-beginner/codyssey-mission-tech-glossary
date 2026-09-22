# Tailwind CSS

## 한 줄 설명

utility class 조합으로 UI를 스타일링하는 CSS framework.

## 쉽게 설명하면

`p-4 flex gap-2`처럼 한 가지 속성만 담당하는 짧은 클래스를 여러 개 붙여 스타일을 만드는 방식입니다. CSS 파일을 따로 열지 않고 태그 옆에서 모양을 정합니다.

## 정확한 설명

build 단계에서 사용한 class를 분석해 CSS를 만들며 긴 class 조합의 경계를 관리해야 한다.

## 이 미션에서는 왜 필요한가

이 회차에서 쓰지 않도록 정한 도구입니다. 빌드 단계가 필요하고, 클래스 이름 뒤에 어떤 CSS가 생성되는지 보이지 않기 때문입니다. 이번에는 그 CSS를 직접 씁니다.

## 코드 예

```text
Tailwind 의 클래스 = 실제로 생성되는 CSS

  p-4        →  padding: 1rem;
  flex       →  display: flex;
  gap-2      →  gap: 0.5rem;
  md:hidden  →  @media (min-width: 768px) { display: none; }

이번 회차에서는 오른쪽을 직접 쓴다.
왼쪽은 오른쪽을 줄여 쓴 것이지 다른 기술이 아니다.
```

## 관련 용어

- `css`
- `bootstrap`
