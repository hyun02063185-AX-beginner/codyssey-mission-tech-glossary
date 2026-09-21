# Function

## 한 줄 설명
Function은 입력을 받아 작업을 수행하고 필요하면 결과를 반환하도록 이름 붙인 재사용 가능한 코드 단위입니다.

## 쉽게 설명하면
정해진 일을 맡은 작은 도구입니다. 재료를 주면 일을 하고 결과를 돌려주며, 여러 곳에서 같은 도구를 호출할 수 있습니다.

## 정확한 설명
Function은 parameter, local scope, return, invocation을 통해 코드를 분리합니다. 호출할 때마다 실행 상태는 Call Stack의 프레임으로 추적될 수 있고, return 값이 없을 수도 있습니다.

## 이 미션에서는 왜 필요한가

예비 M02는 같은 로직이 반복될 때 함수로 떼어 내라고 요구합니다. 숫자 입력을 받아 범위를 검증하는 부분처럼 여러 번 쓰이는 조각을 이름 붙여 두면, 고칠 곳이 한 군데가 됩니다.

## 코드 예

```python
def read_int(prompt, low, high):
    while True:
        try:
            value = int(input(prompt))
        except ValueError:
            print("숫자를 입력하세요"); continue
        if low <= value <= high:
            return value
        print(f"{low}~{high} 사이로 입력하세요")
```

## 주의할 점 / 경계 조건
함수가 이름만 있다고 즉시 실행되지는 않습니다. 호출 시점, side effect, 예외 처리와 비동기 반환 여부를 함께 확인해야 합니다.

## 관련 용어
- `variable`
- `scope`
- `call-stack`
- `recursion`
- `event-handler`

## 흔한 오해
Function은 반드시 값을 반환해야 한다는 생각은 맞지 않습니다.

## 동료평가 질문
한 함수가 화면 갱신과 네트워크 요청을 동시에 담당하면 어떤 분리 기준을 세울 수 있을까요?
