import { describe, expect, it } from 'vitest';
import { scenes } from '../content';
import { adjacent, resolveStoryRoute, routeURL, storyPath } from './storyRoute';
describe('U3 address contract', () => {
  it('round trips all 128 steps and preserves safe return positions', () => {
    let count = 0;
    for (const [scene,s] of scenes.entries()) for (const [step] of s.steps.entries()) {
      const route = {scene,step,back:scene===7?null:6,presenter:false};
      const url = routeURL(route), [path,query] = url.split('?');
      expect(resolveStoryRoute(path,'?'+query)).toMatchObject({route,changed:false,notice:''}); count++;
    }
    expect(count).toBe(128);
  });
  it('maps all 29 v3.6 legacy tokens to approved semantic IDs', () => {
    for (const scene of [4,5]) for (const [index,id] of scenes[scene].legacy!.entries()) {
      const result=resolveStoryRoute(storyPath,`?scene=${scenes[scene].id}&step=${index+1}`);
      expect(scenes[scene].steps[result.route.step].id).toBe(id);
      expect(result.changed).toBe(true);
    }
  });
  it.each(['0','-1','999','NaN','Infinity','1.5','1e2','+1','%20','%ZZ','iterableX','https://evil.test','//evil.test','%00','%0A','[]','null','undefined','1/2','<script>','💥','-0'])('recovers bad step %s in its valid scene', token => {
    const result=resolveStoryRoute(storyPath,`?scene=06&step=${token}`);
    expect(result.route).toMatchObject({scene:5,step:0}); expect(result.notice).not.toBe('');
  });
  it('strips unsafe, duplicate and oversized inputs', () => {
    for (const query of ['?scene=05&step=iterable&back=https://evil.test','?scene=05&step=iterable&back=0','?scene=05&step=iterable&back=18','?scene=05&step=iterable&scene=06','?scene=05&step=iterable&x=y','?scene=05&step=iterable&view=other','?scene=05&step=iterable&x='+ 'x'.repeat(600)]) {
      const r=resolveStoryRoute(storyPath,query);expect(r.notice).not.toBe('');expect(r.route.scene).toBe(4);expect(r.canonical).not.toContain('evil');
    }
    expect(resolveStoryRoute('/bad','?scene=99&step=1').route.scene).toBe(0);
  });
  it('has bounded sequential traversal across scene boundaries', () => {
    let p={scene:0,step:0}; const seen=new Set<string>();
    for(let i=0;i<128;i++){seen.add(`${p.scene}:${p.step}`);p=adjacent(p,1);}
    expect(seen.size).toBe(128);expect(p).toEqual({scene:7,step:16});
    for(let i=0;i<127;i++)p=adjacent(p,-1);expect(adjacent(p,-1)).toEqual({scene:0,step:0});
  });
});
