import type { OAuthSession } from '@atproto/oauth-client'
import { useRuntimeConfig, useNuxtApp } from 'nuxt/app'
import { useAgent } from './useAgent'

export function useAtproto(
  service?: string,
  fetch?: any,
) {
  const runtimeConfig = useRuntimeConfig()

  /**
   * Sign in using ATProto
   *
   * @param serviceEndpoint
   * @param options
   */
  async function signIn(
    serviceEndpoint: string = runtimeConfig.public.atproto.serviceEndpoint.private,
    options = runtimeConfig.public.atproto.oauth.signInOptions,
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
      console.error(`Error during sign-in:`, error)
    }
  }

  /**
   * Sign in using ATProto with a specific handle
   *
   * @param handle
   * @param options
   */
  async function signInWithHandle(
    handle?: string,
    options = runtimeConfig.public.atproto.oauth.signInOptions,
  ): Promise<void> {
    const { $atproto } = useNuxtApp()

    try {
      let handlePrompt = null

      if (!handle) {
        handlePrompt = window.prompt('Type your handle')

        if (!handlePrompt) {
          return
        }

        handle = handlePrompt
      }

      // Generate the authorization URL for the provided handle
      const url = await $atproto.client.authorize(handle, options)

      window.location.href = url.href
    }
    catch (error) {
      console.error(`Error during sign-in for handle ${handle}:`, error)
    }
  }

  /**
   * Resume session of an already logged account
   */
  async function restore(did: string): Promise<OAuthSession> {
    const { $atproto } = useNuxtApp()

    const session = await $atproto.client.restore(did)

    $atproto.session.value = session

    return session
  }

  /**
   * Sign out from ATProto
   */
  async function signOut(): Promise<void> {
    const { $atproto } = useNuxtApp()

    $atproto.client.revoke($atproto.session.value.did)

    $atproto.session.value = undefined

    if (runtimeConfig.public.atproto.debug) {
      console.log('User signed out')
    }
  }

  /**
   * Checks if a user is currently logged in by verifying the session status
   *
   * @return {boolean}
   */
  function isLogged(): boolean {
    const { $atproto } = useNuxtApp()

    return !!$atproto.session.value
  }

  /**
   * Retrieves the current session from the Nuxt application context.
   *
   * @return {Object} The oauth session object from the `$atproto` instance.
   */
  function getSession(): any {
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
