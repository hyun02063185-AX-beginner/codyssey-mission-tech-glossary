# 08. View Contracts

> 상태: **ACTIVE** — View Implementation Cycle 1에서 구현된 4개 View의 계약.
> 전제: Data Model은 `ENCYCLOPEDIA_DATA_MODEL_STABLE`로 **동결**되어 있다. View 때문에 node/relation/foundation/taxonomy를 바꾸지 않는다.

---

## 0. 공통 규칙

| 규칙 | 내용 |
| --- | --- |
| 데이터 출처 | 모든 View는 `src/data/generated/encyclopedia-graph.json` **하나**만 읽는다 |
| 질의 | `src/encyclopedia.ts`의 공통 layer를 통해서만 접근한다. component가 그래프를 직접 순회하지 않는다 |
| 저장 금지 | View 표시를 위해 새 데이터를 authoring하지 않는다. 필요한 값은 빌더가 계산한다 |
| 학습 근거 | 순서를 주장하는 화면은 **방향 있는 관계**만 사용한다. `related`, `interacts_with`, `compare_with`, mission 동시등장은 순서 근거가 아니다 |
| 정직성 | 데이터가 없으면 비어 있다고 말한다. 빈 영역을 그럴듯하게 채우지 않는다 |
| 기존 보호 | Technology Atlas, Knowledge Map, Concept Connections, Terms, Open-book, Extension은 재설계하지 않는다 |

### 공통 query layer — `src/encyclopedia.ts`

[04-view-architecture.md](04-view-architecture.md)에서 고정한 다섯 질의를 그대로 구현한다.

| 질의 | 시그니처 | 쓰는 곳 |
| --- | --- | --- |
| `membership(id)` | field / academic / missions 소속 | Prerequisite, Academic, Role |
| `neighbors(id, relations?)` | authored edge 인접 | Prerequisite |
| `learnFirst(id, maxDepth)` | 단계별 선수 개념 + **도입한 edge** | Prerequisite, Mission |
| `pathsThrough(id)` | 이 node를 포함한 큐레이션 경로 | Prerequisite, Academic |
| `coverage(scope)` | 범위 안의 term/상세/핵심/미션 수 | Academic, Role |

보조: `normalizeMissionId`(4표기 → 1), `missionAnswers`(미션 6문항), `highlightTerms`, `label`/`subLabel`.

`learnFirst`는 각 노드를 **어떤 edge가 데려왔는지**를 함께 돌려준다. 화면이 "왜 먼저 배워야 하는지"를 근거 문장으로 보여줄 수 있어야 하기 때문이다.

## 1. Prerequisite View

| | |
| --- | --- |
| route | `#/prerequisites` (목록) · `#/prerequisites/:termId` (상세) |
| 답하는 질문 | 이걸 배우기 전에 무엇을 알면 좋은가 |
| 데이터 | `learnFirst` · `unlocks` · `pathsThrough` · `membership` |

**표시 순서**: 먼저 알아보기(단계별, 먼 것부터) → 지금 보는 개념 → 다음으로 연결 → 학습 경로 → 이 개념의 자리.
그래프 시각화는 두지 않았다. 학습 순서를 먼저 읽히게 하는 것이 목적이고, 그래프는 이미 Technology Map이 담당한다.

**계약**
- ladder는 learn-first 관계(`prerequisite`/`based_on`/`is_a`/`cs_foundation`)만 따라간다.
- 각 항목에 그 관계의 `reason`을 그대로 노출한다. 근거 없는 연결은 화면에 없다.
- 선수 관계가 없으면 **비어 있다고 말한다**. 관련 용어로 순서를 지어내지 않는다.
- 큐레이션 경로는 `uses`/`provided_by` 같은 실사용 단계를 포함할 수 있어 ladder보다 길 수 있다. 이 차이를 화면에서 한 줄로 설명한다.

## 2. Mission View

| | |
| --- | --- |
| route | 기존 `#/missions/:missionId` (public alias `main-M13` 유지) |
| 구현 | `MissionEncyclopedia`를 기존 미션 페이지 상단에 lazy로 얹는다. 기존 term 목록과 Atlas overlay CTA는 그대로 |
| 데이터 | `missionAnswers` |

**답하는 6개 질문**: 어떤 학문과 연결되는가 / 어떤 기술 분야인가(기존 Atlas 섹션) / 핵심 개념 / 무엇을 먼저 알아야 하는가 / 실제로 사용하는 개념 / 다음에 무엇을 공부하면 좋은가.

**계약**
- 미션의 term 목록을 `missions.json`에 **복제하지 않는다.** 전부 master `mission_refs`에서 계산한다(테스트로 강제).
- "먼저 알아야 할 과목"은 `prerequisiteFields` closure, "먼저 볼 개념"은 핵심 term의 learn-first closure에서 **미션 밖 항목만** 남긴다.
- 노출 기준에 못 미치는 학문은 링크하지 않고 "사전 수록이 아직 적은 영역"으로 표시한다.

## 3. Academic View

| | |
| --- | --- |
| route | `#/academic` · `#/academic/:fieldId` |
| 데이터 | `coverage` · `byAcademic` · `pathsThrough` · academic node의 `signals` |

### U11 — Academic Visibility Policy (확정)

관측 분포에서 도출했다: 92 · 74 · 67 · 58 · 54 · 51 · 31 · 31 · 31 · 25 · **4 · 1 · 0 · 0**. 25와 4 사이가 유일한 큰 간격이다.

| 상태 | 기준 | 현재 |
| --- | --- | --- |
| `active` | termCount ≥ 20 **또는** (termCount ≥ 3 **그리고** cluster 학습 경로 ≥ 1 **그리고** 관련 미션 ≥ 1) | **11개** |
| `insufficient-coverage` | term은 있으나 위 기준 미달 | algorithms (term 1 · 경로 0) |
| `declared` | term 0 | cloud-computing, sre |

두 번째 절이 필요한 이유: `computer-architecture`는 term이 4개뿐이지만 Phase A가 만든 학습 경로 3개를 갖고 있어 **실제로 읽을 것이 있다**. 단일 term 수 기준만 쓰면 내용이 있는 영역을 숨기게 된다.

상태는 **빌더가 계산**한다(authoring 금지). 숨긴 영역도 데이터에서 삭제하지 않고 목록에 "아직 열지 않은 영역"으로 남겨, 유지보수자에게는 공백이 보이고 학습자에게는 빈 화면이 보이지 않게 한다.

**계약**
- 기술 분야(Atlas)와 합치지 않는다. 축이 다르다는 것을 화면에서 명시한다.
- override된 term은 "기술 분야와 다르게 배정한 용어" 섹션에 **이유와 함께** 노출한다. Atlas가 틀렸다고 말하지 않는다.

## 4. Role View

| | |
| --- | --- |
| route | `#/roles` · `#/roles/:roleId` |
| 데이터 | `byRole`(빌더 계산) · `coverage` · `byField` |

Role은 **node가 아니다.** `roles.json`의 분야 가중치와 graph membership에서 계산한다.

### Role Coverage Policy (확정)

| 상태 | 기준 | 현재 |
| --- | --- | --- |
| `active` | core 분야에 term이 있고 core 학문이 모두 `active` | 8개 |
| `limited` | core 분야 term이 0이거나, core 학문 중 하나가 노출 기준 미달 | qa-engineer(core 분야 term 0), site-reliability-engineer(core 학문 `sre`가 declared) |
| `declared` | core 분야 term도 core 학문 term도 없음 | 없음 |

authored `coverage`(편집 판단)와 계산된 `coverageState`(데이터)가 어긋나면 **validator가 경고**한다. 화면에는 계산된 상태를 쓴다.

**계약**
- 모든 화면에 "현재 사전에 연결된 범위 기준"임을 표시한다.
- `limited`는 무엇이 부족한지(중심 어휘 없음 / 중심 학문 비어 있음)를 구체적으로 말한다.

## 5. Timeline View — 구현하지 않음

**`DEFERRED_FOR_DATA_READINESS`** (U12 확정).

현재 `evolved_from` edge는 3개(`local-storage←cookie`, `fetch-api←XMLHttpRequest`, `json-web-token←login-session`)뿐이고 서로 이어지지 않는다. 독립 View의 정보량이 아니다. Navigation에도 넣지 않는다.

### Readiness 기준 (양이 아니라 서사)

| 항목 | 기준 |
| --- | --- |
| 발전 관계 수 | `evolved_from` ≥ 15 |
| 연결된 chain | 길이 3 이상인 발전 사슬 ≥ 4개 (지금은 0) |
| 고립 pair 비율 | 다른 발전 관계와 이어지지 않는 pair < 40% (지금은 100%) |
| 근거 품질 | 각 edge가 "왜 필요해졌는가"를 `reason`에 담고, `confidence` HIGH/MEDIUM이며 출처가 있을 것 |
| 학습 가치 | 사람이 읽어 의미가 있는 narrative path ≥ 3개 |

연도 데이터의 양이 아니라 **"왜 등장했고 무엇으로 이어졌는가"를 설명할 수 있을 때** 구현한다.

## 6. Navigation

```
미션 · 용어 · 선수학습 · 기술 지도 · 학문 · 직무 · 개념 연결 · 웹툰
```

기존 HashRouter 규약을 그대로 따른다. 새 route는 전부 추가이며 기존 경로(`/maps/main-m01` 리다이렉트 포함)를 재정의하지 않는다. Timeline은 넣지 않는다.

## 7. 빌드 파이프라인 (U10 확정)

```
data:build
  ├ (기존) atlas → overlays → web data → term-map-links
  └ encyclopedia:validate
        └ encyclopedia:build → validate_encyclopedia.py
```

요청서 권고는 `encyclopedia:build → data:build` 순서였으나, **빌더가 `src/data/generated/glossary.json`을 입력으로 읽으므로 그 순서로는 동작하지 않는다.** 따라서 `data:build`의 마지막 단계로 넣었다.

충족 조건: validator 실패 시 production build 실패 ✓ · 결정적 출력 ✓ · 기존 glossary generated contract 불변 ✓ · Extension 0.4.2 입력 불변 ✓ · generated 파일 수작업 편집 금지 ✓.

독립 실행도 유지한다: `npm run encyclopedia:build`, `npm run encyclopedia:validate`.

## 8. Impact Review Gate

```bash
python scripts/report_encyclopedia_impact.py            # HEAD 대비
python scripts/report_encyclopedia_impact.py --base <ref> --json
```

Encyclopedia source나 relation을 바꾼 뒤 **반드시** 실행한다. 출력: 변경된 node/edge · 영향받은 미션(새로 생기거나 사라진 선수 학습) · 영향받은 학문 · 경로 변화(길이 포함) · **예상 밖 cross-cluster 영향**.

마지막 항목은 새로 들어온 선수 학습의 학문 홈이 그 미션이 선언한 학문 밖일 때 표시된다. Expansion Cycle 1의 M03 누수가 정확히 이 모양이었고, 재현 시험에서 그대로 검출된다.

이 보고서는 **의미를 판정하지 않는다.** 사람이 읽을 대상을 좁혀 줄 뿐이다.

### Semantic Review Trigger

다음이면 Specialist Review를 활성화한다: 변경한 cluster 밖 미션의 선수 학습이 바뀜 · 기존 경로의 앞부분이 바뀜 · 보안 개념이 비보안 미션 선수 학습에 진입 · 고급 기술이 기초 미션 앞단계로 유입 · 새 cross-academic 관계가 여러 미션에 전파. 영향이 없으면 추가 호출하지 않는다.
