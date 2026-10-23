"""시간 측정 Decorator: 호출 전후의 시각 차이를 출력한다. 실제 숫자는 실행할 때마다 다르다."""
import time
from functools import wraps


def timed(func, clock=time.perf_counter):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = clock()
        result = func(*args, **kwargs)
        elapsed = clock() - start
        print(f"[시간] {func.__name__}: {elapsed:.6f}초")
        return result
    return wrapper


@timed
def total_amount(n):
    total = 0
    for i in range(n):
        total = total + i
    return total


print("결과:", total_amount(100000))

fake_times = iter([10.0, 10.25])


def fake_clock():
    return next(fake_times)


def sample():
    return "끝"


print("가짜 시계로 감싼 결과:", timed(sample, clock=fake_clock)())
