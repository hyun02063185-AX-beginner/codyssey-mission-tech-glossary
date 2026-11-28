# B3-2 미션 스토리 v0.4 — Codex 인수인계 (웹 구현·기술 검증)

> 작성 Claude Code · 2026-11-28 · 수신 Codex (GPT-6.2-Sol / high, workspace-write)
>
> 원고 [storyboard-v0.4.md](storyboard-v0.4.md) · 설계 [design-v0.4.md](design-v0.4.md) · 거버넌스 [AGENTS.md](../../../AGENTS.md), [06 거버넌스](../../../docs/knowledge-encyclopedia/06-agent-governance-model.md), [학습 운영 정책](../../../docs/mission-guides/learning-operation-policy.md), [제작 절차](../../../docs/mission-guides/workflow.md)

## 1. 작업 정보와 역할

| 항목 | 값 |
| --- | --- |
| 저장소 | `hyun02063185-AX-beginner/codyssey-mission-tech-glossary` |
| 작업 폴더 | `/Users/hyun020631854123/codyssey-mission-tech-glossary-b32-v04` (git worktree) |
| 브랜치 | `feature/b32-integrated-learning-v04` |
| 기준 커밋 | `1ff0cf3b939a763dc79c9ce269739c8c34986f55` (v0.3 구현) |
| 설계 커밋 | 이 문서를 담은 Claude의 로컬 커밋 (`git log -1 -- content/mission-stories/main-m06/handover-v0.4.md`) |
| 의존성 | `npm ci` 완료(Claude, 2026-11-28). 샌드박스에는 네트워크가 없으므로 새 패키지를 추가하지 않습니다. |

| 역할 | 하는 일 | 하지 않는 일 |
| --- | --- | --- |
| Claude Code | 원고·설계·인수인계 작성, 교차 검토, **모든 로컬 커밋** | push, 웹 코드 수정 |
| Codex | 설계 검토, 웹 구현, 테스트·QA, 검토 의견 반영, QA 기록 작성 | commit, push, merge, 원고 3종(`storyboard-v0.4.md`·`design-v0.4.md`·`handover-v0.4.md`) 수정 |
| Owner | 최종 push, 병합·배포 승인, 권한 요청 승인 | — |

**파일 소유** (같은 파일을 두 에이전트가 동시에 고치지 않습니다)

- Claude 소유: `content/mission-stories/main-m06/storyboard-v0.4.md`, `design-v0.4.md`, `handover-v0.4.md`, `assets/evidence/repro-v0.4-claude-2026-11-28.txt`. 원고 문제를 발견하면 고치지 말고 §9의 검토 파일에 적어 Claude에게 알립니다.
- Codex 소유: `src/` 아래 v0.4 코드, `playwright/b32-integrated-v04.spec.ts`, v0.4 단위 테스트, `reports/b32-integrated-learning-v04/` 전체, `package.json`·`playwright.config.ts`·`vite.config.ts`·`src/App.tsx`의 v0.4 등록에 필요한 최소 변경.
- 둘 다 바꾸지 않음: v0.3 원고·Lab 가이드·매핑 문서, 기존 SVG와 `build_figures.py`, `screens.json`, 기존 evidence, 다른 미션의 파일, 용어사전·지도 데이터.

## 2. 빌드 모드와 라우트

- 새 Vite 모드 **`b32-v04`** 를 추가합니다. `npm run dev:b32-v04` = `npm run data:build && vite --mode b32-v04`.
- `b32-v04` 모드에서만 `/missions/main-M06/story`가 v0.4 스토리를, `/missions/main-M06/lab/:labId?`가 기존 Lab을 렌더링합니다.
- **공개 빌드**(모드 없음, v0.2-r1)와 **`b32-review` 모드**(v0.3)의 동작은 바꾸지 않습니다. 기존 v0.3 Playwright가 그대로 통과해야 합니다.
- 주소 계약은 기존과 같은 HashRouter `#/` 형식입니다.
  - 화면: `#/missions/main-M06/story?scene=<1-6>&screen=<n>` (화면 ID `S<scene>-<n>`)
  - 인트로: `#/missions/main-M06/story`
  - 화면 → Lab: `#/missions/main-M06/lab/<NN>?from=S<scene>-<n>`
  - Lab → 화면 복귀: `#/missions/main-M06/story?scene=<s>&screen=<n>&from-lab=<NN>`
  - 잘못된 scene/screen·중복 파라미터·1024자 초과는 기존 `readStoryState`처럼 복구 안내 후 가장 가까운 유효 화면으로.
- 공개 route 계약을 새로 만들거나 바꾸지 않으므로 Owner Gate 대상이 아닙니다. 공개 빌드에 v0.4를 노출해야 할 것 같으면 구현하지 말고 Claude에게 보고합니다.

## 3. 원고 형식 계약

웹은 `storyboard-v0.4.md`를 `?raw`로 읽어 파싱합니다. v0.3의 `screens.json`과 `storyboard-v02.mjs`는 v0.4에 쓰지 않습니다(8화면 고정이므로). v0.4 전용 파서를 새로 만들고, 필드가 없거나 형식이 틀리면 **빌드·테스트에서 실패**하게 합니다(조용히 빈칸으로 두지 않음).

**문서 수준**

| 필드 | 문법 |
| --- | --- |
| 제목 | `# B3-2 미션 스토리 v0.4 — <강의 제목>` |
| 부제 · 핵심 질문 · 초안 안내 · 학습 안내 · 실습으로 확인하기 | `**<이름>** <한 줄>` |
| 학습 목표 | `**학습 목표**` 다음 빈 줄, `1. …` ~ `5. …` |
| Scene 표 | `\| <1-6> \| <관점> \| <Scene 카드 제목> \| <학습 질문> \| <도달 목표> \|` 6행 |
| Scene 구획 | `## Scene <n> — <제목>` |
| 링크 정의 | `[gNN]: https://…` (B3-2 학습가이드), `[labNN]: lab:NN` (Lab 01–09) |

**화면 수준** — `### S<n>-<m> · <제목>`부터 다음 `###` 또는 `## `까지. 31개, 순서대로 S1-1 … S6-3.

| 필드 | 필수 | 문법과 렌더링 |
| --- | --- | --- |
| `**관점**` | ✔ | Scene 표의 관점과 같아야 함. 헤더의 관점 칩 |
| `**핵심 메시지**` | ✔ | 화면의 `h1` |
| `**화면 설명**` | ✔ | 캡션(마크다운 인라인) |
| `**학습 질문**` | ✔ | 헤더 보조 문구 |
| `**도식**` | ✔ | `svg:<이름>:<상태>` → `assets/<이름>-desktop.svg`/`-mobile.svg`(기존 `B32Figure`). `interactive:<I1-I10>:<상태>` → 상호작용 컴포넌트. `table` → 아래 `**도식 표**`의 표를 도식 자리에 렌더링. `practice` → 도식 자리를 `**함께 실습**` 블록이 차지 |
| `**근거**` | ✔ | `; `(세미콜론+공백)로 나눈 근거 배지들. 배지 안의 괄호에는 쉼표가 있을 수 있음. 배지 종류는 원고 끝 “근거 표시” 표의 6가지(`실제`·`재현`·`구현`·`교육용 예시`·`교육용 시뮬레이션`·`미확인`)로 시작해야 함 |
| `**도식 표**` | `table`이면 ✔, 그 밖에는 선택 | 바로 다음 마크다운 표(GFM). `table`이 아닌 화면에서는 도식 아래 보조 표 |
| `**함께 실습**` | 선택 | 한 줄 제목 뒤 첫 번째 펜스 코드 = **명령**(복사 버튼 있음). 코드 다음의 일반 문단은 명령 보충 설명 |
| `**실습 결과 · <근거>**` | 선택 | 다음 펜스 코드 = 결과(복사 버튼 **없음**). 제목의 근거를 배지로 |
| `**관찰 질문**` | 선택 | 한 줄. 실습 블록 끝 |
| `**화면 해설**` | ✔ | 빈 줄 뒤 문단(들) ~ `**더 읽기**` 직전. **P / 설명 보기** 패널 본문 |
| `**더 읽기**` | ✔ | `[라벨][gNN]` 또는 `[라벨][labNN]`을 ` · `로 연결. `gNN`은 새 창 외부 링크, `labNN`은 §5의 Lab 내부 링크. 패널 하단 |
| `**용어**` | ✔ | 쉼표로 나눈 용어 ID. 모두 `content/terms/<id>.md`가 있어야 함(테스트). 기존 `/terms/<id>?b32-story=…` 링크 형식 |
| `**이해 확인**` 또는 `**Scene 4 이해 확인**` | 선택 | `질문 → *정답*`. 기존 `splitLearningCheck` 형식, 정답은 접힘 |
| `**마무리 · 스스로 설명하기**` | 선택 | 같은 형식 |

주의

- **파서는 펜스 코드(```)를 인식해야 합니다.** S5-1의 실습 결과처럼 펜스 안에 `## Why` 같은 줄이 있으므로, 화면 구획(`###`·`## `)과 필드(`**이름**`)는 펜스 밖에서만 찾습니다.
- `**함께 실습**`과 `**실습 결과**`는 한 화면에 같이 올 수도, `**실습 결과**`만 올 수도 있습니다(S3-5, S4-4, S4-5, S4-6, S4-7, S5-1은 결과만).
- 실습 결과와 해설 본문의 숫자·문구를 웹 코드에 다시 적지 않습니다. 상호작용 도식이 실제 기록 값을 보여 줄 때도 가능하면 원고나 `assets/evidence/` 값을 읽거나, 테스트로 원고와 같은지 확인합니다.

## 4. 화면 구성

v0.3 `B32Story`의 구조와 조작을 재사용합니다(새 공통 엔진을 만들지 않음). `lesson` 주입형이므로 v0.4 lesson 객체와 v0.4용 슬롯을 넘기는 방식을 우선 검토합니다. 화면 수·`screenHref`·`readStoryState`가 `screens.json`에 묶여 있는 부분(`content.ts`)은 v0.4 lesson의 화면 목록을 받도록 일반화하되, 공개 빌드·v0.3의 결과가 바뀌지 않아야 합니다.

| 영역 | 내용 |
| --- | --- |
| 상단 | `S2-3 · 제목`, 관점 칩, 근거 배지들, `설명 보기 P`, 이전·`n / 31`·다음 |
| 관점 띠 | 기존 `f0-journey` SVG 대신 6 Scene 칩(현재 Scene 강조 + 관점 이름). 칩은 해당 Scene 첫 화면 링크 |
| 본문 | `h1` 핵심 메시지 → 캡션 → 도식(svg·interactive·table·practice) → 보조 표 → 함께 실습 블록 |
| P 패널 | 화면 해설 + 더 읽기. 열기/닫기 키보드·초점 동작은 v0.3과 같음(1280 폭 오른쪽, 1239px 이하 아래) |
| 하단 접힘 | 이해 확인, 마무리, 관련 용어사전·학습가이드(“B3-2 개념지도 미구현” 문구 유지) |
| 인트로 | `MissionStoryOverview` 재사용. 학습 목표 5개, 학습 안내, Scene 카드 6개, 실습으로 확인하기, Lab 목차 링크, F1 개요 SVG(`f1-overview-r1:all`) |

명령 복사 버튼은 v0.3 Lab의 구현을 재사용하고, 클립보드 내용이 원고 펜스 코드와 **글자 단위로 같아야** 합니다(줄바꿈 포함, 앞뒤 공백 제외 규칙은 v0.3과 동일).

## 5. Lab 연동

- Lab 01–09 원고(`lab-guide-v0.3-r1.md`)와 렌더링(`B32Lab`)은 그대로 씁니다.
- v0.4 화면의 `[labNN]` 링크 → `lab/NN?from=<화면 ID>`. Lab 화면 상단에 “스토리 S2-3으로 돌아가기” 링크 하나를 보여 줍니다. v0.3의 K1–K11 왕복 카드(관찰 기록·그림 위치)는 v0.3 화면 ID 기준이므로 **v0.4 모드에서는 표시하지 않습니다**. `from` 값이 v0.4 화면 ID가 아니면 안내 없이 일반 진입으로 처리합니다.
- 복귀 시 `from-lab`은 화면에 “Lab NN에서 돌아왔습니다” 한 줄과 닫기 버튼만. 닫거나 화면을 옮기면 파라미터를 지웁니다.
- 인트로와 각 Lab에서 Lab 목차(`lab`)와 “결과로 찾아보기” 접근이 계속 동작해야 합니다.

## 6. 상호작용 I1–I10

명세는 [설계 §4](design-v0.4.md#4-상호작용-설계-i1i10)가 기준입니다. 요약:

- 모든 도식에 `교육용 시뮬레이션 · 실제 실행 기록이 아닙니다` 배지. 실제 값에는 근거 배지를 따로.
- 상태는 `role="group"` 버튼 + `aria-pressed`, 단계형은 이전·다음 버튼 + `n / N` 표시. `aria-live="polite"`.
- 초기 상태는 원고의 `interactive:<ID>:<상태>`.
- 기존 `B32LabFigures`의 `Diagram`·`Box`·`Arrow`와 Lab 도식 01·02·03·04·06을 재사용·확장. Lab 화면의 기존 도식 동작과 DOM 계약(`data-diagram`, `data-state`)은 v0.3 테스트가 계속 통과하도록 보존.
- 키 값은 어떤 상태에서도 `••••`로만. 실제 API 키·실제 사용자 경로·이메일을 화면 데이터에 넣지 않습니다.
- I9는 검증 결과를 **미리 기록한 재현 값**으로 보여 줍니다(R9). 검증기를 JavaScript로 다시 구현하지 않습니다.

## 7. 테스트와 QA

**단위 테스트** (`src/b32Story/` 아래 v0.4 테스트)

- 파서: 화면 31개, ID 순서, Scene 6개, 화면별 필수 필드, 관점 일치, `**도식**` 문법, `table`/`practice` 필드 존재, `I1`–`I10` 모두 한 번 이상 사용, 근거 배지 종류.
- 링크: 모든 `gNN`·`labNN` 정의 존재, `labNN` ∈ 01–09, 용어 ID가 `content/terms/`에 존재, SVG 이름·상태가 실제 파일과 일치.
- 명령 동일성: S2-2·S2-3(첫 블록)·S3-7·S5-4의 명령이 `lab-guide-v0.3-r1.md`의 해당 Lab 명령과 같음.
- 비밀값: 기존 `_tools/secret-check.cjs` 규칙으로 v0.4 원고·새 evidence 검사. `Bearer` 뒤에 실제 토큰 모양이 없음.

**Playwright** (`playwright/b32-integrated-v04.spec.ts`, `b32-v04` 모드로 실행하도록 `playwright.config.ts`에 최소 변경. 예: `B32_V04=1`)

- 인트로 + 31화면 직접 주소 진입, 제목·`h1`·`n / 31`.
- 이전·다음 버튼, ←/→/PageUp/PageDown, Scene 선택, 관점 띠 칩.
- P 열기·닫기·Escape·초점 이동(1280×720, 1000×800, 390×844).
- Dark/Light 전환과 저장 키 유지.
- 함께 실습의 복사 버튼 → 클립보드 = 원고 명령. 결과 블록에는 복사 버튼 없음.
- I1–I10: 상태 버튼마다 `aria-pressed`와 `data-state` 변화, 시뮬레이션 배지 존재.
- 360×800·390×844에서 문서 가로 넘침 없음(31화면 전부).
- 화면 → Lab → 복귀, 잘못된 주소 복구, 새로고침·뒤로 가기.
- 기존 Lab 01–09 직접 진입(`b32-v04` 모드).

**회귀** (기존 결과: [v0.3 QA](../../../reports/b32-learning-cycle-v03/README.md))

- `npm run build`, `npx tsc -b`, `npx vite build --mode b32-v04 --outDir <tmp>`.
- `npx vitest run` 전체. 기준 커밋에서 이미 실패하던 `scripts/glossary_visual_contract.test.mjs` 5건은 **기존 실패**로 따로 표시하고, 새 실패와 구분합니다.
- 기존 Playwright: `playwright/b32-learning-cycle.spec.ts`(B32_REVIEW=1), `b32-story-web.spec.ts`, `b32-lesson-v02.spec.ts`, `b32-flow-preview.spec.ts`. 다른 미션 spec은 영향 분석상 필요할 때만.
- 다른 미션·공통 파일 변경 없음 확인: `git diff --stat 1ff0cf3 -- . ':!content/mission-stories/main-m06' ':!src/b32Story' ':!playwright/b32-*' ':!reports/b32-integrated-learning-v04'`의 결과를 QA 기록에 남기고 각 파일의 이유를 적습니다.
- `npm run data:build`가 추적 중인 생성 파일을 바꾸면 그 변경을 되돌리지 말고 목록만 보고합니다(Claude가 커밋 범위를 판단).

**샌드박스 제한** 개발 서버 포트 열기나 브라우저 실행이 샌드박스에 막히면 **권한 상승을 요청하지 말고** §9 검토 파일과 답장에 막힌 명령·오류를 적어 주세요. Claude가 샌드박스 밖에서 같은 명령을 실행하고 결과를 `reports/b32-integrated-learning-v04/`에 남깁니다.

**QA 기록** `reports/b32-integrated-learning-v04/README.md` — 검증 SHA(작업 트리면 “미커밋 + 기준 SHA”), 실행 명령과 결과, 화면 폭별 확인, 기존/신규 실패, 미검증 항목. 스크린샷은 폭×테마별 대표 화면만(1280·1000·390·360 × Dark·Light, 화면 수는 최소). v0.3 QA 보고서 형식을 따릅니다.

## 8. 금지

- commit, push, merge, 배포, 브랜치 생성·삭제, `git stash`.
- 실제 AI API 호출, API 키 입력, `--dangerously-bypass-approvals-and-sandbox`, 전체 디스크 접근 요청.
- 다른 미션 콘텐츠, 공통 엔진의 대규모 개편, 공개 빌드 동작, PR #53(`feature/b32-flow-navigator-v02`, HEAD `cbac253`)과 v0.3 브랜치(`feature/b32-learning-cycle-v03`, `1ff0cf3`) 변경.
- `~/Codyssey_B3-2`(실제 B3-2 프로그램) 수정.
- 새 npm 패키지 추가.

## 9. 진행 절차와 상태 기록

1. **설계 검토 (Phase B-0)** Codex가 원고·설계·이 문서를 읽고 현재 웹 구조와의 호환성을 확인해 `reports/b32-integrated-learning-v04/codex-design-review.md`에 `문제 / 제안 / 질문`을 적습니다. 문제가 없으면 “구현 진행 가능”이라고 적습니다. 그다음 Claude에게 한 줄로 답합니다.
2. **협의** Claude가 원고를 고치거나 답을 적고 커밋합니다.
3. **구현 (Phase B)** 전체 화면과 I1–I10, 테스트를 한 번에 구현합니다. 화면마다 멈추지 않습니다.
4. **교차 검토 (Phase C)** Claude가 구현을 검토해 수정 요청을 한 번에 `reports/b32-integrated-learning-v04/claude-review-<n>.md`로 전달합니다. 추가 수정 사이클은 최대 2회.
5. **최종 QA (Phase D)** Codex가 §7을 실행하고 QA 기록을 완성합니다. Claude가 확인 후 로컬 커밋합니다. Push는 Owner가 합니다.

| 단계 | 담당 | 대상 커밋 | 상태 | 메모 |
| --- | --- | --- | --- | --- |
| A 설계·원고 | Claude | 설계 커밋 | PASS | 자체 검토 완료([설계 §8](design-v0.4.md#8-자체-검토-정책-7-기획-착수-체크리스트)) |
| B-0 설계 검토 | Codex | — | 대기 | |
| B 구현 | Codex | — | 대기 | |
| C 교차 검토 | Claude ↔ Codex | — | 대기 | 최대 2회 |
| D 최종 QA | Codex → Claude | — | 대기 | |
| Push · 병합 | Owner | — | 대기 | |
