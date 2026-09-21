# 디렉토리

## 한 줄 설명

file과 다른 directory를 이름으로 묶는 filesystem container.

## 쉽게 설명하면

`디렉토리`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

file과 다른 directory를 이름으로 묶는 filesystem container. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01의 4.2 항목에서 만들고 옮기고 지우는 실습 대상이 바로 디렉터리입니다. 파일을 담는 상자이자 그 자체도 경로의 한 마디라서, 경로를 읽는 감각이 여기서 생깁니다.

## 코드 예

```bash
mkdir -p work/logs
mv note.txt work/
rmdir work/logs      # 비어 있을 때만 지워진다
```

## 관련 용어

- `process`
- `linux`
