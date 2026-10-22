"""비교용 진입 파일: python main.py 로 실행한다 (Scene 02 학습용 변형)."""
print(f"[불러올 때] main.py — __name__ = {__name__!r}")  # 학습용 출력

import sys
from todo.cli import main

if __name__ == "__main__":
    sys.exit(main())
