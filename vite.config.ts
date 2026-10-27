import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// Docs site. Examples import from "nr-ui-kit" exactly like a consumer app would;
// the alias points that at the local sources.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'nr-ui-kit': fileURLToPath(new URL('./src/components/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5199,
    host: true,
  },
  build: {
    outDir: 'docs-dist',
    // docs bundle includes every live example eagerly
    chunkSizeWarningLimit: 2000,
  },
})
