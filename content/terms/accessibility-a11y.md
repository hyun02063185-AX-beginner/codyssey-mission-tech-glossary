# Accessibility / a11y

## 한 줄 설명

다른 장애·입력 방식·환경의 사람도 웹을 사용할 수 있게 하는 설계.

## 쉽게 설명하면

화면을 눈으로 보지 않거나 마우스를 쓰지 않는 사람도 같은 일을 할 수 있게 만드는 일입니다. 화면 낭독기에게는 버튼의 생김새가 아니라 태그와 이름이 전부입니다.

## 정확한 설명

semantic HTML, keyboard, focus, label, contrast, accessible name을 함께 다룬다.

## 이 미션에서는 왜 필요한가

이 회차는 의미에 맞는 HTML 태그를 쓰도록 요구하고, 그 이유가 여기 있습니다. `<div onclick>`으로 만든 버튼은 보기에는 같지만 탭으로 이동할 수 없고 엔터로 눌리지 않으며 낭독기가 버튼이라고 읽지도 않습니다.

## 코드 예

```html
<!-- 보기에는 같지만 키보드로 쓸 수 없다 -->
<div class="btn" onclick="send()">보내기</div>

<!-- button 은 초점 이동·엔터·역할 안내를 기본으로 갖는다 -->
<button type="submit">보내기</button>

<!-- 아이콘만 있는 버튼은 이름이 없다. 이름을 따로 준다 -->
<button aria-label="메뉴 열기">☰</button>

<!-- 이미지도 마찬가지 -->
<img src="profile.jpg" alt="김현래의 프로필 사진" />
```

## 관련 용어

- `html-form`
- `interaction`
