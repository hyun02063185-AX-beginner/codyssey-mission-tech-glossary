# TLS Certificate

## 한 줄 설명

server identity와 public key를 연결해 TLS 연결 상대를 검증하는 인증서.

## 쉽게 설명하면

이 주소의 서버가 진짜 그 서버임을 제3자가 보증해 주는 문서입니다. 브라우저 자물쇠 표시가 이것을 확인한 결과입니다.

## 정확한 설명

도메인 이름과 공개 키를 묶어 인증 기관이 서명한 파일이다. 브라우저는 서명을 상위 기관까지 거슬러 검증하고, 인증서에 적힌 이름이 접속한 주소와 맞는지, 유효 기간이 지나지 않았는지를 함께 본다. 서버는 대응하는 개인 키로 자신을 증명한다.

## 이 미션에서는 왜 필요한가

이 회차에서 배포한 사이트를 HTTPS로 여는 데 필요합니다. 없으면 브라우저가 경고를 띄워 사용자가 들어오지 못하고, 로그인 정보가 암호화되지 않은 채 오갑니다.

## 코드 예

```bash
openssl s_client -connect example.com:443 -servername example.com </dev/null \
  | openssl x509 -noout -subject -issuer -dates

# subject  누구의 것인가 (도메인)
# issuer   누가 보증했는가
# dates    언제까지 유효한가

# 사슬이 제대로 설치됐는지 확인
openssl s_client -connect example.com:443 -showcerts </dev/null | grep "^ *i:"
```

## 주의할 점 / 경계 조건

발급받은 인증서 하나만 두면 중간 인증서가 빠져 일부 클라이언트에서 검증에 실패합니다. 전체 사슬을 함께 설치해야 합니다.

## 관련 용어

- `authentication`
- `authorization`
- `security-group`

## 흔한 오해

자물쇠가 보이면 그 사이트가 믿을 만하다는 뜻으로 읽히기 쉽지만, 보증하는 것은 "접속한 주소가 맞다"까지입니다. 그 사이트가 정직한지는 별개입니다.

## 동료평가 질문

인증서가 보증하는 것과 보증하지 않는 것을 구분해 설명할 수 있나요?
