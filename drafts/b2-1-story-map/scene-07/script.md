# Scene 07 원고 — `amount: int`라고 적으면 잘못된 값을 막을 수 있을까? Parameter·Argument·Type Hint·값 검증

> **상태:** 시안 · GPT 독립 콘텐츠 검토와 Owner 승인 전. 기준: [시나리오 v2](../scenario-v2.md) · 2026-10-23
> **그림:** [노트북용](type-hint-flow-desktop.svg) · [휴대전화용](type-hint-flow-mobile.svg) · 설계는 [design-notes.md](design-notes.md) · 데모 코드 `_tools/demo/`

| 항목 | 내용 |
| --- | --- |
| 학습 질문 | **`amount: int`라고 적으면 잘못된 값을 막을 수 있을까?** |
| 도달 기준 | 함수 정의의 Parameter와 호출의 Argument를 구별하고, 위치 인자·키워드 인자가 Parameter에 연결되는 규칙을 설명한다. `amount: int`·`-> int`가 **기대하는 형태를 표시할 뿐 실행 중 값을 막지 않는다**는 것을 실행으로 확인하고, argparse `type=int`(변환)·Type Hint(표시)·`if` 검사(검증)의 책임을 나눠 말한다. 자기 코드에서 타입 표시와 실제 검증이 있는 곳을 찾을 수 있다 |
| 이전 장면과의 관계 | Scene 01은 명령줄 인자가 **문자열**로 도착해 argparse가 `type=int`로 바꾼다는 것과 '명령줄 인자 ↔ 함수 인자' 비교를, Scene 03-A는 `def`·Parameter·전달값(Argument)·`return`과 기본값(`rate=0.1`)을, Scene 06은 wrapper가 `*args`·`**kwargs`로 인자를 넘기는 법을 다뤘다. 이 장면은 **값이 함수의 자리에 연결되는 규칙과, 그 값이 올바른지 누가 확인하는가**를 본다 |
| 이 장면의 범위 | Parameter·Argument, 위치·키워드 인자, 기본값, Type Hint 기본 문법(`int`·`str`·`bool`·`list[str]`·`int \| str`·`str \| None`·`-> None`), Type Hint의 런타임 비강제, `isinstance`·범위 검사, `bool`과 `int`의 관계, 읽는 사람·도구·런타임의 역할, argparse `type=int`와의 차이, 기본값과 `None` 허용의 차이 |
| 다루지 않음 | 고급 `typing`(Generic·Protocol·TypeVar·`Literal`·`TypedDict` 등), 위치 전용·키워드 전용 Parameter(`/`, `*`), `*args`·`**kwargs` 재설명(Scene 06), 타입 검사기 설치·설정, 런타임 검증 라이브러리 사용법 |
| 공식 목표 대응 `[요구 추적]` | **목표 5 'Type Hint를 통한 함수의 입출력 계약과 활용 이점'의 주 장면.** 일반 예제로 먼저 가르치고 `ledger`는 9절 사례로만 비교한다 |
| 근거 표기 | `[확정 사실]` 공식 문서 + 실행 확인 · `[단순화]` · `[설계 예시]` Python 문법이 아닌 설계 선택 · `[구현 사례]` `ledger` · `[학습용 예제]` 이 장면을 위해 만든 독립 예제 · `[미검증]` 이번 작업에서 실행하지 않은 것 |

> 이 장면의 예제(`echo_amount.py` 등 `_tools/demo/`의 파일 9개)는 **Parameter·Argument·Type Hint의 동작을 보여 주려고 만든 독립적인 학습용 예제**입니다. 실제 `ledger` 소스나 공식 미션의 정답 구현이 아닙니다. 표준 라이브러리만 쓰고, 파일을 만들거나 바꾸지 않습니다. Python 3.10 이상에서 실행합니다(3절). `[학습용 예제]`

---

## 학습자 원고

### 1. 질문 — `amount: int`면 안전할까?

금액을 받는 함수에 `amount: int`라고 적었습니다. 그러면 문자열 `"1000"`을 넣었을 때 Python이 막아 줄까요? 먼저 예측해 보고 실행합니다.

<!-- demo:echo_amount.py -->
```python
"""Type Hint는 실행 중 값을 막지 않는다: int라고 적은 Parameter에 문자열을 넘겨 본다."""


def echo_amount(amount: int) -> int:
    return amount


print(echo_amount(1000))
print(echo_amount("1000"))

# 화면에는 둘 다 1000으로 보인다. 실제로 무엇이 돌아왔는지 확인한다.
a = echo_amount(1000)
b = echo_amount("1000")
print("돌려받은 값의 타입:", type(a).__name__, "/", type(b).__name__)
print("2배 하면:", a * 2, "/", b * 2)
```

<!-- run: python echo_amount.py | exit=0 -->
```text
$ python echo_amount.py
1000
1000
돌려받은 값의 타입: int / str
2배 하면: 2000 / 10001000
```

- 두 번째 호출도 **오류 없이 실행되고, 문자열이 그대로 돌아왔습니다.** 화면에는 둘 다 `1000`으로 보이지만 타입은 `int`와 `str`이고, 2배 하면 `2000`과 `10001000`(문자열 반복)으로 갈립니다. `[확정 사실]`
- 이 예제는 Type Hint의 역할을 보이려는 것입니다. 금액을 문자열로 받는 것이 올바른 설계라는 뜻이 아닙니다. `[학습용 예제]`

이 장면은 다음 네 가지 질문에 차례로 답합니다.

1. `int`라고 썼는데 왜 문자열이 들어갔을까?
2. Python이 타입 표시를 무시한 걸까?
3. 그런데 IDE는 왜 경고를 보여 줄 수도 있을까?
4. 잘못된 값을 실제로 막는 검사는 어디에 써야 할까?

### 2. Parameter와 Argument (그림 A)

Scene 03-A에서 함수의 **받는 자리**(Parameter)와 **넣은 값**(전달값, Argument)을 봤습니다. 값이 어느 자리에 들어가는지 규칙을 확인합니다.

<!-- demo:parameter_argument.py -->
```python
"""Parameter(받는 자리)와 Argument(넣은 값): 위치 인자는 순서로, 키워드 인자는 이름으로 연결된다."""


def calculate_total(price, quantity):
    print(f"  연결: price={price}, quantity={quantity}")
    return price * quantity


print("위치 인자 calculate_total(1000, 3)")
print("  결과:", calculate_total(1000, 3))

print("키워드 인자 calculate_total(quantity=3, price=1000)")
print("  결과:", calculate_total(quantity=3, price=1000))

print("순서를 바꾼 위치 인자 calculate_total(3, 1000)")
print("  결과:", calculate_total(3, 1000))

try:
    calculate_total(1000)
except TypeError as error:
    print("Argument가 모자라면 → TypeError:", error)


# 기본값을 둔 새 정의(같은 이름에 새 함수가 연결된다)
def calculate_total(price, quantity=1):
    print(f"  연결: price={price}, quantity={quantity}")
    return price * quantity


print("기본값이 있으면 calculate_total(1000)")
print("  결과:", calculate_total(1000))
```

<!-- run: python parameter_argument.py | exit=0 -->
```text
$ python parameter_argument.py
위치 인자 calculate_total(1000, 3)
  연결: price=1000, quantity=3
  결과: 3000
키워드 인자 calculate_total(quantity=3, price=1000)
  연결: price=1000, quantity=3
  결과: 3000
순서를 바꾼 위치 인자 calculate_total(3, 1000)
  연결: price=3, quantity=1000
  결과: 3000
Argument가 모자라면 → TypeError: calculate_total() missing 1 required positional argument: 'quantity'
기본값이 있으면 calculate_total(1000)
  연결: price=1000, quantity=1
  결과: 1000
```

| 코드의 부분 | 이름 | 설명 |
| --- | --- | --- |
| `def calculate_total(price, quantity)`의 `price`, `quantity` | **Parameter**(매개변수) | 함수 **정의**에 적은 받는 자리(이름) |
| `calculate_total(1000, 3)`의 `1000`, `3` | **Argument**(인자, 전달값) | 함수를 **호출**할 때 실제로 넣은 값 |
| `calculate_total(quantity=3, price=1000)`의 `price=1000` | **키워드 인자** | 호출할 때 Argument를 **Parameter 이름**에 직접 연결한 것. `price`는 정의의 자리 이름, `1000`이 Argument |

- **위치 인자**는 적은 **순서대로** 연결됩니다(첫째 값 → `price`, 둘째 값 → `quantity`). **키워드 인자**는 **이름으로** 연결되므로 적는 순서가 달라도 같은 자리에 들어갑니다. `[확정 사실]`
- `calculate_total(3, 1000)`은 결과가 `3000`으로 같지만 `price`에 `3`이 들어갔습니다. 곱셈이라 결과가 우연히 같았을 뿐, 위치 인자는 **순서가 뜻을 정합니다.** 결과만 보고 맞았다고 판단하지 말고 어느 값이 어느 자리에 들어갔는지 확인합니다.
- 한 호출에서 둘을 섞을 때는 위치 인자를 먼저, 키워드 인자를 뒤에 씁니다(키워드 인자 뒤에 위치 인자를 쓰면 문법 오류). `[확정 사실]`
- Argument가 모자라면 함수 본문이 실행되기 전에 `TypeError`가 납니다. 이것은 **자리 수**에 대한 규칙이고, 값의 종류를 검사한 것이 아닙니다.
- `quantity=1`처럼 **기본값**을 둔 Parameter는 호출할 때 Argument를 **생략할 수 있습니다**(Scene 03-A의 `rate=0.1`). 이것이 '`None`을 넣어도 된다'는 뜻은 아닙니다. 둘의 차이는 8절에서 봅니다.
- Scene 01의 '명령줄 인자 ↔ 함수 인자'를 떠올려 보세요. 명령줄 인자는 **문자열**로 도착하지만, 함수의 Argument는 **넘긴 Python 값 그대로** 연결됩니다. Scene 06의 `*args`·`**kwargs`는 다시 다루지 않습니다.

### 3. Type Hint의 기본 문법 (그림 B)

같은 함수에 **Type Hint**(타입 힌트, 타입 표시)를 붙여 봅니다. 힌트가 없는 함수와 같은 Argument로 실행해 결과를 비교합니다.

<!-- demo:type_hint_basics.py -->
```python
"""Type Hint가 있어도 없어도 실행 결과는 같다: 두 함수를 같은 Argument로 부른다."""


def calculate_total_no_hint(price, quantity):
    return price * quantity


def calculate_total(price: int, quantity: int) -> int:
    return price * quantity


print("힌트 없음 (1000, 3) →", repr(calculate_total_no_hint(1000, 3)))
print("힌트 있음 (1000, 3) →", repr(calculate_total(1000, 3)))
print('힌트 없음 ("1000", 3) →', repr(calculate_total_no_hint("1000", 3)))
print('힌트 있음 ("1000", 3) →', repr(calculate_total("1000", 3)))

# Python은 힌트를 함수에 보관만 한다(읽는 사람·도구가 쓸 수 있게).
print("보관된 힌트:", calculate_total.__annotations__)
print("힌트 없는 함수:", calculate_total_no_hint.__annotations__)
```

<!-- run: python type_hint_basics.py | exit=0 -->
```text
$ python type_hint_basics.py
힌트 없음 (1000, 3) → 3000
힌트 있음 (1000, 3) → 3000
힌트 없음 ("1000", 3) → '100010001000'
힌트 있음 ("1000", 3) → '100010001000'
보관된 힌트: {'price': <class 'int'>, 'quantity': <class 'int'>, 'return': <class 'int'>}
힌트 없는 함수: {}
```

| 표시 | 무엇인가 | 실행 중 하는 일 |
| --- | --- | --- |
| `price: int` · `quantity: int` | **Parameter의 Type Hint** — 이 자리에 기대하는 값의 타입 | 없음(검사·변환하지 않음) |
| `-> int` | **반환 Type Hint** — 돌려줄 값에 기대하는 타입 | 없음 |
| `return price * quantity` | **`return` 문** — 실제로 값을 계산해 돌려주는 실행 문장 | 실행됨 |

- 두 함수의 결과는 **글자 하나까지 같습니다.** `("1000", 3)`은 두 함수 모두 `'100010001000'`(문자열 3번 반복)입니다. Type Hint를 붙여도 함수의 **실행 동작은 바뀌지 않습니다.** `[확정 사실]`
- Python은 힌트를 함수의 `__annotations__`에 **보관만** 합니다. 읽는 사람과 도구(IDE·타입 검사기)가 쓰는 정보입니다. `[확정 사실]`
- `-> int`는 '돌려줄 값이 `int`일 것'이라는 **표시**이고, 값을 돌려주는 일은 `return`이 합니다. `-> int`라고 적어도 위 예처럼 문자열이 돌아올 수 있습니다.

자주 쓰는 표현:

| Type Hint | 의미(기대하는 형태) |
| --- | --- |
| `int` | 정수 |
| `str` | 문자열 |
| `bool` | 참·거짓(`True`·`False`) |
| `list[str]` | 원소가 문자열인 리스트 |
| `int \| str` | 정수 **또는** 문자열 |
| `str \| None` | 문자열 **또는** `None` |
| `-> None` | 의미 있는 값을 돌려주지 않도록 의도한 함수 |

- `int | str`·`str | None`처럼 `|`로 쓰는 문법은 **Python 3.10부터** 함수 정의에서 그대로 쓸 수 있습니다. Python 3.9에서 이 장면의 `none_and_defaults.py`를 실행하면 정의 줄에서 `TypeError: unsupported operand type(s) for |: 'type' and 'NoneType'`가 납니다(이번 작업에서 Python 3.9.6으로 확인). 이전 코드에서는 같은 뜻으로 `Optional[str]`·`Union[int, str]`(`typing`)을 쓰기도 합니다. `[확정 사실]`
- 이 표의 표현들도 모두 **기대하는 형태를 적은 것**입니다. 예를 들어 `list[str]`라고 적어도 실행 중 리스트의 원소를 하나하나 검사하지 않습니다(5절).

### 4. Type Hint는 검증이 아니다 (그림 D)

같은 `set_amount`를 두 가지로 만들어 같은 값 여섯 개를 넣어 봅니다.

**타입 표시만 있는 경우**

<!-- demo:hint_not_validation.py -->
```python
"""타입 표시만 있는 set_amount: 어떤 값을 넣어도 그대로 돌려준다."""


def set_amount(amount: int) -> int:
    return amount


for value in [1000, "1000", -5, True, 3.5, None]:
    result = set_amount(value)
    print(f"set_amount({value!r}) → {result!r} ({type(result).__name__})")
```

<!-- run: python hint_not_validation.py | exit=0 -->
```text
$ python hint_not_validation.py
set_amount(1000) → 1000 (int)
set_amount('1000') → '1000' (str)
set_amount(-5) → -5 (int)
set_amount(True) → True (bool)
set_amount(3.5) → 3.5 (float)
set_amount(None) → None (NoneType)
```

**실제 검증이 있는 경우**

<!-- demo:runtime_validation.py -->
```python
"""검증 코드가 있는 set_amount: 규칙에 맞지 않는 값을 실제로 거부한다."""


def set_amount(amount: int) -> int:
    if not isinstance(amount, int) or isinstance(amount, bool):
        raise ValueError("금액은 정수여야 합니다")
    if amount <= 0:
        raise ValueError("금액은 0보다 커야 합니다")
    return amount


for value in [1000, "1000", -5, True, 3.5, None]:
    try:
        print(f"set_amount({value!r}) → {set_amount(value)!r}")
    except ValueError as error:
        print(f"set_amount({value!r}) → 거부: {error}")

# bool 확인을 따로 둔 이유: Python에서 bool은 int의 하위 클래스다.
print("issubclass(bool, int):", issubclass(bool, int), "/ isinstance(True, int):", isinstance(True, int))
```

<!-- run: python runtime_validation.py | exit=0 -->
```text
$ python runtime_validation.py
set_amount(1000) → 1000
set_amount('1000') → 거부: 금액은 정수여야 합니다
set_amount(-5) → 거부: 금액은 0보다 커야 합니다
set_amount(True) → 거부: 금액은 정수여야 합니다
set_amount(3.5) → 거부: 금액은 정수여야 합니다
set_amount(None) → 거부: 금액은 정수여야 합니다
issubclass(bool, int): True / isinstance(True, int): True
```

- 타입 표시만 있는 함수는 **여섯 값을 모두 그대로 돌려줬습니다.** 검증 코드가 있는 함수만 `1000`을 통과시키고 나머지를 `ValueError`로 거부했습니다. 잘못된 값을 막은 것은 Type Hint가 아니라 **`if`로 쓴 검사 코드**입니다. `[확정 사실]`
- `-5`는 `int`이므로 선언 `amount: int`와 **맞습니다.** 그래도 '0보다 커야 한다'는 규칙에서 거부됩니다. 타입이 맞는 것과 업무 규칙을 만족하는 것은 다릅니다.
- `True`도 선언과 맞습니다. Python에서 `bool`은 `int`의 하위 클래스라서 `isinstance(True, int)`가 `True`입니다. 그래서 금액에서 참·거짓 값을 막으려면 `isinstance(amount, bool)`을 **따로** 확인했습니다. 입문 단계에서는 "원하는 입력 규칙은 검사 코드로 직접 적어야 한다"는 점을 먼저 기억하면 됩니다. `[확정 사실]`
- `[설계 예시]` 이 예제는 자료형이 틀린 경우와 범위가 틀린 경우를 모두 `ValueError`로 알립니다. 자료형이 틀린 경우에 `TypeError`를 쓰는 관례도 있습니다. 어떤 예외로 알릴지는 프로그램이 정합니다(`ledger`는 둘 다 `InvalidAmountError`, 9절).

| 구분 | 무엇을 하나 | 이 예제의 코드 |
| --- | --- | --- |
| 타입 표시 | 개발자와 도구에 기대하는 값을 알려 줌. 실행 중 막지 않음 | `amount: int`, `-> int` |
| 타입 검사 | 입력이 올바른 자료형인지 실행 중 확인 | `isinstance(amount, int)`, `isinstance(amount, bool)` |
| 범위 검증 | 자료형이 맞아도 값이 규칙 안에 있는지 확인 | `amount <= 0` |
| 오류 발생 | 규칙을 만족하지 못하면 프로그램이 실제로 거부 | `raise ValueError(…)` |

### 5. 자주 쓰는 표현의 실제 동작 — `list[str]`·`int | str`·`-> None` (그림 D 카드)

<!-- demo:typing_contract.py -->
```python
"""list[str], int | str, -> None: 기대 형태를 표시할 뿐, 실행 중 자동으로 검사하지 않는다."""


def count_tags(tags: list[str]) -> int:
    return len(tags)


def join_tags(tags: list[str]) -> str:
    return ", ".join(tags)


def to_amount(value: int | str) -> int:
    return int(value)


def show_total(total: int) -> None:
    print(f"  합계: {total}원")


print("count_tags(['식비', '점심']) →", count_tags(["식비", "점심"]))
print("count_tags(['식비', 3]) →", count_tags(["식비", 3]))  # 원소가 str이 아니어도 그대로 실행된다
print("join_tags(['식비', '점심']) →", join_tags(["식비", "점심"]))
try:
    join_tags(["식비", 3])
except TypeError as error:
    print("join_tags(['식비', 3]) → TypeError:", error)  # 힌트가 아니라 join()이 낸 오류
print("to_amount(1000) →", to_amount(1000))
print("to_amount('1000') →", to_amount("1000"))
print("to_amount(3.9) →", to_amount(3.9))  # float도 막지 않는다. int()가 소수점 아래를 버린다
result = show_total(8000)
print("show_total(8000)이 돌려준 값 →", result)
```

<!-- run: python typing_contract.py | exit=0 -->
```text
$ python typing_contract.py
count_tags(['식비', '점심']) → 2
count_tags(['식비', 3]) → 2
join_tags(['식비', '점심']) → 식비, 점심
join_tags(['식비', 3]) → TypeError: sequence item 1: expected str instance, int found
to_amount(1000) → 1000
to_amount('1000') → 1000
to_amount(3.9) → 3
  합계: 8000원
show_total(8000)이 돌려준 값 → None
```

- `count_tags(['식비', 3])`은 원소에 정수가 섞여도 `2`를 돌려줍니다. `list[str]`는 원소를 검사하지 않습니다. `[확정 사실]`
- `join_tags(['식비', 3])`의 `TypeError`는 Type Hint가 낸 것이 아니라 **본문의 `", ".join(tags)`가 문자열이 아닌 원소를 만나서** 낸 것입니다. 실행 코드에 맞지 않는 값이 들어가면 그 코드가 평소 Python 규칙대로 예외를 냅니다.
- `to_amount(3.9)`는 `int | str`에 없는 `float`인데도 실행되어 `3`(소수점 아래 버림)이 됐습니다. 막지 않았을 뿐 아니라 값이 조용히 바뀌었습니다.
- `-> None` 함수는 `return`이 없어 `None`을 돌려줍니다. `None`을 만든 것은 힌트가 아니라 `return`이 없다는 사실입니다(Scene 03-A).

### 6. 읽는 사람·IDE·타입 검사기·Python 런타임

같은 `set_amount(amount: int) -> int`를 세 주체가 다르게 씁니다.

| 주체 | Type Hint로 하는 일 | 하지 않는 일 |
| --- | --- | --- |
| **코드를 읽는 사람** | 본문을 다 읽기 전에 기대하는 입력·출력을 안다. 함수를 부를 때 무엇을 넣어야 하는지 정의 한 줄로 확인한다 | — |
| **IDE·정적 타입 검사기**(예: VS Code의 Pylance, mypy) | 실행하기 **전에** 선언과 사용이 어긋날 수 있는 곳(예: `set_amount("1000")`)을 알려 줄 수 있다 | 모든 오류를 찾아 주지 않는다. 무엇을 찾는지는 검사기 종류·설정·코드에 따라 다르다. 이 장면은 검사기를 실행하지 않았다 `[미검증]` |
| **Python 런타임**(실행) | 힌트를 `__annotations__`에 보관한다 | 힌트만으로 값을 검사·변환·거부하지 않는다. 본문 코드가 맞지 않는 값을 만나면 평소 규칙대로 예외가 날 수 있다(5절 `join`) |

- Python 공식 문서: "The Python runtime does not enforce function and variable type annotations. They can be used by third party tools such as type checkers, IDEs, linters, etc." `[확정 사실]`
- `[확장 참고]` 타입 정보를 **읽어서** 실행 중 검증에 쓰는 별도 라이브러리·프레임워크도 있습니다. 그것은 그 도구가 검증 코드를 실행하는 것이지, Python의 기본 Type Hint가 스스로 값을 강제하는 것이 아닙니다. 이 장면에서는 다루지 않습니다.
- 강의실 PC에 타입 검사기 설치를 요구하지 않습니다. 이 장면의 모든 실습은 표준 라이브러리만으로 실행됩니다. 편집기에 이미 타입 검사 기능이 있다면 `echo_amount.py`를 열어 두 번째 호출에 표시가 나오는지 **선택적으로** 확인해 볼 수 있습니다(표시가 없어도 틀린 것이 아닙니다).

정리하면 Type Hint의 이점은 **실행을 막는 데 있지 않고, 읽는 사람과 도구가 실행 전에 기대하는 형태를 알 수 있게 하는 데** 있습니다. 그리고 그 이점은 Type Hint를 쓰지 말아야 할 이유가 아니라 **써야 할 이유**입니다. 실행 중 막아야 할 규칙은 검사 코드로 따로 씁니다.

### 7. `argparse type=int`와 Type Hint의 차이 (그림 C)

Scene 01에서 `--limit 5`의 `5`가 **문자열**로 도착하고, argparse의 `type=int`가 정수로 바꾼다는 것을 봤습니다. 명령줄 값이 서비스 함수까지 가는 과정을 네 단계로 나눕니다.

1. 터미널에서 `--limit 10`을 입력한다. 프로그램에는 문자열 `'10'`이 도착한다.
2. argparse가 `type=int`에 따라 `'10'`을 정수 `10`으로 **변환**한다.
3. 서비스 함수 `list_transactions(limit: int)`에 정수가 전달된다. `limit: int`는 **표시**일 뿐 여기서 아무것도 검사하지 않는다.
4. 서비스 함수가 `if limit <= 0:`으로 그 정수가 유효한 범위인지 **검사**한다.

<!-- demo:argparse_vs_hint.py -->
```python
"""명령줄 → argparse type=int 변환 → 서비스 함수(limit: int 표시) → 범위 검증. 세 단계의 책임이 다르다."""
import argparse
import sys

TRANSACTIONS = [f"거래 {n}" for n in range(1, 13)]  # 학습용 거래 12건


def list_transactions(limit: int) -> list[str]:
    """서비스 역할: limit가 양수인지 검사하고, 마지막 limit건을 돌려준다."""
    if limit <= 0:
        raise ValueError(f"limit는 양수여야 합니다 (받은 값: {limit})")
    return TRANSACTIONS[-limit:]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()  # 정수로 바꿀 수 없으면 여기서 사용법·오류를 출력하고 종료 코드 2로 끝난다
    print(f"[CLI] args.limit = {args.limit!r} ({type(args.limit).__name__})")
    try:
        items = list_transactions(args.limit)
    except ValueError as error:
        print(f"[오류] {error}", file=sys.stderr)
        return 1
    print(f"[목록] {len(items)}건: {items[0]} … {items[-1]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

<!-- run: python argparse_vs_hint.py --limit 10 | exit=0 -->
```text
$ python argparse_vs_hint.py --limit 10
[CLI] args.limit = 10 (int)
[목록] 10건: 거래 3 … 거래 12
```

<!-- run: python argparse_vs_hint.py --limit abc | exit=2 -->
```text
$ python argparse_vs_hint.py --limit abc
usage: argparse_vs_hint.py [-h] [--limit LIMIT]
argparse_vs_hint.py: error: argument --limit: invalid int value: 'abc'
```

<!-- run: python argparse_vs_hint.py --limit -2 | exit=1 -->
```text
$ python argparse_vs_hint.py --limit -2
[CLI] args.limit = -2 (int)
[오류] limit는 양수여야 합니다 (받은 값: -2)
```

| 입력 | 어디까지 가나 | 어디서 멈추나 | 누가 출력하나 | 종료 코드 |
| --- | --- | --- | --- | --- |
| `--limit 10` | 변환 성공 → 함수 호출 → 범위 검사 통과 | 멈추지 않음 | 프로그램(`[목록]`) | 0 |
| `--limit abc` | 변환 실패 | **2단계 argparse** — 함수는 호출되지 않음 | **argparse**(사용법 + `error:`) | 2 |
| `--limit -2` | 변환 성공(`-2`) → 함수 호출(`limit: int`는 그대로 통과) | **4단계 범위 검사** | **프로그램**(`[오류]`) | 1 |

세 표현의 책임은 다릅니다.

| 코드 | 하는 일 | 실행 중 동작 |
| --- | --- | --- |
| `parser.add_argument("--limit", type=int)` | 명령줄 **문자열을 정수로 변환**. 바꿀 수 없으면 argparse가 사용법·오류를 출력하고 종료 코드 2로 끝냄 | 있음(변환) |
| `def list_transactions(limit: int)` | 이 자리에 정수를 **기대한다고 표시** | 없음 |
| `if limit <= 0: raise ValueError(…)` | 프로그램이 요구하는 **범위를 검사**하고 어기면 거부 | 있음(검증) |

- `--limit -2`의 `-2`가 옵션이 아닌 값으로 읽힌 것은, 이 해석기에 `-2`처럼 생긴 옵션이 없을 때 argparse가 음수 모양의 값을 값으로 받아들이기 때문입니다. `[확정 사실]`
- 'argparse 오류'(사용법 줄 + `error:`, 종료 코드 2)는 argparse가 만든 것이고, `[오류] …`(종료 코드 1)는 프로그램이 만든 업무 오류입니다. 출처가 다르므로 메시지 모양도 다릅니다. 두 메시지 모두 표준 오류(stderr)로 출력됩니다. `[확정 사실]`
- argparse도 `choices`나 직접 만든 변환 함수로 더 많은 검사를 할 수 있습니다. 여기서는 **변환은 argparse, 범위 검증은 서비스**로 책임을 나눈 구성을 보는 것입니다(9절 `ledger`도 같은 선택). `[설계 예시]`

`type=int`를 빼면 어떻게 될까요? `limit: int`라는 표시는 그대로 있습니다.

<!-- demo:argparse_without_type.py -->
```python
"""type=int가 없으면 args.limit는 문자열이다. limit: int라고 적어도 Python이 바꿔 주지 않는다."""
import argparse


def list_transactions(limit: int) -> list[str]:
    if limit <= 0:
        raise ValueError("limit는 양수여야 합니다")
    return []


parser = argparse.ArgumentParser()
parser.add_argument("--limit")  # type=int 없음
args = parser.parse_args()
print(f"args.limit = {args.limit!r} ({type(args.limit).__name__})")
try:
    list_transactions(args.limit)
except TypeError as error:
    print("TypeError:", error)
```

<!-- run: python argparse_without_type.py --limit 10 | exit=0 -->
```text
$ python argparse_without_type.py --limit 10
args.limit = '10' (str)
TypeError: '<=' not supported between instances of 'str' and 'int'
```

`args.limit`은 문자열 `'10'`이고, `limit: int`가 있어도 Python은 이것을 정수로 바꿔 주지 않습니다. `'10' <= 0`을 계산하는 본문 코드에서 `TypeError`가 납니다. **변환은 `type=int`가 하는 일이고, Type Hint는 변환하지 않습니다.** `[확정 사실]`

### 8. `None`, 기본값, 그리고 Optional

입문자가 자주 섞는 두 가지: **Argument를 생략할 수 있다**(기본값)와 **`None`이라는 값을 허용한다**(`str | None`)입니다.

<!-- demo:none_and_defaults.py -->
```python
"""Argument를 생략할 수 있다(기본값)와 None을 허용한다(str | None)는 다른 이야기다."""


def greet(name: str = "친구") -> str:
    return f"안녕하세요, {name}"


def greet_optional(name: str | None = None) -> str:
    if name is None:
        name = "친구"
    return f"안녕하세요, {name}"


def category_label(category: str | None) -> str:
    if category is None:
        return "(분류 없음)"
    return category


print("greet() →", greet())
print('greet("민수") →', greet("민수"))
print("greet(None) →", greet(None))
print("greet_optional() →", greet_optional())
print("greet_optional(None) →", greet_optional(None))
print("category_label(None) →", category_label(None))
try:
    category_label()
except TypeError as error:
    print("category_label() → TypeError:", error)
```

<!-- run: python none_and_defaults.py | exit=0 -->
```text
$ python none_and_defaults.py
greet() → 안녕하세요, 친구
greet("민수") → 안녕하세요, 민수
greet(None) → 안녕하세요, None
greet_optional() → 안녕하세요, 친구
greet_optional(None) → 안녕하세요, 친구
category_label(None) → (분류 없음)
category_label() → TypeError: category_label() missing 1 required positional argument: 'category'
```

| 정의 | 생략할 수 있나 | 선언상 `None`을 허용하나 | 실행 결과 |
| --- | --- | --- | --- |
| `greet(name: str = "친구")` | 예(기본값) | 아니오 | `greet(None)`도 **막지 않아** `안녕하세요, None` |
| `greet_optional(name: str \| None = None)` | 예(기본값 `None`) | 예 | `None`이면 본문의 `if name is None:`이 `"친구"`로 바꿈 |
| `category_label(category: str \| None)` | **아니오**(기본값 없음) | 예 | `category_label()` → `TypeError`(Argument 모자람) |

- 기본값은 **생략**에 대한 규칙이고, `str | None`은 **어떤 값을 기대하는지**에 대한 표시입니다. 둘은 따로 정합니다. `[확정 사실]`
- `greet(None)`에서 `None`이 그대로 문자열에 들어갔습니다. 선언이 `str`이어도 런타임은 막지 않고, `None`을 다루는 코드가 없었기 때문입니다. `None`을 허용하려면 `str | None`으로 **표시**하고, `if name is None:`처럼 **처리 코드**를 함께 씁니다.
- 예전 코드의 `Optional[str]`은 `str | None`과 같은 뜻입니다. 이름은 'Optional'이지만 '생략할 수 있는 Argument'라는 뜻이 아니라 '`None`일 수 있음'이라는 뜻입니다. `[확정 사실]`

### 9. 실제 미션 구현 사례 — `ledger` `[구현 사례]`

> `m03-pocket-money-ledger` `d14e812`(작업일 2026-10-23 원격 `main`과 같음 확인)에서 확인한 **한 가지 구현**입니다. 여러 교육생 중 한 사람의 구현이며, 모든 교육생이 같은 계층이나 클래스 구조를 가진다고 가정하지 않습니다. 아래 실행 결과는 `_tools/verify_ledger.py`가 저장소의 `ledger/`를 **임시 폴더**에 복사하고 빈 데이터 폴더에서 `add`로 거래 2건을 넣은 뒤 실행해 확인했습니다(실제 데이터 파일은 건드리지 않음).

**사례 1 — 목록 조회: 변환 · 표시 · 검증의 책임 분리**

| 위치 | 코드 | 역할 |
| --- | --- | --- |
| `ledger/cli.py` 32행 | `DEFAULT_LIST_LIMIT = 10` | 기본값 |
| `ledger/cli.py` 57행 | `p_list.add_argument("--limit", type=int, default=DEFAULT_LIST_LIMIT)` | 명령줄 문자열 → 정수 **변환**(argparse) |
| `ledger/cli.py` 202행 | `transactions = service.list_transactions(args.limit)` | 변환된 정수를 서비스에 Argument로 전달 |
| `ledger/services.py` 112행 | `def list_transactions(self, limit: int) -> list[Transaction]:` | Parameter `limit`의 Type Hint(**표시**)와 반환 Type Hint `list[Transaction]` |
| `ledger/services.py` 124~125행 | `if limit <= 0:` / `raise ValidationError(f"limit must be positive, got {limit}")` | 양수 **검증**(서비스) |

<!-- ledger-run: python -m ledger list --limit 10 | exit=0 -->
```text
$ python -m ledger list --limit 10
TX-000002 | 2026-10-21 | expense | 식비 | 4500 | 커피 | tags: 카페
TX-000001 | 2026-10-20 | expense | 식비 | 8000 | 점심
```

<!-- ledger-run: python -m ledger list --limit abc | exit=2 -->
```text
$ python -m ledger list --limit abc
usage: ledger list [-h] [--limit LIMIT]
ledger list: error: argument --limit: invalid int value: 'abc'
```

<!-- ledger-run: python -m ledger list --limit -2 | exit=1 -->
```text
$ python -m ledger list --limit -2
[오류] limit must be positive, got -2
[힌트] 입력값을 다시 확인하세요.
```

- 7절의 일반 예제와 **같은 구조와 같은 종료 코드**(0·2·1)입니다. `abc`는 argparse가, `-2`는 서비스의 검증이 막았습니다. `[구현 사례]`
- `-2`의 메시지가 영어(`limit must be positive, got -2`)이고 힌트가 일반 문구인 것은, `ledger`의 오류 문구 표(`ledger/decorators.py`의 `describe_error()`)에 이 `ValidationError`용 한국어 문구가 따로 없어 예외 메시지를 그대로 쓰기 때문입니다(코드의 설명 문자열에 그렇게 적혀 있음). `[구현 사례]`
- `[구현 사례]` 서비스의 `list_transactions()`는 argparse가 정수로 바꿔 준다고 기대합니다. 검증 도구로 문자열 `'10'`을 직접 넣어 보면 `if limit <= 0:`에서 `TypeError`가 납니다(아래 확인 결과). `limit: int`가 문자열을 바꿔 주지 않는다는 것은 7절과 같습니다.

**사례 2 — 금액 검증: `int | str`을 받아 정수로 정규화**

`ledger/validators.py` 53~67행:

```python
def validate_amount(value: int | str) -> int:
    ...
    if isinstance(value, str):
        try:
            value = int(value.strip())
        except ValueError:
            raise InvalidAmountError(f"amount must be an integer, got {value!r}") from None
    if not isinstance(value, int) or isinstance(value, bool):
        raise InvalidAmountError(f"amount must be an integer, got {value!r}")
    if value <= 0:
        raise InvalidAmountError(f"amount must be positive, got {value}")
    return value
```

(설명 문자열은 `...`로 줄임. 나머지는 원본 그대로)

- `int | str`은 **두 입력 형태를 받으려는 의도**를 표시합니다. 실제로 문자열을 정수로 바꾸는 것(`int(value.strip())`), `bool`을 막는 것, 0 이하를 막는 것은 **모두 함수 본문**이 합니다. 4절의 `runtime_validation.py`와 같은 구조입니다.
- 실제 호출 위치: `ledger/cli.py` 164행 `_prompt_amount()`는 `input()`으로 받은 **문자열**을, `ledger/services.py` 357행 CSV 가져오기는 CSV 칸의 **문자열**을, `ledger/services.py` 97·197·283행(거래 추가·수정·예산)은 **정수**(argparse `type=int` 또는 앞의 검증을 거친 값)를 넘깁니다. 두 형태가 실제로 모두 들어옵니다. `[구현 사례]`

**사례 3 — 데이터 모델: 필드의 Type Hint는 검증이 아니다**

| 위치 | 필드 | 표시하는 것 |
| --- | --- | --- |
| `ledger/models.py` 22~23행 · 37행 | `@dataclass class Transaction` · `amount: int  # 양의 정수` | 금액은 정수(‘양의’는 주석) |
| `ledger/models.py` 40행 | `tags: list[str] = field(default_factory=list)` | 태그는 문자열 리스트 |
| `ledger/models.py` 81~82행 · 98행 | `@dataclass class SearchCriteria` · `category: str \| None = None` | 분류 조건은 문자열이거나, 조건 없음(`None`) |

- `@dataclass`는 필드 목록을 보고 `__init__()`을 만들어 주지만(Scene 06 8절), **필드의 Type Hint로 값을 검사하지는 않습니다.** 검증 도구로 `Transaction(…, amount=-500, …, tags=['식비', 3])`을 직접 만들어 보면 오류 없이 만들어집니다(아래 확인 결과). `ledger`에서 금액이 양수임을 보장하는 것은 서비스가 거래를 만들기 **전에** 부르는 `validate_amount()`입니다. `[구현 사례]`
- `SearchCriteria.category: str | None = None`은 8절의 `greet_optional`과 같은 모양입니다. '검색할 때 분류 조건을 주지 않음'을 `None`으로 나타냅니다.
- `ledger`의 각 파일 맨 위에는 `from __future__ import annotations`가 있어 힌트가 **문자열로 보관**됩니다(`Transaction.__annotations__['amount']`가 `'int'`). 이 경우에도 실행 중 검사하지 않는 것은 같습니다. 입문 단계에서는 이 줄을 '힌트를 나중에 해석하도록 미루는 설정' 정도로만 알면 됩니다. `[구현 사례]`
- `ledger`의 설계·QA 문서는 '모든 공개 함수·필드에 Type Hint'를 코드 리뷰로 확인했고, **`mypy` 같은 정적 검사기는 실행하지 않았다**(표준 라이브러리만 허용)고 적었습니다. `[구현 사례]`

검증 도구가 실제 함수·클래스를 불러 확인한 결과입니다.

<!-- ledger-probe -->
```text
validate_amount(15000) → 15000
validate_amount('15000') → 15000
validate_amount(' 15000 ') → 15000
validate_amount('abc') → InvalidAmountError
validate_amount('3.5') → InvalidAmountError
validate_amount(3.5) → InvalidAmountError
validate_amount(True) → InvalidAmountError
validate_amount(0) → InvalidAmountError
validate_amount(-500) → InvalidAmountError
Transaction(…, amount=-500, …, tags=['식비', 3]) → 오류 없이 만들어짐: amount=-500, tags=['식비', 3]
Transaction.__annotations__['amount'] → 'int'
SearchCriteria().category → None
list_transactions('10') → TypeError: '<=' not supported between instances of 'str' and 'int'
```

### 10. 내 코드에서 찾아보기 (대면 강의 활동)

목적은 Type Hint가 있느냐를 평가하는 것이 아니라 **"내 함수는 어떤 값을 기대하고, 잘못된 값은 실제로 어디서 막는가?"** 를 자기 말로 설명하는 것입니다. **Type Hint가 없어도 틀린 것이 아닙니다.**

다음을 찾아 적습니다.

| 찾을 것 | 검색어·단서 | 적을 내용 |
| --- | --- | --- |
| 함수 하나의 Parameter | `def 이름(` | 받는 자리의 이름, 기본값이 있는지 |
| 그 함수를 부르는 Argument | 함수 이름으로 검색 | 무엇을 넣는지, 위치 인자인지 키워드 인자인지 |
| Type Hint | `: int`, `: str`, `-> ` | 무엇을 기대한다고 표시했는지 |
| `None` 허용 | `\| None`, `Optional`, `= None`, `is None` | `None`을 표시했는지, 처리하는 코드가 있는지 |
| 문자열 → 숫자 변환 | `int(`, `float(`, `type=int` | 어디서 바꾸는지(argparse인지 직접인지) |
| 실행 중 검사 | `if`, `isinstance`, `validate`, `check` | 무엇을 막는지(자료형인지 범위인지) |
| 오류 발생·처리 | `raise`, `except` | 어디서 거부하고 어디서 받아 출력하는지 |

| 파일·함수 | Parameter | 전달되는 Argument | Type Hint | 실제 검증 코드 |
| --- | --- | --- | --- | --- |
| | | | | |

| 내 코드의 모습 | 이렇게 읽습니다 |
| --- | --- |
| Type Hint가 **없음** | 정상입니다. 함수 하나를 골라 "여기에 어떤 타입 표시를 붙이면 읽기 쉬워질까?"를 말해 봅니다(실제로 고칠 필요는 없음) |
| Type Hint는 있는데 검사 코드가 없음 | 잘못된 값이 들어오면 무엇이 일어날지 예측해 봅니다(4절 `hint_not_validation.py`처럼 그대로 지나가는지) |
| `input()`으로 받아 `int()`로 바꿈 | argparse 대신 **직접 변환**하는 구조입니다. 변환 실패(`ValueError`)를 어디서 받는지 찾습니다 |
| 검증이 CLI 쪽에만 있음 | 틀린 것이 아닙니다. 같은 함수를 다른 곳(예: 파일 가져오기)에서 부를 때도 검증이 되는지 생각해 봅니다 |

**AI에게 물어볼 때 (보조 질문)** — AI가 알려 준 파일·줄 번호와 코드는 **직접 열어 확인**하고, 자기 말로 설명할 수 있어야 합니다. AI의 설명을 그대로 제출하지 않습니다.

- "이 프로젝트에서 함수 하나를 골라 Parameter, 그 함수를 부르는 곳의 Argument, 위치 인자·키워드 인자 여부를 줄 번호와 함께 보여 주세요."
- "Type Hint가 붙은 함수들을 찾고, 각 함수에서 **실행 중 실제로 값을 검사하는 줄**이 있는지 줄 번호로 구분해 주세요. 검사가 없으면 없다고 알려 주세요."
- "명령줄이나 `input()`으로 받은 문자열이 숫자로 바뀌는 곳과, 그 숫자의 범위를 검사하는 곳을 각각 찾아 주세요."
- "`None`을 기본값으로 쓰는 Parameter가 있나요? 그 함수 안에서 `None`을 처리하는 코드가 있는지 보여 주세요."

### 11. 한 문장 정리

> 함수 정의의 받는 자리가 **Parameter**, 호출할 때 넣은 값이 **Argument**이고, 위치 인자는 순서로·키워드 인자는 이름으로 연결됩니다. `amount: int`와 `-> int` 같은 **Type Hint는 기대하는 형태를 표시**해 읽는 사람과 도구를 돕지만 **실행 중 값을 막지 않으며**, argparse `type=int`는 문자열을 **변환**하고, 잘못된 값을 실제로 막는 것은 **`if`·`isinstance`로 쓴 검증 코드**입니다.

다음 장면(Scene 08)은 지금까지 본 개념을 개념지도로 연결하고 자기 코드 전체에서 찾아봅니다.

---

## 강사용 안내

> 대면 강의는 **우리 교육 모델에서 필수인 초기 학습 단계**(운영 선택)입니다. 시간 배분은 시범 운영 후 확정합니다.

**준비** — `drafts/b2-1-story-map/scene-07/_tools/demo/`를 실습 폴더로 복사하고 그 안에서 실행합니다. 표준 라이브러리만 쓰며 파일을 만들거나 바꾸지 않습니다. **Python 3.10 이상**이 필요합니다(`python --version`으로 먼저 확인). 출력은 Python 3.12.13(CPython), macOS에서 확인했습니다. 타입 검사기 설치는 필요 없습니다.

**권장 진행 순서와 멈출 지점**

| # | 보여 줄 것 | 멈추고 물을 것 |
| --- | --- | --- |
| 1 | `echo_amount.py`의 코드만 보여 줌 | "두 번째 호출에서 Python이 문자열을 거부할까?" 손을 들어 예측하게 합니다 |
| 2 | `python echo_amount.py` | "화면에는 둘 다 1000인데, 정말 같은 값일까?" → 타입·2배 결과 |
| 3 | `python parameter_argument.py`, 그림 A | 순서를 바꾼 호출 앞에서 "결과는? 그럼 맞게 부른 걸까?" 정의·호출에서 Parameter와 Argument를 학습자가 짚게 합니다 |
| 4 | `python type_hint_basics.py`, 그림 B | "`price: int`는 무엇을 말해 주나요?" 학습자가 말로 설명하게 한 뒤, 두 함수의 결과가 같음을 확인 |
| 5 | `python hint_not_validation.py` → `python runtime_validation.py`, 그림 D | "`-5`와 `True`는 선언과 맞나요? 그런데 왜 거부됐나요?" |
| 6 | 그림 C의 세 입력을 **실행 전에** 예측 | "`--limit abc`, `--limit -2`는 각각 어느 단계에서 멈추고, 누가 메시지를 낼까? 종료 코드는?" |
| 7 | `python argparse_vs_hint.py --limit 10` / `abc` / `-2`, `echo $?`(Windows PowerShell은 `$LASTEXITCODE`) | 예측과 비교. 이어서 `argparse_without_type.py`로 "`type=int`를 빼면?" |
| 8 | `python none_and_defaults.py`, `python typing_contract.py` | "`greet(None)`은 막힐까?" "`list[str]`는 원소를 검사할까?" |
| 9 | `ledger` 사례(9절) | "CLI·서비스·검증 함수는 각각 무엇을 책임지나?" |
| 10 | 내 코드에서 찾아보기 | 동의한 교육생 한 명의 코드로 표를 함께 채운 뒤 각자 진행 |

**두 가지 반대 방향의 오해를 모두 교정합니다.**

- "Type Hint가 있으면 검증 함수가 필요 없다" → 4절: 표시만 있는 함수는 여섯 값을 모두 통과시켰다. 규칙은 검사 코드가 지킨다.
- "Type Hint는 실행하지 않으니 쓸모없다" → 6절: 읽는 사람이 정의 한 줄로 기대 형식을 알고, 도구가 실행 전에 어긋난 사용을 알려 줄 수 있다. `ledger`도 모든 공개 함수에 썼다.

**흔한 오해와 교정**

| 학습자의 말 | 교정 |
| --- | --- |
| "`amount: int`라고 쓰면 문자열이 들어오면 오류가 나요" | 나지 않습니다. 런타임은 힌트를 강제하지 않습니다(`echo_amount.py`) |
| "Type Hint가 문자열을 정수로 바꿔 줘요" | 바꾸지 않습니다. 변환은 `int()`나 argparse `type=int`가 합니다(`argparse_without_type.py`) |
| "`-> int`가 값을 돌려줘요" | 돌려주는 것은 `return`입니다. `-> int`는 기대하는 반환 타입의 표시입니다 |
| "Parameter와 Argument는 같은 말이에요" | 정의의 받는 자리(이름) / 호출 때 넣은 값입니다 |
| "키워드 인자는 순서대로 들어가요" | 이름으로 들어갑니다. 순서로 들어가는 것은 위치 인자입니다 |
| "결과가 같으니 순서를 바꿔 넣어도 괜찮아요" | `calculate_total(3, 1000)`은 `price`에 3이 들어갔습니다. 어느 자리에 들어갔는지 확인합니다 |
| "`int`만 맞으면 금액은 안전해요" | `-5`·`True`도 `int` 선언과 맞습니다. 범위·`bool`은 따로 검사합니다 |
| "`list[str]`이면 원소도 검사해 줘요" | 원소를 검사하지 않습니다(`count_tags(['식비', 3])` → 2) |
| "기본값이 있으면 `None`도 넣어도 돼요" | 생략과 `None` 허용은 다릅니다(`greet(None)` → `안녕하세요, None`) |
| "`Optional`은 생략할 수 있다는 뜻이에요" | `None`일 수 있다는 뜻입니다(`str \| None`과 같음) |
| "argparse가 금액 범위까지 검사해요" | `type=int`는 변환입니다. 범위는 프로그램의 검증 코드가 맡습니다(이 예제와 `ledger`의 선택) |
| "`--limit abc`도 우리 프로그램이 `[오류]`를 내요" | argparse가 사용법과 `error:`를 내고 종료 코드 2로 끝냅니다. 서비스 함수는 호출되지 않습니다 |
| "`@dataclass`가 필드 타입을 검사해요" | `__init__()`을 만들 뿐 값은 검사하지 않습니다(`ledger` `Transaction(amount=-500)`이 만들어짐) |
| "IDE에 경고가 안 뜨니 제 코드는 타입이 다 맞아요" | 검사기마다·설정마다 찾는 범위가 다릅니다. 경고가 없다는 것이 올바르다는 증명은 아닙니다 |
| "제 코드에 Type Hint가 없어서 틀렸어요" | 틀린 것이 아닙니다. 어디에 붙이면 읽기 쉬워질지 말해 보면 됩니다 |

**수준 조절** — 입문 이전 학습자는 1~4절과 그림 A·D, 7절의 세 실행까지. 여유가 있으면 5·6·8절과 그림 B·C 전체, `argparse_without_type.py`로 확장합니다. 고급 `typing`, 위치 전용·키워드 전용 Parameter, 타입 검사기 설정은 다루지 않습니다. `bool`이 `int`의 하위 클래스라는 점은 "그래서 따로 막았다"까지만 설명합니다.

## 이해 확인 질문 (점수화하지 않음)

| # | 질문 | 확인할 내용 |
| --- | --- | --- |
| 1 | `calculate_total(1000, 3)`에서 Parameter와 Argument는 각각 무엇인가요? | `price`·`quantity` / `1000`·`3` |
| 2 | `calculate_total(quantity=3, price=1000)`과 `calculate_total(3, 1000)`은 각각 어떻게 연결되나요? | 이름으로 price=1000 / 순서로 price=3 |
| 3 | `amount: int`와 `-> int`는 각각 무엇을 설명하나요? 값을 돌려주는 것은 무엇인가요? | 받을 값·돌려줄 값의 기대 타입 / `return` |
| 4 | Type Hint는 실행 중 잘못된 값을 막나요? 근거가 된 실행 결과는? | 막지 않음 / `echo_amount.py`, `hint_not_validation.py` |
| 5 | `str \| None`, `list[str]`, `int \| str`는 무엇을 뜻하나요? 실행 중 검사하나요? | 문자열 또는 None / 문자열 원소의 리스트 / 정수 또는 문자열, 검사하지 않음 |
| 6 | argparse의 `type=int`는 실제로 무엇을 하나요? 실패하면? | 문자열 → 정수 변환 / argparse가 사용법·오류, 종료 코드 2 |
| 7 | `--limit -2`는 왜 `type=int`를 통과했는데 거부됐나요? 타입 변환과 업무 규칙 검증은 왜 다른가요? | 정수로는 바뀜 / 양수 규칙은 서비스의 검사 |
| 8 | 읽는 사람·IDE(타입 검사기)·Python 런타임은 Type Hint로 각각 무엇을 하나요? | 기대 형식 이해 / 실행 전 불일치 알림(범위는 도구마다 다름) / 보관만 |
| 9 | 내 코드에서 타입 표시가 있는 곳과 실제 검증이 있는 곳은 어디인가요? | 자기 코드의 파일·함수·줄 |

## 근거와 출처

| 내용 | 분류 | 출처 |
| --- | --- | --- |
| Parameter(함수 정의의 이름)와 Argument(호출할 때 넘긴 값), 위치 인자·키워드 인자 | 확정 사실 | [Glossary: parameter](https://docs.python.org/3/glossary.html#term-parameter), [argument](https://docs.python.org/3/glossary.html#term-argument), [FAQ: argument와 parameter의 차이](https://docs.python.org/3/faq/programming.html#what-is-the-difference-between-arguments-and-parameters) |
| 기본값, 키워드 인자, 키워드 인자는 위치 인자 뒤에 와야 함 | 확정 사실 | [Tutorial §4.9 More on Defining Functions](https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions) |
| 런타임은 함수·변수 annotation을 강제하지 않음, 타입 검사기·IDE 등이 사용 | 확정 사실 | [typing — Support for type hints](https://docs.python.org/3.12/library/typing.html) 첫머리 Note |
| `X \| Y`(Union), `X \| None`(= `Optional[X]`, 생략 가능한 Argument와는 다른 개념), `list[str]` | 확정 사실 | [typing: Union·Optional](https://docs.python.org/3.12/library/typing.html#typing.Optional), [Types: Union Type](https://docs.python.org/3/library/stdtypes.html#types-union), [Generic Alias Type](https://docs.python.org/3/library/stdtypes.html#types-genericalias) |
| 함수 annotation은 `__annotations__`에 보관 | 확정 사실 | [Reference §8.7 Function definitions](https://docs.python.org/3/reference/compound_stmts.html#function-definitions), [Annotations Best Practices](https://docs.python.org/3/howto/annotations.html) |
| `isinstance()`, `bool`은 `int`의 하위 클래스, `int()`의 문자열 변환·소수점 버림 | 확정 사실 | [Built-in Functions: isinstance·int·bool](https://docs.python.org/3/library/functions.html), 실행 확인 |
| argparse `type=` 변환, 변환 실패 시 오류·종료 코드 2, 음수 모양의 값 처리, `choices` | 확정 사실 | [argparse](https://docs.python.org/3/library/argparse.html) (type, choices, Arguments containing `-`, exit) |
| 1~8절의 모든 출력·종료 코드 | 확정 사실(실행 확인) | `_tools/demo/`, Python 3.12.13(CPython), macOS(Darwin 24.6.0), 2026-10-23. `_tools/verify_demo.py`가 원고·데모·그림과 실제 실행·연결(`inspect.signature().bind`)·호출 여부 추적·AST를 대조 |
| `\|` 문법은 Python 3.10 이상(3.9에서 정의 줄 `TypeError`) | 확정 사실(실행 확인) | macOS 기본 Python 3.9.6으로 `none_and_defaults.py`·`typing_contract.py` 실행 |
| 정적 타입 검사기가 실제로 어떤 경고를 내는지 | 미검증 | 이번 작업에서 검사기를 설치·실행하지 않음 |
| 변환·표시·검증으로 책임을 나누는 구성, 자료형 오류를 `ValueError`로 알리는 선택 | 설계 예시 | Python 문법·표준이 아닌 설계 선택 |
| `ledger`의 `--limit` `type=int`·`list_transactions(limit: int)`·양수 검증, `validate_amount(value: int \| str)`과 호출 위치, `Transaction`·`SearchCriteria` 필드, `from __future__ import annotations`, `mypy` 미실행 기록, 실행 결과·종료 코드 | 구현 사례 | `m03-pocket-money-ledger` `d14e812`: `ledger/cli.py`, `ledger/services.py`, `ledger/validators.py`, `ledger/models.py`, `ledger/decorators.py`, `ledger/errors.py`, `docs/m03-architecture-design.md`(타입 힌트 행), `docs/m03-final-qa-report.md`. `_tools/verify_ledger.py`로 임시 폴더에서 확인(2026-10-23) |
