import { describe, expect, it, vi } from 'vitest'
import { scheduleAtprotoSessionHooks } from '../src/runtime/app/utils/sessionLifecycle'

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
