# React Props

## 한 줄 설명
React Props는 부모 component가 자식 component에 전달하는 읽기 전용 입력값입니다.

## 쉽게 설명하면
부모가 자식에게 건네는 설정과 자료입니다. 자식은 받은 값을 화면에 쓰지만, 그 값을 직접 바꿔 부모의 상태를 수정하지는 않습니다.

## 정확한 설명
Props는 component의 input이며 render 결과를 결정하는 데 사용됩니다. 자식의 local state와 달리 소유자는 부모이고, 변경은 보통 부모 state를 갱신해 새 props를 내려보내는 흐름으로 표현합니다.

## 이 미션에서는 왜 필요한가
React 화면을 component로 나눌 때 data flow를 한 방향으로 읽고, 재사용 가능한 child component의 interface를 설계하는 기준입니다.

## 코드 예
```jsx
function Greeting({ name }) {
  return <p>Hello, {name}</p>;
}
<Greeting name="Codyssey" />
```

## 주의할 점 / 경계 조건
Props object나 그 안의 object를 자식에서 직접 mutate하면 render 예측이 어려워집니다. 변경이 필요하면 callback을 통해 부모에게 의도를 알립니다.

## 관련 용어
- `react`
- `react-state`
- `use-state`
- `function`
- `variable`

## 흔한 오해
Props와 state는 모두 값이라는 이유로 같은 소유·변경 규칙을 갖는 것은 아닙니다.

## 동료평가 질문
자식 component의 버튼이 이름을 바꾸고 싶을 때, 왜 props를 직접 바꾸는 대신 callback을 받을 수 있나요?
