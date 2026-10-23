"""같은 리스트에서 만든 두 Iterator는 진행 위치를 따로 기억한다."""
numbers = [10, 20, 30]
a = iter(numbers)
b = iter(numbers)

print("next(a) →", next(a))
print("next(a) →", next(a))
print("next(b) →", next(b))
print("next(a) →", next(a))
print("next(b) →", next(b))

print("a와 b는 같은 객체?", a is b)
print("a에 남은 값:", list(a))
print("b에 남은 값:", list(b))
print("리스트는 그대로:", numbers)
