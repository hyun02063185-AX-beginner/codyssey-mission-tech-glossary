# localStorage

## 한 줄 설명

localStorage는 같은 origin의 브라우저에 문자열 key/value를 저장해 브라우저 세션을 넘어 유지하는 Web Storage API의 Storage 객체입니다.

## 쉽게 설명하면

브라우저 안에 메모장을 두고 `theme` 같은 값을 적어 두었다가 새로고침·재방문 뒤 다시 읽는 방식입니다.

## 정확한 설명

localStorage는 Web Storage API가 제공하는 Storage 객체로, origin 단위로 격리된 문자열 key/value 저장소입니다. `setItem`/`getItem`/`removeItem`/`clear`가 동기적으로 동작하며, 별도의 만료 시간 없이 브라우저 세션을 넘어 유지됩니다(sessionStorage는 탭을 닫으면 사라집니다). 값은 문자열만 저장할 수 있으므로 객체·배열은 `JSON.stringify`로 직렬화하고 읽을 때 `JSON.parse`로 복원해야 합니다. 서버 데이터베이스나 보안 저장소가 아니므로 비밀번호·토큰 같은 민감 정보는 저장하면 안 됩니다.

## 동작 원리

- 데이터는 origin(스킴+호스트+포트) 단위로 격리됩니다. 같은 사이트라도 http와 https는 서로 다른 localStorage를 갖습니다.
- 읽기·쓰기가 동기 API라 호출 즉시 완료됩니다. 대용량 데이터나 반복 쓰기는 메인 스레드에서 실행되므로 UI를 잠시 막을 수 있습니다.
- 저장 용량은 브라우저별로 상한(보통 origin당 약 5MB)이 있습니다.
- 쿠키 차단·사생활(시크릿) 모드 등 브라우저 설정에 따라 저장이 차단될 수 있고, 접근 시 SecurityError가 발생할 수 있습니다.

## 이 미션에서는 왜 필요한가

M01의 다크모드 선택은 CSS 클래스·변수로만 바꾸면 새로고침 때 사라집니다. localStorage에 `theme` 값을 저장하고 첫 렌더링 때 읽어 적용하면 사용자 선택이 페이지 이동과 새로고침 뒤에도 유지됩니다.

## 코드 예

```js
// 저장 — 객체는 문자열로 직렬화
const settings = { theme: 'dark', fontSize: 16 };
localStorage.setItem('settings', JSON.stringify(settings));

// 읽기 — 값이 없을 수 있으므로 기본값 처리
const raw = localStorage.getItem('settings');
const saved = raw ? JSON.parse(raw) : { theme: 'light', fontSize: 16 };

// 삭제
localStorage.removeItem('settings');
```

## 주의할 점 / 경계 조건

- origin이 다르면 같은 key라도 서로 다른 저장소입니다(다른 포트·프로토콜 포함).
- 민감 정보(비밀번호·인증 토큰 등) 저장 금지 — 페이지의 모든 스크립트가 읽을 수 있어 XSS에 그대로 노출됩니다.
- localStorage가 차단된 환경에서는 호출이 예외를 던질 수 있으므로, 접근을 try/catch로 감싸는 것이 안전합니다.
- 동기 API이므로 대량 데이터 저장·빈번한 쓰기는 피하고, 소규모 사용자 선호 저장에 사용하는 것이 적합합니다.

## 흔한 오해

localStorage를 서버 데이터베이스나 JavaScript 변수의 대체로 생각합니다. localStorage는 사용자 브라우저에만 존재하는 origin 단위 클라이언트 저장소입니다. 변수는 새로고침하면 사라지지만 localStorage는 유지되며, 서버나 다른 사용자와 공유되지 않습니다.

## 비슷한 개념과의 차이

- **sessionStorage**: 같은 Web Storage API지만 탭/페이지 세션이 끝나면 삭제됩니다.
- **cookie**: 요청마다 서버로 자동 전송되고 만료일·HttpOnly 같은 옵션이 있어, 서버와 주고받아야 하는 값에 적합합니다.
- **IndexedDB**: 대용량·구조화된 데이터를 비동기로 저장하는 클라이언트 DB로, localStorage와 역할이 다릅니다.

## 관련 용어

- dark-mode
- javascript
- dom
- cookie

## 동료평가 질문

변수에만 저장한 다크모드 상태가 새로고침 뒤 사라지는 이유는 무엇인가요? 비밀번호를 localStorage에 저장하면 안 되는 이유는 무엇인가요?
