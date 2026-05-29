import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2026-05-29',
})
