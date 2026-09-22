# Custom Hook

## 한 줄 설명

공유하는 React state와 effect 로직을 `use...` 함수로 묶은 재사용 단위.

## 쉽게 설명하면

여러 화면에서 반복되는 상태와 바깥일 처리를 `use`로 시작하는 함수 하나로 묶은 것입니다. 새로운 기능이 아니라 이미 있는 Hook들을 모아 이름을 붙인 것입니다.

## 정확한 설명

다른 Hook을 호출하는 함수이며 호출마다 독립된 state와 effect를 가진다.

## 동작 원리

평범한 함수이지만 안에서 다른 Hook을 부릅니다. 호출한 컴포넌트마다 독립된 상태를 갖게 되므로, 두 컴포넌트가 같은 Hook을 써도 상태를 공유하지는 않습니다.

## 이 미션에서는 왜 필요한가

이 회차에서 데이터를 불러오는 코드가 화면마다 반복되면, 로딩과 오류 처리를 각자 조금씩 다르게 적게 됩니다. 하나로 묶어 두면 그 처리가 한 군데에 모이고, 화면 쪽 코드에는 그리는 일만 남습니다.

## 코드 예

```jsx
function useFetch(url) {
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    let current = true;
    fetch(url).then(r => r.json())
      .then(data => current && setState({ status: 'ok', data }))
      .catch(error => current && setState({ status: 'error', error }));
    return () => { current = false; };
  }, [url]);

  return state;
}

// 화면 쪽에는 그리는 일만 남는다
function PostList() {
  const { status, data } = useFetch('/api/posts');
  if (status === 'loading') return <Spinner />;
  return <ul>{data.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

// 다른 컴포넌트에서 또 부르면 상태는 따로 생긴다
```

## 주의할 점 / 경계 조건

이름을 `use`로 시작하지 않으면 React가 Hook 규칙을 검사하지 못합니다. 조건문 안에서 부르는 실수를 잡아 주지 못하게 됩니다.

## 관련 용어

- `useeffect`
- `react-state`
- `separation-of-concerns`

## 흔한 오해

커스텀 Hook을 쓰면 상태가 공유된다고 생각하기 쉽지만, 부르는 곳마다 따로 생깁니다. 상태를 공유하려면 Context나 공통 부모가 따로 필요합니다.

## 동료평가 질문

같은 커스텀 Hook 을 두 컴포넌트에서 불렀을 때 상태가 공유되는지 아닌지와, 그 이유를 설명할 수 있나요?
