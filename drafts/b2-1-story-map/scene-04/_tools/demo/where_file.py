"""상대 경로는 '현재 작업 디렉터리'를 기준으로 찾는다(이 .py 파일이 있는 폴더 기준이 아니다)."""
from pathlib import Path

relative = Path("data") / "transactions.jsonl"
here = Path(__file__).resolve().parent

print("상대 경로:", relative.as_posix())
print("현재 작업 디렉터리 = 이 .py 파일의 폴더?", Path.cwd() == here)
print("상대 경로가 가리키는 곳 = 이 .py 파일 옆의 data 폴더?", relative.resolve() == here / relative)
