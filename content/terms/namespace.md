# 네임스페이스

## 한 줄 설명

Linux에서 process가 보는 process·network·mount 등의 resource view를 격리하는 기능.

## 쉽게 설명하면

`네임스페이스`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.

## 정확한 설명

Linux에서 process가 보는 process·network·mount 등의 resource view를 격리하는 기능. 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 컨테이너가 왜 가벼운지를 설명하는 두 축 가운데 하나입니다(다른 하나는 자원 제한). 프로세스가 보는 프로세스 목록·네트워크·마운트 범위를 따로 떼어 주기만 하므로, 운영체제를 통째로 복제하지 않아도 격리가 됩니다.

## 코드 예

```bash
docker run --rm ubuntu ps aux   # 컨테이너 안에서는 프로세스가 몇 개뿐
ls -l /proc/$$/ns               # 현재 셸이 속한 네임스페이스들
```

## 관련 용어

- `process`
- `linux`
