"""Type Hint가 있어도 없어도 실행 결과는 같다: 두 함수를 같은 Argument로 부른다."""


def calculate_total_no_hint(price, quantity):
    return price * quantity


def calculate_total(price: int, quantity: int) -> int:
    return price * quantity


print("힌트 없음 (1000, 3) →", repr(calculate_total_no_hint(1000, 3)))
print("힌트 있음 (1000, 3) →", repr(calculate_total(1000, 3)))
print('힌트 없음 ("1000", 3) →', repr(calculate_total_no_hint("1000", 3)))
print('힌트 있음 ("1000", 3) →', repr(calculate_total("1000", 3)))

# Python은 힌트를 함수에 보관만 한다(읽는 사람·도구가 쓸 수 있게).
print("보관된 힌트:", calculate_total.__annotations__)
print("힌트 없는 함수:", calculate_total_no_hint.__annotations__)
