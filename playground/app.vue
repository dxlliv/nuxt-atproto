<script setup lang="ts">
useHead({
  title: 'nuxt-atproto playground',
  meta: [
    { name: 'description', content: 'Interactive demo for the nuxt-atproto Nuxt module' },
  ],
})

const { public: { docsUrl } } = useRuntimeConfig()

const { loadFromStorage, entries } = useStoredProfiles()

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
  registerSessionHooks,
} = usePlaygroundSession()

const otherEntries = computed(() =>
  entries.value.filter(entry => entry.profile.did !== session.value?.sub),
)

registerSessionHooks()

onMounted(() => {
  loadFromStorage()
})

async function onSignInWithHandle(handle: string): Promise<void> {
  await signInWithHandle(handle)
}
</script>

<template>
  <div class="pg">
    <header class="pg-header">
      <div class="pg-header__bar">
        <div class="pg-header__brand">
          <h1 class="pg-header__title">
            <span>nuxt</span>-atproto
          </h1>
          <p class="pg-header__tagline">
            OAuth playground
          </p>
        </div>

        <nav
          class="pg-nav"
          aria-label="Resources"
        >
          <a
            class="pg-nav__link"
            :href="docsUrl"
          >Docs</a>
          <a
            class="pg-nav__link pg-nav__link--icon"
            href="https://github.com/dxlliv/nuxt-atproto"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            <PlaygroundIcon name="github" :size="17" />
          </a>
        </nav>

        <PlaygroundStatusBadge
          class="pg-header__badge"
          :status="status"
        />
      </div>
    </header>

    <main class="pg-stack">
      <PlaygroundAuthPanel
        v-if="!isLogged"
        @sign-in="signIn()"
        @sign-in-with-handle="onSignInWithHandle"
      />

      <section
        v-else
        class="panel"
      >
        <h2 class="panel__section-title">
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
          active
        >
          <template #actions>
            <button
              type="button"
              class="btn btn--danger"
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
      </section>

      <PlaygroundAuthPanel
        v-if="isLogged"
        add-account
        @sign-in="signIn()"
        @sign-in-with-handle="onSignInWithHandle"
      />

      <section
        v-if="otherEntries.length > 0"
        class="panel"
      >
        <h2 class="panel__section-title">
          Saved accounts
        </h2>
        <p class="panel__lead">
          Profiles cached locally after login. Switch without leaving the app.
        </p>
        <div class="pg-stack">
          <PlaygroundProfileCard
            v-for="entry in otherEntries"
            :key="entry.profile.did"
            :entry="entry"
            :active="session?.sub === entry.profile.did"
          >
            <template #actions>
              <button
                v-if="session?.sub !== entry.profile.did"
                type="button"
                class="btn btn--secondary"
                @click="restore(entry.profile.did)"
              >
                Switch
              </button>
              <span
                v-else
                class="btn btn--ghost"
                style="pointer-events: none;"
              >
                Current
              </span>
            </template>
          </PlaygroundProfileCard>
        </div>
      </section>

      <PlaygroundDevPanel
        :status="status"
        :is-logged="isLogged"
      />
    </main>

    <footer class="pg-footer">
      <p class="pg-footer__line">
        <span class="pg-footer__brand"><span>nuxt</span>-atproto</span>
        · <a :href="docsUrl">docs</a>
        · <a
          href="https://github.com/dxlliv/nuxt-atproto"
          target="_blank"
          rel="noopener noreferrer"
        >github</a>
        · <a
          href="https://www.npmjs.com/package/nuxt-atproto"
          target="_blank"
          rel="noopener noreferrer"
        >npm</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.panel__lead {
  margin: -0.35rem 0 1rem;
  font-size: 0.875rem;
  color: var(--pg-muted);
}

code {
  font-family: var(--pg-mono);
  font-size: 0.85em;
  color: var(--pg-accent);
}
</style>
