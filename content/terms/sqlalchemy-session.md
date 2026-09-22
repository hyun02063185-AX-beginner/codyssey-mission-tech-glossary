# ORM Session

## 한 줄 설명

ORM의 변경 추적, query, transaction 경계를 관리하는 작업 단위.

## 쉽게 설명하면

데이터베이스와 대화하는 한 번의 작업 단위입니다. 여기서 객체를 읽고 고치고, 마지막에 확정하거나 되돌립니다.

## 정확한 설명

읽어 온 객체를 추적해 두었다가 확정 시점에 바뀐 것만 SQL로 내보낸다. 같은 단위 안에서 같은 행을 두 번 읽으면 같은 객체가 돌아오며, 트랜잭션 경계와 대체로 일치하므로 확정하거나 되돌리는 시점이 곧 트랜잭션의 끝이다.

## 동작 원리

객체를 읽으면 내부 저장소에 보관해 두고 변경 사항을 지켜봅니다. 확정할 때 바뀐 부분을 모아 한 번에 내보내며, 그 전까지는 데이터베이스에 반영되지 않습니다.

## 이 미션에서는 왜 필요한가

이 회차에서 웹 요청 하나가 이 단위 하나와 대응됩니다. 요청마다 새로 만들고 끝나면 닫지 않으면, 이전 요청에서 읽어 둔 낡은 객체가 남아 다음 요청이 옛 데이터를 보게 됩니다.

## 코드 예

```python
def get_session():
    session = SessionLocal()
    try:
        yield session         # 요청 하나에 하나
    finally:
        session.close()       # 끝나면 반드시 닫는다

@app.post('/posts')
def create(form: PostForm, db: Session = Depends(get_session)):
    post = Post(title=form.title, body=form.body)
    db.add(post)
    db.commit()               # 여기서 실제로 저장된다
    db.refresh(post)          # 데이터베이스가 채운 id 를 다시 읽어 온다
    return post
```

## 주의할 점 / 경계 조건

여러 요청이 하나를 공유하면 한쪽의 변경이 다른 쪽에 섞입니다. 요청마다 따로 만들어야 합니다.

## 관련 용어

- `data-integrity`
- `relational-database`

## 흔한 오해

객체를 고치면 바로 저장된다고 생각하기 쉽지만, 확정하기 전까지는 메모리 안의 변경일 뿐입니다. 확정하지 않고 끝내면 사라집니다.

## 동료평가 질문

웹 요청 하나가 이 단위 하나와 대응해야 하는 이유를, 공유했을 때 생기는 문제로 설명할 수 있나요?
