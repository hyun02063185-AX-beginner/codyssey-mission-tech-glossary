export const b61GuidePath = '/missions/main-M11/guide';

const sources = import.meta.glob('../content/mission-guides/main-m11/chapters/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const b61GuideChapters = Object.entries(sources).sort(([a], [b]) => a.localeCompare(b)).map(([path, markdown]) => ({
  id: path.split('/').pop()!.replace(/\.md$/, ''),
  title: markdown.match(/^# (.+)/m)![1].trim(),
  markdown,
}));

const assets = import.meta.glob('../content/mission-guides/main-m11/assets/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
export function b61GuideAsset(path: string) {
  return assets[`../content/mission-guides/main-m11/assets/${path.split('/').pop()}`];
}

export function b61GuideLink(href: string, chapterId?: string) {
  const [path, fragment] = href.split('#');
  const anchor = fragment ? `#${fragment}` : '';
  if (!path) return `${b61GuidePath}${chapterId ? `/${chapterId}` : ''}${anchor}`;
  const term = path.match(/(?:^|\/)terms\/([^/]+)\.md$/);
  if (term) return `/terms/${term[1]}${anchor}`;
  if (/(?:^|\/)terms\/$/.test(path)) return '/terms';
  const chapter = b61GuideChapters.find(item => path.split('/').pop() === `${item.id}.md`);
  if (chapter) return `${b61GuidePath}/${chapter.id}${anchor}`;
  if (path.endsWith('README.md')) return `${b61GuidePath}?document=README${anchor}`;
  if (path.endsWith('scenario-v1.0.md')) return `${b61GuidePath}?document=scenario${anchor}`;
  if (path.endsWith('instructor-notes.md')) return `${b61GuidePath}?document=instructor${anchor}`;
  const asset = b61GuideAsset(path);
  if (asset) return asset;
  if (!/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(path)) {
    const base = 'https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/1ad290975a55d7443282956ec4601274031e5fcc/content/mission-guides/main-m11/';
    return new URL(href, `${base}${chapterId ? 'chapters/' : ''}`).href;
  }
  return href;
}
