import { describe, expect, it } from 'vitest';
import { guideAsset, guideChapters, guideLink, guidePath, guides } from './missionGuideContent';
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

describe('B2-1 mission configuration stays isolated from B1-1', () => {
  const guide = guides['main-M03'];
  it('loads nine approved chapters and all supporting documents', () => {
    expect(guide.guideChapters).toHaveLength(9);
    expect(Object.values(guide.documents).every(document => document.startsWith('# '))).toBe(true);
    for (const chapter of guide.guideChapters) {
      for (const [, path] of chapter.markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
        expect(guide.guideAsset(path)).toBeTruthy();
        expect(guide.guideAsset(path, path.includes('-wide') ? 'desktop' : true)).toBeTruthy();
        expect(guideAsset(path)).toBeUndefined();
      }
      expect(guide.guideLink(`${chapter.id}.md`)).toBe(`${guide.guidePath}/${chapter.id}`);
    }
    expect(guide.guideLink('../scenario-v1.1.md')).toBe(`${guide.guidePath}?document=scenario`);
    expect(guide.guideLink('../README.md#목차')).toBe(`${guide.guidePath}?document=README#목차`);
    expect(guide.guideLink('../../../terms/generator.md')).toBe('/terms/generator');
    expect(guide.guideAsset('v01-web-components.svg')).toBeUndefined();
  });
});
