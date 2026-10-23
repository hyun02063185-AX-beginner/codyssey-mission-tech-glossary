import { createElement } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { Root } from 'mdast';
import { localReference } from '../content/parseStory';
import { storyManifest } from '../content/storyManifest';
import type { LoadedStory, SceneId, StoryArea } from '../content/storyTypes';
import StoryCodeBlock from './StoryCodeBlock';
export type StoryNavigation = (scene: SceneId, section?: string) => void;
export function sourceUrl(story: Pick<LoadedStory, 'sourceRevision'>, path: string) {
  return `https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/${story.sourceRevision}/${path}`;
}
export default function StoryMarkdown({ story, area, onNavigate }: { story: LoadedStory; area: Pick<StoryArea, 'markdown' | 'ast' | 'headings' | 'codeBlocks'>; onNavigate?: StoryNavigation }) {
  const heading: Components['h3'] = ({ node, children }) => {
    const section = area.headings.find(h => h.offset === node?.position?.start.offset);
    if (!section) throw new Error('B21 rendered heading missing its stable section ID');
    return createElement(`h${section.depth}`, { id: section.id, tabIndex: -1 }, children);
  };
  // Render the original document AST: re-parsing a table cell changes escaped pipes,
  // and re-parsing an area loses reference definitions declared in another area.
  return <Markdown remarkPlugins={[remarkGfm, () => (tree: Root) => { tree.children = structuredClone(area.ast.children); }]} skipHtml components={{
    h2: heading, h3: heading, h4: heading, h5: heading, h6: heading,
    pre: ({ node }) => {
      const block = area.codeBlocks.find(c => c.offset === node?.position?.start.offset);
      if (!block) throw new Error('B21 rendered code block missing its original source');
      return <StoryCodeBlock block={block} />;
    },
    a: ({ href = '', children }) => {
      const path = localReference(story.sourcePath, href);
      const destination = storyManifest.find(s => s.sourcePath === path);
      if (destination && onNavigate) return <button type="button" className="b21-story-text-link" onClick={() => onNavigate(destination.id)}>{children}</button>;
      const asset = story.assets && [story.assets.desktop, story.assets.mobile].find(a => a.sourcePath === path);
      return <a href={asset?.url ?? (path ? sourceUrl(story, path) + (href.includes('#') ? '#' + href.split('#')[1] : '') : href)}>{children}</a>;
    },
    img: ({ src = '', alt }) => {
      const path = localReference(story.sourcePath, src);
      const asset = story.assets && [story.assets.desktop, story.assets.mobile].find(a => a.sourcePath === path);
      // Every current source image must be a registered emitted asset. Future
      // embedded images need an explicit loader, not a development /drafts URL.
      if (path && !asset) throw new Error(`B21 image has no emitted asset: ${src}`);
      return <img src={asset ? asset.url : src} alt={alt ?? ''} loading="lazy" />;
    },
    table: ({ children }) => <div className="b21-story-table" role="region" tabIndex={0} aria-label="본문 표 (가로 스크롤 가능)"><table>{children}</table></div>,
  }}>{area.markdown}</Markdown>;
}
