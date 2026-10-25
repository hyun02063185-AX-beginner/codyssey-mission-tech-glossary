"""로그 Decorator: 호출 전후를 기록한다. 예외는 기록만 하고 다시 던진다(처리하지 않음)."""
from functools import wraps

transactions = []


def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[로그] {func.__name__} 시작")
        try:
            result = func(*args, **kwargs)
        except Exception as error:
            print(f"[로그] {func.__name__} 예외 {type(error).__name__}: {error}")
            raise
        print(f"[로그] {func.__name__} 끝")
        return result
    return wrapper


@log_calls
def add_transaction(category, amount):
    if amount < 1:
        raise ValueError("금액은 1 이상이어야 합니다")
    item = {"category": category, "amount": amount}
    transactions.append(item)
    return item


@log_calls
def list_transactions():
    return list(transactions)


print("결과:", add_transaction("식비", 8000))
print("결과:", list_transactions())
try:
    add_transaction("식비", 0)
except ValueError as error:
    print("호출한 쪽이 받은 예외:", error)
