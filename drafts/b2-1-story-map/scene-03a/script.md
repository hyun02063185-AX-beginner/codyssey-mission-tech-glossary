# Scene 03-A 원고 — Python 프로그램은 왜 여러 함수와 클래스로 나누어 만들까?

> **상태:** 시안 · GPT 독립 콘텐츠 검토와 Owner 승인 전. 기준: [시나리오 v2](../scenario-v2.md) · 2026-10-22
> **그림:** [노트북용](class-layer-desktop.svg) · [휴대전화용](class-layer-mobile.svg) · 설계는 [design-notes.md](design-notes.md) · 데모 코드 `_tools/demo/`

| 항목 | 내용 |
| --- | --- |
| 학습 질문 | **Python 프로그램은 왜 여러 함수와 클래스로 나누어 만들까?** |
| 도달 기준 | 함수와 클래스·객체의 차이, `def`·Parameter·`return`·`class`·`self`·`__init__()`의 기본 역할을 자기 말로 설명하고, 자기 코드에서 함수 정의·호출과 객체 생성을 찾아 "입력·출력, 데이터 저장, 업무 규칙이 어디서 처리되는지" 말할 수 있다 |
| 이전 장면과의 관계 | Scene 01은 명령 한 줄, Scene 02는 시작 파일과 두 지도(import·호출)를 봤다. 이 장면은 그 파일 **안의** 함수·클래스와, 파일을 **책임**으로 나누는 이유를 본다 |
| 03-B로 넘김 | CRUD 네 동작, Create·Read·Update·Delete의 처리 과정, 검색과 요약의 차이, 계층 위에서 한 기능이 작동하는 전 과정. 파일 저장·스트리밍은 Scene 04·05 |
| 근거 표기 | `[확정 사실]` 공식 문서 + 실행 확인 · `[단순화]` · `[설계 예시]` Python 문법이 아닌 설계 선택 · `[구현 사례]` `ledger` · `[학습용 변형]` |

---

## 학습자 원고

### 1. 왜 나누어 만들까?

같은 계산을 여러 곳에서 하거나, 한 덩어리 코드가 여러 일을 동시에 하면 읽기도 고치기도 어렵습니다. 프로그램을 **이름 붙은 작은 단위**로 나누면 ① 같은 일을 한 곳에 모아 다시 쓰고 ② 어디를 고쳐야 할지 좁히고 ③ 다른 사람에게 "이 부분은 이 일을 한다"고 설명할 수 있습니다. 함수와 클래스는 그 단위를 만드는 Python 문법이고, 계층(모델·저장소·서비스·CLI)은 그 단위들에 **책임을 나누는 설계 방법**입니다. 둘은 다른 이야기라는 점을 끝까지 구분합니다. `[단순화]`

### 2. 함수 — 정의하고 호출한다

```python
def add_tax(price, rate=0.1):          # 정의: 이름(add_tax)과 받는 자리(price, rate)를 정한다
    return round(price * (1 + rate))   # return: 결과를 호출한 곳에 돌려준다

total = add_tax(1000)                  # 호출: 1000을 넘겨 본문을 실행하고, 돌려받은 값을 total에
```

- **함수(function)** — 이름을 붙여 둔 문장 묶음입니다. 값을 받아 일을 하고 결과를 돌려줄 수 있습니다. `[확정 사실]`
- **`def`** — 함수를 **정의**합니다. `def` 문이 실행되면 함수가 만들어지고 이름이 붙을 뿐, **본문은 실행되지 않습니다**(Scene 02의 '불러올 때'). 본문은 **호출**할 때 실행됩니다. `[확정 사실]`
- **Parameter(매개변수)** — 정의에 적은 **받는 자리**입니다(`price`, `rate`). `rate=0.1`처럼 기본값을 둘 수 있습니다.
- **전달값(Argument)** — 호출할 때 **실제로 넣는 값**입니다(`1000`). 호출하면 `price ← 1000`, `rate ← 0.1(기본값)`으로 연결됩니다. Scene 01의 "명령줄 인자와 함수 인자" 비교를 떠올려 보세요. 자세한 규칙은 Scene 07에서 다룹니다. `[확정 사실]`
- **`return`** — 결과를 호출한 곳에 **돌려주고** 함수를 끝냅니다. `return`이 없으면 함수는 `None`을 돌려줍니다. `[확정 사실]`

### 3. 클래스와 객체 — 틀과 그 틀로 만든 것

```python
class Task:                        # 클래스: 할 일 객체를 만드는 틀
    def __init__(self, title):     # 객체를 만들 때 자동으로 실행되는 메서드
        self.title = title         # 이 객체의 데이터(속성)로 저장
        self.done = False

    def complete(self):            # 일반 메서드: 객체를 통해 부른다
        self.done = True

a = Task("장보기")                 # 객체 생성 → 객체 a
b = Task("운동")                   # 같은 틀로 만든 다른 객체 b
a.complete()                       # a의 done만 True가 된다
```

- **클래스(class)** — 객체를 만드는 **틀**입니다. 보통 그 객체가 쓸 메서드를 함께 정의합니다. `[확정 사실]`
- **객체(object, 인스턴스)** — 틀로 **만든 것**입니다. 객체마다 **자기 데이터**(속성: `title`, `done`)를 가지고, 클래스에 정의된 **메서드**를 부를 수 있습니다. `a`와 `b`는 같은 틀로 만들었지만 데이터가 따로입니다. `[확정 사실]`
- **`__init__()`** — `Task("장보기")`를 실행하면 Python이 **새 객체를 만들고 `__init__(새 객체, "장보기")`를 자동으로 호출**합니다. 그래서 처음 데이터를 정하는 곳으로 씁니다. 직접 `a.__init__(…)`처럼 부르지 않습니다. `[확정 사실]`
- **`self`** — 메서드의 **첫 Parameter**로, Python이 **그 메서드를 부른 객체를 자동으로 넘겨 주는 자리**입니다. `a.complete()`는 `Task.complete(a)`와 같고, 이때 `self`는 `a`입니다. **`self`라는 이름은 관례**입니다. 다른 이름을 써도 동작하지만(아래 `self_name.py`), 모두가 `self`로 쓰므로 그대로 따릅니다. `[확정 사실]`

### 4. 헷갈리기 쉬운 짝

| | 앞의 것 | 뒤의 것 |
| --- | --- | --- |
| **함수 ≠ 메서드** | 함수: 모듈에 정의, **이름으로** 부름 (`add_tax(1000)`) | 메서드: **클래스 안에** 정의, **객체를 통해** 부름 (`a.complete()`). 부른 객체가 첫 Parameter(`self`)로 자동 전달 |
| **`__init__()` ≠ 일반 메서드** | 객체를 **만들 때** Python이 자동 호출, 처음 데이터 설정 | 필요할 때 **직접** 부름 (`a.complete()`) |
| **Parameter ≠ 전달값(Argument)** | 정의의 받는 자리 (`price`, `rate`, `self`, `title`) | 호출 때 넣는 값 (`1000`, `"장보기"`). `self` 자리는 Python이 객체로 채움 |
| **`__init__()` ≠ `__init__.py`** | 클래스 안의 **메서드**, 객체를 만들 때마다 실행 | 패키지 폴더의 **파일**, 패키지를 처음 불러올 때 실행(Scene 02) |

**직접 확인하기** — 2·3절 코드를 합친 파일입니다. `[확정 사실]`

<!-- demo:basics.py -->
```python
"""Scene 03-A 문법 예제: 함수 정의와 호출, 클래스 정의와 객체 생성."""


def add_tax(price, rate=0.1):
    return round(price * (1 + rate))


total = add_tax(1000)
print("함수 호출 결과:", total)


class Task:
    def __init__(self, title):
        self.title = title
        self.done = False

    def complete(self):
        self.done = True

    def label(self):
        mark = "x" if self.done else " "
        return f"[{mark}] {self.title}"


a = Task("장보기")
b = Task("운동")
a.complete()
print(a.label())
print(b.label())
print(Task.label(b))
```

<!-- run: python basics.py | exit=0 -->
```text
$ python basics.py
함수 호출 결과: 1100
[x] 장보기
[ ] 운동
[ ] 운동
```

마지막 두 줄이 같습니다. `b.label()`과 `Task.label(b)`는 같은 호출이고, 앞의 형태에서는 Python이 `b`를 `self` 자리에 자동으로 넣습니다.

<!-- demo:self_name.py -->
```python
"""self는 관례적인 이름이다: 다른 이름을 써도 Python은 첫 Parameter에 객체를 넘긴다(권장하지 않음)."""


class Counter:
    def __init__(this):
        this.count = 0

    def up(this):
        this.count += 1


c = Counter()
c.up()
c.up()
print("count:", c.count)
print("c.up이 기억하는 객체가 c인가:", c.up.__self__ is c)
```

<!-- run: python self_name.py | exit=0 -->
```text
$ python self_name.py
count: 2
c.up이 기억하는 객체가 c인가: True
```

### 5. 책임을 나눈 프로그램 — 모델·저장소·서비스·CLI `[설계 예시]`

**모델·저장소·서비스·CLI는 Python이 강제하는 문법이나 고정된 폴더 구조가 아닙니다.** 프로그램의 일을 **책임별로 나누는 소프트웨어 설계의 한 예**입니다. 이름과 개수는 프로젝트마다 다를 수 있습니다.

| 책임 영역 | 맡는 일 | 이 예시 | 하지 않는 일 |
| --- | --- | --- | --- |
| **모델** | 프로그램이 다루는 **데이터의 구조와 의미** | `Task(title, done)` | 읽기·쓰기, 출력 |
| **저장소** | 데이터 **읽기·쓰기** | `TaskRepository.all()` — 이 장면은 메모리 목록, 파일 저장은 Scene 04 | 업무 규칙 판단, 화면 출력 |
| **서비스** | **기능 수행과 업무 규칙** | `TaskService.list_tasks()` — "limit은 1 이상" 규칙 | 화면 출력, 저장 방식 결정 |
| **CLI** | 사용자 **명령 해석**, **결과와 오류 표시** | `build_parser()`, `main()` | 업무 규칙 판단, 데이터 보관 |

예시는 Scene 01·02의 `todo`를 **책임별 모듈로 나눈 Scene 03-A 학습용 변형**입니다. `[학습용 변형]` 기능은 목록 조회 하나뿐이고(CRUD 전체는 03-B), 실행 시점을 보이는 학습용 출력은 넣지 않았습니다(호출 순서는 실행을 추적해 확인).

<!-- demo:todo/models.py -->
```python
"""모델: 프로그램이 다루는 데이터의 구조와 의미."""


class Task:
    def __init__(self, title, done=False):
        self.title = title
        self.done = done
```

<!-- demo:todo/repository.py -->
```python
"""저장소: 데이터 읽기·쓰기. 이 장면에서는 메모리 목록을 쓴다(파일 저장은 Scene 04)."""
from todo.models import Task


class TaskRepository:
    def __init__(self):
        self._tasks = [Task("장보기"), Task("과제 제출", done=True), Task("운동")]

    def all(self):
        return list(self._tasks)
```

<!-- demo:todo/services.py -->
```python
"""서비스: 기능 수행과 업무 규칙."""


class TaskService:
    def __init__(self, repository):
        self.repository = repository

    def list_tasks(self, limit):
        if limit < 1:
            raise ValueError("limit은 1 이상이어야 합니다")
        return self.repository.all()[:limit]
```

<!-- demo:todo/cli.py -->
```python
"""CLI: 사용자 명령 해석, 결과와 오류 표시."""
import argparse

from todo.repository import TaskRepository
from todo.services import TaskService


def build_parser():
    parser = argparse.ArgumentParser(prog="todo", description="할 일 목록")
    sub = parser.add_subparsers(dest="command", required=True)
    p_list = sub.add_parser("list", help="할 일 보기")
    p_list.add_argument("-n", "--limit", type=int, default=10, help="보여 줄 개수")
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    service = TaskService(TaskRepository())
    try:
        tasks = service.list_tasks(args.limit)
    except ValueError as error:
        print("[오류]", error)
        return 1
    for task in tasks:
        mark = "x" if task.done else " "
        print(f"[{mark}] {task.title}")
    return 0
```

<!-- demo:todo/__main__.py -->
```python
import sys

from todo.cli import main

sys.exit(main())
```

<!-- demo:todo/__init__.py -->
```python
"""할 일 목록 가상 패키지 (Scene 03-A 학습용 변형: 책임별 모듈)."""
```

실습 폴더(`todo` 폴더가 들어 있는 폴더)에서 실행합니다.

<!-- run: python -m todo list --limit 2 | exit=0 -->
```text
$ python -m todo list --limit 2
[ ] 장보기
[x] 과제 제출
```

<!-- run: python -m todo list | exit=0 -->
```text
$ python -m todo list
[ ] 장보기
[x] 과제 제출
[ ] 운동
```

<!-- run: python -m todo list --limit 0 | exit=1 -->
```text
$ python -m todo list --limit 0
[오류] limit은 1 이상이어야 합니다
```

마지막 실행에서 **규칙을 판단한 곳은 서비스**(`list_tasks`가 `ValueError`를 냄)이고, **오류를 사용자에게 보여 준 곳은 CLI**(`main`이 잡아 `[오류]`로 출력하고 종료 코드 1)입니다. 한 기능 안에서도 책임이 나뉘어 있습니다.

### 6. 실제 호출 흐름과 의존 관계는 따로 본다 (그림 B)

**실제 호출 흐름**(`python -m todo list --limit 2`, 호출 추적으로 확인) `[확정 사실]`

| 번호 | 호출 | 부른 곳 | 계층 |
| --- | --- | --- | --- |
| ① | `main()` | `__main__.py` | CLI |
| ② | `build_parser()` | `main()` | CLI |
| ③ | `TaskRepository()` — 저장소 객체 만들기 | `main()` | 저장소 |
| ④ | `Task(…)` × 3 — 할 일 객체 만들기 | `TaskRepository.__init__()` | 모델 |
| ⑤ | `TaskService(저장소)` — 서비스 객체 만들기 | `main()` | 서비스 |
| ⑥ | `list_tasks(2)` | `main()` | 서비스 |
| ⑦ | `all()` | `list_tasks()` | 저장소 |

결과는 거꾸로 돌아옵니다. `all()`이 목록을 `list_tasks()`에 **return**하고, `list_tasks()`가 앞의 2개를 `main()`에 **return**하면, `main()`이 화면에 표시합니다. 그림에서는 **호출 = 실선·번호**, **return = 회색 가는 선**으로 나눴습니다.

**의존 관계**(파일 맨 위 import 줄) — 번호 없는 파란 파선입니다.

| 파일 | import 줄 |
| --- | --- |
| `cli.py` | `import argparse`(표준), `from todo.repository import TaskRepository`, `from todo.services import TaskService` |
| `repository.py` | `from todo.models import Task` |
| `services.py` | 없음 |
| `models.py` | 없음 |

두 그림을 겹쳐 보면:

1. **호출은 있지만 import는 없다** — `services.py`에는 import 줄이 없는데 ⑦에서 저장소의 `all()`을 호출합니다. ⑤에서 **만들어진 저장소 객체를 받아** 쓰기 때문입니다. Scene 02의 "import로 연결 ≠ 호출됨"의 반대 경우입니다.
2. **CLI → 서비스 → 저장소 한 줄이 아니다** — `cli.py`는 서비스와 저장소를 **모두** import하고, ③에서 저장소를 **직접** 만듭니다. "CLI가 서비스를 부르고 서비스가 저장소를 부른다"는 **호출 흐름**(⑥·⑦)의 이야기이지 import 줄의 모양이 아닙니다.

### 7. 모듈 분리와 계층 설계는 같은 개념일까?

**아닙니다.** `[단순화]`

- **모듈 분리**는 코드를 **파일**로 나누는 일입니다(Scene 02).
- **계층 설계**는 코드에 **책임**을 나누는 일입니다(이 장면).
- 네 클래스를 `todo.py` 한 파일에 두어도 책임은 나뉘어 있을 수 있습니다. 반대로 파일을 여러 개로 나눠도, `cli.py` 안에서 데이터를 직접 읽고 규칙까지 검사하면 책임은 섞여 있습니다.
- 그래서 코드를 읽을 때 "파일이 몇 개인가"보다 **"입력·출력, 데이터 저장, 업무 규칙이 어디에서 처리되는가"**를 찾습니다.

### 8. 실제 미션 구현 사례 — `ledger` `[구현 사례]`

> `m03-pocket-money-ledger` `d14e812`에서 확인한 **한 가지 구현**입니다. 이 구조가 정답이라는 뜻이 아닙니다.

| 책임 | `ledger`의 모듈과 이름 |
| --- | --- |
| 모델 | `models.py`: `Transaction`, `Budget`, `SearchCriteria`, `MonthlySummary`, `ImportResult`. 모두 `@dataclass`를 써서 `__init__()`을 직접 쓰지 않고 자동으로 만든다 |
| 저장소 | `repository.py`: `TransactionRepository`, `CategoryRepository`, `BudgetRepository` (JSONL 파일 읽기·쓰기는 Scene 04) |
| 서비스 | `services.py`: `LedgerService` 한 클래스에 `add_transaction()`, `list_transactions()`, `search()`, `monthly_summary()` 등 |
| CLI | `cli.py`: `build_parser()`, `main()`, 명령별 `cmd_list()` 등, 저장소 세 개와 서비스를 만드는 `_build_service()` |
| 그 밖 | `validators.py`(값 검증), `errors.py`(오류 종류), `decorators.py`(오류 안내, Scene 06) |

- **import 줄은 한 줄 사슬이 아닙니다.** `cli.py`는 `services`뿐 아니라 `repository`·`models`·`validators`·`errors`·`decorators`를 import하고, `services.py`도 `repository`·`models`·`validators`·`errors`를 import합니다. 설계 문서는 의존 방향을 `cli → services → repository`로 그리지만, 실제 import는 이보다 많습니다. `_build_service()`가 저장소 객체를 직접 만들어 서비스에 넘기기 때문입니다.
- **호출 흐름**(`list --limit 1` 추적, Scene 02): `main()` → … → `cmd_list()` → `LedgerService.list_transactions()` → `TransactionRepository.iter_all()`. 호출은 CLI → 서비스 → 저장소 방향으로 이어집니다. 의존 관계(import)와 호출 흐름을 따로 봐야 하는 이유입니다.

### 9. 내 코드에서 찾아보기 (대면 강의 활동)

목적은 코드를 평가하는 것이 아니라 **자기 코드에서 함수와 클래스를 찾아 읽는 방법**을 익히는 것입니다. 같은 계층이나 클래스를 쓰라는 뜻이 아닙니다.

1. **`def`로 정의된 함수 하나**를 찾습니다. Parameter와 `return`이 무엇인지 적습니다.
2. **그 함수를 호출하는 코드**를 찾습니다(편집기에서 함수 이름 검색). 어떤 전달값을 넣는지 봅니다.
3. **`class`가 있다면** 클래스와 **객체를 만드는 곳**(`클래스이름(…)`)을 찾습니다.
4. **`__init__()`이 있다면** 어떤 값이 `self.이름 = …`으로 초기화되는지 확인합니다. `@dataclass`라면 클래스 안의 필드 목록이 그 역할을 합니다.
5. **입력·출력, 데이터 저장, 업무 규칙이 어디에서 처리되는지** 찾아 표로 적습니다(`input()`·`print()`·`argparse` / 파일 열기·저장 / `if`로 값을 검사하고 막는 곳).

| 내 코드의 모습 | 이렇게 읽습니다 |
| --- | --- |
| **파일 하나**에 모든 코드 | 같은 5단계를 그대로 합니다. 5단계 표가 곧 "한 파일 안의 책임 지도"입니다 |
| 클래스 없이 함수만 | 1·2·5단계만 합니다. 함수만으로도 책임을 나눌 수 있습니다 |
| 이름이 다름(`manager.py`, `storage.py`, `handlers.py` 등) | 이름보다 **하는 일**로 5단계 표의 칸을 채웁니다 |
| 한 함수가 입력·저장·규칙·출력을 모두 함 | 틀린 것이 아닙니다. 어디가 어떤 일을 하는지 표에 적고, 나눌 수 있는 지점을 말로만 짚어 봅니다 |

### 10. 한 문장 정리

> 함수는 **이름 붙인 일 묶음**(정의 → 호출 → return), 클래스는 **데이터와 메서드를 가진 객체를 만드는 틀**이며 `self`는 Python이 넘겨 주는 그 객체입니다. 모델·저장소·서비스·CLI는 문법이 아니라 **책임을 나누는 설계의 한 예**이고, 파일을 나누는 것(모듈)과 책임을 나누는 것(계층)은 다릅니다.

---

## 강사용 안내

> 대면 강의는 우리 교육 모델의 **필수 초기 단계**(운영 선택)이며 코디세이 공식 규정이 아닙니다. 시간 배분은 시범 운영 후 확정합니다.

**준비** — `drafts/b2-1-story-map/scene-03a/_tools/demo/`를 실습 폴더로 복사하고 그 안에서 실행합니다.

**권장 진행 순서**

1. **질문** — "같은 계산을 세 군데에서 한다면 어떻게 하겠어요?" → 함수의 필요.
2. **그림 A 함수** — `def`(정의) / 호출 / Parameter(밑줄 초록) / 전달값(갈색) / `return`을 짚고, `price ← 1000` 연결을 말로 따라가게 합니다.
3. **그림 A 클래스** — 틀과 객체 a·b. `a.complete()` 뒤 a의 `done`만 바뀌는 것을 확인합니다.
4. **시연 1** — `python basics.py`. `b.label()`과 `Task.label(b)`가 같은 결과인 이유로 `self`를 설명합니다. 이어서 `python self_name.py`로 "이름은 관례"를 보입니다.
5. **비교 카드 4쌍** — 학습자가 한 쌍씩 말로 설명하게 합니다(확인 질문 2·3).
6. **그림 B 책임 카드** — "**문법이 아니라 설계의 한 예**"를 먼저 말합니다.
7. **시연 2** — `python -m todo list --limit 2`와 `--limit 0`. 오류에서 "규칙을 판단한 곳(서비스)"과 "보여 준 곳(CLI)"을 나눕니다.
8. **그림 B-2·B-3** — 호출(①~⑦)과 return(회색)을 따라간 뒤, import 지도와 겹쳐 "서비스는 import 없이 호출한다", "CLI가 저장소를 직접 만든다"를 확인합니다.
9. **`ledger` 사례** — 질문이 있을 때만. `@dataclass`가 `__init__()`을 대신 만든다는 점과 import가 한 줄 사슬이 아님을 짚습니다.
10. **내 코드에서 찾아보기** — 동의한 교육생 한 명의 코드로 1~5단계를 함께 한 뒤 각자 진행합니다. 단일 파일·함수만 있는 코드도 같은 표로 읽습니다.

**흔한 오해와 교정**

| 학습자의 말 | 교정 |
| --- | --- |
| "`def`를 쓰면 함수가 실행돼요" | `def`는 함수를 만들 뿐입니다. 호출할 때 본문이 실행됩니다 |
| "`self`는 Python 예약어예요" | 첫 Parameter의 관례적인 이름입니다. Python이 그 자리에 객체를 넘깁니다(`self_name.py`) |
| "`__init__()`은 직접 불러야 해요" | `Task(…)`로 객체를 만들 때 Python이 자동 호출합니다 |
| "클래스를 쓰면 객체가 하나예요" | 같은 틀로 여러 객체를 만들 수 있고, 데이터는 객체마다 따로입니다 |
| "모델·저장소·서비스·CLI로 꼭 나눠야 해요" | 책임을 나누는 설계의 한 예입니다. 프로젝트마다 다르게 나눌 수 있습니다 |
| "파일을 나누면 계층이 나뉜 거예요" | 파일(모듈)과 책임(계층)은 다릅니다. 책임이 어디서 처리되는지를 봅니다 |
| "CLI → 서비스 → 저장소 순서로 import해요" | 그건 호출 흐름입니다. import 줄은 다를 수 있습니다(예시의 `cli.py`, `ledger`) |

**수준 조절** — 입문 이전 학습자는 2·3절과 그림 A, 활동 1~3단계까지. 여유가 있으면 5~7절과 그림 B, 활동 4~5단계로 확장합니다. Parameter 종류(위치·키워드 전용 등)와 상속은 다루지 않습니다.

## 이해 확인 질문 (점수화하지 않음)

| # | 질문 | 확인할 내용 |
| --- | --- | --- |
| 1 | `add_tax(1000)`에서 Parameter와 전달값은 각각 무엇인가요? `return`은 무엇을 하나요? | `price`(·`rate`) / `1000` / 결과를 돌려줌 |
| 2 | 클래스와 객체는 어떻게 다른가요? `a`와 `b`의 `done`이 다른 이유는? | 틀 / 틀로 만든 것, 객체마다 데이터가 따로 |
| 3 | `a.complete()`를 부를 때 `self`에는 무엇이 들어가나요? | 객체 `a`(Python이 자동 전달) |
| 4 | `__init__()`과 `complete()`는 언제 실행되나요? | 객체를 만들 때 자동 / 직접 부를 때 |
| 5 | `--limit 0`에서 규칙을 판단한 곳과 오류를 보여 준 곳은? | 서비스 / CLI |
| 6 | 내 코드에서 입력·출력, 데이터 저장, 업무 규칙은 각각 어디에서 처리되나요? | 자기 코드의 위치(단일 파일 포함) |

## 근거와 출처

| 내용 | 분류 | 출처 |
| --- | --- | --- |
| 함수·Parameter·Argument·메서드(첫 인자로 인스턴스, 보통 `self`)·클래스·객체의 정의 | 확정 사실 | [Python 용어집](https://docs.python.org/3/glossary.html) function·parameter·argument·method·class·object |
| 함수 정의는 실행 문장이며 본문은 호출될 때 실행 / 기본값 | 확정 사실 | [Reference §8.7](https://docs.python.org/3/reference/compound_stmts.html#function-definitions) |
| `return`, `return`이 없으면 `None` | 확정 사실 | [Tutorial §4.8 함수 정의](https://docs.python.org/3/tutorial/controlflow.html#defining-functions) |
| 클래스 객체·인스턴스 객체, `__init__()` 자동 호출, `x.f()`는 `MyClass.f(x)`와 같음, `self`는 관례일 뿐 특별한 의미 없음 | 확정 사실 | [Tutorial §9.3](https://docs.python.org/3/tutorial/classes.html#a-first-look-at-classes), [§9.4 Random Remarks](https://docs.python.org/3/tutorial/classes.html#random-remarks) |
| `@dataclass`가 `__init__()` 등을 자동으로 만든다 | 확정 사실 | [dataclasses](https://docs.python.org/3/library/dataclasses.html) |
| 2~6절의 모든 출력·종료 코드, 호출 순서·부른 쪽·return, import 줄 | 확정 사실(실행 확인) | `_tools/demo/`, Python 3.14.6, Windows, 2026-10-22. `_tools/verify_demo.py`가 원고 코드·출력·그림과 실제 실행·호출 추적·AST를 대조 |
| 모델·저장소·서비스·CLI의 책임 구분 | 설계 예시 | 계층형 설계의 일반적 설명. Python 문법·표준이 아님 |
| 나누는 이유, 모듈 분리와 계층 설계의 차이 | 단순화 | 일반적 설명 |
| `ledger`의 모듈·클래스, `@dataclass` 사용, import 줄, `_build_service()`, `list` 호출 흐름 | 구현 사례 | `m03-pocket-money-ledger` `d14e812`: `ledger/*.py`, `docs/m03-architecture-design.md` §3·§5, Scene 02의 호출 추적 |
