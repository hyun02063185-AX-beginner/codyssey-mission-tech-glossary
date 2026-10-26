import data from './data.json';
import {b61ReturnKey,readStoryState,screenHref} from '../b61Story/navigation';
export const conceptPath='/missions/main-M11/story/concepts';
export const mapReturnKey='b61-map';
export function readConceptState(search:string){
 const params=new URLSearchParams(search.slice(0,2049)),clean=new URLSearchParams();
 const node=params.get('node'),relation=params.get('relation');
 if(node&&data.nodes.some(n=>n.id===node))clean.set('node',node);
 else if(relation&&data.relations.some(r=>r.id===relation))clean.set('relation',relation);
 const origin=params.get(b61ReturnKey);
 if(origin){const s=readStoryState('?'+origin);if(!s.notice&&!s.overview&&s.canonical.split('?')[1]===origin)clean.set(b61ReturnKey,origin);}
 const canonical=conceptPath+(clean.size?'?'+clean:'');
 return {node:clean.get('node'),relation:clean.get('relation'),origin:clean.get(b61ReturnKey),canonical,notice:search&&canonical!==conceptPath+search?'잘못된 지도 주소를 정리했습니다.':''};
}
export function conceptHref(index:number){
 return conceptPath+'?'+new URLSearchParams({[b61ReturnKey]:screenHref(index).split('?')[1]});
}
export function learningHref(href:string,mapHref:string){
 const query=mapHref.split('?')[1]??'';
 return href+'?'+new URLSearchParams({[mapReturnKey]:query||'all'});
}
export function readMapReturn(pathname:string,search:string){
 if(!/^\/terms\/[a-z0-9-]+$/.test(pathname)&&!/^\/missions\/main-M11\/guide(?:\/[a-z0-9-]+)?$/.test(pathname))return null;
 if(search.length>4096)return null;
 const p=new URLSearchParams(search);
 if(p.getAll(mapReturnKey).length!==1)return null;
 const value=p.get(mapReturnKey)!;
 if(value==='all')return readConceptState('');
 const state=readConceptState('?'+value);
 return state.notice?null:state;
}
export function carryMapReturn(href:string,pathname:string,search:string){
 const source=readMapReturn(pathname,search);
 if(!source||!(/^(?:\/missions\/main-M11\/guide(?:\/[a-z0-9-]+)?|\/terms\/[a-z0-9-]+)(?:[?#]|$)/.test(href)))return href;
 const [base,hash]=href.split('#'),[path,q='']=base.split('?'),params=new URLSearchParams(q);
 params.set(mapReturnKey,source.canonical.split('?')[1]||'all');
 return path+'?'+params+(hash?'#'+hash:'');
}
