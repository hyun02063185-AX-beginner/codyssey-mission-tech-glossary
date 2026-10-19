import { describe, expect, it } from 'vitest';
import supplement from '../content/mission-guides/main-m05/supplement/README.md?raw';
import { b31GuideAsset, b31GuideChapters, b31GuideLink, b31GuidePath, b31SupplementAsset, b31SupplementLink, b31SupplementPath } from './b31GuideContent';

describe('B3-1 enterprise network supplement', () => {
  it('opens all approved diagrams and their larger views from the learner page', () => {
    const images = [...supplement.matchAll(/!\[[^\]]*\]\((assets\/[^)]+)\)/g)].map(match => match[1]);
    expect(images).toHaveLength(6);
    for (const path of images) {
      expect(b31SupplementAsset(path), path).toBeTruthy();
      expect(b31SupplementLink(path), path).toBe(b31SupplementAsset(path));
    }
  });

  it('keeps the guide and chapter links inside the existing route', () => {
    expect(b31GuideChapters).toHaveLength(7);
    expect(b31GuideAsset('../assets/aws-network-roles.svg')).toBeTruthy();
    expect(b31GuideLink('../supplement/README.md')).toBe(b31SupplementPath);
    expect(b31SupplementLink('../README.md')).toBe(`${b31GuidePath}?document=README`);
    expect(b31SupplementLink('../chapters/03-internet-path.md')).toBe(`${b31GuidePath}/03-internet-path`);
    expect(b31SupplementLink('#장면-0-한눈에-보는-전체-구성도')).toBe(`${b31SupplementPath}#장면-0-한눈에-보는-전체-구성도`);
  });
});
