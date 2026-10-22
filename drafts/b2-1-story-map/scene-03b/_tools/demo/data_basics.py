"""Scene 03-B 준비: 변수와 값, 딕셔너리와 리스트, 반복과 조건."""

amount = 8000
item = {"id": 2, "type": "지출", "category": "식비", "amount": amount}
print("키로 꺼내기:", item["category"], item["amount"])
item["amount"] = 7000
print("키로 바꾸기:", item)

names = ["용돈", "식비", "교통"]
names.append("문구")
print("위치로 꺼내기:", names[0], names[-1], "개수", len(names))
names[1] = "점심"
del names[2]
print("바꾸고 지운 뒤:", names)

for name in names:
    if name != "용돈":
        print("반복 + 조건:", name)
