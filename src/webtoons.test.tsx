import {describe,expect,it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import WebtoonPage,{webtoonEpisodes,WebtoonQuickTerm} from './Webtoons';
import glossary from './data/generated/glossary.json';

const pageAt=(path:string)=>renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><WebtoonPage/></MemoryRouter>);

describe('approved L0 webtoon reading flow',()=>{
  it('lists only the approved stories and does not expose the former pilots',()=>{
    const page=pageAt('/webtoons');
    expect(page).toContain('섭외비도 드나요?');expect(page).toContain('제 마음도 읽어 주세요');
    expect(page).toContain('커피 한 잔에 논문 한 권');expect(page).toContain('손맛이 아니라 순서!');
    expect(page).toContain('입사 첫날, 사장님?');expect(page).toContain('계산은 맡겨도 계산서는!');
    expect(page).toContain('이 터미널, 부산 가나요?');expect(page).toContain('엔진오일은 반품할게!');
    expect(page).not.toContain('localStorage');expect(page).not.toContain('이미지 준비 중');
  });
  it('offers a complete readable transcript and a precise related-term link',()=>{
    const page=pageAt('/webtoons?episode=prompt-request-01');
    expect(page).toContain('그림 설명과 대사 읽기');
    expect(page).toContain('/terms/prompt-design?webtoon=prompt-request-01');
    expect(page).toContain('이어서 읽기: 프롬프트 설계');
    expect(pageAt('/webtoons?episode=terminal-bus-01')).toContain('/terms/terminal?webtoon=terminal-bus-01');
    expect(pageAt('/webtoons?episode=llm-firstday-01')).toContain('/terms/llm?webtoon=llm-firstday-01');
    for(const panel of webtoonEpisodes[1].panels)for(const speech of panel.dialogue)expect(page).toContain(speech.text.replaceAll('\n',' '));
  });
  it('recovers from an unknown episode without showing unrelated term content',()=>{
    expect(pageAt('/webtoons?episode=missing')).toContain('웹툰을 찾지 못했어요');
  });
  it('provides standalone concept stories without inventing dictionary links',()=>{
    for(const id of ['abstraction-coffee-01','algorithm-sandwich-01','cloud-compute-bill-01','game-engine-oil-01']){
      const page=pageAt('/webtoons?episode='+id);
      expect(page).toContain('이 말의 쉬운 뜻');expect(page).toContain('그림 설명과 대사 읽기');
      expect(page).not.toContain('/terms/');
      for(const panel of webtoonEpisodes.find(episode=>episode.id===id)!.panels)
        for(const speech of panel.dialogue)expect(page).toContain(speech.text.replaceAll('\n',' '));
    }
  });
  it('keeps the dictionary bridge focused on the easy meaning before optional detail',()=>{
    const term=glossary.find(item=>item.id==='ai-model')!;
    const page=renderToStaticMarkup(<MemoryRouter><WebtoonQuickTerm term={term} episodeId="ai-model-role-01"/></MemoryRouter>);
    expect(page).toContain(term.easyExplanation);expect(page).toContain('<details>');
    expect(page).not.toContain('기술 지도에서 보기');
  });
});
