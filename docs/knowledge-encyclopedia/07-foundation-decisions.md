# 07. Foundation Decisions (ADR)

> 상태: **ACCEPTED** — Foundation Cycle(2026-09-19)에서 확정. Sprint 0의 PROPOSED 항목 중 이 문서에 실린 것은 확정으로 승격된다.
> 형식: 결정마다 `Decision / Reason / Evidence / Rejected Alternative / Change Cost`.
> 과거 문서를 삭제하거나 소급 수정하지 않는다. 충돌하면 **이 문서가 최신**이다.

---

## FD-01. Scope — Encyclopedia는 "수집"이 아니라 "연결" 확장이다

**Decision**
기존 범위 선언("컴퓨터 과학 전체 용어를 모두 수록하는 백과사전은 만들지 않는다")을 **유지하고 삭제하지 않는다.** Knowledge Encyclopedia는 그 선언의 대상이 아니다. 선언은 **canonical term 수집의 상한**에 관한 것이고, Encyclopedia는 **이미 있는 canonical 위에 관계·학문·경로 view를 얹는 층**이다.
운영 규칙: Encyclopedia 작업은 canonical을 대량 추가하지 않는다. 필요한 상위 개념은 `foundation:` node로 두고, canonical 승격은 `docs/13` 성장 정책(batch review)을 따른다.

**Reason** 원 선언의 금지 대상과 Encyclopedia의 작업 내용이 서로 다른 축이다. 하나는 "무엇을 사전에 담을 것인가", 다른 하나는 "담긴 것을 어떻게 연결해 보여줄 것인가".

**Evidence**
- `docs/00_project_overview.md` §5 "하지 않는 것" 원문은 **"컴퓨터 과학 전체 **용어**를 모두 **수록**하는 백과사전"**이며, 같은 목록에 "모든 용어를 웹툰으로 만드는 콘텐츠 프로젝트", "AI 설명을 검수 없이 자동 게시"가 함께 있다 → 수집·제작 범위 통제 조항이다.
- `README.md` §Project Goal도 같은 문장 뒤에 "미션에 실제 등장한 용어를 **우선 수집**한다"로 이어진다 → 수집 우선순위 선언.
- `docs/13_canonical_term_selection_growth_policy_v1.md` §Purpose: "Codyssey is a **growing learning knowledge system**, not a count-driven static dictionary" → 성장 자체는 금지된 적이 없고, 절차가 정해져 있을 뿐이다.
- 두 문서 모두 최초 커밋 `bcdf63b`(기획 초기)부터의 문구로, Atlas·Map 같은 연결 기능이 그 후 추가되었는데도 유지되었다 → 연결 기능은 이 조항의 위반으로 취급된 적이 없다.

**Rejected Alternative**
(a) README/`docs/00` 문구 수정 — 원 결정의 문맥을 지우게 되고 Owner Gate 항목이다. 해석이 확정된 이상 문구 변경이 필요 없다.
(b) 확장 보류 — 근거 없음. 위 evidence가 충돌 없음을 보인다.

**Change Cost** 0 (문서 변경 없음). 이후 canonical 대량 추가가 실제로 필요해지면 그때 Owner Gate로 재상신.

---

## FD-02. Mission ID contract — 내부 canonical 1개 + 외부 alias 3개

**Decision**
Encyclopedia **내부 canonical Mission ID = `<course>-m<NN>` 소문자** (예: `main-m01`, `preliminary-m03`). 노드 ID는 `mission:main-m01`.
기존 표기는 **전부 유지**하고 builder의 normalization layer가 흡수한다. `missions.json`의 각 항목이 alias를 명시적으로 들고 있어 매핑이 데이터로 보인다.

| 표기 | 사용처 | 성격 |
| --- | --- | --- |
| `course:"main"` + `mission:"M01"` (구조체) | `glossary-master`의 `mission_refs` | **데이터 원본** |
| `"main/M01"` | `mission-term-map`, `missions.json`, `mission-field-matrix`, `term-field-classification.missions[]` | 내부 키 |
| `"main-m01"` | atlas routing, 10개 map의 overlay, map-registry, concept-connections, term-map-links, `#/maps/:id?mission=` 쿼리 | **공개 URL 파라미터** |
| `"main-M01"` | `#/missions/main-M01` 웹 라우트 | **공개 URL 경로** |

**Reason** 네 표기가 이미 공개 계약(URL)과 내부 데이터에 동시에 박혀 있어 통일은 파괴적이다. 정규화 지점을 한 곳(builder)으로 모으면 통일 없이도 단일 해석이 가능하다.

**Evidence**
- 표기 사용처를 저장소 전수 grep으로 확인: slash형 4개 파일군(586+16+16+16회), dash형 20여 파일(routing 34, registry 24/42, overlay 각 1~2회).
- **Sprint 0이 놓친 4번째 표기 발견**: `src/App.tsx`의 `Missions`는 `to={/missions/${c}-${id}}`로 **대문자** `main-M01` 링크를 만들고, `Mission`은 `/^M\d\d$/`로 검증한 뒤 지도용으로만 `main-m01`로 소문자화한다. 즉 `#/missions/main-m01`은 **404("존재하지 않는 미션입니다")**.
- `src/publicWebLinks.ts`는 `missionId`를 그대로 URL 쿼리에 넣는다(소문자 dash형). Extension이 이 계약에 묶여 있다.

**Rejected Alternative**
(a) 전체를 한 표기로 통일 — 공개 URL 2종과 Extension 계약을 깬다(Owner Gate). 이득 없음.
(b) 새 5번째 정규 ID 도입 — 혼란만 증가.

**Change Cost** 낮음. `missions.json` 16줄에 alias를 적고 builder가 4개 표기를 받아들이면 된다. 기존 파일 변경 0.

---

## FD-03. Foundation / Canonical boundary — 이름이 다르다고 foundation을 만들지 않는다

**Decision**
판정 순서를 규칙으로 고정한다.

```
1) id / term_en / term_ko / aliases 완전일치 검색
2) 없으면 한국어·영문 변형, 복수형, 약어, 부분일치 검색
3) 의미적 동등 canonical이 있으면 → 재사용 (foundation 금지)
4) 동등물이 없고 + 학습 경로에서 hub로 실제 필요 → foundation: node
   (promotionCandidate + foundationRationale 필수)
5) 동등물도 없고 경로에도 불필요 → 만들지 않는다
```
Foundation은 **canonical의 대체 저장소가 아니다.** 상세 콘텐츠를 갖지 않으며, 승격은 `docs/13` 절차로만 한다.

**Reason** Sprint 0의 "hub canonical 0" 보고를 그대로 받아들이면 **이미 있는 개념을 두 번 만든다.**

**Evidence** — 재검증 결과 Sprint 0 보고가 부분적으로 틀렸다.

| Sprint 0 주장 | 재검증 결과 |
| --- | --- |
| Hash Table canonical 없음 | **틀림.** `hash-map`(term_ko 해시맵 / term_en Hash Map, summary "키를 해시해 값에 빠르게 접근하는 자료구조") = Hash Table. **재사용** |
| REST canonical 없음 | **틀림.** `rest-api`가 REST를 담고 있다. 재사용 |
| Request/Response canonical 없음 | **틀림.** `http-request-response`, `request-response-cycle` 존재. 재사용 |
| Database canonical 없음 | 일반명사는 없으나 `relational-database` 존재 → pilot 경로에는 이것으로 충분 |
| CPU canonical 없음 | `cpu-usage`의 **alias가 문자 그대로 "CPU"**이고 `cpu-architecture`도 있다. 신규 금지, alias 품질 문제로 backlog 기록 |
| Client / Server / API(일반) / Key-Value Store / Data Structure / Operating System | **맞음.** 완전일치·부분일치 모두 0 |

최종 foundation 신설은 **3개뿐**: `foundation:client-server`, `foundation:api`, `foundation:key-value-store`.
(Data Structure와 Operating System은 학문 node `academic:data-structures` / `academic:operating-systems`가 경로 시작점을 맡으므로 foundation 불필요.)

**Rejected Alternative**
(a) Sprint 0 목록대로 8~10개 foundation 생성 — `hash-map`/`rest-api`와 개념 중복.
(b) hub를 canonical로 즉시 추가 — RC1 동결 및 성장 정책 위반.

**Change Cost** 매우 낮음(3 node). 승격 시 `foundation:x → term:x` rename 1회.

---

## FD-04. 기존 synthetic foundation 14개 — 전부 map-only 유지, 승격 0

**Decision** 14개 모두 **map-only synthetic으로 유지**한다. Encyclopedia는 이들을 읽기만 하고 재정의·승격하지 않는다. Encyclopedia가 만드는 foundation은 이 14개와 **ID가 겹치지 않아야** 하며 validator가 강제한다.

| 분류 | node | 판정 |
| --- | --- | --- |
| Mission-local 어휘 4 | `mission-local-router-layer`, `-service-layer`, `-repository-layer`, `-monitor-sh` | **map-only 유지.** `mission-local-terms-v0.1.json`에 원본이 있고(`router-layer` 등 4건 확인), mission-local은 canonical로 올리지 않는 것이 기존 정책 |
| 표준/명세 3 | `ecmascript`, `html-standard`, `xml-http-request` | map-only 유지. `defined_by`/`evolved_from` 설명용이며 학습 경로 hub가 아님 |
| 브라우저 플랫폼 4 | `web-platform`, `web-storage`, `dom-event`, `async-execution` | map-only 유지. Frontend 한정 설명 장치 |
| CSS 2 | `css-media-queries`, `css-layout` | map-only 유지 |
| **개념 중복 1** | `request-response` (frontend, boundary) | map-only 유지하되 **경고**: canonical `http-request-response`/`request-response-cycle`과 같은 개념이다. Encyclopedia는 **canonical 쪽을 쓴다.** 동일 개념을 세 번째 ID로 만들지 않는다 |

**Reason** 14개 모두 특정 map의 설명 장치로 설계되었고(각자 `foundationRationale` 보유), 전역 학습 그래프의 hub 역할을 하지 않는다. 승격은 이득 없이 ID 표면만 넓힌다.

**Evidence** 14개 전수 확인(소속 map, role, degree, rationale). degree 1이 8개로 대부분 단일 term 설명용. `request-response`는 degree 1(Frontend 내부)이며 canonical 2개와 의미 중복.

**Rejected Alternative** `request-response`를 Encyclopedia foundation으로 승격 — canonical과 3중 중복이 된다.

**Change Cost** 0.

---

## FD-05. Relation Ontology SSOT — 어휘는 validator, 의미는 Encyclopedia

**Decision** 두 층으로 분리하고 각각 원본을 하나만 둔다.

| 층 | SSOT | 내용 |
| --- | --- | --- |
| **어휘**(어떤 relation이 존재하는가) | `scripts/validate_knowledge_map.py`의 `RELATIONS` 상수 (12종) | Encyclopedia validator가 **이 모듈을 import해서 대조**한다. 목록을 베껴 쓰지 않는다 |
| **의미**(방향·대칭·역관계·learn-first 포함 여부) | `data/encyclopedia/relation-ontology.json` (신규) | Frontend map의 방향 문구를 정본으로 삼아 기계 판독 가능하게 기술 |

기존 10개 `knowledge-map.json`의 `relationOntology` 블록은 **각 map의 로컬 표시용 사본**으로 남기고 수정하지 않는다(변경 금지 영역).
**신규 relation type은 0개.** 역관계는 저장하지 않고 builder가 **인덱스로 파생**한다(역방향 edge를 실제로 추가하면 중복이 된다).

**Reason** 현재 ontology는 10개 파일에 복제되어 문구가 표류하고 있고, **방향이 적힌 정의는 Frontend 하나뿐**이다. 어휘와 의미의 원본을 갈라두면 기존 파일을 건드리지 않고도 단일 해석이 생긴다.

**Evidence**
- `RELATIONS` 상수 = 12종. 각 map 파일은 그중 7종만 재선언(Frontend만 12종).
- 방향 명시: Frontend `prerequisite` = "B를 먼저 이해하면 A를 이해하기 좋다". 나머지 9개 = "먼저 이해하면 좋다."(A/B 없음). `compare_with` 문구 4종, `provided_by` 3종으로 분기.
- 결과 오염: prerequisite edge 4개 중 2개(`normalization → data-integrity`, `staging-area-git-add → commit`)가 Frontend 정의와 **반대로 읽힌다**. 둘 다 방향 정의가 없는 map 소속.
- 미선언 relation을 사용하는 map은 현재 0개(확인함) — validator가 전역 허용하므로 잠재 위험만 존재.

**Rejected Alternative**
(a) 10개 map 파일의 ontology를 통일 — 변경 금지 영역, Owner Gate.
(b) Encyclopedia가 relation 목록을 자체 복제 — 세 번째 사본이 생긴다.

**Change Cost** 낮음. 기존 2건의 역방향 edge는 **U5로 남기고 이번에 수정하지 않는다**(map 파일은 동결). Encyclopedia는 자체 edge에만 방향 규약을 강제한다.

### 확정된 방향 규약

| relation | from → to | 대칭 | learn-first | 역관계(파생) |
| --- | --- | :-: | :-: | --- |
| `prerequisite` | 나중 → **먼저 알아야 하는 것** | | ✔ | `unlocks` |
| `based_on` | 기반을 두는 쪽 → 기반 | | ✔ | `basis_of` |
| `is_a` | 하위/구체 → 상위/일반 | | ✔ | `has_kind` |
| `cs_foundation` | 설명 대상 → CS 기본 원리 | | ✔ | `explains` |
| `uses` | 사용하는 쪽 → 사용되는 것 | | | `used_by` |
| `provided_by` | 제공받는 쪽 → 제공자 | | | `provides` |
| `defined_by` | 대상 → 표준/명세 | | | `defines` |
| `enabled_by` | 가능해진 쪽 → 가능하게 한 것 | | | `enables` |
| `evolved_from` | 나중 → 이전 맥락 | | | `evolves_to` |
| `compare_with` | — | ✔ | | — |
| `interacts_with` | — | ✔ | | — |
| `mission_uses` | 미션 맥락 전용(Frontend) | | | — |

---

## FD-06. Academic structure — 14개, crosswalk는 단일 표, 학문 ≠ 기술 분야

**Decision**
학문 11 + 적용영역 3 = **14개**를 `data/encyclopedia/academic-fields.json`에 authoring한다.
`atlasCrosswalk`는 **Atlas field 12개 → academic 1개**의 단일 표로 파일 최상단에 둔다(역방향이 아니라 정방향 1:1이므로 모호성이 없다). term의 academic 기본값은 이 표에서 파생하고, 예외만 cluster 파일에서 override 한다.
학문 node의 `termCount`/`status`는 **authoring하지 않고 builder가 계산**한다.

**Reason & Evidence — "47개 불일치"의 실체**
Sprint 0이 "파생 분류 오류 후보 47개"로 보고한 건을 전수 분석했다.

| 원인 | 건수 | 판정 |
| --- | ---: | --- |
| glossary `category`가 너무 거칠어 그대로 전파됨 (`Programming` 83개 grab bag, `Data`, `Server / Infrastructure`) | **39** | **source metadata problem** — Atlas 규칙의 잘못이 아니다 |
| Atlas가 이미 명시적 override로 다중 맥락을 표현 중 (json, github-pages, vercel, netlify, render, railway, filter, call-stack) | **8** | **legitimate multi-field** — `secondaryFields`로 이미 모델링됨 |
| Atlas **mapping rule error** | **0** | 발견되지 않음 |

핵심 결론: **이것은 Atlas의 오류가 아니라 축(axis)의 차이다.** `mutex`의 *기술 분야* 홈이 programming-foundations인 것은 타당하고(코드에서 쓰는 프로그래밍 개념), *학문* 홈이 operating-systems인 것도 타당하다. 따라서
- Atlas를 "고치는" 작업을 하지 않는다 (변경 금지 영역이기도 하다).
- 학문 축은 Atlas에서 파생하되 **체계적 어긋남이 존재함을 전제**하고, override를 정상 경로로 취급한다.

**Rejected Alternative**
(a) Atlas classification 수정 — Owner Gate이며, 기술 분야로서는 옳은 분류를 학문 때문에 훼손한다.
(b) 519개 학문 분류를 전부 authoring — minimal authoring 원칙 위반, 유지 불가.
(c) `(category, atlasField)` 2키 규칙표 — `mutex`와 `function`이 같은 키를 가져 분리 불가. 효과 없음.

**Change Cost** 중간. override는 cluster 단위로만 쌓이며, pilot에서 비율을 실측해(E10) 25%를 크게 넘으면 전략을 재검토한다.

### 확정 목록

| academic id | 한국어 | kind | prerequisiteFields |
| --- | --- | --- | --- |
| `programming-fundamentals` | 프로그래밍 기초 | academic | — |
| `data-structures` | 자료구조 | academic | programming-fundamentals |
| `algorithms` | 알고리즘 | academic | data-structures, programming-fundamentals |
| `computer-architecture` | 컴퓨터구조 | academic | programming-fundamentals |
| `operating-systems` | 운영체제 | academic | computer-architecture, programming-fundamentals |
| `computer-networks` | 컴퓨터 네트워크 | academic | programming-fundamentals |
| `database-systems` | 데이터베이스 | academic | data-structures, programming-fundamentals |
| `software-engineering` | 소프트웨어공학 | academic | programming-fundamentals |
| `web-programming` | 웹 프로그래밍 | academic | computer-networks, programming-fundamentals |
| `information-security` | 정보보안 | academic | computer-networks, operating-systems |
| `artificial-intelligence` | 인공지능 | academic | algorithms, programming-fundamentals |
| `cloud-computing` | 클라우드 컴퓨팅 | applied | operating-systems, computer-networks |
| `devops` | DevOps | applied | software-engineering, operating-systems, computer-networks |
| `sre` | SRE | applied | devops, operating-systems, computer-networks |

`atlasCrosswalk` (12 → academic): frontend-web-ui→web-programming, backend-server-api→web-programming, data-database→database-systems, systems-runtime→operating-systems, devops-infrastructure→devops, git-collaboration→software-engineering, security-identity→information-security, programming-foundations→programming-fundamentals, algorithms-data-structures→data-structures, network-web-protocol→computer-networks, ai-ml-computing→artificial-intelligence, developer-workflow-tools→software-engineering.

→ 기본 파생만으로는 `algorithms`, `computer-architecture`, `cloud-computing`, `sre` 4개가 **term 0개**가 된다. 이는 숨기지 않고 `status: declared`로 노출한다(빈 학문을 그럴듯하게 채우지 않는다).

---

## FD-07. Technology Atlas 재사용 — 신규 taxonomy 0

**Decision** Atlas 12 field를 기술 분야 모델로 **그대로** 사용한다. Middleware·SRE 등은 field로 만들지 않는다(각각 canonical term / academic+role로 표현). Encyclopedia는 Atlas 파일을 **읽기만** 한다.

**Reason / Evidence** `field-taxonomy.json`이 이미 authored SSOT이고 519 term 전부가 분류되어 있으며(HIGH 512), `docs/12`가 cross-field layer 2종의 "빈 canvas 금지"를 이미 결정했다.

**Rejected Alternative** SRE field 신설 — 대응 canonical이 사실상 4개(observability, health-check, root-cause-analysis, logging)로 빈 canvas가 된다.

**Change Cost** 0.

---

## FD-08. Role — node 아님, metadata + 파생 membership

**Decision** `data/encyclopedia/roles.json`에 직무 10개를 두되, 저장하는 것은 **field/academic 가중치와 coverage**뿐이다. 직무별 term 목록은 저장하지 않고 builder가 membership으로 파생한다. role node는 그래프에 넣지 않는다.

**Reason** 직무 간 구조 관계(선후·상하)가 없고, term×role 태그는 519×10 규모로 노후화가 빠르다.

**Evidence** 저장소에 직무 데이터가 전무. QA/test·CI-CD·Kubernetes canonical 0, SRE 관련 canonical 4개 수준 → 정직한 `coverage` 표기가 필요.

**Rejected Alternative** role을 node로 만들고 `relevant_to_role` edge 추가 — 신규 relation + 수천 edge. 파생으로 동일 결과.

**Change Cost** 낮음. 직무 고유 학습 순서가 필요해지면 그때 node로 승격.

---

## FD-09. Learning Path — 계산 우선, 저장은 "순서 + 왜"

**Decision** 선수학습 질의는 learn-first 부분그래프(`prerequisite`, `based_on`, `is_a`, `cs_foundation`)에서 **계산**한다. 큐레이션 경로는 `steps[]`와 서사(`why`)만 cluster 파일에 저장하고, **인접 step은 그래프에 edge가 존재해야** validator를 통과한다.

**Reason** 경로를 별도 관계로 저장하면 edge와 경로가 서로 다른 진실이 된다.

**Evidence** 기존 `learningRoutes` 38개가 같은 모양(순서+설명)으로 이미 운영 중이며 relation을 따로 주장하지 않는다.

**Rejected Alternative** path를 edge 없이 자유롭게 저장 — 검증 불가능한 주장이 쌓인다.

**Change Cost** 낮음. edge를 먼저 넣어야 하므로 authoring 순서가 강제된다(의도된 효과).

---

## FD-10. U1~U3 처리 결과

| 미확정 | 결과 | 근거 |
| --- | --- | --- |
| **U1** 범위 선언 | **해결** → FD-01 | 원문 문맥·성장 정책 문서 |
| **U2** 학문 14개·선수 순서 | **해결(잠정 확정)** → FD-06 | 일반 CS 커리큘럼 + 저장소 term 분포. 커리큘럼 소유자가 언제든 `academic-fields.json` 한 파일로 수정 가능 |
| **U3** 미션×학문·studyNext | **해결(잠정 확정)** → `missions.json` | 미션별 Atlas field 분포(데이터) + 미션 제목·요구사항(raw manifest) |
| **U4** 미션 order | **해결** | 예비 M01~03 → 본과정 M01~13. `mission-map-routing.json`의 배열 순서와 일치 |
| **U5** prerequisite 역방향 2건 | **미해결(의도적)** | map 파일은 동결. Owner 승인 후 별도 커밋 |
| **U6** 실습 term 근사 | **해결(근사 채택)** | `direct`로 근사. `mission_uses` edge가 0개라 더 나은 근거가 없음 |
| **U7** 학문 지도 UI 형태 | **미해결(범위 밖)** | View Sprint에서 결정 |
| **U8** mission-term-map 중복 | **미해결(의도적)** | RC1 보호. Encyclopedia는 master만 읽어 영향 없음 |

U2·U3는 "잠정 확정"이다. **근거가 저장소에 없는 커리큘럼 사실을 공식 사실처럼 단정하지 않는다** — 두 파일 모두 사람이 직접 고칠 수 있는 최소 형태로 두었고, `00-project-status.md`에 수정 경로를 적어 둔다.

---

## FD-11. Curriculum Baseline — 미션이 "다루는" 학문과 "딛고 선" 학문을 가른다

**Decision** 과정 전체가 전제하는 학문을 `data/encyclopedia/curriculum-policy.json`에 **한 번만** 적는다. 미션 범위 계약을 `선언한 학문(primary + supporting) + Curriculum Baseline`으로 정교화한다. 현재 baseline은 `programming-fundamentals` 하나다. baseline은 **선수 학습을 만들어 내지 않고** 계산된 선수 학습이 그 학문에 닿는 것을 허용하는 범위 정책일 뿐이다.

**Reason** 좁은 계약은 "관계가 틀렸다"와 "학문 배정이 좁다"를 구분하지 못했다. 세 Cycle 연속으로 모든 위반이 후자였고, 해결은 늘 `supporting`에 같은 값을 더 적는 것이었다. 계약이 잡아야 할 것은 미션과 무관한 영역으로 학습이 번지는 일이지, 과정의 바닥을 밟는 일이 아니다.

**Evidence** Data Enrichment Cycle 03에서 M06·M09·M10·M12·M13 다섯 미션이 "파이썬이나 자바스크립트로 코드를 쓴다"는 같은 이유로 한꺼번에 `programming-fundamentals`를 추가해야 했다. 적용 후 **그래프 변화 0** — baseline이 데이터를 만들어 내지 않는다는 것이 실측으로 확인됐다.

**Rejected Alternative** (a) 미션마다 계속 적기 — Cycle마다 반복된다. (b) `operating-systems`·`software-engineering`도 baseline에 넣기 — 둘 다 보편이 아니다. OS는 M01·M04·M10·M11·M12·M13이 닿지 않고, SE는 Cycle 03에서 추가된 세 곳 모두 그 미션이 실제로 다루는 내용이었다. (c) 새 relation type이나 node type으로 표현 — 범위 정책에 구조 변경은 과하다.

**Change Cost** 낮음. 파일 한 장과 계약 한 줄. baseline을 늘리거나 줄이는 것도 같은 파일에서 끝난다. 다만 **늘리는 쪽은 신중해야 한다** — baseline이 넓어질수록 계약이 잡아 주는 것이 줄어든다.

**Applies to** U17.

---

## FD-12. Atlas 분야 소속은 학문 소속의 "후보 근거"이지 결론이 아니다

**Decision** Atlas Technology Field와 Academic Field를 같은 분류로 취급하지 않는다. Atlas 소속은 학문 배정의 **증거**일 뿐이고, 학문 배정은 **의미 판단**이다. 따라서 한 Atlas 분야 안의 term이 서로 다른 학문으로 갈라질 수 있다. Atlas taxonomy는 고치지 않는다.

**Reason** `data-database` 분야는 "데이터베이스"와 "데이터 다루기"를 한 묶음으로 담고 있어, crosswalk가 그것을 그대로 물려받으면 행렬·라벨 정규화·패턴 필터 같은 것이 데이터베이스 학문에 들어온다. 분야는 "어느 기술 묶음에서 만나는가"를 말하고, 학문은 "어느 지식 체계가 이것을 설명하는가"를 말한다. 두 물음의 답이 늘 같지는 않다.

**Evidence** Coverage Completion Cycle 04에서 `schema`·`filter`·`label-normalization` 세 건이 이 이유로 DEFERRED 되었다. Cycle 02의 `cpu-architecture`·`locality`, Cycle 03의 설계 어휘 6건도 같은 모양이었다. 현재 academic override 48건이 전부 이 현상이다 — override는 Atlas의 오류가 아니라 **두 축이 다르다는 증거**다.

**Rejected Alternative** (a) Atlas taxonomy를 학문에 맞춰 고치기 — RC1 동결 영역이고, 기술 분야 지도로서는 현재 배치가 맞다. (b) 한 분야는 한 학문으로 강제 — 잘못된 배정이 쌓인다. (c) 판단이 어려운 것을 무기한 DEFERRED — 판정 자체를 미루는 것이라 "왜 경로가 없는지 모르는 상태"가 남는다.

**Change Cost** 없음. 이미 하고 있던 일을 규칙으로 적은 것이다. 판단 근거는 term의 한 줄 정의와 mission-term-map이며, 상세 콘텐츠가 그와 어긋나면 상세 콘텐츠를 근거로 쓰지 않고 upstream-registry에 등록한다(R12가 그 사례).

**Applies to** U18.

---

## FD-12 후속. `filter` 재판정 — 근거가 틀렸으면 결론도 다시 본다

**Decision** `filter`의 학문 홈을 `database-systems`에서 `artificial-intelligence`로 옮긴다(secondary `programming-fundamentals`). 학습 구조 판정(`NO_PREREQUISITE_NEEDED`)은 바뀌지 않는다.

**Reason** Coverage Completion Final에서는 "한 줄 정의가 일반적인 선택 처리이므로 데이터베이스 유지"로 결론지었다. 그런데 그때 함께 읽은 상세 콘텐츠가 R12 결함이었다 — 실제 등장 미션(예비 M03)이 아니라 M11·M12의 SQL 작업을 설명하고 있었고, 코드 예도 `SELECT * FROM example;`이었다. **근거로 삼은 문서가 틀려 있었다.**

**Evidence** 콘텐츠를 복구한 뒤 보면 이 사전에서 `filter`가 등장하는 미션은 예비 M03 하나뿐이고, 거기서의 뜻은 "판별의 기준이 되는 본보기 격자"다. 데이터베이스 질의로 쓰는 미션이 하나도 없다. 데이터베이스에 두면 그 학문을 둘러보는 학습자에게 아무 미션도 그렇게 쓰지 않는 용어를 보여 주게 된다.

**Rejected Alternative** (a) 한 줄 정의를 고쳐 뜻을 좁히기 — canonical 정의 변경은 Owner Gate이고, 일반적인 뜻 자체가 틀린 것은 아니다. (b) 그대로 두기 — 판단 근거였던 문서가 바뀌었는데 결론만 유지하는 것은 근거를 무시하는 것이다. (c) DEFERRED로 되돌리기 — 이제 확정할 근거가 생겼으므로 미룰 이유가 없다.

**Change Cost** 낮음. cluster 파일의 override 한 줄. 학문 term 수만 바뀌고(데이터베이스 65→64, 인공지능 25→26) 노출 상태·직무·선수 관계는 그대로다.

**남기는 교훈** FD-12는 "상세 콘텐츠가 한 줄 정의와 어긋나면 근거로 쓰지 않는다"고 적었다. 이번 건은 그보다 한 걸음 더 간다 — **어긋난 콘텐츠를 근거로 이미 내린 결론은, 콘텐츠를 고친 뒤 다시 봐야 한다.** R12로 79건을 고쳤으므로 그 79건을 근거로 삼았던 다른 판단이 있는지도 함께 확인해야 한다(이번 Cycle에서는 `filter` 하나였다).
