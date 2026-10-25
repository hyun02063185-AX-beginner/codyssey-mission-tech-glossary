"""저장소: 데이터 읽기·쓰기. 이 장면에서는 메모리 목록을 쓴다(파일 저장은 Scene 04)."""
from todo.models import Task


class TaskRepository:
    def __init__(self):
        self._tasks = [Task("장보기"), Task("과제 제출", done=True), Task("운동")]

    def all(self):
        return list(self._tasks)
