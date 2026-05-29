import type { OAuthSession } from '@atproto/oauth-client-browser'
import { BrowserOAuthClient } from '@atproto/oauth-client-browser'
import { defineNuxtPlugin } from 'nuxt/app'
import { useAtprotoRuntimeConfig } from '../utils/useAtprotoRuntimeConfig'
import { ref } from 'vue'
import type { AtprotoSessionStatus } from '../../../types'

export default defineNuxtPlugin({
  name: 'atproto',
  async setup(_nuxtApp) {
    const atprotoConfig = useAtprotoRuntimeConfig()
    const status = ref<AtprotoSessionStatus>('initializing')

    const clientOptions = {
      handleResolver: atprotoConfig.serviceEndpoint.private,
      onDelete: (sub: string, cause: unknown) => {
        if (atprotoConfig.debug) {
          console.warn(`Session deleted for ${sub}. Cause:`, cause)
        }

        _nuxtApp.hooks.callHook('atproto:sessionDeleted', sub)
      },
    }

    let atprotoOAuthClient: BrowserOAuthClient

    const atprotoOAuthSession = ref<OAuthSession | undefined>()

    if (atprotoConfig.oauth.clientMetadata.remote) {
      atprotoOAuthClient = await BrowserOAuthClient.load({
        ...clientOptions,
        clientId: atprotoConfig.oauth.clientMetadata.remote,
      })
    }
    else {
      atprotoOAuthClient = new BrowserOAuthClient({
        ...clientOptions,
        ...(import.meta.env.DEV || !atprotoConfig.oauth.clientMetadata.local
          ? {}
          : { clientMetadata: atprotoConfig.oauth.clientMetadata.local as never }),
      })
    }

    try {
      const result = await atprotoOAuthClient.init()

      if (result) {
        const { session, state } = result

        if (atprotoConfig.debug) {
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
        status.value = 'authenticated'
      }
      else {
        status.value = 'anonymous'
      }
    }
    catch (error: unknown) {
      console.error('Error initializing ATProto client or restoring session:', error)
      status.value = 'anonymous'
    }

    return {
      provide: {
        atproto: {
          client: atprotoOAuthClient,
          session: atprotoOAuthSession,
          status,
        },
      },
    }
  },
})
