"""함수도 값이다: 함수 객체(greet)와 함수 호출 결과(greet())는 다르다."""


def greet():
    return "안녕하세요"


def run(func):
    print("run이 받은 값의 종류:", type(func).__name__)
    return func()


print("greet의 종류:", type(greet).__name__)
print("greet()의 결과:", greet())

saved = greet
print("saved is greet:", saved is greet)
print("saved()의 결과:", saved())

print("run(greet)의 결과:", run(greet))

try:
    run(greet())
except TypeError as error:
    print("run(greet())은 오류:", error)
