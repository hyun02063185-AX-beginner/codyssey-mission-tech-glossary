# B2-1 Story U4-A — 비공개 연결 기반과 왕복 검증

검증일: 2026-10-24 (Asia/Seoul). Windows PowerShell / `npm.cmd` / 실제 설치 Chrome 155.0.8059.85, headless.

## 기준과 결과

- 저장소: `hyun02063185-AX-beginner/codyssey-mission-tech-glossary`
- 브랜치·폴더: `content/b2-1-story-map-foundation`, `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`
- 기준 HEAD: `e5408511872b1c6da07d27ae269f4c84e9694af1`
- 시작 작업 트리 Clean. `git fetch origin` 후 지정 원격 브랜치와 차이 `0 / 0` 확인.
- **U4-A의 비공개 연결·왕복 검증 PASS. U4-B 진입 가능.** 정식 배치·문구는 D8, 공개 React 전환은 U5에 남긴다.
- 최종 커밋 SHA는 완료 응답에 기록한다. 로컬 커밋까지만 수행하고 Push·병합·배포하지 않는다.

필독 자료의 경계를 적용했다. Story는 개념, 용어사전은 지식 확장, 학습가이드는 실습·코드 검증을 맡는다. 기존 B3-1 복귀 코드의 방식을 읽어 재사용 경계를 확인했으며 수정하지 않았다.

## 변경 파일

| 파일 | 역할 |
| --- | --- |
| `src/b21StoryV3/links/catalog.ts` | 18개 용어·direct/extension·원고 근거 단계·보류 개념·가이드/분야 지도 sidecar |
| `src/b21StoryV3/links/returnAddress.ts` | 복귀 쿼리 생성·검증·정규화와 용어 href 순수 함수 |
| `src/b21StoryV3/links/contextLinks.ts` | 현재 장면/Scene 08 선택 영역의 검토용 연결과 실제 출발 위치 결합 |
| `src/b21StoryV3/B21StoryReturn.tsx` | 검증된 용어 경로에서만 표시하는 React Router `Link` 배너 |
| `src/b21StoryV3/links/connections.test.tsx` | 45개 테스트: 원문·그래프·가이드·주소·MemoryRouter 배너·B3 우선순위 |
| `scripts/b21-preview/main.tsx` | Owner Preview에 `U4 연결 검토` 선택 추가. 기존 기본값·진입 보존 |
| `scripts/b21-preview/U4LearningPreview.tsx` | 승인 무대 밖의 배치 후보 검토 패널과 비공개 목적지 분기 |
| `scripts/b21-preview/U4AppDestination.tsx` | 기존 `App`과 스타일을 lazy로 재사용하는 비공개 진입 |
| `scripts/b21-preview/u4-preview.css` | 신규 검토 패널·배너 스타일만 정의 |
| `scripts/check_b21_u4_browser.mjs` | 실제 Chrome의 연결·복귀·키보드·모바일·스타일 격리 검사 |
| `package.json` | `b21:u4-check` 명령 한 개 추가. 기존 scripts·의존성 불변 |
| 이 문서와 `reports/b21-u4-a/` | 카탈로그·검사 집계·이미지 증빙 |

U1의 단계 데이터에 `terms`·가이드 필드를 추가하지 않았다. 기존 U2 CSS·구조도·문장과 U3 라우팅/발표자 코드도 변경하지 않았다.

## 용어 카탈로그와 의미 경계

`direct`는 강의 개념과 대응하는 연결, `extension`은 범위 안내가 필요한 확장 연결이다. 아래 단계는 카탈로그의 근거 위치이며, 실제 링크의 복귀 값은 사용자가 출발한 **현재 단계**를 사용한다.

| 장면 | 용어 ID · 분류 | 근거 단계 |
| --- | --- | --- |
| 01 | `cli` direct | 2 |
| 02 | `module` extension | 11 |
| 02 | `repository-pattern` direct | 4 |
| 02 | `layered-architecture` extension | 5·6 |
| 03 | `crud` direct | 1 |
| 03 | `summary-aggregation` extension | 8 |
| 04 | `persistence` direct | 2 |
| 04 | `file-io` direct | 4 |
| 04·05 | `json-lines` extension | 04-6·05-jsonl |
| 04 | `csv` direct | 8 |
| 05 | `iterator` extension | iter |
| 05 | `generator` direct | gen |
| 05 | `yield` direct | give |
| 06 | `decorator` extension | deco |
| 06 | `function` direct | pass |
| 06 | `exception-handling` direct | err |
| 07 | `type-hint` direct | 1 |
| 07 | `input-validation` extension | 8 |

18개 모두 실제 `content/terms/<id>.md`, generated glossary와 graph의 `term:<id>` 노드가 일치한다. 파일명/ID·노드 termId·상세 존재·등록된 제목/영문/별칭과 Markdown 제목·한 줄 설명의 원문 대응을 검사했다. 대소문자와 등록된 한영 별칭을 인정하며 비슷한 ID로 대체하지 않는다.

extension에는 공통 안내 **“용어사전의 설명은 이 강의보다 넓을 수 있습니다.”**와 개별 주의를 함께 표시한다. `module`의 JavaScript 중심 설명, JSONL/Iterator의 메모리 일반화, Decorator 실행 시점, API 검증과 CLI 검증의 범위를 구분한다.

`layered-architecture`는 원본 후보 지도의 mode를 고치지 않고, sidecar에서 ‘한 역할의 정의가 아닌 계층 설계로의 확장’으로 안내했다. `summary-aggregation` 페이지는 일반적인 정보 압축 요약 설명이다. 강의의 금액 합계·분류별 계산과 같은 정의가 아니라는 문구를 명시했으며, 이 경계는 D8 문구 검토에서 특히 확인해야 한다.

보류: Iterable, `python -m`, argparse·옵션, 패키지·`__main__.py`·import, Model, 메모리, 재대입·함수 전달/반환·wrapper, 자료형 변환·Parameter/Argument, `__init__.py`, 반복. 보류 목록에는 링크를 만들지 않았다. `init`, `loop`, `main-py`, `python-cli` 등으로 대신 연결하는 것도 생성 함수에서 거부한다. 현재 장면 관련 용어의 이름을 표시하되 보류 개념 자체와 동일하다고 표시하지 않는다.

## 복귀 주소 계약

외부 경로는 고정된 `/terms/<승인 termId>`, 복귀 목적지는 고정된 `/missions/main-M03/story`다. `b21-story`의 값에는 `scene`, `step`, 선택적인 `back`만 담는다.

```text
/terms/generator?b21-story=scene%3D08%26step%3D6
/terms/iterator?b21-story=scene%3D05%26step%3Diterable%26back%3D6
```

- 생성은 `URLSearchParams`로 한 번만 인코딩한다. 별도 `encodeURIComponent`를 겹치지 않는다.
- 파싱은 외부 쿼리에서 한 번 꺼낸 값을 해석한다. 다시 `decodeURIComponent`로 풀지 않는다.
- 실제 단계인지 검증하고, 유효한 05/06 과거 숫자 주소는 U3 규칙으로 정규화한다. 유효하지 않은 값은 U3처럼 첫 단계로 복구하지 않고 **복귀 배너를 거부**한다.
- 출발 장면·단계·복습 `back`을 보존한다. `view=presenter`는 생성 때 제거하고 복귀 payload에서 받지 않는다.
- 외부 URL, 경로·fragment, 중첩/미등록 쿼리, 중복 키, 잘못된 단계/복귀 값, 두 번 인코딩한 payload는 거부한다. payload 512자 제한을 둔다.
- 배너는 승인된 18개 `/terms/<id>` 페이지와 유효한 `b21-story`가 있을 때만 표시한다.
- `b31-map`이 동시에 있으면 값이 비었더라도 B21 배너를 숨긴다. 실제 기존 App이 B3-1 배너를 렌더링한다. B3 코드·목적지는 그대로다.
- 모든 이동은 React Router `Link`다. 복귀는 정상적인 PUSH이며, 새로고침·뒤로/앞으로로 주소를 복원한다. `history.state`를 직접 덮어쓰거나 무조건 `navigate(-1)`을 하지 않는다.

단위 테스트는 전체 **128단계 × 18개 용어 = 2,304개** 생성·파싱 왕복을 확인했다. 05/06의 의미 ID, 허용된 `back`, 발표자 flag 제거를 포함한다. MemoryRouter에서 배너의 실제 href·표시 조건·B3-1 우선순위도 검사했다.

## 가이드와 분야 지도

실제 `missionGuidePaths['main-m03']` 및 기존 `missionGuideContent`의 장 목록과 대조했다.

| Scene | 연결 장 |
| --- | --- |
| 01 | `01-cli-execution` |
| 02 | `09-ledger-overview` |
| 03 | `02-transaction-crud`, `05-search-summary` |
| 04 | `03-file-persistence` |
| 05 | `04-generator-streaming` |
| 06 | `07-decorator-error-handling` |
| 07 | `08-type-hint-validation` |
| 08 | `09-ledger-overview` |

8개 고유 장을 실제 기존 App 화면에서 모두 열었다. 장 이름이 없는 경로를 추측해 연결하지 않았다. 가이드의 정의·코드·기존 링크를 수정하지 않았다.

Scene 04·05·08의 `/maps/data-database?mission=main-m03`을 기존 registry 및 실제 화면에서 확인했다. 지도 전용 Story 복귀 배너를 만들지 않았으며, **브라우저 뒤로가기를 사용한다**고 안내한다.

## 실제 Chrome 왕복과 디자인 보호

- 18개 용어 각각: Story 출발 → 실제 App 용어 화면 → 배너 → 정확한 출발 단계. 용어 페이지의 실제 제목도 확인.
- Scene 08-6 → Generator → 새로고침 → Scene 08-6.
- Scene 08-6 → Scene 05 Iterable 복습(`back=6`) → Iterator 용어 → 새로고침 → Scene 05 Iterable(`back=6`) → 개념지도 08-6.
- 복습 위치와 용어·복귀 항목 사이 뒤로/앞으로 2회 반복.
- 잘못된/외부/중첩/이중 인코딩 쿼리에는 배너 없음. 실제 B3-1 배너 우선 및 기존 목적지 확인.
- 가이드 8개 고유 장과 세 장면의 분야 지도 진입·브라우저 뒤로 복귀.
- 1280·390·360px에서 배치 후보 선택, 가로 넘침 없음, 키보드 Enter 왕복과 질문 초점 복귀.
- 새 브라우저 context에서 실제 App의 스타일이 처음 로드되기 전/왕복 후를 비교해, **세 폭 모두 강의 무대 PNG 바이트 동일**을 확인했다.

테스트용 가짜 용어 페이지를 사용하지 않았다. `U4AppDestination`이 기존 `App`과 기존 스타일을 lazy 재사용한다. 비공개 wrapper가 Story만 U3 강의로 분기하며 공개 `App.tsx`는 불변이다.

## Owner Preview 검토 방법과 D8 제안

```powershell
npm.cmd run b21:preview
npm.cmd run b21:u4-check
```

기본 Preview `http://127.0.0.1:4179/`에서 **U4 연결 검토**를 선택한 뒤 장면·단계·너비를 고른다. 기존 기본 선택 `v3 React 강의`, Foundation 및 Router 검사는 유지한다.

직접 왕복 검토:

```text
http://127.0.0.1:4179/?view=v3-links#/missions/main-M03/story?scene=08&step=6
http://127.0.0.1:4179/?view=v3-links#/missions/main-M03/story?scene=05&step=iterable&back=6
```

현재 패널은 승인된 무대 **바깥**에 있다. ‘강사 노트 선택형 심화’, ‘Scene 08 선택 영역 옆’, ‘장면 정리 단계 아래’를 선택해 해당 맥락의 연결을 검토할 수 있지만, 정식 위치에 장착한 화면은 아니다. 실제 강사 노트 대본·그림·학습자 문장은 수정하지 않았다.

D8에서 결정할 제안:

1. 기본 무대에는 버튼을 추가하지 않고 강사 노트의 선택형 심화에 장면 관련 용어를 제공한다.
2. Scene 08 선택 영역 옆에는 관련 용어와 강의 복귀 안내를, 장면 정리 아래에는 실습·검증 가이드를 구분해 둔다.
3. 분야 지도에는 ‘돌아오려면 브라우저 뒤로가기’를 유지한다. 전용 배너는 별도 범위다.
4. 공개 연결 후 Scene 08의 기존 ‘미연결’ 문구를 바꿀지 별도 콘텐츠 승인으로 결정한다. 문구 후보는 ‘관련 용어로 더 살펴보고, 복귀 링크로 원래 강의 위치에 돌아올 수 있습니다.’다. 현재 원고에는 적용하지 않았다.
5. extension 공통 문구와 개별 경계, 특히 계층 구조·요약의 설명 범위를 정식 사용자 문구로 확정한다.

## 테스트 PASS·FAIL·SKIP

| 검사 | 결과 |
| --- | --- |
| `b21:validate` | PASS — Foundation 9단위·16 SVG |
| `b21:v3-validate` | PASS — 8장면·128단계·기존 숫자 대응 16/13 |
| `b21:eol-check` | PASS — LF·CRLF 입력, 원래 바이트 복원 |
| `b21:v3-parity` | PASS — 384화면·5,269단언·오류 0 |
| `b21:router-check` | PASS — 209검사, 발표자 창·주소·복습 동작 유지 |
| `b21:html-qa` | PASS — 기존 6,402단언, 1280/390/360 모두 PASS |
| `npm.cmd test` | PASS — 21파일·300테스트, U4 신규 45개 포함 |
| `npm.cmd run build` | PASS — 기존 큰 청크 경고 유지, Foundation 별도 빌드 검사도 PASS |
| `b21:browser-check` | PASS — 실제 Chrome Foundation 63검사 |
| `b21:u4-check` | PASS — 위치·동선 카운터 84개와 Playwright의 제목·배너·URL·초점·가시성 단언, 오류 0 |
| 네이티브 macOS·물리 프로젝터 | SKIP — Windows/headless 환경 |
| D8 정식 배치·원고 변경, U5 공개 장착 | 범위 밖 — 수행하지 않음 |

최종 FAIL은 없다. 원문 제목과 canonical 표시명이 다른 경우는 대소문자 및 등록된 한영 별칭으로 검사했으며, 원본 용어나 그래프를 고쳐 맞추지 않았다.

## 보호 범위와 U4-B 판단

기준 HEAD 대비 다음은 Git 내용 차이 0이다: U1 원고·128단계·해시, v3 독립 HTML/QA·구조도, U2 무대/CSS, U3 라우팅/복습/발표자, `App.tsx`, `missionLearning.ts`, 기존 공개 B2-1 Story, B3-1 코드, 용어 Markdown, 기존 가이드·분야 지도·generated data, 다른 미션·확장·배포 설정·Actions·의존성·lockfile.

`data:build`로 생긴 33개 generated JSON의 CRLF 차이는 각각 HEAD와 CRLF→LF 동등성을 검증한 후 해당 경로만 복원했다. 사용자 미커밋 데이터를 삭제하거나 일괄 복원하지 않았다.

[검사 집계](../../reports/b21-u4-a/results.json), [카탈로그와 URL 예](../../reports/b21-u4-a/catalog.json), [390px 연결 패널](../../reports/b21-u4-a/context-panel-390.png), [실제 용어 화면과 복귀 배너](../../reports/b21-u4-a/term-390.png), [1280px 검토 화면](../../reports/b21-u4-a/review-1280.png), [390px](../../reports/b21-u4-a/review-390.png), [360px](../../reports/b21-u4-a/review-360.png)를 보존한다. 전체 실행 로그와 384화면은 `node_modules/.cache/`에 있다.

**U4-B 진입 가능:** 링크 카탈로그·검증·비공개 왕복 기반이 준비됐다. 정식 배치·Scene 08 문구는 D8 승인 후 콘텐츠 단계에서, 공개 전환과 배너 장착은 U5에서 진행한다. 현재 공개 서비스가 새 Story로 전환됐다고 주장하지 않는다.
