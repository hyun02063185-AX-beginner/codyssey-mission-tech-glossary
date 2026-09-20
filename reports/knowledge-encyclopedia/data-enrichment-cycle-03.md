# Data Enrichment Cycle 03 — 실행 기록

> 이력 문서다. 이후 상태 변화에 맞춰 소급 수정하지 않는다.
> 시작 기준: HEAD `578fd4f` · canonical 519 · Learning Coverage 106/300 (35.3%)
> 판정: **`ENCYCLOPEDIA_DATA_ENRICHMENT_03_READY`**

---

## 1. 이번 Cycle이 한 일

Learning Coverage가 낮고 학습 가치가 높은 5개 학문을 순서대로 보강했고,
두 Cycle 연속 재발하던 내부 데이터 누수를 구조로 막았으며,
Playwright 실행 절차를 안정화했다.

| 항목 | before | after |
| --- | --- | --- |
| Learning Coverage | 106 / 300 (35.3%) | **204 / 300 (68.0%)** |
| 선수 관계 보유 term | 149 / 519 | **255 / 519** |
| authored edge (cluster 작성분) | 375 (135) | **484 (244)** |
| 학습 경로 | 93 | **136** |
| cluster | 15 | **28** |
| academic override | 40 | **48** |
| foundation node (Encyclopedia 신설) | 17 (3) | **17 (3)** — 변화 없음 |
| node type / relation type | 5 / 12 | **5 / 12** — 변화 없음 |

---

## 2. Phase별 기록

### Phase A — Database Systems (26.5% → 77.1%)

uncovered priority term 36개를 전수 검토해 cluster 4개를 썼다.

| cluster | 무엇을 이었나 | edge | path |
| --- | --- | --- | --- |
| `database-query-m11` | 질의문 네 가지의 학습 순서 | 8 | 4 |
| `database-orm-m12-m13` | ORM 어휘 → 그것이 감싸는 DB 개념 | 9 | 4 |
| `data-exchange-m03` | 형식·인코딩·스트리밍 | 6 | 4 |
| `redis-operations-m09` | 캐시의 만료와 한계 | 5 | 2 |

**뿌리는 뿌리로 두었다.** `sql`·`table`·`relational-database`·`data-integrity`는
이 사전 안에서 앞에 둘 것이 없다. 숫자를 올리려고 선행을 붙이지 않았다.

**Impact Gate가 의미 문제를 하나 잡았다.** `schema based_on table`을 넣었더니
파일만 다루는 M03에 "테이블"이 선수 학습으로 올라왔다. 이 사전에서 `schema`는
M03의 CSV 필드 구조와 M11의 테이블 구조라는 **두 뜻을 겸한다**. edge를 되돌렸고,
그 판단을 cluster note에 남겼다.

매핑 교정 1건: `matrix-2d-array` → `data-structures`. 행렬은 어느 쪽으로 보아도
자료구조이고, 데이터베이스의 테이블과 생김새가 비슷한 것이 오히려 혼동을 만든다.

### Phase B — Programming Fundamentals (25.0% → 63.6%)

| cluster | 무엇을 이었나 | edge | path |
| --- | --- | --- | --- |
| `python-language-m03` | 반복문·제너레이터·데코레이터·타입 힌트 | 9 | 4 |
| `python-packaging-m12` | module → 표준 → 외부 → 가상환경 → requirements | 5 | 2 |
| `javascript-state-m01` | 스코프에서 갈라지는 var/let/const, 상태 | 5 | 2 |

**§10을 지켰다.** 문법이 교재에 나오는 순서와 선수 관계를 섞지 않았다.
"변수를 배웠으니 타입 힌트"가 아니라, 타입 힌트는 함수의 매개변수와 반환값에
붙는 표기이므로 함수 뒤에 두었다. `python`·`console`·`if-elif-else`는 뿌리다.

**의도적으로 잇지 않은 것**: `input-validation based_on if-elif-else`.
관계 자체는 성립하지만 `sql-injection prerequisite input-validation`을 타고
M13의 주입 공격 쪽으로 전파될 위험이 있어 이번에는 넣지 않았다.

### Phase C — Software Engineering (27.8% → 82.1%)

이 학문을 열어 보니 **거의 전부가 Git 명령과 GitHub 기능**이었다. §11이 말하는
설계·책임 분리 개념은 Atlas의 `programming-foundations` 분야에 있다는 이유로
학문에서도 프로그래밍 기초에 가 있었다.

| cluster | 무엇을 했나 | edge | path |
| --- | --- | --- | --- |
| `software-design-m12` | 설계 어휘 7건의 학문 홈 교정 + 원칙 줄기 | 6 | 3 |
| `git-internals-m10` | 명령을 그것이 건드리는 대상에 붙임 | 9 | 3 |
| `collaboration-m04` | 원격 갈래 + 브랜치→PR→리뷰→승인→보호 규칙 | 11 | 3 |

매핑 교정 7건: `separation-of-concerns`, `layered-architecture`, `mvc`,
`repository-pattern`, `dependency-injection`, `business-logic`, `commit-subcommand`.
**§12를 데이터에서도 지킨 것이다** — Git은 도구이고 소프트웨어 공학은 더 넓은 원칙이다.

**동결 map의 방향을 따랐다.** `branch-pointer`와 `commit-node`·`parent-commit`을
처음에 반대 방향으로 적었다가 Harness가 순환으로 잡았다. `git-collaboration` map이
이미 "브랜치는 포인터 위에, 커밋은 노드와 부모 위에"라고 선언해 두었으므로
그쪽을 그대로 따랐다. 이 판단은 M10(Git 비슷한 것을 직접 만드는 미션) 맥락에서도 맞다.

### Phase D — Computer Networks (28.6% → 85.7%)

cluster 1개(`network-http-m12`), edge 9, path 4.

**§14를 지켰다.** `IP → TCP → HTTP`를 선수 관계로 만들지 않았다. 기술 설명으로는
자연스럽지만 M12 학습자는 TCP를 모른 채 GET과 POST를 쓴다. 이 사전에 IP 계층
어휘가 따로 없다는 점도 계층을 세우지 않은 이유다. `tcp`와 `subnet`은 뿌리다.

이은 것은 두 갈래뿐이다. 요청·응답 한 쌍에서 갈라지는 메서드·상태 코드·curl,
그리고 M05의 서브넷에서 라우팅 표와 인터넷 게이트웨이로 이어지는 길.

### Phase E — Web Programming (38.9% → 88.9%)

**§15대로 92개를 다시 보지 않았다.** Coverage 계산에서 뽑은 uncovered priority
33개만 대상으로 했다.

| cluster | 무엇을 이었나 | edge | path |
| --- | --- | --- | --- |
| `web-ui-m01-m02` | 문서 → 모양 → DOM → 갱신 → SPA → 리액트 상태 | 15 | 4 |
| `web-forms-m12` | 프레임워크 기능 → 그것이 구현하는 앞의 개념 | 12 | 4 |

`web-forms`의 원칙: 프레임워크 기능을 기능끼리 잇지 않았다. Depends → 의존성 주입,
Uvicorn → ASGI, RedirectResponse → PRG. 프레임워크를 바꿔도 남는 것이 생긴다.

**잇지 않은 것**: `crud`. 네 글자를 묶은 이름일 뿐이라 앞에 둘 하나의 개념이 없고,
데이터베이스 쪽으로 이으면 데이터베이스를 선언하지 않은 M02까지 끌려온다.

---

## 3. Learner-facing data boundary

### 3.1 세 번째 누수

브리프 §4가 지적한 대로, 같은 종류의 누수가 반복됐다.

| Cycle | 무엇이 새어 나갔나 | 어떻게 막았나 |
| --- | --- | --- |
| 01 | academic / role의 `note` | 문장을 학습자용으로 고쳐 쓰고 `noteAudience` 정책 추가 |
| 02 | `academicOverrides[].reason` (Academic View) | 해당 렌더링 제거 |
| **03** | **같은 `reason` (Prerequisite View)** | **구조 변경** |

세 번째가 나왔으므로 §26에 따라 구조를 다시 봤다. 결론은 분명했다.
**필드를 하나씩 막는 방식은 끝나지 않는다.**

### 3.2 projection 계층

`src/learnerView.ts`를 두고 규칙을 뒤집었다. **View는 그래프 node를 직접 표시
데이터로 쓰지 않는다.** 화면에 나갈 수 있는 것은 `LEARNER_FIELDS`가 정한 목록뿐이다.

```
LearnerTerm     key title subtitle href kindLabel detailed
LearnerAcademic … open intro scopeNote termCount coreCount detailCount missionCount
LearnerMission  key title courseLabel href
LearnerRole     … open scopeLabel stateKey intro scopeNote coreFieldTermCount termCount
LearnerPath     key title why steps
```

핵심은 **값을 문장으로 바꾼다**는 것이다. `visibility`는 `open`(boolean)과
`scopeNote`(문장)로, `coverageState`는 `scopeLabel`로 나간다.
`declared`·`insufficient-coverage` 같은 내부 상태 이름이 화면에 나갈 경로가 사라진다.

경로를 고르는 기준(cluster 출처인지)도 View에서 projection으로 내렸다.

### 3.3 두 번째 발견 — 필드가 아니라 문장

projection을 세운 뒤 화면 4개를 다시 열어 보니 누수가 더 있었다. 이번에는 필드가
아니라 **문장**이었다. `edge.reason`과 `path.why`는 화면에 그대로 나가는데, 같은 칸에
"왜 이 관계를 새로 적었는가"라는 유지보수 판단까지 적고 있었다.

화면에 나가고 있던 것 9건:

- "기존 map 에는 둘 사이에 대칭 관계만 있어 순서를 말하지 못했다" — 4건 (이번 Cycle에 내가 넣음)
- "upstream-registry.json :: U9-git-remote-self-reference 참조" — 1건 (이전 Cycle부터. 학습자에게 내부 등록부 **파일명**을 보여 주고 있었다)
- "기존 map 의 edge 를 그대로 재사용한다" 류 경로 설명 — 4건

전부 설명문에서 빼고 cluster의 `review.note`로 옮겼다. note는 화면에 나가지 않는다.
**판단 근거는 하나도 버리지 않았다.**

### 3.4 Display Contract Test (6개)

문자열 blacklist가 아니라 구조를 본다.

1. projection의 키가 허용 목록과 **정확히 일치**하는가
2. projection이 만든 문자열에 유지보수 어휘가 없는가
3. raw id·내부 상태값이 화면 글자가 되지 않는가
4. 닫힌 학문이 상태 이름이 아니라 문장으로 설명되는가
5. **View 소스가 내부 필드를 직접 읽지 않는가**
6. cluster가 작성한 `reason`/`why`에 유지보수 어휘가 없는가

(5)가 이번 누수를 실제로 잡는 검사다. `RoleView`에 `.note`를 되돌려 넣어
**실패하는 것까지 확인했다**.

### 3.5 남긴 것 — EX03

`map:` 출처 텍스트는 검사에서 제외했다. 동결된 자료라 고칠 수 없다.
그런데 그 `reason` 9건이 "hash map은 entry를 bucket에 배치한다",
"BFS는 graph traversal strategy다" 같은 **개발자용 영어 문장**이라
한국어 학습자에게는 설명이 되지 않는다. `upstream-registry.json`에
**EX03**으로 등록했다. 원본은 고치지 않는다.

---

## 4. Playwright 안전 포트 QA

두 가지가 **따로** 막혀 있었다.

1. 4173을 다른 프로젝트가 쓰고 있었는데 `reuseExistingServer` 때문에 그 서버를
   재사용해 **엉뚱한 앱**을 상대로 테스트가 돌았다.
2. 빈 포트를 골라도 `EACCES`가 났다. 점유가 아니라 OS 예약 범위였다.

제품 설정(`playwright.config.ts`)은 고치지 않고 실행 절차를 `scripts/qa_playwright.py`로
옮겼다.

```
안전한 포트 고르기 → 서버 직접 띄우기 → 이 저장소의 앱인지 확인 → Playwright 실행
```

`webServer`를 두지 않으므로 **남의 서버를 재사용하는 경로 자체가 없다.**
대상 확인은 제목 한 줄로 끝내지 않는다. 생성된 그래프 파일의 `artifactType`까지
확인해 다른 앱이 우연히 같은 제목을 써도 갈라지게 했다. production code는 건드리지
않았고 새 marker도 넣지 않았다.

**포트 판정에서 알게 된 것**: 이 컴퓨터에서 `netsh`가 알려 주는 TCP 예약 범위는
15개(4737–5240, 5388–5887 등)인데, 6421·6733·7311·7642는 **거기 없으면서도**
bind에서 `EACCES`가 난다. Hyper-V 쪽이 따로 잡아 두는 범위로 보인다.
즉 **netsh 결과는 참고이고 믿을 수 있는 판정은 bind 시도뿐**이다. 스크립트는 그렇게 동작한다.

---

## 5. Impact / Contract 결과

전 Phase 누적 unexpected cross-cluster effect **14건 발생 → 최종 0**.
모두 "관계는 맞고 미션 학문 배정이 좁은 경우"였다.

| 미션 | 넓힌 학문 | 근거 |
| --- | --- | --- |
| M06 · M09 · M10 · M12 · M13 | `programming-fundamentals` | 전부 파이썬 또는 자바스크립트로 코드를 쓰는 미션 |
| 예비 M01 · M01 | `software-engineering` | 둘 다 저장소를 만들고 README를 쓴다 |
| M13 | `software-engineering` | Depends → 의존성 주입 경로로 설계 어휘를 얻는다 |

**관찰**: `programming-fundamentals`가 5개 미션에서 한꺼번에 불거졌다. 이 학문은
사실상 **모든 미션의 보편 기반**인데 미션 학문 모델에는 그것을 표현하는 자리가 없다.
지금은 미션마다 `supporting`에 적는 것으로 처리했지만, Cycle마다 같은 일이 반복될
것으로 본다. **U17**로 등록한다.

Global Contract 위반 **0건**. 기존 3개 계약은 그대로 유지했고, 이번 Cycle에
반복 발견된 오류가 표시 경계 쪽이라 계약은 그쪽(§3.4)에만 추가했다.

---

## 6. Academic / Role / Timeline 회귀

**학문 노출 상태 변화 없음** — active 13 / declared 1 (sre).

| 학문 | terms | paths |
| --- | --- | --- |
| web-programming | 92 → 92 | 8 → 16 |
| database-systems | 67 → 66 | 8 → 22 |
| programming-fundamentals | 72 → 65 | 6 → 15 |
| software-engineering | 58 → 65 | 3 → 12 |
| computer-networks | 29 → 29 | 7 → 12 |
| computer-architecture | 6 → 6 | 4 → 6 |
| data-structures | 19 → 20 | 5 → 5 |
| 나머지 7개 | 변화 없음 | 변화 없음 |

term 수 이동은 전부 학문 홈 교정(8건)의 결과다. canonical은 하나도 늘지 않았다.

**직무 완전 무변화** — active 8 / limited 2(qa-engineer, site-reliability-engineer).
coreFieldTermCount·termCount 10개 직무 전부 동일. unexpected membership 0.
SRE는 성장 정책 조건이 바뀌지 않아 다시 검토하지 않았다(§24).

**Timeline**: `evolved_from` 3건, 사슬 0. `DEFERRED_FOR_DATA_READINESS` 유지.
숫자를 채우기 위한 `evolved_from`을 하나도 추가하지 않았다.

---

## 7. Coverage Quality Audit (§20)

| 실패 조건 | 결과 |
| --- | --- |
| generic `related`를 경로로 사용 | 0 — `related`는 learn-first 집합에 없다 |
| weak relation 증가 | 신규 edge 109건 중 confidence MEDIUM 9건, LOW 0건 |
| 같은 의미 edge 중복 | 0 — Harness의 중복 검사 통과. `uses`(구성)와 `based_on`(학습 순서)은 서로 다른 주장이며, 학습 주장이 독립적으로 참인 경우에만 적었다 |
| unrelated mission propagation | 1건 발생(M03 ← 테이블) → 되돌림. 최종 0 |
| 경로가 지나치게 길어짐 | 최장 6단계(`from-proposal-to-rule`), 평균 3.8단계 |
| advanced concept가 beginner path 앞에 등장 | 0 — 모든 경로는 학문 앵커나 뿌리 개념에서 시작한다 |

---

## 8. 전체 QA

| 항목 | 결과 |
| --- | --- |
| glossary validator | 519 canonical · 46 mission-local · **0 error / 0 warning** · 780 info |
| knowledge-map validator | PASS |
| atlas validator | PASS |
| encyclopedia validator | 519 · 28 cluster · 484 edge · **0 error / 0 warning** |
| content-tier validator | PASS (A=95 B=247 C=177) |
| 결정론적 출력 | 2회 재빌드 후 byte 동일 |
| unit test | **59 passed** (encyclopedia views 28) |
| Playwright | **16 passed** (포트 8456, 앱 확인 완료) |
| production build | PASS |
| extension build | PASS |
| RC1 diff | `data/curated` · `content` · `data/knowledge-maps` · `extension` **변경 0** |

---

## 9. 다음 Cycle 권고

Learning Coverage 68.0%. 남은 uncovered priority 96개의 분포:

| 학문 | 남은 uncovered | 현재 |
| --- | --- | --- |
| operating-systems | 18 | 41.9% |
| information-security | 15 | 44.4% |
| programming-fundamentals | 13 | 68.3% |
| database-systems | 11 | 77.1% |
| devops | 8 | 27.3% |

**operating-systems**와 **information-security**가 다음이다. 둘 다 수록량이 많고
(53 / 51) 미션 영향 범위가 넓다(8 / 10). 특히 정보보안은 M13 primary이면서
10개 미션에 걸치는 횡단 학문이라, Cycle 02에서 확인한 **공격 개념 역전파**를
다시 전수 확인해야 한다.

**devops**는 비율이 가장 낮지만(27.3%) 절대 수가 8이라 우선순위는 그다음이다.

권고하지 않는 것: View 재설계, ontology 변경, canonical 대량 추가,
SRE 활성화를 위한 용어 추가, Timeline 숫자 채우기.

---

## 10. 커밋

| commit | 내용 |
| --- | --- |
| `c7e0898` | Phase A — database systems |
| `a2eecac` | Phase B — programming fundamentals |
| `18b7dd3` | Phase C — software engineering + 설계/Git 분리 |
| `095367b` | Phase D — computer networks |
| `b0fdca2` | Phase E — web programming |
| `506dd3f` | learner-facing projection 계층 |
| `1355ae0` | Playwright 안전 포트 QA |
| `505194d` | 학습자용 문장에서 유지보수 근거 제거 |
