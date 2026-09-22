# Template Engine

## 한 줄 설명

template에 data를 넣어 HTML 같은 text output을 만드는 도구.

## 쉽게 설명하면

HTML 틀을 미리 써 두고 빈칸에 데이터를 채워 넣어 주는 도구입니다. 문자열을 손으로 이어 붙이는 대신 틀과 값을 분리합니다.

## 정확한 설명

Jinja2 같은 engine은 variable·loop·escape를 제공해 presentation과 business logic 경계를 돕는다.

## 이 미션에서는 왜 필요한가

이 회차에서 서버가 HTML을 만들 때 씁니다. 문자열로 직접 이어 붙이면 사용자가 입력한 글에 태그가 섞여 있을 때 그것이 그대로 실행되는데, 템플릿 엔진은 기본적으로 그런 글자를 안전한 형태로 바꿔 넣습니다.

## 코드 예

```text
문자열을 직접 이어 붙이면
  html = "<h1>" + post.title + "</h1>"
  제목이 <script>alert(1)</script> 이면 그대로 실행된다

템플릿 엔진 (Jinja2)
  <h1>{{ post.title }}</h1>
  → &lt;script&gt;alert(1)&lt;/script&gt; 로 바뀌어 글자로 보인다

  <h1>{{ post.title | safe }}</h1>
  → 보호를 끈 것이다. 사용자 입력에는 쓰지 않는다
```

## 주의할 점 / 경계 조건

안전 처리를 끄는 기능이 따로 있습니다. `| safe` 같은 표시를 사용자 입력에 붙이면 그 보호가 사라집니다.

## 관련 용어

- `templateresponse`
- `server-side-rendering`

## 흔한 오해

템플릿 엔진을 쓰면 자동으로 안전하다고 생각하기 쉽지만, 자동 변환이 적용되는 것은 본문 자리뿐입니다. 속성값이나 스크립트 안에 값을 넣을 때는 규칙이 다릅니다.

## 동료평가 질문

사용자가 제목에 `<script>` 를 넣어 글을 썼을 때 화면에 어떻게 나오는지, 그리고 왜 그런지 설명할 수 있나요?
