# localStorage

## 한 줄 설명

localStorage는 같은 origin의 브라우저에 key/value 문자열을 저장해 새로고침 뒤에도 읽을 수 있는 Web Storage입니다.

## 쉽게 설명하면

브라우저 안에 작은 메모장을 두고 `theme` 같은 값을 적어 두었다가 다음에 다시 읽는 방식입니다.

## 정확한 설명

`localStorage.setItem(key, value)`와 `getItem(key)`은 문자열을 저장하고 읽습니다. 데이터는 origin 단위로 분리되고 브라우저를 닫았다 열어도 보통 유지되므로, 객체는 JSON 문자열로 변환하고 없는 값도 처리해야 합니다.

서버 데이터베이스나 보안 저장소가 아니므로 비밀번호·토큰 같은 민감 정보를 넣으면 안 됩니다. M01에서는 다크모드 같은 비민감한 사용자 선호를 저장하고 첫 렌더링 때 다시 적용합니다.

## 이 미션에서는 왜 필요한가

다크모드 선택이 새로고침 뒤에도 유지되게 합니다.

## 코드 예

```js
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');
```

## 관련 용어

- dark-mode
- javascript
- dom

## 흔한 오해

localStorage는 서버 DB가 아니며 민감정보 저장에 적합하지 않습니다.

## 동료평가 질문

변수에만 저장한 다크모드 상태가 새로고침 뒤 사라지는 이유는 무엇인가요?
