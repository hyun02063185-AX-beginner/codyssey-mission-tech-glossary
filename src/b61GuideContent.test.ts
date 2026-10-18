import { describe, expect, it } from 'vitest';
import { b61GuideAsset, b61GuideChapters, b61GuideLink, b61GuidePath } from './b61GuideContent';

describe('B6-1 guide integration', () => {
  it('loads all ten chapters and resolves their authored images and local links', () => {
    expect(b61GuideChapters).toHaveLength(10);
    expect(b61GuideChapters.map(chapter => chapter.id.slice(0, 2))).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']);
    for (const chapter of b61GuideChapters) {
      const prose = chapter.markdown.replace(/```[\s\S]*?```/g, '');
      for (const [, path] of prose.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) expect(b61GuideAsset(path), path).toBeTruthy();
      for (const [, path] of prose.matchAll(/(?<!!)\[[^\]]*\]\(([^)]+)\)/g)) {
        if (/^https?:/.test(path)) continue;
        expect(b61GuideLink(path, chapter.id), `${chapter.id}: ${path}`).toBeTruthy();
      }
    }
    expect(b61GuideLink('09-update-delete.md', b61GuideChapters[9].id)).toBe(`${b61GuidePath}/09-update-delete`);
    expect(b61GuideLink('../README.md#표기-규칙')).toBe(`${b61GuidePath}?document=README#표기-규칙`);
    expect(b61GuideLink('../../../terms/sql.md')).toBe('/terms/sql');
  });
});
