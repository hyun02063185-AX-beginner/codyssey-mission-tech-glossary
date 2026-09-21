# SSH 키

## 한 줄 설명

SSH에서 password 대신 공개키 암호로 사용자를 증명하는 key pair.

## 쉽게 설명하면

`SSH 키`을(를) 누가 접근할 수 있고 어떤 정보가 노출되는지의 관점에서 확인하면 됩니다.

## 정확한 설명

SSH에서 password 대신 공개키 암호로 사용자를 증명하는 key pair. 실제 적용에서는 신원, 권한, network 경계, 비밀값 보관 중 관련된 조건을 구분해야 합니다.

## 이 미션에서는 왜 필요한가

예비 M01의 보너스 항목으로, 비밀번호나 토큰 대신 GitHub 인증에 쓰는 방식입니다. 개인 키는 내 컴퓨터에만 두고 공개 키만 등록하므로, 등록한 값이 새어도 접속 권한은 넘어가지 않습니다.

## 코드 예

```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub     # 이 공개 키만 GitHub 에 등록한다
ssh -T git@github.com         # 연결 확인
```

## 관련 용어

- `authentication`
