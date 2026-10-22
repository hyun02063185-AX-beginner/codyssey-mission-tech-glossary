# Scene 02 원고 — 내 Python 프로그램은 어디에서 시작하고, 파일들은 어떻게 연결될까?

> **상태:** 시안 · GPT 독립 콘텐츠 검토와 Owner 승인 전. 기준: [시나리오 v2](../scenario-v2.md) · 2026-10-22
> **그림:** [노트북용](package-flow-desktop.svg) · [휴대전화용](package-flow-mobile.svg) · 설계는 [design-notes.md](design-notes.md) · 데모 코드 `_tools/demo/`

| 항목 | 내용 |
| --- | --- |
| 학습 질문 | **`python -m 패키지명`을 실행하면 어느 파일에서 시작하고, 다른 파일과는 어떻게 이어질까?** |
| 도달 기준 | 자기 프로그램의 **시작 파일**을 찾고, ① `import` 줄로 **연결된 파일**을 찾는 것과 ② 진입점에서 **실제로 호출되는 함수**를 따라가는 것을 구별해, 확인한 연결 하나를 자기 말로 설명할 수 있다 |
| Scene 01과의 관계 | Scene 01은 명령 한 줄을 해석했다(② "-m 처리"에서 "파일 구조는 Scene 02"로 넘김). 이 장면은 그 명령을 실행했을 때 **소스코드 안에서** 무엇이 일어나는지 본다 |
| 다음 장면으로 넘김 | 클래스·객체와 계층별 책임(Scene 03), Decorator가 함수를 감싸는 원리(Scene 06). 고급 패키징·배포(설치, `pyproject.toml`, 상대 import 세부)는 다루지 않는다 |
| 근거 표기 | `[확정 사실]` 공식 문서 + 실행 확인 · `[단순화]` · `[구현 사례]` `ledger` · `[학습용 변형]` 이 장면을 위해 바꾼 예시 — [시나리오 v2 §5.3](../scenario-v2.md) |

---

## 학습자 원고

### 1. 왜 프로그램을 여러 파일로 나눌까?

처음에는 파일 하나에 모든 코드를 써도 됩니다. 기능이 늘면 한 파일이 길어져 원하는 부분을 찾기 어렵고, 한 곳을 고치다가 다른 기능을 망가뜨리기 쉽습니다. 그래서 **역할별로 파일을 나눕니다**. 명령을 해석하는 파일, 기능을 실행하는 파일처럼 나누면 읽을 곳과 고칠 곳이 좁아지고, 같은 기능을 여러 곳에서 다시 쓸 수 있습니다. `[단순화]`

- **모듈(Module)** — Python 정의와 문장이 들어 있는 **`.py` 파일 하나**입니다. 파일 이름에서 `.py`를 뺀 것이 모듈 이름입니다(`cli.py` → `cli`). `[확정 사실]`
- **패키지(Package)** — 관련 모듈을 **폴더 하나로 묶은 것**입니다. 패키지 안의 모듈은 `todo.cli`처럼 **점(.)으로 이어 부릅니다**. `[확정 사실]`
- `.py` 파일은 코드가 들어 있는 모듈이고, 패키지 폴더는 그런 모듈을 담는 묶음입니다. 폴더 자체에는 코드가 없고, 패키지의 코드는 그 안의 `.py` 파일들에 있습니다.

### 2. 이 장면의 예시 — `todo` 패키지 (Scene 02 학습용 변형) `[학습용 변형]`

Scene 01의 가상 패키지 `todo`를 이어 씁니다. 기능(`list --limit`)은 같고, 여러 파일이 연결되는 모습을 보이도록 **`cli.py`·`actions.py`로 나누고 학습용 출력을 넣었습니다.** 그래서 출력이 Scene 01과 다릅니다.

```text
실습 폴더/                  ← 여기서 명령을 실행합니다
├── main.py                 ← 비교용: python main.py 로 직접 실행하는 파일
├── todo/                   ← 패키지
│   ├── __init__.py         ← 패키지 초기화
│   ├── __main__.py         ← python -m todo 의 실행 진입점
│   ├── cli.py              ← 모듈: 명령줄 입력 해석
│   └── actions.py          ← 모듈: 할 일 기능
└── notes/                  ← Namespace Package 예외 확인용(4절)
    └── hello.py
```

**학습용 출력 읽는 법** — 각 파일 맨 위의 `print("[불러올 때] …")`는 **그 파일의 최상위 코드가 실행되기 시작한 순간**을, 함수 안의 `print("[호출될 때] …")`는 **그 함수가 호출된 순간**을 보여 줍니다. 실행 시점을 보이려고 일부러 `import` 줄보다 위에 두었습니다. **실제 프로그램에는 이런 출력을 넣지 않고, `import`는 보통 파일 맨 위에 씁니다.**

<!-- demo:todo/__init__.py -->
```python
"""할 일 목록 시연용 가상 패키지 (Scene 02 학습용 변형)."""
print(f"[불러올 때] todo/__init__.py — 패키지 초기화, __name__ = {__name__!r}")  # 학습용 출력
```

<!-- demo:todo/__main__.py -->
```python
"""python -m todo 로 실행할 때의 실행 진입점."""
print(f"[불러올 때] todo/__main__.py — 실행 진입점, __name__ = {__name__!r}")  # 학습용 출력

import sys
from todo.cli import main

sys.exit(main())
```

<!-- demo:todo/cli.py -->
```python
"""명령줄 입력을 해석해 알맞은 기능을 부르는 모듈."""
print(f"[불러올 때] todo/cli.py — __name__ = {__name__!r}")  # 학습용 출력

import argparse
import todo.actions


def build_parser():
    print("[호출될 때] cli.build_parser()")  # 학습용 출력
    parser = argparse.ArgumentParser(prog="todo", description="할 일 목록")
    sub = parser.add_subparsers(dest="command", required=True)
    p_list = sub.add_parser("list", help="할 일 보기")
    p_list.add_argument("-n", "--limit", type=int, default=10, help="보여 줄 개수")
    return parser


def main():
    print("[호출될 때] cli.main()")  # 학습용 출력
    args = build_parser().parse_args()
    if args.command == "list":
        todo.actions.show_tasks(args.limit)
    return 0


if __name__ == "__main__":
    main()
```

<!-- demo:todo/actions.py -->
```python
"""할 일 기능을 모아 둔 모듈."""
print(f"[불러올 때] todo/actions.py — __name__ = {__name__!r}")  # 학습용 출력

TASKS = ["장보기", "과제 제출", "운동", "책 반납", "방 청소", "이메일 답장"]


def show_tasks(limit):
    print(f"[호출될 때] actions.show_tasks({limit})")  # 학습용 출력
    for task in TASKS[:limit]:
        print("-", task)
```

<!-- demo:main.py -->
```python
"""비교용 진입 파일: python main.py 로 실행한다 (Scene 02 학습용 변형)."""
print(f"[불러올 때] main.py — __name__ = {__name__!r}")  # 학습용 출력

import sys
from todo.cli import main

if __name__ == "__main__":
    sys.exit(main())
```

### 3. 실행하면 어떤 순서로 무엇이 일어날까? (그림 A)

**실습 폴더에서** 실행합니다. 결과는 Python 3.14.6에서 실제로 확인한 출력입니다. `[확정 사실]`

<!-- run: python -m todo list --limit 3 | exit=0 -->
```text
$ python -m todo list --limit 3
[불러올 때] todo/__init__.py — 패키지 초기화, __name__ = 'todo'
[불러올 때] todo/__main__.py — 실행 진입점, __name__ = '__main__'
[불러올 때] todo/cli.py — __name__ = 'todo.cli'
[불러올 때] todo/actions.py — __name__ = 'todo.actions'
[호출될 때] cli.main()
[호출될 때] cli.build_parser()
[호출될 때] actions.show_tasks(3)
- 장보기
- 과제 제출
- 운동
```

| 순서 | 일어난 일 | 이유 |
| --- | --- | --- |
| ① | `todo/__init__.py` 실행 | `-m todo`로 패키지를 실행하면 Python은 **먼저 `todo` 패키지를 불러오고**(이때 `__init__.py`가 실행됨), 그다음 패키지 안의 `__main__` 모듈을 실행합니다 |
| ② | `todo/__main__.py` 실행 | 패키지를 `-m`으로 실행할 때의 **실행 진입점**입니다. 이 파일의 `__name__`은 `'__main__'`입니다 |
| ③ | `todo/cli.py` 실행 | ②의 `from todo.cli import main` 줄이 `cli` 모듈을 **처음 불러오면서** 그 최상위 코드가 실행됩니다 |
| ④ | `todo/actions.py` 실행 | ③의 `import todo.actions` 줄 때문입니다. 이때까지 **함수는 하나도 호출되지 않았습니다** |
| ⑤ | `cli.main()` 호출 | ②로 돌아와 다음 줄 `sys.exit(main())`이 `main()`을 호출합니다 |
| ⑥ | `cli.build_parser()` 호출 | `main()` 본문이 호출합니다(규칙 만들기 · Scene 01) |
| ⑦ | `parser.parse_args()` 호출 | `main()` 본문이 호출합니다. argparse 함수라 학습용 출력은 없습니다 |
| ⑧ | `actions.show_tasks(3)` 호출 | `main()` 본문이 호출해 할 일 3개를 출력합니다 |

**①~④는 '불러올 때', ⑤~⑧은 '호출될 때'입니다.** 모듈을 처음 불러올 때 실행되는 것은 그 파일의 **최상위 코드**(`print`, `import`, `TASKS = …`, 그리고 `def`)입니다. `def` 문은 **함수를 만들어 이름을 붙일 뿐 함수 본문을 실행하지 않습니다.** 함수 본문은 그 함수가 **호출될 때** 실행됩니다. `[확정 사실]`

### 4. `__init__.py`는 무슨 일을 할까?

- 일반 패키지(regular package)는 **`__init__.py`가 들어 있는 폴더**입니다. 패키지를 **처음 불러올 때 `__init__.py`가 실행**됩니다. 비어 있어도 되고, 패키지에 필요한 초기화 코드를 넣을 수도 있습니다. Scene 01의 시연 패키지는 실행 코드 없이 설명 한 줄만 두었고, 이 장면의 변형은 실행 시점을 보이려고 출력문을 넣었습니다. `[확정 사실]`
- **예외 — Namespace Package:** `__init__.py`가 없는 폴더도 패키지로 import될 수 있습니다. 여러 위치의 부분을 하나로 합치는 고급 기능이라 입문 단계에서는 "예외가 있다"는 것만 알아 둡니다. `[확정 사실]`

<!-- demo:notes/hello.py -->
```python
"""Namespace Package 예외 확인용: notes 폴더에는 __init__.py가 없다."""
print(f"[불러올 때] notes/hello.py — __name__ = {__name__!r}")  # 학습용 출력
```

<!-- run: python -c "import notes.hello" | exit=0 -->
```text
$ python -c "import notes.hello"
[불러올 때] notes/hello.py — __name__ = 'notes.hello'
```

<!-- run: python -m notes | exit=1 -->
```text
$ python -m notes
python: No module named notes.__main__; 'notes' is a package and cannot be directly executed
```

`notes`에는 `__main__.py`가 없어 `-m`으로 실행할 수 없습니다. **`-m`으로 실행하려는 패키지에는 `__main__.py`가 필요합니다.** (`__init__.py`가 있는 일반 패키지도 `__main__.py`가 없으면 같은 오류가 납니다.)

**`__init__.py`와 클래스의 `__init__()`은 다릅니다.** 앞은 패키지 폴더 안의 **파일**로 패키지를 처음 불러올 때 한 번 실행됩니다. 뒤는 클래스 안의 **메서드**로 객체를 만들 때마다 실행됩니다(예: `Task("장보기")`). 이름만 비슷합니다. 클래스는 Scene 03에서 다룹니다. `[확정 사실]`

### 5. `python main.py`와 `python -m todo`는 무엇이 다를까?

| | `python main.py …` | `python -m todo …` |
| --- | --- | --- |
| 무엇을 실행하나 | 지정한 **파일**을 직접 실행 | Python이 `todo`라는 **이름의 패키지(또는 모듈)를 찾아** 실행 |
| 시작 파일 | `main.py` | 패키지면 `todo/__main__.py`(그 전에 `todo/__init__.py`) |
| 모듈을 찾는 첫 위치 | 실행한 **파일이 있는 폴더** | 명령을 실행한 **현재 폴더** |

<!-- run: python main.py list --limit 3 | exit=0 -->
```text
$ python main.py list --limit 3
[불러올 때] main.py — __name__ = '__main__'
[불러올 때] todo/__init__.py — 패키지 초기화, __name__ = 'todo'
[불러올 때] todo/cli.py — __name__ = 'todo.cli'
[불러올 때] todo/actions.py — __name__ = 'todo.actions'
[호출될 때] cli.main()
…
```

`main.py`가 먼저 실행되고, 그 안의 `from todo.cli import main` 줄이 `todo` 패키지를 불러올 때 `__init__.py`가 실행됩니다. `__main__.py`는 쓰이지 않습니다.

**모듈을 `-m`으로 실행하는 경우**와 **패키지를 `-m`으로 실행하는 경우**도 다릅니다.

<!-- run: python -m todo.cli list --limit 3 | exit=0 -->
```text
$ python -m todo.cli list --limit 3
[불러올 때] todo/__init__.py — 패키지 초기화, __name__ = 'todo'
[불러올 때] todo/cli.py — __name__ = '__main__'
[불러올 때] todo/actions.py — __name__ = 'todo.actions'
[호출될 때] cli.main()
…
```

`todo.cli`는 패키지가 아니라 **모듈**이므로 `cli.py`가 바로 시작 파일(`__name__ == '__main__'`)이 됩니다. 이 모듈이 들어 있는 `todo` 패키지는 먼저 불러오므로 `__init__.py`는 실행되지만, **`__main__.py`는 쓰이지 않습니다.** `cli.py`의 `main()`은 맨 아래 `if __name__ == "__main__":` 조건이 참이라 호출됩니다(6절).

**주의** — 패키지 안의 파일을 경로로 직접 실행하면 실패할 수 있습니다.

<!-- run: python todo/cli.py list --limit 3 | exit=1 -->
```text
$ python todo/cli.py list --limit 3
[불러올 때] todo/cli.py — __name__ = '__main__'
…
ModuleNotFoundError: No module named 'todo'
```

파일을 직접 실행하면 Python은 **그 파일이 있는 폴더**(`todo/`)부터 모듈을 찾으므로, 그 안에서 `todo` 패키지를 찾지 못합니다. 패키지 안의 모듈은 `python -m todo.cli`처럼 **이름으로** 실행합니다. `[확정 사실]`

### 6. `__name__`과 `if __name__ == "__main__":`

모든 모듈에는 `__name__`이라는 이름이 있습니다. **import될 때는 모듈 이름**(`'todo.cli'`)이고, **시작 파일로 실행될 때는 `'__main__'`**입니다. 3·5절 출력의 `__name__ = …`가 그 값입니다. `[확정 사실]`

`if __name__ == "__main__":`은 "**이 파일이 시작 파일로 실행될 때만** 아래 줄을 실행하라"는 **조건문**입니다.

| 구분 | `__main__.py` | `if __name__ == "__main__":` |
| --- | --- | --- |
| 무엇인가 | **파일 이름** | **조건문(문법)** |
| 어디에 | 패키지 폴더 안 | 어느 `.py` 파일에나(이 예시: `cli.py`, `main.py`) |
| 하는 일 | `python -m 패키지`의 실행 진입점 | 그 파일이 시작 파일일 때만 실행할 코드를 감쌈 |

이 예시의 `__main__.py`에는 조건문이 없습니다. `python -m todo`로 실행할 때만 쓰이는 파일이라 필요 없고, Python 문서도 `__main__.py`는 조건문 없이 짧게 쓰기를 권합니다. 반대로 `cli.py`를 **import만** 하면 조건이 거짓이라 `main()`이 호출되지 않습니다.

<!-- run: python -c "import todo.cli" | exit=0 -->
```text
$ python -c "import todo.cli"
[불러올 때] todo/__init__.py — 패키지 초기화, __name__ = 'todo'
[불러올 때] todo/cli.py — __name__ = 'todo.cli'
[불러올 때] todo/actions.py — __name__ = 'todo.actions'
```

조건문이 없는 `actions.py`를 시작 파일로 실행하면, 최상위 코드만 실행되고 아무 함수도 호출되지 않습니다.

<!-- run: python -m todo.actions | exit=0 -->
```text
$ python -m todo.actions
[불러올 때] todo/__init__.py — 패키지 초기화, __name__ = 'todo'
[불러올 때] todo/actions.py — __name__ = '__main__'
```

### 7. `import` 줄 읽기

```python
import sys                   # 표준 라이브러리 모듈 sys를 불러옴
import todo.actions          # 프로젝트 모듈 todo.actions를 불러옴 → todo.actions.show_tasks()로 씀
from todo.cli import main    # todo.cli 모듈에서 main 함수만 가져와 main 이라는 이름으로 씀
```

- **`import`의 기본 뜻** — 다른 모듈을 찾아 (처음이면) 불러오고, 지금 파일에서 그 이름을 쓸 수 있게 합니다. `[확정 사실]`
- **표준 라이브러리와 프로젝트 모듈** — `sys`, `argparse`, `json`처럼 **Python에 함께 설치된 모듈**이 표준 라이브러리입니다. `todo.cli`, `todo.actions`처럼 **내 프로젝트 폴더에 있는 파일**이 프로젝트 모듈입니다. 코드 읽기에서는 프로젝트 모듈을 따라가면 내 코드의 연결이 보입니다.
- **`import todo.actions`** — `todo` 패키지와 `todo.actions` 모듈을 불러오고, 지금 파일에는 `todo`라는 이름이 생깁니다. 그래서 `todo.actions.show_tasks(…)`처럼 **전체 이름으로** 씁니다. `[확정 사실]`
- **`from 모듈 import 이름`** — 모듈 안의 **특정 이름**만 가져옵니다. 가져오는 대상은 **함수**(`main`)일 수도, **클래스**·**변수**·**하위 모듈**일 수도 있습니다. 이때 모듈 이름(`todo.cli`) 자체는 지금 파일에 생기지 않습니다. `[확정 사실]`
- **처음 import할 때만 최상위 코드가 실행됩니다.** 같은 모듈을 다시 import해도 다시 실행되지 않습니다. `[확정 사실]`

<!-- run: python -c "import todo.cli; import todo.actions" | exit=0 -->
```text
$ python -c "import todo.cli; import todo.actions"
[불러올 때] todo/__init__.py — 패키지 초기화, __name__ = 'todo'
[불러올 때] todo/cli.py — __name__ = 'todo.cli'
[불러올 때] todo/actions.py — __name__ = 'todo.actions'
```

`import todo.actions`를 두 번째로 만났을 때(이미 `cli.py`가 불러온 뒤)는 아무것도 다시 실행되지 않았습니다.

- **import 관계만으로는 함수 호출 순서를 알 수 없습니다.** import는 파일을 **연결**할 뿐입니다. 어떤 함수가 언제 호출되는지는 진입점에서 **함수 호출을 따라가야** 알 수 있습니다(8절).

### 8. 같은 소스, 두 개의 지도 (그림 B)

| | B-1 모듈 의존 관계 (import 지도) | B-2 함수 실행 흐름 (호출 지도) |
| --- | --- | --- |
| 답하는 질문 | 이 파일은 어떤 파일을 불러 쓰는가? | 명령을 실행하면 어떤 함수가 어떤 순서로 불리는가? |
| 어디서 출발하나 | 아무 파일이나 | **실행 진입점**(`python -m 패키지`면 `__main__.py`) |
| 무엇을 따라가나 | 파일 맨 위의 `import` 줄 | 함수 본문 안의 **호출** `이름(…)` |
| 그림 표현 | 파란 **파선**·빈 화살촉, **번호 없음**. 표준 라이브러리는 회색 칩 | 진한 **실선**·채운 화살촉, **번호**(그림 A의 ⑤~⑧과 같은 번호) |
| 이 예시 | `__main__.py` → `sys`(표준), `todo.cli` / `cli.py` → `argparse`(표준), `todo.actions` | `sys.exit(main())` → ⑤ `main()` → ⑥ `build_parser()`, ⑦ `parse_args()`, ⑧ `show_tasks(3)` |

두 지도를 겹쳐 보면 차이가 드러납니다.

1. **import로 연결 ≠ 호출됨** — 도움말만 볼 때도 `actions.py`는 불러오지만 `show_tasks()`는 호출되지 않습니다.

<!-- run: python -m todo -h | exit=0 -->
```text
$ python -m todo -h
[불러올 때] todo/__init__.py — 패키지 초기화, __name__ = 'todo'
[불러올 때] todo/__main__.py — 실행 진입점, __name__ = '__main__'
[불러올 때] todo/cli.py — __name__ = 'todo.cli'
[불러올 때] todo/actions.py — __name__ = 'todo.actions'
[호출될 때] cli.main()
[호출될 때] cli.build_parser()
usage: todo [-h] {list} ...
…
```

2. **호출 지도에만 있는 것** — `build_parser()`처럼 **같은 파일 안의 호출**은 import 줄에 나타나지 않습니다.
3. **import 줄 순서 ≠ 실행 순서** — `cli.py`의 `import argparse`, `import todo.actions` 줄 순서는 함수가 불리는 순서를 알려 주지 않습니다.

### 9. 실제 미션 구현 사례 — `ledger` `[구현 사례]`

> `m03-pocket-money-ledger` `d14e812`에서 확인한 **한 가지 구현**입니다. 모든 교육생의 프로젝트가 이렇게 생겼다는 뜻이 아닙니다.

- `ledger/__init__.py`에는 설명 문자열 한 줄만 있습니다. `ledger/__main__.py`는 `from ledger.cli import main` 뒤에 `if __name__ == "__main__": sys.exit(main(sys.argv[1:]))`를 둡니다(이 구현은 조건문을 썼습니다. 써도 `python -m ledger` 실행에는 문제가 없습니다). 저장소 맨 위의 `main.py`도 같은 `main()`을 부르는 보조 진입점입니다.
- **import 지도:** `cli.py`는 `argparse`·`sys`·`pathlib`(표준)과 `ledger.decorators`·`errors`·`models`·`repository`·`services`·`validators`(프로젝트)를 import합니다. 설계 문서의 의존 방향은 `cli → services → repository`이지만, 실제 `cli.py`는 서비스를 만들 때 쓰려고 `repository`도 **직접** import합니다. 지도는 문서가 아니라 **코드의 import 줄**로 그려야 하는 이유입니다.
- **호출 지도(`list --limit 1` 실행을 추적해 확인):** `main()` → `build_parser()` → (`parse_args()`) → `_dispatch()`(Decorator의 `wrapper`를 거침, Scene 06) → `_build_service()` → `cmd_list()` → `LedgerService.list_transactions()` → `TransactionRepository.iter_all()` → `_iter_jsonl()`.
- 같은 추적에서 `handle_errors`는 `main()`보다 **먼저**, `cli.py`를 불러올 때 실행됐습니다. `@handle_errors`가 붙은 `def`가 실행될 때(불러올 때) Decorator가 적용되기 때문입니다. 자세한 내용은 Scene 06에서 봅니다.

### 10. 내 코드에서 시작점 찾기 (대면 강의 활동)

목적은 코드를 평가하는 것이 아니라 **자기 소스를 탐색하는 방법**을 익히는 것입니다. 전체 구조를 다 이해하지 못해도 괜찮습니다.

1. **실행 명령을 확인합니다.** README나 실행 기록에서 찾습니다(예: `python -m 이름 …`, `python 파일.py …`).
2. **시작 파일을 찾습니다.** `python -m 이름`이면 그 이름의 폴더 안 `__main__.py`(또는 `이름.py` 모듈), `python 파일.py`면 그 파일입니다.
3. **시작 파일의 `import` 줄을 읽습니다.** 표준 라이브러리와 내 프로젝트 모듈을 나누고, 프로젝트 모듈 하나를 골라 그 파일을 엽니다. *(모듈 의존 관계)*
4. **실제로 실행되는 함수를 찾아 따라갑니다.** 시작 파일에서 맨 처음 **호출되는** 함수(`main()` 등)를 찾아 그 함수의 정의로 이동하고, 그 안에서 다음으로 호출되는 함수 하나로 한 번 더 이동합니다. *(함수 실행 흐름)*
5. **확인한 연결 하나를 말로 설명합니다.** 예: "`__main__.py`가 `cli.py`의 `main()`을 부르고, `main()`이 `actions.py`의 `show_tasks()`를 부른다."

**내 구현이 다르다면**

| 내 코드의 모습 | 이렇게 찾습니다 |
| --- | --- |
| `__main__.py`가 없고 `python main.py`(또는 `app.py`)로 실행 | 그 파일이 시작 파일입니다. 맨 아래 `if __name__ == "__main__":` 안에서 처음 호출되는 함수가 출발점입니다 |
| 파일이 하나뿐 | import 지도는 표준 라이브러리만 보입니다. 함수 실행 흐름만 따라가면 됩니다 |
| `__init__.py`가 없는 폴더 | Namespace Package이거나 패키지가 아닌 그냥 폴더일 수 있습니다. 실행 명령과 import 줄로 판단합니다 |
| `from . import x`처럼 점으로 시작하는 import | 같은 패키지 안의 모듈을 가리키는 **상대 import**입니다. 점 하나는 '지금 패키지'라고 읽고 넘어갑니다(세부는 이 장면 범위 밖) |
| `argparse`가 없음 | 명령 해석이 다른 방식일 뿐입니다(Scene 01 대체 구조 표). 시작 파일 찾기와 두 지도 그리기는 똑같이 할 수 있습니다 |

### 11. 한 문장 정리

> 프로그램은 **시작 파일**에서 출발하고, **import 줄**은 파일을 연결하며(불러올 때 최상위 코드가 실행됨), 실제 일은 시작 파일에서 이어지는 **함수 호출**이 합니다. 파일이 연결되어 있다는 것과 그 안의 함수가 실행된다는 것은 다른 사실입니다.

---

## 강사용 안내

> 대면 강의는 우리 교육 모델의 **필수 초기 단계**(운영 선택)이며 코디세이 공식 규정이 아닙니다. 시간 배분은 시범 운영 후 확정합니다.

**준비** — `drafts/b2-1-story-map/scene-02/_tools/demo/` 폴더 전체를 실습 폴더로 복사합니다. 명령은 반드시 **그 폴더 안에서** 실행합니다.

**권장 진행 순서**

1. **질문** — "`python -m todo`라고 치면 어느 파일부터 실행될까요?" 학습자가 예상을 말하게 합니다(흔한 답: `__main__.py`, `cli.py`).
2. **그림 A 왼쪽(폴더 구조)** — 모듈 = `.py` 파일, 패키지 = 폴더. `__init__.py`·`__main__.py`의 역할.
3. **시연 1** — `python -m todo list --limit 3`. 출력의 `[불러올 때]`·`[호출될 때]`를 그림 A의 ①~⑧과 한 줄씩 짝지어 읽습니다. 핵심: "④까지 함수는 하나도 불리지 않았다."
4. **시연 2** — `python main.py list --limit 3`과 `python -m todo.cli list --limit 3`. 첫 줄이 무엇인지, `__name__ = '__main__'`이 어느 파일에 붙는지 비교합니다(그림 A 실행 방식 비교표).
5. **조건문** — `cli.py` 맨 아래를 보여 주고 `python -c "import todo.cli"`를 실행. `main()`이 불리지 않는 이유를 학습자가 말하게 합니다.
6. **그림 B** — 같은 소스에서 B-1(import 줄)과 B-2(호출)를 따로 그립니다. 판서할 때도 **import는 파선·번호 없음, 호출은 실선·번호**로 구분합니다.
7. **시연 3** — `python -m todo -h`. "actions.py는 불러왔지만 show_tasks는 안 불렸다"를 확인합니다.
8. **`ledger` 사례** — 문서의 의존 방향과 실제 import 줄이 다른 점을 짚어 "지도는 코드로 그린다"를 강조합니다.
9. **내 코드에서 시작점 찾기** — 5단계 활동. 동의한 교육생 한 명의 코드로 1~5를 함께 해 본 뒤 각자 진행합니다. 막히면 4단계에서 멈추고 5단계(설명)로 넘어가도 됩니다.

**흔한 오해와 교정**

| 학습자의 말 | 교정 |
| --- | --- |
| "`python -m todo`는 `__main__.py`부터 실행해요" | 그 전에 `todo` 패키지를 불러오므로 `__init__.py`가 먼저 실행됩니다(시연 1의 첫 줄) |
| "`if __name__ == "__main__":`이 있어야 `__main__.py`가 돼요" | 파일 이름과 조건문은 별개입니다. 이 예시의 `__main__.py`에는 조건문이 없습니다 |
| "import한 파일의 함수는 다 실행돼요" | 불러올 때는 최상위 코드만 실행됩니다. `def`는 함수를 만들 뿐입니다(시연 3) |
| "import 줄 순서대로 프로그램이 실행돼요" | import는 연결입니다. 실행 순서는 진입점부터 호출을 따라가야 압니다 |
| "`__init__.py`랑 `__init__()`은 같은 거죠?" | 파일과 메서드입니다. 실행되는 때도 다릅니다(그림 A 비교 카드) |
| "`__init__.py`가 없으면 패키지가 아니에요" | 일반 패키지는 있지만, 없는 Namespace Package라는 예외가 있습니다 |
| "패키지 안 파일도 `python todo/cli.py`로 실행하면 돼요" | 파일이 있는 폴더부터 찾으므로 `todo`를 못 찾습니다. `python -m todo.cli`로 실행합니다 |

**수준 조절** — 입문 이전 학습자는 1~3절, 그림 A, 10절 활동 1~3단계까지만. 여유가 있으면 5~8절과 그림 B, 활동 4~5단계로 확장합니다. `ledger` 사례(9절)는 질문이 있을 때만 씁니다.

## 이해 확인 질문 (점수화하지 않음)

| # | 질문 | 확인할 내용 |
| --- | --- | --- |
| 1 | 모듈과 패키지는 각각 무엇인가요? | `.py` 파일 하나 / 모듈을 묶은 폴더 |
| 2 | `python -m todo`를 실행하면 `__init__.py`와 `__main__.py` 중 무엇이 먼저 실행되나요? 왜 그런가요? | `__init__.py`. 패키지를 먼저 불러온 뒤 `__main__`을 실행 |
| 3 | `__main__.py`와 `if __name__ == "__main__":`은 어떻게 다른가요? | 파일 이름 / 조건문. 조건문은 어느 파일에나 쓸 수 있음 |
| 4 | `python -m todo -h`에서 `actions.py`는 실행됐나요? `show_tasks()`는요? | 최상위 코드는 실행(불러옴), 함수는 호출되지 않음 |
| 5 | `import todo.actions`와 `from todo.cli import main`은 지금 파일에 각각 어떤 이름을 만드나요? | `todo` / `main` |
| 6 | 내 프로그램의 시작 파일과, 그 파일에서 처음 호출되는 함수는 무엇인가요? | 자기 코드의 위치(대체 구조 포함) |

## 근거와 출처

| 내용 | 분류 | 출처 |
| --- | --- | --- |
| 모듈은 정의·문장이 든 파일, 파일 이름 = 모듈 이름 + `.py` / 패키지는 점 이름으로 모듈 이름 공간을 구조화 | 확정 사실 | [Tutorial §6, §6.4](https://docs.python.org/3/tutorial/modules.html) |
| 일반 패키지는 `__init__.py`가 있는 폴더이며 import될 때 `__init__.py`가 암시적으로 실행 / Namespace Package에는 `__init__.py`가 없음 | 확정 사실 | [Reference §5.2.1·§5.2.2](https://docs.python.org/3/reference/import.html#regular-packages) |
| `-m`에 패키지 이름을 주면 `<pkg>.__main__`을 main 모듈로 실행 / `runpy`: 패키지를 import한 뒤 `__main__` 하위 모듈을 실행 | 확정 사실 | [명령줄 `-m`](https://docs.python.org/3/using/cmdline.html#cmdoption-m), [runpy.run_module](https://docs.python.org/3/library/runpy.html#runpy.run_module) |
| 시작 파일로 실행되면 `__name__ == '__main__'`, import되면 모듈 이름 / `__main__.py`는 조건문 없이 짧게 쓰기를 권함 | 확정 사실 | [`__main__`](https://docs.python.org/3/library/__main__.html) |
| 모듈의 실행 문장은 import 문에서 그 모듈을 처음 만났을 때만 실행 / `python 파일.py`는 import한 것처럼 실행하되 `__name__`이 `"__main__"` | 확정 사실 | [Tutorial §6.1, §6.1.1](https://docs.python.org/3/tutorial/modules.html#more-on-modules) |
| `sys.path` 첫 칸: 스크립트를 실행하면 그 파일의 폴더, `-c`·`-m`이면 현재 폴더 | 확정 사실 | [sys.path 초기화](https://docs.python.org/3/library/sys_path_init.html) |
| `import`는 모듈을 찾아 (필요하면) 불러오고 이름을 정의 / `import a.b`는 `a`를 묶음 / `from … import …`는 속성 또는 하위 모듈을 가져옴 | 확정 사실 | [Reference §7.11 import](https://docs.python.org/3/reference/simple_stmts.html#the-import-statement) |
| 함수 정의는 실행 문장이며 함수 본문은 호출될 때 실행 | 확정 사실 | [Reference §8.7](https://docs.python.org/3/reference/compound_stmts.html#function-definitions) |
| 3~8절의 모든 출력과 종료 코드 | 확정 사실(실행 확인) | `_tools/demo/`, Python 3.14.6, Windows, 2026-10-22. `_tools/verify_demo.py`가 원고 코드·출력과 실제 실행을 대조 |
| 파일을 나누는 이유(읽기·고치기·재사용) | 단순화 | 일반적 설명 |
| `ledger`의 `__init__.py`·`__main__.py`·`main.py`, `cli.py` import 줄, `list` 호출 순서, Decorator 적용 시점 | 구현 사례 | `m03-pocket-money-ledger` `d14e812`: `ledger/*.py` 읽기 + `python -m ledger --data-dir <임시> list --limit 1` 호출 추적(`sys.setprofile`) |
