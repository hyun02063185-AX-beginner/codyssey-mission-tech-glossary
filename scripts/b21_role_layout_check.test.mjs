import { describe, expect, it } from 'vitest';
import { roleLayoutAssertions } from '../drafts/b2-1-story-map/v3/teaching-preview/qa/role-layout-check.mjs';

function fixture(topHeight = 118, bottomHeight = 118) {
  const keys = ['model', 'repo', 'service', 'cli'], names = ['Model', 'Repository', 'Service', 'CLI'];
  return { viewportWidth: 360, documentWidth: 360, display: 'grid', columns: ['144px', '144px'], rows: [topHeight+'px', bottomHeight+'px'], columnGap: 18, rowGap: 8, grid: { x: 27, y: 170, right: 333, bottom: 178 + topHeight + bottomHeight }, accent: 'rgb(217, 72, 15)', clipped: [], outside: [], textOverlaps: [],
    tiles: keys.map((key, i) => { const x = i % 2 ? 189 : 27, y = i < 2 ? 170 : 178 + topHeight, height = i < 2 ? topHeight : bottomHeight; return { key: 'tile-'+key, role: names[i], box: { x, y, width: 144, height, right: x+144, bottom: y+height }, pressed: false, selected: false, borderColor: 'transparent' }; }) };
}
const failures = (s, baseline, selected) => roleLayoutAssertions(s, baseline, selected).filter(a => !a.ok).map(a => a.label);
describe('Owner-approved role QA invariant', () => {
  it('allows natural heights and changed second-row Y while preserving all 16 invariants', () => {
    expect(roleLayoutAssertions(fixture()).length).toBe(16);
    expect(failures(fixture(138,150),fixture())).toEqual([]);
  });
  it('accepts a correctly selected and accented role', () => {
    const s=fixture();Object.assign(s.tiles[1],{pressed:true,selected:true,borderColor:s.accent});
    expect(failures(s,fixture(),'repo')).toEqual([]);
  });
  it.each([
    ['missing card',s=>s.tiles.pop(),'four roles'],
    ['swapped roles',s=>[s.tiles[0].role,s.tiles[1].role]=[s.tiles[1].role,s.tiles[0].role],'role order and names'],
    ['single column',s=>s.columns=['144px'],'2 by 2 grid'],
    ['misaligned card',s=>s.tiles[2].box.x+=4,'aligned columns'],
    ['uneven row',s=>s.tiles[1].box.bottom-=4,'aligned rows'],
    ['wrong horizontal gap',s=>s.columnGap=20,'horizontal gaps'],
    ['wrong vertical gap',s=>s.rowGap=10,'vertical gaps'],
    ['document exceeds requested viewport',s=>s.documentWidth=361,'no document overflow'],
    ['clipped label',s=>s.clipped=['repository.py'],'no clipped text'],
    ['text outside card',s=>s.outside=['Repository'],'no clipped text'],
    ['text overlap',s=>s.textOverlaps=[['models.py','Model']],'no overlapping text'],
    ['overlapping cards',s=>s.tiles[1].box.x=100,'no overlapping cards'],
    ['stale selected role',s=>s.tiles[0].pressed=true,'selection and accent'],
  ])('rejects %s',(_name,mutate,label)=>{const s=fixture();mutate(s);expect(failures(s,fixture())).toContain(label);});
  it('rejects a selected role without its visual accent',()=>{
    const s=fixture();Object.assign(s.tiles[1],{pressed:true,selected:true});expect(failures(s,fixture(),'repo')).toContain('selection and accent');
  });
  it('retains cross-content horizontal column and gap checks',()=>{
    const s=fixture();const baseline=fixture();baseline.tiles[0].box.x-=2;baseline.rowGap=9;
    expect(failures(s,baseline)).toEqual(['stable role columns across content','stable gaps across content']);
  });
});
