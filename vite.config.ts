import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const p = (...s: string[]) => join(ROOT, ...s)

export default defineConfig({
  resolve: { alias: { '@': p('src') } },
  plugins: [vue()],
  base: './',
  server: { port: 5273, host: '127.0.0.1' },
  build: { outDir: 'dist-site', emptyOutDir: true }
})
