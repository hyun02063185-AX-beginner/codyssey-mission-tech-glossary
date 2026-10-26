import {describe,it,expect} from 'vitest';
import schema from '../../content/mission-stories/main-m11/_tools/erd-detail-source/01_schema.sql?raw';
import mermaid from '../../content/mission-stories/main-m11/_tools/erd-detail-source/erd.mmd?raw';
import source from '../../content/mission-stories/main-m11/_tools/erd-detail-source/source.json';
import desktop from '../../content/mission-stories/main-m11/assets/detail/erd-detail-desktop.svg?raw';
import mobile from '../../content/mission-stories/main-m11/assets/detail/erd-detail-mobile.svg?raw';

const tables=[...schema.matchAll(/CREATE TABLE (\w+)\s*\(([\s\S]*?)\n\);/g)].map(([,name,body])=>{
  const references=Object.fromEntries([...body.matchAll(/FOREIGN KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)/g)].map(([,key,table,column])=>[key,`${table}.${column}`]));
  const columns=[...body.matchAll(/^\s*(\w+)\s+(INTEGER|TEXT|DATE)\b([^\n]*)/gm)].map(([,name,type,rest])=>({name,type,key:rest.includes('PRIMARY KEY')?'PK':references[name]?'FK':'',references:references[name]??''}));
  return {name,columns};
});
describe('B6-1 detailed ERD matches the original schema, not the simplified slides',()=>{
  it('pins the original repository and preserves all six Mermaid/SQL tables and 25 columns',()=>{
    expect(source.commit).toBe('8b99440c830fddc6f78c1440cff8fa2591d47884');
    expect(tables).toHaveLength(6);expect(tables.flatMap(table=>table.columns)).toHaveLength(25);
    const blocks=[...mermaid.matchAll(/^    (\w+)\s*\{([^}]+)\}/gm)];expect(blocks).toHaveLength(6);
    for(const [,name,body]of blocks){
      const columns=[...body.matchAll(/^\s*(INTEGER|TEXT|DATE)\s+(\w+)(?:\s+(PK|FK))?/gm)].map(([,type,name,key=''])=>({name,type,key}));
      expect(columns).toEqual(tables.find(table=>table.name===name.toLowerCase())!.columns.map(({references:_,...column})=>column));
    }
  });
  for(const [layout,svg]of [['desktop',desktop],['mobile',mobile]])it(`${layout} SVG contains each complete column/type/PK/FK and all five exact relationships`,()=>{
    const blocks=[...svg.matchAll(/<g data-table="(\w+)">([\s\S]*?)(?=<g data-table=|<\/svg>)/g)];expect(blocks).toHaveLength(6);
    for(const [,name,body]of blocks){
      const columns=[...body.matchAll(/<g data-column="(\w+)" data-type="(\w+)" data-key="(\w*)" data-references="([^"]*)">/g)].map(([,name,type,key,references])=>({name,type,key,references}));
      expect(columns).toEqual(tables.find(table=>table.name===name)!.columns);
    }
    const relations=[...svg.matchAll(/data-parent="(\w+)" data-child="(\w+)" data-child-key="(\w+)" data-parent-key="(\w+)"/g)].map(([,parent,child,fk,pk])=>`${child}.${fk} → ${parent}.${pk}`).sort();
    expect(relations).toEqual(tables.flatMap(table=>table.columns.filter(column=>column.key==='FK').map(column=>`${table.name}.${column.name} → ${column.references}`)).sort());
    expect(relations).toHaveLength(5);expect(svg.match(/data-key="PK"/g)).toHaveLength(6);
    expect(svg).toMatch(/<desc[^>]*>.*student:.*school_level TEXT.*joined_at DATE.*score:/);
  });
  it('only uses self-contained vector assets and the existing explicit presentation palette',()=>{
    for(const svg of [desktop,mobile]){
      expect(svg).not.toMatch(/<(script|foreignObject|iframe|image)\b|\son[a-z]+\s*=|<!DOCTYPE|@import|filter\s*:/i);
      expect(svg).not.toMatch(/(?:href|xlink:href)\s*=\s*["'](?!#)|url\(\s*["']?(?!#)[a-z]/i);
      expect(svg).toContain('var(--presentation-bg,');expect(svg).toContain('var(--presentation-ink,');
      expect(svg).toContain('role="img" aria-labelledby="b61d-title b61d-description"');
    }
  });
});
