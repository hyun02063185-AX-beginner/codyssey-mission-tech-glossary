# Contact Form

## 한 줄 설명

사용자가 문의 내용과 연락처를 입력해 서버에 전달하는 form UI.

## 쉽게 설명하면

이름과 연락처, 내용을 받아 보내는 입력 화면입니다. 입력 칸을 놓는 것보다 잘못 입력했을 때와 보낸 뒤를 처리하는 일이 더 깁니다.

## 정확한 설명

label, input, textarea, 제출, 검증, 성공·실패 피드백을 하나의 입력 흐름으로 조합한다.

## 이 미션에서는 왜 필요한가

이 회차가 요구하는 입력·검증 구현이 이것입니다. 칸을 만드는 것은 금방이지만, 빈 값으로 보냈을 때·형식이 틀렸을 때·보내는 중일 때·보낸 뒤 각각 화면이 어떻게 되어야 하는지 정하는 것이 실제 작업입니다.

## 코드 예

```html
<form id="contact" novalidate>
  <label for="email">이메일</label>
  <input id="email" name="email" type="email" required
         aria-describedby="email-error" />
  <p id="email-error" class="error" role="alert" hidden></p>

  <button type="submit">보내기</button>
</form>

<script>
  const form = document.getElementById('contact');
  const button = form.querySelector('button');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;          // 두 번 눌리지 않게
    try {
      await send(new FormData(form));
      form.reset();
    } finally {
      button.disabled = false;       // 실패해도 반드시 푼다
    }
  });
</script>
```

## 주의할 점 / 경계 조건

제출 버튼을 여러 번 누를 수 있으면 같은 내용이 여러 번 전송됩니다. 보내는 동안 버튼을 잠그고, 끝나면 성공이든 실패든 다시 풀어야 합니다.

## 관련 용어

- `html-form`
- `email-validation`
- `input-validation`

## 흔한 오해

브라우저가 `required` 와 `type="email"` 로 검사해 주니 충분하다고 생각하기 쉽지만, 그 검사는 사용자가 개발자 도구로 지울 수 있습니다. 서버 쪽 검사가 실제 방어선입니다.

## 동료평가 질문

빈 값·형식 오류·전송 중·전송 실패·전송 성공의 다섯 상태에서 화면이 각각 어떻게 되는지 보여 줄 수 있나요?
