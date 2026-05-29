import type { OAuthSession } from '@atproto/oauth-client-browser'
import { BrowserOAuthClient } from '@atproto/oauth-client-browser'
import { defineNuxtPlugin } from 'nuxt/app'
import { ref } from 'vue'
import type { AtprotoContext, AtprotoSessionStatus } from '../../../types'
import { useAtprotoRuntimeConfig } from '../utils/useAtprotoRuntimeConfig'
import { applyAtprotoSession } from '../utils/sessionLifecycle'

export default defineNuxtPlugin({
  name: 'atproto',
  async setup(nuxtApp) {
    const atprotoConfig = useAtprotoRuntimeConfig()
    const status = ref<AtprotoSessionStatus>('initializing')
    const atprotoOAuthSession = ref<OAuthSession | undefined>()

    const clientOptions = {
      handleResolver: atprotoConfig.serviceEndpoint.private,
      onDelete: (sub: string, cause: unknown) => {
        if (atprotoConfig.debug) {
          console.warn(`Session deleted for ${sub}. Cause:`, cause)
        }

        nuxtApp.hooks.callHook('atproto:sessionDeleted', sub)
      },
    }

    let atprotoOAuthClient: BrowserOAuthClient

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

    const atproto: AtprotoContext = {
      client: atprotoOAuthClient,
      session: atprotoOAuthSession,
      status,
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

        applyAtprotoSession(
          nuxtApp,
          session,
          state != null ? 'oauth-return' : 'cold-restore',
          { deferHooks: true, atproto },
        )
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
        atproto,
      },
    }
  },
})
