#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
E={
'authentication-token':'인증이 끝난 뒤 클라이언트가 자신을 증명할 때 제시하는 자격 증명 값','data-masking':'원본 민감값을 숨기거나 일부만 보이게 바꿔 노출 위험을 줄이는 처리','iam-role':'사람·서비스가 맡을 수 있는 권한 묶음','identity-and-access-management':'신원 확인과 권한 부여를 관리하는 정책·도구 체계','ssh':'암호화된 원격 shell 접속과 파일 전송에 쓰는 프로토콜',
'access-control-list':'주체별로 resource에 허용·거부할 작업을 나열한 권한 규칙','firewalld':'Linux에서 zone과 service 기준으로 방화벽 규칙을 관리하는 도구','login':'사용자가 자격 증명을 제시해 session이나 token을 받는 인증 시작 절차','logout':'현재 인증 session이나 token 사용을 끝내는 절차','principle-of-least-privilege':'필요한 작업에 필요한 최소 권한만 부여하는 보안 원칙','protected-route':'인증·권한 조건을 만족한 요청에만 열리는 route','public-route':'로그인하지 않은 사용자도 접근할 수 있는 route','root-remote-login':'root 계정으로 network를 통해 직접 로그인하는 방식','safe-mode':'문제 원인을 좁히기 위해 최소 기능·driver만으로 시작하는 진단 모드','security-group':'cloud resource의 inbound·outbound traffic을 제어하는 가상 방화벽 규칙','oauth-2-0':'사용자 password를 앱에 주지 않고 제한된 access token을 위임하는 authorization framework','password-hashing':'password 원문 대신 단방향 hash와 salt를 저장하는 처리','csrf':'사용자가 로그인한 browser를 악용해 의도하지 않은 요청을 보내게 하는 공격','least-privilege':'권한을 최소화해 계정 탈취·오작동의 피해 범위를 제한하는 원칙','rbac':'사용자에게 직접 권한을 주기보다 role에 권한을 묶어 부여하는 모델','refresh-token':'짧은 access token이 만료된 뒤 새 access token을 받는 데 쓰는 장기 자격 증명','tls-certificate':'server identity와 public key를 연결해 TLS 연결 상대를 검증하는 인증서',
'env':'실행 환경별 설정값을 process에 전달하는 environment variable 파일 또는 값','ufw':'Ubuntu에서 방화벽 규칙을 간단히 관리하는 command-line 도구','authentication-error':'인증 정보가 없거나 유효하지 않아 요청을 처리할 수 없다는 실패 상태','hardcoding':'변경 가능한 값·비밀값을 source code에 직접 고정하는 방식','let-s-encrypt':'무료 TLS certificate를 발급·갱신하는 certificate authority','ssh-key':'SSH에서 password 대신 공개키 암호로 사용자를 증명하는 key pair','sudo':'허가된 명령 하나를 다른 사용자, 보통 root 권한으로 실행하는 명령','unauthenticated-api-request':'인증 header나 session 없이 API를 호출하는 요청','access-control':'누가 어떤 resource에 어떤 작업을 할 수 있는지 결정·집행하는 보안 통제','inbound-outbound-rule':'resource로 들어오는 traffic과 나가는 traffic을 각각 제한하는 network rule','oauth2-authorization-code':'OAuth2에서 authorization code를 token으로 교환하는 browser 기반 grant','owner-group-mode':'Unix file의 owner, group, rwx mode로 구성된 기본 권한 모델','password-credential':'사용자 password처럼 본인을 증명하는 secret credential','pat':'사용자가 만든 API·Git 접근용 personal access token','pii':'개인을 직접 또는 다른 정보와 결합해 식별할 수 있는 개인정보','secret-management':'key·token·password를 안전하게 저장, 전달, 회전, 폐기하는 운영 방식','sha':'입력에서 고정 길이 digest를 만드는 secure hash algorithm 계열','shared-responsibility-model':'cloud provider와 고객이 보안 책임을 나누는 모델'}
def render(id,tier,term):
 title=term['term_ko']; summary=E[id]+'.'; related=['authentication','authorization','security-group'] if tier!='C' else ['authentication']
 out=[f'# {title}','','## 한 줄 설명','',summary,'','## 쉽게 설명하면','',f'`{title}`을(를) 누가 접근할 수 있고 어떤 정보가 노출되는지의 관점에서 확인하면 됩니다.','','## 정확한 설명','',summary+' 실제 적용에서는 신원, 권한, network 경계, 비밀값 보관 중 관련된 조건을 구분해야 합니다.']
 if tier=='A': out+=['','## 동작 원리','','요청 또는 접속이 들어오면 자격 증명과 정책을 확인하고, 허용된 범위에서만 작업을 수행한 뒤 기록·만료·회수 조건을 적용합니다.']
 out+=['','## 이 미션에서는 왜 필요한가','','M05·M07·M13의 배포, 원격 접속, 인증 기능에서 안전한 기본값과 실패 처리를 설명하는 기준입니다.','','## 코드 예','',f'```text\n# {title} 설정은 비밀값과 권한 범위를 검토한다\n```']
 if tier!='C': out+=['','## 주의할 점 / 경계 조건','','정상 응답이나 한 번의 로그인 성공만으로 전체 보안이 보장되지는 않습니다. 만료, 철회, 최소 권한, 감사 기록을 함께 확인합니다.']
 out+=['','## 관련 용어','']+[f'- `{x}`' for x in related]
 if tier!='C': out+=['','## 흔한 오해','','보안 기능 하나를 추가했다고 모든 위협이 사라지는 것은 아닙니다. 공격 표면과 권한 경계는 별도로 점검해야 합니다.','','## 동료평가 질문','','이 설정이 허용하는 주체·작업·기간을 어떻게 검증하겠습니까?']
 return '\n'.join(out)+'\n'
def main():
 p=json.loads((R/'data/reviews/content-tier-sprint7.json').read_text()); b=next(x for x in p['implementation_batches'] if x['id']=='S7-B03'); items={x['term_id']:x for x in p['items']}; m=json.loads((R/'data/curated/glossary-master-v0.1.yaml').read_text()); by={x['id']:x for x in m['terms']}; assert set(b['term_ids'])==set(E) and len(E)==40
 for id in b['term_ids']: (R/'content/terms'/f'{id}.md').write_text(render(id,items[id]['tier'],by[id]),encoding='utf-8'); by[id]['content_status']='drafted'
 (R/'data/curated/glossary-master-v0.1.yaml').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n'); print('Wrote 40 S7-B03 term files.')
if __name__=='__main__': main()
