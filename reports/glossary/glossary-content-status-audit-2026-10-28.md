# Glossary content_status 전수 감사 — 2026-10-28

- 기준: `main` `5283190`, 작업 브랜치 `feature/glossary-browser-rendering-status-audit`.
- 원본: [`glossary-master-v0.1.yaml`](../../data/curated/glossary-master-v0.1.yaml). 확장자는 YAML이지만 `json.loads`로 읽은 `terms`에서 `content_status == "raw"`를 추출했다.
- 전체 canonical **523**, `drafted` **488**, `raw` **35**. 아래 표는 추출한 35개 전부이며 예시 ID만 선택하지 않았다.
- 결과: **메타데이터 갱신 후보 33개 / 콘텐츠 보완 필요 2개 / 정책 확인 필요 0개**. 기술 검수 완료나 서비스 공개 승인을 뜻하는 판정은 아니다.
- **Canonical 무변경**: 이번 산출물은 감사와 권고이다. 35개 일괄 변경은 요청 범위에서 금지되었고, 후보 33개의 실제 상태 동기화도 별도 Owner 검토 대상으로 남긴다. 기존 488/35를 유지한다.

## 기존 상태 정의와 비교 근거

[`docs/02_glossary_data_model.md` §6](../../docs/02_glossary_data_model.md)은 `raw`를 “원천 추출만 완료”, `drafted`를 “설명 초안 작성”으로 정의한다. `reviewed`는 기술 검수 완료이며 별개다. **정의가 없는 상황은 아니다.** 다만 모든 용어에 동일한 코드 절 수나 동일한 깊이를 요구하는 `drafted` 전환 체크리스트는 확인되지 않았다.

[`docs/07_content_layer_model.md`](../../docs/07_content_layer_model.md), [`scripts/build_content_tier_plan.py`의 TIER_SPECS](../../scripts/build_content_tier_plan.py), [Sprint 9](glossary-content-batch-s7-b02-sprint9.md), [Sprint 16](glossary-content-batch-s7-b09-sprint16.md)을 함께 참조했다. Tier별 깊이는 다르고 코드 대신 구체적인 시나리오·비교가 설명 기능을 할 수 있다. 이를 근거 없이 새 상태 모델이나 자동 승격 규칙으로 적용하지 않았다.

기존 `drafted` 표본을 실제 본문과 비교했다.

| 비교 표본 | 실제 내용 | 이번 감사에 주는 기준 |
| --- | --- | --- |
| [`promise`](../../content/terms/promise.md) | 상태·then/catch/await·fetch 오류 구분, 미션·관련 용어·질문. 독립 코드/주의 절은 없음 | 코드 절 부재만으로 `raw` 유지 사유가 되지는 않는다. 비동기·HTTP 계열 후보의 설명 성숙도가 유사하거나 더 구체적이다. |
| [`react-state`](../../content/terms/react-state.md) | setter 코드, 렌더링·직접 변경·읽는 시점의 경계와 질문 | `react-props`, `let`, `const` 등도 소유·변경 규칙을 예로 구분하는 초안 수준에 도달한다. |
| [`mutex`](../../content/terms/mutex.md) | acquire/try/finally/release 예, 임계 구역 경계와 질문 | `thread`의 주석 한 줄은 실행·경쟁을 보여 주지 못하므로 보완 우선으로 분류했다. |

표본 비교와 공식 정의를 합치면, 35개를 미작성으로 집계하는 것은 본문 증거와 맞지 않는다. 반대로 파일과 절이 있다는 사실만으로 35개를 충분하다고 판단할 수도 없다. 이번 “콘텐츠 보완 필요”는 작성 흔적 부정이 아니라, 상태 동기화와 함께 처리할 실질적 결함을 우선 표시한 것이다.

## 35개 전체 검토

**공통 확인**: 35/35에 상세 Markdown 파일, 한 줄 설명·쉽게 설명하면·정확한 설명·미션 맥락 4절의 실제 본문이 있다. 35/35에 관련 용어·흔한 오해·동료평가 질문도 있다. 각 파일을 읽고 정의와 사례의 연결, 미션에서 하는 일, 경계 설명, 질문의 구체성을 비교했다. 독립 “주의” 절이 없더라도 다른 절의 실질적인 경계를 확인했다.

아래 `코드`는 독립 코드 예 절의 존재, `주의`는 독립 주의 절의 존재다. `없음`은 다른 절의 사례나 경계까지 없다는 뜻이 아니다. 파일 링크를 ID에 붙였고, “실제 내용과 판정 이유”에 그 차이를 기록했다. “후보”는 **메타데이터 갱신 후보**, “보완”은 **콘텐츠 보완 필요**다.

| ID (상세 파일) | 코드 | 주의 | 작성 이력 | 판정 | 실제 내용과 판정 이유 |
| --- | --- | --- | --- | --- | --- |
| [`asynchronous-programming`](../../content/terms/asynchronous-programming.md) | 없음 | 없음 | H1 | 후보 | 콜백·Promise·await와 병렬 처리의 차이, 로딩 UI 흐름을 설명한다. 코드 없이도 배달 비유와 3단계 동작 사례가 구체적이다. |
| [`concurrency`](../../content/terms/concurrency.md) | 있음 | 있음 | H2 | 후보 | Promise.all로 I/O 대기를 겹치는 예와 단일 core·parallelism·공유 상태 경계를 설명한다. |
| [`const`](../../content/terms/const.md) | 있음 | 있음 | H2 | 후보 | 객체 속성 변경과 binding 재할당을 코드로 구분하고 deep freeze와의 차이를 명시한다. |
| [`cookie`](../../content/terms/cookie.md) | 있음 | 있음 | H2 | 후보 | Set-Cookie 예, Domain·Path·보안 속성과 서버 session의 역할 차이가 있다. |
| [`curl`](../../content/terms/curl.md) | 있음 | 있음 | H1 | 후보 | 실제 URL 요청과 옵션 역할, JSON Content-Type 및 브라우저 CORS 차이를 설명한다. |
| [`data-integrity`](../../content/terms/data-integrity.md) | 있음 | 있음 | H2 | 후보 | FK·CHECK SQL 예로 참조와 값의 규칙을 보여 주고 UI 검증만으로 부족한 이유를 설명한다. |
| [`database-index`](../../content/terms/database-index.md) | 있음 | 있음 | H2 | 후보 | CREATE INDEX와 조회·쓰기 tradeoff, selectivity·optimizer 조건을 다룬다. |
| [`database-session`](../../content/terms/database-session.md) | 없음 | 없음 | H1 | 후보 | ORM session의 flush·commit·rollback·close와 연결 풀을 구분한다. 코드가 없어도 요청 수명·예외 상황이 구체적이다. |
| [`dependency-injection`](../../content/terms/dependency-injection.md) | 있음 | 없음 | H1 | 후보 | repository 전달 예와 생성/사용 책임 분리, 테스트 대체 효과를 설명한다. |
| [`event-handler`](../../content/terms/event-handler.md) | 있음 | 없음 | H1 | 후보 | 클릭→등록 함수→DOM 변경의 실제 메뉴 그림과 addEventListener 예, target/currentTarget 질문이 있다. |
| [`event-loop`](../../content/terms/event-loop.md) | 있음 | 있음 | H1 | 후보 | A/B/microtask/task 출력 예와 stack·대기열·0ms 타이머 경계가 있다. 정밀한 전체 스케줄링 명세를 대체하는 글은 아니다. |
| [`function`](../../content/terms/function.md) | 있음 | 있음 | H2 | 후보 | 입력 범위를 검증하는 Python 함수와 호출·지역 scope·side effect 경계가 있다. 익명 함수까지 포괄하는 표현은 후속 다듬기 가능하다. |
| [`http`](../../content/terms/http.md) | 없음 | 있음 | H1 | 후보 | 메시지 구성·stateless·TLS·HTTP/3 예외와 실제 TCP 80 미션을 설명한다. 코드 부재를 미작성 근거로 삼을 수 없다. |
| [`http-get`](../../content/terms/http-get.md) | 있음 | 없음 | H1 | 후보 | 조회·멱등성·URL query와 실제 요청 예가 있다. safe의 설명은 업무 상태 변경 관점의 입문용 단순화다. |
| [`http-post`](../../content/terms/http-post.md) | 있음 | 없음 | H1 | 후보 | JSON fetch 예, 중복 제출·재시도와 201/200/204 응답을 구분한다. |
| [`http-request-response`](../../content/terms/http-request-response.md) | 있음 | 없음 | H1 | 후보 | 요청 메시지 예와 서버 처리 흐름, 응답 수신과 404 성공 여부의 차이를 설명한다. |
| [`http-status-code`](../../content/terms/http-status-code.md) | 없음 | 없음 | H1 | 후보 | 1xx~5xx 및 403/404 사례, fetch resolve와 HTTP 성공의 차이가 있다. 별도 코드 없이도 진단 질문이 구체적이다. |
| [`https`](../../content/terms/https.md) | 없음 | 없음 | H1 | 후보 | TLS의 기밀성·무결성·서버 인증과 XSS/권한 검사의 한계를 설명한다. 코드보다 보호 범위 비교가 중심이다. |
| [`json-request-response`](../../content/terms/json-request-response.md) | 있음 | 없음 | H1 | 후보 | response.json 예와 Content-Type·schema·상태 검사 필요성을 연결한다. |
| [`json-web-token`](../../content/terms/json-web-token.md) | 있음 | 있음 | H2 | 보완 | 서명·암호화 구분과 claim 검증 설명은 유용하나 JWT 전체를 3부분의 서명 형식으로 단정한다. JWS 예라고 범위를 한정하거나 JWE도 가능한 점을 보완해야 한다 [외부 근거 E1]. |
| [`let`](../../content/terms/let.md) | 있음 | 있음 | H2 | 후보 | 재할당 코드와 block scope, const와의 차이를 설명한다. |
| [`login-session`](../../content/terms/login-session.md) | 있음 | 있음 | H2 | 후보 | cookie 식별자와 server store를 나란히 보여 주고 로그아웃·만료·무효화 경계를 설명한다. |
| [`module`](../../content/terms/module.md) | 있음 | 없음 | H1 | 후보 | import/export 예와 ESM/CommonJS·순환 의존성 경계를 설명한다. 예의 두 줄이 서로 다른 파일이라는 표기는 후속 다듬기 권장이다. |
| [`process`](../../content/terms/process.md) | 있음 | 있음 | H2 | 후보 | ps -ef로 관찰하고 address space·프로그램 파일·thread·container 경계를 설명한다. |
| [`queue`](../../content/terms/queue.md) | 있음 | 있음 | H1 | 후보 | push/shift의 FIFO와 BFS 사용을 설명하고 shift 비용 및 Task Queue와의 차이를 명시한다. |
| [`react-props`](../../content/terms/react-props.md) | 있음 | 있음 | H2 | 후보 | Greeting 예, 부모 소유·읽기 전용·callback을 통한 변경 요청을 설명한다. |
| [`request-response-cycle`](../../content/terms/request-response-cycle.md) | 없음 | 없음 | H1 | 후보 | 라우팅→검증/로직→응답의 3단계 시나리오와 오류 응답·트랜잭션 경계를 설명한다. 네트워크 왕복과 구분한다. |
| [`rest-api`](../../content/terms/rest-api.md) | 없음 | 없음 | H1 | 후보 | 리소스·stateless·일관된 interface와 GET /users/42, POST /users 비교 질문이 있다. 코드 절 없이도 의미 비교 사례를 제공한다. |
| [`schema`](../../content/terms/schema.md) | 있음 | 없음 | H1 | 후보 | users 테이블의 PK·NOT NULL·UNIQUE 예와 DB/API schema, 호환성 경계를 설명한다. |
| [`stack`](../../content/terms/stack.md) | 있음 | 없음 | H1 | 후보 | push/pop LIFO 코드와 DFS·Call Stack 차이 및 재귀 한계를 설명한다. |
| [`tcp`](../../content/terms/tcp.md) | 있음 | 있음 | H2 | 후보 | byte stream·순서·재전송·IP/port 역할, HTTP/3 예외와 실제 인바운드 규칙을 설명한다. |
| [`thread`](../../content/terms/thread.md) | 주석만 | 있음 | H2 | 보완 | 자원 공유·동기화 경계는 있으나 코드 예는 lock 필요성을 말하는 주석 한 줄뿐이다. counter 경쟁을 보여 주는 실제 코드/진행 순서와 각 thread의 실행 상태 예시가 필요하다. |
| [`user-event`](../../content/terms/user-event.md) | 있음 | 없음 | H1 | 후보 | submit 핸들러 예와 키보드·터치·접근성, 합성 이벤트와 실제 상호작용의 차이가 있다. |
| [`var`](../../content/terms/var.md) | 있음 | 있음 | H2 | 후보 | if 블록 밖에서 읽는 코드로 함수 scope를 보여 주고 let과의 선택 기준을 질문한다. |
| [`variable`](../../content/terms/variable.md) | 있음 | 있음 | H2 | 후보 | 재할당 예와 binding·reference·scope/lifetime 차이를 설명한다. |

### Placeholder와 반복 문장 확인

35개 한 줄 설명과 정확한 설명 본문은 각각 35개 모두 서로 다르다. “코디세이 미션에서 반복해 쓰이는 핵심 개념입니다”, “미션에서 필요한 순간에 이 개념을 하나의 역할 단위로 구분해 생각하면 됩니다” 같은 기존 금지 filler는 없다. 영어 기술어와 유사한 절 패턴이 반복되지만 정의·미션·경계 내용은 ID별로 다르다. `thread`는 코드 절에 주석만 있는 사실상 예제 placeholder를 개별 결함으로 기록했다. 이는 단순 파일 수 검사로는 잡히지 않는다.

### raw 유지 근거와 원인 분석

- **H1 = `4e91c2b`** (`feat(glossary): enrich runtime and API learning content`, 2026-09-15 KST): 이번 raw 중 **20개** 상세 파일이 처음 추가됐다. `git show --stat`에는 본문·생성 웹/확장 데이터 변경이 있으나 canonical master 변경은 없다.
- **H2 = `75fed9f`** (`feat(glossary): add priority content batch one`, 같은 날): 나머지 **15개**가 처음 추가됐다. 이 커밋 역시 master 상태 동기화가 없다. 해당 커밋 당시 master에서도 각 35개 상태는 raw임을 확인했다.
- 이후 `event-handler`는 `0324bd3`에서 그림까지 통합되고 `http`/`tcp`는 `b893b17`에서 네트워크 설명이 보강되었지만 상태는 남았다. [로드맵](../../docs/05_roadmap.md)도 동일한 488/35와 본문 작성 이후 갱신 누락 가능성을 기록한다.
- [기존 audit v1](glossary-content-audit-v1.md)은 이미 raw→drafted 동기화 15건의 선례를 기록한다. 이후 S7 배치 구현 스크립트는 본문 작성과 `content_status='drafted'`를 함께 수행하지만 H1/H2에는 그 갱신이 없었다. S7-B09의 “미작성 0”은 파일 존재 기준과 양립하며 “raw 0”을 의미하지 않는다.
- 따라서 **현재 35개가 raw인 직접 관찰 근거는 과거 작성 커밋에서 상태 동기화가 누락된 이력**이다. 원천 빌더 `build_glossary.py`도 일반 추출 항목을 raw로 시작하고 지정 CORE_IDS만 drafted로 바꾼다. 다만 이 빌더 재실행이 현재 35개를 되돌렸다는 증거는 없으므로 원인으로 확정하지 않는다.
- 후보 33개에 대해 “원천 추출만 완료”로 유지해야 할 실질적인 작성 부족 근거는 찾지 못했다. 공통 보류 사유는 canonical 변경에 대한 별도 Owner 검토이며, 기술 검수가 안 끝났다는 사실은 drafted와 reviewed의 구분 사유다. 보완 2개는 위 결함을 먼저 해결할 이유가 있으나, 지금까지 미작성이라는 뜻은 아니다.

## 권장 ID 목록과 다음 조치

**메타데이터 갱신 권장 후보 33개** (현재 변경하지 않음):

`asynchronous-programming`, `concurrency`, `const`, `cookie`, `curl`, `data-integrity`, `database-index`, `database-session`, `dependency-injection`, `event-handler`, `event-loop`, `function`, `http`, `http-get`, `http-post`, `http-request-response`, `http-status-code`, `https`, `json-request-response`, `let`, `login-session`, `module`, `process`, `queue`, `react-props`, `request-response-cycle`, `rest-api`, `schema`, `stack`, `tcp`, `user-event`, `var`, `variable`.

**콘텐츠 보완 필요 2개**:

- `thread`: 경쟁 상태를 실제로 따라갈 수 있는 counter 코드 또는 두 실행 흐름의 읽기/쓰기 순서를 추가한다. 주석만 있는 코드 예를 대체하고 임계 구역·lock과 연결한다.
- `json-web-token`: “이 예는 서명된 JWS 형태”라고 범위를 명시하고 JWT 전체가 항상 3부분인 것은 아니라는 점을 보완한다. E1: [RFC 7519 §3](https://www.rfc-editor.org/rfc/rfc7519.html#section-3)은 JWS와 JWE 표현을 모두 정의한다. 본 감사에서 해당 본문은 수정하지 않았다.

**정책 확인 필요**: 해당 ID 없음(0개). 공식 상태 의미는 확인됐다. 전환 실행 전 Owner가 후보 목록과 보완 2개 처리 순서를 검토하는 절차는 필요하지만, 그것을 의미 불명확 판정과 혼동하지 않는다.

다음 작업에서는 후보 33개의 상태만 검토한 뒤 승인된 ID를 제한적으로 동기화하고, 보완 2개는 본문을 보강한 후 다시 판정한다. `module`의 파일 구분과 `function`의 이름 표현 같은 경미한 다듬기는 후속 원고 검토에 남긴다. 다른 용어·분류·관계·미션 원본으로 변경 범위를 넓히지 않는다.

## 상태 갱신 시 예상 영향

| 소비 경로 | 확인한 구현 | 예상 영향 |
| --- | --- | --- |
| 웹 생성 데이터 | `scripts/build_web_data.py`는 `content_status`를 `contentStatus`로 복사하고 상세 여부는 Markdown 절에서 별도 계산 | 상태 필드 값이 바뀌며 생성 파일을 재빌드해야 한다. 본문 존재·richSections 활성화와는 독립이다. |
| 현재 웹 검색/분류/상세 | `src/App.tsx`는 분야·과정·미션·중요도·`hasDetailedContent` 등으로 필터링하며 contentStatus를 노출 조건으로 사용하지 않음 | 현재 UI의 검색 결과·관련 링크·상세 접근은 상태값만으로 달라지지 않는다. 외부 소비자나 향후 상태 필터까지 무영향이라고 단정하지 않는다. |
| Chrome 확장 | `scripts/build_extension.py`가 생성 glossary.json 복사, `extension/sidepanel.js`가 `hasDetailedContent`로 상세 표시 | 재빌드 시 상태 필드가 복사된다. 현 검색·본문 표시 조건은 그대로다. JSON contract/필드명 변경은 필요 없다. |
| 제작 현황·계획/검증 | 상태 집계는 수치가 바뀜. 현 `build_content_tier_plan.py`는 상세 파일 존재를 기준으로 미작성 대상을 계산. `validate_glossary.py`는 필수 필드/본문·관계 등을 검사하나 상태와 작성 성숙도의 완전한 동기화는 보장하지 않음 | 승인 후 33개만 갱신한다면 drafted 521/raw 2가 된다(예측치). 상세 523개나 기존 완료 batch를 다시 생성할 이유는 없다. 검증 성공을 교육 검수 완료로 해석하지 않는다. |

## 재현 및 범위 확인

```python
import json
from pathlib import Path
terms = json.loads(Path('data/curated/glossary-master-v0.1.yaml').read_text(encoding='utf-8'))['terms']
raw_ids = [t['id'] for t in terms if t['content_status'] == 'raw']
assert len(terms) == 523 and len(raw_ids) == 35
print('\n'.join(raw_ids))
```

본 보고서는 35개를 모두 읽은 내용 감사이며, 기술 검수 완료 인증은 아니다. 자동 검증·웹 시각 QA는 [Browser Rendering QA](../glossary-visual/browser-rendering/qa.md)에 따로 기록한다. 상태 감사에는 별도의 브라우저 캡처를 만들지 않았다. canonical, 다른 522개 본문, 기존 SVG, 배치 보고서 및 상태 모델은 수정하지 않았다.
