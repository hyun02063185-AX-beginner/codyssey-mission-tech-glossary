// Compile the complete private Owner entry independently of the public Vite config.
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, mkdtemp, rm, readdir, readFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),cache=resolve(root,'node_modules/.cache');
await mkdir(cache,{recursive:true});const out=await mkdtemp(resolve(cache,'b21-c1-private-build-'));
const within=relative(cache,out);
if(within.startsWith('..')||isAbsolute(within)||!within.startsWith('b21-c1-private-build-'))throw Error('Unexpected private build output path');
try{
  await build({configFile:false,root:resolve(root,'scripts/b21-preview'),publicDir:false,plugins:[react()],base:'./',logLevel:'warn',build:{outDir:out,emptyOutDir:true}});
  const files=await readdir(resolve(out,'assets'));
  if(!files.some(file=>file.startsWith('ConceptExplorerPreview-')&&file.endsWith('.js')))throw Error('Missing private explorer chunk');
  const publicFiles=await readdir(resolve(root,'dist/assets'));
  for(const file of publicFiles.filter(file=>file.endsWith('.js'))){const text=await readFile(resolve(root,'dist/assets',file),'utf8');if(text.includes('CONCEPT EXPLORER')||text.includes('/concept-explorer')||text.includes('/missions/main-M03/story/concepts'))throw Error('Private explorer leaked into public build');}
  console.log('PASS private Owner build: Concept Explorer lazy chunk; no private explorer or proposed public concepts route in dist assets');
}finally{await rm(out,{recursive:true,force:true});}
