import evidence from '../../content/mission-stories/main-m06/assets/evidence/repro-v0.5-claude-2026-11-28.txt?raw';
import maxTokensRecord from '../../content/mission-stories/main-m06/assets/evidence/max-tokens-v0.5-claude-2026-11-28.json';
import { parseGfmTable } from './parseStoryboardV04';

function requireEvidence<T>(value: T | null | undefined, name: string): T {
  if (value == null) throw new Error(`B3-2 v0.5 근거 누락 · ${name}`);
  return value;
}

const redirectRecord = requireEvidence(evidence.match(/^## R11 · [^\n]+\n([\s\S]*?)(?=^## )/m)?.[1], 'R11');
const redirect = requireEvidence(redirectRecord.match(
  /^\(b\) [^`\n]+`([^`]+)`\n\n화면에 나온 줄: ([^\n]+)\nout\.txt 내용:\n([\s\S]*?)\n\n메모/m,
), 'R11 파일 출력');
export const inheritedStdout = {
  command: redirect[1], screenOutput: redirect[2], file: redirect[3],
  pipeComparison: requireEvidence(redirect[3].match(/^PIPE 지정 → .+$/m)?.[0], 'R11 PIPE 비교'),
};

export function captureCases(output: string) {
  const cases = output.split(/\n(?=----- ②)/);
  if (cases.length !== 2) throw new Error('B3-2 v0.5 R6 · 실습 결과 두 구획이 필요합니다');
  return cases;
}

export function gitCases(output: string) {
  const cases = output.split(/\n(?====== [②③④])/).map(chunk => {
    const match = requireEvidence(chunk.match(
      /^===== ([^\n]+) =====\ncwd: ([^\n]+) \| command: ([^\n]+)\nreturncode: (\d+)\nstdout: ([^\n]*)\nstderr: ([^\n]*)$/,
    ), 'R10 Git 사례');
    const [, name, cwd, command, returncode, stdout, stderr] = match;
    return { name, cwd, command, returncode: Number(returncode), stdout, stderr };
  });
  if (cases.length !== 4 || cases.map(item => item.name[0]).join('') !== '①②③④') {
    throw new Error('B3-2 v0.5 R10 · 번호 순서대로 Git 사례 네 개가 필요합니다');
  }
  return cases;
}

export function temperatureCandidates(table: string) {
  const [header, ...rows] = requireEvidence(parseGfmTable(table), 'I11 도식 표');
  if (header[1] !== '기준 확률 (1.0)' || header[2] !== '0.2' || header[3] !== '2.0' || rows.length !== 8) {
    throw new Error('B3-2 v0.5 I11 · 확률 표 열과 후보 8개를 확인해 주세요');
  }
  const candidates = rows.map(([label, probability, low, high]) => {
    const value = Number(probability?.replace(/%$/, '')) / 100;
    if (!label || !probability?.endsWith('%') || !(value > 0 && value <= 1) || !low || !high) {
      throw new Error('B3-2 v0.5 I11 · 후보와 기준 확률이 필요합니다');
    }
    return { label, probability: value, low, high };
  });
  const sentence = candidates.slice(0, 4), commit = candidates.slice(4);
  for (const group of [sentence, commit]) {
    if (Math.abs(group.reduce((sum, candidate) => sum + candidate.probability, 0) - 1) > 1e-9) {
      throw new Error('B3-2 v0.5 I11 · 기준 확률 합이 100%여야 합니다');
    }
  }
  return { sentence, commit };
}

export function temperatureProbabilities(baseline: readonly number[], temperature: number) {
  if (temperature === 0) {
    const highest = baseline.indexOf(Math.max(...baseline));
    return baseline.map((_, index) => Number(index === highest));
  }
  const weights = baseline.map(probability => probability ** (1 / temperature));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map(weight => weight / total);
}

export function formatProbability(probability: number) {
  const percent = probability * 100;
  return percent > 0 && percent < .05 ? '0.1% 미만' : `${percent.toFixed(1)}%`;
}

export const tokenPresets = [8, 20, 40, 48, 52, 57, 80] as const;
export const assumedReasoning = 30;
export { maxTokensRecord };
const draftEnds = [...maxTokensRecord.draft.matchAll(/\S+/g)].map(piece => piece.index + piece[0].length);

export function draftPrefix(units: number) {
  return maxTokensRecord.draft.slice(0, units ? draftEnds[units - 1] : 0);
}

export function tokenRun(limit: number, reasoning: boolean) {
  const reasoningUnits = reasoning ? Math.min(assumedReasoning, limit) : 0;
  const visibleUnits = Math.min(maxTokensRecord.total_units, limit - reasoningUnits);
  return {
    reasoningUnits, visibleUnits, remaining: limit - reasoningUnits - visibleUnits,
    complete: visibleUnits === maxTokensRecord.total_units, result: maxTokensRecord.results[visibleUnits],
  };
}
