# B3-2 v0.5 Phase B · C1 QA

- 웹 통합 기준 원고와 검증 작업 트리의 HEAD는 `298bfd05843886e73a99e1cd0e3754b069602712`다. 작업 브랜치는 `feature/b32-learning-index-v05`이며 Phase B 구현은 미커밋 상태다. v0.4 최종 QA 기준은 `ea31d98`이다. [인수인계 및 B-0 협의 결과](../../content/mission-stories/main-m06/handover-v0.5.md) · [B-0 설계 검토](codex-design-review.md) · [v0.4 QA](../b32-integrated-learning-v04/README.md)
- `b32-v05`에서 학습 로드맵, 학습 인덱스(고정 열·레일·모달 drawer), 본문 폭에 반응하는 위치 띠와 I4·I5 확장·I11·I12를 연결했다. 스토리·Lab·용어사전 복귀는 같은 판의 화면 목록으로 ID를 확인한다. v0.4의 I3 및 I5 기존 모드는 기존 근거 데이터를 사용한다. I12는 R12의 결과와 R9의 거부 문구를 표시하며 재생과 추론 소비는 교육용으로 계산한다.
- `npm run dev:b32-v05 -- --port 4176`에서 `/#/missions/main-M06/story`와 `/#/missions/main-M06/lab`으로 검토한다. 새 화면은 `?scene=4&screen=5a`·`?scene=4&screen=5b`다. Phase B의 브라우저 실행·시각 확인은 Claude의 교차 검토에서 수행한다.

## 샌드박스 검증

| 명령 | 결과 |
| --- | --- |
| `node_modules/.bin/vitest run src/b32Story/storyboardV05.test.tsx --no-cache` | **28/28 통과.** 원고·근거 검사, 33화면과 인트로 정적 렌더링, 기존 31개 ID와 28개 화면 필드 보존, 주소·Lab 왕복, I11 수치·I12 경계값 검증. |
| `node_modules/.bin/vitest run --mode b32-v04 src/b32Story/storyboardV04.test.tsx --no-cache` | **18/18 통과.** |
| `node_modules/.bin/vitest run --mode b32-review src/b32Story/learningCycle.test.ts --no-cache` | **4/4 통과.** |
| `node_modules/.bin/vitest run --no-cache` | 첫 실행 579/585 통과. 기존 용어사전 검사 5건과 미션 개념지도 `edge corridors > all`의 5초 타임아웃 1건. 빌드와 동시에 실행했다. |
| `node_modules/.bin/vitest run --no-cache --maxWorkers=4` | 독립 재실행 **580/585 통과**, 47/48 파일 통과. 개념지도 타임아웃은 재현되지 않았다. 실패 5건은 기준 QA와 동일한 `scripts/glossary_visual_contract.test.mjs`로, B6-1 메타데이터 1건, Fast Batch B 생성 항목·SVG 2건, Fast Batch C 본문 1건, Browser Rendering 생성 항목 1건이다. |
| `node_modules/.bin/tsc -b` | **통과.** |
| `node_modules/.bin/vite build --mode b32-v05 --outDir <임시 경로>` | **통과.** v0.5 원고의 용어·SVG 포함 빌드 검증과 판별 청크 생성. |
| `node_modules/.bin/vite build --mode b32-v04 --outDir <임시 경로>` | **통과.** v0.4 원고 검증과 기존 판별 청크 생성. |
| `npm_config_offline=true npm run build` | **통과.** 데이터 검증, TypeScript, 공개 Vite 빌드, B2-1 빌드 검사. 세 Vite 빌드에서 500kB 청크 크기 안내가 출력됐다. |
| `B32_V05=1 PLAYWRIGHT_PORT=4176 node_modules/.bin/playwright test playwright/b32-learning-index-v05.spec.ts --list` | **1파일 18개 수집.** 서버 및 v0.5 브라우저 시나리오 실행은 Claude 검증 대기. |

빌드 산출물의 JS와 청크 이름을 대조했다. 공개 빌드에는 v0.4·v0.5 원고, 검토용 Lab 진입 청크, v0.5 인덱스 키, R12 초안이 없었다. `b32-v04`에는 v0.4 원고와 기존 Lab 진입 청크가 있었고 v0.5 자산은 없었다. `b32-v05`에는 새 원고·Lab 진입·인덱스·R12 데이터 및 기존 도식 근거에 필요한 v0.4 원고가 있었다.

## 차단된 보조 명령

`npm_config_offline=true npm run mission:ui-check`가 내부에서 Chrome을 시작하려다 샌드박스에서 `browserType.launch: Target page, context or browser has been closed`와 `SIGABRT`로 종료했다. 문서에 기록된 이전 `all 21 card links introduce a mission` 점검에는 도달하지 못했다.

## 폭별 브라우저 확인 대기

| 폭 | Playwright 확인 항목 |
| --- | --- |
| 360·390px | 33화면 각각의 기본 및 drawer 열린 상태의 문서 폭, 초점 가두기·복귀, 배경·Esc·선택·뒤로 가기, P 단축키 우선순위 |
| 1000px | 고정 열, Scene 자동 펼침, 키보드 이동, 내부 초점, 이동·재로드 시 열림 기억 및 가로 넘침 |
| 1280×720 | 위치 띠와 상단 조작의 기본 배치, P와 56px 레일, 레일 펼침 시 본문 폭 유지, I7 상태 보존 |
| 1440×900 | 전체 인덱스와 P가 함께 열린 상태, 본문 폭에 따른 위치 띠 축약, 조작 영역 및 가로 넘침 |

대표 캡처는 `B32_V05_QA_OUTPUT`이 있을 때만 생성한다. Dark/Light 전환과 저장, Lab·용어사전 복귀, I11·I12 조작도 실제 브라우저에서 확인한다. [Playwright 명세](../../playwright/b32-learning-index-v05.spec.ts)

```sh
B32_V05=1 PLAYWRIGHT_PORT=4176 B32_V05_QA_OUTPUT=reports/b32-learning-index-v05/screens npx playwright test playwright/b32-learning-index-v05.spec.ts
B32_V04=1 PLAYWRIGHT_PORT=4175 npx playwright test playwright/b32-integrated-v04.spec.ts
B32_REVIEW=1 PLAYWRIGHT_PORT=4174 npx playwright test playwright/b32-learning-cycle.spec.ts
npx playwright test playwright/b32-story-web.spec.ts playwright/b32-lesson-v02.spec.ts playwright/b32-flow-preview.spec.ts
```

## 교차 검토 1회차 처리

Claude의 수정 전 Playwright는 16/18 통과였다. 실패한 두 검사는 모두 `다음` 직후 `이전`이 렌더에 남아 있던 화면 번호로 이동한 경우다. C1은 HEAD `298bfd0`의 작업 트리에서 검증했다. S4-5b 해설을 반영한 Claude 원고의 파일 해시는 `6041dbf81d69f7a061487a8f840b9ce5480871e3`이다. [교차 검토](claude-review-1.md) · [수정 전 Playwright 로그](playwright-logs/run1-v05.log)

| 항목 | 처리 | 확인 |
| --- | --- | --- |
| R1 · 연속 이동 | 상·하단 이전/다음과 ←/→/PageUp/PageDown이 같은 이동 함수를 사용한다. 이동 때마다 HashRouter가 즉시 갱신한 해시에서 활성 lesson의 화면 번호를 읽는다. 공용 `B32Story`의 모든 판에 같은 계산을 적용해 빠른 전환 중에도 주소·뒤로 가기 규칙을 유지한다. | 실패한 두 검사에 각 이동의 `data-screen` 단언을 넣었다. 별도 회귀 검사는 상·하 버튼과 두 키 쌍을 렌더 대기 없이 호출해 두 해시와 브라우저 뒤로·앞으로 가기를 검증한다. v0.4 브라우저 회귀는 Claude 재실행에 포함한다. |
| R2 · 모바일 로드맵 | 1000px 미만에서는 Scene 관점·제목·질문·화면 수·시작 링크를 바로 보여 주고, 목표·핵심 개념·화면 링크를 카드마다 하나의 `자세히`에 넣었다. 1000px 이상은 기존 구성을 유지한다. | 수정 전 360px 캡처의 전체 페이지는 4,403px이다. 개정 로드맵 영역의 기본 높이는 360px에서 글자 줄과 CSS 여백으로 추산해 약 1,730px이다. 새 Playwright 검사가 실제 높이를 `[R2]` 로그에 기록하고 1,800px 이하를 검증한다. 실측은 Claude의 브라우저 재실행 대기다. [수정 전 360px 캡처](screens/360-intro-roadmap.png) |
| R3 · I5 실패 톤 | v0.5 Git 네 사례는 중립 배경을 쓴다. 성공에는 `✓ 성공 · returncode 0`, 실패에는 `✕ 실패`와 기존 발표 색의 굵은 점선 테두리를 넣었다. | 비교 화면에서 성공 제목 3개와 실패 제목·점선 테두리를 확인하는 단언을 추가했다. 스타일 범위는 v0.5 Git 사례에 한정한다. |
| R4 · 레일 버튼 | 56px 레일의 펼치기 버튼을 한 글자 `»`로 표시하고 `학습 인덱스 펼치기` 접근성 이름을 붙였다. | 1280×720 검사에서 접근성 이름, 높이 44px 이상, Esc 후 초점 복귀를 확인한다. |
| R5 · 위치 띠 | 슬라이드 본문 폭이 900px 미만이면 활성 칸을 `4 · 화면 7/9` 형태로 줄이고, 관점 이름은 아래 요약과 링크 접근성 이름에 남겼다. | 360·390px 검사에 활성 칸의 축약, 아래 관점 요약, 띠가 두 줄 이하라는 단언을 넣었다. |

### C1 샌드박스 재검증

| 명령 | 결과 |
| --- | --- |
| `node_modules/.bin/vitest run src/b32Story/storyboardV05.test.tsx --no-cache` | **28/28 통과.** |
| `node_modules/.bin/vitest run --mode b32-v04 src/b32Story/storyboardV04.test.tsx --no-cache` | 공용 이동 변경 후 v0.4 **18/18 통과.** |
| `node_modules/.bin/vitest run --no-cache --maxWorkers=4` | **580/585 통과**, 47/48 파일. Phase B와 같은 `scripts/glossary_visual_contract.test.mjs` 5건 외 실패 없음. |
| `node_modules/.bin/tsc -b` | **통과.** |
| `node_modules/.bin/vite build --mode b32-v05 --outDir <임시 경로>` | **통과.** |
| `node_modules/.bin/vite build --mode b32-v04 --outDir <임시 경로>` | **통과.** |
| `npm_config_offline=true npm run build` | **통과.** 데이터 빌드로 변경된 추적 파일은 없다. |
| `B32_V05=1 PLAYWRIGHT_PORT=4176 node_modules/.bin/playwright test playwright/b32-learning-index-v05.spec.ts --list` | **1파일 20개 수집.** 360px 로드맵 측정과 연속 이동 회귀 검사 포함. |

빌드 산출물에서 v0.5 원고·인덱스 키·R12 초안이 검토 모드 `b32-v05`에만 포함되고, 공개 빌드에는 v0.4 원고도 포함되지 않는 것을 다시 확인했다. 수정 후 v0.5·v0.4·v0.3·기존 B3-2 브라우저 회귀와 360px 로드맵 실측은 Claude 실행 대기다.

## 변경 범위

```sh
git diff --stat ea31d98 -- . ':!content/mission-stories/main-m06' ':!src/b32Story' ':!playwright/b32-*' ':!reports/b32-learning-index-v05'
```

| 파일 | 변경 이유 |
| --- | --- |
| `package.json` (2 추가 / 1 삭제) | `dev:b32-v05` 등록 |
| `playwright.config.ts` (4 추가 / 3 삭제) | 전용 모드·기본 4176 포트·기존 서버 재사용 방지 |
| `src/App.tsx` (4 추가 / 3 삭제) | v0.5 Story와 Lab 지연 로딩 |
| `vite.config.ts` (7 추가 / 3 삭제) | 활성 검토 판의 원고·용어·SVG 빌드 검증 |

`data:build`로 새로 바뀐 추적 파일은 없다. 기존 콘텐츠·용어 데이터·지도·공통 미션 UI에는 변경이 없다. 최종 승인 후 Push는 Owner가 수행한다. `git push origin feature/b32-learning-index-v05`

## 원고 문의

- Claude가 S4-5b 해설에 0단위의 응답 처리 거부, 1–47단위의 필수 섹션 거부, 48단위의 불릿 거부를 구분해 반영했다. 도식은 R12 JSON의 단계·문구를 그대로 표시한다. [S4-5b 해설](../../content/mission-stories/main-m06/storyboard-v0.5.md#L836) · [교차 검토 답변](claude-review-1.md#원고-문의-답)

## 최종 QA 결과 (Claude · 샌드박스 밖 · 2026-11-28)

검증 대상: 교차 검토 1회차 반영 후 작업 트리(HEAD `298bfd0` + C1 수정). 이 결과를 담은 Claude 커밋이 최종 검증 SHA입니다. 로그의 로컬 경로는 `<worktree>`로 가렸습니다. 추가 수정 사이클은 1회만 사용했습니다(최대 2회).

| 검증 | 명령 | 결과 |
| --- | --- | --- |
| v0.5 Playwright | `B32_V05=1 PLAYWRIGHT_PORT=4176 B32_V05_QA_OUTPUT=reports/b32-learning-index-v05/screens npx playwright test playwright/b32-learning-index-v05.spec.ts` | **20/20 통과** ([run2-v05.log](playwright-logs/run2-v05.log)). 1차 16/18([run1-v05.log](playwright-logs/run1-v05.log), R1 연속 이동) → 2차 20/20. 360px 로드맵 실측 **1,582px**(수정 전 페이지 4,403px) |
| v0.4 Playwright 회귀 | `B32_V04=1 PLAYWRIGHT_PORT=4175 npx playwright test playwright/b32-integrated-v04.spec.ts` | **29/29 통과** ([log](playwright-logs/run2-v04-regression.log)). 기준 `ea31d98`과 같음 |
| v0.3 Playwright 회귀 | `B32_REVIEW=1 PLAYWRIGHT_PORT=4174 npx playwright test playwright/b32-learning-cycle.spec.ts` | **16/16 통과** ([log](playwright-logs/run2-v03-regression.log)) |
| 기존 B3-2 Playwright 회귀 | `npx playwright test playwright/b32-story-web.spec.ts playwright/b32-lesson-v02.spec.ts playwright/b32-flow-preview.spec.ts` | **69/69 통과** ([log](playwright-logs/run2-legacy-regression.log)). R1의 공용 이동 수정 후에도 공개 판·v0.2 계열 동일 |
| 미션 공통 UI 검사 | `npm run mission:ui-check` (4200 공개 모드 서버) | 실패 `all 21 card links introduce a mission` — **기준 커밋의 기존 실패와 같음**([log](playwright-logs/mission-ui-check.log)). 실행 중 다시 쓰인 추적 파일 `reports/mission-ui-standard/app-results.json`은 원래대로 되돌림 |
| Vitest·TypeScript·빌드 | Codex C1 샌드박스 결과 재사용 | v0.5 28/28 · v0.4 18/18 · 전체 580/585(실패 5 = 기존 `glossary_visual_contract`) · `tsc -b` · `b32-v05`·`b32-v04`·공개 빌드 통과. C1 이후 코드 변경 없음(거버넌스 §5 QA 증빙 재사용). Claude의 설계 커밋 기준 전체 Vitest도 552/557, 실패 5건 동일 |
| 비밀값 | 기존 `secret-check.cjs` 규칙 + 키·이메일·임시 경로 패턴 | 변경·신규 텍스트 파일 40개에서 발견 없음 |
| 실제 AI API 호출 | — | **0회**. 재현 R10·R11은 네트워크 없음, R12는 `urlopen` 가로채기(`example.invalid`), Playwright는 외부 요청을 모두 차단 |

**화면 확인 (Claude)** 1280×900 Dark: 인트로 로드맵, S3-4(I4), S3-5(I5 네 사례 나란히), S4-5a(I11 0.2와 1.0 비교), S4-5b(I12 52·추론 가정). 1280×720 P+레일, 1440×900 인덱스+P, 1000·390·360 대표 캡처([screens](screens/)). 33화면 × 360·390 가로 넘침과 drawer 상태는 Playwright로 확인했고, 모든 화면을 사람이 눈으로 본 것은 아닙니다.

**미검증** 실제 강의실 프로젝터·실기기 모바일, 화면 읽기 프로그램의 실제 낭독, 강의 시간(설계 §8 추정), B3-2 개념지도(미구현), 코디세이 공급자의 temperature·max_tokens·finish_reason 동작(미확인 표시 유지).
