# commit 명령

## 한 줄 설명

Git에서 staging area의 변경을 하나의 이력 단위로 기록하는 `git commit` 하위 명령입니다.

## 쉽게 설명하면

검토한 변경 묶음에 날짜와 설명을 붙여 이력 장부에 확정하는 동작입니다.

## 정확한 설명

`git commit`은 index에 올린 스냅샷을 새 commit object로 만들고 부모 commit을 연결합니다. 작업 디렉터리의 모든 변경을 자동으로 포함하지는 않습니다.

## 이 미션에서는 왜 필요한가

M06에서 생성한 변경을 의미 있는 제목과 함께 협업 가능한 이력으로 남깁니다.

## 코드 예

```bash
git add report.md
git commit -m 'docs: add report'
```

## 관련 용어

- `staging-area-git-add`
- `commit`
- `commit-message-convention`
