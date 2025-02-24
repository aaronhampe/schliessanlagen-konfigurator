// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui','@pinia/nuxt'],
  devtools: { enabled: false },
  app: { baseURL: process.env.publicPath },

  runtimeConfig: {
    MAILHOST: process.env.MAILHOST,
    MAILPORT: process.env.MAILPORT,
    MAILUSER: process.env.MAILUSER,
    MAILPASSWORD: process.env.MAILPASSWORD,
    CONTACTMAIL: process.env.CONTACTMAIL,

  },

  pages: true,

  css: [
    '@/scss/main.scss'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                  @import "@/scss/_preset.scss";
              `
        },
      },
    },
  },
  hooks: {
    'pages:extend'(pages) {
      const configPage = pages.find(page => page.path === '/')
      if (configPage) {
        pages.push({
          name: 'admin',
          path: '/admin',
          file: configPage.file
        })
      }
    }
  },

  compatibilityDate: '2024-10-15'
})