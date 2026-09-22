# 에러 메시지

## 한 줄 설명

실패 원인과 사용자가 다음에 할 행동을 알려 주는 문구.

## 쉽게 설명하면

무엇이 잘못됐고 다음에 무엇을 하면 되는지 알려 주는 문구입니다. "오류가 발생했습니다"는 앞부분만 있고 뒷부분이 없는 문구입니다.

## 정확한 설명

사용자가 고칠 정보를 주되 stack trace나 비밀값 같은 내부 정보는 노출하지 않는다.

## 이 미션에서는 왜 필요한가

이 회차의 입력 폼은 잘못된 값을 받았을 때 그 사실을 알려 줘야 합니다. 메시지를 폼 맨 위에 한 번만 띄우면 어느 칸이 문제인지 알 수 없으므로, 문제가 난 입력 칸 옆에 두고 그 칸과 연결해 두는 것이 함께 필요합니다.

## 코드 예

```html
<label for="email">이메일</label>
<input id="email" type="email" aria-describedby="email-error" aria-invalid="true" />
<p id="email-error" class="error" role="alert">
  @ 앞뒤에 값이 필요합니다. 예: name@example.com
</p>

<!--
  나쁜 예   오류가 발생했습니다
  나은 예   @ 앞뒤에 값이 필요합니다 + 고칠 형식
  aria-describedby 로 묶어야 화면 낭독기가 칸과 함께 읽는다
-->
```

## 관련 용어

- `input-validation`
- `email-validation`
