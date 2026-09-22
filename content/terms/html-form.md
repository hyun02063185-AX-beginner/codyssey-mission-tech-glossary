# HTML Form

## 한 줄 설명

입력 control을 묶어 사용자 데이터를 제출하는 HTML 구조.

## 쉽게 설명하면

입력 칸들을 묶어 서버로 한 번에 보내는 HTML 구조입니다. 자바스크립트 없이도 전송과 기본 검사가 동작합니다.

## 정확한 설명

name을 가진 control 값을 method와 action에 따라 전송하고 submit의 의미를 제공한다.

## 이 미션에서는 왜 필요한가

이 회차의 글 등록과 수정 화면이 이것입니다. 각 칸에 붙인 `name`이 서버에서 값을 꺼낼 때의 열쇠가 되므로, 이름을 빠뜨리면 사용자가 입력한 값이 서버에 도착하지 않습니다.

## 코드 예

```html
<form method="post" action="/posts">
  <label for="title">제목</label>
  <input id="title" name="title" required maxlength="100" />

  <label for="body">내용</label>
  <textarea id="body" name="body" required></textarea>

  <button type="submit">등록</button>
</form>

<!--
  name 이 서버에서 값을 꺼내는 열쇠다 — form.get("title")
  id 는 label 과 묶는 용도라 역할이 다르다
  method 를 빼면 GET 이 되어 내용이 주소에 남는다
-->
```

## 주의할 점 / 경계 조건

`method`를 적지 않으면 GET으로 전송되어 입력한 값이 주소 표시줄에 남습니다. 저장을 일으키는 폼은 반드시 POST로 보내야 합니다.

## 관련 용어

- `contact-form`
- `post-redirect-get`
- `input-validation`

## 흔한 오해

`required`가 있으니 서버에서 다시 검사할 필요가 없다고 생각하기 쉽지만, 브라우저 검사는 사용자가 끌 수 있습니다. 서버에 도착한 값은 항상 다시 검사해야 합니다.

## 동료평가 질문

입력 칸에서 `name` 을 빼면 서버에서 무슨 일이 생기는지 직접 확인하고 설명할 수 있나요?
