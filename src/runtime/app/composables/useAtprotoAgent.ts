import type { Agent, AtpAgent } from '@atproto/api'
import { useAgent } from './useAgent'

export type AtprotoAgentScope = 'authenticated' | 'public' | (string & {})

/**
 * Returns a cached AT Protocol agent for the given scope (client-only).
 *
 * - `authenticated` — OAuth session agent (formerly `private`)
 * - `public` — unauthenticated public API agent
 * - custom string — `AtpAgent` for a specific PDS/service URL
 */
export function useAtprotoAgent(
  scope: AtprotoAgentScope,
  fetch?: typeof globalThis.fetch,
): Agent | AtpAgent {
  if (import.meta.server) {
    throw new Error('useAtprotoAgent is only available on the client')
  }

  const service = scope === 'authenticated' ? 'private' : scope

  return useAgent(service, fetch)
}
