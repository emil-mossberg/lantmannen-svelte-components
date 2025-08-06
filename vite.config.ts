import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    sourcemap: process.env.SOURCE_MAP !== 'false',
    rollupOptions: {
      output: {
        entryFileNames: 'js/svelte-index.min.js',
        assetFileNames: 'svelte-bundle.css',
      },
    },
  },

  // TO DO get this to work
  // resolve: {
  //   alias: {
  //     '@lib': path.resolve(__dirname, 'src/lib'),
  //   }
  // }
})
