"""self는 관례적인 이름이다: 다른 이름을 써도 Python은 첫 Parameter에 객체를 넘긴다(권장하지 않음)."""


class Counter:
    def __init__(this):
        this.count = 0

    def up(this):
        this.count += 1


c = Counter()
c.up()
c.up()
print("count:", c.count)
print("c.up이 기억하는 객체가 c인가:", c.up.__self__ is c)
