# CSV

## 한 줄 설명

쉼표 등 delimiter로 column을 구분하는 평면 text data 형식.

## 쉽게 설명하면

`CSV`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.

## 정확한 설명

쉼표 등 delimiter로 column을 구분하는 평면 text data 형식. 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M03에서 가계부 기록을 저장하고, 표 계산 프로그램으로 내보내고 다시 들여올 때 쓰는 형식입니다. 쉼표로 칸을 나눈 글자 파일이라 사람이 열어 볼 수 있다는 점이 이 형식을 고르는 이유입니다.

## 코드 예

```python
import csv
with open("ledger.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["date", "category", "amount"])
    writer.writeheader()
    writer.writerows(rows)
```

## 주의할 점 / 경계 조건

한 query가 성공했다고 data model 전체가 안전한 것은 아닙니다. NULL, 중복, foreign key, 동시 변경, transaction 범위를 함께 확인해야 합니다.

## 관련 용어

- `sql`
- `table`

## 흔한 오해

ORM이나 database 기능이 application의 모든 validation과 business rule을 자동으로 대신하지는 않습니다.

## 동료평가 질문

이 구조에서 중복·삭제·실패가 일어날 때 어떤 제약과 transaction 경계가 필요한가요?
