"""Scene 03-B 학습용 예제: 같은 원본 목록에서 검색 결과와 요약 결과를 만든다 (원본은 바꾸지 않음)."""

transactions = [
    {"id": 1, "type": "수입", "category": "용돈", "amount": 30000},
    {"id": 2, "type": "지출", "category": "식비", "amount": 8000},
    {"id": 3, "type": "지출", "category": "교통", "amount": 2000},
    {"id": 4, "type": "지출", "category": "식비", "amount": 5000},
]


def search(items, key, value):
    found = []
    for item in items:
        if item[key] == value:
            found.append(item)
    return found


def search_amount_at_least(items, minimum):
    found = []
    for item in items:
        if item["amount"] >= minimum:
            found.append(item)
    return found


def summarize(items):
    expenses = []
    by_category = {}
    for item in items:
        if item["type"] == "지출":
            expenses.append(item["amount"])
            by_category[item["category"]] = by_category.get(item["category"], 0) + item["amount"]
    average = 0
    if len(expenses) > 0:
        average = sum(expenses) / len(expenses)
    return {"지출 합계": sum(expenses), "지출 건수": len(expenses), "지출 평균": average, "분류별 지출": by_category}


def show(title, items):
    print(f"== {title} ({len(items)}건)")
    for item in items:
        print(f'  {item["id"]} | {item["type"]} | {item["category"]} | {item["amount"]}')


show("검색: category가 식비", search(transactions, "category", "식비"))
show("검색: type이 수입", search(transactions, "type", "수입"))
show("검색: amount가 5000 이상", search_amount_at_least(transactions, 5000))
print("[요약]", summarize(transactions))
show("검색·요약 뒤 원본", transactions)
