// Production adapter copied from the approved da31cb5 storyboard. Preview fixtures are not runtime data.
// Parity tests keep the 4 scenes, 12 messages/captions and diagram states tied to the authored source.
export const b61StoryPath='/missions/main-M11/story';
export const storyTitle='흩어진 데이터가 하나의 답이 되는 과정';
export const storyQuestion='흩어진 데이터는 어떻게 하나의 답이 될까?';
export type DiagramId='erd-story'|'split-story'|'same-structure'|'join-compare';
export type DiagramState='overview'|'read'|'join'|'return'|'one'|'split'|'keys'|'all'|'compare';
export type Screen={id:string;scene:string;message:string;caption:string;diagram?:DiagramId;state?:DiagramState;html?:'flow'|'join-result'|'roles'|'ai-check'};
export const scenes=[
  {
    "id": "01",
    "title": "데이터베이스의 설계도",
    "question": "ERD는 무엇을 보여주는 그림일까?"
  },
  {
    "id": "02",
    "title": "왜 나누고 연결할까?",
    "question": "하나의 표에 전부 넣으면 안 될까?"
  },
  {
    "id": "03",
    "title": "나눈 데이터를 어떻게 사용할까?",
    "question": "서로 다른 테이블에서 원하는 정보를 어떻게 찾을까?"
  },
  {
    "id": "04",
    "title": "그래서 데이터베이스를 배우는 이유",
    "question": "AI가 SQL을 만들어 주는데 왜 구조를 알아야 할까?"
  }
] as const;
export const screens:readonly Screen[]=[
  {
    "id": "S01-1",
    "scene": "01",
    "message": "ERD는 데이터베이스의 설계도다.",
    "caption": "어떤 표가 있고, 표끼리 어떻게 이어지는지를 한 장에 그린다.",
    "diagram": "erd-story",
    "state": "overview"
  },
  {
    "id": "S01-2",
    "scene": "01",
    "message": "상자는 테이블, 선은 관계다.",
    "caption": "선 끝의 막대 두 개는 '반드시 하나', 동그라미와 세 갈래 끝은 '0개 이상 여러 개'.",
    "diagram": "erd-story",
    "state": "read"
  },
  {
    "id": "S01-3",
    "scene": "01",
    "message": "주제는 달라도, 나누고 잇는 설계는 같다.",
    "caption": "내 ERD에서도 표와 선을 찾고, 연결 표가 있다면 왜 있는지 말해 보자.",
    "diagram": "same-structure",
    "state": "all"
  },
  {
    "id": "S02-1",
    "scene": "02",
    "message": "한 표에 모두 넣으면 같은 정보가 반복된다.",
    "caption": "강사 이름 하나가 바뀌어도 여러 줄을 찾아 고쳐야 하고, 하나라도 놓치면 어긋난다.",
    "diagram": "split-story",
    "state": "one"
  },
  {
    "id": "S02-2",
    "scene": "02",
    "message": "정보는 주제별 표에 한 번만 적는다.",
    "caption": "학생은 학생 표에, 수업은 수업 표에. 수강 기록에는 누가 무엇을 듣는지만 남긴다.",
    "diagram": "split-story",
    "state": "split"
  },
  {
    "id": "S02-3",
    "scene": "02",
    "message": "PK로 행을 구분하고, FK로 다른 표를 가리킨다.",
    "caption": "B6-1에서는 ERD의 선 5개가 FOREIGN KEY 선언 5개와 같다.",
    "diagram": "split-story",
    "state": "keys"
  },
  {
    "id": "S03-1",
    "scene": "03",
    "message": "SQL로 원하는 결과를 요청하면, DBMS가 찾아서 표로 돌려준다.",
    "caption": "어떻게 찾을지가 아니라 무엇이 필요한지를 적는다.",
    "html": "flow"
  },
  {
    "id": "S03-2",
    "scene": "03",
    "message": "JOIN은 키를 따라 나뉜 표를 다시 잇는다.",
    "caption": "JOIN은 ON 조건의 값이 같은 행끼리 잇는다. B6-1은 FK = PK를 조건으로 썼다.",
    "html": "join-result",
    "diagram": "erd-story",
    "state": "join"
  },
  {
    "id": "S03-3",
    "scene": "03",
    "message": "INNER는 짝이 있는 행만, LEFT는 왼쪽 표를 모두 남긴다.",
    "caption": "짝이 없는 행이 사라지는지 남는지에 따라 답이 달라진다.",
    "diagram": "join-compare",
    "state": "compare"
  },
  {
    "id": "S04-1",
    "scene": "04",
    "message": "SQL은 요청하는 언어, DBMS는 실행하고 지키는 프로그램이다.",
    "caption": "같은 SQL로 조회·연결·집계·수정을 모두 요청한다.",
    "html": "roles"
  },
  {
    "id": "S04-2",
    "scene": "04",
    "message": "AI가 SQL을 써 줘도, 맞는 답인지는 구조로 판단한다.",
    "caption": "구조를 알면 결과에서 사라진 한 명을 알아챌 수 있다.",
    "html": "ai-check"
  },
  {
    "id": "S04-3",
    "scene": "04",
    "message": "데이터베이스는 정보를 나누어 정리하고, 관계로 연결해, 필요한 답을 찾아내는 구조다.",
    "caption": "내 ERD에서 표 · PK · FK · JOIN 경로를 찾아 설명해 보자.",
    "diagram": "erd-story",
    "state": "return"
  }
];
export const guideChapters=['02-data-modeling','03-keys-relations','06-sql-joins','10-database-overview'] as const;
