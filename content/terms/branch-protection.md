# Branch Protection Rule

## 한 줄 설명

main 같은 branch에 review·status check·push 제한을 적용하는 rule.

## 쉽게 설명하면

중심 줄기에 아무나 아무렇게나 올리지 못하게 거는 규칙입니다. 약속을 설정으로 만드는 것입니다.

## 정확한 설명

직접 밀어 넣기 금지, 검토 요청 필수, 승인 수 하한, 자동 검사 통과 필수 같은 조건을 브랜치에 건다. 조건을 만족하지 않으면 합치기 자체가 거부되므로, 규칙이 사람의 기억이 아니라 시스템에 의해 지켜진다.

## 이 미션에서는 왜 필요한가

이 회차에서 중심 브랜치를 지키는 수단입니다. "직접 올리지 말자"는 합의만으로는 급할 때 깨지는데, 설정으로 걸면 급해도 깨지지 않습니다. 그것이 규칙을 합의가 아닌 설정으로 두는 이유입니다.

## 코드 예

```text
main 브랜치에 거는 규칙

  ☑ Require a pull request before merging
  ☑ Require approvals: 1
  ☑ Dismiss stale approvals when new commits are pushed
  ☑ Require status checks to pass
  ☑ Do not allow bypassing the above settings   ← 소유자에게도 적용

걸어 두면 이렇게 된다
  $ git push origin main
  remote: error: GH006: Protected branch update failed
```

## 주의할 점 / 경계 조건

저장소 소유자에게도 적용할지 따로 정해야 합니다. 예외를 두면 결국 그 경로로 규칙이 우회됩니다.

## 관련 용어

- `git`
- `commit`

## 흔한 오해

규칙을 정하면 팀이 지킬 것이라 생각하기 쉽지만, 마감이 급하면 예외가 생깁니다. 설정으로 강제하면 예외 자체가 불가능해집니다.

## 동료평가 질문

팀 규칙을 문서로만 두는 것과 설정으로 거는 것의 차이를, 마감이 급한 상황을 예로 설명할 수 있나요?
