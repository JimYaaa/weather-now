// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
  ],

  css: [
    '@unocss/reset/sanitize/sanitize.css',
  ],

  devtools: { enabled: true }
})
