# React.memo

## 한 줄 설명

props가 같을 때 function component render를 건너뛸 수 있게 하는 React wrapper.

## 쉽게 설명하면

부모가 다시 그려질 때 이 컴포넌트도 따라 그리는 것을 막아 주는 감싸개입니다. 받은 값이 이전과 같으면 그리기를 건너뜁니다.

## 정확한 설명

shallow prop comparison을 기본으로 하므로 새 object·function prop이 매번 생기면 효과가 줄 수 있다.

## 이 미션에서는 왜 필요한가

이 회차의 성능 보너스에 쓰입니다. 다만 "같은 값"을 얕게 비교하기 때문에, 부모에서 객체나 함수를 매번 새로 만들어 넘기면 값이 실제로는 같아도 다르다고 판정되어 효과가 없습니다.

## 코드 예

```jsx
const Row = React.memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.title}</li>;
});

// 이러면 onSelect 가 매번 새 함수라 memo 가 무력해진다
<Row item={item} onSelect={id => setSelected(id)} />

// 함수 자체를 고정해야 효과가 난다
const handleSelect = useCallback(id => setSelected(id), []);
<Row item={item} onSelect={handleSelect} />
```

## 주의할 점 / 경계 조건

비교하는 일에도 비용이 듭니다. 그리는 일이 원래 가벼운 컴포넌트에 붙이면 오히려 느려질 수 있습니다.

## 관련 용어

- `usecallback`
- `usememo`

## 흔한 오해

감싸면 렌더링이 줄어든다고 생각하기 쉽지만, prop으로 인라인 함수나 객체를 넘기고 있으면 매번 새 값이라 항상 다시 그립니다. 감싸기 전에 넘기는 값부터 봐야 합니다.

## 동료평가 질문

`React.memo` 를 붙였는데도 렌더링이 줄지 않는 상황의 원인을, 넘기는 prop 을 예로 설명할 수 있나요?
