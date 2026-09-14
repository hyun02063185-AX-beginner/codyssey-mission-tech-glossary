import { describe, expect, it } from 'vitest';
import { searchTerms } from './searchTerms';

const terms = [
  { id: 'dom', termKo: '문서 객체 모델', termEn: 'DOM', aliases: [], importance: 'core', missionRefs: [] },
  { id: 'fetch', termKo: '가져오기', termEn: 'Fetch API', aliases: [], importance: 'supporting', missionRefs: [] },
];

describe('searchTerms', () => {
  it('does not return a core term when no searchable name matches', () => {
    expect(searchTerms(terms, 'zzzz-no-match')).toEqual([]);
  });

  it('keeps exact and partial matching behavior', () => {
    expect(searchTerms(terms, 'dom').map(term => term.id)).toEqual(['dom']);
    expect(searchTerms(terms, 'fetch').map(term => term.id)).toEqual(['fetch']);
  });
});
