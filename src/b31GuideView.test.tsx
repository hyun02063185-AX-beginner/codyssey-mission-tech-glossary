import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import B31MissionGuide from './B31MissionGuide';
import { b31GuidePath } from './b31GuideContent';

function guideAt(path: string) {
  return renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path={b31GuidePath} element={<B31MissionGuide />} />
    <Route path={`${b31GuidePath}/:chapterId`} element={<B31MissionGuide />} />
  </Routes></MemoryRouter>);
}

describe('B3-1 learner navigation', () => {
  it('offers the supplement on the guide index and chapter 2', () => {
    expect(guideAt(b31GuidePath)).toContain('기업망 보강 자료 읽기');
    expect(guideAt(`${b31GuidePath}/02-network-aws-map`)).toContain('기업 홈페이지 전체 구성도와 장면별 보강 자료');
  });

  it('renders the wide overview, five detailed diagrams, and the chapter link', () => {
    const html = guideAt(`${b31GuidePath}?document=supplement`);
    expect(html).toContain('b31-figure-overview');
    expect((html.match(/b31-figure-supplement/g) ?? [])).toHaveLength(6);
    expect(html).toContain('전체도는 좌우로 밀어 읽고');
    expect(html).toContain('그림 크게 열기');
    expect(html).toContain(`${b31GuidePath}/03-internet-path`);
  });
});
