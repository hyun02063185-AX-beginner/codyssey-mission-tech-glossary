# 풀

## 한 줄 설명

remote의 변경을 fetch한 뒤 local branch에 통합하는 Git 명령.

## 쉽게 설명하면

`풀`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

remote의 변경을 fetch한 뒤 local branch에 통합하는 Git 명령. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M02는 풀을 최소 한 번 실습하게 합니다. 원격에 생긴 커밋을 내 쪽으로 가져와 합치는 일이며, 두 곳에서 각각 작업했을 때 무엇이 어떻게 합쳐지는지 직접 겪어 보게 하려는 요구입니다.

## 코드 예

```bash
git pull origin main     # 가져오기와 합치기를 한 번에
# 충돌이 나면 여기서 멈추고 파일을 고쳐야 한다
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
