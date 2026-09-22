# React Context

## 한 줄 설명

중간 component마다 props를 전달하지 않고 tree 아래에 값을 제공하는 React 기능.

## 쉽게 설명하면

중간 컴포넌트를 하나씩 거치지 않고 아래쪽 어디서든 값을 꺼내 쓸 수 있게 해 주는 통로입니다. 값을 내려보내는 자리와 꺼내는 자리만 정하면 됩니다.

## 정확한 설명

Provider value를 useContext로 읽으며 value identity 변경은 소비 component render에 영향을 준다.

## 이 미션에서는 왜 필요한가

이 회차의 보너스인 전역 상태에 쓰입니다. 로그인한 사용자나 테마처럼 화면 곳곳에서 필요한 값을 props로 내려보내면 중간 컴포넌트가 쓰지도 않는 값을 계속 전달하게 되는데, 그 통과 구간을 없애 줍니다.

## 코드 예

```jsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  // 객체를 매번 새로 만들면 값이 안 바뀌어도 아래가 다시 그려진다
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);   // 중간 단계를 건너뛴다
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} />;
}
```

## 주의할 점 / 경계 조건

값이 바뀌면 그 값을 읽는 모든 컴포넌트가 다시 그려집니다. 자주 바뀌는 값과 거의 안 바뀌는 값을 한 Context에 같이 두면 불필요한 렌더링이 늘어납니다.

## 관련 용어

- `component-tree`
- `react-state`
- `custom-hook`

## 흔한 오해

Context가 상태 관리 도구라고 생각하기 쉽지만, 값을 나르는 통로일 뿐입니다. 상태는 여전히 `useState`나 `useReducer`가 들고 있어야 합니다.

## 동료평가 질문

props 로 내려보내는 것과 Context 를 쓰는 것 중 무엇을 고를지, 중간 컴포넌트의 수를 기준으로 설명할 수 있나요?
