# Scene 01 원고 — 터미널에 입력한 한 줄을 컴퓨터는 어떻게 알아들을까?

> **상태:** 시안 · GPT 독립 콘텐츠 검토와 Owner 승인 전. 기준: [시나리오 v2](../scenario-v2.md) · 2026-10-22
> **그림:** [노트북용](cli-command-desktop.svg) · [휴대전화용](cli-command-mobile.svg) · 설계는 [design-notes.md](design-notes.md)

| 항목 | 내용 |
| --- | --- |
| 학습 질문 | **CLI 명령어에서 Python이 처리하는 부분과 프로그램이 처리하는 부분은 어떻게 다를까?** |
| 도달 기준 | 자기 실행 명령 한 줄을 ① 터미널·운영체제 ② Python 인터프리터 ③ 내 프로그램의 몫으로 나누고, 프로그램 부분이 어떤 과정을 거쳐 코드에서 쓰는 값이 되는지 말로 설명할 수 있다 |
| 선수 개념 | 터미널에서 명령을 실행해 본 경험. 함수 문법은 몰라도 된다 |
| 다음 장면으로 넘김 | `__init__.py`·`__main__.py`의 내부 동작, import 추적, 클래스 구조(Scene 02 이후) |
| 근거 표기 | `[확정 사실]` 공식 문서 + 실행 확인 · `[단순화]` · `[구현 사례]` `ledger` · `[요구 추적]` — [시나리오 v2 §5.3](../scenario-v2.md) |

---

## 학습자 원고

### 1. 버튼 대신 문장으로 일을 시킨다면

**GUI(Graphical User Interface)**는 화면의 버튼·메뉴처럼 눈에 보이는 요소를 눌러 프로그램을 조작하는 방식입니다. **CLI(Command-Line Interface)**는 터미널에 **문자로 된 명령**을 입력해 조작하는 방식입니다. Interface는 사람과 프로그램이 만나는 접점입니다. `[확정 사실]`

GUI의 '목록 보기' 버튼과 CLI의 `list` 명령은 같은 기능을 요청하는 서로 다른 방법일 수 있습니다. CLI는 명령의 형식이 정해져 있어 반복 실행과 자동화에 유리하지만, 정확한 명령 형식을 알아야 합니다.

### 2. 한 줄을 영역별로 나눠 읽기

이 장면에서는 설명용 **가상 패키지 `todo`**(할 일 목록 프로그램)를 예로 씁니다. 실제 미션 구현은 6절에서 따로 봅니다.

```bash
python -m todo list --limit 5
```

| 낱말 | 이름 | 누가 해석하나 |
| --- | --- | --- |
| `python` | 실행할 프로그램(Python 인터프리터) | **터미널·운영체제**가 찾아 실행 |
| `-m` | Python 옵션: 뒤에 오는 이름의 모듈을 실행 | **Python 인터프리터** |
| `todo` | 패키지 이름(`-m`의 값) | **Python 인터프리터**가 실행 대상으로 찾음 |
| `list` | 하위 명령(sub-command): 프로그램의 기능 하나를 고름 | **내 프로그램**(argparse) |
| `--limit` | 긴 옵션: 결과 개수를 정함 | **내 프로그램**(argparse) |
| `5` | 옵션 값: `--limit`에 넘기는 실제 값 | **내 프로그램**(argparse) |

핵심은 **`-m todo`까지가 Python의 몫이고, 그 뒤의 낱말은 모두 프로그램에 그대로 전달된다**는 것입니다. Python 공식 문서는 `-m` 같은 옵션이 인터프리터가 처리하는 옵션 목록을 끝내고, 이어지는 낱말은 모두 `sys.argv`로 간다고 설명합니다. `[확정 사실]`

> **단순화** · "터미널이 한 줄을 낱말로 나눈다"는 설명은 줄인 표현입니다. 따옴표·공백을 처리하는 규칙은 셸과 운영체제마다 다릅니다. `[단순화]`

### 3. 옵션의 두 가지 모양 — `-h`와 `--help`

CLI에는 오래된 관례가 있습니다. **짧은 옵션**은 하이픈 하나와 한 글자(`-n`, `-h`), **긴 옵션**은 하이픈 둘과 알아보기 쉬운 이름(`--limit`, `--help`)입니다. 하나의 옵션에 두 이름을 함께 붙일 수도 있습니다. 어떤 옵션을 받을지는 **프로그램이 정합니다.** `[확정 사실]`

```bash
python -m todo list --limit 5     # 긴 옵션과 값
python -m todo list -n 5          # 같은 옵션의 짧은 이름 (todo가 -n도 등록한 경우)
python -m todo list --limit=5     # 긴 옵션은 = 로 값을 붙여 쓸 수도 있음
```

`-h`와 `--help`는 **같은 '도움말' 옵션의 짧은 이름과 긴 이름**입니다. argparse는 프로그램이 따로 적지 않아도 이 옵션을 자동으로 만듭니다. `[확정 사실]`

그런데 **같은 `-h`라도 쓰는 위치가 주인을 정합니다.**

| 입력 | 결과 | 이유 |
| --- | --- | --- |
| `python -h` | **Python 인터프리터 자체**의 도움말 | `-h`가 모듈 이름보다 앞에 있어 Python의 옵션으로 처리됨 |
| `python -m todo -h` | **todo 프로그램**의 사용법(`usage: todo [-h] {list} ...`) | `todo` 뒤의 낱말이라 프로그램에 전달됨 |

### 4. Python의 `-m`과 `python -m 패키지명`

`-m`은 **Python 인터프리터의 옵션**입니다. "뒤에 적은 이름의 모듈을 찾아 실행하라"는 뜻이고, 파일 경로가 아니라 **모듈 이름**을 받으므로 `.py`를 붙이지 않습니다. 이름이 패키지라면 Python은 그 패키지의 실행용 모듈(`__main__`)을 실행합니다. `[확정 사실]`

- `-m`은 **argparse가 처리하는 프로그램 옵션이 아닙니다.** 프로그램의 argparse는 `-m`을 보지도 못합니다. 프로그램이 받는 낱말 목록(`sys.argv`)에는 `todo` 뒤의 낱말만 들어 있기 때문입니다. `[확정 사실]`
- 비교: `python main.py list`는 **파일을 직접 실행**하는 방식이고, `python -m todo list`는 **이름으로 모듈·패키지를 찾아 실행**하는 방식입니다. 두 방식 모두 뒤의 `list`는 프로그램 몫입니다.
- 패키지 안의 어떤 파일이 어떤 순서로 실행되는지는 **Scene 02**에서 봅니다.

### 5. argparse = Argument + Parsing

**Argument**(인자, 프로그램에 넘기는 값)와 **Parsing**(정해진 규칙에 따라 구조를 분석하는 일)을 합친 이름이 **argparse**입니다. Python 표준 라이브러리에 들어 있습니다. 공식 문서의 설명: 프로그램이 어떤 인자가 필요한지 정의하면, argparse가 `sys.argv`에서 그것을 해석하고, 도움말·사용법을 자동으로 만들며, 잘못된 인자에는 오류를 냅니다. `[확정 사실]`

argparse를 쓰는 코드는 **규칙을 먼저 정하고, 실행할 때 입력을 해석합니다.**

| 단계 | 코드 | 하는 일 |
| --- | --- | --- |
| 규칙 정하기 | `parser = argparse.ArgumentParser(prog="todo")` | 해석기(parser)를 만든다. `-h`·`--help`가 자동으로 추가된다 |
| | `sub = parser.add_subparsers(dest="command")` → `sub.add_parser("list")` | 하위 명령 묶음을 만들고 `list` 하위 명령을 등록한다 |
| | `p_list.add_argument("-n", "--limit", type=int, default=10)` | `list`가 받을 옵션·값의 규칙을 등록한다(이름, 값의 형, 기본값) |
| 입력 해석하기 | `args = parser.parse_args()` | 실제 입력(기본값: `sys.argv`)을 규칙과 맞춰 해석하고, 이름이 붙은 값 묶음(Namespace)을 돌려준다 |

`add_argument()`가 **실행할 때마다 입력을 읽는 것은 아닙니다.** 규칙을 등록할 뿐이고, 입력을 읽는 일은 `parse_args()`가 합니다. 그림에서 둘 사이를 화살표가 아닌 **점선(규칙 참고)**으로 이은 이유입니다.

### 6. 한 줄이 프로그램이 쓰는 값이 되기까지

`python -m todo list --limit 5`를 실제로 실행해 확인한 과정입니다(Python 3.14.6). `[확정 사실]`

1. **낱말로 나누기** — 터미널이 한 줄을 낱말로 나눠 `python`을 실행합니다. `[단순화]`
2. **`-m` 처리** — Python이 `-m todo`를 보고 `todo` 패키지를 찾아 실행을 시작합니다.
3. **`sys.argv`에 담기** — 남은 낱말이 **문자열 목록**으로 프로그램에 전달됩니다.
   `['…/todo/__main__.py', 'list', '--limit', '5']` (첫 칸은 실행된 모듈 파일의 경로)
4. **`parse_args()`로 해석** — 규칙과 맞춰 이름이 붙은 값으로 바꿉니다. 문자열 `'5'`는 `type=int` 규칙에 따라 정수 `5`가 됩니다.
   `Namespace(command='list', limit=5)`
5. **값 사용** — 프로그램이 `args.limit`으로 값을 꺼내 기능을 실행할 함수를 부릅니다. 예: `show_tasks(args.limit)`가 할 일 5개를 출력합니다.

강사용 시연 패키지(아래 '강사용 안내')는 ③·④를 화면에 찍고 ⑤에서 `show_tasks()`를 호출하므로, 실행 결과를 이 다섯 단계와 그대로 대조할 수 있습니다.

규칙에 맞지 않는 입력은 4단계에서 멈춥니다.

```text
$ python -m todo list --limit five
usage: todo list [-h] [-n LIMIT]
todo list: error: argument -n/--limit: invalid int value: 'five'
```

종료 코드는 2입니다. argparse는 **형식**(필수 여부, `type=` 변환, 정해진 선택지)을 검사합니다. "5보다 커야 한다" 같은 **업무 규칙**은 프로그램이 따로 검사해야 합니다(Scene 07). `[확정 사실]`

### 7. 명령줄 인자와 함수 인자는 무엇이 같고 다를까?

5단계의 `show_tasks(args.limit)`에도 '인자'가 있습니다. 둘을 비교해 봅시다.

| | 명령줄 인자 | 함수 호출의 인자 |
| --- | --- | --- |
| 공통점 | **받는 쪽이 미리 정한 자리에 값을 넘긴다**(argparse의 `add_argument`, 함수의 매개변수) | 같음 |
| 도착하는 모양 | 모두 **문자열** 낱말(`'5'`) | 넘긴 **Python 값 그대로**(`5`) |
| 자리를 맞추는 방법 | 순서(하위 명령 위치) + 옵션 이름(`--limit`) | 순서(위치 인자) + 매개변수 이름(키워드 인자) |
| 해석·변환 | argparse가 규칙대로 해석하고 `type=`이 있으면 형을 바꾼다 | 형을 자동으로 바꾸지 않는다. Type Hint(`limit: int`)도 실행 중 값을 바꾸거나 막지 않는다 |
| 잘못 넣으면 | argparse가 사용법과 함께 종료(코드 2) | 함수 안의 코드가 오류를 내거나 그대로 실행된다 |

함수에서 **받는 자리**를 Parameter(매개변수), **실제로 넣은 값**을 Argument(인자)라고 부릅니다. 자세한 내용은 Scene 07에서 다룹니다. `[확정 사실]`

### 8. 실제 미션 구현 사례 — `ledger` `[구현 사례]`

> `m03-pocket-money-ledger` `d14e812`에서 확인한 **한 가지 구현**입니다. 모든 교육생의 프로젝트가 이렇게 생겼다는 뜻이 아닙니다.

```bash
python -m ledger --data-dir ./mydata list --limit 5
```

| 낱말 | 이 구현에서의 뜻 |
| --- | --- |
| `python` · `-m ledger` | Python이 `ledger` 패키지를 실행 |
| `--data-dir ./mydata` | 하위 명령 **앞**에 오는 전역 옵션(최상위 parser에 등록). 데이터 폴더를 정함 |
| `list` · `--limit 5` | `list` 하위 명령과 그 옵션(`type=int`, 기본값 10) |

- `ledger/cli.py`의 `build_parser()`가 `ArgumentParser(prog="ledger")`, `add_subparsers(dest="command", required=True)`, 하위 명령 10개를 등록합니다. `budget set`처럼 하위 명령 안에 하위 명령이 한 번 더 있는 경우도 있습니다.
- 이 구현은 **짧은 옵션을 따로 만들지 않았습니다**(argparse가 자동으로 만드는 `-h`만 있음). 설계 기록(§7)에 따르면 의도적인 선택입니다.
- `main(argv)` 함수가 `parser.parse_args(argv)`를 부르고, `ledger/__main__.py`가 `main(sys.argv[1:])`에 낱말 목록을 넘깁니다. 즉 `sys.argv`를 **직접 넘기는** 방식입니다(테스트하기 쉽게 하려는 설계).

> **미션 요구 확인 필요** `[요구 추적]` · M03 설계 기록에는 공식 원문의 "옵션 표기는 `-`로 통일" 문구와 `--limit` 같은 이중 하이픈 예시가 함께 남아 있고, 공식 권장 실행형은 `python -m budget_app <command> [options]`로 기록되어 있습니다. 이 장면은 CLI 관례와 argparse 동작을 일반 개념으로 설명하며, 공식 문구의 해석은 원문 확인 전까지 단정하지 않습니다.

### 9. 내 코드에서 찾아보기 (5분 안팎)

1. **내 실행 명령 한 줄을 적습니다.** README나 실행 기록에서 찾습니다.
2. **세 영역으로 나눕니다.** 터미널·운영체제(`python`) / Python(`-m 이름` 또는 `파일.py`) / 내 프로그램(그 뒤 전부).
3. **프로그램 부분을 해석하는 코드를 찾습니다.** 검색어: `argparse`, `ArgumentParser`, `add_argument`, `parse_args`, `sys.argv`.
4. **옵션 하나를 골라** 그 옵션을 등록한 줄(`add_argument`)과 값을 꺼내 쓰는 줄(`args.이름`)을 짝지어 봅니다.

**내 구현이 다르다면** — 아래처럼 바꿔 읽으면 같은 질문에 답할 수 있습니다.

| 내 코드의 모습 | 이렇게 해석합니다 |
| --- | --- |
| `python main.py …`로 실행한다 | `main.py`가 Python이 실행할 파일입니다. `main.py` 뒤의 낱말이 프로그램 몫입니다 |
| `sys.argv[1]` 등을 직접 꺼내 `if`로 나눈다 | argparse 없이 **직접 Parsing**한 것입니다. 규칙(어떤 낱말을 받는지)과 해석이 한 곳에 섞여 있는지 확인합니다 |
| 실행한 뒤 `input()`으로 메뉴를 고른다 | 명령줄 인자 대신 **실행 중 입력**을 받는 대화형 CLI입니다. 명령줄 부분은 `python …` 실행 명령뿐입니다 |
| `click`·`typer` 같은 외부 라이브러리를 쓴다 | 규칙을 정하고(데코레이터 등) 입력을 해석한다는 원리는 같습니다. 미션의 라이브러리 사용 조건은 과제 원문으로 확인합니다(M03 추적표에는 '표준 라이브러리만 사용'이 요구로 기록됨 `[요구 추적]`) |

### 10. 한 문장 정리

> 명령줄 한 줄에도 **실행하는 쪽(터미널·Python)**과 **일을 해석하는 쪽(내 프로그램)**의 몫이 나뉘어 있고, 프로그램 몫의 낱말은 문자열로 도착해 argparse가 규칙대로 해석한 뒤에야 코드에서 쓰는 값이 됩니다.

---

## 강사용 안내

> 대면 강의는 우리 교육 모델의 **필수 초기 단계**(운영 선택)이며 코디세이 공식 규정이 아닙니다. 시간 배분은 시범 운영 후 확정합니다.

**권장 진행 순서**

1. **질문 던지기** — "이 한 줄을 누가 읽을까요?" 그림 A의 명령줄만 먼저 보여 주고 학습자에게 영역을 나눠 보게 합니다.
2. **그림 A** — 토큰 6개 → 괄호 3개(색·테두리 모양·이름표)를 순서대로 짚습니다. 핵심 문장: "`-m todo`까지가 Python의 몫".
3. **실제 시연** (가상 패키지 `todo`를 미리 준비. 코드는 아래)
   - `python -h`와 `python -m todo -h`를 연달아 실행 → 같은 `-h`, 다른 주인.
   - `python -m todo list --limit 5`와 `-n 5` → 같은 결과.
   - `python -m todo list --limit five` → argparse 오류와 종료 코드 2.
4. **그림 B ①~⑤** — 화살표 번호가 실제 처리 순서임을 강조합니다. ③에서 "모두 문자열", ④에서 "규칙대로 정수로 바뀜"을 짚습니다.
5. **그림 C** — 규칙 정하기와 해석하기 사이가 **점선**인 이유(순서가 아니라 참고)를 설명합니다.
6. **그림 D 비교 카드** — 학습자가 말로 설명하게 합니다(아래 확인 질문 2·4).
7. **`ledger` 사례** — 구현 사례임을 먼저 말하고, 전역 옵션 `--data-dir`의 위치만 짚습니다.
8. **내 코드에서 찾아보기** — 동의한 교육생 한 명의 명령을 함께 나눠 보는 것으로 시연합니다.

**시연용 가상 패키지 `todo`**

그림 B의 ③·④·⑤를 실제 출력으로 보여 주도록 만든 시연용 패키지입니다. 실습 폴더 안에 아래 구조로 두고, **`todo` 폴더가 들어 있는 폴더에서** 실행합니다(`-m`은 현재 폴더에서 패키지를 찾습니다).

```text
실습 폴더/
└── todo/
    ├── __init__.py    # 실행 코드 없음(설명 문자열 한 줄)
    └── __main__.py    # 아래 코드
```

`todo/__init__.py` — 패키지임을 나타내는 파일입니다. 이 장면에서는 실행 코드를 넣지 않습니다(완전히 빈 파일이어도 같습니다). 이 파일이 `__main__.py`보다 먼저 실행된다는 사실은 **Scene 02**에서 출력문을 넣은 변형으로 확인합니다([시나리오 v2 §6](../scenario-v2.md)).

```python
"""할 일 목록 시연용 가상 패키지(실행 코드 없음)."""
```

`todo/__main__.py` — `python -m todo`로 실행할 때 동작하는 코드입니다.

```python
import argparse
import sys

TASKS = ["장보기", "과제 제출", "운동", "책 반납", "방 청소", "이메일 답장"]


def show_tasks(limit):
    """⑤ 해석된 값을 받아 실제 기능을 실행하는 함수."""
    for task in TASKS[:limit]:
        print("-", task)


parser = argparse.ArgumentParser(prog="todo", description="할 일 목록")
sub = parser.add_subparsers(dest="command", required=True)
p_list = sub.add_parser("list", help="할 일 보기")
p_list.add_argument("-n", "--limit", type=int, default=10, help="보여 줄 개수")

print("③ sys.argv =", sys.argv, flush=True)   # 시연 확인용 출력
args = parser.parse_args()
print("④ parse_args() =", args)                # 시연 확인용 출력

if args.command == "list":
    show_tasks(args.limit)                       # ⑤ 값 사용: 함수 호출
```

- `print("③ …")`와 `print("④ …")`는 그림의 단계를 눈으로 대조하기 위한 **시연 확인용 출력**입니다. 실제 프로그램에는 보통 넣지 않습니다. ③의 `flush=True`는 오류가 날 때도 ③ 줄이 오류 메시지보다 먼저 보이게 합니다.
- `show_tasks(args.limit)`가 그림 ⑤의 **값 사용(함수 호출)**입니다. 프로그램의 실제 기능은 이 함수가 합니다.

**실행 명령과 출력** (Python 3.14.6에서 확인. `sys.argv` 첫 칸의 경로는 컴퓨터마다 다릅니다)

```text
$ python -m todo list --limit 5
③ sys.argv = ['…/todo/__main__.py', 'list', '--limit', '5']
④ parse_args() = Namespace(command='list', limit=5)
- 장보기
- 과제 제출
- 운동
- 책 반납
- 방 청소

$ python -m todo list -n 5          # ③만 ['…', 'list', '-n', '5']로 다르고 ④·⑤는 같음
$ python -m todo list               # ④ limit=10(기본값), 할 일 6개 모두 출력

$ python -m todo list --limit five
③ sys.argv = ['…/todo/__main__.py', 'list', '--limit', 'five']
usage: todo list [-h] [-n LIMIT]
todo list: error: argument -n/--limit: invalid int value: 'five'
                                     # ④에서 멈춤 · ⑤는 실행되지 않음 · 종료 코드 2

$ python -m todo -h                  # ③ 다음에 todo의 사용법 출력, ④ 전에 종료(종료 코드 0)
$ python -h                          # todo가 실행되지 않음 · Python 자체의 도움말
```


**흔한 오해와 교정**

| 학습자의 말 | 교정 |
| --- | --- |
| "`-m`도 `--limit`처럼 내 프로그램 옵션이죠?" | `-m`은 Python의 옵션입니다. 프로그램의 `sys.argv`에는 `todo` 뒤만 들어 있습니다(시연 3) |
| "`-h`와 `--help`는 다른 기능이죠?" | 같은 옵션의 두 이름입니다. 다만 위치에 따라 Python 도움말인지 프로그램 도움말인지가 달라집니다 |
| "`add_argument()`가 입력을 읽어요" | 규칙을 등록할 뿐입니다. 입력은 `parse_args()`가 읽습니다 |
| "`5`는 처음부터 숫자예요" | 명령줄의 모든 낱말은 문자열입니다. `type=int` 규칙이 정수로 바꿉니다 |
| "argparse가 잘못된 금액도 막아 줘요" | 형식만 검사합니다. 업무 규칙은 프로그램이 검사합니다(Scene 07) |
| "다들 `python -m ledger`로 실행해야 하나요?" | `ledger`는 한 구현 사례입니다. 실행 방식은 프로젝트마다 다릅니다 |

**수준 조절** — 입문 이전 학습자는 1~4절과 그림 A·B까지만, 여유가 있으면 5·7절과 그림 C·D로 확장합니다. `Namespace`라는 이름은 "이름표가 붙은 값 묶음" 정도로 충분합니다.

## 이해 확인 질문 (점수화하지 않음)

| # | 질문 | 확인할 내용 |
| --- | --- | --- |
| 1 | `python -m todo list --limit 5`에서 Python이 해석하는 부분과 프로그램이 해석하는 부분을 나눠 보세요. | `-m todo`까지 / `list --limit 5` |
| 2 | `python -h`와 `python -m todo -h`의 결과가 다른 이유는? | 같은 옵션 이름이어도 위치가 해석 주체를 정함 |
| 3 | `--limit five`를 입력하면 어디에서, 왜 멈추나요? | `parse_args()`가 `type=int` 규칙에 맞지 않아 사용법과 함께 종료 |
| 4 | `add_argument()`와 `parse_args()`는 각각 언제, 무엇을 하나요? | 규칙 등록(코드) / 실행 시 입력 해석 |
| 5 | 명령줄 인자 `5`와 함수 호출 `show_tasks(5)`의 `5`는 무엇이 다른가요? | 문자열로 도착해 변환 필요 / Python 값 그대로 |
| 6 | 내 프로그램의 실행 명령에서 프로그램 몫의 낱말을 해석하는 코드는 어디에 있나요? | 자기 코드의 위치(대체 구조 포함) |

## 근거와 출처

| 내용 | 분류 | 출처 |
| --- | --- | --- |
| `-m`: 표준 import 방식으로 모듈을 찾아 `__main__`으로 실행, 패키지면 `<pkg>.__main__` 실행, `.py`를 붙이지 않음, `sys.argv[0]`은 모듈 파일 경로 | 확정 사실 | [Python 명령줄과 환경 — `-m`](https://docs.python.org/3/using/cmdline.html#cmdoption-m) |
| 인터프리터 옵션 목록은 `-m`(interface option)에서 끝나고 이어지는 인자는 `sys.argv`로 감 | 확정 사실 | 같은 문서 'Interface options' |
| `python -h`는 인터프리터 도움말, `python -m timeit -h`는 모듈 쪽으로 전달 | 확정 사실 | 같은 문서 'Generic options', 실행 확인 |
| argparse의 목적, `ArgumentParser`, `add_argument()`(짧은·긴 옵션), `add_subparsers()`/`add_parser()`, `parse_args()`(기본 입력 `sys.argv`, Namespace 반환), `add_help`(`-h`/`--help`), `type=` 변환과 잘못된 값의 오류, 오류 시 종료 코드 2 | 확정 사실 | [argparse](https://docs.python.org/3/library/argparse.html) |
| `__main__.py`는 `python -m 패키지`로 실행될 때 실행됨 | 확정 사실(Scene 02에서 상세) | [`__main__`](https://docs.python.org/3/library/__main__.html) |
| Parameter·Argument 용어 | 확정 사실 | [Python 용어집](https://docs.python.org/3/glossary.html) |
| Type Hint는 런타임에 강제되지 않음 | 확정 사실 | [typing](https://docs.python.org/3/library/typing.html) |
| `sys.argv`·Namespace 출력, `show_tasks()` 출력, `-n 5`·`--limit=5`·기본값 동작, `--limit five` 오류·종료 코드 2(⑤ 미실행), `python -h`/`python -m todo -h` 차이 | 확정 사실(실행 확인) | 강사용 안내의 시연 패키지 `todo`를 그대로 실행, Python 3.14.6, Windows, 2026-10-22(독립 검토 보완 때 재실행) |
| 터미널이 한 줄을 낱말로 나눔 | 단순화 | 셸·운영체제별 규칙 차이 |
| `ledger`의 parser 구성·전역 옵션·짧은 옵션 미도입·`main(argv)` | 구현 사례 | `m03-pocket-money-ledger` `d14e812`: `ledger/cli.py`, `ledger/__main__.py`, `docs/m03-architecture-design.md` §2·§7·§45 |
| 옵션 표기 문구, `budget_app` 권장 실행형, 표준 라이브러리만 사용 | 요구 추적 | M03 설계 §2·§7·§27(코디세이 원문 독립 대조 전) |
