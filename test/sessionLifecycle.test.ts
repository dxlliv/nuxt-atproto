import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

vi.mock('../src/runtime/app/utils/agentCache', () => ({
  invalidateAtprotoPrivateAgent: vi.fn(),
}))

import {
  applyAtprotoSession,
  scheduleAtprotoSessionHooks,
} from '../src/runtime/app/utils/sessionLifecycle'
import type { AtprotoContext } from '../src/types'

function createMockAtproto() {
  return {
    client: {} as AtprotoContext['client'],
    session: ref(undefined),
    status: ref('anonymous' as const),
  } satisfies AtprotoContext
}

function createMockNuxtApp(atproto: AtprotoContext) {
  return {
    $atproto: atproto,
    hooks: {
      hook: vi.fn(),
      callHook: vi.fn(),
    },
  }
}

describe('applyAtprotoSession', () => {
  it('sets authenticated session and calls sessionRestored immediately', () => {
    const atproto = createMockAtproto()
    const nuxtApp = createMockNuxtApp(atproto)
    const session = { sub: 'did:plc:alice' } as never

    applyAtprotoSession(nuxtApp as never, session, 'account-switch', { atproto })

    expect(atproto.session.value).toStrictEqual(session)
    expect(atproto.status.value).toBe('authenticated')
    expect(nuxtApp.hooks.callHook).toHaveBeenCalledWith('atproto:sessionRestored', 'did:plc:alice')
    expect(nuxtApp.hooks.hook).not.toHaveBeenCalled()
  })

  it('defers sessionCreated on oauth-return when deferHooks is true', () => {
    const atproto = createMockAtproto()
    const nuxtApp = createMockNuxtApp(atproto)
    const session = { sub: 'did:plc:bob' } as never

    applyAtprotoSession(nuxtApp as never, session, 'oauth-return', { deferHooks: true, atproto })

    expect(nuxtApp.hooks.hook).toHaveBeenCalledWith('app:mounted', expect.any(Function))
    expect(nuxtApp.hooks.callHook).not.toHaveBeenCalled()
  })

  it('clears session on sign-out without emitting sessionDeleted', () => {
    const atproto = createMockAtproto()
    atproto.session.value = { sub: 'did:plc:carol' } as never
    atproto.status.value = 'authenticated'
    const nuxtApp = createMockNuxtApp(atproto)

    applyAtprotoSession(nuxtApp as never, undefined, 'sign-out', { atproto })

    expect(atproto.session.value).toBeUndefined()
    expect(atproto.status.value).toBe('anonymous')
    expect(nuxtApp.hooks.callHook).not.toHaveBeenCalled()
  })
})

describe('scheduleAtprotoSessionHooks', () => {
  it('calls sessionCreated when state is present', () => {
    const callHook = vi.fn()
    const hook = vi.fn((_name: string, callback: () => void) => {
      callback()
    })

    scheduleAtprotoSessionHooks({ hook, callHook }, 'did:plc:alice', 'oauth-state')

    expect(hook).toHaveBeenCalledWith('app:mounted', expect.any(Function))
    expect(callHook).toHaveBeenCalledWith('atproto:sessionCreated', 'did:plc:alice')
  })

  it('calls sessionRestored when state is absent', () => {
    const callHook = vi.fn()
    const hook = vi.fn((_name: string, callback: () => void) => {
      callback()
    })

    scheduleAtprotoSessionHooks({ hook, callHook }, 'did:plc:alice', null)

    expect(callHook).toHaveBeenCalledWith('atproto:sessionRestored', 'did:plc:alice')
  })
})
