const STORAGE_KEY = 'nuxt-atproto:playground:profiles'

export interface PlaygroundProfile {
  did: string
  handle: string
  displayName?: string
  avatar?: string
  description?: string
}

export interface StoredProfileEntry {
  updatedAt: string
  profile: PlaygroundProfile
}

export function useStoredProfiles() {
  const profiles = useState<Record<string, StoredProfileEntry>>(
    'playground-profiles',
    () => ({}),
  )

  function loadFromStorage(): void {
    if (!import.meta.client) {
      return
    }

    try {
      profiles.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    }
    catch {
      profiles.value = {}
    }
  }

  function persist(): void {
    if (!import.meta.client) {
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles.value))
  }

  function upsert(did: string, profile: PlaygroundProfile): void {
    profiles.value = {
      ...profiles.value,
      [did]: {
        updatedAt: new Date().toISOString(),
        profile,
      },
    }
    persist()
  }

  function remove(did: string): void {
    const next = { ...profiles.value }
    Reflect.deleteProperty(next, did)
    profiles.value = next
    persist()
  }

  const entries = computed(() =>
    Object.values(profiles.value).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    ),
  )

  return {
    profiles,
    entries,
    loadFromStorage,
    upsert,
    remove,
  }
}
