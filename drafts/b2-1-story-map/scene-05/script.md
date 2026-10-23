# Scene 05 원고 — 데이터를 꼭 한꺼번에 꺼내야 할까? Iterable·Iterator·Generator는 무엇이 다를까?

> **상태:** 시안 · GPT 독립 콘텐츠 검토와 Owner 승인 전. 기준: [시나리오 v2](../scenario-v2.md) · 2026-10-23
> **그림:** [노트북용](generator-stream-desktop.svg) · [휴대전화용](generator-stream-mobile.svg) · 설계는 [design-notes.md](design-notes.md) · 데모 코드 `_tools/demo/`

| 항목 | 내용 |
| --- | --- |
| 학습 질문 | **데이터를 꼭 한꺼번에 꺼내야 할까? Iterable·Iterator·Generator는 무엇이 다를까?** |
| 도달 기준 | Iterable과 Iterator의 차이, `for`·`iter()`·`next()`·`StopIteration`의 관계, Generator가 Iterator의 한 종류인 이유, `yield`가 실행 상태를 보존하는 원리를 자기 말로 설명하고 작은 코드로 확인한다. 같은 JSONL 파일을 **읽는 방법과 결과를 보관하는 방법**에 따라 메모리에 남는 양이 달라짐을 설명하고, 자기 코드에서 **어디서 읽고, 읽은 것을 어디에 얼마나 보관하는지** 찾아 말할 수 있다 |
| 이전 장면과의 관계 | Scene 04는 파일 저장과 JSON·JSONL·CSV를 다뤘고, "JSONL은 한 줄씩 **처리할 수 있는** 형식일 뿐 메모리를 아껴 주는 기능은 아니다"로 끝났다. 이 장면은 그 '처리하는 방법'을 Python의 반복 원리부터 설명한다 |
| 이 장면의 범위 | Iterable·Iterator·Generator의 정의와 포함 관계, `iter()`·`next()`·`StopIteration`, `yield`의 일시정지·재개, JSONL을 읽는 Generator, 결과를 소비하는 다섯 가지 방식, Generator와 파일 수명 |
| 다루지 않음 | Generator 표현식, `yield from`, `send()`, 비동기 Generator, 사용자 정의 Iterator 클래스, 측정하지 않은 성능 수치. Decorator는 Scene 06 |
| 공식 목표 대응 `[요구 추적]` | **목표 3 '`yield` 기반 Generator와 대용량 파일 스트리밍 처리 원리'의 주 장면.** 목표 1(JSONL 저장)은 Scene 04와 이어진다 |
| 근거 표기 | `[확정 사실]` 공식 문서 + 실행 확인 · `[단순화]` · `[설계 예시]` Python 문법이 아닌 설계 선택 · `[구현 사례]` `ledger` · `[학습용 예제]` 이 장면을 위해 만든 독립 예제 |

> 이 장면의 예제(`iterable_iterator.py`, `two_iterators.py`, `generator_steps.py`, `yield_vs_return.py`, `jsonl_generator.py`, `five_ways.py`, `file_lifetime.py`)는 **Python의 반복 원리를 보여 주려고 만든 독립적인 학습용 예제**입니다. 실제 `ledger` 소스나 공식 미션의 정답 구현이 아닙니다. 예제는 함께 있는 `transactions.jsonl`·`broken.jsonl`을 **읽기만** 하고 어떤 파일도 쓰지 않습니다. `[학습용 예제]`

---

## 학습자 원고

### 1. 질문 — 거래가 10만 건이라면?

Scene 04의 마지막 질문에서 시작합니다.

> 거래 데이터가 **10만 건**이라면, 목록 일부를 확인하거나 합계를 계산하려고 할 때마다 전체 데이터를 메모리에 올려야 할까?

합계를 내려면 모든 거래의 금액을 한 번씩은 봐야 합니다. 하지만 **"한 번씩 본다"와 "전부 메모리에 모아 둔다"는 같은 일이 아닙니다.** 둘을 나누려면 먼저 Python이 여러 값을 **하나씩 꺼내는 원리**를 알아야 합니다. 이 장면은 파일 처리로 바로 들어가지 않고, 리스트 `[10, 20, 30]`으로 그 원리부터 봅니다.

### 2. Iterable — 반복할 수 있는 대상

**Iterable**(이터러블)은 '반복할 수 있는(iterate + able)' 대상, 즉 **값을 하나씩 차례로 내줄 수 있는 객체**입니다. 리스트·문자열·튜플·딕셔너리·파일 객체가 모두 Iterable입니다. `for`문의 `in` 뒤에 올 수 있는 것이 Iterable입니다. `[확정 사실]`

`iter(Iterable)`을 부르면 **Iterator**를 얻습니다. Iterator는 '지금 어디까지 꺼냈는지'를 기억하며 `next()`를 부를 때마다 다음 값을 하나 내줍니다(3절). `[확정 사실]`

<!-- demo:iterable_iterator.py -->
```python
"""Iterable과 Iterator: iter()로 Iterator를 얻고, next()로 하나씩 꺼낸다."""
numbers = [10, 20, 30]

for n in numbers:
    print("for:", n)

try:
    next(numbers)
except TypeError as error:
    print("next(numbers) →", type(error).__name__, "-", error)

it = iter(numbers)
print("iter(numbers)의 종류:", type(it).__name__)
print("next(it) →", next(it))
print("next(it) →", next(it))
print("next(it) →", next(it))
try:
    next(it)
except StopIteration:
    print("next(it) → StopIteration (더 꺼낼 값이 없음)")
print("iter(it) is it →", iter(it) is it)
print("리스트는 그대로:", numbers)

it = iter(numbers)
while True:
    try:
        n = next(it)
    except StopIteration:
        break
    print("풀어 쓴 for:", n)
```

<!-- run: python iterable_iterator.py | exit=0 -->
```text
$ python iterable_iterator.py
for: 10
for: 20
for: 30
next(numbers) → TypeError - 'list' object is not an iterator
iter(numbers)의 종류: list_iterator
next(it) → 10
next(it) → 20
next(it) → 30
next(it) → StopIteration (더 꺼낼 값이 없음)
iter(it) is it → True
리스트는 그대로: [10, 20, 30]
풀어 쓴 for: 10
풀어 쓴 for: 20
풀어 쓴 for: 30
```

읽을 때 짚을 점 `[확정 사실]`

- **리스트에 바로 `next()`를 쓸 수 없습니다**(`'list' object is not an iterator`). 리스트는 값을 **담고 있는** Iterable이지, '어디까지 꺼냈는지'를 기억하는 Iterator가 아닙니다.
- `iter(numbers)`가 돌려준 `list_iterator`가 Iterator입니다. `next()`를 세 번 부르면 10·20·30이 나오고, 네 번째에는 **`StopIteration`** 예외로 "더 없음"을 알립니다.
- 다 꺼낸 뒤에도 **리스트는 그대로**입니다. 꺼내면서 바뀐 것은 Iterator의 진행 위치뿐입니다.
- **`for`문이 하는 일**은 위 마지막 부분처럼 풀어 쓸 수 있습니다. `for`는 `in` 뒤의 대상에서 `iter()`로 Iterator를 얻고, `next()`로 값을 하나씩 받다가 `StopIteration`이 나면 **오류로 끝내지 않고 반복을 정상 종료**합니다. `[단순화]` 실제 `for`는 인터프리터 안에서 처리되며 코드가 이렇게 바뀌는 것은 아닙니다.

### 3. Iterator — 현재 위치를 기억하는 객체 (그림 A)

**Iterator**(이터레이터)는 **데이터를 하나씩 내주며 현재 진행 위치를 기억하는 객체**입니다. `next()`를 부르면 다음 값을 돌려주고, 더 없으면 `StopIteration`을 냅니다. `[확정 사실]`

같은 리스트에서 Iterator를 두 개 만들어 순서를 섞어 `next()`를 불러 봅니다.

<!-- demo:two_iterators.py -->
```python
"""같은 리스트에서 만든 두 Iterator는 진행 위치를 따로 기억한다."""
numbers = [10, 20, 30]
a = iter(numbers)
b = iter(numbers)

print("next(a) →", next(a))
print("next(a) →", next(a))
print("next(b) →", next(b))
print("next(a) →", next(a))
print("next(b) →", next(b))

print("a와 b는 같은 객체?", a is b)
print("a에 남은 값:", list(a))
print("b에 남은 값:", list(b))
print("리스트는 그대로:", numbers)
```

<!-- run: python two_iterators.py | exit=0 -->
```text
$ python two_iterators.py
next(a) → 10
next(a) → 20
next(b) → 10
next(a) → 30
next(b) → 20
a와 b는 같은 객체? False
a에 남은 값: []
b에 남은 값: [30]
리스트는 그대로: [10, 20, 30]
```

- `a`가 20까지 간 뒤에 `b`를 처음 부르면 `b`는 **10부터** 시작합니다. 리스트에서 `iter()`를 부를 때마다 **새 Iterator**가 만들어지고, 각자 진행 위치를 따로 기억합니다.
- 마지막에 `a`에는 남은 값이 없고 `b`에는 30이 남아 있습니다. 데이터(리스트)는 하나, 진행 상태(Iterator)는 둘입니다.
- **Iterator도 Iterable입니다.** Iterator에 `iter()`를 부르면 **자기 자신**을 돌려주므로(`iter(it) is it → True`) `for`문에 그대로 쓸 수 있습니다. 그래서 '반복할 수 있는 것(Iterable)' 안에 '진행 위치를 가진 것(Iterator)'이 들어 있는 **포함 관계**입니다. `[확정 사실]`
- 이 두 성질은 Python 안에서 메서드 이름으로 약속되어 있습니다. `iter()`는 객체의 `__iter__()`를, `next()`는 `__next__()`를 부릅니다. Iterator는 두 메서드를 모두 가집니다. 이 장면은 직접 Iterator 클래스를 만들지 않습니다. `[확정 사실]`

그림 A는 하나의 리스트에서 `iter()`로 만든 Iterator `a`·`b`가 각자 다른 위치를 가리키는 모습과, 실제 호출 다섯 번의 순서를 보여 줍니다. 아래쪽의 겹친 상자는 Iterable ⊃ Iterator ⊃ Generator의 **포함 관계**이며, 순서가 아니므로 번호를 붙이지 않았습니다.

### 4. Generator — `yield`를 만나면 멈췄다가 이어 가기 (그림 B)

본문에 **`yield`가 들어 있는 함수**를 **Generator 함수**라고 합니다. Generator 함수를 호출하면 본문을 실행하는 대신 **Generator 객체**를 돌려줍니다. Generator 객체는 Iterator이므로 `next()`로 값을 꺼냅니다. `[확정 사실]`

<!-- demo:generator_steps.py -->
```python
"""Generator: 호출하면 Generator 객체만 생기고, next()마다 yield까지 실행한 뒤 멈춘다."""


def count_up(limit):
    print("  [본문] 실행 시작")
    n = 1
    while n <= limit:
        print(f"  [본문] n = {n} · yield 직전")
        yield n
        print(f"  [본문] n = {n} · yield 다음 줄에서 재개")
        n = n + 1
    print("  [본문] while이 끝남 → 함수 끝")


gen = count_up(3)
print("count_up(3) 호출 직후:", type(gen).__name__, "(본문은 아직 실행되지 않음)")

for k in range(1, 5):
    print(f"--- next() {k}번째")
    try:
        value = next(gen)
        print("밖에서 받은 값:", value)
    except StopIteration:
        print("StopIteration → 더 꺼낼 값이 없음")
```

<!-- run: python generator_steps.py | exit=0 -->
```text
$ python generator_steps.py
count_up(3) 호출 직후: generator (본문은 아직 실행되지 않음)
--- next() 1번째
  [본문] 실행 시작
  [본문] n = 1 · yield 직전
밖에서 받은 값: 1
--- next() 2번째
  [본문] n = 1 · yield 다음 줄에서 재개
  [본문] n = 2 · yield 직전
밖에서 받은 값: 2
--- next() 3번째
  [본문] n = 2 · yield 다음 줄에서 재개
  [본문] n = 3 · yield 직전
밖에서 받은 값: 3
--- next() 4번째
  [본문] n = 3 · yield 다음 줄에서 재개
  [본문] while이 끝남 → 함수 끝
StopIteration → 더 꺼낼 값이 없음
```

`[본문]` 줄은 실행 시점을 보이려고 넣은 **학습용 출력**입니다. 실제 코드에서는 넣지 않습니다.

| 시점 | 본문에서 실행된 부분 | 밖으로 나온 값 | 그 뒤 상태 |
| --- | --- | --- | --- |
| `count_up(3)` 호출 | **없음** — `[본문]` 출력이 하나도 없다 | — | 생성됨(아직 시작 전) |
| `next()` 1번째 | 처음부터 첫 `yield`까지 | 1 | `yield`에서 **일시정지** · `n = 1` 보관 |
| `next()` 2번째 | `yield` **다음 줄부터** 다음 `yield`까지 | 2 | 일시정지 · `n = 2` |
| `next()` 3번째 | 같음 | 3 | 일시정지 · `n = 3` |
| `next()` 4번째 | 재개 → `while` 조건 거짓 → 함수 끝 | 없음(`StopIteration`) | **종료** |

읽을 때 짚을 점 `[확정 사실]`

- **호출과 실행은 다릅니다.** `count_up(3)`은 Generator 객체를 만들 뿐이고, 본문은 **첫 번째 `next()`에서 시작**합니다.
- **`yield n`은 값을 밖으로 내보내고 그 자리에서 멈춥니다.** 다음 `next()`는 처음부터가 아니라 **멈춘 `yield`의 다음 줄부터** 이어 갑니다.
- **지역변수와 실행 위치가 보존됩니다.** 2번째 호출의 첫 출력이 `n = 1 · yield 다음 줄에서 재개`인 것은 멈출 때의 `n` 값과 위치가 그대로 남아 있었기 때문입니다.
- **함수 끝에 도달하면** `next()`는 `StopIteration`을 냅니다. `for`문으로 소비하면 여기서 반복이 정상 종료됩니다.

그림 B는 `next()` 호출(번호가 붙은 실선)마다 **실행된 구간**, **밖으로 나온 값**, **멈춘 위치와 보관된 `n`** 을 따로 표시합니다.

### 5. `return`과 `yield`, 그리고 포함 관계

<!-- demo:yield_vs_return.py -->
```python
"""return과 yield의 차이, 그리고 Iterable ⊃ Iterator ⊃ Generator의 포함 관계."""
from collections.abc import Iterable, Iterator


def first_with_return(limit):
    n = 1
    while n <= limit:
        return n
        n = n + 1  # return에서 함수가 끝나므로 이 줄은 실행되지 않는다


def numbers_with_yield(limit):
    n = 1
    while n <= limit:
        yield n
        n = n + 1


print("return 함수 호출 →", first_with_return(3))
print("yield 함수 호출 →", type(numbers_with_yield(3)).__name__)
print("yield 함수를 for로 소비 →", list(numbers_with_yield(3)))

for name, value in [("리스트", [10, 20, 30]), ("iter(리스트)", iter([10, 20, 30])), ("Generator", numbers_with_yield(3))]:
    print(f"{name}: Iterable? {isinstance(value, Iterable)} · Iterator? {isinstance(value, Iterator)}")
```

<!-- run: python yield_vs_return.py | exit=0 -->
```text
$ python yield_vs_return.py
return 함수 호출 → 1
yield 함수 호출 → generator
yield 함수를 for로 소비 → [1, 2, 3]
리스트: Iterable? True · Iterator? False
iter(리스트): Iterable? True · Iterator? True
Generator: Iterable? True · Iterator? True
```

| | `return` | `yield` |
| --- | --- | --- |
| 함수를 호출하면 | 본문이 바로 실행된다 | Generator 객체만 돌려준다(본문은 `next()` 때) |
| 만나면 | 값을 돌려주고 **함수가 끝난다**. 지역변수는 사라진다 | 값을 내보내고 **멈춘다**. 지역변수와 위치가 남는다 |
| 값의 개수 | 호출 한 번에 하나 | `next()`마다 하나씩, 여러 개 |

- `collections.abc`의 `Iterable`·`Iterator`로 확인하면, 리스트는 Iterable이지만 Iterator가 아니고, `iter(리스트)`와 Generator는 **둘 다**입니다. **Generator는 Iterator의 한 종류**이고, Iterator와 대립하는 별개의 구조가 아닙니다. `[확정 사실]`
- `list(Generator)`는 Generator가 내놓는 값을 **끝까지 받아 리스트 하나에 모읍니다**(7절에서 메모리 관점으로 다시 봄).

### 6. JSONL + Generator — 파일 한 줄씩 dict로 내보내기 (그림 C)

Scene 04의 JSONL 파일(`transactions.jsonl`, 거래 3건)을 Generator로 읽습니다.

<!-- file: transactions.jsonl -->
```jsonl
{"id":1,"category":"식비","amount":8000}
{"id":2,"category":"교통","amount":2000}
{"id":3,"category":"문구","amount":3000}
```

<!-- demo:jsonl_generator.py -->
```python
"""JSONL + Generator: 파일 한 줄 → json.loads() → dict → yield → 소비하는 코드."""
import json


def read_transactions(path):
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            yield json.loads(line)


rows = read_transactions("transactions.jsonl")
print("read_transactions() 호출 직후:", type(rows).__name__)
for row in rows:
    print("받은 값:", type(row).__name__, "· id", row["id"], "·", row["category"], "·", row["amount"])

total = 0
for row in read_transactions("transactions.jsonl"):
    total = total + row["amount"]
print("합계:", total)

with open("transactions.jsonl", "r", encoding="utf-8") as f:
    print("파일 객체도 Iterator? iter(f) is f →", iter(f) is f)
    print("next(f) → 한 줄 문자열:", repr(next(f)))

try:
    for row in read_transactions("broken.jsonl"):
        print("broken.jsonl에서 받은 값: id", row["id"])
except json.JSONDecodeError as error:
    print("잘못된 줄에서 멈춤:", type(error).__name__, "-", error.msg)
```

<!-- run: python jsonl_generator.py | exit=0 -->
```text
$ python jsonl_generator.py
read_transactions() 호출 직후: generator
받은 값: dict · id 1 · 식비 · 8000
받은 값: dict · id 2 · 교통 · 2000
받은 값: dict · id 3 · 문구 · 3000
합계: 13000
파일 객체도 Iterator? iter(f) is f → True
next(f) → 한 줄 문자열: '{"id":1,"category":"식비","amount":8000}\n'
broken.jsonl에서 받은 값: id 1
잘못된 줄에서 멈춤: JSONDecodeError - Expecting ',' delimiter
```

**흐름과 변환을 나눠 봅니다(그림 C).**

| 구분 | 내용 |
| --- | --- |
| 데이터 변환(모양이 바뀜) | 파일의 한 줄 → `for line in f`가 내준 **문자열**(`'{"id":1,…}\n'`) → `json.loads()` → **dict** |
| 실행 순서(누가 언제 움직임) | ① 소비하는 `for`가 `next()`를 요청 → ② Generator가 멈춘 곳에서 재개해 파일에서 한 줄을 꺼냄 → ③ `json.loads()` → ④ `yield`로 dict를 내보내고 멈춤 → ⑤ 소비하는 코드가 그 dict를 처리(합계에 더함) → 다시 ① |

읽을 때 짚을 점

- **파일 객체는 그 자체로 Iterator입니다**(`iter(f) is f → True`). `for line in f`는 Generator 없이도 한 줄씩 읽습니다. Generator가 하는 일은 그 위에 **빈 줄 건너뛰기와 `json.loads()` 변환을 더해 dict를 하나씩 건네는 것**입니다. `[확정 사실]`
- 소비하는 쪽(합계 계산)은 **합계 하나만 보관**합니다. 앞 줄의 dict는 다음 줄을 처리할 때 다시 쓰이지 않습니다.
- **예외 처리 범위(이 예제의 의도):** 빈 줄은 건너뜁니다. **잘못된 JSON 줄은 건너뛰지 않고** `JSONDecodeError`로 멈춥니다. 그 앞까지 받은 값(id 1)은 이미 처리된 상태입니다. 잘못된 줄을 건너뛸지, 줄 번호를 알려 주며 멈출지는 프로그램이 정할 규칙입니다. 파일이 끝나면 `for`가 끝나고 `with`를 빠져나오며 Generator도 종료됩니다. `[학습용 예제]`
- 이 Generator는 `with open(…)` **안에서** `yield`합니다. 그래서 다 소비하기 전까지 파일이 열려 있습니다(8절).

### 7. 메모리 활용 다섯 가지 비교 (그림 D)

같은 파일을 다섯 가지 방식으로 소비하고, **꺼낸 줄 수**와 **메모리에 남긴 거래 수**를 셉니다.

<!-- demo:five_ways.py -->
```python
"""같은 JSONL 파일을 다섯 가지 방식으로 소비하고, 꺼낸 줄 수와 메모리에 남긴 거래 수를 센다."""
import json
from collections import deque

PATH = "transactions.jsonl"
taken = {"줄": 0}  # 관찰용: Generator가 파일에서 꺼낸 줄 수


def read_transactions(path):
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            taken["줄"] = taken["줄"] + 1
            yield json.loads(line)


def ids(rows):
    result = []
    for row in rows:
        result.append(row["id"])
    return result


with open(PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()
rows = []
for line in lines:
    rows.append(json.loads(line))
print(f"방식 1 · 전부 읽어 리스트에: 꺼낸 줄 {len(lines)} · 남긴 거래 {len(rows)} · id {ids(rows)}")

count = 0
total = 0
with open(PATH, "r", encoding="utf-8") as f:
    for line in f:
        count = count + 1
        total = total + json.loads(line)["amount"]
print(f"방식 2 · 한 줄씩 바로 처리: 꺼낸 줄 {count} · 남긴 거래 0 · 합계 {total}")

taken["줄"] = 0
gen = read_transactions(PATH)
first = next(gen)
print(f"방식 3 · Generator 일부만 next(): 꺼낸 줄 {taken['줄']} · 남긴 거래 1 · id [{first['id']}]")
gen.close()

taken["줄"] = 0
rows = list(read_transactions(PATH))
print(f"방식 4 · list(Generator): 꺼낸 줄 {taken['줄']} · 남긴 거래 {len(rows)} · id {ids(rows)}")

taken["줄"] = 0
recent = deque(maxlen=2)
for row in read_transactions(PATH):
    recent.append(row)
print(f"방식 5 · deque(maxlen=2): 꺼낸 줄 {taken['줄']} · 남긴 거래 {len(recent)} · id {ids(recent)}")
```

<!-- run: python five_ways.py | exit=0 -->
```text
$ python five_ways.py
방식 1 · 전부 읽어 리스트에: 꺼낸 줄 3 · 남긴 거래 3 · id [1, 2, 3]
방식 2 · 한 줄씩 바로 처리: 꺼낸 줄 3 · 남긴 거래 0 · 합계 13000
방식 3 · Generator 일부만 next(): 꺼낸 줄 1 · 남긴 거래 1 · id [1]
방식 4 · list(Generator): 꺼낸 줄 3 · 남긴 거래 3 · id [1, 2, 3]
방식 5 · deque(maxlen=2): 꺼낸 줄 3 · 남긴 거래 2 · id [2, 3]
```

`taken`은 Generator가 꺼낸 줄을 세는 **관찰용 코드**입니다. '방식 1~5'는 이름표이고 실행 순서가 아닙니다(그림 D에도 번호 원을 쓰지 않음).

| 방식 | 핵심 관찰 | 거래 N건일 때 결과로 **남기는** 거래 | 파일에서 꺼내는 줄 |
| --- | --- | --- | --- |
| 방식 1 `readlines()` + 리스트 | 전체 데이터를 보관 | N건(줄 목록도 N개) | N줄 |
| 방식 2 `for line in f`로 바로 처리 | 처리한 결과 전체를 보관할 필요가 없음(합계 하나) | 0건 | N줄 |
| 방식 3 Generator를 `next()`로 일부만 | 필요한 지점까지만 진행 | 꺼낸 k건 이하 | k줄 |
| 방식 4 `list(Generator)` | 읽기는 한 줄씩이어도 **결과 전체를 보관** | N건 | N줄 |
| 방식 5 `deque(maxlen=limit)` | 남기는 개수를 **limit개로 제한** | limit건 | **N줄**(마지막 limit건을 알려면 끝까지 읽어야 함) |

추가 메모리를 '남기는 거래 수'로 나타내면 방식 1·4는 O(N), 방식 2는 O(1)(합계 몇 개), 방식 3은 O(k), 방식 5는 O(limit)입니다. `[단순화]` 거래 한 건의 크기는 같다고 보고, 파일 객체·지금 읽는 줄·파싱 결과·파일의 내부 버퍼처럼 **어느 방식이든 쓰는 최소한의 메모리**는 빼고 센 것입니다.

반드시 함께 기억할 것

- **JSONL은 저장 형식, Generator는 실행 방식입니다.** JSONL이라서 메모리를 아끼는 것도, Generator를 썼다고 아끼는 것도 아닙니다. 방식 2는 Generator 없이 아꼈고, 방식 4는 Generator를 쓰고도 전부 모았습니다. **결과를 어디에 얼마나 보관하느냐**가 정합니다. `[확정 사실]`(실행 확인)
- **`list(Generator)`는 Generator가 내놓은 값을 모두 리스트에 모읍니다.** 읽는 방식이 한 줄씩이라는 것과 메모리에 남는 양은 별개입니다.
- **`deque(maxlen=N)`은 가장 최근 N개만 남기지만**, 그 N개가 무엇인지 알려면 **파일을 끝까지 읽어야** 할 수 있습니다(방식 5도 3줄을 모두 꺼냄). 가득 찬 상태에서 새 값을 넣으면 반대쪽 끝의 값이 버려집니다. `[확정 사실]`
- **보관량을 줄이는 것과 빨라지는 것은 다릅니다.** 방식 1·2·4·5는 모두 N줄을 끝까지 읽습니다. 데이터가 많을수록 **처리 시간은 늘어날 수 있습니다.** 이 장면은 속도를 측정하지 않았으므로 '몇 초 빨라진다' 같은 말은 하지 않습니다. `[단순화]`
- **'꺼낸 줄'은 Python 코드가 받은 줄 수입니다.** 파일 객체는 내부적으로 더 큰 덩어리(버퍼)로 미리 읽어 둘 수 있어, 방식 3에서 1줄만 꺼냈어도 운영체제 수준에서는 더 많이 읽었을 수 있습니다. `[확정 사실]`(io 문서) 세부 크기는 다루지 않습니다.
- **CSV도 순차 처리할 수 있습니다.** `csv.reader`·`csv.DictReader`도 행을 하나씩 내주는 Iterator입니다. 다만 CSV의 **논리적 레코드(행) 하나가 파일의 물리적 한 줄과 항상 같지는 않습니다**(따옴표 안의 줄바꿈, Scene 04 6절). `[확정 사실]`

### 8. Generator와 파일 수명 — 열어 둔 채 멈출 수 있다

6절의 Generator는 `with open(…)` 안에서 `yield`합니다. **`yield`에서 멈춰 있는 동안에는 아직 `with` 블록 안**이므로 파일이 열려 있습니다.

<!-- demo:file_lifetime.py -->
```python
"""Generator와 파일 수명: with 안에서 yield하면, 끝까지 쓰거나 정리하기 전까지 파일이 열려 있다."""
import json
from contextlib import closing

opened = []  # 관찰용: Generator가 연 파일 객체


def read_transactions(path):
    print("  [본문] open() 실행")
    with open(path, "r", encoding="utf-8") as f:
        opened.append(f)
        for line in f:
            if line.strip():
                yield json.loads(line)
    print("  [본문] with를 빠져나옴")


gen = read_transactions("transactions.jsonl")
print("호출 직후 연 파일 수:", len(opened))
print("next(gen) → id", next(gen)["id"])
print("일시정지 중 파일이 닫혔나?", opened[0].closed)
for row in gen:
    pass
print("끝까지 순회한 뒤 닫혔나?", opened[0].closed)

opened.clear()
gen = read_transactions("transactions.jsonl")
for row in gen:
    print("찾은 거래 id", row["id"], "→ break")
    break
print("break 뒤(gen 변수는 남아 있음) 닫혔나?", opened[0].closed)
gen.close()
print("gen.close() 뒤 닫혔나?", opened[0].closed)

opened.clear()
with closing(read_transactions("transactions.jsonl")) as rows:
    print("closing() 안에서 next(rows) → id", next(rows)["id"])
print("closing() 블록을 벗어난 뒤 닫혔나?", opened[0].closed)

with open("transactions.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        if json.loads(line)["id"] == 1:
            break
print("yield 없이 with 안에서 순회하다 break → with 밖에서 닫혔나?", f.closed)
```

<!-- run: python file_lifetime.py | exit=0 -->
```text
$ python file_lifetime.py
호출 직후 연 파일 수: 0
  [본문] open() 실행
next(gen) → id 1
일시정지 중 파일이 닫혔나? False
  [본문] with를 빠져나옴
끝까지 순회한 뒤 닫혔나? True
  [본문] open() 실행
찾은 거래 id 1 → break
break 뒤(gen 변수는 남아 있음) 닫혔나? False
gen.close() 뒤 닫혔나? True
  [본문] open() 실행
closing() 안에서 next(rows) → id 1
closing() 블록을 벗어난 뒤 닫혔나? True
yield 없이 with 안에서 순회하다 break → with 밖에서 닫혔나? True
```

- **호출 때가 아니라 첫 `next()` 때 `open()`이 실행됩니다**(호출 직후 연 파일 수 0). Generator 안의 `with`도 본문의 일부이기 때문입니다.
- **끝까지 순회하면** `with`를 빠져나오며 파일이 닫힙니다.
- **일부만 소비하고 멈추면 파일이 열린 채 남습니다.** `break`로 반복을 그만둬도 `gen` 변수가 Generator를 붙잡고 있으면 Generator는 `yield`에서 멈춘 상태 그대로입니다.
- **명시적으로 정리하는 방법:** `gen.close()`를 부르면 멈춘 위치에서 Generator를 끝내고 `with`가 파일을 닫습니다. 처음부터 `with closing(Generator) as rows:`로 쓰면 블록을 벗어날 때 자동으로 `close()`가 불립니다. `[확정 사실]`
- 변수를 지우거나 다른 값을 넣어 Generator를 더 쓰지 않게 되었을 때 언제 정리되는지는 **Python 구현에 따라 다를 수 있습니다.** 이 환경(CPython)에서는 참조가 사라지면 곧바로 정리되는 것을 관찰했지만(9절 `get_by_id()`), 모든 구현에서 즉시 닫힌다고 보장되지는 않습니다. 파일처럼 **정리가 필요한 자원**을 일부만 쓸 때는 명시적으로 정리합니다. `[확정 사실]`(언어 문서), 관찰은 `[구현 사례]`
- 비교: Generator 없이 **`with` 블록 안에서 순회하다 `break`하면** 블록을 벗어날 때 바로 닫힙니다. 파일을 여는 범위와 읽는 범위가 한 블록 안에 있기 때문입니다.

### 9. 실제 미션 구현 사례 — `ledger` `[구현 사례]`

> `m03-pocket-money-ledger` `d14e812`(원격 `main`과 같음 확인)에서 확인한 **한 가지 구현**입니다. 정답 구조라는 뜻이 아니며, 다른 교육생이 같은 파일·계층·함수 이름을 쓴다고 가정하지 않습니다. 아래 동작은 이 장면 작업에서 **임시 폴더에 만든 데이터**로 실행해 확인했습니다.

**핵심 질문: 왜 같은 `iter_all()`을 쓰는데 어떤 기능은 조금만 남기고, 어떤 기능은 많은 결과를 리스트에 담을까?**

| 위치 | 하는 일 | 읽는 방식 | 남기는 것 |
| --- | --- | --- | --- |
| `ledger/repository.py` `_iter_jsonl()` | `with path.open("r")` 안에서 한 줄씩 읽어 빈 줄은 건너뛰고 `json.loads()` 결과를 `yield`. 잘못된 줄은 줄 번호와 함께 `DataFormatError` | Generator(6절 `read_transactions()`와 같은 원리) | 없음 — 한 건씩 내보냄 |
| `TransactionRepository.iter_all()` | `_iter_jsonl()`이 내준 dict를 `Transaction.from_dict()`로 바꿔 다시 `yield` | Generator가 Generator를 소비 | 없음 |
| `LedgerService.list_transactions(limit)` | `iter_all()`을 끝까지 돌며 `deque(maxlen=limit)`에 넣고 뒤집어 리스트로 돌려줌 | 파일 끝까지 | **최근 limit건**(7절 방식 5) |
| `LedgerService.search(criteria)` | 조건에 맞는 거래만 `matches` 리스트에 `append()` 뒤 뒤집음 | 파일 끝까지 | **조건에 맞는 거래 모두**(조건에 맞지 않는 거래는 바로 버림) |
| `TransactionRepository.update()`·`delete()` | 모든 거래를 순회하며 바꾼(뺀) 목록 `records`를 만든 뒤 임시 파일에 전체를 씀(Scene 04) | 파일 끝까지 | **다시 쓸 거래 전체**(7절 방식 1·4와 같은 보관량) |
| `LedgerService.export_csv()` | `for transaction in self.transactions.iter_all():` 안에서 조건에 맞으면 바로 `writer.writerow()` | 파일 끝까지 | 결과 목록을 만들지 않음(7절 방식 2와 같은 방식) |

- **답:** `iter_all()`은 **읽는 방법**만 정합니다. 남기는 양은 **각 기능이 받은 값을 어떻게 다루는지**가 정합니다. 최근 목록은 개수를 제한했고(`deque`), 검색은 최신순으로 보여 주려고 맞는 결과를 모두 모았고(`list`), 수정·삭제는 파일 전체를 다시 쓰려고 모두 모았으며, 내보내기는 받는 즉시 썼습니다. `ledger`의 설계 문서도 §21 '제너레이터 사용 지점'에서 소비 지점별 메모리 특성을 이렇게 나눠 적고 있습니다(§12 list, §13 search, §51 export).
- **일부만 소비하는 사례:** `TransactionRepository.get_by_id()`는 `for transaction in self.iter_all():` 안에서 찾으면 바로 `return`합니다. Generator가 `with` 안에서 멈춘 채 남지만, 이 환경(CPython 3.14)에서는 함수가 끝나 Generator를 가리키는 참조가 사라지자 파일이 닫힌 것을 확인했습니다. 8절에서 본 것처럼 이것은 구현의 동작에 기댄 것이며 언어가 모든 구현에서 즉시 정리를 보장하지는 않습니다.
- 내보내기도 **파일을 끝까지 읽는 시간**은 줄지 않습니다. 줄어드는 것은 결과를 보관하는 양입니다.

### 10. 내 코드에서 찾아보기 (대면 강의 활동)

목적은 Generator가 있느냐 없느냐를 평가하는 것이 아니라, **"내 프로그램은 어디서 데이터를 읽으며, 읽은 데이터는 어디에 얼마나 보관하는가?"** 를 자기 말로 설명하는 것입니다. **Generator가 없다고 오류나 미션 실패가 아닙니다.** 데이터가 작으면 전부 읽는 방식이 더 단순하고 알맞을 수 있습니다.

| 찾을 것 | 검색어·단서 | 적을 내용 |
| --- | --- | --- |
| 반복 | `for … in` | 무엇을 반복하는가(리스트·파일·Generator) |
| `iter()`·`next()` | `iter(`, `next(` | 직접 쓰는 곳이 있는가(없어도 됨) |
| Generator 함수 | `yield` | 그 함수가 **반환되는 곳**과 **소비되는 곳**(어느 `for`·`list()`가 받는가) |
| 파일을 읽는 함수 | `open(`, `.read_text(` | 모드와 형식(JSON·JSONL·CSV) |
| 한꺼번에 읽는 코드 | `.read()`, `.readlines()`, `json.load(` | 파일 전체가 메모리에 올라오는 곳 |
| 결과를 모으는 코드 | `list(`, `.append(`, `[… for … in …]`(리스트 컴프리헨션) | 무엇을 몇 개까지 모으는가 |
| 크기 제한 | `deque(maxlen=`, `[:n]`, `if count >= n: break` | 보관 개수 또는 읽는 개수를 제한하는가 |
| 일부만 조회 | `--limit`, `next(`, `break` | 일부만 소비할 때 파일을 정리하는가 |

| 내 코드에서 찾은 곳(파일·함수·줄) | 읽는 방식(한꺼번에 / 한 줄씩) | 남기는 것(전부 / 일부 / 합계만) | 근거가 된 코드 한 줄 |
| --- | --- | --- | --- |
| | | | |

| 내 코드의 모습 | 이렇게 읽습니다 |
| --- | --- |
| `yield`가 **없음** | 정상입니다. 파일을 여는 곳에서 `read()`/`json.load()`(한꺼번에)인지 `for line in f`(한 줄씩)인지, 결과를 리스트에 모으는지 봅니다 |
| `yield`는 있지만 받는 쪽이 `list(…)` | 읽기는 한 줄씩이어도 결과는 전부 모읍니다(7절 방식 4). 왜 모아야 하는지(정렬·최신순·여러 번 사용) 설명해 봅니다 |
| JSON 문서 하나(`json.load`) | 문서 전체를 한 번에 해석합니다. JSONL처럼 한 건씩 꺼내는 구조가 아닙니다 |
| CSV(`csv.reader`·`DictReader`) | 행을 하나씩 받는 Iterator입니다. 받은 행을 어디에 모으는지 봅니다 |
| 데이터베이스 | 쿼리 결과를 한꺼번에 가져오는지(`fetchall`류) 하나씩 받는지 같은 질문으로 봅니다 |

**AI에게 물어볼 때 (보조 질문)** — AI의 답은 확인할 단서일 뿐입니다. 답에 나온 줄을 **직접 열어 보고**, 마지막에는 자기 말로 설명할 수 있어야 합니다. AI의 설명을 그대로 제출하지 않습니다.

- "이 프로젝트에서 파일을 읽는 줄을 모두 찾아, **한꺼번에 읽는지 한 줄씩 읽는지** 줄 번호와 함께 표로 보여 주세요."
- "`yield`가 있는 함수가 있나요? 있다면 그 결과를 **어느 함수가 받고**, 받은 값을 리스트에 모으나요?"
- "읽은 데이터를 `list`·`append`·`deque` 등에 보관하는 곳과, 몇 개까지 보관하는지 알려 주세요."
- "일부만 읽고 멈추는 코드(`break`, `next`, `return`)가 있다면 그때 파일이 닫히는지 확인할 단서를 알려 주세요."

### 11. 한 문장 정리

> **Iterable**은 값을 하나씩 내줄 수 있는 대상이고, **Iterator**는 `next()`로 다음 값을 내주며 진행 위치를 기억하는 객체이며(Iterator도 Iterable), **Generator**는 `yield`에서 값을 내보내고 멈췄다가 다음 `next()`에 이어 가는 Iterator입니다. JSONL을 Generator로 한 줄씩 읽을 수 있지만, 메모리에 남는 양은 형식도 Generator 여부도 아닌 **결과를 어디에 얼마나 보관하느냐**가 정하고, 끝까지 읽는 시간은 그와 별개입니다.

다음 장면(Scene 06)은 여러 함수에 똑같이 필요한 일을 다룹니다.

---

## 강사용 안내

> 대면 강의는 **우리 교육 모델에서 필수인 초기 학습 단계**(운영 선택)입니다. 시간 배분은 시범 운영 후 확정합니다.

**준비** — `drafts/b2-1-story-map/scene-05/_tools/demo/`를 실습 폴더로 복사하고 그 안에서 실행합니다. 데모는 표준 라이브러리만 쓰며 `transactions.jsonl`·`broken.jsonl`을 **읽기만** 합니다(파일을 만들거나 바꾸지 않음). Python 3.14.6, Windows에서 출력을 확인했습니다.

**권장 진행 순서**

1. **질문** — Scene 04의 10만 건 질문을 다시 띄우고 "합계를 내려면 모두 봐야 한다. 그런데 모두 **모아야** 할까?"로 바꿔 묻습니다.
2. **리스트와 `for`** — `python iterable_iterator.py`의 처음 세 줄. "`for`가 어떻게 다음 값을 알까?"
3. **`iter()`·`next()` 시연** — 같은 출력의 `TypeError`에서 멈추고 "리스트는 왜 `next()`가 안 될까?"를 묻습니다. `StopIteration`과 '풀어 쓴 `for`'까지.
4. **두 Iterator** — `python two_iterators.py` 전에 "`next(b)`는 무엇을 낼까?"를 먼저 예측하게 합니다. 그림 A로 위치를 확인합니다.
5. **Generator 한 단계씩** — `python generator_steps.py`. 출력의 `--- next()` 줄마다 멈추고 "지금 본문은 어디서 멈춰 있나? `n`은 얼마인가?"를 묻습니다. 그림 B의 상태 열과 맞춥니다.
6. **`return` vs `yield`** — `python yield_vs_return.py`. 포함 관계(그림 A 아래)를 여기서 정리합니다.
7. **JSONL 연결** — `python jsonl_generator.py`. 그림 C에서 **변환(청록 선)**과 **실행 순서(번호)**를 구분해 짚습니다. "파일 객체도 Iterator"에서 'Generator가 꼭 필요한가?'를 묻습니다.
8. **다섯 가지 비교** — `python five_ways.py`와 그림 D. "방식 4는 Generator인데 왜 3건을 다 남겼나?", "방식 5는 2건만 남겼는데 왜 3줄을 다 읽었나?"
9. **파일 수명** — `python file_lifetime.py`. `False`가 나오는 두 줄을 짚고 `close()`·`closing()`을 보여 줍니다. 예외 처리 강의로 넓히지 않습니다.
10. **`ledger` 사례** — 표의 '남기는 것' 열만 짚으며 핵심 질문에 답합니다.
11. **내 코드에서 찾아보기** — 동의한 교육생 한 명의 코드로 '읽는 곳 → 남기는 곳'을 함께 찾은 뒤 각자 진행합니다.

**흔한 오해와 교정**

| 학습자의 말 | 교정 |
| --- | --- |
| "리스트도 `next()`로 꺼낼 수 있어요" | 리스트는 Iterable입니다. `iter(리스트)`로 Iterator를 얻은 뒤 `next()` |
| "Iterator와 Generator는 서로 다른 거예요" | Generator는 Iterator의 한 종류입니다 |
| "Generator 함수를 부르면 본문이 실행돼요" | Generator 객체만 생깁니다. 본문은 첫 `next()`에서 시작합니다 |
| "`yield`는 `return`처럼 함수를 끝내요" | 값을 내보내고 **멈출** 뿐입니다. 다음 `next()`에 이어 갑니다 |
| "다음 `next()`는 처음부터 다시 실행해요" | 멈춘 `yield`의 다음 줄부터입니다. 지역변수도 남아 있습니다 |
| "`StopIteration`은 오류라 프로그램이 멈춰요" | `for`는 이것을 반복 종료 신호로 받아 정상 종료합니다 |
| "`for line in f`를 쓰려면 Generator가 필요해요" | 파일 객체가 이미 Iterator입니다. Generator는 변환을 더할 때 씁니다 |
| "JSONL이면 메모리를 덜 써요" / "Generator면 메모리를 덜 써요" | 결과를 어디에 얼마나 보관하느냐가 정합니다(그림 D 방식 2·4) |
| "`deque(maxlen=10)`이면 10줄만 읽어요" | 10개만 **남기고**, 읽기는 끝까지 할 수 있습니다 |
| "메모리를 덜 쓰면 빨라져요" | 보관량과 처리 시간은 다릅니다. 끝까지 읽으면 시간은 그대로 듭니다 |
| "`break`하면 파일이 바로 닫혀요" | Generator가 남아 있으면 열려 있을 수 있습니다. `close()`·`closing()` |
| "제 코드엔 `yield`가 없으니 틀렸어요" | 틀린 것이 아닙니다. 어디서 읽고 무엇을 얼마나 남기는지 설명하면 됩니다 |

**수준 조절** — 입문 이전 학습자는 1~4절, 그림 A·B, 7절의 표까지. 여유가 있으면 6·8·9절로 확장합니다. Generator 표현식·`yield from`·`send()`·사용자 정의 Iterator 클래스·성능 측정은 다루지 않습니다.

## 이해 확인 질문 (점수화하지 않음)

| # | 질문 | 확인할 내용 |
| --- | --- | --- |
| 1 | 리스트에 `next()`를 쓰면 왜 오류가 날까요? | 리스트는 Iterable이지만 Iterator가 아님. `iter()`로 Iterator를 얻어야 함 |
| 2 | 같은 리스트에서 만든 `a`·`b`에서 `next(a)`를 두 번 부른 뒤 `next(b)`는 무엇을 낼까요? | 10. 각자 진행 위치를 가짐 |
| 3 | `for`문은 반복이 끝난 것을 어떻게 알까요? | Iterator의 `StopIteration`을 받아 정상 종료 |
| 4 | `count_up(3)`을 호출한 직후 본문은 어디까지 실행됐을까요? 두 번째 `next()`는 어디서 시작할까요? | 아무 데도 / 첫 `yield`의 다음 줄(`n = 1` 유지) |
| 5 | Generator가 Iterator의 한 종류라고 할 수 있는 이유는? | `next()`로 값을 내고 `StopIteration`으로 끝나며 `iter()`가 자기 자신을 돌려줌(Iterable·Iterator 확인 결과) |
| 6 | `list(read_transactions(path))`와 `deque(read_transactions(path), …)`에서 읽는 줄 수와 남는 거래 수는? | 둘 다 끝까지 읽음 / N건 vs maxlen건 |
| 7 | Generator로 일부만 읽고 멈췄을 때 파일을 확실히 닫으려면? | `close()` 또는 `with closing(…)` |
| 8 | 내 프로그램은 어디서 데이터를 읽고, 읽은 데이터를 어디에 얼마나 보관하나요? | 자기 코드의 파일·함수·줄로 설명 |

## 근거와 출처

| 내용 | 분류 | 출처 |
| --- | --- | --- |
| Iterable·Iterator 정의, Iterator의 `__iter__()`는 자기 자신을 돌려주므로 Iterator도 Iterable, 컨테이너는 `iter()`마다 새 Iterator, 소진된 Iterator는 계속 `StopIteration` | 확정 사실 | [Glossary: iterable](https://docs.python.org/3/glossary.html#term-iterable), [iterator](https://docs.python.org/3/glossary.html#term-iterator), [Built-in Types: Iterator Types](https://docs.python.org/3/library/stdtypes.html#iterator-types) |
| `iter()`·`next()` | 확정 사실 | [Built-in functions `iter`](https://docs.python.org/3/library/functions.html#iter), [`next`](https://docs.python.org/3/library/functions.html#next) |
| `for`문은 Iterator를 만들어 값을 받고, 소진되면 반복을 끝냄 | 확정 사실(풀어 쓴 코드는 단순화) | [Compound statements: for](https://docs.python.org/3/reference/compound_stmts.html#the-for-statement), [Functional HOWTO: Iterators](https://docs.python.org/3/howto/functional.html#iterators) |
| Generator 함수를 호출하면 Generator(Iterator)를 돌려주고, 실행은 메서드 호출 때 시작해 `yield`에서 멈추며 지역 상태를 보존, 다음 호출 때 재개 | 확정 사실 | [Expressions: Yield expressions](https://docs.python.org/3/reference/expressions.html#yield-expressions), [Functional HOWTO: Generators](https://docs.python.org/3/howto/functional.html#generators), [Glossary: generator](https://docs.python.org/3/glossary.html#term-generator) |
| `generator.close()`는 멈춘 위치에서 `GeneratorExit`를 일으켜 정리(`with`·`finally`)를 실행, 재개되지 않은 Generator는 참조가 없어지거나 가비지 컬렉션될 때 `close()`가 불림(시점은 구현에 따름) | 확정 사실 | [Expressions: generator.close()](https://docs.python.org/3/reference/expressions.html#generator.close), [Yield expressions](https://docs.python.org/3/reference/expressions.html#yield-expressions) |
| `contextlib.closing` | 확정 사실 | [contextlib.closing](https://docs.python.org/3/library/contextlib.html#contextlib.closing) |
| `collections.abc.Iterable`·`Iterator`로 확인 | 확정 사실 | [collections.abc](https://docs.python.org/3/library/collections.abc.html) |
| 파일 객체는 Iterator 프로토콜을 지원해 줄을 하나씩 내줌, `readlines()`는 줄 목록을 돌려줌, 텍스트 파일은 버퍼를 둠 | 확정 사실 | [io: IOBase](https://docs.python.org/3/library/io.html#io.IOBase), [Tutorial §7.2.1](https://docs.python.org/3/tutorial/inputoutput.html#methods-of-file-objects) |
| `deque(maxlen=…)`: 가득 차면 새 값을 넣을 때 반대쪽 끝이 버려짐 | 확정 사실 | [collections.deque](https://docs.python.org/3/library/collections.html#collections.deque) |
| `json.loads()`, `JSONDecodeError` | 확정 사실 | [json](https://docs.python.org/3/library/json.html) |
| `csv.reader`·`DictReader`는 행을 하나씩 내주는 객체, 따옴표 안의 줄바꿈 | 확정 사실 | [csv](https://docs.python.org/3/library/csv.html) |
| 2~8절의 모든 출력·종료 코드, 다섯 방식의 꺼낸 줄 수·남긴 거래 수, 파일이 열리고 닫히는 시점 | 확정 사실(실행 확인) | `_tools/demo/`, Python 3.14.6(CPython), Windows 11, 2026-10-23. `_tools/verify_demo.py`가 원고·데모·그림과 실제 실행을 대조 |
| O(N)·O(limit) 등 보관량 표기, 한 건의 크기를 같다고 봄, 최소 메모리 제외 | 단순화 | 보관하는 거래 수 기준의 설명. 바이트 단위 측정 아님(검증기는 경향만 확인, [visual-qa.md](visual-qa.md) §1) |
| `ledger`의 `_iter_jsonl`·`iter_all`·`list_transactions`·`search`·`update`/`delete`·`export_csv`·`get_by_id` 동작 | 구현 사례 | `m03-pocket-money-ledger` `d14e812`: `ledger/repository.py`, `ledger/services.py`, `docs/m03-architecture-design.md` §12·§13·§21·§51. 임시 폴더 데이터로 실행 확인(2026-10-23) |
