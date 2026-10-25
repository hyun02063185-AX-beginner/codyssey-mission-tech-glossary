"""검증 코드가 있는 set_amount: 규칙에 맞지 않는 값을 실제로 거부한다."""


def set_amount(amount: int) -> int:
    if not isinstance(amount, int) or isinstance(amount, bool):
        raise ValueError("금액은 정수여야 합니다")
    if amount <= 0:
        raise ValueError("금액은 0보다 커야 합니다")
    return amount


for value in [1000, "1000", -5, True, 3.5, None]:
    try:
        print(f"set_amount({value!r}) → {set_amount(value)!r}")
    except ValueError as error:
        print(f"set_amount({value!r}) → 거부: {error}")

# bool 확인을 따로 둔 이유: Python에서 bool은 int의 하위 클래스다.
print("issubclass(bool, int):", issubclass(bool, int), "/ isinstance(True, int):", isinstance(True, int))
