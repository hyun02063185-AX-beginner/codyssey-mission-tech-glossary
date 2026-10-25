"""서비스: 기능 수행과 업무 규칙."""


class TaskService:
    def __init__(self, repository):
        self.repository = repository

    def list_tasks(self, limit):
        if limit < 1:
            raise ValueError("limit은 1 이상이어야 합니다")
        return self.repository.all()[:limit]
