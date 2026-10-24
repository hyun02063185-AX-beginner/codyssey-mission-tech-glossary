import { scenes } from '../content';
import { resolveStoryRoute, routeURL, storyPath, type StoryRoute } from '../routing/storyRoute';
import { isConnectedTerm } from './catalog';

export const returnKey = 'b21-story';
/** Inner payload is ONLY scene, step and optional back, never a URL or nested context. */
export function parseStorySource(value: string): StoryRoute | null {
  if (!value || value.length > 512 || /[%?#/\\\s]/.test(value)) return null;
  const query=new URLSearchParams(value);
  if (!query.has('scene') || !query.has('step') || [...query.keys()].some(k=>!['scene','step','back'].includes(k)||query.getAll(k).length!==1)) return null;
  const result=resolveStoryRoute(storyPath,'?'+query);
  // U3 recovers bad lecture addresses. Return contexts reject them instead.
  if (result.notice) return null;
  return {...result.route,presenter:false};
}
export function storySource(route: StoryRoute): string {
  if(!scenes[route.scene]?.steps[route.step])throw Error('Invalid Story source');
  const value=routeURL({...route,presenter:false}).split('?')[1];
  if(!parseStorySource(value))throw Error('Invalid Story return context');
  return value;
}
export function termStoryHref(termId: string, source: StoryRoute): string {
  if(!isConnectedTerm(termId))throw Error('Unapproved term connection');
  const query=new URLSearchParams({[returnKey]:storySource(source)});
  return `/terms/${termId}?${query}`;
}
export function readStoryReturn(pathname: string, search: string): StoryRoute | null {
  const match=pathname.match(/^\/terms\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if(!match || !isConnectedTerm(match[1]) || search.length>4096) return null;
  const query=new URLSearchParams(search);
  // Existing B3-1 banner wins even when its value is empty or malformed.
  if(query.has('b31-map')||query.getAll(returnKey).length!==1)return null;
  return parseStorySource(query.get(returnKey)!);
}
export function sourceLabel(route: StoryRoute) {
  return `Scene ${scenes[route.scene].id} · ${route.step+1}단계`;
}
