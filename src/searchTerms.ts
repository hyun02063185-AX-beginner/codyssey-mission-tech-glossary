export type SearchableTerm = {
  id: string;
  termKo: string;
  termEn: string;
  aliases: string[];
  importance: string;
  missionRefs: unknown[];
};

export function searchTerms<T extends SearchableTerm>(terms: T[], query: string): T[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];
  return terms.map(term => {
    const values = [term.termKo, term.termEn, ...term.aliases].map(value => value.toLowerCase());
    let score = values.some(value => value === normalized) ? 0 : values.some(value => value.startsWith(normalized)) ? 1 : values.some(value => value.includes(normalized)) ? 2 : 9;
    if (term.importance === 'core') score -= .2;
    return { term, score };
  }).filter(result => result.score < 9).sort((a, b) => a.score - b.score || b.term.missionRefs.length - a.term.missionRefs.length).map(result => result.term);
}
