# Temporary File / Replace Strategy

## 한 줄 설명

새 내용을 temporary file에 쓴 뒤 rename으로 기존 file을 교체해 부분 쓰기를 피하는 방식.

## 쉽게 설명하면

`Temporary File / Replace Strategy`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

새 내용을 temporary file에 쓴 뒤 rename으로 기존 file을 교체해 부분 쓰기를 피하는 방식. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M03에서 파일 기반 수정·삭제를 안전하게 만드는 방법입니다. 원본을 열어 바로 덮어쓰면 도중에 멈췄을 때 반쪽짜리 파일이 남는데, 임시 파일에 다 쓴 뒤 이름만 바꾸면 그 위험이 사라집니다.

## 코드 예

```python
tmp = path.with_suffix(".tmp")
tmp.write_text(new_content, encoding="utf-8")
tmp.replace(path)      # 이름 바꾸기는 중간 상태가 없다
```

## 관련 용어

- `process`
- `linux`
