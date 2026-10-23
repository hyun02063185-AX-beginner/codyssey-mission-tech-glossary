import { renderToStaticMarkup } from 'react-dom/server';
import { beforeAll, describe, expect, it } from 'vitest';
import { loadStoryManifest } from '../content/storyLoader';
import { sceneOrder } from '../content/storyManifest';
import type { LoadedStory } from '../content/storyTypes';
import StoryScene from './StoryScene';
import StoryCodeBlock, { copySource } from './StoryCodeBlock';
import { figureLayout } from './StoryFigure';
import B21StoryFoundation from '../B21StoryFoundation';
let stories: LoadedStory[];
beforeAll(async () => { stories = await loadStoryManifest(); });
describe('private B21 React rendering (SSR; no browser measurements claimed)', () => {
  it.each(sceneOrder)('%s renders source areas, activities and exact code text', id => {
    const story = stories.find(s => s.id === id)!;
    const html = renderToStaticMarkup(<StoryScene story={story} onNavigate={() => {}} />);
    expect(html).toContain(`${story.position}/9`);
    expect(html).toContain(story.areas.checks.title);
    expect(html).toContain('강사용 안내 펼치기'); expect(html).toContain('근거와 출처');
    for (const activity of story.activities) expect(html).toContain(`id="${activity.sectionId}"`);
    for (const area of Object.values(story.areas)) {
      expect(html).toContain(`id="${area.sectionId}"`);
      for (const block of area.codeBlocks) expect(html).toContain(renderToStaticMarkup(<code>{block.raw}</code>));
      for (const heading of area.headings) expect(html).toContain(`id="${heading.id}"`);
    }
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(html).not.toContain('<iframe'); expect(html).not.toContain('<canvas'); expect(html).not.toContain('<!-- demo:');
    if (story.assets) {
      expect(html).toContain(story.assets.mobile.url.replaceAll('&', '&amp;'));
      expect(html).toContain('전체 그림 확대'); expect(html).toContain('그림 설명 읽기');
    }
  });
  it('preserves GFM metadata cell semantics for type union code', () => {
    const html = renderToStaticMarkup(<StoryScene story={stories.find(s => s.id === 'scene-07')!} />);
    expect(html).toContain('<code>int | str</code>');
    expect(html).not.toContain('<code>int \\| str</code>');
  });
  it('supplies only the typed Scene08 candidate reference and a real optional component slot', () => {
    const story = stories[8];
    const pending = renderToStaticMarkup(<StoryScene story={story} />);
    expect(pending).toContain('개념지도 탐색은 준비 중'); expect(pending).not.toContain('<svg');
    const injected = renderToStaticMarkup(<StoryScene story={story} conceptMapSlot={context => <aside>{context.candidatePath}</aside>} />);
    expect(injected).toContain('<aside>drafts/b2-1-story-map/scene-08/candidate-map.json</aside>');
  });
  it('provides a private entry with nine scene controls, no routed URL or fake interactions', () => {
    const html = renderToStaticMarkup(<B21StoryFoundation />);
    expect((html.match(/<li>/g) ?? []).length).toBe(9);
    expect(html).toContain('aria-current="step"'); expect(html).toContain('장면을 불러오는 중');
    expect(html).not.toContain('/missions/'); expect(html).not.toContain('업로드');
  });
  it.each([0, 328, 358, 640, 959])('uses actual narrow figure slot %spx without reducing native SVG text', width => {
    const assets = stories[0].assets!, layout = figureLayout(width, assets);
    expect(layout.variant).toBe('mobile'); expect(layout.width).toBeGreaterThanOrEqual(assets.mobile.width);
    expect(layout.height / layout.width).toBeCloseTo(assets.mobile.height / assets.mobile.width);
  });
  it.each([960, 1000, 1280])('uses the desktop artwork for a %spx figure slot, preserving ratio/native minimum', width => {
    const assets = stories[0].assets!, layout = figureLayout(width, assets);
    expect(layout.variant).toBe('desktop'); expect(layout.width).toBeGreaterThanOrEqual(assets.desktop.width);
    expect(layout.height / layout.width).toBeCloseTo(assets.desktop.height / assets.desktop.width);
  });
  it('marks code fragments and recorded output separately and offers original-only copying', async () => {
    const block = stories[7].areas.learner.codeBlocks.find(b => b.kind === 'code' && b.partial)!;
    expect(renderToStaticMarkup(<StoryCodeBlock block={block} />)).toContain('코드 조각입니다');
    const output = stories[7].areas.learner.codeBlocks.find(b => b.kind === 'output')!;
    expect(renderToStaticMarkup(<StoryCodeBlock block={output} />)).toContain('기록된 실행 출력');
    let copied = '';
    expect(await copySource(block.raw, async value => { copied = value; })).toBe(true);
    expect(copied).toBe(block.raw);
    expect(await copySource(block.raw, async () => { throw Error('clipboard denied'); })).toBe(false);
  });
});
