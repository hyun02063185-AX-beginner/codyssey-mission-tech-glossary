"""Parameter(받는 자리)와 Argument(넣은 값): 위치 인자는 순서로, 키워드 인자는 이름으로 연결된다."""


def calculate_total(price, quantity):
    print(f"  연결: price={price}, quantity={quantity}")
    return price * quantity


print("위치 인자 calculate_total(1000, 3)")
print("  결과:", calculate_total(1000, 3))

print("키워드 인자 calculate_total(quantity=3, price=1000)")
print("  결과:", calculate_total(quantity=3, price=1000))

print("순서를 바꾼 위치 인자 calculate_total(3, 1000)")
print("  결과:", calculate_total(3, 1000))

try:
    calculate_total(1000)
except TypeError as error:
    print("Argument가 모자라면 → TypeError:", error)


# 기본값을 둔 새 정의(같은 이름에 새 함수가 연결된다)
def calculate_total(price, quantity=1):
    print(f"  연결: price={price}, quantity={quantity}")
    return price * quantity


print("기본값이 있으면 calculate_total(1000)")
print("  결과:", calculate_total(1000))
