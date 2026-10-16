import { describe, expect, it } from 'vitest';
import { guideAsset, guideChapters, guideLink, guidePath } from './missionGuideContent';
import glossary from './data/generated/glossary.json';

describe('approved B1-1 source integration', () => {
  it('loads exactly nine complete chapter sources in filename order', () => {
    expect(guideChapters).toHaveLength(9);
    expect(guideChapters.map(item => item.id.slice(0, 2))).toEqual(['01','02','03','04','05','06','07','08','09']);
    for (const chapter of guideChapters) expect(chapter.markdown.startsWith(`# ${chapter.title}`)).toBe(true);
  });
  it('resolves every authored chapter image, chapter link, and canonical term', () => {
    const ids = new Set(glossary.map(term => term.id));
    for (const chapter of guideChapters) {
      const prose = chapter.markdown.replace(/```[\s\S]*?```/g, '');
      for (const [, path] of prose.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) expect(guideAsset(path), path).toBeTruthy();
      for (const [, id] of prose.matchAll(/terms\/([^/]+)\.md/g)) {
        expect(ids.has(id), id).toBe(true);
        expect(guideLink(`../../../terms/${id}.md`)).toBe(`/terms/${id}`);
      }
    }
    expect(guideLink('02-html-semantics.md#heading')).toBe(`${guidePath}/02-html-semantics#heading`);
    expect(guideLink('../README.md#표기-규칙')).toBe(`${guidePath}?document=README#표기-규칙`);
    expect(guideLink('#제목', guideChapters[0].id)).toBe(`${guidePath}/${guideChapters[0].id}#제목`);
  });
});
