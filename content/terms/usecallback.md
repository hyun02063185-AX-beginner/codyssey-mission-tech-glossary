# useCallback

## 한 줄 설명

dependency가 바뀔 때까지 같은 function reference를 재사용하는 React Hook.

## 쉽게 설명하면

컴포넌트가 다시 그려져도 같은 함수를 계속 쓰게 해 주는 Hook입니다. 함수는 다시 그릴 때마다 새로 만들어지는데, 그것을 막습니다.

## 정확한 설명

React.memo 자식이나 effect dependency에서 reference 안정성이 필요할 때 쓴다.

## 이 미션에서는 왜 필요한가

이 회차의 성능 보너스에서 `React.memo`나 `useEffect`와 짝으로 씁니다. 함수를 매번 새로 만들면 받는 쪽에서는 값이 바뀐 것으로 보이므로, 그 두 곳에 함수를 넘길 때만 의미가 있습니다.

## 코드 예

```jsx
// 이 함수는 렌더링마다 새로 만들어진다 — memo 자식에게는 매번 새 값
const handleSelect = id => setSelected(id);

// 같은 함수를 유지한다
const handleSelect = useCallback(id => setSelected(id), []);

// 의존성을 빠뜨리면 옛 값이 갇힌다
const handleAdd = useCallback(() => setTotal(total + price), []);       // total 이 0 에 고정
const handleAdd = useCallback(() => setTotal(t => t + price), [price]); // 안전
```

## 주의할 점 / 경계 조건

의존성 배열에 적지 않은 값을 함수 안에서 쓰면 옛날 값이 그대로 갇힙니다. 버튼을 눌렀는데 몇 번 전의 값으로 동작하는 문제가 여기서 나옵니다.

## 관련 용어

- `react-memo`
- `usememo`

## 흔한 오해

함수를 감싸면 빨라진다고 생각하기 쉽지만, 감싸는 것 자체도 비용입니다. 넘겨받는 쪽이 값이 같은지 따지지 않는다면 붙일 이유가 없습니다.

## 동료평가 질문

`useCallback` 을 붙여야 하는 경우와 붙일 필요가 없는 경우를, 그 함수를 어디에 넘기는지로 구분해 설명할 수 있나요?
