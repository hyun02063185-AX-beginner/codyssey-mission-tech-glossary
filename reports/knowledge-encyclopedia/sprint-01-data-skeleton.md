# Sprint 01 — Data Skeleton

- 수행일: **2026-09-19**
- 시작 commit: `e3a8bd4` (Foundation Review 종료)
- 성격: 구현. **RC1 데이터 변경 0건**
- 판정: **EMPTY SKELETON GATE PASS** — cluster 데이터 없이도 빌드·검증·기존 QA 전부 통과

---

## 1. 시작 상태

Foundation Design VALID. 확정된 결정(FD-01~FD-10)에 따라 authoring 표면을 최소로 잡고, 나머지는 파생하는 구조를 구현했다.

## 2. 구현한 것

### authored source — `data/encyclopedia/`

| 파일 | 내용 | 규모 |
| --- | --- | --- |
| `README.md` | 파일별 소유 범위, 절대 규칙 6개, relation 방향 계약, **사람이 새 항목을 추가하는 법** | — |
| `relation-ontology.json` | relation 12종의 방향·대칭·역관계 이름·learn-first 여부 + 파생 전용 4종 | 12 + 4 |
| `academic-fields.json` | 학문 11 + 적용영역 3, 선수 순서, **Atlas→학문 crosswalk 12줄** | 14 |
| `missions.json` | 미션 제목·order·ID alias 3종·학문 배정·다음 학습 | 16 |
| `roles.json` | 직무별 분야/학문 가중치 + coverage | 10 |

**적지 않기로 한 것**: 미션의 term 목록, 직무별 term 목록, 학문별 term 수와 status, 역방향 edge, `related`. 전부 파생한다.

### builder — `scripts/build_encyclopedia_graph.py`

읽기 전용 입력(master, generated glossary, Atlas 3종, 10개 map, `data/encyclopedia/**`) → `src/data/generated/encyclopedia-graph.json`.

책임: mission ID normalization(4표기 → 1) · glossary 연결 · Atlas crosswalk · 학문 파생과 override 병합 · 직무 membership 파생 · relation 정규화와 중복 병합 · 역방향 **인덱스** 생성 · 학문 termCount/status 계산 · 미션 선수 과목 closure 계산.

출력은 **결정적**이다(정렬, 타임스탬프 없음). 두 번 돌려 diff 없음을 확인했다.

### validator — `scripts/validate_encyclopedia.py`

9개 범주를 검사한다: relation 어휘 대조 · 학문 taxonomy와 parent/선수 순환 · crosswalk 완전성 · 미션(중복 order, alias 충돌, **route alias가 실제 웹 라우트 규칙과 일치하는지**, term 목록 유출) · 직무 참조 · cluster(foundation 규칙, override reason, edge 6필드, 중복, self-reference) · 그래프 무결성 · 선수학습 cycle · 경로의 edge 근거 · 파생 전용 relation 무단 작성 · **RC1 519/519 회귀**.

relation 어휘는 목록을 베끼지 않고 `validate_knowledge_map`의 `RELATIONS`를 **import해서 대조**한다 → 어휘가 두 곳에서 갈라질 수 없다.

### npm scripts

`encyclopedia:build`, `encyclopedia:validate`(build 후 validate). 기존 `data:build` 파이프라인은 **건드리지 않았다** — Web/Extension 빌드 동작을 그대로 두기 위해서다.

## 3. 발견 사항

### D1. Harness가 기존 동결 데이터의 결함을 잡았다

`data/knowledge-maps/git-collaboration/knowledge-map.json`에 **self-reference edge**가 있다.

```
term:remote -is_a-> term:remote
reason: "원격 저장소는 remote가 가리키는 공유 Git repository다."
```

기존 `validate_knowledge_map.py`에는 self-reference 검사가 없어 RC1 QA를 통과했다. **변경 금지 영역이므로 고치지 않았다.**
대신 harness가 **출처별로 등급을 나누도록** 설계를 바꿨다: `origin`이 `map:`이면 UPSTREAM 경고 + Owner Gate 보고 목록, `cluster:`면 오류. 고칠 수 없는 것 때문에 validator가 영구히 빨간불이 되는 상황을 피하면서도 결함을 숨기지 않는다.

### D2. 학문 4개가 term 0~1개로 나온다

기본 crosswalk만으로는 `cloud-computing` 0, `sre` 0, `algorithms` 0, `computer-architecture` 0이다(이후 pilot override로 algorithms·computer-architecture가 1개씩 생김). **숨기지 않고 `declared`/`sparse` 상태로 노출**한다. 빈 학문을 그럴듯하게 채우지 않는다는 원칙(docs/12의 "빈 canvas 금지"의 연장)을 따랐다.

### D3. 파생이 authoring보다 20배 많다

authored edge 241(전부 기존 map) + derived 2,843. authoring 없이도 membership·related·미션 연결이 전부 살아난다 → "계산 가능한 것은 저장하지 않는다"가 실제로 성립함을 확인.

## 4. Empty Skeleton Gate

| 검증 | 결과 |
| --- | --- |
| builder | PASS — 519 terms · 14 academic · 16 missions · 12 fields · 10 roles · 14 foundation(신규 0) |
| builder 결정성 | PASS — 재실행 시 diff 없음 |
| validator | PASS — 0 error · 1 warning(UPSTREAM) |
| validate_glossary | PASS — 519 · 46 mission-local · 0 error · 0 warning |
| validate_technology_field_atlas | PASS — 12 fields · 519 terms · 16 missions |
| validate_knowledge_map | PASS — 10 implemented / 12 registry |
| validate_content_tier_plan | PASS — 519 · A95/B247/C177 |
| `npm run test` | PASS — 4 files / 31 tests |
| `npm run build` | PASS |
| `npm run build:extension` | PASS — deep-link 계약 assert 통과 |
| Playwright | PASS — 5/5 |
| RC1 diff | 변경 0 (`data/curated`, `content`, `data/knowledge-maps`, `extension`, Extension 입력 3파일) |

**Playwright 주의**: 기본 설정(`playwright.config.ts`)은 포트 4173에 `reuseExistingServer: true`다. 이 머신에서는 다른 프로젝트의 dev 서버가 4173을 점유하고 있어 5개 테스트가 전부 실패했다(페이지 제목 "Portfolio World"). 빈 포트로 같은 테스트를 돌리면 5/5 통과한다. **코드 문제가 아니라 환경 문제**이며, 저장소 설정은 변경하지 않았다.

## 5. 미확정 / 남긴 것

- U5(prerequisite 역방향 2건), U7(학문 지도 UI), U8(mission-term-map 중복) 그대로.
- `encyclopedia:build`를 `data:build`에 넣지 않았다. 넣으면 Web/Extension 빌드마다 그래프가 갱신되지만, RC1 파이프라인 동작을 바꾸게 된다. **Owner 판단 사항**으로 남긴다.

## 6. 위험 요소

- **R12 신규**: `encyclopedia-graph.json`이 기존 빌드 파이프라인 밖에 있어 **stale 될 수 있다**. `encyclopedia:validate`가 항상 rebuild 후 검사하도록 묶어 완화했지만, 누군가 authoring만 고치고 빌드를 안 돌리면 generated가 뒤처진다.
- R4(RC1 오염)는 diff 검사로 계속 확인한다.

## 7. 다음 Sprint 권고

Sprint 2 Pilot 3 cluster. cluster 데이터가 들어와도 skeleton이 유지되는지, override 비율이 추정(15~25%) 범위인지 실측한다.

## 8. 관련 commit

| commit | 내용 |
| --- | --- |
| `21b42fd` | feat(encyclopedia): add knowledge data skeleton |
| `091a593` | test(encyclopedia): add graph integrity harness |
