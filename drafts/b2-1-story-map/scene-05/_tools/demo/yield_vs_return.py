"""return과 yield의 차이, 그리고 Iterable ⊃ Iterator ⊃ Generator의 포함 관계."""
from collections.abc import Iterable, Iterator


def first_with_return(limit):
    n = 1
    while n <= limit:
        return n
        n = n + 1  # return에서 함수가 끝나므로 이 줄은 실행되지 않는다


def numbers_with_yield(limit):
    n = 1
    while n <= limit:
        yield n
        n = n + 1


print("return 함수 호출 →", first_with_return(3))
print("yield 함수 호출 →", type(numbers_with_yield(3)).__name__)
print("yield 함수를 for로 소비 →", list(numbers_with_yield(3)))

for name, value in [("리스트", [10, 20, 30]), ("iter(리스트)", iter([10, 20, 30])), ("Generator", numbers_with_yield(3))]:
    print(f"{name}: Iterable? {isinstance(value, Iterable)} · Iterator? {isinstance(value, Iterator)}")
