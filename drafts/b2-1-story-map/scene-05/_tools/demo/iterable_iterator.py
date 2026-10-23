"""Iterable과 Iterator: iter()로 Iterator를 얻고, next()로 하나씩 꺼낸다."""
numbers = [10, 20, 30]

for n in numbers:
    print("for:", n)

try:
    next(numbers)
except TypeError as error:
    print("next(numbers) →", type(error).__name__, "-", error)

it = iter(numbers)
print("iter(numbers)의 종류:", type(it).__name__)
print("next(it) →", next(it))
print("next(it) →", next(it))
print("next(it) →", next(it))
try:
    next(it)
except StopIteration:
    print("next(it) → StopIteration (더 꺼낼 값이 없음)")
print("iter(it) is it →", iter(it) is it)
print("리스트는 그대로:", numbers)

it = iter(numbers)
while True:
    try:
        n = next(it)
    except StopIteration:
        break
    print("풀어 쓴 for:", n)
