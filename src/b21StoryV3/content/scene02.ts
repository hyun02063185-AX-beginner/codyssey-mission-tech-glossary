// Screen copy of the approved v3.7 preview; storyboard remains the source.
import type { TeachingScene } from './types';

export const scene02: TeachingScene = {
  "id": "02",
  "title": "역할을 나누고 파일로 묶기",
  "question": "프로그램은 왜 역할을 나누고 여러 파일로 만들까?",
  "ctx": "Scene 02",
  "addressing": "number",
  "home": "roles",
  "steps": [
    {
      "id": "needs",
      "mode": "needs",
      "home": "needs",
      "say": "부탁 하나를 처리할 때에도 프로그램은 여러 종류의 일을 해야 합니다.",
      "title": "부탁 하나, 여러 종류의 일",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“앞 장면에서 todo에게 ‘목록을 다섯 개 보여 줘’라고 부탁했죠. 이 부탁 하나를 들어주려면 프로그램은 무엇을 해야 할까요?” (학습자 답을 듣고 말풍선을 하나씩 가리키며) “할 일 기록이 어떤 모양인지 알아야 하고, 저장해 둔 기록을 꺼내 와야 하고, 다섯 개를 골라야 하고, 결과를 화면에 보여 줘야 합니다. 부탁은 하나인데 일은 여러 종류예요.”"
        ]
      }
    },
    {
      "id": "roles",
      "mode": "roles",
      "sel": null,
      "say": "이 일들은 네 가지 역할로 나누어 볼 수 있습니다.",
      "title": "네 가지 역할",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“이 네 가지 일은 성격이 서로 다릅니다. 그래서 프로그램을 만들 때 이것을 네 가지 역할로 나누어 생각하곤 해요. 하나씩 이름을 붙여 보겠습니다. 이 그림은 순서가 아니라 ‘누가 무엇을 맡는가’를 나타냅니다.”"
        ]
      }
    },
    {
      "id": "model",
      "mode": "roles",
      "sel": "model",
      "say": "기록 하나가 어떤 항목으로 이루어지는지, 곧 기록의 모양을 정하는 부분을 Model이라고 합니다.",
      "title": "Model",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“할 일 하나는 ‘내용’과 ‘완료했는지’로 이루어져 있다고 정해 둡시다. 이렇게 기록이 어떤 항목으로 이루어지는지, 기록의 모양을 정하는 부분을 Model이라고 부릅니다.”"
        ]
      }
    },
    {
      "id": "repo",
      "mode": "roles",
      "sel": "repo",
      "say": "기록을 파일에서 읽어 오고 저장하는 부분을 Repository라고 합니다.",
      "title": "Repository",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“기록은 프로그램을 꺼도 남아 있어야 하니까 어딘가에 저장해야 합니다. 저장해 둔 기록을 읽어 오고 새 기록을 저장하는 일을 맡는 부분이 Repository예요. 우리말로 ‘저장소’라고도 합니다.”"
        ]
      }
    },
    {
      "id": "service",
      "mode": "roles",
      "sel": "service",
      "say": "‘최대 5개 고르기’처럼 요청한 일을 처리하는 부분을 Service라고 합니다.",
      "title": "Service",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“꺼내 온 기록 중에서 다섯 개를 고르는 것처럼, 사용자가 요청한 일을 실제로 처리하는 부분이 Service입니다.”"
        ]
      }
    },
    {
      "id": "cli",
      "mode": "roles",
      "sel": "cli",
      "say": "명령을 받아 알아듣고 결과를 보여 주는 부분을 CLI라고 합니다. Scene 01의 argparse는 이 부분에서 쓰입니다.",
      "title": "CLI",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“마지막은 명령을 받고 결과를 보여 주는 부분, CLI입니다. 앞 장면에서 CLI는 ‘글자로 부탁하는 방법’이었죠. 여기서는 그렇게 들어온 명령을 받아 알아듣고, 처리한 결과를 화면에 보여 주는 프로그램 안의 부분을 말합니다. 앞에서 본 argparse도 바로 이 부분에서 쓰여요.”"
        ]
      }
    },
    {
      "id": "change",
      "mode": "change",
      "sit": null,
      "home": "change",
      "say": "역할을 나누어 두면 무언가를 바꿀 때 어디부터 살펴볼지 찾기 쉽습니다.",
      "title": "바꿀 때 먼저 볼 곳",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“왜 이렇게 나눌까요? 저장하는 파일 형식을 바꾸고 싶다면 어디부터 볼까요?” (답을 들은 뒤 다음 단계)"
        ]
      }
    },
    {
      "id": "storage",
      "mode": "change",
      "sit": "storage",
      "home": "change",
      "say": "파일 형식을 바꾸고 싶다면, 기록을 읽고 저장하는 Repository부터 살펴봅니다.",
      "title": "저장 형식을 바꾼다면",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "(답: Repository) “그럼 목록을 표 모양으로 보여 주고 싶다면요?”"
        ]
      }
    },
    {
      "id": "display",
      "mode": "change",
      "sit": "display",
      "home": "change",
      "say": "목록을 표 모양으로 보여 주고 싶다면, 결과를 보여 주는 CLI부터 살펴봅니다.",
      "title": "보여 주는 모양을 바꾼다면",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "(답: CLI) “이렇게 역할이 나뉘어 있으면 무엇을 바꿀 때 어디부터 보면 될지 찾기 쉽습니다. ‘거기만 고치면 끝’이라는 뜻은 아니고, ‘어디서부터 시작할지’가 분명해진다는 뜻이에요.”"
        ]
      }
    },
    {
      "id": "files",
      "mode": "files",
      "hl": null,
      "home": "files",
      "say": "역할에 따라 코드를 여러 파일로 나눌 수 있습니다.",
      "title": "역할을 파일로",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“역할을 나눴다면, 코드도 역할에 따라 여러 파일에 나누어 담을 수 있습니다. 같은 자리에 파일 이름이 붙은 것을 보세요. 기록의 모양은 models.py, 읽고 저장하기는 repository.py, 이런 식입니다. 파일 이름은 만드는 사람이 정하는 것이지 꼭 이렇게 지어야 하는 규칙은 아닙니다.”"
        ]
      }
    },
    {
      "id": "module",
      "mode": "files",
      "hl": "module",
      "home": "files",
      "say": "Python 코드를 담은 파일 하나를 모듈이라고 부릅니다.",
      "title": "모듈",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“이렇게 Python 코드를 담은 파일 하나를 모듈이라고 부릅니다. models.py도 모듈, cli.py도 모듈이에요.” (다른 파일을 눌러도 같은 설명이 적용됩니다.)"
        ]
      }
    },
    {
      "id": "package",
      "mode": "files",
      "hl": "package",
      "home": "files",
      "say": "관련 있는 모듈을 하나의 이름으로 묶은 것을 패키지라고 부릅니다. 여기서는 todo가 패키지입니다.",
      "title": "패키지",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“관련 있는 모듈을 하나의 이름 아래에 묶은 것을 패키지라고 합니다. 여기서는 todo라는 폴더가 네 모듈을 묶고 있으니 todo가 패키지예요. 파일 하나가 모듈, 그 묶음이 패키지입니다.”"
        ]
      }
    },
    {
      "id": "import",
      "mode": "import",
      "home": "files",
      "say": "import를 쓰면 한 모듈에서 다른 모듈의 기능을 가져와 함께 쓸 수 있습니다.",
      "title": "import",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“파일을 나눴으니 서로 도와야겠죠. 예를 들어 cli.py가 목록을 고르는 일을 services.py에 맡기려면, services.py의 기능을 가져와야 합니다. 이때 쓰는 것이 import예요. import는 ‘다른 모듈의 기능을 가져다 쓰겠다’는 표시입니다. 이 선은 가져다 쓰는 관계이지 실행되는 순서가 아닙니다.”"
        ]
      }
    },
    {
      "id": "main",
      "mode": "main",
      "home": "files",
      "say": "python -m todo처럼 패키지를 실행하면, Python은 그 패키지의 __main__.py에서 시작합니다.",
      "title": "__main__.py에서 시작",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“이제 앞 장면의 명령으로 돌아가 봅시다. python -m todo를 입력하면 Python은 todo 패키지를 찾고, 그 안의 __main__.py라는 파일에서 시작합니다. 패키지를 실행할 때의 시작 파일이에요. 이 예시에서는 거기서 CLI 부분으로 일을 넘기고, CLI 부분이 list --limit 5를 받아 알아듣습니다.”"
        ]
      }
    },
    {
      "id": "ledger",
      "mode": "ledger",
      "home": "ledger",
      "say": "실제 용돈 기입장 프로그램도 같은 네 역할로 파일을 나누었고, 필요한 파일을 더 두기도 합니다.",
      "title": "실제 사례 · ledger",
      "figure": "s2",
      "example": "ledger",
      "real": true,
      "instructor": {
        "script": [
          "“이건 가상의 예였는데, 실제 프로그램도 그럴까요? 용돈 기입장 프로그램 ledger를 보면 같은 자리에 models.py, repository.py, services.py, cli.py가 있고, __main__.py도 있어서 python -m ledger로 실행합니다. 그런데 옆을 보면 errors.py, validators.py처럼 다른 파일도 있죠. 실제 프로젝트는 같은 네 역할을 기준으로 하면서도, 필요한 파일을 더 두기도 합니다.”"
        ]
      }
    },
    {
      "id": "check",
      "kind": "check",
      "say": "설명을 모두 마쳤습니다. 답을 보기 전에 먼저 말로 답해 봅시다.",
      "title": "이해 확인",
      "figure": "check",
      "example": "fictional-todo",
      "questions": [
        {
          "kind": "기본 · 역할",
          "q": "기록을 파일에서 읽어 오고 저장하는 일은 네 역할 중 무엇인가요?"
        },
        {
          "kind": "적용 · 새 상황",
          "q": "목록을 고를 때 완료한 일은 빼도록 바꾸고 싶습니다. 어느 역할부터 살펴볼까요?"
        },
        {
          "kind": "기본 · 모듈·패키지",
          "q": "모듈과 패키지 중, 여러 모듈을 묶은 것은 무엇인가요?"
        },
        {
          "kind": "연결 · Scene 01",
          "q": "python -m todo list --limit 5를 실행하면 todo 패키지의 어느 파일에서 시작하나요? list --limit 5는 어느 역할이 받나요?"
        }
      ],
      "reveal": {
        "answers": [
          "Repository",
          "Service — 무엇을 고를지는 요청한 일을 처리하는 기준이기 때문",
          "패키지",
          "__main__.py에서 시작 / CLI가 받음"
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "기록을 파일에서 읽어 오고 저장하는 일은 네 역할 중 무엇인가요?",
            "a": "Repository",
            "miss": "Model이라고 답함 → “Model은 기록의 ‘모양’을 정하고, 읽고 저장하는 일은 Repository가 맡았죠.”"
          },
          {
            "q": "목록을 고를 때 완료한 일은 빼도록 바꾸고 싶습니다. 어느 역할부터 살펴볼까요?",
            "a": "Service — 무엇을 고를지는 요청한 일을 처리하는 기준이기 때문",
            "miss": "CLI라고 답함 → “보여 주는 모양이 아니라 고르는 기준이 바뀌는 거예요.”"
          },
          {
            "q": "모듈과 패키지 중, 여러 모듈을 묶은 것은 무엇인가요?",
            "a": "패키지",
            "miss": "반대로 답함 → F4에서 파일 한 장과 폴더 경계를 번갈아 가리킴"
          },
          {
            "q": "python -m todo list --limit 5를 실행하면 todo 패키지의 어느 파일에서 시작하나요? list --limit 5는 어느 역할이 받나요?",
            "a": "__main__.py에서 시작 / CLI가 받음",
            "miss": "cli.py에서 시작한다고 답함 → F6을 다시 가리키며 “시작은 __main__.py, 거기서 CLI 부분으로 넘어갑니다.”"
          }
        ]
      }
    },
    {
      "id": "summary",
      "mode": "summary",
      "home": "roles",
      "say": "프로그램의 일을 기록의 모양·읽고 저장하기·요청 처리·명령과 결과 보여 주기로 나누고, 역할별 코드를 모듈로, 관련 모듈을 패키지로 묶어 import로 함께 사용합니다.",
      "title": "정리",
      "figure": "s2",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "한 문장 정리를 함께 읽고, 다음 장면(Scene 03 기록 추가·조회·수정·삭제·검색·요약)으로 넘어갑니다."
        ]
      },
      "next": {
        "question": "Service가 처리하는 ‘요청한 일’에는 어떤 종류가 있을까요?",
        "target": {
          "scene": "03",
          "step": "1"
        }
      }
    }
  ],
  "instructor": {
    "notes": [
      "<b>설계 선택 (프로젝트마다 다름):</b> 역할을 네 가지로 나누기, 역할 이름, 파일 이름(<code>models.py</code> 등), 역할 하나를 파일 하나에 담기.",
      "<b>Python 규칙:</b> <code>.py</code> 파일은 모듈로 import할 수 있다, 모듈을 패키지로 묶을 수 있다, import로 다른 모듈의 이름·기능을 가져온다, <code>python -m 패키지</code>는 그 패키지의 <code>__main__.py</code>를 실행한다.",
      "역할과 파일은 일대일 규칙이 아니다. 작은 프로그램은 파일 하나에 모두 둘 수도 있고, 한 역할을 여러 파일로 나눌 수도 있다.",
      "‘먼저 볼 곳’은 ‘거기만 고치면 된다’가 아니다. 실제 ledger에서도 CSV 가져오기·내보내기 처리는 <code>services.py</code>에 있다.",
      "역할 그림에는 순서를 넣지 않았다. 실제로는 CLI가 명령을 받아 Service에 넘기는 처리 흐름이 있지만, 이 장면에서는 흐름을 추적하지 않는다.",
      "<b>CLI의 두 뜻:</b> Scene 01의 CLI는 ‘글자로 부탁하는 조작 방식’, Scene 02의 CLI는 ‘그렇게 들어온 명령을 받고 결과를 보여 주는 프로그램의 부분’이다.",
      "<b>Model과 클래스:</b> 실제 ledger의 Model은 클래스로 구현되어 있다. 이 장면에서는 클래스 문법을 다루지 않는다. 공식 미션의 ‘클래스·모듈 구조화’ 요구는 실제 구현과 검증으로 별도 확인한다.",
      "<b>모듈의 범위:</b> ‘코드 파일 하나 = 모듈’은 입문용 설명이다. 표준 라이브러리 모듈, 내장·확장 모듈도 있다.",
      "<b>패키지와 <code>__init__.py</code>:</b> 일반 패키지에는 <code>__init__.py</code>가 있지만 namespace package처럼 없는 경우도 있다. 모든 패키지가 <code>__main__.py</code>를 가져 실행 가능한 것은 아니다.",
      "<b>import와 호출:</b> import는 가져오는 것이고, 가져온 기능을 실제로 실행(호출)하는 것과 구분된다. import 선은 실행 순서가 아니다.",
      "<b>todo와 ledger:</b> 실제 사례 단계만 실제 ledger(<code>d14e812</code>)다. 다른 단계에서 ledger 파일을 섞지 않는다."
    ],
    "deep": [
      "<code>__init__.py</code> — 일반 패키지의 초기화 파일. 패키지를 import할 때 먼저 실행된다. ledger의 것은 설명 한 줄뿐이다.",
      "import의 두 형태 — <code>import 모듈</code>과 <code>from 모듈 import 이름</code>",
      "표준 라이브러리 모듈 — argparse, json, csv도 모듈이다. 내가 만든 모듈과 같은 방식으로 import한다.",
      "보조 진입점 — ledger의 <code>main.py</code>처럼 <code>python main.py</code>로도 실행할 수 있게 하는 방식과 <code>python -m ledger</code>의 차이",
      "역할 사이 의존 방향 — 설계 문서의 의도와 실제 import가 다를 수 있다. 의존도 분석은 기본 강의에서 다루지 않는다.",
      "다른 구조 사례 — 파일 하나짜리 프로그램, 역할을 하위 폴더로 나누는 프로그램",
      "실제 사례 대조 — ledger <code>d14e812</code>: models.py 기록 구조, repository.py JSONL 읽기·저장, services.py 업무 처리(CSV 포함), cli.py argparse·입출력·형식화, __main__.py <code>python -m ledger</code> 진입점"
    ]
  },
  "source": {
    "storyboard": "drafts/b2-1-story-map/v3/scene-02/storyboard.md",
    "sha256": "8b0d3b2fd86a32a3c49d5f3d6c242e70be1dc419988ec3f5de19b97fb176c684"
  }
};
