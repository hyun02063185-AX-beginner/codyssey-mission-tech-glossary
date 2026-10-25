import { explorerData, nodeById, typeMeanings } from './adapter';
import { parseStorySource, storySource } from '../b21StoryV3/links/returnAddress';
import { b21ConceptPath, b21PreviewConceptPath, type ExplorerPath } from '../b21Learning/paths';

export const explorerPath = b21PreviewConceptPath;
export interface ExplorerState {
  area: string | null; node: string | null; relation: string | null; comparison: string | null;
  type: string; mode: 'free' | 'guided'; path: string; at: number; origin: string | null;
}
export const initialExplorer: ExplorerState = {area:null,node:null,relation:null,comparison:null,type:'all',mode:'free',path:'P1',at:0,origin:null};
const keys = ['area','node','relation','comparison','type','mode','path','at','origin'];
export function readExplorer(search: string): {state: ExplorerState; notice: string} {
  const state = {...initialExplorer};
  const query = new URLSearchParams(search);
  let invalid = search.length > 1600 || [...query.keys()].some(key => !keys.includes(key) || query.getAll(key).length !== 1);
  if (invalid) return {state, notice:'잘못된 지도 주소를 기본 화면으로 복구했습니다.'};
  const pick = (key: 'area'|'node'|'relation'|'comparison', valid: boolean) => {
    if(query.has(key)){if(valid) state[key]=query.get(key); else invalid=true;}
  };
  pick('area', explorerData.areas.some(a=>a.id===query.get('area')));
  pick('node', nodeById.has(query.get('node')??''));
  pick('relation', explorerData.relations.some(r=>r.id===query.get('relation')));
  pick('comparison', explorerData.comparisons.some(c=>c.id===query.get('comparison')));
  if(query.has('type')) {if(query.get('type')==='all'||Object.hasOwn(typeMeanings,query.get('type')!))state.type=query.get('type')!;else invalid=true;}
  if(query.has('mode')) {if(query.get('mode')==='guided')state.mode='guided';else if(query.get('mode')!=='free')invalid=true;}
  if(query.has('path')) {if(explorerData.teacherPaths.some(p=>p.id===query.get('path')))state.path=query.get('path')!;else invalid=true;}
  const path=explorerData.teacherPaths.find(p=>p.id===state.path)!;
  if(query.has('at')){const value=query.get('at')!;if(/^\d+$/.test(value)&&Number(value)<path.steps.length)state.at=Number(value);else invalid=true;}
  if(query.has('origin')){const source=parseStorySource(query.get('origin')!);if(source)state.origin=storySource(source);else invalid=true;}
  if(state.mode==='guided') {state.node=path.steps[state.at].nodeId;state.relation=null;state.comparison=null;state.type='all';}
  if(state.relation){const rel=explorerData.relations.find(r=>r.id===state.relation)!;state.node=state.node&&[rel.from,rel.to].includes(state.node)?state.node:rel.from;state.type='all';}
  if(state.node)state.area=nodeById.get(state.node)!.area;
  return {state, notice:invalid?'유효하지 않은 선택을 해제했습니다. 연결 보류 항목은 자동 연결하지 않습니다.':''};
}
export function explorerQuery(state: ExplorerState) {
  const query=new URLSearchParams();
  for(const key of keys as (keyof ExplorerState)[]) {
    const value=state[key];
    if(value!==null&&value!==initialExplorer[key])query.set(key,String(value));
  }
  return query.toString();
}
export function explorerHref(state: ExplorerState, path: ExplorerPath=explorerPath) {const query=explorerQuery(state);return path+(query?'?'+query:'');}
/** Return payloads are local state tokens, never arbitrary URLs or nested returns. */
export function validExplorerReturn(value: unknown, expectedPath: ExplorerPath=explorerPath): string | null {
  if(typeof value!=='string'||value.length>2400||!value.startsWith(expectedPath))return null;
  const [path,query='',extra]=value.split('?');
  if(path!==expectedPath||extra!==undefined||![explorerPath,b21ConceptPath].includes(expectedPath))return null;
  const result=readExplorer(query);
  return result.notice?null:explorerHref(result.state,expectedPath);
}

/** Explicitly bounded internal choices; the Previous button never uses unknown browser history. */
export function explorerTrail(value: unknown, path: ExplorerPath) {
  if(!Array.isArray(value)||value.length>20)return [];
  return value.map(item=>validExplorerReturn(item,path)).filter((item):item is string=>item!==null);
}
