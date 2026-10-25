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
