"""functools.wraps: 동작은 같고, 원래 함수의 이름·설명·원본 참조가 보존되는지가 다르다."""
from functools import wraps


def plain(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper


def keeps(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper


def add_tax(price, rate=0.1):
    """세금을 더한 금액을 돌려준다."""
    return round(price * (1 + rate))


for label, decorated in (("wraps 없음", plain(add_tax)), ("wraps 있음", keeps(add_tax))):
    print(f"[{label}] 결과 {decorated(1000)}")
    print(f"  __name__ = {decorated.__name__}")
    print(f"  __doc__ = {decorated.__doc__}")
    print(f"  __wrapped__가 있나? {hasattr(decorated, '__wrapped__')}")

print("keeps(add_tax).__wrapped__ is add_tax:", keeps(add_tax).__wrapped__ is add_tax)
