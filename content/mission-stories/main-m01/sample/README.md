# B1-1 시연 샘플 — 김코디 자기소개 (교육용 예시)

B1-1 미션 스토리 강의에서 **같은 웹페이지가 단계적으로 바뀌는 모습**을 보여 주는 작은 실제 페이지다. 실제 인물이나 교육생 프로젝트가 아니다. 외부 라이브러리·외부 요청이 없고, 인터넷 없이 파일을 바로 열어도 동작한다.

## 파일

| 파일 | 상태 | 내용 |
| --- | --- | --- |
| `state-1-html.html` | ① HTML만 | 작성자 CSS·JS 연결 없음. 브라우저 기본 스타일만 보인다. 링크는 동작한다 |
| `state-2-css.html` | ② HTML + CSS | CSS 연결만 추가. 색·간격·배치, 768px 기준 반응형. ☰는 보이지만 눌러도 아무 일이 없다 |
| `index.html` | ③ HTML + CSS + JavaScript | `script defer` 연결까지. 좁은 화면에서 ☰를 누르면 메뉴가 열리고 닫힌다 |
| `css/style.css` | — | Mobile First 규칙. `@media (min-width: 768px)`에서 메뉴를 펼친다 |
| `js/menu.js` | — | 기능 하나: `addEventListener`로 버튼 클릭을 받아 `nav`의 `is-open`과 버튼의 `aria-expanded`를 바꾼다 |
| `images/profile.svg` | — | 프로필 일러스트(실제 인물 아님) |

**원본은 `index.html` 하나다.** `state-1-html.html`과 `state-2-css.html`은 `../_tools/sample.cjs`가 `index.html`에서 `<head>`의 연결 줄만 지워 만든다. 직접 고치지 않는다. 세 파일의 `<body>`는 글자 단위로 같다.

## 강의에서 여는 법

파일을 브라우저로 바로 연다(더블클릭 또는 브라우저 창에 끌어 놓기). 세 상태를 탭 세 개로 열어 두고 바꿔 가며 보여 준다.

- ① → ② 탭 전환: 본문 내용과 구조는 그대로, CSS 연결만 추가 (S2-1)
- ② 에서 창 폭을 768px 앞뒤로 바꾸기: 조건에 따라 다른 규칙 (S2-3)
- ② 좁은 폭에서 ☰ 누르기 → 변화 없음, 메뉴 링크 누르기 → 이동 (S3-1)
- ③ 좁은 폭에서 ☰ 누르기 → 열림·닫힘, 개발자 도구 Elements에서 `nav`의 `is-open` 확인, `Ctrl+U` 소스는 그대로 (S3-2·S3-3)

## 다시 만들기·검사·캡처

```bash
cd content/mission-stories/main-m01/_tools
node sample.cjs            # 상태 ①② 다시 만들기 + 검사 + 캡처 5장 다시 만들기 (../assets/captures/)
node sample.cjs --check    # 파일을 쓰지 않고 검사만 (저장된 상태 파일이 index.html과 맞는지 포함)
```

Playwright가 저장소 루트의 `node_modules`에 없으면 `PLAYWRIGHT=<playwright 패키지 경로>`를, Chrome 위치가 다르면 `CHROME=<실행 파일 경로>`를 붙인다. 캡처 글꼴은 실행한 컴퓨터의 글꼴을 따른다(이번 캡처: macOS의 기본 한글 글꼴).
