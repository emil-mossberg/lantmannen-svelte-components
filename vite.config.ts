
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    sourcemap: process.env.SOURCE_MAP !== 'false',
    rollupOptions: {
      output: {
        entryFileNames: "js/svelte-index.min.js",
        assetFileNames: "svelte-bundle.css",
      }
    }
  }
})
