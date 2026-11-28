import { interactiveStates, parseIntegratedStoryboard, type StoryAssets } from './parseStoryboardV04';

export const interactiveStatesV05 = {
  ...interactiveStates,
  I4: [...interactiveStates.I4, 'redirect'],
  I5: [...interactiveStates.I5, 'git-cases'],
  I11: ['sentence', 'commit'],
  I12: ['stream'],
} as const;

const screenId = /^(S([1-6])-([1-9][0-9]*)([a-z]?))(?: · |$)/;

function readScreenId(title: string, scene: string, previous?: string) {
  const match = screenId.exec(title);
  if (!match || match[2] !== scene) return;
  const [, id, , number, suffix] = match;
  const prior = previous && screenId.exec(previous);
  if (suffix) {
    return prior && prior[3] === number && prior[4] < suffix ? id : undefined;
  }
  return !prior || BigInt(number) > BigInt(prior[3]) ? id : undefined;
}

export function parseStoryboardV05(markdown: string, assets?: StoryAssets) {
  const lesson = parseIntegratedStoryboard(markdown, {
    version: 'v0.5', screenCounts: [4, 5, 7, 9, 5, 3], states: interactiveStatesV05, readScreenId,
  }, assets);
  for (const { id, figure, result } of lesson.screens) {
    if (figure.kind === 'interactive' && (figure.id === 'I4' || figure.state === 'git-cases') && !result) {
      throw new Error(`B3-2 v0.5 ${id} · 도식에 재현 실습 결과가 필요합니다`);
    }
  }
  return lesson;
}
