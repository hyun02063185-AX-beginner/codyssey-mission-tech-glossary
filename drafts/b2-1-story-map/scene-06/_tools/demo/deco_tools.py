"""다른 파일이 import하는 모듈. @trace는 이 모듈을 불러오는(import) 순간 적용된다."""


def trace(func):
    print(f"  [deco_tools · 정의 시점] trace({func.__name__}) 적용")

    def wrapper():
        print(f"  [호출 시점] wrapper → {func.__name__}")
        return func()
    return wrapper


@trace
def greet():
    return "안녕하세요"
