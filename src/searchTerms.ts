export type SearchableTerm = {
  id: string;
  termKo: string;
  termEn: string;
  aliases: string[];
  category: string;
  importance: string;
  missionRefs: unknown[];
};

// 분야 하나에 한국어 입력어를 모아 둔 것. 만드는 곳은 scripts/build_field_search.py 다.
export type SearchField = { category: string; labelKo: string; aliases: string[] };

// 이름 일치가 받을 수 있는 가장 높은(=나쁜) 점수는 2 다. 분야 일치는 그보다 크게 둬서
// 이름으로 찾은 용어를 절대 밀어내지 않게 한다. core 보정(-0.2)을 받아도 3.8 이라 안전하다.
const FIELD_SCORE = 4;

/** 질의가 가리키는 분야. alias 와 똑같거나, 두 글자 이상일 때 alias 의 앞부분과 같으면 맞는 것으로 본다. */
export function matchFields(fields: SearchField[], query: string): SearchField[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];
  return fields.filter(field => field.aliases.some(alias => {
    const value = alias.toLowerCase();
    return value === normalized || (normalized.length > 1 && value.startsWith(normalized));
  }));
}

export function searchTerms<T extends SearchableTerm>(terms: T[], query: string, fields: SearchField[] = []): T[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];
  const matchedCategories = new Set(matchFields(fields, query).map(field => field.category));
  return terms.map(term => {
    const values = [term.termKo, term.termEn, ...term.aliases].map(value => value.toLowerCase());
    let score = values.some(value => value === normalized) ? 0 : values.some(value => value.startsWith(normalized)) ? 1 : values.some(value => value.includes(normalized)) ? 2 : 9;
    if (score === 9 && matchedCategories.has(term.category)) score = FIELD_SCORE; // 이름으로는 못 찾았지만 분야가 맞는다
    if (score < 9 && term.importance === 'core') score -= .2;
    return { term, score };
  }).filter(result => result.score < 9).sort((a, b) => a.score - b.score || b.term.missionRefs.length - a.term.missionRefs.length).map(result => result.term);
}
