"""wrapper가 받은 인자를 *args·**kwargs로 원래 함수에 넘기고, 원래 함수의 결과를 return으로 돌려준다."""


def trace(func):
    def wrapper(*args, **kwargs):
        print(f"[wrapper] 위치 인자 args = {args} · 키워드 인자 kwargs = {kwargs}")
        result = func(*args, **kwargs)
        print(f"[wrapper] 원래 함수가 돌려준 값 {result} → 그대로 return")
        return result
    return wrapper


def forget_return(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
    return wrapper


def no_arguments(func):
    def wrapper():
        return func()
    return wrapper


def add_tax(price, rate=0.1):
    return round(price * (1 + rate))


traced = trace(add_tax)
print("결과:", traced(1000))
print("결과:", traced(1000, rate=0.2))

print("return을 빠뜨린 wrapper:", forget_return(add_tax)(1000))

try:
    no_arguments(add_tax)(1000)
except TypeError as error:
    print("인자를 받지 않는 wrapper:", error)
