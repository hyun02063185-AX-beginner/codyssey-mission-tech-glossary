# Thread

## 한 줄 설명
Thread는 process 안에서 실행 흐름을 나타내는 단위로, 같은 process의 자원을 공유할 수 있습니다.

## 쉽게 설명하면
process라는 작업장 안에서 실제 일을 진행하는 작업 흐름입니다. 여러 thread는 작업장의 자원을 함께 쓰므로 협업도 쉽지만 충돌도 조심해야 합니다.

## 정확한 설명
Process는 실행 중인 프로그램과 그 자원을 담는 단위이고, Thread는 그 안에서 실행을 진행하는 흐름입니다. 같은 Process의 Thread들은 메모리 공간과 열린 파일 같은 자원을 공유합니다. 반면 각 Thread는 다음에 실행할 위치와 함수 호출 기록을 담는 스택 등 자신의 실행 상태를 가집니다. 변수의 이름이 같다는 사실만으로 공유되는 것은 아니며, 아래 예제의 전역 counter는 두 Thread가 함께 읽고 씁니다.

경쟁 상태(Race Condition)는 실행 순서에 따라 공유 데이터의 결과가 달라지는 문제입니다. counter 증가를 읽기 → 1 더하기 → 쓰기로 나누면, 두 Thread가 모두 0을 읽고 각각 1을 쓸 수 있습니다. 증가를 두 번 요청했어도 결과는 1이 되어 한 번의 갱신이 유실됩니다. Lock은 한 번에 하나의 Thread만 이 읽기부터 쓰기까지의 임계 구역(Critical Section)에 들어가도록 보호합니다.

첫 실행에서 Barrier는 두 Thread가 같은 0을 읽은 시점을 맞춰 갱신 유실을 재현합니다. Barrier 자체는 대기 시점을 맞추는 동기화 도구이며, 여기서는 counter의 읽기·쓰기를 보호하지 않습니다. 두 번째 실행에서는 Lock을 얻은 Thread가 0을 1로 바꾼 뒤, 다음 Thread가 1을 읽어 2로 바꿉니다. Lock 안에 같은 Barrier 대기를 넣으면 다른 Thread가 Lock을 얻지 못해 진행이 막히므로 넣지 않습니다.

## 이 미션에서는 왜 필요한가
server나 runtime의 동시 작업을 설명할 때 process 경계와 thread 공유 자원을 분리해 볼 수 있습니다.

## 코드 예
```py
import threading

counter = 0
both_read = threading.Barrier(2)
lock = threading.Lock()


def unsafe_increment():
    global counter
    value = counter             # 읽기: 두 Thread 모두 0을 읽는다
    both_read.wait()             # 둘 다 읽은 뒤에야 쓰도록 맞춘다
    counter = value + 1         # 계산과 쓰기: 둘 다 1을 쓴다


def safe_increment():
    global counter
    with lock:                 # 읽기부터 쓰기까지 함께 보호한다
        value = counter
        counter = value + 1


def run_pair(task):
    threads = [threading.Thread(target=task) for _ in range(2)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()          # 두 Thread가 끝날 때까지 기다린다


run_pair(unsafe_increment)
print("without lock:", counter)  # 1
counter = 0
run_pair(safe_increment)
print("with lock:", counter)     # 2
```

## 주의할 점 / 경계 조건
CPython의 GIL은 Python 코드 실행을 제어하는 장치이지, 여러 단계로 된 공유 상태 변경 전체를 안전하게 묶어 주는 Lock이 아닙니다. 이 예제는 GIL 유무나 우연한 실행 순서에 기대지 않고 읽기와 쓰기 사이를 의도적으로 나눕니다. 같은 공유 상태에 접근하는 코드들이 같은 Lock을 사용해야 보호 효과가 있습니다.

Thread가 많다고 자동으로 빨라지는 것은 아닙니다. I/O, CPU core 수, lock 경쟁, scheduling 비용이 결과에 영향을 줍니다.

## 관련 용어
- `process`
- `concurrency`
- `race-condition`
- `mutex`
- `asynchronous-programming`

## 흔한 오해
Thread와 process는 같은 격리 수준의 단위가 아닙니다.

## 동료평가 질문
여러 thread가 하나의 counter를 갱신할 때 어떤 문제가 생길 수 있나요?
