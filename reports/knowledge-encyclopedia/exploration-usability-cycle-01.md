# Exploration & Usability Cycle 01 — 실행 기록

> 이력 문서다. 이후 상태 변화에 맞춰 소급 수정하지 않는다.
> 시작 기준: HEAD `b50ec6e` · tag `encyclopedia-learning-baseline-v1`
> 판정: **`ENCYCLOPEDIA_EXPLORATION_V1_READY`**

---

## 1. 이번 Cycle의 전환

기본 작업을 데이터 enrichment에서 **탐색 경험**으로 옮겼다. 데이터는 한 줄도 바꾸지 않았다.

| 항목 | before | after |
| --- | --- | --- |
| Encyclopedia 진입점 | 없음 (헤더 메뉴 8개뿐) | **`/encyclopedia`** + 글로서리 홈 진입 |
| 대표 학습 흐름 발견 | 용어를 고른 뒤에야 보임 | **홈에서 6개** (학문마다 하나씩) |
| 용어 → 대백과 | **없음** (막다른 길) | 선수학습 · 학문 · 미션 |
| 학문 ↔ 기술 지도 | 없음 | 양방향 |
| 미션 목록 | `본과정 M13 · 28개 용어` | **제목 포함** |
| Playwright | 16 | **21** |
| authored edge / path / canonical | 546 / 166 / 519 | **변화 없음** |

---

## 2. Baseline Freeze

전체 검증 PASS 후 annotated tag를 남겼다.

```
encyclopedia-learning-baseline-v1   (b50ec6e)
```

`glossary-rc1`(콘텐츠 동결)과 `encyclopedia-views-v1`(View 동작 시작)을 대체하지 않는다.
세 tag의 의미가 각각 다르며, 그 구분을 tag 메시지에 적어 두었다.

---

## 3. R12 — 2건이 아니라 79건이었다

§2~3의 bounded audit 결과, 처음 보고했던 범위가 크게 어긋나 있었다.

### 3.1 무엇을 찾았나

상세 콘텐츠 **518개가 고유 본문 176개만 공유한다.** 350개가 분야 단위 템플릿
본문을 쓰고, 템플릿이 그 분야의 대표 미션을 **고정 문구로 박아 넣었다.**

| 템플릿 무리 | term 수 | 고정된 회차 |
| --- | --- | --- |
| Git / Collaboration | 46 | M04·M06 |
| Database + Data | 45 | M11·M12 |
| Server / Network / Container | 45 | M05·M12 |
| Linux / OS | 44 | M07·M08 |
| Security | 40 | M05·M07·M13 |
| Algorithms / Programming | 46 | (회차 인용 없음) |
| Web | 42 | (회차 인용 없음) |
| AI / Data / Tools | 42 | (회차 인용 없음) |

그 분야 안에서 **다른 미션에 속한 term이 그대로 물려받았다.** 예를 들어 `base-image`는
예비 M01에만 나오는데 본문은 "M05와 M12에서 service를 배포하고"라고 적는다.

### 3.2 판정

| 판정 | 수 |
| --- | --- |
| `CONTENT_OK` — term 고유 본문 | 166 |
| `CONTENT_CONTEXT_MISMATCH` — 회차 인용이 틀렸다 | **79** |
| `LIKELY_TEMPLATE_CONTAMINATION` — 틀리지는 않았으나 고유 설명이 아니다 | 143 |
| `NEEDS_MANUAL_REVIEW` — 회차 인용이 없어 "왜 필요한가"에 답 못 함 | 130 |

**RC1 changes: 0.** 읽기만 했다. `data/reviews/r12-content-template-audit.json`에 term별
판정과 템플릿 무리를 기록하고 `upstream-registry.json`의 R12 범위를 갱신했다.

### 3.3 왜 이것이 학습 구조에 영향을 주지 않는가

문제는 `이 미션에서는 왜 필요한가` 절에 국한된다. 한 줄 정의와 `정확한 설명` 절은
대체로 term 고유다. Encyclopedia는 학문 배정에서 **한 줄 정의와 mission-term-map만**
근거로 쓴다(FD-12). 그래서 이 결함이 판정을 오염시키지 않았다 — 다만 U18 판단 때
근거를 흐렸던 것은 사실이고, 그 경위를 FD-12에 적어 두었다.

---

## 4. Navigation Audit (§5)

새 UI를 만들기 전에 실제 이동 구조를 조사했다.

| 화면 | 나가는 길 | 판정 |
| --- | --- | --- |
| 글로서리 홈 `/` | 검색 · 핵심 용어 · 웹툰 | **대백과로 가는 길 0** |
| 용어 `/terms/:id` | 기술 지도 · 개념 연결 | **선수학습/학문/미션 0 — 막다른 길** |
| 미션 `/missions/:id` | 학문 · 선수 개념 · 지도 · 용어 | OK |
| 선수학습 | 용어 · 학문 · 미션 · 경로 | OK |
| 학문 | 선수학습 · 미션 · 경로 | **지도로 가는 길 0** |
| 직무 | 학문 · 용어 · 미션 | OK |
| 기술 지도 | 용어 · 개념 연결 | **대백과로 가는 길 0** |

**가장 큰 단절은 용어 페이지였다.** 검색으로 들어오면 도착하는 자리인데, 거기서
대백과 어디로도 갈 수 없었다. View 네 개를 만들어 두고도 헤더 메뉴를 아는 사람만
쓸 수 있는 상태였다.

---

## 5. 만든 것

### 5.1 `/encyclopedia` — 진입 화면

dashboard가 아니다. 새 데이터를 보여 주지 않고, 새 metadata도 만들지 않는다.
숫자는 전부 그래프에서 세고, 하는 일은 목적을 네 갈래로 갈라 기존 화면으로 보내는 것뿐이다.

| 진입 의도 | 학습자의 물음 | 보내는 곳 | 세는 값 |
| --- | --- | --- | --- |
| 미션부터 준비하기 | 이번 미션을 하려면 무엇부터? | `/missions` | 미션 16개 |
| 용어 하나에서 출발하기 | 이 기술 앞에 무엇이 있나? | `/prerequisites` | 먼저 볼 개념이 있는 용어 310개 |
| 기초부터 쌓기 | 이건 어느 영역 이야기인가? | `/academic` | 열려 있는 영역 13개 |
| 직무에서 되짚기 | 실제로 어느 역할에서 쓰나? | `/roles` | 연결이 넓은 직무 8개 |

**대표 학습 흐름 6개.** 새 추천 알고리즘을 만들지 않았다. 경로에 담긴 핵심 용어 수,
걸치는 미션 수, 길이로 점수를 내고 **학문마다 하나씩** 골라 쏠림을 막는다.

### 5.2 Cross-View 연결

| 방향 | 구현 |
| --- | --- |
| 용어 → 선수학습 · 학문 · 미션 | `TermEncyclopediaLinks` (lazy) |
| 기술 지도 노드 → 선수학습 · 학문 · 미션 | 같은 컴포넌트 compact 형태 |
| 학문 → 기술 지도 | 용어가 가장 많이 실린 지도를 **세어서** 고른다 |
| 글로서리 홈 → 대백과 | 본문 진입 블록 |

학문↔지도는 1:1 표를 손으로 적지 않았다. 표는 용어가 옮겨 갈 때마다 낡는다.
겹치는 용어가 다섯 미만이면 "이 학문의 지도"라고 부를 수 없으므로 잇지 않는다.

---

## 6. Learner Scenario 판정 (§12~14)

실제 브라우저에서 클릭으로 수행했다.

| Scenario | 경로 | 판정 |
| --- | --- | --- |
| **A** M13을 해야 하는데 무엇부터? | 홈 → 미션부터 준비하기 → M13 → "무엇을 먼저 알아야 하는가" | **PASS** (3클릭) |
| **B** Redis가 왜 자료구조와 연결되지? | 검색 → 용어 → 먼저 볼 개념 → 시간복잡도·해시맵·키-값 저장소 사슬 | **PASS** (2클릭) |
| **C** 웹 개발을 어느 순서로? | 홈 → 기초부터 쌓기 → 웹 프로그래밍 → 공부 순서 + 경로 16개 | **PASS** (3클릭) |
| **D** 운영체제가 어느 미션과? | 학문 → 운영체제 → 관련 미션 8개 | **FRICTION** |
| **E** 백엔드 엔지니어는 뭘 공부하지? | 직무 → 백엔드 엔지니어 → 분야·학문·개념·미션 | **PASS** (2클릭) |

**PASS 4 · FRICTION 1 · BLOCKED 0**

### FRICTION — Scenario D

- **위치**: `/academic/:fieldId`
- **사용자 목적**: "이 학문이 어느 미션과 이어지는가"만 알고 싶다
- **현재 행동**: 상단 요약에 "관련 미션 8개"라는 **숫자만** 있고, 실제 미션 목록은
  핵심 개념 12개 · 공부 순서 · 학습 경로(운영체제는 8개)를 지나야 나온다
- **필요한 최소 수정**: 상단 요약의 "관련 미션 N개"를 그 자리 앵커 링크로 만들거나,
  미션 칩을 경로 위로 올린다. 데이터 변경 없음, 레이아웃만

이번 Cycle에서 고치지 않았다. §15에 따라 navigation·copy로 해결 가능한 문제이고,
다른 학문(정보보안·데이터베이스)에서는 경로가 짧아 같은 마찰이 약하다. 학문별로
섹션 순서를 바꾸는 판단이 필요해 backlog로 남긴다.

---

## 7. 브라우저 QA에서 실제로 잡은 것

자동 테스트만으로는 못 잡았을 두 가지를 직접 화면을 보고 찾았다.

1. **대표 학습 흐름의 학문이 틀렸다.** "파일에 쓰던 것을 왜 데이터베이스로 옮기는가"가
   **운영체제**로 표시됐다. 첫 단계(`파일 I/O`)의 학문을 그대로 쓰고 있었기 때문이다.
   경로는 다른 학문의 개념에서 출발하는 일이 흔하다. 학문 앵커가 있으면 그것을,
   없으면 최빈 학문을 쓰도록 고쳤다.
2. **학문 이름이 두 번 보였다.** 흐름 카드에 "소프트웨어공학 · 미션 3개"라고 적고
   첫 단계 칩에도 "소프트웨어공학"이 다시 나왔다. 홈의 흐름에서는 앵커 단계를 뺐다.

추가로 미션 목록의 제목 누락(§6 Scenario A에서 발견)을 고쳤다.

---

## 8. Display Boundary (§16)

`src/learnerView.ts` projection 유지. 새 projection 4종(`featuredPath` · `termLinks` ·
`entry` · `mapLink`)을 `LEARNER_FIELDS` 허용 목록에 넣고, 새 View 3개와 `App.tsx`를
소스 검사 대상에 추가했다.

**leaks 0 · remaining 0.** raw ID · override · registry · upstream · crosswalk ·
coverageState raw value · internal reason · source path · validator terminology 모두 없음.
Playwright에도 탐색 화면 전용 검사를 추가했다.

---

## 9. Visual Hierarchy (§19)

각 상세 화면에서 다섯 가지가 읽히는지 확인했다.

| | 현재 위치 | 무엇을 배우는지 | 먼저 볼 것 | 연결된 영역 | 다음 행동 |
| --- | --- | --- | --- | --- | --- |
| 선수학습 | eyebrow | h1 + 자세한 설명 표시 | 단계별 사다리 | 자리(학문·분야·미션) | 다음으로 연결되는 개념 |
| 미션 | eyebrow | 미션 제목 | 과목 순서 + 밖에서 볼 개념 | 학문 칩 · 지도 | 다음에 공부할 것 |
| 학문 | 과목 종류 | h1 + 소개 | 이 영역을 보기 전에 | 미션 · **지도(신규)** | 이 영역을 알고 나면 |
| 직무 | eyebrow | h1 + 범위 안내 | — | 학문 · 분야 | 만나는 미션 |
| **대백과 홈(신규)** | eyebrow | h1 + 축 설명 | 진입 의도 4개 | 다른 방식 3개 | 대표 흐름 6개 |

직무 화면에는 "먼저 볼 것"에 해당하는 자리가 없다. 직무는 학습 순서를 갖는 개념이
아니라서 의도한 공백이다.

---

## 10. Mobile (§18)

375px에서 확인: `/encyclopedia` · `/terms/:id` · `/missions` · `/prerequisites/:id` ·
`/academic` · `/roles` 모두 **가로 넘침 0**. 긴 한국어 라벨은 `overflow-wrap:anywhere`로
끊는다. Playwright의 좁은 화면 검사에 새 경로 2개를 추가했다.

**minor**: 헤더 메뉴가 9개가 되어 375px에서 세 줄로 접힌다(85px). 동작에는 문제가
없으나 계속 늘리면 곤란하다. 메뉴 묶기는 route 이름을 건드리지 않고도 가능하지만
이번 범위를 넘어 backlog로 남긴다.

---

## 11. 전체 QA

| 항목 | 결과 |
| --- | --- |
| validator 5종 | 전부 PASS (glossary 0 error / 0 warning) |
| coverage review | PASS (판정↔그래프 충돌 0) |
| Impact Gate | unexpected 0 (데이터 변경 없음) |
| unit test | **60 passed** (encyclopedia views 29) |
| Playwright | **21 passed** (16 → 21) |
| browser QA | Scenario A~E 직접 수행 · 375px 확인 |
| production build / extension build | PASS / PASS |
| RC1 diff | **변경 0** |

---

## 12. Data Model (§25)

| 항목 | 결과 |
| --- | --- |
| schema 변경 | **0** |
| ontology 변경 | **0** |
| node / relation type | **0** |
| academic taxonomy · role model | **0** |
| authored edge · path · cluster | **0** |

이번 Cycle에서 `data/encyclopedia/`를 한 글자도 바꾸지 않았다. UX 문제를 전부
navigation · projection · copy · layout · cross-link로 해결했다(§15).

---

## 13. 다음 권고 (§N)

Scenario 결과를 기준으로 본다. BLOCKED가 없으므로 다음은 **깊이**가 아니라 **마감**이다.

1. **Scenario D FRICTION 해소** — 학문 화면의 섹션 순서. 상단 요약의 숫자를 앵커로
   만드는 것만으로도 대부분 해결된다. 데이터 변경 없음
2. **헤더 메뉴 정리** — 9개는 많다. route를 바꾸지 않고 label과 묶음만 조정
3. **R12 Owner 결정** — 79건(사실 오류)이 우선이고, 그다음이 130건(설명 없음),
   143건(고유하지 않음)이다. 생성 스크립트가 남아 있다면 **템플릿에 미션을 고정하지
   않도록 먼저 고치는 것이 순서다.** 고치지 않으면 재생성 때 같은 일이 반복된다
4. **남은 Owner Gate**: U14(SRE 후보 5건) · U15(컴퓨터구조 후보 5건) · EX03(map reason 문장)

권고하지 않는 것: 새 data enrichment cycle 자동 시작, Ontology/View 재설계,
Timeline 활성화, canonical 대량 추가.

---

## 14. 커밋

| commit | 내용 |
| --- | --- |
| `d089249` | R12 전수 감사 — 79건 확인, RC1 수정 0 |
| `4952cab` | 대백과 진입 화면 · cross-view 연결 · 미션 제목 · 계약·테스트 확장 |
| tag `encyclopedia-learning-baseline-v1` | `b50ec6e` 기준점 |
