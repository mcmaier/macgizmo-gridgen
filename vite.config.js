import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'ProtoGrid',
      fileName: 'protogrid',
      formats: ['iife'],
    },
    outDir: '../wordpress-plugin/assets',
    emptyOutDir: false,
    cssCodeSplit: false,
  },
})
