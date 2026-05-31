export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: false,
  devtools: { enabled: true },
  css: ['./assets/css/main.css'],
  runtimeConfig: {
    public: {
      docsUrl: process.env.NUXT_PUBLIC_DOCS_URL || 'https://nuxt-atproto.pages.dev/',
    },
  },
  devServer: {
    host: '127.0.0.1',
  },
  compatibilityDate: '2026-05-29',

  nitro: {
    preset: 'static',
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@atproto/oauth-client-browser',
        '@atproto/api',
        'core-js',
      ],
    },
  },
  atproto: {
    serviceEndpoint: {
      private: 'https://bsky.social',
      public: 'https://public.api.bsky.app',
    },
    oauth: {
      writeClientMetadata: true,
      clientMetadata: {
        // url of your remote client_metadata.json, leave the field empty
        // to let `nuxt-atproto` generate a local /public/client_metadata.json
        remote: '',
        // configuration for the local client_metadata.json
        local: {
          client_id: 'https://nuxt-atproto.pages.dev/client-metadata.json',
          client_name: 'nuxt-atproto',
          client_uri: 'https://nuxt-atproto.pages.dev',
          logo_uri: 'https://nuxt-atproto.pages.dev/logo.png',
          tos_uri: 'https://nuxt-atproto.pages.dev',
          policy_uri: 'https://nuxt-atproto.pages.dev',
          redirect_uris: ['https://nuxt-atproto.pages.dev'],
          scope: 'atproto transition:generic',
          grant_types: ['authorization_code', 'refresh_token'],
          response_types: ['code'],
          token_endpoint_auth_method: 'none',
          application_type: 'web',
          dpop_bound_access_tokens: true,
        },
      },
      signInOptions: {
        state: '',
        prompt: 'login',
        scope: 'atproto',
        ui_locales: 'en',
      },
    },
    debug: true,
  },
})
