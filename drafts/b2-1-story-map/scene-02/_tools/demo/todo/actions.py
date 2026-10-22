"""할 일 기능을 모아 둔 모듈."""
print(f"[불러올 때] todo/actions.py — __name__ = {__name__!r}")  # 학습용 출력

TASKS = ["장보기", "과제 제출", "운동", "책 반납", "방 청소", "이메일 답장"]


def show_tasks(limit):
    print(f"[호출될 때] actions.show_tasks({limit})")  # 학습용 출력
    for task in TASKS[:limit]:
        print("-", task)
