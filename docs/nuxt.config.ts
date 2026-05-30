import { fileURLToPath } from 'node:url'

const playgroundRoot = fileURLToPath(new URL('../playground', import.meta.url))
const docusOverridesRoot = fileURLToPath(new URL('./app/components/app', import.meta.url))

const isDev = process.env.NODE_ENV === 'development'
const siteOrigin = (process.env.NUXT_PUBLIC_SITE_ORIGIN
  || (isDev ? 'http://127.0.0.1:3456' : 'https://dxlliv.github.io')).replace(/\/$/, '')
const basePath = '/nuxt-atproto'
const appUrl = `${siteOrigin}${basePath}/`
const clientMetadataUrl = `${siteOrigin}${basePath}/client-metadata.json`

export default defineNuxtConfig({
  extends: ['docus'],

  modules: [
    '../src/module',
    './modules/static-content-dump',
  ],

  ssr: false,

  app: {
    baseURL: `${basePath}/`,
  },

  css: [
    `${playgroundRoot}/assets/css/tokens.css`,
    `${playgroundRoot}/assets/css/panel.css`,
  ],

  imports: {
    dirs: [`${playgroundRoot}/composables`],
  },

  components: [
    { path: docusOverridesRoot, pathPrefix: false, priority: 1 },
    { path: `${playgroundRoot}/components`, pathPrefix: false },
  ],

  alias: {
    '@playground': playgroundRoot,
  },

  robots: {
    robotsTxt: false,
  },

  ogImage: {
    enabled: false,
  },

  site: {
    url: siteOrigin,
    name: 'nuxt-atproto',
    description: 'AT Protocol OAuth authentication module for Nuxt — client-first sessions and cached agents.',
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
  },

  devServer: {
    host: '127.0.0.1',
    port: 3456,
  },

  compatibilityDate: '2026-05-29',

  vite: {
    optimizeDeps: {
      include: [
        '@atproto/oauth-client-browser',
        '@atproto/api',
        'core-js',
      ],
    },
  },

  nitro: {
    preset: 'static',
    prerender: {
      // h3 v1/v2 mismatch breaks sql_dump + sitemap handlers during prerender with ssr:false
      ignore: [
        '/__nuxt_content/',
        '/sitemap.xml',
      ],
    },
  },

  routeRules: {
    '/__nuxt_content/**/sql_dump.txt': { prerender: false },
  },

  runtimeConfig: {
    public: {
      playgroundUrl: process.env.NUXT_PUBLIC_PLAYGROUND_URL || appUrl,
      docsUrl: process.env.NUXT_PUBLIC_DOCS_URL || appUrl,
      siteOrigin,
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
        remote: '',
        local: {
          client_id: clientMetadataUrl,
          client_name: 'nuxt-atproto docs',
          client_uri: appUrl,
          logo_uri: `${siteOrigin}${basePath}/favicon.ico`,
          tos_uri: appUrl,
          policy_uri: appUrl,
          redirect_uris: [appUrl],
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
    debug: false,
  },

  hooks: {
    // Run after Docus adds /sitemap.xml — handler fails on h3 v1/v2 mismatch during prerender.
    'nitro:config'(nitroConfig) {
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = (nitroConfig.prerender.routes || [])
        .filter(route => route !== '/sitemap.xml' && !String(route).includes('sql_dump.txt'))
    },
  },
})
