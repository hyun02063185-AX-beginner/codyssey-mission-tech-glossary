# var

## 한 줄 설명
`var`는 JavaScript에서 변수를 선언하는 오래된 키워드로, 주로 함수 scope를 따릅니다.

## 쉽게 설명하면
`var`는 예전 방식의 이름표입니다. `{}` 안에 붙여도 블록 밖의 같은 함수에서 보일 수 있어 예상보다 넓게 퍼질 수 있습니다.

## 정확한 설명
`var` 선언은 function scope 또는 global scope에 binding을 만듭니다. modern JavaScript에서는 block scope를 제공하는 `let`, 재할당을 막는 `const`를 기본 선택으로 검토하는 일이 많습니다.

## 이 미션에서는 왜 필요한가
M01의 JavaScript 코드에서 변수 이름이 callback이나 블록 밖으로 새지 않게 판단하려면 세 선언 키워드의 scope 차이를 알아야 합니다.

## 코드 예
```js
if (true) { var count = 1; }
console.log(count); // 1
```

## 주의할 점 / 경계 조건
`var`가 항상 오류라는 뜻은 아닙니다. 다만 block scope가 필요한 코드에서는 의도치 않은 공유를 만들 수 있습니다.

## 관련 용어
- `scope`
- `let`
- `const`
- `variable`
- `javascript`

## 흔한 오해
`var`도 `{}`마다 새 범위를 만든다는 생각은 맞지 않습니다.

## 동료평가 질문
반복문 callback에서 `var` 대신 `let`을 고려하는 이유는 무엇인가요?
