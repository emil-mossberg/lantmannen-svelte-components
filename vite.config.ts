import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'


export default defineConfig({
  plugins: [svelte()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: "js/svelte-index.min.js",
        chunkFileNames: "js/svelte-chunk.js",
        assetFileNames: "svelte-bundle.css",
      }
    }
  }
})
