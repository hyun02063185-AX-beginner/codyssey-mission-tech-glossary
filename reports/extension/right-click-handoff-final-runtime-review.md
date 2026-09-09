# Right-click Handoff Final Runtime Review

독립 진단의 실제 `SUPPORTED` 결과를 기준으로 product extension도 selection 메뉴를 URL 조건 없이 등록한다. 클릭은 selectionText를 먼저 requestId 포함 `storage.session` payload로 저장한다.

- 열린 패널: `storage.onChanged`가 requestId가 다른 새 payload를 받아 검색 탭·input·exact 결과를 갱신한다.
- 닫힌 패널: 저장을 먼저 완료하고, Side Panel이 없을 때만 Codyssey main tab의 window에서 열기를 시도한다. 열기 실패 후에도 pending query는 보존되어 다음 수동 open에서 hydrate된다.
- 동일 query: 새 requestId로 두 번째 요청도 처리한다.
- alias: 수동 검색과 동일한 검색·normalization 경로를 사용한다.

권한은 `sidePanel`, `storage`, `contextMenus`, `search`로 유지하며 host permission 확대와 `<all_urls>`는 없다. 실제 최종 QA는 열린 패널의 HTML, 닫힌 패널의 JavaScript flow를 재확인한다.
