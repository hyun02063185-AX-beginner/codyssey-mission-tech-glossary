# V1 Final Release Decision & Closeout

> 2026-09-24 · 시작 HEAD **`532fd12`** · branch `main` · working tree clean · origin 동기
> RC source **`encyclopedia-v1-rc1`** → Release **`encyclopedia-v1`**
> 이번 작업은 결정이다. **새로운 수정을 하지 않았다.**

**판정: `KNOWLEDGE_ENCYCLOPEDIA_V1_RELEASED`**

---

## A. 시작 상태

저장소에서 직접 읽었다.

```
branch    main (clean · origin/main 과 동기)
HEAD      532fd12  docs(encyclopedia): validate V1 as a release candidate
describe  encyclopedia-v1-rc1        ← HEAD 가 RC tag 그 자체다
RC tag    encyclopedia-v1-rc1 → 532fd12   (일치 확인)
remote    origin  https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary
```

---

## B. RC 이후 Delta

```
git diff --stat encyclopedia-v1-rc1..HEAD   →   변경 파일 0
git log --oneline encyclopedia-v1-rc1..HEAD →   commit 0
```

**RC 이후 아무것도 바뀌지 않았다.** 분류할 변경 자체가 없다 —
documentation · release metadata · product/source · generated-data · test/tool 어디에도 delta 가 없다.

따라서 RC QA 결과를 Final Release 근거로 **그대로 재사용한다.**
clean-build 전수 QA 를 처음부터 반복하지 않고, 대신 §D 의 critical smoke 를 수행했다.
**검증하지 않은 product 변경 위에 final tag 를 올리지 않는다** — 올릴 변경이 없었다.

---

## C. RC Evidence 검토

`reports/knowledge-encyclopedia/v1-rc-qa.md` 를 **읽어서** 각 항목의 근거가
실제로 기록돼 있는지 확인했다. 대화 내용으로 숫자를 다시 쓰지 않았다.

| 항목 | RC report 의 근거 |
| --- | --- |
| clean build | §C — 생성물 전부 삭제 후 재생성 → **byte-identical** |
| deterministic generated data | §D — glossary · encyclopedia-graph · field-search · dist-extension **drift 0** |
| web build | §C — `npm run build` PASS |
| extension build | §C — `npm run build:extension` PASS |
| unit | §F — **82 PASS** |
| Playwright | §F — **31 PASS** · 안전 포트 6421 · 대상 앱 확인 |
| browser QA | §G — route 17/17 · 네 단계 흐름 |
| mobile QA | §J — 375px 화면 15개 · 페이지 overflow **0** |
| Scenario A–J | §H — **PASS 10 · FRICTION 0 · BLOCKED 0** |
| search regression | §I — 질의 16개 · 이름 우선 · 결과/순서 불변 |
| display boundary | §K — route 21개 × 패턴 7종 · **누출 0** |
| RC1 protection | §L — 보호 영역 diff 비어 있음 · `glossary-rc1` 이동 없음 |
| Known Issues | §P 및 `known-issues.md` 로 연결 |
| release notes | **§ 어디에도 인용 없음** — 아래 참고 |

### 한 가지 기록해 둘 것

RC QA report 가 **`release-notes-v1.md` 를 인용하지 않는다.** 파일은 그때 만들어져
저장소에 있고 `00-project-status.md` 가 가리키고 있으므로 산출물이 빠진 것은 아니고,
RC report 안에서 그 산출물을 짚지 않았을 뿐이다.

**과거 report 를 고치지 않는다**(소급 수정 금지). 대신 이 closeout 이 연결을 잇는다 —
Release Notes 는 [`release-notes-v1.md`](../../docs/knowledge-encyclopedia/release-notes-v1.md) 이며
이번에 정식 릴리스 상태로 확정했다(§I).

---

## D. Critical Smoke

RC 이후 product 변경이 0 이므로 §11 기준으로는 Playwright 전체 재실행이 필수가 아니다.
그래도 돌렸다 — **release tag 에 적는 숫자는 물려받은 것이 아니라 방금 확인한 것이어야** 한다.

| 검사 | 결과 |
| --- | --- |
| unit | **82 PASS** / 5 파일 |
| `npm run build` | PASS |
| `npm run build:extension` | PASS |
| `glossary:validate` | 519 canonical · 46 mission-local · **0 error / 0 warning** · 780 info |
| `encyclopedia:validate` | 519 term · 546 authored · 2,874 derived · **0 error / 0 warning** |
| `atlas:validate` · `knowledge-map:validate` | PASS · PASS |
| `content:integrity` | PASS (미션 문맥 모순 0) |
| `content:quality` | PASS (CONFIRMED_DEFECT 0) |
| `qa:console` | **9/9 PASS** (cp949 강제) |
| **Playwright 전체** | **31 PASS** (16.1s) |
| generated data drift | **0** — 모든 검사 후 `git status` clean |

### 브라우저 smoke — 네 단계 흐름

| 단계 | 확인 |
| --- | --- |
| 들어온다 | `#/encyclopedia` · 링크 33 |
| 찾는다 | `보안` 52행 / `API` 11행 / 없는 말 0행 + **회복 링크 4** |
| 이해한다 | `#/terms/tcp` 렌더 · 나가는 길 9 |
| 다음으로 간다 | 선수학습 · 학문 · 미션 · 직무 · 지도 **5방향 전부 도달** |

---

## E. Live Deployment

배포는 **tag 기반이 아니라 `main` 기반**이다. 이 사실을 문서에 남긴다.

```
.github/workflows/deploy-pages.yml   on: push → branches: [main]
GitHub Pages                          build_type: workflow · source: main /
URL                                   https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/
```

즉 `encyclopedia-v1` tag 를 붙이는 것이 배포를 일으키지 않는다.
**지금 라이브에 떠 있는 `532fd12` 가 곧 이 tag 의 제품 내용**이다.
release commit 이 그 위에 더한 것은 릴리스 문서뿐이라 화면은 달라지지 않는다(§M).

| 확인 | 결과 |
| --- | --- |
| 최신 commit 배포 여부 | `532fd12` **completed / success** (2026-09-23T15:46Z) |
| homepage 접근 | **정상** — `코디세이 기술용어 사전` |
| Encyclopedia 진입 | **정상** — `#/encyclopedia` 링크 33 |
| deep link (HashRouter) | **정상** — `#/terms?q=보안` 52행 · `#/terms/tcp` · `#/prerequisites/redis` · `#/academic/operating-systems` · `#/roles/backend-engineer` 전부 로컬과 같은 결과 |
| 0건 회복 경로 | **정상** — 라이브에서도 링크 4개 |
| 주소로 직접 진입(새로고침) | **정상** — `…/#/terms?q=운영체제` 50건 |
| 다른 프로젝트와 충돌 | **없음** |

충돌이 없는 이유는 구조적이다. 계정의 Pages 프로젝트 8개가 각자 `/<repo>/` 경로를 쓰고,
이 저장소는 `/codyssey-mission-tech-glossary/` 만 차지한다.
`vite.config.ts` 의 `base: './'` 라 자산 경로도 상대경로다.
실제로 이웃 프로젝트 `Cody-Stat` 을 열어 **정상 동작**을 확인했다.

> 브리프의 `/world` 는 이 계정에 없다. 확인하지 않은 것을 확인했다고 쓰지 않는다.

---

## F. Final Release Blocker Gate

| 조건 | 결과 |
| --- | --- |
| Release Blocker | **0** |
| V1_REQUIRED Remaining | **0** (40/40) |
| Critical Regression | **0** — unit 82 · Playwright 31, 둘 다 감소 없음 |
| Known Semantic Defect | **0** — validator 0/0 · 미션 문맥 모순 0 · CONFIRMED_DEFECT 0 |
| Broken Route | **0** — 17/17 (로컬) · 8/8 (라이브 대표) |
| Generated Data Drift | **0** |

**여섯 조건 전부 충족.**

§15 의 tag 조건도 같이 본다 — RC evidence valid ✓ · blocker 0 ✓ · remaining 0 ✓ ·
**RC 이후 미검증 product delta 없음** ✓ · working tree clean ✓.

---

## G. Known Issues 14건 최종 확인

전수로 다시 읽고 필드를 검사했다. 필수 6개 필드(ID · 내용 · severity · user impact ·
workaround · release blocker · planned phase)가 14건 전부에 있다.

```
release blocker = 예    0건
release blocker = 아니오  14건
```

**해결된 것이 목록에 남아 있지 않은지** 실제 저장소로 확인했다.

| | 확인 방법 | 여전히 유효 |
| --- | --- | --- |
| KI-07 Extension 분야 검색 없음 | `extension/sidepanel.js` 가 `termKo`·`termEn`·`aliases` 만 본다 (`category` 0회) | ✓ |
| KI-08 필터 라벨 영문 | category 14개 전부 영문 | ✓ |
| KI-09 웹툰 이미지 | `hasImage` **5 / 10** | ✓ |
| KI-11 CI 에 테스트 없음 | `deploy-pages.yml` 에 `npm run test` **0회** | ✓ |
| KI-12 vitest 취약점 | `npm audit` moderate 2건 | ✓ |

**Known Issue 수를 줄이려고 이번에 고치지 않았다.**
RC 에서 해결한 Windows 콘솔 인코딩 문제는 목록에 없다 — 목록은 현재 상태를 말해야 한다.

---

## H. V1 Scope Freeze

실제 구현 기준으로 고정한다.

### 포함

| 영역 | 내용 |
| --- | --- |
| Glossary | canonical **519** · 상세 **519** · 코드 예 466 |
| Search / Filters | 이름·별칭 검색 · **한국어 분야 검색**(14 분야 · 입력어 65) · 필터 6종 · **0건 회복 경로** |
| Term Detail | 절 10개 · 미션 맥락 · 흔한 오해 · 동료평가 질문 |
| Encyclopedia Home | `#/encyclopedia` — 네 축으로 분기 |
| Prerequisite | 선수 관계 보유 term **312 / 519** · path 166 |
| Mission | 미션 **16** · 직접/필요/확장 3분류 · 지도 오버레이 18 |
| Academic | 학문 14 (노출 **13**) |
| Role | 직무 10 (노출 **8**) |
| Learning Paths | 계산 경로 166 · 근거 있는 인접 단계만 |
| Technology Atlas / Knowledge Map | 분야 지도 **10** + cross-field layer 2 · registry 12 |
| Concept Connections | **6건** |
| Open-book | M01 · 요구사항 11 · quick term 23 |
| Chrome Extension | **0.4.2** (manifest v3 · sidePanel) |
| Cross-view navigation | 지도 노드 → 용어·선수학습·학문·미션 4방향 · 용어 → 지도 |
| responsive / deep-link / browser navigation | 375px overflow 0 · HashRouter deep link · 뒤로/앞으로 |

### 포함하지 않는 것 — 미완성 기능이 아니다

| 구분 | 항목 |
| --- | --- |
| **Post-release** | 실제 교육생 Human Calibration · 지속적 readability/comprehension feedback · Mission Learning Handoff 실제 운영 · Feedback UI 여부 검토 · Open-book 확장 |
| **Deferred for Data** | Timeline (`evolved_from` 3 / 기준 15 · 사슬 0 / 기준 4 · 고립 100% / 기준 40% 미만) |
| **Growth Candidate** | SRE · Computer Architecture (Owner Gate U14 · U15) |
| **Drop Candidate** | AI 챗봇 · 추천 엔진 · 학습 점수/레벨/진도 · 퀴즈 · 게이미피케이션 |

**새 backlog 아이디어를 이번에 추가하지 않았다.**

---

## I. Release Notes

[`docs/knowledge-encyclopedia/release-notes-v1.md`](../../docs/knowledge-encyclopedia/release-notes-v1.md)
를 **정식 릴리스 상태로 확정**했다.

- 머리말을 `Release Candidate` → **정식 릴리스 `encyclopedia-v1`** 으로 바꾸고
  **배포가 tag 가 아니라 `main` 을 따라간다**는 사실을 적었다
- 미션 ↔ 용어의 양방향 이동을 한 문단 보강했다 (§13 의 "Mission 과 어떻게 연결되는가")
- 나머지는 그대로다 — 사용자 중심이고 내부 Sprint history 가 본문에 없다
- **`아직 없는 것`** 절을 유지했다. 연표 · 학습자 검증 · 피드백 버튼 · SRE/컴퓨터구조 ·
  분야어가 아닌 검색을 그대로 적는다. **과장하지 않는다**

---

## J. Human Validation

`POST_RELEASE_CONTINUOUS_VALIDATION` **유지**. 자산이 보존돼 있음을 데이터로 확인했다.

| 보존 대상 | 상태 |
| --- | --- |
| Pilot | **11건** |
| learner test set | **9개** (basic 1 · mid 5 · hard 3 · 도메인 9) |
| cross allocation | **P1~P4 · 읽기 18회** |
| observation schema | RESTATE · WHY · UNKNOWN_WORDS · CONFUSION_POINT · EXAMPLE_HELPED · OBSERVER_NOTE |
| CURRENT / PROPOSED | 비교본 생성물 유지 (`glossary.json` 에서 읽는다) |
| 4 hypotheses | 전부 **`UNJUDGED`** · observations **0** · status `NOT_YET_RUN` |

> **`LEARNER_CONTENT_MODEL_VALIDATED` 라고 쓰지 않는다.**
> 릴리스했다는 것과 사람이 읽고 이해했다는 것은 다른 말이다.
> Release Notes 에도 그렇게 적혀 있다.

---

## K. Mission Learning Bridge

V1 **운영 정책에 포함**된다. 기능이 아니다.

| | |
| --- | --- |
| 자동 ingestion | **아님** |
| UI | **아님** |
| Handoff 의 지위 | **Learning Evidence Source** — 결론이 아니라 검토 시작 근거 |
| User Approval Gate | **필수** · Candidate 등록 앞에 선다 |
| `NEW_CANONICAL` 자동 생성 | **금지** · 8종 판정 중 마지막 선택지이며 `docs/13` 절차로 넘긴다 |

앞으로 실제 Mission 수행과 함께 **사람이 절차를 밟아** 운영한다.

---

## L. Final Release Definition

기능 개수가 아니라 사용자 흐름으로 고정한다.

```
들어온다  →  찾는다  →  이해한다  →  다음으로 간다
   ✅          ✅          ✅            ✅
```

네 단계 모두 로컬과 **라이브 배포본** 양쪽에서 확인했다(§D · §E).

---

## M. Release Tag

```
encyclopedia-v1  →  release commit   (annotated)
```

**제품 상태는 RC 와 완전히 같다.** release commit 이 RC 위에 더한 것은
릴리스 문서 세 건(Release Notes 확정 · 상태 문서 · 이 보고서)뿐이고
`src` · `content` · `data` · `scripts` · 생성물은 **한 줄도 다르지 않다**
(`git diff encyclopedia-v1-rc1..HEAD -- src content data scripts` 가 비어 있다).
그래서 라이브에 떠 있는 `532fd12` 가 곧 이 tag 의 제품 내용이다.

기존 tag 6개는 **이동시키지 않았다.**

| tag | commit | 의미 |
| --- | --- | --- |
| `glossary-rc1` | `b3437a4` | 사전 동결 기준 (불변) |
| `encyclopedia-views-v1` | `98b3edd` | View 4종 구현 |
| `encyclopedia-learning-baseline-v1` | `b50ec6e` | 학습 coverage 판정 |
| `glossary-content-integrity-v1` | `d777bc7` | 미션 문맥 모순 0 |
| `glossary-content-quality-v1` | `0e84fe1` | 콘텐츠 품질 기준선 |
| `encyclopedia-v1-rc1` | `532fd12` | 출시 후보 · **검증된 제품 상태** |
| **`encyclopedia-v1`** | **release commit** | **공식 release baseline** (제품은 `532fd12` 동일) |

RC 와 Release 의 **제품 내용이 같은 것은 RC 이후 제품 변경이 없었기 때문**이며,
둘은 서로 다른 의미를 가진 별개의 표식이다 — 하나는 "검증을 통과했다", 다른 하나는 "이것이 V1 이다".

### `encyclopedia-v1` 의 의미

Knowledge Encyclopedia 의 V1 **제품 기능 · 콘텐츠 품질 · 탐색 구조 · 학습 연결 · QA 기준**을
모두 통과한 공식 release baseline.

**프로젝트 종료가 아니다.** 이후 작업은 `V1.x Continuous Improvement` 로 관리한다.

---

## N. Post-release 운영 구조

V1 이후 변경은 **네 가지 입력**으로만 시작한다.

| 입력 | 무엇인가 |
| --- | --- |
| **Mission Learning Bridge** | 실제 Mission 에서 형성된 학습 경험 (§K 절차) |
| **Learner Feedback** | 실제 사용 과정의 이해·탐색 문제 (유형 8종 정의됨) |
| **Defect** | 명확한 오류 및 회귀 |
| **Product Improvement** | 실제 사용 근거가 있는 UX 개선 |

### v1.x 변경 원칙

```
기술이 코드에 등장했다  →  자동 Canonical 추가        금지
사용자 한 명이 어렵다고 했다  →  전체 519개 rewrite   금지
```

Evidence 를 모으고 영향 범위를 먼저 판단한다.
이 두 줄은 Mission Learning Bridge §4 와 Learner Readability Cycle 에서 각각 비싸게 배운 것이다.

### Backlog 세 그룹

| 그룹 | 항목 |
| --- | --- |
| **Continuous** | Mission Learning Handoff · learner feedback · content improvements · bug fixes |
| **Optional** | 필터 라벨 한국어 병기(KI-08) · 웹툰 이미지 5건(KI-09) · CI 테스트 실행(KI-11) |
| **Deferred** | Timeline(KI-01) · SRE·Computer Architecture 성장(KI-02) |

**Final Release 작업 중에 새 기능 아이디어를 추가하지 않았다.**

---

## O. 이번 Cycle 에서 하지 않은 것

새 기능 **0** · 제품 source 변경 **0** · `content/**` 변경 **0** ·
generated data 변경 **0** · relation/canonical/ontology 변경 **0** ·
Known Issue 수를 줄이기 위한 수정 **0** · 새 backlog 아이디어 **0**.

문서 변경은 셋뿐이다.

```
~ docs/knowledge-encyclopedia/release-notes-v1.md   (정식 릴리스로 확정)
~ docs/knowledge-encyclopedia/00-project-status.md  (RELEASED 로 갱신)
+ reports/knowledge-encyclopedia/v1-release-closeout.md  (이 문서)
```

과거 RC report 는 **덮어쓰지 않았다.**

---

## P. 다음

**다음 작업을 자동으로 시작하지 않는다.**

앞으로의 작업은 실제 **Mission Learning Handoff · learner feedback · defect · usage evidence**
를 입력으로 `V1.x` 에서 결정한다. 지금 할 일은 하나다 — **쓰이게 두고, 무엇이 들어오는지 본다.**
