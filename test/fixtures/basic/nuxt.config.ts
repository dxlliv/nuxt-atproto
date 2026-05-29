import MyModule from '../../../src/module'

export default defineNuxtConfig({
  compatibilityDate: '2026-05-29',
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    MyModule,
  ],
})
