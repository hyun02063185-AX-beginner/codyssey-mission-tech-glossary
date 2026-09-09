# Chrome Side Panel v0.1.1 Runtime Repair

## 실제 사용자 발견 원인

검색 결과 HTML 변수 대신 정규화된 검색어 문자열을 `app.innerHTML`에 렌더링해 `localstorage` 같은 문자열만 보였다. 빈 검색도 requirements renderer가 아니라 빈 결과 renderer로 흘렀다.

## 수정 및 검증

- 기본 요구사항 탭에서 11개 요구사항, 23개 Quick Term, 질문, 체크 표시
- 용어검색 탭에서 빈 검색 안내와 glossary result card 표시
- `localStorage`, `Intersection Observer` 등은 case-insensitive term/English/alias 검색
- 체크는 `chrome.storage.local`에 저장하고 초기화 가능
- Manifest V3 0.1.1, build artifact의 manifest·sidepanel·glossary·openbook data 확인
- context menu는 기존 선택 텍스트 저장 구조를 유지

실제 Chrome에서 확장을 새로고침한 뒤 toolbar Side Panel 및 context menu 동작은 사용자가 다시 확인해야 한다.
