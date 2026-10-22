"""Scene 03-A 문법 예제: 함수 정의와 호출, 클래스 정의와 객체 생성."""


def add_tax(price, rate=0.1):
    return round(price * (1 + rate))


total = add_tax(1000)
print("함수 호출 결과:", total)


class Task:
    def __init__(self, title):
        self.title = title
        self.done = False

    def complete(self):
        self.done = True

    def label(self):
        mark = "x" if self.done else " "
        return f"[{mark}] {self.title}"


a = Task("장보기")
b = Task("운동")
a.complete()
print(a.label())
print(b.label())
print(Task.label(b))
