# Single Page Application

## 한 줄 설명

초기 document 뒤 JavaScript가 화면 일부를 갱신하며 여러 route를 제공하는 웹 앱.

## 쉽게 설명하면

`Single Page Application`의 역할을 실제 화면과 요청 흐름에서 분리해 생각하면 됩니다.

## 정확한 설명

client router가 URL과 화면을 연결하고 API data를 받아 같은 document 안의 UI를 바꾼다.

## 동작 원리

입력·상태·렌더링 또는 요청·응답의 순서를 나누어 관찰하고, 바뀐 결과가 다음 단계의 입력이 되는지 확인합니다.

## 이 미션에서는 왜 필요한가

현재 미션의 구현 요구에서 이 용어가 맡는 책임과 다른 단계의 경계를 확인합니다.

## 코드 예

```text
Single Page Application
```

## 주의할 점 / 경계 조건

한 단계의 성공을 전체 기능의 성공으로 해석하지 말고, 비동기 순서·접근성·서버 검증처럼 이 개념 밖의 조건을 함께 점검합니다.

## 관련 용어

- `client-side-routing`
- `react-router`
- `server-side-rendering`

## 흔한 오해

이 용어의 이름만 같다고 모든 framework와 환경에서 같은 동작을 보장하는 것은 아닙니다.

## 동료평가 질문

이 기능의 입력, 상태 변화, 사용자에게 보이는 결과를 각각 어떻게 확인하겠습니까?
