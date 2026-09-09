# Codyssey about:blank Context Menu Feasibility Verdict

## Verdict: SUPPORTED

사용자 Chrome 환경(2026-09-09)에서 독립 MV3 진단 확장을 실제 검증했다.

- 일반 HTTPS 페이지: `selectionText === "HTML"`, `onClicked`와 local storage 기록 PASS.
- Codyssey top-level `about:blank` popup: 메뉴 클릭, `onClicked`, `selectionText === "HTML"` 모두 PASS.
- popup metadata: `pageUrl === "about:blank"`, `frameUrl === "about:blank"`, tabId·windowId 존재.

진단 확장은 host permission, content script, Side Panel 없이 `contextMenus`와 `storage`만 사용한다. 따라서 about:blank는 Chrome/Codyssey 제한이 아니며, product extension의 durable handoff 구현이 수정 대상이다.
