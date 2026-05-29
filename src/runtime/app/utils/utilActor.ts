import { useAgent } from "../composables/useAgent"

export async function resolveActorDid(handle: string): Promise<string> {
  const agent = useAgent('public')

  const { did } = await agent
    .com.atproto.identity
    .resolveHandle({
      handle
    })
    .then(result => result.data)

  return did
}

export async function resolveActorServiceEndpoint(did: string): Promise<string> {
  const response = await fetch(`https://plc.directory/${did}`)

  if (!response.ok) {
    throw new Error('Failed to fetch profile service endpoint');
  }

  const data = await response.json()

  return data.service[0].serviceEndpoint
}
