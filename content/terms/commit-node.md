# commit node

## 한 줄 설명

commit graph에서 부모 commit과 연결된 하나의 history node.

## 쉽게 설명하면

`commit node`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

commit graph에서 부모 commit과 연결된 하나의 history node. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M10에서 커밋 하나를 자료구조로 설계할 때의 단위입니다. 해시·메시지·작성자·시각·부모를 함께 들고 있어야 이력이 되며, 부모를 빼면 목록은 되어도 이력은 되지 않습니다.

## 코드 예

```python
@dataclass
class CommitNode:
    commit_id: str
    message: str
    author: str
    timestamp: str
    parents: list[str]   # 병합 커밋이면 둘
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
