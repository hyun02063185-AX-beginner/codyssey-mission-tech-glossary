# B3-2 따라 하기 실습(Lab) v0.3-r1 — Git 변경이 AI 초안이 되기까지

**핵심 질문** 외부 AI 서비스의 기능을 내 Python 프로그램에서 사용하려면 어떤 정보를 어떻게 주고받아야 할까?

> 학습자용 실습 원고 · 본과정 M06 / B3-2 · **v0.3-r1** · 2026-11-25 · Owner 검토 전 초안
>
> 실습 대상: [Codyssey_B3-2][b32] (`be21c49`) · 기준 환경: macOS 교육장 공용 PC, zsh, Python 3.9.6, 관리자(sudo) 권한 없음
>
> [v0.3 실습 가이드](lab-guide-v0.3.md)를 보존하고 다시 구성한 판입니다. 9개 Lab과 실행 기록은 그대로 두고, 각 Lab을 **A 핵심 실습 · B 추가 탐구 · C 문제 해결**로 나눴습니다. 설계 근거는 [순환형 학습 설계 r1](learning-cycle-design-v0.3-r1.md), 화면과의 왕복은 [스토리–실습 연결 r1](lab-story-mapping-v0.3-r1.md), 도식 01–06은 [도식 설계 r1](lab-figure-design-v0.3-r1.md)에 있습니다.

## 이 실습을 쓰는 법

- **A 핵심 실습만 해도 미션의 전체 흐름을 이해할 수 있습니다.** 핵심 경로는 약 75분이고 AI API를 2번 부릅니다. B 추가 탐구는 더 궁금할 때만, C 문제 해결은 결과가 다를 때만 펼치세요.
- **어디서든 시작할 수 있습니다.** 스토리 화면에서 들어와도 되고 Lab 01부터 해도 됩니다. 각 Lab의 **시작 상태**만 맞추면 됩니다([실습 상태 카드](#실습-상태-카드)).
- **해설보다 내 결과를 먼저 봅니다.** 실행 전 질문 → 명령 → 관찰 목록 순서로 하고, 접힌 해설은 관찰을 마친 뒤 펼치세요.
- **실습이 끝나면 화면으로 돌아갑니다.** 각 Lab A의 끝에 있는 **돌아가기**가 어느 화면의 **어느 부분**을 내 결과와 맞춰 볼지 알려 줍니다. 그 부분을 찾아 내 터미널의 줄과 짝지은 뒤, 확인 질문에 내 말로 답해 보세요.

### 학습 경로와 시간

| Lab | 핵심 실습 | 추가 탐구(선택) | 핵심 API 호출 | 키 |
| --- | --- | --- | --- | --- |
| [01 실습 환경 준비](#lab-01) | 8분 | 5분 | 0 | 필요 없음 |
| [02 변경 없는 상태](#lab-02) | 4분 | 5분 | 0 | 필요 없음 |
| [03 Git 변경과 스테이징](#lab-03) | 15분 | 10분 | 0 | 필요 없음 |
| [04 Python이 Git 실행](#lab-04) | 8분 | 7분 | 0 | 필요 없음 |
| [05 Git 문맥 만들기](#lab-05) | 8분 | 8분 | 0 | 필요 없음 |
| [06 요청 JSON 미리 보기](#lab-06) | 8분 | 5분 | 0 | 필요 없음 |
| [07 첫 API 요청과 오류](#lab-07) | 10분 | 10분 (**API +1회**) | **1** | **필요** |
| [08 AI 응답과 두 초안](#lab-08) | 10분 | 5분 | **1** | **필요** |
| [09 출력 통로와 마무리](#lab-09) | 5분 | 3분 (**API +1회**) | 0 | 경로에 따라 |
| **합계** | **약 75분** | **약 60분** | **2회** | |

시간은 처음 해 보는 학습자를 기준으로 한 **설계 추정**입니다. 권장 운영: 대면 강의 직후 Lab 01–03 핵심(약 30분) → 자기주도 Lab 04–06 핵심(약 25분) → 키를 받은 뒤 Lab 07–09 핵심(약 25분).

### 근거 표시

| 표시 | 뜻 |
| --- | --- |
| **실제 · 2026-11-25 Owner** | 교육 설계자(Owner)가 macOS 교육장 PC에서 실제로 실행한 결과 |
| **재현 · Claude** | 실습 설계를 검증하려고 같은 사례를 다시 실행한 결과. AI API는 호출하지 않았습니다. |
| **예상** | 실행 기록이 없어 프로그램 소스 코드로 예상한 결과 |
| **교육용 예시** | 구조를 보여 주려고 단순하게 만든 예. 실제 출력이 아닙니다. |

숫자(예: 글자 수 535자)는 그 실행에서 관찰한 값입니다. 모든 실행에서 똑같아야 하는 정답이 아닙니다.

## 실습 안전 수칙

실습을 시작하기 전에 꼭 읽으세요.

1. **연습 저장소에서만 합니다.** Lab 01에서 `~/b32-practice.XXXXXX` 폴더에 새로 받은 저장소만 고칩니다. 내 미션 제출 저장소나 다른 프로젝트 폴더에서 이 실습의 명령을 실행하지 마세요. 파일을 바꾸는 명령은 **연습 저장소인지 먼저 확인한 뒤에만** 실행되도록 써 두었습니다.
2. **커밋, push, PR 생성은 하지 않습니다.** B3-2 프로그램은 초안만 출력합니다.
3. **API 키를 어디에도 남기지 않습니다.** 문서, 파일, Git 저장소, 명령줄, 스크린샷, 채팅, 로그에 키를 넣지 마세요. 이 실습은 키를 화면·셸 기록·명령줄에 남기지 않는 방법만 씁니다(Lab 07). 키 길이와 문자 종류는 확인해도 되지만 키 값 자체는 출력하지 않습니다.
4. **API 호출에는 사용량과 비용이 생길 수 있습니다.** Lab 01–06은 API를 부르지 않습니다. 핵심 경로의 호출은 **2회**(Lab 07 `commit`, Lab 08 `pr`)입니다. 추가 탐구 두 곳이 각각 1회를 더 씁니다. 같은 오류가 나는 요청을 반복하지 마세요. 실패한 요청도 요청 횟수 1로 셉니다.
5. **보내지 않고 만들어 보는 것과 실제로 보내는 것은 다릅니다.** Lab 05·06은 내 컴퓨터 안에서 출력만 합니다. 인터넷으로 무언가 나가는 것은 Lab 07부터입니다.
6. **공용 PC에서는 끝나면 정리합니다.** [실습 정리](#실습-정리)에서 키를 지우고 터미널 창을 닫습니다. 실습 폴더는 지우지 않아도 됩니다(키가 들어 있지 않습니다).

## 데이터의 여행

이 실습의 모든 Lab은 **같은 한 줄**을 따라갑니다. 미션 스토리의 그림도 같은 줄을 씁니다.

> `실습 메모: AI가 작성한 초안은 사람이 검토한다.`

```text
README.md 수정            ← Lab 03            그림 F3 (S1-2)
  ↓
Git 변경 정보             ← Lab 03 · 04        그림 F3 · F5 (S1-2 · S2-2)
  ↓
Git 문맥                  ← Lab 05             그림 F6 (S3-1)
  ↓
API 요청의 user 메시지    ← Lab 06             그림 F7 (S3-2)
  ↓
AI가 생성한 초안          ← Lab 07 · 08        그림 F2 · F8 (S1-1 · S4-1)
  ↓
Python의 검증과 출력      ← Lab 08 · 09        그림 F8 · F1 return (S4-1 · S4-2)
  ↓
사람의 검토               ← Lab 08 · 09        그림 F1 return (S4-2)
```

| 단계 | 이 문장의 모습 | 어디에 있나 | 누가 만들었나 |
| --- | --- | --- | --- |
| README.md 수정 | `실습 메모: AI가 작성한 초안은 사람이 검토한다.` | 작업 폴더의 `README.md` 마지막 줄 | 나(학습자) |
| Git 변경 정보 | `+실습 메모: AI가 작성한 초안은 사람이 검토한다.` | `git diff`(또는 `--cached`)의 출력 → Python의 `result.stdout` | Git |
| Git 문맥 | `Unstaged diff:` 칸 안의 `+실습 메모: …` | 보낼 글 하나(이번 실행 535자) | B3-2 프로그램 |
| `user` 메시지 | `…\n+\n+실습 메모: AI가 작성한 초안은 사람이 검토한다.\n` | 요청 JSON의 `messages` | B3-2 프로그램 |
| AI가 생성한 초안 | `README.md 마지막에 "실습 메모: …" 문장을 새 줄로 추가함.` | 응답 JSON의 `content` | 외부 AI |
| Python의 검증과 출력 | `=== 검토용 초안: COMMIT ===` 아래의 글 | 터미널(stdout) | B3-2 프로그램이 검사 후 출력 |
| 사람의 검토 | 쓸지, 고칠지, 버릴지 | 사람의 판단 | 나 |

## 실습 상태 카드

Lab마다 필요한 저장소 상태가 다릅니다. 모두 Lab 01에서 받은 **연습 저장소 폴더 안**에서 실행합니다.

| 상태 | 뜻 | `git status --short` |
| --- | --- | --- |
| **A. 깨끗함** | 아무것도 고치지 않음 (Lab 01에서 막 받은 상태) | (출력 없음) |
| **B. 메모 추가 · add 전** | README.md 끝에 메모를 추가했고 `git add`는 하지 않음 | ` M README.md` |
| **C. 메모 추가 · add 후** | 메모를 추가하고 `git add`까지 함 | `M  README.md` |

**연습 저장소 확인** — 아래 줄은 아무것도 바꾸지 않고 지금 위치만 알려 줍니다.

```zsh
[[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$HOME"/b32-practice.*/Codyssey_B3-2 ]] && echo "확인: 연습 저장소" || echo "멈추세요: 연습 저장소가 아닙니다"
```

**A → B (메모 추가)** — 연습 저장소일 때만 추가하고, 메모가 이미 있으면 다시 넣지 않습니다. 몇 번 실행해도 메모는 한 줄입니다. 다섯 줄을 한 번에 복사해 붙여넣으세요.

```zsh
if [[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$HOME"/b32-practice.*/Codyssey_B3-2 ]]; then
  grep -qxF '실습 메모: AI가 작성한 초안은 사람이 검토한다.' README.md || printf '\n실습 메모: AI가 작성한 초안은 사람이 검토한다.\n' >> README.md
  git status --short
else
  echo "멈추세요: 연습 저장소가 아닙니다. 아무것도 바꾸지 않았습니다."
fi
```

**B → C** `git add README.md` · **C → B** `git restore --staged README.md` (수정은 남고 스테이징만 풀림)

**어느 상태든 → A (처음으로 되돌리기)** — README.md의 **수정 내용을 모두 지웁니다.** 연습 저장소일 때만 실행되고, 아니면 아무것도 바꾸지 않고 멈춥니다.

```zsh
if [[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$HOME"/b32-practice.*/Codyssey_B3-2 ]]; then git restore --staged README.md; git restore README.md; echo "상태 A로 돌아옴"; else echo "멈추세요: 연습 저장소가 아닙니다. 아무것도 바꾸지 않았습니다."; fi
```

`재현 · Claude` 연습 저장소 안에서는 상태 A로 돌아오고, 다른 위치의 같은 이름 저장소와 저장소 밖에서는 “멈추세요”만 출력하고 수정 내용을 그대로 두는 것을 확인했습니다([근거 §1–§2](assets/evidence/lab-v0.3-r1-repro-2026-11-25.txt)).

| Lab | 시작 상태 | 끝 상태 | API 키 | 핵심 API 호출 |
| --- | --- | --- | --- | --- |
| 01 | (저장소 받기 전) | A | 필요 없음 | 0 |
| 02 | A | A | 필요 없음 | 0 |
| 03 | A | B | 필요 없음 | 0 |
| 04 | 아무 상태(B 권장) | 그대로 | 필요 없음 | 0 |
| 05 | B (C도 가능) | 그대로 | 필요 없음 | 0 |
| 06 | B | 그대로 | 필요 없음 | 0 |
| 07 | B | B | **필요** | 1 |
| 08 | B | B | **필요** | 1 |
| 09 | B | B | 경로에 따라 | 0 |

---

<a id="lab-01"></a>

## Lab 01. 실습 환경 준비

> 핵심 8분 · 추가 탐구 5분 · API 0회 · 키 필요 없음 · 끝 상태 **A**
>
> **출발 화면** 인트로(F1) “무엇이 어디로 가고 무엇이 돌아오나?” · S2-1 · **관련 용어** `python` `clone` `repository` `terminal` `cli` `python-cli` · 다루지 않음: Python 설치, 가상환경, Git 설정

### A. 핵심 실습

**목적** 연습용 저장소를 내 컴퓨터에 받고, B3-2 프로그램이 실행되는지와 어떤 명령(`commit`, `pr`)을 받는지 확인합니다.

**실행 전 질문**
- 교육장 PC의 Python 버전은 몇일까요? B3-2 README는 몇 버전 이상을 요구할까요?
- `python3 main.py --help`를 실행하면 무엇이 보일까요?

**명령**

```bash
LAB_DIR="$(mktemp -d "$HOME/b32-practice.XXXXXX")"
echo "실습 폴더: $LAB_DIR"
cd "$LAB_DIR"
git clone https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2.git
cd Codyssey_B3-2

echo "===== 버전 ====="
python3 --version
git --version

echo "===== 도움말 ====="
python3 main.py --help

echo "===== 연습 저장소 확인 ====="
[[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$HOME"/b32-practice.*/Codyssey_B3-2 ]] && echo "확인: 연습 저장소" || echo "멈추세요: 연습 저장소가 아닙니다"
```

`mktemp -d`는 이름이 겹치지 않는 새 폴더(예: `b32-practice.a1B2c3`)를 **나만 열 수 있는 권한**으로 만듭니다. 이후 모든 Lab은 이 폴더 안의 `Codyssey_B3-2`에서 합니다. 마지막 줄의 **연습 저장소 확인**은 실습 중 언제든 다시 실행할 수 있습니다.

**관찰 목록**
- [ ] `python3 --version`이 출력한 버전
- [ ] 도움말의 `{commit,pr}` 부분
- [ ] 도움말 중간 제목이 `optional arguments:`인지 `options:`인지
- [ ] 마지막 줄이 `확인: 연습 저장소`인지

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과</b></summary>

`실제 · 2026-11-25 Owner` Python 버전: `Python 3.9.6`

`재현 · Claude` (같은 버전, `be21c49`)

```text
usage: main.py [-h] [--api-url API_URL] [--model MODEL]
               [--temperature TEMPERATURE] [--max-tokens MAX_TOKENS]
               [--unsafe]
               {commit,pr}

Git 변경을 읽어 AI 커밋 메시지와 PR 초안을 생성합니다.

positional arguments:
  {commit,pr}           생성할 초안 종류

optional arguments:
  -h, --help            show this help message and exit
  ...
```

**핵심 결과**
- **`{commit,pr}`** 프로그램이 받는 초안 종류입니다. `commit`은 커밋 메시지 **초안**, `pr`은 PR 설명 **초안**입니다. `git commit`을 실행하지 않습니다. 이 도움말은 `argparse`가 만든 것으로, S2-1 그림 ① `argparse` 칸의 “사람 → 프로그램 · 입력을 읽고 초안을 선택”이 바로 이것입니다.
- **Python 버전** B3-2 README는 “Python 3.10 이상”을 요구합니다. 교육장 PC는 3.9.6입니다. *공식 지원*(README가 약속한 범위: 3.9.6은 범위 밖)과 *실제 실행 성공*(이 실습 범위는 3.9.6에서 동작함: Owner 실제)을 구별하세요. 3.10부터 도움말 제목이 `options:`로 바뀐 것도 버전 차이의 작은 증거입니다.

**연결 도식** 폴더 구조

```text
 [내 컴퓨터]
   ~/b32-practice.XXXXXX/        ← 실습 폴더 (Lab 09의 출력 파일도 여기에)
     └─ Codyssey_B3-2/          ← 연습 저장소. 이 실습의 명령은 모두 여기서
          ├─ main.py             ← python3 main.py commit | pr
          ├─ ai_gitgen/          ← Git 수집 · 검사 · AI 요청 · 형식 검사
          └─ README.md           ← Lab 03에서 한 줄을 추가할 파일
```

</details>

**돌아가기** → **인트로 F1**: 그림의 **“내 컴퓨터” 실선 경계** 안에 방금 받은 연습 저장소와 `main.py`가 있습니다. 경계 밖(점선)의 외부 AI API로는 아직 아무것도 나가지 않았습니다. → **S2-1 F4**: ① `argparse` 칸의 “사람 → 프로그램”.
- 확인 질문: `python3 main.py commit`의 `commit`은 무엇을 뜻하나요? → <details><summary>예시 답</summary>커밋 메시지 초안을 만들라는 초안 종류입니다. 실제 커밋을 만들지 않습니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. Python 3.9.6에서 B3-2 자체 테스트는 통과할까? (5분 · API 0회)</summary>

```bash
python3 -m unittest discover -s tests
```

`재현 · Claude` `Ran 14 tests … OK` — 3.9.6에서 14개 모두 통과했습니다. 이것은 “이 환경에서 테스트가 통과했다”는 관찰이지, 3.9.6을 공식 지원한다는 뜻은 아닙니다.

</details>

### C. 문제 해결

<details>
<summary>결과가 예상과 다르다면</summary>

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `xcode-select: note: no developer tools were found` 또는 Git 설치 창 | 이 PC에 Git 도구가 없습니다. 관리자 권한이 필요하므로 강사에게 알리세요. |
| `fatal: unable to access` | 인터넷 연결이나 주소를 확인하세요. |
| `python3: command not found` | 강사에게 알리세요. |
| 도움말 대신 `SyntaxError` | Python 버전이 너무 낮을 수 있습니다. `python3 --version`을 확인하세요. |
| `멈추세요: 연습 저장소가 아닙니다` | `cd "$LAB_DIR/Codyssey_B3-2"`로 들어가세요. 새 터미널 창이라 `$LAB_DIR`이 비었다면 `ls -d ~/b32-practice.*`로 실습 폴더를 찾아 `cd ~/b32-practice.찾은이름/Codyssey_B3-2`. (폴더가 여러 개면 가장 최근 것) |

</details>

---

<a id="lab-02"></a>

## Lab 02. 변경 사항 없는 상태 확인

> 핵심 4분 · 추가 탐구 5분 · API 0회 · 키 필요 없음 · 시작·끝 상태 **A**
>
> **출발 화면** S2-2 “Git 결과를 보고 어떻게 판단하나?” · **연결 도식** F5의 ② 분기(스토리 그림 재사용) · 도식 06 · **관련 용어** `exit-code` `stdin-stdout` `git-status`

### A. 핵심 실습

**목적** 고친 것이 없을 때 B3-2 프로그램이 무엇을 하고 무엇을 **하지 않는지** 확인합니다.

**실행 전 질문**
- 바뀐 것이 없는데 `commit` 초안을 만들어 달라고 하면 프로그램은 AI에 요청을 보낼까요?
- API 키를 설정하지 않았는데 이 명령이 오류 없이 끝날 수 있을까요?

**명령**

```bash
python3 main.py commit
echo $?
```

`echo $?`는 **바로 앞 명령의 종료 코드**를 보여 줍니다. 두 줄을 이어서 실행하세요.

**관찰 목록**
- [ ] 출력된 줄은 몇 줄인가요? `AI API 요청 횟수`는?
- [ ] `echo $?`의 숫자는?
- [ ] 키를 설정하지 않았는데 오류가 났나요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과</b></summary>

`실제 · 2026-11-25 Owner`

```text
변경 사항이 없습니다.
AI API 요청 횟수: 0
0
```

**핵심 결과**
- **AI를 부르지 않았습니다.** 프로그램은 Git으로 변경을 먼저 확인하고, 변경이 없으면 그 자리에서 끝냅니다. 키 확인 단계까지 가지 않으므로 키가 없어도 오류가 나지 않습니다.
- **종료 코드 0은 정상 종료입니다.** “변경 없음”은 실패가 아니라 정상적인 결과입니다.
- **두 줄은 서로 다른 통로로 나왔습니다.** `변경 사항이 없습니다.`는 stdout, `AI API 요청 횟수: 0`은 stderr입니다. stderr는 오류만이 아니라 **진단 정보**에도 쓰입니다(도식 06, Lab 09).

</details>

**돌아가기** → **S2-2 F5**: **② “변경이 있나?” → “없음 → 변경 사항이 없습니다 · AI 요청 0회”** 갈래. 내 화면의 두 줄과 `0`이 이 갈래 하나에 모두 들어 있습니다.
- 확인 질문: 변경이 없을 때 요청 횟수가 0이고 키가 없어도 정상 종료(0)하는 이유는? → <details><summary>예시 답</summary>프로그램이 변경 유무를 먼저 확인하고, 설명할 변경이 없으면 AI를 부르기 전(키 확인 전)에 정상적으로 끝내기 때문입니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. 두 줄이 정말 다른 통로일까? — 통로 하나씩 숨기기 (3분 · API 0회)</summary>

```bash
python3 main.py commit 2>/dev/null   # stderr를 버림
python3 main.py commit >/dev/null    # stdout을 버림
```

`재현 · Claude` 첫 줄은 `변경 사항이 없습니다.`만, 둘째 줄은 `AI API 요청 횟수: 0`만 보입니다. Lab 09에서 같은 원리로 두 통로를 파일에 나눠 담습니다.

</details>

<details>
<summary>B-2. 출력 순서가 바뀌어 보이는 경우 (2분 · API 0회)</summary>

상태 A에서, 키를 설정하기 전에 실행합니다(이 Lab의 조건 그대로).

```bash
python3 main.py commit 2>&1 | cat
```

`재현 · Claude`

```text
AI API 요청 횟수: 0
변경 사항이 없습니다.
```

터미널에서 바로 볼 때와 순서가 반대입니다. 출력을 파이프(`|`)로 넘기면 stdout은 모아 두었다가 한꺼번에 내보내고 stderr는 바로 내보내기 때문입니다. 두 통로가 서로 독립적이라는 증거입니다.

</details>

### C. 문제 해결

<details>
<summary>결과가 예상과 다르다면</summary>

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `오류: 확인된 API 주소와 모델이 필요합니다. …` · 종료 코드 1 | 이미 파일을 고친 상태입니다(변경이 있으니 다음 단계로 갔다가 설정이 없어 멈춤, 요청 0회). [상태 A로 되돌리기](#실습-상태-카드)를 실행하세요. `재현 · Claude` |
| `깃 저장소가 아닙니다` 또는 `not a git repository` · 종료 코드 1 | 저장소 폴더 밖에서 실행했습니다. Lab 01 C의 마지막 줄을 보세요. |
| 마지막 숫자가 0이 아닌데 위 오류가 없다 | `echo $?` 앞에 다른 명령을 실행했을 수 있습니다. 두 줄을 이어서 다시 실행하세요. |
| 두 줄의 순서가 반대로 나온다 | 출력을 파이프나 다른 프로그램으로 받으면 순서가 바뀔 수 있습니다(B-2). |

</details>

---

<a id="lab-03"></a>

## Lab 03. Git 변경 정보와 스테이징

> 핵심 15분 · 추가 탐구 10분 · API 0회 · 키 필요 없음 · 시작 상태 **A** → 끝 상태 **B**
>
> **출발 화면** S1-2 “설명의 재료는 어디에 있나?” — **왜 Python은 두 가지 diff를 모두 읽을까?** · **연결 도식** 도식 01 · **관련 용어** `git-status` `git-diff` `staging-area-git-add` `line-diff` `commit` `head` · 다루지 않음: 커밋 만들기, 브랜치

### A. 핵심 실습

**목적** README.md 끝에 실습 메모를 추가하고, `git add` 전과 후에 세 명령의 출력이 어떻게 바뀌는지 비교합니다.

**실행 전 질문**
- 메모를 추가한 뒤 `git diff`와 `git diff --cached`는 각각 무엇을 보여 줄까요?
- `git add README.md`를 하면 무엇이 바뀔까요? 파일 내용이 바뀔까요?

**명령**

**① 메모 한 줄 추가** — 다섯 줄을 한 번에 복사해 붙여넣으세요.

```zsh
if [[ "$(git rev-parse --show-toplevel 2>/dev/null)" == "$HOME"/b32-practice.*/Codyssey_B3-2 ]]; then
  grep -qxF '실습 메모: AI가 작성한 초안은 사람이 검토한다.' README.md || printf '\n실습 메모: AI가 작성한 초안은 사람이 검토한다.\n' >> README.md
  git status --short
else
  echo "멈추세요: 연습 저장소가 아닙니다. 아무것도 바꾸지 않았습니다."
fi
```

핵심은 가운데 줄 끝의 `printf '…' >> README.md`입니다. `>>`는 파일 **끝에 덧붙이기**이고, `\n`이 두 번 있어 빈 줄 하나와 메모 한 줄이 추가됩니다. 나머지는 안전장치입니다. 바깥의 `if`는 연습 저장소일 때만 실행하게 하고, `grep -qxF … ||`는 메모가 이미 있으면 다시 넣지 않게 합니다.

**② add 이전 관찰** — 구분선을 반드시 함께 실행하세요.

```bash
echo "===== git status ====="
git status --short

echo "===== git diff ====="
git diff

echo "===== git diff --cached ====="
git diff --cached
```

**③ 스테이징** `git add README.md`

**④ add 이후 관찰** — ②의 여섯 줄을 **그대로 다시** 실행합니다.

**⑤ 스테이징 해제** — 파일 수정은 남깁니다(상태 B). `git restore --staged README.md` 뒤 `git status --short`

**관찰 목록** — 아래 표를 내 결과로 먼저 채워 보세요.

| 항목 | add 이전 | add 이후 |
| --- | --- | --- |
| `git status --short`의 `M` 위치 | | |
| `git diff` | | |
| `git diff --cached` | | |

- [ ] `+`로 시작하는 줄은 몇 줄인가요?
- [ ] add 이전의 `git diff`와 add 이후의 `git diff --cached`를 비교하면?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과 · 도식 01</b></summary>

`실제 · 2026-11-25 Owner`

| 항목 | add 이전 | add 이후 |
| --- | --- | --- |
| status | 공백 뒤 M (` M`) | M 뒤 공백 (`M `) |
| diff | 변경 내용 출력 | 출력 없음 |
| diff --cached | 출력 없음 | 변경 내용 출력 |

> Owner 메모: 구분선 없이 세 명령을 연속 실행했을 때는 출력되는 글이 같아 보여 차이를 구분하지 못했습니다. 구분선을 넣고 아래 도식으로 정리하자 차이가 이해되었습니다.

`재현 · Claude` add 이전 전체 출력 (스토리 그림 F3 개정안과 같은 출력)

````text
===== git status =====
 M README.md
===== git diff =====
diff --git a/README.md b/README.md
index 7322076..076b2f1 100644
--- a/README.md
+++ b/README.md
@@ -76,3 +76,5 @@ python -m unittest discover -s tests -v
 ```
 
 macOS에서는 `python3`를 사용하세요. … 자동 재시도도 하지 않습니다.
+
+실습 메모: AI가 작성한 초안은 사람이 검토한다.
===== git diff --cached =====
````

(마지막 구분선 아래에 아무것도 없는 것이 “출력 없음”입니다. add 이후에는 같은 diff가 `git diff --cached` 아래로 옮겨 가고 `git diff` 아래가 비어 있습니다.)

**핵심 결과**
- **내용이 바뀐 것이 아니라 비교하는 두 칸이 바뀐 것입니다.** Git은 파일을 **마지막 커밋(HEAD) · 스테이징 영역 · 작업 폴더** 세 곳에 나눠 기억합니다. `git diff`는 스테이징 영역↔작업 폴더, `git diff --cached`는 마지막 커밋↔스테이징 영역을 비교합니다. `git status --short`의 왼쪽 글자는 앞 비교, 오른쪽 글자는 뒤 비교입니다.
- **diff 읽기** `+`는 새로 생긴 줄(빈 줄 하나와 메모 한 줄, 2줄), 공백으로 시작하는 줄은 위치를 알려 주는 **주변 줄**, `@@ -76,3 +76,5 @@`는 “원래 76번째 줄부터 3줄이 새 파일에서 5줄이 되었다”는 위치 표시입니다. 메모 뒤에 주변 줄이 없으므로 **파일의 마지막**에 추가된 것입니다.
- **핵심 질문 · 변경 내용이 같다면 왜 B3-2 프로그램은 두 diff를 모두 실행할까?** 내 답을 먼저 적어 본 뒤 펼치세요.
  <details><summary>해설</summary>프로그램은 학습자가 <code>git add</code>를 했는지, 일부만 했는지 알 수 없습니다. 변경은 스테이징 영역에 있을 수도, 작업 폴더에만 있을 수도, 양쪽에 나뉘어 있을 수도 있습니다. 한 가지 diff만 보면 다른 쪽의 변경을 놓칩니다. 그래서 둘 다 모아 <code>Staged diff:</code>와 <code>Unstaged diff:</code> 두 칸에 나눠 담습니다(Lab 05). 양쪽에 나뉜 경우는 B-1에서 직접 볼 수 있습니다.</details>

**도식 01 · Git 변경 영역 비교** (웹에서는 add 전·후를 전환해 보는 그림)

```text
                마지막 커밋(HEAD)      스테이징 영역        작업 폴더(README.md)
add 이전         메모 없음      ══같음══  메모 없음   ≠≠다름≠≠  메모 있음        status " M"
                     └─ --cached: 출력 없음 ─┘   └─ diff: 메모 줄 ─┘
                                     ▲ git add README.md (작업 폴더 → 스테이징 영역으로 복사)
add 이후         메모 없음      ≠≠다름≠≠  메모 있음   ══같음══  메모 있음        status "M "
                     └─ --cached: 메모 줄 ─┘     └─ diff: 출력 없음 ─┘
```

</details>

**돌아가기** → **S1-2 F3**: 그림의 **` M README.md`의 `M`이 오른쪽 칸에 있는 것**과 맨 아래 **“`git diff --cached` · 이번에는 없다”**. 그림은 내 add **이전** 화면과 같습니다. 이어서 → **S3-1 F6**: “보낼 글에 담는 것”의 **“git add 전후 변경을 함께 읽음”** 줄.
- 확인 질문: 프로그램은 왜 두 종류의 diff를 모두 수집하나요? 내 결과의 어느 줄이 근거인가요? → <details><summary>예시 답</summary>add 전엔 <code>git diff</code> 아래에만, add 후엔 <code>git diff --cached</code> 아래에만 메모 줄이 나왔습니다. 프로그램은 제가 add했는지 모르니까, 둘 다 봐야 변경을 빠짐없이 모읍니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. 양쪽에 나뉜 변경 — 두 diff가 서로 다른 내용을 담을 때 (10분 · API 0회)</summary>

상태 C에서 한 줄을 더 추가합니다.

```bash
git add README.md                       # 상태 C
printf '두 번째 메모\n' >> README.md
echo "===== git status ====="; git status --short
echo "===== git diff (끝 2줄) ====="; git diff | tail -2
echo "===== git diff --cached (끝 2줄) ====="; git diff --cached | tail -2
```

`재현 · Claude`

```text
===== git status =====
MM README.md
===== git diff (끝 2줄) =====
 실습 메모: AI가 작성한 초안은 사람이 검토한다.
+두 번째 메모
===== git diff --cached (끝 2줄) =====
+
+실습 메모: AI가 작성한 초안은 사람이 검토한다.
```

`MM`: 두 비교 모두에 차이가 있습니다. 한쪽만 보면 반드시 하나를 놓칩니다. 도식 01에 “두 번째 메모”가 작업 폴더에만 있는 세 번째 줄을 그려 보세요.

**원래대로** [상태 A로 되돌리기](#실습-상태-카드) → [A → B 메모 추가](#실습-상태-카드)

</details>

### C. 문제 해결

<details>
<summary>결과가 예상과 다르다면</summary>

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `+` 줄이 4줄 이상, 메모가 두 번 보인다 | v0.3의 `printf` 한 줄을 두 번 실행했을 수 있습니다. [상태 A로 되돌리기](#실습-상태-카드) 뒤 A → B를 다시 하세요. r1의 메모 추가 명령은 두 번 실행해도 한 줄입니다. |
| `git status`에 `?? 어떤파일` | 저장소 안에 새 파일이 생겼습니다(예: 실습 코드를 파일로 저장). 이 파일 이름은 Lab 05의 Git 문맥에도 들어갑니다. 지우거나 저장소 밖으로 옮기세요. |
| `git restore`가 없는 명령이라고 나온다 | 오래된 Git입니다. `git reset HEAD README.md`가 `git restore --staged README.md`와 같은 일을 합니다. 강사에게 알리세요. |
| 첫 줄이 `멈추세요` | 다른 폴더에 있습니다. 메모를 추가하지 말고 Lab 01 C를 보세요. |

</details>

---

<a id="lab-04"></a>

## Lab 04. Python이 다른 프로그램을 실행하는 방법

> 핵심 8분 · 추가 탐구 7분 · API 0회 · 키 필요 없음 · 시작 상태 아무 상태(B 권장)
>
> **출발 화면** S2-1 “Python은 Git을 어떻게 실행하나?” · S2-2 · **연결 도식** 도식 02 · 도식 06 · **관련 용어** `python-subprocess` `process` `exit-code` `stdin-stdout` `shell` · 다루지 않음: 셸 없는 실행의 보안 차이

### A. 핵심 실습

**목적** Lab 03에서 사람이 입력한 Git 명령을 Python이 실행하게 하고, 성공과 실패를 나란히 놓고 Python이 무엇을 받는지 봅니다.

**실행 전 질문**
- Git이 실패했다는 것을 Python은 무엇을 보고 알까요? 출력이 비어 있으면 실패일까요?
- 오류 메시지는 `stdout`과 `stderr` 중 어디에 담길까요?

**명령** — 코드를 파일로 저장하지 않고 바로 실행합니다(저장소에 새 파일이 생기면 Git 문맥이 달라집니다). `python3 - <<'EOF'`부터 마지막 `EOF`까지 **한 번에** 복사해 붙여넣으세요.

```bash
python3 - <<'EOF'
import subprocess
import tempfile

outside = tempfile.mkdtemp()  # Git 저장소가 아닌 빈 임시 폴더

for label, folder in [("저장소 안", "."), ("저장소 밖", outside)]:
    result = subprocess.run(
        ["git", "status", "--short"],
        cwd=folder,
        capture_output=True,
        text=True,
    )
    print(f"===== {label} =====")
    print("returncode:", result.returncode)
    print("stdout:", repr(result.stdout))
    print("stderr:", repr(result.stderr))
EOF
```

- `cwd=` 어느 폴더에서 실행할지 · `capture_output=True` 출력을 화면 대신 Python이 받음 · `text=True` 받은 출력을 글자로 · `repr()` 줄바꿈 같은 보이지 않는 글자를 `\n`처럼 보여 줌

**관찰 목록**
- [ ] 저장소 안과 밖의 `returncode`는 각각 몇인가요?
- [ ] 저장소 밖의 `stdout`은? 오류 메시지는 어느 쪽에?
- [ ] 저장소 안의 `stdout`은 Lab 03의 어떤 출력과 같나요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과 · 도식 02</b></summary>

`재현 · Claude` (상태 B, 한국어 로캘) — 이 Lab은 Owner 실행 기록이 없습니다.

```text
===== 저장소 안 =====
returncode: 0
stdout: ' M README.md\n'
stderr: ''
===== 저장소 밖 =====
returncode: 128
stdout: ''
stderr: 'fatal: (현재 폴더 또는 상위 폴더 중 일부가) 깃 저장소가 아닙니다: .git\n'
```

영어 환경에서는 `stderr`가 `'fatal: not a git repository (or any of the parent directories): .git\n'`입니다(스토리 그림 F5의 표기). 언어가 달라도 `returncode`는 같습니다.

**핵심 결과**
- **종료 상태는 Git이 정하고, 운영체제가 전달하고, Python은 `returncode`로 받습니다.** 저장소가 아닌 곳에서 Git은 128로 끝납니다.
- **성공 여부는 `returncode`로 판단합니다.** 저장소 밖에서도 `stdout`은 비어 있지만, 성공한 명령도 보여 줄 것이 없으면 비어 있습니다(상태 A의 저장소 안).
- **`stdout`·`stderr`는 화면이나 파일이 아니라 출력 통로입니다.** `capture_output=True`가 통로의 끝을 Python에 연결해 문자열로 받았습니다. 저장소 안의 `' M README.md\n'`은 Lab 03에서 내 눈으로 본 바로 그 줄입니다.

**도식 02 · Python과 외부 프로그램의 관계**

```text
 ┌ Python ────────────────────┐  ① 실행 요청   ┌ 운영체제 ┐  ② 실행    ┌ Git ──────────────────┐
 │ subprocess.run([...])      │ ─────────────▶ │          │ ─────────▶ │ git status --short    │
 │ result.returncode ◀────────┼── ④ 전달 ──────┤          │ ◀── ③ 종료 0 / 128 (Git이 정함)    │
 │ result.stdout     ◀────────┼── stdout 통로 ─────────────────────────┤ 일반 출력 " M README.md" │
 │ result.stderr     ◀────────┼── stderr 통로 ─────────────────────────┤ 오류 "fatal: …"          │
 └────────────────────────────┘  통로의 끝 = Python (capture_output=True)  └───────────────────────┘
```

</details>

**돌아가기** → **S2-1 F4**: ② `subprocess.run()` 칸의 **“프로그램 → Git · Git 명령을 실행”** 이 방금 내가 실행한 `subprocess.run()`입니다. → **S2-2 F5**: 맨 위 **결과 세 칸**의 값(`returncode` “안 0 · 밖 128”, `stdout` ` M README.md`)을 내 화면의 값과 하나씩 맞춰 보세요.
- 확인 질문: Python은 Git의 실행 결과를 어떻게 받나요? “stdout이 비었으니 실패다”는 맞나요? → <details><summary>예시 답</summary><code>subprocess.run()</code>으로 실행하면 Git이 정한 종료 상태를 운영체제가 전달해 <code>returncode</code>로 받고, 출력은 <code>stdout</code>·<code>stderr</code> 통로로 받습니다. 성공해도 보여 줄 게 없으면 stdout이 비므로 성공 여부는 returncode로 봅니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. 옵션을 빼면? — 통로의 끝이 바뀌는 모습 (5분 · API 0회)</summary>

```bash
python3 - <<'EOF'
import subprocess

print("--- A. capture_output 없이 ---")
a = subprocess.run(["git", "status", "--short"])
print("stdout 속성:", a.stdout)

print("--- B. text=True 없이 ---")
b = subprocess.run(["git", "status", "--short"], capture_output=True)
print("stdout 속성:", b.stdout)
EOF
```

`재현 · Claude`

```text
--- A. capture_output 없이 ---
 M README.md
stdout 속성: None
--- B. text=True 없이 ---
stdout 속성: b' M README.md\n'
```

A: 통로의 끝이 터미널이라 Git의 출력이 **화면으로 바로** 나갔고 Python은 받지 못했습니다(`None`). B: 받았지만 **바이트**(`b'…'`)입니다. B3-2는 `text=True`에 `encoding="utf-8"`을 더해 한글이 깨지지 않게 합니다. 도식 06의 “통로 끝의 연결”과 같은 이야기입니다.

</details>

<details>
<summary>B-2. 출력이 비었다 ≠ 실패 (2분 · API 0회)</summary>

`재현 · Claude` `git log -- 없는파일.txt`는 보여 줄 기록이 없어 stdout·stderr가 모두 비지만 `returncode`는 0입니다. 출력만 보고 성공·실패를 판단할 수 없는 또 하나의 예입니다.

</details>

### C. 문제 해결

<details>
<summary>결과가 예상과 다르다면</summary>

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| 저장소 안의 `stdout`이 `''` | 상태 A입니다. 정상입니다. 성공했지만 보여 줄 변경이 없습니다. |
| 저장소 안인데 `returncode`가 128 | 저장소 폴더 밖에서 실행했습니다. Lab 01 C의 마지막 줄을 보세요. |
| `heredoc>` 프롬프트가 계속 나온다 | 마지막 `EOF` 줄이 빠졌습니다. `EOF`만 입력하고 Enter를 누르세요. |

</details>

---

<a id="lab-05"></a>

## Lab 05. AI에게 전달할 Git 문맥 만들기

> 핵심 8분 · 추가 탐구 8분 · API 0회 · 키 필요 없음 · 시작 상태 **B** (C도 가능)
>
> **출발 화면** S3-1 “무엇을 내 컴퓨터 밖으로 보내나?” · **연결 도식** 도식 03(왼쪽 절반) · **관련 용어** `git-diff` `staging-area-git-add` `data-masking` `secret-management` `safe-mode` `prompt-design` · 다루지 않음: 마스킹 정규식, `--unsafe`

### A. 핵심 실습

**목적** B3-2 프로그램의 실제 함수를 불러, AI에게 보낼 글(Git 문맥)을 **보내기 전에** 내 눈으로 확인합니다. 이 명령은 아무것도 보내지 않습니다.

**실행 전 질문**
- 보낼 글에는 README.md 전체가 들어갈까요, 바뀐 부분만 들어갈까요?
- 상태 B에서 `Staged diff:` 칸과 `Unstaged diff:` 칸 중 어디에 메모 줄이 있을까요?

**명령**

```bash
python3 - <<'EOF'
from pathlib import Path
from ai_gitgen.git_collector import collect_changes
from ai_gitgen.security import prepare_context

changes = collect_changes(Path.cwd())
context = prepare_context(changes)

print(context)
print("전체 글자 수:", len(context))
EOF
```

`collect_changes()`는 Lab 04처럼 Git을 여러 번 실행해 변경을 모으고, `prepare_context()`는 모은 정보를 하나의 글로 묶어 보내기 전에 검사합니다.

**관찰 목록**
- [ ] 글이 몇 개의 칸(제목 줄)으로 나뉘나요? 비어 있는 칸은?
- [ ] 메모 줄은 어느 칸에 있나요? Lab 03의 어떤 출력과 같나요?
- [ ] 전체 글자 수는?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과 · 도식 03</b></summary>

`실제 · 2026-11-25 Owner` — 구조와 글자 수 (Owner 기록에서 diff 중간은 `...`)

```text
Branch: main

Status:
 M README.md

Changed files:
README.md

Untracked files (names only):


Staged diff:


Unstaged diff:
diff --git a/README.md b/README.md
...
+
+실습 메모: AI가 작성한 초안은 사람이 검토한다.
전체 글자 수: 535
```

`재현 · Claude` — `...` 부분까지 같은 글을 다시 만들었고 글자 수도 535로 같았습니다. [Git 문맥 원문](assets/evidence/context-readme-2026-11-25.txt)

**핵심 결과**
- **여섯 칸** `Branch` · `Status` · `Changed files` · `Untracked files (names only)` · `Staged diff` · `Unstaged diff`. 상태 B라 `Staged diff:`는 비고 메모 줄은 `Unstaged diff:`에 있습니다. Lab 03의 add 이전 `git diff`와 같은 글입니다.
- **바뀐 줄과 그 주변만 들어갑니다.** README.md 전체(약 80줄)가 아니라 diff가 들어갑니다. 메모 앞의 세 줄은 위치를 알려 주는 주변 줄이고, 메모 뒤에는 줄이 없습니다. 그래서 Lab 08의 AI 초안이 “README.md **마지막에**”라고 쓸 수 있었습니다.
- **보내기 전 검사** 이메일·토큰처럼 보이는 값은 `[REDACTED …]`로 가린 뒤 계속하고, 비밀 파일로 보이는 경로(`.env`, `*.pem` 등)가 있거나 16,000자를 넘으면 전송을 멈춥니다(요청 0회). 이번 사례는 가릴 값이 없어 검사 전후가 같습니다. 검사는 정해 둔 모양만 찾으므로, 보내기 전에 사람이 diff를 직접 확인하는 습관이 필요합니다.
- **535자는 이 실행의 관찰값입니다.** README 내용, 브랜치 이름, 저장소의 다른 파일에 따라 달라집니다(B-2, C).

**도식 03 · Git 문맥에서 요청 JSON으로** (왼쪽 절반 — 오른쪽 절반은 Lab 06)

```text
 [Git 출력]                 [Python: collect_changes]   [Python: prepare_context]           [Git 문맥 · 이번 실행 535자]
 git status --short  ─────▶ 상태 · 파일 목록      ─┐                                        Branch: main
 git diff            ─────▶ Unstaged diff         ─┼──▶ 여섯 칸으로 묶기 ──▶ 검사(가림/멈춤) ──▶ …
 git diff --cached   ─────▶ Staged diff (비어 있음)─┘                                        +실습 메모: AI가 작성한 초안은 사람이 검토한다.
                                                                                               │
                                                                                               ▼ 다음: 요청 JSON의 user 메시지 (Lab 06)
```

</details>

**돌아가기** → **S3-1 F6**: 오른쪽 **“검사를 마친 글” 상자의 글자 수**와 왼쪽 아래 **Git 문맥 발췌**(`Branch: main` · ` M README.md` · `+실습 메모 …`)를 내 화면과 맞춰 보세요. 사례 통일 개정 후 그림은 **535자**입니다. *개정 전 그림에는 다른 변경(2026-10-20)의 806자가 남아 있습니다.*
- 확인 질문: Git이 보여 준 정보와 실제로 외부에 보낼 글은 같은가요? 무엇이 더해지거나 바뀌나요? → <details><summary>예시 답</summary>같지 않습니다. Python이 브랜치·상태·파일 목록·두 diff를 여섯 칸으로 묶고, 보내기 전에 검사해서 감지한 값은 가립니다. 이번에는 가릴 값이 없어 Git의 diff가 그대로 들어갔고, 묶은 글은 535자였습니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. 검사가 값을 가리는 모습 (5분 · API 0회) — 가짜 이메일로만</summary>

```bash
printf '문의: lab-test@example.com\n' >> README.md
```

A의 명령을 다시 실행하면 `재현 · Claude` 문맥 끝이 `+문의: [REDACTED EMAIL]`로 바뀝니다. 끝나면 [상태 A로 되돌리기](#실습-상태-카드) → [A → B](#실습-상태-카드).

</details>

<details>
<summary>B-2. 저장소 안에 새 파일이 생기면 (3분 · API 0회)</summary>

`재현 · Claude` 저장소 안에 `lab-note.py`가 있으면 `Status`에 `?? lab-note.py`, `Untracked files`에 이름이 더해져 573자가 됩니다. 파일 **내용**은 들어가지 않고 **이름만** 들어갑니다(S3-1 그림 “새 파일은 이름만”). 상태 C에서 실행하면 같은 diff가 `Staged diff:`로 옮겨 가고 글자 수는 535로 같습니다.

</details>

### C. 문제 해결

<details>
<summary>결과가 예상과 다르다면</summary>

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `ModuleNotFoundError: No module named 'ai_gitgen'` | 저장소 폴더 밖에서 실행했습니다. Lab 01 C의 마지막 줄을 보세요. |
| 글자 수가 535가 아니다 | 이상한 것이 아닙니다. `git status --short`로 다른 파일이 바뀌었는지, 메모가 두 번 들어갔는지 확인하세요. `Branch:` 줄이 `main`이 아니어도 달라집니다(예: `(detached HEAD)`이면 546자, `재현 · Claude`). |
| `SecurityError: 비밀 파일로 보이는 경로…` | 변경 목록에 `.env` 같은 이름의 파일이 있습니다. 실습에서 만든 파일이라면 지우세요. 검사가 제대로 작동한 것입니다. |
| diff 칸이 둘 다 비어 있다 | 상태 A입니다. [A → B](#실습-상태-카드)를 실행하세요. |

</details>

---

<a id="lab-06"></a>

## Lab 06. 외부 AI API 요청 구성하기

> 핵심 8분 · 추가 탐구 5분 · API 0회(보내지 않고 만들기만) · 키 필요 없음 · 시작 상태 **B**
>
> **출발 화면** S3-2 “요청은 무엇을 담아 어디로 가나?” · **연결 도식** 도식 03(오른쪽 절반) · **관련 용어** `json` `json-request-response` `serialization` `list-dict` `prompt-design` `ai-model` `http-post` `api-key` `utf-8` · 다루지 않음: HTTP 헤더 전반, HTTPS 암호화

### A. 핵심 실습

**목적** Lab 05의 Git 문맥이 요청의 어디에 들어가는지 확인합니다. **보내지 않고** 요청 본문만 만들어 출력합니다.

**실행 전 질문**
- Git 문맥 안의 줄바꿈은 JSON 글 안에서 어떻게 보일까요?
- API 키는 요청 본문(JSON)에 들어갈까요?

**명령**

```bash
python3 - <<'EOF'
import json
from pathlib import Path
from ai_gitgen.git_collector import collect_changes
from ai_gitgen.security import prepare_context
from ai_gitgen.prompts import COMMIT_SYSTEM

context = prepare_context(collect_changes(Path.cwd()))

payload = {
    "model": "gpt-5-mini",
    "messages": [
        {"role": "system", "content": COMMIT_SYSTEM},
        {"role": "user", "content": context},
    ],
}

print("===== 1. Python 데이터(딕셔너리) =====")
print(type(payload))
print(payload["messages"][1]["content"][:40])

print("===== 2. 보낼 JSON 글(앞부분) =====")
body = json.dumps(payload, ensure_ascii=False)
print(type(body))
print(body[:420])

print("===== 3. 확인 =====")
print("user 메시지 == Git 문맥:", payload["messages"][1]["content"] == context)
print("JSON 글 길이:", len(body))
print("다시 읽으면 같은 데이터:", json.loads(body) == payload)
EOF
```

**관찰 목록**
- [ ] `type(payload)`와 `type(body)`는?
- [ ] 1번에서 Git 문맥은 여러 줄로 보이나요? 2번에서는?
- [ ] `user 메시지 == Git 문맥`의 결과는?
- [ ] 출력 어디에도 API 키가 없나요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과 · 도식 03</b></summary>

`재현 · Claude` (전송하지 않은 재현용 JSON)

```text
===== 1. Python 데이터(딕셔너리) =====
<class 'dict'>
Branch: main

Status:
 M README.md

Chan
===== 2. 보낼 JSON 글(앞부분) =====
<class 'str'>
{"model": "gpt-5-mini", "messages": [{"role": "system", "content": "You write Git commit messages in Korean. … Do not claim tests ran."}, {"role": "user", "content": "Branch: main\n\nStatus:\n M README.md\n\nChanged fi
===== 3. 확인 =====
user 메시지 == Git 문맥: True
JSON 글 길이: 933
다시 읽으면 같은 데이터: True
```

JSON 글의 끝부분은 `…자동 재시도도 하지 않습니다.\n+\n+실습 메모: AI가 작성한 초안은 사람이 검토한다.\n"}]}`입니다.

**핵심 결과**
- **`user` = Lab 05의 Git 문맥 그대로.** `True`는 535자 글이 한 글자도 바뀌지 않고 들어갔다는 뜻입니다. **`system` = 작성 규칙**(커밋 메시지를 이렇게 써라). `pr` 명령은 이 자리만 PR 작성 규칙으로 바뀝니다(Lab 08).
- **API 키는 본문에 없습니다.** 키는 실제 전송 때 본문과 따로 **인증 헤더**(`Authorization: Bearer …`)에 들어갑니다.
- **딕셔너리 → JSON 글.** `json.dumps()`가 Python 데이터를 누구나 읽을 수 있는 JSON **글**(`str`)로 바꿉니다. JSON 문자열 안에는 실제 줄바꿈을 넣을 수 없어서 줄바꿈 하나가 `\` + `n` 두 글자로 적힙니다. 받는 쪽이 읽으면 다시 줄바꿈이 됩니다.
- **미리 보기 ≠ 실제 요청.**

| | 이 Lab의 미리 보기 | 실제 네트워크 요청 (Lab 07·08) |
| --- | --- | --- |
| 무엇 | 내 컴퓨터에서 만들어 출력만 한 본문 | `python3 main.py commit`·`pr`이 실제로 보낸 요청 |
| 포함 | 본문(`model`, `messages`)만 | 주소, `POST`, 인증 헤더, `Content-Type`, UTF-8 본문(HTTPS로 암호화) |
| 인터넷으로 나감 | **아니요** | 예 (요청 횟수 1) |
| 기록 | 위 출력 | 캡처하지 않았습니다. 같은 함수가 같은 구조를 만든다는 것은 소스로 확인(구현) |

**도식 03 · Git 문맥에서 요청 JSON으로** (오른쪽 절반)

```text
 [Git 문맥 · Lab 05]               [Python 데이터 payload]                 [JSON 글 body · 이번 재현 933자]
 Branch: main          ──같은 글──▶ {"model": "gpt-5-mini",       json.dumps   {"model": "gpt-5-mini", "messages": [
 …                                  "messages": [                ─────────▶    {"role": "system", "content": "You write…"},
 +실습 메모: …                         {system: 작성 규칙},                       {"role": "user", "content": "Branch: main\n…\n+실습 메모: …\n"}]}
                                       {user: ← 이 자리}  ]}      ◀─────────                          ↑ 줄바꿈 → \n
                                     user 메시지 == Git 문맥: True   json.loads     API 키는 여기에 없음 → 인증 헤더 (도식 04)
```

</details>

**돌아가기** → **S3-2 F7**: 왼쪽 요청 상자의 **`user:` 줄(앞 화면의 Git 문맥)** 과 화살표 위 **“딕셔너리 → JSON”** 칩. 내 `True`가 이 한 줄을 증명합니다. 같은 상자의 **인증 헤더 줄**이 본문과 따로 있는 것도 확인하세요.
- 확인 질문: Git 문맥은 API 요청에서 어디에 들어가나요? `system`과 `user`의 역할은? → <details><summary>예시 답</summary><code>messages</code> 안 <code>user</code> 메시지의 <code>content</code>에 Lab 05의 글이 그대로 들어갑니다(내 결과 <code>True</code>). <code>system</code>은 어떻게 쓸지 정한 작성 규칙이고, <code>user</code>는 이번 변경의 재료입니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. 한글과 따옴표는 JSON에서 어떻게 적힐까? (5분 · API 0회)</summary>

A의 명령에서 `ensure_ascii=False`를 지우고 다시 실행해 보세요. `재현 · Claude` 한글이 `실습`처럼 바뀝니다. 받는 쪽이 읽으면 같은 글입니다. 문자열 안의 `"`는 `\"`로 적힙니다. 실제 전송 때는 이 글을 UTF-8 바이트로 바꿔 보냅니다(이번 재현 933자 → 1165바이트).

</details>

### C. 문제 해결

<details>
<summary>결과가 예상과 다르다면</summary>

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `user 메시지 == Git 문맥: False` | 코드를 고쳐 실행했을 수 있습니다. 위 코드를 그대로 다시 붙여넣으세요. |
| 한글이 `실…`로 보인다 | `ensure_ascii=False`가 빠졌습니다. 틀린 것은 아니고 표기만 다릅니다. |
| JSON 글 길이가 933이 아니다 | Lab 05의 글자 수가 달랐다면 함께 달라집니다. 정답 값이 아닙니다. |

</details>

---

<a id="lab-07"></a>

## Lab 07. 첫 API 요청과 오류 구분

> 핵심 10분 · 추가 탐구 10분 · **API 핵심 1회**(추가 탐구 +1회) · **키 필요** · 시작 상태 **B**
>
> **출발 화면** S3-2 “요청은 무엇을 담아 어디로 가나?” · **연결 도식** 도식 04 · **관련 용어** `api-key` `environment-variable` `secret-management` `http-request-response` `http-status-code` `http-200-ok` `authentication-error` `network-error` `curl` `troubleshooting` `zsh-bash` · 다루지 않음: HTTP 상태 코드 전체 목록, 프록시

> **비용 안내** 실제 API 호출은 사용량과 비용이 생길 수 있습니다. 핵심 실습은 `python3 main.py commit`을 **한 번** 실행합니다. 오류를 일부러 만들지 마세요. 오류가 나면 같은 요청을 반복하지 말고 C를 보세요.

### A. 핵심 실습

**목적** API 키를 안전하게 설정하고 첫 실제 요청을 보냅니다. 오류가 나면 “요청 **전**에 내 컴퓨터에서 멈췄는지, 요청 **후** 외부 API가 거절했는지”를 구분합니다.

**시작 조건** 상태 B. 강사에게 받은 API 키. 화면 공유·녹화 중이 아닐 것.

**실행 전 질문**
- 키를 숨겨서 붙여넣으면 화면에 아무것도 보이지 않습니다. 제대로 붙여넣었는지 어떻게 확인할 수 있을까요?
- 요청이 실패했다면 요청 횟수는 0일까요, 1일까요?

**명령**

**① 키를 보이지 않게 입력** (macOS zsh)

```zsh
read -rs "CODYSSEY_API_KEY?API 키를 붙여넣고 Enter (화면에 보이지 않음): "; echo
export CODYSSEY_API_KEY
export CODYSSEY_API_URL='https://copa.codyssey.kr/v1/chat/completions'
export CODYSSEY_MODEL='gpt-5-mini'
```

- `read -s`는 입력을 화면에 표시하지 않습니다. **붙여넣었는지조차 보이지 않으니 한 번만** 붙여넣고 Enter를 누르세요.
- 이 방법은 키를 **셸 기록(history)** 에 남기지 않습니다. `export CODYSSEY_API_KEY='키'`처럼 키를 명령줄에 직접 적으면 공용 PC의 셸 기록에 남을 수 있으므로 쓰지 않습니다.
- 주소와 모델은 2026-11-25에 성공한 설정입니다. 바뀔 수 있으니 강사가 안내한 값을 따르세요.

**② 키 값은 보지 않고 입력 상태만 확인**

```zsh
echo "키 길이: ${#CODYSSEY_API_KEY}"
printf '%s' "$CODYSSEY_API_KEY" | LC_ALL=C tr -d '[:alnum:]_-' | wc -c | xargs echo "영문·숫자·_·- 이외 문자 수:"
```

**③ 첫 요청 (API 1회)**

```bash
python3 main.py commit
```

**관찰 목록**
- [ ] 키 길이가 0이 아닌가요? 강사가 알려 준 길이와 같나요?
- [ ] ③의 결과가 초안인가요, `오류:`로 시작하나요?
- [ ] 마지막 줄 `AI API 요청 횟수`는 몇인가요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과 · 도식 04</b></summary>

**성공했다면** 출력은 Lab 08의 COMMIT 실행 기록과 같은 모양입니다. 이 초안을 Lab 08에서 그대로 씁니다(추가 호출 없음).

**오류가 났던 실제 사례** `실제 · 2026-11-25 Owner` — 같은 명령이 처음에는 이렇게 끝났습니다.

```text
오류: AI API 응답 오류 (HTTP 400).
AI API 요청 횟수: 1
```

키를 다시 입력한 뒤 같은 명령이 성공했습니다(진단 과정은 C).

**핵심 결과 · 오류는 언제 멈췄나로 나눈다**

| 언제 멈췄나 | 오류 문구 | 요청 횟수 | 근거 |
| --- | --- | --- | --- |
| 보내기 **전** — 내 컴퓨터 안 | `확인된 API 주소와 모델이 필요합니다.` · `모델과 CODYSSEY_API_KEY가 필요합니다.` | 0 | 재현 · Claude |
| 보낸 **후** — 외부 API가 거절 | `인증 또는 권한 오류 (HTTP 401)` · `(HTTP 403)` | 1 | 구현 |
| | `AI API 응답 오류 (HTTP 400)` 등 그 밖의 HTTP 오류 | 1 | **실제 · Owner** (400) · 구현 |
| 보낸 **후** — 응답을 받지 못했거나 응답이 이상함 | `네트워크 연결에 실패했습니다.` · `응답이 올바른 JSON이 아닙니다.` · `응답에 텍스트가 없습니다.` | 1 | 구현 |

- **요청 횟수는 보내기를 시도한 순간 1이 됩니다.** 그래서 실패해도 1입니다. Owner의 400 사례가 그 증거입니다. 실패한 요청이 과금되는지는 공급자 정책에 따르며 확인하지 않았습니다.
- **B3-2는 상태 코드만 알려 주고 응답 본문은 보여 주지 않습니다.** 그래서 400의 이유를 프로그램 출력만으로는 알 수 없습니다.

**도식 04 · AI API 요청과 응답**

```text
 ┌ 내 컴퓨터 · B3-2 프로그램 ─────────────────────┐             ┌┄ 외부 · 코디세이 AI API ┄┐
 │ 환경변수: URL · 모델 · 키(숨김 입력)            │             ┆                          ┆
 │  비었거나 형식이 틀림 → 여기서 멈춤 (요청 0회)   │             ┆                          ┆
 │ 요청: POST 주소                                 │  ① 요청 ──▶ ┆ 인증·형식 확인            ┆
 │       인증 헤더 Authorization: Bearer ••••      │             ┆                          ┆
 │       요청 JSON {model, messages[system, user]} │             ┆                          ┆
 │ 응답: 200 → 응답 JSON → choices[0].message.content (Lab 08)  ◀── ② 응답 ┆ 상태 코드 + 본문 ┆
 │       400·401·403… → "오류: … (HTTP 코드)" (요청 1회)        ┆ (이번 400: HTML 본문)    ┆
 └─────────────────────────────────────────────────┘             └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
```

</details>

**돌아가기** → **S3-2 F7**: 요청 상자의 **인증 헤더 줄**(`Authorization: Bearer ••••`)이 ①에서 내가 숨겨 입력한 키가 들어가는 자리입니다. 오른쪽 **응답 상태 칩**(성공 / 401·403)에서 내 결과가 어느 갈래였는지 찾아보세요. Owner의 400은 사례 통일 개정 후 칩 “그 밖의 오류(예: 400)”에 해당합니다.
- 확인 질문: HTTP 오류가 발생하면 어느 부분부터 확인할 수 있나요? → <details><summary>예시 답</summary>먼저 요청 횟수로 요청 전에 멈췄는지(0) 보낸 뒤 거절됐는지(1)를 나눕니다. 보낸 뒤라면 상태 코드를 보고, 같은 요청을 반복하지 않고, 프로그램 → 직접 요청 → 최소 요청 순으로 범위를 줄여 공통 설정(주소·모델·키)을 확인합니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. 최소 연결 테스트 — B3-2도 Python도 빼고 curl로 직접 (10분 · <b>API +1회</b>)</summary>

외부 API의 응답을 **상태 코드와 본문까지** 그대로 보고 싶을 때 씁니다. 비용이 생길 수 있으니 한 번만 실행하세요.

```zsh
printf 'header = "Authorization: Bearer %s"\n' "$CODYSSEY_API_KEY" | curl -sS -i -K - "$CODYSSEY_API_URL" \
  -H "content-type: application/json" \
  -d '{"model":"gpt-5-mini","messages":[{"role":"user","content":"안녕하세요"}]}'
```

**왜 이렇게 쓰나요?** `-H "Authorization: Bearer $CODYSSEY_API_KEY"`로 쓰면 실행되는 동안 키가 curl의 **명령줄**에 펼쳐져, 같은 PC에서 프로세스 목록(`ps`)을 보는 사람에게 보일 수 있습니다. 위 방식은 키를 담은 헤더 줄을 zsh 내장 명령 `printf`로 만들어 curl에 **표준 입력**으로 넘기므로(`-K -`), 명령줄에 키가 나타나지 않습니다. `재현 · Claude` 가짜 키와 로컬 테스트 서버로, 앞 방식은 `ps`에 키가 보이고 이 방식은 보이지 않으며 서버에는 같은 인증 헤더가 도착함을 확인했습니다([근거 §4](assets/evidence/lab-v0.3-r1-repro-2026-11-25.txt)). 실제 코디세이 API에 이 형식으로 보낸 기록은 아직 없습니다.

`실제 · 2026-11-25 Owner` 같은 본문을 보낸 최소 연결 테스트의 응답(발췌, 고유 식별자 등 생략)

```text
HTTP/2 200
date: Wed, 25 Nov 2026 05:48:14 GMT
content-type: application/json

{"object": "chat.completion", "model": "gpt-5-mini",
 "choices": [{"index": 0,
              "message": {"role": "assistant",
                          "content": "안녕하세요! 저는 AI 어시스턴트입니다. 무엇을 도와드릴까요? (한국어로 계속할까요?)"},
              "finish_reason": "stop"}],
 "usage": {"prompt_tokens": 8, "completion_tokens": 101, "total_tokens": 109}}
```

(Owner는 `-H "Authorization: Bearer $CODYSSEY_API_KEY"` 형식으로 실행했습니다. 원문은 [근거 §3](assets/evidence/lab-v0.3-r1-owner-2026-11-25.txt)에 보존했습니다.) 이 응답은 “안녕하세요” 요청의 응답입니다. B3-2가 COMMIT·PR 초안을 만들 때의 응답이 아닙니다. 응답 구조는 Lab 08에서 다시 봅니다.

</details>

### C. 문제 해결

<details>
<summary>C-1. 결과가 예상과 다르다면 — 증상별 표</summary>

| 이렇게 나왔다면 | 먼저 확인할 것 |
| --- | --- |
| 키 길이 0 | 붙여넣기 전에 Enter를 눌렀을 수 있습니다. ①을 다시 하세요. |
| 키 길이가 강사가 알려 준 길이와 다르다 | 두 번 붙여넣었거나 다른 글자가 섞였을 수 있습니다. ①을 다시 하세요. (Owner 사례: 64자 → 다시 입력 56자. 56자는 그 키의 길이일 뿐 규칙이 아닙니다.) |
| 영문·숫자·`_`·`-` 이외 문자가 1개 이상 | 키 형식에 따라 정상일 수도 있습니다. 강사에게 확인하세요. 키 값을 화면에 출력하지 마세요. |
| `확인된 API 주소와 모델이 필요합니다` (요청 0회) | ①의 `export` 줄을 실행하지 않았거나 다른 터미널 창입니다. 환경변수는 설정한 창에서만 유효합니다. |
| `인증 또는 권한 오류 (HTTP 401/403)` (요청 1회) | 키가 틀렸거나 권한이 없습니다. 키를 한 번 다시 입력해 보고, 그래도 같으면 강사에게 알리세요. |
| `AI API 응답 오류 (HTTP 400)` (요청 1회) | 아래 C-2의 실제 사례를 보세요. 같은 요청을 반복하지 마세요. |
| `AI API 응답 오류 (HTTP 429)` 등 | 사용량 제한일 수 있습니다(공급자에 따라 다름. 코디세이 API의 제한 방식은 확인하지 않았습니다). 다시 보내지 말고 강사에게 알리세요. |
| `네트워크 연결에 실패했습니다` | 인터넷 연결을 확인하세요. 프로그램은 30초 기다리고 멈춥니다. |
| 초안 대신 `커밋 제목이 너무 길거나…` | API는 성공했지만 AI의 답이 형식 검사를 통과하지 못했습니다. Lab 08 C를 보세요. |

</details>

<details>
<summary>C-2. 실제 사례 · HTTP 400을 범위 줄이기로 해결한 과정 (읽기 자료 · 재현 요구 없음)</summary>

`실제 · 2026-11-25 Owner`

| 순서 | 무엇을 했나 | 결과 |
| --- | --- | --- |
| 1 | 기존에 입력한 키(길이 64자)로 `python3 main.py commit` | `오류: AI API 응답 오류 (HTTP 400).` · `AI API 요청 횟수: 1` |
| 2 | B3-2 코드를 빼고 Python으로 직접 최소 요청 | HTTP 400 · `Content-Type: text/html;charset=utf-8` |
| 3 | Python도 빼고 curl로 최소 요청 | 같은 결과. 본문은 제목이 `HTTP Status 400 – Bad Request`인 HTML 오류 페이지. **구체적인 원인은 본문에 없었음** |
| 4 | 키를 다시 입력(길이 56자) | HTTP 200 · JSON 응답 (B-1의 응답) |

```text
 [B3-2 프로그램] ── 400 ──▶ [Python 최소 요청 · B3-2 제외] ── 400 ──▶ [curl 최소 요청 · Python 제외] ── 400
        └── 셋 다 같은 오류 → 문제는 셋이 공통으로 쓰는 것(주소 · 모델 · 키)에 있다 ──▶ 키 다시 입력 → 200
```

| 항목 | 키 재입력 전 | 재입력 후 |
| --- | --- | --- |
| 키 길이 | 64자 | 56자 |
| HTTP 상태 | 400 | 200 |
| 응답 형식 | HTML | JSON |

- 처음 입력한 값이 잘못되었을 가능성이 높지만, **정확히 어떤 문자가 들어 있었는지는 확인하지 못했습니다.** 중복 붙여넣기가 원인이었다고 단정하지 않습니다.
- 본문 형식(JSON인지 HTML인지)은 “누가 이 응답을 만들었나”의 단서가 될 수 있지만, 이번 사례에서 어느 단계가 HTML을 만들었는지는 확인하지 못했습니다.
- **같은 오류 요청을 반복하지 않기.** 다시 보내기 전에 무엇 하나를 바꿨는지 말할 수 있어야 합니다. 같은 오류가 두 번 나면 멈추고 강사에게 알리세요.

직접 범위를 줄여 보고 싶다면 아래 Python 최소 요청(B3-2 제외)이나 B-1의 curl 최소 요청을 쓰세요. **둘 다 실제 API 요청(각 1회)** 이며, 키를 출력하지 않고 상태 코드·`Content-Type`·본문 앞부분만 보여 줍니다. Python 코드는 키를 환경변수에서 직접 읽으므로 명령줄에 키가 나타나지 않습니다. `재현 · Claude` 로컬 테스트 서버로만 동작을 확인했습니다.

```bash
python3 - <<'EOF'
import json, os
from urllib import error, request

payload = {"model": os.environ["CODYSSEY_MODEL"],
           "messages": [{"role": "user", "content": "안녕하세요"}]}
req = request.Request(
    os.environ["CODYSSEY_API_URL"],
    data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
    headers={"Authorization": "Bearer " + os.environ["CODYSSEY_API_KEY"],
             "Content-Type": "application/json"},
    method="POST",
)
try:
    with request.urlopen(req, timeout=30) as resp:
        status, ctype, body = resp.status, resp.headers.get("Content-Type"), resp.read()
except error.HTTPError as exc:
    status, ctype, body = exc.code, exc.headers.get("Content-Type"), exc.read()
print("HTTP 상태:", status)
print("Content-Type:", ctype)
print("응답 본문 앞부분:", body.decode("utf-8", "replace")[:300])
EOF
```

</details>

---

<a id="lab-08"></a>

## Lab 08. 실제 AI 응답과 두 초안

> 핵심 10분 · 추가 탐구 5분 · **API 핵심 1회**(Lab 07의 `commit` 결과를 그대로 씀) · **키 필요** · 시작 상태 **B**
>
> **출발 화면** S4-1 “같은 변경에서 왜 두 초안이 나오나?” · S1-1 · S3-2 · S4-2 · **연결 도식** 도식 05 · 도식 04(응답 부분) · **관련 용어** `pull-request` `commit-message-convention` `output-validation` `post-processing` `human-in-the-loop` `llm` `temperature` `json-request-response` · 다루지 않음: 좋은 커밋 메시지 작성법 전반

### A. 핵심 실습

**목적** 같은 Git 문맥으로 받은 `commit` 초안(Lab 07)과 `pr` 초안을 비교하고, AI가 쓴 부분과 프로그램이 넣은 부분을 구별한 뒤, 초안을 실제 diff와 비교합니다.

**시작 조건** 상태 B. Lab 07의 환경변수가 설정된 **같은 터미널 창**. Lab 07 이후 파일을 고치지 않았을 것(같은 Git 문맥).

**실행 전 질문**
- 같은 변경으로 두 명령을 실행하면 AI에게 가는 `user` 메시지는 같을까요? 무엇이 다를까요?
- 초안 중 AI가 쓰지 않은 부분이 있을까요?

**명령 (API 1회)**

```bash
python3 main.py pr
```

Lab 07 ③의 `commit` 초안을 옆에 두고 비교합니다. (Lab 07을 건너뛰었다면 `python3 main.py commit`도 한 번 실행합니다. API +1회.)

**관찰 목록**
- [ ] 두 초안의 형식은 어떻게 다른가요? 두 초안에 똑같이 있는 줄은?
- [ ] PR 초안의 `## How to Test` 아래 문장은 테스트를 실행했다는 뜻인가요?
- [ ] 초안의 내용을 Lab 03의 `git diff`와 비교해 보세요. 사실과 맞는 부분, diff에 없는 내용은?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과 · 도식 05</b></summary>

`실제 · 2026-11-25 Owner`

```text
=== 검토용 초안: COMMIT ===
README에 실습 메모 문장 추가

README.md 마지막에 "실습 메모: AI가 작성한 초안은 사람이 검토한다." 문장을 새 줄로 추가함.
=== 끝: 내용을 확인한 뒤 사용하세요 ===
AI API 요청 횟수: 1
```

```text
=== 검토용 초안: PR ===
Title: README에 'AI 초안은 사람이 검토' 실습 메모 추가

## Why
- AI가 작성한 초안에 대해 사용자에게 명시적으로 사람이 검토한다는 점을 알리기 위해 변경했습니다.

## What
- README.md 파일 끝에 빈 줄 한 줄과 "실습 메모: AI가 작성한 초안은 사람이 검토한다." 문구를 추가했습니다.

## How to Test
- 실행 권장: python -m unittest discover -s tests
=== 끝: 내용을 확인한 뒤 사용하세요 ===
AI API 요청 횟수: 1
```

AI 결과는 실행할 때마다 달라질 수 있습니다. 내 초안의 문장이 달라도 정상입니다. 형식과 사실 여부를 비교하세요.

**핵심 결과 1 · 같은 재료, 다른 규칙**

| | `commit` | `pr` |
| --- | --- | --- |
| `user` | Lab 05의 Git 문맥 (535자) | 같은 Git 문맥 |
| `system` | 커밋 작성 규칙: 한 줄 제목(72자 이하) + 선택 본문 | PR 작성 규칙: `Title:`(80자 이하) + `## Why` · `## What` · `## How to Test`, 섹션마다 불릿 |
| 프로그램의 처리 | 형식 검사 → 안내문 붙여 출력 | 형식 검사 → 빈 줄로 재조립 → **How to Test를 권장 명령으로 교체** → 안내문 붙여 출력 |

두 실행의 원본 요청은 캡처하지 않았으므로 `user`가 글자 단위로 같았는지는 확인하지 않았습니다(구현 기준 판단).

**핵심 결과 2 · 응답에서 답 꺼내기** — API는 답을 JSON으로 돌려주고, Python은 이 경로로 답 글만 꺼냅니다.

```python
data["choices"][0]["message"]["content"]
```

`실제 · 2026-11-25 Owner` **최소 연결 테스트**(“안녕하세요” 요청, Lab 07 B-1)의 응답 발췌로 경로를 확인해 보세요. *이 응답은 COMMIT·PR 초안을 만든 요청의 응답이 아닙니다. 초안 요청의 원본 응답은 확보하지 않았습니다.*

```json
{
  "object": "chat.completion",
  "model": "gpt-5-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "안녕하세요! 저는 AI 어시스턴트입니다. 무엇을 도와드릴까요? (한국어로 계속할까요?)"
      },
      "finish_reason": "stop"
    }
  ]
}
```

`choices`(목록) → `[0]`(첫 번째 답) → `message` → `content`(답 글). B3-2가 초안 요청에서 받은 `content`도 같은 자리에 있었고, 프로그램은 그 글을 검사한 뒤 위 초안처럼 출력했습니다(구현).

**핵심 결과 3 · 사람의 확인** — 초안을 실제 diff(Lab 03)와 비교합니다.

| 초안 내용 | diff와 비교 | 판단 |
| --- | --- | --- |
| 파일: `README.md` | diff의 파일과 같음 | 사실 |
| 위치: “마지막에”, “파일 끝에” | `@@ -76,3 +76,5 @@`, 메모 뒤에 줄 없음 | 사실 |
| “빈 줄 한 줄과 … 문구를 추가” | `+`(빈 줄)과 `+실습 메모…` 두 줄 | 사실 |
| Why: “사용자에게 명시적으로 사람이 검토한다는 점을 알리기 위해” | **diff에는 변경 이유가 없음** | AI가 **추측한** 이유. 실제 의도(이번에는 실습)를 사람이 확인·수정 |
| How to Test 권장 명령 | 프로그램이 넣은 문구. 실행하지 않음 | 실행하기 전까지 테스트 아님 |

**초안 생성 ≠ 실제 커밋·PR.** `git log`에 새 커밋이 없고 GitHub에 PR도 없습니다. 커밋·push·PR 등록은 사람이 직접 하는 일이며, 이 실습에서는 하지 않습니다.

**도식 05 · 같은 재료에서 다른 결과**

```text
                       ┌─ user: 같은 Git 문맥 (Lab 05 · 535자) ─┐
 commit ─ system: 커밋 작성 규칙 ─┤                                        ├─▶ ┆AI┆ ─▶ content ─▶ [형식 검사] ─▶ [안내문] ─▶ COMMIT 초안
 pr     ─ system: PR 작성 규칙   ─┤                                        ├─▶ ┆AI┆ ─▶ content ─▶ [형식 검사·재조립·How to Test 교체] ─▶ PR 초안
                       └────────────────────────────────────────┘
 초안 색 구분: AI가 쓴 글 = 초록 · 프로그램이 넣은 고정 문구(=== 줄, How to Test 권장 명령) = 주황 · 요청 횟수 → stderr
```

</details>

**돌아가기** → **S4-1 F8**: 위쪽 **공통 띠 “프로그램 동작 · 같은 Git 문맥이면 user는 같다”** 와 카드 머리의 **“system · 커밋 작성 규칙 / system · PR 작성 규칙”**, PR 카드의 **주황색 How to Test 줄**. 사례 통일 개정 후 그림의 두 출력은 내 Owner 기록과 같은 11-25 초안입니다. → **S1-1 F2**: 오른쪽 아래 **실제 초안 제목**을 내 COMMIT 제목과 비교. → **S4-2 F1 return**: **② “사람 · 내용과 이유를 확인 · 실제 diff와 비교”** 가 방금 채운 표입니다.
- 확인 질문: 같은 변경 정보에서 왜 다른 초안이 나오나요? 초안 중 사람이 꼭 확인해야 하는 부분은? → <details><summary>예시 답</summary><code>user</code>(Git 문맥)는 같지만 <code>system</code>(작성 규칙)이 다르고, 프로그램이 결과를 다르게 검사·조립합니다. AI 결과 자체도 실행마다 달라질 수 있습니다. diff에 없는 변경 이유(Why)는 AI의 추측이므로 사람이 확인해야 하고, How to Test는 권장 명령일 뿐 테스트 기록이 아닙니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. 응답 JSON의 다른 필드 (5분 · API 0회 — 기록 읽기)</summary>

최소 연결 테스트 응답(Lab 07 B-1)에는 `choices` 말고도 `object`, `model`, `finish_reason`, `usage` 같은 필드가 있습니다. `usage`의 값(`prompt_tokens` 8 · `completion_tokens` 101 · `total_tokens` 109)은 서버가 그 요청에 대해 돌려준 값입니다. B3-2 프로그램은 이 필드들을 읽지 않고 `choices[0].message.content`만 꺼냅니다(구현). 필요한 값만 정확한 경로로 꺼내는 것이 Python 쪽의 일입니다.

</details>

### C. 문제 해결

<details>
<summary>결과가 예상과 다르다면</summary>

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| 초안 문장이 위와 다르다 | AI 결과는 매번 달라질 수 있습니다. 형식과 사실 여부를 비교하세요. |
| `커밋 제목이 너무 길거나 의미가 부족합니다.` | AI의 답이 형식 검사를 통과하지 못했습니다. 요청 1회가 쓰였고 초안은 버려졌습니다. **다시 요청하지 않습니다.** 다시 실행할지 강사와 상의하세요. |
| `PR 제목 또는 필수 섹션(Why, What, How to Test)이 없습니다.` | 위와 같습니다. |
| `PR 본문에 확인되지 않은 테스트 수행 주장이 있습니다.` | AI가 “테스트를 통과했다”고 썼고 프로그램이 막았습니다. |
| `변경 사항이 없습니다.` | 상태 A입니다. [A → B](#실습-상태-카드)를 실행하세요(요청 0회). |
| `오류:`로 시작 | Lab 07 C-1 표를 보세요. |

</details>

---

<a id="lab-09"></a>

## Lab 09. stdout과 stderr 확인 및 마무리

> 핵심 5분 · 추가 탐구 3분 · API 핵심 0회(추가 탐구 +1회) · 시작 상태 **B**
>
> **출발 화면** S2-2 · S4-1 “`AI API 요청 횟수: 1 ← stderr`” · S4-2 · **연결 도식** 도식 06 · **관련 용어** `stdin-stdout` `exit-code` `shell` `environment-variable` · 다루지 않음: 파이프·리다이렉션 문법 전반

### A. 핵심 실습

**목적** B3-2 프로그램의 출력이 두 통로로 나뉘어 있다는 것을 파일로 분리해 확인합니다. Lab 04에서 Python이 Git의 통로를 받았듯, 이번에는 셸이 Python 프로그램의 통로를 파일로 연결합니다.

**실행 전 질문**
- `>`로 stdout을 파일에 보내면 화면에는 무엇이 남을까요?
- 결과물과 요청 횟수는 각각 어느 파일에 들어갈까요?

**명령 (API 0회)** — 이 한 번만 API 설정을 빼고 실행하므로 요청을 보내지 않습니다. 출력 파일은 저장소 바로 바깥의 실습 폴더(`..`)에 만듭니다.

```bash
env -u CODYSSEY_API_KEY -u CODYSSEY_API_URL -u CODYSSEY_MODEL python3 main.py commit > ../lab09-stdout.txt 2> ../lab09-stderr.txt
echo "종료 코드: $?"

echo "===== stdout ====="
cat ../lab09-stdout.txt

echo "===== stderr ====="
cat ../lab09-stderr.txt
```

- `>` stdout 통로의 끝을 파일에 · `2>` stderr 통로(번호 2)의 끝을 다른 파일에 연결합니다.
- `env -u 이름`은 그 명령 한 번에만 환경변수를 빼고 실행합니다. 터미널의 설정은 그대로 남습니다.
- `../`는 저장소 바깥이라 출력 파일이 Git 문맥에 섞이지 않습니다. 실습 폴더는 나만 열 수 있는 권한(Lab 01)이라 같은 PC의 다른 일반 사용자 계정은 볼 수 없습니다(`/tmp`에 만든 파일은 다른 계정도 읽을 수 있습니다).

**관찰 목록**
- [ ] 첫 줄을 실행했을 때 화면에 나온 것이 있나요?
- [ ] 종료 코드는? stdout 파일과 stderr 파일에는 각각 무엇이 있나요?
- [ ] 아래 Owner 기록(실제 초안)과 비교하면 stdout 파일의 차이는?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록 · 핵심 결과 · 도식 06</b></summary>

내 실행과 같은 경로 `재현 · Claude`

```text
종료 코드: 1
===== stdout =====
===== stderr =====
오류: 확인된 API 주소와 모델이 필요합니다. --api-url, --model 또는 환경변수를 설정하세요.
AI API 요청 횟수: 0
```

실제 초안으로 분리한 경우 `실제 · 2026-11-25 Owner` — Lab 08과 **별도로 AI를 한 번 더 호출**한 실행입니다(COMMIT 문구는 Lab 08과 글자까지 같게 나왔지만 서로 다른 호출). Owner는 출력 파일을 `/tmp/b32-stdout.txt`, `/tmp/b32-stderr.txt`에 만들었습니다.

```text
===== stdout =====
=== 검토용 초안: COMMIT ===
README에 실습 메모 문장 추가

README.md 마지막에 "실습 메모: AI가 작성한 초안은 사람이 검토한다." 문장을 새 줄로 추가함.
=== 끝: 내용을 확인한 뒤 사용하세요 ===
===== stderr =====
AI API 요청 횟수: 1
```

이 실행의 종료 코드는 기록되지 않았습니다. 초안이 정상 출력되었으므로 소스 기준으로 `0`이 `예상`됩니다.

**핵심 결과**

| 통로 | B3-2가 담는 것 | 이유 |
| --- | --- | --- |
| stdout | 초안(`===` 안내문 포함), `변경 사항이 없습니다.` | 프로그램의 **결과물**. 파일로 저장하거나 다른 프로그램에 넘기기 쉽게 따로 둡니다. |
| stderr | `AI API 요청 횟수: N`, `오류: …` | **진단 정보**. 결과물에 섞이지 않게 따로 둡니다. 오류가 아니어도 stderr를 씁니다. |

내 실행에서는 결과물이 없어 stdout 파일이 비었고 오류와 횟수는 stderr 파일에 들어갔습니다. Owner의 실행에서는 초안이 stdout 파일에, 횟수만 stderr 파일에 들어갔습니다. **통로의 쓰임은 같고, 담긴 내용만 다릅니다.**

| | Lab 04 | Lab 09 |
| --- | --- | --- |
| 실행되는 프로그램 | Git | B3-2 프로그램(Python) |
| 통로 끝을 연결한 쪽 | Python (`capture_output=True`) | 셸 (`>`, `2>`) |
| 도착지 | Python 문자열 | 파일 |
| 종료 상태를 받는 쪽 | Python의 `returncode` | 셸의 `$?` |

**도식 06 · 출력 통로** (Lab 04와 같은 그림 언어)

```text
                         ┌─ stdout (1번 통로) ─ 끝의 연결 ─▶ 터미널 화면 (평소) │ Python 문자열 (Lab 04) │ ../lab09-stdout.txt (>)
 python3 main.py commit ─┤                                                                         결과물: 초안 · "변경 사항이 없습니다."
                         └─ stderr (2번 통로) ─ 끝의 연결 ─▶ 터미널 화면 (평소) │ Python 문자열 (Lab 04) │ ../lab09-stderr.txt (2>)
                            종료 상태 ──▶ $? (셸) · returncode (Python)                       진단: 요청 횟수 · 오류
 평소에는 두 통로의 끝이 모두 같은 터미널이라 한 화면에 섞여 보인다.
```

</details>

**돌아가기** → **S4-1 F8**: 두 카드 맨 아래 **“AI API 요청 횟수: 1 ← stderr”** 줄. 그림에서는 초안 바로 아래 붙어 보이지만, 내 파일에서는 따로 떨어졌습니다. → **S2-2 F5**: 결과 세 칸의 **stdout · stderr** 이름을 Lab 04의 결과와 함께 다시 읽어 보세요. → **S4-2**: 마무리 빈칸 ①–⑦을 내 실습 결과로 채워 보세요.
- 확인 질문: stdout과 stderr는 무엇인가요? B3-2는 왜 요청 횟수를 stderr로 내보낼까요? → <details><summary>예시 답</summary>프로그램이 출력을 내보내는 두 개의 통로입니다. 끝을 어디에 연결하느냐에 따라 화면·문자열·파일로 도착지가 바뀝니다. 요청 횟수는 결과물이 아니라 진단 정보라서, 초안(stdout)에 섞이지 않게 stderr로 내보냅니다.</details>

### B. 추가 탐구 (선택)

<details>
<summary>B-1. 실제 초안으로 분리하기 (3분 · <b>API +1회</b>)</summary>

Lab 07의 환경변수가 있는 창에서, A 명령의 첫 줄 대신 아래를 실행합니다. Owner 기록과 같은 모양의 결과를 내 화면에서 확인합니다.

```bash
python3 main.py commit > ../lab09-stdout.txt 2> ../lab09-stderr.txt
```

(비용을 아끼려면 다음 실습부터 Lab 07 ③을 이 형식으로 실행해도 됩니다. 그러면 Lab 07 초안을 파일에서 읽고, 이 Lab에서 추가 호출이 필요 없습니다.)

</details>

<details>
<summary>B-2. 두 통로가 따로 움직인다는 또 하나의 증거 (2분 · 읽기)</summary>

출력 순서가 바뀌어 보이는 실험은 [Lab 02 B-2](#lab-02)에 있습니다. 상태 A에서 키 없이 해야 요청이 나가지 않으므로 Lab 02에 두었습니다. 이 Lab(상태 B, 키 설정됨)에서 그대로 실행하면 **실제 API 요청이 1회 나갑니다.**

</details>

### C. 문제 해결

<details>
<summary>결과가 예상과 다르다면</summary>

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| 첫 줄 실행 후 화면에 무언가 나왔다 | `2>`를 빠뜨렸을 수 있습니다. 그러면 stderr는 화면으로 나옵니다. |
| `no such file or directory: ../lab09-stdout.txt` | 저장소 폴더 안이 아닌 곳에서 실행했습니다. Lab 01 C의 마지막 줄을 보세요. |
| 종료 코드가 기대와 다르다 | `echo "종료 코드: $?"` 앞에 다른 명령을 실행했을 수 있습니다. |
| B-1에서 stdout 파일이 비고 stderr에 `오류:` | 초안을 만들지 못했습니다. 오류 문구로 Lab 07 C-1 표를 보세요. |

</details>

<a id="실습-정리"></a>

### 실습 정리

**핵심 (반드시)** — 공용 PC입니다.

```zsh
# 1. API 키와 설정 지우기 (키 값은 출력하지 않고 결과만 확인)
unset CODYSSEY_API_KEY CODYSSEY_API_URL CODYSSEY_MODEL
[[ -z "$CODYSSEY_API_KEY" ]] && echo "키 설정: 지워짐" || echo "키 설정: 아직 남아 있음"

# 2. 이 Lab의 출력 파일 지우기 (이름을 정확히 지정)
rm -f ../lab09-stdout.txt ../lab09-stderr.txt
```

3. **터미널 창을 닫습니다.** 환경변수는 그 창에서만 유효하므로 창을 닫으면 남지 않습니다.

- 실습 중 키를 명령줄에 직접 적었다면(`export CODYSSEY_API_KEY='…'` 등) 셸 기록에 키가 남았을 수 있습니다. 직접 지우려 하지 말고 강사에게 알리세요.
- 실습 폴더(`~/b32-practice.XXXXXX`)는 **지우지 않아도 됩니다.** 공개 저장소 사본과 실습 메모 한 줄만 있고 키는 들어 있지 않으며, 나만 열 수 있는 폴더입니다.

<details>
<summary><b>선택 · 실습 폴더 정리</b> (강사가 안내한 경우에만)</summary>

지우는 대신 **휴지통으로 옮깁니다**(되돌릴 수 있음). 아래 명령은 `$LAB_DIR`이 Lab 01에서 만든 실습 폴더 형식이고 그 안에 연습 저장소가 있을 때만 동작하며, 아니면 아무것도 하지 않습니다.

```zsh
if [[ "$LAB_DIR" == "$HOME"/b32-practice.?????? && -d "$LAB_DIR/Codyssey_B3-2/.git" ]]; then cd ~ && trash "$LAB_DIR" && echo "휴지통으로 옮김: $LAB_DIR"; else echo "정리하지 않음: 실습 폴더를 확인할 수 없습니다"; fi
```

- `정리하지 않음`이 나오면(새 터미널 창 등) 명령으로 경로를 맞추지 말고, **Finder**에서 홈 폴더의 `b32-practice.` 로 시작하는 폴더를 직접 휴지통으로 옮기세요.
- `trash: command not found`가 나오면 이 macOS에 `trash` 명령이 없습니다. Finder로 옮기세요.
- `재현 · Claude` 조건이 실습 폴더만 통과시키는 것을 확인했습니다. 실제 이동은 실행하지 않았습니다([근거 §6](assets/evidence/lab-v0.3-r1-repro-2026-11-25.txt)).

</details>

---

## 결과로 찾아보기

내 터미널에 나온 한 줄에서 출발해 관련 Lab과 화면을 찾습니다(미션을 이미 해 본 학습자용).

| 내 화면에서 본 것 | 무슨 뜻인가 | Lab | 화면 | 용어 |
| --- | --- | --- | --- | --- |
| `변경 사항이 없습니다.` | 변경이 없어 AI를 부르지 않고 정상 종료 | 02 A | S2-2 | `git-status` · `exit-code` |
| ` M README.md` / `M  README.md` / `MM README.md` | 변경이 작업 폴더에 / 스테이징 영역에 / 양쪽에 | 03 A · B | S1-2 · S3-1 | `git-status` · `staging-area-git-add` |
| `git diff`는 비었는데 `git diff --cached`에 변경 | 이미 `git add`한 상태 | 03 A | S1-2 | `git-diff` |
| `fatal: not a git repository` · `깃 저장소가 아닙니다` | 저장소 밖에서 Git 실행(종료 코드 128) | 04 A | S2-2 | `exit-code` · `python-subprocess` |
| `Staged diff:` · `Unstaged diff:` | Git 문맥의 두 diff 칸 | 05 A | S3-1 | `git-diff` |
| `[REDACTED EMAIL]` · `[REDACTED TOKEN]` | 보내기 전 검사가 값을 가림 | 05 B | S3-1 | `data-masking` |
| `비밀 파일로 보이는 경로…전송을 중단` | 보내기 전 검사가 전송을 멈춤(요청 0회) | 05 C | S3-1 | `secret-management` · `safe-mode` |
| `\n`이 가득한 JSON 글 | Python 데이터를 JSON 글로 바꾼 모습 | 06 A | S3-2 | `json` · `serialization` |
| `확인된 API 주소와 모델이 필요합니다` | 보내기 전 설정 부족(요청 0회) | 07 C · 09 A | S3-2 | `environment-variable` |
| `인증 또는 권한 오류 (HTTP 401)` | 외부 API가 키·권한 문제로 거절(요청 1회) | 07 C | S3-2 | `authentication-error` · `api-key` |
| `AI API 응답 오류 (HTTP 400).` | 외부 API가 요청을 거절(요청 1회) — Owner 실제 사례 | 07 A · C | S3-2 | `http-status-code` |
| `Content-Type: text/html` · `HTTP Status 400 – Bad Request` | 최소 요청에서도 400 HTML이 옴 → 공통 설정 확인 | 07 C | S3-2 | `troubleshooting` · `curl` |
| `HTTP/2 200` · `"object": "chat.completion"` | 최소 연결 테스트 성공 | 07 B | S3-2 | `http-200-ok` · `json-request-response` |
| `choices[0].message.content` | 응답 JSON에서 답 글을 꺼내는 경로 | 08 A | S3-2 | `json-request-response` |
| `Title:` · `## Why` · `## What` | PR 작성 규칙(`system`)에 따른 형식 | 08 A | S4-1 | `pull-request` · `prompt-design` |
| `- 실행 권장: python -m unittest …` | 프로그램이 넣은 권장 명령. 테스트 수행 아님 | 08 A | S4-1 · S4-2 | `output-validation` · `post-processing` |
| `커밋 제목이 너무 길거나…` · `필수 섹션…이 없습니다` | AI 답이 형식 검사를 통과 못 함(재요청 없음) | 08 C | S4-2 | `output-validation` |
| `AI API 요청 횟수: 1` | stderr로 나온 진단 정보. 실패해도 1 | 07 A · 09 A | S2-2 · S4-1 | `stdin-stdout` |
| `=== 검토용 초안 … ===` | 프로그램이 붙인 안내문(stdout) | 08 A · 09 A | S4-2 | `human-in-the-loop` |

용어 열의 ID는 기술용어사전 항목입니다(예: `/terms/git-diff`).

[b32]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/tree/be21c4994a93bc943a6783ea380c50f61aa7c45b
