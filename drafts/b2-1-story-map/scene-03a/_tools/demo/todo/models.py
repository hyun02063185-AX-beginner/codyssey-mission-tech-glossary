"""모델: 프로그램이 다루는 데이터의 구조와 의미."""


class Task:
    def __init__(self, title, done=False):
        self.title = title
        self.done = done
