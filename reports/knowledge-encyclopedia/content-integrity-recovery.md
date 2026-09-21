# Content Integrity Recovery Cycle — 실행 기록

> 이력 문서다. 이후 상태 변화에 맞춰 소급 수정하지 않는다.
> 시작 기준: HEAD `a18e219` · canonical 519 · detailed 519
> 판정: **`CONTENT_INTEGRITY_RECOVERY_READY`**

---

## 1. RC1 정책 (§1)

`glossary-rc1` tag는 **건드리지 않았다.** 여전히 `b3437a4`를 가리킨다.

이번 Cycle의 콘텐츠 수정은 **Post-RC1 Content Maintenance**다. "RC1 diff 0"이라는 과거
개발 단계의 규칙은 당시 동결을 지키기 위한 것이었고, 지금은 그 동결 스냅샷을 보존한 채
main의 콘텐츠를 고치는 일이다. 둘은 다른 작업이다.

`content/terms/**`를 **92개 파일** 수정했다. RC1 스냅샷은 그대로다.

---

## 2. Generator — 원인을 먼저 찾았다 (§3~5)

### 2.1 위치와 정체

`scripts/implement_s7_b01_content.py` ~ `b09` — Sprint 7의 배치 생성기 9개가 519개 상세
콘텐츠를 만들었다. 각 스크립트는 term별 한 줄 정의를 담은 딕셔너리와 `render()` 함수를
갖고 있고, `content/terms/<id>.md`를 **`write_text`로 덮어쓴다.**

### 2.2 무엇이 잘못됐나

`b03`~`b09`가 **`이 미션에서는 왜 필요한가` 절을 분야마다 한 문장으로 고정**했다.

| 배치 | 분야 | 박아 넣은 회차 | 코드 예 |
| --- | --- | --- | --- |
| b03 | Security | M05·M07·M13 | text |
| b04 | Database / Data | **M11·M12** | **sql** |
| b05 | Linux / OS | M07·M08 | `ps aux` |
| b06 | Git | M04·M06 | `git status` |
| b07 | Server / Network | M05·M12 | `request → route → service` |
| b08·b09 | Algorithms·AI 등 | (회차 인용 없음) | — |

`b01`은 term마다 고유 문장을 들고 있어 **이 결함이 없다.** 분야 기본값을 박아 넣은 쪽이
문제였다. 그 분야 안에서 다른 미션에 속한 term이 문장을 그대로 물려받았고, 코드 예도
같은 스텁을 받았다.

### 2.3 판정: `ACTIVE_BUT_FIXABLE`

| 질문 | 답 |
| --- | --- |
| 생성기가 아직 active인가 | 실행 가능하다. 문법 오류 없이 돈다 |
| 다시 실행하면 덮어쓰는가 | **그렇다.** `write_text`로 조용히 덮어쓴다 |
| Mission ID가 하드코딩돼 있는가 | **그렇다.** 분야별 고정 문장에 회차가 박혀 있다 |
| 분야별 고정 예시 구조인가 | **그렇다.** 코드 예도 분야마다 하나다 |
| term-specific context를 읽는가 | b01만 읽는다. b03~b09는 읽지 않는다 |
| 수동 개선분을 날릴 위험이 있는가 | **있었다.** 이번에 고친 92개가 전부 사라진다 |
| build pipeline과 연결돼 있는가 | **아니다.** package.json·CI 어디에도 없다 |

### 2.4 조치 — 재생성이 아니라 재발 방지 (§6)

**전면 재생성을 하지 않았다.** 생성기 수정과 전면 재생성은 다른 일이다.

- `scripts/content_generation_guard.py` — 9개 생성기 입구에서 실행을 막는다.
  `CODYSSEY_ALLOW_CONTENT_REGENERATION=1` 없이는 돌지 않는다. **9개 전부 확인했다.**
- 왜 입구를 막았나: 9개 스크립트의 쓰기 방식이 제각각이라(`R`/`ROOT`, 조건부 경로,
  서로 다른 변수명) write 호출마다 문지기를 끼우면 깨지기 쉽다. 입구는 하나다.

---

## 3. Content Integrity Validator (§7)

`scripts/validate_content_integrity.py` (`npm run content:integrity`).
기존 validator 4종은 **구조**를 본다. R12를 하나도 잡지 못한 이유다 — 파일은 제자리에
있었고 형식도 맞았으며, 다만 내용이 다른 term의 것이었다.

| 심각도 | 검사 | 왜 이 심각도인가 |
| --- | --- | --- |
| **ERROR** | 미션 문맥 모순 | 사실이 틀렸다. 판단의 여지가 없다 |
| **WARNING** | 템플릿 재사용 | heuristic이다. 같은 분야가 비슷한 설명을 갖는 것은 자연스럽다 |
| **INFO** | 고정 예제 신호 | 개념을 설명하지 못하는 예제일 가능성을 알린다 |

기준선(`data/reviews/content-integrity-baseline.json`)을 둔다. 이미 아는 재사용을 매번
다시 보고하면 **새로 생긴 것이 묻힌다.** 늘어난 것만 보고한다.

입구 차단과 사후 검사를 함께 둔 이유: 입구만 막으면 "재생성해도 되는 상황"에서 같은
결함이 다시 들어온다. 사후 검사는 생성기뿐 아니라 손으로 고친 글까지 본다.

---

## 4. Phase A — 확정 79건 복구 (§8~10)

분야별 8개 batch로 나눠 처리했고, 각 batch 뒤에 validator를 돌렸다.

| batch | 분야 | 건수 | 남은 모순 |
| --- | --- | --- | --- |
| 1 | Git / Collaboration | 18 | 79 → 61 |
| 2 | Linux / OS | 15 | 61 → 46 |
| 3 | Security 11 · Network 4 · Programming 1 · Backend 1 | 17 | 46 → 29 |
| 4 | Data 9 · Container 5 | 14 | 29 → 15 |
| 5 | Database 7 · Server 8 | 15 | 15 → **0** |

**고쳐 쓴 근거는 `mission_refs[].context`였다.** 이 값은 term마다 고유하고 정확했다.
`base-image`의 "4.7 웹서버 베이스 또는 리눅스 베이스 선택",
`docker-attach`의 "4.6 exec와의 차이를 관찰·정리하라는 요구" 같은 것들이다.
결함은 이 데이터를 읽지 않은 생성기 쪽에 있었지 데이터에 있지 않았다.

**코드 예도 79건 전부 고쳤다.** 전부 `ps aux` · `SELECT * FROM example;` ·
`git status` · `request → route → service` 같은 스텁이었다. 개념을 설명하지 못하는
예제는 없는 것보다 나쁘다.

**주변 문장까지 다시 쓴 것은 주제 자체가 어긋난 9건뿐이다**(§8의 "최소 수정" 원칙).
`base-image`는 컨테이너 개념인데 문서 전체가 네트워크 라우팅을 설명하고 있었다.
나머지 70건은 잘못된 미션 문맥과 코드 예만 고쳤다.

---

## 5. Phase B — 273건 재판정 (§11~13)

### 5.1 근거를 먼저 모았다

회차 인용 유무로 갈렸다.

- **인용이 있는 5개 무리(143건)**: 그 회차가 실제 `mission_refs`와 겹치는지 전수
  확인했고 **전부 맞았다.** 예를 들어 Database 무리 29건 중 28건이 실제로 M11에
  등장한다. 사실이 틀린 것이 아니라 문장이 고유하지 않을 뿐이다.
- **인용이 없는 3개 무리**: "왜 필요한가"에 답하지 못한다. Web 무리의
  "현재 미션의 구현 요구에서 이 용어가 맡는 책임과 다른 단계의 경계를 확인합니다"는
  어느 term에 붙여도 말이 된다.

### 5.2 재판정 결과

| 상태 | before | after |
| --- | --- | --- |
| `CONTENT_OK` | 166 | **258** |
| `CONTENT_CONTEXT_MISMATCH` → `CONFIRMED_DEFECT` | 79 | **0** |
| `NEEDS_SMALL_FIX` (회차는 맞고 문장만 공유) | — | 143 |
| `NEEDS_REWRITE` (회차 인용 없음) | — | 117 |
| `NEEDS_MANUAL_REVIEW` | 130 | 0 (근거가 생겨 위 둘로 갈렸다) |

**143건을 자동 rewrite하지 않았다**(§12). 같은 템플릿을 썼어도 내용이 정확하다.

### 5.3 그중 13건은 이번에 고쳤다

`"AI·데이터 도구와 개발·운영 환경을 선택하고..."` 라는 문장이 **Docker Compose·데몬·
레지스트리·이미지 레이어** 같은 컨테이너 어휘와 **VSCode·패키지 관리자·트러블슈팅**
같은 개발 도구에 그대로 붙어 있었다. 회차를 말하지 않아 R12 검사에는 걸리지 않았지만
**같은 계열의 결함**이다.

---

## 6. 브라우저 QA가 잡은 것 (§15)

자동 검사를 통과한 뒤 실제 화면을 열어 보고 두 가지를 더 찾았다.

1. **고치지 않은 절이 본문과 정면으로 부딪히고 있었다.** `filter`의 본문은 NPU 패턴
   판별인데 `흔한 오해`는 "ORM이나 database 기능이…"였고 `관련 용어`는 `#SQL #table`
   이었다. 계약 검사로는 잡히지 않는다 — 회차를 말하지 않기 때문이다.
   → 복구한 92건 중 아직 템플릿을 공유하는 절을 전수로 보고, **분야가 맞는 것은 두고
   모순되는 것만** 고쳤다(흔한 오해·동료평가 질문 11건, 관련 용어 11건, 동작 원리 2건).
   Git term의 git 계열 주의사항처럼 분야가 맞는 공유는 건드리지 않았다.
   **고유하지 않은 것과 틀린 것은 다르다.**
2. **마크다운만 고치면 화면은 옛 글을 계속 보여 준다.** `glossary.json`을 다시 만들지
   않으면 아무것도 바뀌지 않는다. `npm run data:build`로 재생성했다. 브라우저 QA를
   자동 테스트 뒤에 두어야 하는 이유이기도 하다.

**확인한 대표 term**: `filter` · `label-normalization` · `base-image`(Container) ·
`csv`(Data) · `function`(Programming) · `tcp`(Network/System) — 미션과 설명이 맞고,
다른 term의 글을 복사한 느낌이 없으며, 예제가 개념을 설명하고, 내부 유지보수 문구가 없다.

---

## 7. Content Fingerprint (§14)

| 지표 | before | after |
| --- | --- | --- |
| 상세 문서 | 518 | 518 |
| 고유 '왜 필요한가' 본문 | 176 | **266** |
| 공유 무리 수 | 8 | 8 |
| 공유 term 수 | 350 | **260** |
| 최대 무리 크기 | 46 | 46 |
| 미션 문맥 모순 | **79** | **0** |

남은 8개 무리:

| 크기 | 회차 인용 | 분야 | 판정 |
| --- | --- | --- | --- |
| 46 | 없음 | Algorithms/DS · Programming | NEEDS_REWRITE |
| 42 | 없음 | Web | NEEDS_REWRITE |
| 29 | 없음 | AI / Hardware · Data | NEEDS_REWRITE |
| 29 | 있음 | Security | NEEDS_SMALL_FIX |
| 29 | 있음 | Linux / OS | NEEDS_SMALL_FIX |
| 29 | 있음 | Database | NEEDS_SMALL_FIX |
| 28 | 있음 | Git / Collaboration | NEEDS_SMALL_FIX |
| 28 | 있음 | Backend · Network · Server | NEEDS_SMALL_FIX |

**목표는 고유 본문 수를 늘리는 것이 아니다.** 정확성과 적합성이다. 46과 42 무리가
남아 있는 것은 실패가 아니라 "틀리지는 않았으나 고유하지 않다"는 상태가 명시적으로
관리된다는 뜻이다.

---

## 8. filter / U18 후속 (§17~18)

§17대로 자동 변경하지 않고 실제로 다시 검토했다.

| | before | after |
| --- | --- | --- |
| 학문 | `database-systems` | **`artificial-intelligence`** (secondary `programming-fundamentals`) |
| 학습 구조 판정 | `NO_PREREQUISITE_NEEDED` | 그대로 |

Coverage Completion Final에서는 "한 줄 정의가 일반적인 선택 처리이므로 데이터베이스
유지"로 결론지었다. **그때 함께 읽은 콘텐츠가 R12 결함이었다** — 실제 등장 미션이 아닌
M11·M12의 SQL 작업을 설명하고 코드 예도 `SELECT * FROM example;`이었다.

복구한 뒤 보면 이 사전에서 `filter`가 등장하는 미션은 예비 M03 하나뿐이고 거기서의 뜻은
"판별의 기준이 되는 본보기 격자"다. **데이터베이스 질의로 쓰는 미션이 하나도 없다.**

**ADR에 FD-12 후속으로 기록했다.** 남긴 교훈: *어긋난 콘텐츠를 근거로 이미 내린 결론은,
콘텐츠를 고친 뒤 다시 봐야 한다.* 79건을 근거로 삼았던 다른 판단이 있는지도 확인했고
`filter` 하나였다.

U17 baseline · learning coverage baseline · 나머지 FD는 **변경하지 않았다.**

---

## 9. Encyclopedia Regression (§16)

| 항목 | 결과 |
| --- | --- |
| node | new 0 · removed 0 · modified 3 (filter와 그 학문 2개) |
| authored edge | **변화 0** |
| learning path | 166 → 166 · changed 0 |
| 선수 관계 보유 term | 312 → 312 |
| mission closure | affected missions **0** |
| academic | database-systems 65→64 · artificial-intelligence 25→26 · 노출 상태 변화 0 |
| role | **변화 0** (active 8 / limited 2) |
| coverage baseline | review 100% · pre-authoring 78.5% · final 100% · unresolved 0 |
| unexpected | **0** |

derived edge가 2,879 → 2,874로 줄었다. 전부 `related`(관련 용어 11건 교정)와
`in_academic`(+1) 변화이며, **learn-first 관계는 하나도 바뀌지 않았다.**

---

## 10. UX Polish (§20~21)

### F01 — 학문 화면에서 관련 미션까지 스크롤이 길다

상단 요약의 "관련 미션 N개" 옆에 **바로 보기** 버튼을 두고 미션 섹션에 id를 주었다.
세 후보 중 가장 작은 것을 골랐다. route·데이터 변경 없음. HashRouter라 앵커 href를
쓸 수 없어 `scrollIntoView`로 처리했다.

### F02 — 헤더 메뉴 9개

**route를 하나도 지우지 않았다.** 사용자에게 보이는 메뉴만 6개로 줄였다.

```
before  대백과 · 미션 · 용어 · 선수학습 · 기술 지도 · 학문 · 직무 · 개념 연결 · 웹툰
after   학습하기 · 미션 · 용어 찾기 · 기술 지도 · 개념 연결 · 웹툰
```

선수학습·학문·직무는 **학습하기(`/encyclopedia`) 안의 진입 카드**로 옮겼다. 지난
Cycle에서 그 화면을 만든 목적이 정확히 그것이었다. label도 학습자 말로 바꿨다
(대백과 → 학습하기, 용어 → 용어 찾기).

**메뉴 수를 줄이는 것이 목적이 아니므로**, 헤더에서 뺀 세 곳이 한 클릭 안에 닿는지를
Playwright가 검사한다.

---

## 11. Learner Scenario (§22)

| Scenario | 판정 | 비고 |
| --- | --- | --- |
| A M13을 해야 하는데 무엇부터? | **PASS** | 홈 → 학습하기 → 미션부터 준비하기 → M13 |
| B Redis가 왜 자료구조와 연결되지? | **PASS** | 용어 → 먼저 볼 개념 → 시간복잡도·해시맵 사슬 |
| C 웹 개발을 어느 순서로? | **PASS** | 학습하기 → 기초부터 쌓기 → 웹 프로그래밍 |
| D 운영체제가 어느 미션과? | **PASS** | F01 해소. Playwright `toBeInViewport`로 확인 |
| E 백엔드 엔지니어는 뭘 공부하지? | **PASS** | |
| **F** 용어를 읽다가 어느 미션·학문과 연결되는지 | **PASS** | `base-image` → 먼저 볼 개념 / DevOps / 예비 M01 |
| **G** 처음 방문해서 웹 공부를 어디서 시작할지 | **PASS** | 홈 → 학습하기 → 기초부터 쌓기 → 웹 프로그래밍 (4클릭) |

**PASS 7 · FRICTION 0 · BLOCKED 0**

Scenario D는 브라우저 창이 렌더링되지 않아(`window.innerHeight = 0`) 창 안에서 스크롤
위치를 측정할 수 없었다. Playwright의 `toBeInViewport()`로 확인했고, 그 사실을 여기
적어 둔다.

---

## 12. 전체 QA (§24)

| 항목 | 결과 |
| --- | --- |
| glossary validator | 519 · 46 mission-local · **0 error / 0 warning** · 780 info |
| **content integrity** | 미션 문맥 모순 **0** · 새 경고 **0** |
| knowledge-map / atlas / content-tier validator | PASS / PASS / PASS |
| encyclopedia validator | 519 · 36 cluster · 546 edge · **0 error / 0 warning** |
| coverage review · baseline | PASS · 재생성 완료 |
| Impact Gate | unexpected **0** |
| 결정론적 출력 | 2회 재빌드 후 `encyclopedia-graph.json`·`glossary.json` byte 동일 |
| unit test | **60 passed** |
| Playwright | **22 passed** (21 → 22) |
| browser QA | 대표 term 6개 + Scenario A~G |
| production build / extension build | PASS / PASS |
| `glossary-rc1` tag | **불변** (`b3437a4`) |

---

## 13. R12 Closure (§19)

| 조건 | 결과 |
| --- | --- |
| `CONTENT_CONTEXT_MISMATCH = 0` | ✅ 79 → 0 |
| 알려진 템플릿 오염 중 미해결 = 0 | ✅ 분야가 어긋난 13건도 함께 해소 |
| generator 재발 위험 통제 | ✅ 9개 전부 입구 차단 + 사후 전수 검사 |
| content integrity validator 가동 | ✅ `npm run content:integrity` |
| manual-review 잔여가 명시적으로 알려짐 | ✅ NEEDS_SMALL_FIX 143 · NEEDS_REWRITE 117, term 단위로 기록 |

`NEEDS_MANUAL_REVIEW`를 0으로 만들지 않았다. **불확실한 것을 억지로 PASS 처리하지
않는다**(§19). 대신 "왜 남았는지"가 term마다 적혀 있다.

---

## 14. Owner Gate 분류 (§23)

| 항목 | 분류 | 근거 |
| --- | --- | --- |
| **U14** SRE canonical 후보 5건 | `INDEPENDENT` | canonical 성장 판단이다. R12·UX 어느 쪽도 막지 않는다 |
| **U15** 컴퓨터구조 canonical 후보 5건 | `INDEPENDENT` | 같다 |
| **EX03** 동결 map의 `reason` 9건이 개발자용 영어 문장 | `INDEPENDENT` | R12와 **같은 계열**(텍스트 품질)이지만 출처가 다르다(`data/knowledge-maps`). 선수학습 화면의 읽기 품질을 떨어뜨리지만 막지는 않는다 |
| **R12 잔여** NEEDS_SMALL_FIX 143 · NEEDS_REWRITE 117 | `INDEPENDENT` | 사실이 틀린 것은 0이다 |
| F01 · F02 | **해소** | 이번 Cycle |

넷 다 이번 Cycle을 막지 않았으므로 Owner Gate backlog로 유지한다.

---

## 15. Release / Baseline (§25)

`glossary-rc1`은 **retag하지 않았다.**

기존 naming convention을 보면 tag가 "무엇이 끝났는지"를 이름으로 말한다.

```
glossary-rc1                        사전 콘텐츠 동결
encyclopedia-views-v1               View 4종 동작
encyclopedia-learning-baseline-v1   학습 구조 판정 완료
```

여기에 맞춰 **`glossary-content-integrity-v1`**을 제안하고 생성했다. 뜻은
"상세 콘텐츠의 미션 문맥 모순이 0이고, 그것을 되돌리는 생성기가 잠겨 있으며,
남은 품질 과제가 term 단위로 기록된 상태"다. 콘텐츠 신뢰성이 필요한 다음 작업이
되돌아올 지점이다.

---

## 16. 다음 권고 (§P)

콘텐츠 **신뢰성**은 회복됐다(사실 오류 0). 남은 것은 **고유성**이다 — 다른 문제다.

1. **NEEDS_REWRITE 117건이 먼저다.** 특히 Web 무리 42건의
   "현재 미션의 구현 요구에서 이 용어가 맡는 책임과 다른 단계의 경계를 확인합니다"는
   어느 term에 붙여도 말이 되는 문장이라 사실상 빈칸이다. 틀리지는 않았으나
   학습자에게 아무것도 주지 않는다
2. **NEEDS_SMALL_FIX 143건은 그다음.** 회차가 맞으므로 급하지 않고, 한 문장 교체로 끝난다
3. **실제 학습자 테스트.** 이번 Cycle까지의 QA는 전부 내부 검사였다. 복구한 글이
   실제로 이해에 도움이 되는지는 사람이 읽어 봐야 안다. 복구한 92건 중 분야별로
   골라 읽히는 것이 가장 값싼 검증이다
4. **EX03**을 R12와 같은 묶음으로 처리하는 것도 방법이다. 둘 다 "기계가 만든 설명문이
   학습자에게 닿는다"는 같은 문제다

새 ontology / enrichment cycle은 시작하지 않는다.

---

## 17. 커밋

| commit | 내용 |
| --- | --- |
| `029de7d` | 생성기 차단 + content integrity validator |
| `5ac4bca` | Phase A — 확정 79건 복구 |
| `daa33a8` | Phase B — 273건 재판정 · filter 재판정 · ADR |
| `ca8e2d5` | 브라우저 QA 후속 수정 · F01 · F02 |
