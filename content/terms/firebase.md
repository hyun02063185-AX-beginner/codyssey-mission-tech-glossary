# Firebase

## 한 줄 설명

authentication, database, hosting 등을 제공하는 Google backend platform.

## 쉽게 설명하면

`Firebase`은(는) 요청이 client에서 service까지 도달하고 배포 환경에서 실행되는 경로를 이해하는 데 쓰입니다.

## 정확한 설명

authentication, database, hosting 등을 제공하는 Google backend platform. network boundary, address, port, route, server process의 역할을 서로 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서 원격에 데이터를 저장하고 읽어 올 때 고를 수 있는 선택지입니다. 서버를 직접 만들지 않고도 생성·조회·수정·삭제를 할 수 있어, 화면 쪽에 집중할 수 있게 해 줍니다.

## 코드 예

```javascript
import { collection, addDoc, getDocs } from "firebase/firestore";

await addDoc(collection(db, "todos"), { title, done: false });
const snapshot = await getDocs(collection(db, "todos"));
// 문서를 그대로 넣고 꺼낸다 — 표 구조를 미리 정하지 않는다
```

## 주의할 점 / 경계 조건

한 network 설정이 정상이어도 DNS, security rule, server process, certificate, application route 중 다른 단계가 실패할 수 있습니다.

## 관련 용어

- `http`
- `tcp`

## 흔한 오해

public address나 열린 port 하나만으로 service 전체가 안전하거나 정상이라는 뜻은 아닙니다.

## 동료평가 질문

이 request 경로가 실패했을 때 address, route, port, server 중 어느 순서로 확인하겠습니까?
