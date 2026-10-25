# Scene 03-B 원고 — 데이터는 어떻게 추가·조회·수정·삭제되고, 검색과 요약에 활용될까?

> **상태:** 시안 · GPT 독립 콘텐츠 검토와 Owner 승인 전. 기준: [시나리오 v2](../scenario-v2.md) · 2026-10-23
> **그림:** [노트북용](crud-flow-desktop.svg) · [휴대전화용](crud-flow-mobile.svg) · 설계는 [design-notes.md](design-notes.md) · 데모 코드 `_tools/demo/`

| 항목 | 내용 |
| --- | --- |
| 학습 질문 | **데이터는 어떻게 추가·조회·수정·삭제되고, 검색과 요약에 활용될까?** |
| 도달 기준 | CRUD 네 동작과 검색·요약의 차이를 자기 말로 설명하고, 리스트·딕셔너리·`for`·`if`로 그 동작이 어떻게 만들어지는지 읽을 수 있다. 자기 코드에서 **데이터를 바꾸는 코드, 값을 계산해 돌려주는 코드, 출력만 하는 코드**를 찾아 구분해 말할 수 있다 |
| 이전 장면과의 관계 | Scene 03-A는 함수·클래스와 책임을 나누는 구조를 목록 조회 한 기능으로 봤다. 이 장면은 그 구조 위에서 **데이터가 실제로 바뀌는 과정**을 본다 |
| 이 장면의 범위 | **메모리 안의 데이터**(프로그램이 실행되는 동안만 있는 리스트)로 CRUD·검색·요약을 설명한다 |
| Scene 04·05로 넘김 | 파일에 영구 저장하기(JSON·JSONL·CSV, 파일 읽기·쓰기, 가져오기·내보내기)는 Scene 04. Iterable·Iterator·Generator·`yield`, 한 줄씩 처리하기는 Scene 05 |
| 공식 목표 대응 `[요구 추적]` | 목표 1의 'CRUD·검색·요약' 부분(주 장면 04는 파일 저장), 목표 2의 '계층별 책임'(주 장면 03-A)을 보조한다 |
| 근거 표기 | `[확정 사실]` 공식 문서 + 실행 확인 · `[단순화]` · `[설계 예시]` Python 문법이 아닌 설계 선택 · `[구현 사례]` `ledger` · `[학습용 예제]` 이 장면을 위해 만든 독립 예제 |

> 이 장면의 예제(`crud_basics.py`, `search_summary.py`, 가상 패키지 `cashbook`)는 **Python의 기본 데이터 처리 원리를 보여 주려고 만든 독립적인 학습용 예제**입니다. 실제 `ledger` 소스나 공식 미션의 정답 구현이 아닙니다. `[학습용 예제]`

---

## 학습자 원고

### 1. CRUD — 데이터에 하는 네 가지 기본 동작

| 용어 | 뜻 | 데이터에 일어나는 일 | 이 장면의 예 |
| --- | --- | --- | --- |
| **C**reate | 생성 | 새 데이터를 **추가**한다 | 거래 한 건 추가 |
| **R**ead | 읽기 | 있는 데이터를 **조회**한다(바뀌지 않음) | 전체 목록 보기, id로 한 건 찾기 |
| **U**pdate | 수정 | 있는 데이터의 **값을 바꾼다** | id 2 거래의 금액 변경 |
| **D**elete | 삭제 | 있는 데이터를 **없앤다** | id 3 거래 삭제 |

- CRUD는 **Python 문법이 아닙니다.** 메모 앱, 쇼핑몰 장바구니, 회원 관리처럼 데이터를 다루는 거의 모든 프로그램에 공통으로 나오는 **데이터 처리 개념**입니다. 데이터베이스의 SQL 명령(INSERT·SELECT·UPDATE·DELETE)이나 웹 요청 방식에 대응시켜 설명하는 경우가 많지만, CRUD 자체가 그 명령은 아닙니다. `[단순화]`
- Python에는 `create`나 `delete`라는 특별한 명령이 따로 없습니다. **리스트·딕셔너리 같은 자료구조**와 **함수·메서드**로 네 동작을 직접 만듭니다. 이 장면은 그 방법을 봅니다.

### 2. 준비 — 데이터를 담는 모양

CRUD를 읽는 데 꼭 필요한 문법만 짚습니다. `[확정 사실]`

- **변수와 값** — `amount = 8000`은 값 `8000`에 `amount`라는 이름을 붙입니다.
- **딕셔너리(dict)** — `{키: 값, …}`. **키로 값을 찾습니다.** 거래 한 건처럼 "id는 2, 분류는 식비"라는 **이름 붙은 정보 묶음**에 알맞습니다. `item["amount"]`로 꺼내고, `item["amount"] = 7000`처럼 대입하면 그 키의 값이 바뀝니다. 한 딕셔너리 안에서 키는 겹치지 않습니다.
- **리스트(list)** — `[값, 값, …]`. **순서가 있는 묶음**입니다. 위치(인덱스)는 **0부터** 세고 `-1`은 마지막입니다. `append()`로 끝에 추가하고, `리스트[위치] = 값`으로 바꾸고, `del 리스트[위치]`로 지웁니다. `len()`은 개수입니다.
- **`for` 반복문** — 리스트의 항목을 **하나씩 꺼내** 같은 일을 합니다.
- **`if` 조건문** — 조건이 참일 때만 실행합니다. `==`(같다), `!=`(다르다), `>=`(크거나 같다)로 비교합니다.

이 장면의 거래 데이터는 **딕셔너리 여러 개를 담은 리스트**입니다. 한 행 = 딕셔너리 하나, 목록 전체 = 리스트 하나입니다(그림 A의 '데이터를 담는 모양').

<!-- demo:data_basics.py -->
```python
"""Scene 03-B 준비: 변수와 값, 딕셔너리와 리스트, 반복과 조건."""

amount = 8000
item = {"id": 2, "type": "지출", "category": "식비", "amount": amount}
print("키로 꺼내기:", item["category"], item["amount"])
item["amount"] = 7000
print("키로 바꾸기:", item)

names = ["용돈", "식비", "교통"]
names.append("문구")
print("위치로 꺼내기:", names[0], names[-1], "개수", len(names))
names[1] = "점심"
del names[2]
print("바꾸고 지운 뒤:", names)

for name in names:
    if name != "용돈":
        print("반복 + 조건:", name)
```

<!-- run: python data_basics.py | exit=0 -->
```text
$ python data_basics.py
키로 꺼내기: 식비 8000
키로 바꾸기: {'id': 2, 'type': '지출', 'category': '식비', 'amount': 7000}
위치로 꺼내기: 용돈 문구 개수 4
바꾸고 지운 뒤: ['용돈', '점심', '문구']
반복 + 조건: 점심
반복 + 조건: 문구
```

### 3. 왜 ID가 필요할까?

리스트의 **위치(인덱스)는 항목이 지워지거나 끼어들면 바뀝니다.** 같은 날 같은 분류·같은 금액의 거래가 두 번 있을 수도 있어서, 내용만으로 "그 거래"를 가리킬 수도 없습니다. 그래서 항목마다 **다른 번호(ID, 식별자)**를 붙이고, 수정·삭제할 대상은 위치가 아니라 **ID로 찾습니다.** `[확정 사실]`

<!-- demo:why_id.py -->
```python
"""위치(인덱스)는 바뀔 수 있지만 ID는 바뀌지 않는다."""

rows = [
    {"id": 1, "category": "용돈"},
    {"id": 2, "category": "식비"},
    {"id": 3, "category": "교통"},
]
print("삭제 전 rows[1]:", rows[1])
del rows[0]
print("삭제 후 rows[1]:", rows[1])

for row in rows:
    if row["id"] == 2:
        print("id가 2인 항목:", row)
```

<!-- run: python why_id.py | exit=0 -->
```text
$ python why_id.py
삭제 전 rows[1]: {'id': 2, 'category': '식비'}
삭제 후 rows[1]: {'id': 3, 'category': '교통'}
id가 2인 항목: {'id': 2, 'category': '식비'}
```

`rows[1]`이라는 같은 위치가 삭제 뒤에는 다른 항목(`id` 3)을 가리킵니다. 위치를 기억해 두었다가 나중에 그 위치를 지우면 **엉뚱한 항목을 지울 수 있습니다.** 반면 리스트의 위치가 바뀌어도 **남아 있는 항목의 ID는 그대로**이므로, ID로 찾으면 그 항목을 계속 가리킵니다. 다만 **지운 항목의 ID를 나중에 새 항목에 다시 쓰는지는 ID를 만드는 규칙에 따라 다릅니다**(바로 아래).

- **ID는 겹치지 않아야 합니다.** 이 장면의 예제는 새 ID를 "지금 있는 가장 큰 id + 1"로 정합니다. 이 규칙에서는 **마지막 항목을 지운 뒤 추가하면 그 번호가 다시 쓰입니다.** 그러면 예전에 적어 둔 그 번호가 이제는 새 항목을 가리킵니다. 지운 번호를 다시 쓰지 않으려면 "다음 번호"를 따로 기억하는 방법을 씁니다. 어느 쪽을 쓸지는 프로그램이 정할 규칙입니다. `[단순화]`
- **없는 ID**를 받는 경우를 반드시 정해야 합니다. 이 예제는 "찾지 못함"을 `None`으로 돌려주고, 부른 쪽이 그것을 보고 판단합니다.

### 4. CRUD를 함수로 만들기 — 바꾸는 코드, 돌려주는 코드, 출력하는 코드 (그림 A)

함수 하나가 한 가지 일을 맡도록 나눴습니다. **데이터를 바꾸는 함수는 출력하지 않고, 출력하는 함수는 데이터를 바꾸지 않습니다.** 클래스 없이 파일 하나에 함수만으로 만든 예제입니다. `[학습용 예제]`

<!-- demo:crud_basics.py -->
```python
"""Scene 03-B 학습용 예제: 메모리 안의 거래 목록으로 CRUD (파일 저장 없음)."""

transactions = [
    {"id": 1, "type": "수입", "category": "용돈", "amount": 30000},
    {"id": 2, "type": "지출", "category": "식비", "amount": 8000},
    {"id": 3, "type": "지출", "category": "교통", "amount": 2000},
    {"id": 4, "type": "지출", "category": "식비", "amount": 5000},
]


def next_id(items):
    biggest = 0
    for item in items:
        if item["id"] > biggest:
            biggest = item["id"]
    return biggest + 1


def create(items, tx_type, category, amount):
    item = {"id": next_id(items), "type": tx_type, "category": category, "amount": amount}
    items.append(item)
    return item


def read_all(items):
    return list(items)


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


def show(title, items):
    print(f"== {title} ({len(items)}건)")
    for item in items:
        print(f'  {item["id"]} | {item["type"]} | {item["category"]} | {item["amount"]}')


show("처음 상태", read_all(transactions))

added = create(transactions, "지출", "문구", 3000)
print("[C] 추가:", added)
show("추가 후", read_all(transactions))

print("[R] id 2 조회:", read_one(transactions, 2))

before = read_one(transactions, 2)["amount"]
changed = update_amount(transactions, 2, 7000)
print(f"[U] id 2 금액: {before} → {changed['amount']}")
show("수정 후", read_all(transactions))

removed = delete(transactions, 3)
print("[D] 삭제:", removed)
show("삭제 후", read_all(transactions))

print("[R] id 3 조회:", read_one(transactions, 3))
print("[D] 없는 id 9 삭제:", delete(transactions, 9), f"→ {len(transactions)}건 그대로")
```

<!-- run: python crud_basics.py | exit=0 -->
```text
$ python crud_basics.py
== 처음 상태 (4건)
  1 | 수입 | 용돈 | 30000
  2 | 지출 | 식비 | 8000
  3 | 지출 | 교통 | 2000
  4 | 지출 | 식비 | 5000
[C] 추가: {'id': 5, 'type': '지출', 'category': '문구', 'amount': 3000}
== 추가 후 (5건)
  1 | 수입 | 용돈 | 30000
  2 | 지출 | 식비 | 8000
  3 | 지출 | 교통 | 2000
  4 | 지출 | 식비 | 5000
  5 | 지출 | 문구 | 3000
[R] id 2 조회: {'id': 2, 'type': '지출', 'category': '식비', 'amount': 8000}
[U] id 2 금액: 8000 → 7000
== 수정 후 (5건)
  1 | 수입 | 용돈 | 30000
  2 | 지출 | 식비 | 7000
  3 | 지출 | 교통 | 2000
  4 | 지출 | 식비 | 5000
  5 | 지출 | 문구 | 3000
[D] 삭제: {'id': 3, 'type': '지출', 'category': '교통', 'amount': 2000}
== 삭제 후 (4건)
  1 | 수입 | 용돈 | 30000
  2 | 지출 | 식비 | 7000
  4 | 지출 | 식비 | 5000
  5 | 지출 | 문구 | 3000
[R] id 3 조회: None
[D] 없는 id 9 삭제: None → 4건 그대로
```

| 함수 | CRUD | 데이터를 바꾸나? | 돌려주는 것 | 출력하나? |
| --- | --- | --- | --- | --- |
| `create()` | C | **바꿈** — `append()`로 목록 끝에 추가 | 추가한 딕셔너리 | 아니요 |
| `read_all()` | R | 아니요 | 목록을 **새 리스트로 복사**한 것 | 아니요 |
| `read_one()` | R | 아니요 | id가 같은 딕셔너리, 없으면 `None` | 아니요 |
| `update_amount()` | U | **바꿈** — 찾은 딕셔너리의 `"amount"` 값 | 바뀐 딕셔너리, 없으면 `None` | 아니요 |
| `delete()` | D | **바꿈** — `remove()`로 목록에서 제거 | 지운 딕셔너리, 없으면 `None` | 아니요 |
| `show()` | — | 아니요 | 없음(`None`) | **예** — 화면에 표시만 |

읽을 때 짚을 점 `[확정 사실]`

- **수정과 삭제는 조회 위에 섭니다.** `update_amount()`와 `delete()`는 먼저 `read_one()`으로 id가 같은 항목을 찾고, 찾았을 때만 바꿉니다. 그래서 없는 id(3을 지운 뒤의 3, 처음부터 없는 9)는 `None`이 되고 목록은 그대로입니다.
- **`read_one()`이 돌려주는 딕셔너리는 리스트 안의 바로 그 딕셔너리입니다.** 복사본이 아니므로 `item["amount"] = amount`로 바꾸면 목록의 데이터가 바뀝니다. 이것이 `update_amount()`가 작동하는 이유입니다.
- **`read_all()`은 `list(items)`로 새 리스트를 만들어 돌려줍니다.** 받은 쪽이 그 리스트에 항목을 더하거나 빼도 원본 목록의 개수는 바뀌지 않습니다. 다만 안의 딕셔너리는 원본과 같은 것입니다(값을 바꾸면 원본도 바뀜). 자세한 복사 규칙은 다루지 않습니다. `[단순화]`
- **`remove(값)`은 그 값과 같은(`==`) 첫 항목을 지웁니다.** 없는 값이면 `ValueError`가 나므로, 이 예제는 `read_one()`으로 먼저 찾은 항목만 지웁니다.
- **삭제 뒤에 위치는 당겨지지만 ID는 그대로입니다.** id 3을 지우면 id 4·5의 위치는 하나씩 앞으로 오지만 번호는 4·5입니다(3절).

그림 A는 이 실행을 카드 네 장으로 보여 줍니다. 각 카드의 표는 **그 동작 바로 뒤의 목록**이고, 바뀐 행은 글자 표시(`+ 추가`·`읽음`·`값 변경`·`− 삭제`)와 테두리 모양으로 구분합니다. 카드에 번호를 붙이지 않은 까닭은 그림 B의 '호출 순서 번호'와 섞이지 않게 하려는 것입니다. 카드는 위에서부터 실행한 차례대로 놓여 있습니다.

### 5. 검색과 요약 — 같은 원본에서 다른 결과를 만든다

| | Read(조회) | 검색(Search) | 요약(Summary·Aggregation) |
| --- | --- | --- | --- |
| 하는 일 | 정한 항목이나 전체를 **그대로 가져온다** | 여러 항목 가운데 **조건에 맞는 것만 골라 낸다** | 여러 값을 **계산해 하나의 의미 있는 결과로 묶는다** |
| 결과 | 원래 항목(또는 전체 목록) | **새 목록**(조건에 맞는 항목들) | **새 값**(합계·건수·평균·분류별 합계) |
| 예 | id 2 거래 | 분류가 식비인 거래, 금액이 5000 이상인 거래 | 지출 합계, 지출 건수, 분류별 지출 |

- 검색은 Read의 한 형태로 볼 수 있지만, **조건을 판단하는 규칙**이 더해진다는 점이 다릅니다. 요약은 항목을 고르는 데서 그치지 않고 **값을 계산**합니다.
- **검색과 요약을 위해 데이터를 따로 저장할 필요는 없습니다.** 같은 원본 목록에 서로 다른 처리 규칙(조건·계산)을 적용하면 됩니다. 결과는 새 목록·새 값이고 **원본은 바뀌지 않습니다.** `[확정 사실]`

<!-- demo:search_summary.py -->
```python
"""Scene 03-B 학습용 예제: 같은 원본 목록에서 검색 결과와 요약 결과를 만든다 (원본은 바꾸지 않음)."""

transactions = [
    {"id": 1, "type": "수입", "category": "용돈", "amount": 30000},
    {"id": 2, "type": "지출", "category": "식비", "amount": 8000},
    {"id": 3, "type": "지출", "category": "교통", "amount": 2000},
    {"id": 4, "type": "지출", "category": "식비", "amount": 5000},
]


def search(items, key, value):
    found = []
    for item in items:
        if item[key] == value:
            found.append(item)
    return found


def search_amount_at_least(items, minimum):
    found = []
    for item in items:
        if item["amount"] >= minimum:
            found.append(item)
    return found


def summarize(items):
    expenses = []
    by_category = {}
    for item in items:
        if item["type"] == "지출":
            expenses.append(item["amount"])
            by_category[item["category"]] = by_category.get(item["category"], 0) + item["amount"]
    average = 0
    if len(expenses) > 0:
        average = sum(expenses) / len(expenses)
    return {"지출 합계": sum(expenses), "지출 건수": len(expenses), "지출 평균": average, "분류별 지출": by_category}


def show(title, items):
    print(f"== {title} ({len(items)}건)")
    for item in items:
        print(f'  {item["id"]} | {item["type"]} | {item["category"]} | {item["amount"]}')


show("검색: category가 식비", search(transactions, "category", "식비"))
show("검색: type이 수입", search(transactions, "type", "수입"))
show("검색: amount가 5000 이상", search_amount_at_least(transactions, 5000))
print("[요약]", summarize(transactions))
show("검색·요약 뒤 원본", transactions)
```

<!-- run: python search_summary.py | exit=0 -->
```text
$ python search_summary.py
== 검색: category가 식비 (2건)
  2 | 지출 | 식비 | 8000
  4 | 지출 | 식비 | 5000
== 검색: type이 수입 (1건)
  1 | 수입 | 용돈 | 30000
== 검색: amount가 5000 이상 (3건)
  1 | 수입 | 용돈 | 30000
  2 | 지출 | 식비 | 8000
  4 | 지출 | 식비 | 5000
[요약] {'지출 합계': 15000, '지출 건수': 3, '지출 평균': 5000.0, '분류별 지출': {'식비': 13000, '교통': 2000}}
== 검색·요약 뒤 원본 (4건)
  1 | 수입 | 용돈 | 30000
  2 | 지출 | 식비 | 8000
  3 | 지출 | 교통 | 2000
  4 | 지출 | 식비 | 5000
```

- `search()`는 `item[key] == value`로 **완전히 같은 값**만 고릅니다(예: "식"으로는 "식비"를 찾지 못함). 부분 일치·대소문자 무시는 프로그램이 따로 정하는 규칙입니다. `[단순화]`
- 조건을 바꾸면(`category가 식비` → `type이 수입` → `amount가 5000 이상`) 같은 원본에서 결과 목록이 달라집니다. 결과는 `found`라는 **새 리스트**에 `append()`하므로 원본에는 손대지 않습니다.
- `sum(리스트)`는 합계, `len(리스트)`는 개수입니다. 평균은 `sum() / len()`인데, **지출이 하나도 없으면 0으로 나누게 되므로** `if len(expenses) > 0:`으로 먼저 확인합니다. `/` 나누기의 결과는 항상 소수(float)라 `5000.0`으로 나옵니다. `[확정 사실]`
- 분류별 합계는 딕셔너리로 셉니다. `by_category.get(분류, 0)`은 그 분류가 아직 없으면 `0`을 돌려주므로, 처음 나온 분류도 오류 없이 더할 수 있습니다. 딕셔너리는 **넣은 순서**를 기억하므로 `식비`가 `교통`보다 먼저 나옵니다. `[확정 사실]`

### 6. 책임을 나눈 프로그램에 놓아 보기 — CLI·서비스·저장소·모델 `[설계 예시]`

**CLI·서비스·저장소·모델은 Python이 강제하는 구조가 아니라, 여러 설계 방법 가운데 하나입니다**(Scene 03-A). 같은 CRUD·검색·요약을 이 네 책임으로 나눠 담으면 아래와 같습니다. 예시는 Scene 03-B 학습용 가상 패키지 `cashbook`이며, 저장소는 **메모리 안의 리스트**를 씁니다. `[학습용 예제]`

| 책임 영역 | 이 장면에서 맡는 일 | `cashbook` |
| --- | --- | --- |
| **CLI** | 사용자의 명령을 받아들이고(argparse) 결과·오류를 **출력**한다 | `build_parser()`, `format_row()`, `main()` |
| **서비스** | **처리 규칙**을 정한다 — 금액 검사, 없는 ID 판단, 검색 조건, 요약 계산 | `TransactionService` |
| **저장소** | 데이터를 **읽거나 바꾼다** — 추가, 전체·ID 조회, 금액 변경, 삭제 | `TransactionRepository` |
| **모델** | 데이터의 **구조와 의미**를 표현한다 — 거래 한 건 = id·type·category·amount | `Transaction` |

<!-- demo:cashbook/models.py -->
```python
"""모델: 거래 한 건의 구조와 의미."""


class Transaction:
    def __init__(self, tx_id, tx_type, category, amount):
        self.id = tx_id
        self.type = tx_type
        self.category = category
        self.amount = amount
```

<!-- demo:cashbook/repository.py -->
```python
"""저장소: 데이터 읽기·바꾸기. 이 장면에서는 메모리 목록을 쓴다(파일 저장은 Scene 04)."""
from cashbook.models import Transaction


class TransactionRepository:
    def __init__(self):
        self._items = [
            Transaction(1, "수입", "용돈", 30000),
            Transaction(2, "지출", "식비", 8000),
            Transaction(3, "지출", "교통", 2000),
            Transaction(4, "지출", "식비", 5000),
        ]

    def add(self, tx_type, category, amount):
        biggest = 0
        for tx in self._items:
            if tx.id > biggest:
                biggest = tx.id
        tx = Transaction(biggest + 1, tx_type, category, amount)
        self._items.append(tx)
        return tx

    def all(self):
        return list(self._items)

    def get(self, tx_id):
        for tx in self._items:
            if tx.id == tx_id:
                return tx
        return None

    def update_amount(self, tx_id, amount):
        tx = self.get(tx_id)
        if tx is not None:
            tx.amount = amount
        return tx

    def delete(self, tx_id):
        tx = self.get(tx_id)
        if tx is not None:
            self._items.remove(tx)
        return tx
```

<!-- demo:cashbook/services.py -->
```python
"""서비스: 기능 수행과 처리 규칙(금액 검사, 없는 ID 판단, 검색 조건, 요약 계산)."""


class TransactionService:
    def __init__(self, repository):
        self.repository = repository

    def add(self, tx_type, category, amount):
        if amount < 1:
            raise ValueError("금액은 1 이상이어야 합니다")
        return self.repository.add(tx_type, category, amount)

    def list_all(self):
        return self.repository.all()

    def change_amount(self, tx_id, amount):
        if amount < 1:
            raise ValueError("금액은 1 이상이어야 합니다")
        tx = self.repository.update_amount(tx_id, amount)
        if tx is None:
            raise LookupError(f"id {tx_id} 거래가 없습니다")
        return tx

    def remove(self, tx_id):
        tx = self.repository.delete(tx_id)
        if tx is None:
            raise LookupError(f"id {tx_id} 거래가 없습니다")
        return tx

    def search(self, category=None, tx_type=None):
        found = []
        for tx in self.repository.all():
            if category is not None and tx.category != category:
                continue
            if tx_type is not None and tx.type != tx_type:
                continue
            found.append(tx)
        return found

    def summary(self):
        income = 0
        expense = 0
        by_category = {}
        for tx in self.repository.all():
            if tx.type == "수입":
                income += tx.amount
            else:
                expense += tx.amount
                by_category[tx.category] = by_category.get(tx.category, 0) + tx.amount
        return {"수입 합계": income, "지출 합계": expense, "잔액": income - expense, "분류별 지출": by_category}
```

<!-- demo:cashbook/cli.py -->
```python
"""CLI: 사용자 명령 해석, 결과와 오류 표시."""
import argparse

from cashbook.repository import TransactionRepository
from cashbook.services import TransactionService


def build_parser():
    parser = argparse.ArgumentParser(prog="cashbook", description="학습용 거래 목록(메모리)")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("list", help="전체 거래 보기")
    p_add = sub.add_parser("add", help="거래 추가")
    p_add.add_argument("--type", required=True, choices=["수입", "지출"])
    p_add.add_argument("--category", required=True)
    p_add.add_argument("--amount", type=int, required=True)
    p_update = sub.add_parser("update", help="금액 수정")
    p_update.add_argument("--id", type=int, required=True)
    p_update.add_argument("--amount", type=int, required=True)
    p_delete = sub.add_parser("delete", help="거래 삭제")
    p_delete.add_argument("--id", type=int, required=True)
    p_search = sub.add_parser("search", help="조건으로 찾기")
    p_search.add_argument("--category")
    p_search.add_argument("--type", choices=["수입", "지출"])
    sub.add_parser("summary", help="합계 보기")
    return parser


def format_row(tx):
    return f"{tx.id} | {tx.type} | {tx.category} | {tx.amount}"


def main(argv=None):
    args = build_parser().parse_args(argv)
    service = TransactionService(TransactionRepository())
    try:
        if args.command == "list":
            for tx in service.list_all():
                print(format_row(tx))
        elif args.command == "add":
            print("[추가 완료]", format_row(service.add(args.type, args.category, args.amount)))
        elif args.command == "update":
            print("[수정 완료]", format_row(service.change_amount(args.id, args.amount)))
        elif args.command == "delete":
            print("[삭제 완료]", format_row(service.remove(args.id)))
        elif args.command == "search":
            for tx in service.search(args.category, args.type):
                print(format_row(tx))
        elif args.command == "summary":
            for name, value in service.summary().items():
                print(f"{name}: {value}")
    except (ValueError, LookupError) as error:
        print("[오류]", error)
        return 1
    return 0
```

<!-- demo:cashbook/__main__.py -->
```python
import sys

from cashbook.cli import main

sys.exit(main())
```

<!-- demo:cashbook/__init__.py -->
```python
"""거래 목록 가상 패키지 (Scene 03-B 학습용 변형: 책임별 모듈, 메모리 저장소)."""
```

실습 폴더(`cashbook` 폴더가 들어 있는 폴더)에서 실행합니다.

<!-- run: python -m cashbook list | exit=0 -->
```text
$ python -m cashbook list
1 | 수입 | 용돈 | 30000
2 | 지출 | 식비 | 8000
3 | 지출 | 교통 | 2000
4 | 지출 | 식비 | 5000
```

<!-- run: python -m cashbook update --id 2 --amount 7000 | exit=0 -->
```text
$ python -m cashbook update --id 2 --amount 7000
[수정 완료] 2 | 지출 | 식비 | 7000
```

<!-- run: python -m cashbook delete --id 3 | exit=0 -->
```text
$ python -m cashbook delete --id 3
[삭제 완료] 3 | 지출 | 교통 | 2000
```

<!-- run: python -m cashbook search --category 식비 | exit=0 -->
```text
$ python -m cashbook search --category 식비
2 | 지출 | 식비 | 8000
4 | 지출 | 식비 | 5000
```

<!-- run: python -m cashbook summary | exit=0 -->
```text
$ python -m cashbook summary
수입 합계: 30000
지출 합계: 15000
잔액: 15000
분류별 지출: {'식비': 13000, '교통': 2000}
```

`crud_basics.py`(함수 + 딕셔너리, 파일 하나)와 `cashbook`(클래스 + 책임별 모듈)은 **같은 원리**를 다른 모양으로 담았습니다. 둘 다 "id로 찾는다 → 찾았을 때만 바꾼다 → 결과를 돌려준다 → 출력은 따로 한다"입니다.

### 7. 한 기능의 실제 호출 흐름 — 수정(Update) 한 번 (그림 B)

`python -m cashbook update --id 2 --amount 7000`을 실행하고 호출을 추적한 결과입니다. `[확정 사실]`

| 번호 | 호출 | 부른 곳 | 책임 영역 | 하는 일 |
| --- | --- | --- | --- | --- |
| ① | `main()` | `__main__.py` | CLI | 끝까지 실행되며 다른 함수를 부르고 결과를 출력 |
| ② | `build_parser()` | `main()` | CLI | 명령 규칙 만들기 |
| ③ | `TransactionRepository()` | `main()` | 저장소 | 저장소 객체 만들기(처음 4건) |
| ④ | `Transaction(…)` × 4 | `TransactionRepository.__init__()` | 모델 | 거래 객체 4개 |
| ⑤ | `TransactionService(저장소)` | `main()` | 서비스 | 저장소 객체를 받아 두기 |
| ⑥ | `change_amount(2, 7000)` | `main()` | 서비스 | **규칙:** 금액이 1 이상인가 |
| ⑦ | `update_amount(2, 7000)` | `change_amount()` | 저장소 | id로 찾아 **값을 바꿈** |
| ⑧ | `get(2)` | `update_amount()` | 저장소 | id가 2인 거래 찾기 |
| ⑨ | `format_row(tx)` | `main()` | CLI | 결과를 한 줄 글자로 |

결과는 거꾸로 돌아옵니다. `get()`이 찾은 거래(`tx`)를 `update_amount()`에 **return**하고, `update_amount()`가 `tx.amount = 7000`으로 바꾼 뒤 `change_amount()`에, `change_amount()`가 `main()`에 return합니다. 그러면 `main()`이 `format_row()`로 만든 글자를 `print()`합니다.

**이 기능에서 누가 무엇을 했나**

| 역할 | 어디서 | 코드 |
| --- | --- | --- |
| 규칙 판단 | 서비스 `change_amount()` | `if amount < 1: raise ValueError(…)`, `if tx is None: raise LookupError(…)` |
| **데이터 변경** | 저장소 `update_amount()` | `tx.amount = amount` — **메모리 속 값만** 바뀜 |
| 출력 | CLI `main()`·`format_row()` | `print("[수정 완료]", format_row(…))` |
| 데이터의 모양 | 모델 `Transaction` | 이 기능에서는 새로 호출되지 않음(처음 4건을 만들 때만 ④) |

**실패하는 경우 — 모든 기능이 네 곳을 다 거치지는 않는다**

<!-- run: python -m cashbook update --id 9 --amount 7000 | exit=1 -->
```text
$ python -m cashbook update --id 9 --amount 7000
[오류] id 9 거래가 없습니다
```

<!-- run: python -m cashbook update --id 2 --amount 0 | exit=1 -->
```text
$ python -m cashbook update --id 2 --amount 0
[오류] 금액은 1 이상이어야 합니다
```

- 없는 id 9: 저장소의 `get(9)`이 `None`을 돌려주고 → 서비스가 "없는 id"라고 판단해 `LookupError`를 내고 → CLI가 잡아 `[오류]`를 출력하고 종료 코드 1로 끝납니다. **없음을 알려 주는 곳(저장소), 오류로 판단하는 곳(서비스), 보여 주는 곳(CLI)**이 나뉘어 있습니다.
- 금액 0: 서비스가 **바로** `ValueError`를 내므로 **저장소는 호출되지 않습니다**(호출 추적으로 확인).
- `--type 기타`처럼 정해진 선택지 밖의 값은 서비스까지 오지 않고 **argparse가 형식 오류**로 막습니다(`choices`, 종료 코드 2). 형식 해석(argparse)과 처리 규칙(서비스)은 층위가 다릅니다(Scene 01·07).

**기능별 책임 — 순서가 아니라 책임** (그림 B-3, 번호 없음)

| 기능 | CLI | 서비스 | 저장소 |
| --- | --- | --- | --- |
| 추가 `add` | `--type --category --amount` 해석, 결과 표시 | `add()`: 금액 ≥ 1 검사 | `add()`: 다음 id를 정해 목록 끝에 추가 |
| 전체 조회 `list` | 한 줄씩 표시 | `list_all()`: **규칙 없음, 그대로 넘김** | `all()`: 목록을 새 리스트로 |
| 수정 `update` | `--id --amount` 해석, 결과·오류 표시 | `change_amount()`: 금액 검사, 없는 id면 오류 | `update_amount()`: id로 찾아 금액 변경 |
| 삭제 `delete` | `--id` 해석, 결과·오류 표시 | `remove()`: 없는 id면 오류 | `delete()`: id로 찾아 제거 |
| 검색 `search` | 조건 옵션 해석, 결과 표시 | `search()`: 조건 판단 | `all()`: 전체 목록 제공 |
| 요약 `summary` | 이름: 값 표시 | `summary()`: 합계·잔액·분류별 계산 | `all()`: 전체 목록 제공 |

- 전체 조회처럼 서비스가 규칙 없이 넘기기만 하는 기능도 있습니다. 이런 경우 서비스를 거치지 않게 설계하는 프로젝트도 있습니다. **모든 CRUD가 모든 계층을 반드시 거쳐야 하는 것은 아닙니다.**
- 검색·요약에서 저장소는 **전체 목록을 주기만** 하고, 조건 판단과 계산은 서비스가 합니다. 반대로 저장소가 검색 조건까지 맡게 설계할 수도 있습니다. 어디에 둘지는 설계 선택입니다. `[설계 예시]`

### 8. 메모리 속 변경 ≠ 파일 저장 — 다음 장면으로

<!-- run: python -m cashbook add --type 지출 --category 문구 --amount 3000 | exit=0 -->
```text
$ python -m cashbook add --type 지출 --category 문구 --amount 3000
[추가 완료] 5 | 지출 | 문구 | 3000
```

<!-- run: python -m cashbook list | exit=0 -->
```text
$ python -m cashbook list
1 | 수입 | 용돈 | 30000
2 | 지출 | 식비 | 8000
3 | 지출 | 교통 | 2000
4 | 지출 | 식비 | 5000
```

첫 실행에서 추가한 id 5가 두 번째 실행에는 없습니다. `cashbook`의 저장소는 데이터를 **프로그램 메모리 안의 리스트**에만 두기 때문에, 프로그램이 끝나면 바꾼 내용도 함께 사라지고 다음 실행은 다시 처음 4건에서 시작합니다. `[확정 사실]`

> **Scene 04의 질문:** 프로그램을 껐다 켜도 기록이 남으려면 데이터를 **어디에, 어떤 형식으로** 저장해야 할까? 메모리 속 리스트를 바꾸는 것과 파일에 영구 저장하는 것은 무엇이 다를까?

### 9. 실제 미션 구현 사례 — `ledger` `[구현 사례]`

> `m03-pocket-money-ledger` `d14e812`에서 확인한 **한 가지 구현**입니다. 이 구조가 정답이라는 뜻이 아닙니다. 파일 저장(JSONL)과 Generator(`iter_all()`)는 Scene 04·05에서 다룹니다.

| 동작 | `ledger`의 위치 | 이 장면의 원리와 연결 |
| --- | --- | --- |
| 추가 | `cli.cmd_add()`(대화식 입력) → `LedgerService.add_transaction()`(값 검증·분류 등록 확인) → `TransactionRepository.next_id()`·`add()` | 새 id = 가장 큰 id + 1(이 장면 예제와 같은 규칙). `add()`는 같은 id가 이미 있으면 오류 |
| 전체 조회 | `cmd_list()` → `list_transactions(limit)` → `iter_all()` | 최근 `limit`건만 최신순으로(Scene 05의 `deque`) |
| ID로 찾기 | `TransactionRepository.get_by_id()` | 없으면 `None`(이 장면 예제와 같음) |
| 수정 | `cmd_update()`(`--id` 필수, 바꿀 값 1개 이상) → `update_transaction()` → `repository.update()` | 서비스가 `get_by_id()`로 찾고 없으면 오류. 바꾼 값으로 **새 `Transaction` 객체**를 만들어 저장소에 넘김 |
| 삭제 | `cmd_delete()` → `delete_transaction()` → `repository.delete()` | 없는 id의 오류를 **저장소가** 냄(이 장면 예제는 서비스가 판단) |
| 검색 | `cmd_search()` → `search(SearchCriteria)` | 여섯 조건을 모두 만족(AND). 분류·종류·태그는 완전 일치, 메모는 대소문자를 무시한 부분 일치 |
| 요약 | `cmd_summary()` → `monthly_summary(month, top)` | 한 달치만 골라 수입·지출 합계, 잔액, 지출 분류별 합계와 상위 N개, 예산 사용률 |

- **책임의 큰 줄기는 같지만 세부 선택은 다릅니다.** 예를 들어 "없는 id"를 오류로 바꾸는 곳이 수정은 서비스, 삭제는 저장소입니다. 어느 쪽이 맞다는 문제가 아니라, 코드를 읽을 때 **어디에서 판단하는지 직접 확인해야 한다**는 뜻입니다.
- **결정적 차이는 저장 위치입니다.** `ledger`의 저장소는 `transactions.jsonl` 파일을 읽고 쓰므로, 추가·수정·삭제가 프로그램이 끝난 뒤에도 남습니다(수정·삭제 때 파일을 다시 씀 → Scene 04).

### 10. 내 코드에서 찾아보기 (대면 강의 활동)

목적은 코드를 평가하는 것이 아니라 **자기 코드에서 데이터가 바뀌는 곳을 찾아 말하는 방법**을 익히는 것입니다. 같은 함수 이름이나 계층을 쓰라는 뜻이 아닙니다.

1. **거래를 추가하는 함수**를 찾습니다. 새 항목을 어디에 넣는지(`append()`, 파일에 덧붙이기 등), 새 ID를 어떻게 정하는지 적습니다.
2. **목록을 읽는 함수**를 찾습니다. 목록을 돌려주는지, 바로 출력하는지 봅니다.
3. **수정과 삭제를 처리하는 코드**를 찾습니다. 대상을 **ID로 찾는지 위치로 찾는지**, 없는 ID일 때 무엇을 하는지 확인합니다.
4. **검색 조건을 판단하는 부분**을 찾습니다(`if`로 값을 비교하는 줄).
5. **합계를 계산하는 부분**을 찾습니다(`sum()`, `+=`, 분류별 딕셔너리 등).
6. 찾은 코드마다 **실제로 데이터를 바꾸는 코드인지, 값을 계산해 돌려주는 코드인지, 출력만 하는 코드인지** 표로 나눕니다.

| 내 코드에서 찾은 곳(파일·함수·줄) | 동작(C·R·U·D·검색·요약) | 바꿈 / 돌려줌 / 출력 | 근거가 된 코드 한 줄 |
| --- | --- | --- | --- |
| | | | |

| 내 코드의 모습 | 이렇게 읽습니다 |
| --- | --- |
| **파일 하나**에 모든 코드 | 같은 1~6단계를 합니다. `crud_basics.py`처럼 함수 단위로 나눠 표를 채웁니다 |
| **클래스 없이 함수만** | 그대로 됩니다. 함수가 받는 값과 돌려주는 값, 안에서 `append()`·`remove()`·대입이 있는지 봅니다 |
| 한 함수가 입력·변경·출력을 **모두** 함 | 틀린 것이 아닙니다. 한 함수 안에서 줄 단위로 "여기는 바꿈, 여기는 출력"을 표시합니다 |
| 이름이 다름(`manager.py`, `storage.py`, `handlers.py` 등) | 이름보다 **하는 일**로 표의 칸을 채웁니다 |
| 데이터가 이미 **파일**에 저장됨 | 지금은 "어디서 바꾸는가"만 찾습니다. 파일 읽기·쓰기 방식은 Scene 04에서 봅니다 |

**AI에게 물어볼 때 (보조 질문)** — AI의 답은 확인할 단서일 뿐입니다. 답에 나온 줄을 **직접 열어 보고**, 마지막에는 자기 말로 "이 파일의 이 함수가 이 일을 한다"고 말할 수 있어야 합니다.

- "이 함수는 데이터를 바꾸나요, 값을 돌려주기만 하나요, 출력만 하나요? 판단 근거가 된 **줄 번호**를 알려 주세요."
- "이 코드에서 수정·삭제할 대상을 ID로 찾나요, 리스트 위치로 찾나요? 없는 ID를 넣으면 어떻게 되나요?"
- "검색 조건을 판단하는 줄과 합계를 계산하는 줄은 어디인가요?"
- "제 코드에서 `print()`가 있는 함수와 리스트·딕셔너리를 바꾸는 함수를 나눠 목록으로 보여 주세요."

### 11. 한 문장 정리

> CRUD는 데이터를 **추가·조회·수정·삭제**하는 네 동작이고, Python에서는 리스트·딕셔너리와 함수로 직접 만듭니다. 수정·삭제는 **ID로 찾은 뒤** 하며, 검색은 조건에 맞는 항목을 **고르고** 요약은 값을 **계산**하지만 둘 다 원본을 바꾸지 않습니다. 데이터를 바꾸는 코드·계산하는 코드·출력하는 코드를 나눠 보면 어떤 구조의 코드든 읽을 수 있고, **메모리 속 변경은 프로그램이 끝나면 사라집니다.**

---

## 강사용 안내

> 대면 강의는 우리 교육 모델의 **필수 초기 단계**(운영 선택)이며 코디세이 공식 규정이 아닙니다. 시간 배분은 시범 운영 후 확정합니다.

**준비** — `drafts/b2-1-story-map/scene-03b/_tools/demo/`를 실습 폴더로 복사하고 그 안에서 실행합니다. 데모는 표준 라이브러리만 씁니다.

**권장 진행 순서**

1. **질문** — "용돈 기록 앱에서 할 수 있는 일을 말해 보세요." → 답을 추가·보기·고치기·지우기로 묶으며 CRUD 표(1절)를 채웁니다. "Python 문법이 아니라 데이터 처리 개념"을 먼저 말합니다.
2. **준비 문법** — `python data_basics.py`. 딕셔너리(키로 찾기)와 리스트(위치로 찾기)의 차이만 짚습니다. 자료구조 강의로 넓히지 않습니다.
3. **ID** — `python why_id.py`. "`rows[1]`을 지우라고 했다면 무엇이 지워졌을까?"를 묻습니다.
4. **그림 A + 시연 1** — `python crud_basics.py`의 출력과 그림 A 카드를 한 장씩 맞춰 봅니다. 카드마다 "데이터가 바뀌었나?"를 학습자가 먼저 답하게 합니다(R은 그대로).
5. **검색·요약** — `python search_summary.py`. 조건을 바꾸면 결과가 달라지고, 마지막 줄에서 원본이 그대로임을 확인합니다. 시간이 있으면 학습자가 조건(`"type", "지출"`)을 바꿔 직접 실행합니다.
6. **그림 B** — "**문법이 아니라 설계의 한 예**"를 다시 말한 뒤 `python -m cashbook update --id 2 --amount 7000`의 ①~⑨를 따라갑니다. "값이 실제로 바뀐 줄은 어디인가?"(저장소 ⑦의 `tx.amount = amount`), "출력한 곳은?"(CLI)를 묻습니다.
7. **실패 두 경우** — `--id 9`와 `--amount 0`. "저장소까지 갔나?"를 비교합니다.
8. **책임 표** — 전체 조회의 서비스 칸("그대로 넘김")을 짚으며 "모든 기능이 모든 계층에서 일을 하지는 않는다"를 확인합니다.
9. **다음 질문** — `add` 뒤 `list`를 따로 실행해 id 5가 사라지는 것을 보여 주고 Scene 04 질문으로 끝냅니다.
10. **`ledger` 사례** — 질문이 있을 때만. "없는 id를 판단하는 곳이 기능마다 다르다"는 점과 파일 저장의 차이만 짚습니다.
11. **내 코드에서 찾아보기** — 동의한 교육생 한 명의 코드로 1~6단계를 함께 한 뒤 각자 진행합니다.

**흔한 오해와 교정**

| 학습자의 말 | 교정 |
| --- | --- |
| "CRUD는 Python 명령어예요" | 데이터 처리 개념입니다. Python에서는 리스트·딕셔너리와 함수로 만듭니다 |
| "조회(Read)도 데이터를 바꿔요" | 조회는 찾아서 돌려줄 뿐입니다. 그림 A의 R 카드는 5건 그대로입니다 |
| "검색 결과를 따로 저장해 둬야 해요" | 같은 원본에 조건을 적용해 그때그때 만듭니다. 원본은 그대로입니다 |
| "검색과 요약은 같은 거예요" | 검색은 항목을 **고르고**, 요약은 값을 **계산**합니다 |
| "리스트 위치로 지우면 돼요" | 위치는 삭제·추가로 바뀝니다. 대상은 ID로 찾습니다(`why_id.py`) |
| "id 3을 지우면 4·5가 3·4로 바뀌어요" | 위치만 당겨지고 ID는 그대로입니다 |
| "수정·삭제는 반드시 CLI → 서비스 → 저장소 → 모델을 다 거쳐요" | 금액 0은 서비스에서 멈추고, 전체 조회의 서비스는 그대로 넘깁니다 |
| "`update` 하면 저장된 거예요" | 이 예제는 메모리 속 값만 바뀝니다. 다음 실행에는 없습니다(8절, Scene 04) |
| "`print()`로 보이면 데이터가 바뀐 거예요" | 출력과 변경은 다른 코드입니다. 바뀐 곳은 `append()`·`remove()`·대입이 있는 줄입니다 |

**수준 조절** — 입문 이전 학습자는 1~5절과 그림 A, 활동 1~3·6단계까지. 여유가 있으면 6~8절과 그림 B로 확장합니다. 복사 규칙(얕은 복사)의 세부, 정렬, 예외 클래스 설계는 다루지 않습니다.

## 이해 확인 질문 (점수화하지 않음)

| # | 질문 | 확인할 내용 |
| --- | --- | --- |
| 1 | CRUD의 네 동작 가운데 데이터가 바뀌지 않는 것은? | Read |
| 2 | 리스트에서 항목을 위치가 아니라 ID로 찾아 수정·삭제하는 이유는? | 삭제·추가로 위치가 바뀜, 같은 내용이 둘일 수 있음 |
| 3 | 검색과 요약은 무엇이 다른가요? 둘 다 원본을 바꾸나요? | 고르기 / 계산하기, 둘 다 원본은 그대로 |
| 4 | `update --id 2 --amount 7000`에서 규칙을 판단한 곳, 값을 바꾼 곳, 출력한 곳은? | 서비스 / 저장소 / CLI |
| 5 | `--amount 0`일 때 저장소는 호출되나요? 왜 그런가요? | 호출되지 않음, 서비스가 먼저 오류를 냄 |
| 6 | `add`로 추가한 거래가 다음 `list` 실행에 없는 이유는? | 메모리 안의 리스트에만 있었음 → Scene 04 |

## 근거와 출처

| 내용 | 분류 | 출처 |
| --- | --- | --- |
| 리스트 `append()`·`remove()`(같은 값의 첫 항목, 없으면 `ValueError`), `del` 문(위치로 삭제) | 확정 사실 | [Tutorial §5.1](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists), [§5.2](https://docs.python.org/3/tutorial/datastructures.html#the-del-statement), [stdtypes `sequence.remove`](https://docs.python.org/3/library/stdtypes.html#sequence.remove) |
| 리스트는 인덱스로 접근하고 내용을 바꿀 수 있음(mutable) | 확정 사실 | [Tutorial §3.1.3 Lists](https://docs.python.org/3/tutorial/introduction.html#lists) |
| `list(iterable)`은 같은 항목·같은 순서의 새 리스트(리스트면 복사) | 확정 사실 | [stdtypes `list`](https://docs.python.org/3/library/stdtypes.html#list) |
| 딕셔너리: 키로 찾기, 키는 겹치지 않음, 같은 키에 대입하면 값이 바뀜, 없는 키는 `KeyError` | 확정 사실 | [Tutorial §5.5](https://docs.python.org/3/tutorial/datastructures.html#dictionaries) |
| `dict.get(key, default)`, 딕셔너리는 넣은 순서를 유지(3.7부터 보장) | 확정 사실 | [stdtypes `dict.get`](https://docs.python.org/3/library/stdtypes.html#dict.get), [Mapping types](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict-frozendict) |
| `/` 나누기는 항상 float | 확정 사실 | [Tutorial §3.1.1 Numbers](https://docs.python.org/3/tutorial/introduction.html#numbers) |
| `len()`, `sum()` | 확정 사실 | [Built-in functions `len`](https://docs.python.org/3/library/functions.html#len), [`sum`](https://docs.python.org/3/library/functions.html#sum) |
| `if`·`for` 문 | 확정 사실 | [Tutorial §4.1](https://docs.python.org/3/tutorial/controlflow.html#if-statements), [§4.2](https://docs.python.org/3/tutorial/controlflow.html#for-statements) |
| 2~8절의 모든 출력·종료 코드, 호출 순서·부른 쪽·return, 실패 경우의 호출 범위, 책임 분리(print·데이터 변경 위치) | 확정 사실(실행 확인) | `_tools/demo/`, Python 3.14.6, Windows, 2026-10-23. `_tools/verify_demo.py`가 원고 코드·출력·그림과 실제 실행·호출 추적·AST를 대조 |
| CRUD는 특정 언어·명령이 아닌 데이터 처리 개념, SQL·웹 요청과의 대응 | 단순화 | 용어사전 [`crud`](../../../content/terms/crud.md)(canonical, 수정하지 않음)와 같은 설명 |
| CLI·서비스·저장소·모델의 책임 구분, 검색 조건을 서비스에 둔 것 | 설계 예시 | Scene 03-A와 같은 계층형 설계의 일반적 설명. Python 문법·표준이 아님 |
| `ledger`의 CRUD·검색·요약 흐름, 없는 id 오류 위치, `next_id()` 규칙, 새 객체로 수정, JSONL 저장 | 구현 사례 | `m03-pocket-money-ledger` `d14e812`: `ledger/cli.py`(`cmd_add`~`cmd_delete`), `ledger/services.py`(`LedgerService`), `ledger/repository.py`(`TransactionRepository`), `ledger/models.py`(`Transaction`·`SearchCriteria`) |
