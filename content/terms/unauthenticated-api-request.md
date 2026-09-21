# 비인증 호출

## 한 줄 설명

인증 header나 session 없이 API를 호출하는 요청.

## 쉽게 설명하면

`비인증 호출`을(를) 누가 접근할 수 있고 어떤 정보가 노출되는지의 관점에서 확인하면 됩니다.

## 정확한 설명

인증 header나 session 없이 API를 호출하는 요청. 실제 적용에서는 신원, 권한, network 경계, 비밀값 보관 중 관련된 조건을 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M01에서 GitHub API를 인증 없이 부를 때 걸리는 제한의 이름입니다. 시간당 60회라는 숫자가 여기서 나오며, 개발 중 새로고침을 반복하면 금방 도달합니다.

## 코드 예

```bash
curl -i https://api.github.com/users/octocat | grep -i ratelimit
# x-ratelimit-limit: 60      ← 인증 없이 호출할 때
# x-ratelimit-remaining: 57
```

## 관련 용어

- `authentication`
