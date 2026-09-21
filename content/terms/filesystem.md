# 파일시스템

## 한 줄 설명

file·directory·metadata를 storage에 조직하는 방식.

## 쉽게 설명하면

`파일시스템`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

file·directory·metadata를 storage에 조직하는 방식. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 볼륨과 마운트를 다루기 전에 전제가 되는 개념입니다. 저장 장치가 어떤 규칙으로 파일과 디렉터리를 담는지 알아야, 마운트가 "다른 저장 공간을 이 경로에 붙인다"는 뜻으로 읽힙니다.

## 코드 예

```bash
df -h        # 어느 경로에 어떤 저장 공간이 붙어 있는지
mount | head # 붙여 둔 목록
```

## 관련 용어

- `kernel`
- `directory`
