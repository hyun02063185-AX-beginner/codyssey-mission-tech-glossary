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
