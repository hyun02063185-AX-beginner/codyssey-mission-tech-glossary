// Run sequentially: restores original bytes even when a validator fails.
import {readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const snapshot=JSON.parse(await readFile(new URL('../src/b21Story/content/storyIntegrity.json',import.meta.url),'utf8'));
const paths=['src/b21Story/content/storyIntegrity.json',...snapshot.scenes.flatMap(s=>[s.sourcePath,...(s.art?[s.art.desktop.sourcePath,s.art.mobile.sourcePath]:[])])];
const originals=await Promise.all(paths.map(p=>readFile(new URL('../'+p,import.meta.url))));
try {
 for(const ending of ['LF','CRLF']) {
  for(const [i,p] of paths.entries()) {const lf=originals[i].toString('utf8').replace(/\r\n/g,'\n');await writeFile(new URL('../'+p,import.meta.url),ending==='CRLF'?lf.replace(/\n/g,'\r\n'):lf);}
  const result=spawnSync(process.execPath,['scripts/b21_story_integrity.mjs'],{cwd:root,encoding:'utf8'});
  if(result.status!==0)throw Error(result.stderr||result.stdout);
  console.log(`PASS Foundation CLI ${ending}: approved hashes unchanged`);
 }
} finally { for(const [i,p] of paths.entries())await writeFile(new URL('../'+p,import.meta.url),originals[i]); }
