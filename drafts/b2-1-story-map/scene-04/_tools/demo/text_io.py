"""파일 입출력 기본: open()·with·모드("w"·"a"·"r")·encoding·write()·read()."""

with open("memo.txt", "w", encoding="utf-8") as f:
    f.write("용돈 30000\n")
    f.write("식비 8000\n")
print("with 블록이 끝난 뒤 파일이 닫혔나?", f.closed)

with open("memo.txt", "a", encoding="utf-8") as f:
    f.write("교통 2000\n")

with open("memo.txt", "r", encoding="utf-8") as f:
    text = f.read()
print("read()가 돌려준 값의 종류:", type(text).__name__)
print(text, end="")

with open("memo.txt", "w", encoding="utf-8") as f:
    f.write("문구 3000\n")

with open("memo.txt", "r", encoding="utf-8") as f:
    print('다시 "w"로 연 뒤의 내용:', f.read(), end="")

try:
    with open("missing.txt", "r", encoding="utf-8") as f:
        f.read()
except FileNotFoundError:
    print('"r"은 없는 파일을 만들지 않는다: FileNotFoundError')
