import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
it('validates the approved B1-1 map and rejects six reviewed contract mutations',()=>{
  expect(()=>execFileSync('python3',['-X','utf8','scripts/test_validate_b11_concept_map.py'],{stdio:'pipe'})).not.toThrow();
});
