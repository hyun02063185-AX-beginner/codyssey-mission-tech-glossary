"""타입 표시만 있는 set_amount: 어떤 값을 넣어도 그대로 돌려준다."""


def set_amount(amount: int) -> int:
    return amount


for value in [1000, "1000", -5, True, 3.5, None]:
    result = set_amount(value)
    print(f"set_amount({value!r}) → {result!r} ({type(result).__name__})")
