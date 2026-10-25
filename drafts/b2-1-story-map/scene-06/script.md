# Scene 06 원고 — 여러 함수에 똑같이 필요한 일을 매번 다시 쓰지 않으려면? Decorator와 공통 관심사

> **상태:** 시안 · GPT 독립 콘텐츠 검토와 Owner 승인 전. 기준: [시나리오 v2](../scenario-v2.md) · 2026-10-23
> **그림:** [노트북용](decorator-flow-desktop.svg) · [휴대전화용](decorator-flow-mobile.svg) · 설계는 [design-notes.md](design-notes.md) · 데모 코드 `_tools/demo/`

| 항목 | 내용 |
| --- | --- |
| 학습 질문 | **여러 함수에 똑같이 필요한 일(로그·예외 처리·시간 측정)을 매번 다시 쓰지 않으려면?** |
| 도달 기준 | 함수 객체와 함수 호출 결과를 구별하고, Decorator가 **함수를 받아 공통 동작을 덧붙인 wrapper 함수를 돌려주는 구조**임을 설명한다. `@decorator` = `func = decorator(func)`, 적용 시점과 호출 시점의 차이, `*args`·`**kwargs`·`return` 전달, `functools.wraps`의 역할을 작은 코드로 확인한다. 자기 코드에서 Decorator가 적용된 곳과 실제로 덧붙는 동작을 찾아 말할 수 있다 |
| 이전 장면과의 관계 | Scene 03-A는 함수의 정의·호출·Parameter·전달값(Argument)·`return`을, Scene 02는 import(연결)와 함수 호출(실행)의 차이를 다뤘다. 이 장면은 **함수를 값처럼 넘겨 다른 함수로 감싸는 방법**을 본다 |
| 이 장면의 범위 | 함수도 값, wrapper, `@` 문법과 적용·호출 시점, 인자·반환값 전달, `functools.wraps`, 공통 관심사 세 가지(로그·예외 처리·시간 측정)의 Decorator 예제 |
| 다루지 않음 | 인자를 받는 Decorator(`@retry(3)` 같은 Decorator 공장), 클래스 Decorator, 여러 Decorator 겹치기의 세부, 클로저의 내부 구조, `*args`·`**kwargs`의 고급 활용과 Parameter 규칙 전체(Scene 07), `logging` 모듈 설정 |
| 공식 목표 대응 `[요구 추적]` | **목표 4 'Decorator를 이용한 공통 관심사 분리 — 로그·예외·시간 측정'의 주 장면.** 세 관심사 모두 일반 예제로 가르친다. `ledger`에는 **예외 처리 Decorator만** 있다(9절) |
| 근거 표기 | `[확정 사실]` 공식 문서 + 실행 확인 · `[단순화]` · `[설계 예시]` Python 문법이 아닌 설계 선택 · `[구현 사례]` `ledger` · `[학습용 예제]` 이 장면을 위해 만든 독립 예제 |

> 이 장면의 예제(`repeated_logs.py` 등 `_tools/demo/`의 파일 11개)는 **Decorator의 원리를 보여 주려고 만든 독립적인 학습용 예제**입니다. 실제 `ledger` 소스나 공식 미션의 정답 구현이 아닙니다. 예제는 파일을 만들거나 바꾸지 않습니다. `[학습용 예제]`

---

## 학습자 원고

### 1. 질문 — 같은 코드가 함수마다 반복된다면? (그림 A)

거래를 추가하는 함수와 목록을 돌려주는 함수가 있습니다. 둘 다 실행이 시작되고 끝날 때 로그를 남기려고 합니다.

<!-- demo:repeated_logs.py -->
```python
"""같은 로그 코드가 함수마다 반복된다(원래 기능과 부가 기능이 한 함수에 섞여 있음)."""
transactions = []


def add_transaction(category, amount):
    print("[로그] add_transaction 시작")
    item = {"category": category, "amount": amount}
    transactions.append(item)
    print("[로그] add_transaction 끝")
    return item


def list_transactions():
    print("[로그] list_transactions 시작")
    result = list(transactions)
    print("[로그] list_transactions 끝")
    return result


print("결과:", add_transaction("식비", 8000))
print("결과:", list_transactions())
```

<!-- run: python repeated_logs.py | exit=0 -->
```text
$ python repeated_logs.py
[로그] add_transaction 시작
[로그] add_transaction 끝
결과: {'category': '식비', 'amount': 8000}
[로그] list_transactions 시작
[로그] list_transactions 끝
결과: [{'category': '식비', 'amount': 8000}]
```

- 두 함수 모두 **원래 기능**(거래 추가, 목록 돌려주기) 앞뒤에 **부가 기능**(로그)이 섞여 있습니다. 함수가 열 개가 되면 같은 두 줄이 열 번 반복되고, 로그 형식을 바꾸려면 열 곳을 고쳐야 합니다.
- 여러 기능에 똑같이 필요하지만 각 기능의 본래 목적은 아닌 일을 **공통 관심사**(cross-cutting concern)라고 합니다. 로그, 예외 처리, 시간 측정이 대표적입니다. `[단순화]`
- 해결 방법은 하나가 아닙니다. 로그를 출력하는 **함수를 따로 만들어 부르거나**, 기능 함수를 대신 불러 주는 **공통 호출 함수**를 둘 수도 있습니다. 이 장면은 그중 Python이 문법으로 지원하는 **Decorator**를 봅니다. Decorator가 유일한 정답은 아닙니다. `[설계 예시]`

그림 A는 왼쪽에 로그가 섞인 두 함수를, 오른쪽에 로그를 한 곳(wrapper)으로 모으고 두 함수에는 원래 기능만 남긴 모습을 나란히 보여 줍니다.

### 2. 함수도 값이다

Scene 03-A에서 함수는 `def`로 **정의**하고 이름 뒤에 `()`를 붙여 **호출**한다고 배웠습니다. 정의에 적은 받는 자리가 Parameter, 호출할 때 넣는 값이 전달값(Argument)입니다. 이 장면에서 하나를 더합니다. **함수 자체도 값**이라서 변수에 담거나 다른 함수에 전달값으로 넘길 수 있습니다. `[확정 사실]`

<!-- demo:functions_as_values.py -->
```python
"""함수도 값이다: 함수 객체(greet)와 함수 호출 결과(greet())는 다르다."""


def greet():
    return "안녕하세요"


def run(func):
    print("run이 받은 값의 종류:", type(func).__name__)
    return func()


print("greet의 종류:", type(greet).__name__)
print("greet()의 결과:", greet())

saved = greet
print("saved is greet:", saved is greet)
print("saved()의 결과:", saved())

print("run(greet)의 결과:", run(greet))

try:
    run(greet())
except TypeError as error:
    print("run(greet())은 오류:", error)
```

<!-- run: python functions_as_values.py | exit=0 -->
```text
$ python functions_as_values.py
greet의 종류: function
greet()의 결과: 안녕하세요
saved is greet: True
saved()의 결과: 안녕하세요
run이 받은 값의 종류: function
run(greet)의 결과: 안녕하세요
run이 받은 값의 종류: str
run(greet())은 오류: 'str' object is not callable
```

| 표현 | 뜻 | 결과 |
| --- | --- | --- |
| `greet` | **함수 객체** 그 자체(괄호 없음) | `function` |
| `greet()` | 함수를 **호출**해 얻은 결과 | `"안녕하세요"` |
| `saved = greet` | 함수 객체에 이름 하나를 더 붙임(복사가 아님) | `saved is greet → True` |
| `saved()` | 저장한 함수 객체를 호출 | `"안녕하세요"` |
| `run(greet)` | 함수 객체를 **전달값으로 넘김** — `run`의 Parameter `func`가 `greet`를 받음 | `run` 안에서 `func()`로 호출 |
| `run(greet())` | 먼저 `greet()`가 실행되고 그 **결과 문자열**을 넘김 | 문자열은 호출할 수 없어 `TypeError` |

괄호 하나 차이로 "함수를 넘기는 것"과 "함수의 결과를 넘기는 것"이 갈립니다. Decorator는 앞의 것, **함수 객체를 넘기는 것**에서 시작합니다.

### 3. 함수를 감싸는 wrapper

이 장면에서 다루는 **함수 Decorator**는 함수를 받아 **다른 함수(대개 원래 함수를 감싸는 wrapper)를 돌려주는 함수**입니다. `[확정 사실]` 아래는 그 가장 단순한 형태입니다. 모든 Decorator가 wrapper를 돌려주는 것은 아닙니다. 클래스에 붙는 `@dataclass`는 wrapper 없이 클래스에 메서드를 만들어 넣습니다(8절).

<!-- demo:simple_wrapper.py -->
```python
"""가장 단순한 Decorator: 함수를 받아, 앞뒤에 공통 작업을 붙인 wrapper 함수를 돌려준다."""


def trace(func):
    def wrapper():
        print("[wrapper] 앞: 호출 시작")
        func()
        print("[wrapper] 뒤: 호출 끝")
    return wrapper


def greet():
    print("  [greet 본문] 안녕하세요")


original = greet
print("감싸기 전 greet의 이름:", greet.__name__)
greet = trace(greet)
print("감싼 뒤 greet의 이름:", greet.__name__)
print("greet is original:", greet is original)
greet()
```

<!-- run: python simple_wrapper.py | exit=0 -->
```text
$ python simple_wrapper.py
감싸기 전 greet의 이름: greet
감싼 뒤 greet의 이름: wrapper
greet is original: False
[wrapper] 앞: 호출 시작
  [greet 본문] 안녕하세요
[wrapper] 뒤: 호출 끝
```

`trace`가 하는 일을 순서대로 적으면 이렇습니다.

1. Decorator `trace`가 원래 함수를 Parameter `func`로 **받는다**.
2. 안에서 `wrapper()` 함수를 **정의한다**(아직 실행하지 않음).
3. `wrapper()`는 호출되면 **앞부분 공통 작업**을 하고,
4. **원래 함수 `func()`를 호출하고**,
5. **뒷부분 공통 작업**을 한다.
6. `trace`는 `wrapper` **함수 객체를 돌려준다**(`return wrapper`, 괄호 없음).

- `greet = trace(greet)` 뒤에 `greet`라는 이름은 **wrapper**를 가리킵니다(`__name__`이 `wrapper`, `greet is original → False`). 원래 함수는 사라진 것이 아니라 wrapper 안의 `func`로 남아 있다가 4단계에서 불립니다. `[확정 사실]`
- 그래서 **원래 함수의 이름으로 호출해도 실제로는 wrapper를 거쳐** 실행됩니다.
- Decorator는 원래 함수의 **소스 코드를 고쳐 쓰지 않습니다.** `greet`의 본문은 그대로이고, 이름이 가리키는 함수 객체가 wrapper로 바뀌었을 뿐입니다. `[확정 사실]`

### 4. `@` 문법과 적용 시점 — 정의할 때 한 번, 호출할 때마다 (그림 B)

<!-- demo:when_applied.py -->
```python
"""@ 문법과 풀어 쓴 문법, 그리고 Decorator가 적용되는 시점과 wrapper가 호출되는 시점."""


def trace(func):
    print(f"[정의 시점] trace({func.__name__}) 실행 → wrapper를 돌려줌")

    def wrapper():
        print(f"[호출 시점] wrapper 앞 ({func.__name__})")
        func()
        print(f"[호출 시점] wrapper 뒤 ({func.__name__})")
    return wrapper


print("--- @trace로 정의")


@trace
def greet():
    print("  [greet 본문] 안녕하세요")


print("--- 풀어 쓴 문법으로 정의")


def hello():
    print("  [hello 본문] 반갑습니다")


hello = trace(hello)

print("--- 아직 아무 함수도 호출하지 않음. 이제 greet()를 두 번 호출")
greet()
greet()
print("--- hello() 호출")
hello()
```

<!-- run: python when_applied.py | exit=0 -->
```text
$ python when_applied.py
--- @trace로 정의
[정의 시점] trace(greet) 실행 → wrapper를 돌려줌
--- 풀어 쓴 문법으로 정의
[정의 시점] trace(hello) 실행 → wrapper를 돌려줌
--- 아직 아무 함수도 호출하지 않음. 이제 greet()를 두 번 호출
[호출 시점] wrapper 앞 (greet)
  [greet 본문] 안녕하세요
[호출 시점] wrapper 뒤 (greet)
[호출 시점] wrapper 앞 (greet)
  [greet 본문] 안녕하세요
[호출 시점] wrapper 뒤 (greet)
--- hello() 호출
[호출 시점] wrapper 앞 (hello)
  [hello 본문] 반갑습니다
[호출 시점] wrapper 뒤 (hello)
```

**`@trace` + `def greet():`는 `def greet():` 뒤에 `greet = trace(greet)`를 쓴 것과 같은 일을 합니다.** 공식 문서는 둘이 '대체로 같다(roughly equivalent)'고 하며, 차이는 `@`를 쓰면 원래 함수가 이름 `greet`에 잠시도 연결되지 않는다는 점뿐입니다. `[확정 사실]`

| 시점 | 언제 | 무슨 일이 일어나나 | 몇 번 |
| --- | --- | --- | --- |
| **정의 시점(적용)** | `def` 문이 실행될 때 — 파일을 실행하거나 import해 그 줄에 도달할 때 | ① 함수 객체가 만들어지고 ② Decorator가 그 함수 객체를 받아 호출되고 ③ 돌려준 wrapper가 **함수 이름에 연결**된다 | 정의마다 **한 번** |
| **호출 시점(실행)** | `greet()`를 부를 때 | ① wrapper 앞부분 ② 원래 함수 본문 ③ wrapper 뒷부분 | **호출할 때마다** |

- 출력에서 `[정의 시점]`은 `greet`·`hello`마다 **한 번씩**, 아직 아무 함수도 호출하기 전에 나옵니다. `greet()`를 두 번 부르면 `[호출 시점]`만 두 번 반복됩니다. **Decorator를 적용하는 일과 그 결과로 생긴 wrapper를 호출하는 일은 다른 시점입니다.** `[확정 사실]`
- `[정의 시점]`·`[호출 시점]` 출력은 시점을 보이려고 넣은 **학습용 출력**입니다.

**Scene 02와 연결 — import할 때 적용된다.** 다른 파일에 정의된 함수라면, 그 모듈을 import할 때 모듈의 최상위 코드(`def`와 `@`)가 실행되므로 **Decorator는 import 순간 적용**되고, wrapper는 나중에 함수를 호출할 때 실행됩니다.

<!-- demo:deco_tools.py -->
```python
"""다른 파일이 import하는 모듈. @trace는 이 모듈을 불러오는(import) 순간 적용된다."""


def trace(func):
    print(f"  [deco_tools · 정의 시점] trace({func.__name__}) 적용")

    def wrapper():
        print(f"  [호출 시점] wrapper → {func.__name__}")
        return func()
    return wrapper


@trace
def greet():
    return "안녕하세요"
```

<!-- demo:import_then_call.py -->
```python
"""import할 때 Decorator가 적용되고, 함수를 호출할 때 wrapper가 실행된다(Scene 02: import ≠ 함수 호출)."""
print("import 전")
import deco_tools  # noqa: E402  (시점을 보이려고 일부러 print 뒤에 둠)

print("import 뒤 · 아직 greet()를 호출하지 않음")
print("결과:", deco_tools.greet())
```

<!-- run: python import_then_call.py | exit=0 -->
```text
$ python import_then_call.py
import 전
  [deco_tools · 정의 시점] trace(greet) 적용
import 뒤 · 아직 greet()를 호출하지 않음
  [호출 시점] wrapper → greet
결과: 안녕하세요
```

그림 B는 왼쪽 '정의 시점'과 오른쪽 '호출 시점'을 **다른 영역**으로 나누고, 영역마다 실제 순서에 따로 번호를 붙였습니다.

### 5. 인자와 반환값 전달 — `*args`, `**kwargs`, `return`

지금까지의 wrapper는 인자를 받지 않았습니다. 인자가 있고 결과를 돌려주는 함수(Scene 03-A의 `add_tax`)를 감싸려면 wrapper가 **받은 인자를 그대로 넘기고, 받은 결과를 그대로 돌려줘야** 합니다.

<!-- demo:args_return.py -->
```python
"""wrapper가 받은 인자를 *args·**kwargs로 원래 함수에 넘기고, 원래 함수의 결과를 return으로 돌려준다."""


def trace(func):
    def wrapper(*args, **kwargs):
        print(f"[wrapper] 위치 인자 args = {args} · 키워드 인자 kwargs = {kwargs}")
        result = func(*args, **kwargs)
        print(f"[wrapper] 원래 함수가 돌려준 값 {result} → 그대로 return")
        return result
    return wrapper


def forget_return(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
    return wrapper


def no_arguments(func):
    def wrapper():
        return func()
    return wrapper


def add_tax(price, rate=0.1):
    return round(price * (1 + rate))


traced = trace(add_tax)
print("결과:", traced(1000))
print("결과:", traced(1000, rate=0.2))

print("return을 빠뜨린 wrapper:", forget_return(add_tax)(1000))

try:
    no_arguments(add_tax)(1000)
except TypeError as error:
    print("인자를 받지 않는 wrapper:", error)
```

<!-- run: python args_return.py | exit=0 -->
```text
$ python args_return.py
[wrapper] 위치 인자 args = (1000,) · 키워드 인자 kwargs = {}
[wrapper] 원래 함수가 돌려준 값 1100 → 그대로 return
결과: 1100
[wrapper] 위치 인자 args = (1000,) · 키워드 인자 kwargs = {'rate': 0.2}
[wrapper] 원래 함수가 돌려준 값 1200 → 그대로 return
결과: 1200
return을 빠뜨린 wrapper: None
인자를 받지 않는 wrapper: no_arguments.<locals>.wrapper() takes 0 positional arguments but 1 was given
```

| 문법 | 자리 | 하는 일 |
| --- | --- | --- |
| `def wrapper(*args, **kwargs):` | wrapper의 **Parameter** | 위치 인자(`1000`)는 튜플 `args`로, 키워드 인자(`rate=0.2`)는 딕셔너리 `kwargs`로 **받는다** |
| `func(*args, **kwargs)` | 원래 함수를 **호출하는 곳** | 받은 것을 다시 풀어서 원래 함수에 **그대로 넘긴다** |
| `return func(…)` 또는 `result = func(…)` … `return result` | wrapper의 끝 | 원래 함수의 결과를 **호출한 쪽에 돌려준다** |

- `*args`·`**kwargs`라는 이름은 관례이고, 중요한 것은 `*`와 `**`입니다. 이 장면은 '받은 것을 그대로 넘긴다'는 쓰임만 봅니다. Parameter와 인자의 규칙 전체는 Scene 07에서 다룹니다. `[확정 사실]`
- **`return`을 빠뜨리면** 원래 함수가 1100을 돌려줘도 wrapper가 아무것도 돌려주지 않아 호출한 쪽은 `None`을 받습니다.
- **인자를 받지 않는 wrapper**로 인자가 있는 함수를 감싸면 호출할 때 `TypeError`가 납니다. 1~4절처럼 인자 없는 예제만으로 Decorator를 일반화하면 안 되는 이유입니다.
- wrapper가 결과를 **바꿔서** 돌려줄 수도 있습니다(예: 오류일 때 `None`을 돌려주기, 7·9절). 그때는 '원래 함수의 반환값을 그대로 유지하지 않는다'는 것을 의도하고 알려야 합니다. `[설계 예시]`

### 6. `functools.wraps` — 원래 함수의 정보 지키기

3절에서 감싼 뒤 이름이 `wrapper`로 바뀌었습니다. 함수의 이름과 설명 문서(docstring)는 오류 메시지·도움말·디버깅 도구가 읽는 정보입니다.

<!-- demo:wraps_compare.py -->
```python
"""functools.wraps: 동작은 같고, 원래 함수의 이름·설명·원본 참조가 보존되는지가 다르다."""
from functools import wraps


def plain(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper


def keeps(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper


def add_tax(price, rate=0.1):
    """세금을 더한 금액을 돌려준다."""
    return round(price * (1 + rate))


for label, decorated in (("wraps 없음", plain(add_tax)), ("wraps 있음", keeps(add_tax))):
    print(f"[{label}] 결과 {decorated(1000)}")
    print(f"  __name__ = {decorated.__name__}")
    print(f"  __doc__ = {decorated.__doc__}")
    print(f"  __wrapped__가 있나? {hasattr(decorated, '__wrapped__')}")

print("keeps(add_tax).__wrapped__ is add_tax:", keeps(add_tax).__wrapped__ is add_tax)
```

<!-- run: python wraps_compare.py | exit=0 -->
```text
$ python wraps_compare.py
[wraps 없음] 결과 1100
  __name__ = wrapper
  __doc__ = None
  __wrapped__가 있나? False
[wraps 있음] 결과 1100
  __name__ = add_tax
  __doc__ = 세금을 더한 금액을 돌려준다.
  __wrapped__가 있나? True
keeps(add_tax).__wrapped__ is add_tax: True
```

| 속성 | 뜻 | `wraps` 없음 | `wraps` 있음 |
| --- | --- | --- | --- |
| `__name__` | 함수 이름 | `wrapper` | `add_tax` |
| `__doc__` | 설명 문서 | `None` | 원래 함수의 설명 |
| `__wrapped__` | 감싼 원래 함수를 가리킴 | 없음 | 원래 `add_tax` |

- **결과는 둘 다 1100입니다.** `wraps`는 Decorator를 **동작하게 만드는 필수 문법이 아니라**, 원래 함수의 이름·설명 같은 **정보(메타데이터)와 원본 참조를 wrapper에 옮겨 두는 도구**입니다. `[확정 사실]`
- `@wraps(func)`도 Decorator입니다. wrapper를 정의할 때 원래 함수 `func`의 정보를 wrapper에 복사합니다. 7절부터의 예제는 모두 `@wraps(func)`를 씁니다.

### 7. 공통 관심사 세 가지 — 같은 원리, 다른 일 (그림 C·D)

세 Decorator 모두 '함수를 받아 → wrapper가 앞뒤 작업을 하고 → 원래 함수를 부른다'는 **같은 원리**를 씁니다. 다른 것은 **wrapper가 앞뒤에서 하는 일**입니다. 원래 함수는 자기 책임(거래 추가, 거래 찾기, 합계 계산)만 맡습니다.

#### 7-1. 로그 — 호출을 기록하되 예외는 숨기지 않는다

<!-- demo:log_decorator.py -->
```python
"""로그 Decorator: 호출 전후를 기록한다. 예외는 기록만 하고 다시 던진다(처리하지 않음)."""
from functools import wraps

transactions = []


def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[로그] {func.__name__} 시작")
        try:
            result = func(*args, **kwargs)
        except Exception as error:
            print(f"[로그] {func.__name__} 예외 {type(error).__name__}: {error}")
            raise
        print(f"[로그] {func.__name__} 끝")
        return result
    return wrapper


@log_calls
def add_transaction(category, amount):
    if amount < 1:
        raise ValueError("금액은 1 이상이어야 합니다")
    item = {"category": category, "amount": amount}
    transactions.append(item)
    return item


@log_calls
def list_transactions():
    return list(transactions)


print("결과:", add_transaction("식비", 8000))
print("결과:", list_transactions())
try:
    add_transaction("식비", 0)
except ValueError as error:
    print("호출한 쪽이 받은 예외:", error)
```

<!-- run: python log_decorator.py | exit=0 -->
```text
$ python log_decorator.py
[로그] add_transaction 시작
[로그] add_transaction 끝
결과: {'category': '식비', 'amount': 8000}
[로그] list_transactions 시작
[로그] list_transactions 끝
결과: [{'category': '식비', 'amount': 8000}]
[로그] add_transaction 시작
[로그] add_transaction 예외 ValueError: 금액은 1 이상이어야 합니다
호출한 쪽이 받은 예외: 금액은 1 이상이어야 합니다
```

- 정상 실행에서 로그의 순서(`시작` → `끝` → `결과`)는 1절과 같고, 마지막 호출은 1절에 없던 **오류 상황의 로그 처리**도 추가로 보여 줍니다. 이제 두 함수의 본문에는 **원래 기능만** 있고 로그는 `log_calls` 한 곳에 있습니다(그림 A 오른쪽).
- **정상 경로:** `시작` → 원래 함수 → `끝`. **예외 경로:** `시작` → 원래 함수에서 예외 → `예외 …` 기록 → **`raise`로 다시 던짐** → 호출한 쪽이 예외를 받음. 로그 Decorator는 예외를 **처리(없애기)하지 않고 기록만** 합니다. `[학습용 예제]`
- `[단순화]` 이 예제는 `print()`로 로그를 남깁니다. 실제 프로그램은 표준 라이브러리 `logging` 모듈로 수준·시각·출력 위치를 정하는 경우가 많습니다. 이 장면은 `logging` 설정을 다루지 않습니다.

#### 7-2. 예외 처리 — 정해 둔 예외만 잡는다

먼저 입문 문법입니다. `[확정 사실]`

| 문법 | 뜻 |
| --- | --- |
| `try:` | 이 블록을 실행하다 예외가 나면 |
| `except AppError as error:` | **그 종류(와 하위 종류)의 예외만** 받아서 처리한다. 다른 종류는 받지 않는다 |
| `raise AppError("…")` | 예외를 **일으킨다**(던진다) |
| `raise`(뒤에 아무것도 없이) | `except` 안에서 지금 받은 예외를 **다시 던진다**(7-1) |

<!-- demo:error_decorator.py -->
```python
"""예외 처리 Decorator: 정해 둔 예외(AppError)만 잡아 메시지와 None을 돌려주고, 나머지 예외는 그대로 전파한다."""
from functools import wraps


class AppError(Exception):
    """이 예제 프로그램이 미리 예상한 사용자 오류."""


def handle_app_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except AppError as error:
            print(f"[오류] {error}")
            return None
    return wrapper


@handle_app_errors
def find_transaction(items, tx_id):
    for item in items:
        if item["id"] == tx_id:
            return item
    raise AppError(f"id {tx_id} 거래가 없습니다")


@handle_app_errors
def read_amount(item):
    return item["amount"]


items = [{"id": 1, "category": "식비", "amount": 8000}]
print("정상 → 결과:", find_transaction(items, 1))
print("AppError → 결과:", find_transaction(items, 9))
try:
    read_amount({"id": 2})
except KeyError as error:
    print("처리 범위 밖 예외는 전파 →", type(error).__name__, error)
```

<!-- run: python error_decorator.py | exit=0 -->
```text
$ python error_decorator.py
정상 → 결과: {'id': 1, 'category': '식비', 'amount': 8000}
[오류] id 9 거래가 없습니다
AppError → 결과: None
처리 범위 밖 예외는 전파 → KeyError 'amount'
```

| 경로 | 원래 함수 | wrapper | 호출한 쪽이 받는 것 |
| --- | --- | --- | --- |
| **정상** | 거래를 찾아 `return` | `return func(…)`로 그대로 돌려줌 | 거래 딕셔너리 |
| **처리하는 예외** | `raise AppError(…)` | `except AppError`가 받아 `[오류]` 출력, **`None`을 돌려줌** | `None`(예외는 여기서 끝남) |
| **처리 범위 밖 예외** | `item["amount"]`에서 `KeyError` | `except AppError`에 해당하지 않아 **받지 않음** | `KeyError`가 그대로 **전파**됨(여기서는 호출한 쪽의 `try`가 받음. 아무도 받지 않으면 프로그램이 오류로 멈춤) |

- **모든 예외를 무조건 잡아 숨기면 안 됩니다.** `KeyError`는 이 예제에서 데이터 모양을 잘못 다룬 **프로그램의 결함**입니다. 이것까지 `[오류]` 한 줄로 바꾸면 사용자 실수처럼 보이고 원인을 찾기 어려워집니다. 그래서 **미리 예상한 사용자 오류(`AppError`)만** 잡도록 범위를 좁혔습니다. `[설계 예시]`
- 이 Decorator는 오류일 때 `None`을 돌려줍니다. 원래 함수에는 없던 반환값 약속이 생긴 것이므로, 호출한 쪽은 `None`일 수 있다는 것을 알고 써야 합니다(5절).

#### 7-3. 시간 측정 — 숫자는 실행할 때마다 다르다

<!-- demo:timing_decorator.py -->
```python
"""시간 측정 Decorator: 호출 전후의 시각 차이를 출력한다. 실제 숫자는 실행할 때마다 다르다."""
import time
from functools import wraps


def timed(func, clock=time.perf_counter):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = clock()
        result = func(*args, **kwargs)
        elapsed = clock() - start
        print(f"[시간] {func.__name__}: {elapsed:.6f}초")
        return result
    return wrapper


@timed
def total_amount(n):
    total = 0
    for i in range(n):
        total = total + i
    return total


print("결과:", total_amount(100000))

fake_times = iter([10.0, 10.25])


def fake_clock():
    return next(fake_times)


def sample():
    return "끝"


print("가짜 시계로 감싼 결과:", timed(sample, clock=fake_clock)())
```

<!-- run: python timing_decorator.py | exit=0 | vary=[시간] total_amount: -->
```text
$ python timing_decorator.py
[시간] total_amount: 0.003344초
결과: 4999950000
[시간] sample: 0.250000초
가짜 시계로 감싼 결과: 끝
```

- **첫 줄의 숫자(`0.003344`)는 이 원고를 만들 때 한 번 실행한 값일 뿐**입니다. 컴퓨터·실행할 때마다 달라지며, 검증기는 이 줄의 **형식**(`[시간] total_amount: 숫자.여섯자리초`)만 확인합니다. 이 숫자로 빠르다·느리다를 판단하지 않습니다.
- `time.perf_counter()`는 짧은 시간 차이를 재기 위한 시계입니다. **값 하나에는 뜻이 없고 두 번 잰 값의 차이만** 의미가 있습니다. `[확정 사실]`
- **재현할 수 있게 확인하려면** 시계를 바꿔 끼웁니다. `timed`는 `clock`이라는 Parameter를 두고 기본값을 `time.perf_counter`로 했습니다. `@timed`처럼 함수 하나만 넘기면 진짜 시계를 쓰고, `timed(sample, clock=fake_clock)`처럼 **정해진 값을 내는 가짜 시계**를 넘기면 결과가 늘 `0.250000초`로 같습니다. `[학습용 예제]`
- 이 예제는 원래 함수에서 예외가 나면 시간 줄을 출력하지 않습니다. 예외가 나도 재려면 `try`·`finally`를 쓰는데, 이 장면에서는 다루지 않습니다.

**세 관심사 비교(그림 D)**

| | 로그 | 예외 처리 | 시간 측정 |
| --- | --- | --- | --- |
| wrapper 앞 | 시작 기록 | `try:` 시작 | `start = clock()` |
| 원래 함수 호출 | `func(*args, **kwargs)` | `return func(*args, **kwargs)` | `func(*args, **kwargs)` |
| wrapper 뒤 | 끝 기록 / 예외면 기록 후 `raise` | `except AppError:` 메시지, `None` | 차이를 계산해 출력 |
| 반환값 | 원래 결과 그대로 | 정상은 그대로, 처리한 예외는 `None` | 원래 결과 그대로 |
| 예외 | 기록만 하고 다시 던짐 | 정한 예외만 받고 나머지는 전파 | 받지 않음(그대로 전파) |

### 8. 같은 `@`, 다른 목적 — `@dataclass`와 `@handle_errors`

`@` 뒤에 오는 것은 모두 Decorator 문법이지만 **무엇을 받아 무엇을 돌려주는지**는 Decorator마다 다릅니다. `[확정 사실]`

| | `@dataclass` | `@handle_errors`(9절) |
| --- | --- | --- |
| 붙는 곳 | `class` 정의 | 함수 정의 |
| 적용되는 때 | 클래스 정의 시점에 한 번 | 함수 정의 시점에 한 번 |
| 하는 일 | 기본 설정에서는 클래스의 필드를 보고 `__init__()` 등의 메서드를 **만들어 클래스에 추가**함 | 함수를 **감싼 wrapper**를 돌려줌 |
| 사용할 때 실행되는 것 | 객체를 만들 때마다 생성된 `__init__()` 메서드가 실행됨(wrapper는 없음) | 함수를 호출할 때마다 wrapper가 동작해 `try`·`except`를 거침 |

`@dataclass`의 효과가 정의 시점에 끝나는 것은 아닙니다. 정의 시점에 만들어 넣은 `__init__()`은 객체를 만들 때마다 실행됩니다. 다만 그것은 **클래스에 추가된 메서드**로서 실행되는 것이고, `@handle_errors`처럼 **wrapper가 매 호출을 앞뒤에서 감싸는** 방식은 아닙니다. `[확정 사실]`

### 9. 실제 미션 구현 사례 — `ledger`의 `handle_errors` `[구현 사례]`

> `m03-pocket-money-ledger` `d14e812`(원격 `main`과 같음 확인)에서 확인한 **한 가지 구현**입니다. 아래 동작은 이 장면 작업에서 **임시 폴더**의 빈 데이터로 실행해 확인했습니다. **`ledger`에 있는 것은 예외 처리 Decorator 하나뿐입니다. 로그·시간 측정 Decorator는 `ledger`에 없습니다.**

| 위치 | 코드 | 역할 |
| --- | --- | --- |
| `ledger/decorators.py` `handle_errors(func)` | `@wraps(func)`로 감싼 `wrapper(*args, **kwargs)`를 돌려줌. 안에서 `try: func(*args, **kwargs)` / `except LedgerError as exc:` | 7-2와 같은 '정해 둔 예외만 잡기' |
| 같은 파일 `describe_error(exc)` | 예외 종류별로 `(원인, 힌트)` 문구를 찾아 돌려줌. 등록되지 않은 종류는 예외 메시지와 '입력값을 다시 확인하세요.' | 예외를 **사용자 메시지로 바꾸는** 일을 한 곳에 모음 |
| `ledger/errors.py` | `LedgerError`와 그 하위 클래스(`ValidationError`, `TransactionNotFoundError` 등) | 무엇이 '예상한 사용자 오류'인지 정함 |
| `ledger/cli.py` `@handle_errors` + `def _dispatch(args)` | 명령에 맞는 처리 함수를 부르는 **한 곳**에만 적용. `main()`은 `return _dispatch(args)` | 모든 명령의 오류를 한 경계에서 처리 |

실행으로 확인한 동작

| 경우 | 결과 |
| --- | --- |
| 정상(`category list`, 빈 데이터) | 표준 출력에 `[안내] 등록된 카테고리가 없습니다.`, **종료 코드 0** |
| `LedgerError` 하위 클래스(`delete --id 99`, 없는 거래) | **표준 오류(stderr)** 에 `[오류] 존재하지 않는 거래 ID입니다.` · `[힌트] list 명령으로 거래 ID를 확인하세요.`, **종료 코드 1** |
| 범위 밖 예외(`KeyError`를 내는 함수를 `handle_errors`로 감싸 호출) | 잡지 않고 **그대로 전파** |
| `_dispatch.__name__` · `_dispatch.__wrapped__` | `_dispatch` · 원래 함수(`@wraps` 덕분) |

- **반환 약속을 바꾸는 wrapper:** 원래 `_dispatch`는 `-> None`으로 아무것도 돌려주지 않습니다(`_dispatch.__wrapped__(…)` → `None`). 감싼 뒤의 `_dispatch(…)`는 **정수 종료 코드(0 또는 1)** 를 돌려주고, `main()`이 그 값을 그대로 돌려줘 `sys.exit()`에 쓰입니다. wrapper가 원래 함수의 반환값을 늘 그대로 유지하는 것은 아니며, 이 구현은 **의도적으로 반환값을 종료 코드로 바꿨습니다**(5절). `[구현 사례]`
- **적용 시점:** `_dispatch`의 `@handle_errors`는 `ledger/cli.py`를 **import할 때** 적용되고, 명령을 실행할 때마다 wrapper가 불립니다(4절).
- `ledger`의 설계 문서 §22는 Decorator를 '각 커맨드 핸들러에 적용'한다고 적었지만, 실제 코드는 `_dispatch` **한 곳**에만 적용합니다(시나리오 v2 §7.3 기록). 이 원고는 코드를 기준으로 씁니다.
- 공식 목표 4의 '로그·시간 측정'은 `ledger`에 구현 사례가 없으므로 7-1·7-3의 **일반 예제로만** 설명합니다.

### 10. 내 코드에서 찾아보기 (대면 강의 활동)

목적은 Decorator가 있느냐를 평가하는 것이 아니라 **"내 코드에서 여러 함수에 반복되는 일은 무엇이고, 그것을 어디서 처리하는가?"** 를 자기 말로 설명하는 것입니다. **Decorator가 없어도 틀린 것이 아닙니다.** 함수가 몇 개뿐이면 직접 쓰는 편이 더 읽기 쉬울 수 있습니다.

| 찾을 것 | 검색어·단서 | 적을 내용 |
| --- | --- | --- |
| Decorator 적용 | 줄 맨 앞의 `@` | 어디에(함수·클래스) 붙었는가, 표준 라이브러리(`@dataclass` 등)인가 직접 만든 것인가, 호출 때마다 wrapper가 동작하는가 아니면 정의 시점에 메서드 등을 만들어 넣는가 |
| wrapper | `def wrapper(`, 함수 안의 `def` | 원래 함수를 어디서 부르는가(`func(…)`), 앞뒤에 무엇을 하는가 |
| 함수를 인자로 받는 코드 | Parameter 이름이 `func`·`fn`·`callback`, `return wrapper` | 받은 함수를 언제 부르는가 |
| `functools.wraps` | `wraps` | 있는지, 없으면 `__name__`이 어떻게 보이는지 |
| 예외 처리 | `try`·`except` | 어떤 예외를 잡는가(좁은가 넓은가), 잡은 뒤 무엇을 돌려주는가, 다시 던지는가 |
| 로그 | `print(`, `logging`, `logger` | 같은 형식의 출력이 여러 함수에 반복되는가 |
| 실행 시간 측정 | `time.`, `perf_counter` | 어디서 재고 어디에 출력하는가 |
| 반복되는 공통 처리 | 여러 함수 맨 앞·맨 뒤의 비슷한 줄 | Decorator·공통 함수로 모을 후보인가, 그대로 두는 편이 나은가 |

| 내 코드에서 찾은 곳(파일·함수·줄) | 공통 관심사(로그·예외·시간·기타) | 처리하는 방식(Decorator / 직접 작성 / 공통 함수) | 근거가 된 코드 한 줄 |
| --- | --- | --- | --- |
| | | | |

| 내 코드의 모습 | 이렇게 읽습니다 |
| --- | --- |
| `@`가 **없음** | 정상입니다. 여러 함수에 반복되는 `try`·`except`나 `print`를 찾아 "모은다면 어디에 둘까?"를 말해 봅니다 |
| `@dataclass`만 있음 | 클래스 정의 시점에 `__init__()` 등의 메서드를 만들어 넣는 Decorator입니다(8절). 객체를 만들 때 실행되는 것은 그 `__init__()`이고, 호출을 감싸는 wrapper는 없습니다 |
| 직접 만든 Decorator가 있음 | wrapper가 원래 함수를 어디서 부르는지, `return`으로 결과를 돌려주는지, 어떤 예외를 잡는지 확인합니다 |
| `main()` 한 곳에 큰 `try`·`except`가 있음 | Decorator 없이 한 경계에서 처리하는 방식입니다. `ledger`의 `_dispatch`와 목적이 같은지 비교합니다 |

**AI에게 물어볼 때 (보조 질문)** — AI의 답은 확인할 단서일 뿐입니다. 답에 나온 줄을 **직접 열어 보고**, 자기 말로 설명할 수 있어야 합니다. AI의 설명을 그대로 제출하지 않습니다.

- "이 프로젝트에서 `@`로 시작하는 줄을 모두 찾아, 각각 어디에 붙었는지 줄 번호와 함께 알려 주세요. 그리고 **호출할 때마다 wrapper가 동작하는 방식**인지, `@dataclass`처럼 **정의 시점에 메서드 등을 만들어 넣는 방식**인지 구분해 주세요."
- "직접 만든 Decorator가 있다면 wrapper가 원래 함수를 부르는 줄, 결과를 `return`하는 줄, 잡는 예외 종류를 알려 주세요."
- "여러 함수에 반복되는 `try`·`except`나 로그 출력이 있나요? 있다면 모두 같은 형식인지 보여 주세요."
- "이 Decorator는 원래 함수의 반환값을 그대로 돌려주나요, 바꿔서 돌려주나요?"

### 11. 한 문장 정리

> Python에서는 **함수도 값**이라 다른 함수에 넘길 수 있고, 이 장면에서 다룬 **함수 Decorator**는 함수를 받아 앞뒤에 공통 작업을 붙인 **wrapper를 돌려주는 함수**입니다. `@decorator`는 `func = decorator(func)`와 같아서 **정의할 때 한 번 적용**되고, 이후 **호출할 때마다 wrapper가 원래 함수를 부릅니다.** wrapper는 `*args`·`**kwargs`로 인자를 넘기고 `return`으로 결과를 돌려줘야 하며, 로그·예외 처리·시간 측정은 같은 원리로 감싸지만 **하는 일과 예외·반환값을 다루는 방식이 다릅니다.**

다음 장면(Scene 07)은 함수의 Parameter와 전달값, 그리고 Type Hint를 다룹니다.

---

## 강사용 안내

> 대면 강의는 **우리 교육 모델에서 필수인 초기 학습 단계**(운영 선택)입니다. 시간 배분은 시범 운영 후 확정합니다.

**준비** — `drafts/b2-1-story-map/scene-06/_tools/demo/`를 실습 폴더로 복사하고 그 안에서 실행합니다. 표준 라이브러리만 쓰며 파일을 만들거나 바꾸지 않습니다(`import_then_call.py`를 실행하면 Python이 `__pycache__` 폴더를 만들 수 있음). Python 3.14.6, Windows에서 출력을 확인했습니다.

**권장 진행 순서와 멈출 지점**

| # | 보여 줄 것 | 멈추고 물을 것 |
| --- | --- | --- |
| 1 | `python repeated_logs.py`, 그림 A 왼쪽 | "함수가 열 개면 로그 형식을 바꿀 때 몇 곳을 고쳐야 할까?" "원래 기능은 어느 줄인가?" |
| 2 | `python functions_as_values.py` | `run(greet)` 줄 직전에 멈추고 "`run`의 `func`에는 무엇이 들어갈까?", 마지막 오류 앞에서 "`greet()`를 넘기면 무엇이 넘어갈까?" |
| 3 | `python simple_wrapper.py` | `greet = trace(greet)` 직후 "이제 `greet`라는 이름은 무엇을 가리킬까?" → `__name__` 출력으로 확인 |
| 4 | `python when_applied.py`, 그림 B | 출력의 `--- 아직 아무 함수도 호출하지 않음` 줄에서 멈추고 "`[정의 시점]`은 왜 벌써 나왔나?", "`greet()`를 두 번 부르면 무엇이 몇 번 나올까?" |
| 5 | `python import_then_call.py` | "`import` 줄에서 무엇이 출력될까?" (Scene 02 복습, import 과정 전체는 다시 설명하지 않음) |
| 6 | `python args_return.py` | `return을 빠뜨린 wrapper` 줄 앞에서 "결과가 무엇일까?" |
| 7 | `python wraps_compare.py` | "두 결과가 모두 1100인데 무엇이 다를까?" |
| 8 | `python log_decorator.py`, 그림 D | 마지막 세 줄에서 "로그 Decorator는 예외를 처리했나?" |
| 9 | `python error_decorator.py`, 그림 C | 세 경로를 그림의 선 모양으로 짚고 "`KeyError`까지 잡으면 무엇이 문제일까?" |
| 10 | `python timing_decorator.py`를 **두 번** 실행 | "첫 줄 숫자가 같았나? 그럼 어떻게 확인할까?" → 가짜 시계 |
| 11 | `ledger` 사례(9절) | "`_dispatch`는 원래 무엇을 돌려주는데, 감싼 뒤에는?" |
| 12 | 내 코드에서 찾아보기 | 동의한 교육생 한 명의 코드로 `@`·`try`·반복 출력을 함께 찾은 뒤 각자 진행 |

**흔한 오해와 교정**

| 학습자의 말 | 교정 |
| --- | --- |
| "`@`는 특별한 마법이에요" | `func = decorator(func)`를 줄여 쓴 문법입니다 |
| "Decorator가 원래 함수의 코드를 고쳐요" | 소스는 그대로입니다. 이름이 wrapper를 가리키게 바뀝니다 |
| "Decorator는 함수를 부를 때 실행돼요" | Decorator 자체는 **정의할 때 한 번** 실행됩니다. 부를 때 실행되는 것은 wrapper입니다 |
| "`greet`와 `greet()`는 같아요" | 앞은 함수 객체, 뒤는 호출 결과입니다 |
| "wrapper는 인자 없이 만들어도 돼요" | 인자 있는 함수를 감싸면 `TypeError`. `*args`·`**kwargs`로 받아 넘깁니다 |
| "wrapper에서 `return`을 안 써도 결과가 나와요" | 빠뜨리면 `None`입니다 |
| "`wraps`가 없으면 Decorator가 동작하지 않아요" | 동작은 같습니다. 이름·설명·원본 참조를 지키는 도구입니다 |
| "예외 처리 Decorator는 모든 오류를 처리해요" | 정해 둔 예외만 받습니다. 나머지는 전파됩니다(`ledger`도 `LedgerError`만) |
| "모든 예외를 잡으면 안전해요" | 프로그램 결함이 사용자 실수처럼 숨습니다 |
| "로그 Decorator가 예외를 처리했어요" | 기록만 하고 다시 던졌습니다 |
| "시간 측정 결과는 항상 같아요" | 실행마다 다릅니다. 형식이나 가짜 시계로 확인합니다 |
| "`ledger`에 로그·시간 측정 Decorator도 있어요" | 예외 처리 Decorator(`handle_errors`)만 있습니다 |
| "제 코드엔 Decorator가 없어서 틀렸어요" | 틀린 것이 아닙니다. 반복되는 공통 처리를 어디서 하는지 설명하면 됩니다 |

**수준 조절** — 입문 이전 학습자는 1~4절, 그림 A·B, 7-1까지. 여유가 있으면 5·6절, 7-2·7-3, 그림 C·D로 확장합니다. 인자를 받는 Decorator, 클래스 Decorator, Decorator 여러 개 겹치기, 클로저 내부 구조는 다루지 않습니다.

## 이해 확인 질문 (점수화하지 않음)

| # | 질문 | 확인할 내용 |
| --- | --- | --- |
| 1 | `run(greet)`와 `run(greet())`는 무엇이 다른가요? | 함수 객체를 넘김 / 호출 결과(문자열)를 넘김 |
| 2 | `@trace`를 풀어 쓰면? | `def greet(): …` 뒤 `greet = trace(greet)` |
| 3 | `trace` 본문은 언제 몇 번 실행되고, wrapper는 언제 몇 번 실행되나요? | 정의할 때 한 번 / 호출할 때마다 |
| 4 | wrapper에 `*args, **kwargs`와 `return`이 필요한 이유는? | 원래 함수에 인자를 그대로 넘기고 결과를 돌려주려고 |
| 5 | `wraps`를 빼면 무엇이 달라지나요? 결과는요? | 이름·설명·`__wrapped__` / 결과는 같음 |
| 6 | 로그·예외 처리 Decorator는 예외를 각각 어떻게 다루나요? | 기록 후 다시 던짐 / 정한 예외만 받아 메시지·`None`, 나머지는 전파 |
| 7 | 시간 측정 결과를 테스트에서 어떻게 확인할 수 있나요? | 형식만 확인하거나 가짜 시계를 넘김 |
| 8 | `ledger`의 `_dispatch`는 감싼 뒤 무엇을 돌려주나요? 원래는? | 종료 코드 0·1 / `None` |
| 9 | 내 코드에서 여러 함수에 반복되는 공통 처리는 무엇이고 어디서 처리하나요? | 자기 코드의 파일·함수·줄 |

## 근거와 출처

| 내용 | 분류 | 출처 |
| --- | --- | --- |
| 함수 Decorator 정의(다른 함수를 돌려주는 함수, `@` 문법은 문법 설탕). 클래스 Decorator도 있음 | 확정 사실 | [Glossary: decorator](https://docs.python.org/3/glossary.html#term-decorator) |
| Decorator 표현식은 함수가 정의될 때 평가되고, 함수 객체를 유일한 인자로 받아 호출되며, 반환값이 함수 이름에 연결됨. `@f` + `def` ≈ `func = f(func)`(원래 함수가 이름에 잠시도 연결되지 않는 점만 다름) | 확정 사실 | [Compound statements: Function definitions](https://docs.python.org/3/reference/compound_stmts.html#function-definitions) |
| 함수는 객체이며 변수에 담고 전달값으로 넘길 수 있음 | 확정 사실 | [Glossary: function](https://docs.python.org/3/glossary.html#term-function), 실행 확인 |
| `*args`·`**kwargs`로 받고 `func(*args, **kwargs)`로 풀어 넘김 | 확정 사실 | [Tutorial §4.9 More on Defining Functions](https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions) |
| `functools.wraps`·`update_wrapper`: `__name__`·`__doc__` 등 복사, `__wrapped__` 추가 | 확정 사실 | [functools.wraps](https://docs.python.org/3/library/functools.html#functools.wraps), [update_wrapper](https://docs.python.org/3/library/functools.html#functools.update_wrapper) |
| `try`·`except`(그 종류와 하위 종류만 받음)·`raise`·`raise`로 다시 던지기, 받지 않은 예외는 전파 | 확정 사실 | [Tutorial §8 Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html) |
| `time.perf_counter()`: 기준점이 정해지지 않아 두 값의 차이만 유효 | 확정 사실 | [time.perf_counter](https://docs.python.org/3/library/time.html#time.perf_counter) |
| `@dataclass`는 클래스 정의 시점에 (기본 설정에서) `__init__()` 등 메서드를 만들어 클래스에 추가, 객체 생성 시 그 `__init__()`이 실행됨 | 확정 사실 | [dataclasses](https://docs.python.org/3/library/dataclasses.html) |
| 1~7절의 모든 출력·종료 코드, 적용 시점(정의·import)과 호출 시점, 예외 세 경로 | 확정 사실(실행 확인) | `_tools/demo/`, Python 3.14.6(CPython), Windows 11, 2026-10-23. `_tools/verify_demo.py`가 원고·데모·그림과 실제 실행·호출 추적을 대조. 시간 숫자는 형식만 대조 |
| 공통 관심사라는 묶음, 로그를 `print()`로 단순화 | 단순화 | 일반적인 설계 설명. 실제 로그는 `logging` 모듈을 쓰는 경우가 많음 |
| Decorator 외의 해결 방법, 예외 범위를 좁히는 선택, 오류 시 `None` 반환 | 설계 예시 | Python 문법·표준이 아닌 설계 선택 |
| `ledger`의 `handle_errors`·`describe_error`·`LedgerError` 계층·`_dispatch` 한 곳 적용·반환 약속 변경·`KeyError` 전파·종료 코드·stderr | 구현 사례 | `m03-pocket-money-ledger` `d14e812`: `ledger/decorators.py`, `ledger/cli.py`, `ledger/errors.py`, `docs/m03-architecture-design.md` §22·§41. 임시 폴더에서 실행 확인(2026-10-23) |
