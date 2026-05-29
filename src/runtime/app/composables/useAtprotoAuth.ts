import type { OAuthSession } from '@atproto/oauth-client-browser'
import type { AtprotoSignInOptions } from '../../../types'
import { useNuxtApp } from 'nuxt/app'
import { invalidateAtprotoPrivateAgent } from '../utils/agentCache'
import { useAtprotoRuntimeConfig } from '../utils/useAtprotoRuntimeConfig'

export interface UseAtprotoAuthReturn {
  signIn: (serviceEndpoint?: string, options?: AtprotoSignInOptions) => Promise<void>
  signInWithHandle: (handle: string, options?: AtprotoSignInOptions) => Promise<void>
  signOut: () => Promise<void>
  restore: (did: string) => Promise<OAuthSession>
}

const serverAuthReturn: UseAtprotoAuthReturn = {
  signIn: async () => {},
  signInWithHandle: async () => {},
  signOut: async () => {},
  restore: async () => {
    throw new Error('useAtprotoAuth is only available on the client')
  },
}

/**
 * ATProto sign-in, sign-out, and session restore (client-only).
 */
export function useAtprotoAuth(): UseAtprotoAuthReturn {
  if (import.meta.server) {
    return serverAuthReturn
  }

  const atprotoConfig = useAtprotoRuntimeConfig()

  async function signIn(
    serviceEndpoint: string = atprotoConfig.serviceEndpoint.private,
    options: AtprotoSignInOptions = atprotoConfig.oauth.signInOptions,
  ): Promise<void> {
    const { $atproto } = useNuxtApp()

    try {
      await $atproto.client.signInRedirect(
        serviceEndpoint,
        {
          ...options,
          signal: new AbortController().signal,
        },
      )
    }
    catch (error) {
      console.error('Error during sign-in:', error)
    }
  }

  async function signInWithHandle(
    handle: string,
    options: AtprotoSignInOptions = atprotoConfig.oauth.signInOptions,
  ): Promise<void> {
    const { $atproto } = useNuxtApp()

    try {
      const url = await $atproto.client.authorize(handle, options)
      window.location.href = url.href
    }
    catch (error) {
      console.error(`Error during sign-in for handle ${handle}:`, error)
    }
  }

  async function restore(did: string): Promise<OAuthSession> {
    const { $atproto } = useNuxtApp()

    const session = await $atproto.client.restore(did)

    invalidateAtprotoPrivateAgent()
    $atproto.session.value = session
    $atproto.status.value = 'authenticated'

    return session
  }

  async function signOut(): Promise<void> {
    const { $atproto } = useNuxtApp()

    const session = $atproto.session.value
    if (session) {
      try {
        await $atproto.client.revoke(session.did)
      }
      catch (error) {
        console.error('Error revoking ATProto session:', error)
      }
    }

    invalidateAtprotoPrivateAgent()
    $atproto.session.value = undefined
    $atproto.status.value = 'anonymous'

    if (atprotoConfig.debug) {
      console.log('User signed out')
    }
  }

  return {
    signIn,
    signInWithHandle,
    signOut,
    restore,
  }
}
