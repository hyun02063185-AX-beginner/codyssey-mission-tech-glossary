# backup

## 한 줄 설명

장애·삭제·손상 뒤 복구할 수 있도록 데이터 사본을 보존하는 작업.

## 쉽게 설명하면

원본이 망가져도 되돌릴 수 있게 따로 보관하는 안전망이다.

## 정확한 설명

backup은 시점·보존 기간·암호화·복구 절차를 포함한다. restore 테스트로 실제 복구 가능성을 확인해야 한다.

## 언제 쓰나

거래 DB의 암호화된 일일 snapshot을 별도 저장소에 둔다.

## 기억할 경계

복사본이 있다는 사실만으로 복구 시간이 요구사항을 만족하는 것은 아니다.

## 이 미션에서는 왜 필요한가

이 회차의 보너스 항목입니다. 파일을 덮어쓰다가 프로그램이 중간에 죽으면 기록이 통째로 날아갈 수 있는데, 사본을 남기는 것만으로는 부족하고 그 사본으로 실제로 복구되는지 한 번은 해 봐야 의미가 있습니다.

## 코드 예

```python
import shutil, tempfile, os
from datetime import datetime

def save_safely(path, rows):
    if os.path.exists(path):        # 덮어쓰기 전에 사본
        shutil.copy2(path, f'{path}.{datetime.now():%Y%m%d-%H%M%S}.bak')

    # 임시 파일에 다 쓴 뒤 한 번에 바꾼다 — 중간에 죽어도 원본이 남는다
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(path) or '.')
    with os.fdopen(fd, 'w', encoding='utf-8') as f:
        write_rows(f, rows)
    os.replace(tmp, path)

# 사본을 만드는 것과 그것으로 복구되는 것은 다른 일이다. 한 번 해 본다
```

## 관련 용어

- `transaction-data`
- `troubleshooting`
