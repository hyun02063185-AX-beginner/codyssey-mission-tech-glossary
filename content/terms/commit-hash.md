# hash

## 한 줄 설명

commit object를 식별하는 content hash.

## 쉽게 설명하면

`hash`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

commit object를 식별하는 content hash. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M10은 커밋을 직접 만들어 보게 하고, 그 커밋을 한 세션 안에서 유일하게 가리킬 이름이 필요합니다. 해시는 커밋 내용에서 계산되므로 내용이 한 글자만 달라도 다른 이름이 됩니다.

## 코드 예

```python
import hashlib
body = f"{message}
{author}
{timestamp}
{parent}"
commit_id = hashlib.sha1(body.encode()).hexdigest()   # 내용이 곧 이름
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
