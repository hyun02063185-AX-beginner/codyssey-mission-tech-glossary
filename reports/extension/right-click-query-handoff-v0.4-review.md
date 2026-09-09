# Right-click Query Handoff v0.4 검토

`selectionText`는 공백을 정리한 query와 source·requestedAt·requestId를 포함한 session payload로 먼저 저장됩니다. 저장 완료 뒤 Side Panel을 엽니다.

- 닫힌 패널: 시작 시 `storage.session.get`으로 pending query를 hydrate합니다.
- 열린 패널: `storage.onChanged`로 새 payload를 받아 검색 탭·input·결과를 즉시 갱신합니다.
- 동일 용어 재선택: 매 요청의 `requestId`가 달라 storage change가 발생합니다.

진단 대상은 raw 선택어, 정리된 query, session write, panel hydrate, 검색 결과 term id입니다. 페이지 URL·본문 이력은 기록하지 않습니다.

실제 Chrome QA에서는 JavaScript 선택 → 메뉴 클릭 → input과 M01 JavaScript 카드 표시를 확인합니다.
