# 02. Knowledge Model Proposal

> 상태: **PROPOSED** (Sprint 0 권고안, 소유자 승인 전). 승인된 항목은 [00-project-status.md](00-project-status.md)의 "확정된 결정"에만 기록한다.
> 근거: [01-current-architecture-audit.md](01-current-architecture-audit.md)

## 0. 설계 요약

1. **엔진을 새로 만들지 않는다.** 기존 field map(node/edge/route)과 Atlas 분류를 그대로 두고, 그 위에 **읽기 전용 통합 그래프**를 빌드한다.
2. 새 authored 데이터는 4종, 모두 작다: `academic-fields.json`(~14 entry), `missions.json`(16), `roles.json`(10), `clusters/<name>.json`(pilot 단위).
3. **새 relation 타입은 0개**로 시작한다. 요청서의 후보 9종은 기존 ontology의 재사용 / 파생 / property로 흡수된다 (§4).
4. **519 term 파일은 한 글자도 바꾸지 않는다.** term별 새 metadata를 만들지 않고, Atlas 분류에서 **기본값을 파생**하며 예외만 cluster 파일에 sparse override로 적는다.
5. 직무·기술 분야·학습 경로·선수학습 지도는 **저장하지 않고 계산**하는 것을 기본으로 한다. 저장이 필요한 것은 "사람이 판단한 서사"뿐이다.

## 1. Node Model — 무엇이 node이고, 무엇이 metadata/view인가

| 후보 | 판정 | 이유 |
| --- | --- | --- |
| `TERM` (519 canonical) | **node** (`term:<id>`) | 이미 원본. 변경 없음 |
| `FOUNDATION` hub 개념 | **node** (`foundation:<id>`) — 기존 선례 재사용 | canonical은 아니지만 경로에 필요한 개념(client-server, api …). Map에 이미 14개 있음 ([01 §3-C](01-current-architecture-audit.md)) |
| `ACADEMIC_FIELD` | **node** (`academic:<id>`) | 계층(parent), 미션 anchor, 학습 순서(prerequisiteFields)가 필요한 실체. 약 14개 |
| `MISSION` | **node** (`mission:<id>`) | 지금은 문자열 3종 표기로 흩어져 있고 메타데이터가 없음. 16개 |
| `TECH_FIELD` | **새 node 아님 — Atlas field 재사용** (`field:<atlasFieldId>`) | `field-taxonomy.json`이 이미 authored source. 통합 빌더가 read-only로 node 투영 |
| `ROLE` | **node 아님 — metadata + filter** | 직무는 상하/선수 관계가 없고 "field 강조도"일 뿐. §7 |
| `LEARNING_PATH` | **node 아님 — 계산 결과 + (선택) 서사 파일** | §8 |
| `CLUSTER` | **runtime node 아님 — authoring 단위(파일)** | 증분 확장·pilot 검증용. §3 |

**결과: 실제 node 종류는 5개**(term, foundation, academic, mission, field[투영]). 그중 새로 authoring하는 것은 academic·mission·foundation뿐이다.

### 1-1. ID 규칙
- 기존 규칙 유지: `term:<termId>`, `foundation:<slug>`.
- 신규: `academic:<slug>`, `mission:<courseSlug>-m<NN>` (**정규 미션 ID = `main-m05` 형식**, atlas·overlay·routing과 동일). `main/M05`(master), 본문의 `M05`는 빌더의 어댑터가 `mission:main-m05`로 변환한다. 세 표기를 새로 하나 더 만들지 않는다.
- `field:<atlasFieldId>`는 파일로 authoring하지 않는 파생 node.

### 1-2. Hub 개념의 처리 (foundation node)
audit G4: client, server, api, backend, database, operating system, memory, data structure, key-value store 등은 canonical exact match가 0이다. 세 가지 선택지:

| 선택 | 장점 | 단점 |
| --- | --- | --- |
| (a) 즉시 canonical 추가 | 상세 페이지 있음 | RC1 변경 + docs/13 batch review 우회 → **금지** |
| (b) `foundation:*` synthetic node로 시작 | 기존 선례, RC1 무영향, 경로 완성 | 콘텐츠 페이지 없음 (Map처럼 요약만) |
| (c) 경로에서 생략 | 단순 | 사용자가 던진 예시 경로(Client/Server → HTTP …)를 못 만듦 |

**권고: (b) + 승격 예약.** hub는 `foundation:<slug>`로 cluster 파일에 선언하고 `promotionCandidate: true`, `foundationRationale`을 적는다. 이후 docs/13 절차로 canonical이 되면 `foundation:x → term:x` 한 번의 rename으로 끝난다 (빌더가 alias 표를 두고 검증). 학문 자체가 시작점인 경로(자료구조 → …)는 `academic:data-structures`가 첫 node가 되므로 hub를 만들 필요가 없다.

## 2. 소유권 규칙 (Single Source of Truth)

원칙: **모든 사실은 정확히 한 곳에서 authoring하고, 나머지는 빌드 시 파생한다.**

| 사실 | 소유자(SoT) | 통합 그래프에서의 형태 |
| --- | --- | --- |
| term 정체성·별칭·category | master YAML | `term:*` node |
| term↔mission | master `mission_refs` | `term → mission` edge **파생** (RELEVANT_TO_MISSION 저작 금지) |
| term↔기술 분야 | Atlas classification | `term → field` edge **파생** |
| 기술 분야 정의 | `field-taxonomy.json` | `field:*` node **파생** |
| mission↔기술 지도 | `mission-map-routing.json` / matrix | `mission → field` **파생** |
| 기존 typed relation | 각 `knowledge-map.json` | 그대로 **읽기** (수정 안 함) |
| untyped related | term md `## 관련 용어` | `related` (weak) **파생** |
| **academic field 정의·계층·선수** | `data/encyclopedia/academic-fields.json` | 신규 authored |
| **mission 메타** (제목·순서·학문·다음 학습) | `data/encyclopedia/missions.json` | 신규 authored |
| **role 정의** (field 강조도) | `data/encyclopedia/roles.json` | 신규 authored |
| **Atlas 밖/cross-field typed relation, 경로 서사, academic override** | `data/encyclopedia/clusters/<name>.json` | 신규 authored |

**중복 금지 규칙 (validator가 강제)**
- 같은 `(from, relation, to)`는 기존 map edge와 cluster edge를 합쳐 **한 번만** 존재. (기존 validator는 map 내부 중복만 검사한다. 현재 cross-map 중복은 0개이므로 이 규칙은 **예방**이지 정리가 아니다.)
- symmetric relation(`interacts_with`, `compare_with`)은 (a,b)/(b,a)를 같은 것으로 간주.
- `related`는 authoring 금지 (파생 전용).
- 미션→term 목록은 `missions.json`에 **적지 않는다** (master에서 파생). `missions.json`에는 term ID가 들어가지 않는다 (예외: `studyNext`의 선택적 term 제안, 존재 검증).

## 3. 파일 구조 (제안)

```
data/encyclopedia/                     # 신규 authored 디렉터리 (Sprint 1에서 생성)
  README.md
  academic-fields.json                 # ~14 academic node + crosswalk + prerequisiteFields
  missions.json                        # 16 mission 메타
  roles.json                           # 10 role
  clusters/
    web-backend.json                   # pilot 1
    data-redis.json                    # pilot 2
    system-process.json                # pilot 3
scripts/build_encyclopedia_graph.py    # 통합 빌더 (읽기 전용 입력 → generated)
scripts/validate_encyclopedia.py       # 신규 validator
src/data/generated/encyclopedia-graph.json   # generated. glossary.json은 건드리지 않음
```

- `glossary.json`(868 KB, Extension이 통째로 복사)에 필드를 **추가하지 않는다** → Extension 0.4.2와 `data.test.ts` 계약 영향 0.
- cluster 파일은 사람이 한 파일만 열어도 그 주제의 node·edge·경로·override가 보이도록 만든다 (Human Maintainable).

### cluster 파일 형태 (스케치)
```json
{
  "clusterId": "data-redis",
  "title": "자료구조에서 Redis까지",
  "status": "pilot",
  "foundationNodes": [
    {"id": "foundation:key-value-store", "label": "Key-Value Store", "labelKo": "키-값 저장소",
     "promotionCandidate": true, "foundationRationale": "hash-map과 cache·redis 사이의 연결 개념"}
  ],
  "academic": {                                   // sparse override: 기본값은 Atlas crosswalk에서 파생
    "term:hash-map": {"primary": "academic:data-structures"}
  },
  "edges": [
    {"from": "term:cache", "relation": "based_on", "to": "foundation:key-value-store",
     "reason": "...", "confidence": "MEDIUM", "evidenceType": "architectural-inference", "source": "https://..."}
  ],
  "paths": [
    {"id": "ds-to-redis", "label": "자료구조에서 Redis까지", "why": "...",
     "steps": ["academic:data-structures", "term:hash-function", "term:hash-map",
               "foundation:key-value-store", "term:cache", "term:redis"]}
  ]
}
```
edge 필드는 **기존 map edge와 동일**(`from, relation, to, reason, confidence, evidenceType, source`)하다. 새 schema를 배우지 않아도 된다.

## 4. Edge Model — 요청서 후보 9종의 처리

기존 ontology 12종(선언) / 10종(사용) 위에서 판단한다.

| 요청 후보 | 처리 | 기존 이름 / 방식 |
| --- | --- | --- |
| PREREQUISITE | **재사용 (authored)** | `prerequisite` (지금 4개; 데이터 확충이 핵심 작업) |
| RELATED | **파생 (weak)** | `detailRelatedTerms` 1,324 링크 + `interacts_with`. 새로 authoring 금지 |
| PARENT_OF | **edge 아님 — property** | 학문 계층은 `academic-fields.json`의 `parent`(단일 부모 트리). term 간 하위개념은 `is_a` |
| (term이 field에 속함) | **파생** `belongs_to` | Atlas primary/secondary + academic crosswalk |
| USED_IN | **파생 (역방향 view)** | `uses`의 inverse |
| USES | **재사용** | `uses` (71) |
| IMPLEMENTS | **새로 만들지 않음** | 구현체→개념은 `is_a`(Redis is_a key-value store) / `based_on`. 모호한 사례가 누적되면 그때 재검토 |
| COMPARE_WITH | **재사용** | `compare_with` (15, 대칭) |
| EVOLVES_TO | **재사용 (역방향 view)** | `evolved_from` (2). 정의가 이미 "시간표가 아닌 발전 맥락, 단일 인과 금지" |
| RELEVANT_TO_MISSION | **파생** | master `mission_refs` (source_status를 edge 속성으로) |
| RELEVANT_TO_ROLE | **edge 아님 — role→field metadata** | §7 |

**authored edge 집합 (Encyclopedia에서 새로 쓰는 것):** `prerequisite`, `uses`, `is_a`, `based_on`, `compare_with`, `evolved_from`, `provided_by`, `interacts_with` — 전부 기존 map ontology의 부분집합. (`defined_by`, `cs_foundation`, `enabled_by`, `mission_uses`는 Frontend map 전용으로 남긴다.)
**파생 전용:** `related`, `used_by`, `belongs_to`, `in_mission`, `evolves_to`.

### 4-1. 방향 규약 — Encyclopedia가 명시적으로 선언한다

기존 ontology는 10개 map 파일에 복제돼 있고 **방향이 적힌 것은 Frontend 하나뿐**이다. 나머지 9개는 "먼저 이해하면 좋다."처럼 A/B가 없다([01 §3-C](01-current-architecture-audit.md)). 따라서 "기존 정의를 따른다"는 말만으로는 부족하다.

**결정: Frontend map의 방향 문구를 정본으로 채택하고, `data/encyclopedia/README.md`에 relation 방향 계약을 한 번 명시한다.** 기존 10개 map 파일은 **수정하지 않는다**(변경 금지 영역). 즉 Encyclopedia는 어휘를 기존 validator의 `RELATIONS`(12종)에서 빌려 쓰되, **방향의 문서화된 출처를 자기 쪽에 둔다.**

| relation | 방향 (from → to) |
| --- | --- |
| `prerequisite` | 나중 → **먼저 알아야 하는 것** |
| `based_on` | 기반을 두는 쪽 → 기반이 되는 것 |
| `is_a` | 하위/구체 → 상위/일반 |
| `uses` | 사용하는 쪽 → 사용되는 것 |
| `provided_by` | 제공받는 쪽 → 제공자 |
| `evolved_from` | 나중 → 이전 맥락 |
| `compare_with`, `interacts_with` | **대칭** (방향 없음, 중복 검사 시 (a,b)=(b,a)) |

- 기존 4개 `prerequisite` edge 중 **2건**(`normalization → data-integrity`, `staging-area-git-add → commit`)이 이 규약과 반대로 읽힌다([01 §5-B](01-current-architecture-audit.md)). 둘 다 방향 정의가 없는 map 소속이다. **새 prerequisite를 대량 추가하기 전에 소유자 검토 후 별도 커밋으로 정리**한다 (미확정 U5).
- validator: learn-first 부분그래프(`prerequisite` + `based_on` + `is_a` + `cs_foundation`)에 **cycle 금지**. 대칭 relation은 learn-first에 포함하지 않는다.
- validator: cluster edge의 방향이 위 표를 따르는지는 기계가 판정할 수 없으므로, **`reason` 필수 + 리뷰**로 보완한다. 기계가 잡는 것은 cycle과 중복뿐임을 명시한다.

### 4-2. "learn-first" 부분그래프
선수학습 view가 따라가는 edge: `prerequisite`(강), `based_on`(강), `is_a`→부모 개념(중), `cs_foundation`(중), `uses`→사용되는 쪽(약, 옵션). `related`/`interacts_with`는 선수 계산에 **쓰지 않는다** (방향이 없고 filler가 많음: audit §5-A).

## 5. Academic Field Model

### 5-1. 목록 (초기안, 14개)
- **academic (11):** programming-fundamentals, data-structures, algorithms, computer-architecture, operating-systems, computer-networks, database-systems, software-engineering, web-programming, information-security, artificial-intelligence
- **applied (3):** cloud-computing, devops, sre — `kind: "applied"`

### 5-2. 필드 형태
```json
{"id": "academic:operating-systems", "labelKo": "운영체제", "labelEn": "Operating Systems",
 "kind": "academic", "parent": null, "prerequisiteFields": ["academic:computer-architecture", "academic:programming-fundamentals"],
 "atlasFields": ["systems-runtime"], "status": "populated"}
```
- `parent`: 단일 부모 트리(필요할 때만; 처음엔 대부분 null). PARENT/CHILD는 edge가 아니라 이 property.
- `prerequisiteFields`: **학문 간 선수 순서**. 미션의 "먼저 공부하면 좋은 과목"은 primary academic의 이 값 closure로 **계산**한다 (미션마다 손으로 적지 않는다).
- `atlasFields`: 이 학문에 대응하는 Atlas field (crosswalk의 원본, 방향은 academic→atlas 한 쪽만 authoring).

### 5-3. Atlas field → academic 기본 crosswalk (term별 기본값 파생용)

| Atlas primaryField (term 수) | 기본 academic | 메모 |
| --- | --- | --- |
| programming-foundations (80) | programming-fundamentals | **가장 이질적인 field.** 실제로는 OS/동시성 8(mutex, race-condition, deadlock, lock, call-stack, event-loop, locality, memory-accounting), 컴퓨터구조/수치 4(cpu-architecture, ieee-754, floating-point, epsilon), 소프트웨어공학·운영 16(layered-architecture, mvc, repository-pattern, dependency-injection, logging, observability, root-cause-analysis …)이 섞여 있다 → **최소 28/80(35%) override 필요** |
| algorithms-data-structures (33) | data-structures **또는** algorithms | 한 field가 두 과목. term별 분할 필요(33개, sparse override) |
| systems-runtime (51) | operating-systems | |
| network-web-protocol (32) | computer-networks | |
| data-database (67) | database-systems | csv·json·json-lines·encoding·utf-8·serialization·streaming 등 **데이터 형식/처리 10개**는 database-systems가 아님 |
| security-identity (50) | information-security | |
| ai-ml-computing (25) | artificial-intelligence | NPU/GPU/ieee-754는 computer-architecture 후보 |
| frontend-web-ui (69) | web-programming | |
| backend-server-api (23) | web-programming | (+software-engineering secondary) |
| git-collaboration (50) | software-engineering | |
| devops-infrastructure (31) | devops | cloud-computing으로 갈 것 **9개**(amazon-ec2, amazon-ebs, amazon-web-services, cloud-region, github-pages, netlify, vercel, render, railway), 나머지 22는 컨테이너·배포 = devops |
| developer-workflow-tools (8) | software-engineering | |

- term당 **primary 1 + secondary ≤2** (Atlas `primaryField/secondaryFields`와 동일 패턴).
- **기본값은 파생, 예외만 override.** 519개에 새 필드를 추가하지 않는다. override는 해당 term이 속한 pilot cluster 파일에만 기록하고, 이후 cluster가 늘 때마다 늘어난다.
- **override는 "예외"라기엔 많을 수 있다.** 위 세 field만 봐도 28 + 10 + 9 = **47개**가 기본 crosswalk와 어긋난다. 전체로는 15~25% 규모가 될 수 있다. 이것이 학문 축의 실제 비용이며, **pilot의 핵심 측정 항목**이다([05](05-pilot-plan.md) E10, [Sprint 0 보고서 R8](../../reports/knowledge-encyclopedia/sprint-00-architecture-discovery.md)). 측정 결과 override 비율이 지나치게 높으면 "Atlas에서 파생" 대신 **학문 분류를 독립 authored 데이터로 전환**하는 것을 재검토한다.

### 5-3a. 커버리지가 얇은 학문 (숨기지 않는다)
- **computer-architecture**: 매핑 field가 없음. 후보 term은 cpu-architecture, gpu-vs-npu, neural-processing-unit, ieee-754, floating-point 정도(≈5). 
- **sre**: observability, health-check, root-cause-analysis, logging 정도. **term이 충분해지기 전에는 node를 `status: "declared"`(비어 있음)로 두고 UI에 노출하지 않는다.**
- **QA/test, CI-CD**: 해당 canonical 0. 학문/직무 view에서 "미수록"으로 표시.

### 5-4. Cloud / DevOps / SRE 처리
학문(과목)이 아니라 **적용 영역**이므로 `kind: "applied"`로 구분하고, `prerequisiteFields`로 학문에 연결한다 (예: devops → software-engineering, operating-systems, computer-networks; sre → devops, operating-systems, computer-networks). 학문 지도 view는 academic과 applied를 다른 그룹(밴드)으로 그린다.

## 6. Technology Field Model

**신규 taxonomy를 만들지 않는다.** Atlas 12 field가 기술 분야 모델이다.

| 요청 후보 | Atlas 대응 |
| --- | --- |
| Frontend | `frontend-web-ui` |
| Backend | `backend-server-api` |
| Middleware | 독립 field 아님 — `middleware` term(backend, boundary). 필요 시 view 태그 |
| Database | `data-database` |
| Infrastructure / Cloud / DevOps | `devops-infrastructure` (한 field) |
| SRE | 대응 field 없음 → 신규 field 추가하지 않고 academic `sre` + role로 표현 |
| Security | `security-identity` |
| AI | `ai-ml-computing` |
| (추가) Network, Systems, Git, Programming, Algorithms, Dev tools | 이미 있음 |

- `programming-foundations`, `developer-workflow-tools`는 docs/12에서 **cross-field layer**(빈 canvas 금지)로 결정돼 있다. 이 결정을 유지한다. Encyclopedia의 "prerequisite 지도"가 이 두 layer를 대체하는 canvas가 되어서는 안 된다.
- Atlas taxonomy/classification 변경은 Encyclopedia 작업의 부수 효과가 아니라 **별도 결정**으로만 한다.

## 7. Role Model — node가 아니라 metadata + filter

**결정 근거**
- 직무 간 PARENT/PREREQUISITE 같은 구조 관계가 없다. 관계는 "이 직무는 어떤 field를 얼마나 쓰는가" 하나뿐이다.
- term별 role 태그를 달면 519 × N 메타데이터가 생기고 노후화가 빠르다. **role → field 강조도**를 저장하고 term 목록은 field 소속으로 계산한다.
- 직무 취향/정의는 조직마다 다르므로 손으로 고칠 수 있는 작은 파일이어야 한다.

```json
{"id": "role:backend-engineer", "labelKo": "백엔드 엔지니어",
 "fields":   [{"id": "field:backend-server-api", "weight": "core"},
              {"id": "field:data-database", "weight": "core"},
              {"id": "field:network-web-protocol", "weight": "supporting"},
              {"id": "field:security-identity", "weight": "supporting"}],
 "academic": [{"id": "academic:database-systems", "weight": "core"}, {"id": "academic:computer-networks", "weight": "supporting"}],
 "coverage": "high"}
```
- `weight ∈ {core, supporting}`. term 추천 = 해당 field/academic의 term 중 `importance=core` 또는 Tier A 우선 (기존 데이터 재사용).
- `coverage`(high/medium/low)는 **정직성 표시**: DBA·Frontend·Backend = high, Systems·Platform = medium, **QA·SRE = low**(canonical 부재, §5-3a). 
- role이 node가 되어야 하는 조건 (승격 트리거): 직무별 **고유 학습 순서**가 필요해져 role 전용 path/edge가 생길 때. 지금은 해당 없음.

## 8. Learning Path — 계산 vs 저장 비교

| | 그래프에서 계산 | 별도 데이터로 저장 |
| --- | --- | --- |
| 질문 "X를 알려면 뭘 먼저?" | ✔ learn-first 부분그래프의 역방향 closure + 위상정렬 | ✘ (저장하면 edge와 이중 관리) |
| 서사("왜 이 순서인가") | ✘ | ✔ 사람의 판단 |
| 유지 비용 | edge가 정확하면 0 | 경로마다 문장·순서 |
| 위험 | edge 부족 시 빈 결과, 다중 선수 시 선형 순서가 여러 개 | edge와 어긋나 **거짓 경로** |

**권고: 하이브리드, 단 저장물은 edge를 복제하지 않는다.**
1. **선수학습 질의는 계산이 기본**이다 (미션의 prerequisite term, 선수학습 지도, "이 개념 전에 뭘 봐야 하나").
2. **큐레이션 path는 "순서 + 서사(`why`)"만 저장**한다. 이는 기존 `learningRoutes`(38개)와 같은 모양이며 cluster 파일의 `paths[]`로 둔다. path에는 relation을 새로 주장하지 않는다.
3. **validator가 path를 edge에 묶는다**: path의 인접한 두 step은 통합 그래프에 (learn-first 또는 `uses`/`evolved_from`) edge가 있어야 한다. 없으면 오류 → "edge를 먼저 추가하라"가 강제되어 이중 진실이 생기지 않는다.
4. 기존 map의 `learningRoutes`는 **수정하지 않고** 통합 그래프에서 `scope: field` path로 그대로 읽는다.

요청서 예시 검토:
- `자료구조 → Hash Table → Key-Value Store → Cache → Redis`: 존재하는 canonical은 hash-function, hash-map, cache, time-to-live, cache-eviction, redis (hash-map→redis 등 일부 edge 이미 있음). `academic:data-structures`와 `foundation:key-value-store`만 새로 필요.
- `Client/Server → HTTP → API → REST → FastAPI`: http, http-request-response, rest-api, fastapi 존재. `foundation:client-server`, `foundation:api` 필요.
- 이 흐름은 **개념의 흐름(view 7)**이며, `evolved_from`을 쓰는 경우에도 "왜 필요했는가"를 `reason`에 적고 단일 인과를 주장하지 않는다(기존 규칙).

## 9. 통합 빌더와 validator (Sprint 1 구현 대상)

`build_encyclopedia_graph.py` — 입력(전부 읽기 전용): master, Atlas classification/taxonomy/routing, 모든 `knowledge-map.json`, `glossary.json`(detailRelatedTerms), `data/encyclopedia/**`. 출력: `src/data/generated/encyclopedia-graph.json` (+ view별 인덱스).

`validate_encyclopedia.py` 검사 항목:
1. 모든 endpoint 존재 (term ∈ master, field ∈ taxonomy, mission ∈ routing, academic ∈ 파일)
2. relation ∈ 기존 ontology, evidence/confidence 집합 준수, `source`는 URL (기존 규칙 동일)
3. 중복 edge 금지 (기존 map edge와 cross-check, 대칭 처리)
4. learn-first 부분그래프 **acyclic**
5. path 인접 step의 edge 근거
6. `related` 저작 금지, `missions.json`에 term 목록 금지
7. foundation node는 `foundationRationale` 필수, `promotionCandidate`이면 canonical 존재 여부 확인(이미 canonical이면 오류 = rename 필요)
8. **RC1 가드**: `data/curated/glossary-master-v0.1.yaml`, `content/terms/**`, Atlas/Map 원본이 `glossary-rc1` 태그 대비 변경되지 않았는지(또는 승인된 변경만) 검사 — CI 옵션

## 10. 설계 원칙 점검

| 원칙 | 충족 방식 |
| --- | --- |
| RC1 보호 | 기존 파일 수정 0. Extension 입력 불변 |
| Single Source of Truth | §2 소유권 표 + 중복 validator |
| Graph-first, UI-second | node/edge/소유권을 먼저 고정, view는 [04](04-view-architecture.md)에서 파생 |
| Incremental Expansion | cluster 파일 단위, pilot 3개(≈9%)로 검증 |
| Human Maintainable | 파일 4종, 기존 edge schema 재사용, 단일 파일로 주제 열람 |

## 11. 미확정 사항 → [00-project-status.md](00-project-status.md) "아직 미확정인 결정" 참조
