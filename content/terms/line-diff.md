# line diff

## 한 줄 설명

추가·삭제 line으로 표현한 text 차이.

## 쉽게 설명하면

`line diff`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

추가·삭제 line으로 표현한 text 차이. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M10의 보너스 항목인 텍스트 비교에서 씁니다. 두 버전을 줄 단위로 맞춰 보고 어느 줄이 빠지고 어느 줄이 들어왔는지 표시하는 방식이라, 한 줄을 고치면 뺀 줄과 넣은 줄 두 줄로 보이는 이유도 여기서 나옵니다.

## 코드 예

```python
import difflib
for line in difflib.unified_diff(old.splitlines(), new.splitlines(), lineterm=""):
    print(line)      # - 빠진 줄 / + 들어온 줄
```

## 관련 용어

- `git`
- `commit`
