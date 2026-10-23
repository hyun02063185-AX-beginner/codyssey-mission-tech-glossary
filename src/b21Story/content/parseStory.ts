import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, Nodes, Heading, Code } from 'mdast';
import type { ParsedStory, SceneId, StoryAreaId, StoryCode, StoryDefinition, StoryReference } from './storyTypes';

const processor = unified().use(remarkParse).use(remarkGfm);
export function parseMarkdown(markdown: string): Root { return processor.parse(markdown); }
export function textOf(node: Nodes): string {
  if ('children' in node) return node.children.map(child => textOf(child)).join('');
  return 'value' in node ? node.value : '';
}
function visit(node: Nodes, action: (node: Nodes) => void) {
  action(node);
  if ('children' in node) node.children.forEach(child => visit(child, action));
}
function offset(node: Nodes, end = false): number {
  const value = end ? node.position?.end.offset : node.position?.start.offset;
  if (value === undefined) throw new Error('Markdown source position missing');
  return value;
}
export function headingsOf(root: Root): Heading[] {
  const headings: Heading[] = [];
  visit(root, node => { if (node.type === 'heading') headings.push(node); });
  return headings;
}
export function areaId(title: string): StoryAreaId | null {
  if (title === '학습자 원고') return 'learner';
  if (title === '강사용 안내') return 'instructor';
  if (title.startsWith('이해 확인')) return 'checks';
  if (title === '근거와 출처') return 'sources';
  return null;
}
export function localReference(sourcePath: string, url: string): string | undefined {
  if (/^https?:\/\//i.test(url)) { new URL(url); return undefined; }
  if (url.startsWith('#')) return sourcePath;
  if (/^(?:[a-z][a-z\d+.-]*:|\/|\\)/i.test(url)) throw new Error(`Unsupported reference: ${url}`);
  const resolved = new URL(url, `https://source.invalid/${sourcePath}`);
  return decodeURIComponent(resolved.pathname.slice(1));
}
export function referencesOf(root: Root, sourcePath: string): StoryReference[] {
  const definitions = new Map<string, string>();
  visit(root, node => { if (node.type === 'definition') definitions.set(node.identifier, node.url); });
  const refs: StoryReference[] = [];
  visit(root, node => {
    if (node.type === 'link' || node.type === 'image' || node.type === 'linkReference' || node.type === 'imageReference') {
      const url = 'url' in node ? node.url : definitions.get(node.identifier);
      if (!url) throw new Error(`Missing Markdown reference: ${'identifier' in node ? node.identifier : ''}`);
      refs.push({ url, kind: node.type.startsWith('image') ? 'image' : 'link', localPath: localReference(sourcePath, url) });
    }
  });
  return refs;
}
export function codeFromSource(markdown: string, node: Code): string {
  const source = markdown.slice(offset(node), offset(node, true));
  const opening = source.match(/^([`~]{3,})[^\r\n]*(\r?\n)/);
  if (!opening) throw new Error('Expected a fenced source code block');
  const closing = new RegExp(`(?:^|\\n)[ \\t]*${opening[1][0]}{${opening[1].length},}[ \\t]*\\r?$`);
  const match = closing.exec(source);
  if (!match) throw new Error('Unclosed source code fence');
  // Include the source's last newline, excluding only the closing fence.
  return source.slice(opening[0].length, match.index + (source[match.index] === '\n' ? 1 : 0));
}
function codeBlocks(markdown: string, sceneId: SceneId, area: StoryAreaId, root: Root): StoryCode[] {
  const blocks: StoryCode[] = [];
  root.children.forEach((node, index) => {
    // Walk nested lists/quotes too; structure is parsed, never split on a Python '#'.
    visit(node, child => {
      if (child.type !== 'code') return;
      const raw = codeFromSource(markdown, child);
      const previous = root.children[index - 1];
      const marker = previous?.type === 'html' ? previous.value.match(/^<!--\s*(?:demo:|file:)\s*(\S+)\s*-->$/) : null;
      const language = child.lang ?? 'text';
      const recordedRun = previous?.type === 'html' && /^<!--\s*(?:run:|ledger-run:|ledger-probe)/.test(previous.value);
      const isOutput = /^(console|output)$/.test(language) || (language === 'text' && (recordedRun || raw.startsWith('$ ')));
      const kind = /^(bash|sh|shell)$/.test(language) ? 'command'
        : /^(json|jsonl|csv)$/.test(language) ? 'data'
        : isOutput ? 'output' : language === 'text' ? 'text' : 'code';
      blocks.push({ id: `${sceneId}-${area}-code-${blocks.length + 1}`, offset: offset(child), language, raw, kind,
        partial: kind === 'code' && !marker, sourceFile: marker?.[1] });
    });
  });
  return blocks;
}
export function parseStory(markdown: string, definition: StoryDefinition): ParsedStory {
  const root = parseMarkdown(markdown), headings = headingsOf(root);
  const titles = root.children.filter((n): n is Heading => n.type === 'heading' && n.depth === 1);
  if (titles.length !== 1) throw new Error(`${definition.id}: expected one title`);
  const actual = headings.filter(h => h.depth > 1);
  const ids = definition.sections.map(s => s.id);
  if (new Set(ids).size !== ids.length) throw new Error(`${definition.id}: duplicate section ID`);
  if (actual.length !== definition.sections.length || actual.some((h, i) => textOf(h) !== definition.sections[i].title || h.depth !== definition.sections[i].depth)) {
    throw new Error(`${definition.id}: section structure changed`);
  }
  const boundaries = root.children.filter((n): n is Heading => n.type === 'heading' && n.depth === 2);
  const areas = {} as ParsedStory['areas'];
  const definitions = root.children.filter(node => node.type === 'definition');
  for (const [i, heading] of boundaries.entries()) {
    const id = areaId(textOf(heading));
    if (!id || areas[id]) throw new Error(`${definition.id}: unexpected or duplicate area ${textOf(heading)}`);
    const sourceStart = offset(heading, true), sourceEnd = boundaries[i + 1] ? offset(boundaries[i + 1]) : markdown.length;
    const children = root.children.filter(node => offset(node) >= sourceStart && offset(node) < sourceEnd);
    const definitionIds = new Set(children.filter(node => node.type === 'definition').map(node => node.identifier));
    const ast: Root = { type: 'root', children: [...children, ...definitions.filter(node => !definitionIds.has(node.identifier))] };
    const body = markdown.slice(sourceStart, sourceEnd);
    if (!body.trim()) throw new Error(`${definition.id}: empty ${id}`);
    const section = definition.sections[actual.indexOf(heading)];
    areas[id] = { id, sectionId: section.id, title: textOf(heading), markdown: body, ast, sourceStart, sourceEnd,
      headings: headingsOf(ast).map(h => {
        const entry = definition.sections[actual.indexOf(h)];
        if (!entry) throw new Error(`Unknown heading: ${textOf(h)}`);
        return { ...entry, offset: offset(h) };
      }), codeBlocks: codeBlocks(markdown, definition.id, id, ast) };
  }
  for (const role of ['learner', 'instructor', 'checks', 'sources'] as const) {
    if (!areas[role]) throw new Error(`${definition.id}: missing ${role} area`);
  }
  if (!referencesOf(areas.sources.ast, definition.sourcePath).some(ref => /^https?:\/\//i.test(ref.url))) {
    throw new Error(`${definition.id}: missing source citations`);
  }
  const firstArea = offset(boundaries[0]);
  const metadata = root.children.filter(node => node.type === 'table' && offset(node) < firstArea);
  const rows = metadata.flatMap(table => table.type === 'table' ? table.children.slice(1) : []);
  const questionRow = rows.find(row => /^(학습 질문|핵심 질문)$/.test(textOf(row.children[0])));
  const question = questionRow?.children[1] && textOf(questionRow.children[1]);
  if (!question) throw new Error(`${definition.id}: missing learning question`);
  const teachingMetadata = rows.filter(row => !/학습 질문|핵심 질문|공식 목표|요구 추적|근거 표기/.test(textOf(row.children[0])))
    .map(row => ({ label: textOf(row.children[0]), markdown: markdown.slice(offset(row.children[1]), offset(row.children[1], true)),
      ast: { type: 'root' as const, children: [{ type: 'paragraph' as const, children: row.children[1].children }, ...definitions] } }));
  const learnerRoot = areas.learner.ast;
  const activities = areas.learner.headings.filter(h => /내 코드|^[FGH]\./.test(h.title)).map(h => {
    const node = learnerRoot.children.find(n => n.type === 'heading' && offset(n) === h.offset)!;
    const next = learnerRoot.children.find(n => n.type === 'heading' && offset(n) > h.offset && n.depth <= h.depth);
    return { sectionId: h.id, title: h.title, markdown: markdown.slice(offset(node), next ? offset(next) : areas.learner.sourceEnd) };
  });
  if (!activities.length) throw new Error(`${definition.id}: missing learner activity`);
  const references = referencesOf(root, definition.sourcePath);
  for (const ref of references) {
    if (ref.localPath && !definition.references.includes(ref.localPath)) throw new Error(`Unregistered local reference: ${ref.url}`);
    if (ref.kind === 'image' && !ref.localPath && !/^https:\/\//i.test(ref.url)) throw new Error(`Invalid image: ${ref.url}`);
  }
  const evidenceTags = [...new Set(markdown.match(/\[(?:확정 사실|단순화|설계 예시|구현 사례|학습용 예제|학습용 변형|미검증)\]/g) ?? [])];
  return { title: textOf(titles[0]).replace(/^Scene\s+\S+\s+원고\s*—\s*/, ''), question, teachingMetadata,
    areas, activities, references, provenance: { editorialMarkdown: markdown.slice(offset(titles[0], true), firstArea), evidenceTags } };
}
