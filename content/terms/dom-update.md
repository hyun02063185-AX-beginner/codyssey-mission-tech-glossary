# DOM Update

## 한 줄 설명

JavaScript가 document node·속성·텍스트를 바꾸는 화면 구조 갱신.

## 쉽게 설명하면

자바스크립트로 화면의 글자나 속성을 바꾸는 일입니다. HTML 파일을 고치는 것이 아니라, 브라우저가 이미 메모리에 올려 둔 문서 구조를 고칩니다.

## 정확한 설명

DOM 변경 뒤 browser는 필요한 style, layout, paint 단계를 수행한다.

## 이 미션에서는 왜 필요한가

이 회차의 목표 자체가 버튼을 눌렀을 때 화면이 바뀌게 만드는 것입니다. 바꾸는 방법이 여러 가지인데, `innerHTML`로 통째로 갈아 끼우면 그 안에 붙여 둔 이벤트와 입력 중이던 값이 함께 사라집니다.

## 코드 예

```javascript
const list = document.querySelector('#items');

// 전체를 갈아 끼운다 — 안의 이벤트와 입력값이 사라진다
list.innerHTML = items.map(i => `<li>${i}</li>`).join('');

// 필요한 것만 붙인다
const fragment = document.createDocumentFragment();
for (const item of items) {
  const li = document.createElement('li');
  li.textContent = item;          // textContent 는 HTML 로 해석하지 않는다
  fragment.append(li);
}
list.append(fragment);            // 배치 계산이 한 번만 일어난다
```

## 주의할 점 / 경계 조건

반복문 안에서 요소를 하나씩 추가하면 추가할 때마다 배치 계산이 일어날 수 있습니다. 여러 개를 넣을 때는 조각을 먼저 만들어 한 번에 붙이는 편이 낫습니다.

## 관련 용어

- `dom`
- `browser-rendering`
- `ui-update`

## 흔한 오해

`innerHTML` 로 다시 그리면 깔끔하다고 생각하기 쉽지만, 그 안의 요소는 전부 새로 만들어진 것입니다. 이전 요소에 붙여 둔 이벤트 리스너와 사용자가 입력 중이던 값이 사라집니다.

## 동료평가 질문

목록에 항목 하나를 추가할 때 전체를 다시 그리는 방식과 그 항목만 붙이는 방식의 차이를, 입력 중이던 값을 예로 설명할 수 있나요?
