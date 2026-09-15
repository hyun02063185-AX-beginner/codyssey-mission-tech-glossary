# Client-side Storage

## 한 줄 설명

browser가 사용자 기기에 data를 저장해 다음 방문에도 쓰게 하는 저장 영역.

## 쉽게 설명하면

`Client-side Storage`의 역할을 실제 화면과 요청 흐름에서 분리해 생각하면 됩니다.

## 정확한 설명

localStorage, sessionStorage, IndexedDB, cookie는 수명·용량·전송 경계가 서로 다르다.

## 이 미션에서는 왜 필요한가

현재 미션의 구현 요구에서 이 용어가 맡는 책임과 다른 단계의 경계를 확인합니다.

## 코드 예

```text
Client-side Storage
```

## 주의할 점 / 경계 조건

한 단계의 성공을 전체 기능의 성공으로 해석하지 말고, 비동기 순서·접근성·서버 검증처럼 이 개념 밖의 조건을 함께 점검합니다.

## 관련 용어

- `local-storage`
- `cookie`
- `client-side-routing`

## 흔한 오해

이 용어의 이름만 같다고 모든 framework와 환경에서 같은 동작을 보장하는 것은 아닙니다.

## 동료평가 질문

이 기능의 입력, 상태 변화, 사용자에게 보이는 결과를 각각 어떻게 확인하겠습니까?
