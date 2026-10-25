"""type=int가 없으면 args.limit는 문자열이다. limit: int라고 적어도 Python이 바꿔 주지 않는다."""
import argparse


def list_transactions(limit: int) -> list[str]:
    if limit <= 0:
        raise ValueError("limit는 양수여야 합니다")
    return []


parser = argparse.ArgumentParser()
parser.add_argument("--limit")  # type=int 없음
args = parser.parse_args()
print(f"args.limit = {args.limit!r} ({type(args.limit).__name__})")
try:
    list_transactions(args.limit)
except TypeError as error:
    print("TypeError:", error)
