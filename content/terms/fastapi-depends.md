# Depends

## 한 줄 설명

FastAPI endpoint에 dependency 값을 주입하는 Depends 선언.

## 쉽게 설명하면

함수가 필요로 하는 값을 프레임워크가 대신 만들어 넣어 주게 하는 선언입니다. 함수 안에서 직접 만들지 않습니다.

## 정확한 설명

선언한 함수를 요청마다 실행해 그 결과를 인자로 넣는다. 같은 요청 안에서 여러 번 선언해도 한 번만 실행되고, 값을 내보낸 뒤 정리 코드를 이어 둘 수 있어 열고 닫는 자원에 알맞다. 중첩해서 쓸 수도 있다.

## 이 미션에서는 왜 필요한가

이 회차에서 데이터베이스 세션과 로그인 확인을 이 방식으로 넣습니다. 각 함수 안에서 세션을 열고 닫으면 닫는 것을 빠뜨리기 쉬운데, 이렇게 두면 정리까지 한 곳에 모입니다.

## 코드 예

```python
def get_db():
    db = SessionLocal()
    try:
        yield db          # 여기까지가 요청 전
    finally:
        db.close()        # 응답을 보낸 뒤 실행된다

def current_user(request: Request, db: Session = Depends(get_db)):
    uid = request.session.get('user_id')
    if uid is None:
        raise HTTPException(303, headers={'Location': '/login'})
    return db.get(User, uid)

@app.post('/posts')
def create(user: User = Depends(current_user), db: Session = Depends(get_db)):
    ...   # get_db 는 두 번 선언됐지만 한 요청에 한 번만 실행된다
```

## 주의할 점 / 경계 조건

실행 결과가 요청마다 새로 만들어집니다. 무거운 객체를 여기서 만들면 요청마다 그 비용이 듭니다.

## 관련 용어

- `http`
- `tcp`

## 흔한 오해

한 번만 실행된다고 생각하기 쉽지만, 요청마다 실행됩니다. 캐시되는 것은 같은 요청 안에서 여러 번 선언한 경우뿐입니다.

## 동료평가 질문

데이터베이스 세션을 이 방식으로 넣을 때 닫는 일이 어디서 일어나는지 설명할 수 있나요?
