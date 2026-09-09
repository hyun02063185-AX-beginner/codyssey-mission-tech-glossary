# about:blank 선택 메뉴 진단

## 원인 범위

저장소에서 `enabled`, `contextMenus.create`, `contextMenus.update`, URL 패턴, `tab.url`, `pageUrl`, `frameUrl`을 조사했다. 기존 코드에는 메뉴를 URL로 비활성화하는 경로는 없었지만, 메뉴 정의가 설치 시에만 생성되어 확장 프로그램 reload 뒤 stale menu 상태가 남을 수 있었다.

## 수정

- service worker 시작·설치·Chrome 시작 시 `contextMenus.removeAll()` 뒤 재등록한다.
- 정의는 `contexts: ['selection']`, `enabled: true`이며 URL 패턴을 사용하지 않는다.
- 클릭 시 `info.selectionText` 원문과 공백 정리 query를 session diagnostic에 기록하고, pending query도 `storage.session`에 저장한다. 페이지 본문·URL 이력은 기록하지 않는다.
- 열린 Side Panel은 `storage.onChanged`로 갱신한다.
- 닫힌 경우에만 `runtime.getContexts({ contextTypes: ['SIDE_PANEL'] })`로 판별하고, `https://usr.codyssey.kr/*` 탭을 찾아 그 main windowId로 panel open을 시도한다. about:blank popup windowId는 사용하지 않는다.

## 검증 상태

정적 빌드 검증은 메뉴 활성화 정의, stale menu 제거, selectionText 기록, session pending query, main-window fallback을 확인한다. 실제 Chrome에서 `about:blank`의 HTML 선택 메뉴가 활성화되고 클릭된 뒤 input과 exact result가 바뀌는 최종 확인은 확장 새로고침 후 수행해야 한다.
