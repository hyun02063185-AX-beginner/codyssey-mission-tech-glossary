# Popup Auto Lookup v0.2.1 Review

- `match_about_blank` 및 `match_origin_as_fallback`으로 Codyssey origin popup 주입을 요청한다.
- content script는 URL·origin·top frame 여부만 readiness diagnostic으로 보낸다. 페이지 본문은 수집하지 않는다.
- 선택은 mouseup 뒤 120ms debounce, 2~100자, input/textarea/contenteditable 제외 조건으로 처리한다.
- M01 대표 용어 DOM·localStorage·Intersection Observer는 검색 카드에서 M01 맥락을 우선 표시한다.
- 실제 Codyssey 로그인 popup의 최종 주입 여부는 사용자 Chrome에서 확장 새로고침 후 확인해야 한다. 실패 시 `<all_urls>`로 확대하지 않고 context menu·수동 검색을 사용한다.
