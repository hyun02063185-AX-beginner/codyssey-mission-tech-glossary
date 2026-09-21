# merge commit

## 한 줄 설명

두 history tip을 합치며 부모가 둘인 commit.

## 쉽게 설명하면

`merge commit`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

두 history tip을 합치며 부모가 둘인 commit. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M10의 보너스 항목으로, 부모를 둘 가진 커밋을 만들어 보게 합니다. 부모가 둘이라는 사실 하나로 "여기서 두 갈래가 합쳐졌다"가 이력에 남고, 나중에 어느 쪽에서 온 변경인지 추적할 수 있게 됩니다.

## 코드 예

```python
merge = CommitNode(
    message="merge feature into main",
    parents=[main_head, feature_head],   # 부모가 둘
```

## 관련 용어

- `git`
- `commit`
