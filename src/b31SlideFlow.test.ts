import {describe,it,expect} from 'vitest';
import {lectureSlides} from './b31SlideFlow';
import {b31SceneIds,storyScene,storyHref,conceptHref,mapQuery} from './b31StoryNavigation';
describe('B3-1 lecture slide order and existing URLs',()=>{
  it('moves from foundations to the overview, live packet journey and AWS',()=>{
    expect(lectureSlides.map(s=>s.id)).toEqual(['slide-intro','slide-network','slide-packet','scene-01','scene-02','scene-03a','scene-03b','scene-04']);
    expect(lectureSlides.map(s=>s.id).filter(id=>b31SceneIds.includes(id as typeof b31SceneIds[number]))).toEqual([...b31SceneIds]);
  });
  it('retains old scene URLs and accepts new slide origins without arbitrary redirects',()=>{
    for(const item of lectureSlides){expect(storyScene(item.id)).toBe(item.id);expect(storyHref(item.id)).toContain(`scene=${item.id}`);expect(conceptHref('view=basics',item.id)).toContain(`scene=${item.id}`);}
    expect(mapQuery('scene=slide-network&redirect=https://example.com')).toBe('scene=slide-network');expect(storyScene('../bad')).toBeNull();
  });
});
