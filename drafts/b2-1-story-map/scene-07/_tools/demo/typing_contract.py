"""list[str], int | str, -> None: 기대 형태를 표시할 뿐, 실행 중 자동으로 검사하지 않는다."""


def count_tags(tags: list[str]) -> int:
    return len(tags)


def join_tags(tags: list[str]) -> str:
    return ", ".join(tags)


def to_amount(value: int | str) -> int:
    return int(value)


def show_total(total: int) -> None:
    print(f"  합계: {total}원")


print("count_tags(['식비', '점심']) →", count_tags(["식비", "점심"]))
print("count_tags(['식비', 3]) →", count_tags(["식비", 3]))  # 원소가 str이 아니어도 그대로 실행된다
print("join_tags(['식비', '점심']) →", join_tags(["식비", "점심"]))
try:
    join_tags(["식비", 3])
except TypeError as error:
    print("join_tags(['식비', 3]) → TypeError:", error)  # 힌트가 아니라 join()이 낸 오류
print("to_amount(1000) →", to_amount(1000))
print("to_amount('1000') →", to_amount("1000"))
print("to_amount(3.9) →", to_amount(3.9))  # float도 막지 않는다. int()가 소수점 아래를 버린다
result = show_total(8000)
print("show_total(8000)이 돌려준 값 →", result)
