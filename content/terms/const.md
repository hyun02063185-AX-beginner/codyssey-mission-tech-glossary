# const

## 한 줄 설명
`const`는 JavaScript에서 다시 할당할 수 없는 block-scoped binding을 선언하는 키워드입니다.

## 쉽게 설명하면
이름표를 한 번 붙이면 다른 물건으로 바꿔 붙일 수 없다는 약속입니다. 상자 안의 물건까지 자동으로 얼리는 기능은 아닙니다.

## 정확한 설명
`const` binding은 선언 때 초기값이 필요하고 같은 binding에 새 값을 대입할 수 없습니다. 객체나 배열의 property·element 변경 가능성은 object immutability와 별개입니다.

## 이 미션에서는 왜 필요한가
M01에서 변하지 않아야 하는 DOM 참조나 설정값을 드러내고, 의도치 않은 재할당을 줄이는 기본 선언 방식입니다.

## 코드 예
```js
const settings = { theme: 'dark' };
settings.theme = 'light'; // 가능
// settings = {}; // 불가
```

## 주의할 점 / 경계 조건
`const`가 deep freeze를 수행하지는 않습니다. 내부 구조까지 변경하지 못하게 하려면 별도 설계가 필요합니다.

## 관련 용어
- `scope`
- `var`
- `let`
- `variable`
- `javascript`

## 흔한 오해
`const` 객체는 어떤 변경도 할 수 없다는 말은 정확하지 않습니다.

## 동료평가 질문
DOM element를 담은 변수에 `const`를 쓰면서도 element의 text를 바꿀 수 있는 이유는 무엇인가요?
