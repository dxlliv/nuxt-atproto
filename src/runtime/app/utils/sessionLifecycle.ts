import type { OAuthSession } from '@atproto/oauth-client-browser'
import type { NuxtApp } from 'nuxt/app'
import type { AtprotoContext, AtprotoSessionStatus } from '../../../types'
import { invalidateAtprotoPrivateAgent } from './agentCache'

export interface AtprotoSessionLifecycleHooks {
  hook: (name: string, callback: () => void) => void
  callHook: (name: string, did: string) => void | Promise<void>
}

export type AtprotoSessionTransition
  = | 'oauth-return'
    | 'cold-restore'
    | 'account-switch'
    | 'sign-out'

export interface ApplyAtprotoSessionOptions {
  /** When true, lifecycle hooks run after `app:mounted` (plugin init). */
  deferHooks?: boolean
  /** Pass during plugin setup before `provide` returns. */
  atproto?: AtprotoContext
}

/**
 * Updates `$atproto` session state, agent cache, status, and lifecycle hooks.
 */
export function applyAtprotoSession(
  nuxtApp: NuxtApp,
  session: OAuthSession | undefined,
  transition: AtprotoSessionTransition,
  options: ApplyAtprotoSessionOptions = {},
): void {
  const atproto = options.atproto ?? nuxtApp.$atproto
  const { deferHooks = false } = options

  if (session) {
    invalidateAtprotoPrivateAgent()
    atproto.session.value = session
    atproto.status.value = 'authenticated' satisfies AtprotoSessionStatus

    const hookName = transition === 'oauth-return'
      ? 'atproto:sessionCreated'
      : 'atproto:sessionRestored'

    emitSessionLifecycleHook(nuxtApp.hooks as unknown as AtprotoSessionLifecycleHooks, hookName, session.sub, deferHooks)

    return
  }

  invalidateAtprotoPrivateAgent()
  atproto.session.value = undefined
  atproto.status.value = 'anonymous' satisfies AtprotoSessionStatus

  // `sign-out`: `atproto:sessionDeleted` is emitted by `BrowserOAuthClient.onDelete` when
  // `revoke()` runs. Avoid duplicating the hook here.
}

function emitSessionLifecycleHook(
  hooks: AtprotoSessionLifecycleHooks,
  hookName: string,
  did: string,
  defer: boolean,
): void {
  if (defer) {
    hooks.hook('app:mounted', () => {
      hooks.callHook(hookName, did)
    })
    return
  }

  hooks.callHook(hookName, did)
}

/**
 * @deprecated Use `applyAtprotoSession` with `deferHooks: true` instead.
 */
export function scheduleAtprotoSessionHooks(
  hooks: AtprotoSessionLifecycleHooks,
  sessionSub: string,
  state: string | null | undefined,
): void {
  const hookName = state != null ? 'atproto:sessionCreated' : 'atproto:sessionRestored'
  emitSessionLifecycleHook(hooks, hookName, sessionSub, true)
}
