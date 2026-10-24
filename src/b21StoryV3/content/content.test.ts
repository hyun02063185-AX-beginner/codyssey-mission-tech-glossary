import { describe, expect, it } from 'vitest';
import { scenes, lectureMap, lectureAreas, relationTypes, relationReviews, comparisonReviews, lectureTasks } from './index';
import type { TeachingScene } from './types';
// @ts-expect-error The read-only Node validator is an intentionally separate .mjs CLI.
import { validateContent, readValidationInputs, manuscriptSteps, legacyFromManuscript, readApprovedPreview, sha256, glossaryCandidates, assertReadOnlyArguments } from '../../../scripts/b21_v3_content_check.mjs';

type Mutable<T> = { -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K] };
const inputs = readValidationInputs();
const mapData = { lectureMap, lectureAreas, relationTypes, relationReviews, comparisonReviews, lectureTasks };
const fixture = () => ({ ...structuredClone(inputs), scenes: structuredClone(scenes) as Mutable<TeachingScene[]>, mapData: structuredClone(mapData) as Mutable<typeof mapData> });
const validate = () => validateContent({ ...inputs, scenes, mapData });

describe('B2-1 v3 U1 approved content foundation', () => {
  it('validates eight ordered scenes, 128 steps, every source and all projected data', () => {
    expect(validate()).toEqual({ scenes: 8, steps: 128, directSentences: 124, approvedSentenceAdaptations: 4, legacy: [16, 13], relations: 5, comparisons: 2, lectureAreas: 7, glossaryCandidates: 18 });
    expect(scenes.map(s => s.steps.length)).toEqual([13, 17, 12, 14, 22, 18, 15, 17]);
  });
  it('keeps Scene 05/06 semantic order and both complete v3.6 mappings', () => {
    expect(scenes[4].steps.slice(0, 9).map(s => s.id)).toEqual(['repeat', 'iterable', 'iter', 'next1', 'next2', 'iterend', 'rel', 'genkind', 'gen']);
    expect(scenes[5].steps.slice(0, 7).map(s => s.id)).toEqual(['reassign', 'pass', 'ret', 'rebind', 'wrapfn', 'prepost', 'deco']);
    expect(scenes[4].legacy).toEqual(['list', 'drop', 'jsonl', 'gen', 'give', 'pause', 'ask', 'resume', 'end', 'drop', 'list', 'keep', 'real', 'check', 'apply', 'wrap']);
    expect(scenes[5].legacy).toEqual(['rep', 'gather', 'deco', 'inner', 'outer', 'ok', 'err', 'real', 'real', 'uses', 'check', 'apply', 'wrap']);
    for (const scene of scenes.slice(4, 6)) expect(legacyFromManuscript(inputs.manuscripts[scene.id], scene.id)).toEqual(scene.legacy);
  });
  it('matches all 128 screen sentences to the approved preview and each numeric/ID manuscript table', () => {
    const preview = readApprovedPreview(inputs.previewText);
    scenes.forEach((scene, i) => {
      expect(scene.steps.map(s => s.say)).toEqual(preview.scenes[i].steps.map((s: { say: string }) => s.say));
      const rows = manuscriptSteps(inputs.manuscripts[scene.id]);
      if (scene.addressing === 'id') expect(rows.map((s: { id: string }) => s.id)).toEqual(scene.steps.map(s => s.id));
    });
  });
  it('preserves every instructor script, question, expected answer, misconception and reveal answer', () => {
    const preview = readApprovedPreview(inputs.previewText);
    scenes.forEach((scene, i) => scene.steps.forEach((step, j) => {
      const original = preview.scenes[i].steps[j];
      expect(step.instructor?.script).toEqual(original.script);
      expect(step.instructor?.expected?.map(q => [q.q, q.a, q.miss])).toEqual(original.qs?.map((q: { q: string; a: string; miss: string }) => [q.q, q.a, q.miss]));
      expect(step.reveal?.answers).toEqual(original.qs?.map((q: { a: string }) => q.a));
      expect('script' in step).toBe(false);
      expect('qs' in step).toBe(false);
    }));
  });
  it('keeps explicit example boundaries, figure parameters and all next/review targets', () => {
    expect(scenes.flatMap(s => s.steps.filter(t => t.real).map(t => `${s.id}:${t.id}`))).toEqual(['02:ledger', '04:use', '05:real', '06:real', '07:real']);
    expect(scenes[0].steps[2].sel).toBeNull();
    expect(scenes[6].steps[3].sub).toBe(0);
    expect(scenes.slice(0, 7).map(s => s.steps.at(-1)?.next?.target)).toEqual([
      { scene: '02', step: '1' }, { scene: '03', step: '1' }, { scene: '04', step: '1' },
      { scene: '05', step: 'repeat' }, { scene: '06', step: 'reassign' }, { scene: '07', step: '1' }, { scene: '08', step: '1' },
    ]);
    expect(scenes[7].steps[5].review).toEqual([{ scene: '05', step: 'iterable' }]);
    expect(scenes[7].steps[12].review).toEqual([{ scene: '04', step: '6' }, { scene: '05', step: 'jsonl' }]);
  });
  it('projects only the five original relations and two comparisons with original wording', () => {
    const original = JSON.parse(inputs.mapText);
    expect([original.nodes.length, original.relations.length, original.comparisons.length]).toEqual([45, 24, 10]);
    expect(Object.keys(lectureMap.relations)).toEqual(['R09', 'R23', 'R28', 'R37', 'R41']);
    expect(Object.keys(lectureMap.comparisons)).toEqual(['C13', 'C30']);
    for (const [id, relation] of Object.entries(lectureMap.relations)) {
      expect(original.relations.find((r: { id: string }) => r.id === id)).toMatchObject(relation);
    }
    expect(original.nodes.some((n: { sceneIds: string[] }) => n.sceneIds.includes('03a'))).toBe(true);
    expect(original.nodes.some((n: { sceneIds: string[] }) => n.sceneIds.includes('03b'))).toBe(true);
    expect(JSON.stringify(lectureMap)).not.toContain('sceneIds');
    expect(JSON.stringify(lectureMap)).not.toContain('termId');
    expect(lectureAreas).toHaveLength(7);
    expect(lectureAreas[2].originalNodeIds).toEqual(['crud', 'id']);
    expect(lectureAreas[5].originalDeepNodeIds).toEqual(['wrapper', 'original']);
  });
  it('checks only the 18 approved glossary IDs and adds no U4 links', () => {
    expect(glossaryCandidates).toHaveLength(18);
    expect(new Set(glossaryCandidates).size).toBe(18);
    for (const id of ['iterable', 'argparse', 'main-py', 'init', 'loop']) expect(glossaryCandidates).not.toContain(id);
    expect(JSON.stringify(scenes)).not.toMatch(/"(?:terms|termId|guideChapter)":/);
    expect(validate).not.toThrow();
  });
  it('uses identical content checks for LF/CRLF checkouts, without ignoring extra whitespace or words', () => {
    const input = fixture();
    for (const id of Object.keys(input.manuscripts)) input.manuscripts[id] = input.manuscripts[id].replace(/\n/g, '\r\n');
    input.previewText = input.previewText.replace(/\n/g, '\r\n');
    input.mapText = input.mapText.replace(/\n/g, '\r\n');
    expect(() => validateContent(input)).not.toThrow();
    expect(sha256('a\n')).not.toBe(sha256('a \n'));
  });

  it.each(scenes.map(scene => scene.id))('rejects an unapproved byte/content change in manuscript %s', id => {
    const input = fixture();
    input.manuscripts[id] += '\n';
    expect(() => validateContent(input)).toThrow('manuscript SHA-256 changed');
  });
  it('rejects missing scenes, missing steps, duplicate IDs and reordered steps', () => {
    const missingScene = fixture(); missingScene.scenes.pop();
    expect(() => validateContent(missingScene)).toThrow('scene count/order');
    const missingStep = fixture(); missingStep.scenes[4].steps.pop();
    expect(() => validateContent(missingStep)).toThrow('step count');
    const duplicate = fixture(); duplicate.scenes[4].steps[1].id = duplicate.scenes[4].steps[0].id;
    expect(() => validateContent(duplicate)).toThrow('missing/duplicate step ID or order');
    const reordered = fixture(); reordered.scenes[5].steps.reverse();
    expect(() => validateContent(reordered)).toThrow('missing/duplicate step ID or order');
  });
  it('rejects a changed sentence and an independently changed manuscript table even if its hash was manually replaced', () => {
    const changed = fixture(); changed.scenes[4].steps[0].say = '변경한 문장';
    expect(() => validateContent(changed)).toThrow('manuscript sentence mismatch');
    const missingRow = fixture();
    missingRow.manuscripts['05'] = missingRow.manuscripts['05'].split('\n').filter((line: string) => !line.startsWith('| 22 | `#5-wrap` |')).join('\n');
    missingRow.integrity.scenes[4].sha256 = sha256(missingRow.manuscripts['05']);
    missingRow.scenes[4].source.sha256 = missingRow.integrity.scenes[4].sha256;
    expect(() => validateContent(missingRow)).toThrow('manuscript step count');
    const source = fixture();
    source.manuscripts['05'] = source.manuscripts['05'].replace('| 1 | `#5-repeat` | F1 | 여러 값에서', '| 1 | `#5-repeat` | F1 | 바뀐 여러 값에서');
    const digest = sha256(source.manuscripts['05']);
    source.integrity.scenes[4].sha256 = digest; source.scenes[4].source.sha256 = digest;
    expect(() => validateContent(source)).toThrow('manuscript sentence mismatch');
  });
  it('independently rejects manuscript address/order/count drift and legacy mapping drift', () => {
    for (const [before, after, error] of [
      ['| 1 | `#5-repeat` |', '| 1 | `#5-changed` |', 'semantic ID/order'],
      ['| 2 | `#5-iterable` |', '| 1 | `#5-iterable` |', 'manuscript step order/duplicates'],
      ['| `#5-1` | 한꺼번에 모으기 | `#5-list` |', '| `#5-1` | 한꺼번에 모으기 | `#5-drop` |', 'manuscript legacy mapping'],
    ]) {
      const input = fixture();
      input.manuscripts['05'] = input.manuscripts['05'].replace(before, after);
      expect(input.manuscripts['05']).not.toBe(inputs.manuscripts['05']);
      input.integrity.scenes[4].sha256 = sha256(input.manuscripts['05']);
      input.scenes[4].source.sha256 = input.integrity.scenes[4].sha256;
      expect(() => validateContent(input)).toThrow(error);
    }
  });
  it('rejects lost scripts, questions, expected answers, reveal answers and notes', () => {
    const script = fixture(); script.scenes[4].steps[0].instructor!.script = [];
    expect(() => validateContent(script)).toThrow('instructor script missing/changed');
    const question = fixture(); question.scenes[4].steps[19].questions = [];
    expect(() => validateContent(question)).toThrow('check questions missing/changed');
    const expected = fixture(); expected.scenes[4].steps[19].instructor!.expected = [];
    expect(() => validateContent(expected)).toThrow('expected answer/misconception missing/changed');
    const answer = fixture(); answer.scenes[4].steps[19].reveal!.answers = [];
    expect(() => validateContent(answer)).toThrow('reveal answers missing/changed');
    const notes = fixture(); notes.scenes[5].instructor.notes = [];
    expect(() => validateContent(notes)).toThrow('instructor notes/deep missing or changed');
  });
  it('rejects missing example metadata, changed figure state, and broken destinations', () => {
    const example = fixture(); example.scenes[5].steps[14].example = 'concept';
    expect(() => validateContent(example)).toThrow('example classification');
    const figure = fixture(); figure.scenes[4].steps[10].sub = 'give';
    expect(() => validateContent(figure)).toThrow('figure state sub');
    const next = fixture(); next.scenes[4].steps[21].next!.target.step = '1';
    expect(() => validateContent(next)).toThrow('next-scene destination');
    const review = fixture(); review.scenes[7].steps[5].review = [];
    expect(() => validateContent(review)).toThrow('review destinations');
  });
  it('rejects source-map changes, changed wording and invented original node IDs', () => {
    const original = fixture(); original.mapText += '\n';
    expect(() => validateContent(original)).toThrow('candidate map SHA-256 changed');
    const relation = fixture(); relation.mapData.lectureMap.relations.R23.label = '바뀐 의미';
    expect(() => validateContent(relation)).toThrow('R23: original relation meaning/wording');
    const comparison = fixture(); comparison.mapData.lectureMap.comparisons.C30.rightText = '바뀐 설명';
    expect(() => validateContent(comparison)).toThrow('C30: original comparison wording');
    const node = fixture(); node.mapData.lectureAreas[2].originalNodeIds.push('search');
    expect(() => validateContent(node)).toThrow('approved lecture area');
    const deep = fixture(); deep.mapData.lectureAreas[5].originalDeepNodeIds.push('reassign');
    expect(() => validateContent(deep)).toThrow('manuscript node mapping');
  });
  it('rejects missing glossary files/graph IDs and preview drift', () => {
    const file = fixture(); file.termFiles.pop();
    expect(() => validateContent(file)).toThrow('18 glossary Markdown files must exist');
    const graph = fixture(); graph.graphTermIds = graph.graphTermIds.filter((id: string) => id !== 'term:csv');
    expect(() => validateContent(graph)).toThrow('missing glossary graph ID: csv');
    const preview = fixture(); preview.previewText += '\n';
    expect(() => validateContent(preview)).toThrow('approved preview SHA-256 changed');
  });
  it('has no automatic hash refresh mode', () => {
    expect(() => assertReadOnlyArguments(['--write'])).toThrow('no approval-hash update mode');
    expect(() => assertReadOnlyArguments(['--source-revision=HEAD'])).toThrow();
    expect(() => assertReadOnlyArguments([])).not.toThrow();
  });
});
