# React.memo

## 한 줄 설명

props가 같을 때 function component render를 건너뛸 수 있게 하는 React wrapper.

## 쉽게 설명하면

`React.memo`의 역할을 실제 화면과 요청 흐름에서 분리해 생각하면 됩니다.

## 정확한 설명

shallow prop comparison을 기본으로 하므로 새 object·function prop이 매번 생기면 효과가 줄 수 있다.

## 이 미션에서는 왜 필요한가

현재 미션의 구현 요구에서 이 용어가 맡는 책임과 다른 단계의 경계를 확인합니다.

## 코드 예

```text
React.memo
```

## 관련 용어

- `usecallback`
- `usememo`
