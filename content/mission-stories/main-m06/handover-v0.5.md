# B3-2 미션 스토리 v0.5 — Codex 인수인계 (웹 구현·기술 검증)

> 작성 Claude Code · 2026-11-28 · 수신 Codex (GPT-6.2-Sol / high, workspace-write)
>
> 원고 [storyboard-v0.5.md](storyboard-v0.5.md) · 설계 [design-v0.5.md](design-v0.5.md) · v0.4 계약 [handover-v0.4.md](handover-v0.4.md) (이 문서에 없는 규칙은 v0.4 계약을 따릅니다) · 거버넌스 [AGENTS.md](../../../AGENTS.md), [06 거버넌스](../../../docs/knowledge-encyclopedia/06-agent-governance-model.md), [학습 운영 정책](../../../docs/mission-guides/learning-operation-policy.md), [제작 절차](../../../docs/mission-guides/workflow.md), [미션 공통 UI 기준](../../../docs/mission-guides/mission-ui-standard.md)

## 1. 작업 정보와 역할

| 항목 | 값 |
| --- | --- |
| 저장소 | `hyun02063185-AX-beginner/codyssey-mission-tech-glossary` |
| 작업 폴더 | `/Users/hyun020631854123/codyssey-mission-tech-glossary-b32-v05` (git worktree) |
| 브랜치 | `feature/b32-learning-index-v05` |
| 기준 커밋 | `ea31d981fd435e6a43353324d378365ea9d0d90a` (v0.4 최종 QA) |
| 설계 커밋 | 이 문서를 담은 Claude의 로컬 커밋 (`git log -1 -- content/mission-stories/main-m06/handover-v0.5.md`) |
| 의존성 | `npm ci` 완료(Claude, 2026-11-28). 새 패키지를 추가하지 않습니다. |

| 역할 | 하는 일 | 하지 않는 일 |
| --- | --- | --- |
| Claude Code | 원고·설계·인수인계·근거 작성, 교차 검토, Playwright 실행(샌드박스 밖), **모든 로컬 커밋** | push, 웹 코드 수정 |
| Codex | 설계 검토, 웹 구현, 단위 테스트·Playwright spec 작성, 샌드박스 안 검증, QA 기록 작성 | commit, push, merge, Claude 소유 파일 수정 |
| Owner | push, 병합·배포 승인, 권한·범위 변경 승인 | — |

**파일 소유** (같은 파일을 두 에이전트가 동시에 고치지 않습니다)

- Claude 소유: `content/mission-stories/main-m06/storyboard-v0.5.md`, `design-v0.5.md`, `handover-v0.5.md`, `assets/evidence/repro-v0.5-claude-2026-11-28.txt`, `assets/evidence/max-tokens-v0.5-claude-2026-11-28.json`, `_tools/build_max_tokens_v05.py`, `reports/b32-learning-index-v05/claude-review-<n>.md`, `reports/b32-learning-index-v05/playwright-logs/`. 원고 문제는 고치지 말고 검토 파일에 적어 알립니다.
- Codex 소유: `src/b32Story/` 아래 v0.5 코드와 테스트, `playwright/b32-learning-index-v05.spec.ts`, `reports/b32-learning-index-v05/`의 나머지(`README.md`, `codex-design-review.md`, `screens/`), 그리고 `package.json`·`playwright.config.ts`·`vite.config.ts`·`src/App.tsx`·`src/b32Story/reviewMode.ts`의 v0.5 등록에 필요한 최소 변경.
- 둘 다 바꾸지 않음: v0.4·v0.3·v0.2 원고와 v0.4 이전 근거 파일, Lab 가이드·매핑 문서, SVG와 `build_figures.py`, `screens.json`, 다른 미션 파일, 용어사전·지도 데이터, 공통 `src/missionUI/` 컴포넌트(꼭 필요하면 먼저 Claude에게 이유를 알림).

## 2. 빌드 모드와 라우트

- 새 Vite 모드 **`b32-v05`**. `package.json`에 `"dev:b32-v05": "npm run data:build && vite --mode b32-v05"`. 검토 서버 포트 4176(`npm run dev:b32-v05 -- --port 4176`).
- `b32-v05` 모드에서만 `/missions/main-M06/story`가 v0.5 스토리를, `/missions/main-M06/lab/:labId?`가 기존 Lab을 렌더링합니다. Lab 동작은 v0.4 모드와 같습니다(v0.4 계약 §5).
- 공개 빌드(v0.2-r1), `b32-review`(v0.3), `b32-v04`(v0.4)의 동작과 출력은 바꾸지 않습니다. 기존 Playwright가 그대로 통과해야 하고, 공개 빌드에 v0.4·v0.5 원고 청크가 없어야 합니다.
- 주소 형식은 v0.4와 같은 HashRouter입니다. 새 화면은 `?scene=4&screen=5a`, `?scene=4&screen=5b`. 기존 31개 주소는 v0.4와 같은 화면을 가리킵니다([설계 §7](design-v0.5.md#7-scene-4-흐름과-주소-호환-작업-d)).
- 공개 route 계약은 바뀌지 않습니다. 공개 빌드에 v0.5를 노출해야 할 것 같으면 구현하지 말고 Claude에게 보고합니다.

## 3. 원고 형식 계약 (v0.4와의 차이)

v0.5 원고는 v0.4 형식([v0.4 계약 §3](handover-v0.4.md#3-원고-형식-계약))을 따르고, 아래만 다릅니다. v0.4 파서의 v0.4 검증 규칙은 그대로 두고(v0.4 모드 회귀), v0.5 규칙을 추가하거나 판(edition) 설정으로 나누세요.

| 항목 | v0.5 규칙 |
| --- | --- |
| 제목 | `# B3-2 미션 스토리 v0.5 — <강의 제목>` |
| 인트로 필드 | v0.4 필드 + `**학습 로드맵** <한 문단>` (필수) |
| Scene 표 | 6열: `Scene · 관점 · Scene 카드 제목 · 학습 질문 · 도달 목표 · 핵심 개념`. 핵심 개념은 ` · `로 나눈 3–5개 |
| 화면 수 | Scene별 `4 · 5 · 7 · 9 · 5 · 3` = 33 |
| 화면 ID | **제목에서 읽습니다.** `S<scene>-<번호>` 또는 `S<scene>-<번호><소문자 한 글자>`. 같은 Scene 안에서 순서: 번호 오름차순, 같은 번호면 접미사 없는 화면 → `a` → `b` …. 접미사 화면은 같은 번호의 기본 화면 바로 뒤에만 올 수 있음. 중복 금지 |
| 상호작용 | I1–I12. 새 상태: `I4:redirect`, `I5:git-cases`, `I11:sentence`·`I11:commit`, `I12:stream`. I1–I12 모두 한 번 이상 사용 |
| `**도식 표**` | S4-5a·S4-5b는 상호작용 도식 아래의 보조 표(v0.4 규칙과 같음). I11은 이 표의 행을 데이터로 읽음(§5) |

**v0.4와의 보존 검사 (단위 테스트)** v0.4 원고의 31개 화면 ID가 모두 v0.5에 있고 제목이 같음. S3-4·S3-5·S4-5를 뺀 28개 화면은 `관점`·`핵심 메시지`·`화면 설명`·`학습 질문`·`도식`·`근거`·`화면 해설`·`더 읽기`·`용어`·`함께 실습`·`실습 결과`·`이해 확인`이 v0.4와 같음. 학습 목표 5개가 v0.4와 같음.

## 4. 학습 인덱스 구현

명세는 [설계 §2–§3](design-v0.5.md#2-학습-인덱스-정보-구조)이 기준입니다. 구현상 지켜야 할 점:

1. **데이터는 파싱된 lesson에서만.** Scene·화면 제목·수·위치를 코드에 다시 적지 않습니다. 인덱스 컴포넌트는 `scenes`(id·perspective·title·question·goal·concepts·screens[{id,title,href}])와 현재 화면 ID를 props로 받습니다. 파일은 `src/b32Story/` 안(예: `B32LearningIndex.tsx`, `b32LearningIndex.css`).
2. **화면 안 상태 보존.** 인덱스·P를 열고 닫아도 `.b32-integrated-material`(그리고 그 안의 상호작용 상태)이 다시 마운트되지 않아야 합니다. 열림 상태는 감싸는 요소의 `data-` 속성과 CSS로만 표현합니다. 테스트: I7 슬라이더 값 바꾸기 → 인덱스 열기·닫기 → P 열기·닫기 → 값 유지.
3. **폭별 동작** ≥1000px 고정형 왼쪽 열, 1240–1439px에서 P가 열리면 56px 레일, <1000px 모달 drawer(초점 가두기, Esc·배경·닫기, 선택 시 닫힘, 기록 추가 없음, 위치 바뀌면 닫힘).
4. **열림 기억** ≥1000px만 `localStorage['b32-v05-learning-index']`. 기본 닫힘. 저장소 오류는 무시.
5. **키보드** 기존 `P`·Esc·←/→ 처리와 충돌하지 않게(설계 §3.2). 인덱스는 `.b32-deck` 밖에 두어 슬라이드 키가 인덱스 안에서 동작하지 않게 합니다.
6. **위치 띠** v0.5 모드에서 `.b32-perspectives` 자리에. 지나온 Scene을 “완료”처럼 보이게 하지 않습니다(체크·채움·퍼센트 없음).
7. **인트로 로드맵** `MissionStoryOverview`의 `entryActions`로 전달. 공통 Scene 카드는 그대로 둡니다. v0.5에서는 `introOrientation`의 Scene별 `dl`을 빼고(로드맵에 같은 정보), 학습 목표·안내·F1 그림·실습으로 확인하기·Lab 링크는 유지합니다.
8. 접근성: 목록은 `nav`(이름 `학습 인덱스`) + `ol`, 현재 화면 `aria-current="page"`, Scene 구획 버튼 `aria-expanded`/`aria-controls`, 터치 영역 44px, 색만으로 구분하지 않음, Dark/Light 모두 기존 발표 변수만.

## 5. 상호작용 I4·I5·I11·I12

명세는 [설계 §4–§6](design-v0.5.md#4-i11-temperature-인터랙티브-시뮬레이션-s4-5a)이 기준입니다. v0.4 모드의 I1–I10 표시와 DOM 계약(`data-diagram`, `data-state`, 버튼 이름)은 바꾸지 않습니다. 새 상태·새 문구는 v0.5 모드에서만 보입니다.

| ID | 화면 | 구현 요점 | 데이터 출처 (웹에 다시 적지 않음) |
| --- | --- | --- | --- |
| I4 `redirect` | S3-4 | 상태 버튼에 `③ 출력을 파일로`. ① 칸 문구를 상속 설명으로. ③: “Python의 stdout → out.txt · Git도 같은 통로를 물려받음 · 화면 출력 없음 · `a.stdout` None”. PIPE 동등성 한 줄 | S3-4 실습 결과(R6) · `repro-v0.5…txt` R11 (구획 `## R11 · `) |
| I5 `git-cases` | S3-5 | 네 사례 버튼 + 나란히 토글, 칸마다 명령·returncode·stdout·stderr·Python의 판단, ①·③ 말풍선 | S3-5 실습 결과(`===== ① …` 네 구획). 판단 문구는 설계 §6 |
| I11 `sentence`·`commit` | S4-5a | 슬라이더 0–2/0.1, 대표 값 0.2·1.0·2.0, 초기화, 0.2와 1.0 나란히, 막대+%·기준 점선·▲▼, 0 극한 처리, 합계 줄, 표시 의무 배지 | S4-5a `**도식 표**` 행(앞 4행 sentence, 뒤 4행 commit, “기준 확률 (1.0)” 열). 0.2·2.0 열 = 테스트 기준 |
| I12 `stream` | S4-5b | 한도 슬라이더 1–80 + 프리셋, 생성 시작(재생)·다시, 추론 가정 토글(30), 네 상태 표시, 결과 패널, 두 제한 구분 표, 형식 완성 후 실패 안내(R9 P4·P5) | `max-tokens-v0.5-claude-2026-11-28.json`(`draft`·`total_units`·`results`), R9 기록 |

- 공통: 모든 새 도식에 `교육용 시뮬레이션 · 실제 AI 출력·측정값이 아닙니다` 배지와 `실제 AI API 호출 없음`. 재현 값 옆에는 해당 근거 배지. 버튼 그룹 `role="group"` + `aria-pressed`, 결과 요약 `aria-live="polite"`, `prefers-reduced-motion` 존중, 360px에서 가로 넘침 없음.
- I11 계산은 지시서 식 그대로. `T === 0`이면 식을 계산하지 않고 극한 분기. 부동소수 합은 1 ± 1e-9.
- I12는 검증기를 JavaScript로 다시 만들지 않습니다. 결과는 `results[n]`만 표시합니다. 조각 나누기는 `/\S+/g`, 조각 n개 글 = 원문의 n번째 조각 끝까지(공백 보존).
- 재생 타이머는 화면을 옮기거나 컴포넌트가 사라질 때 정리합니다. 재생 중 한도를 바꾸면 재생을 멈추고 새 한도의 끝 상태를 보여 줍니다.

## 6. 기존 계약 재확인

- P 패널, 이전·다음(상·하), Scene 선택, 키보드 이동, Dark/Light(저장 키 `codyssey-presentation-theme`), 용어사전 링크, 함께 실습 복사(원고와 글자 단위 동일), 결과 블록 복사 버튼 없음, Lab 진입·복귀(`from`·`from-lab`), 잘못된 주소 복구, 새로고침·뒤로 가기 — 모두 v0.4와 같게.
- 화면 ID에 숫자만 가정하는 코드·정규식이 있으면 v0.5에서 `S[1-6]-[0-9]+[a-z]?`를 허용하세요(`integratedNavigation.ts`, `readLabOrigin`·`readStoryReturn`·`B32LearningReturn`, 용어사전 `b32-story` 복귀 처리 등). v0.4·v0.3 모드의 검증 결과는 바뀌지 않아야 합니다.

## 7. 테스트와 QA

**단위 테스트 (Vitest, v0.5 전용 파일)**

- 파서: 33화면, ID 순서·접미사 규칙, Scene 6개와 6열 표, `학습 로드맵` 필드, 핵심 개념 3–5개, I1–I12 사용, 새 상태 이름, 근거 배지 종류, 용어 ID 존재, SVG 상태.
- 보존: §3의 v0.4 대조(31 ID·제목, 28화면 필드 동일, 학습 목표 5개 동일), Lab 01–09 정의 유지, 명령 동일성(S2-2·S2-3·S3-7·S5-4 = Lab 명령, v0.4 테스트와 같은 기준).
- I11: 표 데이터 읽기, 모든 T(0.1 단위 0.1–2.0)에서 합계 1, 단조성, T=1 = 기준, 0.2·2.0 표시값 = 원고 표 문자열, T=0 극한(가장 높은 후보 100%).
- I12: `total_units` = `/\S+/g` 조각 수 = 57, `results.length` = 58, 프리셋별 상태·결과가 S4-5b 도식 표와 같음(8·20·40 → 섹션 없음, 48 → 불릿, 52·57·80 → 통과, 80 → 만든 단위 57), 추론 가정 켬 + 한도 30 → `results[0]` 텍스트 없음.
- 인덱스: Scene별 화면 수 합 33, 위치 계산(`S4-5a` → Scene 4 화면 6/9, 전체 22/33), 주소 왕복(모든 화면 `screenHref` → `readStoryState` → 같은 화면), v0.4 31개 주소가 v0.5에서 같은 ID로 해석.
- 비밀값: 기존 `_tools/secret-check.cjs` 규칙으로 v0.5 원고·새 근거 파일 검사.

**Playwright** `playwright/b32-learning-index-v05.spec.ts`. `playwright.config.ts`에 `B32_V05=1`이면 `--mode b32-v05`, 기본 포트 4176, 기존 서버 재사용 방지(v0.4의 `B32_V04` 처리와 같은 방식).

- 인트로: 로드맵 6 Scene(질문·목표·개념·화면 수), Scene·화면 직접 이동, 공통 Scene 카드 유지, 학습 목표 5개.
- 33화면 직접 주소 진입: 제목·`h1`·`n / 33`·위치 띠 글(`Scene s / 6 · … · 화면 i / N · 전체 n / 33`).
- 인덱스: 모든 화면에서 열기·닫기(최소 각 Scene 첫 화면 + S4-5a·S4-5b, 전체 33화면은 열기 버튼 존재만), Scene 펼치기·접기·모두 펼치기, 현재 Scene·화면 표시, 링크로 이동 후 표시 동기화, 직접 주소 진입 후 표시, ≥1000px에서 연 채 다음·이전 연속 이동과 새로고침 후 유지, 1280×720에서 P와 동시 사용(레일), 1440×900에서 둘 다 펼침, 390×844·360×800 drawer(초점 가두기·Esc·배경·선택 후 닫힘·초점 복귀·뒤로 가기), 키보드만으로 열기→이동.
- 화면 안 상태 보존(§4-2).
- 발표 화면: 1280×720 기본 닫힘 상태에서 v0.4와 같은 상단 배치(위치 띠가 관점 띠 자리).
- I11: 슬라이더·대표 값·초기화·비교·0 극한, % 글자, 배지. I12: 프리셋 7개의 상태·결과 문구, 재생(축소 동작 설정으로 즉시 완료), 추론 가정, 배지. I5 `git-cases` 네 사례·나란히, I4 `redirect`. 기존 I7 params(체크·슬라이더·JSON 키 생략) 동작.
- Dark/Light 전환·저장. 360·390·1000·1280(+1440) 폭에서 문서 가로 넘침 없음(33화면 × 360·390, 인덱스 열린 상태 포함), 패널 겹침으로 조작이 가려지지 않음.
- 화면 → Lab → 복귀(S4-6 기존 + S3-5), 잘못된 주소(`screen=5c`) 복구, 새로고침·뒤로 가기.
- 대표 화면 캡처: `B32_V05_QA_OUTPUT` 환경변수가 있으면 그 폴더에 1280·1000·390·360 × Dark·Light (인덱스 열림/닫힘, S4-5a, S4-5b, 인트로 로드맵). 최소 수로.

**회귀 (Claude가 샌드박스 밖에서 실행)**

```sh
B32_V05=1 PLAYWRIGHT_PORT=4176 B32_V05_QA_OUTPUT=reports/b32-learning-index-v05/screens npx playwright test playwright/b32-learning-index-v05.spec.ts
B32_V04=1 PLAYWRIGHT_PORT=4175 npx playwright test playwright/b32-integrated-v04.spec.ts
B32_REVIEW=1 PLAYWRIGHT_PORT=4174 npx playwright test playwright/b32-learning-cycle.spec.ts
npx playwright test playwright/b32-story-web.spec.ts playwright/b32-lesson-v02.spec.ts playwright/b32-flow-preview.spec.ts
```

- `npx tsc -b`, `npm run build`, `npx vite build --mode b32-v05 --outDir <tmp>`, `npx vite build --mode b32-v04 --outDir <tmp>`, `npx vitest run`.
- 기준 커밋의 기존 실패: Vitest `scripts/glossary_visual_contract.test.mjs` 5건, `npm run mission:ui-check`의 `all 21 card links introduce a mission`. 새 실패와 구분해 기록합니다.
- 변경 범위: `git diff --stat ea31d98 -- . ':!content/mission-stories/main-m06' ':!src/b32Story' ':!playwright/b32-*' ':!reports/b32-learning-index-v05'` 결과와 파일별 이유를 QA 기록에.
- `npm run data:build`가 추적 파일을 바꾸면 되돌리지 말고 목록만 보고합니다.

**샌드박스 제한 (v0.4 B-0 확인)** Codex 샌드박스에서는 Vite 서버(`listen EPERM`)와 Chromium이 막혀 Playwright가 실행되지 않습니다. Codex는 spec을 작성하고 `--list`로 수집만 확인합니다. Claude가 샌드박스 밖에서 실행해 로그를 `reports/b32-learning-index-v05/playwright-logs/`에 남깁니다. 다른 명령이 막히면 **권한 상승을 요청하지 말고** 막힌 명령과 오류를 QA 기록과 답장에 적어 주세요.

**QA 기록** `reports/b32-learning-index-v05/README.md` — v0.4 QA 기록 형식. 검증 SHA, 명령과 결과, 폭별 확인, 기존/신규 실패, 미검증.

## 8. 금지

- commit, push, merge, 배포, 브랜치 생성·삭제, `git stash`.
- 실제 AI API 호출, API 키 입력, `--dangerously-bypass-approvals-and-sandbox`, 전체 디스크 접근·권한 상승 요청.
- 다른 미션 콘텐츠, 공통 엔진·`missionUI`의 대규모 개편, 공개 빌드 동작, PR #53(`feature/b32-flow-navigator-v02`, `cbac253`)·v0.3(`feature/b32-learning-cycle-v03`, `1ff0cf3`)·v0.4(`feature/b32-integrated-learning-v04`, `ea31d98`) 브랜치 변경.
- `~/Codyssey_B3-2`(실제 B3-2 프로그램) 수정. 새 npm 패키지 추가.

## 9. 진행 절차와 상태 기록

1. **설계 검토 (Phase B-0)** Codex가 원고·설계·이 문서를 읽고 기술 충돌·접근성·화면 공간·데이터 중복·주소 호환을 확인해 `reports/b32-learning-index-v05/codex-design-review.md`에 `문제 / 제안 / 질문`을 적습니다. 특히 확인할 것: ① 화면 ID에 숫자만 가정하는 코드의 위치와 수정 범위 ② v0.4 모드 무변경을 지키면서 lesson·상호작용을 판별로 나누는 방법 ③ 인덱스·P·레일·drawer의 레이아웃이 기존 CSS(`b32Cycle.css`의 ≥1240 그리드)와 충돌하는지 ④ 화면 안 상태 보존 방법. 문제가 없으면 “구현 진행 가능”이라고 적고 Claude에게 한 줄로 답합니다.
2. **협의** Claude가 원고·설계를 고치거나 답을 적고 커밋합니다.
3. **구현 (Phase B)** 전체 범위를 한 번에 구현합니다. 화면마다 멈추지 않습니다.
4. **교차 검토 (Phase C)** Claude가 실제 화면과 원고를 비교해 `reports/b32-learning-index-v05/claude-review-<n>.md`로 한 번에 전달합니다. 추가 수정 사이클은 최대 2회.
5. **최종 QA (Phase D)** Codex가 §7을 실행하고 QA 기록을 완성합니다. Claude가 Playwright·회귀를 실행·확인한 뒤 로컬 커밋합니다. Push는 Owner가 합니다.

| 단계 | 담당 | 대상 커밋 | 상태 | 메모 |
| --- | --- | --- | --- | --- |
| A 설계·원고 | Claude | 설계 커밋 | PASS | 자체 검토 [설계 §10](design-v0.5.md#10-자체-검토) |
| B-0 설계 검토 | Codex | `a618771` | PASS (협의 완료) | [검토](../../../reports/b32-learning-index-v05/codex-design-review.md) 문제 7 · 질문 5 → 아래 “B-0 협의 결과” |
| B 구현 | Codex | | 대기 | |
| C 교차 검토 | Claude ↔ Codex | | 대기 | |
| D 최종 QA | Codex → Claude | | 대기 | |
| Push · 병합 | Owner | — | 대기 | |

**진행 기준** workflow.md의 GPT 독립 콘텐츠 검토와 Owner 원고 승인 후 웹 통합 순서는, Owner가 2026-11-28 v0.5 작업 지시서에서 Phase A–D를 중간 승인 없이 연속 진행하도록 지시해 이번 작업에 한해 바뀌었습니다(v0.4와 같은 방식). 독립 콘텐츠 검토는 Claude↔Codex 교차 검토로 대신하고, GPT 독립 검토와 Owner 원고 승인은 최종 게이트 `READY_FOR_OWNER_PUSH_AND_REVIEW`에서 Owner가 판단합니다. 이 웹 통합은 Owner 승인 전의 **검토 모드 구현**이며 공개 빌드에 노출하지 않습니다.

**B-0 협의 결과 (Claude, 2026-11-28)** Codex [설계 검토](../../../reports/b32-learning-index-v05/codex-design-review.md)의 문제 1–7과 제안을 모두 받아들입니다. 질문 답:

1. **S3-4 출력 상속** 제안대로 고쳤습니다. 핵심 메시지 “출력 통로를 지정하지 않으면 Git은 Python의 통로를 물려받아 직접 쓰고, Python은 그 글 대신 `returncode`만 받는다.” 해설·이해 확인도 `stdout`·`stderr`는 `None`, `returncode`는 남는다는 뜻으로 맞췄습니다. I4 ③은 Python의 stdout 리다이렉션만 설명합니다(설계 §6).
2. **I12 추론과 결과 단계** 제안 채택. 추론 소비 `min(L, 30)`, 보이는 글 `min(57, max(0, L − 30))`. 추론 끔 한도 57 = “답변 완성 · 한도와 같은 양”. `results[0]` = “응답 처리 단계에서 거부 · PR 형식 검사 전”. 끊겼는데 통과한 49–56 모두에 후처리 안내. 확인 사례 20·30·31·80(켬)·57·80(끔)을 테스트에 넣어 주세요(설계 §5).
3. **50자 권장** 채택. Python 검사 칸은 72자·80자·섹션·불릿, 50자는 “프롬프트 권장 · 검사하지 않음(S5-2)” 주석. 원고 S4-5b 해설과 설계 §5를 고쳤습니다.
4. **1280×720 위치 띠** 채택. 요약 한 줄 높이를 허용하고, 인덱스 버튼은 기존 상단 줄에 둡니다. 본문이 좁아지면 뷰포트가 아니라 본문 컨테이너 폭으로 띠를 번호 중심으로 접습니다(설계 §3.3).
5. **로드맵 테마** 채택. 인트로 로드맵 = 사이트 테마 변수(공통 인트로와 같음), 강의 중 인덱스·레일·drawer·위치 띠 = 발표 변수(설계 §3.4).

제안 중 확인해 둘 것: 기존 I3과 I5 `git`·`http`·`program`은 기존 근거(v0.4 원고·Lab·기록)로 그리고, v0.5 판별 처리는 I4 `redirect`·I5 `git-cases`·I11·I12에만 둡니다. I3이 읽는 S3-5 두 사례 값은 R10의 ②·④와 같으므로 학습 내용이 달라지지 않습니다. drawer는 네이티브 `dialog.showModal()` 또는 동등한 초점 가두기를 쓰고, 기존 `P` 처리의 `closest('dialog')`가 v0.5 drawer에서도 동작하는지 테스트하세요. 웹 통합 기준 원고는 이 협의 결과를 담은 Claude 커밋입니다.
