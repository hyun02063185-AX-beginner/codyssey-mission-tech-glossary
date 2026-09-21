# parent

## 한 줄 설명

현재 commit이 이전 history와 연결될 때 가리키는 바로 앞 commit.

## 쉽게 설명하면

`parent`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

현재 commit이 이전 history와 연결될 때 가리키는 바로 앞 commit. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M10에서 커밋들을 이어 이력을 만드는 연결 고리입니다. 부모를 따라 거슬러 올라가면 그 시점까지의 전체 이력이 나오고, 부모가 둘이면 두 갈래가 합쳐진 지점이라는 뜻입니다.

## 코드 예

```python
def history(commit_id, store):
    while commit_id:
        node = store[commit_id]
        yield node
        commit_id = node.parents[0] if node.parents else None
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
