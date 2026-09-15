# Inbound / Outbound Rule

## 한 줄 설명

resource로 들어오는 traffic과 나가는 traffic을 각각 제한하는 network rule.

## 쉽게 설명하면

`Inbound / Outbound Rule`을(를) 누가 접근할 수 있고 어떤 정보가 노출되는지의 관점에서 확인하면 됩니다.

## 정확한 설명

resource로 들어오는 traffic과 나가는 traffic을 각각 제한하는 network rule. 실제 적용에서는 신원, 권한, network 경계, 비밀값 보관 중 관련된 조건을 구분해야 합니다.

## 이 미션에서는 왜 필요한가

M05·M07·M13의 배포, 원격 접속, 인증 기능에서 안전한 기본값과 실패 처리를 설명하는 기준입니다.

## 코드 예

```text
# Inbound / Outbound Rule 설정은 비밀값과 권한 범위를 검토한다
```

## 관련 용어

- `security-identity`
