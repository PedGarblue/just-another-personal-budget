import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          '@unhead/vue': ['useHead'],
        },
      ],
      dirs: ['src/composables', 'src/utils', 'src/stores'],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dirs: ['src/components'],
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
})
