import type { BrowserOAuthClient, OAuthSession } from '@atproto/oauth-client-browser'
import type { HookResult } from '@nuxt/schema'
import type { Ref } from 'vue'

export type AtprotoSessionStatus = 'initializing' | 'ready' | 'anonymous' | 'authenticated'

export interface AtprotoContext {
  client: BrowserOAuthClient
  session: Ref<OAuthSession | undefined>
  status: Ref<AtprotoSessionStatus>
}

declare module '#app' {
  interface NuxtApp {
    $atproto: AtprotoContext
  }

  interface RuntimeNuxtHooks {
    'atproto:sessionCreated': (did: string) => HookResult
    'atproto:sessionRestored': (did: string) => HookResult
    'atproto:sessionDeleted': (did: string) => HookResult
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $atproto: AtprotoContext
  }
}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    atproto: AtprotoNuxtOptions
  }
}

export interface AtprotoNuxtOptions {
  serviceEndpoint: {
    private: string
    public: string
  }
  oauth: {
    clientMetadata: {
      remote?: string
      local?: {
        client_id: string
        client_name: string
        client_uri: string
        logo_uri: string
        tos_uri: string
        policy_uri: string
        redirect_uris: string[]
        scope: string
        grant_types: Array<string>
        response_types: Array<string>
        token_endpoint_auth_method: string
        application_type: string
        dpop_bound_access_tokens: boolean
      }
    }
    signInOptions: AtprotoSignInOptions
  }
  debug: boolean
}

export interface AtprotoSignInOptions {
  state: string
  prompt: 'login' | 'consent'
  scope: string
  ui_locales: string
}

export type { OAuthSession }

export {}
