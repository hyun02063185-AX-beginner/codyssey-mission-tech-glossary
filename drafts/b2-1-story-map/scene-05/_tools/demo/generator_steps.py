"""Generator: 호출하면 Generator 객체만 생기고, next()마다 yield까지 실행한 뒤 멈춘다."""


def count_up(limit):
    print("  [본문] 실행 시작")
    n = 1
    while n <= limit:
        print(f"  [본문] n = {n} · yield 직전")
        yield n
        print(f"  [본문] n = {n} · yield 다음 줄에서 재개")
        n = n + 1
    print("  [본문] while이 끝남 → 함수 끝")


gen = count_up(3)
print("count_up(3) 호출 직후:", type(gen).__name__, "(본문은 아직 실행되지 않음)")

for k in range(1, 5):
    print(f"--- next() {k}번째")
    try:
        value = next(gen)
        print("밖에서 받은 값:", value)
    except StopIteration:
        print("StopIteration → 더 꺼낼 값이 없음")
