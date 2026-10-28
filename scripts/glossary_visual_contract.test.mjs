import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const baseline=JSON.parse(readFileSync('scripts/fixtures/b61-glossary-visual-baseline.json','utf8'));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const after=JSON.parse(readFileSync('src/data/generated/glossary.json','utf8'));
const batch=JSON.parse(readFileSync('scripts/fixtures/fast-batch-a-baseline.json','utf8'));
const batchB=JSON.parse(readFileSync('scripts/fixtures/fast-batch-b-baseline.json','utf8'));
const batchBTargets=Object.keys(batchB.sources);
const batchC=JSON.parse(readFileSync('scripts/fixtures/fast-batch-c-baseline.json','utf8'));
const batchCTargets=Object.keys(batchC.sources);
const beforeBatchC=after.map(t=>batchC.terms[t.id]??t);
const beforeBatchB=beforeBatchC.map(t=>batchB.terms[t.id]??t);
const batchTargets=Object.keys(batch.sections);
const targets=['erd','foreign-key','join'];
const sections=text=>Object.fromEntries(text.replace(/\r\n/g,'\n').split(/^## /m).slice(1).map(part=>{const end=part.indexOf('\n');return [part.slice(0,end).trim(),part.slice(end+1).trim()];}));
describe('approved B6-1 glossary visual integration contracts',()=>{
  it('keeps 523 IDs, canonical metadata and all unrelated generated entries unchanged',()=>{
    expect(after).toHaveLength(523);
    const fields=['id','category','type','importance','missionRefs','relatedTerms'];
    expect(hash(after.map(t=>Object.fromEntries(fields.map(field=>[field,t[field]]))))).toBe(baseline.metadataHash);
    expect(hash(beforeBatchB.filter(t=>![...targets,...batchTargets,'cidr','ssh-key'].includes(t.id)))).toBe(batch.unrelatedHash);
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
      // Git may check SVG text out with CRLF on Windows; compare approved
      // content independently of checkout EOL while keeping the copy check above.
      expect(createHash('sha256').update(asset.toString('utf8').replace(/\r\n/g,'\n')).digest('hex')).toBe(baseline.assetHashes[file]);
      const text=asset.toString('utf8');expect(text).toMatch(/<title id=/);expect(text).toMatch(/<desc id=/);expect(text).not.toMatch(/<script|<foreignObject|\son\w+\s*=|(?:href|src)=["'](?:https?:|javascript:)/i);
      allIds.push(...[...text.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
    }
    expect(readdirSync('src/assets/glossary/b6-1')).toHaveLength(6);expect(new Set(allIds).size).toBe(allIds.length);
  });
});


describe('Fast Batch A reuse and content contracts',()=>{
  it('keeps all six source sections in order and preserves examples, related terms and questions',()=>{
    for(const id of batchTargets){
      const source=sections(readFileSync(`content/terms/${id}.md`,'utf8')),before=sections(batch.sections[id]),term=after.find(t=>t.id===id);
      expect(Object.keys(source)).toEqual(Object.keys(before));
      expect(term.richSections).toEqual(Object.entries(source).filter(([heading])=>heading!=='관련 용어').map(([heading,body])=>({heading,body})));
      expect(term.richSections.flatMap(s=>[...s.body.matchAll(/!\[.*?\]\((.*?)\)/g)])).toHaveLength(1);
      for(const heading of ['한 줄 설명','쉽게 설명하면','코드 예','관련 용어','동료평가 질문'])if(before[heading])expect(source[heading]).toBe(before[heading]);
      for(const field of ['technicalExplanation','missionContext'])expect(term[field]).not.toContain('![');
    }
  });
  it('reuses approved source bytes without active content and registers every new image',()=>{
    const pairs=[
      ...['f5-dom-desktop.svg','f5-dom-mobile.svg','f5-event-mobile.svg'].map(name=>[`src/assets/glossary/b1-1/${name}`,`content/mission-stories/main-m01/assets/${name}`]),
      ['src/assets/glossary/b2-1/v04-generator-streaming-mobile.svg','content/mission-guides/main-m03/assets/mobile/v04-generator-streaming.svg'],
    ];
    for(const [copy,original]of pairs){
      const text=readFileSync(copy,'utf8');expect(text).toBe(readFileSync(original,'utf8'));expect(text).toContain('<title>');expect(text).toMatch(/aria-label=/);
      expect(text).not.toMatch(/<script|<foreignObject|\son\w+\s*=|(?:href|src)=["'](?:https?:|javascript:)/i);
    }
    const renderer=readFileSync('src/TermRichContent.tsx','utf8');
    for(const id of batchTargets)for(const section of after.find(t=>t.id===id).richSections)for(const match of section.body.matchAll(/!\[.*?\]\((.*?)\)/g))expect(renderer).toContain(`'${match[1]}'`);
  });
});


describe('Fast Batch B shared IP visual contracts',()=>{
  it('changes only the two target generated entries and preserves every existing source paragraph',()=>{
    expect(hash(beforeBatchC.filter(t=>!batchBTargets.includes(t.id)))).toBe(batchB.unrelatedHash);
    for(const id of batchBTargets){
      const original=sections(batchB.sources[id]),source=sections(readFileSync(`content/terms/${id}.md`,'utf8')),term=after.find(t=>t.id===id);
      expect(Object.keys(source)).toEqual(Object.keys(original));
      for(const [heading,body]of Object.entries(original)){
        if(heading==='정확한 설명')expect(source[heading].startsWith(body+'\n\n')).toBe(true);
        else expect(source[heading]).toBe(body);
      }
      expect(term.richSections).toEqual(Object.entries(source).filter(([heading])=>heading!=='관련 용어').map(([heading,body])=>({heading,body})));
      expect(term.technicalExplanation).not.toContain('![');
      expect(term.richSections.flatMap(s=>[...s.body.matchAll(/!\[.*?\]\((.*?)\)/g)]).map(m=>m[1])).toEqual(['assets/public-private-ip.svg']);
    }
  });
  it('provides exactly two accessible SVG editions with identical concepts and isolated IDs/styles',()=>{
    const allIds=[],descs=[];
    expect(readdirSync('src/assets/glossary/b3-1')).toEqual(['public-private-ip-desktop.svg','public-private-ip-mobile.svg']);
    for(const edition of ['desktop','mobile']){
      const svg=readFileSync(`src/assets/glossary/b3-1/public-private-ip-${edition}.svg`,'utf8');
      const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);allIds.push(...ids);
      expect(svg).toMatch(/<title id="gvb3-ip-/);expect(svg).toMatch(/<desc id="gvb3-ip-/);expect(svg).toContain('role="img"');
      for(const ref of svg.matchAll(/url\(#([^)]+)\)/g))expect(ids).toContain(ref[1]);
      expect(svg).not.toMatch(/<script|<foreignObject|\son\w+\s*=|(?:href|src)=["'](?:https?:|javascript:)|<animate/i);
      expect(svg).toContain('.gvb3-ip .');descs.push(svg.match(/<desc[^>]*>(.*?)<\/desc>/s)[1]);
      for(const label of ['203.0.113.10','10.0.0.0/16','10.0.1.0/24','10.0.1.x','공인 IP ≠ Public Subnet','NAT Gateway','현재 AWS 운영 상태','문서용 예시'])expect(svg).toContain(label);
    }
    expect(new Set(allIds).size).toBe(allIds.length);expect(descs[0]).toBe(descs[1]);
  });
});


describe('Fast Batch C beginner visual contracts',()=>{
  it('keeps unrelated entries, source section order, existing code, related terms and questions',()=>{
    expect(hash(after.filter(t=>!batchCTargets.includes(t.id)))).toBe(batchC.unrelatedHash);
    for(const id of batchCTargets){
      const source=sections(readFileSync(`content/terms/${id}.md`,'utf8')),original=sections(batchC.sources[id]),term=after.find(t=>t.id===id);
      expect(Object.keys(source)).toEqual(Object.keys(original));
      for(const heading of ['한 줄 설명','관련 용어','동료평가 질문','흔한 오해','코드 예'])if(original[heading])expect(source[heading]).toBe(original[heading]);
      expect(term.richSections).toEqual(Object.entries(source).filter(([heading])=>heading!=='관련 용어').map(([heading,body])=>({heading,body})));
      expect(term.richSections.flatMap(s=>[...s.body.matchAll(/!\[.*?\]\((.*?)\)/g)])).toHaveLength(1);
      expect(term.easyExplanation).not.toContain('![');expect(term.technicalExplanation).not.toContain('![');
    }
    const packet=sections(readFileSync('content/terms/packet.md','utf8'));
    expect(packet['이 미션에서는 왜 필요한가']).toBe(sections(batchC.sources.packet)['이 미션에서는 왜 필요한가']);
    expect(packet['정확한 설명']).toContain('HTTP/3는 QUIC');expect(packet['정확한 설명']).toContain('TCP는 암호화나 HTTP 요청의 성공을 보장하지 않습니다');
  });
  it('provides four accessible static SVGs, matching edition descriptions and globally unique IDs',()=>{
    const allIds=[];expect(readdirSync('src/assets/glossary/p2')).toHaveLength(4);
    for(const kind of ['packet-layers','responsive-layout']){
      const descriptions=[];
      for(const edition of ['desktop','mobile']){
        const svg=readFileSync(`src/assets/glossary/p2/${kind}-${edition}.svg`,'utf8');
        const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);allIds.push(...ids);
        expect(svg).toContain('role="img"');expect(svg).toMatch(/<title id="gvc-/);expect(svg).toMatch(/<desc id="gvc-/);
        for(const ref of svg.match(/aria-labelledby="([^"]+)"/)[1].split(' '))expect(ids).toContain(ref);
        expect(svg).not.toMatch(/<script|<foreignObject|<image|<animate|\son\w+\s*=|(?:href|src)=["'](?:https?:|javascript:)/i);
        descriptions.push(svg.match(/<desc[^>]*>(.*?)<\/desc>/s)[1]);expect(svg).toContain(`.gvc-${kind} .`);
        if(kind==='packet-layers')for(const label of ['198.51.100.25','203.0.113.10','51514','80','GET /','IP 헤더','TCP 헤더','문서용','HTTP/3','MAC'])expect(svg).toContain(label);
        else for(const label of ['HTML','CSS','Media Query','Breakpoint','768px','1024px','A 소개','B 작업','C 연락'])expect(svg).toContain(label);
      }
      expect(descriptions[0]).toBe(descriptions[1]);
    }
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
