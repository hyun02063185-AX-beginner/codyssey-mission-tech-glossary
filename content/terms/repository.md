# 저장소

## 한 줄 설명

commit history와 working tree, Git metadata를 보관하는 project 단위.

## 쉽게 설명하면

`저장소`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

commit history와 working tree, Git metadata를 보관하는 project 단위. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 동작 원리

변경을 비교하고 branch와 commit graph의 위치를 확인한 뒤, 자동 통합이 안 되는 부분은 의도를 검토해 선택하고 검증한 결과를 새 history로 기록합니다.

## 이 미션에서는 왜 필요한가

예비 M01에서 제출하는 단위가 저장소 그 자체입니다. 폴더를 압축해 보내는 것이 아니라 이력이 함께 담긴 저장소를 넘기는 것이므로, 무엇이 저장소 안에 들어가고 무엇이 빠지는지가 곧 제출물의 내용이 됩니다.

## 코드 예

```bash
git init my-project
cd my-project
git status        # On branch main / No commits yet
```

## 주의할 점 / 경계 조건

history를 바꾸는 명령은 이미 공유된 commit에 영향을 줄 수 있습니다. 실행 전 branch, remote, collaborator와의 합의를 확인해야 합니다.

## 관련 용어

- `branch`
- `remote`

## 흔한 오해

Git 명령이 성공했다고 review·test·배포 기준까지 자동으로 통과한 것은 아닙니다.

## 동료평가 질문

이 변경을 공유하기 전에 history, diff, test 결과 중 무엇을 확인하겠습니까?
