export interface AtprotoSessionLifecycleHooks {
  hook: (name: string, callback: () => void) => void
  callHook: (name: string, did: string) => void | Promise<void>
}

/**
 * Schedules session lifecycle hooks after the app is mounted on the client.
 */
export function scheduleAtprotoSessionHooks(
  hooks: AtprotoSessionLifecycleHooks,
  sessionSub: string,
  state: string | null | undefined,
): void {
  hooks.hook('app:mounted', () => {
    if (state != null) {
      hooks.callHook('atproto:sessionCreated', sessionSub)
    }
    else {
      hooks.callHook('atproto:sessionRestored', sessionSub)
    }
  })
}
