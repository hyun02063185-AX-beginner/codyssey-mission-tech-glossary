import { routeURL, type StoryRoute } from './storyRoute';
export function presenterURL(current: string, route: StoryRoute, session: string, host: 'preview'|'service') {
  const url=new URL(current);
  const query=new URLSearchParams({sync:session});
  if(host==='preview')query.set('view','v3-router');
  url.search=query.toString();url.hash=routeURL({...route,presenter:true});
  return url.href;
}
