# Module

## 한 줄 설명

Module은 관련 코드와 공개할 기능을 한 단위로 묶어 다른 파일에서 가져다 쓸 수 있게 한 프로그램 구성 요소입니다.

## 쉽게 설명하면

한 파일이나 패키지에 필요한 도구를 정리해 두고, 필요한 곳에서 골라 가져오는 방식입니다.

## 정확한 설명

모듈은 export로 공개 API를 정하고 import로 다른 모듈의 기능을 사용합니다. JavaScript의 ES Module은 정적 import/export 문법을 제공하며, Node.js의 CommonJS와는 문법·로딩 방식이 다를 수 있습니다. 모듈을 나눈다고 순환 의존성이나 전역 상태 문제가 자동으로 사라지지는 않습니다.

## 이 미션에서는 왜 필요한가

M03에서 기능을 파일 단위로 분리하고, M01·M02에서 화면 로직과 유틸리티를 유지보수하기 쉬운 구조로 나눕니다.

## 코드 예

```js
export function formatName(name) { return name.trim(); }
import { formatName } from './format.js';
```

## 관련 용어

- `javascript`
- `node-js`
- `npm`
- `dependency-injection`

## 흔한 오해

파일 하나가 곧 항상 좋은 모듈이라는 뜻은 아닙니다. 공개 범위와 책임이 응집되어 있어야 모듈 경계가 도움이 됩니다.

## 동료평가 질문

UI 코드에서 날짜 포맷 함수를 별도 module로 분리하면 어떤 변경을 줄일 수 있나요?
