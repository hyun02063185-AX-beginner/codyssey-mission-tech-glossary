"""명령줄 → argparse type=int 변환 → 서비스 함수(limit: int 표시) → 범위 검증. 세 단계의 책임이 다르다."""
import argparse
import sys

TRANSACTIONS = [f"거래 {n}" for n in range(1, 13)]  # 학습용 거래 12건


def list_transactions(limit: int) -> list[str]:
    """서비스 역할: limit가 양수인지 검사하고, 마지막 limit건을 돌려준다."""
    if limit <= 0:
        raise ValueError(f"limit는 양수여야 합니다 (받은 값: {limit})")
    return TRANSACTIONS[-limit:]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()  # 정수로 바꿀 수 없으면 여기서 사용법·오류를 출력하고 종료 코드 2로 끝난다
    print(f"[CLI] args.limit = {args.limit!r} ({type(args.limit).__name__})")
    try:
        items = list_transactions(args.limit)
    except ValueError as error:
        print(f"[오류] {error}", file=sys.stderr)
        return 1
    print(f"[목록] {len(items)}건: {items[0]} … {items[-1]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
