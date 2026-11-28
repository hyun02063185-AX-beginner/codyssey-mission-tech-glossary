import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { containsSecret } from '../../content/mission-stories/main-m06/_tools/secret-check.cjs';
import authored from '../../content/mission-stories/main-m06/storyboard-v0.5.md?raw';
import guide from '../../content/mission-stories/main-m06/lab-guide-v0.3-r1.md?raw';
import evidence from '../../content/mission-stories/main-m06/assets/evidence/repro-v0.5-claude-2026-11-28.txt?raw';
import tokenEvidence from '../../content/mission-stories/main-m06/assets/evidence/max-tokens-v0.5-claude-2026-11-28.json?raw';
import B32StoryV05 from './B32StoryV05';
import { readStoryState, screenHref, storyPath } from './content';
import { integratedLabOrigin, integratedStoryFor, integratedStoryState } from './integratedNavigation';
import { learningLocation, learningPositions, learningScenes } from './learningIndexV05';
import { integratedLesson } from './lessonV04';
import { lessonV05 } from './lessonV05';
import { parseGfmTable, parseStoryboardV04 } from './parseStoryboardV04';
import { interactiveStatesV05, parseStoryboardV05 } from './parseStoryboardV05';
import {
  captureCases, draftPrefix, formatProbability, gitCases, inheritedStdout, maxTokensRecord,
  temperatureCandidates, temperatureProbabilities, tokenPresets, tokenRun,
} from './simulationV05';

const terms = import.meta.glob('../../content/terms/*.md');
const figures = import.meta.glob<string>('../../content/mission-stories/main-m06/assets/*.svg', {
  eager: true, query: '?raw', import: 'default',
});
const { intro, scenes, screens, referenceSource } = lessonV05;
const getScreen = (id: string) => screens.find(screen => screen.id === id)!;

describe('B3-2 v0.5 원고와 학습 인덱스', () => {
  it('로드맵과 6열 표, 33화면, 근거·용어·SVG, 신규 상호작용 상태를 검증한다', () => {
    expect(parseStoryboardV05(authored, {
      termExists: id => Object.hasOwn(terms, `../../content/terms/${id}.md`),
      readSvg: name => figures[`../../content/mission-stories/main-m06/assets/${name}`],
    })).toEqual(lessonV05);
    expect(intro.roadmap).toContain('학습 인덱스');
    expect(screens).toHaveLength(33);
    expect(Object.keys(scenes)).toHaveLength(6);
    expect(learningScenes.map(scene => scene.screens.length)).toEqual([4, 5, 7, 9, 5, 3]);
    expect(learningScenes.map(scene => scene.concepts.length)).toEqual([3, 4, 4, 5, 4, 4]);
    const figuresUsed = screens.flatMap(({ figure }) => figure.kind === 'interactive' ? [figure] : []);
    expect(new Set(figuresUsed.map(figure => figure.id))).toEqual(new Set(Object.keys(interactiveStatesV05)));
    for (const [id, state] of [['S3-4', 'compare'], ['S3-5', 'git-cases'], ['S4-5a', 'sentence'], ['S4-5b', 'stream']]) {
      expect(getScreen(id).figure).toMatchObject({ kind: 'interactive', state });
    }
    for (const [from, to] of [['I4:compare', 'I4:redirect'], ['I11:sentence', 'I11:commit']]) {
      expect(parseStoryboardV05(authored.replace(from, to)).screens.some(({ figure }) =>
        figure.kind === 'interactive' && to === `${figure.id}:${figure.state}`)).toBe(true);
    }
  });

  it.each([
    ['로드맵', '**학습 로드맵**', '**알 수 없는 필드**', /학습 로드맵 누락/],
    ['표 머리', '도달 목표 | 핵심 개념', '도달 목표 | 기술어', /6개 열 제목/],
    ['핵심 개념', '커밋 메시지와 PR 설명 · 검토용 초안 · 네 주체의 전체 흐름', '커밋', /핵심 개념 3–5개/],
    ['중복 ID', '### S4-5b', '### S4-5a', /ID 순서/],
    ['접미사 역순', '### S4-5a', '### S4-5c', /ID 순서/],
    ['존재하지 않는 기본 ID', '### S4-5a', '### S4-6a', /ID 순서/],
    ['다른 Scene ID', '### S4-5a', '### S3-5a', /ID 순서/],
    ['도식 상태', 'interactive:I12:stream', 'interactive:I12:bad', /S4-5b.*도식/],
    ['도식 표', '도식 표**\n\n| 후보', '도식 부록**\n\n| 후보', /S4-5a.*도식 표/],
    ['근거', '**근거** 실제 · 2026-11-25 Owner', '**근거** 미지원 · 2026-11-25 Owner', /S1-1.*근거 표시/],
  ] as const)('%s 위반을 거부한다', (_name, from, to, error) => {
    expect(authored).toContain(from);
    expect(() => parseStoryboardV05(authored.replace(from, to))).toThrow(error);
  });

  it('5개 목표, 31개 ID와 제목, 28개 화면 전체 필드, Lab 정의를 보존한다', () => {
    expect(intro.goals).toEqual(integratedLesson.intro.goals);
    expect(screens.filter(screen => !integratedLesson.screens.some(legacy => legacy.id === screen.id)).map(screen => screen.id))
      .toEqual(['S4-5a', 'S4-5b']);
    const revised = ['S3-4', 'S3-5', 'S4-5'];
    for (const legacy of integratedLesson.screens) {
      expect(getScreen(legacy.id).title, legacy.id).toBe(legacy.title);
      if (!revised.includes(legacy.id)) expect(getScreen(legacy.id), legacy.id).toEqual(legacy);
    }
    const labDefinitions = (source: string) => source.split('\n').filter(line => /^\[lab\d+\]:/.test(line));
    expect(labDefinitions(referenceSource)).toHaveLength(9);
    expect(labDefinitions(referenceSource)).toEqual(labDefinitions(integratedLesson.referenceSource));
    expect(() => parseStoryboardV04(authored)).toThrow(/v0.4 강의 제목/);
  });

  it.each([['S2-2', '03'], ['S2-3', '03'], ['S3-7', '05'], ['S5-4', '09']])('%s의 복사할 명령은 Lab %s와 동일하다', (id, lab) => {
    const section = guide.split(`\n## Lab ${lab}.`)[1].split(/\n## Lab \d\d\./)[0];
    const commands = [...section.matchAll(/^\x60{3}(?:zsh|bash)\n([\s\S]*?)\n\x60{3}$/gm)].map(match => match[1]);
    const command = getScreen(id).practice?.command;
    expect(command).toBeTruthy();
    expect(commands).toContain(command);
  });

  it('33개 주소 왕복, 기존 31개 주소, 접미사 Lab 복귀 및 잘못된 주소 복구를 검증한다', () => {
    const search = (href: string) => '?' + href.split('?')[1];
    for (const [index, screen] of screens.entries()) {
      const href = screenHref(index, screens);
      expect(readStoryState(search(href), screens)).toMatchObject({ index, canonical: href, notice: '' });
      expect(integratedLabOrigin(`?from=${screen.id}`, screens)).toBe(screen.id);
    }
    for (const [index, screen] of integratedLesson.screens.entries()) {
      const href = screenHref(index, integratedLesson.screens);
      const state = readStoryState(search(href), screens);
      expect(screens[state.index].id).toBe(screen.id);
      expect(state).toMatchObject({ canonical: href, notice: '' });
    }
    for (const id of ['S4-5a', 'S4-5b']) {
      const href = integratedStoryFor(id, '07', screens)!;
      const state = integratedStoryState(search(href), screens);
      expect(screens[state.index].id).toBe(id);
      expect(state).toMatchObject({ returnId: '07', notice: '' });
      expect(readStoryState(search(href.split('&from-lab')[0]), integratedLesson.screens).notice).toContain('복구');
    }
    const bad = readStoryState('?scene=4&screen=5c', screens);
    expect(bad.notice).toContain('복구');
    expect(screens[bad.index].id).toBe('S4-1');
    const position = learningPositions.find(item => item.id === 'S4-5a')!;
    expect(position).toMatchObject({ withinScene: 6, overall: 22, total: 33 });
    expect(learningLocation(position, learningScenes.length)).toBe('Scene 4 / 6 · Python과 외부 AI · 화면 6 / 9 · 전체 22 / 33');
  });

  it('원고와 새 근거 두 파일에 기존 비밀값 검사 규칙을 적용한다', () => {
    for (const text of [authored, evidence, tokenEvidence]) expect(containsSecret(text)).toBe(false);
  });

  it('실제 인트로와 33화면을 정적 렌더링한다', () => {
    vi.stubGlobal('window', { innerWidth: 1280 });
    try {
      const render = (path: string) => renderToStaticMarkup(
        <MemoryRouter initialEntries={[path]}><B32StoryV05/></MemoryRouter>,
      );
      expect(render(storyPath)).toContain('학습 로드맵');
      for (const [index, screen] of screens.entries()) {
        const markup = render(screenHref(index, screens));
        expect(markup).toContain(`data-screen="${screen.id}"`);
        expect(markup).toContain(learningLocation(learningPositions[index], learningScenes.length));
        if (screen.figure.kind === 'interactive') {
          expect(markup).toContain(`data-diagram="${screen.figure.id}"`);
          expect(markup).toContain(`data-state="${screen.figure.state}"`);
        }
        expect(markup, screen.id).not.toMatch(/<del[\s>]/);
        const simulation = markup.match(/<figure class="b32-diagram b32-simulation"[\s\S]*?<\/figure>/)?.[0];
        if (simulation) expect(containsSecret(simulation), screen.id).toBe(false);
      }
    } finally { vi.unstubAllGlobals(); }
  });
});

describe('v0.5 상호작용 근거와 계산', () => {
  it('R6 직접·캡처, R11 리다이렉션·PIPE, R10 네 사례의 원문 값을 읽는다', () => {
    const oldCapture = integratedLesson.screens.find(screen => screen.id === 'S3-4')!.result!.output;
    const capture = getScreen('S3-4').result!.output;
    expect(capture).toBe(oldCapture);
    expect(captureCases(capture)).toHaveLength(2);
    expect(inheritedStdout).toMatchObject({ command: 'python3 inherit.py > out.txt', screenOutput: '없음' });
    expect(inheritedStdout.file).toContain('일반 실행 → stdout: None');
    expect(inheritedStdout.pipeComparison).toContain('같음: True');
    const cases = gitCases(getScreen('S3-5').result!.output);
    expect(cases.map(item => item.returncode)).toEqual([0, 0, 0, 128]);
    expect(cases[0].stdout).toBe("''");
    expect(cases[2]).toMatchObject({ command: 'git clone practice copy', stdout: "''", stderr: expect.stringContaining('복제합니다') });
  });

  it('I11의 두 분포가 합계·기준·극한·단조성과 원고 표의 0.2·2.0 표시값을 만족한다', () => {
    const groups = temperatureCandidates(getScreen('S4-5a').table!);
    for (const candidates of Object.values(groups)) {
      const p = candidates.map(candidate => candidate.probability);
      const highest = p.indexOf(Math.max(...p)), lowest = p.indexOf(Math.min(...p));
      const extreme = temperatureProbabilities(p, 0);
      expect(extreme).toEqual(p.map((_, index) => Number(index === highest)));
      let previous = extreme;
      for (let step = 1; step <= 20; step++) {
        const values = temperatureProbabilities(p, step / 10);
        expect(Math.abs(values.reduce((sum, value) => sum + value, 0) - 1)).toBeLessThanOrEqual(1e-9);
        expect(values[highest]).toBeLessThan(previous[highest]);
        expect(values[lowest]).toBeGreaterThan(previous[lowest]);
        previous = values;
      }
      temperatureProbabilities(p, 1).forEach((value, index) => expect(value).toBeCloseTo(p[index], 12));
      expect(temperatureProbabilities(p, .2).map(formatProbability)).toEqual(candidates.map(candidate => candidate.low));
      expect(temperatureProbabilities(p, 2).map(formatProbability)).toEqual(candidates.map(candidate => candidate.high));
    }
  });

  it('I12의 57개 조각과 58개 기록을 읽고 모든 프리셋을 원고 표와 대조한다', () => {
    const parts = [...maxTokensRecord.draft.matchAll(/\S+/g)];
    expect(parts).toHaveLength(57);
    expect(maxTokensRecord.total_units).toBe(parts.length);
    expect(maxTokensRecord.results).toHaveLength(parts.length + 1);
    expect(maxTokensRecord.results.map(({ units }) => units)).toEqual(Array.from({ length: 58 }, (_, index) => index));
    expect(draftPrefix(0)).toBe('');
    for (const [index, piece] of parts.entries()) {
      expect(draftPrefix(index + 1)).toBe(maxTokensRecord.draft.slice(0, piece.index + piece[0].length));
    }
    const [, ...rows] = parseGfmTable(getScreen('S4-5b').table!)!;
    expect(rows.map(([limit]) => Number(limit))).toEqual(tokenPresets);
    for (const [index, limit] of tokenPresets.entries()) {
      const [_, units, status, outcome] = rows[index];
      const run = tokenRun(limit, false);
      expect(run.visibleUnits).toBe(Number(units));
      expect(run.complete).toBe(status.startsWith('답변 완성'));
      expect(run.result.finish_reason).toBe(run.complete ? 'stop' : 'length');
      if (outcome.startsWith('통과')) expect(run.result).toMatchObject({ result: 'pass', output: expect.stringContaining('## How to Test') });
      else expect(run.result).toMatchObject({ result: 'reject', message: outcome.replace(/^거부 · /, '') });
    }
  });

  it.each([
    [20, true, 20, 0, 0, false, 'response', 'reject'],
    [30, true, 30, 0, 0, false, 'response', 'reject'],
    [31, true, 30, 1, 0, false, 'validate', 'reject'],
    [80, true, 30, 50, 0, false, 'validate', 'pass'],
    [57, false, 0, 57, 0, true, 'validate', 'pass'],
    [80, false, 0, 57, 23, true, 'validate', 'pass'],
  ] as const)('I12 한도 %i, 추론 %s의 경계값을 계산한다', (limit, reasoning, reasoningUnits, visibleUnits, remaining, complete, stage, result) => {
    const run = tokenRun(limit, reasoning);
    expect(run).toMatchObject({ reasoningUnits, visibleUnits, remaining, complete, result: { stage, result } });
    if (visibleUnits === 0) expect(run.result.message).toBe('AI API 응답에 텍스트가 없습니다.');
  });
});
