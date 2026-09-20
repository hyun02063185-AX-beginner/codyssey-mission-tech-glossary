# Data Enrichment Cycle 02

- 수행일: **2026-09-20**
- 시작 commit: `d5b58a7` · baseline tag `encyclopedia-views-v1`
- 성격: 데이터 확장. **Data Model 동결 유지**, RC1 변경 0건
- 판정: **ENCYCLOPEDIA_DATA_ENRICHMENT_02_READY**
- 이 보고서는 당시 기록이다. 현재 상태는 `docs/knowledge-encyclopedia/00-project-status.md`를 본다.

---

## 0. 운영 Gate

모든 batch를 `Authoring → Builder → Validator → Impact Gate → Global Contract Test → (필요시) Specialist → PASS` 순으로 처리했다. Impact Gate와 Contract Test는 서로 대체하지 않는다 — 전자는 **이번 변경의 영향**을, 후자는 **과거부터 있던 위반**을 본다.

## 1. Global Contract 확장

기존 계약(“어떤 미션도 선언되지 않은 학문의 선수 학습을 얻지 않는다”)을 유지하고 **2개만** 추가했다. 다른 validator가 이미 보장하는 것(self-reference, 중복 edge, 경로 근거, `related` 배제, 미션 term 복제)은 중복 검사하지 않았다.

| 계약 | 막는 반복 오류 |
| --- | --- |
| **active 학문은 반드시 보여줄 내용이 있다** (term ≥1 이고 표시할 핵심 개념이 있음) | 노출 기준을 통과했는데 화면이 비는 상태 |
| **직무 source에 term 목록을 authoring하지 않는다** | Role이 계산에서 authoring으로 퇴행하는 것 |

두 번째 계약은 처음에 오탐을 냈다. `roles.json`의 **키 이름** `"weight"`가 canonical term id와 같아 문자열 전체를 훑는 방식이 걸렸다. 값만 검사하도록 고쳤다 — 계약 자체보다 **계약을 어떻게 검사하는가**가 틀릴 수 있다는 사례다.

## 2. Phase A — Web Programming

| | |
| --- | --- |
| terms reviewed | 92 (전수) |
| edges reused | 기존 Frontend/Backend/Network map edge를 우선 검토, 방향 있는 것 그대로 사용 |
| edges added | **12** |
| paths added | **7** (그중 1개는 신규 edge 0개, 순수 재사용) |
| affected missions | main-m01(콜백·Event Handler), main-m13(SSR) |
| unexpected / contract violations | 0 / 0 |
| specialist | Web/Backend Architecture, Mission Learning |

재사용을 먼저 검토한 결과, `html→dom`, `dom→addEventListener`, `promise→async/await`, `SPA→클라이언트 라우팅→React Router`, `반응형→breakpoint`는 기존 edge로 충분했다. 신규 edge는 **대칭 관계(interacts_with)로만 이어져 학습 순서를 말하지 못하던 구간**에만 넣었다 — react↔state, 이벤트 3종, CSS↔반응형, SSR.

경로: 문서에서 스크립트로 / 이벤트는 어떻게 처리되는가 / 결과를 기다리는 방법들(콜백→Promise→async/await→fetch) / 컴포넌트와 상태 / 화면 크기가 달라도 되는 이유 / 페이지를 새로 받지 않고 화면 바꾸기 / HTML을 서버에서 만들어 보내기.

## 3. Phase B — Artificial Intelligence

| | |
| --- | --- |
| terms | 25 (전수) |
| edges | **9** |
| paths | **4** (이전 0) |
| mission impact | main-m06(환각·추론·LLM), preliminary-m03(내적) |
| unexpected | 0 |
| specialist | AI/LLM, Mission Learning |

**`AI → ML → DL → LLM`을 선수 관계로 옮기지 않았다.** 그것은 분야의 역사이지 학습 순서가 아니고, 애초에 `machine-learning`·`deep-learning` canonical이 없다. 대신 실제로 먼저 알아야 설명되는 것만 이었다: `llm is_a ai-model`, `hallucination based_on llm`, `output-validation based_on hallucination`.

M06(모델을 API로 부르는 쪽)과 예비 M03(모델이 안에서 계산하는 쪽)을 두 갈래로 나눴다. 후자는 내적 → MAC 연산 → NPU 순으로, NPU가 "만능 빠른 칩"이 아니라 특정 연산에 맞춘 장치임이 드러나게 했다.

## 4. Phase C — DevOps

| | |
| --- | --- |
| terms | 21 devops + 네트워크·로그 인접 8 |
| edges | **9** |
| paths | **4** (이전 0) |
| affected missions | main-m05(Docker 이미지·Dockerfile·Socket/Port·TCP) |
| unexpected → resolved | **2건 → 해소** |
| specialist | DevOps/SRE, Operating Systems |

Cloud Computing과 DevOps 학문을 합치지 않았다. 컨테이너 도구와 배포 실천은 devops에, 제공자 자원은 cloud-computing에 그대로 두었다.

**upstream 발견**: `devops-infrastructure` map의 `provided_by` 세 건(dockerfile→docker-image, docker-image→docker-container, docker-hub→docker-image)이 우리 방향 계약과 **반대로** 쓰여 있다. reason을 보면 from 쪽이 제공자다. 같은 파일의 `environment-variable→docker-container`는 계약과 맞아, 한 파일 안에서 쓰임이 갈린다. 원본은 고치지 않고 `upstream-registry.json`에 `EX02-devops-provided-by-direction`으로 등록했다. `provided_by`는 learn-first가 아니라 선수 학습 계산에 들어가지 않으므로 오염 범위가 없고, 학습 순서가 필요한 구간은 방향이 분명한 `based_on`을 따로 작성했다.

**Impact Gate 2건**: M05가 Docker 이미지·Dockerfile을 선수로 얻었다. 관계는 옳고(M05는 컨테이너를 배포한다) 미션의 학문 배정에 devops가 빠져 있던 것이라 supporting을 넓혀 해소했다.

## 5. Phase D — Information Security

| | |
| --- | --- |
| terms | 51 (전수 검토) |
| edges | **8** |
| paths | 4 |
| affected missions | main-m05(Access Control·Inbound/Outbound Rule 추가) |
| contract violations | **0** |
| specialist | Security, Mission Learning |

횡단 학문이라 전파 위험이 가장 컸다. 그래서 **공격 개념(xss·sql-injection·csrf)을 선수 관계의 출발점으로 쓰지 않았다.** 세 갈래 모두 방어 쪽 개념끼리만 이었다: 비밀번호 저장(자격증명→해싱→솔트), 권한 설계(접근제어→IAM→역할), 전송 보호(인증서→HTTPS), 방화벽 규칙(포트→규칙→보안그룹).

**검증**: 전체 16개 미션에 대해 공격 개념이 선수 학습으로 들어갔는지 전수 확인 → **0건**. `SQL → SQL Injection`의 학습 가치는 유지하면서(security-m13 cluster), 그것이 데이터베이스 기초 미션으로 역전파되지 않는다.

## 6. Phase E — Computer Architecture 감사

확장이 아니라 감사였다. 네 질문에 답했다.

| 질문 | 답 |
| --- | --- |
| canonical 누락인가 | **부분적으로만.** register·instruction·pipeline·bus·virtual memory는 실제로 없다 |
| 다른 field에 이미 있는가 | **그렇다.** `cpu-architecture`(x86/arm64)와 `locality`(메모리 지역성)가 programming-fundamentals에 있었다 — **매핑 문제** |
| alias/naming 차이인가 | 일부. `cpu-usage`의 alias가 "CPU"라 CPU 검색이 사용률로 간다(R11에 기록됨) |
| 미션에서 필요한가 | **레지스터 수준은 아니다.** 예비 M03은 수 표현, M08은 증상 수준이고 둘 다 이미 덮인다 |

**조치**: 매핑으로 해결되는 2건만 override(`cpu-architecture`, `locality` → computer-architecture). canonical은 추가하지 않고 후보 5건을 `docs/13`에 등록했다. 결과 4 → 6 term, 경로 1개 추가("캐시는 왜 효과가 있는가" — 지역성이 캐시의 전제라는 연결).

## 7. Learning Coverage — 도입

분모를 **기존 데이터에서 파생**할 수 있어 도입했다. 519개에 수동 flag를 추가하지 않았다.

```
priority learning terms : 300   (importance=core ∧ 미션에 direct/required ∧ 노출된 학문 소속)
with valid prerequisite : 106
learning coverage       : 35.3%
```

세 신호 모두 이미 있는 파생 데이터다. `core`(305)와 최종 분모(300)의 차이가 5개뿐이라 분모가 안정적이며, "핵심이라 부르면서 무엇부터 볼지 답하지 못하는 term"이라는 해석이 분명하다. 빌더가 계산하므로 매 빌드마다 재현된다.

학문별 분포(우선 term / 경로 보유):

| 학문 | 우선 | 보유 | % |
| --- | ---: | ---: | ---: |
| artificial-intelligence | 12 | 8 | 67% |
| data-structures | 9 | 5 | 56% |
| cloud-computing | 4 | 2 | 50% |
| information-security | 27 | 12 | 44% |
| algorithms | 7 | 3 | 43% |
| operating-systems | 31 | 13 | 42% |
| web-programming | 54 | 21 | 39% |
| computer-networks | 14 | 4 | 29% |
| software-engineering | 36 | 10 | 28% |
| database-systems | 49 | 13 | 27% |
| devops | 11 | 3 | 27% |
| programming-fundamentals | 44 | 11 | 25% |

**단순 보유 term 수(149)보다 이 비율이 유용하다.** 수록이 많은 영역일수록 비율이 낮다는 사실이 다음 우선순위를 그대로 알려 준다.

## 8. Impact Review 종합

**영향받은 미션 6개**, 전부 의미 검토 완료:

| 미션 | 새 선수 학습 | 판정 |
| --- | --- | --- |
| main-m01 | 콜백, Event Handler | ✔ fetch·addEventListener 학습에 필요 |
| main-m05 | Access Control, Docker 이미지, Dockerfile, Inbound/Outbound Rule, Socket/Port, TCP | ✔ 배포·방화벽·컨테이너 |
| main-m06 | 환각, 추론, 대규모 언어 모델 | ✔ 출력 검증의 전제 |
| main-m09 | 메모리 지역성 | ✔ 캐시가 왜 효과 있는지 |
| main-m13 | SSR | ✔ Jinja2 SSR의 상위 개념 |
| preliminary-m03 | 내적 | ✔ MAC 연산의 전형 |

**unexpected propagation: 최종 0.** 발생 2건(Phase C)은 미션 학문 배정을 넓혀 해소했다.

## 9. Academic Coverage

| field | terms | missions | paths | overrides | ovr% | visibility |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| web-programming | 92 | 8 | **8** | 0 | 0% | active |
| programming-fundamentals | 72 | 12 | 6 | 2 | 3% | active |
| database-systems | 67 | 9 | 8 | 0 | 0% | active |
| software-engineering | 58 | 10 | 3 | 0 | 0% | active |
| operating-systems | 53 | 8 | 8 | 3 | 6% | active |
| information-security | 51 | 10 | **10** | 1 | 2% | active |
| computer-networks | 29 | 6 | 7 | 1 | 3% | active |
| artificial-intelligence | 25 | 2 | **4** | 0 | 0% | active |
| devops | 21 | 4 | **2** | 1 | 5% | active |
| data-structures | 19 | 2 | 5 | 0 | 0% | active |
| algorithms | 13 | 4 | 4 | 13 | 100% | active |
| cloud-computing | 13 | 4 | 2 | 13 | 100% | active |
| computer-architecture | **6** | 4 | 4 | 6 | 100% | active |
| sre | 0 | 0 | 0 | 0 | — | declared |

**active 13 / declared 1.** visibility 정책은 변경하지 않았다. 변화는 computer-architecture 4→6(매핑 교정)과 programming-fundamentals 74→72(같은 2건이 빠짐)뿐이며 상태는 그대로다. **경로가 0이던 두 영역(AI·devops)이 각각 4개와 2개를 갖게 된 것**이 이번 Cycle의 실질 변화다.

## 10. Role Coverage

**active 8 / limited 2 — 변화 없음.** frontend·backend·devops·security 관련 직무 모두 unexpected membership 없음. QA는 여전히 core 분야 term 0으로 `limited`, SRE는 core 학문이 비어 `limited`. role source에 term 목록을 추가하지 않았고 새 계약으로 고정했다.

## 11. Timeline

| 항목 | 현재 | 기준 |
| --- | ---: | ---: |
| evolved_from | **3** | ≥ 15 |
| 길이 3+ chain | 0 | ≥ 4 |
| 고립 pair 비율 | 100% | < 40% |

**`DEFERRED_FOR_DATA_READINESS` 유지.** 이번에도 발전 관계를 하나도 만들지 않았다. 자연스럽게 발견된 후보도 없었다 — 이번 batch들은 전부 구조적 선후 관계였지 역사적 계보가 아니었다.

## 12. Display QA

브라우저에서 Prerequisite(Redis·React State) / Mission(M05) / Academic(컴퓨터구조·알고리즘) / Role 화면을 직접 확인했다.

**발견·수정 2건**

1. **유지보수 사유가 사용자 화면에 노출** — Academic View의 "기술 분야와 다르게 배정한 용어" 섹션이 `academicOverrides[].reason`을 그대로 렌더링하고 있었다("Atlas 기본 파생은 programming-fundamentals 지만…"). 지난 Cycle에 `note`를 고쳤는데 이번엔 `reason`이었다. **사실만 보여주도록** 바꿨다(용어 + 기술 지도에서의 자리). 사유는 유지보수 데이터로 남는다.
2. **기존 컴포넌트의 라벨 버그** — 미션 상세의 Atlas 링크가 "본과정 m05"로 소문자 출력. 같은 저장소의 `MapsAtlas`가 이미 쓰고 있는 변환 규칙을 적용해 "본과정 M05"로 맞췄다.

| 점검 | 결과 |
| --- | --- |
| raw ID | 없음 |
| 한국어 조사 | 정상 |
| 내부 운영 용어 | 수정 완료(위 1번) |
| long label | 정상 |
| empty state | 정상(노출 안 된 학문은 안내 문구) |
| reason 문구 | 사용자 화면에서 제거 |
| deep link | 정상 |

## 13. 전체 QA

| 항목 | 결과 |
| --- | --- |
| encyclopedia build | PASS · 결정적 |
| encyclopedia validate | PASS — 0 error · 0 warning |
| impact | affected 6 · unexpected **0** |
| global contract | **22 passed** (신규 2 포함) |
| learning coverage | 도입 — 106/300 (35.3%) |
| validate_glossary | **519 · 0 error · 0 warning** · 780 info |
| validate_technology_field_atlas / knowledge_map / content_tier | 전부 PASS |
| Concept Connection | 무변경 (Playwright 확인) |
| Unit | **53 passed** (5 files) |
| Production build | PASS |
| Playwright | **16 passed** |
| Extension build | PASS |
| RC1 diff | **변경 0** |

**Playwright 포트 주의 갱신**: 이번에 4930·4941·4952가 모두 `EACCES`로 실패했다. Windows 예약 포트 범위(`netsh interface ipv4 show excludedportrange protocol=tcp` 기준 4737–5240, 5388–5887 등)가 세션마다 달라지기 때문이다. **예약 범위 밖 포트**(이번엔 6421)를 골라야 한다. 저장소 설정은 변경하지 않았다.

## 14. Data Model Freeze

새 Node Type 0 · 새 Relation Type 0 · Academic/Technology taxonomy 변경 0 · foundation 증가 **0**(3 그대로) · Mission schema 변경 0(academic.supporting 값만 조정).
`ARCHITECTURE_REVIEW_REQUIRED` 항목 없음.

## 15. 누적 변화

| 항목 | Cycle 01 종료 | Cycle 02 종료 |
| --- | ---: | ---: |
| cluster | 10 | **15** |
| authored edge | 336 | **375** (cluster 96 → 135) |
| 학습 경로 | 73 | **93** |
| academic override | 38 | **40** |
| 선수 관계 보유 term | 116 | **149** |
| Learning Coverage | — | **35.3%** |
| 경로 0인 학문 | 2 (AI·devops) | **0** |
| upstream registry | 4 | **5** |

## 16. 판정

**`ENCYCLOPEDIA_DATA_ENRICHMENT_02_READY`**

| 조건 | 결과 |
| --- | --- |
| Web learning structure 확장 | ✔ 경로 1 → 8 |
| AI learning structure 확장 | ✔ 경로 0 → 4 |
| DevOps learning structure 확장 | ✔ 경로 0 → 2 |
| Security semantic propagation 0 | ✔ 전수 확인 |
| Computer Architecture audit 완료 | ✔ 매핑 2건 교정 + 후보 5건 등록 |
| Impact + Contract Gate 모두 PASS | ✔ |
| Data Model Freeze 유지 | ✔ |
| RC1 regression 없음 | ✔ |
| Multi-AI handoff 최신 | ✔ |

## 17. 다음 확장 권고

Learning Coverage 분포가 우선순위를 그대로 말해 준다. **수록이 많은데 비율이 낮은 영역**이 다음이다.

1. **database-systems** — 우선 49개 중 13개(27%). 수록량 대비 가장 큰 공백이다. M11의 제약·인덱스·트랜잭션 세부가 남아 있다
2. **programming-fundamentals** — 44개 중 11개(25%). 예외·모듈·제너레이터 계열이 아직 고립돼 있다
3. **software-engineering** — 36개 중 10개(28%). Git 흐름은 덮였으나 설계 원칙(계층·관심사 분리·의존성 주입)이 비어 있다
4. **computer-networks** — 14개 중 4개(29%). 주소·전송 계층이 얕다
5. **web-programming** — 54개 중 21개(39%)로 개선됐지만 절대 수가 가장 크다

**하지 않을 것**: 519개 일괄 enrichment, SRE·Computer Architecture canonical 추가(Owner Gate), Timeline 숫자 채우기, 노출 기준 완화, View 재설계, ontology 변경.

## 18. 관련 commit

| commit | 내용 |
| --- | --- |
| `d5b58a7` | 시작 기준 |
| (이 Cycle) | Phase A~E · contracts · learning coverage · display fix · report — `git log --oneline -10` |
