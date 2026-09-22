# Client-side Routing

## 한 줄 설명

새 document 요청 대신 JavaScript가 URL에 맞는 화면을 선택하는 navigation 방식.

## 쉽게 설명하면

주소가 바뀔 때 서버에 묻지 않고 앱이 직접 "이 주소에는 이 화면"을 골라 주는 방식입니다. 주소 표시줄은 진짜로 바뀌므로 뒤로 가기와 즐겨찾기가 그대로 동작합니다.

## 정확한 설명

History API와 router가 link, back/forward, params를 처리해 component를 교체한다.

## 이 미션에서는 왜 필요한가

이 회차에서 화면 사이를 이동할 때 쓰는 방식입니다. 그냥 `<a href="/about">`을 쓰면 브라우저가 문서를 새로 요청해 앱이 처음부터 다시 뜨므로, 링크를 라우터가 가로채게 만들어야 SPA의 이점이 살아납니다.

## 코드 예

```javascript
// 일반 링크는 문서를 새로 받아 온다 — 앱이 처음부터 다시 뜬다
// <a href="/about">소개</a>

// 라우터의 Link 는 기본 동작을 막고 주소만 바꾼다
import { Link, useLocation } from 'react-router-dom';

<Link to="/about">소개</Link>

// 문서가 그대로이므로 이동 뒤 해야 할 일은 직접 적는다
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
```

## 주의할 점 / 경계 조건

주소를 직접 입력하거나 새로고침하면 그 경로로 서버에 요청이 갑니다. 서버가 어떤 경로든 같은 `index.html`을 돌려주도록 설정하지 않으면 404가 납니다.

## 관련 용어

- `single-page-application`
- `react-router`
- `not-found-page`

## 흔한 오해

주소가 바뀌었으니 페이지도 새로 로드됐다고 생각하기 쉽지만, 문서는 그대로입니다. 그래서 전역 변수나 스크롤 위치가 남아 있고, 이동할 때마다 초기화해 줄 것을 직접 정해야 합니다.

## 동료평가 질문

라우터로 이동한 뒤에도 이전 화면의 스크롤 위치가 남는 이유와 어떻게 처리할지 설명할 수 있나요?
