# Sprint 02 — Pilot 3 Clusters

- 수행일: **2026-09-19**
- 시작 commit: `091a593` (Data Skeleton 종료)
- 성격: 구현 + 검증. **RC1 데이터 변경 0건**
- 판정: **E1~E10 전부 PASS**
- 이 보고서는 당시 기록이다. 현재 상태는 `docs/knowledge-encyclopedia/00-project-status.md`를 본다.

---

## 1. Pilot 범위

canonical **40개(전체의 7.7%)**, cluster 3개. 각각 다른 난제를 맡도록 골랐다.

| cluster | canonical | 난제 | 신규 foundation |
| --- | ---: | --- | --- |
| `web-backend` | 16 | network·backend·security 3개 field를 가로지르는 경로 — 어떤 단일 field map으로도 그릴 수 없다 | client-server, web-api |
| `data-redis` | 10 | 한 Atlas field가 자료구조·알고리즘 두 과목으로 갈리는 학문 override | key-value-store |
| `system-process` | 14 | `관련 용어`가 대부분 process/linux filler라 선수 관계를 직접 넣어야 함 | — |

40개 중 **34개**가 authored cluster 데이터(edge·경로·override)에 등장한다. 나머지 6개(`tcp`, `http-status-code`, `crud`, `hash-bucket`, `load-factor`, `linux`)는 기존 map edge만으로 이미 연결되어 있어 **일부러 새 edge를 만들지 않았다** — 중복을 만들지 않는다는 규칙을 실제로 지킨 사례다.

## 2. Governance 적용

| 단계 | web-backend | data-redis | system-process |
| --- | --- | --- | --- |
| Orchestrator | 영향 범위: 신규 authored 1 + generated 1, 금지 영역 미접촉 | 동일 | 동일 |
| Knowledge Architect | hub 판정(FD-03), 신규 relation 0 유지, 중복 회피 | 학문 축 분할 판정 | filler와 선수 관계 구분 |
| Specialist Profile | Web/Backend Architecture, Security, Mission Learning | Data Structures/Algorithms, Database, CS Curriculum | Operating Systems, Mission Learning |
| Quality Harness | validate_encyclopedia + 기존 4종 + unit/build/extension/playwright | 동일 | 동일 |

검토 결과는 각 edge의 `reason`/`confidence`에 반영했고 **별도 리뷰 데이터를 만들지 않았다**(중복 방지 규칙).

Specialist 검토가 실제로 바꾼 것:
- **Web/Backend**: "API → REST → 프레임워크"를 그대로 prerequisite 사슬로 만들려던 초안을 거부. 일반 API가 HTTP를 요구하지 않으므로, hub를 `foundation:web-api`로 좁히고 `rest-api is_a web-api` + `web-api based_on http-request-response`로 바꿨다.
- **Data**: `redis is_a cache`(과장)를 거부하고 `redis is_a key-value-store`(HIGH) + `cache provided_by redis`(MEDIUM, 미션 맥락으로 한정)로 분리했다.
- **Operating Systems**: `out-of-memory`를 누수의 결과로 단정하려던 초안을 거부. `interacts_with` + "모든 OOM이 누수 때문은 아니다"를 reason에 명시했다.

## 3. 결과 수치

| 항목 | 값 |
| --- | ---: |
| node | 578 (term 519 · foundation 17 · mission 16 · academic 14 · field 12) |
| authored edge | 267 (기존 map 241 + cluster **26**) |
| derived edge | 2,848 (related 1,096 · in_field 633 · in_mission 595 · in_academic 524) |
| path | 45 (기존 learningRoutes 38 + cluster **7**) |
| academic override | **5** |
| 신규 foundation | 3 |
| `encyclopedia-graph.json` | 731 KB |

cluster edge 26개의 relation 분포: `based_on` 8, `prerequisite` 6, `uses` 5, `compare_with` 2, `is_a` 2, `provided_by` 1, `evolved_from` 1, `interacts_with` 1. **신규 relation type 0개.**

## 4. 학습 경로 재현

요청된 두 경로가 실제 데이터에서 생성된다.

```
요청은 어떻게 백엔드 코드에 닿는가
클라이언트 / 서버 → HTTP → HTTP Request / Response → 웹 API → REST API → FastAPI

자료구조에서 Redis까지
자료구조 → Hash Function → 해시맵 → 키-값 저장소 → Cache → Redis
```

나머지 5개: 로그인 상태는 어떻게 이어지는가 / 캐시는 무엇을 버리는가 / 동시성 문제는 어디서 시작되는가 / 느려졌을 때 무엇부터 보는가 / 메모리는 어떻게 부족해지는가.

경로 검증에서 **설계 구멍 하나가 드러났다**: 학문 node로 시작하는 경로는 authored edge가 아니라 파생 `in_academic`으로 이어진다. harness가 이를 "edge 없음"으로 막았고, 규칙을 명시적으로 고쳤다 — 경로 근거로 `in_academic`/`in_field`는 인정하고, 무타입 `related`와 동시등장에 불과한 `in_mission`은 계속 제외한다.

## 5. 미션 7개 질문 (M08 / M09 / M12)

세 미션 모두 7개 질문에 빈칸 없이 답한다. 계산으로 나온 결과가 실제로 쓸모 있었다:

- **M08**: 먼저 공부할 과목 = computer-architecture, programming-fundamentals(closure). 선수 term closure가 미션 밖에서 `Mutex`, `Race Condition`, `Concurrency`를 끌어왔다.
- **M09**: closure가 `키-값 저장소`, `Cache`를 제시 — 미션 term 목록에는 없지만 학습에 필요한 연결이다.
- **M12**: closure가 `REST API`, `웹 API`, `HTTP Request / Response`를 제시. M12 term 목록에 REST가 없다는 점을 그래프가 메웠다.

## 6. E1~E10 판정

| | 기준 | 결과 | 근거 |
| --- | --- | :-: | --- |
| E1 | RC1 무변경 | **PASS** | `git diff glossary-rc1 -- data/curated content data/knowledge-maps extension src/data/generated/{glossary,openbook-main-m01,term-map-links}.json` 결과 없음 |
| E2 | 기존 validator 4종 PASS, 수치 불변 | **PASS** | 519·0error·0warning / atlas 12·519·16 / map 10 implemented / tier A95·B247·C177 |
| E3 | `validate_encyclopedia.py` PASS | **PASS** | 0 error · 1 warning(UPSTREAM, 기존 map 결함) |
| E4 | 중복 edge 0 | **PASS** | 기존 map edge 19개는 재작성하지 않고 참조. cross-source 중복 검사 통과 |
| E5 | 요청서 경로 2개 재현 | **PASS** | §4 |
| E6 | 미션 7개 질문이 M08·M09·M12에서 전부 답변 | **PASS** | §5 |
| E7 | learn-first acyclic | **PASS** | cycle 검사 통과(자기참조는 UPSTREAM으로 분리) |
| E8 | 사람이 설계 문서 없이 edge 하나를 고칠 수 있는가 | **PASS** | §7 |
| E9 | Extension/Web 회귀 없음 | **PASS** | unit 31 · build · build:extension · Playwright 5/5 |
| E10 | 그래프 규모 + **override 비율** 보고 | **PASS** | §3, §8 |

## 7. E8 — Human Maintainability 실측

설계 문서를 보지 않고 `data/encyclopedia/README.md`만으로 고칠 수 있는지 확인하기 위해, 일부러 망가진 데이터를 넣고 harness 메시지만으로 복구 가능한지 시험했다.

넣은 오류 5종 → harness가 **6개 오류를 모두 파일명·대상·조치와 함께** 출력했다.

```
term:redis -related-> term:hash-tabel: relation 'related' 은 직접 작성할 수 없습니다.
   조치: 작성 가능한 relation: [based_on, compare_with, cs_foundation, evolved_from,
        interacts_with, is_a, prerequisite, provided_by, uses]
term:cache -uses-> term:time-to-live: 'data/.../data-redis.json' 에 이미 있는 관계입니다.
   조치: 중복 edge 를 삭제하세요. 대칭 relation 은 방향을 바꿔도 같은 관계입니다.
term:redis -related-> term:hash-tabel: 존재하지 않는 node 를 가리킵니다.
   조치: 출처: cluster:data-redis. node id 를 확인하세요.
경로 'data-redis:broken': 'term:redis' 와 'term:load-factor' 사이에 edge 가 없습니다.
   조치: 두 단계를 잇는 edge 를 cluster 의 edges 에 먼저 추가하세요.
```

오타(`hash-tabel`), 금지된 relation, 중복, 끊긴 경로가 전부 잡혔다. 시험 후 원상복구하고 재검증했다(0 error).

**남은 약점**: relation 이름이 틀리면 그 edge의 나머지 필드(`confidence`, `evidenceType`) 검사는 건너뛴다. 한 번에 모든 문제를 보여주지는 않으므로 수정-재실행을 두 번 해야 할 수 있다.

## 8. override 비율 실측 (R8 / E10)

| 기준 | 값 |
| --- | ---: |
| pilot scope 40개 대비 | 5 / 40 = **12.5%** |
| authored에 등장한 34개 대비 | 5 / 34 = **15%** |
| Sprint 0 문서의 pilot 예상치 | 30~37% |
| 전체 추정치 | 15~25% |

**예상보다 낮다.** 이유는 분명하다. `web-backend` 16개는 network/backend/security field에 속하고 이 세 field의 crosswalk는 각각 computer-networks / web-programming / information-security로 정확히 대응해 **override가 0건**이었다. override는 `programming-foundations`(→OS 3건)와 `algorithms-data-structures`(→algorithms 1건), 그리고 `cache`(→computer-architecture 1건)에서만 나왔다.

→ FD-06의 "파생 + 예외 override" 전략은 **유지할 근거가 생겼다**. 다만 `programming-foundations`의 80개는 여전히 35%가 override 대상으로 추정되므로, 그 field를 포함하는 cluster에서 다시 측정해야 한다. 전체 추정치를 지금 수정하지 않는다(표본이 편향되어 있다).

## 9. 추가 평가

### Governance Effectiveness
- **실제로 품질을 바꾼 것**: Knowledge Architect(hub 판정으로 foundation 8~10개 → 3개), Web/Backend Profile(API 사슬 거부), Data Profile(`redis is_a cache` 과장 차단), OS Profile(OOM 인과 단정 차단), Harness(기존 map 결함 + 경로 규칙 구멍 발견).
- **아무것도 바꾸지 않은 것**: 없음. 활성화한 Profile 8개가 모두 최소 한 건씩 문구나 구조를 바꿨다. 단 `Mission Learning`은 web-backend에서 경로 서사를 다듬은 수준으로 기여가 가장 작았다.
- **오버헤드**: Profile을 데이터로 저장하지 않기로 한 결정 덕분에 순수 오버헤드는 문서 기록뿐이다.
- **불필요했던 역할**: 없음. 다만 cluster 하나에 Profile 3개는 많았다 — 2개로 충분했을 것이다.

### Data Duplication
같은 사실이 두 곳에 있는 사례 **0건**. 기존 map edge 19개를 재작성하지 않았고, 미션 term 목록·직무 term 목록·역방향 edge를 저장하지 않았다.

### Derivation Quality
authored 26 vs derived 2,848 = **1:110**. 계산 가능한 것을 저장하지 않는다는 원칙이 실제로 지켜졌다.

### Human Maintainability
§7 PASS. 새 학문/미션/관계 추가 절차가 `data/encyclopedia/README.md` 한 장에 있다.

### AI Portability
§10 참조.

## 10. Multi-AI Handoff 검증

새 세션이 저장소만 읽고 이어갈 수 있는지 읽기 순서대로 점검했다.

1. `00-project-status.md` — 현재 Sprint, 확정/미확정, 변경 금지 영역, New Agent Start Here ✔
2. governance(`06`) / decisions(`07`) — 역할 계약과 확정 결정 + 근거 ✔
3. architecture(`01`~`05`) ✔
4. 최신 report(`sprint-02-pilot.md`) ✔
5. `git log --oneline -10` — 단계별 commit 메시지가 무엇을 왜 했는지 서술 ✔
6. source — `data/encyclopedia/README.md`가 파일별 소유와 추가 방법을 안내 ✔

**보완한 것**: status 문서에 Foundation Cycle 결과, upstream 결함 목록, 빌드/검증 명령을 추가했다.

## 11. 위험 요소 (갱신)

- **R12**(generated stale): 여전함. `encyclopedia:validate`가 항상 rebuild하도록 묶어 완화.
- **R13 신규**: pilot 표본이 crosswalk가 깨끗한 field에 치우쳐 override 비율이 낙관적으로 나왔다. `programming-foundations` 중심 cluster에서 재측정 필요.
- **R11**(canonical 표기 품질): 경로 출력에 `MEM`, `CPU`, `OOM`, `session` 같은 축약 한국어 라벨이 그대로 노출된다. RC1 동결이라 표시만 한다.
- **UPSTREAM 결함 1건**: `term:remote is_a term:remote` (git-collaboration map). Owner Gate 대기.

## 12. 다음 Sprint 권고

1. **cluster 확장** — Database/M11(단일 field·38 term) → Git·SWE/M04+M10 → Security/M13. 각 cluster마다 override 비율을 계속 측정한다.
2. **`programming-foundations` 포함 cluster를 우선** 넣어 R13을 해소한다.
3. View는 그 다음이다. 지금은 CLI 질의로 충분히 검증된다.
4. Owner 판단 대기: U5(prerequisite 역방향 2건), upstream self-edge, `encyclopedia:build`를 `data:build`에 넣을지.

## 13. QA

| 항목 | 결과 |
| --- | --- |
| validate_glossary | 519 canonical · 46 mission-local · **0 error · 0 warning** · 780 info |
| validate_technology_field_atlas | PASS — 12 fields · 519 terms · 16 missions |
| validate_knowledge_map | PASS — 10 implemented / 12 registry |
| validate_content_tier_plan | PASS — 519 · A95/B247/C177 |
| validate_encyclopedia | PASS — 0 error · 1 warning(UPSTREAM) |
| `npm run test` | PASS — 4 files / 31 tests |
| `npm run build` | PASS |
| `npm run build:extension` | PASS |
| Playwright | PASS — 5/5 (빈 포트 기준. 기본 포트 4173은 외부 dev 서버 점유) |
| RC1 diff | 변경 0 |

## 14. 관련 commit

| commit | 내용 |
| --- | --- |
| `5fa52b0` | feat(encyclopedia): implement pilot knowledge clusters |
| `091a593` | test(encyclopedia): add graph integrity harness |
| `21b42fd` | feat(encyclopedia): add knowledge data skeleton |
| `e3a8bd4` | docs(encyclopedia): validate foundation architecture |
