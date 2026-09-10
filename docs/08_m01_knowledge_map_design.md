# 08. M01 Knowledge Map 정보설계

## 목적과 범위

이 문서는 M01 Open-book의 Quick Terms를 큰 기술 지도의 첫 지역으로 배치하기 위한 데이터·UI 계약이다. 지도 UI, React Flow/Cytoscape 의존성, Web 화면, Chrome Extension은 이 Sprint의 범위가 아니다.

M01의 공식 mission node는 `content/peer-review/main-m01-openbook.yaml`에서 실제로 읽은 23개 Quick Terms다. `data/curated/mission-term-map-v0.1.yaml`의 68개 wider relation은 보존하며, 이 지도에서는 Quick Terms를 새 목록으로 바꾸지 않는다. 해당 map의 `direct`/`required`/`related` 기록은 생성 inventory에 그대로 남긴다.

## 데이터 계약

- Source graph: `data/knowledge-maps/main-m01/knowledge-map.json`
- Derived inventory: `data/knowledge-maps/main-m01/term-inventory.json`
- Inventory generator: `scripts/build_m01_knowledge_map_inventory.py`
- Validator: `scripts/validate_m01_knowledge_map.py`

`nodeOrigin: "mission"`은 M01 Quick Term, `nodeOrigin: "foundation"`은 이해를 위한 제한된 상위·기반 개념이다. Foundation node에는 반드시 `foundationRationale`이 있다. `termId`는 mission node에만 있으며 기존 canonical glossary ID를 참조한다.

각 edge에는 `from`, `relation`, `to`, `reason`, `confidence`, `evidenceType`, `source`가 있다. `source`의 `repo:` 값은 저장소 내 source, URL은 공식 표준·문서 또는 명시적인 architectural inference의 근거다. 관계 정의는 graph의 `relationOntology`가 canonical이다. 특히 `is_a`는 종류 관계에만, `provided_by`는 API 공급자에만, `uses`는 실제 소비 관계에만 쓴다.

## Region 모델

| Region | Mission terms | 지도에서의 역할 |
| --- | ---: | --- |
| Document & Structure | 4 | HTML·의미·defer·DOM의 문서 기반 |
| Presentation & UI | 8 | CSS, 레이아웃, 반응형, 테마, 폼 |
| JavaScript Language | 1 | JavaScript 언어의 위치 |
| Browser & Web APIs | 2 | 이벤트와 관찰 API |
| Async Execution | 1 | async/await의 실행 흐름 |
| Network & External API | 4 | Fetch·GitHub API·HTTP 오류/제한 |
| State & Persistence | 2 | UI 상태와 localStorage |
| Development / Platform | 1 | GitHub Pages 배포 |

Primary region은 한 개만 둔다. 예를 들어 DOM은 문서 구조가 주 학습 맥락이어서 Document & Structure에 두지만 Browser & Web APIs와 연결선으로도 드러난다. 교차 영역 때문에 node를 중복 배치하지 않는다.

## Technology layer 모델

Layer는 기존 glossary의 category/type이 아니라 기술의 성격을 설명한다. 이 그래프는 `markup-language`, `style-language`, `language`, `language-feature`, `syntax`, `web-api`, `protocol`, `platform`, `service`, `standard`, `concept`을 사용한다. 예를 들어 JavaScript는 `language`, ECMAScript는 `standard`, async/await는 `language-feature`, Fetch와 localStorage는 `web-api`, GitHub API는 `service`다.

## 전국지도 UI 제안 (구현 보류)

- Region은 고정된 큰 영역 또는 줌아웃 가능한 군집이다. 색만으로 의미를 전달하지 않고 region label을 항상 함께 둔다.
- City/node는 label, origin marker(M01 또는 Foundation), technology layer badge를 표시한다. mission node는 상세 페이지가 있는 canonical `termId`를 가진다.
- Road/edge는 relation label을 hover/focus와 selected state에서 읽을 수 있게 한다. `mission_uses`, `prerequisite`, `based_on`은 핵심 도로(Highway), `compare_with`와 `evolved_from`은 보조 도로/타임라인으로 분리한다.
- Timeline은 전체 node에 강제하지 않고 JavaScript·async/await·Fetch·localStorage에만 `evolved_from` edge를 사용한다. 이것은 단순 연대표가 아니라 비교 가능한 문제·설계 변화다.
- Term 선택 시 해당 node와 1-hop edge를 강조하고, 옆 패널에 region, layer, standard/provider, relation reason, confidence, evidence source를 표시한다. 선택하지 않은 node는 유지하되 대비를 낮춘다.
- 모바일은 한 화면에 전체 canvas를 조작하기보다 region list → 선택 region → node detail의 3단계 탐색을 기본으로 하며, 전체 지도는 축소 미리보기로 제공한다.

## 대표 학습 경로

### Route A — 문서에서 상호작용까지

`HTML → Semantic HTML → DOM → addEventListener → Form Validation`

문서의 의미 있는 구조를 먼저 만들고, 브라우저가 이를 DOM으로 표현한 뒤 이벤트로 사용자 행동을 연결한다. 마지막에는 입력 결과를 DOM 근처에 피드백하는 M01 Contact Form으로 연결된다.

### Route B — 외부 데이터를 화면에 보여 주기까지

`JavaScript → Promise → async/await → Fetch API → HTTP → GitHub API → UI State`

async/await는 Promise를 대체하는 종류가 아니라 Promise 기반 결과를 소비하는 문법이다. Fetch가 GitHub API에 HTTP 요청을 보내면 응답·오류·빈 결과를 UI state로 분리해 M01 프로젝트 영역에 보여 준다. Rate Limiting과 HTTP 403은 이 경로의 실패 분기다.

### Route C — 반응형 표현과 선택값 유지

`CSS → Mobile First → Breakpoint / Media Queries → Flexbox / Grid → Responsive Web Design → Dark Mode → localStorage`

모바일 기준의 CSS에서 콘텐츠가 바뀌는 지점에 breakpoint를 두고, 한 축 정렬(Flexbox)과 2차원 배치(Grid)를 선택한다. 테마는 CSS로 표현하고 사용자의 선택은 localStorage로 유지한다.

### Route D — 배포본에서 검증하기

`HTML + CSS + JavaScript → GitHub Pages`

로컬 파일이 아니라 공개된 정적 배포본에서 화면 크기, DOM 상호작용, 테마 유지, GitHub API 상태를 점검한다. GitHub Pages는 언어·API가 아니라 이를 제공하는 platform node다.

## 상세 페이지 연결

기존 HashRouter는 `#/terms/:termId`를 지원한다. 향후 Term detail에는 graph node를 찾아 다음의 읽기 전용 블록을 추가할 수 있다.

- 이 기술은 어디에 있나: Region, Technology Layer, Standard / Provider
- 왜 생겼나: 선택된 `evolved_from` 또는 problem-oriented relation만 표시
- 무엇에서 왔나: Timeline edge와 confidence/evidence
- 무엇과 연결되나: CS Foundation 및 1-hop 관계
- 지도에서 보기: M01 map selected term URL

이 Sprint는 위 블록을 Web UI에 추가하지 않는다.

## Evolution / 기술 계보 정책

계보 edge를 실제로 적용한 mission term은 **async/await, Fetch API, localStorage**다. 각각 Callback Pattern, XMLHttpRequest, Cookie와의 비교 가능한 변화로만 표현하고, 세 edge는 모두 `MEDIUM` / `architectural-inference`다. 이는 "A가 생겨서 B가 만들어졌다"는 단일 인과 주장이 아니다.

JavaScript는 `defined_by → ECMAScript`로 표준화 위치를 표현한다. JavaScript가 ECMAScript에서 단순히 "진화했다"고 쓰면 등장과 표준화의 시간관계를 흐리므로 `evolved_from`으로 쓰지 않는다. DOM·브라우저 API·defer도 이번 M01 지도에서 근거 없는 연표를 추가하지 않고 각각 DOM Standard, Web Platform, HTML Standard의 규범적 연결로 남긴다. 이후 날짜가 있는 1차 역사 자료를 별도 검증할 때만 timeline metadata를 추가한다.

## Deep Link URL 계약

HashRouter 기준으로 다음 contract를 제안한다. public GitHub Pages base URL은 아직 확정하지 않으므로 절대 URL을 데이터에 하드코딩하지 않는다.

| 목적 | Hash URL contract |
| --- | --- |
| 용어 상세 | `#/terms/<termId>` |
| M01 지도 | `#/maps/main-m01` |
| 선택된 M01 지도 노드 | `#/maps/main-m01?term=<termId>` |

Chrome Side Panel이 나중에 deep link를 만들 때는 `WEB_GLOSSARY_BASE_URL` 같은 배포 환경 config와 위 hash path를 조합한다. base URL이 없으면 링크를 만들지 않거나 현재 사이트 origin을 명시적으로 주입한다. Chrome 구현·설정 변경은 보류한다.

## 품질 게이트

`npm run knowledge-map:validate`는 Quick Term coverage, 중복/미지 node·edge, relation/evidence 값, foundation rationale, region/layer, orphan, duplicate edge, 의도하지 않은 방향성 cycle을 검사한다. 현 graph의 historical inference 3건은 모두 `MEDIUM`으로 표시하며 UI에서 HIGH 근거와 동일하게 보이지 않게 한다. LOW confidence edge는 현재 없다.

검증 전 확인할 고위험 관계는 다음과 같다.

1. `async/await → Promise`: prerequisite이지 `is_a`가 아니다.
2. `Fetch API → Web Platform`: browser API 제공 관계이지 JavaScript 언어의 하위 종류가 아니다.
3. `Fetch API ↔ HTTP`: M01에서는 HTTP를 사용하지만 Fetch 자체가 HTTP만을 뜻하지는 않는다.
4. `HTTP 403 → HTTP`: HTTP 상태 코드의 정의 관계이며 Rate Limiting 그 자체가 아니다.
5. `localStorage ↔ Cookie`: 비교/역사 맥락이지 같은 저장소나 필연적 대체 관계가 아니다.
6. `Fetch → XMLHttpRequest`, `async/await → Callback Pattern`: 직접적인 단일 인과가 아닌 비교 가능한 설계·역사 맥락이다.
7. Flexbox와 Grid: 모두 CSS 레이아웃이지만 서로 `is_a`가 아니다.

## 다음 Sprint 제안 (실행하지 않음)

**M01 Knowledge Map Web Visualization Sprint**에서 이 graph를 read-only 입력으로 사용해 map route, selected-node panel, keyboard/mobile 탐색, term-detail back link를 구현한다. 그때도 graph source의 relation/evidence와 Chrome Extension을 별도 변경 범위로 유지한다.
