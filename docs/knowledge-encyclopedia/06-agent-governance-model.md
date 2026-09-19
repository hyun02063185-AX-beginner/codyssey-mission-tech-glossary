# 06. Agent Governance Model

> 상태: **ACTIVE** (Foundation Cycle에서 채택, 실제 작업 계약).
> 이 문서는 조직도가 아니라 **작업 절차 계약**이다. Knowledge Encyclopedia 관련 변경은 여기 정의된 경로를 거친다.

## 0. 원칙 — 역할을 함부로 늘리지 않는다

> 사람이 언급한 분야마다 Agent를 만들지 않는다.

독립 역할은 **네 조건을 모두** 만족할 때만 만든다.

1. 반복적인 별도 책임이 존재한다
2. 다른 역할과 **판단 기준**이 실질적으로 다르다
3. 책임 범위가 명확하다
4. 분리했을 때 품질 또는 운영 효율이 **실제로** 개선된다

만족하지 않으면 다음 중 하나로 처리한다: **View** / **Review Profile** / **Validation Rule** / **Workflow Step**.

현재 상설 역할은 **Orchestrator, Knowledge Architect, Quality Harness, Owner Gate 4개뿐**이다. 분야 전문성은 전부 **Review Profile**(비상설)로 처리한다.

## 1. 전체 흐름

```
사용자 요청
   ↓
Orchestrator        작업 유형·영향 범위 분석 → 필요한 역할만 선택
   ↓
Knowledge Architect 구조 판단 (Node? Metadata? Edge? View 계산?)
   ↓
Specialist Review   필요한 Profile만 (0~3개). 병렬 가능
   ↓
Quality Harness     자동 검증 (의미 판단 없음)
   ↓
Owner Gate          금지선에 닿는 변경만
   ↓
변경 반영 + 문서·리포트 갱신 + commit
```

## 2. Orchestrator

지식의 **내용을 결정하지 않는다.**

**책임**: 작업 유형 분석 · 영향 범위 판단(변경 금지 영역에 닿는가) · Specialist 선택 · 실행 순서/병렬 결정 · 결과 충돌 감지 · Quality Harness 실행 · 최종 통합.

**금지**: taxonomy·ontology 변경, canonical 판단, 기술적 사실 판정, Profile 없이 분야 결론 내리기.

**Specialist 선택 규칙** (전부 호출하지 않는다)

| 변경 대상 | 필수 | 선택 |
| --- | --- | --- |
| academic 구조 | Knowledge Architect | CS Curriculum |
| mission 매핑 | Knowledge Architect | Mission Learning, 해당 분야 1개 |
| cluster edge/path | Knowledge Architect | 해당 분야 1~2개 |
| role 정의 | Knowledge Architect | Role & Practice |
| builder/validator | Knowledge Architect | — |
| 문서만 | — | — |

## 3. Knowledge Architect

Knowledge Encyclopedia **구조적 일관성의 단일 책임자**.

핵심 질문 — 모든 신규 정보는 이 순서로 판정한다.

```
1) View에서 계산 가능한가?      → 그렇다면 저장하지 않는다
2) 기존 데이터에서 파생 가능한가? → 그렇다면 builder에서 파생한다
3) 기존 node의 metadata인가?     → 그렇다면 필드로 넣는다
4) 관계인가?                     → 기존 relation 어휘로 edge
5) 위 어디에도 없으면              → 비로소 새 node/파일
```

**책임**: taxonomy · ontology · data ownership · SSOT · node/metadata 경계 · edge contract · 기존 Atlas/Map/Glossary 재사용 · 중복 구조 방지.

**금지**: 분야 사실(예: "Redis는 무엇인가")을 단독 판정, RC1 데이터 수정, 새 relation type 임의 추가.

## 4. Specialist Review Framework

상설 Agent가 아니라 **Review Profile**이다. 작업당 필요한 것만 활성화한다.

### Profile 계약 (모든 Profile 공통)

```
Expertise               무엇을 아는가
Review Questions        무엇을 묻는가 (체크리스트)
Allowed Recommendations 무엇을 권고할 수 있는가
Forbidden Decisions     무엇을 결정할 수 없는가
Escalation Conditions   언제 상위로 올리는가
```

### 공통 Forbidden Decisions (모든 Profile)

- canonical term 추가·삭제·이름 변경
- Atlas taxonomy / field 분류 변경
- relation type 신설
- 다른 분야 영역 판정
- 근거 없는 사실 주장 (`source` URL 또는 저장소 근거 필수)

### 공통 Escalation Conditions

- canonical 변경이 필요해 보임 → Owner Gate
- 두 Profile의 권고가 충돌 → Knowledge Architect
- 기존 map edge와 모순 → Knowledge Architect
- 분야 경계를 넘는 판단 → Orchestrator가 Profile 추가

### 등록된 Profile

| Profile | Expertise | 대표 Review Question |
| --- | --- | --- |
| **CS Curriculum** | 대학 CS 교과 구조, 과목 선후 관계 | 이 학문 분류/선수 순서가 일반적 커리큘럼과 맞는가? |
| **Web/Backend Architecture** | HTTP, API, 서버, 프레임워크 계층 | 요청 흐름과 계층 경계가 정확한가? 프레임워크를 프로토콜과 혼동하지 않는가? |
| **Operating Systems** | 프로세스, 스레드, 동시성, 메모리, 커널 | 동시성 개념의 선후와 인과가 정확한가? |
| **Database** | 관계형 모델, 인덱스, 트랜잭션 | 저장·질의 개념이 데이터 구조와 구분되는가? |
| **Data Structures/Algorithms** | 자료구조, 복잡도 | 자료구조와 그 응용(캐시·저장소)을 구분하는가? |
| **Security** | 인증/인가, 세션, 토큰 | 인증과 인가를 혼용하지 않는가? |
| **AI/LLM** | 모델, 프롬프트, 추론 | 모델·API·토큰 개념이 혼동되지 않는가? |
| **DevOps/SRE** | 컨테이너, 배포, 운영, 관측 | 클라우드 서비스와 실천(practice)을 구분하는가? |
| **Mission Learning** | Codyssey 미션 학습 흐름 | 학습자가 이 순서로 실제로 따라갈 수 있는가? |
| **Role & Practice** | 실무 직무 구성 | 직무-분야 가중치가 현실적인가? 커버리지를 과장하지 않는가? |

Profile 활성화는 **기록만 하고 데이터로 저장하지 않는다.** 검토 결과는 edge의 `reason`/`confidence`와 Sprint report에 남고, 별도 리뷰 데이터베이스를 만들지 않는다 (중복 방지).

## 5. Quality Harness

**의미를 판단하지 않는다.** 기계가 확정적으로 잡을 수 있는 것만 잡는다.

| 범주 | 검사 |
| --- | --- |
| Node | duplicate ID, unknown ID, orphan, invalid type/namespace |
| Edge | unknown target, self-reference, duplicate edge(대칭 인지), invalid relation |
| Prerequisite | cycle, broken chain(끊긴 참조), 방향 규약 위반 후보 |
| Taxonomy | parent cycle, duplicate category, invalid field |
| Mission | invalid mission ID, invalid term reference, duplicate mapping |
| Derivation | authoring 금지 항목(`related` 등)이 authored source에 있는지 |
| Regression | canonical 519 / detailed 519 / coverage 100% / Atlas·Map·Extension contract |

구현: `scripts/validate_encyclopedia.py` + 기존 validator 4종 + `npm run test` / `build` / `build:extension` / Playwright.

**Harness가 못 잡는 것**(반드시 사람/Profile이 본다): edge 방향의 의미적 정확성, 학문 배정의 타당성, 경로의 교육적 가치, 설명 문장의 사실성.

## 6. Owner Gate (사람)

다음은 **Agent가 단독으로 하지 않는다.** 반드시 사용자에게 보고하고 승인을 받는다.

1. RC1 canonical/콘텐츠 변경
2. Atlas taxonomy/classification 변경
3. 기존 10개 knowledge map 파일 변경
4. relation type 신설
5. Extension `glossary.json` contract 변경
6. 공개 route 계약 변경
7. 프로젝트 범위 선언(README/`docs/00`) 변경
8. force push, 이력 재작성

## 7. Escalation

```
Profile 간 충돌        → Knowledge Architect 조정
구조 원칙 충돌         → Orchestrator가 재설계 또는 작업 분할
금지선 접촉            → Owner Gate (작업 중단 후 보고)
Harness 실패           → 수정 후 재실행. 실패를 무시하고 진행 금지
근거 부족              → "정보 없음"으로 남기고 진행 (추측 기록 금지)
```

## 8. Workflow 예시

### 예시 A. Pilot cluster 1개 추가 (실제 이번 Cycle 적용)

```
1 Orchestrator   대상: data/encyclopedia/clusters/web-backend.json
                 영향: 신규 authored 파일 1 + generated 1. 금지 영역 미접촉
                 선택: Knowledge Architect + Web/Backend + Security (+Mission Learning)
2 Architect      hub는 foundation인가 canonical인가 → F2 규칙 적용
                 edge는 기존 relation으로 표현 가능한가 → 신규 type 0 유지
3 Specialist     Web/Backend: 요청 흐름 정확성 · Security: 인증/인가 경계
4 Harness        validate_encyclopedia + 기존 validator 4종 + npm test
5 반영           cluster 파일 + report 갱신 + commit
```

### 예시 B. 새 학문 분야 추가 요청

```
1 Orchestrator   academic 구조 변경 → Architect + CS Curriculum 필수
2 Architect      기존 학문의 하위(parent)로 충분한가? atlasCrosswalk 충돌은?
3 CS Curriculum  일반 커리큘럼상 독립 과목인가?
4 Harness        parent cycle, crosswalk 유일성
5 Owner Gate     불필요 (taxonomy는 Encyclopedia 소유)
```

### 예시 C. "이 용어가 canonical에 없다"

```
1 Architect      F2 규칙: 별칭/한국어/부분일치까지 확인했는가?
   ├ 동등 canonical 있음  → 재사용, 끝
   ├ 없음 + 경로에 필요   → foundation node (promotionCandidate)
   └ 없음 + 경로에 불필요 → 만들지 않는다
2 Owner Gate     canonical 신규 추가가 필요하다고 판단되면 여기서 중단·보고
                 (docs/13 성장 정책의 batch review 경로를 따른다)
```

## 9. 이 모델의 자기 평가 기준

Sprint마다 다음을 report에 기록한다. 도움이 되지 않은 역할은 **없앤다**.

- 실제로 품질을 바꾼 Profile은 무엇인가 (구체적 수정 사례)
- 호출했으나 아무 것도 바꾸지 않은 Profile은 무엇인가
- Harness가 잡은 것 / 놓친 것
- 역할 분리로 인한 순수 오버헤드
