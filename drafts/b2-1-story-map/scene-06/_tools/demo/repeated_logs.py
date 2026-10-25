"""같은 로그 코드가 함수마다 반복된다(원래 기능과 부가 기능이 한 함수에 섞여 있음)."""
transactions = []


def add_transaction(category, amount):
    print("[로그] add_transaction 시작")
    item = {"category": category, "amount": amount}
    transactions.append(item)
    print("[로그] add_transaction 끝")
    return item


def list_transactions():
    print("[로그] list_transactions 시작")
    result = list(transactions)
    print("[로그] list_transactions 끝")
    return result


print("결과:", add_transaction("식비", 8000))
print("결과:", list_transactions())
