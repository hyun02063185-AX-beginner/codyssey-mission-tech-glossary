# Scene 04 원고 — 프로그램을 종료해도 데이터가 남는 이유는 무엇일까?

> **상태:** 시안 · GPT 독립 콘텐츠 검토와 Owner 승인 전. 기준: [시나리오 v2](../scenario-v2.md) · 2026-10-23
> **그림:** [노트북용](file-persistence-desktop.svg) · [휴대전화용](file-persistence-mobile.svg) · 설계는 [design-notes.md](design-notes.md) · 데모 코드 `_tools/demo/`

| 항목 | 내용 |
| --- | --- |
| 학습 질문 | **프로그램을 종료해도 데이터가 남는 이유는 무엇일까?** |
| 도달 기준 | 메모리에 데이터가 있는 것과 파일에 기록된 것의 차이를 자기 말로 설명한다. `open()`·`with`·`"r"`/`"w"`/`"a"`·`encoding`·`read()`/`write()`로 파일을 읽고 쓰는 코드를 읽을 수 있다. JSON·JSONL·CSV가 같은 데이터를 어떤 구조로 담는지 비교하고, 자기 코드에서 **데이터 파일의 위치, 파일을 여는 곳, 읽는 함수와 쓰는 함수**를 찾아 말할 수 있다 |
| 이전 장면과의 관계 | Scene 03-B는 **메모리 안의 리스트**로 CRUD·검색·요약을 했고, 다음 실행에서 바꾼 내용이 사라지는 것을 봤다. 이 장면은 같은 CRUD에 **파일 읽기·쓰기**를 붙여 실행이 끝나도 데이터가 남게 한다 |
| 이 장면의 범위 | 파일·디렉터리·경로, Python 파일 입출력 기본 문법, JSON·JSONL·CSV의 구조와 표준 라이브러리 함수, CRUD를 파일에 반영하는 방법, 기존 데이터를 지키는 쓰기 방법 |
| Scene 05로 넘김 | Iterable·Iterator·Generator·`yield`, `for line in f`가 한 줄씩 읽을 수 있는 원리, 필요할 때 읽는 스트리밍과 메모리 사용량. 이 장면은 **"한 줄씩 읽을 수 있다"는 사실과 그 질문**까지만 다룬다 |
| 공식 목표 대응 `[요구 추적]` | 목표 1 'JSONL·CSV 파일 기반 영구 저장과 CRUD·검색·요약·입출력'의 주 장면. 목표 3(Generator·스트리밍)은 Scene 05로 넘긴다 |
| 근거 표기 | `[확정 사실]` 공식 문서 + 실행 확인 · `[단순화]` · `[설계 예시]` Python 문법이 아닌 설계 선택 · `[구현 사례]` `ledger` · `[학습용 예제]` 이 장면을 위해 만든 독립 예제 |

> 이 장면의 예제(`memory_only.py`, `text_io.py`, `where_file.py`, `json_basics.py`, `jsonl_basics.py`, `csv_basics.py`, `w_mode_risk.py`, `file_crud.py`)는 **Python 파일 입출력과 데이터 형식의 원리를 보여 주려고 만든 독립적인 학습용 예제**입니다. 실제 `ledger` 소스나 공식 미션의 정답 구현이 아닙니다. `[학습용 예제]`
>
> **실습 데이터 보호:** 예제는 실행한 폴더에 `memo.txt`, `transactions.json`, `data/` 같은 파일을 만듭니다. `_tools/demo/`를 **새 실습 폴더(예: `practice`)로 복사해 그 안에서** 실행하고, 자기 프로젝트의 실제 데이터 폴더에서는 실행하지 않습니다.

---

## 학습자 원고

### 1. 메모리와 파일 — 프로그램을 끄면 왜 데이터가 사라질까? (그림 A)

| | 메모리(Memory) | 파일(File) |
| --- | --- | --- |
| 무엇인가 | 프로그램이 **실행되는 동안** 변수·리스트·딕셔너리 같은 값을 놓아 두고 쓰는 공간 | 저장 장치(디스크·SSD)에 **이름을 붙여 기록한** 데이터 |
| 언제까지 남나 | 프로그램이 끝나면 그 프로그램이 쓰던 메모리는 **운영체제가 회수**한다 → 값도 함께 사라진다 | 프로그램이 끝나도, 컴퓨터를 다시 켜도 **지우기 전까지 남는다** |
| Python 코드에서 | `transactions.append(…)`, `item["amount"] = 7000` | `open()`으로 파일을 열고 `write()`로 기록, `read()`로 읽기 |
| 예 | Scene 03-B의 `cashbook` 저장소(리스트) | `data/transactions.jsonl` |

`[단순화]` 실제 컴퓨터에는 캐시·가상 메모리·운영체제의 파일 버퍼 등 더 많은 층이 있습니다. 이 장면에서는 "실행 중에만 있는 곳(메모리)"과 "프로그램 밖에 남는 곳(파일)" 두 곳으로 나눠 봅니다.

**영구 저장(Persistence)** 은 프로그램이 끝난 뒤에도 데이터가 남도록 **프로그램 밖의 저장소**에 기록하는 일입니다. 이 장면에서는 그 저장소로 파일을 씁니다(데이터베이스도 같은 목적의 다른 방법입니다). 영구 저장은 두 방향으로 이루어집니다.

- **저장하기:** 메모리의 값(리스트·딕셔너리) → 파일에 쓸 수 있는 **글자**로 바꾸기 → 파일에 **쓰기**
- **불러오기:** 파일을 **읽기** → 글자를 다시 메모리의 값으로 바꾸기

먼저 저장하지 않는 프로그램을 두 번 실행해 봅니다.

<!-- demo:memory_only.py -->
```python
"""메모리에만 있는 데이터: 실행할 때마다 코드에 적힌 처음 목록에서 다시 시작한다."""
import sys

transactions = [
    {"id": 1, "category": "식비", "amount": 8000},
    {"id": 2, "category": "교통", "amount": 2000},
]

if len(sys.argv) > 1 and sys.argv[1] == "add":
    transactions.append({"id": 3, "category": "문구", "amount": 3000})
    print("메모리 목록에 id 3 추가")

ids = []
for item in transactions:
    ids.append(item["id"])
print(f"메모리의 거래: {len(transactions)}건 · id {ids}")
```

<!-- run: python memory_only.py add | exit=0 -->
```text
$ python memory_only.py add
메모리 목록에 id 3 추가
메모리의 거래: 3건 · id [1, 2, 3]
```

<!-- run: python memory_only.py | exit=0 -->
```text
$ python memory_only.py
메모리의 거래: 2건 · id [1, 2]
```

첫 실행에서 추가한 id 3이 두 번째 실행에는 없습니다. 두 번째 실행은 **다른 프로그램 실행**이고, 코드에 적힌 처음 목록에서 다시 시작합니다. `[확정 사실]`

그림 A는 이 실행(위 줄)과, 8절에서 만드는 **파일에 저장하는 프로그램**(아래 줄)을 같은 여섯 단계로 나란히 놓습니다. 메모리와 파일은 **서로 다른 두 칸**으로 그렸습니다. 아래 줄에서는 프로그램이 끝나 메모리 칸이 비어도 파일 칸의 3줄은 남고, 다음 실행이 그 파일을 읽어 목록을 되살립니다.

| 구분할 말 | 뜻 |
| --- | --- |
| "메모리에 데이터가 있다" | 지금 실행 중인 프로그램의 변수가 그 값을 가리킨다. `print()`로 보이는 것도 이것이다 |
| "파일에 데이터가 기록됐다" | 파일을 닫은 뒤 다른 프로그램(또는 다음 실행)이 열어 읽을 수 있다 |

`print()`로 화면에 보였다고 저장된 것은 아닙니다. 저장됐는지는 **프로그램을 끝낸 뒤 다시 실행해 읽어 보면** 확인할 수 있습니다.

### 2. 파일·디렉터리·경로 — 파일은 어디에 생길까?

| 용어 | 뜻 | 예 |
| --- | --- | --- |
| 파일(File) | 이름을 붙여 저장한 데이터 한 덩어리 | `transactions.jsonl` |
| 디렉터리(Directory) | 파일과 다른 디렉터리를 담는 곳. 탐색기·Finder의 '폴더' | `data` |
| 경로(Path) | 파일이나 디렉터리의 위치를 적은 글자 | `data/transactions.jsonl` |
| 절대 경로 | 맨 위(드라이브·루트)부터 적은 경로 | `C:\Users\me\practice\data\transactions.jsonl`, `/home/me/practice/data/transactions.jsonl` |
| 상대 경로 | **현재 작업 디렉터리**에서 출발해 적은 경로 | `data/transactions.jsonl` |
| 현재 작업 디렉터리(Current Working Directory) | 프로그램을 **실행한 위치**. 터미널에서 `cd`로 옮겨 온 그 폴더 | `python …`을 입력한 폴더 |

**상대 경로는 `.py` 파일이 있는 폴더가 아니라, 프로그램을 실행한 현재 작업 디렉터리를 기준으로 찾습니다.** `[확정 사실]`

<!-- demo:where_file.py -->
```python
"""상대 경로는 '현재 작업 디렉터리'를 기준으로 찾는다(이 .py 파일이 있는 폴더 기준이 아니다)."""
from pathlib import Path

relative = Path("data") / "transactions.jsonl"
here = Path(__file__).resolve().parent

print("상대 경로:", relative.as_posix())
print("현재 작업 디렉터리 = 이 .py 파일의 폴더?", Path.cwd() == here)
print("상대 경로가 가리키는 곳 = 이 .py 파일 옆의 data 폴더?", relative.resolve() == here / relative)
```

실습 폴더 `practice` 안에서 실행할 때와, 한 단계 위 폴더에서 실행할 때를 비교합니다.

<!-- run: python where_file.py | exit=0 -->
```text
$ python where_file.py
상대 경로: data/transactions.jsonl
현재 작업 디렉터리 = 이 .py 파일의 폴더? True
상대 경로가 가리키는 곳 = 이 .py 파일 옆의 data 폴더? True
```

<!-- run: python practice/where_file.py | exit=0 | cwd=.. -->
```text
$ cd ..
$ python practice/where_file.py
상대 경로: data/transactions.jsonl
현재 작업 디렉터리 = 이 .py 파일의 폴더? False
상대 경로가 가리키는 곳 = 이 .py 파일 옆의 data 폴더? False
```

- 같은 코드라도 **어디서 실행했느냐**에 따라 `data/transactions.jsonl`이 가리키는 파일이 달라집니다. "분명히 저장했는데 파일이 없다"거나 "기록이 사라졌다"고 느끼는 흔한 원인입니다.
- 위치를 고정하는 방법은 여러 가지입니다. ① 실행할 위치를 정해 두고 안내한다 ② `Path(__file__).resolve().parent`(이 `.py` 파일의 폴더)를 기준으로 경로를 만든다 ③ 실행할 때 옵션으로 데이터 폴더를 받는다. 어느 방법을 쓸지는 프로그램이 정합니다. `[설계 예시]`
- `Path("data") / "transactions.jsonl"`처럼 `/`로 경로를 이으면 운영체제에 맞는 구분자(`\` 또는 `/`)로 경로를 만들어 줍니다. 화면에는 `as_posix()`로 `/`를 써서 보였습니다. `[확정 사실]`
- **폴더가 없으면 쓰기도 실패합니다.** `open("data/x.txt", "w", …)`는 `data` 폴더가 없으면 파일을 만들지 못하고 `FileNotFoundError`를 냅니다. 그래서 8절 예제는 쓰기 전에 `path.parent.mkdir(parents=True, exist_ok=True)`로 폴더를 만듭니다. `[확정 사실]`

### 3. Python 파일 입출력 기본 문법

파일을 읽는 가장 기본 형태입니다.

```python
with open("data.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

| 부분 | 뜻 |
| --- | --- |
| `open(경로, 모드, encoding=…)` | 파일을 **열고** 파일을 다루는 **파일 객체**를 돌려준다 |
| `"r"` | 모드(mode). 무엇을 하려고 여는지 |
| `encoding="utf-8"` | 파일의 바이트를 글자로(또는 글자를 바이트로) 바꾸는 규칙 |
| `with … as f:` | 연 파일 객체에 `f`라는 이름을 붙이고, 들여 쓴 블록이 끝나면 **파일을 닫는다** |
| `f.read()` | 파일 내용 전체를 **문자열 하나**로 읽는다 |

**모드 — 무엇을 하려고 여는가** `[확정 사실]`

| 모드 | 이름 | 파일이 없으면 | 파일이 있으면 | 쓰는 위치 |
| --- | --- | --- | --- | --- |
| `"r"` | 읽기(read). 모드를 적지 않으면 이것 | `FileNotFoundError` | 내용을 그대로 두고 읽는다 | — |
| `"w"` | 쓰기(write) | 새로 만든다 | **여는 순간 내용을 모두 비운다(덮어쓰기)** | 처음부터 |
| `"a"` | 덧붙이기(append) | 새로 만든다 | 내용을 그대로 둔다 | **끝에 이어서** |

> **`"w"`는 기존 파일의 내용을 지웁니다.** 아직 아무것도 쓰지 않았어도 `open(…, "w")`가 실행되는 순간 비워집니다. 기존 기록에 더하려면 `"a"`, 일부만 바꾸려면 8절의 '읽고 → 바꾸고 → 다시 쓰기'를 씁니다.

**읽기·쓰기 메서드** `[확정 사실]`

| 메서드 | 하는 일 | 주의 |
| --- | --- | --- |
| `f.read()` | 남은 내용 **전체**를 문자열 하나로 | 파일이 크면 그만큼 메모리를 쓴다 |
| `for line in f:` | **한 줄씩** 꺼낸다. 각 줄은 끝의 `"\n"`을 포함한 문자열 | 왜 이렇게 되는지는 Scene 05 |
| `f.write(문자열)` | 문자열을 쓴다. 쓴 글자 수를 돌려준다 | **줄바꿈을 자동으로 넣지 않는다.** 줄을 나누려면 `"\n"`을 직접 붙인다 |

**`encoding="utf-8"`을 적는 이유.** 파일에는 글자가 아니라 바이트가 저장되고, 인코딩은 그 바이트와 글자 사이의 변환 규칙입니다. `encoding`을 적지 않으면 Python은 **실행 환경에 따라 정해지는 기본 인코딩**을 씁니다. 이 장면을 확인한 Windows 환경의 기본값은 UTF-8이 아니었습니다(`cp949`). 다른 컴퓨터에서 같은 파일을 읽을 때 한글이 깨지거나 오류가 나지 않도록 **텍스트 파일은 `encoding="utf-8"`을 늘 적습니다.** `[확정 사실]`

**`with`를 쓰는 이유.** 파일은 쓰고 나면 닫아야 합니다. `write()`한 내용은 바로 디스크에 가지 않고 잠시 모아 두었다가(버퍼) 닫을 때 마저 기록될 수 있습니다. `with`는 블록이 끝나면 — **블록 안에서 오류가 나도** — 파일을 닫아 줍니다. `with` 없이 `f = open(…)`으로 열었다면 `f.close()`를 직접 불러야 합니다. `[확정 사실]`(버퍼의 세부는 `[단순화]`)

<!-- demo:text_io.py -->
```python
"""파일 입출력 기본: open()·with·모드("w"·"a"·"r")·encoding·write()·read()."""

with open("memo.txt", "w", encoding="utf-8") as f:
    f.write("용돈 30000\n")
    f.write("식비 8000\n")
print("with 블록이 끝난 뒤 파일이 닫혔나?", f.closed)

with open("memo.txt", "a", encoding="utf-8") as f:
    f.write("교통 2000\n")

with open("memo.txt", "r", encoding="utf-8") as f:
    text = f.read()
print("read()가 돌려준 값의 종류:", type(text).__name__)
print(text, end="")

with open("memo.txt", "w", encoding="utf-8") as f:
    f.write("문구 3000\n")

with open("memo.txt", "r", encoding="utf-8") as f:
    print('다시 "w"로 연 뒤의 내용:', f.read(), end="")

try:
    with open("missing.txt", "r", encoding="utf-8") as f:
        f.read()
except FileNotFoundError:
    print('"r"은 없는 파일을 만들지 않는다: FileNotFoundError')
```

<!-- run: python text_io.py | exit=0 -->
```text
$ python text_io.py
with 블록이 끝난 뒤 파일이 닫혔나? True
read()가 돌려준 값의 종류: str
용돈 30000
식비 8000
교통 2000
다시 "w"로 연 뒤의 내용: 문구 3000
"r"은 없는 파일을 만들지 않는다: FileNotFoundError
```

- `"w"`로 두 줄 → `"a"`로 한 줄 덧붙임 → `"r"`로 읽으면 세 줄입니다. 다시 `"w"`로 열어 한 줄을 쓰면 **앞의 세 줄은 사라지고** 그 한 줄만 남습니다.
- `print(text, end="")`의 `end=""`는 `print()`가 끝에 줄바꿈을 하나 더 붙이지 않게 합니다. 파일 내용의 마지막 `"\n"`이 이미 줄을 바꾸기 때문입니다.
- 이 절은 **문법**입니다. 기존 데이터를 잃지 않게 쓰는 운영상의 주의는 9절에서 따로 봅니다.

### 4. JSON — 이름 붙은 정보 묶음을 글자로 (그림 B)

**JSON**은 **J**ava**S**cript **O**bject **N**otation, 'JavaScript 객체 표기법'의 줄임말입니다. JavaScript의 객체 표기에서 나왔지만 지금은 **특정 언어에 묶이지 않은 데이터 교환 형식**이고(RFC 8259, ECMA-404), Python을 포함한 거의 모든 언어가 읽고 씁니다. `[확정 사실]`

JSON 값은 여섯 가지 중 하나입니다. Python의 `json` 모듈은 이렇게 바꿉니다. `[확정 사실]`

| JSON | 모양 | Python으로 읽으면 | Python에서 쓰면 |
| --- | --- | --- | --- |
| 객체(object) | `{"키": 값, …}` — **키는 늘 큰따옴표 문자열** | `dict` | `dict` → 객체 |
| 배열(array) | `[값, 값, …]` | `list` | `list`·`tuple` → 배열 |
| 문자열(string) | `"식비"` — **큰따옴표만** | `str` | `str` |
| 숫자(number) | `8000`, `0.5` | `int` 또는 `float` | `int`·`float` |
| 참거짓 | `true`, `false` | `True`, `False` | `True`·`False` |
| null | `null` | `None` | `None` |

- **객체**는 키와 값의 묶음(Python 딕셔너리와 비슷), **배열**은 순서 있는 값의 목록(Python 리스트와 비슷)입니다. 값 자리에 다시 객체·배열을 넣어 **중첩**할 수 있습니다.
- JSON 객체의 키는 문자열만 됩니다. 딕셔너리 키가 숫자 `1`이면 JSON으로 바꿀 때 `"1"`이 되고, 다시 읽어도 문자열 `"1"`입니다. `[확정 사실]`

**직렬화와 역직렬화**

- **직렬화(Serialization):** 메모리 속 값(딕셔너리·리스트)을 저장하거나 보낼 수 있는 **문자열·바이트로 바꾸는 일**. 여러 갈래의 구조를 한 줄로 늘어놓는다(serial)는 뜻입니다.
- **역직렬화(Deserialization):** 그 문자열·바이트를 다시 메모리 속 값으로 되돌리는 일.

**`json` 모듈의 네 함수 — 문자열을 다루는가, 파일 객체를 다루는가** `[확정 사실]`

| 함수 | 방향 | 무엇을 받고 무엇을 돌려주나 | 외우는 법 |
| --- | --- | --- | --- |
| `json.dumps(값)` | 직렬화 | Python 값 → **JSON 문자열**을 돌려줌 | dump + **s**(string) |
| `json.loads(문자열)` | 역직렬화 | JSON 문자열 → Python 값 | load + **s** |
| `json.dump(값, f)` | 직렬화 | Python 값을 JSON으로 **파일 객체 `f`에 씀** | s가 없으면 파일 |
| `json.load(f)` | 역직렬화 | **파일 객체 `f`** 에서 읽어 Python 값으로 | |

<!-- demo:json_basics.py -->
```python
"""JSON 기본: dumps()·loads()는 문자열, dump()·load()는 파일 객체를 다룬다."""
import json

transactions = [
    {"id": 1, "category": "식비", "amount": 8000},
    {"id": 2, "category": "교통", "amount": 2000},
    {"id": 3, "category": "문구", "amount": 3000},
]

text = json.dumps(transactions[0], ensure_ascii=False)
print("dumps() → 종류:", type(text).__name__, "| 값:", text)
item = json.loads(text)
print("loads() → 종류:", type(item).__name__, "| amount + 1 =", item["amount"] + 1)
print("print(딕셔너리)는 JSON이 아님:", transactions[0])
print("ensure_ascii를 쓰지 않으면:", json.dumps("식비"))
print("True·None·튜플 →", json.dumps({"fixed": True, "memo": None, "tags": ("점심",)}, ensure_ascii=False))

with open("transactions.json", "w", encoding="utf-8") as f:
    json.dump(transactions, f, ensure_ascii=False, indent=2)

with open("transactions.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
print("load() → 종류:", type(loaded).__name__, "| 건수:", len(loaded), "| 처음과 같은 값?", loaded == transactions)
```

<!-- run: python json_basics.py | exit=0 -->
```text
$ python json_basics.py
dumps() → 종류: str | 값: {"id": 1, "category": "식비", "amount": 8000}
loads() → 종류: dict | amount + 1 = 8001
print(딕셔너리)는 JSON이 아님: {'id': 1, 'category': '식비', 'amount': 8000}
ensure_ascii를 쓰지 않으면: "\uc2dd\ube44"
True·None·튜플 → {"fixed": true, "memo": null, "tags": ["점심"]}
load() → 종류: list | 건수: 3 | 처음과 같은 값? True
```

`json.dump()`가 만든 파일 `transactions.json`의 내용입니다(그림 B의 JSON 칸).

<!-- file: transactions.json -->
```json
[
  {
    "id": 1,
    "category": "식비",
    "amount": 8000
  },
  {
    "id": 2,
    "category": "교통",
    "amount": 2000
  },
  {
    "id": 3,
    "category": "문구",
    "amount": 3000
  }
]
```

읽을 때 짚을 점 `[확정 사실]`

- `dumps()`는 **문자열**을 돌려줍니다. `loads()`로 되돌리면 딕셔너리가 되어 `item["amount"] + 1`처럼 숫자 계산을 할 수 있습니다.
- `print(딕셔너리)`의 작은따옴표 표기는 **Python의 표시 방법**이지 JSON이 아닙니다. 파일에 JSON을 저장하려면 `json.dumps()`·`json.dump()`를 씁니다.
- `ensure_ascii`의 기본값은 `True`라서 한글이 `\uc2dd\ube44`처럼 바뀌어 저장됩니다. 틀린 것은 아니지만(읽으면 다시 '식비') 사람이 읽기 어려워 `ensure_ascii=False`를 썼습니다.
- `indent=2`는 사람이 읽기 좋게 줄을 바꾸고 들여 씁니다. 줄바꿈·들여쓰기는 JSON의 뜻을 바꾸지 않습니다.
- 이 파일은 **하나의 JSON 문서**(배열 하나)입니다. `json.load(f)`는 문서 전체를 해석해 리스트 하나를 돌려줍니다. 거래 하나를 더하려면 보통 **전체를 읽고, 리스트에 더하고, 전체를 다시 씁니다.** 파일 끝에 한 건만 덧붙이면 배열의 `]` 뒤에 글자가 붙어 올바른 JSON이 아니게 됩니다.

### 5. JSONL — 한 줄에 JSON 값 하나 (그림 C-1)

**JSONL(JSON Lines)** 은 **한 줄에 하나의 유효한 JSON 값**을 적는 텍스트 파일 형식입니다. 줄은 `\n`으로 나누고, 인코딩은 UTF-8, 확장자는 보통 `.jsonl`입니다. 거래 기록처럼 한 줄에 객체 하나를 두는 경우가 많지만, 형식 자체는 줄마다 **어떤 JSON 값이든** 허용합니다. `[확정 사실]`(jsonlines.org)

<!-- demo:jsonl_basics.py -->
```python
"""JSONL 기본: 한 줄에 JSON 값 하나 — 줄 단위로 쓰고, 끝에 덧붙이고, 한 줄씩 읽는다."""
import json

transactions = [
    {"id": 1, "category": "식비", "amount": 8000},
    {"id": 2, "category": "교통", "amount": 2000},
    {"id": 3, "category": "문구", "amount": 3000},
]

with open("transactions.jsonl", "w", encoding="utf-8") as f:
    for item in transactions:
        f.write(json.dumps(item, ensure_ascii=False, separators=(",", ":")) + "\n")

new_item = {"id": 4, "category": "식비", "amount": 5000}
with open("transactions.jsonl", "a", encoding="utf-8") as f:
    f.write(json.dumps(new_item, ensure_ascii=False, separators=(",", ":")) + "\n")

with open("transactions.jsonl", "r", encoding="utf-8") as f:
    line_no = 0
    for line in f:
        line_no += 1
        item = json.loads(line)
        print(f"{line_no}행: {type(line).__name__} → json.loads() → {type(item).__name__} · id {item['id']} · {item['category']} · {item['amount']}")

print("문자열 속 줄바꿈도 한 줄로:", json.dumps({"memo": "첫 줄\n둘째 줄"}, ensure_ascii=False))

with open("transactions.jsonl", "r", encoding="utf-8") as f:
    whole = f.read()
try:
    json.loads(whole)
except json.JSONDecodeError as error:
    print("파일 전체를 json.loads() 하나로 읽으면:", type(error).__name__, "-", error.msg)

items = []
with open("transactions.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        items.append(json.loads(line))
print(f"한 줄씩 읽었지만 리스트에 모두 모으면: {len(items)}건이 한꺼번에 메모리에 있음")
```

<!-- run: python jsonl_basics.py | exit=0 -->
```text
$ python jsonl_basics.py
1행: str → json.loads() → dict · id 1 · 식비 · 8000
2행: str → json.loads() → dict · id 2 · 교통 · 2000
3행: str → json.loads() → dict · id 3 · 문구 · 3000
4행: str → json.loads() → dict · id 4 · 식비 · 5000
문자열 속 줄바꿈도 한 줄로: {"memo": "첫 줄\n둘째 줄"}
파일 전체를 json.loads() 하나로 읽으면: JSONDecodeError - Extra data
한 줄씩 읽었지만 리스트에 모두 모으면: 4건이 한꺼번에 메모리에 있음
```

만들어진 `transactions.jsonl`입니다. 1~3행은 `"w"`로, 4행은 `"a"`로 쓴 줄입니다(그림 B의 JSONL 칸은 1~3행, 그림 C-1은 4행까지).

<!-- file: transactions.jsonl -->
```jsonl
{"id":1,"category":"식비","amount":8000}
{"id":2,"category":"교통","amount":2000}
{"id":3,"category":"문구","amount":3000}
{"id":4,"category":"식비","amount":5000}
```

**JSON 문서와 JSONL 파일의 차이**

| | JSON 문서(`transactions.json`) | JSONL 파일(`transactions.jsonl`) |
| --- | --- | --- |
| 파일 전체 | **JSON 값 하나**(여기서는 배열) | 줄마다 따로인 JSON 값들. **파일 전체는 JSON 값 하나가 아니다** |
| 거래 한 건 | 배열 안의 객체 하나 | **한 줄** |
| 읽는 방법 | `json.load(f)`로 문서 전체를 한 번에 | 한 줄을 읽어 `json.loads(line)` |
| 한 건 추가 | 전체를 읽고 → 더하고 → 전체를 다시 쓰기 | **`"a"`로 열어 끝에 한 줄 쓰기** |

읽을 때 짚을 점 `[확정 사실]`

- **한 줄 = 한 건**입니다. 각 줄은 그 자체로 완전한 JSON이라 `json.loads(line)`으로 딕셔너리 하나가 됩니다. 줄 끝의 `"\n"`은 JSON 바깥의 공백으로 취급되어 그대로 넘겨도 됩니다.
- **파일 전체를 `json.loads()` 하나로 읽으면 `Extra data` 오류**가 납니다. 첫 줄 뒤에 또 다른 JSON 값이 이어지기 때문입니다. JSONL 파일 전체는 하나의 JSON 배열이 아닙니다.
- **추가가 쉽습니다.** 새 거래는 `"a"` 모드로 열어 한 줄을 쓰면 됩니다. 앞의 줄을 읽거나 다시 쓸 필요가 없습니다.
- **한 줄을 지키는 규칙:** 문자열 속 줄바꿈은 `json.dumps()`가 `\n` 두 글자로 바꿔 주므로 한 줄이 유지됩니다. 반대로 `indent=`를 쓰면 한 건이 여러 줄이 되어 JSONL이 깨집니다.
- `separators=(",", ":")`는 쉼표·콜론 뒤의 공백을 빼서 줄을 짧게 합니다. 공백이 있어도(`{"id": 1, …}`) 같은 JSON이며, 둘 다 올바른 JSONL입니다. 이 장면은 그림에서 한 줄을 끊지 않고 보이려고 짧은 쪽을 골랐습니다. `[학습용 예제]`

**수정·삭제는 덧붙이기만으로 끝나지 않는다.** id 2의 금액을 바꾸려고 바뀐 줄을 끝에 덧붙이면, 파일에는 id 2가 **두 줄** 남습니다. 읽는 쪽이 "같은 id는 마지막 줄을 따른다" 같은 규칙을 따로 갖지 않는 한 잘못된 결과가 됩니다. 텍스트 파일의 가운데 한 줄만 길이를 바꿔 고쳐 쓰는 기능도 기본으로 없습니다. 그래서 작은 프로그램은 보통 **전체를 읽고 → 메모리에서 바꾸고 → 파일 전체를 다시 씁니다**(8절). `[확정 사실]` 변경 내역을 덧붙여 두고 읽을 때 반영하는 설계, 데이터베이스를 쓰는 설계도 있습니다. `[설계 예시]`

**JSONL은 메모리를 아껴 주는 기능이 아닙니다.** JSONL은 한 줄씩 **처리할 수 있는** 형식일 뿐입니다. 위 예제의 마지막처럼 한 줄씩 읽어도 결과를 리스트에 모두 모으면 파일 전체가 메모리에 올라옵니다. 메모리 사용량은 **읽는 방법과 결과를 보관하는 방법**이 정합니다(→ 12절, Scene 05).

### 6. CSV — 행과 열의 표 (그림 B)

**CSV**는 **C**omma-**S**eparated **V**alues, '쉼표로 구분한 값'입니다. 표를 글자로 적는 형식입니다. `[확정 사실]`

| 용어 | 뜻 | 아래 예에서 |
| --- | --- | --- |
| 행(Row) | 가로 한 줄 = 데이터 한 건(레코드) | `1,식비,8000` |
| 열(Column) | 세로 한 칸 = 같은 종류의 값 | `amount` 열의 `8000`, `2000`, `3000` |
| 헤더(Header) | 첫 행에 적은 **열 이름** | `id,category,amount` |
| 구분자(Delimiter) | 값과 값 사이를 나누는 글자. 기본은 쉼표 | `,` |

<!-- file: transactions.csv @end -->
```csv
id,category,amount
1,식비,8000
2,교통,2000
3,문구,3000
```

**값 안에 쉼표·따옴표·줄바꿈이 있으면** `[확정 사실]` — Python `csv` 모듈의 기본 방식(엑셀 방식)은 이렇습니다.

| 값 | CSV에 적히는 모습 | 규칙 |
| --- | --- | --- |
| `점심, 김밥` | `"점심, 김밥"` | 구분자가 들어 있으면 값 전체를 큰따옴표로 감싼다 |
| `가게 이름 "다이소"` | `"가게 이름 ""다이소"""` | 감싼 뒤, 값 안의 큰따옴표는 **두 번** 적는다 |
| `첫 줄`(줄바꿈)`둘째 줄` | `"첫 줄`(줄바꿈)`둘째 줄"` | 감싼 값 안에서는 줄바꿈도 값의 일부. 그래서 **CSV 한 행이 파일의 두 줄**이 될 수 있다 |

CSV에는 모든 프로그램이 똑같이 따르는 단일 표준이 없습니다. 흔히 RFC 4180을 참고하지만 구분자(쉼표·세미콜론·탭), 따옴표, 인코딩이 프로그램마다 다를 수 있어 **다른 도구와 주고받을 때 확인이 필요**합니다. `[확정 사실]`

**Python의 `csv` 모듈** `[확정 사실]`

| 함수 | 한 행을 무엇으로 다루나 | 쓰임 |
| --- | --- | --- |
| `csv.reader(f)` | **리스트** `['1', '식비', '8000']` | 행을 하나씩 꺼내 읽기 |
| `csv.writer(f)` | 리스트를 받아 `writerow()` | 행 쓰기 |
| `csv.DictReader(f)` | 헤더를 키로 한 **딕셔너리** `{'id': '1', …}` | 열 이름으로 읽기 |
| `csv.DictWriter(f, fieldnames=[…])` | 딕셔너리를 받아 `writeheader()`·`writerow()` | 열 이름으로 쓰기 |

- **CSV 파일은 `newline=""`으로 엽니다.** `csv` 모듈이 줄 끝을 직접 처리하기 때문입니다. 지정하지 않으면 따옴표 안의 줄바꿈을 바르게 읽지 못하고, Windows에서 쓰면 줄 끝에 `\r`이 하나 더 붙어 읽을 때 빈 행이 생깁니다(이 장면의 Windows 환경에서 확인). `[확정 사실]`
- **읽은 값은 모두 문자열**입니다. `'8000'`은 숫자가 아니므로 계산하려면 `int(row["amount"])`로 바꿉니다. 형식이 맞지 않으면 `int()`가 `ValueError`를 냅니다. `[확정 사실]`

<!-- demo:csv_basics.py -->
```python
"""CSV 기본: 헤더·행·열, DictWriter·DictReader, writer·reader, 따옴표 처리, 문자열 → 숫자 변환."""
import csv
from pathlib import Path

transactions = [
    {"id": 1, "category": "식비", "amount": 8000},
    {"id": 2, "category": "교통", "amount": 2000},
    {"id": 3, "category": "문구", "amount": 3000},
]

with open("transactions.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "category", "amount"])
    writer.writeheader()
    for item in transactions:
        writer.writerow(item)

print(Path("transactions.csv").read_text(encoding="utf-8"), end="")

total = 0
with open("transactions.csv", "r", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        print(row, "| amount의 종류:", type(row["amount"]).__name__)
        total = total + int(row["amount"])
print("int()로 바꿔 더한 합계:", total)

with open("memo.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "memo"])
    writer.writerow([1, "점심, 김밥"])
    writer.writerow([2, '가게 이름 "다이소"'])
    writer.writerow([3, "첫 줄\n둘째 줄"])

print(Path("memo.csv").read_text(encoding="utf-8"), end="")

with open("memo.csv", "r", encoding="utf-8", newline="") as f:
    for row in csv.reader(f):
        print(row)
```

<!-- run: python csv_basics.py | exit=0 -->
```text
$ python csv_basics.py
id,category,amount
1,식비,8000
2,교통,2000
3,문구,3000
{'id': '1', 'category': '식비', 'amount': '8000'} | amount의 종류: str
{'id': '2', 'category': '교통', 'amount': '2000'} | amount의 종류: str
{'id': '3', 'category': '문구', 'amount': '3000'} | amount의 종류: str
int()로 바꿔 더한 합계: 13000
id,memo
1,"점심, 김밥"
2,"가게 이름 ""다이소"""
3,"첫 줄
둘째 줄"
['id', 'memo']
['1', '점심, 김밥']
['2', '가게 이름 "다이소"']
['3', '첫 줄\n둘째 줄']
```

- 파일 내용을 그대로 보여 주는 줄은 `Path(…).read_text(encoding="utf-8")`(열고·읽고·닫기를 한 번에 하는 `pathlib`의 함수)를 썼습니다. CSV로 **해석**하는 곳은 `newline=""`으로 연 `DictReader`·`reader`입니다.
- `memo.csv`의 3번 행은 파일에서 두 줄이지만 `csv.reader`는 **한 행**(`['3', '첫 줄\n둘째 줄']`)으로 읽습니다. CSV의 '한 행'은 '파일의 한 줄'과 항상 같지는 않습니다.
- `csv.reader`·`DictReader`도 **행을 하나씩** 꺼냅니다. CSV도 JSONL처럼 순차 처리할 수 있습니다(→ Scene 05).

**가져오기(Import)와 내보내기(Export).** 다른 프로그램(엑셀·구글 시트 등)에서 만든 CSV를 **읽어 들여** 내 데이터에 더하는 것이 가져오기, 내 데이터를 CSV로 **써서 내보내** 다른 도구에서 열게 하는 것이 내보내기입니다. 가져올 때는 값이 문자열로 들어오므로 **숫자 변환과 값 검증**이 필요하고, 내보낼 때는 헤더·열 순서·인코딩을 받는 쪽과 맞춥니다. `[설계 예시]`

### 7. 세 형식 비교 — 같은 거래 3건, 다른 구조 (그림 B)

| | JSON | JSONL | CSV |
| --- | --- | --- | --- |
| 중심 특징 | **하나의 JSON 문서** | **한 줄에 JSON 값 하나** | **행과 열의 표** |
| 같은 3건의 모습 | 배열 하나 안에 객체 3개 | 3줄, 줄마다 객체 하나 | 헤더 1행 + 데이터 3행 |
| 중첩 구조(목록 속 목록 등) | 표현 가능 | 줄마다 표현 가능 | 기본은 평면 표. 중첩은 따로 규칙을 정해야 함 |
| Python으로 읽은 값 | `json.load()` → 리스트·딕셔너리, **숫자는 숫자** | 줄마다 `json.loads()` → 딕셔너리, 숫자는 숫자 | `csv` → **값이 모두 문자열**, 숫자는 직접 변환 |
| 한 건 추가 | 보통 전체 다시 쓰기 | `"a"`로 끝에 한 줄 | `"a"`로 끝에 한 행(헤더는 한 번만) |
| 순차 처리 | `json.load()`는 문서 전체를 해석 | 한 줄씩 가능 | 한 행씩 가능 |
| 강점 | 설정·응답처럼 구조가 있는 데이터 하나 | 기록이 계속 쌓이는 데이터, 한 건씩 처리 | 표 계산 프로그램 등 **다른 도구와의 교환** |
| 주의 | 한 건만 덧붙일 수 없음 | 파일 전체는 JSON 하나가 아님. 한 건이 한 줄을 넘으면 안 됨 | 따옴표 규칙·구분자·인코딩·`newline=""`, 숫자 변환 |

> **"JSONL은 내부 저장용, CSV는 외부 교환용"처럼 정해진 규칙은 없습니다.** 어떤 형식을 어디에 쓸지는 프로그램이 무엇을 해야 하는지(쌓이는 기록인가, 표로 열어 볼 것인가, 구조가 깊은가)와 설계 선택에 따릅니다. `ledger`가 저장은 JSONL, 가져오기·내보내기는 CSV로 한 것은 **그 프로그램의 선택**입니다(10절). `[설계 예시]`

### 8. 파일로 CRUD — Scene 03-B의 함수에 파일 읽기·쓰기를 붙이기 (그림 A 아래 줄, 그림 C-2)

Scene 03-B의 `crud_basics.py`는 메모리 속 리스트만 바꿨습니다. 같은 CRUD 함수 앞뒤에 **파일 읽기·쓰기**를 붙이면 실행이 끝나도 데이터가 남습니다. `[학습용 예제]`

| 묶음 | 함수 | 하는 일 |
| --- | --- | --- |
| 파일 읽기·쓰기 | `load_all(path)` | JSONL 파일을 한 줄씩 읽어 **리스트 하나**로 돌려줌(파일이 없으면 빈 리스트) |
| | `append_one(path, item)` | `"a"`로 열어 **끝에 한 줄** 추가(폴더가 없으면 만듦) |
| | `save_all(path, items)` | 목록 전체를 **새 파일(`.tmp`)에 다 쓴 뒤** `os.replace()`로 원래 이름과 바꿈 |
| | `to_line(item)` | 딕셔너리 → JSONL 한 줄(직렬화 + `"\n"`) |
| 메모리 속 CRUD(03-B와 같은 방식) | `next_id()`·`create()`·`read_one()`·`update_amount()`·`delete()` | 리스트를 바꾸거나 찾음. **파일은 건드리지 않음** |
| 실행 | `main()` | 파일에서 읽기 → 명령에 맞는 CRUD → 필요하면 파일에 쓰기 → 결과 출력 |

<!-- demo:file_crud.py -->
```python
"""Scene 04 학습용 예제: Scene 03-B의 메모리 CRUD 함수 + JSONL 파일 읽기·쓰기 → 실행이 끝나도 남는 거래 목록."""
import json
import os
import sys
from pathlib import Path

DATA_FILE = Path("data") / "transactions.jsonl"


def load_all(path):
    items = []
    if not path.exists():
        return items
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                items.append(json.loads(line))
    return items


def to_line(item):
    return json.dumps(item, ensure_ascii=False, separators=(",", ":")) + "\n"


def append_one(path, item):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write(to_line(item))


def save_all(path, items):
    temp = path.with_name(path.name + ".tmp")
    with open(temp, "w", encoding="utf-8") as f:
        for item in items:
            f.write(to_line(item))
    os.replace(temp, path)


def next_id(items):
    biggest = 0
    for item in items:
        if item["id"] > biggest:
            biggest = item["id"]
    return biggest + 1


def create(items, category, amount):
    item = {"id": next_id(items), "category": category, "amount": amount}
    items.append(item)
    return item


def read_one(items, tx_id):
    for item in items:
        if item["id"] == tx_id:
            return item
    return None


def update_amount(items, tx_id, amount):
    item = read_one(items, tx_id)
    if item is None:
        return None
    item["amount"] = amount
    return item


def delete(items, tx_id):
    item = read_one(items, tx_id)
    if item is None:
        return None
    items.remove(item)
    return item


def main(argv):
    items = load_all(DATA_FILE)
    print(f"파일에서 읽음: {len(items)}건")
    command = argv[0]
    if command == "list":
        for item in items:
            print(f'  {item["id"]} | {item["category"]} | {item["amount"]}')
    elif command == "add":
        item = create(items, argv[1], int(argv[2]))
        append_one(DATA_FILE, item)
        print("[C] 파일 끝에 한 줄 추가:", item)
    elif command == "update":
        item = update_amount(items, int(argv[1]), int(argv[2]))
        if item is None:
            print("[U] 그 id가 없어 파일을 다시 쓰지 않음")
            return 1
        save_all(DATA_FILE, items)
        print("[U] 파일 전체를 다시 씀:", item)
    elif command == "delete":
        item = delete(items, int(argv[1]))
        if item is None:
            print("[D] 그 id가 없어 파일을 다시 쓰지 않음")
            return 1
        save_all(DATA_FILE, items)
        print("[D] 파일 전체를 다시 씀 · 지운 거래:", item)
    return 0


sys.exit(main(sys.argv[1:]))
```

실습 폴더에서 차례로 실행합니다. **`$` 한 줄이 프로그램 실행 한 번**이고, 한 번 실행이 끝나면 그 실행의 메모리는 사라집니다.

**Create — 새 거래를 파일 끝에 한 줄씩**

<!-- run | exit=0 -->
```text
$ python file_crud.py list
파일에서 읽음: 0건
$ python file_crud.py add 식비 8000
파일에서 읽음: 0건
[C] 파일 끝에 한 줄 추가: {'id': 1, 'category': '식비', 'amount': 8000}
$ python file_crud.py add 교통 2000
파일에서 읽음: 1건
[C] 파일 끝에 한 줄 추가: {'id': 2, 'category': '교통', 'amount': 2000}
$ python file_crud.py add 문구 3000
파일에서 읽음: 2건
[C] 파일 끝에 한 줄 추가: {'id': 3, 'category': '문구', 'amount': 3000}
```

**Read — 다음 실행에서 파일을 읽어 목록을 되살리기**

<!-- run: python file_crud.py list | exit=0 -->
```text
$ python file_crud.py list
파일에서 읽음: 3건
  1 | 식비 | 8000
  2 | 교통 | 2000
  3 | 문구 | 3000
```

<!-- file: data/transactions.jsonl -->
```jsonl
{"id":1,"category":"식비","amount":8000}
{"id":2,"category":"교통","amount":2000}
{"id":3,"category":"문구","amount":3000}
```

`memory_only.py`와 달리, 앞선 실행들이 추가한 3건이 **새 실행**에서도 보입니다. 각 실행이 파일에 남긴 줄을 다음 실행이 `load_all()`로 읽었기 때문입니다. 그림 A의 아래 줄이 `add 문구 3000` 실행과 그다음 `list` 실행입니다. `[확정 사실]`

**Update·Delete — 메모리에서 바꾼 뒤 파일 전체를 다시 쓰기**

<!-- run | exit=0 -->
```text
$ python file_crud.py update 2 2500
파일에서 읽음: 3건
[U] 파일 전체를 다시 씀: {'id': 2, 'category': '교통', 'amount': 2500}
$ python file_crud.py delete 1
파일에서 읽음: 3건
[D] 파일 전체를 다시 씀 · 지운 거래: {'id': 1, 'category': '식비', 'amount': 8000}
$ python file_crud.py list
파일에서 읽음: 2건
  2 | 교통 | 2500
  3 | 문구 | 3000
```

<!-- file: data/transactions.jsonl -->
```jsonl
{"id":2,"category":"교통","amount":2500}
{"id":3,"category":"문구","amount":3000}
```

<!-- run: python file_crud.py update 9 100 | exit=1 -->
```text
$ python file_crud.py update 9 100
파일에서 읽음: 2건
[U] 그 id가 없어 파일을 다시 쓰지 않음
```

**CRUD가 파일에 반영되는 방법 — 이 예제에서**

| 동작 | 메모리에서 | 파일에서 | 파일 모드 |
| --- | --- | --- | --- |
| Create | `create()`: 리스트에 추가 | `append_one()`: **끝에 한 줄** | `"a"` |
| Read | `load_all()`이 만든 리스트를 그대로 사용 | `load_all()`: 한 줄씩 읽어 `json.loads()` | `"r"` |
| Update | `update_amount()`: id로 찾아 값 변경 | `save_all()`: **전체를 새 파일에 쓴 뒤 교체** | `"w"`(임시 파일) |
| Delete | `delete()`: id로 찾아 리스트에서 제거 | `save_all()`: 남은 항목으로 **전체를 다시 씀** | `"w"`(임시 파일) |
| 없는 id | `None` | **쓰지 않음**(파일 그대로) | — |

그림 C-2는 `update 2 2500` 한 번을 ① `load_all()` ② `update_amount()` ③ `save_all()`이 임시 파일에 쓰기 ④ `os.replace()`의 처리 순서로 보여 줍니다(호출 추적으로 확인).

읽을 때 짚을 점

- **메모리 CRUD 함수는 파일을 모릅니다.** `update_amount()`는 리스트 속 값만 바꿉니다. 그 결과가 남느냐는 `main()`이 `save_all()`을 부르느냐에 달려 있습니다. Scene 03-B의 '메모리 속 변경 ≠ 저장'을 코드로 나눈 모습입니다.
- **수정·삭제 때 파일 전체를 다시 쓰는 것은 가능한 구현 방법 가운데 하나**입니다. 작은 학습용 예제에서는 이해하기 쉽고 결과가 분명합니다. 데이터가 많아지면 쓰는 양이 커지므로 다른 설계(변경 기록 덧붙이기, 데이터베이스)를 검토합니다. `[설계 예시]`
- `save_all()`이 **원래 파일이 아니라 새 파일(`.tmp`)에 먼저 쓰는** 이유는 9절에서 봅니다.
- `load_all()`은 한 줄씩 읽지만 **결과를 리스트 하나에 모두 모읍니다.** 파일이 JSONL이어도 실행할 때마다 모든 거래가 메모리에 올라옵니다(→ 12절).
- `add`의 `create()`는 메모리 리스트에도 새 항목을 더합니다. 이 실행에서 목록을 더 쓰지 않으므로 없어도 결과는 같지만, **메모리의 변경과 파일의 변경이 따로 일어난다**는 것을 보이려고 남겼습니다. `[학습용 예제]`

### 9. 운영상의 안전 주의 — 기존 데이터를 지키며 쓰기

3절은 문법이었습니다. 이 절은 **실제 데이터를 다룰 때의 주의**입니다.

<!-- demo:w_mode_risk.py -->
```python
"""운영상의 주의: "w"는 여는 순간 내용을 비운다. 새 파일에 다 쓴 뒤 바꾸면 쓰다 실패해도 원본이 남는다."""
import os
from pathlib import Path

ORIGINAL = Path("notes.txt")
TEMP = Path("notes.txt.tmp")


def show(label):
    print(label, repr(ORIGINAL.read_text(encoding="utf-8")))


with open(ORIGINAL, "w", encoding="utf-8") as f:
    f.write("식비 8000\n교통 2000\n")
show("처음 내용:")

try:
    with open(ORIGINAL, "w", encoding="utf-8") as f:
        raise RuntimeError("새 내용을 쓰기 전에 오류가 났다고 가정")
except RuntimeError as error:
    print("① 원본을 바로 \"w\"로 연 뒤 오류:", error)
show("① 남은 원본:")

with open(ORIGINAL, "w", encoding="utf-8") as f:
    f.write("식비 8000\n교통 2000\n")

try:
    with open(TEMP, "w", encoding="utf-8") as f:
        f.write("식비 8000\n")
        raise RuntimeError("임시 파일을 쓰는 도중 오류가 났다고 가정")
    os.replace(TEMP, ORIGINAL)
except RuntimeError as error:
    TEMP.unlink(missing_ok=True)
    print("② 임시 파일에 쓰다가 오류:", error)
show("② 남은 원본:")

with open(TEMP, "w", encoding="utf-8") as f:
    f.write("식비 8000\n교통 2500\n")
os.replace(TEMP, ORIGINAL)
show("③ 다 쓴 뒤 os.replace()로 바꾼 원본:")
print("③ 임시 파일이 남았나?", TEMP.exists())
```

<!-- run: python w_mode_risk.py | exit=0 -->
```text
$ python w_mode_risk.py
처음 내용: '식비 8000\n교통 2000\n'
① 원본을 바로 "w"로 연 뒤 오류: 새 내용을 쓰기 전에 오류가 났다고 가정
① 남은 원본: ''
② 임시 파일에 쓰다가 오류: 임시 파일을 쓰는 도중 오류가 났다고 가정
② 남은 원본: '식비 8000\n교통 2000\n'
③ 다 쓴 뒤 os.replace()로 바꾼 원본: '식비 8000\n교통 2500\n'
③ 임시 파일이 남았나? False
```

- **① 원본을 바로 `"w"`로 열면** 여는 순간 내용이 비워집니다. 새 내용을 다 쓰기 전에 오류가 나면 원본이 빈 파일로 남습니다. 오류는 일부러 낸 것이지만 실제로도 변환 실패·디스크 공간 부족·강제 종료 등으로 생길 수 있습니다.
- **② 새 파일(임시 파일)에 먼저 다 쓰고, 성공했을 때만 `os.replace(임시, 원본)`으로 바꾸면** 쓰는 도중 실패해도 원본은 그대로입니다. 실패하면 남은 임시 파일을 지웁니다.
- **③ `os.replace()`** 는 원본 이름을 가진 파일을 임시 파일로 **바꿔 놓습니다.** 공식 문서는 이 바꾸기가 성공하면 원자적(atomic, 중간 상태가 없음)이라고 설명하는데, 이는 **POSIX(리눅스·macOS 계열)의 요구 사항**으로 적혀 있고, 두 파일이 **다른 파일시스템에 있으면 실패할 수 있습니다.** 그래서 임시 파일은 원본과 **같은 폴더**에 만듭니다. `[확정 사실]`

**이 방법이 모든 위험을 없애지는 않습니다.** `[단순화]`

- 운영체제·파일시스템마다 보장이 다릅니다. 전원이 갑자기 꺼지는 경우까지 대비하려면 `flush()`·`os.fsync()` 같은 추가 단계가 필요하고, 그래도 저장 장치와 설정에 따라 달라집니다. 이 장면의 예제는 그 단계를 넣지 않았습니다.
- 예제처럼 임시 파일 이름을 고정(`.tmp`)하면 두 프로그램이 동시에 같은 파일을 쓸 때 서로 겹칠 수 있습니다. 실제 프로그램은 `tempfile` 모듈로 겹치지 않는 이름을 만들기도 합니다(10절 `ledger`).
- 여러 프로그램이 같은 파일을 동시에 고치는 문제(잠금)는 이 장면에서 다루지 않습니다.

**실습할 때 데이터를 지키는 습관**

- 연습은 **새 실습 폴더**에서 합니다. 자기 프로그램을 시험할 때는 실제 데이터 폴더를 **복사한 사본**을 쓰거나, 데이터 폴더를 바꾸는 옵션이 있다면 테스트용 폴더를 지정합니다.
- `"w"`가 들어간 코드를 실행하기 전에 **경로(2절)** 를 확인합니다. 상대 경로는 실행한 위치에 따라 다른 파일을 가리킵니다.

### 10. 실제 미션 구현 사례 — `ledger` `[구현 사례]`

> `m03-pocket-money-ledger` `d14e812`에서 확인한 **한 가지 구현**입니다. 이 구조가 정답이라는 뜻이 아닙니다. 아래 동작은 이 장면 작업에서 실습용 임시 폴더(`--data-dir`가 가리키는 새 폴더)로 직접 실행해 확인했고, 실제 사용자 데이터는 쓰지 않았습니다. Generator(`iter_all()`)의 원리는 Scene 05에서 다룹니다.

| 질문 | `ledger`의 위치·방법 | 이 장면의 원리와 연결 |
| --- | --- | --- |
| 데이터 파일은 어디에? | `--data-dir` 옵션(기본값 `Path("data")`) 아래 `transactions.jsonl`·`categories.jsonl`·`budgets.jsonl` | 기본값이 **상대 경로**라 실행한 위치의 `data` 폴더를 쓴다(2절) |
| 파일을 여는 곳 | `ledger/repository.py`의 `_iter_jsonl()`(읽기), `_append_jsonl()`(추가), `_atomic_write_jsonl()`(다시 쓰기) | 세 함수가 모든 저장소 클래스의 파일 접근을 맡는다 |
| 추가(Create) | `_append_jsonl()`: `"a"` 모드로 한 줄, 쓰기 전에 폴더 생성 | 8절 `append_one()`과 같은 방식. `flush()`·`os.fsync()`까지 부른다 |
| 읽기(Read) | `_iter_jsonl()`: 한 줄씩 읽어 빈 줄은 건너뛰고 `json.loads()`, 파일이 없으면 빈 결과 | 8절 `load_all()`과 같은 처리를 하되 **리스트로 모으지 않고 하나씩 내보낸다**(`yield`, Scene 05) |
| 수정·삭제(Update·Delete) | `TransactionRepository.update()`·`delete()`: 전체를 읽어 바꾼 **목록을 만든 뒤** `_atomic_write_jsonl()`로 **임시 파일(`tempfile.mkstemp`, 같은 폴더) + `os.replace()`** | 8·9절의 '전체 다시 쓰기 + 임시 파일 교체'와 같은 원리. 없는 id면 쓰지 않고 오류 |
| 형식 | JSONL. 한 줄 예: `{"id": 2, "type": "expense", "date": "2026-10-02", "amount": 2500, "category": "교통", "memo": "", "tags": []}` | 기본 구분자(공백 있음)를 쓴다. 이 장면 예제의 짧은 줄과 같은 JSONL이다 |
| CSV 가져오기 | `LedgerService.import_csv()`: `newline=""`으로 열어 `csv.DictReader`, 헤더 검사 후 행마다 **문자열 값을 검증·변환**해 일반 추가 경로로 저장 | 6절의 '값은 문자열 → 변환·검증'. 쉼표가 든 따옴표 값(`"점심, 김밥"`)도 한 값으로 들어옴 |
| CSV 내보내기 | `LedgerService.export_csv()`: `csv.DictWriter`, 열 `date,type,category,amount,memo,tags`(**내부 id는 내보내지 않음**), 임시 파일 + `os.replace()` | 6절 내보내기. 줄 끝은 `csv` 모듈 기본값 `\r\n` |

- **같은 JSONL이어도 메모리 사용은 코드가 정합니다.** `_iter_jsonl()`은 한 줄씩 내보내지만, `update()`·`delete()`는 다시 쓸 목록을 **리스트로 모은 뒤** 씁니다. 읽기 방식과 결과를 보관하는 방식이 다르기 때문입니다(→ 12절, Scene 05).
- 저장(JSONL)과 교환(CSV)에 다른 형식을 쓴 것은 `ledger`의 **설계 선택**입니다. 일반 규칙이 아닙니다(7절).

### 11. 내 코드에서 찾아보기 (대면 강의 활동)

목적은 코드를 평가하는 것이 아니라 **자기 코드에서 데이터가 파일과 오가는 곳을 찾아 말하는 방법**을 익히는 것입니다. 파일 구조·함수 이름·클래스 이름이 달라도 같은 질문으로 찾습니다.

> **먼저 데이터를 지킵니다.** 실제 데이터 파일은 그대로 두고, 프로그램을 실행해 확인할 때는 데이터 폴더의 **사본**이나 별도 테스트 폴더를 씁니다.

1. **실제 데이터 파일은 어디에 저장되는가?** 파일 이름·확장자·폴더를 찾고, 그 경로가 **상대 경로인지**(어디서 실행해야 하는지) 확인합니다.
2. **파일을 여는 코드는 어디에 있는가?** `open(`, `Path(…).open(`, `read_text(`, `write_text(`를 검색합니다.
3. **파일을 읽는 함수와 쓰는 함수는 어디에 있는가?** 모드가 `"r"`·`"w"`·`"a"` 중 무엇인지, `encoding="utf-8"`을 적었는지 봅니다.
4. **JSON·JSONL·CSV 중 어떤 형식을 쓰는가?** `json.load`/`json.dump`(JSON 문서), 줄마다 `json.loads`/`json.dumps` + `"\n"`(JSONL), `csv.`(CSV)로 구분합니다.
5. **거래를 수정·삭제했을 때 파일이 어떻게 갱신되는가?** 전체를 다시 쓰는지, 임시 파일과 `os.replace()`를 쓰는지, 원본을 바로 `"w"`로 여는지 확인합니다.
6. **CSV 가져오기·내보내기는 어디에서 처리되는가?** `csv.reader`/`DictReader`/`writer`/`DictWriter`, `newline=""`, 문자열 → 숫자 변환 위치를 찾습니다.
7. **데이터를 한꺼번에 읽는지 한 건씩 처리하는지 확인할 단서는?** `.read()`·`.readlines()`·`json.load(f)`(한꺼번에), `for line in f`·`csv.reader`(한 줄·한 행씩), 그 결과를 `append()`나 `list()`로 **모으는지**, `yield`가 있는지 봅니다(→ Scene 05).

| 질문 | 내 코드에서 찾은 곳(파일·함수·줄) | 근거가 된 코드 한 줄 | 내 말로 설명 |
| --- | --- | --- | --- |
| 1 데이터 파일 위치 | | | |
| 2 파일을 여는 곳 | | | |
| 3 읽는 함수 / 쓰는 함수 | | | |
| 4 형식 | | | |
| 5 수정·삭제 시 갱신 | | | |
| 6 CSV 가져오기·내보내기 | | | |
| 7 한꺼번에 / 한 건씩 | | | |

| 내 코드의 모습 | 이렇게 읽습니다 |
| --- | --- |
| **JSON 문서 하나**에 전체를 저장 | `json.load`로 전체 읽기 → 바꾸기 → `json.dump`로 전체 쓰기 흐름을 찾습니다. 한 건 추가도 전체 쓰기인지 확인합니다 |
| **파일 저장이 없음**(메모리만) | Scene 03-B 상태입니다. 다음 실행에 데이터가 남는지 직접 확인하고, 어디에 `load`·`save`를 붙일지 말해 봅니다 |
| **SQLite 등 데이터베이스** | `open()` 대신 연결(`connect`)·쿼리 실행 코드가 '파일을 여는 곳·읽기·쓰기'에 해당합니다. 같은 7개 질문으로 위치를 찾습니다 |
| 읽기·쓰기가 **여러 파일에 흩어져 있음** | `open(` 검색 결과를 모두 표에 적고, 같은 데이터 파일을 여는 곳끼리 묶습니다 |
| 파일 이름이 다름(`storage.py`, `db.py`, `io_utils.py` 등) | 이름보다 **하는 일**(열기·모드·형식)로 칸을 채웁니다 |

**AI에게 물어볼 때 (보조 질문)** — AI의 답은 확인할 단서일 뿐입니다. 답에 나온 줄을 **직접 열어 보고**, 마지막에는 자기 말로 "이 파일의 이 함수가 이 파일을 이 모드로 연다"고 말할 수 있어야 합니다.

- "이 프로젝트에서 `open()`이나 파일 읽기·쓰기를 하는 줄을 모두 찾아 **파일 이름·줄 번호·모드**를 표로 보여 주세요."
- "거래를 수정·삭제하면 데이터 파일이 어떻게 바뀌나요? 전체를 다시 쓰나요, 덧붙이나요? 근거가 된 줄을 알려 주세요."
- "이 코드는 데이터 파일을 한꺼번에 읽나요, 한 줄씩 처리하나요? 읽은 결과를 리스트에 모으는 줄이 있나요?"
- "CSV를 읽을 때 문자열을 숫자로 바꾸는 줄은 어디인가요?"

### 12. 다음 장면으로 — 거래가 10만 건이라면?

8절의 `load_all()`은 실행할 때마다 **파일 전체를 읽어 리스트 하나로** 만듭니다. 거래 3건이면 문제가 없습니다.

> **Scene 05의 질문:** 거래 데이터가 **10만 건**이라면, 목록 일부를 보거나 합계를 내려고 할 때마다 파일 전체를 한꺼번에 읽어 메모리에 올려야 할까?

이 장면에서 확인한 단서는 세 가지입니다.

- JSONL과 CSV는 **한 줄(한 행)씩 읽을 수 있는** 형식이다. `for line in f`는 파일을 한 줄씩 꺼낸다.
- 그래도 **읽은 결과를 리스트에 모두 모으면** 메모리에는 전체가 올라간다(`jsonl_basics.py`의 마지막 줄, `load_all()`).
- 메모리 사용량은 형식이 아니라 **읽는 방법과 결과를 보관하는 방법**이 정한다.

Scene 05는 Iterable·Iterator·Generator·`yield`를 먼저 독립적으로 설명한 뒤, **필요할 때 한 건씩 읽는 방법**을 JSONL 줄 단위 처리와 연결합니다.

### 13. 한 문장 정리

> 메모리의 값은 프로그램이 끝나면 사라지므로, 실행이 끝나도 남기려면 **값을 글자로 바꿔(직렬화) 파일에 쓰고, 다음 실행에서 읽어 되돌려야(역직렬화)** 합니다. Python에서는 `with open(경로, 모드, encoding="utf-8")`로 파일을 열고, JSON은 문서 하나, JSONL은 한 줄에 값 하나, CSV는 행과 열의 표로 같은 데이터를 담습니다. 추가는 덧붙이기로 되지만 수정·삭제는 보통 **전체를 다시 쓰며**, 그때 기존 데이터를 지키는 방법을 함께 정해야 합니다.

---

## 강사용 안내

> 대면 강의는 우리 교육 모델의 **필수 초기 단계**(운영 선택)이며 코디세이 공식 규정이 아닙니다. 시간 배분은 시범 운영 후 확정합니다.

**준비** — `drafts/b2-1-story-map/scene-04/_tools/demo/`를 **새 실습 폴더 `practice`** 로 복사하고 그 안에서 실행합니다. 데모는 표준 라이브러리만 쓰며, 실행하면 그 폴더에 `memo.txt`·`notes.txt`·`transactions.json`·`transactions.jsonl`·`transactions.csv`·`memo.csv`·`data/`가 생깁니다. 시연을 처음부터 다시 하려면 이 파일과 `data/` 폴더를 지웁니다(실습 폴더에서만).

**권장 진행 순서**

1. **질문** — Scene 03-B 마지막의 "`add` 뒤 `list`에 id 5가 없다"를 다시 보여 주고 "왜 사라졌을까?"를 묻습니다.
2. **메모리 ↔ 파일** — `python memory_only.py add` 뒤 `python memory_only.py`. 그림 A의 위 줄을 단계별로 짚습니다. "`print()`로 보였다 ≠ 저장됐다"를 말합니다.
3. **경로** — `python where_file.py`를 실습 폴더와 상위 폴더에서 한 번씩. "같은 코드인데 왜 결과가 달라질까?"
4. **기본 문법** — `python text_io.py`. 모드 표를 함께 채우고, 다시 `"w"`로 열었을 때 세 줄이 사라지는 것을 강조합니다. **문법과 운영상 주의(9절)를 섞지 않습니다.**
5. **JSON** — 이름의 뜻 → 값 여섯 가지 → `python json_basics.py`. `print(딕셔너리)`와 `json.dumps()` 출력의 따옴표 차이를 묻습니다. 네 함수는 "s = string"으로 정리합니다.
6. **JSONL** — `python jsonl_basics.py`. 그림 C-1에서 줄 ↔ 딕셔너리를 손가락으로 짚고, `Extra data` 오류로 "파일 전체는 JSON 하나가 아니다"를 확인합니다.
7. **CSV** — `python csv_basics.py`. `amount의 종류: str`에서 멈추고 "합계를 내려면?"을 묻습니다. 따옴표 세 경우는 표로만 짚습니다.
8. **비교** — 그림 B. "어느 형식이 정답인가?"에 **정답이 없다**는 결론으로 이끕니다(요구와 설계).
9. **파일 CRUD** — `file_crud.py`를 `list` → `add` 세 번 → `list` 순서로 따로 실행하며 그림 A 아래 줄과 맞춥니다. `update 2 2500`은 그림 C-2의 ①~④로 따라갑니다.
10. **안전 주의** — `python w_mode_risk.py`의 ① 결과(`''`)를 보여 주고 ②·③과 비교합니다. `os.replace()`의 보장 범위(같은 파일시스템, 원자성은 POSIX 요구)를 과장하지 않습니다.
11. **`ledger` 사례** — 질문이 있을 때만. 표의 '파일을 여는 곳' 세 함수와 `--data-dir`만 짚습니다. **실제 데이터 폴더로 시연하지 않습니다.**
12. **내 코드에서 찾아보기** — 동의한 교육생 한 명의 코드로 질문 1~3을 함께 한 뒤 각자 7번까지 진행합니다.
13. **다음 질문** — 10만 건 질문으로 끝내고 답은 Scene 05로 넘깁니다. 여기서 Generator 문법을 설명하지 않습니다.

**흔한 오해와 교정**

| 학습자의 말 | 교정 |
| --- | --- |
| "`print()`로 보였으니 저장됐어요" | 화면 출력은 메모리의 값을 보인 것입니다. 다시 실행해 읽어 봐야 저장을 확인할 수 있습니다 |
| "변수에 넣으면 컴퓨터에 남아요" | 변수는 실행 중 메모리에만 있습니다. 프로그램이 끝나면 사라집니다 |
| "`"w"`는 끝에 이어서 써요" | `"w"`는 여는 순간 비웁니다. 이어 쓰기는 `"a"`입니다 |
| "파일은 `.py` 파일 옆에 생겨요" | 상대 경로는 **실행한 위치**(현재 작업 디렉터리) 기준입니다 |
| "`encoding`은 안 써도 돼요" | 기본 인코딩은 실행 환경마다 다릅니다(이 작업의 Windows는 `cp949`). 텍스트 파일은 `"utf-8"`을 적습니다 |
| "`print(딕셔너리)` 결과를 저장하면 JSON이에요" | 작은따옴표 등 Python 표시 방식이라 JSON이 아닙니다. `json.dumps()`를 씁니다 |
| "JSONL 파일도 `json.load()`로 한 번에 읽어요" | 파일 전체는 JSON 값 하나가 아닙니다(`Extra data`). 줄마다 `json.loads()` |
| "JSONL을 쓰면 메모리를 덜 써요" | 한 줄씩 **처리할 수 있을** 뿐입니다. 결과를 리스트에 모으면 전체가 메모리에 올라옵니다 |
| "CSV에서 읽은 금액으로 바로 더하면 돼요" | 값은 문자열입니다. `int()`로 바꿉니다 |
| "CSV는 한 줄 = 한 행이에요" | 따옴표 안의 줄바꿈 때문에 한 행이 여러 줄일 수 있습니다 |
| "수정도 끝에 한 줄 추가하면 돼요" | 같은 id가 두 줄이 됩니다. 이 예제는 전체를 다시 씁니다 |
| "`os.replace()`를 쓰면 무조건 안전해요" | 쓰는 도중 실패에서 원본을 지키는 방법입니다. 전원 차단·동시 쓰기·다른 파일시스템 등은 따로 고려합니다 |
| "저장은 JSONL, 교환은 CSV가 규칙이에요" | 프로그램의 요구와 설계에 따른 선택입니다 |

**수준 조절** — 입문 이전 학습자는 1~3절, 그림 A, JSONL(5절)과 활동 1~4까지. 여유가 있으면 CSV 따옴표 규칙, 그림 C-2, 9절로 확장합니다. 바이너리 모드(`"b"`), `"x"`·`"+"` 모드, `pickle`, 파일 잠금, `fsync`의 세부는 다루지 않습니다.

## 이해 확인 질문 (점수화하지 않음)

| # | 질문 | 확인할 내용 |
| --- | --- | --- |
| 1 | `memory_only.py add`로 추가한 id 3이 다음 실행에 없는 이유는? | 메모리에만 있었고 프로그램이 끝나며 사라짐 |
| 2 | `"w"`와 `"a"`는 기존 파일에 무엇을 다르게 하나요? | 비우고 처음부터 / 그대로 두고 끝에 |
| 3 | `json.dumps()`와 `json.dump()`의 차이는? | 문자열을 돌려줌 / 파일 객체에 씀 |
| 4 | JSONL 파일 전체를 `json.loads()` 하나로 읽으면 왜 오류가 나나요? | 파일 전체가 JSON 값 하나가 아님. 줄마다 따로 |
| 5 | CSV에서 읽은 `amount`로 합계를 내려면 무엇을 해야 하나요? | 문자열이므로 `int()`로 변환 |
| 6 | `file_crud.py`에서 수정은 왜 파일 끝에 한 줄을 덧붙이지 않고 전체를 다시 쓰나요? 쓸 때 원본 대신 임시 파일에 먼저 쓰는 이유는? | 같은 id가 두 줄이 됨 / 쓰다 실패해도 원본이 남게 |
| 7 | 파일이 JSONL이면 메모리를 적게 쓰나요? | 아니요. 읽는 방법과 결과 보관 방법이 정함 → Scene 05 |

## 근거와 출처

| 내용 | 분류 | 출처 |
| --- | --- | --- |
| `open()`의 모드(`"r"` 기본, `"w"` 먼저 비움, `"a"` 끝에 덧붙임), 상대 경로는 현재 작업 디렉터리 기준, 텍스트 모드의 기본 인코딩은 환경에 따름 | 확정 사실 | [Built-in functions `open`](https://docs.python.org/3/library/functions.html#open) |
| `with`로 연 파일은 블록이 끝나면(예외가 나도) 닫힘, `read()`·`for line in f`·`write()`(쓴 글자 수 반환, 줄바꿈 자동 아님), `with` 없이 닫지 않으면 내용이 다 기록되지 않을 수 있음 | 확정 사실 | [Tutorial §7.2 Reading and Writing Files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files), [§7.2.1](https://docs.python.org/3/tutorial/inputoutput.html#methods-of-file-objects) |
| `Path`의 `/` 결합·`cwd()`·`resolve()`·`as_posix()`·`exists()`·`mkdir(parents, exist_ok)`·`read_text()`·`with_name()`·`unlink(missing_ok)` | 확정 사실 | [pathlib](https://docs.python.org/3/library/pathlib.html) |
| `os.replace()`: 대상이 파일이면 바꿔 놓음, 다른 파일시스템이면 실패할 수 있음, 성공하면 원자적(POSIX 요구 사항) | 확정 사실 | [os.replace](https://docs.python.org/3/library/os.html#os.replace) |
| JSON의 이름·정의(언어 독립 데이터 교환 형식), 값 여섯 가지 | 확정 사실 | [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259), [ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/) |
| `json.dumps/loads/dump/load`, Python ↔ JSON 변환표, `ensure_ascii` 기본 `True`, `indent`, `separators`, 키는 문자열로 바뀜, `JSONDecodeError` | 확정 사실 | [json](https://docs.python.org/3/library/json.html) |
| JSONL: UTF-8, 한 줄에 유효한 JSON 값 하나, 줄 구분 `\n`, 확장자 `.jsonl`, 한 레코드씩 처리 가능 | 확정 사실 | [jsonlines.org](https://jsonlines.org/) |
| CSV 모듈: `reader`·`writer`·`DictReader`·`DictWriter`, 읽은 값은 문자열(자동 형 변환 없음), `newline=""` 권장 이유, 기본 dialect `excel`의 따옴표 규칙(`QUOTE_MINIMAL`, `doublequote`), 단일 표준 없음 | 확정 사실 | [csv](https://docs.python.org/3/library/csv.html), [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180)(참고 형식) |
| 2~9절의 모든 출력·종료 코드·파일 내용, 재실행 결과, `update 2 2500`의 처리 순서, 상위 폴더에서 실행할 때의 경로 차이 | 확정 사실(실행 확인) | `_tools/demo/`, Python 3.14.6, Windows 11, 2026-10-23. `_tools/verify_demo.py`가 데모를 **임시 폴더에 복사해** 원고 순서대로 실행하고 원고·파일·그림과 대조 |
| 이 Windows 환경의 기본 인코딩 `cp949`, 없는 폴더에 `"w"` → `FileNotFoundError`, `"a"`는 없는 파일을 만듦, `newline=""` 없이 CSV를 쓰면 `\r\r\n`과 빈 행 | 확정 사실(실행 확인) | `_tools/verify_demo.py`의 '기술 사실 확인'(임시 폴더) |
| 메모리는 실행 중에만, 운영체제가 종료된 프로그램의 메모리를 회수, 버퍼의 세부 | 단순화 | 일반적인 운영체제·입출력 설명. 캐시·가상 메모리·파일시스템 버퍼는 생략 |
| 수정·삭제 시 전체 다시 쓰기, 변경 기록 덧붙이기·데이터베이스, 저장/교환 형식 선택, 경로 고정 방법 | 설계 예시 | 여러 설계 가운데 하나. Python 문법·표준이 아님 |
| `ledger`의 데이터 폴더·파일 접근 함수 3개·JSONL 한 줄 모양·CSV 가져오기/내보내기·임시 파일 + `os.replace` | 구현 사례 | `m03-pocket-money-ledger` `d14e812`: `ledger/repository.py`(`_iter_jsonl`·`_append_jsonl`·`_atomic_write_jsonl`·`TransactionRepository`), `ledger/services.py`(`import_csv`·`export_csv`·`CSV_FIELDNAMES`), `ledger/cli.py`(`--data-dir`, `DEFAULT_DATA_DIR`). 실습용 임시 폴더에서 `category add`·`import`·`update`·`delete`·`export` 실행 확인(2026-10-23) |
