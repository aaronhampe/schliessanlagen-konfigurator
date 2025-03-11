// nuxt.config.js
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  devtools: { enabled: false },
  
  app: { 
    baseURL: '/konfiguratorapp/', 
    cdnURL: 'https://www.stt-shop.de/konfiguratorapp/' 
  },

  runtimeConfig: {
    MAILHOST: process.env.MAILHOST,
    MAILPORT: process.env.MAILPORT,
    MAILUSER: process.env.MAILUSER,
    MAILPASSWORD: process.env.MAILPASSWORD,
    CONTACTMAIL: process.env.CONTACTMAIL,
  },

  pages: true,

  css: ['@/scss/main.scss'],

  vite: {
    server: {
      host: true, // Erlaubte externe Zugriffe
      strictPort: false,
      proxy: {
        '/api': {
          target: 'https://www.stt-shop.de',
          changeOrigin: true,
          secure: false,
        },
      },
    },
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

  nitro: {
    prerender: {
      routes: ['/'] // Stellt sicher, dass statische Dateien generiert werden
    },
    routeRules: {
      '/_nuxt/**': { cors: true },
      '/**': { cors: true } // CORS für alle Routen aktivieren
    }
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
