export function usePlaygroundSession() {
  const { session, isLogged, status } = useAtprotoSession()
  const { signIn, signInWithHandle, signOut, restore } = useAtprotoAuth()
  const stored = useStoredProfiles()
  const { upsert, remove, profiles } = stored

  const loadingProfile = ref(false)
  const profileError = ref<string | null>(null)

  async function fetchAndStoreProfile(did: string): Promise<void> {
    loadingProfile.value = true
    profileError.value = null

    try {
      const agent = useAtprotoAgent('public')
      const { data } = await agent.getProfile({ actor: did })

      upsert(did, {
        did: data.did,
        handle: data.handle,
        displayName: data.displayName,
        avatar: data.avatar,
        description: data.description,
      })
    }
    catch (error) {
      profileError.value = error instanceof Error ? error.message : 'Failed to load profile'
    }
    finally {
      loadingProfile.value = false
    }
  }

  function registerSessionHooks(): void {
    const { hook } = useNuxtApp()

    hook('atproto:sessionCreated', fetchAndStoreProfile)
    hook('atproto:sessionRestored', fetchAndStoreProfile)
    hook('atproto:sessionDeleted', (did: string) => {
      remove(did)
    })
  }

  const currentEntry = computed(() => {
    const did = session.value?.sub
    if (!did) {
      return null
    }
    return profiles.value[did] ?? null
  })

  return {
    session,
    isLogged,
    status,
    signIn,
    signInWithHandle,
    signOut,
    restore,
    loadingProfile,
    profileError,
    currentEntry,
    fetchAndStoreProfile,
    registerSessionHooks,
  }
}
