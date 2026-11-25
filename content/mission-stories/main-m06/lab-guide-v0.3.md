# B3-2 따라 하기 실습(Lab) v0.3 — Git 변경이 AI 초안이 되기까지

**핵심 질문** 외부 AI 서비스의 기능을 내 Python 프로그램에서 사용하려면 어떤 정보를 어떻게 주고받아야 할까?

> 학습자용 실습 원고 · 본과정 M06 / B3-2 · **v0.3** · 2026-11-25 · Owner 검토 전 초안
>
> 실습 대상: [Codyssey_B3-2][b32] (`be21c49`) · 기준 환경: macOS 교육장 공용 PC, zsh, Python 3.9.6, 관리자(sudo) 권한 없음
>
> 설계 원칙은 [순환형 학습 설계](learning-cycle-design-v0.3.md), 스토리 화면과의 연결은 [스토리–실습 연결](lab-story-mapping-v0.3.md)에 있습니다.

## 이 실습을 쓰는 법

- **어디서든 시작할 수 있습니다.** 미션 스토리를 보다가 궁금한 화면에서 들어와도 되고, Lab 01부터 차례로 해도 됩니다. 각 Lab의 **시작 조건**만 맞추면 됩니다. 조건은 [실습 상태 카드](#실습-상태-카드)의 명령 한 줄로 맞출 수 있습니다.
- **해설보다 내 결과를 먼저 봅니다.** 각 Lab은 *실행 전 질문 → 명령 → 관찰 목록* 순서입니다. 실행 기록과 해설은 접혀 있습니다. 내 화면을 먼저 살펴본 뒤 펼치세요.
- **결과가 다르게 나와도 괜찮습니다.** 각 Lab의 “결과가 다르다면”에서 이유를 찾아보세요.
- **이해가 안 되면 돌아갑니다.** 각 Lab 끝의 “이 결과를 설명하는 화면”으로 가서 그림과 P 해설을 **내 결과를 떠올리며** 다시 읽으세요. 그다음 다시 실습으로 돌아오면 됩니다.

### 근거 표시

실행 결과 상자마다 아래 표시 중 하나가 붙어 있습니다.

| 표시 | 뜻 |
| --- | --- |
| **실제 · 2026-11-25 Owner** | 교육 설계자(Owner)가 macOS 교육장 PC에서 실제로 실행한 결과 |
| **재현 · Claude** | 실습 설계를 검증하려고 같은 사례를 다시 실행한 결과. AI API는 호출하지 않았습니다. |
| **예상** | 실행 기록이 없어 프로그램 소스 코드로 예상한 결과 |
| **교육용 예시** | 구조를 보여 주려고 단순하게 만든 예. 실제 출력이 아닙니다. |

숫자(예: 글자 수 535자)는 그 실행에서 관찰한 값입니다. 모든 실행에서 똑같아야 하는 정답이 아닙니다.

## 실습 안전 수칙

실습을 시작하기 전에 꼭 읽으세요.

1. **연습용 저장소에서만 합니다.** Lab 01에서 임시 폴더에 새로 받은 저장소만 고칩니다. 내 미션 제출 저장소나 다른 프로젝트에서 하지 마세요.
2. **커밋, push, PR 생성은 하지 않습니다.** B3-2 프로그램은 초안만 출력합니다. 실습에서도 `git commit`, `git push`, PR 등록은 하지 않습니다.
3. **API 키를 어디에도 남기지 않습니다.** 문서, 파일, Git 저장소, 명령 인수, 스크린샷, 채팅, 로그에 키를 넣지 마세요. 이 실습은 키를 화면에 보이지 않게 입력하는 방법(Lab 07)을 씁니다. 키 길이나 특수문자 유무는 확인해도 되지만 키 값 자체는 출력하지 않습니다.
4. **API 호출에는 사용량과 비용이 생길 수 있습니다.** Lab 01–06은 API를 부르지 않습니다. API를 부르는 곳은 Lab 07·08이며, 계획대로 하면 **최소 2회**(`commit` 1회, `pr` 1회)입니다. 같은 오류가 나는 요청을 반복하지 마세요.
5. **공용 PC에서는 끝나면 정리합니다.** [Lab 09의 정리](#실습-정리)에 따라 키 환경변수를 지우고 임시 파일을 삭제한 뒤 터미널을 닫습니다.
6. **`git restore README.md`(`--staged` 없이)는 수정 내용을 지웁니다.** 연습 저장소에서 처음 상태로 돌아갈 때만 씁니다.

## 데이터의 여행

이 실습의 모든 Lab은 **같은 한 줄**을 따라갑니다.

> `실습 메모: AI가 작성한 초안은 사람이 검토한다.`

이 문장이 단계마다 모습을 바꾸며 이동합니다. Lab을 하나 끝낼 때마다 이 표로 돌아와 “지금 이 문장은 어디에 어떤 모습으로 있지?”를 확인해 보세요.

| 단계 | 이 문장의 모습 | 어디에 있나 | 누가 만들었나 | Lab |
| --- | --- | --- | --- | --- |
| ① 파일 변경 | `실습 메모: AI가 작성한 초안은 사람이 검토한다.` | 작업 폴더의 `README.md` 마지막 줄 | 나(학습자) | 03 |
| ② Git이 보여 준 차이 | `+실습 메모: AI가 작성한 초안은 사람이 검토한다.` | `git diff`(또는 `--cached`)의 출력 | Git | 03 |
| ③ Python이 받은 글 | `result.stdout` 문자열 안의 한 줄 | Python 변수 | Python이 실행한 Git | 04 |
| ④ Git 문맥 | `Unstaged diff:` 칸 안의 `+실습 메모: …` | 보낼 글 하나(535자) | B3-2 프로그램 | 05 |
| ⑤ 요청 JSON | `…\n+\n+실습 메모: AI가 작성한 초안은 사람이 검토한다.\n"` | `messages`의 `user` 메시지 | B3-2 프로그램 | 06 |
| ⑥ AI의 답 | `README.md 마지막에 "실습 메모: …" 문장을 새 줄로 추가함.` | 응답 JSON의 `content` | 외부 AI | 07 · 08 |
| ⑦ 초안 출력 | `=== 검토용 초안: COMMIT ===` 아래의 글 | 터미널(stdout) | B3-2 프로그램이 검사 후 출력 | 08 · 09 |
| ⑧ 사람의 판단 | 쓸지, 고칠지, 버릴지 | 사람의 머리와 손 | 나 | 08 · 09 |

```text
 [작업 폴더]        [Git]           [Python]            [외부 AI API]         [결과]
 README.md ──git diff──▶ diff 글 ──stdout──▶ Git 문맥 ──user 메시지──▶ ┆ AI ┆ ──content──▶ 초안 ──▶ 사람
  ① Lab 03       ② Lab 03    ③ Lab 04   ④ Lab 05    ⑤ Lab 06        ⑥ Lab 07·08   ⑦ Lab 08·09  ⑧
```

## 실습 상태 카드

Lab마다 필요한 저장소 상태가 다릅니다. 아래 세 상태 중 하나를 시작 조건으로 적어 두었습니다. 모두 Lab 01에서 받은 **연습 저장소 폴더 안**에서 실행합니다.

| 상태 | 뜻 | `git status --short` | 이 상태로 만드는 명령 |
| --- | --- | --- | --- |
| **A. 깨끗함** | 아무것도 고치지 않음 | (출력 없음) | `git restore --staged README.md; git restore README.md` |
| **B. 메모 추가 · add 전** | README.md 끝에 메모를 추가했고 `git add`는 하지 않음 | ` M README.md` | 상태 A에서 `printf '\n실습 메모: AI가 작성한 초안은 사람이 검토한다.\n' >> README.md` |
| **C. 메모 추가 · add 후** | 메모를 추가하고 `git add`까지 함 | `M  README.md` | 상태 B에서 `git add README.md` |

- C → B로 돌아가기: `git restore --staged README.md` (수정 내용은 남고 스테이징만 풀립니다)
- `printf` 명령을 두 번 실행하면 메모가 두 줄 들어갑니다. 그럴 때는 상태 A로 돌아간 뒤 다시 만드세요.

| Lab | 시작 상태 | API 키 | API 호출 |
| --- | --- | --- | --- |
| 01 실습 환경 준비 | (저장소 받기 전) | 필요 없음 | 0 |
| 02 변경 없는 상태 | A | 필요 없음 | 0 |
| 03 Git 변경과 스테이징 | A → B → C → B | 필요 없음 | 0 |
| 04 Python이 Git 실행 | 아무 상태(B 권장) | 필요 없음 | 0 |
| 05 Git 문맥 만들기 | B (C도 가능) | 필요 없음 | 0 |
| 06 요청 본문 미리 보기 | B | 필요 없음 | 0 |
| 07 API 호출과 오류 해결 | B | **필요** | 1 (문제 해결 시 추가 가능) |
| 08 AI 응답과 두 초안 | B | **필요** | 1–2 |
| 09 stdout·stderr와 마무리 | B | 경로에 따라 | 0–1 |

---

<a id="lab-01"></a>

## Lab 01. 실습 환경 준비

> API 호출 0회 · 키 필요 없음 · 약 10분

**1. 실습 목적** 연습용 저장소를 내 컴퓨터에 받고, B3-2 프로그램이 이 컴퓨터에서 실행되는지 확인합니다. 프로그램이 어떤 명령(`commit`, `pr`)을 받는지 도움말로 봅니다.

**2. 연결되는 스토리와 개념**
- 스토리: 인트로(F1 전체 그림) · S2-1(명령을 읽는 `argparse`)
- 용어: `python` · `clone` · `repository` · `terminal` · `cli` · `python-cli`
- 이 Lab에서 다루지 않는 것: Python 설치, 가상환경, Git 설정

**3. 시작 조건** 터미널을 열 수 있으면 됩니다. 관리자 권한(sudo)은 필요 없습니다. B3-2는 Python 기본 기능만 쓰므로 추가 설치가 없습니다.

**4. 실행 전 질문**
- 교육장 PC의 Python 버전은 몇일까요? B3-2 README는 몇 버전 이상을 요구할까요?
- `python3 main.py --help`를 실행하면 프로그램이 무엇을 보여 줄까요?

**5. 명령**

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
```

`mktemp -d`는 이름이 겹치지 않는 새 폴더를 만듭니다(예: `b32-practice.a1B2c3`). 출력된 **실습 폴더 경로를 메모해 두세요.** 마지막 정리 때 씁니다.

**6. 관찰 목록**
- [ ] `python3 --version`이 출력한 버전
- [ ] 도움말의 `{commit,pr}` 부분
- [ ] 도움말 중간 제목이 `optional arguments:`인지 `options:`인지
- [ ] `--api-url`, `--model` 같은 옵션 이름

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록과 해설</b></summary>

**7. 실행 기록**

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
  --api-url API_URL     확인된 Chat Completions HTTPS URL
  --model MODEL         공급자가 지원하는 모델 ID
  ...
```

**8. 결과 해설**

- **`{commit,pr}`** 프로그램이 받는 초안 종류는 두 가지입니다. `commit`은 커밋 메시지 초안, `pr`은 PR 설명 초안입니다. 이름이 같아도 `git commit`을 실행하는 것이 아닙니다. 이 도움말은 `main.py`의 `argparse`가 자동으로 만든 것으로, S2-1의 “사람 → 프로그램: 입력 읽기”가 바로 이것입니다.
- **Python 버전** B3-2 README는 “Python 3.10 이상”을 요구합니다. 교육장 PC는 3.9.6입니다. 두 가지를 구별하세요.
  - *공식 지원*: README가 약속한 범위. 3.9.6은 **범위 밖**입니다.
  - *실제 실행 성공*: 이 실습 범위(도움말, 변경 수집, `commit`·`pr` 실제 실행)는 3.9.6에서 동작했습니다(Owner 실제). B3-2 자체 테스트 14개도 3.9.6에서 통과했습니다(재현 · Claude).
  - 그러나 이것이 다른 기능이나 다른 환경에서의 동작을 보장하지는 않습니다. 실습 중 Python 문법 오류(`SyntaxError`, `TypeError: unsupported operand`)가 나면 버전 차이를 먼저 의심하고 강사에게 알리세요.
- **`optional arguments:` 대 `options:`** 같은 프로그램이라도 Python 3.10부터 도움말 제목이 `options:`로 바뀌었습니다. 버전에 따라 출력이 조금 다를 수 있다는 작은 증거입니다.

**9. 도식**

```text
 [내 컴퓨터 · 임시 폴더]
   b32-practice.XXXXXX/
     └─ Codyssey_B3-2/   ← 연습 저장소 (GitHub에서 복사해 온 내 컴퓨터의 Git 저장소)
          ├─ main.py      ← python3 main.py commit|pr 으로 실행
          ├─ ai_gitgen/   ← Git 수집 · 검사 · AI 요청 · 형식 검사 코드
          └─ README.md    ← Lab 03에서 한 줄을 추가할 파일
```

**결과가 다르다면**

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `xcode-select: note: no developer tools were found` 또는 Git 설치 창 | 이 PC에 Git 도구가 없습니다. 관리자 권한이 필요하므로 강사에게 알리세요. |
| `fatal: unable to access` | 인터넷 연결이나 주소를 확인하세요. |
| `python3: command not found` | 강사에게 알리세요. |
| 도움말 대신 `SyntaxError` | Python 버전이 너무 낮을 수 있습니다. `python3 --version`을 확인하세요. |

</details>

**10. 이해 확인**
- `python3 main.py commit`의 `commit`은 무엇을 뜻하나요? → *커밋 메시지 초안을 만들라는 초안 종류입니다. 실제 커밋을 만들지 않습니다.*
- “3.9.6에서 실행되었다”와 “3.9.6을 공식 지원한다”는 어떻게 다른가요? → *앞은 관찰한 사실이고, 뒤는 프로그램이 약속한 범위입니다. B3-2는 3.10 이상을 약속합니다.*

**11. 연결** 다음: [Lab 02](#lab-02) · 이 결과를 설명하는 화면: 인트로(F1), S2-1 · 더 읽기: [B3-2 학습가이드 00][g00]

---

<a id="lab-02"></a>

## Lab 02. 변경 사항 없는 상태 확인

> API 호출 0회 · 키 필요 없음 · 약 5분 · 시작 상태 **A. 깨끗함**

**1. 실습 목적** 고친 것이 없을 때 B3-2 프로그램이 무엇을 하고, 무엇을 **하지 않는지** 확인합니다. 프로그램이 끝날 때 남기는 종료 코드도 처음 봅니다.

**2. 연결되는 스토리와 개념**
- 스토리: S2-2(Git 결과를 보고 판단하기) — F5의 “② 변경이 있나? → 없음 → 변경 사항이 없습니다 · AI 요청 0회”
- 용어: `exit-code` · `stdin-stdout` · `git-status`
- 이 Lab에서 다루지 않는 것: stdout·stderr의 자세한 구조(Lab 04·09)

**3. 시작 조건** Lab 01에서 받은 저장소 폴더 안. 아무 파일도 고치지 않은 상태 A.

**4. 실행 전 질문**
- 바뀐 것이 없는데 `commit` 초안을 만들어 달라고 하면 프로그램은 AI에 요청을 보낼까요?
- API 키를 설정하지 않았는데 이 명령이 오류 없이 끝날 수 있을까요?

**5. 명령**

```bash
python3 main.py commit
echo $?
```

`echo $?`는 **바로 앞 명령의 종료 코드**를 보여 줍니다. 두 명령 사이에 다른 명령을 넣으면 그 명령의 종료 코드가 나오므로 이어서 실행하세요.

**6. 관찰 목록**
- [ ] 출력된 줄은 몇 줄인가요?
- [ ] `AI API 요청 횟수`는 몇인가요?
- [ ] `echo $?`가 보여 준 숫자는 무엇인가요?
- [ ] 키를 설정하지 않았는데 오류가 났나요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록과 해설</b></summary>

**7. 실행 기록** `실제 · 2026-11-25 Owner`

```text
변경 사항이 없습니다.
AI API 요청 횟수: 0
0
```

**8. 결과 해설**

- **AI를 부르지 않았습니다.** 프로그램은 먼저 Git으로 변경을 확인하고, 변경이 없으면 그 자리에서 끝냅니다. AI에게 설명할 재료가 없으니 요청할 이유가 없습니다. 그래서 요청 횟수가 0이고, 키 확인 단계까지 가지도 않아서 키가 없어도 오류가 나지 않습니다.
- **종료 코드 0은 정상 종료입니다.** 프로그램은 끝날 때 운영체제에 숫자 하나를 남깁니다. 0은 “정상적으로 끝났다”, 0이 아닌 수는 “문제가 있었다”는 약속입니다. “변경 없음”은 실패가 아니라 정상적인 결과이므로 0입니다.
- **두 줄은 서로 다른 통로로 나왔습니다.** 화면에는 붙어 보이지만 `변경 사항이 없습니다.`는 표준 출력(stdout), `AI API 요청 횟수: 0`은 표준 오류(stderr)로 나왔습니다. stderr라는 이름에 “오류”가 들어 있지만, 여기서는 오류가 아니라 **진단 정보**(요청을 몇 번 했는지)를 알리는 데 쓰였습니다. 확인해 보고 싶다면 아래 선택 실험을 해 보세요. 자세한 내용은 Lab 04·09에서 다룹니다.

**선택 실험 · 통로 하나씩 숨기기** `재현 · Claude`

```bash
python3 main.py commit 2>/dev/null   # stderr를 버림 → "변경 사항이 없습니다." 만 보임
python3 main.py commit >/dev/null    # stdout을 버림 → "AI API 요청 횟수: 0" 만 보임
```

**9. 도식**

```text
python3 main.py commit
   │
   ▼
[Python] Git에게 변경을 묻는다 ── (Git 실행 성공) ──▶ 변경이 있나?
                                                     │
                              없음 ◀─────────────────┘
                               │
                 stdout ─▶ "변경 사항이 없습니다."
                 stderr ─▶ "AI API 요청 횟수: 0"      ┆ 외부 AI API ┆ ← 아무것도 가지 않음
                 종료 코드 0
```

**결과가 다르다면**

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `오류: 확인된 API 주소와 모델이 필요합니다. …` · 종료 코드 1 | 이미 파일을 고친 상태입니다(변경이 있으니 다음 단계로 갔다가 설정이 없어 멈춤). 상태 A로 돌아가세요. `재현 · Claude` |
| `오류: … 깃 저장소가 아닙니다` 또는 `not a git repository` · 종료 코드 1 | 저장소 폴더 밖에서 실행했습니다. `cd`로 `Codyssey_B3-2` 안에 들어가세요. |
| 마지막 숫자가 0이 아닌데 위 오류가 없다 | `echo $?` 앞에 다른 명령을 실행했을 수 있습니다. 두 줄을 이어서 다시 실행하세요. |
| 두 줄의 순서가 반대로 나온다 | 출력을 파이프나 다른 프로그램으로 받으면 순서가 바뀔 수 있습니다. 두 통로가 따로 움직인다는 증거입니다(Lab 09). |

</details>

**10. 이해 확인**
- 변경이 없을 때 API 요청 횟수가 0인 이유는? → *프로그램이 변경 유무를 먼저 확인하고, 설명할 변경이 없으면 AI를 부르기 전에 끝내기 때문입니다.*
- 종료 코드 0은 무엇을 뜻하나요? “변경 없음”인데 왜 0인가요? → *정상 종료입니다. 변경이 없는 것은 오류가 아니라 정상적인 결과이기 때문입니다.*

**11. 연결** 이전: [Lab 01](#lab-01) · 다음: [Lab 03](#lab-03) · 이 결과를 설명하는 화면: **S2-2**(F5의 ② 분기) · 더 읽기: [B3-2 학습가이드 07][g07]

---

<a id="lab-03"></a>

## Lab 03. Git 변경 정보와 스테이징

> API 호출 0회 · 키 필요 없음 · 약 20분 · 시작 상태 **A** → 끝 상태 **B**

**1. 실습 목적** 파일 한 줄을 바꾸고 Git이 그 변경을 어떻게 보여 주는지 관찰합니다. `git add` 전과 후에 세 명령의 출력이 어떻게 바뀌는지 비교해서, B3-2 프로그램이 왜 두 종류의 diff를 모두 모으는지 스스로 답합니다.

**2. 연결되는 스토리와 개념**
- 스토리: S1-2(F3 `git status`와 `git diff`) · S3-1(F6 “`git add` 전후 변경을 함께 읽음”)
- 용어: `git-status` · `git-diff` · `staging-area-git-add` · `line-diff` · `commit` · `head`
- 이 Lab에서 다루지 않는 것: 커밋 만들기, 브랜치, 되돌리기 전반

**3. 시작 조건** 상태 A(깨끗함). `git status --short`가 아무것도 출력하지 않아야 합니다.

**4. 실행 전 질문**
- README.md에 한 줄을 추가한 뒤 `git diff`와 `git diff --cached`는 각각 무엇을 보여 줄까요?
- `git add README.md`를 하면 무엇이 바뀔까요? 파일 내용이 바뀔까요?

**5. 명령**

**① 메모 한 줄 추가**

```bash
printf '\n실습 메모: AI가 작성한 초안은 사람이 검토한다.\n' >> README.md
```

`>>`는 파일 **끝에 덧붙이기**입니다. `\n`이 두 번 있어서 빈 줄 하나와 메모 한 줄이 추가됩니다.

**② add 이전 관찰** — 구분선을 반드시 함께 실행하세요.

```bash
echo "===== git status ====="
git status --short

echo "===== git diff ====="
git diff

echo "===== git diff --cached ====="
git diff --cached
```

**③ 스테이징**

```bash
git add README.md
```

**④ add 이후 관찰** — ②의 명령 여섯 줄을 **그대로 다시** 실행합니다.

**⑤ 정리** — 스테이징만 풀고 파일 수정은 남깁니다(상태 B).

```bash
git restore --staged README.md
git status --short
```

**6. 관찰 목록** — 아래 표를 내 결과로 먼저 채워 보세요.

| 항목 | add 이전 | add 이후 |
| --- | --- | --- |
| `git status --short`의 `M` 위치 | | |
| `git diff` | | |
| `git diff --cached` | | |

- [ ] `git diff` 출력에서 `+`로 시작하는 줄은 몇 줄인가요?
- [ ] add 이전의 `git diff` 출력과 add 이후의 `git diff --cached` 출력을 비교하면?
- [ ] ⑤ 뒤에 `git status --short`는 무엇을 보여 주나요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록과 해설</b></summary>

**7. 실행 기록**

`실제 · 2026-11-25 Owner`

| 항목 | add 이전 | add 이후 |
| --- | --- | --- |
| status | 공백 뒤 M (` M`) | M 뒤 공백 (`M `) |
| diff | 변경 내용 출력 | 출력 없음 |
| diff --cached | 출력 없음 | 변경 내용 출력 |

> Owner 메모: 구분선 없이 세 명령을 연속 실행했을 때는 출력되는 글이 같아 보여 차이를 구분하지 못했습니다. 구분선을 넣고 아래 도식으로 정리하자 차이가 이해되었습니다.

`재현 · Claude` add 이전 전체 출력

```text
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
```

(마지막 구분선 아래에 아무것도 없는 것이 “출력 없음”입니다. add 이후에는 같은 diff가 `git diff --cached` 아래로 옮겨 가고, `git diff` 아래가 비어 있습니다.)

**8. 결과 해설**

같은 변경 내용이 add 전에는 `git diff`에, add 후에는 `git diff --cached`에 나옵니다. **내용이 바뀐 것이 아니라, 비교하는 두 칸이 바뀐 것**입니다. Git은 파일을 세 군데에 나눠 기억합니다.

- **마지막 커밋(HEAD)** — 마지막으로 기록한 상태. 이 실습에서는 바뀌지 않습니다.
- **스테이징 영역** — “다음 커밋에 넣을 것”으로 골라 둔 상태. `git add`가 여기에 복사합니다.
- **작업 폴더** — 지금 편집기로 보고 있는 실제 파일.

`git diff`는 **스테이징 영역과 작업 폴더**를, `git diff --cached`는 **마지막 커밋과 스테이징 영역**을 비교합니다. `git status --short`의 두 글자도 같은 두 비교입니다. 왼쪽 글자는 마지막 커밋↔스테이징 영역, 오른쪽 글자는 스테이징 영역↔작업 폴더의 차이입니다.

**diff 읽기** — `+`는 새로 생긴 줄, 공백으로 시작하는 줄은 위치를 알려 주려고 함께 보여 주는 **주변 줄**(바뀌지 않음), `@@ -76,3 +76,5 @@`는 “원래 파일 76번째 줄부터 3줄이, 새 파일에서는 76번째 줄부터 5줄이 되었다”는 위치 표시입니다. `@@` 뒤의 글은 위치를 알아보기 쉽도록 Git이 붙여 준 근처 줄입니다. `index 7322076..076b2f1`은 파일 내용의 짧은 식별값으로, 외울 필요는 없습니다.

**핵심 질문 · 변경 내용 자체가 같다면 왜 B3-2 프로그램은 두 diff를 모두 실행할까?**

내 답을 먼저 한두 문장으로 적어 본 뒤 읽으세요.

> 프로그램은 학습자가 `git add`를 했는지, 일부만 했는지 알 수 없습니다. 변경은 스테이징 영역에 있을 수도, 작업 폴더에만 있을 수도, **양쪽에 나뉘어** 있을 수도 있습니다. 한 가지 diff만 보면 다른 쪽에 있는 변경을 놓칩니다. 그래서 둘 다 모아 `Staged diff:`와 `Unstaged diff:` 두 칸에 나눠 담습니다(Lab 05).

**선택 실험 · 양쪽에 나뉜 변경** `재현 · Claude` — 상태 C에서 한 줄을 더 추가합니다.

```bash
git add README.md                       # 상태 C
printf '두 번째 메모\n' >> README.md
echo "===== git status ====="; git status --short
echo "===== git diff (끝 2줄) ====="; git diff | tail -2
echo "===== git diff --cached (끝 2줄) ====="; git diff --cached | tail -2
```

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

`MM`: 두 비교 모두에 차이가 있습니다. 이번에는 두 diff가 **서로 다른 내용**을 보여 줍니다. 한쪽만 보면 반드시 하나를 놓칩니다. 실험 뒤에는 상태 A로 돌아간 다음 상태 B를 다시 만드세요.

```bash
git restore --staged README.md; git restore README.md
printf '\n실습 메모: AI가 작성한 초안은 사람이 검토한다.\n' >> README.md
```

**9. 도식 · add 전후 비교**

| | 마지막 커밋 (HEAD) | ⇄ **`git diff --cached`가 비교** ⇄ | 스테이징 영역 | ⇄ **`git diff`가 비교** ⇄ | 작업 폴더 (README.md) |
| --- | --- | --- | --- | --- | --- |
| **add 이전** | 메모 없음 | 같음 → **출력 없음** | 메모 없음 | 다름 → **메모 줄 출력** | 메모 있음 |
| **add 이후** | 메모 없음 | 다름 → **메모 줄 출력** | 메모 있음 | 같음 → **출력 없음** | 메모 있음 |
| `git status --short` | | 왼쪽 글자: 이전 ` `(공백) → 이후 `M` | | 오른쪽 글자: 이전 `M` → 이후 ` `(공백) | |

```text
add 이전   [HEAD: 메모 없음] ══같음══ [스테이징: 메모 없음] ≠≠다름≠≠ [작업 폴더: 메모 있음]   status " M"
                              └ --cached: 없음 ┘           └ diff: 메모 줄 ┘
                                        │ git add README.md (작업 폴더 → 스테이징 영역으로 복사)
                                        ▼
add 이후   [HEAD: 메모 없음] ≠≠다름≠≠ [스테이징: 메모 있음] ══같음══ [작업 폴더: 메모 있음]   status "M "
                              └ --cached: 메모 줄 ┘        └ diff: 없음 ┘
```

**결과가 다르다면**

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `+` 줄이 4줄 이상 | `printf`를 두 번 실행했습니다. 상태 A로 돌아가 다시 하세요. |
| `git status`에 `?? 어떤파일` 이 보인다 | 저장소 안에 새 파일이 생겼습니다(예: 실습 코드를 파일로 저장). 이 파일 이름은 Lab 05의 Git 문맥에도 들어갑니다. 지우거나 저장소 밖으로 옮기세요. |
| `git restore`가 없는 명령이라고 나온다 | 오래된 Git입니다. `git reset HEAD README.md`가 `git restore --staged README.md`와 같은 일을 합니다. |

</details>

**10. 이해 확인**
- add 이후 `git diff`가 아무것도 출력하지 않는데, 변경이 사라진 것인가요? → *아니요. 스테이징 영역과 작업 폴더가 같아져서 `git diff`로는 차이가 없을 뿐, 변경은 `git diff --cached`에 있습니다.*
- `git status --short`가 `MM`이면 Git 문맥의 두 diff 칸은 어떻게 될까요? → *`Staged diff:`와 `Unstaged diff:` 칸 모두 내용이 들어갑니다.*
- 변경 내용이 같다면 왜 프로그램은 두 diff를 모두 실행하나요? (자기 말로)

**11. 연결** 이전: [Lab 02](#lab-02) · 다음: [Lab 04](#lab-04) · 이 결과를 설명하는 화면: **S1-2**(F3) · **S3-1**(F6 “`git add` 전후 변경을 함께 읽음”) · 더 읽기: [B3-2 학습가이드 01][g01]

---

<a id="lab-04"></a>

## Lab 04. Python이 다른 프로그램을 실행하는 방법

> API 호출 0회 · 키 필요 없음 · 약 20분 · 시작 상태: 아무 상태(B 권장)

**1. 실습 목적** Lab 03에서 사람이 입력한 Git 명령을 이번에는 Python이 실행하게 합니다. 성공과 실패를 나란히 놓고, Python이 결과를 무엇으로 받는지(`returncode`, `stdout`, `stderr`) 확인합니다.

**2. 연결되는 스토리와 개념**
- 스토리: S2-1(F4 `subprocess.run()`) · S2-2(F5 결과 세 가지, 0 · 128)
- 용어: `python-subprocess` · `process` · `exit-code` · `stdin-stdout` · `shell`
- 이 Lab에서 다루지 않는 것: 셸과 셸 없는 실행의 보안 차이(학습가이드 01), 프로세스 관리 전반

**3. 시작 조건** 저장소 폴더 안. 상태는 상관없지만 B이면 stdout에 내용이 보여 관찰하기 쉽습니다.

**4. 실행 전 질문**
- Git이 실패했다는 것을 Python은 무엇을 보고 알 수 있을까요? 출력이 비어 있으면 실패일까요?
- 오류 메시지는 `stdout`과 `stderr` 중 어디에 담길까요?

**5. 명령** — 코드를 파일로 저장하지 않고 바로 실행합니다(저장소에 새 파일이 생기면 Git 문맥이 달라지기 때문입니다). 아래 전체를 복사해 붙여넣으세요.

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

- `["git", "status", "--short"]` 실행할 프로그램과 인수를 목록으로 줍니다.
- `cwd=` 어느 폴더에서 실행할지 정합니다.
- `capture_output=True` 출력을 화면에 내보내지 않고 Python이 받습니다.
- `text=True` 받은 출력을 글(문자열)로 바꿉니다.
- `repr()` 줄바꿈 같은 보이지 않는 글자를 `\n`처럼 보이게 출력합니다.

**6. 관찰 목록**
- [ ] 저장소 안과 밖의 `returncode`는 각각 몇인가요?
- [ ] 저장소 밖에서 `stdout`은 무엇인가요? 오류 메시지는 어느 쪽에 있나요?
- [ ] 저장소 안의 `stdout`은 Lab 03의 어떤 출력과 같나요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록과 해설</b></summary>

**7. 실행 기록** `재현 · Claude` (상태 B, 한국어 로캘) — 이 Lab은 Owner 실행 기록이 없습니다.

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

영어 환경에서는 `stderr`가 `'fatal: not a git repository (or any of the parent directories): .git\n'`로 나옵니다. 메시지 언어는 달라도 `returncode`는 같습니다.

**8. 결과 해설**

종료 코드는 **세 주체**를 거쳐 Python에 도착합니다.

1. **Git이 정합니다.** 저장소가 아닌 곳에서 `git status`를 실행하면 Git은 일을 할 수 없다고 판단하고 128이라는 종료 상태로 끝납니다. 성공하면 0으로 끝납니다.
2. **운영체제가 전달합니다.** Git은 Python이 운영체제에 부탁해 실행한 별도의 프로그램(프로세스)입니다. Git이 끝나면 운영체제가 그 종료 상태를 실행을 부탁한 쪽(Python)에 넘겨줍니다.
3. **Python이 받습니다.** `subprocess.run()`은 그 값을 결과 객체의 `returncode`에 담아 돌려줍니다.

그래서 **성공 여부는 `returncode`로 판단**합니다. 출력이 비어 있는 것만으로는 알 수 없습니다. 저장소 밖에서도 `stdout`은 비어 있지만, 성공한 명령도 보여 줄 내용이 없으면 `stdout`이 비어 있습니다(예: 상태 A에서 저장소 안).

**`stdout`과 `stderr`는 화면이나 파일이 아니라 출력 통로입니다.** 모든 프로그램은 일반 출력을 내보내는 통로(stdout)와 오류·진단을 내보내는 통로(stderr)를 따로 가지고 있습니다. 통로의 끝이 어디에 연결되었느냐에 따라 도착지가 달라집니다.

| 통로 끝의 연결 | 도착지 | 이 실습에서 |
| --- | --- | --- |
| 터미널 | 화면 | Lab 02, Lab 03 |
| `capture_output=True` | Python 문자열(`result.stdout`, `result.stderr`) | 이 Lab |
| `>` · `2>` 리다이렉션 | 파일 | Lab 09 |

B3-2 프로그램의 `git_collector.py`도 같은 방식입니다. `returncode`가 0이 아니면 `stderr`의 메시지로 오류(`GitError`)를 만들고, 0이면 `stdout`을 변경 정보로 씁니다. ([소스][src-git])

**선택 실험 · 옵션을 빼면?** `재현 · Claude`

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

```text
--- A. capture_output 없이 ---
 M README.md
stdout 속성: None
--- B. text=True 없이 ---
stdout 속성: b' M README.md\n'
```

A: 통로가 터미널에 그대로 연결되어 Git의 출력이 **화면으로 바로** 나갔고, Python은 아무것도 받지 못했습니다(`None`). B: 받기는 했지만 글자가 아니라 **바이트**(`b'…'`)입니다. 사람이 읽고 다루려면 `text=True`로 글자로 바꿔야 합니다. B3-2는 여기에 `encoding="utf-8"`을 더해 한글이 깨지지 않게 합니다.

**9. 도식**

```text
 ┌ Python ─────────────────────┐   ① 실행 부탁     ┌ 운영체제 ┐   ② Git 실행    ┌ Git ───────────────┐
 │ subprocess.run([...])       │ ───────────────▶ │          │ ─────────────▶ │ git status --short │
 │                             │                  │          │                │                    │
 │ result.returncode ◀─────────┼──── ④ 전달 ──────┤          │ ◀── ③ 종료 0/128 ┤ (Git이 정함)       │
 │ result.stdout     ◀─────────┼──── stdout 통로 ───────────────────────────────┤ 일반 출력          │
 │ result.stderr     ◀─────────┼──── stderr 통로 ───────────────────────────────┤ 오류·진단 메시지    │
 └─────────────────────────────┘    (capture_output=True: 통로 끝을 Python에 연결)  └────────────────────┘
```

**결과가 다르다면**

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| 저장소 안의 `stdout`이 `''` | 상태 A입니다. 정상입니다. 성공했지만 보여 줄 변경이 없습니다. |
| 저장소 안인데 `returncode`가 128 | `cd`로 저장소 폴더에 들어간 뒤 실행하세요. |
| `heredoc>` 프롬프트가 계속 나온다 | 마지막 `EOF` 줄이 빠졌습니다. `EOF`만 입력하고 Enter를 누르세요. |

</details>

**10. 이해 확인**
- Git의 종료 상태는 누가 정하고, 누가 전달하고, Python은 어디서 받나요? → *Git이 정하고, 운영체제가 전달하고, Python은 `returncode`로 받습니다.*
- “stdout이 비어 있으니 실패다”는 맞나요? → *아니요. 성공해도 보여 줄 것이 없으면 비어 있습니다. 성공 여부는 `returncode`로 봅니다.*
- `capture_output=True`를 빼면 Git의 출력은 어디로 가나요? → *터미널 화면으로 바로 갑니다. Python은 받지 못합니다.*

**11. 연결** 이전: [Lab 03](#lab-03) · 다음: [Lab 05](#lab-05) · 이 결과를 설명하는 화면: **S2-1**(F4 ② “프로그램 → Git: 실행”) · **S2-2**(F5 결과 세 칸, 재현 0 · 128) · 다시 연결: [Lab 09](#lab-09) · 더 읽기: [B3-2 학습가이드 01][g01]

---

<a id="lab-05"></a>

## Lab 05. AI에게 전달할 Git 문맥 만들기

> API 호출 0회 · 키 필요 없음 · 약 15분 · 시작 상태 **B** (C도 가능)

**1. 실습 목적** B3-2 프로그램의 실제 함수를 그대로 불러, AI에게 보낼 글(Git 문맥)을 **보내기 전에** 내 눈으로 확인합니다.

**2. 연결되는 스토리와 개념**
- 스토리: S3-1(F6 “내 컴퓨터 밖으로 나갈 글”) · S1-2
- 용어: `git-diff` · `staging-area-git-add` · `data-masking` · `secret-management` · `safe-mode` · `prompt-design`
- 이 Lab에서 다루지 않는 것: 마스킹 패턴의 정규식, `--unsafe` 옵션(학습가이드 05)

**3. 시작 조건** 상태 B. **변경이 있어야** Git 문맥에 diff가 들어갑니다(상태 A에서는 diff 칸이 비어 있습니다). 저장소 폴더 안에서 실행해야 `ai_gitgen`을 찾을 수 있습니다.

**4. 실행 전 질문**
- 보낼 글에는 README.md 전체가 들어갈까요, 바뀐 부분만 들어갈까요?
- 상태 B에서 `Staged diff:` 칸과 `Unstaged diff:` 칸 중 어디에 메모 줄이 있을까요?

**5. 명령**

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

- `collect_changes()` Lab 04처럼 Git을 여러 번 실행해 변경 정보를 모읍니다.
- `prepare_context()` 모은 정보를 하나의 글로 묶고, 보내기 전에 검사합니다.

**6. 관찰 목록**
- [ ] 글이 몇 개의 칸(제목 줄)으로 나뉘나요?
- [ ] 비어 있는 칸은 어느 것인가요? 왜 비어 있을까요?
- [ ] 메모 줄은 어느 칸에 있나요? Lab 03의 어떤 출력과 같나요?
- [ ] 메모 줄 말고 함께 들어간 줄은 무엇인가요?
- [ ] 전체 글자 수는?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록과 해설</b></summary>

**7. 실행 기록**

`실제 · 2026-11-25 Owner` — 구조와 글자 수

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

`재현 · Claude` — `Unstaged diff:` 칸 전문(Owner 기록의 `...` 부분). 글자 수도 535로 같았습니다.

```text
Unstaged diff:
diff --git a/README.md b/README.md
index 7322076..076b2f1 100644
--- a/README.md
+++ b/README.md
@@ -76,3 +76,5 @@ python -m unittest discover -s tests -v
 ```
 
 macOS에서는 `python3`를 사용하세요. [학습 목차](docs/learning/INDEX.md)는 … 자동 재시도도 하지 않습니다.
+
+실습 메모: AI가 작성한 초안은 사람이 검토한다.
```

**8. 결과 해설**

**여섯 칸.** `Branch` · `Status` · `Changed files` · `Untracked files (names only)` · `Staged diff` · `Unstaged diff`. 상태 B에서는 `git add`를 하지 않았으므로 `Staged diff:`가 비어 있고 메모 줄은 `Unstaged diff:`에 있습니다. Lab 03의 add 이전 `git diff` 출력과 같습니다. 새 파일이 없으니 `Untracked files`도 비어 있습니다.

**바뀐 줄과 그 주변만 들어갑니다.** README.md 전체(약 80줄)가 아니라 diff가 들어갑니다. 메모 두 줄(`+`) 앞의 세 줄(코드 블록을 닫는 ` ``` `, 빈 줄, macOS 안내 문장)은 **주변 문맥**입니다. 바뀌지 않았지만 “파일의 어디에 추가했는지”를 AI가 알 수 있게 Git이 함께 보여 준 줄입니다. 그래서 Lab 08의 AI 초안이 “README.md **마지막에**”라고 쓸 수 있었습니다.

**535자는 이 실행의 관찰값입니다.** README.md 내용, 브랜치 이름, 저장소에 다른 파일이 있는지에 따라 달라집니다. 예를 들어 저장소 안에 `lab-note.py` 파일이 하나 있으면 `?? lab-note.py`와 파일 이름이 추가되어 573자가 됩니다(재현 · Claude). 상태 C에서 실행하면 같은 diff가 `Staged diff:` 칸으로 옮겨 가고 `Status`가 `M  README.md`가 되며, 글자 수는 535로 같습니다(재현 · Claude).

**이 글은 다섯 단계를 거쳐 만들어졌습니다.**

| 단계 | 이번 사례에서 | 담당 |
| --- | --- | --- |
| ① Git 명령이 제공한 정보 | `git branch --show-current` → `main`, `git status --short` → ` M README.md`, `git diff` → diff 글, `git diff --cached` → (없음) | Git (stdout) |
| ② Python이 수집한 정보 | 위 출력을 받아 브랜치·상태·파일 목록·두 diff·새 파일 목록으로 나눠 담음(`GitChanges`) | `collect_changes()` |
| ③ Python이 구조화한 문맥 | 여섯 칸에 제목을 붙이고 빈 줄로 이어 붙인 하나의 글 | `prepare_context()` |
| ④ 민감정보 검사·마스킹 | 비밀 파일로 보이는 경로(`.env`, `*.pem` 등) → **전송 중단** / 이메일·`Bearer` 값·`api_key=` 형태 값·알려진 토큰 형식 → `[REDACTED …]`로 **가림** / 16,000자 초과 → **전송 중단**. 이번 사례는 가릴 값이 없어 검사 전후가 같습니다. | `prepare_context()` (안전 모드 기본) |
| ⑤ 실제 API에 전달할 데이터 | ④를 마친 글 전체가 다음 Lab에서 요청의 `user` 메시지가 됩니다. | `main.py` → `AIClient.generate()` |

**검사에는 한계가 있습니다.** 검사는 정해 둔 **모양(패턴)** 만 찾습니다. 패턴에 없는 비밀(예: 영어 키워드 없이 한국어 문장 속에 적은 비밀번호, 새로운 형식의 토큰)은 그대로 나갈 수 있습니다. 그래서 외부로 보내기 전 `git diff`와 `git diff --cached`를 **사람이 직접 확인**하는 습관이 필요합니다.

**선택 실험 · 가림 확인** `재현 · Claude` — 가짜 이메일로만 실험하세요.

```bash
printf '문의: lab-test@example.com\n' >> README.md
# 위의 Lab 05 명령을 다시 실행 → 문맥 끝이 "+문의: [REDACTED EMAIL]" 로 바뀜
```

실험 뒤에는 상태 A로 돌아가 상태 B를 다시 만드세요.

**9. 도식**

```text
 [Git] ─① 출력─▶ [Python: collect_changes] ─②─▶ [Python: prepare_context]
                                                   │ ③ 여섯 칸으로 묶기
                                                   │ ④ 검사 ── 위험 경로·불완전 개인키·16,000자 초과 → 멈춤 (AI 요청 0회)
                                                   │        └─ 이메일·토큰 등 → [REDACTED]로 가리고 계속
                                                   ▼
                                   ⑤ 검사를 마친 글 (이번 실행 535자) ──▶ 다음 Lab: user 메시지
```

**결과가 다르다면**

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `ModuleNotFoundError: No module named 'ai_gitgen'` | 저장소 폴더 밖에서 실행했습니다. `cd`로 `Codyssey_B3-2` 안에 들어가세요. |
| 글자 수가 535가 아니다 | 이상한 것이 아닙니다. `git status --short`로 다른 파일이 바뀌었는지, 메모가 두 번 들어가지 않았는지 확인하세요. |
| `SecurityError: 비밀 파일로 보이는 경로…` | 변경 목록에 `.env` 같은 이름의 파일이 있습니다. 실습에서 만든 파일이라면 지우세요. 검사가 제대로 작동한 것입니다. |
| diff 칸이 둘 다 비어 있다 | 상태 A입니다. 메모를 추가하세요. |

</details>

**10. 이해 확인**
- 상태 C에서 이 명령을 실행하면 메모 줄은 어느 칸에 들어갈까요? → *`Staged diff:` 칸입니다.*
- Git이 제공한 정보와 실제 API에 전달할 데이터는 같은가요? → *아니요. Python이 여섯 칸으로 묶고 검사(필요하면 가림)를 거친 글이 전달됩니다.*
- 자동 검사가 있는데도 사람이 diff를 확인해야 하는 이유는? → *검사는 정해 둔 모양만 찾기 때문에 모든 비밀을 찾아내지 못합니다.*

**11. 연결** 이전: [Lab 04](#lab-04) · 다음: [Lab 06](#lab-06) · 이 결과를 설명하는 화면: **S3-1**(F6. 그림의 806자는 다른 변경의 재현값입니다. 내 결과와 칸 구성을 비교해 보세요) · 더 읽기: [B3-2 학습가이드 05][g05]

---

<a id="lab-06"></a>

## Lab 06. 외부 AI API 요청 구성하기

> API 호출 0회(보내지 않고 만들기만) · 키 필요 없음 · 약 15분 · 시작 상태 **B**

**1. 실습 목적** Lab 05의 Git 문맥이 API 요청의 어디에 들어가는지 확인합니다. 보내기 전의 요청 본문을 내 화면에서 만들어 보고, Python 데이터가 JSON 글로 바뀌는 모습을 봅니다.

**2. 연결되는 스토리와 개념**
- 스토리: S3-2(F7 요청 상자 “JSON 본문 · system · user”, “딕셔너리 → JSON”)
- 용어: `json` · `json-request-response` · `serialization` · `list-dict` · `prompt-design` · `ai-model` · `http-post` · `api-key` · `utf-8`
- 이 Lab에서 다루지 않는 것: HTTP 헤더 전반, HTTPS 암호화, 실제 전송(Lab 07)

**3. 시작 조건** 상태 B. 저장소 폴더 안.

**4. 실행 전 질문**
- Git 문맥 안의 줄바꿈은 JSON 글 안에서 어떻게 보일까요?
- API 키는 요청 본문(JSON)에 들어갈까요?

**5. 명령**

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

이 코드는 B3-2의 `AIClient.generate()`가 만드는 본문과 **같은 구조**를 만들어 **출력만** 합니다. 인터넷으로 보내지 않습니다.

**6. 관찰 목록**
- [ ] `type(payload)`와 `type(body)`는 각각 무엇인가요?
- [ ] 1번에서 Git 문맥은 여러 줄로 보이나요? 2번에서는 어떻게 보이나요?
- [ ] `system` 메시지의 `content`는 무엇인가요?
- [ ] 출력 어디에도 API 키가 없나요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록과 해설</b></summary>

**7. 실행 기록** `재현 · Claude` (전송하지 않은 재현용 JSON)

```text
===== 1. Python 데이터(딕셔너리) =====
<class 'dict'>
Branch: main

Status:
 M README.md

Chan
===== 2. 보낼 JSON 글(앞부분) =====
<class 'str'>
{"model": "gpt-5-mini", "messages": [{"role": "system", "content": "You write Git commit messages in Korean. Return plain text: one informative subject, then an optional blank line and body. The subject must be at most 72 characters (prefer 50). Describe only changes shown in the Git context. No Markdown fence. Do not claim tests ran."}, {"role": "user", "content": "Branch: main\n\nStatus:\n M README.md\n\nChanged fi
===== 3. 확인 =====
user 메시지 == Git 문맥: True
JSON 글 길이: 933
다시 읽으면 같은 데이터: True
```

JSON 글의 끝부분은 `…자동 재시도도 하지 않습니다.\n+\n+실습 메모: AI가 작성한 초안은 사람이 검토한다.\n"}]}` 입니다.

**8. 결과 해설**

**요청 구조**

```text
model: gpt-5-mini
messages
 ├─ system: 작업 지시 (커밋 메시지를 이렇게 써라)
 └─ user:   Git 문맥 (Lab 05에서 만든 535자 글 그대로)
```

- **`system` = 작성 규칙.** 실제 `COMMIT_SYSTEM` 전문은 위 출력에 있습니다. 한국어로 쓸 것, 제목 72자 이하(50자 권장), Git 문맥에 보이는 변경만 설명할 것, 코드 블록 금지, 테스트를 실행했다고 주장하지 말 것. `pr` 명령은 이 자리에 PR 작성 규칙(`PR_SYSTEM`)을 넣습니다(Lab 08).
- **`user` = 이번 변경의 재료.** `user 메시지 == Git 문맥: True` — Lab 05의 글이 한 글자도 바뀌지 않고 들어갔습니다.
- **API 키는 본문에 없습니다.** 키는 실제 전송 때 본문과 따로 **인증 헤더**(`Authorization: Bearer …`)에 들어갑니다. 그래서 이 미리 보기에는 키가 필요 없습니다.

**Python 데이터와 JSON 글.** `payload`는 Python만 이해하는 **딕셔너리**(`dict`)입니다. 다른 컴퓨터의 서비스에 보내려면 누구나 읽을 수 있는 약속된 글 형식으로 바꿔야 하는데, 그것이 JSON입니다. `json.dumps()`가 딕셔너리를 JSON **글**(`str`)로 바꾸고, `json.loads()`가 다시 딕셔너리로 되돌립니다(`다시 읽으면 같은 데이터: True`). Lab 07·08에서 응답이 올 때는 반대 방향(JSON 글 → Python 데이터)이 일어납니다.

**왜 `\n`으로 보일까?** Python 문자열 안의 줄바꿈은 “다음 줄로”를 뜻하는 글자 하나입니다. 1번에서는 그 글자 때문에 문맥이 여러 줄로 보입니다. 그런데 JSON 규칙에서는 문자열 값 안에 실제 줄바꿈을 그대로 넣을 수 없습니다. 그래서 `json.dumps()`가 줄바꿈 하나를 `\`와 `n` 두 글자로 바꿔 적습니다(이스케이프). 받는 쪽이 JSON을 읽으면 다시 줄바꿈 하나로 돌아옵니다. 같은 이유로 문자열 안의 `"`는 `\"`로 적힙니다.

**한글이 그대로 보이는 이유.** B3-2는 `ensure_ascii=False`를 써서 한글을 그대로 둡니다. 이 옵션이 없으면 `실습 메모`가 `실습 메모`처럼 바뀝니다. 어느 쪽이든 받는 쪽이 읽으면 같은 글입니다. 실제 전송 때는 이 글을 UTF-8 바이트로 바꿔 보냅니다(이번 재현에서 933자 → 1165바이트. 한글 한 글자가 3바이트이기 때문입니다).

**재현용 JSON과 실제 네트워크 요청은 다릅니다.**

| | 이 Lab의 재현용 JSON | 실제 네트워크 요청 |
| --- | --- | --- |
| 무엇 | 내 컴퓨터에서 만들어 출력만 한 본문 | `python3 main.py commit`이 실제로 보낸 요청 |
| 포함 | 본문(`model`, `messages`)만 | 주소, `POST` 방식, 인증 헤더, `Content-Type`, UTF-8 본문. HTTPS로 암호화되어 전송 |
| 기록 | 있음(위 출력) | **캡처하지 않았습니다.** 같은 함수가 같은 구조를 만든다는 것은 소스 코드로 확인했습니다(구현). |

**9. 도식**

```text
 [Python 데이터]                         [JSON 글]                                   [실제 전송 · Lab 07]
 payload = {                  json.dumps   {"model": "gpt-5-mini",                     POST https://…/v1/chat/completions
   "model": "gpt-5-mini",    ──────────▶    "messages": [                              Authorization: Bearer ••••  ← 키는 여기
   "messages": [                             {"role": "system", "content": "You…"},  Content-Type: application/json
     {system: 작성 규칙},     ◀──────────     {"role": "user",                         본문: 왼쪽 JSON 글 (UTF-8)
     {user: Git 문맥 ←Lab 05}  json.loads      "content": "Branch: main\n\n…\n+실습 메모: …\n"}]}
   ]}                                           ↑ 줄바꿈 → \n (이스케이프)
```

**결과가 다르다면**

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| `user 메시지 == Git 문맥: False` | 코드를 고쳐 실행했을 수 있습니다. 위 코드를 그대로 다시 붙여넣으세요. |
| 한글이 `실…`로 보인다 | `ensure_ascii=False`가 빠졌습니다. 틀린 것은 아니고 표기 방식만 다릅니다. |
| JSON 글 길이가 933이 아니다 | Lab 05의 글자 수가 달랐다면 함께 달라집니다. 정답 값이 아닙니다. |

</details>

**10. 이해 확인**
- Git 문맥은 요청의 어디에 들어가나요? → *`messages` 안 `user` 메시지의 `content`입니다.*
- `system`과 `user`의 역할은? → *`system`은 어떻게 쓸지 정한 작성 규칙, `user`는 이번에 설명할 Git 문맥입니다.*
- JSON 글 안에서 줄바꿈이 `\n`으로 보이는 이유는? → *JSON 문자열 안에는 실제 줄바꿈을 넣을 수 없어서 `\`와 `n` 두 글자로 바꿔 적기 때문입니다.*

**11. 연결** 이전: [Lab 05](#lab-05) · 다음: [Lab 07](#lab-07) · 이 결과를 설명하는 화면: **S3-2**(F7 요청 상자, “딕셔너리 → JSON”) · 더 읽기: [B3-2 학습가이드 02][g02]

---

<a id="lab-07"></a>

## Lab 07. API 호출과 오류 해결

> **API 호출 1회**(문제 해결 시 추가될 수 있음) · **키 필요** · 약 20분 · 시작 상태 **B**

> **비용 안내** 실제 API 호출은 사용량과 비용이 생길 수 있습니다. 이 Lab에서는 `python3 main.py commit`을 한 번 실행합니다. 오류 재현은 요구하지 않습니다. 아래 “오류 사례”는 읽기 자료이며, 같은 오류가 나는 요청을 반복하지 마세요.

**1. 실습 목적** API 키를 안전하게 설정하고 첫 실제 요청을 보냅니다. 오류가 나면 “내 프로그램의 문제인지, 외부 API의 응답인지”를 구분하고 범위를 좁혀 원인을 찾는 방법을 익힙니다.

**2. 연결되는 스토리와 개념**
- 스토리: S3-2(F7 “인증 헤더”, “② 응답 · 성공 / 401·403”)
- 용어: `api-key` · `environment-variable` · `secret-management` · `http-request-response` · `http-status-code` · `http-200-ok` · `authentication-error` · `network-error` · `curl` · `troubleshooting` · `zsh-bash`
- 이 Lab에서 다루지 않는 것: HTTP 상태 코드 전체 목록, 프록시·네트워크 설정

**3. 시작 조건** 상태 B. 강사에게 받은 API 키. 화면 공유·녹화 중이 아닐 것.

**4. 실행 전 질문**
- 키를 숨겨서 붙여넣으면 화면에 아무것도 보이지 않습니다. 제대로 붙여넣었는지 어떻게 확인할 수 있을까요?
- 요청이 실패했다면 요청 횟수는 0일까요, 1일까요?

**5. 명령**

**① 키를 보이지 않게 입력** (macOS zsh)

```zsh
read -rs "CODYSSEY_API_KEY?API 키를 붙여넣고 Enter (화면에 보이지 않음): "; echo
export CODYSSEY_API_KEY
export CODYSSEY_API_URL='https://copa.codyssey.kr/v1/chat/completions'
export CODYSSEY_MODEL='gpt-5-mini'
```

- `read -s`는 입력한 글자를 화면에 표시하지 않습니다. **붙여넣었는지조차 화면에 나타나지 않습니다.** 한 번만 붙여넣고 Enter를 누르세요.
- 이 방법은 키를 셸 기록(history)에 남기지 않습니다. README처럼 `export CODYSSEY_API_KEY='키'`로 직접 적으면 공용 PC의 셸 기록에 키가 남을 수 있으므로 이 실습에서는 쓰지 않습니다.
- 주소와 모델은 2026-11-25에 성공한 설정입니다. 나중에 바뀔 수 있으니 강사가 안내한 값을 따르세요.

**② 키 값은 보지 않고 입력 상태만 확인**

```zsh
echo "키 길이: ${#CODYSSEY_API_KEY}"
printf '%s' "$CODYSSEY_API_KEY" | LC_ALL=C tr -d '[:alnum:]_-' | wc -c | xargs echo "영문·숫자·_·- 이외 문자 수:"
```

**③ 첫 요청**

```bash
python3 main.py commit
```

Lab 09까지 할 계획이라면 ③ 대신 [Lab 09의 분리 실행 명령](#lab-09)을 써도 됩니다. 그러면 추가 호출 없이 Lab 09를 할 수 있습니다.

**6. 관찰 목록**
- [ ] 키 길이가 0이 아닌가요? 강사가 알려 준 길이와 비슷한가요?
- [ ] 영문·숫자·`_`·`-` 이외 문자가 있나요?
- [ ] ③의 결과가 초안인가요, `오류:`로 시작하나요?
- [ ] 마지막 줄 `AI API 요청 횟수`는 몇인가요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록·오류 사례·해설</b></summary>

**7. 실행 기록**

성공했다면 출력은 Lab 08의 실행 기록과 같은 형태입니다. Lab 08로 가서 그 결과를 살펴보세요. 아래는 Owner가 성공하기 전에 겪은 오류 사례입니다.

**오류 사례 · HTTP 400** `실제 · 2026-11-25 Owner` (요약. 키 값과 응답 원문은 기록하지 않음)

| 순서 | 무엇을 했나 | 결과 |
| --- | --- | --- |
| 1 | 기존에 입력한 키(길이 64자)로 B3-2 실행 | HTTP 400. JSON이 아닌 **HTML 오류 페이지**가 돌아옴 |
| 2 | B3-2를 빼고 Python으로 직접 최소 요청 | 같은 오류 |
| 3 | Python도 빼고 curl로 최소 요청 | 같은 오류 |
| 4 | 키를 다시 입력(길이 56자) | HTTP 200, JSON 응답 성공 |

- 키를 다시 입력해서 해결했지만, 처음 입력에 **정확히 어떤 문자가 잘못 들어 있었는지는 확인하지 못했습니다.**
- 56자는 그때 쓴 키의 길이일 뿐입니다. **API 키의 올바른 길이라는 규칙이 아닙니다.**

이때 B3-2 프로그램은 아래처럼 출력했을 것으로 예상합니다. `예상` (소스 `ai_client.py` 기준, Owner 화면 기록은 없음)

```text
오류: AI API 응답 오류 (HTTP 400).
AI API 요청 횟수: 1
```

**8. 결과 해설**

**① 프로그램 오류인가, 외부 API의 응답인가.** B3-2의 오류 문구는 크게 두 종류입니다.

| 언제 | 오류 문구 | 요청 횟수 | 근거 |
| --- | --- | --- | --- |
| 보내기 **전** (내 컴퓨터 안에서 멈춤) | `확인된 API 주소와 모델이 필요합니다.` | 0 | 재현 · Claude |
| | `모델과 CODYSSEY_API_KEY가 필요합니다.` | 0 | 재현 · Claude |
| | `API URL은 사용자 정보와 쿼리가 없는 HTTPS 주소여야 합니다.` | 0 | 구현 |
| 보낸 **후** (외부 API가 거절하거나 응답이 이상함) | `인증 또는 권한 오류 (HTTP 401)` · `(HTTP 403)` | 1 | 구현 |
| | `AI API 응답 오류 (HTTP 400)` 등 그 밖의 HTTP 오류 | 1 | 구현 · 예상 |
| | `AI API 네트워크 연결에 실패했습니다.` | 1 | 구현 |
| | `AI API 응답이 올바른 JSON이 아닙니다.` · `AI API 응답에 텍스트가 없습니다.` | 1 | 구현 |

요청 횟수는 **보내기를 시도한 순간** 1이 됩니다. 그래서 실패해도 1입니다. 실패한 요청이 과금되는지는 공급자 정책에 따르며 이 실습에서는 확인하지 않았습니다.

**② 상태 코드와 응답 본문.** HTTP 응답은 **상태 코드**(성공·실패의 종류를 나타내는 숫자)와 **본문**(내용)으로 이루어집니다. 200번대는 성공, 400번대는 요청 쪽 문제로 거절, 401·403은 인증·권한 문제입니다. B3-2는 실패하면 상태 코드만 알려 주고 본문은 보여 주지 않습니다. Owner의 사례처럼 본문이 JSON이 아니라 HTML 페이지로 오기도 합니다. 본문 형식은 “누가 이 응답을 만들었나”의 단서가 될 수 있지만, 이번 사례에서 어느 단계가 HTML을 만들었는지는 확인하지 못했습니다.

**③ 범위를 줄여 원인 찾기.** Owner는 한 번에 하나씩 빼면서 범위를 좁혔습니다.

```text
 [B3-2 프로그램 전체] ── 400 ──▶ [Python 최소 요청: B3-2 코드 제외] ── 400 ──▶ [curl 최소 요청: Python 제외] ── 400
        │                                                                                              │
        └──── 셋 다 같은 오류 → 문제는 B3-2 코드도 Python도 아니고, 셋이 공통으로 쓰는 것(주소·모델·키)에 있다 ◀┘
                                                     │
                                         키를 다시 입력 → 200 성공
```

**④ 같은 오류 요청을 무의미하게 반복하지 않기.** 같은 설정으로 다시 보내면 같은 결과가 나올 가능성이 큽니다. 비용만 늘 수 있습니다. 다시 보내기 전에 **무엇 하나를 바꿨는지** 말할 수 있어야 합니다. 같은 오류가 두 번 나면 멈추고 강사에게 알리세요.

**문제 해결용 최소 요청 (선택)** — 아래 두 명령도 실제 API 요청이므로 비용이 생길 수 있습니다. 둘 다 키를 출력하지 않고 상태 코드와 본문 앞부분만 보여 줍니다. `재현 · Claude`는 이 명령들을 실제 API가 아닌 로컬 테스트 서버로만 확인했습니다(HTML 오류 본문을 받아 상태 코드·`Content-Type`·본문 앞부분을 키 없이 표시하는 것 확인).

Python 직접 호출(B3-2 코드 제외):

```bash
python3 - <<'EOF'
import json, os
from urllib import error, request

payload = {"model": os.environ["CODYSSEY_MODEL"],
           "messages": [{"role": "user", "content": "한 단어로 인사해 주세요."}]}
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

curl 최소 요청(Python 제외):

```zsh
curl -sS -X POST "$CODYSSEY_API_URL" \
  -H "Authorization: Bearer $CODYSSEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"$CODYSSEY_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}]}" \
  -w "\n----\nHTTP 상태: %{http_code}\nContent-Type: %{content_type}\n"
```

**9. 도식**

```text
 ┌ 내 컴퓨터 ───────────────────────────────────────┐            ┌┄ 외부 AI API ┄┄┄┄┐
 │ 환경변수: URL · 모델 · 키(숨김 입력)              │            ┆                  ┆
 │   │ 비어 있거나 형식이 틀리면 → 여기서 멈춤(요청 0회) │  요청 ──▶  ┆  인증·형식 확인  ┆
 │   ▼                                              │            ┆      │           ┆
 │ B3-2 · Python · curl  ── 같은 주소·모델·키 사용 ──┼────────────┼──▶   ▼           ┆
 │                                                  │  ◀── 응답  ┆ 상태 코드 + 본문  ┆
 │ 200 → JSON 읽기 (Lab 08)                          │            ┆ 200 JSON          ┆
 │ 400·401·403… → "오류: … (HTTP 코드)" (요청 1회)    │            ┆ 400 HTML(이번 사례)┆
 └──────────────────────────────────────────────────┘            └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
```

**결과가 다르다면**

| 이렇게 나왔다면 | 먼저 확인할 것 |
| --- | --- |
| 키 길이 0 | 붙여넣기 전에 Enter를 눌렀을 수 있습니다. ①을 다시 하세요. |
| 키 길이가 예상보다 훨씬 길다 | 두 번 붙여넣었거나 다른 글자가 함께 들어갔을 수 있습니다. ①을 다시 하세요. (Owner 사례에서도 다시 입력으로 해결) |
| 영문·숫자·`_`·`-` 이외 문자가 1개 이상 | 키 형식에 따라 정상일 수도 있습니다. 강사에게 확인하세요. 키 값을 화면에 출력하지는 마세요. |
| `확인된 API 주소와 모델이 필요합니다` | ①의 `export CODYSSEY_API_URL`·`CODYSSEY_MODEL` 줄을 실행하지 않았거나 다른 터미널 창입니다. 환경변수는 설정한 창에서만 유효합니다. |
| `인증 또는 권한 오류 (HTTP 401/403)` | 키가 틀렸거나 권한이 없습니다. 키를 다시 입력해 보고, 그래도 같으면 강사에게 알리세요. |
| `AI API 응답 오류 (HTTP 400)` | 위 오류 사례와 ③ 범위 줄이기를 참고하세요. 같은 요청을 반복하지 마세요. |
| `네트워크 연결에 실패했습니다` | 인터넷 연결을 확인하세요. 응답을 30초 기다리고 멈춥니다. |
| 초안 대신 `커밋 제목이 너무 길거나…` 같은 오류 | API는 성공했지만 AI의 답이 형식 검사를 통과하지 못했습니다. Lab 08 해설을 보세요. |

</details>

**10. 이해 확인**
- `오류: 모델과 CODYSSEY_API_KEY가 필요합니다.`와 `오류: 인증 또는 권한 오류 (HTTP 401).`의 차이는? → *앞은 요청을 보내기 전에 내 컴퓨터에서 멈춘 것(요청 0회), 뒤는 보낸 요청을 외부 API가 거절한 것(요청 1회)입니다.*
- HTTP 오류가 나면 어디부터 확인할 수 있나요? (자기 말로) → *예: 오류가 요청 전인지 후인지, 상태 코드와 본문, 범위를 줄인 최소 요청, 주소·모델·키 설정 순서로 확인합니다.*
- 숨겨서 입력한 키를 화면에 출력하지 않고 확인하는 방법은? → *길이와 문자 종류만 확인합니다.*

**11. 연결** 이전: [Lab 06](#lab-06) · 다음: [Lab 08](#lab-08) · 이 결과를 설명하는 화면: **S3-2**(F7 인증 헤더, 응답 상태 칩) · 더 읽기: [B3-2 학습가이드 02][g02]

---

<a id="lab-08"></a>

## Lab 08. 실제 AI 응답과 초안 생성

> **API 호출 1–2회**(Lab 07의 `commit` 결과를 쓰면 `pr` 1회만) · **키 필요** · 약 20분 · 시작 상태 **B**

**1. 실습 목적** 같은 Git 문맥으로 `commit`과 `pr` 초안을 받아 비교합니다. AI가 쓴 부분과 프로그램이 넣은 부분을 구별하고, 초안을 실제 diff와 비교해 사람이 확인할 곳을 찾습니다.

**2. 연결되는 스토리와 개념**
- 스토리: S4-1(F8 두 초안, “`user` = 같은 Git 문맥”) · S4-2(F1 return, 형식 검사와 사람의 확인) · S3-2(F7 응답 상자)
- 용어: `pull-request` · `commit-message-convention` · `output-validation` · `post-processing` · `human-in-the-loop` · `llm` · `temperature`
- 이 Lab에서 다루지 않는 것: 좋은 커밋 메시지 작성법 전반, PR 운영 규칙

**3. 시작 조건** 상태 B. Lab 07의 환경변수가 설정된 **같은 터미널 창**. 두 명령 사이에 파일을 고치지 마세요(같은 Git 문맥을 보내기 위해).

**4. 실행 전 질문**
- 같은 변경으로 두 명령을 실행하면 AI에게 가는 `user` 메시지는 같을까요? 무엇이 다를까요?
- 초안 중 AI가 쓰지 않은 부분이 있을까요?

**5. 명령** — Lab 07에서 `commit`이 성공했다면 그 결과를 쓰고 `pr`만 실행하세요.

```bash
python3 main.py commit
python3 main.py pr
```

**6. 관찰 목록**
- [ ] 두 초안의 형식은 어떻게 다른가요?
- [ ] 두 초안 모두에 똑같이 있는 줄은?
- [ ] PR 초안의 `## How to Test` 아래 문장은 테스트를 실행했다는 뜻인가요?
- [ ] 초안의 내용을 Lab 03의 `git diff`와 비교해 보세요. 사실과 맞는 부분, diff에 없는 내용은?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록과 해설</b></summary>

**7. 실행 기록** `실제 · 2026-11-25 Owner`

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

**AI 결과는 실행할 때마다 달라질 수 있습니다.** 내 초안의 문장이 위와 달라도 정상입니다. 형식(제목과 본문 / Title·Why·What·How to Test)을 비교하세요.

**8. 결과 해설**

**같은 재료, 다른 규칙.** 두 명령은 같은 함수로 Git 문맥을 만들어 `user`에 넣습니다. 사이에 파일을 고치지 않았다면 `user`는 같습니다. 달라지는 것은 `system` 작성 규칙입니다. 다만 두 실행의 원본 요청은 캡처하지 않았으므로, 글자 단위로 같았는지는 확인하지 않았습니다(구현 기준 판단).

| | `commit` | `pr` |
| --- | --- | --- |
| `user` | Lab 05의 Git 문맥 | 같은 Git 문맥 |
| `system` | `COMMIT_SYSTEM`: 한 줄 제목(72자 이하) + 선택 본문 | `PR_SYSTEM`: `Title:`(80자 이하) + `## Why` · `## What` · `## How to Test`, 각 섹션에 불릿 |
| 결과 형식 | 제목 1줄 + 빈 줄 + 본문 | Title + 세 섹션 |

`PR_SYSTEM` 전문은 [B3-2 소스 `prompts.py`][src-prompts]에 있습니다.

**응답에서 답 꺼내기.** API는 답을 JSON으로 돌려줍니다. Python은 그 JSON 글을 Python 데이터로 읽은 뒤 아래 경로로 답 글만 꺼냅니다.

```python
data["choices"][0]["message"]["content"]
```

`교육용 예시` — Chat Completions 응답의 대략적인 모양입니다. 실제 응답 원문이 아니며, 실제 응답에는 다른 필드가 더 있거나 값이 다를 수 있습니다.

```json
{
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "커밋 메시지 초안 …"
      }
    }
  ]
}
```

`choices`(목록) → `[0]`(첫 번째 답) → `message`(메시지) → `content`(글). Owner는 curl 최소 요청에서 HTTP 200 JSON 응답 구조를 확인했지만, COMMIT·PR 초안을 만들 때의 원본 API JSON은 확보하지 않았습니다. 두 기록은 서로 다른 요청이므로 하나로 합쳐 보지 않습니다.

**Python이 답을 받은 뒤 하는 일.** 화면에 보이는 초안은 AI의 답 그대로가 아닙니다.

| 단계 | `commit` | `pr` |
| --- | --- | --- |
| ① 꺼내기 | `content`의 앞뒤 공백 제거. 없거나 비어 있으면 오류 | 같음 |
| ② 형식 검사 | 코드 블록이 아닌지, 제목이 8–72자인지, `update`·`수정` 같은 너무 짧은 제목이 아닌지, `#`·`-`·`Title:`로 시작하지 않는지 | `Title:`과 세 섹션이 있는지, 제목 8–80자, 각 섹션에 `- ` 불릿이 있는지, Title·Why·What에 “테스트 통과” 같은 주장이 없는지 |
| ③ 고쳐 쓰기 | 없음 | 섹션 사이에 빈 줄을 넣어 다시 조립하고, **How to Test 내용을 `- 실행 권장: python -m unittest discover -s tests`로 바꿈** |
| ④ 안내문 붙여 출력 | `=== 검토용 초안: … ===`, `=== 끝: 내용을 확인한 뒤 사용하세요 ===` | 같음 |
| ⑤ 요청 횟수 | `AI API 요청 횟수: 1` (stderr) | 같음 |

검사를 통과하지 못하면 초안을 버리고 오류로 끝납니다. **다시 요청하지 않습니다**(요청 횟수 1 그대로).

**How to Test는 테스트를 했다는 기록이 아닙니다.** 이 줄은 AI가 쓴 것이 아니라 프로그램이 정해 둔 **권장 명령**입니다. 누군가 이 명령을 실제로 실행하고 결과를 확인하기 전까지는 테스트가 수행된 것이 아닙니다. 실제로 한 검증은 사람이 PR에 직접 적어야 합니다.

**사람의 확인** — 초안을 실제 diff(Lab 03)와 비교해 봅니다.

| 초안 내용 | diff와 비교 | 판단 |
| --- | --- | --- |
| 파일: `README.md` | diff의 파일과 같음 | 사실 |
| 위치: “마지막에”, “파일 끝에” | `@@ -76,3 +76,5 @@`, 메모 뒤에 줄 없음 | 사실 |
| “빈 줄 한 줄과 … 문구를 추가” | `+`(빈 줄)과 `+실습 메모…` 두 줄 | 사실 |
| Why: “사용자에게 명시적으로 사람이 검토한다는 점을 알리기 위해” | **diff에는 변경 이유가 없음** | AI가 **추측한** 이유. 실제 의도(이번에는 실습)를 사람이 확인하고 고쳐야 함 |
| How to Test 권장 명령 | 실행하지 않음 | 실행 전까지 테스트 아님 |

**초안 생성 ≠ 실제 커밋·PR.** 두 명령 모두 글을 출력했을 뿐입니다. `git log`에 새 커밋이 없고 GitHub에 PR도 없습니다. 이 글로 커밋하고 push하고 PR을 등록하는 일은 사람이 직접 합니다. 이 실습에서는 하지 않습니다.

**9. 도식**

```text
                  ┌ user: 같은 Git 문맥 (Lab 05) ┐
 commit ─ system: 커밋 작성 규칙 ─┤                              ├─▶ ┆AI┆ ─▶ content ─▶ [검사] ─▶ [안내문] ─▶ 초안(stdout)
 pr     ─ system: PR 작성 규칙  ─┤                              ├─▶ ┆AI┆ ─▶ content ─▶ [검사·재조립·How to Test 교체] ─▶ 초안(stdout)
                  └──────────────────────────────┘
                                                        요청 횟수 ─▶ stderr
 초안 ─▶ 사람: diff와 비교 · 의도 확인 · 고치기 ─▶ (사람이 직접) git commit / PR 작성
```

초안 속 색 구분(스토리 F8과 같은 규칙): AI가 쓴 글 = 초록, 프로그램이 넣은 고정 문구(`===` 줄, How to Test 권장 명령) = 주황.

**결과가 다르다면**

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| 초안 문장이 위와 다르다 | AI 결과는 매번 달라질 수 있습니다. 형식과 사실 여부를 비교하세요. |
| `커밋 제목이 너무 길거나 의미가 부족합니다.` | AI의 답이 형식 검사를 통과하지 못했습니다. 요청 1회가 쓰였고 초안은 버려졌습니다. 다시 실행할지 강사와 상의하세요. |
| `PR 제목 또는 필수 섹션(Why, What, How to Test)이 없습니다.` | 위와 같습니다. |
| `PR 본문에 확인되지 않은 테스트 수행 주장이 있습니다.` | AI가 “테스트를 통과했다”고 썼습니다. 프로그램이 막은 것입니다. |
| `변경 사항이 없습니다.` | 상태 A입니다. 메모를 추가하세요(요청 0회). |

</details>

**10. 이해 확인**
- 같은 변경에서 다른 초안이 나오는 이유는? → *`user`(Git 문맥)는 같지만 `system`(작성 규칙)이 다르고, 프로그램이 결과를 다르게 검사·조립하기 때문입니다. AI 결과 자체도 실행마다 달라질 수 있습니다.*
- Python은 응답에서 초안 글을 어떻게 꺼내나요? → *응답 JSON을 Python 데이터로 읽고 `choices[0].message.content`를 가져옵니다.*
- `- 실행 권장: python -m unittest discover -s tests`가 있으면 테스트를 한 것인가요? → *아니요. 프로그램이 넣은 권장 명령일 뿐입니다.*
- PR 초안의 Why 중 사람이 꼭 확인해야 하는 부분은? → *diff에 없는 변경 이유입니다. AI가 추측한 것입니다.*

**11. 연결** 이전: [Lab 07](#lab-07) · 다음: [Lab 09](#lab-09) · 이 결과를 설명하는 화면: **S4-1**(F8) · **S4-2**(F1 return ①② ③) · **S3-2**(F7 응답 상자) · 더 읽기: [B3-2 학습가이드 03][g03] · [04][g04]

---

<a id="lab-09"></a>

## Lab 09. stdout과 stderr 확인 및 마무리

> API 호출 0–1회(경로 선택) · 약 15분 · 시작 상태 **B**

**1. 실습 목적** B3-2 프로그램의 출력이 두 통로로 나뉘어 있다는 것을 파일로 분리해 확인합니다. Lab 04에서 Python이 Git의 통로를 받았듯, 이번에는 셸이 Python 프로그램의 통로를 파일로 연결합니다. 마지막으로 실습 환경을 정리합니다.

**2. 연결되는 스토리와 개념**
- 스토리: S2-2(F5 stdout·stderr) · S4-1(F8 “`AI API 요청 횟수: 1 ← stderr`”) · S4-2 마무리
- 용어: `stdin-stdout` · `exit-code` · `shell` · `environment-variable`
- 이 Lab에서 다루지 않는 것: 파이프(`|`)와 리다이렉션 문법 전반

**3. 시작 조건** 경로를 하나 고릅니다.

| 경로 | API 호출 | 조건 |
| --- | --- | --- |
| **A. 실제 초안으로** | 1회 | Lab 07의 환경변수, 상태 B |
| **A′. Lab 07·08에서 이미 분리 실행했다** | 0회 | Lab 07 ③ 또는 Lab 08을 아래 명령으로 실행했다면 그 파일을 그대로 씁니다 |
| **B. 비용 없이** | 0회 | 키 없이도 가능. 출력 내용은 다르지만 통로가 나뉘는 것은 같습니다 |

**4. 실행 전 질문**
- `>`로 stdout을 파일에 보내면 화면에는 무엇이 남을까요?
- 초안과 요청 횟수는 각각 어느 파일에 들어갈까요?

**5. 명령**

**경로 A·A′**

```bash
python3 main.py commit > /tmp/b32-stdout.txt 2> /tmp/b32-stderr.txt
echo "종료 코드: $?"

echo "===== stdout ====="
cat /tmp/b32-stdout.txt

echo "===== stderr ====="
cat /tmp/b32-stderr.txt
```

**경로 B** — 아래 둘 중 하나를 위 명령의 첫 줄 대신 실행합니다.

```bash
# B-1. 변경이 없는 상태(상태 A)에서
python3 main.py commit > /tmp/b32-stdout.txt 2> /tmp/b32-stderr.txt
# B-2. 상태 B에서, 이 한 번만 API 설정을 뺀 채로 실행
env -u CODYSSEY_API_KEY -u CODYSSEY_API_URL -u CODYSSEY_MODEL python3 main.py commit > /tmp/b32-stdout.txt 2> /tmp/b32-stderr.txt
```

`env -u 이름`은 그 명령 한 번에만 환경변수를 빼고 실행합니다. 터미널의 설정은 그대로 남습니다.

- `>` stdout 통로의 끝을 파일에 연결합니다.
- `2>` stderr 통로(번호 2)의 끝을 다른 파일에 연결합니다.

**6. 관찰 목록**
- [ ] 첫 줄을 실행했을 때 화면에 나온 것이 있나요?
- [ ] 종료 코드는?
- [ ] stdout 파일과 stderr 파일에는 각각 무엇이 있나요?

<details>
<summary><b>관찰을 마쳤다면 펼치기 — 실행 기록과 해설</b></summary>

**7. 실행 기록**

경로 A `실제 · 2026-11-25 Owner`

```text
===== stdout =====
=== 검토용 초안: COMMIT ===
README에 실습 메모 문장 추가

README.md 마지막에 "실습 메모: AI가 작성한 초안은 사람이 검토한다." 문장을 새 줄로 추가함.
=== 끝: 내용을 확인한 뒤 사용하세요 ===
===== stderr =====
AI API 요청 횟수: 1
```

종료 코드는 이 실행에서 공유되지 않았습니다(기록 없음). 초안이 정상 출력되었으므로 소스 기준으로는 `0`이 `예상`됩니다.

경로 B-2 `재현 · Claude`

```text
종료 코드: 1
===== stdout =====
===== stderr =====
오류: 확인된 API 주소와 모델이 필요합니다. --api-url, --model 또는 환경변수를 설정하세요.
AI API 요청 횟수: 0
```

경로 B-1은 stdout에 `변경 사항이 없습니다.`, stderr에 `AI API 요청 횟수: 0`, 종료 코드 0입니다(Lab 02와 같은 결과를 파일로 나눈 것).

**8. 결과 해설**

**B3-2의 통로 사용 규칙** (구현)

| 통로 | 담기는 것 | 이유 |
| --- | --- | --- |
| stdout | 초안(`===` 안내문 포함), `변경 사항이 없습니다.` | 프로그램의 **결과물**. 파일로 저장하거나 다른 프로그램에 넘기기 쉽게 따로 둡니다. |
| stderr | `AI API 요청 횟수: N`, `오류: …` | **진단 정보**. 결과물에 섞이지 않게 따로 둡니다. 오류가 아니어도 stderr를 씁니다. |

그래서 `python3 main.py commit > draft.txt`처럼 저장하면 초안만 파일에 들어가고, 요청 횟수는 화면에 남습니다.

**Lab 04와 같은 구조, 다른 주인공**

| | Lab 04 | Lab 09 |
| --- | --- | --- |
| 실행되는 프로그램 | Git | B3-2 프로그램(Python) |
| 통로 끝을 연결한 쪽 | Python (`capture_output=True`) | 셸 (`>`, `2>`) |
| 도착지 | Python 문자열 | 파일 |
| 종료 상태를 받는 쪽 | Python의 `returncode` | 셸의 `$?` |

stdout과 stderr는 화면도 파일도 아닌 **통로**이고, 끝을 어디에 연결하느냐에 따라 화면·문자열·파일로 도착지가 바뀝니다.

**출력 순서가 바뀌어 보이는 이유.** 터미널에서는 초안이 먼저, 요청 횟수가 나중에 보입니다. 하지만 출력을 파이프로 받으면 stdout은 모아 두었다가 한꺼번에 내보내고 stderr는 바로 내보내서, 요청 횟수가 먼저 보이기도 합니다(재현 · Claude). 두 통로가 서로 독립적이라는 또 하나의 증거입니다.

**AI가 한 일과 사람이 할 일.** 지금까지의 결과를 정리하면, AI는 초안 글을 썼고(stdout의 가운데), B3-2 프로그램은 Git에서 변경을 모으고 검사하고 요청하고 형식을 확인하고 안내문을 붙였습니다(stdout의 `===` 줄, stderr의 횟수). 이 초안을 diff와 비교해 고치고, 실제로 커밋·push·PR을 할지 정하는 것은 사람입니다.

**9. 도식**

```text
                         ┌─ stdout (1번 통로) ──  >  ──▶ /tmp/b32-stdout.txt   초안 (결과물)
 python3 main.py commit ─┤
                         └─ stderr (2번 통로) ── 2> ──▶ /tmp/b32-stderr.txt   요청 횟수 · 오류 (진단)
                            종료 상태 ─────────────────▶ $?                     0 = 정상 · 1 = 오류
```

**결과가 다르다면**

| 이렇게 나왔다면 | 이유와 할 일 |
| --- | --- |
| 첫 줄 실행 후 화면에 무언가 나왔다 | `2>`를 빠뜨렸을 수 있습니다. 그러면 stderr는 화면으로 나옵니다. |
| stdout 파일이 비어 있고 stderr에 `오류:` | 초안을 만들지 못했습니다. 오류 문구로 Lab 07 표를 보세요. |
| `종료 코드: 0`이 아닌데 초안이 있다 | `echo "종료 코드: $?"` 앞에 다른 명령을 실행했을 수 있습니다. |

</details>

<a id="실습-정리"></a>

### 실습 정리

**반드시 실행하세요.** 공용 PC입니다.

```zsh
# 1. API 키와 설정 지우기
unset CODYSSEY_API_KEY CODYSSEY_API_URL CODYSSEY_MODEL
[[ -z "$CODYSSEY_API_KEY" ]] && echo "키 설정: 지워짐" || echo "키 설정: 아직 남아 있음"

# 2. 임시 출력 파일 지우기
rm -f /tmp/b32-stdout.txt /tmp/b32-stderr.txt

# 3. 실습 폴더 지우기 — 먼저 경로를 확인하세요
echo "$LAB_DIR"
```

3번에서 `/Users/…/b32-practice.` 로 시작하는 경로가 보이면 아래를 실행합니다. 아무것도 나오지 않으면(새 터미널 창 등) `ls -d ~/b32-practice.*`로 경로를 찾아 직접 지정하세요.

```zsh
cd ~ && rm -rf "$LAB_DIR"
```

마지막으로 **터미널 창을 닫습니다.** 환경변수는 그 창에서만 유효하므로 창을 닫으면 남지 않습니다. 실습 중 README 방식(`export CODYSSEY_API_KEY='키'`)으로 키를 직접 입력했다면 셸 기록에 키가 남았을 수 있으니 강사에게 알리세요.

**10. 이해 확인**
- stdout과 stderr는 무엇인가요? (자기 말로) → *예: 프로그램이 출력을 내보내는 두 개의 통로입니다. stdout은 결과물, stderr는 오류와 진단 정보용이고, 끝을 어디에 연결하느냐에 따라 화면·파일·다른 프로그램으로 갑니다.*
- B3-2는 왜 요청 횟수를 stdout이 아니라 stderr로 출력할까요? → *초안 결과물과 섞이지 않게 하려고요. stdout만 저장하면 초안만 남습니다.*
- 이 실습에서 AI가 한 일과 사람이 한 일(해야 할 일)은? → *AI는 초안을 썼고, 사람은 초안을 diff와 비교해 확인·수정하고 실제 커밋·PR을 할지 정합니다.*

**11. 연결** 이전: [Lab 08](#lab-08) · 처음으로: [데이터의 여행](#데이터의-여행) · 이 결과를 설명하는 화면: **S2-2**(F5) · **S4-2**(마무리 빈칸 채우기) · 다시 연결: [Lab 04](#lab-04)

---

## 결과로 찾아보기

내 터미널에 나온 한 줄에서 출발해 관련 Lab과 화면을 찾습니다. (미션을 이미 해 본 학습자용)

| 내 화면에서 본 것 | 무슨 뜻인가 | Lab | 화면 | 용어 |
| --- | --- | --- | --- | --- |
| `변경 사항이 없습니다.` | 변경이 없어 AI를 부르지 않고 정상 종료 | 02 | S2-2 | `git-status` · `exit-code` |
| ` M README.md` / `M  README.md` / `MM README.md` | 변경이 작업 폴더에 / 스테이징 영역에 / 양쪽에 | 03 | S1-2 · S3-1 | `git-status` · `staging-area-git-add` |
| `git diff`는 비었는데 `git diff --cached`에 변경 | 이미 `git add`한 상태 | 03 | S1-2 | `git-diff` |
| `fatal: not a git repository` · `깃 저장소가 아닙니다` | 저장소 밖에서 Git 실행(종료 코드 128) | 04 | S2-2 | `exit-code` · `python-subprocess` |
| `returncode`, `CompletedProcess` | Python이 받은 Git 실행 결과 | 04 | S2-2 | `python-subprocess` |
| `Staged diff:` · `Unstaged diff:` | Git 문맥의 두 diff 칸 | 05 | S3-1 | `git-diff` |
| `[REDACTED EMAIL]` · `[REDACTED TOKEN]` | 보내기 전 검사가 값을 가림 | 05 | S3-1 | `data-masking` |
| `비밀 파일로 보이는 경로가…전송을 중단` | 보내기 전 검사가 전송을 멈춤(요청 0회) | 05 | S3-1 | `secret-management` · `safe-mode` |
| `\n` 이 가득한 JSON 글 | Python 데이터를 JSON 글로 바꾼 모습 | 06 | S3-2 | `json` · `serialization` |
| `확인된 API 주소와 모델이 필요합니다` | 보내기 전 설정 부족(요청 0회) | 07 | S3-2 | `environment-variable` |
| `인증 또는 권한 오류 (HTTP 401)` | 외부 API가 키·권한 문제로 거절(요청 1회) | 07 | S3-2 | `authentication-error` · `api-key` |
| `AI API 응답 오류 (HTTP 400)` | 외부 API가 요청을 거절(요청 1회) | 07 | S3-2 | `http-status-code` |
| `choices[0].message.content` | 응답 JSON에서 답 글을 꺼내는 경로 | 08 | S3-2 | `json-request-response` |
| `Title:` · `## Why` · `## What` | PR 작성 규칙(`system`)에 따른 형식 | 08 | S4-1 | `pull-request` · `prompt-design` |
| `- 실행 권장: python -m unittest …` | 프로그램이 넣은 권장 명령. 테스트 수행 아님 | 08 | S4-1 · S4-2 | `output-validation` · `post-processing` |
| `커밋 제목이 너무 길거나…` · `필수 섹션…이 없습니다` | AI 답이 형식 검사를 통과 못 함(재요청 없음) | 08 | S4-2 | `output-validation` |
| `AI API 요청 횟수: 1` | stderr로 나온 진단 정보 | 09 | S2-2 · S4-1 | `stdin-stdout` |
| `=== 검토용 초안 … ===` | 프로그램이 붙인 안내문(stdout) | 08 · 09 | S4-2 | `human-in-the-loop` |

용어 열의 ID는 기술용어사전 항목입니다(예: `/terms/git-diff`).

[b32]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/tree/be21c4994a93bc943a6783ea380c50f61aa7c45b
[src-git]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/ai_gitgen/git_collector.py
[src-prompts]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/ai_gitgen/prompts.py
[g00]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/00-project-setup.md
[g01]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/01-git-basics-and-diff.md
[g02]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/02-python-ai-api.md
[g03]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/03-commit-generation.md
[g04]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/04-pr-generation.md
[g05]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/05-validation-and-security.md
[g07]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/docs/learning/07-end-to-end-walkthrough.md
