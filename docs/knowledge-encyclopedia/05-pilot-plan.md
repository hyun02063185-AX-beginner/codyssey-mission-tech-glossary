# 05. Pilot Plan

> 상태: **PROPOSED**. Sprint 0에서는 pilot을 구현하지 않는다. 이 문서는 "무엇을, 어느 범위로, 무엇으로 성공/실패를 판정할지"를 고정한다.
> 목적: 519개 전체를 변환하기 전에 [02](02-knowledge-model-proposal.md)의 모델이 **실제로 동작하는지, 사람이 유지 가능한지**를 40개 term으로 검증한다.

## 1. Pilot 선정 원칙

1. 요청서의 예시 학습 흐름(Web/Backend, System, Data/Redis)을 **실제 canonical 존재 여부로 검증한 뒤** 확정한다.
2. 세 cluster가 **서로 다른 구조적 난제**를 하나씩 담당해야 한다. 쉬운 세 개를 고르면 검증이 되지 않는다.
3. 기존 map에 이미 edge가 일부 있는 영역을 고른다 → "기존 edge 재사용 + 중복 방지"가 실제로 검증된다.
4. 합계 40개 내외(519의 약 8%). 한 사람이 하루에 검토 가능한 규모.

## 2. 선정 결과 — 3 cluster / canonical 40개 (전체의 7.7%)

요청서 예시 중 **canonical이 없어 그대로 쓸 수 없는 것**: `Client`, `Server`, `API`, `Backend`, `Database`(일반), `Data Structure`, `Hash Table`, `Key-Value Store`, `Operating System`, `Memory`, `CPU`(일반), `Monitoring`(일반) — 전부 exact match 0 ([01](01-current-architecture-audit.md) G4). 아래 표의 term은 **전부 존재를 확인**했다.

### P1. Web / Backend — 난제: cross-field 경로 (canonical 16)

| term | tier | Atlas primaryField | 주 미션 |
| --- | :-: | --- | --- |
| http | B | network-web-protocol | pre M01 |
| tcp | A | network-web-protocol | main M07 |
| http-request-response | B | network-web-protocol | M01, M06 |
| http-get / http-post | B/B | network-web-protocol | M12 |
| http-status-code | C | network-web-protocol | M01 |
| request-response-cycle | C | backend-server-api | M12 |
| rest-api | A | backend-server-api | M01, M06 |
| crud | B | backend-server-api | M02, M03, M12 |
| fastapi | B | backend-server-api | M12, M13 |
| middleware | A | backend-server-api | M12 |
| authentication | A | security-identity | M02, M13 |
| authorization | A | security-identity | M13 |
| login-session | A | security-identity | M13 |
| cookie | B | security-identity | M13 |
| json-web-token | A | security-identity | M13 |

- **3개 Atlas field에 걸침**(network 6 / backend 5 / security 5) → 이 경로는 어떤 단일 field map에도 그릴 수 없다. **Encyclopedia가 field map으로 대체 불가능함을 증명하는 cluster.**
- 기존 재사용 가능한 edge 8개: `http-request-response interacts_with middleware`, `rest-api interacts_with http-request-response`, `crud interacts_with rest-api`, `http uses tcp`, `http-request-response uses http`, `http-status-code provided_by http-request-response`, `login-session interacts_with cookie`, `authorization based_on authentication`.
- 신규 foundation node: `foundation:client-server`, `foundation:api`.
- 검증 대상 path: `foundation:client-server → term:http → foundation:api → term:rest-api → term:fastapi` (요청서 예시의 실물).

### P2. Data / Redis — 난제: 학문 축 분할과 hub 개념 (canonical 10)

| term | tier | Atlas primaryField | 주 미션 |
| --- | :-: | --- | --- |
| hash-function | B | algorithms-data-structures | M09 |
| hash-map | A | algorithms-data-structures | M09 |
| hash-bucket | B | algorithms-data-structures | M09 |
| load-factor | B | algorithms-data-structures | M09 |
| cache-eviction | B | algorithms-data-structures | M09 |
| least-recently-used | A | algorithms-data-structures | M09 |
| time-complexity | A | algorithms-data-structures | M09, pre M03 |
| cache | A | programming-foundations | M09, pre M03 |
| time-to-live | A | data-database | M09 |
| redis | B | data-database | M09 |

- `algorithms-data-structures` field 하나가 **data-structures와 algorithms 두 과목으로 쪼개져야** 한다([03 §5](03-mission-academic-tech-mapping.md)). time-complexity → algorithms, 나머지 → data-structures. **crosswalk override 메커니즘을 검증하는 cluster.**
- `cache`가 programming-foundations로 분류돼 있으나 학문상 operating-systems/architecture에 가깝다 → **override가 예외를 감당하는지** 확인.
- 기존 재사용 edge 5개: `hash-map uses hash-function`, `hash-bucket provided_by hash-map`, `load-factor interacts_with hash-map`, `redis interacts_with hash-map`, `cache-eviction interacts_with redis`.
- 신규 foundation node: `foundation:key-value-store` (`promotionCandidate: true`).
- 검증 대상 path: `academic:data-structures → term:hash-function → term:hash-map → foundation:key-value-store → term:cache → term:redis` (요청서 예시의 실물). 시작점이 **학문 node**인 경로를 검증한다.

### P3. System / Process — 난제: prerequisite 밀도 (canonical 14)

| term | tier | Atlas primaryField | 주 미션 |
| --- | :-: | --- | --- |
| kernel | B | systems-runtime | pre M01 |
| linux | B | systems-runtime | M07 |
| process | A | systems-runtime | M08 |
| thread | A | systems-runtime | M08 |
| scheduler | C | systems-runtime | M08 |
| cpu-usage | B | systems-runtime | M07 |
| memory-usage | B | systems-runtime | M07 |
| memory-leak | A | systems-runtime | M08 |
| out-of-memory | B | systems-runtime | M08, M09 |
| process-monitoring | B | systems-runtime | M07 |
| concurrency | B | systems-runtime | M08 |
| mutex | B | programming-foundations | M08 |
| race-condition | B | programming-foundations | M08 |
| deadlock | A | programming-foundations | M08 |

- 이 영역의 `detailRelatedTerms`는 **거의 전부 `['process','linux']`라는 filler**다(cpu-usage, memory-usage, out-of-memory, memory-leak, heap-memory, cgroup, systemd, scheduler …, [01 §5-A](01-current-architecture-audit.md)). → **"related는 prerequisite이 아니다"를 증명하고, 진짜 선수 관계를 손으로 넣어야 하는 cluster.**
- 선수 사슬이 뚜렷하다: `kernel → process → thread → concurrency → race-condition → mutex → deadlock`. prerequisite edge 밀도가 가장 높은 곳이므로 **cycle 검증과 방향 규칙**이 실제로 시험된다.
- 기존 재사용 edge 6개: `linux uses kernel`, `process provided_by kernel`, `thread based_on process`, `scheduler interacts_with thread`, `cpu-usage interacts_with scheduler`, `memory-usage interacts_with process`.
- 신규 foundation node: 없음 (`academic:operating-systems`가 상위 진입점).

### 채택하지 않은 후보
- **Frontend**: 이미 field map이 49 node / 63 edge로 가장 촘촘하다. 새 모델이 주는 이득이 가장 적다.
- **Git / M04**: 단일 field 완결형이라 cross-field 검증이 안 된다.
- **AI / M06**: term이 얇고 학문 매핑이 논쟁적이다(pilot에서 다룰 난제가 아니다).

## 3. Pilot에서 만드는 것 (Sprint 1~2 산출물)

```
data/encyclopedia/README.md
data/encyclopedia/academic-fields.json        # 14 entry (전체 — 작고 pilot 밖도 구조만 채움)
data/encyclopedia/missions.json               # 16 entry (전체 — 제목·순서가 없으면 미션 view가 성립 안 됨)
data/encyclopedia/roles.json                  # 10 entry (전체 — field 참조만이라 작음)
data/encyclopedia/clusters/web-backend.json   # P1
data/encyclopedia/clusters/data-redis.json    # P2
data/encyclopedia/clusters/system-process.json# P3
scripts/build_encyclopedia_graph.py
scripts/validate_encyclopedia.py
src/data/generated/encyclopedia-graph.json    # generated
```

- `academic-fields.json` / `missions.json` / `roles.json`은 **entry 수가 작고 term 목록을 담지 않으므로** pilot 단계에서 전체를 채운다. 비어 있는 학문은 `status: "declared"`로 두어 UI에 노출하지 않는다.
- cluster 파일만 pilot 3개로 제한한다. **term 단위 데이터는 cluster에만 들어간다.**

### 예상 authoring 분량
| 항목 | 신규 | 비고 |
| --- | ---: | --- |
| academic node | 14 | 대부분 crosswalk 1줄 |
| mission node | 16 | 제목은 raw manifest에서 전재 |
| role node | 10 | field 참조 4~6개씩 |
| foundation node | 3 | client-server, api, key-value-store |
| 신규 edge (주로 prerequisite/evolved_from) | **≈35** | 재사용 19개 제외. 각 edge에 reason·confidence·source 필요 |
| 큐레이션 path | 5~6 | 요청서 예시 2개 포함 |
| academic override | **12~15 (40개 중 30~37%)** | P2의 algo-ds 분할(time-complexity→algorithms), cache→operating-systems, P3의 mutex·race-condition·deadlock→operating-systems 등 |

override 비율이 전체 추정치(15~25%, [02 §5-3](02-knowledge-model-proposal.md))보다 높게 잡혀 있다 — pilot이 일부러 **분류가 어려운 영역**을 골랐기 때문이다. 실제 측정값이 추정을 크게 넘으면 파생 기본값 전략 자체를 재검토한다.

## 4. 성공 판정 기준 (Exit criteria)

pilot은 다음이 **전부** 충족될 때 성공으로 본다. 하나라도 실패하면 모델을 고치고 다시 pilot 한다 — 519로 확장하지 않는다.

| # | 기준 | 판정 방법 |
| --- | --- | --- |
| E1 | **RC1 무변경** | `git diff glossary-rc1 -- data/curated content/terms data/knowledge-maps src extension` 이 비어 있음 |
| E2 | 기존 validator 4종 PASS, 수치 불변 | glossary 519/0 error/0 warning, atlas 519, map 10 implemented, tier 519 |
| E3 | `validate_encyclopedia.py` PASS | 신규 validator 8개 검사([02 §9](02-knowledge-model-proposal.md)) |
| E4 | **중복 edge 0** | 기존 map edge와 cluster edge 교차 검사(대칭 포함) |
| E5 | 요청서 예시 경로 2개가 **실제로 재현** | `Client/Server→HTTP→API→REST→FastAPI`, `자료구조→Hash Table→Key-Value Store→Cache→Redis` |
| E6 | 미션 7개 질문이 **3개 미션(M08, M09, M12)에서 전부 답변** | 계산 결과가 비어 있지 않고 사람이 읽었을 때 타당 |
| E7 | learn-first 부분그래프 **acyclic** | validator |
| E8 | **사람 유지보수 확인** | 프로젝트 소유자가 cluster 파일 1개를 열어 edge 1개를 추가/수정하는 데 문서 참조 없이 성공 |
| E9 | Extension/Web 회귀 없음 | `npm run test`, `npm run build:extension`, Playwright 지도 테스트 |
| E10 | 그래프 규모 + **override 비율** 보고 | node/edge/path 수, `encyclopedia-graph.json` 크기, **Atlas 기본 crosswalk를 뒤집은 term 비율**(파생 전략의 신뢰도 지표, 02 §5-3) |

**E8이 가장 중요하다.** 모델이 정확해도 사람이 못 고치면 실패다(Human Maintainable 원칙).

## 5. 명시적 비목표 (pilot에서 하지 않는 것)

- UI 구현 (view는 [04](04-view-architecture.md) 설계까지만; pilot 검증은 CLI 출력으로 한다)
- 519개 전체 academic 분류
- canonical 추가/변경/삭제, 콘텐츠 md 수정
- Atlas taxonomy / classification / field map 수정
- `mission-term-map-v0.1.yaml` 중복 제거([01 §5-D](01-current-architecture-audit.md))
- Chrome Extension 데이터 추가
- `staging-area-git-add prerequisite commit` 방향 수정 — **별도 승인·별도 커밋**([02 §4-1](02-knowledge-model-proposal.md))

## 6. 확장 순서 (pilot 성공 이후)

1. **cluster 단위로만 확장**한다. "519개 일괄 분류" 배치를 만들지 않는다.
2. 다음 cluster 우선순위: ① Database/M11(단일 field·term 38, 학문 매핑 명확) → ② Git·SWE/M04+M10 → ③ Security/M13 → ④ Frontend/M01(map과 중복 최소화 확인) → ⑤ AI/M06 → ⑥ Cloud·DevOps/M05+pre M01.
3. 각 cluster는 **미션 1~2개를 완전히 답변 가능하게** 만드는 것을 단위로 한다 (view가 미션 단위로 완성됨).
4. academic override와 prerequisite는 cluster가 커버한 범위에서만 주장하고, 나머지는 "정보 없음"으로 정직하게 둔다.
