// Explicitly refresh only after content approval: node scripts/b21_story_integrity.mjs --write
// Normal runs compare the snapshot; they never accept new hashes automatically.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'src/b21Story/content/storyIntegrity.json');
const folder = 'drafts/b2-1-story-map';
const server = await createServer({ root, configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] }, logLevel: 'error' });
try {
  const { sceneOrder } = await server.ssrLoadModule('/src/b21Story/content/storyTypes.ts');
  const { parseMarkdown, headingsOf, textOf, areaId, referencesOf, parseStory } = await server.ssrLoadModule('/src/b21Story/content/parseStory.ts');
  let previous;
  try { previous = JSON.parse(await readFile(output, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const writing = process.argv.includes('--write');
  const revisionFlag = process.argv.find(arg => arg.startsWith('--source-revision='));
  if (revisionFlag && !writing) throw Error('--source-revision requires explicit --write');
  const sourceRevision = revisionFlag?.slice('--source-revision='.length) ?? previous?.sourceRevision ?? '66cfb7d7c499a64bc27240e6cb492592b3293649';
  if (!/^[a-f\d]{40}$/.test(sourceRevision)) throw Error('Expected a full source revision SHA');
  function verifyRevision(path, source) {
    // Only refresh needs Git history; ordinary/shallow CI builds validate the
    // checked-in hashes without fetching old commits or contacting a service.
    if (writing && execFileSync('git', ['show', `${sourceRevision}:${path}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n') !== source.replace(/\r\n/g, '\n')) throw Error(`Source does not match revision: ${path}`);
  }
  // Approval hashes describe LF text; only CRLF is canonicalized.
  const normalize = text => text.replace(/\r\n/g, '\n');
  const sha256 = data => createHash('sha256').update(normalize(data)).digest('hex');
  const plainXml = s => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, '&');
  const scenes = [];
  const directories = (await readdir(resolve(root, folder), { withFileTypes: true })).filter(d => d.isDirectory() && d.name.startsWith('scene-')).map(d => d.name).sort();
  if (JSON.stringify(directories) !== JSON.stringify([...sceneOrder].sort())) throw Error('Unexpected or missing scene directory');
  for (const id of sceneOrder) {
    const sourcePath = `${folder}/${id}/script.md`;
    const source = await readFile(resolve(root, sourcePath), 'utf8');
    verifyRevision(sourcePath, source);
    const headings = headingsOf(parseMarkdown(source)).filter(h => h.depth > 1);
    const sections = headings.map((h, index) => {
      const title = textOf(h), depth = h.depth;
      const old = previous?.scenes.find(s => s.id === id)?.sections.filter(s => s.title === title && s.depth === depth);
      const role = depth === 2 ? areaId(title) : null;
      const sectionId = old?.length === 1 ? old[0].id : `${id.replace('scene-', 's')}-${role ?? `section-${index + 1}`}`;
      return { id: id === 'scene-05' && title.startsWith('4. Generator') ? 's05-generator' : sectionId, title, depth };
    });
    const references = [...new Set(referencesOf(parseMarkdown(source), sourcePath).map(r => r.localPath).filter(Boolean))].sort();
    for (const path of references) {
      const absolute = resolve(root, path);
      if (relative(root, absolute).startsWith('..') || !(await stat(absolute)).isFile()) throw Error(`Missing local reference: ${path}`);
    }
    const svgNames = (await readdir(resolve(root, folder, id))).filter(f => f.endsWith('.svg')).sort();
    let art = null;
    if (id === 'scene-08') {
      if (svgNames.length) throw Error('Scene08 must use the future concept component, not SVG');
    } else {
      if (svgNames.length !== 2) throw Error(`${id}: expected one desktop/mobile pair`);
      art = { splitStatus: 'whole-source-only' };
      for (const variant of ['desktop', 'mobile']) {
        const name = svgNames.find(n => n.endsWith(`-${variant}.svg`));
        if (!name) throw Error(`${id}: missing ${variant} SVG`);
        const path = `${folder}/${id}/${name}`, svg = await readFile(resolve(root, path), 'utf8');
        verifyRevision(path, svg);
        const tag = svg.match(/<svg\b[^>]*>/)?.[0] ?? '';
        const width = Number(tag.match(/\bwidth="([\d.]+)"/)?.[1]), height = Number(tag.match(/\bheight="([\d.]+)"/)?.[1]);
        const alt = svg.match(/<title\b[^>]*>([\s\S]*?)<\/title>/)?.[1], description = svg.match(/<desc\b[^>]*>([\s\S]*?)<\/desc>/)?.[1];
        if (!(width > 0 && height > 0 && alt && description && tag.includes(`viewBox="0 0 ${width} ${height}"`))) throw Error(`Invalid SVG metadata: ${path}`);
        art[variant] = { sourcePath: path, sha256: sha256(svg), width, height, alt: plainXml(alt), description: plainXml(description) };
      }
    }
    const entry = { id, label: `Scene ${id.slice(6).replace(/^03([ab])$/, '03-$1').toUpperCase()}`, sourcePath, sha256: sha256(source), sections, art, references };
    parseStory(source, entry);
    scenes.push(entry);
  }
  const snapshot = { schemaVersion: 1, sourceRevision, scenes };
  const json = JSON.stringify(snapshot, null, 2) + '\n';
  if (writing) {
    await writeFile(output, json);
    console.log('Wrote explicit B21 integrity snapshot; review hashes/section IDs before committing.');
  } else {
    if (normalize(await readFile(output, 'utf8')) !== json) throw Error('B21 source/asset/section integrity drift; do not auto-refresh approval hashes');
    console.log('PASS B21 integrity: 9 manuscripts, 16 original SVGs, sections, activities, references');
  }
} finally { await server.close(); }
