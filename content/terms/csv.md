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

- `import-export`
- `serialization`

## 흔한 오해

쉼표로 나눈 글자 파일이라 아무 도구로나 열면 된다고 생각하기 쉽지만, 값 안에 쉼표나 줄바꿈이 들어가면 직접 잘라 읽는 방식은 바로 깨집니다. 표준 라이브러리의 CSV 도구를 쓰는 이유가 여기 있습니다.

## 동료평가 질문

값 안에 쉼표나 줄바꿈이 들어간 기록이 있을 때 저장과 불러오기가 어떻게 동작하는지 보여 줄 수 있나요?
