# Content Quality Completion Cycle

- 기준 커밋: `d777bc7` (Content Integrity Recovery Cycle 완료)
- 기준선 태그: `glossary-content-integrity-v1`
- 완료일: 2026-09-22
- 판정: **GLOSSARY_CONTENT_QUALITY_BASELINE_READY**

---

## A. 무엇을 했나

앞 Cycle 은 **틀린 내용**을 없앴다. 이번 Cycle 은 **틀리지 않았지만 아무것도 가르치지
않는 문장**을 없앴다.

계획은 260건(NEEDS_REWRITE 117 + NEEDS_SMALL_FIX 143)이었고, 실제로는 **333건**을
다시 썼다. 늘어난 73건은 지난 회차에 `CONTENT_OK` 로 분류됐지만 같은 결함을 가진
문서들이다. 이유는 D절에 적는다.

`content/terms` **329개 파일**이 바뀌었다.

---

## B. 기준 확정 (§2~4)

[docs/knowledge-encyclopedia/08-content-quality-criteria.md](../../docs/knowledge-encyclopedia/08-content-quality-criteria.md)

### Swap Test

> 문장에서 용어 이름만 다른 용어로 바꿨을 때 그대로 말이 되면 FAIL 이다.

```
FAIL  `Accessibility / a11y`의 역할을 실제 화면과 요청 흐름에서 분리해 생각하면 됩니다.
      → 42개 용어가 이 문장을 공유했다. 무엇을 넣어도 말이 된다.

PASS  화면을 눈으로 보지 않거나 마우스를 쓰지 않는 사람도 같은 일을 할 수 있게
      만드는 일입니다. 화면 낭독기에게는 버튼의 생김새가 아니라 태그와 이름이 전부입니다.
```

### Content Value Test

절마다 답해야 하는 질문을 고정했다. `이 미션에서는 왜 필요한가` 는 "이것을 모르면
무엇을 못 하는가", `주의할 점` 은 "언제 깨지는가" 에 답한다.

### 숫자를 목표로 쓰지 않는다

`쉽게 설명하면` 518개는 **전부 고유 문장**이었다. 그런데 253개가 이름만 끼워 넣은
틀이었다. **고유함은 구체성이 아니다.** 그래서 고유 본문 개수를 품질 목표로 쓰지 않는다고
기준에 못 박았다.

---

## C. 검사 도구 (§5)

`scripts/audit_term_specificity.py` — `npm run content:specificity`

용어 이름을 `<T>` 로 가린 뒤 같은 문장이 둘 이상의 용어에서 나오면 공유 틀로 센다.
Swap Test 의 근사치일 뿐이라 **결과는 절대 ERROR 로 쓰지 않는다.** 검토 후보 목록이다.

| 도구 | 보는 것 | 등급 |
| --- | --- | --- |
| `npm run content:integrity` | 매핑되지 않은 회차 인용 | **ERROR** — 사실 오류 |
| `npm run content:specificity` | 이름을 가려도 남는 공유 문장 틀 | **후보 목록** — 판정 아님 |

작업 도중 이 도구의 결함을 두 번 고쳤다.

1. 코드 블록 안의 `## ` 로 시작하는 줄을 절 제목으로 읽었다. `contributing-md` 의
   코드 예가 자리 표시로 잘못 집계됐다.
2. 코드 예가 자리 표시인지를 **길이**로 판정했다(45자 미만). `chmod 640 secrets.txt`
   같은 멀쩡한 예제 36개가 결함으로 잡혔다. 실제 신호는 길이가 아니라 "블록에
   용어 이름만 들어 있는가" 였다.

---

## D. Phase A — NEEDS_REWRITE 117 (§7~9)

| 묶음 | 수 | 분야 | 판정 | 근거 |
| --- | --- | --- | --- | --- |
| 0 | 46 | 알고리즘·프로그래밍 | `KEEP_GOOD_PARTS` | 한 줄 설명·정확한 설명·주의할 점이 이미 용어별로 구체적이었다. 46개가 공유하던 `왜 필요한가` 한 문장만 교체 |
| 1 | 42 | Web | `FULL_REWRITE` | 산문 절이 전부 틀이었고 코드 예는 용어 이름 한 줄이었다 |
| 4 | 29 | AI·하드웨어·데이터 | `KEEP_GOOD_PARTS` | 묶음 0 과 같다 |

**117개를 전부 처음부터 새로 만들지 않았다.** 묶음 0 과 4 의 정의는 그대로 살렸다.

근거는 `data/curated/glossary-master-v0.1.yaml` 의 `mission_refs[].context` 다.
용어마다 고유하고 정확하다(`hash-map: 키 저장 구조`, `load-factor: 0.75 초과 시 리사이징`).
R12 의 결함은 이 데이터를 읽지 않은 생성기 쪽에 있었다.

---

## E. Phase B — NEEDS_SMALL_FIX 143 → 전부 승격 (§10~11)

지난 회차는 **회차 인용의 정확성**만 봤다. 143건은 회차가 맞았으므로 "문장 하나만
바꾸면 되는" 것으로 분류됐다. 실제로 열어 보니 다른 결함이 있었다.

```
한 줄 설명    사용자가 자격 증명을 제시해 session이나 token을 받는 인증 시작 절차.
정확한 설명   사용자가 자격 증명을 제시해 session이나 token을 받는 인증 시작 절차.
              실제 적용에서는 신원, 권한, network 경계, 비밀값 보관 중 관련된 조건을
              구분해야 합니다.
              └─ 보안 분야 29개가 공유하는 꼬리
```

`정확한 설명` 이 `한 줄 설명` 을 그대로 되풀이한 뒤 분야 공통 꼬리 한 문장을 붙인
형태다. **143개 전부가 그렇다.** 앞 문장이 용어마다 달라서 문장 틀 검사에 걸리지 않았다.

정의가 비어 있는 것은 최소 수정으로 처리할 수 있는 결함이 아니므로 **전부
`NEEDS_REWRITE` 로 승격**했다(§11 이 허용하는 재판정).

| 묶음 | 수 | 분야 |
| --- | --- | --- |
| 2 | 29 | 보안 (M05 배포 · M07 점검 · M13 로그인) |
| 3 | 29 | 데이터베이스 (M11 설계·SQL · M12 · M13) |
| 5 | 29 | Linux/OS (M07 자가 점검 · M08 원인 찾기) |
| 6 | 28 | Network·Backend (M05 AWS · M12 FastAPI) |
| 7 | 28 | Git (M04 협업 · M06 변경 수집) |

---

## F. 범위를 넓힌 이유 — CONTENT_OK 73건

E 절의 결함을 찾은 검사를 518개 전체에 돌리니 **지난 회차에 `CONTENT_OK` 로
분류된 문서 73개**도 같은 형태였다.

| 분야 | 수 | 공유 꼬리 |
| --- | --- | --- |
| Git | 18 | `local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다` |
| Linux/OS·Network | 18 | `실제 장애 판단에서는 값의 순간 변화와 지속 상태…` |
| 보안 | 11 | `실제 적용에서는 신원, 권한, network 경계…` |
| ORM·데이터 | 13 | `설계와 실행에서는 값의 형태, 관계, 제약…` |
| 배포 플랫폼 | 9 | `network boundary, address, port, route…` |
| 기타 | 4 | — |

**계획한 260 을 넘는 범위다.** 그럼에도 고친 이유는 하나다. 기준을 만들어 두고
그 기준에 걸리는 것을 "이번 범위가 아니다"라고 남기면 기준이 의미를 잃는다.

---

## G. 브라우저가 잡은 것 (§18)

자동 검사가 전부 통과한 뒤 화면을 열었다. **가장 큰 결함이 여기서 나왔다.**

### G-1. `이 미션에서는 왜 필요한가` 절이 화면에 나가지 않고 있었다

```
화면 (수정 전)                          데이터 (glossary.json)
─────────────────────────────           ─────────────────────────────
이 미션에서는 왜 필요한가                missionContext:
  본과정 M09                              "이 회차에서 만드는 저장소 자체가
  키 저장 구조                             해시맵입니다. 키를 순서대로 훑지 않고
  ↑ mission_refs 의 짧은 문구만            계산 한 번으로 자리를 정하기 때문에…"
                                          ↑ 렌더링되지 않았다
```

`App.tsx` 가 같은 제목 아래에 `missionRefs` 만 찍고 `missionContext` 는 한 번도
쓰지 않았다. **이번 Cycle 에서 가장 많이 다시 쓴 절이 학습자에게 닿지 않던 셈이다.**
앞 Cycle 에서 "missionContext 는 렌더링되지 않는다"를 확인하고도 그것이 이번 작업의
전제와 충돌한다는 것을 연결하지 못했다.

제목 아래에 본문을 먼저 내보내고 회차 문구는 그대로 두도록 고쳤다.

### G-2. 빈 제목 220건

`흔한 오해` 114건, `동료평가 질문` 106건이 내용 없이 제목만 찍혔다. 같은 파일의
다른 절(`주의할 점`, `비슷한 개념과의 차이`)은 이미 조건이 걸려 있었으므로 같은
방식으로 맞췄다.

### G-3. 분야별 확인

Web(`accessibility-a11y`, `useeffect`) · 보안(`csrf`) · 데이터베이스(`left-join`) ·
Linux(`out-of-memory`) · AI(`convolution`) · Git(`force-push`) · 알고리즘(`hash-map`) —
본문·코드 예·오해·질문이 모두 정상 렌더링된다.

---

## H. 학습자 읽기 표본 (§19)

분야별 20개를 뽑아 미션 문서 없이 읽었다. 전부 이해 가능했다.

```
deque      앞문과 뒷문이 모두 열린 줄이다.
           양쪽 끝에서 넣고 빼는 일이 모두 O(1)이라, 큐가 필요한 곳에 리스트 대신 씁니다.
           파이썬 리스트는 맨 앞에서 빼면 나머지를 전부 한 칸씩 당기므로 O(n)이 되는데,
           이 차이가 항목 수가 많아질 때 드러납니다.

localhost  지금 명령을 실행하고 있는 그 컴퓨터 자신을 가리키는 이름입니다.
           여기서는 되는데 밖에서 안 된다면 원인이 서비스가 아니라 네트워크 쪽이라는
           것이 이 한 번의 확인으로 갈립니다.
```

회차 번호 없이 `이 회차` 로만 쓴 문장이 있지만, 화면에서는 바로 아래에 회차 칩이
붙으므로 문제되지 않는다(G-3 에서 확인).

---

## I. EX03 감사 (§15)

`data/reviews/ex03-map-reason-audit.json` — **감사만 했다.** 원본은 동결 자료이고
수정은 Owner Gate 사안이다.

등록 당시 기록된 "최소 9건"은 표본이었다. 화면에 실제로 닿는 것(learn-first 관계에
붙은 map 출처 `reason`)은 **54건**이다.

| 판정 | 수 |
| --- | --- |
| `REASON_OK` | 40 |
| `GENERIC_REASON` | 10 |
| `CONTEXT_MISMATCH` | 4 |

**CONTEXT_MISMATCH 4건은 reason 이 관계를 정면으로 부정한다.**

```
term:process-id -is_a-> term:process
  "PID는 process 자체가 아니라 process에 부여된 식별자다."
  → is_a 를 부정하는 문장이 is_a 의 근거로 화면에 나간다

term:default-route-any-ipv4 -is_a-> term:route-table
  "default route는 route table 안의 한 route rule이다."
  → 규칙은 표의 한 종류가 아니라 구성 요소다

term:weight -based_on-> term:ai-model     "model은 learned weight parameter를 포함한다"
term:layer  -based_on-> term:docker-image "image는 build layer들로 구성될 수 있다"
  → 둘 다 관계와 반대 방향을 설명한다
```

`GENERIC_REASON` 10건은 관계를 영어로 다시 말할 뿐이다 — "BFS는 graph traversal
strategy다", "LRU는 cache eviction policy다".

CONTEXT_MISMATCH 4건은 문장 교체로 끝나지 않고 **관계 자체를 다시 봐야** 한다.

---

## J. 생성 데이터 동기화 (§16~17)

새 자동화를 만들지 않고 기존 규칙을 문서에 유지했다.

```bash
npm run data:build        # 마크다운을 고쳤으면 반드시
npm run content:integrity # 미션 문맥 모순
npm run content:specificity
npm run content:quality
```

앞 Cycle 에서 "마크다운만 고치고 재빌드를 안 하면 화면이 옛 글을 보여 준다"를 이미
규칙으로 적어 두었고 이번에는 걸리지 않았다.

---

## K. 최종 분류 (§20)

`data/reviews/content-quality-baseline.json` · `npm run content:quality`

| 분류 | 수 | 무엇인가 |
| --- | --- | --- |
| `CONTENT_OK` | **340** | 기계 검사를 전부 통과 |
| `NEEDS_MINOR_EDITORIAL` | **145** | 대부분 본문의 백틱이 화면에 글자로 보이는 것 |
| `NEEDS_MANUAL_REVIEW` | **33** | 회차의 요구 사항을 단정하는 문장. 미션 원문과 대조 필요 |
| `CONFIRMED_DEFECT` | **0** | — |

지난 회차 분류에서의 이동:

```
NEEDS_SMALL_FIX → CONTENT_OK              108
NEEDS_REWRITE   → CONTENT_OK               79
CONTENT_OK      → NEEDS_MINOR_EDITORIAL   103   ← 기준이 엄격해져서 드러난 것
NEEDS_REWRITE   → NEEDS_MINOR_EDITORIAL    26
NEEDS_SMALL_FIX → NEEDS_MANUAL_REVIEW      19
```

**애매한 문서를 숫자를 맞추려고 OK 로 넘기지 않았다.** `NEEDS_MINOR_EDITORIAL` 이
145건으로 남은 것이 그 결과다.

### 백틱 145건에 대해

평문으로 렌더링되는 필드에 백틱이 그대로 보인다. 이 관례는 이번 Cycle 이 만든 것이
아니다 — RC1 시점에 **359건**이었고 지금 **154건**이다(문서 기준). 줄었지만 남아 있다.

고치려면 빌드에서 걷어내거나 렌더러를 바꿔야 하는데 둘 다 View 결정이 따르므로
이번 범위에서 판단하지 않았다.

---

## L. 지표

| 항목 | Cycle 시작 | Cycle 종료 |
| --- | --- | --- |
| 공유 문장 틀을 가진 용어 | 329 | **0** |
| 정확한 설명이 한 줄 설명을 되풀이(꼬리 공유) | 212 | **0** |
| 코드 예 — 자리 표시(용어 이름만) | 42 | **0** |
| 코드 예 — 작성 | 349 | **466** |
| 코드 예 — 없음 | 127 | **52** |
| 고유 `왜 필요한가` 본문 | 266 | **518** |
| 템플릿 무리 | 8 (최대 46) | **0** |
| 미션 문맥 모순 | 0 | **0** |
| `CONFIRMED_DEFECT` | 0 | **0** |

`코드 예 — 없음` 52건은 결함이 아니다. `가용성`, `기술 부채` 같은 개념에 억지 코드를
붙이면 없는 것보다 나쁘다(§14).

시작 지점 수치는 고친 도구로 다시 쟀다. 작업 중에 쓰던 길이 기준(45자 미만이면
자리 표시)으로는 자리 표시가 222개로 잡혔지만, 그중 대부분은 `chmod 640 secrets.txt`
처럼 짧아도 제 몫을 하는 예제였다. 실제 자리 표시 — 블록에 용어 이름만 들어 있던 것 —
는 **42개**였다. C 절에 적은 두 번째 도구 결함이 이것이다.

---

## M. 회귀 (§22)

| 검사 | 결과 |
| --- | --- |
| 단위 테스트 | **60 PASS** |
| Playwright | **22 PASS** (`python scripts/qa_playwright.py`, 포트 6421) |
| `glossary:validate` | 519 · 0 error · 0 warning |
| `knowledge-map:validate` | 10/12 map · 2 cross-field layer |
| `atlas:validate` | 12 field · 519 term · 16 mission |
| `content:plan:validate` | 519 · 395 planned · 9 batch |
| `content:integrity` | 미션 문맥 모순 **0** · 템플릿 무리 **0** |
| `encyclopedia:validate` | 519 · 546 authored · 2874 derived · 0 error |
| `npm run build` | PASS |
| RC1 보호 영역 | `git diff glossary-rc1 -- data/curated data/knowledge-maps extension` **비어 있음** |

Encyclopedia 수치는 변동 없다 — authored edge 546 · path 166 · 선수학습 term 312.
콘텐츠만 고쳤고 그래프는 건드리지 않았다.

---

## N. 하지 않은 것

- **새 bulk regeneration script 를 만들지 않았다.** Sprint 7 생성기 9개는 여전히
  `CODYSSEY_ALLOW_CONTENT_REGENERATION` 없이는 돌지 않는다
- **같은 틀을 쓴다는 이유만으로 확인 없이 고치지 않았다.** 묶음마다 열어 보고
  `KEEP_GOOD_PARTS` / `FULL_REWRITE` 를 따로 정했다
- **숫자를 맞추려고 고치지 않았다.** `NEEDS_MINOR_EDITORIAL` 145건을 남겼다
- **ontology / graph / View / Node Model / Academic taxonomy 를 건드리지 않았다.**
  `App.tsx` 수정 두 곳은 이미 있는 필드를 내보내고 빈 제목을 막은 것이며 구조 변경이 아니다
- **EX03 원본을 고치지 않았다.** 감사까지만 했다
- **`glossary-rc1` 을 건드리지 않았다**

---

## O. 판정

**GLOSSARY_CONTENT_QUALITY_BASELINE_READY**

근거:

1. 518개 전부에 공유 문장 틀과 정의 되풀이가 없다
2. `CONFIRMED_DEFECT` **0**
3. 회귀 전부 통과, RC1 보호 영역 변경 없음
4. 남은 것(`NEEDS_MINOR_EDITORIAL` 145 · `NEEDS_MANUAL_REVIEW` 33)은 전부 기록됐고
   무엇을 해야 하는지가 적혀 있다

태그: `glossary-content-quality-v1`

### 다음에 할 일

1. **실제 학습자 검증** — 518개가 기준을 통과한다는 것과 학습자가 읽고 이해한다는
   것은 다른 말이다. 내부 검사는 여기까지가 한계다
2. `NEEDS_MANUAL_REVIEW` 33건을 미션 원문과 대조
3. 본문 백틱 154건 — 빌드에서 걷어낼지 렌더러를 바꿀지 결정
4. EX03 수정 (Owner Gate) — CONTEXT_MISMATCH 4건은 관계 자체를 다시 봐야 한다
