<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

type PanelMode = 'playground' | 'code'
type CodeFile = 'config' | 'app'

const route = useRoute()
const colorMode = useColorMode()
const panel = ref<PanelMode>('playground')
const codeFile = ref<CodeFile>('config')
const highlightedHtml = ref('')
const highlighting = ref(false)

const modeItems: TabsItem[] = [
  { label: 'Try it out', value: 'playground' },
  { label: 'Code', value: 'code' },
]

const nuxtConfig = `export default defineNuxtConfig({
  modules: ['nuxt-atproto'],
  ssr: false,
  atproto: {
    serviceEndpoint: {
      private: 'https://bsky.social',
      public: 'https://public.api.bsky.app',
    },
    oauth: {
      writeClientMetadata: true,
      clientMetadata: {
        remote: '',
        local: {
          client_id: 'https://your-app.example/client-metadata.json',
          client_name: 'My App',
          client_uri: 'https://your-app.example',
          logo_uri: 'https://your-app.example/logo.png',
          tos_uri: 'https://your-app.example/tos',
          policy_uri: 'https://your-app.example/privacy',
          redirect_uris: ['https://your-app.example'],
          scope: 'atproto transition:generic',
          grant_types: ['authorization_code', 'refresh_token'],
          response_types: ['code'],
          token_endpoint_auth_method: 'none',
          application_type: 'web',
          dpop_bound_access_tokens: true,
        },
      },
      signInOptions: {
        state: '',
        prompt: 'login',
        scope: 'atproto',
        ui_locales: 'en',
      },
    },
  },
})`

const appVue = `<script setup lang="ts">
const { isLogged, session } = useAtprotoSession()
const { signIn, signInWithHandle, signOut } = useAtprotoAuth()

const handle = ref('')
<\/script>

<template>
  <ClientOnly>
    <div v-if="!isLogged">
      <button type="button" @click="signIn()">
        Sign in with ATProto
      </button>

      <input v-model="handle" placeholder="handle.example.com">
      <button
        type="button"
        :disabled="!handle"
        @click="signInWithHandle(handle)"
      >
        Sign in with handle
      </button>
    </div>

    <div v-else>
      <p>Signed in as {{ session?.sub }}</p>
      <button type="button" @click="signOut()">
        Sign out
      </button>
    </div>
  </ClientOnly>
</template>`

watch(() => route.hash, (hash) => {
  if (hash === '#try-it') {
    panel.value = 'playground'
  }
}, { immediate: true })

async function refreshHighlight(): Promise<void> {
  highlighting.value = true
  try {
    highlightedHtml.value = await highlightHeroCode(
      codeFile.value === 'config' ? nuxtConfig : appVue,
      codeFile.value,
      colorMode.value,
    )
  }
  finally {
    highlighting.value = false
  }
}

watch([codeFile, () => colorMode.value], () => {
  void refreshHighlight()
}, { immediate: true })
</script>

<template>
  <div
    id="try-it"
    class="hero-panel"
  >
    <UCard
      :ui="{
        root: 'overflow-hidden rounded-xl ring-1 ring-default/40 bg-elevated/30',
        body: 'p-0 sm:p-0',
      }"
    >
      <div class="hero-panel__shell">
        <div class="hero-panel__tabs-wrap">
          <UTabs
            v-model="panel"
            :items="modeItems"
            :content="false"
            variant="link"
            color="neutral"
            size="sm"
            class="hero-panel__tabs"
          />
        </div>

        <div class="hero-panel__body">
          <div
            class="hero-panel__playground"
            :class="{ 'hero-panel__playground--hidden': panel !== 'playground' }"
            :aria-hidden="panel !== 'playground'"
          >
            <HomeDemo compact />
          </div>

          <div
            class="hero-panel__code"
            :class="{ 'hero-panel__code--hidden': panel !== 'code' }"
            :aria-hidden="panel !== 'code'"
            :inert="panel !== 'code'"
          >
            <div
              class="hero-panel__files"
              role="tablist"
              aria-label="Source files"
            >
              <button
                type="button"
                role="tab"
                class="hero-panel__file"
                :class="{ 'hero-panel__file--active': codeFile === 'config' }"
                :aria-selected="codeFile === 'config'"
                @click="codeFile = 'config'"
              >
                nuxt.config.ts
              </button>
              <button
                type="button"
                role="tab"
                class="hero-panel__file"
                :class="{ 'hero-panel__file--active': codeFile === 'app' }"
                :aria-selected="codeFile === 'app'"
                @click="codeFile = 'app'"
              >
                app.vue
              </button>
            </div>

            <div
              class="hero-panel__pre-wrap"
              :class="{ 'hero-panel__pre-wrap--loading': highlighting && !highlightedHtml }"
            >
              <div
                v-if="highlighting && !highlightedHtml"
                class="hero-panel__loading"
              >
                Loading…
              </div>
              <div
                v-else-if="highlightedHtml"
                class="hero-panel__pre shiki-host"
                v-html="highlightedHtml"
              />
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.hero-panel {
  width: 100%;
  min-width: 0;
}

.hero-panel__shell {
  display: flex;
  flex-direction: column;
}

.hero-panel__tabs-wrap {
  padding: 0.85rem 1rem 0.65rem;
  border-bottom: 1px solid color-mix(in srgb, var(--ui-border) 65%, transparent);
}

.hero-panel__tabs :deep([data-slot='list']) {
  gap: 1rem;
  border: none;
}

.hero-panel__tabs :deep([data-slot='trigger']) {
  padding-inline: 0;
  font-weight: 500;
}

.hero-panel__body {
  position: relative;
  min-height: 20rem;
  padding: 0.85rem 1rem 1rem;
}

.hero-panel__body:has(.pg-demo--logged-in) {
  min-height: 17.5rem;
}

.hero-panel__playground--hidden {
  visibility: hidden;
  pointer-events: none;
}

.hero-panel__code {
  position: absolute;
  inset: 0.85rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-height: 0;
}

.hero-panel__code--hidden {
  visibility: hidden;
  pointer-events: none;
}

.hero-panel__files {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero-panel__file {
  padding: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ui-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
}

.hero-panel__file:hover {
  color: var(--ui-text);
}

.hero-panel__file--active {
  color: var(--ui-text-highlighted);
}

.hero-panel__pre-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--ui-bg) 40%, transparent);
}

.hero-panel__pre-wrap--loading {
  display: flex;
  align-items: flex-start;
}

.hero-panel__loading {
  padding: 0.85rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
}

.hero-panel__pre {
  margin: 0;
}

.hero-panel__pre :deep(pre.shiki) {
  margin: 0;
  padding: 0.35rem 0.25rem;
  overflow: visible;
  background: transparent !important;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 0.7;
  tab-size: 2;
}

.hero-panel__pre :deep(pre.shiki code) {
  display: block;
  white-space: pre;
}

.hero-panel__pre :deep(.line) {
  display: block;
}

.hero-panel__playground :deep(.pg-demo--compact) {
  display: flex;
  flex-direction: column;
}

.hero-panel__playground :deep(.panel),
.hero-panel__playground :deep(.auth-card),
.hero-panel__playground :deep(.profile-card) {
  border: none;
  box-shadow: none;
  background: transparent;
}

.hero-panel__playground :deep(.alert) {
  padding: 0.45rem 0;
  background: transparent;
  border: none;
  font-size: 0.8125rem;
}

.pg-demo .panel {
  padding: 0;
}
</style>
