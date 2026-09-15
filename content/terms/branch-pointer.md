# branch pointer

## 한 줄 설명

Git에서 branch 이름이 가리키는 최신 commit을 가리키는 movable reference.

## 쉽게 설명하면

`branch pointer`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

Git에서 branch 이름이 가리키는 최신 commit을 가리키는 movable reference. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 동작 원리

변경을 비교하고 branch와 commit graph의 위치를 확인한 뒤, 자동 통합이 안 되는 부분은 의도를 검토해 선택하고 검증한 결과를 새 history로 기록합니다.

## 이 미션에서는 왜 필요한가

M04와 M06에서 변경을 안전하게 기록하고 review 가능한 단위로 공유하며 충돌을 복구하는 기준입니다.

## 코드 예

```bash
# branch pointer
git status
```

## 주의할 점 / 경계 조건

history를 바꾸는 명령은 이미 공유된 commit에 영향을 줄 수 있습니다. 실행 전 branch, remote, collaborator와의 합의를 확인해야 합니다.

## 관련 용어

- `git`
- `commit`

## 흔한 오해

Git 명령이 성공했다고 review·test·배포 기준까지 자동으로 통과한 것은 아닙니다.

## 동료평가 질문

이 변경을 공유하기 전에 history, diff, test 결과 중 무엇을 확인하겠습니까?
