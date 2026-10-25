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
