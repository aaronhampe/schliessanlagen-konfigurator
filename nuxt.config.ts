

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  devtools: { enabled: false },
  app:{baseURL: process.env.publicPath},
  runtimeConfig: {
    MAILHOST: process.env.MAILHOST,
    MAILPORT: process.env.MAILPORT,
    MAILUSER: process.env.MAILUSER,
    MAILPASSWORD: process.env.MAILPASSWORD,
    CONTACTMAIL: process.env.CONTACTMAIL,
   
    },


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
}
})
