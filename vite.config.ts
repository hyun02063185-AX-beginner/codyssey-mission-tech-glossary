import { existsSync, readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { parseStoryboardV04 } from './src/b32Story/parseStoryboardV04'
import { parseStoryboardV05 } from './src/b32Story/parseStoryboardV05'

const content = new URL('./content/', import.meta.url)
const mission = new URL('mission-stories/main-m06/', content)

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    ...(mode === 'b32-v04' || mode === 'b32-v05' ? [{
      name: `validate-${mode}-storyboard`,
      apply: 'build' as const,
      buildStart() {
        const isV05 = mode === 'b32-v05'
        const parseStoryboard = isV05 ? parseStoryboardV05 : parseStoryboardV04
        const source = isV05 ? 'storyboard-v0.5.md' : 'storyboard-v0.4.md'
        parseStoryboard(readFileSync(new URL(source, mission), 'utf8'), {
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
