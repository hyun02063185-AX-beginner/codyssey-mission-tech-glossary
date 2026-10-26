import data from './data.json';
import {adaptConceptMap,layoutConceptMap,relationPath} from '../missionConceptMap/conceptMapAdapter';
import type {ConceptMapData} from '../missionConceptMap/conceptMapTypes';

export {data};
export const nodeById=new Map(data.nodes.map(n=>[n.id,n]));
export type ConceptNode=typeof data.nodes[number];
// The existing engine supplies geometry only. B6-1 retains its own content and semantics.
const geometry:ConceptMapData={
 mapId:'b61-geometry',title:'',question:'',
 nodes:data.nodes.map(n=>({id:n.id,label:n.label,region:n.area,order:['erd','relationship','fk','pk','table','row','column','database','dbms','sql','join'].indexOf(n.id),domain:'common',importance:'core',conceptType:'',implementationStatus:'',summary:'',description:'',termIds:[],storyScenes:[]})),
 relations:data.relations.map(r=>({...r,type:'연관',scope:'geometry',importance:'core',source:[],storyScenes:[]})),
 regions:data.areas.map((a,order)=>({...a,description:'',domain:'common',order})),
 views:[{id:'all',label:'',nodeDomains:['common'],relationScopes:['geometry'],initialImportance:['core'],description:''}],
 contrasts:[],scenes:[],sources:[],learningOrder:[],linkPolicy:{doNotAutoLink:[],conceptConnection:{id:''}},
};
const basis=layoutConceptMap(adaptConceptMap(geometry,{view:'all',more:true,selection:null}));
// Compact horizontal projection for eleven cards; preserves the engine's orthogonal lanes.
export const layout={
 width:basis.width*.8,height:basis.height,
 positions:new Map([...basis.positions].map(([id,p])=>[id,{...p,x:p.x*.8,width:p.width*.8}])),
 regions:new Map([...basis.layouts].map(([id,p])=>[id,{...p,x:p.x*.8,width:p.width*.8}])),
 routes:new Map([...basis.routes].map(([id,r])=>{
  const points=r.points.map(([x,y]):[number,number]=>[x*.8,y]);
  return [id,{points,path:relationPath(points)}];
 })),
};
