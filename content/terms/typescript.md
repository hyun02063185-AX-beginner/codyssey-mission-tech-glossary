# TypeScript

## 한 줄 설명

JavaScript에 정적 타입 검사를 더한 프로그래밍 언어.

## 쉽게 설명하면

실행 전에 값의 모양이 맞는지 더 많이 확인해 주는 JavaScript다.

## 정확한 설명

TypeScript는 컴파일 시 타입 오류를 찾고 JavaScript로 변환된다. 타입 정보는 기본적으로 런타임에 남지 않는다.

## 언제 쓰나

API 응답 인터페이스를 선언해 잘못된 속성 접근을 일찍 발견한다.

## 기억할 경계

타입 검사가 서버 응답 자체를 검증하거나 런타임 오류를 모두 막지는 않는다.

## 이 미션에서는 왜 필요한가

이 회차에서 필수는 아니지만, 화면 상태를 다루는 코드가 길어지면 값의 모양이 어긋나 생기는 오류가 늘어납니다. 그 오류를 실행 전에 잡아 주는 것이 이 언어의 역할이며, 실행 결과가 바뀌는 것이 아니라 잘못된 코드를 쓰기 어려워지는 쪽입니다.

## 코드 예

```text
JavaScript
  const user = { name: '김' };
  console.log(user.nmae);      // undefined — 실행해 봐야 안다

TypeScript
  type User = { name: string };
  const user: User = { name: '김' };
  console.log(user.nmae);      // 편집기에서 바로 빨간 줄

브라우저는 TypeScript 를 모른다. 빌드하면 JavaScript 로 바뀌어 나간다.
```

## 관련 용어

- `javascript`
