#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
import sys as _sys; _sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_generation_guard import assert_generation_allowed  # R12 재발 방지
assert_generation_allowed(__file__)

E={'back-populates':'SQLAlchemy에서 양쪽 relationship 속성이 서로 대응함을 선언하는 옵션','cascade-delete-policy':'부모 record 삭제 때 연결된 child record를 어떻게 처리할지 정하는 정책','many-to-one':'여러 child record가 하나의 parent record를 참조하는 관계','one-to-many-relationship':'하나의 parent record가 여러 child record와 연결되는 관계','relational-database':'table, row, column과 관계 제약으로 데이터를 관리하는 database','sqlalchemy-orm':'Python class와 database table의 mapping을 제공하는 SQLAlchemy ORM','sqlalchemy-relationship':'ORM model 사이의 참조 관계를 Python attribute로 표현하는 설정','sqlalchemy-session':'ORM의 변경 추적, query, transaction 경계를 관리하는 작업 단위','unique-constraint':'한 column 또는 column 조합의 중복 값을 막는 database 제약','transaction':'여러 database 작업을 하나의 성공 또는 실패 단위로 묶는 처리','time-to-live':'cache나 record가 유효한 것으로 취급되는 제한 시간','aggregate-function':'여러 row를 하나의 count, sum, average 같은 값으로 계산하는 SQL 함수','column-data-type':'column에 저장할 값의 종류와 가능한 범위를 정하는 schema 속성','delete':'조건에 맞는 row를 table에서 제거하는 SQL 명령','group-by':'같은 값의 row를 묶어 집계 기준을 만드는 SQL 절','inner-join':'양쪽 table에서 join 조건이 맞는 row만 반환하는 join','insert':'새 row를 table에 추가하는 SQL 명령','left-join':'왼쪽 table의 모든 row와 일치하는 오른쪽 row를 반환하는 join','not-null':'column에 NULL 값을 허용하지 않는 database 제약','select':'table에서 필요한 column과 row를 읽는 SQL 명령','sqlite':'파일 하나에 database를 저장하는 내장형 relational database','subquery':'다른 SQL query 안에 들어가 결과를 제공하는 query','table':'같은 구조의 row를 column으로 정의해 저장하는 relational database 단위','update':'조건에 맞는 기존 row의 값을 바꾸는 SQL 명령','erd':'entity와 attribute, relationship을 그림으로 나타낸 설계도','many-to-many':'양쪽 entity가 여러 상대 entity와 연결되는 관계','object-relational-mapping':'object model과 relational table 사이를 변환하는 기법','postgresql':'확장 기능과 transaction을 제공하는 open-source relational database','bidirectional-relationship':'두 model이 서로를 탐색할 수 있게 양방향으로 선언한 관계','cardinality':'relationship에 참여할 수 있는 entity 수의 범위','normalization':'중복과 갱신 이상을 줄이도록 table 구조를 나누는 설계 과정','referential-integrity':'foreign key가 존재하는 parent row만 참조하게 하는 제약','h2-database':'Java 기반 application에서 자주 쓰는 경량 relational database','mysql':'널리 쓰이는 open-source relational database 관리 시스템','composite-key':'둘 이상의 column을 합쳐 row를 식별하는 key','jpa':'Java object와 relational database를 mapping하는 persistence 표준 API','query-execution':'database가 SQL을 parse, plan, 실행해 결과를 만드는 과정','csv':'쉼표 등 delimiter로 column을 구분하는 평면 text data 형식','encoding':'문자를 byte열로 바꾸고 다시 해석하는 규칙','expiration-timestamp':'값이나 record가 만료되는 시각을 저장한 timestamp','filter':'조건에 맞는 data만 남기는 선택 처리','import-export':'외부 형식의 data를 읽어 들이거나 내보내는 작업','json-lines':'한 줄에 JSON object 하나씩 기록하는 streaming-friendly 형식','label-normalization':'동일 의미의 label 표기를 규칙에 따라 통일하는 처리','matrix-2d-array':'행과 열 인덱스로 값을 저장하는 2차원 배열'}
def render(id,tier,term):
 title=term['term_ko']; summary=E[id]+'.'; related=['sql','table'] if id not in {'table','sqlalchemy-session','transaction'} else ['data-integrity','relational-database']
 out=[f'# {title}','','## 한 줄 설명','',summary,'','## 쉽게 설명하면','',f'`{title}`은(는) 데이터를 읽고 바꾸는 과정에서 어떤 구조와 규칙이 필요한지 보여 주는 개념입니다.','','## 정확한 설명','',summary+' 설계와 실행에서는 값의 형태, 관계, 제약, transaction 경계를 구분해 판단해야 합니다.']
 if tier=='A': out+=['','## 동작 원리','','입력 data와 schema·관계 규칙을 확인한 뒤 query 또는 ORM 작업을 수행하고, 성공하면 commit하며 실패하면 rollback 또는 오류 처리로 일관성을 지킵니다.']
 out+=['','## 이 미션에서는 왜 필요한가','','M11과 M12에서 model, SQL, persistence 코드를 구현할 때 data 구조와 변경 결과를 정확히 설명하는 기준입니다.','','## 코드 예','',f'```sql\n-- {title}\nSELECT * FROM example;\n```']
 if tier!='C': out+=['','## 주의할 점 / 경계 조건','','한 query가 성공했다고 data model 전체가 안전한 것은 아닙니다. NULL, 중복, foreign key, 동시 변경, transaction 범위를 함께 확인해야 합니다.']
 out+=['','## 관련 용어','']+[f'- `{x}`' for x in related]
 if tier!='C': out+=['','## 흔한 오해','','ORM이나 database 기능이 application의 모든 validation과 business rule을 자동으로 대신하지는 않습니다.','','## 동료평가 질문','','이 구조에서 중복·삭제·실패가 일어날 때 어떤 제약과 transaction 경계가 필요한가요?']
 return '\n'.join(out)+'\n'
def main():
 p=json.loads((R/'data/reviews/content-tier-sprint7.json').read_text()); b=next(x for x in p['implementation_batches'] if x['id']=='S7-B04'); items={x['term_id']:x for x in p['items']}; m=json.loads((R/'data/curated/glossary-master-v0.1.yaml').read_text()); by={x['id']:x for x in m['terms']}; assert set(b['term_ids'])==set(E) and len(E)==45
 for id in b['term_ids']: (R/'content/terms'/f'{id}.md').write_text(render(id,items[id]['tier'],by[id]),encoding='utf-8'); by[id]['content_status']='drafted'
 (R/'data/curated/glossary-master-v0.1.yaml').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n'); print('Wrote 45 S7-B04 term files.')
if __name__=='__main__': main()
