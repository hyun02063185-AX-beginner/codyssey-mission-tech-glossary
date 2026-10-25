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
