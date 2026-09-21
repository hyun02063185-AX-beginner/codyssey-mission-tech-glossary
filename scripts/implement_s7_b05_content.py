#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
import sys as _sys; _sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_generation_guard import assert_generation_allowed  # R12 재발 방지
assert_generation_allowed(__file__)

E={'memory-leak':'더 이상 필요하지 않은 memory가 해제되지 않아 process 사용량이 계속 늘어나는 문제','bash':'명령을 해석하고 program을 실행하는 Unix shell','cpu-spike':'짧은 시간에 CPU 사용률이 급격히 올라가는 현상','cpu-usage':'process 또는 system이 CPU 시간을 사용한 비율','cron':'정해진 시간이나 주기에 command를 실행하는 scheduler service','disk-usage':'file과 directory가 storage에서 차지하는 용량','exit-code':'program 종료 결과를 caller에게 알리는 정수 상태값','file-io':'file을 열고 읽고 쓰고 닫는 input/output 작업','linux':'kernel과 user-space 도구로 구성된 Unix 계열 operating system','linux-group':'Linux에서 user 권한과 file 접근을 함께 관리하는 group','linux-user':'Linux system에서 identity와 권한을 가진 user account','listening-socket':'network connection을 받을 준비가 된 server socket','memory-usage':'process 또는 system이 현재 사용 중인 memory 양','out-of-memory':'사용할 memory를 확보하지 못해 process가 실패하거나 종료되는 상태','process-id':'운영체제가 실행 중인 process에 부여하는 식별 번호','process-monitoring':'process의 resource·상태·log를 관찰해 이상을 찾는 작업','python-subprocess':'Python에서 다른 program을 실행하고 결과를 받는 module·작업','ubuntu':'Debian 계열의 널리 쓰이는 Linux distribution','cgroup':'Linux kernel이 process group의 CPU·memory 같은 resource를 제한·측정하는 기능','kernel':'hardware와 process·memory·device를 중재하는 operating system 핵심','755-644':'Unix file permission을 owner·group·other의 rwx bit로 적는 숫자 표기','crontab':'cron job의 schedule과 command를 적는 설정 file','exit-status-1':'일반적으로 command 실패를 알리는 non-zero 종료 상태','ps':'현재 process snapshot을 보여 주는 Unix command','ps-l':'process의 scheduling·priority 등 긴 형식 정보를 보는 ps option','top':'CPU·memory를 많이 쓰는 process를 실시간으로 보는 command','top-h':'thread별 CPU 사용을 보여 주도록 top을 실행하는 option','atomicity':'작업이 전부 적용되거나 전혀 적용되지 않는 성질','aws-free-tier':'AWS 서비스의 제한된 무료 사용량 정책','directory':'file과 다른 directory를 이름으로 묶는 filesystem container','first-come-first-served':'먼저 도착한 job을 먼저 실행하는 scheduling 방식','hidden-file':'이름이 점으로 시작해 일반 listing에서 숨겨지는 Unix file','priority-scheduling':'priority가 높은 job을 먼저 선택하는 scheduling 방식','round-robin-scheduling':'ready queue의 job에 일정 time slice를 번갈아 주는 scheduling 방식','filesystem':'file·directory·metadata를 storage에 조직하는 방식','heap-memory':'동적으로 할당한 object가 보관되는 process memory 영역','logrotate':'log file을 교체·압축·보관·삭제하는 운영 도구','namespace':'Linux에서 process가 보는 process·network·mount 등의 resource view를 격리하는 기능','process-pid-1':'container 또는 system namespace에서 종료·signal 처리 책임이 특별한 첫 process','resource-exhaustion':'CPU·memory·disk·file descriptor 같은 resource가 부족해 기능이 실패하는 상태','scheduler':'실행 가능한 job 중 다음에 CPU를 받을 대상을 고르는 운영체제 구성 요소','systemd':'Linux service와 boot process를 관리하는 init system','temporary-file-replace-strategy':'새 내용을 temporary file에 쓴 뒤 rename으로 기존 file을 교체해 부분 쓰기를 피하는 방식','zsh-bash':'Unix shell인 zsh와 bash의 문법·startup 설정 차이'}
def render(id,tier,term):
 title=term['term_ko']; summary=E[id]+'.'; related=['process','linux'] if id not in {'linux','filesystem'} else ['kernel','directory']
 out=[f'# {title}','','## 한 줄 설명','',summary,'','## 쉽게 설명하면','',f'`{title}`은(는) 실행 중인 program과 operating system의 상태를 관찰할 때 구분해야 하는 개념입니다.','','## 정확한 설명','',summary+' 실제 장애 판단에서는 값의 순간 변화와 지속 상태, process 범위와 system 범위를 나누어 봐야 합니다.']
 if tier=='A': out+=['','## 동작 원리','','할당·참조·해제의 흐름을 따라 memory가 반환되지 않는 지점을 찾고, 사용량 추세와 process 종료 조건을 함께 관찰합니다.']
 out+=['','## 이 미션에서는 왜 필요한가','','M07과 M08에서 command 결과, resource 지표, process 상태를 근거로 장애 원인과 조치를 설명합니다.','','## 코드 예','',f'```bash\n# {title}\nps aux\n```']
 if tier!='C': out+=['','## 주의할 점 / 경계 조건','','한 번의 수치만으로 원인을 단정하지 말고 기간, workload, 다른 resource, log를 함께 확인해야 합니다.']
 out+=['','## 관련 용어','']+[f'- `{x}`' for x in related]
 if tier!='C': out+=['','## 흔한 오해','','운영체제 지표가 높다고 해서 항상 application code 하나가 유일한 원인인 것은 아닙니다.','','## 동료평가 질문','','이 현상을 재현하거나 관찰할 때 어떤 command와 시간 단위의 증거를 남기겠습니까?']
 return '\n'.join(out)+'\n'
def main():
 p=json.loads((R/'data/reviews/content-tier-sprint7.json').read_text());b=next(x for x in p['implementation_batches'] if x['id']=='S7-B05');it={x['term_id']:x for x in p['items']};m=json.loads((R/'data/curated/glossary-master-v0.1.yaml').read_text());by={x['id']:x for x in m['terms']};assert set(b['term_ids'])==set(E) and len(E)==44
 for id in b['term_ids']:(R/'content/terms'/f'{id}.md').write_text(render(id,it[id]['tier'],by[id]),encoding='utf-8');by[id]['content_status']='drafted'
 (R/'data/curated/glossary-master-v0.1.yaml').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print('Wrote 44 S7-B05 term files.')
if __name__=='__main__':main()
