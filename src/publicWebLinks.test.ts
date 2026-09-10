import { describe, expect, it } from 'vitest';
import { buildTechnologyMapUrl, buildTermDetailUrl, PUBLIC_WEB_BASE_URL, resolveTechnologyMap } from './publicWebLinks';
import linkIndex from './data/generated/term-map-links.json';

const index = linkIndex as { terms: Record<string, string[]>; missions: Record<string, string[]> };

describe('public web deep-link contract', () => {
  it('uses the public GitHub Pages base URL', () => {
    expect(PUBLIC_WEB_BASE_URL).toBe('https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/');
  });

  it('builds a canonical term detail route', () => {
    expect(buildTermDetailUrl('fetch-api')).toBe(`${PUBLIC_WEB_BASE_URL}#/terms/fetch-api`);
  });

  it('builds a map route with a term query', () => {
    expect(buildTechnologyMapUrl({ mapId: 'frontend', termId: 'dom' })).toBe(`${PUBLIC_WEB_BASE_URL}#/maps/frontend?term=dom`);
  });

  it('builds a map route with mission and term queries', () => {
    expect(buildTechnologyMapUrl({ mapId: 'frontend', termId: 'dom', missionId: 'main-m01' })).toBe(
      `${PUBLIC_WEB_BASE_URL}#/maps/frontend?mission=main-m01&term=dom`
    );
  });

  it('url-encodes ids defensively', () => {
    expect(buildTermDetailUrl('fake term/id')).toBe(`${PUBLIC_WEB_BASE_URL}#/terms/fake%20term%2Fid`);
  });

  it('resolves a term that has a map', () => {
    expect(resolveTechnologyMap('javascript', undefined, index)).toEqual({ mapId: 'frontend' });
  });

  it('returns null for a term with no map node', () => {
    expect(resolveTechnologyMap('dbms', undefined, index)).toBeNull();
  });

  it('prefers the mission overlay map for a multi-map term', () => {
    const multi = Object.entries(index.terms).find(([, maps]) => maps.length > 1)?.[0];
    expect(multi).toBeTruthy();
    const resolution = resolveTechnologyMap(multi!, undefined, index);
    expect(resolution).not.toBeNull();
    expect(resolution!.mapId).toBe(index.terms[multi!][0]);
  });

  it('keeps main M01 mission context when the term is in the frontend map', () => {
    expect(resolveTechnologyMap('fetch-api', 'main-m01', index)).toEqual({ mapId: 'frontend', missionId: 'main-m01' });
  });

  it('falls back to the primary map when the mission has no overlay with the term', () => {
    const resolution = resolveTechnologyMap('docker', 'main-m01', index);
    expect(resolution).not.toBeNull();
    expect(resolution!.mapId).toBe('devops-infrastructure');
    expect(resolution!.missionId).toBeUndefined();
  });

  it('handles an invalid term id safely (no throw, no map)', () => {
    expect(resolveTechnologyMap('not-a-real-term', 'main-m01', index)).toBeNull();
  });
});
