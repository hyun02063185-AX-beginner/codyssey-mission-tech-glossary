# Known Issues — Knowledge Encyclopedia V1 RC

> 기준 commit **`bf1a6aa`** + RC maintenance · 2026-09-24 · RC tag `encyclopedia-v1-rc1`
> **이 목록은 RC 시점에 남아 있는 것만 적는다.** 해결된 것은 여기 남기지 않고 보고서로 넘긴다.
> `release blocker` 열이 `예` 인 항목이 하나라도 있으면 RC 를 내지 않는다.

**현재 release blocker: 0건**

---

## 1. 데이터가 모자라 미루는 것

### KI-01 · Timeline View 없음

| | |
| --- | --- |
| severity | 낮음 |
| user impact | 기술의 발전 순서를 시간축으로 보는 화면이 없다. 다른 탐색 축(선수학습·학문·미션·직무)은 전부 있다 |
| workaround | 선수학습 지도가 "무엇을 먼저 보는가"를 대신 답한다 |
| release blocker | **아니오** |
| planned phase | `DEFERRED_FOR_DATA` — 데이터가 기준에 닿을 때 |

기준(`08-view-contracts.md` §5) 대비 현재: `evolved_from` **3**(≥15 필요) ·
길이 3 이상 사슬 **0**(≥4 필요) · 고립 pair **100%**(<40% 필요).
세 edge 가 서로 닿지 않아 서사가 만들어지지 않는다. **억지로 구현하지 않는다.**

### KI-02 · SRE · Computer Architecture canonical 없음

| | |
| --- | --- |
| severity | 낮음 |
| user impact | SLO·error budget·register·virtual memory 등 10개 개념을 사전에서 찾을 수 없다 |
| workaround | 없음. 해당 미션이 없으므로 학습 흐름을 막지 않는다 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE` · Owner Gate (U14 · U15) |

519개 전체 id 를 검색해 12개 후보가 **전부 부재**임을 확인했고 요구하는 미션도 없다.
`docs/13` 의 Candidate register 에 등록돼 있으며 **coverage 를 채우기 위해 추가하지 않는다.**

---

## 2. 사람이 해야 하는 것

### KI-03 · 실제 학습자 검증이 아직 없다

| | |
| --- | --- |
| severity | **중간** |
| user impact | 콘텐츠가 비전공 초심자에게 실제로 읽히는지 확인되지 않았다. 기준 문서(`09`)는 **가설**이다 |
| workaround | 없음. 준비는 끝나 있다 — Pilot 11 · 참여자 4명 · 읽기 18회 · 기록지 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE_CONTINUOUS_VALIDATION` |

가설 4종(첫 문장 역전 333 · 중간 난이도 · 문체 혼용 340 · 명사구 종결 349)은 전부 `UNJUDGED` 다.
**사람이 테스트하지 않았으므로 `LEARNER_CONTENT_MODEL_VALIDATED` 라고 선언하지 않는다.**
출시를 막지 않는 이유는, 검증되지 않았다는 것과 틀렸다는 것이 다르기 때문이다.

### KI-04 · Learner Feedback 을 받을 화면이 없다

| | |
| --- | --- |
| severity | 낮음 |
| user impact | 학습자가 "이 설명이 어렵다"를 제품 안에서 보낼 방법이 없다 |
| workaround | 유형 8종은 정의돼 있다. 출시 초기에는 사람이 직접 모은다 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE` |

### KI-05 · Mission Learning Bridge 가 문서로만 있다

| | |
| --- | --- |
| severity | 낮음 |
| user impact | 없다 — 학습자에게 보이는 기능이 아니다. 운영자가 손으로 절차를 따른다 |
| workaround | 계약 문서(`mission-learning-bridge.md`)의 단계를 수동으로 수행한다 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE` |

입력 경로·대기열·registry·화면 전부 없다. **절차가 먼저 서야 도구가 맞게 만들어진다.**

---

## 3. 탐색의 경계

### KI-06 · 분야 검색은 14개 분야까지다

| | |
| --- | --- |
| severity | 낮음 |
| user impact | `테스트` · `디버깅` · `모니터링` · `리팩터링` · `자동화` · `문서화` · `앱` · `서버리스` 처럼 **분야가 아닌 활동어**로 검색하면 0건이 나온다 |
| workaround | **막다른 길이 아니다.** 0건 화면이 전체 용어·기술 지도·학습 지도·미션별 보기 4개 경로를 준다 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE` — 실제로 들어오는 `CANNOT_FIND_TERM` 을 보고 판단 |

분야 검색은 glossary 의 category 14개에 한국어 입력어를 붙인 것이다.
사전에 Testing 분야가 없는데 `테스트` 를 어딘가에 억지로 매달면 **없는 것을 있는 것처럼 보이게 된다.**
그래서 0건을 0건이라 말하고 길만 준다. 표본 20개 중 12개가 결과를 냈고 8개가 0건이었다.

### KI-07 · Chrome Extension 검색에는 한국어 분야 검색이 없다

| | |
| --- | --- |
| severity | 낮음 |
| user impact | 사이드패널에서 `보안` 을 쳐도 분야로는 찾아지지 않는다. 용어 이름 검색은 정상 |
| workaround | 웹 사전을 쓴다. Extension 은 M01 동료평가용 빠른 조회 도구다 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE` |

`extension/**` 은 RC1 보호 영역이라 이번에 바꾸지 않았다.

---

## 4. 다듬을 것

### KI-08 · 분야 필터 라벨이 영문이다

| | |
| --- | --- |
| severity | 낮음 |
| user impact | 필터의 분야 14개가 `Linux / OS` · `Algorithms / Data Structures` 처럼 영문으로 보인다 |
| workaround | **검색이 한국어를 받으므로 필터에 의존할 일이 줄었다** |
| release blocker | **아니오** |
| planned phase | `V1_OPTIONAL` |

### KI-09 · 웹툰 이미지가 10개 중 5개다

| | |
| --- | --- |
| severity | 낮음 |
| user impact | 후속 후보 5건은 제목·개념만 있고 그림이 없다. 화면에 `이미지 준비 중` 으로 표시된다 |
| workaround | 용어 페이지의 설명이 이어진다 |
| release blocker | **아니오** |
| planned phase | `V1_OPTIONAL` |

### KI-10 · 콘텐츠 문체가 균일하지 않다

| | |
| --- | --- |
| severity | 낮음 |
| user impact | 문서마다 존댓말·평서체가 섞이고 첫 문장 구성이 다르다 |
| workaround | 없음. 의미·정확성 결함은 0건이다 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE` — **KI-03 이후에 판단한다** |

문체 혼용 340 · 첫 문장 역전 333 · 명사구 종결 349 는 **검토 후보 수치이지 결함 판정이 아니다.**
사람 검증 없이 일괄 수정하면 되돌릴 수 없는 변경이 된다.

---

## 5. 운영

### KI-11 · CI 가 테스트를 돌리지 않는다

| | |
| --- | --- |
| severity | **중간**(운영) |
| user impact | 없다 — 다만 테스트가 깨진 상태로 배포될 수 있다 |
| workaround | 로컬에서 `npm run test` 와 `python scripts/qa_playwright.py` 를 돌린다. RC 는 전부 통과 확인 |
| release blocker | **아니오** |
| planned phase | `V1_OPTIONAL` |

`.github/workflows/deploy-pages.yml` 은 `npm ci` + `npm run build` 만 한다.

### KI-12 · vitest 의존성에 moderate 취약점 2건

| | |
| --- | --- |
| severity | 낮음 |
| user impact | **없다.** `vitest` / `@vitest/mocker` 는 개발 의존성이며 배포 번들에 들어가지 않는다 |
| workaround | 없음. 수정하려면 vitest 메이저 업그레이드(breaking)가 필요하다 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE` |

`npm audit`: `GHSA-82fw-gwwq-j7x9` (Path Traversal, moderate) · `npm audit fix --force` 는 vitest 5 로 올린다.

---

## 6. 동결 원본에서 온 것

### KI-13 · Owner Gate 대기 5건

| | |
| --- | --- |
| severity | 낮음 |
| user impact | U13 만 화면에 보인다 — 축약 한국어 표기(`MEM`·`CPU`·`OOM`·`session`)가 그대로 노출된다 |
| workaround | 의미를 해치지 않는다. 맥락에서 읽힌다 |
| release blocker | **아니오** |
| planned phase | `POST_RELEASE` · 전부 `INDEPENDENT` — 서로 막지 않는다 |

U8(중복 yaml) · U13(축약 표기) · U14(SRE) · U15(컴퓨터구조) · U16(devops 방향).
`data/encyclopedia/upstream-registry.json` 에 defect 7건이 기록돼 있다.

### KI-14 · 동결 map 이 쓴 learn-first reason 41건

| | |
| --- | --- |
| severity | 낮음 |
| user impact | 선수학습 화면의 이유 문장 일부가 지도 원본에서 온 것이다 |
| workaround | 없음. **감사에서 전부 `REASON_OK` 이거나 Swap Test 통과라 그대로 둔 것**이다 |
| release blocker | **아니오** |
| planned phase | 조치 없음 |

화면에 닿는 learn-first reason 335건 중 41건이 map 출처이고, 13건은 Encyclopedia 층에서 교정했다
(`map-edge-corrections.json`). 내부 어휘 누출은 **0건**이다.

---

## 이 목록에 없는 것

**Windows 콘솔 인코딩 문제는 RC QA 에서 고쳤으므로 Known Issue 가 아니다.**
`content:quality` · `content:specificity` 를 비롯한 QA 도구 5개가 cp949 콘솔에서 멈추던 문제이며,
출력 스트림만 utf-8 로 고정했다. 회귀 검사는 `npm run qa:console` 이 막는다.
자세한 내용은 [`v1-rc-qa.md`](../../reports/knowledge-encyclopedia/v1-rc-qa.md) §B.
