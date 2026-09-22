# password hashing

## 한 줄 설명

password 원문 대신 단방향 hash와 salt를 저장하는 처리.

## 쉽게 설명하면

비밀번호를 되돌릴 수 없는 값으로 바꿔 저장하는 일입니다. 저장된 값을 훔쳐도 원래 비밀번호를 알 수 없게 만듭니다.

## 정확한 설명

일부러 느리게 만든 함수(bcrypt, scrypt, argon2)를 쓰고, 사용자마다 다른 무작위 값(salt)을 섞는다. salt는 같은 비밀번호가 같은 해시가 되는 것을 막고, 느림은 대량 추측 시도를 비싸게 만든다. SHA-256 같은 빠른 해시는 이 목적에 맞지 않는다.

## 이 미션에서는 왜 필요한가

이 회차의 회원 가입 보너스에서 씁니다. 해시라는 말만 보고 SHA-256을 쓰기 쉬운데, 그것은 빠르게 만들어진 함수라 초당 수십억 번 추측할 수 있어 이 용도에는 오히려 나쁩니다. 어느 함수를 왜 골랐는지가 판단의 핵심입니다.

## 코드 예

```python
import bcrypt

def hash_password(raw: str) -> str:
    # gensalt 가 사용자마다 다른 salt 를 만들고 결과에 함께 담는다
    return bcrypt.hashpw(raw.encode(), bcrypt.gensalt(rounds=12)).decode()

def verify(raw: str, stored: str) -> bool:
    return bcrypt.checkpw(raw.encode(), stored.encode())

# 같은 비밀번호라도 저장값은 매번 다르다 — salt 가 다르기 때문
# rounds 를 1 올리면 계산 시간이 2배가 된다
```

## 주의할 점 / 경계 조건

작업 강도(cost)를 올리면 안전해지지만 로그인도 그만큼 느려집니다. 서버에서 실제로 재 보고 0.1~0.5초 정도가 되게 맞추는 것이 보통입니다.

## 관련 용어

- `authentication`
- `authorization`
- `security-group`

## 흔한 오해

해시했으니 안전하다고 생각하기 쉽지만, 빠른 해시를 쓰면 흔한 비밀번호는 금방 뚫립니다. 중요한 것은 해시를 썼는지가 아니라 느린 해시를 salt와 함께 썼는지입니다.

## 동료평가 질문

`SHA-256` 과 `bcrypt` 중 비밀번호 저장에 무엇을 써야 하는지와 그 이유를, 추측 속도로 설명할 수 있나요?
