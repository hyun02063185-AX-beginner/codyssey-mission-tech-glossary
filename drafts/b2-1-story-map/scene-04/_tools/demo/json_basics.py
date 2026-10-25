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
