import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { scenes, lectureAreas } from '../content';
import { termConnections, heldTermIds } from './catalog';
import { areaTermIds, learningPresentation } from './presentation';
import { learningLinkExtensions } from '../components/StoryLearningLinks';
import B21TeachingStory from '../B21TeachingStory';

const route=(scene:number,step=0)=>({scene,step,back:scene===4?6:null,presenter:false});
describe('private U4-B placement semantics',()=>{
  it('keeps eight scenes and 128 steps; does not expose extension UI by default',()=>{
    expect(scenes).toHaveLength(8);expect(scenes.reduce((sum,s)=>sum+s.steps.length,0)).toBe(128);
    expect(renderToStaticMarkup(<B21TeachingStory/>)).not.toContain('b21-learning-');
  });
  it('maps all seven selected areas to the exact approved subset, with no held IDs',()=>{
    const expected=[['cli'],['module','repository-pattern','layered-architecture'],['crud','summary-aggregation'],['persistence','file-io','json-lines','csv'],['iterator','generator','yield'],['decorator','function','exception-handling'],['type-hint','input-validation']];
    for(const [i,area] of lectureAreas.entries()){
      const plan=learningPresentation(route(7,i+1));
      expect(plan.area?.id).toBe(area.id);expect(plan.areaTerms.map(t=>t.termId)).toEqual(expected[i]);
      expect(plan.noteTerms).toEqual(plan.areaTerms);expect(areaTermIds[area.id]).toEqual(expected[i]);
      for(const id of heldTermIds)expect(plan.areaTerms.map(t=>t.termId)).not.toContain(id);
    }
    expect(new Set(Object.values(areaTermIds).flat()).size).toBe(18);
  });
  it.each([0,8,9,10,11,12,13,14,15,16])('shows no bulk term list on unselected Scene 08 step %s',step=>{
    const plan=learningPresentation(route(7,step));expect(plan.area).toBeNull();expect(plan.areaTerms).toEqual([]);expect(plan.noteTerms).toEqual([]);
  });
  it('uses scene-specific notes; keeps JSONL in Scene 05 notes but not the selected iteration area',()=>{
    for(let scene=0;scene<7;scene++){
      expect(learningPresentation(route(scene)).noteTerms).toEqual(termConnections.filter(t=>t.sources.some(s=>s.scene===scenes[scene].id)));
    }
    expect(learningPresentation(route(4)).noteTerms.map(t=>t.termId)).toContain('json-lines');
    expect(learningPresentation(route(7,5)).areaTerms.map(t=>t.termId)).not.toContain('json-lines');
  });
  it('shows guides only at each scene last step, with selected-area panel only on selection',()=>{
    for(const [scene,s] of scenes.entries())for(const [step] of s.steps.entries())expect(learningPresentation(route(scene,step)).isSummary).toBe(step===s.steps.length-1);
  });
  it('adds closed notes, preserves extension boundaries, and leaves the approved script intact',()=>{
    const r=route(1,scenes[1].steps.length-1);
    const html=renderToStaticMarkup(<MemoryRouter><B21TeachingStory initialScene={r.scene} initialStep={r.step} extensions={learningLinkExtensions(r)}/></MemoryRouter>);
    expect(html).toContain('data-testid="learning-notes"');expect(html).not.toContain('data-testid="learning-notes" open');
    expect(html).toContain('JavaScript 중심');expect(html).toContain('Python');expect(html).toContain('강사 노트 — 정확성 경계');expect(html).toContain('더 학습하기');
    expect(html).not.toContain('data-testid="learning-area"');
    const summary=renderToStaticMarkup(<MemoryRouter><B21TeachingStory initialScene={2} initialStep={0} extensions={learningLinkExtensions(route(2))}/></MemoryRouter>);
    expect(summary).toContain('같은 계산 기능의 정의가 아닙니다');
  });
});
