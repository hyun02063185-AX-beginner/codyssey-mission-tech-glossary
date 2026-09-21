# Content-addressable Storage

## 한 줄 설명

내용의 hash를 key로 삼아 object를 저장하는 방식.

## 쉽게 설명하면

`Content-addressable Storage`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.

## 정확한 설명

내용의 hash를 key로 삼아 object를 저장하는 방식. local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M10에서 만든 커밋 저장소를 실제 Git 쪽으로 넓혀 볼 때 만나는 개념입니다. 이름을 따로 붙이지 않고 내용에서 계산한 해시를 그대로 주소로 쓰는 방식이라, 같은 내용은 저장소에 한 번만 남습니다.

## 코드 예

```python
key = hashlib.sha1(blob).hexdigest()
store[key] = blob        # 같은 내용이면 같은 key → 중복 저장이 없다
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
