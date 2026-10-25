"""Type Hint는 실행 중 값을 막지 않는다: int라고 적은 Parameter에 문자열을 넘겨 본다."""


def echo_amount(amount: int) -> int:
    return amount


print(echo_amount(1000))
print(echo_amount("1000"))

# 화면에는 둘 다 1000으로 보인다. 실제로 무엇이 돌아왔는지 확인한다.
a = echo_amount(1000)
b = echo_amount("1000")
print("돌려받은 값의 타입:", type(a).__name__, "/", type(b).__name__)
print("2배 하면:", a * 2, "/", b * 2)
