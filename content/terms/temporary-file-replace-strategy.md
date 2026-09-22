# Temporary File / Replace Strategy

## 한 줄 설명

새 내용을 temporary file에 쓴 뒤 rename으로 기존 file을 교체해 부분 쓰기를 피하는 방식.

## 쉽게 설명하면

원본을 바로 고치지 않고 새 파일에 다 쓴 뒤 이름을 바꿔 갈아 끼우는 방식입니다.

## 정확한 설명

같은 저장 공간에 임시 파일을 만들어 전체를 쓴 뒤, 이름 바꾸기로 원본을 대체한다. 이름 바꾸기는 파일 시스템 수준에서 한 번에 이뤄지므로, 중간에 프로그램이 죽어도 읽는 쪽은 이전 내용 아니면 새 내용만 보게 되고 반쯤 쓰인 상태는 보이지 않는다.

## 이 미션에서는 왜 필요한가

본과정 M03에서 파일 기반 수정·삭제를 안전하게 만드는 방법입니다. 원본을 열어 바로 덮어쓰면 도중에 멈췄을 때 반쪽짜리 파일이 남는데, 임시 파일에 다 쓴 뒤 이름만 바꾸면 그 위험이 사라집니다.

## 코드 예

```python
import os, tempfile

def save(path, rows):
    directory = os.path.dirname(path) or '.'
    fd, tmp = tempfile.mkstemp(dir=directory)   # 반드시 같은 저장 공간에
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            write_rows(f, rows)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)     # 한 번에 갈아 끼운다
    except Exception:
        os.unlink(tmp)
        raise

# 이 방식은 읽는 쪽에게 반쯤 쓰인 상태를 보이지 않는다
```

## 주의할 점 / 경계 조건

임시 파일을 다른 저장 공간에 만들면 이름 바꾸기가 한 번에 이뤄지지 않습니다. 반드시 같은 곳에 만들어야 합니다.

## 관련 용어

- `process`
- `linux`

## 흔한 오해

파일을 열고 처음부터 다시 쓰면 된다고 생각하기 쉽지만, 그 사이에 죽으면 내용이 반만 남습니다. 원본도 새 내용도 아닌 상태가 됩니다.

## 동료평가 질문

원본을 직접 덮어쓰는 방식이 왜 위험한지, 중간에 멈추는 상황으로 설명할 수 있나요?
