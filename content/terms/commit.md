# 커밋

## 한 줄 설명

staging area의 snapshot과 부모 history를 기록하는 Git object.

## 쉽게 설명하면

`커밋`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

staging area의 snapshot과 부모 history를 기록하는 Git object. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M02는 커밋을 10개 이상 남기라고 요구합니다. 개수를 채우는 것이 목적이 아니라 작업을 되돌릴 수 있는 단위로 끊는 연습입니다. 한 커밋이 한 가지 일만 담으면 나중에 문제를 그 지점까지만 되돌릴 수 있습니다.

## 코드 예

```bash
git add quiz.py
git commit -m "정답 판정 로직 분리"   # 한 커밋에 한 가지 일
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
