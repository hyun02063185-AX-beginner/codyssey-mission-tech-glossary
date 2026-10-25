import candidate from '../../../drafts/b2-1-story-map/scene-08/candidate-map.json';
import type { ComparisonId, LectureArea, RelationId, ReviewLink } from './types';

export const relationIds = ['R09', 'R23', 'R28', 'R37', 'R41'] as const;
export const comparisonIds = ['C13', 'C30'] as const;

/** Explicit projection: no glossary data or v2 sceneIds become v3 navigation. */
function required<T extends { id: string }>(items: readonly T[], id: string): T {
  const item = items.find(value => value.id === id);
  if (!item) throw Error(`Missing candidate-map ID: ${id}`);
  return item;
}
const relations = Object.fromEntries(relationIds.map(id => {
  const { from, to, type, label, scope } = required(candidate.relations, id);
  return [id, { from, to, type, label, scope }];
})) as Record<RelationId, { from: string; to: string; type: string; label: string; scope: string }>;
const comparisons = Object.fromEntries(comparisonIds.map(id => {
  const { left, right, leftText, rightText } = required(candidate.comparisons, id);
  return [id, { left, right, leftText, rightText }];
})) as Record<ComparisonId, { left: string; right: string; leftText: string; rightText: string }>;
const nodeIds = [...new Set([
  ...Object.values(relations).flatMap(r => [r.from, r.to]),
  ...Object.values(comparisons).flatMap(c => [c.left, c.right]),
])];
export const lectureMap = {
  source: 'drafts/b2-1-story-map/scene-08/candidate-map.json',
  relations,
  comparisons,
  nodes: Object.fromEntries(nodeIds.map(id => {
    const { label, area, easy } = required(candidate.nodes, id);
    return [id, { label, area, easy }];
  })),
  areas: Object.fromEntries(candidate.areas.map(({ id, label }) => [id, label])),
};

// Display groupings and review destinations come from v3 Scene 08, never v2 sceneIds.
export const lectureAreas: readonly LectureArea[] = [
  {
    "id": "t-exec",
    "scene": "01",
    "name": "실행과 CLI",
    "say": "명령 한 줄로 프로그램에 일을 부탁하고, 프로그램은 정해 둔 규칙대로 알아듣습니다.",
    "concepts": [
      "CLI",
      "python -m",
      "argparse"
    ],
    "review": {
      "scene": "01",
      "step": "3"
    },
    "originalAreaIds": [
      "area-execution"
    ],
    "originalNodeIds": [
      "cli",
      "python-m",
      "argparse",
      "command-arguments"
    ],
    "originalDeepNodeIds": []
  },
  {
    "id": "t-struct",
    "scene": "02",
    "name": "모듈과 패키지·역할 분리",
    "say": "프로그램의 일을 역할로 나누고, 코드를 모듈과 패키지로 묶어 함께 씁니다.",
    "concepts": [
      "Model·Repository·Service·CLI",
      "모듈",
      "패키지",
      "import"
    ],
    "review": {
      "scene": "02",
      "step": "2"
    },
    "originalAreaIds": [
      "area-structure",
      "area-responsibility"
    ],
    "originalNodeIds": [
      "package",
      "module",
      "import",
      "package-main",
      "entry",
      "cli-layer",
      "service",
      "repository"
    ],
    "originalDeepNodeIds": []
  },
  {
    "id": "t-crud",
    "scene": "03",
    "name": "CRUD·검색·요약",
    "say": "기록을 바꾸는 일, 고르는 일, 계산하는 일을 구분합니다.",
    "concepts": [
      "CRUD",
      "검색",
      "요약"
    ],
    "review": {
      "scene": "03",
      "step": "1"
    },
    "originalAreaIds": [
      "area-storage"
    ],
    "originalNodeIds": [
      "crud",
      "id"
    ],
    "originalDeepNodeIds": []
  },
  {
    "id": "t-store",
    "scene": "04",
    "name": "메모리·파일·저장 형식",
    "say": "실행 중 기록은 메모리에 있고, 남기려면 파일에 저장하며, 형식은 그 모양을 정합니다.",
    "concepts": [
      "메모리",
      "파일 저장",
      "JSONL",
      "CSV"
    ],
    "review": {
      "scene": "04",
      "step": "1"
    },
    "originalAreaIds": [
      "area-storage"
    ],
    "originalNodeIds": [
      "memory",
      "persistence",
      "file-io",
      "jsonl",
      "text-format"
    ],
    "originalDeepNodeIds": []
  },
  {
    "id": "t-gen",
    "scene": "05",
    "name": "Iterator·Generator",
    "say": "Iterable에서 얻은 Iterator가 값을 하나씩 꺼내 주고, Generator는 그 한 종류로서 필요할 때 값을 만들어 건넵니다.",
    "concepts": [
      "Iterable",
      "Iterator",
      "Generator",
      "yield"
    ],
    "review": {
      "scene": "05",
      "step": "iterable"
    },
    "originalAreaIds": [
      "area-iteration"
    ],
    "originalNodeIds": [
      "iterable",
      "iterator",
      "generator",
      "yield",
      "list-collect"
    ],
    "originalDeepNodeIds": [
      "for"
    ]
  },
  {
    "id": "t-deco",
    "scene": "06",
    "name": "Decorator",
    "say": "원래 기능을 감싸 정해 둔 공통 처리를 덧붙입니다.",
    "concepts": [
      "함수 감싸기",
      "Decorator",
      "공통 처리"
    ],
    "review": {
      "scene": "06",
      "step": "deco"
    },
    "originalAreaIds": [
      "area-decoration"
    ],
    "originalNodeIds": [
      "decorator",
      "cross-cutting",
      "exceptions"
    ],
    "originalDeepNodeIds": [
      "wrapper",
      "original"
    ]
  },
  {
    "id": "t-valid",
    "scene": "07",
    "name": "Type Hint·검증",
    "say": "기대하는 형은 표시하고, 실제 값은 변환하고 검증합니다.",
    "concepts": [
      "Type Hint",
      "자료형 변환",
      "값 검증"
    ],
    "review": {
      "scene": "07",
      "step": "1"
    },
    "originalAreaIds": [
      "area-validation",
      "area-execution"
    ],
    "originalNodeIds": [
      "type-hint",
      "contract",
      "validation",
      "argparse"
    ],
    "originalDeepNodeIds": [
      "parameter",
      "argument"
    ]
  }
];

export const relationTypes: readonly { type: string; meaning: string; relations: readonly RelationId[] }[] = [
  {
    "type": "포함",
    "meaning": "한 개념이 다른 개념을 안에 담습니다.",
    "relations": [
      "R09"
    ]
  },
  {
    "type": "종류",
    "meaning": "한 개념이 다른 개념의 한 종류입니다.",
    "relations": [
      "R23",
      "R41"
    ]
  },
  {
    "type": "사용",
    "meaning": "한 개념이 일을 하려고 다른 개념을 씁니다.",
    "relations": [
      "R37"
    ]
  },
  {
    "type": "역할",
    "meaning": "한 개념이 맡는 일이나 뜻을 나타냅니다.",
    "relations": [
      "R28"
    ]
  }
];

export const relationReviews: Partial<Record<RelationId, readonly ReviewLink[]>> = {
  "R09": [
    {
      "target": {
        "scene": "02",
        "step": "12"
      },
      "label": "Scene 02 패키지"
    }
  ],
  "R37": [
    {
      "target": {
        "scene": "04",
        "step": "4"
      },
      "label": "Scene 04 저장 흐름"
    }
  ],
  "R28": [
    {
      "target": {
        "scene": "07",
        "step": "1"
      },
      "label": "Scene 07 Type Hint"
    }
  ]
};

export const comparisonReviews: Record<ComparisonId, readonly ReviewLink[]> = {
  "C30": [
    {
      "target": {
        "scene": "04",
        "step": "6"
      },
      "label": "Scene 04 JSONL"
    },
    {
      "target": {
        "scene": "05",
        "step": "jsonl"
      },
      "label": "Scene 05 JSONL과 Generator"
    }
  ],
  "C13": [
    {
      "target": {
        "scene": "07",
        "step": "4"
      },
      "label": "Scene 07 표시와 검사"
    }
  ]
};

export const lectureTasks: readonly { q: string; areaId: string }[] = [
  {
    "q": "파일에 저장하고 다음에 다시 읽기",
    "areaId": "t-store"
  },
  {
    "q": "명령을 받아 알아듣기",
    "areaId": "t-exec"
  },
  {
    "q": "금액이 0보다 큰 정수인지 확인하기",
    "areaId": "t-valid"
  },
  {
    "q": "기록 추가하기 · 조건으로 검색하기",
    "areaId": "t-crud"
  },
  {
    "q": "문제가 생기면 [오류]·[힌트]로 알리기",
    "areaId": "t-deco"
  },
  {
    "q": "일을 맡을 부분 나누기",
    "areaId": "t-struct"
  },
  {
    "q": "저장된 기록을 하나씩 읽어 처리하기",
    "areaId": "t-gen"
  }
];
