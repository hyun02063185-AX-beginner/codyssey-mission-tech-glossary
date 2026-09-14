# Term Curation & Coverage Gap Audit — Phase 1.5

- 일자: 2026-09-14
- 기준 commit: `7f292f8` (Phase 1 종료 commit, HEAD와 동일). working tree는 `.DS_Store` 1건만 untracked이며 손대지 않았다.
- 대상: canonical term 549개 전수 + 예비 M01~M03 / 본과정 M01~M13 원천 전체
- 성격: **AUDIT ONLY.** canonical 추가·삭제·병합·rename·alias 적용을 한 건도 하지 않았다.
- 선행: `reports/glossary/content-quality-audit-phase1.md` (Phase 1). 본 Phase는 Phase 1을 **입력으로 사용하되 판정을 그대로 승인하지 않는다.**
- Machine-readable artifact:
  - `data/reviews/term-curation-audit-phase1_5.json` (549 term 전수 canonical 적정성)
  - `data/reviews/coverage-gap-audit-phase1_5.json` (누락 후보 39건)
  - `data/reviews/mission-term-coverage-phase1_5.json` (16개 미션 커버리지 매트릭스)

---

## 0. 이번 Phase에서 확인된 가장 중요한 구조적 사실

원천(`data/raw/`)과 canonical master를 대조한 결과다.

> **원천 추출 717행 중 688행(96%)이 이미 canonical term과 매칭된다.**
> 매칭되지 않은 29행은 대부분 표 헤더·합계 행이고, 실제 용어는
> `Hero`·`About`·`Skills`·`Projects`·`Contact`·`Footer` 6개(의도적으로 제외된 섹션명)뿐이다.

여기서 두 가지가 따라온다.

### 1) curation 단계가 사실상 필터링을 하지 않았다

master는 원천 추출의 **거의 1:1 적재**다. 원천 문서는 스스로 이렇게 경고해 두었다
(`data/raw/main/m01/m01-terminology-raw.md` §4 "추출 시 주의"):

> - "`Hero`, `About`, `Skills`처럼 단순 섹션명은 기술용어 가치가 낮으므로 나중에 curated 단계에서 제외될 수 있다."
> - "`403`, `60회 제한`처럼 숫자·상태값은 독립 용어가 아니라 상위 개념에 병합될 수 있다."
> - "`로딩/성공/에러/빈 상태`는 curated 단계에서 `UI State` 아래에 묶을 수 있다."

이 중 **섹션명 제외와 상태 4종 병합만 수행**됐고, **숫자·설정값 병합은 수행되지 않았다.**
그 결과 `0.0.0.0:15034`, `port 20022`, `CPU_MAX_OCCUPY`, `ap-northeast-2`, `monitor.sh` 같은 항목이 canonical로 남아 있다.

더 결정적인 증거로, 원천의 `유형 후보` 컬럼이 이미 **비기술 항목으로 라벨링한 28건**이 그대로 canonical이 되었다:

| term | 원천이 붙인 유형 | master type |
|---|---|---|
| `description` | `report section` | concept |
| `evidence-logs` | `report section` | concept |
| `screenshot` | `artifact` | concept |
| `deployment-url` / `git-repository-url` | `artifact/link` | concept |
| `readme` / `contributing-md` | `document` | concept |
| `css-directory`, `images-directory`, `model-layer` 외 10건 | `directory` / `directory/layer` | other |

### 2) 따라서 "누락 용어"는 raw와의 차이에서 찾을 수 없다

원천에 있는 것은 이미 거의 다 들어와 있다.
**빠진 것은 원천 추출 자체가 담지 못한 선행 개념**이다. 원천은 Notion 미션 원문에서 뽑았으므로,
미션 문서가 이름을 부르지 않은 개념은 raw에도 master에도 없다.

§6~§9의 Coverage Gap Audit은 이 전제 위에서 수행했다.

---

## 1. Executive Summary — Canonical Curation

### 1.1 판정 (549 terms)

| Verdict | 수 | 비율 |
|---|---:|---:|
| KEEP_CANONICAL | 423 | 77.0% |
| MERGE_CONCEPT | 44 | 8.0% |
| REVIEW_SCOPE | 38 | 6.9% |
| MISSION_LOCAL | 37 | 6.7% |
| MERGE_ALIAS | 6 | 1.1% |
| REMOVE_CANDIDATE | 1 | 0.2% |
| **합계** | **549** | **100%** |

confidence: HIGH 230 / MEDIUM 319 / LOW 0

### 1.2 판정 방법

Q1~Q7을 재현 가능한 신호로 환산한 뒤, 신호만으로 결론이 나지 않는 항목은 원천 근거를 직접 읽고 개별 판정했다.

**긍정 신호** — E1 지도 수록 / E2 복수 미션 참조 / E3 구체적 type / E5 콘텐츠 보유 / E6 core 중요도
**부정 신호** — N1 산출물형 이름(디렉터리·파일·리터럴·명령) / N2 원천이 비기술로 라벨 / N3 최약 근거 조합

### 1.3 중요한 방법론적 수정

초안에서는 N3(단일 미션 + supporting + 지도 미수록 + 콘텐츠 없음, 146건)를 REVIEW_SCOPE로 보냈다.
그러나 해당 목록을 직접 읽어 보니 `mutex`, `race-condition`, `cgroup`, `namespace`, `convolution`,
`ieee-754`, `memoization`, `separation-of-concerns`, `observability`, `tls-certificate` 등
**대부분이 명백히 정당한 기술용어**였다.

> **근거가 약한 것은 용어가 부적격해서가 아니라 사전이 아직 미성숙해서다.**
> 지도에 없고 설명이 없는 것은 canonical 적정성 문제가 아니라 **커버리지 문제**다.

그래서 N3은 verdict를 바꾸지 않고 `glossary_maturity_gap: true` 플래그로만 기록했다(**146건**).
이 구분을 하지 않으면 멀쩡한 용어 100여 개를 삭제 후보로 오인하게 된다.

---

## 2. Estimated Canonical Change

```text
현재 canonical                                549
  - MISSION_LOCAL (Mission Context로 이동)       -37
  - MERGE_CONCEPT (상위 개념 설명으로 흡수)          -44
  - MERGE_ALIAS   (alias로 처리)                 -6
  - REMOVE_CANDIDATE                            -1
                                          --------
유지 예상                                       461
  + Coverage Gap 신규 canonical                 +23
  + Phase 1 M01 신규 (7건 → 5건으로 하향, §8)       +5
                                          --------
정비 후 예상 canonical                           489
```

**REVIEW_SCOPE 38건의 결정에 따른 범위: 451 ~ 489 (중앙값 약 470).**

즉 **수는 거의 그대로이되 구성이 달라진다.** 미션 산출물·설정값 88건이 빠지고, 실제 학습에 필요한 선행 개념 28건이 들어온다.
canonical 수를 KPI로 쓰지 않는다는 §10 원칙에 부합한다.

---

## 3. Highest-risk Existing Terms

canonical 적정성이 가장 의심되는 항목이다. 전체는 JSON 참조.

| # | term | ko | 문제 | 판정 | conf |
|---|---|---|---|---|---|
| 1 | `description` | Description | 원천이 `report section`으로 라벨한 것을 그대로 편입. 기술 개념 아님 | REMOVE_CANDIDATE | HIGH |
| 2 | `memoryguard` | MemoryGuard | M08 시나리오의 특정 컴포넌트 이름. 원천 유형도 `watchdog/component` | MISSION_LOCAL | HIGH |
| 3 | `pattern` | 패턴 | M03 `data.json`의 `patterns` **필드명**. 디자인 패턴과 표기 충돌. `filter`는 Sprint 1에서 같은 사유로 이미 처리됨 | MISSION_LOCAL | HIGH |
| 4 | `cpu-max-occupy` | CPU_MAX_OCCUPY | M08 실험용 **환경변수 이름** | MISSION_LOCAL | HIGH |
| 5 | `memory-limit` | MEMORY_LIMIT | 동상 | MISSION_LOCAL | HIGH |
| 6 | `multi-thread-enable` | MULTI_THREAD_ENABLE | 동상 | MISSION_LOCAL | HIGH |
| 7 | `monitor-sh` | monitor.sh | M07 **미션 스크립트 파일명** | MISSION_LOCAL | HIGH |
| 8 | `tcp-port-20022` | port 20022 | 포트 번호 리터럴 | MISSION_LOCAL | HIGH |
| 9 | `listen-address` | 0.0.0.0:15034 | 주소 리터럴. Phase 1 P0에서도 지적 | MISSION_LOCAL | HIGH |
| 10 | `aws-seoul-region` | ap-northeast-2 | 리전 리터럴. `cloud-region`이 상위 개념으로 존재 | MISSION_LOCAL | HIGH |
| 11 | `result-report` | 결과 리포트 | README 제출 섹션 | MISSION_LOCAL | HIGH |
| 12 | `hello-world` | hello-world | Docker 튜토리얼 이미지 이름 | MISSION_LOCAL | HIGH |
| 13 | `code-block` | 코드블록 | README Markdown 서식 요구 | MISSION_LOCAL | HIGH |
| 14 | 미션 전용 CLI 15건 | BRANCH·COMMIT·GET·INIT 등 | M09/M10 과제 명령 스펙. `branch`·`commit`·`http-get`과 표기 충돌 | MISSION_LOCAL | HIGH |
| 15 | 디렉터리·계층 13건 | `css/`·`models/`·`services/` 등 | master도 `type: other`로 분류해 두었으나 canonical로 잔존 | MISSION_LOCAL / MERGE_CONCEPT | HIGH |
| 16 | `screenshot`·`deployment-url`·`git-repository-url`·`evidence-logs` | — | 제출 증빙 항목 | MISSION_LOCAL | HIGH |
| 17 | `o` | 시간 복잡도 | `time-complexity`(시간복잡도)와 **띄어쓰기만 차이** | MERGE_ALIAS | HIGH |
| 18 | `data-json` | JSON | `json`과 term_ko 동일 | MERGE_ALIAS | HIGH |
| 19 | `arm64-x86-64` ↔ `cpu-architecture` | — | 두 term의 한/영이 서로 뒤바뀜 | MERGE_ALIAS | HIGH |
| 20 | `serialize-deserialize` ↔ `serialization` | — | 동일 개념 이중 등재 | MERGE_ALIAS | HIGH |

---

## 4. Merge / Alias Candidates

### 4.1 MERGE_ALIAS (6건) — 표기 변형 수준

| term | → target | 근거 |
|---|---|---|
| `o` | `time-complexity` | `시간 복잡도` vs `시간복잡도` |
| `data-json` | `json` | 둘 다 term_ko=`JSON`. `data.json`은 파일명 |
| `arm64-x86-64` | `cpu-architecture` | 한/영 뒤바뀐 동일 개념 |
| `remote-repository` | `remote` | 동일 Git 개념 |
| `serialize-deserialize` | `serialization` | 동일 개념 |
| `http-request` | `http-request-response` | M06/M01 맥락이 같은 요청·응답 개념 |

### 4.2 MERGE_CONCEPT (44건) — 상위 개념 설명 안에서 다루는 편이 적절

주요 클러스터:

| 클러스터 | 항목 | → target |
|---|---|---|
| **계층 디렉터리** | `auth-layer`, `model-layer`, `repository-layer`, `router-layer`, `service-layer`, `template-directory` | `layered-architecture` (이미 canonical) |
| **프로젝트 디렉터리** | `components-directory`, `css-directory`, `hooks-directory`, `images-directory`, `javascript-directory`, `lib-directory`, `pages-directory` | 상위 "프로젝트 구조" 설명 |
| **명령 옵션 단위** | `ps-l`(ps -L), `top-h`(top -H), `docker-ps-docker-ps-a` | 상위 명령 |
| **포트 리터럴** | `port-22-ssh`(SSH 22), `port-80-http`(HTTP 80) | `socket-port` |
| **상태코드 개별값** | `http-200-ok` | `http-status-code` |
| **M01 UI 미세동작** | `smooth-scroll`, `scroll-to-top`, `navigation-state-styling` | `user-event` / `ui-state` 설명 |
| **폼 검증 세분화** | `email-validation`, `required-field-validation`, `error-message` | `form-validation` / `ui-state` |
| **요청·응답 중복** | `json-request-response` | `http-request-response` |
| **비동기 중복** | `asynchronous-data-fetching` | `asynchronous-programming` |
| **Redis 필드** | `used-memory`, `max-memory` | `memory-accounting` |
| **기타** | `dom-update`→`dom`, `exit-status-1`→`exit-code`, `expiration-timestamp`→`expiration`, `topological-order`→`topological-sort`, `client-side-route`→`client-side-routing`, `commit-subcommand`→`commit`, `python-cli`→`cli` | |

### 4.3 Phase 1의 MERGE 80건 재검증 결과 (§4 요구사항)

Phase 1 판정을 그대로 승인하지 않고 독립 검증했다.

| Phase 1.5 재판정 | 수 |
|---|---:|
| MERGE_CONCEPT | 26 |
| REVIEW_SCOPE | 17 |
| KEEP_CANONICAL (**Phase 1 판정 기각**) | 16 |
| MISSION_LOCAL | 14 |
| MERGE_ALIAS | 6 |
| REMOVE_CANDIDATE | 1 |

**결론: 80건 중 64건(80%)은 어떤 형태로든 정리 대상이 맞았고, 16건은 기각했다.**
기각 사례: `json`·`time-complexity`(병합의 **생존자**이므로 유지), `http-request-response`,
`least-privilege`, `owner-group-mode`, `process-pid-1`, `socket-port` 등 — 이름이 비슷할 뿐 독립 개념이다.

즉 Phase 1의 MERGE 신호는 신뢰할 만하되 **문자열 유사성에 기반해 과탐지가 있었다.**

---

## 5. Mission-local Terms (37건)

일반 기술사전 canonical보다 Mission Context 영역이 적합한 항목이다.
**삭제가 아니라 이동 후보**다.

| 그룹 | 항목 | 왜 canonical이 아닌가 |
|---|---|---|
| 미션 CLI 명령 스펙 (15) | `branch-command`, `commit-command`, `init-command`, `log-command`, `switch-command`, `get-command`, `set-command`, `del-command`, `exists-command`, `expire-command`, `keys-command`, `dbsize-command`, `ancestors-command`, `path-command`, `search-command` | M09(키-값 저장소)·M10(VCS)에서 **학습자가 구현해야 할 명령어 이름**이다. `BRANCH`·`COMMIT`·`GET`·`INIT`은 Git/HTTP의 그것이 아니라 과제 스펙이며, 실제 `branch`·`commit`·`http-get`과 표기가 충돌한다 |
| 미션 설정값·리터럴 (6) | `cpu-max-occupy`, `memory-limit`, `multi-thread-enable`, `tcp-port-20022`, `listen-address`, `aws-seoul-region` | 환경변수 이름과 주소·포트·리전 리터럴. 개념명이 아니다 |
| 제출물·증빙 (6) | `screenshot`, `deployment-url`, `git-repository-url`, `evidence-logs`, `readme`, `result-report` | 원천 유형이 `artifact`/`link`/`document`/`report section` |
| 미션 산출물 파일·모드 (3) | `monitor-sh`, `safe-mode`, `contact-form` | 미션이 만들라고 지정한 파일·모드·UI 요소 |
| 시나리오 로컬 (2) | `memoryguard`, `pattern` | M08 시나리오 컴포넌트 / M03 data.json 필드명 |
| 제품 정책·튜토리얼 (5) | `aws-free-tier`, `hello-world`, `code-block`, `help-option`, `docker-stats` | 요금제 등급, 튜토리얼 이미지, Markdown 서식, 단일 옵션, 단일 하위 명령 |

> **권고: 삭제하지 말고 `mission-vocab` 같은 별도 namespace로 옮긴다.**
> 학습자가 미션 수행 중 검색하면 나와야 하지만, 기술 지도와 분야 분류에는 들어가면 안 된다.

---

## 6. Removal Candidates (1건)

| term | 근거 | 영향 범위 |
|---|---|---|
| `description` (Description, M08) | 원천이 유형을 `report section`으로 명시했는데 그대로 canonical이 됨. 기술 개념이 아니라 리포트 양식 항목이며, 영어 일반명사라 검색 가치도 없다 | mission_ref 1건(main/M04 아님, M08 direct). 지도 미수록, 콘텐츠 없음, 참조하는 alias 없음 → 제거 영향 최소 |

나머지 비기술 항목은 전부 **MISSION_LOCAL(이동)**으로 두었다. 삭제보다 이동이 정보 손실이 없기 때문이다.
이번 Phase에서 실제 삭제는 하지 않았다.

---

## 7. Coverage Gap Summary

총 후보 **39건**.

| Verdict | 수 |
|---|---:|
| NEW_CANONICAL_CANDIDATE | 23 |
| COVERED_BY_EXISTING | 6 |
| FOUNDATION_CANDIDATE | 3 |
| REVIEW_CANDIDATE | 3 |
| ALIAS_CANDIDATE | 2 |
| IGNORE | 2 |
| MISSION_LOCAL_ONLY | 0 |

우선순위: P0 3 / P1 21 / P2 9 / P3 6

### 정직하게 기록하는 비(非)갭

`Unit Test`·`TDD`·`CI`·`GitHub Actions`는 **16개 미션 원문 어디에도 등장하지 않는다**(원천 전수 grep 확인).
일반 개발 상식으로는 중요하지만 이 사전의 범위는 코디세이 미션 학습이므로 **IGNORE**로 둔다.
커리큘럼에 추가되면 그때 재검토한다. 없는 수요를 만들어 canonical을 늘리지 않는다(§9).

---

## 8. High-value Missing Terms

### P0 (없으면 핵심 개념 이해가 잘못될 가능성이 큼)

#### 1. JSX — main/M02 — HIGH

- **왜 필요한가**: M02는 React로 재사용 컴포넌트 8개 이상을 요구한다. JSX 없이는 React 컴포넌트를 한 줄도 쓸 수 없다.
- **가장 가까운 기존 term**: `react`, `react-props`, `component-tree`
- **왜 부족한가**: 어떤 canonical도 "HTML처럼 생긴 이 문법이 무엇인가"에 답하지 않는다. 입문자가 React에서 **가장 먼저 마주치는 낯선 표기**다.
- **권고**: 신규 canonical. "JavaScript 확장 문법이며 HTML이 아니다"를 경계로 명시.

#### 2. useState — main/M02 — HIGH

- **왜 필요한가**: M02 원문이 "폼·데이터·로딩/에러 상태 관리"를 요구한다. React에서 그 상태를 만드는 수단이다.
- **가장 가까운 기존 term**: `react-state`(ko=`state`), `useeffect`, `usecallback`, `usememo`
- **왜 부족한가**: **`useEffect`·`useMemo`·`useCallback`·`React.memo`는 전부 canonical인데 `useState`만 없다.**
  원천 추출이 미션 원문에 적힌 훅만 담았기 때문이다. `react-state`는 "상태" 개념이지 훅이 아니다.
- **권고**: 신규 canonical. 훅 4종과 층위를 맞춘다. **이번 감사에서 가장 명백한 비일관이다.**

#### 3. Neural Network (신경망) — preliminary/M03 — HIGH

- **왜 필요한가**: 예비 M03 주제가 Mini NPU 시뮬레이터다.
- **가장 가까운 기존 term**: `neural-processing-unit`, `weight`, `inference`, `convolution`, `tensor`
- **왜 부족한가**: NPU는 "**신경망** 연산 전용 프로세서"인데 신경망 canonical이 없어 **정의가 자기참조에 빠진다.**
  `weight`(가중치)·`inference`(추론)도 신경망을 전제하지 않으면 설명할 수 없다.
- **권고**: 신규 canonical. AI 분야 foundation 역할.

### P1 (미션 이해와 동료평가에 상당히 도움)

| # | term | mission | 왜 필요 / 기존이 왜 부족한가 | conf |
|---|---|---|---|---|
| 4 | **Node.js** | M02 | React 생성·실행·배포가 전부 Node 위에서 일어남. `javascript`는 브라우저 언어로 설명됨 | HIGH |
| 5 | **npm** | M02 | `homebrew-apt`는 OS용, `requirements-txt`는 Python용. JS 패키지 관리 개념 부재 | HIGH |
| 6 | **Recursion (재귀)** | M10, M09 | `dfs`·`graph-traversal`은 canonical인데 구현 원리인 재귀가 없음. ANCESTORS(조상 탐색)의 표준 구현 | HIGH |
| 7 | **CORS** | M02, M13 | 브라우저에서 Supabase/Firebase 호출 시 가장 자주 막히는 지점. 네트워크 오류로 오진하기 쉬움 | HIGH |
| 8 | **XSS** | M13, M01 | **`dom.md`가 이미 "innerHTML + 사용자 입력 = XSS 위험"을 경고하는데 연결할 canonical이 없다.** `csrf`는 있는데 더 흔한 XSS가 없음 | HIGH |
| 9 | **SQL Injection** | M11, M12 | `input-validation`은 일반 검증. ORM이 왜 안전한지 설명 불가 | HIGH |
| 10 | **Salt** | M13 | `password-hashing`만으로는 레인보우 테이블 취약성이 빠져 **틀린 구현을 유도**할 수 있음 | HIGH |
| 11 | **ACID** | M11 | `atomicity`가 있으나 category가 Linux/OS이고 예비 M03 맥락. C·I·D가 없어 프레임이 깨짐 | HIGH |
| 12 | **LLM** | M06 | `ai-model`은 일반어. `max-tokens`·`temperature`·프롬프트가 왜 존재하는지 설명할 상위 개념 부재 | HIGH |
| 13 | **Hallucination (환각)** | M06 | `output-validation`·`human-in-the-loop`·`regeneration`이 전부 이 문제의 **대응책인데 문제 자체가 사전에 없다** | HIGH |
| 14 | **Database Migration** | M11–M13 | `schema`는 구조 자체, 마이그레이션은 변경 절차. M11→M12→M13으로 스키마가 계속 바뀜 | MEDIUM |
| 15 | **Middleware** | M12 | `layered-architecture`는 앱 내부 계층, 미들웨어는 요청 파이프라인 단계. 층위가 다름 | MEDIUM |
| 16 | **DNS / Domain Name** | M05 | Let's Encrypt 인증서는 도메인을 전제로 발급됨. IP 관련 canonical은 많은데 이름 체계가 없음 (보너스 요구라 P1) | MEDIUM |
| 17 | **Reverse Proxy** | M05, M07 | `nginx`는 제품명 canonical. 제품이 하는 역할 개념이 없어 "웹서버"와 구분 안 됨 | MEDIUM |
| 18 | **Context Switch** | M08 | `scheduler`는 있으나 전환 비용이 없어 "왜 스레드를 늘려도 안 빨라지나"를 설명 불가 | MEDIUM |
| 19 | **Context Window** | M06 | `max-tokens`는 출력 상한, 컨텍스트 윈도우는 입력+출력 전체 한계. 혼동 잦음 | MEDIUM |
| 20 | **Parallelism (병렬 처리)** | prel M03 | NPU·GPU 존재 이유 자체. `concurrency`는 Linux/OS 카테고리의 M08 맥락이며 동시성≠병렬성 | MEDIUM |
| 21 | **Data Type (자료형)** | prel M02 | `type-hint`는 본과정 M03의 Python 타입 힌트. `list-dict`는 두 자료형만 | MEDIUM |
| 22 | **Parameter / Argument** | prel M02 | `function`은 있으나 값을 주고받는 구조 미설명. 입문자 오류의 큰 축 | MEDIUM |
| 23 | **Scope (변수 범위)** | prel M02 | 함수·클래스 분리 시 첫 장벽인데 다루는 canonical이 없음 | MEDIUM |

---

## 9. Mission Coverage Matrix

전체 수치는 `data/reviews/mission-term-coverage-phase1_5.json`.
(미션 간 공유 term은 양쪽에 계상되므로 합계는 549를 넘는다)

| Mission | 주제 | 현재 | KEEP | 병합 | 미션로컬 | REVIEW | 신규 | 지도미수록 | 설명없음 | 정비 후 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| prel/M01 | 개발 워크스테이션 | 59 | 50 | 3 | 4 | 2 | 0 | 33 | 43 | 52 |
| prel/M02 | 파이썬 퀴즈 게임 | 36 | 30 | 1 | 1 | 4 | **3** | 23 | 27 | 37 |
| prel/M03 | Mini NPU 시뮬레이터 | 30 | 24 | 3 | 2 | 1 | **2** | 21 | 27 | 27 |
| main/M01 | 소개 웹페이지 | 68 | 42 | 12 | 5 | 9 | 1 | 40 | 43 | 52 |
| main/M02 | React SPA | 37 | 31 | 6 | 0 | 0 | **5** | 20 | 29 | 36 |
| main/M03 | 용돈 기입장 CLI | 33 | 31 | 0 | 1 | 1 | 0 | 25 | 27 | 32 |
| main/M04 | 팀 협업 | 28 | 23 | 4 | 0 | 1 | 0 | 17 | 26 | 24 |
| main/M05 | 인터넷 공개(AWS) | 36 | 31 | 3 | 2 | 0 | 2 | 21 | 35 | 33 |
| main/M06 | AI 도우미 | 30 | 24 | 5 | 1 | 0 | **3** | 11 | 28 | 27 |
| main/M07 | 자동 상태 점검 | 36 | 28 | 1 | 3 | 4 | 1 | 27 | 34 | 33 |
| main/M08 | 성능 장애 분석 | 34 | 21 | 2 | 6 | 5 | 1 | 25 | 33 | 27 |
| main/M09 | 키-값 저장소 | 37 | 24 | 3 | 7 | 3 | 1 | 17 | 35 | 28 |
| main/M10 | VCS 구현 | 32 | 22 | 1 | 8 | 1 | 1 | 19 | 30 | 24 |
| main/M11 | 데이터베이스 설계 | 35 | 31 | 0 | 0 | 4 | **3** | 14 | 31 | 38 |
| main/M12 | CRUD 게시판 | 36 | 29 | 5 | 0 | 2 | **3** | 18 | 33 | 34 |
| main/M13 | 로그인·회원 연결 | 35 | 32 | 1 | 0 | 2 | **4** | 16 | 32 | 38 |

### 읽어야 할 패턴

1. **M09·M10은 정비 후 가장 많이 줄어든다** (37→28, 32→24). 미션 전용 CLI 명령 15건이 전부 이 두 미션 소속이기 때문이다.
2. **M02·M11·M12·M13은 늘어난다.** 프레임워크·DB·보안의 선행 개념이 원천 추출에서 빠져 있었다.
3. **M01은 여전히 가장 비대하다** (68 → 52). Phase 1이 지적한 미세 개념 분할 문제가 그대로다.
4. **M05는 설명 없음 35/36으로 최악이다.** AWS 네트워킹 용어가 대량으로 들어왔으나 콘텐츠가 전무하다.
5. **M04는 신규 후보가 0이면서 정비 후 줄어드는 유일한 미션**이다. Git 협업 어휘는 원천 추출이 잘 담았다.

---

## 10. Technology Atlas Coverage

### 10.1 반드시 Atlas에 있어야 하지만 없는 canonical

Phase 1에서 확인한 322건 미수록 중, **P1 이상 신규 후보와 직접 연결되는 기존 canonical**이 우선이다.

| canonical | 왜 지도에 필요한가 |
|---|---|
| `promise` | Group B(Callback/Promise/async-await)의 축인데 지도에 canonical로 없음 |
| `event-handler`, `user-event` | Group C(Event family)의 축인데 둘 다 미수록 |
| `inline-onclick-handler` | M01이 `addEventListener`와 명시적으로 대비시키는 항목 |
| `event-loop` | 비동기 설명의 종착점 |

### 10.2 Atlas에 없어도 되는 canonical

- **MISSION_LOCAL 37건 전부.** 기술 생태계 내 위치가 없는 항목이므로 지도에 들어가면 안 된다.
- **MERGE_CONCEPT 44건 대부분.** 상위 개념 노드가 이미 지도에 있다.
- 제품·서비스명 중 단일 미션 전용(`orbstack`, `h2-database`, `railway`, `netlify` 등)은 boundary 노드로 충분하다.

> 322건 미수록을 전부 메우려 하면 안 된다. **88건은 애초에 들어갈 필요가 없는 항목이었다.**
> 실질 미수록은 약 234건으로 줄어든다.

### 10.3 Foundation이 더 적절한 것

| 후보 | Phase 1 판정 | Phase 1.5 판정 | 근거 |
|---|---|---|---|
| XMLHttpRequest | NEW_CANONICAL | **FOUNDATION** | 이미 `foundation:xml-http-request` 존재. 입문자 독립 검색 가치 낮고 M01에서 직접 안 씀 |
| Browser Web API | NEW_CANONICAL | **FOUNDATION** | 이미 `foundation:web-platform` 존재. canonical화하면 `rest-api`와 표기 충돌 위험까지 추가 |
| Call Stack | HOLD | **FOUNDATION** | Recursion을 P1으로 추가하면 수요 발생. canonical `stack`(자료구조)과 절대 병합 불가 |

### 10.4 Shadow duplicate — 전체 map 재점검 결과

Phase 1이 `promise`·`http`·`cookie` 3건을 발견했다. **12개 map의 foundation 노드 14개를 전수 재검사한 결과 추가 건은 없었다.**

| foundation node | 충돌 canonical |
|---|---|
| `foundation:promise` | `promise` |
| `foundation:http` | `http` |
| `foundation:cookie` | `cookie` |

나머지 11개(`web-platform`, `callback-pattern`, `xml-http-request`, `dom-event`, `async-execution`,
`ecmascript`, `html-standard`, `web-storage`, `request-response`, `css-layout`, `css-media-queries`)는
대응하는 canonical이 없어 충돌하지 않는다. 이 중 `callback-pattern`·`xml-http-request`는
§8·§10.3 결정에 따라 각각 canonical 승격(Callback) / foundation 유지(XHR)로 갈린다.

---

## 11. Granularity Audit (§11)

### 11.1 너무 넓음 — 한 canonical에 두 개념 (22건)

`socket-port`(Socket / Port), `port-localhost`(포트 / localhost), `process-pid-1`(프로세스 / PID 1),
`owner-group-mode`(Owner / Group / Mode), `zsh-bash`, `homebrew-apt`(→ Homebrew, apt), `list-dict`,
`daemon-dockerd`, `containerd-runc`, `stable-custom-comparator`, `numpy-pandas`(ko=외부 라이브러리 / en=NumPy, pandas),
`arm64-x86-64`, `absolute-relative-path`, `cpu-architecture`, `semantic-conventional-commits`,
`docker-ps-docker-ps-a`, `755-644`, `accessibility-a11y`, `cascade-delete-policy`, `file-io`,
`inbound-outbound-rule`, `before-after-experiment`

> 전부 SPLIT 후보이지만 **이번 Phase에서는 분할하지 않는다.** JSON의 `granularity_flag`로만 기록했다.
> 분할은 canonical 수를 늘리므로 §10 원칙상 신중해야 하며, 일부(`절대/상대 경로`)는 대비 개념이라 한 항목이 더 나을 수 있다.

### 11.2 너무 좁음

§4.2의 MERGE_CONCEPT 44건이 이에 해당한다. 특히 명령 옵션 단위(`ps -L`, `top -H`)와 포트 리터럴이 전형이다.

### 11.3 층위 혼합

현재 `type` 16종이 일관되지 않다. 단 1회만 쓰인 type이 3종 있다: `database`(`redis`), `security concept`(`protected-route`), `config`(2건).
또한 `ssh`(protocol)와 `port-22-ssh`(protocol)가 같은 type인데 하나는 프로토콜, 하나는 포트 번호다.

**"세션"이라는 이름이 3개 canonical에 걸쳐 있다**: `login-session`(인증), `database-session`(ORM 수명), `sqlalchemy-session`(구현).
셋 다 정당하지만 학습자에게는 층위 혼동의 원천이므로 Concept Connection이 필요하다.

---

## 12. Term Type Taxonomy 제안

**schema는 바꾸지 않는다.** 향후 품질 관리를 위한 최소 taxonomy 제안이다.

원천의 `유형 후보` 컬럼이 이미 풍부한 어휘를 쓰고 있어(concept 69, command 31, service 9, directory/layer 6,
metric 5, framework 4, keyword 4, method 4, architecture 4, statement 4, …) 이를 정리해 재사용하는 것이 합리적이다.

### 제안 taxonomy (15종)

| type | 예시 | 현재 master |
|---|---|---|
| `concept` | DOM, 재귀, 동시성 | 448 (과다) |
| `language` | HTML, CSS, Python, SQL, TypeScript | 없음 |
| `language-feature` | JSX, async/await, decorator, yield | 없음 |
| `protocol` | HTTP, HTTPS, TCP, SSH, DNS | 5 |
| `api` | Fetch API, Intersection Observer API, useState | 4 (`API`) |
| `function` | `fetch()`, `preventDefault()` | 없음 |
| `library` | jQuery, SQLAlchemy, NumPy | 4 |
| `framework` | React, FastAPI, Vue | 6 |
| `tool` | git, docker, npm, curl, top | 없음 (`command` 31) |
| `command` | `git status`, `docker ps` | 31 |
| `architecture` | SPA, MPA, SSR, Layered Architecture | 5 |
| `data-format` | JSON, CSV, JSONL | 2 |
| `algorithm` | BFS, DFS, Topological Sort | 4 |
| `runtime` | Node.js, uvicorn, ASGI | 없음 |
| `platform` | AWS, GitHub, Vercel | 없음 (`service` 12) |
| `standard` | IEEE 754, UTF-8, WHATWG DOM | 없음 |

### 이 taxonomy가 실제로 도움이 되는가 — 평가

**도움이 된다.** 이번 감사에서 확인한 근거:

1. **중복 탐지에 직접 기여한다.** `ssh`(protocol) ↔ `port-22-ssh`가 같은 type인 것이 이상함을 드러낸다.
   `fetch-api`(api) ↔ `fetch()`(function)의 층위 구분도 Phase 1이 지적한 문제를 자동 검출 가능하게 만든다.
2. **미션 로컬 판별에 기여한다.** `command`와 별개로 미션 CLI 15건은 어떤 type에도 들어가지 않는다 —
   그 자체가 canonical이 아니라는 신호다.
3. **`concept` 448건의 과부하를 해소한다.** 현재는 `concept`이 실질적 미분류 상태다.

**주의**: type을 늘리는 것이 목적이 아니다. 15종을 넘기지 않고, 분류가 애매하면 `concept`에 둔다.

---

## 13. Canonical Selection Guideline

향후 신규 용어 추가 시 사용할 영구 기준이다.

### 등재 판단

1. **미션에 등장했다는 이유만으로 canonical로 만들지 않는다.** 등장과 등재는 다른 문제다.
2. **단순 예제 값이나 과제 스펙을 개념명으로 사용하지 않는다.** `0.0.0.0:15034`, `CPU_MAX_OCCUPY`, `ap-northeast-2`는 설정값이지 개념이 아니다.
3. **alias로 충분하면 canonical을 새로 만들지 않는다.** 약어/풀네임, 한글/영문, 띄어쓰기 차이는 alias다.
4. **다른 용어 설명 안에서 충분하면 독립 canonical을 만들지 않는다.** 명령의 한 옵션, 상태코드 한 값, 필드 하나가 그렇다.
5. **실제 개발에서 반복적으로 만나는 개념을 우선한다.** 코디세이 밖에서 다시 만날 가능성이 등재의 핵심 근거다.
6. **검색 가치와 교육 가치를 함께 고려한다.** 입문자가 검색할 만한가, 알면 코드를 더 잘 이해하는가.

### 등재 후 유지 판단

7. **원천 추출의 유형 라벨을 신뢰한다.** 원천이 `directory`·`artifact`·`report section`으로 표시한 것은 curation에서 걸러야 한다.
8. **미션 전용 어휘는 삭제하지 말고 분리한다.** Mission Context에 두면 검색은 유지하면서 기술 지도를 오염시키지 않는다.
9. **근거가 약한 것과 부적격한 것을 구분한다.** 지도에 없고 설명이 없는 것은 사전의 미성숙이지 용어의 문제가 아니다.
10. **한 canonical에 두 개념을 넣지 않는다.** 다만 대비가 본질인 쌍(절대/상대 경로)은 예외일 수 있다.
11. **구성요소가 전부 있는데 상위 개념이 없으면 상위 개념을 추가한다.** 해시 구성요소 6종은 있는데 `hash table`이 없는 식의 구멍을 찾는다.
12. **대응책만 있고 문제가 없으면 문제를 추가한다.** `output-validation`·`human-in-the-loop`는 있는데 `hallucination`이 없는 식이 그렇다.
13. **선행 개념이 없으면 정의가 자기참조에 빠진다.** NPU를 신경망 없이 정의할 수 없다.
14. **없는 수요를 만들지 않는다.** 어느 미션도 요구하지 않는 개념은 일반 상식이어도 넣지 않는다.

---

## 14. Recommended Owner Decisions

38건의 REVIEW_SCOPE는 **8개 결정 클래스**로 묶인다. 개별 판단이 아니라 방침을 정하면 일괄 적용된다.

### D1. 미션 전용 CLI 15건의 처리

- **Option A**: `mission-vocab` namespace로 이동 (canonical에서 제외)
- **Option B**: canonical 유지하되 표시명을 `M10 BRANCH 명령`처럼 미션 접두어로 구분
- **권고: A.** 표기 충돌(`branch`·`commit`·`http-get`)이 실재하고, 기술 분야 분류에 넣을 자리가 없다.
- **영향**: canonical −15. M09/M10 지도에서 제외. 검색은 mission context에서 유지.

### D2. 디렉터리·계층 13건의 처리

- **Option A**: 전부 제외하고 `layered-architecture` / "프로젝트 구조" 설명으로 흡수
- **Option B**: 계층 5건(`auth/`·`models/`·`services/`·`repositories/`·`routers/`)만 유지
- **권고: A.** master가 이미 `type: other`로 분류해 둔 것 자체가 canonical이 아니라는 판단의 흔적이다.
- **영향**: canonical −13.

### D3. 언어 키워드 3건 (`var`, `const`, `let`)

- **Option A**: canonical 유지 — 입문자가 실제로 검색하는 항목
- **Option B**: `variable` 또는 "변수 선언" 하나로 통합
- **권고: B에 가까운 절충** — `const`/`let`을 하나의 "변수 선언(const/let)" canonical로 묶고 `var`는 alias.
  M01이 "var 대신 const/let"을 요구하므로 셋을 함께 설명하는 편이 교육적으로 낫다.
- **영향**: canonical −2.

### D4. SQL 키워드 4건 (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)

- **Option A**: 4건 유지 — SQL 학습에 실제로 필요
- **Option B**: `crud`와 `sql` 설명으로 흡수
- **권고: A 유지.** M11이 DB 설계 미션이고 네 문장은 SQL의 핵심이다. **단 `delete`는 HTTP DELETE와 표기가 충돌하므로 표시명을 `SELECT 문`처럼 구분한다.**
- **영향**: canonical 변화 없음. 표시명만 조정.

### D5. 금지 라이브러리 예시 4건 (`Vue`, `jQuery`, `Bootstrap`, `Tailwind CSS`)

- **Option A**: 유지 — 실제 개발에서 다시 만나는 실존 기술
- **Option B**: M01 "사용 금지 예시" 맥락뿐이므로 제외
- **권고: A 유지.** Q4(코디세이 밖 재등장 가능성)를 명확히 충족한다. 다만 importance는 supporting 유지.
- **영향**: 변화 없음.

### D6. 리포트 어휘 5건 (`workaround`, `verification`, `before-after-experiment`, `evidence-logs`, `result-report`)

- **Option A**: 전부 Mission Context로 이동
- **Option B**: `workaround`·`verification`은 실무 용어이므로 유지
- **권고: B.** `workaround`(임시 조치)와 `verification`(검증)은 장애 대응의 실제 기술 어휘다.
  `evidence-logs`·`result-report`·`description`은 제출 양식이므로 이동/제거.
- **영향**: canonical −3.

### D7. 프로그래밍 일반어 7건 (`variable`, `attribute`, `console`, `directory`, `interaction`, `benchmark`, `backup`)

- **Option A**: 전부 유지 — 입문자에게는 이것도 배워야 할 용어다
- **Option B**: `interaction`만 제외 (M01 제출 검증 항목이라 기술 개념이 아님)
- **권고: B.** 나머지 6개는 입문자 사전으로서 정당하다. `interaction`은 `user-event`·`ui-state`와 중복이다.
- **영향**: canonical −1.

### D8. 중복 클러스터 4쌍

- `log-rotation` ↔ `logrotate`: **둘 다 유지 권고** (개념 vs 도구, 정당한 구분)
- `expiration` ↔ `time-to-live`: **TTL을 alias로 통합 권고**
- `request-response-cycle` ↔ `http-request-response`: **둘 다 유지 권고** (전자는 서버 내부 계층 흐름, 후자는 HTTP 교환)
- `state-transition` ↔ `ui-state`: **유지 권고** (M13 비즈니스 상태 전이는 UI 상태와 다름)
- **영향**: canonical −1.

> **D1~D8 합계 영향: 약 −35.** 이를 §2의 추정에 반영하면 정비 후 canonical은 **약 454~470**이 된다.

---

## 15. 이번 Phase의 한계

1. **549건 중 개별 원문 근거를 직접 읽고 판정한 것은 약 120건이다.** 나머지는 신호 기반 규칙 판정이며, 그래서 MEDIUM confidence가 319건이다.
2. **Coverage Gap 39건은 완전한 목록이 아니다.** 미션 원문(Notion)을 직접 읽지 못하고 원천 추출 파일을 통해서만 접근했다. 원천이 놓친 요구사항이 있다면 이번에도 놓쳤다.
3. **신규 후보의 우선순위는 미션 요구 강도에 기반한 판단이다.** 보너스 요구(DNS)와 필수 요구(JSX)를 구분했으나 경계는 주관적이다.
4. **기술 역사·표준명 판단은 보수적으로 했다.** 확신이 없는 항목은 REVIEW_CANDIDATE로 남겼다(§21).
5. Phase 1의 판정을 입력으로 썼으므로 Phase 1의 오류 일부가 상속될 수 있다. 단 MERGE 80건은 독립 재검증했다(§4.3).

---

## 16. Validation

product code/data를 변경하지 않았으므로 기존 데이터 validation만 재실행했다.

| 명령 | 결과 |
|---|---|
| `python3 scripts/build_technology_field_atlas.py` | PASS |
| `python3 scripts/validate_technology_field_atlas.py` | **PASS** — 12 fields · 549 terms · 16 missions |
| `python3 scripts/build_frontend_m01_overlay.py` | PASS |
| `python3 scripts/build_wave2_knowledge_maps.py` | PASS |
| `python3 scripts/build_wave3_knowledge_maps.py` | PASS |
| `python3 scripts/build_wave1_mission_overlays.py` | PASS |
| `python3 scripts/build_web_data.py` | PASS |
| `python3 scripts/build_term_map_links.py` | PASS — 227 mapped terms · 236 edges |
| `python3 scripts/validate_knowledge_map.py` | **PASS** — 10 implemented / 12 registry maps · 2 cross-field layers |

**Node.js/npm은 이 머신에 여전히 설치되어 있지 않다.** Phase 1과 동일한 환경 제약이며,
§24 지시에 따라 억지로 설치하지 않았다. `npm run test`·`build`·`test:map-interaction`은 미실행이다.

---

## 17. Next Step

1. **§14의 D1~D8 방침을 먼저 결정한다.** 8개 결정이 38건의 REVIEW_SCOPE와 약 88건의 정리 범위를 확정한다.
2. **Phase 1의 Batch 0(glossary validator)을 이 결정 이후에 구현한다.** MISSION_LOCAL namespace가 생기면 validator 규칙도 달라진다.
3. **신규 canonical 28건(Coverage 23 + M01 5)은 D1~D8 결정과 무관하게 진행 가능하다.** 특히 P0 3건(JSX, useState, 신경망)은 즉시 착수 가능하다.
4. **canonical 수를 성과 지표로 쓰지 않는다.** 549 → 약 460은 사전이 작아진 것이 아니라 정확해진 것이다.

---

*생성: Term Curation & Coverage Gap Audit Phase 1.5 · 기준 commit `7f292f8` · product data 무수정*
