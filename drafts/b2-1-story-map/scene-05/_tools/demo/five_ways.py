"""같은 JSONL 파일을 다섯 가지 방식으로 소비한다. 방식마다 독립 함수로 실행하고, 꺼낸 줄 수와 결과로 남긴 거래 수를 센다."""
import json
from collections import deque

PATH = "transactions.jsonl"


def read_transactions(path, taken):
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            taken["줄"] = taken["줄"] + 1  # 관찰용: Generator가 파일에서 꺼낸 줄 수
            yield json.loads(line)


def ids(rows):
    result = []
    for row in rows:
        result.append(row["id"])
    return result


def way1_read_all(path):
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    rows = []
    for line in lines:
        rows.append(json.loads(line))
    return len(lines), rows


def way2_each_line(path):
    count = 0
    total = 0
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            count = count + 1
            total = total + json.loads(line)["amount"]
    return count, [], total


def way3_next_once(path):
    taken = {"줄": 0}
    gen = read_transactions(path, taken)
    first = next(gen)
    gen.close()
    return taken["줄"], [first]


def way4_list_generator(path):
    taken = {"줄": 0}
    rows = list(read_transactions(path, taken))
    return taken["줄"], rows


def way5_deque(path, limit):
    taken = {"줄": 0}
    recent = deque(maxlen=limit)
    for row in read_transactions(path, taken):
        recent.append(row)
    return taken["줄"], recent


def report(label, read, kept, total=None):
    """kept = 그 방식이 끝난 뒤 결과로 남긴(돌려준) 거래. 다른 방식의 결과는 이미 남아 있지 않다."""
    if total is None:
        print(f"{label}: 꺼낸 줄 {read} · 남긴 거래 {len(kept)} · id {ids(kept)}")
    else:
        print(f"{label}: 꺼낸 줄 {read} · 남긴 거래 {len(kept)} · 합계 {total}")


report("방식 1 · 전부 읽어 리스트에", *way1_read_all(PATH))
report("방식 2 · 한 줄씩 바로 처리", *way2_each_line(PATH))
report("방식 3 · Generator 일부만 next()", *way3_next_once(PATH))
report("방식 4 · list(Generator)", *way4_list_generator(PATH))
report("방식 5 · deque(maxlen=2)", *way5_deque(PATH, 2))
