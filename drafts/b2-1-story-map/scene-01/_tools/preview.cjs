// Scene 01 미리보기 PNG 생성: 웹 서비스 글꼴(Pretendard VF)로 노트북용 1280·1000px, 휴대전화용 390·360px 폭에 맞춰 그린다.
// 휴대전화 폭은 화면 좌우 여백 16px을 뺀 칸(358·328px)에 그림을 넣는다.
// 실행: node preview.cjs   (출력: ../preview/*.png)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));

const DIR = path.resolve(__dirname, '..');
const OUT = path.join(DIR, 'preview');
const FONT_B64 = fs.readFileSync(path.resolve(__dirname, '../../../../src/assets/fonts/PretendardVariable.woff2')).toString('base64');
const JOBS = [
  ['cli-command-desktop.svg', 'desktop', 1280, 1280], ['cli-command-desktop.svg', 'desktop', 1000, 1000],
  ['cli-command-mobile.svg', 'mobile', 390, 358], ['cli-command-mobile.svg', 'mobile', 360, 328],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [file, kind, viewport, slot] of JOBS) {
    const svg = fs.readFileSync(path.join(DIR, file), 'utf8');
    await page.setViewportSize({ width: viewport, height: 900 });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      @font-face{font-family:"Pretendard VF";src:url("data:font/woff2;base64,${FONT_B64}") format("woff2");font-weight:45 920;}
      body{margin:0;background:#eef1f4}.slot{width:${slot}px;margin:0 auto}.slot svg{display:block;width:100%;height:auto}
    </style></head><body><div class="slot">${svg}</div></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(OUT, `${kind}-${viewport}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log('wrote', path.relative(DIR, out));
  }
  await browser.close();
})();
