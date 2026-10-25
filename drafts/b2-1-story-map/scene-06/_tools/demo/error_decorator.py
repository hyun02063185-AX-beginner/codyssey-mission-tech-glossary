"""예외 처리 Decorator: 정해 둔 예외(AppError)만 잡아 메시지와 None을 돌려주고, 나머지 예외는 그대로 전파한다."""
from functools import wraps


class AppError(Exception):
    """이 예제 프로그램이 미리 예상한 사용자 오류."""


def handle_app_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except AppError as error:
            print(f"[오류] {error}")
            return None
    return wrapper


@handle_app_errors
def find_transaction(items, tx_id):
    for item in items:
        if item["id"] == tx_id:
            return item
    raise AppError(f"id {tx_id} 거래가 없습니다")


@handle_app_errors
def read_amount(item):
    return item["amount"]


items = [{"id": 1, "category": "식비", "amount": 8000}]
print("정상 → 결과:", find_transaction(items, 1))
print("AppError → 결과:", find_transaction(items, 9))
try:
    read_amount({"id": 2})
except KeyError as error:
    print("처리 범위 밖 예외는 전파 →", type(error).__name__, error)
