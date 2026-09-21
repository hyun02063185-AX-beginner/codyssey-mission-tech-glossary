# 푸시

## 한 줄 설명

local commit을 remote repository에 전송하는 Git 명령.

## 쉽게 설명하면

`푸시`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

local commit을 remote repository에 전송하는 Git 명령. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M02는 커밋을 남기는 것에 더해 원격에도 반영하라고 요구합니다. 내 컴퓨터에만 있는 커밋은 제출되지 않으므로, 커밋 요구를 만족하려면 푸시까지 가야 합니다.

## 코드 예

```bash
git push origin main
# rejected 가 뜨면 원격에 내가 모르는 커밋이 있다는 뜻 → 먼저 pull
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
