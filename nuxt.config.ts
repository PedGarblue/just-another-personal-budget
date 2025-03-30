import UnpluginComponentsVite from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: '',
      token: {
        accessExpires: 60 * 60 * 1000, // 1 hour
        refreshExpires: 24 * 3600 * 1000, // 1 day
      },
    },
  },
  // server side rendering mode
  ssr: false,

  // typescripts
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // css
  css: [
    '~/assets/style.css',
    'vue3-easy-data-table/dist/style.css',
    '@vuepic/vue-datepicker/dist/main.css',
  ],

  // plugins
  plugins: [
    '~/plugins/navbar.ts',
    '~/plugins/vue3-easy-data-table.ts',
    '~/plugins/chartjs.ts',
    '~/plugins/i18n.ts',
  ],

  // build
  build: {
    transpile: ['@headlessui/vue', '@vuepic/vue-datepicker'],
  },

  // modules
  modules: [
    'unplugin-icons/nuxt',
    '@pinia/nuxt',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-windicss',
  ],

  // auto import components
  components: true,

  // vite plugins
  vite: {
    plugins: [
      UnpluginComponentsVite({
        dts: true,
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
    ],
  },

  // app config
  app: {
    // global transition
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  // windicss
  windicss: {
    analyze: {
      analysis: {
        interpretUtilities: false,
      },
      server: {
        port: 4000,
        open: false,
      },
    },
    scan: true,
  },

  // content
  content: {
    documentDriven: true,
    markdown: {
      mdc: true,
    },
    highlight: {
      theme: 'github-dark',
    },
  },
})
