import { readStoryState, screenHref, storyRecoveryNotice, type ScreenAddress } from './content';

export function integratedLabOrigin(search: string, screens: readonly ScreenAddress[]) {
  const params = new URLSearchParams(search.slice(0, 1025));
  const [from, duplicate] = params.getAll('from');
  return search.length <= 1024 && params.size === 1 && !duplicate && screens.some(screen => screen.id === from) ? from : '';
}

export function integratedStoryState(search: string, screens: readonly ScreenAddress[]): ReturnType<typeof readStoryState> & { returnId?: string } {
  const params = new URLSearchParams(search.slice(0, 1025));
  const [lab, duplicate] = params.getAll('from-lab');
  if (lab === undefined || search.length > 1024) return readStoryState(search, screens);
  params.delete('from-lab');
  const state = readStoryState(`?${params}`, screens);
  if (duplicate !== undefined || !/^0[1-9]$/.test(lab) || !params.has('scene') || !params.has('screen') || state.notice) {
    return { ...state, notice: storyRecoveryNotice };
  }
  return { ...state, returnId: lab };
}

export function integratedStoryFor(origin: string, lab: string, screens: readonly ScreenAddress[]) {
  const index = screens.findIndex(screen => screen.id === origin);
  return index < 0 ? undefined : `${screenHref(index, screens)}&from-lab=${lab}`;
}
