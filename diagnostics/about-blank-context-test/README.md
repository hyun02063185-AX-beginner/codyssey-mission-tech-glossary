# about:blank Context Menu Diagnostic

이 독립 확장은 페이지 접근 권한, content script, Side Panel, 검색 기능을 사용하지 않습니다. `contextMenus.onClicked`와 `info.selectionText`가 top-level `about:blank` popup에서 가능한지만 검사합니다. **Verdict: SUPPORTED on user Chrome environment as of 2026-09-09.**

## 설치

1. Chrome의 `chrome://extensions`에서 개발자 모드를 켭니다.
2. **압축해제된 확장 프로그램을 로드합니다**를 눌러 이 폴더를 선택합니다.
3. 확장 프로그램의 **서비스 워커** 링크를 열어 console을 확인합니다.

## 검증 A — 일반 페이지

1. `https://example.com`에서 보이는 문자열을 선택합니다.
2. 우클릭해 **선택 문자열 테스트: …** 메뉴가 활성화되어 있는지 확인하고 클릭합니다.
3. 서비스 워커 console 또는 `chrome.storage.local`의 `lastSelectionContextMenuEvent`에서 `selectionText`를 확인합니다.

## 검증 B — Codyssey popup

1. Codyssey에서 새 창으로 연 top-level `about:blank` popup의 `HTML`을 선택합니다.
2. 동일 메뉴의 활성 상태와 클릭 가능 여부를 확인합니다.
3. 클릭 뒤 `lastSelectionContextMenuEvent.selectionText === "HTML"`인지 확인합니다.

## 판정

- **SUPPORTED**: popup에서 `onClicked`와 `selectionText === "HTML"`이 모두 확인됨.
- **CHROME/POPUP LIMITED**: 일반 페이지는 통과하고 popup은 비활성 또는 이벤트 미발생.
- **ENVIRONMENT WIDE FAILURE**: 일반 페이지도 실패.

검사 결과를 `reports/extension/about-blank-feasibility-verdict.md`에 기록합니다. 이 확장은 페이지 본문을 읽거나 전송하지 않습니다.
