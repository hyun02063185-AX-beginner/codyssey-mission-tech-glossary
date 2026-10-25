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
