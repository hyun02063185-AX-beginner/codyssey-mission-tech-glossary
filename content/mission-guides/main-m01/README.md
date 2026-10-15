# B1-1 학습 가이드 — AI가 만든 웹사이트, 이제 내가 이해하고 설명하기

> 미션: **본과정 M01(B1-1) — 나를 소개하는 웹페이지 처음부터 만들기** (`main-m01`)
> 상태: **Chapter 1~8과 전체 통합 장 · V01~V09 제작 완료** · Owner·GPT 검토 중인 초안
> 제작 기준 문서(내부용): [scenario-v1.0.md](scenario-v1.0.md)

---

## 이 가이드는 무엇을 위한 것인가

AI의 도움으로 만든 웹사이트가 **어떤 구조로, 어떻게 동작하는지** 이해하고, **실제 코드에서 근거를 찾아 자기 말로 설명**할 수 있게 돕습니다.

| 하는 것 | 하지 않는 것 |
| --- | --- |
| 완성된 기능을 보고, 원리를 이해하고, **내 프로젝트에서 코드 위치를 찾기** | 코드를 처음부터 쓰는 방법 가르치기 |
| 개념과 개념 사이의 **연결(역할·순서·대응)** 이해하기 | 문법 암기 |
| AI에게 **"설명만" 시키고**, 답을 **직접 확인**하기 | AI 답을 그대로 믿기 |

**대상** IT와 프로그래밍 지식이 거의 없고, AI를 활용해 B1-1을 수행하는 코디세이 교육생
**쓰는 사람** 학습자(각 장), 강사(`instructor-notes.md`)

---

## 이 가이드를 읽는 방법

한 장의 글이 **모바일에서는 핵심 이해**, **PC에서는 코드 분석**으로 이어지도록 구성했습니다. 별도의 모바일용·PC용 원고는 없습니다.

| | 이렇게 읽으세요 |
| --- | --- |
| 📱 **이동 중 (모바일)** | 각 장의 **핵심 그림과 핵심 개념 설명**까지 읽습니다. 질문으로 시작하는 짧은 도입, 그림, 개념 설명이 "미션이 요구하는 …" 절 앞까지 이어집니다. 이것만으로 장의 핵심을 이해할 수 있습니다 |
| 💻 **컴퓨터 앞에서 (PC)** | 뒷부분의 **💻 표시가 붙은 직접 확인 절**과 **"내 프로젝트에서 …찾아보기"** 절을 읽으며 내 프로젝트의 파일·함수·CSS 규칙을 직접 찾아봅니다 |

각 장의 흐름은 대체로 이렇습니다. 장마다 내용에 맞게 제목이 달라집니다.

1. **질문으로 시작**합니다. AI가 만든 사이트에서 궁금했을 법한 질문입니다.
2. **핵심 그림(SVG)** 으로 전체 구조를 먼저 봅니다.
3. 개념을 **하나씩** 풀어 설명합니다.
4. 컴퓨터에서 **직접 확인**하고, **내 프로젝트의 코드 위치**를 찾는 방법을 안내합니다.
5. **AI에게 물어볼 질문**, **동료평가에서 보는 점**, **핵심 내용 정리**로 마무리합니다.

## 목차

| 장 | 제목 | 이 장의 질문 | 시각 자료 |
| --- | --- | --- | --- |
| [Chapter 1](chapters/01-website-structure.md) | 웹사이트는 어떤 파일들로 만들어질까? | HTML만으로도 화면이 나오는데 CSS와 JavaScript는 왜 필요할까? | [V01](assets/v01-web-components.svg) 세 가지 역할 구조도 |
| [Chapter 2](chapters/02-html-semantics.md) | 웹페이지의 구역은 코드에서 어떻게 구분될까? | 화면의 구역은 어떤 기준으로 구분할까? | [V02](assets/v02-html-structure.svg) 화면 구역 ↔ HTML 대응도 |
| [Chapter 3](chapters/03-responsive-layout.md) | 화면 크기에 따라 디자인이 달라지는 이유 | 같은 사이트가 PC와 모바일에서 다르게 보이는 이유는? | [V03](assets/v03-responsive-layout.svg) 폭별 배치 비교도 |
| [Chapter 4](chapters/04-event-dom-flow.md) | 버튼을 누르면 화면은 어떻게 바뀔까? | 클릭했다는 사실을 JavaScript는 어떻게 알고 반응할까? | [V04](assets/v04-event-dom-flow.svg) 이벤트·DOM 흐름도 |
| [Chapter 5](chapters/05-theme-persistence.md) | 다크모드는 왜 새로고침 후에도 유지될까? | 페이지를 다시 열어도 다크모드를 기억하는 이유는? | [V05](assets/v05-theme-persistence.svg) 테마 전환·복원 흐름도 |
| [Chapter 6](chapters/06-form-validation.md) | 입력한 정보가 올바른지 어떻게 확인할까? | 사용자가 잘못 입력한 정보는 어떻게 확인할까? | [V06](assets/v06-form-validation.svg) 정상·오류 입력 분기 흐름도 |
| [Chapter 7](chapters/07-github-api-flow.md) | 외부 서버 정보가 웹사이트에 나타나는 과정 | GitHub에 있는 데이터가 내 웹사이트에 어떻게 나타날까? | [V07](assets/v07-github-api-flow.svg) 요청·응답 구조도, [V07 보조](assets/v07-ui-states.svg) 네 가지 화면 상태 |
| [Chapter 8](chapters/08-deploy-github-pages.md) | 웹사이트가 인터넷에 공개되는 과정 | 내 컴퓨터에서 만든 사이트를 다른 사람은 어떻게 볼까? | [V08](assets/v08-deploy-flow.svg) 로컬 → 공개 흐름도 |
| [전체 통합](chapters/09-website-overview.md) | 하나의 웹사이트를 한눈에 보기 | 이 기술들은 하나의 웹사이트 안에서 어떻게 함께 일할까? | [V09](assets/v09-website-overview.svg) 전체 구조도, [V09 PC용](assets/v09-website-overview-wide.svg) 전체 관계도 |

> **앞뒤 장의 연결** — `defer`(1장)가 4장의 "요소를 찾지 못하는 오류"로, class 토글(4장)과 CSS 변수(3장)가 5장 다크모드로, `preventDefault`(4장)가 6장 폼으로, "라이브러리가 아닌 데이터 요청"(1장)이 7장 API로, 경로 문제(1장)와 localStorage의 주소별 분리(5장)가 8장 배포 점검으로 이어집니다. V09는 이 모든 조각을 하나로 모읍니다.

---

## 표기 규칙

### 출처 태그

원고의 주장·요구가 어디서 왔는지 구분합니다. 근거 없이 경험을 창작하지 않습니다.

| 태그 | 뜻 |
| --- | --- |
| `[공식]` | M01 **미션 요구사항**과 **동료평가 확인 문항**. 저장소의 [`content/peer-review/main-m01-openbook.yaml`](../../peer-review/main-m01-openbook.yaml)·[`data/raw/main/m01/`](../../../data/raw/main/m01/m01-terminology-raw.md), 그리고 B1-1 Notion 동료평가 항목에 근거가 있는 것. 필수 **구현** 조건인지, 동료평가에서 **설명을 요구받는** 항목인지는 해당 자리에서 구분해 적습니다 |
| `[시나리오]` | 시나리오 v1.0에는 있으나 **위 자료에서 직접 확인하지 못한 것**. 미션 원문 확인이 필요합니다 |
| `[사전]` | 기존 **기술용어사전**([`content/terms/`](../../terms/))의 정의·설명을 근거로 한 것 |
| `[권장]` | 품질·학습을 위한 **일반적 설계 권고**. 미션이 요구하거나 평가가 요구하는 조건이 **아닙니다** |
| `[AI 보충]` | 이해를 돕기 위해 **교육적으로 덧붙인** 설명·활동·비유 |

> "필수 구현 조건"과 "동료평가 확인 문항"은 다릅니다. 예를 들어 CSS 변수는 동료평가에서 **사용 이유를 설명해야 하는 항목**이지만, 이 저장소의 자료만으로는 **필수 구현 조건**이라고 확정할 수 없습니다.

### 코드와 그림의 종류

| 표시 | 뜻 |
| --- | --- |
| 🔷 **일반화 예제** | 개념을 보여 주려고 **새로 쓴** 코드. 특정 교육생의 실제 프로젝트 코드가 아닙니다 |
| **교육용 단순화 모델** | 실제 동작을 이해하기 쉽게 줄여 그린 그림 (예: V04의 6단계) |
| **내 프로젝트의 코드** | 학습자가 **직접 찾아서** 채우는 부분. 이 가이드에는 실제 학습자 코드를 싣지 않았습니다 |

> 이 폴더의 코드 블록은 **모두 일반화 예제**입니다. 클래스 이름(`menu-toggle`, `is-open` 등)과 파일 이름(`css/style.css` 등)은 **가정**이며 내 프로젝트와 다를 수 있습니다.

### 시각 자료의 선

| 선 | 뜻 | 쓰는 그림 |
| --- | --- | --- |
| 점선 화살표 | 파일이 파일을 **불러옴** / 미리 **등록**해 둠 / 저장소와 값을 **주고받음** / 파일을 **공개**함 (구조·준비·저장 관계) | V01, V04, V05, V09 |
| 실선 화살표(번호) | **실행 순서** | V01 ②, V04 ①~⑥, V05~V08 |
| 양쪽 화살표 | **요청 ↔ 응답** 또는 서로 주고받음 | V09 |
| 표식이 달린 짧은 선 | 화면 구역 ↔ 담당 역할·요소의 **대응** | V01 ③, V02 |
| 점선 테두리 상자 | 안에 다른 요소를 **담는 부모**(V02), 또는 **저장소·오류·빈 결과** 같은 특별한 영역(V05~V09) | V02, V05, V07, V09 |

구조 관계와 실행 순서를 같은 선으로 그리지 않습니다. 색뿐 아니라 **글자·모양·선 종류**로도 구분되고, 어두운 화면 설정에서도 읽을 수 있습니다.

---

## 폴더 구성

```
content/mission-guides/main-m01/
├─ README.md                  이 문서
├─ scenario-v1.0.md           원본 기준 시나리오 보존본 (수정하지 않음)
├─ instructor-notes.md        강사용 설명·강조 포인트
├─ chapters/
│   ├─ 01-website-structure.md
│   ├─ 02-html-semantics.md
│   ├─ 03-responsive-layout.md
│   ├─ 04-event-dom-flow.md
│   ├─ 05-theme-persistence.md
│   ├─ 06-form-validation.md
│   ├─ 07-github-api-flow.md
│   ├─ 08-deploy-github-pages.md
│   └─ 09-website-overview.md     전체 통합 (V09)
└─ assets/
    ├─ v01-web-components.svg
    ├─ v02-html-structure.svg
    ├─ v03-responsive-layout.svg
    ├─ v04-event-dom-flow.svg
    ├─ v05-theme-persistence.svg
    ├─ v06-form-validation.svg
    ├─ v07-github-api-flow.svg
    ├─ v07-ui-states.svg          V07 보조 (네 가지 화면 상태)
    ├─ v08-deploy-flow.svg
    ├─ v09-website-overview.svg   모바일용 세로형
    └─ v09-website-overview-wide.svg  PC용 전체 관계도
```

---

## 사용법

1. **짧은 시간이라면** 각 장의 핵심 그림과 핵심 개념 설명까지만 읽어도 됩니다.
2. **내 사이트를 열어 두고** 읽으면 설명이 훨씬 잘 이해됩니다. 💻 표시가 붙은 절은 따라 하면 눈으로 보이는 확인 방법입니다.
3. **AI에게 물을 때는** ① 수정하지 말고 설명만, ② 파일 이름과 줄 번호, ③ 내 화면의 동작과 연결해서, ④ 답은 가설이므로 직접 확인 — 네 가지를 지킵니다. (1장)
4. **원본 프로젝트는 건드리지 않습니다.** 실험은 복사본에서 합니다.
5. 각 장 뒷부분의 **동료평가 절**에 실제 동료평가 질문과 설명 예시가 있습니다. 내 사이트의 실제 이름으로 바꿔 말해 보면 됩니다.

## 관련 기술용어사전 항목

각 장에서 링크한 사전 항목입니다. 사전 본문은 이 작업에서 **수정하지 않았습니다.**

`html` · `css` · `javascript` · `index-html` · `defer` · `semantic-html` · `dom` · `css-media-query` · `mobile-first` · `breakpoint` · `css-flexbox` · `css-grid` · `user-event` · `event-handler` · `add-event-listener` · `state-change` · `browser-rendering` · `intersection-observer-api` · `smooth-scroll` · `event-propagation` · `prevent-default` · `dark-mode` · `local-storage` · `client-side-storage` · `form-validation` · `html-form` · `email-validation` · `input-validation` · `error-message` · `github-api` · `fetch-api` · `async-await` · `promise` · `asynchronous-programming` · `json` · `http-request-response` · `http-get` · `http-status-code` · `http-status-code-403` · `rate-limiting` · `ui-state` · `xss` · `git` · `commit` · `repository` · `push` · `github` · `github-pages` · `deployment` · `absolute-relative-path`

---

## 제작 범위와 경계

- **만든 것**: Chapter 1~8 원고, 전체 통합 장, V01~V09 SVG(V07 보조 포함, V09는 모바일용과 PC용), 강사용 노트, 시나리오 보존본, 이 README
- **건드리지 않은 것**: 웹 UI(React·CSS·라우팅), canonical 사전, 기존 기술지도·개념 연결 데이터. 이 폴더는 콘텐츠와 SVG만 담고 있으며, 서비스 화면에는 아직 연결되지 않았습니다.

## 검토가 필요한 항목

| 항목 | 내용 | 위치 |
| --- | --- | --- |
| CSS 변수 | B1-1 Notion의 **동료평가 항목에 CSS 변수(`:root`) 사용 이유를 설명하는 문항**이 있습니다 `[공식]`. 다만 이를 **필수 구현 조건**으로 볼 수 있는지는 저장소의 M01 원천·openbook 자료로 확인하지 못했습니다. 이 가이드는 "동료평가 확인 문항"으로 다룹니다 | 3장 |
| 외부 폰트·아이콘 | "외부 UI·프레임워크 라이브러리 사용 금지"에 외부 웹폰트·아이콘이 포함되는지 저장소 자료로는 확정할 수 없습니다 | 1장 3-6 |
| 라이브러리 사용 여부 확인 | `https://` 검색만으로는 충분하지 않으므로 `script`·`link`, `import`·`require`, 의존성 파일, 내려받은 파일을 함께 확인하도록 안내했습니다. 실제 판정 기준은 미션 원문 확인이 필요합니다 | 1장 3-6 |
| `.style` 직접 사용 | "inline style 없이" 요구가 JavaScript의 `element.style` 직접 지정까지 포함하는지 확정할 수 없습니다 | 4장 5-4 |
| 일반화 예제의 구성 | Hero 위치, 카드 열 수(1·2·3열), 메뉴 방식, 클래스 이름은 일반화 가정입니다. 실제 교육생 프로젝트 사례로 교체하려면 동의된 코드 확보가 필요합니다 | 2~4장 |
| 실제 학습자 질문 기록 | 저장소에 B1-1 학습자 질문 로그가 없어, 각 장 첫머리의 질문은 시나리오 v1.0과 미션 요구에서 가져왔습니다 | 전 장 |
| SVG 설계 기준 | V01~V09(PC용 V09 제외)는 폭 360 기준 세로형으로 설계했고, 360·390px와 큰 화면(1280px)에서 렌더링해 확인했습니다. 서비스 화면에 연결할 때는 앱 안에서 다시 확인해야 합니다 | assets |
| 개발자 도구 안내 | 단축키·탭 이름은 Chrome 기준입니다. Edge는 대체로 같고 Safari·Firefox는 다를 수 있습니다 | 1~8장 |
| 폼의 실제 전송 | 저장소 자료로는 Contact 폼이 메시지를 **실제 전송**해야 하는지 확정할 수 없습니다. 6장은 "검증 통과 ≠ 전송 성공"으로 구분해 설명합니다 | 6장 |
| 깜빡임을 줄이는 방법 | 테마를 일찍 적용하는 방법이 미션의 `defer` 연결 요구와 양립하는지는 미션 원문 확인이 필요합니다 | 5장 |
| README에 들어갈 내용 | 미션은 README를 필수 문서로 요구하지만 세부 항목은 저장소 자료에 없어, 8장의 항목은 `[권장]`으로 표시했습니다 | 8장 |
| GitHub Pages 설정 화면 | Settings → Pages의 화면 이름과 요금제 조건은 GitHub 업데이트로 바뀔 수 있어 공식 문서 확인을 안내했습니다 | 8장 |
| V09 PC용 그림 | 세로형만으로는 관계 파악이 어려워 PC용 전체 관계도를 추가했습니다. 불필요하다면 삭제해도 본문 흐름은 유지됩니다 | 전체 통합 |
