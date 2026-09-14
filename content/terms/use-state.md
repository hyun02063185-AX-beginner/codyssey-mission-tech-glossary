# useState

## 한 줄 설명

`useState`는 React 함수 컴포넌트가 화면에 영향을 주는 값을 기억하고 갱신하게 해 주는 Hook입니다.

## 쉽게 설명하면

버튼을 누른 뒤 숫자가 바뀌어 화면에도 새 숫자가 보이게 하려면 그 숫자를 `useState`로 관리합니다.

## 코드 예

```jsx
const [isLoading, setIsLoading] = useState(false);
setIsLoading(true);
```

## 정확한 설명

`useState`는 현재 state 값과 이를 갱신할 setter 함수를 배열로 돌려줍니다. setter를 호출하면 React는 새 state를 기준으로 다음 렌더링을 예약합니다. 이전 값에 따라 갱신할 때는 함수 형태의 setter를 쓰면 연속된 갱신을 안전하게 다룰 수 있습니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서 폼 값, API 데이터, 로딩·성공·오류 상태를 컴포넌트 화면과 함께 관리합니다.

## 관련 용어

- react-state
- react
- useeffect

## 흔한 오해

setter를 호출한 다음 줄에서 state 변수가 즉시 새 값으로 바뀌는 것은 아닙니다. 새 값은 다음 렌더링에서 반영됩니다.

## 동료평가 질문

로딩 상태를 일반 변수 대신 `useState`로 두면 화면에 어떤 차이가 생기나요?
