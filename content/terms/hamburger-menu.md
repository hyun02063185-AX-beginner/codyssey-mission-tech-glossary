# 햄버거 메뉴

## 한 줄 설명

작은 화면에서 navigation 항목을 접었다 펼치는 메뉴 패턴.

## 쉽게 설명하면

좁은 화면에서 메뉴 항목을 줄 세울 자리가 없을 때, 선 세 개짜리 버튼 뒤로 메뉴를 접어 두는 방식입니다. 버튼을 누르면 펼쳐집니다.

## 정확한 설명

button의 열린 상태, aria-expanded, focus 이동을 함께 구현해야 한다.

## 이 미션에서는 왜 필요한가

이 회차의 모바일 화면에서 내비게이션을 처리하는 방법입니다. 보이고 숨기는 것만으로는 부족한데, 키보드로만 쓰는 사람에게는 지금 열려 있는지가 화면 모양이 아니라 버튼의 상태값으로 전달되기 때문입니다.

## 코드 예

```html
<button class="nav-toggle" aria-expanded="false" aria-controls="nav">
  <span class="sr-only">메뉴 열기</span>☰
</button>
<nav id="nav" hidden>…</nav>

<script>
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;   // 화면과 상태값을 함께 바꾼다
  });
</script>
```

## 관련 용어

- `interaction`
- `accessibility-a11y`
