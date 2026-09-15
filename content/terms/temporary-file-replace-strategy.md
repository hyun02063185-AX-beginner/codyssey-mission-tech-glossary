# Temporary File / Replace Strategy

## 한 줄 설명

새 내용을 temporary file에 쓴 뒤 rename으로 기존 file을 교체해 부분 쓰기를 피하는 방식.

## 쉽게 설명하면

`Temporary File / Replace Strategy`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

새 내용을 temporary file에 쓴 뒤 rename으로 기존 file을 교체해 부분 쓰기를 피하는 방식. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

M07과 M08에서 command 결과, resource 지표, process 상태를 근거로 장애 원인과 조치를 설명합니다.

## 코드 예

```bash
# Temporary File / Replace Strategy
ps aux
```

## 관련 용어

- `process`
- `linux`
