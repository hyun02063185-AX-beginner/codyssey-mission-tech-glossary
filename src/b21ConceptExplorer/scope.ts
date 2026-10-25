import {explorerData,explorerLayout,nodeById} from './adapter';
/** A read-only projection; coordinates, source relations and comparisons stay intact. */
export function graphForScope(scope:string){
  const areas=scope==='all'?explorerData.areas:explorerData.areas.filter(area=>area.id===scope);
  const nodes=scope==='all'?explorerData.nodes:explorerData.nodes.filter(node=>node.area===scope);
  const ids=new Set(nodes.map(node=>node.id));
  return {areas,nodes,relations:explorerData.relations.filter(r=>ids.has(r.from)&&ids.has(r.to)),external:scope==='all'?[]:explorerData.relations.filter(r=>ids.has(r.from)!==ids.has(r.to))};
}
export function scopeForNode(scope:string,id:string){return scope==='all'||nodeById.get(id)?.area===scope?scope:'all';}
export function scopeForPair(scope:string,ids:string[]){return ids.every(id=>scopeForNode(scope,id)===scope)?scope:'all';}
export function areaBounds(scope:string){
  const graph=graphForScope(scope),cards=graph.nodes.map(node=>explorerLayout.positions.get(node.id)!);
  const points=graph.relations.flatMap(r=>explorerLayout.routes.get(r.id)!.points);
  return {left:Math.min(...cards.map(p=>p.x),...points.map(p=>p[0]))-24,top:Math.min(...cards.map(p=>p.y),...points.map(p=>p[1]))-24,
    right:Math.max(...cards.map(p=>p.x+p.width),...points.map(p=>p[0]))+24,bottom:Math.max(...cards.map(p=>p.y+p.height),...points.map(p=>p[1]))+24};
}
