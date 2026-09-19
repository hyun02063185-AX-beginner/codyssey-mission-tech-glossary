# Sprint 00b — Foundation Review

- 수행일: **2026-09-19**
- 시작 commit: `2faf458` (Sprint 0 종료 시점), 기준 tag `glossary-rc1`
- 성격: Sprint 0 설계의 **교차검증**. 데이터·코드 변경 없음(문서 2건 생성)
- 판정: **FOUNDATION_DESIGN_VALID** — 중단 조건 미해당, 소규모 수정은 문서화 후 계속 진행
- 이 보고서는 당시 기록이다. 현재 상태는 `docs/knowledge-encyclopedia/00-project-status.md`를 본다.

---

## 1. 시작 상태

Sprint 0가 설계 문서 5종과 보고서 1종을 남겼고, 미확정 8건(U1~U8) 중 U1~U3이 Sprint 1 착수를 막고 있었다.
Sprint 0 문서를 그대로 신뢰하지 않되 처음부터 다시 분석하지도 않는다는 지시에 따라, **핵심 결정 6건(F1~F6)만** 저장소 데이터로 재확인했다.

## 2. F1 — Mission ID

전 저장소 grep으로 표기별 사용처를 셌다.

| 표기 | 사용처 | 성격 |
| --- | --- | --- |
| `course:"main"` + `mission:"M01"` | master `mission_refs` | 데이터 원본 |
| `main/M01` | mission-term-map(16), missions.json(16), mission-field-matrix(16), term-field-classification(586) | 내부 키 |
| `main-m01` | atlas routing(34), map-registry(24), overlay 18개, concept-connections(7), term-map-links(16), `#/maps?mission=` | 공개 URL 파라미터 |
| **`main-M01`** | `#/missions/main-M01` | **공개 URL 경로** |

**Sprint 0가 놓친 네 번째 표기를 발견했다.** `src/App.tsx`의 목록 화면은 `to={/missions/${c}-${id}}`로 **대문자** 링크를 만들고, 상세 화면은 `/^M\d\d$/`로 검증한 뒤 지도용으로만 소문자화한다. 즉 `#/missions/main-m01`(소문자)은 "존재하지 않는 미션입니다"로 떨어진다.

→ 통일하지 않고 **정규 ID 1개 + alias 3종 + 빌더 normalization**으로 확정(FD-02). 공개 URL과 Extension 계약을 건드리지 않는다.

## 3. F2 — Foundation과 Canonical의 경계

Sprint 0의 "주요 hub canonical 0" 보고를 별칭·한국어·부분일치까지 넣어 재검색했다. **일부가 틀렸다.**

| Sprint 0 주장 | 재검증 |
| --- | --- |
| Hash Table 없음 | **틀림** — `hash-map`(해시맵 / Hash Map, "키를 해시해 값에 빠르게 접근하는 자료구조") |
| REST 없음 | **틀림** — `rest-api` |
| Request / Response 없음 | **틀림** — `http-request-response`, `request-response-cycle` |
| Database 없음 | 일반명사는 없으나 `relational-database`로 충분 |
| CPU 없음 | `cpu-usage`의 **alias가 문자 그대로 "CPU"**, 별도로 `cpu-architecture` 존재 |
| Client / Server / API(일반) / Key-Value Store / Data Structure / Operating System 없음 | **맞음** |

→ 신설 foundation을 **3개로 축소**(FD-03). Data Structure와 Operating System은 학문 node가 경로 시작점을 맡아 불필요.
→ 부수 발견: `cpu-usage`의 alias "CPU", `memory-usage`의 한국어 표기 "MEM" 같은 **별칭·표기 품질 문제**가 있다. RC1 동결 영역이라 수정하지 않고 backlog로만 기록한다.

## 4. F3 — 기존 synthetic foundation 14개

전수 확인(소속 map, role, degree, rationale) 후 **전부 map-only 유지, 승격 0**으로 판정(FD-04).

- mission-local 어휘 4개(router/service/repository layer, monitor.sh)는 `mission-local-terms-v0.1.json`에 원본이 있음을 확인했다.
- degree 1이 8개로 대부분 단일 term 설명 장치다.
- **개념 중복 1건 발견**: `foundation:request-response`(frontend)는 canonical `http-request-response`/`request-response-cycle`과 같은 개념이다. Encyclopedia는 canonical 쪽을 쓰고 세 번째 ID를 만들지 않는다.

## 5. F4 — Relation Ontology

- 어휘의 실제 원본은 map 파일이 아니라 **`validate_knowledge_map.py`의 `RELATIONS` 상수(12종)**다. 각 map은 그 일부를 자기 파일에 다시 선언한다.
- Frontend만 12종 전부를, **유일하게 방향이 명시된 문구**로 선언한다. 나머지 9개는 7종만, 방향이 빠진 축약 문구다(`compare_with` 문구 4종, `provided_by` 3종으로 분기).
- 미선언 relation을 쓰는 map은 0건(확인함).

→ **어휘는 validator, 의미는 `data/encyclopedia/relation-ontology.json`**으로 소유를 분리(FD-05). 기존 map 파일은 건드리지 않는다. 역관계는 저장하지 않고 인덱스로 파생한다.

## 6. F5 — Atlas Crosswalk "불일치 47건"의 실체

`build_technology_field_atlas.py`의 `OVERRIDES`(86건)와 대조해 원인을 분류했다.

| 원인 | 건수 |
| --- | ---: |
| glossary `category`가 거칠어 그대로 전파 (`Programming` 83개 grab bag 등) | **39** |
| Atlas가 이미 `secondaryFields`로 다중 맥락을 표현 중 | **8** |
| Atlas **mapping rule error** | **0** |

**결론: Atlas의 오류가 아니라 축의 차이다.** `mutex`의 기술 분야 홈이 programming-foundations인 것과 학문 홈이 operating-systems인 것은 둘 다 맞다. → Atlas를 고치지 않고, 학문 축은 파생 + override로 간다(FD-06). override 비율은 pilot에서 실측하기로 했다.

## 7. F6 — 범위 선언

원문을 다시 읽었다. `docs/00_project_overview.md` §5는 "컴퓨터 과학 전체 **용어**를 모두 **수록**하는 백과사전"을 금지하며, 같은 목록에 "모든 용어를 웹툰으로", "AI 설명 무검수 게시"가 함께 있다 → **수집·제작 범위 통제 조항**이다. `docs/13`은 프로젝트를 "growing learning knowledge system"으로 규정한다.

→ Encyclopedia는 **수집이 아니라 연결**이므로 충돌하지 않는다. **README와 docs/00 문구는 수정하지 않고 유지**하고, 해석만 ADR로 기록(FD-01).

## 8. U1~U8 처리

| | 결과 |
| --- | --- |
| U1 범위 선언 | 해결 (FD-01) |
| U2 학문 14개·선수 순서 | 잠정 확정 (FD-06). 커리큘럼 소유자가 파일 하나로 수정 가능 |
| U3 미션×학문·studyNext | 잠정 확정 (`missions.json`) |
| U4 미션 order | 해결 — 예비 M01~03 → 본과정 M01~13 |
| U5 prerequisite 역방향 2건 | **미해결(의도적)** — map 동결, Owner 승인 사항 |
| U6 실습 term | `direct` 근사 채택 (`mission_uses` edge가 0개라 더 나은 근거 없음) |
| U7 학문 지도 UI | 범위 밖 |
| U8 mission-term-map 중복 | 미해결(의도적) — Encyclopedia는 master만 읽어 영향 없음 |

## 9. 생성/수정 문서

**생성**: `docs/knowledge-encyclopedia/06-agent-governance-model.md`, `07-foundation-decisions.md`
**수정**: 없음. Sprint 0 문서와 보고서는 당시 기록으로 유지했다.

## 10. Foundation Review Gate

**FOUNDATION_DESIGN_VALID.** 중단 조건 5가지 중 해당 없음.

| 중단 조건 | 판정 |
| --- | --- |
| RC1 canonical 변경 필수 | 아니오 — hub 3개는 foundation으로 해결 |
| Atlas taxonomy 대규모 변경 필수 | 아니오 — 47건은 축 차이이지 오류가 아님 |
| 신규 relation ontology 대규모 추가 | 아니오 — 신규 0종 |
| Sprint 0 핵심 구조가 근본적으로 잘못됨 | 아니오 — 수정 2건은 모두 국소적 |
| 데이터 손실/호환성 파괴 위험 | 아니오 — 기존 파일 읽기 전용 |

## 11. 위험 요소 (갱신)

- R2(prerequisite authoring 비용)와 R8(파생 분류 정직성)은 유효하다. R8은 F5로 정량화되어 pilot 측정 항목이 되었다.
- **R10 신규**: ontology 표류로 방향 규약이 Frontend에만 있어, prerequisite를 늘릴수록 역방향 edge가 누적될 수 있다. → Encyclopedia 자체 방향 계약 + cycle 검사로 완화.
- **R11 신규**: 기존 canonical의 별칭·표기 품질 문제(`cpu-usage`→"CPU", `memory-usage`→"MEM")가 Encyclopedia 화면에 그대로 드러난다. RC1 동결이라 이번에는 표시만 한다.

## 12. 다음 Sprint 권고

Sprint 1 Data Skeleton으로 연속 진행. `data/encyclopedia/`에 authoring 4종 + relation 의미 파일, 빌더, validator를 만들고 cluster 없이 통과시킨다.

## 13. QA

코드 변경이 없으므로 기준선 훼손 여부만 확인했다(2026-09-19): glossary 519·0 error·0 warning, atlas PASS, knowledge-map PASS, content tier PASS, `git status` clean.

## 14. 관련 commit

| commit | 내용 |
| --- | --- |
| `e3a8bd4` | docs(encyclopedia): validate foundation architecture — 이 Sprint의 산출물 |
| `2faf458` | 시작 기준 (Sprint 0 종료) |
