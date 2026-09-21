# 파일 I/O

## 한 줄 설명

file을 열고 읽고 쓰고 닫는 input/output 작업.

## 쉽게 설명하면

`파일 I/O`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

file을 열고 읽고 쓰고 닫는 input/output 작업. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

예비 M02에서는 상태를 저장하고 불러오는 수단이고, 본과정 M03에서는 프로그램이 끝나도 가계부 기록이 남게 하는 수단입니다. 데이터베이스를 쓰기 전 단계에서 "남긴다"가 실제로 무엇인지 손으로 겪는 자리입니다.

## 코드 예

```python
with open("state.json", "w", encoding="utf-8") as f:
    json.dump(state, f, ensure_ascii=False)
# with 를 쓰면 예외가 나도 닫힌다
```

## 주의할 점 / 경계 조건

한 번의 수치만으로 원인을 단정하지 말고 기간, workload, 다른 resource, log를 함께 확인해야 합니다.

## 관련 용어

- `process`
- `linux`

## 흔한 오해

운영체제 지표가 높다고 해서 항상 application code 하나가 유일한 원인인 것은 아닙니다.

## 동료평가 질문

이 현상을 재현하거나 관찰할 때 어떤 command와 시간 단위의 증거를 남기겠습니까?
