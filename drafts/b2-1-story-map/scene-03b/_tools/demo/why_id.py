"""위치(인덱스)는 바뀔 수 있지만 ID는 바뀌지 않는다."""

rows = [
    {"id": 1, "category": "용돈"},
    {"id": 2, "category": "식비"},
    {"id": 3, "category": "교통"},
]
print("삭제 전 rows[1]:", rows[1])
del rows[0]
print("삭제 후 rows[1]:", rows[1])

for row in rows:
    if row["id"] == 2:
        print("id가 2인 항목:", row)
