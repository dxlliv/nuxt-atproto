import { useNuxtApp, useState } from 'nuxt/app'
import { useAtprotoRuntimeConfig } from '../utils/useAtprotoRuntimeConfig'
import { Agent, AtpAgent } from '@atproto/api'
import {
  customAgentStateKey,
  invalidateAtprotoPrivateAgent,
  PRIVATE_AGENT_SESSION_KEY,
  PRIVATE_AGENT_STATE_KEY,
  publicAgentStateKey,
} from '../utils/agentCache'

/**
 * Returns a cached AT Protocol agent for the given scope.
 *
 * @deprecated Use `useAtprotoAgent` instead (`private` → `authenticated`).
 */
export function useAgent(
  service: 'private' | 'public' | (string & {}),
  fetch?: typeof globalThis.fetch,
) {
  const atprotoConfig = useAtprotoRuntimeConfig()
  const { $atproto } = useNuxtApp()

  switch (service) {
    case 'private': {
      if (!$atproto.session.value) {
        invalidateAtprotoPrivateAgent()
        throw new Error('Not authenticated')
      }

      const sessionSub = $atproto.session.value.sub
      const cachedAgent = useState<Agent | null>(PRIVATE_AGENT_STATE_KEY, () => null)
      const cachedSessionSub = useState<string | null>(PRIVATE_AGENT_SESSION_KEY, () => null)

      if (cachedAgent.value && cachedSessionSub.value === sessionSub) {
        return cachedAgent.value
      }

      const agent = new Agent($atproto.session.value)
      cachedAgent.value = agent
      cachedSessionSub.value = sessionSub

      return agent
    }
    case 'public': {
      const endpoint = atprotoConfig.serviceEndpoint.public
      const cacheKey = publicAgentStateKey(endpoint)
      const cachedAgent = useState<AtpAgent | null>(cacheKey, () => null)

      if (cachedAgent.value) {
        return cachedAgent.value
      }

      const agent = new AtpAgent({
        service: endpoint,
        fetch,
      })
      cachedAgent.value = agent

      return agent
    }
    default: {
      const cacheKey = customAgentStateKey(service)
      const cachedAgent = useState<AtpAgent | null>(cacheKey, () => null)

      if (cachedAgent.value) {
        return cachedAgent.value
      }

      const agent = new AtpAgent({
        service,
        fetch,
      })
      cachedAgent.value = agent

      return agent
    }
  }
}
