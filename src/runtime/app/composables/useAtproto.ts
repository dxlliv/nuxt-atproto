import type { OAuthSession } from '@atproto/oauth-client-browser'
import { useNuxtApp } from 'nuxt/app'
import { invalidateAtprotoPrivateAgent } from '../utils/agentCache'
import { useAtprotoRuntimeConfig } from '../utils/useAtprotoRuntimeConfig'

export function useAtproto() {
  const atprotoConfig = useAtprotoRuntimeConfig()

  async function signIn(
    serviceEndpoint: string = atprotoConfig.serviceEndpoint.private,
    options = atprotoConfig.oauth.signInOptions,
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
    handle?: string,
    options = atprotoConfig.oauth.signInOptions,
  ): Promise<void> {
    const { $atproto } = useNuxtApp()

    try {
      let resolvedHandle = handle

      if (!resolvedHandle) {
        const handlePrompt = window.prompt('Type your handle')

        if (!handlePrompt) {
          return
        }

        resolvedHandle = handlePrompt
      }

      const url = await $atproto.client.authorize(resolvedHandle, options)

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

    if (atprotoConfig.debug) {
      console.log('User signed out')
    }
  }

  function isLogged(): boolean {
    const { $atproto } = useNuxtApp()

    return !!$atproto.session.value
  }

  function getSession(): OAuthSession | undefined {
    const { $atproto } = useNuxtApp()

    return $atproto.session.value
  }

  return {
    signIn,
    signInWithHandle,
    signOut,
    restore,
    isLogged,
    getSession,
  }
}
