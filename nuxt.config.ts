import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    "@nuxt/icon",
    "@vueuse/nuxt",
    '@nuxt/test-utils/module',
  ],

  css: [
    '@unocss/reset/tailwind.css',
    '@unocss/reset/eric-meyer.css',
  ],

  alias: {
    "~~": resolve(__dirname, './'),
    "@@": resolve(__dirname, './'),
  },

  devtools: { enabled: true }
})