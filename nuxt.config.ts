// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    public: {
      backendURL: process.env.BACKEND_URL,
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css',
          media: "screen and (prefers-color-scheme: light)"
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css',
          media: "screen and (prefers-color-scheme: dark)"
        },
      ]
    },
  },
  css: ['@/assets/style/main.scss'],
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-monaco-editor',
    '@sidebase/nuxt-auth',
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classPrefix: '',
    storageKey: 'nuxt-color-mode',
  },
  ui: {
    global: true,
    icons: ['mdi', 'ion'],
  },
  tailwindcss: {
    cssPath: '@/assets/style/tailwind.css',
  },
  imports: {
    dirs: ['./constants'],
  },
  auth: {
    baseURL: process.env.BASE_URL,
    globalAppMiddleware: true,
    provider: {
      type: 'authjs',
    },
  },
});
