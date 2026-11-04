# B3-2 미션 스토리 v0.1 — 실제 소스 근거·자체 QA·미검증·인수인계

> 대상: [storyboard-v0.1.md](storyboard-v0.1.md) · [assets/](assets/) · [assets/evidence/](assets/evidence/) · [preview/](preview/) · [_tools/](_tools/)
> 작업 브랜치 `content/b3-2-ai-git-story` (기준 `origin/main` `08d1e1f`) · 근거 소스 [Codyssey_B3-2](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2) `be21c49`
> 상태: **Claude 자체 QA 완료 · GPT 독립 검토 전 · Owner 승인 전 · 웹 통합 전 · 동료평가 전 초안**
> 이 문서가 B3-2 Story의 QA·handover 기록이다. 별도 보고서를 만들지 않는다(학습 운영 정책 §7). 동료평가 피드백도 새 스토리가 아니라 이 초안의 개정으로 반영한다.

## 1. 다시 실행하는 법

```bash
cd content/mission-stories/main-m06/_tools
python -I capture_demo.py <Codyssey_B3-2 경로>   # 근거 다시 만들기: 임시 복제본에서 실제 B3-2 함수 실행 → ../assets/evidence/ (AI API 호출 없음)
python -I build_figures.py                       # 그림 18개(9종 × PC·모바일)
node preview.cjs                                 # 그림·원고·근거 검사 + 인트로·8화면 미리보기(PC Dark·일부 Light·모바일)
node preview.cjs --check-only                    # 검사만
```

`preview.cjs` 환경변수: `PLAYWRIGHT`(기본 `<저장소>/node_modules/playwright`), `CHROME`(기본 Windows·macOS Chrome 경로), `B32`(기본 저장소 옆 `../Codyssey_B3-2`, 학습가이드 장 실존 검사용).
이번 실행 환경: Windows 11 · Git 2.54.0 · Python 3.14.6 · Node 24.16.0 · Playwright 1.63.0 · Chrome 156.0.8078.80. 이 worktree에는 `node_modules`가 없어 `PLAYWRIGHT=<메인 체크아웃>/node_modules/playwright`로 실행했다. 미리보기 글꼴은 저장소의 `src/assets/fonts/PretendardVariable.woff2`.

## 2. 산출물

| 구분 | 내용 | 상태 |
| --- | --- | --- |
| 강의 원고 | 인트로 + 4 Scene × 2 = 8화면. 화면마다 제목·학습 질문·핵심 메시지·화면 설명·시각자료·대체텍스트·근거·강사 스크립트·학습자 접힘 설명·이해 확인·연결. 발표자 노트(시연 ①~⑥), 강의 시간표, 부록 A(공식·구현·표현), 부록 B(화면별 개념 수) | 완료 |
| 그림 | F0 위치 띠(`s1`~`s4`) · F1 전체 구조도(`all`·`s1`~`s4`·`return`) · F2 직접 작성 vs AI 초안 · F3 git status/diff · F4 argparse→subprocess→운영체제→Git · F5 stdout/stderr/returncode 분기 · F6 보낼 문맥과 안전 검사 · F7 API 요청·응답 · F8 commit/PR 출력 — 각 PC(폭 1200)·모바일(폭 360) SVG 18개 | 완료 |
| 실행 근거 | `assets/evidence/` 5개: git 출력, AI에게 보내는 문맥 원문(806자), 요청 본문 구조(키 없음), subprocess 결과(0/128), 검증기 실행 결과(교육용 입력) | 완료 |
| 미리보기 | `preview/` PC 1280×720 Dark: 인트로+8 · Light: S1-2·S3-2·S4-2 · 모바일 390×844: 인트로+8 | 완료 |
| 도구 | `capture_demo.py`(근거), `build_figures.py`(그림), `preview.cjs`(검사·미리보기), `screens.json`(화면 문구 사본) | 완료 |
| 개념지도 | B3-2 개념지도는 이번 범위가 아니다. 스토리 → 지도 연결은 **미구현** | 범위 밖 |

변경 범위: 새 폴더 `content/mission-stories/main-m06/`만 추가했다. 기존 코드·canonical 데이터(`data/`)·공개 라우트(`src/`)·다른 미션 콘텐츠·B3-2 저장소는 바꾸지 않았다(`git status`: 이 폴더 외 변경 0, B3-2 작업 트리 변경 0).

## 3. 실제 소스 근거

### 3.1 작업 지시서 §5 정확성 항목

| # | 항목 | 원고의 표현 | 근거 | 판정 |
| --- | --- | --- | --- | --- |
| 1 | `commit`은 프로그램 입력값이지 `git commit` 실행이 아니다 | S2-1 메시지·이름표 "commit은 초안의 종류다 · git commit을 실행하지 않는다", 이해 확인 | `main.py` `build_parser()` `choices=("commit", "pr")`. `git_collector.py`가 실행하는 Git 명령 6개에 `commit`·`push` 없음 | PASS |
| 2 | subprocess는 셸 없이 Git 실행 파일을 직접 실행할 수 있다 | S2-1 "목록 그대로 넘긴다 · 셸을 거치지 않는다" | `_git()` `subprocess.run(["git", …])`, `shell` 인자 없음(기본 `False`) | PASS |
| 3 | Git 변경은 로컬 저장소에서 가져온다 | S1-2 메시지·화면 설명 "GitHub가 아니라 로컬 저장소를 읽는다", F1 로컬 영역 | `collect_changes(Path.cwd())`, `git status`·`git diff`·`git diff --cached`만 실행(원격 명령 없음) | PASS |
| 4 | 미추적 파일은 이름만 수집 | S3-1 화면 설명·F6 강조 칸·이해 확인 | `security.py` `"Untracked files (names only):"`, `git diff`는 미추적 내용을 포함하지 않음. B3-2 `test_git_collector.py` | PASS |
| 5 | AI에게 시스템 프롬프트와 검사된 Git 문맥을 보낸다 | S3-2 화면 설명·F7 `system`=작성 규칙, `user`=Git 문맥 806자 | `ai_client.py` `generate()` messages, `main.py` `prepare_context()` → `client.generate(system, context)`. `evidence/demo-request.json` | PASS |
| 6 | 코디세이 API 사용 ≠ 모델이 코디세이 서버에 있다 | F1·F7 AI 모델을 별도 점선 상자로, "실행 위치는 확인 범위 밖", "내부 연결은 공개되지 않음". S3-2 강사 스크립트 3 | 확인된 것은 URL·모델 이름·응답 형식뿐(B3-2 README·QA) | PASS |
| 7 | 16,000자 초과 시 요청 중단 | S3-1 F6 ③ "16,000자 초과 → 요청하지 않음" | `prepare_context(limit=16000)` → `SecurityError` | PASS · **보충**: 지시서는 "안전 모드에서"라고 했지만 실제 코드의 한도 검사는 `if safe:` 블록 **밖**에 있어 `--unsafe`에서도 적용된다. 원고는 실제 동작대로 적었다(S3-1 근거·강사 스크립트, 부록 A) |
| 8 | PR How to Test는 검증기가 고정 문구로 대체 | S4-1 F8 주황 줄, 이해 확인 | `validate_pr()` 마지막 줄. `evidence/validator-demo.txt`(교육용 입력 "모든 테스트를 통과했습니다" → 고정 문구로 교체) | PASS |
| 9 | AI는 변경을 읽지만 수정 이유를 반드시 알지는 않는다 | S4-2 화면 설명·강사 스크립트 3·이해 확인 | 보내는 문맥은 브랜치·상태·파일명·diff뿐(`demo-context.txt`). 이유를 담는 칸이 없다 | PASS |
| 10 | 자동 커밋·PR 등록 없음 | F1 "커밋 · PR을 만들지 않는다", S4-1 화면 설명, 시연 ⑥(`git log -1` 그대로) | `main.py`는 출력만. 연습 복제본에서 실행 뒤 `git log -1 --oneline` = `7b2c6af` 그대로, `git status`에 `M` 그대로(2026-11-04 확인) | PASS |

### 3.2 그림에 쓴 실제 값

| 값 | 그림 | 출처 | 자동 대조 |
| --- | --- | --- | --- |
| ` M docs/learning/02-python-ai-api.md`, `@@ -26,6 +26,8 @@`, `+실습 메모: …`, `git diff --cached` 출력 없음 | F3, F5, F6 | `evidence/demo-git-output.txt` `[재현]` | `preview.cjs` PASS |
| 문맥 6칸 순서와 806자 | F6, F7 | `evidence/demo-context.txt`, `demo-request.json`의 `context_chars` | PASS |
| returncode 0 / 128, stderr `fatal: not a git repository …` | F5 | `evidence/subprocess-results.txt` | PASS |
| URL `https://copa.codyssey.kr/v1/chat/completions`, 모델 `gpt-5-mini` | F7 | `[실제 실행]` B3-2 README·QA | PASS(모델) |
| commit 제목 35자, PR 제목 37자 | F2, F8 | `[실제 실행]` B3-2 `reports/QA.md`. 글자 수는 다시 셌다 | — (원고·그림 일치 육안 확인) |
| How to Test `- 실행 권장: python -m unittest discover -s tests` | F8 | `validators.py`, `evidence/validator-demo.txt` | PASS |
| API 키 | 모든 그림·근거 | 표시하지 않음(`••••`). `preview.cjs`가 `sk-`·`ghp_`·`github_pat_`·`AKIA`·`Bearer <값>` 패턴 검사 | PASS(0건) |

**재현의 범위.** 2026-10-20 실제 실행의 터미널 전문은 남아 있지 않다. 그때 AI가 설명한 변경(`docs/learning/02-python-ai-api.md`에 실습 메모 한 줄 추가, `be21c49`에 커밋됨)을 `7b2c6af` 위에 미커밋 변경으로 다시 만들고, B3-2의 `collect_changes()`·`prepare_context()`를 그대로 실행했다. 실제 실행 때 브랜치가 무엇이었는지, 그 변경을 `git add`했는지는 기록이 없다. 재현에서는 `main`·미스테이징으로 두었고 그림에 "재현"을 표시했다.

**만들어 넣지 않은 것.** 실제 commit 본문과 PR의 Why·What 문장은 기록이 없어 그림에 괄호 자리("원문 미보존")로 두었다. 강의에서는 시연 ⑤로 새로 받아 보여 준다.

## 4. 공식 요구사항과 실제 구현의 차이

`[공식]` 근거는 `data/raw/main/m06/m06-terminology-raw.md`(원천 추출, raw)다. Notion 원문은 이번에 다시 열지 않았고, B3-2 저장소도 "별도 공식 평가 원문 미확보"라고 기록했다(`reports/QA.md`).

| 공식 원천의 항목 | B3-2 구현 | 원고 처리 |
| --- | --- | --- |
| 재생성(형식 불일치 시 재시도) | **없음.** 형식이 틀리면 `DraftError`로 멈추고 요청은 명령당 1회 | 원고에서 "자동 재시도 없음"으로 말하고 재생성을 기능처럼 말하지 않음(부록 A) |
| temperature · max_tokens | 옵션으로 있고 지정할 때만 전송. 코디세이 지원 **미확인** | 강의 본문에서 다루지 않고 묻는 경우에만(S3-2 강사 스크립트 6) |
| safe-mode · 마스킹 | 기본 켜짐. 비밀 경로 차단, 이메일·Bearer·자격증명 할당·알려진 토큰 가림, 불완전한 개인키 블록 차단 | S3-1. 자동 검사의 한계를 함께 말함 |
| 출력 검증 · 후처리 | 제목 길이, PR 섹션·불릿, 테스트 주장 차단, How to Test 교체 | S4-1·S4-2 |
| Human-in-the-loop | 출력만 하고 사람이 커밋·PR | S1-1·S4-2 |
| REST API · HTTP · JSON | Chat Completions 형식 HTTPS POST | S3-2 |
| 미추적 파일 처리 | 원천에 언급 없음. 구현은 이름만 | S3-1에서 "현재 구현의 선택"으로 표현 |

## 5. 자체 QA (작업 지시서 §8)

| # | 항목 | 결과 | 근거 |
| --- | --- | --- | --- |
| 1 | 4 Scene, 8슬라이드 수량 | **PASS** | `preview.cjs`: 화면 8개, Scene별 2개. 인트로 별도. 제목 8개는 지시서 §3 표와 글자 단위로 같다 |
| 2 | 공식 요구사항·실제 B3-2 소스와 대조 | **PASS** | §3·§4. 지시서 §5 10항목 모두 반영, 16,000자 한도는 실제 동작에 맞춰 보충 |
| 3 | 입문자 관점 과밀도 | **PASS(자체)** | 화면당 메시지 1문장(25~46자)·설명 1~2문장(54~78자)·그림 1개 + 위치 띠. 핵심 개념 화면당 1~2개(부록 B). 코드 줄 해설 없음, 터미널·JSON은 실제 출력만. 연결 용어가 많은 S3-2(9개)는 접힘 영역이라 강의 화면에 나오지 않는다 |
| 4 | 핵심 그림 PC·모바일 가독성 | **부분 PASS · 시각 검수 미검증** | 자동: 18개 SVG의 모든 상태(34개)에서 글자 상자·뷰박스 넘침(가로·세로)·겹침 0, 표시 최소 폭(PC 900px·모바일 328px) 기준 14px 이상. 실제 미리보기: 1280×720 9화면 세로 넘침 0, 그림 글자 실측 최소 15.4px(S3-2·S4-2), 위치 띠 16.8px. 390px 가로 넘침 0, 모바일 그림 15.9px. Claude가 PNG를 직접 보고 고친 것: 단일 상태 그림이 흐려지던 CSS, 위치 띠 폭 초과, F1 AI 모델 칸 세로 넘침, F5 returncode 화살표 방향, 모바일 F1의 요청·응답 화살표 출발점(초안 → Python), 모바일 F5 화살표 이름표 겹침, 모바일 레이아웃의 그림 높이 0. **강의실 프로젝터·실제 360px 기기·Owner 시각 검수는 미검증** |
| 5 | 강사 설명과 실제 시연 가능성 | **부분 PASS** | 발표자 노트 ①~④·⑥은 2026-11-04 연습 복제본에서 키 없이 실행해 출력 확인: 테스트 14개 OK, `--help`의 `{commit,pr}`, 변경 없음 → "변경 사항이 없습니다."·요청 0회, 저장소 밖 → `fatal: not a git repository …`·요청 0회, 설정 없음 → "확인된 API 주소와 모델이 필요합니다…"·요청 0회, 문맥 806자, `git log -1` 그대로. **⑤ 실제 API 요청은 키가 없어 실행하지 않았다(미검증)**. ①의 GitHub `git clone`은 로컬 경로 복제로 대신 확인했다 |
| 6 | 기존 UI 기준과의 충돌 | **PASS(자체) · 확인 요청 1건** | `MissionStoryOverview` 입력값(코드·제목·핵심 질문·학습 목표·흐름·Scene 카드)을 원고에 제공. 슬라이드 Dark 기본·Light 선택, `--presentation-*` 토큰만 사용, SVG 필터·반전 없음, `LearningFocusNav`·발표자 창 계약 변경 없음. Scene 수 4는 가변 길이 기준과 맞다. **위치 띠(F0)는 새 시각 요소**다. 슬라이드 콘텐츠 안의 그림이라 GNB·공통 UI를 바꾸지 않지만, 웹에서 각 화면 위에 고정할지 Owner 확인이 필요하다(§7) |

### 학습 운영 정책 §7 — 콘텐츠 독립 검토 전 자체 점검

| 항목 | 결과 |
| --- | --- |
| 불필요한 선·용어·장식이 주의를 분산하지 않는가 | PASS(자체) — 화면당 그림 1개, 선 범례 고정(실선·점선 두 종류), 상세 코드는 학습가이드로 |
| 흐름·관계 유형·기술 사실·실제 구현 경계 | PASS(자체) — 구조도는 실행 순서(번호)만 표시, 외부 내부는 점선으로 "비공개", 재현·실제 실행·보충을 태그로 구분 |
| 스토리 장면 ↔ 개념지도 ↔ 용어 ID | 용어 ID PASS(`preview.cjs`가 화면별 연결 42개(용어 32종)의 실존 대조) · 개념지도 **미구현** |
| 강사 시연 가능 · 강의 후 혼자 탐색 | PASS(자체) — 장면마다 강사 스크립트·접힘 설명 분리, 키 없는 시연 경로 확인 |
| GPT 독립 검토 · Owner 시각 검수 | **미검증** |

## 6. 미검증 항목

| 항목 | 내용 |
| --- | --- |
| 실제 API 시연(⑤) | 이번 작업에서 AI API를 호출하지 않았다(키 없음·비용). 실제 응답 형식은 2026-10-20 사용자 실행 기록에 근거한다 |
| commit 본문·PR Why/What 원문 | 기록이 없어 그림에 비워 두었다. 동료평가 전 Owner가 ⑤를 실행해 원문을 남기면 S4-1을 실제 문장으로 바꿀 수 있다(요청 2회) |
| 실제 실행의 브랜치·스테이징 상태 | 기록 없음. 재현은 `main`·미스테이징 |
| 코디세이 API 뒤 구조 | 모델 실행 위치·내부 연결은 확인하지 않았다(원고도 단정하지 않음) |
| 미션 원문 | Notion 원문 재확인 없음. 원천 추출 raw와 B3-2 기록에 근거 |
| Owner 시각 검수 | 강의실 대형 화면·프로젝터, 실제 360/390px 기기, Safari·Firefox(미리보기는 Chrome) |
| 실제 앱 렌더링 | 미리보기는 정적 흉내다. `MissionStoryOverview`·`PresentationSurface`·`LearningFocusNav` 안의 배치, 1000×720·360×800, 테마 전환은 웹 통합 때 확인 |
| 강의 시간·학습 효과 | 시간표는 제안이다. 이해 확인 질문의 효과는 동료평가·시범 강의에서 확인 |
| 시연 ①의 원격 복제 | GitHub 저장소 공개 여부와 발표 PC의 인증 상태를 확인하지 않았다. 로컬 복제로는 같은 결과를 확인했다 |
| macOS 실행 | 시연 명령은 Windows에서만 확인. macOS는 B3-2 README의 `python3` 안내를 따름 |

## 7. GPT 독립 검토 · Owner 확인 요청

1. **용어사전 `commit-subcommand` 정의 불일치.** 원천 추출에서 "commit 명령 = commit subcommand, 커밋 제목 생성"은 B3-2 프로그램의 `commit` 입력을 가리키는데, 현재 용어 문서 `content/terms/commit-subcommand.md`는 `git commit` 하위 명령으로 정의한다. 이 원고는 연결하지 않았다(S2-1 연결 아래 메모). canonical 데이터라 수정하지 않았다 — 별도 콘텐츠 개정 여부를 Owner가 결정한다.
2. **화면에 보이는 질문.** 지시서의 확정 제목 중 다섯 개가 질문형이라, 화면에는 확정 제목을 쓰고 "학습 질문"은 발표자 노트로 두었다(B1-1은 학습 질문을 화면에 표시). 화면 표시 방식을 검토해 주세요.
3. **위치 띠(F0).** 각 Scene에서 전체 구조도의 해당 부분만 강조한다는 지시에 맞춰 만든 새 요소다. F1에도 같은 `s1`~`s4` 상태를 두었다. 띠를 화면마다 둘지, F1을 "위치 보기"로 펼칠지 결정이 필요하다.
4. **실제 응답 원문 확보.** S4-1의 괄호 자리를 실제 문장으로 채우려면 Owner의 실제 실행 1회(요청 2회)가 필요하다. 하지 않으면 현재처럼 "원문 미보존"으로 강의한다.

## 8. 웹 통합 인수인계 (Codex · Owner 승인 후)

- **원고 원본**은 `storyboard-v0.1.md`다. `_tools/screens.json`은 같은 문구의 사본이며 `preview.cjs`가 글자 단위로 대조한다. 원고를 바꾸면 사본도 함께 바꾸고 검사를 다시 돌린다.
- **그림**: SVG를 인라인으로 넣고 루트 `data-state`만 바꾼다(`<img>`로 넣으면 첫 상태만 보인다). 화면별 파일·상태는 `screens.json`의 `desktop`·`mobile`·`journey`. 클래스 접두사는 `b32s-`로 다른 미션 그림과 겹치지 않는다. 색은 `--presentation-*` 토큰을 상속한다.
- **인트로**: `MissionStoryOverview`에 스토리보드 "인트로 입력값" 표를 그대로 쓴다. 펼침 그림은 F1 `all`.
- **연결**: 용어 ID는 모두 `data/curated/glossary-master-v0.1.yaml`에 있다. 학습가이드는 이 사이트에 B3-2 가이드가 없어 B3-2 저장소 `be21c49`의 `docs/learning/` 고정 링크다. 외부 링크는 새 창 이동으로만 쓰고 복귀 주소로 쓰지 않는다(UI 기준). 개념지도 연결은 미구현으로 표시한다.
- **공개 route·mission 등록·`src/` 변경은 이번 단계에서 하지 않았다.** 등록과 경로는 웹 통합 작업에서 UI 기준 v1.2에 따라 정한다.
- 미리보기 PNG는 검토용이며 웹 렌더러 데이터가 아니다.
