import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const baseline=JSON.parse(readFileSync('scripts/fixtures/b61-glossary-visual-baseline.json','utf8'));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const after=JSON.parse(readFileSync('src/data/generated/glossary.json','utf8'));
const targets=['erd','foreign-key','join'];
const sections=text=>Object.fromEntries(text.replace(/\r\n/g,'\n').split(/^## /m).slice(1).map(part=>{const end=part.indexOf('\n');return [part.slice(0,end).trim(),part.slice(end+1).trim()];}));
describe('approved B6-1 glossary visual integration contracts',()=>{
  it('keeps 523 IDs, canonical metadata and all unrelated generated entries unchanged',()=>{
    expect(after).toHaveLength(523);
    const fields=['id','category','type','importance','missionRefs','relatedTerms'];
    expect(hash(after.map(t=>Object.fromEntries(fields.map(field=>[field,t[field]]))))).toBe(baseline.metadataHash);
    expect(hash(after.filter(t=>![...targets,'cidr','ssh-key'].includes(t.id)))).toBe(baseline.unrelatedHash);
    expect(hash(JSON.parse(readFileSync('src/data/generated/openbook-main-m01.json','utf8')))).toBe(baseline.openbookHash);
  });
  it('preserves all authored sections and the old definitions, examples and review questions',()=>{
    const changed={erd:['정확한 설명','이 미션에서는 왜 필요한가','코드 예'],'foreign-key':['한 줄 설명','쉽게 설명하면','이 미션에서는 왜 필요한가'],join:['정확한 설명','이 미션에서는 왜 필요한가']};
    for(const id of targets){const raw=readFileSync(`content/terms/${id}.md`,'utf8'),source=sections(raw),original=baseline.sections[id],term=after.find(t=>t.id===id);
      expect(term.richSections).toEqual(Object.entries(source).filter(([heading])=>heading!=='관련 용어').map(([heading,body])=>({heading,body})));
      for(const [heading,body]of Object.entries(original)){expect(source).toHaveProperty(heading);if(!changed[id].includes(heading))expect(source[heading],`${id}:${heading}`).toBe(body);}
      for(const field of ['summary','easyExplanation','technicalExplanation','missionContext','limitationsOrEdgeCases','commonMisconceptions','peerReviewQuestions'])expect(term[field]).not.toMatch(/!\[[^\]]*\]\(/);
    }
    expect(after.find(t=>t.id==='foreign-key').limitationsOrEdgeCases).toContain('PRAGMA foreign_keys = ON');
    for(const id of ['cidr','ssh-key'])expect(hash(after.find(t=>t.id===id).richSections)).toBe(baseline.richHashes[id]);
  });
  it('registers six byte-identical approved SVGs with unique accessible IDs and no active content',()=>{
    const allIds=[];
    for(const file of readdirSync('src/assets/glossary/b6-1')){
      const asset=readFileSync(`src/assets/glossary/b6-1/${file}`);expect(asset.equals(readFileSync(`drafts/glossary-visual/b6-1-p0/assets/${file}`))).toBe(true);
      expect(createHash('sha256').update(asset).digest('hex')).toBe(baseline.assetHashes[file]);
      const text=asset.toString('utf8');expect(text).toMatch(/<title id=/);expect(text).toMatch(/<desc id=/);expect(text).not.toMatch(/<script|<foreignObject|\son\w+\s*=|(?:href|src)=["'](?:https?:|javascript:)/i);
      allIds.push(...[...text.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
    }
    expect(readdirSync('src/assets/glossary/b6-1')).toHaveLength(6);expect(new Set(allIds).size).toBe(allIds.length);
  });
});
