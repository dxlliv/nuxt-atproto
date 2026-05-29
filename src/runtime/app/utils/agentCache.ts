import type { Agent } from '@atproto/api'
import { useState } from 'nuxt/app'

export const PRIVATE_AGENT_STATE_KEY = 'atproto:agent:private'
export const PRIVATE_AGENT_SESSION_KEY = 'atproto:agent:private-session-sub'

export function publicAgentStateKey(serviceEndpoint: string): string {
  return `atproto:agent:public:${serviceEndpoint}`
}

export function customAgentStateKey(service: string): string {
  return `atproto:agent:${service}`
}

/**
 * Clears the cached authenticated agent. Call after sign-out or before restore.
 */
export function invalidateAtprotoPrivateAgent(): void {
  const cachedAgent = useState<Agent | null>(PRIVATE_AGENT_STATE_KEY, () => null)
  const cachedSessionSub = useState<string | null>(PRIVATE_AGENT_SESSION_KEY, () => null)

  cachedAgent.value = null
  cachedSessionSub.value = null
}
