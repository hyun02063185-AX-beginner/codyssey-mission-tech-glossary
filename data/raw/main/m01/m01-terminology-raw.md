# 본과정 M01 기술용어 원천 추출 — Pilot

- 과정: 본과정
- 미션: M01 — 나를 소개하는 웹페이지 처음부터 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 본과정 M01~M13 공통 추출 포맷 검증
- 추출 상태: pilot / raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M01 — 나를 소개하는 웹페이지 처음부터 만들기`
- 원칙: 공식 요구사항에 직접 등장한 용어와 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니라 원천 추출 데이터다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| HTML | HTML | Web | language/markup | 핵심 | 순수 HTML/CSS/JavaScript만 사용 | 보통 |
| CSS | CSS | Web | language/style | 핵심 | 순수 HTML/CSS/JavaScript만 사용 | 보통 |
| JavaScript | JavaScript | Programming/Web | language | 핵심 | 인터랙션과 상태 변경 구현 | 보통 |
| React | React | Web | library/framework | 보조 | 사용 금지 외부 라이브러리 예시 | 불필요 |
| Vue | Vue | Web | framework | 보조 | 사용 금지 외부 라이브러리 예시 | 불필요 |
| jQuery | jQuery | Web | library | 보조 | 사용 금지 외부 라이브러리 예시 | 불필요 |
| Bootstrap | Bootstrap | Web | framework | 보조 | 사용 금지 외부 라이브러리 예시 | 불필요 |
| Tailwind | Tailwind CSS | Web | framework | 보조 | 사용 금지 외부 라이브러리 예시 | 불필요 |
| index.html | index.html | Web | source-file | 핵심 | 기본 프로젝트 파일 구조 | 불필요 |
| css/ | CSS directory | Tool/Structure | directory | 보조 | 파일 역할 분리 | 불필요 |
| js/ | JavaScript directory | Tool/Structure | directory | 보조 | 파일 역할 분리 | 불필요 |
| images/ | images directory | Tool/Structure | directory | 보조 | 이미지 자산 역할 분리 | 불필요 |
| defer | defer | Web | attribute | 핵심 | JavaScript 연결 방식으로 명시 | 좋음 |
| Hero | Hero section | Web/UX | concept | 보조 | 필수 페이지 섹션 | 불필요 |
| About | About section | Web/UX | concept | 보조 | 필수 페이지 섹션 | 불필요 |
| Skills | Skills section | Web/UX | concept | 보조 | 필수 페이지 섹션 | 불필요 |
| Projects | Projects section | Web/UX | concept | 보조 | 필수 페이지 섹션 | 불필요 |
| Contact | Contact section | Web/UX | concept | 보조 | 필수 페이지 섹션 및 폼 | 불필요 |
| Footer | Footer | Web | semantic/layout | 보조 | 필수 페이지 섹션 | 불필요 |
| 시맨틱 태그 | Semantic HTML | Web | concept | 핵심 | 페이지 구조 요구 | 좋음 |
| 모바일 퍼스트 | Mobile First | Web/UX | concept | 핵심 | 반응형 구현 기준 | 좋음 |
| 768px / 1024px 브레이크포인트 | Breakpoint | Web/CSS | concept | 핵심 | 반응형 레이아웃 전환 기준 | 좋음 |
| Flexbox | CSS Flexbox | Web/CSS | layout | 핵심 | 네비게이션 레이아웃 구현 | 좋음 |
| Grid | CSS Grid | Web/CSS | layout | 핵심 | 프로젝트 카드 레이아웃 구현 | 좋음 |
| 햄버거 메뉴 | Hamburger Menu | Web/UX | pattern | 보조 | 모바일 네비게이션 구현 | 보통 |
| 부드러운 스크롤 | Smooth Scroll | Web/UX | behavior | 보조 | 페이지 이동 인터랙션 | 불필요 |
| 스크롤 탑 | Scroll-to-top | Web/UX | behavior | 보조 | 스크롤 인터랙션 | 불필요 |
| 네비게이션 스타일 변화 | Navigation State Styling | Web/UX | behavior | 보조 | 스크롤/상태 기반 UI 변화 | 보통 |
| 다크모드 | Dark Mode | Web/UX | concept | 핵심 | 테마 기능 구현 및 유지 | 좋음 |
| Intersection Observer | Intersection Observer API | Web API | API | 핵심 | 스크롤 애니메이션 구현 | 좋음 |
| Contact 폼 | Contact Form | Web | UI/form | 핵심 | 입력·검증 구현 | 보통 |
| 필수값 검증 | Required-field Validation | Programming/Web | concept | 핵심 | 폼 입력 검증 | 좋음 |
| 이메일 검증 | Email Validation | Programming/Web | concept | 핵심 | 폼 입력 검증 | 보통 |
| 에러 메시지 | Error Message | UX | concept | 보조 | 사용자 근처 오류 표시 | 보통 |
| GitHub API | GitHub API | Web/API | API | 핵심 | 외부 데이터 호출 | 좋음 |
| fetch | Fetch API | Web API | API/function | 핵심 | GitHub API 호출 | 좋음 |
| async/await | async / await | Programming | syntax/concept | 핵심 | 비동기 API 호출 | 좋음 |
| 로딩 상태 | Loading State | Programming/UX | state | 핵심 | API 호출 상태 UI | 좋음 |
| 성공 상태 | Success State | Programming/UX | state | 핵심 | API 호출 상태 UI | 보통 |
| 에러 상태 | Error State | Programming/UX | state | 핵심 | API 실패 상태 UI | 좋음 |
| 빈 상태 | Empty State | Programming/UX | state | 핵심 | 데이터 없음 상태 UI | 좋음 |
| localStorage | Web Storage / localStorage | Web API | storage | 핵심 | 다크모드 설정 영속화 | 좋음 |
| 사용자 이벤트 | User Event | Programming/Web | concept | 핵심 | 이벤트 → 상태 변경 흐름 | 좋음 |
| 상태 변경 | State Change | Programming | concept | 핵심 | 사용자 인터랙션 처리 | 좋음 |
| 화면 업데이트 | UI Update | Programming/Web | concept | 핵심 | 상태 변경 결과 반영 | 좋음 |
| DOM 업데이트 | DOM Update | Web | concept | 핵심 | 미션 목적에 직접 명시 | 좋음 |
| GitHub Pages | GitHub Pages | Deployment | service | 핵심 | 실제 웹 배포 요구 | 좋음 |
| 반응형 | Responsive Web Design | Web/UX | concept | 핵심 | 배포본 검증 대상 | 좋음 |
| 인터랙션 | Interaction | Web/UX | concept | 핵심 | 배포본 검증 대상 | 보통 |
| const | const | Programming | keyword | 핵심 | var 대신 사용 요구 | 보통 |
| let | let | Programming | keyword | 핵심 | var 대신 사용 요구 | 보통 |
| var | var | Programming | keyword | 보조 | 사용 지양 대상으로 명시 | 보통 |
| onclick | inline onclick handler | Programming/Web | event-handler | 보조 | 사용 지양 대상으로 명시 | 좋음 |
| addEventListener | addEventListener | Web API | method | 핵심 | 이벤트 처리 권장 방식 | 좋음 |
| 인라인 스타일 | Inline Style | Web/CSS | concept | 보조 | 사용 금지 | 보통 |
| 비인증 호출 | Unauthenticated API Request | API/Security | concept | 보조 | GitHub API 제한 조건 | 보통 |
| 시간당 60회 제한 | API Rate Limit | API | concept | 핵심 | GitHub API 호출 제한 | 좋음 |
| 403 | HTTP 403 | Network/Web | status-code | 보조 | API 제한 초과 시 고려할 오류 상태 | 좋음 |
| README | README | Tool/Docs | document | 핵심 | 제출물 필수 문서 | 불필요 |
| GitHub 저장소 URL | GitHub Repository URL | Git | artifact/link | 핵심 | 공식 제출물 | 불필요 |
| 배포 URL | Deployment URL | Deployment | artifact/link | 핵심 | 공식 제출물 | 불필요 |
| 스크린샷 | Screenshot | Tool/Docs | artifact | 보조 | 데스크톱/모바일/다크모드 제출 증거 | 불필요 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

> 아래 항목은 미션 원문에 동일 표기가 직접 나오지 않거나, 원문 표현보다 일반적인 기술 개념으로 정리한 후보이다.

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| CSS Media Query | Web/CSS | 768px/1024px 브레이크포인트 구현의 일반적 수단 | 좋음 |
| DOM | Web | JavaScript가 화면 요소를 읽고 바꾸는 대상 | 좋음 |
| Event Handler | Programming/Web | 사용자 이벤트를 실제 코드 동작으로 연결 | 좋음 |
| Form Validation | Programming/Web | 필수값·이메일 검증을 포괄하는 상위 개념 | 좋음 |
| Asynchronous Programming | Programming | fetch와 async/await의 동작 배경 | 좋음 |
| Promise | Programming | fetch와 async/await 이해의 핵심 배경 | 좋음 |
| Client-side Storage | Web | localStorage가 속하는 상위 저장 개념 | 보통 |
| UI State | Programming/UX | 로딩/성공/에러/빈 상태를 하나의 개념으로 이해 | 좋음 |
| Deployment | Deployment | 로컬 파일을 GitHub Pages에서 공개 서비스로 전환 | 좋음 |
| HTTP Request / Response | Network/Web | GitHub API 호출·403 상태를 이해하는 배경 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| CSS Cascade | Web/CSS | CSS 기본 동작 원리 확장 | 보통 |
| Accessibility / a11y | Web/UX | 시맨틱 HTML과 폼 UX 확장 학습 | 좋음 |
| REST API | API | GitHub API를 더 넓은 API 개념으로 확장 | 좋음 |
| JSON | Data | API 응답 데이터 형식을 이해할 때 자주 연결 | 보통 |
| Browser Rendering | Web | DOM/CSS/UI 업데이트가 화면에 보이는 과정 확장 | 좋음 |
| Event Loop | Programming | async/await와 비동기 실행을 더 깊게 이해 | 좋음 |
| HTTP Status Code | Network/Web | 403을 다른 상태 코드와 연결 | 좋음 |
| Rate Limiting | API | API 사용량 제한의 일반 개념 | 좋음 |

---

## 4. Pilot 판단

### 포맷상 유지할 항목
본과정 M02~M13에도 아래 컬럼을 동일하게 사용한다.

- 원문 표기
- 표준명 후보
- 분야 후보
- 유형 후보
- 중요도
- 미션 내 맥락
- source status: direct / required / related
- 웹툰 후보
- 비고 / 확인 필요

### 추출 시 주의
1. `Hero`, `About`, `Skills`처럼 단순 섹션명은 “기술용어” 가치가 낮으므로 나중에 curated 단계에서 제외될 수 있다.
2. 금지 대상으로 등장한 기술(React, Vue, jQuery 등)도 미션 맥락상 의미가 있으므로 raw에는 보존한다.
3. `403`, `60회 제한`처럼 숫자·상태값은 독립 용어가 아니라 상위 개념(`HTTP Status Code`, `Rate Limit`)에 병합될 수 있다.
4. `로딩/성공/에러/빈 상태`는 raw에서는 각각 보존하되 curated 단계에서 `UI State` 아래에 묶을 수 있다.
5. `direct`는 원문 근거가 명확해야 하며, AI가 알고 있는 배경지식을 direct로 승격하지 않는다.
6. `required`와 `related`는 본문 작성 단계가 아니라 원천 맥락 보존을 위한 보조 분류다.

---

## 5. Pilot 결론

M01 기준으로는 단순 명사 추출보다 다음 원칙이 적합하다.

> **미션 원문에 나온 기술 표현을 최대한 보존하고, 실제 학습에 필요한 상위·배경 개념은 required/related로 분리한다.**

이 포맷을 M02~M13에 동일 적용한 뒤 전체 13개 미션 추출이 끝나면
`Master Glossary DB v0.1` 단계에서 중복 제거와 표준화를 수행한다.
