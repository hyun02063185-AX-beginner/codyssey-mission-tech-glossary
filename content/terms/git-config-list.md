# git config

## 한 줄 설명

Git configuration 값을 조회하거나 설정하는 명령.

## 쉽게 설명하면

`git config`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

Git configuration 값을 조회하거나 설정하는 명령. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01의 4.10 항목에서 설정이 실제로 적용됐는지 보여 주는 증거로 씁니다. 사용자 이름과 메일이 커밋에 박히므로, 설정을 마친 뒤 목록으로 확인하는 것까지가 한 묶음입니다.

## 코드 예

```bash
git config --list --show-origin
# user.name / user.email 이 어느 설정 파일에서 왔는지까지 보여 준다
```

## 관련 용어

- `git`
- `commit`
