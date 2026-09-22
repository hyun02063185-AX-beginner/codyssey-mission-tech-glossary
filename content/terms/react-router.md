# React Router

## 한 줄 설명

React SPA에서 URL과 component를 연결하고 navigation을 처리하는 library.

## 쉽게 설명하면

어떤 주소에 어떤 화면을 보여 줄지 적어 두고, 링크와 뒤로 가기를 처리해 주는 라이브러리입니다. 주소와 화면을 잇는 표라고 보면 됩니다.

## 정확한 설명

route matching, params, Link, nested route, Not Found route를 제공한다.

## 이 미션에서는 왜 필요한가

이 회차의 화면 이동을 이것으로 만듭니다. 직접 만들면 주소 변경·뒤로 가기·주소 안의 값 읽기·없는 주소 처리를 전부 짜야 하는데, 그 네 가지가 이미 들어 있습니다.

## 코드 예

```jsx
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/posts/:id" element={<PostDetail />} />
    <Route path="*" element={<NotFound />} />   {/* 가장 아래에 둔다 */}
  </Routes>
</BrowserRouter>

function PostDetail() {
  const { id } = useParams();     // 주소 안의 값을 읽는다
  return <Post id={id} />;
}
```

## 주의할 점 / 경계 조건

라우트는 위에서부터 맞춰 보므로 `*` 로 받는 경로를 위에 두면 그 아래 라우트에 도달하지 못합니다. 넓은 경로일수록 아래에 둡니다.

## 관련 용어

- `client-side-routing`
- `single-page-application`
- `not-found-page`

## 흔한 오해

라우터를 넣으면 새로고침도 알아서 된다고 생각하기 쉽지만, 새로고침은 서버로 가는 요청입니다. 서버가 모든 경로에 같은 HTML을 돌려주도록 따로 설정해야 합니다.

## 동료평가 질문

`/posts/3` 을 주소창에 직접 입력했을 때 동작하게 하려면 서버 쪽에 무엇이 필요한지 설명할 수 있나요?
