"""명령줄 입력을 해석해 알맞은 기능을 부르는 모듈."""
print(f"[불러올 때] todo/cli.py — __name__ = {__name__!r}")  # 학습용 출력

import argparse
import todo.actions


def build_parser():
    print("[호출될 때] cli.build_parser()")  # 학습용 출력
    parser = argparse.ArgumentParser(prog="todo", description="할 일 목록")
    sub = parser.add_subparsers(dest="command", required=True)
    p_list = sub.add_parser("list", help="할 일 보기")
    p_list.add_argument("-n", "--limit", type=int, default=10, help="보여 줄 개수")
    return parser


def main():
    print("[호출될 때] cli.main()")  # 학습용 출력
    args = build_parser().parse_args()
    if args.command == "list":
        todo.actions.show_tasks(args.limit)
    return 0


if __name__ == "__main__":
    main()
