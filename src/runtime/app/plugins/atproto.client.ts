import type { OAuthSession } from '@atproto/oauth-client-browser'
import { BrowserOAuthClient } from '@atproto/oauth-client-browser'
import { useRuntimeConfig, defineNuxtPlugin } from 'nuxt/app'
import { ref } from 'vue'

export default defineNuxtPlugin({
  name: 'atproto',
  async setup(_nuxtApp) {
    const runtimeConfig = useRuntimeConfig()

    const clientOptions = {
      handleResolver: runtimeConfig.public.atproto.serviceEndpoint.private,
      onDelete: (sub: string, cause: unknown) => {
        if (runtimeConfig.public.atproto.debug) {
          console.warn(`Session deleted for ${sub}. Cause:`, cause)
        }

        _nuxtApp.hooks.callHook('atproto:sessionDeleted', sub)
      },
    }

    let atprotoOAuthClient: BrowserOAuthClient

    const atprotoOAuthSession = ref<OAuthSession | undefined>()

    if (runtimeConfig.public.atproto.oauth.clientMetadata.remote) {
      atprotoOAuthClient = await BrowserOAuthClient.load({
        ...clientOptions,
        clientId: runtimeConfig.public.atproto.oauth.clientMetadata.remote,
      })
    }
    else {
      atprotoOAuthClient = new BrowserOAuthClient({
        ...clientOptions,
        clientMetadata: import.meta.env.DEV
          ? undefined
          : runtimeConfig.public.atproto.oauth.clientMetadata.local,
      })
    }

    await atprotoOAuthClient.init()
      .then(async (result: undefined | { session: OAuthSession, state?: string | null }) => {
        if (!result) {
          return
        }

        const { session, state } = result

        if (runtimeConfig.public.atproto.debug) {
          if (state != null) {
            console.log(`${session.sub} was successfully authenticated (state: ${state})`)
          }
          else {
            console.log(`${session.sub} was restored (last active session)`)
          }
        }

        _nuxtApp.hook('app:mounted', () => {
          if (state != null) {
            _nuxtApp.hooks.callHook('atproto:sessionCreated', session.sub)
          }
          else {
            _nuxtApp.hooks.callHook('atproto:sessionRestored', session.sub)
          }
        })

        atprotoOAuthSession.value = session
      })
      .catch((error: unknown) => {
        console.error('Error initializing ATProto client or restoring session:', error)
      })

    return {
      provide: {
        atproto: {
          client: atprotoOAuthClient,
          session: atprotoOAuthSession,
        },
      },
    }
  },
})
