# Controlled Input

## 한 줄 설명

React state를 입력값의 기준으로 삼아 form control을 표시하고 갱신하는 방식.

## 쉽게 설명하면

입력 칸에 보이는 값의 주인을 브라우저가 아니라 React 상태로 두는 방식입니다. 사용자가 글자를 쳐도 상태를 바꿔 주지 않으면 화면의 값은 바뀌지 않습니다.

## 정확한 설명

value와 onChange를 state에 연결해 렌더링 값과 사용자 입력을 하나의 source of truth로 관리한다.

## 동작 원리

`value`에 상태를 연결하면 화면은 항상 상태를 그대로 비춥니다. 사용자가 키를 누르면 `onChange`가 불리고, 거기서 상태를 바꿔야 다시 그려지면서 화면의 값이 바뀝니다.

## 이 미션에서는 왜 필요한가

이 회차의 폼 입력을 이 방식으로 다룹니다. 값이 상태에 있으므로 입력하는 동안 실시간으로 검증하거나 버튼을 잠그는 일이 가능해지는 대신, `value`만 주고 `onChange`를 빠뜨리면 아예 입력이 안 되는 칸이 됩니다.

## 코드 예

```jsx
const [email, setEmail] = useState('');   // undefined 로 시작하지 않는다

// value 만 주면 읽기 전용이 된다
// <input value={email} />

<input
  value={email}
  onChange={e => setEmail(e.target.value)}
/>

// 값이 상태에 있으므로 입력 중에도 판단할 수 있다
<button disabled={!email.includes('@')}>보내기</button>
```

## 주의할 점 / 경계 조건

초깃값이 `undefined` 였다가 나중에 문자열이 들어오면, React가 제어되지 않는 입력에서 제어되는 입력으로 바뀌었다고 경고합니다. 처음부터 빈 문자열로 시작해야 합니다.

## 관련 용어

- `react-state`
- `html-form`
- `input-validation`

## 흔한 오해

`value` 만 주면 그 값이 보이고 입력도 될 것 같지만, 그 순간 칸은 읽기 전용이 됩니다. 화면의 값은 상태가 정하므로 상태를 바꾸지 않으면 아무리 쳐도 그대로입니다.

## 동료평가 질문

입력이 안 되는 칸을 만났을 때 `value` 와 `onChange` 중 무엇이 빠졌는지 확인하는 방법을 설명할 수 있나요?
