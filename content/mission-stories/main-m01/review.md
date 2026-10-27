# B1-1 미션 스토리 v0.2 — 자체 QA·출처·미검증 기록

> 대상: [storyboard-v0.2.md](storyboard-v0.2.md) · [sample/](sample/) · [assets/](assets/) · [preview/](preview/) · [_tools/](_tools/)
> 설계 승인 기준 커밋: `d76c0b4` · 작업 브랜치 `content/b1-1-three-pillars-story-content`
> 상태: **Claude 자체 QA 완료 · GPT 독립 검토 전 · Owner 시각 검수 전 · 웹 통합 전**
> 이 문서가 B1-1 Story의 QA·handover 기록이다. 별도 보고서를 만들지 않는다(학습 운영 정책 §7).

## 1. 다시 실행하는 법

```bash
cd content/mission-stories/main-m01/_tools
python3 -I build_figures.py          # 그림 16개(F1·F3·F4·F5-event·F5-dom·F6·F7·F8 × PC·모바일) 다시 만들기
node sample.cjs                      # 샘플 상태 ①② 만들기 + <body> 동일성·브라우저 동작 검사 + 캡처 5장
node preview.cjs                     # 그림 검사 + 원고 대조 + 인트로·12화면 미리보기(PC Dark·일부 Light·모바일)
node preview.cjs --check-only        # 검사만
```

실행 환경(이번 기록): macOS · Google Chrome 146.0.7680.165 · Playwright 1.63.0 · Python 3.12.13 · Node 24.22.1. 미리보기 글꼴은 저장소의 `src/assets/fonts/PretendardVariable.woff2`, 샘플 캡처는 시스템 글꼴.

## 2. 산출물 현황

| 구분 | 내용 | 상태 |
| --- | --- | --- |
| 강의 원고 | 인트로 + 4 Scene · 12화면. 화면마다 학습 질문·핵심 메시지·캡션·시각 자료·대체텍스트·강사 스크립트·학습자 접힘 설명·이해 확인·연결. 부록 A 확장 설명 E01~E05 원고, 부록 B 화면별 개념 수 | 완료 |
| 시연 샘플 | `sample/` 상태 ①②③, `css/style.css`, `js/menu.js`, `images/profile.svg`, README | 완료 |
| 캡처(F2) | `assets/captures/` 5장: state1-desktop · state2-desktop · state2-mobile · state3-mobile-closed · state3-mobile-open (2배율 PNG) | 완료 |
| 그림 | F1 세 역할 · F3 태그/구역(상태 `tags`·`structure`) · F4 규칙 한 줄 · F5-event 4단계 · F5-dom 파일과 DOM · F6 브라우저 통합 · F7 고친 파일↔화면 · F8 공개 — 각 PC(폭 1200, F5-dom은 600)·모바일(폭 360) | 완료 |
| 미리보기 | `preview/` PC 1280×720 Dark: 인트로+12 · Light: S1-2·S3-2·S4-1 · 모바일 390×844: 인트로+12 | 완료 |
| 개념지도 런타임 JSON | 설계(노드 14+3 · 관계 21 · 비교 4 · 확장 5) 그대로 유지. 데이터 등록은 웹 통합 단계 | 범위 밖 |

### 설계 대비 바뀐 점 (설계 문서는 고치지 않음 — GPT·Owner 확인 요청)

| 설계(v0.1-r1) | 제작 결과 | 이유 |
| --- | --- | --- |
| F5 한 장(S3-2), S3-3 그림은 별도 ID 없음 | **F5를 두 파일로 나눔**: `f5-event`(S3-2, 가로 4단계), `f5-dom`(S3-3, 세로형) | S3-3에서 실제 캡처 두 장과 파일/DOM 그림을 한 화면에 놓으려면 세로형이 필요했다. 가로형을 줄여 넣으면 글자가 12px까지 작아졌다 |
| F3는 S1-2만 | **F3 한 파일 두 상태**: `tags`(S1-2), `structure`(S1-3) | 설계 §B.3 S1-3의 구역 그림에 그림 ID가 없었다. 같은 화면 그림을 이어 쓰면 "같은 페이지"가 유지된다 |
| F4가 S2-2·S2-3을 함께 맡음 | F4는 S2-2만. S2-3은 **실제 캡처 둘(960px·390px) + 조건 칩** | 조건에 따른 변화는 실제 캡처가 더 정확하다 |
| F1은 인트로·S4-1 축소 반복 | F1은 인트로 전용. S4-1은 F6 | S4-1에 두 그림을 겹치면 화면이 과밀했다 |
| 설계 §C.3 `[제안]`: CSS 색에 Python 토큰을 피함 | **CSS = `--presentation-python`(파랑)**, HTML = real(금색), JS = app(초록), 강조 = accent(주황) | r1에서 Python은 강의 화면에서 빠지고 지도 확장 설명에만 남았다. 토큰 색 계열이 넷뿐이라 강조와 겹치지 않게 배정했다. 모양+글자로도 구분한다 |

## 3. QA 결과 (요청 12항목)

| # | 항목 | 결과 | 근거 |
| --- | --- | --- | --- |
| 1 | 12개 화면이 설계와 일치 | **PASS** | Scene·화면 번호·제목·학습 질문·핵심 메시지가 설계 §B.3과 대응. 화면 문구는 `screens.json`과 스토리보드를 `preview.cjs`가 글자 단위로 대조(PASS). 설계와 다른 점은 위 표에 기록 |
| 2 | 한 화면의 핵심 개념이 과도하지 않음 | **PASS** | 스토리보드 부록 B: 화면당 1~2개, Scene당 3개 |
| 3 | 같은 자기소개 페이지가 단계적으로 변화 | **PASS** | 모든 캡처가 `sample/` 하나에서 나옴. 그림 속 페이지(F3·F4·F7)도 같은 문구·구성을 다시 그림 |
| 4 | HTML 본문 동일성 | **PASS** | `sample.cjs`: 세 상태 `<body>` SHA-256 `10d854a141173d4e…`(1650자) 동일. `<head>` 차이는 ① `−link −script`, ② `−script`뿐 |
| 5 | 메뉴 기능의 실제 실행 | **PASS** | `sample.cjs`(Chrome): ③ 390px ☰ 클릭 → `nav class="site-nav is-open"`, `aria-expanded="true"`, 메뉴 표시. 두 번 클릭 → 닫힘. Tab 초점 + Enter로도 열림. 960px에서는 ☰ 숨김·메뉴 표시. 외부 요청 0 · 실패 요청 0 · 콘솔 오류 0 |
| 6 | HTML만으로 동작하는 링크와 JS 기능의 구분 | **PASS** | ① "프로젝트" 링크 클릭 → `#projects`, 구역 423px→164px. ② 960px "연락" 링크 → `#contact`, 530px→359px. ①·② ☰ 클릭 → 변화 없음(`aria-expanded` false 유지). 원고 S1-1·S3-1과 비교 카드 C04에 반영 |
| 7 | CSS가 DOM 자체를 수정한다고 설명하지 않음 | **PASS** | F6: CSS 선은 DOM에 닿지 않고 화면 표시로 감. DOM→스타일 계산은 점선 "요소를 고른다(읽기만)". F4 "선택자는 고르기만 · DOM은 바꾸지 않는다". S2-2·S4-1 원고에 명시. 금지 표현 검색(`CSS가/는 DOM을 바꾼/수정/변경`, `DOM에서 만난`) 결과 긍정 서술 0건 |
| 8 | 시맨틱 HTML과 시맨틱 웹을 동일시하지 않음 | **PASS** | 강의 본문에서 시맨틱 웹을 다루지 않음. 부록 A E01에서 "문서의 구조 vs 데이터의 의미, 별도 체계, 다음 단계 아님"으로 구분. 용어 ID 없음을 명시 |
| 9 | CSS와 JSON·YAML의 차이를 정확히 설명 | **PASS** | 부록 A E02: CSS = 브라우저가 해석하는 스타일 언어(선택자·조건·cascade), JSON·YAML = 범용 데이터 표현 형식(값의 뜻은 읽는 프로그램이 정함), 포함·상속 관계 아님 |
| 10 | JavaScript와 Python = 프로그래밍 언어라는 공통 분류 | **PASS** | 부록 A E03: 공통 분류와 실행 환경 차이, Node.js 언급, Python 브라우저 실행 가능성은 단정하지 않음("브라우저가 기본으로 실행하는 언어는 JavaScript") |
| 11 | 기존 B1-1 학습가이드·SVG 변경 없음 | **PASS** | `git diff d76c0b4 -- content/mission-guides src data content/terms content/peer-review` 변경 0. 기존 V01~V09는 복사·수정 없이 장 링크만 사용 |
| 12 | 큰 화면·모바일 시각 자료 가독성 | **부분 PASS · 시각 검수 미검증** | 자동: 모든 그림·상태에서 글자 상자/뷰박스 넘침·겹침 0, 표시 최소 폭 기준 글자 14px 이상. 실제 미리보기: 1280×720에서 13화면 세로 넘침 0, 그림 글자 실측 최소 14.5px(S4-1), 390px 가로 넘침 0, 모바일 그림 글자 15.9px. Claude가 미리보기 PNG를 눈으로 확인해 선 교차·흰 띠·글자 겹침 등을 고쳤다. **강의실 프로젝터·대형 모니터 실물, 실제 360px 기기, Owner 시각 검수는 미검증** |

## 4. 기술 사실 확인 (원고에 쓴 주장)

| 주장 | 확인 |
| --- | --- |
| 상태 ①에도 브라우저 기본 스타일이 있다 | `sample.cjs`: 작성자 CSS 0개인데 `h1` 굵기 700, 링크 색 `rgb(0, 0, 238)` |
| `h1 { font-size: 1.75rem; }`은 실제 규칙이다 | `sample/css/style.css`의 기본 `h1` 규칙(그 밖의 속성 생략). 768px 이상에서는 `2.25rem`이 덮는다 — S2-2 강사 메모에 기록 |
| 768px 조건으로 메뉴가 바뀐다 | `@media (min-width: 768px)`, `sample.cjs` 960px/390px 결과 |
| 메뉴는 `addEventListener` + 조건 판단으로 연다 | `sample/js/menu.js`의 `if … else`. `defer`로 연결 |
| 파일은 그대로, DOM이 바뀐다 | `sample.cjs`: 클릭 뒤 DOM `<nav class="site-nav is-open" …>`, `index.html` 해시 변화 없음 |
| GitHub Pages는 파일을 공개하고 결합은 브라우저에서 | 정적 호스팅의 일반 사실. 기존 가이드 Ch8 설명과 일치. Pages 설정 화면·요금제는 확인하지 않음(가이드 Ch8로 보냄) |
| 미션 요구(구역·768/1024·Flex/Grid·이벤트 3개·`addEventListener`·`defer`·Pages) | `data/raw/main/m01/m01-terminology-raw.md`, `content/peer-review/main-m01-openbook.yaml`. 미션 원문(Notion)은 다시 열지 않음 |

## 5. 출처

- 설계: `three-pillars-story-design-v0.1.md`, `three-pillars-concept-map-design-v0.1.md` (`d76c0b4`)
- 미션 근거: `data/raw/main/m01/m01-terminology-raw.md`, `data/raw/main/m01/source-manifest.md`, `content/peer-review/main-m01-openbook.yaml`
- 용어 ID: `data/curated/glossary-master-v0.1.yaml` (`preview.cjs`가 화면별 ID 실존 검사)
- 기존 가이드(연결 대상, 수정 없음): `content/mission-guides/main-m01/chapters/01~09`, V01~V09
- UI 기준: `docs/mission-guides/mission-ui-standard.md` v1.2 (Presentation Theme 토큰, Story 인트로, 모바일 기준)
- 제작 방식 참고: B6-1 `content/mission-stories/main-m11/_tools/` (SVG 생성·미리보기·검사 구조)

## 6. 미검증 · 확인 요청

| 항목 | 내용 |
| --- | --- |
| Owner 시각 검수 | 강의실 대형 화면·프로젝터에서 그림 한 장을 가리키며 설명할 수 있는지, 색 대비가 충분한지 |
| 실제 앱 렌더링 | 미리보기는 정적 흉내다. `MissionStoryOverview`·`PresentationSurface`·`LearningFocusNav` 안에서의 배치, Light/Dark 전환, 1000×720·360×800 크기는 웹 통합 때 확인 |
| 실제 기기 | 360px·390px 실물 기기, Safari·Firefox(캡처는 Chrome) |
| 강의 시간 | 화면당 2~3분, 전체 40~50분은 시범 수업 전 추정 |
| 미션 원문 | Notion 원문 재확인 없음. 1024px·Flex/Grid·이벤트 3개는 raw·openbook 근거 |
| 학습 효과 | 이해 확인 질문의 효과는 시범 수업에서 확인 |
| 개념지도 연결 | 스토리보드의 N/R/C/E ID는 설계 문서 기준이다. 런타임 데이터·화면 이동은 미구현 |
| 캡처 글꼴 | 샘플 캡처는 실행한 컴퓨터의 한글 글꼴을 따른다. 다른 OS에서 다시 만들면 모양이 조금 다를 수 있다 |

## 7. 학습 운영 정책 §7 — 콘텐츠 독립 검토 전 자체 점검

| 항목 | 결과 |
| --- | --- |
| 불필요한 선·용어·장식이 주의를 분산하지 않는가 | PASS(자체) — 화면당 그림 1개(S3-3만 캡처+그림), 확장 개념은 부록·지도 패널로 분리 |
| 흐름·관계 유형·기술 사실·실제 구현 경계 | PASS(자체) — 선 범례 고정, 단순화 표시, 샘플 실행 결과로 사실 확인 |
| 스토리 장면 ↔ 개념지도 ↔ 용어 ID | PASS — `preview.cjs`가 설계 ID·용어 ID 실존 대조 |
| 강사 시연 가능 · 강의 후 혼자 탐색 | PASS(자체) — 장면마다 강사 스크립트와 접힘 설명 분리, 샘플 탭 시연 절차 |
| GPT 독립 검토 · Owner 시각 검수 | **미검증** |
