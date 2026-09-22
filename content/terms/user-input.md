# 표준 입력

## 한 줄 설명

프로그램이 표준 입력 등으로 외부에서 받는 값.

## 쉽게 설명하면

사용자가 키보드나 파이프로 프로그램에 건네는 데이터다.

## 정확한 설명

입력은 문자열로 들어오는 경우가 많으므로 형식·범위·누락을 검증한 뒤 목적 타입으로 변환한다.

## 언제 쓰나

명령줄에서 정수 N과 목록을 읽어 알고리즘에 전달한다.

## 기억할 경계

입력을 신뢰하면 잘못된 값이나 악의적 데이터가 로직을 깨뜨릴 수 있다.

## 이 미션에서는 왜 필요한가

시뮬레이터의 첫 번째 모드가 사용자에게 값을 직접 받는 방식입니다. 입력은 항상 문자열로 들어오고 빈 줄이나 숫자가 아닌 글자도 들어올 수 있으므로, 받은 값을 바로 쓰지 않고 검사하는 자리가 반드시 필요합니다.

## 코드 예

```python
def read_size(prompt, low=3, high=25):
    while True:
        raw = input(prompt).strip()
        if not raw.isdigit():
            print('숫자만 입력하세요')
            continue
        n = int(raw)
        if not low <= n <= high:
            print(f'{low}~{high} 사이여야 합니다')
            continue
        return n
```

## 관련 용어

- `stdin-stdout`
- `input-validation`
