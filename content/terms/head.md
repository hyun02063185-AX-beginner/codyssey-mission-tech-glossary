# HEAD

## 한 줄 설명

현재 checkout된 commit 또는 branch tip을 가리키는 Git reference.

## 쉽게 설명하면

`HEAD`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

현재 checkout된 commit 또는 branch tip을 가리키는 Git reference. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M02에서 브랜치를 옮겨 다닐 때 기준이 되는 지점입니다. "지금 어느 커밋 위에 서 있는가"를 가리키므로, 브랜치를 바꾸면 작업 폴더의 내용이 왜 통째로 달라지는지가 이것으로 설명됩니다.

## 코드 예

```bash
git log --oneline -1     # HEAD 가 가리키는 커밋
git switch feature/x     # HEAD 가 다른 브랜치로 옮겨 간다
```

## 관련 용어

- `git`
- `commit`
