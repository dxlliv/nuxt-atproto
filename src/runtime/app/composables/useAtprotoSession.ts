import type { OAuthSession } from '@atproto/oauth-client-browser'
import type { AtprotoSessionStatus } from '../../../types'
import { useNuxtApp } from 'nuxt/app'
import { computed, shallowRef, type ComputedRef, type Ref } from 'vue'

export interface UseAtprotoSessionReturn {
  session: Ref<OAuthSession | undefined>
  isLogged: ComputedRef<boolean>
  status: Ref<AtprotoSessionStatus>
}

const serverSessionReturn: UseAtprotoSessionReturn = {
  session: shallowRef<OAuthSession | undefined>(undefined),
  isLogged: computed(() => false),
  status: shallowRef<AtprotoSessionStatus>('anonymous'),
}

/**
 * Reactive ATProto OAuth session state (client-only).
 */
export function useAtprotoSession(): UseAtprotoSessionReturn {
  if (import.meta.server) {
    return serverSessionReturn
  }

  const { $atproto } = useNuxtApp()

  if (!$atproto) {
    console.warn('[nuxt-atproto] $atproto is not registered on NuxtApp. Make sure the plugin is loaded.')
    return serverSessionReturn
  }

  return {
    session: $atproto.session,
    isLogged: computed(() => !!$atproto.session.value),
    status: $atproto.status,
  }
}
