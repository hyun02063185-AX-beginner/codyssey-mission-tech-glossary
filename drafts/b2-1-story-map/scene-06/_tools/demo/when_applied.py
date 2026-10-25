"""@ 문법과 풀어 쓴 문법, 그리고 Decorator가 적용되는 시점과 wrapper가 호출되는 시점."""


def trace(func):
    print(f"[정의 시점] trace({func.__name__}) 실행 → wrapper를 돌려줌")

    def wrapper():
        print(f"[호출 시점] wrapper 앞 ({func.__name__})")
        func()
        print(f"[호출 시점] wrapper 뒤 ({func.__name__})")
    return wrapper


print("--- @trace로 정의")


@trace
def greet():
    print("  [greet 본문] 안녕하세요")


print("--- 풀어 쓴 문법으로 정의")


def hello():
    print("  [hello 본문] 반갑습니다")


hello = trace(hello)

print("--- 아직 아무 함수도 호출하지 않음. 이제 greet()를 두 번 호출")
greet()
greet()
print("--- hello() 호출")
hello()
