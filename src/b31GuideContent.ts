export const b31GuidePath = '/missions/main-M05/guide';

const sources = import.meta.glob('../content/mission-guides/main-m05/chapters/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const b31GuideChapters = Object.entries(sources).sort(([a], [b]) => a.localeCompare(b)).map(([path, markdown]) => ({
  id: path.split('/').pop()!.replace(/\.md$/, ''),
  title: markdown.match(/^# (.+)/m)![1].trim(),
  markdown,
}));

const assets = import.meta.glob('../content/mission-guides/main-m05/assets/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
export function b31GuideAsset(path: string) {
  return assets[`../content/mission-guides/main-m05/assets/${path.split('/').pop()}`];
}

const supplementAssets = import.meta.glob('../content/mission-guides/main-m05/supplement/assets/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
export const b31SupplementPath = `${b31GuidePath}?document=supplement`;
export function b31SupplementAsset(path: string) {
  return supplementAssets[`../content/mission-guides/main-m05/supplement/assets/${path.split('/').pop()}`];
}

export function b31SupplementLink(href: string) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(href)) return href;
  const [path, fragment] = href.split('#');
  const anchor = fragment ? `#${fragment}` : '';
  if (!path) return `${b31SupplementPath}${anchor}`;
  const asset = b31SupplementAsset(path);
  if (asset && path.startsWith('assets/')) return asset;
  if (path === '../README.md') return `${b31GuidePath}?document=README${anchor}`;
  if (path.startsWith('../chapters/')) return b31GuideLink(path, undefined);
  // Editorial and QA records remain readable in the repository, outside the learner route.
  return new URL(href, 'https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/main/content/mission-guides/main-m05/supplement/').href;
}

export function b31GuideLink(href: string, chapterId?: string) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(href)) return href;
  const [path, fragment] = href.split('#');
  const anchor = fragment ? `#${fragment}` : '';
  if (!path) return `${b31GuidePath}${chapterId ? `/${chapterId}` : ''}${anchor}`;
  if (path.endsWith('supplement/README.md')) return `${b31SupplementPath}${anchor}`;
  const term = path.match(/(?:^|\/)terms\/([^/]+)\.md$/);
  if (term) return `/terms/${term[1]}${anchor}`;
  const chapter = b31GuideChapters.find(item => path.split('/').pop() === `${item.id}.md`);
  if (chapter) return `${b31GuidePath}/${chapter.id}${anchor}`;
  if (path.endsWith('README.md')) return `${b31GuidePath}?document=README${anchor}`;
  if (path.endsWith('instructor-notes.md')) return `${b31GuidePath}?document=instructor${anchor}`;
  if (path.endsWith('qa-draft.md')) return `${b31GuidePath}?document=qa${anchor}`;
  if (path.endsWith('qa-web.md')) return `${b31GuidePath}?document=webQA${anchor}`;
  const asset = b31GuideAsset(path);
  if (asset) return asset;
  const base = 'https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/main/content/mission-guides/main-m05/';
  return new URL(href, `${base}${chapterId ? 'chapters/' : ''}`).href;
}
