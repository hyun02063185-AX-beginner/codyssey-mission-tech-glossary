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
  if(!publicFiles.some(file=>file.startsWith('B21ServiceConcepts-')&&file.endsWith('.js'))||!publicFiles.some(file=>file.startsWith('B21ServiceStory-')&&file.endsWith('.js')))throw Error('Missing authorized U5 service chunks');
  for(const file of publicFiles.filter(file=>file.endsWith('.js'))){const text=await readFile(resolve(root,'dist/assets',file),'utf8');if(file.startsWith('ConceptExplorerPreview-')||text.includes('Concept Explorer · 비공개 Owner Preview')||text.includes('U4 연결 검토 · 비공개 Owner Preview'))throw Error('Private Owner host leaked into public build');}
  console.log('PASS private Owner build and authorized U5 service chunks; private Owner host absent from public dist');
}finally{await rm(out,{recursive:true,force:true});}
