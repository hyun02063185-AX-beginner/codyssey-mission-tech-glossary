# Asynchronous Data Fetching

## 한 줄 설명

UI를 멈추지 않고 network data의 loading, success, error 상태를 관리하는 방식.

## 쉽게 설명하면

서버에서 데이터를 받아 오는 동안 화면이 멈추지 않게 처리하는 일입니다. 받는 중·받았음·실패 세 가지 상태를 화면이 모두 표현할 수 있어야 합니다.

## 정확한 설명

요청 순서와 응답 순서는 다를 수 있어 취소·최신성·재시도를 설계해야 한다.

## 이 미션에서는 왜 필요한가

이 회차에서 원격 데이터를 불러올 때, 성공한 경우만 코드로 적으면 나머지 시간 동안 화면이 빈 채로 남습니다. 사용자는 그것을 고장으로 읽으므로, 세 상태를 모두 그리는 것이 실제 요구 사항입니다.

## 코드 예

```jsx
const [state, setState] = useState({ status: 'loading' });

useEffect(() => {
  let current = true;               // 늦게 온 응답을 버리기 위한 표시
  setState({ status: 'loading' });

  fetch(`/api/search?q=${query}`)
    .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status)))
    .then(data => { if (current) setState({ status: 'ok', data }); })
    .catch(e => { if (current) setState({ status: 'error', error: e }); });

  return () => { current = false; };
}, [query]);

if (state.status === 'loading') return <Spinner />;
if (state.status === 'error') return <Retry onClick={...} />;
return <List items={state.data} />;
```

## 주의할 점 / 경계 조건

요청을 보낸 순서와 응답이 오는 순서는 다를 수 있습니다. 검색어를 빠르게 바꾸면 이전 검색의 느린 응답이 나중에 도착해 화면을 덮어쓸 수 있습니다.

## 관련 용어

- `useeffect`
- `http-request-response`
- `error-message`

## 흔한 오해

`await` 을 썼으니 순서대로 온다고 생각하기 쉽지만, 보장되는 것은 그 함수 안의 순서뿐입니다. 서로 다른 시점에 시작한 두 요청 사이의 도착 순서는 보장되지 않습니다.

## 동료평가 질문

검색어를 빠르게 여러 번 바꿨을 때 마지막 검색 결과가 화면에 남는다는 것을 어떻게 보장하겠습니까?
