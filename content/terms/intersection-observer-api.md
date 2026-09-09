# Intersection Observer

## 한 줄 설명

Intersection Observer는 요소가 뷰포트에 들어오거나 나가는 시점을 관찰하는 브라우저 API입니다.

## 쉽게 설명하면

스크롤해서 특정 섹션이 보이는 순간을 브라우저에게 알려 달라고 요청하는 기능입니다.

## 정확한 설명

관찰자에 callback과 threshold 같은 옵션을 주고 대상 요소를 `observe`하면, 대상과 root viewport의 교차 상태 변화가 callback으로 전달됩니다. 매 scroll 이벤트마다 모든 위치를 계산하는 방식보다 관찰 목적을 분명히 표현할 수 있습니다.

M01에서는 섹션이 화면에 들어올 때 애니메이션을 시작하거나 내비게이션 상태를 바꾸는 데 사용할 수 있습니다. 애니메이션이 한 번만 필요하면 완료 뒤 `unobserve`하는지도 검토합니다.

## 이 미션에서는 왜 필요한가

스크롤 시점에 맞춘 섹션 애니메이션과 화면 변화를 안정적으로 구현합니다.

## 코드 예

```js
const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('shown')));
observer.observe(section);
```

## 관련 용어

- javascript
- dom
- add-event-listener

## 흔한 오해

관찰 대상이나 threshold를 정하지 않으면 원하는 시점의 동작을 보장할 수 없습니다.

## 동료평가 질문

scroll 이벤트를 계속 감시하는 방식보다 Intersection Observer가 유리한 경우는 언제인가요?
