// Build the unregistered component separately, exercise its actual Vite glob
// chunks and emitted SVG URLs, then remove all private build output.
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const root = fileURLToPath(new URL('../', import.meta.url));
const cache = resolve(root, 'node_modules/.cache');
await mkdir(cache, { recursive: true });
const outDir = await mkdtemp(resolve(cache, 'b21-private-build-'));
try {
  await build({ root, configFile: false, plugins: [react()], base: './', logLevel: 'warn',
    build: { outDir, emptyOutDir: true, modulePreload: false,
      lib: { entry: resolve(root, 'src/b21Story/B21StoryFoundation.tsx'), formats: ['es'], fileName: () => 'foundation.js' },
      rollupOptions: { external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/server', 'react-markdown', 'remark-gfm', 'remark-parse', 'unified'] } } });
  await writeFile(resolve(outDir, 'package.json'), '{"type":"module"}');
  const entry = pathToFileURL(resolve(outDir, 'foundation.js'));
  const built = await import(entry.href);
  const scenes = await built.loadStoryManifest();
  if (scenes.length !== 9) throw Error('Private build did not load all nine manuscripts');
  let assets = 0, blocks = 0;
  for (const scene of scenes) {
    const html = renderToStaticMarkup(createElement(built.StoryScene, { story: scene }));
    if (!html.includes(`${scene.position}/9`) || !html.includes('강사용 안내 펼치기') || !scene.activities.length) throw Error(`Private renderer failed: ${scene.id}`);
    blocks += Object.values(scene.areas).reduce((sum, area) => sum + area.codeBlocks.length, 0);
    if (scene.assets) for (const asset of Object.values(scene.assets)) {
      const url = new URL(asset.url, entry);
      if (url.protocol !== 'file:') throw Error(`Expected emitted local SVG, got ${asset.url.slice(0, 100)}`);
      const path = fileURLToPath(url);
      if (relative(outDir, path).startsWith('..')) throw Error(`SVG escaped build output: ${path}`);
      const hash = createHash('sha256').update(await readFile(path)).digest('hex');
      if (hash !== asset.sha256) throw Error(`Emitted SVG changed: ${asset.sourcePath}`);
      assets++;
    }
  }
  if (assets !== 16) throw Error('Private build lost SVG assets');
  console.log(`PASS private Vite build: ${scenes.length} scenes, ${assets} byte-identical emitted SVGs, ${blocks} fenced source blocks, React SSR for every scene`);
} finally { await rm(outDir, { recursive: true, force: true }); }
