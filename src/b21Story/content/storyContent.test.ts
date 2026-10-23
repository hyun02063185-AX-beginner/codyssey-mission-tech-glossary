import { beforeAll, describe, expect, it } from 'vitest';
import { parseStory, parseMarkdown, headingsOf, textOf, referencesOf, codeFromSource } from './parseStory';
import { loadStoryManifest, loadStory, validateCatalog, verifyTextIntegrity } from './storyLoader';
import { sceneOrder, storyDefinition, storyManifest, validateManifest } from './storyManifest';
import type { LoadedStory, StoryDefinition } from './storyTypes';
const sourceFiles = import.meta.glob<string>('../../../drafts/b2-1-story-map/scene-*/script.md', { query: '?raw', import: 'default', eager: true });
const svgFiles = import.meta.glob<string>('../../../drafts/b2-1-story-map/scene-*/*-{desktop,mobile}.svg', { query: '?raw', import: 'default', eager: true });
const localFiles = import.meta.glob(['../../../drafts/b2-1-story-map/**/*', '../../../content/terms/*.md', '../../../docs/mission-guides/*.md'], { query: '?url', import: 'default' });
const raw = (definition: StoryDefinition) => sourceFiles['../../../' + definition.sourcePath];
let stories: LoadedStory[];
beforeAll(async () => { stories = await loadStoryManifest(); });
describe('B21 private content foundation', () => {
  it('loads exactly nine ordered manuscripts with explicit 03-A/03-B neighbours', () => {
    expect(stories.map(s => s.id)).toEqual([...sceneOrder]);
    stories.forEach((story, i) => {
      expect(story.position).toBe(i + 1);
      expect(story.previous).toBe(sceneOrder[i - 1] ?? null);
      expect(story.next).toBe(sceneOrder[i + 1] ?? null);
      expect(story.title.length).toBeGreaterThan(5);
      expect(story.question.length).toBeGreaterThan(5);
    });
  });
  it.each(sceneOrder)('%s preserves all four areas, activities, code and citations', id => {
    const story = stories.find(s => s.id === id)!;
    for (const area of Object.values(story.areas)) expect(area.markdown.trim()).not.toBe('');
    expect(story.activities.length).toBeGreaterThan(0);
    expect(story.references.length).toBeGreaterThan(0);
    expect(story.activities.every(a => story.areas.learner.markdown.includes(a.markdown))).toBe(true);
    expect(story.areas.sources.markdown).toContain('http');
    for (const area of Object.values(story.areas)) {
      for (const block of area.codeBlocks) expect(area.markdown).toContain(block.raw);
    }
    for (const ref of story.references) if (ref.localPath) expect('../../../' + ref.localPath in localFiles).toBe(true);
  });
  it('pins every original SVG and source hash without mutating or substituting artwork', async () => {
    const assets = stories.flatMap(s => s.assets ? [s.assets.desktop, s.assets.mobile] : []);
    expect(assets).toHaveLength(16);
    expect(storyManifest.filter(s => s.art).every(s => s.art?.splitStatus === 'whole-source-only')).toBe(true);
    expect(assets.every(asset => asset.segments === undefined)).toBe(true);
    for (const asset of assets) {
      await verifyTextIntegrity(svgFiles['../../../' + asset.sourcePath], asset.sha256, asset.sourcePath);
      expect(asset.url).toBeTruthy();
      expect(asset.alt).toBeTruthy(); expect(asset.description).toBeTruthy();
      expect(asset.width).toBeGreaterThan(0); expect(asset.height).toBeGreaterThan(0);
    }
    expect(stories[8].assets).toBeNull();
    expect(stories[8].conceptMap?.status).toBe('pending-integration');
    expect(stories[8].conceptMap?.candidatePath).toContain('candidate-map.json');
  });
  it('parses Python comments as code, GFM tables/lists and HTML comments as distinct nodes', () => {
    const md = '# Title\n\n```python\n# not a heading\nif True:\n    print("x")\n\n```\n\n<!-- demo:x.py -->\n\n| a | b |\n| - | - |\n| 1 | 2 |\n\n- item\n';
    const tree = parseMarkdown(md);
    expect(headingsOf(tree).map(textOf)).toEqual(['Title']);
    expect(tree.children.map(n => n.type)).toEqual(['heading', 'code', 'html', 'table', 'list']);
    const code = tree.children.find(n => n.type === 'code')!;
    if (code.type === 'code') expect(codeFromSource(md, code)).toBe('# not a heading\nif True:\n    print("x")\n\n');
  });
  it('keeps CRLF, blank lines, indentation and source-only annotations out of copied code', () => {
    const md = '<!-- demo:x.py -->\r\n```python\r\ndef f():\r\n    return 1\r\n\r\n```';
    const code = parseMarkdown(md).children.find(n => n.type === 'code')!;
    if (code.type === 'code') expect(codeFromSource(md, code)).toBe('def f():\r\n    return 1\r\n\r\n');
  });
  it('does not label directory trees and activity templates as executed output', () => {
    expect(stories[0].areas.instructor.codeBlocks.find(b => b.raw.startsWith('실습 폴더/'))?.kind).toBe('text');
    expect(stories[8].areas.learner.codeBlocks.filter(b => b.language === 'text').every(b => b.kind === 'text')).toBe(true);
    expect(stories[1].areas.learner.codeBlocks.some(b => b.kind === 'output')).toBe(true);
  });
  it('does not infer learner text from editorial review status or hide substantive warnings', () => {
    const story = stories.find(s => s.id === 'scene-07')!;
    expect(story.provenance.editorialMarkdown).toContain('상태');
    expect(story.areas.learner.markdown).not.toContain('> **상태:**');
    expect(story.provenance.evidenceTags).toContain('[미검증]');
    expect(story.areas.learner.markdown).toContain('[미검증]');
    expect(story.teachingMetadata.length).toBeGreaterThan(0);
  });
  it('detects missing and unexpected source/assets and duplicate/global section IDs', () => {
    expect(() => validateCatalog([], [], [])).toThrow('source file');
    expect(() => validateCatalog([...storyManifest.map(s => '../../../' + s.sourcePath), 'unexpected.md'])).toThrow('source file');
    expect(() => validateCatalog(storyManifest.map(s => '../../../' + s.sourcePath), [], [])).toThrow('SVG file');
    const changed = structuredClone(storyManifest) as StoryDefinition[];
    changed[1].sections[0].id = changed[0].sections[0].id;
    expect(() => validateManifest(changed)).toThrow('Duplicate');
    expect(() => validateManifest(changed.slice(1))).toThrow('order');
  });
  it.each(['instructor', 'checks', 'sources'] as const)('rejects missing %s area', area => {
    const def = storyDefinition('scene-01'), source = raw(def), story = stories[0];
    expect(() => parseStory(source.replace(`## ${story.areas[area].title}`, 'not a heading'), def)).toThrow('structure changed');
  });
  it('rejects a nonempty source section with its citations removed', () => {
    const def = storyDefinition('scene-01');
    expect(() => parseStory(raw(def).replace(stories[0].areas.sources.markdown, '\n출처 없음\n'), def)).toThrow('missing source citations');
  });
  it('rejects unknown headings, missing activities, duplicate IDs and a missing question', () => {
    const def = storyDefinition('scene-01'), source = raw(def);
    expect(() => parseStory(source + '\n### unexpected\n', def)).toThrow('structure changed');
    const duplicate = structuredClone(def); duplicate.sections[1].id = duplicate.sections[0].id;
    expect(() => parseStory(source, duplicate)).toThrow('duplicate section ID');
    const withoutActivity = source.replace('9. 내 코드에서 찾아보기 (5분 안팎)', '9. 다른 활동');
    const newDef = structuredClone(def); newDef.sections = newDef.sections.map(s => ({ ...s, title: s.title.replace('9. 내 코드에서 찾아보기 (5분 안팎)', '9. 다른 활동') }));
    expect(() => parseStory(withoutActivity, newDef)).toThrow('missing learner activity');
    expect(() => parseStory(source.replace('| 학습 질문 |', '| 질문 없음 |'), def)).toThrow('learning question');
  });
  it('rejects unresolved references, unsafe protocols and unregistered local images', () => {
    expect(() => referencesOf(parseMarkdown('[x](javascript:alert)'), 'x.md')).toThrow('Unsupported');
    const def = storyDefinition('scene-01');
    expect(() => parseStory(raw(def) + '\n![missing](missing.svg)\n', def)).toThrow('Unregistered local reference');
  });
  it('rejects actual source and asset byte changes even when rendered meaning is unchanged', async () => {
    const def = storyDefinition('scene-01');
    await expect(verifyTextIntegrity(raw(def) + '\n', def.sha256, def.sourcePath)).rejects.toThrow('integrity mismatch');
    const asset = def.art!.desktop;
    await expect(verifyTextIntegrity(svgFiles['../../../' + asset.sourcePath] + '\n', asset.sha256, asset.sourcePath)).rejects.toThrow('integrity mismatch');
    await expect(loadStory('missing' as typeof sceneOrder[number])).rejects.toThrow('Unknown');
  });
});
