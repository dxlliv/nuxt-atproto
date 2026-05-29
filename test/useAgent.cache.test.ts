import { ref, type Ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const stateStore = new Map<string, Ref<unknown>>()

function mockUseState<T>(key: string, init: () => T): Ref<T> {
  if (!stateStore.has(key)) {
    stateStore.set(key, ref(init()))
  }
  return stateStore.get(key) as Ref<T>
}

const mockSession = ref<{ sub: string, did: string } | undefined>(undefined)

const createdInstances: unknown[] = []

vi.mock('nuxt/app', () => ({
  useNuxtApp: () => ({
    $atproto: {
      session: mockSession,
    },
  }),
  useRuntimeConfig: () => ({
    public: {
      atproto: {
        serviceEndpoint: {
          public: 'https://public.api.bsky.app',
        },
      },
    },
  }),
  useState: mockUseState,
}))

vi.mock('@atproto/api', () => {
  class MockAgent {
    constructor() {
      createdInstances.push(this)
    }
  }
  class MockAtpAgent {
    constructor() {
      createdInstances.push(this)
    }
  }
  return { Agent: MockAgent, AtpAgent: MockAtpAgent }
})

describe('useAgent cache', () => {
  beforeEach(async () => {
    stateStore.clear()
    mockSession.value = undefined
    createdInstances.length = 0
    vi.resetModules()
  })

  it('returns the same public agent instance across calls', async () => {
    const { useAgent } = await import('../src/runtime/app/composables/useAgent')

    useAgent('public')
    useAgent('public')

    expect(createdInstances).toHaveLength(1)
  })

  it('returns the same private agent for the same session', async () => {
    mockSession.value = { sub: 'did:plc:alice', did: 'did:plc:alice' }

    const { useAgent } = await import('../src/runtime/app/composables/useAgent')

    useAgent('private')
    useAgent('private')

    expect(createdInstances).toHaveLength(1)
  })

  it('recreates private agent after session change', async () => {
    mockSession.value = { sub: 'did:plc:alice', did: 'did:plc:alice' }

    const { useAgent } = await import('../src/runtime/app/composables/useAgent')
    const { invalidateAtprotoPrivateAgent } = await import('../src/runtime/app/utils/agentCache')

    useAgent('private')

    mockSession.value = { sub: 'did:plc:bob', did: 'did:plc:bob' }
    invalidateAtprotoPrivateAgent()

    useAgent('private')

    expect(createdInstances).toHaveLength(2)
  })

  it('throws when private agent is requested without a session', async () => {
    const { useAgent } = await import('../src/runtime/app/composables/useAgent')

    expect(() => useAgent('private')).toThrow('Not authenticated')
  })
})
