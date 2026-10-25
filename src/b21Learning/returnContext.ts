import { scenes } from '../b21StoryV3/content';
import { guideConnections, fieldMapConnections, isConnectedTerm } from '../b21StoryV3/links/catalog';
import { parseStorySource, readStoryReturn, returnKey, storySource } from '../b21StoryV3/links/returnAddress';
import { routeURL, type StoryRoute } from '../b21StoryV3/routing/storyRoute';
import { readExplorer, validExplorerReturn } from '../b21ConceptExplorer/state';
import { nodeById, termForNode } from '../b21ConceptExplorer/adapter';
import { b21ConceptPath, b21StoryPath } from './paths';

export const explorerReturnKey='b21-explorer';
function destinationAllowed(pathname:string, query:URLSearchParams, source:StoryRoute) {
  const scene=scenes[source.scene].id;
  if(guideConnections[scene].some(chapter=>pathname===`/missions/main-M03/guide/${chapter}`))return true;
  return fieldMapConnections.some(item=>item.scene===scene&&pathname==='/maps/data-database'&&query.get('mission')==='main-m03'&&query.getAll('mission').length===1);
}
/** Only approved B2 guide chapters/field-map entries can carry a Story return. */
export function learningDestinationHref(href:string, source:StoryRoute) {
  const [path,search='']=href.split('?'),query=new URLSearchParams(search);
  if(!destinationAllowed(path,query,source))throw Error('Unapproved B2 learning destination');
  query.set(returnKey,storySource(source));return `${path}?${query}`;
}
export function readLearningReturn(pathname:string, search:string):StoryRoute|null {
  const term=readStoryReturn(pathname,search);if(term)return term;
  if(search.length>4096)return null;
  const query=new URLSearchParams(search);
  if(query.has('b31-map')||query.has(explorerReturnKey)||query.getAll(returnKey).length!==1)return null;
  const source=parseStorySource(query.get(returnKey)!);
  return source&&destinationAllowed(pathname,query,source)?source:null;
}
export function readExplorerTermReturn(pathname:string, search:string) {
  if(search.length>4096)return null;
  const query=new URLSearchParams(search),term=pathname.match(/^\/terms\/([a-z0-9-]+)$/)?.[1];
  if(!term||!isConnectedTerm(term)||query.has('b31-map')||query.getAll(explorerReturnKey).length!==1)return null;
  const href=validExplorerReturn(query.get(explorerReturnKey),b21ConceptPath);if(!href)return null;
  const state=readExplorer(href.split('?')[1]??'').state,node=nodeById.get(state.node??'');
  return node&&termForNode(node)?.termId===term?href:null;
}
export function readReviewReturn(pathname:string, value:unknown) {return pathname===b21StoryPath?validExplorerReturn(value,b21ConceptPath):null;}
export function learningReturnHref(source:StoryRoute) {return routeURL(source);}
