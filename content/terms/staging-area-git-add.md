# 스테이징

## 한 줄 설명

다음 commit에 넣을 변경 snapshot을 선택하는 Git index.

## 쉽게 설명하면

`스테이징`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

다음 commit에 넣을 변경 snapshot을 선택하는 Git index. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M02에서 커밋을 남기려면 그 전에 무엇을 담을지 고르는 단계를 지나야 합니다. 고친 파일이 여러 개일 때 전부 한 커밋에 넣지 않고 일부만 고를 수 있는 것이 이 단계 덕분입니다.

## 코드 예

```bash
git add quiz.py          # 이 파일만 담는다
git status               # 담긴 것과 담기지 않은 것을 나눠 보여 준다
```

## 관련 용어

- `git`
- `commit`
