// Owner review only. This entry is independent of vite.config.ts and dist/.
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

if (process.argv.length > 2) throw new Error('추가 옵션 없이 npm run b21:preview를 실행하세요.');
const repo = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  configFile: false,
  root: resolve(repo, 'scripts/b21-preview'),
  publicDir: false,
  cacheDir: resolve(repo, 'node_modules/.cache/b21-owner-preview'),
  plugins: [react()],
  appType: 'mpa',
  server: {
    host: '127.0.0.1', port: 4179, strictPort: true,
    open: false, cors: false, allowedHosts: ['127.0.0.1'],
    // Review uses manual reloads. Vite's client socket shares this loopback server.
    hmr: false,
    fs: { allow: [repo] },
  },
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => { await server.close(); process.exit(0); });
}
try {
  await server.listen();
  console.log('\nB2-1 Owner 로컬 미리보기: http://127.0.0.1:4179/');
  console.log('127.0.0.1 전용 · 1280 / 390 / 360px 선택 · 종료: Control+C\n');
} catch (error) {
  await server.close();
  console.error(`Preview 시작 실패: ${error.message}`);
  process.exitCode = 1;
}
