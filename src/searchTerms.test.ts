import { describe, expect, it } from 'vitest';
import { matchFields, searchTerms } from './searchTerms';
import glossarySource from './data/generated/glossary.json';
import fieldSearchSource from './data/generated/field-search.json';

type Term = { id: string; termKo: string; termEn: string; aliases: string[]; category: string; importance: string; missionRefs: unknown[] };
const real = glossarySource as Term[];
const fields = (fieldSearchSource as { fields: Array<{ category: string; labelKo: string; aliases: string[]; termCount: number }> }).fields;
const field = (category: string) => fields.find(item => item.category === category)!;

const terms: Term[] = [
  { id: 'dom', termKo: '문서 객체 모델', termEn: 'DOM', aliases: [], category: 'Web', importance: 'core', missionRefs: [] },
  { id: 'fetch', termKo: '가져오기', termEn: 'Fetch API', aliases: ['페치'], category: 'Web', importance: 'supporting', missionRefs: [] },
  { id: 'salt', termKo: '솔트', termEn: 'Salt', aliases: [], category: 'Security', importance: 'core', missionRefs: [] },
  { id: 'hash', termKo: '해시', termEn: 'Hash', aliases: [], category: 'Security', importance: 'supporting', missionRefs: [] },
];
const web = [{ category: 'Web', labelKo: '웹', aliases: ['웹', '웹 개발', '프론트엔드'] }];
const security = [{ category: 'Security', labelKo: '보안', aliases: ['보안', '시큐리티', '암호화'] }];

describe('searchTerms — 이름 검색 (기존 동작)', () => {
  it('이름이 맞지 않으면 core 라도 돌려주지 않는다', () => {
    expect(searchTerms(terms, 'zzzz-no-match')).toEqual([]);
  });

  it('완전 일치와 부분 일치를 유지한다', () => {
    expect(searchTerms(terms, 'dom').map(term => term.id)).toEqual(['dom']);
    expect(searchTerms(terms, 'fetch').map(term => term.id)).toEqual(['fetch']);
  });

  it('별칭으로도 찾는다', () => {
    expect(searchTerms(terms, '페치').map(term => term.id)).toEqual(['fetch']);
  });

  it('분야 데이터를 넘기지 않으면 예전과 똑같이 동작한다', () => {
    expect(searchTerms(terms, '보안')).toEqual([]);
    expect(searchTerms(terms, 'dom', [])).toEqual(searchTerms(terms, 'dom'));
  });
});

describe('matchFields', () => {
  it('alias 와 완전히 같으면 걸린다 — 한 글자도 된다', () => {
    expect(matchFields(web, '웹').map(f => f.category)).toEqual(['Web']);
  });

  it('두 글자 이상이면 alias 앞부분만 같아도 걸린다', () => {
    expect(matchFields(security, '암호').map(f => f.category)).toEqual(['Security']);
  });

  it('한 글자로는 앞부분 일치를 허용하지 않는다', () => {
    expect(matchFields(security, '보')).toEqual([]);
    expect(matchFields(web, '프')).toEqual([]);
  });

  it('빈 질의와 공백 질의는 아무 분야도 가리키지 않는다', () => {
    expect(matchFields(web, '')).toEqual([]);
    expect(matchFields(web, '   ')).toEqual([]);
  });

  it('상관없는 분야는 걸리지 않는다', () => {
    expect(matchFields([...web, ...security], '보안').map(f => f.category)).toEqual(['Security']);
  });
});

describe('searchTerms — 분야 검색', () => {
  it('이름에 없는 한국어 분야어로 그 분야의 용어를 찾는다', () => {
    expect(searchTerms(terms, '보안', security).map(term => term.id)).toEqual(['salt', 'hash']);
  });

  it('상관없는 분야의 용어는 섞이지 않는다', () => {
    const result = searchTerms(terms, '보안', [...web, ...security]);
    expect(result.every(term => term.category === 'Security')).toBe(true);
  });

  it('분야가 걸리지 않으면 결과가 늘지 않는다', () => {
    expect(searchTerms(terms, 'zzzz-no-match', [...web, ...security])).toEqual([]);
  });

  it('빈 질의는 분야를 넘겨도 아무것도 돌려주지 않는다', () => {
    expect(searchTerms(terms, '', security)).toEqual([]);
    expect(searchTerms(terms, '   ', security)).toEqual([]);
  });

  it('같은 결과를 반복해서 돌려준다 (결정적)', () => {
    const once = searchTerms(terms, '보안', security).map(term => term.id);
    const twice = searchTerms(terms, '보안', security).map(term => term.id);
    expect(once).toEqual(twice);
  });
});

describe('searchTerms — 순위: 이름이 분야를 이긴다', () => {
  const named: Term[] = [
    ...terms,
    { id: 'security-header', termKo: '보안 헤더', termEn: 'Security Header', aliases: [], category: 'Web', importance: 'supporting', missionRefs: [] },
  ];

  it('이름이 맞는 용어가 분야로만 걸린 용어보다 앞에 온다', () => {
    const result = searchTerms(named, '보안', security).map(term => term.id);
    expect(result[0]).toBe('security-header');
    expect(result.slice(1)).toEqual(['salt', 'hash']);
  });

  it('분야를 더해도 이름 일치들의 상대 순서는 그대로다', () => {
    const before = searchTerms(named, '보안').map(term => term.id);
    const after = searchTerms(named, '보안', security).map(term => term.id);
    expect(after.slice(0, before.length)).toEqual(before);
  });
});

describe('실제 사전 데이터', () => {
  const ids = (query: string) => searchTerms(real, query, fields).map(term => term.id);

  it('한국어 분야어가 그 분야의 용어를 모두 데려온다', () => {
    const cases: Array<[string, string]> = [
      ['보안', 'Security'], ['운영체제', 'Linux / OS'], ['알고리즘', 'Algorithms / Data Structures'],
      ['데이터베이스', 'Database'], ['웹', 'Web'], ['네트워크', 'Network'],
      ['인공지능', 'AI / Hardware'], ['클라우드', 'Server / Infrastructure'],
    ];
    for (const [query, category] of cases) {
      const result = searchTerms(real, query, fields);
      const found = result.filter(term => term.category === category).length;
      expect(found, `${query} → ${category}`).toBe(field(category).termCount);
    }
  });

  it('감사에서 0건이던 질의가 더 이상 0건이 아니다', () => {
    // Product Completion Audit §F-1 에서 실제로 0건이었던 것들이다.
    for (const query of ['보안', '운영체제', '알고리즘', '클라우드', '리눅스', '배포', '자료구조', '프론트엔드']) {
      expect(searchTerms(real, query).length, `${query} (분야 없이)`).toBe(0);
      expect(searchTerms(real, query, fields).length, `${query} (분야 포함)`).toBeGreaterThan(0);
    }
  });

  it('분야를 더해서 결과가 줄어드는 질의는 없다', () => {
    for (const query of ['보안', 'API', 'HTTP', '데이터베이스', '웹', 'AI', '컨테이너', 'JSON', 'a', '가']) {
      expect(searchTerms(real, query, fields).length, query).toBeGreaterThanOrEqual(searchTerms(real, query).length);
    }
  });

  it('기존 용어 검색이 그대로다 — 결과도 순서도', () => {
    for (const query of ['API', 'HTTP', 'Redis', 'Generator', 'Authentication', 'JSON', 'DOM', 'useState']) {
      const before = searchTerms(real, query).map(term => term.id);
      const after = searchTerms(real, query, fields).map(term => term.id);
      expect(after.slice(0, before.length), query).toEqual(before);
    }
  });

  it('이름이 분야어와 겹쳐도 이름 일치가 먼저 나온다', () => {
    const result = ids('데이터베이스');
    const named = searchTerms(real, '데이터베이스').map(term => term.id);
    expect(named.length).toBeGreaterThan(0);
    expect(result.slice(0, named.length)).toEqual(named);
  });

  it('빈 질의는 아무것도 돌려주지 않는다', () => {
    expect(searchTerms(real, '', fields)).toEqual([]);
    expect(searchTerms(real, '  ', fields)).toEqual([]);
  });

  it('없는 말은 정직하게 0건이다', () => {
    expect(ids('존재하지않는임의용어')).toEqual([]);
    expect(matchFields(fields, '존재하지않는임의용어')).toEqual([]);
  });

  it('분야 라벨이 glossary 의 category 를 하나도 빠짐없이 덮는다', () => {
    expect(new Set(fields.map(item => item.category))).toEqual(new Set(real.map(term => term.category)));
  });
});
