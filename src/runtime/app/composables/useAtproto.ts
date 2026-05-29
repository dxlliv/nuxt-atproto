import type { OAuthSession } from '@atproto/oauth-client-browser'
import { useAtprotoAuth } from './useAtprotoAuth'
import { useAtprotoSession } from './useAtprotoSession'

/**
 * @deprecated Use `useAtprotoSession` and `useAtprotoAuth` instead.
 */
export function useAtproto() {
  const { session, isLogged } = useAtprotoSession()
  const auth = useAtprotoAuth()

  return {
    ...auth,
    signInWithHandle: async (handle?: string, options?: Parameters<typeof auth.signInWithHandle>[1]) => {
      if (!handle) {
        const handlePrompt = window.prompt('Type your handle')
        if (!handlePrompt) {
          return
        }
        return auth.signInWithHandle(handlePrompt, options)
      }
      return auth.signInWithHandle(handle, options)
    },
    isLogged: () => isLogged.value,
    getSession: (): OAuthSession | undefined => session.value,
  }
}
