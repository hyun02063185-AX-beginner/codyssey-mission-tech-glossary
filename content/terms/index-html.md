# index.html

## 한 줄 설명

웹 앱의 최초 HTML document로 자주 쓰이는 entry file.

## 쉽게 설명하면

브라우저가 주소를 받고 가장 먼저 읽는 파일입니다. 이 파일에 적힌 순서대로 스타일과 스크립트를 불러오므로, 화면에 아무것도 안 나올 때 가장 먼저 열어 보는 자리이기도 합니다.

## 정확한 설명

Vite에서는 script entry와 root element를 제공해 JavaScript 앱이 붙을 자리를 만든다.

## 이 미션에서는 왜 필요한가

프로젝트를 만들면 이 파일 하나에서 시작합니다. CSS와 JS를 어떤 경로로 불러오는지가 여기 적히는데, 경로를 `/style.css`로 쓸지 `./style.css`로 쓸지에 따라 로컬에서는 되고 배포하면 깨지는 일이 생깁니다.

## 코드 예

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>김현래 소개</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <main id="app"></main>
    <script src="./main.js" type="module"></script>
  </body>
</html>

<!-- script 를 body 끝에 두면 DOM 이 준비된 뒤 실행된다 -->
```

## 관련 용어

- `html`
- `browser-rendering`
