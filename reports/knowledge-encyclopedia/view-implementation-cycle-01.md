# View Implementation Cycle 01

- 수행일: **2026-09-19**
- 시작 commit: `fe942ac` (Expansion Cycle 1 종료, `ENCYCLOPEDIA_DATA_MODEL_STABLE`)
- 성격: production View 구현 + 운영 기반. **Data Model 동결 유지**, RC1 변경 0건
- 판정: **KNOWLEDGE_ENCYCLOPEDIA_VIEWS_V1_READY**
- 이 보고서는 당시 기록이다. 현재 상태는 `docs/knowledge-encyclopedia/00-project-status.md`를 본다.

---

## 1. Data Model Freeze 유지

| 항목 | 시작 | 종료 |
| --- | ---: | ---: |
| term / foundation / mission / academic / field | 519 / 17 / 16 / 14 / 12 | **동일** |
| Encyclopedia 신규 foundation | 3 | **3** |
| relation type | 12 (신규 0) | **동일** |
| canonical · academic taxonomy · Atlas taxonomy | — | **변경 0** |

**UI 필요 때문에 데이터 모델을 바꾸지 않았다.** View에 필요한 값(학문 노출 상태, 직무 coverage 상태, 미션 선수 과목)은 전부 **빌더 계산 필드**로 추가했고, node/edge/ontology는 손대지 않았다.

새 Architecture Review로 올릴 항목도 없었다. 네 화면이 요구한 것은 전부 기존 node·metadata·relation·derived query로 표현됐다.

## 2. Build Pipeline (U10)

```
data:build
  ├ (기존) atlas → overlays → web data → term-map-links
  └ encyclopedia:validate → encyclopedia:build → validate_encyclopedia.py
```

**권고 순서를 그대로 쓸 수 없었다.** 요청서는 `encyclopedia:build → data:build` 였지만, 빌더가 `src/data/generated/glossary.json`(=`data:build` 산출물)을 입력으로 읽는다. 조사 결과 실제 의존 방향이 반대라서 `data:build`의 마지막 단계로 넣었다.

충족 확인: validator 실패 시 build 실패 ✓ · 재실행 diff 없음(결정적) ✓ · glossary generated contract 불변 ✓ · Extension 0.4.2 입력 3파일 불변 ✓ · generated 파일 수작업 편집 없음 ✓. 독립 실행(`npm run encyclopedia:build|validate`)도 유지했다.

## 3. Impact Review Gate

`scripts/report_encyclopedia_impact.py` — 현재 그래프를 기준 리비전과 비교한다.

출력: changed nodes/edges · affected missions(선수 학습 증감) · affected academic(termCount·visibility 변화) · affected paths(길이 변화 포함) · **unexpected cross-cluster effects**.

마지막 항목의 판정 규칙: **새로 들어온 선수 학습의 학문 홈이 그 미션이 선언한 학문 밖일 때** 표시한다. Expansion Cycle 1의 M03 누수가 정확히 이 모양이었다.

**재현 시험** — 당시의 edge 방향으로 되돌려 실행:

```
affected missions: 1
    · main-m03 나만의 용돈 기입장 프로그램 만들기
        new prerequisites : SQL, SQL 인젝션, XSS

unexpected cross-cluster effects: 2
    ! main-m03 ← SQL 인젝션 (information-security) / 미션 학문: database-systems, programming-fundamentals, software-engineering
    ! main-m03 ← XSS (information-security) / 미션 학문: ...
```

정확히 잡아냈다. 원복 후 0건. 보고서는 의미를 판정하지 않고 처리 선택지 3가지를 함께 출력한다.

## 4. 공통 Query Layer

`src/encyclopedia.ts` — 04 문서에서 고정한 다섯 질의(`membership`·`neighbors`·`learnFirst`·`pathsThrough`·`coverage`)만 노출한다. 네 View 중 어느 것도 그래프 JSON을 직접 순회하지 않는다.

`learnFirst`는 각 노드를 **어떤 edge가 데려왔는지**를 함께 돌려주도록 만들었다. 화면이 "왜 먼저 배워야 하는지"를 edge의 `reason` 그대로 보여줄 수 있어야 하기 때문이다.

Knowledge Map engine 재사용 여부를 먼저 조사했다. `knowledgeMapLoader`는 map별 lazy 로더이고 `TechnologyFieldMap`은 SVG 캔버스 전용이라 그래프 질의 계층이 아니었다. 그래서 얇은 서비스 계층을 새로 두되, 기존 컴포넌트는 건드리지 않았다.

## 5. 구현한 View

| View | route | 데이터 |
| --- | --- | --- |
| Prerequisite | `#/prerequisites`, `#/prerequisites/:termId` | learnFirst · unlocks · pathsThrough · membership |
| Mission | 기존 `#/missions/:missionId` 위에 얹음 | missionAnswers |
| Academic | `#/academic`, `#/academic/:fieldId` | coverage · byAcademic · signals |
| Role | `#/roles`, `#/roles/:roleId` | byRole(계산) · coverage |

계약은 [08-view-contracts.md](../../docs/knowledge-encyclopedia/08-view-contracts.md)에 있다.

### Prerequisite View
표시 순서는 **학습 순서 → 현재 위치 → 관련 기술**이고 그래프 그림은 두지 않았다. 그래프는 이미 Technology Map이 담당하며, 여기서 필요한 것은 "무엇부터"이지 전체 구조가 아니다.

ladder는 learn-first 관계만 따라간다. 근거가 없으면 **없다고 말한다**. 큐레이션 경로는 `uses`/`provided_by` 같은 실사용 단계를 포함해 ladder보다 길 수 있어서, 그 차이를 화면에서 한 줄로 설명했다(Redis: ladder 3단계 vs 경로 6단계).

### Mission View
새 route를 만들지 않고 기존 미션 페이지에 얹었다. 공개 alias(`main-M13`)와 기존 용어 목록·Atlas overlay가 그대로 살아 있다. 6개 질문 전부 계산으로 답하며 미션 원본에 용어 목록이 없다는 점을 테스트로 고정했다.

### Academic View — U11 확정
| 상태 | 기준 | 결과 |
| --- | --- | --- |
| `active` | termCount ≥ 20, 또는 termCount ≥ 3 + cluster 경로 ≥ 1 + 관련 미션 ≥ 1 | **11개** |
| `insufficient-coverage` | term은 있으나 미달 | algorithms(1개·경로 0) |
| `declared` | term 0 | cloud-computing, sre |

기준을 임의로 정하지 않고 **관측 분포에서 뽑았다**: 92·74·67·58·54·51·31·31·31·25 · **4·1·0·0**. 25와 4 사이가 유일한 큰 간격이라 20을 1차 기준으로 삼았다. 2차 기준이 필요한 이유는 `computer-architecture`다 — term 4개뿐이지만 Phase A가 만든 학습 경로 3개가 있어 읽을 것이 실제로 있다. 단일 term 수 기준만 쓰면 내용 있는 영역을 숨기게 된다.

숨긴 영역은 삭제하지 않고 "아직 열지 않은 영역"으로 남겨, 유지보수자에게는 공백이 보이고 학습자에게는 빈 화면이 보이지 않게 했다.

### Role View — coverage 확정
| 상태 | 기준 | 결과 |
| --- | --- | --- |
| `active` | core 분야 term 있음 + core 학문 모두 active | 8개 |
| `limited` | core 분야 term 0, 또는 core 학문이 노출 기준 미달 | qa-engineer, site-reliability-engineer |
| `declared` | 둘 다 없음 | 0개 |

계산된 상태가 저자의 `coverage: low`와 정확히 일치했다(둘 다 qa·sre). 어긋나면 validator가 경고하도록 묶었다. 모든 화면에 "현재 사전에 연결된 범위 기준"을 적었고, `limited`는 무엇이 부족한지 구체적으로 말한다.

## 6. Timeline — DEFERRED_FOR_DATA_READINESS

`evolved_from` 3건(`local-storage←cookie`, `fetch-api←XMLHttpRequest`, `json-web-token←login-session`)이고 **셋이 서로 이어지지 않는다**(고립 pair 100%). 구현하지 않았고 navigation에도 넣지 않았다.

Readiness 기준을 08 문서에 고정했다: 발전 관계 ≥ 15 · 길이 3 이상 chain ≥ 4 · 고립 pair < 40% · 근거 품질(reason·confidence·출처) · narrative path ≥ 3. **연도 데이터의 양이 아니라 "왜 등장했고 무엇으로 이어졌는가"를 설명할 수 있을 때** 구현한다.

## 7. 테스트

| | 수 | 내용 |
| --- | ---: | --- |
| 단위 (`src/encyclopediaViews.test.ts`) | **17** | mission ID 4표기 정규화, 공개 alias 보존, learn-first가 `related`/대칭 관계를 쓰지 않음, 순환 없음, Redis 경로, 6문항 응답(M03·M08·M09·M11·M12·M13), **M03 누수 회귀**, 미션 원본 용어 복제 없음, 학문 노출 정책, 축 분리, 직무 coverage |
| Playwright (`playwright/encyclopedia-views.spec.ts`) | **11** | 4개 route 렌더, deep link, 앞뒤 이동, 375px 가로 넘침 0, 기존 route 회귀, navigation 항목, **M03 화면에 XSS/SQL 인젝션 미노출** |
| 전체 | 단위 48 · Playwright 16 | 기존 31 + 17, 기존 5 + 11 |

## 8. UX 확인

Desktop과 375px에서 확인했다. navigation 8개 항목, empty state(선수 관계 없는 용어 / 노출 기준 미달 학문 / 중심 어휘 없는 직무), lazy 로딩 fallback, 긴 한국어 라벨 줄바꿈, deep link, 브라우저 앞뒤, 기존 route 회귀를 모두 확인했다. 좁은 화면 가로 스크롤은 4개 route에서 0px.

브라우저로 직접 열어 Prerequisite(Redis)·Mission(M13)·Academic(운영체제/목록)·Role(SRE) 화면을 읽었고, 그 과정에서 미션 라벨이 raw id로 나오던 것과 한국어 조사 오류("정보보안**가**")를 고쳤다.

## 9. 전체 회귀

| 항목 | 결과 |
| --- | --- |
| encyclopedia builder | PASS · 결정적(재실행 diff 없음) |
| encyclopedia validator | PASS — 0 error · 0 warning (+ upstream defect 1건 보고 유지) |
| impact analysis | PASS — affected 0 / unexpected 0 |
| validate_glossary | **519 canonical · 0 error · 0 warning** · 780 info |
| validate_technology_field_atlas | PASS — 12 fields · 519 terms · 16 missions |
| validate_knowledge_map | PASS — 10 implemented / 12 registry |
| validate_content_tier_plan | PASS — 519 · A95/B247/C177 |
| Concept Connection | 데이터·route 무변경, Playwright로 확인 |
| Unit | **48 passed** (5 files) |
| Production build | PASS |
| Playwright | **16 passed** |
| Extension build | PASS — deep-link 계약 assert 통과 |
| RC1 diff | `data/curated`, `content`, `data/knowledge-maps`, `extension`, Extension 입력 3파일 **변경 0** |

Playwright는 기본 포트 4173이 외부 dev 서버에 점유돼 있어 빈 포트로 실행했다. **저장소 설정은 변경하지 않았다.**

## 10. 판정

**`KNOWLEDGE_ENCYCLOPEDIA_VIEWS_V1_READY`**

| 조건 | 결과 |
| --- | --- |
| Data Model Freeze 유지 | ✔ schema·ontology 변경 0 |
| Prerequisite / Mission / Academic / Role View | ✔ 4개 모두 PASS |
| Impact Review operational | ✔ 재현 시험으로 검출 확인 |
| M03 semantic leak regression | ✔ 단위·Playwright 양쪽 |
| Build pipeline integration | ✔ |
| RC1 regression | ✔ |
| Multi-AI handoff | ✔ §11 |

## 11. Multi-AI Handoff

읽기 순서로 점검했다: `00-project-status.md` → `06`/`07`/**`08`(신규)** → architecture 문서 → 최신 report(이 문서) → `git log --oneline -10` → source.
보완: status에 4개 View route·빌드 파이프라인·Impact Gate 실행법·Timeline readiness 기준을 추가했고, View 계약은 08로 분리했다.

## 12. 위험 요소

- **R14 신규**: 그래프가 771 KB다. 현재는 4개 View가 lazy chunk로 공유하지만, 향후 홈/검색이 의존하게 되면 초기 번들에 들어갈 수 있다. View 추가 시 import 위치를 확인해야 한다.
- **R12**(generated stale): U10 편입으로 완화됐다. `data:build`가 항상 재생성한다.
- **R11**(축약 한국어 표기): 여전히 화면에 `MEM`·`CPU`·`OOM`이 그대로 노출된다. RC1 동결이라 표시만 한다.
- 학습 경로의 ladder와 curated path 길이 차이는 설명으로 처리했으나, 사용자 혼동이 확인되면 표현을 재검토한다.

## 13. 다음 단계

**데이터 enrichment / coverage expansion 전략**을 제안한다(이번 Cycle에서 착수하지 않음).

1. **알고리즘 학문 열기** — term 1개뿐이라 유일하게 `insufficient-coverage`다. M09/M10의 정렬·탐색·복잡도 term에 override와 경로를 넣으면 열린다. 가장 적은 작업으로 노출 영역이 하나 늘어난다.
2. **cloud-computing 열기** — devops field의 9개 term(amazon-*, cloud-region, 호스팅 4종)을 override하면 `declared`를 벗어난다.
3. **SRE는 뒤로** — canonical 자체가 없어 override로 해결되지 않는다. canonical 추가는 `docs/13` 성장 정책 대상이며 Owner Gate다.
4. **prerequisite 밀도** — 현재 선수 관계가 있는 term은 94개다. Prerequisite View의 가치는 이 숫자에 비례하므로 cluster 확장을 계속하되, 매번 Impact Gate를 돌린다.
5. **Timeline 데이터** — `evolved_from`을 15건 이상으로 늘리되 서사가 이어지는 chain 위주로. 개별 pair를 늘리는 것은 도움이 되지 않는다.

**하지 않을 것**: 519개 일괄 enrichment, 전체 학문 수작업 보정, 근거 없는 ontology 변경.

## 14. 관련 commit

| commit | 내용 |
| --- | --- |
| `2172392` | feat(encyclopedia): integrate graph build pipeline |
| `505f675` | test(encyclopedia): add impact regression checks |
| `6ebaef9` | feat(encyclopedia): add prerequisite view |
| `feda7dc` | feat(encyclopedia): add mission view |
| `e4db554` | feat(encyclopedia): add academic view |
| `f2a7b68` | feat(encyclopedia): add role view and wire navigation |
| `89b5240` | test(encyclopedia): validate encyclopedia views |
