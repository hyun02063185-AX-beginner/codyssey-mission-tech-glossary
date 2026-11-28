import { existsSync, readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { parseStoryboardV04 } from './src/b32Story/parseStoryboardV04'

const content = new URL('./content/', import.meta.url)
const mission = new URL('mission-stories/main-m06/', content)

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    ...(mode === 'b32-v04' ? [{
      name: 'validate-b32-v04-storyboard',
      apply: 'build' as const,
      buildStart() {
        parseStoryboardV04(readFileSync(new URL('storyboard-v0.4.md', mission), 'utf8'), {
          termExists: id => existsSync(new URL(`terms/${id}.md`, content)),
          readSvg: name => {
            const path = new URL(`assets/${name}`, mission)
            return existsSync(path) ? readFileSync(path, 'utf8') : undefined
          },
        })
      },
    }] : []),
  ],
  test: { exclude: ['**/node_modules/**', 'playwright/**'] },
}))
