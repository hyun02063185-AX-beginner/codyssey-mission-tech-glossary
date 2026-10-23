"""메모리에만 있는 데이터: 실행할 때마다 코드에 적힌 처음 목록에서 다시 시작한다."""
import sys

transactions = [
    {"id": 1, "category": "식비", "amount": 8000},
    {"id": 2, "category": "교통", "amount": 2000},
]

if len(sys.argv) > 1 and sys.argv[1] == "add":
    transactions.append({"id": 3, "category": "문구", "amount": 3000})
    print("메모리 목록에 id 3 추가")

ids = []
for item in transactions:
    ids.append(item["id"])
print(f"메모리의 거래: {len(transactions)}건 · id {ids}")
