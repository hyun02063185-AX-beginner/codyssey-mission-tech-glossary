# Chrome Side Panel 설치

1. `npm run build:extension`을 실행합니다.
2. Chrome에서 `chrome://extensions`를 엽니다.
3. 개발자 모드를 켭니다.
4. **압축해제된 확장 프로그램을 로드합니다**를 누르고 `dist-extension`을 선택합니다.
5. 확장 아이콘을 누르면 오른쪽 Side Panel에서 M01 오픈북을 사용합니다.

업데이트 뒤에는 다시 build한 뒤 `chrome://extensions`에서 확장 프로그램 새로고침을 누릅니다. 어떤 페이지에서든 용어를 선택하고 우클릭한 뒤 **코디세이 사전에서 찾기**를 누르면 선택어를 Side Panel 검색어로 전달하고 패널을 엽니다. 이 흐름은 페이지의 content script에 의존하지 않으므로 `about:blank`에서도 Chrome이 선택 메뉴를 제공하는 경우 사용할 수 있습니다. Codyssey 페이지에서의 선택 감지는 보조 편의 기능이며, 공식 조회 방식은 우클릭 메뉴입니다. 이 확장은 페이지 내용·URL·개인정보를 서버로 전송하지 않습니다.
