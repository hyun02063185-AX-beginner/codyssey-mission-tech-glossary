# JSONL

## 한 줄 설명

한 줄에 JSON object 하나씩 기록하는 streaming-friendly 형식.

## 쉽게 설명하면

`JSONL`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.

## 정확한 설명

한 줄에 JSON object 하나씩 기록하는 streaming-friendly 형식. 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M03에서 기록을 파일로 남길 때 고를 수 있는 형식 가운데 하나입니다. 한 줄에 한 건씩 적으므로 뒤에 덧붙이기 쉽고, 파일을 끝까지 읽지 않아도 한 줄씩 처리할 수 있습니다.

## 코드 예

```python
with open("ledger.jsonl", "a", encoding="utf-8") as f:
    f.write(json.dumps(entry, ensure_ascii=False) + "
")   # 덧붙이기

with open("ledger.jsonl", encoding="utf-8") as f:
    for line in f:                                          # 한 줄씩
        entry = json.loads(line)
```

## 주의할 점 / 경계 조건

한 query가 성공했다고 data model 전체가 안전한 것은 아닙니다. NULL, 중복, foreign key, 동시 변경, transaction 범위를 함께 확인해야 합니다.

## 관련 용어

- `json`
- `streaming`

## 흔한 오해

한 줄에 한 건이라 파일 전체가 JSON 이라고 생각하기 쉽지만, 파일 자체는 유효한 JSON 이 아닙니다. 줄 단위로 읽어 각 줄을 따로 해석해야 합니다.

## 동료평가 질문

기록이 수만 건으로 늘었을 때 이 형식을 고른 이유를 메모리 사용과 함께 설명할 수 있나요?
