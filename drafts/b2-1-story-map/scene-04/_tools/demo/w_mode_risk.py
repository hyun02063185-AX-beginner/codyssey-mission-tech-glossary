"""운영상의 주의: "w"는 여는 순간 내용을 비운다. 새 파일에 다 쓴 뒤 바꾸면 쓰다 실패해도 원본이 남는다."""
import os
from pathlib import Path

ORIGINAL = Path("notes.txt")
TEMP = Path("notes.txt.tmp")


def show(label):
    print(label, repr(ORIGINAL.read_text(encoding="utf-8")))


with open(ORIGINAL, "w", encoding="utf-8") as f:
    f.write("식비 8000\n교통 2000\n")
show("처음 내용:")

try:
    with open(ORIGINAL, "w", encoding="utf-8") as f:
        raise RuntimeError("새 내용을 쓰기 전에 오류가 났다고 가정")
except RuntimeError as error:
    print("① 원본을 바로 \"w\"로 연 뒤 오류:", error)
show("① 남은 원본:")

with open(ORIGINAL, "w", encoding="utf-8") as f:
    f.write("식비 8000\n교통 2000\n")

try:
    with open(TEMP, "w", encoding="utf-8") as f:
        f.write("식비 8000\n")
        raise RuntimeError("임시 파일을 쓰는 도중 오류가 났다고 가정")
    os.replace(TEMP, ORIGINAL)
except RuntimeError as error:
    TEMP.unlink(missing_ok=True)
    print("② 임시 파일에 쓰다가 오류:", error)
show("② 남은 원본:")

with open(TEMP, "w", encoding="utf-8") as f:
    f.write("식비 8000\n교통 2500\n")
os.replace(TEMP, ORIGINAL)
show("③ 다 쓴 뒤 os.replace()로 바꾼 원본:")
print("③ 임시 파일이 남았나?", TEMP.exists())
