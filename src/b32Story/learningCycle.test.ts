import { describe, expect, it } from 'vitest';
import { getLab, labs, labHref, mainScreen, readLabOrigin, readStoryReturn, resultIndex, storyFor, tripFor, tripsFrom } from './labContent';
import { reviewLesson } from './reviewLessonContent';
import { screens } from './lessonContent';
import assets from '../../content/mission-stories/main-m06/assets/evidence/context-readme-2026-11-25.txt?raw';

describe('B3-2 learning cycle content', () => {
  it('keeps the eight screen identities, questions and presentation content', () => {
    expect(reviewLesson.screens).toHaveLength(8);
    for (const [index, screen] of reviewLesson.screens.entries()) {
      const approved = screens[index];
      expect(screen).toMatchObject({ id: approved.id, title: approved.title, question: approved.question,
        message: approved.message, scene: approved.scene, check: approved.check, wrapUp: approved.wrapUp });
      expect(screen.practice).toBeTruthy();
      expect(screen.explanation).toBeTruthy();
    }
    expect([...assets.replace(/\n$/, '')]).toHaveLength(535);
    expect(reviewLesson.screens[5].explanation).toContain('HTTP 오류(예: 400)');
  });

  it('parses nine complete A/B/C lessons directly from the Markdown', () => {
    expect(labs).toHaveLength(9);
    for (const lab of labs) {
      expect(lab.questions).toContain('실행 전 질문');
      expect(lab.commands).toMatch(/```(?:zsh|bash)/);
      expect(lab.observations).toContain('관찰 목록');
      expect(lab.results).toContain('핵심 결과');
      expect(lab.optional).toBeTruthy();
      expect(lab.troubleshooting).toBeTruthy();
      expect(lab.example?.answer).toBeTruthy();
      expect(tripFor(mainScreen(lab.id), lab.id)).toBeDefined();
    }
    expect(labs[2].commands).toContain('grep -qxF');
    expect(labs[2].commands).toContain('git rev-parse --show-toplevel');
    expect(labs[3].commands).toMatch(/python3 - <<'EOF'[\s\S]*?\nEOF\n```/);
    expect(labs[6].troubleshooting).toContain('정확히 어떤 문자가 들어 있었는지는 확인하지 못했습니다');
    expect(labs[7].results).toContain('이 응답은 COMMIT·PR 초안을 만든 요청의 응답이 아닙니다');
    expect(labs[8].results).toContain('별도로 AI를 한 번 더 호출');
  });

  it('validates the index and all authored round-trip links', () => {
    const cards = reviewLesson.screens.flatMap(screen => tripsFrom(screen.id));
    expect(cards.map(card => card.id).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))).toEqual(
      Array.from({ length: 11 }, (_, i) => `K${i + 1}`),
    );
    for (const card of cards) {
      expect([card.question, card.observe, card.focus, card.check].every(Boolean)).toBe(true);
      for (const lab of card.labs) {
        expect(getLab(lab)).toBeDefined();
        expect(readLabOrigin(`?from=${card.screen}`, lab)).toBe(card.screen);
        expect(readStoryReturn(`?from-lab=${lab}`, card.screen)).toBe(lab);
      }
    }
    expect(resultIndex).toHaveLength(19);
    expect(resultIndex.every(row => row.targets.length && row.targets.every(target => getLab(target.lab)) &&
      row.screens.length && row.screens.every(id => screens.some(screen => screen.id === id)))).toBe(true);
    expect(resultIndex[0].output).toContain('AI API 요청 횟수: 0');
    expect(labHref('03', 'S1-2', '#b')).toBe('/missions/main-M06/lab/03?from=S1-2#b');
    expect(storyFor('S1-2', '03')).toBe('/missions/main-M06/story?scene=1&screen=2&from-lab=03');
  });

  it('falls back to the lab primary screen for malformed, duplicate and unrelated origins', () => {
    for (const search of ['', '?from=S9-9', '?from=S3-2', '?from=S3-1&from=S1-2', '?from=https://example.test']) {
      expect(readLabOrigin(search, '03')).toBe('S1-2');
    }
    for (const search of ['', '?from-lab=10', '?from-lab=05', '?from-lab=04&from-lab=03']) {
      expect(readStoryReturn(search, 'S1-2')).toBeUndefined();
    }
    expect(readLabOrigin('?from=intro', '01')).toBe('intro');
    expect(readLabOrigin('?from=S3-1', '03')).toBe('S3-1');
  });
});
