# Password Credential

## 한 줄 설명

사용자 password처럼 본인을 증명하는 secret credential.

## 쉽게 설명하면

본인만 안다고 가정하는 비밀 값입니다. 사용자가 여러 서비스에 같은 값을 쓰는 경우가 많다는 것이 이 방식의 가장 큰 약점입니다.

## 정확한 설명

서버는 이 값을 알 필요가 없고 알아서도 안 된다. 저장하는 것은 되돌릴 수 없는 해시이며, 확인은 입력값을 같은 방식으로 변환해 비교하는 것으로 이뤄진다. 전송 구간은 TLS로 감싸야 하고 로그와 오류 메시지에 값이 남지 않게 해야 한다.

## 이 미션에서는 왜 필요한가

이 회차의 회원 가입과 로그인이 이 값을 다룹니다. 서비스가 유출되면 여기 저장한 값이 다른 서비스의 계정까지 위협하므로, 저장 방식과 로그 처리가 우리 서비스만의 문제가 아니게 됩니다.

## 코드 예

```python
# 저장하지 않는다
user.password = form.password              # 절대 안 된다
log.info('login attempt %s', form.dict())  # 로그에 원문이 남는다

# 저장한다
user.password_hash = hash_password(form.password)
log.info('login attempt email=%s', form.email)   # 비밀번호는 빼고 기록

# 오류 메시지에도 남지 않게 한다
class LoginForm(BaseModel):
    email: str
    password: SecretStr         # 출력하면 '**********' 로 나온다
```

## 관련 용어

- `authentication`

## 흔한 오해

데이터베이스에 접근 권한이 있는 사람만 본다면 원문 저장도 괜찮다고 생각하기 쉽지만, 백업 파일·로그·오류 보고서로도 새어 나갑니다. 아무도 원문을 볼 수 없게 만드는 것이 해시의 목적입니다.

## 동료평가 질문

비밀번호가 로그나 오류 메시지에 남지 않는다는 것을 직접 확인하고, 어디를 확인했는지 설명할 수 있나요?
