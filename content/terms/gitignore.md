# .gitignore

## 한 줄 설명

Git이 untracked file을 기본적으로 무시할 pattern을 적는 설정 file.

## 쉽게 설명하면

`.gitignore`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

Git이 untracked file을 기본적으로 무시할 pattern을 적는 설정 file. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M02에서는 `.env` 같은 민감 파일이 저장소에 올라가지 않게 막는 수단이고, 예비 M02에서는 굳이 추적할 필요 없는 파일을 빼 두는 수단입니다. 이미 추적 중인 파일은 목록에 적어도 빠지지 않는다는 점이 자주 걸립니다.

## 코드 예

```text
.env
__pycache__/
node_modules/
# 이미 추적 중이라면: git rm --cached .env
```

## 관련 용어

- `git`
- `commit`
