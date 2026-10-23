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
