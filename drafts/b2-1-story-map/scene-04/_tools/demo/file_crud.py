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
