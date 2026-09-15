# Virtual DOM Rendering

## 한 줄 설명

React가 새 UI 설명을 비교해 필요한 실제 DOM 변경을 반영하는 흐름.

## 쉽게 설명하면

`Virtual DOM Rendering`의 역할을 실제 화면과 요청 흐름에서 분리해 생각하면 됩니다.

## 정확한 설명

reconciliation은 key와 component identity를 바탕으로 DOM mutation을 결정한다.

## 이 미션에서는 왜 필요한가

현재 미션의 구현 요구에서 이 용어가 맡는 책임과 다른 단계의 경계를 확인합니다.

## 코드 예

```text
Virtual DOM Rendering
```

## 주의할 점 / 경계 조건

한 단계의 성공을 전체 기능의 성공으로 해석하지 말고, 비동기 순서·접근성·서버 검증처럼 이 개념 밖의 조건을 함께 점검합니다.

## 관련 용어

- `react-state`
- `dom-update`
- `browser-rendering`

## 흔한 오해

이 용어의 이름만 같다고 모든 framework와 환경에서 같은 동작을 보장하는 것은 아닙니다.

## 동료평가 질문

이 기능의 입력, 상태 변화, 사용자에게 보이는 결과를 각각 어떻게 확인하겠습니까?
