export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  devServer: {
    host: '127.0.0.1',
  },
  atproto: {
    serviceEndpoint: {
      private: 'https://bsky.social',
      public: 'https://public.api.bsky.app'
    },
    oauth: {
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
          scope: "atproto transition:generic",
          grant_types: ["authorization_code", "refresh_token"],
          response_types: ["code"],
          token_endpoint_auth_method: 'none',
          application_type: 'web',
          dpop_bound_access_tokens: true
        }
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
  ssr: false,
})
