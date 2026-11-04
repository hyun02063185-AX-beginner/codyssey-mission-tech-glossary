# B3-2 미션 스토리 스토리보드 v0.1 — Git의 변경 내용을 AI가 어떻게 설명할까?

> 상태: **동료평가 전 교육 콘텐츠 초안 (GPT 독립 검토 전 · Owner 승인 전 · 웹 통합 전)** · 인트로 + 4 Scene × 2 = 강의 화면 8개 · 슬라이드형 Dark 기본
> 미션: 본과정 M06 / B3-2 — 내가 고친 코드 설명을 AI가 대신 써주는 도우미 만들기 (`main-M06`)
> 실제 구현: [Codyssey_B3-2][b32] 원격 `main` `be21c49` (프로그램 코드는 `268fa7b` 이후 같고, 그 뒤 커밋은 문서·기록만 바꿈). 그림 속 터미널·JSON 값은 [assets/evidence/](assets/evidence/)의 실제 실행 결과에서 가져왔다.
> 그림: [assets/](assets/) · 자체 QA·근거·인수인계: [review.md](review.md) · 미리보기: [preview/](preview/) · 도구: [_tools/](_tools/)
>
> B3-2 저장소의 학습자료(`docs/learning/` 00~07장·용어집)는 바꾸지 않았다. 이 원고는 대면 강의에서 **흐름과 관계**를 보여 주고, 코드 한 줄씩의 해설·실습·오류 해결은 그 학습자료와 용어사전으로 보낸다.

## 읽는 법

| 표시 | 뜻 |
| --- | --- |
| **화면** | 강의 화면에 나오는 것: 제목 · 핵심 메시지 · 화면 설명(한 줄) · 위치 띠 · 핵심 시각자료. 그 밖의 글은 화면에 넣지 않는다 |
| **학습 질문** | 강사가 화면을 열며 던지는 질문. 발표자 노트에 둔다(화면에는 확정 제목을 쓴다) |
| **강사 스크립트** | 강사가 말하고 시연할 것. 화면에 나오지 않는다(발표자 노트) |
| **학습자 접힘 설명** | 강의 뒤 혼자 볼 때 펼치는 짧은 글. 강의 중에는 접어 둔다 |
| **이해 확인** | 강의 중 묻는 짧은 질문과 기대하는 답 |
| **연결** | 용어사전 ID, B3-2 학습가이드 장. B3-2 개념지도는 아직 없어 지도 연결은 **미구현** |
| `[공식]` | 미션 원천 추출 `data/raw/main/m06/` (Notion 원문 자체는 이번에 다시 열지 않음) |
| `[구현]` | B3-2 소스 `be21c49` |
| `[실제 실행]` | 사용자가 2026-10-20 Windows PowerShell에서 실제 코디세이 API로 `commit`·`pr`을 각 1회 실행한 결과. 설정·요청 횟수는 B3-2 `reports/QA.md`, 출력 전문은 `[실제 실행 · 2026-10-20 · 사용자 ChatGPT 대화 공유]` 원문(`assets/evidence/real-output-2026-10-20.txt`). 이 스토리 제작 중에는 API를 다시 호출하지 않았다 |
| `[재현]` | 그 실행에서 AI가 설명한 변경을 연습 복제본에서 다시 만들고 B3-2 함수를 그대로 실행한 결과(`_tools/capture_demo.py`). AI API는 호출하지 않았다 |
| `[보충]` | 교육용 단순화·예시. 실제 구조나 실행 기록과 1:1이 아니다 |

- **이 강의의 실제 사례는 하나다.** B3-2 학습자료 `docs/learning/02-python-ai-api.md`에 "실습 메모" 한 줄을 더한 변경. 그 변경을 Git이 보여 주고(S1-2), Python이 모으고(S2·S3-1), AI가 설명한(S4-1) 과정을 따라간다.
- `argparse`·`JSON`은 이전 미션에서 배운 개념이라 역할만 한 문장으로 짚는다. `dataclass`·`pathlib`·정규표현식 문법은 강의에서 다루지 않는다(학습가이드 01·05장).

---

## 인트로 입력값 (`MissionStoryOverview` 재사용)

| 항목 | 값 |
| --- | --- |
| 미션 코드·강의 제목 | B3-2 · Git의 변경 내용을 AI가 어떻게 설명할까? |
| 핵심 질문 | 내가 고친 내용을 AI가 설명하려면, 무엇이 어디로 전달되어야 할까? |
| 학습 목표 | ① `git status`·`git diff`에서 무엇이 바뀌었는지 읽는다 ② Python이 subprocess로 Git을 실행하고 returncode로 다음 작업을 정한다는 것을 설명한다 ③ AI에게 보내는 데이터와 API 요청·응답의 흐름을 말한다 ④ AI 초안을 검증하고 사람이 확인한 뒤에 쓰는 이유를 설명한다 |
| 강의 흐름 | 변경을 읽는다 → Git을 실행한다 → AI에게 묻는다 → 초안을 확인한다 |
| 펼침 그림 | F1 전체 동작 구조도 `assets/f1-overview-desktop.svg` / `-mobile.svg` 상태 `all` |
| Scene 카드 | Scene 1 변경 내용은 Git이 알고 있다 · Scene 2 Python이 Git에게 묻는다 · Scene 3 AI에게 보내고 답을 받는다 · Scene 4 AI의 초안을 사람이 완성한다 |

**F1 대체텍스트** B3-2 전체 동작 구조도. 왼쪽 실선 영역은 내 컴퓨터(로컬), 오른쪽 점선 영역은 인터넷 너머의 외부 서비스다. 로컬의 Python 프로그램(`python main.py commit` 또는 `pr`)이 ① Git을 실행해 변경 내용을 받고, ② 검사한 내용을 코디세이 API에 요청으로 보내고, ③ 응답을 받는다. 코디세이 API와 AI 모델 사이의 내부 연결과 모델의 실행 위치는 공개되지 않았다(점선). Python은 ④ 응답을 검증해 검토용 초안으로 터미널에 출력하고, ⑤ 사람이 읽고 확인한 뒤 직접 커밋하거나 PR을 쓴다. 프로그램은 커밋이나 PR을 자동으로 만들지 않는다.

**강사 스크립트 — 시작 (3분)**
1. 핵심 질문을 읽는다. "AI가 내 코드를 설명하려면, AI는 내 컴퓨터를 들여다볼까요?" 손을 들게 하고 답은 정리하지 않는다. 마지막 화면(S4-2)에서 같은 그림으로 돌아온다.
2. F1을 펼쳐 **경계선 하나**만 짚는다. "왼쪽은 내 컴퓨터, 오른쪽은 인터넷 너머입니다. 오늘은 무엇이 이 선을 넘어가고, 무엇이 넘어가지 않는지를 봅니다."
3. **선수개념 세 가지**를 말로만 짚는다.
   - **커밋 메시지**: 변경 기록(커밋)에 붙이는 한 줄 설명. **PR**: 내 브랜치의 변경을 합쳐 달라는 요청과 그 설명.
   - **API**: 프로그램이 다른 프로그램에 일을 부탁하는 약속된 창구.
   - 오늘 쓰는 명령은 `python main.py commit`과 `python main.py pr` 두 가지다. 여기서 `commit`·`pr`은 **만들 초안의 종류**다(S2-1에서 다시).
4. 위치 띠를 소개한다. "모든 화면 위에 Git → Python → AI API → 결과 띠가 있고, 지금 어디에 있는지 주황 테두리로 표시됩니다."

---

## 화면 구성 공통 (웹 통합 시 기준)

- **강의 화면(1280×720 이상)**: 위에서부터 Scene 이름 → 화면 번호·제목 → 핵심 메시지(가장 큰 글자) → 화면 설명 1줄 → **위치 띠** → 핵심 시각자료 1개. 미리보기 [preview/](preview/)의 `pc-*.png`가 이 배치다.
- **위치 띠** `assets/f0-journey-desktop.svg` / `-mobile.svg`, 상태 `s1`~`s4`: F1 구조도의 네 역할을 한 줄로 줄인 것이다. 현재 Scene 칸만 주황 테두리, 나머지는 흐리게. AI API 칸만 점선 테두리(외부). 인트로에는 띠 대신 F1 전체를 쓴다. F1에도 같은 상태 `s1`~`s4`가 있어, 웹에서 "전체 그림에서 위치 보기"로 펼칠 수 있다.
- **경계**: 내 컴퓨터(로컬)는 실선 영역, 외부 서비스는 점선 영역. 이 약속은 F1·F7과 위치 띠에서 같다.
- **역할 표시**: Git = 네모 G(금색), Python = 동그라미 Py(파랑), AI API = 마름모 AI(점선 상자), 결과 = 둥근 칸 "초안"(초록). 강조는 주황 굵은 테두리 + 글자 이름표. 색만으로 구분하지 않는다.
- **선**: 실선 화살표 = 실제로 오가는 명령·데이터(번호 = 순서), 점선 = 공개되지 않은 내부·경계, 가는 선 = 대응(이름표).
- **Presentation Theme**: Dark 기본, Light 선택. 모든 SVG는 `--presentation-*` 토큰을 쓰므로 인라인으로 넣으면 두 모드가 같은 배치로 바뀐다(B1-1·B6-1과 같은 방식, `data-state`로 상태 전환). SVG에 invert·필터를 쓰지 않는다.
- **터미널·JSON 그림**: 실제 출력 글자를 그대로 쓰고, 긴 줄은 `…`로 줄였으며 줄인 곳을 그림 안에 적었다. **API 키는 어떤 그림에도 없다**(`••••`로 표시).
- **모바일(360·390px)**: 그림은 `-mobile.svg` 세로형을 쓴다. 미리보기 `mobile-*.png`.
- **접힘**: "학습 질문"·"학습자 접힘 설명"·"이해 확인 답"·"연결"은 강의 화면에서 접어 두고, 강의 뒤 자율 탐색에서 펼친다.

---

## Scene 1 — 변경 내용은 Git이 알고 있다

중심: **Git = 변경을 기록하고 보여 준다** · 위치 띠 `s1` · 핵심 개념: AI 초안 + 사람 확인 · 로컬 저장소의 diff

### S1-1 · 왜 변경 내용을 AI에게 설명시키려 할까?

| 화면 | |
| --- | --- |
| 제목 | 왜 변경 내용을 AI에게 설명시키려 할까? |
| 학습 질문 | 변경 설명을 직접 쓸 때 무엇이 어려울까? |
| 핵심 메시지 | AI가 초안을 쓰고, 사람은 확인하고 고친다. |
| 화면 설명 | 직접 쓰려면 바뀐 줄을 다시 읽고 문장을 만들어야 한다. B3-2는 그 첫 초안을 AI에게 맡긴다. |
| 핵심 시각자료 | F2 `assets/f2-why-desktop.svg` (모바일 `-mobile.svg`) · 위치 띠 `s1` |
| 대체텍스트 | 두 가지 작성 방식 비교. 왼쪽 '직접 쓸 때'는 1 바뀐 줄을 다시 읽고 2 무엇을 왜 바꿨는지 정리해 3 짧은 문장으로 쓴다. 흔한 결과 예(보충)는 '수정' 한 단어로, 무엇을 고쳤는지 알 수 없고 B3-2 검증기도 이 제목을 거절한다. 오른쪽 'B3-2를 쓸 때'는 1 Git이 바뀐 줄을 알려 주고 2 AI가 초안을 쓰고 3 사람이 확인하고 고친다(강조). 실제 B3-2 출력 제목은 '학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요'로, 무엇이 바뀌었는지 드러난다. |
| 근거 | 오른쪽 제목 `[실제 실행]`. 왼쪽 "수정"은 `[보충]` 흔한 예이며, `validators.py`가 `수정`·`변경`·`update`·`fix`·`changes`를 제목으로 거절하는 것은 `[구현]`(`evidence/validator-demo.txt`에서 실행 확인) |

**강사 스크립트**
1. "최근에 쓴 커밋 메시지를 떠올려 보세요. 'update', '수정', '파일 추가'… 써 본 적 있죠?" 웃으며 넘어간다.
2. 왼쪽 세 단계를 짚는다. 좋은 설명을 쓰려면 **바뀐 줄을 다시 읽고, 무엇을·왜 바꿨는지 정리**해야 한다. 바쁘면 이 과정을 건너뛰고 "수정"이 된다.
3. 오른쪽: B3-2는 **첫 초안을 AI에게 맡긴다**. 이 제목은 실제로 B3-2를 실행해 받은 것이다. "무엇이 바뀌었는지가 제목에 드러나죠."
4. **주황 칸을 반드시 짚는다.** "AI가 쓴다고 끝이 아닙니다. 확인하고 고치는 것은 여전히 사람입니다." 이 문장이 Scene 4의 복선이다.
5. **과장하지 않는다.** "AI를 쓰면 몇 배 빨라진다" 같은 수치는 말하지 않는다. 확인된 것은 "빈 화면에서 시작하지 않는다"까지다.
6. 공식 미션 이름이 "내가 고친 코드 설명을 AI가 **대신** 써주는 도우미"라는 점을 짚고, "대신 쓰는 것은 초안까지"라고 정리한다.

**학습자 접힘 설명** 커밋 메시지와 PR 설명을 직접 쓰려면 바뀐 줄을 다시 읽고 무엇을, 왜 바꿨는지 정리해야 합니다. B3-2는 Git이 알려 주는 변경 내용을 AI에게 보내 첫 초안을 받습니다. 실제 실행에서는 "학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요"라는 제목이 나왔습니다. 하지만 초안이 맞는지 확인하고 고치는 일은 여전히 사람이 합니다.

**이해 확인** "AI 초안이 나오면 사람은 무엇을 하나요?" → *실제 변경과 맞는지 확인하고 고친 뒤, 직접 커밋하거나 PR에 씁니다.*

**연결** 용어 `commit-message-convention`, `human-in-the-loop`, `ai-api`, `pull-request` / 가이드 [03 커밋 생성][g03], [07 전체 실습][g07]

---

### S1-2 · Git은 무엇이 변경됐는지 알고 있다

| 화면 | |
| --- | --- |
| 제목 | Git은 무엇이 변경됐는지 알고 있다 |
| 학습 질문 | AI보다 먼저, 무엇이 바뀌었는지 아는 것은 누구일까? |
| 핵심 메시지 | Git은 내 컴퓨터의 저장소에서 바뀐 줄을 보여 준다. |
| 화면 설명 | git status는 어떤 파일이, git diff는 어떤 줄이 바뀌었는지 알려 준다. GitHub가 아니라 로컬 저장소를 읽는다. |
| 핵심 시각자료 | F3 `assets/f3-diff-desktop.svg` (모바일 `-mobile.svg`) · 위치 띠 `s1` |
| 대체텍스트 | 실제 B3-2 실행에서 AI가 설명한 변경을 연습 저장소에서 다시 만든 터미널 화면(재현). git status --short는 ' M docs/learning/02-python-ai-api.md'를 보여 준다. M은 고친 파일이고 아직 git add 전이다. git diff의 @@ -26,6 +26,8 @@ 줄은 26번째 줄 근처에서 6줄이 8줄이 되었다는 위치 표시다. 앞이 빈칸인 줄은 그대로인 주변 문맥이고, +로 시작하는 두 줄('실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다.'와 빈 줄)이 새로 생긴 줄이다. -로 시작하는 지워진 줄은 이번 변경에 없다. git diff --cached는 git add한 변경을 보여 주며 이번에는 출력이 없다. 긴 줄과 머리 줄 일부는 줄여서 표시했다. |
| 근거 | `[재현]` `evidence/demo-git-output.txt` (B3-2 `7b2c6af` + 실습 메모 한 줄, 미커밋). 이 줄은 `be21c49`에 함께 커밋되었다 |

**강사 스크립트**
1. "AI보다 먼저 무엇이 바뀌었는지 아는 건 누구일까요?" → **Git**이다. 프로그램은 이 정보를 Git에게 물어볼 뿐이다.
2. 시연(발표자 노트 ③): 연습 저장소에서 `git status --short`와 `git diff`를 실제로 친다. 그림과 같은 화면이다.
3. 그림의 표식을 위에서 아래로 짚는다. **문법을 외우게 하지 않는다.** 읽는 법만.
   - `M` = 고친 파일. 글자가 **오른쪽 칸**에 있으면 아직 `git add` 전이다.
   - `@@ -26,6 +26,8 @@` = "26번째 줄 근처에서 6줄이 8줄이 됐다"는 **위치 표시**. 뒤의 글은 Git이 붙여 준 근처 문장이다.
   - `+` = 새로 생긴 줄. **빈 줄도 한 줄**이라 `+`가 두 개다.
   - 앞이 빈칸인 줄 = 그대로인 **주변 문맥**(앞뒤 3줄씩). AI가 "어디에" 추가됐는지 알 수 있는 단서다.
   - `-` = 지워진 줄. 이번 변경에는 없다. 한 줄을 **고치면** `-`(옛 내용)와 `+`(새 내용)가 짝으로 나온다. (예시가 필요하면 B3-2 이력 `git show be21c49 -- docs/learning/02-python-ai-api.md`의 "키 없이 Windows…" 줄 — 실제 `-`/`+` 짝)
4. `git diff --cached`는 **`git add`한 변경**을 보여 준다. 이번엔 비어 있다. 이 구분은 S3-1에서 다시 쓴다.
5. **반드시 말할 것**: "Git은 이걸 **내 컴퓨터의 저장소**에서 읽습니다. GitHub에 올라간 과거 이력을 가져오는 게 아닙니다."

**학습자 접힘 설명** Git은 내 컴퓨터의 저장소에서 마지막 기록과 지금 파일을 비교해 무엇이 바뀌었는지 알려 줍니다. `git status --short`는 어떤 파일이 바뀌었는지(`M` = 수정), `git diff`는 어떤 줄이 바뀌었는지 보여 줍니다. `+`는 새로 생긴 줄, `-`는 지워진 줄, 앞이 빈칸인 줄은 바뀌지 않은 주변 줄이고, `@@ -26,6 +26,8 @@`은 위치 표시입니다. `git diff`는 아직 `git add`하지 않은 변경, `git diff --cached`는 `git add`한 변경을 보여 줍니다. GitHub의 과거 이력을 가져오는 것이 아닙니다.

**이해 확인** "`@@ -26,6 +26,8 @@`에서 6이 8로 늘어난 이유는?" → *`+`로 시작하는 두 줄(메모 한 줄과 빈 줄)이 새로 생겼기 때문입니다.*

**연결** 용어 `git-status`, `git-diff`, `line-diff`, `repository`, `staging-area-git-add` / 가이드 [01 Git과 diff][g01]

---

## Scene 2 — Python이 Git에게 묻는다

중심: **subprocess = Python이 다른 프로그램을 실행** · 위치 띠 `s2` · 핵심 개념: subprocess(셸 없이 실행) · stdout·stderr·returncode

### S2-1 · Python은 Git을 직접 실행할 수 있다

| 화면 | |
| --- | --- |
| 제목 | Python은 Git을 직접 실행할 수 있다 |
| 학습 질문 | python main.py commit을 입력하면 Git은 누가 실행할까? |
| 핵심 메시지 | Python은 subprocess로 Git 프로그램을 직접 실행한다. |
| 화면 설명 | argparse가 무엇을 만들지 읽고, subprocess가 셸 없이 Git을 실행한다. 여기서 commit은 git commit이 아니다. |
| 핵심 시각자료 | F4 `assets/f4-subprocess-desktop.svg` (모바일 `-mobile.svg`) · 위치 띠 `s2` |
| 대체텍스트 | python main.py commit을 입력했을 때의 흐름. 1 argparse가 명령줄 입력을 읽어 commit이면 커밋 메시지 초안, pr이면 PR 초안을 만들기로 정한다. 2 subprocess.run이 ["git", "diff", …] 같은 목록을 그대로 넘긴다. 셸을 거치지 않는다. 3 운영체제가 git 프로그램을 새 프로세스로 실행한다. 4 Git이 저장소를 읽고 결과를 돌려준다. 강조 이름표: 여기서 commit은 만들 초안의 종류이며 git commit을 실행하지 않는다. 아래 띠: 실제로 실행하는 Git 명령은 rev-parse, branch, status 두 번, diff, diff --cached의 여섯 번이고 commit·push는 없다. |
| 근거 | `[구현]` `main.py` `build_parser()`(`choices=("commit", "pr")`), `git_collector.py` `_git()`(`subprocess.run(["git", "-c", "core.quotepath=false", *args], …, check=False)`)·`collect_changes()`의 Git 호출 6개 |

**강사 스크립트**
1. **오해부터 막는다.** "`python main.py commit`을 실행하면 커밋이 하나 생길까요?" 손을 들게 한다. → 아니다. 여기서 `commit`은 **어떤 초안을 만들지** 고르는 값이다. 커밋은 나중에 사람이 `git commit`으로 직접 한다.
2. ① **argparse**는 B2-1에서 배운 것이다. 한 문장이면 된다: "명령줄에 적은 `commit`/`pr`을 읽어 무엇을 할지 정한다." `python main.py --help`로 `{commit,pr}`을 보여 줘도 좋다.
3. ② **subprocess**가 오늘의 핵심이다. "Python 안에서 **다른 프로그램(git)** 을 실행하는 방법입니다." 우리가 터미널에 `git diff`를 치는 일을 프로그램이 대신 한다.
4. **"셸 없이"의 뜻**: 터미널(셸)에 글자를 치면 셸이 그 글자를 해석해 명령을 만든다. B3-2는 `["git", "diff", …]`처럼 **이미 나눠진 목록**을 운영체제에 그대로 넘긴다. 그래서 파일 이름에 `;` 같은 특수 문자가 있어도 **다른 명령으로 해석되지 않는다**.
5. ③ 운영체제가 git을 **새 프로세스**로 실행하고, ④ Git이 결과를 돌려준다. 그 결과를 어떻게 다루는지가 다음 화면이다.
6. 아래 띠: 실행하는 Git 명령은 **상태를 읽는 것들뿐**이고 `commit`·`push`는 없다. `-c core.quotepath=false`는 한글 파일 이름을 그대로 보이게 하는 옵션이라는 것만 말한다(묻는 경우).

**학습자 접힘 설명** `python main.py commit`의 `commit`은 argparse가 읽는 값으로, "커밋 메시지 초안을 만들라"는 뜻입니다. `git commit`을 실행하지 않습니다. B3-2는 Python의 `subprocess.run()`으로 git 프로그램을 직접 실행합니다. 명령을 `["git", "diff", …]`처럼 목록으로 넘기고 셸을 거치지 않기 때문에, 파일 이름에 특수 문자가 있어도 다른 명령으로 해석되지 않습니다. 실행하는 Git 명령은 저장소 확인·브랜치·상태 두 번·diff 두 번의 여섯 번이고, 기록하거나 보내는 명령은 없습니다.

**이해 확인** "`python main.py commit`을 실행한 뒤 `git log`를 보면 새 커밋이 있을까요?" → *아니요. `commit`은 만들 초안의 종류이고, B3-2는 Git 상태를 읽기만 합니다. 커밋은 사람이 직접 합니다.*

**연결** 용어 `python-cli`, `cli`, `python-subprocess`, `process`, `shell` / 가이드 [00 프로젝트 준비][g00], [01 Git과 diff][g01]
> 용어사전 `commit-subcommand`("commit 명령")는 현재 `git commit` 하위 명령으로 정의되어 있어 이 화면에 연결하지 않았다. B3-2의 `commit`은 프로그램 입력값이다. 정의 정리는 Owner 확인 사항으로 [review.md](review.md)에 남겼다.

---

### S2-2 · Git이 반환한 결과로 다음 작업을 결정한다

| 화면 | |
| --- | --- |
| 제목 | Git이 반환한 결과로 다음 작업을 결정한다 |
| 학습 질문 | Git 명령이 실패하면 Python은 어떻게 알까? |
| 핵심 메시지 | returncode로 성공을 먼저 확인하고, 그다음 stdout을 쓴다. |
| 화면 설명 | stdout은 결과 글, stderr는 오류 설명, returncode는 성공(0)과 실패(0이 아님)를 알리는 숫자다. |
| 핵심 시각자료 | F5 `assets/f5-result-desktop.svg` (모바일 `-mobile.svg`) · 위치 띠 `s2` |
| 대체텍스트 | Git 명령이 끝나면 Python은 세 가지를 받는다. stdout은 결과 글(저장소 안에서 실제 값 ' M docs/learning/02-python-ai-api.md'), stderr는 오류 설명(저장소 밖에서 실제 값 'fatal: not a git repository …'), returncode는 성공 신호다(0이면 성공, 0이 아니면 실패. 실제 값: 저장소 안 0, 밖 128). 오른쪽 흐름: ① returncode가 0인가? 아니요면 오류를 알리고 멈추며 AI 요청은 0회다. 예면 ② 변경이 있나? 없으면 '변경 사항이 없습니다'를 출력하고 AI 요청은 0회다. 있으면 보낼 데이터를 만든다(Scene 3). 아래: subprocess.run은 실패해도 예외를 내지 않으므로 B3-2가 returncode를 직접 확인한다. |
| 근거 | `[재현]` `evidence/subprocess-results.txt`(0 / 128과 실제 stderr). `[구현]` `_git()`의 `if result.returncode: raise GitError(...)`, `main.py`의 `if not changes.has_changes: print("변경 사항이 없습니다.")`. 두 경우 모두 API 요청 0회는 `test_cli.py`·발표자 노트 시연으로 확인 |

**강사 스크립트**
1. "Git에게 일을 시켰는데 실패했다면, Python은 어떻게 알까요?"
2. 왼쪽 세 칸을 짚는다. 프로그램을 실행하면 **세 가지**가 돌아온다.
   - **stdout**: 결과 글. 정상일 때 ` M docs/…` 같은 내용.
   - **stderr**: 오류 설명. 저장소가 아닌 폴더에서 실행하면 `fatal: not a git repository …`.
   - **returncode**: 숫자 하나. **0이면 성공, 0이 아니면 실패**. 실제로 저장소 밖에서 128이 나왔다.
3. 시연(발표자 노트 ②): 저장소 밖에서 실행해 `오류: fatal: not a git repository …`와 `AI API 요청 횟수: 0`을 보여 준다.
4. **왜 returncode를 먼저 볼까?** "저장소 밖에서는 stdout이 **비어** 있습니다. 이걸 그대로 쓰면 '변경이 없네'라고 착각할 수 있어요." `subprocess.run`은 실패해도 **기본으로 예외를 내지 않는다**. 그래서 B3-2가 returncode를 직접 확인하고 `GitError`로 멈춘다.
5. 오른쪽 흐름을 위에서 아래로 짚는다. 실패 → 멈춤, 변경 없음 → "변경 사항이 없습니다", 있음 → Scene 3. **앞의 두 경우 AI에게 아무것도 보내지 않는다**(요청 0회 = 비용 0).

**학습자 접힘 설명** subprocess로 실행한 프로그램은 결과 글(stdout), 오류 설명(stderr), 성공 여부를 알리는 숫자(returncode)를 돌려줍니다. returncode가 0이면 성공, 0이 아니면 실패입니다. `subprocess.run()`은 실패해도 기본으로 예외를 내지 않기 때문에, B3-2는 returncode를 직접 확인해 실패하면 오류를 알리고 멈춥니다. 성공했지만 변경이 없으면 "변경 사항이 없습니다."를 출력합니다. 두 경우 모두 AI API를 호출하지 않습니다.

**이해 확인** "저장소 밖에서는 stdout이 비어 있습니다. 이걸 '변경 없음'으로 처리하면 무엇이 문제일까요?" → *실패를 성공처럼 숨기게 됩니다. returncode(128)로 실패를 먼저 확인해야 합니다.*

**연결** 용어 `stdin-stdout`, `exit-code`, `python-subprocess`, `git-status` / 가이드 [01 Git과 diff][g01], [07 전체 실습][g07]

---

## Scene 3 — AI에게 보내고 답을 받는다

중심: **AI API = HTTPS로 JSON을 주고받는 창구** · 위치 띠 `s3` · 핵심 개념: 보낼 문맥과 안전 검사 · API 요청·응답

### S3-1 · AI에게 어떤 데이터를 보낼까?

| 화면 | |
| --- | --- |
| 제목 | AI에게 어떤 데이터를 보낼까? |
| 학습 질문 | AI가 변경을 설명하려면 무엇을 받아야 할까? |
| 핵심 메시지 | 바뀐 부분과 그 맥락만 모으고, 보내기 전에 검사한다. |
| 화면 설명 | 브랜치·파일 이름·git add한 변경·아직 add하지 않은 변경을 모은다. 새 파일은 이름만 보낸다. |
| 핵심 시각자료 | F6 `assets/f6-context-desktop.svg` (모바일 `-mobile.svg`) · 위치 띠 `s3` |
| 대체텍스트 | B3-2가 AI에게 보내는 Git 문맥 6칸(실제 순서, 재현). Branch: main / Status: ' M docs/…/02-python-ai-api.md' / Changed files: 파일 이름 / Untracked files: 새 파일은 이름만(강조) / Staged diff: git add한 변경, 이번에는 비어 있음 / Unstaged diff: 아직 add하지 않은 변경, 실습 메모 2줄 추가. 가운데 안전 검사(기본으로 켜짐): ① .env · .pem · id_rsa 같은 비밀 파일 경로가 있으면 보내지 않고 멈춘다 ② 이메일·토큰·비밀번호 값은 [REDACTED]로 가린다 ③ 16,000자를 넘으면 요청하지 않는다. --unsafe를 붙이면 ①② 검사를 끈다. 오른쪽: 이번 예에서 보낼 문맥은 806자. 보내지 않는 것: 새 파일의 내용, 바뀌지 않은 파일, API 키. |
| 근거 | `[재현]` `evidence/demo-context.txt`(6칸 원문, 806자). `[구현]` `security.py` `prepare_context()`: 경로 검사 → 6칸 조립 → 마스킹 → 16,000자 한도. 한도는 `--unsafe`에서도 적용된다 |

**강사 스크립트**
1. "AI가 '실습 메모를 추가했다'고 쓰려면 무엇을 받아야 할까요?" → 어디서(브랜치·파일), 무엇이(diff) 바뀌었는지.
2. 왼쪽 6칸을 위에서 아래로 짚는다. **실제로 보내는 순서 그대로**다(`evidence/demo-context.txt`).
   - **Staged diff**(`git diff --cached`) = `git add`한 변경, **Unstaged diff**(`git diff`) = 아직 `add`하지 않은 변경. B3-2는 **둘 다** 보낸다.
   - **새 파일(미추적)은 이름만** 보낸다. 내용은 `git add` 해야 staged diff에 들어간다. (현재 구현의 선택이다)
3. 보내지 **않는** 것: 바뀌지 않은 파일, 새 파일의 내용, API 키. "AI가 내 컴퓨터를 들여다보는 게 아니라, **우리가 고른 글만** 보냅니다." (인트로 질문의 첫 번째 답)
4. 가운데 **안전 검사**: 외부로 나가기 전에 한 번 거른다.
   - ① `.env`·`.pem`·`id_rsa` 같은 비밀 파일 경로가 보이면 **아예 보내지 않는다**.
   - ② 이메일·토큰·`password=…` 값은 `[REDACTED]`로 **가린다**.
   - ③ **16,000자**를 넘으면 요청하지 않는다. "변경을 나눠 실행하세요"라고 알린다. 이 한도는 `--unsafe`에서도 적용된다.
5. **한계를 말한다.** "자동 검사가 모든 비밀을 찾지는 못합니다. 보내기 전에 `git diff`를 직접 보는 습관이 먼저입니다." `--unsafe`는 ①② 검사를 끄는 옵션이며 강의에서 쓰지 않는다.

**학습자 접힘 설명** B3-2는 AI에게 브랜치 이름, `git status` 결과, 바뀐 파일 이름, 새 파일 이름, `git add`한 변경(staged diff), 아직 `add`하지 않은 변경(unstaged diff)을 하나의 글로 묶어 보냅니다. 새 파일의 내용과 바뀌지 않은 파일, API 키는 보내지 않습니다. 보내기 전에 안전 검사를 합니다. 비밀 파일 경로가 있으면 멈추고, 이메일·토큰·비밀번호 값은 가리고, 16,000자를 넘으면 요청하지 않습니다. 자동 검사는 모든 비밀을 찾지 못하므로 보내기 전에 `git diff`를 직접 확인해야 합니다.

**이해 확인** "새로 만든 `notes.txt`를 `git add`하지 않았습니다. AI는 그 내용을 볼까요?" → *아니요. 이름만 갑니다. `git add`하면 staged diff에 내용이 들어갑니다.*

**연결** 용어 `git-diff`, `staging-area-git-add`, `safe-mode`, `data-masking`, `secret-management`, `prompt-design` / 가이드 [01 Git과 diff][g01], [05 검증과 보안][g05]

---

### S3-2 · AI API는 어떻게 요청하고 응답할까?

| 화면 | |
| --- | --- |
| 제목 | AI API는 어떻게 요청하고 응답할까? |
| 학습 질문 | 내 컴퓨터의 Python은 AI에게 어떻게 말을 걸까? |
| 핵심 메시지 | Python은 HTTPS로 JSON 요청을 보내고, 응답 JSON에서 글만 꺼낸다. |
| 화면 설명 | 요청에는 작성 규칙(system)과 검사한 Git 문맥(user)이 담긴다. API 키는 환경변수에서 읽어 헤더로만 보낸다. |
| 핵심 시각자료 | F7 `assets/f7-api-desktop.svg` (모바일 `-mobile.svg`) · 위치 띠 `s3` |
| 대체텍스트 | 내 컴퓨터의 Python(AIClient)과 외부 서비스 사이의 요청과 응답. 요청 카드: POST https://copa.codyssey.kr/v1/chat/completions, Authorization: Bearer 뒤의 키는 가림(환경변수 CODYSSEY_API_KEY에서 읽음), JSON 본문은 model gpt-5-mini와 messages 두 개 — system(작성 규칙)과 user(검사한 Git 문맥 806자). ② 요청이 경계를 넘어 코디세이 API(요청을 받는 HTTPS 창구)로 간다. 코디세이 API와 AI 모델 사이 내부 연결은 공개되지 않았고(점선), 모델의 실행 위치는 확인 범위 밖이다. ③ 응답 JSON의 choices[0].message.content에서 글만 꺼낸다. 예: '학습 문서에 실습 메모 추가: …'. 명령 1번에 요청 1번, 자동 재시도 없음, 30초 안에 답이 없으면 오류, 401·403은 키·권한 오류. |
| 근거 | `[구현]` `ai_client.py` `generate()`(HTTPS POST, `Authorization: Bearer`, `{"model", "messages":[system, user]}`, `timeout=30`, 401/403 처리, `choices[0].message.content`). `[실제 실행]` URL·모델 `gpt-5-mini`·환경변수 3개. `[재현]` `evidence/demo-request.json`(본문 구조, 키 없음) |

**강사 스크립트**
1. 위치 띠에서 **경계를 넘는 순간**이라는 것을 짚는다. "여기서 처음으로 내 컴퓨터 밖으로 무언가가 나갑니다."
2. 요청 카드를 위에서 아래로 짚는다.
   - **주소**: HTTPS 주소로 **POST** 요청을 보낸다. HTTPS라서 오가는 내용이 암호화된다.
   - **키**: `Authorization: Bearer ••••`. 키는 **환경변수** `CODYSSEY_API_KEY`에서 읽어 **헤더**에만 넣는다. 코드나 JSON 본문에는 없다. (화면 공유 중에는 키를 입력하지 않는다)
   - **JSON 본문**: JSON은 이미 배운 형식이다. 한 문장: "키와 값으로 적은 글." 여기에는 모델 이름과 메시지 두 개가 들어간다.
     - `system` = **작성 규칙**: "한국어로, 제목 72자 이하, 테스트를 했다고 쓰지 말 것…" (`prompts.py`)
     - `user` = S3-1에서 검사한 **Git 문맥 806자**
3. **AI 쪽은 정직하게 말한다.** "우리가 확인한 것은 **코디세이 API라는 창구**에 요청을 보내고 답을 받는다는 것까지입니다. 그 뒤에서 모델이 어디서 실행되는지는 공개된 정보로 확인하지 않았어요. 그래서 점선입니다."
4. 응답: JSON에서 `choices[0].message.content`만 꺼낸다. 글이 없으면 오류로 멈춘다.
5. 아래 두 줄: **명령 1번 = 요청 1번**, 자동 재시도 없음(요청할 때마다 비용이 생길 수 있다). 30초 안에 답이 없거나 키가 틀리면(401·403) 오류로 멈춘다.
6. `temperature`·`max_tokens`는 옵션으로 있지만 코디세이에서 지원하는지는 확인되지 않았다. 묻는 경우에만 말한다.

**학습자 접힘 설명** B3-2는 HTTPS 주소로 POST 요청을 보냅니다. API 키는 환경변수 `CODYSSEY_API_KEY`에서 읽어 `Authorization` 헤더에만 넣습니다. 요청 본문은 JSON이며 모델 이름과 메시지 두 개가 들어갑니다. `system` 메시지는 작성 규칙, `user` 메시지는 검사한 Git 문맥입니다. 응답 JSON에서 `choices[0].message.content`의 글만 꺼냅니다. 명령 한 번에 요청은 한 번이고 자동으로 다시 시도하지 않습니다. 코디세이 API 뒤에서 AI 모델이 어디서 실행되는지는 이 강의에서 확인하지 않았습니다.

**이해 확인** "API 키는 요청의 어디에 들어가나요? JSON 본문인가요?" → *아니요. `Authorization` 헤더에 들어갑니다. 본문에는 모델 이름과 메시지만 있습니다.*

**연결** 용어 `ai-api`, `rest-api`, `http-request-response`, `https`, `json-request-response`, `api-key`, `environment-variable`, `ai-model`, `authentication-error` / 가이드 [02 Python과 AI API][g02]

---

## Scene 4 — AI의 초안을 사람이 완성한다

중심: **결과 = 검증된 초안 + 사람의 확인** · 위치 띠 `s4` · 핵심 개념: commit 초안과 PR 초안 · 형식 검증과 사람 확인

### S4-1 · AI는 어떤 결과물을 만들까?

| 화면 | |
| --- | --- |
| 제목 | AI는 어떤 결과물을 만들까? |
| 학습 질문 | 같은 변경에서 commit과 pr은 무엇을 다르게 만들까? |
| 핵심 메시지 | commit은 한 줄 제목을, pr은 이유·내용·확인 방법을 만든다. |
| 화면 설명 | 실제 실행에서 나온 두 초안이다. 둘 다 터미널에 출력될 뿐, 커밋이나 PR이 만들어지지 않는다. |
| 핵심 시각자료 | F8 `assets/f8-drafts-desktop.svg` (모바일 `-mobile.svg`) · 위치 띠 `s4` |
| 대체텍스트 | 같은 변경으로 실행한 두 명령의 실제 출력(2026-10-20). 왼쪽 python main.py commit: '=== 검토용 초안: COMMIT ===' 다음에 제목 '학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요'(35자), 빈 줄, 본문 두 줄 'docs/learning/02-python-ai-api.md 파일 끝에 실습 메모를 추가하여 / AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용해야 함을 명시함.', 끝 표시와 stderr의 'AI API 요청 횟수: 1'. 오른쪽 python main.py pr: 'Title: docs(learning): AI 생성 커밋 메시지 검토 안내 추가'(37자), ## Why '- 학습 문서에 … 실습 메모를 명시해 혼동을 줄이기 위해', ## What '- docs/learning/02-python-ai-api.md 파일 끝에 … 추가함'(긴 줄은 …로 줄임), ## How to Test는 프로그램이 넣은 고정 문구 '- 실행 권장: python -m unittest discover -s tests'(강조), 끝 표시와 요청 횟수 1. 아래 범례: 모두 실제 출력, … = 화면에 맞춰 줄인 부분(전문은 발표자 노트), 주황 = 프로그램이 넣은 고정 문구. |
| 근거 | `[실제 실행 · 2026-10-20 · 사용자 ChatGPT 대화 공유]` 두 명령의 터미널 출력 원문 `evidence/real-output-2026-10-20.txt`(아래 전문). 그림의 출력 글자는 이 원문의 조각이며 `preview.cjs`가 대조한다. `[구현]` 출력 틀(`=== 검토용 초안 …`)·요청 횟수는 `main.py`, How to Test 고정 문구는 `validators.py` `validate_pr()` |

**실제 출력 전문** (발표자 노트 · 학습자 접힘. 화면 F8은 PR의 Why·What을 `…`로 줄여 보여 준다)

```text
=== 검토용 초안: COMMIT ===
학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요

docs/learning/02-python-ai-api.md 파일 끝에 실습 메모를 추가하여
AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용해야 함을 명시함.

=== 끝: 내용을 확인한 뒤 사용하세요 ===
AI API 요청 횟수: 1
```

```text
=== 검토용 초안: PR ===
Title: docs(learning): AI 생성 커밋 메시지 검토 안내 추가

## Why
- 학습 문서에 AI가 생성한 커밋 메시지를 사용자가 검토해야 한다는 실습 메모를 명시해 혼동을 줄이기 위해

## What
- docs/learning/02-python-ai-api.md 파일 끝에 "실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다." 문구를 추가함

## How to Test
- 실행 권장: python -m unittest discover -s tests

=== 끝: 내용을 확인한 뒤 사용하세요 ===
AI API 요청 횟수: 1
```

**강사 스크립트**
1. "같은 변경으로 두 번 실행했습니다. 무엇이 다른가요?"
2. 왼쪽 **commit 초안**: 한 줄 제목(72자 이하, 실제 35자) + 빈 줄 + 본문. 제목은 "무엇을 했는지", 본문은 어느 파일에 무엇을 더했는지를 풀어 쓴다.
3. 오른쪽 **PR 초안**: `Title`(80자 이하, 실제 37자) + `Why`(왜) · `What`(무엇을) · `How to Test`(어떻게 확인할지). 리뷰어가 읽을 설명이다. Why·What 전문은 화면에서 줄였으니 위 "실제 출력 전문"을 읽어 준다.
4. **이 출력은 실제로 받은 것이다.** 2026-10-20 실제 코디세이 API 실행 결과를 그대로 옮겼다. 시간이 있고 키가 있으면 발표자 노트 ⑤로 다시 실행해 비교한다. 결과 문장은 매번 조금씩 다를 수 있다.
5. **주황 줄을 짚는다.** How to Test는 AI가 쓴 문장이 아니라 **프로그램이 바꿔 넣은 고정 문구**다. AI는 diff만 보고 "테스트를 통과했다"고 지어낼 수 있기 때문이다(S4-2에서 다시).
6. **반드시 말할 것**: 두 명령 모두 **터미널에 출력만** 한다. 커밋도, PR 등록도 하지 않는다. 시연에서 `git log -1`과 `git status`로 그대로인 것을 보여 준다.
7. **(말하지 않음 · 확인 대기)** 두 초안 모두 메모를 "파일 끝에" 추가했다고 쓴다. 커밋된 `be21c49`에서 이 메모는 45줄 중 29번째 줄(`## 실행 결과` 앞)에 있다. 실행 당시 위치는 기록이 없어, AI의 위치 설명이 틀렸는지 당시에는 끝에 있었는지 아직 모른다. Owner 확인 전에는 강의에서 "AI가 틀렸다"고 말하지 않는다([review.md](review.md) §7).

**학습자 접힘 설명** `python main.py commit`은 커밋 메시지 초안(72자 이하 제목 한 줄과 선택 본문)을, `python main.py pr`은 PR 초안(80자 이하 Title과 Why·What·How to Test 불릿)을 만듭니다. 실제 실행에서 commit 초안은 제목 "학습 문서에 실습 메모 추가: AI 생성 커밋 메시지 검토 필요"와 어느 파일에 어떤 메모를 더했는지 설명하는 본문 두 줄을, PR 초안은 메모를 더한 이유(Why)와 바뀐 파일·문구(What)를 썼습니다. PR의 How to Test는 AI가 쓴 문장 대신 프로그램이 정한 실행 권장 문구로 바뀝니다. 두 명령 모두 결과를 터미널에 출력할 뿐 커밋이나 PR을 만들지 않습니다. 전체 출력은 위 "실제 출력 전문"에 있습니다.

**이해 확인** "PR 초안의 How to Test는 누가 썼을까요?" → *AI가 아니라 B3-2 검증기가 고정 문구로 바꿨습니다. 실제로 실행한 테스트는 사람이 PR에 직접 적어야 합니다.*

**연결** 용어 `commit-message-convention`, `semantic-conventional-commits`, `pull-request`, `post-processing` / 가이드 [03 커밋 생성][g03], [04 PR 생성][g04]

---

### S4-2 · AI가 작성한 설명을 그대로 믿어도 될까?

| 화면 | |
| --- | --- |
| 제목 | AI가 작성한 설명을 그대로 믿어도 될까? |
| 학습 질문 | 검증을 통과한 초안이면 바로 써도 될까? |
| 핵심 메시지 | 프로그램은 형식을 검사하고, 내용과 이유는 사람이 확인한다. |
| 화면 설명 | AI는 무엇이 바뀌었는지는 읽지만, 왜 바꿨는지는 모를 수 있다. 커밋과 PR은 사람이 직접 만든다. |
| 핵심 시각자료 | F1 `assets/f1-overview-desktop.svg` (모바일 `-mobile.svg`) 상태 `return` · 위치 띠 `s4` |
| 대체텍스트 | 인트로의 전체 동작 구조도를 다시 보여 준다. 결과 쪽(검토용 초안, 사람)과 ④ 검증 후 출력, ⑤ 확인 화살표가 강조되고 나머지는 흐리다. 아래에 세 단계가 나온다: ① 프로그램이 형식을 검사한다(제목 길이·필수 섹션·테스트 주장) → ② 사람이 내용과 이유를 확인한다(실제 diff와 비교·빠진 것 찾기) → ③ 사람이 직접 사용한다(git commit·GitHub에서 PR 작성). |
| 근거 | `[구현]` `validate_commit()`(빈 값·코드 블록·제목 8~72자·"수정" 같은 한 단어 제목 거절), `validate_pr()`(Title 8~80자, Why·What·How to Test와 불릿, Title·Why·What의 테스트 수행 주장 거절, How to Test 교체), `main.py`(출력만). `evidence/validator-demo.txt`(교육용 입력, AI 응답 아님) |

**강사 스크립트**
1. 인트로의 그림으로 돌아온다. "처음 질문을 기억하나요? AI는 내 컴퓨터를 들여다볼까요?" → 아니다. **우리가 고르고 검사한 글만** 경계를 넘었다.
2. 아래 세 단계를 짚는다.
   - ① **프로그램(검증기)**: 제목 길이, 필수 섹션과 불릿, "테스트를 통과했다" 같은 주장을 검사하고 How to Test를 고정 문구로 바꾼다. 통과하지 못하면 초안 대신 오류를 낸다. **형식**만 본다.
   - ② **사람**: 초안을 `git diff`와 나란히 놓고 읽는다. 바뀐 것이 다 들어갔나? 없는 것을 지어내지 않았나? **왜** 바꿨는지가 맞나?
   - ③ **사람**: 확인한 문장으로 직접 `git commit -m "…"`을 하고, PR은 GitHub에서 직접 쓴다.
3. **핵심 문장**: "AI는 diff에서 **무엇이** 바뀌었는지는 읽습니다. 하지만 **왜** 바꿨는지는 diff에 없을 때가 많아요. 이유는 고친 사람이 압니다."
4. 시연 마무리(발표자 노트 ⑥): `git status --short`에 `M`이 그대로, `git log -1 --oneline`도 그대로임을 보여 준다. 프로그램은 아무것도 커밋하지 않았다.
5. 핵심 질문에 함께 답한다.
   > Git이 내 컴퓨터에서 바뀐 줄을 보여 주고, Python이 그것을 모아 검사한 뒤 HTTPS로 AI API에 보낸다. 돌아온 초안은 프로그램이 형식을 검사하고, 내용과 이유는 사람이 확인해 직접 쓴다.

**학습자 접힘 설명** B3-2의 검증기는 초안의 형식을 검사합니다. 제목 길이, PR의 필수 섹션과 불릿, "테스트를 통과했다" 같은 확인할 수 없는 주장을 거르고 How to Test를 실행 권장 문구로 바꿉니다. 하지만 검증기는 내용이 사실인지는 모릅니다. AI는 diff에서 무엇이 바뀌었는지는 읽을 수 있지만, 왜 바꿨는지는 diff에 없으면 알 수 없습니다. 그래서 사람이 초안을 실제 변경과 비교해 고친 뒤, 직접 커밋하고 PR을 씁니다.

**이해 확인** "검증기를 통과한 PR 초안의 Why가 틀릴 수 있을까요?" → *예. 검증기는 형식만 보고 사실 여부는 모릅니다. AI는 변경 이유를 diff에서 추측할 뿐입니다.*

**연결** 용어 `output-validation`, `human-in-the-loop`, `post-processing`, `pull-request`, `commit` / 가이드 [05 검증과 보안][g05], [07 전체 실습][g07]

---

## 동료평가 시연 — 발표자 노트

> 화면에 띄우지 않는다. Windows PowerShell 기준(B3-2 실제 실행 환경). macOS는 `python` 대신 `python3`, 환경변수는 `export 이름='값'`.
> ①~④·⑥은 **API 키 없이** 할 수 있고 AI 요청이 0회다. ⑤만 실제 요청 2회가 생긴다(공급자 정책에 따라 비용이 생길 수 있다).
> 아래 출력은 2026-11-04 연습 복제본에서 키 없이 실행해 확인한 것이다(⑤ 제외).

**① 준비 — 실제 저장소를 건드리지 않도록 연습 복제본을 만든다**

```powershell
git clone https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2.git b32-demo
cd b32-demo
git switch -c demo 7b2c6af      # 실제 실행 직전 상태. 프로그램 코드는 main과 같다
python -m unittest discover -s tests     # 키 없이: Ran 14 tests … OK
python main.py --help                     # S2-1: {commit,pr} = 만들 초안의 종류
python main.py commit                     # 변경 없음 → "변경 사항이 없습니다." · AI API 요청 횟수: 0
```

**② 실패 시연 (S2-2)** — 저장소가 아닌 폴더에서 실행한다. 상위 폴더가 Git 저장소가 아닌지 먼저 확인한다.

```powershell
cd ..
python b32-demo\main.py commit
# 오류: fatal: not a git repository (or any of the parent directories): .git
# AI API 요청 횟수: 0
cd b32-demo
```

**③ 변경 만들기와 읽기 (S1-2)** — 편집기로 `docs/learning/02-python-ai-api.md`를 열어 `## 실행 결과` 바로 위에 다음 줄과 빈 줄 하나를 넣는다(그림과 같은 변경).

```text
실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다.
```

```powershell
git status --short     #  M docs/learning/02-python-ai-api.md
git diff               # @@ -26,6 +26,8 @@ … +실습 메모 … +
git diff --cached      # (출력 없음)
```

**④ AI에게 보낼 문맥 보기 (S3-1)** — API를 부르지 않고 B3-2 함수만 실행한다.

```powershell
python -c "from pathlib import Path; from ai_gitgen.git_collector import collect_changes; from ai_gitgen.security import prepare_context; c = prepare_context(collect_changes(Path.cwd())); print(c); print(len(c), '자')"
# Branch: demo … Unstaged diff: … 806 자
```

키를 넣지 않고 `python main.py commit`을 실행하면 `오류: 확인된 API 주소와 모델이 필요합니다. …`와 `AI API 요청 횟수: 0`이 나온다. 안전 검사를 통과한 뒤 설정이 없어서 멈춘 것이다.

**⑤ 실제 요청 (S3-2·S4-1)** — 키는 **화면 공유를 멈추고** 입력한다. 키를 명령 인수나 슬라이드·문서에 넣지 않는다.

```powershell
$env:CODYSSEY_API_KEY = "<발급받은 키>"        # 화면 공유를 멈춘 상태에서 입력
$env:CODYSSEY_API_URL = "https://copa.codyssey.kr/v1/chat/completions"
$env:CODYSSEY_MODEL = "gpt-5-mini"
python main.py commit       # 요청 1회
python main.py pr           # 요청 1회
```

결과 문장은 슬라이드(S4-1)와 다를 수 있다. 같은 변경을 설명하는지, How to Test가 `- 실행 권장: python -m unittest discover -s tests`인지만 확인한다. 실패하면 오류 문장과 요청 횟수를 그대로 보여 주고 S2-2의 흐름으로 설명한다(자동 재시도 없음).

**⑥ 아무것도 커밋되지 않았음을 보이기 (S4-2)** 와 정리

```powershell
git status --short          #  M 그대로
git log -1 --oneline        # 7b2c6af docs: record verified stage SHAs and remote status (그대로)
Remove-Item Env:CODYSSEY_API_KEY
cd ..; Remove-Item -Recurse -Force b32-demo     # 연습 복제본 삭제
```

---

## 강의 흐름·시간과 실습 연결

| 단계 | 시간 `[제안 · 미검증]` | 내용 |
| --- | --- | --- |
| Story 인트로 | 3분 | 핵심 질문 · F1 경계선 · 선수개념 세 가지 · 위치 띠 |
| Scene 1~4 | 24~28분 | 화면당 3분 안팎. 시연 ①~④는 Scene 1~3 사이에 끼운다 |
| 실제 요청 시연 ⑤ | 3~5분 | 키가 있을 때만. 없으면 S4-1 그림으로 설명 |
| 자료 사용법 | 3분 | 장면 → 용어사전 → 학습가이드 → 돌아오기 시연. B3-2 개념지도는 아직 없음(**미구현**) |
| 첫 실습 출발점 | — | 가이드 [07 전체 실습][g07]: 연습 저장소에서 변경 → `git diff` 확인 → 초안 생성 → 비교 |
| 이해 확인 | 5분 | 핵심 질문에 자기 말로 한 문장 답하기 |

---

## 부록 A. 공식 요구사항·실제 구현·이 원고의 표현

자세한 대조와 근거는 [review.md](review.md) §3. 여기에는 강의에서 말할 때 주의할 것만 둔다.

| 주제 | `[공식]` 원천 추출 | `[구현]` B3-2 | 강의에서 |
| --- | --- | --- | --- |
| 재생성 | "형식 불일치 시 재시도" | 재시도하지 않는다. 형식이 틀리면 오류로 멈추고 요청은 1회 | "다시 실행하는 것은 사람의 선택" |
| temperature · max_tokens | 생성 파라미터로 등장 | 옵션은 있으나 코디세이 지원 미확인. 지정할 때만 보낸다 | 묻는 경우에만 언급 |
| 마스킹 · safe-mode | 민감정보 보호 | 기본 켜짐. 경로 차단·값 가림·16,000자 한도(한도는 `--unsafe`에서도 적용) | S3-1 |
| 미추적 파일 | (언급 없음) | 이름만 보낸다 | S3-1 |
| 결과 사용 | Human-in-the-loop | 출력만. 자동 커밋·PR 없음 | S4-1·S4-2 |

## 부록 B. 화면별 핵심 개념 수

| 화면 | 핵심 개념 | 수 |
| --- | --- | --- |
| S1-1 | AI 초안 + 사람 확인 | 1 |
| S1-2 | git status · git diff 읽기(로컬 저장소) | 2 |
| S2-1 | subprocess(셸 없이 실행) · (보조) commit ≠ git commit | 1 |
| S2-2 | stdout·stderr·returncode와 분기 | 1 |
| S3-1 | 보낼 문맥 · 안전 검사 | 2 |
| S3-2 | HTTPS + JSON 요청·응답 · (보조) 키는 헤더 | 1 |
| S4-1 | commit 초안 vs PR 초안 | 1 |
| S4-2 | 형식 검증 vs 사람 확인 | 1 |

Scene 단위로는 Scene 1: AI 초안·diff / Scene 2: subprocess·returncode / Scene 3: 보낼 문맥·API 요청과 응답 / Scene 4: 두 초안·검증과 사람이다. 가장 비중이 큰 셋(**subprocess, Git diff, API 요청·응답**)은 각각 독립된 화면(S2-1·S2-2, S1-2·S3-1, S3-2)을 가진다.

[b32]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/tree/be21c4994a93bc943a6783ea380c50f61aa7c45b
[g00]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/00-project-setup.md
[g01]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/01-git-basics-and-diff.md
[g02]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/02-python-ai-api.md
[g03]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/03-commit-generation.md
[g04]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/04-pr-generation.md
[g05]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/05-validation-and-security.md
[g07]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/07-end-to-end-walkthrough.md
