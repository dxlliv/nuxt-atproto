<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showDevPanel?: boolean
    compact?: boolean
    savedAccountsLead?: string
  }>(),
  {
    showDevPanel: false,
    compact: false,
    savedAccountsLead: 'Profiles cached locally after login. Switch without leaving the app.',
  },
)

const {
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
} = usePlaygroundSession()

const { loadFromStorage, entries, profiles } = useStoredProfiles()

const otherEntries = computed(() =>
  entries.value.filter(entry => entry.profile.did !== session.value?.sub),
)

registerSessionHooks()

function syncProfileIfNeeded(): void {
  const did = session.value?.sub
  if (did && !profiles.value[did] && !loadingProfile.value) {
    void fetchAndStoreProfile(did)
  }
}

onMounted(() => {
  loadFromStorage()
  syncProfileIfNeeded()
})

watch(() => session.value?.sub, syncProfileIfNeeded)

async function onSignInWithHandle(handle: string): Promise<void> {
  await signInWithHandle(handle)
}
</script>

<template>
  <div
    class="pg-demo pg-stack"
    :class="{
      'pg-demo--compact': props.compact,
      'pg-demo--logged-in': isLogged,
    }"
  >
    <PlaygroundAuthPanel
      v-if="!isLogged"
      :embedded="props.compact"
      @sign-in="signIn()"
      @sign-in-with-handle="onSignInWithHandle"
    />

    <section
      v-else
      class="panel"
      :class="{
        'panel--compact': props.compact,
        'panel--session-block': props.compact,
      }"
    >
      <h2
        v-if="!props.compact"
        class="panel__section-title"
      >
        Active session
      </h2>

      <p
        v-if="loadingProfile"
        class="alert alert--loading"
        role="status"
      >
        Loading profile from the network…
      </p>
      <p
        v-else-if="profileError"
        class="alert alert--error"
        role="alert"
      >
        {{ profileError }}
      </p>

      <PlaygroundProfileCard
        v-if="currentEntry"
        :entry="currentEntry"
        :compact="props.compact"
        active
      >
        <template #actions>
          <button
            type="button"
            class="btn btn--danger"
            :class="{ 'btn--sm': props.compact }"
            @click="signOut()"
          >
            Sign out
          </button>
        </template>
      </PlaygroundProfileCard>

      <p
        v-else-if="session && !loadingProfile"
        class="alert alert--loading"
      >
        Signed in as <code>{{ session.sub }}</code> — waiting for profile cache.
      </p>

      <template v-if="props.compact">
        <div
          class="panel__split"
          role="separator"
        />

        <PlaygroundAuthPanel
          add-account
          embedded
          @sign-in="signIn()"
          @sign-in-with-handle="onSignInWithHandle"
        />
      </template>
    </section>

    <PlaygroundAuthPanel
      v-if="isLogged && !props.compact"
      add-account
      @sign-in="signIn()"
      @sign-in-with-handle="onSignInWithHandle"
    />

    <section
      v-if="otherEntries.length > 0"
      class="panel"
      :class="{
        'panel--compact': props.compact,
        'panel--accounts-compact': props.compact,
      }"
    >
      <div
        v-if="props.compact"
        class="panel__split"
        role="separator"
      />

      <template v-if="!props.compact">
        <h2 class="panel__section-title">
          Saved accounts
        </h2>
        <p class="panel__lead">
          {{ props.savedAccountsLead }}
        </p>
      </template>
      <p
        v-else
        class="panel__accounts-label"
      >
        Switch account
      </p>
      <div
        class="pg-stack"
        :class="{ 'pg-stack--dense': props.compact }"
      >
        <PlaygroundProfileCard
          v-for="entry in otherEntries"
          :key="entry.profile.did"
          :entry="entry"
          :compact="props.compact"
          :active="session?.sub === entry.profile.did"
        >
          <template #actions>
            <button
              v-if="session?.sub !== entry.profile.did"
              type="button"
              class="btn btn--secondary"
              :class="{ 'btn--sm': props.compact }"
              @click="restore(entry.profile.did)"
            >
              Switch
            </button>
            <span
              v-else
              class="btn btn--ghost"
              :class="{ 'btn--sm': props.compact }"
              style="pointer-events: none;"
            >
              Current
            </span>
          </template>
        </PlaygroundProfileCard>
      </div>
    </section>

    <PlaygroundDevPanel
      v-if="props.showDevPanel"
      :status="status"
      :is-logged="isLogged"
    />
  </div>
</template>
