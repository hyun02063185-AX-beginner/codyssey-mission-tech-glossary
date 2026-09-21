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

본과정 M10에서 브랜치를 구현할 때 실제로 저장하는 값입니다. 브랜치는 커밋 묶음을 복사해 두는 것이 아니라 커밋 하나를 가리키는 이름이므로, 새 커밋을 만들 때마다 그 이름이 앞으로 옮겨 가기만 하면 됩니다.

## 코드 예

```python
branches = {"main": "a1b2c3", "feature": "d4e5f6"}
# 커밋을 하나 더 만들면
branches[current] = new_commit_id      # 이름표만 옮긴다
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
