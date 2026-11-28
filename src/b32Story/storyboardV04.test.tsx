import { containsSecret } from '../../content/mission-stories/main-m06/_tools/secret-check.cjs';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import authored from '../../content/mission-stories/main-m06/storyboard-v0.4.md?raw';
import design from '../../content/mission-stories/main-m06/design-v0.4.md?raw';
import guide from '../../content/mission-stories/main-m06/lab-guide-v0.3-r1.md?raw';
import evidence from '../../content/mission-stories/main-m06/assets/evidence/repro-v0.4-claude-2026-11-28.txt?raw';
import B32IntegratedFigures from './B32IntegratedFigures';
import B32IntegratedStory from './B32IntegratedStory';
import B32LabMarkdown from './B32LabMarkdown';
import B32MarkdownV04 from './B32MarkdownV04';
import { readStoryState, screenHref, storyPath } from './content';
import { gitComparison, journeyRows, validatorCases } from './integratedEvidence';
import { integratedLabOrigin, integratedStoryFor, integratedStoryState } from './integratedNavigation';
import { cleanup, indexSections, labOverview, labs, optionalCleanup, resultIndex } from './labContent';
import { integratedLesson } from './lessonV04';
import { interactiveStates, parseStoryboardV04 } from './parseStoryboardV04';

const terms = import.meta.glob('../../content/terms/*.md');
const figures = import.meta.glob<string>('../../content/mission-stories/main-m06/assets/*.svg', {
  eager: true, query: '?raw', import: 'default',
});
const { intro, scenes, screens } = integratedLesson;

describe('B3-2 v0.4 원고', () => {
  it('인트로, Scene 6개, 출처가 있는 31화면과 실제 용어·SVG 파일을 읽는다', () => {
    const validated = parseStoryboardV04(authored, {
      termExists: id => Object.hasOwn(terms, `../../content/terms/${id}.md`),
      readSvg: name => figures[`../../content/mission-stories/main-m06/assets/${name}`],
    });
    expect(validated.screens).toEqual(screens);
    expect(intro.goals).toHaveLength(5);
    expect(Object.keys(scenes)).toEqual(['1', '2', '3', '4', '5', '6']);
    const ids = [4, 5, 7, 7, 5, 3].flatMap((count, scene) => Array.from({ length: count }, (_, i) => `S${scene + 1}-${i + 1}`));
    expect(screens.map(screen => screen.id)).toEqual(ids);
    for (const screen of screens) {
      expect(screen.technology).toBe(scenes[screen.scene].perspective);
      expect(screen.badges.length).toBeGreaterThan(0);
      expect(screen.explanationGuides.every(({ href }) => /^(https:\/\/|lab:0[1-9]$)/.test(href))).toBe(true);
      if (screen.figure.kind === 'practice') expect(screen.practice?.command).toBeTruthy();
      if (screen.figure.kind === 'table') expect(screen.table).toMatch(/^\|/);
    }
  });

  it('펜스의 PR 제목 구획과 Git 상태 앞 공백을 원문 그대로 보존한다', () => {
    const result = screens.find(screen => screen.id === 'S5-1')?.result?.output;
    expect(result).toMatch(/^## Why$/m);
    expect(result).toMatch(/^## What$/m);
    expect(result).toMatch(/^## How to Test$/m);
    expect(screens.find(screen => screen.id === 'S2-2')?.result?.output).toBe(' M README.md');
    expect(screens.find(screen => screen.id === 'S4-7')?.check?.label).toBe('Scene 4 이해 확인');
    expect(screens.find(screen => screen.id === 'S6-1')?.wrapUp?.answer).toBeTruthy();
  });

  it.each([
    ['필수 필드', '**핵심 메시지** 내 Git 변경을', '**알 수 없는 필드** 내 Git 변경을', /S1-1.*핵심 메시지/],
    ['도식 상태', 'interactive:I10:overview', 'interactive:I10:bad', /S1-4.*도식/],
    ['표', '**도식 표**\n\n| | 커밋', '**도식 부록**\n\n| | 커밋', /S1-2.*도식 표/],
    ['Lab 링크 정의', '[lab08]: lab:08', '[lab08]: lab:10', /잘못된 Lab 정의/],
    ['존재하지 않는 가이드 참조', '[00 프로젝트 준비][g00]', '[00 프로젝트 준비][g89]', /g89 누락/],
    ['근거', '**근거** 실제 · 2026-11-25 Owner', '**근거** 미지원 · 2026-11-25 Owner', /S1-1.*근거 표시/],
  ] as const)('%s 문법 오류를 거부한다', (_what, from, to, error) => {
    expect(() => parseStoryboardV04(authored.replace(from, to))).toThrow(error);
  });

  it.each([['S2-2', '03'], ['S2-3', '03'], ['S3-7', '05'], ['S5-4', '09']])('%s의 명령이 Lab %s와 글자 단위로 같다', (screen, lab) => {
    const section = guide.split(`\n## Lab ${lab}.`)[1].split(/\n## Lab \d\d\./)[0];
    const code = Array.from(section.matchAll(/^\x60{3}(?:zsh|bash)\n([\s\S]*?)\n\x60{3}$/gm), match => match[1]);
    const command = screens.find(item => item.id === screen)?.practice?.command;
    expect(command).toBeTruthy();
    expect(code).toContain(command);
  });

  it('원고와 재현 기록에 기존 비밀값 검사 규칙을 적용한다', () => {
    expect(containsSecret(authored)).toBe(false);
    expect(containsSecret(evidence)).toBe(false);
  });

  it('인트로와 31화면의 실제 스토리 마크업에서 물결표 범위를 보존하고 원고 수정 사항을 표시한다', () => {
    vi.stubGlobal('window', { innerWidth: 1280 });
    try {
      const renderStory = (path: string) => renderToStaticMarkup(
        <MemoryRouter initialEntries={[path]}><B32IntegratedStory/></MemoryRouter>,
      );
      const introMarkup = renderStory(storyPath);
      expect(introMarkup).toContain(renderToStaticMarkup(<B32MarkdownV04>{intro.practice}</B32MarkdownV04>));
      expect(introMarkup).not.toMatch(/<del[\s>]/);
      for (const [index, screen] of screens.entries()) {
        const markup = renderStory(screenHref(index, screens));
        expect(markup, screen.id).not.toMatch(/<del[\s>]/);
        if (screen.id === 'S1-4') expect(markup).toContain(screen.message);
        if (screen.id === 'S4-5') expect(markup).toContain('0~2,');
        if (screen.id === 'S5-2') expect(markup).toContain(
          renderToStaticMarkup(<B32MarkdownV04>{screen.check?.answer}</B32MarkdownV04>),
        );
        if (screen.id === 'S6-2') expect(markup).toContain('파일 1~3개 또는 핵심 변경 1~2개');
      }
      const returned = renderStory(`${storyPath}?scene=3&screen=7&from-lab=05`);
      expect(returned.match(/role="status"/g)).toHaveLength(1);
      expect(returned).toContain('Lab 05에서 돌아왔습니다');
      expect(returned).toContain('class="b32-lab-copy-status" aria-live="polite"');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('실제 Lab 마크다운의 취소선을 두 모드에서 확인하고 v0.4에만 범위 보존을 적용한다', () => {
    const fragments = [
      labOverview, cleanup, optionalCleanup,
      ...indexSections.map(([, , text]) => text),
      ...resultIndex.flatMap(row => [row.output, row.meaning]),
      ...labs.flatMap(lab => [lab.meta, lab.cost, lab.conditions, lab.purpose, lab.questions, lab.commands,
        lab.observations, lab.results, lab.optional, lab.troubleshooting, lab.example?.question ?? '', lab.example?.answer ?? '']),
    ];
    const renderLab = (text: string, integrated: boolean) => renderToStaticMarkup(
      <MemoryRouter><B32LabMarkdown text={text} integrated={integrated}/></MemoryRouter>,
    );
    for (const text of fragments) {
      expect(renderLab(text, true)).not.toMatch(/<del[\s>]/);
      expect(renderLab(text, false)).not.toMatch(/<del[\s>]/);
    }
    const range = '파일 1~3개 또는 불릿 1~2개';
    expect(renderLab(range, true)).toContain(range);
    expect(renderLab(range, false)).toContain('<del>');
  });
});

describe('B3-2 v0.4 주소와 상호작용', () => {
  it('31개 직접 주소와 Lab 복귀, 잘못되거나 중복된 파라미터를 처리한다', () => {
    screens.forEach(({ id }, index) => {
      const canonical = screenHref(index, screens);
      expect(readStoryState('?' + canonical.split('?')[1], screens)).toMatchObject({ index, canonical, notice: '' });
      expect(integratedLabOrigin(`?from=${id}`, screens)).toBe(id);
      expect(integratedStoryFor(id, '03', screens)).toBe(`${canonical}&from-lab=03`);
    });
    expect(integratedStoryState('', screens).overview).toBe(true);
    expect(integratedLabOrigin('?from=S6-3&from=S6-3', screens)).toBe('');
    expect(integratedLabOrigin('?from=S6-5', screens)).toBe('');
    expect(integratedLabOrigin('?from=intro', screens)).toBe('');
    expect(integratedStoryState('?scene=6&screen=3&from-lab=05', screens)).toMatchObject({ index: 30, returnId: '05', notice: '' });
    for (const search of [
      '?scene=6&screen=9', '?scene=7&screen=1', '?scene=6&scene=5&screen=2', '?from-lab=05',
      '?scene=6&screen=3&from-lab=02&from-lab=01', '?scene=6&screen=3&from-lab=10',
      `?scene=6&screen=3&from-lab=02&x=${'a'.repeat(1024)}`,
    ]) expect(integratedStoryState(search, screens).notice).toContain('복구');
    expect(integratedStoryState('?scene=6&screen=9', screens).canonical).toContain('scene=6&screen=1');
    expect(integratedStoryState('?scene=9&screen=1', screens).canonical).toContain('scene=1&screen=1');
  });

  it('원고에 지정된 초기 상태 각각을 렌더링한다', () => {
    const seen = new Set();
    for (const screen of screens) {
      if (screen.figure.kind !== 'interactive') continue;
      const { id, state } = screen.figure;
      seen.add(id);
      const markup = renderToStaticMarkup(<B32IntegratedFigures id={id} initial={state}/>);
      expect(markup).toContain(`data-diagram="${id}"`);
      expect(markup).toContain(`data-state="${state}"`);
      expect(markup).toContain('교육용 시뮬레이션 · 실제 실행 기록이 아닙니다');
      expect(containsSecret(markup)).toBe(false);
    }
    expect([...seen].sort()).toEqual(Object.keys(interactiveStates).sort());
  });

  it('Lab의 Git 비교 기록과 R9 입력·결과를 그대로 사용한다', () => {
    expect(gitComparison.before.status).toBe(' M README.md');
    expect(gitComparison.after.status).toBe('M  README.md');
    expect(gitComparison.after.cached).toBe(gitComparison.before.diff);
    expect(gitComparison.mm).toEqual({ status: 'MM README.md',
      diff: ' 실습 메모: AI가 작성한 초안은 사람이 검토한다.\n+두 번째 메모',
      cached: '+\n+실습 메모: AI가 작성한 초안은 사람이 검토한다.' });
    expect(journeyRows).toHaveLength(7);
    expect(validatorCases.map(({ id }) => id)).toEqual(['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'P1', 'P2', 'P3', 'P4', 'P5']);
    const validatorDesign = design.split('\n').find(line => line.startsWith('| I9 |'));
    for (const { id, name } of validatorCases) expect(validatorDesign).toContain(`${id} ${name}`);
    expect(validatorCases.find(({ id }) => id === 'C4')?.input).toBe('가'.repeat(73));
    expect(validatorCases.find(({ id }) => id === 'P5')?.input).toMatch(/^Title: 가{81}\n/);
    expect(validatorCases.find(({ id }) => id === 'P1')?.input).toContain('- 테스트를 모두 통과했습니다');
    expect(validatorCases.find(({ id }) => id === 'P1')?.processed).toContain('- 실행 권장: python -m unittest discover -s tests');
  });
});
