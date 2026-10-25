"""가장 단순한 Decorator: 함수를 받아, 앞뒤에 공통 작업을 붙인 wrapper 함수를 돌려준다."""


def trace(func):
    def wrapper():
        print("[wrapper] 앞: 호출 시작")
        func()
        print("[wrapper] 뒤: 호출 끝")
    return wrapper


def greet():
    print("  [greet 본문] 안녕하세요")


original = greet
print("감싸기 전 greet의 이름:", greet.__name__)
greet = trace(greet)
print("감싼 뒤 greet의 이름:", greet.__name__)
print("greet is original:", greet is original)
greet()
