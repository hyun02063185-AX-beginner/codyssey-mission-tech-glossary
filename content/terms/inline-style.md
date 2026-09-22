# 인라인 스타일

## 한 줄 설명

HTML element의 style attribute에 CSS 선언을 직접 쓰는 방식.

## 쉽게 설명하면

태그 안에 `style="color: red"`처럼 스타일을 직접 적는 방식입니다. 한 곳만 급히 바꿀 때는 빠르지만, 같은 모양을 여러 곳에 쓰려면 그만큼 복사해야 합니다.

## 정확한 설명

재사용과 media query 설계를 어렵게 하므로 예외적인 한 요소 스타일인지 판단한다.

## 이 미션에서는 왜 필요한가

이 회차는 인라인 스타일을 쓰지 않도록 정하고 있습니다. 화면 너비에 따라 배치를 바꾸려면 미디어 쿼리가 필요한데 인라인 스타일에는 미디어 쿼리를 쓸 수 없고, 나중에 색 하나를 바꾸려 해도 파일 전체에서 찾아야 하기 때문입니다.

## 코드 예

```html
<!-- 이렇게 쓰면 768px 에서 배치를 바꿀 방법이 없다 -->
<div style="display: flex; gap: 16px">…</div>

<!-- 클래스로 빼면 미디어 쿼리를 걸 수 있다 -->
<div class="card-row">…</div>

<style>
.card-row { display: flex; gap: 16px; }
@media (max-width: 768px) {
  .card-row { display: block; }
}
</style>
```

## 관련 용어

- `css-cascade`
- `css-media-query`
