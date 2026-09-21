# 하드코딩

## 한 줄 설명

변경 가능한 값·비밀값을 source code에 직접 고정하는 방식.

## 쉽게 설명하면

`하드코딩`을(를) 누가 접근할 수 있고 어떤 정보가 노출되는지의 관점에서 확인하면 됩니다.

## 정확한 설명

변경 가능한 값·비밀값을 source code에 직접 고정하는 방식. 실제 적용에서는 신원, 권한, network 경계, 비밀값 보관 중 관련된 조건을 구분해야 합니다.

## 이 미션에서는 왜 필요한가

본과정 M06은 API 키를 코드에 직접 적지 말라고 요구합니다. 코드는 저장소에 올라가고 이력에 남기 때문에, 한 번 적어 올리면 나중에 지워도 과거 커밋에는 그대로 남아 있습니다.

## 코드 예

```python
# 하지 않는다
client = Anthropic(api_key="sk-ant-...")

# 대신
import os
client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
```

## 관련 용어

- `authentication`
