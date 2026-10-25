"""CLI: 사용자 명령 해석, 결과와 오류 표시."""
import argparse

from todo.repository import TaskRepository
from todo.services import TaskService


def build_parser():
    parser = argparse.ArgumentParser(prog="todo", description="할 일 목록")
    sub = parser.add_subparsers(dest="command", required=True)
    p_list = sub.add_parser("list", help="할 일 보기")
    p_list.add_argument("-n", "--limit", type=int, default=10, help="보여 줄 개수")
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    service = TaskService(TaskRepository())
    try:
        tasks = service.list_tasks(args.limit)
    except ValueError as error:
        print("[오류]", error)
        return 1
    for task in tasks:
        mark = "x" if task.done else " "
        print(f"[{mark}] {task.title}")
    return 0
