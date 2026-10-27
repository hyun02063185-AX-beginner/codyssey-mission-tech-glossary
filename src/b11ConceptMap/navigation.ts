import source from '../../data/mission-story-maps/main-m01/concept-map.json';
import {conceptPath,screens,storyPath} from '../b11Story/content';
import {readStoryState,screenHref,validStoryQuery} from '../b11Story/navigation';
import {readMapState,stateParams} from '../missionConceptMap/conceptMapAdapter';
import type {ConceptMapData,MapState} from '../missionConceptMap/conceptMapTypes';
import type {ConceptMapNavigation} from '../missionConceptMap/ConceptMapNavigation';
export const data=source as unknown as ConceptMapData;
export function detailOwner(id:string){return data.contrasts.find(card=>card.id===id)?.nodeIds[0]??data.nodes.find(node=>node.extensions?.some(extension=>extension.id===id))?.id;}
export function selectionExtras(params:URLSearchParams,state:MapState){
  const id=params.get('detail'),owner=id?detailOwner(id):undefined;
  return new URLSearchParams(id&&owner&&state.selection?.kind==='node'&&state.selection.id===owner?{detail:id}:{});
}
export function mapQuery(query:string){
  const input=new URLSearchParams(query.slice(0,2049)),state=readMapState(data,input).state,result=stateParams(state);
  const origin=validStoryQuery(input.get('story'));
  if(origin)result.set('story',origin);
  selectionExtras(input,state).forEach((value,key)=>result.set(key,value));
  return result.toString();
}
export function conceptHref(index?:number,ref?:string){
  const params=new URLSearchParams();
  if(index!==undefined){params.set('story',screenHref(index).split('?')[1]);ref??=screens[index]?.map.find(id=>id.startsWith('N'))??screens[index]?.map[0];}
  if(ref){if(ref.startsWith('N')&&data.nodes.some(node=>node.id===ref))params.set('node',ref);else if(ref.startsWith('R')&&data.relations.some(rel=>rel.id===ref))params.set('rel',ref);else {const owner=detailOwner(ref);if(owner){params.set('node',owner);params.set('detail',ref);if(data.contrasts.find(card=>card.id===ref)?.nodeIds.some(id=>data.nodes.find(node=>node.id===id)?.importance==='supplementary'))params.set('more','1');}}}
  const query=mapQuery(params.toString());
  return conceptPath+(query?'?'+query:'');
}
export const referenceHref=(index:number,id:string)=>conceptHref(index,id);
export function referenceLabel(id:string){return data.nodes.find(node=>node.id===id)?.label??data.relations.find(rel=>rel.id===id)?.label??data.contrasts.find(card=>card.id===id)?.title??data.nodes.flatMap(node=>node.extensions??[]).find(extension=>extension.id===id)?.title??id;}
export function readMapReturn(path:string,search:string){
  if(!/^\/terms\/[a-z0-9-]+$/.test(path)||search.length>4096)return null;
  const params=new URLSearchParams(search);
  if(params.getAll('b11-map').length!==1)return null;
  const value=params.get('b11-map')!;
  if(value.length>2048||mapQuery(value)!==value)return null;
  const origin=validStoryQuery(new URLSearchParams(value).get('story'));
  return {canonical:conceptPath+(value?'?'+value:''),origin:origin?storyPath+'?'+origin:null};
}
export const navigation:ConceptMapNavigation={
  missionId:'main-m01',title:data.title,originKey:'story',defaultScene:'S1-1',returnKey:'b11-map',origin:validStoryQuery,
  scene:id=>id==='intro'||screens.some(screen=>screen.id===id)?id:null,sceneLabel:id=>id==='intro'?'강의 소개':id,
  storyHref:id=>{if(id==='intro')return storyPath;const index=screens.findIndex(screen=>screen.id===id);return index>=0?screenHref(index):storyPath+'?'+(validStoryQuery(id)??readStoryState('?scene=1&screen=1').canonical.split('?')[1]);},
  conceptHref:query=>conceptPath+(mapQuery(query)?'?'+mapQuery(query):''),mapQuery,selectionExtras,
  searchPlaceholder:'HTML, CSS, DOM…',initialFit:true,missionLegend:true,
  help:'HTML은 브라우저가 해석해 DOM이 되고, JavaScript는 DOM을 읽고 바꾸며, CSS 규칙은 요소에 맞게 계산되어 화면에 반영됩니다. 교육용 단순화입니다.',
};
