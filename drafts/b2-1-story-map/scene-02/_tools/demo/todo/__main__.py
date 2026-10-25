"""python -m todo 로 실행할 때의 실행 진입점."""
print(f"[불러올 때] todo/__main__.py — 실행 진입점, __name__ = {__name__!r}")  # 학습용 출력

import sys
from todo.cli import main

sys.exit(main())
