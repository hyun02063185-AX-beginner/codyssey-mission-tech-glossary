import { chromium } from '@playwright/test';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const directory = 'content/mission-guides/main-m03/assets';
mkdirSync(`${directory}/mobile`, { recursive: true });
mkdirSync(`${directory}/desktop`, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const file of readdirSync(directory).filter(f => f.endsWith('.svg'))) {
  await page.setContent(readFileSync(`${directory}/${file}`, 'utf8'));
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    const svg = document.querySelector('svg');
    const canvasWidth = +svg.getAttribute('width');
    const lineHeight = canvasWidth === 360 ? 23 : 28;
    const verticalScale = canvasWidth === 360 ? 1.18 : 1.4;
    const rects = [...svg.children].filter(e => e.tagName === 'rect');
    const texts = [...svg.querySelectorAll('text')];
    const additions = new Map();
    const layouts = texts.map(text => {
      const x = +text.getAttribute('x'), y = +text.getAttribute('y');
      const box = rects.filter(r => x >= +(r.getAttribute('x') || 0) && x <= +(r.getAttribute('x') || 0) + +r.getAttribute('width') && y >= +(r.getAttribute('y') || 0) && y <= +(r.getAttribute('y') || 0) + +r.getAttribute('height')).at(-1);
      const centered = text.getAttribute('text-anchor') === 'middle';
      const width = centered ? +box.getAttribute('width') - 20 : +(box.getAttribute('x') || 0) + +box.getAttribute('width') - x - 12;
      text.setAttribute('font-size', canvasWidth === 360 ? '18' : '20');
      const original = text.textContent;
      const lines = []; let line = '';
      for (const word of original.match(/\S+\s*|\s+/g) || []) {
        text.textContent = line + word;
        if (text.getComputedTextLength() > width && line) { lines.push(line); line = word; } else line += word;
      }
      lines.push(line);
      additions.set(y, Math.max(additions.get(y) || 0, (lines.length - 1) * lineHeight));
      return { text, x, y, lines };
    });
    const mapY = y => y * verticalScale + [...additions].filter(([at]) => at < y).reduce((sum, [, extra]) => sum + extra, 0);
    for (const rect of rects) {
      const y = +(rect.getAttribute('y') || 0), h = +rect.getAttribute('height');
      rect.setAttribute('y', mapY(y)); rect.setAttribute('height', mapY(y + h) - mapY(y));
    }
    for (const path of [...svg.children].filter(e => e.tagName === 'path')) {
      path.setAttribute('d', path.getAttribute('d').replace(/([ML])([\d.]+) ([\d.]+)/g, (_, command, x, y) => `${command}${x} ${mapY(+y)}`));
    }
    for (const { text, x, y, lines } of layouts) {
      text.textContent = ''; text.setAttribute('y', mapY(y));
      lines.forEach((line, index) => {
        const span = document.createElementNS(svg.namespaceURI, 'tspan');
        span.setAttribute('x', x); span.setAttribute('y', mapY(y) + index * lineHeight); span.textContent = line; text.append(span);
      });
    }
    const height = Math.ceil(mapY(+svg.getAttribute('height')));
    svg.setAttribute('height', height); svg.setAttribute('viewBox', `0 0 ${canvasWidth} ${height}`);
    return svg.outerHTML;
  });
  writeFileSync(`${directory}/${file.includes('wide') ? 'desktop' : 'mobile'}/${file}`, result + '\n');
}
await browser.close();
