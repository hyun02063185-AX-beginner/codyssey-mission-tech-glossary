# 클론

## 한 줄 설명

remote repository의 history와 working tree를 local로 복사하는 Git 명령.

## 쉽게 설명하면

`클론`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

remote repository의 history와 working tree를 local로 복사하는 Git 명령. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M02는 클론을 최소 한 번 실습하게 합니다. 이미 있는 저장소를 통째로 내려받아 내 컴퓨터에 같은 이력을 만드는 일이고, 새로 만드는 것과 가져오는 것의 차이를 여기서 처음 겪습니다.

## 코드 예

```bash
git clone https://github.com/USER/REPO.git
# origin 이라는 이름의 원격 연결이 함께 만들어진다
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
