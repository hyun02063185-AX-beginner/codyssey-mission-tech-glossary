import type { Code, Heading, RootContent } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { splitLearningCheck } from '../../content/mission-stories/main-m06/_tools/storyboard-v02.mjs';

const parser = unified().use(remarkParse).use(remarkGfm, { singleTilde: false });
const screenCounts = [4, 5, 7, 7, 5, 3];
const evidenceKinds = ['실제', '재현', '구현', '교육용 예시', '교육용 시뮬레이션', '미확인'];
export const interactiveStates = {
  I1: ['edit', 'add', 'commit', 'push'],
  I2: ['before', 'after', 'mm'],
  I3: ['launch', 'pipe'],
  I4: ['compare', 'direct', 'capture'],
  I5: ['git', 'http', 'program'],
  I6: ['collect', 'prepare'],
  I7: ['key', 'body', 'params', 'response'],
  I8: ['commit', 'pr'],
  I9: ['commit', 'pr'],
  I10: ['overview', 'roles', 'pipeline'],
} as const;

export type InteractiveId = keyof typeof interactiveStates;
export type StoryReference = { label: string; href: string };
type Figure = { kind: 'svg'; name: string; state: string }
  | { kind: 'interactive'; id: InteractiveId; state: string }
  | { kind: 'table' | 'practice' };

type Field = { text: string; nodes: RootContent[]; line: number };

function fail(context: string, message: string): never {
  throw new Error(`B3-2 v0.4 ${context} · ${message}`);
}

function checkBadge(value: string, context: string) {
  if (!evidenceKinds.some(kind => value === kind || value.startsWith(`${kind} · `) || value.startsWith(`${kind} (`))) {
    fail(context, `잘못된 근거 표시 ${value}`);
  }
  return value;
}

function parseFigure(value: string, context: string): Figure {
  const svg = /^svg:([a-z0-9-]+):([a-z0-9-]+)$/.exec(value);
  if (svg) return { kind: 'svg', name: svg[1], state: svg[2] };
  const interaction = /^interactive:(I[0-9]+):([a-z0-9-]+)$/.exec(value);
  if (interaction && Object.hasOwn(interactiveStates, interaction[1])) {
    const id = interaction[1] as InteractiveId;
    if ((interactiveStates[id] as readonly string[]).includes(interaction[2])) {
      return { kind: 'interactive', id, state: interaction[2] };
    }
  }
  if (value === 'table' || value === 'practice') return { kind: value };
  return fail(context, `잘못된 도식 ${value}`);
}

export const overviewFigure = { kind: 'svg', name: 'f1-overview-r1', state: 'all' } as const;
export function figureSources(figure: Extract<Figure, { kind: 'svg' }>) {
  return { desktop: [`${figure.name}-desktop.svg`, figure.state], mobile: [`${figure.name}-mobile.svg`, figure.state] };
}

export function parseStoryboardV04(markdown: string, assets?: {
  termExists: (id: string) => boolean;
  readSvg: (filename: string) => string | undefined;
}) {
  const source = markdown.replace(/\r\n/g, '\n');
  const nodes = parser.parse(source).children;
  function raw(node: { position?: RootContent['position'] }) {
    return source.slice(node.position!.start.offset, node.position!.end.offset);
  }
  function heading(node: Heading) {
    return raw(node).replace(/^#+ /, '');
  }
  function fields(section: RootContent[], context: string) {
    const result = new Map<string, Field>();
    let current: Field | undefined;
    for (const node of section) {
      const match = node.type === 'paragraph' && /^\*\*([^*\n]+)\*\*(?:[ \t]+([^\n]*))?$/.exec(raw(node));
      if (match) {
        if (result.has(match[1])) fail(context, `중복 필드 ${match[1]}`);
        current = { text: match[2]?.trim() ?? '', nodes: [], line: node.position!.start.line };
        result.set(match[1], current);
      } else if (current) current.nodes.push(node);
    }
    return result;
  }
  function text(section: Map<string, Field>, key: string, context: string) {
    return section.get(key)?.text || fail(context, `필수 필드 ${key} 누락`);
  }
  function body(section: RootContent[]) {
    return section.length ? source.slice(section[0].position!.start.offset, section.at(-1)!.position!.end.offset) : '';
  }
  function fence(node: RootContent | undefined, context: string) {
    if (node?.type !== 'code' || !/^`{3,}/.test(raw(node))) fail(context, '펜스 코드가 필요합니다');
    const block = raw(node as Code);
    const lines = block.split('\n');
    const opener = /^`{3,}/.exec(lines[0])![0].length;
    const closing = /^(`{3,})[ \t]*$/.exec(lines.at(-1)!);
    if (lines.length < 3 || !closing || closing[1].length < opener) {
      fail(context, '닫는 코드 펜스가 필요합니다');
    }
    return lines.slice(1, -1).join('\n');
  }
  const defs = new Map<string, string>();
  const referenceSource: string[] = [];
  for (const node of nodes) {
    if (node.type !== 'definition') continue;
    const id = node.identifier;
    if (defs.has(id)) fail('문서', `중복 링크 정의 ${id}`);
    if (/^lab/.test(id) && (!/^lab0[1-9]$/.test(id) || node.url !== `lab:${id.slice(3)}`)) {
      fail('문서', `잘못된 Lab 정의 ${id}`);
    }
    if ((/^g\d/.test(id) || id === 'b32') && !/^https:\/\//.test(node.url)) fail('문서', `잘못된 외부 링크 ${id}`);
    defs.set(id, node.url);
    referenceSource.push(raw(node));
  }
  function resolve(id: string, context: string) {
    return defs.get(id) ?? fail(context, `링크 정의 ${id} 누락`);
  }
  for (let index = 1; index <= 9; index++) resolve(`lab0${index}`, '문서');
  const sections = nodes.flatMap((node, index) => node.type === 'heading' && node.depth === 2
    ? [{ title: heading(node), index, line: node.position!.start.line }] : []);
  const first = nodes[0];
  const title = first?.type === 'heading' && first.depth === 1
    ? /^B3-2 미션 스토리 v0\.4 — (.+)$/.exec(heading(first))?.[1] : undefined;
  if (!title) fail('문서', 'v0.4 강의 제목 누락');
  if (sections.length !== 8 || sections[0].title !== '인트로와 강의 구성' || sections[7].title !== '근거 표시') {
    fail('문서', '인트로·Scene 6개·근거 표시 구획을 순서대로 작성해 주세요');
  }
  const preamble = fields(nodes.slice(1, sections[0].index), '문서');
  const introNodes = nodes.slice(sections[0].index + 1, sections[1].index);
  const introFields = fields(introNodes, '인트로');
  const goals = introFields.get('학습 목표')?.nodes[0];
  if (goals?.type !== 'list' || !goals.ordered || goals.start !== 1 || goals.children.length !== 5) {
    fail('인트로', '순서가 있는 학습 목표 5개가 필요합니다');
  }
  const sceneTable = introNodes.find(node => node.type === 'table');
  if (!sceneTable || sceneTable.children.length !== 7) fail('인트로', 'Scene 표 6행이 필요합니다');
  const scenes = Object.fromEntries(sceneTable.children.slice(1).map(({ children }, index) => {
    const [id, perspective, title, question, goal] = children.map(cell => body(cell.children).trim());
    if (children.length !== 5 || id !== String(index + 1) || !perspective || !title || !question || !goal) {
      fail('인트로', `Scene ${index + 1} 표 행을 확인해 주세요`);
    }
    return [id, { title, perspective, question, goal }];
  }));
  const intro = {
    code: 'B3-2', title, subtitle: text(preamble, '부제', '문서'), question: text(preamble, '핵심 질문', '문서'),
    draftDefinition: text(introFields, '초안 안내', '인트로'),
    learningGuide: text(introFields, '학습 안내', '인트로'),
    practice: text(introFields, '실습으로 확인하기', '인트로'),
    goals: goals.children.map(item => body(item.children.flatMap(node => node.type === 'paragraph' ? [node] : []))),
    ...figureSources(overviewFigure),
  };
  const screens = screenCounts.flatMap((count, index) => {
    const scene = String(index + 1);
    const section = sections[index + 1];
    if (section.title !== `Scene ${scene} — ${scenes[scene].title}`) fail(`줄 ${section.line}`, 'Scene 제목이 표와 다릅니다');
    const sceneNodes = nodes.slice(section.index + 1, sections[index + 2].index);
    const boundaries = sceneNodes.flatMap((node, i) => node.type === 'heading' ? [{ node, i }] : []);
    if (boundaries.length !== count) fail(`Scene ${scene}`, `화면 ${count}개가 필요합니다`);
    return boundaries.map(({ node, i }, screenIndex) => {
      const id = `S${scene}-${screenIndex + 1}`;
      const context = `${id} (줄 ${node.position!.start.line})`;
      const prefix = `${id} · `;
      const name = heading(node);
      if (node.depth !== 3 || !name.startsWith(prefix) || name === prefix) fail(context, '화면 제목과 ID 순서를 확인해 주세요');
      const section = fields(sceneNodes.slice(i + 1, boundaries[screenIndex + 1]?.i), context);
      const technology = text(section, '관점', context);
      if (technology !== scenes[scene].perspective) fail(context, '관점이 Scene 표와 다릅니다');
      const figure = parseFigure(text(section, '도식', context), context);
      const badges = text(section, '근거', context).split('; ').map(value => checkBadge(value, context));
      const table = section.get('도식 표')?.nodes[0];
      if ((table || section.has('도식 표') || figure.kind === 'table') && table?.type !== 'table') {
        fail(context, '도식 표가 필요합니다');
      }
      const practiceField = section.get('함께 실습');
      if ((practiceField || figure.kind === 'practice') && !practiceField?.text) fail(context, '함께 실습 제목이 필요합니다');
      const practice = practiceField && {
        title: practiceField.text,
        command: fence(practiceField.nodes[0], context),
        notes: body(practiceField.nodes.slice(1)),
      };
      if (practiceField && !/^(bash|zsh)$/.test((practiceField.nodes[0] as Code).lang ?? '')) {
        fail(context, '함께 실습에는 bash 또는 zsh 명령 펜스가 필요합니다');
      }
      const results = [...section].filter(([key]) => key.startsWith('실습 결과 · '));
      if (results.length > 1 || section.has('실습 결과')) fail(context, '실습 결과의 근거를 한 번만 지정해 주세요');
      const result = results.map(([key, field]) => ({
        badge: checkBadge(key.slice('실습 결과 · '.length), `${context} 줄 ${field.line}`),
        output: fence(field.nodes[0], context),
      }))[0];
      const observation = section.get('관찰 질문')?.text;
      const explanation = body(section.get('화면 해설')?.nodes ?? []);
      if (!explanation) fail(context, '화면 해설 누락');
      for (const [, ref] of explanation.matchAll(/\[[^\]\n]+\]\[((?:lab|g)\d+)\]/g)) resolve(ref, context);
      const explanationGuides = text(section, '더 읽기', context).split(' · ').reduce<StoryReference[]>((links, part) => {
        // Labels can contain the same middle dot as the separator.
        const previous = links.at(-1);
        if (previous && !previous.href) previous.label += ` · ${part}`;
        else links.push({ label: part, href: '' });
        const last = links.at(-1)!;
        const match = /^\[([^\]]+)\]\[((?:lab|g)\d{2})\]$/.exec(last.label);
        if (match) Object.assign(last, { label: match[1], href: resolve(match[2], context) });
        return links;
      }, []);
      if (explanationGuides.some(link => !link.href)) fail(context, '더 읽기 링크 문법 오류');
      const terms = text(section, '용어', context).split(',').map(id => id.trim());
      if (terms.some(id => !/^[a-z0-9-]+$/.test(id) || (assets && !assets.termExists(id)))) fail(context, '알 수 없는 용어 ID');
      const checks = [...section.keys()].filter(key => /^(?:Scene 4 )?이해 확인$/.test(key));
      if (checks.length > 1) fail(context, '이해 확인을 한 번만 지정해 주세요');
      function check(label: string) {
        if (!section.has(label)) return null;
        const exercise = splitLearningCheck(text(section, label, context));
        if (!exercise.question || !exercise.answer) fail(context, `${label}의 질문과 정답이 필요합니다`);
        return { ...exercise, label };
      }
      return {
        id, scene, title: name.slice(prefix.length), technology,
        message: text(section, '핵심 메시지', context), caption: text(section, '화면 설명', context),
        question: text(section, '학습 질문', context), figure, badges, table: table && raw(table),
        practice, result, observation, explanation, explanationGuides, terms,
        check: checks[0] ? check(checks[0]) : null, wrapUp: check('마무리 · 스스로 설명하기'),
      };
    });
  });
  const interactions = new Set(screens.flatMap(screen => screen.figure.kind === 'interactive' ? [screen.figure.id] : []));
  if (interactions.size !== Object.keys(interactiveStates).length) fail('문서', 'I1–I10을 모두 사용해야 합니다');
  if (assets) {
    const figures = [overviewFigure, ...screens.flatMap(screen => screen.figure.kind === 'svg' ? [screen.figure] : [])];
    for (const figure of figures) {
      const { desktop, mobile } = figureSources(figure);
      for (const file of [desktop[0], mobile[0]]) {
        const svg = assets.readSvg(file);
        if (!svg || !svg.includes(`data-state="${figure.state}"`)) fail('SVG', `${file}에 ${figure.state} 상태가 없습니다`);
      }
    }
  }
  return { intro, scenes, screens, referenceSource: referenceSource.join('\n') };
}

export type IntegratedLesson = ReturnType<typeof parseStoryboardV04>;
export type IntegratedScreen = IntegratedLesson['screens'][number];
