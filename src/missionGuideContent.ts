export const guidePath = '/missions/main-M01/guide';
const sources = import.meta.glob('../content/mission-guides/main-m01/chapters/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const guideChapters = Object.entries(sources).sort(([a], [b]) => a.localeCompare(b)).map(([path, markdown]) => ({
  id: path.split('/').pop()!.replace(/\.md$/, ''),
  title: markdown.match(/^# (.+)/m)![1].trim(),
  markdown,
}));
const assets = import.meta.glob('../content/mission-guides/main-m01/assets/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
export function guideAsset(path: string) {
  return assets[`../content/mission-guides/main-m01/assets/${path.split('/').pop()}`];
}
export function guideLink(href: string, chapterId?: string) {
  const [path, fragment] = href.split('#');
  const anchor = fragment ? `#${fragment}` : '';
  if (!path) return `${guidePath}${chapterId ? `/${chapterId}` : ''}${anchor}`;
  const term = path.match(/(?:^|\/)terms\/([^/]+)\.md$/);
  if (term) return `/terms/${term[1]}${anchor}`;
  if (/(?:^|\/)terms\/$/.test(path)) return '/terms';
  const chapter = guideChapters.find(item => path.split('/').pop() === `${item.id}.md`);
  if (chapter) return `${guidePath}/${chapter.id}${anchor}`;
  if (path.endsWith('README.md')) return `${guidePath}?document=README${anchor}`;
  if (path.endsWith('scenario-v1.0.md')) return `${guidePath}?document=scenario${anchor}`;
  if (path.endsWith('instructor-notes.md')) return `${guidePath}?document=instructor${anchor}`;
  const asset = guideAsset(path);
  if (asset) return asset;
  if (!/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(path)) {
    // Supporting source references stay pinned to the approved content revision.
    const base = 'https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/86ed91c8d3de50263c29df9bbc3c7fbdce265b47/content/mission-guides/main-m01/';
    return new URL(href, `${base}${chapterId ? 'chapters/' : ''}`).href;
  }
  return href;
}
