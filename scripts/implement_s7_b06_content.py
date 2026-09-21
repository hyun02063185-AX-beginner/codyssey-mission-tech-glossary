#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
import sys as _sys; _sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_generation_guard import assert_generation_allowed  # R12 재발 방지
assert_generation_allowed(__file__)

E={'branch-pointer':'Git에서 branch 이름이 가리키는 최신 commit을 가리키는 movable reference','merge-conflict':'같은 변경 위치를 Git이 자동으로 합칠 수 없어 사람이 선택해야 하는 상태','remote':'local repository와 연결된 다른 repository의 이름과 주소','repository':'commit history와 working tree, Git metadata를 보관하는 project 단위','approval':'pull request 변경을 검토한 사람이 병합 가능 여부를 표시하는 review 결정','branch-protection':'main 같은 branch에 review·status check·push 제한을 적용하는 rule','clone':'remote repository의 history와 working tree를 local로 복사하는 Git 명령','code-review':'변경을 병합하기 전에 동료가 정확성·설계·위험을 검토하는 과정','commit':'staging area의 snapshot과 부모 history를 기록하는 Git object','commit-hash':'commit object를 식별하는 content hash','commit-message-convention':'commit 목적과 변경 범위를 일관되게 쓰는 제목·본문 규칙','commit-node':'commit graph에서 부모 commit과 연결된 하나의 history node','contributing-md':'repository에 기여하는 방법과 규칙을 설명하는 문서','feature-branch':'특정 기능 작업을 main에서 분리해 진행하는 branch','github-flow':'짧은 feature branch와 pull request로 main에 자주 병합하는 협업 흐름','github-issue':'작업·bug·논의를 추적하는 repository 기록','main-branch':'배포 가능한 통합 상태를 유지하는 중심 branch','parent-commit':'현재 commit이 이전 history와 연결될 때 가리키는 바로 앞 commit','pull':'remote의 변경을 fetch한 뒤 local branch에 통합하는 Git 명령','pull-request':'branch의 변경을 검토·논의·병합하기 위해 여는 협업 요청','push':'local commit을 remote repository에 전송하는 Git 명령','closing-keyword':'issue 번호와 함께 써 병합 시 issue를 자동 종료하는 keyword','content-addressable-storage':'내용의 hash를 key로 삼아 object를 저장하는 방식','git-commit-amend':'가장 최근 commit의 message 또는 staged snapshot을 바꾸는 명령','git-diff':'두 Git 상태 사이의 line 단위 차이를 보는 명령','git-reset-soft':'HEAD만 이전 commit으로 옮기고 index와 working tree는 유지하는 reset','git-revert':'기존 commit의 반대 변경을 새 commit으로 만드는 명령','git-stash':'working tree 변경을 임시 stack에 보관하는 명령','git-status':'working tree, index, branch의 변경 상태를 요약하는 명령','gitignore':'Git이 untracked file을 기본적으로 무시할 pattern을 적는 설정 file','codeowners':'경로별 review 책임자를 지정하는 CODEOWNERS file','force-push':'remote branch history를 강제로 바꾸는 push 방식','git-config-list':'Git configuration 값을 조회하거나 설정하는 명령','github-collaborator':'repository 권한을 받은 GitHub 사용자','github-organization':'여러 repository와 member를 관리하는 GitHub 계정 단위','interactive-rebase':'commit 순서·message·squash를 편집하며 history를 재작성하는 rebase','line-diff':'추가·삭제 line으로 표현한 text 차이','merge-commit':'두 history tip을 합치며 부모가 둘인 commit','code-ownership':'code 영역의 유지보수 책임과 review 책임을 정하는 운영 방식','commit-history':'repository에 쌓인 commit graph와 변경 기록','conflict':'서로 양립할 수 없는 변경이나 상태가 충돌하는 일반적 상황','head':'현재 checkout된 commit 또는 branch tip을 가리키는 Git reference','rebase':'commit을 다른 base 위에 다시 적용해 history를 재구성하는 작업','semantic-conventional-commits':'변경 의미를 type과 scope로 표현하는 commit message 관례','staging-area-git-add':'다음 commit에 넣을 변경 snapshot을 선택하는 Git index','trunk-based-development':'짧은 branch와 잦은 main 통합을 중시하는 개발 방식'}
def render(id,tier,term):
 title=term['term_ko'];summary=E[id]+'.';related=['git','commit'] if id not in {'commit','repository'} else ['branch','remote']
 out=[f'# {title}','','## 한 줄 설명','',summary,'','## 쉽게 설명하면','',f'`{title}`은(는) 변경을 기록하고 동료와 안전하게 공유하는 Git 작업 흐름의 한 부분입니다.','','## 정확한 설명','',summary+' local history, remote state, review 규칙의 역할을 구분해 사용해야 합니다.']
 if tier=='A':out+=['','## 동작 원리','','변경을 비교하고 branch와 commit graph의 위치를 확인한 뒤, 자동 통합이 안 되는 부분은 의도를 검토해 선택하고 검증한 결과를 새 history로 기록합니다.']
 out+=['','## 이 미션에서는 왜 필요한가','','M04와 M06에서 변경을 안전하게 기록하고 review 가능한 단위로 공유하며 충돌을 복구하는 기준입니다.','','## 코드 예','',f'```bash\n# {title}\ngit status\n```']
 if tier!='C':out+=['','## 주의할 점 / 경계 조건','','history를 바꾸는 명령은 이미 공유된 commit에 영향을 줄 수 있습니다. 실행 전 branch, remote, collaborator와의 합의를 확인해야 합니다.']
 out+=['','## 관련 용어','']+[f'- `{x}`' for x in related]
 if tier!='C':out+=['','## 흔한 오해','','Git 명령이 성공했다고 review·test·배포 기준까지 자동으로 통과한 것은 아닙니다.','','## 동료평가 질문','','이 변경을 공유하기 전에 history, diff, test 결과 중 무엇을 확인하겠습니까?']
 return '\n'.join(out)+'\n'
def main():
 p=json.loads((R/'data/reviews/content-tier-sprint7.json').read_text());b=next(x for x in p['implementation_batches'] if x['id']=='S7-B06');it={x['term_id']:x for x in p['items']};m=json.loads((R/'data/curated/glossary-master-v0.1.yaml').read_text());by={x['id']:x for x in m['terms']};assert set(b['term_ids'])==set(E) and len(E)==46
 for id in b['term_ids']:(R/'content/terms'/f'{id}.md').write_text(render(id,it[id]['tier'],by[id]),encoding='utf-8');by[id]['content_status']='drafted'
 (R/'data/curated/glossary-master-v0.1.yaml').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print('Wrote 46 S7-B06 term files.')
if __name__=='__main__':main()
