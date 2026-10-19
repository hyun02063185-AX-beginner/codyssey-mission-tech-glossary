const allSources = import.meta.glob('../content/mission-guides/*/chapters/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const allAssets = import.meta.glob('../content/mission-guides/*/assets/**/*.svg', { query: '?url&no-inline', import: 'default', eager: true }) as Record<string, string>;
const allDocuments = import.meta.glob('../content/mission-guides/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export function createGuide(missionId: 'main-M01' | 'main-M03') {
const folder = missionId.toLowerCase();
const root = `../content/mission-guides/${folder}/`;
const guidePath = `/missions/${missionId}/guide`;
const sources = Object.fromEntries(Object.entries(allSources).filter(([path]) => path.startsWith(root)));
const guideChapters = Object.entries(sources).sort(([a], [b]) => a.localeCompare(b)).map(([path, markdown]) => ({
  id: path.split('/').pop()!.replace(/\.md$/, ''),
  title: markdown.match(/^# (.+)/m)![1].trim(),
  markdown,
}));
const assets = allAssets;
function guideAsset(path: string, variant: boolean | 'desktop' = false) {
  return assets[`${root}assets/${variant === 'desktop' ? 'desktop/' : variant ? 'mobile/' : ''}${path.split('/').pop()}`];
}
function guideLink(href: string, chapterId?: string) {
  const [path, fragment] = href.split('#');
  const anchor = fragment ? `#${fragment}` : '';
  if (!path) return `${guidePath}${chapterId ? `/${chapterId}` : ''}${anchor}`;
  const term = path.match(/(?:^|\/)terms\/([^/]+)\.md$/);
  if (term) return `/terms/${term[1]}${anchor}`;
  if (/(?:^|\/)terms\/$/.test(path)) return '/terms';
  const chapter = guideChapters.find(item => path.split('/').pop() === `${item.id}.md`);
  if (chapter) return `${guidePath}/${chapter.id}${anchor}`;
  if (path.endsWith('README.md')) return `${guidePath}?document=README${anchor}`;
  if (/scenario-v[\d.]+\.md$/.test(path)) return `${guidePath}?document=scenario${anchor}`;
  if (path.endsWith('instructor-notes.md')) return `${guidePath}?document=instructor${anchor}`;
  const asset = guideAsset(path);
  if (asset) return asset;
  if (!/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(path)) {
    // Supporting source references stay pinned to the approved content revision.
    const base = missionId === 'main-M01' ? 'https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/86ed91c8d3de50263c29df9bbc3c7fbdce265b47/content/mission-guides/main-m01/' : 'https://github.com/hyun02063185-AX-beginner/m03-pocket-money-ledger/blob/main/';
    return new URL(href, `${base}${chapterId ? 'chapters/' : ''}`).href;
  }
  return href;
}

const documents: Record<string, string> = { README: allDocuments[`${root}README.md`], instructor: allDocuments[`${root}instructor-notes.md`], scenario: allDocuments[`${root}scenario-${missionId === 'main-M01' ? 'v1.0' : 'v1.1'}.md`] };
return { missionId, guidePath, guideChapters, guideAsset, guideLink, documents,
 label: missionId === 'main-M01' ? 'B1-1' : 'B2-1',
 title: missionId === 'main-M01' ? 'AI가 만든 웹사이트, 이제 내가 이해하고 설명하기' : 'AI가 만든 용돈 기입장, 이제 프로그램이 움직이는 원리를 이해하기',
 overview: missionId === 'main-M01' ? 'v09-website-overview' : 'v09-ledger-overview' };
}
export const guides = { 'main-M01': createGuide('main-M01'), 'main-M03': createGuide('main-M03') };
export const { guidePath, guideChapters, guideAsset, guideLink } = guides['main-M01'];
export type Guide = ReturnType<typeof createGuide>;
