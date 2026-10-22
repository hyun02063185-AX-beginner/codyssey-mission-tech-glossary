"""CLI: 사용자 명령 해석, 결과와 오류 표시."""
import argparse

from cashbook.repository import TransactionRepository
from cashbook.services import TransactionService


def build_parser():
    parser = argparse.ArgumentParser(prog="cashbook", description="학습용 거래 목록(메모리)")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("list", help="전체 거래 보기")
    p_add = sub.add_parser("add", help="거래 추가")
    p_add.add_argument("--type", required=True, choices=["수입", "지출"])
    p_add.add_argument("--category", required=True)
    p_add.add_argument("--amount", type=int, required=True)
    p_update = sub.add_parser("update", help="금액 수정")
    p_update.add_argument("--id", type=int, required=True)
    p_update.add_argument("--amount", type=int, required=True)
    p_delete = sub.add_parser("delete", help="거래 삭제")
    p_delete.add_argument("--id", type=int, required=True)
    p_search = sub.add_parser("search", help="조건으로 찾기")
    p_search.add_argument("--category")
    p_search.add_argument("--type", choices=["수입", "지출"])
    sub.add_parser("summary", help="합계 보기")
    return parser


def format_row(tx):
    return f"{tx.id} | {tx.type} | {tx.category} | {tx.amount}"


def main(argv=None):
    args = build_parser().parse_args(argv)
    service = TransactionService(TransactionRepository())
    try:
        if args.command == "list":
            for tx in service.list_all():
                print(format_row(tx))
        elif args.command == "add":
            print("[추가 완료]", format_row(service.add(args.type, args.category, args.amount)))
        elif args.command == "update":
            print("[수정 완료]", format_row(service.change_amount(args.id, args.amount)))
        elif args.command == "delete":
            print("[삭제 완료]", format_row(service.remove(args.id)))
        elif args.command == "search":
            for tx in service.search(args.category, args.type):
                print(format_row(tx))
        elif args.command == "summary":
            for name, value in service.summary().items():
                print(f"{name}: {value}")
    except (ValueError, LookupError) as error:
        print("[오류]", error)
        return 1
    return 0
