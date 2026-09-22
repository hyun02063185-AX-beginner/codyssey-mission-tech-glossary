# inverted index

## 한 줄 설명

단어에서 문서 목록으로 거꾸로 연결하는 검색용 색인.

## 쉽게 설명하면

책 뒤의 색인처럼 단어를 보면 그 단어가 나온 문서를 찾는다.

## 정확한 설명

각 토큰에 문서 ID와 필요하면 위치·빈도를 연결한다. 검색어의 posting list를 합치거나 교차해 결과를 만든다.

## 작은 사례

문서 검색에서 “cache eviction”을 포함한 페이지를 빠르게 찾는다.

## 주의할 점

원본 문서가 바뀌면 색인도 갱신해야 최신 결과를 보장한다.

## 이 미션에서는 왜 필요한가

기록이 쌓인 뒤 "kim이 쓴 커밋"이나 "fix가 들어간 메시지"를 찾으려면, 매번 전체를 훑거나 미리 단어에서 기록으로 가는 표를 만들어 두어야 합니다. 뒤쪽이 이 구조이며, 검색이 빨라지는 대신 기록을 추가할 때마다 표를 갱신해야 하는 비용이 생깁니다.

## 코드 예

```python
index = {}
for cid, msg in [('C1', 'fix login'), ('C2', 'add login form'), ('C3', 'fix typo')]:
    for word in msg.split():
        index.setdefault(word, set()).add(cid)

print(index['fix'])              # {'C1', 'C3'}
print(index['fix'] & index['login'])   # {'C1'} — 두 단어를 모두 포함
```

## 관련 용어

- `hash-map`
- `graph-traversal`
