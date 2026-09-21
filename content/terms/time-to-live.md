# TTL

## 한 줄 설명

cache나 record가 유효한 것으로 취급되는 제한 시간.

## 쉽게 설명하면

`TTL`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.

## 정확한 설명

cache나 record가 유효한 것으로 취급되는 제한 시간. 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.

## 동작 원리

입력 data와 schema·관계 규칙을 확인한 뒤 query 또는 ORM 작업을 수행하고, 성공하면 commit하며 실패하면 rollback 또는 오류 처리로 일관성을 지킵니다.

## 이 미션에서는 왜 필요한가

본과정 M09에서 저장한 키를 일정 시간 뒤에 스스로 사라지게 하는 기능입니다. 캐시에 둔 값은 언젠가 낡으므로 지울 시점을 미리 정해 두는 것이고, 만료 처리를 직접 구현할 때는 이 값을 무엇으로 관리할지가 설계 문제가 됩니다.

## 코드 예

```python
store[key] = (value, time.time() + ttl_seconds)

def get(key):
    value, expires_at = store[key]
    if time.time() >= expires_at:
        del store[key]
        return None          # 만료된 것은 없는 것과 같다
    return value
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
